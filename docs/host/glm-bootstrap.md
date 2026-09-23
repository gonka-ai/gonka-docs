# GLM-5.3-Flash Bootstrap

`zai-org/GLM-5.3-Flash` has **passed bootstrap** and is **active** in Proof of Compute on Gonka mainnet as of chain epoch 395 ([proposal 101](../network-updates.md#proposal-101)). Its `penalty_start_epoch` is **394**. It is in `confirmation_weight_scales` with `weight_scale_factor` 0.62, so it produces consensus weight. The timeline and transaction examples below remain useful for understanding how activation worked and for operations such as delegation; for current deployment defaults (including `node-config.json`), see the [Host Quickstart](./quickstart.md).

For the wider context of multi-model PoC mechanics, see [Multi-Model PoC](./multi_model_poc.md). Other model bootstraps and their mechanics are documented in [MiniMax-M2.7 Bootstrap](./minimax-bootstrap.md), [DeepSeek V4 Flash Bootstrap](./deepseek-bootstrap.md), and [Kimi K2.6 Bootstrap](./kimi-bootstrap.md) (historical).

!!! warning "Per-model participation for GLM is in effect from epoch 394"
    From epoch **394**, hosts without an explicit choice for `zai-org/GLM-5.3-Flash` risk the 15% `no_participation_penalty` each epoch. If you will serve it, submit `PoCIntent` and deploy. If you will not, submit **delegation** (preferred if you trust a GLM host) or **refusal**. Refusal avoids the 15% miss but still applies the 10% `refusal_penalty`. Hosts that already chose DIRECT, DELEGATE, or REFUSE do not need to resubmit.

!!! warning "MLNode 3.1.0 / vLLM 0.28 / CUDA 13"
    GLM-5.3-Flash requires **vLLM 0.28** and a **CUDA 13** driver (580+). Use image `ghcr.io/gonka-ai/mlnode:3.1.0-vllm-0.28.0` (`sha256:25cccf7d9954678550e47a1f09f12d3db140803e9cd6c289f3af25d34ceabda0`). Do **not** use `3.0.17` for GLM — that image has a first-in-batch PoC artifact that never validates. Node configs and the golden reference are on the [`feat/glm-5-3-flash-release`](https://github.com/gonka-ai/gonka/tree/feat/glm-5-3-flash-release/deploy/join) branch ([gonka-ai/gonka#1734](https://github.com/gonka-ai/gonka/pull/1734)).

## Governance context (proposal 101)

Proposal 101 registers GLM-5.3-Flash as a governance-approved model and adds it to the PoC model set. It removes `moonshotai/Kimi-K2.6` and `zai-org/GLM-5.2-FP8` from `poc_params.models`. Those two ids remain in `GET /v1/governance/models` (inference catalog) but are not PoC models. `MiniMaxAI/MiniMax-M2.7` and `deepseek-ai/DeepSeek-V4-Flash-0731` are unchanged.

The model and its parameters were proposed by the kaitaku.ai team, independently validated by vbgd0, and proposed jointly. Release inputs, measurements and the reasoning behind the thresholds are in [gonka-ai/gonka#1734](https://github.com/gonka-ai/gonka/pull/1734).

Live on-chain values (verify after any later governance change):

- Model: `zai-org/GLM-5.3-Flash` (pinned revision `04c4e9e95c5da8862dced7e5056455116f83a7e0`)
- PoC: `seq_len` 1024, `dist_threshold` 0.44, `p_mismatch` 0.10, `p_value_threshold` 0.05, `weight_scale_factor` **0.62**
- Inference: `validation_threshold` 0.951, `v_ram` 560, `throughput_per_nonce` 1500
- `penalty_start_epoch` **394**
- Voting ended **September 10, 2026 at 23:17 UTC**; the proposal passed

The `weight_scale_factor` was calibrated so that a B200 host switching its PoC model to GLM-5.3-Flash is expected to gain approximately 7% more weight relative to its current weight. For other GPUs the optimal model does not change.

Confirm the live GLM entry:

```bash
curl -s "https://node3.gonka.ai/chain-api/productscience/inference/inference/params" \
  | jq '.params.poc_params.models[] | select(.model_id=="zai-org/GLM-5.3-Flash")'
```

## Timeline

Punishment for missing GLM-5.3-Flash starts at **epoch `394`**. Each epoch the chain attempts to bootstrap the model: it captures a `BootstrapDelegationSnapshot` 500 blocks (`delegation_params.deploy_window`) before that epoch's PoC stage, evaluates pre-eligibility against `V_min = 3` direct committers and a `W_threshold` fraction of total network weight with `>2/3` reachability via INTENT + DELEGATE, and (if pre-eligible) starts PoC for GLM that epoch.

Proposal 101 keeps the current delegation thresholds: `w_threshold = 0.1`, `v_min = 3`, `no_participation_penalty = 0.15`, `refusal_penalty = 0.1`. Still read live values from the chain:

```bash
curl -s "https://node3.gonka.ai/chain-api/productscience/inference/inference/params" \
  | jq '.params.delegation_params | {deploy_window, w_threshold, v_min, no_participation_penalty, refusal_penalty}'
# Decimal fields use {value, exponent}: e.g. {"value":"1","exponent":-1} → 0.1 (10%).
```

To compute the exact block numbers for any given evaluation epoch, anchor on the live current `poc_start_block_height` — do not reconstruct from `epoch_shift`:

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

Eligibility (consensus weight) is a separate check from “listed in `poc_params`” and from live serving. After each PoC, confirm:

- `poc_params.models` — approved PoC catalog
- the epoch’s `sub_group_models` and `confirmation_weight_scales` — whether the group ran PoC and whether it produces consensus weight
- `/v1/epochs/current/participants` — who is serving it

### Possible scenarios

1. **GLM does not pass pre-evaluation in a given epoch's snapshot** (and remains not eligible at PoC):

    - Everyone who submitted `PoCIntent` keeps their full weight (no punishment)
    - Everyone who submitted `PoCDelegation` keeps their full weight (no punishment)
    - **From epoch `394` onwards**: everyone who submitted nothing loses **15%** of their weight per epoch (`no_participation_penalty`); a `PoCRefusal` avoids the 15% miss but still applies `refusal_penalty` (**10%**)

2. **GLM passes pre-evaluation but does not become eligible at PoC** (for example an INTENT host fails to deploy in time):

    - Hosts that actually deployed GLM and submitted GLM PoC commits during this epoch keep their full weight from their existing model groups (no punishment)
    - Everyone who submitted `PoCDelegation` keeps their full weight (no punishment)
    - **From epoch `394` onwards**: everyone who submitted nothing loses 15%; everyone who submitted `PoCIntent` for GLM but did not deploy and submit GLM PoC commits also loses 15% (`IntentMissed`); `PoCRefusal` takes the 10% `refusal_penalty` instead of the 15% miss

If GLM passes both checks, punishment follows the usual scenarios in [Multi-Model PoC](./multi_model_poc.md).

## Hardware and consensus weight

GLM-5.3-Flash is registered with `v_ram = 560` (about **560 GB of total VRAM** per instance). The live `weight_scale_factor` is **0.62**. A model's coefficient only produces consensus weight if that group is eligible (has voting power). Check `poc_params` and `confirmation_weight_scales`.

Practical implications (from the proposal calibration; confirm live coefficients):

- **B200 owners**: GLM is the intended switch. A B200 host moving its PoC model to GLM-5.3-Flash is expected to gain about 7% weight relative to its current weight. Use `node-config-glm53flash-B200.json` (TP=4).
- **B300 owners**: DeepSeek V4 Flash remains the highest-weight option under current coefficients. GLM fits 2×B300 (`node-config-glm53flash-B300.json`) but is not required for max weight.
- **H200 / H100 owners**: MiniMax M2.7 remains the highest-weight model for these classes. GLM configs exist (`node-config-glm53flash-H200.json` on 4×H200, `node-config-glm53flash-H100.json` on 8×H100; `node-config-glm53flash-8xH200.json` is two 4×H200 instances). Switching is optional.
- Full coefficient table: [Google Sheet](https://docs.google.com/spreadsheets/d/1Tw4V7xEXR2p5MbCHqzqjS9vHXQ0eI1IHVXC6guEHnio/edit?gid=0#gid=0)

Set `POC_BATCH_SIZE_DEFAULT` in the join `.env` to **8 on 8×H100, 16 on H200, 32 on B200/B300**. On NVSwitch VMs set `NCCL_NVLS_ENABLE=0`.

## Instructions for hosts who are going to deploy GLM-5.3-Flash

#### 1. Send `PoCIntent` to the chain

Submit before the target epoch's snapshot block. Examples below use the Host key named in `--from`. To submit intent, delegation, or refusal from a warm key, see [How do I declare a PoC intent from a warm key?](../FAQ.md#how-do-i-declare-a-poc-intent-from-a-warm-key).

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

#### 2. Pre-download the weights and verify deployability

Use the pinned Hugging Face revision from the proposal:

- `hf_repo`: `zai-org/GLM-5.3-Flash`
- `hf_commit`: `04c4e9e95c5da8862dced7e5056455116f83a7e0`
- License: **MIT** — see [Model licenses](../model-licenses.md) and the [upstream LICENSE](https://huggingface.co/zai-org/GLM-5.3-Flash/blob/main/LICENSE)

Follow the guide to [pre-download model weights](https://gonka.ai/host/quickstart/#server-pre-download-model-weights-to-hugging-face-cache-hf_home). Plan disk space and bandwidth ahead of the bootstrap window — Hugging Face rate limits during the first attempt can cost eligibility.

Verify the model loads on your hardware **before** the bootstrap snapshot block. You need:

- MLNode **3.1.0** / vLLM **0.28** / CUDA **13** (driver 580+)
- Shipped node configuration: `node-config-glm53flash-*.json` for your GPU class (H100 / H200 / B200 / B300)

The chain registers GLM with `Model.ModelArgs`:

```
--max-model-len 400000
--kv-cache-dtype fp8
--enable-auto-tool-choice
--tool-call-parser glm47
--reasoning-parser glm45
--trust-remote-code
```

Deployment-side flags (`--tensor-parallel-size`, `--gpu-memory-utilization`, `--max-num-batched-tokens`, `--block-size`, `--no-enable-flashinfer-autotune`, and the pinned `--revision`) come from the shipped `node-config` for your hardware — do not invent them from the chain `ModelArgs` alone.

#### 3. Wait for the next evaluation epoch and check pre-eligibility

After each evaluation epoch's snapshot block, the chain emits a `bootstrap_model_preeligibility` event:

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

The key attribute is `pre_eligible`. If it is `true`, the chain will run GLM PoC this epoch and you should be ready to deploy. The supporting fields show which of the three checks passed: `meets_v_min` (≥ `V_min` direct intent committers), `meets_weight_threshold` (intent weight ≥ `W_threshold` of `total_network_weight`), and `meets_reachability` (intent + delegated `reachable_voting_power` covers `>2/3`). `intent_host_count` and `intent_weight` show this epoch's direct intent coverage.

#### 4. Switch the model to GLM-5.3-Flash if pre-eligible

Use the matching shipped config for your GPU class. Example shape of an Admin API update (replace args with the contents of your `node-config-glm53flash-*.json`):

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

The example above is the B200 profile. Merge in the operator flags from the shipped config for H100 / H200 / B300. Membership at PoC start is set by who submits a PoC store commit — declaring intent alone is not enough.

#### 5. Validate your deployment

The committed golden reference is `zai-org-glm-5.3-flash.json` on the [`feat/glm-5-3-flash-release`](https://github.com/gonka-ai/gonka/tree/feat/glm-5-3-flash-release/mlnode/packages/benchmarks/scripts/poc_validation/artifacts) branch (recorded on 4×H200 TP=4). The [`gonka` repo](https://github.com/gonka-ai/gonka) ships an agent skill, `mlnode-validate`, that validates a deployed ML Node against pre-computed honest PoC vectors. See [Validate ML Node Deployment](./mlnode-validation.md) and [`skills/mlnode-validate/SKILL.md`](https://github.com/gonka-ai/gonka/blob/feat/glm-5-3-flash-release/skills/mlnode-validate/SKILL.md).


## Instructions for hosts who are NOT going to deploy GLM-5.3-Flash

Keeping MiniMax or DeepSeek is fine — those PoC entries are unchanged. Per-model participation enforcement for GLM is in effect from epoch **`394`**. If you are not serving GLM, submit a **delegation** (preferred if you trust a GLM host) or a **refusal** so you are not treated as missing the model. Refusal avoids the 15% miss penalty but still costs the 10% `refusal_penalty`. Hosts that already chose DIRECT, DELEGATE, or REFUSE do not need to resubmit.

#### 1. Check if you trust any host who is going to deploy GLM / sent `PoCIntent`

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

When delegating for the bootstrap: **do not delegate to guardian nodes**; spread weight across independent GLM hosts. See [Multi-Model PoC](./multi_model_poc.md) for updated delegation guidance.

#### 2. Send delegation or refusal

Delegation:

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

Refusal:

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
