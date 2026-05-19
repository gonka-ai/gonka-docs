# Voting Power, Genesis Guardians and Delegation

## Total bonded weight calculation

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

---

## Genesis Guardians

A small set of bootstrap validators operated by the project team, hardcoded into chain params. They receive a temporary power boost so that their combined stake exceeds the 33% governance veto threshold.

??? note "Current Genesis Guardian set on the live network"
    - `gonkavaloper1y2a9p56kv044327uycmqdexl7zs82fs5lyang5` (`gonka-1`)
    - `gonkavaloper1dkl4mah5erqggvhqkpc8j3qs5tyuetgdc59d0v` (`gonka-2`)
    - `gonkavaloper1kx9mca3xm8u8ypzfuhmxey66u0ufxhs70mtf0e` (`gonka-3`)

This list is governance-configurable (`genesis_guardian_params.guardian_addresses`) and is not expected to change during the bootstrap phase.

Mechanism is documented in the official proposal:

- [Early network protection proposal](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)

???+ note "Purpose"
    - Prevent a 67% takeover of consensus during the early, low-stake phase.
    - Block malicious governance proposals via the developer veto authority.
    - Provide rapid-response capability against protocol exploits.
    - Make cheap majority acquisition during bootstrap economically uninteresting.

---

### Guardian power boost calculation

Before `SetComputeValidators` runs, the inference module applies `applyEarlyNetworkProtection`, which computes enhanced power as follows:

```text
other_total         = total_network_power − Σ guardian_original_power
total_enhancement   = other_total × multiplier          # multiplier = 0.52
per_guardian_power  = total_enhancement / guardian_count

guardian.tokens     = per_guardian_power                # original PoC weight is REPLACED
non_guardian.tokens = participant.weight                # unchanged
```

**Effect:**

- The combined Guardian share lands at `multiplier / (1 + multiplier) = 0.52 / 1.52 ≈ 34%` of total bonded.
- Enough for veto (`>33%`), not enough to pass proposals (`>50%` required).
- Cannot extract value or unilaterally change consensus, coordination among the Guardians is required for any action.
- With 3 Guardians, each ends up with approximately `11.4%` of total bonded (`0.52 / (3 × 1.52)`).

---

### Guardian boost end conditions

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

---


## Governance delegation (cold key to warm key)

If the key that holds voting power is not the key you use for day-to-day operations, governance voting permission can be granted in advance.

In this setup:

- Granter = account that owns voting power (cold key)
- Grantee = account that will submit votes on the granter’s behalf (warm key)

???+ note "You want to vote, but you do not have access to the key that holds the voting power."
    Please contact the owner of that key and ask them to grant your key permission to vote on their behalf. Without this authorization, your key cannot submit a governance vote for that voting power.

### Another key votes on your behalf

Use the grant command below from the key that holds the voting power. This will authorize the grantee key to submit governance votes for you.
This delegation only allows voting on governance proposals. The grantee can still vote for their own key as well. The granter can revoke this permission at any time.

#### 1. Grant voting permission (run from the granter key)
=== "Command"

    ```
    ./inferenced tx authz grant <GRANTEE_GONKA_ADDRESS> generic \
      --msg-type=/cosmos.gov.v1beta1.MsgVote \
      --from=<GRANTER_KEY_NAME> \
      --chain-id=gonka-mainnet \
      --expiration=<UNIX_TIMESTAMP> \
      --home .inference \
      --keyring-backend file
    ```
    
=== "Example response"

    ```
    {
        "height": "0",
        "txhash": "8D96FB6FC06FFB928FBC89FE950689CD040C7F338C197BA856175EC7462A3FFA",
        "codespace": "",
        "code": 0,
        "data": "",
        "raw_log": "",
        "logs": [],
        "info": "",
        "gas_wanted": "0",
        "gas_used": "0",
        "tx": null,
        "timestamp": "",
        "events": []
    }
    ```
    
#### 2. Verify the grant exists (run from any node)
=== "Command"
    ```
    ./inferenced query authz grants <GRANTER_GONKA_ADDRESS> <GRANTEE_GONKA_ADDRESS> \
      --node="<NODE_URL>/chain-rpc/" \
      --output=json | jq .
    ```
    
=== "Example response"

    ```
    {
        "grants": [
            {
                "authorization": {
                    "type": "cosmos-sdk/GenericAuthorization",
                    "value": {
                        "msg": "/cosmos.gov.v1beta1.MsgVote"
                    }
                },
                "expiration": "2026-12-03T18:38:18Z"
            }
        ],
        "pagination": {
            "total": "1"
        }
    }
    ```
    
#### 3. Vote using the grantee
=== "Command"
    ```
    # Find the proposal ID which you are voting for - use it as <VOTE_PROPOSAL_ID> in the voting body 
    ./inferenced query gov proposals --output json
    
    # Prepare the file with the voting body
    cat > /tmp/authz-vote.json << 'EOF'
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
    EOF
    
    
    # Vote using the file 
    ./inferenced tx authz exec /tmp/authz-vote.json \  --from=<GRANTEE_KEY_NAME> \ 
    --chain-id=gonka-mainnet \
    --home .inference \
    --keyring-backend file \
    --node="<NODE_URL>/chain-rpc/" -y
    ```
    
=== "Example response"

    ```
    {
        "pagination": {
            "total": "1"
        },
        "proposals": [
            {
                "id": "1"
            }
        ]
    }
    ```

---

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
