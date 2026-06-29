# 创建一个新的Gonka账户

要开始使用Gonka网络，您首先需要创建一个Gonka账户。
有多种方式可以完成此操作：

- 通过外部钱包（Keplr、Cosmostation、Fox Wallet）
- 通过 `inferenced` CLI 工具

!!! note "桥接兼容性和助记词（种子短语）"
    如果您使用**助记词（种子短语）**创建Gonka账户——如Cosmostation和Fox Wallet默认方式——该账户**兼容**以太坊桥，但桥会将代币发送到与您的钱包显示不同的 `gonka1…` 地址。这是因为以太坊和Gonka使用不同的BIP-44派生路径（币种 `60` 与 `118`），因此相同的种子短语在每条链上生成不同的私钥。您仍可控制这些资金，并通过额外的派生步骤访问它们。完整说明请参见[地址和密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)。

    为获得最简单的桥接体验——您的钱包自动显示桥使用的地址，无需额外派生步骤——请通过以下方式之一创建您的Gonka账户：

    - 使用 `inferenced` CLI 工具
    - 在Keplr中使用“通过Google连接”流程

以下是针对**Keplr**和**Cosmostation**的分步说明。同样的流程——安装钱包或扩展程序、登录、启用Gonka链并复制您的地址——也适用于[Fox Wallet](https://foxwallet.com/){target=_blank}。

=== "外部钱包"

    === "我没有外部钱包"

        === "Keplr移动应用"

            前往[Keplr官方网站](https://www.keplr.app/){target=_blank}并点击“获取Keplr钱包”。

            <a href="/images/keplr_mobile_website_main.PNG" target="_blank"><img src="/images/keplr_mobile_website_main.PNG" style="width:auto; height:337.5px;"></a>

            向下滚动到移动应用部分，选择您的操作系统。下载应用。

            <a href="/images/keplr_mobile_website_mobileos.PNG" target="_blank"><img src="/images/keplr_mobile_website_mobileos.PNG" style="width:auto; height:337.5px;"></a>

            打开应用。点击“创建新钱包”。

            <a href="/images/keplr_mobile_create_new_wallet.PNG" target="_blank"><img src="/images/keplr_mobile_create_new_wallet.PNG" style="width:auto; height:337.5px;"></a>

            点击“通过Google连接”。按照说明通过Gmail登录。

            !!! note "桥接兼容性"
                通过Keplr“通过Google连接”流程创建的账户基于密钥而非助记词，因此与以太坊桥完全兼容——桥会将代币发送到您的钱包显示的相同 `gonka1…` 地址，无需额外派生步骤。详细信息请参见[地址和密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)。


            <a href="/images/keplr_mobile_recovery_phrase.PNG" target="_blank"><img src="/images/keplr_mobile_recovery_phrase.PNG" style="width:auto; height:337.5px;"></a>

            安全备份您的私钥。任何拥有您私钥的人都能访问您的资产。如果您失去对Gmail账户的访问权限，唯一恢复钱包的方法是使用您的私钥。请将您的私钥存放在安全的地方。切勿与任何人分享您的私钥。

            <a href="/images/keplr_mobile_google_private_key_2.PNG" target="_blank"><img src="/images/keplr_mobile_google_private_key_2.PNG" style="width:auto; height:337.5px;"></a>

            在搜索栏中输入“Gonka”并选择Gonka链以添加到您的钱包。

            <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:auto; height:337.5px;"></a>

            您已在Keplr中创建了钱包。现在，请按照以下说明查找您的账户地址。

            <a href="/images/keplr_mobile_all_set.PNG" target="_blank"><img src="/images/keplr_mobile_all_set.PNG" style="width:auto; height:337.5px;"></a>

            在主屏幕上，向下滚动到Gonka链并点击它。

            <a href="/images/keplr_mobile_start_screen.PNG" target="_blank"><img src="/images/keplr_mobile_start_screen.PNG" style="width:auto; height:337.5px;"></a>

            在您的余额上方，您将看到您的Gonka账户地址。点击复制图标以复制完整的Gonka账户地址。

            <a href="/images/keplr_mobile_address.PNG" target="_blank"><img src="/images/keplr_mobile_address.PNG" style="width:auto; height:337.5px;"></a>

            您已复制了Gonka账户地址。您可以与任何将向您付款的人共享它。共享是安全的。

        === "Keplr浏览器扩展"

            前往[Keplr官方网站](https://www.keplr.app/){target=_blank}并点击“获取Keplr钱包”。

            <a href="/images/dashboard_keplr_step_2_1.png" target="_blank"><img src="/images/dashboard_keplr_step_2_1.png" style="width:500px; height:auto;"></a>

            选择适用于您浏览器的扩展程序。

            <a href="/images/dashboard_keplr_step_2_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_2.png" style="width:500px; height:auto;"></a>

            将所选扩展程序添加到您的浏览器。

            === "Firefox"

                <a href="/images/dashboard_keplr_step_2_3.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3.png" style="width:500px; height:auto;"></a>

            === "Google Chrome"

                <a href="/images/dashboard_keplr_step_2_3_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3_2.png" style="width:500px; height:auto;"></a>

            安装扩展程序后，您应在浏览器的右上角面板中看到它。

            <a href="/images/keplr_extension.png" target="_blank"><img src="/images/keplr_extension.png" style="width:500px; height:auto;"></a>

            此时，扩展程序已安装，但您的钱包和Gonka账户尚未创建。请继续下一步进行设置。

            打开Keplr浏览器扩展程序，点击“创建新钱包”。

            <a href="/images/dashboard_keplr_step_2_4.png" target="_blank"><img src="/images/dashboard_keplr_step_2_4.png" style="width:500px; height:auto;"></a>

            点击“使用Google连接”。按照说明通过Gmail登录。

            !!! note "Bridge compatibility"
                通过Keplr“使用Google连接”流程创建的账户基于密钥，而非助记词，因此与以太坊桥完全兼容——桥会将代币发送到您的钱包显示的相同`gonka1…`地址，无需额外的派生步骤。详情请参阅[地址和密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)。


            <a href="/images/keplr_welcome_to_keplr.png" target="_blank"><img src="/images/keplr_welcome_to_keplr.png" style="width:500px; height:auto;"></a>

            设置您的钱包。请将密码安全保存。

            <a href="/images/keplr_set_up_your_wallet.png" target="_blank"><img src="/images/keplr_set_up_your_wallet.png" style="width:500px; height:auto;"></a>

            安全备份您的私钥。任何拥有您私钥的人都可以访问您的资产。如果您失去对Gmail账户的访问权限，唯一恢复钱包的方法是使用您的私钥。请将私钥安全保存，切勿与任何人分享。

            <a href="/images/keplr_back_up_private_key.png" target="_blank"><img src="/images/keplr_back_up_private_key.png" style="width:500px; height:auto;"></a>

            在搜索栏中输入“Gonka”，然后选择Gonka链以添加到您的钱包。

            <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:500px; height:auto;"></a>

            您已在Keplr中创建了钱包。现在，请按照以下说明查找您的账户地址。

            <a href="/images/dashboard_keplr_step_2_8.png" target="_blank"><img src="/images/dashboard_keplr_step_2_8.png" style="width:500px; height:auto;"></a>

            打开Keplr，导航并点击钱包中的“复制地址”。

            <a href="/images/keplr_copy_address_2.png" target="_blank"><img src="/images/keplr_copy_address_2.png" style="width:auto; height:337.5px;"></a>

            点击Gonka链旁边的复制按钮。

            <a href="/images/keplr_web_copy_gonka_address_2.png" target="_blank"><img src="/images/keplr_web_copy_gonka_address_2.png" style="width:auto; height:337.5px;"></a>

            您已复制了Gonka账户地址。您可以与任何将向您付款的人共享它。共享是安全的。
            若要在移动设备上访问钱包，请下载Keplr应用，并使用注册时相同的登录方式登录。您的Gonka Network账户将自动出现在移动钱包应用中。

            ??? note "可选：如何在Keplr钱包中添加额外的Gonka账户——单击查看步骤"

                打开扩展程序，点击扩展程序窗口右上角的账户图标。

                <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>

                点击“添加钱包”按钮。

                <a href="/images/dashboard_ping_pub_3_5_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_2.png" style="width:auto; height:337.5px; display:block;"></a>

                点击“导入现有钱包”。

                <a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:450px; height:auto; display:block;"></a>

                点击“使用恢复短语或私钥"

                <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:450px; height:auto;"></a>

                粘贴您的私钥。

                !!! note "Bridge compatibility"
                    如果您的Keplr钱包是通过**助记词（种子）**创建的，则该账户仍与以太坊桥兼容，但桥会将代币发送到与您钱包显示不同的`gonka1…`地址。这是因为以太坊和Gonka使用不同的BIP-44派生路径（币种类型`60`与`118`）。您仍可控制这些资金，但需要额外的派生步骤才能访问。为获得最简单的桥接体验，请使用`inferenced` CLI工具或Keplr“使用Google连接”流程创建Gonka账户。详情请参阅[地址和密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)。


                <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:450px; height:auto;"></a>

                为您的钱包命名以便于识别。

                <a href="/images/dashboard_ping_pub_3_5_5.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_5.png" style="width:450px; height:auto;"></a>

                请确保已选择 Gonka 链。

                <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:500px; height:auto;"></a>

                完成 — 您的 Gonka 账户已成功导入 Keplr！

                <a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:450px; height:auto;"></a>

        === "Cosmostation 浏览器扩展"

            !!! note "桥接兼容性"
                此选项通过**助记词（种子短语）**创建您的账户，因此该账户与以太坊桥兼容，但桥会将代币发送到与您的钱包显示不同的 `gonka1…` 地址。这是因为以太坊和 Gonka 使用不同的 BIP-44 衍生路径（币种类型 `60` 与 `118`）。您仍可控制该地址，只需额外执行一次衍生步骤即可访问。为获得最简单的桥接体验，建议使用 `inferenced` CLI 工具或 Keplr 的“通过 Google 连接”流程创建您的 Gonka 账户。详情请参阅 [地址和密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)。

            获取 [Cosmostation 钱包浏览器扩展](https://cosmostation.io/products/application)。 

            <a href="/images/1_cosmostation.png" target="_blank"><img src="/images/1_cosmostation.png" style="width:500px; height:auto;"></a>

            将扩展程序添加到您的浏览器。

            <a href="/images/2_cosmostation_add_extention.png" target="_blank"><img src="/images/2_cosmostation_add_extention.png" style="width:500px; height:auto;"></a>

            选择“创建新钱包”。

            <a href="/images/5_cosmostation_create_a_new_wallet.png" target="_blank"><img src="/images/5_cosmostation_create_a_new_wallet.png" style="width:auto; height:337.5px;"></a>

            记下您的助记词。请勿与任何人分享您的恢复短语。任何拥有您恢复短语的人都能完全控制您的资产。请时刻警惕网络钓鱼攻击，并安全备份该短语。 

            <a href="/images/6_cosmostation_mnemonic.png" target="_blank"><img src="/images/6_cosmostation_mnemonic.png" style="width:auto; height:337.5px;"></a>

            按顺序完成测验。检查已备份的助记词，并为每个数字选择正确的短语顺序。

            <a href="/images/7_cosmostation_quiz.png" target="_blank"><img src="/images/7_cosmostation_quiz.png" style="width:auto; height:337.5px;"></a>

            设置账户名称。请输入您的账户名称。您随时可以更改账户名称。

            <a href="/images/8_cosmostation_account_name.png" target="_blank"><img src="/images/8_cosmostation_account_name.png" style="width:auto; height:337.5px;"></a>

            在右上角点击“所有网络”，然后选择 Gonka 链以将其添加到您的钱包中。

            <a href="/images/10_cosmostation_select_gonka_network.png" target="_blank"><img src="/images/10_cosmostation_select_gonka_network.png" style="width:auto; height:337.5px;"></a>

            完成！您的 Gonka 账户已成功创建。要复制您的地址（可与他人共享以接收付款），请单击余额上方的地址。地址通常以 `gonka...` 开头。

            <a href="/images/11_cosmostation_gonka_created.png" target="_blank"><img src="/images/11_cosmostation_gonka_created.png" style="width:auto; height:337.5px;"></a>

            点击顶部的钱包名称，然后在右上角点击“管理”，再点击钱包名称。

            <a href="/images/12_cosmostation_click_name.png" target="_blank"><img src="/images/12_cosmostation_click_name.png" style="width:auto; height:337.5px;"></a>

            点击“查看私钥”。

            <a href="/images/13_cosmostation_view_private_key.png" target="_blank"><img src="/images/13_cosmostation_view_private_key.png" style="width:auto; height:337.5px;"></a>

            验证您的密码。

            <a href="/images/14_cosmostation_verify_password.png" target="_blank"><img src="/images/14_cosmostation_verify_password.png" style="width:auto; height:337.5px;"></a>

            从列表中选择“Gonka”。

            <a href="/images/15_cosmostation.png" target="_blank"><img src="/images/15_cosmostation.png" style="width:auto; height:337.5px;"></a>

            点击“Gonka”以查看私钥。复制您的私钥或恢复短语并安全存储（建议保存纸质副本）。

            <a href="/images/16_cosmostation_copy_private_key.png" target="_blank"><img src="/images/16_cosmostation_copy_private_key.png" style="width:auto; height:337.5px;"></a>

    === "我有一个外部钱包"

        === "Keplr 手机应用"

            !!! note "桥接兼容性"
                如果您的 Keplr 钱包是通过**助记词（种子短语）**创建的，则该账户仍与以太坊桥兼容，但桥会将代币发送到与您的钱包显示不同的 `gonka1…` 地址。这是因为以太坊和 Gonka 使用不同的 BIP-44 衍生路径（币种类型 `60` 与 `118`）。您仍可控制这些资金，并通过额外的衍生步骤访问它们。为获得最简单的桥接体验，请使用 `inferenced` CLI 工具或 Keplr 的“通过 Google 连接”流程创建您的 Gonka 账户。详情请参阅[地址和密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)。


            打开 Keplr 手机应用并登录您的钱包。点击左上角的菜单。

            <a href="/images/keplr_mobile_start_screen.PNG" target="_blank"><img src="/images/keplr_mobile_start_screen.PNG" style="width:auto; height:337.5px;"></a>

            点击“添加/移除”链。

            <a href="/images/keplr_mobile_add_remove_chain.PNG" target="_blank"><img src="/images/keplr_mobile_add_remove_chain.PNG" style="width:auto; height:337.5px;"></a>

            在搜索栏中输入“Gonka”并选择 Gonka 链。

            <a href="/images/keplr_mobile_add_remove_chain_gonka.PNG" target="_blank"><img src="/images/keplr_mobile_add_remove_chain_gonka.PNG" style="width:auto; height:337.5px;"></a>

            在主屏幕上，向下滚动到 Gonka 链并点击它。

            <a href="/images/keplr_mobile_start_screen.PNG" target="_blank"><img src="/images/keplr_mobile_start_screen.PNG" style="width:auto; height:337.5px;"></a>

            在您的余额上方，您将看到您的 Gonka 账户地址。点击复制图标以复制完整的 Gonka 账户地址。

            <a href="/images/keplr_mobile_copy_address_gonka.PNG" target="_blank"><img src="/images/keplr_mobile_copy_address_gonka.PNG" style="width:auto; height:337.5px;"></a>

            您已复制您的 Gonka 账户地址。您可以与任何将向您付款的人共享它。共享是安全的。

        === "Keplr 浏览器扩展"

            !!! note "桥接兼容性"
                如果您的 Keplr 钱包是通过**助记词（种子短语）**创建的，则该账户仍与以太坊桥兼容，但桥会将代币发送到与您的钱包显示不同的 `gonka1…` 地址。这是因为以太坊和 Gonka 使用不同的 BIP-44 衍生路径（币种类型 `60` 与 `118`）。您仍可控制这些资金，并通过额外的衍生步骤访问它们。为获得最简单的桥接体验，请使用 `inferenced` CLI 工具或 Keplr 的“通过 Google 连接”流程创建您的 Gonka 账户。详情请参阅[地址和密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)。


            为您的浏览器安装扩展程序（如果您已安装扩展程序，请直接跳至[“将 Gonka 网络添加到您的 Keplr 钱包”](#add-gonka-network-to-your-keplr-wallet)步骤）。

            访问 [Keplr 官方网站](https://www.keplr.app/){target=_blank} 并点击“获取 Keplr 钱包”。

            <a href="/images/dashboard_keplr_step_2_1.png" target="_blank"><img src="/images/dashboard_keplr_step_2_1.png" style="width:500px; height:auto;"></a>

            选择适用于您浏览器的扩展程序。

            <a href="/images/dashboard_keplr_step_2_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_2.png" style="width:500px; height:auto;"></a>

            将所选扩展程序添加到您的浏览器。

            === "Firefox"

                <a href="/images/dashboard_keplr_step_2_3.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3.png" style="width:500px; height:auto;"></a>

            === "Google Chrome"

                <a href="/images/dashboard_keplr_step_2_3_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3_2.png" style="width:500px; height:auto;"></a>

            安装扩展后，您应在浏览器的右上角看到它。

            <a href="/images/keplr_extension.png" target="_blank"><img src="/images/keplr_extension.png" style="width:500px; height:auto;"></a>

            此时，扩展已安装，但尚未连接到您的钱包。
            接下来，打开扩展并登录您的钱包。登录后，请按照以下步骤继续设置过程。

            #### 将 Gonka 网络添加到您的 Keplr 钱包

            以下是将 Gonka 网络添加到您的钱包以及如何创建您的 Gonka 账户的指南。
            打开 Keplr 浏览器扩展，导航到左上角的菜单。

            <a href="/images/keplr_web_start.png" target="_blank"><img src="/images/keplr_web_start.png" style="width:auto; height:337.5px;"></a>

            点击“添加/删除链”。

            <a href="/images/keplr_web_add_remove_chains.png" target="_blank"><img src="/images/keplr_web_add_remove_chains.png" style="width:auto; height:337.5px;"></a>

            在搜索栏中输入“Gonka”并选择“Gonka”链。

            <a href="/images/keplr_web_add_remove_chains_gonka.png" target="_blank"><img src="/images/keplr_web_add_remove_chains_gonka.png" style="width:auto; height:337.5px;"></a>

            打开 Keplr，点击余额上方的“复制地址”按钮。

            <a href="/images/keplr_web_start.png" target="_blank"><img src="/images/keplr_web_start.png" style="width:auto; height:337.5px;"></a>

            点击 Gonka 链旁边的复制按钮。

            <a href="/images/keplr_web_copy_gonka_address_2.png" target="_blank"><img src="/images/keplr_web_copy_gonka_address_2.png" style="width:auto; height:337.5px;"></a>

            您已复制您的 Gonka 账户地址。您可以与任何将向您付款的人共享它。共享是安全的。
            若要在移动设备上访问您的钱包，请下载 Keplr 应用程序，并使用注册时相同的方法登录。您的 Gonka 网络账户将自动出现在移动钱包应用中。

        === "Cosmostation 浏览器扩展"

            !!! note "桥接兼容性"
                此选项通过**助记词（种子短语）**创建您的账户，因此该账户与以太坊桥兼容，但桥会将代币发送到与您的钱包显示不同的 `gonka1…` 地址。这是因为以太坊和 Gonka 使用不同的 BIP-44 衍生路径（币种 `60` 与 `118`）。您仍可控制该地址，并可通过额外的衍生步骤访问它。为获得最简单的桥接体验，请使用 `inferenced` CLI 工具或 Keplr 的“通过 Google 连接”流程创建您的 Gonka 账户。详情请参阅[地址和密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)。

            如果您尚未安装，请安装 [Cosmostation 钱包浏览器扩展](https://cosmostation.io/products/application)（如果您已安装该扩展，请跳至步骤 ["将 Gonka 网络添加到您的 Cosmostation 钱包"](#add-gonka-network-to-your-cosmostation-wallet)）。

            <a href="/images/1_cosmostation.png" target="_blank"><img src="/images/1_cosmostation.png" style="width:500px; height:auto;"></a>

            将扩展添加到您的浏览器。

            <a href="/images/2_cosmostation_add_extention.png" target="_blank"><img src="/images/2_cosmostation_add_extention.png" style="width:500px; height:auto;"></a>

            打开 Cosmostation 扩展并登录您的现有钱包。

            #### 将 Gonka 网络添加到您的 Cosmostation 钱包

            在右上角点击“所有网络”，然后选择 Gonka 链将其添加到您的钱包。

            <a href="/images/10_cosmostation_select_gonka_network.png" target="_blank"><img src="/images/10_cosmostation_select_gonka_network.png" style="width:auto; height:337.5px;"></a>

            您的 Gonka 账户现已激活。要复制您的地址，请点击余额上方的地址。它通常以 `gonka...` 开头。

            <a href="/images/11_cosmostation_gonka_created.png" target="_blank"><img src="/images/11_cosmostation_gonka_created.png" style="width:auto; height:337.5px;"></a>

            您已复制您的 Gonka 账户地址。您可以与任何将向您付款的人共享它。共享是安全的。

            #### 查看您的 Gonka 私钥

            点击顶部的钱包名称，然后点击右上角的“管理”，再点击钱包名称。

            <a href="/images/12_cosmostation_click_name.png" target="_blank"><img src="/images/12_cosmostation_click_name.png" style="width:auto; height:337.5px;"></a>

            点击“查看私钥”。

            <a href="/images/13_cosmostation_view_private_key.png" target="_blank"><img src="/images/13_cosmostation_view_private_key.png" style="width:auto; height:337.5px;"></a>

            验证您的密码。

            <a href="/images/14_cosmostation_verify_password.png" target="_blank"><img src="/images/14_cosmostation_verify_password.png" style="width:auto; height:337.5px;"></a>

            从列表中选择“Gonka”。

            <a href="/images/15_cosmostation.png" target="_blank"><img src="/images/15_cosmostation.png" style="width:auto; height:337.5px;"></a>

            点击“Gonka”以查看私钥。复制您的私钥或恢复短语并安全存储（建议保存纸质副本）。

            <a href="/images/16_cosmostation_copy_private_key.png" target="_blank"><img src="/images/16_cosmostation_copy_private_key.png" style="width:auto; height:337.5px;"></a>

=== "通过 `inferenced` CLI 工具"

    本指南介绍如何使用 inferenced CLI 工具创建 Gonka 网络账户。下载 `inferenced` CLI 工具（适用于您系统的最新 `inferenced` 二进制文件请见 [这里](https://github.com/gonka-ai/gonka/releases)）。

    !!! note "什么是 inferenced CLI 工具？"
        `inferenced` CLI 工具是一个用于与 Gonka 网络交互的命令行界面工具。它是一个独立的可执行二进制文件，允许用户创建和管理 Gonka 账户、执行推理任务、上传模型，并通过脚本命令自动化各种操作。

    在创建账户之前，请设置所需的环境变量：

    ```bash
    export ACCOUNT_NAME=<your-desired-account-name>
    export NODE_URL=<http://random-node-url>
    ```

    - 将 `<your-desired-account-name>` 替换为您的选定账户名称。

    ??? note "关于账户名称的注意事项"
        此名称不会记录在链上——它仅存在于您的本地密钥存储中。
        唯一性是本地的：创建两个同名密钥将覆盖现有密钥（CLI 会发出警告）。如果您继续操作，原始密钥将永久丢失。强烈建议在执行此操作前备份您的公钥和私钥。

    - 将 `<http://random-node-url>` 替换为随机的节点 URL。您可以选择：
        - 从下面的列表中使用一个**创世节点**。
        - 获取**当前活跃参与者列表**并选择一个随机节点。

    别忘了把它记下来，下一步会用到。

    ??? note "为什么选择随机节点？"
        为了避免过度依赖创世节点并促进去中心化，Gonka 建议从当前纪元中选择一个随机的活跃节点。这有助于改善网络负载分布并增强对节点故障的韧性。

    ??? note "如何选择节点 URL？"
        您可以随机选择任何节点——您**不需要**考虑它运行的是哪种模型。此时，节点仅用作获取网络状态和广播交易的网关。所有节点都暴露相同的公共 API。

    === "创世节点"
        将 `NODE_URL` 设置为以下创世节点之一：
        ```bash title="Genesis Node List"
        http://36.189.234.237:17241
        https://node1.gonka.ai:8443
        https://node2.gonka.ai:8443
        http://47.236.26.199:8000
        http://47.236.19.22:18000
        http://gonka.spv.re:8000
        ```

    === "当前活跃参与者列表"
        或者，您可以从当前纪元中选择一个随机的活跃参与者。打开以下链接或运行以下命令以获取活跃参与者列表及其用于验证的密码学证明：
        === "链接"
            [https://node2.gonka.ai:8443/v1/epochs/current/participants](https://node2.gonka.ai:8443/v1/epochs/current/participants)

        === "命令"
            ```bash
            curl https://node2.gonka.ai:8443/v1/epochs/current/participants
            ```

    下载 `inferenced` CLI 工具（适用于您系统的最新 `inferenced` 二进制文件请见 [这里](https://github.com/gonka-ai/gonka/releases)）。

    ??? note "在 Mac OS 上启用执行权限"
        在 macOS 上，下载 `inferenced` 二进制文件后，您可能需要手动启用执行权限。请按照以下步骤操作：

        1.	打开终端并导航到二进制文件所在的目录。

        2.	运行以下命令以授予执行权限：
        ```
        chmod +x inferenced
        ```
        3.	尝试运行 `./inferenced --help` 以确认其正常工作。

        4.	如果在运行 `inferenced` 时看到安全警告，请前往系统设置 → 隐私与安全。

        5.	向下滚动到关于 `inferenced` 的警告，并点击“仍允许”。

    您可以使用以下命令创建账户：
    ```bash
    ./inferenced keys add "$ACCOUNT_NAME"
    ```

    请确保安全保存您的密码短语——您将来需要它来访问账户。

    此命令将：

    - 生成密钥对
    - 将其保存到 `~/.inference`
    - 返回您的账户地址、公钥和助记词（也请以纸质形式安全保存！）

    ```bash
    - address: <your-account-address>
      name: ACCOUNT_NAME
      pubkey: '{"@type":"...","key":"..."}'
      type: local
    ```

    您将使用此账户地址接收付款。这是您的公钥地址，可以安全地分享。

    要访问您的 Gonka 私钥，请导出私钥并安全存储。以下命令将输出纯文本私钥。私钥是一串秘密代码，可完全访问您的钱包及其内部资金。它用于确认（签名）交易并证明您是钱包的所有者。

    - 拥有私钥的人即控制该钱包。
    - 如果您丢失了它，您将失去访问权限。
    - 如果他人获得了它，他们可以盗走您的资金。

    因此，私钥必须始终安全存储，绝不可与任何人分享。

    ```bash
    ./inferenced keys export $ACCOUNT_NAME --unarmored-hex --unsafe
    ```

    要检索所有本地存储的账户列表，请执行以下命令：
    ```
     inferenced keys list [--keyring-backend test]
    ```

    现在，您可以通过导入导出的私钥将您的 Gonka 账户添加到 Keplr。如果您希望 Keplr 显示由 `inferenced` CLI 创建的相同 Gonka 地址，请不要导入助记词。由于钱包使用的派生路径不同，导入助记词可能会生成不同的 Gonka 地址。
