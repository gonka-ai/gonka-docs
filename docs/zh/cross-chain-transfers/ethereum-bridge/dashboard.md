!!! warning
    务必先进行小额测试交易。跨链转账是不可逆的，因此在转移大额资金前，请先发送少量金额，并确认其如期到账。

    由 Gonka 共识控制的专用跨链桥智能合约已在以太坊上激活，地址为：

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# 通过仪表板（UI 指南）进行跨链桥接

仪表板是进行跨链桥接最简单的方式。它会自动为您处理密钥派生（参见[地址与密钥](addresses-and-keys.md)），因此您无需手动导入私钥或计算地址。

## 仪表板为您完成的操作

* **派生正确的地址。** 连接您用于桥接的以太坊钱包后，仪表板会显示匹配的 `gonka1…` 地址，即桥接将代币发送到的目标地址 —— 因此您始终清楚封装代币将到达何处。
* **警告种子短语账户。** 如果您使用的是以太坊和 Gonka 使用相同**助记词**（mnemonic）生成的钱包，仪表板会检测到此情况并发出警告，因为基于种子派生的账户在不同链上使用不同的密钥，可能导致资金发送到您无法控制的地址。请阅读[地址与密钥](addresses-and-keys.md)了解完整解释。
* **显示您的桥接余额**，在“桥接资产”部分中，以便您确认存款是否已到账。
* **报告链状态**，让您在发起转账前了解链是否处于降级状态。
* **提示桥接纪元更新**，当以太坊桥接落后于 Gonka 链时。如果看到 **A Bridge needs epoch update**（桥接需要纪元更新），请点击 **Update bridge**（更新桥接）以提交缺失的纪元密钥。这是一笔正常的以太坊交易，因此由连接的钱包支付 gas 费。详见[桥接纪元更新](bridge-epoch-update.md)。

## 支持的流程

仪表板支持全套无需使用命令行工具（CLI）的转账操作：

* **以太坊 → Gonka**：存入任意 ERC-20 代币（USDT、USDC、WETH 等），并在 Gonka 上收到对应的封装代币。
* **Gonka → 以太坊**：将封装代币提现回以太坊地址。
* **GNK ↔ WGNK**：将原生 GNK 桥接到以太坊作为 WGNK，或反向操作。

---

## 存入 ERC-20 代币（以太坊 → Gonka）

本节将引导您使用原生仪表板上的桥接小部件，将以太坊上的 ERC-20 代币存入 Gonka。以下示例使用 USDC 和 USDT —— 对于任何支持的 ERC-20 代币，流程完全相同。

### 1. 打开仪表板

在浏览器中打开任一创世节点：

