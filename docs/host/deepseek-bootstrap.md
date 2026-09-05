# DeepSeek V4 Flash Bootstrap

`deepseek-ai/DeepSeek-V4-Flash-0731` has **passed bootstrap** and is **active** in Proof of Compute on Gonka mainnet as of chain epoch 360 ([proposal 94](../network-updates.md#august-10-2026)). The timeline and transaction examples below remain useful for understanding how activation worked and for operations such as delegation; for current deployment defaults (including `node-config.json`), see the [Host Quickstart](./quickstart.md).

For the wider context of multi-model PoC mechanics, see [Multi-Model PoC](./multi_model_poc.md). Previous model bootstraps and their mechanics are documented in [Kimi K2.6 Bootstrap](./kimi-bootstrap.md) and [MiniMax-M2.7 Bootstrap](./minimax-bootstrap.md).

!!! note
    The bootstrap can take multiple epochs, depending on how many participants are ready. Before the configured punishment epoch, no weight reduction happens if participants submit their choice explicitly and hosts who are going to deploy submit `PoCIntent`. Hosts that keep serving MiniMax or Kimi and do not opt into DeepSeek still need an explicit `PoCDelegation` / `PoCRefusal` once `penalty_start_epoch` is reached. Per-model participation enforcement for DeepSeek is now in effect (epoch 360).

!!! note
    On Blackwell GPUs, for best performance you can use the model repacked as fp8 + nvfp4 instead of fp8 + fp4, e.g. `MJPansa/DeepSeek-V4-Flash-0731-NVFP4`. The model's precision is the same. Use the `node-config-deepseekv4flash0731-B200-nvfp4.json` / `node-config-deepseekv4flash0731-B300-nvfp4.json` configs and API `v0.2.15-post5` — see the August 13 "Testing DeepSeek V4 Flash" note in [Network updates](../network-updates.md).

## Governance context (proposal 94)

Proposal 94 registers DeepSeek V4 Flash as a new PoC model. No existing parameter or model is modified; the only change is the new model entry.

Details from the proposal / announcement:

- Model: `deepseek-ai/DeepSeek-V4-Flash-0731` (pinned revision `7872f01b1d1fe23eabc4c98b48bffcef5a386062`)
- Requires an MLNode on **vLLM 0.25.1** (MLNode **3.0.16**) with the shipped node configuration (`node-config-deepseekv4flash0731-*.json` for B300 / B200 / H200 / H100)
- On-chain PoC `weight_scale_factor` was **0.214** at registration; [proposal 98](../network-updates.md#august-29-2026) later raised it to **0.246**. Inference `validation_threshold = 0.90` (processed logprobs)
- `penalty_start_epoch = 360`
- Voting ended **August 12, 2026 at 16:05 UTC** / August 12 at 09:05 PDT
- First bootstrap attempt at **epoch 359**; the model group became active at **epoch 360**

Declare `PoCIntent` **after voting ended** and before the epoch 359 snapshot at `start_poc − deploy_window`. The MLNode image is pinned to 3.0.16 in `deploy/join/docker-compose.mlnode.yml` on the [`vllm-0.25.1-upgrade`](https://github.com/gonka-ai/gonka/tree/vllm-0.25.1-upgrade/deploy/join) branch (`main` still pins 3.0.14-post2); use the shipped DeepSeek `node-config-*.json` files.


## Timeline

Punishment for missing DeepSeek V4 Flash starts at **epoch `360`**. Each epoch from proposal activation onwards, the chain attempts to bootstrap the model: it captures a `BootstrapDelegationSnapshot` 500 blocks (the `DeployWindow` from `delegation_params.deploy_window`) before that epoch's PoC stage, evaluates pre-eligibility against `V_min = 3` direct committers and a `W_threshold` fraction of total network weight with `>2/3` reachability via INTENT + DELEGATE, and (if pre-eligible) starts PoC for DeepSeek that epoch.

Proposal 94 keeps the current delegation thresholds: `w_threshold = 0.1`, `v_min = 3`, `no_participation_penalty = 0.15`, `refusal_penalty = 0.1`. Still read live values from the chain after execution:

```bash
curl -s "https://node3.gonka.ai/chain-api/productscience/inference/inference/params" \
  | jq '.params.delegation_params | {deploy_window, w_threshold, v_min, no_participation_penalty, refusal_penalty}'
# Decimal fields use {value, exponent}: e.g. {"value":"1","exponent":-1} → 0.1 (10%).
```

Confirm the live DeepSeek entry (including `penalty_start_epoch` and `weight_scale_factor`) after the proposal executes:

```bash
curl -s "https://node3.gonka.ai/chain-api/productscience/inference/inference/params" \
  | jq '.params.poc_params.models[] | select(.model_id=="deepseek-ai/DeepSeek-V4-Flash-0731")'
```

To compute the exact block numbers for any given evaluation epoch, anchor on the chain's current epoch and forward-project. The `epoch_shift` parameter does not anchor to genesis (it gets stale across past epoch-length changes), so `epoch_shift + N * epoch_length` is wrong on mainnet — always anchor on the live current PoC_start instead:

```bash
NODE=https://node3.gonka.ai

PARAMS=$(curl -s "$NODE/chain-api/productscience/inference/inference/params")
EPOCH_LENGTH=$(echo "$PARAMS" | jq -r '.params.epoch_params.epoch_length | tonumber')

CURRENT=$(curl -s "$NODE/v1/epochs/current/participants" | jq '.active_participants')
CURRENT_EPOCH=$(echo "$CURRENT" | jq -r '.epoch_id')
CURRENT_POC_START=$(echo "$CURRENT" | jq -r '.poc_start_block_height')

EPOCH=359                   # change to any target epoch
POC_START=$(( CURRENT_POC_START + (EPOCH - CURRENT_EPOCH) * EPOCH_LENGTH ))
SNAPSHOT_BLOCK=$(( POC_START - 500 ))

echo "Epoch $EPOCH (current $CURRENT_EPOCH): snapshot at block $SNAPSHOT_BLOCK, PoC starts at block $POC_START"
```

DeepSeek becomes pre-eligible at the earliest epoch where participating hosts plus delegations cover the thresholds. Existing model entries (`MiniMaxAI/MiniMax-M2.7`, `moonshotai/Kimi-K2.6`, `zai-org/GLM-5.2-FP8`) are preserved unchanged in the proposal params.


### Possible Scenarios

The bootstrap of DeepSeek V4 Flash can follow these main scenarios:

1. **DeepSeek does not pass pre-evaluation in a given epoch's snapshot** (and remains not eligible at PoC):

    - Everyone who submitted `PoCIntent` keeps their full weight (no punishment)
    - Everyone who submitted `PoCDelegation` keeps their full weight (no punishment)
    - **Before epoch `360`**: everyone who submitted nothing, and everyone who submitted `PoCRefusal`, also keeps their full weight (punishment is suppressed during the grace period)
    - **From epoch `360` onwards**: everyone who submitted nothing loses **15%** of their weight per epoch per missed model (`no_participation_penalty`); a `PoCRefusal` avoids the 15% miss but still applies `refusal_penalty` (**10%**) once the penalty epoch is active

    => it is important to explicitly send a transaction with your intended behavior **before epoch `360`**

2. **DeepSeek passes pre-evaluation but does not become eligible at PoC** (e.g., an INTENT host fails to deploy in time):

    - Hosts that actually deployed DeepSeek and submitted DeepSeek PoC commits during this epoch keep their full weight from their existing model groups (no punishment)
    - Everyone who submitted `PoCDelegation` keeps their full weight (no punishment)
    - **From epoch `360` onwards**: everyone who submitted nothing loses 15% of their weight; everyone who submitted `PoCIntent` for DeepSeek but did not deploy and submit DeepSeek PoC commits also loses 15% (`IntentMissed` resolution); `PoCRefusal` takes the 10% `refusal_penalty` instead of the 15% miss

If DeepSeek passes both checks, punishment follows the usual scenarios described in [Multi-Model PoC](./multi_model_poc.md).


## Hardware and consensus weight

DeepSeek V4 Flash is registered with `v_ram = 280` (about **280 GB of total VRAM** per instance). The live `weight_scale_factor` is **0.246** ([proposal 98](../network-updates.md#august-29-2026); originally 0.214). Relative to an 8×H100 cluster running MiniMax M2.7, the original announcement (at 0.214) estimated:

- 8×H200 optimally yields **1.46×** weight running MiniMax M2.7
- 8×B200 optimally yields **2.96×** weight running Kimi K2.6
- 8×B300 optimally yields **3.37×** weight running DeepSeek V4 Flash

A model's `weight_scale_factor` only produces consensus weight if that model group is eligible (has voting power). Check `poc_params` and `confirmation_weight_scales`.

Practical implications:

- **B300 owners**: DeepSeek is the highest-weight option under the current coefficient. Plan for vLLM 0.25.1 / MLNode 3.0.16 and the B300 node config.
- **B200 owners**: DeepSeek and MiniMax both have B200 node configs. `moonshotai/Kimi-K2.6` is currently not served — confirm on `/v1/epochs/current/participants`.
- **H200 / H100 owners**: MiniMax M2.7 remains the highest-weight model for these classes; DeepSeek configs exist, but switching is optional and not required for max weight.
- Full coefficient table: [Google Sheet](https://docs.google.com/spreadsheets/d/1Tw4V7xEXR2p5MbCHqzqjS9vHXQ0eI1IHVXC6guEHnio/edit?gid=0#gid=0)

Based on model usage, governance can still adjust coefficients to incentivise moving more B-series GPUs to DeepSeek.


## Instructions for hosts who are going to deploy DeepSeek V4 Flash

#### 1. Send `PoCIntent` to the chain

Submit after voting on proposal 94 ends, and before the target epoch's snapshot block:

```bash
export NODE=https://node3.gonka.ai/chain-rpc/
./inferenced tx inference declare-poc-intent deepseek-ai/DeepSeek-V4-Flash-0731 \
  --from gonka-api-key \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

#### 2. Pre-download the weights and verify deployability

Use the pinned Hugging Face revision from the proposal:

- `hf_repo`: `deepseek-ai/DeepSeek-V4-Flash-0731`
- `hf_commit`: `7872f01b1d1fe23eabc4c98b48bffcef5a386062`
- License: **MIT** — see [Model licenses](../model-licenses.md) and the [upstream LICENSE](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731/blob/main/LICENSE). The Blackwell nvfp4 repack `MJPansa/DeepSeek-V4-Flash-0731-NVFP4` (commit `64d64cd89bc63a66aa46506da89d7821f7491c62`) is also MIT.

Follow the guide to [pre-download model weights](https://gonka.ai/host/quickstart/#server-pre-download-model-weights-to-hugging-face-cache-hf_home). Plan disk space and bandwidth ahead of the bootstrap window — Hugging Face rate limits during the first attempt can cost eligibility.

Verify the model loads on your hardware **before** the bootstrap snapshot block. You need:

- MLNode on **vLLM 0.25.1** (image **3.0.16**)
- Shipped node configuration: `node-config-deepseekv4flash0731-*.json` for your GPU class (B300 / B200 / H200 / H100)

The chain registers DeepSeek with `Model.ModelArgs`:

```
--max-model-len 400000
--kv-cache-dtype fp8
--tokenizer-mode deepseek_v4
--enable-auto-tool-choice
--tool-call-parser deepseek_v4
--reasoning-parser deepseek_v4
--trust-remote-code
```

Deployment-side flags (`--tensor-parallel-size`, `--enable-expert-parallel`, `--gpu-memory-utilization`, speculative / attention backend flags, etc.) come from the shipped `node-config` for your hardware — do not invent them from the chain `ModelArgs` alone.

#### 3. Wait for the next evaluation epoch and check pre-eligibility

After each evaluation epoch's snapshot block, the chain emits a `bootstrap_model_preeligibility` event:

```bash
NODE=https://node3.gonka.ai
MODEL='deepseek-ai/DeepSeek-V4-Flash-0731'

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

The key attribute is `pre_eligible`. If it is `true`, the chain will run DeepSeek PoC this epoch and you should be ready to deploy. The supporting fields show which of the three checks passed: `meets_v_min` (≥ `V_min` direct intent committers), `meets_weight_threshold` (intent weight ≥ `W_threshold` of `total_network_weight`), and `meets_reachability` (intent + delegated `reachable_voting_power` covers `>2/3`). `intent_host_count` and `intent_weight` show this epoch's direct intent coverage.

#### 4. Switch the model to DeepSeek V4 Flash if pre-eligible

Use the matching shipped config for your GPU class. Example shape of an Admin API update (replace args with the contents of your `node-config-deepseekv4flash0731-*.json`):

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
         "deepseek-ai/DeepSeek-V4-Flash-0731": {
           "args": [
             "--max-model-len", "400000",
             "--kv-cache-dtype", "fp8",
             "--tokenizer-mode", "deepseek_v4",
             "--enable-auto-tool-choice",
             "--tool-call-parser", "deepseek_v4",
             "--reasoning-parser", "deepseek_v4",
             "--trust-remote-code"
           ]
         }
       }
     }'
```

Merge in the operator flags from the shipped config (tensor parallel size, expert parallel, gpu memory utilization, speculative decoding, and any hardware-specific backends). Membership at PoC start is set by who submits a PoC store commit — declaring intent alone is not enough.

#### 5. Validate your deployment

Follow the posted MLNode setup notes and the committed golden reference for DeepSeek (`deepseek-ai-deepseek-v4-flash-0731.json` on the [`vllm-0.25.1-upgrade`](https://github.com/gonka-ai/gonka/tree/vllm-0.25.1-upgrade/mlnode/packages/benchmarks/scripts/poc_validation/artifacts) branch). The [`gonka` repo](https://github.com/gonka-ai/gonka) ships an agent skill, `mlnode-validate`, that validates a deployed ML Node against pre-computed honest PoC vectors. See [Validate ML Node Deployment](./mlnode-validation.md) and [`skills/mlnode-validate/SKILL.md`](https://github.com/gonka-ai/gonka/blob/vllm-0.25.1-upgrade/skills/mlnode-validate/SKILL.md).


## Instructions for hosts who are NOT going to deploy DeepSeek V4 Flash

Keeping MiniMax or Kimi is fine — existing models are unchanged. Per-model participation enforcement for DeepSeek is now in effect (epoch **`360`**). If you are not serving DeepSeek, submit a **delegation** (preferred if you trust a DeepSeek host) or a **refusal** so you are not treated as missing the model. Refusal avoids the 15% miss penalty but still costs the 10% `refusal_penalty`. Hosts that already chose DIRECT, DELEGATE, or REFUSE do not need to resubmit.

#### 1. Check if you trust any host who is going to deploy DeepSeek / sent `PoCIntent`

```python
import time
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

NODE = "https://node3.gonka.ai"
MODEL = "deepseek-ai/DeepSeek-V4-Flash-0731"
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
with_deepseek_model = []
skipped = []  # participants whose poc_delegation lookup failed after retries

for p in participants:
    addr = p["index"]
    w = weight(p)
    if MODEL in (p.get("models") or []):
        with_deepseek_model.append((addr, w))

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
print(f"With {MODEL} in models[]: {len(with_deepseek_model)} (not same as intent)")
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

When delegating for the bootstrap: **do not delegate to guardian nodes**; spread weight across independent DeepSeek hosts. See [Multi-Model PoC](./multi_model_poc.md) for updated delegation guidance.

#### 2. Send delegation or refusal

Delegation:

```bash
export NODE=https://node3.gonka.ai/chain-rpc/
./inferenced tx inference set-poc-delegation deepseek-ai/DeepSeek-V4-Flash-0731 <DELEGATEE> \
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
./inferenced tx inference refuse-poc-delegation deepseek-ai/DeepSeek-V4-Flash-0731 \
  --from gonka-account-key \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```
