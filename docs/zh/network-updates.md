# 公告

!!! note "关于此页面"

    此页面由社区成员维护和更新。

    要发布公告，例如您发起的治理投票，请在 gonka-docs 仓库中打开一个拉取请求：[https://github.com/gonka-ai/gonka-docs](https://github.com/gonka-ai/gonka-docs)

    此页面的内容不保证完整。如需获取最新信息，包括治理投票的发布及其当前状态，请参考链上数据或查看可用的浏览器和仪表板。

## 2026年9月4日

**Devshard 二进制更新：`v4.0.2`**

`v4.0.2` devshard 二进制文件已可用。主机可使用以下说明手动更新 v4 二进制文件。尚未安排自动更新。

**变更内容**

重启时，`v4.0.1` 从 nonce 1 恢复了所有会话。拥有大量存储会话的节点需要数小时才能就绪，`versiond` 随后在 60 秒就绪超时后终止了子进程，客户端因此看到 HTTP 502 错误。

`v4.0.2` 加载最新快照并仅恢复其后的差异。此版本与之前的 v4 发布版本完全兼容。

发布：[devshard/v4.0.2](https://github.com/gonka-ai/gonka/releases/tag/release/devshard/v4.0.2)

**更新说明**

一次更新一个节点，并在继续下一个节点前确认其已恢复正常。

```shell
sudo mkdir -p ./devshards/bin/override/v4 && \
wget -q -O /tmp/devshardd-v4.0.2.zip 'https://github.com/gonka-ai/gonka/releases/download/release%2Fdevshard%2Fv4.0.2/devshardd.zip' && \
echo "38aea0a4f1658e85321d11149efa247e565e952c51db4d268a02e0a6f0734200  /tmp/devshardd-v4.0.2.zip" | sha256sum --check --status && echo checksum_ok && \
sudo unzip -qo -j /tmp/devshardd-v4.0.2.zip -d ./devshards/bin/override/v4/ && \
sudo chmod 755 ./devshards/bin/override/v4/devshardd && \
test -f ./devshards/bin/override/v4/devshardd && \
docker pull -q ghcr.io/product-science/versiond:0.2.15 >/dev/null && \
test "$(docker run --rm --entrypoint /devshardd -v ./devshards/bin/override/v4/devshardd:/devshardd:ro ghcr.io/product-science/versiond:0.2.15 --print-protocol-version)" = v4 && echo protocol_v4
```

向 `docker-compose.yml` 添加此环境变量：

```yaml
  versiond:
    ...
    environment:
    ...
      - VERSIOND_FORCE=v4
      - VERSIOND_OVERRIDE_v4=/opt/versiond/bin/override/v4/devshardd
```

然后重启：

```shell
source config.env && docker compose up versiond -d --no-deps --force-recreate
```

**检查已部署的版本**

```shell
curl <your_node_url>/devshard/v4/stats/shards | jq '.binary_version'
```
## 2026年8月29日

**提案已通过：将 DeepSeek V4 Flash 的 weight_scale_factor 提高至 0.246**

提案 ID 为 98 的链上治理投票已结束。

该提案已被批准。它将 `weight_scale_factor` 对 `deepseek-ai/DeepSeek-V4-Flash-0731` 的值从 0.214 提高至 0.246。所有其他模型和链参数保持不变。这是提案 97 的重新提交。链上，提案 97 最终结果为 `PROPOSAL_STATUS_REJECTED`，结果为 `failed_reason`：`proposal did not get enough votes to pass`（未达到 25% 的投票门槛）。最终投票结果：赞成 15452，弃权 3093，反对 0，否决 0。

原始的 0.214 因子源于被夸大的 nonce/min 数值。测量修复见 [gonka-ai/gonka#1640](https://github.com/gonka-ai/gonka/pull/1640)。主机无需执行任何操作。

感谢所有参与投票的人员。

## 2026年8月25日

**仅 devshard 升级的 PR 现已开放供审查**

Devshard 升级独立于主区块链更新 devshard 运行时。它们不需要通过 Cosmovisor 协调全节点升级，不影响主网行为，预计不会造成推理服务的停机。如果通过治理流程批准，新的 devshard v5 运行时将与现有的 v4 运行时并行运行。

**主要变更**

1. v5 的主要目的是高度同步：每个主机和排序器在托管日志中保留一个经过签名、可重放的主网高度视图，即使在没有推理流量时也是如此。借助此时钟，devshard 现在可以明确知道 cPoC 正在运行，并将参与者跳过的推理视为合法跳过。高度同步协议设计：[HEIGHT_SYNC_PROTOCOL_PROPOSAL.md](https://github.com/gonka-ai/gonka/blob/ak/height-sync-protocol/devshard/docs/proposals/HEIGHT_SYNC_PROTOCOL_PROPOSAL.md)

2. 差异高度标记为协议增加了逻辑时间。`observed_height` / `observed_block_hash` 标记已存在于所有先前携带时间戳字段的消息中。后续版本可将诸如 `confirmed_at` 和 `started_at` 等墙钟字段替换为高度标记。这解决了时间未来攻击问题，并为在协议层面处理流超时打开了道路。本次发布包含这些标记，但尚未将超时和密封决策切换至它们。

3. 通过所有插槽的往返心跳机制已添加，因此即使会话安静，仍能定期同步高度；而繁忙会话则可通过常规推理标记实现相同的节奏。

**操作事项**

请审查 PR [gonka-ai/gonka#1584](https://github.com/gonka-ai/gonka/pull/1584)，并对任何发现、疑问、改进建议、边缘情况或潜在漏洞留下评论。

有意义的审查贡献，包括重要评论、错误发现和安全问题，可能有资格在下一轮升级中获得社区奖励。

本次仅为 PR 审查请求。不启动正式投票。

## 2026年8月25日

**提案 97 已开放投票：将 DeepSeek V4 Flash 的 weight_scale_factor 提高至 0.246**

一个新的链上治理提案（提案 ID 97）已开放投票。

**内容**

将 `weight_scale_factor` 对 `deepseek-ai/DeepSeek-V4-Flash-0731` 的值从 0.214 提高至 0.246。所有其他模型和链参数保持不变。

**投票**

投票将于 **8月27日 03:47 UTC** 结束。如有可能，请参与投票。

提案详情和投票可通过 `inferenced` 查看。任何活跃节点均可使用：

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai

投出您的投票（`yes`，`no`，`abstain`，`no_with_veto`）：

```shell
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 97 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```

查看投票状态：

```shell
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 97 -o json --node $NODE_URL/chain-rpc/
```

## 2026年8月21日

**提案通过：稳定小样本下周期内无效SPRT**

提案ID为96的链上治理投票已结束。

该提案已获批准。它调整了在周期早期数据不足时无效推断检查（SPRT）的行为，避免过早误触发。主机无需采取任何操作。

感谢所有参与投票的人。

## 2026年8月20日

**提案96开放投票：稳定小样本下周期内无效SPRT**

一个新的链上治理提案（提案ID 96）已开放投票。

**其作用**

在周期初期，数据量尚不足，因此无效推断检查（SPRT）可能在样本足够大之前，仅因少量无效数据就被触发。本提案使其更稳定：

- 将 `invalidation_h_threshold` 提高至40，并将 `bad_participant_invalidation_rate` 设为0.18。
- 在大样本情况下，阈值接近10%的无效率，因此低于该阈值的诚实参与者不会受到惩罚。真正的违规者仍会被触发（约在360个样本时为18%，在1650个样本时为12%）。
- 小样本无法触发：至少需要32个被标记的无效数据，且在500个样本时，观察到的比率必须超过16%。
- 未使用的停机时间SPRT已被关闭。周期末统计测试不受影响。

**投票**

这是一个加速提案，因此投票将于 **8月21日 06:04 UTC**（约12小时后）结束。如有可能，请参与投票。如果未能在时限内达到加速阈值，提案不会被拒绝：它将转为常规提案，投票将继续进行更长的常规周期。若转为常规提案，您需要重新投票。

提案详情和投票可通过 `inferenced` 查看。任何活跃节点均可使用：

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai

投出您的投票（`yes`，`no`，`abstain`，`no_with_veto`）：

```shell
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 96 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```

查看投票状态：

```shell
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 96 -o json --node $NODE_URL/chain-rpc/
```
## 2026年8月18日

作为协议开发的重要里程碑，链已准备好逐步启用devshard结算，以提升网络的安全性和可靠性。

一个稳定的网关版本目前正运行在一个网关上，并将用于第一阶段结算。其统计数据（代表部分网络流量）可在此查看：[https://tracker.gonka.pro/?view=gateway&epoch=364](https://tracker.gonka.pro/?view=gateway&epoch=364)

**如何阅读仪表板**

此仪表板从网关的角度显示每个主机执行的工作。在结算启用后，Misses 和 Invalid 指标将用于链上。根据当前主网阈值配置，错误率低于10%的主机不会触发任何处罚或罚没，但仍应作为协议开发过程的一部分进行调查。

错误率较高的主机应在结算开始前解决这些问题。无显著问题的主机无需采取任何操作。

仪表板还显示了网关内部细节，例如特定主机的请求失败原因或无效上下文长度，有助于排查主机端问题。超调度和隔离部分旨在为网关开发提供洞察，主机无需操作。

**下一步：****1) 接下来的24小时。** 主机应检查其统计数据并解决任何关键错误或配置问题。如有需要，贡献者可协助调查问题。

**2) 在此24小时窗口后的第一个周期。** 将在当前网关上手动启动结算，首先针对较小模型。此过程将被密切监控，以尽量减少误报记录。Kimi 将稍后跟进，因为其数据在负载下目前可靠性较低。

**3) 随后的1-3天内。** 将监控结算结果

**4) 一旦此阶段稳定。** 其他经纪人可以部署稳定的网关版本，并开始以受控模式进行结算。

**5) 在所有经纪人成功验证后。** 结算覆盖率将逐步提升至100%。

部署过程故意缓慢进行，以便在扩大全网结算前发现并解决任何意外问题。

## 2026年8月14日

**DeepSeek V4 Flash 现已在 Gonka 网络上激活**

在 [提案 94](https://gonka.ai/docs/network-updates/#august-10-2026) 中宣布的引导阶段已完成。自链纪元 360 起，`deepseek-ai/DeepSeek-V4-Flash-0731` 与 MiniMax-M2.7 和 Kimi K2.6 一同成为活跃模型组，DeepSeek 组中获得的 PoC 权重现在以校准系数 0.214（后经 [提案 98](#august-29-2026) 提高至 0.246）转换为共识权重。

DeepSeek 的按模型参与强制执行现已生效。已为 DeepSeek 选择 DIRECT、DELEGATE 或 REFUSE 的主机无需任何操作——现有设置将继续正常工作。尚未做出选择的主机请尽快选择，以避免每纪元处罚（[https://gonka.ai/docs/host/deepseek-bootstrap/](https://gonka.ai/docs/host/deepseek-bootstrap/)）。

## 2026年8月14日

**MLNode 3.0.16 部署**

如果您的所有节点均已使用新版本（3.0.16），则无需操作。

如果仍有节点运行旧版 MLNode（即仍在服务 Kimi 或 MiniMax 的节点，因为已部署 DeepSeek 的节点均已使用 3.0.16），请在方便时将这些节点升级至 3.0.16。

一个请求：请逐步部署。请勿一次性切换所有节点。请先更新少量节点，确认稳定后再更新其余节点。在验证新版本时保持其余节点继续运行是最安全的方式。

MLNode 镜像已在 [`docker-compose.mlnode.yml`](https://github.com/gonka-ai/gonka/blob/vllm-0.25.1-upgrade/deploy/join/docker-compose.mlnode.yml) 的 `vllm-0.25.1-upgrade` 分支中固定为 3.0.16。

默认 MLNode 镜像（3.0.16）基于 CUDA 13.0 构建。如果您的主机仍使用 CUDA 12.9，请改用 `3.0.16-cu129` 标签。这是相同的 MLNode 3.0.16，仅针对 CUDA 12.9 构建。两个标签均在同一个 compose 文件中。

更新后，请使用 `mlnode-validate` 进行验证。

## 2026年8月13日

**迁移社区销售和封装代币合约**

将线上社区销售合约及所有封装代币实例迁移至新存储的 CosmWasm 代码，并注册该封装代币代码以供未来实例化。合约地址和余额保持不变。无需链二进制升级。此举旨在缓解安全报告中发现的理论风险，预计不会影响正常运行。
创世守护者预计会支持该提案。

**如何投票**

如果您无法直接访问拥有投票权的密钥，或希望由其他密钥代为投票，请参阅 [指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf) 了解如何将治理投票权限从冷密钥授予热密钥。
提案详情和投票可通过 `inferenced` 进行。任何活跃节点均可使用。可用节点包括：

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai

投出您的选票（`yes`，`no`，`abstain`，`no_with_veto`）：`--unordered` 和 `--timeout-duration` 标志需要 v0.2.12 或更高版本的 `inferenced`。
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 95 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```
要检查投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 95 -o json --node $NODE_URL/chain-rpc/
```

**截止日期**

- 投票结束：2026年8月14日 12:01 UTC
- 预计迁移时间：2026年8月14日 12:01 UTC

## 2026年8月13日

**DeepSeek V4 Flash 启动：意向阈值已达成——请在 epoch 360 快照前完成委托**

`deepseek-ai/DeepSeek-V4-Flash-0731` 在 epoch 359 快照时未能满足预合格条件。此后，实时意向和委托权重已满足 `V_min`、`W_threshold` 以及 **>2/3 可达性**（DeepSeek 意向权重加上委托给这些主机的权重）。下一次**官方**检查是 epoch 360 启动快照——在此前请保持委托分散，以确保快照有效。

**将运行 DeepSeek 的主机**

1. 在区块 **5,551,615** 之前保留或提交 `MsgDeclarePoCIntent`：
```
./inferenced tx inference declare-poc-intent deepseek-ai/DeepSeek-V4-Flash-0731
```
2. 如果模型已预合格，请在 PoC 开始（区块 **5,552,115**）前的约 500 区块部署窗口内部署 DeepSeek。使用 vLLM 0.25.1 + 发布候选节点配置。

**保留其他模型的主机**

在区块 **5,551,615** 之前，提交委托（有助于启动可达性）或拒绝。从 epoch **360** 起，DeepSeek `penalty_start_epoch` 将激活——未明确选择的主机将面临不参与惩罚。

```
./inferenced tx inference set-poc-delegation deepseek-ai/DeepSeek-V4-Flash-0731 <DELEGATEE>
```

或

```
./inferenced tx inference refuse-poc-delegation deepseek-ai/DeepSeek-V4-Flash-0731
```

委托主机：选择**非守护者**的 DeepSeek 意向主机，并将权重分散到独立目标上——参见 [多模型 PoC 指南](https://gonka.ai/docs/host/multi_model_poc/)。

**关键时间点*** Epoch 360 快照（`start_poc − deploy_window`）：区块 **5,551,615** —— 约 2026年8月14日 01:24 UTC
* Epoch 360 PoC 开始：区块 **5,552,115** —— 约 2026年8月14日 02:09 UTC
* DeepSeek 不参与惩罚从 epoch **360** 开始

更多关于启动机制的说明：[https://gonka.ai/docs/host/deepseek-bootstrap/](https://gonka.ai/docs/host/deepseek-bootstrap/)

## 2026年8月13日

**测试 DeepSeek V4 Flash**

DeepSeek 已通过投票并进入启动阶段——如果您计划提供服务，请验证您的设置并立即提交意向。

您所需的一切都在 [`vllm-0.25.1-upgrade` 分支](https://github.com/gonka-ai/gonka/tree/vllm-0.25.1-upgrade/deploy/join) 上。

**1) MLNode (vLLM 0.25.1)**

从该分支获取 MLNode 栈——默认镜像已在 [compose 文件](https://github.com/gonka-ai/gonka/blob/vllm-0.25.1-upgrade/deploy/join/docker-compose.mlnode.yml) 中固定。

**2) 预制节点配置**

同一文件夹下——选择您的 GPU 类别：

- `node-config-deepseekv4flash0731-H100.json`
- `node-config-deepseekv4flash0731-H200.json`
- `node-config-deepseekv4flash0731-B200.json`
- `node-config-deepseekv4flash0731-B300.json`

为在 B* 卡上获得最佳性能，您可以使用从 fp8 + fp4 重新打包为 fp8 + nvfp4 的模型：

- `node-config-deepseekv4flash0731-B200-nvfp4.json`
- `node-config-deepseekv4flash0731-B300-nvfp4.json`

以该格式运行模型需要新的 API 版本 v0.2.15-post5。安装方法：
```bash
sudo rm -rf decentralized-api.zip .dapi/cosmovisor/upgrades/v0.2.15-post5/ .dapi/data/upgrade-info.json
sudo mkdir -p  .dapi/cosmovisor/upgrades/v0.2.15-post5/bin/
wget -q -O  decentralized-api.zip 'https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.15-post5/decentralized-api-amd64.zip' && \
echo "f2b880371f782ff531510bf294b91b1f2945ee366780ef6f7583b91b3bc34ee7  decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j  decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.15-post5/bin/ && \
sudo chmod 755 .dapi/cosmovisor/upgrades/v0.2.15-post5/bin/decentralized-api .dapi/cosmovisor/upgrades/v0.2.15-post5/bin/inferenced && \
echo "4546ddab1078931079932e5cd7eb56d22bc3d963fbc6f5f7955d3a37e1a15a6a  .dapi/cosmovisor/upgrades/v0.2.15-post5/bin/decentralized-api" | sudo sha256sum --check && \
echo "API Installed and Verified"  && \

docker stop api && \
sudo rm -rf .dapi/cosmovisor/current && \
sudo ln -sf upgrades/v0.2.15-post5 .dapi/cosmovisor/current && \
docker start api
```
然后使用新的 `model_override` 字段：
```json
        "model_override": {
          "hf_repo": "MJPansa/DeepSeek-V4-Flash-0731-NVFP4",
          "hf_commit": "64d64cd89bc63a66aa46506da89d7821f7491c62"
        },
```
[完整示例](https://github.com/gonka-ai/gonka/blob/aaaa5854c1853696e59406d4d6546b6d6d526587/deploy/join/node-config-deepseekv4flash0731-B300-nvfp4.json#L10)。

建议逐步将节点切换到新 API，而非一次性全部更换。

**3) 使用 mlnode-validate 验证**

该技能现已支持 DeepSeek。它位于独立的 `./skills` 文件夹中，无需任何代理特定设置——将其符号链接至 `.claude/skills` 并运行 [`mlnode-validate` 技能](https://github.com/gonka-ai/gonka/tree/vllm-0.25.1-upgrade/skills/mlnode-validate)。
```
/mlnode-validate how to use
/mlnode-validate <your-node-ip:port> @deploy/join/node-config-deepseekv4flash0731-B300.json
```
该技能部署模型，测量PoC吞吐量，并将您的输出向量与黄金参考（`deepseek-ai-deepseek-v4-flash-0731.json`）进行比对。若通过，则您已合格。

如果您希望提供DeepSeek服务，请使用上述步骤进行设置。否则，请不要忘记委托，以免遭受不参与惩罚。

提醒：明天将上线另一个带有更好日志的MLNode构建，预计会有简短的后续通知。

## 2026年8月12日

**DeepSeek V4 Flash 启动（第359轮）**

提案94已通过——DeepSeek V4 Flash已获批准。计划提供该模型的主机应立即声明意向，以便模型能在第359轮启动。

[包含系数的完整表格](https://docs.google.com/spreadsheets/d/1Tw4V7xEXR2p5MbCHqzqjS9vHXQ0eI1IHVXC6guEHnio/edit?gid=0#gid=0)

**效果**

从第359轮开始（PoC启动时间约为2026年8月13日03:24 UTC / 8月12日20:24 PDT），前提是模型满足启动资格：

- `deepseek-ai/DeepSeek-V4-Flash-0731`成为可用的PoC模型。
- `MiniMaxAI/MiniMax-M2.7`保持为基础模型。
- `moonshotai/Kimi-K2.6`保持可用且不变。

**主机所需操作**

1. 声明意向。鉴于提案94已通过，且在区块5,536,224（约2026年8月13日02:40 UTC / 8月12日19:40 PDT）的启动快照之前，请提交：
```
./inferenced tx inference declare-poc-intent deepseek-ai/DeepSeek-V4-Flash-0731
```
2. 切换您的MLNode。在PoC 359启动前约500个区块的安全窗口内（区块5,536,724，约2026年8月13日03:24 UTC / 8月12日20:24 PDT），配置并切换您的MLNode至DeepSeek V4 Flash（vLLM 0.25.1 + 发布候选配置）。此窗口内切换是安全的，因为其中没有cPoC。
注意：在Blackwell GPU上，为获得最佳性能，您可以使用经重新打包为fp8 + nvfp4的模型而非fp8 + fp4，例如 `MJPansa/DeepSeek-V4-Flash-0731-NVFP4`。模型精度相同。部署该模型前，将发布并共享更新的API二进制文件。
3. 如果您委托。请勿委托给守护节点；请将委托分散至独立的DeepSeek主机。参见[多模型PoC指南](https://gonka.ai/docs/host/multi_model_poc/)。
4. 要保留当前模型。在第360轮之前无需操作。从第360轮起，若您未提供DeepSeek服务，请提交 `PoCDelegation` 或 `PoCRefusal`，否则将适用15%的不参与惩罚。

区块高度是精确的；时间是估算值，将在接近轮次时确定。[更多关于DeepSeek启动的细节](https://gonka.ai/docs/host/deepseek-bootstrap/)。

## 2026年8月10日

**治理投票（提案94）：添加DeepSeek V4 Flash**

将 `deepseek-ai/DeepSeek-V4-Flash-0731` 添加至PoC模型列表的提案现已上链并开放投票。

**提案内容**

本提案将DeepSeek V4 Flash作为新的PoC模型添加至网络。未修改任何现有参数或模型，唯一变更即新增该模型条目。

详情：

- 模型：`deepseek-ai/DeepSeek-V4-Flash-0731`（固定版本 `7872f01b1d1fe23eabc4c98b48bffcef5a386062`）
- 需使用vLLM 0.25.1及发布候选节点配置（`node-config-release-candidate-*.json`适用于B300 / B200 / H200 / H100）
- 候选链参数：PoC `weight_scale_factor = 0.214`，推理 `validation_threshold = 0.90`（处理后的logprobs），`penalty_start_epoch = 360`

DeepSeek的0.214系数为在B300上托管DeepSeek提供了轻微优势。对于其他硬件，产生最高PoC权重的模型保持不变。

与运行MiniMax M2.7的8xH100集群相比：

- 8xH200最优可产生1.46倍权重运行MiniMax M2.7
- 8xB200最优可产生2.96倍权重运行Kimi K2.6
- 8xB300最优可产生3.37倍权重运行DeepSeek V4 Flash

基于模型使用情况，社区后续可决定逐步用DeepSeek替代Kimi或MiniMax（例如，提高系数以激励所有B系列GPU转向DeepSeek）。

包含系数的完整表格：[Google表格](https://docs.google.com/spreadsheets/d/1Tw4V7xEXR2p5MbCHqzqjS9vHXQ0eI1IHVXC6guEHnio/edit?gid=0#gid=0)

**启动机制说明**

模型通过标准启动流程进入，主机可在投入硬件前验证其可行性：

1. 声明意向：在 `start_poc - deploy_window` 快照前提交 `MsgDeclarePoCIntent`。
2. 预资格快照：链对意向和委托进行快照，并发出建议性预资格事件。
3. 部署窗口：已声明意向的主机配置其MLNode。
4. PoC开始：成员资格由在PoC开始时提交PoC存储提交的人决定，而不是由声明意向的人决定。

最终的MLNode版本和设置说明将在投票结束后发布。

有关引导过程的更多详情：[https://gonka.ai/docs/host/deepseek-bootstrap/](https://gonka.ai/docs/host/deepseek-bootstrap/)

**若获批准的影响**

在符合引导资格的前提下，从第359个周期（PoC开始时间约为2026年8月13日03:24 UTC / 8月12日20:24 PDT）起，`deepseek-ai/DeepSeek-V4-Flash-0731`将成为可用的PoC模型。现有模型保持不变。DeepSeek的不参与惩罚从第`360`个周期（`penalty_start_epoch = 360`）开始。

**主机所需操作**

1. 要提供该模型：在投票结束后声明意向，然后配置您的MLNode（vLLM 0.25.1 + release-candidate配置）：
```
./inferenced tx inference declare-poc-intent deepseek-ai/DeepSeek-V4-Flash-0731
```
2. 要保留您当前的模型：在第360个周期前无需操作；从第360个周期起，若您未提供该模型，则需为DeepSeek提交`PoCDelegation`或`PoCRefusal`。
3. 在截止日期前对提案94进行投票。

**如何投票**

如果您没有直接访问拥有投票权的密钥，或希望由另一个密钥代为投票，请参阅[指南](https://gonka.ai/docs/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)了解如何将治理投票权限从冷密钥授予热密钥。

提案详情和投票可通过`inferenced`访问：任何活跃节点均可使用：

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai

投出您的选票（`yes`，`no`，`abstain`，`no_with_veto`）：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 94 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```

要检查投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 94 -o json --node $NODE_URL/chain-rpc/
```

**截止日期**

投票持续48小时；投票将于2026年8月12日16:05 UTC / 2026年8月12日09:05 PDT结束。

## 2026年8月3日

**升级已完成：devshard 运行时 v4.0.1 现已上线**

针对 `v0.2.15-devshard-v4.0.1` 运行时升级提案（提案编号93）的链上治理投票已结束。

该提案已获批准，devshard v4 运行时已升级至 v4.0.1。`versiond` 自动下载并验证了替换二进制文件——无需重启主网或手动执行主机操作。

**API 二进制更新：`v0.2.15-post3`**

新的 API 二进制文件 `v0.2.15-post3` 已可用。

此版本提高了 PoC 种子的可靠性，并包含若干 API 和部署修复。

**变更内容**

- PoC 种子稳定性。在纪元边界延迟后恢复遗漏的种子提交，并在临时故障（如签名者不可用）后重试本地种子恢复，以防止验证者被归零。
- API。
    - `/v1/versions` 现在返回增强的 DAPI 版本信息，包括 ML 节点详情
    - 默认的 Node Manager gRPC 端口现已改为 9400，确保与自定义配置兼容
- 部署。默认的加入堆栈配置已更新为使用最新的 `v0.2.15-post2` API 镜像

完整拉取请求：[https://github.com/gonka-ai/gonka/pull/1528](https://github.com/gonka-ai/gonka/pull/1528)

**更新说明**

请更新 api 容器使用的二进制文件。
在开始更新前，请确保 CPoC 或 PoC 当前未在运行。
每次 PoC 开始前有 500 个区块的 CPoC 空窗期。请尽可能利用此窗口进行更新。
一次仅在一台机器上部署更新，以降低操作风险。

```
sudo rm -rf decentralized-api.zip .dapi/cosmovisor/upgrades/v0.2.15-post3/ .dapi/data/upgrade-info.json
sudo mkdir -p  .dapi/cosmovisor/upgrades/v0.2.15-post3/bin/
wget -q -O  decentralized-api.zip 'https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.15-post3/decentralized-api-amd64.zip' && \
echo "8cfa7345f5b7f968d5a1b765837b8319084c02d3dd2691b698c368774e20b55e  decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j  decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.15-post3/bin/ && \
sudo chmod 755 .dapi/cosmovisor/upgrades/v0.2.15-post3/bin/decentralized-api .dapi/cosmovisor/upgrades/v0.2.15-post3/bin/inferenced && \
echo "e3ceb97d7bbe6f6703e56a3052ea85ad20d4a49113baedded405e908c19f5d11  .dapi/cosmovisor/upgrades/v0.2.15-post3/bin/decentralized-api" | sudo sha256sum --check && \
echo "API Installed and Verified"  && \

docker stop api && \
sudo rm -rf .dapi/cosmovisor/current && \
sudo ln -sf upgrades/v0.2.15-post3 .dapi/cosmovisor/current && \
docker start api
```
## 2026年8月1日

**`v0.2.15-devshard-v4.0.1` 运行时升级提案已进入治理阶段**

这是一个非关键性的、仅限 devshard 的升级，独立于完整链软件升级运行。它将现有的 devshard v4 运行时替换为 v4.0.1。

这只是一个性能和资源管理补丁，除此之外无其他变更。协议、推理、验证和经济行为均保持不变。变更内容：纪元追踪从每区块链查询改为事件驱动更新，主机会话和验证工作线程的内存清理现在与纪元修剪对齐。

**升级计划**

devshard 运行时通过链上参数提案进行升级，而非完整链软件升级。若获批准，`versiond` 将自动下载并验证替换二进制文件。无需重启主网或手动执行主机操作。

**如何投票**

如果您没有直接访问拥有投票权密钥的权限，或希望由另一个密钥代为投票，请参考将冷密钥的治理投票权限授予热密钥的指南。

提案详情和投票可通过 `inferenced` 查看。任何活跃节点均可使用。可用节点包括：

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai

投出您的选票（`yes`，`no`，`abstain`，`no_with_veto`）：

```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 93 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```

要检查投票状态：

```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 93 -o json --node $NODE_URL/chain-rpc/
```

## 2026年7月30日

**升级已完成：v0.2.15 现已上线主网**

针对升级提案 v0.2.15（提案编号92）的链上治理投票已结束。

该提案已获批准，并于主网区块 5316315 成功执行升级。同一提案还批准了 devshard v4 运行时，该运行时现在与现有的 v3 运行时并行运行。

## 2026年7月29日

**升级 v0.2.15 和 devshard v4：预下载二进制文件**

针对 **devshard v4 和 v0.2.15** 升级提案的链上治理流程即将结束。

- 投票截止：2026年7月30日 07:08 UTC / 2026年7月30日 12:08 PDT
- 提议的升级高度：5316315
- 预计升级时间：2026年7月30日 15:28 UTC / 2026年7月30日 08:28 PDT

鼓励主机查看[GitHub](https://github.com/gonka-ai/gonka/pull/1497)上的提案并参与投票。

提前预下载二进制文件有助于在升级窗口期间避免依赖GitHub的可用性。

```
#1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.15/bin \
              .inference/cosmovisor/upgrades/v0.2.15/bin && \

# 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.15/decentralized-api-amd64.zip" && \
echo "c9cf1bfa2c994beca8a528d0ee3ad7197a582144769711600ec9df41faf4c9f7 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.15/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.15/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

# 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.15/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.15/inferenced-amd64.zip" && \
echo "91af67df9ef5c576a1695e5e85c8ee344f9f1a69d941bfc28fb339d9fd33617e inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.15/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.15/bin/inferenced && \
echo "Inference Installed and Verified" && \

# 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.15/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.15/bin/inferenced && \
echo "aeddf6391f24f99963c3e9ed854779087700161f520e73fd9e9b52f394f7ba6d .dapi/cosmovisor/upgrades/v0.2.15/bin/decentralized-api" | sudo sha256sum --check && \
echo "2da687d5a2511c00891ea29b16face87ef7998f49d5b626d09f810db38deb046 .inference/cosmovisor/upgrades/v0.2.15/bin/inferenced" | sudo sha256sum --check
```



## 2026年7月28日

**Devshard v4 和 v0.2.15 主网升级提案进入治理**

合并的**devshard v4 和 v0.2.15 主网升级提案**现已上链并开放投票。

本提案包含两部分：

1. 新**devshard v4 运行时**的批准与注册。
2. 一个**v0.2.15 主网软件升级**，移除大量过时代码、遗留交易处理路径及相关组件，这些已不再符合当前架构需求。

尽管这两项变更以单一投票提交审议，但它们在操作上是独立的：

- **devshard v4 运行时**通过 devshard 版本管理机制由 `versiond` 分发并启动。
- **主网 v0.2.15 二进制文件**通过标准的链上软件升级流程和 Cosmovisor 激活。

**Devshard v4 变更**

v4 的主要目标是在主机故障和升级时实现高可用性。当一台机器宕机或重启时，它仍能继续处理新请求；在版本升级时，多台机器逐台替换版本。这是系列变更中的首次更新，旨在将单体架构重构为高可用、容错、可扩展的架构。

v4 是首个为多实例高可用设计的版本：在共享 Postgres 后端部署 N 个 versiond / devshardd 副本，由 versiond-router 使用粘性会话路由和验证租约独占机制进行调度。网关仅通过 gRPC 与链通信。公共可观测性是无版本的（/devshard/sessions|stats|metrics）；只有托管方通过签名聊天绑定。当治理发布新二进制文件（名称不变，仅 sha256 变化）时，versiond 可执行蓝绿切换并排水，确保正在进行的工作（包括 SSE）在旧版本上完成。

v4 还包含错误修复和安全补丁。

**主网 v0.2.15 变更**

主网部分的升级移除了大量过时代码，包括不再符合当前架构需求的遗留交易处理路径及相关组件。
此清理简化了代码库，减少了不必要的复杂性，并提升了系统的整体稳定性和可维护性。同时，通过移除过时行为并围绕当前支持的架构整合交易处理，使未来的开发和升级更加便捷。


更多详情请查阅拉取请求：[https://github.com/gonka-ai/gonka/pull/1497 ](https://github.com/gonka-ai/gonka/pull/1497 )

**升级计划****主网 v0.2.15**

若获批准，二进制版本将通过链上升级提案更新。有关升级流程的更多信息，请参阅 [/docs/upgrades.md.](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.15/docs/upgrades.md)。

**Devshard v4**

本提案同时在 `DevshardEscrowParams.approved_versions` 中注册 devshard v4。

注册条目将包含：

- name: `v4`
- binary: `https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.15/devshardd.zip`
- sha256: `bdc7ee5d08f0090711c60950c7f3ffdd0c7aef5a5badf6f19c2b075b08264ddf`

发布版本将 `devshardd` 二进制文件作为 Gonka 发布工件。

提案获批后，`versiond` 可自动：

1. 下载已批准的二进制文件。
2. 将其 SHA-256 哈希值与链上存储的值进行验证。
3. 启动 v4 `devshardd` 运行时。
4. 通过相应的 devshard 路由配置提供运行时服务。

Devshard v4 将与现有的 v3 运行时并行运行。在经纪人和主机运营商准备并验证其 v4 部署期间，现有的 v3 流量可继续运行。

v4 的批准本身并不要求立即切换所有流量。在运行时启动并验证后，迁移可逐步进行。

**如何投票**

如果您没有直接访问拥有投票权的密钥，或希望由另一个密钥代表您投票，请参阅[指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何将治理投票权限从冷密钥授予热密钥。

提案详情和投票可通过 `inferenced` 查看。任何活跃节点均可使用。
可用节点包括：

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai

投出您的选票（`yes`，`no`，`abstain`，`no_with_veto`）：`--unordered` 和 `--timeout-duration` 标志需要 `inferenced` v0.2.12 或更高版本。
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 92 yes \
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
./inferenced query gov votes 92 -o json --node $NODE_URL/chain-rpc/
```

**截止日期**

- 投票结束：2026年7月30日 07:08 UTC / 2026年7月30日 12:08 PDT
- 提议的升级高度：5316315
- 预计升级时间：2026年7月30日 15:28 UTC / 2026年7月30日 08:28 PDT

**注意**

- 请在升级窗口期间保持在线，以便及时应用任何后续步骤或缓解指令。
- 升级期间，Cosmovisor 会在 `.inference/data` 目录中创建完整的状态备份；请确保有足够的磁盘空间（主网中 Cosmovisor 对 `application.db` 的备份通常为数十 GB，建议提前确认）。有关如何安全删除 `.inference` 目录中的旧备份的指南，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。
- 如果 `application.db` 占用大量磁盘空间，可应用 [指南](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it) 中描述的清理技术。
- 如果获得批准，升级后 devshard 存储可选择由共享的 Postgres 实例支持（与负载存储使用相同的环境变量）。本地 SQLite 将保持默认，并自动清理（保留最近3个周期）。

## 2026年7月23日

**升级已执行：v0.2.14 现已在主网上线**

针对升级提案 v0.2.14（提案ID 89）的链上治理投票已结束。

该提案已获批准，并于主网区块 5195700 成功执行升级。

## 2026年7月22日

**升级 v0.2.14：提前下载二进制文件**

v0.2.14 升级提案的链上治理流程即将结束。

- 投票结束：2026年7月23日 00:02 UTC
- 升级高度：5195700
- 预计升级时间：2026年7月23日 约 03:45 UTC

建议主机查看 [GitHub](https://github.com/gonka-ai/gonka/pull/1267) 上的提案并参与投票。

提前下载二进制文件有助于避免在升级窗口期间依赖 GitHub 的可用性。
```
# 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.14/bin \
              .inference/cosmovisor/upgrades/v0.2.14/bin && \

# 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.14/decentralized-api-amd64.zip" && \
echo "4326a27913a05435e37cd5fa9e3d0cf5271351799f8b01b842e049a733976c87 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.14/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.14/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

# 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.14/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.14/inferenced-amd64.zip" && \
echo "ce857ef90deb899c03d78dee01493e544bf8b7ddf8b452e75b3b010b80a8b046 inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.14/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.14/bin/inferenced && \
echo "Inference Installed and Verified" && \

# 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.14/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.14/bin/inferenced && \
echo "9f41f08d865041c9d1b43e28334528d8d542751af40841f9ddc34d64787e5286 .dapi/cosmovisor/upgrades/v0.2.14/bin/decentralized-api" | sudo sha256sum --check && \
echo "526755f37a0660e9ad9a38f01f99ac87920c7cee12554dc613b274e5e9e3d784 .inference/cosmovisor/upgrades/v0.2.14/bin/inferenced" | sudo sha256sum --check
```

## 2026年7月20日

**v0.2.14 升级提案进入治理流程**

[v0.2.14 提案](https://github.com/gonka-ai/gonka/pull/1267) 现已上链并开放投票。

主网链/API 工作重点包括：PoC 重复工件保护、早期共享检测、经典推理 API 废弃（禁用主网上的 `/v1/chat/completions` 计费并从 API 二进制文件中移除嵌入的 `/v1/devshard`）、奖励接收者路由，以及升级时的安全修复。

devshard 部分正在准备 v3 运行时，以便代理在链升级期间无需依赖已废弃的经典 API 路径即可提供推理服务，从而提升内存利用率，并支持在 SQLite 和 Postgres 存储之间安全切换。

更多详情请参阅拉取请求：[https://github.com/gonka-ai/gonka/pull/1267](https://github.com/gonka-ai/gonka/pull/1267)

**升级计划**

节点二进制文件通过链上软件升级提案进行升级。现有主机无需在升级过程中手动更新其 `api` 或 `node` 容器。

**如何投票**

如果您没有直接访问拥有投票权的密钥，或希望由其他密钥代为投票，请参阅[指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何将治理投票权限从冷密钥授予热密钥。

提案详情和投票可通过 `inferenced` 查看。任何活跃节点均可使用，可用节点包括：

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai

投出您的选票（`yes`、`no`、`abstain`、`no_with_veto`）：`--unordered` 和 `--timeout-duration` 标志需要 `inferenced` v0.2.12 或更高版本。
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 89 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```
要检查投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 89 -o json --node $NODE_URL/chain-rpc/
```

**升级前的必要操作**

若提案获得通过，建议提前完成以下准备工作。

- 现在 / 主网上线升级前 —— 更新您的 API 和桥接器。为确保主网上线升级期间以太坊桥接器稳定，请提前根据[指南](https://gonka.ai/docs/FAQ/#upgrade-v0214-pre-upgrade-api-and-bridge-update)将 `api` 二进制文件和桥接器镜像更新至 0.2.14-post3。如果您的 `api` 二进制文件已更新，则只需更新桥接器镜像并重启桥接容器。如果您已完成上述两步，则无需重复操作。若您拥有多个节点，请逐个更新，并在非 PoC 或 cPoC 期间执行此步骤。

- 仪表板维护人员——本次升级未移除或重构任何现有查询端点。若您的仪表板从链上读取并显示数据，则仍可正常运行。您需了解一项语义变更（委托），以及三项小注意事项（详见完整指南：[https://gonka.ai/docs/dashboard-maintainer-memo-v0.2.14/](https://gonka.ai/docs/dashboard-maintainer-memo-v0.2.14/)）

**截止日期**

- 投票截止：2026年7月23日 00:02 UTC / 2026年7月22日 17:02 PDT
- 提议升级高度：5195700
- 预计升级时间：2026年7月23日 03:45 UTC / 2026年7月22日 20:45 PDT

**注意事项**

- 请确保在升级窗口期间保持在线，以便及时执行后续步骤或缓解指令。
- 升级期间，Cosmovisor 会在 `.inference/data` 目录中创建完整状态备份；请确保磁盘空间充足（主网上 Cosmovisor 对 `application.db` 的备份通常为数十 GB，建议提前确认）。有关如何安全删除 `.inference` 目录中旧备份的指导，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。
- 如果 `application.db` 占用大量磁盘空间，可应用[指南](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)中描述的清理技术。
- 若提案通过，升级后 devshard 存储可选择由共享的 Postgres 实例支持（与负载存储使用相同的环境变量）。本地 SQLite 将保持默认，并自动清理（保留最近 3 个周期）。

## 2026年7月20日

**[仅 devshard 的 PR](https://github.com/gonka-ai/gonka/pull/1482) 现已开放评审**

devshard 升级独立于主区块链进行。无需通过 Cosmovisor 协调完整节点升级，不影响主网行为，且不会导致推理服务中断。若通过治理流程批准，新 devshard 版本将与现有 v3 运行时并行运行。

**关键变更**

- v4 的主要目标是提升 devshard 主机在主机故障和升级时的高可用性。当一台机器宕机或重启时，系统仍能继续处理新请求；在版本升级时，多台机器可逐台替换版本。这是系列 devshard 和网络节点变更中的首次更新，旨在将单体架构重构为高可用、容错、可扩展的架构。
- v4 是首个面向多实例高可用的版本：在共享 Postgres 上通过 versiond-router 部署 N 个 versiond/devshardd 副本，采用粘性会话路由和验证租约排他性。网关仅通过 gRPC 与链交互。公共可观测性为无版本化（/devshard/sessions|stats|metrics）；仅托管方通过签名聊天绑定。当治理发布同版本名称的新二进制文件（名称不变，仅 sha256 变化）时，versiond 可执行蓝绿切换并引流，确保正在进行的工作（包括 SSE）在旧版本上完成。
- v4 还包含错误修复和安全补丁。

**行动项**

请审阅 PR [https://github.com/gonka-ai/gonka/pull/1482](https://github.com/gonka-ai/gonka/pull/1482)，并在发现任何问题、疑问、改进建议、边界情况或潜在漏洞时留下评论。

有意义的评审贡献，包括重要评论、错误发现和安全问题，可能有资格获得下一升级周期的社区奖励。

本次仅为 PR 评审请求，不启动正式投票。

## 2026年7月16日

**提案88已通过：Kimi-K2.6重新注册，devshard v1/v2已移除**

紧急提案88已链上批准。

**Kimi-K2.6引导（第331轮）**

`moonshotai/Kimi-K2.6`已重新加入治理模型列表，并进入标准引导流程。

* 在区块 **5,105,276** 之前（2026年7月17日，约UTC 12:05）声明意向：
```
./inferenced tx inference declare-poc-intent moonshotai/Kimi-K2.6
```
* 在第331轮PoC开始前的约500个区块窗口内（区块 **5,105,776** — 2026年7月17日12:50:53 UTC / 05:50 PDT），将您的MLNode切换至Kimi。
* 委托主机：选择非守护者Kimi主机，并将权重分散到独立目标上 — 请参阅[多模型PoC指南](https://gonka.ai/docs/host/multi_model_poc/)。

**devshard v1/v2已移除**

`versiond`已停止v1和v2的`devshardd`进程。所有网关流量必须使用`/devshard/v3`。如果您在此次变更后网关停止提供推理服务，说明您仍在通过已被移除的路径路由 — 请遵循v3迁移指南。

## 2026年7月16日

**紧急治理投票（提案88）：重新注册Kimi-K2.6并移除devshard v1/v2运行时**

这是7月15日宣布的Kimi恢复计划的第二步。提案87已将`moonshotai/Kimi-K2.6`从活跃集合中移除；提案88将其重新注册到治理模型列表中，使其从第331轮开始进入标准引导流程。

同一提案还从`devshard_escrow_params`中移除了`approved_versions`的v1和v2版本。一旦批准，`versiond`将停止v1和v2的`devshardd`进程，仅保留v3运行时（`/devshard/v3`）运行。这消除了旧运行时容器长期存在的内存增长问题 —— 即7月15日事件中网络节点OOM的根本原因。

**此次变更使v3切换最终生效。** 仍通过v1/v2前缀或经典`/v1/devshard`路径路由的网关，在提案通过后将停止提供推理服务。

**主机所需操作**

1. 在截止日期前对提案88进行投票 —— 紧急窗口时间很短。
2. 提供Kimi服务的主机：在投票结束后、区块 **5,105,276**（2026年7月17日，约UTC 12:05）之前立即声明对`moonshotai/Kimi-K2.6`的意向，然后在第331轮PoC开始前的约500个区块窗口内（区块 **5,105,776**，2026年7月17日约12:50 UTC）切换您的MLNode：
```
./inferenced tx inference declare-poc-intent moonshotai/Kimi-K2.6
```
3. 委托引导时：**不要委托给守护者节点**；将委托分散到独立的Kimi主机上。请参阅[多模型PoC指南](https://gonka.ai/docs/host/multi_model_poc/)获取更新的委托指导。
4. 经纪人 / devshard创建者：如果您任何网关流量仍在v1/v2或`/v1/devshard`上 —— 请在投票结束前切换至`/devshard/v3`。

**如何投票**

如果您没有直接访问拥有投票权的密钥，或希望由另一个密钥代为投票，请参阅[指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)了解如何将治理投票权限从冷密钥授予热密钥。

提案详情和投票可通过`inferenced`访问。任何活跃节点均可使用，可用节点包括：

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai

投出您的投票（`yes`，`no`，`abstain`，`no_with_veto`）：`--unordered`和`--timeout-duration`标志需要v0.2.13或更高版本的`inferenced`。
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 88 yes \
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
./inferenced query gov votes 88 -o json --node $NODE_URL/chain-rpc/
```

**截止日期**

- 投票时间：2026-07-16 11:09 ~ 2026-07-16 23:09（PDT）/ 2026-07-16 18:09 ~ 2026-07-17 06:09（UTC）（紧急，0.667通过阈值；参与率重要，请尽快投票）。
- 意向截止时间（第330轮）：区块 **5,105,276** — 2026年7月17日约UTC 12:05（约05:05 PDT）。
- 第331轮PoC开始：区块 **5,105,776** — 2026年7月17日12:50 UTC（05:50 PDT）。

更多关于引导机制的信息：[https://gonka.ai/docs/host/kimi-bootstrap/](https://gonka.ai/docs/host/kimi-bootstrap/)

## 2026年7月15日

**紧急治理投票（提案87）：移除Kimi-K2.6以实现快速重新引导**

`moonshotai/Kimi-K2.6`在第328–329轮失去了PoC验证多数（详见[事件详情](https://gonka.ai/docs/network-updates/#july-15-2026)）。现在将其从活跃集合中移除并重新引导，是最快恢复服务且最小化停机时间的方式 —— 与6月提案78采用的恢复路径相同。

该提案将在下一轮PoC前从PoC参数中移除`moonshotai/Kimi-K2.6`，随后立即重新添加，Kimi将从第331轮开始进入标准引导流程。

**主机所需操作**

1. 在截止日期前对提案87进行投票 —— 紧急窗口时间很短。
2. 提供Kimi服务的主机：保持Kimi设置就绪，随时准备在引导PoC时切换您的MLNode。
3. 在进行引导委托时：不要委托给守护节点；将委托分散到独立的Kimi主机上。

**如何投票**

如果您没有直接访问拥有投票权的密钥，或希望由另一个密钥代表您投票，请参阅[指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)了解如何将治理投票权限从冷密钥授予热密钥。

提案详情和投票可通过`inferenced`查看。任何活跃节点均可使用。可用节点包括：

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai

投出您的选票（`yes`，`no`，`abstain`，`no_with_veto`）：`--unordered`和`--timeout-duration`标志需要`inferenced`版本v0.2.13或更高版本。
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 87 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```
要检查投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 87 -o json --node $NODE_URL/chain-rpc/
```

**截止日期*** 投票时间：2026-07-15 17:01 ~ 2026-07-16 05:01 (PDT) / 2026-07-16 00:01 ~ 2026-07-16 12:01 (UTC)（紧急投票，0.667 是票阈值；出勤率重要，请尽快投票）。
* 引导意图截止日期和纪元时间详见引导说明。

## 2026年7月15日

**Kimi-K2.6 事件（纪元 328–329）：事件经过、恢复计划及委托指导变更**

在纪元 328 中，`moonshotai/Kimi-K2.6` 失去了其 PoC 验证的多数票。在纪元 329 开始时，运行 Kimi 的主机被移出该组。网络其余部分正常运行。

**事件经过**

两台由守护者运营的运行 Kimi 的服务器同时失效：

* 其中一台服务器上运行 Kimi 的 MLNode 因提供商端问题崩溃。大量 Kimi 委托集中在这台主机上，因此其失效立即移除了这些投票。
* 第二台服务器因内存不足导致网络节点断开。

Kimi 的验证投票一直接近 2/3 阈值，因此此次失效足以使该组低于多数。守护者票决机制未触发：当前没有模型投票权重的守护者被排除在票决机制之外。这是一个已知问题，将在即将发布的 v0.2.14 升级中修复。

此情况与纪元 306–307 事件类似。纪元 329 开始时的投票确切细节仍在确认中；此摘要可能存在小幅修正。

**恢复计划**

恢复 Kimi 最安全的方式是通过全新引导（约 1.5 个纪元）重新添加：

1. [今天] 一个紧急提案将在下一次 PoC 之前移除 Kimi，并在之后立即重新添加。后续将发布包含提案 ID、投票命令和截止日期的单独公告。
2. [明天] Kimi 将再次经历标准引导流程：声明意图、部署窗口、PoC 存储提交。在意图截止日期前将发布说明。

**委托指导变更——请阅读**

先前的指导（包括 2026 年 6 月 27 日的引导公告）建议将守护者节点作为委托目标。此建议现被撤回：

* **请勿委托给守护者节点。** 守护者是 PoC 验证的后备机制。将委托集中于它们会将主机制与后备机制绑定到同一硬件——此次事件正是这种故障模式。协议层面的限制正在讨论中。
* **避免将委托集中于任何单一主机。** 在支持基于百分比的多主机委托前，请将委托分散到多个独立运行该模型的主机上。如果您运营多个节点，请将委托指向您自己运行模型的节点。
* **如果您能直接运行 Kimi——这是最大的帮助。** 更多直接主机意味着更多验证权重，且无单点故障。

**已在进行中的修复*** 守护者参与 PoC 验证（守护者始终可投票）——v0.2.14。
* 自委托问题——v0.2.14。
* Nonce 重复——v0.2.14（当前由早期 API 更新处理）。
* 网络节点内存增长——已在 devshard v3 中修复；需从 v1/v2 迁移。完成迁移后，v1/v2 将被移除，`/v1/devshard` 将关闭。为 `api` 和 `versiond` 容器设置独立内存限制。

**主机所需操作**

1. 一旦紧急 Kimi 提案上链（将发布通知），请对该提案进行投票。
2. 如果您计划提供 Kimi：关注引导说明，并准备好声明意图。
3. 如果您为 Kimi 委托：选择非守护者委托目标；尽可能将权重分散到多个独立主机上。
4. 经纪人：立即迁移 devshard 流量至 `/devshard/v3`。这将修复内存增长问题，并在移除 v1/v2 前必须完成。
5. 检查网络节点的内存，并设置容器内存限制（`api`、`versiond`）。

## 2026年7月11日

**v0.2.13-devshard-v3 运行时升级提案已通过治理**

devshard v3 运行时已通过链上批准并添加至 `DevshardEscrowParams.approved_versions`。

该提案涵盖 [devshard v3 发布版本。](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.14/proposals/governance-artifacts/update-v0.2.13-devshard-v3)

这是一个仅限 devshard 的运行时升级。它独立于完整链软件升级运行，无需链二进制升级。

提案获批后，v3 现在与现有 devshard 运行时并行运行。新进程在 `/devshard/v3` 前缀下提供服务，而现有 devshard 流量可继续在早期运行时前缀上运行，直到经纪人切换流量至 v3。

此版本将 `devshardd` 二进制文件作为 Gonka 发布工件发布。`versiond` 将自动下载该二进制文件，验证 sha256 哈希，并在现有 `versiond` 容器内启动额外的 `devshardd` 进程。

对于这种仅限 devshard 的运行时升级，无需进行主网重启或手动主机操作。

**行动项**

白名单上的 devshard 创建者应在主网 v0.2.14 链升级前将推理流量切换到 `/devshard/v3`。这将使他们在链升级运行期间继续提供推理服务，而无需依赖已弃用的经典 API 路径。

**关键变更**

- 已准备代理在 v0.2.14 链升级期间继续提供推理服务，且不依赖已弃用的经典 API 路径。
- 改进了 RAM 利用率。
- 修复了网关运行时行为。
- 启用了 SQLite 和 Postgres 存储之间的安全切换。

## 2026 年 7 月 8 日

**v0.2.13-devshard-v3 运行时升级提案已进入治理阶段**

此提案涵盖 [devshard v3 发布版本。](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.14/proposals/governance-artifacts/update-v0.2.13-devshard-v3)

这是一个仅限 devshard 的升级。它独立于完整的链软件升级运行。一旦获得批准，v3 将与现有的 devshard 运行时并行运行。

v3 运行时准备代理在 v0.2.14 链升级期间继续提供推理服务，且不依赖已弃用的经典 API 路径。它还改进了 RAM 利用率，修复了网关运行时行为，并启用了 SQLite 和 Postgres 存储之间的安全切换。

**升级计划**

devshard 运行时通过链上参数提案进行升级，而非完整的链软件升级。

该提案在 `DevshardEscrowParams.approved_versions` 中注册一个新条目：

- `name`: `v3`
- `binary`: `https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.13-devshard-v3.0.0/devshardd.zip`
- `sha256`: `ca1294fc8db3f0907a01f362eb4b13665f66d0fd12cfc6f01468b1e27f0bab63`
  
发布版本将 `devshardd` 二进制文件作为 Gonka 发布工件发布。如果链上提案获得批准，`versiond` 将自动下载二进制文件，验证 sha256 哈希值，并在现有的 `versiond` 容器内启动一个额外的 `devshardd` 进程。
新进程通过 `/devshard/v3` 前缀提供服务。现有的 devshard 流量可以继续使用早期运行时前缀，直到代理将流量切换到 v3。在此类升级期间，无需主网重启或手动主机操作。

**如何投票**

如果您没有直接访问拥有投票权的密钥，或希望由另一个密钥代表您投票，请参阅 [指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何将治理投票权限从冷密钥授予热密钥。

提案详情和投票可通过 `inferenced` 查看。任何活跃节点均可使用。可用节点包括：

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai
  
投出您的选票（`yes`，`no`，`abstain`，`no_with_veto`）：`--unordered` 和 `--timeout-duration` 标志需要 v0.2.13 或更高版本的 `inferenced`。
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 83 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```
要检查投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 83 -o json --node $NODE_URL/chain-rpc/
```
**截止日期**

投票结束：2026 年 7 月 11 日，UTC 时间 06:41:34

## 2026 年 7 月 8 日

**升级 v0.2.14 的 PR 审查**

[拉取请求](https://github.com/gonka-ai/gonka/pull/PR) 针对下一个链上软件升级 v0.2.14 已开放供审查。

主网链/API 工作重点包括：PoC 重复工件保护、早期共享检测、经典推理 API 废弃（禁用主网上的 `/v1/chat/completions` 计费并从 API 二进制文件中移除嵌入的 `/v1/devshard`）、奖励接收方路由以及升级时的安全修复。

devshard 部分准备了 v3 运行时，以便代理在链升级期间无需依赖已弃用的经典 API 路径即可提供推理服务，同时提升 RAM 利用率并支持 SQLite 和 Postgres 存储之间的安全切换。

**升级计划**

节点二进制文件通过链上软件升级提案进行升级。现有主机无需在升级过程中手动更新其 `api` 或 `node` 容器。
将从该分支单独发布 devshard v3 版本，并在主网链升级前提案并部署。提前将推理流量切换到 `/devshard/v3` 的代理可在链升级期间继续提供服务。

**建议流程**

1. 活跃主机在 [GitHub](https://github.com/gonka-ai/gonka/pull/PR) 上审查此提案。
2. devshard v3 版本将在主网链升级前被提案并部署。
3. 经纪人将推理流量切换至 `/devshard/v3`。
4. 如果链上提案获得批准，此 PR 将在链上升级执行后立即合并。
5. 请直接审查 PR 代码，并对您发现的任何问题、疑问、改进建议、边界情况或漏洞留下评论。

有意义的审查贡献，包括重要评论、错误发现和安全问题，可能在下一个升级周期中获得社区奖励。

本次仅为对 Pull Request 的审查请求，不启动正式投票。治理投票流程将在审查期结束后开始。

**Devshard v3 治理投票**

Devshard v3 发布版本将在主网链升级前提出并部署，以便经纪人能够在升级运行前将推理流量移至 `/devshard/v3`。

**主机操作项**

1. 现在 —— 审查 PR。请阅读 GitHub 上的 PR #1267，并对您发现的任何问题、疑问、改进建议、边界情况或漏洞留下评论。
2. 现在 / 主网升级前 —— 更新您的 API 和桥接器。为确保主网升级期间以太坊桥接器的稳定性，请提前根据指南将 `api` 二进制文件和桥接器镜像更新至 0.2.14。如果您的 `api` 二进制文件已更新，您只需更新桥接器镜像并重启桥接容器。如果您已完成以上两个步骤，则无需重复操作。如果您有多个节点，请逐个更新，并在非 PoC 或 cPoC 期间执行此步骤。
3. 对 devshard v3 进行投票。
4. 经纪人 —— 将推理流量切换至 `/devshard/v3`。一旦 devshard v3 发布版本部署完成，请将推理流量移至 `/devshard/v3`，以便在链升级期间持续提供推理服务。
5. 仪表板维护者 —— 准备好调整指标统计方式。详细说明将在 `devshard v3` 投票启动并接近完成时发布。

## 2026 年 7 月 6 日

**安全更新：PoC-v2 权重验证加固 —— 更新您的 API 容器**

上周，HackerOne 上报告了 PoC-v2 权重路径中的一个漏洞。参与者可夸大其计算权重，从而影响区块奖励、共识投票权和治理投票权。

根据历史数据，此前未观察到此类攻击。但在当前纪元中，已检测到主机 `gonka1w7s4pharl5qs2lupxkuw2c0gzcls8chehwafg3` 使用了该攻击。

针对即将发布的 v0.2.14 链升级，已准备好修复方案，将永久解决此问题。由于攻击已在使用中，因此在升级前提供仅 API 的热修复补丁——可异步部署，通过强化 PoC-v2 验证来阻止攻击，使复制计算无法通过采样检查。

请更新您的 API 容器。
请确保在非 PoC 或 cPoC 期间执行此步骤。
为降低风险，请逐台部署（一次一台）：
```
sudo rm -rf decentralized-api.zip .dapi/cosmovisor/upgrades/v0.2.13-post7/ .dapi/data/upgrade-info.json
sudo mkdir -p  .dapi/cosmovisor/upgrades/v0.2.13-post7/bin/
wget -q -O  decentralized-api.zip 'https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.13-post7/decentralized-api-amd64.zip' && \
echo "55de4023119d103683cdbfa41c204274d3189636e4119ea3a2d8afdfa0a6fa47  decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j  decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.13-post7/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.13-post7/bin/decentralized-api && \
echo "API Installed and Verified"  && \

docker stop api && \
sudo rm -rf .dapi/cosmovisor/current && \
sudo ln -sf upgrades/v0.2.13-post7 .dapi/cosmovisor/current && \
echo "e97d89cfaca98547b5966a87bd99ec6faab9df9eda1782f584a36d49237c01e6  .dapi/cosmovisor/current/bin/decentralized-api" | sha256sum --check && \
docker start api
```

## 2026年6月27日

**Kimi-K2.6 启动：第311轮的再次尝试**

`moonshotai/Kimi-K2.6` 在第311轮再次尝试启动。希望提供 Kimi 服务的主机必须在第310轮期间声明意向，并在新轮次开始前准备好节点。一个守护节点也将运行 Kimi，因此不愿运行它的主机可以将其权重委托给该节点。

**将运行 Kimi 的主机**

1. 在第310轮期间、区块 **4,797,456** 之前（约6月28日 ~12:00 UTC）声明 PoC 意向：
```
./inferenced tx inference declare-poc-intent moonshotai/Kimi-K2.6
```
2. 如果足够多的主机声明意向，请在第311轮开始前约500个区块的窗口期内将您的节点切换为 Kimi（PoC 开始时间约为6月28日 ~12:47 UTC）。

**将不运行 Kimi 的主机**

将您的权重委托给运行 Kimi 的主机（或发送拒绝）：
```
./inferenced tx inference set-poc-delegation moonshotai/Kimi-K2.6 <DELEGATEE>
```
~~守护节点 `gonka1kx9mca3xm8u8ypzfuhmxey66u0ufxhs7nm6wc5` 将运行 Kimi，可作为委托目标。~~

> **更新（2026年7月15日）：此建议已撤回——请勿委托给守护节点。** 守护节点是 PoC 验证的后备机制，必须与委托保持独立。请选择一个非守护节点且运行该模型的主机，并避免选择已是主要委托目标的主机。请参阅 [多模型 PoC 指南](https://gonka.ai/docs/host/multi_model_poc/) 获取最新的委托指导。

**关键时间点*** 意向截止时间（第310轮）：区块 **4,797,456** — 约6月28日 ~12:00 UTC。
* 第311轮开始：区块 **4,797,956** — 约6月28日 ~12:47 UTC。

更多关于启动机制的说明：[https://gonka.ai/docs/host/kimi-bootstrap/](https://gonka.ai/docs/host/kimi-bootstrap/)

## 2026年6月26日

**紧急治理投票79：恢复 `moonshotai/Kimi-K2.6` 并添加 `GLM-5.2`****关键变更****1. 恢复 `Kimi-K2.6`**

`Kimi-K2.6` 将与 `weight_scale_factor=0.9` 一同恢复。该系数的选择使得在8xB300硬件上，Kimi 的共识权重与主模型 MiniMax 大致相当。此设计并非偏向任何硬件——MiniMax 已具备相同的权重。对于运行 Kimi 而非 MiniMax 的8xB300主机，将获得约1%的收益。
此方案使 Kimi 非常适合 8xB200 和 8xB300 服务器。

按硬件类型估算的共识权重：
[https://docs.google.com/spreadsheets/d/1yQ-8UHnHC5pvqd6uDB1dRPzHJ2qfJoQrXssXIGi8QMg/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1yQ-8UHnHC5pvqd6uDB1dRPzHJ2qfJoQrXssXIGi8QMg/edit?usp=sharing)

常规启动流程从第309轮开始。由于投票在 PoC 前约1小时结束，请在投票结束后立即提交 `MsgDeclarePoCIntent`。
更多启动信息：https://gonka.ai/docs/host/kimi-bootstrap/

**2. 添加 `GLM-5.2`**

`GLM-5.2` 将与 `weight_scale_factor=2.47` 和 `penalty_start_epoch=500` 一同添加（这实际上取消了该模型的不参与惩罚）。该系数的选择使得在8xB300硬件上，GLM-5.2 的共识权重与 MiniMax 大致相当。此设计并非偏向任何硬件。对于运行 GLM-5.2 而非 MiniMax 的8xB300主机，将获得约2%的收益。
此方案使其非常适配 8xB300 服务器。

按硬件类型估算的共识权重：
[https://docs.google.com/spreadsheets/d/1yQ-8UHnHC5pvqd6uDB1dRPzHJ2qfJoQrXssXIGi8QMg/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1yQ-8UHnHC5pvqd6uDB1dRPzHJ2qfJoQrXssXIGi8QMg/edit?usp=sharing)

MLNode 版本和操作说明将在投票结束后发布。

**启动机制说明**

两种模型均通过标准启动流程进入，主机可在投入硬件前确认其可行性：

1. **声明意向。** 计划提供 Kimi 或 GLM-5.2 服务的主机需在 `start_poc - deploy_window` 的启动快照前提交 `MsgDeclarePoCIntent`。
   
2. **预资格快照。** 在 `start_poc - deploy_window`，链将快照意向和委托，并发出建议性预资格事件（治理批准、权重阈值 `W_threshold`、最低成员数 `V_min`、>2/3 可达性）。这使操作者能在配置硬件前确认模型是否具备可行性。
   
3. **部署窗口。** 已声明意向的主机在部署窗口内为其模型配置 MLNode。
   
4. **PoC 开始。** 成员资格由 PoC 开始时实际提交 PoC 存储提交的主机决定——而非仅凭声明意向。只有满足资格条件的模型才会激活。

**若获批准的效果**

从第309轮开始（PoC 开始时间约6月26日 15:25 UTC；生效时间约16:00 UTC），前提是每个模型均满足启动资格条件：

* `moonshotai/Kimi-K2.6` 再次成为活跃的 PoC 模型。
* `zai-org/GLM-5.2-FP8` 作为可选的 PoC 模型可用，且无非参与惩罚。
* `MiniMaxAI/MiniMax-M2.7` 仍为基础模型。

**为何紧急**

该提案必须在第308轮结束前完成，以便两个模型都能在第309轮启动。由于每轮约22.8小时，标准48小时投票周期无法容纳在一个轮次内；而12小时紧急周期可以。创世守护节点预计将支持此提案。

**主机所需操作**

1. **要提供 Kimi：** 在投票结束**后立即**为 `moonshotai/Kimi-K2.6` 声明意向。然后，在 PoC 309 期间将您的 MLNode 切换至该模型。在 PoC 开始前有约500个区块的安全窗口，期间切换是安全的，因为此期间无 cPoC。

2. **要提供GLM-5.2：** 在部署窗口期间为`zai-org/GLM-5.2-FP8`声明意向并 provision 您的MLNode。提供它是可选的——未选择参与的主机不会受到任何惩罚。

3. **要继续使用MiniMax：** 继续提供`MiniMaxAI/MiniMax-M2.7`——无需任何操作。

4. **在截止日期前对提案79进行投票。** 加急窗口时间很短。

**如何投票**

如果您没有直接访问拥有投票权的密钥，或希望使用另一个密钥代为投票，请参阅[指南](https://gonka.ai/docs/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何将冷密钥的治理投票权限授予热密钥。提案详情和投票可通过`inferenced`访问：任何活跃节点均可使用：

* http://node1.gonka.ai:8000
* http://node2.gonka.ai:8000
* https://node3.gonka.ai

投出您的选票（`yes`，`no`，`abstain`，`no_with_veto`）：
```
    export NODE_URL=https://node3.gonka.ai/
    ./inferenced tx gov vote 79 yes \
    --from <cold_key_name> \
    --keyring-backend file \
    --unordered \
    --timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
    --node $NODE_URL/chain-rpc/ \
    --chain-id gonka-mainnet \
    --yes
```
要检查投票状态：
```
    export NODE_URL=https://node3.gonka.ai/
    ./inferenced query gov votes 79 -o json --node $NODE_URL/chain-rpc/
```
**截止日期*** 提案79投票结束：*2026年6月26日14:18:58 UTC*（加急）。
* 加急提案要求0.667的赞成阈值；参与率很重要，请尽快投票。

## 2026年6月25日

**提案78已通过：`MiniMaxAI/MiniMax-M2.7`现在是唯一的PoC模型；Kimi K2.6和Qwen3-235B已移除**

提案78的加急投票已通过。这些变更自第308个纪元起生效。

**当前生效内容**

1. 委托`initial_model_id`已设置为`MiniMaxAI/MiniMax-M2.7`——MiniMax为基线模型。
2. `MiniMaxAI/MiniMax-M2.7`是PoC参数中唯一的模型。
3. `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`和`moonshotai/Kimi-K2.6`已从PoC参数中移除。
4. `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`和`moonshotai/Kimi-K2.6`已从治理模型中删除。

自第308个纪元起，`MiniMaxAI/MiniMax-M2.7`是唯一的活跃PoC模型。Qwen3-235B和Kimi K2.6不再活跃。

**主机所需操作*** 请确保您的MLNode正在提供`MiniMaxAI/MiniMax-M2.7`。任何仍运行Qwen或Kimi的主机，在切换之前将无法获得本纪元的cPoC奖励。
* 计划再次提供Kimi的主机应保持Kimi设置就绪，并在PoC 309时准备好将MLNode切换回Kimi——在第308纪元期间将进行一次投票以恢复Kimi。

**接下来的内容**

在第308纪元期间将进行一次加急投票，合并两项变更，均于第309纪元生效（PoC开始时间约为2026年6月26日15:25 UTC）：

* **恢复Kimi K2.6**——重新添加Kimi并重启其引导过程。
* **添加GLM-5.2**——添加GLM-5.2，**不设置不参与惩罚**，因此主机可选择参与，提前衡量对该模型的需求，不提供该模型的主机不会受到任何惩罚。

## 2026年6月25日

**加急治理投票（提案78）：MiniMax-M2.7成为唯一的PoC模型；Kimi K2.6被移除以便快速重启；Qwen3-235B退役**

`moonshotai/Kimi-K2.6`目前没有足够的投票支持以通过PoC验证。因此，提供Kimi的参与者被移出组，Kimi无法进入下一个纪元。现在将其从活跃集合中移除并重新引导，是使其尽快回归且停机时间最短的方式。

一项加急提案现已上链，以便在下一个纪元开始前生效。
链上提案在一次投票中执行以下操作：
1. 将委托`initial_model_id`设置为`MiniMaxAI/MiniMax-M2.7`，使MiniMax成为基线模型。
2. 仅在PoC参数中保留`MiniMaxAI/MiniMax-M2.7`。
3. 从PoC参数中移除`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`和`moonshotai/Kimi-K2.6`。
4. 从治理模型中删除`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`和`moonshotai/Kimi-K2.6`。

**每项变更的目的*** **Kimi K2.6——移除以便快速恢复。** 由于Kimi没有足够的投票通过PoC验证，将其移除并重新引导是最快且停机时间最短的恢复方式。下一纪元将进行一次投票以恢复Kimi。
* **Qwen3-235B——退役（独立、无关变更）。** 退役较旧的Qwen3-235B是一项独立的、此前已请求的阵容调整。它与Kimi的情况无关，仅因同样是PoC阵容变更而一并包含在此处。
* **MiniMax-M2.7 — 已提升为基础模型。**

由于重置必须在epoch 307结束前完成，因此这些变更被合并为一次紧急投票。每个epoch约22.9小时，标准的48小时投票周期无法容纳在一个epoch内；而12小时的紧急周期可以。Genesis守护者应支持该提案。

**若获批准的效果**

从epoch 308开始（约UTC时间6月25日17:25），`MiniMaxAI/MiniMax-M2.7`将成为唯一的活跃PoC模型。Qwen3-235B和Kimi K2.6将不再活跃。恢复Kimi将在下一个epoch的后续投票中处理。

**主机所需操作**

1. **在PoC 308开始前，将您的MLNode切换至`MiniMaxAI/MiniMax-M2.7`。** 所有主机——包括当前使用Qwen或Kimi的主机——都必须将MLNode切换至MiniMax。在PoC开始前有约500个区块的窗口期可以安全切换，因为此时没有cPoC。请现在预先下载FP8权重（如尚未准备就绪），以避免在epoch边界时遭遇Hugging Face速率限制。
2. **在截止日期前对提案78进行投票。** 紧急窗口期很短。
3. 计划再次提供Kimi服务的主机仍应现在将MLNode切换至MiniMax，但需准备好在PoC 309时将其切换回来——epoch 308中将进行恢复Kimi的投票。


**接下来的内容*** **恢复Kimi K2.6** —— 在epoch 308中进行后续投票，以重新添加Kimi并重启其引导过程。
* **GLM-5.2** —— 后续提案将添加GLM-5.2，且**不设置不参与惩罚**，因此主机可选择加入，提前测试模型需求，而不参与的主机不会受到任何惩罚。

**如何投票**

如果您没有直接访问拥有投票权的密钥，或希望由另一个密钥代为投票，请参阅[指南](https://gonka.ai/docs/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)了解如何将冷密钥的治理投票权限授予热密钥。提案详情及投票可通过`inferenced`访问：任何活跃节点均可使用：

* http://node1.gonka.ai:8000
* http://node2.gonka.ai:8000
* https://node3.gonka.ai

投出您的投票（`yes`，`no`，`abstain`，`no_with_veto`）：
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

检查投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 78 -o json --node $NODE_URL/chain-rpc/
```

**截止日期*** 提案78投票结束：**2026年6月25日 15:39:53 UTC**（紧急）。
* 第308个纪元将在稍后形成：PoC开始约16:50 UTC，生效约17:25 UTC。
* 紧急提案要求0.667的赞成阈值；参与率很重要，请及时投票。

## 2026年6月22日

**v0.2.13-devshard-v2运行时升级提案已通过治理**

devshard v2运行时已通过链上批准并添加至`DevshardEscrowParams.approved_versions`。

本提案涵盖devshard v2发布：[https://github.com/gonka-ai/gonka/releases/tag/release/devshard/v2.0.0](https://github.com/gonka-ai/gonka/releases/tag/release/devshard/v2.0.0)

这是首次仅针对devshard的运行时升级。它独立于完整链软件升级，无需链二进制升级。

提案通过后，v2现在可与现有的v1 devshard运行时并行运行。新进程通过`/devshard/v2`前缀提供服务，而现有的v1流量继续在`/devshard/v1`和`/v1/devshard`上运行。

发布版本将`devshardd`二进制文件作为Gonka发布工件。`versiond`会自动下载该二进制文件，验证sha256哈希值，并在现有的`versiond`容器内启动一个额外的`devshardd`进程。

对于此类仅devshard的运行时升级，无需重启节点容器或手动执行主机步骤。

**关键变更**

- 移除了种子揭示轮次，封存已完成的推理统计信息，并修剪负载，以避免长时间运行的会话将所有已服务的推理保留在RAM或状态中。
- 通过OpenTelemetry和Prometheus添加了内部devshard追踪和指标。
- 通过Grafana、Jaeger、Prometheus、Loki、Promtail和cAdvisor添加了join-stack可观测性。
- 将每个推理的验证计数器移出状态根，存入SQLite/Postgres，并在推理修剪后通过devshard统计端点暴露每个槽的总计数。
- 在纪元变更时修剪旧纪元存储，将SQLite/Postgres模式设置移出热路径，并强制每个进程仅选择一个存储后端。

## 2026年6月15日

**v0.2.13-devshard-v2运行时升级提案已进入治理阶段。**

本提案涵盖devshard v2发布：[https://github.com/gonka-ai/gonka/releases/tag/release/devshard/v2.0.0](https://github.com/gonka-ai/gonka/releases/tag/release/devshard/v2.0.0) 
这是首次仅针对devshard的升级。它独立于完整链软件升级。若获得批准，v2将与现有的v1 devshard运行时并行运行。
详情请参阅[升级设计文档](https://github.com/gonka-ai/gonka/blob/devshard-0.2.13-v2/devshard/docs/upgrade.md)和[版本化包](https://github.com/gonka-ai/gonka/tree/devshard-0.2.13-v2/versioned)。

**关键变更**

1. 移除种子揭示轮次，封存已完成的推理统计信息，并修剪负载，以避免长时间运行的会话将所有已服务的推理保留在RAM或状态中

2. 通过OpenTelemetry和Prometheus添加内部devshard追踪和指标

3. 通过Grafana、Jaeger、Prometheus、Loki、Promtail和cAdvisor添加join-stack可观测性

4. 将每个推理的验证计数器存入SQLite/Postgres（位于状态根之外），并在推理修剪后通过devshard统计端点暴露每个槽的总计数

5. 在纪元变更时修剪旧纪元存储，将SQLite/Postgres模式设置移出热路径，并为每个进程选择恰好一个存储后端

**升级计划**

devshard运行时通过链上参数提案升级，而非完整链软件升级。

该提案在`DevshardEscrowParams.approved_versions`中注册一个新条目。

发布版本将`devshardd`二进制文件作为Gonka发布工件。如果链上提案获得批准，`versiond`将自动下载该二进制文件，验证sha256哈希值，并在现有的`versiond`容器内启动一个额外的`devshardd`进程。

新进程通过`/devshard/v2`前缀提供服务。现有的v1 devshard流量继续在`/devshard/v1`和`/v1/devshard`上运行。此类升级期间无需重启节点容器或手动执行主机步骤。

**如何投票**

如果您没有直接访问拥有投票权的密钥，或希望由其他密钥代为投票，请参阅[指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)了解如何将治理投票权限从冷密钥授予热密钥。
提案详情和投票可通过`inferenced`访问。任何活跃节点均可使用。可用节点包括：

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai
  
投出您的选票（`yes`、`no`、`abstain`、`no_with_veto`）：`--unordered`和`--timeout-duration`标志需要v0.2.13或更高版本的`inferenced`。
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

投票结束：2026年6月17日，23:39:02 UTC

## 2026年6月6日

**[仅适用于devshard的升级PR](https://github.com/gonka-ai/gonka/pull/1289) 现已开放审核。**

这是首次仅针对devshard的升级，因此流程与标准链升级不同。Devshard升级独立于主区块链更新devshard运行时，无需通过Cosmovisor协调全节点升级，不影响主网行为，且不会导致推理服务中断。

如果通过治理流程批准，新版本的devshard将与现有的v1运行时并行运行。

请直接审核PR，并对任何发现、问题、改进建议、边界情况或潜在漏洞留下评论。

有意义的审核贡献，包括重要评论、错误发现和安全问题，可能有资格在下一轮升级周期中获得社区奖励。

本次仅为PR审核请求，不启动正式投票。治理投票流程将在审核期结束后开始。

## 2026年5月28日

**MiniMax-M2.7 现已在 Gonka 网络上线**

v0.2.13中宣布的引导阶段已完成。自链纪元278起，MiniMaxAI/MiniMax-M2.7 与 Qwen3-235B 和 Kimi K2.6 一同成为活跃模型组，MiniMax组中获得的PoC权重现在以校准系数0.3024转换为共识权重。

MiniMax的每模型参与强制执行现已生效。已为MiniMax选择DIRECT、DELEGATE或REFUSE的主机无需执行任何其他操作——现有设置将继续有效。尚未做出选择的主机建议尽快选择，以避免每纪元惩罚（[https://gonka.ai/docs/host/quickstart/#optional-poc-delegation-and-refusal](https://gonka.ai/docs/host/quickstart/#optional-poc-delegation-and-refusal)）。

## 2026年5月26日

**升级已执行：v0.2.13 现已在主网上线**

升级提案v0.2.13（提案ID 54）的链上治理投票已结束。
该提案已获批准，并已在主网区块 `4267300` 成功执行。

## 2026年5月25日

**升级 v0.2.13：提前下载二进制文件和 MiniMax-M2.7 权重**

v0.2.13升级提案（提案ID [54](https://github.com/gonka-ai/gonka/pull/1143)）已通过链上治理，升级现已安排。

- 升级高度：4267300
- 预计升级时间：2026年5月26日，14:42 UTC（07:42 PDT）

提前下载二进制文件和权重有助于避免在升级窗口期间依赖GitHub / Hugging Face的可用性。
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

**v0.2.13 投票结束 — 正在准备在高度 4267300 升级**

针对 [Upgrade Proposal v0.2.13](https://github.com/gonka-ai/gonka/pull/1143)（提案 ID `54`）的链上治理投票已结束。该提案已 **批准**。

升级将在主网的 **区块高度 4267300** 自动执行（≈ **2026年5月26日星期二 14:42 UTC** / **07:42 PDT**）。

**提醒**

1. 请确保您的桥接容器已更新并同步。以太坊主网桥接合约（`0x972a7a92d92796a98801a8818bcf91f1648f2f68`）、USDC/USDT 代币元数据和 CW20 `wrapped_token` 代码 ID `105` 均通过升级处理器注册，因此桥接将在升级高度在主网上激活。验证说明：[https://gonka.ai/docs/network-updates/#may-7-2026](https://gonka.ai/docs/network-updates/#may-7-2026)。
2. 如果您计划提供 `MiniMaxAI/MiniMax-M2.7`，请现在预下载约 230 GB 的 FP8 权重。在引导窗口期间，Hugging Face 的速率限制和带宽饱和可能导致错过首次资格检查。
3. 升级完成后，每个主机都需要为**每个**治理批准的模型声明参与模式 — `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、`moonshotai/Kimi-K2.6` 和 `MiniMaxAI/MiniMax-M2.7`。仅运行其中一个或两个模型的主机仍需为其他模型选择 DELEGATE 或 REFUSE。MiniMax 截止时间为 **链纪元 `278`**。从纪元 278 开始，未采取任何操作的主机将对其全部权重遭受每纪元 15% 的惩罚。
4. 请在升级窗口期间保持在线，以便及时应用任何后续步骤或缓解指令。确保 `.inference/data` 有足够的空闲空间用于 cosmovisor 状态备份；如果 `application.db` 较大，请在升级前应用 [cosmovisor 备份指南中的清理技术](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)。
5. v0.2.13 校准将 Kimi K2.6 `WeightScaleFactor` 从 `1.26` 调整为 `0.78`，以反映 vLLM-0.20.1 发布后 Qwen-on-B200 参考的吞吐量基线。该调整**仅适用于您共识权重中源自 Kimi 的部分**；您源自 Qwen 的权重和 Kimi 内部 PoC 分布保持不变。在 B200/B300 上，Kimi 仍是收益最高的选项；在 H100/H200 上，MiniMax-M2.7 成为与 Qwen 相当、高于 Kimi 的选项。

- 提案：[https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)
- 迁移逻辑：[`upgrades.go`](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.13/inference-chain/app/upgrades/v0_2_13/upgrades.go)

## 2026年5月20日

**v0.2.13 升级提案进入治理**

[v0.2.13 提案](https://github.com/gonka-ai/gonka/pull/1143) 已重新上链并开放投票。这是对之前发布但未通过的提案的重新提交，现已更新若干内容。

- 包括：Kimi 的重新校准权重（`0.78`）、新模型 `MiniMaxAI/MiniMax-M2.7`、验证阈值更新、devshard 存储重构，以及若干 PoC/奖励修复。
- 在主网上激活以太坊桥接（详见下方专用章节）。
- 该提案将升级后的宽限期延长至 3000 个区块，以便主机在新快照逻辑稳定期间不受惩罚。
- 治理：将创世守护者投票权降至约 25%，并设置链上法定人数为 0.25。若守护者弃权，非守护者需在剩余的 75% 中实现约三分之一的参与率才能满足法定人数（参见 inference-chain 部分）。
- 所需准备：桥接容器检查、MiniMax 决策、仪表板更新、投出选票。
- 除非提案获得批准，否则链上无任何变化。

PR：[https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)

**关键变更****模型**

- 将 `MiniMaxAI/MiniMax-M2.7` 作为治理批准模型和 PoC 模型加入。
- 更新推理验证阈值：
    - Qwen 235B：`0.940`
    - Kimi K2.6：`0.900`
    - MiniMax-M2.7：`0.922`
- 根据 vLLM 0.20.1 发布后的 Qwen-on-B200 参考重新校准 `WeightScaleFactor` 值：
    - Qwen 235B：`0.359`（不变）
    - Kimi K2.6：`0.78`（从 1.26 下调，Kimi 在相同 PoC 权重下的每纪元共识权重约减少 38%）
    - MiniMax-M2.7：`0.3024`

参考数据：[https://docs.google.com/spreadsheets/d/1dHHlbhW1_hVgd7Q6MtmcVSOpmnl7NnynoTzPHJ1oU-g/edit?gid=0#gid=0](https://docs.google.com/spreadsheets/d/1dHHlbhW1_hVgd7Q6MtmcVSOpmnl7NnynoTzPHJ1oU-g/edit?gid=0#gid=0)

**inference-chain**

- 将 devshard 非 nonce 限制从 `20_000` 提高至 `1_000_000`。
- 将每纪元最大 devshards 数量从 `100` 提高至 `500_000`。
- 修复新模型引导期间确认 PoC 奖励核算。
- 在本次升级纪元剩余时间内禁用确认 PoC，以便新快照逻辑从下一纪元干净启动。
- 当参与者再次活跃时，重置 `ConsecutiveInvalidInferences`。
- 为在 v0.2.12 之前加入的 DAPI 补全缺失的 `MsgRespondDealerComplaints` 授权授予。
- 修复了可能导致桥接和流动性池合约调用中出现间歇性权限错误的连线问题。
- 将创世守护者调整后的投票权降低至约 25%，并将链上治理法定人数设置为 `0.25`。在守护者不投票的情况下，这使得剩余 75% 投票权的有效法定人数为 1/3（`0.25 / 0.75 = 0.334`）。
- 向 `allowed_creator_addresses` 添加 4 个早期主机和经纪人。

**Ethereum 桥接主网激活**

- 通过升级处理程序激活 Ethereum 主网桥接设置。
- 注册 Ethereum 桥接合约地址 `0x972a7a92d92796a98801a8818bcf91f1648f2f68`、USDC 和 USDT 代币元数据、桥接交易授权以及 CW20 `wrapped_token` 代码 ID `105`。
- 激活后，桥接将启用 Gonka 主网与 Ethereum 之间的跨链转移（包括在 Ethereum 上包装 GNK 以及桥接 USDC/USDT）。包装/解包脚本和操作员工作流程将另行文档化。

**去中心化 API & devshard**

- 默认在端口 `9400` 启用 `NodeManagerGrpcPort`。
- 为 devshard 状态添加 Postgres 支持。
- 为 SQLite 和 Postgres devshard 数据库添加清理功能。
- 添加状态快照以加快 devshard 启动和恢复速度。
- 修复 OpenAI 兼容 API 响应解析问题。
- 修复长时间启动行为和 devshard 失效流程的边界情况。

**升级计划**

如果获得批准，二进制版本将通过链上升级提案进行更新。有关升级过程的更多信息，请参阅 [/docs/upgrades.md.](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.13/docs/upgrades.md)

**升级前的必要操作**

如果提案获得批准，建议进行以下准备工作。

**在第 278 个周期（此时开始处罚）前选择 `MiniMaxAI/MiniMax-M2.7` 参与方式**

对于每个治理批准的模型，多模型 PoC 要求每个主机明确选择参与方式（DIRECT / DELEGATE / REFUSE）。在模型的 `PenaltyStartEpoch` 之后不采取任何操作将导致处罚。在此阶段，您应提前决定首选选项，以便在提案通过且升级成功应用于主网时能够迅速行动。

**桥接容器更新/验证**

所有主机需验证其桥接容器已部署、运行最新版本并正确同步。部分主机可能已部署桥接容器。此时请先确认您运行的是当前版本，再进行任何进一步操作。
请遵循以下说明：[https://gonka.ai/docs/network-updates/#may-7-2026](https://gonka.ai/docs/network-updates/#may-7-2026)

**仪表板/浏览器更新（升级前或升级后）**

主机需更新仪表板/浏览器。请从 `gonka/deploy/join` 目录运行以下命令。如果您尚未本地克隆 `gonka` 仓库，请先参考加入网络指南。此仪表板更新仅涉及容器拉取，无论投票结果如何，均可在投票结束前或结束后安全运行。
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

**如何投票**

如果您无权直接访问持有投票权的密钥，或希望由其他密钥代为投票，请参阅 [指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何从冷密钥向热密钥授予治理投票权限。
提案详情和投票可通过 `inferenced` 查看。任何活跃节点均可使用。可用节点包括：

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai

投出您的选票（`yes`、`no`、`abstain`、`no_with_veto`）：`--unordered` 和 `--timeout-duration` 标志需要 v0.2.12 或更高版本的 `inferenced`。

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
要检查投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 54 -o json --node $NODE_URL/chain-rpc/
```

**截止日期**

- 投票截止：2026 年 5 月 22 日 22:12:25 UTC
- 提议升级高度：4267300
- 预计升级时间：2026 年 5 月 26 日 14:42:02 UTC
- 操作员时间线：投票于 5 月 22 日 22:12 UTC 结束 → 升级高度约 5 月 26 日 14:42 UTC → 升级周期剩余阶段跳过确认 PoC（≤10000 区块宽限期）→ MiniMax 启动快照在 start_poc − 500 块时（约 43 分钟前）→ 首个 MiniMax PoC 阶段在升级后下一个周期边界开始 → MiniMax 处罚在链周期 278 时执行。

**注意**

- 请在升级窗口期间保持在线，以便及时应用任何后续步骤或缓解指令。
- 升级期间，Cosmovisor 会在 `.inference/data` 目录中创建完整状态备份；请确保有足够的磁盘空间（主网中 Cosmovisor 对 `application.db` 的备份通常为数十 GB，需提前确认）。有关如何安全删除 `.inference` 目录中旧备份的指南，请参阅 [文档。](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)
- 如果 `application.db` 占用大量磁盘空间，可应用 cosmovisor 备份 [指南](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it) 中描述的清理技术。
- 该提案将有意在升级高度到升级周期结束（10000区块宽限期）之间跳过确认 PoC。若获批准，此跳过属预期行为，并非故障；新快照逻辑将在下一个周期开始。
- 若获批准，升级后 devshard 存储可选择由共享的 Postgres 实例提供（与负载存储使用相同的环境变量）。本地 SQLite 将保持默认设置，并自动清理（保留最近3个周期）。
- 如果提案未通过（未达到法定人数，或 `no_with_veto` 超过⅓），链上无任何变化，升级将不会发生。操作员可能会看到 `PROPOSAL_FAILED` 状态；这是预期行为，无需采取任何操作。

## 2026年5月18日

代理容器可能会全局限制对 devshards 的并行连接数，而非按客户端限制

包含修复的 PR：[https://github.com/gonka-ai/gonka/pull/1183](https://github.com/gonka-ai/gonka/pull/1183)

要应用此修复，请：

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

在PoC/确认PoC阶段之外更新容器更安全。要检查是否存在确认PoC：
```
curl "https://node3.gonka.ai/v1/epochs/latest" | jq '.is_confirmation_poc_active'
```

## 2026年5月17日

**第267轮：PoC验证已恢复**

在第267轮中，PoC验证已成功完成，受影响的主机已能重新加入活跃集合。

第266轮的问题是由针对运行Kimi模型的主机的攻击引起的。网络继续运行，但该攻击与若干相关条件共同导致许多参与者未能进入第266轮。

在应用额外防护措施期间，推理服务可能暂时不可用。访问预计将逐步恢复，首先通过若干社区代理和经纪人端点。

**发生了什么**

在第266轮中，网络的活跃权重显著下降。

该问题已追溯至使用非标准语义的推理请求。此攻击向量影响了运行Kimi模型的主机，并扰乱了其中许多主机的PoC参与。

在第267轮中，主机得以恢复，PoC验证已成功完成。

**推理可用性**

网络将不再接受使用受影响的非标准语义的请求。

在相关防护措施应用期间，推理服务可能暂时不可用。访问预计将逐步恢复，首先通过若干社区代理和经纪人端点。

**第267轮中Kimi的权重**

由于现有协议规则：单个模型的总权重不得超过上一轮所有模型总权重的75%，Kimi在第267轮中的活跃权重较低。

由于第266轮的总活跃权重显著降低，此规则也限制了Kimi在第267轮中的权重。

随着未来轮次中正常的PoC参与持续进行，权重可能需要数天才能稳定。

**主机所需操作**

1. 尽可能保持您的API节点在线并可访问。这有助于保留对主机参与情况的可见性，并支持后续审查。
2. 监控下一几轮的PoC参与情况。确保您的节点如预期般进入PoC，且活跃权重正确反映。
3. 仅使用受支持的推理请求格式。不要发送或路由具有非标准请求语义的推理流量。
4. 预期会出现临时推理中断。访问可能不会立即在所有地方恢复，预计将通过社区代理和经纪人端点逐步恢复。
5. 在社区渠道或本帖中分享相关日志或观察结果。如果您的主机在第266轮受到影响，或在后续轮次中表现异常，这一点尤为重要。

## 2026年5月16日

**第266轮：PoC权重下降调查**

在当前轮次（#266）中，网络的活跃权重显著下降。
似乎PoC投票未能收集到本轮所需的投票。确切原因尚未确认，社区正在积极调查此事。

**对受影响参与者**

如果您的节点未能进入本轮，请尽可能保持您的API节点在线并可访问。
这可能有助于赔偿委员会收集PoC参与的证据，并更准确地核算受影响的贡献。

**调查进行中**

社区成员目前正在审查第266轮期间发生的情况。一旦对根本原因有更清晰的认识，将发布更新。
如果您有相关观察、日志、假设或其他有助于调查的技术背景，请在此处分享。

## 2026年5月15日

**v0.2.13升级提案进入治理**

[v0.2.13提案](https://github.com/gonka-ai/gonka/pull/1143) 已上链并开放投票。

- 包括：Kimi（`0.78`）权重重新校准、新模型 `MiniMaxAI/MiniMax-M2.7`、验证阈值更新、devshard存储重构，以及若干PoC/奖励修复、以太坊桥主网激活。
- 提案在升级后延长了宽限期，升级后3000个区块内不会惩罚主机。
- 所需准备：桥接容器检查、MiniMax决策、仪表板更新、投出投票。
- 在提案获得批准之前，链上不会有任何变化。

PR：[https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)

**关键变更****模型**

- 将 `MiniMaxAI/MiniMax-M2.7` 添加为治理批准的模型和概念验证模型。
- 在 vLLM 0.20.1 发布后，根据 Qwen-on-B200 参考重新校准 `WeightScaleFactor` 值：
    - Qwen 235B：`0.359`
    - Kimi K2.6：`0.78`
    - MiniMax-M2.7：`0.3024`
    - 参考数据：[https://docs.google.com/spreadsheets/d/1dHHlbhW1_hVgd7Q6MtmcVSOpmnl7NnynoTzPHJ1oU-g/edit?gid=0#gid=0](https://docs.google.com/spreadsheets/d/1dHHlbhW1_hVgd7Q6MtmcVSOpmnl7NnynoTzPHJ1oU-g/edit?gid=0#gid=0)
- 更新推理验证阈值

**inference-chain**

- 将 devshard 随机数上限从 `20_000` 提高到 `1_000_000`。
- 将每个纪元的最大 devshards 数量从 `100` 提高到 `500_000`。
- 修复新模型引导期间确认 PoC 奖励核算问题。
- 在本次升级纪元剩余时间内禁用确认 PoC，以便新快照逻辑从下一个纪元干净启动。
- 当参与者再次激活时，重置 `ConsecutiveInvalidInferences`。
- 为在 v0.2.12 之前加入的 DAPIs 补全缺失的 `MsgRespondDealerComplaints` 授权。
- 修复桥接和流动性池合约权限检查的 Wasm keeper 访问问题。
- 将创世守护者调整投票权降低至约 25%，并将链上治理法定人数设为 `0.25`。在守护者不投票的情况下，其余 75% 投票权的有效法定人数为 1/3（`0.25 / 0.75 = 0.334`）。

**Ethereum 桥接主网激活**

- 通过升级处理程序激活 Ethereum 主网桥接设置。
- 注册 Ethereum 桥接合约地址 `0x972a7a92d92796a98801a8818bcf91f1648f2f68`、USDC 和 USDT 代币元数据、桥接交易授权以及 CW20 `wrapped_token` 代码 ID `105`。

**去中心化 API 与 devshard**

- 默认在端口 `9400` 启用 `NodeManagerGrpcPort`。
- 为 devshard 状态添加 Postgres 支持。
- 为 SQLite 和 Postgres devshard 数据库添加清理功能。
- 添加状态快照以加快 devshard 启动和恢复速度。
- 修复 OpenAI 兼容 API 响应解析。
- 修复长时间启动行为和 devshard 失效流程的边缘情况。

**升级计划**

如果获得批准，二进制版本将通过链上升级提案更新。有关升级过程的更多信息，请参阅 [/docs/upgrades.md.](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.13/docs/upgrades.md)

**升级前的必要操作**

如果提案获得批准，建议进行以下准备工作。

**在纪元 278 前的 `MiniMaxAI/MiniMax-M2.7` 参与选择**

对于每个治理批准的模型，多模型 PoC 要求每个主机明确选择参与方式（DIRECT / DELEGATE / REFUSE）。在模型的 `PenaltyStartEpoch` 之后不采取任何操作将导致惩罚。在此阶段，您应提前决定首选选项，以便在提案通过且升级成功应用于主网时能够迅速行动。

**桥接容器更新/验证**

所有主机需验证其桥接容器是否已部署、运行最新版本并正确同步。部分主机可能已部署桥接容器。在这种情况下，请先确认您正在运行当前版本，再执行任何进一步操作。
请按照说明操作：[https://gonka.ai/docs/network-updates/#may-7-2026](https://gonka.ai/docs/network-updates/#may-7-2026)

**仪表板/浏览器更新（升级前或升级后）**

主机需更新仪表板/浏览器。请从 `gonka/deploy/join` 目录运行以下命令：
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

**如何投票**

如果您没有直接访问持有投票权密钥的权限，或希望使用其他密钥代为投票，请参阅 [指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何将治理投票权限从冷密钥授予热密钥。

提案详情和投票可通过 `inferenced` 查看。任何活跃节点均可使用。可用节点包括：

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai

投出您的选票 (`yes`, `no`, `abstain`, `no_with_veto`):
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
要检查投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 52 -o json --node $NODE_URL/chain-rpc/
```

**截止日期**

- 投票结束：2026年5月17日 07:58:37 UTC
- 提议的升级高度：4133422
- 预计升级时间：2026年5月18日 13:03:17 UTC

**注意**

- 请在升级窗口期间保持在线，以便及时执行任何后续步骤或缓解指令。
- 升级期间，Cosmovisor 会在 `.inference/data` 目录中创建完整的状态备份；请确保有足够的磁盘空间。有关如何安全删除 `.inference` 目录中的旧备份的指南，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。
- 如果 `application.db` 占用了大量磁盘空间，可以应用 cosmovisor 备份[指南](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it) 中描述的清理技术。
- 该提案将有意跳过从升级高度到升级周期结束（3000个区块的宽限期）之间的确认PoC。如果获得批准，此跳过是预期行为，并非故障；新的快照逻辑将在下一个周期开始。
- 如果获得批准，升级后 devshard 存储可选择由共享的 Postgres 实例支持（与有效负载存储使用相同的环境变量）。本地 SQLite 将保持默认，并自动清理（保留最近3个周期）。

## 2026年5月7日

**桥接容器更新/验证必需**

作为即将进行的 v0.2.13 升级准备工作的一部分，该升级可能包括以太坊端合约激活，所有主机均需验证其桥接容器是否已部署、运行最新版本并正确同步。

部分主机可能已部署桥接容器。在这种情况下，请先检查您是否运行的是当前版本，再采取进一步操作。

最新桥接镜像：
```
ghcr.io/product-science/bridge:0.2.5-post5@sha256:8d2f217115c65b27fcb6fe1497471c30891534f18685bd3007d168aa7f1a9371
```
检查您的桥接是否已运行正确版本：
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
您的桥接容器正在运行预期镜像。

请同时验证桥接是否已同步：
```
docker logs bridge --tail 10000 | grep "Skeleton sync bounds" | tail -1
```
输出应指向最近的已确认以太坊区块，且不应显著落后。

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
如果桥接器无法同步，以太坊检查点同步端点可能不可用。在这种情况下，请更新 `BEACON_STATE_URL` 并重启桥接器：
```
sudo sed -i 's|- BEACON_STATE_URL=.*|- BEACON_STATE_URL=https://beaconstate.info/|' docker-compose.yml

source config.env && docker compose up bridge -d --force-recreate --no-deps
```
更新或重启桥接器后，请如上所述验证其是否已同步。

## 2026年5月6日

**升级 v0.2.13 的 PR 审查**

[此拉取请求](https://github.com/gonka-ai/gonka/pull/1143) 针对下一个链上软件升级 v0.2.13 已开放审查。

请直接审查 PR 代码，并对您发现的任何问题、疑问、改进建议、边缘情况或漏洞留下评论。

有意义的审查贡献，包括重要评论、错误发现和安全问题，可能有资格在下一轮升级周期中获得社区奖励。

本次仅为拉取请求的审查请求，不启动正式投票。治理投票流程将在审查期结束后开始，很可能明天开始。

**关键变更****inference-chain**

- 确认 PoC 在测量权重、保留权重和奖励重缩放时使用了不同的模型集。在新模型引导期间，这可能导致同时服务了合格模型和尚未合格模型的诚实矿工被削减。修复方案存储了一个纪元的可确认模型和权重缩放因子快照，并在所有确认和奖励权重计算中使用该快照。
- 当参与者重新变为 ACTIVE 时，`ConsecutiveInvalidInferences` 未被重置。一个新错误推断可能立即再次使其失效。计数器现在在重新激活和即将晋升时重置。
- 在 v0.2.12 之前加入的 DAPIs 在其冷到暖的授权中未包含 `MsgRespondDealerComplaints`。升级会回填该权限，以便它们能够响应交易商投诉。
- Devshard 结算使用了硬编码的 `20_000` nonce 限制。现在限制为 `DevshardEscrowParams.MaxNonce`，v0.2.13 升级将其设置为 `1_000_000`。升级还将 `MaxEscrowsPerEpoch` 提高到 `500_000`。
- 升级为当前纪元安装了一个宽限期条目，延长了 `UpgradeProtectionWindow`（3000 个区块）。从升级高度到升级纪元结束，确认 PoC 触发将被跳过，因此新的快照逻辑仅从下一个纪元开始运行。复用了 v0.2.10 的宽限期原语。
- Wasm keeper 访问在应用连接后解析，因此合约权限检查适用于桥接器和流动性池操作。

**decentralized-api**

- 一些 OpenAI 兼容的上游返回数值型 `stop_reason` 值。`Choice.StopReason` 现在接受任何 JSON 类型，因此这些响应不再因反序列化失败。
- 内部 devshard 存储迁移不再阻塞 dapi 启动。在迁移和恢复完成之前，devshard 路由保持不可用。

**devshard**

- 由于旧的托管数据保留在一个 SQLite 存储中，devshard 存储可能无限增长。现在存储按纪元范围管理，并在后台清理旧纪元，仅保留最近的 3 个纪元。
- Devshard 现在支持更大部署的共享存储选项。它现在可以使用 Postgres 作为主存储，SQLite 仍作为本地后备存储。
- Postgres 数据按 `epoch_id` 对会话、差异和签名进行分区，以便清理可以干净地删除旧纪元数据。
- 状态快照减少了长期会话的恢复工作量。
- 负载查找被固定到托管纪元，并为纪元边界和遗留纪元 0 请求提供回退机制。
- 当前纪元分片统计信息暴露了 nonce、版本、组和每个主机的计数器。

**bridge**

- 桥接工具处理 Sepolia 标志，并将 Gonka BLS 密钥/签名转换为以太坊合约期望的 EIP-2537 格式。
- 添加了用于 GNK 和包装代币桥接操作的脚本。

审查者可以在此处找到完整的升级提案、迁移详情、测试摘要和建议流程：

- [https://github.com/gonka-ai/gonka/blob/347d947596aba754e453e58d5f82ae6054233a9a/proposals/governance-artifacts/update-v0.2.13/README.md ](https://github.com/gonka-ai/gonka/blob/347d947596aba754e453e58d5f82ae6054233a9a/proposals/governance-artifacts/update-v0.2.13/README.md )

- [https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)

## 2026年5月6日

在 api 容器版本 v0.2.11、v0.2.12 和 v0.2.12-api-post2 中存在潜在问题。容器重启后，9100、9200 和 9400 端口上的服务器可能启动延迟。这延迟了 api 激活，导致一些矿工因此跳过了确认 PoC。

修复方案通过并行加载 devshards 并从快照恢复现有 devshard 会话来移除该阻塞。

[https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)

请更新 api 容器的二进制文件。在每次 PoC 开始前有 500 个区块的无 CPoC（`confirmation_poc_safety_window`）窗口，因此这可能是部署的最安全版本。

更新前，请确保没有 CPoC 或 PoC 正在运行。

部署方法（一次一台机器以降低风险）：
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

在上一个周期中，发现Kimi-K2.6在解析某些响应时存在一个轻微的bug。

修复：[https://github.com/gonka-ai/gonka/pull/1143/changes#diff-4c44fd18f746bca1c63d9bcbb9a73f06bc0172bfb8a33152854920d4dffff0e8](https://github.com/gonka-ai/gonka/pull/1143/changes#diff-4c44fd18f746bca1c63d9bcbb9a73f06bc0172bfb8a33152854920d4dffff0e8)

我们建议替换api容器的二进制文件。除修复外，新版本还启用了对devshard数据库的修剪功能，并为devshard状态增加了Postgres支持。

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
此外，如果您有托管Kimi-K2.6的MLNode，请在部署参数中添加部署参数"--enable-auto-tool-choice"。为此，您可以重复以下命令（以B200为例）：
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

然后使用docker restart join-mlnode-308-1重启MLNode容器。

这些操作应在PoC/确认PoC未进行时执行。

## 2026年5月5日

在Kimi-K2.6启动过程中，主机观察到30%的最低直接参与阈值在实际中难以满足。为避免Kimi-K2.6在未来的周期中失去资格的风险，并进一步简化新模型的接入，建议将阈值降低至10%。

安全模型保持不变：PoC验证本身未更改，仍需超级多数验证算力才能接受结果。

该提案被加速处理，以便在下一次PoC之前生效。投票将持续12小时。

投票方式（`yes`，`no`，`abstain`，`no_with_veto`）：
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

**投票截止**：2026-05-05 19:00:54 UTC

## 2026年5月4日

**Kimi K2.6现已在Gonka网络上激活**

`moonshotai/Kimi-K2.6`已通过启动流程，并加入Gonka网络的PoC参与。

该过程由网络中的主机协同完成：基础设施已准备就绪，意向已提交，委托与拒绝已设置，部署已测试。

对于多模型PoC，这意味着Kimi现在作为独立模型组拥有自己的参与和奖励追踪。

运行Kimi的主机应继续像往常一样监控其MLNode和PoC参与情况。

## 2026年5月4日

**已提交PoCIntent的主机需执行操作：部署 `Kimi K2.6`**

今日的预评估检查已通过 `moonshotai/Kimi-K2.6`。

已提交PoCIntent的主机应在PoC于块 `3874496` 开始前，将至少一个MLNode从 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 切换至 `moonshotai/Kimi-K2.6`。

预评估与PoC开始之间有500个区块的窗口期。在此期间无CPoC任务，因此已声明意向的主机可安全地将其模型节点切换至 `Kimi K2.6`。

请遵循指南完成所需的部署步骤：[https://gonka.ai/docs/host/kimi-bootstrap/](https://gonka.ai/docs/host/kimi-bootstrap/)

## 2026年5月4日

转移代理 `node1`、`node2` 和 `node3` 已被禁用。所有主网推理现在均通过 `node4` 路由，该代理基于新的 `devshard` 计费方案运行。

这标志着网络的一个重要里程碑：`devshard` 已上线并具备生产就绪能力。`node4` 将作为未来推荐的公共网关。

**需执行操作**：请将您的端点更新为 `node4`。

## 2026年5月2日

今日的预资格验证未通过，对于 `PoCIntent` 权重低于30% 的主机。请保持您的MLNode使用 `Qwen235B`，并于明天提交下一个周期的意向。

## 2026年4月30日

**升级已执行：v0.2.12 现已在主网上线**

关于升级提案v0.2.12的链上治理投票已结束。该提案已获批准，升级已在主网上成功执行。

**当前生效的关键变更**

- **多模型PoC（最大变更）**（[#1039](https://github.com/gonka-ai/gonka/pull/1039)）。将计算证明从单一固定模型过渡为按模型划分的PoC组。每个经治理批准的模型生成其自身的本地PoC权重，并通过模型特定系数聚合为总共识权重。每个主机必须参与每个模型组（直接参与或委托PoC投票权重）。
- **`moonshotai/Kimi-K2.6` 作为第二个模型被引入**：该模型组将在升级后两个周期激活。该模型的系数为Qwen235B的3.51倍，基于相同硬件（8xH200、8xB200）上的模型计算复杂度。
- **Devshard独立运行时**（[#1045](https://github.com/gonka-ai/gonka/pull/1045)）。将devshard发布与DAPI/主网发布周期解耦。
- **Certik 审计修复** ([#1020](https://github.com/gonka-ai/gonka/pull/1020), [#1021](https://github.com/gonka-ai/gonka/pull/1021), [#1022](https://github.com/gonka-ai/gonka/pull/1022), [#987](https://github.com/gonka-ai/gonka/pull/987), [#949](https://github.com/gonka-ai/gonka/pull/949), [#988](https://github.com/gonka-ai/gonka/pull/988), [#825](https://github.com/gonka-ai/gonka/pull/825), [#1011](https://github.com/gonka-ai/gonka/pull/1011), [#1029](https://github.com/gonka-ai/gonka/pull/1029), [#789](https://github.com/gonka-ai/gonka/pull/789))。已处理审计发现的问题。
- **协议强化**。保留节点（`POC_SLOT=true` 在单个 PoC / CPoC 时间内随机采样。其他更新包括将 `mlnode` 版本传播到链上 `HardwareNode`，修复 DKG 发牌者共识，使遗留验证者惩罚与所需抵押品语义对齐，确保 devshard 保证金资金的原子性，以及为 `inference_finished` 事件解析添加零时间戳容差。

**主机指南**

- 部署、委托或明确拒绝新治理批准的模型（包含的模型将在升级后 2 个周期激活）。请参阅[指南。](https://gonka.ai/docs/host/multi_model_poc/)

- 请主机更新仪表板/浏览器。请从 `gonka/deploy/join` 目录运行以下命令：

```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

- 二进制版本：通过链上升级流程更新。

- 迁移：迁移详情已在[ v0.2.12 文档](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/docs/upgrades.md)中记录。

这些变更的更多详情请参见治理工件：[https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.12/proposals/](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.12/proposals/)

## 2026年4月29日

**升级 v0.2.12：预先下载二进制文件**

v0.2.12 升级提案的链上治理流程即将结束。

- 投票截止：2026年4月30日 00:12 UTC
- 升级高度：3834200
- 预计升级时间：2026年4月30日 06:00 UTC

鼓励主机查看 [GitHub](https://github.com/gonka-ai/gonka/pull/948) 上的提案并参与投票。

提前预下载二进制文件有助于避免在升级窗口期内依赖 GitHub 的可用性。

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

v0.2.12 升级提案现已进入链上投票期的中段。

- 投票截止：2026年4月30日 00:12 UTC
- 升级高度：3834200
- 预计升级时间：2026年4月30日 06:00 UTC

鼓励主机查看 [GitHub](https://github.com/gonka-ai/gonka/pull/948) 上的提案并投票。

**升级前必须执行的操作**

随着网络接近升级窗口，主机应提前准备节点，以防提案通过。

此清理过程**必须在升级发生前完成**。如果在升级时，您的节点配置包含不受支持的模型，**节点将被拒绝并下线**。

版本 0.2.12 将移除所有不在升级后批准列表中的治理模型。在主网上，仅保留此前强制实施的模型和 Kimi。
每个 DAPI 会本地持久化其 MLNode 配置。启动时，它会将每个配置的模型与链上治理列表进行验证。如果配置中包含至少一个不受支持的模型，整个节点将被拒绝，主机将下线。

版本 0.2.11 通过将运行时视图裁剪至强制模型来掩盖此问题，因此即使持久化配置中仍包含额外模型，`/admin/v1/nodes` 也显示为干净。版本 0.2.12 停止了这种裁剪，直接加载持久化配置。

为解决此问题，以下脚本将查找 `/admin/v1/config` 中包含额外模型的每个节点，并向 `/admin/v1/nodes/<id>` 发送一个带有清理后配置的 `PUT` 请求。这些更改将在 60 秒内持久化。其余模型的参数、硬件和端口将完全保留。未列出强制模型的节点将被跳过，需手动修复。

将以下脚本粘贴到主机的 shell 中。默认情况下，它将应用更改。若要预览更改但不应用，请将 `APPLY=dry` 设置为任意非 `--apply` 的值。

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


运行脚本后等待 60 秒，确保更改已持久化，再触发升级。然后验证配置：

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

**v0.2.12 升级提案进入治理**

[升级提案](https://github.com/gonka-ai/gonka/pull/948) 已上链并开放投票，用于下一个链上软件版本 v0.2.12。

**关键变更**

- **多模型 PoC（最大变更）**（[#1039](https://github.com/gonka-ai/gonka/pull/1039)）。将计算证明从单一固定模型过渡为按模型分组的 PoC。每个经治理批准的模型生成其自身的本地 PoC 权重，并通过模型特定系数聚合为总共识权重。每个主机必须参与每个模型组（直接参与或委托 PoC 投票权重）。
- **`moonshotai/Kimi-K2.6` 被引入为第二个模型：** 模型组将在升级后两个周期激活。该模型的系数为 Qwen235B 的 3.51 倍，基于相同硬件（8xH200、8xB200）上的模型计算复杂度。
- **Devshard 独立运行时**（[#1045](https://github.com/gonka-ai/gonka/pull/1045)）。将 devshard 发布与 DAPI/主网发布周期解耦。
- **Certik 审计修复**（[#1020](https://github.com/gonka-ai/gonka/pull/1020)、[#1021](https://github.com/gonka-ai/gonka/pull/1021)、[#1022](https://github.com/gonka-ai/gonka/pull/1022)、[#987](https://github.com/gonka-ai/gonka/pull/987)、[#949](https://github.com/gonka-ai/gonka/pull/949)、[#988](https://github.com/gonka-ai/gonka/pull/988)、[#825](https://github.com/gonka-ai/gonka/pull/825)、[#1011](https://github.com/gonka-ai/gonka/pull/1011)、[#1029](https://github.com/gonka-ai/gonka/pull/1029)、[#789](https://github.com/gonka-ai/gonka/pull/789)）。已解决审计发现的问题。
- **协议加固。** 对保留节点（`POC_SLOT=true`）随机采样进行单次 PoC/CPoC 时间验证。其他更新包括将 `mlnode` 版本传播至链上 `HardwareNode`、修复 DKG 交易方共识、对齐遗留验证者惩罚与所需抵押品语义、确保 devshard 托管资金的原子性，以及为 `inference_finished` 事件解析添加零时间戳容差。

**升级计划**

二进制版本将通过链上升级提案进行更新。有关升级过程的更多信息，请参阅[/docs/upgrades.md.](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/docs/upgrades.md)

**所需操作****升级前**

从 `docker-compose.yml` 部署 `versiond` 和 `proxy` 服务的最新版本（使用仓库的 release/v0.2.12 标签）：
```
git checkout release/v0.2.12
```
部署（重要：必须使用 `--no-deps`）：
```
source config.env && \
docker compose -f docker-compose.yml up versiond proxy -d --no-deps
```
这将使 `devshard` 独立于 `api` 服务运行。

**升级后**

部署、委托或明确拒绝新的治理批准模型（包含的模型将在升级后两个周期激活）。请参阅[指南](https://gonka.ai/docs/host/multi_model_poc/)。

**升级前或升级后**

请主机更新仪表板/浏览器。请从 `gonka/deploy/join` 目录运行以下命令：
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

**如何投票**

如果您没有直接访问拥有投票权的密钥，或希望使用其他密钥代为投票，请参阅[指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何将治理投票权限从冷密钥授予热密钥。

提案详情和投票可通过 `inferenced` 查看。任何活跃节点均可使用。可用节点包括：

- [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
- [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
- [https://node3.gonka.ai](https://node3.gonka.ai)

投出您的投票（ `yes`，`no`，`abstain`，`no_with_veto` ）：
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
要检查投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 44 -o json --node $NODE_URL/chain-rpc/
```

**截止日期**

- 投票结束：2026年4月30日 00:12 UTC
- 升级高度：3834200
- 预计升级时间：2026年4月30日 6:00 UTC

**注意**

- 请在升级窗口期间保持在线，以便及时执行任何后续步骤或缓解指令。
- 升级期间，Cosmovisor 会在 `.inference/data` 目录中创建完整的状态备份；请确保有足够的磁盘空间。有关如何安全删除 `.inference` 目录中的旧备份的指南，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。
- 如果 `application.db` 占用了大量磁盘空间，可以应用 cosmovisor 备份[指南](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)中描述的清理技术。
- 升级后，Postgres 可作为本地负载存储的选项。

## 2025年4月15日

**升级 v0.2.12 的 PR 审查**

[拉取请求](https://github.com/gonka-ai/gonka/pull/948) 用于下一个链上软件升级 v0.2.12，现已开放审查。

请直接审查 PR 代码，并对您发现的任何问题、疑问、改进建议、边界情况或漏洞留下评论。

有意义的审查贡献，包括重要评论、错误发现和安全问题，可能在下一轮升级周期中获得社区奖励。

本次仅为拉取请求的审查请求，不启动正式投票。治理投票流程将在审查期结束后开始。

**关键变更**

- **多模型 PoC（最大变更）** ([#1039](https://github.com/gonka-ai/gonka/pull/1039))。将计算证明从单一固定模型过渡到按模型分组的 PoC。每个经治理批准的模型生成自己的本地 PoC 权重，并通过模型特定系数聚合为总共识权重
- **共识层交易费用与自动迁移** ([#937](https://github.com/gonka-ai/gonka/pull/937), [#981](https://github.com/gonka-ai/gonka/pull/981))。引入由治理控制的 gas 价格。协议职责消息（PoC、验证、推理、BLS DKG）通过 `NetworkDutyFeeBypassDecorator` 免费。`MsgPoCV2StoreCommit` 采用双组件费用（基础验证 + 计数线性）作为主要 Sybil 防御机制。详情请参见 [docs/host_onboarding.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/docs/host_onboarding.md)。
- **Devshard 独立运行时** ([#1045](https://github.com/gonka-ai/gonka/pull/1045))。将 devshard 发布与 DAPI/主网发布周期解耦。
- **Certik 审计修复** ([#1020](https://github.com/gonka-ai/gonka/pull/1020), [#1021](https://github.com/gonka-ai/gonka/pull/1021), [#1022](https://github.com/gonka-ai/gonka/pull/1022), [#987](https://github.com/gonka-ai/gonka/pull/987), [#949](https://github.com/gonka-ai/gonka/pull/949), [#988](https://github.com/gonka-ai/gonka/pull/988), [#825](https://github.com/gonka-ai/gonka/pull/825), [#1011](https://github.com/gonka-ai/gonka/pull/1011), [#1029](https://github.com/gonka-ai/gonka/pull/1029), [#789](https://github.com/gonka-ai/gonka/pull/789))。所有已知审计问题均已解决。
- **协议加固**。实施更强的 PoC v2 RNG（256 位全熵，之前为 32 位），将通过单独的治理投票激活。其他更新包括将 `mlnode` 版本传播到链上 `HardwareNode`、修复 DKG 交易商共识、使遗留验证者惩罚与所需抵押品语义对齐、确保 devshard 保证金基金的原子性，以及为 `inference_finished` 事件解析添加零时间戳容差。

**升级计划**

二进制版本将通过链上升级提案更新。有关升级流程的更多信息，请参阅 [/docs/upgrades.md.](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/docs/upgrades.md)

**升级后所需操作**

现有主机：

- 确保冷钱包账户持有足够的资金（例如 100 GNK），以覆盖自动授予的费用限额支出。
- 部署、委托或明确拒绝每个治理批准的模型（新模型将在治理批准后 3 个周期激活）
- 从 `docker-compose.yml` 部署 `versiond` 服务（使用主分支的最新提交）
- 使用新版本和参数重新创建 `proxy` 容器。文档将提供确切命令。

## 2026年4月1日

ML 节点 `3.0.12-post6` 可用

新版本 mlnode 现已发布：`ghcr.io/gonka-ai/mlnode:3.0.12-post6`

- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post6
- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post6-blackwell
- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post6-blackwell-sm120

此版本现已设为主分支的默认版本：[https://github.com/gonka-ai/gonka/commit/ec8f45573149ce5686e8e5fc29f1a8f49a295689](https://github.com/gonka-ai/gonka/commit/ec8f45573149ce5686e8e5fc29f1a8f49a295689)

**变更内容**

此版本已在最近几个周期中被部分矿工使用。
初步观察表明，对于接近 PoC 开始的节点，稳定性有所提升。

更新修复了 PoC 开始附近的一个边缘情况，此前在某些条件下可能导致性能下降。

vLLM 的完整变更：[https://github.com/gonka-ai/vllm/compare/release/v0.9.1-pocv2-post5...release/v0.9.1-pocv2-post6](https://github.com/gonka-ai/vllm/compare/release/v0.9.1-pocv2-post5...release/v0.9.1-pocv2-post6)

**指南**

- 建议升级到此版本
- 此版本与之前版本完全兼容

## 2026年3月20日

**升级已完成：v0.2.11 已在主网上线**

v0.2.11 升级提案的链上治理投票已结束。提案已获批准，升级已在主网上成功执行。

**当前生效的关键变更****[初始扩展架构：基于 `devshards` 的推理会话](https://github.com/gonka-ai/gonka/pull/877)**

此升级引入了基于 `devshards` 的推理会话的初始版本，旨在提升推理扩展性。

**[`StartInference` 和 `FinishInference` 性能改进](https://github.com/gonka-ai/gonka/pull/812)**

这些性能改进可使每个区块的推理数量最多提升 100 倍，具体取决于工作负载和网络条件。
有关这些及其他变更的更多详细信息，请参见：[https://github.com/gonka-ai/gonka/pull/813](https://github.com/gonka-ai/gonka/pull/813)

**主机指南**

- **二进制版本**：通过链上升级流程更新。
- **迁移**：测试和迁移详情请参阅 [v0.2.11 文档](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.11/docs/upgrades.md)。

有关这些变更的更多详细信息，请参阅治理文档：[https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.11/proposals/](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.11/proposals/)

## 2026年3月19日

**升级 v0.2.11：提前下载二进制文件**

v0.2.11 升级提案的链上治理流程即将结束。

- 投票截止时间：2026年3月20日 05:59:52 UTC
- 升级高度：3186100
- 预计升级时间：2026年3月20日 14:30 UTC

建议主机查阅 [GitHub](https://github.com/gonka-ai/gonka/pull/813) 上的提案并参与投票。
提前下载二进制文件有助于避免在升级窗口期内依赖 GitHub 的可用性。

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

下一个链上软件版本 v0.2.11 的升级提案现已上链并开放投票。若获批准，该提案将引入基于 `devshards` 的推理会话的初始版本以提升推理扩展性，并显著改进 `Start`/`FinishInference` 性能。

**关键变更****[初始扩展架构：基于 `devshards` 的推理会话](https://github.com/gonka-ai/gonka/pull/877)**

此升级引入了基于 `devshards` 的推理会话的初始版本，旨在提升推理扩展性。

目前，通过每条链上交易处理推理限制了吞吐量。此设计将推理执行和验证移至指定的链下子组，而链仅负责会话创建和最终结算。

这有意是一个早期且受限的版本。提出此版本用于主网审查和有限生产测试，并非因为其已完善，而是因为此类系统需要尽早暴露在真实网络条件下。部分问题仅靠本地测试难以发现。当前实现已设计为避免对矿工奖励产生负面影响。

**[`StartInference` 和 `FinishInference` 性能改进](https://github.com/gonka-ai/gonka/pull/812)**

- 减少 `MsgStartInference` 和 `MsgFinishInference` 的不必要的状态写入和查询开销。
- 简化统计处理，减少推理生命周期中的工作量，以提升区块执行稳定性。

在类似主网的条件下，这使得每个区块可容纳最多 100 倍的推理数量，具体取决于工作负载和网络条件。  ￼
有关这些及其他变更的更多详细信息，请参见：[https://github.com/gonka-ai/gonka/pull/813](https://github.com/gonka-ai/gonka/pull/813)

**升级前建议操作****`application.db` 剪枝**

强烈建议主机在升级前根据提供的说明执行 `application.db` 剪枝。

提前执行此操作非常重要。若大量节点推迟到升级后才进行剪枝，网络中可能同时启动剪枝活动，造成不必要的运维压力。
剪枝说明请参见：[https://gonka.ai/FAQ/#__tabbed_7_4](https://gonka.ai/FAQ/#__tabbed_7_4)

**浏览器更新**

请主机更新仪表板/浏览器。请在 `gonka/deploy/join` 目录下运行以下命令：
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

**如何投票**

如果您没有直接访问拥有投票权的密钥，或希望由另一个密钥代为投票，请参阅[指南](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)，了解如何将治理投票权限从冷密钥授予热密钥。

提案详情和投票可通过 `inferenced` 查看。任何活跃节点均可使用，可用节点包括：

- [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
- [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
- [https://node3.gonka.ai](https://node3.gonka.ai)

投出您的选票 ( `yes`, `no` , `abstain` , `no_with_veto` )：

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

要检查投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 31 -o json --node $NODE_URL/chain-rpc/
```

**截止日期**

- 投票结束：2026年3月20日，UTC时间05:59:52
- 升级高度：3186100
- 预计升级时间：2026年3月20日，UTC时间14:30

**注意**

- 请在升级窗口期间保持在线，以便及时执行任何后续步骤或缓解指令。
- 升级期间，Cosmovisor 会在 `.inference/data` 目录中创建完整状态备份；请确保有足够的磁盘空间。有关如何安全删除 `.inference` 目录中的旧备份的指南，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。
- 如果 `application.db` 占用了大量磁盘空间，可应用[此处](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)描述的清理技术。
- 升级后，Postgres 可作为本地负载存储的选项。

## 2026年3月17日

**PR审查：升级 v0.2.11**

下一次链上软件升级 v0.2.11 的[拉取请求](https://github.com/gonka-ai/gonka/pull/813)现已开放供审查。欢迎提供反馈和改进建议。

针对本次 PR 审查的有意义贡献，可能在下一次升级中提出奖励。

本次仅为拉取请求的审查邀请，而非正式投票的开始。治理投票流程将在审查期结束后启动。

**主要变更**

[初始扩展架构：基于 `devshards` 的推理会话](https://github.com/gonka-ai/gonka/pull/877)

本次升级引入了基于 `devshards` 的推理会话的初始版本，旨在提升推理可扩展性。

目前，通过每笔链上交易处理推理限制了吞吐量。此设计将推理执行和验证移至指定的链下子组，而链仅负责会话创建和最终结算。

这有意是一个早期且受限的版本。提出此版本供主网审查和有限生产测试，并非因为其已被认为完成，而是因为此类系统需要尽早暴露于真实网络条件中。某些类型的问题仅靠本地测试难以发现。当前实现已设计为避免对矿工奖励产生负面影响。

[`StartInference` 和 `FinishInference` 性能改进](https://github.com/gonka-ai/gonka/pull/812)

- 减少 `MsgStartInference` 和 `MsgFinishInference` 的不必要状态写入和查询开销。
- 简化统计处理，减少推理生命周期中的工作量，以提升区块执行稳定性。

在类似主网的条件下，这使得每个区块可容纳多达 100 倍的推理量，具体取决于工作负载和网络条件。  ￼

**升级前建议操作****`application.db` 剪枝**

强烈建议主机在升级前按照提供的说明剪枝 `application.db`。
提前执行此操作非常重要。如果大量节点推迟到升级后才进行剪枝，网络中可能同时启动剪枝活动，造成不必要的运维压力。
剪枝说明请参阅[此处](https://gonka.ai/FAQ/#__tabbed_7_4)。

**浏览器更新**

请主机更新仪表板/浏览器。请从 `gonka/deploy/join` 目录运行以下命令：
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```
审查者可在此处查看完整的升级提案、迁移详情、测试摘要和建议流程：[https://github.com/gonka-ai/gonka/pull/813](https://github.com/gonka-ai/gonka/pull/813)。

## 2026年3月16日

**API 二进制文件 `v0.2.10-post7` 已可用**

在 `v0.2.10` 中发现潜在漏洞。为降低当前升级前阶段的风险，建议在下一次 PoC 启动前将 api 二进制文件升级至 `v0.2.10-post7`。

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

[工具调用](https://gonka.ai/developer/quickstart/#4-tool-calling) 现已通过标准函数调用模式（`type: “function”`）提供支持。

集成流程很简单：

- 由开发者定义函数
- 当请求匹配时，模型返回结构化的调用参数
- 执行由应用端处理。

对于已使用代理层的团队，这可能是简化架构并依赖原生行为的好机会。实际上，这将带来更清晰的集成模式和更易维护的系统。

## 2026年3月6日

**注意：v0.2.11 升级预计将于下周初进入审核和治理投票阶段。**

请密切关注并计划参与。投票是支持网络发展并确保升级与参与者实际需求保持一致的最简单方式之一。
如果您没有访问持有投票权的冷密钥的权限，建议提前安排投票委托。请联系该密钥的所有者，请求其授权您代为投票。若无此授权，其他账户无法提交投票。

在此设置中：

- 授权人 = 拥有投票权的账户（冷密钥）
- 被授权人 = 代表授权人提交投票的账户（热密钥）

被授权人仍可为其自身账户投票。授权人可随时撤销此权限。

以下是用于授予、检查、使用和撤销投票委托的复制粘贴命令。

1) 授予投票权限（从授权人密钥运行）
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

2) 验证授权是否存在（在任意节点上运行）
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

3) 使用被授权方投票
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

4) 撤销委托（从授权方密钥运行）
=== "Command"

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

API 二进制文件的新版本已发布。它更新了连接超时处理，并在 PoC 验证管道中引入了额外的检查。

1. 升级 v0.2.10 引入了对 Executor → MLNode 连接的严格 5 分钟超时，而某些请求可能需要更长时间。新版本的 API 将此值恢复，不再强制执行严格限制。
2. 之前的请求重试系统即使因处理超时（而非 TLS 超时）失败，仍会重试推理。
服务器端对长请求的重试通常无效，因为这会导致相同的超时场景。同时，客户端可能收到不一致的输出。新版本的 API 在此类情况下不再重试推理。
3. 当前被保留且不参与 PoC 生成的 MLNode 仍被用于 PoC 验证。这可能导致推理丢失。新版本将此类节点排除在 PoC 验证之外。
4. PoC 验证管道中增加了额外的安全防护措施。

PR: [https://github.com/gonka-ai/gonka/pull/785](https://github.com/gonka-ai/gonka/pull/785)

构建：[https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.10-post3/decentralized-api-amd64.zip](https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.10-post3/decentralized-api-amd64.zip)

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

**建议（可选）：vLLM / mlnode 构建在 PoC 开始时中断正在进行的请求**

现已提供新的 vLLM / mlnode 构建，可在 PoC 开始时中断正在进行的推理请求，以降低因 PoC 启动时仍有请求处于活跃状态而导致权重可能下降的风险。

来源：[https://github.com/gonka-ai/vllm/tree/release/v0.9.1-pocv2-post5/vllm](https://github.com/gonka-ai/vllm/tree/release/v0.9.1-pocv2-post5/vllm)

**建议尝试的镜像：**

- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post5
- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post5-blackwell
- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post5-blackwell-sm120

**备注：**

- 此构建旨在与前一版本向后兼容。
- 它已应用于少量节点，但仍建议在部署前审查变更。

## 2026年2月19日

**抵押参数更新提案——投票结果**

抵押参数更新提案已结束，但未达到法定人数。因此，根据当前治理规则，该提案被拒绝。这意味着更新的参数将不会激活。

如前所述，第180轮的抵押激活独立于本次投票。

由于提案未通过，创世时定义的抵押参数将在第180轮自动生效。

参与者应：

- 审查创世时定义的抵押参数。
- 在第180轮前准备并存入所需的 GNK。
- 确保 [抵押](https://gonka.ai/host/collateral/) 配置正确，否则从第180轮起，PoC 奖励将减少5倍。

抵押激活是协议从宽限期过渡到完全抵押的 PoC 权重模型的一部分。治理仍是调整参数的机制，但若无替代方案获批准，则默认规则生效。

!!! note "重要：存入时预留缓冲**

    强烈建议参与者**不要**存入精确的最低金额。由于归一化效应和网络级调整，PoC 权重在各轮之间可能波动。较小的权重可能经历相对更大的波动。为避免在轮次边界出现临时抵押不足，建议在抵押水平仍相对较低时，存入高达计算最低要求2倍的金额。这提供了操作安全性，防止因微小参数变动导致意外的权重降低。协议不会自动补充抵押。

    如果社区希望再次修订参数，可能会提出进一步的提案。

## 2026年2月19日

**PoC 权重归一化更新**

在最近升级后，节点权重因 PoC 持续时间归一化而调整。
为了将 PoC 权重与实际区块生成时间对齐，校准参数基于观察到的区块间隔选择。如实施所示，有效的 PoC 参考窗口比先前的名义假设长约5个区块。

因此：

- 平均节点权重下降（归一化效应）
- 显示的总 H100 等效容量成比例降低
- 相对 GPU 比例保持不变

**原因**

此前，PoC 权重计算依赖于名义的轮次持续时间假设。引入实时归一化后：

- PoC 持续时间与实际区块生成时间对齐
- 权重更准确地反映实际计算时间

由于有效归一化窗口比之前的名义模型长约5个区块，因此每个轮次重新计算的权重成比例降低。

**观察到的 GPU 权重变化（第175轮 → 第176轮）**

| GPU 类型 | 第175轮 | 第176轮 | 变化 |
|---------------------|----------:|----------:|--------:|
| A100-PCIE-40GB | 11.8 | 10.0 | -15.4% |
| A100-SXM4-80GB | 132.2 | 107.8 | -18.5% |
| H100 80GB HBM3 | 305.1 | 254.5 | -16.6% |
| H100 PCIe | 178.9 | 155.7 | -12.9% |
| H200 | 319.6 | 281.3 | -12.0% |

**Tracker（仪表板）维护人员操作**

由于已启用PoC持续时间归一化，且有效参考窗口现在比之前的名义假设长约5个区块，从第176轮开始的权重值反映了更新的计算模型。
从PoC权重推导H100等效容量或奖励预测的追踪器和仪表板，应从第176轮起验证其转换系数。
若仍使用归一化前的假设，显示的硬件等效值和预测奖励可能会被高估。

## 2026年2月18日

**升级已执行：v0.2.10 已在主网上线**

升级提案 v0.2.10 的链上治理投票已结束。该提案已获批准，并已在主网上成功执行。此升级对PoC验证进行了重大优化，并实现了实时权重归一化，以提升网络的公平性和可扩展性。

**注意**

必须重启ML节点容器以触发模型重新部署。运行：
```
docker restart join-mlnode-1
```
过渡到 `mlnode:3.0.12-post4-*` 应在升级中引入的3000区块宽限期结束前完成。

!!! note "兼容性说明"
    此次升级包括迁移到 IBC 栈 v8.7.0。请检查任何解析 `inferenced` CLI 输出的脚本。枚举和 int64/uint64 值现在以字符串形式编码。

    **当前生效的关键变更****PoC 验证采样优化**

    此升级引入了一种新的 PoC 验证机制，通过为每个参与者分配一组固定的采样验证者，将复杂度从 O(N^2) 降低至 O(N x N_SLOTS)。

    **按实时时间标准化 PoC 权重**

    此升级根据实际 PoC 持续时间标准化 PoC 参与者权重，以减少区块时间漂移影响，并确保权重结果与实际执行时长一致。

    **启用 Qwen235B 工具**

    此升级为 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 添加了工具调用参数（ `--enable-auto-tool-choice` , `--tool-call-parser hermes` ），并设置验证阈值为 0.958。
    要启用工具，必须重启 MLNode 容器内的 vLLM。

    **其他协议更新**

- 修复：PoC 和 CPoC 交集漏洞（PR #752）。
- IBC 升级：将 IBC 栈升级至 v8.7.0。
- 惩罚：阈值现在由链上数据推导得出（PR #688）。
- 锁仓：支持带有活跃锁仓的流式锁仓转账（PR #641）。
- MLNode：更可靠的 MLNode 容器版本 ghcr.io/product-science/mlnode:3.0.12-post4 / ghcr.io/product-science/mlnode:3.0.12-post4-blackwell。

**宽限期：** 升级后引入了3000个区块的宽限期，期间无确认 PoC，并对升级时期的错过率和无效率阈值放宽要求。

有关这些变更的更多详细信息，请参见治理工件：[https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10/README.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10/README.md)

## 2026年2月18日

**抵押参数更新提案现已开放投票**

更新抵押参数的提案已发布供社区投票。

建议参数：

- 每1单位算力 0.032 GNK（约每H100 10 GNK）
- 错过率或关押罚没 0.01%
- 无效推理罚没 0.5%

这意味着在单个周期内，即使被惩罚，矿工最多损失其抵押品的0.5%。所需抵押品仅占日奖励的约24%。

**警告：** 抵押参数将不受投票结果影响而生效。如果此提案未通过，创世时定义的抵押参数将在第180周期自动激活，而非上述参数。

投票结束后、第180周期前，每位矿工必须遵循[说明](https://gonka.ai/host/collateral/#slashing)将所需资金转入抵押。否则，从第180周期起，其奖励将减少5倍。

获取更新参数：
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

投票将于2026年2月19日07:27:06 UTC结束。

## 2026年2月17日

**v0.2.10 升级提案进入治理流程**

下一个链上软件版本 v0.2.10 的升级提案现已上链并开放投票。若获批准，该提案将引入一项重要的 PoC 验证优化（默认禁用），并实现基于实时的权重标准化，以提升网络公平性和可扩展性。

**关键变更****PoC 验证采样优化**

此升级引入了一种新的 PoC 验证机制，通过为每个参与者分配一组固定的采样验证者，将复杂度从 O(N^2) 降低至 O(N x N_SLOTS)。

**按实时时间标准化 PoC 权重**

此升级通过根据实际PoC耗时标准化参与者权重，以减少区块时间漂移影响，并使权重结果与真实执行时长保持一致。

**启用Qwen235B工具**

此升级为`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`添加了工具调用参数（`--enable-auto-tool-choice`、`--tool-call-parser hermes`），并设置验证阈值`0.958`。
要启用工具，必须重启MLNode容器内的vLLM。升级引入了一个为期3000个区块的宽限期，在此期间无确认PoC，并且在升级当期降低了错过率和无效率的阈值。

**其他协议更新**

- 修复PoC与CPoC交集漏洞（PR #752）
- 将IBC堆栈升级至v8.7.0。
- 惩罚阈值现在基于链上数据推导（PR #688）
- 支持带有活跃锁仓的流式锁仓转账（PR #641）
- 更可靠的MLNode容器版本`ghcr.io/product-science/mlnode:3.0.12-post4` / `ghcr.io/product-science/mlnode:3.0.12-post4-blackwell`。

有关这些及其他变更的更多详细信息，请参阅治理文档 [https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10/README.md ](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10/README.md)

**升级执行后所需的主机操作**

如果提案获得批准并执行升级，必须重启ML Node容器以触发模型重新部署。运行：
```
docker restart join-mlnode-1
```
过渡到`mlnode:3.0.12-post4-*`应在升级引入的3000个区块宽限期内完成。

**如何投票**

提案详情和投票可通过`inferenced`访问。任何活跃节点均可使用。可用节点包括：

- [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
- [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
- [https://node3.gonka.ai](https://node3.gonka.ai)

投出您的选票（`yes`、`no`、`abstain`、`no_with_veto`）：
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

要检查投票状态：
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 27 -o json --node $NODE_URL/chain-rpc/
```
**截止日期**

- 投票截止：2026年2月18日 09:26:26 UTC
- 升级高度：2712600
- 预计升级时间：2026年2月18日 15:30:00 UTC

**注意事项**

- 请检查任何解析`inferenced` CLI输出的脚本。由于IBC堆栈升级至v8.7.0，枚举和int64/uint64值现在以字符串形式编码。
- 请确保在升级窗口期间保持在线，以便及时执行后续步骤或缓解指令。
- 升级期间，Cosmovisor会在`.inference/data`目录中创建完整状态备份；请确保有足够的磁盘空间。有关如何安全删除`.inference`目录中旧备份的指导，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。
- 如果`application.db`占用大量磁盘空间，可应用[此处](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)描述的清理技术。
- 升级后，Postgres可作为本地负载存储的选项。

## 2026年2月16日

**抵押激活及建议初始参数**

距离Epoch 180不足7天，现在是准备的时候了。

根据AMA期间的讨论以及社区成员提出的论点，建议从较小的抵押要求和最低限度的惩罚开始。

将提交给社区投票的参数：

- 每1单位算力0.032 GNK（约每H100为10 GNK）
- 错过率或隔离惩罚为0.01%
- 无效推理惩罚为0.5%

这意味着，在单个周期内，即使被惩罚，矿工最多只会损失其抵押品的0.5%。所需抵押品仅占日奖励的约24%。

提案提交投票后，将另行发布公告。

警告：无论提案投票结果如何，抵押品都将生效。如果此提案未通过，创世中定义的抵押参数将在第180个纪元自动激活，而非上述列出的参数。

任何未来的抵押品增加都将通过单独的投票提出。目标是观察网络稳定性，确保不公正的惩罚罕见且仅在有正当理由时适用。如果证明稳定性良好，则逐步将抵押品增加到代币经济白皮书中描述的水平（例如，每块H100约100 GNK），将支持网络的长期成功。

## 2026年2月13日

**即将进行的v0.2.10升级投票与执行时间表**

即将进行的软件升级v0.2.10的链上投票期预计将于周日晚上（洛杉矶时间）/周一早晨（UTC）开始。
如果提案通过治理批准，升级计划于周二执行。

**大致时间线：**

- 周日晚上（洛杉矶时间）——投票期开始
- 周一（UTC早晨）——投票进行中
- 周二——升级执行（如获批准）

请在GitHub上审阅v0.2.10升级PR并提供您的反馈。有意义的审阅贡献可能在下一次升级中获得奖励。

[https://github.com/gonka-ai/gonka/pull/695](https://github.com/gonka-ai/gonka/pull/695)

## 2026年2月13日

如果您节点未能及时应用最新升级，可能在区块2628371处因共识失败而停止运行。这是因为节点运行的是不再与网络兼容的旧版本二进制文件。要恢复，请遵循本指南：[https://gonka.ai/FAQ/#recovery-guide-consensus-failure-after-missing-patch](https://gonka.ai/FAQ/#recovery-guide-consensus-failure-after-missing-patch)

## 2026年2月12日

**网络更新：补丁已发布（PoC / cPoC重叠）**

现已发布补丁以解决当前纪元（169/170）中观察到的事件。

**需要采取的操作**

请主机尽快应用补丁，以确保正确的PoC验证行为并安全恢复区块生产。
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

**网络事件：PoC / cPoC重叠（区块生产暂停）**

在当前纪元中观察到cPoC（确认PoC）与PoC之间的重叠。直到纪元最后一个区块，`is_confirmation_poc_active`被观察为`true`。

目前正评估此重叠的影响。初步观察表明，没有节点记录PoC提交，导致该纪元累积权重为零。

作为预防措施，矿工通过协调行动暂时暂停了区块生产。

问题正在定位中。

请保持在线，以便在补丁发布时能及时应用。更多详细信息和补丁说明将在准备就绪后发布。

## 2026年2月12日

**推理功能现已开放**

链上推理访问当前已开放，不再仅限开发者。推理请求可通过上一次更新中引入的允许传输代理发送。当前允许列表可在链上查询：
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
此处有新版本库可用：[https://gonka.ai/developer/quickstart/#3-inference-using-modified-openai-sdk](https://gonka.ai/developer/quickstart/#3-inference-using-modified-openai-sdk)

**注意：** 如果某个地址未包含在允许列表中，则通过该地址路由的推理请求在当前配置下将不被接受。

## 2026年2月10日

**升级 v0.2.10 的 PR 审查**

[拉取请求](https://github.com/gonka-ai/gonka/pull/695) 针对下一次链上软件升级 v0.2.10 已开放审查。欢迎提供反馈和改进建议。当前计划是将审查窗口保持约两天。

对于对此次 PR 审查有实质性贡献的，可能在下一次升级中提出奖励。

本次仅为拉取请求的审查呼吁，并非正式投票的开始。治理投票流程将在审查期结束后启动。

**关键变更****[PR #710](https://github.com/gonka-ai/gonka/pull/710) PoC 验证采样优化**

此升级引入了一种新的 PoC 验证机制，通过为每个参与者分配固定的采样验证者集合，将复杂度从 O(N^2) 降低至 O(N x N_SLOTS)。参考设计与分析：[https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/poc/optimize.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/poc/optimize.md)

**[PR #725](https://github.com/gonka-ai/gonka/pull/725) 按实际 PoC 时间标准化 PoC 权重**

此升级根据实际 PoC 持续时间标准化参与者权重，以减少区块时间漂移效应，并确保权重结果与实际执行时长一致。

**其他关键变更：**

- **[PR #708](https://github.com/gonka-ai/gonka/pull/708)** IBC 升级至 v8.7.0
- **[PR #723](https://github.com/gonka-ai/gonka/pull/723)** Testnet 桥接设置脚本
- **[PR #666](https://github.com/gonka-ai/gonka/pull/666)** 工件存储吞吐量优化
- **[PR #688](https://github.com/gonka-ai/gonka/pull/688)** 从链上数据获取惩罚统计
- **[PR #697](https://github.com/gonka-ai/gonka/pull/697)** 适用于 macOS 测试构建的可移植 BLST 构建
- **[PR #712](https://github.com/gonka-ai/gonka/pull/712)** 要求 proto-go 生成代码与提交代码一致
- **[PR #711](https://github.com/gonka-ai/gonka/pull/711)** 从链状态获取 PoC 测试参数
- **[PR #641](https://github.com/gonka-ai/gonka/pull/641)** 带锁仓的流式支付转账
- **[PR #659](https://github.com/gonka-ai/gonka/pull/659)** 模型分配检查上一轮奖励
- **[PR #716](https://github.com/gonka-ai/gonka/pull/716)** 重命名 PoC 权重函数以提高清晰度和正确性。

**API 强化与可靠性修复：**

- **[PR #634](https://github.com/gonka-ai/gonka/pull/634)**：添加请求主体大小限制以降低 DoS 风险。
- **[PR #727](https://github.com/gonka-ai/gonka/pull/727)**：对 #634 的后续改进，将响应写入器传递给 `http.MaxBytesReader` 并对齐测试。
- **[PR #638](https://github.com/gonka-ai/gonka/pull/638)**：修复请求处理中的不安全类型断言。
- **[PR #644](https://github.com/gonka-ai/gonka/pull/644)**：避免每次启动时重写静态配置。
- **[PR #661](https://github.com/gonka-ai/gonka/pull/661)**：防止网络短暂中断时 API 崩溃。
- **[PR #640](https://github.com/gonka-ai/gonka/pull/640)**：为节点版本端点行为添加单元测试。
- **[PR #622](https://github.com/gonka-ai/gonka/pull/622)**：在 `InvalidateInference` 中传播退款错误。
- **[PR #639](https://github.com/gonka-ai/gonka/pull/639)**：在任务申领路径中添加缺失的返回语句。
- **[PR #643](https://github.com/gonka-ai/gonka/pull/643)**：清理执行器选择中的 nil 参与者。
- **[PR #545](https://github.com/gonka-ai/gonka/pull/545)**：API 流程中的小错误修复。

**升级计划**

二进制版本预计通过链上升级提案进行更新。有关升级流程的更多信息，请参阅 [https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/docs/upgrades.md.](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/docs/upgrades.md.)

现有主机无需升级其 `api` 和 `node` 容器。更新的容器版本专为在链上升级完成后加入的新主机设计。

**建议流程**

1. 活跃主机请在 GitHub 上审查本提案并留下反馈。
2. 在社区审查该PR后，预计将从此分支创建v0.2.10版本，并可提交此版本的链上升级提案，以启动正式的治理投票流程。
3. 如果链上提案通过，预计在链上升级执行后合并此PR。

从[upgrade-v0.2.10](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.10)分支创建发布版本（而非`main`）可最小化`main`分支上`/deploy/join/`目录中容器版本与链上二进制版本不匹配的时间，从而为新主机提供更顺畅的接入体验。

**测试与迁移**

v0.2.10的测试指南和迁移详情已记录在[此处](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10)。请仔细审阅。

**兼容性说明**

如果您有任何解析`inferenced` CLI JSON输出的脚本，请在此升级后重新检查。由于ibc-go升级至v8.7.0，枚举现在以字符串而非数字编码，int64/uint64值现在也以字符串编码。

## 2026年2月4日

**CLI更新提醒**

为授予v0.2.9升级后创建的热密钥权限，应使用[CLI版本v0.2.9](https://github.com/gonka-ai/gonka/releases/tag/release%2Fv0.2.9)。

## 2026年2月3日

**PoC v2 基于推理的权重调整**

在PoC v2激活后，权重分配现在基于当前模型`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`的实测推理性能。因此，中位GPU权重以及不同GPU类型之间的相对权重比例均已调整。

**观察到的GPU权重变化（第158轮 → 第159轮）**

| GPU类型 | 第158轮 | 第159轮 | 变化 |
|------------------|-----------|-----------|--------|
| A100-PCIE-40GB | 129.05 | 17.31 | -86.6% |
| A100-SXM4-80GB | 204.12 | 127.75 | -37.4% |
| B200 | 739.81 | 300.75 | -59.3% |
| H100 80GB HBM3 | 424.73 | 292.88 | -31.0% |
| H100 PCIe | 307.03 | 144.53 | -52.9% |
| H200 | 512.38 | 303.88 | -40.7% |

**上下文**

- 观察到的变化表明，GPU权重差异现在反映的是模型特定的推理吞吐量，而非名义上的硬件规格。例如，H100 PCIe权重的下降幅度大于H100 HBM3权重，这与`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`的观测推理行为一致。
- 在当前模型配置下，基于观测到的推理轨迹，B200 GPU的推理性能并未高于H100类GPU。
- 如果未来通过治理引入更大或更复杂的模型（例如DeepSeek V3.2），可能会观察到不同的性能特征。
- 在PoC之外使用标准vLLM推理对同一模型`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`进行的控制推理基准测试，显示了与PoC v2中观察到的相同GPU类型间的相对性能差异。

**追踪器（仪表板）维护者操作**

在更新后的权重分配生效后，追踪器（仪表板）维护者可能希望审查第159轮及之后的系数，以确保与当前PoC v2的权重分配保持一致。

## 2026年2月2日

**网络更新——补丁可用**

现已提供补丁以解决导致PoC周期中区块验证暂停的问题。建议主机尽快应用补丁，以确保正确的PoC验证行为并安全恢复区块生产。

**需要采取的操作**

请主机尽快应用补丁，以确保正确的PoC验证行为并安全恢复区块生产。
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
进一步的说明，包括恢复区块验证所需的任何协调步骤，将另行提供。

## 2026年2月2日

**为预防措施，区块验证已暂停**

由于在当前的PoC周期中，验证阈值可能无法满足的高风险，主机们集体采取行动暂停了区块验证。
根据当前评估，旨在处理此情况的机制可能无法按预期运行。为防止在不确定或不安全的条件下完成验证器最终确认，网络在验证器选择之前已停止。

**下一步行动**

以下操作目前正在执行中：

- 确认没有任何验证器集能够达到所需的验证阈值
- 确认验证器最终确认前的网络状态
- 准备修复已识别问题的补丁

**需要采取的行动**

所有主机必须随时准备安装补丁。
请保持在线并密切关注公告。一旦补丁准备好，将立即发布进一步说明。

## 2026年2月1日

**升级已执行：v0.2.9 现已在主网上线**

升级提案 v0.2.9 的链上治理投票已结束。该提案已获批准，并已在区块 2451000 成功在主网上执行升级。此次升级实现了 PoC v2 权重分配机制，并完成了向传统 PoC 机制的过渡。

**注意**

- 下一个 PoC 周期（从第 158 个纪元过渡到第 159 个纪元）至关重要。请确保在线，以便在需要时及时执行任何后续步骤或缓解指令。
- 仅运行 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 的 ML 节点有资格进入下一个（159）纪元并参与 PoC v2 权重分配。运行其他模型的 ML 节点将不包含在下一纪元的参与集合中。

**主机准备**

建议主机确认所有 ML 节点：

- 仅配置为提供支持的模型 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 镜像已更新为与 PoC v2 兼容的版本

有关将 ML 节点切换至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、升级 ML 节点镜像以及移除其他模型的指导，请参阅 [常见问题解答](https://gonka.ai/FAQ/#how-to-switch-to-qwenqwen3-235b-a22b-instruct-2507-fp8-upgrade-ml-nodes-and-remove-other-models)。

**当前生效的关键变更****PoC v2 激活**

- PoC v2 作为权重分配的活跃机制
- 确认 PoC（V2 跟踪）作为结果的权威来源
- 传统 PoC 逻辑不再用于权重计算

**模型配置**

- 网络运行在单模型配置下
- 用于 PoC v2 和权重分配的模型为 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 提供其他模型的 ML 节点不包含在 PoC v2 权重分配中。在支持的情况下，可能会自动切换至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`

**资格标准**

ML 节点要符合 PoC v2 权重分配资格，必须同时满足以下两个条件：

- 节点提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 节点运行与 PoC v2 兼容的镜像：
    - ghcr.io/product-science/mlnode:3.0.12-post1
    - ghcr.io/product-science/mlnode:3.0.12-post1-blackwell

**cPoC 情况下的奖励流程修正**

在因 cPoC 惩罚而减少或排除奖励的情况下，未计入部分将转移至社区池。此前，此类奖励会在其他参与者之间重新分配。

**其他协议更新**

- 传输代理角色在初始阶段仅限于[定义](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#transfer-agent-whitelist) `allowlist`
- 在参与PoC生成但忽略PoC验证的节点已被从[参与者](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#suspicious-participant-removal) `allowlist` 中移除
- [守护者权重](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#guardian-tiebreaker-for-poc-v2-voting) 在PoC v2验证投票阈值未达到时作为确定性后备机制应用

有关这些变更的更多详细信息请参见治理工件：[https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9 ](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9 )

## 2026年2月1日

v0.2.9升级提案的链上治理流程即将结束。

- 投票截止：2026年2月1日，UTC时间22:02:58
- 升级高度：2451000。
- 预计升级时间：2026年2月2日，UTC时间05:10:00

鼓励主机查看[GitHub](https://github.com/gonka-ai/gonka/pull/668)上的提案并参与投票。

提前预下载二进制文件有助于在升级窗口期内避免依赖GitHub的可用性。
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

**v0.2.9升级提案进入治理阶段**

下一个链上软件版本v0.2.9的升级提案现已上链并开放投票。若获批准，该提案将启用PoC v2用于权重分配，并通过链上治理完成对传统PoC机制的过渡。

**关键变更****PoC v2激活**

- PoC v2用作权重分配的活跃机制
- 确认PoC（V2跟踪）作为结果的权威来源
- 传统PoC逻辑不再用于权重计算

**模型配置**

- 网络采用单一模型配置
- 用于PoC v2和权重分配的模型是 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 运行其他模型的ML节点不包含在PoC v2权重分配中。在支持的情况下，可能会自动切换到 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`

**资格标准**

ML节点要符合PoC v2权重分配资格，必须满足以下两个条件：

- 节点仅提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 节点运行PoC v2兼容镜像：
    - ghcr.io/product-science/mlnode:3.0.12-post1
    - ghcr.io/product-science/mlnode:3.0.12-post1-blackwell

**cPoC情形的奖励流程修正**

在因cPoC惩罚而减少或排除奖励的情况下，未计入部分将转入社区池。此前，此类奖励会重新分配给其他参与者。

**其他协议更新**

- 传输代理角色在初始阶段仅限于[定义](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#transfer-agent-whitelist) `allowlist`
- 在参与PoC生成但忽略PoC验证的节点已被从[参与者](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#suspicious-participant-removal) `allowlist` 中移除
- [守护者权重](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#guardian-tiebreaker-for-poc-v2-voting) 在PoC v2验证投票阈值未达到时作为确定性后备机制应用

有关这些变更的更多详细信息请参见治理工件：[https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9)

**主机准备**

鼓励主机确认所有ML节点：

- 仅配置为提供支持的模型 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 镜像已更新为PoC v2兼容版本

有关切换ML节点至`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、升级ML节点镜像以及移除其他模型的指南，请参阅[常见问题解答](https://gonka.ai/FAQ/#how-to-switch-to-qwenqwen3-235b-a22b-instruct-2507-fp8-upgrade-ml-nodes-and-remove-other-models)。

**如何投票**

提案详情及投票可通过`inferenced`进行。任何活跃节点均可使用，可用节点包括：

- [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
- [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
- [http://node3.gonka.ai:8000](http://node3.gonka.ai:8000)
- [https://node4.gonka.ai](https://node4.gonka.ai)

投出您的选票（`yes`、`no`、`abstain`、`no_with_veto`）：
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
要查看投票状态：
```
export NODE_URL=https://node4.gonka.ai/
./inferenced query gov votes 26 -o json --node $NODE_URL/chain-rpc/
```
**截止日期**

- 投票结束：2026年2月1日 22:02:58 UTC
- 升级高度：2451000。
- 预计升级时间：2026年2月2日 05:10:00 UTC

鼓励主机查看 [GitHub](https://github.com/gonka-ai/gonka/pull/668) 上的提案并参与投票。

**注意**

- 请在升级窗口期间保持在线，以便在需要时及时执行任何后续步骤或缓解指令。
- 升级期间，Cosmovisor 会在 `.inference/data` 目录中创建完整的状态备份。请确保升级前有足够的磁盘空间。有关如何安全删除 `.inference` 目录中的旧备份的指南，请参阅 [文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。
- 如果 `application.db` 占用了大量磁盘空间，可以应用 [此处](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it) 描述的清理技术。
- 升级后，Postgres 可作为本地负载存储的选项。

## 2026年1月29日

**PoC 验证参与通知**

在最新轮次中，大量 ML 节点未获得 PoC 权重。
分析表明，这是由于 PoC 验证参与不足所致。在多个案例中，参与者发布了 nonce，但未执行验证，或验证级别远低于协议要求。
下表列出了上一轮次拥有权重、在当前轮次提交了 PoC nonce，但未参与或未充分参与 PoC 验证阶段的参与者：[https://docs.google.com/spreadsheets/d/17agQXP77lATT2bNK12OEOzek5wNSptN2ktiSag3QXB0/](https://docs.google.com/spreadsheets/d/17agQXP77lATT2bNK12OEOzek5wNSptN2ktiSag3QXB0/)

他们的总权重约为 36%。加上完全未参与 PoC 的参与者，PoC 验证参与不足或无参与的总权重达到约 48%，这一比例过高。
如果您的节点在表中 `validated` 列显示为 0，请检查您的 PoC 验证日志和配置，确保验证正常运行。

此笔记本展示了构建上述表格所用的流程：[https://github.com/gonka-ai/gonka/blob/gm/debug-155-1/debug-validation.ipynb](https://github.com/gonka-ai/gonka/blob/gm/debug-155-1/debug-validation.ipynb)。

## 2026年1月29日

**升级已执行：v0.2.8 已上线主网**

升级提案 v0.2.8 的链上治理投票已结束。该提案已获批准，并在主网上成功执行。
此次升级实现了 PoC v2 架构，简化了模型支持，并应用了关键的安全性和可靠性修复。

**当前生效的关键变更****PoC v2 核心集成**

- vLLM 集成：PoC 直接集成到 vLLM 中，无需卸载模型即可立即从推理切换到 PoC。
- MMR 承诺：工件存储通过 Merkle Mountain Range 承诺移至链下；仅 `root_hash` 和 `count` 记录在链上。
- 双模式迁移：支持 V1（常规 PoC）和 V2（确认 PoC）跟踪。

**模型可用性更新**

支持的模型集现已受限。除以下模型外，所有此前支持的模型均已从活跃集合中移除：

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `Qwen/Qwen3-32B-FP8`

**安全与可靠性改进**

- SSRF & DoS：验证 `InferenceUrl` 以拒绝内部 IP，并添加超时以防止请求挂起。
- 投票翻转：拒绝重复的 PoC 验证以防止覆盖。
- 身份验证绕过：将 `epochId` 绑定到签名，以验证是否属于正确的轮次。

**PoC v2 参与资格的主机要求**

参与 PoC v2 资格要求主机完成以下事项：

- 模型配置：将 ML 节点配置为提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- ML 节点升级：使用支持 PoC v2 的版本：
    - ghcr.io/product-science/mlnode:3.0.12
    - ghcr.io/product-science/mlnode:3.0.12-blackwell

!!! note 
    未能同时满足上述两项条件的节点，在网络过渡到单模型配置后将失去 PoC v2 参与资格。PoC v2 的权重分配过渡仍受观察性采用阈值和后续治理的约束。

    **维护与运维**

- Cosmovisor：节点和API二进制文件的更新将自动处理。现有主机无需对运行中的容器执行手动更新。
- 磁盘空间：Cosmovisor会在`.inference/data`目录中创建完整的状态备份。请确保有250 GB以上的可用空间。
- Postgres：升级后现在可以通过Postgres配置本地负载存储。

建议在升级后窗口期间监控节点状态和Discord通信，以确保稳定性。

## 2026年1月28日

**如何切换到`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、升级ML节点并移除其他模型？**

本指南说明了主机应如何根据v0.2.8模型可用性变更和即将推出的PoC v2更新来更新其ML节点。ML节点配置在第155个Epoch起需符合PoC v2要求。建议主机在此前审查并准备其ML节点配置。迁移至PoC v2可在第155个Epoch后安排。迁移阶段结束后，未满足配置要求的ML节点的权重将不被计入。

**1. 背景：模型可用性变更（升级v0.2.8）**

作为v0.2.8升级的一部分，活跃模型集已更新。

**支持的模型（活跃集）**

仅以下模型仍受支持：

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `Qwen/Qwen3-32B-FP8`

`Qwen/Qwen3-32B-FP8`在迁移期间受支持，但不参与PoC v2就绪或权重分配。参与PoC v2要求提供`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。

**已移除的模型**

所有先前支持的模型均已从活跃集中移除，不得再提供服务。

**3. PoC v2就绪标准（重要）**

成功参与PoC v2迁移需满足以下两项条件：

- 您的所有ML节点均提供Qwen/Qwen3-235B-A22B-Instruct-2507-FP8。这是唯一贡献PoC v2权重的模型。
- 您的所有ML节点均已升级至PoC v2兼容镜像：
    - ghcr.io/product-science/mlnode:3.0.12
    - ghcr.io/product-science/mlnode:3.0.12-blackwell

!!! note "重要"

    - 仅提供正确模型而不升级ML节点是不够的。
    - 未同时满足两项条件的节点在网络切换为单模型配置后将不再符合资格。
    - ML节点升级必须在迁移完成且PoC v2通过v0.2.8升级后单独的治理提案激活之前完成。
    - v0.2.8升级本身不会启用PoC v2。

**3. 检查ML节点分配状态（推荐的安全步骤）**

在更改模型前，您应检查当前的ML节点分配情况。查询您的网络节点管理API：
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

- 第一个布尔值：节点是否在当前Epoch中提供推理服务
- 第二个布尔值：节点是否计划在下一个PoC中提供推理服务

**推荐行为**

- 优先仅在第二个值为`false`的节点上更改模型
- 这有助于在PoC v2行为仍在观察期间降低风险
- 鼓励跨Epoch逐步 rollout

**4. 更新ML节点的模型：仅保留支持的模型**

建议预下载模型权重。为避免启动延迟，请将权重预下载至`HF_HOME`：
```
mkdir -p $HF_HOME
huggingface-cli download Qwen/Qwen3-235B-A22B-Instruct-2507-FP8
```
使用ML节点管理API将ML节点切换至支持的模型（`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`）。

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
通过管理 API 应用的更改将替换下一个周期的模型 [https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)

!!! note 

    `node-config.json` 仅在首次启动网络节点 API 或本地状态/数据库被删除时使用。若要重新启动，请编辑它。对于现有节点，模型更新应通过管理 API 进行。

    **5. 升级 ML 节点镜像（PoC v2 所需）**

    编辑 `docker-compose.mlnode.yml` 并更新 ML 节点镜像：

    标准 GPU
```
image: ghcr.io/product-science/mlnode:3.0.12
```
NVIDIA Blackwell GPU
```
image: ghcr.io/product-science/mlnode:3.0.12-blackwell
```
应用更改并重启服务。从 `gonka/deploy/join`：
```
source config.env
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml pull
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d
```

**6. 验证模型服务（将在下一个周期生效）**

确认 ML 节点仅提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 服务，这是 PoC v2 权重和未来权重分配使用的唯一模型：
```
curl http://127.0.0.1:8080/v1/models | jq
```
可选：重新检查节点分配：
```
curl http://127.0.0.1:9200/admin/v1/nodes
```

!!! note "治理和 PoC v2 激活说明"
    PoC v2 分阶段引入，不会一次性激活。

    **第一阶段：观察（v0.2.8 之后的当前状态）**

    在 v0.2.8 升级后，PoC v2 逻辑可用，但尚未用于权重分配。

    在此阶段：

    - 主机可以提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 或 `Qwen/Qwen3-32B-FP8`
    - 主机必须将其 ML 节点切换为提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`，并升级为与 PoC v2 兼容的版本，才能参与 PoC v2 权重贡献。
    - 网络将观察采用情况，以评估主机为转向 PoC v2 权重做好准备的程度。

**第二阶段：治理提案（可选，未来）**

一旦观察到足够比例的活跃主机采用（约 50%）：

    - 可提交单独的治理提案
    - 该提案可请求批准激活 PoC v2 并使用 PoC v2 进行权重分配

采用阈值仅为观察性，不会触发任何自动更改。

**第三阶段：激活（仅在治理批准后）**

PoC v2 仅在链上治理提案获得批准后才成为权重分配的激活方法。
    在此提案获得批准前：

    - PoC v2 对权重分配保持非激活状态
    - 现有的 PoC 机制将继续用于确定权重

**总结清单**

在 PoC v2 激活前，请确保：

- ML 节点提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 从配置中移除所有其他模型
- ML 节点镜像为 3.0.12（或 3.0.12-blackwell）

## 2026 年 1 月 28 日

针对 v0.2.8 升级提案的链上治理流程即将结束。

**升级详情**

- 升级高度：区块 2387000
- 预计时间：2026 年 1 月 29 日 06:30:00 UTC

提前下载二进制文件有助于避免在升级窗口期间依赖 GitHub 的可用性。

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

下一代链上软件版本 v0.2.8 的升级提案现已上链并开放投票！
您的审阅与投票对确保网络的稳定性与未来能力至关重要。

**v0.2.8 的关键变更****PoC v2（核心升级）**

- 将 PoC 直接集成至 vLLM，无需卸载模型或加载独立的 PoC 模型，即可立即从推理切换至 PoC。
- 使用 MMR（Merkle 山脉范围）承诺将工件存储移至链下——仅在链上记录 root_hash 和 count。
- 包含双模式迁移策略：V1 用于常规 PoC，V2 用于 rollout 期间的 Confirmation PoC 跟踪。

**模型可用性变更**

作为 v0.2.8 升级的一部分，支持的模型集合已更新。所有先前支持的模型均从活跃集合中移除，但以下模型除外：

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `Qwen/Qwen3-32B-FP8`

通过成功参与使用 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 的 PoC v2 并配合所需的 ML Node 版本，可评估向 PoC v2 过渡的准备情况。一旦在活跃 Host 中观察到足够的采用率（约 50%），可提交独立的治理提案以批准并激活 PoC v2 用于分配权重。该阈值为观察性指标，不会触发任何自动网络变更。

在下一次网络步骤通过治理批准后，网络将暂时仅支持 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。

**安全、正确性与可靠性改进**

- SSRF & DoS：验证 InferenceUrl 以拒绝内部 IP，并添加超时以防止请求挂起。
- 投票翻转：通过拒绝重复项防止覆盖 PoC 验证结果。
- PoC 排除：修复 getInferenceServingNodeIds 以正确排除推理服务节点。
- 身份验证绕过与重放：将 epochId 绑定至签名，并验证授权是否针对正确的 epoch。

由于变更量较大，此处仅列出部分重点内容。更多更新与修复的完整列表请参见 [GitHub 拉取请求](https://github.com/gonka-ai/gonka/pull/539)。

**Host 需采取的操作**

为参与 PoC v2 过渡，Host 必须完成以下两项操作：

- 确认您的 ML Node 已配置为提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 服务
- 将 ML Node 升级至支持 PoC v2 的版本：
    - ghcr.io/product-science/mlnode:3.0.12
    - ghcr.io/product-science/mlnode:3.0.12-blackwell

仅提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 而未升级 ML Node 不足以参与 PoC v2。在网络切换至单模型配置后，未满足两项条件的节点将不被视为 PoC v2 参与资格的合格节点。ML Node 升级必须在 PoC v2 通过治理完全启用前完成。

**如何投票**

您可使用 `inferenced` 命令获取提案详情并进行投票。请注意，任何活跃节点均可用于查询或投票。当前可用节点包括：

- [http://node1.gonka.ai:8000/](http://node1.gonka.ai:8000/)
- [http://node2.gonka.ai:8000/](http://node2.gonka.ai:8000/)
- [http://node3.gonka.ai:8000/](http://node3.gonka.ai:8000/)
- [https://node4.gonka.ai/](https://node4.gonka.ai/)

要检查投票状态：
```
export NODE_URL=https://node4.gonka.ai/
./inferenced query gov votes 25 -o json --node $NODE_URL/chain-rpc/
```

要投票（ `yes` , `no` , `abstain` , `no_with_veto` ）：
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

- 投票将于 2026 年 1 月 29 日 03:02:20（UTC）结束。
- 升级提案在区块 2387000 提出。该区块的预计时间为 2026 年 1 月 29 日 06:30:00（UTC）。

请查看并投票，如果您是 Host。

**注意 1：** 请确保在升级窗口期间保持在线，以便在需要时及时执行后续步骤或缓解指令。

**注意 2：** 在升级过程中，Cosmovisor 会在 `.inference/data directory` 中创建完整的状态备份。请确保有足够的磁盘空间。有关如何安全删除 `.inference` 目录中的旧备份的说明，请参见 [此处](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。如果 `application.db` 占用了大量磁盘空间，可使用 [此处](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it) 描述的清理技术。

**注意：** 升级后，Postgres 可配置为本地有效载荷的存储。

## 2026 年 1 月 19 日

**提案更新：批准延长稳定期**

关于延长稳定期的最近治理投票已成功通过。稳定期现已正式延长，以允许进行额外的测试和网络升级。

**主机操作项**

在延长确认后，请利用这段时间为新的 PoC 要求做好准备。

- 模型更新：请将您的 ML 节点切换至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 模型。
- 逐步部署：如果您运行多个 ML 节点，建议在多个纪元中逐步进行这些更新。

**如何更新**

更新现有 ML 节点的说明请参见：[https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)

## 2026 年 1 月 16 日

**稳定期延长**

一项新的治理投票当前正在生效。

该提案将当前的稳定期延长约两周，以便为即将进行的 PoC 变更及相关网络升级提供额外的测试时间。有关新 PoC 开发进展的更多详情，请参见：[https://github.com/gonka-ai/gonka/blob/gm/poc-status/proposals/governance-artifacts/poc-update-status.md](https://github.com/gonka-ai/gonka/blob/gm/poc-status/proposals/governance-artifacts/poc-update-status.md)。

该延长也为主机提供了时间，以准备其设置以满足新的 PoC 要求，包括将 ML 节点切换至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 模型。更新现有 ML 节点的说明请参见：[https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)。建议运行多个 ML 节点的主机在多个纪元中逐步进行更新。

**投票范围**

如果获得批准，网络将暂时继续在现有的 `allowlist`（包含未表现出非标准硬件行为的主机）下运行。

开发者 `allowlist` 将以相同的偏移量延长，并持续生效至区块 2459375。

未包含在 `allowlist` 中的主机在延长的稳定期内仍将无法参与 PoC，该期限将在区块 2443558 结束。

**可复现性与方法论**

`allowlist` 为：

- 可在以下地址获取：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)
- 通过公开可观察的链上数据，使用预定义的硬件配置模式推导得出。这些模式使用此处提供的开源脚本进行评估：[https://github.com/product-science/filter](https://github.com/product-science/filter)

**执行特征**

- 如果提案获得批准，`allowlist` 将自动延长。
- 无需软件升级。
- 如有必要，进一步调整仍需通过治理决定。

**稳定期结束后**

`allowlist` 具有固定的过期时间，不会延续至延长的稳定期之后。一旦 `allowlist` 在区块 2443558 过期：

- 网络将恢复至稳定期之前生效的标准参与规则，或
- 任何替代配置必须通过单独的治理决策定义。

**如何投票**

您可以使用 `inferenced` 命令获取提案详情并进行投票。

请注意，任何活跃节点均可用于查询或投票。当前可用的节点包括：

- http://node1.gonka.ai:8000/
- http://node2.gonka.ai:8000/
- http://node3.gonka.ai:8000/
- https://node4.gonka.ai/

要检查投票状态：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 22 -o json --node $NODE_URL/chain-rpc/
```

投票（`yes`、`no`、`abstain`、`no_with_veto`）：
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

此流程完全通过治理处理，无需软件升级。

**时间表和截止日期**

投票截止：2026年1月18日 05:28:01（UTC）。

`Allowlist`过期：自动在区块 2443558 时过期。

## 2026年1月10日

**临时参与者 `allowlist` 修正**

当前有一个新的治理投票正在进行。该投票通过将若干地址添加到[白名单](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)来修正一个过滤边缘情况，这些地址此前因硬件名称为空但ML节点权重为零而被过滤掉。该提案还向允许的开发者列表中添加了少量开发者账户，并将 `allowlist` 的过期时间与区块 2,222,222 的参与者注册截止时间对齐。
所有参与逻辑保持不变。此提案仅修复现有过滤逻辑中的一个小问题。

**可复现性与方法论**

`allowlist` 通过公开可观察的链上数据，使用预定义的硬件配置模式推导得出。这些模式使用此处提供的开源脚本进行评估：[https://github.com/product-science/filter](https://github.com/product-science/filter)

`allowlist` 可在此处获取：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)

**如何投票**

您可以使用 `inferenced` 命令获取提案详情并投出您的选票。

请注意，任何活跃节点均可用于查询或投票。当前可用的节点包括：

- http://node1.gonka.ai:8000/
- http://node3.gonka.ai:8000/
- https://node4.gonka.ai/

检查投票状态：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 21 -o json --node $NODE_URL/chain-rpc/
```

投票（`yes`、`no`、`abstain`、`no_with_veto`）：
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

**时间表和截止日期**

投票结束：2026年1月12日，06:04:14 UTC。

`Allowlist`过期：自动在区块2,222,222处。

## 2026年1月10日

**已批准临时参与者 `allowlist`。将在第135个纪元激活**

关于稳定期内临时参与者 `allowlist` 的链上治理投票已结束。

该提案已获批准。此提案定义了一个临时 `allowlist`，反映在最近多个纪元中行为保持一致的参与者。

**当前生效的关键变更**

1) 网络将运行一个由以下参与者组成的 `allowlist`：

- 报告的硬件特征与常见观察到的配置模式匹配（过滤的非标准配置字符串列表见此处：[https://github.com/product-science/filter/blob/main/filter_strings.txt](https://github.com/product-science/filter/blob/main/filter_strings.txt))
- 证明的PoC权重不超过同类硬件观察到的权重的150%

2) 此前表现出与这些模式持续偏差的参与者将被排除在 `allowlist` 之外，直到区块2,222,222的稳定窗口结束。

**执行特征**

- `allowlist` 将从下一个纪元（第135纪元）开始生效
- 激活发生在第135纪元的首次PoC期间
- 无需软件升级
- 从那时起，`allowlist` 将持续有效，直至并包括区块2,222,222

**可复现性与方法论**

- `allowlist` 完全基于公开可观察的链上数据推导
- 硬件描述符使用开源脚本与预定义的配置模式集进行评估：[https://github.com/product-science/filter](https://github.com/product-science/filter)
- 生成的 `allowlist` 发布于此：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)

**下一步**

主机无需采取任何操作。

## 2026年1月8日

**现在时间：稳定期内的临时参与者 `Allowlist`**

在成功采用解决PoC相关共识故障的补丁后，一项新的治理投票当前正在进行中。

随着区块生产恢复正常，网络即将进入一个短暂的稳定期，为后续增长做准备。

此投票定义了稳定窗口期间的参与者 `allowlist`（[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)），反映那些行为始终符合网络预期的参与者集合。

**投票范围**

若获批准，网络将暂时运行一个 `allowlist`，包含在先前纪元中未表现出非标准硬件行为的参与者。实际上，`allowlist` 对应于在多个纪元中满足以下条件的参与者：

- 报告的硬件特征已使用预定义的常见硬件配置模式集进行评估，以识别偏差和不一致（非标准配置字符串的确切列表见此处：[https://github.com/product-science/filter/blob/main/filter_strings.txt](https://github.com/product-science/filter/blob/main/filter_strings.txt)），且
- 观察到的PoC权重低于使用同类硬件的其他参与者所展示权重的150%。
此前表现出这些模式持续偏差的参与者，在区块2222222稳定窗口结束前，不包含在 `allowlist` 中。

**可复现性与方法论**

`allowlist` 使用预定义的硬件配置模式从公开可观察的链上数据中推导得出。这些模式通过此处提供的开源脚本进行评估：[https://github.com/product-science/filter](https://github.com/product-science/filter)

`allowlist` 可在此处获取：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)

**执行特征**

- 如果提案获得批准，`allowlist` 将自动生效。
- 无需软件升级。
- 在成功投票后的下一个PoC中，`allowlist`将激活，预计在区块：2089140。
- 从该点起，`allowlist`将持续生效，直至并包括区块2222222。
- 如有进一步调整，仍需通过治理决定。

**稳定窗口之后**

`allowlist`具有固定的过期时间，不会延续至稳定窗口之后。一旦`allowlist`在区块2222222过期：

- 网络将恢复至稳定期之前生效的标准参与规则，或
- 任何替代配置必须通过单独的治理决策定义。

**如何投票**

您可以通过`inferenced`命令获取提案详情并投票。
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

此过程完全通过治理处理，无需软件升级。

**时间表与截止日期**

- 投票截止：2026年1月10日，UTC时间06:46:52。
- `Allowlist`激活：在下一个PoC执行于区块2089140后。
- `Allowlist`过期：自动于区块2222222。

请查看并如果您是主机，请投票。

## 2026年1月8日

**网络更新——共识已恢复**

在部署补丁后，网络共识已稳定，目前运行在正常参数范围内。

## 2026年1月8日

**网络更新——补丁已就绪待部署**

解决PoC期间观察到的共识故障的补丁现已可用。

[指南](https://gonka.ai/FAQ/#upgrade-v027)

为恢复可靠的共识进展，**至少67%**的网络活跃算力需安装该补丁。

在达到此阈值之前，共识进展可能仍不稳定。

**建议主机尽快应用补丁并在升级后保持在线。
如有必要，将另行发布进一步说明。**

## 2026年1月8日

**网络更新——后续通知**

解决近期共识问题的补丁已准备就绪，详细说明将很快发布。
每位活跃主机的参与对网络推进和恢复正常运行至关重要。请保持在线，并在说明发布后立即准备应用更新。

## 2026年1月8日

**网络更新——PoC期间共识失败**

在Proof-of-Compute（PoC）期间，网络上观察到共识失败。
问题已识别，正在准备补丁以解决根本原因。后续说明和技术细节将很快发布。
建议主机保持在线并关注更新，补丁发布后可能需要采取后续操作。

## 2026年1月8日

**v0.2.7升级提案：主网上线的创世验证者增强功能**

链上治理投票已结束，关于v0.2.7升级提案：创世验证者增强已获得批准，并已在主网上成功部署。

**当前生效的关键变更：****创世验证者增强（临时）**

- 临时重新激活创世验证者增强——这是一种此前曾使用过的、限时的防御机制，现提议重新激活。
- 在网络增长期间保护共识。在其先前运行期间：
    - 三位守护者验证者共同持有约34%的共识投票权
    - 未向守护者验证者授予任何额外奖励
    - 此配置有助于防止边缘情况下的共识停滞
- 当以下两个条件均满足时，创世验证者增强将自动停用：
    - 网络总算力达到15.000.000。
    - 区块达到3.000.000。

**协议稳定性修复（全网）**

此升级正式固化了此前通过手动API更新分发且已在网络中使用的关键修复。这些修复包括：

- 纠正失败推理请求的错误计数（包括以不支持格式处理但未标记为完成的请求）
- 提升对失败推理处理的鲁棒性
- 为`PoCBatch`和`PoCValidation`交易引入批处理。

通过将其纳入此处，该行为将成为全网一致应用的协议级规则。

**临时参与与执行限制**

- 主机级别注册：新主机的注册将在区块2.222.222之前暂停（约两周后）。此措施旨在稳定网络并为其进一步增长做准备。
- 开发者地址注册：在稳定期内，新开发者地址的注册将暂停。预定义的`allowlist`开发者地址列表立即生效。列入白名单的开发者地址在此期间可执行推理任务。所有适用于开发者地址的限制，包括开发者级别注册和推理执行，将持续有效至区块2.294.222（约19天）。

**治理控制机制**

本升级中包含的预备性变更，为未来通过治理机制控制参与者准入和推理执行提供了支持，无需额外软件升级。本提案未启用任何此类治理激活的限制，需经额外治理投票方可生效。

**第117轮奖励分配**

本提案涵盖与链暂停（第117轮）相关的两项奖励分配：

- 在第117轮期间活跃但未收到该轮奖励的节点，将补发该轮的遗漏奖励。
- 所有在第117轮期间活跃的节点，将额外获得相当于第117轮奖励1.083倍的 payouts，均匀适用于所有符合条件的节点，包括已收到原始奖励的节点。

**关于持续时间和执行的说明**

本升级重新激活或引入的所有保护措施均为临时性，无需人工治理干预即可移除。

**下一步：**

- 主机无需执行任何进一步操作。
- Cosmovisor在每次更新时都会在`.inference`状态文件夹中创建完整备份。为安全执行更新，建议保留250 GB以上的可用磁盘空间。[点击查看](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory) 如何安全删除`.inference`目录中的旧备份。

**备注：**

- 创世验证者增强的完整技术细节请参见：
[https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)
- 完整技术审查（GitHub PR）：[https://github.com/gonka-ai/gonka/pull/503](https://github.com/gonka-ai/gonka/pull/503)

## 2026年1月7日

版本 **v0.2.7** 的升级提案已通过链上治理批准。

**升级详情**

- 升级高度：区块2.054.000
- 预计时间：2026年1月8日 08:10:00 UTC。

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
当所有命令均无错误完成并显示确认消息时，即可认为二进制文件已成功安装。
```
Inference Installed and Verified
--- Final Verification ---
-rwxr-xr-x 1 root root 224376384 Jan  1  2000 .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api
-rwxr-xr-x 1 root root 215172352 Jan  1  2000 .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced
.dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api: OK
.inference/cosmovisor/upgrades/v0.2.7/bin/inferenced: OK
```

**注意**

- 请在升级窗口期间保持在线，以便在出现问题时遵循说明。
- Cosmovisor 在升级期间会为 `.inference/data` 目录创建完整备份。请确保有足够的磁盘空间。如果磁盘使用率较高，可以安全删除 `.inference` 中的旧备份。[了解更多](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)
- 可以使用[这些方法](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)减少 `application.db` 的大文件。

**可选：跳过 Cosmovisor 备份**

通过为 `node` 容器设置环境变量 `UNSAFE_SKIP_BACKUP=true`，Cosmovisor 支持在升级期间跳过自动状态备份。

这可以减少磁盘使用量和升级时间。但是，如果升级失败，将无法恢复到之前的状态。

## 2026年1月7日

**主机的重要说明**

通过为 `node` 容器设置环境变量 `UNSAFE_SKIP_BACKUP=true`，可以在 Cosmovisor 升级期间选择跳过自动备份。
此选项存在风险——如果升级失败，您将无法恢复状态。

## 2026年1月6日

**v0.2.7 升级提案：创世验证者增强进入治理**

与创世验证者增强相关的链上治理提案已发布，现开放投票。

近期网络增长带来了若干挑战。过去几天，网络经历了多次问题，其中一些似乎是由故意破坏或压力测试引起的。本提案旨在通过一系列临时措施，增强网络在高负载和不利条件下的韧性。

创世验证者增强最初是在网络早期阶段作为临时防御机制引入的，并在前两个月运行。当前治理提案旨在根据当前网络状况，临时重新激活这一现有机制，并启用一些额外的保护措施。

**关键变更****创世验证者增强（临时）**

- 临时重新激活创世验证者增强——此前曾使用过的、有时间限制的防御机制，现提议重新启用。
- 在网络增长期间提供共识保护。在其先前运行期间：
    - 三个守护验证者共同持有约34%的共识投票权
    - 未向守护验证者授予额外奖励
    - 此配置有助于防止边缘情况下的共识停滞
- 当满足以下两个条件时，创世验证者增强将自动停用：
    - 网络总算力达到15,000,000。
    - 区块达到3,000,000。

**协议稳定性修复（全网）**

本次升级将此前通过手动API更新分发并已在网络中使用的重大修复正式化。这些修复包括：

- 修正失败推理请求的错误计数（包括以不支持格式处理但未标记为完成的请求）
- 改进对失败推理的处理韧性
- 为 `PoCBatch` 和 `PoCValidation` 交易引入批处理。

通过将其纳入此处，该行为将成为全网一致的协议级规则。

**临时参与和执行限制**

- 主机级注册：新主机的注册将在区块2,222,222之前暂停（约两周后）。此措施旨在稳定网络并为其进一步增长做好准备。
- 开发者地址注册：在稳定期内，将暂停新开发者地址的注册。一个预定义的 `allowlist` 开发者地址白名单立即生效。列入白名单的开发者地址在此期间可执行推理。所有适用于开发者地址的限制，包括开发者注册和推理执行，将持续至区块2,294,222（约19天）。

**治理控制机制**

本次升级包含的预备变更，使未来可通过治理机制控制参与者加入和推理执行，而无需额外软件升级。本提案不启用任何此类治理激活的限制，需另行投票决定。

**第117轮奖励分配**

本提案涵盖与链暂停（第117轮）相关的两项奖励分配：

- 在第117轮期间活跃但未收到该轮奖励的节点，将补发该轮的遗漏奖励。
- 所有在第117轮期间活跃的节点，将额外获得相当于第117轮奖励1.083倍的 payouts，均匀分配给所有符合条件的节点，包括已收到原始奖励的节点。

**关于持续时间和执行的说明**

此升级重新激活或引入的所有保护措施均为临时性，无需手动治理干预即可移除。

**如何投票**

您可以使用 `inferenced` 命令获取提案详情并投出您的选票。

要检查投票状态：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 19 -o json --node $NODE_URL/chain-rpc/
```

要投票（ `yes` , `no` , `abstain` , `no_with_veto` ）：
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

**时间表与截止日期**

- 投票截止：2026年1月8日，UTC时间04:23:14。
- 提案在区块：2.054.000 提出。
- 预计升级时间：2026年1月8日，UTC时间08:10:00。

**主机注意****注意 1**

请审阅提案并作为主机进行投票。
在升级窗口期间保持在线，以便在出现问题时遵循指示。

**注意 2**

Cosmovisor 在执行更新时会在 `.inference/data` 状态文件夹中创建完整备份，请确保您的磁盘有足够的空间。请阅读 [此处](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory) 了解如何安全地从 `.inference` 目录中删除旧备份。
如果您的 `application.db` 占用大量空间，您可以使用 [此处](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it) 提供的技术进行清理。

**参考**

Genesis 验证者增强的完整技术细节请参见：
[https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)

完整技术审查（GitHub PR）：[https://github.com/gonka-ai/gonka/pull/503](https://github.com/gonka-ai/gonka/pull/503)

## 2026年1月5日
当前网络上观察到高于平常的推理遗漏率。
在许多情况下，这是由一个漏洞引起的：不支持格式的推理请求未被标记为已完成，尽管请求本身已被处理。以下更新将解决此行为。

参考：[https://github.com/gonka-ai/gonka/pull/517](https://github.com/gonka-ai/gonka/pull/517)

此 `API` 版本改进了对失败推理的处理韧性，并减少了推理遗漏计数问题。它还为 PoCBatch 和 PoCValidation 交易引入了批处理功能。

**升级时间**

在 Confirmation PoC 未激活时应用更新是安全的。

要验证当前状态：
```
curl "http://136.243.34.19:8000/v1/epochs/latest" | jq '.is_confirmation_poc_active'
```
在 Confirmation PoC 之外，此值应返回 `false` 。

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
