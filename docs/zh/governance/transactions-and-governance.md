# 交易与治理

所有治理操作均通过您的 **冷账户机器** 使用存储在文件密钥环中的 **<COLD_KEY_NAME>** 执行。这是您加入网络时创建的治理密钥（[参见快速入门](https://gonka.ai/host/quickstart/#local-machine-install-the-cli-tool)）。

交易通过一个RPC端点发送（此处称为 `<NODE_URL>/chain-rpc/`）。如果您未指定 `--node`，CLI将默认使用 `tcp://localhost:26657`。除非您在本地运行自己的节点，否则请始终提供 `--node <NODE_URL>/chain-rpc/`。

此处支持并推荐使用无序交易，以避免序列争用。（[docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/learn/beginner/tx-lifecycle))

???+ note "交易命令中始终包含这些标志"
    - `--from <COLD_KEY_NAME>` → 使用您的冷治理密钥。
    - `--keyring-backend file` → 确保使用您的本地密钥进行签名（您将收到提示）。
    - `--unordered --timeout-duration=60s` → 使交易在有限时间内有效，绕过序列排序（v0.53+ 新增功能）。
    - `--gas=2000000` → 手动设置gas上限（一个足够宽裕的固定值，足以处理这些交易）。注意：`--gas-adjustment` 仅在使用 `--gas auto` 时才会乘以估算值，因此与固定的 `--gas` 一起使用时会被忽略且不增加缓冲。
    - `--node <NODE_URL>/chain-rpc/` → 除非您运行本地RPC节点，否则必须提供。
    - `--yes` → 自动批准广播。

    有关交易生命周期和gas的背景信息，请参阅 [Cosmos SDK: 交易](https://docs.cosmos.network/sdk/v0.53/learn/beginner/tx-lifecycle) 和 [Gas与费用](https://docs.cosmos.network/sdk/v0.53/learn/intro/sdk-design#modules)。

## 何时需要治理提案

任何影响网络的链上变更都需要治理提案，例如：

- 更新模块参数（`MsgUpdateParams`）
- 执行软件升级
- 添加、更新或弃用推理模型
- 从社区资金池转移资金
- 任何必须通过治理模块批准并执行的其他操作

---

## 谁可以创建治理提案

任何拥有有效治理密钥（冷账户）的人都可以支付所需费用并创建治理提案。然而，每个提案仍需通过基于PoC权重的投票由活跃参与者批准。

建议提案人首先在链下讨论重大变更（例如，通过 [GitHub](https://github.com/gonka-ai) 或 [社区论坛](https://discord.com/invite/RADwCT2U6R)），以提高批准的可能性。

---

???+ note "需要提案创建、投票、投票权、资格和委托的详细信息？"
    - [创建提案](/governance/creating-proposals/)
    - [对提案进行投票](/governance/voting-on-proposals/)
    - [投票权、资格、委托](/governance/voting-power-eligibility/)

## 检查实时治理参数

成功的提案可以更改治理参数。在准备提案、发布投票说明或判断提案是否可能通过之前，请始终查询链上的当前值。

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

撰写本文时，主网使用48小时的常规投票期、12小时的快速投票期、25%的法定投票人数、>50%的常规赞成阈值、>66.7%的快速赞成阈值、>33.4%的否决阈值、常规提案的最低存款为500 GNK，快速提案的最低存款为1000 GNK。

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

关于完整的法定人数、阈值、否决和 `abstain` 公式，请参阅 [提案投票](/governance/voting-on-proposals/#how-the-result-is-counted)。

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
    - **无序交易语义。** 使用 `--unordered` 时，交易通过 `--timeout-duration` 携带过期时间，且其序列号未设置。期望单调序列的外部工具不得依赖这些交易的序列号。([docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/learn/beginner/tx-lifecycle))
    - **Gas 调优。** 如果模拟紧张或验证者使用更高的最低 Gas 价格，请根据网络策略提高 `--gas-adjustment` 或设置 `--gas-prices`。([docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/learn/beginner/tx-lifecycle))
