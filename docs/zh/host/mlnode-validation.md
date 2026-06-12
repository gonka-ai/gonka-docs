# 验证 ML Node 部署

[`gonka` 仓库](https://github.com/gonka-ai/gonka) 提供了一个名为 `mlnode-validate` 的代理技能，用于根据特定模型的预计算诚实 PoC 向量来验证已部署的 ML Node。该技能在仓库内自包含（无外部代码，无回调接收器）。

此技能即为合约；本页面仅为指引。唯一真实来源是 [`skills/mlnode-validate/SKILL.md`](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md) —— 包含必需/可选输入、部署配置规则、黄金参考列表、通过标准、失败模式以及报告模板。

该技能由 `mlnode/packages/benchmarks/scripts/poc_validation/` 目录下的两个 Python 脚本实现：

- `validate.py` —— 主入口点（下载 → 部署 → 吞吐量测试 → 验证）。
- `make_artifact.py` —— 从已为指定模型提供服务的可信 MLNode 生成新的构件。当请求的模型没有已提交的黄金参考时使用。

## 脚本功能说明

`validate.py` 针对正在运行的 ML Node 执行四个阶段，并在执行过程中打印 `[i/4]` 标题：

1. **`[1/4] download`** —— 确保请求的 HuggingFace 仓库已在 ML Node 上缓存。使用 `POST /api/v1/models/status`，然后调用 `POST /api/v1/models/download` 并轮询 `/models/status` 直到 `DOWNLOADED`。
2. **`[2/4] deploy`** —— 如果 vLLM 尚未运行，则启动它。`POST /api/v1/inference/up/async {model, dtype, additional_args}`，轮询 `GET /api/v1/inference/up/status` 直到 `is_running == true`。
3. **`[3/4] throughput`** —— 测量全系统 PoC 吞吐量。`POST /api/v1/inference/pow/init/generate`（参数来自参考）；代理将请求分发到每个健康的 vLLM 副本，并使用不同的 `group_id`。每隔 `--sample-interval` 采样 `GET /api/v1/inference/pow/status` 持续 `--measure-seconds`。报告每个副本的 `nonces_per_second` 及所有副本总和，然后 `POST /api/v1/inference/pow/stop`。
4. **`[4/4] validate`** —— 使用 `POST /api/v1/inference/pow/generate`、`wait=true`、`nonces=[...]`、`validation.artifacts=<artifact>` 和完整的 `stat_test` 块（`dist_threshold`、`p_mismatch`、`fraud_threshold`）进行验证。MLNode 重新计算相同的 nonce，执行 L2 每 nonce 不匹配测试，然后执行二项式欺诈测试。返回 `{n_total, n_mismatch, mismatch_nonces, p_value, fraud_detected}`。

每个阶段均可通过 `--skip-download`、`--skip-deploy`、`--skip-throughput`、`--skip-validate` 跳过。

四个阶段完成后，脚本会在 `mlnode/packages/benchmarks/data/experiments/<exp_name>_<ts>/` 目录下生成三个文件：

- `validate_config.json` —— 仅包含已解析的输入（MLNode URL、模型、参考路径
 
+ 元数据、部署配置、PoC 参数、带来源证明的 `stat_test`、原始 CLI 参数）。
- `validate_report.json` —— 完整的结构化报告（配置
 
+ 各阶段结果
 
+ 最终结论）。这是审计追踪记录。
- `validate_report.txt` —— 简短的人类可读摘要；横幅后的第一行是 `verdict: <PASS|FAIL|...>`。

## 必需输入

根据 [SKILL.md → 必需输入](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#required-inputs)，调用者必须提供以下两项：

- `MLNODE_URL` —— 被测 MLNode 的基础 URL（例如 `http://1.2.3.4:8080`）。无默认值。
- `MODEL` —— 目标 HuggingFace 模型 ID，需为完整的 `org/repo` 形式（例如 `MiniMaxAI/MiniMax-M2.7`、`moonshotai/Kimi-K2.6`、`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`）。无默认值。

## 部署配置：来自调用者，而非黄金参考

这是来自 [SKILL.md → 部署配置：来自调用者，而非黄金参考](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#deploy-config-from-the-caller-not-the-golden) 的关键规则：

黄金构件仅提供 **向量、PoC 参数 和 `stat_test`** —— 除此之外不提供任何内容。其 `additional_args` 字段仅记录生成向量时服务器所使用的标志，**仅供信息参考**。不得将其作为不同服务器上的部署默认值使用。

调用者需传入一个与被测服务器 GPU 类型匹配的部署配置（通常为 `deploy/join/node-config-<model>-<gpu>.json`）。标准流程是 **烘焙一个自定义参考**，将黄金参考的向量
 
+ 参数
 
+ `stat_test` 与调用者的 `args` 结合，然后通过 `--reference` 传入：

```python
import json, pathlib
src = pathlib.Path('mlnode/packages/benchmarks/scripts/poc_validation/artifacts/<golden>.json')
node_cfg = json.loads(pathlib.Path('deploy/join/node-config-<model>-<gpu>.json').read_text())

d = json.loads(src.read_text())
d['additional_args'] = list(node_cfg[0]['models']['<HF model id>']['args'])
d['source'] = f"vectors from {src.name}; additional_args from deploy/join/node-config-<model>-<gpu>.json"
dst = src.with_name(src.stem
 + '-<gpu>.json')
dst.write_text(json.dumps(d, indent=2))
```

```bash
python3 mlnode/packages/benchmarks/scripts/poc_validation/validate.py \
    --mlnode-url "$MLNODE_URL" --model "$MODEL" --reference <dst>
```

自定义参考（custom reference）是按部署实例划分的，且不会被提交到版本库。只有当被测服务器与黄金参考（golden reference）录制时所用的硬件类别相同时，才可直接传入黄金参考而不进行“烘焙”（baking）——这是一个例外情况，而非默认行为。

CLI 参数 `--tp-size`、`--max-model-len`、`--extra-arg`、`--dtype` 可用于在已有参考基础上进行小规模临时调整，但它们无法移除参考中已包含的标志（flag）——因此，当部署形态与黄金参考不一致时，这些参数不能替代“烘焙”一个自定义参考。

## 可用的黄金参考

根据 [SKILL.md → 可用的黄金参考](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#available-golden-references)，仓库在 `mlnode/packages/benchmarks/scripts/poc_validation/artifacts/` 目录下提供了以下黄金参考文件。自动查找机制 `<sanitized model>.json` 会根据模型选择默认文件名；若需使用非默认变体，则必须显式指定 `--reference <path>`。

“录制上下文”列描述了生成向量的服务器环境（仅作参考信息——这些配置 **不是** 你验证时的部署默认值；详见上文 [部署配置：来自调用方，而非黄金参考](#deploy-config-from-the-caller-not-the-golden)）。

| 模型 | 文件名 | 向量数量 | 录制上下文 |
| --- | --- | --- | --- |
| `Qwen/Qwen3-0.6B` | `qwen-qwen3-0.6b.json` |  |  |
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`（默认查找） |  |  |  |
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`（扩展版） |  |  |  |
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`（pubkey-v2） |  |  |  |
| `MiniMaxAI/MiniMax-M2.7`（默认查找） |  |  |  |
| `moonshotai/Kimi-K2.6`（默认查找） |  |  |  |
对于 Qwen3-235B，同一模型 ID 对应多个参考文件，用于测试不同的代码路径（如 tp-size、MoE 后端、public_key）——具体推荐的多轮运行模式请参见 SKILL.md。

## `deploy/join/` 中的现成部署配置

仓库为每个已批准的模型提供了匹配常见 GPU 类别的 `node-config-*.json` 配置文件：

- `deploy/join/node-config-qwen235B-B200.json`
- `deploy/join/node-config-kimik26-B200.json`
- `deploy/join/node-config-kimik26-H200.json`
- `deploy/join/node-config-minimax-A100.json`
- `deploy/join/node-config-minimax-H100.json`
- `deploy/join/node-config-minimax-H200.json`
- `deploy/join/node-config-minimax-B200.json`

这些配置也在 [主机快速入门指南](./quickstart.md) 中以内联形式列出。

## 通过标准

参见 [SKILL.md → 通过标准](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#pass-criteria)：

- **干净通过（Clean PASS）** — `validation.passed == true`, `validation.has_mismatches == false`, `n_mismatch == 0`, `fraud_detected == false`。
- **在统计检验容差范围内的差异仍视为通过** — `validation.passed == true`, `validation.has_mismatches == true`, `n_mismatch > 0`, `fraud_detected == false`。欺诈检测（fraud test）允许少量差异（见 `p_mismatch`）。这仍属于 **通过**。
- **失败（FAIL）** — `validation.passed == false`, `fraud_detected == true`。

退出码说明：

- `0` — 通过（无论是否存在容差内差异），或跳过了验证阶段。
- `2` — 验证已执行且触发了欺诈检测。
- `1` — 在验证运行前发生严重错误（如下载失败、部署超时等）。

## 当请求的模型没有对应制品时

`validate.py` 会在 `mlnode/packages/benchmarks/scripts/poc_validation/artifacts/` 下查找对应制品。如果 `MODEL` 的文件缺失，脚本将退出并返回 `1`，同时打印预期的文件名以及用于在可信 MLNode 上“烘焙”该参考的完整 `make_artifact.py` 命令。代理（agent）不得自行伪造向量或替换为其他模型——详见 [SKILL.md → 当请求的模型无对应制品时](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#when-no-artifact-exists-for-the-requested-model)。

## 相关指南

- [主机快速入门](./quickstart.md) — 所有支持模型和 GPU 类别的初始部署及 `node-config.json` 使用示例。
- [ML 节点管理](./mlnode-management.md) — 通过管理 API 添加 / 更新 / 启用 / 禁用 ML 节点。
- [为大语言模型选择最优部署配置的基准测试](./benchmark-to-choose-optimal-deployment-config-for-llms.md) — 使用 `compressa-perf` 进行性能调优（TP / PP）。
- [Kimi K2.6 引导流程](./kimi-bootstrap.md) / [MiniMax-M2.7 引导流程](./minimax-bootstrap.md) — 链上引导时间线及 `PoCIntent` / 委托交易说明。
