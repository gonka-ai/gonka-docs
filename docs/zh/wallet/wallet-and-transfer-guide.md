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

## 发送代币

在 Cosmos 中，转账是指在同一条 Cosmos 系区块链上将代币从一个账户（钱包地址）发送到另一个账户。典型用途包括支付服务费用或进行价值转移。你将使用 Cosmos SDK 的命令行工具（此处为 `inferenced` CLI）发起转账。每笔转账都会记录在链上，并且需要有效的发送方、接收方、金额与代币单位。

当你确认余额且知道接收方地址后，就可以发送代币：

```bash
inferenced tx bank send <sender-key-name> <recipient-address> <coins> --chain-id gonka-mainnet [--node <node_rpc_url> | --keyring-backend test]
```

**示例：**

```bash
inferenced tx bank send genesis gonka1a3jpdl4epdts64gns3a3fy9hjv2n9e3v7kxx0e 100igonka --chain-id gonka-mainnet
```

指定金额时，可使用以下面额：

- `ngonka`（指数 0，基础单位）
- `ugonka`（指数 3）
- `mgonka`（指数 6）
- `gonka`（指数 9）

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
