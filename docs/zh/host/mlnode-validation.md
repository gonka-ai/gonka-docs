# 验证 ML 节点部署

在 [`gonka` 仓库](https://github.com/gonka-ai/gonka) 中提供了一个名为 `mlnode-validate` 的代理技能，用于根据特定模型的预计算诚实 PoC 向量验证已部署的 ML 节点。该技能完全包含在仓库内（无外部代码，无回调接收器）。

该技能即是合同；本页仅为指引。唯一真实来源是 [`skills/mlnode-validate/SKILL.md`](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md) —— 包含必需/可选输入、部署配置规则、黄金参考列表、通过标准、失败模式及报告模板。

该技能由 `mlnode/packages/benchmarks/scripts/poc_validation/` 下的两个 Python 脚本实现：

- `validate.py` — 主入口点（下载 → 部署 → 吞吐量 → 验证）。
- `make_artifact.py` — 从已服务目标模型的可信 MLNode 中生成新工件。当请求的模型无已提交的黄金参考时使用。

## 脚本的作用

`validate.py` 对正在运行的 ML 节点执行四个阶段，按进度打印 `[i/4]` 标题：

1. **`[1/4] download`** — 确保请求的 HuggingFace 仓库已缓存于 ML 节点上。使用 `POST /api/v1/models/status`，然后 `POST /api/v1/models/download` 并轮询 `/models/status` 直至 `DOWNLOADED`。
2. **`[2/4] deploy`** — 若 vLLM 尚未运行则启动它。`POST /api/v1/inference/up/async {model, dtype, additional_args}`，轮询 `GET /api/v1/inference/up/status` 直至 `is_running == true`。
3. **`[3/4] throughput`** — 测量全系统 PoC 吞吐量。`POST /api/v1/inference/pow/init/generate`（来自参考的参数）；代理将请求分发至每个健康的 vLLM 副本，使用不同的 `group_id`。每 `--sample-interval` 采样 `GET /api/v1/inference/pow/status` 持续 `--measure-seconds`。报告每个副本的 `nonces_per_second` 及副本总和，然后 `POST /api/v1/inference/pow/stop`。
4. **`[4/4] validate`** — 使用 `POST /api/v1/inference/pow/generate`、`wait=true`、`nonces=[...]`、`validation.artifacts=<artifact>` 及完整的 `stat_test` 块（`dist_threshold`、`p_mismatch`、`fraud_threshold`）。ML 节点重新计算相同的 nonce，执行每 nonce 的 L2 不匹配测试，然后执行二项式欺诈测试。返回 `{n_total, n_mismatch, mismatch_nonces, p_value, fraud_detected}`。

每个阶段均可通过 `--skip-download`、`--skip-deploy`、`--skip-throughput`、`--skip-validate` 跳过。

四个阶段完成后，脚本将三个文件写入 `mlnode/packages/benchmarks/data/experiments/<exp_name>_<ts>/`：

- `validate_config.json` — 仅包含解析后的输入（ML 节点 URL、模型、参考路径 + 元数据、部署配置、PoC 参数、`stat_test` 及其来源、原始 CLI 参数）。
- `validate_report.json` — 完整结构化报告（配置 + 每阶段结果 + 判定）。这是审计追踪。
- `validate_report.txt` — 简明易读的摘要；横幅后第一行为 `verdict: <PASS|FAIL|...>`。

## 必需输入

根据 [SKILL.md → 必需输入](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#required-inputs)，调用方必须提供以下两项：

- `MLNODE_URL` — 待测 ML 节点的基础 URL（例如 `http://1.2.3.4:8080`）。无默认值。
- `MODEL` — 目标 HuggingFace 模型 ID，以完整 `org/repo` 形式（例如 `MiniMaxAI/MiniMax-M2.7`、`moonshotai/Kimi-K2.6`、`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`）。无默认值。

## 部署配置：来自调用方，而非黄金参考

这是来自 [SKILL.md → 部署配置：来自调用方，而非黄金参考](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#deploy-config-from-the-caller-not-the-golden) 的关键规则：

黄金工件仅提供 **向量、PoC 参数 和 `stat_test`** —— 除此之外均不提供。其 `additional_args` 字段记录生成向量的服务器所使用的标志，仅作参考。不得将其用作不同服务器的部署默认值。

调用方传入与待测服务器 GPU 类型匹配的部署配置（通常为 `deploy/join/node-config-<model>-<gpu>.json`）。标准流程是 **生成自定义参考**，将黄金的向量 + 参数 + `stat_test` 与调用方的 `args` 结合，然后通过 `--reference` 传递：

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

该自定义参考为每部署专属，不提交。仅当待测服务器与黄金参考的记录服务器硬件类型相同时，才可直接传递黄金参考（无需生成）—— 此为例外，非默认。

CLI 标志 `--tp-size`、`--max-model-len`、`--extra-arg`、`--dtype` 用于在参考基础上进行小范围临时调整，但无法移除参考中已包含的标志——因此当部署形态与黄金参考不同时，它们不能替代生成自定义参考。

## 可用的黄金参考

根据 [SKILL.md → 可用黄金参考](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#available-golden-references)，仓库在 `mlnode/packages/benchmarks/scripts/poc_validation/artifacts/` 下提供以下内容。自动查找 `<sanitized model>.json` 会为每个模型选择默认文件名；超出默认的变体需显式指定 `--reference <path>`。

“记录上下文”列描述了生成向量的服务器（仅作参考 —— 这些标志不作为您验证的部署默认值；请参阅上方 [部署配置：来自调用方，而非黄金参考](#deploy-config-from-the-caller-not-the-golden)）。

| 模型 | 文件名 | 向量 | 记录上下文 |
|-------|----------|---------|-------------------|
| `Qwen/Qwen3-0.6B` | `qwen-qwen3-0.6b.json` | 32 | 本地开发 / 单 GPU |
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`（默认查找） | `qwen-qwen3-235b-a22b-instruct-2507-fp8.json` | 32 | tp=4，FlashInfer 基线。快速烟雾测试。 |
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`（扩展） | `qwen-qwen3-235b-a22b-instruct-2507-fp8-deepgemm.json` | 2000 | tp=2, DeepGEMM MoE 后端 (`VLLM_USE_DEEP_GEMM=1`, `VLLM_MOE_USE_DEEP_GEMM=1`)，在 4xB200 上记录。使用 `--reference` 通过。 |
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` (pubkey-v2) | `qwen-qwen3-235b-a22b-instruct-2507-fp8-h200-pubkey-v2.json` | 200 | tp=4，在 4xH200 上使用 `public_key=test_pub_keys_v2` 记录。使用 `--reference` 通过。 |
| `MiniMaxAI/MiniMax-M2.7` (默认查找) | `minimaxai-minimax-m2.7.json` | 200 | tp=2, FLASHINFER 注意力机制，fp8 kv-cache，最大模型长度 180000，`--trust-remote-code`，minimax_m2 工具/推理解析器。在 2xH200 上记录。 |
| `moonshotai/Kimi-K2.6` (默认查找) | `moonshotai-kimi-k2.6.json` | 200 | tp=4 + 专家并行，FLASHINFER_MLA 注意力机制，gpu-mem 0.95，最大模型长度 240000，kimi_k2 工具/推理解析器，`--disable-custom-all-reduce`，`--trust-remote-code`。在 4xB200 上记录。 |

对于 Qwen3-235B，相同模型 ID 有多个引用，测试不同的代码路径（tp-size、MoE 后端、public_key）——详见 SKILL.md 中推荐的多运行模式。

## 预置部署配置位于 `deploy/join/`

该仓库为每个已批准的模型提供匹配常见 GPU 类型的 `node-config-*.json` 文件：

- `deploy/join/node-config-qwen235B-B200.json`
- `deploy/join/node-config-kimik26-B200.json`
- `deploy/join/node-config-kimik26-H200.json`
- `deploy/join/node-config-minimax-A100.json`
- `deploy/join/node-config-minimax-H100.json`
- `deploy/join/node-config-minimax-H200.json`
- `deploy/join/node-config-minimax-B200.json`

这些配置也在 [Host 快速入门](./quickstart.md) 中内联重现。

## 通过标准

根据 [SKILL.md → 通过标准](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#pass-criteria)：

- **干净通过** — `validation.passed == true`，`validation.has_mismatches == false`，`n_mismatch == 0`，`fraud_detected == false`。
- **在统计测试容差内存在不匹配时通过** — `validation.passed == true`，`validation.has_mismatches == true`，`n_mismatch > 0`，`fraud_detected == false`。欺诈测试允许每个 `p_mismatch` 最多出现几个不匹配。这仍视为通过。
- **失败** — `validation.passed == false`，`fraud_detected == true`。

退出码：

- `0` — 通过（无论是否在容差内存在不匹配），或验证阶段被跳过。
- `2` — 验证运行且欺诈测试触发。
- `1` — 验证运行前发生严重错误（下载失败、部署超时等）。

## 当请求的模型不存在工件时

`validate.py` 在 `mlnode/packages/benchmarks/scripts/poc_validation/artifacts/` 下查找工件。如果 `MODEL` 的文件缺失，脚本将退出 `1` 并打印预期的文件名以及用于在已服务该模型的可信 MLNode 上生成该文件的确切 `make_artifact.py` 命令。代理不得自行生成向量或替换为其他模型——详见 [SKILL.md → 当请求的模型不存在工件时](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#when-no-artifact-exists-for-the-requested-model)。

## 相关指南

- [Host 快速入门](./quickstart.md) — 每个支持的模型和 GPU 类型的初始部署和 `node-config.json` 示例。
- [ML Node 管理](./mlnode-management.md) — 通过管理 API 添加/更新/启用/禁用 ML Node。
- [基准测试以选择 LLM 最优部署配置](./benchmark-to-choose-optimal-deployment-config-for-llms.md) — 通过 `compressa-perf` 进行性能调优（TP / PP）。
- [Kimi K2.6 启动](./kimi-bootstrap.md) / [MiniMax-M2.7 启动](./minimax-bootstrap.md) / [DeepSeek V4 Flash 启动](./deepseek-bootstrap.md) — 链上启动时间线和 `PoCIntent` / 委托交易。
