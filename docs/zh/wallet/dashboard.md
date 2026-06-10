# 开始使用仪表盘

仪表盘可实时展示链上活动。

与依赖单一中心化服务器不同，所有网络数据和推理指标都直接托管在节点（Hosts）的节点上。这意味着仪表盘可以连接到任意一个节点的服务器，并直接从源头获取实时网络数据。

您可以通过两种方式与仪表盘交互：

- **预览模式（Preview Mode）** — 无需创建账户即可浏览仪表盘并查看网络数据。
- **完整模式（Full Mode）** — 连接您的钱包后，解锁全部功能。

=== "**预览模式**"

    如果您想在设置账户前先探索网络或查看实时推理指标，请按以下步骤操作：
    
 
   1. 以下是创世节点列表。从下方随机选择一个节点，在新浏览器窗口/标签页中打开。
    
 
       - [http://36.189.234.237:17241](http://36.189.234.237:17241)  
 
       - [http://node1.gonka.ai:8443](http://node1.gonka.ai:8443)  
 
       - [http://node2.gonka.ai:8443](http://node2.gonka.ai:8443)  
 
       - [http://47.236.26.199:8000](http://47.236.26.199:8000)  
 
       - [http://47.236.19.22:18000](http://47.236.19.22:18000)  
 
       - [http://gonka.spv.re:8000](http://gonka.spv.re:8000)  
    
        ??? note "替代方式：完全去中心化地随机选择节点"
            打开节点列表：[http://node2.gonka.ai:8443/v1/epochs/current/participants](http://node2.gonka.ai:8443/v1/epochs/current/participants)。  
            从列表中选择任意一个活跃的节点（Host）。  
            复制其 `inference_url` 值。  
            将 `inference_url` 粘贴到浏览器地址栏以加载仪表盘。
    
 
   2. 打开后，您将看到直接从该节点服务器流式传输的实时数据。
    
    !!! note "为何这很重要？"
        此架构确保了去中心化：没有单一中心服务器控制整个网络。在预览模式下，功能有限，您只能查看余额、交易和部分分析数据。如需发送代币、管理个人账户等，请解锁[完整模式](https://gonka.ai/wallet/dashboard/#__tabbed_1_2)。

=== "**完整模式**"
    
    首先通过**预览模式**打开仪表盘，访问后继续按以下说明操作以启用所有功能。
    
 
   ### 1. 获取 Gonka 账户
    
    要解锁仪表盘的全部功能，您需要一个 Gonka 账户。
    
 
   - 已有账户？请跳转至下方 ["设置外部钱包"](https://gonka.ai/wallet/dashboard/#2-set-up-external-wallet)。
 
   - 新用户？请访问 [开发者快速入门](https://gonka.ai/developer/quickstart/){target=_blank} 或 [节点运营者快速入门](https://gonka.ai/host/quickstart/){target=_blank} 创建账户。
    
 
   ### 2. 设置外部钱包
    要通过钱包与仪表盘交互，建议使用 [Keplr](https://www.keplr.app/){target=_blank}（专为 Cosmos 生态链设计的浏览器插件钱包）。
    
    ??? note "什么是钱包？"
        加密钱包是用于安全存储用户的公钥和私钥的工具，支持用户管理、转账和购买加密资产。Gonka 构建于 Cosmos-SDK 区块链框架之上，可通过 Keplr 钱包访问。
        
 
   - 如果您已安装 Keplr 钱包插件，请跳转至 ["连接钱包"](https://gonka.ai/wallet/dashboard/#3-connect-wallet)。
 
   - 如果尚未设置，请按以下步骤操作。
    
    安装浏览器扩展程序。
            
    访问 [Keplr 官网](https://www.keplr.app/){target=_blank} 并点击 "Get Keplr wallet"。
            
    <a href="/images/dashboard_keplr_step_2_1.png" target="_blank"><img src="/images/dashboard_keplr_step_2_1.png" style="width:500px; height:auto;"></a>
            
    为您的浏览器选择对应的扩展程序。
            
    <a href="/images/dashboard_keplr_step_2_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_2.png" style="width:500px; height:auto;"></a>
            
    将所选扩展程序添加到您的浏览器。
            
    === "Firefox"
            
        <a href="/images/dashboard_keplr_step_2_3.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3.png" style="width:500px; height:auto;"></a>
            
    === "Google Chrome"
            
        <a href="/images/dashboard_keplr_step_2_3_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3_2.png" style="width:500px; height:auto;"></a>

    安装完成后，您将在浏览器右上角看到该插件图标。 
                
    <a href="/images/keplr_extension.png" target="_blank"><img src="/images/keplr_extension.png" style="width:500px; height:auto;"></a>

    此时插件已安装，但尚未连接到您的钱包。  
    接下来，请打开插件并登录您的钱包。登录后，请继续以下步骤完成设置。

    点击 "导入现有钱包（Import an Existing Wallet）"。
                        
    <a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:500px; height:auto;"></a>
                        
    点击 "使用助记词或私钥（Use recovery phrase or private key）"
                
    <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:500px; height:auto;"></a>
                
    粘贴您的私钥。
    
    ??? note "关于钱包桥接兼容性的重要提示：若您未来计划通过以太坊桥出售 Gonka 代币，请仔细阅读"
        以太坊桥是一种可在以太坊与其他区块链之间安全转移资产或数据的系统，通过在一条链上锁定代币并在另一条链上铸造等值代币实现跨链。本质上，这是您将在其他链上的代币用于以太坊生态的前提机制。  
                        
        **支持桥接（可导出/使用原始私钥）**：
                        
 
       - 通过 `inferenced` CLI 工具创建的账户
 
       - 通过 Keplr 中“使用 Google 登录”流程创建的账户
                    
        **不支持桥接（无法导出私钥）**：
                        
 
       - 通过助记词创建的 Keplr 钱包。Keplr 不提供私钥导出功能，因此若未来需要桥接兼容性，请避免在此类钱包中创建基于助记词的钱包。
                
        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:500px; height:auto;"></a>
                        
    设置您的钱包。请将密码妥善保存。
                        
    <a href="/images/keplr_set_up_your_wallet.png" target="_blank"><img src="/images/keplr_set_up_your_wallet.png" style="width:500px; height:auto;"></a>
                        
    在搜索栏中输入 “Gonka”，选择 Gonka 链并添加到您的钱包。
    
    <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:500px; height:auto;"></a>
    
    完成 — 您的 Gonka 账户已成功导入 Keplr！
                        
    <a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:500px; height:auto;"></a>
    
 
   ### 3. 连接钱包

    3.
1.  按照[预览模式](https://gonka.ai/wallet/dashboard/#__tabbed_1_1)说明打开 Gonka 仪表盘。 
    
    3.
2. 在右上角点击 "连接钱包（Connect Wallet）" 开始。
    
    <a href="/images/dashboard_ping_pub_3_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_1.png" style="width:500px; height:auto;"></a>
    
    3.
3. 选择 Keplr 并点击连接。
    
    <a href="/images/dashboard_ping_pub_3_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_2.png" style="width:500px; height:auto;"></a>
    
    3.
同意连接至 Gonka 网络的请求。 

    <a href="/images/keplr_approve_connection.png" target="_blank"><img src="/images/keplr_approve_connection.png" style="width:250px; height:auto;"></a>
    
    3.
完成！您已成功将账户添加至钱包。
    
    <a href="/images/dashboard_ping_pub_3_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_4.png" style="width:500px; height:auto;"></a>
     
    ??? note "可选：如何在 Keplr 钱包中添加额外的 Gonka 账户 — 点击查看步骤"
        
        打开插件，在插件窗口右上角点击账户图标。
                        
        <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>
                        
         点击 "添加钱包（Add wallet）" 按钮。
                        
        <a href="/images/dashboard_ping_pub_3_5_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_2.png" style="width:auto; height:337.5px; display:block;"></a>
                        
        点击 "导入现有钱包（Import an Existing Wallet）"。
                        
        <a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:450px; height:auto; display:block;"></a>
                        
        点击 "使用助记词或私钥（Use recovery phrase or private key）"
                
        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:450px; height:auto;"></a>
                
        粘贴您的私钥。
    
        ??? note "关于钱包桥接兼容性的重要提示：若您未来计划通过以太坊桥出售 Gonka 代币，请仔细阅读"
            以太坊桥是一种可在以太坊与其他区块链之间安全转移资产或数据的系统，通过在一条链上锁定代币并在另一条链上铸造等值代币实现跨链。本质上，这是您将在其他链上的代币用于以太坊生态的前提机制。目前 Gonka 尚未部署以太坊桥，未来任何此类桥的部署都需要链上治理批准。如果链上治理批准了以太坊桥，预计只有拥有原始私钥的账户才具备资格参与。
                        
            **支持桥接（可导出/使用原始私钥）**：
                        
 
           通过 `inferenced` CLI 工具创建的账户
 
           通过 Keplr 中“使用 Google 登录”流程创建的账户
                    
            **不支持桥接（无法导出私钥）**：
                        
 
           通过助记词创建的 Keplr 钱包。Keplr 不提供私钥导出功能，因此若未来需要桥接兼容性，请避免在此类钱包中创建基于助记词的钱包。
                
        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:450px; height:auto;"></a>
                        
        为钱包设置一个名称以便识别。
                        
        <a href="/images/dashboard_ping_pub_3_5_5.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_5.png" style="width:450px; height:auto;"></a>
                        
        确保已选中 Gonka 链。
    
        <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:500px; height:auto;"></a>
    
        完成 — 您的 Gonka 账户已成功导入 Keplr！
                        
        <a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:450px; height:auto;"></a>
