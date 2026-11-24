!!! warning "桥暂时不可用"
    由于正在调查的事件，Gonka–Ethereum 桥已暂停。请勿在进一步通知前使用该桥。请关注官方公告获取更新信息。

# 桥纪元更新

Gonka → Ethereum 转账使用当前 Gonka 纪元的 BLS 签名。Ethereum 桥合约必须在验证该签名并释放 Ethereum 上的资金之前，知晓当前纪元的群组密钥。

在每个纪元开始时（大约每天一次），Gonka 会生成一个新的群组密钥。一笔小额的 Ethereum 交易会将该密钥注册到桥合约中。通常这一步已经完成，但在纪元变更后，桥可能会短暂落后于 Gonka 链。

## 何时需要此操作

如果 Gonka → Ethereum 的提款或 WGNK 铸造已就绪，但 Ethereum 执行无法继续，原因是桥落后于链，则可能需要进行纪元更新。

在仪表板上，这可能显示为：

```text
A Bridge needs epoch update
Bridge: Epoch 283 | Chain: Epoch 284 (1 behind)

Withdrawals to Ethereum require the bridge to be synced to the current epoch.
```

如果看到此情况，请在仪表板上点击 **更新桥**。任何用户都可以提交更新。这是一个正常的 Ethereum 交易，因此点击按钮的钱包只需支付一次 Ethereum 燃料费。

## 手动更新

如果您未使用仪表板，请按顺序提交每个缺失的纪元：

1. 检查 Ethereum 桥合约已知的最新纪元。
2. 从 `latest + 1` 开始。
3. 获取纪元数据：

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/bls/epoch_data/<epochId>"
```

4. 使用返回的 `group_public_key` 和 `validation_signature` 字段配合桥更新脚本：

```bash
HARDHAT_NETWORK=mainnet node submit-epoch-public.js \
  0x972a7a92d92796a98801a8818bcf91f1648f2f68 \
  <epochId> \
  <group_public_key> \
  <validation_signature>
```

5. 重复此操作，直到桥纪元与链纪元匹配。
6. 重新尝试在 Ethereum 上执行提款或 WGNK 铸造。

!!! note 
    桥合约仅接受由前一纪元密钥签名的下一个连续纪元密钥。如果桥落后超过一个纪元，请逐个提交缺失的纪元。
