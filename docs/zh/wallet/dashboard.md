# 仪表盘入门
仪表盘展示链上实时活动。

与依赖单一中心化服务器不同，所有网络数据和推理指标都直接托管在主机（Host）节点上。这意味着仪表盘可以连接到任何主机的节点，直接从源头获取实时网络数据。

你可以通过两种方式使用仪表盘：

- **预览模式** — 无需创建账户即可浏览仪表盘并查看网络数据。
- **完整模式** — 连接你的钱包以解锁全部功能。

=== "**预览模式**"

    如果你想在设置账户之前探索网络或查看实时推理指标，请按以下步骤操作：
    
    1. 以下是创世节点列表。从下面的列表中选择一个随机节点，并在新的浏览器窗口/标签页中打开。
    
        - [http://36.189.234.237:17241](http://36.189.234.237:17241)  
        - [https://node1.gonka.ai:8443](https://node1.gonka.ai:8443)  
        - [https://node2.gonka.ai:8443](https://node2.gonka.ai:8443)  
        - [http://47.236.26.199:8000](http://47.236.26.199:8000)  
        - [http://47.236.19.22:18000](http://47.236.19.22:18000)  
        - [http://gonka.spv.re:8000](http://gonka.spv.re:8000)  
    
        ??? note "替代方案：完全去中心化地随机选择节点"
            打开主机列表：[http://node2.gonka.ai:8443/v1/epochs/current/participants](http://node2.gonka.ai:8443/v1/epochs/current/participants)。  
            从列表中选择任意活跃主机。
            复制他们的 `inference_url` 值。
            将 `inference_url` 粘贴到浏览器中以加载仪表盘。
    
    2. 打开后，你将看到直接来自该主机节点的实时数据流。
    
    !!! note "为什么这很重要？"
        这种架构确保了去中心化：没有任何单一中心化服务器控制网络。在预览模式下，功能有限。你可以查看余额、交易和部分分析。如果你想发送代币、管理个人账户等，请解锁[完整模式](https://gonka.ai/zh/wallet/dashboard/#__tabbed_1_2)。

=== "**完整模式**"
    
    首先，使用预览模式打开仪表盘。访问后，继续按照以下说明启用所有功能。
    
    ### 1. 访问 Gonka 账户
    
    要解锁仪表盘的完整功能，你需要一个 Gonka 账户。
    
    - 已有账户？继续阅读下面的["设置外部钱包"](https://gonka.ai/zh/wallet/dashboard/#2)部分。
    - 新用户？先[创建 Gonka 账户](https://gonka.ai/zh/wallet/create-account/)，然后返回此处。
    
    ### 2. 设置外部钱包
    若需通过钱包与仪表盘进行交互，建议使用 [Keplr](https://www.keplr.app/){target=_blank}（一款基于 Cosmos 生态的浏览器扩展钱包）。
    
    ??? note "什么是钱包？"
        加密钱包是用于安全存储用户公钥和私钥的工具，使其能够管理、转账和购买加密资产。Gonka 基于 Cosmos-SDK 区块链框架构建，可通过 Keplr 钱包进行访问。
        
    - 如果你已安装 Keplr 浏览器扩展钱包，请前往["连接钱包"](https://gonka.ai/zh/wallet/dashboard/#3)部分继续操作。
    - 如果尚未设置，请按照以下步骤操作。
    
    为你的浏览器安装扩展。
            
    前往 [Keplr 官网](https://www.keplr.app/){target=_blank}，点击"Get Keplr wallet"。
            
    <a href="/images/dashboard_keplr_step_2_1.png" target="_blank"><img src="/images/dashboard_keplr_step_2_1.png" style="width:500px; height:auto;"></a>
            
    选择与你浏览器匹配的扩展。
            
    <a href="/images/dashboard_keplr_step_2_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_2.png" style="width:500px; height:auto;"></a>
            
    将选定的扩展添加到浏览器。
            
    === "Firefox"
            
        <a href="/images/dashboard_keplr_step_2_3.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3.png" style="width:500px; height:auto;"></a>
            
    === "Google Chrome"
            
        <a href="/images/dashboard_keplr_step_2_3_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3_2.png" style="width:500px; height:auto;"></a>

    安装扩展后，你应该在浏览器的右上角面板看到它。 
                
    <a href="/images/keplr_extension.png" target="_blank"><img src="/images/keplr_extension.png" style="width:500px; height:auto;"></a>

    此时，扩展已安装，但尚未连接到你的钱包。 
    接下来，打开扩展并登录你的钱包。登录后，按照以下步骤继续设置过程。

    点击"Import an Existing Wallet"。
                        
    <a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:500px; height:auto;"></a>
                        
    点击"Use recovery phrase or private key"
                
    <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:500px; height:auto;"></a>
                
    粘贴你的私钥。
    
    ??? note "关于钱包-桥接兼容性的重要说明"
        桥接目前需要特定的账户设置。某些钱包可能允许你创建 Gonka 账户甚至导出私钥，但这并不总意味着该账户能与桥接正常工作。若需使用桥接，请通过以下方式之一创建 Gonka 账户：

        - 使用 `inferenced` CLI 工具
        - 在 Keplr 中使用"使用 Google 连接"流程
        
        这些是需要以太坊桥接兼容性的用户推荐和支持的选项。详见[创建 Gonka 账户](https://gonka.ai/zh/wallet/create-account/)。
                
        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:500px; height:auto;"></a>
                        
    设置你的钱包。将你的密码保存在安全可靠的地方。
                        
    <a href="/images/keplr_set_up_your_wallet.png" target="_blank"><img src="/images/keplr_set_up_your_wallet.png" style="width:500px; height:auto;"></a>
                        
    在搜索栏中输入"Gonka"并选择 Gonka 链将其添加到钱包。
    
    <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:500px; height:auto;"></a>
    
    完成 — 你的 Gonka 账户已成功导入 Keplr！
                        
    <a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:500px; height:auto;"></a>
    
    ### 3. 连接钱包

    3.1.  按照[预览模式](https://gonka.ai/zh/wallet/dashboard/#__tabbed_1_1)说明打开 Gonka 仪表盘。 
    
    3.2. 在右上角，点击"Connect Wallet"开始。
    
    <a href="/images/dashboard_ping_pub_3_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_1.png" style="width:500px; height:auto;"></a>
    
    3.3. 选择 Keplr 并点击 Connect。
    
    <a href="/images/dashboard_ping_pub_3_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_2.png" style="width:500px; height:auto;"></a>
    
    3.4. 批准与 Gonka 网络的连接请求。

    <a href="/images/keplr_approve_connection.png" target="_blank"><img src="/images/keplr_approve_connection.png" style="width:250px; height:auto;"></a>
    
    3.5. 完成！你已成功将账户添加到钱包。
    
    <a href="/images/dashboard_ping_pub_3_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_4.png" style="width:500px; height:auto;"></a>
     
    ??? note "可选：如何在 Keplr 钱包中添加额外的 Gonka 账户 — 点击查看步骤"
        
        打开扩展，点击扩展窗口右上角的账户图标。
                        
        <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>
                        
         点击"Add wallet"按钮。
                        
        <a href="/images/dashboard_ping_pub_3_5_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_2.png" style="width:auto; height:337.5px; display:block;"></a>
                        
        点击"Import an Existing Wallet"。
                        
        <a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:450px; height:auto; display:block;"></a>
                        
        点击"Use recovery phrase or private key"
                
        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:450px; height:auto;"></a>
                
        粘贴你的私钥。
    
        ??? note "关于钱包-桥接兼容性的重要说明"
            桥接目前需要特定的账户设置。某些钱包可能允许你创建 Gonka 账户甚至导出私钥，但这并不总意味着该账户能与桥接正常工作。若需使用桥接，请通过以下方式之一创建 Gonka 账户：

            - 使用 `inferenced` CLI 工具
            - 在 Keplr 中使用"使用 Google 连接"流程
            
            这些是需要以太坊桥接兼容性的用户推荐和支持的选项。详见[创建 Gonka 账户](https://gonka.ai/zh/wallet/create-account/)。
                
        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:450px; height:auto;"></a>
                        
        为你的钱包命名以便参考。
                        
        <a href="/images/dashboard_ping_pub_3_5_5.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_5.png" style="width:450px; height:auto;"></a>
                        
        确保选择了 Gonka 链。
    
        <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:500px; height:auto;"></a>
    
        完成 — 你的 Gonka 账户已成功导入 Keplr！
                        
        <a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:450px; height:auto;"></a>
