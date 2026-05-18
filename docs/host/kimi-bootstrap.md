# Kimi K2.6 Bootstrap

`moonshotai/Kimi-K2.6` has **passed bootstrap** and is **active** in Proof of Compute on Gonka mainnet. The timeline and transaction examples below remain useful for understanding how activation worked and for operations such as delegation; for current deployment defaults (including `node-config.json`), see the [Host Quickstart](./quickstart.md).

Epoch 251 was when the model group `moonshotai/Kimi-K2.6` became eligible.

This document explains how to minimize the chance of weight reductions, whether or not the model gets enough participants.

!!! note
    The bootstrap can take multiple epochs, depending on how many participants are ready. Before activation, no weight reduction happens if participants submit their choice explicitly and hosts who are going to deploy submit `PoCIntent`.


## Timeline

#### 1. Before block `3873996`, all participants must submit:
    - `PoCIntent` - if they are going to deploy `Kimi-K2.6`. Hosts should keep nodes deployed with `Qwen235B` and switch only after evaluation at block `3873996`
    - `PoCDelegation` / `PoCRefusal` - if they are NOT going to deploy `Kimi-K2.6`

#### 2. At block `3873996`, the chain runs pre-evaluation to check whether it should try to activate the model based on `PoCIntent` / `PoCDelegation`
    - If the model becomes pre-eligible => hosts who submitted `PoCIntent` should switch their model nodes to `Kimi-K2.6` (there are no CPoC in this 500-block window)
    - If the model does not become pre-eligible => hosts who submitted `PoCIntent` should keep their nodes on `Qwen235B`

#### 3. At block `3874496`, PoC starts


### Possible Scenarios

The bootstrap of a new model can follow these main scenarios:

1. The model does not pass the pre-evaluation at block `3873996` and does not become eligible

- Everyone who submitted `PoCIntent` keeps their full weight (no punishment)
- Everyone who submitted `PoCDelegation` / `PoCRefusal` keeps their full weight (no punishment)
- Everyone who submitted nothing loses 15% of their weight

=> it is important to explicitly send a transaction with your intended behavior

2. The model passes the pre-evaluation at block `3873996` but does not become eligible at PoC

- Everyone who participated in PoC keeps their full weight from `Qwen235` (no punishment)
- Everyone who submitted `PoCDelegation` / `PoCRefusal` keeps their full weight (no punishment)
- Everyone who submitted nothing loses 15% of their weight
- Everyone who submitted `PoCIntent` and does not participate loses 15% of their weight


If the model passes both checks, punishment follows the usual scenarios described in the documentation.


## Instructions for hosts who are going to deploy Kimi-K2.6

#### 1. Send `PoCIntent` to the chain:

```
export NODE=https://node3.gonka.ai/
./inferenced tx inference declare-poc-intent moonshotai/Kimi-K2.6 \
  --from node-2 \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y \
```

#### 2. Check your setup and make sure the `Kimi-K2.6` weights are downloaded and you can deploy the model successfully

3. Wait for block `3873996`+ and check whether the model becomes pre-eligible:

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

The results will be sent in all channels.

#### 4. Switch the model to Kimi-K2.6 if needed

Example command to deploy Kimi-K2.6 on 4xB200 / 8xB200:
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

## Instructions for hosts who are NOT going to deploy Kimi-K2.6

#### 1. Check if you trust any host who is going to deploy Kimi K2.6 / send `PoCIntent`

Current intents:
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

#### 2. Send delegation or refusal

Delegation:
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

Refusal:
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
