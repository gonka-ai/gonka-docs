# 公告

## 2026年2月1日

**升级已完成：v0.2.9 已在主网正式生效**

针对升级提案 v0.2.9 的链上治理投票已结束。该提案已被批准（APPROVED），并已在区块高度 2,451,000 成功完成主网升级。本次升级启用了 PoC v2 作为权重分配机制，并完成了从旧版 PoC 机制的全面迁移。

**注意事项（Attention)**

- 下一轮 PoC 周期（从 epoch 158 过渡到 epoch 159）至关重要。
请相关节点运营方务必保持在线，以便在需要时能够及时执行后续操作或风险缓解指引。
- 只有运行 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 模型的 ML 节点 才有资格进入下一轮（第 159 轮）epoch 并参与 PoC v2 权重分配。运行其他模型的 ML 节点将不会被纳入即将到来的 epoch 参与者集合。

**主机准备（Host preparation**

建议所有主机运营方确认其所有 ML 节点：

- 仅配置并提供受支持的模型 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 已将镜像升级至 兼容 PoC v2 的版本

关于如何将 ML 节点切换至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、升级 ML 节点镜像以及移除其他模型的详细指南，请参阅 FAQ。

**当前已生效的关键变更（Key changes now active**

**PoC v2 启用**

- PoC v2 现已作为权重分配的主要机制
- 确认型 PoC（PoC v2 tracking） 被用作结果的权威来源
- 旧版 PoC 逻辑已不再用于权重计算

**模型配置（Model configuration)**

