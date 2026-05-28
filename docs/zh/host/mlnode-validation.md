# 验证 ML 节点部署

[`gonka` 仓库](https://github.com/gonka-ai/gonka)中提供了一个名为 `mlnode-validate` 的智能体技能（agent skill），用于在特定模型上对已部署的 ML 节点进行验证，将其输出与预先计算的诚实 PoC 向量比对。该技能自包含于仓库内部（无外部代码，无回调接收方）。

该技能的**契约**位于 [`skills/mlnode-validate/SKILL.md`](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md) — 必填 / 可选输入、部署配置规则、黄金参考列表、通过判定标准、失败模式、报告模板的唯一权威来源。本页只是指引。

技能由位于 `mlnode/packages/benchmarks/scripts/poc_validation/` 下的两个 Python 脚本实现：

- `validate.py` — 主入口（download → deploy → throughput → validate）。
- `make_artifact.py` — 当请求的模型尚无已提交的黄金参考时，针对一个已经服务该模型的可信 MLNode 烘焙一个新的 artifact。

## 脚本做什么

`validate.py` 针对正在运行的 ML 节点执行四个阶段，在运行过程中输出 `[i/4]` 头部：

1. **`[1/4] download`** — 确保所请求的 HuggingFace 仓库已在 ML 节点上缓存。使用 `POST /api/v1/models/status`，必要时 `POST /api/v1/models/download` 并轮询 `/models/status` 直到 `DOWNLOADED`。
2. **`[2/4] deploy`** — 若 vLLM 尚未运行则启动。`POST /api/v1/inference/up/async {model, dtype, additional_args}`，轮询 `GET /api/v1/inference/up/status` 直到 `is_running == true`。
3. **`[3/4] throughput`** — 测量整套系统的 PoC 吞吐量。`POST /api/v1/inference/pow/init/generate`（参数取自 reference）；代理向每个健康的 vLLM 副本扇出不同的 `group_id`。按 `--sample-interval` 采样 `GET /api/v1/inference/pow/status` 持续 `--measure-seconds`。报告每副本的 `nonces_per_second` 以及跨副本总和，然后 `POST /api/v1/inference/pow/stop`。
4. **`[4/4] validate`** — `POST /api/v1/inference/pow/generate`，带 `wait=true`、`nonces=[...]`、`validation.artifacts=<artifact>` 以及完整的 `stat_test` 块（`dist_threshold`、`p_mismatch`、`fraud_threshold`）。ML 节点重新计算相同的 nonce，运行 L2 单 nonce 不匹配检测，然后是二项式欺诈检测。返回 `{n_total, n_mismatch, mismatch_nonces, p_value, fraud_detected}`。

可分别通过 `--skip-download`、`--skip-deploy`、`--skip-throughput`、`--skip-validate` 跳过任一阶段。

四个阶段完成后，脚本将三个文件写入 `mlnode/packages/benchmarks/data/experiments/<exp_name>_<ts>/`：

- `validate_config.json` — 仅解析后的输入（ML 节点 URL、模型、参考路径 + 元数据、部署配置、PoC 参数、带来源的 `stat_test`、原始 CLI 参数）。
- `validate_report.json` — 完整的结构化报告（配置 + 每阶段结果 + 结论）。审计跟踪。
- `validate_report.txt` — 简短的人类可读摘要；横幅之后的第一行即 `verdict: <PASS|FAIL|...>`。

## 必填输入

依据 [SKILL.md → Required inputs](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#required-inputs)，调用方必须同时提供：

- `MLNODE_URL` — 被测 ML 节点的基础 URL（例如 `http://1.2.3.4:8080`）。无默认值。
- `MODEL` — 目标 HuggingFace 模型 id，完整 `org/repo` 形式（例如 `MiniMaxAI/MiniMax-M2.7`、`moonshotai/Kimi-K2.6`、`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`）。无默认值。

## 部署配置：来自调用方，而非来自 golden

这是 [SKILL.md → Deploy config: from the caller, not the golden](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#deploy-config-from-the-caller-not-the-golden) 中的一条关键规则：

golden artifact 只提供 **向量、PoC 参数和 `stat_test`**——仅此而已。其中的 `additional_args` 字段记录了生成这些向量的那台服务器上使用的标志，**仅供参考**，**不能**作为另一台服务器上的部署默认值。

调用方传入与被测服务器 GPU 类匹配的部署配置（通常为 `deploy/join/node-config-<model>-<gpu>.json`）。标准流程是**烘焙一个自定义 reference**，把 golden 的 vectors + params + `stat_test` 与调用方的 `args` 组合在一起，然后通过 `--reference` 传入：

```python
import json, pathlib
src = pathlib.Path('mlnode/packages/benchmarks/scripts/poc_validation/artifacts/<golden>.json')
node_cfg = json.loads(pathlib.Path('deploy/join/node-config-<model>-<gpu>.json').read_text())

d = json.loads(src.read_text())
d['additional_args'] = list(node_cfg[0]['models']['<HF model id>']['args'])
d['source'] = f"vectors from {src.name}; additional_args from deploy/join/node-config-<model>-<gpu>.json"
dst = src.with_name(src.stem + '-<gpu>.json')
dst.write_text(json.dumps(d, indent=2))
```

```bash
python3 mlnode/packages/benchmarks/scripts/poc_validation/validate.py \
    --mlnode-url "$MLNODE_URL" --model "$MODEL" --reference <dst>
```

自定义 reference 是按部署一次性的，不提交到仓库。仅当被测服务器与生成 golden 的服务器属于同一硬件类时，才可以直接传 golden（无需烘焙）——这是例外，不是默认。

CLI 标志 `--tp-size`、`--max-model-len`、`--extra-arg`、`--dtype` 用于在已有 reference 之上做小幅一次性微调，但它们**无法移除** reference 已经携带的标志——因此当部署形态与 golden 的录制形态不同时，它们不能替代烘焙自定义 reference。

## 可用的黄金参考

依据 [SKILL.md → Available golden references](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#available-golden-references)，仓库在 `mlnode/packages/benchmarks/scripts/poc_validation/artifacts/` 下提供以下 reference。自动查找 `<sanitized model>.json` 为每个模型挑选默认文件；超出默认范围的变体需要显式 `--reference <path>`。

"Recording context" 列描述生成向量的那台服务器（**仅供参考**——这些标志**不是**你做验证时的部署默认值；参见上面的「部署配置：来自调用方，而非来自 golden」一节）。

| 模型 | 文件名 | 向量数 | Recording context |
|------|--------|--------|--------------------|
| `Qwen/Qwen3-0.6B` | `qwen-qwen3-0.6b.json` | 32 | 本地开发 / 单 GPU |
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`（默认查找） | `qwen-qwen3-235b-a22b-instruct-2507-fp8.json` | 32 | tp=4，FlashInfer 基线。快速 smoke 测试。 |
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`（扩展） | `qwen-qwen3-235b-a22b-instruct-2507-fp8-deepgemm.json` | 2000 | tp=2，DeepGEMM MoE 后端（`VLLM_USE_DEEP_GEMM=1`，`VLLM_MOE_USE_DEEP_GEMM=1`），录制于 4xB200。需 `--reference` 传入。 |
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`（pubkey-v2） | `qwen-qwen3-235b-a22b-instruct-2507-fp8-h200-pubkey-v2.json` | 200 | tp=4，录制于 4xH200，`public_key=test_pub_keys_v2`。需 `--reference` 传入。 |
| `MiniMaxAI/MiniMax-M2.7`（默认查找） | `minimaxai-minimax-m2.7.json` | 200 | tp=2，FLASHINFER attention，fp8 kv-cache，max-model-len 180000，`--trust-remote-code`，minimax_m2 tool / reasoning parsers。录制于 2xH200。 |
| `moonshotai/Kimi-K2.6`（默认查找） | `moonshotai-kimi-k2.6.json` | 200 | tp=4 + expert-parallel，FLASHINFER_MLA attention，gpu-mem 0.95，max-model-len 240000，kimi_k2 tool / reasoning parsers，`--disable-custom-all-reduce`，`--trust-remote-code`。录制于 4xB200。 |

对于 Qwen3-235B，同一模型 id 有多个 reference，分别走不同代码路径（tp-size、MoE 后端、public_key）——具体的多次运行建议见 SKILL.md。

## `deploy/join/` 中现成的部署配置

仓库提供与每个已批准模型在常见 GPU 类上匹配的 `node-config-*.json`：

- `deploy/join/node-config-qwen235B-B200.json`
- `deploy/join/node-config-kimik26-B200.json`
- `deploy/join/node-config-kimik26-H200.json`
- `deploy/join/node-config-minimax-A100.json`
- `deploy/join/node-config-minimax-H100.json`
- `deploy/join/node-config-minimax-H200.json`
- `deploy/join/node-config-minimax-B200.json`

这些配置也在[主机快速入门](./quickstart.md)中以内联形式给出。

## 通过判定标准

依据 [SKILL.md → Pass criteria](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#pass-criteria)：

- **Clean PASS** — `validation.passed == true`，`validation.has_mismatches == false`，`n_mismatch == 0`，`fraud_detected == false`。
- **PASS with mismatches within stat-test tolerance** — `validation.passed == true`，`validation.has_mismatches == true`，`n_mismatch > 0`，`fraud_detected == false`。欺诈检测在 `p_mismatch` 容差内允许少量不匹配，仍判为 PASS。
- **FAIL** — `validation.passed == false`，`fraud_detected == true`。

退出码：

- `0` — PASS（带或不带容差内不匹配），或 validate 阶段被跳过。
- `2` — validation 已运行且欺诈检测触发。
- `1` — validation 能运行之前出现硬错误（下载失败、部署超时等）。

## 当请求的模型没有 artifact 时

`validate.py` 在 `mlnode/packages/benchmarks/scripts/poc_validation/artifacts/` 下查找 artifact。若 `MODEL` 对应文件缺失，脚本以 `1` 退出并打印期望的文件名以及用于针对已经在服务 `MODEL` 的可信 MLNode 烘焙一个 artifact 的精确 `make_artifact.py` 命令。智能体**不得**自行生成向量或替换为其他模型——见 [SKILL.md → When no artifact exists for the requested model](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#when-no-artifact-exists-for-the-requested-model)。

## 相关指南

- [主机快速入门](./quickstart.md) — 初始部署，以及面向每个受支持模型和 GPU 类的 `node-config.json` 示例。
- [ML 节点管理](./mlnode-management.md) — 通过管理 API 添加 / 更新 / 启用 / 禁用 ML 节点。
- [选择 LLM 最佳部署配置的基准测试](./benchmark-to-choose-optimal-deployment-config-for-llms.md) — 通过 `compressa-perf` 进行性能调优（TP / PP）。
