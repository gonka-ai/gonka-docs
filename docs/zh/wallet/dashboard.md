# 仪表盘入门

仪表盘展示链上实时活动。

与依赖单一中心化服务器不同，网络数据与推理指标直接托管在各个主机（Host）节点上。也就是说，仪表盘可以连接到任意主机节点，直接从源头获取实时网络数据。

你可以通过两种方式使用仪表盘：

- 预览模式：无需创建账户，浏览仪表盘并查看网络数据。
- 完整模式：连接你的钱包以解锁全部功能。

=== "预览模式"

    如果你想在创建账户之前探索网络或查看实时推理指标，请按以下步骤操作：
    
    1. 从创世节点的 `inference_url` 列表中选择任意一个节点：
    
        - [http://185.216.21.98:8000](http://185.216.21.98:8000)  
        - [http://36.189.234.197:18026](http://36.189.234.197:18026)  
        - [http://36.189.234.237:17241](http://36.189.234.237:17241)  
        - [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)  
        - [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)  
        - [http://node3.gonka.ai:8000](http://node3.gonka.ai:8000)  
        - [http://47.236.26.199:8000](http://47.236.26.199:8000)  
        - [http://47.236.19.22:18000](http://47.236.19.22:18000)  
        - [http://gonka.spv.re:8000](http://gonka.spv.re:8000)  
    
        ??? note "另一种方式：完全去中心化地随机选择节点"
            打开主机列表：[http://node2.gonka.ai:8000/v1/epochs/current/participants](http://node2.gonka.ai:8000/v1/epochs/current/participants)。  
            从该列表中选择任意活跃主机。
    
    2. 将选中的 `inference_url` 复制并粘贴到浏览器地址栏，即可加载仪表盘。
    
    打开后，你将看到直接来自该主机节点的实时数据——包括网络统计、活跃负载与推理指标。
    
    !!! note "为什么这很重要？"
        这种架构确保了去中心化：没有任何单一中心化服务器控制网络。在预览模式下，功能有限。你可以查看余额、交易与部分分析。如需发送代币、管理个人账户或分析你的私有 AI 令牌使用情况，请切换到[完整模式](https://gonka.ai/wallet/dashboard/#__tabbed_1_2)。

=== "完整模式"
    
    首先按“预览模式”打开仪表盘。进入后，继续以下步骤以启用全部功能。
    
    ### 1. 访问 Gonka 账户
    
    如需解锁仪表盘的全部功能，你需要一个 Gonka 账户。
    
    - 已有账户？前往下方“设置外部钱包”。
    - 新用户？访问[开发者快速开始](https://gonka.ai/developer/quickstart/){target=_blank}或[主机快速开始](https://gonka.ai/host/quickstart/){target=_blank}创建账户。
    
    ### 2. 设置外部钱包
    通过钱包与仪表盘交互，推荐使用 [Keplr](https://www.keplr.app/){target=_blank} 或 [Leap](https://www.leapwallet.io/){target=_blank}（面向 Cosmos 生态的浏览器扩展钱包）。
    
    ??? note "什么是钱包？"
        加密钱包是存放用户公钥与私钥的安全容器，帮助用户管理、转移与购买加密资产。Gonka 基于 Cosmos‑SDK 区块链框架构建，可通过 Keplr 或 Leap 访问（将支持更多钱包）。
        
    - 如果已有 Keplr 或 Leap，请前往[“连接钱包”](https://gonka.ai/wallet/dashboard/#3-connect-wallet)部分。
    - 如果尚未安装，请按下述步骤操作。
    
    === "Keplr"
    
        2.1. 访问[Keplr 官网](https://www.keplr.app/){target=_blank}，点击“Get Keplr wallet”。
        
        <a href="/images/dashboard_keplr_step_2_1.png" target="_blank"><img src="/images/dashboard_keplr_step_2_1.png" style="width:500px; height:auto;"></a>
        
        2.2. 选择与你浏览器匹配的扩展。
        
        <a href="/images/dashboard_keplr_step_2_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_2.png" style="width:500px; height:auto;"></a>
        
        2.3. 将扩展添加至浏览器。
        
        === "Firefox"
        
            <a href="/images/dashboard_keplr_step_2_3.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3.png" style="width:500px; height:auto;"></a>
        
        === "Google Chrome"
        
            <a href="/images/dashboard_keplr_step_2_3_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3_2.png" style="width:500px; height:auto;"></a>
        
        2.4. 点击 “Import an existing wallet”。
        
        <a href="/images/dashboard_keplr_step_2_4.png" target="_blank"><img src="/images/dashboard_keplr_step_2_4.png" style="width:500px; height:auto;"></a>
        
        2.5. 点击 “Use recovery phrase or private key”。
        
        <a href="/images/dashboard_keplr_step_2_5.png" target="_blank"><img src="/images/dashboard_keplr_step_2_5.png" style="width:500px; height:auto;"></a>
        
        2.6. 粘贴你在[此步骤](https://gonka.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=your%2Daccount%2Daddress%3E-,3.%20Add%20Private%20Key%20to%20environment%20variables,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using)通过 CLI 生成的私钥。不要导入助记词/恢复短语（mnemonic/seed），因为跨链桥需要直接访问原始私钥以签名交易并确保与以太坊的互操作性。
        
        <a href="/images/dashboard_keplr_step_2_6_private key.png" target="_blank"><img src="/images/dashboard_keplr_step_2_6_private_key.png" style="width:500px; height:auto;"></a>
        
        2.7. 为钱包命名，便于区分。
        
        <a href="/images/dashboard_keplr_step_2_6.png" target="_blank"><img src="/images/dashboard_keplr_step_2_6.png" style="width:500px; height:auto;"></a>
        
        2.8. 勾选 Cosmos Hub 与 Ethereum。
        
        <a href="/images/dashboard_keplr_step_2_7.png" target="_blank"><img src="/images/dashboard_keplr_step_2_7.png" style="width:500px; height:auto;"></a>
        
        2.9. 完成！你的 Gonka 账户已成功导入 Keplr！
        
        <a href="/images/dashboard_keplr_step_2_8.png" target="_blank"><img src="/images/dashboard_keplr_step_2_8.png" style="width:500px; height:auto;"></a>
    
    === "Leap"
    
        2.1. 访问[Leap 官网](https://www.leapwallet.io/){target=_blank}，点击 “Download Leap”。
        
        <a href="/images/dashboard_leap_step_2_1.png" target="_blank"><img src="/images/dashboard_leap_step_2_1.png" style="width:500px; height:auto;"></a>
        
        2.2. 将扩展添加至浏览器。
        
        <a href="/images/dashboard_leap_step_2_2.png" target="_blank"><img src="/images/dashboard_leap_step_2_2.png" style="width:500px; height:auto;"></a>
        
        2.3. 点击 “Import an existing wallet”。
        
        <a href="/images/dashboard_leap_step_2_3.png" target="_blank"><img src="/images/dashboard_leap_step_2_3.png" style="width:500px; height:auto;"></a>
        
        2.4. 选择 “Import private key”。不要选择 “Import recovery phrase”，因为跨链桥需要直接访问原始私钥以签名交易并确保与以太坊的互操作性。
        
        <a href="/images/dashboard_leap_step_2_4.png" target="_blank"><img src="/images/dashboard_leap_step_2_4.png" style="width:500px; height:auto;"></a>
        
        2.5. 粘贴你在[此步骤](https://gonka.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=request%20in%20Python%3A-,3.1.%20Export%20your%20private%20key%20(for%20demo/testing%20only).,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using)通过 CLI 生成的私钥。
        
        <a href="/images/dashboard_leap_2_5_private_key.png" target="_blank"><img src="/images/dashboard_leap_2_5_private_key.png" style="width:500px; height:auto;"></a>
        
        2.6. 创建你的钱包密码。
        
        <a href="/images/dashboard_leap_step_2_6.png" target="_blank"><img src="/images/dashboard_leap_step_2_6.png" style="width:500px; height:auto;"></a>
        
        2.7. 完成！你的 Gonka 账户已成功导入 Leap！
        
        <a href="/images/dashboard_leap_step_2_7.png" target="_blank"><img src="/images/dashboard_leap_step_2_7.png" style="width:500px; height:auto;"></a>
    
    ### 3. 连接钱包
    
    3.1 按[预览模式](https://gonka.ai/wallet/dashboard/#__tabbed_1_1)说明打开 Gonka 仪表盘。
    
    3.2 在右上角点击 “Connect Wallet”。
    
    <a href="/images/dashboard_ping_pub_3_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_1.png" style="width:500px; height:auto;"></a>
    
    3.3 选择 Keplr 或 Leap 并点击 Connect。
    
    <a href="/images/dashboard_ping_pub_3_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_2.png" style="width:500px; height:auto;"></a>
    
    3.4 你会看到提示将自定义 Gonka 链添加到钱包。确认并添加。
    
    === "Keplr"
        <a href="/images/dashboard_ping_pub_3_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_3.png" style="width:500px; height:auto;"></a>
    
    === "Leap"
        <a href="/images/dashboard_ping_pub_3_3-leap.png" target="_blank"><img src="/images/dashboard_ping_pub_3_3-leap.png" style="width:500px; height:auto;"></a>
    
    3.5 完成！你的账户已成功添加到钱包。
    
    <a href="/images/dashboard_ping_pub_3_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_4.png" style="width:500px; height:auto;"></a>
    
    ??? note "可选：如何在钱包中添加额外的 Gonka 账户（点击展开）"
    
        === "Keplr"
            打开扩展，在右上角点击账户图标。
            
            <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>
            
            点击 “Add wallet”。
            
            <a href="/images/dashboard_ping_pub_3_5_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_2.png" style="width:auto; height:337.5px; display:block;"></a>
            
            点击 “Import an Existing Wallet”。
            
            <a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:450px; height:auto; display:block;"></a>
            
            点击 “Use recovery phrase or private key”。
    
            <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:450px; height:auto;"></a>
    
            粘贴你在[此步骤](https://gonka.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=request%20in%20Python%3A-,3.1.%20Export%20your%20private%20key%20(for%20demo/testing%20only).,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using)通过 CLI 生成的私钥。不要导入助记词/恢复短语，因为跨链桥需要直接访问原始私钥以签名交易并确保与以太坊的互操作性。
    
            <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:450px; height:auto;"></a>
            
            为钱包命名，便于区分。
            
            <a href="/images/dashboard_ping_pub_3_5_5.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_5.png" style="width:450px; height:auto;"></a>
            
            勾选 Cosmos Hub 与 Ethereum。
    
            <a href="/images/dashboard_ping_pub_3_5_6.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_6.png" style="width:450px; height:auto; display:block;"></a>
            
            完成 —— 你的 Gonka 账户已成功导入 Keplr！
            
            <a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:450px; height:auto;"></a>
        
        === "Leap"
            打开扩展，在顶部中间的按钮处点击青蛙图标与钱包名称。
            
            <a href="/images/dashboard_leap_step_3_5_1.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_1.png" style="width:250px; height:auto;"></a>
            
            点击 “Create/Import wallet”。
            
            <a href="/images/dashboard_leap_step_3_5_2.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_2.png" style="width:250px; height:auto;"></a>
            
            选择 “Import using private key”。不要选择 “Import using recovery phrase”，因为跨链桥需要直接访问原始私钥以签名交易并确保与以太坊的互操作性。
            
            <a href="/images/dashboard_leap_step_3_5_3.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_3.png" style="width:250px; height:auto;"></a>
    
            粘贴你在[此步骤](https://gonka.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=request%20in%20Python%3A-,3.1.%20Export%20your%20private%20key%20(for%20demo/testing%20only).,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using)通过 CLI 生成的私钥。
    
            <a href="/images/dashboard_leap_step_3_5_3.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_4_private_key.png" style="width:250px; height:auto;"></a>
            
            完成 —— 你的 Gonka 账户已成功导入 Leap（点击顶部中间的青蛙图标与钱包名称可在钱包之间切换）。
            
            <a href="/images/dashboard_leap_step_3_5_4.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_4.png" style="width:250px; height:auto;"></a>
