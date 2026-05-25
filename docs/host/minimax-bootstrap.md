# MiniMax-M2.7 Bootstrap

`MiniMaxAI/MiniMax-M2.7` (FP8) is added as a third governance-approved inference model in the `v0.2.13` upgrade. This document explains how to minimize the chance of weight reductions during bootstrap, whether or not the model gets enough participants in its first attempt.

For current deployment defaults (including `node-config.json`), see the [Host Quickstart](./quickstart.md). For the wider context of multi-model PoC mechanics, see [Multi-Model PoC](./multi_model_poc.md). The previous model bootstrap and its mechanics are documented in [Kimi K2.6 Bootstrap](./kimi-bootstrap.md).

!!! note
    The bootstrap can take multiple epochs, depending on how many participants are ready. Before the configured punishment epoch, no weight reduction happens if participants submit their choice explicitly and hosts who are going to deploy submit `PoCIntent`.


## Timeline

Punishment for missing MiniMax-M2.7 starts at **epoch `271`**. Each epoch from upgrade activation onwards, the chain attempts to bootstrap the model: it captures a `BootstrapDelegationSnapshot` 500 blocks (the `DeployWindow`) before that epoch's PoC stage, evaluates pre-eligibility against `V_min = 3` direct committers and a `W_threshold` fraction of total network weight with `>2/3` reachability via INTENT + DELEGATE, and (if pre-eligible) starts PoC for MiniMax that epoch.

The current `W_threshold` is a governance parameter — read it from the chain rather than hard-coding a value (it was lowered from `0.3` to `0.1` by GIP-48, and may change again):

```bash
curl -s "https://node3.gonka.ai/chain-api/productscience/inference/inference/params" \
  | jq '.params.delegation_params.w_threshold'
# {value, exponent} encodes a decimal: e.g. {"value":"1","exponent":-1} → 0.1 (10%).
```

To compute the exact block numbers for any given evaluation epoch, anchor on the chain's current epoch and forward-project. The `epoch_shift` parameter does not anchor to genesis (it gets stale across past epoch-length changes), so `epoch_shift + N * epoch_length` is wrong on mainnet — always anchor on the live current PoC_start instead:

```bash
NODE=https://node3.gonka.ai

PARAMS=$(curl -s "$NODE/chain-api/productscience/inference/inference/params")
EPOCH_LENGTH=$(echo "$PARAMS" | jq -r '.params.epoch_params.epoch_length | tonumber')

CURRENT=$(curl -s "$NODE/v1/epochs/current/participants" | jq '.active_participants')
CURRENT_EPOCH=$(echo "$CURRENT" | jq -r '.epoch_id')
CURRENT_POC_START=$(echo "$CURRENT" | jq -r '.poc_start_block_height')

EPOCH=271                   # change to any target epoch
POC_START=$(( CURRENT_POC_START + (EPOCH - CURRENT_EPOCH) * EPOCH_LENGTH ))
SNAPSHOT_BLOCK=$(( POC_START - 500 ))

echo "Epoch $EPOCH (current $CURRENT_EPOCH): snapshot at block $SNAPSHOT_BLOCK, PoC starts at block $POC_START"
```

MiniMax becomes pre-eligible at the earliest epoch where participating hosts plus delegations cover the thresholds.


### Possible Scenarios

The bootstrap of MiniMax-M2.7 can follow these main scenarios:

1. **MiniMax does not pass pre-evaluation in a given epoch's snapshot** (and remains not eligible at PoC):

    - Everyone who submitted `PoCIntent` keeps their full weight (no punishment)
    - Everyone who submitted `PoCDelegation` / `PoCRefusal` keeps their full weight (no punishment)
    - **Before epoch `271`**: everyone who submitted nothing also keeps their full weight (punishment is suppressed during the grace period)
    - **From epoch `271` onwards**: everyone who submitted nothing loses 15% of their weight per epoch per missed model

    => it is important to explicitly send a transaction with your intended behavior **before epoch `271`**

