# 运行你自己的网关

本指南介绍如何在 **gonka-mainnet** 上运行 Gonka devshard 网关，而无需安装完整的链节点。你将在自己的 Linux 主机上部署网关，为专用的托管创建者地址注资，开启链上 devshard 托管，发送兼容 OpenAI 的推理请求，并在完成后结算托管。

如果你只需要通过现有端点进行推理，请改用 [社区代理](quickstart.md#1-use-a-community-broker-recommended) —— 该路径不需要 Docker、链上托管或白名单创建者地址。

### 需要白名单创建者地址

> **前提条件：** 你的 devshard 托管创建者（`gonka1…`，来自 `$DEVSHARD_CREATOR`）的 `DEVSHARD_PRIVATE_KEY` 地址 **必须** 出现在链上白名单 `devshard_escrow_params.allowed_creator_addresses` 中，**才能** 创建托管。
>
> 白名单通过 **治理** 在链上维护。你不能通过 `config.devshard.env` 或管理员设置自行添加。请通过链上治理投票申请加入 —— 参见开发者快速入门中的 [成为代理](quickstart.md#3-become-a-broker)，或改用 [社区代理](quickstart.md#1-use-a-community-broker-recommended)。
>
> 在 [§2.3](#23-import-the-creator-key) 导入密钥后，请在 [§2.4](#24-confirm-allowlist-membership) 验证白名单成员资格。在验证通过前，不要为创建者注资或部署网关（仅注资不会获得白名单访问权限）。

!!! warning “生产网络”
    主网托管和费用使用 **真实** ngonka。在注资或创建托管前，请在链上确认 `devshard_escrow_params.min_amount`。下面示例中的存款必须 **≥ `min_amount`**。

### 此设置的工作原理

Gonka 推理围绕 **devshards** 组织 —— 由少量链上存款（托管）支持的短期会话。**网关** 打开托管，将 `/v1/chat/completions` 路由到网络，协调链下结算状态，并向链提交 finalize/settle 交易。

在 **仅网关** 服务器上，你只运行网关容器（`devshardctl`）。链访问使用公共 REST/RPC URL。你无需在同一台机器上运行 CometBFT、`api` 或 `mlnode`。

### 你需要什么

1. **白名单托管创建者** — 在 `allowed_creator_addresses` 上的 `$DEVSHARD_CREATOR`（上述[前提条件](#allowlisted-creator-address-required)；在 [§2.4](#24-confirm-allowlist-membership) 中确认）
2. 一台带有 Docker 的 Linux 主机
3. 出站 HTTPS 访问公共 Gonka 主网端点（[node3](https://node3.gonka.ai/) 用于链 REST + 公共 API）
4. 在同一主机上安装 [inferenced CLI v0.2.13](https://github.com/gonka-ai/gonka/releases/tag/release/v0.2.13)（用于查询和链上结算）
5. 一个已注资的 `gonka1…` 地址，**仅** 用作该托管创建者（在确认白名单后）

### 主网参考


| 项目 | 值 |
| --- | --- |
| 链 ID | `gonka-mainnet` |
| 模型（示例） | `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` |
| 托管存款（示例） | `5000000000` ngonka（约 5 GONKA）；必须 ≥ 链上 `min_amount` |
| 公共节点（示例） | `https://node3.gonka.ai` |
| CometBFT RPC（示例） | `https://node3.gonka.ai/chain-rpc/` |
| 网关镜像 | `libermans/gonka-devshard-proxy:latest` |


将链 URL 复制到 [§2.2](#22-create-configdevshardenv) 中的 `config.devshard.env`。以下每个命令都假设你已从部署目录运行 `source config.devshard.env`。

---

## 1. 安装工具并创建部署目录

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

`INFERENCED_HOME` 使 CLI 状态与默认的 `~/.inference` 安装相互分离。`INFERENCED_KEYRING` 仅是导入密钥的文件夹名称。

### 1.2 创建部署目录

为 `config.devshard.env`、`docker-compose.yml` 和网关数据使用一个目录。下面的示例使用 `/srv/gonka/devshard-gateway`。

创建一个**由你的登录用户拥有**的目录：

```bash
sudo mkdir -p /srv/gonka/devshard-gateway
sudo chown "$USER:$USER" /srv/gonka/devshard-gateway
cd /srv/gonka/devshard-gateway
```

---

## 2. 准备身份和配置

### 2.1 生成API密钥和托管钱包

从deploy目录生成密钥并保存输出，供下一步使用：

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

主网示例内容（从[§2.1](#21-generate-api-keys-and-escrow-wallet)粘贴密钥）：

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

`DEVSHARDS_JSON='[]'` 在首次托管之前，多托管模式需要此选项。如果没有它，容器将期望 `DEVSHARD_ESCROW_ID`（单托管模式），并且会退出，直到您设置一个。

锁定权限并验证公共节点：

```bash
chmod 600 config.devshard.env
mkdir -p "$INFERENCED_HOME" "$INFERENCED_KEYRING"

cd /srv/gonka/devshard-gateway
source config.devshard.env
curl -fsS "${NODE_RPC}status" | jq '.result.sync_info.latest_block_height'
```

您应该看到一个最近的区块高度。可选——列出治理模型：

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

名称 `devshard-create` 只是一个本地标签；链上交易使用 `--from devshard-create` 作为 `$DEVSHARD_CREATOR` 签名。

### 2.4 确认准入名单成员资格

**不要跳过此步骤。** 只有当 `$DEVSHARD_CREATOR` 在链的准入名单上时，[§4](#4-create-an-escrow-and-open-api-access) 中的托管创建才会成功。

你使用网关时**不需要**运行验证器；你只需要将创建者地址添加到 `devshard_escrow_params.allowed_creator_addresses`。如果缺失，请立即停止并按照[成为经纪商](quickstart.md#3-become-a-broker)请求治理参数更新。在创建托管之前，每次治理投票后都请重新运行此检查。

```bash
source config.devshard.env

echo "DEVSHARD_CREATOR=$DEVSHARD_CREATOR"

curl -sS "$NODE_CHAIN_API/productscience/inference/inference/params" \
  | jq '.params.devshard_escrow_params | {min_amount, max_escrows_per_epoch, max_nonce, allowed_creator_addresses}'

curl -sS "$NODE_CHAIN_API/productscience/inference/inference/params" \
  | jq --arg addr "$DEVSHARD_CREATOR" \
    '.params.devshard_escrow_params.allowed_creator_addresses | index($addr) != null'
```

第二个命令必须输出 `true`。使用第一个命令读取实时限制（`min_amount`, `max_escrows_per_epoch`, `max_nonce`）。在主网上 [v0.2.13 升级](https://github.com/gonka-ai/gonka/blob/gm/microrelease/inference-chain/app/upgrades/v0_2_13/upgrades.go) 之后，预期 `max_escrows_per_epoch` 为 **500,000**，`max_nonce` 为 **1,000,000**。如果输出为 `false`，则表示你的地址**未**被列入白名单——在链上添加之前，请勿继续进行 [§2.5](#25-fund-the-creator-account)、[§3](#3-deploy-the-gateway) 或 [§4](#4-create-an-escrow-and-open-api-access)。

### 2.5 为创建者账户充值

只有在 [§2.4](#24-confirm-allowlist-membership) 返回 `true` 之后，才能为创建者账户充值：

```bash
inferenced query bank balances "$DEVSHARD_CREATOR" \
  --node "$NODE_RPC" --chain-id "$CHAIN_ID" -o json --home "$INFERENCED_HOME" \
  | jq '.balances[] | select(.denom=="ngonka")'
```

发送足够的 **ngonka** 以覆盖托管存款（示例中的 `5000000000`，如果该值 ≥ `min_amount`），并支付创建/结算所需的Gas费和交易费。如果要启用自动托管轮换（[托管期限与轮换](#escrow-lifetime-and-rotation)），请为创建者预存足够用于每个周期进行**多次**存款的资金——而不仅仅是在[第4节](#4-create-an-escrow-and-open-api-access)中手动创建一次托管。

!!! tip "如何获取GNK"

    GNK 以 WGNK（封装版 GNK）的形式在以太坊上提供。您可以通过 DEX 或点对点转账获得 WGNK，然后使用 [跨链转账仪表板桥接界面](https://gonka.ai/cross-chain-transfers/ethereum-bridge/dashboard/) 将其桥接到 Gonka。该仪表板会从您的以太坊钱包推导出正确的 `gonka1…` 地址，并在无需使用 CLI 工具的情况下完成存款操作。

---

## 3. 部署网关

本节将启动网关进程。您将在本地**创建** `docker-compose.yml`；Docker 会**拉取**预构建的镜像。您无需从网络下载 compose 文件，也无需安装 Gonka 链节点。

网关会读取 `config.devshard.env`，在 `.devshardctl/` 下存储状态，并在主机上监听 `http://127.0.0.1:18080`。链上托管创建将在[第4节](#4-create-an-escrow-and-open-api-access)中进行；先启动网关没有问题。


| 路径 | 用途 |
| --- | --- |
| `config.devshard.env` | 密钥和链 URL（主机 + 容器） |
| `docker-compose.yml` | Docker 如何运行 `devshardctl` |
| `.devshardctl/` | 网关数据库（首次运行 `up` 时创建） |


所有命令均假设：

```bash
cd /srv/gonka/devshard-gateway
```

### 3.1 创建 `docker-compose.yml`

```bash
nano docker-compose.yml
```

仅网关的 compose（没有 `node` 或 `api` 服务）：

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
- 卷挂载可在重启后保留已注册的托管和管理员设置。
- `127.0.0.1:18080` 仅将 API 绑定到本地主机；如果远程客户端需要访问，请在前面放置 nginx 或其他反向代理。

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

期望 `devshardctl-multi`（或您的 `DEVSHARD_INSTANCE_NAME`）处于 **running** 状态，且在启动期后健康状态为 **healthy**。

### 3.3 验证 HTTP API

```bash
curl -fsS http://127.0.0.1:18080/v1/status | jq '{runtimes, capacity: .capacity.models}'
```

JSON 响应意味着网关已启动。托管账户在您完成[§4](#4-create-an-escrow-and-open-api-access)之前可能为空。

聊天补全功能可在以下地址使用：

`http://127.0.0.1:18080/v1/chat/completions`

（或您的反向代理转发到该端口的URL）

---

## 4. 创建托管账户并开通API访问

**白名单检查：** `$DEVSHARD_CREATOR` 必须已被列入白名单（[§2.4](#24-confirm-allowlist-membership)）。否则链上创建托管账户将失败。

§4.1 中的存款金额必须 **≥** §2.4 中链上的 `min_amount`。

### 4.1 创建并注册托管账户

当满足 `"register": true` 时，网关管理API将在链上创建托管账户并完成注册。除非您在下方的[托管账户生命周期与轮换](#escrow-lifetime-and-rotation)中启用了自动轮换，否则该托管账户将持续有效，直到您在[§6](#6-finalize-and-settle-the-escrow)中完成最终确认和结算。

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

在本指南的其余部分中，请在您的 shell 中保留 `ESCROW_ID`。在新会话中，请重新设置它（例如 `export ESCROW_ID=1`）。

### 4.2 开启用户 API 访问

模型默认为 `admin_only`，直到您启用 API 密钥访问：

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

### 运行多个托管（并行池）

一个网关进程可以**同时服务多个托管**。在容器环境中首次启动时使用`**DEVSHARDS_JSON`**注册它们，或稍后使用`**POST /v1/admin/devshards`**或`**POST /v1/admin/escrows**`（`"register": true`）添加更多。池化的`**POST /v1/chat/completions**`按请求选择活跃的托管——**选择器**根据运行时负载（进行中的请求数与容量权重）对运行时评分，并将请求路由到所请求模型的最佳匹配。

在池模式下，`**GET /v1/status`**列出所有devshard以及限流器和容量；当只有一个托管时，其行为类似于简单代理。每个托管的管理调用使用`**/devshard/{id}/…`**前缀（例如 `**POST /devshard/{id}/v1/finalize**`）；仅当配置了单个托管时，裸的`**POST /v1/finalize**`才有效。下面的[§5](#5-send-a-test-request)–[§6](#6-finalize-and-settle-the-escrow)使用一个托管；当您需要更高吞吐量或跨epoch轮换时，请使用池。

### 托管生命周期与轮换

本指南中的步骤[§4.1](#41-create-and-register-the-escrow)–[§4.2](#42-open-user-api-access)和[§5](#5-send-a-test-request)–[§6](#6-finalize-and-settle-the-escrow)演示了**一次手动托管**。这是首次测试的正确模式。在主网上，网关还可以在epoch边界自动**轮换**托管，以避免容量耗尽。

#### 手动托管的持续时间是多久？

**网关对您自己创建的单个托管没有固定的时钟到期时间**。


| 限制 | 含义 |
| --- | --- |
| **您的工作流程** | 托管将持续提供聊天服务，直到您**完成并结算**（[§6](#6-finalize-and-settle-the-escrow)）。 |
| **链上epoch** | 每个托管与其创建时的链**epoch**绑定（`epoch_index`）。这对协议存储和链规则很重要，而不是本指南中的简单“N小时后过期”计时器。 |
| **余额** | 推理会消耗托管的存款。网关会定期检查活跃托管（大约每**30秒**一次）。如果可用余额低于**1,000,000 ngonka**，则视为托管已耗尽。 |
| **nonce预算** | 链下devshard状态通过**nonce**推进。多托管网关在**19,800** nonce左右停止路由新聊天（此限制未来将设为更高数值）。另外，`devshard_escrow_params.max_nonce`是链上结算上限——可在[§2.4](#24-confirm-allowlist-membership)中查询（v0.2.13之后的主网：**1,000,000**）。 |
| **链上限** | 治理设置`max_escrows_per_epoch`：当前epoch中全链允许的**devshard托管最大数量**（非每个创建者）。可在[§2.4](#24-confirm-allowlist-membership)中查询实时值。v0.2.13之后的主网为**500,000**。 |


**默认行为：** `escrow_rotation`在您于管理设置中启用之前为**关闭**状态。关闭轮换时，网关在余额或nonce耗尽时**不会**自动创建替代托管——仅记录日志，且可能停止对该托管的新请求。请计划在存款耗尽前**完成并结算**，或启用轮换（如下）。

#### 网关是否自动轮换？

**默认不轮换。** 自动轮换是可选的，需通过`POST /v1/admin/settings` → `escrow_rotation`配置。

当`**escrow_rotation.enabled`为`true`**时，后台任务大约每**15秒**运行一次，并根据链的**epoch / PoC时间表**协调托管：

1. 在下一次epoch切换之前**`**pre_poc_blocks`**（测量到即将到来的`set_new_validators`边界，而不仅仅是“PoC开始”）：为每个配置的模型创建`**temp_count`**临时“桥接”托管，然后**完成并结算**该模型的活跃**常规**托管（当devshard仍有进行中的请求时，结算将跳过）。
2. **在链离开该过渡期的PoC活跃窗口后**：为每个模型创建`**target_count`**新的**常规**托管，然后**完成并结算**桥接窗口中的**临时**托管。

如果临时托管创建失败，网关可能会将现有的常规托管**提升**为临时角色，而不是让您没有桥接托管。

启用轮换后，网关还可以通过创建新的链上托管并结算旧托管来**替换**已耗尽的托管（余额低、nonce高，或请求中途余额耗尽）——**仅适用于列在`escrow_rotation.models`**下的模型。

**资金与轮换：** 每次epoch转换都会先创建**新的**链上托管（`temp_count`桥接托管，然后是每个模型的`target_count`常规托管），再结算之前的托管。每次创建都会从`$DEVSHARD_CREATOR`锁定另一个`amount`，直到结算返还未使用部分。请为每个模型、每个epoch规划创建者钱包余额至少为`**(temp_count + target_count) × amount`** ngonka**，加上创建和结算交易的gas费用——并保留额外余量，因为在轮换过程中桥接和常规托管可能会短暂重叠。

#### 启用轮换（生产环境/始终在线网关）

在您已手动创建、注资并测试至少一个托管后使用此功能（[§4](#4-create-an-escrow-and-open-api-access)）。轮换需要容器中有相同的`private_key_env`（例如 `DEVSHARD_PRIVATE_KEY`），且创建者账户上有足够的ngonka用于上述存款，而不仅仅是一个托管的`amount`。

一个模型的示例（根据您的容量调整数量；生产运营商通常为每个模型运行多个常规托管，其中`**temp_count`: 1**用于epoch桥接）

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

无需重启：在设置中启用旋转功能会启动运行中网关的旋转器。

检查计时和每个模型的上一次旋转结果：

```bash
curl -fsS http://127.0.0.1:18080/v1/debug/rotation \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" | jq
```

有用的字段包括 `chain.blocks_until_next_rotation`、`settings` 和 `latest`（按模型阶段、计数和错误）。

#### 如果轮转未运行或暂存区积压


| 症状 | 需要检查的内容 |
| --- | --- |
| 跨纪元无任何操作 | 确认设置中的 `"escrow_rotation": { "enabled": true, ... }` 以及 `GET /v1/debug/rotation` 显示 `enabled: true`。 |
| 一次失败后创建即停止 | 网关在链上创建失败后（例如资金不足或每纪元暂存限额），会**抑制对同一模型、角色和纪元的重复创建**。请阅读 `/v1/debug/rotation` 和 `docker logs` 以获取 `escrow_rotation_`* / `escrow_depletion_replacement_failed`。 |
| 结算从未完成 | 结算会一直等待，直到 devshard **没有活动请求**。在预期轮转结算完成前，请清空或停止流量。 |
| 耗尽但无替换 | **替换需要启用轮转**，并在 `escrow_rotation.models` 中有匹配的条目。否则请在[§6](#6-finalize-and-settle-the-escrow)中手动完成最终化和结算。 |
| 纪元时间错误 | 轮转使用实时链阶段数据；确保 `DEVSHARD_PUBLIC_API` / 链 REST 指向您的主网节点（[§2.2](#22-create-configdevshardenv)）。 |


对于**单次手动测试**，保持轮转**禁用**状态，完成[§5](#5-send-a-test-request)，然后执行[§6](#6-finalize-and-settle-the-escrow)。当您希望网关在多个纪元中自动保持暂存区更新而无需手动重建时，再启用轮转。

---

## 5. 发送测试请求

网关端点与 OpenAI 兼容。设置您的 API 密钥并发送聊天补全请求：

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

片刻之后，您应该会在`content`中看到模型回复。如果收到**401**并带有`"requires an admin API key"`，请在[§4.2](#42-open-user-api-access)中重复设置POST操作。

---

## 6. 完成并结算托管

当您完成推理后，网关将最终确定链下devshard状态，然后您在链上提交结算。这两个步骤都需要[§4.1](#41-create-and-register-the-escrow)中的`source config.devshard.env`和非空的`ESCROW_ID`。

最终确定是**按托管进行**的，必须使用路径`/devshard/{id}/v1/finalize`，而不能仅使用`/v1/finalize`。

### 6.1 最终确定链下状态

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

如果 finalize 失败，请检查响应和网关日志：

```bash
curl -sS -w "\nHTTP %{http_code}\n" \
  -X POST "http://127.0.0.1:18080/devshard/${ESCROW_ID}/v1/finalize" \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY"
sudo docker logs devshardctl-multi --tail 80
```

### 6.2 在链上结算

在主机付款和协议费用扣除后，未使用的 ngonka 金额将退还到您的创建者地址。

```bash
source config.devshard.env

curl -sS -X POST "http://127.0.0.1:18080/v1/admin/devshards/${ESCROW_ID}/settle" \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"private_key_env":"DEVSHARD_PRIVATE_KEY"}'
```

### 6.3 确认结算和退款

链上托管状态：

```bash
source config.devshard.env

inferenced query inference show-devshard-escrow "$ESCROW_ID" \
  --node "$NODE_RPC" --chain-id "$CHAIN_ID" -o json --home "$INFERENCED_HOME" \
  | jq '{id: .escrow.id, settled: .escrow.settled, creator: .escrow.creator, amount: .escrow.amount}'
```

预期 `settled: true`。`amount` 字段是原始存款元数据；结算后，活跃币将返回到 `$DEVSHARD_CREATOR`。

创建者钱包余额（主要检查资金是否已退回）：

```bash
source config.devshard.env

inferenced query bank balances "$DEVSHARD_CREATOR" \
  --node "$NODE_RPC" --chain-id "$CHAIN_ID" -o json --home "$INFERENCED_HOME" \
  | jq '.balances[] | select(.denom=="ngonka") | {denom, amount}'
```

结算后，大部分未使用的存款应退还给`$DEVSHARD_CREATOR`，扣除推理成本、结算费用和交易燃气费。

---

## 7. 暂停、重定向并停止网关

第[§1](#1-install-tools-and-create-a-deploy-directory)至[§6](#6-finalize-and-settle-the-escrow)节涵盖单个测试托管。本节介绍如何暂停路由、按要求重定向客户端或关闭主机。

### 7.1 停用一个托管

在[§6](#6-finalize-and-settle-the-escrow)中结算后，托管记录仍保留在链上；**停用**仅会阻止此网关将新的聊天路由到该托管本地。如果池中的其他托管仍处于活动状态，则会继续提供服务。

```bash
source config.devshard.env

curl -sS -X POST "http://127.0.0.1:18080/v1/admin/devshards/${ESCROW_ID}/deactivate" \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY"
```

### 7.2 重定向所有客户端流量（网关杀开关）

要告知 API 客户端停止使用此网关 URL，同时保留管理员访问权限（完成、设置、导入、调试），请启用网关的 **禁用** 状态。非管理员请求（例如 pooled `/v1/chat/completions`）将收到 **HTTP 308** 和 JSON `status`、`message` 以及 `new_url`。管理员路由（`/v1/admin/`*、`/v1/debug/*`、在 `/devshard/{id}/…` 下的每笔托管完成）仍可使用管理员 API 密钥正常工作。

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

要恢复正常服务，请使用 `"enabled": false` 再次 POST。仅在**首次**启动网关时，可以从 `config.devshard.env` 中的 `DEVSHARD_GATEWAY_DISABLED`、`DEVSHARD_GATEWAY_DISABLED_MESSAGE` 和 `DEVSHARD_GATEWAY_DISABLED_NEW_URL` 引导相同的标志（参见 [gonka](https://github.com/gonka-ai/gonka) 仓库中的网关环境模板）。在 `gateway.db` 存在后，请使用 `**POST /v1/admin/settings`**。

### 7.3 停止容器并可选清理

可选 — 删除本地网关记录（在容器仍在运行且已稳定后执行）：

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

## 8. 在不中断流量的情况下更新网关（热替换）

就地重启网关**镜像**或重新创建主容器会中断正在进行的`/v1/chat/completions`流。生产环境操作者使用**双容器**模式：在主容器旁运行一个**临时**网关，通过**nginx别名**和优雅的`nginx -s reload`将公网流量切换过来，对旧实例进行**排空**`active_requests`，更新主容器，再切回流量，最后将临时托管状态**导入**到主网关中。

**网关提供的功能**:

- 第二个`devshardctl`进程（通常是端口**18081**），并配置`DEVSHARDS_JSON=[]`，使其在启动时不加载主托管账户。
- 在临时实例上配置`POST /v1/admin/escrows`，以资助临时桥接托管账户。
- 配置`GET /v1/status`（或管理员状态）以在停止实例前确认`**active_requests`**为零。
- 在主实例上配置`POST /v1/admin/devshards/import`并启用`active: false`，然后在主实例上注册/激活，以确保临时托管账户在切换期间得以保留。
- 通过反向代理上游名称更改实现公网路由（聊天服务无需完全重启代理容器）。

**逐步操作手册**目前正在准备中。

---

## 相关链接

- [开发者快速入门](quickstart.md) — 社区经纪商和[成为经纪商](quickstart.md#3-become-a-broker)

**需要帮助？** 请查看[FAQ](https://gonka.ai/FAQ/)，加入[Discord](https://discord.com/invite/RADwCT2U6R)，或在GitHub上提交[经纪商/白名单申请](https://github.com/gonka-ai/gonka/issues/new?title=Request+to+be+added+as+a+Gonka+broker)。
