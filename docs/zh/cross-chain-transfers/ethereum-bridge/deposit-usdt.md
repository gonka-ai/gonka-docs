!!! warning
    务必先进行小额测试交易。跨链转账是不可逆的，因此在转移大额资金之前，请先发送少量金额，并确认其如期到账。

由 Gonka 共识控制的专用跨链桥智能合约已在以太坊上激活，地址为：

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# 存入 USDT（以太坊 → Gonka）

如果您想使用已持有 USDT 的现有以太坊地址，请使用相同的私钥生成一个 Gonka 地址。该 Gonka 地址将接收包装后的代币。

如果您想使用现有的 Gonka 地址，请使用相同的私钥生成对应的以太坊地址，向其充值 USDT，并确保该地址有足够的 ETH 用于支付 Gas 费用。

!!! important
    包装代币将发送到由**签署此以太坊充值交易的密钥派生的** `gonka1…` 地址——而不是助记词派生的 Gonka 账户。如果您跳过此步骤，您的资金将到达一个与常用钱包不同的 Gonka 地址——可通过您的以太坊密钥恢复，但不在您预期的位置。详见[地址与密钥](addresses-and-keys.md)了解如何推导正确的地址（或使用仪表板）。

### A) 向以太坊上的跨链桥合约发送 USDT

向跨链桥合约执行转账操作：

```javascript
const tx = await usdtContract.transfer(
  "0x972a7a92d92796a98801a8818bcf91f1648f2f68",   // bridge address
  amountBN                                        // BigNumber amount
);
await tx.wait();
```

!!! warning
    包装余额不会立即出现。跨链桥等待充值区块在以太坊上被**最终确认**（约两个 epoch），因此从以太坊交易被打包到包装余额出现在 Gonka 上，预计需要 **15–20 分钟**。

### B) 在 Gonka 上检查包装代币的余额

查询您的 Gonka 地址拥有的包装代币：

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/wrapped_token_balances/{gonkaAddress}"
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
  --gas auto --gas-adjustment 1.5 \
  -y \
  --node http://node1.gonka.ai:8000/chain-rpc/
```

#### 输出示例
```text
...
txhash: 39E3D4B86CF6B0C8952C789F4D73DB9FE27DEA4BD25F3842BE9298C78980A51D
```

等待 2-3 个区块生成，然后检查交易状态：

```bash
./inferenced query tx 39E3D4B86CF6B0C8952C789F4D73DB9FE27DEA4BD25F3842BE9298C78980A51D --node http://node1.gonka.ai:8000/chain-rpc/
```

!!! tip
    返回状态中的 `"code": 0` 表示转账成功。
    请注意，`--gas auto` 可能会导致错误的 Gas 估算。如果交易失败，状态响应中会显示实际所需的 Gas 数量。您只需手动指定 Gas 限制并重新尝试即可（例如：`--gas 200000`）。