2. **MiniMax passes pre-evaluation but does not become eligible at PoC** (e.g., an INTENT host fails to deploy in time):

    - Hosts that actually deployed MiniMax-M2.7 and submitted MiniMax PoC commits during this epoch keep their full weight from their existing model groups (no punishment)
    - Everyone who submitted `PoCDelegation` / `PoCRefusal` keeps their full weight (no punishment)
    - **From epoch `271` onwards**: everyone who submitted nothing loses 15% of their weight, and everyone who submitted `PoCIntent` for MiniMax but did not deploy and submit MiniMax PoC commits also loses 15% (`IntentMissed` resolution)


If MiniMax passes both checks, punishment follows the usual scenarios described in [Multi-Model PoC](./multi_model_poc.md).


## Hardware eligibility

MiniMax-M2.7 (FP8) requires **roughly 320 GB of total VRAM**. This is a meaningfully smaller footprint than Kimi K2.6 (≥720 GB) and Qwen3-235B (≥720 GB). Practical implications:

- **A100 80GB owners**: MiniMax-M2.7 is the **first governance-approved model that fits the A100 80GB envelope**. If you previously could not host Kimi or Qwen-235B, you are now eligible to earn consensus weight via MiniMax. Recommended config: 8×A100 80GB with `tp=4` (two instances per host) or `tp=8` (one instance).
- **H100 / H200 owners**: MiniMax-M2.7 has the highest per-8xGPU consensus output on this hardware tier (clearly above Kimi K2.6 after Kimi's coefficient adjustment in `v0.2.13`, and slightly above Qwen3-235B). Switching from Qwen or Kimi to MiniMax on H100/H200 is the network-preferred direction.
- **B200 / B300 owners**: MiniMax-M2.7 runs well, but Kimi K2.6 retains a narrow consensus-output lead on flagship hardware. No change required if you already run Kimi.


## Instructions for hosts who are going to deploy MiniMax-M2.7

#### 1. Send `PoCIntent` to the chain

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

#### 2. Pre-download the weights and verify deployability

The MiniMax-M2.7 FP8 weights are **~230 GB**. Plan disk space and bandwidth accordingly. Follow the guide to [pre-download model weights](https://gonka.ai/host/quickstart/#server-pre-download-model-weights-to-hugging-face-cache-hf_home) using the repo and commit below:

- `hf_repo`: `MiniMaxAI/MiniMax-M2.7`
- `hf_commit`: `d494266a4affc0d2995ba1fa35c8481cbd84294b`

Verify the model loads on your hardware before the bootstrap snapshot block. The chain registers MiniMax with `Model.ModelArgs`:

```
--enable-auto-tool-choice
--kv-cache-dtype fp8
--tool-call-parser minimax_m2
--reasoning-parser minimax_m2_append_think
```

(No explicit `--max-model-len` — vLLM uses the model default.)

#### 3. Wait for the next evaluation epoch and check pre-eligibility

After each evaluation epoch's snapshot block, the chain emits a `bootstrap_model_preeligibility` event:

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

The key attribute is `pre_eligible`. If it is `true`, the chain will run MiniMax PoC this epoch and you should be ready to deploy. The supporting fields show which of the three checks passed: `meets_v_min` (≥ `V_min` direct intent committers), `meets_weight_threshold` (intent weight ≥ `W_threshold` of `total_network_weight`), and `meets_reachability` (intent + delegated `reachable_voting_power` covers `>2/3`). `intent_host_count` and `intent_weight` show this epoch's direct intent coverage.

#### 4. Switch the model to MiniMax-M2.7 if pre-eligible

Example command to deploy MiniMax-M2.7 on 8×A100 80GB (`tp=4`, two instances per host):

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

For 4×B200 / 8×B200 deployments, use `--tensor-parallel-size 2` (two instances per 8×B200 box) or `--tensor-parallel-size 4` (one instance) depending on throughput preference. The chain `Model.ModelArgs` are minimal; deployment-side flags (`--tensor-parallel-size`, `--gpu-memory-utilization`, `--max-num-seqs`, etc.) are operator choices.


## Instructions for hosts who are NOT going to deploy MiniMax-M2.7

#### 1. Check if you trust any host who is going to deploy MiniMax / sent `PoCIntent`

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

#### 2. Send delegation or refusal

Delegation:

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

Refusal:

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
