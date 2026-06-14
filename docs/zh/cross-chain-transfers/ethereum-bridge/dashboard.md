!!! warning 
    始终先进行小额测试交易。桥接转账不可逆，因此在转移大额资金前，请先发送少量金额并确认其按预期到达。

    由Gonka共识控制的专用Bridge智能合约已在以太坊上激活，地址为：

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# 通过仪表板（UI 指南）进行桥接

仪表板是桥接的最简单方式。它会自动为您处理密钥派生（参见[地址和密钥](addresses-and-keys.md)），因此您无需手动导入私钥或计算地址。

!!! tip 
    如果您不熟悉命令行界面（CLI）或处理原始私钥，建议使用仪表板。逐步的 CLI 流程记录在[存入 USDT](deposit-usdt.md)、[提取 USDT](withdraw-usdt.md)、[存入 GNK](deposit-gnk.md) 和[提取 GNK](withdraw-gnk.md) 中，供您手动操作时参考。

## 仪表板为您完成的操作

* **推导正确的地址。** 连接您用于桥接的以太坊钱包后，仪表板将显示匹配的 `gonka1…` 地址，即桥接将代币发送到的目标地址——因此您始终知道封装代币将到达何处。
* **警告种子短语账户。** 如果您使用的钱包其以太坊和 Gonka 密钥来自同一个 **助记词**，仪表板会检测到此情况并发出警告，因为基于种子派生的账户在每条链上使用不同的密钥——因此您的 Gonka 钱包默认不会显示已桥接的代币。您仍然可以控制接收地址（可以从同一助记词推导出匹配的密钥），但这需要额外的手动步骤。完整说明请参阅[地址和密钥](addresses-and-keys.md)。
* **显示您的桥接余额**，在“桥接资产”部分中，以便您确认存款是否已到达。
* **报告链状态**，让您在发起转账前了解链是否处于降级状态。
* **提示桥接纪元更新**，当以太坊桥接落后于 Gonka 链时。如果看到 **桥接需要纪元更新**，请点击 **更新桥接** 以提交缺失的纪元密钥。这是一笔正常的以太坊交易，因此连接的钱包需支付 gas。详见[桥接纪元更新](bridge-epoch-update.md)。

## 支持的流程

仪表板支持全套转账操作，无需使用 CLI：

* **ETH 桥接** — 将任意 ERC-20 代币（USDT、USDC、WETH 等）从以太坊存入 Gonka，或从 Gonka 提取回以太坊。
* **GNK 桥接** — 将原生 GNK 桥接到以太坊作为 WGNK，以及反向操作。
* **IBC 桥接** — 在 Gonka 与连接的 Cosmos 链（如 Kava）之间转移 IBC 原生代币（例如 USDT）。

### 处理时间与费用

| 桥接类型 | 方向 | 处理时间 | 支付 gas 的代币 |
| --- | --- | --- | --- |
| ETH 桥接 (ERC-20) | 以太坊 → Gonka |  |  |
| ETH 桥接 (ERC-20) |  |  |  |
| GNK 桥接 |  |  |  |
| GNK 桥接 | ~15–20 分钟（等待以太坊最终确认） |  |  |
| IBC |  |  |  |
| IBC |  |  |  |

---

## 将代币存入 Gonka

本节将引导您使用桥接小部件将代币存入 Gonka。从 **代币** 下拉菜单中选择代币——小部件会自动检测桥接类型：

* **ERC-20 代币** (USDC, USDT, WETH, …) 和 **GNK** (作为 WGNK) 通过 **以太坊桥接**。
* **IBC 代币** (USDT <span class="md-tag">IBC</span>, …) 通过 **IBC** 到连接的 Cosmos 链。

### ETH / GNK 桥接存款的工作原理

1. **在以太坊上锁定代币** — 您的代币将被发送到桥接合约并被锁定。
2. **验证者签名** — Gonka 验证者观察最终确定的以太坊存款并收集 BLS 签名。
3. **在 Gonka 上铸造** — 包裹的代币在 Gonka 上被铸造并发送到您派生的 `gonka1…` 地址。

### IBC 存款的工作原理

1. **在钱包中批准转账** — 您签署从源链（例如 Kava）发起的 IBC 转账。
2. **IBC 数据包中继** — 数据包被中继到 Gonka。
3. **代币到达 Gonka** — IBC 代币出现在您的 Gonka 钱包中。

