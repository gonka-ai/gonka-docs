# 提案

在Gonka中，有两种主要方式来提议和协调变更：治理提案和改进提案。

## 改进提案（链下）

用于讨论长期计划、重大架构设想以及制定社区路线图。它们类似于比特币的[BIPs](https://github.com/bitcoin/bips)。

- 作为Markdown文件管理，位于[/proposals](https://github.com/gonka-ai/gonka/tree/main/proposals)目录中
- 任何人都可以提交包含新提案的Pull Request
- 活跃参与者在GitHub上评审提案
- 如果获得批准，PR将被合并到仓库中

有关链下改进提案，请参阅[/proposals](https://github.com/gonka-ai/gonka/tree/main/proposals)文件夹。

## 治理提案（链上）
用于直接影响网络并需要链上投票的变更：

- 更改网络参数（例如通过`MsgUpdateParams`）
- 执行软件升级
- 引入新模型
- 引入新功能
- 任何其他必须由社区在链上批准的修改

治理权通过可验证的计算工作获得，而不是被动持有代币。默认情况下，每个Host仅有20%的PoC衍生投票权重被自动激活。要解锁剩余的80%，Host必须锁定GNK代币作为抵押品，从而将治理影响力与真实的经济承诺挂钩。技术细节，包括权重激活机制和抵押比率，详见[Gonka: Tokenomics](https://gonka.ai/tokenomics.pdf)。

!!! note "过渡期"
    在前180个epoch（约6个月）内，新参与者可以通过PoC单独参与治理并获得投票权重，无需抵押要求。在此期间，完整的治理权利可用，而投票权重仍与已验证的计算活动绑定。

### 关键治理参数

| **参数** | **当前主网值** | **描述** | **效果** |
| --- | --- | --- | --- |
| **最低抵押** | 普通提案为500 GNK（500,000,000,000 ngonka）；快速提案为1000 GNK（1,000,000,000,000 ngonka） |  |  |
| **法定人数** |  |  |  |
| **多数阈值** |  |  |  |
| **否决阈值** | 提交治理提案并进入投票阶段所需的最低抵押金额。 |  |  |

所有这些参数都可以通过治理提案进行修改，使网络能够随时间动态调整决策规则。在公布确切数值之前，请始终查询实时链上数据：

```bash
inferenced query gov params -o json --node <NODE_URL>/chain-rpc/ \
  | jq '.params | {
      min_deposit,
      expedited_min_deposit,
      voting_period,
      expedited_voting_period,
      quorum,
      threshold,
      expedited_threshold,
      veto_threshold,
      burn_vote_veto
    }'
```

关于链上治理步骤和完整计票公式，请参阅[详细指南](https://gonka.ai/governance/transactions-and-governance/)和[提案投票](https://gonka.ai/governance/voting-on-proposals/)。
