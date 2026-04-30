# How to Create and Submit a Governance Proposal on Gonka

Step-by-step for submitting and voting with `inferenced`.
Aligned with Gonka Transactions & Governance.
Replace every placeholder with your own values before running commands.

## 1. Placeholders

| Placeholder | Meaning |
|---|---|
| `<COLD_KEY_NAME>` | Your key name in the keyring (not your `gonka1...` address) |
| `<PATH_TO_PROPOSAL_JSON>` | Path to the proposal JSON file, e.g. `./proposal.json` |
| `<NODE_URL>` | Node base URL without `/chain-rpc/`, e.g. `http://node1.gonka.ai:8000` |
| `<CHAIN_ID>` | e.g. `gonka-mainnet` for mainnet |

If a command fails with `connection` or `parse`, check that every RPC command uses `<NODE_URL>/chain-rpc/` with exactly one `/chain-rpc/`.

---

## 2. Two URLs (do not mix them)

| Task | Variable |
|---|---|
| `inferenced query / tx` | `<NODE_URL>/chain-rpc/` (must include `/chain-rpc/`) |
| `create-client` (HTTP `.../v1/participants` on the seed) | `<NODE_URL>` (no `/chain-rpc/`) |

Using `<NODE_URL>/chain-rpc/` for `--node-address` in `create-client` is incorrect and will fail or hit the wrong service.

---

## 3. Prerequisites
### 3.1 Install CLI

Download a build for your OS from Gonka releases, unpack, then:

```bash
chmod +x inferenced
./inferenced --help
```

For detailed CLI installation instructions, see the [local machine CLI setup guide](https://gonka.ai/host/quickstart/#local-machine-install-the-cli-tool). After installing the CLI, you can return to this page and continue.

### 3.2 Read `min_deposit` and `voting_period` from the chain

Do not rely on a fixed `ngonka` amount from old docs. Query live values:

```bash
./inferenced query gov params \
  --node "<NODE_URL>/chain-rpc/" \
  --chain-id "<CHAIN_ID>" \
  -o json | jq '{min_deposit: .params.min_deposit, voting_period: .params.voting_period}'
```

Your proposal JSON `deposit` must satisfy `min_deposit` (same denom, amount >= minimum).

### 3.3 Proposal JSON

Prepare a gov v1 JSON (`messages`, `metadata`, `deposit`, `title`, `summary`).

There are two main parts to prepare:

#### Proposal description fields

Keep the on-chain text short and clear.

Make sure the proposal includes:

- A short summary of what the proposal is about.
- A link to the full proposal description with all details.
- The wallet address where funds should be sent, if the proposal requests funding.
- The requested amount and denom, if the proposal requests funding.

#### Proposal JSON structure

For the JSON structure, the best approach is to inspect previous proposals and use them as references.

You can inspect previous proposal JSONs to see how different proposal types are structured.
In many cases, it is easier to start from a similar previous proposal and adapt it.

For messages such as `MsgUpdateParams`, the chain expects the full params object and correct authority (gov module address).
Fetch the gov module address:

```bash
./inferenced query auth module-accounts \
  --node "<NODE_URL>/chain-rpc/" \
  --chain-id "<CHAIN_ID>" \
  -o json | jq -r '.accounts[] | select(.value.name=="gov") | .value.address'
```

Use that address as `authority` where the message type requires it.

If the `jq` line prints nothing, run the same query without `jq` once and locate the gov module entry manually. The output shape can differ slightly by SDK version.

### 3.4 Optional: new key + register participant (`create-client`)

This creates a key and calls the seed HTTP API (participant registration).
Use `<NODE_URL>` only:

```bash
./inferenced create-client "<COLD_KEY_NAME>" \
  --node-address "<NODE_URL>"
```

Store the mnemonic safely.
If you already have a funded key for governance, skip this and avoid double registration.

Use the same `--keyring-backend` everywhere (e.g. `file`) for `keys show`, `tx gov submit-proposal`, and `tx gov vote`.

---

## 4. Publish the proposal on-chain

### 4.1 Check balance

```bash
./inferenced query bank balances \
  "$(./inferenced keys show "<COLD_KEY_NAME>" -a --keyring-backend file)" \
  --node "<NODE_URL>/chain-rpc/" \
  --chain-id "<CHAIN_ID>"
```

Ensure you have enough `ngonka` (or the fee denom your node expects) for `min_deposit` and fees.

### 4.2 Submit

Recommended pattern from the official Gonka doc:

```bash
./inferenced tx gov submit-proposal "<PATH_TO_PROPOSAL_JSON>" \
  --from "<COLD_KEY_NAME>" \
  --keyring-backend file \
  --chain-id "<CHAIN_ID>" \
  --node "<NODE_URL>/chain-rpc/" \
  --unordered --timeout-duration=60s \
  --gas 2000000 --gas-adjustment 5.0 \
  --yes
```

After submission, note the proposal number from the output or find it via query commands.
Share the proposal number so the community announcement can go out.

---

## 5. Voting and tally

Voting steps are documented on the dedicated page:

- [Voting on Proposals](https://gonka.ai/governance/voting-on-proposals/)
