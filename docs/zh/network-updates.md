# 公告

!!! note "关于本页面"

    本页面由社区成员维护和更新。
   
    如需发布公告（例如您发起的治理投票），请在 gonka-docs 仓库中提交拉取请求：[https://github.com/gonka-ai/gonka-docs](https://github.com/gonka-ai/gonka-docs)
   
    本页面内容不保证完全详尽。如需获取最新信息（包括治理投票的启动及其当前状态），请参考链上数据或查看可用的区块链浏览器和仪表板。

## 2026年6月6日

**[仅针对开发分片（devshard）升级的PR现已开放审查](https://github.com/gonka-ai/gonka/pull/1289)。**

这是首次仅针对开发分片的升级，因此流程与标准链升级不同。开发分片升级会独立于主区块链更新其运行时，无需通过Cosmovisor协调全节点升级，不会影响主网行为，也不应导致推理服务中断。

如果该升级提案通过治理流程获得批准，新的开发分片版本将与现有的v1运行时并行运行。

请直接审查该PR，并对发现的问题、疑问、改进建议、边界情况或潜在漏洞留下评论。

有意义的审查贡献（包括重要评论、发现缺陷或安全问题）可能有资格在下一次升级周期中获得社区奖励。

本次公告仅为呼吁代码审查，**不启动正式投票**。治理投票流程将在审查期结束后开始。

## 2026年5月28日

**MiniMax-M2.7 现已在 Gonka 网络上线运行**

此前在 v0.2.13 版本中宣布的引导阶段已完成。自链上纪元 278 起，MiniMaxAI/MiniMax-M2.7 已正式加入 Qwen3-235B 和 Kimi K2.6，成为活跃的模型组之一，MiniMax 组内获得的 PoC 权重现将按校准系数 0.3024 转换为共识权重。

针对 MiniMax 模型的参与执行机制现已生效。已为 MiniMax 选择 DIRECT（直连）、DELEGATE（委托）或 REFUSE（拒绝）的节点无需额外操作——原有设置继续有效。尚未做出选择的节点建议尽快完成选择，以避免遭受每纪元的惩罚机制影响（[https://gonka.ai/docs/host/quickstart/#optional-poc-delegation-and-refusal](https://gonka.ai/docs/host/quickstart/#optional-poc-delegation-and-refusal)）。

## 2026年5月26日

**升级已完成：v0.2.13 现已在主网上线**

针对升级提案 v0.2.13（提案编号 54）的链上治理投票已结束。  
该提案已获**通过**，升级已于区块高度 `4267300` 在主网上成功执行。

## 2026年5月25日

**升级 v0.2.13：请提前下载二进制文件和 MiniMax-M2.7 权重**

升级提案 v0.2.13（提案编号 [https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143) 54）已通过链上治理，升级时间现已确定。

• 升级高度：4267300  
• 预计升级时间：2026年5月26日 14:42 UTC（07:42 PDT）

建议提前下载二进制文件和模型权重，以避免在升级期间依赖 GitHub 或 Hugging Face 的可用性。
```

#
 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.13/bin \
              .inference/cosmovisor/upgrades/v0.2.13/bin && \
#
 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.13/decentralized-api-amd64.zip" && \
echo "cf31fa4d715e721d1e17b7e2b46d628a0b66b6ef603d352d587abe1d57c40925 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.13/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.13/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \
#
 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.13/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.13/inferenced-amd64.zip" && \
echo "ea7dea6c4e8d96ed61005bed196768cc9f44e5fb17f0714cb64d1d00a485be0c inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.13/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.13/bin/inferenced && \
echo "Inference Installed and Verified" && \
#
 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--
- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.13/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.13/bin/inferenced && \
echo "f93d579ef9c46ade9f28c73c339df2f7ae73607115b7efeb849316984924f68d .dapi/cosmovisor/upgrades/v0.2.13/bin/decentralized-api" | sudo sha256sum --check && \
echo "e52b86c4f64a47f0ea9bdb3327feb321b8a4208a76b35d52a7e9ddd1b9d6eed5 .inference/cosmovisor/upgrades/v0.2.13/bin/inferenced" | sudo sha256sum --check
```


## 2026年5月22日

**v0.2.13 投票已结束——准备在高度 4267300 进行升级**

关于 [升级提案 v0.2.13](https://github.com/gonka-ai/gonka/pull/1143)（提案 ID `54`）的链上治理投票已经结束。该提案已获 **通过（APPROVED）**。

此次升级将在主网上于 **区块高度 4267300** 自动执行（≈ **2026年5月26日，星期二 14:42 UTC / 07:42 PDT**）。

**提醒事项**

1. 请确保您的桥接容器已更新并完成同步。以太坊主网桥接合约（`0x972a7a92d92796a98801a8818bcf91f1648f2f68`）、USDC/USDT 代币元数据以及 CW20 `wrapped_token` 的代码 ID `105` 将通过升级处理器本身注册，因此桥接功能将在升级时激活。验证说明详见：[https://gonka.ai/docs/network-updates/#may-7-2026](https://gonka.ai/docs/network-updates/#may-7-2026)。
2. 若您计划运行 `MiniMaxAI/MiniMax-M2.7`，请立即预先下载约 230 GB 的 FP8 权重文件。在启动窗口期间，Hugging Face 的速率限制和带宽饱和可能导致您错过首次资格检查。
3. 升级完成后，每个节点需为 **每一个** 经治理批准的模型明确声明参与模式——包括 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、`moonshotai/Kimi-K2.6` 和 `MiniMaxAI/MiniMax-M2.7`。即使只运行其中一到两个模型的节点，也必须对其他模型选择 DELEGATE（委托）或 REFUSE（拒绝）。MiniMax 的申报截止时间为 **链上纪元 `278`**。未采取行动的节点将从第 278 纪元起，对其全部权重每纪元扣除 15% 的惩罚。
4. 请计划在升级窗口期间保持在线，以便及时执行后续步骤或应对缓解指令。请确保 `.inference/data` 有足够的空闲空间用于 Cosmovisor 状态备份；如果 `application.db` 数据较大，建议在升级前应用 [清理技术](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)（参见 Cosmovisor 备份指南）。
5. v0.2.13 的校准将 Kimi K2.6 的 `WeightScaleFactor` 从 `1.26` 调整为 `0.78`，以反映 vLLM-0.20.1 发布后 Qwen-on-B200 基准的吞吐量表现。此调整 **仅影响您共识权重中来自 Kimi 的部分**；您的 Qwen 权重部分以及 Kimi 内部 PoC 分配保持不变。在 B200/B300 上，Kimi 仍是收益最高的选项；而在 H100/H200 上，MiniMax-M2.7 将成为与 Qwen 收益相当、高于 Kimi 的选项。

- 提案地址：[https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)
- 升级逻辑代码：[`upgrades.go`](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.13/inference-chain/app/upgrades/v0_2_13/upgrades.go)

## 2026年5月20日

**v0.2.13 升级提案进入治理阶段**

[v0.2.13 提案](https://github.com/gonka-ai/gonka/pull/1143) 已重新提交至链上并开放投票。这是此前未通过的提案的重新提交版本，现已包含多项更新。

- 包含内容：Kimi 权重重新校准（`0.78`）、新增模型 `MiniMaxAI/MiniMax-M2.7`、验证阈值更新、devshard 存储重构，以及多项 PoC/奖励修复。
- 在主网上激活以太坊桥接功能（详见下方专项说明）。
- 提案将升级后的宽限期延长至 3000 个区块，以便在新快照逻辑稳定期间避免对节点进行惩罚。
- 治理机制调整：将创世守护者（genesis-guardian）投票权降至约 25%，并将全链治理法定人数（quorum）设为 0.25。若守护者弃权，则非守护者需在剩余 75% 的投票权中达到约 1/3 的参与率才能满足法定人数（详见 inference-chain 部分）。
- 需要提前准备：检查桥接容器、做出 MiniMax 参与决策、更新仪表板、参与投票。
- 在提案未获批准前，链上不会发生任何变更。

提案 PR 地址：[https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)

**主要变更****模型**

- 新增 `MiniMaxAI/MiniMax-M2.7` 作为治理批准的模型及 PoC 模型。
- 更新推理验证阈值：
 
 
   - Qwen 235B：`0.940`
 
 
   - Kimi K2.6：`0.900`
 
 
   - MiniMax-M2.7：`0.922`
- 在 vLLM 0.20.1 发布后，基于 Qwen-on-B200 基准重新校准 `WeightScaleFactor` 数值：
 
 
   - Qwen 235B：`0.359`（保持不变）
 
 
   - Kimi K2.6：`0.78`（此前为 1.26，相当于相同 PoC 权重下，Kimi 每纪元共识权重下降约 38%）
 
 
   - MiniMax-M2.7：`0.3024`

参考数据：[https://docs.google.com/spreadsheets/d/1dHHlbhW1_hVgd7Q6MtmcVSOpmnl7NnynoTzPHJ1oU-g/edit?gid=0#gid=0](https://docs.google.com/spreadsheets/d/1dHHlbhW1_hVgd7Q6MtmcVSOpmnl7NnynoTzPHJ1oU-g/edit?gid=0#gid=0)

**inference-chain**

- 将 devshard 的 nonce 上限从 `20_000` 提高至 `1_000_000`。
- 将每纪元最大 devshard 数量从 `100` 提高至 `500_000`。
- 修复新模型启动期间确认 PoC 奖励的计数问题。
- 在升级纪元剩余时间内禁用确认 PoC，以确保新快照逻辑从下一纪元干净启动。
- 当参与者重新激活时，重置 `ConsecutiveInvalidInferences`。
- 为在 v0.2.12 之前加入的 DAPI 补充缺失的 `MsgRespondDealerComplaints` authz 授权。
- 修复可能导致桥接和流动性池合约调用中出现间歇性权限错误的连接问题。
- 将创世守护者的调整后投票权降至约 25%，并将全链治理法定人数设为 `0.25`。若守护者不投票，则剩余 75% 投票权中需达到约 1/3 的有效参与率（`0.25 / 0.75 = 0.334`）。
- 将 4 个早期节点和经纪方加入 `allowed_creator_addresses`。

**以太坊桥接主网激活**

- 通过升级处理器激活以太坊主网桥接设置。
- 注册以太坊桥接合约地址 `0x972a7a92d92796a98801a8818bcf91f1648f2f68`、USDC 和 USDT 代币元数据、桥接交易授权，以及 CW20 `wrapped_token` 的代码 ID `105`。
- 激活后，桥接将支持 Gonka 主网与以太坊之间的跨链转账（包括在以太坊上封装 GNK 以及桥接 USDC/USDT）。封装/解封脚本及操作流程将另行文档说明。

**decentralized-api 与 devshard**

- 默认在端口 `9400` 启用 `NodeManagerGrpcPort`。
- 为 devshard 状态添加 Postgres 支持。
- 为 SQLite 和 Postgres 的 devshard 数据库添加清理（pruning）功能。
- 添加状态快照以加快 devshard 的启动和恢复速度。
- 修复 OpenAI 兼容 API 的响应解析问题。
- 修复启动耗时过长及 devshard 失效流程中的边界情况。

**升级计划**

若提案获得通过，将通过链上升级提案自动更新二进制版本。有关升级流程的更多信息，请参阅 [/docs/upgrades.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.13/docs/upgrades.md)。

**升级前建议的准备工作**

若提案通过，建议提前完成以下准备。

**在第 278 纪元前做出 `MiniMaxAI/MiniMax-M2.7` 参与选择（届时将开始处罚）**

对于每个经治理批准的模型，多模型 PoC 要求每个节点必须明确选择参与方式（DIRECT / DELEGATE / REFUSE）。在模型 `PenaltyStartEpoch` 后未采取行动将导致处罚。建议您提前决定首选方案，以便在提案通过且主网成功升级后迅速执行。

**桥接容器更新 / 验证**

所有节点需确认其桥接容器已部署、运行最新版本并正确同步。部分节点可能已部署桥接容器，请先检查是否运行当前版本再进行操作。  
请遵循以下说明：[https://gonka.ai/docs/network-updates/#may-7-2026](https://gonka.ai/docs/network-updates/#may-7-2026)

**仪表板 / 浏览器更新（升级前后均可）**

节点需更新仪表板/浏览器。请在 `gonka/deploy/join` 目录下运行以下命令。若您尚未本地克隆 `gonka` 仓库，请先参考加入网络指南。此次仪表板更新仅为容器拉取，可在投票结束前后安全执行，不受投票结果影响。
```

docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

**如何投票**

如果你无法直接访问持有投票权的密钥，或希望由另一个密钥代为投票，请参考[指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何将冷密钥的治理投票权限授予温密钥。  
提案详情和投票可通过 `inferenced` 进行。任何活跃的节点均可使用。可用节点包括：

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai

提交你的投票（`yes`, `no`, `abstain`, `no_with_veto`）：`--unordered` 和 `--timeout-duration` 参数需要使用 v0.2.12 或更高版本的 `inferenced`。

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

- 投票截止时间：2026年5月22日 22:12:25 UTC  
- 建议升级高度：4267300  
- 预计升级时间：2026年5月26日 14:42:02 UTC  
- 运维人员时间线：投票截止于5月22日 22:12 UTC → 升级高度约在5月26日 14:42 UTC → 升级后所在epoch的剩余阶段跳过确认性PoC（≤10000个区块的宽限期） → 在start_poc前500个区块生成MiniMax引导快照（约提前43分钟） → 下一个epoch边界启动首个MiniMax PoC阶段 → 在链epoch 278开始执行MiniMax惩罚机制  

**注意事项**

- 请确保在升级窗口期间保持在线，以便及时执行任何后续步骤或应对措施。  
- 升级过程中，Cosmovisor 将在 `.inference/data` 目录中创建完整的状态备份；请确保有足够的磁盘空间（主网上 `application.db` 的 Cosmovisor 备份通常为数十GB，请提前确认）。有关安全删除 `.inference` 目录中旧备份的指导，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。  
- 如果 `application.db` 占用大量磁盘空间，可参考 cosmovisor 备份[指南](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)中的清理方法进行处理。  
- 该提案将从升级高度开始，到升级所在epoch结束（10000个区块宽限期）期间，有意跳过确认性PoC。若提案通过，此跳过行为属于预期设计，并非系统故障；新的快照逻辑将从下一个epoch开始生效。  
- 若提案通过，升级后 devshard 存储可选择使用共享的 Postgres 实例（使用与 payload 存储相同的环境变量）。本地 SQLite 仍为默认存储方式，并将自动清理（保留最近3个epoch的数据）。  
- 若提案未通过（未达到法定人数，或 `no_with_veto` 超过⅓），链上状态不会发生任何变化，升级不会执行。运维人员可能会看到 `PROPOSAL_FAILED` 状态，此为正常现象，无需操作。

## 2026年5月18日

代理容器可能将对 devshard 的并行连接数限制从按客户端限制改为全局限制

修复的PR地址：[https://github.com/gonka-ai/gonka/pull/1183](https://github.com/gonka-ai/gonka/pull/1183)

要应用此修复，请执行以下操作：

1. 在 docker-compose.yml 中设置容器版本
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

在 PoC/确认 PoC 阶段之外更新容器更为安全。要检查是否存在确认 PoC：
```

curl "https://node3.gonka.ai/v1/epochs/latest" | jq '.is_confirmation_poc_active'
```

## 2026年5月17日

**纪元 #267：PoC 验证已恢复**

在纪元 #267 中，PoC 验证已成功完成，受影响的主机已能够重新加入活跃节点集合。

纪元 #266 的问题由一次针对运行 Kimi 模型主机的攻击引发。尽管网络仍在运行，但该攻击结合若干相关条件，导致许多参与者无法进入纪元 #266。

在额外防护措施部署期间，推理服务可能暂时不可用。访问将逐步恢复，初期将通过多个社区代理和经纪节点端点提供。

**事件回顾**

在纪元 #266，网络的活跃权重出现显著下降。

该问题已追溯至使用非标准语义的推理请求。此攻击向量影响了运行 Kimi 模型的主机，并导致其中许多主机无法参与 PoC。

在纪元 #267，主机已恢复正常，PoC 验证成功完成。

**推理服务可用性**

网络将不再接受使用受影响的非标准语义的请求。

在相关防护措施部署期间，推理服务可能暂时中断。服务预计会逐步恢复，初期将通过社区代理和经纪节点端点提供访问。

**纪元 #267 中 Kimi 的权重**

由于协议的一项既有规则，Kimi 在纪元 #267 的活跃权重较低：任一模型的总权重不得超过上一纪元所有模型总权重的 75%。

由于纪元 #266 的总活跃权重显著降低，该规则也限制了 Kimi 在纪元 #267 的权重。

随着未来纪元中 PoC 参与恢复正常，权重可能需要数日才能稳定。

**主机需采取的措施**

1. 尽可能保持 API 节点在线且可访问。这有助于保留主机参与情况的可见性，并支持后续审查。
2. 监控未来纪元中的 PoC 参与情况。确保您的节点按预期进入 PoC，且活跃权重正确反映。
3. 仅使用受支持的推理请求格式。请勿发送或路由使用非标准请求语义的推理流量。
4. 预计推理服务将出现临时中断。服务不会立即在所有地方恢复，预计将通过社区代理和经纪节点端点逐步恢复。
5. 在社区频道或本帖中分享相关日志或观察结果。如果您的主机在纪元 #266 受到影响，或在后续纪元中表现异常，此操作尤为重要。

---

## 2026年5月16日

**纪元 #266：PoC 权重下降调查中**

在当前纪元（#266）期间，网络的活跃权重出现显著下降。  
目前看来，PoC 投票未能收集到本纪元所需的足够票数。确切原因尚未确认，社区正在积极调查。

**受影响参与者须知**

如果您的节点未能进入本纪元，请尽可能保持 API 节点在线且可访问。  
这将有助于补偿委员会收集 PoC 参与证据，从而更准确地核算受影响的贡献。

**调查进行中**

社区成员正在审查纪元 #266 期间发生的情况。一旦查明根本原因，将及时发布更新。  
如果您有相关的观察记录、日志、假设或其他技术背景信息，有助于调查，请在此分享。

---

## 2026年5月15日

**v0.2.13 升级提案进入治理阶段**

[v0.2.13 提案](https://github.com/gonka-ai/gonka/pull/1143) 现已上链，开放投票。

- 包含内容：Kimi 权重重新校准（`0.78`）、新增模型 `MiniMaxAI/MiniMax-M2.7`、验证阈值更新、devshard 存储重构、多项 PoC/奖励修复，以及以太坊桥主网上线。
- 提案将升级后的宽限期延长，确保主机在升级后 3000 个区块内不会受罚。
- 需准备事项：桥接容器检查、MiniMax 决策、仪表板更新、参与投票。
- 除非提案获得批准，否则链上不会发生任何变更。

提案 PR：[https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)

**主要变更****模型**

- 新增 `MiniMaxAI/MiniMax-M2.7` 作为经治理批准的模型及 PoC 模型。
- 在 vLLM 0.20.1 发布后，基于 Qwen-on-B200 参考值重新校准 `WeightScaleFactor`：
 
 
  - Qwen 235B：`0.359`
 
 
  - Kimi K2.6：`0.78`
 
 
  - MiniMax-M2.7：`0.3024`
 
 
  - 参考数据：[https://docs.google.com/spreadsheets/d/1dHHlbhW1_hVgd7Q6MtmcVSOpmnl7NnynoTzPHJ1oU-g/edit?gid=0#gid=0](https://docs.google.com/spreadsheets/d/1dHHlbhW1_hVgd7Q6MtmcVSOpmnl7NnynoTzPHJ1oU-g/edit?gid=0#gid=0)
- 更新推理验证阈值

**inference-chain**

- 将 devshard nonce 上限从 `20_000` 提高至 `1_000_000`。
- 将每纪元最大 devshard 数量从 `100` 提高至 `500_000`。
- 修复新模型启动期间确认 PoC 奖励的记账问题。
- 在整个升级纪元期间禁用确认 PoC，确保新快照逻辑从下一纪元干净启动。
- 当参与者重新激活时，重置 `ConsecutiveInvalidInferences`。
- 为在 v0.2.12 之前加入的 DAPI 补充缺失的 `MsgRespondDealerComplaints` 授权。
- 修复桥接和流动性池合约权限检查中的 Wasm keeper 访问问题。
- 将创世守护者调整后的投票权降至约 25%，并将全链治理法定人数设为 `0.25`。在守护者不投票的情况下，剩余 75% 投票权的实际法定人数为 1/3（`0.25 / 0.75 = 0.334`）。

**以太坊桥主网上线**

- 通过升级处理器激活以太坊主网桥接配置。
- 注册以太坊桥接合约地址 `0x972a7a92d92796a98801a8818bcf91f1648f2f68`、USDC 和 USDT 代币元数据、桥接交易授权，以及 CW20 `wrapped_token` 的代码 ID `105`。

**去中心化 API 与 devshard**

- 默认在端口 `9400` 上启用 `NodeManagerGrpcPort`。
- 为 devshard 状态添加 Postgres 支持。
- 为 SQLite 和 Postgres 的 devshard 数据库添加清理功能。
- 添加状态快照以实现更快的 devshard 启动和恢复。
- 修复 OpenAI 兼容 API 响应解析问题。
- 修复长时间启动行为及 devshard 失效流程中的边界情况。

**升级计划**

若提案获得批准，将通过链上升级提案更新二进制版本。有关升级流程的更多信息，请参阅 [/docs/upgrades.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.13/docs/upgrades.md)。

**升级前需准备的事项**

若提案获批，建议提前完成以下准备工作。

**在纪元 278 前完成 `MiniMaxAI/MiniMax-M2.7` 参与选择**

对于每个经治理批准的模型，多模型 PoC 要求每个主机明确选择参与方式（DIRECT / DELEGATE / REFUSE）。在模型 `PenaltyStartEpoch` 之后未采取行动将导致惩罚。现阶段应提前决定您的首选选项，以便在提案通过且主网成功升级后能迅速响应。

**桥接容器更新 / 验证**

所有主机需验证其桥接容器已部署、运行最新版本且同步正常。部分主机可能已部署桥接容器，若如此，请先确认运行的是当前版本再采取进一步操作。  
请遵循说明：[https://gonka.ai/docs/network-updates/#may-7-2026](https://gonka.ai/docs/network-updates/#may-7-2026)

**仪表板 / 浏览器更新（升级前后均可）**

主机需更新仪表板/浏览器。请在 `gonka/deploy/join` 目录下运行以下命令：
```

docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

**如何投票**

如果您无法直接访问持有投票权的密钥，或希望由另一个密钥代为投票，请参考[指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何将冷密钥的治理投票权限授予温密钥。

提案详情和投票可通过 `inferenced` 查看。可使用任意活跃节点，可用节点包括：

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

查看投票状态：
```

export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 52 -o json --node $NODE_URL/chain-rpc/
```

**截止时间**

- 投票结束时间：2026年5月17日 07:58:37 UTC  
- 建议升级高度：4133422  
- 预计升级时间：2026年5月18日 13:03:17 UTC  

**注意事项**

- 请确保在升级窗口期间保持在线，以便能够及时执行任何后续步骤或应对措施。  
- 升级期间，Cosmovisor 将在 `.inference/data` 目录中创建完整的状态备份；请确保有足够的磁盘空间。有关如何安全删除 `.inference` 目录中旧备份的指导，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。  
- 如果 `application.db` 占用了大量磁盘空间，可参考 cosmovisor 备份[指南](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)中的清理方法进行处理。  
- 若提案通过，系统将从升级高度到升级周期结束（3000个区块的宽限期）期间，**有意跳过确认 PoC**。此行为属于正常设计，并非系统故障；新的快照逻辑将从下一个周期开始生效。  
- 若提案通过，升级后 devshard 存储可选择由共享的 Postgres 实例支持（使用与 payload 存储相同的环境变量）。本地 SQLite 仍为默认选项，并将自动清理（保留最近3个周期的数据）。

## 2026年5月7日

**需要更新/验证桥接容器**

作为即将发布的 v0.2.13 版本升级准备工作的一部分（可能包含以太坊侧合约激活），所有节点运营方需确认其桥接容器已正确部署、运行最新版本并完成同步。

部分节点可能已部署桥接容器。在此情况下，请先检查是否已运行当前最新版本，再决定是否采取进一步操作。

最新桥接镜像：
```

ghcr.io/product-science/bridge:0.2.5-post5@sha256:8d2f217115c65b27fcb6fe1497471c30891534f18685bd3007d168aa7f1a9371
```

检查你的桥接程序是否已在运行正确的版本：
```

docker inspect --format='{{.Image}}' bridge \
    | xargs docker inspect --format='{{range .RepoDigests}}{{.}}{{end}}' \ grep -q 'sha256:8d2f217115c65b27fcb6fe1497471c30891534f18685bd3007d168aa7f1a9371' \ && echo "BRIDGE v0.2.5-post5 is running" || echo "WARNING: OLD BRIDGE"
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

输出应指向一个最近的已确认的以太坊区块，并且不应显著滞后。

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
| xargs docker inspect --format='{{range .RepoDigests}}{{.}}{{end}}' \ grep -q 'sha256:8d2f217115c65b27fcb6fe1497471c30891534f18685bd3007d168aa7f1a9371' \ && echo "BRIDGE v0.2.5-post5 is running" |  | echo "WARNING: OLD BRIDGE" ``` |  |
| --- | --- | --- | --- |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
如果桥接服务同步失败，可能是以太坊检查点同步端点不可用。在这种情况下，请更新 `BEACON_STATE_URL` 并重启桥接服务：
 
```
 sudo sed -i 's |
 - BEACON_STATE_URL=.
* |
| --- | --- | --- | --- |
| xargs docker inspect --format='{{range .RepoDigests}}{{.}}{{end}}' \ grep -q 'sha256:8d2f217115c65b27fcb6fe1497471c30891534f18685bd3007d168aa7f1a9371' \ && echo "BRIDGE v0.2.5-post5 is running" | 11.8 |  |  |
| A100-SXM4-80GB | 132.2 |  |  |
| H100 80GB HBM3 |
 - BEACON_STATE_URL=.
* |  |  |
| H100 PCIe |
 - BEACON_STATE_URL=https://beaconstate.info/ |  |  |
| H200 | ' docker-compose.yml |  |  |
source config.env && docker compose up bridge -d --force-recreate --no-deps
```

在更新或重启桥接服务后，请按照上述说明验证其是否已同步。

## 2026年5月6日

**v0.2.13 版本升级的 PR 审查**

下一版本链上软件升级 v0.2.13 的[拉取请求](https://github.com/gonka-ai/gonka/pull/1143)现已开放审查。

请直接审查 PR 中的代码，并对发现的问题、疑问、改进建议、边界情况或潜在漏洞留下评论。

在下一轮升级周期中，有意义的审查贡献（包括重要评论、漏洞发现和安全问题）可能有资格获得社区奖励。

本次为**仅针对拉取请求的审查呼吁**，不启动正式投票。治理投票流程将在审查期结束后开始，预计为明天。

**主要变更****inference-chain**

- 确认 PoC（CPoC）此前对“测量权重”、“保留权重”和“奖励重缩放”使用了不同的模型集合。在新模型引导期间，这可能导致服务了合规与非合规模型的诚实矿工被惩罚。修复方案是：存储一个确认模型及其权重缩放因子的单个纪元快照，并在所有确认和奖励权重计算中使用该快照。
- 当参与者重新变为 ACTIVE 状态时，`ConsecutiveInvalidInferences` 计数器未被重置，导致一次新的错误推理即可立即再次使其失效。现在在重新激活和即将晋升时会重置该计数器。
- 在 v0.2.12 之前加入的 DAPI 节点，其冷启动到热启动的授权中缺少 `MsgRespondDealerComplaints` 权限。本次升级将补全该权限，使其能够响应经销商投诉。
- Devshard 结算使用了硬编码的 `20_000` 随机数限制。该限制现改为 `DevshardEscrowParams.MaxNonce`，v0.2.13 升级将其设置为 `1_000_000`。同时将 `MaxEscrowsPerEpoch` 提升至 `500_000`。
- 本次升级为当前纪元安装一个带有扩展 `UpgradeProtectionWindow`（3000 个区块）的宽限期条目。从升级高度到升级纪元结束期间，跳过确认 PoC 触发条件，确保新的快照逻辑从下一个纪元才开始运行。复用了 v0.2.10 中的宽限期机制。
- Wasm keeper 的访问权限在应用布线完成后才解析，以确保桥接和流动性池操作中的合约权限检查正常工作。

**decentralized-api**

- 某些兼容 OpenAI 的上游服务返回的是数值型的 `stop_reason` 值。现在 `Choice.StopReason` 支持任意 JSON 类型，因此这些响应不再因反序列化失败而报错。
- 内部 devshard 存储迁移不再阻塞 dapi 启动。devshard 路由将在迁移和恢复完成前保持不可用。

**devshard**

- 此前由于旧的托管数据一直保留在 SQLite 存储中，导致 devshard 存储可能无限增长。现改为按纪元划分存储，并在后台自动清理旧纪元数据，仅保留最近 3 个纪元。
- 为支持更大规模部署，devshard 现在支持使用 Postgres 作为主存储，SQLite 仍作为本地备用存储。
- Postgres 数据按 `epoch_id` 对会话、差异和签名进行分区，便于清理时直接删除旧纪元数据。
- 状态快照减少了长时间运行会话的恢复工作量。
- 载荷查询固定绑定到托管纪元，并对纪元边界及旧版纪元 0 请求提供回退支持。
- 当前纪元的分片统计信息暴露了 nonce、版本、组别以及每主机计数器。

**bridge**

- 桥接工具现在支持 Sepolia 标志，并能将 Gonka 的 BLS 密钥/签名转换为以太坊合约所期望的 EIP-2537 格式。
- 新增用于 GNK 和封装代币桥接操作的脚本。

审查者可通过以下链接查看完整的升级提案、迁移细节、测试摘要及建议流程：

- [https://github.com/gonka-ai/gonka/blob/347d947596aba754e453e58d5f82ae6054233a9a/proposals/governance-artifacts/update-v0.2.13/README.md](https://github.com/gonka-ai/gonka/blob/347d947596aba754e453e58d5f82ae6054233a9a/proposals/governance-artifacts/update-v0.2.13/README.md)

- [https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)

## 2026年5月6日

在 api 容器版本 v0.2.11、v0.2.12 和 v0.2.12-api-post2 中发现了一个潜在问题：容器重启后，9100、9200 和 9400 端口上的服务器可能启动延迟较长，导致 api 激活延迟，部分矿工因此跳过了 Confirmation PoC。

修复方案通过并行加载 devshard 并从快照中恢复现有 devshard 会话，消除了该阻塞问题。

[https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)

请更新 api 容器的二进制文件。由于每次 PoC 开始前都有一个 500 个区块的无 CPoC 窗口（`confirmation_poc_safety_window`），这可能是部署最安全的版本。

在更新前，请确保没有正在进行的 CPoC 或 PoC。

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

部署完成后，请务必检查 9100 和 9200 端口上的服务器是否正在运行：
```

curl http://localhost:9200/admin/v1/nodes
 # may not be bound to localhost
```

```

curl http://localhost:9100/versions
 # may not be bound to localhost
```

## 2026年5月6日

在上一个周期中，发现了解析 Kimi-K2.6 某些响应时存在一个次要错误。

修复：[https://github.com/gonka-ai/gonka/pull/1143/changes#diff-4c44fd18f746bca1c63d9bcbb9a73f06bc0172bfb8a33152854920d4dffff0e8](https://github.com/gonka-ai/gonka/pull/1143/changes#diff-4c44fd18f746bca1c63d9bcbb9a73f06bc0172bfb8a33152854920d4dffff0e8)

我们建议替换 api 容器的二进制文件。除了该修复外，新版本还为 devshard 数据库启用了修剪功能，并为 devshard 状态添加了对 Postgres 的支持。

部署方式：
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

此外，如果你使用 MLNode 托管了 Kimi-K2.6，请在部署参数中添加参数 "--enable-auto-tool-choice"。为此，你可以重复执行命令（以 B200 为例）：
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
             "--enable-auto-tool-choice",
  #  new parameter
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

然后使用 `docker restart join-mlnode-308-1` 重启 MLNode 容器。

当 PoC / 确认 PoC 无法正常进行时，应执行上述操作。

## 2026年5月5日

在 Kimi-K2.6 引导过程中观察到，30% 的最低直接参与门槛在实践中难以达到。为避免 Kimi-K2.6 在未来纪元中失去资格，并进一步简化模型的接入流程，提议将该门槛降低至 10%。

安全模型保持不变：PoC 验证机制本身未作更改，仍然需要绝大多数验证算力才能接受结果。

该提案将加快执行，以便在下一次 PoC 前生效。投票将持续 12 小时。

参与投票（`yes`, `no`, `abstain`, `no_with_veto`）：
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

**投票截止时间**：2026-05-05 19:00:54 UTC

## 2026年5月4日

**Kimi K2.6 已在 Gonka 网络上线运行**

`moonshotai/Kimi-K2.6` 已通过引导阶段，并加入 Gonka 网络的 PoC 参与。

该流程由全网多个节点协调完成：基础设施已准备就绪，意图已提交，委托与拒绝设置已完成，部署也已测试通过。

对于多模型 PoC 而言，这意味着 Kimi 现在作为独立的模型组拥有自己的参与记录和奖励追踪机制。

运行 Kimi 模型的节点运营者应继续像往常一样监控其 MLNode 及 PoC 参与状态。

## 2026年5月4日

**需要采取行动：已提交 PoCIntent 的节点运营者请部署 `Kimi K2.6`**

今日对 `moonshotai/Kimi-K2.6` 的预评估检查已通过。

已提交 PoCIntent 的节点运营者需在区块 `3874496` PoC 开始前，将至少一个 MLNode 从 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 切换至 `moonshotai/Kimi-K2.6`。

预评估与 PoC 开始之间有 500 个区块的窗口期。在此期间无 CPoC 任务，因此已声明意图的节点可安全地将其模型节点切换至 `Kimi K2.6`。

请遵循以下指南完成必要的部署步骤：[https://gonka.ai/docs/host/kimi-bootstrap/](https://gonka.ai/docs/host/kimi-bootstrap/)

## 2026年5月4日

中转代理 `node1`、`node2` 和 `node3` 已被禁用。所有主网推理请求现将通过 `node4` 进行路由，该代理采用基于 `devshard` 的新型计费机制。

这标志着 `devshard` 已正式上线并具备生产就绪能力。建议后续使用 `node4` 作为公共网关。

**需要采取行动**：请将您的终端节点更新为 `node4`。

## 2026年5月2日

今日的预资格验证未通过，对于 `PoCIntent` 小于 30% 的节点，权重极低。请保持您的 MLNode 运行 `Qwen235B`，并在明日提交下一周期的参与意图。

## 2026年4月30日

**升级已执行：v0.2.12 现已在主网上线**

关于升级提案 v0.2.12 的链上治理投票已结束。该提案已获得**批准**，升级已在主网上成功执行。

**当前生效的主要变更**

- **多模型 PoC（最大变更）** ([#1039](https://github.com/gonka-ai/gonka/pull/1039))。将计算证明（Proof of Compute）从单一固定模型转变为按模型分组的 PoC 机制。每个经治理批准的模型生成其独立的本地 PoC 权重，并通过模型特定系数聚合为总共识权重。每个节点必须参与每个模型组（可直接参与或委托其 PoC 投票权重）。
- **引入 `moonshotai/Kimi-K2.6` 作为第二个模型**：该模型组将在升级后两个周期激活。其系数为 Qwen235B 模型系数的 3.51 倍，基于相同硬件（8xH200，8xB200）上的模型计算复杂度确定。
- **Devshard 独立运行时** ([#1045](https://github.com/gonka-ai/gonka/pull/1045))：将 devshard 的发布周期与 DAPI / 主网发布周期解耦。
- **Certik 审计修复** ([#1020](https://github.com/gonka-ai/gonka/pull/1020), [#1021](https://github.com/gonka-ai/gonka/pull/1021), [#1022](https://github.com/gonka-ai/gonka/pull/1022), [#987](https://github.com/gonka-ai/gonka/pull/987), [#949](https://github.com/gonka-ai/gonka/pull/949), [#988](https://github.com/gonka-ai/gonka/pull/988), [#825](https://github.com/gonka-ai/gonka/pull/825), [#1011](https://github.com/gonka-ai/gonka/pull/1011), [#1029](https://github.com/gonka-ai/gonka/pull/1029), [#789](https://github.com/gonka-ai/gonka/pull/789))：已修复所有审计发现的问题。
- **协议强化**：保留节点（`POC_SLOT=true`）将被随机抽样用于单次 PoC / CPoC 时间。其他更新包括将 `mlnode` 版本传播至链上 `HardwareNode`、修复 DKG 经销商共识、对齐旧版验证者惩罚机制与抵押要求语义、确保 devshard 托管资金的原子性，以及在 `inference_finished` 事件解析中增加零时间戳容错。

**对节点运营者的建议**

- 部署、委托或明确拒绝新治理批准的模型（该模型将在升级后两个周期激活）。请参考[操作指南](https://gonka.ai/docs/host/multi_model_poc/)。

- 节点运营者需更新仪表盘/浏览器。请在 `gonka/deploy/join` 目录下运行以下命令：

```

docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

- 二进制版本：通过链上升级流程进行更新。

- 迁移：测试和迁移详细信息记录在 [v0.2.12 文档中](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/docs/upgrades.md)。

有关这些变更的更多细节，请参见治理相关文件：[https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.12/proposals/](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.12/proposals/)

## 2026年4月29日

**升级 v0.2.12：预下载二进制文件**

v0.2.12 升级提案的链上治理流程即将结束。

- 投票截止时间：2026年4月30日 00:12 UTC  
- 升级区块高度：3834200  
- 预计升级时间：2026年4月30日 上午6:00 UTC  

建议节点运营方查阅 [GitHub 上的提案](https://github.com/gonka-ai/gonka/pull/948) 并参与投票。

建议提前预下载二进制文件，以避免在升级期间依赖 GitHub 的可用性。

```

#
 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.12/bin \
              .inference/cosmovisor/upgrades/v0.2.12/bin && \

#
 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.12/decentralized-api-amd64.zip" && \
echo "d0143a95e12e1ada06cfea5e4d3deab13534c3523c967e9a6b87ac9f9bf3247d decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.12/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.12/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

#
 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.12/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.12/inferenced-amd64.zip" && \
echo "df7656503d39f6703767d32d5578d1291e32cb114844d8c1cd0f134d1bf4babd inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.12/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.12/bin/inferenced && \
echo "Inference Installed and Verified" && \

#
 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--
- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.12/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.12/bin/inferenced && \
echo "94ce943338d12844028e84fe770106c9d28d866cf0af99f27da30f56d69efa34 .dapi/cosmovisor/upgrades/v0.2.12/bin/decentralized-api" | sudo sha256sum --check && \
echo "642eb9858cd77d182f3e1c4d44553f5379d615983430e1fd8e85f09632af4271 .inference/cosmovisor/upgrades/v0.2.12/bin/inferenced" | sudo sha256sum --check
```

## 2026年4月28日

**升级 v0.2.12：升级前模型清理**

v0.2.12 升级提案目前已进入链上投票期的中途阶段。

- 投票截止时间：2026年4月30日 00:12 UTC  
- 升级区块高度：3834200  
- 预计升级时间：2026年4月30日 上午6:00 UTC  

建议节点运营者在 [GitHub](https://github.com/gonka-ai/gonka/pull/948) 上查看该提案并参与投票。

**升级前需采取的行动**

随着网络逐渐接近升级窗口期，节点运营者应提前准备节点，以防提案通过。

此清理过程**必须在升级发生前完成**。如果在升级时，您的节点配置中包含不受支持的模型，**该节点将被拒绝并下线**。

v0.2.12 版本将移除所有不在升级后批准列表中的治理模型。在主网上，仅保留此前已强制执行的模型和 Kimi 模型。

每个 DAPI 会在本地持久化存储其 MLNode 配置。启动时，系统会将每个已配置的模型与链上治理列表进行校验。如果配置中包含至少一个不受支持的模型，整个节点将被拒绝，导致主机下线。

v0.2.11 版本通过仅保留强制模型来屏蔽此问题，因此 `/admin/v1/nodes` 显示正常，即使持久化配置中仍包含多余模型。而 v0.2.12 将停止这种裁剪行为，改为直接加载持久化配置。

为解决此问题，以下脚本会查找 `/admin/v1/config` 中包含多余模型的每个节点，并向 `PUT` 发送一个 `/admin/v1/nodes/<id>` 请求，提交清理后的配置。这些更改将在60秒内完成持久化。保留下来的模型的参数、硬件和端口将完全保持不变。对于未列出强制模型的节点，脚本将跳过处理，需手动修复。

请将以下脚本粘贴到主机的命令行中执行。默认情况下，脚本将直接应用更改。若要预览更改内容而不实际执行，请将 `APPLY=dry` 设置为任意非 `--apply` 的值。

仓库中的脚本地址：

- [Bash](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/proposals/governance-artifacts/update-v0.2.12/cleanup/cleanup_models.sh)  
- [Python](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/proposals/governance-artifacts/update-v0.2.12/cleanup/cleanup_models.py)

```bash
ADMIN=${ADMIN:-http://127.0.0.1:9200}
KEEP=${KEEP:-Qwen/Qwen3-235B-A22B-Instruct-2507-FP8}
APPLY=${APPLY:-"--apply"}

curl -sS "$ADMIN/admin/v1/config" | jq -r --arg k "$KEEP" '
  .nodes[] | "\(.id): "
 + (
    if (.models | has($k) | not) then "skip (\(.models | keys))"
    elif (.models | length) == 1 then "ok"
    else "\(.models | keys) -> [\($k)]" end)'

if [[ "$APPLY" == "--apply" ]]; then
  curl -sS "$ADMIN/admin/v1/config" \
| jq -c --arg k "$KEEP" \ '.nodes[] | select((.models | has($k)) and (.models | length > 1)) |
| --- | --- | --- | --- |
| jq -c --arg k "$KEEP" \ '.nodes[] | select((.models |  |  |
| A100-SXM4-80GB | has($k)) and (.models |  |  |
| B200 | length > 1)) |  |  |
| H100 80GB HBM3 | .models = {($k): .models[$k]}' \ while IFS= read -r p; do id=$(jq -r .id <<<"$p") curl -sS -f -X PUT -H 'Content-Type: application/json' -d "$p" \ "$ADMIN/admin/v1/nodes/$id" >/dev/null && echo "$id: updated" done echo "done; persisted within 60s" else echo "preview only; rerun without APPLY=dry to commit" fi
 ```

|  |  |
| H100 PCIe | 307.03 |  |  |
| H200 | 512.38 |  |  |
运行脚本后等待 60 秒，以确保更改已持久化，然后再触发升级。然后，验证配置：

```bash
curl -sS http://127.0.0.1:9200/admin/v1/config \
| jq '.nodes[] | {id, models: (.models | keys)}' |  |
| --- | --- | --- | --- |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
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

*(后续节点将遵循相同格式)
*

## 2026年4月27日

**v0.2.12 升级提案进入治理阶段**

下一版链上软件 v0.2.12 的[升级提案](https://github.com/gonka-ai/gonka/pull/948)现已发布上链，进入投票阶段。

**主要变更**

- **多模型 PoC（最大变更）** ([#1039](https://github.com/gonka-ai/gonka/pull/1039))。将计算量证明（Proof of Compute）从单一固定模型转变为按模型划分的 PoC 组。每个经治理批准的模型生成其自身的局部 PoC 权重，再通过模型特定的系数聚合为总共识权重。每个节点必须参与每个模型组（可直接参与或通过委托 PoC 投票权重）。
- **引入 `moonshotai/Kimi-K2.6` 作为第二个模型**：该模型组将在升级后两个 epoch 激活。其系数为 Qwen235B 模型系数的 3.51 倍，依据是在相同硬件（8xH200，8xB200）上模型的计算复杂度确定。
- **Devshard 独立运行时** ([#1045](https://github.com/gonka-ai/gonka/pull/1045))。将 devshard 的发布与 DAPI / 主网发布周期解耦。
- **Certik 审计问题修复** ([#1020](https://github.com/gonka-ai/gonka/pull/1020), [#1021](https://github.com/gonka-ai/gonka/pull/1021), [#1022](https://github.com/gonka-ai/gonka/pull/1022), [#987](https://github.com/gonka-ai/gonka/pull/987), [#949](https://github.com/gonka-ai/gonka/pull/949), [#988](https://github.com/gonka-ai/gonka/pull/988), [#825](https://github.com/gonka-ai/gonka/pull/825), [#1011](https://github.com/gonka-ai/gonka/pull/1011), [#1029](https://github.com/gonka-ai/gonka/pull/1029), [#789](https://github.com/gonka-ai/gonka/pull/789))。已修复所有审计中发现的问题。
- **协议强化**。保留节点（`POC_SLOT=true`）将被随机抽样执行单次 PoC / CPoC。其他更新包括：将 `mlnode` 版本传播至链上 `HardwareNode`，修复 DKG dealer 共识机制，使旧版验证者惩罚机制与抵押要求语义保持一致，确保 devshard 托管资金操作的原子性，并在 `inference_finished` 事件解析中增加零时间戳容错处理。

**升级计划**

二进制版本将通过链上升级提案进行更新。有关升级流程的更多信息，请参阅 [/docs/upgrades.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/docs/upgrades.md)。

**需执行的操作****升级前**

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

请部署、委派或明确拒绝新通过治理批准的模型（包含的模型将在升级后 2 个周期激活）。请参考[指南](https://gonka.ai/docs/host/multi_model_poc/)。

**升级前或升级后**

要求节点运行者更新仪表板/浏览器。请在 `gonka/deploy/join` 目录下运行以下命令：
```

docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

**如何投票**

如果您无法直接访问持有投票权的密钥，或希望由另一个密钥代为投票，请参阅[相关指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何将冷密钥的治理投票权限授予温密钥。

提案详情和投票可通过 `inferenced` 进行。任何活跃的节点均可使用。可用节点包括：

- [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
- [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
- [https://node3.gonka.ai](https://node3.gonka.ai)

进行投票（`yes`, `no`, `abstain`, `no_with_veto`）：
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

**截止时间**

- 投票结束时间：2026年4月30日，00:12 UTC  
- 升级高度：3834200  
- 预计升级时间：2026年4月30日，06:00 UTC  

**注意事项**

- 请计划在升级窗口期间保持在线，以便及时执行任何后续步骤或缓解指令。  
- 升级期间，Cosmovisor 会在 `.inference/data` 目录中创建完整的状态备份；请确保有足够的磁盘空间。有关安全删除 `.inference` 目录中旧备份的指导，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。  
- 如果 `application.db` 占用了大量磁盘空间，可参考 cosmovisor 备份[指南](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)中描述的清理方法。  
- 升级后，Postgres 将可作为本地负载存储的选项。

## 2025年4月15日

**v0.2.12 版本升级的 PR 审查**

下一个链上软件升级 v0.2.12 的[拉取请求](https://github.com/gonka-ai/gonka/pull/948)现已开放审查。

请直接审查 PR 代码，并就您发现的任何问题、疑问、改进建议、边界情况或安全漏洞留下评论。

有意义的审查贡献，包括重要评论、缺陷发现和安全问题，在下一次升级周期中可能有资格获得社区赏金。

本次为 PR 审查呼吁，**不启动正式投票**。治理投票流程将在审查期结束后开始。

**主要变更**

- **多模型 PoC 概念验证（最大变更）** ([#1039](https://github.com/gonka-ai/gonka/pull/1039))：将计算证明（PoC）从单一固定模型迁移至按模型划分的 PoC 组。每个经治理批准的模型生成其自身的本地 PoC 权重，再通过特定模型系数聚合为总共识权重。  
- **共识层交易费用及自动迁移** ([#937](https://github.com/gonka-ai/gonka/pull/937), [#981](https://github.com/gonka-ai/gonka/pull/981))：引入由治理控制的 gas 价格。协议职责消息（PoC、验证、推理、BLS DKG）通过 `NetworkDutyFeeBypassDecorator` 免除费用。`MsgPoCV2StoreCommit` 实施两部分费用（基础验证
 
+ 线性计数），作为主要的 Sybil 防御机制。详见 [docs/host_onboarding.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/docs/host_onboarding.md)。  
- **Devshard 独立运行时** ([#1045](https://github.com/gonka-ai/gonka/pull/1045))：将 devshard 发布与 DAPI / 主网发布周期解耦。  
- **Certik 审计修复** ([#1020](https://github.com/gonka-ai/gonka/pull/1020), [#1021](https://github.com/gonka-ai/gonka/pull/1021), [#1022](https://github.com/gonka-ai/gonka/pull/1022), [#987](https://github.com/gonka-ai/gonka/pull/987), [#949](https://github.com/gonka-ai/gonka/pull/949), [#988](https://github.com/gonka-ai/gonka/pull/988), [#825](https://github.com/gonka-ai/gonka/pull/825), [#1011](https://github.com/gonka-ai/gonka/pull/1011), [#1029](https://github.com/gonka-ai/gonka/pull/1029), [#789](https://github.com/gonka-ai/gonka/pull/789))：所有已知审计问题均已修复。  
- **协议强化**：实现更强的 PoC v2 随机数生成器（完整 256 位熵，此前为 32 位），将通过单独的治理投票激活。其他更新包括将 `mlnode` 版本传播到链上 `HardwareNode`、修复 DKG 经销商共识、对齐传统验证者惩罚机制与抵押要求语义、确保 devshard 托管资金的原子性，以及在 `inference_finished` 事件解析中添加零时间戳容差。

**升级计划**

二进制版本将通过链上升级提案进行更新。有关升级流程的更多信息，请参阅 [/docs/upgrades.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/docs/upgrades.md)。

**升级后需执行的操作**

现有节点运营者（Hosts）：

- 确保冷账户持有足够代币（例如 100 GNK），以覆盖自动授予的费用额度限制。  
- 在治理批准新模型后，为每个治理批准的模型执行部署、委托或明确拒绝操作（包含的模型将在升级后 3 个周期激活）。  
- 从 `docker-compose.yml` 部署 `versiond` 服务（使用主分支的最新提交）。  
- 使用新版本和参数重新创建 `proxy` 容器。具体命令将在文档中提供。

## 2026年4月1日

ML 节点 `3.0.12-post6` 已发布

新版本 mlnode 现已可用：`ghcr.io/gonka-ai/mlnode:3.0.12-post6`

- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post6  
- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post6-blackwell  
- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post6-blackwell-sm120  

该版本现已成为主分支的默认版本：[https://github.com/gonka-ai/gonka/commit/ec8f45573149ce5686e8e5fc29f1a8f49a295689](https://github.com/gonka-ai/gonka/commit/ec8f45573149ce5686e8e5fc29f1a8f49a295689)

**变更内容**

此版本已在最近几个周期被部分矿工使用。  
初步观察表明，对于在 PoC 开始阶段运行的节点，稳定性有所提升。  

本次更新修复了 PoC 开始阶段的一个边界情况，该问题此前在特定条件下可能导致性能下降。  

vLLM 完整变更日志：[https://github.com/gonka-ai/vllm/compare/release/v0.9.1-pocv2-post5...release/v0.9.1-pocv2-post6](https://github.com/gonka-ai/vllm/compare/release/v0.9.1-pocv2-post5...release/v0.9.1-pocv2-post6)

**建议**

- 建议升级至该版本  
- 该版本与之前版本完全兼容

## 2026年3月20日

**升级已完成：v0.2.11 现已在主网上线**

v0.2.11 升级提案的链上治理投票已结束。提案已**通过**，升级已在主网上成功执行。

**当前生效的主要变更****[初始扩展架构：基于 `devshards` 的推理会话](https://github.com/gonka-ai/gonka/pull/877)**

本次升级引入了基于 `devshards` 的推理会话初始版本，旨在提升推理可扩展性。

**[`StartInference` 与 `FinishInference` 性能优化](https://github.com/gonka-ai/gonka/pull/812)**

这些性能优化可使每区块推理量提升高达 100 倍，具体提升程度取决于工作负载和网络状况。  
更多变更详情请见：[https://github.com/gonka-ai/gonka/pull/813](https://github.com/gonka-ai/gonka/pull/813)

**对节点运营者的建议**

- **二进制版本**：已通过链上升级流程更新。  
- **迁移**：测试与迁移详情记录在 [v0.2.11 文档](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.11/docs/upgrades.md) 中。

更多变更详情请参阅治理提案文件：[https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.11/proposals/](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.11/proposals/)

## 2026年3月19日

**v0.2.11 升级：预下载二进制文件**

v0.2.11 升级提案的链上治理流程即将结束。

- 投票结束时间：2026年3月20日，05:59:52 UTC  
- 升级高度：3186100  
- 预计升级时间：2026年3月20日，14:30 UTC  

建议节点运营者在 [GitHub](https://github.com/gonka-ai/gonka/pull/813) 上审查提案并参与投票。  
建议提前预下载二进制文件，以避免升级窗口期间依赖 GitHub 的可用性。

```

#
 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.11/bin \
              .inference/cosmovisor/upgrades/v0.2.11/bin && \

#
 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.11/decentralized-api-amd64.zip" && \
echo "e574c3d86189daf325cc7008603ee8e952efb028afda5bcd4a154dcd334192d4 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.11/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.11/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

#
 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.11/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.11/inferenced-amd64.zip" && \
echo "c77528bd2e31e86355a6eefddb50e0db7f9600ebf2940ca440a61ea36e7ef7ca inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.11/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.11/bin/inferenced && \
echo "Inference Installed and Verified" && \

#
 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--
- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.11/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.11/bin/inferenced && \
echo "8b99e550ddd117a0cb4293b4ae74e0e5dff961a1986f23b58ec7ae6c3f0478f1 .dapi/cosmovisor/upgrades/v0.2.11/bin/decentralized-api" | sudo sha256sum --check && \
echo "6cf186a75782da07156d4d03b4266cefcb36656de89e4a378ae96d8df89ad003 .inference/cosmovisor/upgrades/v0.2.11/bin/inferenced" | sudo sha256sum --check
```

## 2026年3月18日

**v0.2.11 升级提案进入治理阶段**

下一次链上软件版本 v0.2.11 的升级提案现已发布至链上，进入投票阶段。若提案获得通过，将引入基于 `devshards` 的推理会话初始版本，以提升推理可扩展性，并显著优化 `Start`/`FinishInference` 的性能。

**主要变更****[初步扩展架构：基于 `devshards` 的推理会话](https://github.com/gonka-ai/gonka/pull/877)**

本次升级引入了基于 `devshards` 的推理会话初始版本，旨在提升推理的可扩展性。

目前，通过每次推理发起一次链上交易的方式处理推理请求，限制了系统吞吐量。新设计将推理的执行与验证转移至指定的链下子组中进行，而链上仅负责会话的创建与最终结算。

此版本为该架构的早期且功能受限的实现。之所以将其提交至主网进行审查和有限生产环境测试，并非因其已完全成熟，而是因为此类系统需要尽早暴露在真实网络环境中。某些类型的问题仅通过本地测试难以发现。当前实现已设计为不会对矿工奖励造成负面影响。

**[对 `StartInference` 和 `FinishInference` 的性能优化](https://github.com/gonka-ai/gonka/pull/812)**

- 减少 `MsgStartInference` 和 `MsgFinishInference` 的非必要状态写入及查询开销。
- 简化统计信息处理流程，降低推理生命周期中的计算负担，提升区块执行的稳定性。

在类似主网的条件下，该优化还可使每区块容纳的推理任务数量提升至原来的最多100倍，具体提升幅度取决于工作负载及网络状况。

有关上述及其他变更的更多细节，请参见：[https://github.com/gonka-ai/gonka/pull/813](https://github.com/gonka-ai/gonka/pull/813)

**升级前建议操作****`application.db` 数据修剪**

强烈建议节点运营方在升级前按照指引完成对 `application.db` 的数据修剪。

提前执行此操作至关重要。若大量节点将修剪操作推迟至升级之后，可能导致全网节点几乎同时开始修剪，从而造成可避免的运行压力。

修剪操作指南详见：[https://gonka.ai/FAQ/#__tabbed_7_4](https://gonka.ai/FAQ/#__tabbed_7_4)

**浏览器（Explorer）更新**

节点运营方需更新仪表盘/浏览器组件。请在 `gonka/deploy/join` 目录下执行以下命令：
```

docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

**如何投票**

如果您无法直接访问持有投票权的密钥，或希望由另一个密钥代为投票，请参阅[相关指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何将冷密钥的治理投票权限授予温密钥。

提案详情和投票可通过 `inferenced` 进行。任何活跃节点均可使用。可用节点包括：

- [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
- [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
- [https://node3.gonka.ai](https://node3.gonka.ai)

进行投票（`yes`, `no`, `abstain`, `no_with_veto`）：

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

- 投票结束时间：2026年3月20日 05:59:52 UTC  
- 升级高度：3186100  
- 预计升级时间：2026年3月20日 14:30 UTC  

**注意事项**

- 请确保在升级窗口期间保持在线，以便及时执行任何后续步骤或应对措施。  
- 升级期间，Cosmovisor 将在 `.inference/data` 目录中创建完整的状态备份，请确保有足够的磁盘空间。有关如何安全删除 `.inference` 目录中旧备份的指导，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。  
- 如果 `application.db` 占用了大量磁盘空间，可参考[此处](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)提供的清理方法进行处理。  
- 升级后，Postgres 将可作为本地负载存储的可选方案。

## 2026年3月17日

**v0.2.11 版本升级的 PR 审查**

下一次链上软件升级 v0.2.11 的[拉取请求](https://github.com/gonka-ai/gonka/pull/813)现已开放审查。欢迎提供反馈和改进建议。

对本次 PR 审查作出有意义贡献的参与者，可能在下次升级中获得奖励。

本次为 PR 审查呼吁，**并非**正式投票的开始。治理投票流程将在审查期结束后启动。

**主要变更**

[初步扩展架构：基于 `devshards` 的推理会话](https://github.com/gonka-ai/gonka/pull/877)

本次升级引入了基于 `devshards` 的推理会话的初始版本，旨在提升推理的可扩展性。

目前，通过每次推理上链交易的方式处理推理请求，限制了系统吞吐量。新设计将推理执行与验证移至指定的链下子组，而区块链仅负责会话创建和最终结算。

此版本为该设计的早期且受限实现。之所以将其提交至主网进行审查和有限生产测试，并非因其已完全成熟，而是因为此类系统需尽早暴露于真实网络环境中。某些问题仅通过本地测试难以发现。当前实现已设计为不会对矿工奖励造成负面影响。

[`StartInference` 与 `FinishInference` 性能优化](https://github.com/gonka-ai/gonka/pull/812)

- 减少 `MsgStartInference` 和 `MsgFinishInference` 的非必要状态写入和查询开销。  
- 简化统计处理逻辑，降低推理生命周期中的计算负担，提升区块执行稳定性。

在类似主网的条件下，该优化还可使每区块容纳的推理请求数量提升至多 100 倍，具体取决于工作负载和网络状况。

**升级前建议操作****`application.db` 数据修剪**

强烈建议节点运营者在升级前按照指引完成 `application.db` 的修剪工作。  
提前执行此操作至关重要。若大量节点在升级后才开始修剪，可能导致全网几乎同时进行修剪操作，造成不必要的运维压力。  
修剪操作说明详见[此处](https://gonka.ai/FAQ/#__tabbed_7_4)。

**浏览器（Explorer）更新**

节点运营者需更新仪表盘/浏览器。请在 `gonka/deploy/join` 目录下运行以下命令：
```

docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

评审人员可以[在此处](https://github.com/gonka-ai/gonka/pull/813)查看完整的升级提案、迁移详情、测试摘要以及建议的流程。

## 2026年3月16日

**API 二进制文件 `v0.2.10-post7` 已可用**

已在 `v0.2.10` 中发现一个潜在漏洞。为降低当前预升级阶段的风险，建议在下一轮 PoC 开始前将 API 二进制文件升级至 `v0.2.10-post7`。

完整变更内容：[https://github.com/gonka-ai/gonka/compare/main…release/v0.2.10-post7](https://github.com/gonka-ai/gonka/compare/main…release/v0.2.10-post7)

应用更新：
```

# Pre-check: Ensure no confirmation PoC is active (fails entire script if not false)
echo "--
- Pre-flight Check: Confirmation PoC Status ---" && \
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
echo "--
- Final Verification ---" && \
sudo rm -rf .dapi/cosmovisor/current && \
sudo ln -sf upgrades/v0.2.10-post7 .dapi/cosmovisor/current && \
echo "313df0747e090518ac052918ad23f9d6e70bb60dede2013375e322c23605f3e0  .dapi/cosmovisor/current/bin/decentralized-api" | sudo sha256sum --check && \
# Restart 
source config.env && docker compose up api --no-deps --force-recreate -d
```

## 2026年3月11日

**工具调用**

现在可通过标准的函数调用模式使用[工具调用](https://gonka.ai/developer/quickstart/#4-tool-calling)（`type: “function”`）。

集成流程非常简单：

- 开发者定义函数
- 当请求匹配时，模型返回结构化的调用参数
- 执行由应用程序端处理。

对于已经使用代理层的团队，这可能是一个简化技术栈并转而依赖原生行为的好机会。实际上，这将带来更清晰的集成模式和更轻松的维护。

## 2026年3月6日

**提醒：v0.2.11 升级预计将于下周初进入审查和治理投票阶段。**

请密切关注并计划参与投票。投票是支持网络发展并确保升级符合参与者实际需求的最简单方式之一。  
如果您无法访问持有投票权的冷钱包密钥，建议提前安排投票委托。请联系该密钥的所有者，请求其授权您代为投票。若无此授权，无法从其他账户提交投票。

在此设置中：

- 授权方（Granter）= 拥有投票权的账户（冷密钥）
- 被授权方（Grantee）= 代表授权方提交投票的账户（热密钥）

被授权方仍可为自己账户的投票权进行投票。授权方可随时撤销此权限。

以下是授权、检查、使用和撤销投票委托的复制粘贴命令。

1) 授予投票权限（由授权方密钥执行）
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
    
3) 使用受赠者进行投票
=== "命令"
 
 
 
 
```
 
   # Find the proposal ID which you are voting for
 - use it as <VOTE_PROPOSAL_ID> in the voting body 
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

**API 二进制版本 v0.2.10-post3 已发布**

已发布新版本的 API 二进制文件。该版本更新了连接超时处理机制，并在 PoC 验证流程中引入了额外的检查。

1. v0.2.10 版本引入了对 Executor → MLNode 连接的严格 5 分钟超时限制，而某些请求可能需要更长时间。新版本 API 取消了该严格限制，恢复为原有超时值。
2. 此前的请求重试机制会在推理因处理超时（非 TLS 超时）失败时仍尝试重试。对于长时间请求，服务端重试通常无效，容易导致重复超时，同时客户端可能收到不一致的结果。新版本 API 在此类情况下不再重试推理请求。
3. 此前即使 MLNode 处于保留状态且未参与 PoC 生成，仍会被用于 PoC 验证，可能导致推理遗漏。新版本已将此类节点从 PoC 验证中排除。
4. 在 PoC 验证流程中新增了额外的安全保护措施。

PR: [https://github.com/gonka-ai/gonka/pull/785](https://github.com/gonka-ai/gonka/pull/785)

构建包: [https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.10-post3/decentralized-api-amd64.zip](https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.10-post3/decentralized-api-amd64.zip)

请尽快应用此更新：
```

# Pre-check: Ensure no confirmation PoC is active (fails entire script if not false)
echo "--
- Pre-flight Check: Confirmation PoC Status ---" && \
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
echo "--
- Final Verification ---" && \
sudo rm -rf .dapi/cosmovisor/current && \
sudo ln -sf upgrades/v0.2.10-post3 .dapi/cosmovisor/current && \
echo "de72c665ff71de904210c5472cebb248d163c1398141868e1a1fe198055b5886 .dapi/cosmovisor/current/bin/decentralized-api" | sudo sha256sum --check && \
# Restart 
source config.env && docker compose up api --no-deps --force-recreate -d
```

## 2026年2月20日

**建议（可选）：vLLM / mlnode 构建版本应在 PoC 开始时中断进行中的请求**

现已提供一个新的 vLLM / mlnode 构建版本，该版本会在 PoC 开始时中断正在进行中的推理请求，以降低因请求在 PoC 启动时仍处于活跃状态而导致潜在权重下降的风险。

来源：[https://github.com/gonka-ai/vllm/tree/release/v0.9.1-pocv2-post5/vllm](https://github.com/gonka-ai/vllm/tree/release/v0.9.1-pocv2-post5/vllm)

**建议尝试的镜像：**

- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post5
- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post5-blackwell
- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post5-blackwell-sm120

**注意事项：**

- 此构建版本旨在与前一版本保持向后兼容。
- 已在少量节点上启用，但仍建议在部署前审查变更内容。

## 2026年2月19日

**抵押参数更新提案——投票结果**

抵押参数更新提案已结束，但未达到法定人数。根据当前治理规则，该提案被否决，因此更新后的参数将不会生效。

如前所述，Epoch 180 的抵押机制激活与此投票结果无关。

由于该提案未通过，Genesis 中定义的抵押参数将在 Epoch 180 自动生效。

参与者应：

- 审查 Genesis 中定义的抵押参数。
- 在 Epoch 180 之前准备并存入所需的 GNK。
- 确保正确设置[抵押](https://gonka.ai/host/collateral/)，否则从 Epoch 180 起，PoC 衍生的奖励将被减少 5 倍。

抵押机制的激活是协议从“宽限期”过渡到完全抵押 PoC 权重模型的一部分。治理仍是调整参数的机制，但如果未批准替代方案，则默认规则将适用。

!!! note "重要提示：请预留缓冲额度存入"

    强烈建议参与者**不要**仅存入最低精确金额。由于归一化效应和全网级调整，PoC 权重可能在不同 epoch 之间波动。权重较小的节点可能经历相对更大的波动。为避免在 epoch 边界时出现临时抵押不足的情况，建议存入高达计算最低要求 2 倍的金额，尤其是在当前抵押水平仍较低的情况下。这将提供操作安全性，并防止因微小参数变动而导致意外的权重降低。协议不会自动补充抵押。

    如果社区希望再次修改参数，未来可能会提出新的提案。

## 2026年2月19日

**PoC 权重归一化更新**

在最近一次升级后，由于 PoC 持续时间归一化，节点权重已进行调整。  
为了将 PoC 权重与实际区块生成时间对齐，校准参数基于观测到的区块间隔进行选择。实际实施中，PoC 的有效参考窗口比之前的名义假设长约 5 个区块。

因此：

- 节点平均权重下降（归一化效应）
- 显示的总 H100 等效算力相应降低
- 各 GPU 类型之间的相对比例保持不变

**原因说明**

此前，PoC 权重计算依赖于名义上的 epoch 时长假设。在引入实时归一化后：

- PoC 持续时间与实际出块时间对齐
- 权重更准确地反映实际计算时间

由于有效归一化窗口比之前的名义模型长约 5 个区块，每个 epoch 的重新计算权重相应降低。

**观测到的 GPU 权重变化（Epoch 175 → 176）**

| GPU 类型 | Epoch 175 | Epoch 176 | 变化 |
| --- | --- | --- | --- |
| A100-PCIE-40GB | 11.8 |  |  |
| A100-SXM4-80GB |  |  |  |
| H100 80GB HBM3 |  |  |  |
| H100 PCIe | 10.0 |  |  |
| H200 |  |  |  |
**对追踪器（仪表板）维护者的操作建议**

PoC 持续时间归一化现已生效，有效参考窗口比之前的名义假设长约 5 个区块，因此从 Epoch 176 开始的权重值已反映更新后的计算模型。  
所有基于 PoC 权重推导 H100 等效算力或奖励预测的追踪器和仪表板，应从 Epoch 176 起验证其转换系数。  
若仍使用归一化前的假设，所显示的硬件等效值和预测奖励可能会被高估。

## 2026年2月18日

**升级已执行：v0.2.10 现已在主网上线**

针对升级提案 v0.2.10 的链上治理投票已结束。该提案已获**批准**，升级已在主网上成功执行。此次升级对 PoC 验证进行了重要优化，并引入了实时权重归一化机制，以提升网络的公平性和可扩展性。

**注意**

必须重启 ML Node 容器以触发模型重新部署。请运行：
```

docker restart join-mlnode-1
```

升级引入的 3000 个区块宽限期之内，必须完成到 `mlnode:3.0.12-post4-*` 的过渡。

!!! note "兼容性说明"
    本次升级包含迁移到 IBC 协议栈 v8.7.0。请检查所有解析 `inferenced` CLI 输出的脚本。枚举类型以及 int64/uint64 值现在将以字符串形式编码。

    **当前已生效的关键变更****PoC 验证采样优化**

    本次升级引入了一种新的 PoC 验证机制，通过为每个参与者分配一组固定的被抽样验证节点，将复杂度从 O(N²) 降低至 O(N × N_SLOTS)。

    **基于实际时间的 PoC 权重归一化**

    本次升级根据实际 PoC 耗时对参与者权重进行归一化处理，以减少区块时间漂移的影响，使权重结果与真实执行时长保持一致。

    **启用 Qwen235B 的工具调用功能**

    本次升级为 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 添加了工具调用参数（`--enable-auto-tool-choice`、`--tool-call-parser hermes`），并设置验证阈值为 0.958。  
    要启用工具功能，必须重启 MLNode 容器内的 vLLM 服务。

    **其他协议更新**

- 修复：PoC 与 CPoC 交集逻辑错误（PR #752）。
- IBC 升级：IBC 协议栈升级至 v8.7.0。
- 惩罚机制：阈值现由链上数据动态生成（PR #688）。
- 锁仓功能：支持在锁定期未结束时进行 streamvesting 转移（PR #641）。
- MLNode：更稳定的 MLNode 容器版本 ghcr.io/product-science/mlnode:3.0.12-post4 / ghcr.io/product-science/mlnode:3.0.12-post4-blackwell。

**宽限期说明**：本次升级引入一个 3000 个区块的宽限期，在升级后的前 3000 个区块内不执行确认型 PoC（Confirmation PoC），且在升级所在的纪元中，对缺失率和无效率的判定阈值将更为宽松。

更多变更详情请参见治理文档：[https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10/README.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10/README.md)

## 2026 年 2 月 18 日

**抵押参数更新提案现已开放投票**

关于更新抵押参数的提案已发布，进入社区投票阶段。

提议参数如下：

- 每 1 单位算力需抵押 0.032 GNK（约每块 H100 需 10 GNK）
- 因缺失率过高或被拘留（jail）而触发的罚金比例为 0.01%
- 因无效推理而触发的罚金比例为 0.5%

这意味着，在单个纪元内，即使受到惩罚，矿工最多仅会损失其抵押金的 0.5%。而所需抵押金额仅约为日均收益的 24%。

**警告**：无论投票结果如何，抵押机制都将生效。若该提案未获通过，则创世块中定义的抵押参数将在第 180 纪元自动激活，而非上述提议参数。

投票结束后、第 180 纪元开始前，所有矿工必须按照[相关指引](https://gonka.ai/host/collateral/#slashing)将所需资金转入抵押账户。否则，自第 180 纪元起，其奖励将被削减为原来的 1/5。

如需获取最新参数信息：
```

export NODE_URL=https://node3.gonka.ai/
diff -u \
  <(./inferenced query inference params -o json --node $NODE_URL/chain-rpc/ | jq '.params') \
  <(./inferenced query gov proposal 28 -o json --node $NODE_URL/chain-rpc/ | jq '.proposal.messages[] | select(."type"=="inference/x/inference/MsgUpdateParams") | .value.params') \
  || true

```

投票方式（`yes`, `no` , `abstain` , `no_with_veto`）：
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

**截止日期：**

投票将于 2026 年 2 月 19 日 07:27:06 UTC 结束。

## 2026 年 2 月 17 日

**v0.2.10 升级提案进入治理阶段**

下一版本链上软件 v0.2.10 的升级提案现已发布至链上，进入投票阶段。若提案获得通过，将引入 PoC 验证的重要优化（默认关闭）并实现基于实时的时间权重归一化，以提升网络的公平性与可扩展性。

**主要变更****PoC 验证采样优化**

本次升级引入了一种新的 PoC 验证机制，通过为每个参与者分配一组固定的抽样验证节点，将复杂度从 O(N²) 降低至 O(N × N_SLOTS)。

**基于实时的 PoC 权重归一化**

本次升级根据实际 PoC 经过时间对参与者权重进行归一化处理，以减少区块时间漂移的影响，使权重结果与真实执行时长保持一致。

**为 Qwen235B 启用工具调用功能**

本次升级为 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 添加了工具调用参数（`--enable-auto-tool-choice`, `--tool-call-parser hermes`），并设置验证阈值 `0.958`。  
要启用工具功能，必须重启 MLNode 容器内的 vLLM。升级后将设置一个 3000 个区块的宽限期，在此期间不进行确认型 PoC（Confirmation PoC），且在升级所在周期内采用更宽松的丢失率和无效率阈值。

**其他协议更新**

- 修复 PoC 与 CPoC 交集逻辑错误（PR #752）
- IBC 协议栈升级至 v8.7.0
- 惩罚阈值现由链上数据动态生成（PR #688）
- 支持在存在活跃释放计划（vesting）的情况下进行流式释放转账（streamvesting transfers）（PR #641）
- 提供更稳定的 MLNode 容器版本 `ghcr.io/product-science/mlnode:3.0.12-post4` / `ghcr.io/product-science/mlnode:3.0.12-post4-blackwell`

上述及其他变更的详细信息，请参见治理文档：  
[https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10/README.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10/README.md)

**升级执行后节点所需操作**

若提案通过并完成升级，必须重启 ML Node 容器以触发模型重新部署。请执行以下命令：
```

docker restart join-mlnode-1
```

过渡到 `mlnode:3.0.12-post4-*` 应在升级引入的 3000 个区块宽限期内完成。

**如何投票**

提案详情和投票可通过 `inferenced` 查看。任何活动节点均可使用。可用节点包括：

- [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
- [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
- [https://node3.gonka.ai](https://node3.gonka.ai)

投出你的票（`yes`, `no` , `abstain` , `no_with_veto`）：
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

- 投票结束时间：2026年2月18日 09:26:26 UTC  
- 升级高度：2712600  
- 预计升级时间：2026年2月18日 15:30:00 UTC  

**注意事项**

- 请检查所有解析 `inferenced` CLI 输出的脚本。由于 IBC 栈升级至 v8.7.0，枚举和 int64/uint64 值现在将以字符串形式编码。  
- 请计划在升级窗口期间保持在线，以便能够及时执行任何后续步骤或应对措施。  
- 升级期间，Cosmovisor 将在 `.inference/data` 目录中创建完整的状态备份，请确保有足够的磁盘空间。有关安全删除 `.inference` 目录中旧备份的指导，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。  
- 如果 `application.db` 占用了大量磁盘空间，可参考[此处](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)描述的清理方法进行处理。  
- 升级后，Postgres 将可作为本地负载存储的可选方案。

## 2026年2月16日

**抵押机制激活及拟议初始参数**

距离 Epoch 180 不足7天——是时候开始准备了。

根据 AMA 中的讨论以及社区成员提出的观点，提议以较低的抵押要求和最小化的惩罚机制作为起点。

提交社区投票的参数如下：

- 每1单位算力需抵押 0.032 GNK（约每 H100 需 10 GNK）  
- 因未达标率或被监禁而触发的惩罚：0.01%  
- 因无效推理触发的惩罚：0.5%  

这意味着，即使受到惩罚，矿工在一个 epoch 内最多仅会损失其抵押金额的 0.5%。所需抵押金额仅约占日收益的 24%。

一旦提案提交投票，将另行发布公告。

**警告**：无论本次投票结果如何，抵押机制都将在 Epoch 180 激活。如果该提案未获通过，则将自动启用创世文件中定义的抵押参数，而非上述参数。

未来任何提高抵押要求的调整都将通过单独的投票提出。我们的目标是先观察网络稳定性，确保不合理的惩罚极少发生且仅在合理情况下触发。若网络稳定性得到验证，将逐步提高抵押额度至《通证经济白皮书》中描述的水平（例如每 H100 约 100 GNK），以支持网络的长期成功。

## 2026年2月13日

**即将进行的 v0.2.10 版本升级投票与执行时间表**

即将进行的软件升级 v0.2.10 的链上投票预计将于周日晚间（洛杉矶时间）/ 周一上午（UTC 时间）开始。若提案通过治理投票，升级计划于周二执行。

**大致时间线**：

- 周日晚间（洛杉矶时间）— 投票期开始  
- 周一（UTC 上午）— 投票进行中  
- 周二 — 升级执行（如提案通过）  

请查看 GitHub 上 v0.2.10 升级的 PR 并留下您的反馈。有意义的审查贡献可能在下一次升级中获得奖励。

[https://github.com/gonka-ai/gonka/pull/695](https://github.com/gonka-ai/gonka/pull/695)

## 2026年2月13日

如果您的节点未能及时应用最近的升级，可能在区块 2628371 处因共识失败而停止运行。这是因为节点运行的二进制文件已过时，不再与网络兼容。如需恢复，请遵循此指南：[https://gonka.ai/FAQ/#recovery-guide-consensus-failure-after-missing-patch](https://gonka.ai/FAQ/#recovery-guide-consensus-failure-after-missing-patch)

## 2026年2月12日

**网络更新：补丁已发布（PoC / cPoC 重叠问题）**

当前 epoch（169/170）中出现的问题现已发布补丁进行修复。

**需采取的操作**

请各节点运营方尽快应用该补丁，以确保 PoC 验证行为正确，并安全恢复区块生产。
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
echo "--
- Final Verification ---" && \
sudo rm -rf .inference/cosmovisor/current
sudo ln -sf upgrades/v0.2.9-post3 .inference/cosmovisor/current
echo "aaffbbdc446fbe6832edee8cb7205097b2e5618a8322be4c6de85191c51aca1d .inference/cosmovisor/current/bin/inferenced" | sudo sha256sum --check && \

# Restart 
source config.env && docker compose up node --no-deps --force-recreate -d
```

[https://github.com/gonka-ai/gonka/pull/748](https://github.com/gonka-ai/gonka/pull/748)

## 2026年2月12日

**网络事件：PoC / cPoC 重叠（区块生产已暂停）**

当前纪元中观察到 cPoC（确认 PoC）与 PoC 出现重叠。直至该纪元最后一个区块，`is_confirmation_poc_active` 被观测为 `true`。

目前正评估此重叠造成的影响。初步观察显示，没有任何节点记录到 PoC 提交，导致本纪元累计权重为零。

作为预防措施，矿工通过协调行动暂时停止了区块生产。

问题正在定位中。

请保持待命状态，以防需要紧急应用补丁。相关详细信息及补丁说明将在准备就绪后立即发布。

## 2026年2月12日

**推理功能现已开放**

链上推理访问现已开放，且不限于开发者使用。推理请求可通过此前更新中引入的“许可传输代理”（Allowed Transfer Agents）发送。当前许可名单可直接通过链上查询获取：
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

一个新版本的库现已发布，详见：[https://gonka.ai/developer/quickstart/#3-inference-using-modified-openai-sdk](https://gonka.ai/developer/quickstart/#3-inference-using-modified-openai-sdk)

**注意**：若某地址未包含在白名单中，通过该地址路由的推理请求在当前配置下将不被接受。

## 2026年2月10日

**v0.2.10 升级版 PR 审查通知**

下一版本链上软件升级 v0.2.10 的 [Pull Request](https://github.com/gonka-ai/gonka/pull/695) 现已开放审查。欢迎提供反馈和改进建议。目前计划将审查窗口开放约 2 天。

对本次 PR 审查中做出有意义贡献的用户，可能将在下一次升级中获得悬赏奖励。

本次仅为 PR 审查呼吁，**不**代表正式投票流程的开始。治理投票流程将在审查期结束后启动。

**主要变更****[PR #710](https://github.com/gonka-ai/gonka/pull/710) PoC 验证采样优化**

本次升级引入了一种新的 PoC 验证机制，通过为每个参与者分配一组固定的抽样验证节点，将复杂度从 O(N²) 降低至 O(N × N_SLOTS)。参考设计与分析文档：[https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/poc/optimize.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/poc/optimize.md)

**[PR #725](https://github.com/gonka-ai/gonka/pull/725) 基于实际 PoC 时间的 PoC 权重归一化**

本次升级根据实际 PoC 耗时对参与者权重进行归一化处理，以减少区块时间漂移的影响，并使权重结果与真实执行时长保持一致。

**其他关键变更：**

- **[PR #708](https://github.com/gonka-ai/gonka/pull/708)** IBC 升级至 v8.7.0
- **[PR #723](https://github.com/gonka-ai/gonka/pull/723)** 测试网桥接设置脚本
- **[PR #666](https://github.com/gonka-ai/gonka/pull/666)** 优化构件存储吞吐性能
- **[PR #688](https://github.com/gonka-ai/gonka/pull/688)** 从链上数据生成惩罚统计信息
- **[PR #697](https://github.com/gonka-ai/gonka/pull/697)** 为 macOS 构建提供便携式 BLST 支持
- **[PR #712](https://github.com/gonka-ai/gonka/pull/712)** 要求 proto-go 生成代码与提交代码一致
- **[PR #711](https://github.com/gonka-ai/gonka/pull/711)** 从链状态获取 PoC 测试参数
- **[PR #641](https://github.com/gonka-ai/gonka/pull/641)** 支持带 vesting 的 Streamvesting 转账
- **[PR #659](https://github.com/gonka-ai/gonka/pull/659)** 模型分配逻辑检查前一 epoch 的奖励
- **[PR #716](https://github.com/gonka-ai/gonka/pull/716)** 重命名 PoC 权重函数以提升清晰度和正确性

**API 强化与可靠性修复：**

- **[PR #634](https://github.com/gonka-ai/gonka/pull/634)**：添加请求体大小限制以降低 DoS 风险
- **[PR #727](https://github.com/gonka-ai/gonka/pull/727)**：跟进 #634，将响应写入器传递给 `http.MaxBytesReader` 并统一测试
- **[PR #638](https://github.com/gonka-ai/gonka/pull/638)**：修复请求处理中的不安全类型断言
- **[PR #644](https://github.com/gonka-ai/gonka/pull/644)**：避免每次启动时重写静态配置
- **[PR #661](https://github.com/gonka-ai/gonka/pull/661)**：防止短时网络中断导致 API 崩溃
- **[PR #640](https://github.com/gonka-ai/gonka/pull/640)**：为节点版本端点行为添加单元测试
- **[PR #622](https://github.com/gonka-ai/gonka/pull/622)**：在 `InvalidateInference` 中传播退款错误
- **[PR #639](https://github.com/gonka-ai/gonka/pull/639)**：修复任务认领路径中缺少错误返回的问题
- **[PR #643](https://github.com/gonka-ai/gonka/pull/643)**：在执行者选择中对空参与者进行清理
- **[PR #545](https://github.com/gonka-ai/gonka/pull/545)**：修复 API 流程中的若干小 bug

**升级计划**

二进制版本预计将通过链上升级提案进行更新。有关升级流程的更多信息，请参阅 [https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/docs/upgrades.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/docs/upgrades.md)

现有主机**无需**升级其 `api` 和 `node` 容器。更新后的容器版本仅适用于链上升级完成后新加入的主机。

**建议流程**

1. 活跃主机在 GitHub 上审查本提案并提交反馈。
2. 社区审查 PR 后，将从该分支创建 v0.2.10 发布版本，并可提交针对此版本的链上升级提案，启动正式的治理投票流程。
3. 若链上提案通过，该 PR 将在链上升级执行后合并。

从 [upgrade-v0.2.10](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.10) 分支（而非 `main`）创建发布版本，可最大限度减少 `/deploy/join/` 目录在 `main` 分支中所含容器版本与链上二进制版本不一致的时间，从而为新主机提供更顺畅的接入体验。

**测试与迁移**

v0.2.10 的测试指南和迁移详情已记录在此：[https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10)，请仔细查阅。

**兼容性说明**

若您有任何脚本用于解析 `inferenced` CLI 的 JSON 输出，请在本次升级后重新检查。由于 ibc-go 升级至 v8.7.0，枚举值现在以字符串形式编码而非数字，int64/uint64 值也已改为字符串编码。

## 2026年2月4日

**CLI 更新提醒**

对于 v0.2.9 升级后创建的热密钥授权操作，应使用 [CLI 版本 v0.2.9](https://github.com/gonka-ai/gonka/releases/tag/release%2Fv0.2.9)。

## 2026年2月3日

**PoC v2 推理性能为基础的权重调整**

随着 PoC v2 启用，权重分配现基于当前模型 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 上测得的推理性能。因此，各类 GPU 的中位权重及不同类型 GPU 间的相对权重比例均已调整。

**观察到的 GPU 权重变化（Epoch 158 → 159）**

| GPU 类型 | Epoch 158 | Epoch 159 | 变化幅度 |
| --- | --- | --- | --- |
| A100-PCIE-40GB | 129.05 |  |  |
| A100-SXM4-80GB |  |  |  |
| B200 |  |  |  |
| H100 80GB HBM3 | 17.31 |  |  |
| H100 PCIe |  |  |  |
| H200 |  |  |  |
**背景说明**

- 观察到的变化表明，GPU 权重差异现在反映的是特定模型的推理吞吐量，而非名义上的硬件规格。例如，H100 PCIe 的权重下降幅度大于 H100 HBM3，这与 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 的实际推理行为一致。
- 在当前模型配置下，基于观测到的推理轨迹，B200 GPU 的推理性能并未优于 H100 级 GPU。
- 若未来通过治理在后续 epoch 中引入更大或更复杂的模型（例如 DeepSeek V3.2），可能会观察到不同的性能特征。
- 在 PoC 外部进行的控制推理基准测试（使用相同模型 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 上的标准 vLLM 推理）显示，各类 GPU 之间的相对性能差异与 PoC v2 中观察到的结果一致。

**对追踪器（仪表板）维护者的建议**

随着新权重分配已生效，追踪器（仪表板）维护者可能需要审查第 159 及后续 epoch 的系数，以确保与当前 PoC v2 的权重分配保持一致。

## 2026年2月2日

**网络更新 — 补丁已发布**

现已发布补丁，用于解决近期 PoC 周期中导致区块验证暂停的问题。建议各主机尽快应用该补丁，以确保 PoC 验证行为正常，并安全恢复区块生产。

**需采取的行动**

请各主机尽快应用补丁，以确保 PoC 验证行为正确并安全恢复区块生产。
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
echo "--
- Final Verification ---" && \
sudo rm -rf .inference/cosmovisor/current
sudo ln -sf upgrades/v0.2.9-post2 .inference/cosmovisor/current
echo "75410178a4c3b867c0047d0425b48f590f39b9e9bc0f3cf371d08670d54e8afe .inference/cosmovisor/current/bin/inferenced" | sudo sha256sum --check && \

# Restart 
source config.env && docker compose up node --no-deps --force-recreate -d
```

后续说明，包括恢复区块验证所需的任何协调步骤，将另行通知。

## 2026年2月2日

**区块验证已作为预防措施暂停**

由于当前PoC周期内存在无法满足验证阈值的高风险，各节点运营方已集体采取行动，暂时停止了区块验证。  
根据目前评估，用于处理该情况的机制可能无法按预期运行。为防止在不确定或不安全的条件下完成验证者最终确定，网络在验证者选定前已被暂停。

**下一步计划**

目前正在推进以下操作：

- 验证是否没有任何验证者集合能够达到所需的验证阈值  
- 确认验证者最终确定前的网络状态  
- 准备修复已识别问题的补丁程序

**需采取的行动**

所有节点运营方必须做好随时安装补丁的准备。  
请保持在线并密切关注公告。补丁准备就绪后将立即发布进一步指示。

## 2026年2月1日

**升级已完成：v0.2.9 已在主网上线**

关于升级提案 v0.2.9 的链上治理投票已结束。该提案已获得**通过**，并于区块高度 2451000 在主网上成功执行。本次升级启用了 PoC v2 的权重分配机制，并完成了从旧版 PoC 机制的全面过渡。

**注意事项**

- 下一个 PoC 周期（从第158轮过渡到第159轮）至关重要。请确保在线，以便在需要时及时执行后续步骤或缓解措施。  
- 只有运行 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 的 ML 节点才有资格进入下一个（第159轮）周期，并参与 PoC v2 的权重分配。运行其他模型的 ML 节点将不会被纳入下一轮周期的参与者集合。

**节点运营方准备事项**

建议各节点运营方确认所有 ML 节点：

- 仅配置为提供支持的模型 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`  
- 镜像已更新至兼容 PoC v2 的版本

有关将 ML 节点切换至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、升级镜像以及移除其他模型的指南，请参阅[常见问题解答](https://gonka.ai/FAQ/#how-to-switch-to-qwenqwen3-235b-a22b-instruct-2507-fp8-upgrade-ml-nodes-and-remove-other-models)。

**当前生效的关键变更****PoC v2 启用**

- PoC v2 已成为权重分配的现行机制  
- 确认型 PoC（V2 跟踪）为结果的权威来源  
- 旧版 PoC 逻辑不再用于权重计算

**模型配置**

- 网络现运行于单模型模式  
- 用于 PoC v2 和权重分配的模型为 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`  
- 提供其他模型的 ML 节点将不参与 PoC v2 的权重分配。在支持的情况下，系统可能会自动切换至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`

**参与资格标准**

ML 节点要具备 PoC v2 权重分配资格，必须同时满足以下两个条件：

- 节点提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 模型  
- 节点运行兼容 PoC v2 的镜像版本：
 
 
   - ghcr.io/product-science/mlnode:3.0.12-post1  
 
 
   - ghcr.io/product-science/mlnode:3.0.12-post1-blackwell

**cPoC 情况下的奖励流向修正**

在因 cPoC 惩罚导致奖励被减少或排除的情况下，未分配的奖励部分将转入社区资金池。此前，此类奖励会重新分配给其他参与者。

**其他协议更新**

- 转移代理（Transfer Agent）角色在初始阶段仅限于[指定列表](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#transfer-agent-whitelist)中的 `allowlist`  
- 在忽略区块验证的同时参与 PoC 生成的节点，已被从[参与者名单](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#suspicious-participant-removal) `allowlist` 中移除  
- 当 PoC v2 验证投票未达到阈值时，将启用[守护者权重](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#guardian-tiebreaker-for-poc-v2-voting)作为确定性备用机制

上述变更的更多细节，请参见治理文档：[https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9)

## 2026年2月1日

v0.2.9 升级提案的链上治理流程即将结束。

- 投票截止时间：2026年2月1日 22:02:58 UTC  
- 升级区块高度：2451000  
- 预计升级时间：2026年2月2日 05:10:00 UTC

建议各节点运营方提前在[GitHub](https://github.com/gonka-ai/gonka/pull/668)上审阅提案并参与投票。  
建议提前下载升级所需二进制文件，以避免升级期间因 GitHub 访问问题而影响操作。
```

#
 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.9/bin \
              .inference/cosmovisor/upgrades/v0.2.9/bin && \

#
 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.9/decentralized-api-amd64.zip" && \
echo "ac1ad369052a8c3d01af4d463c49cdd16fcbecc365d201232e7a2d08af8501c0 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.9/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.9/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

#
 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.9/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.9/inferenced-amd64.zip" && \
echo "fc628d77aa516896924fbd8f60b8aa6a14161de4582aaef634de62382ea482eb inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.9/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.9/bin/inferenced && \
echo "Inference Installed and Verified" && \

#
 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--
- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.9/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.9/bin/inferenced && \
echo "52c79f06a8fc175ca6b3819523bb36afbf601d8a8320b1bb5a3cc089ceef62c4 .dapi/cosmovisor/upgrades/v0.2.9/bin/decentralized-api" | sudo sha256sum --check && \
echo "ae20517e4bb38293202f7f5d52439d5315cb32c8f3c34a02fa65feaefadd6193 .inference/cosmovisor/upgrades/v0.2.9/bin/inferenced" | sudo sha256sum --check
```

## 2026年1月31日

**v0.2.9 升级提案进入治理阶段**

下一版本链上软件 v0.2.9 的升级提案现已发布至链上，进入投票阶段。若提案获得通过，将通过链上治理机制启用 PoC v2 进行权重分配，并完成从旧版 PoC 机制的全面过渡。

**主要变更****PoC v2 激活**

- PoC v2 将作为权重分配的正式机制
- 确认型 PoC（V2 跟踪）将成为结果的权威数据来源
- 旧版 PoC 逻辑将不再用于权重计算

**模型配置**

- 网络将以单模型模式运行
- 用于 PoC v2 和权重分配的模型为 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 提供其他模型的 ML 节点将不参与 PoC v2 的权重分配。在支持的情况下，系统可能会自动切换至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`

**资格标准**

ML 节点需同时满足以下两个条件，方可具备 PoC v2 权重分配资格：

- 节点正在提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 模型服务
- 节点运行的是兼容 PoC v2 的镜像版本：
 
 
   - ghcr.io/product-science/mlnode:3.0.12-post1
 
 
   - ghcr.io/product-science/mlnode:3.0.12-post1-blackwell

**cPoC 情况下的奖励流向修正**

对于因 cPoC 惩罚而导致奖励被削减或排除的情况，未分配的奖励部分将转入社区资金池（Community pool）。此前，此类奖励会被重新分配给其他参与者。

**其他协议更新**

- 初始阶段，Transfer Agent 角色将被限制在[指定列表](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#transfer-agent-whitelist) `allowlist` 内
- 在 PoC 生成期间忽略 PoC 验证的节点，已从[参与者名单](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#suspicious-participant-removal) `allowlist` 中移除
- 当 PoC v2 验证投票未达到阈值时，[守护者权重](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#guardian-tiebreaker-for-poc-v2-voting) 将作为确定性回退机制启用

上述变更的更多细节，请参见治理文档：[https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9)

**节点运营方准备事项**

建议各节点运营方确认所有 ML 节点：

- 仅配置为提供支持的模型 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 镜像已升级至兼容 PoC v2 的版本

有关将 ML 节点切换至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、升级镜像以及移除其他模型的操作指南，请参见[常见问题解答](https://gonka.ai/FAQ/#how-to-switch-to-qwenqwen3-235b-a22b-instruct-2507-fp8-upgrade-ml-nodes-and-remove-other-models)。

**如何投票**

提案详情及投票通道可通过 `inferenced` 访问，任一活跃节点均可用于投票。可用节点包括：

- [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
- [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
- [http://node3.gonka.ai:8000](http://node3.gonka.ai:8000)
- [https://node4.gonka.ai](https://node4.gonka.ai)

请进行投票（ `yes` , `no` , `abstain` , `no_with_veto` ）：
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

**截止时间**

- 投票结束时间：2026年2月1日 22:02:58 UTC  
- 升级高度：2451000  
- 预计升级时间：2026年2月2日 05:10:00 UTC  

建议节点运营者在 [GitHub](https://github.com/gonka-ai/gonka/pull/668) 上审阅该提案并参与投票。

**注意事项**

- 请计划在升级窗口期间保持在线，以便在需要时能够及时执行后续步骤或缓解措施。  
- 升级期间，Cosmovisor 会在 `.inference/data` 目录中创建完整的状态备份。请在升级前确保有足够的磁盘空间。有关如何安全删除 `.inference` 目录中旧备份的指导，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。  
- 如果 `application.db` 占用了大量磁盘空间，可应用[此处](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)描述的清理技术。  
- 升级后，Postgres 可作为本地负载存储的可选方案。

## 2026年1月29日

**PoC 验证参与通知**

在最近的一个周期（epoch）中，大量 ML 节点未获得 PoC 权重。  
分析表明，这是由于 PoC 验证参与不足所致。在多个案例中，参与者发布了 nonce，但未执行验证，或验证程度远低于协议要求。  
以下表格列出了在上一周期拥有权重、在当前周期提交了 PoC nonce，但在 PoC 验证阶段缺失或参与不足的参与者：[https://docs.google.com/spreadsheets/d/17agQXP77lATT2bNK12OEOzek5wNSptN2ktiSag3QXB0/](https://docs.google.com/spreadsheets/d/17agQXP77lATT2bNK12OEOzek5wNSptN2ktiSag3QXB0/)

这些节点的总权重约为 36%。加上完全未参与 PoC 的参与者，无参与或低参与 PoC 验证的总权重达到了约 48%，这一比例已处于危险高位。  
如果您的节点在此表格中且 `validated` 显示为 0，请检查您的 PoC 验证日志和配置，确保验证按预期运行。

以下笔记本展示了上述表格的生成过程：[https://github.com/gonka-ai/gonka/blob/gm/debug-155-1/debug-validation.ipynb](https://github.com/gonka-ai/gonka/blob/gm/debug-155-1/debug-validation.ipynb)

## 2026年1月29日

**升级已执行：v0.2.8 现已在主网上线**

关于升级提案 v0.2.8 的链上治理投票已结束。该提案已**通过**，并在主网上成功执行。  
本次升级实现了 PoC v2 架构，简化了模型支持，并应用了关键的安全性和可靠性修复。

**现已生效的主要变更****PoC v2 核心集成**

- **vLLM 集成**：PoC 已直接集成到 vLLM 中，实现从推理到 PoC 的即时切换，无需卸载模型。  
- **MMR 承诺**：通过 Merkle Mountain Range（MMR）承诺将产物存储迁移至链下；仅将 `root_hash` 和 `count` 记录在链上。  
- **双模式迁移**：同时支持 V1（常规 PoC）和 V2（确认式 PoC）的追踪。

**模型可用性更新**

支持的模型集合现已受限。除以下模型外，所有先前支持的模型均已从活动集合中移除：

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`  
- `Qwen/Qwen3-32B-FP8`

**安全与可靠性改进**

- **SSRF 与 DoS 防护**：验证 `InferenceUrl` 以拒绝内网 IP，并添加超时机制防止请求挂起。  
- **投票翻转防护**：拒绝重复的 PoC 验证，防止覆盖。  
- **认证绕过防护**：将 `epochId` 与签名绑定，确保针对正确周期进行验证。

**参与 PoC v2 的节点要求**

要具备参与 PoC v2 的资格，节点运营者需完成以下两项要求：

- **模型配置**：将 ML 节点配置为提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`  
- **ML 节点升级**：使用支持 PoC v2 的版本：
 
 
  - ghcr.io/product-science/mlnode:3.0.12  
 
 
  - ghcr.io/product-science/mlnode:3.0.12-blackwell  

!!! note  
    未能同时满足以上两个条件的节点，在网络过渡到单模型配置后，将不具备参与 PoC v2 的资格。PoC v2 的权重分配过渡仍取决于观察到的采用率阈值及后续的治理投票。

    **维护与运维**

- **Cosmovisor**：节点和 API 二进制文件的更新将自动处理。现有节点运营者无需手动更新正在运行的容器。  
- **磁盘空间**：Cosmovisor 将在 `.inference/data` 目录中创建完整状态备份。请确保至少有 250 GB 以上的可用空间。  
- **Postgres**：升级后可配置使用 Postgres 进行本地负载存储。

建议在升级后密切关注节点状态并通过 Discord 保持沟通，以确保系统稳定。

## 2026年1月28日

**如何切换到 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、升级 ML 节点并移除其他模型？**

本指南说明了节点运营者应如何响应 v0.2.8 版本中模型可用性的变更以及即将到来的 PoC v2 升级。从第 155 周期起，将开始监测 ML 节点配置是否符合 PoC v2 要求。建议运营者在此之前审阅并准备 ML 节点配置。PoC v2 的迁移可在第 155 周期后安排。迁移阶段结束后，不符合配置要求的 ML 节点可能不再计入权重。

**
1. 背景：模型可用性变更（v0.2.8 升级）**

作为 v0.2.8 升级的一部分，活动模型集合已更新。

**支持的模型（活动集合）**

仅以下模型仍受支持：

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`  
- `Qwen/Qwen3-32B-FP8`  

`Qwen/Qwen3-32B-FP8` 在迁移期间仍受支持，但不参与 PoC v2 的准备或权重计算。参与 PoC v2 必须提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。

**已移除的模型**

所有先前支持的模型均已从活动集合中移除，不得再提供服务。

**
3. PoC v2 准备条件（重要）**

成功参与 PoC v2 过渡需同时满足以下两点：

- 所有 ML 节点必须提供 Qwen/Qwen3-235B-A22B-Instruct-2507-FP8。这是唯一对 PoC v2 权重有贡献的模型。  
- 所有 ML 节点必须升级至支持 PoC v2 的镜像版本：
 
 
  - ghcr.io/product-science/mlnode:3.0.12  
 
 
  - ghcr.io/product-science/mlnode:3.0.12-blackwell  

!!! note "重要"

 
 
  - 仅提供正确模型但未升级 ML 节点是不够的。  
 
 
  - 未能同时满足两个条件的节点，在网络切换至单模型配置后将不具备资格。  
 
 
  - ML 节点升级必须在迁移完成且通过单独的治理提案激活 PoC v2 之前完成。  
 
 
  - v0.2.8 升级本身**不会启用** PoC v2。

**
3. 检查 ML 节点分配状态（推荐的安全步骤）**

在更改模型之前，您应检查当前 ML 节点的分配状态。请查询您的网络节点管理 API：
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

- 第一个布尔值：表示节点在当前 epoch 是否正在提供推理服务  
- 第二个布尔值：表示节点是否计划在下一轮 PoC 中提供推理服务

**建议行为**

- 优先仅在第二个值为 `false` 的节点上更改模型  
- 这样做可以降低风险，尤其是在仍在观察 PoC v2 行为期间  
- 建议跨多个 epoch 逐步推进更新

**
4. 更新 ML 节点的模型：仅保留受支持的模型**

预下载模型权重（推荐）。为避免启动延迟，请提前将权重下载到 `HF_HOME`：
```

mkdir -p $HF_HOME
huggingface-cli download Qwen/Qwen3-235B-A22B-Instruct-2507-FP8
```

使用 ML 节点管理 API 将 ML 节点切换到受支持的模型（`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`）。

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

通过管理API进行的更改将在下一个训练周期（epoch）生效并替换模型。[https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)

!!! note

    `node-config.json` 仅在首次启动网络节点API或本地状态/数据库被删除时使用。如需重新开始，请修改此参数。对于已存在的节点，应通过管理API执行模型更新。

    **
5. 升级ML节点镜像（PoC v2必需）**

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

**
6. 验证模型服务（在下一个epoch生效）**

确认ML节点仅提供服务 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`，这是用于PoC v2权重及未来权重分配的唯一模型：
```

curl http://127.0.0.1:8080/v1/models | jq
```

可选地重新检查节点分配：
```

curl http://127.0.0.1:9200/admin/v1/nodes
```

!!! note "治理与 PoC v2 激活说明"
    PoC v2 将分阶段引入，不会一次性完全激活。

    **阶段 1：观察期（v0.2.8 升级后的当前状态）**
    
    在 v0.2.8 升级后，PoC v2 的逻辑已具备，但尚未用于权重分配。
    
    此阶段期间：
    
 
 
   - 节点可继续提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 或 `Qwen/Qwen3-32B-FP8` 服务
 
 
   - 节点必须将其 ML 节点切换为提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 服务，并升级至支持 PoC v2 的版本，才能参与 PoC v2 的权重计算
 
 
   - 网络将观察采用情况，以评估节点对过渡到 PoC v2 权重的准备程度

    **阶段 2：治理提案（可选，未来阶段）**
    
    当活跃节点中达到足够高的采用率（约 50%）时：
    
 
 
   - 可提交一项独立的治理提案
 
 
   - 该提案可请求批准激活 PoC v2，并将其用于权重分配
    
    采用率仅为观察参考，不会自动触发任何变更。

    **阶段 3：激活（仅在治理批准后）**
    
    只有在链上治理提案获得通过后，PoC v2 才会成为正式的权重分配方式。在提案获批前：
    
 
 
   - PoC v2 仍不会用于权重分配
 
 
   - 现有的 PoC 机制将继续用于确定权重

**激活前检查清单**

在 PoC v2 激活前，请确保：

- ML 节点已配置为提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 服务
- 配置中已移除所有其他模型
- ML 节点镜像版本为 3.0.12（或 3.0.12-blackwell）

## 2026 年 1 月 28 日

链上治理流程即将完成对 v0.2.8 升级提案的审议。

**升级详情**

- 升级高度：区块 2387000
- 预计时间：2026 年 1 月 29 日 06:30:00 UTC

建议提前预下载升级二进制文件，以避免升级期间因 GitHub 访问问题而影响升级。

```

#
 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.8/bin \
              .inference/cosmovisor/upgrades/v0.2.8/bin && \

#
 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.8-post1/decentralized-api-amd64.zip" && \
echo "45f28afba4758e54988f61cc358f0ad683e7832ab121ccd54b684fe4c9381a75 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.8/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.8/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

#
 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.8/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.8-post1/inferenced-amd64.zip" && \
echo "f0f2e3ee8760e40a78087c98c639a7518bf062138141ed4aec2120f5bc622a67 inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.8/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.8/bin/inferenced && \
echo "Inference Installed and Verified" && \

#
 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--
- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.8/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.8/bin/inferenced && \
echo "421a761f3a7037d72ee0bd8b3f50a744349f717439c7e0fee28c55948dae9a7c .dapi/cosmovisor/upgrades/v0.2.8/bin/decentralized-api" | sudo sha256sum --check && \
echo "308c63c7bda4fb668632ac3e13f3f6cccacf54c563c8e9fd473bcb48c7389fe0 .inference/cosmovisor/upgrades/v0.2.8/bin/inferenced" | sudo sha256sum --check
```

## 2026年1月27日

**v0.2.8 升级提案进入治理阶段**

下一版本链上软件 v0.2.8 的升级提案现已发布至链上，进入投票阶段！  
您的审阅与投票对保障网络稳定性及未来发展能力至关重要。

**v0.2.8 主要变更****PoC v2（核心升级）**

- 将 PoC 直接集成至 vLLM，实现从推理到 PoC 的即时切换，无需卸载模型或加载独立的 PoC 模型。
- 使用 MMR（Merkle Mountain Range）承诺将产物存储迁移至链下——仅在链上记录 root_hash 和计数。
- 包含双模式迁移策略：V1 用于常规 PoC，V2 跟踪用于上线期间的确认型 PoC。

**模型可用性变更**

作为 v0.2.8 升级的一部分，支持的模型集合将进行调整。除以下模型外，所有先前支持的模型都将从活跃集合中移除：

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `Qwen/Qwen3-32B-FP8`

使用 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 成功参与 PoC v2，并配合所需的 ML 节点版本，将用于评估向 PoC v2 迁移的准备情况。当活跃主机中达到一定采用率（约 50%）后，可能会提交另一项治理提案，以批准并激活 PoC v2 用于权重分配。该阈值仅为观察指标，不会触发任何自动的网络变更。

在下一次网络变更通过治理批准后，网络将暂时仅支持 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。

**安全性、正确性与可靠性改进**

- SSRF 与 DoS 防护：验证 InferenceUrl，拒绝内网 IP，并添加超时机制以防止请求挂起。
- 投票翻转防护：通过拒绝重复提交，防止 PoC 验证被覆盖。
- PoC 排除机制修复：修复 getInferenceServingNodeIds，确保正确排除正在提供推理服务的节点。
- 认证绕过与重放攻击防护：将 epochId 绑定至签名，并针对正确的 epoch 验证授权。

由于变更内容较多，此处仅列出部分重点。更多更新与修复的完整列表，请参见 [GitHub 拉取请求](https://github.com/gonka-ai/gonka/pull/539)。

**主机需采取行动**

为参与 PoC v2 迁移，主机必须完成以下两个步骤：

- 确认您的 ML 节点已配置为提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 服务
- 将 ML 节点升级至支持 PoC v2 的版本：
 
 
   - ghcr.io/product-science/mlnode:3.0.12
 
 
   - ghcr.io/product-science/mlnode:3.0.12-blackwell

仅提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 服务但未升级 ML 节点，不足以参与 PoC v2。在网络切换至单模型配置后，未同时满足上述两项条件的节点将被视为不具备 PoC v2 参与资格。ML 节点的升级必须在 PoC v2 通过治理完全启用前完成。

**如何投票**

您可使用 `inferenced` 命令获取提案详情并进行投票。请注意，任何活跃节点均可用于查询或提交投票。当前可用节点包括：

- [http://node1.gonka.ai:8000/](http://node1.gonka.ai:8000/)
- [http://node2.gonka.ai:8000/](http://node2.gonka.ai:8000/)
- [http://node3.gonka.ai:8000/](http://node3.gonka.ai:8000/)
- [https://node4.gonka.ai/](https://node4.gonka.ai/)

查看投票状态：
```

export NODE_URL=https://node4.gonka.ai/
./inferenced query gov votes 25 -o json --node $NODE_URL/chain-rpc/
```

投票（`yes`，`no`，`abstain`，`no_with_veto`）：
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

- 投票截止于 2026 年 1 月 29 日 03:02:20 UTC。
- 升级计划在区块 2387000 上执行，预计时间为 2026 年 1 月 29 日 06:30:00 UTC。

请查看并及时投票，若您是节点运营者（Host）。

**注意 1：** 请计划在升级窗口期间保持在线，以便在需要时能够及时执行后续步骤或应对措施。

**注意 2：** 升级期间，Cosmovisor 将在 `.inference/data directory` 目录中创建完整的状态备份。请确保有足够的磁盘空间。有关如何安全删除 `.inference` 目录中旧备份的说明，请参见[此处](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。如果 `application.db` 占用了大量磁盘空间，可参考[此处](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)提供的清理方法。

**备注：** 升级完成后，Postgres 可配置为本地负载的存储方案。

---

## 2026 年 1 月 19 日

**提案更新：稳定期延长已通过**

关于延长稳定期的治理投票已成功通过。稳定期现已正式延长，以支持进一步测试和网络升级。

**节点运营者行动项**

随着延期确认，请利用此时间准备满足新的 PoC 要求的运行环境。

- **模型更新**：请将您的 ML 节点切换至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 模型。
- **逐步上线**：若您运营多个 ML 节点，建议在多个周期（epoch）内逐步完成更新。

**如何更新**

更新现有 ML 节点的操作说明请见：[https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)

---

## 2026 年 1 月 16 日

**稳定期延长通知**

一项新的治理投票当前正在进行中。

该提案拟将当前稳定期延长约两周，旨在为即将到来的 PoC 变更及相关网络升级提供额外测试时间。有关新 PoC 开发进展的更多详情，请参见：[https://github.com/gonka-ai/gonka/blob/gm/poc-status/proposals/governance-artifacts/poc-update-status.md](https://github.com/gonka-ai/gonka/blob/gm/poc-status/proposals/governance-artifacts/poc-update-status.md)

此次延期也给予节点运营者更多时间准备满足新 PoC 要求的运行环境，包括将 ML 节点切换至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 模型。更新现有 ML 节点的说明请见：[https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)。对于运营多个 ML 节点的用户，建议在多个周期内逐步完成更新。

**投票范围**

若提案通过，网络将在现有 `allowlist` 规则下继续临时运行（涵盖未表现出非标准硬件行为的节点运营者）。

开发者 `allowlist` 的有效期也将同步延长，持续至区块 2459375。

未包含在 `allowlist` 中的节点运营者，在延长的稳定期内仍无法参与 PoC，该阶段将在区块 2443558 结束。

**可复现性与方法论**

`allowlist` 名单：

- 可在此处获取：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)
- 基于链上公开数据，使用预定义的硬件配置模式生成。相关模式通过开源脚本评估，脚本地址为：[https://github.com/product-science/filter](https://github.com/product-science/filter)

**执行特性**

- 若提案通过，`allowlist` 将自动延长。
- 无需进行软件升级。
- 如需进一步调整，仍需通过治理流程决定。

**稳定期结束后**

`allowlist` 具有固定到期时间，不会延续超过延长后的稳定期。当 `allowlist` 在区块 2443558 失效后：

- 网络将恢复至稳定期前的标准参与规则，或
- 任何其他配置需通过独立的治理决策另行定义。

**如何投票**

您可使用 `inferenced` 命令获取提案详情并提交投票。

请注意，任何活跃节点均可用于查询或投票。当前可用节点包括：

- http://node1.gonka.ai:8000/  
- http://node2.gonka.ai:8000/  
- http://node3.gonka.ai:8000/  
- https://node4.gonka.ai/  

要查看投票状态：
```

export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 22 -o json --node $NODE_URL/chain-rpc/
```

投票（`yes`，`no`，`abstain`，`no_with_veto`）：
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

此流程将完全通过治理机制处理，无需进行软件升级。

**时间线与截止日期**

投票结束时间：2026年1月18日 05:28:01 UTC。

`Allowlist` 失效时间：区块 2443558 时自动失效。

## 2026年1月10日

**临时参与者 `allowlist` 修正**

一项新的治理投票当前处于活跃状态。该提案通过将若干地址添加至[白名单](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)来修正一个过滤边缘情况，这些地址此前因硬件名称为空且机器学习节点权重为零而被错误排除。提案还向允许的开发者列表中添加了少量开发者账户，并将 `allowlist` 的失效时间与参与者注册截止区块 2,222,222 保持一致。所有参与逻辑保持不变。此提案仅解决现有过滤逻辑中的一个次要问题。

**可复现性与方法论**

`allowlist` 基于链上公开可查数据，通过一组预定义的硬件配置模式生成。这些模式通过以下开源脚本进行评估：[https://github.com/product-science/filter](https://github.com/product-science/filter)

`allowlist` 可在此处查看：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)

**如何投票**

您可使用 `inferenced` 命令获取提案详情并提交投票。

请注意，任何活跃节点均可用于查询或提交投票。当前可用的节点包括：

- http://node1.gonka.ai:8000/
- http://node3.gonka.ai:8000/
- https://node4.gonka.ai/

查看投票状态：
```

export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 21 -o json --node $NODE_URL/chain-rpc/
```

投票（`yes`，`no`，`abstain`，`no_with_veto`）：
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

此流程完全通过治理机制处理，无需软件升级。

**时间线与截止日期**

投票结束时间：2026年1月12日 06:04:14 UTC。

`Allowlist` 失效时间：区块 2,222,222 时自动失效。

## 2026年1月10日

**临时参与者 `allowlist` 已获批准，将在第135轮次激活**

针对稳定期设置临时参与者的链上治理投票已结束。

该提案已获得通过。本提案定义了一个临时的 `allowlist`，涵盖那些在最近多个轮次中行为保持一致的参与者。

**当前生效的关键变更**

1) 网络将由满足以下条件的参与者组成的 `allowlist` 运行，这些参与者在多个轮次中：

- 上报的硬件特征符合常见配置模式（过滤的非标准配置字符串列表详见：[https://github.com/product-science/filter/blob/main/filter_strings.txt](https://github.com/product-science/filter/blob/main/filter_strings.txt)）
- 展示的PoC权重未超过同类硬件观测权重的150%

2) 此前持续偏离上述模式的参与者将被排除在 `allowlist` 之外，直至区块 2,222,222 对应的稳定期结束。

**执行特性**

- `allowlist` 将从下一个轮次（第135轮）起生效
- 激活发生在第135轮的首次PoC期间
- 无需软件升级
- 自此时起，`allowlist` 将持续有效至并包括区块 2,222,222

**可复现性与方法论**

- `allowlist` 完全基于公开可观察的链上数据生成
- 硬件描述符使用开源脚本对照预定义的配置模式集进行评估：[https://github.com/product-science/filter](https://github.com/product-science/filter)
- 生成的 `allowlist` 发布于此：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)

**后续步骤**

主机方无需采取任何操作。

## 2026年1月8日

**时机已到：为稳定期设立临时参与者 `allowlist`**

在成功采用修复PoC相关共识故障的补丁后，一项新的治理投票当前正在进行中。

随着区块正常出块恢复，网络即将进入一个短期稳定阶段，为后续扩展做准备。

此次投票将定义稳定期内参与者的 `Allowlist`（[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)），反映符合网络预期行为的参与者集合。

**投票范围**

若提案通过，网络将在稳定期内临时运行于一个由未在先前轮次中展示非标准硬件行为的参与者组成的 `allowlist`。具体而言，`allowlist` 包括在多个轮次中满足以下条件的参与者：

- 上报的硬件特征已根据预定义的常见硬件配置模式集进行评估，用于识别偏差与不一致性（非标准配置字符串完整列表见：[https://github.com/product-science/filter/blob/main/filter_strings.txt](https://github.com/product-science/filter/blob/main/filter_strings.txt)），且
- 观测到的PoC权重低于同类硬件其他参与者所展示权重的150%。

此前持续偏离这些模式的参与者将不在 `allowlist` 内，直至稳定期在区块 2222222 结束。

**可复现性与方法论**

`allowlist` 基于公开可观察的链上数据，使用预定义的硬件配置模式集生成。这些模式通过以下开源脚本进行评估：[https://github.com/product-science/filter](https://github.com/product-science/filter)

`allowlist` 可在此处查看：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)

**执行特性**

- 若提案通过，`allowlist` 将自动生效
- 无需软件升级
- `allowlist` 将在投票成功后的下一次PoC期间激活，预计在区块 2089140
- 自此时起，`allowlist` 将持续有效至并包括区块 2222222
- 如需进一步调整，仍需通过治理流程决定

**稳定期结束后**

`allowlist` 设有固定失效时间，不会延续至稳定期之后。一旦 `allowlist` 在区块 2222222 失效：

- 网络将恢复至稳定期前适用的标准参与规则，或
- 任何替代配置必须通过另行的治理决策来定义

**如何投票**

您可使用 `allowlist` 命令获取提案详情并提交投票。  
请注意，任何活跃节点均可用于查询或投票。当前可用节点包括：

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

该流程将完全通过治理机制处理，无需进行软件升级。

**时间线与截止日期**

- 投票结束时间：2026年1月10日 06:46:52 UTC  
- `Allowlist` 激活时间：下一次 PoC 执行后，区块 2089140 起生效  
- `Allowlist` 失效时间：区块 2222222 时自动失效  

请各位节点运营者查看并参与投票。

## 2026年1月8日

**网络更新 — 共识已恢复**

在补丁部署后，网络共识已趋于稳定，目前运行在正常参数范围内。

## 2026年1月8日

**网络更新 — 补丁已准备就绪，可进行部署**

针对最近 PoC 期间出现的共识故障问题，相关补丁现已发布。

[指南](https://gonka.ai/FAQ/#upgrade-v027)

为恢复可靠的共识进展，**至少需要 67%** 的活跃网络算力节点安装该补丁。

在达到此阈值之前，共识推进可能仍不稳定。

**建议所有节点尽快应用补丁，并在升级后保持在线。**  
如有需要，将进一步发布操作指引。

## 2026年1月8日

**网络更新 — 后续说明**

解决近期共识问题的补丁已准备就绪，详细操作说明将很快发布。  
每位活跃节点的参与对网络恢复正常运行至关重要。请保持在线，并在更新说明发布后及时应用补丁。

## 2026年1月8日

**网络更新 — PoC 期间发生共识故障**

在执行计算证明（Proof-of-Compute, PoC）过程中，网络出现了共识故障。  
目前问题已被定位，修复补丁正在紧急准备中，技术细节与后续操作指引将很快公布。  
建议所有节点保持在线并持续关注更新，补丁发布后可能需要立即采取行动。

## 2026年1月8日

**v0.2.7 升级提案：创世验证者增强机制已在主网上线**

关于 **v0.2.7 升级提案：创世验证者增强机制** 的链上治理投票已结束，提案已获 **通过**，并成功在主网上部署。

**现已生效的关键变更：****创世验证者增强机制（临时性）**

- 临时重新启用“创世验证者增强机制”——此前曾短暂启用过的防御性机制，现决定重新激活。  
- 该机制用于在网络增长阶段提供共识保护。在之前运行期间：
 
 
   - 三个守护者（Guardian）验证者共持有约 34% 的共识投票权
 
 
   - 守护者验证者未获得额外奖励
 
 
   - 此配置有效防止了极端情况下的共识停滞
- 创世验证者增强机制将在满足以下两个条件时自动停用：
 
 
   - 网络总算力达到 15,000,000
 
 
   - 区块高度达到 3,000,000

**协议稳定性修复（全网范围）**

本次升级将此前通过手动 API 更新方式分发、且已在网络中运行的关键修复正式纳入协议。这些修复包括：

- 修正了失败推理请求的会计记录问题（包括对不支持格式的请求被处理但未标记为完成的情况）
- 提升了对失败推理请求处理的容错能力
- 引入了 `PoCBatch` 和 `PoCValidation` 交易的批量处理机制

通过将这些修复纳入协议，其行为将成为全网一致遵循的协议级规则。

**临时参与与执行限制**

- **节点注册限制**：在达到区块 2,222,222 前（约两周内），暂停新节点的注册。此措施旨在稳定网络，为后续扩展做准备。  
- **开发者地址注册限制**：在稳定期间暂停新开发者地址注册。立即生效一个预定义的 `allowlist` 开发者地址白名单。在此期间，白名单内的开发者地址可正常执行推理任务。所有针对开发者地址的限制（包括注册与推理执行）将持续至区块 2,294,222（约19天后）。

**由治理控制的机制**

本次升级包含的预备性变更，使未来可通过治理机制控制参与者准入与推理执行，而无需额外的软件升级。本次提案本身**不启用**任何此类治理控制功能，相关功能需经后续治理投票决定。

**第117轮奖励发放**

本提案涉及因链暂停而延迟的第117轮奖励发放：

- 在第117轮期间活跃但未收到奖励的节点，将补发该轮奖励。
- 所有在第117轮期间活跃的节点，将获得一笔额外支付，金额为第117轮奖励的 **1.083 倍**，适用于所有符合条件的节点（包括已收到原始奖励的节点）。

**关于持续时间与执行的说明**

本次升级重新激活或引入的所有保护机制均为临时性，无需手动治理干预即可自动解除。

**下一步操作：**

- 节点无需采取进一步操作。
- Cosmovisor 在每次更新时会自动在 `.inference` 状态文件夹中创建完整备份。为安全执行更新，建议预留 **250 GB 以上** 的磁盘空间。[点击此处](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory) 了解如何安全清理 `.inference` 目录中的旧备份。

**备注：**

- 创世验证者增强机制的完整技术细节详见：  
[https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)
- 完整技术评审（GitHub PR）：  
[https://github.com/gonka-ai/gonka/pull/503](https://github.com/gonka-ai/gonka/pull/503)

## 2026年1月7日

**v0.2.7 版本升级提案** 已通过链上治理投票获得批准。

**升级详情**

- 升级高度：区块 2,054,000  
- 预计时间：2026年1月8日 08:10:00 UTC  

建议提前预下载升级二进制文件，以避免升级期间依赖 GitHub 的可用性。

```

#
 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.7/bin \
              .inference/cosmovisor/upgrades/v0.2.7/bin && \

#
 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.7/decentralized-api-amd64.zip" && \
echo "03555ba60431e72bd01fe1fb1812a211828331f5767ad78316fdd1bcca0e2d52 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.7/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

#
 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.7/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.7/inferenced-amd64.zip" && \
echo "b7c9034a2a4e1b2fdd525bd45aa32540129c55176fd7a223a1e13a7e177b3246 inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.7/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced && \
echo "Inference Installed and Verified" && \

#
 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--
- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced && \
echo "d07e97c946ba00194dfabeaf0098219031664dace999416658c57b760b470a74 .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api" | sudo sha256sum --check && \
echo "09c0e06f7971be87ab00fb08fc10e21ff86f9dff6fc80d82529991aa631cd0a9 .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced" | sudo sha256sum --check
```

当所有命令都成功完成且显示确认消息时，即可认为二进制文件已成功安装。
```

Inference Installed and Verified
--
- Final Verification --
-
-rwxr-xr-x 1 root root 224376384 Jan  1  2000 .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api
-rwxr-xr-x 1 root root 215172352 Jan  1  2000 .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced
.dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api: OK
.inference/cosmovisor/upgrades/v0.2.7/bin/inferenced: OK
```

**注意**

- 请在升级窗口期间保持在线，以便在出现问题时及时跟进相关指示。
- Cosmovisor 在升级期间会自动对 `.inference/data` 目录创建完整备份，请确保有足够的磁盘空间。如果磁盘使用率较高，可安全删除 `.inference` 中较旧的备份。[了解更多](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)
- 较大的 `application.db` 文件可通过[以下方法](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)进行缩减。

**可选：跳过 Cosmovisor 备份**

Cosmovisor 支持通过为 `node` 容器设置环境变量 `UNSAFE_SKIP_BACKUP=true` 来跳过升级期间的自动状态备份。

此操作可减少磁盘占用并缩短升级时间。但若升级失败，将无备份可用于恢复先前状态。

## 2026年1月7日

**致各节点运营者的重要提示**

可通过为 `node` 容器设置环境变量 `UNSAFE_SKIP_BACKUP=true` 来跳过 Cosmovisor 升级时的自动备份。  
该选项存在风险——若升级失败，您将无法通过备份恢复系统状态。

## 2026年1月6日

**v0.2.7 升级提案：创世验证者增强机制进入治理阶段**

一项与“创世验证者增强机制”相关的链上治理提案已发布，现进入投票阶段。

近期网络快速增长带来了一系列挑战。过去几天中，网络经历了多次异常，部分问题疑似由蓄意干扰或压力攻击所致。本提案旨在通过一系列临时措施，增强网络在高负载和不利条件下的稳定性。

“创世验证者增强机制”最初在网络启动初期作为临时防御机制引入，并在前两个月运行。本次提案旨在根据当前网络状况，临时重新启用该已有机制，并激活部分额外保护措施。

**主要变更****创世验证者增强机制（临时启用）**

- 临时重新启用“创世验证者增强机制”——此前已使用过的限时防御机制，现提议重新激活。
- 在网络增长期间提供共识保护。该机制此前运行期间：
 
 
   - 三个守护者验证者共同持有约 34% 的共识投票权
 
 
   - 守护者验证者未获得额外奖励
 
 
   - 此配置有助于防止极端情况下的共识停滞
- 当满足以下两个条件时，创世验证者增强机制将自动停用：
 
 
   - 网络总算力达到 15,000,000
 
 
   - 区块高度达到 3,000,000

**协议稳定性修复（全网范围）**

本次升级将此前通过手动 API 更新部署并已在网络中运行的关键修复正式纳入协议。这些修复包括：

- 修正失败推理请求的会计核算问题（包括对不支持格式的请求被处理但未标记为完成的情况）
- 提升对失败推理处理的容错能力
- 引入 `PoCBatch` 和 `PoCValidation` 交易的批量处理机制

通过将其纳入协议，这些行为将成为全网一致遵循的协议级规则。

**临时参与与执行限制**

- **节点注册限制**：新节点（Host）注册将在区块 2,222,222 前暂停（约两周）。该措施旨在稳定网络并为后续增长做准备。
- **开发者地址注册限制**：在稳定期间暂停新开发者地址注册。立即生效一个预定义的 `allowlist`。列入白名单的开发者地址在此期间可继续执行推理任务。所有适用于开发者地址的限制（包括注册与推理执行）将持续至区块 2,294,222（约19天后）。

**由治理控制的机制**

本次升级包含的预备性变更，将使未来可通过治理投票控制参与者准入和推理执行，而无需再次进行软件升级。但本次提案不启用任何此类治理驱动的限制，相关功能需后续治理投票激活。

**第117轮奖励发放**

本提案涵盖因链暂停（第117轮）导致的两次奖励发放：

- 在第117轮活跃但未收到该轮奖励的节点，将补发其应得奖励。
- 所有在第117轮活跃的节点，将额外获得相当于其第117轮奖励 1.083 倍的统一补贴，适用于包括已领取原始奖励在内的所有符合条件的节点。

**关于持续时间与执行的说明**

本次升级重新启用或引入的所有保护机制均为临时性，无需手动治理干预即可自动解除。

**如何投票**

您可使用 `inferenced` 命令获取提案详情并进行投票。

查询投票状态：
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

**时间线与截止日期**

- 投票截止时间：2026年1月8日 04:23:14 UTC。
- 升级提议区块高度：2,054,000。
- 预计升级时间：2026年1月8日 08:10:00 UTC。

**主机注意****注意 1**

请审阅该提案，若您为主机节点，请参与投票。  
在升级时间窗口附近保持在线，以便在出现问题时及时跟进处理。

**注意 2**

Cosmovisor 每次执行更新时，都会在 `.inference/data` 状态文件夹中创建一个完整备份，请确保您的磁盘有足够空间。  
请阅读[此处](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)了解如何安全地从 `.inference` 目录中删除旧备份。  
如果您的 `application.db` 占用大量空间，可参考[此处](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)的技术方法进行清理。

**参考资料**

“创世验证节点增强”（Genesis Validator Enhancement）的完整技术细节请参见：  
[https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)

完整技术评审（GitHub PR）：[https://github.com/gonka-ai/gonka/pull/503](https://github.com/gonka-ai/gonka/pull/503)  

## 2026年1月5日
当前网络上观察到高于正常水平的推理任务遗漏率。  
在多数情况下，这是由于一个漏洞导致：以不支持格式发出的推理请求虽已被处理，但系统未将其标记为完成。以下更新修复了此问题。

参考资料：[https://github.com/gonka-ai/gonka/pull/517](https://github.com/gonka-ai/gonka/pull/517)

此 `API` 版本增强了对失败推理处理的容错能力，并减少了遗漏推理的统计问题。同时引入了 PoCBatch 和 PoCValidation 交易的批量处理机制。

**升级时机**

当确认型 PoC（Confirmation PoC）未激活时，应用此更新是安全的。

验证当前状态的方法：
```

curl "http://136.243.34.19:8000/v1/epochs/latest" | jq '.is_confirmation_poc_active'
```

在确认 PoC 之外，此值应返回 `false`。

**安装**

下载并安装新的二进制文件，然后重启 `API` 容器：
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
echo "--
- Final Verification ---" && \
sudo rm -rf .dapi/cosmovisor/current
sudo ln -sf upgrades/v0.2.6-post12 .dapi/cosmovisor/current
echo "4672a39c3a3a0a2c21464c227a3f36e9ebf096ecc872bf9584ad3ea632752a3e .dapi/cosmovisor/current/bin/decentralized-api" | sudo sha256sum --check && \


# Restart 
source config.env && docker compose up api --no-deps --force-recreate -d
```
