# 验证ML节点部署

仓库[`gonka`](https://github.com/gonka-ai/gonka)附带一个名为`mlnode-validate`的代理技能，用于将已部署的ML节点与特定模型的预计算诚实PoC向量进行验证。该技能完全内置于仓库中（无外部代码，无回调接收器）。

该技能即为契约；本页仅为指引。唯一真实来源是[`skills/mlnode-validate/SKILL.md`](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md)——包含必需/可选输入、部署配置规则、黄金参考列表、通过标准、失败模式及报告模板。

该技能由`mlnode/packages/benchmarks/scripts/poc_validation/`下的两个Python脚本实现：

- `validate.py`——主入口点（下载→部署→吞吐量→验证）。
- `make_artifact.py`——从已服务目标模型的可信MLNode中生成新工件。当请求的模型无已提交的黄金参考时使用。

## 脚本的作用

`validate.py`对运行中的ML节点执行四个阶段，并在进展过程中打印`[i/4]`标题：

1. **`[1/4] download`**——确保请求的HuggingFace仓库已缓存在ML节点上。使用`POST /api/v1/models/status`，然后`POST /api/v1/models/download`并轮询`/models/status`直至`DOWNLOADED`。
2. **`[2/4] deploy`**——若vLLM尚未运行则启动它。`POST /api/v1/inference/up/async {model, dtype, additional_args}`，轮询`GET /api/v1/inference/up/status`直至`is_running == true`。
3. **`[3/4] throughput`**——测量全系统PoC吞吐量。`POST /api/v1/inference/pow/init/generate`（来自参考的参数）；代理将请求分发至每个健康的vLLM副本，使用不同的`group_id`。每`--sample-interval`采样`GET /api/v1/inference/pow/status`持续`--measure-seconds`。报告每个副本的`nonces_per_second`及副本总和，然后`POST /api/v1/inference/pow/stop`。
4. **`[4/4] validate`**——使用`POST /api/v1/inference/pow/generate`、`wait=true`、`nonces=[...]`、`validation.artifacts=<artifact>`及完整的`stat_test`块（`dist_threshold`、`p_mismatch`、`fraud_threshold`）。ML节点重新计算相同的nonce，执行每nonce的L2不匹配测试，然后执行二项式欺诈测试。返回`{n_total, n_mismatch, mismatch_nonces, p_value, fraud_detected}`。

每个阶段均可通过`--skip-download`、`--skip-deploy`、`--skip-throughput`、`--skip-validate`跳过。

四个阶段完成后，脚本将三个文件写入`mlnode/packages/benchmarks/data/experiments/<exp_name>_<ts>/`：

- `validate_config.json`——仅包含解析后的输入（ML节点URL、模型、参考路径+元数据、部署配置、PoC参数、带出处的`stat_test`、原始CLI参数）。
- `validate_report.json`——完整结构化报告（配置+各阶段结果+结论）。这是审计追踪。
- `validate_report.txt`——简明易读的摘要；横幅后第一行是`verdict: <PASS|FAIL|...>`。

## 必需输入

根据[SKILL.md → 必需输入](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#required-inputs)，调用方必须提供以下两项：

- `MLNODE_URL`——待测ML节点的基础URL（例如`http://1.2.3.4:8080`）。无默认值。
- `MODEL`——目标HuggingFace模型ID，采用完整`org/repo`格式（例如`MiniMaxAI/MiniMax-M2.7`、`deepseek-ai/DeepSeek-V4-Flash-0731`、`zai-org/GLM-5.3-Flash`）。无默认值。

## 部署配置：来自调用方，而非黄金参考

这是来自[SKILL.md → 部署配置：来自调用方，而非黄金参考](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#deploy-config-from-the-caller-not-the-golden)的关键规则：

黄金工件仅提供**向量、PoC参数和`stat_test`**——除此之外无其他内容。其`additional_args`字段记录生成向量的服务器所使用的标志，仅作参考。不得将其用作不同服务器的部署默认值。

调用方传递与待测服务器GPU类别匹配的部署配置（通常为`deploy/join/node-config-<model>-<gpu>.json`）。标准流程是**生成一个自定义参考**，结合黄金的向量+参数+`stat_test`与调用方的`args`，然后通过`--reference`传递：

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

该自定义参考是按部署生成的，不提交。仅当待测服务器与黄金参考的记录服务器属于相同硬件类别时，才可直接传递黄金参考（无需生成）——这是例外，而非默认。

CLI标志`--tp-size`、`--max-model-len`、`--extra-arg`、`--dtype`用于在参考基础上进行小范围临时调整，但无法移除参考已包含的标志——因此当部署形态与黄金参考不同时，它们不能替代生成自定义参考。

## 可用的黄金参考

根据[SKILL.md → 可用黄金参考](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#available-golden-references)，仓库在`mlnode/packages/benchmarks/scripts/poc_validation/artifacts/`下提供以下内容。自动查找`<sanitized model>.json`会为每个模型选择默认文件名；超出默认的变体需显式指定`--reference <path>`。

"记录上下文"列描述了生成向量的服务器（仅作参考——这些标志不作为您验证的部署默认值；参见上文[部署配置：来自调用方，而非黄金参考](#deploy-config-from-the-caller-not-the-golden)）。

!!! note Qwen黄金参考不是主网模型
    `Qwen/Qwen3-0.6B`是本地开发测试用例。`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`已在[提案78](../network-updates.md#june-25-2026)（第308个周期）中从主网移除。这些工件保留在仓库中用于历史或本地检查。加入主网的主机应验证其实际部署的模型。

| 模型 | 文件名 | 向量 | 记录上下文 |
|-------|----------|---------|-------------------|
| `Qwen/Qwen3-0.6B` | `qwen-qwen3-0.6b.json` | 32 | 本地开发/单GPU |
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`（默认查找） | `qwen-qwen3-235b-a22b-instruct-2507-fp8.json` | 32 | tp=4, FlashInfer baseline. Quick smoke test. |
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` (extended) | `qwen-qwen3-235b-a22b-instruct-2507-fp8-deepgemm.json` | 2000 | tp=2, DeepGEMM MoE backend (`VLLM_USE_DEEP_GEMM=1`, `VLLM_MOE_USE_DEEP_GEMM=1`), recorded on 4xB200. Pass with `--reference`. |
| `moonshotai/Kimi-K2.6` (default lookup) | `moonshotai-kimi-k2.6.json` | 200 | Historical. tp=4 + expert-parallel, FLASHINFER_MLA attention, gpu-mem 0.95, max-model-len 240000, kimi_k2 tool/reasoning parsers, `--disable-custom-all-reduce`, `--trust-remote-code`. Recorded on 4xB200. Kimi is not a PoC model after [proposal 101](../network-updates.md#proposal-101). |
| `deepseek-ai/DeepSeek-V4-Flash-0731` (default lookup) | `deepseek-ai-deepseek-v4-flash-0731.json` | 1000 | tp=1, fp8 kv-cache, max-model-len 400000, `--tokenizer-mode deepseek_v4`, deepseek_v4 tool/reasoning parsers, `--trust-remote-code`. Recorded on 1xB300 (vLLM 0.25.1). On the [`vllm-0.25.1-upgrade`](https://github.com/gonka-ai/gonka/tree/vllm-0.25.1-upgrade/mlnode/packages/benchmarks/scripts/poc_validation/artifacts) branch. |
| `zai-org/GLM-5.3-Flash` (default lookup) | `zai-org-glm-5.3-flash.json` | — | tp=4, fp8 kv-cache, `--block-size 2304`, glm47 / glm45 parsers, `--trust-remote-code`. Recorded on 4×H200 (vLLM 0.28 / MLNode 3.1.0). On the [`feat/glm-5-3-flash-release`](https://github.com/gonka-ai/gonka/tree/feat/glm-5-3-flash-release/mlnode/packages/benchmarks/scripts/poc_validation/artifacts) branch ([gonka-ai/gonka#1734](https://github.com/gonka-ai/gonka/pull/1734)). |

For Qwen3-235B the same model id has multiple references, exercising different code paths (tp-size, MoE backend) — see SKILL.md for the recommended multi-run pattern. That model is not on mainnet; use this only if you are reproducing a historical or local validation.

## Ready-made deploy configs in `deploy/join/`

The repo ships `node-config-*.json` files matching common GPU classes. DeepSeek configs and MLNode 3.0.16 are on the [`vllm-0.25.1-upgrade`](https://github.com/gonka-ai/gonka/tree/vllm-0.25.1-upgrade/deploy/join) branch:

- `deploy/join/node-config-qwen235B-B200.json` (historical Qwen3-235B layout; that model is not on mainnet)
- `deploy/join/node-config-kimik26-B200.json` (Kimi K2.6)
- `deploy/join/node-config-kimik26-H200.json` (Kimi K2.6)
- `deploy/join/node-config-minimaxm27-A100.json`
- `deploy/join/node-config-minimaxm27-H100.json`
- `deploy/join/node-config-minimaxm27-H200.json`
- `deploy/join/node-config-minimaxm27-B200.json`
- `deploy/join/node-config-minimaxm27-B300.json`
- `deploy/join/node-config-deepseekv4flash0731-H100.json`
- `deploy/join/node-config-deepseekv4flash0731-H200.json`
- `deploy/join/node-config-deepseekv4flash0731-B200.json`
- `deploy/join/node-config-deepseekv4flash0731-B300.json`
- `deploy/join/node-config-deepseekv4flash0731-B200-nvfp4.json`
- `deploy/join/node-config-deepseekv4flash0731-B300-nvfp4.json`
- `deploy/join/node-config-glm53flash-H100.json`
- `deploy/join/node-config-glm53flash-H200.json`
- `deploy/join/node-config-glm53flash-8xH200.json`
- `deploy/join/node-config-glm53flash-B200.json`
- `deploy/join/node-config-glm53flash-B300.json`

GLM configs and MLNode 3.1.0 are on the [`feat/glm-5-3-flash-release`](https://github.com/gonka-ai/gonka/tree/feat/glm-5-3-flash-release/deploy/join) branch.

These configs are also reproduced inline in the [Host Quickstart](./quickstart.md).

## Pass criteria

Per [SKILL.md → Pass criteria](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#pass-criteria):

- **Clean PASS** — `validation.passed == true`, `validation.has_mismatches == false`, `n_mismatch == 0`, `fraud_detected == false`.
- **PASS，差异在统计测试容差范围内** — `validation.passed == true`, `validation.has_mismatches == true`, `n_mismatch > 0`, `fraud_detected == false`。欺诈测试允许每个 `p_mismatch` 最多出现几个差异。这仍然是 PASS。
- **FAIL** — `validation.passed == false`, `fraud_detected == true`.

退出码：

- `0` — PASS（无论是否有容差内的差异），或验证阶段被跳过。
- `2` — 验证已运行且欺诈测试触发。
- `1` — 验证运行前发生严重错误（下载失败、部署超时等）。

## 当请求的模型不存在工件时

`validate.py` 在 `mlnode/packages/benchmarks/scripts/poc_validation/artifacts/` 下查找工件。如果 `MODEL` 的文件缺失，脚本将退出 `1` 并打印预期的文件名以及用于针对已服务该模型的可信 MLNode 生成该文件的精确 `make_artifact.py` 命令。代理不得生成向量或替换为其他模型 — 请参阅 [SKILL.md → 当请求的模型不存在工件时](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#when-no-artifact-exists-for-the-requested-model)。

## 相关指南

- [主机快速入门](./quickstart.md) — 每种支持的模型和 GPU 类型的初始部署和 `node-config.json` 示例。
- [ML 节点管理](./mlnode-management.md) — 通过管理 API 添加/更新/启用/禁用 ML 节点。
- [基准测试以选择 LLM 的最优部署配置](./benchmark-to-choose-optimal-deployment-config-for-llms.md) — 通过 `compressa-perf` 进行性能调优（TP / PP）。
- [Kimi K2.6 启动](./kimi-bootstrap.md) / [MiniMax-M2.7 启动](./minimax-bootstrap.md) / [DeepSeek V4 Flash 启动](./deepseek-bootstrap.md) / [GLM-5.3-Flash 启动](./glm-bootstrap.md) — 链上启动时间线和 `PoCIntent` / 委托交易。
