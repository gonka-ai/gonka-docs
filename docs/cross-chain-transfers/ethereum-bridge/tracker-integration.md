!!! warning
    Always start with a small test transaction. Bridge transfers are irreversible, so before moving large amounts, send a small amount first and confirm it arrives as expected.

The dedicated Bridge smart contract, controlled by the Gonka consensus, is active on Ethereum at the address:

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# Dashboard & tracker integration

This page is for **dashboard, explorer, and tracker operators** who want to display or integrate Gonka bridge data themselves. All bridge state is readable from the public chain API — no special access is required.

The examples below use `https://node2.gonka.ai:8443/chain-api/...`; you can point them at any node you trust.

## End-user dashboard

The hosted dashboard already exposes bridge functionality for end users — connecting an Ethereum wallet, deriving the matching `gonka1…` address (see [Addresses and keys](addresses-and-keys.md)), viewing wrapped balances, and driving deposits/withdrawals:

```text
https://node1.gonka.ai:8443/dashboard/
```

Per-contract CosmWasm transaction history (useful for auditing a wrapped token) is available at:

```text
https://node1.gonka.ai:8443/dashboard/gonka/cosmwasm/105/transactions?contract=<wrappedContractAddress>
```

## Bridge contract addresses (per chain)

The trusted bridge contract addresses Gonka accepts deposits from, by chain:

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/bridge_addresses/ethereum"
```

## Bridge transactions

List inbound bridge transactions (deposits/burns being validated and completed):

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/bridge_transactions"
```

Look up a single transaction by its origin coordinates `(originChain, blockNumber, receiptIndex)`:

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/bridge_transaction/ethereum/{blockNumber}/{receiptIndex}"
```

Each record carries `status` (`BRIDGE_PENDING` or `BRIDGE_COMPLETED`), the derived `ownerAddress` (the `gonka1…` recipient), `amount`, and the validating epoch — enough to track a transfer from "seen" to "completed".

## Wrapped token balances for an address

List all wrapped (CW-20) balances held by a Gonka address, with symbol, decimals, and a human-formatted balance:

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/wrapped_token_balances/{gonkaAddress}"
```

## Token metadata

Resolve the registered name/symbol/decimals for a bridged token by its source chain and Ethereum contract:

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/token_metadata/ethereum/{ethereumContractAddress}"
```

!!! note
    Metadata only exists for tokens that have been registered (see [Register a bridge token](register-token.md)). Unregistered tokens still bridge and appear in balances, but with empty/default metadata. Trackers should handle missing metadata gracefully and fall back to the raw contract address.

## One wrapped contract per token

Each Ethereum token maps to exactly **one** wrapped CW-20 contract on Gonka, keyed by `(chainId, ethereumContractAddress)`. The first deposit instantiates the contract; every later deposit of the same token reuses the same wrapped address. When indexing, treat the wrapped CW-20 contract address as the canonical on-Gonka identity for that Ethereum token.

## Trading-related queries (liquidity pool)

If you also surface trading data:

```bash
# Tokens approved for trading via the liquidity pool
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/approved_tokens_for_trade"

# Validate that a CW-20 is an authorized wrapped token for trading
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/validate_wrapped_token_for_trade/{contractAddress}"

# The singleton liquidity pool contract address / code id
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/liquidity_pool"
```

## Bridge service status

The decentralized API exposes the bridge ingestion queue health, useful for an operations panel:

```bash
curl "https://node2.gonka.ai:8443/v1/bridge/status"
curl "https://node2.gonka.ai:8443/v1/bridge/addresses?chain=ethereum"
```
