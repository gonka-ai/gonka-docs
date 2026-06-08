# 通过 Kava 提现 USDT（Gonka → 以太坊）

**使用场景：** 可用的 IBC USDT 已存在于 Gonka 钱包余额中，目标路径为 Gonka → Kava Cosmos → Kava EVM → 以太坊。

本指南描述了通往以太坊的**完整路径**。该路径可在任意已完成的步骤后停止：IBC USDT 可保留在 **Keplr 中的 Kava**、转移至 **MetaMask 中的 Kava EVM**，或继续前往 **以太坊**。

**免责声明：** 本指南**不构成财务建议**。路线参数、支持的资产、费用以及钱包/桥接 UI 可能会发生变化。在发送资金前，请务必验证当前路线、地址和金额。

## 重要提示：本指南适用于 IBC USDT

本指南涵盖的是 **Gonka / Kava Cosmos 上的 IBC USDT**。

请勿将其与以下内容混淆：

- 以太坊上的原生 **ERC-20 USDT**
- 交易所中的 USDT 余额
- 其他网络上的 USDT

在发送资金前，请始终检查：

- 资产 denom
- 源网络
- 目标网络
- 目标地址

## 路线概览

该路线包含**三个步骤**：

1. 在 **Keplr** 中完成 **Gonka → Kava (Cosmos)**
2. 在 **[app.kava.io](https://app.kava.io)** 中完成 **Kava → Kava EVM**
3. 在 **[Stargate](https://stargate.finance/transfer)** 中完成 **Kava EVM → 以太坊**

## 开始前准备

前提条件：

- 钱包余额中持有 **Gonka 上可用的 USDT**
- 一些用于 Gonka 交易费用的 **`GNK`**
- 一些用于 Kava / Kava EVM 费用的 **KAVA**
- 一些用于以太坊费用的 **ETH**
- 已安装 **Keplr** 和 **MetaMask**
- **先进行小额测试转账****有用的官方页面：**

- Keplr 帮助（含 IBC）：[help.keplr.app](https://help.keplr.app/)
- Kava 应用（含转账
 + wKAVA）：[app.kava.io](https://app.kava.io) — 转账页面：[app.kava.io/transfer](https://app.kava.io/transfer)
- Kava 帮助中心：[help.app.kava.io](https://help.app.kava.io/)
- Stargate 桥接 UI：[stargate.finance/transfer](https://stargate.finance/transfer)
- Kava 关于使用 Stargate 桥接 USDT 的指南：[如何使用 Stargate 桥接 USDt](https://www.kava.io/news/how-to-bridge-usdt-with-stargate)

## 重要提示：每一步使用正确的地址

- 在 **步骤 1** 中，发送至 Keplr 中的 **Kava Cosmos 地址**：**`kava1...`**
- 在 **步骤 2** 中，在 **app.kava.io** 内连接两个钱包
- 在 **步骤 3** 中，接收地址为 MetaMask 中的 **以太坊地址**：**`0x...`**

---

## 步骤 1 — 从 Gonka 向 Kava (Cosmos) 发送 USDT

此步骤将资金从 **Gonka** 发送到 **Keplr 中的 Kava Cosmos 地址**。

### 1. 在 Keplr 中启用手动 IBC

在 **Keplr** 中：

**设置 → 高级 → 手动 IBC 转账 → 开启**

如果不同版本的标签略有差异，请参考 Keplr 官方文档：[help.keplr.app](https://help.keplr.app/)。

### 2. 配置 Gonka 上的转账

- 为 **USDT / USDt** 资产打开 **高级 IBC 转账**

如果 Keplr 显示 **添加 IBC 通道** 或 **新建 IBC 通道**，请设置：

- **目标链：** **Kava**
- **源通道 ID：** **`channel-5`**

然后保存通道。

### 3. 复制 Kava 地址

- 确保 **Kava** 在 Keplr 中可见
- 切换到 **Kava**
- 复制完整的 **`kava1...`** 地址

### 4. 发送小额测试金额

在 **高级 IBC 转账** 界面，从目标下拉菜单中选择 **Kava (`channel-5`)**。

然后：

- 粘贴 **`kava1...`** 地址
- 输入一个**小额测试金额**
- **备注（memo）** 保持空白，除非目标是需要 **备注/标签** 的**交易所充值地址**
- 查看以 **`ngonka`** 计算的手续费
- 确认并批准交易

USDT 应出现在 **Keplr 中的 Kava** 上。

---

## 步骤 2 — 将 USDT 从 Kava IBC 转移到 Kava EVM

此步骤将资金从 **Kava Cosmos** 转移到 **Kava EVM**。

请先进行小额测试。

### 1. 打开 Kava 转账工具

打开 **转账** 页面：[app.kava.io/transfer](https://app.kava.io/transfer)。

### 2. 连接两个钱包

- 连接 **Keplr** 用于 **Kava** IBC 端
- 连接 **MetaMask** 用于 **Kava EVM** 端

### 3. 设置路线

选择：

- **资产：** **USDT**
- **发送链：** **Kava IBC**
- **接收链：** **Kava EVM**
- 点击 **转账**

USDT 应出现在 **MetaMask 中的 Kava EVM** 上。

Kava 的帮助文章介绍了如何在 Kava 不同层面之间转移 USDT，相关方向为 **Cosmos → Kava EVM**：[如何一键将 USDt 转移到 Cosmos 链](https://help.app.kava.io/article/44-how-to-transfer-usdt-to-cosmos-chains-with-a-single-click)。

### 如果 USDT 未在 MetaMask 中显示

MetaMask 可能不会自动显示该代币，可能需要手动导入代币。

Kava 帮助文档列出的 **Kava EVM 上的 USDT 合约** 为：

`0x919C1c267BC06a7039e03fcc2eF738525769109c`

在用于真实转账前，请再次在以下位置验证合约：

- 当前的 **[Kava 帮助中心](https://help.app.kava.io/)**
- **[app.kava.io](https://app.kava.io)** UI
- 钱包的代币信息

如果 MetaMask 提示输入小数位数，请使用 **6**。

---

## 步骤 3 — 从 Kava EVM 桥接 USDT 至以太坊

此步骤将资金从 **Kava EVM** 桥接到 **以太坊主网**。

### 1. 打开 Stargate

打开：[stargate.finance/transfer](https://stargate.finance/transfer)。

Kava 官方对此桥接模式的背景说明：[如何使用 Stargate 桥接 USDt](https://www.kava.io/news/how-to-bridge-usdt-with-stargate)。

### 2. 确保 MetaMask 连接到 Kava EVM

开始前，MetaMask 应连接至 **Kava EVM**。

源网络是 **Kava EVM**，而非以太坊。

### 3. 设置桥接路线

在 Stargate 中选择：

- **来源/发送：** **Kava EVM**
- **目标/接收：** **以太坊**
- **资产：** **USDT**

在某些 UI 中，来源可能仅显示为 **Kava**。关键是确保与步骤 2 后 USDT 所在的网络匹配。

### 4. 查看费用并进行小额测试

确认前：

- 检查**桥接费用**
- 检查**预计到账金额**
- **先进行小额测试**

然后在 MetaMask 中批准交易。

USDT 应出现在 **MetaMask 中的以太坊主网** 上。

### 如果 Stargate 未提供此路线

请立即停止操作。

**不要随意尝试其他桥接方式。**

如果 **Kava EVM 到以太坊的 USDT** 路线未显示，可能该路线已暂停、更改或暂时不可用。

---

## 步骤 4 — 确认以太坊上的资金

- 将 MetaMask 切换至 **以太坊主网**
- 检查接收地址的 **USDT** 余额
- 如有必要，手动导入代币

常用的以太坊主网 USDT 合约为：

`0xdAC17F958D2ee523a2206206994597C13D831ec7`

在导入前，请通过可信来源验证当前合约，例如：

- **Tether 官网**
- **[Etherscan](https://etherscan.io/)**
- 钱包的已验证代币列表

测试金额到账后，可对剩余金额重复相同流程。

---

## 可选 — 在 Kava Cosmos 与 Kava EVM 之间转移 KAVA

如需在另一侧获取 KAVA 作为 Gas 费，可使用：[app.kava.io/evm/wkava](https://app.kava.io/evm/wkava)。

Kava 提供的分步指南：[在 Kava Cosmos 与 Kava EVM 之间发送 KAVA](https://help.app.kava.io/article/26-send-kava-to-and-from-kava-cosmos-and-kava-evm)。

---

## 高级提示 — 大额转账前验证 Gonka IBC 通道

对大多数用户而言，小额测试转账**无需验证 Gonka IBC 通道**。

若要在发送大额资金前验证当前 Gonka 出站通道，可通过以下方式检查通道：

```bash
curl -sS "https://node1.gonka.ai:8443/chain-api/ibc/core/channel/v1/channels" | jq '.channels[] | select(.port_id=="transfer") | {gonka_channel_id:.channel_id, kava_counterparty:.counterparty.channel_id}'
```

在本指南编写时，Gonka → Kava 的跨链转账使用以下通道：

- **Gonka 侧：** `channel-5`
- **Kava 侧：** `channel-161`

当**从 Gonka 发送**时，请使用**Gonka 侧的通道**，即 **`channel-5`**。

---

## 最后的安全提醒

在发送全额资金之前，请务必确认以下步骤均已成功完成：

- 步骤 1 已在 Keplr 中的 **Kava 链上显示 USDT**
- 步骤 2 已在 MetaMask 中的 **Kava EVM 上显示 USDT**
- 步骤 3 可通过 **Stargate** 实现从 **Kava EVM 到以太坊**的 USDT 转账
- 小额测试转账已成功完成

如果以上任一检查未通过，请立即停止操作，仔细排查问题后再继续转移全部资金。

---

请始终仔细核对转账路径、地址、资产类型和金额，并务必先进行小额测试转账。