### 1. 打开仪表板

在浏览器中打开一个创世节点：

- [https://node1.gonka.ai:8443](https://node1.gonka.ai:8443)
- [https://node2.gonka.ai:8443](https://node2.gonka.ai:8443)

导航到左侧边栏中的 **开发者** 部分。您将在页面底部看到带有 **提现** / **存款** 切换按钮的桥接小部件。

<a href="/images/bridge_widget_2.png" target="_blank"><img src="/images/bridge_widget_2.png" style="width:500px; height:auto;"></a>

### 2. 连接您的 Keplr 钱包

确保已选择 **存款** 切换按钮。点击 **连接钱包**。

将出现一个包含可用钱包选项的对话框。选择 **KEPLR**。

<a href="/images/bridge_widget_3.png" target="_blank"><img src="/images/bridge_widget_3.png" style="width:500px; height:auto;"></a>

!!! note "Keplr 显示 '未安装'？"
    如果您看到 '未安装' 消息，则需要先安装 Keplr 浏览器扩展程序。请按照 [创建 Gonka 账户 → Keplr 浏览器扩展](../../wallet/create-account.md) 中的说明进行设置，然后返回此处。

    如有提示，请输入您的 Keplr 密码。连接成功后，小部件将显示 **Keplr 已连接**，并显示您缩短的 Gonka 地址和 GNK 余额。点击 **继续** 以继续。

    <a href="/images/bridge_widget_4.png" target="_blank"><img src="/images/bridge_widget_4.png" style="width:500px; height:auto;"></a>

!!! warning "助记词（助记短语）账户"
    如果您的 Gonka 账户是通过 **助记词**（助记短语）而非原始私钥创建的，桥接小部件会检测到地址不匹配并发出警告。这是因为以太坊和 Gonka 从相同的助记短语派生出 **不同的密钥**，因此代币将被发送到与您钱包当前显示不同的 `gonka1…` 地址。资金不会丢失——您可以从相同的助记词派生出匹配的密钥——但这需要手动派生步骤。如果您看到此警告，请停止操作并阅读 [地址与密钥](addresses-and-keys.md) 后再继续。

### 3. 选择代币和金额

在步骤 2 中，从 **代币** 下拉菜单中选择您要存入的代币，并输入 **金额**。小部件将显示您当前的余额，**Gonka 上的接收地址** 会从您连接的钱包中自动填充。

小部件将显示预计的 **处理时间** 和 **预估费用**（费用货币取决于桥接类型——见上表）。

=== "ERC-20 (USDC)"

    <a href="/images/bridge_widget_5.png" target="_blank"><img src="/images/bridge_widget_5.png" style="width:500px; height:auto;"></a>

=== "GNK"

    <a href="/images/bridge_widget_20.png" target="_blank"><img src="/images/bridge_widget_20.png" style="width:500px; height:auto;"></a>

=== "IBC (USDT)"

    <a href="/images/bridge_ibc_deposit_1.png" target="_blank"><img src="/images/bridge_ibc_deposit_1.png" style="width:500px; height:auto;"></a>

点击**查看并桥接（REVIEW & BRIDGE）**。

### 4. 确认交易

您的钱包将打开**确认交易（Confirm Transaction）**界面。请在批准前仔细核对详情：

=== "ERC-20 (USDC)"

    - **代币和数量** — 确认正确的代币和数量。
    - **发送方（From）** — 您的以太坊地址（发送者）。
    - **接收方（To）** — 桥接合约地址（`0x972a7A92…648f2F68`）。这是正常的 — 您正在将代币发送至桥接合约，随后将在Gonka上铸造对应的封装代币。
    - **交易费（Tx Fee）** — 您需要支付的以太坊Gas费。

    <a href="/images/bridge_widget_6.png" target="_blank"><img src="/images/bridge_widget_6.png" style="width:500px; height:auto;"></a>

=== "GNK"

    - **代币和数量** — 确认正确的代币和数量。
    - **接收方（To）** — 桥接合约地址。
    - **交易费（Tx Fee）** — 以太坊Gas费。

    <a href="/images/bridge_widget_21.png" target="_blank"><img src="/images/bridge_widget_21.png" style="width:500px; height:auto;"></a>

=== "IBC (USDT)"

    - **消息类型（Message type）** — `IBC Transfer`。
    - **金额和目的地** — 例如 "向gonka1…发送0.1 USDt，通过channel-161"。
    - **交易费（Tx Fee）** — 以KAVA支付（例如0.05 KAVA）。

    <a href="/images/bridge_ibc_deposit_2.png" target="_blank"><img src="/images/bridge_ibc_deposit_2.png" style="width:500px; height:auto;"></a>

点击**批准（Approve）**以提交交易。

!!! warning 
    确认前请再次核对所有细节。桥接转账是**不可逆的**。如有任何异常，请点击**✕**取消并重新开始。

### 5. 存款完成

小部件将显示**存款完成（Deposit complete）**界面，并附上操作摘要。

=== "ERC-20 (USDC)"

    <a href="/images/bridge_widget_7.png" target="_blank"><img src="/images/bridge_widget_7.png" style="width:500px; height:auto;"></a>

=== "GNK"

    <a href="/images/bridge_widget_22.png" target="_blank"><img src="/images/bridge_widget_22.png" style="width:500px; height:auto;"></a>

=== "IBC (USDT)"

    进度追踪显示：

    - **在钱包中批准转账** — 已完成
    - **IBC数据包中继转账** — 已完成

    <a href="/images/bridge_ibc_deposit_3.png" target="_blank"><img src="/images/bridge_ibc_deposit_3.png" style="width:500px; height:auto;"></a>

从此界面您可以：

- 点击**在浏览器中查看（VIEW ON EXPLORER）**以查看交易详情。
- 点击**转账更多代币（TRANSFER MORE TOKENS）**进行下一笔存款。
- 点击**断开连接（DISCONNECT）**以断开钱包。

### 6. 验证您的存款

您可以通过以下几种方式确认您的封装代币已到账：

- **在仪表板中**：打开 `https://node2.gonka.ai:8443/dashboard/gonka/account/<your_gonka_address>` 并查看您的余额。
- **通过交易链接**：在“存款完成”页面上显示的交易链接。
- **在 Keplr 中**：封装的代币（CW-20）不会自动显示在 Keplr 中——请按照以下步骤手动添加。

---

### 将封装代币添加到 Keplr

封装的 ERC-20 代币（例如 wUSDC 和 wUSDT）是 Gonka 链上的 CW-20 代币。Keplr 不会自动检测 CW-20 代币，因此您需要将其作为自定义代币添加。

!!! note 
    IBC 代币（通过 IBC 转移，而非以太坊桥）会自动出现在 Keplr 中。以下手动步骤仅适用于桥接封装的 CW-20 代币。

    **步骤 1.** 打开您的 Keplr 钱包，点击右上角的菜单图标（三条横线），然后选择 **管理资产列表**。

    <a href="/images/bridge_widget_12.png" target="_blank"><img src="/images/bridge_widget_12.png" style="width:auto; height:337.5px;"></a>

    **步骤 2.** 点击右上角的 **+** 按钮以添加自定义代币。

    <a href="/images/bridge_widget_13.png" target="_blank"><img src="/images/bridge_widget_13.png" style="width:auto; height:337.5px;"></a>

    **步骤 3.** 在 **添加自定义代币** 页面中，从链下拉菜单中选择 **Gonka**。将 CW-20 合约地址粘贴到 **合约地址** 字段中。代币元数据（名称、符号、小数位数）将自动填充。点击 **确认**。

    已知合约地址：

| 代币 | Gonka 上的 CW-20 合约地址 |
| --- | --- |
| USDC | `gonka1fa83z7np903k9vh63guy82qthtv373d7vjeq0y7xeqh50rzn8vtssffkre` |
| USDT | `gonka15ggwj9un6qrmu4nj5ev6l7kpdcr00td03ff2mmj4cyhl8u8vjd2qnl3hgk` |

<a href="/images/bridge_widget_14.png" target="_blank"><img src="/images/bridge_widget_14.png" style="width:auto; height:337.5px;"></a>

**步骤 4.** 完成——该代币现在会作为 **Gonka CW20** 代币显示在您的 Keplr 钱包中。

<a href="/images/bridge_widget_15.png" target="_blank"><img src="/images/bridge_widget_15.png" style="width:auto; height:337.5px;"></a>

---

## 从 Gonka 提取代币

本部分将指导您使用桥接小部件从 Gonka 提取代币。从 **代币** 下拉菜单中选择代币——小部件会自动检测桥接类型：

* **ERC-20 代币** 和 **GNK** 通过 **以太坊桥接**。
* **IBC 代币**（USDT <span class="md-tag">IBC</span>，…）通过 **IBC** 转移到连接的 Cosmos 链。

### ETH / GNK 桥接提款的工作原理

1. **在 Gonka 上销毁代币**——封装代币在 Gonka 链上被销毁（或原生 GNK 被锁定）。
2. **验证者签名**——Gonka 验证者生成 BLS 聚合签名以授权释放。
3. **在以太坊上释放**——原始代币从以太坊上的桥接合约中释放（或铸造 WGNK）。

### IBC 提款的工作原理

1. **在钱包中批准转账**——您在 Gonka 上签署 IBC 转账。
2. **IBC 数据包中继**——数据包被中继到目标链。
3. **代币到账**——IBC 代币出现在您目标链上的钱包中（例如 Kava）。

### 1. 打开仪表板

在浏览器中打开以下任一创世节点：

- [https://node1.gonka.ai:8443](https://node1.gonka.ai:8443)
- [https://node2.gonka.ai:8443](https://node2.gonka.ai:8443)

在左侧边栏中导航到 **开发者** 部分。在桥接小部件中选择 **提款** 切换按钮。

<a href="/images/bridge_withdraw_1.png" target="_blank"><img src="/images/bridge_withdraw_1.png" style="width:500px; height:auto;"></a>

### 2. 连接您的 Keplr 钱包

确保已选择 **提款** 切换按钮。点击 **连接钱包**。

一个对话框将显示可用的钱包选项。选择 **KEPLR**。

<a href="/images/bridge_withdraw_2.png" target="_blank"><img src="/images/bridge_withdraw_2.png" style="width:500px; height:auto;"></a>

!!! note "Keplr 显示 \"未安装\"？"
    如果看到 \"未安装\" 消息，您需要先安装 Keplr 浏览器扩展程序。请按照 [创建 Gonka 账户 → Keplr 浏览器扩展](../../wallet/create-account.md) 中的说明进行设置，然后返回此处。

    如果提示，请输入您的 Keplr 密码。连接成功后，组件将显示 **Keplr 已连接**，并显示您的简短 Gonka 地址和 GNK 余额。点击 **继续** 以继续操作。

    <a href="/images/bridge_withdraw_3.png" target="_blank"><img src="/images/bridge_withdraw_3.png" style="width:500px; height:auto;"></a>

!!! warning "助记词（mnemonic）账户"
    如果您的 Gonka 账户是通过 **助记词**（mnemonic）而非原始私钥创建的，桥接组件会检测到地址不匹配并发出警告。这是因为以太坊和 Gonka 从同一助记词派生出 **不同的密钥**，因此代币将被释放到与您当前钱包显示的不同以太坊地址。资金并未丢失——您可以从相同的助记词派生出匹配的密钥——但这需要手动派生步骤。如果看到此警告，请停止操作并先阅读 [地址与密钥](addresses-and-keys.md) 再继续。

### 3. 选择代币和金额

在步骤 2 中，从 **代币** 下拉菜单中选择要提取的代币，并输入 **金额**。组件会显示该代币在 Gonka 上的当前余额。**目标地址** 将从您连接的钱包中自动填充。

!!! tip 
    与存款不同，您可以编辑目标字段以提取到其他地址。请确保该地址由您控制且输入正确。

    === "GNK"

    <a href="/images/bridge_withdraw_4.png" target="_blank"><img src="/images/bridge_withdraw_4.png" style="width:500px; height:auto;"></a>

    === "ERC-20 (USDC)"

    <a href="/images/bridge_withdraw_8.png" target="_blank"><img src="/images/bridge_withdraw_8.png" style="width:500px; height:auto;"></a>

    === "IBC (USDT)"

    目标地址是 Kava 链上的 `kava1…` 地址。处理时间约为 1–3 分钟。

    <a href="/images/bridge_ibc_withdraw_1.png" target="_blank"><img src="/images/bridge_ibc_withdraw_1.png" style="width:500px; height:auto;"></a>

    点击 **查看并桥接**。

### 4. 在 Gonka 上确认交易

Keplr 将打开一个针对 Gonka 链的 **确认交易** 弹窗。请查看详细信息后点击 **批准**。

=== "GNK"

    - **消息类型** — `MsgRequestBridgeMint`，该操作将您的 GNK 锁定在 Gonka 上，并请求在以太坊上铸造 WGNK。
    - **交易费** — 0 GNK。

    <a href="/images/bridge_withdraw_5.png" target="_blank"><img src="/images/bridge_withdraw_5.png" style="width:500px; height:auto;"></a>

=== "ERC-20 (USDC)"

    - **消息类型** — 对封装代币的 CW-20 合约的 `Execute Wasm Contract` 调用，附带 `withdraw` 负载。
    - **交易费** — 0 GNK。

    <a href="/images/bridge_withdraw_9.png" target="_blank"><img src="/images/bridge_withdraw_9.png" style="width:500px; height:auto;"></a>

=== "IBC (USDT)"

    - **消息类型** — `IBC Transfer`。
    - **金额和目标** — 例如 \"通过 channel-5 向 kava1… 发送 0.1 USDt (Kava/channel-5)\"。
    - **交易费** — 0 GNK。

    <a href="/images/bridge_ibc_withdraw_2.png" target="_blank"><img src="/images/bridge_ibc_withdraw_2.png" style="width:500px; height:auto;"></a>

!!! warning 
    确认前请仔细核对所有信息。桥接转账是 **不可逆的**。如果发现任何异常，请点击 **✕** 取消并重新开始。

    对于 **ETH / GNK 桥接**：批准后，进度追踪器将标记 **在 Gonka 上销毁代币** 为完成。随后 Gonka 验证节点会自动收集并聚合其 BLS 签名（**验证节点签名** 步骤）——此阶段您无需任何操作。

### 5. 在以太坊上确认释放交易（仅限 ETH / GNK 桥接）

!!! note 
    此步骤仅适用于 **ETH 桥接** 和 **GNK 桥接** 提现。对于 **IBC** 提现，转账在步骤 4 后自动完成——请跳至步骤 6。

    一旦验证节点生成了 BLS 聚合签名（**验证节点签名** — 已完成），Keplr 将打开第二个弹窗——这次是针对 **以太坊链**。该交易将执行桥接合约（`0x972a7a92…648f2f68`）以在以太坊上释放代币。

- **To** — Ethereum 上的桥接合约地址。
- **交易费用** — Ethereum 的 Gas 费用（以 ETH 支付）。具体金额取决于当前的 Gas 价格。

=== "GNK"

    <a href="/images/bridge_withdraw_6.png" target="_blank"><img src="/images/bridge_withdraw_6.png" style="width:500px; height:auto;"></a>

=== "ERC-20 (USDC)"

    <a href="/images/bridge_withdraw_10.png" target="_blank"><img src="/images/bridge_withdraw_10.png" style="width:500px; height:auto;"></a>

点击 **Approve** 提交释放交易。

### 6. 提现完成

小工具会显示 **Withdrawal complete** 界面，所有阶段均标记为已完成。

=== "GNK"

    <a href="/images/bridge_withdraw_7.png" target="_blank"><img src="/images/bridge_withdraw_7.png" style="width:500px; height:auto;"></a>

=== "ERC-20 (USDC)"

    <a href="/images/bridge_withdraw_11.png" target="_blank"><img src="/images/bridge_withdraw_11.png" style="width:500px; height:auto;"></a>

=== "IBC (USDT)"

    进度跟踪器显示：

    - **Approve transfer in wallet** — 已完成
    - **IBC packet relay transfer** — 已完成

    <a href="/images/bridge_ibc_withdraw_3.png" target="_blank"><img src="/images/bridge_ibc_withdraw_3.png" style="width:500px; height:auto;"></a>

从该界面您可以：

- 点击 **VIEW ON EXPLORER** 查看交易详情。
- 点击 **TRANSFER MORE TOKENS** 进行下一笔提现。
- 点击 **DISCONNECT** 断开钱包连接。

### 7. 验证您的提现

您可以通过以下几种方式确认代币已到账：

- **ETH 桥接 / GNK**：检查您的 Ethereum 钱包中已释放的 ERC-20 代币或 WGNK。WGNK 会自动显示在 Keplr 中。
- **IBC**：检查目标链上的代币余额（例如 Keplr 中 Kava 上的 USDT）。
- **浏览器链接**：使用提现完成界面的 **VIEW ON EXPLORER** 链接。

<a href="/images/bridge_withdraw_12.png" target="_blank"><img src="/images/bridge_withdraw_12.png" style="width:auto; height:337.5px;"></a>
