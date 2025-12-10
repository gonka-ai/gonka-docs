# 常见问题（FAQ）

## 什么是 Gonka？
Gonka 是一个由参与者共同运行的去中心化高效 AI 计算网络，为 AI 模型的训练与推理提供相较中心化云服务更具性价比与高效的替代方案。作为协议，它不是公司或创业团队。
    
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
        - 活跃贡献者与维护者在 PR 帖中讨论提案。
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

您可能希望在 MLNode 上自行模拟 PoC，以确保当链上进入 PoC 阶段时一切都能正常运行。

要运行此测试，您需要一个尚未向 api 节点注册的运行中 MLNode，或者暂停 api 节点。要暂停 api 节点，请使用 `docker pause api`。完成测试后，可以使用 `docker unpause api` 取消暂停。

在测试过程中，您将向 mlnode 发送 POST /v1/pow/init/generate 请求，这与 api 节点在 POC 阶段开始时发送的请求相同

[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32)

PoC 使用以下模型参数 [https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41)

如果您的节点处于 INFERENCE 状态，则需要先将节点切换到 stopped 状态：

```
curl -X POST "http://<ml-node-host>:<port>/api/v1/stop" \
  -H "Content-Type: application/json"
```

现在您可以发送请求以启动 PoC：

```
curl -X POST "http://<ml-node-host>:<port>/api/v1/pow/init/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "node_id": 0,
    "node_count": 1,
    "block_hash": "EXAMPLE_BLOCK_HASH",
    "block_height": 1,
    "public_key": "EXAMPLE_PUBLIC_KEY",
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
将此请求发送到 MLNode 的代理容器的 8080 端口，或直接发送到 MLNode 的 8080 [https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/deploy/join/docker-compose.mlnode.yml#L26](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/deploy/join/docker-compose.mlnode.yml#L26)

如果测试成功运行，您将看到类似以下的日志：
```
2025-08-25 20:53:33,568 - pow.compute.controller - INFO - Created 4 GPU groups:
2025-08-25 20:53:33,568 - pow.compute.controller - INFO -   Group 0: GpuGroup(devices=[0], primary=0) (VRAM: 79.2GB)
2025-08-25 20:53:33,568 - pow.compute.controller - INFO -   Group 1: GpuGroup(devices=[1], primary=1) (VRAM: 79.2GB)
2025-08-25 20:53:33,568 - pow.compute.controller - INFO -   Group 2: GpuGroup(devices=[2], primary=2) (VRAM: 79.2GB)
2025-08-25 20:53:33,568 - pow.compute.controller - INFO -   Group 3: GpuGroup(devices=[3], primary=3) (VRAM: 79.2GB)
2025-08-25 20:53:33,758 - pow.compute.controller - INFO - Using batch size: 247 for GPU group [0]
2025-08-25 20:53:33,944 - pow.compute.controller - INFO - Using batch size: 247 for GPU group [1]
2025-08-25 20:53:34,151 - pow.compute.controller - INFO - Using batch size: 247 for GPU group [2]
2025-08-25 20:53:34,353 - pow.compute.controller - INFO - Using batch size: 247 for GPU group [3]
```
然后服务将开始向 `DAPI_API__POC_CALLBACK_URL` 发送生成的 nonce：
```
2025-08-25 20:54:58,822 - pow.service.sender - INFO - Sending generated batch to http://api:9100/
```
如果您暂停了 api 容器，或 MLNode 容器与 api 容器不在同一 docker 网络，则 http://api:9100 将不可访问。此时您会看到 MLNode 无法发送生成批次的错误消息。关键是要确保生成过程确实在运行。

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

## 我删除了热密钥

1) 请在本地设备（非服务器）上备份冷密钥。 停止 API 容器：
   
```
docker compose down api --no-deps
```

2) 在 `config.env` 文件中设置热密钥的 `KEY_NAME`。
   
3) ［服务器操作］：重新创建热密钥：
   
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

根据节点是否已经初始化，有两种不同方式来更新 Seed 节点。

=== "方式 1. 手动编辑 Seed 节点（节点已初始化后）"

    一旦生成 .node_initialized 文件，系统将不再自动更新 Seed 节点。 从此之后：
    
        - Seed 列表将按原样使用
        - 所有更改都必须手动进行
        - 你可以添加任意数量的 Seed 节点
    
    Seed 的格式是一个逗号分隔的字符串：
    ```
    seeds = "<node1_id>@<node1_ip>:<node1_p2p_port>,<node2_id>@<node2_ip>:<node2_p2p_port>"
    ```
    要查看任意运行中的节点所发现的已知 peers，可调用链的 RPC：
    ```
    curl http://47.236.26.199:8000/chain-rpc/net_info | jq
    ```

    在响应中关注：
    
    - `listen_addr` -  P2P 端点
    - `rpc_addr` - RPC 端点
   
    示例：

    ```
         % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                     Dload  Upload   Total   Spent    Left  Speed
    100 94098    0 94098    0     0  91935      0 --:--:--  0:00:01 --:--:-- 91982
    {
      "jsonrpc": "2.0",
      "id": -1,
      "result": {
        "listening": true,
        "listeners": [
          "Listener(@tcp://47.236.26.199:5000)"
        ],
        "n_peers": "50",
        "peers": [
          {
            "node_info": {
              "protocol_version": {
                "p2p": "8",
                "block": "11",
                "app": "0"
              },
              "id": "ce6f26b9508839c29e0bfd9e3e20e01ff4dda360",
              "listen_addr": "tcp://85.234.78.106:5000",
              "network": "gonka-mainnet",
              "version": "0.38.17",
              "channels": "40202122233038606100",
              "moniker": "my-node",
              "other": {
                "tx_index": "on",
                "rpc_address": "tcp://0.0.0.0:26657"
              }
            },
    ...
    ```

    这里显示了节点当前看到的所有 peers。

=== "方式 2. 重新初始化节点（从环境变量自动应用 Seed）"

    如果你希望节点重新生成配置，并自动应用 `config.env` 中定义的 Seed 节点，请使用此方法。.
    ```
    source config.env
    docker compose down node
    sudo rm -rf .inference/data/ .inference/.node_initialized
    sudo mkdir -p .inference/data/
    ```
    节点重启后，将像全新安装一样运行，并根据环境变量重新生成配置，包括其中的 Seed 值。

    要验证最终应用的 Seed：
    
    ```
    sudo cat .inference/config/config.toml
    ```
    查找字段：
    ```
    seeds = [...]
    ```

## 硬件、节点权重以及 MLNode 配置实际上是如何被验证的？

链本身并不会验证真实硬件。链上只验证参与者的总权重（total participant weight），并且这也是用于权重分配和奖励计算的唯一数值。至于这些权重如何在多个 MLNode 之间拆分，以及任何“硬件类型”或其他描述性字段，都只是信息性的字段，主机可以自由修改。

真实硬件从未被验证——它只作为一个自报告字段存在，参与者可以填入任何他们想填的内容。

当创建或更新节点时（例如通过 `POST http://localhost:9200/admin/v1/nodes`，对应的处理代码见
[https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/server/admin/node_handlers.go#L62](https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/server/admin/node_handlers.go#L62)），可以显式指定 hardware 字段。
如果省略该字段，API 服务会尝试从 MLNode 自动检测硬件信息。

在实际使用中，许多主机会运行一个代理 MLNode，其后端连接多个服务器；自动检测只能看到其中一个服务器，这种部署方式完全有效。

无论配置如何，所有的权重分配和奖励计算只依赖参与者的总权重，而 MLNode 之间的内部拆分或上报的硬件类型，都不会影响链上的任何验证逻辑。

## Cosmovisor 更新需要多少可用磁盘空间，以及如何安全删除 `.inference` 目录中的旧备份？

Cosmovisor 在执行更新时会在 `.inference` 状态目录中创建完整备份。例如，你可能会看到类似 `data-backup-<some_date>` 的文件夹。截止 2025 年 11 月 20 日，data 目录的大小约为 150 GB，因此每个备份也大约需要相同的空间。为了安全地执行更新，建议至少预留 250 GB 以上 的可用磁盘空间。

你可以删除旧备份以释放空间，但在某些情况下仍可能不足，这时可能需要扩容服务器磁盘。

要删除旧的备份目录，你可以使用以下命令：
```
sudo su
cd .inference
ls -la   # 查看文件夹列表。会看到类似 data-backup… 的目录。除了这些目录外，千万不要删除任何其他内容。
rm -rf <data-backup...>
```

## 如何预先下载二进制文件以在升级期间避免访问 GitHub？
（仅在 v0.2.5 升级提案通过时适用。）

以下是可选步骤，说明如何提前预下载二进制文件，以在升级过程中避免依赖 GitHub。此步骤仅在 v0.2.5 升级提案获批时才相关。

```
# 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.5/bin \
              .inference/cosmovisor/upgrades/v0.2.5/bin && \

# 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.5/decentralized-api-amd64.zip" && \
echo "6fd12cd92e8226866be76a5e63a57e1b0041c7679db047af75e764e98668cb91 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.5/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.5/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

# 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.5/inferenced-amd64.zip" && \
echo "fab7be9bcdb4e21f058e6d19cfd698b6862bf6f5a8aeecbf9165907fc7edcc64 inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.5/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.5/bin/inferenced && \
echo "Inference Installed and Verified" && \

# 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.5/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.5/bin/inferenced && \
echo "8c6898e99acb3b1acb4e196398003453ea50f82d92ce4e2ebcec99a795f8d735 .dapi/cosmovisor/upgrades/v0.2.5/bin/decentralized-api" | sudo sha256sum --check && \
echo "9187b69322ba73f745c8ed2fbad713a39ce0e39ed15f7a48dacf9356693ed1a0 .inference/cosmovisor/upgrades/v0.2.5/bin/inferenced" | sudo sha256sum --check
```
只有当所有命令在执行过程中未出现任何错误，并成功输出确认信息时，二进制文件才被视为已成功下载和安装。
```
Inference Installed and Verified
--- Final Verification ---
-rwxr-xr-x 1 root root 216176168 Jan  1  2000 .dapi/cosmovisor/upgrades/v0.2.5/bin/decentralized-api
-rwxr-xr-x 1 root root 212197496 Jan  1  2000 .inference/cosmovisor/upgrades/v0.2.5/bin/inferenced
.dapi/cosmovisor/upgrades/v0.2.5/bin/decentralized-api: OK
.inference/cosmovisor/upgrades/v0.2.5/bin/inferenced: OK
```

## 如何防止 NATS 出现无限制的内存增长？

NATS 当前被配置为无限期保存所有消息，这会导致内存使用量持续增长。
推荐的解决方案是在两个 NATS 流中为消息设置 24 小时的存活时间（TTL）。

1. 安装 NATS CLI。请按照以下链接中的说明安装 Golang：[https://go.dev/doc/install](https://go.dev/doc/install). 然后安装 NATS CLI：
   ```
   go install github.com/nats-io/natscli/nats@latest
   ```
2. 如果已经安装了 NATS CLI，请运行：
    ```
    nats stream info txs_to_send --server localhost:<your_nats_server_port>
    nats stream info txs_to_observe --server localhost:<your_nats_server_port>
    ```

## 如何修改 `inference_url`?

如果出现以下情况，你可能需要更新你的 `inference_url`：

- 你更换了 API 域名
- 你将 API 节点迁移到了新机器
- 你重新配置了 HTTPS / 反向代理
- 你正在迁移基础设施，希望让 Host 指向新的端点

此操作不需要重新注册、重新部署或重新生成密钥。
更新 `inference_url` 是通过与初始注册相同的交易完成的（即 `submit-new-participant msg`）。

链上逻辑会检查你的 Host（participant）是否已存在：

- 如果 participant 不存在，则创建新的 participant
- 如果 participant 已存在，则只有三个字段可以更新：InferenceURL, ValidatorKey, WorkerKey

其他字段会自动保留。

这意味着更新 `inference_url` 是一个安全且非破坏性的操作。

!!! note

    当节点更新其执行 URL 时，新 URL 会立即用于来自其他节点的推理请求。然而，ActiveParticipants 中记录的 URL 直到下一个 epoch 才会更新，因为过早修改会使参与者集合的加密证明失效。 为避免服务中断，建议在当前 epoch 完成之前同时保持旧 URL 和新 URL 可用。

[在本地] 使用你的冷钥进行本地更新：
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
请按照下方链接进行验证，并将结尾部分替换为你的节点地址：[http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/participant/gonka1qqqc2vc7fn9jyrtal25l3yn6hkk74fq2c54qve](http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/participant/gonka1qqqc2vc7fn9jyrtal25l3yn6hkk74fq2c54qve)

## 为什么我的 `application.db` 变得如此大，如何修复？

部分节点存在 `application.db` 文件不断增大的问题。

`.inference/data/application.db` 存储链的状态历史（而非区块），默认保存 362880 个状态。

状态历史包含每个状态的完整默克尔树，将其保留更短的时间是安全的。例如，仅保留 1000 个区块。

可以在 `.inference/config/app.toml` 中设置修剪参数：

```
...
pruning = "custom"
pruning-keep-recent = "1000"
pruning-interval    = "100"
```

新配置将在重启 `node` 容器后生效。但存在一个问题——即使启用了修剪，数据库清理也非常缓慢。

有几种方法可以重置 `application.db`：

=== "选项 1：从快照完全重新同步"

    1) 停止节点
    ```
    docker stop node
    ```
    
    2) 删除数据
    ```
    sudo rm -rf .inference/data/ .inference/.node_initialized sudo mkdir -p .inference/data/
    ```
    
    3) 启动节点
    ```
    docker start node
    ```
    
    此方法可能需要一些时间，在此期间节点将无法记录交易。
    
    请使用可用的可信节点下载快照。

=== "选项 2：从本地快照重新同步"

    快照默认启用，存储在 `.inference/data/snapshots`
    
    1) 准备新的 `application.db`（`node` 容器仍在运行）
    
    1.1) 为 `inferenced` 准备临时主目录
    ```
    mkdir -p .inference/temp
    cp -r .inference/config .inference/temp/config
    mkdir -p .inference/temp/data/
    ```
    
    1.2) 复制快照：
    ```
    cp -r .inference/data/snapshots .inference/temp/data/
    ```
    
    1.3) 列出快照
    ```
    inferenced snapshots list --home .inference/temp
    ```
    
    复制最新快照的高度。
    
    1.4) 开始从快照恢复（`node` 容器仍在运行）
    ```
    inferenced snapshots restore <INSERRT_HEIGHT> 3  --home .inference/temp
    ```
    
    这可能需要一些时间。完成后，您将在 `.inference/temp/data/application.db` 中获得新的 `application.db`
    
    2) 用新的 `application.db` 替换旧的
    
    2.1) 停止 `node` 容器（从另一个终端窗口）
    ```
    docker stop node
    ```
    
    2.2) 移动原始 `application.db`
    ```
    mv .inference/data/application.db .inference/temp/application.db-backup
    mv .inference/wasm .inference/wasm.db-backup
    ```
    
    2.3) 用新的替换它
    ```
    cp -r .inference/temp/data/application.db .inference/data/application.db
    cp -r .inference/temp/wasm .inference/wasm
    ```
    
    2.4) 启动 `node` 容器（从另一个终端窗口）：
    ```
    docker start node
    ```
    
    3) 等待 `node` 容器同步完成，然后删除 `.inference/temp/`
    
    如果您有多个节点，建议逐个清理。

