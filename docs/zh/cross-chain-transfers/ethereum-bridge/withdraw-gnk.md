!!! warning
    务必先进行小额测试交易。跨链转账是不可逆的，因此在转移大额资金之前，请先发送少量金额，并确认其如期到账。

由 Gonka 共识控制的专用跨链桥智能合约已在以太坊上激活，合约地址为：```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```---

# 提取 GNK（以太坊 → Gonka）

这是 [存入 GNK（Gonka → 以太坊）](deposit-gnk.md) 的逆向操作。该过程会在以太坊上销毁封装的 GNK（**WGNK**），并从 Gonka 的托管账户中释放等量的原生 **GNK**。

释放的原生 GNK 将发送至与以太坊上销毁 WGNK 所用密钥对应的 Gonka 地址。请确保你在 Gonka 上控制该密钥——参见 [地址与密钥](addresses-and-keys.md)。

### A) 在以太坊上销毁 WGNK

销毁操作只需将 WGNK 转账至桥接合约地址即可。桥接合约会将转入自身的转账识别为销毁行为，并触发 `WGNKBurned` 事件。```javascript
// WGNK is the bridge contract itself (it is both the bridge and the WGNK ERC-20)
const tx = await wgnkContract.transfer(
  "0x972a7a92d92796a98801a8818bcf91f1648f2f68",   // bridge / WGNK address
  amountBN                                        // BigNumber amount (9 decimals)
);
await tx.wait();
```!!! note
    WGNK 使用 **9 位小数**，以匹配原生 GNK 代币。

### B) 等待最终确认

该桥接仅处理已**最终确认**的以太坊区块（约两个 epoch）。从代币在以太坊上被销毁到原生 GNK 出现在 Gonka 上，预计需要 **15–20 分钟**。以太坊端无需进一步操作——一旦销毁交易得到最终确认，Gonka 共识机制将自动验证并释放托管的 GNK。

### C) 检查你在 Gonka 上的 GNK 余额

查询由你的密钥派生的 Gonka 地址的原生余额：```bash
inferenced query bank balances <your_gonka_address> --node http://node1.gonka.ai:8000/chain-rpc/
```你应该能在 `ngonka` 中看到已释放的金额（1 GNK = 10^9 ngonka）。

!!! tip
    如果大约 20 分钟后余额仍未显示，请确认燃烧交易已在以太坊上最终确认，并且你正在查询的 `gonka1…` 地址是由**相同**的密钥推导出来的（不是由助记词生成的 Gonka 账户——参见[地址和密钥](addresses-and-keys.md)）。