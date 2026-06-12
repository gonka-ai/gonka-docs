!!! warning
    务必先进行小额测试交易。跨链转账是不可逆的，因此在转移大额资金前，请先发送少量金额，并确认其如期到账。

    由 Gonka 共识控制的专用跨链桥智能合约已在以太坊上激活，地址为：

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# 提取 GNK（以太坊 → Gonka）

此操作是 [存入 GNK（Gonka → 以太坊）](deposit-gnk.md) 的逆向过程。它会在以太坊上销毁封装的 GNK（**WGNK**），并从 Gonka 的托管账户中释放等量的原生 **GNK**。

原生 GNK 将被释放到与以太坊上销毁 WGNK 所用密钥对应的 Gonka 地址。请确保你在 Gonka 上控制该密钥——参见 [地址与密钥](addresses-and-keys.md)。

### A) 在以太坊上销毁 WGNK

销毁操作只需将 WGNK 转账至桥接合约地址即可。当桥接合约检测到资金转入自身地址时，会将其识别为销毁操作，并触发一个 `WGNKBurned` 事件。

```javascript
// WGNK is the bridge contract itself (it is both the bridge and the WGNK ERC-20)
const tx = await wgnkContract.transfer(
  "0x972a7a92d92796a98801a8818bcf91f1648f2f68",   // bridge / WGNK address
  amountBN                                        // BigNumber amount (9 decimals)
);
await tx.wait();
```

!!! note
    WGNK 使用 **9 位小数**，以匹配原生 GNK 代币。

### B) 等待确认完成

跨链桥仅在 **已确认** 的以太坊区块上执行操作（大约两个 epoch）。从以太坊上燃烧交易被打包到最终确认，再到原生 GNK 出现在 Gonka 上，预计需要 **15 到 20 分钟**。以太坊端无需进一步操作——一旦燃烧交易得到确认，Gonka 共识机制将自动验证并释放托管中的 GNK。

### C) 检查你在 Gonka 上的 GNK 余额

查询由你的密钥推导出的 Gonka 地址的原生余额：

```bash
inferenced query bank balances <your_gonka_address> --node http://node1.gonka.ai:8000/chain-rpc/
```

您应该能在`ngonka`中看到已释放的金额（1 GNK = 10^9 ngonka）。

!!! tip
    如果约 20 分钟后余额仍未显示，请确认燃烧交易已在以太坊上最终确认，并且您正在查询的`gonka1…`地址是由**同一把**签署燃烧交易的密钥推导而来（而非种子派生的 Gonka 账户地址——参见[地址与密钥](addresses-and-keys.md)）。
