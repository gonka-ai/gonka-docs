# 通过 Kava 提取 USDT（Gonka → 以太坊）

**使用场景：**Gonka 钱包余额中已有可用的 IBC USDT，目标路径为 Gonka → Kava Cosmos → Kava EVM → 以太坊。

本指南描述了到达以太坊的**完整路径**。该路线可以在任何已完成的步骤后停止：IBC USDT 可以留在 **Keplr 中的 Kava** 上，移至 **MetaMask 中的 Kava EVM**，或继续前往**以太坊**。

**免责声明：**本指南**不构成投资建议**。路线参数、支持的资产、费用以及钱包/跨链桥界面可能会发生变化。在发送资金之前，请始终验证当前路线、地址和金额。

## 重要提示：本指南适用于 IBC USDT

本指南涵盖 **Gonka / Kava Cosmos 上的 IBC USDT**。

请**不要**将其与以下混淆：

- 以太坊上的原生 **ERC-20 USDT**
- 交易所的 USDT 余额
- 其他网络上的 USDT

在发送资金之前，请始终检查：

- 资产代币名称（denom）
- 源网络
- 目标网络
- 目标地址

## 路线概述

该路线包含**三个步骤**：

1. **Gonka → Kava (Cosmos)**，在 **Keplr** 中操作
2. **Kava → Kava EVM**，在 **[app.kava.io](https://app.kava.io)** 中操作
3. **Kava EVM → 以太坊**，在 **[Stargate](https://stargate.finance/transfer)** 中操作

## 开始之前

要求：

- 钱包余额中有**可用的 USDT（在 Gonka 上）**
- 少量 **`GNK`** 用于 Gonka 交易费用
- 少量 **KAVA** 用于 Kava / Kava EVM 费用
- 少量 **ETH** 用于以太坊费用
- 已安装 **Keplr** 和 **MetaMask**
- **先进行小额测试转账**

**有用的官方页面：**

- Keplr 帮助（含 IBC）：[help.keplr.app](https://help.keplr.app/)
- Kava 应用（含转账和 wKAVA）：[app.kava.io](https://app.kava.io) — 转账：[app.kava.io/transfer](https://app.kava.io/transfer)
- Kava 帮助中心：[help.app.kava.io](https://help.app.kava.io/)
- Stargate 跨链桥界面：[stargate.finance/transfer](https://stargate.finance/transfer)
- Kava 使用 Stargate 跨链 USDT 指南：[How to Bridge USDt with Stargate](https://www.kava.io/news/how-to-bridge-usdt-with-stargate)

## 重要提示：每步使用正确的地址

- **步骤 1** 中，发送到 Keplr 中的 **Kava Cosmos 地址**：**`kava1...`**
- **步骤 2** 中，在 **app.kava.io** 中连接两个钱包
- **步骤 3** 中，在 MetaMask 中接收到**以太坊地址**：**`0x...`**

---

## 步骤 1 — 从 Gonka 发送 USDT 到 Kava（Cosmos）

此步骤将资金从 **Gonka** 发送到 **Keplr** 中的 **Kava Cosmos** 地址。

### 1. 在 Keplr 中启用手动 IBC

在 **Keplr** 中：

**设置 → 高级 → 手动 IBC 转账 → 开启**

如果标签因版本不同而略有差异，请参考 Keplr 自己的文档：[help.keplr.app](https://help.keplr.app/)。

### 2. 在 Gonka 上配置转账

- 打开 **USDT / USDt** 资产的**高级 IBC 转账**

如果 Keplr 显示 **Add IBC channel** 或 **New IBC channel**，请设置：

- **目标链：** **Kava**
- **Source Channel Id：** **`channel-5`**

然后保存该通道。

### 3. 复制 Kava 地址

- 确保 **Kava** 在 Keplr 中可见
- 切换到 **Kava**
- 复制完整的 **`kava1...`** 地址

### 4. 发送小额测试金额

在**高级 IBC 转账**中，从目标下拉菜单中选择 **Kava (`channel-5`)**。

然后：

- 粘贴 **`kava1...`** 地址
- 输入**小额测试金额**
- 除非目标是需要 **memo/tag** 的**交易所充值地址**，否则将 **memo** 留空
- 查看以 **`ngonka`** 计价的费用
- 批准交易

USDT 应出现在 **Keplr 中的 Kava** 上。

---

## 步骤 2 — 将 USDT 从 Kava IBC 移至 Kava EVM

此步骤将资金从 **Kava Cosmos** 移至 **Kava EVM**。

先从小额测试金额开始。

### 1. 打开 Kava 转账工具

打开**转账**页面：[app.kava.io/transfer](https://app.kava.io/transfer)。

### 2. 连接两个钱包

- 连接 **Keplr** 用于 **Kava** IBC 侧
- 连接 **MetaMask** 用于 **Kava EVM** 侧

### 3. 设置路线

选择：

- **资产：** **USDT**
- **发送链：** **Kava IBC**
- **接收链：** **Kava EVM**
- 点击 **Transfer**

USDT 应出现在 **MetaMask 中的 Kava EVM** 上。

Kava 关于在 Kava 表面之间移动 USDT 的帮助文章，此处相关方向为 **Cosmos → Kava EVM**：[How to transfer USDt to Cosmos chains with a single click](https://help.app.kava.io/article/44-how-to-transfer-usdt-to-cosmos-chains-with-a-single-click)。

### 如果 USDT 未在 MetaMask 中显示

MetaMask 可能不会自动显示该代币。可能需要手动导入代币。

Kava 帮助文档列出了以下 **Kava EVM 上的 USDT 合约**：

`0x919C1c267BC06a7039e03fcc2eF738525769109c`

在将该合约用于实际转账之前，请在以下来源中再次验证该合约：

- 当前的 **[Kava 帮助中心](https://help.app.kava.io/)**
- **[app.kava.io](https://app.kava.io)** 界面
- 钱包的代币信息

如果 MetaMask 要求输入精度，请使用 **6**。

---

## 步骤 3 — 将 USDT 从 Kava EVM 跨链到以太坊

此步骤将资金从 **Kava EVM** 跨链到**以太坊主网**。

### 1. 打开 Stargate

打开：[stargate.finance/transfer](https://stargate.finance/transfer)。

Kava 关于此跨链模式的背景信息：[How to Bridge USDt with Stargate](https://www.kava.io/news/how-to-bridge-usdt-with-stargate)。

### 2. 确保 MetaMask 连接到 Kava EVM

开始之前，MetaMask 应连接到 **Kava EVM**。

源网络是 **Kava EVM**，不是以太坊。

### 3. 设置跨链路线

在 Stargate 中，选择：

- **From / 源：** **Kava EVM**
- **To / 目标：** **Ethereum**
- **资产：** **USDT**

在某些界面中，源可能简单显示为 **Kava**。重要的条件是匹配步骤 2 完成后 USDT 所在的网络。

### 4. 查看费用并发送小额测试

确认之前：

- 检查**跨链桥费用**
- 检查**预计到账金额**
- **先发送小额测试**

然后在 MetaMask 中批准交易。

USDT 应出现在 **MetaMask 中的以太坊主网**上。

### 如果 Stargate 不提供此路线

请停下。

**不要**猜测替代的跨链桥。

如果 **从 Kava EVM 到以太坊的 USDT** 路线未显示，该路线可能已暂停、变更或暂时不可用。

---

## 步骤 4 — 确认以太坊上的资金

- 将 MetaMask 切换到**以太坊主网**
- 检查接收地址的 **USDT** 余额
- 如有需要，手动导入代币

常用的以太坊主网 USDT 合约为：

`0xdAC17F958D2ee523a2206206994597C13D831ec7`

导入之前，请在可信来源中验证当前合约，例如：

- **Tether**
- **[Etherscan](https://etherscan.io/)**
- 钱包的已验证代币列表

测试金额到账后，对剩余余额重复相同流程。

---

## 可选 — 在 Kava Cosmos 和 Kava EVM 之间移动 KAVA

如果另一侧需要 KAVA 用于 Gas 费用，请使用：[app.kava.io/evm/wkava](https://app.kava.io/evm/wkava)。

Kava 的分步指南：[Send KAVA to and from Kava Cosmos and Kava EVM](https://help.app.kava.io/article/26-send-kava-to-and-from-kava-cosmos-and-kava-evm)。

---

## 高级说明 — 在大额转账前验证 Gonka IBC 通道

对于大多数用户，**小额测试转账不需要通道验证**。

要在发送大额资金之前验证当前的 Gonka 出站通道，请使用以下命令检查通道：

```bash
curl -sS "https://node1.gonka.ai:8443/chain-api/ibc/core/channel/v1/channels" | jq '.channels[] | select(.port_id=="transfer") | {gonka_channel_id:.channel_id, kava_counterparty:.counterparty.channel_id}'
```

在本指南编写时，Gonka → Kava 转账使用：

- **Gonka 侧：** `channel-5`
- **Kava 侧：** `channel-161`

从 **Gonka** 发送时，使用 **Gonka 侧通道**，即 **`channel-5`**。

---

## 最终安全提醒

在发送全额之前，请确保：

- 步骤 1 结束时 USDT 在 **Keplr 中的 Kava** 上可见
- 步骤 2 结束时 USDT 在 **MetaMask 中的 Kava EVM** 上可见
- 步骤 3 在 **Stargate** 中提供**从 Kava EVM 到以太坊的 USDT** 路线
- 测试转账已成功完成

如果任何检查失败，请在转移全额余额之前停下并核查。

---

请始终仔细核对路线、地址、资产和金额，并先进行小额测试转账。
