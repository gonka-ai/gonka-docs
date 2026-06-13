!!! warning
    务必先进行小额测试交易。跨链转账是不可逆的，因此在转移大额资金之前，请先发送少量金额，并确认其如期到账。

由 Gonka 共识控制的专用跨链桥智能合约已在以太坊上激活，合约地址为：```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```---

# 通过看板桥接（UI 指南）

仪表板是最简单的跨链桥接方式。它会自动为您处理密钥派生（参见[地址和密钥](addresses-and-keys.md)），因此您无需手动导入私钥或计算地址。您可以通过以下地址打开它：```text
https://node1.gonka.ai:8443/dashboard/
```

!!! tip
    如果你不熟悉命令行工具（CLI）或不希望手动处理私钥，建议使用仪表板。手动操作的 CLI 流程详见 [存入 USDT](deposit-usdt.md)、[提现 USDT](withdraw-usdt.md)、[存入 GNK](deposit-gnk.md) 和 [提现 GNK](withdraw-gnk.md)。

## 仪表板的功能

* **自动推导正确的地址。** 连接你用于跨链的以太坊钱包后，仪表板会显示对应的 `gonka1…` 地址，即跨链桥将代币发送到的目标地址——这样你始终清楚你的封装代币将到达何处。
* **警告助记词账户风险。** 如果你使用的钱包其以太坊和 Gonka 密钥源自相同的 **助记词（mnemonic）**，仪表板会检测到并发出警告，因为由助记词生成的账户在不同链上使用不同的密钥——你的 Gonka 钱包默认不会显示跨链代币。你仍然控制接收地址（可以从同一助记词中派生出匹配的密钥），但需要额外的手动派生步骤。详见 [地址与密钥](addresses-and-keys.md) 了解完整说明。
* **显示你的跨链余额**，在"跨链资产"部分展示，以便确认存款是否到账。
* **报告链的运行状态**，让你在发起转账前确认链是否处于异常状态。
* **提示更新跨链桥纪元（epoch）**，当以太坊跨链桥落后于 Gonka 链时。如果看到 **A Bridge needs epoch update**（跨链桥需要更新纪元），点击 **Update bridge**（更新跨链桥）以提交缺失的纪元密钥。这是一笔普通的以太坊交易，因此由连接的钱包支付 Gas 费。详见 [跨链桥纪元更新](bridge-epoch-update.md)。

## 支持的操作流程

仪表板支持全套跨链操作，无需使用命令行工具（CLI）：

* **以太坊 → Gonka**：存入任意 ERC-20 代币（如 USDT、USDC、WETH 等），并在 Gonka 上获得对应的封装代币。
* **Gonka → 以太坊**：将封装代币提现回指定的以太坊地址。
* **GNK ↔ WGNK**：将原生 GNK 跨链封装为以太坊上的 WGNK，或反向赎回。

## 存入代币（以太坊 → Gonka）

本节介绍如何通过仪表板上的跨链桥小组件将 ERC-20 代币从以太坊存入 Gonka。支持 USDC、USDT 以及 WGNK——操作流程完全相同。存入 WGNK 时，跨链桥会在 Gonka 上释放原生 GNK。

存款分为三个阶段：

1. **在以太坊上锁定代币（Lock tokens on Ethereum）** —— 您的代币被发送至以太坊上的跨链桥合约并锁定。
2. **验证者签名（Validator signatures）** —— Gonka 验证者观察已最终确认的以太坊存款并收集 BLS 签名。
3. **在 Gonka 上铸造（Mint on Gonka）** —— 封装代币在 Gonka 上被铸造并发送到您派生的 `gonka1…` 地址。

详细的分步操作指南（含 USDC、USDT 和 GNK 截图）请参阅英文版 [Bridge via dashboard (UI guide)](../../../cross-chain-transfers/ethereum-bridge/dashboard.md) 中的 Deposit 部分。

## 提现代币（Gonka → 以太坊）

