# MiniMax-M2.7 引导

`MiniMaxAI/MiniMax-M2.7`（FP8）在 `v0.2.13` 升级中作为第三个由治理批准的推理模型加入。本文档说明如何在引导过程中最大程度地减少权重降低的可能性，无论该模型在第一次尝试中是否获得足够的参与者。

关于当前的部署默认值（包括 `node-config.json`），请参阅[主机快速开始](./quickstart.md)。关于多模型 PoC 机制的更广泛背景，请参阅[多模型 PoC](./multi_model_poc.md)。之前的模型引导及其机制记录在 [Kimi K2.6 引导](./kimi-bootstrap.md) 中。

!!! note
    引导过程可能需要多个 epoch，具体取决于多少参与者准备就绪。在配置的惩罚 epoch 之前，如果参与者明确提交其选择，并且即将部署的主机提交 `PoCIntent`，则不会发生权重降低。


## 时间线

错过 MiniMax-M2.7 的惩罚从 **epoch `271`** 开始。从升级激活开始的每个 epoch，链都会尝试引导该模型：它在该 epoch 的 PoC 阶段之前 500 个区块（`DeployWindow`）捕获 `BootstrapDelegationSnapshot`，根据 `V_min = 3` 个直接提交者和 `W_threshold = 0.3` 的总网络权重（带 `>2/3` 的可达性，通过 INTENT + DELEGATE）评估预合格性，并且（如果预合格）在该 epoch 启动 MiniMax 的 PoC。

要计算任何给定评估 epoch 的确切区块号：

```bash
NODE=https://node3.gonka.ai

# 读取 epoch 参数（epoch_length 和 epoch_shift）以及当前状态。
PARAMS=$(curl -s "$NODE/chain-api/productscience/inference/inference/params")
EPOCH_LENGTH=$(echo "$PARAMS" | jq -r '.params.epoch_params.epoch_length | tonumber')
EPOCH_SHIFT=$(echo "$PARAMS" | jq -r '.params.epoch_params.epoch_shift | tonumber')

# epoch N 的 PoC 开始时间为：epoch_shift + N * epoch_length
EPOCH=271                   # 改为任意目标 epoch
POC_START=$(( EPOCH_SHIFT + EPOCH * EPOCH_LENGTH ))
SNAPSHOT_BLOCK=$(( POC_START - 500 ))

echo "Epoch $EPOCH: snapshot at block $SNAPSHOT_BLOCK, PoC starts at block $POC_START"
```

相同的计算适用于任何更早的评估 epoch（264、265、...）。MiniMax 在参与主机加上委托覆盖阈值的最早 epoch 变为预合格。


### 可能的场景

MiniMax-M2.7 的引导可以遵循以下主要场景：

1. **MiniMax 在给定 epoch 的快照中未通过预评估**（并在 PoC 中保持不合格）：

    - 所有提交 `PoCIntent` 的人保持其全部权重（无惩罚）
    - 所有提交 `PoCDelegation` / `PoCRefusal` 的人保持其全部权重（无惩罚）
    - **在 epoch `271` 之前**：所有未提交任何内容的人也保持其全部权重（在宽限期内惩罚被抑制）
    - **从 epoch `271` 起**：所有未提交任何内容的人每个 epoch 每个错过的模型损失 15% 的权重

    => 因此必须**在 epoch `271` 之前**明确发送带有你预期行为的交易

2. **MiniMax 通过预评估，但在 PoC 中未变为合格**（例如，意图主机未能按时部署）：

    - 实际部署了 MiniMax-M2.7 并在此 epoch 内提交了 MiniMax PoC commit 的主机保持其在现有模型组中的全部权重（无惩罚）
    - 所有提交 `PoCDelegation` / `PoCRefusal` 的人保持其全部权重（无惩罚）
    - **从 epoch `271` 起**：所有未提交任何内容的人损失 15% 的权重，所有为 MiniMax 提交 `PoCIntent` 但未部署且未提交 MiniMax PoC commit 的人也损失 15%（`IntentMissed` 处置）


如果 MiniMax 通过两项检查，惩罚将按[多模型 PoC](./multi_model_poc.md)中描述的常规场景进行。


## 硬件资格

MiniMax-M2.7（FP8）需要**约 320 GB 的总 VRAM**。这比 Kimi K2.6（≥720 GB）和 Qwen3-235B（≥720 GB）的占用要小得多。实际影响：

