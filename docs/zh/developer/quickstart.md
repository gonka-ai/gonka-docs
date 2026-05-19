---
name: index.md
---

# 开发者快速开始

本指南介绍如何在 Gonka 中创建开发者账户并使用 Gonka API 提交推理请求。

!!! note "重要提示：针对现有 Leap Wallet 用户"

    如果你此前通过 Leap Wallet 创建了 Gonka 账户，请注意，Leap 将于 2026 年 5 月 28 日关闭其所有产品，包括浏览器扩展、移动应用以及 Dashboard。
    
    由于 Leap 是非托管钱包（non-custodial wallet），你的资产和账户仍然保存在链上。但为了继续访问你的钱包，建议你在 Leap 服务下线前，将现有助记词导入到其他受支持的钱包（如 Keplr）中。

??? note "Gonka 与传统 AI API 的区别"
    Gonka 不仅仅是另一个 AI API — 它是一个用于可证明推理的加密协议。通过消除中心化身份，Gonka 移除了困扰基于 SaaS 的 AI 服务的传统单点故障。以下对比表帮助你理解传统 AI API 与 Gonka API 之间的差异。
    
    | **方面**                         | **传统 AI API** <br> *(OpenAI、Anthropic 等)* | **Gonka API** |
    |-----------------------------------|---------------------------------------------------------|---------------|
    | **模型来源与可验证输出** | 模型由提供商托管和版本控制，但无法加密验证哪个模型实际产生了给定输出。无法证明模型未被切换、在后台微调或对你进行 A/B 测试。 | 每个推理请求和响应都可以加密链接到特定的模型哈希和执行环境。这实现了可验证的来源 — 任何人都可以证明特定模型版本生成了特定输出。 |
    | **抗审查性**         | 所有访问都集中控制 — 提供商可以随时限制或终止账户。这包括地理、政治或商业政策的执行。 | 推理请求通过去中心化网络签名和广播。只要你持有私钥并连接到节点，就可以运行推理。系统设计为不可审查，除非通过透明、协议级共识应用限制。 |
    | **可审计性与透明度**   | 日志记录、计费和使用跟踪完全由 API 提供商控制。用户无法独立验证自己的使用情况或检查定价、延迟或错误的处理方式。 | 每次交互都经过签名和时间戳，实现独立的审计跟踪。你可以证明推理何时以及如何发生、使用了哪个模型、结果是否被更改，并确保争议可以公开解决。 |
    | **透明的代币经济学**       | 计费费率对计算定价、模型成本或系统负载的洞察有限。 | 代币经济学在链上或协议定义，意味着定价机制透明且可检查。用户将 GNK 转换为 AI 代币，具有可预测、可追踪的交换逻辑，实现推理成本的清晰预测和供需驱动的经济学。 |

---

## 0. 选择你的接入方式

有两种方式可以开始使用 Gonka：

- **原生加密路径** —— 使用你自己的 Gonka 账户、私钥和 GNK 余额，直接发送推理请求。

- **经纪商路径** —— 使用第三方 broker 服务，以 USD 支付，并避免自行管理钱包、私钥或 GNK。

=== "Option A — 原生加密路径"

    如果你希望使用自己的钱包、私钥、GNK 余额以及 SDK 请求直接与 Gonka 交互，请使用此方式。

    你需要：

    1. 创建或导入一个兼容 Gonka 的账户
    2. 导出或安全保存私钥
    3. 为账户充值 GNK
    4. 在链上发布公钥
    5. 通过 SDK 发送推理请求

=== "Option B — 经纪商路径"

    如果你希望使用 USD 支付，并避免管理 GNK、钱包、私钥或链上交易，请使用此方式。
    Broker 服务会在内部处理 GNK 转换以及链上交互。

    !!! caution "权衡"

        Broker 服务并不是核心协议的一部分。
        相比直接与网络交互，它们会引入额外的信任层和抽象层。

    如果你使用 broker 服务，请遵循该 broker 自身的 onboarding 指引。本指南后续内容适用于希望直接与 Gonka 交互的用户。

