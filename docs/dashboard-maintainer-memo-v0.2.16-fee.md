# v0.2.16 fee check for dashboard maintainers

## What pays the fee

The host node signs with the warm key and sets the cold account as `fee_granter`. The chain withdraws the fee from the cold account, and only up to the cold-to-warm feegrant.

Two numbers both have to be large enough. The usable amount is the smaller of them.


| Number                 | What it is                                                            | Query                                                  |
| ---------------------- | --------------------------------------------------------------------- | ------------------------------------------------------ |
| Feegrant allowance     | Cap the warm key may charge to the cold account. It is not a balance. | `GET /cosmos/feegrant/v1beta1/allowance/{cold}/{warm}` |
| Cold spendable balance | Coins the cold account can actually spend                             | `GET /cosmos/bank/v1beta1/spendable_balances/{cold}`   |


A 10 GNK allowance with 0 spendable GNK cannot pay a fee. Vesting coins cannot pay a fee. A balance on the warm key cannot pay a fee while the node sets the cold account as `fee_granter`. Show the warm balance so a misplaced transfer is visible, and do not add it into the usable amount.

Denom on the wire is `ngonka`. Display GNK as `amount / 1_000_000_000`.

## Whom to check

Check members of the current epoch group. They submit the paid messages `MsgPoCV2StoreCommit` and `MsgSubmitHardwareDiff`. Registered participants outside that group do not submit those messages on a schedule.

```http
GET /productscience/inference/inference/current_epoch_group_data
```

Use each `epoch_group_data.validation_weights[].member_address` as the cold account.

## Find the warm key that pays

```http
GET /cosmos/authz/v1beta1/grants/granter/{cold}
```

Page with `pagination.limit` and `pagination.key` until `pagination.next_key` is empty.

A paying warm key is a grantee whose grant `authorization.msg` is either:

- `/inference.inference.MsgPoCV2StoreCommit`
- `/inference.inference.MsgSubmitHardwareDiff`

`MsgClaimRewards` is not enough. That message stays free, and a cold account often has extra claim-only grants that are not the key the node uses to submit StoreCommit or HardwareDiff.

## Read the allowance

```http
GET /cosmos/feegrant/v1beta1/allowance/{cold}/{warm}
```

`{cold}` is the granter and `{warm}` is the grantee. A missing grant comes back as `fee-grant not found`.

For a `BasicAllowance`:

- `spend_limit` is the remaining cap in `ngonka`. It shrinks as fees are charged. An empty `spend_limit` means unlimited.
- `expiration` must be in the future. Compare it to the current block time, not to the clock on the dashboard server.

Usable fee amount:

```text
usable = min(cold spendable ngonka, remaining allowance)
```

Use the cold spendable amount alone when the allowance is unlimited.

Also list every grant the cold account has issued:

```http
GET /cosmos/feegrant/v1beta1/issued/{cold}
```

If this list names a different grantee than the StoreCommit or HardwareDiff key, the node may be signing with a key that has no allowance. Judge the key that holds those two message grants.

## Read balances

```http
GET /cosmos/bank/v1beta1/spendable_balances/{address}
GET /cosmos/bank/v1beta1/balances/{address}
GET /productscience/inference/streamvesting/total_vesting/{address}
```

Run all three for the cold account and for each paying warm key.


| Field                                  | Counts as able to pay                                                                                                                      |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Cold `spendable_balances` for `ngonka` | Yes. This is the fee source.                                                                                                               |
| Cold `balances`                        | Display only. It can match spendable when nothing is locked in the bank module.                                                            |
| Cold `total_vesting`                   | No. Rewards sit here until they unlock. A host can show millions of GNK vesting and still have 0 spendable.                                |
| Warm `spendable_balances`              | No. Show it. If it is non-zero while the cold spendable amount is short, say the coins are on the warm key and the node will not use them. |




## What to flag

Flag the host when any of these is true:

- No grantee is authorized for StoreCommit or HardwareDiff.
- That grantee has no cold-to-warm feegrant, or the grant is expired.
- The remaining allowance is below one epoch of fees.
- The cold spendable balance is below one epoch of fees.

Show cold spendable, cold vesting, warm spendable, and the remaining allowance on the same row. Do not collapse them into one "balance" figure.

A typical epoch for a current host is well under 1 GNK. The 10 GNK default allowance is a sufficient cap when the cold account actually holds spendable coins. The failure mode seen on chain is a valid 10 GNK allowance with 0 cold spendable and 0 warm spendable, while vesting holds the rewards.