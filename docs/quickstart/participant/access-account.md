# Access Your Participant Account

When the **chain‑node** container starts for the first time, it automatically creates an account (wallet) and its keys. 
Those keys are what you use for any account‑level action, such as transferring funds.

You can interact with the keys in two ways, we recommend **Option 1** for simplicity:

## Option 1: Access Account from Container

Connect to the server with the network node and connect to the container `node` (created from `ghcr.io/product-science/inferenced` image):
```
docker exec -it node /bin/sh
```

Then follow the instruction, `--node` and `--keyring-backend` arguments are not needed.


## Option 2: Export Keys to Local Computer

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

For instructions on how to get your wallet address, check your token balance, or send tokens to another address, please refer to the [Wallet & Transfer Guide](https://testnet.productscience.ai/wallet-and-transfer-guide/).
