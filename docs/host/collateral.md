# Collateral

Collateral mechanism allows participants to lock GNK coins in order to activate a portion of their already earned Proof of Compute (PoC) weight.

Voting power is never derived solely from holding coins. GNK coins serve as economic collateral, not as a source of influence. Influence is earned through continuous computational contribution, while locking GNK collateral is required to secure participation in governance and enforce accountability.

## Key Concepts

- For the first 180 epochs (Grace Period), no collateral is required. All participants receive 100% of their potential weight unconditionally.
- After the grace period, a portion of a participant's weight (default 20%) is granted unconditionally as Base Weight.
- The remaining weight (default 80%) is Collateral-Eligible Weight and must be backed by deposited collateral. This ensures that participants with significant governance power also bear proportional economic responsibility.
- The final Active Weight is the sum of Base Weight and the weight activated by collateral. Active Weight is used for all PoC-weighted governance decisions.

Assume all `$NODE_URL` is URL of node with enabled chain rpc and chain api.


## Parameters

### Get Current Collateral Parameters (On-chain)

```bash
curl "$NODE_URL/chain-api/productscience/inference/inference/params" | jq '.params.collateral_params'
```

- `slash_fraction_invalid` - percent of collateral slashed for invalid inferences (max once per epoch).
- `slash_fraction_downtime` - percent of collateral slashed for downtime (Confirmation PoC failure / jail).
- `downtime_missed_percentage_threshold` - deprecated, not used.
- `base_weight_ratio` - percent of weight Host can have without collateral.
- `collateral_per_weight_unit` - collateral required per each weight unit.

## Compute collateral per weight

To estimate the **minimum** collateral required to fully back a specific weight, you need two parameters from the chain: `collateral_per_weight_unit` (the cost per unit of weight) and `base_weight_ratio` (the portion of weight granted unconditionally, without collateral).

Only the **collateral-eligible** portion of weight needs backing:

`required_collateral = weight × (1 − base_weight_ratio) × collateral_per_weight_unit`

```bash
WEIGHT=1000

PARAMS=$(curl -s "$NODE_URL/chain-api/productscience/inference/inference/params")

COLLATERAL_PER_UNIT=$(echo "$PARAMS" | jq -r '.params.collateral_params.collateral_per_weight_unit
  | (.value | tonumber) * pow(10; .exponent | tonumber)')

BASE_WEIGHT_RATIO=$(echo "$PARAMS" | jq -r '.params.collateral_params.base_weight_ratio
  | (.value | tonumber) * pow(10; .exponent | tonumber)')

REQUIRED=$(echo "$WEIGHT * (1 - $BASE_WEIGHT_RATIO) * $COLLATERAL_PER_UNIT" | bc -l)
printf "Minimum required collateral: %.0f ngonka\n" "$REQUIRED"
```

For example, with default parameters (`base_weight_ratio = 0.2`, `collateral_per_weight_unit = 1`) and `WEIGHT=1000`, the minimum required collateral is `1000 × 0.8 × 1 = 800 ngonka`.

