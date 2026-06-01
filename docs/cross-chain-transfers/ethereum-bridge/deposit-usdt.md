!!! warning
    Always start with a small test transaction. Bridge transfers are irreversible, so before moving large amounts, send a small amount first and confirm it arrives as expected.

The dedicated Bridge smart contract, controlled by the Gonka consensus, is active on Ethereum at the address:

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# Deposit USDT (Ethereum → Gonka)

To use an existing Ethereum address that already holds USDT, generate a Gonka address from the same private key. This Gonka address will receive the wrapped token.

If instead you want to use an existing Gonka address, generate the corresponding Ethereum address from the same private key, acquire USDT on it, and ensure you have enough ETH for gas.

!!! important
    The wrapped tokens are delivered to the `gonka1…` address **derived from the key that signs this Ethereum deposit** — not to a seed-derived Gonka account. If you skip this, your funds may land on an address you do not control. See [Addresses and keys](addresses-and-keys.md) for how to derive the correct address (or use the dashboard).

### A) Send USDT to the Bridge Contract on Ethereum

Execute the transfer to the bridge contract:

```javascript
const tx = await usdtContract.transfer(
  "0x972a7a92d92796a98801a8818bcf91f1648f2f68",   // bridge address
  amountBN                                        // BigNumber amount
);
await tx.wait();
```

!!! warning
    The wrapped balance does not appear immediately. The bridge waits for the deposit block to be **finalised** on Ethereum (about two epochs), so expect **15–20 minutes** between the Ethereum transaction being mined and the wrapped balance appearing on Gonka.

### B) Check Wrapped Token Balance on Gonka

Query the wrapped tokens owned by your Gonka address:

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/wrapped_token_balances/{gonkaAddress}"
```

#### Example Response
```json
{
  "balances": [
    {
      "token_info": {
        "chainId": "ethereum",
        "contractAddress": "0xUSDTContractAddress",
        "wrappedContractAddress": "gonka1CW20WrappedUSDTAddress"
      },
      "symbol": "USDT",
      "balance": "100000",
      "decimals": "6",
      "formatted_balance": "0.1"
    }
  ]
}
```

### C) Transfer Wrapped USDT on Gonka

Use the wrapped CW-20 token contract address (`gonka1CW20WrappedUSDTAddress`) returned from the query above:

```bash
export WUSDT_CONTRACT="gonka1CW20WrappedUSDTAddress"

./inferenced tx wasm execute $WUSDT_CONTRACT \
  '{"transfer":{"recipient":"gonka1xxxxxxxx...","amount":"123456"}}' \
  --from <your_key_name> \
  --chain-id gonka-mainnet \
  --gas auto --gas-adjustment 1.5 \
  -y \
  --node http://node1.gonka.ai:8000/chain-rpc/
```

#### Example Output
```text
...
txhash: 39E3D4B86CF6B0C8952C789F4D73DB9FE27DEA4BD25F3842BE9298C78980A51D
```

Allow 2-3 blocks to be mined, then check the status of the transaction:

```bash
./inferenced query tx 39E3D4B86CF6B0C8952C789F4D73DB9FE27DEA4BD25F3842BE9298C78980A51D --node http://node1.gonka.ai:8000/chain-rpc/
```

!!! tip
    A status of `"code": 0` means the transfer was successful.
    Note that `--gas auto` might estimate gas incorrectly. If the transaction fails, the status response will show the necessary gas amount. Update and retry the command using a manual gas limit (e.g., `--gas 200000`).
