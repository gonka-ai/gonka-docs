# Multi-Model PoC — Host Operations Guide

This guide is for **hosts** using Upgrade **v0.2.12** and the multi-model Proof-of-Compute (PoC) system. It explains **what to configure on-chain**, **why it matters**, and **which `./inferenced` commands to run**.  

**In scope:** delegation and intent transactions, delegation queries, PoC v2 commit diagnostics, and the chain parameters that affect your choices.

**Signing:** everything in this guide is shown as if you broadcast from your **cold** Host key (`--from` points at that account). *(But permission can be granted to perform delegation using warm keys.)*

**Before you start:** confirm your binary and network expose these commands:

```bash
./inferenced query inference --help
./inferenced tx inference --help
```

**Further reading (design and fees):** [multi-model PoC proposal README](https://github.com/gonka-ai/gonka/blob/67e205acc46da7cafe330e605b4b22e5d38f2dc7/proposals/multi-model-poc/README.md), [host_onboarding.md](https://github.com/gonka-ai/gonka/blob/67e205acc46da7cafe330e605b4b22e5d38f2dc7/docs/host_onboarding.md) (v0.2.12 fee changes).

---

## What PoC delegation is

Each **approved model** has its own PoC. Your **consensus weight** from the **previous** epoch still matters for **who can influence PoC validation** on models you do **not** run yourself.

**Delegation** means: for a given `model_id`, you tell the chain how that weight should behave for **validation voting** on that model — either you support someone else’s votes, you opt out in writing, you only signal plans for a new model, or you leave the default (no extra transaction).

If you **do** submit a valid **PoC v2 store commit** for that model during the epoch (via your normal PoC stack), you are treated as **running that model’s PoC yourself** for that epoch. That **overrides** whatever you had set with delegate / refuse / intent for how your participation is counted.

---

## Your options (per model)

| What you want | Command | Why Hosts choose it |
|---------------|---------|-------------------------|
| Run this model’s PoC yourself | *(no separate on-chain “join”; your stack submits the PoC v2 store commit)* | You stay in that model’s group for the epoch. |
| Trust another host’s validation votes for that model | `set-poc-delegation` | Your weight can count toward their influence on that model’s PoC checks, **if** the rules at validation time are satisfied (see [When your on-chain choices are frozen](#when-your-on-chain-choices-are-frozen)). |
| Explicitly opt out of delegating for that model | `refuse-poc-delegation` | Clear “no” to delegation; after penalties turn on for that model, a **refusal**-style deduction may apply if governance configured it. |
| Do nothing extra | *(no tx)* | Default; after penalties turn on, a **no-participation**-style deduction may apply if governance configured it. |
| Signal plans before a new model is fully live | `declare-poc-intent` | For **bootstrap** reporting only; it does **not** replace running PoC. You still need a store commit in PoC to count as serving the model yourself. |

**One stored choice per model:** for each `model_id` and your address, the chain keeps **at most one** of delegate / refuse / intent. A new transaction of any of those three **replaces** the previous one. **Serving the model yourself** (having a valid store commit for that model in the epoch) wins over those three when the chain applies rules for that epoch.

---

## Copy-paste setup and commands

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

Each **`tx inference …`** example below repeats the same `--from` / `--node` / `--chain-id` / `--keyring-backend` / gas flags so you can copy **one** block without merging lines from elsewhere. If your keyring is already the default, you may omit `--keyring-backend`.

**Optional — fewer repeated flags:** set default **RPC node** and **chain id** in the CLI client config for this machine (Cosmos-style `client.toml`; exact commands depend on your `inferenced` version — use `./inferenced config --help`). After that you can omit `--node` and `--chain-id` from the transaction lines below.

### Parameters and epoch

```bash
./inferenced query inference params --node "$NODE" -o json
```

```bash
./inferenced query inference get-current-epoch --node "$NODE" -o json
```

### Delegate, clear, refuse, intent

Delegate (the delegate need not already be running that model’s PoC **when you send** the tx; see [When your on-chain choices are frozen](#when-your-on-chain-choices-are-frozen)):

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

Clear delegation:

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

Refuse:

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

Bootstrap intent:

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

### Query delegation state

All models:

```bash
./inferenced query inference poc-delegation "$MY_ADDR" --node "$NODE" -o json
```

One model (second argument optional):

```bash
./inferenced query inference poc-delegation "$MY_ADDR" "$MODEL" --node "$NODE" -o json
```

The response lists **delegations**, **refusals**, and **intents** separately; for a given model you will have **at most one** of the three.

---

## When your on-chain choices are frozen

The chain reads your settings at **two different times**; they answer different questions.

1. **Start of PoC validation for the epoch** — the chain records **who you delegated to** and **whether you refused**, for use while that epoch’s PoC is validated. **Intent is not read here.** This is what matters for models that are already in normal operation.

2. **`deploy_window` blocks before the *next* PoC starts** — height **`next_poc_start − deploy_window`** (not “current PoC start minus window”). Here the chain records **delegations and intents** for **bootstrap / pre-eligibility** signals on models that are not yet fully in the normal set. If `deploy_window` is zero or negative, this second capture does not run.

Whether **you actually ran PoC** for a model is **not** taken from those stored rows: the chain uses your **PoC v2 store commits** for that model during the epoch.

### Does your delegation actually count?

`set-poc-delegation` can be sent anytime, but it only **helps** the delegate if **at validation start** all of the following hold:

- the delegate **ran PoC** for that `model_id` in that epoch (has the corresponding work committed the usual way), and  
- the delegate had **non-zero consensus weight in the previous epoch**.

Otherwise your delegation is ignored for that model for that epoch (same practical outcome as if you had not delegated), and penalty rules may still apply once they are enabled.

When a delegation **does** count, your **full** weight is counted toward that host’s **influence on validating that model’s PoC**. Separately, **`delegation_share`** in `params` can move part of your **original** consensus weight to them when weights are finalized — that is a different knob from the refusal / no-participation percentages; read **`params`** for the exact values.

---

## Penalties and parameters (what hosts read from `params`)

Penalties and the delegation share apply to **consensus weight** when the next epoch’s active set is built, **after** PoC outcomes are known. Everything below comes from **`./inferenced query inference params`** (JSON fields vary slightly by version; search inside the output for these names).

| Where in `params` | Field | Meaning for hosts |
|-------------------|--------|-------------------|
| Per model in `poc_params` → `models` | `penalty_start_epoch` | Before this **epoch index**, the refusal / no-participation / delegation-share rules for **that model** do not apply. Track **per `model_id`**. |
| Per model in `poc_params` → `models` | `weight_scale_factor` | Scales that model’s PoC weight into **consensus** weight. |
| `delegation_params` | `refusal_penalty` | Fraction of your **original** consensus weight removed when you used **`refuse-poc-delegation`** for that model after `penalty_start_epoch`. |
| `delegation_params` | `no_participation_penalty` | Fraction removed when you did **not** refuse, **did not** have a valid delegation, and **did not** serve the model yourself — after penalties apply (and analogous bootstrap cases if governance enabled them). |
| `delegation_params` | `delegation_share` | Fraction of the delegator’s **original** weight **reallocated** to the delegate when delegation is valid — separate from the penalty percentages. |
| `delegation_params` | `deploy_window` | Blocks **before the next PoC start** at which the **bootstrap** snapshot height is chosen (`next_poc_start − deploy_window`). |
| `delegation_params` | `w_threshold`, `v_min`, `cap_factor`, `initial_model_id`, `max_model_voting_power_percentage` | Eligibility, caps, and per-model voting concentration limits. Zero on the last usually means “no cap”. |

If **`refusal_penalty`**, **`no_participation_penalty`**, and **`delegation_share`** are all **zero**, the chain does not apply those deductions or transfers (common right after upgrade until governance enables them).

---

## Bootstrap pre-eligibility events

If you plan hardware for a **new** model, watch chain events of type **`bootstrap_model_preeligibility`**. Typical attributes include: `model_id`, `pre_eligible`, `meets_weight_threshold`, `meets_v_min`, `meets_reachability`, `intent_host_count`, `intent_weight`, `reachable_voting_power`, `total_network_weight`, `snapshot_height`. Use them to decide **when** to declare intent and **when** you must have commits live.

---

## Transactions (Host notes)

- Transactions use your **cold** Host key on `--from` in the examples above (unless you have set up a grant for a warm key). There is no separate “creator” field for Hosts to set.
- **`model_id`** must be a **governance-approved** model the chain knows about.
- **`delegate_to`** must be a **known participant address**; it does **not** have to already be running that model’s PoC when you send the transaction. If at **validation start** they are not running that model’s PoC for the epoch or had **no** weight last epoch, your delegation does **not** count for that model (and penalties may apply once turned on). See [Does your delegation actually count?](#does-your-delegation-actually-count).

Use `--help` on each command for the full flag list:

```bash
./inferenced tx inference set-poc-delegation --help
./inferenced tx inference refuse-poc-delegation --help
./inferenced tx inference declare-poc-intent --help
./inferenced query inference poc-delegation --help
```

---

## Host checklist

1. Prefer **one logical model per ML node** where possible; misconfiguration is easy when several models exist.
2. Before each model’s **`penalty_start_epoch`**, decide whether to **delegate**, **refuse**, or leave the default; read **`params`** for that model’s epoch and for non-zero penalty fractions (all zero means penalties/transfers off).
3. For new models, watch **`bootstrap_model_preeligibility`** and send **`declare-poc-intent`** in time for the capture at **`next_poc_start − deploy_window`**. Intent does not replace running PoC — you still need a store commit to count as serving the model yourself.
4. After **`set-poc-delegation`**, verify with **`poc-delegation`** for your address and model.
5. After upgrade, confirm **`params`** lists every model you care about under **`poc_params`** and that **`delegation_params`** matches what governance announced.
