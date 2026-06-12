!!! warning
    务必先进行小额测试交易。跨链转账是不可逆的，因此在转移大额资金之前，请先发送少量资金并确认其已按预期到账。

    由 Gonka 共识控制的专用跨链桥智能合约已在以太坊上激活，地址为：

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# 通过仪表盘进行跨链桥接（UI 指南）

仪表盘是进行跨链桥接最简单的方式。它会自动为您处理密钥推导（参见[地址与密钥](addresses-and-keys.md)），因此您无需手动导入私钥或计算地址。

## 仪表盘为您完成的操作

* **推导正确的地址。** 连接您用于桥接的以太坊钱包后，仪表盘会显示匹配的 `gonka1…` 地址，即桥接将代币发送到的目标地址——这样您始终能清楚封装代币的最终去向。
* **警告助记词账户。** 如果您使用的是以太坊和 Gonka 密钥来自同一**助记词**的钱包，仪表盘会检测到并发出警告，因为基于种子派生的账户在不同链上使用不同的密钥，可能导致资金发送到您无法控制的地址。请阅读[地址与密钥](addresses-and-keys.md)了解完整说明。
* **显示您的桥接余额**，在“桥接资产”部分中，您可以确认存款是否已到账。
* **报告链状态**，让您在发起转账前了解链是否处于降级状态。
* **提示桥接纪元更新**，当以太坊桥接落后于 Gonka 链时。如果看到 **A Bridge needs epoch update**（桥接需要纪元更新），请点击 **Update bridge**（更新桥接）以提交缺失的纪元密钥。这是一笔正常的以太坊交易，因此由连接的钱包支付 Gas 费。详见[桥接纪元更新](bridge-epoch-update.md)。

## 支持的流程

仪表盘支持全套无需使用命令行工具（CLI）的转账操作：

* **Ethereum → Gonka**：存入任意 ERC-20 代币（USDT、USDC、WETH 等），在 Gonka 上接收封装代币。
* **Gonka → Ethereum**：将封装代币从 Gonka 提现回以太坊地址。
* **GNK ↔ WGNK**：将原生 GNK 桥接到以太坊成为 WGNK，并可反向操作。

---

## 存入 ERC-20 代币（Ethereum → Gonka）

本节将引导您使用原生仪表盘上的桥接小部件，从以太坊向 Gonka 存入 ERC-20 代币。以下示例使用 USDC 和 USDT —— 对于任何支持的 ERC-20 代币，流程完全相同。

### 1. 打开仪表盘

在浏览器中打开任一创世节点：

