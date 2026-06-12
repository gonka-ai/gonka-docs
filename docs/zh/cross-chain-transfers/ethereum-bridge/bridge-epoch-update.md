# 桥接纪元更新

从 Gonka 转移到以太坊的交易需要当前 Gonka 纪元的 BLS 签名。以太坊上的桥接合约必须知晓当前纪元的群组密钥，才能验证该签名并释放以太坊上的资金。

每个纪元开始时（大约每天一次），Gonka 会生成一个新的群组密钥。通过一笔小额以太坊交易，将该密钥注册到桥接合约中。通常这一步骤已经自动完成，但在纪元切换后的短时间内，桥接状态可能会暂时落后于 Gonka 链。

## 何时需要此操作

如果您的 Gonka → 以太坊提款或 WGNK 铸造交易已准备就绪，但由于桥接状态落后于 Gonka 链而导致以太坊端无法执行，您可能需要进行纪元更新。

在仪表板上，这种情况可能表现为：

```text
A Bridge needs epoch update
Bridge: Epoch 283 | Chain: Epoch 284 (1 behind)

Withdrawals to Ethereum require the bridge to be synced to the current epoch.
```

如果看到此提示，请在仪表板中点击 **更新桥接**。任何用户都可以提交更新。这是一笔普通的以太坊交易，因此点击按钮的钱包需为此次更新支付一次以太坊 Gas 费。

## 手动更新

如果您未使用仪表板，请按顺序提交每个缺失的纪元：

1. 检查以太坊桥接合约已知的最新纪元。
2. 从 `latest
3. 1` 开始。
获取纪元数据：

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/bls/epoch_data/<epochId>"
```

4. 使用返回的 `group_public_key` 和 `validation_signature` 字段以及网桥更新脚本：

```bash
HARDHAT_NETWORK=mainnet node submit-epoch-public.js \
  0x972a7a92d92796a98801a8818bcf91f1648f2f68 \
  <epochId> \
  <group_public_key> \
  <validation_signature>
```

5. 对于每一个缺失的纪元，重复上述步骤，直到桥接纪元与链上纪元一致。  
6. 在以太坊上重试提款或 WGNK 铸造操作。

!!! note
    桥接合约仅接受由前一个纪元密钥签名的下一个连续纪元密钥。如果桥接落后超过一个纪元，则必须逐个提交缺失的纪元。
