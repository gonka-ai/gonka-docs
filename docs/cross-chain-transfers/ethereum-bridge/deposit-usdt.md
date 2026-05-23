!!! warning
    To avoid unintentional loss of tokens, do not use these instructions before the official announcement that the bridge is fully activated.

The dedicated Bridge smart contract, controlled by the Gonka consensus, is active on Ethereum at the address:

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# Deposit USDT (Ethereum → Gonka)

To use an existing Ethereum address that already holds USDT, generate a Gonka address from the same private key. This Gonka address will receive the wrapped token.

If instead you want to use an existing Gonka address, generate the corresponding Ethereum address from the same private key, acquire USDT on it, and ensure you have enough ETH for gas.

### A) Send USDT to the Bridge Contract on Ethereum

Execute the transfer to the bridge contract:

```javascript
const tx = await usdtContract.transfer(
  "0x972a7a92d92796a98801a8818bcf91f1648f2f68",   // bridge address
  amountBN                                        // BigNumber amount
);
await tx.wait();
```

### B) Check Wrapped Token Balance on Gonka

Query the wrapped tokens owned by your Gonka address:

```bash
curl "https://node2.gonka.ai:8433/chain-api/productscience/inference/inference/wrapped_token_balances/{gonkaAddress}"
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
  --gas auto
```

#### Example Output
```text
...
txhash: 39E3D4B86CF6B0C8952C789F4D73DB9FE27DEA4BD25F3842BE9298C78980A51D
```

Allow 2-3 blocks to be mined, then check the status of the transaction:

```bash
./inferenced query tx 39E3D4B86CF6B0C8952C789F4D73DB9FE27DEA4BD25F3842BE9298C78980A51D
```

!!! tip
    A status of `"code": 0` means the transfer was successful.
    Note that `--gas auto` might estimate gas incorrectly. If the transaction fails, the status response will show the necessary gas amount. Update and retry the command using a manual gas limit (e.g., `--gas 200000`).
