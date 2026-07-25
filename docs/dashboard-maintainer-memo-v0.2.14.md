# Dashboard Maintainer Memo — Gonka v0.2.14

No existing query endpoint was removed or reshaped in this upgrade. If your dashboard reads values from the chain and displays them, it keeps working. There is one semantic change you need to understand (delegation), and three small notes.

## 1. Delegation: weight vs reward

**Before (v0.2.13):** when A delegated to B, the chain physically moved part of A's weight to B *before* storing weights. The `weight` you read from the chain already included delegation. Rewards followed that adjusted weight automatically.

**Now (v0.2.14):** the chain stores everyone's *own* weight, untouched by delegation. Delegation is applied later, only inside reward settlement, on an internal copy of the weights that is never exposed as a chain field. (Refusal/no-participation penalties also became reward-only and no longer shrink stored weight.)

What this means for you, depending on what your dashboard does:

- **You display `weight` read from the chain** (`epoch_group_data` → `validation_weights[].weight`, or `get_participant_current_stats`): keep doing exactly that. Still correct. Just know the number no longer includes delegation effects — a participant who delegates away keeps their full displayed weight.
- **You recompute weights yourself and apply delegation on top:** stop applying delegation. The chain doesn't anymore.
- **You estimate expected rewards as "participant weight ÷ total weight × epoch pot":** this is now wrong whenever delegation, refusal penalties, or exclusions exist. Use the new endpoint instead:

  `GET /chain-api/productscience/inference/inference/estimate_bitcoin_reward/{participant}`

  It replays the same math the chain uses at settlement — delegation transfers, penalties, exclusions included — and returns the estimated reward and work coins. The estimate is for the current epoch: its inputs are snapshotted when the epoch is formed (at the end of PoC validation) and refreshed at every epoch transition, so the endpoint answers throughout the whole epoch. A NotFound response means the participant is not in the current epoch's active set.

If you want to show delegation itself: who delegates to whom is at `.../poc_delegation/{participant}`, and the share parameter is in `params` (`delegation_params.delegation_share`).

## 2. Note: reward recipient override

Participants can now register a different address to receive their claimed rewards. Nothing about their identity, weight, or stats changes — only where the coins land.

This is not a compatibility break. It matters only if your dashboard claims or assumes "rewards for participant X always go to address X" — that's no longer guaranteed. Per-participant reward amounts from `epoch_performance_summary` / `settle_amount` are still keyed by participant and stay correct. If you want to show the override, it's at `.../list_claim_recipients/{participant}`.

## 3. Note: one-time supply step-down

At the upgrade height, the chain burns the accumulated fee-collector balance (amount determined at runtime, so unknown until it happens) and sets mint inflation to zero. If you chart or estimate total supply, expect a one-time drop at the upgrade block and a flat inflation line after. The usual `/cosmos/bank/v1beta1/supply/by_denom?denom=ngonka` query keeps working.

## 4. Note: deprecated inference endpoints

On the dapi public API, `/v1/chat/completions`, `/v1/completions`, and everything under `/v1/devshard` now return HTTP 410 Gone (inference is now served by the versioned devshard runtime, e.g. `/devshard/v3`). Only relevant if you were pinging these as a host liveness check. `/v1/epochs/...`, participants, models, pricing, status — all untouched.