- 网络当前运行于 单一模型配置
- 用于 PoC v2 及权重分配的模型为 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 提供其他模型的 ML 节点将不参与 PoC v2 权重分配. 在支持的情况下，系统可能会自动切换模型至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`

**资格条件（Eligibility criteria)**

要符合 PoC v2 权重分配资格，ML 节点必须同时满足以下两个条件：

- 节点提供 Qwen/Qwen3-235B-A22B-Instruct-2507-FP8 模型
- 节点运行 兼容 PoC v2 的镜像版本：
    - ghcr.io/product-science/mlnode:3.0.12-post1
    - ghcr.io/product-science/mlnode:3.0.12-post1-blackwell

**cPoC 场景下的奖励流向修正（Reward flow correction for cPoC cases）**

在因 cPoC 处罚导致奖励被减少或取消的情况下，未分配的奖励部分将转入社区池（Community Pool）。
此前，这部分奖励会被重新分配给其他参与者。

**其他协议更新（Additional protocol updates）**

- 在初始阶段，Transfer Agent 角色被限制在一个已定义的￼ allowlist 中
- 对于在生成 PoC 时忽略 PoC 验证的节点，已将其从参与者￼ allowlist 中移除
- 当 PoC v2 验证投票未达到阈值时，将应用Guardian 权重￼作为确定性的兜底机制

有关上述变更的更多详细信息，请参阅治理文档：
[https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9)

## 2026 年 2 月 1 日

v0.2.9 升级提案的链上治理流程即将结束。

- 投票结束时间： 2026 年 2 月 1 日 22:02:58（UTC）
- 升级高度： 2,451,000
- 预计升级时间： 2026 年 2 月 2 日 05:10:00（UTC）

建议各位主机（Hosts）在 [GitHub](https://github.com/gonka-ai/gonka/pull/668)￼ 上查看该提案并参与投票。

建议提前下载二进制文件，以避免在升级窗口期间依赖 GitHub 的可用性。

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

**v0.2.9 升级提案进入治理流程**

下一版本链上软件 v0.2.9 的升级提案现已在链上发布并开放投票。若获批准，该提案将启用 PoC v2 作为权重分配机制，并通过链上治理完成从旧版 PoC 机制的过渡。

**关键变更**

**PoC v2 激活**

- PoC v2 作为权重分配的有效机制投入使用
- 确认型 PoC（V2 tracking）作为结果的规范来源
- 旧版 PoC 逻辑不再用于权重计算

**模型配置**

- 网络以单模型配置运行
- 用于 PoC v2 与权重分配的模型为 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 
- 提供其他模型的 ML 节点不纳入 PoC v2 的权重分配。在支持的情况下，可能会自动切换至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 

**资格条件**

ML 节点要符合 PoC v2 权重分配资格，必须同时满足以下两项条件：

- 节点提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 节点运行兼容 PoC v2 的镜像：
    - ghcr.io/product-science/mlnode:3.0.12-post1 
    - ghcr.io/product-science/mlnode:3.0.12-post1-blackwell 

**cPoC 场景下的奖励流程修正**

当因 cPoC 处罚导致奖励减少或被排除时，未计入的部分将转入社区池。此前，这部分奖励会在其他参与者之间重新分配。

**其他协议更新**

- Transfer Agent 角色在初始阶段仅限于一个[已定义](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#transfer-agent-whitelist)的 `allowlist`
- 参与 PoC 生成但忽略 PoC 验证的节点已从[参与者](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#suspicious-participant-removal) `allowlist` 中移除 
- 当未达到 PoC v2 验证投票阈值时，应用 [Guardian 权重](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#guardian-tiebreaker-for-poc-v2-voting)作为确定性的兜底机制 

上述变更的更多细节可在治理工件中查看：[https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9) 

**主机准备**

建议主机确认所有 ML 节点：

- 仅配置并提供受支持的模型 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 镜像已更新至兼容 PoC v2 的版本

关于将 ML 节点切换至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、升级 ML 节点镜像以及移除其他模型的指引，请参阅 [FAQ](https://gonka.ai/FAQ/#how-to-switch-to-qwenqwen3-235b-a22b-instruct-2507-fp8-upgrade-ml-nodes-and-remove-other-models)。

**如何投票**

提案详情与投票可通过 `inferenced` 进行。任何活跃节点均可使用，可用节点包括：

- [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
- [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
- [http://node3.gonka.ai:8000](http://node3.gonka.ai:8000)
- [https://node4.gonka.ai](https://node4.gonka.ai)

提交投票（ `yes` 、 `no` 、 `abstain` 、 `no_with_veto` ）：
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

- 投票结束时间：2026年2月1日 22:02:58（UTC）
- 升级高度：2451000
- 预计升级时间：2026年2月2日 05:10:00（UTC）

建议主机在 [GitHub](https://github.com/gonka-ai/gonka/pull/668) 上查看该提案并参与投票。

**注意事项**

- 请计划在升级窗口期间保持在线，以便在需要时及时执行后续步骤或缓解措施。
- 升级期间，Cosmovisor 会在 `.inference/data` 目录中创建完整的状态备份。请在升级前确保有足够的磁盘空间。有关如何安全移除 `.inference` 目录中旧备份的指引，请参阅[文档](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。
- 如果 `application.db` 占用大量磁盘空间，可采用[此处](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)描述的清理方法。
- 升级完成后，可选择使用 Postgres 作为本地负载数据存储方案。

## 2026年1月29日

**PoC 验证参与通知**

在最近一轮 epoch 期间，大量 ML 节点未获得 PoC 权重。
分析显示，这是由于 PoC 验证参与不足所致。在多数情况下，参与者提交了 nonce，但验证要么未执行，要么执行水平显著低于协议要求。
以下表格列出了在上一轮 epoch 中拥有权重、在当前 epoch 中提交了 PoC nonce、但未参与或参与不足 PoC 验证阶段的参与者：[https://docs.google.com/spreadsheets/d/17agQXP77lATT2bNK12OEOzek5wNSptN2ktiSag3QXB0/](https://docs.google.com/spreadsheets/d/17agQXP77lATT2bNK12OEOzek5wNSptN2ktiSag3QXB0/)

他们的总权重约为 36%。加上完全未参与 PoC 的参与者，PoC 验证参与不足或零参与的总权重约达 48%，已处于临界高位。
如果您的节点在该表格中显示 `validated` 为 0，请检查您的 PoC 验证日志和配置，确保验证正常运行。

此 notebook 展示了用于生成上述表格的处理流程：[https://github.com/gonka-ai/gonka/blob/gm/debug-155-1/debug-validation.ipynb](https://github.com/gonka-ai/gonka/blob/gm/debug-155-1/debug-validation.ipynb)。

## 2026年1月29日 

**升级已执行：v0.2.8 现已在主网上线**

v0.2.8 升级提案的链上治理投票已结束。该提案已获批准并成功在主网上执行。 
本次升级实现了 PoC v2 架构，精简了模型支持，并应用了关键的安全性和可靠性修复。

**现已生效的关键变更**

**PoC v2 核心集成**

- vLLM 集成：PoC 已直接集成到 vLLM 中，实现从推理到 PoC 的即时切换，无需卸载模型。
- MMR 承诺：工件存储已迁移至链下，使用 Merkle Mountain Range 承诺；链上仅记录 `root_hash` 和 `count`。
- 双模式迁移：支持 V1（常规 PoC）和 V2（确认型 PoC）跟踪模式。

**模型可用性更新**

支持的模型集现已受到限制。除以下模型外，所有此前支持的模型均已从活跃集中移除：

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `Qwen/Qwen3-32B-FP8`

**安全性与可靠性改进**

- SSRF 与 DoS：验证 `InferenceUrl` 以拒绝内部 IP，并添加超时以防止请求挂起。
- 投票篡改：拒绝重复的 PoC 验证以防止覆盖。
- 身份验证绕过：将 `epochId` 绑定到签名，以针对正确的 epoch 进行验证。

**主机参与 PoC v2 的资格要求**

要获得 PoC v2 参与资格，主机必须完成以下操作：

- 模型配置：将 ML 节点配置为提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- ML 节点升级：使用支持 PoC v2 的版本：
    - ghcr.io/product-science/mlnode:3.0.12
    - ghcr.io/product-science/mlnode:3.0.12-blackwell

!!! note 
    未能同时满足上述两项条件的节点，在网络过渡到单模型配置后将不具备 PoC v2 参与资格。PoC v2 用于权重分配的过渡仍需视观察到的采用阈值和后续治理情况而定。

**维护与运营**

- Cosmovisor：节点和 API 二进制更新将自动处理。现有主机无需对运行中的容器进行手动更新。
- 磁盘空间：Cosmovisor 会在 `.inference/data` 目录中创建完整的状态备份。请确保有 250+ GB 的可用空间。
- Postgres：升级后可配置 Postgres 作为本地负载存储。

建议在升级后窗口期间监控节点状态并保持 Discord 通讯，以确保稳定性。

## 2026年1月28日

**如何切换至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、升级 ML 节点并移除其他模型？**

本指南说明主机应如何根据 v0.2.8 模型可用性变更以及即将到来的 PoC v2 更新来更新其 ML 节点。从 Epoch 155 开始观察 ML 节点配置是否符合 PoC v2 要求。建议主机在此之前审查并准备好 ML 节点配置。PoC v2 迁移可在 epoch 155 之后进行调度。迁移阶段结束后，不满足配置要求的 ML 节点的权重可能不会被计入。 

**1. 背景：模型可用性变更（升级 v0.2.8）**

作为 v0.2.8 升级的一部分，活跃模型集已更新。

**支持的模型（活跃集）**

仅以下模型仍受支持：

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `Qwen/Qwen3-32B-FP8`
  
`Qwen/Qwen3-32B-FP8` 在迁移期间受支持，但不计入 PoC v2 就绪状态或权重分配。参与 PoC v2 需要提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。

**已移除的模型**

所有此前支持的模型均已从活跃集中移除，不得继续提供服务。

**3. PoC v2 就绪标准（重要）**

成功参与 PoC v2 过渡需要同时满足以下两项条件：

- 您的所有 ML 节点均提供 Qwen/Qwen3-235B-A22B-Instruct-2507-FP8。这是唯一计入 PoC v2 权重的模型。
- 您的所有 ML 节点均已升级至兼容 PoC v2 的镜像：
    - ghcr.io/product-science/mlnode:3.0.12
    - ghcr.io/product-science/mlnode:3.0.12-blackwell

!!! note "重要"

    - 仅提供正确的模型而不升级 ML 节点是不够的。
    - 不满足上述两项条件的节点，在网络切换至单模型配置后将不具备资格。
    - ML 节点升级必须在迁移完成且 PoC v2 通过 v0.2.8 升级后的单独治理提案激活之前完成。
    - v0.2.8 升级本身不会启用 PoC v2。

**3. 检查 ML 节点分配状态（推荐的安全步骤）**

在更改模型之前，应检查当前 ML 节点的分配状态。查询您的网络节点管理 API：
```
curl http://127.0.0.1:9200/admin/v1/nodes
```
查找以下字段：
```
"timeslot_allocation": [
  true,
  false
]
```
解释：

- 第一个布尔值：节点是否在当前 epoch 中提供推理服务
- 第二个布尔值：节点是否计划在下一次 PoC 中提供推理服务

**推荐做法**

- 优先在第二个值为 `false` 的节点上更改模型
- 这可以在 PoC v2 行为仍在观察期间降低风险
- 建议跨多个 epoch 逐步推进

**4. 更新 ML 节点模型：仅保留支持的模型**

预下载模型权重（推荐）。为避免启动延迟，请将权重预下载至 `HF_HOME`：
```
mkdir -p $HF_HOME
huggingface-cli download Qwen/Qwen3-235B-A22B-Instruct-2507-FP8
```
使用 ML 节点管理 API 将 ML 节点切换至支持的模型（`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`）。

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
通过管理 API 应用的更改将在下一个 epoch 生效 [https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)

!!! note 

    `node-config.json` 仅在网络节点 API 首次启动或本地状态/数据库被移除时使用。如需全新重启请编辑该文件。对于现有节点，模型更新应通过管理 API 进行。 

**5. 升级 ML 节点镜像（PoC v2 必需）**

编辑 `docker-compose.mlnode.yml` 并更新 ML 节点镜像：

标准 GPU
```
image: ghcr.io/product-science/mlnode:3.0.12
```
NVIDIA Blackwell GPU
```
image: ghcr.io/product-science/mlnode:3.0.12-blackwell
```
应用更改并重启服务。从 `gonka/deploy/join` 目录执行：
```
source config.env
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml pull
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d
```

**6. 验证模型服务（在下一个 epoch 生效）**

确认 ML 节点仅提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`，这是唯一用于 PoC v2 权重和未来权重分配的模型：
```
curl http://127.0.0.1:8080/v1/models | jq
```
可选择重新检查节点分配：
```
curl http://127.0.0.1:9200/admin/v1/nodes
```

