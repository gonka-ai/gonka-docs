# Dashboard Maintainer Memo — Gonka v0.2.15

v0.2.15 changed the wire format of a few `/v1` query endpoints as a side effect of an internal API refactor. A follow-up patch will restore the previous shapes; once it ships, hosts upgrade independently: **for a transition period, the endpoints below can answer in either shape depending on which host you query.** Please accept both. This ambiguity is limited to the endpoints and fields listed here — no need to generalize it; everything else is unchanged and single-shape.

Below, "v0.2.15 shape" is what hosts return today; "restored shape" is the pre-0.2.15 format that patched hosts will return.

## 1. `/v1/epochs/latest` — params nested and stringified

Affected field: `epoch_params`.

- restored shape: `epoch_params.epoch_length` = `40320` (number)
- v0.2.15 shape: `epoch_params.epoch_params.epoch_length` = `"40320"` (string; whole object nested one level deeper, all int fields as strings)

Robust read: if `epoch_params.epoch_params` exists, descend into it; parse numeric fields accepting both number and string.

Also: `active_confirmation_poc_event` may be `null` or absent — treat both as "no event".

## 2. `/v1/epochs/{epoch}/participants` — numbers as strings

`{epoch}` is an epoch number or the literal `current`.

Affected field: `active_participants`. In the v0.2.15 shape its numeric fields (`created_at_block_height`, `poc_start_block_height`, `effective_block_height`, `epoch_group_id`, `epoch_id`, and numeric fields inside `participants[]`) are strings. Restored shape: numbers. Accept both for this object only.

## 3. `/v1/versions` — `mlnodes` may be missing

The v0.2.15 shape returns only `timestamp` / `api_version` / `node_version`. The restored shape includes the `mlnodes` array (empty array if the host has none). A missing `mlnodes` key means "host not yet patched", not "no ML nodes".

## 4. Small permanent changes (intentional, will not be reverted)

- Optional empty values are omitted rather than emitted: `hugging_face_id` in `/v1/models` is absent when unset (was `""`); `active_confirmation_poc_event` is absent when inactive. Treat absent as empty.
- `/v1/poc-batches/{epoch}` returns 404 when there are no batches (was 200 with an empty list).
- Some `/v1` responses from the per-host API now carry a `Deprecation: true` header: read endpoints are gradually moving to the edge-api service (same paths, same shapes). Nothing to change today.
- `/v1/bls/*` has the same string/enum-name flip in the v0.2.15 shape — only relevant if you read BLS data.

## 5. Appendix: proof verification bundle — skip unless you verify proofs

`/v1/epochs/{epoch}/participants`, fields `block`, `proof_ops`, `validators`:

- v0.2.15 shape: `block` is an SDK-style block (string height, base64 hashes); `validators[].voting_power` is a string
- restored shape: CometBFT block JSON (numeric `header.height`, hex-uppercase hashes); numeric `voting_power`

If you only display participants and weights, this section does not apply to you.
