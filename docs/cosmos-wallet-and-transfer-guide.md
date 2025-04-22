# Cosmos Wallet & Transfer Guide

In Cosmos, a fund transfer means sending tokens from one account (wallet address) to another within a Cosmos-based blockchain. 
These transfers are used to pay for services or simply send value between users. 
You perform transfers using the Cosmos SDK command-line tool — specifically, the `inferenced` CLI. 
Each transfer is recorded on the blockchain and needs a valid sender, recipient, amount, and token denomination.

This guide walks you through:

- How to get your wallet address
- How to check your token balance
- How to send tokens to another address

## Access Your Participant Account

When the **chain‑node** container starts for the first time it automatically creates an account (wallet) and its keys. 
Those keys are what you use for any account‑level action such as transferring funds.

You can interact with the keys in two ways, we recommend **Option 1** for simplicity:

### Option 1: Access Account from Container

Connect to the server with network node and connect to the container `node` (created from `ghcr.io/product-science/inferenced` image):
```
docker exec -it node /bin/sh
```

Then follow the instruction, `--node` and `--keyring-backend` arguments are not needed.


### Option 2: Export Keys to Local Computer

Another option is install `inferenced` according to [the instruction](quickstart/developer/quickstart.md), copy keys to your local computer and execute all commands locally. 

* `test` keyring backend is used during the TestNet, that will be changed in MainNet.*

Connect to the `node` container at the server (created from `ghcr.io/product-science/inferenced` image):
```
docker exec -it node /bin/sh
```

Export the key with name `KEY_NAME` (you can find it via `inferenced keys list` inside the container):
```
inferenced keys export $KEY_NAME --keyring-backend test
```
You'll be asked to enter passphrase which then will be used to import key at your local machine.

Copy keys:
```
-----BEGIN TENDERMINT PRIVATE KEY-----
...
-----END TENDERMINT PRIVATE KEY-----
```
and paste to local file `keys.pem`.

Then to import keys at your local machine:
```
./inferenced keys import join keys.pem --keyring-backend test
```

Then follow the instruction, adding:
- `--node` argument which point to the `NODE_RPC_URL` of the chain node you want to use an entrypoint (`--node http://195.242.13.239:26657` for genesis node)
- `--keyring-backend test` to use test keyring

!!! note
    If you've installed `inferenced` locally, ensure it’s in your `PATH` environment variable, or run it directly from its directory (e.g., `./inferenced`).



## Get Your Wallet Address

Before you can check balances or send funds, you need to know your wallet address.

```bash
inferenced keys list [--keyring-backend test]
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

## Query Balance

To check your balance, ensure you have sufficient funds before transferring or to verify a successful transfer, use the following command:

```bash
inferenced query bank balances <address> [--node <node_rpc_url> | --keyring-backend test]
```
This shows how many tokens are in your wallet.

**Example:**

```bash
inferenced query bank balances cosmos1a3jpdl4epdts64gns3a3fy9hjv2n9e3v7kxx0e
```

---

## Send Coins

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
