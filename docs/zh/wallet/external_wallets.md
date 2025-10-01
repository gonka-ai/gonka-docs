# 将 Gonka 网络添加到 Keplr 与 Leap 钱包

本指南介绍如何在 Keplr 与 Leap 钱包中添加 Gonka 网络。

内容分为两部分：

1. 完整安装 — 如果你尚未安装 Keplr 或 Leap，这一部分将提供从零创建并设置钱包的步骤。
2. 快速添加 — 如果你已安装 Keplr 或 Leap，可直接跳转到将 Gonka 网络添加到现有钱包的步骤。

=== "完整安装（如果你还没有 Keplr 或 Leap）"
    
    ??? note "什么是钱包？"
        加密钱包是用于安全存储用户公钥与私钥的容器，帮助管理、转移与购买加密货币。Gonka 基于 Cosmos-SDK 区块链框架构建，可通过 Keplr 或 Leap 钱包访问（更多钱包支持即将到来）。
        
    === "Keplr"
    
        访问[Keplr 官方网站](https://www.keplr.app/){target=_blank}并点击“Get Keplr wallet”。
    
        <a href="/images/dashboard_keplr_step_2_1.png" target="_blank"><img src="/images/dashboard_keplr_step_2_1.png" style="width:500px; height:auto;"></a>
    
        选择与你浏览器匹配的扩展程序。
    
        <a href="/images/dashboard_keplr_step_2_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_2.png" style="width:500px; height:auto;"></a>
    
        将扩展程序添加到浏览器。
    
        === "Firefox"
    
            <a href="/images/dashboard_keplr_step_2_3.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3.png" style="width:500px; height:auto;"></a>
    
        === "Google Chrome"
    
            <a href="/images/dashboard_keplr_step_2_3_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3_2.png" style="width:500px; height:auto;"></a>
    
        点击“Import an existing wallet（导入已有钱包）”。
    
        <a href="/images/dashboard_keplr_step_2_4.png" target="_blank"><img src="/images/dashboard_keplr_step_2_4.png" style="width:500px; height:auto;"></a>
    
        点击“Use recovery phrase or private key（使用助记词或私钥）”。
    
        <a href="/images/dashboard_keplr_step_2_5.png" target="_blank"><img src="/images/dashboard_keplr_step_2_5.png" style="width:500px; height:auto;"></a>
    
        将你在 CLI 中于[此步骤](https://gonka.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=your%2Daccount%2Daddress%3E-,3.%20Add%20Private%20Key%20to%20environment%20variables,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using)创建的私钥粘贴到此处。不要导入你的恢复（助记词/种子）短语，因为跨链桥需要直接访问原始私钥以签名交易并确保与以太坊的正确互操作性。
    
        <a href="/images/dashboard_keplr_step_2_6_private key.png" target="_blank"><img src="/images/dashboard_keplr_step_2_6_private_key.png" style="width:500px; height:auto;"></a>
    
        为你的钱包设置一个便于识别的名称。
    
        <a href="/images/dashboard_keplr_step_2_6.png" target="_blank"><img src="/images/dashboard_keplr_step_2_6.png" style="width:500px; height:auto;"></a>
    
        选择 Cosmos Hub 与 Ethereum。
    
        <a href="/images/dashboard_keplr_step_2_7.png" target="_blank"><img src="/images/dashboard_keplr_step_2_7.png" style="width:500px; height:auto;"></a>
    
        完成 — 你的 Gonka 账户已成功导入 Keplr！
    
        <a href="/images/dashboard_keplr_step_2_8.png" target="_blank"><img src="/images/dashboard_keplr_step_2_8.png" style="width:500px; height:auto;"></a>
    
    === "Leap"
    
        访问[Leap 官方网站](https://www.leapwallet.io/){target=_blank}并点击“Download Leap”。
    
        <a href="/images/dashboard_leap_step_2_1.png" target="_blank"><img src="/images/dashboard_leap_step_2_1.png" style="width:500px; height:auto;"></a>
    
        将扩展程序添加到浏览器。
    
        <a href="/images/dashboard_leap_step_2_2.png" target="_blank"><img src="/images/dashboard_leap_step_2_2.png" style="width:500px; height:auto;"></a>
    
        点击“Import an existing wallet（导入已有钱包）”。
    
        <a href="/images/dashboard_leap_step_2_3.png" target="_blank"><img src="/images/dashboard_leap_step_2_3.png" style="width:500px; height:auto;"></a>
    
        选择“Import private key（导入私钥）”。不要选择“Import recovery phrase（导入助记词）”，因为跨链桥需要直接访问原始私钥以签名交易并确保与以太坊的正确互操作性。
    
        <a href="/images/dashboard_leap_step_2_4.png" target="_blank"><img src="/images/dashboard_leap_step_2_4.png" style="width:500px; height:auto;"></a>
    
        粘贴你在[此处通过 CLI 创建的私钥](https://gonka.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=request%20in%20Python%3A-,3.1.%20Export%20your%20private%20key%20(for%20demo/testing%20only).,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using)。
    
        <a href="/images/dashboard_leap_2_5_private_key.png" target="_blank"><img src="/images/dashboard_leap_2_5_private_key.png" style="width:500px; height:auto;"></a>
    
        创建你的密码。
    
        <a href="/images/dashboard_leap_step_2_6.png" target="_blank"><img src="/images/dashboard_leap_step_2_6.png" style="width:500px; height:auto;"></a>
    
        完成 — 你的 Gonka 账户已成功导入 Leap！
    
        <a href="/images/dashboard_leap_step_2_7.png" target="_blank"><img src="/images/dashboard_leap_step_2_7.png" style="width:500px; height:auto;"></a>

=== "快速添加（如果你已安装 Keplr 或 Leap）"
      
    === "Keplr"
        
        打开扩展并点击扩展窗口右上角的账户图标。
            
        <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>
            
        点击“Add wallet（添加钱包）”。
            
        <a href="/images/dashboard_ping_pub_3_5_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_2.png" style="width:auto; height:337.5px; display:block;"></a>
            
        点击“Import an Existing Wallet（导入已有钱包）”。
            
        <a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:450px; height:auto; display:block;"></a>
            
        点击“Use recovery phrase or private key（使用助记词或私钥）”。
    
        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:450px; height:auto;"></a>
    
        将你在 CLI 中于[此步骤](https://gonka.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=request%20in%20Python%3A-,3.1.%20Export%20your%20private%20key%20(for%20demo/testing%20only).,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using)创建的私钥粘贴到此处。不要导入恢复（助记词/种子）短语，因为跨链桥需要直接访问原始私钥以签名交易并确保与以太坊的正确互操作性。
    
        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:450px; height:auto;"></a>
            
        为你的钱包设置一个便于识别的名称。
            
        <a href="/images/dashboard_ping_pub_3_5_5.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_5.png" style="width:450px; height:auto;"></a>
            
        选择 Cosmos Hub 与 Ethereum。
    
        <a href="/images/dashboard_ping_pub_3_5_6.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_6.png" style="width:450px; height:auto; display:block;"></a>
            
        完成 — 你的 Gonka 账户已成功导入 Keplr！
            
        <a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:450px; height:auto;"></a>
        
    === "Leap"
            
        打开扩展并点击扩展窗口顶部中间的青蛙图标与钱包名称按钮。
            
        <a href="/images/dashboard_leap_step_3_5_1.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_1.png" style="width:250px; height:auto;"></a>
            
        点击“Create/Import wallet（创建/导入钱包）”。
            
        <a href="/images/dashboard_leap_step_3_5_2.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_2.png" style="width:250px; height:auto;"></a>
            
        选择“Import using private key（使用私钥导入）”。不要选择“Import using recovery phrase（使用助记词导入）”，因为跨链桥需要直接访问原始私钥以签名交易并确保与以太坊的正确互操作性。
            
        <a href="/images/dashboard_leap_step_3_5_3.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_3.png" style="width:250px; height:auto;"></a>
    
        将你在[此处通过 CLI 创建的私钥](https://gonka.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=request%20in%20Python%3A-,3.1.%20Export%20your%20private%20key%20(for%20demo/testing%20only).,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using)粘贴到此处。
    
        <a href="/images/dashboard_leap_step_3_5_3.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_4_private_key.png" style="width:250px; height:auto;"></a>
            
        完成 — 你的 Gonka 账户已成功导入 Leap 钱包（点击顶部中间的青蛙图标与钱包名称按钮即可在钱包间切换）。
