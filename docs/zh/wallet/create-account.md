# 创建新的 Gonka 账户

要开始使用 Gonka 网络，你首先需要创建一个 Gonka 账户。
有几种方法可以做到这一点：

- 通过外部钱包（Keplr、Cosmostation、Fox Wallet）
- 通过 `inferenced` CLI 工具

!!! note "桥接兼容性与助记词（seed phrase）"
    如果你使用**助记词（seed phrase）**创建 Gonka 账户——如 Cosmostation 和 Fox Wallet 默认采用的方式——该账户**与以太坊桥接兼容**，但桥接会将代币发送到与你钱包显示的不同的 `gonka1…` 地址。这是因为以太坊和 Gonka 使用不同的 BIP-44 派生路径（币种类型 `60` vs `118`），同一助记词在两条链上会产生不同的私钥。你仍然控制这些资金，可以通过额外的密钥派生步骤来访问它们。详见 [地址和密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)。

    如需最简便的桥接体验——让钱包自动显示桥接使用的地址，无需额外派生步骤——请通过以下方式创建你的 Gonka 账户：

    - 使用 `inferenced` CLI 工具
    - 在 Keplr 中使用"Connect with Google"流程

=== "外部钱包"

    === "我没有外部钱包"

        === "Keplr 移动应用"

            前往 [the official Keplr website](https://www.keplr.app/){target=_blank} 点击 "Get Keplr wallet"（获取 Keplr 钱包）。
            
            <a href="/images/keplr_mobile_website_main.PNG" target="_blank"><img src="/images/keplr_mobile_website_main.PNG" style="width:auto; height:337.5px;"></a>
            
            向下滚动至移动应用（Mobile App）部分，选择你的操作系统并下载应用程序。
            
            <a href="/images/keplr_mobile_website_mobileos.PNG" target="_blank"><img src="/images/keplr_mobile_website_mobileos.PNG" style="width:auto; height:337.5px;"></a>
            
            打开应用，点击"Create a new wallet"（创建新钱包）。
            
            <a href="/images/keplr_mobile_create_new_wallet.PNG" target="_blank"><img src="/images/keplr_mobile_create_new_wallet.PNG" style="width:auto; height:337.5px;"></a>

            点击 "Connect with Google"，按照提示通过 Gmail 登录。

            ??? note "关于钱包与桥接兼容性的重要说明。如果你打算通过以太坊桥出售 Gonka 代币，请仔细阅读"
                如果你的钱包是使用**助记词（seed phrase）**创建的，该账户与以太坊桥接兼容，但需要额外步骤——桥接会将代币发送到与你钱包显示的不同的 `gonka1…` 地址。你仍然控制这些资金，可以通过派生正确的密钥来访问。详见 [地址和密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)。如需最简便的桥接体验，请通过 `inferenced` CLI 或 Keplr "Connect with Google" 流程创建你的 Gonka 账户。

                
            <a href="/images/keplr_mobile_recovery_phrase.PNG" target="_blank"><img src="/images/keplr_mobile_recovery_phrase.PNG" style="width:auto; height:337.5px;"></a>
                
            请安全备份你的私钥。任何获取你私钥的人都可以访问你的资产。如果你无法访问 Gmail 账户，恢复钱包的唯一方式就是使用你的私钥。请将私钥存储在安全可靠的地方，切勿与任何人分享。
                
            <a href="/images/keplr_mobile_google_private_key_2.PNG" target="_blank"><img src="/images/keplr_mobile_google_private_key_2.PNG" style="width:auto; height:337.5px;"></a>
            
            在搜索栏中输入 "Gonka"，并选择 Gonka 链将其添加到你的钱包中。

            <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:auto; height:337.5px;"></a>

            你已成功在 Keplr 中创建钱包。接下来，请按照以下步骤查找你的账户地址。

            <a href="/images/keplr_mobile_all_set.PNG" target="_blank"><img src="/images/keplr_mobile_all_set.PNG" style="width:auto; height:337.5px;"></a>

            在首页界面，向下滚动至 Gonka 链并点击进入。

            <a href="/images/keplr_mobile_start_screen.PNG" target="_blank"><img src="/images/keplr_mobile_start_screen.PNG" style="width:auto; height:337.5px;"></a>

            在余额上方，你将看到你的 Gonka 账户地址。点击复制图标以复制完整的 Gonka 账户地址。

            <a href="/images/keplr_mobile_address.PNG" target="_blank"><img src="/images/keplr_mobile_address.PNG" style="width:auto; height:337.5px;"></a>

            你已复制 Gonka 账户地址。你可以将其分享给任何需要向你转账的人，分享地址是安全的。

        === "Keplr 浏览器扩展"

            前往 [the official Keplr website](https://www.keplr.app/){target=_blank} 点击 "Get Keplr wallet"（获取 Keplr 钱包）。
            
            <a href="/images/dashboard_keplr_step_2_1.png" target="_blank"><img src="/images/dashboard_keplr_step_2_1.png" style="width:500px; height:auto;"></a>
            
            选择适用于你浏览器的扩展程序。
            
            <a href="/images/dashboard_keplr_step_2_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_2.png" style="width:500px; height:auto;"></a>
            
            将所选扩展添加到你的浏览器中。
            
            === "Firefox"
            
                <a href="/images/dashboard_keplr_step_2_3.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3.png" style="width:500px; height:auto;"></a>
            
            === "Google Chrome"
            
                <a href="/images/dashboard_keplr_step_2_3_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3_2.png" style="width:500px; height:auto;"></a>

            安装完成后，你应该可以在浏览器右上角看到该扩展。
            
            <a href="/images/keplr_extension.png" target="_blank"><img src="/images/keplr_extension.png" style="width:500px; height:auto;"></a>
            
            此时扩展已安装完成，但你的钱包和 Gonka 账户尚未创建。请继续下一步进行设置。

            打开 Keplr 浏览器扩展，点击 "Create a new wallet"（创建新钱包）。
            
            <a href="/images/dashboard_keplr_step_2_4.png" target="_blank"><img src="/images/dashboard_keplr_step_2_4.png" style="width:500px; height:auto;"></a>
            
            点击 "Connect with Google"，按照提示通过 Gmail 登录。

            ??? note "关于钱包与桥接兼容性的重要说明。如果你打算通过以太坊桥出售 Gonka 代币，请仔细阅读"
                如果你的钱包是使用**助记词（seed phrase）**创建的，该账户与以太坊桥接兼容，但需要额外步骤——桥接会将代币发送到与你钱包显示的不同的 `gonka1…` 地址。你仍然控制这些资金，可以通过派生正确的密钥来访问。详见 [地址和密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)。如需最简便的桥接体验，请通过 `inferenced` CLI 或 Keplr "Connect with Google" 流程创建你的 Gonka 账户。

                
            <a href="/images/keplr_welcome_to_keplr.png" target="_blank"><img src="/images/keplr_welcome_to_keplr.png" style="width:500px; height:auto;"></a>
                
            设置你的钱包。请将密码妥善保存在安全的位置。
                
            <a href="/images/keplr_set_up_your_wallet.png" target="_blank"><img src="/images/keplr_set_up_your_wallet.png" style="width:500px; height:auto;"></a>

            请安全备份你的私钥。任何获取你私钥的人都可以访问你的资产。如果你无法访问 Gmail 账户，恢复钱包的唯一方式就是使用你的私钥。请将私钥存储在安全可靠的地方，切勿与任何人分享。
            
            <a href="/images/keplr_back_up_private_key.png" target="_blank"><img src="/images/keplr_back_up_private_key.png" style="width:500px; height:auto;"></a>

            在搜索栏中输入 "Gonka"，并选择 Gonka 链将其添加到你的钱包中。

            <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:500px; height:auto;"></a>

            你已成功在 Keplr 中创建钱包。接下来，请按照以下步骤查找你的账户地址。

            <a href="/images/dashboard_keplr_step_2_8.png" target="_blank"><img src="/images/dashboard_keplr_step_2_8.png" style="width:500px; height:auto;"></a>

            打开 Keplr，进入钱包界面并点击 "Copy Address"（复制地址）。

            <a href="/images/keplr_copy_address_2.png" target="_blank"><img src="/images/keplr_copy_address_2.png" style="width:auto; height:337.5px;"></a>

            点击 Gonka 链旁边的复制按钮。

            <a href="/images/keplr_web_copy_gonka_address_2.png" target="_blank"><img src="/images/keplr_web_copy_gonka_address_2.png" style="width:auto; height:337.5px;"></a>

            你已复制 Gonka 账户地址。你可以将其分享给任何需要向你转账的人，分享地址是安全的。
            如果你需要在移动设备上访问钱包，请下载 Keplr 应用，并使用注册时相同的方式登录。你的 Gonka Network 账户将自动显示在移动端钱包中。

            ??? note "可选：如何在 Keplr 钱包中添加额外的 Gonka 账户 — 点击查看步骤"
    
                打开扩展，在窗口右上角点击账户图标。
                    
                <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>
                    
                点击 "Add wallet"（添加钱包）按钮。
                    
                <a href="/images/dashboard_ping_pub_3_5_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_2.png" style="width:auto; height:337.5px; display:block;"></a>
                    
                点击 "Import an Existing Wallet"（导入已有钱包）。
                    
                <a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:450px; height:auto; display:block;"></a>
                    
                点击 "Use recovery phrase or private key"（使用助记词或私钥）。
            
                <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:450px; height:auto;"></a>
            
                粘贴你的私钥。

                ??? note "关于钱包与桥接兼容性的重要说明。如果你打算通过以太坊桥出售 Gonka 代币，请仔细阅读"
                    如果你的钱包是使用**助记词（seed phrase）**创建的，该账户与以太坊桥接兼容，但需要额外步骤——桥接会将代币发送到与你钱包显示的不同的 `gonka1…` 地址。你仍然控制这些资金，可以通过派生正确的密钥来访问。详见 [地址和密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)。如需最简便的桥接体验，请通过 `inferenced` CLI 或 Keplr "Connect with Google" 流程创建你的 Gonka 账户。

                    - 使用 `inferenced` CLI 工具
                    - 在 Keplr 中使用"Connect with Google"流程
                    
                    这些是需要以太坊桥接兼容性的用户的推荐和支持选项。
            
                <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:450px; height:auto;"></a>
                    
                为你的钱包设置一个名称，方便后续识别。
                    
                <a href="/images/dashboard_ping_pub_3_5_5.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_5.png" style="width:450px; height:auto;"></a>
                    
                请确保已选择 Gonka 链。

                <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:500px; height:auto;"></a>

                完成 —— 你的 Gonka 账户已成功导入到 Keplr！
                    
                <a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:450px; height:auto;"></a>

        === "Cosmostation 浏览器扩展"

            !!! note "重要提示：使用桥接需要额外步骤"
                此选项通过助记词创建账户。由于以太坊和 Gonka 使用不同的 BIP-44 派生路径，桥接会将代币发送到与你钱包显示的不同的 `gonka1…` 地址。你仍然控制该地址（可以使用相同助记词通过币种类型 `60` 派生以太坊密钥），但需要手动派生密钥。为获得更简便的桥接体验，请改为通过 `inferenced` CLI 工具或 Keplr（"Connect with Google"流程）创建你的 Gonka 账户。
                
            获取 [Cosmostation Wallet 浏览器扩展](https://cosmostation.io/products/application)。
            
            <a href="/images/1_cosmostation.png" target="_blank"><img src="/images/1_cosmostation.png" style="width:500px; height:auto;"></a>
                    
            将扩展添加到你的浏览器。
            
            <a href="/images/2_cosmostation_add_extention.png" target="_blank"><img src="/images/2_cosmostation_add_extention.png" style="width:500px; height:auto;"></a>
            
            选择 "Create new wallet"（创建新钱包）。
            
            <a href="/images/5_cosmostation_create_a_new_wallet.png" target="_blank"><img src="/images/5_cosmostation_create_a_new_wallet.png" style="width:auto; height:337.5px;"></a>
            
            记录你的助记词。切勿与任何人分享你的恢复短语。任何持有你恢复短语的人都可以完全控制你的资产。请时刻保持对钓鱼攻击的警惕。安全备份该短语。
            
            <a href="/images/6_cosmostation_mnemonic.png" target="_blank"><img src="/images/6_cosmostation_mnemonic.png" style="width:auto; height:337.5px;"></a>
            
            按顺序完成测验。检查已备份的助记词，并按照每个编号选择正确的短语。
            
            <a href="/images/7_cosmostation_quiz.png" target="_blank"><img src="/images/7_cosmostation_quiz.png" style="width:auto; height:337.5px;"></a>
            
            设置账户名称。请为你的账户输入一个名称。你可以随时更改账户名称。
            
            <a href="/images/8_cosmostation_account_name.png" target="_blank"><img src="/images/8_cosmostation_account_name.png" style="width:auto; height:337.5px;"></a>
            
            在右上角点击 "All Networks"，然后选择 Gonka 链将其添加到你的钱包中。
            
            <a href="/images/10_cosmostation_select_gonka_network.png" target="_blank"><img src="/images/10_cosmostation_select_gonka_network.png" style="width:auto; height:337.5px;"></a>
            
            完成！你的 Gonka 账户已成功创建。要复制你的地址（可分享给他人以接收付款），请点击余额上方的地址。地址通常以 `gonka...` 开头。
                
            <a href="/images/11_cosmostation_gonka_created.png" target="_blank"><img src="/images/11_cosmostation_gonka_created.png" style="width:auto; height:337.5px;"></a>
            
            点击顶部的钱包名称。点击右上角的 "Manage"，然后点击钱包名称。
                    
            <a href="/images/12_cosmostation_click_name.png" target="_blank"><img src="/images/12_cosmostation_click_name.png" style="width:auto; height:337.5px;"></a>
            
            点击 "View private key"（查看私钥）。
            
            <a href="/images/13_cosmostation_view_private_key.png" target="_blank"><img src="/images/13_cosmostation_view_private_key.png" style="width:auto; height:337.5px;"></a>
            
            验证你的密码。
            
            <a href="/images/14_cosmostation_verify_password.png" target="_blank"><img src="/images/14_cosmostation_verify_password.png" style="width:auto; height:337.5px;"></a>
            
            从列表中选择 "Gonka"。
            
            <a href="/images/15_cosmostation.png" target="_blank"><img src="/images/15_cosmostation.png" style="width:auto; height:337.5px;"></a>
               
            点击 "Gonka" 查看私钥。复制你的私钥或恢复短语并安全存储（建议使用纸质备份）。
            
            <a href="/images/16_cosmostation_copy_private_key.png" target="_blank"><img src="/images/16_cosmostation_copy_private_key.png" style="width:auto; height:337.5px;"></a>

    === "我已有外部钱包"

        以下提供了 **Keplr** 和 **Cosmostation** 的分步说明。同样的流程——安装钱包或扩展、登录、启用 Gonka 链、复制地址——也适用于 [Fox Wallet](https://foxwallet.com/){target=_blank}。

        === "Keplr 移动应用"

            ??? note "关于钱包与桥接兼容性的重要说明。如果你打算通过以太坊桥出售 Gonka 代币，请仔细阅读"
                如果你的钱包是使用**助记词（seed phrase）**创建的，该账户与以太坊桥接兼容，但需要额外步骤——桥接会将代币发送到与你钱包显示的不同的 `gonka1…` 地址。你仍然控制这些资金，可以通过派生正确的密钥来访问。详见 [地址和密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)。如需最简便的桥接体验，请通过 `inferenced` CLI 或 Keplr "Connect with Google" 流程创建你的 Gonka 账户。


            打开 Keplr 移动应用并登录你的钱包。点击左上角的菜单。
            
            <a href="/images/keplr_mobile_start_screen.PNG" target="_blank"><img src="/images/keplr_mobile_start_screen.PNG" style="width:auto; height:337.5px;"></a>

            点击 "Add/Remove" Chains（添加/移除链）。

            <a href="/images/keplr_mobile_add_remove_chain.PNG" target="_blank"><img src="/images/keplr_mobile_add_remove_chain.PNG" style="width:auto; height:337.5px;"></a>

            在搜索栏中输入 "Gonka"，并选择 Gonka 链。

            <a href="/images/keplr_mobile_add_remove_chain_gonka.PNG" target="_blank"><img src="/images/keplr_mobile_add_remove_chain_gonka.PNG" style="width:auto; height:337.5px;"></a>

            在首页界面，向下滚动至 Gonka 链并点击进入。

            <a href="/images/keplr_mobile_start_screen.PNG" target="_blank"><img src="/images/keplr_mobile_start_screen.PNG" style="width:auto; height:337.5px;"></a>

            在余额上方，你将看到你的 Gonka 账户地址。点击复制图标以复制完整的 Gonka 账户地址。

            <a href="/images/keplr_mobile_copy_address_gonka.PNG" target="_blank"><img src="/images/keplr_mobile_copy_address_gonka.PNG" style="width:auto; height:337.5px;"></a>

            你已复制 Gonka 账户地址。你可以将其分享给任何需要向你转账的人，分享地址是安全的。

        === "Keplr 浏览器扩展"

            ??? note "关于钱包与桥接兼容性的重要说明。如果你打算通过以太坊桥出售 Gonka 代币，请仔细阅读"
                如果你的钱包是使用**助记词（seed phrase）**创建的，该账户与以太坊桥接兼容，但需要额外步骤——桥接会将代币发送到与你钱包显示的不同的 `gonka1…` 地址。你仍然控制这些资金，可以通过派生正确的密钥来访问。详见 [地址和密钥](../cross-chain-transfers/ethereum-bridge/addresses-and-keys.md)。如需最简便的桥接体验，请通过 `inferenced` CLI 或 Keplr "Connect with Google" 流程创建你的 Gonka 账户。


            如果你尚未安装浏览器扩展，请先进行安装（如果已安装扩展，可直接跳转至步骤 ["将 Gonka 网络添加到你的钱包"](#add-gonka-network-to-your-wallet)）。
            
            前往 [the official Keplr website](https://www.keplr.app/){target=_blank} 点击 "Get Keplr wallet"（获取 Keplr 钱包）。
            
            <a href="/images/dashboard_keplr_step_2_1.png" target="_blank"><img src="/images/dashboard_keplr_step_2_1.png" style="width:500px; height:auto;"></a>
            
            选择适用于你浏览器的扩展程序。
            
            <a href="/images/dashboard_keplr_step_2_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_2.png" style="width:500px; height:auto;"></a>
            
            将所选扩展添加到你的浏览器中。
            
            === "Firefox"
            
                <a href="/images/dashboard_keplr_step_2_3.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3.png" style="width:500px; height:auto;"></a>
            
            === "Google Chrome"
            
                <a href="/images/dashboard_keplr_step_2_3_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3_2.png" style="width:500px; height:auto;"></a>

            安装完成后，你应该可以在浏览器右上角看到该扩展。
                
            <a href="/images/keplr_extension.png" target="_blank"><img src="/images/keplr_extension.png" style="width:500px; height:auto;"></a>

            此时扩展已安装完成，但尚未连接到你的钱包。
            接下来请打开扩展并登录你的钱包。登录后，按照以下步骤继续完成设置。

            #### 将 Gonka 网络添加到你的钱包

            以下是如何将 Gonka 网络添加到钱包，以及如何创建你的 Gonka 账户的指南。
            打开 Keplr 浏览器扩展，进入左上角菜单。

            <a href="/images/keplr_web_start.png" target="_blank"><img src="/images/keplr_web_start.png" style="width:auto; height:337.5px;"></a>

            点击 "Add/Remove chains"（添加/移除链）。

            <a href="/images/keplr_web_add_remove_chains.png" target="_blank"><img src="/images/keplr_web_add_remove_chains.png" style="width:auto; height:337.5px;"></a>

            在搜索栏中输入 "Gonka"，并选择 "Gonka" 链。
                
            <a href="/images/keplr_web_add_remove_chains_gonka.png" target="_blank"><img src="/images/keplr_web_add_remove_chains_gonka.png" style="width:auto; height:337.5px;"></a>

            打开 Keplr，在余额上方点击 "Copy Address"（复制地址）按钮。

            <a href="/images/keplr_web_start.png" target="_blank"><img src="/images/keplr_web_start.png" style="width:auto; height:337.5px;"></a>

            点击 Gonka 链旁边的复制按钮。

            <a href="/images/keplr_web_copy_gonka_address_2.png" target="_blank"><img src="/images/keplr_web_copy_gonka_address_2.png" style="width:auto; height:337.5px;"></a>

            你已复制 Gonka 账户地址。你可以将其分享给任何需要向你转账的人，分享地址是安全的。
            如果你需要在移动设备上访问钱包，请下载 Keplr 应用，并使用注册时相同的方式登录。你的 Gonka Network 账户将自动显示在移动端钱包中。

        === "Cosmostation 浏览器扩展"

            !!! note "重要提示：使用桥接需要额外步骤"
                此选项使用由助记词创建的账户。由于以太坊和 Gonka 使用不同的 BIP-44 派生路径，桥接会将代币发送到与你钱包显示的不同的 `gonka1…` 地址。你仍然控制该地址（可以使用相同助记词通过币种类型 `60` 派生以太坊密钥），但需要手动派生密钥。为获得更简便的桥接体验，请改为通过 `inferenced` CLI 工具或 Keplr（"Connect with Google"流程）创建你的 Gonka 账户。

            如果尚未安装，请先安装 [Cosmostation Wallet 浏览器扩展](https://cosmostation.io/products/application)（如果已安装扩展，可直接跳转至步骤 ["将 Gonka 网络添加到你的 Cosmostation 钱包"](#将-gonka-网络添加到你的-cosmostation-钱包)）。
            
            <a href="/images/1_cosmostation.png" target="_blank"><img src="/images/1_cosmostation.png" style="width:500px; height:auto;"></a>
                    
            将扩展添加到你的浏览器。
            
            <a href="/images/2_cosmostation_add_extention.png" target="_blank"><img src="/images/2_cosmostation_add_extention.png" style="width:500px; height:auto;"></a>

            打开 Cosmostation 扩展并登录你的现有钱包。

            #### 将 Gonka 网络添加到你的 Cosmostation 钱包

            在右上角点击 "All Networks"，然后选择 Gonka 链将其添加到你的钱包中。
            
            <a href="/images/10_cosmostation_select_gonka_network.png" target="_blank"><img src="/images/10_cosmostation_select_gonka_network.png" style="width:auto; height:337.5px;"></a>
            
            你的 Gonka 账户现已激活。要复制你的地址，请点击余额上方的地址。地址通常以 `gonka...` 开头。
                
            <a href="/images/11_cosmostation_gonka_created.png" target="_blank"><img src="/images/11_cosmostation_gonka_created.png" style="width:auto; height:337.5px;"></a>

            你已复制 Gonka 账户地址。你可以将其分享给任何需要向你转账的人，分享地址是安全的。

            #### 查看你的 Gonka 私钥

            点击顶部的钱包名称。点击右上角的 "Manage"，然后点击钱包名称。
                    
            <a href="/images/12_cosmostation_click_name.png" target="_blank"><img src="/images/12_cosmostation_click_name.png" style="width:auto; height:337.5px;"></a>
            
            点击 "View private key"（查看私钥）。
            
            <a href="/images/13_cosmostation_view_private_key.png" target="_blank"><img src="/images/13_cosmostation_view_private_key.png" style="width:auto; height:337.5px;"></a>
            
            验证你的密码。
            
            <a href="/images/14_cosmostation_verify_password.png" target="_blank"><img src="/images/14_cosmostation_verify_password.png" style="width:auto; height:337.5px;"></a>
            
            从列表中选择 "Gonka"。
            
            <a href="/images/15_cosmostation.png" target="_blank"><img src="/images/15_cosmostation.png" style="width:auto; height:337.5px;"></a>
               
            点击 "Gonka" 查看私钥。复制你的私钥或恢复短语并安全存储（建议使用纸质备份）。
            
            <a href="/images/16_cosmostation_copy_private_key.png" target="_blank"><img src="/images/16_cosmostation_copy_private_key.png" style="width:auto; height:337.5px;"></a>

=== "通过 `inferenced` CLI 工具"
    
    本指南介绍如何使用 inferenced CLI 工具创建 Gonka Network 账户。请下载 `inferenced` CLI 工具（适用于你系统的最新 `inferenced` 二进制文件可在[这里](https://github.com/gonka-ai/gonka/releases)获取）。

    !!! note "什么是 inferenced CLI 工具？"
        `inferenced` CLI 工具是一个用于与 Gonka 网络交互的命令行工具。它是一个独立的可执行程序，允许用户创建和管理 Gonka 账户、执行推理任务、上传模型，以及通过脚本化命令自动化各种操作。

    在创建账户之前，请先设置所需的环境变量：
    
    ```bash
    export ACCOUNT_NAME=<your-desired-account-name>
    export NODE_URL=<http://random-node-url>
    ```
    
    - 将 `<your-desired-account-name>` 替换为你希望使用的账户名称。
    
    ??? note "关于账户名称需要了解的事项"
        该名称不会记录在链上——仅存在于你的本地密钥存储中。
        名称唯一性仅限本地：如果你创建两个相同名称的密钥，将会覆盖已有密钥（CLI 会给出警告）。一旦继续操作，原有密钥将被永久丢失。强烈建议在执行此操作前备份你的公钥和私钥。
    
    - 将 `<http://random-node-url>` 替换为一个随机节点的 URL。你可以选择以下方式之一：
        - 使用下方列表中的任一**创世节点（genesis nodes）**。
        - 获取**当前活跃参与者列表**，并随机选择一个节点。
    
    请务必记录该 URL，你将在下一步中用到。
    
    ??? note "为什么要选择随机节点？"
        为了避免对创世节点的过度依赖，并促进去中心化，Gonka 建议从当前周期（epoch）的活跃节点中随机选择一个节点。这有助于提升网络负载分布的均衡性，并增强对节点故障的抗性。
    
    ??? note "如何选择 Node URL？"
        你可以随机选择任意节点——**无需**考虑其运行的模型类型。在当前阶段，该节点仅作为获取网络状态和广播交易的网关使用。所有节点都提供相同的公共 API。
    
    === "创世节点（Genesis nodes）"
        将 `NODE_URL` 设置为以下任一创世节点：
        ```bash title="Genesis Node List"
        http://36.189.234.237:17241
        https://node1.gonka.ai:8443
        https://node2.gonka.ai:8443
        http://47.236.26.199:8000
        http://47.236.19.22:18000
        http://gonka.spv.re:8000
        ```
        
    === "当前活跃参与者列表"
        或者，你也可以从当前 epoch 的活跃参与者中随机选择一个节点。打开以下链接或运行命令，以获取活跃参与者列表及其用于验证的加密证明：
        === "链接"
            [https://node2.gonka.ai:8443/v1/epochs/current/participants](https://node2.gonka.ai:8443/v1/epochs/current/participants)
    
        === "命令"
            ```bash
            curl https://node2.gonka.ai:8443/v1/epochs/current/participants
            ```
        
    下载 `inferenced` CLI 工具（适用于你系统的最新 `inferenced` 二进制文件可在[这里](https://github.com/gonka-ai/gonka/releases)获取）。
        
    ??? note "在 Mac OS 上启用执行权限"
        在 macOS 上，下载 `inferenced` 二进制文件后，你可能需要手动启用执行权限。请按照以下步骤操作：
         
        1.	打开终端，并进入该二进制文件所在目录。
        
        2.	运行以下命令授予执行权限：
        ```
        chmod +x inferenced
        ```
        3.	运行 `./inferenced --help` 以确认程序可以正常执行。
            
        4.	如果在运行 `inferenced` 时出现安全提示，请前往「系统设置 → 隐私与安全性」。
            
        5.	向下滚动找到关于 `inferenced` 的提示，并点击 "仍要允许（Allow Anyway）"。
        
    你可以使用以下命令创建账户：
    ```bash
    ./inferenced keys add "$ACCOUNT_NAME"
    ```
        
    请务必妥善保存你的口令（passphrase）——后续访问时将会用到。
        
    该命令将会：
        
    - 生成一对密钥（keypair）
    - 将其保存至 `~/.inference`
    - 返回你的账户地址、公钥以及助记词（请务必安全保存，建议同时保留纸质备份！）
    
    ```bash
    - address: <your-account-address>
      name: ACCOUNT_NAME
      pubkey: '{"@type":"...","key":"..."}'
      type: local
    ```
            
    你将使用该账户地址接收转账。这是你的公开地址，可以安全分享。
            
    如需获取你的 Gonka 私钥，请导出私钥并妥善保存。以下命令将输出明文私钥。私钥是一串用于完全控制钱包及其资产的秘密代码，用于确认（签名）交易并证明你是该钱包的拥有者。
        
    - 拥有私钥的人即拥有该钱包的控制权。
    - 一旦丢失，将无法恢复访问。
    - 一旦被他人获取，资产可能被转走。

    因此，私钥必须始终安全存储，切勿与任何人分享。
        
    ```bash
    ./inferenced keys export $ACCOUNT_NAME --unarmored-hex --unsafe
    ```
        
    如需查看本地存储的所有账户列表，请执行以下命令：
    ```
     inferenced keys list [--keyring-backend test]
    ```

    现在你可以通过导入导出的私钥将你的 Gonka 账户添加到 Keplr。如果你需要 Keplr 显示与 `inferenced` CLI 创建的相同 Gonka 地址，请不要导入助记词。根据钱包使用的派生路径不同，导入助记词可能会生成不同的 Gonka 地址。
