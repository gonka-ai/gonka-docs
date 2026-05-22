# Kimi K2.6 引导

`moonshotai/Kimi-K2.6` 已**通过 bootstrap**，并在 Gonka 主网的计算证明中**处于活跃状态**。下面的时间线和交易示例仍然有助于了解激活是如何进行的，以及用于委托等运维操作；关于当前的部署默认值（包括 `node-config.json`），请参阅[主机快速开始](./quickstart.md)。

Epoch 251 是 `moonshotai/Kimi-K2.6` 模型组变为合格时。

本文档说明如何最大程度地减少权重降低的可能性，无论该模型是否获得足够的参与者。

!!! note
    引导过程可能需要多个 epoch，具体取决于多少参与者准备就绪。在激活之前，如果参与者明确提交其选择，并且即将部署的主机提交 `PoCIntent`，则不会发生权重降低。


## 时间线

#### 1. 在区块 `3873996` 之前，所有参与者必须提交：
    - `PoCIntent` - 如果他们将要部署 `Kimi-K2.6`。主机应保持节点部署 `Qwen235B`，并仅在区块 `3873996` 评估后才进行切换
    - `PoCDelegation` / `PoCRefusal` - 如果他们不打算部署 `Kimi-K2.6`

#### 2. 在区块 `3873996`，链运行预评估以检查是否应根据 `PoCIntent` / `PoCDelegation` 尝试激活该模型
    - 如果模型变为预合格 => 提交了 `PoCIntent` 的主机应将其模型节点切换到 `Kimi-K2.6`（在此 500 区块窗口内没有 CPoC）
    - 如果模型未变为预合格 => 提交了 `PoCIntent` 的主机应将节点保持在 `Qwen235B`

#### 3. 在区块 `3874496`，PoC 开始


### 可能的场景

新模型的引导可以遵循以下主要场景：

1. 模型在区块 `3873996` 未通过预评估，未变为合格

- 所有提交 `PoCIntent` 的人保持其全部权重（无惩罚）
- 所有提交 `PoCDelegation` / `PoCRefusal` 的人保持其全部权重（无惩罚）
- 所有未提交任何内容的人损失 15% 的权重

=> 因此明确发送带有你预期行为的交易非常重要

2. 模型在区块 `3873996` 通过预评估，但在 PoC 中未变为合格

- 所有参与 PoC 的人保持其在 `Qwen235` 中的全部权重（无惩罚）
- 所有提交 `PoCDelegation` / `PoCRefusal` 的人保持其全部权重（无惩罚）
- 所有未提交任何内容的人损失 15% 的权重
- 所有提交了 `PoCIntent` 但未参与的人损失 15% 的权重


如果模型通过两项检查，惩罚将按文档中描述的常规场景进行。


## 即将部署 Kimi-K2.6 的主机说明

#### 1. 向链发送 `PoCIntent`：

```
export NODE=https://node3.gonka.ai/
./inferenced tx inference declare-poc-intent moonshotai/Kimi-K2.6 \
  --from node-2 \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

#### 2. 检查你的设置并确保 `Kimi-K2.6` 权重已下载且可成功部署该模型

3. 等待区块 `3873996`+ 并检查模型是否变为预合格：

```bash
NODE=https://node3.gonka.ai
MODEL='moonshotai/Kimi-K2.6'

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

结果将在所有渠道发布。

#### 4. 如有需要，将模型切换到 Kimi-K2.6

在 4xB200 / 8xB200 上部署 Kimi-K2.6 的示例命令：
```
curl -X POST http://localhost:9200/admin/v1/nodes \
     -H "Content-Type: application/json" \
     -d '{
       "id": "<NODE_ID>",
       "host": "<NODE_IP>",
       "inference_port": 5050,
       "poc_port": 8080,
       "max_concurrent": 500,
       "models": {
         "moonshotai/Kimi-K2.6": {
           "args": [
             "--tensor-parallel-size", "4",
             "--enable-expert-parallel",
             "--trust-remote-code",
             "--mm-encoder-tp-mode", "data",
             "--tool-call-parser", "kimi_k2",
             "--reasoning-parser", "kimi_k2",
             "--attention-backend", "FLASHINFER_MLA",
             "--disable-custom-all-reduce",
             "--gpu-memory-utilization", "0.95",
             "--max-num-seqs", "128",
             "--max-model-len", "240000"
           ]
         }
       }
     }'
```

## 不打算部署 Kimi-K2.6 的主机说明

#### 1. 检查你是否信任任何即将部署 Kimi K2.6 / 已发送 `PoCIntent` 的主机

当前的意图：
```python
import time
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

NODE = "https://node3.gonka.ai"
MODEL = "moonshotai/Kimi-K2.6"
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
with_kimi_model = []

for p in participants:
    addr = p["index"]
    w = weight(p)
    if MODEL in (p.get("models") or []):
        with_kimi_model.append((addr, w))

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
print(f"With {MODEL} in models[]: {len(with_kimi_model)} (not same as intent)")
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
```
export NODE=https://node3.gonka.ai/chain-rpc/
./inferenced tx inference set-poc-delegation moonshotai/Kimi-K2.6 <DELEGATEE> \
  --from gonka-account-key \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

拒绝：
```
export NODE=https://node3.gonka.ai/chain-rpc/
./inferenced tx inference refuse-poc-delegation moonshotai/Kimi-K2.6 \
  --from gonka-account-key \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```