> **Why `(1 − base_weight_ratio)`?** Each participant receives `weight × base_weight_ratio` (default 20%) as base weight unconditionally. Only the remaining `weight × (1 − base_weight_ratio)` (default 80%) must be backed by collateral. Depositing more than this minimum is safe but does not activate any additional weight beyond your potential weight — the chain takes `min(collateral-eligible weight, weight that the deposit can cover)`. See the [Recommended Buffer](#recommended-buffer) section below for guidance on overshooting the minimum.

## Recommended Buffer

Because PoC weight may fluctuate between epochs (due to normalization and other factors), depositing the exact minimum required amount may lead to temporary under-collateralization. Smaller weights may experience proportionally larger relative fluctuations. It is recommended to deposit up to 2x while collateral levels remain relatively small. This provides operational safety and prevents unintended weight reduction at the epoch boundary. The protocol does not auto-top-up collateral.

## Deposit Collateral

Depositing collateral is a three-step flow: check what you currently have, deposit additional `ngonka`, then verify the new balance.

!!! warning "Timing"
    Collateral must be on-chain **before the end of the PoC validation stage** of the epoch in which you want it to count. The chain reads your current collateral balance once per epoch when it computes weights for the next epoch — there is no auto-top-up. To be safe, deposit before your node enters its next PoC stage.

### 1. Check current collateral

Replace `<GONKA_ACCOUNT_ADDRESS>` with the address you want to inspect (your own or someone else's).

Via CLI:

```bash
./inferenced query collateral show-collateral <GONKA_ACCOUNT_ADDRESS> \
    --node $NODE_URL/chain-rpc/
```

Or via API:

```bash
curl "$NODE_URL/chain-api/productscience/inference/collateral/collateral/<GONKA_ACCOUNT_ADDRESS>"
```

If no collateral has ever been deposited for this address, the response will be empty or return a not-found error — that is expected.

### 2. Deposit collateral

Always use the `ngonka` denomination. The transaction is signed by the participant's **Account Key (cold key)**:

```bash
./inferenced tx collateral deposit-collateral <COLLATERAL_SIZE>ngonka \
  --from gonka-account-key \
  --keyring-backend file \
  --node $NODE_URL/chain-rpc/ \
  --chain-id gonka-mainnet
```

To compute a sensible `<COLLATERAL_SIZE>` for a given target weight, see [Compute collateral per weight](#compute-collateral-per-weight) above. For the recommended safety margin, see [Recommended Buffer](#recommended-buffer).

Deposits are **cumulative**: running this command multiple times adds to the existing balance. To free locked collateral, use `withdraw-collateral` (see the [Withdraw Collateral](#withdraw-collateral) section below).

### 3. Verify the deposit

After the transaction is included in a block, re-run the check from step 1 with your own address. The `amount` field should equal your previous balance plus the deposited amount.

```bash
MY_ADDR=$(./inferenced keys show gonka-account-key -a --keyring-backend file)
curl -s "$NODE_URL/chain-api/productscience/inference/collateral/collateral/$MY_ADDR" | jq
```

The deposit is now on-chain. It will activate the corresponding portion of your weight at the **next epoch boundary**, when the chain re-computes weights at the end of the PoC validation stage. If you deposited mid-epoch, do not expect your weight to change immediately — wait one epoch.

## Withdraw Collateral

When you withdraw collateral, it is moved to an unbonding queue. The unbonding period lasts for a specific number of epochs (default is 1 epoch). During this period, the collateral is still subject to slashing.

After the unbonding period ends, the collateral is automatically returned to your account balance.

To check the unbonding period (in epochs):

```bash
curl -s "$NODE_URL/chain-api/productscience/inference/collateral/params" | jq '.params.unbonding_period_epochs'
```

To withdraw collateral:

```bash
./inferenced tx collateral withdraw-collateral <COLLATERAL_SIZE>ngonka \
  --from gonka-account-key \
  --keyring-backend file \
  --node $NODE_URL/chain-rpc/ \
  --chain-id gonka-mainnet
```

To check unbonding collateral:

```bash
./inferenced query collateral show-unbonding-collateral <GONKA_ACCOUNT_ADDRESS> \
    --node $NODE_URL/chain-rpc/
```

Or via API:

```bash
curl "$NODE_URL/chain-api/productscience/inference/collateral/unbonding/<GONKA_ACCOUNT_ADDRESS>"
```

## Slashing

Collateral can be slashed for two reasons:

- **Invalid inference** - when a participant submits an invalid inference result.
- **Downtime** - when a participant fails Confirmation PoC or is jailed.

To check if your collateral was slashed:

```bash
curl "$NODE_URL/chain-api/cosmos/tx/v1beta1/txs?query=slash_collateral.participant='<GONKA_ACCOUNT_ADDRESS>'"
```

For automatic slashing events (e.g. jail) that occur during block processing (BeginBlock), use the block search RPC.

First find the block where slashing occurred:
```bash
curl "$NODE_URL/chain-rpc/block_search?query=\"slash_collateral.participant='<GONKA_ACCOUNT_ADDRESS>'\""
```

Then query the block results to see the slash details (replace `BLOCK_HEIGHT` with the height found above):
```bash
curl "$NODE_URL/chain-rpc/block_results?height=<BLOCK_HEIGHT>" | jq '.result.finalize_block_events[] | select(.type == "slash_collateral")'
```

For common questions, see the [Collateral FAQ](https://gonka.ai/FAQ/#collateral).
