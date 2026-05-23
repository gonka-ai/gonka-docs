!!! warning
    为避免不必要的代币损失，在跨链桥完全激活的官方公告发布之前，请勿使用本指南中的说明。

由 Gonka 共识控制的专用跨链桥智能合约已在以太坊上激活，地址为：

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# 如何将 USDT 从以太坊包装转移至 Gonka

如果您想使用已持有 USDT 的现有以太坊地址，请使用相同的私钥生成一个 Gonka 地址，该 Gonka 地址将接收包装后的代币。

如果您想使用现有的 Gonka 地址，请使用相同的私钥生成对应的以太坊地址，向其充值 USDT，并确保该地址有足够的 ETH 用于支付 Gas 费用。

### A) 向以太坊上的跨链桥合约发送 USDT

向跨链桥合约执行转账操作：

```javascript
const tx = await usdtContract.transfer(
  "0x972a7a92d92796a98801a8818bcf91f1648f2f68",   // 跨链桥合约地址
  amountBN                                        // BigNumber 数量
);
await tx.wait();
```

### B) 在 Gonka 上检查包装代币的余额

查询您的 Gonka 地址拥有的包装代币：

```bash
curl "https://node2.gonka.ai:8433/chain-api/productscience/inference/inference/wrapped_token_balances/{gonkaAddress}"
```

#### 响应示例
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

### C) 在 Gonka 上转账包装的 USDT

使用上述查询返回的包装 CW-20 代币合约地址 (`gonka1CW20WrappedUSDTAddress`)：

```bash
export WUSDT_CONTRACT="gonka1CW20WrappedUSDTAddress"

./inferenced tx wasm execute $WUSDT_CONTRACT \
  '{"transfer":{"recipient":"gonka1xxxxxxxx...","amount":"123456"}}' \
  --from <your_key_name> \
  --chain-id gonka-mainnet \
  --gas auto
```

#### 输出示例
```text
...
txhash: 39E3D4B86CF6B0C8952C789F4D73DB9FE27DEA4BD25F3842BE9298C78980A51D
```

等待 2-3 个区块生成，然后检查交易状态：

```bash
./inferenced query tx 39E3D4B86CF6B0C8952C789F4D73DB9FE27DEA4BD25F3842BE9298C78980A51D
```

!!! tip
    返回状态中的 `"code": 0` 表示转账成功。
    请注意，`--gas auto` 可能会导致错误的 Gas 估算。如果交易失败，状态响应中会显示实际所需的 Gas 数量。您只需手动指定 Gas 限制并重新尝试即可（例如：`--gas 200000`）。
