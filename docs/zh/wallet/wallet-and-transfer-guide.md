# 钱包与转账指南

本指南介绍如何在网络中使用钱包和代币：如何获取您的钱包地址、检查余额、发送代币以及跟踪交易。
在执行任何钱包操作之前，您需要访问您的账户。请根据您在网络中的角色遵循以下说明。

**您是主机吗？**

您提供计算资源并获得代币作为奖励。
在继续之前，您需要访问您的钱包，该钱包在 chain-node 容器首次运行时自动创建。

**您是开发者吗？**

如果您仅需要推理（发送提示并接收完成结果），则无需 Gonka 账户——请前往 [开发者快速入门](https://gonka.ai/developer/quickstart/) 使用社区代理开始使用。

如果您运行自己的网关或需要在链上持有和转移 GNK，请先 [创建 Gonka 账户](https://gonka.ai/wallet/create-account/)，然后返回此处。

一旦您已访问账户，请返回本指南学习如何：

- [查询余额](https://gonka.ai/wallet/wallet-and-transfer-guide/#query-balance)
- [发送代币](https://gonka.ai/wallet/wallet-and-transfer-guide/#send-coins)
- [检查交易状态](https://gonka.ai/wallet/wallet-and-transfer-guide/#check-transaction-status)

## 面额

链上唯一的有效面额是 `ngonka`。所有余额、费用和交易必须 exclusively 使用 `ngonka`。
Cosmos SDK 可能允许定义其他面额，但这些面额无效——SDK 不会在它们之间执行自动转换。
`gonka` 仅用作链下、用户友好的显示单位。它代表 10 亿 `ngonka`，在链上并不存在。

**有效单位**

| 单位 | 用途 | 链上？ | 比例 |
|--------|----------------------------------|-----------|--------------------------------------|
| `ngonka` | 网络上使用的基单位 | 是 | 1 |
| `gonka` | 易读的显示单位 | 否 | 1 `gonka` = 1,000,000,000 `ngonka` |

## 获取您的钱包地址

在检查余额或发送资金之前，您需要知道您的钱包地址。

```bash
inferenced keys list [--keyring-backend test]
```

此命令列出您本地创建的所有钱包密钥（账户）及其地址和公钥。示例输出：

```
- address: gonka1f85frkfw89cgpva0vgpyuldjgu6uhyd82hmjzr
  name: genesis
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A+Qpbyhtsdl5N/6O6S/qJ9uvtbI7OFFsO5dcNrpEU0nv"}'
  type: local
```
记下地址（用于接收代币和查询余额）。

---

## 查询余额

要检查余额，请在转账前确保您有足够的资金，或验证转账是否成功，请使用以下命令：

```bash
inferenced query bank balances <address> [--node <node_rpc_url>]
```

这将显示您的钱包中有多少代币。

**示例：**

```bash
inferenced query bank balances gonka1ddswmmmn38esxegjf6qw36mt4aqyw6etvysy5x --node http://node2.gonka.ai:8000/chain-rpc/
```

---

## 发送代币

在 Cosmos 中，资金转账是指在基于 Cosmos 的区块链中，从一个账户（钱包地址）向另一个账户发送代币。这些转账用于支付服务或在用户之间传递价值。

您也可以在 [Tangem](https://tangem.com/){target=_blank}（硬件钱包加移动应用）中发送和接收 GNK。

=== "CLI"

您可以使用 Cosmos SDK 命令行工具执行转账——具体而言，是 `inferenced` CLI。每个转账都会记录在区块链上，需要有效的发送方、接收方、金额和代币面额。

一旦您知道余额并拥有接收方地址，就可以发送代币。

    ```bash
    inferenced tx bank send <sender-key-name> <recipient-address> <coins> --chain-id gonka-mainnet [--node <node_rpc_url> | --keyring-backend test]
    ```

    !!! note 

        `<sender-key-name>` 是您密钥环中的 **本地密钥名称**——即创建密钥时您选择的标签。使用 `inferenced keys list` 查看此机器上的名称。

        **示例：**

    ```bash
    inferenced tx bank send genesis gonka1a3jpdl4epdts64gns3a3fy9hjv2n9e3v7kxx0e 100ngonka --chain-id gonka-mainnet
    ```

=== "Keplr（浏览器扩展）"

要使用Keplr钱包在Gonka链上进行Gonka账户之间的转账，请登录并打开您的Keplr钱包。

<a href="/images/keplr_sender_txs_1.png" target="_blank"><img src="/images/keplr_sender_txs_1.png" style="width:250px; height:auto;"></a>

在主页上搜索Gonka链。

<a href="/images/keplr_sender_txs_2.png" target="_blank"><img src="/images/keplr_sender_txs_1.png" style="width:250px; height:auto;"></a>

点击“发送”。

<a href="/images/keplr_sender_txs_3.png" target="_blank"><img src="/images/keplr_sender_txs_3.png" style="width:250px; height:auto;"></a>

=== "如果您已知接收方的Gonka钱包地址"

将接收方的Gonka钱包地址粘贴到地址字段中。指定您要发送的金额。

<a href="/images/keplr_sender_txs_4.png" target="_blank"><img src="/images/keplr_sender_txs_4.png" style="width:250px; height:auto;"></a>


=== "如果您不知道接收方的Gonka钱包地址"

接收方应打开其Keplr钱包并确保已添加Gonka账户。点击余额上方的“复制地址”。

<a href="/images/keplr_receiver_txs_1.png" target="_blank"><img src="/images/keplr_receiver_txs_1.png" style="width:250px; height:auto;"></a>

他们搜索Gonka链。

<a href="/images/keplr_receiver_txs_2.png" target="_blank"><img src="/images/keplr_receiver_txs_2.png" style="width:250px; height:auto;"></a>

他们复制并发送给您他们的地址。

<a href="/images/keplr_receiver_txs_3.png" target="_blank"><img src="/images/keplr_receiver_txs_3.png" style="width:250px; height:auto;"></a>

将接收方的Gonka钱包地址粘贴到地址字段中。指定您要发送的金额。

<a href="/images/keplr_sender_txs_4.png" target="_blank"><img src="/images/keplr_sender_txs_4.png" style="width:250px; height:auto;"></a>


确认交易。

<a href="/images/keplr_sender_txs_5.png" target="_blank"><img src="/images/keplr_sender_txs_5.png" style="width:250px; height:auto;"></a>

等待交易成功的通知。由于Gonka是非原生链，您不会在活动标签中看到该交易。

<a href="/images/keplr_sender_txs_6.png" target="_blank"><img src="/images/keplr_sender_txs_6.png" style="width:250px; height:auto;"></a>

=== "Keplr（移动应用）"

要使用Keplr钱包在Gonka链上进行Gonka账户之间的转账，请登录并打开您的Keplr钱包。

<a href="/images/keplr_mobile_sender_1.PNG" target="_blank"><img src="/images/keplr_mobile_sender_1.PNG" style="width:250px; height:auto;"></a>

在主页上搜索Gonka链。

<a href="/images/keplr_mobile_sender_2.PNG" target="_blank"><img src="/images/keplr_mobile_sender_2.PNG" style="width:250px; height:auto;"></a>

点击“发送”。

<a href="/images/keplr_mobile_sender_3.PNG" target="_blank"><img src="/images/keplr_mobile_sender_3.PNG" style="width:250px; height:auto;"></a>

=== "如果您已知接收方的Gonka钱包地址"

将接收方的Gonka钱包地址粘贴到地址字段中。指定您要发送的金额。

<a href="/images/keplr_mobile_sender_4.PNG" target="_blank"><img src="/images/keplr_mobile_sender_4.PNG" style="width:250px; height:auto;"></a>


=== "如果您不知道接收方的Gonka钱包地址"

接收方应打开其Keplr钱包并确保已添加Gonka账户。

<a href="/images/keplr_mobile_receiver_1.PNG" target="_blank"><img src="/images/keplr_mobile_receiver_1.PNG" style="width:250px; height:auto;"></a>

他们搜索Gonka链并点击。

<a href="/images/keplr_mobile_receiver_2.PNG" target="_blank"><img src="/images/keplr_mobile_receiver_2.PNG" style="width:250px; height:auto;"></a>

他们复制余额上方的地址，或点击“接收”并在下一步中复制地址。

<a href="/images/keplr_mobile_receiver_3.PNG" target="_blank"><img src="/images/keplr_mobile_receiver_3.PNG" style="width:250px; height:auto;"></a>

他们将地址复制并发送给你。

<a href="/images/keplr_mobile_receiver_4.PNG" target="_blank"><img src="/images/keplr_mobile_receiver_4.PNG" style="width:250px; height:auto;"></a>

将接收方的 Gonka 钱包地址粘贴到地址字段中，并指定你要发送的金额。

<a href="/images/keplr_mobile_sender_4.PNG" target="_blank"><img src="/images/keplr_mobile_sender_4.PNG" style="width:250px; height:auto;"></a>


确认交易。

<a href="/images/keplr_mobile_sender_5.PNG" target="_blank"><img src="/images/keplr_mobile_sender_5.PNG" style="width:250px; height:auto;"></a>

等待屏幕显示交易成功的确认信息。由于 Gonka 是非原生链，你不会在活动标签中看到该交易。

<a href="/images/keplr_mobile_sender_6.PNG" target="_blank"><img src="/images/keplr_mobile_sender_6.PNG" style="width:250px; height:auto;"></a>



---

## 检查交易状态

发送交易后，你可能希望验证交易是否已成功处理并包含在区块中。每个交易都会分配一个唯一的哈希值（`TXHASH`），你可以使用它在区块链上查询其状态。
要检查交易状态，请使用以下命令：
```bash
inferenced query tx <TXHASH> --chain-id gonka-mainnet [--node <node_rpc_url>]
```

- 将 `<TXHASH>` 替换为你从转账命令中收到的实际交易哈希。
- 如有需要，可选择指定节点和链 ID。

**示例：**
```bash
inferenced query tx 9712D97F127A1908C4DC4A1F4409AE380DC3BF0D662FA8D7E394422989CFFE2F --chain-id gonka-mainnet
```
如果交易成功，输出将包含：

- `code: 0` — 表示成功
- 区块 `height` — 交易被包含的区块
- `timestamp` — 区块提交的时间
- 交易消息的详细信息（例如使用的 `sender`、`receiver`、`amount`、`module`、`gas`）

**示例响应（为清晰起见已简化）：**
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
如果代码非零，则交易失败。请检查 `raw_log` 或 info 字段以获取错误信息。
