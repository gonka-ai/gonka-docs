!!! warning 
    始终先进行小额测试交易。桥接转账是不可逆的，因此在转移大额资金前，先发送少量资金并确认其按预期到达。

    由 Gonka 共识控制的专用桥接智能合约已在以太坊上激活，地址为：

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# 存入 USDT（以太坊 → Gonka）

若要使用已持有 USDT 的现有以太坊地址，请从同一私钥生成 Gonka 地址。该 Gonka 地址将接收包装代币。

若要使用现有的 Gonka 地址，请从同一私钥生成对应的以太坊地址，在其上获取 USDT，并确保有足够的 ETH 支付 Gas 费用。

!!! important 
    包装代币将发送到 **签署此以太坊存款的密钥所派生的** `gonka1…` 地址，而非种子派生的 Gonka 账户。若忽略此步骤，您的资金将存入与您常用钱包不同的 Gonka 地址——虽然可通过您的以太坊密钥恢复，但并非您预期的位置。请参阅 [地址与密钥](addresses-and-keys.md) 了解如何派生正确地址（或使用仪表板）。

### A) 将 USDT 发送到以太坊上的桥接合约

执行转账至桥接合约：

```javascript
const tx = await usdtContract.transfer(
  "0x972a7a92d92796a98801a8818bcf91f1648f2f68",   // bridge address
  amountBN                                        // BigNumber amount
);
await tx.wait();
```

!!! warning 
    包装余额不会立即显示。桥接合约会等待以太坊上的存款区块被**确认**（约两个周期），因此从以太坊交易被打包到 Gonka 上显示包装余额，预计需要 **15–20 分钟**。

### B) 在 Gonka 上检查包装代币余额

查询您的 Gonka 地址所拥有的包装代币：

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

### C) 在 Gonka 上转账包装 USDT

使用上述查询返回的包装 CW-20 代币合约地址（`gonka1CW20WrappedUSDTAddress`）：

```bash
export WUSDT_CONTRACT="gonka1CW20WrappedUSDTAddress"

./inferenced tx wasm execute $WUSDT_CONTRACT \
  '{"transfer":{"recipient":"gonka1xxxxxxxx...","amount":"123456"}}' \
  --from <your_key_name> \
  --chain-id gonka-mainnet \
  --gas auto --gas-adjustment 2.0 \
  -y \
  --node http://node1.gonka.ai:8000/chain-rpc/
```

#### 示例输出
```text
...
txhash: 39E3D4B86CF6B0C8952C789F4D73DB9FE27DEA4BD25F3842BE9298C78980A51D
```

等待 2–3 个区块被打包后，检查交易状态：

```bash
./inferenced query tx 39E3D4B86CF6B0C8952C789F4D73DB9FE27DEA4BD25F3842BE9298C78980A51D --node http://node1.gonka.ai:8000/chain-rpc/
```

!!! tip 
    状态为 `"code": 0` 表示转账成功。
    注意：`--gas auto` 可能错误估算 Gas。若交易失败，状态响应将显示所需 Gas 量。请使用手动 Gas 上限（例如 `--gas 200000`）更新并重试命令。
