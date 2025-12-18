# Governance & Transactions (Cosmos SDK 0.53)

You will perform governance actions from your **Cold Account Machine**, using the **cold-key-name** stored in your file keyring. This is the governance key you created when joining the network ([see quickstart](https://gonka.ai/host/quickstart/#create-account-key-local-machine)).
Transactions are sent through an RPC endpoint (here referred to as `$SEED_URL/chain-rpc/`). If you do not specify `--node`, the CLI defaults to `tcp://localhost:26657`. Unless you run your own node locally, always provide `--node $SEED_URL/chain-rpc/`.
Unordered transactions are supported and recommended here to avoid sequence contention. ([docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/learn/beginner/tx-lifecycle))

**Always include these flags in transaction commands:**

- `--from <cold-key-name>` → use your cold governance key.
- `--keyring-backend file` → ensures signing with your local key (you will be prompted).
- `--unordered --timeout-duration=60s` → makes the tx valid for a bounded time, bypassing sequence ordering (new in v0.53+).
- `--gas=2000000 --gas-adjustment=5.0` → manual gas setting with buffer.
- `--node $SEED_URL/chain-rpc/` → required unless you run a local RPC node.
- `--yes` → auto-approve broadcasting.

For background on transaction lifecycle and gas, see [Cosmos SDK: Transactions](https://docs.cosmos.network/sdk/v0.53/learn/beginner/tx-lifecycle) and [Gas & Fees](https://docs.cosmos.network/sdk/v0.53/learn/intro/sdk-design#modules).

# Vote on a Proposal (quick path)

Most participants only need to verify a proposal and cast a vote. Do these four things:

## 1) Identify the right proposal_id (and verify it’s the one you were told)

List proposals, then inspect the one you were given and cross-check its fields (title/summary/metadata/messages):

```bash
# List all proposals (IDs + basic info)
inferenced query gov proposals -o json --node $SEED_URL/chain-rpc/
# Inspect a specific proposal in detail
inferenced query gov proposal $PROPOSAL_ID -o json --node $SEED_URL/chain-rpc/
```

Confirm the **id**, **title**, **summary**, and (if present) **metadata** match what was shared with you. If the proposal includes embedded messages, you’ll also see their `@type` and fields here. (Cosmos gov v1 stores proposal content on-chain and exposes it via `query gov proposal`.) ([Cosmos SDK Documentation](https://docs.cosmos.network/sdk/v0.53/build/modules/gov/README#query))

## 2) Review the contents carefully (especially param updates)

If the proposal includes a params update (e.g., `MsgUpdateParams`), compare the proposed params against the **current on-chain params** before voting:

```bash
# 2a) Get current module params (example: inference module)
inferenced query inference params -o json --node $SEED_URL/chain-rpc/ > current_params.json

# 2b) Extract proposed params from the proposal (adjust jq path if your chain nests differently)
inferenced query gov proposal $PROPOSAL_ID -o json --node $SEED_URL/chain-rpc/ \
  | jq '.proposal.messages[] | select(."type"=="inference/x/inference/MsgUpdateParams") | .value' \
  > proposed_params.json

# 2c) Diff
diff -u current_params.json proposed_params.json || true
```

For `MsgUpdateParams`, modules typically expect the **full** params object and the `authority` to be the **gov module account** (that’s normal—just confirm it). ([Cosmos SDK Documentation](https://docs.cosmos.network/sdk/v0.53/build/modules/bank/README), [Cosmos Hub](https://docs.cosmos.network/hub/v25/governance/proposal-types/README)

## 3) Know the voting options & the (very) short gov flow

- **Options:** `yes`, `no`, `no_with_veto`, `abstain`. `NoWithVeto` is a “no” plus a veto signal; `Abstain` contributes to quorum without supporting or opposing. ([Cosmos SDK Documentation](https://docs.cosmos.network/sdk/v0.53/build/modules/gov/README), [Cosmos Tutorials](https://tutorials.cosmos.network/tutorials/8-understand-sdk-modules/4-gov.html)
- **Flow:** proposals open (after deposit) → voting period runs → outcome decided by quorum/threshold/veto parameters → if **passed**, messages execute via the gov module. You may **change your vote any time before the voting period ends**; the **last** vote counts. ([Cosmos Hub](https://hub.cosmos.network/main/governance/process))

## 4) Cast (or change) your vote

Run this from the same machine that holds your Cold Account Key (you’ll be prompted for the keyring password because `--keyring-backend=file`):

```bash
# options: yes | no | no_with_veto | abstain
# Example: vote "yes"
# As an example, this is yes!
inferenced tx gov vote <proposal_id> yes \
  --from <cold-key-name> \
  --keyring-backend file \
  --unordered --timeout-duration=60s \
  --gas=2000000 --gas-adjustment=5.0 \
  --node $SEED_URL/chain-rpc/ \
  --yes
```

You can submit another `tx gov vote` later with a different option to **change your vote** before the voting window closes. To confirm what’s recorded:

```bash
# See tally
inferenced query gov tally $PROPOSAL_ID -o json --node $SEED_URL/chain-rpc/
# (Optional) list votes
inferenced query gov votes $PROPOSAL_ID -o json --node $SEED_URL/chain-rpc/
```

(Cosmos CLI exposes `vote`, `votes`, and tally queries; voters can re-vote until the period ends.) ([Cosmos SDK Documentation](https://docs.cosmos.network/sdk/v0.53/build/modules/gov/README))


---

## Submit a Parameter Change Proposal

**TL;DR:** draft a proposal with a `MsgUpdateParams`, include **all** params for that module, ensure the deposit meets `min_deposit`, submit, then track/deposit/vote. `MsgUpdateParams` requires providing the full parameter set for the target module. ([hub.cosmos.network](https://hub.cosmos.network/main/governance/formatting))
### 1) Get the governance module address (authority)

Many modules’ `MsgUpdateParams` require `authority` to be the **gov module account**. You can get this by running this on a machine that has joined the node (your full node/server:)

```bash
inferenced query auth module-accounts --node $SEED_URL/chain-rpc/ | grep -B2 'name: gov'
```

The gov module executes proposal messages if they pass. Copy that address for the `authority` field. ([docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/build/modules/gov/README))
### 2) Export current params for the target module

You will edit these, but include the **entire** object in the proposal. Again, run this on your main server connected to the node

```bash
# Example for a custom "inference" module
inferenced query inference params -o json --node $SEED_URL/chain-rpc/ > current_params.json
```

`MsgUpdateParams` expects the full struct, not partial fields. ([hub.cosmos.network](https://hub.cosmos.network/main/governance/submitting))
### 3) Check the minimum deposit

```bash
inferenced query gov params -o json --node $SEED_URL/chain-rpc/ | jq '.params.min_deposit'
```

Your proposal’s `deposit` must meet/exceed `min_deposit`. ([hub.cosmos.network](https://hub.cosmos.network/main/governance/process))
### 4) Draft the proposal file

Use the built-in wizard to scaffold `draft_proposal.json`, then choose **other** → pick your message type (e.g., `/inference.inference.MsgUpdateParams`).

```bash
inferenced tx gov draft-proposal
# fills draft_proposal.json and draft_metadata.json
```

The `draft-proposal` helper is part of modern gov v1 CLIs. ([docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/build/modules/gov/README), [hub.cosmos.network](https://hub.cosmos.network/main/governance/submitting))

You will want to select the message you are proposing. To change the parameters for the main chain, use `/inference.inference.MsgUpdateParams`

This will produce a `draft_proposal.json` and a `draft_metadata.json`

The metadata file should be hosted off-chain, preferably on IPFS.

Edit `draft_proposal.json` so it looks like:

```json
{
  "messages": [
    {
      "@type": "/inference.inference.MsgUpdateParams",
      "authority": "cosmos1...gov...",       // from step 1
      "params": { /* paste & modify from current_params.json */ }
    }
  ],
  "metadata": "ipfs://CID",  // Path to the metadata file hosted on IPFS
  "deposit": "10000000ngonka",               // meet min_deposit
  "title": "Adjust epoch length",
  "summary": "Increase epoch length to 1000"
}
```

> Reminder: include the **entire** `params` object, not just the fields you changed. ([hub.cosmos.network](https://hub.cosmos.network/main/governance/submitting))

### 5) Submit the proposal
This MUST be done on your private machine with your cold account information.

```bash
inferenced tx gov submit-proposal ./draft_proposal.json \
  --from <cold-key-name> \
  --keyring-backend file \
  --unordered --timeout-duration=60s \
  --gas=2000000 --gas-adjustment=5.0 \
  --node $SEED_URL/chain-rpc/ \
  --yes
```
You will need to enter your passphrase to send the proposal.

Governance proposals in v1 are JSON files with embedded messages executed by the gov module if the vote passes. ([docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/build/modules/gov/README))

### 6) Ensure your proposal is on-chain

```bash
inferenced query gov proposals --node $SEED_URL/chain-rpc/
```
This will give a list of current proposals on the chain, you should see yours and get the proposal_id.

---

## Add a Deposit (if needed)

If the initial deposit was short, top it up:

```bash
inferenced tx gov deposit <proposal_id> <amount> \
  --from <cold-key-name> \
  --keyring-backend file \
  --unordered --timeout-duration=60s \
  --gas=2000000 --gas-adjustment=5.0 \
  --node $SEED_URL/chain-rpc/ \
  --yes
```

([docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/build/modules/gov/README))

---

## Vote
Again, this will need to be from you private machine with your Governance account:
```bash
# options: yes | no | no_with_veto | abstain
inferenced tx gov vote <proposal_id> yes \
  --from <cold-key-name> \
  --keyring-backend file \
  --unordered --timeout-duration=60s \
  --gas=2000000 --gas-adjustment=5.0 \
  --node $SEED_URL/chain-rpc/ \
  --yes
```

(There’s no auto-YES for proposers; cast your vote explicitly.) ([docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/build/modules/gov/README))

---

## Track Proposal Status

```bash
# One proposal
inferenced query gov proposal <proposal_id> -o json --node $SEED_URL/chain-rpc/
# Tally only
inferenced query gov tally <proposal_id> -o json --node $SEED_URL/chain-rpc/
# List all
inferenced query gov proposals -o json --node $SEED_URL/chain-rpc/
```

([docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/build/modules/gov/README))

---

## Notes

- **Unordered tx semantics.** When using `--unordered`, the tx carries an expiry via `--timeout-duration`, and its sequence is left unset. External tooling that expects monotonic sequences must not rely on them for these txs. ([docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/learn/beginner/tx-lifecycle))
- **Gas tuning.** If simulations are tight or validators use higher min gas prices, raise `--gas-adjustment` or set `--gas-prices` per network policy. ([docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/learn/beginner/tx-lifecycle))