- **A100 80GB 拥有者**：MiniMax-M2.7 是**第一个适合 A100 80GB 范围的、由治理批准的模型**。如果您之前无法承载 Kimi 或 Qwen-235B，您现在有资格通过 MiniMax 获得共识权重。推荐配置：8×A100 80GB，`tp=4`（每个主机两个实例）或 `tp=8`（一个实例）。
- **H100 / H200 拥有者**：MiniMax-M2.7 在此硬件层级上具有最高的每 8xGPU 共识输出（明显高于 `v0.2.13` 中 Kimi 系数调整后的 Kimi K2.6，并略高于 Qwen3-235B）。在 H100/H200 上从 Qwen 或 Kimi 切换到 MiniMax 是网络偏好的方向。
- **B200 / B300 拥有者**：MiniMax-M2.7 运行良好，但 Kimi K2.6 在旗舰硬件上仍保持着略微的共识输出优势。如果您已经运行 Kimi，则无需更改。


## 即将部署 MiniMax-M2.7 的主机说明

#### 1. 向链发送 `PoCIntent`

```bash
export NODE=https://node3.gonka.ai/
./inferenced tx inference declare-poc-intent MiniMaxAI/MiniMax-M2.7 \
  --from gonka-api-key \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

#### 2. 预下载权重并验证可部署性

MiniMax-M2.7 FP8 权重**约 230 GB**。请相应规划磁盘空间和带宽。按照[预下载模型权重](https://gonka.ai/host/quickstart/#server-pre-download-model-weights-to-hugging-face-cache-hf_home)指南使用下方的仓库和 commit：

- `hf_repo`：`MiniMaxAI/MiniMax-M2.7`
- `hf_commit`：`d494266a4affc0d2995ba1fa35c8481cbd84294b`

在引导快照区块之前，验证模型能在你的硬件上加载。链使用 `Model.ModelArgs` 注册 MiniMax：

```
--enable-auto-tool-choice
--kv-cache-dtype fp8
--tool-call-parser minimax_m2
--reasoning-parser minimax_m2_append_think
```

（没有显式的 `--max-model-len`——vLLM 使用模型默认值。）

#### 3. 等待下一个评估 epoch 并检查预合格性

在每个评估 epoch 的快照区块之后，链会发出 `bootstrap_model_preeligibility` 事件：

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

关键属性是 `pre_eligible`。如果它是 `true`，链将在此 epoch 运行 MiniMax 的 PoC，您应该准备部署。支持字段显示三项检查中哪些通过了：`meets_v_min`（≥ `V_min` 个直接意图提交者）、`meets_weight_threshold`（意图权重 ≥ `W_threshold` × `total_network_weight`）和 `meets_reachability`（意图 + 委托的 `reachable_voting_power` 覆盖 `>2/3`）。`intent_host_count` 和 `intent_weight` 显示了此 epoch 的直接意图覆盖范围。

#### 4. 如果预合格，将模型切换到 MiniMax-M2.7

在 8×A100 80GB 上部署 MiniMax-M2.7（`tp=4`，每个主机两个实例）的示例命令：

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

对于 4×B200 / 8×B200 部署，根据吞吐量偏好使用 `--tensor-parallel-size 2`（每个 8×B200 机器两个实例）或 `--tensor-parallel-size 4`（一个实例）。链上的 `Model.ModelArgs` 是最小化的；部署端的标志（`--tensor-parallel-size`、`--gpu-memory-utilization`、`--max-num-seqs` 等）由运维方选择。


## 不打算部署 MiniMax-M2.7 的主机说明

#### 1. 检查你是否信任任何即将部署 MiniMax / 已发送 `PoCIntent` 的主机

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
    s.mount("https://", HTTPAdapter(max_retries=Retry(total=5, backoff_factor=0.5)))
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
with_minimax_model = []

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
        print(f"SKIP {addr}: {e}")
        time.sleep(DELAY)
        continue

    for i in resp.get("intents") or []:
        if i.get("model_id") == MODEL:
            intents.append((addr, w))
    time.sleep(DELAY)

total = sum(weight(p) for p in participants)
intent_weight = sum(w for _, w in intents)

print(f"Active participants: {len(participants)}")
print(f"With {MODEL} in models[]: {len(with_minimax_model)} (not same as intent)")
print()
print("Intent from (PoCDirectIntent on chain):")
for addr, w in intents:
    print(f"  {addr} : {w}")
print()
print(f"Intent weight: {intent_weight} / {total}")
if total:
    print(f"Intent share: {100.0 * intent_weight / total:.2f}%")
```

#### 2. 发送委托或拒绝

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
