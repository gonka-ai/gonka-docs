# H100 equivalent on dashboards
Please read this before the v0.2.16 upgrade. If proposal 109 passes, the upgrade height is 6,353,400, expected around 2 October 2026, 07:05 UTC.
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
Two cards must not be mixed. On epoch 410 a pure H100 80GB HBM3 host produces about **457** weight per GPU. A pure H100 PCIe host produces about **245**.
## What changes if v0.2.16 passes
The query paths stay the same. Reward weight stays on `validation_weights[].weight`. That number already includes the epoch's effective coefficient. Do not multiply it by a coefficient again.
The body of `current_epoch_group_data` does change. On the upgrade epoch and after, `confirmation_weight_scales[].weight_scale_factor` is cleared and `effective_coefficient` is set. Epochs formed before the upgrade still have `weight_scale_factor` and no `effective_coefficient`. `poc_params.models[].weight_scale_factor` is cleared at the upgrade. Reading it as the live coefficient returns an empty value.
Model coefficients start moving. Governance sets a target share of compute and a coefficient range per model. Each epoch the protocol steps a base coefficient inside that range. Compute above the target share is scored at the minimum coefficient, so the effective coefficient used for reward weight can sit below the base. The table is the starting bounds, not the coefficient applied on later epochs.
Initial ranges apply from the epoch after the upgrade. The upgrade epoch itself keeps today's reward weights.

| Model | At upgrade | Allowed range | Model ID |
| --- | --- | --- | --- |
| MiniMax M2.7 | 0.3024 | Fixed at 0.3024 | `MiniMaxAI/MiniMax-M2.7` |
| GLM 5.3 Flash | 0.62 | 0.558–0.682 | `zai-org/GLM-5.3-Flash` |
| DeepSeek V4 Flash 0731 | 0.246 | 0.2214–0.2706 | `deepseek-ai/DeepSeek-V4-Flash-0731` |
| Any other enabled model | Its current scale | That scale × [0.9, 1.1] | From chain params |

The same physical H100 then earns a different reward weight depending on which model it serves and whether that model is above its target share. Hosts on different models are different units, so the median has to come from hosts that all serve one model.
MiniMax starts pinned: `coeff_min` and `coeff_max` are both 0.3024. A model is pinned when those two bounds are equal on that epoch's frozen `config`. Governance can later open MiniMax's range, or pin a different model, without resetting the controller. Do not hardcode MiniMax. Each epoch, read the bounds and choose the reference model from them.
A divisor frozen at 254, 254.5, or 291 was already taken from an older epoch. It will drift further on every epoch after the upgrade.
Group caps and collateral still change reward weight independently of the coefficient. The median of observed `validation_weights[].weight` already includes them. Do not replace the denominator with a benchmark throughput times a coefficient.

A second change in this upgrade does not belong in this metric. Governance, BLS, and PoC validation power are limited to compute confirmed in the previous epoch. New capacity still earns rewards immediately. Build H100 equivalent from `validation_weights[].weight`, the reward weight. `voting_power` on the root epoch group is 0 for every participant. It is filled only on model subgroups, and it is not the capacity figure.

## How to calculate it

Recompute once per epoch, after that epoch's weights are in `current_epoch_group_data`. During PoC the chain has two epoch pointers. Follow this endpoint. Do not derive the epoch from block height.

Reference card: **NVIDIA H100 80GB HBM3** only.

Through the upgrade epoch, inclusive, the sample is every pure H100 80GB HBM3 host. From the next epoch on, keep hosts that serve only that epoch's reference model.

1. `GET /chain-api/productscience/inference/inference/current_epoch_group_data`
   Take `epoch_index`, `total_weight`, `sub_group_models`, and each `validation_weights[]` entry: `member_address` and `weight`. Use this root `weight` as the host's reward weight. It already includes the effective coefficient.
2. `GET /chain-api/productscience/inference/inference/hardware_nodes_all`
   Keep rows whose `participant` is in this epoch's `validation_weights`. Drop the rest. The unfiltered list is historical. It currently contains 4,455 records and is not the live network.
3. Keep a participant only when every reported GPU is `NVIDIA H100 80GB HBM3`. One H100 PCIe, H100 NVL, or unlabeled `gpu` removes the host from the sample. GPU type is self-reported. The chain does not verify it. The filter is what keeps mixed servers from changing the per-GPU weight.
4. From the first epoch that uses the new ranges, assign each pure host to the single model it serves. For each `model_id` in `sub_group_models`:

   ```text
   GET /chain-api/productscience/inference/inference/epoch_group_data/{epoch_index}?model_id={model_id}
   ```

   A participant serves that model when that subgroup's `validation_weights` entry for them has `weight` > 0. Drop a participant who serves more than one model. Group the rest by that one model.
