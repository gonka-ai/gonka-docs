# Wallet & Transfer Guide

This guide explains how to work with wallets and tokens on the network: how to get your wallet address, check your balance, send tokens, and track transactions.
Before you can perform any wallet operations, you need to access your account. Follow the instructions below based on your role in the network.

**Are you a Host?**

You contribute computational resources and receive tokens as rewards.
Before proceeding, you need access to your wallet, which is automatically created when the chain-node container runs for the first time.
Go [here](https://gonka.ai/host/access-account/) to learn how to access your account. 

**Are you a Developer?**

You build and deploy AI applications using the network’s distributed power. You’ll need to create an account and CLI tools for scripting and automation.
Go [here](https://gonka.ai/developer/quickstart/) to set up the CLI and access your account.

Once you have access to your account, return to this guide to learn how to:

- [Query Balance](https://gonka.ai/wallet/wallet-and-transfer-guide/#query-balance)
- [Send Coins](https://gonka.ai/wallet/wallet-and-transfer-guide/#send-coins)
- [Check Transaction Status](https://gonka.ai/wallet/wallet-and-transfer-guide/#check-transaction-status)

## Get Your Wallet Address

Before you can check balances or send funds, you need to know your wallet address.

```bash
inferenced keys list [--keyring-backend test]
```

This command lists all the wallet keys (accounts) you’ve created locally, along with their addresses and public keys. Example output:

```
- address: gonka1f85frkfw89cgpva0vgpyuldjgu6uhyd82hmjzr
  name: genesis
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A+Qpbyhtsdl5N/6O6S/qJ9uvtbI7OFFsO5dcNrpEU0nv"}'
  type: local
```
Write down the address (used to receive tokens and query balance).

---

## Query Balance

To check your balance, ensure you have sufficient funds before transferring, or to verify a successful transfer, use the following command:

```bash
inferenced query bank balances <address> [--node <node_rpc_url>]
```
This shows how many tokens are in your wallet.

**Example:**

```bash
inferenced query bank balances gonka1a3jpdl4epdts64gns3a3fy9hjv2n9e3v7kxx0e --node http://node2.gonka.ai:26657
```

---

## Send Coins

In Cosmos, a fund transfer means sending tokens from one account (wallet address) to another within a Cosmos-based blockchain. These transfers are used to pay for services or simply send value between users. You perform transfers using the Cosmos SDK command-line tool — specifically, the inferenced CLI. Each transfer is recorded on the blockchain and needs a valid sender, recipient, amount, and token denomination.

Once you know your balance and have the recipient’s address, you can send tokens.

```bash
inferenced tx bank send <sender-key-name> <recipient-address> <coins> --chain-id gonka-mainnet [--node <node_rpc_url> | --keyring-backend test]
```

**Example:**

```bash
inferenced tx bank send genesis gonka1a3jpdl4epdts64gns3a3fy9hjv2n9e3v7kxx0e 100igonka --chain-id gonka-mainnet
```

When specifying coins, you can use the following denominations:

- `ngonka` (exponent 0)
- `ugonka` (exponent 3)
- `migonka` (exponent 6)
- `igonka` (exponent 9, base unit)
- `kigonka` (exponent 12)
- `mcigonka` (exponent 15)

---

## Check Transaction Status

After sending a transaction, you may want to verify whether it was successfully processed and included in a block. Each transaction is assigned a unique hash (`TXHASH`) which you can use to look up its status on the blockchain.
To check the status of a transaction, use the following command:
```bash
inferenced query tx <TXHASH> --chain-id gonka-mainnet [--node <node_rpc_url>]
```

- Replace `<TXHASH>` with the actual transaction hash you received from the transfer command.
- You can optionally specify a node and chain ID if needed.

**Example:**
```bash
inferenced query tx 9712D97F127A1908C4DC4A1F4409AE380DC3BF0D662FA8D7E394422989CFFE2F --chain-id gonka-mainnet
```
If the transaction was successful, the output will contain:

- `code: 0` — indicates success
- A block `height` — the block in which the transaction was included
- A `timestamp` — the time the block was committed
- Details about the transaction message (e.g., `sender`, `receiver`, `amount`, `module`, `gas` used)

**Sample response (truncated for clarity):**
```bash linenums="1"
code: 0
txhash: 9712D97F127A1908C4DC4A1F4409AE380DC3BF0D662FA8D7E394422989CFFE2F
height: "233596"
timestamp: "2025-04-24T02:21:24Z"
tx:
  ...
  body:
    messages:
    - '@type': /cosmos.bank.v1beta1.MsgSend
      from_address: gonka17ek5qgf94zsp024kppcyze37p95drr3wnt6jp3
      to_address: gonka1ydt57pmnsd508ckw4fh6ey6h299v50zljpylla
      amount:
      - amount: "10"
        denom: ngonka
```
If the code is non-zero, the transaction has failed. Check the `raw_log` or info fields for error messages.
