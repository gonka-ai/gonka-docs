# 运行您自己的网关

本指南将指导您如何在 **gonka-mainnet** 上运行 Gonka devshard 网关，而无需安装完整的链节点。您将在自己的 Linux 主机上部署网关，为专用的托管创建者地址充值，开启链上 devshard 托管，发送与 OpenAI 兼容的推理请求，并在完成时结算托管。

如果您希望 **成为经纪人** 但不运行您自己的白名单网关，请使用 **[OpenBroker](https://openbroker.gonka.gg)** —— 这是推荐的路径（参见 [开发者快速入门 §3](quickstart.md#3-interested-in-operating-a-gateway)）。仅当您确实需要自托管的链上网关时，才继续本指南。

### 需要白名单创建者地址

> **前提条件**：您的 devshard 托管创建者地址 `gonka1…`（来自 `DEVSHARD_PRIVATE_KEY` 的 `$DEVSHARD_CREATOR`）**必须**出现在链上白名单 `devshard_escrow_params.allowed_creator_addresses` 中，**才能**创建托管。
>
> 白名单通过 **治理** 在链上维护。您无法通过 `config.devshard.env` 或管理员设置自行添加。优先通过 [OpenBroker](https://openbroker.gonka.gg) 成为经纪人；如果 OpenBroker 无法满足您的需求，且您仍需要自己的白名单创建者地址，请使用 [GitHub 白名单问题作为备选方案](quickstart.md#fallback-github-allow-list-request)。
>
> 在 [§2.3](#23-import-the-creator-key) 中导入您的密钥后，请在 [§2.4](#24-confirm-allowlist-membership) 中验证成员资格。在该检查通过之前，请勿为创建者充值或部署网关（仅充值不会授予白名单权限）。

!!! warning 生产网络
    Mainnet 托管和费用使用 **真实** ngonka。在充值或创建托管前，请确认 `devshard_escrow_params.min_amount` 在链上（§2.4）。以下示例存款必须 **≥ `min_amount`**。

### 此设置的工作原理

Gonka 推理围绕 **devshards** 组织——短期会话由少量链上存款（托管）支持。一个 **网关** 打开托管，将 `/v1/chat/completions` 路由到网络，协调链下结算状态，并提交最终/结算交易到链上。

在 **仅网关** 服务器上，您仅运行网关容器（`devshardctl`）。链访问使用公共 REST/RPC URL。您无需在同一台机器上运行 CometBFT、`api` 或 `mlnode`。

### 您需要什么

1. **白名单托管创建者** —— `$DEVSHARD_CREATOR` 在 `allowed_creator_addresses` 上（[前提条件](#allowlisted-creator-address-required) 如上；在 [§2.4](#24-confirm-allowlist-membership) 中确认）
2. 一台带有 Docker 的 Linux 主机
3. 对外 HTTPS 访问公共 Gonka 主网端点（链 REST + 公共 API 使用 [node3](https://node3.gonka.ai/)）
4. 同一主机上的 [inferenced CLI v0.2.13](https://github.com/gonka-ai/gonka/releases/tag/release/v0.2.13)（用于查询和链上结算）
5. 一个已充值的 `gonka1…` 地址，**仅用作**该托管创建者（在白名单确认后）

### 主网参考


| 项目 | 值 |
| ------------------------ | --------------------------------------------------------------- |
| 链 ID | `gonka-mainnet` |
| 模型（示例） | `MiniMaxAI/MiniMax-M2.7` |
| 托管存款（示例） | `5000000000` ngonka（约 5 GONKA）；必须 ≥ 链上 `min_amount` |
| 公共节点（示例） | `https://node3.gonka.ai` |
| CometBFT RPC（示例） | `https://node3.gonka.ai/chain-rpc/` |
| 网关镜像 | `libermans/gonka-devshard-proxy:latest` |


将链 URL 复制到 [§2.2](#22-create-configdevshardenv) 中的 `config.devshard.env`。以下所有命令均假设您已在部署目录中运行过 `source config.devshard.env`。

---

## 安装工具并创建部署目录

### 1.1 安装 Docker 和 `inferenced`

确认 Docker 可用：

```bash
docker --version
```

从 [发布页面](https://github.com/gonka-ai/gonka/releases/tag/release/v0.2.13) 下载 **inferenced v0.2.13**：

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

`INFERENCED_HOME` 将 CLI 状态与默认 `~/.inference` 安装分离。`INFERENCED_KEYRING` 仅为导入密钥的文件夹名称。

### 1.2 创建部署目录

使用一个目录存放 `config.devshard.env`、`docker-compose.yml` 和网关数据。以下示例使用 `/srv/gonka/devshard-gateway`。

创建 **由您的登录用户拥有** 的目录：

```bash
sudo mkdir -p /srv/gonka/devshard-gateway
sudo chown "$USER:$USER" /srv/gonka/devshard-gateway
cd /srv/gonka/devshard-gateway
```

---

## 准备身份和配置

### 2.1 生成 API 密钥和托管钱包

在部署目录中，生成密钥并保存输出以供下一步使用：

```bash
printf 'export DEVSHARD_PRIVATE_KEY=%s\n' "$(openssl rand -hex 32)"
printf 'export DEVSHARD_API_KEYS=sk-%s\n' "$(openssl rand -hex 24)"
printf 'export DEVSHARD_ADMIN_API_KEY=sk-admin-%s\n' "$(openssl rand -hex 24)"
```

`DEVSHARD_PRIVATE_KEY` 是一个 **专用托管创建者** 钱包。请勿重复使用验证者、参与者或经纪人密钥。

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
export DEVSHARD_MODEL=MiniMaxAI/MiniMax-M2.7
export GATEWAY_MAX_CONCURRENT_REQUESTS=512
export GATEWAY_MAX_INPUT_TOKENS_IN_FLIGHT=0
export GATEWAY_DEFAULT_MAX_TOKENS=3072
export GATEWAY_MAX_TOKENS_CAP=4096
export DEVSHARD_TX_GAS_LIMIT=700000
export DEVSHARD_POC_REQUEST_MODE=relaxed
export DEVSHARD_CAPACITY_AWARE_LIMITS=on
```

在第一个托管账户存在之前，`DEVSHARDS_JSON='[]'` 是多托管模式所必需的。如果没有它，容器会期望 `DEVSHARD_ESCROW_ID`（单托管模式），并在你设置一个之前退出。

锁定权限并验证公共节点：

```bash
chmod 600 config.devshard.env
mkdir -p "$INFERENCED_HOME" "$INFERENCED_KEYRING"

cd /srv/gonka/devshard-gateway
source config.devshard.env
curl -fsS "${NODE_RPC}status" | jq '.result.sync_info.latest_block_height'
```

你应该看到最近的区块高度。可选——列出治理模型：

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

如果导入报告密钥已存在，请跳过导入。

解析链上创建者地址：

```bash
export DEVSHARD_CREATOR="$(inferenced keys show devshard-create -a \
  --keyring-backend test \
  --keyring-dir "$INFERENCED_KEYRING" \
  --home "$INFERENCED_HOME")"
echo "DEVSHARD_CREATOR=$DEVSHARD_CREATOR"
```

可选——将 `DEVSHARD_CREATOR` 持久化到环境文件中（仅运行一次）：

```bash
grep -q '^export DEVSHARD_CREATOR=' config.devshard.env || \
  echo "export DEVSHARD_CREATOR=$DEVSHARD_CREATOR" >> config.devshard.env
```

名称 `devshard-create` 仅是本地标签；链上交易使用 `--from devshard-create` 以 `$DEVSHARD_CREATOR` 身份签名。

### 2.4 确认允许名单成员资格

**请勿跳过此步骤。** 在 [§4](#4-create-an-escrow-and-open-api-access) 中创建托管账户仅在 `$DEVSHARD_CREATOR` 在链上允许名单中时才会成功。

你**不需要**运行验证节点来使用网关；你只需要你的创建者地址在 `devshard_escrow_params.allowed_creator_addresses` 上。如果缺失，请在此停止——通过 [OpenBroker](https://openbroker.gonka.gg) 成为经纪人，或仅在 OpenBroker 无法满足你的需求时使用 [GitHub 允许名单回退](quickstart.md#fallback-github-allow-list-request)。在创建托管账户之前，任何治理投票后请重新检查此步骤。

```bash
source config.devshard.env

echo "DEVSHARD_CREATOR=$DEVSHARD_CREATOR"

curl -sS "$NODE_CHAIN_API/productscience/inference/inference/params" \
  | jq '.params.devshard_escrow_params | {min_amount, max_escrows_per_epoch, max_nonce, allowed_creator_addresses}'

curl -sS "$NODE_CHAIN_API/productscience/inference/inference/params" \
  | jq --arg addr "$DEVSHARD_CREATOR" \
    '.params.devshard_escrow_params.allowed_creator_addresses | index($addr) != null'
```

第二个命令必须打印 `true`。使用第一个命令读取实时限制（`min_amount`、`max_escrows_per_epoch`、`max_nonce`）。在主网上经过 [v0.2.13 升级](https://github.com/gonka-ai/gonka/blob/gm/microrelease/inference-chain/app/upgrades/v0_2_13/upgrades.go) 后，预期 `max_escrows_per_epoch` 为 **500,000**，`max_nonce` 为 **1,000,000**。如果打印 `false`，你的地址**未被允许**——在链上添加之前，请勿继续进行 [§2.5](#25-fund-the-creator-account)、[§3](#3-deploy-the-gateway) 或 [§4](#4-create-an-escrow-and-open-api-access)。

### 2.5 为创建者账户充值

仅在 [§2.4](#24-confirm-allowlist-membership) 返回 `true` 后，为创建者充值：

```bash
inferenced query bank balances "$DEVSHARD_CREATOR" \
  --node "$NODE_RPC" --chain-id "$CHAIN_ID" -o json --home "$INFERENCED_HOME" \
  | jq '.balances[] | select(.denom=="ngonka")'
```

发送足够的 **ngonka** 以覆盖托管存款（示例中为 `5000000000`，如果其 ≥ `min_amount`），以及创建/结算手续费和交易费用。如果你将启用自动托管轮换（[托管生命周期和轮换](#escrow-lifetime-and-rotation)），请为每个周期充值**多个**存款——而不仅限于 [§4](#4-create-an-escrow-and-open-api-access) 中的单个手动托管。

!!! tip "如何获取 GNK"

    GNK 可作为以太坊上的 WGNK（封装的 GNK）获取。通过 DEX 或点对点转账获取 WGNK，然后使用 [仪表板桥接界面](https://gonka.ai/cross-chain-transfers/ethereum-bridge/dashboard/) 将其桥接到 Gonka。仪表板会从你的以太坊钱包推导出正确的 `gonka1…` 地址，并在无需 CLI 工具的情况下处理存款。

---

## 部署网关

本节将启动网关进程。你**本地创建** `docker-compose.yml`；Docker **拉取**预构建镜像。你并未从网络下载 compose 文件，也未安装 Gonka 链节点。

网关读取 `config.devshard.env`，将状态存储在 `.devshardctl/` 下，并在主机的 `http://127.0.0.1:18080` 上监听。链上托管创建发生在 [§4](#4-create-an-escrow-and-open-api-access)；先启动网关是没问题的。


| 路径 | 用途 |
| --------------------- | ----------------------------------------- |
| `config.devshard.env` | 密钥和链 URL（主机 + 容器） |
| `docker-compose.yml` | Docker 如何运行 `devshardctl` |
| `.devshardctl/` | 网关数据库（首次 `up` 时创建） |


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

- `env_file` 将链 URL 和密钥注入容器。
- 卷挂载确保重启后注册的托管账户和管理设置保持不变。
- `127.0.0.1:18080` 仅将 API 绑定到 localhost；如果远程客户端需要访问，请在其前放置 nginx 或其他反向代理。

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

确认服务健康：

```bash
sudo docker compose ps
```

启动后，预期状态为 **running** 且健康状态为 **healthy**（显示 `devshardctl-multi` 或你的 `DEVSHARD_INSTANCE_NAME`）。

### 3.3 验证 HTTP API

```bash
curl -fsS http://127.0.0.1:18080/v1/status | jq '{runtimes, capacity: .capacity.models}'
```

JSON 响应表示网关已启动。在您完成 [§4](#4-create-an-escrow-and-open-api-access) 之前，托管账户可能为空。

聊天补全可用地址为：

`http://127.0.0.1:18080/v1/chat/completions`

(或您的反向代理转发到该端口的 URL)。

---

## 创建托管账户并开放 API 访问

**白名单检查：** `$DEVSHARD_CREATOR` 必须已在白名单中 ([§2.4](#24-confirm-allowlist-membership))。否则托管账户创建将在链上失败。

第 §4.1 节中的存款必须 **≥** 第 §2.4 节中的链上 `min_amount`。

### 4.1 创建并注册托管账户

当 `"register": true` 时，网关管理 API 将在链上创建托管账户并注册它。除非您在下方 [托管账户生命周期和轮换](#escrow-lifetime-and-rotation) 中启用自动轮换，否则托管账户将在您在 [§6](#6-finalize-and-settle-the-escrow) 中最终确认并结算前保持激活状态。

```bash
cd /srv/gonka/devshard-gateway
source config.devshard.env

CREATE_JSON=$(curl -sS -X POST http://127.0.0.1:18080/v1/admin/escrows \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"amount\": 5000000000,
    \"model_id\": \"MiniMaxAI/MiniMax-M2.7\",
    \"private_key\": \"$DEVSHARD_PRIVATE_KEY\",
    \"chain_id\": \"$CHAIN_ID\",
    \"register\": true
  }")
echo "$CREATE_JSON" | jq .

export ESCROW_ID=$(echo "$CREATE_JSON" | jq -r '.escrow_id')
echo "ESCROW_ID=$ESCROW_ID"
```

在本指南的剩余部分中，请保留 `ESCROW_ID` 在您的 shell 中。在新会话中，请再次设置它（例如 `export ESCROW_ID=1`）。

### 4.2 打开用户 API 访问

模型默认使用 `admin_only`，直到您启用 API 密钥访问：

```bash
curl -sS -X POST http://127.0.0.1:18080/v1/admin/settings \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "default_request_max_tokens": 3072,
    "request_max_tokens_cap": 4096,
    "model_limits": [{
      "model_id": "MiniMaxAI/MiniMax-M2.7",
      "access_mode": "api_key"
    }]
  }'
```

确认托管资金已加载：

```bash
curl -fsS http://127.0.0.1:18080/v1/status | jq .
curl -fsS http://127.0.0.1:18080/v1/admin/devshards \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" | jq .
```

### 运行多个托管资金（并行池）

一个网关进程可以同时服务**多个托管资金**。在首次启动时，通过容器环境中的 `**DEVSHARDS_JSON`** 注册它们，或之后使用 `**POST /v1/admin/devshards`** 或 `**POST /v1/admin/escrows**`（`"register": true`）添加更多。池化的 `**POST /v1/chat/completions**` 会为每个请求选择一个活跃的托管资金——**选择器**根据负载（正在进行的请求与容量权重）对运行时进行评分，并路由到与请求模型最匹配的托管资金。

`**GET /v1/status`** 在池模式下列出所有 devshard 以及限流器和容量；当只有一个托管资金时，其行为类似于简单代理。每个托管资金的管理调用使用 `**/devshard/{id}/…`** 前缀（例如 `**POST /devshard/{id}/v1/finalize**`）；仅当配置了单个托管资金时，裸 `**POST /v1/finalize**` 才有效。以下 [§5](#5-send-a-test-request)–[§6](#6-finalize-and-settle-the-escrow) 使用一个托管资金；当您需要更高吞吐量或跨周期轮换时，请使用池。

### 托管资金生命周期与轮换

本指南中 [§4.1](#41-create-and-register-the-escrow)–[§4.2](#42-open-user-api-access) 和 [§5](#5-send-a-test-request)–[§6](#6-finalize-and-settle-the-escrow) 的步骤介绍了**一个手动托管资金**。这是首次测试的正确模型。在主网上，网关还可以在周期边界之间**自动轮换**托管资金，以避免容量耗尽。

#### 手动托管资金能持续多久？

**网关中没有为手动创建的单个托管资金设置固定的墙钟过期时间**。


| 限制 | 含义 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **您的工作流** | 托管资金会持续提供聊天服务，直到您**完成并结算**（[§6](#6-finalize-and-settle-the-escrow)）。 |
| **链上周期** | 每个托管资金都绑定到其创建时的链**周期**（`epoch_index`）。这关系到协议存储和链规则，而非本指南中的简单“N 小时后过期”计时器。 |
| **余额** | 推理会消耗托管资金的存款。网关会定期检查活跃托管资金（约每**30秒**）。如果可用余额低于**1,000,000 ngonka**，则将其视为已耗尽。 |
| **Nonce 预算** | 链下 devshard 状态通过**nonce**推进。多托管资金网关在**19,800** nonce 附近停止路由新聊天（此限制在未来将大幅提高）。另外，`devshard_escrow_params.max_nonce` 是链上结算上限——请在 [§2.4](#24-confirm-allowlist-membership) 中查询（主网 v0.2.13 之后：**1,000,000**）。 |
| **链上限** | 治理设定 `max_escrows_per_epoch`：当前周期内链上允许的**devshard 托管资金总数上限**（非每个创建者）。请在 [§2.4](#24-confirm-allowlist-membership) 中查询实时值。主网 v0.2.13 之后为 **500,000**。 |


**默认行为：** `escrow_rotation` 默认**关闭**，需在管理设置中启用。关闭轮换时，网关**不会**在余额或 nonce 耗尽时自动创建替代托管资金——仅记录日志，可能停止将该托管资金用于新请求。请在存款耗尽前**完成并结算**，或启用轮换（如下）。

#### 网关会自动轮换吗？

**默认不会。** 自动轮换是可选功能，通过 `POST /v1/admin/settings` → `escrow_rotation` 配置。

当 `**escrow_rotation.enabled` 为 `true`** 时，后台任务约每**15秒**运行一次，协调托管资金与链的**周期 / PoC 计划**：

1. 在下一个周期切换**之前**（以即将到来的 `set_new_validators` 边界为准，而非仅“PoC 开始”）：为每个配置的模型创建 `**temp_count`** 临时“桥接”托管资金，然后**完成并结算**该模型的活跃**常规**托管资金（当 devshard 仍有进行中的请求时，跳过结算）。
2. **在链离开该过渡的 PoC 激活窗口后**：为每个模型创建 `**target_count`** 新的**常规**托管资金，然后**完成并结算**桥接窗口中的**临时**托管资金。

如果临时托管资金创建失败，网关可能会**提升**现有的常规托管资金作为临时角色，以避免您没有任何桥接托管资金。

启用轮换时，网关还可以通过创建新的链上托管资金并结算旧的托管资金来**替换**已耗尽的托管资金（余额低、nonce 高或请求中途余额耗尽）——**仅限 `escrow_rotation.models` 下列出的模型**。

**资金与轮换：** 每个周期过渡都会在之前的托管资金完成并结算之前创建**新的**链上托管资金（`temp_count` 桥接托管资金，然后每个模型创建 `target_count` 常规托管资金）。每次创建都会锁定 `amount` 来自 `$DEVSHARD_CREATOR`，直到结算返回未使用部分。请为每个模型、每个周期预留至少 `**(temp_count + target_count) × amount`** ngonka**，用于存款以及创建和结算交易的 gas，并保留额外余量，因为在轮换过程中桥接和常规托管资金可能短暂重叠。

#### 启用轮换（生产 / 常驻网关）

在您已手动创建、充值并测试至少一个托管资金（[§4](#4-create-an-escrow-and-open-api-access)）后使用此功能。轮换需要容器中具有相同的 `private_key_env`（例如 `DEVSHARD_PRIVATE_KEY`），且创建者账户有足够的 ngonka 用于上述存款，而不仅仅是一个托管资金的 `amount`。

单个模型示例（根据您的容量调整数量；生产操作员通常为每个模型运行多个常规托管资金，其中 `**temp_count`：1** 用于周期桥接）：

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
        "model_id": "MiniMaxAI/MiniMax-M2.7",
        "temp_count": 1,
        "target_count": 1,
        "amount": 5000000000,
        "private_key_env": "DEVSHARD_PRIVATE_KEY"
      }]
    }
  }'
```

无需重启：在设置中启用轮换即会在运行中的网关上启动轮换器。

检查时间安排和每个模型的最后一次轮换结果：

```bash
curl -fsS http://127.0.0.1:18080/v1/debug/rotation \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" | jq
```

有用字段包括 `chain.blocks_until_next_rotation`、`settings` 和 `latest`（每个模型的阶段、数量和错误）。

#### 如果轮换未运行或托管资金积压


| 症状 | 检查内容 |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 跨纪元无任何操作 | 确认设置中的 `"escrow_rotation": { "enabled": true, ... }`，且 `GET /v1/debug/rotation` 显示 `enabled: true`。 |
| 一次失败后即停止创建 | 网关在链上创建失败后（例如资金不足或每纪元托管限额）会**抑制对同一模型、角色和纪元的重复创建**。请阅读 `/v1/debug/rotation` 和 `docker logs` 了解 `escrow_rotation_`* / `escrow_depletion_replacement_failed`。 |
| 结算从未完成 | 结算会等待 devshard 没有**任何活跃请求**。在期望轮转结算完成前，请先清空或停止流量。 |
| 耗尽但无替换 | **替换需要启用轮转** 且 `escrow_rotation.models` 中存在匹配条目。否则请手动在 [§6](#6-finalize-and-settle-the-escrow) 中完成最终化和结算。 |
| 纪元时间错误 | 轮转使用实时链阶段数据；请确保 `DEVSHARD_PUBLIC_API` / 链 REST 指向您的主网节点（[§2.2](#22-create-configdevshardenv)）。 |


对于**单次手动测试**，请保持轮转**禁用**，完成 [§5](#5-send-a-test-request)，然后执行 [§6](#6-finalize-and-settle-the-escrow)。当您希望网关在跨纪元时自动保持最新托管而无需手动重建时，再启用轮转。

---

## 发送测试请求

网关端点与 OpenAI 兼容。设置您的 API 密钥并发送聊天补全请求：

```bash
source config.devshard.env

curl -sS http://127.0.0.1:18080/v1/chat/completions \
  -H "Authorization: Bearer $DEVSHARD_API_KEYS" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "MiniMaxAI/MiniMax-M2.7",
    "messages": [{"role": "user", "content": "How long do hamsters live?"}],
    "max_tokens": 32
  }' | jq '{id, content: .choices[0].message.content}'
```

片刻后，您应在 `content` 中看到模型回复。如果您收到 **401** 且提示 `"requires an admin API key"`，请重复 [§4.2](#42-open-user-api-access) 中的设置 POST 操作。

---

## 最终化并结算托管

完成推理后，网关会最终化离线 devshard 状态，然后您在链上提交结算。这两个步骤都需要 `source config.devshard.env` 以及来自 [§4.1](#41-create-and-register-the-escrow) 的非空 `ESCROW_ID`。

最终化是**按托管进行**的，必须使用路径 `/devshard/{id}/v1/finalize`，而非仅 `/v1/finalize`。

### 6.1 最终化离线状态

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

`-f` 会在发生 HTTP 错误时使 `curl` 失败，而不是写入空文件。一个**0字节**的 `settlement.json` 通常意味着 `ESCROW_ID` 为空（请求命中了 `/devshard//v1/finalize` 并返回了**404**且无响应体）。

如果最终化失败，请检查响应和网关日志：

```bash
curl -sS -w "\nHTTP %{http_code}\n" \
  -X POST "http://127.0.0.1:18080/devshard/${ESCROW_ID}/v1/finalize" \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY"
sudo docker logs devshardctl-multi --tail 80
```

### 6.2 链上结算

未使用的 ngonka 金额将在主机支付和协议费用后返还至您的创作者地址。

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

预期 `settled: true`。`amount` 字段是原始存款元数据；结算后，实时代币将返还至 `$DEVSHARD_CREATOR`。

创作者钱包余额（主要检查资金是否返还）：

```bash
source config.devshard.env

inferenced query bank balances "$DEVSHARD_CREATOR" \
  --node "$NODE_RPC" --chain-id "$CHAIN_ID" -o json --home "$INFERENCED_HOME" \
  | jq '.balances[] | select(.denom=="ngonka") | {denom, amount}'
```

结算后，大部分未使用的存款应返还至 `$DEVSHARD_CREATOR`，扣除推理成本、结算费用和交易 Gas。

---

## 暂停、重定向和停止网关

[§1](#1-install-tools-and-create-a-deploy-directory)–[§6](#6-finalize-and-settle-the-escrow) 部分涵盖单次测试托管。本节用于暂停路由、在请求时重定向客户端或关闭主机。

### 7.1 停用单个托管

在 [§6](#6-finalize-and-settle-the-escrow) 中完成结算后，托管记录仍保留在链上；**停用**仅停止此网关将新聊天路由至该托管。如果池中其他托管仍处于活跃状态，它们将继续提供服务。

```bash
source config.devshard.env

curl -sS -X POST "http://127.0.0.1:18080/v1/admin/devshards/${ESCROW_ID}/deactivate" \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY"
```

### 7.2 重定向所有客户端流量（网关关闭开关）

要通知 API 客户端停止使用此网关 URL，同时保留管理员权限（最终化、设置、导入、调试），请启用网关的**禁用**状态。非管理员请求（例如池化的 `/v1/chat/completions`）将收到 **HTTP 308** 及 JSON `status`、`message` 和 `new_url`。管理员路由（`/v1/admin/`*、`/v1/debug/*`、在 `/devshard/{id}/…` 下的每托管最终化）仍可通过管理员 API 密钥使用。

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

要恢复正常服务，请再次POST `"enabled": false`。仅在**首次**网关启动时，相同的标志可以从`config.devshard.env`中的`DEVSHARD_GATEWAY_DISABLED`、`DEVSHARD_GATEWAY_DISABLED_MESSAGE`和`DEVSHARD_GATEWAY_DISABLED_NEW_URL`引导（参见[gonka](https://github.com/gonka-ai/gonka)仓库中的网关环境模板）。在`gateway.db`存在后，使用`**POST /v1/admin/settings`**。

### 7.3 停止容器并可选清理

可选——删除本地网关记录（在容器仍运行且稳定后执行）：

```bash
source config.devshard.env

curl -sS -X DELETE "http://127.0.0.1:18080/v1/admin/devshards/${ESCROW_ID}" \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY"
```

停止Docker：

```bash
cd /srv/gonka/devshard-gateway
sudo docker compose down

# Optional: remove persisted gateway state
# sudo rm -rf .devshardctl
```

---

## 在不中断流量的情况下更新网关（热替换）

如果直接重启网关**镜像**或重新创建主容器，将中断正在进行的`/v1/chat/completions`流。生产环境操作员使用**双容器**模式：在主网关旁运行一个**临时**网关，通过**nginx别名**迁移公网流量并优雅地执行`nginx -s reload`，**排空**旧实例上的`active_requests`，更新主容器，切换回流量，然后**导入**临时暂存状态到主网关。

**网关提供的功能**：

- 第二个`devshardctl`进程（通常端口为**18081**），使用`DEVSHARDS_JSON=[]`以避免在启动时加载主暂存数据。
- 在临时实例上使用`POST /v1/admin/escrows`以资助临时桥接暂存。
- 使用`GET /v1/status`（或管理状态）确认`**active_requests`**为零后再停止实例。
- 在主网关上使用`POST /v1/admin/devshards/import`并设置`active: false`，然后在主网关上注册/激活，以确保临时暂存数据在切换过程中得以保留。
- 通过反向代理上游名称更改进行公网路由（无需完全重启聊天代理容器）。

**逐步操作手册**目前正在准备中。

---

## 相关

- [开发者快速入门](quickstart.md) - 社区经纪人；[通过OpenBroker成为经纪人](quickstart.md#recommended-become-a-broker-with-openbroker)；[GitHub白名单回退](quickstart.md#fallback-github-allow-list-request)

**需要帮助？** 请查看[常见问题](https://gonka.ai/FAQ/)，加入[Discord](https://discord.gg/REcpeYc7P7)，或仅当OpenBroker不适用时，在GitHub上提交[网关白名单请求](https://github.com/gonka-ai/gonka/issues/new?title=Gateway+allowlist+request)。
