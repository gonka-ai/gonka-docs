# 运行你自己的网关

本指南介绍如何在 **gonka-mainnet** 上运行一个 Gonka devshard 网关，而无需安装完整的链节点。你将在自己的 Linux 主机上部署该网关，为专用的托管创建者地址充值，打开一个链上 devshard 托管账户，发送兼容 OpenAI 的推理请求，并在完成后结算该托管账户。

如果你仅需通过现有端点进行推理，请改用 [社区代理](quickstart.md#1-use-a-community-broker-recommended) —— 该路径不需要 Docker、链上托管或白名单内的创建者地址。

### 需要白名单内的创建者地址

> **前提条件：** 你的 devshard 托管创建者（`gonka1…`，来自 `$DEVSHARD_CREATOR`，在 `DEVSHARD_PRIVATE_KEY` 中）的地址 **必须** 出现在链上的白名单 `devshard_escrow_params.allowed_creator_addresses` 中，**才能** 创建托管账户。
>
> 白名单通过 **治理机制** 在链上维护。你无法通过 `config.devshard.env` 或管理员设置自行添加。请通过链上治理投票申请加入 —— 参见开发者快速入门中的 [成为代理](quickstart.md#3-become-a-broker)，或改用 [社区代理](quickstart.md#1-use-a-community-broker-recommended)。
>
> 在 [§2.3](#23-import-the-creator-key) 导入密钥后，请在 [§2.4](#24-confirm-allowlist-membership) 中验证是否已加入白名单。在确认前请勿为创建者地址充值或部署网关（仅充值不会获得白名单权限）。

!!! warning "生产网络"
    主网上的托管账户和费用使用的是 **真实** 的 ngonka。在充值或创建托管前，请先在链上确认 `devshard_escrow_params.min_amount`（见 §2.4）。下方示例中的存款金额必须 **≥ `min_amount`**。

### 该架构的工作原理

Gonka 推理围绕 **devshard** 组织 —— 即由少量链上存款（托管）支持的短期会话。**网关** 负责打开托管账户，将 `/v1/chat/completions` 路由到网络，协调链下结算状态，并向链上提交 finalize/settle 交易。

在 **仅网关** 服务器上，你只运行网关容器（`devshardctl`）。链访问通过公共 REST/RPC URL 实现。你无需在同一台机器上运行 CometBFT、`api` 或 `mlnode`。

### 所需条件

1. **白名单内的托管创建者** —— `$DEVSHARD_CREATOR` 上的 `allowed_creator_addresses`（见上方[前提条件](#allowlisted-creator-address-required)；在 [§2.4](#24-confirm-allowlist-membership) 中确认）
2. 一台安装了 Docker 的 Linux 主机
3. 可访问公共 Gonka 主网节点的出站 HTTPS（例如 [node3](https://node3.gonka.ai/)，用于链 REST
 + 公共 API）
4. 在同一主机上安装 [inferenced CLI v0.2.13](https://github.com/gonka-ai/gonka/releases/tag/release/v0.2.13)（用于查询和链上结算）
一个已充值的 `gonka1…` 地址，**仅** 用于该托管创建者（在确认白名单后使用）

### 主网参考信息


| 项目                     | 值                                                           |
| -----------------------
| --------------------------------------------------------------
|
| 链 ID                    | `gonka-mainnet`                                                 |
| 模型（示例）             | `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`                        |
| 托管存款（示例）         | `5000000000` ngonka（约 5 GONKA）；必须 ≥ 链上 `min_amount` |
| 公共节点（示例）         | `https://node3.gonka.ai` CometBFT RPC（示例）     | `https://node3.gonka.ai/chain-rpc/` 网关镜像                 | `libermans/gonka-devshard-proxy:latest` |




将链 URL 复制到 [§2.2](#22-create-configdevshardenv) 中的 `config.devshard.env`。以下所有命令均假设你已在部署目录中执行了 `source config.devshard.env`。

---

## 1. 安装工具并创建部署目录

### 1.1 安装 Docker 和 `inferenced`

确认 Docker 已安装并可用：

```bash
docker --version
```

从[发布页面](https://github.com/gonka-ai/gonka/releases/tag/release/v0.2.13)下载 **inferenced v0.2.13**：

```bash
curl -fsSL -o /tmp/inferenced-amd64.zip \
  "https://github.com/gonka-ai/gonka/releases/download/release/v0.2.13/inferenced-amd64.zip"
unzip -o /tmp/inferenced-amd64.zip -d "$HOME/bin"
chmod +x "$HOME/bin/inferenced"
export PATH="$HOME/bin:$PATH"
inferenced version   # should report v0.2.13

export INFERENCED_HOME="$HOME/.devshard-inferenced"
export INFERENCED_KEYRING="$INFERENCED_HOME/keyring-devshard"
mkdir -p "$INFERENCED_HOME" "$INFERENCED_KEYRING"
```

`INFERENCED_HOME` 用于将 CLI 状态与默认的 `~/.inference` 安装隔离开。`INFERENCED_KEYRING` 仅是导入密钥的文件夹名称。

### 1.2 创建部署目录

为 `config.devshard.env`、`docker-compose.yml` 和网关数据使用同一个目录。以下示例使用 `/srv/gonka/devshard-gateway`。

创建一个**由登录用户拥有**的目录：

```bash
sudo mkdir -p /srv/gonka/devshard-gateway
sudo chown "$USER:$USER" /srv/gonka/devshard-gateway
cd /srv/gonka/devshard-gateway
```

---

## 2. 准备身份和配置

### 2.1 生成 API 密钥和托管钱包

从部署目录中生成密钥，并将输出内容保存下来以用于下一步：

```bash
printf 'export DEVSHARD_PRIVATE_KEY=%s\n' "$(openssl rand -hex 32)"
printf 'export DEVSHARD_API_KEYS=sk-%s\n' "$(openssl rand -hex 24)"
printf 'export DEVSHARD_ADMIN_API_KEY=sk-admin-%s\n' "$(openssl rand -hex 24)"
```

`DEVSHARD_PRIVATE_KEY` 是一个**专用的托管创建者**钱包。请勿重复使用验证者、参与者或经纪人的密钥。

### 2.2 创建 `config.devshard.env`

此文件必须在 `source config.devshard.env` 或 `docker compose up` 之前存在。Docker Compose 会将其加载到容器中。

```bash
nano config.devshard.env
```

主网示例内容（从 [§2.1](#21-generate-api-keys-and-escrow-wallet) 粘贴密钥）：

```bash
# Chain (public node — gonka-mainnet)
export NODE_RPC=https://node3.gonka.ai/chain-rpc/
export CHAIN_ID="gonka-mainnet"
export NODE_BASE=https://node3.gonka.ai
export NODE_CHAIN_API=https://node3.gonka.ai/chain-api

# inferenced CLI (local; not used by the gateway container)
export INFERENCED_HOME="$HOME/.devshard-inferenced"
export INFERENCED_KEYRING="$INFERENCED_HOME/keyring-devshard"

# Escrow creator + gateway auth (from §2.1)
export DEVSHARD_PRIVATE_KEY=<64-char-hex-no-0x-prefix>
export DEVSHARD_API_KEYS=sk-...
export DEVSHARD_ADMIN_API_KEY=sk-admin-...

# Gateway (devshardctl container)
export DEVSHARD_INSTANCE_NAME=devshardctl-multi
export DEVSHARDS_JSON='[]'
export DEVSHARD_CHAIN_REST=https://node3.gonka.ai/chain-api
export DEVSHARD_TX_QUERY_REST=https://node3.gonka.ai/chain-api
export DEVSHARD_PUBLIC_API=https://node3.gonka.ai
export DEVSHARD_PORT=8080
export DEVSHARD_STORAGE_DIR=/root/.devshardctl
export DEVSHARD_STORAGE_HOST_DIR=.devshardctl
export DEVSHARD_MODEL=Qwen/Qwen3-235B-A22B-Instruct-2507-FP8
export GATEWAY_MAX_CONCURRENT_REQUESTS=512
export GATEWAY_MAX_INPUT_TOKENS_IN_FLIGHT=0
export GATEWAY_DEFAULT_MAX_TOKENS=3072
export GATEWAY_MAX_TOKENS_CAP=4096
export DEVSHARD_TX_GAS_LIMIT=700000
export DEVSHARD_POC_REQUEST_MODE=relaxed
export DEVSHARD_CAPACITY_AWARE_LIMITS=on
```

在首次托管之前，多托管模式需要 `DEVSHARDS_JSON='[]'`。如果没有它，容器将期望 `DEVSHARD_ESCROW_ID`（单托管模式），并且会退出，直到你设置其中一个。

锁定权限并验证公共节点：

```bash
chmod 600 config.devshard.env
mkdir -p "$INFERENCED_HOME" "$INFERENCED_KEYRING"

cd /srv/gonka/devshard-gateway
source config.devshard.env
curl -fsS "${NODE_RPC}status" | jq '.result.sync_info.latest_block_height'
```

你应该看到一个最近的区块高度。可选——列出治理模型：

```bash
curl -sS "$NODE_BASE/v1/governance/models" | jq
```

### 2.3 导入创建者密钥

```bash
source config.devshard.env

test -f config.devshard.env
test -n "$DEVSHARD_PRIVATE_KEY"
```

`--keyring-backend test` 是 Cosmos SDK 后端名称（本地开发密钥环）。

```bash
inferenced keys import-hex devshard-create "$DEVSHARD_PRIVATE_KEY" \
  --keyring-backend test \
  --keyring-dir "$INFERENCED_KEYRING" \
  --home "$INFERENCED_HOME"
```

如果导入提示密钥已存在，则跳过导入。

解析链上创建者地址：

```bash
export DEVSHARD_CREATOR="$(inferenced keys show devshard-create -a \
  --keyring-backend test \
  --keyring-dir "$INFERENCED_KEYRING" \
  --home "$INFERENCED_HOME")"
echo "DEVSHARD_CREATOR=$DEVSHARD_CREATOR"
```

可选 — 在环境文件中持久化 `DEVSHARD_CREATOR`（运行一次）：

```bash
grep -q '^export DEVSHARD_CREATOR=' config.devshard.env || \
  echo "export DEVSHARD_CREATOR=$DEVSHARD_CREATOR" >> config.devshard.env
```

名称 `devshard-create` 仅是一个本地标签；链上交易使用 `--from devshard-create` 以 `$DEVSHARD_CREATOR` 的身份进行签名。

### 2.4 确认准入名单成员资格

**请勿跳过此步骤。** 在 [第4节](#4-create-an-escrow-and-open-api-access) 中创建托管账户仅在 `$DEVSHARD_CREATOR` 位于链上准入名单中时才会成功。

你**不需要**运行验证器即可使用网关；你只需将创建者地址添加到 `devshard_escrow_params.allowed_creator_addresses` 即可。如果该地址缺失，请立即停止并按照[成为经纪方](quickstart.md#3-become-a-broker)的指引，申请治理参数更新。在创建托管账户前，每次治理投票后都请重新执行此检查。

```bash
source config.devshard.env

echo "DEVSHARD_CREATOR=$DEVSHARD_CREATOR"

curl -sS "$NODE_CHAIN_API/productscience/inference/inference/params" \
  | jq '.params.devshard_escrow_params | {min_amount, max_escrows_per_epoch, max_nonce, allowed_creator_addresses}'

curl -sS "$NODE_CHAIN_API/productscience/inference/inference/params" \
  | jq --arg addr "$DEVSHARD_CREATOR" \
    '.params.devshard_escrow_params.allowed_creator_addresses | index($addr) != null'
```

第二个命令必须输出 `true`。使用第一个命令读取实时限制（`min_amount`, `max_escrows_per_epoch`, `max_nonce`）。在主网完成 [v0.2.13 升级](https://github.com/gonka-ai/gonka/blob/gm/microrelease/inference-chain/app/upgrades/v0_2_13/upgrades.go) 后，预期 `max_escrows_per_epoch` 为 **500,000**，`max_nonce` 为 **1,000,000**。如果输出为 `false`，则表示你的地址**未**被加入白名单——在链上添加之前，请勿继续进行 [§2.5](#25-fund-the-creator-account)、[§3](#3-deploy-the-gateway) 或 [§4](#4-create-an-escrow-and-open-api-access) 的操作。

### 2.5 为创建者账户充值

只有在 [§2.4](#24-confirm-allowlist-membership) 返回 `true` 后，才能为创建者账户充值：

```bash
inferenced query bank balances "$DEVSHARD_CREATOR" \
  --node "$NODE_RPC" --chain-id "$CHAIN_ID" -o json --home "$INFERENCED_HOME" \
  | jq '.balances[] | select(.denom=="ngonka")'
```

发送足够的 **ngonka** 以覆盖托管押金（在示例中为 `5000000000`，如果该值 ≥ `min_amount`），并支付创建/结算所需的 Gas 费和交易费。如果你计划启用自动托管轮换（[托管期限与轮换](#escrow-lifetime-and-rotation)），请为创建者预存足够用于每个周期内**多次**押金的资金——而不仅是在[第4节](#4-create-an-escrow-and-open-api-access)中手动创建一次托管。

!!! tip "如何获取 GNK"

    GNK 可通过以太坊上的 WGNK（封装版 GNK）获得。你可以在去中心化交易所（DEX）购买 WGNK，或通过点对点转账获取，然后使用 [跨链转账仪表板](https://gonka.ai/cross-chain-transfers/ethereum-bridge/dashboard/) 将其桥接到 Gonka 网络。该仪表板会从你的以太坊钱包自动推导出正确的 `gonka1…` 地址，并完成存款操作，无需使用命令行工具。

---

## 3. 部署网关

本节将启动网关进程。你需要在本地**创建** `docker-compose.yml`；Docker 会自动**拉取**预构建的镜像。你无需从网络下载 compose 文件，也无需安装 Gonka 区块链节点。

网关会读取 `config.devshard.env`，将状态数据存储在 `.devshardctl/` 下，并在主机上监听 `http://127.0.0.1:18080`。链上托管的创建将在[第4节](#4-create-an-escrow-and-open-api-access)中进行；先启动网关是完全可行的。

| 路径                  | 用途                                   |
| --------------------
| ----------------------------------------
|
| `config.devshard.env` | 存放密钥和链 URL（主机与容器共用） `docker-compose.yml`  | 定义 Docker 如何运行 `devshardctl` `.devshardctl/`       | 网关数据库（首次 `up` 时创建） |



所有命令均假设：

```bash
cd /srv/gonka/devshard-gateway
```

### 3.1 创建 `docker-compose.yml`

```bash
nano docker-compose.yml
```

仅网关的 compose（无 `node` 或 `api` 服务）：

```yaml
services:
  devshardctl:
    container_name: ${DEVSHARD_INSTANCE_NAME:-devshardctl-multi}
    image: libermans/gonka-devshard-proxy:latest
    env_file:
      - ./config.devshard.env
    environment:
      - DEVSHARD_PORT=8080
      - DEVSHARD_STORAGE_DIR=/root/.devshardctl
    volumes:
      - ${DEVSHARD_STORAGE_HOST_DIR:-.devshardctl}:/root/.devshardctl
    ports:
      - "127.0.0.1:18080:8080"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/v1/status"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
```

- `env_file` 将链的 URL 和密钥注入容器中。
- 卷挂载可在重启后保留已注册的托管信息和管理员设置。
- `127.0.0.1:18080` 将 API 仅绑定到本地主机；如果远程客户端需要访问，请在前方部署 nginx 或其他反向代理。

### 3.2 拉取镜像并启动容器

加载环境变量并拉取镜像：

```bash
cd /srv/gonka/devshard-gateway
source config.devshard.env
sudo docker compose pull
```

在后台启动网关：

```bash
sudo docker compose up -d
```

确认服务是否健康：

```bash
sudo docker compose ps
```

期望 `devshardctl-multi`（或您的 `DEVSHARD_INSTANCE_NAME`）处于 **running** 状态，且健康状态为 **healthy**，启动期结束后即如此。

### 3.3 验证 HTTP API

```bash
curl -fsS http://127.0.0.1:18080/v1/status | jq '{runtimes, capacity: .capacity.models}'
```

JSON 响应意味着网关已启动。托管账户（escrow）可能为空，直到您完成[第4节](#4-create-an-escrow-and-open-api-access)。

聊天补全功能可通过以下地址访问：

`http://127.0.0.1:18080/v1/chat/completions`

（或您的反向代理转发到该端口的 URL）。

---

## 4. 创建托管账户并开通 API 访问

**白名单检查：** `$DEVSHARD_CREATOR` 必须已列入白名单（参见[第2.4节](#24-confirm-allowlist-membership)），否则链上创建托管将失败。

第4.1节中的存款金额必须 **≥** 第2.4节中链上显示的 `min_amount`。

### 4.1 创建并注册托管账户

当满足 `"register": true` 时，网关管理员 API 将创建链上托管账户并完成注册。该托管账户将保持活跃状态，直到您在[第6节](#6-finalize-and-settle-the-escrow)中完成最终结算，除非您在下方的[托管生命周期与轮换](#escrow-lifetime-and-rotation)中启用了自动轮换功能。

```bash
cd /srv/gonka/devshard-gateway
source config.devshard.env

CREATE_JSON=$(curl -sS -X POST http://127.0.0.1:18080/v1/admin/escrows \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"amount\": 5000000000,
    \"model_id\": \"Qwen/Qwen3-235B-A22B-Instruct-2507-FP8\",
    \"private_key\": \"$DEVSHARD_PRIVATE_KEY\",
    \"chain_id\": \"$CHAIN_ID\",
    \"register\": true
  }")
echo "$CREATE_JSON" | jq .

export ESCROW_ID=$(echo "$CREATE_JSON" | jq -r '.escrow_id')
echo "ESCROW_ID=$ESCROW_ID"
```

在本指南的其余部分，请在你的 shell 中保留 `ESCROW_ID`。在新会话中，请重新设置它（例如 `export ESCROW_ID=1`）。

### 4.2 开启用户 API 访问

模型默认为 `admin_only`，直到你启用 API 密钥访问：

```bash
curl -sS -X POST http://127.0.0.1:18080/v1/admin/settings \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "default_request_max_tokens": 3072,
    "request_max_tokens_cap": 4096,
    "model_limits": [{
      "model_id": "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
      "access_mode": "api_key"
    }]
  }'
```

确认托管已加载：

```bash
curl -fsS http://127.0.0.1:18080/v1/status | jq .
curl -fsS http://127.0.0.1:18080/v1/admin/devshards \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" | jq .
```

### 运行多个托管账户（并行池）

一个网关进程可以**同时服务多个托管账户**。您可以在容器环境变量中首次启动时通过 `**DEVSHARDS_JSON`** 注册它们，或之后使用 `**POST /v1/admin/devshards`** 或 `**POST /v1/admin/escrows**` 添加更多（`"register": true`）。在池模式下，`**POST /v1/chat/completions**` 会为每个请求选择一个活跃的托管账户——**选择器**根据运行时负载（进行中的请求数与容量权重）对运行时打分，并将请求路由到最适合所请求模型的实例。

在池模式下，`**GET /v1/status`** 会列出所有 devshard 实例以及限流器和容量信息；当仅配置了一个托管账户时，其行为与简单代理相同。针对单个托管账户的管理调用需使用 `**/devshard/{id}/…`** 前缀（例如 `**POST /devshard/{id}/v1/finalize**`）；而裸调用 `**POST /v1/finalize**` 仅在配置了单一托管账户时有效。本文 [§5](#5-send-a-test-request)–[§6](#6-finalize-and-settle-the-escrow) 部分以单个托管账户为例；当您需要更高吞吐量或跨 epoch 轮转时，请使用托管池。

### 托管账户生命周期与轮转

本指南中 [§4.1](#41-create-and-register-the-escrow)–[§4.2](#42-open-user-api-access) 和 [§5](#5-send-a-test-request)–[§6](#6-finalize-and-settle-the-escrow) 的步骤演示了**一次手动创建的托管账户**。这适合作为初次测试的模型。在主网上，网关也可以在 epoch 边界自动**轮转**托管账户，以避免容量耗尽。

#### 手动创建的托管账户能持续多久？

**网关对您自行创建的单个托管账户没有固定的时钟时间过期机制。**

| 限制项             | 含义说明                                                                                                                                                                                                                                                                                                                                          |
| -----------------
| -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
|
| **您的工作流**  | 托管账户将持续提供聊天服务，直到您主动执行**最终化并结算**（[§6](#6-finalize-and-settle-the-escrow)）。                                                                                                                                                                                                                                             |
| **链上 epoch** | 每个托管账户与其创建时所在的链 **epoch** 绑定（`epoch_index`）。这对协议存储和链规则有意义，但在本指南中并不意味着“N 小时后自动过期”这类简单计时机制。                                                                                                                                                             |
| **余额**        | 推理过程会消耗托管账户中的存款。网关会定期检查活跃托管账户（约每 **30 秒**一次）。如果可用余额低于 **1,000,000 ngonka**，该托管账户将被视为已耗尽。 **nonce 预算**   | 离线 devshard 状态通过 **nonce** 推进。多托管账户网关会在 nonce 接近 **19,800** 时停止向该实例分配新对话（此限制未来将被设为更高值）。此外，`devshard_escrow_params.max_nonce` 是链上结算的上限——可在 [§2.4](#24-confirm-allowlist-membership) 查询（主网 v0.2.13 之后为 **1,000,000**）。 **链级上限**     | 治理机制设定了 `max_escrows_per_epoch`：当前 epoch 中全链允许的最大 **devshard 托管账户数量**（非每个创建者限制）。您可在 [§2.4](#24-confirm-allowlist-membership) 查询实时数值。主网 v0.2.13 之后该值为 **500,000**。 |



**默认行为**：`escrow_rotation` 默认是**关闭的**，需在管理设置中手动启用。当轮转关闭时，网关**不会**在余额或 nonce 耗尽时自动创建替代账户——仅记录日志，可能停止将新请求路由至该托管账户。建议您在存款耗尽前主动**最终化并结算**，或启用下方所述的自动轮转功能。

#### 网关是否自动轮转？

**默认不开启**。自动轮转是可选功能，需通过配置 `POST /v1/admin/settings` → `escrow_rotation` 启用。

当 `**escrow_rotation.enabled` 设置为 `true`** 时，后台任务大约每 **15 秒**运行一次，并与链的 **epoch / PoC 时间表**协同管理托管账户：

1. **在下个 epoch 切换前**（以即将到来的 `set_new_validators` 边界为准，而不仅是“PoC 开始”）：针对每个配置的模型，创建 `**temp_count`** 个临时“桥接”托管账户，然后**最终化并结算**当前活跃的**常规**托管账户（若 devshard 仍有进行中的请求，则跳过结算）。
2. **在链离开该次切换的 PoC 活跃窗口后**：为每个模型创建 `**target_count`** 个新的**常规**托管账户，随后**最终化并结算**桥接阶段的**临时**托管账户。

如果临时托管账户创建失败，网关可能会将现有的常规托管账户**提升**为临时角色，以避免出现无桥接账户的情况。

当轮转启用后，网关还可**替换**已耗尽的托管账户（余额过低、nonce 过高或请求中途耗尽），通过创建新的链上托管账户并结算旧账户实现——但**仅适用于列在 `escrow_rotation.models` 中的模型**。

**资金与轮转**：每次 epoch 过渡都会先创建**新的**链上托管账户（`temp_count` 个桥接账户，然后是 `target_count` 个每模型的常规账户），之后才最终化并结算旧账户。每次创建都会从 `$DEVSHARD_CREATOR` 锁定额外的 `amount`，直到结算返还未使用的部分。请确保创建者钱包余额至少准备 **`**(temp_count
 target_count) × amount` ngonka 每模型每 epoch**，并预留足够的 gas 用于创建和结算交易——还需保留额外余量，因为在轮转过程中桥接与常规托管账户可能短暂重叠。

#### 启用轮转（生产环境 / 常驻网关）

请在已手动创建、注资并测试至少一个托管账户后（参见 [§4](#4-create-an-escrow-and-open-api-access)）再启用此功能。轮转需要容器中配置相同的 `private_key_env`（例如 `DEVSHARD_PRIVATE_KEY`），且创建者账户需持有足够 ngonka 以支付上述多笔押金，而不仅仅是一个托管账户的 `amount`。

示例（单个模型，可根据容量调整数量；生产环境中通常为每个模型运行多个常规托管账户，其中 `**temp_count`: 1 用于 epoch 桥接）：

```bash
source config.devshard.env

curl -sS -X POST http://127.0.0.1:18080/v1/admin/settings \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "escrow_rotation": {
      "enabled": true,
      "pre_poc_blocks": 300,
      "models": [{
        "model_id": "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
        "temp_count": 1,
        "target_count": 1,
        "amount": 5000000000,
        "private_key_env": "DEVSHARD_PRIVATE_KEY"
      }]
    }
  }'
```

无需重启：在设置中启用轮换功能后，会立即在运行的网关上启动轮换器。

检查轮换时间及每个模型的最近轮换结果：

```bash
curl -fsS http://127.0.0.1:18080/v1/debug/rotation \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" | jq
```

有用的字段包括 `chain.blocks_until_next_rotation`、`settings` 和 `latest`（按模型阶段划分的计数和错误）。

#### 如果轮转未运行或托管余额积压

| 症状                        | 需检查内容                                                                                                                                                                                                                                                                             |
| --------------------------
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
|
| 跨多个纪元均无操作           | 确认设置中已启用 `"escrow_rotation": { "enabled": true, ... }`，且 `GET /v1/debug/rotation` 显示为 `enabled: true`。                                                                                                                                                                     |
| 一次失败后即停止创建         | 网关在链上创建失败后（例如资金不足或超出每纪元的托管限额），会**抑制对同一模型、角色和纪元的重复创建**。请阅读 `/v1/debug/rotation` 和 `docker logs` 了解 `escrow_rotation_`
/ `escrow_depletion_replacement_failed` 的相关信息。                                                       |
| 结算始终无法完成             | 结算需等待 devshard **没有活跃请求**时才能进行。在期望轮转结算完成前，请先清空或停止所有流量。 余额耗尽但未替换             | **替换需要启用轮转功能**，并在 `escrow_rotation.models` 中存在对应条目。否则需手动完成[第6节](#6-完成并结算托管余额)中的最终化和结算操作。 纪元时间不正确               | 轮转依赖实时链上阶段数据；请确保 `DEVSHARD_PUBLIC_API` / 链 REST 接口指向你的主网节点（参见[第2.2节](#22-创建-configdevshardenv)）。 |



对于**单次手动测试**，请保持轮转功能**禁用**，先完成[第5节](#5-发送测试请求)，然后执行[第6节](#6-完成并结算托管余额)。当你希望网关自动维持各纪元间托管余额的新鲜度而无需手动重建时，再启用轮转功能。

---

## 5. 发送测试请求

网关端点与 OpenAI 兼容。设置你的 API 密钥并发送一个聊天补全请求：

```bash
source config.devshard.env

curl -sS http://127.0.0.1:18080/v1/chat/completions \
  -H "Authorization: Bearer $DEVSHARD_API_KEYS" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
    "messages": [{"role": "user", "content": "How long do hamsters live?"}],
    "max_tokens": 32
  }' | jq '{id, content: .choices[0].message.content}'
```

稍后，您应该会在 `content` 中看到模型回复。如果收到 **401** 错误且提示 `"requires an admin API key"`，请重复 [第4.2节](#42-open-user-api-access) 中的设置 POST 操作。

---

## 6. 完成并结算托管

当您完成推理后，网关将最终确定链下 devshard 状态，然后您需在链上提交结算。这两个步骤都需要 [第4.1节](#41-create-and-register-the-escrow) 中生成的 `source config.devshard.env` 和非空的 `ESCROW_ID`。

**最终化**操作是**按托管进行的**，必须使用路径 `/devshard/{id}/v1/finalize`，而不能仅使用 `/v1/finalize`。

### 6.1 最终化链下状态

```bash
cd /srv/gonka/devshard-gateway
source config.devshard.env

if [ -z "${ESCROW_ID:-}" ]; then
  echo "ESCROW_ID is unset — export it from §4.1 (e.g. export ESCROW_ID=2)"
  exit 1
fi
echo "Using ESCROW_ID=$ESCROW_ID"

curl -fsS http://127.0.0.1:18080/v1/admin/devshards \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" | jq .

curl -fS -X POST "http://127.0.0.1:18080/devshard/${ESCROW_ID}/v1/finalize" \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" \
  -o settlement.json

jq '{escrow_id, version, fees}' settlement.json
wc -c settlement.json
```

`-f` 会使 `curl` 在遇到 HTTP 错误时失败，而不是写入一个空文件。一个 **0 字节** 的 `settlement.json` 通常意味着 `ESCROW_ID` 为空（请求命中了 `/devshard//v1/finalize` 并返回了 **404** 且无响应体）。

如果 finalize 失败，请检查响应内容和网关日志：

```bash
curl -sS -w "\nHTTP %{http_code}\n" \
  -X POST "http://127.0.0.1:18080/devshard/${ESCROW_ID}/v1/finalize" \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY"
sudo docker logs devshardctl-multi --tail 80
```

### 6.2 链上结算

未使用的 ngonka 金额将在向主机付款并扣除协议费用后，退还至您的创建者地址。

```bash
source config.devshard.env

curl -sS -X POST "http://127.0.0.1:18080/v1/admin/devshards/${ESCROW_ID}/settle" \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"private_key_env":"DEVSHARD_PRIVATE_KEY"}'
```

### 6.3 确认结算与退款

链上托管状态：

```bash
source config.devshard.env

inferenced query inference show-devshard-escrow "$ESCROW_ID" \
  --node "$NODE_RPC" --chain-id "$CHAIN_ID" -o json --home "$INFERENCED_HOME" \
  | jq '{id: .escrow.id, settled: .escrow.settled, creator: .escrow.creator, amount: .escrow.amount}'
```

期望 `settled: true`。`amount` 字段为原始存款元数据；结算后，活跃币将返回至 `$DEVSHARD_CREATOR`。

创建者钱包余额（主要检查资金是否退回）：

```bash
source config.devshard.env

inferenced query bank balances "$DEVSHARD_CREATOR" \
  --node "$NODE_RPC" --chain-id "$CHAIN_ID" -o json --home "$INFERENCED_HOME" \
  | jq '.balances[] | select(.denom=="ngonka") | {denom, amount}'
```

结算后，大部分未使用的押金将退还至 `$DEVSHARD_CREATOR`，仅扣除推理成本、结算费用和交易的 Gas 费用。

---

## 7. 暂停、重定向和停止网关

第 [§1](#1-install-tools-and-create-a-deploy-directory) 至 [§6](#6-finalize-and-settle-the-escrow) 节涵盖单个测试托管账户的操作。本节介绍如何暂停路由、按需重定向客户端或关闭主机。

### 7.1 停用单个托管账户

在 [§6](#6-finalize-and-settle-the-escrow) 中完成结算后，托管账户记录仍保留在链上；**停用**仅表示该网关本地停止向此托管账户路由新的聊天请求。池中其他仍处于活跃状态的托管账户将继续提供服务。

```bash
source config.devshard.env

curl -sS -X POST "http://127.0.0.1:18080/v1/admin/devshards/${ESCROW_ID}/deactivate" \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY"
```

### 7.2 重定向所有客户端流量（网关终止开关）

在保留管理员访问权限（如完成操作、设置、导入、调试）的同时，若需告知 API 客户端停止使用此网关 URL，请启用网关的**禁用**状态。非管理员请求（例如 pooled `/v1/chat/completions`）将收到 **HTTP 308** 响应，并附带 JSON `status`、`message` 和 `new_url`。管理员路由（`/v1/admin/`*、`/v1/debug/*`、以及 `/devshard/{id}/…` 下的按托管完成操作）仍可通过管理员 API 密钥正常使用。

```bash
source config.devshard.env

curl -sS -X POST http://127.0.0.1:18080/v1/admin/settings \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "disabled": {
      "enabled": true,
      "message": "This gateway is retired; use the new base URL.",
      "new_url": "https://your-new-host.example/v1/chat/completions"
    }
  }'
```

要恢复正常使用，请再次使用 `"enabled": false` 发送 POST 请求。**仅在**首次启动网关时，可以通过 `config.devshard.env` 中的 `DEVSHARD_GATEWAY_DISABLED`、`DEVSHARD_GATEWAY_DISABLED_MESSAGE` 和 `DEVSHARD_GATEWAY_DISABLED_NEW_URL` 引导这些相同标志（参见 [gonka](https://github.com/gonka-ai/gonka) 仓库中的网关环境模板）。在 `gateway.db` 创建后，请使用 `**POST /v1/admin/settings`**。

### 7.3 停止容器及可选的清理

（可选）—— 删除本地网关记录（可在容器仍在运行且已稳定后执行）：

```bash
source config.devshard.env

curl -sS -X DELETE "http://127.0.0.1:18080/v1/admin/devshards/${ESCROW_ID}" \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY"
```

停止 Docker：

```bash
cd /srv/gonka/devshard-gateway
sudo docker compose down

# Optional: remove persisted gateway state
# sudo rm -rf .devshardctl
```

---

## 8. 无流量中断的网关升级（热替换）

直接替换网关 **镜像** 或重建主容器会导致正在进行的 `/v1/chat/completions` 流中断。生产环境运维通常采用 **双容器** 模式：启动一个 **临时** 网关与主网关并行运行，通过 **nginx 别名** 和优雅的 `nginx -s reload` 实现流量切换，对旧实例进行 ** draining **（排水） 操作，更新主容器，再将流量切回，最后将临时网关的托管状态 **导入** 到主网关中。

**网关提供的功能**：

- 第二个 `devshardctl` 进程（通常为端口 **18081**），并配置 `DEVSHARDS_JSON=[]`，使其启动时不加载主托管账户。
- 在临时实例上配置 `POST /v1/admin/escrows`，用于为临时桥接托管账户提供资金。
- 提供 `GET /v1/status`（或管理员状态），以便在停止实例前确认 `**active_requests`** 为零。
- 在主网关上启用 `POST /v1/admin/devshards/import` 并配置 `active: false`，然后在主网关上注册/激活，确保临时托管账户状态能顺利过渡到主网关。
- 通过反向代理的上游名称变更实现公网路由切换（无需完全重启代理容器即可完成聊天服务的切换）。

**详细操作步骤指南** 正在准备中。

---

## 相关内容

- [开发者快速入门](quickstart.md) — 社区经纪节点及 [成为经纪节点](quickstart.md#3-become-a-broker)

**需要帮助？** 查看 [FAQ](https://gonka.ai/FAQ/)，加入 [Discord](https://discord.com/invite/RADwCT2U6R)，或在 GitHub 上提交 [经纪节点 / 白名单申请](https://github.com/gonka-ai/gonka/issues/new?title=Request+to+be+added+as+a+Gonka+broker)。
