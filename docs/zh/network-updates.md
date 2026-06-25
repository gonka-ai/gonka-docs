# 公告

!!! note "关于此页面"

    本页面由社区成员维护和更新。

    如需发布公告（例如您发起的治理投票），请在 gonka-docs 仓库中提交拉取请求：[https://github.com/gonka-ai/gonka-docs](https://github.com/gonka-ai/gonka-docs)

    本页面不保证信息详尽。有关最新信息（包括治理投票的发起及其当前状态），请参考链上数据或查看可用的浏览器和仪表板。

## 2026年6月25日

**加速治理投票（提案78）：MiniMax-M2.7 成为唯一的 PoC 模型；Kimi K2.6 被移除以快速重新引导；Qwen3-235B 退役**

`moonshotai/Kimi-K2.6` 目前没有足够的投票通过 PoC 验证。因此，运行 Kimi 的参与者已退出小组，Kimi 无法进入下一个纪元。现在从活跃集合中移除 Kimi 并重新引导，是使其以最小停机时间恢复的最快方式。

一项加速提案现已上链，以便这些变更能在下一纪元开始前生效。
链上，该提案通过一次投票完成以下操作：
1. 将委托 `initial_model_id` 设置为 `MiniMaxAI/MiniMax-M2.7`，使 MiniMax 成为基础模型。
2. 在 PoC 参数中仅保留 `MiniMaxAI/MiniMax-M2.7`。
3. 从 PoC 参数中移除 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 和 `moonshotai/Kimi-K2.6`。
4. 从治理模型中删除 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 和 `moonshotai/Kimi-K2.6`。

**每项变更的目的*** **Kimi K2.6 — 被移除以快速恢复。** 由于 Kimi 没有足够的投票通过 PoC 验证，将其移除并重新引导是恢复的最快路径，且停机时间最短。恢复 Kimi 的投票将在下一纪元跟进。

* **Qwen3-235B — 退役（独立的、不相关的变更）。** 退役较旧的 Qwen3-235B 是一项独立的、此前已提出的阵容调整。它与 Kimi 的情况无关，仅因同属 PoC 阵容变更而在此一并提及。
* **MiniMax-M2.7 — 升级为基础模型。**

这些变更被合并到一次加速投票中，是因为重置必须在第307纪元结束前完成。每个纪元约22.9小时，标准的48小时投票期无法容纳在一个纪元内；而12小时的加速期可以。创世守护者预计将支持该提案。

**若提案通过的影响**

从第308纪元开始（~2026年6月25日 17:25 UTC），`MiniMaxAI/MiniMax-M2.7` 是唯一的活跃 PoC 模型。Qwen3-235B 和 Kimi K2.6 不再活跃。恢复 Kimi 将在下一纪元通过后续投票处理。

**主机需采取的行动**
1. **在 PoC 308 开始前将您的 MLNode 切换至 `MiniMaxAI/MiniMax-M2.7`。** 所有主机——包括当前运行 Qwen 或 Kimi 的主机——都必须将 MLNode 切换至 MiniMax。在 PoC 开始前约有500个区块的窗口期可以安全切换，因为此时没有 cPoC。请提前下载 FP8 权重（如果尚未准备），以避免在纪元边界时遭遇 Hugging Face 的速率限制。

2. **在截止日期前对提案78进行投票。** 加速投票窗口期较短。
3. 计划再次运行 Kimi 的主机现在仍应将 MLNode 切换至 MiniMax，但需准备好在 PoC 309 时切换回来——恢复 Kimi 的投票将在第308纪元跟进。


**接下来的计划*** **恢复 Kimi K2.6** — 第308纪元将发起后续投票，重新添加 Kimi 并重启其引导过程。
* **GLM-5.2** — 后续提案将添加 GLM-5.2，且**不设不参与惩罚**，因此主机可选择加入，提前测试对该模型的需求，不运行该模型的主机不会受到惩罚。


**如何投票**

如果您无法直接访问持有投票权的密钥，或希望由另一个密钥代为投票，请参考[指南](https://gonka.ai/docs/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何从冷密钥授予治理投票权限给热密钥。提案详情和投票可通过 `inferenced` 查看。任何活跃节点均可使用：

* http://node1.gonka.ai:8000
* http://node2.gonka.ai:8000

* https://node3.gonka.ai

发起投票（`yes`, `no`, `abstain`, `no_with_veto`）：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 78 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```

查看投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 78 -o json --node $NODE_URL/chain-rpc/
```

**截止时间*** 提案78投票截止时间：**2026年6月25日 15:39:53 UTC**（加速）。
* 第308纪元紧随其后形成：PoC 开始于 ~16:50 UTC，生效于 ~17:25 UTC。
* 加速提案需要 0.667 的赞成阈值；投票率至关重要，请及时投票。

2026年6月22日

**v0.2.13-devshard-v2 运行时升级提案已通过治理**

devshard v2 运行时已在链上获得批准，并添加到 `DevshardEscrowParams.approved_versions`。

本提案涵盖了 devshard v2 的发布：[https://github.com/gonka-ai/gonka/releases/tag/release/devshard/v2.0.0](https://github.com/gonka-ai/gonka/releases/tag/release/devshard/v2.0.0)

这是首次仅针对 devshard 的运行时升级。它独立于全链软件升级运行，无需链上二进制文件升级。

随着提案获批，v2 现在可以与现有的 v1 devshard 运行时并行运行。新进程在 `/devshard/v2` 前缀下提供服务，而现有的 v1 流量继续在 `/devshard/v1` 和 `/v1/devshard` 上运行。

该发布将 `devshardd` 二进制文件作为 Gonka 发布产物发布。`versiond` 会自动下载该二进制文件，验证 sha256 哈希值，并在现有的 `versiond` 容器内启动一个额外的 `devshardd` 进程。

此类仅 devshard 的运行时升级无需重启节点容器或执行任何手动主机操作。

**主要变更**

1) 移除了种子揭示轮次，封存已完成的推理统计信息，并修剪了有效载荷，以确保长期运行的会话不会将所有已服务的推理保留在内存或状态中。
2) 通过 OpenTelemetry 和 Prometheus 添加了 devshard 内部追踪和指标。
3) 通过 Grafana、Jaeger、Prometheus、Loki、Promtail 和 cAdvisor 添加了 join-stack 可观测性。
4) 将每个推理的验证计数器从状态根之外移至 SQLite/Postgres，并在推理修剪后通过 devshard 统计端点暴露每槽位总计数。
5) 在纪元变更时修剪旧的纪元存储，将 SQLite/Postgres 模式设置移出热路径，并强制每个进程仅选择一个存储后端。

2026年6月15日

**v0.2.13-devshard-v2 运行时升级提案已进入治理流程。**

