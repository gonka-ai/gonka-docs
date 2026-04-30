# Governance Voting Power and Genesis Guardians

## How is the total bonded weight calculated?

The total bonded weight is the sum of `validator.tokens` across all bonded validators with `tokens > 0`:

```text
total_bonded = Σ validator.tokens   (over all bonded validators with tokens > 0)
```

Each validator's `tokens` value is set on every epoch transition by the inference module via `Staking.SetComputeValidators()`.
For the vast majority of validators:

```text
validator.tokens = participant.weight   (their PoC weight in the current epoch)
```

For the Genesis Guardians, an additional power-enhancement step is applied first (see below).

## Who are the Genesis Guardians?

A small set of bootstrap validators operated by the project team, hardcoded into chain params. They receive a temporary power boost so that their combined stake exceeds the 33% governance veto threshold.

The current Genesis Guardian set on the live network is:

- `gonkavaloper1y2a9p56kv044327uycmqdexl7zs82fs5lyang5` (`gonka-1`)
- `gonkavaloper1dkl4mah5erqggvhqkpc8j3qs5tyuetgdc59d0v` (`gonka-2`)
- `gonkavaloper1kx9mca3xm8u8ypzfuhmxey66u0ufxhs70mtf0e` (`gonka-3`)

This list is governance-configurable (`genesis_guardian_params.guardian_addresses`) and is not expected to change during the bootstrap phase.

Mechanism is documented in the official proposal:

- [Early network protection proposal](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)

Purpose:

- Prevent a 67% takeover of consensus during the early, low-stake phase.
- Block malicious governance proposals via the developer veto authority.
- Provide rapid-response capability against protocol exploits.
- Make cheap majority acquisition during bootstrap economically uninteresting.

## How is the Guardian power boost calculated?

Before `SetComputeValidators` runs, the inference module applies `applyEarlyNetworkProtection`, which computes enhanced power as follows:

```text
other_total         = total_network_power − Σ guardian_original_power
total_enhancement   = other_total × multiplier          # multiplier = 0.52
per_guardian_power  = total_enhancement / guardian_count

guardian.tokens     = per_guardian_power                # original PoC weight is REPLACED
non_guardian.tokens = participant.weight                # unchanged
```

Effect:

- The combined Guardian share lands at `multiplier / (1 + multiplier) = 0.52 / 1.52 ≈ 34%` of total bonded.
- Enough for veto (`>33%`), not enough to pass proposals (`>50%` required).
- Cannot extract value or unilaterally change consensus, coordination among the Guardians is required for any action.
- With 3 Guardians, each ends up with approximately `17.3%` of total bonded (`0.52 / 3`).

## When does the Guardian boost end?

The enhancement deactivates automatically (no governance vote required) when both of the following on-chain conditions are met:

```text
total_network_power >= network_maturity_threshold      (currently 15,000,000)
current_height      >= network_maturity_min_height     (currently 3,000,000)
```

Current status on the live network:

- The height threshold (`3,000,000`) has already been crossed.
- Total network power is still well below `15,000,000`, so the boost remains active.
- The boost will switch off in the first epoch transition after the network's aggregate PoC weight crosses `15,000,000`; at that point, Guardian validators' `tokens` will equal their PoC weight, just like every other validator.

Both thresholds are governance-tunable (`network_maturity_threshold` and `network_maturity_min_height`), so the activation cut-off can be adjusted by a successful governance proposal if needed.


## Governance delegation (cold key to warm key)

If the key that holds voting power is not the key used for day-to-day operations, governance voting permission can be granted in advance via `authz`:

- Granter = account that owns voting power (cold key)
- Grantee = account that submits votes on the granter's behalf (warm key)

This delegation only allows governance voting and can be revoked by the granter.

### 1) Grant voting permission (run from granter key)

```bash
./inferenced tx authz grant <GRANTEE_GONKA_ADDRESS> generic \
  --msg-type=/cosmos.gov.v1beta1.MsgVote \
  --from=<GRANTER_KEY_NAME> \
  --chain-id=gonka-mainnet \
  --expiration=<UNIX_TIMESTAMP> \
  --home .inference \
  --keyring-backend file
```

### 2) Verify the grant exists

```bash
./inferenced query authz grants <GRANTER_GONKA_ADDRESS> <GRANTEE_GONKA_ADDRESS> \
  --node "<NODE_URL>/chain-rpc/" \
  --output=json | jq .
```

### 3) Vote using grantee

```bash
./inferenced query gov proposals --output json
```

```bash
cat > /tmp/authz-vote.json << 'AUTHZ_VOTE'
{
  "body": {
    "messages": [
      {
        "@type": "/cosmos.authz.v1beta1.MsgExec",
        "grantee": "<GRANTEE_GONKA_ADDRESS>",
        "msgs": [
          {
            "@type": "/cosmos.gov.v1beta1.MsgVote",
            "proposal_id": "<VOTE_PROPOSAL_ID>",
            "voter": "<GRANTER_GONKA_ADDRESS>",
            "option": "VOTE_OPTION_YES"
          }
        ]
      }
    ]
  }
}
AUTHZ_VOTE
```

```bash
./inferenced tx authz exec /tmp/authz-vote.json --from=<GRANTEE_KEY_NAME>
```

## Eligibility summary

| Status | Can vote? | Vote weight |
|---|---|---|
| Active participant, in epoch | Yes | `= participant.weight` |
| Genesis Guardian, in epoch | Yes | `= (other_total × 0.52) / guardian_count` (boosted) |
| Failed PoC last epoch (INACTIVE) | No | `0` |
| Failed CPoC, removed from epoch | No | `0` |
| Jailed validator | No | `0` (until unjailed + re-bonded) |
| Bonded validator with `tokens = 0` | No | `0` |
| Delegator (manual `MsgDelegate` stake) | Yes | `= their share of the validator's tokens` |
