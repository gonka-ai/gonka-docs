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

## 我的节点被“关停（jailed）”了，这意味着什么？
如果验证者连续 50 个区块未参与签名，会被短暂关停（约 15 分钟）。这不影响推理奖励（若推理未发现问题），因此奖励不会丢失。当前短暂期结束（约 15 分钟）后，可进行解锁。你需要使用冷密钥提交解锁交易：
```
export NODE_URL=http://47.236.19.22:18000
 ./inferenced tx slashing unjail \
    --from <cold_key_name> \
    --keyring-backend file \
    --chain-id gonka-mainnet \
    --gas auto \
    --gas-adjustment 1.5 \
    --fees 200000ngonka \
    --node $NODE_URL/chain-rpc/
```
然后检查是否已解锁：
```
 ./inferenced query staking delegator-validators \
    <cold_key_addr> \
    --node $NODE_URL/chain-rpc/
```
当节点被关停时，会显示 `jailed: true`。

## 如何模拟计算证明（PoC）？
在 PoC 阶段开始时，`api` 容器会发送 `POST /v1/pow/init/generate` 请求：[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32)

PoC 使用如下模型参数：[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41)

可通过如下 `curl` 请求启动 PoC：
```
curl -X POST "${PORT:-8080}:8080"/api/v1/pow/init/generate" \
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
`DAPI_API__POC_CALLBACK_URL` 的值用于上面的 `url` 字段。使用真实地址可测试网络设置。

将此请求发送到 MLNode 代理容器的 `8080` 端口，或直接发送到 MLNode 的 `8080`（参考部署文件：<https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/deploy/join/docker-compose.mlnode.yml#L26>）。

如果测试成功，你会看到类似如下的日志：
```
2025-08-25 20:53:33,568 - pow.compute.controller - INFO - Created 4 GPU groups:
...
```
随后，服务将开始向 `DAPI_API__POC_CALLBACK_URL` 发送生成的随机数（nonce）：
```
2025-08-25 20:54:58,822 - pow.service.sender - INFO - Sending generated batch to http://api:9100/
```
进行该测试时，MLNode 不应在 API 节点上注册为活跃参与者。

如果你的节点尚未激活，可在测试前临时暂停 API 容器，测试完成后再恢复：

1) 暂停 API 容器：
```
docker pause api
```
2) 运行测试。

3) 取消暂停 API 容器：
```
docker unpause api
```
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

