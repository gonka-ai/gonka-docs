# Transactions & Governance

All governance actions are performed from your **Cold Account Machine**, using the **<COLD_KEY_NAME>** stored in your file keyring. This is the governance key you created when joining the network ([see quickstart](https://gonka.ai/host/quickstart/#local-machine-install-the-cli-tool)).

Transactions are sent through an RPC endpoint (here referred to as `<NODE_URL>/chain-rpc/`). If you do not specify `--node`, the CLI defaults to `tcp://localhost:26657`. Unless you run your own node locally, always provide `--node <NODE_URL>/chain-rpc/`.

Unordered transactions are supported and recommended here to avoid sequence contention. ([docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/learn/beginner/tx-lifecycle))

???+ note "Always include these flags in transaction commands"
    - `--from <COLD_KEY_NAME>` → use your cold governance key.
    - `--keyring-backend file` → ensures signing with your local key (you will be prompted).
    - `--unordered --timeout-duration=60s` → makes the tx valid for a bounded time, bypassing sequence ordering (new in v0.53+).
    - `--gas=2000000` → manual gas limit (a generous fixed value, enough for these txs). Note: `--gas-adjustment` only multiplies the estimate when `--gas auto` is used, so alongside a fixed `--gas` it is ignored and adds no buffer.
    - `--node <NODE_URL>/chain-rpc/` → required unless you run a local RPC node.
    - `--yes` → auto-approve broadcasting.
    
    For background on transaction lifecycle and gas, see [Cosmos SDK: Transactions](https://docs.cosmos.network/sdk/v0.53/learn/beginner/tx-lifecycle) and [Gas & Fees](https://docs.cosmos.network/sdk/v0.53/learn/intro/sdk-design#modules).

## When a Governance Proposal Is Required

Governance Proposals are required for any on-chain changes that affect the network, for example:

- Updating module parameters (`MsgUpdateParams`)
- Executing software upgrades
- Adding, updating, or deprecating inference models
- Transferring funds from the Community Pool
- Any other actions that must be approved and executed via the governance module

---

## Who can create a Governance Proposal

Anyone with a valid governance key (cold account) can pay the required fee and create a Governance Proposal. However, each proposal must still be approved by active participants through PoC-weighted voting.

Proposers are encouraged to discuss significant changes off-chain first (for example, via [GitHub](https://github.com/gonka-ai) or [community forums](https://discord.com/invite/RADwCT2U6R)) to increase the likelihood of approval.

---

???+ note "Need proposal creation, voting, voting power, eligibility, and delegation details?"
    - [Creating Proposals](/governance/creating-proposals/)
    - [Voting on Proposals](/governance/voting-on-proposals/)
    - [Voting Power, Eligibility, Delegation](/governance/voting-power-eligibility/)

## Track Proposal Status

```bash
# One proposal
inferenced query gov proposal <VOTE_PROPOSAL_ID> -o json --node <NODE_URL>/chain-rpc/
# Tally only
inferenced query gov tally <VOTE_PROPOSAL_ID> -o json --node <NODE_URL>/chain-rpc/
# List all
inferenced query gov proposals -o json --node <NODE_URL>/chain-rpc/
```
([docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/build/modules/gov/README))

**You can also monitor governance via dashboards:**

- Node dashboard pattern: `<NODE_URL>/dashboard/gonka/gov`

??? note "Node dashboard examples"
    - [http://node1.gonka.ai:8000/dashboard/gonka/gov](http://node1.gonka.ai:8000/dashboard/gonka/gov)
    - [http://node2.gonka.ai:8000/dashboard/gonka/gov](http://node2.gonka.ai:8000/dashboard/gonka/gov)
    - and other

??? note "Community dashboards"
    - [vote.gonka.vip/governance](https://vote.gonka.vip/governance)
    - [tracker.gonka.hyperfusion.io/governance](https://tracker.gonka.hyperfusion.io/governance)
    - [gonka.gg/network/proposals](https://gonka.gg/network/proposals)




---

## Notes

???+ note "Notes"
    - **Unordered tx semantics.** When using `--unordered`, the tx carries an expiry via `--timeout-duration`, and its sequence is left unset. External tooling that expects monotonic sequences must not rely on them for these txs. ([docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/learn/beginner/tx-lifecycle))
    - **Gas tuning.** If simulations are tight or validators use higher min gas prices, raise `--gas-adjustment` or set `--gas-prices` per network policy. ([docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/learn/beginner/tx-lifecycle))
