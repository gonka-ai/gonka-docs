---
name: index.md
---

# 开发者快速开始

!!! note "免费推理"
    在网络初始阶段，由治理参数 `GracePeriodEndEpoch` 控制，拟定默认值为 90 个 epoch（约 90 天），动态定价系统将被暂时跳过，所有推理费用设为 0（预计至 2025 年 11 月 20 日左右）。

本指南介绍如何在 Gonka 中创建开发者账户并使用 Gonka API 提交推理请求。

??? note "Gonka 与传统 AI API 的区别"
    Gonka 不仅仅是另一个 AI API — 它是一个用于可证明推理的加密协议。通过消除中心化身份，Gonka 移除了困扰基于 SaaS 的 AI 服务的传统单点故障。以下对比表帮助你理解传统 AI API 与 Gonka API 之间的差异。
    
    | **方面**                         | **传统 AI API** <br> *(OpenAI、Anthropic 等)* | **Gonka API** |
    |-----------------------------------|---------------------------------------------------------|---------------|
    | **模型来源与可验证输出** | 模型由提供商托管和版本控制，但无法加密验证哪个模型实际产生了给定输出。无法证明模型未被切换、在后台微调或对你进行 A/B 测试。 | 每个推理请求和响应都可以加密链接到特定的模型哈希和执行环境。这实现了可验证的来源 — 任何人都可以证明特定模型版本生成了特定输出。 |
    | **抗审查性**         | 所有访问都集中控制 — 提供商可以随时限制或终止账户。这包括地理、政治或商业政策的执行。 | 推理请求通过去中心化网络签名和广播。只要你持有私钥并连接到节点，就可以运行推理。系统设计为不可审查，除非通过透明、协议级共识应用限制。 |
    | **可审计性与透明度**   | 日志记录、计费和使用跟踪完全由 API 提供商控制。用户无法独立验证自己的使用情况或检查定价、延迟或错误的处理方式。 | 每次交互都经过签名和时间戳，实现独立的审计跟踪。你可以证明推理何时以及如何发生、使用了哪个模型、结果是否被更改，并确保争议可以公开解决。 |
    | **透明的代币经济学**       | 计费费率对计算定价、模型成本或系统负载的洞察有限。 | 代币经济学在链上或协议定义，意味着定价机制透明且可检查。用户将 GNK 转换为 AI 代币，具有可预测、可追踪的交换逻辑，实现推理成本的清晰预测和供需驱动的经济学。 |

---

## 1. 定义变量

在创建账户之前，设置所需的环境变量：

```bash
export ACCOUNT_NAME=<your-desired-account-name>
export NODE_URL=<http://random-node-url>
```

- 将 `<your-desired-account-name>` 替换为你选择的账户名称。

??? note "关于账户名称的须知"
    此名称不会记录在链上 — 它仅存在于你的本地密钥存储中。
    唯一性是本地的：创建两个同名密钥将覆盖现有密钥（CLI 会警告）。如果继续，原始密钥将永久丢失。强烈建议在执行此操作之前备份你的公钥和私钥。

- 将 `<http://random-node-url>` 替换为随机节点 URL。你可以：
    - 使用下面列表中的**创世节点**之一。
    - 获取**当前活跃参与者列表**并选择随机节点。

不要忘记记录下来，下一步会需要。

??? note "为什么选择随机节点？"
    为避免过度依赖创世节点并鼓励去中心化，Gonka 建议从当前 epoch 中选择随机活跃节点。这改善了网络负载分配和对节点故障的弹性。

??? note "如何选择节点 URL？"
    你可以随机选择任何节点 — 你**不需要**考虑它运行哪个模型。此时，节点纯粹用作获取网络状态和广播交易的网关。所有节点都暴露相同的公共 API。

=== "创世节点"
    将 `NODE_URL` 设置为以下创世节点之一：
    ```bash title="创世节点列表"
    http://185.216.21.98:8000
    http://36.189.234.197:18026
    http://36.189.234.237:17241
    http://node1.gonka.ai:8000
    http://node2.gonka.ai:8000
    http://node3.gonka.ai:8000
    http://47.236.26.199:8000
    http://47.236.19.22:18000
    http://gonka.spv.re:8000
    ```
    
