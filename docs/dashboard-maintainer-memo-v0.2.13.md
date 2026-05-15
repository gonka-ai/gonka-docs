# Dashboard Maintainer Memo For v0.2.13

If the v0.2.13 upgrade proposal passes and the upgrade is successfully executed on mainnet, dashboards will need to update how they compute CPoC confirmation weight and refresh their cache after the upgrade.

This applies to Gonkascan and other similar dashboard deployments.

## Main Dashboard Impacts

### 1. New Confirmation Weight Computation

Dashboards must use the new chain-provided `confirmation_weight_scales` snapshot when computing `weight_to_confirm`.

Simple meaning: the dashboard should stop assuming it can always use current params plus subgroup models. The chain now snapshots which models count for CPoC and what scale factors to use for that epoch.

This is the big required dashboard logic change.

Code references in upgrade v0.2.13:

- `inference-chain/proto/inference/inference/epoch_group_data.proto`: `EpochGroupData.confirmation_weight_scales` and `ConfirmationWeightScale`
- `inference-chain/x/inference/module/confirmation_weight_scales.go`: `buildConfirmationWeightScales`
- `inference-chain/x/inference/types/weight.go`: helper functions for confirmation-weight calculation

Implementation guidance:

1. Fetch root epoch group data:

   ```text
   /chain-api/productscience/inference/inference/current_epoch_group_data
   /chain-api/productscience/inference/inference/epoch_group_data/{epoch_id}
   ```

2. If root `epoch_group_data.confirmation_weight_scales` exists and is non-empty, use it as the source of truth.

3. Iterate only the entries in `confirmation_weight_scales`. Do not additionally include root `sub_group_models` entries that are not present in `confirmation_weight_scales`.

4. For each scale entry:

   ```text
   model_id
   weight_scale_factor
   ```

   fetch that model subgroup:

   ```text
   /chain-api/productscience/inference/inference/epoch_group_data/{epoch_id}?model_id={model_id}
   ```

5. Find the participant in that subgroup's `validation_weights`.

6. Compute raw model weight from that subgroup's ML nodes:

   ```text
   raw_model_weight = sum(validation_weight.ml_nodes[].poc_weight)
   ```

   Do not use root `validation_weight.weight` as this denominator.

7. Scale and floor each model contribution:

   ```text
   scaled_model_weight = floor(raw_model_weight * weight_scale_factor)
   ```

8. Sum across all `confirmation_weight_scales` entries:

   ```text
   weight_to_confirm = sum(scaled_model_weight)
   ```

9. Use root `validation_weights[].confirmation_weight` as the confirmed numerator.

10. If chain participant data has `current_epoch_stats.confirmationPoCRatio`, prefer that as the authoritative displayed ratio.

11. If there is no authoritative chain ratio, local estimate is still:

    ```text
    min((confirmation_weight / weight_to_confirm) / 0.909, 1.0)
    ```

Legacy fallback:

- If `confirmation_weight_scales` is absent or empty, keep the old logic for older epochs: use root `sub_group_models` plus current or historical params model scale factors.
- This fallback is for pre-v0.2.13 data only. For v0.2.13+ epochs, prefer the snapshot.

Note: it is normal for the new method and legacy method to match in simple cases, especially when the only confirmation-scaled model has the same subgroup weight as the sum of its ML-node PoC weights. The important change is the source of truth: `confirmation_weight_scales`.

### 2. Cache Reset Needed After Upgrade

Upgrade v0.2.13 changes some existing chain data in place. It backfills confirmation weight scales, may update confirmation weights, changes model scale params, and adds MiniMax.

Simple meaning: a dashboard may have old cached numbers from before the upgrade, while the chain now has corrected numbers.

After the v0.2.13 upgrade, clear or reset dashboard cache. A redeploy is enough only if it also clears the dashboard cache DB or volume. If the cache DB survives redeploys, manually delete/reset it or add an admin cache reset endpoint.

This should include current epoch rows and recent reward totals. Reward values are read from chain summaries, so this is not a new frontend formula requirement; it is mostly about not keeping old cached totals.

For example, in Gonkascan this means clearing recent rows from `participant_rewards` and `epoch_total_rewards` in the cache DB, so the existing reward polling can refetch `epoch_performance_summary` from chain.

Possible operational step:

```text
After chain upgrade:
- redeploy dashboard
- clear dashboard cache/current epoch cache
- recalculate recent reward totals
```

Small checks while doing the main work:

- Since upgrade v0.2.13 introduces MiniMax, make sure the dashboard reads model IDs from chain state, not from a hardcoded list.
- Make sure MiniMax appearing as a new model does not break model/participant display.

## Practical Checklist

- Update dashboard CPoC `weight_to_confirm` logic for `confirmation_weight_scales`.
- Iterate only models listed in `confirmation_weight_scales` when that snapshot is present.
- Use subgroup ML-node `poc_weight` sums as the raw per-model denominator.
- Continue preferring chain `current_epoch_stats.confirmationPoCRatio` when present.
- After upgrade, reset dashboard cache or redeploy with cache DB cleared.
- Recalculate recent reward totals as part of cache reset.
- Check participant table and modal for weight, collateral, rewards, and confirmation ratio display.
