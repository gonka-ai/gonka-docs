# Wallet & Transfer Guide

In Cosmos, a fund transfer means sending tokens from one account (wallet address) to another within a Cosmos-based blockchain. 
These transfers are used to pay for services or simply send value between users. 
You perform transfers using the Cosmos SDK command-line tool — specifically, the `inferenced` CLI. 
Each transfer is recorded on the blockchain and needs a valid sender, recipient, amount, and token denomination.

This guide walks you through:

- How to access your participant account
- How to get your wallet address
- How to check your token balance
- How to send tokens to another address

## Access Your Participant Account

When the **chain‑node** container starts for the first time, it automatically creates an account (wallet) and its keys. 
Those keys are what you use for any account‑level action, such as transferring funds.

You can interact with the keys in two ways, we recommend **Option 1** for simplicity:

### Option 1: Access Account from Container

Connect to the server with the network node and connect to the container `node` (created from `ghcr.io/product-science/inferenced` image):
```
docker exec -it node /bin/sh
```

Then follow the instruction, `--node` and `--keyring-backend` arguments are not needed.


### Option 2: Export Keys to Local Computer

Another option is to install `inferenced` according to [the instruction](quickstart/developer/quickstart.md), copy keys to your local computer, and execute all commands locally. 

* `test` keyring backend is used during the TestNet.

Connect to the `node` container at the server (created from `ghcr.io/product-science/inferenced` image):
```
docker exec -it node /bin/sh
```

Export the key with name `KEY_NAME` (you can find it via `inferenced keys list` inside the container):
```
inferenced keys export $KEY_NAME --keyring-backend test
```
You'll be asked to enter a passphrase, which then will be used to import the key at your local machine.

Copy keys:
```
-----BEGIN TENDERMINT PRIVATE KEY-----
...
-----END TENDERMINT PRIVATE KEY-----
```
and paste to local file `keys.pem`.

Then, to import keys at your local machine:
```
inferenced keys import join keys.pem --keyring-backend test
```

Then follow the instructions, adding:
- `--node` argument which points to the `NODE_RPC_URL` of the chain node you want to use as an entry point (`--node http://195.242.13.239:26657` for genesis node)
- `--keyring-backend test` to use test keyring

!!! note
    If you've installed `inferenced` locally, ensure it’s in your `PATH` environment variable, or run it directly from its directory (e.g., `inferenced`).



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

To check your balance, ensure you have sufficient funds before transferring, or to verify a successful transfer, use the following command:

```bash
inferenced query bank balances <address> [--node <node_rpc_url>]
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
inferenced tx bank send <sender-key-name> <recipient-address> <coins> --chain-id prod-sim [--node <node_rpc_url> | --keyring-backend test]
```

**Example:**

```bash
inferenced tx bank send genesis cosmos1a3jpdl4epdts64gns3a3fy9hjv2n9e3v7kxx0e 100icoin --chain-id prod-sim
```

When specifying coins, you can use the following denominations:

- `nicoin` (exponent 0)
- `uicoin` (exponent 3)
- `micoin` (exponent 6)
- `icoin` (exponent 9, base unit)
- `kicoin` (exponent 12)
- `mcicoin` (exponent 15)

---

## Check Transaction Status

After sending a transaction, you may want to verify whether it was successfully processed and included in a block. Each transaction is assigned a unique hash (`TXHASH`) which you can use to look up its status on the blockchain.
To check the status of a transaction, use the following command:
```bash
inferenced query tx <TXHASH> [--node <node_rpc_url>] [--chain-id <chain_id>]
```
- Replace `<TXHASH>` with the actual transaction hash you received from the transfer command.
- You can optionally specify a node and chain ID if needed.

**Example:**
```bash
inferenced query tx 9712D97F127A1908C4DC4A1F4409AE380DC3BF0D662FA8D7E394422989CFFE2F --node http://195.242.13.239:26657 --chain-id prod-sim
```
If the transaction was successful, the output will contain:

- `code: 0` — indicates success
- A block `height` — the block in which the transaction was included
- A `timestamp` — the time the block was committed
- Details about the transaction message (e.g., `sender`, `receiver`, `amount`, `module`, `gas` used)

