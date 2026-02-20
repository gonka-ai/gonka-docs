# Collateral

Collateral mechanism allows participants to lock GNK coins in order to activate a portion of their already earned Proof of Compute (PoC) weight.

Voting power is never derived solely from holding coins. GNK coins serve as economic collateral, not as a source of influence. Influence is earned through continuous computational contribution, while locking GNK collateral is required to secure participation in governance and enforce accountability.

### Key Concepts

- For the first 180 epochs (Grace Period), no collateral is required. All participants receive 100% of their potential weight unconditionally.
- After the grace period, a portion of a participant's weight (default 20%) is granted unconditionally as Base Weight.
- The remaining weight (default 80%) is Collateral-Eligible Weight and must be backed by deposited collateral. This ensures that participants with significant governance power also bear proportional economic responsibility.
- The final Active Weight is the sum of Base Weight and the weight activated by collateral. Active Weight is used for all PoC-weighted governance decisions.

Assume all `$NODE_URL` is URL of node with enabled chain rpc and chain api.


## Parameters

1. Get Current Collateral Parameters (On-chain)
```
curl "$NODE_URL/chain-api/productscience/inference/inference/params" | jq '.params.collateral_params'
```

- `slash_fraction_invalid` - percent of collateral slashed for invalid inferences (max once per epoch).
- `slash_fraction_downtime` - percent of collateral slashed for downtime (Confirmation PoC failure / jail).
- `downtime_missed_percentage_threshold` - deprecated, not used.
- `base_weight_ratio` - percent of weight Host can have without collateral.
- `collateral_per_weight_unit` - collateral required per each weight unit.


## Compute collateral per weight

To estimate the collateral required for a specific weight:

```bash
WEIGHT=1000
COLLATERAL_PER_UNIT=$(curl -s "$NODE_URL/chain-api/productscience/inference/inference/params" \
  | jq -r '.params.collateral_params.collateral_per_weight_unit 
           | (.value | tonumber) * pow(10; .exponent | tonumber)')
printf "Required collateral: %.0f ngonka\n" "$(echo "$WEIGHT * $COLLATERAL_PER_UNIT" | bc -l)"
```

!!! note "Recommended Buffer"
    Because PoC weight may fluctuate between epochs (due to normalization and other factors), depositing the exact minimum required amount may lead to temporary under-collateralization. Smaller weights may experience proportionally larger relative fluctuations. It is recommended to deposit up to 2x while collateral levels remain relatively small. This provides operational safety and prevents unintended weight reduction at the epoch boundary. The protocol does not auto-top-up collateral.

## Deposit Collateral

Collateral must be deposited before the start of the epoch.

To check for existing collateral, you can use:

```bash
./inferenced query collateral show-collateral <GONKA_ACCOUNT_ADDRESS> \
    --node $NODE_URL/chain-rpc/
```

Or via API:

```bash
curl "$NODE_URL/chain-api/productscience/inference/collateral/collateral/<GONKA_ACCOUNT_ADDRESS>"
```


Always use `ngonka` to deposit new collateral:

```bash
./inferenced tx collateral deposit-collateral <COLLATERAL_SIZE>ngonka \
  --from gonka-account-key \
  --keyring-backend file \
  --node $NODE_URL/chain-rpc/ \
  --chain-id gonka-mainnet
```


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
