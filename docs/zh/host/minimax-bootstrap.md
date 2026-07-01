# MiniMax-M2.7 Bootstrap

`MiniMaxAI/MiniMax-M2.7` (FP8) 被作为 `v0.2.13` 升级中第三个获治理批准的推理模型添加。本文档解释了如何在启动过程中最大限度地减少权重降低的可能性，无论该模型在首次尝试中是否获得足够参与者。

有关当前部署默认值（包括 `node-config.json`），请参阅 [Host Quickstart](./quickstart.md)。有关多模型PoC机制的更广泛背景，请参阅 [Multi-Model PoC](./multi_model_poc.md)。先前模型的启动及其机制记录在 [Kimi K2.6 Bootstrap](./kimi-bootstrap.md) 中。

!!! note 
    启动可能需要多个纪元，具体取决于有多少参与者准备就绪。在配置的惩罚纪元之前，如果参与者明确提交了选择，并且计划部署的主机提交了 `PoCIntent`，则不会发生权重降低。


## 时间线

对未使用 MiniMax-M2.7 的惩罚从 **纪元 `278`** 开始。从升级激活起，每个纪元，链都会尝试启动该模型：它在该纪元的PoC阶段之前捕获 `BootstrapDelegationSnapshot` 500 个区块（即 `DeployWindow`），根据 `V_min = 3` 直接提交者和总网络权重中 `W_threshold` 的比例（通过 INTENT + DELEGATE 实现 `>2/3` 可达性）评估预资格，并（若预合格）在该纪元启动 MiniMax 的PoC。

当前的 `W_threshold` 是一个治理参数——请从链上读取，而非硬编码值（GIP-48 已将其从 `0.3` 降低至 `0.1`，未来可能再次更改）：

```bash
curl -s "https://node3.gonka.ai/chain-api/productscience/inference/inference/params" \
  | jq '.params.delegation_params.w_threshold'
# {value, exponent} encodes a decimal: e.g. {"value":"1","exponent":-1} → 0.1 (10%).
```

要计算任何给定评估纪元的确切区块编号，请以链上当前纪元为锚点进行前向推算。`epoch_shift` 参数不锚定创世块（它会因过去纪元长度的变化而过时），因此 `epoch_shift + N * epoch_length` 在主网上是错误的——始终以实时的当前 PoC_start 为锚点：

```bash
NODE=https://node3.gonka.ai

PARAMS=$(curl -s "$NODE/chain-api/productscience/inference/inference/params")
EPOCH_LENGTH=$(echo "$PARAMS" | jq -r '.params.epoch_params.epoch_length | tonumber')

CURRENT=$(curl -s "$NODE/v1/epochs/current/participants" | jq '.active_participants')
CURRENT_EPOCH=$(echo "$CURRENT" | jq -r '.epoch_id')
CURRENT_POC_START=$(echo "$CURRENT" | jq -r '.poc_start_block_height')

EPOCH=278                   # change to any target epoch
POC_START=$(( CURRENT_POC_START + (EPOCH - CURRENT_EPOCH) * EPOCH_LENGTH ))
SNAPSHOT_BLOCK=$(( POC_START - 500 ))

echo "Epoch $EPOCH (current $CURRENT_EPOCH): snapshot at block $SNAPSHOT_BLOCK, PoC starts at block $POC_START"
```

当参与主机及其委托覆盖阈值时，MiniMax 最早成为预合格。


### 可能的情形

MiniMax-M2.7 的启动可能遵循以下主要情形：

1. **MiniMax 在某纪元快照中未通过预评估**（且在PoC中仍不合格）：

    - 所有提交了 `PoCIntent` 的人保留其全部权重（无惩罚）
    - 所有提交了 `PoCDelegation` / `PoCRefusal` 的人保留其全部权重（无惩罚）
    - **在纪元 `278` 之前**：所有未提交者也保留其全部权重（在宽限期期间惩罚被抑制）
    - **从纪元 `278` 开始**：所有未提交者每个纪元损失15%的权重（每错过一个模型）

=> 在纪元 `278` 之前明确发送包含您意图行为的交易非常重要

2. **MiniMax 通过预评估但未在PoC中合格**（例如，INTENT主机未能及时部署）：

    - 实际部署了 MiniMax-M2.7 并在本纪元提交了 MiniMax PoC 提交的主机，保留其现有模型组的全部权重（无惩罚）
    - 所有提交了 `PoCDelegation` / `PoCRefusal` 的人保留其全部权重（无惩罚）
    - **从纪元 `278` 开始**：所有未提交者损失15%的权重，所有提交了 `PoCIntent` 但未部署且未提交 MiniMax PoC 提交的人也损失15%（`IntentMissed` 解决方案）


如果 MiniMax 通过了两项检查，惩罚将遵循 [Multi-Model PoC](./multi_model_poc.md) 中描述的常规情形。


## 硬件资格