5. Choose the reference model for this epoch:
   - A model is pinned when its frozen `config.coeff_min` and `config.coeff_max` decode to the same number. At upgrade, that model is `MiniMaxAI/MiniMax-M2.7`.
   - Among pinned models with at least 3 pure H100 hosts, use the one with the most such hosts. Tie: lowest `model_id`.
   - If no pinned model has 3 such hosts, use the single model with the most pure H100 hosts, pinned or not. Tie: lowest `model_id`. The denominator then follows that model's effective coefficient. Label the model and the coefficient so the movement is visible.
   - Do not take a median across models.
6. For each host on the reference model, `sample = weight / h100_count`, using the root reward weight from step 1.
7. Denominator = median of those samples. With an even count, average the two central values.
8. `H100_eq = total_weight / denominator`.

If fewer than 3 hosts remain on the chosen model:

- Through the upgrade epoch, keep the previous epoch's denominator and label the figure as carried forward.
- After that, keep the denominator from the previous epoch that used this same reference `model_id`, and label it carried forward. Do not reuse 457.33 or any other pre-upgrade denominator. Do not carry a denominator across a change of reference model. If this model has no prior denominator, omit the headline for that epoch.

### Epoch 410 check

This check uses the pre-upgrade sample: every pure H100 80GB HBM3 host, not a single reference model. Publish it through the upgrade epoch.

Four pure H100 80GB HBM3 hosts, weight per GPU: 451.69, 452.38, 462.29, 466.50.

Median = 457.33.

`497,724 / 457.33 = 1,088`.

That is the figure to standardize on until the new ranges apply. It matches tracker.gonka.vip (~1,087). gonka.gg's 1,102 uses the same formula with three H100-PCIe-only hosts included, which moves the median from 457.3 to 451.7.

The headline can move on the first epoch that uses the new ranges because the sample changes from all pure HBM3 hosts to hosts on one reference model. At upgrade that model is MiniMax, because it is the pinned model. If governance later unpins it, the same rule selects whatever model is pinned, or the single model with the most pure H100 hosts. Show the sample label next to the headline so the jump is explained.

## What to display

- Headline: **H100 equivalent**, the result of the division. On epoch 410 this is about **1,088**.
- Next to it: the denominator, the sample size, and the reference model. Through the upgrade epoch: "457 weight per H100 80GB HBM3, 4 hosts". From the next epoch: "weight per H100 80GB HBM3 on {model_id}, effective coefficient {effective_coefficient}, N hosts".
- Physical GPU count, if you show it, is a separate row. Label it as self-reported inventory.
- The headline on gonka.gg, "H100 median weight: 1,102", is the equivalent count, not the median. Label the equivalent as H100 equivalent and show the median separately.
- Label the card as reward-weight equivalent. A shift toward a higher-coefficient model can change this number without changing the number of GPUs.

Refresh the denominator every epoch from that epoch's weights. The first epoch that uses the new coefficient ranges is the epoch after the upgrade, not the upgrade epoch itself.

## If you also show model coefficients

Stop reading `poc_params.models[].weight_scale_factor` as the live coefficient. After the upgrade it is empty.

The reward multiplier for an epoch is `effective_coefficient`:

```text
GET /chain-api/productscience/inference/inference/dynamic_coefficients/{epoch_index}
```

`epoch_index = 0` means the current epoch. The same entries are on the root epoch group as `confirmation_weight_scales`.

For each model:

- `effective_coefficient` is the multiplier already included in `validation_weights[].weight`. This is the number to chart as the coefficient.
- `base_coefficient` is the controller value before oversupply dilution. Show it beside the effective value. They differ when the model's compute share is above its target.
- `config.coeff_min`, `config.coeff_max`, `config.target_share_bps`, and `config.relative_difficulty` are the bounds, target, and difficulty frozen for that epoch. Target share is `target_share_bps / 10000`. The table above is only the initial bounds.
- `poc_params.models[].dynamic_coefficient` is the live governance bounds for the next PoC. It is not the coefficient used for the current epoch.

Decode every `Decimal` as `value × 10^exponent`. `value` and `exponent` may arrive as numbers or strings. `{value: 3024, exponent: -4}` is 0.3024.

Epochs formed before v0.2.16 have no `effective_coefficient`. Use `weight_scale_factor` for those epochs. The upgrade epoch already has `effective_coefficient` set to the old scale.

Skip entries with `exclude_from_confirmation = true`. During PoC, the upcoming epoch can already have `config` while `effective_coefficient` is still empty. That coefficient is not computed yet. Do not substitute the governance bounds or 1.

The [v0.2.13 confirmation-weight steps](./dashboard-maintainer-memo-v0.2.13.md) scale raw PoC weight by `weight_scale_factor`. For the upgrade epoch and after, use `effective_coefficient` in that formula when it is present, and `weight_scale_factor` only when it is absent.