!!! note "治理与 PoC v2 激活说明"
    PoC v2 采用分阶段引入，而非一次性激活。

    **阶段 1：观察期（v0.2.8 后的当前状态）**
    
    v0.2.8 升级后，PoC v2 逻辑可用，但尚未用于权重分配。
    
    在此阶段：
    
    - 主机可以提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 或 `Qwen/Qwen3-32B-FP8`
    - 主机必须将其 ML 节点切换至提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 并升级至兼容 PoC v2 的版本，以便计入 PoC v2 权重。
    - 网络将观察采用情况，以评估主机是否准备好过渡到 PoC v2 权重。
    
    **阶段 2：治理提案（可选，未来）**
    
    一旦在活跃主机中观察到足够的采用水平（约 50%）：
    
    - 可能会提交一个单独的治理提案
    - 该提案可能请求批准激活 PoC v2 并使用 PoC v2 进行权重分配
    
    采用阈值仅供观察，不会触发任何自动更改。
    
    **阶段 3：激活（仅在治理批准后）**
    
    PoC v2 成为权重分配的活跃方法，仅在治理提案获得链上批准后生效。
    在该提案获批之前：
    
    - PoC v2 不会用于权重分配
    - 现有的 PoC 机制将继续用于确定权重

**总结清单**

在 PoC v2 激活之前，请确保：

- ML 节点提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 所有其他模型已从配置中移除
- ML 节点镜像为 3.0.12（或 3.0.12-blackwell）

## 2026年1月28日

v0.2.8 升级提案的链上治理流程即将结束。

**升级详情**

- 升级高度：区块 2387000
- 预计时间：2026年1月29日 06:30:00（UTC）

建议提前预下载二进制文件，以避免在升级窗口期间依赖 GitHub 的可用性。

```
# 1. 创建目录
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.8/bin \
              .inference/cosmovisor/upgrades/v0.2.8/bin && \

# 2. DAPI：下载 -> 校验 -> 直接解压至 bin -> 赋予可执行权限
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.8-post1/decentralized-api-amd64.zip" && \
echo "45f28afba4758e54988f61cc358f0ad683e7832ab121ccd54b684fe4c9381a75 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.8/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.8/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

# 3. Inference：下载 -> 校验 -> 直接解压至 bin -> 赋予可执行权限
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.8/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.8-post1/inferenced-amd64.zip" && \
echo "f0f2e3ee8760e40a78087c98c639a7518bf062138141ed4aec2120f5bc622a67 inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.8/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.8/bin/inferenced && \
echo "Inference Installed and Verified" && \

# 4. 清理与最终校验
rm decentralized-api.zip inferenced.zip && \
echo "--- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.8/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.8/bin/inferenced && \
echo "421a761f3a7037d72ee0bd8b3f50a744349f717439c7e0fee28c55948dae9a7c .dapi/cosmovisor/upgrades/v0.2.8/bin/decentralized-api" | sudo sha256sum --check && \
echo "308c63c7bda4fb668632ac3e13f3f6cccacf54c563c8e9fd473bcb48c7389fe0 .inference/cosmovisor/upgrades/v0.2.8/bin/inferenced" | sudo sha256sum --check
```

