# 公告

!!! note "关于此页面"

    本页面由社区成员维护和更新。

    若要发布公告（例如您发起的治理投票），请在 gonka-docs 仓库中提交拉取请求：[https://github.com/gonka-ai/gonka-docs](https://github.com/gonka-ai/gonka-docs)

    本页面不保证内容详尽。如需获取最新信息（包括治理投票的启动及其当前状态），请参考链上数据或查看可用的浏览器和仪表板。

## 2026年6月22日

**v0.2.13-devshard-v2 运行时升级提案已通过治理**

devshard v2 运行时已在链上获得批准，并添加到 `DevshardEscrowParams.approved_versions`。

该提案涵盖 devshard v2 版本发布：[https://github.com/gonka-ai/gonka/releases/tag/release/devshard/v2.0.0](https://github.com/gonka-ai/gonka/releases/tag/release/devshard/v2.0.0)

这是首个仅针对 devshard 的运行时升级。它独立于全链软件升级，无需升级链二进制文件。

随着提案获批，v2 现可与现有的 v1 devshard 运行时并行运行。新进程在 `/devshard/v2` 前缀下提供服务，而现有的 v1 流量继续在 `/devshard/v1` 和 `/v1/devshard` 上运行。

该版本将 `devshardd` 二进制文件作为 Gonka 发布产物发布。`versiond` 会自动下载该二进制文件，验证 sha256 哈希值，并在现有的 `versiond` 容器内启动额外的 `devshardd` 进程。

此类仅 devshard 的运行时升级无需重启节点容器或执行任何手动主机操作。

**主要变更**

1) 移除了种子揭示轮次，封存已完成的推理统计信息，并清理了负载，以确保长期运行的会话不会将所有已服务的推理保留在内存或状态中。
2) 通过 OpenTelemetry 和 Prometheus 添加了 devshard 内部追踪和指标。
3) 通过 Grafana、Jaeger、Prometheus、Loki、Promtail 和 cAdvisor 添加了 join-stack 可观测性。
4) 将每个推理的验证计数器从状态根移出至 SQLite/Postgres，并在推理清理后通过 devshard 统计端点暴露每槽总计数。
5) 在纪元变更时清理旧的纪元存储，将 SQLite/Postgres 模式设置移出热路径，并强制每个进程仅选择一个存储后端。

## 2026年6月15日

**v0.2.13-devshard-v2 运行时升级提案已进入治理流程。**

