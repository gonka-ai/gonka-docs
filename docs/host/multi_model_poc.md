# Multi-Model PoC — Host Operations Guide

Upgrade v0.2.12 introduces multi-model Proof-of-Compute (PoC). 

## What changes in v0.2.12

Before v0.2.12, the network operated a single enforced model: `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`. After v0.2.12, the network can support multiple governance-approved models. Each model has its own PoC group, parameters, and weight contribution. Participation is tracked per model. The second model introduced with this upgrade is `moonshotai/Kimi-K2.6`. The Kimi model group is scheduled to activate two epochs after the upgrade. Its coefficient is approximately 3.51× the coefficient of Qwen235B, based on relative compute complexity on the same hardware classes, including 8×H200 and 8×B200.

??? note "Why multi-model PoC works this way"

    The goal of this design is to preserve the same security model (BFT assumptions), while allowing the network to support multiple models without requiring every host to run all of them.
    
    Without delegation:
    
    - Lowering validation thresholds for new models would allow a small subset of the network to accumulate disproportionate influence.
    - Keeping the standard 2/3 threshold would make it very hard to activate new models, since a supermajority of hosts would need to deploy them first.
    
    Delegation solves this:
    
    - Hosts who do not run a model can still contribute their weight to validation
    - New models can bootstrap safely without forcing full network adoption
    - The network preserves its security guarantees while remaining flexible

## Governance model

New models are added through governance: each new model should have its own governance process, parameters, and activation schedule. For every approved model, a host can decide whether to run it, delegate, refuse, or do nothing.

## Scope and prerequisites

**In scope:** model cleanup before upgrade, per-model participation choices, delegation and intent transactions, delegation queries, PoC v2 commit diagnostics, and the chain parameters that affect your choices.

**Signing:** everything in this guide is shown as if you broadcast from your **cold** Host key (`--from` points at that account). *(But permission can be granted to perform delegation using warm keys.)*

**Before you start:** confirm your binary and network expose these commands:

```
./inferenced query inference --help
./inferenced tx inference --help
```

