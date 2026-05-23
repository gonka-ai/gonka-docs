!!! warning
    To avoid unintentional loss of tokens, do not use these instructions before the official announcement that the bridge is fully activated.

The dedicated Bridge smart contract, controlled by the Gonka consensus, is active on Ethereum at the address:

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# How to Register a New Bridge Token

To allow users to bridge a new ERC-20 token from Ethereum to Gonka, the token must be registered on-chain. This is done through a governance proposal that registers the token's metadata (name, symbol, decimals) so the Gonka consensus and the bridge know how to instantiate the wrapped CW-20 token contract.

This section walks you through drafting and submitting a governance proposal to register a new bridge token.

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
  "deposit": "10000000ngonka",
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
inferenced tx gov deposit <proposal_id> 10000000ngonka \
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
curl "https://node2.gonka.ai:8433/chain-api/productscience/inference/inference/token_metadata/ethereum/0xTokenContractAddressOnEthereum"
```

##### 2. Verify Wrapped Token Balances

Once a user bridges their tokens to the bridge contract on Ethereum, the Gonka consensus will automatically instantiate a wrapped CW-20 contract for the token and assign the minted balance to the user's derived address. You can query the balance:

```bash
curl "https://node2.gonka.ai:8433/chain-api/productscience/inference/inference/wrapped_token_balances/{gonkaAddress}"
```