**Sample response:**
```bash
❯ inferenced query tx 9712D97F127A1908C4DC4A1F4409AE380DC3BF0D662FA8D7E394422989CFFE2F --node http://195.242.13.239:26657 --chain-id prod-sim
code: 0
codespace: ""
data: 12260A242F636F736D6F732E62616E6B2E763162657461312E4D736753656E64526573706F6E7365
events:
- attributes:
  - index: true
    key: fee
    value: ""
  - index: true
    key: fee_payer
    value: cosmos17ek5qgf94zsp024kppcyze37p95drr3wnt6jp3
  type: tx
- attributes:
  - index: true
    key: acc_seq
    value: cosmos17ek5qgf94zsp024kppcyze37p95drr3wnt6jp3/12245
  type: tx
- attributes:
  - index: true
    key: signature
    value: oJt6Kc36htJIu9ooqBAOS+Yc2uRhSvHWcFf8aipltZtRsfCUorJ5eXQUIunaAV2MHwYzwuqqr9jpBW4mOJYBdg==
  type: tx
- attributes:
  - index: true
    key: action
    value: /cosmos.bank.v1beta1.MsgSend
  - index: true
    key: sender
    value: cosmos17ek5qgf94zsp024kppcyze37p95drr3wnt6jp3
  - index: true
    key: module
    value: bank
  - index: true
    key: msg_index
    value: "0"
  type: message
- attributes:
  - index: true
    key: spender
    value: cosmos17ek5qgf94zsp024kppcyze37p95drr3wnt6jp3
  - index: true
    key: amount
    value: 10nicoin
  - index: true
    key: msg_index
    value: "0"
  type: coin_spent
- attributes:
  - index: true
    key: receiver
    value: cosmos1ydt57pmnsd508ckw4fh6ey6h299v50zljpylla
  - index: true
    key: amount
    value: 10nicoin
  - index: true
    key: msg_index
    value: "0"
  type: coin_received
- attributes:
  - index: true
    key: recipient
    value: cosmos1ydt57pmnsd508ckw4fh6ey6h299v50zljpylla
  - index: true
    key: sender
    value: cosmos17ek5qgf94zsp024kppcyze37p95drr3wnt6jp3
  - index: true
    key: amount
    value: 10nicoin
  - index: true
    key: msg_index
    value: "0"
  type: transfer
- attributes:
  - index: true
    key: sender
    value: cosmos17ek5qgf94zsp024kppcyze37p95drr3wnt6jp3
  - index: true
    key: msg_index
    value: "0"
  type: message
gas_used: "47841"
gas_wanted: "200000"
height: "233596"
info: ""
logs: []
raw_log: ""
timestamp: "2025-04-24T02:21:24Z"
tx:
  '@type': /cosmos.tx.v1beta1.Tx
  auth_info:
    fee:
      amount: []
      gas_limit: "200000"
      granter: ""
      payer: ""
    signer_infos:
    - mode_info:
        single:
          mode: SIGN_MODE_DIRECT
      public_key:
        '@type': /cosmos.crypto.secp256k1.PubKey
        key: A3ZmFLm3Hgqq9XzLk3tO/XYPVakD+27RgR8diYsXVFCe
      sequence: "12245"
    tip: null
  body:
    extension_options: []
    memo: ""
    messages:
    - '@type': /cosmos.bank.v1beta1.MsgSend
      amount:
      - amount: "10"
        denom: nicoin
      from_address: cosmos17ek5qgf94zsp024kppcyze37p95drr3wnt6jp3
      to_address: cosmos1ydt57pmnsd508ckw4fh6ey6h299v50zljpylla
    non_critical_extension_options: []
    timeout_height: "0"
  signatures:
  - oJt6Kc36htJIu9ooqBAOS+Yc2uRhSvHWcFf8aipltZtRsfCUorJ5eXQUIunaAV2MHwYzwuqqr9jpBW4mOJYBdg==
txhash: 9712D97F127A1908C4DC4A1F4409AE380DC3BF0D662FA8D7E394422989CFFE2F
```
If the code is non-zero, the transaction has failed. Check the `raw_log` or info fields for error messages.