- [https://node1.gonka.ai:8443](https://node1.gonka.ai:8443)
- [https://node2.gonka.ai:8443](https://node2.gonka.ai:8443)

在左侧边栏中导航至 **开发者**（Developers）部分。您将在页面底部看到桥接小部件，带有 **提现**（WITHDRAW）/ **存款**（DEPOSIT）切换按钮。

<a href="/images/bridge_widget_2.png" target="_blank"><img src="/images/bridge_widget_2.png" style="width:500px; height:auto;"></a>

### 2. 连接您的 Keplr 钱包

确保已选择 **存款**（DEPOSIT）切换按钮。点击 **连接钱包**（CONNECT WALLET）。

将弹出一个对话框显示可用的钱包选项。选择 **KEPLR**。

<a href="/images/bridge_widget_3.png" target="_blank"><img src="/images/bridge_widget_3.png" style="width:500px; height:auto;"></a>

!!! note "Keplr 显示“未安装”？"
    如果看到“未安装”消息，您需要先安装 Keplr 浏览器扩展。请按照[创建 Gonka 账户 → Keplr 浏览器扩展](../../wallet/create-account.md)中的说明进行设置，然后返回此处。

    如有提示，请输入您的 Keplr 密码。连接成功后，小部件将显示 **Keplr 已连接**（Keplr Connected），并附带您的简写 Gonka 地址和 GNK 余额。点击 **继续**（CONTINUE）继续操作。

    <a href="/images/bridge_widget_4.png" target="_blank"><img src="/images/bridge_widget_4.png" style="width:500px; height:auto;"></a>

!!! warning "种子短语（助记词）账户"
    如果您的 Gonka 账户是通过**种子短语**（助记词）而非原始私钥创建的，桥接小部件将检测到地址不匹配并发出警告。这是因为以太坊和 Gonka 从同一助记词派生出**不同的密钥**，导致代币将被发送到您可能无法控制的地址。如果看到此警告，请立即停止操作，并在继续前阅读[地址与密钥](addresses-and-keys.md)。

### 3. 选择代币和金额

在第二步中，从 **代币**（Token）下拉菜单中选择您要存入的代币，并输入 **金额**（Amount）。小部件将显示您在以太坊上的该代币当前余额。**Gonka 上的接收地址**将从您连接的钱包中自动填充。

小部件还会显示预估的**处理时间**和以 ETH 计价的**近似费用**。

=== "USDC"

    <a href="/images/bridge_widget_5.png" target="_blank"><img src="/images/bridge_widget_5.png" style="width:500px; height:auto;"></a>

=== "USDT"

    <a href="/images/bridge_widget_8.png" target="_blank"><img src="/images/bridge_widget_8.png" style="width:500px; height:auto;"></a>

点击 **查看并桥接**（REVIEW & BRIDGE）。

### 4. 确认交易

您的钱包将打开 **确认交易**（Confirm Transaction）界面。在批准前请仔细核对以下信息：

- **代币和金额** —— 确认代币和金额是否正确。
- **发送方**（From） —— 您的以太坊地址（发送者）。
- **接收方**（To） —— 桥接合约地址（`0x972a7A92…648f2F68`）。这是预期行为 —— 您正在将代币发送给桥接合约，该合约随后将在 Gonka 上铸造封装代币。
- **交易费**（Tx Fee） —— 您为此交易支付的以太坊 gas 费。

=== "USDC"

    <a href="/images/bridge_widget_6.png" target="_blank"><img src="/images/bridge_widget_6.png" style="width:500px; height:auto;"></a>

=== "USDT"

    <a href="/images/bridge_widget_9.png" target="_blank"><img src="/images/bridge_widget_9.png" style="width:500px; height:auto;"></a>

点击 **批准**（Approve）以提交交易。

!!! warning
    确认前请再次核对所有信息。桥接转账是**不可逆的**。如果发现任何异常，请点击 **✕** 取消并重新开始。

### 5. 存款完成

当交易在以太坊上确认后，桥接将锁定您的代币，收集验证节点签名，并在 Gonka 上铸造封装代币。小部件将显示 **存款完成**（Deposit complete）界面，并附带操作摘要。

=== "USDC"

    <a href="/images/bridge_widget_7.png" target="_blank"><img src="/images/bridge_widget_7.png" style="width:500px; height:auto;"></a>

=== "USDT"

    <a href="/images/bridge_widget_10.png" target="_blank"><img src="/images/bridge_widget_10.png" style="width:500px; height:auto;"></a>

在此界面您可以：

- 点击 **在浏览器中查看**（VIEW ON EXPLORER）以在以太坊浏览器中查看交易详情。
- 点击 **转账更多代币**（TRANSFER MORE TOKENS）进行下一笔存款。
- 点击 **断开连接**（DISCONNECT）断开您的钱包。

### 6. 验证您的存款

您可以通过以下几种方式确认封装代币已到账：

- **在仪表板中**：打开 `https://node2.gonka.ai:8443/dashboard/gonka/account/<your_gonka_address>` 并检查您的余额。
- **通过存款完成界面显示的交易链接**。
- **在 Keplr 中**：封装代币（CW-20）不会自动出现在 Keplr 中 —— 请按照以下步骤手动添加。

---

## 将封装代币添加至 Keplr

封装的 ERC-20 代币（如 wUSDC 和 wUSDT）是以 Gonka 链上的 CW-20 代币形式存在。Keplr 不会自动检测 CW-20 代币，因此您需要将其作为自定义代币手动添加。添加后，它们将与您的其他代币一起显示在 Keplr 资产列表中。

!!! note
    IBC 代币（通过 IBC 而非以太坊桥接转移的代币）会自动出现在 Keplr 中。以下手动步骤仅适用于桥接封装的 CW-20 代币。

    **步骤 1.** 打开您的 Keplr 钱包，点击右上角的菜单图标（三条横线），然后选择 **管理资产列表**（Manage Asset List）。

    <a href="/images/bridge_widget_12.png" target="_blank"><img src="/images/bridge_widget_12.png" style="width:auto; height:337.5px;"></a>

    **步骤 2.** 点击右上角的 **+** 按钮以添加自定义代币。

    <a href="/images/bridge_widget_13.png" target="_blank"><img src="/images/bridge_widget_13.png" style="width:auto; height:337.5px;"></a>

    **步骤 4.** 在 **添加自定义代币**（Add Custom Token）页面，从链下拉菜单中选择 **Gonka**。将 CW-20 合约地址粘贴到 **合约地址**（Contract Address）字段中。代币元数据（名称、符号、小数位数）将自动填充。点击 **确认**（Confirm）。

    === "USDC"

    合约地址：
 
 
 
 
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

**步骤 5.** 完成 — 该代币现在将以 **Gonka CW20** 代币的形式显示在您的 Keplr 钱包中。

=== "USDC"

    <a href="/images/bridge_widget_15.png" target="_blank"><img src="/images/bridge_widget_15.png" style="width:auto; height:337.5px;"></a>

=== "USDT"

    <a href="/images/bridge_widget_19.png" target="_blank"><img src="/images/bridge_widget_19.png" style="width:auto; height:337.5px;"></a>

---

## 典型提现流程（Gonka → Ethereum）

1. 连接您的钱包，在桥接组件中选择 **WITHDRAW（提现）** 选项。
2. 选择封装代币及其数量，并输入目标 **Ethereum** 地址。
3. 确认提现操作。仪表板将收集当前纪元的 BLS 签名，并向 Ethereum 上的桥接合约提交释放交易。

!!! tip
    如果您不熟悉命令行（CLI）或不希望直接处理原始私钥，建议使用仪表板操作。如需手动操作，可通过命令行完成，具体步骤详见 [存入 USDT](deposit-usdt.md)、[提现 USDT](withdraw-usdt.md)、[存入 GNK](deposit-gnk.md) 和 [提现 GNK](withdraw-gnk.md)。