本提案涵盖 devshard v2 的发布：[https://github.com/gonka-ai/gonka/releases/tag/release/devshard/v2.0.0](https://github.com/gonka-ai/gonka/releases/tag/release/devshard/v2.0.0) 
这是首次仅针对 devshard 的升级。它独立于全链软件升级运行。如果获得批准，v2 将与现有的 v1 devshard 运行时并行运行。
详情请参阅[升级设计文档](https://github.com/gonka-ai/gonka/blob/devshard-0.2.13-v2/devshard/docs/upgrade.md)和[版本化包](https://github.com/gonka-ai/gonka/tree/devshard-0.2.13-v2/versioned)。

**主要变更**

1. 移除种子揭示轮次，封存已完成的推理统计信息，并修剪有效载荷，以确保长期运行的会话不会将所有已服务的推理保留在内存或状态中

通过 OpenTelemetry 和 Prometheus 添加 devshard 内部追踪和指标

通过 Grafana、Jaeger、Prometheus、Loki、Promtail 和 cAdvisor 添加 join-stack 可观测性

将每个推理的验证计数器从状态根之外存储到 SQLite/Postgres 中，并在推理修剪后通过 devshard 统计端点暴露每槽位总计数

在纪元变更时修剪旧的纪元存储，将 SQLite/Postgres 模式设置移出热路径，并为每个进程选择一个存储后端

**升级计划**

devshard 运行时通过链上参数提案进行升级，而非全链软件升级。

该提案在 `DevshardEscrowParams.approved_versions` 中注册一个新条目。

该发布将 `devshardd` 二进制文件作为 Gonka 发布产物发布。如果链上提案获得批准，`versiond` 将自动下载该二进制文件，验证 sha256 哈希值，并在现有的 `versiond` 容器内启动一个额外的 `devshardd` 进程。

新进程在 `/devshard/v2` 前缀下提供服务。现有的 v1 devshard 流量继续在 `/devshard/v1` 和 `/v1/devshard` 上运行。此类升级无需重启节点容器或执行任何手动主机操作。

**如何投票**

如果您无法直接访问持有投票权的密钥，或希望另一个密钥代您投票，请参阅[指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何从冷密钥向热密钥授予治理投票权限。
提案详情和投票可通过 `inferenced` 查看。任何活跃节点均可使用。可用节点包括：

http://node1.gonka.ai:8000
http://node2.gonka.ai:8000
https://node3.gonka.ai
  
投票（`yes`, `no`, `abstain`, `no_with_veto`）：`--unordered` 和 `--timeout-duration` 标志需要 v0.2.13 或更高版本的 `inferenced`。
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 76 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```
查看投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 76 -o json --node $NODE_URL/chain-rpc/
```
**截止时间**

投票截止时间：2026年6月17日 23:39:02 UTC

## 2026年6月6日

**[仅 devshard 升级的 PR](https://github.com/gonka-ai/gonka/pull/1289) 现已开放审查。**

这是首次仅针对 devshard 的升级，因此流程与标准链升级不同。devshard 升级独立于主区块链更新 devshard 运行时。它们不需要通过 Cosmovisor 进行协调的全节点升级，不影响主网行为，且预计不会导致推理服务中断。

如果通过治理流程获得批准，新版本的 devshard 将与现有的 v1 运行时并行运行。

请直接审查 PR 并对任何发现、问题、改进建议、边界情况或潜在漏洞留下评论。

有意义的审查贡献，包括重要评论、漏洞发现和安全问题，在下一次升级周期中可能有资格获得社区赏金。

此为 PR 审查呼吁，不启动正式投票。治理投票流程将在审查期结束后开始。

## 2026年5月28日

**MiniMax-M2.7 现已在 Gonka 网络上线**

v0.2.13 版本中宣布的引导阶段已完成。从链高度 278 开始，MiniMaxAI/MiniMax-M2.7 加入 Qwen3-235B 和 Kimi K2.6，成为活跃模型组，MiniMax 组中获得的 PoC 权重现在正以校准系数 0.3024 转换为共识权重。

针对 MiniMax 的每模型参与执行机制现已生效。已经为 MiniMax 选择了 DIRECT、DELEGATE 或 REFUSE 的主机无需进行其他操作——现有设置将继续生效。尚未做出选择的主机应尽快做出选择，以避免每轮惩罚（[https://gonka.ai/docs/host/quickstart/#optional-poc-delegation-and-refusal](https://gonka.ai/docs/host/quickstart/#optional-poc-delegation-and-refusal)）。

## 2026年5月26日

**升级已执行：v0.2.13 现已在主网上线**

针对升级提案 v0.2.13（提案编号 54）的链上治理投票已结束。
该提案已获批准，并于区块 `4267300` 在主网上成功执行升级。

## 2026年5月25日 

**升级 v0.2.13：预下载二进制文件和 MiniMax-M2.7 权重**

v0.2.13 升级提案（提案编号 (https://github.com/gonka-ai/gonka/pull/1143)54）已通过链上治理，升级现已确定时间。

• 升级高度：4267300
• 预计升级时间：2026年5月26日 14:42 UTC（07:42 PDT）

提前预下载二进制文件和权重有助于避免在升级期间依赖 GitHub / Hugging Face 的可用性。
```
# 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.13/bin \
              .inference/cosmovisor/upgrades/v0.2.13/bin && \
# 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.13/decentralized-api-amd64.zip" && \
echo "cf31fa4d715e721d1e17b7e2b46d628a0b66b6ef603d352d587abe1d57c40925 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.13/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.13/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \
# 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.13/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.13/inferenced-amd64.zip" && \
echo "ea7dea6c4e8d96ed61005bed196768cc9f44e5fb17f0714cb64d1d00a485be0c inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.13/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.13/bin/inferenced && \
echo "Inference Installed and Verified" && \
# 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.13/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.13/bin/inferenced && \
echo "f93d579ef9c46ade9f28c73c339df2f7ae73607115b7efeb849316984924f68d .dapi/cosmovisor/upgrades/v0.2.13/bin/decentralized-api" | sudo sha256sum --check && \
echo "e52b86c4f64a47f0ea9bdb3327feb321b8a4208a76b35d52a7e9ddd1b9d6eed5 .inference/cosmovisor/upgrades/v0.2.13/bin/inferenced" | sudo sha256sum --check
```


## 2026年5月22日

**v0.2.13 投票已结束——准备在高度 4267300 进行升级** 

链上治理投票 [升级提案 v0.2.13](https://github.com/gonka-ai/gonka/pull/1143)（提案编号 `54`）已经结束。该提案已**通过**。

升级将在主网上**区块高度 4267300**（≈ **2026年5月26日 星期二 14:42 UTC** / **07:42 PDT**）自动执行。

**提醒事项**

1. 请确保您的桥接容器已更新并完成同步。以太坊主网桥接合约（`0x972a7a92d92796a98801a8818bcf91f1648f2f68`）、USDC/USDT 代币元数据以及 CW20 `wrapped_token` 代码 ID `105` 将通过升级处理器本身注册，因此桥接功能将在升级高度时在主网上激活。验证说明：[https://gonka.ai/docs/network-updates/#may-7-2026](https://gonka.ai/docs/network-updates/#may-7-2026)。
2. 如果您计划提供服务 `MiniMaxAI/MiniMax-M2.7`，请立即预先下载约 230 GB 的 FP8 权重。Hugging Face 的速率限制以及引导窗口期间的带宽饱和可能导致错过首次资格检查。
3. 升级完成后，每个节点都需要为**每一个**经治理批准的模型——`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、`moonshotai/Kimi-K2.6` 和 `MiniMaxAI/MiniMax-M2.7`——声明参与模式。即使只运行其中一个或两个模型的节点，也必须对其他模型选择 DELEGATE 或 REFUSE。MiniMax 的截止时间是**链上 epoch `278`**。未采取任何操作的节点将从 epoch 278 开始，每个 epoch 遭受相当于其完整权重 15% 的惩罚。
4. 请计划在升级窗口期间保持在线，以便及时应用任何后续步骤或缓解指令。请确保 `.inference/data` 有足够的空闲空间用于 cosmovisor 状态备份；如果 `application.db` 较大，建议在升级前应用 [清理技术](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)（来自 cosmovisor 备份指南）
5. v0.2.13 的校准将 Kimi K2.6 `WeightScaleFactor` 从 `1.26` 调整为 `0.78`，以反映 vLLM-0.20.1 发布后 Qwen-on-B200 参考实现的吞吐量基准。此调整**仅适用于您共识权重中源自 Kimi 的部分**；您源自 Qwen 的权重以及 Kimi 内部 PoC 分配保持不变。在 B200/B300 上，Kimi 仍然是收益最高的选项；在 H100/H200 上，MiniMax-M2.7 成为与 Qwen 相当、高于 Kimi 的选项。

- 提案地址：[https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)
- 迁移逻辑：[`upgrades.go`](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.13/inference-chain/app/upgrades/v0_2_13/upgrades.go)

## 2026年5月20日

**v0.2.13 升级提案进入治理阶段**

[v0.2.13 提案](https://github.com/gonka-ai/gonka/pull/1143) 已重新上链并开放投票。这是对早前发布但未通过的提案的重新投票，现已更新多个内容后重新提交。

- 包含内容：Kimi（`0.78`）权重重新校准、新增模型 `MiniMaxAI/MiniMax-M2.7`、验证阈值更新、devshard 存储重构，以及多个 PoC/奖励修复。
- 在主网上激活以太坊桥接（详见下方专项说明）。
- 该提案将升级后的宽限期延长至 3000 个区块，以便在新快照逻辑稳定期间节点不会受到惩罚。
- 治理机制：将创世守护者（genesis-guardian）投票权降至约 25%，并将全链法定人数（quorum）设为 0.25。若守护者弃权，非守护者需在剩余 75% 中达到约 1/3 的参与率才能满足法定人数（见 inference-chain 部分）。
- 所需准备：桥接容器检查、MiniMax 决策、仪表板更新、投票。
- 在提案获得批准之前，链上不会发生任何变更。

PR 地址：[https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)

**主要变更****模型**

- 新增 `MiniMaxAI/MiniMax-M2.7` 作为经治理批准的模型和 PoC 模型。
- 更新推理验证阈值：
    - Qwen 235B：`0.940`
    - Kimi K2.6：`0.900`
    - MiniMax-M2.7：`0.922`
- 在 vLLM 0.20.1 发布后，基于 Qwen-on-B200 参考值重新校准 `WeightScaleFactor` 数值：
    - Qwen 235B：`0.359`（不变）
    - Kimi K2.6：`0.78`（从 1.26 下调，相同 PoC 权重下，Kimi 的每 epoch 共识权重大约减少 38%）
    - MiniMax-M2.7：`0.3024`

参考数据：[https://docs.google.com/spreadsheets/d/1dHHlbhW1_hVgd7Q6MtmcVSOpmnl7NnynoTzPHJ1oU-g/edit?gid=0#gid=0](https://docs.google.com/spreadsheets/d/1dHHlbhW1_hVgd7Q6MtmcVSOpmnl7NnynoTzPHJ1oU-g/edit?gid=0#gid=0)

**inference-chain**

- 将 devshard nonce 限制从 `20_000` 提高到 `1_000_000`。
- 将每 epoch 最大 devshard 数量从 `100` 提高到 `500_000`。
- 修复新模型引导期间确认 PoC 奖励的记账问题。
- 在升级 epoch 剩余时间内禁用确认 PoC，以便新快照逻辑从下一个 epoch 干净启动。
- 当参与者重新激活时，重置 `ConsecutiveInvalidInferences`。
- 回填在 v0.2.12 之前加入的 DAPI 的缺失 `MsgRespondDealerComplaints` authz 授权。
- 修复了可能导致桥接和流动性池合约调用中出现间歇性权限错误的布线问题。
- 将创世守护者调整后的投票权减少至约 25%，并将全链治理法定人数设置为 `0.25`。在守护者不投票的情况下，这使得剩余 75% 投票权中实际达到 1/3 法定人数（`0.25 / 0.75 = 0.334`）。
- 向 `allowed_creator_addresses` 添加 4 个早期主机和经纪商。

**以太坊桥主网激活**

- 通过升级处理器激活以太坊主网桥接设置。
- 注册以太坊桥合约地址 `0x972a7a92d92796a98801a8818bcf91f1648f2f68`、USDC 和 USDT 代币元数据、桥接交易批准以及 CW20 `wrapped_token` 代码 ID `105`。
- 激活后，桥接将启用 Gonka 主网与以太坊之间的跨链转账（包括在以太坊上封装 GNK 以及桥接 USDC/USDT）。封装/解封脚本和操作员工作流程将另行记录。

**decentralized-api 和 devshard**

- 默认在端口 `9400` 上启用 `NodeManagerGrpcPort`。
- 为 devshard 状态添加 Postgres 支持。
- 为 SQLite 和 Postgres devshard 数据库添加修剪功能。
- 添加状态快照以加快 devshard 启动和恢复速度。
- 修复 OpenAI 兼容的 API 响应解析。
- 修复长时间启动行为和 devshard 失效流程的边界情况。

**升级计划**

如果获得批准，二进制版本将通过链上升级提案进行更新。有关升级流程的更多信息，请参阅 [/docs/upgrades.md。](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.13/docs/upgrades.md)

**升级前所需准备操作**

如果提案获得批准，建议进行以下准备工作。

**在第 278 轮次前完成 `MiniMaxAI/MiniMax-M2.7` 参与选择（之后开始处罚）**

对于每个经治理批准的模型，多模型 PoC 要求每个主机明确选择参与方式（DIRECT / DELEGATE / REFUSE）。在模型的 `PenaltyStartEpoch` 之后不采取任何操作将导致处罚。在此阶段，您应提前决定首选选项，以便在提案通过且主网上成功应用升级时能够迅速行动。

**桥接容器更新 / 验证**

要求所有主机验证其桥接容器已部署、运行最新版本并正确同步。部分主机可能已部署桥接容器。在此情况下，请先检查是否运行当前版本，再采取进一步操作。
请遵循说明：[https://gonka.ai/docs/network-updates/#may-7-2026](https://gonka.ai/docs/network-updates/#may-7-2026)

**仪表板 / 浏览器更新（升级前后均可）**

要求主机更新仪表板/浏览器。请从 `gonka/deploy/join` 目录运行以下命令。如果您本地尚未克隆 `gonka` 仓库，请先参考加入网络指南。此仪表板更新仅为容器拉取，可在投票结束前后安全运行，不受结果影响。
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

**如何投票**

如果您无法直接访问持有投票权的密钥，或希望由其他密钥代为投票，请参考[指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)了解如何从冷密钥授予治理投票权限给热密钥。
提案详情和投票可通过 `inferenced` 查看。任何活动节点均可使用。可用节点包括：

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai

进行投票（`yes`, `no`, `abstain`, `no_with_veto`）：`--unordered` 和 `--timeout-duration` 标志需要 v0.2.12 或更高版本的 `inferenced`。

```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 54 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```
查看投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 54 -o json --node $NODE_URL/chain-rpc/
```

**截止时间**

- 投票截止时间：2026 年 5 月 22 日 22:12:25 UTC
- 建议升级高度：4267300
- 预计升级时间：2026 年 5 月 26 日 14:42:02 UTC
- 操作员时间线：投票于 5 月 22 日 22:12 UTC 结束 → 升级高度 ~5 月 26 日 14:42 UTC → 升级轮次其余部分运行时跳过确认 PoC（≤ 10000 个区块宽限期）→ MiniMax 引导快照在 start_poc − 500 区块时开始（约提前 43 分钟）→ 升级后下一个轮次边界开始第一阶段 MiniMax PoC → 在链轮次 278 开始执行 MiniMax 处罚。

**注意**

- 请计划在升级窗口期间保持在线，以便及时应用任何后续步骤或缓解指令。
- 升级期间，Cosmovisor 会在 `.inference/data` 目录中创建完整状态备份；请确保有足够的磁盘空间（主网上 `application.db` 的 Cosmovisor 备份通常为几十 GB，因此请提前确认）。有关从 `.inference` 目录安全删除旧备份的指导，请参阅[文档。](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)
- 如果 `application.db` 占用了大量磁盘空间，可以应用 cosmovisor 备份[指南](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)中描述的清理技术。
- 该提案将有意在升级高度到升级周期结束期间（10000个区块的宽限期）跳过确认PoC。如果提案获得通过，此跳过属于预期行为，并非故障；新的快照逻辑将从下一个周期开始。
- 如果提案通过，升级后devshard存储可选择由共享的Postgres实例支持（与payload存储使用相同的环境变量）。本地SQLite仍为默认选项，并会自动清理（保留最近3个周期）。
- 如果提案失败（未达到法定人数，或 `no_with_veto` 超过⅓），链上不会发生任何变更，升级 simply 不会发生。运营商可能会看到 `PROPOSAL_FAILED` 状态；这是预期情况，无需采取行动。

## 2026年5月18日

代理容器可能会全局限制与devshard的并行连接数，而不是按客户端限制

包含修复的PR：[https://github.com/gonka-ai/gonka/pull/1183](https://github.com/gonka-ai/gonka/pull/1183)

要应用此修复，请：

1. 在docker-compose.yml中设置容器版本
```
...
  proxy:
    container_name: proxy
    image: ghcr.io/product-science/proxy:0.2.12-post5
...
```

2. 重启容器：
```
source config.env && docker compose up -d proxy --force-recreate --no-deps
```

在 PoC/确认 PoC 阶段之外更新容器更安全。要检查是否存在确认 PoC：
```
curl "https://node3.gonka.ai/v1/epochs/latest" | jq '.is_confirmation_poc_active'
```

## 2026年5月17日

**第267轮：PoC 验证已恢复**

PoC 验证在第267轮成功完成，受影响的主机已能够重新加入活跃集合。

第266轮的问题是由影响运行 Kimi 模型主机的攻击引起的。网络继续运行，但该攻击结合多个相关条件，导致许多参与者无法进入第266轮。

在应用额外保护措施期间，推理功能可能会暂时不可用。访问将逐步恢复，首先通过几个社区代理和经纪端点。

**发生了什么**

在第266轮，网络的活跃权重显著下降。

该问题已追溯到具有非标准语义的推理请求。此攻击向量影响了运行 Kimi 模型的主机，并扰乱了其中许多主机的 PoC 参与。

在第267轮，主机能够返回，PoC 验证成功完成。

**推理可用性**

网络不应再接受使用受影响的非标准语义的请求。

在相关保护措施实施期间，推理可能暂时不可用。预计访问将逐步恢复，首先通过几个社区代理和经纪端点。

**第267轮中 Kimi 的权重**

Kimi 在第267轮的活跃权重较低，原因是一项现有协议规则：单个模型的总权重不能超过上一轮所有模型总权重的75%。

由于第266轮的总活跃权重显著降低，此规则也限制了 Kimi 在第267轮的权重。

随着未来几轮正常 PoC 参与的继续，权重可能需要几天时间才能稳定下来。

**主机所需操作**

1. 尽可能保持您的 API 节点在线且可访问。这有助于维护对主机参与情况的可见性，并支持任何后续审查。
2. 监控接下来几轮的 PoC 参与情况。确保您的节点按预期进入 PoC，并且活跃权重正确反映。
3. 仅使用支持的推理请求格式。不要发送或路由具有非标准请求语义的推理流量。
4. 预期推理服务将暂时中断。访问可能不会立即在所有地方恢复，预计将通过社区代理和经纪端点逐步恢复。
5. 在社区频道或本帖中分享相关日志或观察结果。如果您的主机在第266轮受到影响或在后续几轮中表现异常，这一点尤为重要。

## 2026年5月16日

**第266轮：PoC 权重下降调查**

在当前轮次（#266）期间，网络的活跃权重显著下降。
似乎 PoC 投票未能收集到本轮所需的投票。确切原因尚未确认，社区正在积极调查情况。

**对于受影响的参与者**

如果您的节点未进入本轮，请尽可能保持您的 API 节点在线且可访问。
这可能有助于赔偿委员会收集 PoC 参与证据，并更准确地核算受影响的贡献。

**调查进行中**

社区成员目前正在审查第266轮期间发生的情况。一旦对根本原因有更清晰的了解，将分享更新。
如果您有相关的观察、日志、假设或其他有助于调查的技术背景，请在此分享。

## 2026年5月15日

**v0.2.13 升级提案进入治理流程**

[v0.2.13 提案](https://github.com/gonka-ai/gonka/pull/1143) 现已在链上并开放投票。

- 包含：Kimi 的重新校准权重（`0.78`）、新模型 `MiniMaxAI/MiniMax-M2.7`、验证阈值更新、devshard 存储重构，以及多个 PoC/奖励修复，以太坊桥主网上线。
- 提案增加了升级后的宽限期，确保在升级发生后3000个区块内不会惩罚主机。
- 所需准备：桥接容器检查、MiniMax 决策、仪表板更新、投票。
- 除非提案获得批准，否则链上不会有任何变更。

该 PR：[https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)

**关键变更****模型**

- 将 `MiniMaxAI/MiniMax-M2.7` 添加为治理批准的模型和概念验证（PoC）模型。
- 在 vLLM 0.20.1 发布后，针对 Qwen-on-B200 基准重新校准 `WeightScaleFactor` 数值：
    - Qwen 235B：`0.359`
    - Kimi K2.6：`0.78`
    - MiniMax-M2.7：`0.3024`
    - 参考数据：[https://docs.google.com/spreadsheets/d/1dHHlbhW1_hVgd7Q6MtmcVSOpmnl7NnynoTzPHJ1oU-g/edit?gid=0#gid=0](https://docs.google.com/spreadsheets/d/1dHHlbhW1_hVgd7Q6MtmcVSOpmnl7NnynoTzPHJ1oU-g/edit?gid=0#gid=0)
- 更新推理验证阈值

**inference-chain**

- 将 devshard nonce 限制从 `20_000` 提高到 `1_000_000`。
- 将每纪元最大 devshard 数量从 `100` 提高到 `500_000`。
- 修复新模型启动期间确认 PoC 奖励记账问题。
- 在升级纪元剩余时间内禁用确认 PoC，以便新快照逻辑从下一纪元干净地开始。
- 当参与者重新激活时重置 `ConsecutiveInvalidInferences`。
- 为在 v0.2.12 之前加入的 DAPI 补充缺失的 `MsgRespondDealerComplaints` authz 授权。
- 修复 Wasm keeper 对桥接和流动性池合约的权限检查访问问题。
- 将创世守护者调整后的投票权减少至约 25%，并将全链治理法定人数设置为 `0.25`。在守护者不投票的情况下，这使得剩余 75% 投票权中的有效法定人数为 1/3（`0.25 / 0.75 = 0.334`）。

**以太坊桥主网激活**

- 通过升级处理器激活以太坊主网桥设置。
- 注册以太坊桥合约地址 `0x972a7a92d92796a98801a8818bcf91f1648f2f68`、USDC 和 USDT 代币元数据、桥交易授权以及 CW20 `wrapped_token` 代码 ID `105`。

**去中心化 API 与 devshard**

- 默认在端口 `9400` 上启用 `NodeManagerGrpcPort`。
- 为 devshard 状态添加 Postgres 支持。
- 为 SQLite 和 Postgres devshard 数据库添加清理功能。
- 添加状态快照以实现更快的 devshard 启动和恢复。
- 修复 OpenAI 兼容 API 响应解析问题。
- 修复长时间启动行为及 devshard 失效流程的边界情况。

**升级计划**

如果提案获批，将通过链上升级提案更新二进制版本。有关升级流程的更多信息，请参阅 [/docs/upgrades.md。](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.13/docs/upgrades.md)

**升级前所需准备操作**

如果提案获批，建议进行以下准备工作。

**在第 278 纪元前完成 `MiniMaxAI/MiniMax-M2.7` 参与选择**

对于每个治理批准的模型，多模型 PoC 要求每个主机明确选择参与方式（DIRECT / DELEGATE / REFUSE）。在模型的 `PenaltyStartEpoch` 之后不采取行动将导致惩罚。在此阶段，您应提前决定首选选项，以便在提案通过且主网上成功应用升级后能迅速行动。

**桥接容器更新 / 验证**

要求所有主机验证其桥接容器已部署、运行最新版本并正确同步。部分主机可能已部署桥接容器。在此情况下，请先确认您运行的是当前版本，再采取进一步操作。
请遵循以下说明：[https://gonka.ai/docs/network-updates/#may-7-2026](https://gonka.ai/docs/network-updates/#may-7-2026)

**仪表板 / 区块浏览器更新（升级前后均可）**

要求主机更新仪表板/区块浏览器。请在 `gonka/deploy/join` 目录下运行以下命令：
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

**如何投票**

如果您无法直接访问持有投票权的密钥，或希望由其他密钥代为投票，请参阅[指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何从冷密钥向热密钥授予治理投票权限。

可通过 `inferenced` 查看提案详情并进行投票。任何活跃节点均可使用。可用节点包括：

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai

投出你的投票（`yes`, `no`, `abstain`, `no_with_veto`）:
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 52 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```
查看投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 52 -o json --node $NODE_URL/chain-rpc/
```

**截止时间**

- 投票结束时间：2026年5月17日 07:58:37 UTC
- 提议的升级高度：4133422
- 预计升级时间：2026年5月18日 13:03:17 UTC

**注意**

- 请计划在升级期间保持在线，以便及时执行任何后续步骤或缓解措施。
- 升级期间，Cosmovisor 会在 `.inference/data` 目录中创建完整的状态备份；请确保有足够的磁盘空间。有关从 `.inference` 目录安全删除旧备份的指导，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。
- 如果 `application.db` 占用了大量磁盘空间，可以应用 cosmovisor 备份[指南](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)中描述的清理技术。
- 该提案将有意在升级高度到升级周期结束（3000个区块的宽限期）期间跳过确认PoC。如果提案通过，此跳过行为是预期的，并非故障；新的快照逻辑将从下一个周期开始。
- 如果提案通过，升级后devshard存储可选择由共享的Postgres实例支持（与payload存储使用相同的环境变量）。本地SQLite仍为默认设置，并将自动清理（保留最近3个周期）。

## 2026年5月7日

**需要更新/验证桥接容器**

作为即将进行的v0.2.13升级准备的一部分（可能包括以太坊侧合约激活），所有主机都需要确认其桥接容器已部署、正在运行最新版本并正确同步。

部分主机可能已部署了桥接容器。在此情况下，请先检查是否正在运行当前版本，再采取进一步操作。

最新桥接镜像：
```
ghcr.io/product-science/bridge:0.2.5-post5@sha256:8d2f217115c65b27fcb6fe1497471c30891534f18685bd3007d168aa7f1a9371
```
检查你的桥接容器是否已在运行正确版本：
```
docker inspect --format='{{.Image}}' bridge \
    | xargs docker inspect --format='{{range .RepoDigests}}{{.}}{{end}}' \
    | grep -q 'sha256:8d2f217115c65b27fcb6fe1497471c30891534f18685bd3007d168aa7f1a9371' \
    && echo "BRIDGE v0.2.5-post5 is running" || echo "WARNING: OLD BRIDGE"
```
如果命令返回：
```
BRIDGE v0.2.5-post5 is running
```
你的桥接容器正在运行预期的镜像。

请同时验证桥接是否已同步：
```
docker logs bridge --tail 10000 | grep "Skeleton sync bounds" | tail -1
```
输出应指向最近的以太坊最终确定区块，且不应明显落后。

如果命令返回警告，请从 `gonka/deploy/join` 目录部署或更新桥接容器：
```
git checkout release/v0.2.5-post5
docker compose down bridge && sudo rm -rf .inference-eth
source config.env && docker compose pull bridge
source config.env && docker compose up bridge -d --force-recreate --no-deps
```
部署后，请再次验证版本：
```
docker inspect --format='{{.Image}}' bridge \
    | xargs docker inspect --format='{{range .RepoDigests}}{{.}}{{end}}' \
    | grep -q 'sha256:8d2f217115c65b27fcb6fe1497471c30891534f18685bd3007d168aa7f1a9371' \
    && echo "BRIDGE v0.2.5-post5 is running" || echo "WARNING: OLD BRIDGE"
```
如果桥接失败同步，以太坊检查点同步端点可能不可用。在这种情况下，请更新 `BEACON_STATE_URL` 并重启桥接：
```
sudo sed -i 's|- BEACON_STATE_URL=.*|- BEACON_STATE_URL=https://beaconstate.info/|' docker-compose.yml

source config.env && docker compose up bridge -d --force-recreate --no-deps
```
更新或重启桥接后，请按照上述说明验证其是否已同步。

## 2026年5月6日

**v0.2.13 升级的 PR 评审**

[该拉取请求](https://github.com/gonka-ai/gonka/pull/1143) 用于下一次链上软件升级 v0.2.13，现开放评审。

请直接审查 PR 代码，并对发现的问题、疑问、改进建议、边界情况或漏洞留下评论。

有意义的评审贡献，包括重要评论、漏洞发现和安全问题，可能有资格在下一次升级周期中获得社区赏金。

本次仅为拉取请求的评审呼吁，并不启动正式投票。治理投票流程将在评审期结束后开始，很可能在明天。

**主要变更****inference-chain**

- 确认 PoC 使用不同的模型集来计算测量权重、保留权重和奖励重缩放。在新模型引导期间，这可能会惩罚同时服务了合格模型和尚未合格模型的诚实矿工。修复方法是存储一个确认模型和权重缩放因子的单个纪元快照，并在所有确认和奖励权重计算中使用该快照。
- 当参与者再次变为 ACTIVE 状态时，`ConsecutiveInvalidInferences` 未被重置。一次新的错误推理可能立即再次使其失效。现在在重新激活和即将晋升时重置计数器。
- 在 v0.2.12 之前加入的 DAPI 未在其冷启动到热授权中包含 `MsgRespondDealerComplaints`。升级将回填该权限，以便它们可以响应经销商投诉。
- Devshard 结算使用了硬编码的 `20_000` nonce 限制。该限制现在为 `DevshardEscrowParams.MaxNonce`，v0.2.13 升级将其设置为 `1_000_000`。升级还将 `MaxEscrowsPerEpoch` 提高到 `500_000`。
- 升级为当前纪元安装了一个宽限期条目，并扩展了 `UpgradeProtectionWindow`（3000 个区块）。从升级高度到升级纪元结束期间，跳过确认 PoC 触发器，因此新的快照逻辑仅从下一个纪元开始运行。复用了 v0.2.10 的宽限期原语。
- Wasm keeper 访问在应用布线后解析，因此桥接和流动性池操作的合约权限检查可以正常工作。

**decentralized-api**

- 一些兼容 OpenAI 的上游返回数字 `stop_reason` 值。`Choice.StopReason` 现在接受任何 JSON 类型，因此这些响应不再因反序列化失败。
- 内部 devshard 存储迁移不再阻塞 dapi 启动。devshard 路由在迁移和恢复完成前保持不可用。

**devshard**

- 由于旧的托管数据保留在一个 SQLite 存储中，devshard 存储可能无限增长。现在存储按纪元划分，并在后台自动清理旧纪元，仅保留最新的 3 个纪元。
- devshard 需要一个共享存储选项以支持更大规模的部署。现在可以使用 Postgres 作为主存储，SQLite 仍作为本地备用。
- Postgres 数据按 `epoch_id` 对会话、差异和签名进行分区，以便清理可以干净地删除旧纪元数据。
- 状态快照减少了长时间运行会话的恢复工作量。
- 有效负载查找固定到托管纪元，并对纪元边界和旧版纪元0请求提供回退支持。
- 当前纪元的分片统计信息暴露了 nonce、版本、组和每个主机的计数器。

**bridge**

- 桥接工具处理 Sepolia 标志，并将 Gonka BLS 密钥/签名转换为以太坊合约期望的 EIP-2537 格式。
- 添加了 GNK 和封装代币桥接操作的脚本。

评审人员可在此处查看完整的升级提案、迁移详情、测试摘要和建议流程：

- [https://github.com/gonka-ai/gonka/blob/347d947596aba754e453e58d5f82ae6054233a9a/proposals/governance-artifacts/update-v0.2.13/README.md ](https://github.com/gonka-ai/gonka/blob/347d947596aba754e453e58d5f82ae6054233a9a/proposals/governance-artifacts/update-v0.2.13/README.md )

- [https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)

## 2026年5月6日

api 容器版本 v0.2.11、v0.2.12 和 v0.2.12-api-post2 中存在潜在问题。容器重启后，9100、9200 和 9400 端口上的服务器可能会延迟很长时间才启动。这会延迟 api 激活，一些矿工因此跳过了 Confirmation PoC

修复通过并行加载 devshard 并从快照恢复现有 devshard 会话来消除该阻塞问题。

[https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)

请更新 api 容器的二进制文件。每个 PoC 开始前有 500 个区块的无 CPoC 窗口（`confirmation_poc_safety_window`），因此这可能是部署最安全的版本。

更新前，请确保没有 CPoC 或 PoC 正在运行。

部署步骤（为降低风险，请逐台机器部署）：
```
sudo rm -rf decentralized-api.zip .dapi/cosmovisor/upgrades/v0.2.12-api-post3/ .dapi/data/upgrade-info.json
sudo mkdir -p  .dapi/cosmovisor/upgrades/v0.2.12-api-post3/bin/
wget -q -O  decentralized-api.zip 'https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.12-api-post3/decentralized-api-amd64.zip' && \
echo "3f2bc481b8320c53f0abe428dc262eaac5a86e8f38b8d796c409bd7116ba5017  decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j  decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.12-api-post3/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.12-api-post3/bin/decentralized-api && \
echo "API Installed and Verified"

docker stop api && \
sudo rm -rf .dapi/cosmovisor/current && \
sudo ln -sf upgrades/v0.2.12-api-post3 .dapi/cosmovisor/current && \
echo "da495bc4c414ac9a0d416f85c30dd8dfbbcc76883fd71f6c1e969d37fa184b20 .dapi/cosmovisor/current/bin/decentralized-api" && \
docker start api
```
部署后，请再次检查 9100 和 9200 端口上的服务器是否正在运行：
```
curl http://localhost:9200/admin/v1/nodes # may not be bound to localhost
```

```
curl http://localhost:9100/versions # may not be bound to localhost
```

## 2026年5月6日

在上一个epoch期间，发现了解析Kimi-K2.6某些响应时存在一个次要bug。

修复：[https://github.com/gonka-ai/gonka/pull/1143/changes#diff-4c44fd18f746bca1c63d9bcbb9a73f06bc0172bfb8a33152854920d4dffff0e8](https://github.com/gonka-ai/gonka/pull/1143/changes#diff-4c44fd18f746bca1c63d9bcbb9a73f06bc0172bfb8a33152854920d4dffff0e8)

我们建议替换api容器的二进制文件。除了修复外，新版本还为devshard数据库启用了裁剪功能，并为devshard状态添加了Postgres支持。

部署方法：
```
sudo rm -rf decentralized-api.zip .dapi/cosmovisor/upgrades/v0.2.12-api-post2/ .dapi/data/upgrade-info.json
sudo mkdir -p  .dapi/cosmovisor/upgrades/v0.2.12-api-post2/bin/
wget -q -O  decentralized-api.zip 'https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.12-api-post2/decentralized-api-amd64.zip' && \
echo "7bef88106fc3464d0141a2d14245cc06c341be186250f5d096e27e901deb185e  decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j  decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.12-api-post2/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.12-api-post2/bin/decentralized-api && \
echo "API Installed and Verified"

docker stop api && \
sudo rm -rf .dapi/cosmovisor/current && \
sudo ln -sf upgrades/v0.2.12-api-post2 .dapi/cosmovisor/current && \
echo "9882b36ac6e5546fc18e3dd34da293cd5255f311f19e14ace74d3b9190c8ca1d .dapi/cosmovisor/current/bin/decentralized-api" && \
docker start api
```
此外，如果您有托管Kimi-K2.6的MLNode，请在部署参数中添加部署参数 "--enable-auto-tool-choice"。为此，您可以重复执行该命令（以B200为例）：
```
curl -X POST http://localhost:9200/admin/v1/nodes \
     -H "Content-Type: application/json" \
     -d '{
       "id": "<NODE_ID>",
       "host": "<NODE_IP>",
       "inference_port": 5050,
       "poc_port": 8080,
       "max_concurrent": 500,
       "models": {
         "moonshotai/Kimi-K2.6": {
           "args": [
             "--enable-auto-tool-choice",  #  new parameter
             "--tensor-parallel-size", "4",
             "--enable-expert-parallel",
             "--trust-remote-code",
             "--mm-encoder-tp-mode", "data",
             "--tool-call-parser", "kimi_k2",
             "--reasoning-parser", "kimi_k2",
             "--attention-backend", "FLASHINFER_MLA",
             "--disable-custom-all-reduce",
             "--gpu-memory-utilization", "0.95",
             "--max-num-seqs", "128",
             "--max-model-len", "240000"
           ]
         }
       }
     }'
```

然后使用docker restart join-mlnode-308-1重新启动MLNode容器。

当PoC/确认PoC未通过时，应执行这些操作。

## 2026年5月5日 

在Kimi-K2.6启动过程中，主机观察到30%的最低直接参与阈值在实践中难以达到。为避免Kimi-K2.6在未来epoch中失去资格，并进一步简化模型的接入，提议将阈值降低至10%。

安全模型保持不变：PoC验证本身没有变化，仍然需要绝大多数验证算力来接受结果。

该提议已加速处理，以便在下一次PoC之前生效。投票将持续12小时。

投票方式（`yes`, `no`, `abstain`, `no_with_veto`）：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 48 yes \
  --from <cold_key_name> \
  --keyring-backend file \
  --unordered \
  --timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
  --node $NODE_URL/chain-rpc/ \
  --chain-id gonka-mainnet \
  --yes
```

查看投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 48 -o json --node $NODE_URL/chain-rpc/
```

**投票结束时间**：2026-05-05 19:00:54 UTC

## 2026年5月4日

**Kimi K2.6现已在Gonka网络上激活**

`moonshotai/Kimi-K2.6`已通过启动阶段，并加入Gonka网络的PoC参与。

该过程由全网主机协调完成：基础设施已准备就绪，意图已提交，委托和拒绝已设置，部署已测试。

对于多模型PoC，这意味着Kimi现在作为活跃模型组拥有独立的参与和奖励追踪。

运行Kimi的主机应继续像往常一样监控其MLNode和PoC参与情况。

## 2026年5月4日

**已提交PoCIntent的主机需采取行动：部署`Kimi K2.6`**

今日针对`moonshotai/Kimi-K2.6`的预评估检查已通过。

已提交PoCIntent的主机现在应在PoC于区块`3874496`开始之前，将至少一个MLNode从`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`切换到`moonshotai/Kimi-K2.6`。

预评估和PoC开始之间有500个区块的时间窗口。在此期间没有CPoC任务，因此声明了意图的主机可以安全地将其模型节点切换到`Kimi K2.6`。

请遵循指南并完成所需的部署步骤：[https://gonka.ai/docs/host/kimi-bootstrap/](https://gonka.ai/docs/host/kimi-bootstrap/)

## 2026年5月4日

传输代理`node1`、`node2`和`node3`已被禁用。所有主网推理现在通过`node4`路由，该代理基于新的`devshard`计费方式运行。

这标志着网络的一个里程碑：`devshard`已上线并具备生产就绪能力。`node4`是推荐的公共网关。

**需要采取的行动**：将您的端点更新为`node4`。

## 2026年5月2日

今日的预资格验证未通过，对于`PoCIntent`低于30%的主机，其权重较低。请保持您的MLNode使用`Qwen235B`，并在明天提交下个epoch的意图。

## 2026年4月30日

**升级已执行：v0.2.12现已在主网上线**

链上治理投票关于升级提案v0.2.12已结束。该提案已获得批准，升级已在主网上成功执行。

**当前生效的主要变更**

- **多模型PoC（最大变更）** ([#1039](https://github.com/gonka-ai/gonka/pull/1039))。将计算证明从单一固定模型过渡到每个模型的PoC组。每个经治理批准的模型生成自己的本地PoC权重，然后通过特定于模型的系数聚合为总共识权重。每个主机必须参与每个模型组（直接参与或委托PoC投票权重）。
- **引入`moonshotai/Kimi-K2.6`作为第二个模型**：该模型组将在升级后两个epoch激活。该模型的系数是Qwen235B系数的3.51倍，基于相同硬件（8xH200，8xB200）上模型的计算复杂度。
- **Devshard独立运行时** ([#1045](https://github.com/gonka-ai/gonka/pull/1045))。将devshard版本与DAPI/主网发布周期解耦。
- **Certik审计修复** ([#1020](https://github.com/gonka-ai/gonka/pull/1020), [#1021](https://github.com/gonka-ai/gonka/pull/1021), [#1022](https://github.com/gonka-ai/gonka/pull/1022), [#987](https://github.com/gonka-ai/gonka/pull/987), [#949](https://github.com/gonka-ai/gonka/pull/949), [#988](https://github.com/gonka-ai/gonka/pull/988), [#825](https://github.com/gonka-ai/gonka/pull/825), [#1011](https://github.com/gonka-ai/gonka/pull/1011), [#1029](https://github.com/gonka-ai/gonka/pull/1029), [#789](https://github.com/gonka-ai/gonka/pull/789))。已处理审计发现的问题。
- **协议加固。** 保留节点（`POC_SLOT=true`）在单次PoC/CPoC期间被随机抽样。其他更新包括将`mlnode`版本传播到链上`HardwareNode`、修复DKG dealer共识、将旧版验证者惩罚机制与所需抵押品语义对齐、确保devshard托管资金的原子性，以及在`inference_finished`事件解析中添加零时间戳容差。

**对Host的指导**

- 部署、委托或明确拒绝新治理批准的模型（包含的模型将在升级后2个epoch激活）。请参考[指南](https://gonka.ai/docs/host/multi_model_poc/)。

- 要求Host更新仪表板/浏览器。请在`gonka/deploy/join`目录下运行以下命令：

```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

- 二进制版本：通过链上升级流程进行更新。

- 迁移：测试和迁移详细信息记录在 [v0.2.12 文档中。](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/docs/upgrades.md)

有关这些变更的更多细节可在治理文件中找到： [https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.12/proposals/](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.12/proposals/) 

## 2026年4月29日

**升级 v0.2.12：预下载二进制文件**

v0.2.12 升级提案的链上治理流程即将结束。

- 投票截止时间：2026年4月30日 00:12 UTC
- 升级高度：3834200
- 预计升级时间：2026年4月30日 上午6:00 UTC

建议节点运营方在 [GitHub](https://github.com/gonka-ai/gonka/pull/948) 上查看提案并参与投票。

提前预下载二进制文件有助于避免在升级期间依赖 GitHub 的可用性。

```
# 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.12/bin \
              .inference/cosmovisor/upgrades/v0.2.12/bin && \

# 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.12/decentralized-api-amd64.zip" && \
echo "d0143a95e12e1ada06cfea5e4d3deab13534c3523c967e9a6b87ac9f9bf3247d decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.12/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.12/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

# 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.12/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.12/inferenced-amd64.zip" && \
echo "df7656503d39f6703767d32d5578d1291e32cb114844d8c1cd0f134d1bf4babd inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.12/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.12/bin/inferenced && \
echo "Inference Installed and Verified" && \

# 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.12/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.12/bin/inferenced && \
echo "94ce943338d12844028e84fe770106c9d28d866cf0af99f27da30f56d69efa34 .dapi/cosmovisor/upgrades/v0.2.12/bin/decentralized-api" | sudo sha256sum --check && \
echo "642eb9858cd77d182f3e1c4d44553f5379d615983430e1fd8e85f09632af4271 .inference/cosmovisor/upgrades/v0.2.12/bin/inferenced" | sudo sha256sum --check
```

## 2026年4月28日

**升级 v0.2.12：升级前模型清理**

v0.2.12 升级提案现已完成链上投票周期的一半。

- 投票截止时间：2026年4月30日 00:12 UTC
- 升级高度：3834200
- 预计升级时间：2026年4月30日 上午6:00 UTC

建议节点运营方查看 [GitHub](https://github.com/gonka-ai/gonka/pull/948) 上的提案并参与投票。

**升级前需采取行动**

随着网络接近升级窗口，若提案通过，节点运营方应提前准备节点。

此清理过程 **必须在升级发生前完成**。如果在升级时，您的节点配置中包含不支持的模型，**该节点将被拒绝并下线。**

版本 0.2.12 将移除所有不在升级后批准列表中的治理模型。在主网上，仅先前强制执行的模型和 Kimi 将被保留。
每个 DAPI 在本地持久化其 MLNode 配置。启动时，它会根据链上治理列表验证每个已配置的模型。如果配置中包含至少一个不受支持的模型，整个节点将被拒绝，主机将下线。

版本 0.2.11 通过将运行时视图裁剪为强制模型来掩盖此问题，因此 `/admin/v1/nodes` 看起来是干净的，即使持久化配置中仍包含额外模型。版本 0.2.12 停止此裁剪行为，意味着将直接加载持久化配置。

为解决此问题，以下脚本会查找 `/admin/v1/config` 中包含额外模型的每个节点，并向 `/admin/v1/nodes/<id>` 发送带有清理后配置的 `PUT` 请求。这些更改将在60秒内持久化。保留的模型的参数、硬件和端口将完全保留。未列出强制模型的节点将被跳过，需手动修复。

将以下脚本粘贴到主机的 shell 中。默认情况下，它将应用更改。若要预览更改而不应用，请将 `APPLY=dry` 设置为（或任何非 `--apply` 的值）。

仓库中的脚本：

- [Bash](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/proposals/governance-artifacts/update-v0.2.12/cleanup/cleanup_models.sh)
- [Python](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/proposals/governance-artifacts/update-v0.2.12/cleanup/cleanup_models.py)。

```bash
ADMIN=${ADMIN:-http://127.0.0.1:9200}
KEEP=${KEEP:-Qwen/Qwen3-235B-A22B-Instruct-2507-FP8}
APPLY=${APPLY:-"--apply"}

curl -sS "$ADMIN/admin/v1/config" | jq -r --arg k "$KEEP" '
  .nodes[] | "\(.id): " + (
    if (.models | has($k) | not) then "skip (\(.models | keys))"
    elif (.models | length) == 1 then "ok"
    else "\(.models | keys) -> [\($k)]" end)'

if [[ "$APPLY" == "--apply" ]]; then
  curl -sS "$ADMIN/admin/v1/config" \
    | jq -c --arg k "$KEEP" \
        '.nodes[] | select((.models | has($k)) and (.models | length > 1)) | .models = {($k): .models[$k]}' \
    | while IFS= read -r p; do
        id=$(jq -r .id <<<"$p")
        curl -sS -f -X PUT -H 'Content-Type: application/json' -d "$p" \
          "$ADMIN/admin/v1/nodes/$id" >/dev/null && echo "$id: updated"
      done
  echo "done; persisted within 60s"
else
  echo "preview only; rerun without APPLY=dry to commit"
fi
```


运行脚本后请等待60秒，以确保更改已持久化后再触发升级。然后验证配置：

```bash
curl -sS http://127.0.0.1:9200/admin/v1/config \
  | jq '.nodes[] | {id, models: (.models | keys)}'
```

预期输出：
```json
{
  "id": "<nodeId>",
  "models": [
    "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8"
  ]
}
```
*(其他节点将遵循相同格式)*

## 2026年4月27日

**v0.2.12 升级提案进入治理流程**

[升级提案](https://github.com/gonka-ai/gonka/pull/948) 现已在链上发布，下一版本软件 v0.2.12 开放投票。

**主要变更**

- **多模型 PoC（最大变更）** ([#1039](https://github.com/gonka-ai/gonka/pull/1039))。将计算证明（PoC）从单一固定模型过渡到每个模型的 PoC 组。每个经治理批准的模型生成自己的本地 PoC 权重，然后通过模型特定系数聚合为总共识权重。每个节点必须参与每个模型组（直接参与或委托 PoC 投票权重）。
- **`moonshotai/Kimi-K2.6` 被引入作为第二个模型**：该模型组将在升级后两个 epoch 激活。该模型的系数是 Qwen235B 系数的 3.51 倍，基于相同硬件（8xH200, 8xB200）上模型的计算复杂度。
- **Devshard 独立运行时** ([#1045](https://github.com/gonka-ai/gonka/pull/1045))。将 devshard 发布与 DAPI / 主网发布周期解耦。
- **Certik 审计修复** ([#1020](https://github.com/gonka-ai/gonka/pull/1020), [#1021](https://github.com/gonka-ai/gonka/pull/1021), [#1022](https://github.com/gonka-ai/gonka/pull/1022), [#987](https://github.com/gonka-ai/gonka/pull/987), [#949](https://github.com/gonka-ai/gonka/pull/949), [#988](https://github.com/gonka-ai/gonka/pull/988), [#825](https://github.com/gonka-ai/gonka/pull/825), [#1011](https://github.com/gonka-ai/gonka/pull/1011), [#1029](https://github.com/gonka-ai/gonka/pull/1029), [#789](https://github.com/gonka-ai/gonka/pull/789))。已解决审计发现的问题。
- **协议强化**。保留节点（`POC_SLOT=true`）将被随机抽样用于单次 PoC / CPoC 时间。其他更新包括将 `mlnode` 版本传播到链上 `HardwareNode`，修复 DKG 经销商共识，使旧版验证者惩罚机制与所需抵押语义保持一致，确保 devshard 托管资金的原子性，并在 `inference_finished` 事件解析中添加零时间戳容差。

**升级计划**

二进制版本将通过链上升级提案进行更新。有关升级流程的更多信息，请参阅 [/docs/upgrades.md.](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/docs/upgrades.md)

**需要执行的操作****升级前**

从 `docker-compose.yml` 部署 `versiond` 和 `proxy` 服务的最新版本（使用仓库标签 release/v0.2.12）：
```
git checkout release/v0.2.12
```
部署（重要：必须使用 `--no-deps`）：
```
source config.env && \
docker compose -f docker-compose.yml up versiond proxy -d --no-deps
```
这将激活 `devshard`，使其独立于 `api` 服务运行。

**升级后**

部署、委托或明确拒绝新的经治理批准的模型（包含的模型将在升级后两个epoch激活）。请参考[指南](https://gonka.ai/docs/host/multi_model_poc/)。

**升级前或升级后**

要求节点更新仪表板/浏览器。请在 `gonka/deploy/join` 目录下运行以下命令：
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

**如何投票**

如果你无法直接访问持有投票权的密钥，或希望由另一个密钥代为投票，请参考[指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何将冷密钥的治理投票权限授予热密钥。

提案详情和投票可通过 `inferenced` 查看。任何活跃节点均可使用。可用节点包括：

- [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
- [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
- [https://node3.gonka.ai](https://node3.gonka.ai)

进行投票（ `yes`, `no` , `abstain` , `no_with_veto` ）：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 44 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```
查看投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 44 -o json --node $NODE_URL/chain-rpc/
```

**截止日期**

- 投票结束时间：2026年4月30日 00:12 UTC
- 升级高度：3834200
- 预计升级时间：2026年4月30日 6:00 UTC

**注意**

- 请计划在升级窗口期间保持在线，以便及时执行任何后续步骤或缓解指令。
- 升级期间，Cosmovisor 会在 `.inference/data` 目录中创建完整的状态备份；请确保有足够的磁盘空间。有关安全删除 `.inference` 目录中旧备份的指导，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)
- 如果 `application.db` 占用大量磁盘空间，可应用 cosmovisor 备份[指南](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)中描述的清理技术。
- 升级后，Postgres 可作为本地负载存储的选项。

## 2025年4月15日

**v0.2.12 升级的 PR 审查**

[下一个链上软件升级 v0.2.12 的拉取请求](https://github.com/gonka-ai/gonka/pull/948)现已开放审查。

请直接审查 PR 代码，并对您发现的任何问题、疑问、改进建议、边界情况或漏洞留下评论。

有意义的审查贡献，包括重要评论、漏洞发现和安全问题，在下一次升级周期中可能有资格获得社区赏金。

此次仅呼吁审查拉取请求，并不启动正式投票。治理投票流程将在审查期结束后开始。

**主要变更**

- **多模型 PoC（最大变更）** ([#1039](https://github.com/gonka-ai/gonka/pull/1039))。将计算证明（PoC）从单一固定模型过渡到每个模型的 PoC 组。每个经治理批准的模型生成自己的本地 PoC 权重，然后通过特定于模型的系数聚合为总共识权重
- **共识级交易费用及自动迁移** ([#937](https://github.com/gonka-ai/gonka/pull/937), [#981](https://github.com/gonka-ai/gonka/pull/981))。引入由治理控制的 gas 价格。协议任务消息（PoC、验证、推理、BLS DKG）通过 `NetworkDutyFeeBypassDecorator` 免除费用。`MsgPoCV2StoreCommit` 收取两部分费用（基础验证 + 计数线性），作为主要的 Sybil 防御机制。详情请见 [docs/host_onboarding.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/docs/host_onboarding.md)。
- **Devshard 独立运行时** ([#1045](https://github.com/gonka-ai/gonka/pull/1045))。将 devshard 发布与 DAPI / 主网发布周期解耦。
- **Certik 审计修复** ([#1020](https://github.com/gonka-ai/gonka/pull/1020), [#1021](https://github.com/gonka-ai/gonka/pull/1021), [#1022](https://github.com/gonka-ai/gonka/pull/1022), [#987](https://github.com/gonka-ai/gonka/pull/987), [#949](https://github.com/gonka-ai/gonka/pull/949), [#988](https://github.com/gonka-ai/gonka/pull/988), [#825](https://github.com/gonka-ai/gonka/pull/825), [#1011](https://github.com/gonka-ai/gonka/pull/1011), [#1029](https://github.com/gonka-ai/gonka/pull/1029), [#789](https://github.com/gonka-ai/gonka/pull/789))。所有已知的审计问题均已修复。
- **协议强化**。实现更强的 PoC v2 RNG（完整 256 位熵，此前为 32 位），将通过单独的治理投票激活。其他更新包括将 `mlnode` 版本传播到链上 `HardwareNode`，修复 DKG 经销商共识，使旧版验证者惩罚与所需抵押语义保持一致，确保 devshard 托管资金的原子性，并在 `inference_finished` 事件解析中添加零时间戳容差。

**升级计划**

二进制版本将通过链上升级提案进行更新。有关升级流程的更多信息，请参阅 [/docs/upgrades.md。](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/docs/upgrades.md)

**升级后所需操作**

现有主机：

- 确保冷账户持有足够资金（例如 100 GNK），以覆盖自动授予的费用额度限制。
- 在治理批准新模型后，部署、委托或明确拒绝每个经治理批准的模型（包含的模型将在升级后 3 个周期激活）
- 从 `docker-compose.yml` 部署 `versiond` 服务（使用主分支的最新提交）
- 使用新版本和参数重新创建 `proxy` 容器。文档将提供确切命令。

## 2026年4月1日

ML 节点 `3.0.12-post6` 可用

新版本 mlnode 现已发布：`ghcr.io/gonka-ai/mlnode:3.0.12-post6`

- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post6
- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post6-blackwell
- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post6-blackwell-sm120

此版本现已被设为主分支中的默认版本：[https://github.com/gonka-ai/gonka/commit/ec8f45573149ce5686e8e5fc29f1a8f49a295689](https://github.com/gonka-ai/gonka/commit/ec8f45573149ce5686e8e5fc29f1a8f49a295689)

**变更内容**

此版本已在最近几个周期被部分矿工使用。
初步观察表明，对于在 PoC 开始附近运行的节点，稳定性有所提升。

此次更新修复了 PoC 开始附近的一个边界情况，该情况此前在特定条件下可能导致性能下降。

vLLM 的完整变更：[https://github.com/gonka-ai/vllm/compare/release/v0.9.1-pocv2-post5...release/v0.9.1-pocv2-post6](https://github.com/gonka-ai/vllm/compare/release/v0.9.1-pocv2-post5...release/v0.9.1-pocv2-post6)

**指引**

- 建议升级到此版本
- 该版本与之前版本完全兼容

## 2026年3月20日

**升级已执行：v0.2.11 现已在主网上线**

链上治理投票已结束。该提案已获得批准，升级已在主网上成功执行。

**现已生效的关键变更****[初始扩展架构：基于 `devshards` 的推理会话](https://github.com/gonka-ai/gonka/pull/877)**

此次升级引入了基于 `devshards` 的推理会话的初始版本，旨在提高推理的可扩展性。

**[`StartInference` 和 `FinishInference` 性能改进](https://github.com/gonka-ai/gonka/pull/812)**

这些性能改进使得每个区块可支持多达100倍的推理任务，具体取决于工作负载和网络状况。
有关这些及其他变更的更多详细信息，请参见：[https://github.com/gonka-ai/gonka/pull/813](https://github.com/gonka-ai/gonka/pull/813)

**对节点的建议**

- **二进制版本**：通过链上升级流程更新。
- **迁移**：测试和迁移详情记录在 [v0.2.11 文档](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.11/docs/upgrades.md) 中。

有关这些变更的更多详细信息，请参见治理文档：[https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.11/proposals/](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.11/proposals/) 

## 2026年3月19日

**升级 v0.2.11：预下载二进制文件**

v0.2.11 升级提案的链上治理流程即将结束。

- 投票截止时间：2026年3月20日 05:59:52 UTC
- 升级高度：3186100
- 预计升级时间：2026年3月20日 14:30 UTC

建议节点在 [GitHub](https://github.com/gonka-ai/gonka/pull/813) 上查看提案并参与投票。
提前预下载二进制文件有助于避免在升级期间依赖 GitHub 的可用性。

```
# 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.11/bin \
              .inference/cosmovisor/upgrades/v0.2.11/bin && \

# 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.11/decentralized-api-amd64.zip" && \
echo "e574c3d86189daf325cc7008603ee8e952efb028afda5bcd4a154dcd334192d4 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.11/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.11/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

# 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.11/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.11/inferenced-amd64.zip" && \
echo "c77528bd2e31e86355a6eefddb50e0db7f9600ebf2940ca440a61ea36e7ef7ca inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.11/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.11/bin/inferenced && \
echo "Inference Installed and Verified" && \

# 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.11/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.11/bin/inferenced && \
echo "8b99e550ddd117a0cb4293b4ae74e0e5dff961a1986f23b58ec7ae6c3f0478f1 .dapi/cosmovisor/upgrades/v0.2.11/bin/decentralized-api" | sudo sha256sum --check && \
echo "6cf186a75782da07156d4d03b4266cefcb36656de89e4a378ae96d8df89ad003 .inference/cosmovisor/upgrades/v0.2.11/bin/inferenced" | sudo sha256sum --check
```

## 2026年3月18日

**v0.2.11 升级提案进入治理流程**

下一轮链上软件版本 v0.2.11 的升级提案现已发布到链上，开放投票。若提案通过，将引入基于 `devshards` 的推理会话初始版本以提升推理可扩展性，并显著改进 `Start`/`FinishInference` 的性能。

**关键变更****[初始扩展架构：基于 `devshards` 的推理会话](https://github.com/gonka-ai/gonka/pull/877)**

此次升级引入了基于 `devshards` 的推理会话的初始版本，旨在提高推理的可扩展性。

目前，通过每次推理的链上交易处理推理任务限制了吞吐量。该设计将推理执行和验证移至指定的链下子组，而链上仅处理会话创建和最终结算。

这是有意推出的早期且受限版本。提出该版本供主网审查和有限生产测试，并非因其已完成，而是因为此类系统需要尽早暴露在真实网络条件下。某些类型的问题仅通过本地测试难以发现。当前实现设计上避免对矿工奖励产生负面影响。

**[`StartInference` 和 `FinishInference` 性能改进](https://github.com/gonka-ai/gonka/pull/812)**

- 减少 `MsgStartInference` 和 `MsgFinishInference` 的不必要的状态写入和查询开销。
- 简化统计处理，减少推理生命周期中的工作量，以提高区块执行的稳定性。

在类似主网的条件下，这也使得每个区块可支持多达100倍的推理任务，具体取决于工作负载和网络状况。  ￼
有关这些及其他变更的更多详细信息，请参见：[https://github.com/gonka-ai/gonka/pull/813](https://github.com/gonka-ai/gonka/pull/813) 

**升级前建议的操作****`application.db` 数据清理**

强烈建议节点在升级前按照提供的说明对 `application.db` 进行清理。

提前执行此操作非常重要。如果许多节点将清理推迟到升级后，网络中的清理活动可能大致同时开始，造成可避免的运行压力。
清理说明文档位于：[https://gonka.ai/FAQ/#__tabbed_7_4](https://gonka.ai/FAQ/#__tabbed_7_4)

**Explorer 更新**

请节点更新仪表板/Explorer。请在 `gonka/deploy/join` 目录下运行以下命令：
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

**如何投票**

如果您无法直接访问持有投票权的密钥，或希望由另一个密钥代表您投票，请参考[指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何将冷密钥的治理投票权限授予温密钥。

提案详情和投票可通过 `inferenced` 进行。任何活跃节点均可使用。可用节点包括：

- [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
- [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
- [https://node3.gonka.ai](https://node3.gonka.ai) 

进行投票（`yes`, `no` , `abstain` , `no_with_veto`）：

```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 31 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```

查看投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 31 -o json --node $NODE_URL/chain-rpc/
```

**截止时间**

- 投票截止时间：2026年3月20日 05:59:52 UTC
- 升级高度：3186100
- 预计升级时间：2026年3月20日 14:30 UTC

**注意**

- 请计划在升级窗口期间保持在线，以便及时执行任何后续步骤或缓解指令。
- 升级期间，Cosmovisor 会在 `.inference/data` 目录中创建完整的状态备份；请确保有足够的磁盘空间。有关安全删除 `.inference` 目录中旧备份的指导，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。
- 如果 `application.db` 占用大量磁盘空间，可应用[此处](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)所述的清理技术。
- 升级后，Postgres 可作为本地负载存储的选项。

## 2026年3月17日

**v0.2.11 版本升级的 PR 审查**

下一次链上软件升级 v0.2.11 的[拉取请求](https://github.com/gonka-ai/gonka/pull/813)现已开放审查。欢迎提供反馈和改进建议。

对本次 PR 审查做出有意义贡献的人，可能在下次升级中获得奖励。

此次仅为 PR 审查呼吁，并非正式投票开始。治理投票流程将在审查期结束后启动。

**主要变更**

[初始扩展架构：基于 `devshards` 的推理会话](https://github.com/gonka-ai/gonka/pull/877)

本次升级引入了基于 `devshards` 的推理会话的初始版本，旨在提高推理的可扩展性。

目前，通过每次推理的链上交易处理推理限制了吞吐量。该设计将推理执行和验证移至指定的链下子组，而链本身仅处理会话创建和最终结算。

这是有意推出的早期且受限版本。之所以提交主网审查并进行有限生产测试，并非因其已完备，而是因为此类系统需要尽早暴露在真实网络条件下。某些类型的问题仅通过本地测试难以发现。当前实现设计上避免对矿工奖励产生负面影响。

[`StartInference` 和 `FinishInference` 性能改进](https://github.com/gonka-ai/gonka/pull/812)

- 减少 `MsgStartInference` 和 `MsgFinishInference` 的不必要状态写入和查询开销。
- 简化统计处理，减少推理生命周期中的工作量，以提高区块执行稳定性。

在类似主网的条件下，这也使得每区块可容纳的推理数量最多增加100倍，具体取决于工作负载和网络状况。

**升级前建议操作****`application.db` 数据修剪**

强烈建议主机在升级前按照提供的说明对 `application.db` 进行修剪。
提前执行此操作非常重要。如果许多节点将修剪推迟到升级后，网络上的修剪活动可能大致同时开始，造成可避免的运维压力。
修剪说明已记录在[此处](https://gonka.ai/FAQ/#__tabbed_7_4)。

**浏览器更新**

要求主机更新仪表板/浏览器。请在 `gonka/deploy/join` 目录中运行以下命令：
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```
审查人员可在此处[链接](https://github.com/gonka-ai/gonka/pull/813)查看完整的升级提案、迁移详情、测试摘要和建议流程。

## 2026年3月16日

**API 二进制文件 `v0.2.10-post7` 已可用**

已在 `v0.2.10` 中发现潜在漏洞。为降低当前预升级期间的风险，建议在下次 PoC 开始前将 API 二进制文件升级至 `v0.2.10-post7`。

完整变更日志：[https://github.com/gonka-ai/gonka/compare/main…release/v0.2.10-post7](https://github.com/gonka-ai/gonka/compare/main…release/v0.2.10-post7)

应用更新：
```
# Pre-check: Ensure no confirmation PoC is active (fails entire script if not false)
echo "--- Pre-flight Check: Confirmation PoC Status ---" && \
CONFIRMATION_POC_ACTIVE=$(curl -sf "https://node3.gonka.ai/v1/epochs/latest" | jq -r '.is_confirmation_poc_active') && \
[ "$CONFIRMATION_POC_ACTIVE" = "false" ] && \
echo "OK: No confirmation PoC active" && \

# Download Binary
sudo rm -rf decentralized-api.zip .dapi/cosmovisor/upgrades/v0.2.10-post7/ .dapi/data/upgrade-info.json && \
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.10-post7/bin/ && \
wget -q -O decentralized-api.zip 'https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.10-post7/decentralized-api-amd64.zip' && \
echo "71481e6f2c5f9a355ed283a0896833bcc8397e8bcda134a796a46467bd2ff3b0  decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.10-post7/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.10-post7/bin/decentralized-api && \
echo "API Installed and Verified" && \

# Link Binary
echo "--- Final Verification ---" && \
sudo rm -rf .dapi/cosmovisor/current && \
sudo ln -sf upgrades/v0.2.10-post7 .dapi/cosmovisor/current && \
echo "313df0747e090518ac052918ad23f9d6e70bb60dede2013375e322c23605f3e0  .dapi/cosmovisor/current/bin/decentralized-api" | sudo sha256sum --check && \
# Restart 
source config.env && docker compose up api --no-deps --force-recreate -d
```

## 2026年3月11日

**工具调用**

[工具调用](https://gonka.ai/developer/quickstart/#4-tool-calling) 现已通过标准函数调用模式（`type: “function”`）提供。

集成流程非常简单：

- 开发者定义函数
- 当请求匹配时，模型返回结构化的调用参数
- 执行由应用侧处理。

对于已经使用代理层的团队，这可能是一个简化技术栈的好机会，转而依赖原生行为。实践中，这将带来更清晰的集成模式和更易于维护的系统。

## 2026年3月6日

**注意：v0.2.11 升级预计将于下周初进入评审和治理投票阶段。**

请密切关注并计划参与。投票是支持网络发展并确保升级符合参与者实际需求的最简单方式之一。
如果您无法访问持有投票权的冷钱包密钥，建议提前安排投票委托。请联系该密钥的所有者，请求其授权您代表他们投票。若无此授权，无法从其他账户提交投票。

在此设置中：

- 授权者 = 拥有投票权的账户（冷密钥）
- 被授权者 = 代表授权者提交投票的账户（温密钥）

被授权者仍可为自己账户投票。授权者可随时撤销此权限。

以下是授予、检查、使用和撤销投票委托的复制粘贴命令。

1) 授予投票权限（从授权者密钥运行）
=== "命令"

    ```
    ./inferenced tx authz grant <GRANTEE_GONKA_ADDRESS> generic \
      --msg-type=/cosmos.gov.v1beta1.MsgVote \
      --from=<GRANTER_KEY_NAME> \
      --chain-id=gonka-mainnet \
      --expiration=<UNIX_TIMESTAMP> \
      --home .inference \
      --keyring-backend file
    ```

=== "示例响应"

    ```
    {
        "height": "0",
        "txhash": "8D96FB6FC06FFB928FBC89FE950689CD040C7F338C197BA856175EC7462A3FFA",
        "codespace": "",
        "code": 0,
        "data": "",
        "raw_log": "",
        "logs": [],
        "info": "",
        "gas_wanted": "0",
        "gas_used": "0",
        "tx": null,
        "timestamp": "",
        "events": []
    }
    ```

2) 验证授权是否存在（从任意节点运行）
=== "命令"
    ```
    ./inferenced query authz grants <GRANTER_GONKA_ADDRESS> <GRANTEE_GONKA_ADDRESS> \
      --node="http://<MAINNET_NODE_URL>:26657" \
      --output=json | jq .
    ```

=== "示例响应"

    ```
    {
        "grants": [
            {
                "authorization": {
                    "type": "cosmos-sdk/GenericAuthorization",
                    "value": {
                        "msg": "/cosmos.gov.v1beta1.MsgVote"
                    }
                },
                "expiration": "2026-12-03T18:38:18Z"
            }
        ],
        "pagination": {
            "total": "1"
        }
    }
    ```

3) 使用被授权者投票
=== "命令"
    ```
    # Find the proposal ID which you are voting for - use it as <VOTE_PROPOSAL_ID> in the voting body 
    ./inferenced query gov proposals --output json
    
    # Prepare the file with the voting body
    cat > /tmp/authz-vote.json << 'EOF'
    {
      "body": {
        "messages": [
          {
            "@type": "/cosmos.authz.v1beta1.MsgExec",
            "grantee": "<GRANTEE_GONKA_ADDRESS>",
            "msgs": [
              {
                "@type": "/cosmos.gov.v1beta1.MsgVote",
                "proposal_id": "<VOTE_PROPOSAL_ID>",
                "voter": "<GRANTER_GONKA_ADDRESS>",
                "option": "VOTE_OPTION_YES"
              }
            ]
          }
        ]
      }
    }
    EOF
    
    
    # Vote using the file 
    ./inferenced tx authz exec /tmp/authz-vote.json \  --from=<GRANTEE_KEY_NAME> \ 
    --chain-id=gonka-mainnet \
    --home .inference \
    --keyring-backend file \
    --node="http://<MAINNET_NODE_URL>:26657" -y
    ```

=== "示例响应"

    ```
    {
        "pagination": {
            "total": "1"
        },
        "proposals": [
            {
                "deposit_end_time": "2026-03-06T10:40:07.016920026Z",
                "final_tally_result": {
                    "abstain_count": "0",
                    "no_count": "0",
                    "no_with_veto_count": "0",
                    "yes_count": "0"
                },
                "id": "1",
                "messages": [
                    {
                        "type": "cosmos-sdk/MsgSoftwareUpgrade",
                        "value": {
                            "authority": "gonka10d07y265gmmuvt4z0w9aw880jnsr700j2h5m33",
                            "plan": {
                                "height": "406062",
                                "info": "{\n \"binaries\":{\n \"linux/amd64\":\"https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.10-testnet1/inferenced-amd64.zip?checksum=sha256:fb71310427436aebac32813735231882fca420cf0d94b036f8cacd055d0e1c78\"\n },\n \"api_binaries\":{\n \"linux/amd64\":\"https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.10-testnet1/decentralized-api-amd64.zip?checksum=sha256:6fe214f4bb2d831c02ce407682820d95d01e6ae94a33fe9c4617b80e0ca716ce\"\n }\n }",
                                "name": "v0.2.10",
                                "time": "0001-01-01T00:00:00Z"
                            }
                        }
                    }
                ],
                "proposer": "gonka1xfvr8mywcrxrcrryvj8c5d2grvyjdj5c90fd88",
                "status": 2,
                "submit_time": "2026-03-04T10:40:07.016920026Z",
                "summary": "Upgrade Proposal v0.2.10",
                "title": "Upgrade Proposal v0.2.10",
                "total_deposit": [
                    {
                        "amount": "50000000",
                        "denom": "ngonka"
                    }
                ],
                "voting_end_time": "2026-03-04T10:50:07.016920026Z",
                "voting_start_time": "2026-03-04T10:40:07.016920026Z"
            }
        ]
    }
    ```

投票选项：

- `VOTE_OPTION_YES`
- `VOTE_OPTION_ABSTAIN`
- `VOTE_OPTION_NO`
- `VOTE_OPTION_NO_WITH_VETO`

4) 撤销委托（从授权者密钥运行）
=== "命令"

    ```
    ./inferenced tx authz revoke <GRANTEE_GONKA_ADDRESS> /cosmos.gov.v1beta1.MsgVote \
      --from=<GRANTER_KEY_NAME> \
      --chain-id=gonka-mainnet \
      --home .inference \
      --keyring-backend file
    ```
=== "示例响应"

    ```
    {
        code: 0
        codespace: ""
        data: ""
        events: []
        gas_used: "0"
        gas_wanted: "0"
        height: "0"
        info: ""
        logs: []
        raw_log: ""
        timestamp: ""
        tx: null
        txhash: A2C3CDA9E95DCF143C0D8981A4F573F1E68879ECF4903B25BA97383C3F2FDFBA
    }
    ```

## 2026年2月21日

**API 二进制文件 v0.2.10-post3 已发布**

新版本的 API 二进制文件已发布。它更新了连接超时处理机制，并在 PoC 验证流程中引入了额外检查。

1. v0.2.10 升级引入了对 Executor → MLNode 连接的严格 5 分钟超时限制，而某些请求可能需要更长时间。新 API 版本恢复了该限制，不再强制执行严格超时。
2. 之前的请求重试系统即使在因处理超时（非 TLS 超时）导致推理失败时也会重试。
对于长时间请求，服务器端重试通常无效，因为它会导致相同的超时情况。同时，客户端可能收到不一致的输出。新 API 版本在这种情况下不再重试推理。
3. 当前被保留且未参与 PoC 生成的 MLNode 仍被用于 PoC 验证。这可能导致推理遗漏。新版本将此类节点排除在 PoC 验证之外。
4. PoC 验证流程中已添加额外保护措施。

PR: [https://github.com/gonka-ai/gonka/pull/785](https://github.com/gonka-ai/gonka/pull/785)

构建版本：[https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.10-post3/decentralized-api-amd64.zip](https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.10-post3/decentralized-api-amd64.zip)

应用更新：
```
# Pre-check: Ensure no confirmation PoC is active (fails entire script if not false)
echo "--- Pre-flight Check: Confirmation PoC Status ---" && \
CONFIRMATION_POC_ACTIVE=$(curl -sf "https://node3.gonka.ai/v1/epochs/latest" | jq -r '.is_confirmation_poc_active') && \
[ "$CONFIRMATION_POC_ACTIVE" = "false" ] && \
echo "OK: No confirmation PoC active" && \

# Download Binary
sudo rm -rf decentralized-api.zip .dapi/cosmovisor/upgrades/v0.2.10-post3/ .dapi/data/upgrade-info.json && \
sudo mkdir -p  .dapi/cosmovisor/upgrades/v0.2.10-post3/bin/ && \
wget -q -O  decentralized-api.zip 'https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.10-post3/decentralized-api-amd64.zip' && \
echo "1b75f2785c7884dc24f3c1e39d5ed10f4afcbe5fc677f5569d90d75c752ec150 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j  decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.10-post3/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.10-post3/bin/decentralized-api && \
echo "API Installed and Verified"  && \

# Link Binary
echo "--- Final Verification ---" && \
sudo rm -rf .dapi/cosmovisor/current && \
sudo ln -sf upgrades/v0.2.10-post3 .dapi/cosmovisor/current && \
echo "de72c665ff71de904210c5472cebb248d163c1398141868e1a1fe198055b5886 .dapi/cosmovisor/current/bin/decentralized-api" | sudo sha256sum --check && \
# Restart 
source config.env && docker compose up api --no-deps --force-recreate -d
```

## 2026年2月20日

**建议（可选）：使用 vLLM / mlnode 构建版本，在 PoC 开始时中断正在进行的请求**

现提供一个新的 vLLM / mlnode 构建版本，可在 PoC 开始时中断正在进行的推理请求，以降低因请求在 PoC 开始时仍处于活跃状态而导致权重下降的风险。

来源：[https://github.com/gonka-ai/vllm/tree/release/v0.9.1-pocv2-post5/vllm](https://github.com/gonka-ai/vllm/tree/release/v0.9.1-pocv2-post5/vllm)

**建议尝试的镜像：**

- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post5
- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post5-blackwell
- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post5-blackwell-sm120

**备注：**

- 此构建版本旨在与先前版本保持向后兼容。
- 该版本已在少量节点上启用，但仍建议在部署前审阅相关变更。  

## 2026年2月19日

**抵押参数更新提案——投票结果**

抵押参数更新提案已结束，但未达到法定人数。根据当前治理规则，该提案被否决。因此，更新后的参数将不会生效。

如前所述，Epoch 180 的抵押激活与此投票无关。

由于该提案未通过，Genesis 中定义的抵押参数将在 Epoch 180 自动生效。

参与者应：

- 审阅 Genesis 中定义的抵押参数。
- 在 Epoch 180 之前准备并存入所需 GNK。
- 确保正确设置 [抵押](https://gonka.ai/host/collateral/)，否则从 Epoch 180 开始，PoC 衍生奖励将减少 5 倍。

抵押激活是协议从宽限期过渡到完全抵押 PoC 权重模型的一部分。治理仍是调整参数的机制，但如果未批准替代方案，则适用默认规则。

!!! note "重要提示：存入时应留有余量"

    强烈建议参与者 **不要** 刚好存入最低金额。由于归一化效应和网络级调整，PoC 权重在各 epoch 之间可能会波动。较小的权重可能经历相对更大的波动。为避免在 epoch 边界出现临时抵押不足，建议存入高达计算出的最低要求 2 倍的金额，尤其是在抵押水平仍相对较低时。这能提供操作安全性，并防止因微小参数变化而导致意外的权重降低。协议不会自动补充抵押。

    如果社区希望再次修改参数，可能会提出新的提案。

## 2026年2月19日

**PoC 权重归一化更新**

最近升级后，由于 PoC 持续时间归一化，节点权重已进行调整。
为将 PoC 权重与实际区块生成时间归一化，校准参数基于观测到的区块间隔选定。实际实施中，有效的 PoC 参考窗口比之前名义假设长约 5 个区块。

因此：

- 节点平均权重下降（归一化效应）
- 显示的 H100 等效总容量相应降低
- 相对 GPU 比例保持不变

**原因说明**

此前，PoC 权重计算依赖于名义上的 epoch 持续时间假设。引入实时归一化后：

- PoC 持续时间与实际出块时间对齐
- 权重更准确地反映实际计算时间

由于有效归一化窗口比之前的名义模型长约 ~5 个区块，每 epoch 重新计算的权重相应更低。

**观测到的 GPU 权重变化（Epoch 175 → 176）**

| GPU 类型 | 纪元 175 | 纪元 176 | 变化 |
|---------------------|----------:|----------:|--------:|
| A100-PCIE-40GB | 11.8 | 10.0 | -15.4% |
| A100-SXM4-80GB | 132.2 | 107.8 | -18.5% |
| H100 80GB HBM3 | 305.1 | 254.5 | -16.6% |
| H100 PCIe | 178.9 | 155.7 | -12.9% |
| H200 | 319.6 | 281.3 | -12.0% |

**追踪器（仪表板）维护人员操作事项**

由于PoC时长归一化已生效，有效参考窗口现在比之前的名义假设长约5个区块，因此从纪元176开始的权重值反映了更新后的计算模型。
从PoC权重推导H100等效容量或奖励预测的追踪器和仪表板，应从纪元176起验证其转换系数。
如果仍使用归一化前的假设，显示的硬件等效值和预测奖励可能会被高估。

## 2026年2月18日

**升级已执行：v0.2.10 现已在主网上线**

链上治理投票针对升级提案v0.2.10已结束。该提案已获批准，升级已在主网上成功执行。此次升级对PoC验证进行了重要优化，并实现了实时权重归一化，以提升网络的公平性和可扩展性。

**注意**

必须重启ML节点容器以触发模型的重新部署。请运行：
```
docker restart join-mlnode-1
```
升级引入的3000个区块宽限期之内，应完成向`mlnode:3.0.12-post4-*`的过渡。

!!! note "兼容性说明"
    本次升级包含迁移到IBC栈v8.7.0。请检查任何解析`inferenced` CLI输出的脚本。枚举和int64/uint64值现在被编码为字符串。

    **现已生效的关键变更****PoC验证采样优化**

    本次升级引入了一种新的PoC验证机制，通过为每个参与者分配一组固定的抽样验证者，将复杂度从O(N^2)降低到O(N x N_SLOTS)。

    **按实际时间进行PoC权重归一化**

    本次升级通过实际PoC经过时间对PoC参与者权重进行归一化，以减少区块时间漂移的影响，并使权重结果与实际执行持续时间保持一致。

    **启用Qwen235B的工具调用功能**

    本次升级为`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`添加了工具调用参数（`--enable-auto-tool-choice`，`--tool-call-parser hermes`），并设置验证阈值为0.958。
    要启用工具功能，必须重启MLNode容器内的vLLM。

    **其他协议更新**

- 修复：PoC和CPoC交集错误（PR #752）。
- IBC升级：将IBC栈升级至v8.7.0。
- 惩罚机制：阈值现在由链上数据推导得出（PR #688）。
- 代币释放：支持在代币释放进行中时的流式转账（PR #641）。
- MLNode：更可靠的MLNode容器版本 ghcr.io/product-science/mlnode:3.0.12-post4 / ghcr.io/product-science/mlnode:3.0.12-post4-blackwell。

**宽限期**：升级后将引入一个3000个区块的宽限期，在此期间无需确认PoC，并且在升级所在周期内，对未命中率和无效率的阈值要求更为宽松。

有关这些变更的更多细节，请参见治理文档：[https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10/README.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10/README.md)

## 2026年2月18日

**抵押参数更新提案现已开放投票**

关于更新抵押参数的提案已发布，供社区投票。

提议参数：

- 每1单位算力需0.032 GNK（约每H100需10 GNK）
- 因未命中率或被监禁而被 slash 0.01%
- 因无效推理而被 slash 0.5%

这意味着在一个周期内，即使受到惩罚，矿工最多只会损失其抵押金的0.5%。所需抵押金仅占日收益的约24%。

**警告**：无论投票结果如何，抵押机制都将生效。如果该提案未通过，则创世时定义的抵押参数将在第180周期自动激活，而非上述列出的参数。

投票结束后且在第180周期之前，每位矿工必须遵循[说明](https://gonka.ai/host/collateral/#slashing)将所需资金转入抵押。否则，自第180周期起，其奖励将减少5倍。

获取更新后的参数方法：
```
export NODE_URL=https://node3.gonka.ai/
diff -u \
  <(./inferenced query inference params -o json --node $NODE_URL/chain-rpc/ | jq '.params') \
  <(./inferenced query gov proposal 28 -o json --node $NODE_URL/chain-rpc/ | jq '.proposal.messages[] | select(."type"=="inference/x/inference/MsgUpdateParams") | .value.params') \
  || true

```

参与投票（`yes`, `no` , `abstain` , `no_with_veto`）：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 28 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```

查看投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 28 -o json --node $NODE_URL/chain-rpc/
```
**截止时间**：

投票将于2026年2月19日07:27:06 UTC结束。

## 2026年2月17日

**v0.2.10升级提案进入治理流程**

下一次链上软件版本v0.2.10的升级提案现已在链上发布，并开放投票。若获批准，该提案将对PoC验证引入重大优化（默认禁用），并实现按实时权重归一化，以提升网络的公平性和可扩展性。

**关键变更****PoC验证采样优化**

本次升级引入了一种新的PoC验证机制，通过为每个参与者分配一组固定的抽样验证者，将复杂度从O(N^2)降低到O(N x N_SLOTS)。

**按实际时间进行PoC权重归一化**

此次升级通过实际的PoC经过时间来规范化PoC参与者权重，以减少区块时间漂移的影响，并使权重结果与实际执行时长保持一致。

**启用Qwen235B的工具功能**

此次升级为`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`添加了工具调用参数（`--enable-auto-tool-choice`，`--tool-call-parser hermes`），并设置了验证阈值`0.958`。
要启用工具功能，必须重启MLNode容器内的vLLM。升级引入了一个3000个区块的宽限期，在此期间无需进行确认PoC，并且在升级所在周期内，对未命中率和无效率的限制将更为宽松。

**协议其他更新**

- 修复了PoC和CPoC交集的bug（PR #752）
- 将IBC栈升级至v8.7.0版本。
- 惩罚阈值现在由链上数据推导得出（PR #688）
- 支持带有活跃释放期的streamvesting转账（PR #641）
- 更可靠的MLNode容器版本`ghcr.io/product-science/mlnode:3.0.12-post4` / `ghcr.io/product-science/mlnode:3.0.12-post4-blackwell`。

这些及其他变更的更多细节可在治理文档中查看：[https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10/README.md ](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10/README.md)

**升级执行后所需的主机操作**

如果提案获得批准并执行升级，则必须重启ML节点容器以触发模型的重新部署。请运行：
```
docker restart join-mlnode-1
```
向`mlnode:3.0.12-post4-*`的过渡应在升级引入的3000个区块宽限期内完成。

**如何投票**

提案详情和投票可通过`inferenced`进行。任何活跃节点均可使用。可用节点包括：

- [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
- [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
- [https://node3.gonka.ai](https://node3.gonka.ai)

提交您的投票（`yes`, `no` , `abstain` , `no_with_veto`）：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 27 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```

查看投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 27 -o json --node $NODE_URL/chain-rpc/
```
**截止时间**

- 投票截止时间：2026年2月18日 09:26:26 UTC
- 升级高度：2712600
- 预计升级时间：2026年2月18日 15:30:00 UTC

**注意**

- 请检查任何解析`inferenced` CLI输出的脚本。由于IBC栈升级至v8.7.0，枚举和int64/uint64值现在以字符串形式编码。
- 请计划在升级期间保持在线，以便及时执行后续步骤或缓解指令。
- 在升级期间，Cosmovisor会在`.inference/data`目录中创建完整的状态备份；请确保有足够的磁盘空间。有关安全删除`.inference`目录中旧备份的指导，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。
- 如果`application.db`占用了大量磁盘空间，可以应用[此处](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)描述的清理技术。
- 升级后，Postgres可作为本地负载存储的选项。

## 2026年2月16日

**抵押品激活及拟议初始参数**

距离Epoch 180不足7天——是时候准备了。

如AMA期间讨论以及社区成员提出的论点所述，提案建议从小额抵押要求和最低惩罚开始。

将提交社区投票的参数：

- 每1单位算力0.032 GNK（约每H100 10 GNK）
- 未命中率或被监禁时惩罚0.01%
- 无效推理时惩罚0.5%

这意味着在一个周期内，即使受到处罚，矿工损失的抵押品也不会超过其抵押总额的0.5%。所需抵押品仅占日收益的约24%。

一旦提案提交投票，将发布单独公告。

警告：无论提案投票结果如何，抵押机制都将会生效。如果该提案未通过，Genesis中定义的抵押参数将在第180个纪元自动激活，而非上述列出的参数。

未来任何抵押金额的增加都将通过单独的投票来提出。目标是观察网络稳定性，并确保不当惩罚极为罕见且仅在有效理由下执行。如果稳定性得到验证，将逐步增加抵押金额至代币经济白皮书中描述的水平（例如，每台H100约100 GNK），以支持网络的长期成功。

## 2026年2月13日

**即将进行的v0.2.10版本升级投票与执行时间表**

即将进行的软件升级v0.2.10的链上投票预计将于周日晚间（洛杉矶时间）/ 周一上午（UTC）开始。
如果该提案通过治理批准，升级计划将于周二执行。

**大致时间线：**

- 周日晚间（洛杉矶时间）—— 投票期开始
- 周一（UTC上午）—— 投票进行中
- 周二 —— 升级执行（如获批准）

请查看GitHub上的v0.2.10升级PR并留下您的反馈。对于有意义的评审贡献，可能会在下次升级中提供赏金。

[https://github.com/gonka-ai/gonka/pull/695](https://github.com/gonka-ai/gonka/pull/695)

## 2026年2月13日

如果您的节点未能及时应用最新升级，可能在区块2628371处因共识失败而停止运行。这是因为节点运行的二进制文件已过时，不再与网络兼容。要恢复运行，请遵循本指南 [https://gonka.ai/FAQ/#recovery-guide-consensus-failure-after-missing-patch](https://gonka.ai/FAQ/#recovery-guide-consensus-failure-after-missing-patch)

## 2026年2月12日

**网络更新：补丁已发布（PoC / cPoC 重叠问题）**

现已提供补丁以解决当前纪元（169/170）中观察到的事件。

**需要采取的行动**

要求主机尽快应用此补丁，以确保PoC验证行为正确，并安全恢复区块生产。
```
# Download Binary
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.9-post3/ .inference/data/upgrade-info.json
sudo mkdir -p  .inference/cosmovisor/upgrades/v0.2.9-post3/bin/
wget -q -O  inferenced.zip 'https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.9-post3/inferenced-amd64.zip' && \
echo "59896da31f4e42564fc0a2f63a9e0bf4f25f240428f21c0d5191b491847553df  inferenced.zip" | sha256sum --check && \
sudo unzip -o -j  inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.9-post3/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.9-post3/bin/inferenced && \
echo "Inference Installed and Verified"

# Link Binary
echo "--- Final Verification ---" && \
sudo rm -rf .inference/cosmovisor/current
sudo ln -sf upgrades/v0.2.9-post3 .inference/cosmovisor/current
echo "aaffbbdc446fbe6832edee8cb7205097b2e5618a8322be4c6de85191c51aca1d .inference/cosmovisor/current/bin/inferenced" | sudo sha256sum --check && \

# Restart 
source config.env && docker compose up node --no-deps --force-recreate -d
```

[https://github.com/gonka-ai/gonka/pull/748](https://github.com/gonka-ai/gonka/pull/748)

## 2026年2月12日

**网络事件：PoC / cPoC 重叠（区块生产暂停）**

在当前纪元中观察到cPoC（确认PoC）与PoC之间存在重叠。在该纪元最后一个区块之前，`is_confirmation_poc_active`被观察为`true`。

目前正评估此重叠的影响。初步观察表明，没有节点记录PoC提交，导致该纪元累计权重为零。

作为预防措施，矿工通过协调行动暂时停止了区块生产。

问题正在定位中。

请保持在线，以防需要立即应用补丁。补丁详情和操作说明将在准备就绪后发布。

## 2026年2月12日

**推理功能现已开放**

链上推理访问当前已开放，且不限于开发者。推理请求可通过上一次更新中引入的允许传输代理（Allowed Transfer Agents）发送。当前白名单可在链上查询：
```
curl "http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/params" | jq '.params.transfer_agent_access_params.allowed_transfer_addresses'
```
允许的传输代理（当前）：
```
 gonka1y2a9p56kv044327uycmqdexl7zs82fs5ryv5le
 gonka1dkl4mah5erqggvhqkpc8j3qs5tyuetgdy552cp
 gonka1kx9mca3xm8u8ypzfuhmxey66u0ufxhs7nm6wc5
 gonka1ddswmmmn38esxegjf6qw36mt4aqyw6etvysy5x
 gonka10fynmy2npvdvew0vj2288gz8ljfvmjs35lat8n
 gonka1v8gk5z7gcv72447yfcd2y8g78qk05yc4f3nk4w
 gonka1gndhek2h2y5849wf6tmw6gnw9qn4vysgljed0u
```
新版本库可在此处获取： [https://gonka.ai/developer/quickstart/#3-inference-using-modified-openai-sdk](https://gonka.ai/developer/quickstart/#3-inference-using-modified-openai-sdk) 

**注意： DONE** 如果地址未包含在白名单中，则通过该地址路由的推理请求在当前配置下将不被接受。

## 2026年2月10日 

**升级v0.2.10的PR审查**

[拉取请求](https://github.com/gonka-ai/gonka/pull/695) 针对下一次链上软件升级v0.2.10，现已开放审查。欢迎提供反馈和改进建议。目前计划将审查窗口保持约2天。

对本次PR审查做出有意义贡献的悬赏可能在下一次升级中提出。

这仅是请求审查拉取请求，并非正式投票的开始。治理投票流程将在审查期结束后启动。

**主要变更****[PR #710](https://github.com/gonka-ai/gonka/pull/710) PoC验证采样优化**

此次升级引入了一种新的PoC验证机制，通过为每个参与者分配一组固定的采样验证者，将复杂度从O(N^2)降低到O(N x N_SLOTS)。参考设计与分析： [https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/poc/optimize.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/poc/optimize.md)  

**[PR #725](https://github.com/gonka-ai/gonka/pull/725) 根据实际PoC时间进行PoC权重归一化**

此次升级通过实际PoC经过的时间对PoC参与者权重进行归一化，以减少区块时间漂移影响，并使权重结果与实际执行持续时间保持一致。

**其他主要变更：**

- **[PR #708](https://github.com/gonka-ai/gonka/pull/708)** IBC升级至v8.7.0
- **[PR #723](https://github.com/gonka-ai/gonka/pull/723)** 测试网桥接设置脚本
- **[PR #666](https://github.com/gonka-ai/gonka/pull/666)** 优化制品存储吞吐量
- **[PR #688](https://github.com/gonka-ai/gonka/pull/688)** 从链上数据获取惩罚统计
- **[PR #697](https://github.com/gonka-ai/gonka/pull/697)** 为macOS测试构建提供便携式BLST构建
- **[PR #712](https://github.com/gonka-ai/gonka/pull/712)** 要求proto-go生成代码与已提交代码匹配
- **[PR #711](https://github.com/gonka-ai/gonka/pull/711)** 从链状态获取PoC测试参数
- **[PR #641](https://github.com/gonka-ai/gonka/pull/641)** 带有归属的流式归属转账
- **[PR #659](https://github.com/gonka-ai/gonka/pull/659)** 模型分配检查前一周期奖励。
- **[PR #716](https://github.com/gonka-ai/gonka/pull/716)** 为提高清晰度和正确性重命名PoC权重函数。

**API加固和可靠性修复：**

- **[PR #634](https://github.com/gonka-ai/gonka/pull/634)**：添加请求体大小限制以降低DoS风险。
- **[PR #727](https://github.com/gonka-ai/gonka/pull/727)**：#634的后续，将响应写入器传递给 `http.MaxBytesReader` 并对齐测试。
- **[PR #638](https://github.com/gonka-ai/gonka/pull/638)**：修复请求处理中的不安全类型断言。
- **[PR #644](https://github.com/gonka-ai/gonka/pull/644)**：避免每次启动时重写静态配置。
- **[PR #661](https://github.com/gonka-ai/gonka/pull/661)**：防止短时网络中断导致API崩溃。
- **[PR #640](https://github.com/gonka-ai/gonka/pull/640)**：为节点版本端点行为添加单元测试。
- **[PR #622](https://github.com/gonka-ai/gonka/pull/622)**：在 `InvalidateInference` 中传播退款错误。
- **[PR #639](https://github.com/gonka-ai/gonka/pull/639)**：在任务申领路径中添加遗漏的错误返回。
- **[PR #643](https://github.com/gonka-ai/gonka/pull/643)**：在执行者选择中清理空参与者。
- **[PR #545](https://github.com/gonka-ai/gonka/pull/545)**：修复API流程中的小错误。

**升级计划**

二进制版本预计将通过链上升级提案进行更新。有关升级流程的更多信息，请参阅 [https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/docs/upgrades.md.](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/docs/upgrades.md.)

现有主机无需升级其 `api` 和 `node` 容器。更新的容器版本适用于链上升级完成后加入的新主机。

**建议流程**

1. 活跃主机在GitHub上审查此提案并留下反馈。
2. PR 经社区审核后，预计会从该分支创建 v0.2.10 版本发布，并可提交此版本的链上升级提案，启动正式的治理投票流程。
3. 如果链上提案通过，预计在链上执行升级后合并此 PR。

从 [upgrade-v0.2.10](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.10) 分支（而非 `main`）创建发布版本，可最大限度减少 `main` 分支上的 `/deploy/join/` 目录包含与链上二进制版本不匹配的容器版本的时间，确保新主机更顺畅的入门体验。

**测试与迁移**

v0.2.10 的测试指南和迁移详情记录在[此处](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10)。请仔细查阅。

**兼容性说明**

如果您有任何解析 `inferenced` CLI JSON 输出的脚本，请在此升级后重新检查。由于 ibc-go 升级到 v8.7.0，枚举现在以字符串形式编码而非数字，int64/uint64 值现在也以字符串形式编码。

## 2026年2月4日

**CLI 更新提醒**

对于在 v0.2.9 升级后创建的热密钥授予权限，应使用 [CLI 版本 v0.2.9](https://github.com/gonka-ai/gonka/releases/tag/release%2Fv0.2.9)。

## 2026年2月3日

**PoC v2 基于推理的权重调整**

随着 PoC v2 启用，权重分配现在基于当前模型 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 上测得的推理性能。因此，中位 GPU 权重以及不同类型 GPU 之间的相对权重比例均已调整。

**观察到的 GPU 权重变化（Epoch 158 → 159）**

| GPU 类型 | Epoch 158 | Epoch 159 | 变化 |
|------------------|-----------|-----------|--------|
| A100-PCIE-40GB | 129.05 | 17.31 | -86.6% |
| A100-SXM4-80GB | 204.12 | 127.75 | -37.4% |
| B200 | 739.81 | 300.75 | -59.3% |
| H100 80GB HBM3 | 424.73 | 292.88 | -31.0% |
| H100 PCIe | 307.03 | 144.53 | -52.9% |
| H200 | 512.38 | 303.88 | -40.7% |

**Context**

- 观测到的变化表明，GPU权重差异现在反映的是特定模型的推理吞吐量，而非名义上的硬件规格。例如，H100 PCIe的权重下降幅度大于H100 HBM3的权重，这与在PoC中观察到的`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`推理行为一致。
- 根据当前模型配置，基于观察到的推理轨迹，B200 GPU并未表现出比H100级别GPU更高的推理性能。
- 如果在未来周期中通过治理引入更大或要求更高的模型（例如DeepSeek V3.2），可能会观察到不同的性能特征。
- 在PoC之外进行的控制推理基准测试，使用相同模型`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`的标准vLLM推理，显示出与PoC v2中观察到的GPU类型间相同的相对性能差异。

**对追踪器（仪表板）维护者的操作建议**

随着新权重分配的生效，追踪器（仪表板）维护者可能需要审查第159周期及之后的系数，以确保与当前PoC v2的权重分配保持一致。

## 2026年2月2日

**网络更新——补丁已发布**

现已提供一个补丁，用于解决在PoC周期中导致区块验证最近暂停的问题。建议节点尽快应用该补丁，以确保PoC验证行为正确，并安全恢复区块生产。

**需要采取的操作**

要求节点尽快应用该补丁，以确保PoC验证行为正确，并安全恢复区块生产。
```
# Download Binary
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.9-post2/ .inference/data/upgrade-info.json
sudo mkdir -p  .inference/cosmovisor/upgrades/v0.2.9-post2/bin/
wget -q -O  inferenced.zip 'https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.9-post2/inferenced-amd64.zip' && \
echo "8de51bdd1d2c0af5f1da242e10b39ae0ceefd215f94953b9d95e9276f7aa70c7  inferenced.zip" | sha256sum --check && \
sudo unzip -o -j  inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.9-post2/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.9-post2/bin/inferenced && \
echo "Inference Installed and Verified"

# Link Binary
echo "--- Final Verification ---" && \
sudo rm -rf .inference/cosmovisor/current
sudo ln -sf upgrades/v0.2.9-post2 .inference/cosmovisor/current
echo "75410178a4c3b867c0047d0425b48f590f39b9e9bc0f3cf371d08670d54e8afe .inference/cosmovisor/current/bin/inferenced" | sudo sha256sum --check && \

# Restart 
source config.env && docker compose up node --no-deps --force-recreate -d
```
将另行分享进一步说明，包括恢复区块验证所需的任何协调步骤。

## 2026年2月2日

**区块验证已作为预防措施暂停**

由于当前PoC周期内可能存在无法满足验证阈值的高风险，各节点运营方已集体采取行动暂停区块验证。根据目前评估，用于处理此情况的机制可能无法按预期运行。为防止在不确定或不安全条件下完成验证者最终确定，网络在验证者选定之前已被暂停。

**下一步**

目前正在执行以下操作：

- 验证是否没有任何验证者集合能够达到所需的验证阈值
- 确认验证者最终确定前的网络状态
- 准备补丁以解决已识别的问题

**需要采取的行动**

所有节点运营方必须准备好在短时间内安装补丁。请保持在线并密切关注公告。补丁就绪后将立即发布进一步说明。

## 2026年2月1日

**升级已执行：v0.2.9 现已在主网上线**

链上治理投票关于升级提案 v0.2.9 已结束。该提案已获批准，并于区块 2451000 成功在主网上执行。此次升级实现了 PoC v2 的权重分配机制，并完成了从旧版 PoC 机制的过渡。

**注意**

- 下一个 PoC 周期（从第158轮过渡到第159轮）至关重要。请计划保持在线，以便在需要时能够及时执行后续步骤或缓解措施。
- 只有服务 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 的 ML 节点才有资格进入下一个（第159）轮并参与 PoC v2 的权重分配。运行其他模型的 ML 节点将不会被纳入下一轮的参与者集合。

**节点准备**

建议各节点运营方验证所有 ML 节点：

- 仅配置为服务支持的模型 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 镜像已更新至支持 PoC v2 的版本

有关将 ML 节点切换至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、升级 ML 节点镜像以及移除其他模型的指导，请参见[常见问题解答](https://gonka.ai/FAQ/#how-to-switch-to-qwenqwen3-235b-a22b-instruct-2507-fp8-upgrade-ml-nodes-and-remove-other-models)。

**当前生效的关键变更****PoC v2 激活**

- PoC v2 现作为权重分配的主动机制使用
- 确认 PoC（V2 跟踪）被用作结果的权威来源
- 旧版 PoC 逻辑不再用于权重计算

**模型配置**

- 网络以单模型配置运行
- 用于 PoC v2 和权重分配的模型为 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 服务其他模型的 ML 节点不会被纳入 PoC v2 权重分配。在支持的情况下，可能会自动切换至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`

**资格标准**

ML 节点要具备 PoC v2 权重分配资格，必须同时满足以下两个条件：

- 节点服务 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 节点运行 PoC v2 兼容镜像：
    - ghcr.io/product-science/mlnode:3.0.12-post1
    - ghcr.io/product-science/mlnode:3.0.12-post1-blackwell

**cPoC 情况下的奖励流动修正**

在因 cPoC 惩罚而导致奖励减少或排除的情况下，未计入的部分将转入社区池。此前，此类奖励会重新分配给其他参与者。

**其他协议更新**

- 转移代理角色在初始阶段仅限于[定义的名单](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#transfer-agent-whitelist) `allowlist`
- 在忽略PoC验证的情况下参与PoC生成的节点已从[参与者名单](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#suspicious-participant-removal) `allowlist` 中移除
- 当PoC v2验证投票阈值未达到时，[守护者权重](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#guardian-tiebreaker-for-poc-v2-voting)将作为确定性备选方案应用

有关这些变更的更多详细信息，请参见治理文档：[https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9 ](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9 )

## 2026年2月1日

v0.2.9升级提案的链上治理流程即将结束。

- 投票截止时间：2026年2月1日 22:02:58 UTC
- 升级区块高度：2451000。
- 预计升级时间：2026年2月2日 05:10:00 UTC

建议节点运营方在[GitHub](https://github.com/gonka-ai/gonka/pull/668)上审阅该提案并参与投票。

提前预下载二进制文件有助于避免在升级期间依赖GitHub的可用性。
```
# 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.9/bin \
              .inference/cosmovisor/upgrades/v0.2.9/bin && \

# 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.9/decentralized-api-amd64.zip" && \
echo "ac1ad369052a8c3d01af4d463c49cdd16fcbecc365d201232e7a2d08af8501c0 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.9/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.9/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

# 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.9/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.9/inferenced-amd64.zip" && \
echo "fc628d77aa516896924fbd8f60b8aa6a14161de4582aaef634de62382ea482eb inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.9/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.9/bin/inferenced && \
echo "Inference Installed and Verified" && \

# 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.9/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.9/bin/inferenced && \
echo "52c79f06a8fc175ca6b3819523bb36afbf601d8a8320b1bb5a3cc089ceef62c4 .dapi/cosmovisor/upgrades/v0.2.9/bin/decentralized-api" | sudo sha256sum --check && \
echo "ae20517e4bb38293202f7f5d52439d5315cb32c8f3c34a02fa65feaefadd6193 .inference/cosmovisor/upgrades/v0.2.9/bin/inferenced" | sudo sha256sum --check
```

## 2026年1月31日

**v0.2.9升级提案进入治理流程**

下一轮链上软件版本v0.2.9的升级提案现已发布上链，进入投票阶段。若提案获得通过，将通过链上治理启用PoC v2进行权重分配，并完成从旧版PoC机制的过渡。

**主要变更****PoC v2激活**

- PoC v2将作为权重分配的现行机制
- 确认PoC（V2追踪）将作为结果的权威来源
- 旧版PoC逻辑不再用于权重计算

**模型配置**

- 网络将以单模型配置运行
- 用于PoC v2和权重分配的模型为 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 提供其他模型的ML节点不会被纳入PoC v2的权重分配。在支持的情况下，可能会自动切换至模型 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`

**资格条件**

ML节点要具备PoC v2权重分配资格，必须同时满足以下两个条件：

- 节点提供模型 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 节点运行PoC v2兼容的镜像：
    - ghcr.io/product-science/mlnode:3.0.12-post1
    - ghcr.io/product-science/mlnode:3.0.12-post1-blackwell

**cPoC情况下的奖励流向修正**

在因cPoC惩罚导致奖励减少或被排除的情况下，未分配的部分将转入社区资金池。此前，此类奖励会重新分配给其他参与者。

**其他协议更新**

- 转移代理角色在初始阶段仅限于[定义的名单](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#transfer-agent-whitelist) `allowlist`
- 在忽略PoC验证的情况下参与PoC生成的节点已从[参与者名单](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#suspicious-participant-removal) `allowlist` 中移除
- 当PoC v2验证投票阈值未达到时，[守护者权重](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#guardian-tiebreaker-for-poc-v2-voting)将作为确定性备选方案应用

有关这些变更的更多详细信息，请参见治理文档：[https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9)

**节点运营方准备工作**

建议节点运营方确认所有ML节点：

- 仅配置为提供支持的模型 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 镜像已更新至PoC v2兼容版本

有关将ML节点切换到`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、升级ML节点镜像以及移除其他模型的指导，请参见[常见问题](https://gonka.ai/FAQ/#how-to-switch-to-qwenqwen3-235b-a22b-instruct-2507-fp8-upgrade-ml-nodes-and-remove-other-models)。

**如何投票**

提案详情和投票可通过`inferenced`访问。任何活跃节点均可使用。可用节点包括：

- [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
- [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
- [http://node3.gonka.ai:8000](http://node3.gonka.ai:8000)
- [https://node4.gonka.ai](https://node4.gonka.ai)

进行投票（`yes`，`no`，`abstain`，`no_with_veto`）：
```
export NODE_URL=https://node4.gonka.ai/
./inferenced tx gov vote 26 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```
查看投票状态：
```
export NODE_URL=https://node4.gonka.ai/
./inferenced query gov votes 26 -o json --node $NODE_URL/chain-rpc/
```
**截止日期**

- 投票结束时间：2026年2月1日 22:02:58 UTC
- 升级高度：2451000。
- 预计升级时间：2026年2月2日 05:10:00 UTC

建议节点运营者在[GitHub](https://github.com/gonka-ai/gonka/pull/668)上查看提案并参与投票。

**注意**

- 请确保在升级期间保持在线，以便在需要时能及时执行后续步骤或缓解措施。
- 升级期间，Cosmovisor 会在 `.inference/data` 目录中创建完整的状态备份。请在升级前确保有足够的磁盘空间。有关如何安全删除 `.inference` 目录中旧备份的指导，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。
- 如果 `application.db` 占用大量磁盘空间，可以应用[此处](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)描述的清理技术。
- 升级后，Postgres 可作为本地负载存储的选项。

## 2026年1月29日

**PoC 验证参与通知**

在最近的一个纪元中，大量 ML 节点未获得 PoC 权重。
分析表明，这是由于 PoC 验证参与不足所致。在多个案例中，参与者发布了随机数（nonce），但未执行验证，或验证水平远低于协议要求。
下表列出了在上一个纪元中有权重、在当前纪元提交了 PoC 随机数但未参与或参与不足的 PoC 验证阶段的参与者：[https://docs.google.com/spreadsheets/d/17agQXP77lATT2bNK12OEOzek5wNSptN2ktiSag3QXB0/](https://docs.google.com/spreadsheets/d/17agQXP77lATT2bNK12OEOzek5wNSptN2ktiSag3QXB0/)

他们的总权重约为 36%。加上完全未参与 PoC 的参与者，未参与或参与度低的总权重达到约 48%，这一比例极高。
如果您的节点在此表中且 `validated` 列为 0，请检查您的 PoC 验证日志和配置，确保验证按预期运行。

此笔记本展示了生成上述表格的过程：[https://github.com/gonka-ai/gonka/blob/gm/debug-155-1/debug-validation.ipynb](https://github.com/gonka-ai/gonka/blob/gm/debug-155-1/debug-validation.ipynb)。

## 2026年1月29日 

**升级已执行：v0.2.8 已在主网上线**

关于升级提案 v0.2.8 的链上治理投票已结束。该提案已获批准，并在主网上成功执行。
本次升级实现了 PoC v2 架构，简化了模型支持，并应用了关键的安全性和可靠性修复。

**现已生效的主要变更****PoC v2 核心集成**

- vLLM 集成：PoC 已直接集成到 vLLM 中，可在推理和 PoC 之间立即切换，无需卸载模型。
- MMR 承诺：使用 Merkle Mountain Range 承诺将工件存储迁移到链下；仅将 `root_hash` 和 `count` 记录在链上。
- 双模式迁移：支持 V1（常规 PoC）和 V2（确认 PoC）的追踪。

**模型可用性更新**

支持的模型集现已受限。除以下模型外，所有先前支持的模型均已从活动集中移除：

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `Qwen/Qwen3-32B-FP8`

**安全性和可靠性改进**

- SSRF 和 DoS：验证 `InferenceUrl` 以拒绝内部 IP，并添加超时机制以防止请求挂起。
- 投票翻转：拒绝重复的 PoC 验证以防止覆盖。
- 认证绕过：将 `epochId` 与签名绑定，以针对正确纪元进行验证。

**参与 PoC v2 的节点要求**

要具备参与 PoC v2 的资格，节点需完成以下操作：

- 模型配置：配置 ML 节点以提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- ML 节点升级：使用支持 PoC v2 的版本：
    - ghcr.io/product-science/mlnode:3.0.12
    - ghcr.io/product-science/mlnode:3.0.12-blackwell

!!! note 
    未能满足这两个条件的节点，在网络过渡到单模型配置后将不具备参与 PoC v2 的资格。向 PoC v2 过渡以分配权重仍需满足观察到的采用阈值并通过后续治理决定。

    **维护与运营**

- Cosmovisor：节点和API二进制文件的更新将自动处理。现有主机无需对正在运行的容器执行手动更新。
- 磁盘空间：Cosmovisor会在`.inference/data`目录中创建完整的状态备份。请确保有250GB以上的可用空间。
- Postgres：升级后，现在可以通过Postgres配置本地负载存储。

建议在升级后的窗口期内监控节点状态并通过Discord进行沟通，以确保系统稳定。

## 2026年1月28日

**如何切换到`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、升级ML节点并移除其他模型？**

本指南说明了主机应如何更新其ML节点，以应对v0.2.8版本中模型可用性的变化以及即将推出的PoC v2更新。从第155纪元开始，将检查ML节点配置是否符合PoC v2要求。建议主机在此之前审查并准备其ML节点配置。迁移至PoC v2可在第155纪元后安排。迁移阶段结束后，不符合配置要求的ML节点的权重可能不会被计入。

**1. 背景：模型可用性变更（升级v0.2.8）**

作为v0.2.8升级的一部分，活动模型集合已更新。

**支持的模型（活动集合）**

仅以下模型仍受支持：

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `Qwen/Qwen3-32B-FP8`

`Qwen/Qwen3-32B-FP8`在迁移期间仍受支持，但不计入PoC v2准备状态或权重分配。参与PoC v2需要提供`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。

**已移除的模型**

所有先前支持的模型均已从活动集合中移除，不得再提供服务。

**3. PoC v2准备条件（重要）**

成功参与PoC v2过渡需要满足以下两个条件：

- 您所有的ML节点都提供Qwen/Qwen3-235B-A22B-Instruct-2507-FP8。这是唯一对PoC v2权重有贡献的模型。
- 您所有的ML节点都已升级到支持PoC v2的镜像：
    - ghcr.io/product-science/mlnode:3.0.12
    - ghcr.io/product-science/mlnode:3.0.12-blackwell

!!! note "重要"

    - 仅提供正确的模型但未升级ML节点是不够的。
    - 在网络切换为单模型配置后，未满足这两个条件的节点将不具备资格。
    - 必须在迁移完成前完成ML节点升级，并在v0.2.8升级之后通过单独的治理提案激活PoC v2。
    - v0.2.8升级本身不会启用PoC v2。

**3. 检查ML节点分配状态（推荐的安全步骤）**

在更改模型之前，您应检查当前ML节点的分配状态。查询您的网络节点管理API：
```
curl http://127.0.0.1:9200/admin/v1/nodes
```
查找字段：
```
"timeslot_allocation": [
  true,
  false
]
```
解释：

- 第一个布尔值：节点是否在当前纪元中提供推理服务
- 第二个布尔值：节点是否计划在下一个PoC中提供推理服务

**推荐行为**

- 建议仅在第二个值为`false`的节点上更改模型
- 这可以在观察PoC v2行为期间降低风险
- 鼓励在多个纪元中逐步 rollout

**4. 更新ML节点模型：仅保留支持的模型**

预下载模型权重（推荐）。为避免启动延迟，请将权重预下载到`HF_HOME`：
```
mkdir -p $HF_HOME
huggingface-cli download Qwen/Qwen3-235B-A22B-Instruct-2507-FP8
```
使用ML节点管理API将ML节点切换到支持的模型（`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`）。

例如：
```
curl -X PUT "http://localhost:9200/admin/v1/nodes/node1" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "node1",
    "host": "inference",
    "inference_port": 5000,
    "poc_port": 8080,
    "max_concurrent": 800,
    "models": {
      "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8": {
        "args": [
          "--tensor-parallel-size",
          "4",
          "--max-model-len",
          "240000"
        ]
      }
    }
  }'
```
通过管理API所做的更改将在下一个epoch替换模型 [https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)

!!! note 

    `node-config.json` 仅在首次启动网络节点API或本地状态/数据库被删除时使用。如需全新重启，请编辑此内容。对于已存在的节点，应通过管理API执行模型更新。

    **5. 升级ML节点镜像（PoC v2所必需）**

    编辑 `docker-compose.mlnode.yml` 并更新ML节点镜像：

    标准GPU
```
image: ghcr.io/product-science/mlnode:3.0.12
```
NVIDIA Blackwell GPU
```
image: ghcr.io/product-science/mlnode:3.0.12-blackwell
```
应用更改并重启服务。从 `gonka/deploy/join` 开始：
```
source config.env
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml pull
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d
```

**6. 验证模型服务（在下一个epoch生效）**

确认ML节点仅提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 服务，这是用于PoC v2权重及未来权重分配的唯一模型：
```
curl http://127.0.0.1:8080/v1/models | jq
```
可选：重新检查节点分配：
```
curl http://127.0.0.1:9200/admin/v1/nodes
```

!!! note "治理与PoC v2激活说明"
    PoC v2将分阶段引入，不会一次性激活。

    **第1阶段：观察（v0.2.8升级后的当前状态）**

    在v0.2.8升级后，PoC v2逻辑已可用，但尚未激活用于权重分配。

    此阶段期间：

    - 托管方可提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 或 `Qwen/Qwen3-32B-FP8` 服务
    - 托管方必须将其ML节点切换为提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 服务，并升级至支持PoC v2的版本，才能参与PoC v2权重贡献。
    - 网络将观察采用情况，以评估托管方对过渡到PoC v2权重的准备程度。

    **第2阶段：治理提案（可选，未来）**

    当活跃托管方中达到足够高的采用率（约50%）时：

    - 可提交单独的治理提案
    - 该提案可能请求批准激活PoC v2并使用PoC v2进行权重分配

    采用门槛仅为观察性指标，不会触发任何自动变更。

    **第3阶段：激活（仅在治理批准后）**

    仅当链上治理批准该提案后，PoC v2才会成为活跃的权重分配方式。
    在该提案获批之前：

    - PoC v2在权重分配方面仍处于非活跃状态
    - 现有的PoC机制将继续用于确定权重

**摘要清单**

在PoC v2激活前，请确保：

- ML节点提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 服务
- 从配置中移除所有其他模型
- ML节点镜像为3.0.12（或3.0.12-blackwell）

## 2026年1月28日

v0.2.8升级提案的链上治理流程即将结束。

**升级详情**

- 升级高度：区块 2387000
- 预计时间：2026年1月29日 06:30:00 UTC

提前预下载二进制文件可能有助于避免在升级期间依赖GitHub的可用性。

```
# 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.8/bin \
              .inference/cosmovisor/upgrades/v0.2.8/bin && \

# 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.8-post1/decentralized-api-amd64.zip" && \
echo "45f28afba4758e54988f61cc358f0ad683e7832ab121ccd54b684fe4c9381a75 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.8/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.8/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

# 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.8/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.8-post1/inferenced-amd64.zip" && \
echo "f0f2e3ee8760e40a78087c98c639a7518bf062138141ed4aec2120f5bc622a67 inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.8/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.8/bin/inferenced && \
echo "Inference Installed and Verified" && \

# 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.8/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.8/bin/inferenced && \
echo "421a761f3a7037d72ee0bd8b3f50a744349f717439c7e0fee28c55948dae9a7c .dapi/cosmovisor/upgrades/v0.2.8/bin/decentralized-api" | sudo sha256sum --check && \
echo "308c63c7bda4fb668632ac3e13f3f6cccacf54c563c8e9fd473bcb48c7389fe0 .inference/cosmovisor/upgrades/v0.2.8/bin/inferenced" | sudo sha256sum --check
```

## 2026年1月27日

**v0.2.8 升级提案进入治理阶段**

下一次链上软件版本 v0.2.8 的升级提案现已发布到链上，开始接受投票！
您的审查和投票对于确保网络的稳定性及未来能力至关重要。

**v0.2.8 中的主要变更****PoC v2（核心升级）**

- 将 PoC 直接集成到 vLLM 中，能够在推理和 PoC 之间立即切换，无需卸载模型或加载单独的 PoC 模型。
- 使用 MMR（Merkle Mountain Range）承诺将工件存储迁移到链下——仅在链上记录 root_hash 和 count。
- 包含双模式迁移策略：V1 用于常规 PoC，V2 跟踪用于上线期间的确认 PoC。

**模型可用性变更**

作为 v0.2.8 升级的一部分，受支持模型的集合将被更新。所有先前支持的模型都将从活动集合中移除，仅保留：

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `Qwen/Qwen3-32B-FP8`

使用 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 成功参与 PoC v2，并配合所需的 ML 节点版本，将用于评估向 PoC v2 迁移的准备情况。当观察到足够水平的采用率（约50%）在活跃 Host 中达成后，可能会提交单独的治理提案以批准并激活 PoC v2 用于分配权重。此阈值仅为观察用途，不会触发任何自动的网络变更。

在下一次网络步骤通过治理批准后，网络将暂时仅支持 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。

**安全性、正确性和可靠性改进**

- SSRF & DoS：验证 InferenceUrl 以拒绝内部 IP，并添加超时机制防止请求挂起。
- 投票翻转：通过拒绝重复项防止 PoC 验证被覆盖。
- PoC 排除：修复 getInferenceServingNodeIds 以正确排除推理服务节点。
- 认证绕过与重放攻击：将 epochId 绑定到签名，并针对正确 epoch 验证授权。

由于变更内容较多，此处仅突出部分重点项。完整的更新和修复列表请参见 [GitHub pull request](https://github.com/gonka-ai/gonka/pull/539)。

**Host 需采取的行动**

为参与 PoC v2 迁移，Host 必须完成以下两个步骤：

- 确认您的 ML 节点已配置为提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 服务
- 将 ML 节点升级至支持 PoC v2 的版本：
    - ghcr.io/product-science/mlnode:3.0.12
    - ghcr.io/product-science/mlnode:3.0.12-blackwell

仅提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 服务但未升级 ML 节点不足以参与 PoC v2。未能满足这两个条件的节点，在网络切换至单模型配置后将不被视为有资格参与 PoC v2。ML 节点的升级必须在 PoC v2 通过治理完全启用之前完成。

**如何投票**

您可以使用 `inferenced` 命令获取提案详情并提交投票。请注意，任何活跃节点均可用于查询或提交投票。当前可用节点包括：

- [http://node1.gonka.ai:8000/](http://node1.gonka.ai:8000/)
- [http://node2.gonka.ai:8000/](http://node2.gonka.ai:8000/)
- [http://node3.gonka.ai:8000/](http://node3.gonka.ai:8000/)
- [https://node4.gonka.ai/](https://node4.gonka.ai/)

查看投票状态：
```
export NODE_URL=https://node4.gonka.ai/
./inferenced query gov votes 25 -o json --node $NODE_URL/chain-rpc/
```

投票（ `yes` , `no` , `abstain` , `no_with_veto` ）：
```
export NODE_URL=https://node4.gonka.ai/
./inferenced tx gov vote 25 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```

**截止时间**

- 投票截止时间为 2026 年 1 月 29 日 03:02:20 UTC。
- 提议在区块 2387000 进行升级。该区块预计时间为 2026 年 1 月 29 日 06:30:00 UTC。

如果您是 Host，请查看并投票。

**注意 1：** 请计划在升级窗口期间保持在线，以便在需要时能及时执行后续步骤或缓解指令。

**注意 2：** 升级期间，Cosmovisor 会在 `.inference/data directory` 中创建完整的状态备份。请确保有足够的磁盘空间。有关如何从 `.inference` 目录安全删除旧备份的说明，请参见[此处](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。如果 `application.db` 占用了大量磁盘空间，可以使用[此处](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)描述的清理技术。

**注意：** 升级后，Postgres 可配置为本地负载的存储。

## 2026年1月19日

**提案更新：稳定期延长已批准**

关于延长稳定期的最近一次治理投票已成功通过。稳定期现已正式延长，以便进行额外测试和网络升级。

**主机行动项**

随着延期确认，请利用这段时间为新的 PoC 要求准备您的设置。

- 模型更新：请将您的 ML 节点切换到 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 模型。
- 逐步 rollout：如果您运行多个 ML 节点，建议您在多个 epoch 中逐步完成这些更新。

**如何更新**

有关更新现有 ML 节点的说明，请参见此处：[https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)

## 2026年1月16日

**稳定期延长**

一项新的治理投票当前正在进行中。

该提案将当前稳定期延长约两周。延长期间旨在为即将到来的 PoC 变更及相关网络升级提供额外测试时间。有关新 PoC 开发进展的更多详情，请参见此处：[https://github.com/gonka-ai/gonka/blob/gm/poc-status/proposals/governance-artifacts/poc-update-status.md](https://github.com/gonka-ai/gonka/blob/gm/poc-status/proposals/governance-artifacts/poc-update-status.md)。

此次延期还为主机提供了时间为新 PoC 要求准备其设置，包括将 ML 节点切换到 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 模型。更新现有 ML 节点的说明请参见此处：[https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)。对于运行多个 ML 节点的主机，建议在多个 epoch 中逐步完成更新。

**投票范围**

若提案获得批准，网络将暂时继续在现有的 `allowlist` 下运行（包括未表现出非标准硬件行为的主机）。

开发者 `allowlist` 将以相同偏移量延长，并持续生效至区块 2459375。

未包含在 `allowlist` 中的主机在延长的稳定期内仍无法参与 PoC，该稳定期将在区块 2443558 结束。

**可复现性与方法论**

`allowlist` 是：

- 可在此处获取：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)
- 基于链上公开可观测数据，使用预定义的一组硬件配置模式推导得出。这些模式通过开源脚本进行评估，脚本位于：[https://github.com/product-science/filter](https://github.com/product-science/filter)

**执行特性**

- 如果提案获得批准，`allowlist` 将自动延长。
- 无需软件升级。
- 如有进一步调整需求，仍需通过治理决定。

**稳定窗口结束后**

`allowlist` 具有固定过期时间，不会超过延长的稳定期。一旦 `allowlist` 在区块 2443558 失效：

- 网络将恢复到稳定期之前生效的标准参与规则，或
- 任何替代配置必须通过单独的治理决策来定义。

**如何投票**

您可以使用 `inferenced` 命令获取提案详情并投票。

请注意，任何活跃节点均可用于查询或投票。当前可用节点包括：

- http://node1.gonka.ai:8000/ 
- http://node2.gonka.ai:8000/
- http://node3.gonka.ai:8000/ 
- https://node4.gonka.ai/ 

查看投票状态：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 22 -o json --node $NODE_URL/chain-rpc/
```

投票方式（ `yes` , `no` , `abstain` , `no_with_veto` ）：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced tx gov vote 22 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```

**投票后的下一步**

此流程完全通过治理进行，无需软件升级。

**时间表和截止日期**

投票截止时间：2026年1月18日 05:28:01 UTC。

`Allowlist` 失效时间：区块 2443558 时自动失效。

## 2026年1月10日

**临时参与者 `allowlist` 修正**

当前有一项新的治理投票正在进行中。该投票通过将一些地址添加到[白名单](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)来修正一个过滤边缘情况，这些地址此前因硬件名称为空且ML节点权重为零而被错误过滤。该提案还将少量开发者账户添加到允许的开发者列表中，并将 `allowlist` 的失效时间与参与者注册截止区块 2,222,222 保持一致。
所有参与逻辑保持不变。此提案仅解决现有过滤逻辑中的一个小问题。

**可复现性与方法论**

`allowlist` 基于链上公开数据，使用一组预定义的硬件配置模式推导得出。这些模式通过以下位置的开源脚本进行评估：[https://github.com/product-science/filter](https://github.com/product-science/filter)

`allowlist` 可在以下位置获取：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)

**如何投票**

您可以使用 `inferenced` 命令获取提案详情并提交投票。

请注意，任何活跃节点均可用于查询或提交投票。当前可用的节点包括：

- http://node1.gonka.ai:8000/
- http://node3.gonka.ai:8000/
- https://node4.gonka.ai/

查看投票状态：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 21 -o json --node $NODE_URL/chain-rpc/
```

投票方式（ `yes` , `no` , `abstain` , `no_with_veto` ）：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced tx gov vote 21 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```

**投票后的下一步**

此流程完全通过治理处理，无需软件升级。

**时间线和截止日期**

投票结束时间：2026年1月12日 06:04:14 UTC。

`Allowlist` 失效时间：区块 2,222,222 时自动失效。

## 2026年1月10日

**临时参与者 `allowlist` 已批准。将在第135轮激活**

针对稳定期临时参与者 `allowlist` 的链上治理投票已经结束。

该提案已获批准。本提案定义了一个临时的 `allowlist`，包含在最近多个轮次中行为保持一致的参与者。

**当前生效的关键变更**

1) 网络将运行一个由以下参与者组成的 `allowlist`，这些参与者在多个轮次中：

- 上报的硬件特征符合常见配置模式（过滤的非标准配置字符串列表见此处：[https://github.com/product-science/filter/blob/main/filter_strings.txt](https://github.com/product-science/filter/blob/main/filter_strings.txt))
- 表现出的PoC权重未超过同类硬件观察到权重的150%

2) 此前持续偏离这些模式的参与者将被排除在 `allowlist` 之外，直至区块2,222,222稳定期结束。

**执行特性**

- `allowlist` 将从下一轮（第135轮）开始生效
- 激活发生在第135轮的首次PoC期间
- 无需软件升级
- 此后，`allowlist` 将持续有效，直至并包括区块2,222,222

**可复现性与方法论**

- `allowlist` 完全基于公开可观察的链上数据生成
- 硬件描述符使用开源脚本对照预定义的一组配置模式进行评估：[https://github.com/product-science/filter](https://github.com/product-science/filter)
- 生成的 `allowlist` 发布于此：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)

**下一步**

主机无需采取任何操作。

## 2026年1月8日

**时机已到：稳定期临时参与者 `Allowlist`**

在成功采用修复PoC相关共识故障的补丁后，新一轮治理投票当前已激活。

随着正常出块恢复，网络将在进一步增长前进入短暂的稳定期。

本次投票定义了稳定窗口期间的参与者 `allowlist`（[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)），反映行为持续符合网络预期的参与者集合。

**投票范围**

若提案获批，网络将临时运行一个由此前未表现出非标准硬件行为的参与者组成的 `allowlist`。实际上，`allowlist` 对应的参与者需在多个轮次中满足以下条件：

- 上报的硬件特征已对照预定义的常见硬件配置模式集进行评估，用于识别偏差和不一致（确切的非标准配置字符串列表见此处：[https://github.com/product-science/filter/blob/main/filter_strings.txt](https://github.com/product-science/filter/blob/main/filter_strings.txt))，且
- 观察到的PoC权重低于使用同类硬件的其他参与者所展示权重的150%。
此前持续偏离这些模式的参与者将不包含在 `allowlist` 中，直至区块2222222稳定期结束。

**可复现性与方法论**

`allowlist` 基于公开可观察的链上数据，使用预定义的硬件配置模式集生成。这些模式通过开源脚本进行评估，脚本见此处：[https://github.com/product-science/filter](https://github.com/product-science/filter)

`allowlist` 可在此处获取：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)

**执行特性**

- 若提案获批，`allowlist` 将自动生效。
- 无需软件升级。
- 在成功投票后的下一个PoC期间，`allowlist`将激活，预计在区块：2089140。
- 从那时起，`allowlist`将持续生效，直至并包括区块​​2222222。
- 如需进一步调整，仍需通过治理决定。

**稳定窗口期后**

`allowlist`设定了固定到期时间，不会在稳定窗口期之后继续有效。一旦`allowlist`在区块2222222过期：

- 网络将恢复到稳定期之前有效的标准参与规则，或者
- 任何其他配置都必须通过单独的治理决策来定义。

**如何投票**

您可以使用`inferenced`命令获取提案详情并进行投票。
请注意，任何活跃节点均可用于查询或投票。当前可用的节点包括：

- http://node1.gonka.ai:8000/
- http://node2.gonka.ai:8000/
- https://node4.gonka.ai/

查看投票状态：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 20 -o json --node $NODE_URL/chain-rpc/
```

投票（`yes`，`no`，`abstain`，`no_with_veto`）：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced tx gov vote 20 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```
**投票后的下一步**

此过程完全通过治理处理，无需软件升级。

**时间线和截止日期**

- 投票截止时间：2026年1月10日 06:46:52 UTC。
- `Allowlist`激活时间：在区块2089140的下一次PoC执行后。
- `Allowlist`过期时间：在区块2222222自动过期。

请查看并在您是主机的情况下投票。

## 2026年1月8日

**网络更新——共识已恢复**

在部署补丁后，网络共识已稳定，并且目前运行在正常参数范围内。

## 2026年1月8日

**网络更新——补丁已准备就绪，可供部署**

用于解决PoC期间观察到的最近共识故障的补丁现已可用。

[指南](https://gonka.ai/FAQ/#upgrade-v027)

为恢复可靠的共识进展，需要**至少67%**的活跃网络算力安装该补丁。

在达到此阈值之前，共识进展可能仍不稳定。

**建议主机尽快应用补丁，并在升级后保持在线。
如有必要，将分享进一步的说明。**

## 2026年1月8日

**网络更新——后续跟进**

用于解决最近共识问题的补丁已准备就绪，详细说明将很快发布。
每个活跃主机的参与对于网络向前发展并恢复正常运行至关重要。请保持在线，并在说明发布后准备应用更新。

## 2026年1月8日

**网络更新——PoC期间共识失败**

在计算证明（PoC）期间，网络上观察到共识失败。
问题已被识别，目前正在准备补丁以解决根本原因。技术细节和进一步说明将很快发布。
建议主机保持在线并监控更新，因为在补丁发布后可能需要采取后续行动。

## 2026年1月8日

**v0.2.7升级提案：主网上线创世验证者增强功能**

链上治理投票已结束，v0.2.7升级提案：创世验证者增强已获得批准，并成功部署至主网。

**现已生效的关键变更：****创世验证者增强（临时）**

- 临时重新启用创世验证者增强机制——此前使用过的限时防御机制，现提议重新激活。
- 在网络增长期间提供共识保护。在之前运行期间：
    - 三位Guardian验证者共同持有约34%的共识投票权
    - 未向Guardian验证者发放额外奖励
    - 该配置有助于防止极端情况下的共识停滞
- 当同时满足以下两个条件时，创世验证者增强机制将自动停用：
    - 全网总算力达到15.000.000
    - 达到第3.000.000个区块

**协议稳定性修复（全网范围）**

本次升级正式纳入了此前通过手动API更新分发且已在网络中使用的重大修复。这些修复包括：

- 修正了失败推理请求的会计核算问题（包括以不支持格式处理但未标记为完成的请求）
- 提升处理失败推理时的弹性
- 为`PoCBatch`和`PoCValidation`交易引入批量处理机制。

通过将这些内容纳入协议，相关行为成为全网一致遵循的协议级规则。

**临时参与和执行限制**

- 主机层级注册：新主机注册将在第2.222.222个区块前暂停（约两周后）。此举旨在稳定网络并为后续增长做好准备。
- 开发者地址注册：在稳定期间暂停新开发者地址注册。立即生效一个预定义的`allowlist`开发者地址白名单。列入白名单的开发者地址在此期间可执行推理任务。所有适用于开发者地址的限制，包括开发者层级注册和推理执行，将持续有效至第2.294.222个区块（约19天后）。

**治理控制机制**

本次升级包含的预备性变更，将使未来可通过治理机制控制参与者准入和推理执行，而无需额外的软件升级。本次提案不启用任何此类治理激活的约束，需经后续治理投票决定。

**第117纪元奖励分发**

本提案涵盖与链暂停（第117纪元）相关的两次奖励分发：

- 在第117纪元期间活跃但未收到纪元奖励的节点，将补发该纪元错过的奖励。
- 所有在第117纪元期间活跃的节点将获得额外支付，金额等于第117纪元奖励的1.083倍，统一应用于所有符合条件的节点，包括已收到原始奖励的节点。

**关于持续时间和执行的说明**

本次升级重新激活或引入的所有保护措施均为临时性，无需手动治理干预即可移除。

**后续步骤：**

- 主机无需采取进一步行动。
- Cosmovisor在执行更新时会于`.inference`状态文件夹中创建完整备份。为安全执行更新，建议预留250+ GB的可用磁盘空间。[点击此处](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)了解如何从`.inference`目录安全删除旧备份。

**备注：**

- 创世验证者增强机制的完整技术细节详见：
[https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)
- 完整技术审查（GitHub PR）：[https://github.com/gonka-ai/gonka/pull/503](https://github.com/gonka-ai/gonka/pull/503)

## 2026年1月7日

**v0.2.7**版本的升级提案已通过链上治理批准。

**升级详情**

- 升级高度：第2.054.000个区块
- 预计时间：2026年1月8日 08:10:00 UTC

提前预下载二进制文件有助于避免在升级期间依赖 GitHub 的可用性。

```
# 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.7/bin \
              .inference/cosmovisor/upgrades/v0.2.7/bin && \

# 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.7/decentralized-api-amd64.zip" && \
echo "03555ba60431e72bd01fe1fb1812a211828331f5767ad78316fdd1bcca0e2d52 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.7/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

# 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.7/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.7/inferenced-amd64.zip" && \
echo "b7c9034a2a4e1b2fdd525bd45aa32540129c55176fd7a223a1e13a7e177b3246 inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.7/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced && \
echo "Inference Installed and Verified" && \

# 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced && \
echo "d07e97c946ba00194dfabeaf0098219031664dace999416658c57b760b470a74 .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api" | sudo sha256sum --check && \
echo "09c0e06f7971be87ab00fb08fc10e21ff86f9dff6fc80d82529991aa631cd0a9 .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced" | sudo sha256sum --check
```
当所有命令均无错误完成并显示确认消息时，可认为二进制文件已成功安装。
```
Inference Installed and Verified
--- Final Verification ---
-rwxr-xr-x 1 root root 224376384 Jan  1  2000 .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api
-rwxr-xr-x 1 root root 215172352 Jan  1  2000 .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced
.dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api: OK
.inference/cosmovisor/upgrades/v0.2.7/bin/inferenced: OK
```

**注意**

- 请在升级时间段内保持在线，以便在出现问题时遵循相关说明。
- Cosmovisor 在升级期间会对 `.inference/data` 目录创建完整备份。请确保有足够的磁盘空间。如果磁盘使用率较高，可以安全删除 `.inference` 中的旧备份。[了解更多](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)
- 较大的 `application.db` 文件可通过[这些方法](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)进行缩减。

**可选：跳过 Cosmovisor 备份**

Cosmovisor 支持通过为 `node` 容器设置环境变量 `UNSAFE_SKIP_BACKUP=true` 来跳过升级期间的自动状态备份。

这可能会减少磁盘使用量并缩短升级时间。但是，如果升级失败，则将没有备份可用于恢复之前的状态。

## 2026年1月7日

**致 Host 的重要提示**

可通过为 `node` 容器设置环境变量 `UNSAFE_SKIP_BACKUP=true` 来跳过 Cosmovisor 升级期间的自动备份。
此选项存在风险——如果升级失败，您将没有可用备份来恢复状态。

## 2026年1月6日

**v0.2.7 升级提案：创世验证者增强机制进入治理阶段**

一项与创世验证者增强机制相关的链上治理提案已发布，现开放投票。

近期网络增长引发了一些挑战。在过去几天中，网络经历了多次问题，其中部分似乎是由蓄意破坏或压力攻击所致。本提案旨在通过一系列临时措施，增强网络在高负载和不利条件下的弹性。

创世验证者增强机制最初在网络早期作为临时防御机制引入，并在前两个月运行期间启用。当前治理中的提案旨在根据当前网络状况，临时重新激活该现有机制，并启用一些额外的保护措施。

**主要变更****创世验证者增强机制（临时）**

- 临时重新启用创世验证者增强机制——一种此前使用过的、有时间限制的防御机制，现提议重新激活。
- 在网络增长期间提供共识保护。在之前运行期间：
    - 三个 Guardian 验证者共同持有约 34% 的共识投票权
    - 未向 Guardian 验证者发放额外奖励
    - 该配置有助于防止极端情况下的共识停滞
- 当同时满足以下两个条件时，创世验证者增强机制将自动停用：
    - 网络总权重达到 15.000.000
    - 区块高度达到 3.000.000

**协议稳定性修复（全网范围）**

本次升级将此前通过手动 API 更新分发且已在网络中使用的若干关键修复正式纳入协议。这些修复包括：

- 修正失败推理请求的错误记账问题（包括对不支持格式的请求被处理但未标记为完成的情况）
- 改进失败推理处理的弹性
- 为 `PoCBatch` 和 `PoCValidation` 交易引入批量处理机制

通过本次升级，这些行为将成为全网一致执行的协议级规则

**临时参与与执行限制**

- Host 级注册：新 Host 的注册将在区块 2.222.222 前暂停（约两周后）。该措施旨在稳定网络并为后续增长做准备。
- 开发者级注册：在稳定期间暂停新开发者地址注册。一个预定义的 `allowlist` 开发者地址白名单立即生效。在此期间，列入白名单的开发者地址可执行推理任务。所有适用于开发者地址的限制（包括开发者级注册和推理执行）将持续有效，直至区块 2.294.222（约19天后）

**治理控制机制**

本次升级包含的预备性变更将使未来能够通过治理控制参与者准入和推理执行，而无需额外的软件升级。本次提案不启用任何此类治理激活的约束，需经后续治理投票决定。

**第117轮奖励发放**

本提案涵盖与链暂停（第117轮）相关的两次奖励发放：

- 在第117轮活跃但未收到该轮奖励的节点将补发遗漏的奖励。
- 所有在第117轮活跃的节点将额外获得相当于第117轮奖励1.083倍的支付，该支付将统一适用于所有符合条件的节点，包括已收到原始奖励的节点。

**关于持续时间和执行的说明**

本次升级重新激活或引入的所有保护措施均为临时性，无需手动治理干预即可移除。

**如何投票**

您可以使用 `inferenced` 命令获取提案详情并进行投票。

查看投票状态：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 19 -o json --node $NODE_URL/chain-rpc/
```

投票（`yes`，`no`，`abstain`，`no_with_veto`）：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced tx gov vote 19 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```

**时间线和截止日期**

- 投票截止时间：2026年1月8日 04:23:14 UTC。
- 升级提案所在区块：2.054.000。
- 预计升级时间：2026年1月8日 08:10:00 UTC。

**主机注意****注意1**

请审阅提案并在您是主机的情况下进行投票。
请在升级窗口期间保持在线，以便在出现问题时遵循相关指令。

**注意2**

Cosmovisor 在执行更新时会在 `.inference/data` 状态文件夹中创建完整备份，请确保您的磁盘有足够的空间。阅读[此处](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)了解如何从 `.inference` 目录安全删除旧备份。
如果您的 `application.db` 占用大量空间，可以使用[此处](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)的技术进行清理。

**参考**

创世验证者增强的完整技术细节请参见：
[https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)

完整技术评审（GitHub PR）：[https://github.com/gonka-ai/gonka/pull/503](https://github.com/gonka-ai/gonka/pull/503)  

## 2026年1月5日
当前网络上观察到高于正常水平的推理遗漏率。
在许多情况下，这是由于一个漏洞导致不支持格式的推理请求未被标记为完成，即使请求本身已被处理。以下更新解决了此行为。

参考：[https://github.com/gonka-ai/gonka/pull/517](https://github.com/gonka-ai/gonka/pull/517) 

此 `API` 版本改进了失败推理处理的弹性，并减少了遗漏推理的记账问题。同时引入了 PoCBatch 和 PoCValidation 交易的批处理功能。

**升级时机**

当确认 PoC 未激活时，应用此更新是安全的。

验证当前状态：
```
curl "http://136.243.34.19:8000/v1/epochs/latest" | jq '.is_confirmation_poc_active'
```
在确认 PoC 之外，此值应返回 `false` 。

**安装**

下载并安装新二进制文件，然后重启 `API` 容器：
```
# Download Binary
sudo rm -rf decentralized-api.zip .dapi/cosmovisor/upgrades/v0.2.6-post12/ .dapi/data/upgrade-info.json
sudo mkdir -p  .dapi/cosmovisor/upgrades/v0.2.6-post12/bin/
wget -q -O  decentralized-api.zip 'https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.6-post12/decentralized-api-amd64.zip' && \
echo "f0d1172a90ca4653035e964abe4045f049d03d6060d6519742110e181b1b2257  decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j  decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.6-post12/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.6-post12/bin/decentralized-api && \
echo "API Installed and Verified"


# Link Binary
echo "--- Final Verification ---" && \
sudo rm -rf .dapi/cosmovisor/current
sudo ln -sf upgrades/v0.2.6-post12 .dapi/cosmovisor/current
echo "4672a39c3a3a0a2c21464c227a3f36e9ebf096ecc872bf9584ad3ea632752a3e .dapi/cosmovisor/current/bin/decentralized-api" | sudo sha256sum --check && \


# Restart 
source config.env && docker compose up api --no-deps --force-recreate -d
```
