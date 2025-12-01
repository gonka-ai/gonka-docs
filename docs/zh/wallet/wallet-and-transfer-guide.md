# 钱包与转账指南

本指南介绍如何在网络上使用钱包与代币：获取钱包地址、查询余额、发送代币与查看交易状态。
开始之前，你需要能够访问你的账户。根据你在网络中的角色，按以下说明操作。

**你是主机（Host）吗？**

你向网络贡献算力并获得代币奖励。
继续之前，你需要访问你的钱包。钱包会在链节点（chain-node）容器首次运行时自动创建。

**你是开发者（Developer）吗？**

你利用网络的分布式算力构建与部署 AI 应用。你需要创建账户，并安装 CLI 工具以便脚本化与自动化操作。
请前往[这里](https://gonka.ai/developer/quickstart/)完成 CLI 安装并访问你的账户。

当你能够访问你的账户后，回到本指南继续：

- [查询余额](https://gonka.ai/wallet/wallet-and-transfer-guide/#query-balance)
- [发送代币](https://gonka.ai/wallet/wallet-and-transfer-guide/#send-coins)
- [查看交易状态](https://gonka.ai/wallet/wallet-and-transfer-guide/#check-transaction-status)

## 计量单位（Denominations）

在链上，唯一有效的计量单位是 `ngonka`。所有余额、手续费和交易必须全部使用 `ngonka`。  
Cosmos SDK 虽然允许定义额外的计量单位，但这些单位并不具有实际效用 —— SDK **不会**在它们之间执行任何自动换算。  
`gonka` 仅作为链下、面向用户的显示单位使用。它代表 10 亿（1,000,000,000）`ngonka`，并不存在于链上。

**有效单位（Effective Units）**

| Unit     | 用途（Purpose）               | 链上可用？（On-chain?） | 比例（Ratio）                                |
|----------|-------------------------------|--------------------------|-----------------------------------------------|
| `ngonka` | 网络中的基础单位               | 是（Yes）               | 1                                             |
| `gonka`  | 便于阅读的显示单位（链下）     | 否（No）                | 1 `gonka` = 1,000,000,000 `ngonka`            |

## 获取你的钱包地址

在查询余额或转账前，你需要知道你的钱包地址。

```bash
inferenced keys list [--keyring-backend test]
```

该命令会列出你在本地创建的所有钱包（账户）、其地址与公钥。示例输出：

```
- address: gonka1f85frkfw89cgpva0vgpyuldjgu6uhyd82hmjzr
  name: genesis
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A+Qpbyhtsdl5N/6O6S/qJ9uvtbI7OFFsO5dcNrpEU0nv"}'
  type: local
```
请记录下地址（用于接收代币与查询余额）。

---

## 查询余额

要检查余额（例如在转账前确认是否有充足资金，或在转账后验证是否到账），使用：

```bash
inferenced query bank balances <address> [--node <node_rpc_url>]
```
该命令会显示你钱包中的代币数量。

**示例：**

```bash
inferenced query bank balances gonka1a3jpdl4epdts64gns3a3fy9hjv2n9e3v7kxx0e --node http://node2.gonka.ai:26657
```

---

## Send Coins

在 Cosmos 中，资金转账指的是在 Cosmos 生态的区块链上，从一个账户（钱包地址）向另一个账户发送代币。
这些转账可用于支付服务费用，或在用户之间简单地传递价值。

=== "CLI"

    你可以使用 Cosmos SDK 的命令行工具 — 具体来说是 `inferenced` CLI — 来执行转账操作。
每笔转账都会记录在区块链上，并且需要有效的发送方、接收方、金额和代币单位。
    
    在你确认余额并获取接收方的地址后，就可以发送代币了。
    
    ```bash
    inferenced tx bank send <sender-key-name> <recipient-address> <coins> --chain-id gonka-mainnet [--node <node_rpc_url> | --keyring-backend test]
    ```

    **示例:**

    ```bash
    inferenced tx bank send genesis gonka1a3jpdl4epdts64gns3a3fy9hjv2n9e3v7kxx0e 100ngonka --chain-id gonka-mainnet
    ```

=== "Keplr (web-extension)"

    要使用 Keplr 钱包在 Gonka 链上进行 Gonka 账户之间的转账，请先登录并打开你的 Keplr 钱包。
    
    <a href="/images/keplr_sender_txs_1.png" target="_blank"><img src="/images/keplr_sender_txs_1.png" style="width:250px; height:auto;"></a>
    
    在主界面中搜索 Gonka 链。
    
    <a href="/images/keplr_sender_txs_2.png" target="_blank"><img src="/images/keplr_sender_txs_1.png" style="width:250px; height:auto;"></a>
    
    点击 “Send”。
    
    <a href="/images/keplr_sender_txs_3.png" target="_blank"><img src="/images/keplr_sender_txs_3.png" style="width:250px; height:auto;"></a>
    
    === "如果你已经知道接收方的 Gonka 钱包地址" 
            
        将接收方的 Gonka 钱包地址粘贴到地址栏中，并输入你要发送的金额。
    
        <a href="/images/keplr_sender_txs_4.png" target="_blank"><img src="/images/keplr_sender_txs_4.png" style="width:250px; height:auto;"></a>
    
    
    === "如果你不知道接收方的 Gonka 钱包地址"
    
        接收方需要打开已添加 Gonka 账户的 Keplr 钱包，然后点击余额上方的“Copy address”。
    
        <a href="/images/keplr_receiver_txs_1.png" target="_blank"><img src="/images/keplr_receiver_txs_1.png" style="width:250px; height:auto;"></a>
      
        他们搜索 Gonka 链。
            
        <a href="/images/keplr_receiver_txs_2.png" target="_blank"><img src="/images/keplr_receiver_txs_2.png" style="width:250px; height:auto;"></a>
            
        他们复制地址并发送给你。
    
        <a href="/images/keplr_receiver_txs_3.png" target="_blank"><img src="/images/keplr_receiver_txs_3.png" style="width:250px; height:auto;"></a>

        将接收方的 Gonka 钱包地址粘贴到地址栏中，并输入你要发送的金额。
    
        <a href="/images/keplr_sender_txs_4.png" target="_blank"><img src="/images/keplr_sender_txs_4.png" style="width:250px; height:auto;"></a>
    
    
    批准交易.
    
    <a href="/images/keplr_sender_txs_5.png" target="_blank"><img src="/images/keplr_sender_txs_5.png" style="width:250px; height:auto;"></a>
    
    等待交易成功通知。你不会在 Activity（活动）标签页看到该交易，因为 Gonka 是非原生链。
    
    <a href="/images/keplr_sender_txs_6.png" target="_blank"><img src="/images/keplr_sender_txs_6.png" style="width:250px; height:auto;"></a>

=== "Keplr (mobile app)"

    要使用 Keplr 钱包在 Gonka 链上进行 Gonka 账户之间的转账，请先登录并打开你的 Keplr 钱包。
    
    <a href="/images/keplr_mobile_sender_1.PNG" target="_blank"><img src="/images/keplr_mobile_sender_1.PNG" style="width:250px; height:auto;"></a>
    
    在主界面中搜索 Gonka 链。
    
    <a href="/images/keplr_mobile_sender_2.PNG" target="_blank"><img src="/images/keplr_mobile_sender_2.PNG" style="width:250px; height:auto;"></a>
    
    点击 “Send”。
    
    <a href="/images/keplr_mobile_sender_3.PNG" target="_blank"><img src="/images/keplr_mobile_sender_3.PNG" style="width:250px; height:auto;"></a>
    
    === "如果你已经知道接收方的 Gonka 钱包地址" 
            
        将接收方的 Gonka 钱包地址粘贴到地址栏中，并输入你要发送的金额。
    
        <a href="/images/keplr_mobile_sender_4.PNG" target="_blank"><img src="/images/keplr_mobile_sender_4.PNG" style="width:250px; height:auto;"></a>
    
    
    === "如果你不知道接收方的 Gonka 钱包地址"
    
        接收方需要打开已添加 Gonka 账户的 Keplr 钱包。  
    
         <a href="/images/keplr_mobile_receiver_1.PNG" target="_blank"><img src="/images/keplr_mobile_receiver_1.PNG" style="width:250px; height:auto;"></a>
      
         他们搜索 Gonka 链并点击进入。
            
         <a href="/images/keplr_mobile_receiver_2.PNG" target="_blank"><img src="/images/keplr_mobile_receiver_2.PNG" style="width:250px; height:auto;"></a>

         他们可以点击余额上方的地址进行复制，或点击“Receive”并在下一步页面中复制他们的地址。

         <a href="/images/keplr_mobile_receiver_3.PNG" target="_blank"><img src="/images/keplr_mobile_receiver_3.PNG" style="width:250px; height:auto;"></a>

         他们复制地址并将其发送给你。
    
        <a href="/images/keplr_mobile_receiver_4.PNG" target="_blank"><img src="/images/keplr_mobile_receiver_4.PNG" style="width:250px; height:auto;"></a>

        将接收方的 Gonka 钱包地址粘贴到地址栏中，并输入你要发送的金额。
    
        <a href="/images/keplr_mobile_sender_4.PNG" target="_blank"><img src="/images/keplr_mobile_sender_4.PNG" style="width:250px; height:auto;"></a>
    
    
    批准交易。
    
    <a href="/images/keplr_mobile_sender_5.PNG" target="_blank"><img src="/images/keplr_mobile_sender_5.PNG" style="width:250px; height:auto;"></a>
    
    等待显示交易成功的确认页面。你不会在 Activity（活动）标签页看到该交易，因为 Gonka 是非原生链。
    
    <a href="/images/keplr_mobile_sender_6.PNG" target="_blank"><img src="/images/keplr_mobile_sender_6.PNG" style="width:250px; height:auto;"></a>

---

## 查看交易状态

发起交易后，你可能需要确认它是否被成功处理并写入区块。每笔交易都有唯一哈希（`TXHASH`），可据此在链上查询其状态。

要查询交易状态，请使用：
```bash
inferenced query tx <TXHASH> --chain-id gonka-mainnet [--node <node_rpc_url>]
```

- 将 `<TXHASH>` 替换为转账命令返回的实际交易哈希。
- 如有需要，可以指定节点与链 ID。

**示例：**
```bash
inferenced query tx 9712D97F127A1908C4DC4A1F4409AE380DC3BF0D662FA8D7E394422989CFFE2F --chain-id gonka-mainnet
```
若交易成功，输出中将包含：

- `code: 0` — 表示成功
- 区块 `height` — 交易被写入的区块高度
- `timestamp` — 该区块提交时间
- 交易消息细节（如 `sender`、`receiver`、`amount`、`module`、`gas` 等）

**示例响应（为便于阅读已截断）：**
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
若 `code` 非 0，表示交易失败。请检查 `raw_log` 或 info 字段以获取错误原因。
