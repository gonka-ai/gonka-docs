# Access Your Host Account

When the **chain‑node** container starts for the first time, it automatically creates an account (wallet) and its keys. 
Those keys are what you use for any account‑level action, such as transferring funds.

You can interact with the keys in two ways, we recommend **Option 1** for simplicity:

## Option 1: Access Account from Container

Connect to the server with the network node and connect to the container `node` (created from `ghcr.io/product-science/inferenced` image):
```
docker exec -it node /bin/sh
```
Now you can perform the necessary operations — for example, [Query Balance](https://gonka.ai/wallet/wallet-and-transfer-guide/#query-balance), [Send Coins](https://gonka.ai/wallet/wallet-and-transfer-guide/#send-coins), [Check Transaction Status](https://gonka.ai/wallet/wallet-and-transfer-guide/#check-transaction-status). The `--node` and `--keyring-backend` arguments are not required, since you’re already on the Host node and operating within it.

## Option 2: Export Keys to Local Computer

Another option is to install `inferenced` according to [the instruction]([https://gonka.ai/developer/quickstart/](https://gonka.ai/developer/quickstart/#:~:text=You%20can%20download%20the%20latest%20inferenced%20binary%20for%20your%20system%20here.)), copy keys to your local computer, and execute all commands locally. 

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

- `--node` argument which points to the `NODE_RPC_URL` of the chain node you want to use as an entry point (`--node http://node2.gonka.ai:26657` for genesis node)
- `--keyring-backend test` to use test keyring

!!! note
    If you've installed `inferenced` locally, ensure it’s in your `PATH` environment variable, or run it directly from its directory (e.g., `inferenced`).

For instructions on how to get your wallet address, check your token balance, or send tokens to another address, please refer to the [Wallet & Transfer Guide](https://gonka.ai/wallet/wallet-and-transfer-guide/).