## 2026年1月27日

**v0.2.8 升级提案进入治理流程**

下一版本链上软件 v0.2.8 的升级提案现已在链上发布并开放投票！
您的审查和投票对于确保网络的稳定性和未来能力至关重要。

**v0.2.8 中的关键变更**

**PoC v2（核心升级）**

- 将 PoC 直接集成到 vLLM 中，实现从推理到 PoC 的即时切换，无需卸载模型或加载单独的 PoC 模型。
- 使用 MMR（Merkle Mountain Range）承诺将工件存储迁移至链下——链上仅记录 root_hash 和 count。
- 包含双模式迁移策略：V1 用于常规 PoC，V2 跟踪用于部署期间的确认型 PoC。

**模型可用性变更**

作为 v0.2.8 升级的一部分，支持的模型集已更新。除以下模型外，所有此前支持的模型均已从活跃集中移除：

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `Qwen/Qwen3-32B-FP8`
  
使用 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 成功参与 PoC v2，结合所需的 ML 节点版本，将用于评估 PoC v2 过渡的就绪状态。一旦在活跃主机中观察到足够的采用水平（约 50%），可能会提交一个单独的治理提案以批准并激活 PoC v2 用于权重分配。此阈值仅供观察，不会触发任何自动的网络变更。

在下一步网络变更通过治理批准后，网络将暂时仅支持 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。

**安全性、正确性和可靠性改进**

- SSRF 与 DoS：验证 InferenceUrl 以拒绝内部 IP，并添加超时以防止请求挂起。
- 投票篡改：通过拒绝重复项防止 PoC 验证被覆盖。
- PoC 排除：修复 getInferenceServingNodeIds 以正确排除推理服务节点。
- 身份验证绕过与重放：将 epochId 绑定到签名，并针对正确的 epoch 验证授权。