**Further reading (design and fees):** [multi-model PoC proposal README](https://github.com/gonka-ai/gonka/blob/67e205acc46da7cafe330e605b4b22e5d38f2dc7/proposals/multi-model-poc/README.md).

##  Critical: model cleanup before upgrade

If the upgrade happens while your persisted config still contains unsupported models, your node may be rejected and go offline.

!!! warning "Required: clean up unsupported models (do this before upgrade, or immediately after if missed)."

    As the network approaches the upgrade window, hosts should prepare their nodes in advance in case the proposal passes.
    This cleanup process must be completed before the upgrade happens. If you upgrade before cleaning up the models, your node will be rejected and go offline.
    Version 0.2.12 removes every governance model that is not on the post-upgrade approved list. On mainnet, only the previously enforced model and Kimi will remain.
    Each DAPI persists its MLNode configurations locally. On startup, it validates every configured model against the on-chain governance list. If a configuration includes at least one unsupported model, the entire node is rejected, and the host goes offline. 
    
    Version 0.2.11 masked this problem by trimming the runtime view down to the enforced model, so `/admin/v1/nodes` appeared clean even when the persisted config still contained extra models. Version 0.2.12 stops this trimming, meaning the persisted config is loaded directly.
    
    To fix this, the script below finds each node with extra models in `/admin/v1/config` and sends a `PUT` request with a cleaned config to `/admin/v1/nodes/<id>`. These changes are persisted within 60 seconds. The remaining model's arguments, hardware, and ports are preserved exactly. Nodes that do not list the enforced model are skipped and will require manual fixing.
    
    Paste the following script into the host's shell. By default, it will apply the changes. To preview the changes without applying them, set `APPLY=dry` (or any value other than `--apply`).
    
    Script in the repository: 
    
    - [Bash](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/proposals/governance-artifacts/update-v0.2.12/cleanup/cleanup_models.sh)
    - [Python](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/proposals/governance-artifacts/update-v0.2.12/cleanup/cleanup_models.py).
    
    ```bash
    ADMIN=${ADMIN:-http://127.0.0.1:9200}
    KEEP=${KEEP:-Qwen/Qwen3-235B-A22B-Instruct-2507-FP8}
    APPLY=${APPLY:-"--apply"}
    
    curl -sS "$ADMIN/admin/v1/config" | jq -r --arg k "$KEEP" '
      .nodes[] | "\(.id): " + (
        if (.models | has($k) | not) then "skip (\(.models | keys))"
        elif (.models | length) == 1 then "ok"
        else "\(.models | keys) -> [\($k)]" end)'
    
    if [[ "$APPLY" == "--apply" ]]; then
      curl -sS "$ADMIN/admin/v1/config" \
        | jq -c --arg k "$KEEP" \
            '.nodes[] | select((.models | has($k)) and (.models | length > 1)) | .models = {($k): .models[$k]}' \
        | while IFS= read -r p; do
            id=$(jq -r .id <<<"$p")
            curl -sS -f -X PUT -H 'Content-Type: application/json' -d "$p" \
              "$ADMIN/admin/v1/nodes/$id" >/dev/null && echo "$id: updated"
          done
      echo "done; persisted within 60s"
    else
      echo "preview only; rerun without APPLY=dry to commit"
    fi
    ```
    
    
    Wait 60 seconds after running the script to ensure the changes are persisted before triggering the upgrade. Then, verify the configuration:
    
    ```bash
    curl -sS http://127.0.0.1:9200/admin/v1/config \
      | jq '.nodes[] | {id, models: (.models | keys)}'
    ```
    
    Expected output:
    ```json
    {
      "id": "<nodeId>",
      "models": [
        "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8"
      ]
    }
    ```
    *(Additional nodes will follow the same format)*

---

## What should I do? (quick decision guide)

Do you run the model?

```
├─ YES
│  └─ Do nothing → you are fully participating (no penalties)

└─ NO
   ├─ Do you have another node that runs this model?
   │
   │  ├─ YES
   │  │  └─ Delegate to your own node
   │
   │  └─ NO
   │     ├─ Do you trust another host?
   │     │
   │     │  ├─ YES
   │     │  │  └─ Delegate to that host
   │     │
   │     │  └─ NO
   │     │     └─ Refuse delegation (~10% penalty)
   │
   └─ If you do nothing
      └─ Risk highest penalty (~15%)
```

In most cases:

- Delegation is the safest default if you are not running the model
- Doing nothing is the worst option once penalties are enabled

## Recommended actions

If you are not running Kimi:
    
- If you operate multiple nodes and at least one runs Kimi: delegate to your own Kimi node
- If you do not run Kimi at all: delegate to a host you trust
- If you do not trust any delegate: use `refuse-poc-delegation`

Once `penalty_start_epoch` is reached for a model, not participating in that model directly or via valid delegation may reduce your consensus weight, depending on governance-configured parameters.

## Your options (per model)

> To get a list of all governance-approved `model_id` values, run:
> ```
> ./inferenced query inference params --node "$NODE" -o json
> ```
> Look inside `poc_params` → `models`.

| What you want | Command | Why hosts choose it |
|---|---|---|
| Run this model's PoC yourself | *(no separate on-chain "join"; your stack submits the PoC v2 store commit)* | You stay in that model's group for the epoch. |
| Trust another host's validation votes for that model | `set-poc-delegation` | Your weight can count toward their influence on that model's PoC checks, if the rules at validation time are satisfied (see [Does your delegation actually count?](#does-your-delegation-actually-count)). |
| Explicitly opt out of delegating for that model | `refuse-poc-delegation` | Clear "no" to delegation; after penalties turn on for that model, a refusal-style deduction may apply if governance configured it. (see [When your on-chain choices are frozen](#when-your-on-chain-choices-are-frozen) |
| Do nothing extra | *(no tx)* | Default behavior; may result in the highest penalty once enabled|
| Signal plans before a new model is fully live | `declare-poc-intent` | For **bootstrap reporting only**; it does **not** replace running PoC. You still need a store commit in PoC to count as serving the model yourself. See [Bootstrap pre-eligibility events](#bootstrap-pre-eligibility-events). |

### Strategy comparison

| Strategy | Outcome |
|--------|--------|
| Run model | Full participation, no penalty |
| Delegate | Slight weight loss (~5%), avoids penalties |
| Refuse | ~10% weight loss |
| Do nothing | Up to ~15% weight loss if quorum forms without you |

**One stored choice per model:** for each `model_id` and your address, the chain keeps **at most one** of delegate / refuse / intent. A new transaction of any of those three **replaces** the previous one. Serving the model yourself (having a valid store commit for that model in the epoch) wins over those three when the chain applies rules for that epoch.

There is no universal default recommendation. Running, delegating, refusing, or doing nothing is a strategy decision per host and per model.

!!! note "Current mainnet parameters (at time of writing)"

    - `refusal_penalty`: ~10% of your weight
    - `no_participation_penalty`: ~15% (if quorum forms without you)
    - `delegation_share`: ~5% of your weight is transferred to the delegate
    
    These values are governance-controlled and may change. Always verify using `params`.

!!! note "Grace period"

    After the upgrade, penalties for newly introduced models do not apply immediately.
    
    Hosts typically have a short window (~3 days) to:
    
    - deploy the model
    - configure delegation
    - or explicitly refuse
    
    Check `penalty_start_epoch` in `params` for exact timing.

---

## What PoC delegation is

Each **approved model** has its own PoC. Your **consensus weight** from the **previous** epoch still matters for **who can influence PoC validation** on models you do **not** run yourself.

**Delegation** means: for a given `model_id`, you tell the chain how that weight should behave for **validation voting** on that model — either you support someone else's votes, you opt out in writing, you only signal plans for a new model, or you leave the default (no extra transaction).

If you **do** submit a valid **PoC v2 store commit** for that model during the epoch (via your normal PoC stack), you are treated as **running that model's PoC yourself** for that epoch. That **overrides** whatever you had set with delegate / refuse / intent for how your participation is counted.

---

## When your on-chain choices are frozen

The chain reads your settings at **two different times** — they answer different questions and apply to different things.

**1. Start of PoC validation for the epoch**
The chain records **who you delegated to** and **whether you refused**. This applies to models **already in normal operation**. Intent is not read here.

**2. `deploy_window` blocks before the next PoC starts** — height `next_poc_start − deploy_window`
The chain records **delegations and intents** for **bootstrap / pre-eligibility** signals on models **not yet in the normal set**. If `deploy_window` is zero or negative, this second capture does not run.

Whether you **actually ran PoC** for a model is not taken from those stored rows: the chain uses your **PoC v2 store commits** for that model during the epoch.

### Does your delegation actually count?

`set-poc-delegation` can be sent anytime, but it only **helps** the delegate if **at validation start** all of the following hold:

- the delegate **ran PoC** for that `model_id` in that epoch (has the corresponding work committed the usual way), and
- the delegate had **non-zero consensus weight in the previous epoch**.

Otherwise your delegation is ignored for that model for that epoch (same practical outcome as if you had not delegated), and penalty rules may still apply once they are enabled.

When a delegation **does** count, your **full** weight is counted toward that host's influence on validating that model's PoC. Separately, **`delegation_share`** in `params` can move part of your **original** consensus weight to them when weights are finalized — that is a different knob from the refusal / no-participation percentages; read `params` for the exact values.

### Bootstrap pre-eligibility events

If you plan hardware for a **new** model, watch chain events of type **`bootstrap_model_preeligibility`**. Typical attributes include: `model_id`, `pre_eligible`, `meets_weight_threshold`, `meets_v_min`, `meets_reachability`, `intent_host_count`, `intent_weight`, `reachable_voting_power`, `total_network_weight`, `snapshot_height`.

Use them to decide **when** to declare intent and **when** you must have commits live:

- If `pre_eligible = false` and you plan to serve this model: check `meets_weight_threshold` and `meets_v_min`. If both are false, you may not have enough stake.
- If only `meets_reachability` is false, verify your node is reachable before the next capture height.

---

## Copy-paste setup commands

### Session variables (set once in this shell)

Adjust values, then run the block. **All examples below** use `NODE`, `CHAIN_ID`, `KEY` (your **cold** key name in the keyring), and optional `KEYRING_BACKEND`.

```bash
NODE="<PUBLIC_URL>"
CHAIN_ID="gonka-mainnet"
KEY="gonka-account-key"   # cold key; see note at top on warm-key grants
KEYRING_BACKEND="file"

MY_ADDR="$(./inferenced keys show "$KEY" -a --keyring-backend "$KEYRING_BACKEND" 2>/dev/null || true)"
# If keys show fails, set your address explicitly:
# MY_ADDR="gonka1..."
```

Each `tx inference …` example below repeats the same `--from` / `--node` / `--chain-id` / `--keyring-backend` / gas flags so you can copy **one** block without merging lines from elsewhere. If your keyring is already the default, you may omit `--keyring-backend`.

**Optional — fewer repeated flags:** set default RPC node and chain id in the CLI client config for this machine (Cosmos-style `client.toml`; use `./inferenced config --help`). After that you can omit `--node` and `--chain-id` from the transaction lines below.


### Parameters and epoch

```bash
./inferenced query inference params --node "$NODE" -o json
```

```bash
./inferenced query inference get-current-epoch --node "$NODE" -o json
```

### Query delegation state

**All models:**

```bash
./inferenced query inference poc-delegation "$MY_ADDR" --node "$NODE" -o json
```

**One model** (second argument optional):

```bash
./inferenced query inference poc-delegation "$MY_ADDR" "$MODEL" --node "$NODE" -o json
```

The response lists **delegations**, **refusals**, and **intents** separately; for a given model you will have **at most one** of the three.

---

### Transactions

**Delegate** (the delegate need not already be running that model's PoC when you send the tx):

```bash
MODEL="your-model-id"
DELEGATEE="gonka1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

./inferenced tx inference set-poc-delegation "$MODEL" "$DELEGATEE" \
  --from "$KEY" \
  --node "$NODE" \
  --chain-id "$CHAIN_ID" \
  --keyring-backend "$KEYRING_BACKEND" \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

**Clear delegation:**

```bash
MODEL="your-model-id"

./inferenced tx inference set-poc-delegation "$MODEL" "" \
  --from "$KEY" \
  --node "$NODE" \
  --chain-id "$CHAIN_ID" \
  --keyring-backend "$KEYRING_BACKEND" \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

**Refuse:**

```bash
MODEL="your-model-id"

./inferenced tx inference refuse-poc-delegation "$MODEL" \
  --from "$KEY" \
  --node "$NODE" \
  --chain-id "$CHAIN_ID" \
  --keyring-backend "$KEYRING_BACKEND" \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

**Bootstrap intent:**

```bash
MODEL="your-model-id"

./inferenced tx inference declare-poc-intent "$MODEL" \
  --from "$KEY" \
  --node "$NODE" \
  --chain-id "$CHAIN_ID" \
  --keyring-backend "$KEYRING_BACKEND" \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

---

## Penalties and parameters

Penalties and the delegation share apply to **consensus weight** when the next epoch's active set is built, **after** PoC outcomes are known. Everything below comes from `./inferenced query inference params` (JSON fields vary slightly by version; search inside the output for these names).

| Where in `params` | Field | Meaning for hosts |
|---|---|---|
| Per model in `poc_params` → `models` | `penalty_start_epoch` | Before this epoch index, penalty rules for **that model** do not apply. Track per `model_id`. |
| Per model in `poc_params` → `models` | `weight_scale_factor` | Scales that model's PoC weight into consensus weight. |
| `delegation_params` | `refusal_penalty` | Fraction of your original consensus weight removed when you used `refuse-poc-delegation` after `penalty_start_epoch`. |
| `delegation_params` | `no_participation_penalty` | Fraction removed when you did not refuse, did not have a valid delegation, and did not serve the model yourself — after penalties apply. |
| `delegation_params` | `delegation_share` | Fraction of the delegator's original weight reallocated to the delegate when delegation is valid. |
| `delegation_params` | `deploy_window` | Blocks before the next PoC start at which the bootstrap snapshot height is chosen (`next_poc_start − deploy_window`). |

**Advanced eligibility parameters** (most hosts can skip): `w_threshold`, `v_min`, `cap_factor`, `initial_model_id`, `max_model_voting_power_percentage` — eligibility thresholds, caps, and per-model voting concentration limits. Zero on the last usually means "no cap".

If **`refusal_penalty`**, **`no_participation_penalty`**, and **`delegation_share`** are all **zero**, the chain does not apply those deductions or transfers (common right after upgrade until governance enables them).

---

## Host checklist

1. Before the upgrade, clean your persisted MLNode config so it contains only supported models.
2. Prefer one logical model per ML node where possible. Misconfiguration is easier when several models exist on the same node.
3. After upgrade, confirm `params` lists every model you care about under `poc_params`.
4. Check each model’s `penalty_start_epoch`.
5. Check whether `refusal_penalty`, `no_participation_penalty`, and `delegation_share` are non-zero.
6. For each model, decide whether you want to run it, delegate, refuse, or do nothing.
7. If you run the model yourself, make sure your PoC stack submits valid PoC v2 store commits for that model.
8. If you delegate, verify the result with `poc-delegation`.
9. For new models, watch `bootstrap_model_preeligibility` events and send `declare-poc-intent` before the capture height if you plan to participate.
10. After any config change, restart, or new host onboarding, make sure no unsupported models are present in the persisted DAPI configuration.
