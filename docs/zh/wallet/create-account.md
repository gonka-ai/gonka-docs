# 创建一个新的 Gonka 账户

要开始使用 Gonka 网络，您首先需要创建一个 Gonka 账户。  
有几种方式可以完成此操作：

- 通过外部钱包（Keplr）  
- 通过 `inferenced` CLI 工具

!!! note "关于钱包桥接兼容性的重要说明。如果您计划通过以太坊桥出售 Gonka 代币，请仔细阅读"
    当前桥接功能需要特定的账户设置。某些钱包可能允许您创建 Gonka 账户甚至导出私钥，但这并不总是意味着该账户能与桥接功能正常协作。如需使用桥接功能，请通过以下方式之一创建您的 Gonka 账户：

 
 
    - 使用 `inferenced` CLI 工具  
 
 
    - 在 Keplr 中使用“通过 Google 登录”流程

    这些是为需要以太坊桥接兼容性的用户推荐并支持的方式。

=== "外部钱包"

    === "我没有外部钱包"

        === "Keplr 移动应用"

            前往[Keplr 官方网站](https://www.keplr.app/){target=_blank} 并点击“获取 Keplr 钱包”。

            <a href="/images/keplr_mobile_website_main.PNG" target="_blank"><img src="/images/keplr_mobile_website_main.PNG" style="width:auto; height:337.5px;"></a>

            向下滚动至移动应用部分，选择您的操作系统并下载应用。

            <a href="/images/keplr_mobile_website_mobileos.PNG" target="_blank"><img src="/images/keplr_mobile_website_mobileos.PNG" style="width:auto; height:337.5px;"></a>

            打开应用，点击“创建新钱包”。

            <a href="/images/keplr_mobile_create_new_wallet.PNG" target="_blank"><img src="/images/keplr_mobile_create_new_wallet.PNG" style="width:auto; height:337.5px;"></a>

            点击“通过 Google 登录”，然后按照提示使用 Gmail 登录。

            ??? note "关于钱包桥接兼容性的重要说明。如果您计划通过以太坊桥出售 Gonka 代币，请仔细阅读"
                当前桥接功能需要特定的账户设置。某些钱包可能允许您创建 Gonka 账户甚至导出私钥，但这并不总是意味着该账户能与桥接功能正常协作。如需使用桥接功能，请通过以下方式之一创建您的 Gonka 账户：

 
 
                - 使用 `inferenced` CLI 工具  
 
 
                - 在 Keplr 中使用“通过 Google 登录”流程

                这些是为需要以太坊桥接兼容性的用户推荐并支持的方式。

            <a href="/images/keplr_mobile_recovery_phrase.PNG" target="_blank"><img src="/images/keplr_mobile_recovery_phrase.PNG" style="width:auto; height:337.5px;"></a>

            安全备份您的私钥。任何人获得您的私钥都可以访问您的资产。如果您丢失了对 Gmail 账户的访问权限，唯一能恢复钱包的方式就是使用私钥。请将私钥保存在安全的地方，切勿与任何人分享。

            <a href="/images/keplr_mobile_google_private_key_2.PNG" target="_blank"><img src="/images/keplr_mobile_google_private_key_2.PNG" style="width:auto; height:337.5px;"></a>

            在搜索栏中输入“Gonka”，然后选择 Gonka 链以将其添加到您的钱包中。

            <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:auto; height:337.5px;"></a>

            您已在 Keplr 中成功创建钱包。现在，请按照以下说明查找您的账户地址。

            <a href="/images/keplr_mobile_all_set.PNG" target="_blank"><img src="/images/keplr_mobile_all_set.PNG" style="width:auto; height:337.5px;"></a>

            在主屏幕上向下滚动，找到 Gonka 链并点击进入。

            <a href="/images/keplr_mobile_start_screen.PNG" target="_blank"><img src="/images/keplr_mobile_start_screen.PNG" style="width:auto; height:337.5px;"></a>

            在余额上方您将看到您的 Gonka 账户地址。点击复制图标以复制完整的 Gonka 账户地址。

            <a href="/images/keplr_mobile_address.PNG" target="_blank"><img src="/images/keplr_mobile_address.PNG" style="width:auto; height:337.5px;"></a>

            您已成功复制了 Gonka 账户地址。您可以将此地址分享给任何要向您付款的人。分享地址是安全的。

        === "Keplr 浏览器扩展"

            前往[Keplr 官方网站](https://www.keplr.app/){target=_blank} 并点击“获取 Keplr 钱包”。

            <a href="/images/dashboard_keplr_step_2_1.png" target="_blank"><img src="/images/dashboard_keplr_step_2_1.png" style="width:500px; height:auto;"></a>

            为您的浏览器选择一个扩展程序。

            <a href="/images/dashboard_keplr_step_2_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_2.png" style="width:500px; height:auto;"></a>

            将所选扩展程序添加到您的浏览器中。

            === "Firefox"

                <a href="/images/dashboard_keplr_step_2_3.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3.png" style="width:500px; height:auto;"></a>

            === "Google Chrome"

                <a href="/images/dashboard_keplr_step_2_3_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3_2.png" style="width:500px; height:auto;"></a>

            安装扩展程序后，您应在浏览器右上角看到它。

            <a href="/images/keplr_extension.png" target="_blank"><img src="/images/keplr_extension.png" style="width:500px; height:auto;"></a>

            此时扩展程序已安装，但您的钱包和 Gonka 账户尚未创建。请继续下一步进行设置。

            打开 Keplr 浏览器扩展，点击“创建新钱包”。

            <a href="/images/dashboard_keplr_step_2_4.png" target="_blank"><img src="/images/dashboard_keplr_step_2_4.png" style="width:500px; height:auto;"></a>

            点击“通过 Google 登录”，然后按照提示使用 Gmail 登录。

            ??? note "关于钱包桥接兼容性的重要说明。如果您计划通过以太坊桥出售 Gonka 代币，请仔细阅读"
                当前桥接功能需要特定的账户设置。某些钱包可能允许您创建 Gonka 账户甚至导出私钥，但这并不总是意味着该账户能与桥接功能正常协作。如需使用桥接功能，请通过以下方式之一创建您的 Gonka 账户：

 
 
                - 使用 `inferenced` CLI 工具  
 
 
                - 在 Keplr 中使用“通过 Google 登录”流程

                这些是为需要以太坊桥接兼容性的用户推荐并支持的方式。

            <a href="/images/keplr_welcome_to_keplr.png" target="_blank"><img src="/images/keplr_welcome_to_keplr.png" style="width:500px; height:auto;"></a>

            设置您的钱包。请将密码安全保存。

            <a href="/images/keplr_set_up_your_wallet.png" target="_blank"><img src="/images/keplr_set_up_your_wallet.png" style="width:500px; height:auto;"></a>

            安全备份您的私钥。任何人获得您的私钥都可以访问您的资产。如果您丢失了对 Gmail 账户的访问权限，唯一能恢复钱包的方式就是使用私钥。请将私钥保存在安全的地方，切勿与任何人分享。

            <a href="/images/keplr_back_up_private_key.png" target="_blank"><img src="/images/keplr_back_up_private_key.png" style="width:500px; height:auto;"></a>

            在搜索栏中输入“Gonka”，然后选择 Gonka 链以将其添加到您的钱包中。

            <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:500px; height:auto;"></a>

            您已在 Keplr 中成功创建钱包。现在，请按照以下说明查找您的账户地址。

            <a href="/images/dashboard_keplr_step_2_8.png" target="_blank"><img src="/images/dashboard_keplr_step_2_8.png" style="width:500px; height:auto;"></a>

            打开 Keplr，导航并点击钱包中的“复制地址”。

            <a href="/images/keplr_copy_address_2.png" target="_blank"><img src="/images/keplr_copy_address_2.png" style="width:auto; height:337.5px;"></a>

            点击 Gonka 链旁边的复制按钮。

            <a href="/images/keplr_web_copy_gonka_address_2.png" target="_blank"><img src="/images/keplr_web_copy_gonka_address_2.png" style="width:auto; height:337.5px;"></a>

            您已成功复制了 Gonka 账户地址。您可以将此地址分享给任何要向您付款的人。分享地址是安全的。  
            若要在移动设备上访问您的钱包，请下载 Keplr 应用并使用注册时相同的登录方式登录。您的 Gonka 网络账户将自动出现在移动钱包应用中。

            ??? note "可选：如何在 Keplr 钱包中添加额外的 Gonka 账户 — 点击查看步骤"

                打开扩展程序，点击扩展窗口右上角的账户图标。

                <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>

                点击“添加钱包”按钮。

                <a href="/images/dashboard_ping_pub_3_5_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_2.png" style="width:auto; height:337.5px; display:block;"></a>

                点击“导入现有钱包”。

                <a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:450px; height:auto; display:block;"></a>

                点击“使用助记词或私钥”。

                <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:450px; height:auto;"></a>

                粘贴您的私钥。

                ??? note "关于钱包桥接兼容性的重要说明。如果您计划通过以太坊桥出售 Gonka 代币，请仔细阅读"
                    当前桥接功能需要特定的账户设置。某些钱包可能允许您创建 Gonka 账户甚至导出私钥，但这并不总是意味着该账户能与桥接功能正常协作。如需使用桥接功能，请通过以下方式之一创建您的 Gonka 账户：

 
 
                    - 使用 `inferenced` CLI 工具  
 
 
                    - 在 Keplr 中使用“通过 Google 登录”流程

                    这些是为需要以太坊桥接兼容性的用户推荐并支持的方式。

                <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:450px; height:auto;"></a>

                为您的钱包设置一个名称以便识别。

                <a href="/images/dashboard_ping_pub_3_5_5.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_5.png" style="width:450px; height:auto;"></a>

                确保已选择 Gonka 链。

                <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:500px; height:auto;"></a>

                完成 — 您的 Gonka 账户已成功导入 Keplr！

                <a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:450px; height:auto;"></a>

        === "Cosmostation 浏览器扩展"

 
 
            !!! note "重要提示：功能受限"
                此选项使用助记词创建账户，但不支持通过桥接进行交易。如需通过桥接进行交易，请改用 `inferenced` CLI 工具或 Keplr 钱包（选择“通过 Google 登录”路径）创建 Gonka 账户。

            获取 [Cosmostation 钱包浏览器扩展](https://cosmostation.io/products/application)。

            <a href="/images/1_cosmostation.png" target="_blank"><img src="/images/1_cosmostation.png" style="width:500px; height:auto;"></a>

            将扩展程序添加到您的浏览器中。

            <a href="/images/2_cosmostation_add_extention.png" target="_blank"><img src="/images/2_cosmostation_add_extention.png" style="width:500px; height:auto;"></a>

            选择“创建新钱包”。

            <a href="/images/5_cosmostation_create_a_new_wallet.png" target="_blank"><img src="/images/5_cosmostation_create_a_new_wallet.png" style="width:auto; height:337.5px;"></a>

            记下您的助记词。**切勿**将恢复短语分享给任何人。任何人拥有您的恢复短语即可完全控制您的资产。请时刻警惕钓鱼攻击，并安全备份该短语。

            <a href="/images/6_cosmostation_mnemonic.png" target="_blank"><img src="/images/6_cosmostation_mnemonic.png" style="width:auto; height:337.5px;"></a>

            按顺序完成测试题。检查已备份的助记词，并为每个数字按顺序选择正确的单词。

            <a href="/images/7_cosmostation_quiz.png" target="_blank"><img src="/images/7_cosmostation_quiz.png" style="width:auto; height:337.5px;"></a>

            设置账户名称。请输入一个账户名称。您可以随时更改账户名称。

            <a href="/images/8_cosmostation_account_name.png" target="_blank"><img src="/images/8_cosmostation_account_name.png" style="width:auto; height:337.5px;"></a>

            在右上角点击“所有网络”，然后选择 Gonka 链以将其添加到您的钱包中。

            <a href="/images/10_cosmostation_select_gonka_network.png" target="_blank"><img src="/images/10_cosmostation_select_gonka_network.png" style="width:auto; height:337.5px;"></a>

            完成！您的 Gonka 账户已成功创建。要复制可用于收款的地址，请点击余额上方的地址。该地址通常以 `gonka...` 开头。

            <a href="/images/11_cosmostation_gonka_created.png" target="_blank"><img src="/images/11_cosmostation_gonka_created.png" style="width:auto; height:337.5px;"></a>

            点击顶部的钱包名称，然后点击右上角的“管理”，再点击钱包名称。

            <a href="/images/12_cosmostation_click_name.png" target="_blank"><img src="/images/12_cosmostation_click_name.png" style="width:auto; height:337.5px;"></a>

            点击“查看私钥”。
            
            <a href="/images/13_cosmostation_view_private_key.png" target="_blank"><img src="/images/13_cosmostation_view_private_key.png" style="width:auto; height:337.5px;"></a>
            
            验证您的密码。
            
            <a href="/images/14_cosmostation_verify_password.png" target="_blank"><img src="/images/14_cosmostation_verify_password.png" style="width:auto; height:337.5px;"></a>
            
            从列表中选择“Gonka”。
            
            <a href="/images/15_cosmostation.png" target="_blank"><img src="/images/15_cosmostation.png" style="width:auto; height:337.5px;"></a>
               
            点击“Gonka”以查看私钥。复制您的私钥或助记词，并妥善保存（建议保存纸质副本）。
            
            <a href="/images/16_cosmostation_copy_private_key.png" target="_blank"><img src="/images/16_cosmostation_copy_private_key.png" style="width:auto; height:337.5px;"></a>

    === "我已有外部钱包"

        === "Keplr 手机应用"

            ??? note "关于钱包桥接兼容性的重要说明：如果您计划通过以太坊桥出售 Gonka 代币，请仔细阅读"
                目前桥接服务对账户设置有特定要求。某些钱包可能允许您创建 Gonka 账户甚至导出私钥，但这并不总意味着该账户能与桥接服务正常工作。如需使用桥接功能，请通过以下任一方式创建您的 Gonka 账户：

 
 
                - 使用 `inferenced` CLI 工具
 
 
                - 在 Keplr 中使用“通过 Google 登录”流程
                
                这些是为需要以太坊桥接兼容性的用户推荐并支持的方式。

            打开 Keplr 手机应用并登录您的钱包。点击左上角的菜单按钮。
            
            <a href="/images/keplr_mobile_start_screen.PNG" target="_blank"><img src="/images/keplr_mobile_start_screen.PNG" style="width:auto; height:337.5px;"></a>

            点击“添加/移除链”。

            <a href="/images/keplr_mobile_add_remove_chain.PNG" target="_blank"><img src="/images/keplr_mobile_add_remove_chain.PNG" style="width:auto; height:337.5px;"></a>

            在搜索栏中输入“Gonka”，然后选择 Gonka 链。

            <a href="/images/keplr_mobile_add_remove_chain_gonka.PNG" target="_blank"><img src="/images/keplr_mobile_add_remove_chain_gonka.PNG" style="width:auto; height:337.5px;"></a>

            在首页向下滚动，找到 Gonka 链并点击进入。

            <a href="/images/keplr_mobile_start_screen.PNG" target="_blank"><img src="/images/keplr_mobile_start_screen.PNG" style="width:auto; height:337.5px;"></a>

            在余额上方，您将看到您的 Gonka 账户地址。点击复制图标以复制完整的 Gonka 账户地址。

            <a href="/images/keplr_mobile_copy_address_gonka.PNG" target="_blank"><img src="/images/keplr_mobile_copy_address_gonka.PNG" style="width:auto; height:337.5px;"></a>

            您已成功复制您的 Gonka 账户地址。您可以将此地址分享给任何要向您付款的人。分享地址是安全的。

        === "Keplr 浏览器插件"

            ??? note "关于钱包桥接兼容性的重要说明：如果您计划通过以太坊桥出售 Gonka 代币，请仔细阅读"
                目前桥接服务对账户设置有特定要求。某些钱包可能允许您创建 Gonka 账户甚至导出私钥，但这并不总意味着该账户能与桥接服务正常工作。如需使用桥接功能，请通过以下任一方式创建您的 Gonka 账户：

 
 
                - 使用 `inferenced` CLI 工具
 
 
                - 在 Keplr 中使用“通过 Google 登录”流程
                
                这些是为需要以太坊桥接兼容性的用户推荐并支持的方式。

            安装浏览器扩展程序（如果已安装，请跳转至步骤 [“将 Gonka 网络添加到您的钱包”](#add-gonka-network-to-your-wallet)）。
            
            前往 [Keplr 官方网站](https://www.keplr.app/){target=_blank}，点击“获取 Keplr 钱包”。
            
            <a href="/images/dashboard_keplr_step_2_1.png" target="_blank"><img src="/images/dashboard_keplr_step_2_1.png" style="width:500px; height:auto;"></a>
            
            为您的浏览器选择相应的扩展程序。
            
            <a href="/images/dashboard_keplr_step_2_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_2.png" style="width:500px; height:auto;"></a>
            
            将所选扩展程序添加到您的浏览器中。
            
            === "Firefox"
            
                <a href="/images/dashboard_keplr_step_2_3.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3.png" style="width:500px; height:auto;"></a>
            
            === "Google Chrome"
            
                <a href="/images/dashboard_keplr_step_2_3_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3_2.png" style="width:500px; height:auto;"></a>

            安装扩展程序后，您应在浏览器的右上角看到它。
                
            <a href="/images/keplr_extension.png" target="_blank"><img src="/images/keplr_extension.png" style="width:500px; height:auto;"></a>

            此时扩展程序已安装，但尚未连接到您的钱包。  
            接下来，请打开扩展程序并登录您的钱包。登录后，请按照以下步骤继续完成设置。

 
 
            #### 将 Gonka 网络添加到您的钱包

            本指南将指导您如何将 Gonka 网络添加到钱包中，并说明您的 Gonka 账户将如何创建。  
            打开 Keplr 浏览器扩展程序，点击左上角的菜单按钮。

            <a href="/images/keplr_web_start.png" target="_blank"><img src="/images/keplr_web_start.png" style="width:auto; height:337.5px;"></a>

            点击“添加/移除链”。

            <a href="/images/keplr_web_add_remove_chains.png" target="_blank"><img src="/images/keplr_web_add_remove_chains.png" style="width:auto; height:337.5px;"></a>

            在搜索栏中输入“Gonka”，然后选择“Gonka”链。
                
            <a href="/images/keplr_web_add_remove_chains_gonka.png" target="_blank"><img src="/images/keplr_web_add_remove_chains_gonka.png" style="width:auto; height:337.5px;"></a>

            打开 Keplr，点击余额上方的“复制地址”按钮。

            <a href="/images/keplr_web_start.png" target="_blank"><img src="/images/keplr_web_start.png" style="width:auto; height:337.5px;"></a>

            点击 Gonka 链旁边的复制按钮。

            <a href="/images/keplr_web_copy_gonka_address_2.png" target="_blank"><img src="/images/keplr_web_copy_gonka_address_2.png" style="width:auto; height:337.5px;"></a>

            您已成功复制您的 Gonka 账户地址。您可以将此地址分享给任何要向您付款的人。分享地址是安全的。  
            若要在移动设备上访问您的钱包，请下载 Keplr 应用，并使用注册时相同的方式登录。您的 Gonka 网络账户将自动出现在手机钱包应用中。

=== "通过 `inferenced` CLI 工具"
    
    本指南介绍如何使用 inferenced CLI 工具创建 Gonka 网络账户。请下载 `inferenced` CLI 工具（适用于您系统的最新 `inferenced` 二进制文件请见 [此处](https://github.com/gonka-ai/gonka/releases)）。

 
 
    !!! note "什么是 inferenced CLI 工具？"
        `inferenced` CLI 工具是一个命令行接口工具，用于与 Gonka 网络进行交互。它是一个独立的可执行二进制文件，允许用户创建和管理 Gonka 账户、执行推理任务、上传模型以及通过脚本命令自动化各种操作。

    在创建账户之前，请先设置所需的环境变量：
    
 

 
 

 

```bash
    export ACCOUNT_NAME=<your-desired-account-name>
    export NODE_URL=<http://random-node-url>
 
 
 
 
```
    
 
    - 将 `<your-desired-account-name>` 替换为你选择的账户名称。

    ??? note "关于账户名称的注意事项"
        此名称不会被记录在链上——它仅存在于你的本地密钥存储中。  
        名称的唯一性是本地的：使用相同名称创建两个密钥将覆盖已存在的密钥（CLI 会发出警告）。若继续操作，原始密钥将永久丢失。强烈建议在执行此操作前备份你的公钥和私钥。

 
    - 将 `<http://random-node-url>` 替换为一个随机的节点 URL。你可以选择以下任一方式：
 
 
        - 使用下方列表中的一个**创世节点**。
 
 
        - 获取**当前活跃参与节点列表**，并从中选择一个随机节点。

    请务必记录下来，你将在下一步中用到它。

    ??? note "为什么要使用随机节点？"
        为了避免对创世节点的过度依赖并促进网络去中心化，Gonka 建议从当前纪元中随机选择一个活跃节点。这有助于改善网络负载分布，并增强对节点故障的容错能力。

    ??? note "如何选择节点 URL？"
        你可以随机选择任意节点——**无需**考虑其运行的模型。在此阶段，节点仅作为获取网络状态和广播交易的网关。所有节点都暴露相同的公共 API。

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
        或者，您可以从当前纪元中随机选择一名活跃参与者。请打开以下链接或运行相应命令，以获取活跃参与者列表及用于验证的加密证明：
        === "链接"
            [https://node2.gonka.ai:8443/v1/epochs/current/participants](https://node2.gonka.ai:8443/v1/epochs/current/participants)

        === "命令"
 

 
 

 

        ```bash
            curl https://node2.gonka.ai:8443/v1/epochs/current/participants
 
 
 
 
        ```
        
    下载 `inferenced` CLI 工具（适用于您系统的最新 `inferenced` 二进制文件[在此处](https://github.com/gonka-ai/gonka/releases)）。
        
    ??? note "在 Mac OS 上启用执行权限"
        在 macOS 上，下载 `inferenced` 二进制文件后，您可能需要手动启用执行权限。请按照以下步骤操作：
         
 
 
        1.	打开终端，导航到二进制文件所在目录。
        
 
 
        2.	运行以下命令以授予执行权限：
 
 
 
 
    ```
        chmod +x inferenced
 
 
 
 
    ```
 
        3.	尝试运行 `./inferenced --help` 以确保其正常工作。

 
        4.	如果尝试运行 `inferenced` 时看到安全警告，请前往“系统设置” → “隐私与安全”。

 
        5.	向下滚动到关于 `inferenced` 的警告，然后点击“仍然允许”。

你可以使用以下命令创建一个账户：
 

 
 

 

```bash
    ./inferenced keys add "$ACCOUNT_NAME"
 
 
 
 
```
        
    务必安全保存您的密码短语——您将来访问时会需要用到它。

此命令将执行以下操作：

 
    - 生成一个密钥对
 
    - 将其保存到 `~/.inference`
 
    - 返回您的账户地址、公钥和助记词（请同时妥善保存纸质副本！）
    
 

 
 

 

```bash
 
    - address: <your-account-address>
      name: ACCOUNT_NAME
      pubkey: '{"@type":"...","key":"..."}'
      type: local
 
 
 
 
```
            
    您将使用此账户地址来接收付款。这是您的公开地址，可以安全地分享。

要访问您的 Gonka 私钥，请导出私钥并妥善保存。以下命令将输出明文格式的私钥。私钥是一段保密代码，拥有它即可完全控制您的钱包及其内部资金。它用于确认（签名）交易，证明您是该钱包的所有者。

 
    - 谁拥有私钥，谁就控制钱包。
 
    - 一旦丢失，您将失去访问权限。
 
    - 若被他人获取，您的资金可能被全部转走。

因此，私钥必须始终安全存储，绝不能与任何人共享。
        
 

 
 

 

```bash
    ./inferenced keys export $ACCOUNT_NAME --unarmored-hex --unsafe
 
 
 
 
```
        
    要检索所有本地存储的账户列表，请执行以下命令：
 
 
 
 
```
     inferenced keys list [--keyring-backend test]
 
 
 
 
```

    现在，你可以通过导入导出的私钥将你的 Gonka 账户添加到 Keplr 钱包中。如果你希望 Keplr 显示与 `inferenced` CLI 创建的相同的 Gonka 地址，请不要导入助记词。根据钱包使用的派生路径不同，导入助记词可能会生成不同的 Gonka 地址。
