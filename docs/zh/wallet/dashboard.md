# 开始使用仪表板
仪表板显示链上实时活动。

与依赖单一中心化服务器不同，所有网络数据和推理指标都直接托管在主机节点上。这意味着仪表板可以连接到任何主机的节点，并直接从源头获取实时网络数据。

您可以通过两种方式与仪表板交互：

- **预览模式** —— 在不创建账户的情况下浏览仪表板并查看网络数据。
- **完整模式** —— 通过连接您的钱包解锁完整功能集。

=== "**预览模式**"

如果您想在创建自己的账户之前探索网络或查看实时推理指标，请按照以下步骤操作：

    1. 以下是创世节点列表。从下面的列表中选择一个随机节点，并在新的浏览器窗口/标签页中打开它。

        - [http://36.189.234.237:17241](http://36.189.234.237:17241)
        - [https://node1.gonka.ai:8443](https://node1.gonka.ai:8443)
        - [https://node2.gonka.ai:8443](https://node2.gonka.ai:8443)
        - [https://node3.gonka.ai](https://node3.gonka.ai)
        - [http://47.236.19.22:18000](http://47.236.19.22:18000)
        - [http://gonka.spv.re:8000](http://gonka.spv.re:8000)

??? note "替代方法：以完全去中心化的方式选择随机节点"
            打开主机列表：[http://node2.gonka.ai:8443/v1/epochs/current/participants](http://node2.gonka.ai:8443/v1/epochs/current/participants)。  
            从列表中选择任意一个活跃的主机。
            复制其 `inference_url` 值。
            将 `inference_url` 粘贴到浏览器中以加载仪表板。

            !!! note "某些主机禁用了公共仪表板"
                主机无需保持公共仪表板或链 RPC 开放。`inference_url` 在 `active_participants` 中仅表示该主机正在提供推理服务，而非其仪表板是公开的。许多主机仍提供仪表板页面，但可能显示为**断开连接**且无任何指标。这是正常现象——请更换另一个 `inference_url`，直到出现实时数据。这并不意味着主机离线。

    2. 打开后，您将直接从主机节点流式传输实时数据。

    !!! note "为什么这很重要？"
        这种架构确保了去中心化：没有单一中心服务器控制网络。在预览模式下，功能有限。您可以查看余额、交易和部分分析数据。如果您想发送代币、管理个人账户等，请解锁 [完整模式](https://gonka.ai/wallet/dashboard/#__tabbed_1_2)。

        === "**完整模式**"

        首先，使用预览模式打开仪表板。成功访问后，请继续以下步骤以启用所有功能。

    ### 访问 Gonka 账户

要解锁仪表板的全部功能，您需要一个 Gonka 账户。

    - 已有账户？请直接跳转至下方的 ["设置外部钱包"](https://gonka.ai/wallet/dashboard/#2-set-up-external-wallet) 部分。
    - 新用户？请先 [创建 Gonka 账户](https://gonka.ai/wallet/create-account/)，然后返回此处。

    ### 设置外部钱包
为了通过您的钱包与仪表板交互，建议使用 [Keplr](https://www.keplr.app/){target=_blank}（专为基于 Cosmos 的链构建的浏览器扩展钱包）。

??? note "什么是钱包？"
        加密钱包是用户公钥和私钥的安全容器，使用户能够管理、转移和购买加密货币。Gonka 基于 Cosmos-SDK 区块链框架构建，可通过 Keplr 钱包访问。

    - 如果您已安装 Keplr 钱包浏览器扩展，请前往 ["连接钱包"](https://gonka.ai/wallet/dashboard/#3-connect-wallet) 部分。
    - 如果您尚未设置，请按照以下步骤操作。

为您的浏览器安装扩展程序。

访问 [Keplr 官方网站](https://www.keplr.app/){target=_blank}，点击 "获取 Keplr 钱包"。

<a href="/images/dashboard_keplr_step_2_1.png" target="_blank"><img src="/images/dashboard_keplr_step_2_1.png" style="width:500px; height:auto;"></a>

选择适合您浏览器的扩展程序。

<a href="/images/dashboard_keplr_step_2_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_2.png" style="width:500px; height:auto;"></a>

将所选扩展程序添加到您的浏览器。

=== "Firefox"

<a href="/images/dashboard_keplr_step_2_3.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3.png" style="width:500px; height:auto;"></a>

=== "Google Chrome"

<a href="/images/dashboard_keplr_step_2_3_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3_2.png" style="width:500px; height:auto;"></a>

安装扩展程序后，您应该能在浏览器的右上角看到它。

<a href="/images/keplr_extension.png" target="_blank"><img src="/images/keplr_extension.png" style="width:500px; height:auto;"></a>

此时，扩展程序已安装，但尚未连接到您的钱包。
    接下来，打开扩展程序并登录您的钱包。登录后，请按照以下步骤继续设置过程。

点击“导入现有钱包”。

<a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:500px; height:auto;"></a>

点击“使用恢复短语或私钥"

<a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:500px; height:auto;"></a>

粘贴您的私钥。

??? note "Important note on wallet-bridge compatibility"
        The bridge currently expects a specific account setup. Some wallets may let you create a Gonka account and even export a private key, but that does not always mean the account will work correctly with the bridge. For bridge use, please create your Gonka account in one of the following ways:

        - 使用 `inferenced` CLI 工具
        - 在 Keplr 中使用“通过 Google 连接”流程

这些是需要以太坊桥接兼容性的用户的推荐和受支持选项。详情请参阅 [创建 Gonka 账户](https://gonka.ai/wallet/create-account/)。

<a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:500px; height:auto;"></a>

设置您的钱包。请将密码安全地存储在安全的地方。

<a href="/images/keplr_set_up_your_wallet.png" target="_blank"><img src="/images/keplr_set_up_your_wallet.png" style="width:500px; height:auto;"></a>

在搜索栏中输入“Gonka”并选择 Gonka 链以将其添加到您的钱包中。

<a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:500px; height:auto;"></a>

完成 — 您的 Gonka 账户已成功导入 Keplr！

<a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:500px; height:auto;"></a>

    ### 连接钱包

3.1. 按照[预览模式](https://gonka.ai/wallet/dashboard/#__tabbed_1_1)的说明打开 Gonka 控制面板。

3.2. 在右上角点击“连接钱包”开始操作。

<a href="/images/dashboard_ping_pub_3_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_1.png" style="width:500px; height:auto;"></a>

3.3. 选择 Keplr 并点击连接。

<a href="/images/dashboard_ping_pub_3_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_2.png" style="width:500px; height:auto;"></a>

3.4. 同意连接到 Gonka 网络的请求。

<a href="/images/keplr_approve_connection.png" target="_blank"><img src="/images/keplr_approve_connection.png" style="width:250px; height:auto;"></a>

3.5. 完成！您已成功将账户添加到钱包中。

<a href="/images/dashboard_ping_pub_3_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_4.png" style="width:500px; height:auto;"></a>

??? note "可选：如何在 Keplr 钱包中添加额外的 Gonka 账户 — 点击查看步骤"

打开扩展程序，点击扩展程序窗口右上角的账户图标。

<a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>

点击“添加钱包”按钮。

<a href="/images/dashboard_ping_pub_3_5_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_2.png" style="width:auto; height:337.5px; display:block;"></a>

点击“导入现有钱包”。

<a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:450px; height:auto; display:block;"></a>

点击“使用恢复短语或私钥"

<a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:450px; height:auto;"></a>

粘贴您的私钥。

??? note "关于钱包桥接兼容性的重要说明"
            桥接当前期望特定的账户设置。某些钱包可能允许您创建 Gonka 账户并导出私钥，但这并不总是意味着该账户能与桥接正确配合使用。如需桥接兼容，请通过以下方式之一创建您的 Gonka 账户：

            - 使用 `inferenced` CLI 工具
            - 在 Keplr 中使用“通过 Google 连接”流程

这些是需要以太坊桥接兼容性的用户的推荐和受支持选项。详情请参见 [创建 Gonka 账户](https://gonka.ai/wallet/create-account/)。

<a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:450px; height:auto;"></a>

为您的钱包命名以便于识别。

<a href="/images/dashboard_ping_pub_3_5_5.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_5.png" style="width:450px; height:auto;"></a>

确保已选择 Gonka 链。

<a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:500px; height:auto;"></a>

完成 — 您的 Gonka 账户已成功导入 Keplr！

<a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:450px; height:auto;"></a>