## 1. 定义变量

在创建账户之前，设置所需的环境变量：

=== "macOS / Linux"

```bash
export ACCOUNT_NAME=<your-desired-account-name>
export NODE_URL=<http://random-node-url>
```

- 将 `<your-desired-account-name>` 替换为你选择的账户名称。
    - 该名称不会记录在链上 —— 它仅存在于你的本地密钥存储中。
    - 唯一性仅在本地生效：如果创建两个相同名称的密钥，将会覆盖已有密钥（CLI 会给出警告）。如果你继续操作，原有密钥将被永久丢失。强烈建议在执行此操作前备份你的公钥和私钥。
- 将 `<http://random-node-url>` 替换为任意一个节点 URL。你可以随机选择任意节点 —— 无需考虑其运行的模型。在此阶段，该节点仅作为网关，用于获取网络状态并广播交易。所有节点都提供相同的公共 API。你可以选择：
    - 使用以下列表中的任意一个创世节点（genesis nodes）。
    - 获取当前活跃参与者列表并随机选择一个节点。为避免过度依赖创世节点并促进去中心化，Gonka 建议从当前 epoch 的活跃节点中随机选择一个节点。这有助于提升网络负载分布，并增强对节点故障的抗性。

=== "创世节点"
    将 `NODE_URL` 设置为以下创世节点之一：
    ```bash title="创世节点列表"
    http://36.189.234.237:17241
    http://node1.gonka.ai:8000
    http://node2.gonka.ai:8000
    http://47.236.26.199:8000
    http://47.236.19.22:18000
    http://gonka.spv.re:8000
    ```
    
