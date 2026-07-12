# Voting on Proposals
## Who Can and Cannot Vote

A vote requires bonded `tokens > 0` at the proposal's `voting_end_height`. Eligibility is determined by three independent checks:

**Bonded status (Cosmos SDK)**

Only validators with `status = BOND_STATUS_BONDED` and `tokens > 0` contribute voting power. Bonded entries with zero tokens are dormant and contribute nothing.

**Jail status**

A jailed validator (`jailed = true`) is automatically unbonded and removed from the active validator set, losing all voting power until they manually unjail via `MsgUnjail`. Slashing for downtime or double-signing triggers jail.

In the Gonka fork this is reinforced through `SetComputeValidators`: at epoch end, validators not in the compute results, or explicitly marked for deletion, get `tokens = 0`. Because Gonka has no traditional unbonding period, jailed validators are deleted immediately rather than entering an unbonding queue.

**PoC and CPoC participation**

Voting power ultimately derives from `participant.weight`, which is recomputed each epoch based on PoC and CPoC results:

- **PoC failure**: the participant is marked `INACTIVE`, dropped from the next epoch's compute results, given `tokens = 0`, and cannot vote.
- **CPoC failure**: Confirmation PoC, where peers cross-validate each other's PoC submissions. Same outcome: removed from the active set, `tokens = 0`, no vote weight.
- **Active participant**: tokens are recomputed from the new weight, vote weight = weight, or boosted for Guardians.

**Delegators**

Standard Cosmos SDK delegators, meaning anyone who staked via `MsgDelegate`, can vote independently and their vote overrides their validator's vote on the share they delegated. In practice almost all Gonka voting power lives in self-delegations by validators tied to their PoC weight, so this path is rarely used.

---

## Verify and Vote

Most participants only need to verify a proposal and cast a vote. Do these four things:

### Identify the right proposal ID (and verify it is the one you were told)

```bash
# List all proposals (IDs + basic info)
inferenced query gov proposals -o json --node <NODE_URL>/chain-rpc/
# Inspect a specific proposal in detail
inferenced query gov proposal <VOTE_PROPOSAL_ID> -o json --node <NODE_URL>/chain-rpc/
```

Confirm the **id**, **title**, **summary**, and (if present) **metadata** match what was shared with you.


???+ note "Know the voting options and short flow"
    - **Options:** `yes`, `no`, `no_with_veto`, `abstain`.
    - **Flow:** proposals open (after deposit) -> voting period runs -> outcome decided by quorum/threshold/veto parameters -> if passed, messages execute via the gov module.
    - You may change your vote any time before voting period ends; the last vote counts.

### Check current governance parameters

Governance parameters are configurable on-chain. Do not rely on fixed numbers copied from older docs or announcements; query the live chain before recommending how participants should vote.

```bash
inferenced query gov params -o json --node <NODE_URL>/chain-rpc/ \
  | jq '.params | {
      voting_period,
      expedited_voting_period,
      quorum,
      threshold,
      expedited_threshold,
      veto_threshold,
      burn_vote_veto,
      min_deposit,
      expedited_min_deposit
    }'
```

At the time of writing, mainnet parameters are:

```text
min_deposit:              500000000000ngonka   # 500 GNK
expedited_min_deposit:    1000000000000ngonka  # 1000 GNK
max_deposit_period:       86400s    # 24 hours
voting_period:            172800s   # 48 hours
expedited_voting_period:  43200s    # 12 hours
quorum:                   0.25
threshold:                0.500000000000000000
expedited_threshold:      0.667000000000000000
veto_threshold:           0.334000000000000000
burn_vote_veto:           true
```

### How the result is counted

The tally uses PoC-weighted voting power. A proposal can pass only after quorum is reached:

```text
total_votes / total_bonded_voting_power >= quorum
```

Where:

```text
total_votes = Yes + No + NoWithVeto + Abstain
non_abstain_votes = Yes + No + NoWithVeto
```

With current mainnet params, quorum is:

```text
total_votes / total_bonded_voting_power >= 0.25
```

After quorum, veto is checked before the pass threshold:

```text
NoWithVeto / (Yes + No + NoWithVeto + Abstain) > veto_threshold
```

With current mainnet params:

```text
NoWithVeto / total_votes > 0.334
```

If this condition is true, the proposal fails by veto. Since `burn_vote_veto` is currently `true`, a veto rejection burns the proposal deposit.

Finally, the regular pass threshold is:

```text
Yes / (Yes + No + NoWithVeto) > threshold
```

With current mainnet params:

```text
Yes / non_abstain_votes > 0.5
```

For expedited proposals:

```text
Yes / non_abstain_votes > 0.667
```

### How `abstain` affects the result

`abstain` is neutral, but it still affects the tally:

- It counts toward quorum.
- It is excluded from the Yes threshold denominator.
- It is included in the veto denominator, so it pushes the veto ratio down.

Important: `abstain` does **not** add to `no_with_veto`. The veto numerator is only `NoWithVeto`.

Example:

```text
Yes = 40
No = 0
NoWithVeto = 20
Abstain = 40

veto ratio = 20 / 100 = 20%       # veto does not trigger
pass ratio = 40 / 60 = 66.7%      # passes regular threshold
```

### Cast (or change) your vote

```bash
# options: yes | no | no_with_veto | abstain
inferenced tx gov vote <VOTE_PROPOSAL_ID> yes \
  --from <COLD_KEY_NAME> \
  --keyring-backend file \
  --unordered --timeout-duration=60s \
  --gas=2000000 --gas-adjustment=5.0 \
  --node <NODE_URL>/chain-rpc/ \
  --yes
```

```bash
# See tally
inferenced query gov tally <VOTE_PROPOSAL_ID> -o json --node <NODE_URL>/chain-rpc/
# Optional: list votes
inferenced query gov votes <VOTE_PROPOSAL_ID> -o json --node <NODE_URL>/chain-rpc/
```

---

???+ note "Notes"
    - **Who can create a proposal:** anyone with a valid governance (cold) key who pays required fees/deposit.
    - **Track status:** use `query gov proposal`, `query gov tally`, and `query gov proposals`. See also [Track Proposal Status](/governance/transactions-and-governance/#track-proposal-status).
    - **Transaction flags:** in governance transactions, keep `--keyring-backend file --unordered --timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 --node <NODE_URL>/chain-rpc/`.
