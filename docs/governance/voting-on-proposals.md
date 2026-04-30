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

## Quick path (???????)

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

## Vote

Again, this will need to be from you private machine with your Governance account:

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

---

???+ note "Notes"
    - **Who can create a proposal:** anyone with a valid governance (cold) key who pays required fees/deposit.
    - **Track status:** use `query gov proposal`, `query gov tally`, and `query gov proposals`. See also [Track Proposal Status](/governance/transactions-and-governance/#track-proposal-status).
    - **Transaction flags:** in governance transactions, keep `--keyring-backend file --unordered --timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 --node <NODE_URL>/chain-rpc/`.
