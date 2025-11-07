# 主机节点快速入门

本指南介绍如何以主机身份加入网络。您需要部署以下两项服务，我们将以Docker容器形式在同一台机器上完成部署。

前提条件：确保您已准备好满足要求的GPU硬件。

部署流程：

- 部署网络节点. 首先，您需要部署网络节点。该节点包含两个进程：

    - 链节点：用于连接区块链。
    - API 节点：用于处理用户请求。

- 部署推理节点. 接着，部署至少一个推理节点。该节点将在您的GPU上执行大语言模型推理任务。

注意：本指南默认每台主机仅运行一个推理节点。

## 先决条件
本节为参与 Gonka 网络上线所需的硬件基础设施提供配置指导。目标是使你的部署与网络预期对齐，从而最大化协议奖励。

### 支持的模型类别
当前协议支持以下模型类别：

- 大模型（Large）— `DeepSeek R1`、`Qwen3-235B`、`gpt-oss-120b`
- 中模型（Medium）— `Qwen3-32B`、`Gemma-3-27b-it`

!!! note "治理与模型分类"
    - 各类别的具体部署参数由创世配置（genesis）定义。
    - 若经治理通过，模型可被归入某一分类。
    - 是否新增/变更支持的模型由治理决定。
    - 有关治理流程与如何提议新模型，参见「[交易与治理指南](https://gonka.ai/transactions-and-governance/)」。

### 最优奖励的配置建议
为获取最高奖励并保持可靠性，每个网络节点建议同时服务三类模型，且每类至少配置 2 个 ML 节点。此配置将：

- 提升协议层面的冗余与容错
- 增强模型层面的验证性能
- 与后续奖励缩放逻辑保持一致

### 推荐硬件配置
要运行有效节点，你需要具有[受支持 GPU](/host/hardware-specifications/) 的机器。建议将硬件分组为 2–5 个网络节点，每个网络节点同时支持全部模型类别。参考布局如下：

| 模型类别 | 模型名称 | ML 节点数（最少） | 示例硬件 | 每个节点所需的最小显存容量 |
|---------|----------|------------------|----------|--------|
| 大（Large） | `DeepSeek R1` / `Qwen3-235B` | ≥ 2 | 每个 ML 节点 8× H200 | 640 GB |
| 中（Medium） | `Qwen3-32B` / `Gemma-3-27B-it` | ≥ 2 | 每个 ML 节点 4× A100 或 2× H100 | 80 GB |

这是一个参考架构。你可以根据需要调整节点数量或硬件分配，但我们建议遵循核心原则：每个节点都应在两个模型类别中支持多个 ML 节点。

更多关于最优部署配置的细节见[此处](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/)。

网络节点所在服务器建议具备：

- 16 核 CPU（amd64）
- 64 GB 及以上内存
- 1TB NVMe SSD
- 至少 100Mbps 网络（推荐 1Gbps）

最终需求取决于连接的 ML 节点数量与其总体吞吐。

每台用于部署 ML 节点的服务器建议具备：

- 系统内存 ≥ GPU 显存的 1.5 倍
- 16 核 CPU（网络节点与 ML 节点可同机部署）
- 已安装并配置 NVIDIA Container Toolkit，CUDA Toolkit 版本介于 12.6 与 12.9；可通过 `nvidia-smi` 检查

### 对公网开放的端口

- 5000 — Tendermint P2P 通信
- 26657 — Tendermint RPC（链上查询、广播交易）
- 8000 — 应用服务端口（可配置）

## 配置你的网络节点（Network Node）

### 密钥管理概览
在配置网络节点之前，需要先完成加密密钥的设置以确保安全运行。  
**建议在生产环境上线前阅读「[密钥管理指南](/host/key-management/)」。**

我们使用三密钥体系：

- 账户密钥（Account Key，冷钱包）：在本地安全设备上创建，用于高价值或关键操作。
- 共识密钥（Consensus Key，TMKMS 暖存储）：由安全的 TMKMS 服务托管，用于区块验证和参与网络共识。
- ML 运营密钥（ML Operational Key，暖钱包）：在服务器上创建，用于自动化 AI 工作负载交易。

### 【本地】安装 CLI 工具
`inferenced` CLI 用于本地账户管理与网络操作。可创建/管理 Gonka 账户、注册主机并执行多种网络操作。

从 [GitHub Releases](https://github.com/gonka-ai/gonka/releases) 下载最新版 `inferenced`，并赋予可执行权限：

```bash
chmod +x inferenced
./inferenced --help
```

!!! note "macOS 用户"
    在 macOS 上，若被系统拦截，可在「系统设置」→「隐私与安全」中，找到对 `inferenced` 的安全提示并点击「仍然允许」。

### 【本地】创建账户密钥
**重要：在本地安全机器上执行（不要在服务器上）**

??? note "关于账户密钥（冷密钥）"
    账户密钥是您的主要高权限密钥。它在本地创建，永远不会存储在服务器上。
    
    - 控制：主密钥，拥有对所有其他密钥的授权权限
    - 安全：必须离线保存于安全、隔离的设备上
    - 用途：仅用于授权操作和验证者注册
    - 恢复：由助记词保护——一旦丢失，所有访问权限将永久失效

使用 `file` keyring 后端（也可在支持平台使用 `os` 后端以提升安全性）创建账户密钥：

```bash
./inferenced keys add gonka-account-key --keyring-backend file
```

CLI 将提示你设置口令并展示生成的密钥对信息：
```
❯ ./inferenced keys add gonka-account-key --keyring-backend file
Enter keyring passphrase (attempt 1/3):
Re-enter keyring passphrase:

- address: gonka1rk52j24xj9ej87jas4zqpvjuhrgpnd7h3feqmm
  name: gonka-account-key
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"Au+a3CpMj6nqFV6d0tUlVajCTkOP3cxKnps+1/lMv5zY"}'
  type: local


**重要** 请妥善抄写并保存助记词。
若遗忘口令，这是找回账户的唯一方式。

pyramid sweet dumb critic lamp various remove token talent drink announce tiny lab follow blind awful expire wasp flavor very pair tell next cable
```

**关键提醒**：将助记词抄写并离线安全保存。这是找回账户密钥的**唯一**方式。

!!! info "硬件钱包支持"
    **当前状态**：网络启动阶段暂不支持硬件钱包。
    
    **目前建议**：将账户密钥保存在安全、尽量离线且加密良好的专用机器上。
    
    **注意**：无论未来是否支持硬件钱包，都应保留助记词备份。

## 【服务器】下载部署文件
克隆基础部署脚本：

```bash
git clone https://github.com/gonka-ai/gonka.git -b main && \
cd gonka/deploy/join
```

复制 `config` 模板：
```
cp config.env.template config.env
```

克隆后可见关键配置文件：

| 文件 | 说明 |
|------|------|
| `config.env` | 网络节点的环境变量配置 |
| `docker-compose.yml` | 启动网络节点的 Docker Compose 文件 |
| `docker-compose.mlnode.yml` | 启动 ML 节点的 Docker Compose 文件 |
| `node-config.json` | 网络节点使用的配置，描述该节点所管理的推理节点 |

更多最优部署配置细节请参考[此处](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/)。

!!! note
    当前网络支持以下模型：`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` and `Qwen/Qwen3-32B-FP8`。是否新增或修改支持模型由治理决定；治理流程与提案方式详见「[交易与治理指南](https://gonka.ai/transactions-and-governance/)」。

### 【服务器】编辑网络节点配置

!!! note "config.env"
    ```
    export KEY_NAME=<FILLIN>                                   # 按下文说明修改
    export KEYRING_PASSWORD=<FILLIN>                           # 按下文说明修改
    export API_PORT=8000                                       # 按下文说明修改
    export PUBLIC_URL=http://<HOST>:<PORT>                     # 按下文说明修改
    export P2P_EXTERNAL_ADDRESS=tcp://<HOST>:<PORT>            # 按下文说明修改
    export ACCOUNT_PUBKEY=<ACCOUNT_PUBKEY_FROM_STEP_ABOVE>     # 使用上文创建的账户公钥（不带引号）
    export NODE_CONFIG=./node-config.json                      # 保持不变
    export HF_HOME=/mnt/shared                                 # 你的模型缓存目录
    export SEED_API_URL=http://node2.gonka.ai:8000             # 保持不变
    export SEED_NODE_RPC_URL=http://node2.gonka.ai:26657       # 保持不变
    export SEED_NODE_P2P_URL=tcp://node2.gonka.ai:5000         # 保持不变
    export DAPI_API__POC_CALLBACK_URL=http://api:9100          # 保持不变
    export DAPI_CHAIN_NODE__URL=http://node:26657              # 保持不变
    export DAPI_CHAIN_NODE__P2P_URL=http://node:26656          # 保持不变
    export RPC_SERVER_URL_1=http://node1.gonka.ai:26657        # 保持不变
    export RPC_SERVER_URL_2=http://node2.gonka.ai:26657        # 保持不变
    export PORT=8080                                           # 保持不变
    export INFERENCE_PORT=5050                                 # 保持不变
    export KEYRING_BACKEND=file                                # 保持不变
    ```

需要修改的变量：

| 变量 | 操作说明 |
|------|----------|
| `KEY_NAME` | 手动指定节点的唯一标识符 |
| `KEYRING_PASSWORD` | 设置用于加密服务器上 `file` keyring 中 ML 运营密钥的口令 |
| `API_PORT` | 设置该节点在机器上的服务端口（默认 8000） |
| `PUBLIC_URL` | 指定节点对外可访问的 `Public URL`（如 `http://<your-static-ip>:<port>`，映射到 0.0.0.0:8000） |
| `P2P_EXTERNAL_ADDRESS` | 指定对外 P2P 连接的地址（如 `http://<your-static-ip>:<port1>`，映射到 0.0.0.0:5000） |
| `HF_HOME` | 设置 Hugging Face 模型缓存目录（如 `~/hf-cache`） |
| `ACCOUNT_PUBKEY` | 使用上文创建的账户密钥的公钥（`"key":` 后的值，不含引号） |

其他变量保持默认即可。

**加载配置：**
```bash
source config.env
```

!!! note "环境变量的使用"
    下面示例会在本地与服务器命令中引用这些环境变量（如 `$PUBLIC_URL`、`$ACCOUNT_PUBKEY`、`$SEED_API_URL`）。请在每个将要执行命令的终端会话中运行一次 `source config.env`。

### 【服务器】预下载模型权重到 Hugging Face 缓存（HF_HOME）
推理节点会从 Hugging Face 下载模型权重。为确保推理时模型已就绪，建议在部署前预下载：

```bash
mkdir -p $HF_HOME
huggingface-cli download Qwen/Qwen3-32B-FP8
```

## 【服务器】启动节点
该快速开始指南默认在单机上同时运行网络节点与推理节点。

??? note "多机/多节点部署"
    若你需要部署多台 GPU 服务器，请参考更详细的「[多节点部署指南](https://gonka.ai/host/multiple-nodes/)」。无论推理节点是单机还是跨多台服务器（乃至跨地域），所有推理节点都必须连接到同一个网络节点。
    
### 1.【服务器】拉取 Docker 镜像
确保当前目录为 `gonka/deploy/join`：
```bash
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml pull
```

### 2.【服务器】启动初始化服务
先启动完成密钥配置所需的核心服务（暂不启动 API）：

```bash
source config.env && \
docker compose up tmkms node -d --no-deps
```

我们先启动这些容器，因为：

- **`tmkms`**：生成并安全管理用于验证者注册的共识密钥（Consensus Key）
- **`node`**：连接区块链并提供 RPC 端点以获取共识密钥
- **`api`**：此阶段暂不启动，因为下一步需要在该容器内创建 ML 运营密钥

!!! note "建议"
    可通过日志验证初始化服务是否成功：
    
    ```bash
    docker compose logs tmkms node -f
    ```
    
    若看到链节点持续处理区块事件，则说明运行正常。

??? note "关于共识密钥（Consensus Key）"
    - 控制：由安全的 TMKMS 服务托管
    - 安全：采用暖存储机制，并具备防止双重签名的保护措施
    - 用途：用于区块验证及参与网络共识
    - 恢复：可由账户密钥（Account Key）或授权代表进行轮换
    
    在注册命令的第 [3.2](https://gonka.ai/zh/host/quickstart/#32host) 步（`inferenced register-new-participant`）中，共识密钥会在链上与您的账户密钥（冷密钥）进行绑定，从而使您的节点成为网络中的有效参与者。
    
    如果您删除或覆盖了 .tmkms 文件夹，您的共识密钥将会丢失。该密钥用于将您的节点与区块链的验证者集合（validator set）关联。一旦 .tmkms 被删除，您必须从头重新执行整个设置流程，包括通过 tmkms 生成新的共识密钥（[参见常见问题页面中的“我清除了或覆盖了我的共识密钥”一节](https://gonka.ai/zh/FAQ/#_14)）。

### 3. 完成密钥配置并注册主机（Host）

现在需要创建暖密钥、注册主机，并授予权限：

#### 3.1.【服务器】创建 ML 运营密钥

??? note "关于 ML 运营密钥（暖密钥）"

    - 控制：由账户密钥（Account Key）授权，用于特定的机器学习交易
    - 安全：以加密文件形式存储在服务器上，通过程序化方式访问
    - 用途：用于自动化交易（推理请求、证明提交、奖励发放）
    - 恢复：可由账户密钥随时轮换或撤销
    
    该密钥需要保持持续可用性，因此除非必要，请勿删除或更换。

在 `api` 容器内使用 `file` keyring 后端创建暖密钥（便于程序化访问）。密钥将存储在映射到容器 `/root/.inference` 的持久卷中：
```bash
docker compose run --rm --no-deps -it api /bin/sh
```

在容器内执行：
```bash
printf '%s\n%s\n' "$KEYRING_PASSWORD" "$KEYRING_PASSWORD" | inferenced keys add "$KEY_NAME" --keyring-backend file
```

!!! note "重要提示"

    请勿重复运行此命令。
    ML 运营密钥（暖密钥）在每台服务器上仅生成一次，必须在重启后保持完整。
    
    如果您不小心删除或重新初始化了该密钥，请参考常见问题（FAQ）中的恢复指南：“[我删除了暖密钥](https://gonka.ai/zh/FAQ/#_15)”。
    
    在重新启动节点时，请完全跳过此步骤 —— 该密钥已生成并持久存储在 API 容器内。

**示例输出：**
```
~ # printf '%s\n%s\n' "$KEYRING_PASSWORD" "$KEYRING_PASSWORD" | inferenced keys add "$KEY_NAME" --keyring-backend file

- address: gonka1gyz2agg5yx49gy2z4qpsz9826t6s9xev6tkehw
  name: node-702105
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"Ao8VPh5U5XQBcJ6qxAIwBbhF/3UPZEwzZ9H/qbIA6ipj"}'
  type: local


**重要** 请妥善抄写并保存助记词。
若遗忘口令，这是找回账户的唯一方式。

again plastic athlete arrow first measure danger drastic wolf coyote work memory already inmate sorry path tackle custom write result west tray rabbit jeans
```

#### 3.2.【服务器】注册主机（Host）
仍在该容器内，使用 URL、账户公钥与自动获取的共识密钥在链上注册主机：

```
inferenced register-new-participant \
    $DAPI_API__PUBLIC_URL \
    $ACCOUNT_PUBKEY \
    --node-address $DAPI_CHAIN_NODE__SEED_API_URL
```

**预期输出：**
```
...
Found participant with pubkey: Au+a3CpMj6nqFV6d0tUlVajCTkOP3cxKnps+1/lMv5zY (balance: 0)
Participant is now available at http://36.189.234.237:19250/v1/participants/gonka1rk52j24xj9ej87jas4zqpvjuhrgpnd7h3feqmm
```

!!! note "每个网络节点的账户密钥"
    请为每个网络节点生成独立的 `ACCOUNT_PUBKEY`，以保证主机隔离。

完成后退出容器：
```bash
exit
```

#### 3.3.【本地】授予 ML 运营密钥权限
**重要：在创建账户密钥的本地安全机器上执行**

从账户密钥向 ML 运营密钥授予权限：
```bash
./inferenced tx inference grant-ml-ops-permissions \
    gonka-account-key \
    <ml-operational-key-address-from-step-3.1> \
    --from gonka-account-key \
    --keyring-backend file \
    --gas 2000000 \
    --node <seed_api_url from server's config.env>/chain-rpc/ 
```

**预期输出：**
```
...
Transaction sent with hash: FB9BBBB5F8C155D0732B290C443A0D06BC114CDF43E8EE8FB329D646C608062E
Waiting for transaction to be included in a block...

Transaction confirmed successfully!
Block height: 174
```

#### 3.4.【服务器】启动完整节点

最后，启动包括 API 在内的全部容器：
```bash
source config.env && \
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d
```

## 验证节点状态
打开以下链接，并将 `<your-gonka-cold-address>` 替换为你的地址：
```
http://node2.gonka.ai:8000/v1/participants/<your-gonka-cold-address>
```

你将看到 JSON 格式的公钥：
```
{"pubkey":"<your-public-key>"}
```

这表示你的地址已被包含在参与者列表中。

当你的节点完成一次「计算证明（Proof of Compute）」阶段（每 24 小时一次）后，可访问：
```bash
http://node2.gonka.ai:8000/v1/epochs/current/participants
```

你也可以在此阶段前关闭服务器，并在下一次计算证明前重新启动。下一次会话开始时间可在[仪表盘](https://gonka.ai/wallet/dashboard/)查询：
```
http://node2.gonka.ai:8000/dashboard/gonka/validator
```

当你的节点已运行，也可通过你节点的 Tendermint RPC（`node` 容器的 26657 端口）检查状态：
```bash
curl http://<PUBLIC_IP>:<PUBLIC_RPC_PORT>/status
```
服务器上可使用本地地址：
```bash
curl http://0.0.0.0:26657/status
```
使用创世节点的公网地址：
```bash
curl http://node2.gonka.ai:26657/status
```

当你的节点已在仪表盘可见，也可以更新你的公开资料（主机名、网站、头像），以便其他参与者识别你的节点。操作见[此文](https://gonka.ai/host/validator_info/)。

## 停止与清理节点

### 如何停止 ML 节点
1. 禁用每个 ML 节点：
```
curl -X POST http://<api_node_static_ip>:<admin_port>/admin/v1/nodes/<id>/disable
```
2. 等待下一个 epoch，在此之前不要停止节点。禁用标记仅在下一个 epoch 生效。
3. 验证移除与权重：对每个被禁用节点确认：

    - 不再出现在活跃参与者列表中
    - 有效权重为 0

4. 停止 ML 节点。
5. 确认位于 `gonka/deploy/join` 目录，停止所有容器：
```bash
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml down
```
6. 上述命令会停止并移除 `docker-compose.yml` & `docker-compose.mlnode.yml` 中定义的所有服务，但不会删除卷或数据（除非显式配置）。

### 如何清理节点（完全重置）

如果您希望完全重置节点并删除所有数据（用于重新部署或迁移），请按照以下清理步骤操作。

1. 如需清理缓存并重新开始，可删除本地 `.inference` 与 `.dapi` 文件夹（推理运行时缓存与身份）：
```bash
rm -rf .inference .dapi .tmkms
```

2.（可选）清理模型权重缓存：
```bash
rm -rf $HF_HOME
```

!!! note
    删除 `$HF_HOME` 后，后续需要重新从 Hugging Face 下载大体量的模型文件，或重新挂载 NFS 缓存。

**需要帮助？** 欢迎加入我们的 [Discord 服务器](https://discord.com/invite/RADwCT2U6R)，获取通用咨询、技术支持或安全相关帮助。  
