# 交易与治理

所有治理操作均需在您的 **冷账户机器** 上执行，使用存储在本地密钥环中的 **<COLD_KEY_NAME>**。这是您加入网络时创建的治理密钥（[参见快速入门](https://gonka.ai/host/quickstart/#local-machine-install-the-cli-tool)）。

交易通过一个 RPC 端点发送（此处表示为 `<NODE_URL>/chain-rpc/`）。如果您未指定 `--node` 参数，CLI 将默认使用 `tcp://localhost:26657`。除非您本地运行节点，否则请始终提供 `--node <NODE_URL>/chain-rpc/`。

此处支持并推荐使用**无序交易**，以避免序列争用问题。（[docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/learn/beginner/tx-lifecycle)）

???
+ note "交易命令中请始终包含以下标志"
 
   - `--from <COLD_KEY_NAME>` → 使用您的冷治理密钥。
 
   - `--keyring-backend file` → 确保使用本地密钥进行签名（您将收到提示输入密码）。
 
   - `--unordered --timeout-duration=60s` → 使交易在有限时间内有效，绕过序列顺序限制（v0.53
+ 新增功能）。
 
   - `--gas=2000000` → 手动设置 gas 上限（一个较宽松的固定值，足以覆盖此类交易）。注意：`--gas-adjustment` 仅在使用 `--gas auto` 时对估算值进行乘法调整，因此与固定 `--gas` 一起使用时将被忽略，不会增加额外缓冲。
 
   - `--node <NODE_URL>/chain-rpc/` → 除非您运行本地 RPC 节点，否则必须提供。
 
   - `--yes` → 自动确认广播交易。

    有关交易生命周期和 gas 的背景信息，请参阅 [Cosmos SDK：交易](https://docs.cosmos.network/sdk/v0.53/learn/beginner/tx-lifecycle) 和 [Gas 与费用](https://docs.cosmos.network/sdk/v0.53/learn/intro/sdk-design#modules)。

## 何时需要提交治理提案

当需要对网络进行影响链上状态的变更时，必须通过治理提案来完成，例如：

- 更新模块参数（`MsgUpdateParams`）
- 执行软件升级
- 添加、更新或弃用推理模型
- 从社区资金池转移资金
- 任何其他必须通过治理模块批准并执行的操作

---

## 谁可以创建治理提案

任何拥有有效治理密钥（冷账户）的用户都可以支付所需费用并创建治理提案。然而，每个提案仍需通过基于 PoC 加权的投票机制，由活跃参与者批准。

建议提案人在链下先行讨论重大变更（例如通过 [GitHub](https://github.com/gonka-ai) 或 [社区论坛](https://discord.com/invite/RADwCT2U6R)），以提高提案通过的可能性。

---

???
+ note "需要了解提案创建、投票、投票权、资格及委托的详细信息？"
 
   - [创建提案](/governance/creating-proposals/)
 
   - [对提案进行投票](/governance/voting-on-proposals/)
 
   - [投票权、资格与委托](/governance/voting-power-eligibility/)

## 跟踪提案状态

```bash
# One proposal
inferenced query gov proposal <VOTE_PROPOSAL_ID> -o json --node <NODE_URL>/chain-rpc/
# Tally only
inferenced query gov tally <VOTE_PROPOSAL_ID> -o json --node <NODE_URL>/chain-rpc/
# List all
inferenced query gov proposals -o json --node <NODE_URL>/chain-rpc/
```
（[docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/build/modules/gov/README)）

**您还可以通过仪表板监控治理：**

- 节点仪表板模式：`<NODE_URL>/dashboard/gonka/gov`

??? note "节点仪表板示例"
 
   - [http://node1.gonka.ai:8000/dashboard/gonka/gov](http://node1.gonka.ai:8000/dashboard/gonka/gov)
 
   - [http://node2.gonka.ai:8000/dashboard/gonka/gov](http://node2.gonka.ai:8000/dashboard/gonka/gov)
 
   - 以及其他节点

??? note "社区仪表板"
 
   - [vote.gonka.vip/governance](https://vote.gonka.vip/governance)
 
   - [tracker.gonka.hyperfusion.io/governance](https://tracker.gonka.hyperfusion.io/governance)
 
   - [gonka.gg/network/proposals](https://gonka.gg/network/proposals)

---

## 备注

???
+ note "备注"
 
   - **无序交易语义。** 使用 `--unordered` 时，交易会通过 `--timeout-duration` 设置过期时间，且其序列号未设置。期望单调递增序列号的外部工具不应依赖此类交易的序列号。([docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/learn/beginner/tx-lifecycle))
 
   - **Gas 调优。** 如果模拟资源紧张或验证者设置了更高的最低 Gas 价格，请根据网络策略提高 `--gas-adjustment` 或设置 `--gas-prices`。([docs.cosmos.network](https://docs.cosmos.network/sdk/v0.53/learn/beginner/tx-lifecycle))
