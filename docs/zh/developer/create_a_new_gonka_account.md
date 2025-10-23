# 创建新的 Gonka 账户

!!! note "免费推理"
    在网络初始阶段，由治理参数 GracePeriodEndEpoch（默认：90 个 epoch，约 90 天）控制，动态定价系统被绕过，所有推理成本设为零（直到约 2025 年 11 月 20 日）。

要开始使用 Gonka 网络，你首先需要创建一个 Gonka 账户。
有几种方法可以做到这一点：

- 通过 Keplr 钱包 — 设置更简单，支持 Google 连接（推荐）或助记词（有限：无桥接支持）。
- 通过 Leap 钱包 — 通过助记词简单设置，但也没有桥接支持。
- 通过 `inferenced` CLI 工具 — 完整功能，包括桥接交易。

=== "选项 1：通过 Keplr（外部钱包）"

    访问[Keplr 官方网站](https://www.keplr.app/){target=_blank}并点击"获取 Keplr 钱包"。
    
    <a href="/images/dashboard_keplr_step_2_1.png" target="_blank"><img src="/images/dashboard_keplr_step_2_1.png" style="width:500px; height:auto;"></a>
    
    为你的浏览器选择扩展程序。
    
    <a href="/images/dashboard_keplr_step_2_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_2.png" style="width:500px; height:auto;"></a>
    
    将选定的扩展程序添加到你的浏览器。
    
    === "Firefox"
    
        <a href="/images/dashboard_keplr_step_2_3.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3.png" style="width:500px; height:auto;"></a>
    
    === "Google Chrome"
    
        <a href="/images/dashboard_keplr_step_2_3_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3_2.png" style="width:500px; height:auto;"></a>
    
    点击"创建新钱包"。

    <a href="/images/dashboard_keplr_step_2_4.png" target="_blank"><img src="/images/dashboard_keplr_step_2_4.png" style="width:500px; height:auto;"></a>

    === "通过 Google 连接"

        点击"通过 Google 连接"。
    
        <a href="/images/keplr_welcome_to_keplr.png" target="_blank"><img src="/images/keplr_welcome_to_keplr.png" style="width:500px; height:auto;"></a>
    
        设置你的钱包。
    
        <a href="/images/keplr_set_up_your_wallet.png" target="_blank"><img src="/images/keplr_set_up_your_wallet.png" style="width:500px; height:auto;"></a>
    
        安全备份你的私钥。任何拥有你私钥的人都可以访问你的资产。如果你失去对 Gmail 账户的访问权限，恢复钱包的唯一方法是使用你的私钥。请将其保存在安全的地方。
    
        <a href="/images/keplr_back_up_private_key.png" target="_blank"><img src="/images/keplr_back_up_private_key.png" style="width:500px; height:auto;"></a>

    === "创建新恢复短语"

        !!! note "重要通知：功能有限"

            此选项使用助记词创建账户，不支持通过桥进行交易。如果你想通过桥执行交易，请使用选项 1：通过 Keplr（外部钱包，"通过 Google 连接"）或选项 3：通过 `inferenced` CLI 工具。
        
        点击"创建新恢复短语"
    
        <a href="/images/keplr_welcome_to_keplr.png" target="_blank"><img src="/images/keplr_welcome_to_keplr.png" style="width:500px; height:auto;"></a>

        不要与任何人分享你的恢复短语。任何拥有你恢复短语的人都可以完全控制你的资产。请时刻警惕网络钓鱼攻击。安全备份短语。没有恢复短语，你将永远无法恢复账户。
    
        <a href="/images/keplr_new_recovery_phrase.png" target="_blank"><img src="/images/keplr_new_recovery_phrase.png" style="width:500px; height:auto;"></a>
    
        验证你的恢复短语，创建钱包名称和密码。
    
        <a href="/images/keplr_verify_your_recovery_phrase.png" target="_blank"><img src="/images/keplr_verify_your_recovery_phrase.png" style="width:500px; height:auto;"></a>
    
        选择 Cosmos Hub 和 Ethereum。
        
        <a href="/images/dashboard_keplr_step_2_7.png" target="_blank"><img src="/images/dashboard_keplr_step_2_7.png" style="width:500px; height:auto;"></a>
            
        你的 Keplr 钱包已创建。
        
        <a href="/images/dashboard_keplr_step_2_8.png" target="_blank"><img src="/images/dashboard_keplr_step_2_8.png" style="width:500px; height:auto;"></a>
        
    从创世节点的 `inference_url` 列表中选择随机节点。

    - [http://185.216.21.98:8000](http://185.216.21.98:8000)
    - [http://36.189.234.197:18026](http://36.189.234.197:18026)
    - [http://36.189.234.237:17241](http://36.189.234.237:17241)
    - [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
    - [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
    - [http://node3.gonka.ai:8000](http://node3.gonka.ai:8000)
    - [http://47.236.26.199:8000](http://47.236.26.199:8000)
    - [http://47.236.19.22:18000](http://47.236.19.22:18000)
    - [http://gonka.spv.re:8000](http://gonka.spv.re:8000)
    
    ??? note "从活跃主机列表中选择随机节点的另一种完全去中心化方法"
        打开主机列表：[http://node2.gonka.ai:8000/v1/epochs/current/participants](http://node2.gonka.ai:8000/v1/epochs/current/participants)。
        
        从列表中选择任何活跃主机。
        
        复制他们的 `inference_url` 值。
        
    将 `inference_url` 粘贴到浏览器中以加载仪表盘。
    
    打开后，你将看到从主机节点直接流式传输的实时数据 — 包括网络统计、活跃工作负载和推理指标。
    
    在右上角，点击"连接钱包"开始。
    
    <a href="/images/dashboard_ping_pub_3_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_1.png" style="width:500px; height:auto;"></a>
    
    选择 Keplr 并点击连接。
    
    <a href="/images/dashboard_ping_pub_3_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_2.png" style="width:500px; height:auto;"></a>
    
    你将看到提示将自定义 Gonka 链添加到钱包。批准并添加 Gonka 链。
    
    <a href="/images/dashboard_ping_pub_3_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_3.png" style="width:500px; height:auto;"></a>
        
    完成！你的 Gonka 开发者账户已成功创建。
    
    <a href="/images/dashboard_ping_pub_3_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_4.png" style="width:500px; height:auto;"></a>

    打开 Keplr，导航到钱包中的"复制地址"，点击"复制地址"，并分享复制的地址 — 这是公钥，所以是安全的。
    
    <a href="/images/keplr_copy_address.png" target="_blank"><img src="/images/keplr_copy_address.png" style="width:auto; height:337.5px;"></a>

    点击扩展程序窗口右上角的账户图标。
            
    <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>

    导航到三个点并点击"查看私钥"。

    <a href="/images/keplr_view_private_key.png" target="_blank"><img src="/images/keplr_view_private_key.png" style="width:auto; height:337.5px;"></a>

    输入你的密码。
   
    <a href="/images/keplr_enter_your_password.png" target="_blank"><img src="/images/keplr_enter_your_password.png" style="width:auto; height:337.5px;"></a>

    复制你的私钥并安全存储（建议硬拷贝）。   

    ??? note "可选：如何在 Keplr 钱包中添加额外的 Gonka 账户 — 点击查看步骤"

        打开扩展程序并点击扩展程序窗口右上角的账户图标。
            
        <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>
            
        点击"添加钱包"按钮。
            
        <a href="/images/dashboard_ping_pub_3_5_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_2.png" style="width:auto; height:337.5px; display:block;"></a>
            
        点击"导入现有钱包"。
            
        <a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:450px; height:auto; display:block;"></a>
            
        点击"使用恢复短语或私钥"
    
        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:450px; height:auto;"></a>
    
        粘贴你的私钥。你可以导入使用恢复（助记词/种子）短语创建的账户。但是，桥功能将受到限制，因为桥需要直接访问原始私钥来签名交易并确保与以太坊的完全互操作性。
    
        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:450px; height:auto;"></a>
            
        为你的钱包起一个名称以便参考。
            
        <a href="/images/dashboard_ping_pub_3_5_5.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_5.png" style="width:450px; height:auto;"></a>
            
        选择 Cosmos Hub 和 Ethereum。
    
        <a href="/images/dashboard_ping_pub_3_5_6.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_6.png" style="width:450px; height:auto; display:block;"></a>
            
        完成 — 你的 Gonka 账户已成功导入 Keplr！
            
        <a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:450px; height:auto;"></a>

=== "选项 2：通过 Leap（外部钱包）"

    !!! note "重要通知：功能有限"

        此选项使用助记词创建账户，不支持通过桥进行交易。如果你想通过桥执行交易，请使用选项 1：通过 Keplr（外部钱包，"通过 Google 连接"）或选项 3：通过 `inferenced` CLI 工具。
    
    访问[Leap 官方网站](https://www.leapwallet.io/){target=_blank}并点击"下载 Leap"。
    
    <a href="/images/dashboard_leap_step_2_1.png" target="_blank"><img src="/images/dashboard_leap_step_2_1.png" style="width:500px; height:auto;"></a>
    
    将选定的扩展程序添加到你的浏览器。
    
    <a href="/images/dashboard_leap_step_2_2.png" target="_blank"><img src="/images/dashboard_leap_step_2_2.png" style="width:500px; height:auto;"></a>
    
    点击"创建新钱包"。
    
    <a href="/images/dashboard_leap_step_2_3.png" target="_blank"><img src="/images/dashboard_leap_step_2_3.png" style="width:500px; height:auto;"></a>

    保存你的秘密恢复短语。写下这些单词，你的秘密恢复短语是恢复钱包和资金的唯一方法！

    <a href="/images/leap_your_secret_recovery_phrase.png" target="_blank"><img src="/images/leap_your_secret_recovery_phrase.png" style="width:500px; height:auto;"></a>

    选择密码来保护并锁定你的钱包。同意条款和条件。

    <a href="/images/leap_create_your_password.png" target="_blank"><img src="/images/leap_create_your_password.png" style="width:500px; height:auto;"></a>

    你的 Leap 钱包已创建。

    <a href="/images/leap_you_are_all_set.png" target="_blank"><img src="/images/leap_you_are_all_set.png" style="width:500px; height:auto;"></a>

    从创世节点的 `inference_url` 列表中选择随机节点
    
    - [http://185.216.21.98:8000](http://185.216.21.98:8000)
    - [http://69.19.136.233:8000](http://69.19.136.233:8000)
    - [http://36.189.234.197:18026](http://36.189.234.197:18026)
    - [http://36.189.234.237:17241](http://36.189.234.237:17241)
    - [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
    - [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
    - [http://node3.gonka.ai:8000](http://node3.gonka.ai:8000)
    - [http://47.236.26.199:8000](http://47.236.26.199:8000)
    - [http://47.236.19.22:18000](http://47.236.19.22:18000)
    - [http://gonka.spv.re:8000](http://gonka.spv.re:8000)
    
    ??? note "从活跃主机列表中选择随机节点的另一种完全去中心化方法"
        打开主机列表：[http://node2.gonka.ai:8000/v1/epochs/current/participants](http://node2.gonka.ai:8000/v1/epochs/current/participants)
        
        从列表中选择任何活跃主机。
        
        复制他们的 `inference_url` 值。
        
    将 `inference_url` 粘贴到浏览器中以加载仪表盘。
    
    打开后，你将看到从主机节点直接流式传输的实时数据 — 包括网络统计、活跃工作负载和推理指标。
    
    在右上角，点击"连接钱包"开始。
    
    <a href="/images/dashboard_ping_pub_3_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_1.png" style="width:500px; height:auto;"></a>
    
    选择 Leap 并点击连接。
    
    <a href="/images/dashboard_ping_pub_3_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_2.png" style="width:500px; height:auto;"></a>
    
    你将看到提示将自定义 Gonka 链添加到钱包。批准并添加 Gonka 链。
    
    <a href="/images/leap_add_network.png" target="_blank"><img src="/images/leap_add_network.png" style="width:500px; height:auto;"></a>

    完成！你的 Gonka 开发者账户已成功创建。

    <a href="/images/leap_created_gonka_account.png" target="_blank"><img src="/images/leap_created_gonka_account.png" style="width:500px; height:auto;"></a>

    打开扩展程序并导航到左上角的菜单。
            
    <a href="/images/leap_left_menu.png" target="_blank"><img src="/images/leap_left_menu.png" style="width:auto; height:337.5px;"></a>

    点击"安全与隐私"。

    <a href="/images/leap_security_privacy.png" target="_blank"><img src="/images/leap_security_privacy.png" style="width:auto; height:337.5px;"></a>

    点击"显示私钥"。
   
    <a href="/images/leap_show_private_key.png" target="_blank"><img src="/images/leap_show_private_key.png" style="width:auto; height:337.5px;"></a>

    输入你的密码。
    
    <a href="/images/leap_enter_password.png" target="_blank"><img src="/images/leap_enter_password.png" style="width:auto; height:337.5px;"></a>

    复制你的私钥并安全存储（建议硬拷贝）。   

    ??? note "可选：如何向 Leap 钱包添加额外的 Gonka 账户 — 点击查看步骤"            
        打开扩展程序并点击扩展程序窗口顶部中央的青蛙图标和钱包名称按钮。
            
        <a href="/images/dashboard_leap_step_3_5_1.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_1.png" style="width:250px; height:auto;"></a>
            
        点击"创建/导入钱包"按钮。
            
        <a href="/images/dashboard_leap_step_3_5_2.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_2.png" style="width:250px; height:auto;"></a>
            
        选择"使用私钥导入"。你可以导入使用恢复（助记词/种子）短语创建的账户。但是，桥功能将受到限制，因为桥需要直接访问原始私钥来签名交易并确保与以太坊的完全互操作性。
            
        <a href="/images/dashboard_leap_step_3_5_3.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_3.png" style="width:250px; height:auto;"></a>
    
        粘贴你的私钥或恢复（助记词/种子）短语。
    
        <a href="/images/dashboard_leap_step_3_5_3.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_4_private_key.png" style="width:250px; height:auto;"></a>
            
        完成 — 你的 Gonka 账户已成功导入 Leap 钱包（点击顶部中央的青蛙图标和钱包名称按钮可在钱包间切换）。
            
        <a href="/images/dashboard_leap_step_3_5_4.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_4.png" style="width:250px; height:auto;"></a>

=== "选项 3：通过 `inferenced` CLI 工具"
    下载 `inferenced` CLI 工具（最新 `inferenced` 二进制文件[在此](https://github.com/gonka-ai/gonka/releases)）。
    
    
    ??? note "在 Mac OS 上启用执行"
        在 Mac OS 上，下载 inferenced 二进制文件后，你可能需要手动启用执行权限。请按照以下步骤操作：
        
        1.	打开终端并导航到二进制文件所在的目录。
        
        2.	运行以下命令授予执行权限：
        ```
        chmod +x inferenced
        ```
        3.	尝试运行 `./inferenced --help` 以确保它正常工作。
            
        4.	如果在尝试运行 `inferenced` 时看到安全警告，请转到系统设置 → 隐私与安全。
        
        5.	向下滚动到关于 `inferenced` 的警告并点击"仍要允许"。
    
    你可以使用以下命令创建账户：
    ```bash
    ./inferenced create-client $ACCOUNT_NAME \
      --node-address $NODE_URL
    ```
    
    确保安全保存你的密码短语 — 将来访问时需要。
    
    此命令创建新账户，安全地将其密钥存储在 `~/.inference` 目录中，并返回你的新账户地址：
    
    ```bash
    - address: <your-account-address>
      name: ACCOUNT_NAME
      pubkey: '{"@type":"...","key":"..."}'
      type: local
    ```
    
    账户存储你的余额，将其添加到环境变量 `GONKA_ADDRESS` 或 `.env` 文件中。
    
    ```bash
    export GONKA_ADDRESS=<your-account-address>
    ```
    
    将私钥添加到环境变量
    
    如果你想执行请求：
    
    导出你的私钥（仅用于演示/测试）。
    ```bash
    ./inferenced keys export $ACCOUNT_NAME --unarmored-hex --unsafe
    ```
    
    此命令输出纯文本私钥。
    
    将其添加到环境变量 `GONKA_PRIVATE_KEY` 或 `.env` 文件中。
    ```bash
    export GONKA_PRIVATE_KEY=<your-private-key>
    ```

一旦你的账户准备就绪，你可以[开始使用网络](https://gonka.ai/developer/quickstart/)。

**需要帮助？** 加入我们的[Discord 服务器](https://discord.com/invite/RADwCT2U6R)获取一般咨询、技术问题或安全担忧的帮助。
