# Cosmos Wallet & Transfer Guide

## Cosmos Wallet & Transfer Guide

In Cosmos, a fund transfer means sending tokens from one account (wallet address) to another within a Cosmos-based blockchain. These transfers are used to pay for services, interact with smart contracts, or simply send value between users. You perform transfers using the Cosmos SDK command-line tool — specifically, the inferenced CLI. Each transfer is recorded on the blockchain and needs a valid sender, recipient, amount, and token denomination.

In the Cosmos blockchain ecosystem, transferring funds means sending tokens from one account (wallet address) to another. This guide walks you through:

- How to get your wallet address
- How to check your token balance
- How to send tokens to another address

### Get Your Wallet Address

Before you can check balances or send funds, you need to know your wallet address.

```bash
inferenced keys list
```

This command lists all the wallet keys (accounts) you’ve created locally, along with their addresses and public keys. Example output:

```
- address: cosmos1f85frkfw89cgpva0vgpyuldjgu6uhyd82hmjzr
  name: genesis
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A+Qpbyhtsdl5N/6O6S/qJ9uvtbI7OFFsO5dcNrpEU0nv"}'
  type: local
```
Write down the address (used to receive tokens and query balance).

---

### Query Balance

To check your balance and ensure you have sufficient funds before transferring or to verify a successful transfer, use the following command:

```bash
inferenced query bank balances <address> [--node <node_rpc_url>]
```
This shows how many tokens are in your wallet.

**Example:**

```bash
inferenced query bank balances cosmos1a3jpdl4epdts64gns3a3fy9hjv2n9e3v7kxx0e
```

#### Optional `--node` Argument

Use the `--node` argument when you're executing the command in a development environment without direct access to a running chain node. If running alongside the chain node, specifying this argument is not required.

**Example Syntax:**

```bash
--node http://<node-host>:<node-port>
```

Typically, `<node-port>` is `26657`.

---

### Send Coins

Once you know your balance and have the recipient’s address, you can send tokens.

```bash
inferenced tx bank send <sender-key-name> <recipient-address> <coins>
```

**Example:**

```bash
inferenced tx bank send genesis cosmos1a3jpdl4epdts64gns3a3fy9hjv2n9e3v7kxx0e 100icoin
```

When specifying coins, you can use the following denominations:

- `nicoin` (exponent 0)
- `uicoin` (exponent 3)
- `micoin` (exponent 6)
- `icoin` (exponent 9, base unit)
- `kicoin` (exponent 12)
- `mcicoin` (exponent 15)
