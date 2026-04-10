# 创建新的 Gonka 账户

要开始使用 Gonka 网络，你首先需要创建一个 Gonka 账户。
有几种方法可以做到这一点：

- 通过外部钱包（Keplr）
- 通过 `inferenced` CLI 工具

!!! note "关于钱包桥接兼容性的重要说明。如您计划未来通过以太坊桥出售 Gonka 代币，请务必仔细阅读。"
    以太坊桥（Ethereum bridge）是一种系统，允许你在以太坊与另一条区块链之间安全地转移资产或数据，其原理是在一条链上锁定资产，同时在另一条链上铸造或释放等值资产。简而言之，如果你希望在以太坊生态中出售、交易或使用来自其他链的代币，就需要这样的机制。目前，Gonka 尚未接入以太坊桥。未来如需部署此类桥接功能，必须经过链上治理批准。若链上治理通过以太坊桥的上线，预计仅支持拥有原始私钥（raw private key）的账户参与。

    符合条件（可以导出/使用原始私钥）：

    - 通过 `inferenced` CLI 工具创建的账户
    - 通过 Keplr 中“Connect with Google”流程创建的账户

    不符合条件（无法导出私钥）：

    - 通过助记词创建的 Keplr 钱包。Keplr 不支持导出私钥，因此如果未来需要桥接兼容性，请避免使用助记词方式在该钱包中创建账户。

