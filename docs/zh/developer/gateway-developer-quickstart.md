# 运行你自己的网关

本指南说明了如何在 **gonka-mainnet** 上运行一个 Gonka devshard 网关，而无需安装完整的区块链节点。你将在自己的 Linux 主机上部署该网关，为专用的托管创建者地址充值，打开链上 devshard 托管账户，发送兼容 OpenAI 的推理请求，并在完成后结算该托管账户。

如果你仅需通过现有端点获取推理服务，请改用 [社区代理](quickstart.md#1-use-a-community-broker-recommended) —— 此路径不需要 Docker、链上托管账户或白名单内的创建者地址。

### 需要白名单内的创建者地址

> **前提条件**：你的 devshard 托管创建者（来自 `DEVSHARD_PRIVATE_KEY` 的 `$DEVSHARD_CREATOR`）所对应的 `gonka1…` 地址 **必须** 出现在链上白名单 `devshard_escrow_params.allowed_creator_addresses` 中，**才能** 创建托管账户。
>
> 该白名单通过链上 **治理机制** 进行维护。你无法通过 `config.devshard.env` 或管理设置自行添加。请通过链上治理投票申请加入 —— 参见开发者快速入门中的 [成为代理](quickstart.md#3-become-a-broker)，或改用 [社区代理](quickstart.md#1-use-a-community-broker-recommended)。
>
> 在 [第 2.3 节](#23-导入创建者密钥) 导入密钥后，请在 [第 2.4 节](#24-确认白名单成员资格) 验证是否已列入白名单。在确认通过前，请勿为创建者地址充值或部署网关（仅充值无法获得白名单权限）。

!!! warning "生产网络"```
Mainnet escrows and fees use **real** ngonka. Confirm `devshard_escrow_params.min_amount` on chain (§2.4) before funding or creating an escrow. The example deposit below must be **≥ `min_amount`**.
```### 此配置的工作原理

Gonka 推理围绕 **devshard**（devshard）组织——即由少量链上存款（托管资金）支持的短期会话。一个 **网关**（gateway）负责开启托管账户，将 `/v1/chat/completions` 请求路由到网络，协调链下结算状态，并向区块链提交 finalize/settle（最终化/结算）交易。

在 **仅网关**（gateway-only）服务器上，你仅运行网关容器（`devshardctl`）。链访问使用公共的 REST/RPC URL，无需在同一台机器上运行 CometBFT、`api` 或 `mlnode`。

### 你需要准备的内容

1. **已列入白名单的托管创建者** —— `$DEVSHARD_CREATOR` 需在 `allowed_creator_addresses` 中（见上述[前置条件](#allowlisted-creator-address-required)；在[第2.4节](#24-confirm-allowlist-membership)中确认）
2. 一台安装了 Docker 的 Linux 主机
3. 可访问公共 Gonka 主网节点的出站 HTTPS（例如 [node3](https://node3.gonka.ai/)，用于链 REST + 公共 API）
4. 在同一主机上安装 [inferenced CLI v0.2.13](https://github.com/gonka-ai/gonka/releases/tag/release/v0.2.13)（用于查询和链上结算）
5. 一个已充值的 `gonka1…` 地址，**仅**用作该托管账户创建者（在确认加入白名单后使用）

### 主网参考信息

| 项目                     | 值                                                           |
| ------------------------ | --------------------------------------------------------------- |
| 链 ID                    | `gonka-mainnet`                                                 |
| 模型（示例）             | `MiniMaxAI/MiniMax-M2.7`                        |
| 托管存款（示例）         | `5000000000` ngonka（约 5 GONKA）；必须 ≥ 链上 `min_amount`     |
| 公共节点（示例）         | `https://node3.gonka.ai`                                        |
| CometBFT RPC（示例）     | `https://node3.gonka.ai/chain-rpc/`                             |
| 网关镜像                 | `libermans/gonka-devshard-proxy:latest`                         |

将链 URL 复制到 [第2.2节](#22-create-configdevshardenv) 中的 `config.devshard.env` 文件。以下所有命令均假设你已在部署目录中执行过 `source config.devshard.env`。

---

## 1. 安装工具并创建部署目录

### 1.1 安装 Docker 和 `inferenced`

确认 Docker 已安装并可用：```bash
docker --version
```从 [发布页面](https://github.com/gonka-ai/gonka/releases/tag/release/v0.2.13) 下载 **inferenced v0.2.13**：```bash
curl -fsSL -o /tmp/inferenced-amd64.zip \
  "https://github.com/gonka-ai/gonka/releases/download/release/v0.2.13/inferenced-amd64.zip"
unzip -o /tmp/inferenced-amd64.zip -d "$HOME/bin"
chmod +x "$HOME/bin/inferenced"
export PATH="$HOME/bin:$PATH"
inferenced version   # should report v0.2.13

export INFERENCED_HOME="$HOME/.devshard-inferenced"
export INFERENCED_KEYRING="$INFERENCED_HOME/keyring-devshard"
mkdir -p "$INFERENCED_HOME" "$INFERENCED_KEYRING"
````INFERENCED_HOME` 用于将 CLI 状态与默认的 `~/.inference` 安装路径分离。`INFERENCED_KEYRING` 仅是导入密钥的文件夹名称。

### 1.2 创建部署目录

为 `config.devshard.env`、`docker-compose.yml` 和网关数据使用一个单独的目录。以下示例使用 `/srv/gonka/devshard-gateway`。

创建该目录，并**确保其所有者为你的登录用户**：```bash
sudo mkdir -p /srv/gonka/devshard-gateway
sudo chown "$USER:$USER" /srv/gonka/devshard-gateway
cd /srv/gonka/devshard-gateway
```---

## 2. 准备身份和配置

### 2.1 生成 API 密钥和托管钱包

从部署目录中生成密钥，并保存输出内容以供下一步使用：```bash
printf 'export DEVSHARD_PRIVATE_KEY=%s\n' "$(openssl rand -hex 32)"
printf 'export DEVSHARD_API_KEYS=sk-%s\n' "$(openssl rand -hex 24)"
printf 'export DEVSHARD_ADMIN_API_KEY=sk-admin-%s\n' "$(openssl rand -hex 24)"
````DEVSHARD_PRIVATE_KEY` 是一个**专用的托管创建者**钱包。请勿重复使用验证节点、参与方或代理的密钥。

### 2.2 创建 `config.devshard.env`

此文件必须在执行 `source config.devshard.env` 或 `docker compose up` 之前存在。Docker Compose 将会把该文件中的内容加载到容器中。```bash
nano config.devshard.env
```主网示例内容（从[§2.1](#21-generate-api-keys-and-escrow-wallet)粘贴密钥）：```bash
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
```在第一个托管（escrow）存在之前，多托管模式需要设置 `DEVSHARDS_JSON='[]'`。如果没有设置，容器将期望 `DEVSHARD_ESCROW_ID`（单托管模式），并会退出，直到你设置该变量。

请锁定权限并验证公共节点：```bash
chmod 600 config.devshard.env
mkdir -p "$INFERENCED_HOME" "$INFERENCED_KEYRING"

cd /srv/gonka/devshard-gateway
source config.devshard.env
curl -fsS "${NODE_RPC}status" | jq '.result.sync_info.latest_block_height'
```你应该看到一个最近的区块高度。可选——列出治理模型：```bash
curl -sS "$NODE_BASE/v1/governance/models" | jq
```### 2.3 导入创建者密钥```bash
source config.devshard.env

test -f config.devshard.env
test -n "$DEVSHARD_PRIVATE_KEY"
````--keyring-backend test` 是 Cosmos SDK 的后端名称（本地开发密钥环）。```bash
inferenced keys import-hex devshard-create "$DEVSHARD_PRIVATE_KEY" \
  --keyring-backend test \
  --keyring-dir "$INFERENCED_KEYRING" \
  --home "$INFERENCED_HOME"
```如果导入提示密钥已存在，则跳过导入。

解析链上创建者地址：```bash
export DEVSHARD_CREATOR="$(inferenced keys show devshard-create -a \
  --keyring-backend test \
  --keyring-dir "$INFERENCED_KEYRING" \
  --home "$INFERENCED_HOME")"
echo "DEVSHARD_CREATOR=$DEVSHARD_CREATOR"
```可选 — 将 `DEVSHARD_CREATOR` 持久化到环境文件中（仅需运行一次）：```bash
grep -q '^export DEVSHARD_CREATOR=' config.devshard.env || \
  echo "export DEVSHARD_CREATOR=$DEVSHARD_CREATOR" >> config.devshard.env
```名称 `devshard-create` 仅为本地标签；链上交易使用 `--from devshard-create` 以 `$DEVSHARD_CREATOR` 身份进行签名。

### 2.4 确认准入名单成员资格

**请勿跳过此步骤。** 在 [第4节](#4-create-an-escrow-and-open-api-access) 中创建托管账户仅在 `$DEVSHARD_CREATOR` 位于链上准入名单中时才会成功。

使用网关时，你**无需**运行验证器；你只需确保创建者地址在 `devshard_escrow_params.allowed_creator_addresses` 列表中。如果该地址缺失，请立即停止并按照[成为中介](quickstart.md#3-become-a-broker)的指引，申请治理参数更新。在创建托管账户之前，每次治理投票后都应重新运行此检查。```bash
source config.devshard.env

echo "DEVSHARD_CREATOR=$DEVSHARD_CREATOR"

curl -sS "$NODE_CHAIN_API/productscience/inference/inference/params" \
  | jq '.params.devshard_escrow_params | {min_amount, max_escrows_per_epoch, max_nonce, allowed_creator_addresses}'

curl -sS "$NODE_CHAIN_API/productscience/inference/inference/params" \
  | jq --arg addr "$DEVSHARD_CREATOR" \
    '.params.devshard_escrow_params.allowed_creator_addresses | index($addr) != null'
```第二个命令必须输出 `true`。使用第一个命令读取实时限制（`min_amount`、`max_escrows_per_epoch`、`max_nonce`）。在主网上，[v0.2.13 升级](https://github.com/gonka-ai/gonka/blob/gm/microrelease/inference-chain/app/upgrades/v0_2_13/upgrades.go) 后，预期 `max_escrows_per_epoch` 为 **500,000**，`max_nonce` 为 **1,000,000**。如果输出为 `false`，则表示你的地址**未**被列入白名单——在链上添加之前，请不要继续进行 [§2.5](#25-fund-the-creator-account)、[§3](#3-deploy-the-gateway) 或 [§4](#4-create-an-escrow-and-open-api-access)。

### 2.5 为创建者账户注资

只有在 [§2.4](#24-confirm-allowlist-membership) 返回 `true` 之后，才可为创建者注资：```bash
inferenced query bank balances "$DEVSHARD_CREATOR" \
  --node "$NODE_RPC" --chain-id "$CHAIN_ID" -o json --home "$INFERENCED_HOME" \
  | jq '.balances[] | select(.denom=="ngonka")'
```发送足够的 **ngonka** 以覆盖托管存款（示例中为 `5000000000`，前提是该金额 ≥ `min_amount`），并支付创建/结算所需的 Gas 费和交易费用。如果你将启用自动托管轮换（[托管有效期与轮换](#escrow-lifetime-and-rotation)），请为创建者提供足够支持每个纪元进行**多次**存款的资金——而不仅是在[第4节](#4-create-an-escrow-and-open-api-access)中手动创建一次托管。

---

## 3. 部署网关

本节将启动网关进程。你需要在本地**创建** `docker-compose.yml` 文件，Docker 将自动**拉取**预构建的镜像。你无需从网络下载 compose 文件，也无需安装 Gonka 区块链节点。

网关会读取 `config.devshard.env` 文件，将状态数据存储在 `.devshardctl/` 目录下，并在主机的 `http://127.0.0.1:18080` 上监听。链上托管的创建将在[第4节](#4-create-an-escrow-and-open-api-access)中进行；先启动网关是完全可行的。

| 路径                  | 用途                                   |
| --------------------- | ----------------------------------------- |
| `config.devshard.env` | 密钥和区块链 URL（主机与容器共用）         |
| `docker-compose.yml`  | Docker 运行 `devshardctl` 的配置文件       |
| `.devshardctl/`       | 网关数据库（首次运行 `up` 时创建）         |

所有命令均假设：```bash
cd /srv/gonka/devshard-gateway
```### 3.1 创建 `docker-compose.yml````bash
nano docker-compose.yml
```仅网关的 compose（不包含 `node` 或 `api` 服务）：```yaml
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
```- `env_file` 将链的 URL 和密钥注入容器中。
- 卷挂载在重启后保留已注册的托管账户和管理员设置。
- `127.0.0.1:18080` 仅将 API 绑定到本地主机；如果远程客户端需要访问，请在其前面配置 nginx 或其他反向代理。

### 3.2 拉取镜像并启动容器

加载环境变量并拉取镜像：```bash
cd /srv/gonka/devshard-gateway
source config.devshard.env
sudo docker compose pull
```在后台启动网关：```bash
sudo docker compose up -d
```确认服务是否健康：```bash
sudo docker compose ps
```预期 `devshardctl-multi`（或你的 `DEVSHARD_INSTANCE_NAME`）在启动期后处于 **running** 状态，且健康状况为 **healthy**。

### 3.3 验证 HTTP API```bash
curl -fsS http://127.0.0.1:18080/v1/status | jq '{runtimes, capacity: .capacity.models}'
```JSON 响应表示网关已启动。在完成 [§4](#4-创建托管并开通-api-访问) 之前，托管列表可能为空。

聊天补全接口可通过以下地址访问：

`http://127.0.0.1:18080/v1/chat/completions`

（或你的反向代理转发到该端口的 URL）。

---

## 4. 创建托管并开通 API 访问

**白名单检查**：`$DEVSHARD_CREATOR` 必须已加入白名单（参见 [§2.4](#24-确认白名单成员身份)），否则链上创建托管将失败。

§4.1 中的存款金额必须 **≥** §2.4 中链上查询到的 `min_amount`。

### 4.1 创建并注册托管

网关管理 API 可用于创建链上托管，并在 `"register": true` 时完成注册。该托管将保持激活状态，直到你在 [§6](#6-完成并结算托管) 中完成最终结算，除非你在下方的[托管生命周期与轮换](#托管生命周期与轮换)中启用了自动轮换功能。```bash
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
```在本指南的其余部分，请在 shell 中保留 `ESCROW_ID`。在新的会话中，请重新设置它（例如 `export ESCROW_ID=1`）。

### 4.2 开启用户 API 访问

模型默认为仅限管理员访问（`admin_only`），直到您启用 API 密钥访问：```bash
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
```确认托管已加载：```bash
curl -fsS http://127.0.0.1:18080/v1/status | jq .
curl -fsS http://127.0.0.1:18080/v1/admin/devshards \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" | jq .
```### 运行多个托管（并行池）

一个网关进程可以**同时服务多个托管**。可以在容器环境变量中通过 `**DEVSHARDS_JSON`** 在首次启动时注册它们，或之后使用 `**POST /v1/admin/devshards`** 或 `**POST /v1/admin/escrows`**（设置 `"register": true`）添加更多。在池模式下，`**POST /v1/chat/completions`** 会为每个请求选择一个活跃的托管——**选择器**会根据运行时的负载（进行中的请求数与容量权重）进行评分，并将请求路由到与所请求模型最匹配的托管。

在池模式下，`**GET /v1/status`** 会列出所有 devshard 以及限流器和容量信息；当仅配置了一个托管时，其行为与简单代理相同。针对单个托管的管理接口使用 `**/devshard/{id}/…`** 前缀（例如 `**POST /devshard/{id}/v1/finalize`**）；而裸路径 `**POST /v1/finalize`** 仅在配置了单个托管时有效。本文档中 [§5](#5-send-a-test-request)–[§6](#6-finalize-and-settle-the-escrow) 使用单个托管示例；当你需要更高吞吐量或跨纪元轮换时，请使用池模式。

### 托管生命周期与轮换

本指南中 [§4.1](#41-create-and-register-the-escrow)–[§4.2](#42-open-user-api-access) 和 [§5](#5-send-a-test-request)–[§6](#6-finalize-and-settle-the-escrow) 的步骤演示了**一次手动创建托管**的过程。这对首次测试是合适的模型。在主网上，网关也可以在纪元边界自动**轮换**托管，以避免容量耗尽。

#### 手动托管的生命周期是多久？

**网关对用户自行创建的单个托管没有固定的时钟超时限制**。

| 限制 | 含义 |
|------|------|
| **你的工作流** | 托管将持续提供聊天服务，直到你手动执行**终结并结算**（见 [§6](#6-finalize-and-settle-the-escrow)）。 |
| **链上纪元** | 每个托管与其创建时所在的链**纪元**（`epoch_index`）绑定。这对协议存储和链规则很重要，但本指南中不涉及“N小时后自动过期”这类简单计时机制。 |
| **余额** | 推理过程会消耗托管的存款。网关大约每 **30 秒**检查一次活跃托管。如果可用余额低于 **1,000,000 ngonka**，则视为托管已耗尽。 |
| **Nonce 预算** | 链下 devshard 状态通过 **nonce** 推进。多托管网关会在 nonce 接近 **19,800** 时停止为新聊天请求路由（此限制未来将大幅提高）。另外，`devshard_escrow_params.max_nonce` 是链上结算的上限值——可在 [§2.4](#24-confirm-allowlist-membership) 中查询（主网 v0.2.13 之后为 **1,000,000**）。 |
| **链上限额** | 治理机制设置了 `max_escrows_per_epoch`：当前纪元中全链允许的**devshard 托管总数上限**（非每个创建者）。可在 [§2.4](#24-confirm-allowlist-membership) 查询实时值。主网 v0.2.13 之后该值为 **500,000**。 |

**默认行为**：`escrow_rotation` 在管理员设置中**默认关闭**。关闭轮换时，当余额或 nonce 耗尽，网关**不会**自动创建替代托管——仅记录日志，并可能停止将新请求路由至该托管。建议在存款耗尽前**手动终结并结算**，或启用自动轮换（如下所述）。

#### 网关是否会自动轮换？

**默认不会**。自动轮换是可选功能，需通过 `POST /v1/admin/settings` 设置 `escrow_rotation` 启用。

当 `**escrow_rotation.enabled` 为 `true`** 时，后台任务约每 **15 秒**运行一次，并根据链的**纪元 / PoC 时间表**协调托管：

1. 在下一次纪元切换前的 `**pre_poc_blocks`**（以即将到来的 `set_new_validators` 边界为准，而非仅“PoC 开始”）：对每个配置的模型，创建 `**temp_count`** 个临时“桥接”托管，然后**终结并结算**该模型当前的**常规**托管（若 devshard 仍有进行中的请求，则跳过结算）。
2. **在链离开该次转换的 PoC 活跃窗口后**：为每个模型创建 `**target_count`** 个新的**常规**托管，然后**终结并结算**桥接阶段的**临时**托管。

如果临时托管创建失败，网关可能会将现有的常规托管**提升**为临时角色，以避免无桥接托管可用。

启用轮换后，网关还可以为已耗尽的托管（余额低、nonce 高，或请求中途耗尽）**替换**：创建新的链上托管并结算旧的——但**仅适用于 `escrow_rotation.models` 中列出的模型**。

**资金与轮换**：每次纪元转换都会先创建**新的**链上托管（每模型创建 `temp_count` 个桥接托管，再创建 `target_count` 个常规托管），然后才结算之前的托管。每次创建都会从 `$DEVSHARD_CREATOR` 锁定一笔 `amount`，直到结算返还未使用部分。请确保创建者钱包余额至少为每模型每纪元 `(temp_count + target_count) × amount` **ngonka**，外加创建和结算交易的 gas 费用，并保留额外余量，因为在轮换过程中桥接和常规托管可能短暂重叠。

#### 启用轮换（生产环境 / 持续运行的网关）

请在已手动创建、注资并测试至少一个托管后（见 [§4](#4-create-an-escrow-and-open-api-access)）再启用此功能。轮换需要容器中配置相同的 `private_key_env`（例如 `DEVSHARD_PRIVATE_KEY`），且创建者账户需有足够的 ngonka 支持上述多次存款，而不仅仅是一个托管的 `amount`。

示例（单个模型，可根据容量调整数量；生产环境中通常为每个模型运行多个常规托管，`**temp_count`: 1** 用于纪元桥接）：```bash
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
```无需重启：在设置中启用轮换功能后，会立即在运行的网关上启动轮换器。

检查轮换时间及每个模型的上一次轮换结果：```bash
curl -fsS http://127.0.0.1:18080/v1/debug/rotation \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" | jq
```有用的字段包括 `chain.blocks_until_next_rotation`、`settings` 和 `latest`（按模型的阶段、计数和错误信息）。

#### 如果轮换未运行或托管余额积压

| 症状                         | 需检查内容                                                                                                                                                                                                                                                                                |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 跨多个 epoch 均无操作         | 确认 settings 中包含 `"escrow_rotation": { "enabled": true, ... }`，并且 `GET /v1/debug/rotation` 返回 `enabled: true`。                                                                                                                                                                    |
| 一次失败后即停止创建         | 网关在链上创建失败后（例如资金不足或超出每 epoch 托管限额），会**抑制**针对相同模型、角色和 epoch 的重复创建。请查阅 `/v1/debug/rotation` 和 `docker logs` 中的 `escrow_rotation_`* 或 `escrow_depletion_replacement_failed` 日志。 |
| 结算始终无法完成             | 结算需等待 devshard **无活跃请求**时才能进行。在预期轮换结算完成前，请先清空或停止流量。                                                                                                                                                                                                   |
| 托管耗尽但未替换             | **替换需要启用轮换**，并且 `escrow_rotation.models` 中需有对应条目。否则，请手动完成[第6节](#6-finalize-and-settle-the-escrow)中的最终化和结算。                                                                                                                                          |
| epoch 时间不正确             | 轮换依赖链上的实时阶段数据；请确保 `DEVSHARD_PUBLIC_API` / chain 指向你的主网节点（参见[第2.2节](#22-create-configdevshardenv)）。                                                                                                                                                         |

如需进行**单次手动测试**，请保持轮换**禁用**状态，先完成[第5节](#5-send-a-test-request)，然后执行[第6节](#6-finalize-and-settle-the-escrow)。当你希望网关在多个 epoch 间自动维护最新托管余额而无需手动重建时，再启用轮换功能。

---

## 5. 发送测试请求

网关端点兼容 OpenAI 接口。设置你的 API 密钥并发送一个聊天补全请求：```bash
source config.devshard.env

curl -sS http://127.0.0.1:18080/v1/chat/completions \
  -H "Authorization: Bearer $DEVSHARD_API_KEYS" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "MiniMaxAI/MiniMax-M2.7",
    "messages": [{"role": "user", "content": "How long do hamsters live?"}],
    "max_tokens": 32
  }' | jq '{id, content: .choices[0].message.content}'
```稍后，你应该会在 `content` 中看到模型的回复。如果收到 **401** 错误并提示 `"requires an admin API key"`，请回到[第4.2节](#42-open-user-api-access)重新执行设置的 POST 请求。

---

## 6. 完成并结算托管资金

完成推理后，网关会先终结链下 devshard 的状态，然后你需在链上提交结算。这两个步骤都需要先执行 `source config.devshard.env`，并确保 [§4.1](#41-create-and-register-the-escrow) 中设置的 `ESCROW_ID` 非空。

终结操作是**针对每个托管资金**进行的，必须使用路径 `/devshard/{id}/v1/finalize`，而不能仅使用 `/v1/finalize`。

### 6.1 终结链下状态```bash
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
````-f` 参数会使 `curl` 在遇到 HTTP 错误时失败，而不是写入一个空文件。一个 **0 字节** 的 `settlement.json` 文件通常意味着 `ESCROW_ID` 为空（请求发送到了 `/devshard//v1/finalize`，返回了 **404** 且无响应体）。

如果 finalize 失败，请检查响应内容以及网关日志：```bash
curl -sS -w "\nHTTP %{http_code}\n" \
  -X POST "http://127.0.0.1:18080/devshard/${ESCROW_ID}/v1/finalize" \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY"
sudo docker logs devshardctl-multi --tail 80
```### 6.2 链上结算

未使用的 ngonka 金额将在向托管方支付和协议费用扣除后，退还至您的创建者地址。```bash
source config.devshard.env

curl -sS -X POST "http://127.0.0.1:18080/v1/admin/devshards/${ESCROW_ID}/settle" \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"private_key_env":"DEVSHARD_PRIVATE_KEY"}'
```### 6.3 确认结算和退款

链上托管状态：```bash
source config.devshard.env

inferenced query inference show-devshard-escrow "$ESCROW_ID" \
  --node "$NODE_RPC" --chain-id "$CHAIN_ID" -o json --home "$INFERENCED_HOME" \
  | jq '{id: .escrow.id, settled: .escrow.settled, creator: .escrow.creator, amount: .escrow.amount}'
```预期 `settled: true`。`amount` 字段是原始存款元数据；结算后，活跃代币将返还至 `$DEVSHARD_CREATOR`。

创建者钱包余额（主要检查资金是否已返还）：```bash
source config.devshard.env

inferenced query bank balances "$DEVSHARD_CREATOR" \
  --node "$NODE_RPC" --chain-id "$CHAIN_ID" -o json --home "$INFERENCED_HOME" \
  | jq '.balances[] | select(.denom=="ngonka") | {denom, amount}'
```结算后，大部分未使用的存款应退还给 `$DEVSHARD_CREATOR`，仅扣除推理成本、结算费用和交易 Gas 费用。

---

## 7. 暂停、重定向和停止网关

第 [§1](#1-安装工具和创建部署目录) 至 [§6](#6-完成并结算托管账户) 节涵盖单个测试托管账户的流程。本节介绍如何暂停路由、按需重定向客户端或关闭主机。

### 7.1 停用单个托管账户

在 [§6](#6-完成并结算托管账户) 中完成结算后，托管账户记录仍保留在链上；**停用** 仅表示该网关不再将新的聊天请求路由到该托管账户。池中其他仍处于激活状态的托管账户将继续提供服务。```bash
source config.devshard.env

curl -sS -X POST "http://127.0.0.1:18080/v1/admin/devshards/${ESCROW_ID}/deactivate" \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY"
```### 7.2 重定向所有客户端流量（网关熔断开关）

在保留管理员访问权限（如完成操作、设置、导入、调试）的同时，若需通知 API 客户端停止使用此网关 URL，请启用网关的**禁用**状态。非管理员请求（例如共用的 `/v1/chat/completions`）将收到 **HTTP 308** 响应，其中包含 JSON 格式的 `status`、`message` 和 `new_url` 字段。而管理员路由（如 `/v1/admin/*`、`/v1/debug/*` 以及 `/devshard/{id}/…` 下的按托管完成接口）仍可通过管理员 API 密钥正常访问。```bash
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
```要恢复正常服务，需再次发送 POST 请求，内容为 `"enabled": false`。**仅在首次**启动网关时，可通过 `config.devshard.env` 中的 `DEVSHARD_GATEWAY_DISABLED`、`DEVSHARD_GATEWAY_DISABLED_MESSAGE` 和 `DEVSHARD_GATEWAY_DISABLED_NEW_URL` 参数进行引导配置（参见 [gonka](https://github.com/gonka-ai/gonka) 仓库中的网关环境模板）。一旦 `gateway.db` 文件已存在，请使用 `**POST /v1/admin/settings**` 接口进行配置。

### 7.3 停止容器及可选的清理操作

（可选）移除本地网关记录（建议在容器仍在运行且已稳定后执行）：```bash
source config.devshard.env

curl -sS -X DELETE "http://127.0.0.1:18080/v1/admin/devshards/${ESCROW_ID}" \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY"
```停止 Docker：```bash
cd /srv/gonka/devshard-gateway
sudo docker compose down

# Optional: remove persisted gateway state
# sudo rm -rf .devshardctl
```---

## 8. 无损更新网关（热替换）

直接替换网关的 **镜像** 或重建主容器会导致正在进行的 `/v1/chat/completions` 流式请求中断。生产环境中通常采用 **双容器** 模式：并行运行一个 **临时** 网关实例，通过 **nginx 别名** 切换公网流量，并使用优雅的 `nginx -s reload` 重新加载配置，** draining **（排空）旧实例上的 `active_requests`，更新主容器后，再将流量切回，并将临时实例的托管状态 **导入** 到主网关中。

**网关提供的功能支持**：

- 第二个 `devshardctl` 进程（通常为端口 **18081**），配置 `DEVSHARDS_JSON=[]`，使其启动时不加载主托管账户。
- 在临时实例上调用 `POST /v1/admin/escrows` 接口，为临时桥接托管账户注资。
- 通过 `GET /v1/status`（或管理员状态接口）确认 `**active_requests**` 为零后再停止旧实例。
- 在主实例上调用 `POST /v1/admin/devshards/import`，设置 `active: false`，然后在主实例上注册并激活，确保临时托管账户在切换后仍保留。
- 通过反向代理的 upstream 名称变更实现公网路由切换（无需重启整个代理容器即可完成聊天流量切换）。

**详细操作步骤指南** 正在准备中。

---

## 相关内容

- [开发者快速入门](quickstart.md) — 社区代理节点及 [成为代理节点](quickstart.md#3-become-a-broker)

**需要帮助？** 查看 [FAQ](https://gonka.ai/FAQ/)，加入 [Discord](https://discord.com/invite/RADwCT2U6R)，或在 GitHub 上提交 [代理节点 / 白名单申请](https://github.com/gonka-ai/gonka/issues/new?title=Request+to+be+added+as+a+Gonka+broker)。