本节将引导您使用跨链桥小组件将代币从 Gonka 提现回以太坊。以下示例使用 GNK 和 USDC —— 其他支持的代币操作流程完全相同。

提现分为三个阶段，小组件中的进度指示器会实时跟踪：

1. **在 Gonka 上销毁代币（Burn tokens on Gonka）** —— 封装代币在 Gonka 链上被销毁（或原生 GNK 被锁定）。
2. **验证者签名（Validator signatures）** —— Gonka 验证者生成 BLS 聚合签名以授权释放操作。
3. **在以太坊上释放（Release on Ethereum）** —— 原始代币从以太坊上的跨链桥合约中释放（或铸造 WGNK）。

### 1. 打开仪表板

在浏览器中打开任一创世节点：

- [https://node1.gonka.ai:8443](https://node1.gonka.ai:8443)
- [https://node2.gonka.ai:8443](https://node2.gonka.ai:8443)

在左侧边栏中导航到 **Developers** 部分。在跨链桥小组件中选择 **WITHDRAW** 切换按钮。

<a href="/images/bridge_withdraw_1.png" target="_blank"><img src="/images/bridge_withdraw_1.png" style="width:500px; height:auto;"></a>

### 2. 连接您的 Keplr 钱包

确认 **WITHDRAW** 切换按钮已选中。点击 **CONNECT WALLET**。

弹出对话框将显示可用的钱包选项。选择 **KEPLR**。

<a href="/images/bridge_withdraw_2.png" target="_blank"><img src="/images/bridge_withdraw_2.png" style="width:500px; height:auto;"></a>

!!! note "Keplr 显示"Not Installed"？"
    如果看到"Not Installed"消息，您需要先安装 Keplr 浏览器扩展。请按照[创建 Gonka 账户 → Keplr 浏览器扩展](../../wallet/create-account.md)中的说明进行设置，然后返回此处。

如果提示输入 Keplr 密码，请输入。连接成功后，小组件将显示 **Keplr Connected**（Keplr 已连接）及您的 Gonka 地址缩写和 GNK 余额。点击 **CONTINUE** 继续。

<a href="/images/bridge_withdraw_3.png" target="_blank"><img src="/images/bridge_withdraw_3.png" style="width:500px; height:auto;"></a>

!!! warning "助记词（mnemonic）账户"
    如果您的 Gonka 账户是通过 **助记词（mnemonic）** 而非原始私钥创建的，跨链桥小组件会检测到地址不匹配并发出警告。这是因为以太坊和 Gonka 从同一助记词派生出 **不同的密钥**，因此代币将被释放到与钱包当前显示不同的以太坊地址。资金不会丢失——您可以从同一助记词派生出匹配的密钥——但需要手动派生步骤。如果看到此警告，请停止操作并阅读[地址与密钥](addresses-and-keys.md)。

### 3. 选择代币和金额

在步骤 2 中，从 **Token** 下拉菜单中选择您要提现的代币，并输入 **Amount**（金额）。小组件会显示您在 Gonka 上的当前余额。**Destination Address**（目标地址）会从您连接的钱包中自动填入。

注意：与存款不同，您可以编辑此字段以提现到其他以太坊地址。请确保该地址由您控制，并且输入正确。

小组件还会显示跨链桥 epoch 状态和以 ETH 计价的 **大致费用**。

=== "GNK"

    <a href="/images/bridge_withdraw_4.png" target="_blank"><img src="/images/bridge_withdraw_4.png" style="width:500px; height:auto;"></a>

=== "USDC (Ethereum)"

    <a href="/images/bridge_withdraw_8.png" target="_blank"><img src="/images/bridge_withdraw_8.png" style="width:500px; height:auto;"></a>

点击 **REVIEW & BRIDGE**。

### 4. 确认 Gonka 上的销毁交易

Keplr 将弹出 Gonka 链上的 **确认交易** 窗口。此交易会在 Gonka 上销毁封装代币（或锁定原生 GNK）—— 即进度指示器中的 **Burn tokens on Gonka** 步骤。请仔细检查详情后点击 **Approve**。

- 对于 **GNK**：消息类型为 `MsgRequestBridgeMint`，用于在 Gonka 上锁定 GNK 并请求在以太坊上铸造 WGNK。
- 对于 **ERC-20 代币**（USDC、USDT 等）：消息为 `Execute Wasm Contract` 调用，执行封装代币的 CW-20 合约中的 `withdraw` 方法。
- **Tx Fee** —— 0 GNK（此交易在 Gonka 链上无 Gas 费用）。

=== "GNK"

    <a href="/images/bridge_withdraw_5.png" target="_blank"><img src="/images/bridge_withdraw_5.png" style="width:500px; height:auto;"></a>

=== "USDC (Ethereum)"

    <a href="/images/bridge_withdraw_9.png" target="_blank"><img src="/images/bridge_withdraw_9.png" style="width:500px; height:auto;"></a>

!!! warning
    确认前请仔细核对所有信息。跨链转账 **不可逆**。如有任何异常，请点击 **✕** 取消并重新开始。

确认后，进度指示器将标记 **Burn tokens on Gonka** 为已完成。随后 Gonka 验证者将自动收集和聚合 BLS 签名（**Validator signatures** 步骤）—— 此阶段无需您进行任何操作。

### 5. 确认以太坊上的释放交易

当验证者完成 BLS 聚合签名（**Validator signatures** — done）后，Keplr 将弹出第二个窗口 —— 这次是在 **以太坊链** 上。此交易执行以太坊上的跨链桥合约（`0x972a7a92…648f2f68`）以释放代币（即 **Release on Ethereum** 步骤）。

- **To** —— 以太坊上的跨链桥合约地址。
- **Tx Fee** —— 以太坊 Gas 费用（以 ETH 支付）。具体金额取决于当前 Gas 价格。

=== "GNK"

    <a href="/images/bridge_withdraw_6.png" target="_blank"><img src="/images/bridge_withdraw_6.png" style="width:500px; height:auto;"></a>

=== "USDC (Ethereum)"

    <a href="/images/bridge_withdraw_10.png" target="_blank"><img src="/images/bridge_withdraw_10.png" style="width:500px; height:auto;"></a>

点击 **Approve** 提交释放交易。

### 6. 提现完成

释放交易在以太坊上确认后，小组件将显示 **Withdrawal complete**（提现完成）界面，所有三个阶段均标记为已完成：

- **Burn tokens on Gonka**（在 Gonka 上销毁代币）— done
- **Validator signatures**（验证者签名）— done
- **Release on Ethereum**（在以太坊上释放）— done

=== "GNK"

    <a href="/images/bridge_withdraw_7.png" target="_blank"><img src="/images/bridge_withdraw_7.png" style="width:500px; height:auto;"></a>

=== "USDC (Ethereum)"

    <a href="/images/bridge_withdraw_11.png" target="_blank"><img src="/images/bridge_withdraw_11.png" style="width:500px; height:auto;"></a>

在此界面您可以：

- 点击 **VIEW ON EXPLORER** 在以太坊上查看交易详情。
- 点击 **TRANSFER MORE TOKENS** 进行下一笔提现。
- 点击 **DISCONNECT** 断开钱包连接。

### 7. 验证提现结果

您可以通过以下方式确认代币已到账：

- **在仪表板中**：通过提现完成界面上的浏览器链接查看交易。
- **在以太坊钱包中**：释放的 ERC-20 代币（如 USDC、USDT 等）应显示在钱包余额中。
- **Keplr 中的 WGNK**：如果您提现的是 GNK，生成的 WGNK 代币会 **自动** 添加到您的 Keplr 钱包中，无需手动操作即可在资产列表中查看。

<a href="/images/bridge_withdraw_12.png" target="_blank"><img src="/images/bridge_withdraw_12.png" style="width:auto; height:337.5px;"></a>
