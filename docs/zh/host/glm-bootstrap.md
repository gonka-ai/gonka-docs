# GLM-5.3-Flash Bootstrap

`zai-org/GLM-5.3-Flash` 是 Gonka 主网上的一个治理批准的 PoC 模型，自 [提案 101](../network-updates.md#proposal-101) 起生效。其 `penalty_start_epoch` 为 **394**。该组处于启动阶段：它出现在该周期的 `sub_group_models` 中，但尚未出现在 `confirmation_weight_scales` 中，因此尚未产生共识权重。有关当前部署默认值（包括 `node-config.json`），请参阅 [Host 快速入门](./quickstart.md)。

有关多模型 PoC 机制的更广泛背景，请参阅 [多模型 PoC](./multi_model_poc.md)。其他模型的启动及其机制记录在 [MiniMax-M2.7 Bootstrap](./minimax-bootstrap.md)、[DeepSeek V4 Flash Bootstrap](./deepseek-bootstrap.md) 和 [Kimi K2.6 Bootstrap](./kimi-bootstrap.md)（历史记录）中。

!!! warning "GLM 的每模型参与从第 394 个周期开始生效"
    从第 **394** 个周期起，未明确选择 `zai-org/GLM-5.3-Flash` 的主机将面临每个周期 15% 的 `no_participation_penalty` 惩罚。如果您将提供它，请提交 `PoCIntent` 并部署。如果您不提供，请提交 **委托**（如果您信任 GLM 主机则优先）或 **拒绝**。拒绝可避免 15% 的遗漏，但仍会应用 10% 的 `refusal_penalty`。已选择 DIRECT、DELEGATE 或 REFUSE 的主机无需重新提交。

!!! warning "MLNode 3.1.0 / vLLM 0.28 / CUDA 13"
    GLM-5.3-Flash 需要 **vLLM 0.28** 和 **CUDA 13** 驱动（580+）。使用镜像 `ghcr.io/gonka-ai/mlnode:3.1.0-vllm-0.28.0`（`sha256:25cccf7d9954678550e47a1f09f12d3db140803e9cd6c289f3af25d34ceabda0`）。请**不要**使用 `3.0.17` 运行 GLM —— 该镜像包含一个永远不会验证的批次首 PoC 工件。节点配置和黄金参考位于 [`feat/glm-5-3-flash-release`](https://github.com/gonka-ai/gonka/tree/feat/glm-5-3-flash-release/deploy/join) 分支（[gonka-ai/gonka#1734](https://github.com/gonka-ai/gonka/pull/1734)）。

## 治理背景（提案 101）

提案 101 将 GLM-5.3-Flash 注册为治理批准的模型，并将其添加到 PoC 模型集中。它从 `poc_params.models` 中移除了 `moonshotai/Kimi-K2.6` 和 `zai-org/GLM-5.2-FP8`。这两个 ID 仍保留在 `GET /v1/governance/models`（推理目录）中，但不再是 PoC 模型。`MiniMaxAI/MiniMax-M2.7` 和 `deepseek-ai/DeepSeek-V4-Flash-0731` 保持不变。

该模型及其参数由 kaitaku.ai 团队提出，由 vbgd0 独立验证，并联合提出。发布输入、测量数据及阈值设定的推理依据见 [gonka-ai/gonka#1734](https://github.com/gonka-ai/gonka/pull/1734)。

链上实时值（在任何后续治理变更后请核实）：

- 模型：`zai-org/GLM-5.3-Flash`（固定版本 `04c4e9e95c5da8862dced7e5056455116f83a7e0`）
- PoC：`seq_len` 1024，`dist_threshold` 0.44，`p_mismatch` 0.10，`p_value_threshold` 0.05，`weight_scale_factor` **0.62**
- 推理：`validation_threshold` 0.951，`v_ram` 560，`throughput_per_nonce` 1500
- `penalty_start_epoch` **394**
- 投票于 **2026 年 9 月 10 日 23:17 UTC** 结束；提案通过

`weight_scale_factor` 已校准，使得 B200 主机将其 PoC 模型切换为 GLM-5.3-Flash 时，预期将获得约 7% 的权重提升。对于其他 GPU，最优模型不变。

确认实时 GLM 条目：

```bash
curl -s "https://node3.gonka.ai/chain-api/productscience/inference/inference/params" \
  | jq '.params.poc_params.models[] | select(.model_id=="zai-org/GLM-5.3-Flash")'
```

## 时间线

错过 GLM-5.3-Flash 的惩罚从 **周期 `394`** 开始。每个周期，链会尝试启动该模型：在该周期 PoC 阶段前 500 个区块（`BootstrapDelegationSnapshot`）捕获一个快照，根据 `delegation_params.deploy_window` 直接提交者和总网络权重的 `V_min = 3` 比例（通过 INTENT + DELEGATE 可达性）评估预资格，并（若预合格）在该周期启动 GLM 的 PoC。

提案 101 保留当前委托阈值：`w_threshold = 0.1`、`v_min = 3`、`no_participation_penalty = 0.15`、`refusal_penalty = 0.1`。仍请从链上读取实时值：

```bash
curl -s "https://node3.gonka.ai/chain-api/productscience/inference/inference/params" \
  | jq '.params.delegation_params | {deploy_window, w_threshold, v_min, no_participation_penalty, refusal_penalty}'
# Decimal fields use {value, exponent}: e.g. {"value":"1","exponent":-1} → 0.1 (10%).
```

要计算任何给定评估周期的确切区块编号，请以实时当前 `poc_start_block_height` 为锚点——不要从 `epoch_shift` 重建：

```bash
NODE=https://node3.gonka.ai

PARAMS=$(curl -s "$NODE/chain-api/productscience/inference/inference/params")
EPOCH_LENGTH=$(echo "$PARAMS" | jq -r '.params.epoch_params.epoch_length | tonumber')

CURRENT=$(curl -s "$NODE/v1/epochs/current/participants" | jq '.active_participants')
CURRENT_EPOCH=$(echo "$CURRENT" | jq -r '.epoch_id')
CURRENT_POC_START=$(echo "$CURRENT" | jq -r '.poc_start_block_height')

EPOCH=394                   # change to any target epoch
POC_START=$(( CURRENT_POC_START + (EPOCH - CURRENT_EPOCH) * EPOCH_LENGTH ))
SNAPSHOT_BLOCK=$(( POC_START - 500 ))

echo "Epoch $EPOCH (current $CURRENT_EPOCH): snapshot at block $SNAPSHOT_BLOCK, PoC starts at block $POC_START"
```

资格（共识权重）是独立于“列在 `poc_params`”和实时服务的检查。每次 PoC 后，请确认：

- `poc_params.models` —— 批准的 PoC 目录
- 该周期的 `sub_group_models` 和 `confirmation_weight_scales` —— 该组是否运行了 PoC 以及是否产生共识权重
- `/v1/epochs/current/participants` —— 谁正在提供服务

### 可能的情形

1. **在某周期快照中 GLM 未通过预评估**（且在 PoC 中仍无资格）：

    - 所有提交 `PoCIntent` 的人保持其全部权重（无惩罚）
    - 所有提交 `PoCDelegation` 的人保持其全部权重（无惩罚）
    - **从周期 `394` 开始**：所有未提交者每个周期损失 **15%** 权重（`no_participation_penalty`）；`PoCRefusal` 可避免 15% 的损失，但仍适用 `refusal_penalty`（**10%**）

2. **GLM 通过预评估但未在 PoC 中获得资格**（例如 INTENT 主机未能及时部署）：

    - 实际部署 GLM 并在本周期提交 GLM PoC 提交的主机，保持其原有模型组的全部权重（无惩罚）
    - 所有提交 `PoCDelegation` 的人保持其全部权重（无惩罚）
    - **从周期 `394` 开始**：所有未提交者损失 15%；所有提交 `PoCIntent` 但未部署和提交 GLM PoC 提交者也损失 15%（`IntentMissed`）；`PoCRefusal` 仅承受 10% 的 `refusal_penalty`，而非 15% 的损失

如果 GLM 通过两项检查，惩罚遵循 [多模型 PoC](./multi_model_poc.md) 中的常规情形。

## 硬件与共识权重

GLM-5.3-Flash 注册为 `v_ram = 560`（每个实例约 **560 GB 总 VRAM**）。实时 `weight_scale_factor` 为 **0.62**。模型系数仅在该组有资格（具有投票权）时才产生共识权重。请检查 `poc_params` 和 `confirmation_weight_scales`。

实际影响（来自提案校准；请确认实时系数）：

- **B200 拥有者**：GLM 是预期的切换目标。B200 主机将其 PoC 模型切换为 GLM-5.3-Flash 时，预期将获得约 7% 的权重提升。使用 `node-config-glm53flash-B200.json`（TP=4）。
- **B300 用户**：在当前系数下，DeepSeek V4 Flash 仍是权重最高的选项。GLM 可适配 2×B300（`node-config-glm53flash-B300.json`），但非达到最大权重所必需。
- **H200 / H100 用户**：MiniMax M2.7 仍是这些类别的最高权重模型。GLM 配置存在（4×H200 上为 `node-config-glm53flash-H200.json`，8×H100 上为 `node-config-glm53flash-H100.json`；`node-config-glm53flash-8xH200.json` 为两个 4×H200 实例）。切换为可选操作。
- 完整系数表：[Google Sheet](https://docs.google.com/spreadsheets/d/1Tw4V7xEXR2p5MbCHqzqjS9vHXQ0eI1IHVXC6guEHnio/edit?gid=0#gid=0)

在 join `.env` 中设置 `POC_BATCH_SIZE_DEFAULT` 为：8×H100 上为 8，H200 上为 16，B200/B300 上为 32。在 NVSwitch VM 上设置 `NCCL_NVLS_ENABLE=0`。

## 为计划部署 GLM-5.3-Flash 的主机提供的说明

#### 将 `PoCIntent` 发送到链上

在目标纪元的快照区块前提交。以下示例使用 `--from` 中指定的主机密钥。如需从热密钥提交意向、委托或拒绝，请参阅 [如何从热密钥声明 PoC 意向？](../FAQ.md#how-do-i-declare-a-poc-intent-from-a-warm-key)。

```bash
export NODE=https://node3.gonka.ai/chain-rpc/
./inferenced tx inference declare-poc-intent zai-org/GLM-5.3-Flash \
  --from gonka-api-key \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

#### 预下载权重并验证可部署性

使用提案中指定的 Hugging Face 修订版本：

- `hf_repo`: `zai-org/GLM-5.3-Flash`
- `hf_commit`: `04c4e9e95c5da8862dced7e5056455116f83a7e0`
- 许可证：**MIT** — 请参阅 [模型许可证](../model-licenses.md) 和 [上游 LICENSE](https://huggingface.co/zai-org/GLM-5.3-Flash/blob/main/LICENSE)

遵循 [预下载模型权重](https://gonka.ai/host/quickstart/#server-pre-download-model-weights-to-hugging-face-cache-hf_home) 指南。在引导窗口前规划好磁盘空间和带宽——首次尝试时 Hugging Face 的速率限制可能导致资格失效。

在引导快照区块**之前**验证模型能否在您的硬件上加载。您需要：

- MLNode **3.1.0** / vLLM **0.28** / CUDA **13**（驱动 580+）
- 预配置节点配置：您的 GPU 类型（H100 / H200 / B200 / B300）对应的 `node-config-glm53flash-*.json`

链上注册 GLM 使用 `Model.ModelArgs`：

```
--max-model-len 400000
--kv-cache-dtype fp8
--enable-auto-tool-choice
--tool-call-parser glm47
--reasoning-parser glm45
--trust-remote-code
```

部署端标志（`--tensor-parallel-size`、`--gpu-memory-utilization`、`--max-num-batched-tokens`、`--block-size`、`--no-enable-flashinfer-autotune` 及锁定的 `--revision`）来自为您的硬件提供的 `node-config` —— 不要仅从链上 `ModelArgs` 自行推断。

#### 等待下一个评估纪元并检查预资格

每个评估纪元的快照区块后，链会发出 `bootstrap_model_preeligibility` 事件：

```bash
NODE=https://node3.gonka.ai
MODEL='zai-org/GLM-5.3-Flash'

HEIGHT=$(curl -sG "$NODE/chain-rpc/block_search" \
  --data-urlencode "query=\"bootstrap_model_preeligibility.model_id='$MODEL'\"" \
  | jq -r '[.result.blocks[].block.header.height|tonumber]|max')

echo "Latest snapshot at height $HEIGHT"

curl -s "$NODE/chain-rpc/block_results?height=$HEIGHT" \
  | jq --arg m "$MODEL" '
      .result.finalize_block_events[]
      | select(.type=="bootstrap_model_preeligibility")
      | (.attributes | from_entries) as $a
      | select($a.model_id==$m)
      | $a'
```

键属性是 `pre_eligible`。如果它是 `true`，则本周期链将运行 GLM PoC，您应做好部署准备。支持字段显示三项检查中哪些通过了：`meets_v_min`（≥ `V_min` 直接意图提交者）、`meets_weight_threshold`（意图权重 ≥ `W_threshold` 的 `total_network_weight`），以及 `meets_reachability`（意图 + 委托 `reachable_voting_power` 覆盖 `>2/3`）。`intent_host_count` 和 `intent_weight` 显示本周期的直接意图覆盖率。

#### 如果预合格，将模型切换为 GLM-5.3-Flash

使用与您的 GPU 类型匹配的已发布配置。Admin API 更新的示例形状（将 args 替换为您的 `node-config-glm53flash-*.json` 内容）：

```bash
curl -X POST http://localhost:9200/admin/v1/nodes \
     -H "Content-Type: application/json" \
     -d '{
       "id": "<NODE_ID>",
       "host": "<NODE_IP>",
       "inference_port": 5050,
       "poc_port": 8080,
       "max_concurrent": 500,
       "models": {
         "zai-org/GLM-5.3-Flash": {
           "args": [
             "--revision", "04c4e9e95c5da8862dced7e5056455116f83a7e0",
             "--tensor-parallel-size", "4",
             "--gpu-memory-utilization", "0.90",
             "--max-num-batched-tokens", "65536",
             "--kv-cache-dtype", "fp8",
             "--block-size", "2304",
             "--max-num-seqs", "256",
             "--no-enable-flashinfer-autotune",
             "--enable-auto-tool-choice",
             "--tool-call-parser", "glm47",
             "--reasoning-parser", "glm45",
             "--trust-remote-code"
           ]
         }
       }
     }'
```

上述示例为 B200 配置文件。合并来自 H100 / H200 / B300 已发布配置的操作符标志。PoC 开始时的成员资格由提交 PoC 存储提交者决定——仅声明意图是不够的。

#### 验证您的部署

已提交的黄金参考是 [`feat/glm-5-3-flash-release`](https://github.com/gonka-ai/gonka/tree/feat/glm-5-3-flash-release/mlnode/packages/benchmarks/scripts/poc_validation/artifacts) 分支上的 `zai-org-glm-5.3-flash.json`（在 4×H200 TP=4 上记录）。[`gonka` 仓库](https://github.com/gonka-ai/gonka) 提供了一个代理技能 `mlnode-validate`，用于将已部署的 ML Node 与预计算的诚实 PoC 向量进行验证。参见 [验证 ML Node 部署](./mlnode-validation.md) 和 [`skills/mlnode-validate/SKILL.md`](https://github.com/gonka-ai/gonka/blob/feat/glm-5-3-flash-release/skills/mlnode-validate/SKILL.md)。


## 不部署 GLM-5.3-Flash 的主机说明

保留 MiniMax 或 DeepSeek 是可以的——这些 PoC 条目未更改。GLM 的每模型参与强制执行从周期 **`394`** 开始生效。如果您未提供 GLM 服务，请提交**委托**（如果您信任某个 GLM 主机则优先选择）或**拒绝**，以免被视为遗漏该模型。拒绝可避免 15% 的遗漏惩罚，但仍需承担 10% 的 `refusal_penalty`。已选择 DIRECT、DELEGATE 或 REFUSE 的主机无需重新提交。

#### 检查您是否信任任何将部署 GLM / 发送 `PoCIntent` 的主机

```python
import time
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

NODE = "https://node3.gonka.ai"
MODEL = "zai-org/GLM-5.3-Flash"
TIMEOUT = 60
DELAY = 0.15

def session():
    s = requests.Session()
    retry = Retry(
        total=5,
        backoff_factor=0.5,
        status_forcelist=(502, 503, 504),
        allowed_methods=("GET",),
    )
    s.mount("https://", HTTPAdapter(max_retries=retry))
    s.headers["Connection"] = "close"
    return s

def weight(p):
    return int(p.get("weight") or 0)

def get_json(s, url):
    r = s.get(url, timeout=TIMEOUT)
    r.raise_for_status()
    return r.json()

s = session()

participants = get_json(s, f"{NODE}/v1/epochs/current/participants")[
    "active_participants"
]["participants"]

intents = []
with_glm_model = []
skipped = []

for p in participants:
    addr = p["index"]
    w = weight(p)
    if MODEL in (p.get("models") or []):
        with_glm_model.append((addr, w))

    try:
        resp = get_json(
            s,
            f"{NODE}/chain-api/productscience/inference/inference/poc_delegation/{addr}",
        )
    except requests.RequestException as e:
        skipped.append((addr, w, str(e)))
        time.sleep(DELAY)
        continue

    for i in resp.get("intents") or []:
        if i.get("model_id") == MODEL:
            intents.append((addr, w))
    time.sleep(DELAY)

total = sum(weight(p) for p in participants)
intent_weight = sum(w for _, w in intents)

nonzero_intents = [(a, w) for a, w in intents if w > 0]
zero_intents = [(a, w) for a, w in intents if w == 0]

print(f"Active participants: {len(participants)}")
print(f"With {MODEL} in models[]: {len(with_glm_model)} (not same as intent)")
print()
print("Intent from (PoCDirectIntent on chain):")
for addr, w in nonzero_intents:
    print(f"  {addr} : {w}")
if zero_intents:
    print()
    print("Zero-weight intents (count toward V_min, contribute 0 to W_threshold):")
    for addr, _ in zero_intents:
        print(f"  {addr} : 0")
print()
print(f"Intent weight: {intent_weight} / {total}")
if total:
    print(f"Intent share: {100.0 * intent_weight / total:.2f}%")
if skipped:
    print()
    print(f"Skipped {len(skipped)} participants after retries (intent may be undercounted):")
    for addr, w, err in skipped:
        print(f"  {addr} (weight={w}): {err}")
```

引导时委托：**不要委托给守护节点**；将权重分散到独立的 GLM 主机上。有关更新的委托指南，请参见 [多模型 PoC](./multi_model_poc.md)。

#### 发送委托或拒绝

委托：

```bash
export NODE=https://node3.gonka.ai/chain-rpc/
./inferenced tx inference set-poc-delegation zai-org/GLM-5.3-Flash <DELEGATEE> \
  --from gonka-account-key \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

拒绝：

```bash
export NODE=https://node3.gonka.ai/chain-rpc/
./inferenced tx inference refuse-poc-delegation zai-org/GLM-5.3-Flash \
  --from gonka-account-key \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```
