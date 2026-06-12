# 开始使用仪表盘
仪表盘展示实时的链上活动。

与依赖单一中心化服务器不同，所有网络数据和推理指标都直接托管在节点（Hosts）的节点上。这意味着仪表盘可以连接到任意一个节点的主机，并直接从源头获取实时网络数据。

您可以通过两种方式与仪表盘进行交互：

- **预览模式** —— 在不创建账户的情况下浏览仪表盘并查看网络数据。
- **完整模式** —— 通过连接您的钱包解锁全部功能。

=== "**预览模式**"

    如果您想在设置个人账户之前探索网络或查看实时推理指标，请按照以下步骤操作：
    
 
 
  1. 以下是创世节点列表。从下方列表中选择任意一个节点，并在新的浏览器窗口/标签页中打开。
    
 
 
      - [http://36.189.234.237:17241](http://36.189.234.237:17241)  
 
 
      - [https://node1.gonka.ai:8443](https://node1.gonka.ai:8443)  
 
 
      - [https://node2.gonka.ai:8443](https://node2.gonka.ai:8443)  
 
 
      - [http://47.236.26.199:8000](http://47.236.26.199:8000)  
 
 
      - [http://47.236.19.22:18000](http://47.236.19.22:18000)  
 
 
      - [http://gonka.spv.re:8000](http://gonka.spv.re:8000)  
    
        ??? note "替代方案：完全去中心化地随机选择节点"
            打开节点列表：[http://node2.gonka.ai:8443/v1/epochs/current/participants](http://node2.gonka.ai:8443/v1/epochs/current/participants)。  
            从列表中选择任意一个活跃的节点。
            复制其 `inference_url` 值。
            将 `inference_url` 粘贴到浏览器地址栏以加载仪表盘。
    
 
 
  2. 打开后，您将看到直接从该节点主机流式传输的实时数据。
    
 
 
  !!! note "为什么这很重要？"
        此架构确保了去中心化：没有单一中心服务器控制整个网络。在预览模式下，功能有限。您可以查看余额、交易记录和部分分析数据。如果您想发送代币、管理个人账户等，请解锁[完整模式](https://gonka.ai/wallet/dashboard/#__tabbed_1_2)。

        === "**完整模式**"
    
    首先，使用**预览模式**打开仪表盘。访问后，请继续阅读以下说明以启用所有功能。
    
 
 
  ### 1. 获取 Gonka 账户
    
    要解锁仪表盘的全部功能，您需要一个 Gonka 账户。
    
 
 
  - 已有账户？请跳转至下方 ["设置外部钱包"](https://gonka.ai/wallet/dashboard/#2-set-up-external-wallet) 部分。
 
 
  - 新用户？请先[创建一个 Gonka 账户](https://gonka.ai/wallet/create-account/)，然后返回此处。
    
 
 
  ### 2. 设置外部钱包
    要通过钱包与仪表盘交互，建议使用 [Keplr](https://www.keplr.app/){target=_blank}（专为 Cosmos 系列区块链设计的浏览器插件钱包）。
    
    ??? note "什么是钱包？"
        加密钱包是用户公钥和私钥的安全容器，使其能够管理、转账和购买加密货币。Gonka 构建于 Cosmos-SDK 区块链框架之上，可通过 Keplr 钱包访问。
        
 
 
  - 如果您已安装 Keplr 钱包浏览器插件，请直接前往 ["连接钱包"](https://gonka.ai/wallet/dashboard/#3-connect-wallet) 部分。
 
 
  - 如果尚未设置，请按以下步骤操作。
    
    为您的浏览器安装扩展程序。
            
    访问 [Keplr 官方网站](https://www.keplr.app/){target=_blank} 并点击“获取 Keplr 钱包”。
            
    <a href="/images/dashboard_keplr_step_2_1.png" target="_blank"><img src="/images/dashboard_keplr_step_2_1.png" style="width:500px; height:auto;"></a>
            
    为您的浏览器选择对应的扩展程序。
            
    <a href="/images/dashboard_keplr_step_2_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_2.png" style="width:500px; height:auto;"></a>
            
    将所选扩展程序添加到您的浏览器中。
            
    === "Firefox"
            
        <a href="/images/dashboard_keplr_step_2_3.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3.png" style="width:500px; height:auto;"></a>
            
    === "Google Chrome"
            
        <a href="/images/dashboard_keplr_step_2_3_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3_2.png" style="width:500px; height:auto;"></a>

    安装完成后，您应在浏览器右上角看到该插件图标。 
                
    <a href="/images/keplr_extension.png" target="_blank"><img src="/images/keplr_extension.png" style="width:500px; height:auto;"></a>

    此时插件已安装，但尚未连接到您的钱包。  
    接下来，打开插件并登录您的钱包。登录成功后，请按照以下步骤继续完成设置。

    点击“导入现有钱包”。
                        
    <a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:500px; height:auto;"></a>
                        
    点击“使用恢复短语或私钥”
                
    <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:500px; height:auto;"></a>
                
    粘贴您的私钥。
    
    ??? note "关于钱包桥接兼容性的重要说明"
        当前桥接功能需要特定的账户设置。某些钱包可能允许您创建 Gonka 账户并导出私钥，但这并不总能保证账户与桥接功能完全兼容。如需使用桥接功能，请通过以下任一方式创建您的 Gonka 账户：

 
 
      - 使用 `inferenced` CLI 工具
 
 
      - 在 Keplr 中使用“使用 Google 登录”流程
        
        这些是需要以太坊桥接兼容性的用户的推荐和支持方式。详情请参阅 [创建 Gonka 账户](https://gonka.ai/wallet/create-account/)。
                
        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:500px; height:auto;"></a>
                        
    设置您的钱包。请将密码安全保存。
                        
    <a href="/images/keplr_set_up_your_wallet.png" target="_blank"><img src="/images/keplr_set_up_your_wallet.png" style="width:500px; height:auto;"></a>
                        
    在搜索栏中输入“Gonka”，然后选择 Gonka 链以将其添加到您的钱包。
    
    <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:500px; height:auto;"></a>
    
    完成 — 您的 Gonka 账户已成功导入 Keplr！
                        
    <a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:500px; height:auto;"></a>
    
 
 
  ### 3. 连接钱包

 
   3.
1.  根据[预览模式](https://gonka.ai/wallet/dashboard/#__tabbed_1_1)说明打开 Gonka 仪表盘。 
    
 
   3.
2. 在右上角，点击“连接钱包”开始操作。
    
    <a href="/images/dashboard_ping_pub_3_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_1.png" style="width:500px; height:auto;"></a>
    
 
   3.
3. 选择 Keplr 并点击连接。
    
    <a href="/images/dashboard_ping_pub_3_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_2.png" style="width:500px; height:auto;"></a>
    
 
   3.
4. 同意连接请求，授权访问 Gonka 网络。 

    <a href="/images/keplr_approve_connection.png" target="_blank"><img src="/images/keplr_approve_connection.png" style="width:250px; height:auto;"></a>
    
 
   3.
5. 完成！您已成功将账户添加至钱包。
    
    <a href="/images/dashboard_ping_pub_3_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_4.png" style="width:500px; height:auto;"></a>
     
    ??? note "可选：如何在 Keplr 钱包中添加另一个 Gonka 账户 — 点击查看步骤"
        
        打开插件，在插件窗口右上角点击账户图标。
                        
        <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>
                        
         点击“添加钱包”按钮。
                        
        <a href="/images/dashboard_ping_pub_3_5_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_2.png" style="width:auto; height:337.5px; display:block;"></a>
                        
        点击“导入现有钱包”。
                        
        <a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:450px; height:auto; display:block;"></a>
                        
        点击“使用恢复短语或私钥”
                
        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:450px; height:auto;"></a>
                
        粘贴您的私钥。
    
        ??? note "关于钱包桥接兼容性的重要说明"
            当前桥接功能需要特定的账户设置。某些钱包可能允许您创建 Gonka 账户并导出私钥，但这并不总能保证账户与桥接功能完全兼容。如需使用桥接功能，请通过以下任一方式创建您的 Gonka 账户：

 
 
          - 使用 `inferenced` CLI 工具
 
 
          - 在 Keplr 中使用“使用 Google 登录”流程
            
            这些是需要以太坊桥接兼容性的用户的推荐和支持方式。详情请参阅 [创建 Gonka 账户](https://gonka.ai/wallet/create-account/)。
                
        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:450px; height:auto;"></a>
                        
        为您的钱包设置一个名称以便识别。
                        
        <a href="/images/dashboard_ping_pub_3_5_5.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_5.png" style="width:450px; height:auto;"></a>
                        
        确保已选中 Gonka 链。
    
        <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:500px; height:auto;"></a>
    
        完成 — 您的 Gonka 账户已成功导入 Keplr！
                        
        <a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:450px; height:auto;"></a>