MiniMax-M2.7 (FP8) 每实例需要 **约 320 GB 总显存** —— 比 Kimi K2.6 或 Qwen3-235B 明显更小，后两者每实例均需 ≥640 GB，详见 [host quickstart 参考布局](./quickstart.md#hardware-and-machines)。实际影响：

- **A100 80GB 拥有者**：MiniMax-M2.7 是**首个符合 A100 80GB 容量限制的治理批准模型**。如果您之前无法托管 Kimi 或 Qwen-235B，现在可通过 MiniMax 赚取共识权重。推荐配置：8×A100 80GB，使用 `tp=4`（每主机两个实例）或 `tp=8`（每主机一个实例）。
- **H100 / H200 拥有者**：MiniMax-M2.7 在共识输出上与 Qwen3-235B 相当（根据工作负载组合略有几个百分点差异），在 Kimi 的系数调整后（`v0.2.13`）明显优于 Kimi K2.6。建议从 Kimi 切换到 MiniMax；此前使用 Qwen3-235B 的主机必须切换到 MiniMax，因为 Qwen3-235B 已被治理淘汰（提案78）。
- **B200 / B300 拥有者**：MiniMax-M2.7 运行良好，但 Kimi K2.6 在旗舰硬件上仍保持微弱的共识输出优势。如果您已在运行 Kimi，则无需更改。


## 为计划部署 MiniMax-M2.7 的主机提供的说明

#### 向链发送 `PoCIntent`

```bash
export NODE=https://node3.gonka.ai/chain-rpc/
./inferenced tx inference declare-poc-intent MiniMaxAI/MiniMax-M2.7 \
  --from gonka-api-key \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

#### 预下载权重并验证可部署性

MiniMax-M2.7 FP8 权重大小为 **约 230 GB**。请据此规划磁盘空间和带宽。请遵循 [预下载模型权重](https://gonka.ai/host/quickstart/#server-pre-download-model-weights-to-hugging-face-cache-hf_home) 指南，使用以下仓库和提交：

- `hf_repo`: `MiniMaxAI/MiniMax-M2.7`
- `hf_commit`: `d494266a4affc0d2995ba1fa35c8481cbd84294b`

在启动快照区块之前验证模型能否在您的硬件上加载。链将 MiniMax 注册为 `Model.ModelArgs`：

```
--enable-auto-tool-choice
--max-model-len 180000
--kv-cache-dtype fp8
--tool-call-parser minimax_m2
--reasoning-parser minimax_m2_append_think
```

#### 等待下一个评估纪元并检查预资格

每个评估纪元的快照区块后，链会发出 `bootstrap_model_preeligibility` 事件：

```bash
NODE=https://node3.gonka.ai
MODEL='MiniMaxAI/MiniMax-M2.7'

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

关键属性是 `pre_eligible`。若其值为 `true`，则链将在本纪元运行 MiniMax PoC，您应做好部署准备。支持字段显示三项检查中哪些通过：`meets_v_min`（≥ `V_min` 直接意图提交者）、`meets_weight_threshold`（意图权重 ≥ `W_threshold` 的 `total_network_weight`）、以及 `meets_reachability`（意图+委托 `reachable_voting_power` 覆盖 `>2/3`）。`intent_host_count` 和 `intent_weight` 显示本纪元的直接意图覆盖情况。

#### 如果预合格，将模型切换为 MiniMax-M2.7

在 8×A100 80GB 上部署 MiniMax-M2.7 的示例命令（`tp=4`，每主机两个实例）：

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
         "MiniMaxAI/MiniMax-M2.7": {
           "args": [
             "--tensor-parallel-size", "4",
             "--enable-expert-parallel",
             "--trust-remote-code",
             "--mm-encoder-tp-mode", "data",
             "--enable-auto-tool-choice",
             "--max-model-len", "180000",
             "--kv-cache-dtype", "fp8",
             "--tool-call-parser", "minimax_m2",
             "--reasoning-parser", "minimax_m2_append_think",
             "--gpu-memory-utilization", "0.95",
             "--max-num-seqs", "128"
           ]
         }
       }
     }'
```

对于 4×B200 / 8×B200 部署，请根据吞吐量偏好使用 `--tensor-parallel-size 2`（每个 8×B200 机箱两个实例）或 `--tensor-parallel-size 4`（一个实例）。链 `Model.ModelArgs` 是最小化的；部署端标志（`--tensor-parallel-size`、`--gpu-memory-utilization`、`--max-num-seqs` 等）由运营商选择。

#### 验证您的部署

[`gonka` 仓库](https://github.com/gonka-ai/gonka) 提供了一个代理技能 `mlnode-validate`，用于将已部署的 ML 节点与特定模型的预计算诚实 PoC 向量进行验证。对于 MiniMax M2.7，提交的黄金参考是 `mlnode/packages/benchmarks/scripts/poc_validation/artifacts/minimaxai-minimax-m2.7.json`（200 个向量；在 2×H200 上记录）。还为 `4×A100`、`4×H100`、`2×H200` 和 `2×B200` 提供了现成的 `deploy/join/` 配置。参见 [验证 ML 节点部署](./mlnode-validation.md) 和 [`skills/mlnode-validate/SKILL.md`](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md)。


## 不部署 MiniMax-M2.7 的主机的说明

#### 检查您是否信任任何将部署 MiniMax / 发送 `PoCIntent` 的主机

```python
import time
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

NODE = "https://node3.gonka.ai"
MODEL = "MiniMaxAI/MiniMax-M2.7"
TIMEOUT = 60
DELAY = 0.15

def session():
    s = requests.Session()
    # Retry transient 5xx (node3 returns 503 for some poc_delegation lookups
    # under load) so a single hiccup does not silently drop a participant
    # from the result.
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
    # weight may be 0, missing, or literally null — all mean "no voting weight".
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
with_minimax_model = []
skipped = []  # participants whose poc_delegation lookup failed after retries

for p in participants:
    addr = p["index"]
    w = weight(p)
    if MODEL in (p.get("models") or []):
        with_minimax_model.append((addr, w))

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
print(f"With {MODEL} in models[]: {len(with_minimax_model)} (not same as intent)")
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

#### 发送委托或拒绝

委托：

```bash
export NODE=https://node3.gonka.ai/chain-rpc/
./inferenced tx inference set-poc-delegation MiniMaxAI/MiniMax-M2.7 <DELEGATEE> \
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
./inferenced tx inference refuse-poc-delegation MiniMaxAI/MiniMax-M2.7 \
  --from gonka-account-key \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```