=== "当前活跃参与者列表"
    或者，你可以从当前 epoch 中选择随机活跃参与者。打开链接或运行以下命令获取活跃参与者列表以及用于验证的加密证明：
    === "链接"
        [http://node1.gonka.ai:8000/v1/epochs/current/participants](http://node1.gonka.ai:8000/v1/epochs/current/participants)

    === "命令"
        ```bash
        curl http://node1.gonka.ai:8000/v1/epochs/current/participants
        ```
        
请不要忘记将其记录下来，你将在下一步中需要使用。

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
    ./inferenced keys add "$ACCOUNT_NAME"
    ```
    
    确保安全保存你的密码短语 — 将来访问时需要。

    此命令将：

    - 生成密钥对
    - 保存到 `~/.inference`
    - 返回你的账户地址、公钥和助记词（也请安全地以硬拷贝形式存储！）

    ```bash
    - address: <your-account-address>
      name: <your-account-name>
      pubkey: @type:...
      type: local
    ```
    
    账户存储你的余额，将其添加到环境变量 `GONKA_ADDRESS` 或 `.env` 文件中。

    ```bash
    export GONKA_ADDRESS=<your-account-address>
    ```

    你将使用此账户购买 Gonka（GNK）代币并支付推理请求。

    导出你的私钥，以便 SDK 可以在第 5 步中对请求进行签名。
    以下命令会将一个十六进制编码的私钥输出到 stdout（标准输出）：
    
    ```bash
    ./inferenced keys export "$ACCOUNT_NAME" --unarmored-hex --unsafe
    ```
    
     复制输出内容，并将其添加到你的环境变量中（或者 `.env` 文件中）：
    
    ```bash
    export GONKA_PRIVATE_KEY=<paste-the-hex-key-here>
    ```

    你也可以随时使用以下命令列出所有本地存储的账户：
    ```bash
    ./inferenced keys list [--keyring-backend test]
    ```
    该命令会读取本地的 `inferenced` 密钥库 (`~/.inferenced/`) ，不适用于在 Keplr 或 Cosmostation 中创建的账户。

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

    在搜索栏中输入 “Gonka”，然后选择 Gonka 链并将其添加到你的钱包中。

    <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:500px; height:auto;"></a>
                    
    你的 Keplr 钱包已经创建完成。
        
    <a href="/images/dashboard_keplr_step_2_8.png" target="_blank"><img src="/images/dashboard_keplr_step_2_8.png" style="width:500px; height:auto;"></a>

    打开 Keplr，进入钱包页面，并点击 “Copy Address（复制地址）”。

    <a href="/images/keplr_copy_address_2.png" target="_blank"><img src="/images/keplr_copy_address_2.png" style="width:auto; height:337.5px;"></a>

    点击 Gonka 链旁边的 Copy（复制）按钮。

    <a href="/images/keplr_web_copy_gonka_address_2.png" target="_blank"><img src="/images/keplr_web_copy_gonka_address_2.png" style="width:auto; height:337.5px;"></a>

    你已经复制了你的 Gonka 账户地址。你可以将其分享给任何需要向你付款的人。分享该地址是安全的。
        
    ??? note "可选：如何在 Keplr 钱包中添加额外的 Gonka 账户 —— 点击查看步骤"

        打开扩展程序，并点击扩展窗口右上角的账户图标。
            
        <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>
            
        点击 “Add wallet（添加钱包）” 按钮。
            
        <a href="/images/dashboard_ping_pub_3_5_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_2.png" style="width:auto; height:337.5px; display:block;"></a>
            
        点击 “Import an Existing Wallet（导入现有钱包）”。
            
        <a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:450px; height:auto; display:block;"></a>
            
        点击 “Use recovery phrase or private key（使用恢复短语或私钥）”。

        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:450px; height:auto;"></a>

        粘贴你的私钥。不要导入助记词。Keplr 后续将不允许你导出私钥，而你在接下来的步骤中会需要该私钥。

        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:450px; height:auto;"></a>
            
        为你的钱包命名，方便后续识别。
            
        <a href="/images/dashboard_ping_pub_3_5_5.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_5.png" style="width:450px; height:auto;"></a>
            
        在搜索栏中输入 “Gonka”，然后选择 Gonka 链并将其添加到你的钱包中。

        <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:500px; height:auto;"></a>
                    
        完成 —— 你的 Gonka 账户已经成功导入到 Keplr 中！
            
        <a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:450px; height:auto;"></a>

    一旦你获得了十六进制私钥（即上面从 Keplr 复制的私钥），请将其添加到你的环境变量中，以便 SDK 可以在第 5 步中对请求进行签名：
    
    ```bash
    export GONKA_PRIVATE_KEY=<your-hex-private-key>
    ```

=== "选项 3：通过 Cosmostation（外部钱包）"

    !!! note "重要提示：功能受限"
        该方式通过助记词创建账户，不支持通过桥进行交易。如果你希望通过桥进行交易，请改用选项 1：通过 `inferenced` CLI 工具，或选项 2：通过 Keplr（外部钱包，“Connect with Google”）创建账户。
        
    获取 [Cosmostation 钱包浏览器扩展](https://cosmostation.io/products/application). 

    <a href="/images/1_cosmostation.png" target="_blank"><img src="/images/1_cosmostation.png" style="width:500px; height:auto;"></a>
            
    将扩展添加到你的浏览器。

    <a href="/images/2_cosmostation_add_extention.png" target="_blank"><img src="/images/2_cosmostation_add_extention.png" style="width:500px; height:auto;"></a>

    选择 “Create new wallet”（创建新钱包）。

    <a href="/images/5_cosmostation_create_a_new_wallet.png" target="_blank"><img src="/images/5_cosmostation_create_a_new_wallet.png" style="width:auto; height:337.5px;"></a>

    记录你的助记词。切勿与任何人分享助记词。任何获取你助记词的人都可以完全控制你的资产。请始终警惕钓鱼攻击，并妥善备份助记词。

    <a href="/images/6_cosmostation_mnemonic.png" target="_blank"><img src="/images/6_cosmostation_mnemonic.png" style="width:auto; height:337.5px;"></a>

    按照顺序完成验证测试。检查备份的助记词，并按顺序选择正确的单词。

    <a href="/images/7_cosmostation_quiz.png" target="_blank"><img src="/images/7_cosmostation_quiz.png" style="width:auto; height:337.5px;"></a>

    设置账户名称。你可以为账户命名，且可随时修改。

    <a href="/images/8_cosmostation_account_name.png" target="_blank"><img src="/images/8_cosmostation_account_name.png" style="width:auto; height:337.5px;"></a>

    在右上角点击 “All Networks”（所有网络），选择 Gonka 链并将其添加到钱包中。

    <a href="/images/10_cosmostation_select_gonka_network.png" target="_blank"><img src="/images/10_cosmostation_select_gonka_network.png" style="width:auto; height:337.5px;"></a>

    完成！你的 Gonka Developer 账户已成功创建。复制你的 Gonka 账户地址。它以 `gonka...` 开头，并显示在你的余额上方。你可以安全地将该地址分享给任何需要向你付款的人。
        
    <a href="/images/11_cosmostation_gonka_created.png" target="_blank"><img src="/images/11_cosmostation_gonka_created.png" style="width:auto; height:337.5px;"></a>

    点击顶部的钱包名称，在右上角点击 “Manage”（管理），然后再次点击钱包名称。
    
    <a href="/images/12_cosmostation_click_name.png" target="_blank"><img src="/images/12_cosmostation_click_name.png" style="width:auto; height:337.5px;"></a>

    点击 “View private key”（查看私钥）。

    <a href="/images/13_cosmostation_view_private_key.png" target="_blank"><img src="/images/13_cosmostation_view_private_key.png" style="width:auto; height:337.5px;"></a>

    验证你的密码。

    <a href="/images/14_cosmostation_verify_password.png" target="_blank"><img src="/images/14_cosmostation_verify_password.png" style="width:auto; height:337.5px;"></a>

    从列表中选择 “Gonka”。

    <a href="/images/15_cosmostation.png" target="_blank"><img src="/images/15_cosmostation.png" style="width:auto; height:337.5px;"></a>
       
    点击 “Gonka” 查看私钥。复制你的私钥或助记词，并妥善保存（建议保留纸质备份）。

    <a href="/images/16_cosmostation_copy_private_key.png" target="_blank"><img src="/images/16_cosmostation_copy_private_key.png" style="width:auto; height:337.5px;"></a>
    
    一旦你获得了十六进制私钥（即上面从 Cosmostation 复制的私钥），请将其添加到你的环境变量中，以便 SDK 可以在第 5 步中对请求进行签名：
    
    ```bash
    export GONKA_PRIVATE_KEY=<your-hex-private-key>
    ```

## 3. 为你的账户充值 GNK

GNK 是 Gonka 网络的原生代币。你需要使用它来支付推理费用——你发送到网络的每个请求都会消耗少量 GNK。

目前，GNK 尚未在任何交易所正式上线。

你可以通过以下方式获取 GNK：

- 运行节点并通过贡献算力获得奖励
- 参与 [悬赏计划](https://gonka.ai/docs/FAQ/#bounty-program)  
- 社区驱动渠道（生态内的点对点转账）
    - 这些交互不属于协议本身，依赖参与者之间的直接协调
    - 任何购买、兑换或转账均需自行承担风险

!!! note "购买 GNK"

    直接购买流程仍在开发中。请关注 [Discord](https://discord.com/invite/RADwCT2U6R) 获取最新公告。  
    你在第三方网站或交易所看到的任何 GNK 上线信息，都不属于 Gonka 协议的一部分。

## 4. 激活用于推理的账户

在进行推理之前，你的账户必须满足两个条件：有余额，并且已在链上发布公钥。

- 你 **不** 需要注册成为 Participant 才能运行推理
- Participant 注册仅在你需要作为算力提供方（hosting）时才需要

检查余额：
```bash
./inferenced query bank balances "$GONKA_ADDRESS" --node "$NODE_URL/chain-rpc/"
```

如果你的账户是通过 `inferenced`创建的，需要发布公钥：
```bash
./inferenced publish-pubkey \
  --from "$ACCOUNT_NAME" \
  --node "$NODE_URL/chain-rpc/" \
  --chain-id "gonka-mainnet" \
  --yes
```

如果你的账户是在外部钱包中创建的，发送任意一笔链上交易（例如转账给自己）即可发布公钥。

验证账户数据：
```bash
curl -s "$NODE_URL/v2/accounts/$GONKA_ADDRESS" | jq .
```

## 5. 使用 Gonka OpenAI SDK 运行推理

!!! important "公共 `devshard` 创建节点"
    Gonka 上的推理通过 ** devshard 计费流程** 进行结算。 公共节点会为你的账户创建一个 devshard 托管会话（escrow session），并将你的请求路由到该会话内的执行节点。只有在链上 `devshard_escrow_params.allowed_creator_addresses` 白名单中的节点地址才允许创建这些托管会话。

    当前主网推荐的公共推理网关是 **`https://node4.gonka.ai`**。

    用于 SDK 的 endpoint 发现，请将 `SOURCE_URL` 设置为该公共推理网关：
    ```bash
    export SOURCE_URL=https://node4.gonka.ai
    ```

=== "Python"
    在 Python 中使用 Gonka API，可以使用 [Gonka OpenAI SDK for Python](https://github.com/gonka-ai/gonka-openai/tree/main/python). 首先通过 pip 安装 SDK：
    ```
    pip install gonka-openai==0.2.6
    ```

    !!! note "如果遇到构建错误，可能需要安装系统级依赖"
        ```
        brew install pkg-config secp256k1
        ```

    安装完成后，新建 `example.py` 并复制以下代码：

    ```py linenums="1"
    import os
    import httpx
    from gonka_openai import GonkaOpenAI, Endpoint

    src = os.environ["SOURCE_URL"].rstrip("/")
    address = httpx.get(f"{src}/v1/identity").json()["data"]["address"]

    client = GonkaOpenAI(
        gonka_private_key=os.environ["GONKA_PRIVATE_KEY"],
        endpoints=[Endpoint(url=f"{src}/v1", address=address)],
    )

    response = client.chat.completions.create(
        model="Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
        messages=[
            {"role": "user", "content": "写一句关于独角兽的睡前小故事"}
        ],
    )

    print(response.choices[0].message.content)
    ```

    运行： `python example.py`.稍等片刻即可看到 API 返回结果。

=== "TypeScript"
    在 Node.js / Deno / Bun 等环境中，可以使用 [Gonka OpenAI SDK for TypeScript and JavaScript](https://github.com/gonka-ai/gonka-openai/tree/main/typescript). 开始时，请使用 npm 或你偏好的包管理器安装 SDK：

    ```
    npm install gonka-openai@0.2.6
    ```

    安装 SDK 后，创建一个名为 `example.mjs` 的文件，并将示例代码复制进去：

    ```ts linenums="1"
    import { GonkaOpenAI } from 'gonka-openai';

    const src = process.env.SOURCE_URL.replace(/\/+$/, '');
    const { data } = await fetch(`${src}/v1/identity`).then(r => r.json());

    const client = new GonkaOpenAI({
        gonkaPrivateKey: process.env.GONKA_PRIVATE_KEY,
        endpoints: [{ url: `${src}/v1`, address: data.address }],
    });

    const response = await client.chat.completions.create({
        model: "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
        messages: [
            { role: "user", content: "你好！请讲一个短笑话。" }
        ],
    });

    console.log(response.choices[0].message.content);
    ```

    使用 `node example.mjs`执行代码。稍等片刻后，你应该会看到 API 请求的输出结果。

=== "Go"
    要在 Go 中使用 Gonka API，你可以使用 [Gonka OpenAI SDK for Go](https://github.com/gonka-ai/gonka-openai/tree/main/go)。

    请按以下顺序操作：先创建 `example.go` 并粘贴下方程序（`import` 已列出所需模块，一般无需手改路径）；在同一目录执行 `go mod init` 生成 `go.mod`；再执行 `go mod tidy` 根据 import 下载依赖（含 `github.com/gonka-ai/gonka-openai/go@v0.2.6` 等）并生成 `go.sum`；最后运行程序。

    **1.** 创建名为 `example.go` 的文件，复制以下代码：

    ```go linenums="1"
    package main

    import (
        "context"
        "encoding/json"
        "log"
        "net/http"
        "os"
        "strings"

        gonka "github.com/gonka-ai/gonka-openai/go"
        "github.com/openai/openai-go"
    )

    func main() {
        src := strings.TrimRight(os.Getenv("SOURCE_URL"), "/")

        resp, err := http.Get(src + "/v1/identity")
        if err != nil {
            log.Fatal(err)
        }
        defer resp.Body.Close()
        var ident struct {
            Data struct{ Address string } `json:"data"`
        }
        if err := json.NewDecoder(resp.Body).Decode(&ident); err != nil {
            log.Fatal(err)
        }

        client, err := gonka.NewGonkaOpenAI(gonka.Options{
            GonkaPrivateKey: os.Getenv("GONKA_PRIVATE_KEY"),
            Endpoints:       []gonka.Endpoint{{URL: src + "/v1", Address: ident.Data.Address}},
        })
        if err != nil {
            log.Fatal(err)
        }

        r, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
            Model: "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
            Messages: []openai.ChatCompletionMessageParamUnion{
                openai.UserMessage("写一首关于编程的俳句"),
            },
        })
        if err != nil {
            log.Fatal(err)
        }

        log.Println(r.Choices[0].Message.Content)
    }
    ```

    初始化模块 —— 这将创建一个 `go.mod` 文件：

    ```
    go mod init example
    ```

    下载依赖项 —— 这会解析所有导入项（包括 `github.com/gonka-ai/gonka-openai/go@v0.2.6`) ，并创建一个 `go.sum` 文件：

    ```
    go mod tidy
    ```

    使用 `go run example.go`执行代码。稍等片刻后，你应该会看到你的 API 请求输出结果。

若要使用其他编程语言进行推理，请查看 [the Gonka OpenAI client library repository](https://github.com/gonka-ai/gonka-openai), ，并根据对应语言调整示例代码。

## 6. 工具调用

仅支持 `type: "function"` —— vLLM 实现的是 OpenAI Chat Completions 规范，而不是 Assistants API (`code_interpreter`, `file_search` 不可用）。

你可以定义函数，当用户请求匹配时，模型会返回结构化的调用参数——由你决定如何处理这些参数。

=== "Python"

    ```py linenums="1"
    import os
    import httpx
    import json
    from gonka_openai import GonkaOpenAI, Endpoint

    src = os.environ["SOURCE_URL"].rstrip("/")
    address = httpx.get(f"{src}/v1/identity").json()["data"]["address"]

    client = GonkaOpenAI(
        gonka_private_key=os.environ["GONKA_PRIVATE_KEY"],
        endpoints=[Endpoint(url=f"{src}/v1", address=address)],
    )

    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "获取某个城市的当前天气",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "city": {"type": "string", "description": "城市名称"}
                    },
                    "required": ["city"],
                },
            },
        }
    ]

    response = client.chat.completions.create(
        model="Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
        messages=[{"role": "user", "content": "巴黎的天气怎么样？"}],
        tools=tools,
        tool_choice="auto",
    )

    message = response.choices[0].message
    if message.tool_calls:
        call = message.tool_calls[0]
        args = json.loads(call.function.arguments)
        # 模型选择了 get_weather ，并返回 {"city": "Paris"} —— 现在你可以调用自己的函数
        print(call.function.name, args)
    ```

=== "TypeScript"

    ```ts linenums="1"
    import { GonkaOpenAI } from 'gonka-openai';

    const src = process.env.SOURCE_URL.replace(/\/+$/, '');
    const { data } = await fetch(`${src}/v1/identity`).then(r => r.json());

    const client = new GonkaOpenAI({
        gonkaPrivateKey: process.env.GONKA_PRIVATE_KEY,
        endpoints: [{ url: `${src}/v1`, address: data.address }],
    });

    const tools = [
        {
            type: 'function',
            function: {
                name: 'get_weather',
                description: '获取某个城市的当前天气',
                parameters: {
                    type: 'object',
                    properties: { city: { type: 'string', description: '城市名称' } },
                    required: ['city'],
                },
            },
        },
    ];

    const response = await client.chat.completions.create({
        model: "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
        messages: [{ role: "user", content: "巴黎的天气怎么样？" }],
        tools,
        tool_choice: "auto",
    });

    const message = response.choices[0].message;
    if (message.tool_calls) {
        const call = message.tool_calls[0];
        const args = JSON.parse(call.function.arguments);
        // 模型选择了 get_weather ，并返回 { city: "Paris" } —— 现在可以调用你的函数
        console.log(call.function.name, args);
    }
    ```

=== "Go"

    ```go linenums="1"
    package main

    import (
        "context"
        "encoding/json"
        "log"
        "net/http"
        "os"
        "strings"

        gonka "github.com/gonka-ai/gonka-openai/go"
        "github.com/openai/openai-go"
    )

    func main() {
        src := strings.TrimRight(os.Getenv("SOURCE_URL"), "/")

        resp, err := http.Get(src + "/v1/identity")
        if err != nil {
            log.Fatal(err)
        }
        defer resp.Body.Close()
        var ident struct {
            Data struct{ Address string } `json:"data"`
        }
        if err := json.NewDecoder(resp.Body).Decode(&ident); err != nil {
            log.Fatal(err)
        }

        client, err := gonka.NewGonkaOpenAI(gonka.Options{
            GonkaPrivateKey: os.Getenv("GONKA_PRIVATE_KEY"),
            Endpoints:       []gonka.Endpoint{{URL: src + "/v1", Address: ident.Data.Address}},
        })
        if err != nil {
            log.Fatal(err)
        }

        r, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
            Model: "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
            Messages: []openai.ChatCompletionMessageParamUnion{
                openai.UserMessage("巴黎的天气怎么样？"),
            },
            Tools: []openai.ChatCompletionToolParam{
                {
                    Type: "function",
                    Function: openai.FunctionDefinitionParam{
                        Name:        "get_weather",
                        Description: openai.String("获取某个城市的当前天气"),
                        Parameters: openai.FunctionParameters{
                            "type": "object",
                            "properties": map[string]any{
                                "city": map[string]string{"type": "string", "description": "城市名称"},
                            },
                            "required": []string{"city"},
                        },
                    },
                },
            },
        })
        if err != nil {
            log.Fatal(err)
        }

        if len(r.Choices[0].Message.ToolCalls) > 0 {
            call := r.Choices[0].Message.ToolCalls[0]
            var args struct{ City string }
            json.Unmarshal([]byte(call.Function.Arguments), &args)
            // 模型选择了 get_weather，参数为 {City: "巴黎"} —— 现在可以调用你的函数
            log.Printf("工具: %s, 城市: %s\n", call.Function.Name, args.City)
        }
    }
    ```

---
**需要帮助？**  可以查看 [FAQ 页面](https://gonka.ai/FAQ/)，或加入 [Discord 服务器](https://discord.com/invite/RADwCT2U6R) 获取支持（一般咨询、技术问题或安全相关问题）。