=== "外部钱包"

    === "我没有外部钱包"

        === "Keplr 移动应用"

            前往 [the official Keplr website](https://www.keplr.app/){target=_blank} 点击 “Get Keplr wallet”（获取 Keplr 钱包）。
            
            <a href="/images/keplr_mobile_website_main.PNG" target="_blank"><img src="/images/keplr_mobile_website_main.PNG" style="width:auto; height:337.5px;"></a>
            
            向下滚动至移动应用（Mobile App）部分，选择你的操作系统并下载应用程序。
            
            <a href="/images/keplr_mobile_website_mobileos.PNG" target="_blank"><img src="/images/keplr_mobile_website_mobileos.PNG" style="width:auto; height:337.5px;"></a>

             打开应用，点击“Create a new wallet”（创建新钱包）。
            
            <a href="/images/keplr_mobile_create_new_wallet.PNG" target="_blank"><img src="/images/keplr_mobile_create_new_wallet.PNG" style="width:auto; height:337.5px;"></a>
            
            点击 “Connect with Google”，按照提示通过 Gmail 登录。

            ??? note "关于钱包桥接兼容性的重要说明。如您计划未来通过以太坊桥出售 Gonka 代币，请务必仔细阅读。"
                以太坊桥（Ethereum bridge）是一种系统，允许你在以太坊与另一条区块链之间安全地转移资产或数据，其原理是在一条链上锁定资产，同时在另一条链上铸造或释放等值资产。简而言之，如果你希望在以太坊生态中出售、交易或使用来自其他链的代币，就需要这样的机制。目前，Gonka 尚未接入以太坊桥。未来如需部署此类桥接功能，必须经过链上治理批准。若链上治理通过以太坊桥的上线，预计仅支持拥有原始私钥（raw private key）的账户参与。
                
                符合条件（可以导出/使用原始私钥）：
                
                - 通过 `inferenced` CLI 工具创建的账户
                - 通过 Keplr 中“Connect with Google”流程创建的账户

                不符合条件（无法导出私钥）：
                
                - 通过助记词创建的 Keplr 钱包。Keplr 不支持导出私钥，因此如果未来需要桥接兼容性，请避免使用助记词方式在该钱包中创建账户。
                
            <a href="/images/keplr_mobile_recovery_phrase.PNG" target="_blank"><img src="/images/keplr_mobile_recovery_phrase.PNG" style="width:auto; height:337.5px;"></a>
                
            请安全备份你的私钥。任何获取你私钥的人都可以访问你的资产。如果你无法访问 Gmail 账户，恢复钱包的唯一方式就是使用你的私钥。请将私钥存储在安全可靠的地方，切勿与任何人分享。
                
            <a href="/images/keplr_mobile_google_private_key_2.PNG" target="_blank"><img src="/images/keplr_mobile_google_private_key_2.PNG" style="width:auto; height:337.5px;"></a>
            
            在搜索栏中输入 “Gonka”，并选择 Gonka 链将其添加到你的钱包中。

            <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:auto; height:337.5px;"></a>

            你已成功在 Keplr 中创建钱包。接下来，请按照以下步骤查找你的账户地址。

            <a href="/images/keplr_mobile_all_set.PNG" target="_blank"><img src="/images/keplr_mobile_all_set.PNG" style="width:auto; height:337.5px;"></a>

            在首页界面，向下滚动至 Gonka 链并点击进入。

            <a href="/images/keplr_mobile_start_screen.PNG" target="_blank"><img src="/images/keplr_mobile_start_screen.PNG" style="width:auto; height:337.5px;"></a>

            在余额上方，你将看到你的 Gonka 账户地址。点击复制图标以复制完整的 Gonka 账户地址。

            <a href="/images/keplr_mobile_address.PNG" target="_blank"><img src="/images/keplr_mobile_address.PNG" style="width:auto; height:337.5px;"></a>

            你已复制 Gonka 账户地址。你可以将其分享给任何需要向你转账的人，分享地址是安全的。
       
        === "Keplr 浏览器扩展"

            前往 [the official Keplr website](https://www.keplr.app/){target=_blank} 点击 “Get Keplr wallet”（获取 Keplr 钱包）。
            
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

            打开 Keplr 浏览器扩展，点击 “Create a new wallet”（创建新钱包）。
            
            <a href="/images/dashboard_keplr_step_2_4.png" target="_blank"><img src="/images/dashboard_keplr_step_2_4.png" style="width:500px; height:auto;"></a>
            
            点击 “Connect with Google”，按照提示通过 Gmail 登录。

            ??? note "关于钱包桥接兼容性的重要说明。如您计划未来通过以太坊桥出售 Gonka 代币，请务必仔细阅读"
                以太坊桥（Ethereum bridge）是一种系统，允许你在以太坊与另一条区块链之间安全地转移资产或数据，其原理是在一条链上锁定资产，同时在另一条链上铸造或释放等值资产。简而言之，如果你希望在以太坊生态中出售、交易或使用来自其他链的代币，就需要这样的机制。目前，Gonka 尚未接入以太坊桥。未来如需部署此类桥接功能，必须经过链上治理批准。若链上治理通过以太坊桥的上线，预计仅支持拥有原始私钥（raw private key）的账户参与。
                
                符合条件（可以导出/使用原始私钥）：
                
                - 通过 `inferenced` CLI 工具创建的账户
                - 通过 Keplr 中“Connect with Google”流程创建的账户
                            
                不符合条件（无法导出私钥）：
                
                - 通过助记词创建的 Keplr 钱包。Keplr 不支持导出私钥，因此如果未来需要桥接兼容性，请避免使用助记词方式在该钱包中创建账户。
                
            <a href="/images/keplr_welcome_to_keplr.png" target="_blank"><img src="/images/keplr_welcome_to_keplr.png" style="width:500px; height:auto;"></a>
                
            设置你的钱包。请将密码妥善保存在安全的位置。
                
            <a href="/images/keplr_set_up_your_wallet.png" target="_blank"><img src="/images/keplr_set_up_your_wallet.png" style="width:500px; height:auto;"></a>

            请安全备份你的私钥。任何获取你私钥的人都可以访问你的资产。如果你无法访问 Gmail 账户，恢复钱包的唯一方式就是使用你的私钥。请将私钥存储在安全可靠的地方，切勿与任何人分享。
            
            <a href="/images/keplr_back_up_private_key.png" target="_blank"><img src="/images/keplr_back_up_private_key.png" style="width:500px; height:auto;"></a>

            在搜索栏中输入 “Gonka”，并选择 Gonka 链将其添加到你的钱包中。

            <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:500px; height:auto;"></a>

            你已成功在 Keplr 中创建钱包。接下来，请按照以下步骤查找你的账户地址。

            <a href="/images/dashboard_keplr_step_2_8.png" target="_blank"><img src="/images/dashboard_keplr_step_2_8.png" style="width:500px; height:auto;"></a>

            打开 Keplr，进入钱包界面并点击 “Copy Address”（复制地址）。

            <a href="/images/keplr_copy_address_2.png" target="_blank"><img src="/images/keplr_copy_address_2.png" style="width:auto; height:337.5px;"></a>

            点击 Gonka 链旁边的复制按钮。

            <a href="/images/keplr_web_copy_gonka_address_2.png" target="_blank"><img src="/images/keplr_web_copy_gonka_address_2.png" style="width:auto; height:337.5px;"></a>

            你已复制 Gonka 账户地址。你可以将其分享给任何需要向你转账的人，分享地址是安全的。
            如果你需要在移动设备上访问钱包，请下载 Keplr 应用，并使用注册时相同的方式登录。你的 Gonka Network 账户将自动显示在移动端钱包中。

            ??? note "可选：如何在 Keplr 钱包中添加额外的 Gonka 账户 — 点击查看步"

                打开扩展，在窗口右上角点击账户图标。
                    
                <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>
                    
                点击 “Add wallet”（添加钱包）按钮。
                    
                <a href="/images/dashboard_ping_pub_3_5_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_2.png" style="width:auto; height:337.5px; display:block;"></a>
                    
                点击 “Import an Existing Wallet”（导入已有钱包）。
                    
                <a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:450px; height:auto; display:block;"></a>
                    
               点击 “Use recovery phrase or private key”（使用助记词或私钥）。
            
                <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:450px; height:auto;"></a>
            
                粘贴你的私钥。

                ???note "关于钱包桥接兼容性的重要说明。如您计划未来通过以太坊桥出售 Gonka 代币，请务必仔细阅读。"
                    以太坊桥（Ethereum bridge）是一种系统，允许你在以太坊与另一条区块链之间安全地转移资产或数据，其原理是在一条链上锁定资产，同时在另一条链上铸造或释放等值资产。简而言之，如果你希望在以太坊生态中出售、交易或使用来自其他链的代币，就需要这样的机制。目前，Gonka 尚未接入以太坊桥。未来如需部署此类桥接功能，必须经过链上治理批准。若链上治理通过以太坊桥的上线，预计仅支持拥有原始私钥（raw private key）的账户参与。
                    
                    符合条件（可以导出/使用原始私钥）：
                    
                    - 通过 `inferenced` CLI 工具创建的账户
                    - 通过 Keplr 中“Connect with Google”流程创建的账户
                
                    不符合条件（无法导出私钥）：
                    
                    - 通过助记词创建的 Keplr 钱包。Keplr 不支持导出私钥，因此如果未来需要桥接兼容性，请避免使用助记词方式在该钱包中创建账户。
            
                <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:450px; height:auto;"></a>
                    
                为你的钱包设置一个名称，方便后续识别。
                    
                <a href="/images/dashboard_ping_pub_3_5_5.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_5.png" style="width:450px; height:auto;"></a>
                    
                请确保已选择 Gonka 链。

                <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:500px; height:auto;"></a>

                完成 —— 你的 Gonka 账户已成功导入到 Keplr！

    === "我已有外部钱包"

        === "Keplr 移动应用"

            ??? note "关于钱包桥接兼容性的重要说明。如您计划未来通过以太坊桥出售 Gonka 代币，请务必仔细阅读。"
                以太坊桥（Ethereum bridge）是一种系统，允许你在以太坊与另一条区块链之间安全地转移资产或数据，其原理是在一条链上锁定资产，同时在另一条链上铸造或释放等值资产。简而言之，如果你希望在以太坊生态中出售、交易或使用来自其他链的代币，就需要这样的机制。目前，Gonka 尚未接入以太坊桥。未来如需部署此类桥接功能，必须经过链上治理批准。若链上治理通过以太坊桥的上线，预计仅支持拥有原始私钥（raw private key）的账户参与。
                
                符合条件（可以导出/使用原始私钥）：
                
                - 通过 `inferenced` CLI 工具创建的账户
                - 通过 Keplr 中“Connect with Google”流程创建的账户

                不符合条件（无法导出私钥）：

                - 通过助记词创建的 Keplr 钱包。Keplr 不支持导出私钥，因此如果未来需要桥接兼容性，请避免使用助记词方式在该钱包中创建账户。

            如果你尚未安装浏览器扩展，请先进行安装（如果已安装扩展，可直接跳转至步骤 [“将 Gonka 网络添加到钱包”](https://gonka.ai/developer/create_a_new_gonka_account/#add-gonka-network-to-your-wallet_1).
            
            前往 [ Keplr website 官网](https://www.keplr.app/){target=_blank} 点击 “Get Keplr wallet”（获取 Keplr 钱包）。
            
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

            点击 “Add/Remove chains”（添加/移除链）。

            <a href="/images/keplr_web_add_remove_chains.png" target="_blank"><img src="/images/keplr_web_add_remove_chains.png" style="width:auto; height:337.5px;"></a>

            在搜索栏中输入 “Gonka”，并选择 “Gonka” 链。
                
            <a href="/images/keplr_web_add_remove_chains_gonka.png" target="_blank"><img src="/images/keplr_web_add_remove_chains_gonka.png" style="width:auto; height:337.5px;"></a>

            打开 Keplr，在余额上方点击 “Copy Address”（复制地址）按钮。

            <a href="/images/keplr_web_start.png" target="_blank"><img src="/images/keplr_web_start.png" style="width:auto; height:337.5px;"></a>

            点击 Gonka 链旁边的复制按钮。

            <a href="/images/keplr_web_copy_gonka_address_2.png" target="_blank"><img src="/images/keplr_web_copy_gonka_address_2.png" style="width:auto; height:337.5px;"></a>

            你已复制 Gonka 账户地址。你可以将其分享给任何需要向你转账的人，分享地址是安全的。
            如果你需要在移动设备上访问钱包，请下载 Keplr 应用，并使用注册时相同的方式登录。你的 Gonka Network 账户将自动显示在移动端钱包中。
            
=== "通过 `inferenced` CLI 工具"

    本指南介绍如何使用 inferenced CLI 工具创建 Gonka Network 账户。请下载`inferenced` CLI 工具（适用于你系统的最新版本可在此获取：https://github.com/gonka-ai/gonka/releases）。

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
        - 使用下方列表中的任一 创世节点（genesis nodes）
        - 获取 当前活跃节点列表，并随机选择一个节点

    请务必记录该 URL，你将在下一步中用到。

    ??? note "为什么要选择随机节点？"
        为了避免对创世节点的过度依赖，并促进去中心化，Gonka 建议从当前周期（epoch）的活跃节点中随机选择一个节点。这有助于提升网络负载分布的均衡性，并增强对节点故障的抗性。

    ??? note "如何选择 Node URL？"
        你可以随机选择任意节点——无需考虑其运行的模型类型。在当前阶段，该节点仅作为获取网络状态和广播交易的网关使用。所有节点都提供相同的公共 API。

    === "创世节点（Genesis nodes）"
        将 `NODE_URL` 设置为以下任一创世节点：
        ```bash title="Genesis Node List"
        http://36.189.234.237:17241
        http://node1.gonka.ai:8000
        http://node2.gonka.ai:8000
        http://47.236.26.199:8000
        http://47.236.19.22:18000
        http://gonka.spv.re:8000
        ```
                
    === "当前活跃参与者列表"
        或者，你也可以从当前 epoch 的活跃参与者中随机选择一个节点。打开以下链接或运行命令，以获取活跃参与者列表及其用于验证的加密证明：
        === "链接"
            [http://node2.gonka.ai:8000/v1/epochs/current/participants](http://node2.gonka.ai:8000/v1/epochs/current/participants)

        === "命令"
            ```bash
            curl http://node2.gonka.ai:8000/v1/epochs/current/participants
            ```
        
    下载 `inferenced` CLI 工具（适用于你系统的最新版本可在 [这里](https://github.com/gonka-ai/gonka/releases))。获取
        
    ??? note "在 Mac OS 上启用执行权限"
        在 Mac OS 上，下载 `inferenced` 二进制文件后，你可能需要手动启用执行权限。请按照以下步骤操作：

                 
        1.  打开终端，并进入该二进制文件所在目录。
        
        2.  运行以下命令授予执行权限：
        ```
        chmod +x inferenced
        ```
        3.	运行 `./inferenced --help` 以确认程序可以正常执行。
            
        4.	如果在运行 `inferenced`时出现安全提示，请前往「系统设置 → 隐私与安全性」。
            
        5.	向下滚动找到关于 `inferenced` 提示，并点击 “仍要允许（Allow Anyway）”。
        
    你可以使用以下命令创建账户：
    ```bash
    ./inferenced create-client $ACCOUNT_NAME \
         --node-address $NODE_URL
    ```
        
    请务必妥善保存你的口令（passphrase）——后续访问时将会用到。
        
    该命令将会：
        
    - 生成一对密钥（keypair）
    - 将其保存至 `~/.inference`
    - 返回你的账户地址、公钥以及助记词（请务必安全保存，建议同时保留纸质备份）

    ```bash
    - address: <your-account-address>
      name: ACCOUNT_NAME
      pubkey: '{"@type":"...","key":"..."}'
      type: local
    ```
            
    你将使用该账户地址接收转账。这是你的公开地址，可以安全分享。
            
    如需获取你的 Gonka 私钥，请导出私钥并妥善保存。以下命令将输出明文私钥。私钥是一串用于完全控制钱包及其资产的秘密代码，用于确认（签名）交易并证明你是该钱包的拥有者。
        
    - 拥有私钥的人即拥有该钱包的控制权
    - 一旦丢失，将无法恢复访问
    - 一旦被他人获取，资产可能被转走

    因此，私钥必须始终安全存储，切勿与任何人分享。
        
    ```bash
    ./inferenced keys export $ACCOUNT_NAME --unarmored-hex --unsafe
    ```
        
    如需查看本地存储的所有账户列表，请执行以下命令：
    ```
     inferenced keys list [--keyring-backend test]
    ```
    现在，你可以通过导入公钥和私钥，将你的 Gonka 账户添加到 Keplr 等钱包中。
