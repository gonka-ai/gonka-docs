# H100 equivalent on dashboards
Please read this before the v0.2.16 upgrade. If proposal 109 passes, the upgrade height is 6,353,400, expected around 2 October 2026, 07:05 UTC.
## What the number is
H100 equivalent is the current network weight divided by the weight one H100 receives in that same epoch:
```text
H100_eq = total_weight / weight_per_h100
```
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
The H100-equivalent endpoints do not change. `current_epoch_group_data` and `hardware_nodes_all` stay as they are. Reward weight stays on `validation_weights[].weight`.
Model coefficients start moving. Governance sets a target share of compute and a coefficient range per model. Each epoch the protocol steps the coefficient inside that range. Compute above the target share is scored at the minimum coefficient.
Initial ranges apply from the epoch after the upgrade. The upgrade epoch itself keeps today's reward weights.
| Model | At upgrade | Allowed range |
| --- | --- | --- |
| MiniMax M2.7 | 0.3024 | Fixed at 0.3024 |
| GLM 5.3 Flash | 0.62 | 0.558–0.682 |
| DeepSeek V4 Flash 0731 | 0.246 | 0.2214–0.2706 |
| Any other enabled model | Its current scale | That scale × [0.9, 1.1] |
The same physical H100 then earns a different consensus weight depending on which model it serves and whether that model is above its target share. A divisor frozen at 254, 254.5, or 291 was already taken from an older epoch. It will drift further on every epoch after the upgrade.
A second change in this upgrade does not belong in this metric. Governance, BLS, and PoC validation power are limited to compute confirmed in the previous epoch. New capacity still earns rewards immediately. Build H100 equivalent from `validation_weights[].weight`, the reward weight. `voting_power` on the root epoch group is 0 for every participant. It is filled only on model subgroups, and it is not the capacity figure.
## How to calculate it
Recompute once per epoch, after that epoch's weights are in `current_epoch_group_data`. During PoC the chain has two epoch pointers. Follow this endpoint. Do not derive the epoch from block height.
Reference card: **NVIDIA H100 80GB HBM3** only.
1. `GET /chain-api/productscience/inference/inference/current_epoch_group_data`
   Take `epoch_index`, `total_weight`, and each `validation_weights[]` entry: `member_address` and `weight`.
2. `GET /chain-api/productscience/inference/inference/hardware_nodes_all`
   Keep rows whose `participant` is in this epoch's `validation_weights`. Drop the rest. The unfiltered list is historical. It currently contains 4,455 records and is not the live network.
3. Keep a participant only when every reported GPU is `NVIDIA H100 80GB HBM3`. One H100 PCIe, H100 NVL, or unlabeled `gpu` removes the host from the sample. GPU type is self-reported. The chain does not verify it. The filter is what keeps mixed servers from changing the per-GPU weight.
4. For each remaining participant, `sample = weight / h100_count`.
5. Denominator = median of those samples. With an even count, average the two central values.
6. `H100_eq = total_weight / denominator`.
If fewer than 3 pure hosts exist, keep the previous epoch's denominator and label the figure as carried forward.
### Epoch 410 check
Four pure H100 80GB HBM3 hosts, weight per GPU: 451.69, 452.38, 462.29, 466.50.
Median = 457.33.
`497,724 / 457.33 = 1,088`.
That is the figure to standardize on. It matches tracker.gonka.vip (~1,087). gonka.gg's 1,102 uses the same formula with three H100-PCIe-only hosts included, which moves the median from 457.3 to 451.7.
## What to display
- Headline: **H100 equivalent**, the result of the division. On epoch 410 this is about **1,088**.
- Next to it: the denominator and the sample size. Example: "457 weight per H100 80GB HBM3, 4 hosts".
- Physical GPU count, if you show it, is a separate row. Label it as self-reported inventory.
- The headline on gonka.gg, "H100 median weight: 1,102", is the equivalent count, not the median. Label the equivalent as H100 equivalent and show the median separately.
Refresh the denominator every epoch from that epoch's weights. The first epoch that uses the new coefficient ranges is the epoch after the upgrade, not the upgrade epoch itself.