=== "选项 3：实验性方案"

    另一个选项可能是在单独的仅 CPU 机器上启动 `node` 容器的单独实例，并在严格验证器模式下设置：
    
    - 保留非常短的历史记录
    - 仅将 RPC 和 API 访问限制为 `api` 容器
    
    运行后，将现有的 `tmkms` 卷移动到新节点（首先在现有节点上禁用区块签名）。
    
    这是该方法的一般思路。如果您决定尝试并有任何问题，欢迎在 [Discord](https://discord.com/invite/RADwCT2U6R) 上联系我们。

## 自动 `ClaimReward` 未执行，我该怎么办？

发现了一个可能导致自动 `ClaimReward` 交易失败的问题。
`TxManager` 的最大 gas 设置过低（虽然 gas 目前是免费的，但仍会进行估算）

修复方法：
[https://github.com/gonka-ai/gonka/commit/0ac84b0b4d3f89e3c67c33e22aff3d9800c5c988](https://github.com/gonka-ai/gonka/commit/0ac84b0b4d3f89e3c67c33e22aff3d9800c5c988)
[https://github.com/gonka-ai/gonka/tree/release/v0.2.5-post7](https://github.com/gonka-ai/gonka/tree/release/v0.2.5-post7)

1) 下载新的二进制文件：
```
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.5-post7/bin && \
wget -q -O decentralized-api.zip "https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.5-post7/decentralized-api-amd64.zip" && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.5-post7/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.5-post7/bin/decentralized-api && \
sudo rm -f .dapi/data/upgrade-info.json && \
sudo rm -rf .dapi/cosmovisor/current && \
sudo ln -sfT upgrades/v0.2.5-post7 .dapi/cosmovisor/current && \
test "$(readlink .dapi/cosmovisor/current)" = "upgrades/v0.2.5-post7" \
  && echo "Symlink OK: points to upgrades/v0.2.5-post7" \
  || echo "Symlink FAILED: does not point to upgrades/v0.2.5-post7" && \
test "$(sha256sum .dapi/cosmovisor/upgrades/v0.2.5-post7/bin/decentralized-api | cut -d' ' -f1)" = "040ade21ce37886e53bb2c4fd0c8eb8cce6827a44c841a14cbf788d748ce9da3" \
  && echo "Hash OK: binary matches expected sha256" \
  || echo "Hash FAILED: binary does not match expected sha256"
```

2) 重启 `api` 容器：
```
docker restart api
```

3) 如果您有未领取的奖励，等待约 5 分钟后执行：
```
curl -X POST http://localhost:9200/admin/v1/claim-reward/recover \
    -H "Content-Type: application/json" \
    -d '{"force_claim": true, "epoch_id": 106}'
```

要检查您是否有未领取的奖励，可以使用：
```
curl http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/epoch_performance_summary/106/<ACCOUNT_ADDRESS> | jq
```
