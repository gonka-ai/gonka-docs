# 常见问题（FAQ）

## 什么是 Gonka？
Gonka 是一个由参与者共同运行的去中心化高效 AI 计算网络，为 AI 模型的训练与推理提供相较中心化云更具性价比与高效的替代方案。作为协议，它不是公司或创业团队。
    
## 什么是 GNK 代币？
GNK 是 Gonka 网络的原生代币，用于激励参与者、为资源定价，并保障网络的可持续增长。
    
## 协议为何高效？
我们与“传统大厂”的不同在于定价机制以及推理任务的公平分配。无论用户体量大小，推理都会被公平分配。详情参见[白皮书](https://gonka.ai/whitepaper.pdf)。
    
## 网络如何运作？
网络的运作依赖协作，取决于你扮演的角色：

- 作为[开发者](https://gonka.ai/developer/quickstart/)：你可以使用网络的算力资源来构建与部署 AI 应用。
- 作为[主机（Host）](https://gonka.ai/host/quickstart/)：你可以贡献算力来支撑网络。协议会对你的贡献进行奖励，确保网络的延续性与主权。
    
## 哪里可以了解密钥管理？
文档中有专门的[密钥管理](https://gonka.ai/host/key-management/)章节，介绍如何在网络上安全地管理应用的密钥以及最佳实践。
    
## 贡献算力的激励机制是什么？
我们准备了专门的[代币经济](https://gonka.ai/tokenomics.pdf)文档，详细说明激励如何计算与发放。
    
## 硬件要求是什么？
你可以在文档中查看明确的[硬件规格](https://gonka.ai/host/hardware-specifications/)，以确保你的硬件满足有效贡献的要求。

## 如果我想暂停挖矿，但希望以后回来继续使用我的账户，该怎么做？
若将来需要恢复网络节点，请至少备份：

- 冷钱包密钥（最重要，其它都可轮换）
- tmkms 的机密：`.tmkms/secrets/`
- keyring：`.inference .inference/keyring-file/`
- 节点密钥：`.inference/config .inference/config/node_key.json`
- 热钱包密码：`KEYRING_PASSWORD`

## 哪些更改需要发起治理提案（Governance Proposal）？
任何影响网络的链上变更均需要治理提案，例如：

- 更新模块参数（`MsgUpdateParams`）
- 执行软件升级
- 新增、更新或弃用推理模型
- 其它必须通过治理模块批准并执行的操作

## 谁可以创建治理提案？
任何拥有有效治理密钥（冷账户）的人都可以支付所需费用来创建治理提案。但提案仍需由活跃参与者通过 PoC 加权投票批准。建议在链下先行讨论重大变更（例如通过[GitHub](https://github.com/gonka-ai)或[社区论坛](https://discord.com/invite/kFFVWtNYjs)），以提升通过率。参见[完整指南](https://gonka.ai/transactions-and-governance/)。
  
## 治理提案与改进提案（Improvement Proposal）有何区别？
治理提案 → 链上提案。用于直接影响网络且需要链上投票的更改。例如：

- 更新网络参数（`MsgUpdateParams`）
- 执行软件升级
- 新增模型或能力
- 任何需由治理模块执行的修改

改进提案 → 由活跃参与者主导的链下提案。用于制定长期路线、讨论新想法并协调重大战略变更。

- 以 Markdown 文件管理，位于[/proposals](https://github.com/gonka-ai/gonka/tree/main/proposals) 目录
- 通过 GitHub Pull Request 进行评审与讨论
- 通过的提案会合并进仓库

## 改进提案如何评审与通过？
- 在[/proposals](https://github.com/gonka-ai/gonka/tree/main/proposals)文件夹中创建 Markdown 提案。
- 为你的提案打开一个 Pull Request。
- 社区评审：
        - 活跃贡献者与维护者在 PR 讨论串中讨论提案。
        - 公开收集反馈、建议与修订。
- 通过与合并：
        - 若社区达成一致，PR 将被合并。
        - 通过的提案将成为社区官方路线的一部分。

## 改进提案会导向治理提案吗？
会。通常先通过改进提案探索想法并收集共识，再起草治理提案。例如：

- 你可以先以改进提案形式提出新的模型集成。
- 社区达成一致后，再发起链上治理提案以更新参数或触发软件升级。

## 投票流程是怎样的？
- 提案提交并存入最小押金后，将进入投票期
- 投票选项：`yes`、`no`、`no_with_veto`、`abstain`
  
  - `yes` → 同意提案
    - `no` → 反对提案
    - `no_with_veto` → 反对并表达强烈异议
    - `abstain` → 中立弃权，但计入法定人数
   
- 在投票期内你可以随时更改投票；仅最后一次投票计入
- 若达到法定人数与阈值，则提案通过并由治理模块自动执行
  
使用以下命令进行投票。示例为投 `yes`，你可替换为任意选项（`yes`、`no`、`no_with_veto`、`abstain`）：
```
./inferenced tx gov vote 2 yes \
      --from <cold_key_name> \
      --keyring-backend file \
      --unordered \
      --timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
      --node $NODE_URL/chain-rpc/ \
      --chain-id gonka-mainnet \
      --yes
```

## 如何跟踪治理提案状态？
可随时通过 CLI 查询提案状态：
```
export NODE_URL=http://47.236.19.22:18000
./inferenced query gov tally 2 -o json --node $NODE_URL/chain-rpc/
```

## 如果提案未通过会怎样？
- 未达到法定人数 → 自动失败
- 多数投 `no` → 提案被拒，不做链上更改
- 若 `no_with_veto` 比例显著（超过否决阈值）→ 提案被拒并标记，表示强烈社区分歧
- 押金是否退还取决于链配置

## Gonka 的治理权重如何计算？
Gonka 采用 PoC 加权投票模型：

- 计算证明（PoC）：投票权与经过验证的计算贡献成正比。
- 抵押承诺：
    - PoC 产生的投票权中 20% 自动生效。
    - 要解锁剩余 80%，必须锁定 GNK 代币作为抵押。
- 这保证治理影响力体现真实的计算工作 + 经济抵押。

在最初的 180 个 epoch（约 6 个月）内，新参与者可仅通过 PoC 参与治理并获得投票权，无需抵押。在此期间，治理权完整可用，但投票权重仍与验证的计算活动相关。

## 为什么需要锁定 GNK 代币以获得治理权重？
投票权从不只来源于持币。GNK 用作经济抵押而非影响力来源。影响力来自持续的计算贡献；而锁定 GNK 抵押是参与治理与落实问责所需。

## 治理参数本身可以修改吗？
可以。包括法定人数、通过阈值、否决阈值在内的治理规则都可通过链上治理提案进行配置更新。这样网络可以随参与模式与算力经济的变化而演进决策机制。

## 您的验证者节点被“关停”（jailed）了，这是什么意思？
当您的验证者在最近 100 个区块中签名数量未达到 50 个（统计的是该时间段内的总签名数，不要求连续）时，就会被判定为“关停”。这是为了维护网络稳定，系统会暂时将您的节点移出出块流程，通常持续约 15 分钟。

可能的原因包括：

- 共识密钥不匹配：节点实际使用的共识密钥与链上注册的密钥不一致。请确认两者是否一致。
- 网络连接不稳定：网络波动或中断可能导致节点无法及时参与共识，从而错过区块签名。请确保节点网络稳定、延迟较低，并避免因其他进程占用过多资源而影响性能。

**关于奖励**：节点被关停期间，只要它仍在正常运行（如执行推理或其他验证者任务），您依然可以获得大部分奖励。因此，除非节点出现推理类故障，否则通常不会损失奖励。

**如何解除关停（Unjail）**：在问题解决后，您需要使用冷钱包密钥提交一笔 `unjail` 交易，即可让节点恢复正常运行。

```
export NODE_URL=http://<NODE_URL>:<port>
 ./inferenced tx slashing unjail \
    --from <cold_key_name> \
    --keyring-backend file \
    --chain-id gonka-mainnet \
    --gas auto \
    --gas-adjustment 1.5 \
    --fees 200000ngonka \
    --node $NODE_URL/chain-rpc/
```
然后使用以下命令检查节点是否已成功解除监禁：
```
 ./inferenced query staking delegator-validators \
    <cold_key_addr> \
    --node $NODE_URL/chain-rpc/
```

当节点处于监禁状态时，会显示 `jailed: true`。

## 如何本地模拟计算证明（PoC）

在本教程中，您将学习如何在本地环境模拟 PoC 流程，以确保在链上 PoC 阶段正式开始时，您的节点能够稳定运行。

**模拟前提条件**

进行模拟测试前，请确保满足以下任一条件：

- 您有一个正在运行但尚未在 API 节点上注册的 MLNode。
- 或者，您可以将 API 节点暂停，以独占系统资源进行测试。
  
**1. 暂停 API 节点**

在测试开始前，建议先暂停 API 节点容器。
```
docker pause api
```
测试完成后，使用以下命令恢复：
```
docker unpause api
```

**2. 发送 PoC 模拟请求**

模拟测试的核心是向您的 MLNode 发送一个 POST `/v1/pow/init/generate` 请求，这与 api 节点在 PoC 阶段开始时发送的请求相同：
[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32)
PoC 使用以下模型参数：
[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41)

您可以使用以下 curl 命令示例。

请求示例：

```
curl -X POST "http://<您的MLNode主机地址>:8080/api/v1/pow/init/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "node_id": 0,
    "node_count": 1,
    "block_hash": "EXAMPLE_BLOCK_HASH",  # 请替换为示例或测试值
    "block_height": 1,                   # 请替换为示例或测试值
    "public_key": "EXAMPLE_PUBLIC_KEY",  # 请替换为示例或测试值
    "batch_size": 1,
    "r_target": 10.0,
    "fraud_threshold": 0.01,
    "params": {
      "dim": 1792,
      "n_layers": 64,
      "n_heads": 64,
      "n_kv_heads": 64,
      "vocab_size": 8196,
      "ffn_dim_multiplier": 10.0,
      "multiple_of": 8192,
      "norm_eps": 1e-5,
      "rope_theta": 10000.0,
      "use_scaled_rope": false,
      "seq_len": 256
    },
    "url": "http://api:9100"
  }'
```

请求发送目标：
请将上述请求发送至您的 MLNode 代理容器的 8080 端口，或直接发送至 MLNode 容器的 8080 端口。
[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/deploy/join/docker-compose.mlnode.yml#L26 ](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/deploy/join/docker-compose.mlnode.yml#L26 )

**3. 如何判断模拟成功？**
```
请求发送后，请观察节点日志。如果模拟成功，您将看到类似以下的GPU资源分配与计算日志，这表明PoC计算流程已正确启动：
2025-08-25 20:53:33,568 - pow.compute.controller - INFO - Created 4 GPU groups:
2025-08-25 20:53:33,568 - pow.compute.controller - INFO -   Group 0: GpuGroup(devices=[0], primary=0) (VRAM: 79.2GB)
...
2025-08-25 20:53:33,758 - pow.compute.controller - INFO - Using batch size: 247 for GPU group [0]
...
2025-08-25 20:54:58,822 - pow.service.sender - INFO - Sending generated batch to http://api:9100/
```

**重要提示 & 常见问题**

- 关于发送错误：在模拟环境中，您很可能会看到 MLNode 尝试向 http://api:9100 发送数据但失败的报错信息。这是正常现象！
        - 原因：如果您暂停了 API 容器，或者 MLNode 与 API 容器不在同一 Docker 网络中，该 URL 自然无法访问。
- 成功的标志：本次模拟测试的核心目标是验证计算过程本身。只要您在日志中看到了上述的 GPU 分组信息和批次计算信息，即证明 PoC 生成环节工作正常，无需担忧最终发送回调的失败报错。

## 我清除了或覆盖了我的共识密钥

如果您正在使用 tmkms 并删除了 `.tmkms` 文件夹，只需重新启动 tmkms —— 它会自动生成一个新的共识密钥。

要注册新的共识密钥，请提交以下交易：
```
./inferenced tx inference submit-new-participant \
    <PUBLIC_URL> \
    --validator-key <CONSENSUS_KEY> \
    --keyring-backend file \
    --unordered \
    --from <COLD_KEY_NAME> \
    --timeout-duration 1m \
    --node http://<node-url>/chain-rpc/ \
    --chain-id gonka-mainnet
```

## 我删除了暖密钥

1) 请在本地设备（非服务器）上备份冷密钥。 停止 API 容器：
   
```
docker compose down api --no-deps
```

2) 在 `config.env` 文件中设置暖密钥的 `KEY_NAME`。
   
3) ［服务器操作］：重新创建暖密钥：
   
```
source config.env && docker compose run --rm --no-deps -it api /bin/sh
```

4) 然后在容器内执行：
   
```
printf '%s\n%s\n' "$KEYRING_PASSWORD" "$KEYRING_PASSWORD" | \
inferenced keys add "$KEY_NAME" --keyring-backend file
```

5)［本地操作］：在您本地设备（保存了冷密钥的机器）上，运行以下交易命令：

```
./inferenced tx inference grant-ml-ops-permissions \
    gonka-account-key \
    <address-of-warm-key-you-just-created> \
    --from gonka-account-key \
    --keyring-backend file \
    --gas 2000000 \
    --node http://<node-url>/chain-rpc/
```

6) 启动 API 容器：
   
```
source config.env && docker compose up -d
```

## 如何安全下线旧集群？

按照以下步骤操作，可以安全地关闭旧集群，而不会影响网络声誉或稳定性。

1）禁用所有 MLNode. 使用以下命令禁用每个 MLNode：
```
curl -X POST http://localhost:9200/admin/v1/nodes/<id>/disable
```

查看所有节点 ID：
```
curl http://localhost:9200/admin/v1/nodes | jq '.[].node.id'
```

2) 未被安排在下一轮 Proof-of-Compute（PoC）期间执行推理任务的节点将在该 PoC 自动停止。
被安排执行推理任务的节点将在再经历一个 epoch（周期）后停止运行。 你可以通过以下命令检查节点状态（查看 mlnode 字段）：

```
curl http://<inference_url>/v1/epochs/current/participants
```

当节点状态显示为 “disabled” 后，即可安全关闭对应的 MLNode 服务器。

3) 关闭 Network Node. 在所有 MLNode 都已停用并关闭后，即可关闭 Network Node（网络节点）。 在执行前，建议（但非必须）备份以下文件：
   
```
- .dapi/api-config.yaml
- .dapi/gonka.db (created after on-chain upgrade)
- .inference/config/
- .inference/keyring-file/
- .tmkms/
```

即使未进行备份，也可以通过 Account Key（账户密钥） 重新恢复集群设置。

## 如果您的节点无法连接到配置文件中指定的默认种子节点，该怎么办？

如果您的节点无法连接到默认的种子节点，您可以在 config.env 中更新三个变量，将节点指向其他可用的种子节点。
1. `SEED_API_URL` – 种子节点的 HTTP 端点（用于 API 通信）。
从下面的列表中选择任意一个 URL，并将其直接赋值给 `SEED_API_URL`。
```
export SEED_API_URL=<chosen_http_url>
```
可用的创世种子节点 API 地址：
```
http://185.216.21.98:8000
http://36.189.234.197:18026
http://36.189.234.237:17241
http://node1.gonka.ai:8000
http://node2.gonka.ai:8000
http://node3.gonka.ai:8000
https://node4.gonka.ai
http://47.236.26.199:8000
http://47.236.19.22:18000
http://gonka.spv.re:8000
```
2. `SEED_NODE_RPC_UR`L – 同一种子节点的 RPC 端点。
使用与 `SEED_API_URL` 相同的主机名，但端口始终为 26657。
```
export SEED_NODE_RPC_URL=http://<host>:26657
```
示例：
```
SEED_NODE_RPC_URL=http://node2.gonka.ai:26657
```
3. `SEED_NODE_P2P_UR`L – 供节点之间通信使用的 P2P 地址。
您需要从种子节点的状态端点中获取 P2P 端口。

查询节点：
```
http://<host>:<http_port>/chain-rpc/status
```
示例：
```
http://node3.gonka.ai:8000/chain-rpc/status
```
在返回结果中找到 `listen_addr` 字段，例如：
```
"listen_addr": "tcp://0.0.0.0:5000"
```
使用该端口：
```
export SEED_NODE_P2P_URL=tcp://<host>:<p2p_port>
```
示例：
```
export SEED_NODE_P2P_URL=tcp://node3.gonka.ai:5000
```
最终示例：
```
export SEED_API_URL=http://node2.gonka.ai:8000
export SEED_NODE_RPC_URL=http://node2.gonka.ai:26657
export SEED_NODE_P2P_URL=tcp://node2.gonka.ai:5000
```

## 如何更改种子节点？
要重新配置种子节点，请重置节点并重新构建其推理数据：
```
source config.env
docker compose down node
sudo rm -rf .inference/data/ .inference/.node_initialized
sudo mkdir -p .inference/data/
```
重新启动节点后，你可以在以下位置查看实际应用的种子节点：
```
sudo cat .inference/config/config.toml
```
查找字段：
```
seeds = [...]
```
当文件 `.node_initialized` 被创建后，系统将不再自动更新种子节点。
从那时起：

- 种子节点列表将按原样使用
- 所有更改必须手动进行
- 你可以添加任意数量的种子节点

种子节点格式是一个以逗号分隔的字符串：
```
seeds = "<node1_id>@<node1_ip>:<node1_p2p_port>,<node2_id>@<node2_ip>:<node2_p2p_port>"
```
要从任何正在运行的节点查看其已知的 peers，请使用 chain RPC：
```
curl http://47.236.26.199:8000/chain-rpc/net_info | jq
```
此命令将显示当前节点看到的所有 peers。

## 硬件、节点权重以及 MLNode 配置实际上是如何被验证的？

链本身并不会验证真实硬件。链上只验证参与者的总权重（total participant weight），并且这也是用于权重分配和奖励计算的唯一数值。至于这些权重如何在多个 MLNode 之间拆分，以及任何“硬件类型”或其他描述性字段，都只是信息性的字段，主机可以自由修改。

真实硬件从未被验证——它只作为一个自报告字段存在，参与者可以填入任何他们想填的内容。

当创建或更新节点时（例如通过 `POST http://localhost:9200/admin/v1/nodes`，对应的处理代码见
[https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/server/admin/node_handlers.go#L62](https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/server/admin/node_handlers.go#L62)），可以显式指定 hardware 字段。
如果省略该字段，API 服务会尝试从 MLNode 自动检测硬件信息。

在实际使用中，许多主机会运行一个代理 MLNode，其后端连接多个服务器；自动检测只能看到其中一个服务器，这种部署方式完全有效。

无论配置如何，所有的权重分配和奖励计算只依赖参与者的总权重，而 MLNode 之间的内部拆分或上报的硬件类型，都不会影响链上的任何验证逻辑。