- [https://node1.gonka.ai:8443](https://node1.gonka.ai:8443)
- [https://node2.gonka.ai:8443](https://node2.gonka.ai:8443)

在左侧边栏中导航至 **Developers**（开发者）部分。您将在页面底部看到桥接小部件，带有 **WITHDRAW**（提现）/ **DEPOSIT**（存款）切换按钮。

<a href="/images/bridge_widget_2.png" target="_blank"><img src="/images/bridge_widget_2.png" style="width:500px; height:auto;"></a>

### 2. 连接您的 Keplr 钱包

确保已选择 **DEPOSIT**（存款）切换按钮。点击 **CONNECT WALLET**（连接钱包）。

一个包含可用钱包选项的对话框将出现。选择 **KEPLR**。

<a href="/images/bridge_widget_3.png" target="_blank"><img src="/images/bridge_widget_3.png" style="width:500px; height:auto;"></a>

!!! note "Keplr 显示“未安装”？"
    如果看到“未安装”消息，您需要先安装 Keplr 浏览器扩展程序。请按照[创建 Gonka 账户 → Keplr 浏览器扩展](../../wallet/create-account.md)中的说明进行设置，然后返回此处。

    如有提示，请输入您的 Keplr 密码。连接成功后，小部件将显示 **Keplr Connected**（Keplr 已连接），并附上您简写的 Gonka 地址和 GNK 余额。点击 **CONTINUE**（继续）以继续操作。

    <a href="/images/bridge_widget_4.png" target="_blank"><img src="/images/bridge_widget_4.png" style="width:500px; height:auto;"></a>

!!! warning "助记词（mnemonic）账户"
    如果您的 Gonka 账户是通过**助记词**（而非原始私钥）创建的，桥接小部件会检测到地址不匹配并发出警告。这是因为以太坊和 Gonka 会从同一助记词派生出**不同的密钥**，导致代币被发送到您可能无法控制的地址。如果看到此警告，请立即停止操作，并在继续前阅读[地址与密钥](addresses-and-keys.md)。

### 3. 选择代币和金额

在第二步中，从 **Token**（代币）下拉菜单中选择您要存入的代币，并输入 **Amount**（金额）。小部件将显示您在以太坊上的该代币当前余额。**Receiving address on Gonka**（Gonka 接收地址）将自动从您连接的钱包中填充。

小部件还会显示预估的**处理时间**和以 ETH 计价的**近似费用**。

=== "USDC"

    <a href="/images/bridge_widget_5.png" target="_blank"><img src="/images/bridge_widget_5.png" style="width:500px; height:auto;"></a>

=== "USDT"

    <a href="/images/bridge_widget_8.png" target="_blank"><img src="/images/bridge_widget_8.png" style="width:500px; height:auto;"></a>

点击 **REVIEW & BRIDGE**（查看并桥接）。

### 4. 确认交易

您的钱包将弹出 **Confirm Transaction**（确认交易）界面。在批准前请仔细核对以下信息：

- **代币和金额** —— 确认代币和金额是否正确。
- **From**（发送方） —— 您的以太坊地址（发送者）。
- **To**（接收方） —— 桥接合约地址（`0x972a7A92…648f2F68`）。这是正常现象 —— 您正在将代币发送至桥接合约，随后桥接将在 Gonka 上铸造封装代币。
- **Tx Fee**（交易费） —— 您为此交易支付的以太坊 Gas 费。

=== "USDC"

    <a href="/images/bridge_widget_6.png" target="_blank"><img src="/images/bridge_widget_6.png" style="width:500px; height:auto;"></a>

=== "USDT"

    <a href="/images/bridge_widget_9.png" target="_blank"><img src="/images/bridge_widget_9.png" style="width:500px; height:auto;"></a>

点击 **Approve**（批准）以提交交易。

!!! warning
    确认前请再次核对所有信息。桥接转账是**不可逆的**。如果发现任何异常，请点击 **✕** 取消并重新开始。

### 5. 存款完成

当交易在以太坊上确认后，桥接将锁定您的代币，收集验证节点签名，并在 Gonka 上铸造封装代币。小部件将显示 **Deposit complete**（存款完成）界面，并提供操作摘要。

=== "USDC"

    <a href="/images/bridge_widget_7.png" target="_blank"><img src="/images/bridge_widget_7.png" style="width:500px; height:auto;"></a>

=== "USDT"

    <a href="/images/bridge_widget_10.png" target="_blank"><img src="/images/bridge_widget_10.png" style="width:500px; height:auto;"></a>

从此界面您可以：

- 点击 **VIEW ON EXPLORER**（在浏览器中查看）以查看以太坊上的交易详情。
- 点击 **TRANSFER MORE TOKENS**（转账更多代币）以进行另一次存款。
- 点击 **DISCONNECT**（断开连接）以断开钱包连接。

### 6. 验证您的存款

您可以通过以下几种方式确认封装代币已到账：

- **在仪表盘中**：打开 `https://node2.gonka.ai:8443/dashboard/gonka/account/<your_gonka_address>` 并检查您的余额。
- **通过“存款完成”界面显示的交易链接**。
- **在 Keplr 中**：封装代币（CW-20）不会自动出现在 Keplr 中 —— 请按照以下步骤手动添加。

---

## 将封装代币添加至 Keplr

封装的 ERC-20 代币（如 wUSDC 和 wUSDT）在 Gonka 链上属于 CW-20 代币。Keplr 不会自动检测 CW-20 代币，因此您需要将其作为自定义代币手动添加。添加后，它们将与其他代币一起显示在 Keplr 资产列表中。

!!! note
    IBC 代币（通过 IBC 而非以太坊桥接转移的代币）会自动出现在 Keplr 中。以下手动步骤仅适用于桥接封装的 CW-20 代币。

    **步骤 1.** 打开您的 Keplr 钱包，点击右上角的菜单图标（三条横线），然后选择 **Manage Asset List**（管理资产列表）。

    <a href="/images/bridge_widget_12.png" target="_blank"><img src="/images/bridge_widget_12.png" style="width:auto; height:337.5px;"></a>

    **步骤 2.** 点击右上角的 **+** 按钮以添加自定义代币。

    <a href="/images/bridge_widget_13.png" target="_blank"><img src="/images/bridge_widget_13.png" style="width:auto; height:337.5px;"></a>

    **步骤 4.** 在 **Add Custom Token**（添加自定义代币）页面，从链下拉菜单中选择 **Gonka**。将 CW-20 合约地址粘贴到 **Contract Address**（合约地址）字段中。代币元数据（名称、符号、小数位数）将自动填充。点击 **Confirm**（确认）。

    === "USDC"

    合约地址:
 
 
 
 ```
    gonka1fa83z7np903k9vh63guy82qthtv373d7vjeq0y7xeqh50rzn8vtssffkre
 
 
 
 ```

    <a href="/images/bridge_widget_14.png" target="_blank"><img src="/images/bridge_widget_14.png" style="width:auto; height:337.5px;"></a>

=== "USDT"

    合约地址:
 
 
 
 ```
    gonka15ggwj9un6qrmu4nj5ev6l7kpdcr00td03ff2mmj4cyhl8u8vjd2qnl3hgk
 
 
 
 ```

    <a href="/images/bridge_widget_18.png" target="_blank"><img src="/images/bridge_widget_18.png" style="width:auto; height:337.5px;"></a>

**步骤 5.** 完成 — 该代币现在会以 **Gonka CW20** 代币的形式显示在你的 Keplr 钱包中。

=== "USDC"

    <a href="/images/bridge_widget_15.png" target="_blank"><img src="/images/bridge_widget_15.png" style="width:auto; height:337.5px;"></a>

=== "USDT"

    <a href="/images/bridge_widget_19.png" target="_blank"><img src="/images/bridge_widget_19.png" style="width:auto; height:337.5px;"></a>

---

## 典型取款流程（Gonka → Ethereum）

1. 连接你的钱包，在桥接小部件中选择 **WITHDRAW（取款）** 切换按钮。
2. 选择封装代币及其数量，并输入目标 **Ethereum（以太坊）** 地址。
3. 确认取款。仪表板将收集当前纪元的 BLS 签名，并向以太坊上的桥接合约提交释放交易。

!!! tip
    如果你不熟悉命令行（CLI）或不希望直接处理原始私钥，建议使用仪表板操作。如果你更倾向于手动操作，命令行的分步流程请参阅 [存入 USDT](deposit-usdt.md)、[取出 USDT](withdraw-usdt.md)、[存入 GNK](deposit-gnk.md) 和 [取出 GNK](withdraw-gnk.md)。
