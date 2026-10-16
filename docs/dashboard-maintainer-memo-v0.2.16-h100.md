# H100 equivalent on dashboards

Read this for the v0.2.16 upgrade, proposal 112. If it passes, the upgrade height is 6,449,400, expected around 8 October 2026, 05:48 UTC. Proposal 109 did not pass. The coefficient and weight rules below are for proposal 112.

## What the number is

H100 equivalent is the current network reward weight divided by the reward weight one reference H100 receives in that same epoch:

```text
H100_eq = total_weight / weight_per_h100
```

It is a reward-weight equivalent. It is not a count of physical GPUs, and it is not difficulty-normalized compute.

On epoch 410, `total_weight` is **497,724**. It comes from `current_epoch_group_data.total_weight` and equals the sum of `validation_weights[].weight` for the 24 active participants.
Every dashboard that shows this metric uses that numerator. The published figures differ because the denominator differs.
## What dashboards show on epoch 410
| Dashboard | Shown figure | Denominator |
| --- | --- | --- |
| [gonka.gg](https://gonka.gg/) | 1,102, labeled "GPU (H100 median weight)" | Live median across hosts that report H100s only, including H100 PCIe. Median is 451.7. `497,724 / 451.7 = 1,102` |
| [tracker.gonka.vip](https://tracker.gonka.vip/) | ~1,087 H100 GPUs | Same live method, restricted to `NVIDIA H100 80GB HBM3`. Four such hosts, median 457.3. `497,724 / 457.3 = 1,088` |
| [tracker.gonka.hyperfusion.io](https://tracker.gonka.hyperfusion.io/) | ~1,960 H100 GPUs | Fixed `254` for every epoch ≥ 175. Earlier epochs use 440, then 284. `497,724 / 254 = 1,960` |
| [gonkascan.com](https://gonkascan.com/) | 1,956 H100 GPUs | Fixed `254.5`, the 19 February 2026 post-normalization weight of one H100 80GB HBM3 (epoch 176). `497,724 / 254.5 = 1,956` |
| [gonkahub.com/network](https://gonkahub.com/network) | ~1,960 H100 GPUs | The chart is labeled "Weight ÷ 254.5 (H100 HBM3)". Same frozen February benchmark. |
| [gnk.space](https://gnk.space/) | ~1,710 | Fixed `291`. The page uses `network_weight_h100` when that API field is set. It is empty, so the page falls back to `totalWeight / 291`. `497,724 / 291 = 1,710` |

gonka.gg also shows "Total Physical GPUs: 642". That is a different metric: the self-reported GPU inventory of active hosts. It is not an H100 equivalent. The inventory moves when hosts update their hardware report.
H100 80GB HBM3 and H100 PCIe are different cards. On epoch 410 a pure H100 80GB HBM3 host produces about **457** weight per GPU. A pure H100 PCIe host produces about **245**. Leave PCIe out of the sample.
## What changes if v0.2.16 passes
The query paths stay the same. The numerator stays the root `total_weight`, the sum of `validation_weights[].weight`. That number already includes the epoch's effective coefficient. Do not multiply `validation_weights[].weight` by a coefficient again.
The body of `current_epoch_group_data` does change. On the upgrade epoch and after, `confirmation_weight_scales[].weight_scale_factor` is cleared and `effective_coefficient` is set. Epochs formed before the upgrade still have `weight_scale_factor` and no `effective_coefficient`. `poc_params.models[].weight_scale_factor` is cleared at the upgrade. Reading it as the live coefficient returns an empty value.
Model coefficients start moving. Governance sets a target share of compute and a coefficient range per model. Each epoch the protocol steps a base coefficient inside that range. Compute above the target share is scored at the minimum coefficient, so the effective coefficient used for reward weight can sit below the base. The table is the starting bounds, not the coefficient applied on later epochs.
Initial ranges apply from the epoch after the upgrade. The upgrade epoch itself keeps today's reward weights.

| Model | At upgrade | Allowed range | Model ID |
| --- | --- | --- | --- |
| MiniMax M2.7 | 0.3024 | Fixed at 0.3024 | `MiniMaxAI/MiniMax-M2.7` |
| GLM 5.3 Flash | 0.62 | 0.558–0.682 | `zai-org/GLM-5.3-Flash` |
| DeepSeek V4 Flash 0731 | 0.246 | 0.2214–0.2706 | `deepseek-ai/DeepSeek-V4-Flash-0731` |
| Any other enabled model | Its current scale | That scale × [0.9, 1.1] | From chain params |

The same physical H100 then earns a different reward weight depending on which model it serves and whether that model is above its target share. `poc_weight` is still raw. Multiply it by that model's `effective_coefficient` before the median, and keep nodes from every model in one sample. List those model ids next to the headline.
MiniMax starts pinned: `coeff_min` and `coeff_max` are both 0.3024. A model is pinned when those two bounds are equal on that epoch's frozen `config`. Governance can later open MiniMax's range, or pin a different model, without resetting the controller. Do not hardcode MiniMax. The unit stays one H100 80GB HBM3. Do not switch the headline to B200 or B300.
A divisor frozen at 254, 254.5, 291, or a previous epoch's 488 was already taken from an older epoch. It will drift further on every epoch after the upgrade.
Group caps and collateral still change a participant's root reward weight. That root weight is the wrong numerator for one H100: a host that posted no collateral looks like weaker cards. The per-GPU sample is `poc_weight × effective_coefficient / card count`. Do not divide the host's root reward weight by its card count. Do not replace the denominator with a benchmark throughput times a coefficient.

A second change in this upgrade does not belong in this metric. Governance, BLS, and PoC validation power are limited to compute confirmed in the previous epoch. New capacity still earns rewards immediately. The numerator is the root epoch group's `total_weight`. `voting_power` on the root epoch group is 0 for every participant. It is filled only on model subgroups, and it is not the capacity figure.

This upgrade also restores JSON numbers on `/v1/epochs/latest`, `/v1/epochs/{epoch}/participants`, and `/v1/bls/*`. Enums stay names. Keep accepting the v0.2.15 string shape until every host you query has upgraded. See the [v0.2.15 memo](./dashboard-maintainer-memo-v0.2.15.md). `/v1/versions` is unchanged.

## How to calculate it

Recompute once per epoch, after that epoch's weights are in `current_epoch_group_data`. During PoC the chain has two epoch pointers. Follow this endpoint. Do not derive the epoch from block height.

Reference card: **NVIDIA H100 80GB HBM3** only. The headline stays H100. Do not switch it to B200 or B300.

The sample is qualifying H100 nodes on active CometBFT validators. Mixed hosts stay in. Keeping a host only when every reported GPU is an H100 drops cards that share a machine with another card. If every such host adds one other card, that sample is empty.

1. `GET /chain-api/productscience/inference/inference/current_epoch_group_data`
   Take `epoch_index`, `total_weight`, `sub_group_models`, and each `validation_weights[]` entry: `member_address` and `weight`. `total_weight` is the numerator. It already includes the effective coefficient. Do not divide a member's root `weight` by its card count.
2. `GET /chain-api/productscience/inference/inference/hardware_nodes_all`
   Keep rows whose `participant` is in this epoch's `validation_weights`. Drop the rest. The unfiltered list is historical. It currently contains 4,455 records and is not the live network.
3. `GET /chain-api/cosmos/base/tendermint/v1beta1/validatorsets/latest`
   Keep a participant only when `participant.validator_key` equals a validator `pub_key.key`. `validator_key` is on `GET /chain-api/productscience/inference/inference/participant/{member_address}`. RTX 5090s are on epoch members who are not validators. Leave those members out.
4. On each kept hardware node, require `status` = `INFERENCE` and a `hardware[].type` that starts with `NVIDIA H100 80GB HBM3`. Live reports append ` | 79GB`. H100 PCIe is a different card. Leave it out. Another card on the same host does not remove this node. GPU type is self-reported. The chain does not verify it.
5. For each `model_id` in `sub_group_models`:

   ```text
   GET /chain-api/productscience/inference/inference/epoch_group_data/{epoch_index}?model_id={model_id}
   ```

   Match the hardware node's `local_id` to `ml_nodes[].node_id`. Keep the node when that entry's `poc_weight` > 0. Use that model's `effective_coefficient`.
6. `poc_weight` is raw. Per GPU on that node is `poc_weight × effective_coefficient / card count`. Card count is that node's `hardware[].count` for types that start with `NVIDIA H100 80GB HBM3`. `effective_coefficient` is already documented below. Do not multiply `validation_weights[].weight` by a coefficient again. Do not divide the host's root reward weight by its card count.
7. `weight_per_h100` = median of those per-GPU values. With an even count, average the two central values.
8. `H100_eq = total_weight / weight_per_h100`. `total_weight` stays the root epoch group's `total_weight`.

If this epoch has no qualifying H100 node, omit the headline. Do not reuse the previous epoch's denominator. A previous epoch's 488 must not be reused while this epoch has live H100 nodes.

### Epoch 410 check

This check uses the pre-upgrade sample: every pure H100 80GB HBM3 host, not a single reference model.

Four pure H100 80GB HBM3 hosts, weight per GPU: 451.69, 452.38, 462.29, 466.50.

Median = 457.33.

`497,724 / 457.33 = 1,088`.

It matches tracker.gonka.vip (~1,087). gonka.gg's 1,102 uses the same formula with three H100-PCIe-only hosts included, which moves the median from 457.3 to 451.7.

That 1,088 figure is the historical check only. Later epochs, including the upgrade epoch and epoch 420, use the node sample above, including mixed hosts. Do not reuse 457.33.

### Epoch 420

On the live epoch 420 reading, `total_weight` is **669,024**.

11 qualifying nodes, 64 H100 80GB HBM3 cards, all `INFERENCE`, all with `poc_weight` > 0.

MiniMax `effective_coefficient` is 0.3024. DeepSeek is 0.2706.

Per GPU, low to high: 233, 237, 263, 344, 350, 394, 441, 458, 458, 458, 458.

Median `weight_per_h100` is 394.4 (the 6th of 11).

`669,024 / 394.4 = 1,696`.

1,180 and 488 are the old pure-host fallback, not this epoch's `weight_per_h100`. Pairing this reading's `total_weight` with 488 gives 1,371, not 1,180. 1,180 matches a total weight of about 575,840.

## What to display

- Headline: **H100 equivalent**, the result of the division. Keep H100 as the unit. On epoch 410 the pre-upgrade check is about **1,088**.
- Next to the headline: `weight_per_h100`, the node count, the card count, the model ids, and that mixed hosts are included. "weight per H100 80GB HBM3, N nodes, C cards, {model_ids}, mixed hosts included".
- Physical GPU count, if you show it, is a separate row. Label it as self-reported inventory.
- The headline on gonka.gg, "H100 median weight: 1,102", is the equivalent count, not the median. Label the equivalent as H100 equivalent and show the median separately.
- Label the card as reward-weight equivalent. A shift toward a higher-coefficient model can change this number without changing the number of GPUs.

Refresh `weight_per_h100` every epoch from that epoch's qualifying nodes. Do not carry forward the previous epoch's denominator. The first epoch that uses the new coefficient ranges is the epoch after the upgrade, not the upgrade epoch itself.

## If you also show model coefficients

Stop reading `poc_params.models[].weight_scale_factor` as the live coefficient. After the upgrade it is empty.

The reward multiplier for an epoch is `effective_coefficient`:

```text
GET /chain-api/productscience/inference/inference/dynamic_coefficients/{epoch_index}
```

`epoch_index = 0` means the current epoch. The same entries are on the root epoch group as `confirmation_weight_scales`.

For each model:

- `effective_coefficient` is the multiplier already included in `validation_weights[].weight`. This is the number to chart as the coefficient. Raw `poc_weight` does not include it. The per-GPU sample multiplies by it once.
- `base_coefficient` is the controller value before oversupply dilution. Show it beside the effective value. They differ when the model's compute share is above its target.
- `config.coeff_min`, `config.coeff_max`, `config.target_share_bps`, and `config.relative_difficulty` are the bounds, target, and difficulty frozen for that epoch. Target share is `target_share_bps / 10000`. The table above is only the initial bounds.
- `poc_params.models[].dynamic_coefficient` is the live governance bounds for the next PoC. It is not the coefficient used for the current epoch.

Decode every `Decimal` as `value × 10^exponent`. `value` and `exponent` may arrive as numbers or strings. `{value: 3024, exponent: -4}` is 0.3024.

Epochs formed before v0.2.16 have no `effective_coefficient`. Use `weight_scale_factor` for those epochs. The upgrade epoch already has `effective_coefficient` set to the old scale.

Skip entries with `exclude_from_confirmation = true`. During PoC, the upcoming epoch can already have `config` while `effective_coefficient` is still empty. That coefficient is not computed yet. Do not substitute the governance bounds or 1.

The [v0.2.13 confirmation-weight steps](./dashboard-maintainer-memo-v0.2.13.md) scale raw PoC weight by `weight_scale_factor`. For the upgrade epoch and after, use `effective_coefficient` in that formula when it is present, and `weight_scale_factor` only when it is absent.