该提案涵盖 devshard v2 版本发布：[https://github.com/gonka-ai/gonka/releases/tag/release/devshard/v2.0.0](https://github.com/gonka-ai/gonka/releases/tag/release/devshard/v2.0.0) 
这是首个仅针对 devshard 的升级。它独立于全链软件升级。若获批准，v2 将与现有的 v1 devshard 运行时并行运行。
详见[升级设计文档](https://github.com/gonka-ai/gonka/blob/devshard-0.2.13-v2/devshard/docs/upgrade.md)和[版本化包](https://github.com/gonka-ai/gonka/tree/devshard-0.2.13-v2/versioned)。

**主要变更**

1. 移除种子揭示轮次，封存已完成的推理统计信息，并清理负载，以确保长期运行的会话不会将所有已服务的推理保留在内存或状态中

2. 通过 OpenTelemetry 和 Prometheus 添加 devshard 内部追踪和指标

3. 通过 Grafana、Jaeger、Prometheus、Loki、Promtail 和 cAdvisor 添加 join-stack 可观测性

4. 将每个推理的验证计数器从状态根移出至 SQLite/Postgres，并在推理清理后通过 devshard 统计端点暴露每槽总计数

5. 在纪元变更时清理旧的纪元存储，将 SQLite/Postgres 模式设置移出热路径，并为每个进程选择一个存储后端

**升级计划**

devshard 运行时通过链上参数提案升级，而非全链软件升级。

该提案会在 `DevshardEscrowParams.approved_versions` 中注册一个新条目。

该版本将 `devshardd` 二进制文件作为 Gonka 发布产物发布。若链上提案获批，`versiond` 将自动下载该二进制文件，验证 sha256 哈希值，并在现有的 `versiond` 容器内启动额外的 `devshardd` 进程。

新进程在 `/devshard/v2` 前缀下提供服务。现有的 v1 devshard 流量继续在 `/devshard/v1` 和 `/v1/devshard` 上运行。此类升级期间无需重启节点容器或执行任何手动主机操作。

**如何投票**

如果您无法直接访问持有投票权的密钥，或希望由其他密钥代为投票，请参考[指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何从冷密钥授予热密钥治理投票权限。
提案详情和投票可通过 `inferenced` 查看。任何活跃节点均可使用。可用节点包括：

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai

投出您的投票（`yes`, `no`, `abstain`, `no_with_veto`）：`--unordered` 和 `--timeout-duration` 标志需要 v0.2.13 或更高版本的 `inferenced`。
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
检查投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 76 -o json --node $NODE_URL/chain-rpc/
```
**截止日期**

投票结束时间：2026年6月17日 23:39:02 UTC

## 2026年6月6日

**[用于仅 devshard 升级的 PR](https://github.com/gonka-ai/gonka/pull/1289) 现已开放审查。**

这是首次仅针对 devshard 的升级，因此流程不同于标准链升级。devshard 升级会独立于主区块链更新 devshard 运行时。它们不需要通过 Cosmovisor 进行协调的全节点升级，不会影响主网行为，也不预期会导致推理服务中断。

如果通过治理流程获得批准，新的 devshard 版本将与现有的 v1 运行时并行运行。

请直接审查该 PR，并对发现的问题、疑问、改进建议、边界情况或潜在漏洞留下评论。

有意义的审查贡献，包括重要评论、发现的漏洞和安全问题，可能有资格在下一次升级周期中获得社区赏金。

这仅是 PR 审查的呼吁，并不启动正式投票。治理投票流程将在审查期结束后开始。

## 2026年5月28日

**MiniMax-M2.7 现已在 Gonka 网络上线**

v0.2.13 中宣布的引导阶段已完成。从链纪元 278 开始，MiniMaxAI/MiniMax-M2.7 已加入 Qwen3-235B 和 Kimi K2.6 成为活跃模型组，且在 MiniMax 组中获得的 PoC 权重现正以校准系数 0.3024 转换为共识权重。

针对 MiniMax 的按模型参与执行现已生效。已为 MiniMax 选择 DIRECT、DELEGATE 或 REFUSE 的主机无需执行其他操作——现有设置将继续生效。尚未做出选择的主机应尽快完成选择，以避免每纪元的惩罚（[https://gonka.ai/docs/host/quickstart/#optional-poc-delegation-and-refusal](https://gonka.ai/docs/host/quickstart/#optional-poc-delegation-and-refusal)）

## 2026年5月26日

**升级已执行：v0.2.13 现已在主网上线**

链上治理投票关于升级提案 v0.2.13（提案编号 54）已结束。
该提案已获批准，升级已于区块 `4267300` 在主网上成功执行。

## 2026年5月25日

**升级 v0.2.13：预下载二进制文件和 MiniMax-M2.7 权重**

v0.2.13 升级提案（提案编号 (https://github.com/gonka-ai/gonka/pull/1143)54）已通过链上治理，升级现已安排。

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

**v0.2.13 投票已结束——准备在高度 4267300 升级**

链上治理投票 [升级提案 v0.2.13](https://github.com/gonka-ai/gonka/pull/1143)（提案编号 `54`）已经结束。该提案已**通过**。

升级将在主网上**区块高度 4267300**（≈ **2026年5月26日，14:42 UTC** / **07:42 PDT**）自动执行。

**提醒事项**

1. 请确保您的桥接容器已更新并同步。以太坊主网桥接合约（`0x972a7a92d92796a98801a8818bcf91f1648f2f68`）、USDC/USDT 代币元数据以及 CW20 `wrapped_token` 的代码 ID `105` 将通过升级处理器本身注册，因此桥接功能将在升级高度时在主网上激活。验证说明：[https://gonka.ai/docs/network-updates/#may-7-2026](https://gonka.ai/docs/network-updates/#may-7-2026)。
2. 如果您计划提供服务 `MiniMaxAI/MiniMax-M2.7`，请立即预先下载约 230 GB 的 FP8 权重。在引导窗口期间，Hugging Face 的速率限制和带宽饱和可能导致错过首次资格检查。
3. 升级完成后，每个节点都需要为**每个**经治理批准的模型——`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、`moonshotai/Kimi-K2.6` 和 `MiniMaxAI/MiniMax-M2.7`——声明参与模式。仅运行其中一个或两个模型的节点仍需对其他模型选择 DELEGATE 或 REFUSE。MiniMax 的截止时间是**链纪元 `278`**。未采取行动的节点将从第 278 纪元起，对其全部权重每纪元处以 15% 的惩罚。
4. 请计划在升级窗口期间保持在线，以便及时应用任何后续步骤或缓解指令。请确保 `.inference/data` 有足够的可用空间用于 cosmovisor 状态备份；如果 `application.db` 较大，请考虑在升级前应用 [清理技术](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it) 来减少 cosmovisor 备份的大小。
5. v0.2.13 的校准将 Kimi K2.6 `WeightScaleFactor` 从 `1.26` 调整为 `0.78`，以反映 vLLM-0.20.1 发布后 Qwen-on-B200 基准的吞吐量。此调整**仅适用于您共识权重中的 Kimi 相关部分**；您的 Qwen 相关权重以及 Kimi 内部 PoC 分配保持不变。在 B200/B300 上，Kimi 仍是收益最高的选项；在 H100/H200 上，MiniMax-M2.7 成为与 Qwen 相当、高于 Kimi 的选项。

- 提案地址：[https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)
- 迁移逻辑：[`upgrades.go`](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.13/inference-chain/app/upgrades/v0_2_13/upgrades.go)

## 2026年5月20日

**v0.2.13 升级提案进入治理阶段**

[v0.2.13 提案](https://github.com/gonka-ai/gonka/pull/1143) 已重新上链并开放投票。这是此前发布但未通过提案的重新投票，现经多项更新后重新提交。

- 包含内容：Kimi（`0.78`）的权重重新校准、新增模型 `MiniMaxAI/MiniMax-M2.7`、验证阈值更新、devshard 存储重构，以及多项 PoC/奖励修复。
- 在主网上激活以太坊桥接（见下文专项说明）。
- 该提案将升级后的宽限期延长至 3000 个区块，以便在新快照逻辑稳定期间节点不会受到惩罚。
- 治理方面：将创世守护者投票权降至约 25%，并将全链法定人数设为 0.25。若守护者弃权，非守护者需在剩余 75% 中达到约 1/3 的参与率才能满足法定人数（详见 inference-chain 部分）。
- 所需准备：桥接容器检查、MiniMax 决策、仪表板更新、投票。
- 除非提案获批，否则链上不会发生任何变更。

PR 地址：[https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)

**主要变更****模型**

- 新增 `MiniMaxAI/MiniMax-M2.7` 作为治理批准的模型和 PoC 模型。
- 更新推理验证阈值：
    - Qwen 235B：`0.940`
    - Kimi K2.6：`0.900`
    - MiniMax-M2.7：`0.922`
- 在 vLLM 0.20.1 发布后，根据 Qwen-on-B200 基准重新校准 `WeightScaleFactor` 数值：
    - Qwen 235B：`0.359`（保持不变）
    - Kimi K2.6：`0.78`（从 1.26 下调，相同 PoC 权重下 Kimi 每纪元共识权重减少约 38%）
    - MiniMax-M2.7：`0.3024`

参考数据：[https://docs.google.com/spreadsheets/d/1dHHlbhW1_hVgd7Q6MtmcVSOpmnl7NnynoTzPHJ1oU-g/edit?gid=0#gid=0](https://docs.google.com/spreadsheets/d/1dHHlbhW1_hVgd7Q6MtmcVSOpmnl7NnynoTzPHJ1oU-g/edit?gid=0#gid=0)

**inference-chain**

- 将 devshard nonce 限制从 `20_000` 提高到 `1_000_000`。
- 将每纪元最大 devshard 数量从 `100` 提高到 `500_000`。
- 修复新模型引导期间确认 PoC 奖励的记账问题。
- 在升级纪元的剩余时间内禁用确认 PoC，以便新快照逻辑从下一纪元干净启动。
- 当参与者重新激活时重置 `ConsecutiveInvalidInferences`。
- 为在 v0.2.12 之前加入的 DAPI 填补缺失的 `MsgRespondDealerComplaints` authz 授权。
- 修复了一个布线问题，该问题可能导致桥接和流动性池合约调用中出现间歇性权限错误。
- 将创世守护者调整后的投票权减少至约 25%，并将全链治理法定人数设置为 `0.25`。在守护者不投票的情况下，这使得剩余 75% 投票权中实际有效法定人数为 1/3（`0.25 / 0.75 = 0.334`）。
- 将 4 个早期主机和经纪商添加到 `allowed_creator_addresses`。

**以太坊桥主网激活**

- 通过升级处理器激活以太坊主网桥接设置。
- 注册以太坊桥合约地址 `0x972a7a92d92796a98801a8818bcf91f1648f2f68`、USDC 和 USDT 代币元数据、桥交易批准以及 CW20 `wrapped_token` 代码 ID `105`。
- 激活后，桥接将启用 Gonka 主网与以太坊之间的跨链转账（包括在以太坊上封装 GNK 以及桥接 USDC/USDT）。封装/解封装脚本和操作员工作流程将另行记录。

**decentralized-api 和 devshard**

- 默认在端口 `9400` 上启用 `NodeManagerGrpcPort`。
- 为 devshard 状态添加 Postgres 支持。
- 为 SQLite 和 Postgres devshard 数据库添加清理功能。
- 添加状态快照以实现更快的 devshard 启动和恢复。
- 修复 OpenAI 兼容的 API 响应解析。
- 修复长时间启动行为以及 devshard 失效流程的边界情况。

**升级计划**

如果提案获得批准，将通过链上升级提案更新二进制版本。有关升级流程的更多信息，请参阅 [/docs/upgrades.md。](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.13/docs/upgrades.md)

**升级前所需的准备工作**

如果提案获得批准，建议进行以下准备。

**在第 278 轮次前做出 `MiniMaxAI/MiniMax-M2.7` 参与选择（之后开始处罚）**

对于每个经治理批准的模型，多模型 PoC 要求每个主机明确选择参与方式（DIRECT / DELEGATE / REFUSE）。在模型的 `PenaltyStartEpoch` 之后不采取任何行动将导致处罚。在此阶段，您应提前决定首选选项，以便在提案通过且主网成功应用升级后能够迅速行动。

**桥接容器更新/验证**

要求所有主机验证其桥接容器已部署、运行最新版本并正确同步。部分主机可能已部署桥接容器。在此情况下，请先检查是否正在运行当前版本，再采取进一步操作。
请遵循说明：[https://gonka.ai/docs/network-updates/#may-7-2026](https://gonka.ai/docs/network-updates/#may-7-2026)

**仪表板/浏览器更新（升级前后均可）**

要求主机更新仪表板/浏览器。请从 `gonka/deploy/join` 目录运行以下命令。如果您尚未在本地克隆 `gonka` 仓库，请先参阅加入网络指南。此次仪表板更新仅为容器拉取，可在投票结束前后安全运行，不受结果影响。
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

**如何投票**

如果您无法直接访问持有投票权的密钥，或希望由其他密钥代表您投票，请参考[指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何从冷密钥向温密钥授予治理投票权限。
提案详情和投票可通过`inferenced`进行。任何活跃节点均可使用。可用节点包括：

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai

进行投票（`yes`, `no`, `abstain`, `no_with_veto`）：`--unordered` 和 `--timeout-duration` 选项需要使用 v0.2.12 或更高版本的 `inferenced`。

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
检查投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 54 -o json --node $NODE_URL/chain-rpc/
```

**截止时间**

- 投票结束时间：2026年5月22日 22:12:25 UTC
- 提议的升级高度：4267300
- 预计升级时间：2026年5月26日 14:42:02 UTC
- 运营商时间线：投票于5月22日22:12 UTC结束 → 升级高度 ~5月26日14:42 UTC → 升级纪元的剩余部分将跳过确认PoC（≤ 10000个区块的宽限期） → 在start_poc − 500区块时进行MiniMax引导快照（约提前43分钟） → 下一个纪元边界处开始第一个MiniMax PoC阶段 → 在链纪元278开始执行MiniMax惩罚机制

**注意**

- 请计划在升级窗口期间保持在线，以便及时执行任何后续步骤或缓解指令。
- 升级期间，Cosmovisor会在`.inference/data`目录中创建完整的状态备份；请确保有足够的磁盘空间（主网上的`application.db`的Cosmovisor备份通常为几十GB，因此请提前确认）。有关从`.inference`目录安全删除旧备份的指南，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)
- 如果`application.db`占用了大量磁盘空间，可以应用cosmovisor备份[指南](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)中描述的清理技术。
- 该提案将有意在升级高度至升级纪元结束期间（10000个区块宽限期）跳过确认PoC。如果提案通过，此跳过行为是预期的，并非故障；新的快照逻辑将从下一个纪元开始。
- 如果提案通过，升级后devshard存储可选择由共享的Postgres实例支持（与payload存储使用相同的环境变量）。本地SQLite仍为默认选项，并会自动清理（保留最近3个纪元）。
- 如果提案失败（未达到法定人数，或`no_with_veto`超过⅓），链上不会发生任何变化，升级 simply 不会发生。运营商可能会看到`PROPOSAL_FAILED`状态；这是预期的，无需采取行动。

## 2026年5月18日

代理容器可能会全局限制到devshard的并行连接数，而不是按客户端限制

修复的PR：[https://github.com/gonka-ai/gonka/pull/1183](https://github.com/gonka-ai/gonka/pull/1183)

要应用此修复，请执行以下操作：

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

在PoC/确认PoC阶段之外更新容器更安全。要检查是否存在确认PoC：
```
curl "https://node3.gonka.ai/v1/epochs/latest" | jq '.is_confirmation_poc_active'
```

## 2026年5月17日

**纪元 #267：PoC 验证已恢复**

PoC 验证在纪元 #267 中成功完成，受影响的主机已能够重新加入活跃集合。

纪元 #266 中的问题是由一次影响运行 Kimi 模型主机的攻击引起的。网络继续运行，但该攻击结合若干相关条件，导致许多参与者无法进入纪元 #266。

在应用额外保护措施期间，推理功能可能会暂时不可用。访问将逐步恢复，首先通过多个社区代理和经纪端点提供。

**发生了什么**

在纪元 #266 中，网络的活跃权重显著下降。

该问题已被追溯到具有非标准语义的推理请求。此攻击向量影响了运行 Kimi 模型的主机，并扰乱了其中许多主机的 PoC 参与。

在纪元 #267 中，主机已能够返回，PoC 验证成功完成。

**推理可用性**

网络不应再接受使用受影响的非标准语义的请求。

在相关保护措施部署期间，推理功能可能会暂时不可用。访问预计将逐步恢复，首先通过多个社区代理和经纪端点提供。

**纪元 #267 中 Kimi 的权重**

Kimi 在纪元 #267 中的活跃权重较低，原因是现有协议规则：单个模型的总权重不得超过上一纪元所有模型总权重的75%。

由于纪元 #266 中的总活跃权重显著降低，此规则也限制了 Kimi 在纪元 #267 中的权重。

随着未来纪元中正常 PoC 参与的持续，权重可能需要数天时间才能稳定下来。

**主机所需操作**

1. 尽可能保持您的 API 节点在线且可访问。这有助于维护对主机参与情况的可见性，并支持任何后续审查。
2. 监控接下来几个纪元的 PoC 参与情况。确认您的节点按预期进入 PoC，且活跃权重正确反映。
3. 仅使用受支持的推理请求格式。不要发送或路由具有非标准请求语义的推理流量。
4. 预期会出现暂时的推理中断。访问可能不会立即在所有地方恢复，预计将通过社区代理和经纪端点逐步恢复。
5. 在社区频道或本帖中分享相关日志或观察结果。如果您的主机在纪元 #266 中受到影响或在后续纪元中表现异常，这一点尤为重要。

## 2026年5月16日

**纪元 #266：PoC 权重下降调查**

在当前纪元（#266）期间，网络的活跃权重显著下降。
似乎 PoC 投票未能为本纪元收集到所需的投票数。确切原因尚未确认，社区正在积极调查情况。

**对于受影响的参与者**

如果您的节点未进入本纪元，请尽可能保持您的 API 节点在线且可访问。
这可能有助于补偿委员会收集 PoC 参与证据，并更准确地核算受影响的贡献。

**调查进行中**

社区成员目前正在审查纪元 #266 期间发生的情况。一旦根本原因更加明确，将分享更新。
如果您有相关的观察、日志、假设或其他有助于调查的技术背景，请在此处分享。

## 2026年5月15日

**v0.2.13 升级提案进入治理流程**

[v0.2.13 提案](https://github.com/gonka-ai/gonka/pull/1143) 现已在链上并开放投票。

- 包含内容：Kimi 的重新校准权重（`0.78`）、新增模型 `MiniMaxAI/MiniMax-M2.7`、验证阈值更新、devshard 存储重构，以及多个 PoC/奖励修复、以太坊桥主网上线。
- 提案增加了升级后的宽限期，确保在升级发生后3000个区块内不会惩罚主机。
- 所需准备：桥接容器检查、MiniMax 决策、仪表板更新、参与投票。
- 在提案获得批准之前，链上不会有任何变更。

该 PR：[https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)

**主要变更****模型**

- 将 `MiniMaxAI/MiniMax-M2.7` 添加为经治理批准的模型和 PoC 模型。
- 在 vLLM 0.20.1 版本发布后，根据 Qwen-on-B200 参考值重新校准 `WeightScaleFactor`：
    - Qwen 235B：`0.359`
    - Kimi K2.6：`0.78`
    - MiniMax-M2.7：`0.3024`
    - 参考数据：[https://docs.google.com/spreadsheets/d/1dHHlbhW1_hVgd7Q6MtmcVSOpmnl7NnynoTzPHJ1oU-g/edit?gid=0#gid=0](https://docs.google.com/spreadsheets/d/1dHHlbhW1_hVgd7Q6MtmcVSOpmnl7NnynoTzPHJ1oU-g/edit?gid=0#gid=0)
- 更新推理验证阈值

**inference-chain**

- 将 devshard nonce 上限从 `20_000` 提高到 `1_000_000`。
- 将每轮 epoch 的最大 devshards 数量从 `100` 提高到 `500_000`。
- 修复新模型引导期间确认 PoC 奖励计算问题。
- 在升级 epoch 剩余时间内禁用确认 PoC，以便新快照逻辑从下一轮 epoch 干净开始。
- 当参与者重新激活时重置 `ConsecutiveInvalidInferences`。
- 为在 v0.2.12 之前加入的 DAPIs 补充缺失的 `MsgRespondDealerComplaints` authz 授权。
- 修复桥接和流动性池合约权限检查中的 Wasm keeper 访问问题。
- 将创世守护者调整后的投票权降低至约 25%，并将全链治理法定人数设为 `0.25`。在守护者不投票的情况下，这使得剩余 75% 投票权中实际法定人数为 1/3（`0.25 / 0.75 = 0.334`）。

**以太坊桥主网激活**

- 通过升级处理器激活以太坊主网桥接设置。
- 注册以太坊桥合约地址 `0x972a7a92d92796a98801a8818bcf91f1648f2f68`、USDC 和 USDT 代币元数据、桥交易批准以及 CW20 `wrapped_token` 代码 ID `105`。

**decentralized-api & devshard**

- 默认在端口 `9400` 上启用 `NodeManagerGrpcPort`。
- 为 devshard 状态添加 Postgres 支持。
- 为 SQLite 和 Postgres devshard 数据库添加修剪功能。
- 添加状态快照以实现更快的 devshard 启动和恢复。
- 修复 OpenAI 兼容 API 响应解析问题。
- 修复长时间启动行为及 devshard 失效流程中的边缘情况。

**升级计划**

如果提案获得批准，将通过链上升级提案更新二进制版本。有关升级流程的更多信息，请参阅 [/docs/upgrades.md。](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.13/docs/upgrades.md)

**升级前所需准备操作**

如果提案获得批准，建议进行以下准备工作。

**在第 278 轮 epoch 前完成 `MiniMaxAI/MiniMax-M2.7` 参与选择**

对于每个经治理批准的模型，多模型 PoC 要求每个主机明确选择参与方式（DIRECT / DELEGATE / REFUSE）。在模型的 `PenaltyStartEpoch` 之后不采取行动将导致惩罚。在此阶段，您应提前决定首选选项，以便在提案通过且主网上成功应用升级后能够迅速行动。

**桥接容器更新 / 验证**

要求所有主机验证其桥接容器已部署、正在运行最新版本并正确同步。部分主机可能已部署桥接容器。在此情况下，请先检查是否运行当前版本，再采取进一步操作。
请遵循说明：[https://gonka.ai/docs/network-updates/#may-7-2026](https://gonka.ai/docs/network-updates/#may-7-2026)

**仪表板 / 浏览器更新（升级前后均可）**

要求主机更新仪表板/浏览器。请在 `gonka/deploy/join` 目录下运行以下命令：
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

**如何投票**

如果您无法直接访问持有投票权的密钥，或希望由其他密钥代表您投票，请参考[指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何将冷密钥的治理投票权限授予温密钥。

提案详情和投票可通过`inferenced`进行。任何活动节点均可使用。可用节点包括：

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai

进行投票（`yes`, `no`, `abstain`, `no_with_veto`）：
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
检查投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 52 -o json --node $NODE_URL/chain-rpc/
```

**截止时间**

- 投票结束时间：2026年5月17日 07:58:37 UTC
- 提议的升级高度：4133422
- 预计升级时间：2026年5月18日 13:03:17 UTC

**注意**

- 请计划在升级窗口期间保持在线，以便及时执行任何后续步骤或缓解指令。
- 升级期间，Cosmovisor 会在 `.inference/data` 目录中创建完整的状态备份；请确保有足够的磁盘空间。有关安全删除 `.inference` 目录中旧备份的指导，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)
- 如果 `application.db` 占用了大量磁盘空间，可以应用 cosmovisor 备份[指南](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)中描述的清理技术。
- 该提案将从升级高度到升级周期结束（3000个区块宽限期）期间有意跳过确认PoC。如果提案通过，此跳过属于预期行为，并非故障；新的快照逻辑将从下一个周期开始。
- 如果提案通过，升级后devshard存储可选择由共享的Postgres实例支持（与payload存储使用相同的环境变量）。本地SQLite仍为默认选项，并将自动清理（保留最近3个周期）。

## 2026年5月7日

**需要更新/验证桥接容器**

作为即将进行的v0.2.13升级准备工作的一部分（可能包括以太坊侧合约激活），要求所有主机验证其桥接容器是否已部署、运行最新版本并正确同步。

部分主机可能已部署桥接容器。在此情况下，请先检查是否正在运行当前版本，再采取进一步操作。

最新桥接镜像：
```
ghcr.io/product-science/bridge:0.2.5-post5@sha256:8d2f217115c65b27fcb6fe1497471c30891534f18685bd3007d168aa7f1a9371
```
检查您的桥接程序是否已在运行正确的版本：
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
您的桥接容器正在运行预期的镜像。

请同时验证桥接是否已同步：
```
docker logs bridge --tail 10000 | grep "Skeleton sync bounds" | tail -1
```
输出应指向一个最近完成最终确定的以太坊区块，且不应显著落后。

如果该命令返回警告，请从 `gonka/deploy/join` 目录部署或更新桥接容器：
```
git checkout release/v0.2.5-post5
docker compose down bridge && sudo rm -rf .inference-eth
source config.env && docker compose pull bridge
source config.env && docker compose up bridge -d --force-recreate --no-deps
```
部署后，再次验证版本：
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
在更新或重启桥接器后，请按照上述说明验证其是否已同步。

## 2026年5月6日

**v0.2.13版本升级的PR审查**

[该拉取请求](https://github.com/gonka-ai/gonka/pull/1143)用于下一次链上软件升级v0.2.13，现开放审查。

请直接审查PR代码，并对发现的问题、疑问、改进建议、边界情况或漏洞留下评论。

有意义的审查贡献，包括重要评论、漏洞发现和安全问题，可能有资格在下一轮升级周期中获得社区赏金。

本次仅为对拉取请求的审查呼吁，并不启动正式投票。治理投票流程将在审查期结束后开始，很可能在明天。

**主要变更****inference-chain**

- 确认PoC使用了不同的模型集来计算测量权重、保留权重和奖励重缩放。在新模型引导期间，这可能会惩罚同时服务了合规模型和尚未合规模型的诚实矿工。修复方案是存储一个确认模型和权重缩放因子的单个纪元快照，并在所有确认和奖励权重计算中使用该快照。
- 当参与者再次变为ACTIVE状态时，`ConsecutiveInvalidInferences`未被重置。一次新的错误推理可能立即再次使其失效。现在在重新激活和即将晋升时会重置该计数器。
- 在v0.2.12之前加入的DAPI未在其冷启动到热授权中包含`MsgRespondDealerComplaints`权限。升级将回填该权限，以便它们能够响应经销商投诉。
- Devshard结算使用了硬编码的`20_000`随机数限制。该限制现在为`DevshardEscrowParams.MaxNonce`，v0.2.13升级将其设置为`1_000_000`。升级还将`MaxEscrowsPerEpoch`提升至`500_000`。
- 升级会为当前纪元安装一个带有扩展`UpgradeProtectionWindow`（3000个区块）的宽限期条目。从升级高度到升级纪元结束期间，跳过确认PoC触发器，因此新的快照逻辑仅从下一个纪元开始运行。复用了v0.2.10的宽限期原语。
- Wasm keeper访问在应用布线后解析，因此桥接器和流动性池操作的合约权限检查可以正常工作。

**decentralized-api**

- 某些兼容OpenAI的上游返回数值型`stop_reason`值。`Choice.StopReason`现在接受任何JSON类型，因此这些响应不再因反序列化失败。
- 内部devshard存储迁移不再阻塞dapi启动。devshard路由在迁移和恢复完成前保持不可用。

**devshard**

- 由于旧的托管数据保留在一个SQLite存储中，devshard存储可能无限增长。现在存储按纪元划分，并在后台自动清理旧纪元，仅保留最新的3个纪元。
- devshard需要一个共享存储选项以支持更大规模的部署。现在它可以使用Postgres作为主存储，SQLite则作为本地备用。
- Postgres数据按`epoch_id`对会话、差异和签名进行分区，因此清理可以干净地删除旧纪元数据。
- 状态快照减少了长时间运行会话的恢复工作量。
- 有效载荷查找固定到托管纪元，并对纪元边界和旧版纪元0请求提供回退支持。
- 当前纪元的分片统计信息暴露了随机数、版本、组和每主机计数器。

**bridge**

- 桥接工具处理Sepolia标志，并将Gonka BLS密钥/签名转换为以太坊合约期望的EIP-2537格式。
- 添加了GNK和封装代币桥接操作的脚本。

审查人员可在此处找到完整的升级提案、迁移详情、测试摘要和建议流程：

- [https://github.com/gonka-ai/gonka/blob/347d947596aba754e453e58d5f82ae6054233a9a/proposals/governance-artifacts/update-v0.2.13/README.md ](https://github.com/gonka-ai/gonka/blob/347d947596aba754e453e58d5f82ae6054233a9a/proposals/governance-artifacts/update-v0.2.13/README.md )

- [https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)

## 2026年5月6日

api容器版本v0.2.11、v0.2.12和v0.2.12-api-post2中存在潜在问题。容器重启后，9100、9200和9400端口上的服务器可能启动延迟较长。这延迟了api激活，一些矿工因此跳过了确认PoC

修复通过并行加载devshard并从快照恢复现有devshard会话来消除该阻塞问题。

[https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)

请更新api容器的二进制文件。每个PoC开始前都有一个500区块的无CPoC（`confirmation_poc_safety_window`）窗口，因此这可能是最安全的部署版本。

更新前，请确保没有CPoC或PoC正在运行。

部署方式（为降低风险，请逐台机器进行）：
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
部署后，请仔细检查端口为9100和9200的服务器是否正在运行：
```
curl http://localhost:9200/admin/v1/nodes # may not be bound to localhost
```

```
curl http://localhost:9100/versions # may not be bound to localhost
```

## 2026年5月6日

在上一个周期中，发现了解析Kimi-K2.6某些响应时存在一个次要bug。

修复：[https://github.com/gonka-ai/gonka/pull/1143/changes#diff-4c44fd18f746bca1c63d9bcbb9a73f06bc0172bfb8a33152854920d4dffff0e8](https://github.com/gonka-ai/gonka/pull/1143/changes#diff-4c44fd18f746bca1c63d9bcbb9a73f06bc0172bfb8a33152854920d4dffff0e8)

我们建议替换api容器的二进制文件。除了修复之外，新版本还为devshard数据库启用了修剪功能，并为devshard状态添加了Postgres支持。

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
此外，如果你有托管 Kimi-K2.6 的 MLNode，请在部署参数中添加部署参数 "--enable-auto-tool-choice"。为此，你可以重复该命令（以 B200 为例）：
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

然后使用 docker restart join-mlnode-308-1 重启 MLNode 容器。

当 PoC / 确认 PoC 无法正常进行时，应采取这些措施。

## 2026年5月5日 

在 Kimi-K2.6 引导过程中观察到，30% 的最低直接参与阈值在实践中难以达到。为避免 Kimi-K2.6 在未来某个 epoch 中失去资格，并进一步简化模型的接入流程，提议将该阈值降低至 10%。

安全模型保持不变：PoC 验证本身未改变，仍然需要绝大多数验证算力来接受结果。

该提案被加速处理，以便在下一次 PoC 之前生效。投票将持续 12 小时。

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

检查投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 48 -o json --node $NODE_URL/chain-rpc/
```

**投票结束时间**：2026-05-05 19:00:54 UTC

## 2026年5月4日

**Kimi K2.6 现已在 Gonka 网络上线**

`moonshotai/Kimi-K2.6` 已通过引导阶段，并加入 Gonka 网络的 PoC 参与。

该过程由网络中的多个节点协调完成：基础设施已准备就绪，意图已提交，委托和拒绝设置已完成，部署也已测试。

对于多模型 PoC 而言，这意味着 Kimi 现在作为一个活跃的模型组，拥有独立的参与和奖励追踪机制。

运行 Kimi 的节点应像往常一样继续监控其 MLNode 和 PoC 参与情况。    

## 2026年5月4日

**需要节点采取行动：部署 `Kimi K2.6`**

今日 `moonshotai/Kimi-K2.6` 的预评估检查已通过。

已提交 PoCIntent 的节点现在应在 PoC 在区块 `3874496` 开始之前，将至少一个 MLNode 从 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 切换到 `moonshotai/Kimi-K2.6`。

预评估与 PoC 开始之间有 500 个区块的时间窗口。在此期间没有 CPoC 任务，因此已声明意图的节点可以安全地将其模型节点切换至 `Kimi K2.6`。

请遵循指南并完成所需的部署步骤：[https://gonka.ai/docs/host/kimi-bootstrap/](https://gonka.ai/docs/host/kimi-bootstrap/)

## 2026年5月4日

传输代理 `node1`、`node2` 和 `node3` 已被禁用。所有主网推理请求现在都通过 `node4` 路由，该代理采用基于 `devshard` 的新计费方式。

这标志着网络的一个里程碑：`devshard` 已上线并具备生产就绪能力。`node4` 是推荐的公共网关。

**需要采取行动**：请将您的端点更新为 `node4`。

## 2026年5月2日

今日的预资格验证未通过，对于 `PoCIntent` 比例低于30%的节点，权重极低。请保持您的 MLNode 使用 `Qwen235B`，并在明天提交下一周期的参与意图。

## 2026年4月30日

**升级已执行：v0.2.12 现已在主网上线**

关于升级提案 v0.2.12 的链上治理投票已结束。该提案已获得批准，升级已在主网上成功执行。

**当前生效的关键变更**

- **多模型 PoC（最大变更）** ([#1039](https://github.com/gonka-ai/gonka/pull/1039))。将计算证明（Proof of Compute）从单一固定模型转变为按模型分组的 PoC。每个经治理批准的模型生成其自身的局部 PoC 权重，然后通过特定模型系数聚合为总共识权重。每个节点必须参与每个模型组（可直接参与或通过委托 PoC 投票权重）。
- **引入 `moonshotai/Kimi-K2.6` 作为第二个模型**：该模型组将在升级后两个周期激活。该模型的系数为 Qwen235B 系数的 3.51 倍，基于相同硬件（8xH200，8xB200）上模型的计算复杂度。
- **Devshard 独立运行时** ([#1045](https://github.com/gonka-ai/gonka/pull/1045))。将 devshard 发布与 DAPI / 主网发布周期解耦。
- **Certik 审计修复** ([#1020](https://github.com/gonka-ai/gonka/pull/1020), [#1021](https://github.com/gonka-ai/gonka/pull/1021), [#1022](https://github.com/gonka-ai/gonka/pull/1022), [#987](https://github.com/gonka-ai/gonka/pull/987), [#949](https://github.com/gonka-ai/gonka/pull/949), [#988](https://github.com/gonka-ai/gonka/pull/988), [#825](https://github.com/gonka-ai/gonka/pull/825), [#1011](https://github.com/gonka-ai/gonka/pull/1011), [#1029](https://github.com/gonka-ai/gonka/pull/1029), [#789](https://github.com/gonka-ai/gonka/pull/789))。已解决审计发现的问题。
- **协议加固**。保留节点（`POC_SLOT=true`）将在单次 PoC / CPoC 时间内随机抽样。其他更新包括将 `mlnode` 版本传播到链上 `HardwareNode`，修复 DKG 经销商共识，对齐旧版验证者惩罚机制与所需抵押品语义，确保 devshard 托管资金的原子性，并在 `inference_finished` 事件解析中增加零时间戳容错。

**对节点的指导**

- 部署、委托或明确拒绝新的经治理批准的模型（包含的模型将在升级后两个周期激活）。请参考[指南](https://gonka.ai/docs/host/multi_model_poc/)。

- 节点被要求更新仪表板/浏览器。请在 `gonka/deploy/join` 目录下运行以下命令：

```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

- 二进制版本：通过链上升级流程进行更新。

- 迁移：测试和迁移详情记录在 [v0.2.12 文档中。](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/docs/upgrades.md)

有关这些变更的更多详细信息可在治理文件中找到： [https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.12/proposals/](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.12/proposals/) 

## 2026年4月29日

**v0.2.12 升级：预先下载二进制文件**

v0.2.12 升级提案的链上治理流程即将结束。

- 投票截止时间：2026年4月30日，00:12 UTC
- 升级高度：3834200
- 预计升级时间：2026年4月30日，早上6:00 UTC

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

**升级v0.2.12：升级前模型清理**

v0.2.12升级提案现已完成链上投票期的一半。

- 投票截止时间：2026年4月30日 00:12 UTC
- 升级高度：3834200
- 预计升级时间：2026年4月30日 上午6:00 UTC

建议节点运营者在[GitHub](https://github.com/gonka-ai/gonka/pull/948)上查看提案并参与投票。

**升级前需采取的行动**

随着网络接近升级窗口，若提案通过，节点运营者应提前准备其节点。

此清理过程**必须在升级发生前完成**。如果在升级时，您的节点配置中包含不受支持的模型，**该节点将被拒绝并下线**。

版本0.2.12将移除所有不在升级后批准列表中的治理模型。在主网上，仅先前强制执行的模型和Kimi将被保留。
每个DAPI在其本地持久化存储MLNode配置。启动时，它会将每个已配置的模型与链上治理列表进行验证。如果配置中包含至少一个不受支持的模型，整个节点将被拒绝，导致主机下线。

版本0.2.11通过将运行时视图裁剪为强制执行的模型来掩盖此问题，因此即使持久化配置中仍包含额外模型，`/admin/v1/nodes`也显示为干净状态。版本0.2.12将停止此裁剪行为，意味着持久化配置将被直接加载。

为解决此问题，以下脚本会查找在`/admin/v1/config`中包含额外模型的每个节点，并向`/admin/v1/nodes/<id>`发送一个带有清理后配置的`PUT`请求。这些更改将在60秒内被持久化。保留的模型的参数、硬件和端口将完全保留。未列出强制执行模型的节点将被跳过，需手动修复。

将以下脚本粘贴到主机的shell中。默认情况下，它将应用更改。如需预览更改而不实际应用，请将`APPLY=dry`设置为（或任何非`--apply`的值）。

仓库中的脚本：

- [Bash](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/proposals/governance-artifacts/update-v0.2.12/cleanup/cleanup_models.sh)
- [Python](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/proposals/governance-artifacts/update-v0.2.12/cleanup/cleanup_models.py)

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


运行脚本后等待60秒，以确保更改已持久化，然后再触发升级。然后，验证配置：

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

**v0.2.12 升级提案进入治理阶段**

[该升级提案](https://github.com/gonka-ai/gonka/pull/948) 针对下一个链上软件版本 v0.2.12，现已发布到链上并开放投票。

**主要变更**

- **多模型 PoC（最大变更）** ([#1039](https://github.com/gonka-ai/gonka/pull/1039))。将计算量证明（PoC）从单一固定模型转变为按模型划分的 PoC 组。每个经治理批准的模型生成自身的局部 PoC 权重，再通过特定模型系数聚合为总共识权重。每个节点必须参与每个模型组（可直接参与或通过委托 PoC 投票权重）
- **引入 `moonshotai/Kimi-K2.6` 作为第二个模型**：该模型组将在升级后两个纪元激活。该模型的系数为 Qwen235B 的 3.51 倍，基于相同硬件（8xH200，8xB200）上模型的计算复杂度。
- **Devshard 独立运行时** ([#1045](https://github.com/gonka-ai/gonka/pull/1045))。将 devshard 的发布与 DAPI / 主网发布周期解耦。
- **Certik 审计修复** ([#1020](https://github.com/gonka-ai/gonka/pull/1020), [#1021](https://github.com/gonka-ai/gonka/pull/1021), [#1022](https://github.com/gonka-ai/gonka/pull/1022), [#987](https://github.com/gonka-ai/gonka/pull/987), [#949](https://github.com/gonka-ai/gonka/pull/949), [#988](https://github.com/gonka-ai/gonka/pull/988), [#825](https://github.com/gonka-ai/gonka/pull/825), [#1011](https://github.com/gonka-ai/gonka/pull/1011), [#1029](https://github.com/gonka-ai/gonka/pull/1029), [#789](https://github.com/gonka-ai/gonka/pull/789))。已解决所有审计发现的问题。
- **协议强化**。保留节点（`POC_SLOT=true`）将被随机抽样用于单次 PoC / CPoC 时间。其他更新包括将 `mlnode` 版本传播到链上 `HardwareNode`，修复 DKG 经销商共识，使旧版验证者惩罚机制与所需抵押语义保持一致，确保 devshard 托管资金的原子性，并在 `inference_finished` 事件解析中添加零时间戳容错。

**升级计划**

二进制版本将通过链上升级提案进行更新。有关升级流程的更多信息，请参阅 [/docs/upgrades.md。](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/docs/upgrades.md)

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

部署、委派或明确拒绝新治理批准的模型（包含的模型将在升级后2个epoch激活）。请参考[指南](https://gonka.ai/docs/host/multi_model_poc/)。

**升级前或升级后**

要求主机更新仪表板/浏览器。请在 `gonka/deploy/join` 目录下运行以下命令：
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

**如何投票**

如果你无法直接访问持有投票权的密钥，或希望由另一个密钥代表你投票，请参考[指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何将冷密钥的治理投票权限授予温密钥。

提案详情和投票可通过 `inferenced` 进行。任何活动节点均可使用。可用节点包括：

- [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
- [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
- [https://node3.gonka.ai](https://node3.gonka.ai)

进行投票（`yes`, `no` , `abstain` , `no_with_veto`）：
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
检查投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 44 -o json --node $NODE_URL/chain-rpc/
```

**截止日期**

- 投票截止时间：2026年4月30日 00:12 UTC
- 升级高度：3834200
- 预计升级时间：2026年4月30日 6:00 UTC

**注意**

- 请计划在升级窗口期间保持在线，以便及时执行任何后续步骤或缓解指令。
- 升级期间，Cosmovisor 会在 `.inference/data` 目录中创建完整的状态备份；请确保有足够的磁盘空间。有关安全删除 `.inference` 目录中旧备份的指导，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)
- 如果 `application.db` 占用了大量磁盘空间，可以应用 cosmovisor 备份[指南](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)中描述的清理技术。
- 升级后，Postgres 可作为本地负载存储的选项。

## 2025年4月15日

**v0.2.12 版本升级的 PR 审查**

[下一个链上软件升级 v0.2.12 的拉取请求](https://github.com/gonka-ai/gonka/pull/948)现已开放审查。

请直接审查 PR 代码，并对发现的问题、疑问、改进建议、边界情况或漏洞发表评论。

有意义的审查贡献，包括重要评论、发现的错误和安全问题，在下一轮升级周期中可能有资格获得社区赏金。

此次仅呼吁审查拉取请求，并不启动正式投票。治理投票流程将在审查期结束后开始。

**主要变更**

- **多模型 PoC 概念验证（最大变更）** ([#1039](https://github.com/gonka-ai/gonka/pull/1039))。将计算量证明（PoC）从单一固定模型过渡到每个模型的 PoC 组。每个经治理批准的模型生成自己的本地 PoC 权重，然后通过特定模型系数聚合为总共识权重
- **共识级交易费用并支持自动迁移** ([#937](https://github.com/gonka-ai/gonka/pull/937), [#981](https://github.com/gonka-ai/gonka/pull/981))。引入由治理控制的 gas 价格。协议任务消息（PoC、验证、推理、BLS DKG）通过 `NetworkDutyFeeBypassDecorator` 免除费用。`MsgPoCV2StoreCommit` 收取两部分费用（基础验证 + 数量线性）作为主要的 Sybil 防御机制。详见 [docs/host_onboarding.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/docs/host_onboarding.md)。
- **Devshard 独立运行时** ([#1045](https://github.com/gonka-ai/gonka/pull/1045))。将 devshard 发布与 DAPI / 主网发布周期解耦。
- **Certik 审计修复** ([#1020](https://github.com/gonka-ai/gonka/pull/1020), [#1021](https://github.com/gonka-ai/gonka/pull/1021), [#1022](https://github.com/gonka-ai/gonka/pull/1022), [#987](https://github.com/gonka-ai/gonka/pull/987), [#949](https://github.com/gonka-ai/gonka/pull/949), [#988](https://github.com/gonka-ai/gonka/pull/988), [#825](https://github.com/gonka-ai/gonka/pull/825), [#1011](https://github.com/gonka-ai/gonka/pull/1011), [#1029](https://github.com/gonka-ai/gonka/pull/1029), [#789](https://github.com/gonka-ai/gonka/pull/789))。所有已知的审计问题均已修复。
- **协议强化**。实现更强的 PoC v2 随机数生成器（完整的 256 位熵，相比之前的 32 位），将通过单独的治理投票激活。其他更新包括将 `mlnode` 版本传播到链上 `HardwareNode`，修复 DKG 经销商共识，使旧版验证者惩罚与所需抵押语义保持一致，确保 devshard 托管资金的原子性，并在 `inference_finished` 事件解析中添加零时间戳容差。

**升级计划**

二进制版本将通过链上升级提案进行更新。有关升级流程的更多信息，请参阅 [/docs/upgrades.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/docs/upgrades.md)。

**升级后所需操作**

现有主机：

- 确保冷账户持有足够数量（例如 100 GNK）以覆盖自动授予的费用限额支出。
- 在治理批准新模型后，部署、委托或明确拒绝每个经治理批准的模型（包含的模型将在升级后3个周期激活）
- 从 `docker-compose.yml` 部署 `versiond` 服务（使用主分支的最后一次提交）
- 使用新版本和参数重新创建 `proxy` 容器。文档将提供确切命令。

## 2026年4月1日

ML 节点 `3.0.12-post6` 可用

新的 mlnode 版本现已发布：`ghcr.io/gonka-ai/mlnode:3.0.12-post6`

- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post6
- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post6-blackwell
- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post6-blackwell-sm120

此版本现已被设为主分支中的默认版本：[https://github.com/gonka-ai/gonka/commit/ec8f45573149ce5686e8e5fc29f1a8f49a295689](https://github.com/gonka-ai/gonka/commit/ec8f45573149ce5686e8e5fc29f1a8f49a295689)

**变更内容**

此版本已在最近几个周期被部分矿工使用。
初步观察表明，对于在 PoC 开始附近运行的节点，稳定性有所提升。

该更新修复了 PoC 开始附近的一个边界情况，该情况在之前特定条件下可能导致性能下降。

vLLM 中的完整变更：[https://github.com/gonka-ai/vllm/compare/release/v0.9.1-pocv2-post5...release/v0.9.1-pocv2-post6](https://github.com/gonka-ai/vllm/compare/release/v0.9.1-pocv2-post5...release/v0.9.1-pocv2-post6)

**指导**

- 建议升级到此版本
- 该版本与之前版本完全兼容

## 2026年3月20日

**升级已执行：v0.2.11 现已在主网上线**

关于升级提案 v0.2.11 的链上治理投票已结束。该提案已获得批准，升级已在主网上成功执行。

**现已生效的关键变更****[初始扩展架构：基于 `devshards` 的推理会话](https://github.com/gonka-ai/gonka/pull/877)**

此次升级引入了基于 `devshards` 的推理会话的初始版本，旨在提升推理的可扩展性。

**[`StartInference` 和 `FinishInference` 性能改进](https://github.com/gonka-ai/gonka/pull/812)**

这些性能改进使得每个区块的推理次数最多可增加100倍，具体取决于工作负载和网络状况。
这些及其他变更的更多详细信息请参见：[https://github.com/gonka-ai/gonka/pull/813](https://github.com/gonka-ai/gonka/pull/813)

**对节点运营者的指导**

- **二进制版本**：通过链上升级流程更新。
- **迁移**：测试和迁移详情记录在 [v0.2.11 文档](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.11/docs/upgrades.md) 中。

这些变更的更多详细信息可在治理文档中找到：[https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.11/proposals/](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.11/proposals/) 

## 2026年3月19日

**升级 v0.2.11：预下载二进制文件**

v0.2.11 升级提案的链上治理流程即将结束。

- 投票截止时间：2026年3月20日 05:59:52 UTC
- 升级高度：3186100
- 预计升级时间：2026年3月20日 14:30 UTC

建议节点运营者在 [GitHub](https://github.com/gonka-ai/gonka/pull/813) 上查看提案并参与投票。
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

**v0.2.11 升级提案进入治理阶段**

下一次链上软件版本 v0.2.11 的升级提案现已发布到链上，开始接受投票。如果获得通过，该提案将引入基于 `devshards` 的推理会话的初始版本，以提升推理的可扩展性，并显著改进 `Start`/`FinishInference` 的性能。

**主要变更****[初始扩展架构：基于 `devshards` 的推理会话](https://github.com/gonka-ai/gonka/pull/877)**

此次升级引入了基于 `devshards` 的推理会话的初始版本，旨在提升推理的可扩展性。

目前，通过每次推理单独发起链上交易的方式处理推理任务，限制了吞吐量。该设计将推理的执行和验证转移至指定的链下子组，而链上仅负责会话创建和最终结算。

这是该设计的一个早期且功能受限的版本。之所以将其提交至主网进行审查和有限生产测试，并非因为设计已完备，而是因为此类系统需要尽早暴露在真实网络环境中。某些类型的问题仅通过本地测试难以发现。当前实现已设计为不会对矿工奖励产生负面影响。

**[`StartInference` 和 `FinishInference` 性能优化](https://github.com/gonka-ai/gonka/pull/812)**

- 减少 `MsgStartInference` 和 `MsgFinishInference` 的不必要的状态写入和查询开销。
- 简化统计处理，减少推理生命周期中的工作量，以提高区块执行的稳定性。

在类似主网的条件下，这也使得每个区块可容纳的推理任务最多增加100倍，具体取决于工作负载和网络状况。有关这些及其他变更的更多详细信息，请参见：[https://github.com/gonka-ai/gonka/pull/813](https://github.com/gonka-ai/gonka/pull/813)

**升级前建议操作****`application.db` 数据清理**

强烈建议节点运营者在升级前按照提供的说明对 `application.db` 进行数据清理。

提前执行此操作非常重要。如果大量节点将清理操作推迟到升级之后，网络中的清理活动可能几乎同时开始，造成本可避免的运行压力。清理操作说明见：[https://gonka.ai/FAQ/#__tabbed_7_4](https://gonka.ai/FAQ/#__tabbed_7_4)

**浏览器更新**

要求节点运营者更新仪表板/浏览器。请在 `gonka/deploy/join` 目录下运行以下命令：
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

**如何投票**

如果您无法直接访问持有投票权的密钥，或希望由另一个密钥代表您投票，请参考[指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何将冷密钥的治理投票权限授予温密钥。

提案详情和投票可通过 `inferenced` 进行。任何活动节点均可使用。可用节点包括：

- [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
- [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
- [https://node3.gonka.ai](https://node3.gonka.ai)

投出您的投票（`yes`，`no`，`abstain`，`no_with_veto`）：

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

检查投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 31 -o json --node $NODE_URL/chain-rpc/
```

**截止时间**

- 投票结束时间：2026年3月20日 05:59:52 UTC
- 升级高度：3186100
- 预计升级时间：2026年3月20日 14:30 UTC

**注意**

- 请计划在升级窗口期间保持在线，以便及时执行任何后续步骤或缓解指令。
- 升级期间，Cosmovisor 会在 `.inference/data` 目录中创建完整的状态备份；请确保有足够的磁盘空间。有关安全删除 `.inference` 目录中旧备份的指南，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。
- 如果 `application.db` 占用大量磁盘空间，可应用[此处](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)描述的清理技术。
- 升级后，Postgres 将可作为本地负载存储的选项。

## 2026年3月17日

**v0.2.11 升级的 PR 审查**

[下一个链上软件升级 v0.2.11 的 Pull Request](https://github.com/gonka-ai/gonka/pull/813) 现已开放审查。欢迎提供反馈和改进建议。

对本次 PR 审查做出有意义贡献者，可能在下一次升级中获得赏金。

此次仅为 PR 审查呼吁，并非正式投票开始。治理投票流程将在审查期结束后启动。

**主要变更**

[初始扩展架构：基于 `devshards` 的推理会话](https://github.com/gonka-ai/gonka/pull/877)

本次升级引入了基于 `devshards` 的推理会话的初始版本，旨在提高推理的可扩展性。

目前，通过每次推理的链上交易处理推理会限制吞吐量。该设计将推理执行和验证移至指定的链下子组，而链仅处理会话创建和最终结算。

这是有意推出的早期且受限版本。提出该版本供主网审查和有限生产测试，并非因为其已完备，而是因为此类系统需要尽早暴露在真实网络条件下。某些类型的问题仅通过本地测试难以发现。当前实现设计上避免对矿工奖励产生负面影响。

[`StartInference` 和 `FinishInference` 性能改进](https://github.com/gonka-ai/gonka/pull/812)

- 减少 `MsgStartInference` 和 `MsgFinishInference` 的不必要的状态写入和查询开销。
- 简化统计处理，减少推理生命周期中的工作量，以提高区块执行稳定性。

在类似主网的条件下，这也使得每区块可容纳的推理数量最多增加 100 倍，具体取决于工作负载和网络状况。

**升级前建议操作****`application.db` 清理**

强烈建议节点在升级前按照提供的说明对 `application.db` 进行清理。
提前执行此操作非常重要。如果许多节点将清理推迟到升级后，网络上的清理活动可能大致同时开始，造成可避免的运行压力。
清理说明文档位于[此处](https://gonka.ai/FAQ/#__tabbed_7_4)。

**浏览器更新**

要求节点更新仪表板/浏览器。请在 `gonka/deploy/join` 目录中运行以下命令：
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```
审阅者可以在此处找到完整的升级提案、迁移详情、测试摘要和建议流程[这里](https://github.com/gonka-ai/gonka/pull/813)。

## 2026年3月16日

**API 二进制文件 `v0.2.10-post7` 已可用**

在 `v0.2.10` 中发现了一个潜在漏洞。为了在当前预升级期间降低风险，建议在下次 PoC 开始前将 api 二进制文件升级到 `v0.2.10-post7`。

完整变更：[https://github.com/gonka-ai/gonka/compare/main…release/v0.2.10-post7](https://github.com/gonka-ai/gonka/compare/main…release/v0.2.10-post7)

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

[工具调用](https://gonka.ai/developer/quickstart/#4-tool-calling) 现已通过标准函数调用模式提供（`type: “function”`）。

集成流程很简单：

- 开发者定义函数
- 当请求匹配时，模型返回结构化的调用参数
- 执行由应用端处理。

对于已经在使用代理层的团队来说，这可能是一个简化技术栈并依赖原生行为的好机会。实际上，这将带来更清晰的集成模式和更易于维护的系统。

## 2026年3月6日

**注意：v0.2.11 升级预计将在下周初进入审查和治理投票阶段。**

请密切关注并计划参与投票。投票是支持网络发展并确保升级符合参与者实际需求的最简单方式之一。
如果您无法访问持有投票权的冷密钥，则应提前安排投票委托。请联系该密钥的所有者，请求其授权您代表他们投票。如果没有该授权，则无法从其他账户提交投票。

在此设置中：

- 授权者 = 拥有投票权的账户（冷密钥）
- 被授权者 = 将代表授权者提交投票的账户（温密钥）

被授权者仍然可以为自己账户投票。授权者可随时撤销此权限。

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
=== "Command"
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

3) 使用受赠者进行投票
=== "Command"
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

4) 撤销委托（使用授权方密钥执行）
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

**API二进制文件v0.2.10-post3已发布**

已发布新版本的API二进制文件。该版本更新了连接超时处理机制，并在PoC验证流程中引入了额外检查。

1. v0.2.10版本引入了对Executor → MLNode连接的严格5分钟超时限制，而某些请求可能需要更长时间。新API版本恢复了该值，不再强制执行严格限制。
2. 请求重试系统之前会在推理因处理超时（而非TLS超时）失败时仍进行重试。
对于长时间请求，服务器端重试通常无效，因为它会导致相同的超时情况，同时客户端可能会收到不一致的输出。新API版本在此类情况下不再重试推理。
3. 当前被保留且未参与PoC生成的MLNode之前仍被用于PoC验证，这可能导致遗漏推理。新版本已将此类节点排除在PoC验证之外。
4. PoC验证流程中已添加额外保护措施。

PR: [https://github.com/gonka-ai/gonka/pull/785](https://github.com/gonka-ai/gonka/pull/785)

构建: [https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.10-post3/decentralized-api-amd64.zip](https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.10-post3/decentralized-api-amd64.zip)

应用更新:
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

**建议（可选）：vLLM / mlnode 构建版本在PoC开始时中断进行中的请求**

一个可用的新版 vLLM / mlnode 构建版本可在PoC开始时中断正在进行的推理请求，以降低因PoC开始时仍处于活动状态的请求可能导致的权重下降风险。

来源: [https://github.com/gonka-ai/vllm/tree/release/v0.9.1-pocv2-post5/vllm](https://github.com/gonka-ai/vllm/tree/release/v0.9.1-pocv2-post5/vllm)

**建议尝试的镜像：**

- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post5
- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post5-blackwell
- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post5-blackwell-sm120

**注意事项：**

- 此构建版本旨在与之前的版本向后兼容。
- 它已经在少量节点上启用，但仍建议在部署前审查变更内容。

## 2026年2月19日

**抵押参数更新提案——投票结果**

抵押参数更新提案已结束，但未达到法定人数。根据当前治理规则，该提案被否决。这意味着更新后的参数不会被激活。

如前所述，Epoch 180 的抵押激活与此投票无关。

由于该提案未通过，Genesis 中定义的抵押参数将在 Epoch 180 自动生效。

参与者应：

- 审查 Genesis 中定义的抵押参数。
- 在 Epoch 180 之前准备并存入所需的 GNK。
- 确保正确设置[抵押](https://gonka.ai/host/collateral/)，否则从 Epoch 180 开始，PoC 衍生的奖励将减少 5 倍。

抵押激活是协议从宽限期过渡到完全抵押 PoC 权重模型的一部分。治理仍是调整参数的机制，但如果未批准替代方案，则适用默认规则。

!!! note "重要提示：存入时请留有余量"

    强烈建议参与者**不要**仅存入最低精确金额。由于归一化效应和网络级调整，PoC 权重可能在不同 epoch 之间波动。较小的权重可能经历相对更大的比例波动。为避免在 epoch 边界处出现临时抵押不足的情况，建议存入高达计算出的最低要求 2 倍的金额，尤其是在抵押水平仍然较低时。这可提供操作安全性，并防止因微小参数变化而导致意外的权重降低。协议不会自动补充抵押。

    如果社区希望再次修改参数，可能会提出新的提案。

## 2026年2月19日

**PoC 权重归一化更新**

最近升级后，由于 PoC 持续时间归一化，节点权重已进行调整。
为将 PoC 权重与实际区块生成时间归一化，校准参数基于观察到的区块间隔进行选择。实际实施中，有效的 PoC 参考窗口比之前的名义假设长约 5 个区块。

结果如下：

- 平均节点权重下降（归一化效应）
- 显示的总 H100 等效容量相应降低
- 相对 GPU 比例保持不变

**原因说明**

此前，PoC 权重计算依赖于名义上的 epoch 持续时间假设。引入实时归一化后：

- PoC 持续时间与实际区块生成时间对齐
- 权重更准确地反映实际计算时间

由于有效归一化窗口比之前的名义模型长约 5 个区块，重新计算的每 epoch 权重相应降低。

**观察到的 GPU 权重变化（Epoch 175 → 176）**

| GPU 类型 | Epoch 175 | Epoch 176 | 变更 |
| --- | --- | --- | --- |
| A100-PCIE-40GB | 11.8 |  |  |
| A100-SXM4-80GB |  |  |  |
| H100 80GB HBM3 |  |  |  |
| H100 PCIe | 10.0 |  |  |
| H200 |  |  |  |

**追踪器（仪表盘）维护人员操作提示**

由于PoC时长归一化已生效，且实际参考窗口现在比之前的名义假设长约5个区块，从第176个纪元开始的权重值反映了更新后的计算模型。
从PoC权重推导H100等效容量或奖励预测的追踪器和仪表盘，应从第176纪元起验证其转换系数。
如果仍使用归一化前的假设，显示的硬件等效值和预测奖励可能会被高估。

## 2026年2月18日

**升级已执行：v0.2.10 现已在主网上线**

关于升级提案v0.2.10的链上治理投票已经结束。该提案已获得批准，升级已在主网上成功执行。此次升级对PoC验证进行了重要优化，并实现了实时权重归一化，以提高网络的公平性和可扩展性。

**注意**

必须重启ML节点容器以触发模型的重新部署。请运行：
```
docker restart join-mlnode-1
```
升级引入的3000个区块宽限期应在 `mlnode:3.0.12-post4-*` 的过渡期内完成。

!!! note "兼容性说明"
    本次升级包含迁移到IBC协议栈v8.7.0。请检查任何解析 `inferenced` CLI 输出的脚本。枚举和int64/uint64值现在以字符串形式编码。

    **现已生效的关键变更****PoC验证采样优化**

    本次升级引入了一种新的PoC验证机制，通过为每个参与者分配一组固定的抽样验证者，将复杂度从O(N^2)降低到O(N x N_SLOTS)。

    **按实际时间进行PoC权重归一化**

    本次升级根据实际PoC经过时间对PoC参与者权重进行归一化，以减少区块时间漂移的影响，并使权重结果与实际执行持续时间保持一致。

    **启用Qwen235B工具**

    本次升级为 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 添加了工具调用参数（`--enable-auto-tool-choice`，`--tool-call-parser hermes`），并将验证阈值设为0.958。
    要启用工具，必须重启MLNode容器内的vLLM。

    **附加协议更新**

- 修复：PoC和CPoC交集错误（PR #752）。
- IBC升级：将IBC协议栈升级至v8.7.0。
- 惩罚机制：阈值现在由链上数据推导得出（PR #688）。
- 代币释放：支持在代币释放过程中进行流式转账（PR #641）。
- MLNode：更可靠的MLNode容器版本 ghcr.io/product-science/mlnode:3.0.12-post4 / ghcr.io/product-science/mlnode:3.0.12-post4-blackwell。

**宽限期**：升级后将有3000个区块的宽限期，在此期间无需进行确认型PoC，并且在升级所在周期内，对缺失率和无效率的阈值要求也更为宽松。

有关这些变更的更多详细信息，请参阅治理文档：[https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10/README.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10/README.md)

## 2026年2月18日

**抵押参数更新提案现已开放投票**

已发布更新抵押参数的提案供社区投票。

提议参数：

- 每1单位算力需0.032 GNK（约每H100需10 GNK）
- 因缺失率或被监禁而受到0.01%的惩罚
- 因无效推理而受到0.5%的惩罚

这意味着在一个周期内，即使受到惩罚，矿工最多只会损失其抵押金额的0.5%。所需抵押金额仅占日收益的约24%。

**警告**：无论投票结果如何，抵押机制都将生效。如果该提案未通过，则创世时定义的抵押参数将在第180周期自动激活，而非上述列出的参数。

投票结束后且在第180周期开始前，每位矿工必须按照[说明](https://gonka.ai/host/collateral/#slashing)将所需资金转入抵押。否则，自第180周期起，其奖励将被减少5倍。

获取更新后的参数：
```
export NODE_URL=https://node3.gonka.ai/
diff -u \
  <(./inferenced query inference params -o json --node $NODE_URL/chain-rpc/ | jq '.params') \
  <(./inferenced query gov proposal 28 -o json --node $NODE_URL/chain-rpc/ | jq '.proposal.messages[] | select(."type"=="inference/x/inference/MsgUpdateParams") | .value.params') \
  || true

```

要投票（`yes`, `no` , `abstain` , `no_with_veto`）：
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

检查投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 28 -o json --node $NODE_URL/chain-rpc/
```
**截止日期：**

投票将于2026年2月19日07:27:06 UTC结束。

## 2026年2月17日

**v0.2.10 升级提案进入治理阶段**

下一次链上软件版本 v0.2.10 的升级提案现已发布上链，并开放投票。若提案获得通过，将引入对PoC验证的重大优化（默认禁用），并实现实时权重归一化，以提升网络的公平性和可扩展性。

**主要变更****PoC 验证采样优化**

此次升级引入了一种新的 PoC 验证机制，通过为每个参与者分配一组固定的抽样验证者，将复杂度从 O(N^2) 降低至 O(N x N_SLOTS)。

**PoC 权重实时归一化**

此次升级根据实际 PoC 经过时间对 PoC 参与者权重进行归一化处理，以减少区块时间漂移的影响，并使权重结果与实际执行时长保持一致。

**为 Qwen235B 启用工具**

此次升级为 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 添加了工具调用参数（`--enable-auto-tool-choice`, `--tool-call-parser hermes`），并设置了验证阈值 `0.958`。
要启用工具，必须重启 MLNode 容器内的 vLLM。升级后将引入一个为期3000个区块的宽限期，在此期间不进行确认型 PoC，并在升级所在周期内采用更宽松的缺失率和失效率阈值。

**其他协议更新**

- 修复 PoC 与 CPoC 交集错误（PR #752）
- 将 IBC 协议栈升级至 v8.7.0
- 惩罚阈值现在由链上数据推导得出（PR #688）
- 支持带有活跃释放期的流式释放转账（PR #641）
- MLNode 容器 `ghcr.io/product-science/mlnode:3.0.12-post4` / `ghcr.io/product-science/mlnode:3.0.12-post4-blackwell` 提供了更可靠的版本。

这些及其他变更的更多细节可在治理文档中查阅：[https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10/README.md ](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10/README.md)

**升级执行后所需的主机操作**

如果提案获得批准并执行升级，则必须重启 ML 节点容器以触发模型的重新部署。请运行：
```
docker restart join-mlnode-1
```
过渡到`mlnode:3.0.12-post4-*`应在升级引入的3000个区块宽限期内完成。

**如何投票**

提案详情和投票可通过`inferenced`获取。任何活动节点均可使用。可用节点包括：

- [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
- [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
- [https://node3.gonka.ai](https://node3.gonka.ai)

投出你的投票（`yes`, `no` , `abstain` , `no_with_veto`）：
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

检查投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 27 -o json --node $NODE_URL/chain-rpc/
```
**截止日期**

- 投票结束时间：2026年2月18日 09:26:26 UTC
- 升级高度：2712600
- 预计升级时间：2026年2月18日 15:30:00 UTC

**注意**

- 请检查任何解析 `inferenced` CLI 输出的脚本。由于 IBC 栈升级到 v8.7.0，枚举和 int64/uint64 值现在被编码为字符串。
- 请计划在升级期间保持在线，以便可以及时应用任何后续步骤或缓解指令。
- 升级期间，Cosmovisor 会在 `.inference/data` 目录中创建完整的状态备份；请确保有足够的磁盘空间。有关安全删除 `.inference` 目录中旧备份的指导，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。
- 如果 `application.db` 占用大量磁盘空间，可以应用[此处](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)描述的清理技术。
- 升级后，Postgres 可作为本地负载存储的选项。

## 2026年2月16日

**抵押品激活及拟议初始参数**

距离 Epoch 180 不到7天——是时候准备了。

如 AMA 中讨论并基于社区成员提出的论点，提议以较小的抵押要求和最低的惩罚开始。

将提交社区投票的参数：

- 每1单位算力 0.032 GNK（约每 H100 10 GNK）
- 错失率或被监禁时 0.01% 惩罚
- 无效推理时 0.5% 惩罚

这意味着在一个周期内，即使受到惩罚，矿工最多也只能损失其抵押品的 0.5%。所需抵押品仅占日收益的约 24%。

提案提交投票后将另行发布通知。

警告：无论提案投票结果如何，抵押机制都将在 Epoch 180 生效。如果此提案未通过，则 Genesis 中定义的抵押参数将自动激活，而非上述参数。

未来任何抵押增加都将通过单独投票提出。目标是观察网络稳定性，确保不合理的惩罚极少发生且仅在合理情况下应用。如果稳定性得到验证，逐步将抵押提升至代币经济白皮书中描述的水平（例如每 H100 约 100 GNK），将支持网络的长期成功。

## 2026年2月13日

**即将进行的 v0.2.10 版本升级投票与执行时间表**

即将进行的软件升级 v0.2.10 的链上投票期预计将于周日晚间（洛杉矶时间）/ 周一上午（UTC）开始。如果该提案通过治理批准，升级计划于周二执行。

**大致时间线：**

- 周日晚间（洛杉矶时间）— 投票期开始
- 周一（UTC上午）— 投票进行中
- 周二 — 升级执行（如获批准）

请查看 GitHub 上的 v0.2.10 升级 PR 并留下您的反馈。有意义的审查贡献可能在下一次升级中获得赏金。

[https://github.com/gonka-ai/gonka/pull/695](https://github.com/gonka-ai/gonka/pull/695)

## 2026年2月13日

如果您的节点未能及时应用最新升级，可能在区块 2628371 处因共识失败而停止运行。这是因为节点正在运行已过时且不再与网络兼容的二进制文件。要恢复，请遵循本指南 [https://gonka.ai/FAQ/#recovery-guide-consensus-failure-after-missing-patch](https://gonka.ai/FAQ/#recovery-guide-consensus-failure-after-missing-patch)

## 2026年2月12日

**网络更新：补丁已发布（PoC / cPoC 重叠）**

现已提供补丁以解决当前周期（169/170）中观察到的事件。

**需要采取的行动**

要求主机尽快应用补丁，以确保 PoC 验证行为正确并安全恢复区块生产。
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

**网络事件：PoC / cPoC 重叠（区块生产已暂停）**

在当前周期中观察到 cPoC（确认 PoC）与 PoC 之间存在重叠。直到该周期的最后一个区块，`is_confirmation_poc_active` 被观察为 `true`。

目前正在评估此重叠的影响。初步观察表明，没有任何节点记录 PoC 提交，导致该周期累积权重为零。

作为预防措施，矿工通过协调行动暂时停止了区块生产。

问题正在定位中。

如果需要立即应用补丁，请保持在线待命。补丁详情和操作说明将在准备就绪后发布。

## 2026年2月12日 

**推理功能现已开放**

链上推理访问目前已开放，且不限于开发者。推理请求可通过上一次更新中引入的 Allowed Transfer Agents 发送。当前白名单可在链上查询：
```
curl "http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/params" | jq '.params.transfer_agent_access_params.allowed_transfer_addresses'
```
允许的转让代理（当前）：
```
 gonka1y2a9p56kv044327uycmqdexl7zs82fs5ryv5le
 gonka1dkl4mah5erqggvhqkpc8j3qs5tyuetgdy552cp
 gonka1kx9mca3xm8u8ypzfuhmxey66u0ufxhs7nm6wc5
 gonka1ddswmmmn38esxegjf6qw36mt4aqyw6etvysy5x
 gonka10fynmy2npvdvew0vj2288gz8ljfvmjs35lat8n
 gonka1v8gk5z7gcv72447yfcd2y8g78qk05yc4f3nk4w
 gonka1gndhek2h2y5849wf6tmw6gnw9qn4vysgljed0u
```
新的库版本在此处提供：[https://gonka.ai/developer/quickstart/#3-inference-using-modified-openai-sdk](https://gonka.ai/developer/quickstart/#3-inference-using-modified-openai-sdk) 

**注意：** 如果某个地址未包含在白名单中，则通过该地址路由的推理请求在当前配置下将不被接受。

## 2026年2月10日 

**v0.2.10升级的PR评审**

[该拉取请求](https://github.com/gonka-ai/gonka/pull/695) 用于下一次链上软件升级v0.2.10，现开放评审。欢迎提供反馈和改进建议。目前计划将评审窗口保持约2天。

对于对该PR评审做出有意义贡献的人，可能在下一次升级中提出悬赏。

此次仅为对拉取请求的评审呼吁，并非正式投票的开始。治理投票流程将在评审期结束后启动。

**主要变更****[PR #710](https://github.com/gonka-ai/gonka/pull/710) PoC验证采样优化**

此次升级引入了一种新的PoC验证机制，通过为每个参与者分配一组固定的采样验证者，将复杂度从O(N^2)降低到O(N x N_SLOTS)。参考设计与分析：[https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/poc/optimize.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/poc/optimize.md)  

**[PR #725](https://github.com/gonka-ai/gonka/pull/725) 按实际PoC时间进行PoC权重归一化**

此次升级通过实际PoC经过的时间对PoC参与者权重进行归一化，以减少区块时间漂移的影响，并使权重结果与实际执行持续时间保持一致。

**其他主要变更：**

- **[PR #708](https://github.com/gonka-ai/gonka/pull/708)** IBC升级至v8.7.0
- **[PR #723](https://github.com/gonka-ai/gonka/pull/723)** 测试网桥接设置脚本
- **[PR #666](https://github.com/gonka-ai/gonka/pull/666)** 优化制品存储吞吐量
- **[PR #688](https://github.com/gonka-ai/gonka/pull/688)** 从链上数据获取惩罚统计信息
- **[PR #697](https://github.com/gonka-ai/gonka/pull/697)** 为macOS测试构建提供便携式BLST构建
- **[PR #712](https://github.com/gonka-ai/gonka/pull/712)** 要求proto-go生成代码与已提交代码匹配
- **[PR #711](https://github.com/gonka-ai/gonka/pull/711)** 从链状态获取PoC测试参数
- **[PR #641](https://github.com/gonka-ai/gonka/pull/641)** 带归属的流式释放转账
- **[PR #659](https://github.com/gonka-ai/gonka/pull/659)** 模型分配检查前一周期的奖励。
- **[PR #716](https://github.com/gonka-ai/gonka/pull/716)** 重命名PoC权重函数以提高清晰度和正确性。

**API加固和可靠性修复：**

- **[PR #634](https://github.com/gonka-ai/gonka/pull/634)**：添加请求体大小限制以降低DoS风险。
- **[PR #727](https://github.com/gonka-ai/gonka/pull/727)**：#634的后续，将响应写入器传递给`http.MaxBytesReader`并对齐测试。
- **[PR #638](https://github.com/gonka-ai/gonka/pull/638)**：修复请求处理中的不安全类型断言。
- **[PR #644](https://github.com/gonka-ai/gonka/pull/644)**：避免每次启动时重写静态配置。
- **[PR #661](https://github.com/gonka-ai/gonka/pull/661)**：防止短时网络中断导致API崩溃。
- **[PR #640](https://github.com/gonka-ai/gonka/pull/640)**：为节点版本端点行为添加单元测试。
- **[PR #622](https://github.com/gonka-ai/gonka/pull/622)**：在`InvalidateInference`中传播退款错误。
- **[PR #639](https://github.com/gonka-ai/gonka/pull/639)**：在任务认领路径中添加错误后的缺失返回。
- **[PR #643](https://github.com/gonka-ai/gonka/pull/643)**：在执行者选择中清理nil参与者。
- **[PR #545](https://github.com/gonka-ai/gonka/pull/545)**：修复API流程中的次要bug。

**升级计划**

二进制版本预计将通过链上升级提案进行更新。有关升级流程的更多信息，请参阅 [https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/docs/upgrades.md.](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/docs/upgrades.md.)

现有主机无需升级其`api`和`node`容器。更新后的容器版本适用于链上升级完成后加入的新主机。

**建议流程**

1. 活跃主机在GitHub上审阅此提案并留下反馈。
2. 社区评审该PR后，预计会从此分支创建v0.2.10版本发布，并可提交此版本的链上升级提案，从而启动正式的治理投票流程。
3. 如果链上提案通过，预计在链上升级执行后合并此PR。

从[upgrade-v0.2.10](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.10)分支（而非`main`）创建发布版本，可以最大限度地减少`/deploy/join/`目录在`main`分支上包含与链上二进制版本不匹配的容器版本的时间，从而为新主机提供更顺畅的接入体验。

**测试与迁移**

v0.2.10的测试指南和迁移详情记录[此处](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10)。请仔细查阅。

**兼容性说明**

如果您有任何解析`inferenced` CLI JSON输出的脚本，请在此升级后重新检查。由于ibc-go已升级至v8.7.0，枚举现在以字符串形式编码而非数字，int64/uint64值现在也以字符串形式编码。

## 2026年2月4日

**CLI更新提醒**

对于在v0.2.9升级后创建的热密钥授予权限，应使用[CLI版本v0.2.9](https://github.com/gonka-ai/gonka/releases/tag/release%2Fv0.2.9)。

## 2026年2月3日

**PoC v2基于推理的权重调整**

随着PoC v2激活，权重分配现在基于当前模型`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`上的实测推理性能。因此，中位GPU权重以及不同类型GPU之间的相对权重比均已调整。

**观察到的GPU权重变化（Epoch 158 → 159）**

| GPU类型 | Epoch 158 | Epoch 159 | 变化 |
| --- | --- | --- | --- |
| A100-PCIE-40GB | 129.05 |  |  |
| A100-SXM4-80GB |  |  |  |
| B200 |  |  |  |
| H100 80GB HBM3 | 17.31 |  |  |
| H100 PCIe |  |  |  |
| H200 |  |  |  |

**Context**

- 观测到的变化表明，GPU权重差异现在反映的是模型特定的推理吞吐量，而非名义上的硬件规格。例如，H100 PCIe的权重下降幅度大于H100 HBM3的权重，这与在`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`上观察到的推理行为一致。
- 根据当前模型配置，基于观测到的推理轨迹，B200 GPU并未表现出比H100级别GPU更高的推理性能。
- 如果在未来周期中通过治理引入更大或要求更高的模型（例如DeepSeek V3.2），可能会观察到不同的性能特征。
- 在PoC之外使用基于标准vLLM的推理对同一模型`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`进行的控制推理基准测试，显示出与PoC v2中观察到的GPU类型之间相同的相对性能差异。

**对追踪器（仪表板）维护者的操作建议**

随着新权重分配生效，追踪器（仪表板）维护者可能需要审查第159周期及之后的系数，以确保与当前PoC v2的权重分配保持一致。

## 2026年2月2日

**网络更新 — 补丁已发布**

现已提供一个补丁，用于解决在PoC周期中导致区块验证最近暂停的问题。建议节点尽快应用此补丁，以确保PoC验证行为正确，并安全恢复区块生成。

**需要采取的操作**

要求节点尽快应用此补丁，以确保PoC验证行为正确，并安全恢复区块生成。
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
将另行分享进一步的说明，包括恢复区块验证所需的任何协调步骤。

## 2026年2月2日

**区块验证已作为预防措施暂停**

由于当前PoC周期内可能存在无法满足验证阈值的高风险，各节点已通过集体行动暂停了区块验证。根据目前评估，用于处理此情况的机制可能无法按预期运行。为防止在不确定或不安全的情况下完成验证者最终确定，网络在验证者选择之前已被暂停。

**下一步**

目前正在执行以下操作：

- 验证是否没有任何验证者集合能够达到所需的验证阈值
- 确认验证者最终确定前的网络状态
- 准备补丁以解决已识别的问题

**需要采取的行动**

所有节点必须准备好在短时间内安装补丁。请保持在线并密切关注公告。补丁就绪后将立即发布进一步说明。

## 2026年2月1日

**升级已执行：v0.2.9 现已在主网上线**

关于升级提案 v0.2.9 的链上治理投票已经结束。该提案已获得批准，并于区块 2451000 成功在主网上执行。此次升级实现了用于权重分配的 PoC v2，并完成了从旧版 PoC 机制的过渡。

**注意**

- 下一个 PoC 周期（从 epoch 158 过渡到 159）至关重要。请计划保持在线，以便在需要时能够及时执行后续步骤或缓解指令。
- 只有服务于 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 的 ML 节点才有资格进入下一个（159）epoch 并参与 PoC v2 的权重分配。运行其他模型的 ML 节点将不会被包含在即将到来的 epoch 的参与者集合中。

**节点准备**

建议各节点验证所有 ML 节点：

- 仅配置为服务支持的模型 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 镜像已更新至支持 PoC v2 的版本

有关将 ML 节点切换至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、升级 ML 节点镜像以及移除其他模型的指南，请参阅[常见问题](https://gonka.ai/FAQ/#how-to-switch-to-qwenqwen3-235b-a22b-instruct-2507-fp8-upgrade-ml-nodes-and-remove-other-models)。

**当前生效的关键变更****PoC v2 激活**

- PoC v2 已作为权重分配的活跃机制启用
- 确认 PoC（V2 跟踪）被用作结果的权威来源
- 旧版 PoC 逻辑不再用于权重计算

**模型配置**

- 网络以单模型配置运行
- 用于 PoC v2 和权重分配的模型是 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 服务于其他模型的 ML 节点不会被包含在 PoC v2 的权重分配中。在支持的情况下，可能会自动切换至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`

**资格标准**

ML 节点要具备 PoC v2 权重分配资格，必须同时满足以下两个条件：

- 节点服务于 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 节点运行 PoC v2 兼容的镜像：
    - ghcr.io/product-science/mlnode:3.0.12-post1
    - ghcr.io/product-science/mlnode:3.0.12-post1-blackwell

**cPoC 情况下的奖励流动修正**

在因 cPoC 惩罚而导致奖励减少或被排除的情况下，未计入的部分将转入社区池。此前，此类奖励会在其他参与者之间重新分配。

**其他协议更新**

- 转账代理角色在初始阶段仅限于[定义的列表](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#transfer-agent-whitelist) `allowlist`
- 在生成PoC时忽略PoC验证的节点已从[参与者列表](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#suspicious-participant-removal) `allowlist` 中移除
- 当PoC v2验证投票阈值未达到时，将应用[守护者权重](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#guardian-tiebreaker-for-poc-v2-voting)作为确定性备用机制

有关这些变更的更多详细信息，请参见治理文档：[https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9 ](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9 )

## 2026年2月1日

v0.2.9升级提案的链上治理流程即将结束。

- 投票截止时间：2026年2月1日 22:02:58 UTC
- 升级高度：2451000。
- 预计升级时间：2026年2月2日 05:10:00 UTC

建议主机节点在[GitHub](https://github.com/gonka-ai/gonka/pull/668)上查看提案并参与投票。

提前预下载二进制文件可能有助于在升级期间避免依赖GitHub的可用性。
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

**v0.2.9 升级提案进入治理阶段**

下一次链上软件版本 v0.2.9 的升级提案现已在链上发布，并开放投票。若提案获得通过，将通过链上治理启用 PoC v2 进行权重分配，并完成从旧版 PoC 机制的过渡。

**主要变更****PoC v2 激活**

- PoC v2 将作为权重分配的主动机制
- 确认 PoC（V2 跟踪）将作为结果的权威来源
- 旧版 PoC 逻辑不再用于权重计算

**模型配置**

- 网络将以单模型配置运行
- 用于 PoC v2 和权重分配的模型为 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 提供其他模型的 ML 节点不会被纳入 PoC v2 的权重分配。在支持的情况下，可能会自动切换至模型 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`

**资格标准**

ML 节点需满足以下两个条件方可参与 PoC v2 权重分配：

- 节点提供模型 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 节点运行 PoC v2 兼容的镜像：
    - ghcr.io/product-science/mlnode:3.0.12-post1
    - ghcr.io/product-science/mlnode:3.0.12-post1-blackwell

**cPoC 情况下的奖励流程修正**

在因 cPoC 惩罚导致奖励减少或被排除的情况下，未计入的部分将转入社区资金池。此前，此类奖励会重新分配给其他参与者。

**其他协议更新**

- Transfer Agent 角色在初始阶段被限制为 [定义](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#transfer-agent-whitelist) 的 `allowlist`
- 曾参与 PoC 生成但忽略 PoC 验证的节点已从 [参与者列表](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#suspicious-participant-removal) `allowlist` 中移除
- [守护者权重](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#guardian-tiebreaker-for-poc-v2-voting) 将在 PoC v2 验证投票阈值未达成时作为确定性备用机制启用

这些变更的更多细节可在治理文件中查阅：[https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9)

**主机准备**

建议主机确认所有 ML 节点：

- 仅配置为提供支持的模型 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 镜像已更新至 PoC v2 兼容版本

有关将 ML 节点切换至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、升级 ML 节点镜像以及移除其他模型的指导，请参阅 [FAQ](https://gonka.ai/FAQ/#how-to-switch-to-qwenqwen3-235b-a22b-instruct-2507-fp8-upgrade-ml-nodes-and-remove-other-models)。

**如何投票**

提案详情和投票可通过 `inferenced` 进行。任何活跃节点均可使用。可用节点包括：

- [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
- [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
- [http://node3.gonka.ai:8000](http://node3.gonka.ai:8000)
- [https://node4.gonka.ai](https://node4.gonka.ai)

进行投票（ `yes` , `no` , `abstain` , `no_with_veto` ）：
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
检查投票状态：
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
- 升级后，Postgres 可作为本地负载存储的可选方案。

## 2026年1月29日

**PoC 验证参与通知**

在最近的一个纪元中，大量 ML 节点未获得 PoC 权重。
分析表明，这是由于 PoC 验证参与不足所致。在多个案例中，参与者发布了随机数（nonce），但未执行验证，或验证水平远低于协议要求。
下表列出了在上一个纪元中有权重、在当前纪元提交了 PoC 随机数，但错过 PoC 验证阶段或参与不足的参与者：[https://docs.google.com/spreadsheets/d/17agQXP77lATT2bNK12OEOzek5wNSptN2ktiSag3QXB0/](https://docs.google.com/spreadsheets/d/17agQXP77lATT2bNK12OEOzek5wNSptN2ktiSag3QXB0/)

他们的总权重约为36%。加上完全未参与 PoC 的参与者，无或低参与度的总权重达到约48%，这一比例极为偏高。
如果您的节点在此表中且 `validated` 列为0，请检查您的 PoC 验证日志和配置，确保验证按预期运行。

此笔记本展示了生成上述表格的过程：[https://github.com/gonka-ai/gonka/blob/gm/debug-155-1/debug-validation.ipynb](https://github.com/gonka-ai/gonka/blob/gm/debug-155-1/debug-validation.ipynb)。

## 2026年1月29日 

**升级已执行：v0.2.8 现已在主网上线**

链上治理投票关于升级提案 v0.2.8 已结束。该提案已获批准，并在主网上成功执行。
此次升级实现了 PoC v2 架构，简化了模型支持，并应用了关键的安全性和可靠性修复。

**当前生效的关键变更****PoC v2 核心集成**

- vLLM 集成：PoC 直接集成到 vLLM 中，可在推理和 PoC 之间立即切换，无需卸载模型。
- MMR 承诺：使用 Merkle Mountain Range 承诺将工件存储移至链下；仅 `root_hash` 和 `count` 记录在链上。
- 双模式迁移：支持 V1（常规 PoC）和 V2（确认型 PoC）追踪。

**模型可用性更新**

支持的模型集现已受限。除以下模型外，所有先前支持的模型均已从活动集中移除：

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `Qwen/Qwen3-32B-FP8`

**安全性和可靠性改进**

- SSRF 和 DoS：验证 `InferenceUrl` 以拒绝内部 IP，并添加超时机制以防止请求挂起。
- 投票翻转：拒绝重复的 PoC 验证，防止覆盖。
- 认证绕过：将 `epochId` 与签名绑定，以针对正确纪元进行验证。

**PoC v2 参与资格的节点要求**

要具备参与 PoC v2 的资格，节点需完成以下操作：

- 模型配置：配置 ML 节点以提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- ML 节点升级：使用支持 PoC v2 的版本：
    - ghcr.io/product-science/mlnode:3.0.12
    - ghcr.io/product-science/mlnode:3.0.12-blackwell

!!! note 
    未能满足上述两个条件的节点，在网络过渡到单模型配置后将不具备参与 PoC v2 的资格。向 PoC v2 过渡以分配权重仍取决于观察到的采用率阈值及后续治理。

    **维护与运营**

- Cosmovisor：节点和API二进制文件的更新将自动处理。现有的Host无需对正在运行的容器执行手动更新。
- 磁盘空间：Cosmovisor会在`.inference/data`目录中创建完整的状态备份。请确保有250GB以上的可用空间。
- Postgres：升级后，现在可以通过Postgres配置本地有效负载存储。

建议在升级后的窗口期内监控节点状态并通过Discord保持沟通，以确保系统稳定。

## 2026年1月28日

**如何切换到`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、升级ML节点并移除其他模型？**

本指南说明了Host应如何更新其ML节点，以响应v0.2.8版本中模型可用性的变化以及即将推出的PoC v2更新。从第155纪元开始，将检查ML节点配置是否符合PoC v2要求。建议Host在此之前审查并准备其ML节点配置。迁移至PoC v2可在第155纪元之后安排。迁移阶段结束后，不符合配置要求的ML节点的权重可能不会被计入。

**1. 背景：模型可用性变更（v0.2.8升级）**

作为v0.2.8升级的一部分，激活的模型集合已更新。

**支持的模型（激活集合）**

仅以下模型仍受支持：

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `Qwen/Qwen3-32B-FP8`

`Qwen/Qwen3-32B-FP8`在迁移期间仍受支持，但不参与PoC v2准备或权重分配。参与PoC v2需要提供`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。

**已移除的模型**

所有先前支持的模型均已从激活集合中移除，不得再提供。

**3. PoC v2准备条件（重要）**

成功参与PoC v2过渡需满足以下两个条件：

- 您的所有ML节点均提供Qwen/Qwen3-235B-A22B-Instruct-2507-FP8。这是唯一对PoC v2权重有贡献的模型。
- 您的所有ML节点均已升级至支持PoC v2的镜像：
    - ghcr.io/product-science/mlnode:3.0.12
    - ghcr.io/product-science/mlnode:3.0.12-blackwell

!!! note "重要"

    - 仅提供正确的模型而不升级ML节点是不够的。
    - 在网络切换为单模型配置后，未满足这两个条件的节点将不具备资格。
    - 必须在迁移完成前完成ML节点升级，并在v0.2.8升级后通过单独的治理提案激活PoC v2。
    - v0.2.8升级本身不会启用PoC v2。

**3. 检查ML节点分配状态（推荐的安全步骤）**

在更改模型之前，您应检查当前的ML节点分配情况。请查询您的网络节点管理API：
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

- 第一个布尔值：节点在当前epoch是否正在提供推理服务
- 第二个布尔值：节点是否计划在下一次PoC中提供推理服务

**推荐行为**

- 建议仅在第二个值为`false`的节点上更改模型
- 在观察PoC v2行为期间，这可以降低风险
- 鼓励跨epoch逐步 rollout

**4. 为ML节点更新模型：仅保留支持的模型**

预下载模型权重（推荐）。为避免启动延迟，请将权重预下载到`HF_HOME`：
```
mkdir -p $HF_HOME
huggingface-cli download Qwen/Qwen3-235B-A22B-Instruct-2507-FP8
```
使用机器学习节点管理API将机器学习节点切换到受支持的模型（`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`）。

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
通过管理API进行的更改将在下一个epoch替换模型 [https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)

!!! note 

    `node-config.json` 仅在首次启动网络节点API或本地状态/数据库被删除时使用。如需全新重启，请编辑它。对于现有节点，应通过管理API执行模型更新。

    **5. 升级ML节点镜像（PoC v2必需）**

    编辑 `docker-compose.mlnode.yml` 并更新ML节点镜像：

    标准GPU
```
image: ghcr.io/product-science/mlnode:3.0.12
```
NVIDIA Blackwell GPU
```
image: ghcr.io/product-science/mlnode:3.0.12-blackwell
```
应用更改并重启服务。来自 `gonka/deploy/join`：
```
source config.env
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml pull
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d
```

**6. 验证模型服务（在下一个epoch生效）**

确认ML节点仅提供`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`服务，这是PoC v2权重和未来权重分配唯一使用的模型：
```
curl http://127.0.0.1:8080/v1/models | jq
```
可选地重新检查节点分配：
```
curl http://127.0.0.1:9200/admin/v1/nodes
```

!!! note "治理与PoC v2激活说明"
    PoC v2 将分阶段引入，不会一次性激活。

    **阶段1. 观察（v0.2.8升级后的当前状态）**

    在v0.2.8升级后，PoC v2逻辑已可用，但尚未用于权重分配。

    在此阶段：

    - 节点可以提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 或 `Qwen/Qwen3-32B-FP8`
    - 节点必须将其ML节点切换为提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 并升级至支持PoC v2的版本，才能为PoC v2权重做出贡献。
    - 网络将观察采用情况，以评估节点对转向PoC v2权重的准备情况。

    **阶段2. 治理提案（可选，未来阶段）**

    当活跃节点中的采用率达到足够水平（约50%）时：

    - 可能会提交单独的治理提案
    - 该提案可能请求批准激活PoC v2并使用PoC v2进行权重分配

    采用门槛仅为观察性指标，不会触发任何自动变更。

    **阶段3. 激活（仅在治理批准后）**

    仅当链上治理提案获得通过后，PoC v2才会成为活跃的权重分配方式。
    在该提案获得批准之前：

    - PoC v2在权重分配中仍处于非活跃状态
    - 现有的PoC机制将继续用于确定权重

**摘要检查清单**

在PoC v2激活前，请确保：

- ML节点提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 配置中已移除所有其他模型
- ML节点镜像版本为3.0.12（或3.0.12-blackwell）

## 2026年1月28日

v0.2.8升级提案的链上治理流程即将结束。

**升级详情**

- 升级高度：区块2387000
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

**v0.2.8 升级提案进入治理流程**

下一次链上软件版本 v0.2.8 的升级提案现已在链上发布，进入投票阶段！
您的审阅和投票对于确保网络的稳定性和未来能力至关重要。

**v0.2.8 中的关键变更****PoC v2（核心升级）**

- 将 PoC 直接集成到 vLLM 中，能够在推理和 PoC 之间立即切换，无需卸载模型或加载单独的 PoC 模型。
- 使用 MMR（Merkle Mountain Range）承诺将产物存储迁移到链下——仅在链上记录 root_hash 和 count。
- 包含双模式迁移策略：V1 用于常规 PoC，V2 跟踪用于上线期间的 Confirmation PoC。

**模型可用性变更**

作为 v0.2.8 升级的一部分，受支持模型集合将更新。所有先前支持的模型都将从激活集合中移除，仅保留：

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `Qwen/Qwen3-32B-FP8`

使用 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 成功参与 PoC v2，并配合所需的 ML 节点版本，将用于评估向 PoC v2 迁移的准备情况。一旦观察到足够水平的采用率（约 50%）在活跃 Host 中达成，可能会提交单独的治理提案以批准并激活 PoC v2 用于权重分配。此阈值仅为观察用途，不会触发任何自动的网络变更。

在下一次网络升级通过治理批准后，网络将暂时仅支持 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。

**安全性、正确性和可靠性改进**

- SSRF 和 DoS：验证 InferenceUrl 以拒绝内网 IP，并添加超时机制防止请求挂起。
- 投票翻转：通过拒绝重复项防止 PoC 验证被覆盖。
- PoC 排除：修复 getInferenceServingNodeIds 以正确排除正在提供推理服务的节点。
- 认证绕过与重放攻击：将 epochId 绑定到签名，并针对正确的 epoch 验证授权。

由于变更内容较多，此处仅列出部分重点项。完整的更新和修复列表请参见 [GitHub pull request](https://github.com/gonka-ai/gonka/pull/539)。

**Host 需采取的行动**

为了参与 PoC v2 迁移，Host 必须完成以下两个步骤：

- 确认您的 ML 节点已配置为提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 服务
- 将 ML 节点升级至支持 PoC v2 的版本：
    - ghcr.io/product-science/mlnode:3.0.12
    - ghcr.io/product-science/mlnode:3.0.12-blackwell

仅提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 服务但未升级 ML 节点，不足以参与 PoC v2。未满足这两个条件的节点，在网络切换至单模型配置后将不被视为具备 PoC v2 参与资格。ML 节点升级必须在 PoC v2 通过治理完全启用之前完成。

**如何投票**

您可以使用 `inferenced` 命令获取提案详情并进行投票。请注意，任何活跃节点均可用于查询或投票。当前可用节点包括：

- [http://node1.gonka.ai:8000/](http://node1.gonka.ai:8000/)
- [http://node2.gonka.ai:8000/](http://node2.gonka.ai:8000/)
- [http://node3.gonka.ai:8000/](http://node3.gonka.ai:8000/)
- [https://node4.gonka.ai/](https://node4.gonka.ai/)

查看投票状态：
```
export NODE_URL=https://node4.gonka.ai/
./inferenced query gov votes 25 -o json --node $NODE_URL/chain-rpc/
```

进行投票（ `yes` , `no` , `abstain` , `no_with_veto` ）：
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

**截止日期**

- 投票将于2026年1月29日03:02:20 UTC结束。
- 升级提议在区块2387000上进行。该区块的预计时间为2026年1月29日06:30:00 UTC。

请查看并在您是主机的情况下投票。

**注意1：** 请计划在升级窗口期间保持在线，以便在需要时能及时执行后续步骤或缓解措施。

**注意2：** 升级期间，Cosmovisor会在`.inference/data directory`中创建完整的状态备份。请确保有足够的磁盘空间。有关安全删除`.inference`目录中旧备份的说明，请参见[此处](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。如果`application.db`占用了大量磁盘空间，可使用[此处](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)所述的清理技术。

**备注：** 升级后，Postgres可配置为本地负载的存储。

## 2026年1月19日

**提案更新：稳定期延长已批准**

关于延长稳定期的最近治理投票已成功通过。现在正式延长稳定期，以允许进行额外测试和网络升级。

**主机行动项**

随着延期确认，请利用这段时间为新的PoC要求准备您的设置。

- 模型更新：请将您的ML节点切换到`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`模型。
- 逐步推出：如果您运行多个ML节点，建议在多个周期内逐步执行这些更新。

**如何更新**

更新现有ML节点的说明可在此处找到：[https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)

## 2026年1月16日

**稳定期延长**

一项新的治理投票目前正在进行中。

该提案将当前稳定期延长约两周。延长期间旨在为即将到来的PoC变更及相关网络升级进行额外测试。有关新PoC开发进展的更多详情，请参见此处：[https://github.com/gonka-ai/gonka/blob/gm/poc-status/proposals/governance-artifacts/poc-update-status.md](https://github.com/gonka-ai/gonka/blob/gm/poc-status/proposals/governance-artifacts/poc-update-status.md)。

延期还为主机提供了时间为新PoC要求准备其设置，包括将ML节点切换到`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`模型。更新现有ML节点的说明可在此处找到：[https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)。建议运行多个ML节点的主机在多个周期内逐步进行更新。

**投票范围**

如果提案获得批准，网络将暂时继续在现有的`allowlist`下运行（包括尚未表现出非标准硬件行为的主机）。

开发者`allowlist`将延长相同的偏移量，并持续生效至区块2459375。

未包含在`allowlist`中的主机在延长的稳定期内仍将无法参与PoC，该期间将在区块2443558结束。

**可复现性与方法论**

`allowlist`是：

- 可在此处获取：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)
- 基于公开可观察的链上数据，使用一组预定义的硬件配置模式推导得出。这些模式使用此处提供的开源脚本进行评估：[https://github.com/product-science/filter](https://github.com/product-science/filter)

**执行特性**

- 如果提案获得批准，`allowlist`将自动延长。
- 无需软件升级。
- 如需进一步调整，仍需通过治理决定。

**稳定期窗口之后**

`allowlist`具有固定到期时间，不会在延长的稳定期后持续存在。一旦`allowlist`在区块2443558过期：

- 网络将恢复到稳定期之前生效的标准参与规则，或
- 任何替代配置必须通过单独的治理决策来定义。

**如何投票**

您可以使用`inferenced`命令获取提案详情并投票。

请注意，任何活动节点均可用于查询或投票。当前可用的节点包括：

- http://node1.gonka.ai:8000/ 
- http://node2.gonka.ai:8000/
- http://node3.gonka.ai:8000/ 
- https://node4.gonka.ai/ 

检查投票状态：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 22 -o json --node $NODE_URL/chain-rpc/
```

进行投票（ `yes` , `no` , `abstain` , `no_with_veto` ）：
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

此流程完全通过治理进行处理，无需软件升级。

**时间表和截止日期**

投票结束时间：2026年1月18日 05:28:01 UTC。

`Allowlist` 到期时间：区块 2443558 时自动过期。

## 2026年1月10日

**临时参与者 `allowlist` 修正**

一项新的治理投票当前处于活跃状态。该投票通过将若干地址添加到[白名单](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)中，修正了因硬件名称为空但ML节点权重为零而被错误过滤的边缘情况。该提案还将少量开发者账户添加到允许的开发者列表中，并将 `allowlist` 的到期时间与参与者注册截止区块 2,222,222 保持一致。
所有参与逻辑保持不变。此提案仅解决现有过滤逻辑中的一个次要问题。

**可复现性与方法论**

`allowlist` 基于链上公开可观察数据，使用一组预定义的硬件配置模式生成。这些模式通过此处提供的开源脚本进行评估：[https://github.com/product-science/filter](https://github.com/product-science/filter)

`allowlist` 可在此处获取：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)

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

进行投票（ `yes` , `no` , `abstain` , `no_with_veto` ）：
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

此流程完全通过治理进行，无需软件升级。

**时间表和截止日期**

投票结束时间：2026年1月12日 06:04:14 UTC。

`Allowlist` 到期时间：在区块 2,222,222 自动到期。

## 2026年1月10日

**临时参与者 `allowlist` 已获批准。将在第135轮激活**

针对稳定期临时参与者 `allowlist` 的链上治理投票已经结束。

该提案已获批准。此提案定义了一个临时的 `allowlist`，包含那些在最近多个轮次中行为保持一致的参与者。

**当前生效的关键变更**

1) 网络将运行一个由以下参与者组成的 `allowlist`，这些参与者在多个轮次中：

- 上报的硬件特征符合常见配置模式（过滤的非标准配置字符串列表见此处：[https://github.com/product-science/filter/blob/main/filter_strings.txt](https://github.com/product-science/filter/blob/main/filter_strings.txt))
- 展示的PoC权重未超过同类硬件观察到权重的150%

2) 之前持续偏离这些模式的参与者将被排除在 `allowlist` 之外，直至稳定期在区块 2,222,222 结束。

**执行特性**

- `allowlist` 将从下一轮（第135轮）开始生效
- 激活发生在第135轮的首次PoC期间
- 无需软件升级
- 此后，`allowlist` 将持续有效，直至并包括区块 2,222,222

**可复现性与方法论**

- `allowlist` 完全基于公开可观察的链上数据生成
- 硬件描述符使用开源脚本对照预定义的配置模式集合进行评估：[https://github.com/product-science/filter](https://github.com/product-science/filter)
- 生成的 `allowlist` 发布于此：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)

**下一步**

主机无需采取任何操作。

## 2026年1月8日

**时机已到：稳定期临时参与者 `Allowlist`**

在成功采用修复PoC相关共识故障的补丁后，一项新的治理投票当前正在进行中。

随着正常区块生产恢复，网络将在进一步增长前进入短暂的稳定期。

此次投票定义了稳定期的参与者 `allowlist`（[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)），反映那些行为持续符合网络预期的参与者集合。

**投票范围**

若提案获批，网络将临时以一个由此前未表现出非标准硬件行为的参与者组成的 `allowlist` 运行。实际上，`allowlist` 对应那些在多个轮次中：

- 上报的硬件特征已根据预定义的常见硬件配置模式集合进行评估，用于识别偏差和不一致（确切的非标准配置字符串列表见此处：[https://github.com/product-science/filter/blob/main/filter_strings.txt](https://github.com/product-science/filter/blob/main/filter_strings.txt))，且
- 观察到的PoC权重低于同类硬件其他参与者所展示权重的150%。
此前持续偏离这些模式的参与者将不包含在 `allowlist` 中，直至稳定期在区块 2222222 结束。

**可复现性与方法论**

`allowlist` 基于公开可观察的链上数据，使用预定义的硬件配置模式集合生成。这些模式使用此处提供的开源脚本进行评估：[https://github.com/product-science/filter](https://github.com/product-science/filter)

`allowlist` 可在此处获取：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)

**执行特性**

- 若提案获批，`allowlist` 将自动生效。
- 无需软件升级。
- 在成功投票后的下一个PoC期间，`allowlist`将生效，预计在区块：2089140。
- 从那时起，`allowlist`将持续有效，直至并包括区块​​2222222。
- 如需进一步调整，仍需通过治理决定。

**在稳定期窗口之后**

`allowlist`设定了固定到期时间，不会超过稳定期窗口。一旦`allowlist`在区块2222222过期：

- 网络将恢复到稳定期之前生效的标准参与规则，或者
- 任何其他配置都必须通过单独的治理决定来定义。

**如何投票**

您可以使用`inferenced`命令获取提案详情并进行投票。
请注意，任何活动节点都可以用于查询或投票。当前可用的节点包括：

- http://node1.gonka.ai:8000/
- http://node2.gonka.ai:8000/
- https://node4.gonka.ai/

查看投票状态：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 20 -o json --node $NODE_URL/chain-rpc/
```

进行投票（ `yes` , `no` , `abstain` , `no_with_veto` ）：
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

此流程完全通过治理进行，无需软件升级。

**时间线和截止日期**

- 投票结束时间：2026年1月10日 06:46:52 UTC。
- `Allowlist` 激活：下一次PoC在区块2089140执行后。
- `Allowlist` 过期：在区块2222222自动过期。

请查看并在您是Host的情况下投票。

## 2026年1月8日

**网络更新 — 共识已恢复**

在部署补丁后，网络共识已稳定，并正在正常参数范围内运行。

## 2026年1月8日

**网络更新 — 补丁已准备就绪，可部署**

针对PoC期间观察到的最近共识故障的补丁现已可用。

[指南](https://gonka.ai/FAQ/#upgrade-v027)

为恢复可靠的共识进展，需要**至少67%**的活跃网络算力安装该补丁。

在达到此阈值之前，共识进展可能仍然不稳定。

**建议Host尽快应用补丁，并在升级后保持在线。如有必要，将进一步分享说明。**

## 2026年1月8日

**网络更新 — 后续跟进**

解决最近共识问题的补丁已准备就绪，详细说明将很快发布。
每个活跃Host的参与对网络向前发展并恢复正常运行至关重要。请保持在线，并在说明发布后准备应用更新。

## 2026年1月8日

**网络更新 — PoC期间共识故障**

在计算证明（PoC）期间，网络上观察到共识故障。
问题已被识别，目前正在准备补丁以解决根本原因。技术细节和进一步说明将很快发布。
建议Host保持在线并监控更新，因为在补丁发布后可能需要采取后续操作。

## 2026年1月8日

**v0.2.7 升级提案：主网上线创世验证器增强功能**

v0.2.7 升级提案：创世验证器增强功能的链上治理投票已结束；该提案已获得批准，并成功部署到主网。

**当前生效的关键变更：****创世验证器增强（临时）**

- 临时重新激活创世验证器增强功能——一种此前使用过的、有时间限制的防御机制，现提议重新激活。
- 在网络增长期间提供共识保护。在其先前运行期间：
    - 三个Guardian验证器共同持有约34%的共识投票权
    - Guardian验证器未获得额外奖励
    - 此配置有助于防止极端情况下的共识停滞
- 当同时满足以下两个条件时，创世验证器增强功能将自动停用：
    - 总网络算力达到15.000.000
    - 达到区块3.000.000

**协议稳定性修复（全网范围）**

此次升级正式化了此前通过手动API更新分发且已在网络上使用的重大修复。这些修复：

- 解决了失败推理请求的会计错误问题（包括以不支持格式处理但未标记为完成的请求）
- 改进了失败推理处理的弹性
- 为 `PoCBatch` 和 `PoCValidation` 交易引入批处理。

通过在此处包含它们，该行为成为网络中一致应用的协议级规则。

**临时参与和执行限制**

- 主机级注册：新主机的注册将在第 2.222.222 个区块前暂停（大约从现在起两周后）。此项措施旨在稳定网络并为未来的增长做好准备。
- 开发者地址注册：在稳定期间，新开发者地址的注册将暂停。立即生效一份预定义的 `allowlist` 开发者地址名单。在此期间，名单中的开发者地址将能够执行推理任务。所有适用于开发者地址的限制，包括开发者级别的注册和推理执行，将持续到第 2.294.222 个区块（约19天）。

**由治理控制的机制**

本次升级中包含的预备性变更，使得未来可通过治理控制参与者准入和推理执行，而无需额外的软件升级。本提案不启用任何此类由治理激活的约束，需经过额外的治理投票才能启用。

**第117纪元奖励分发**

本提案涵盖与链暂停（第117纪元）相关的两次奖励分发：

- 在第117纪元期间活跃但未收到该纪元奖励的节点，将收到该纪元错过的奖励。
- 所有在第117纪元期间活跃的节点将额外获得相当于第117纪元奖励1.083倍的支付，该支付统一应用于所有符合条件的节点，包括已收到原始奖励的节点。

**关于持续时间和执行的说明**

本次升级重新激活或引入的所有保护措施均为临时性，无需手动治理干预即可移除。

**下一步：**

- 主机无需采取进一步行动。
- Cosmovisor 在每次执行更新时都会在 `.inference` 状态文件夹中创建完整备份。为安全运行更新，建议至少有 250+ GB 的可用磁盘空间。[点击此处](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)了解如何从 `.inference` 目录安全删除旧备份。

**备注：**

- 创世验证者增强的完整技术细节请参见：
[https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)
- 完整技术审查（GitHub PR）：[https://github.com/gonka-ai/gonka/pull/503](https://github.com/gonka-ai/gonka/pull/503)

## 2026年1月7日

版本 **v0.2.7** 的升级提案已通过链上治理批准。

**升级详情**

- 升级高度：第 2.054.000 个区块
- 预计时间：2026年1月8日 08:10:00 UTC。

提前预下载二进制文件可能有助于避免在升级期间依赖 GitHub 的可用性。

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
所有命令成功完成且显示确认消息后，即可认为二进制文件已成功安装。
```
Inference Installed and Verified
--- Final Verification ---
-rwxr-xr-x 1 root root 224376384 Jan  1  2000 .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api
-rwxr-xr-x 1 root root 215172352 Jan  1  2000 .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced
.dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api: OK
.inference/cosmovisor/upgrades/v0.2.7/bin/inferenced: OK
```

**注意**

- 如果出现问题，请在升级窗口期间保持在线以遵循相关说明。
- Cosmovisor 在升级期间会对 `.inference/data` 目录创建完整备份。请确保有足够的磁盘空间。如果磁盘使用率较高，可以安全删除 `.inference` 中的旧备份。[相关操作方法请点击此处。](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)
- 较大的 `application.db` 文件可通过[这些技术](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)进行缩减。

**可选：跳过 Cosmovisor 备份**

Cosmovisor 支持通过为 `node` 容器设置环境变量 `UNSAFE_SKIP_BACKUP=true` 来跳过升级期间的自动状态备份。

这可能会减少磁盘使用量并缩短升级时间。但如果升级失败，则无法恢复到之前的备份状态。

## 2026年1月7日

**致主机节点的重要提示**

可通过为 `node` 容器设置环境变量 `UNSAFE_SKIP_BACKUP=true` 来跳过 Cosmovisor 升级期间的自动备份。
此选项存在风险——如果升级失败，将没有备份可用于恢复状态。

## 2026年1月6日

**v0.2.7 升级提案：创世验证者增强机制进入治理阶段**

一项与创世验证者增强机制相关的链上治理提案已发布，现开放投票。

近期网络增长带来了若干挑战。过去几天中，网络经历了多次问题，其中一些似乎是由蓄意破坏或压力攻击引起的。本提案旨在通过一系列临时措施，在高负载和不利条件下增强网络的弹性。

创世验证者增强机制最初在网络早期作为临时防御机制引入，并在前两个月运行期间启用。当前治理提案旨在根据现有网络状况，临时重新激活该已有机制，并启用一些额外的保护措施。

**主要变更****创世验证者增强机制（临时）**

- 临时重新启用创世验证者增强机制——一种此前使用过的、有时间限制的防御机制，现提议重新激活。
- 在网络增长期间提供共识保护。在之前运行期间：
    - 三个 Guardian 验证者共同持有约 34% 的共识投票权
    - 未向 Guardian 验证者提供额外奖励
    - 该配置有助于防止极端情况下的共识停滞
- 当同时满足以下两个条件时，创世验证者增强机制将自动停用：
    - 全网总算力达到 15,000,000
    - 达到区块 3,000,000

**协议稳定性修复（全网范围）**

本次升级将此前通过手动 API 更新分发且已在网络中使用的重大修复正式纳入协议。这些修复包括：

- 修正了失败推理请求的错误记账问题（包括处理了不支持格式的请求但未标记为完成的情况）
- 改进了失败推理处理的弹性
- 为 `PoCBatch` 和 `PoCValidation` 交易引入批量处理机制

通过本次升级，这些行为将成为全网一致执行的协议级规则

**临时参与与执行限制**

- 主机注册限制：新主机注册将在区块 2,222,222 前暂停（约两周后）。该措施旨在稳定网络并为后续增长做准备。
- 开发者地址注册限制：在稳定期间暂停新开发者地址注册。立即生效一个预定义的 `allowlist`。列入白名单的开发者地址在此期间可执行推理任务。所有适用于开发者地址的限制，包括开发者级别注册和推理执行，将持续有效至区块 2,294,222（约19天后）

**由治理控制的机制**

本次升级包含的预备性变更，将使未来可通过治理控制参与者准入和推理执行，而无需额外的软件升级。本次提案不启用任何此类由治理激活的限制，需经后续治理投票决定。

**第117轮奖励发放**

本提案涵盖与链暂停（第117轮）相关的两次奖励发放：

- 在第117轮活跃但未收到该轮奖励的节点将补发遗漏的奖励。
- 所有在第117轮活跃的节点将获得额外一笔等于第117轮奖励1.083倍的支付，均匀分配给所有符合条件的节点，包括已收到原始奖励的节点。

**关于持续时间和执行的说明**

本次升级重新激活或引入的所有保护措施均为临时性，无需手动治理干预即可移除。

**如何投票**

您可以使用 `inferenced` 命令获取提案详情并进行投票。

要查看投票状态：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 19 -o json --node $NODE_URL/chain-rpc/
```

进行投票（ `yes` , `no` , `abstain` , `no_with_veto` ）：
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

- 投票结束时间：2026年1月8日，04:23:14 UTC。
- 升级提议区块：2.054.000。
- 预计升级时间：2026年1月8日，08:10:00 UTC。

**主机注意****注意1**

请查看提案并在您是主机的情况下进行投票。
在升级窗口期间保持在线，以便在出现问题时遵循相关指令。

**注意2**

Cosmovisor 在执行更新时会在 `.inference/data` 状态文件夹中创建完整备份，请确保您的磁盘有足够的空间。阅读[此处](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)了解如何从 `.inference` 目录安全删除旧备份。
如果您的 `application.db` 占用大量空间，可以使用[此处](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)的技术来清理它。

**参考**

创世验证者增强的完整技术细节请参见：
[https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)

完整技术评审（GitHub PR）：[https://github.com/gonka-ai/gonka/pull/503](https://github.com/gonka-ai/gonka/pull/503)  

## 2026年1月5日
当前网络上观察到高于平常的未完成推理率。
在许多情况下，这是由于一个错误：以不支持格式的推理请求未被标记为已完成，即使请求本身已被处理。以下更新解决了此行为。

参考：[https://github.com/gonka-ai/gonka/pull/517](https://github.com/gonka-ai/gonka/pull/517) 

此 `API` 版本改进了失败推理处理的弹性，并减少了未完成推理统计问题。它还为 PoCBatch 和 PoCValidation 交易引入了批处理功能。

**升级时机**

当确认 PoC 未激活时，应用此更新是安全的。

验证当前状态的方法：
```
curl "http://136.243.34.19:8000/v1/epochs/latest" | jq '.is_confirmation_poc_active'
```
确认PoC之外，此值应返回`false`。

**安装**

下载并安装新的二进制文件，然后重启`API`容器：
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
