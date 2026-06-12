# 钱包与转账指南

本指南介绍如何在网络中使用钱包和代币：如何获取您的钱包地址、查询余额、发送代币以及跟踪交易记录。  
在执行任何钱包操作之前，您需要先访问您的账户。请根据您在网络中的角色遵循以下说明。

**您是节点提供者（Host）吗？**

您贡献计算资源，并获得代币作为奖励。  
在继续之前，您需要访问您的钱包，该钱包会在 `chain-node` 容器首次运行时自动创建。

**您是开发者（Developer）吗？**

如果您仅需进行推理调用（发送提示并获取结果），则无需 Gonka 账户——请前往 [开发者快速入门](https://gonka.ai/developer/quickstart/) 使用社区代理。

如果您正在运行自己的网关，或需要在链上持有和转账 GNK，请先 [创建一个 Gonka 账户](https://gonka.ai/wallet/create-account/)，然后返回此处。

在获得账户访问权限后，请回到本指南学习以下操作：

- [查询余额](https://gonka.ai/wallet/wallet-and-transfer-guide/#query-balance)
- [发送代币](https://gonka.ai/wallet/wallet-and-transfer-guide/#send-coins)
- [查看交易状态](https://gonka.ai/wallet/wallet-and-transfer-guide/#check-transaction-status)

## 代币单位

在链上，唯一有效的单位是 `ngonka`。所有余额、手续费和交易都必须仅使用 `ngonka`。  
Cosmos SDK 可能允许定义其他单位，但这些单位无效——SDK 不会自动在不同单位之间进行转换。  
`gonka` 仅用作链下的人类友好显示单位，表示 10 亿个 `ngonka`，该单位本身并不存在于链上。

**实际使用的单位**

| 单位 | 用途 | 是否在链上？ | 换算比例 |
| --- | --- | --- | --- |
| `ngonka` | 网络上使用的基础单位 |  |  |
| `gonka` |  |  |  |
## 获取您的钱包地址

在查询余额或发送资金之前，您需要知道您的钱包地址。

```bash
inferenced keys list [--keyring-backend test]
```

该命令会列出你在本地创建的所有钱包密钥（账户），以及它们的地址和公钥。示例输出：

```

- address: gonka1f85frkfw89cgpva0vgpyuldjgu6uhyd82hmjzr
  name: genesis
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A+Qpbyhtsdl5N/6O6S/qJ9uvtbI7OFFsO5dcNrpEU0nv"}'
  type: local
```

写下你的地址（用于接收代币和查询余额）。

---

## 查询余额

要检查你的余额，请使用以下命令，以确保转账前余额充足，或确认转账是否成功：
    

```bash
inferenced query bank balances <address> [--node <node_rpc_url>]
```

这显示了你钱包中有多少枚硬币。

**示例：**
    

```bash
inferenced query bank balances gonka1ddswmmmn38esxegjf6qw36mt4aqyw6etvysy5x --node http://node2.gonka.ai:8000/chain-rpc/
```

---

## 发送代币

在 Cosmos 中，资金转账是指在基于 Cosmos 的区块链内将代币从一个账户（钱包地址）转移到另一个账户。此类转账可用于支付服务费用，或在用户之间直接传递价值。

=== "CLI"

    你可以使用 Cosmos SDK 提供的命令行工具——具体来说，即 `inferenced` CLI——来执行转账操作。每笔转账都会被记录在区块链上，且必须包含有效的发送方、接收方、转账金额以及代币面额。
    
    当你已知自己的账户余额并获取了接收方地址后，即可发送代币。
    
 

 
 

 

```bash
    inferenced tx bank send <sender-key-name> <recipient-address> <coins> --chain-id gonka-mainnet [--node <node_rpc_url> | --keyring-backend test]
 
 
 
 
```

 
    !!! note
    
        `<sender-key-name>` 是你在密钥环中的**本地密钥名称**——即创建密钥时所选择的相同标签。可使用 `inferenced keys list` 查看本机上的密钥名称。

    **示例：**

 

 

 

 ```bash
    inferenced tx bank send genesis gonka1a3jpdl4epdts64gns3a3fy9hjv2n9e3v7kxx0e 100ngonka --chain-id gonka-mainnet
 
 
 
 
```

=== "Keplr（浏览器扩展）"

    使用 Keplr 钱包在 Gonka 链上进行 Gonka 账户之间的转账时，请先登录并打开您的 Keplr 钱包。
    
    <a href="/images/keplr_sender_txs_1.png" target="_blank"><img src="/images/keplr_sender_txs_1.png" style="width:250px; height:auto;"></a>
    
    在首页搜索 Gonka 链。
    
    <a href="/images/keplr_sender_txs_2.png" target="_blank"><img src="/images/keplr_sender_txs_1.png" style="width:250px; height:auto;"></a>
    
    点击“发送”。
    
    <a href="/images/keplr_sender_txs_3.png" target="_blank"><img src="/images/keplr_sender_txs_3.png" style="width:250px; height:auto;"></a>
    
    === "如果您已知收款方的 Gonka 钱包地址" 
            
        将收款方的 Gonka 钱包地址粘贴到地址栏中，并填写您要发送的金额。
    
        <a href="/images/keplr_sender_txs_4.png" target="_blank"><img src="/images/keplr_sender_txs_4.png" style="width:250px; height:auto;"></a>
    
    
    === "如果您不知道收款方的 Gonka 钱包地址"
    
        收款方应打开其已添加 Gonka 账户的 Keplr 钱包，点击余额上方的“复制地址”。
    
        <a href="/images/keplr_receiver_txs_1.png" target="_blank"><img src="/images/keplr_receiver_txs_1.png" style="width:250px; height:auto;"></a>
      
        他们需要在首页搜索 Gonka 链。
            
        <a href="/images/keplr_receiver_txs_2.png" target="_blank"><img src="/images/keplr_receiver_txs_2.png" style="width:250px; height:auto;"></a>
            
        然后复制并发送给您他们的钱包地址。
    
        <a href="/images/keplr_receiver_txs_3.png" target="_blank"><img src="/images/keplr_receiver_txs_3.png" style="width:250px; height:auto;"></a>

        将收款方的 Gonka 钱包地址粘贴到地址栏中，并填写您要发送的金额。
    
        <a href="/images/keplr_sender_txs_4.png" target="_blank"><img src="/images/keplr_sender_txs_4.png" style="width:250px; height:auto;"></a>
    
    
    确认并批准该交易。
    
    <a href="/images/keplr_sender_txs_5.png" target="_blank"><img src="/images/keplr_sender_txs_5.png" style="width:250px; height:auto;"></a>
    
    等待交易成功的提示。由于 Gonka 是非原生链，您不会在“活动”标签页中看到该交易记录。
    
    <a href="/images/keplr_sender_txs_6.png" target="_blank"><img src="/images/keplr_sender_txs_6.png" style="width:250px; height:auto;"></a>

=== "Keplr（手机应用）"

    使用 Keplr 手机钱包在 Gonka 链上进行 Gonka 账户之间的转账时，请先登录并打开您的 Keplr 钱包。
    
    <a href="/images/keplr_mobile_sender_1.PNG" target="_blank"><img src="/images/keplr_mobile_sender_1.PNG" style="width:250px; height:auto;"></a>
    
    在首页搜索 Gonka 链。
    
    <a href="/images/keplr_mobile_sender_2.PNG" target="_blank"><img src="/images/keplr_mobile_sender_2.PNG" style="width:250px; height:auto;"></a>
    
    点击“发送”。
    
    <a href="/images/keplr_mobile_sender_3.PNG" target="_blank"><img src="/images/keplr_mobile_sender_3.PNG" style="width:250px; height:auto;"></a>
    
    === "如果您已知收款方的 Gonka 钱包地址" 
            
        将收款方的 Gonka 钱包地址粘贴到地址栏中，并填写您要发送的金额。
    
        <a href="/images/keplr_mobile_sender_4.PNG" target="_blank"><img src="/images/keplr_mobile_sender_4.PNG" style="width:250px; height:auto;"></a>
    
    
    === "如果您不知道收款方的 Gonka 钱包地址"
    
        收款方应打开其已添加 Gonka 账户的 Keplr 钱包。  
    
         <a href="/images/keplr_mobile_receiver_1.PNG" target="_blank"><img src="/images/keplr_mobile_receiver_1.PNG" style="width:250px; height:auto;"></a>
      
         他们在首页搜索 Gonka 链并点击进入。
            
         <a href="/images/keplr_mobile_receiver_2.PNG" target="_blank"><img src="/images/keplr_mobile_receiver_2.PNG" style="width:250px; height:auto;"></a>

         他们可以在余额上方点击复制地址，或点击“收款”按钮，在下一步界面中复制自己的地址。

         <a href="/images/keplr_mobile_receiver_3.PNG" target="_blank"><img src="/images/keplr_mobile_receiver_3.PNG" style="width:250px; height:auto;"></a>

         然后复制并发送给您他们的钱包地址。
    
        <a href="/images/keplr_mobile_receiver_4.PNG" target="_blank"><img src="/images/keplr_mobile_receiver_4.PNG" style="width:250px; height:auto;"></a>

        将收款方的 Gonka 钱包地址粘贴到地址栏中，并填写您要发送的金额。
    
        <a href="/images/keplr_mobile_sender_4.PNG" target="_blank"><img src="/images/keplr_mobile_sender_4.PNG" style="width:250px; height:auto;"></a>
    
    
    确认并批准该交易。
    
    <a href="/images/keplr_mobile_sender_5.PNG" target="_blank"><img src="/images/keplr_mobile_sender_5.PNG" style="width:250px; height:auto;"></a>
    
    等待交易成功的确认页面。由于 Gonka 是非原生链，您不会在“活动”标签页中看到该交易记录。
    
    <a href="/images/keplr_mobile_sender_6.PNG" target="_blank"><img src="/images/keplr_mobile_sender_6.PNG" style="width:250px; height:auto;"></a>



---

## 查看交易状态

发送交易后，您可能需要确认交易是否已成功处理并被打包进区块。每笔交易都会被分配一个唯一的交易哈希（`TXHASH`），您可以使用该哈希在区块链上查询其状态。  
要查看交易状态，请使用以下命令：

```bash
inferenced query tx <TXHASH> --chain-id gonka-mainnet [--node <node_rpc_url>]
```

- 将 `<TXHASH>` 替换为执行转账命令后收到的实际交易哈希。
- 如有需要，可选择性指定节点和链 ID。

**示例：**

```bash
inferenced query tx 9712D97F127A1908C4DC4A1F4409AE380DC3BF0D662FA8D7E394422989CFFE2F --chain-id gonka-mainnet
```

如果交易成功，输出将包含以下内容：

- `code: 0` — 表示交易成功  
- 一个区块 `height` — 交易被包含的区块  
- 一个 `timestamp` — 区块被确认的时间  
- 交易消息的详细信息（例如，使用的 `sender`、`receiver`、`amount`、`module`、`gas`）

**示例响应（为清晰起见已截断）：**
```bash linenums="1"
code: 0
txhash: 9712D97F127A1908C4DC4A1F4409AE380DC3BF0D662FA8D7E394422989CFFE2F
height: "233596"
timestamp: "2025-04-24T02:21:24Z"
tx:
  ...
  body:
    messages:
 
    - '@type': /cosmos.bank.v1beta1.MsgSend
      from_address: gonka17ek5qgf94zsp024kppcyze37p95drr3wnt6jp3
      to_address: gonka1ydt57pmnsd508ckw4fh6ey6h299v50zljpylla
      amount:
 
      - amount: "10"
        denom: ngonka
```

如果代码非零，则交易失败。请检查 `raw_log` 或 info 字段中的错误信息。
