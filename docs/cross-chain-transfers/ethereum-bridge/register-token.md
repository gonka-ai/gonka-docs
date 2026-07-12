!!! warning
    Always start with a small test transaction. Bridge transfers are irreversible, so before moving large amounts, send a small amount first and confirm it arrives as expected.

The dedicated Bridge smart contract, controlled by the Gonka consensus, is active on Ethereum at the address:

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# Register a bridge token

!!! important "Registration is optional"
    You do **not** need to register a token to bridge it. Any ERC-20 can be deposited to the bridge, and Gonka will automatically instantiate its wrapped CW-20 contract and mint your balance. Registration is a convenience that:

    * attaches **metadata** (name, symbol, decimals) so the wrapped token displays correctly in wallets, explorers, and the dashboard, and
    * makes the token **eligible for trading** in the on-chain liquidity pool.

    Without registration the token still bridges and transfers normally — it simply shows with empty/default metadata until someone registers it. USDT and USDC are pre-registered.

Registering a token records its metadata on-chain through a governance proposal. The Gonka consensus uses this metadata to label the wrapped CW-20 token contract.

Because registration goes through a governance vote, it also acts as a lightweight **verification / anti-fraud step**: it is how the community vouches that a given Ethereum contract is the genuine token it claims to be, rather than a look-alike or invalid contract. A registered token is therefore a stronger signal of legitimacy (and a prerequisite for liquidity-pool trading), while an unregistered token still bridges but carries no such on-chain endorsement.

This section walks you through drafting and submitting a governance proposal to register a new bridge token.

!!! tip "Testnet first"
    Register and test new tokens on **testnet** (chain ID `sepolia`) first. Promote a token to **mainnet** (chain ID `ethereum`) only once its bridging and metadata have been verified end-to-end. The mainnet rollout schedule for additional tokens is decided by governance.

### Prerequisites

Before starting, you need the following information about the ERC-20 token:

* **Chain ID**: The source chain identifier (typically `"ethereum"` or `"sepolia"` for testnet).
* **Contract Address**: The ERC-20 contract address on Ethereum (e.g., `0xdAC17F958D2ee523a2206206994597C13D831ec7` for USDT).
* **Name**: The full name of the token (e.g., `"Tether USD"`).
* **Symbol**: The ticker symbol of the token (e.g., `"USDT"`).
* **Decimals**: The token's precision (e.g., `6` or `18`).

### Step-by-Step Instructions

#### Step 1: Get the Governance Module Address (Authority)

The governance module account address acts as the `authority` that signs and executes the proposal. To find this address on your node, run:

```bash
inferenced query auth module-accounts --node $SEED_URL/chain-rpc/ | grep -B2 'name: gov'
```

Copy the returned Cosmos address (e.g., `cosmos1...gov...`).

#### Step 2: Prepare the Proposal File

Create a file named `register_token_proposal.json`. This proposal will include the `MsgRegisterTokenMetadata` message in the `messages` array to register the token metadata (name, symbol, decimals).

##### Proposal JSON Template

```json
{
  "messages": [
    {
      "@type": "/inference.inference.MsgRegisterTokenMetadata",
      "authority": "cosmos1...gov...",       // from step 1
      "chainId": "ethereum",
      "contractAddress": "0xTokenContractAddressOnEthereum",
      "name": "Token Name",
      "symbol": "SYMBOL",
      "decimals": 18,
      "overwrite": false
    }
  ],
  "metadata": "ipfs://CID",
  "deposit": "500000000000ngonka",
  "title": "Register Wrapped SYMBOL Token Metadata",
  "summary": "This proposal registers the metadata for the SYMBOL ERC-20 token bridged from Ethereum on the Gonka chain."
}
```

Replace:

* `cosmos1...gov...` with your actual governance module address.
* `0xTokenContractAddressOnEthereum` with the exact ERC-20 contract address.
* `Token Name`, `SYMBOL`, and `decimals` with the correct token information.
* `deposit` with an amount that meets the minimum deposit requirement.
* `metadata` with the URI of your proposal metadata (optional, can be empty or an IPFS CID).

#### Step 3: Submit the Governance Proposal

Run this transaction from your private machine holding your Cold Account Key:

```bash
inferenced tx gov submit-proposal ./register_token_proposal.json \
  --from <cold-key-name> \
  --keyring-backend file \
  --unordered --timeout-duration=60s \
  --gas=2000000 --gas-adjustment=5.0 \
  --node $SEED_URL/chain-rpc/ \
  --yes
```

You will be prompted to enter your file keyring password.

#### Step 4: Top Up Deposit and Vote

Once submitted, retrieve the `proposal_id` from the transaction log or query all proposals:

```bash
inferenced query gov proposals --node $SEED_URL/chain-rpc/
```

If your initial deposit was below the minimum required to enter the voting period, top it up:

```bash
inferenced tx gov deposit <proposal_id> 500000000000ngonka \
  --from <cold-key-name> \
  --keyring-backend file \
  --unordered --timeout-duration=60s \
  --gas=2000000 --gas-adjustment=5.0 \
  --node $SEED_URL/chain-rpc/ \
  --yes
```

Once the proposal is in the **Voting Period**, cast your vote:

```bash
inferenced tx gov vote <proposal_id> yes \
  --from <cold-key-name> \
  --keyring-backend file \
  --unordered --timeout-duration=60s \
  --gas=2000000 --gas-adjustment=5.0 \
  --node $SEED_URL/chain-rpc/ \
  --yes
```

#### Step 5: Verification

After the voting period ends and the proposal passes, you can verify that the metadata is successfully registered.

##### 1. Verify Metadata

Query the token metadata using the chain API or CLI:

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/token_metadata/ethereum/0xTokenContractAddressOnEthereum"
```

##### 2. Verify Wrapped Token Balances

Once a user bridges their tokens to the bridge contract on Ethereum, the Gonka consensus will automatically instantiate a wrapped CW-20 contract for the token and assign the minted balance to the user's derived address. You can query the balance:

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/wrapped_token_balances/{gonkaAddress}"
```

##### 3. One wrapped contract per token

Each Ethereum token maps to exactly one wrapped CW-20 contract on Gonka. The first deposit instantiates it; every later deposit of the **same** token reuses the **same** contract, so all balances and transfers for that token live under one address. You can inspect a wrapped contract's transactions in the dashboard, e.g.:

```text
https://node1.gonka.ai:8443/dashboard/gonka/cosmwasm/105/transactions?contract=<wrappedContractAddress>
```