=== "当前活跃参与者列表"
    或者，你可以从当前 epoch 中选择随机活跃参与者。打开链接或运行以下命令获取活跃参与者列表以及用于验证的加密证明：
    === "链接"
        [http://node2.gonka.ai:8000/v1/epochs/current/participants](http://node2.gonka.ai:8000/v1/epochs/current/participants)

    === "命令"
        ```bash
        curl http://node2.gonka.ai:8000/v1/epochs/current/participants
        ```
    
## 2. 创建账户

=== "选项 1：通过 `inferenced` CLI 工具"
    
    下载 `inferenced` CLI 工具（最新 `inferenced` 二进制文件[在此](https://github.com/gonka-ai/gonka/releases)）。
    
    ??? note "什么是 `inferenced` CLI 工具？" 
        `inferenced` CLI 工具是用于与 Gonka 网络交互的命令行界面实用程序。它是一个独立的可执行二进制文件，允许用户创建和管理 Gonka 账户、执行推理任务、上传模型，并通过脚本命令自动化各种操作。
        
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

    此命令将：

    - 生成密钥对
    - 保存到 `~/.inference`
    - 返回你的账户地址、公钥和助记词（也请安全地以硬拷贝形式存储！）

    ```bash
    - address: <your-account-address>
      name: ACCOUNT_NAME
      pubkey: @type:...
      type: local
    ```
    
    账户存储你的余额，将其添加到环境变量 `GONKA_ADDRESS` 或 `.env` 文件中。

    ```bash
    export GONKA_ADDRESS=<your-account-address>
    ```

    你将使用此账户购买 gonka（GNK）代币并支付推理请求。

    将私钥添加到环境变量。
    
    如果你想执行请求，请导出你的私钥。
    
    ```bash
    ./inferenced keys export $ACCOUNT_NAME --unarmored-hex --unsafe
    ```
    
    此命令输出纯文本私钥。
    
    将其添加到环境变量 `GONKA_PRIVATE_KEY` 或 `.env` 文件中。
    ```bash
    export GONKA_PRIVATE_KEY=<your-private-key>
    ```
    要检索所有本地存储账户的列表，请执行以下命令：
    ```
    inferenced keys list [--keyring-backend test]
    ```

=== "选项 2：通过 Keplr（外部钱包）"

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
            此选项使用助记词创建账户，不支持通过桥进行交易。如果你想通过桥执行交易，请使用选项 1：通过 `inferenced` CLI 工具或选项 2：通过 Keplr（外部钱包，"通过 Google 连接"）。
        
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
        
    **打开 Gonka 的去中心化仪表盘**
    
    从创世节点的 `inference_url` 列表中选择随机节点。
    
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
    
    ??? note "选择随机节点的另一种完全去中心化方法"
        打开主机列表：[http://node2.gonka.ai:8000/v1/epochs/current/participants](http://node2.gonka.ai:8000/v1/epochs/current/participants)
        
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

    打开扩展程序并点击扩展程序窗口右上角的账户图标。
            
    <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>

    导航到三个点并点击"查看私钥"（如果你"通过 Google 连接"）或"查看恢复短语"（如果你使用"恢复短语"创建账户）。

    === "通过 Google 连接"

        <a href="/images/keplr_view_private_key.png" target="_blank"><img src="/images/keplr_view_private_key.png" style="width:auto; height:337.5px;"></a>

    === "创建新恢复短语"

        <a href="/images/keplr_view_recovery_phrase.png" target="_blank"><img src="/images/keplr_view_recovery_phrase.png" style="width:auto; height:337.5px;"></a>

    输入你的密码。
   
    <a href="/images/keplr_enter_your_password.png" target="_blank"><img src="/images/keplr_enter_your_password.png" style="width:auto; height:337.5px;"></a>

    复制你的私钥或恢复短语并安全存储（建议硬拷贝）。   

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

    将其添加到环境变量 `GONKA_PRIVATE_KEY` 或 `.env` 文件中。
    ```
    export GONKA_PRIVATE_KEY=<your-private-key>
    ```
    要检索所有本地存储账户的列表，请执行以下命令：
    ```
    inferenced keys list [--keyring-backend test]
    ```

=== "选项 3：通过 Leap（外部钱包）"

    !!! note "重要通知：功能有限"

        此选项使用助记词创建账户，不支持通过桥进行交易。如果你想通过桥执行交易，请使用选项 1：通过 `inferenced` CLI 工具或选项 2：通过 Keplr（外部钱包，"通过 Google 连接"）。
    
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

    **打开 Gonka 的去中心化仪表盘**
    
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
    
    ??? note "选择随机节点的另一种完全去中心化方法"
        打开主机列表：[http://node2.gonka.ai:8000/v1/epochs/current/participants](http://node2.gonka.ai:8000/v1/epochs/current/participants)

        从列表中选择任何活跃主机。
        
        复制他们的 `inference_url` 值。
        
    将 `inference_url` 粘贴到浏览器中以加载 Gonka 仪表盘，显示实时链上活动。
    
    打开后，你将看到从主机节点直接流式传输的实时数据 — 包括网络统计、活跃工作负载和推理指标。
    
    在右上角，点击"连接钱包"开始。
    
    <a href="/images/dashboard_ping_pub_3_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_1.png" style="width:500px; height:auto;"></a>
    
    选择 Leap 并点击连接。
    
    <a href="/images/choose_wallet_leap.png" target="_blank"><img src="/images/choose_wallet_leap.png" style="width:500px; height:auto;"></a>
    
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

    将其添加到环境变量 `GONKA_PRIVATE_KEY` 或 `.env` 文件中。
    ```
    export GONKA_PRIVATE_KEY=<your-private-key>
    ```
    要检索所有本地存储账户的列表，请执行以下命令：
    ```
    inferenced keys list [--keyring-backend test]
    ```

## 3. 使用修改的 OpenAI SDK 进行推理

=== "Python"
    要在 Python 中使用 Gonka API，你可以使用[Gonka OpenAI SDK for Python](https://github.com/gonka-ai/gonka-openai/tree/main/python)。通过使用 pip 安装 SDK 开始：

    ```
    pip install gonka-openai
    ```

    !!! note "如果遇到构建错误，你可能需要安装系统级库"
        ```
        brew install pkg-config secp256k1
        ```

    安装 SDK 后，创建一个名为 `example.py` 的文件并将示例代码复制到其中：

    ```py linenums="1"
    import os
    from gonka_openai import GonkaOpenAI

    client = GonkaOpenAI(
        gonka_private_key=os.environ.get(GONKA_PRIVATE_KEY),
        source_url=NODE_URL
    )

    response = client.chat.completions.create(
        model="Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
        messages=[
            { "role": "user", "content": "写一个关于独角兽的一句话睡前故事" }
        ]
    )

    print(response.choices[0].message.content)
    ```

    使用 `python example.py` 执行代码。片刻后，你应该看到 API 请求的输出。

=== "TypeScript"
    要在 Node.js、Deno 或 Bun 等服务器端 JavaScript 环境中使用 Gonka API，你可以使用[Gonka OpenAI SDK for TypeScript and JavaScript](https://github.com/gonka-ai/gonka-openai/tree/main/typescript)。通过使用 npm 或你首选的包管理器安装 SDK 开始：

    ```
    npm install gonka-openai
    ```

    安装 SDK 后，创建一个名为 `example.mjs` 的文件并将示例代码复制到其中：

    ```ts linenums="1"
    import { GonkaOpenAI } from gonka-openai;

    const endpoints = await resolveEndpoints({ sourceUrl: process.env.NODE_URL });
    const client = new GonkaOpenAI({
        gonkaPrivateKey: process.env.GONKA_PRIVATE_KEY,
        endpoints
    });

    const response = await client.chat.completions.create({
        model: "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
        messages: [
            { role: "user", content: "你好！给我讲个短笑话。" }
        ]
    });

    console.log(response.choices[0].message.content);
    ```

    使用 `node example.mjs` 执行代码。片刻后，你应该看到 API 请求的输出。

=== "Go"
    要在 Go 中使用 Gonka API，你可以使用[Gonka OpenAI SDK for Go](https://github.com/gonka-ai/gonka-openai/tree/main/go)。通过使用 go get 安装 SDK 开始：

    ```
    go get github.com/gonka-ai/gonka-openai/go
    ```

    安装 SDK 后，创建一个名为 `example.go` 的文件并将示例代码复制到其中：

    ```go linenums="1"
    package main

    import (
        "fmt"
        "os"

        gonka "github.com/gonka-ai/gonka-openai/go"
    )

    func main() {
        client, err := gonka.NewClient(gonka.Options{
            GonkaPrivateKey: os.Getenv("GONKA_PRIVATE_KEY"),
            SourceUrl: os.Getenv("NODE_URL")},
        })
        if err != nil {
            panic(err)
        }

        response, err := client.CreateChatCompletion(
            "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
            []gonka.ChatCompletionMessage{
                {
                    Role:    "user",
                    Content: "写一首关于编程的俳句",
                },
            },
        )
        if err != nil {
            fmt.Printf("Error: %v\n", err)
            return
        }

        fmt.Println(response.Choices[0].Message.Content)
    }
    ```

    使用 `go run example.go` 执行代码。片刻后，你应该看到 API 请求的输出。

要从另一种语言执行推理，请参阅[Gonka OpenAI 客户端库仓库](https://github.com/gonka-ai/gonka-openai)，并相应调整示例。

---
**需要帮助？** 加入我们的[Discord 服务器](https://discord.com/invite/RADwCT2U6R) 获取一般咨询、技术问题或安全担忧的帮助。  
