# 交易与治理

所有治理操作均通过您的**冷账户机器**，使用存储在您文件密钥环中的**<COLD_KEY_NAME>**执行。这是您加入网络时创建的治理密钥（[参见快速入门](https://gonka.ai/host/quickstart/#local-machine-install-the-cli-tool)）。

交易通过RPC端点（此处称为`<NODE_URL>/chain-rpc/`）发送。如果您未指定`--node`，CLI默认使用`tcp://localhost:26657`。除非您在本地运行自己的节点，否则请始终提供`--node <NODE_URL>/chain-rpc/`。

此处支持并推荐无序交易，以避免序列争用。（[docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/learn/beginner/tx-lifecycle)）

???+ note "在交易命令中始终包含这些标志"
    - `--from <COLD_KEY_NAME>` → 使用您的冷治理密钥。
    - `--keyring-backend file` → 确保使用您的本地密钥签名（系统将提示您）。
    - `--unordered --timeout-duration=60s` → 使交易在限定时间内有效，绕过序列排序（v0.53+ 新增）。
    - `--gas=2000000` → 手动设置Gas上限（一个充足的固定值，足以支持这些交易）。注意：`--gas-adjustment`仅在使用`--gas auto`时乘以估算值，因此与固定`--gas`并用时会被忽略，不会增加缓冲。
    - `--node <NODE_URL>/chain-rpc/` → 除非您运行本地RPC节点，否则必须提供。
    - `--yes` → 自动批准广播。

有关交易生命周期和Gas的背景信息，请参阅[Cosmos SDK：交易](https://docs.cosmos.network/sdk/v0.53/learn/beginner/tx-lifecycle)和[Gas与费用](https://docs.cosmos.network/sdk/v0.53/learn/intro/sdk-design#modules)。

## 何时需要治理提案

任何影响网络的链上变更均需通过治理提案，例如：

- 更新模块参数（`MsgUpdateParams`）
- 执行软件升级
- 添加、更新或弃用推理模型
- 从社区池转移资金
- 其他必须通过治理模块批准和执行的操作

---

## 谁可以创建治理提案

任何拥有有效治理密钥（冷账户）的人都可以支付所需费用并创建治理提案。但每个提案仍需通过PoC加权投票由活跃参与者批准。

建议提案人在链下先讨论重大变更（例如通过[GitHub](https://github.com/gonka-ai)或[社区论坛](https://discord.gg/REcpeYc7P7)），以提高提案获批的可能性。

---

???+ note "需要提案创建、投票、投票权、资格和委托的详细信息吗？"
    - [创建提案](/governance/creating-proposals/)
    - [对提案进行投票](/governance/voting-on-proposals/)
    - [投票权、资格、委托](/governance/voting-power-eligibility/)

## 检查实时治理参数

治理参数可通过成功的提案更改。在准备提案、发布投票说明或解释提案是否可能通过之前，请始终查询链上的当前值。

```bash
inferenced query gov params -o json --node <NODE_URL>/chain-rpc/ \
  | jq '.params | {
      min_deposit,
      expedited_min_deposit,
      max_deposit_period,
      voting_period,
      expedited_voting_period,
      quorum,
      threshold,
      expedited_threshold,
      veto_threshold,
      burn_vote_veto
    }'
```

截至本文撰写时，主网使用48小时常规投票期、12小时快速投票期、25%最低投票率、>50%常规通过阈值、>66.7%快速通过阈值、>33.4%否决阈值、常规提案500 GNK最低存款、快速提案1000 GNK最低存款。

## 跟踪提案状态

```bash
# One proposal
inferenced query gov proposal <VOTE_PROPOSAL_ID> -o json --node <NODE_URL>/chain-rpc/
# Tally only
inferenced query gov tally <VOTE_PROPOSAL_ID> -o json --node <NODE_URL>/chain-rpc/
# List all
inferenced query gov proposals -o json --node <NODE_URL>/chain-rpc/
```
([docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/build/modules/gov/README))

有关完整的投票率、阈值、否决和`abstain`公式，请参阅[对提案进行投票](/governance/voting-on-proposals/#how-the-result-is-counted)。

**您还可以通过仪表板监控治理：**

- 节点仪表板模式：`<NODE_URL>/dashboard/gonka/gov`

??? note "节点仪表板示例"
    - [http://node1.gonka.ai:8000/dashboard/gonka/gov](http://node1.gonka.ai:8000/dashboard/gonka/gov)
    - [http://node2.gonka.ai:8000/dashboard/gonka/gov](http://node2.gonka.ai:8000/dashboard/gonka/gov)
    - 以及其他

??? note "社区仪表板"
    - [vote.gonka.vip/governance](https://vote.gonka.vip/governance)
    - [tracker.gonka.hyperfusion.io/governance](https://tracker.gonka.hyperfusion.io/governance)
    - [gonka.gg/network/proposals](https://gonka.gg/network/proposals)




---

## 备注

???+ note "备注"
    - **非有序事务语义。** 使用 `--unordered` 时，事务通过 `--timeout-duration` 携带过期时间，其序列号保持未设置。任何期望单调序列的外部工具不应依赖这些事务的序列号。（[docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/learn/beginner/tx-lifecycle)）
    - **气体调优。** 如果模拟结果紧张或验证者使用更高的最低气体价格，请根据网络策略提高 `--gas-adjustment` 或设置 `--gas-prices`。（[docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/learn/beginner/tx-lifecycle)）