由于变更量较大，此处仅列出部分要点。其他更新和修复的完整列表可在 [GitHub pull request](https://github.com/gonka-ai/gonka/pull/539) 中查看。

**主机需采取的行动**

要参与 PoC v2 过渡，主机必须完成以下两个步骤：

- 确认您的 ML 节点已配置为提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 将 ML 节点升级至支持 PoC v2 的版本：
    - ghcr.io/product-science/mlnode:3.0.12
    - ghcr.io/product-science/mlnode:3.0.12-blackwell

仅提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 而不升级 ML 节点，不足以参与 PoC v2。在网络切换至单模型配置后，不满足上述两项条件的节点将不被视为具备 PoC v2 参与资格。ML 节点升级必须在 PoC v2 通过治理完全启用之前完成。

**如何投票**

您可以使用 `inferenced` 命令获取提案详情并投票。请注意，任何活跃节点均可用于查询或投票。当前可用的节点包括：

- [http://node1.gonka.ai:8000/](http://node1.gonka.ai:8000/)
- [http://node2.gonka.ai:8000/](http://node2.gonka.ai:8000/)
- [http://node3.gonka.ai:8000/](http://node3.gonka.ai:8000/)
- [https://node4.gonka.ai/](https://node4.gonka.ai/)
  
查看投票状态：
```
export NODE_URL=https://node4.gonka.ai/
./inferenced query gov votes 25 -o json --node $NODE_URL/chain-rpc/
```

投票（ `yes` 、 `no` 、 `abstain` 、 `no_with_veto` ）：
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

- 投票结束时间：2026年1月29日 03:02:20（UTC）
- 升级提议区块高度为 2387000。该区块的预计时间为 2026年1月29日 06:30:00（UTC）

如果您是主机，请查看并投票。

**注意事项 1：** 请计划在升级窗口期间保持在线，以便在需要时及时执行后续步骤或缓解措施。

**注意事项 2：** 升级期间，Cosmovisor 会在 `.inference/data` 目录中创建完整的状态备份。请确保有足够的磁盘空间。有关如何安全移除 `.inference` 目录中旧备份的说明，请参见[此处](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)。如果 `application.db` 占用大量磁盘空间，可使用[此处](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)描述的清理技术。

**注意：** 升级完成后，可配置 Postgres 作为本地负载存储。

## 2026年1月19日

**提案更新：稳定期延长已获批准**

关于延长稳定期的最新治理投票已成功通过。稳定期现已正式延长，以便进行更多测试和网络升级。

**主机需采取的行动**

随着延期确认，请利用这段时间为新的 PoC 要求做好环境准备。

- 模型更新：请将您的 ML 节点切换至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 模型。
- 逐步部署：如果您运营多个 ML 节点，建议在多个 epoch 中逐步完成这些更新。

**如何更新**

有关更新现有 ML 节点的说明，请参阅：[https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)

## 2026年1月16日

**稳定期延长**

当前有一项新的治理投票正在进行中。

该提案将当前的稳定期延长约两周。延长的时间将用于与即将到来的 PoC 变更及相关网络升级有关的额外测试。关于新的 PoC 开发进展的更多细节可参见此处：[https://github.com/gonka-ai/gonka/blob/gm/poc-status/proposals/governance-artifacts/poc-update-status.md](https://github.com/gonka-ai/gonka/blob/gm/poc-status/proposals/governance-artifacts/poc-update-status.md)。

此次延长也为主机提供了时间，以便为新的 PoC 要求准备其部署环境，包括将其 ML 节点切换到 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 模型。有关更新现有 ML 节点的说明请参见：[https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)。运行多个 ML 节点的主机建议在多个 epoch 中逐步完成更新。

**投票范围**

如果提案获得通过，网络将在临时期间继续按照现有的 `allowlist` 运行（该列表由未表现出非标准硬件行为的主机组成）。 

开发者 `allowlist` 将按相同的时间偏移进行延长，并持续有效至区块 2459375。

未被纳入 `allowlist` 的主机在延长的稳定期内仍将无法参与 PoC，该稳定期将于区块 2443558 结束。

**可复现性与方法论**

`allowlist`：

- 可在此处获取：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)
- 基于公开可观察的链上数据生成，并使用一组预定义的硬件配置模式。这些模式通过开源脚本进行评估，脚本地址为：[https://github.com/product-science/filter](https://github.com/product-science/filter)

**执行特性**

- 若提案获批，`allowlist` 将自动延长。
- 无需进行软件升级。
- 如需进一步调整，仍需通过治理流程决定。

**稳定期结束后**

`allowlist` 具有固定的到期时间，不会在延长的稳定期结束后继续生效。当 `allowlist` 于区块 2443558 到期后：

- 网络将恢复到稳定期之前生效的标准参与规则，或
- 任何替代配置都必须通过单独的治理决议来定义。

**如何投票**

您可以使用 `inferenced` 命令获取提案详情并进行投票。

请注意，任何正在运行的节点都可用于查询或投票。当前可用的节点包括：

- http://node1.gonka.ai:8000/ 
- http://node2.gonka.ai:8000/
- http://node3.gonka.ai:8000/ 
- https://node4.gonka.ai/ 

查询投票状态：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 22 -o json --node $NODE_URL/chain-rpc/
```

进行投票（ `yes` 、 `no` 、 `abstain` 、 `no_with_veto` ）：
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

该流程完全通过治理机制处理，不需要进行软件升级。

**时间线与截止时间**

投票结束时间：2026年1月18日 05:28:01（UTC）

`Allowlist` 到期时间：在区块 2443558 自动到期。

## 2026年1月10日

**临时参与者 `allowlist` 修正**

目前一项新的治理投票已开启。本提案通过将若干地址加入 [allowlist](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)，修复了现有过滤逻辑中的一个边缘问题：这些地址此前因硬件名称为空、且 ML 节点权重为 0，而被错误地过滤。该提案还将少量开发者账户加入允许的开发者列表，并将 `allowlist` 的过期时间与参与者注册截止区块高度 2,222,222 保持一致。
所有参与相关逻辑均保持不变。本提案仅用于修复当前过滤逻辑中的一处轻微问题。

**可复现性与方法论**

`allowlist` 基于公开可观察的链上数据生成，并使用一组预定义的硬件配置模式进行筛选。这些模式通过以下开源脚本进行评估：[https://github.com/product-science/filter](https://github.com/product-science/filter) 

`allowlist` 文件地址如下：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv) 

**如何投票**

您可以使用 `inferenced` 命令获取提案详情并进行投票。

请注意：任何正在运行的节点均可用于查询或投票。目前可用的节点包括：

- http://node1.gonka.ai:8000/
- http://node3.gonka.ai:8000/
- https://node4.gonka.ai/
  
查看投票状态：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 21 -o json --node $NODE_URL/chain-rpc/
```

进行投票（ `yes` 、 `no` 、 `abstain` 、 `no_with_veto` ）：
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

**投票完成后的后续步骤**

本流程完全通过链上治理完成，不需要进行任何软件升级。

**时间安排与截止节点**

投票结束时间：2026年1月12日 06:04:14（UTC）

`Allowlist` 过期时间：将在区块高度 2,222,222 时自动失效。

## 2026年1月10日

**临时参与者 `allowlist` 已通过，于 Epoch 135 生效**

针对稳定期设置的临时参与者 `allowlist` 的链上治理投票已正式结束。

该提案已获通过。本提案定义了一份临时 `allowlist`，用于反映在最近多个 epoch 中行为保持一致的参与者。

**当前已生效的关键调整**

1）网络将启用一份由以下条件筛选出的参与者组成的 `allowlist`。这些参与者在多个 epoch 中：
   
- 上报的硬件特征符合常见的配置模式（被过滤的非标准配置字符串列表见此处：[https://github.com/product-science/filter/blob/main/filter_strings.txt](https://github.com/product-science/filter/blob/main/filter_strings.txt)）
- 所展示的 PoC 权重不超过同类硬件观测权重的 150%
  
2）此前持续偏离上述模式的参与者，将在稳定窗口结束（区块高度 2,222,222）之前被暂时排除在 `allowlist` 之外。

**执行特性说明**

- `allowlist` 将从下一个 epoch（Epoch 135）开始生效
- 激活时点为 Epoch 135 的首次 PoC
- 无需进行任何软件升级
- 自激活起，`allowlist` 将持续生效，直至并包含区块高度 2,222,222

**可复现性与方法论**

- `allowlist` 完全基于公开可观察的链上数据生成
- 硬件描述信息通过开源脚本，与一组预定义的配置模式进行比对与评估：[https://github.com/product-science/filter](https://github.com/product-science/filter) 
- 最终生成的 `allowlist` 已发布于以下地址：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)

**后续步骤**

节点主机无需采取任何操作。

## 2026年1月8日

**行动刻不容缓：稳定期临时参与者 `allowlist` 治理投票现已开启**

在成功采用修复 PoC 相关共识故障的补丁之后，一项新的治理投票现已正式激活。

随着正常区块生产恢复，网络将在进一步扩容之前进入一个短暂的稳定期。

本次投票旨在为稳定期定义一份参与者 `allowlist`（[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)），该名单反映了一组在此前运行过程中，其行为始终符合网络预期的参与者。

**投票范围**

若提案通过，网络将在稳定期内基于 `allowlist` 临时运行。该名单由在过往多个 epoch 中未表现出非标准硬件行为的参与者组成。在实际评估中，`allowlist` 对应的是这样一组参与者，其在多个 epoch 中同时满足以下条件：

- 其上报的硬件特征将与一组预定义、常见的硬件配置模式进行比对，用于识别偏差与不一致（用于排除参与者的非标准硬件配置字符串的完整且明确列表见此处：[https://github.com/product-science/filter/blob/main/filter_strings.txt](https://github.com/product-science/filter/blob/main/filter_strings.txt)），且
- 其观测到的 PoC 权重不得超过使用可比硬件的其他参与者所展示权重的 150%。
此前持续表现出与上述模式存在偏差的参与者，将在稳定期结束（区块 2222222）之前被明确排除在 `allowlist` 之外。

**可复现性与方法论**

`allowlist` 完全基于公开、可观测的链上数据生成，并通过一组预定义的硬件配置模式推导而来。这些模式通过开源脚本进行评估，脚本可在此处获取：[https://github.com/product-science/filter](https://github.com/product-science/filter)

`allowlist` 名单可在此处查看：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)

**执行特性**

- 若提案通过，`allowlist` 将自动生效。
- 无需进行任何软件升级。
- `allowlist` 将在投票成功后、区块 2089140 对应的下一次 PoC 执行完成后激活。
- 自激活起，`allowlist` 将持续生效，直至并包含区块 2222222。
- 如需进一步调整，仍需通过治理流程决定。

**稳定期结束之后**

`allowlist` 设定了固定的到期时间，不会在稳定期结束后继续生效。当 `allowlist` 于区块 2222222 到期后：

- 网络要么恢复至稳定期之前生效的标准参与规则，
- 要么任何替代性配置均需通过单独的治理提案加以定义。

**如何投票**

可使用 `inferenced` 命令查询提案详情并提交投票。
请注意：任一在线节点均可用于查询或投票。当前可用节点包括：

- http://node1.gonka.ai:8000/
- http://node2.gonka.ai:8000/
- https://node4.gonka.ai/

查看投票状态：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 20 -o json --node $NODE_URL/chain-rpc/
```

提交投票（ `yes` 、 `no` 、 `abstain` 、 `no_with_veto` ）：
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

整个流程将完全通过治理机制处理，无需进行任何软件升级。

**时间线与截止时间**

- 投票结束时间：2026年1月10日 06:46:52（UTC）
- `Allowlist` 激活时间：区块 2089140 对应的下一次 PoC 执行后
- `Allowlist` 失效时间：区块 2222222 自动失效
  
如您是主机，请审阅该治理提案并积极参与投票。

## 2026年1月8日

**网络更新 — 共识已恢复**

在补丁完成部署之后，网络共识已恢复稳定，目前已在正常参数范围内运行。

## 2026年1月8日

**网络更新 — 补丁已准备就绪，可部署**

用于解决在 PoC 期间观察到的共识故障的补丁现已可用。

[指引](https://gonka.ai/FAQ/#upgrade-v027)

为恢复可靠的共识推进，需要**至少 67%** 的活跃网络算力完成补丁安装。

在达到该阈值之前，共识推进可能仍处于不稳定状态。

**鼓励主机尽快应用补丁，并在升级完成后保持节点在线。
如有需要，将发布进一步指引。**

## 2026年1月8日

**网络更新 — 后续说明**

用于解决近期共识问题的补丁已准备就绪，详细部署指引将很快发布。
每一位活跃主机的参与对于网络继续推进并恢复正常运行都至关重要。请保持节点在线，并在指引发布后准备好应用更新。

## 2026年1月8日

**网络更新 — PoC 期间出现共识故障**

在计算证明（Proof-of-Compute，PoC）过程中，网络出现了共识故障。
问题已被识别，用于解决根本原因的补丁正在准备中。后续操作说明和技术细节将很快发布。
建议主机保持在线并持续关注更新，在补丁发布后可能需要执行进一步操作。

## 2026年1月8日

**v0.2.7 升级提案：创世验证者增强机制已在主网上线**

链上治理对 v0.2.7 升级提案：创世验证者增强（Genesis Validator Enhancement）的投票已结束；该提案已获批准并成功部署至主网。

**现已生效的关键变更：**


**创世验证者增强（临时）**

- 临时重新启用创世验证者增强机制——该机制是一项此前使用过、具有明确时效性的防御性机制，本次提案建议重新启用。
- 用于网络增长阶段的共识保护。在其此前运行期间：
    - 三个 Guardian 验证者合计持有约 34% 的共识投票权
    - 未向 Guardian 验证者提供任何额外奖励
    - 该配置在边缘情形下有效防止了共识停滞
- 当同时满足以下两个条件时，创世验证者增强机制将自动停用：
    - 全网算力达到 15,000,000
    - 区块高度达到 3,000,000

**协议稳定性修复（全网范围）**

本次升级正式纳入此前通过手动 API 更新分发、且已在网络中实际使用的一系列关键修复。这些修复包括：

- 修复失败推理请求的错误记账问题（包括处理了不受支持格式的请求但未被标记为完成的情形） 
- 提升网络在失败推理处理方面的鲁棒性
- 为 `PoCBatch` 和 `PoCValidation` 交易引入批处理机制 

通过将上述修复纳入本次升级，其行为将成为协议级规则，并在全网范围内一致执行。

**临时参与与执行限制**

- 主机级注册：新主机注册将暂停至区块 2,222,222（约两周后）。该措施旨在稳定网络状态并为进一步扩展做好准备。 
- 开发者级注册：在稳定期内，新开发者地址注册将被暂停。一份预定义的开发者地址 `allowlist` 将立即生效。`allowlist` 中的开发者地址在此期间可以执行推理任务。所有适用于开发者地址的限制（包括注册与推理执行）将持续生效至区块 2,294,222（约 19 天）。

**治理可控机制** 

本次升级包含的预备性改动，使得未来可通过治理机制来控制参与者接入与推理执行，而无需额外的软件升级。本提案本身并未启用任何由治理触发的限制措施，任何此类约束均需通过后续单独的治理投票决定。

**第 117 轮奖励分配**

本提案涵盖与链暂停（第 117 轮）相关的两项奖励分配：

- 在第 117 轮期间保持活跃但未收到该轮奖励的节点，将获得该轮奖励的补发。
- 所有在第 117 轮期间保持活跃的节点，将额外获得一笔等同于第 117 轮奖励 1.083 倍的补发，该补发将统一适用于所有符合条件的节点，包括已收到原始奖励的节点。

**关于持续时间与执行**

本次升级中重新启用或引入的所有保护机制均为临时措施，并且在满足条件后将自动移除，无需人工治理干预。

**后续步骤：**

- 主机无需采取任何进一步操作。
- Cosmovisor 在执行更新时，会在 `.inference` 状态目录中创建完整备份。为安全执行更新，建议预留 250 GB 以上的可用磁盘空间。请参阅[此处](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)了解如何安全清理 `.inference` 目录中的旧备份。

**备注：**

- 创世验证者增强机制的完整技术细节：
[https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)
- 完整技术评审（GitHub PR）：[https://github.com/gonka-ai/gonka/pull/503](https://github.com/gonka-ai/gonka/pull/503)  

## 2026年1月7日

**v0.2.7** 版本升级提案已通过链上治理批准。

**升级详情**

- 升级高度：区块 2,054,000
- 预计时间：2026年1月8日 08:10:00（UTC）

为避免在升级窗口期间依赖 GitHub 的可用性，建议提前预下载相关二进制文件。

```
# 1. 创建目录
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.7/bin \
              .inference/cosmovisor/upgrades/v0.2.7/bin && \

# 2. DAPI：下载 -> 校验 -> 直接解压至 bin -> 赋予可执行权限
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.7/decentralized-api-amd64.zip" && \
echo "03555ba60431e72bd01fe1fb1812a211828331f5767ad78316fdd1bcca0e2d52 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.7/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

# 3. Inference：下载 -> 校验 -> 直接解压至 bin -> 赋予可执行权限
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.7/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.7/inferenced-amd64.zip" && \
echo "b7c9034a2a4e1b2fdd525bd45aa32540129c55176fd7a223a1e13a7e177b3246 inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.7/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced && \
echo "Inference Installed and Verified" && \

# 4. 清理与最终校验
rm decentralized-api.zip inferenced.zip && \
echo "--- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced && \
echo "d07e97c946ba00194dfabeaf0098219031664dace999416658c57b760b470a74 .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api" | sudo sha256sum --check && \
echo "09c0e06f7971be87ab00fb08fc10e21ff86f9dff6fc80d82529991aa631cd0a9 .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced" | sudo sha256sum --check
```
当所有命令均无错误完成，并显示确认信息时，即可视为二进制已成功安装。
```
Inference Installed and Verified
--- Final Verification ---
-rwxr-xr-x 1 root root 224376384 Jan  1  2000 .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api
-rwxr-xr-x 1 root root 215172352 Jan  1  2000 .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced
.dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api: OK
.inference/cosmovisor/upgrades/v0.2.7/bin/inferenced: OK
```

**注意事项**

- 请在升级窗口前后保持节点在线，以便在出现问题时及时按照指引进行处理。
- Cosmovisor 在升级过程中会对 `.inference/data` 目录创建完整备份。请确保磁盘空间充足。若磁盘占用较高，可[安全删除](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory) `.inference` 目录中的旧备份。
- 较大的 `application.db` 文件可通过[此处方法](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)进行缩减。

**可选项：跳过 Cosmovisor 自动备份**

Cosmovisor 支持在升级时通过为 `node` 容器设置环境变量 `UNSAFE_SKIP_BACKUP=true` 来跳过自动状态备份。

此选项可能减少磁盘占用并缩短升级时间。但请注意：若升级失败，将没有任何备份可用于恢复此前状态。

## 2026年1月7日

**主机重要提示**

在 Cosmovisor 升级过程中，可选择通过为 `node` 容器设置 `UNSAFE_SKIP_BACKUP=true` 来跳过自动备份。
该选项具有明确风险——一旦升级失败，将无法依赖备份进行状态恢复。

## 2026年1月6日

**v0.2.7 升级提案：创世验证者增强机制进入治理阶段**

一项与创世验证者增强机制（Genesis Validator Enhancement）相关的链上治理提案已发布，目前已进入投票阶段。

近期网络规模的快速增长带来了新的运行压力。过去数日内，网络出现了多起问题，其中部分表现为在高负载或异常条件下对系统稳定性的冲击。本提案旨在通过一组临时性措施，在当前网络条件下提升整体韧性与稳定性。

创世验证者增强最初在网络早期阶段作为临时防御机制引入，并在网络运行的前两个月处于启用状态。本次进入治理的提案，拟在当前网络环境下临时重新启用该既有机制，并同时启用若干附加的保护措施。

**关键变更**

**创世验证者增强机制（临时）**

- 临时重新启用创世验证者增强机制——该机制为此前使用过的、具有明确期限的防御措施。
- 在网络增长阶段提供额外的共识保护。在其此前启用期间：
    - 三个 Guardian 验证者合计持有约 34% 的共识投票权
    - Guardian 验证者未获得任何额外奖励
    - 该配置在部分边缘情况下有助于避免共识停滞
- 当同时满足以下两个条件时，创世验证者增强将自动停用：
    - 全网算力达到 15,000,000
    - 区块高度达到 3,000,000

**协议稳定性修复（全网范围）**

本次升级将正式纳入此前通过手动 API 更新分发、且目前已在网络中实际使用的一组关键修复，包括：

- 修正失败推理请求的错误记账问题（包括：处理了不受支持格式的请求，但未被正确标记为完成的情形） 
- 提升失败推理处理流程的整体稳定性
- 为 `PoCBatch` 与 `PoCValidation` 交易引入批处理机制 

将上述修复纳入协议后，其行为将作为协议级规则，在全网范围内保持一致执行。

**临时参与与执行限制**

- 主机级注册限制：新主机注册将暂停至区块 2,222,222（约两周后）。该措施旨在稳定当前网络状态，并为后续扩展做好准备。 
- 开发者级注册与执行限制：新开发者地址注册将在稳定期内暂停。一份预定义的开发者地址白名单（`allowlist`）将立即生效。白名单内的开发者地址在此期间可继续执行推理。所有适用于开发者地址的限制（包括注册与推理执行）将持续至区块 2,294,222（约 19 天）。

**治理可控机制** 

本次升级包含若干预备性改动，使未来可通过治理方式控制参与者接入与推理执行，而无需再次进行软件升级。本提案本身不会启用任何新的治理触发型限制，相关功能需通过后续治理投票单独激活。

**第 117 轮奖励分配**

本提案涵盖与链暂停期间（第 117 轮）相关的两项奖励分配：

- 在第 117 轮期间处于活跃状态但未收到该轮奖励的节点，将补发该轮奖励。
- 所有在第 117 轮期间处于活跃状态的节点，将获得一次额外奖励，金额为 1.083 × 第 117 轮奖励，该补发将统一适用于所有符合条件的节点，包括已领取原始奖励的节点。

**关于持续时间与执行**

本次升级中重新启用或引入的所有保护措施均为临时性机制，并将在满足既定条件后自动失效，无需额外的人工治理干预。

**如何投票**

可使用 `inferenced` 命令获取提案详情并提交投票。

查看投票状态：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 19 -o json --node $NODE_URL/chain-rpc/
```

提交投票（ `yes` 、 `no` 、 `abstain` 、 `no_with_veto` ）：
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

**时间线与关键节点**

- 投票结束时间：2026年1月8日 04:23:14（UTC）
- 升级提议区块高度：2,054,000
- 预计升级时间：2026年1月8日 08:10:00（UTC）

**主机注意事项**

**注意事项 1**

请主机审阅提案并参与投票。在升级窗口前后保持在线，以便在出现问题时及时按照指引操作。

**注意事项 2**

Cosmovisor 在执行升级时会在 `.inference/data` 状态目录创建完整备份。请确保磁盘空间充足。如磁盘占用较高，可[安全清理](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory) `.inference` 目录中的旧备份。
若 `application.db` 文件体积较大，可使用[此处方法](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)进行清理。

**参考资料**

创世验证者增强机制完整技术说明：
[https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)

完整技术评审（GitHub PR）：[https://github.com/gonka-ai/gonka/pull/503](https://github.com/gonka-ai/gonka/pull/503)  

## 2026年1月5日

近期我们在网络运行监控中发现，部分时段的推理（Inference）请求丢失率高于正常水平。
在多数情况下，该问题由一个已知 Bug 导致：当推理请求使用了当前版本尚不支持的请求格式时，即使该请求已被成功处理，系统也未能将其正确标记为「已完成」。以下更新修复了该行为。

参阅：[https://github.com/gonka-ai/gonka/pull/517](https://github.com/gonka-ai/gonka/pull/517) 

本次 `API` 版本提升了失败推理处理方面的稳定性，并减少了推理丢失的统计问题。同时还引入了对 PoCBatch 与 PoCValidation 交易的批量处理支持。

**升级时机说明**

当确认型 PoC（Confirmation PoC）未激活时，可安全进行本次更新。

可通过以下命令验证当前网络状态：
```
curl "http://136.243.34.19:8000/v1/epochs/latest" | jq '.is_confirmation_poc_active'
```
在非确认型 PoC 阶段，该字段应返回 `false`。

**安装**

下载并安装新的二进制文件，然后重启 `API` 容器：
```
# 下载二进制文件
sudo rm -rf decentralized-api.zip .dapi/cosmovisor/upgrades/v0.2.6-post12/ .dapi/data/upgrade-info.json
sudo mkdir -p  .dapi/cosmovisor/upgrades/v0.2.6-post12/bin/
wget -q -O  decentralized-api.zip 'https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.6-post12/decentralized-api-amd64.zip' && \
echo "f0d1172a90ca4653035e964abe4045f049d03d6060d6519742110e181b1b2257  decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j  decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.6-post12/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.6-post12/bin/decentralized-api && \
echo "API Installed and Verified"


# 链接二进制文件
echo "--- Final Verification ---" && \
sudo rm -rf .dapi/cosmovisor/current
sudo ln -sf upgrades/v0.2.6-post12 .dapi/cosmovisor/current
echo "4672a39c3a3a0a2c21464c227a3f36e9ebf096ecc872bf9584ad3ea632752a3e .dapi/cosmovisor/current/bin/decentralized-api" | sudo sha256sum --check && \


# 重启 
source config.env && docker compose up api --no-deps --force-recreate -d
```
