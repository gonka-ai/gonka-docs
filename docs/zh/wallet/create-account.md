# 创建一个新的Gonka账户

要开始使用Gonka网络，您首先需要创建一个Gonka账户。
有几种方法可以实现：

- 通过外部钱包（Keplr、Cosmostation、Fox Wallet）
- 通过`inferenced` CLI工具

!!! note "桥接兼容性和助记词（种子短语）"
    如果您使用**助记词（种子短语）**创建Gonka账户——Cosmostation和Fox Wallet默认如此——该账户**与以太坊桥接兼容**，但桥接会将代币发送到与您的钱包显示地址不同的`gonka1…`地址。这是因为以太坊和Gonka使用不同的BIP-44派生路径（币种类型`60`与`118`），因此相同的种子短语在每条链上生成不同的私钥。您仍然可以控制这些资金，并可通过额外的派生步骤访问它们。详见[地址与密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)的完整说明。

    为了获得最简单的桥接体验——即您的钱包自动显示桥接所使用的地址，且无需额外的派生步骤——请通过以下方式之一创建您的Gonka账户：

    - 使用`inferenced` CLI工具
    - 在Keplr中使用“通过Google登录”流程

以下是**Keplr**和**Cosmostation**的分步说明。相同的过程——安装钱包或扩展程序、登录、启用Gonka链并复制您的地址——也适用于[Fox Wallet](https://foxwallet.com/){target=_blank}。

=== "外部钱包"

    === "我没有外部钱包"

        === "Keplr移动应用"

            前往[Keplr官方网站](https://www.keplr.app/){target=_blank}并点击“获取Keplr钱包”。

            <a href="/images/keplr_mobile_website_main.PNG" target="_blank"><img src="/images/keplr_mobile_website_main.PNG" style="width:auto; height:337.5px;"></a>

            向下滚动到移动应用部分，选择您的操作系统并下载应用。

            <a href="/images/keplr_mobile_website_mobileos.PNG" target="_blank"><img src="/images/keplr_mobile_website_mobileos.PNG" style="width:auto; height:337.5px;"></a>

            打开应用，点击“创建新钱包”。

            <a href="/images/keplr_mobile_create_new_wallet.PNG" target="_blank"><img src="/images/keplr_mobile_create_new_wallet.PNG" style="width:auto; height:337.5px;"></a>

            点击“通过Google登录”，按照指示通过Gmail登录。

            !!! note "桥接兼容性"
                使用Keplr“通过Google登录”流程创建的账户是基于密钥而非助记词的，因此与以太坊桥接完全兼容——桥接会将代币发送到与您的钱包显示相同的`gonka1…`地址，无需额外派生步骤。详见[地址与密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)。


            <a href="/images/keplr_mobile_recovery_phrase.PNG" target="_blank"><img src="/images/keplr_mobile_recovery_phrase.PNG" style="width:auto; height:337.5px;"></a>

            安全备份您的私钥。任何人获得您的私钥都可以访问您的资产。如果您丢失了Gmail账户的访问权限，恢复钱包的唯一方法是使用您的私钥。请将私钥存放在安全的地方，切勿与他人分享。

            <a href="/images/keplr_mobile_google_private_key_2.PNG" target="_blank"><img src="/images/keplr_mobile_google_private_key_2.PNG" style="width:auto; height:337.5px;"></a>

            在搜索栏中输入“Gonka”，选择Gonka链以将其添加到您的钱包。

            <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:auto; height:337.5px;"></a>

            您已在Keplr中创建了钱包。现在，请按照以下说明找到您的账户地址。

            <a href="/images/keplr_mobile_all_set.PNG" target="_blank"><img src="/images/keplr_mobile_all_set.PNG" style="width:auto; height:337.5px;"></a>

            在主屏幕上，向下滚动到Gonka链并点击它。

            <a href="/images/keplr_mobile_start_screen.PNG" target="_blank"><img src="/images/keplr_mobile_start_screen.PNG" style="width:auto; height:337.5px;"></a>

            在余额上方，您将看到您的Gonka账户地址。点击复制图标以复制完整的Gonka账户地址。

            <a href="/images/keplr_mobile_address.PNG" target="_blank"><img src="/images/keplr_mobile_address.PNG" style="width:auto; height:337.5px;"></a>

            您已复制了Gonka账户地址。您可以将其分享给任何要向您付款的人。分享是安全的。

        === "Keplr浏览器扩展"

            前往[Keplr官方网站](https://www.keplr.app/){target=_blank}并点击“获取Keplr钱包”。

            <a href="/images/dashboard_keplr_step_2_1.png" target="_blank"><img src="/images/dashboard_keplr_step_2_1.png" style="width:500px; height:auto;"></a>

            为您的浏览器选择一个扩展程序。

            <a href="/images/dashboard_keplr_step_2_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_2.png" style="width:500px; height:auto;"></a>

            将所选扩展程序添加到您的浏览器。

            === "Firefox"

                <a href="/images/dashboard_keplr_step_2_3.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3.png" style="width:500px; height:auto;"></a>

            === "Google Chrome"

                <a href="/images/dashboard_keplr_step_2_3_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3_2.png" style="width:500px; height:auto;"></a>

            安装扩展程序后，您应该能在浏览器的右上角面板中看到它。

            <a href="/images/keplr_extension.png" target="_blank"><img src="/images/keplr_extension.png" style="width:500px; height:auto;"></a>

            此时，扩展程序已安装，但您的钱包和Gonka账户尚未创建。请继续下一步进行设置。

            打开Keplr浏览器扩展程序。点击“创建新钱包”。

            <a href="/images/dashboard_keplr_step_2_4.png" target="_blank"><img src="/images/dashboard_keplr_step_2_4.png" style="width:500px; height:auto;"></a>

            点击“使用Google登录”。按照提示通过Gmail登录。

            !!! note "桥接兼容性"
                使用Keplr的“使用Google登录”流程创建的账户是基于密钥而非助记词的，因此完全兼容以太坊桥接——桥接会将代币发送到您的钱包显示的同一个`gonka1…`地址，无需额外的派生步骤。详情请参阅[地址和密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)。


            <a href="/images/keplr_welcome_to_keplr.png" target="_blank"><img src="/images/keplr_welcome_to_keplr.png" style="width:500px; height:auto;"></a>

            设置您的钱包。将密码安全地保存在安全的地方。

            <a href="/images/keplr_set_up_your_wallet.png" target="_blank"><img src="/images/keplr_set_up_your_wallet.png" style="width:500px; height:auto;"></a>

            安全备份您的私钥。任何拥有您私钥的人都可以访问您的资产。如果您丢失了Gmail账户的访问权限，恢复钱包的唯一方法是使用您的私钥。请将私钥安全保存，切勿与他人分享。

            <a href="/images/keplr_back_up_private_key.png" target="_blank"><img src="/images/keplr_back_up_private_key.png" style="width:500px; height:auto;"></a>

            在搜索栏中输入“Gonka”，然后选择Gonka链以将其添加到您的钱包中。

            <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:500px; height:auto;"></a>

            您已在Keplr中创建了钱包。现在，请按照以下说明查找您的账户地址。

            <a href="/images/dashboard_keplr_step_2_8.png" target="_blank"><img src="/images/dashboard_keplr_step_2_8.png" style="width:500px; height:auto;"></a>

            打开Keplr，导航并点击钱包中的“复制地址”。

            <a href="/images/keplr_copy_address_2.png" target="_blank"><img src="/images/keplr_copy_address_2.png" style="width:auto; height:337.5px;"></a>

            点击Gonka链旁边的复制按钮。

            <a href="/images/keplr_web_copy_gonka_address_2.png" target="_blank"><img src="/images/keplr_web_copy_gonka_address_2.png" style="width:auto; height:337.5px;"></a>

            您已复制了您的Gonka账户地址。您可以将其分享给任何要向您付款的人。分享是安全的。
            要在移动设备上访问您的钱包，请下载Keplr应用程序，并使用注册时相同的方式登录。您的Gonka网络账户将自动出现在移动钱包应用中。

            ??? note "可选：如何在Keplr钱包中添加额外的Gonka账户——点击查看步骤"

                打开扩展程序，点击扩展窗口右上角的账户图标。

                <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>

                点击“添加钱包”按钮。

                <a href="/images/dashboard_ping_pub_3_5_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_2.png" style="width:auto; height:337.5px; display:block;"></a>

                点击“导入现有钱包”。

                <a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:450px; height:auto; display:block;"></a>

                点击“使用恢复短语或私钥”

                <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:450px; height:auto;"></a>

                粘贴您的私钥。

                !!! note "桥接兼容性"
                    如果您的Keplr钱包是通过**助记词（种子）短语**创建的，则该账户仍然兼容以太坊桥接，但桥接会将代币发送到与您钱包显示地址不同的`gonka1…`地址。这是因为以太坊和Gonka使用不同的BIP-44派生路径（币种类型`60` vs `118`）。您仍然可以控制这些资金，并通过额外的派生步骤访问它们。为了获得最简单的桥接体验，请使用`inferenced` CLI工具或Keplr的“使用Google登录”流程创建您的Gonka账户。详情请参阅[地址和密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)。


                <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:450px; height:auto;"></a>

                为您的钱包命名以便于识别。

                <a href="/images/dashboard_ping_pub_3_5_5.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_5.png" style="width:450px; height:auto;"></a>

                确保已选择 Gonka 链。

                <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:500px; height:auto;"></a>

                完成——您的 Gonka 账户已成功导入 Keplr！

                <a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:450px; height:auto;"></a>

        === "Cosmostation 浏览器扩展"

            !!! note “桥接兼容性”
                此选项通过**助记词（种子）短语**创建您的账户，因此该账户与以太坊桥兼容，但桥会将代币发送到与您的钱包显示地址不同的 `gonka1…` 地址。这是因为以太坊和 Gonka 使用不同的 BIP-44 派生路径（币种类型 `60` 与 `118`）。您仍然可以控制该地址，并可通过额外的派生步骤访问它。为了获得最简单的桥接体验，请改用 `inferenced` CLI 工具或 Keplr 的“使用 Google 登录”流程创建您的 Gonka 账户。详见 [地址和密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)。

            获取 [Cosmostation 钱包浏览器扩展](https://cosmostation.io/products/application)。

            <a href="/images/1_cosmostation.png" target="_blank"><img src="/images/1_cosmostation.png" style="width:500px; height:auto;"></a>

            向浏览器添加扩展程序。

            <a href="/images/2_cosmostation_add_extention.png" target="_blank"><img src="/images/2_cosmostation_add_extention.png" style="width:500px; height:auto;"></a>

            选择“创建新钱包”。

            <a href="/images/5_cosmostation_create_a_new_wallet.png" target="_blank"><img src="/images/5_cosmostation_create_a_new_wallet.png" style="width:auto; height:337.5px;"></a>

            记下您的助记词。切勿与任何人分享您的恢复短语，任何拥有该短语的人都能完全控制您的资产。请始终警惕钓鱼攻击。安全备份该短语。

            <a href="/images/6_cosmostation_mnemonic.png" target="_blank"><img src="/images/6_cosmostation_mnemonic.png" style="width:auto; height:337.5px;"></a>

            按顺序完成测验。核对已备份的助记词，并为每个数字按顺序选择正确的短语。

            <a href="/images/7_cosmostation_quiz.png" target="_blank"><img src="/images/7_cosmostation_quiz.png" style="width:auto; height:337.5px;"></a>

            设置账户名称。请输入您的账户名称。您可随时更改账户名称。

            <a href="/images/8_cosmostation_account_name.png" target="_blank"><img src="/images/8_cosmostation_account_name.png" style="width:auto; height:337.5px;"></a>

            在右上角，点击“所有网络”并选择 Gonka 链，将其添加到您的钱包中。

            <a href="/images/10_cosmostation_select_gonka_network.png" target="_blank"><img src="/images/10_cosmostation_select_gonka_network.png" style="width:auto; height:337.5px;"></a>

                完成！您的 Gonka 账户已成功创建。要复制您可分享给他人以接收付款的地址，请点击余额上方的地址。该地址通常以 `gonka...` 开头。

            <a href="/images/11_cosmostation_gonka_created.png" target="_blank"><img src="/images/11_cosmostation_gonka_created.png" style="width:auto; height:337.5px;"></a>

                点击顶部的钱包名称。点击右上角的“管理”，然后点击钱包名称。

            <a href="/images/12_cosmostation_click_name.png" target="_blank"><img src="/images/12_cosmostation_click_name.png" style="width:auto; height:337.5px;"></a>

                点击“查看私钥”。

            <a href="/images/13_cosmostation_view_private_key.png" target="_blank"><img src="/images/13_cosmostation_view_private_key.png" style="width:auto; height:337.5px;"></a>

                验证您的密码。

            <a href="/images/14_cosmostation_verify_password.png" target="_blank"><img src="/images/14_cosmostation_verify_password.png" style="width:auto; height:337.5px;"></a>

                从列表中选择“Gonka”。

            <a href="/images/15_cosmostation.png" target="_blank"><img src="/images/15_cosmostation.png" style="width:auto; height:337.5px;"></a>

                点击“Gonka”以查看私钥。复制您的私钥或助记词并安全保存（建议使用纸质备份）。

            <a href="/images/16_cosmostation_copy_private_key.png" target="_blank"><img src="/images/16_cosmostation_copy_private_key.png" style="width:auto; height:337.5px;"></a>

    === "我已有外部钱包"

        === "Keplr 移动应用"

            !!! note "桥接兼容性"
                如果您的 Keplr 钱包是通过**助记词（种子短语）**创建的，该账户仍然与以太坊桥接兼容，但桥接会将代币发送到与您钱包显示地址不同的 `gonka1…` 地址。这是因为以太坊和 Gonka 使用不同的 BIP-44 派生路径（币种类型 `60` 与 `118`）。您仍然可以控制这些资金，并可通过额外的派生步骤访问。为获得最简单的桥接体验，建议使用 `inferenced` CLI 工具或 Keplr 的“通过 Google 登录”流程创建您的 Gonka 账户。详见[地址与密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)。


                打开 Keplr 移动应用并登录您的钱包。点击左上角的菜单。

            <a href="/images/keplr_mobile_start_screen.PNG" target="_blank"><img src="/images/keplr_mobile_start_screen.PNG" style="width:auto; height:337.5px;"></a>

                点击“添加/移除”链。

            <a href="/images/keplr_mobile_add_remove_chain.PNG" target="_blank"><img src="/images/keplr_mobile_add_remove_chain.PNG" style="width:auto; height:337.5px;"></a>

                在搜索栏中输入“Gonka”并选择 Gonka 链。

            <a href="/images/keplr_mobile_add_remove_chain_gonka.PNG" target="_blank"><img src="/images/keplr_mobile_add_remove_chain_gonka.PNG" style="width:auto; height:337.5px;"></a>

                在主屏幕上，向下滚动找到 Gonka 链并点击它。

            <a href="/images/keplr_mobile_start_screen.PNG" target="_blank"><img src="/images/keplr_mobile_start_screen.PNG" style="width:auto; height:337.5px;"></a>

                在余额上方，您将看到您的 Gonka 账户地址。点击复制图标以复制完整的 Gonka 账户地址。

            <a href="/images/keplr_mobile_copy_address_gonka.PNG" target="_blank"><img src="/images/keplr_mobile_copy_address_gonka.PNG" style="width:auto; height:337.5px;"></a>

                您已复制了您的 Gonka 账户地址。您可以将其分享给任何向您付款的人。分享是安全的。

        === "Keplr 浏览器插件"

            !!! note "桥接兼容性"
                如果您的 Keplr 钱包是通过**助记词（种子短语）**创建的，该账户仍然与以太坊桥接兼容，但桥接会将代币发送到与您钱包显示地址不同的 `gonka1…` 地址。这是因为以太坊和 Gonka 使用不同的 BIP-44 派生路径（币种类型 `60` 与 `118`）。您仍然可以控制这些资金，并可通过额外的派生步骤访问。为获得最简单的桥接体验，建议使用 `inferenced` CLI 工具或 Keplr 的“通过 Google 登录”流程创建您的 Gonka 账户。详见[地址与密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)。


                为您的浏览器安装扩展程序（如果您已安装扩展程序，请跳转到步骤[“将 Gonka 网络添加到您的 Keplr 钱包”](#add-gonka-network-to-your-keplr-wallet)）。

                前往[Keplr 官方网站](https://www.keplr.app/){target=_blank} 并点击“获取 Keplr 钱包”。

            <a href="/images/dashboard_keplr_step_2_1.png" target="_blank"><img src="/images/dashboard_keplr_step_2_1.png" style="width:500px; height:auto;"></a>

                为您的浏览器选择一个扩展程序。

            <a href="/images/dashboard_keplr_step_2_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_2.png" style="width:500px; height:auto;"></a>

                将所选扩展程序添加到您的浏览器中。

            === "Firefox"

                <a href="/images/dashboard_keplr_step_2_3.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3.png" style="width:500px; height:auto;"></a>

            === "Google Chrome"

                <a href="/images/dashboard_keplr_step_2_3_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3_2.png" style="width:500px; height:auto;"></a>

            安装扩展程序后，您应该能在浏览器的右上角面板中看到它。

            <a href="/images/keplr_extension.png" target="_blank"><img src="/images/keplr_extension.png" style="width:500px; height:auto;"></a>

            此时，扩展程序已安装，但尚未连接到您的钱包。
            接下来，打开扩展程序并登录您的钱包。登录后，请按照以下步骤继续完成设置过程。

            #### 将Gonka网络添加到您的Keplr钱包

            以下是将Gonka网络添加到钱包的指南，以及您的Gonka账户将如何创建。
            打开Keplr浏览器扩展程序。导航到左上角的菜单。

            <a href="/images/keplr_web_start.png" target="_blank"><img src="/images/keplr_web_start.png" style="width:auto; height:337.5px;"></a>

            点击“添加/移除链”。

            <a href="/images/keplr_web_add_remove_chains.png" target="_blank"><img src="/images/keplr_web_add_remove_chains.png" style="width:auto; height:337.5px;"></a>

            在搜索栏中输入“Gonka”，然后选择“Gonka”链。

            <a href="/images/keplr_web_add_remove_chains_gonka.png" target="_blank"><img src="/images/keplr_web_add_remove_chains_gonka.png" style="width:auto; height:337.5px;"></a>

            打开Keplr，点击余额上方的“复制地址”按钮。

            <a href="/images/keplr_web_start.png" target="_blank"><img src="/images/keplr_web_start.png" style="width:auto; height:337.5px;"></a>

            点击Gonka链旁边的复制按钮。

            <a href="/images/keplr_web_copy_gonka_address_2.png" target="_blank"><img src="/images/keplr_web_copy_gonka_address_2.png" style="width:auto; height:337.5px;"></a>

            您已复制了Gonka账户地址。您可以将其分享给任何要向您付款的人。分享是安全的。
            要在移动设备上访问您的钱包，请下载Keplr应用，并使用注册时相同的方式登录。您的Gonka Network账户将自动出现在移动钱包应用中。

        === "Cosmostation浏览器扩展"

            !!! note "桥接兼容性"
                此选项通过**助记词（种子短语）**创建您的账户，因此账户与以太坊桥接兼容，但桥接会将代币发送到一个与钱包显示地址不同的`gonka1…`地址。这是因为以太坊和Gonka使用不同的BIP-44派生路径（币种类型分别为`60`和`118`）。您仍然可以控制该地址，并通过额外的派生步骤访问它。为了获得最简单的桥接体验，建议使用`inferenced` CLI工具或Keplr的“使用Google登录”流程来创建您的Gonka账户。详情请参阅[地址与密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)。

            如果尚未安装[Cosmostation钱包浏览器扩展](https://cosmostation.io/products/application)，请先安装（如果已安装，请跳转至步骤["将Gonka网络添加到您的Cosmostation钱包"](#add-gonka-network-to-your-cosmostation-wallet)）。

            <a href="/images/1_cosmostation.png" target="_blank"><img src="/images/1_cosmostation.png" style="width:500px; height:auto;"></a>

            将扩展程序添加到您的浏览器。

            <a href="/images/2_cosmostation_add_extention.png" target="_blank"><img src="/images/2_cosmostation_add_extention.png" style="width:500px; height:auto;"></a>

            打开Cosmostation扩展程序并登录您的现有钱包。

            #### 将Gonka网络添加到您的Cosmostation钱包

            在右上角点击“所有网络”，然后选择Gonka链以将其添加到您的钱包。

            <a href="/images/10_cosmostation_select_gonka_network.png" target="_blank"><img src="/images/10_cosmostation_select_gonka_network.png" style="width:auto; height:337.5px;"></a>

            您的Gonka账户现已激活。要复制地址，请点击余额上方的地址。它通常以`gonka...`开头。

            <a href="/images/11_cosmostation_gonka_created.png" target="_blank"><img src="/images/11_cosmostation_gonka_created.png" style="width:auto; height:337.5px;"></a>

            您已复制了Gonka账户地址。您可以将其分享给任何要向您付款的人。分享是安全的。

            #### 查看您的Gonka私钥

            点击顶部的钱包名称。点击右上角的“管理”，然后再次点击钱包名称。

            <a href="/images/12_cosmostation_click_name.png" target="_blank"><img src="/images/12_cosmostation_click_name.png" style="width:auto; height:337.5px;"></a>

            点击“查看私钥”。

            <a href="/images/13_cosmostation_view_private_key.png" target="_blank"><img src="/images/13_cosmostation_view_private_key.png" style="width:auto; height:337.5px;"></a>

            验证您的密码。

            <a href="/images/14_cosmostation_verify_password.png" target="_blank"><img src="/images/14_cosmostation_verify_password.png" style="width:auto; height:337.5px;"></a>

            从列表中选择“Gonka”。

            <a href="/images/15_cosmostation.png" target="_blank"><img src="/images/15_cosmostation.png" style="width:auto; height:337.5px;"></a>

            点击“Gonka”以查看私钥。复制您的私钥或恢复短语并安全保存（建议保存纸质副本）。

            <a href="/images/16_cosmostation_copy_private_key.png" target="_blank"><img src="/images/16_cosmostation_copy_private_key.png" style="width:auto; height:337.5px;"></a>

=== "通过 `inferenced` CLI 工具"

    本指南介绍如何使用 inferenced CLI 工具创建 Gonka 网络账户。下载 `inferenced` CLI 工具（适用于您系统的最新 `inferenced` 二进制文件位于[此处](https://github.com/gonka-ai/gonka/releases)）。

    !!! note "什么是 inferenced CLI 工具？"
        `inferenced` CLI 工具是一种命令行接口工具，用于与 Gonka 网络交互。它是一个独立的可执行二进制文件，允许用户创建和管理 Gonka 账户、执行推理任务、上传模型以及通过脚本命令自动化各种操作。

    在创建账户之前，请设置所需的环境变量：

    ```bash
    export ACCOUNT_NAME=<your-desired-account-name>
    export NODE_URL=<http://random-node-url>
    ```

    - 将 `<your-desired-account-name>` 替换为您选择的账户名称。

    ??? note "关于账户名称的注意事项"
        此名称不会记录在链上——它仅存在于您的本地密钥存储中。
        名称的唯一性是本地的：使用相同名称创建两个密钥将覆盖现有密钥（CLI 会发出警告）。如果您继续操作，原始密钥将永久丢失。强烈建议在执行此操作前备份您的公钥和私钥。

    - 将 `<http://random-node-url>` 替换为一个随机的节点 URL。您可以选择：
        - 使用下面列表中的一个**创世节点**。
        - 获取**当前活跃参与者的列表**并选择一个随机节点。

    别忘了记下该地址，您在下一步会用到它。

    ??? note "为什么要使用随机节点？"
        为了避免对创世节点的过度依赖并促进去中心化，Gonka 建议从当前纪元中选择一个随机的活跃节点。这有助于改善网络负载分布，并增强对节点故障的弹性。

    ??? note "如何选择节点 URL？"
        您可以随机选择任意节点——您**不需要**考虑它运行的是哪个模型。此时，节点仅用作获取网络状态和广播交易的网关。所有节点都暴露相同的公共 API。

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
        或者，您可以从当前纪元中选择一个随机的活跃参与者。打开链接或运行以下命令以获取活跃参与者列表以及用于验证的加密证明：
        === "链接"
            [https://node2.gonka.ai:8443/v1/epochs/current/participants](https://node2.gonka.ai:8443/v1/epochs/current/participants)

        === "命令"
            ```bash
            curl https://node2.gonka.ai:8443/v1/epochs/current/participants
            ```

    下载 `inferenced` CLI 工具（适用于您系统的最新 `inferenced` 二进制文件位于 [此处](https://github.com/gonka-ai/gonka/releases)）。

    ??? note "在 Mac OS 上启用执行权限"
        在 macOS 上，下载 `inferenced` 二进制文件后，您可能需要手动启用执行权限。请按照以下步骤操作：

        1.	打开终端并导航到二进制文件所在的目录。

        2.	运行以下命令以授予执行权限：
        ```
        chmod +x inferenced
        ```
        3.	尝试运行 `./inferenced --help` 以确保其正常工作。

        4.	尝试运行 `inferenced` 时如果看到安全警告，请前往系统设置 → 隐私与安全。

        5.	向下滚动到关于 `inferenced` 的警告，然后点击“仍然允许”。

    您可以使用以下命令创建一个账户：
    ```bash
    ./inferenced keys add "$ACCOUNT_NAME"
    ```

    请务必安全保存您的密码——您将来访问时会需要它。

    此命令将执行以下操作：

    - 生成密钥对
    - 将其保存到 `~/.inference`
    - 返回您的账户地址、公钥和助记词（请同时以纸质形式安全保存！）

    ```bash
    - address: <your-account-address>
      name: ACCOUNT_NAME
      pubkey: '{"@type":"...","key":"..."}'
      type: local
    ```

    您将使用此账户地址接收付款。这是您的公开地址，可以安全地分享。

    要访问您的Gonka私钥，请导出私钥并妥善保存。以下命令将输出明文私钥。私钥是一段秘密代码，拥有它即可完全访问您的钱包及其内的资金。它用于确认（签名）交易，并证明您是该钱包的所有者。

    - 谁拥有私钥，谁就控制钱包。
    - 如果丢失私钥，您将失去访问权限。
    - 如果其他人获得私钥，他们可以取走您的资金。

    因此，私钥必须始终安全存储，且绝不能与任何人分享。

    ```bash
    ./inferenced keys export $ACCOUNT_NAME --unarmored-hex --unsafe
    ```

    要检索所有本地存储的账户列表，请执行以下命令：
    ```
     inferenced keys list [--keyring-backend test]
    ```

    现在，您可以通过导入导出的私钥将您的 Gonka 账户添加到 Keplr。如果您需要 Keplr 显示由 `inferenced` CLI 创建的相同 Gonka 地址，请不要导入助记词。根据钱包使用的派生路径，导入助记词可能会生成不同的 Gonka 地址。
