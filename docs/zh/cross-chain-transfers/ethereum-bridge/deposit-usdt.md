!!! warning
    务必先进行小额测试交易。跨链转账是不可逆的，因此在转移大额资金前，请先发送少量金额，并确认其如期到账。

    由 Gonka 共识控制的专用跨链桥智能合约已在以太坊上激活，地址为：

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# 存入 USDT（以太坊 → Gonka）

若要使用已持有 USDT 的现有以太坊地址，请使用相同的私钥生成一个 Gonka 地址。该 Gonka 地址将接收封装后的代币。

或者，如果你想使用现有的 Gonka 地址，请从相同的私钥生成对应的以太坊地址，在该地址上获取 USDT，并确保你有足够的 ETH 用于支付 Gas 费用。

!!! important
    封装后的代币将发送至 **由此次以太坊存款交易签名所用密钥** 推导出的 `gonka1…` 地址 —— 而非由助记词推导出的 Gonka 账户。如果忽略此步骤，你的资金将到达一个与你常用钱包不同的 Gonka 地址 —— 虽然仍可通过你的以太坊密钥找回，但不会出现在预期位置。请参阅 [地址与密钥](addresses-and-keys.md) 了解如何推导正确地址（或使用仪表板工具）。

### A) 将 USDT 发送到以太坊上的桥接合约

向桥接合约发起转账操作：

```javascript
const tx = await usdtContract.transfer(
  "0x972a7a92d92796a98801a8818bcf91f1648f2f68",   // bridge address
  amountBN                                        // BigNumber amount
);
await tx.wait();
```

!!! warning
    包装后的余额不会立即显示。桥接器需要等待以太坊上的存款区块被**最终确认**（大约两个 epoch），因此在以太坊交易被挖出后，预计需要 **15–20 分钟** 才能在 Gonka 上看到包装后的余额。

### B) 在 Gonka 上查询包装代币余额

查询您的 Gonka 地址所拥有的包装代币余额：

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/wrapped_token_balances/{gonkaAddress}"
```

#### 示例响应

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

### C) 在 Gonka 上转移封装的 USDT

使用上述查询返回的封装 CW-20 代币合约地址（`gonka1CW20WrappedUSDTAddress`）：

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

#### 示例输出

```text
...
txhash: 39E3D4B86CF6B0C8952C789F4D73DB9FE27DEA4BD25F3842BE9298C78980A51D
```

等待挖出 2-3 个区块，然后检查交易状态：

```bash
./inferenced query tx 39E3D4B86CF6B0C8952C789F4D73DB9FE27DEA4BD25F3842BE9298C78980A51D --node http://node1.gonka.ai:8000/chain-rpc/
```

!!! tip
    状态 `"code": 0` 表示转账已成功。
    请注意，`--gas auto` 可能会错误估计燃气费用。如果交易失败，状态响应将显示所需的燃气数量。请更新并使用手动设置燃气限制重试命令（例如，`--gas 200000`）。
