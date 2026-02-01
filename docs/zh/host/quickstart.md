# 配置您的链

!!! note "警告"
    网络当前处于临时稳定化阶段。在此期间，新注册与推理已暂停。
    
    为确保稳定运行，参与仅限于 `allowlist`（白名单）。
    
    - 未列入 `allowlist` 的主机在稳定期结束（区块 2,443,558）之前无法参与计算证明（PoC）。
    - 开发者 `allowlist` 将持续至区块 2,459,375。
    
    `Allowlist`：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)
    
    详情：[https://gonka.ai/release-announcements](https://gonka.ai/release-announcements)

    **主机行动项**

    请按新的 PoC 要求准备您的环境。
    
    - **模型更新：** 请将您的 ML 节点切换为 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 模型。
    - **渐进式部署：** 若您运行多个 ML 节点，建议在多个 epoch 内逐步完成更新。
    - 更新现有 ML 节点的说明见：[https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)

    任何替代配置均须通过单独的治理决策确定。

**主机**（**硬件提供方**或**节点**）向网络提供算力，并根据所提供资源的数量与质量获得奖励。

要加入网络，您需要部署两类服务：

- **网络节点** – 由**链节点**和 **API 节点**组成的服务，负责所有通信。**链节点**连接区块链，**API 节点**处理用户请求。
- **推理（ML）节点** – 在 GPU 上执行大语言模型（LLM）推理的服务。至少需要一个 **ML 节点** 才能加入网络。

本指南描述两类服务部署在同一台机器、且每个主机仅有一个 ML 节点的场景。服务以 Docker 容器形式部署。

??? note "直播演示 — 如何启动节点（主机快速入门）"
    通过快速入门启动节点的演示录像见下方。录像中的部分步骤可能与下方说明有出入，因快速入门会根据社区反馈持续更新。请始终以书面版快速入门为准，其反映当前且正确的流程。

    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
      <iframe
        src="https://www.youtube.com/embed/DWOeHQoU_LY"
        title="Gonka: Live Demo — How to Launch a Node (Quickstart for Hosts)"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
      </iframe>
    </div>

## 先决条件

本节说明如何配置硬件基础设施以参与 Gonka 网络启动，目标是通过与网络预期对齐的部署最大化协议奖励。

### 支持的模型

当前协议仅支持一种用于推理与计算证明（PoC）的模型：`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。该模型用于 PoC v2 参与与权重分配。

!!! note "治理与模型分类"
    - 经治理批准后，模型可被归入某类。
    - 是否新增或变更支持的模型由治理决定。
    - 治理流程及如何提议新模型见 [交易与治理指南](https://gonka.ai/transactions-and-governance/)。

### 建议硬件配置

要运行有效节点，需要具备[支持的 GPU](/host/hardware-specifications/) 的机器。以下为参考配置：

| **模型名称**                          | **ML 节点（最少）** | **示例硬件**                            | **每 ML 节点最小显存** |
|------------------------------------------|-------------------|-------------------------------------------------|----------------|
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`                | ≥ 2               | 每 ML 节点 8× H200                              | 640 GB         |

此为参考架构。您可调整节点数量或硬件分配，但建议遵循核心原则：每个节点应在各模型层级支持多个 ML 节点。

更多关于最优部署配置的说明见[此处](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/)。

承载网络节点的服务器应具备：

- 16 核 CPU（amd64）
- 64 GB 及以上内存
- 1TB NVMe SSD
- 至少 100Mbps 网络连接（推荐 1Gbps）

最终需求取决于所连接 ML 节点数量及其总吞吐量。

部署 ML 节点的每台服务器应具备：

- 内存至少为 GPU 显存的 1.5 倍
- 16 核 CPU（网络节点与 ML 节点可部署在同一台服务器）
- 已安装并配置 NVIDIA Container Toolkit，CUDA Toolkit 版本在 12.6 与 12.9 之间。可用 `nvidia-smi` 查看版本。

### 对公网开放的端口

- 5000 - Tendermint P2P 通信
- 26657 - Tendermint RPC（查询区块链、广播交易）
- 8000 - 应用服务（可配置）

!!! note "重要警告：API 节点端口 9100、9200 与 ML 节点端口 8080、5050 不得对外公开"
    以下端口仅限内部使用：
    
    - `9100`、`9200` — 网络节点内部 API
    - `5050` — ML 节点 / vLLM 推理 API
    - `8080` — ML 节点 API
    
    若这些端口暴露在公网，您的节点将面临风险。第三方可随意发送请求、占满 ML 节点、干扰挖矿或导致节点在 epoch 中掉线。
    
    **要求：**
    
    - 仅允许 localhost、内网或白名单访问这些端口
    - 切勿对外暴露
    - Docker 默认配置不安全

    === "情况 1：ML 节点与网络节点在同一台机器"
        将端口仅绑定到 localhost。        
        
        **网络节点（`docker-compose.yml`）**
        
        若 ML 节点容器与网络节点容器在同一台机器，可直接编辑 `gonka/deploy/join/docker-compose.yml`：
        ```
        api:
           ports:
              - "127.0.0.1:9100:9100"
              - "127.0.0.1:9200:9200"
        ```
        
        **ML 节点（`docker-compose.mlnode.yml`）**
        ```
        ports:
          - "127.0.0.1:${PORT:-8080}:8080"
          - "127.0.0.1:${INFERENCE_PORT:-5050}:5000"
        ```
        
        请勿使用：
        
        - "9100:9100"
        - "9200:9200"
        - "5050:5000"
        - "8080:8080"
    
    === "情况 2：ML 节点与网络节点在不同机器"
        若 ML 节点与网络节点容器在不同机器，情况 1 的绑定方式不适用，保护这些端口的具体方式取决于您的环境。您应通过同一 docker 网络或机器间内网建立 ML 节点与网络容器的连接，在这些网络中开放端口并禁止公网访问。此情况下还需正确设置配置中的 `DAPI_API__POC_CALLBACK_URL`。该 URL 必须指向内网/私有地址，而非公网地址。


## 配置您的节点

快速入门说明针对在同一台机器上同时运行网络节点与推理节点的单机部署。

??? note "多节点部署"
    若您要部署多台 GPU 节点，请参阅详细的[多节点部署指南](https://gonka.ai/host/multiple-nodes/)进行正确配置。无论推理节点是单机还是跨多台服务器（含跨地域），所有推理节点都必须连接到同一网络节点。

### 密钥管理概览

在配置网络节点之前，需先设置加密密钥以保障安全运行。  
**建议在启动生产节点前阅读 [密钥管理指南](/host/key-management/)。**

我们采用三密钥体系：

- **账户密钥**（冷钱包）- 在本地安全机器上创建，用于高价值操作
- **共识密钥**（TMKMS - 温存储）- 由安全 TMKMS 服务管理，用于区块验证与参与网络共识
- **ML 运营密钥**（温钱包）- 在服务器上创建，用于自动化 AI 工作负载交易

### [本地机器] 安装 CLI 工具

本地账户管理与网络操作需要 `inferenced` CLI。它是命令行工具，用于在本地机器上创建和管理 Gonka 账户、注册主机及执行各类网络操作。

从 [GitHub 发布页](https://github.com/gonka-ai/gonka/releases) 下载最新 `inferenced` 并赋予可执行权限：

```bash
chmod +x inferenced
./inferenced --help
```

!!! note "macOS 用户"
    在 macOS 上，若系统提示，可能需要在「系统设置」→「隐私与安全」中允许运行。找到关于 `inferenced` 的提示并点击「仍要允许」。

### [本地机器] 创建账户密钥

**重要：请在安全的本机执行此步骤（不要用服务器）**

??? note "关于账户密钥（冷密钥）"
    账户密钥是您的主要高权限密钥，在本地创建，从不存储在服务器上。
    
    - 可授权所有其他密钥的主密钥
    - 必须离线保存在安全、隔离的机器上
    - 仅用于授权与验证者注册
    - 由助记词保护 — 一旦丢失，所有访问将永久丧失

使用 `file` keyring 后端创建账户密钥（在支持的系统上也可使用 `os` 以增强安全）：

```bash
./inferenced keys add gonka-account-key --keyring-backend file
```

CLI 会要求输入口令并显示所创建密钥对信息。
```
❯ ./inferenced keys add gonka-account-key --keyring-backend file
Enter keyring passphrase (attempt 1/3):
Re-enter keyring passphrase:

- address: gonka1rk52j24xj9ej87jas4zqpvjuhrgpnd7h3feqmm
  name: gonka-account-key
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"Au+a3CpMj6nqFV6d0tUlVajCTkOP3cxKnps+1/lMv5zY"}'
  type: local


**重要** 请将助记词妥善抄写保存。
这是遗忘密码后恢复账户的唯一方式。

pyramid sweet dumb critic lamp various remove token talent drink announce tiny lab follow blind awful expire wasp flavor very pair tell next cable
```

**关键：** 请将助记词抄写并保存在安全、离线处。这是恢复账户密钥的**唯一**方式。

!!! info "硬件钱包支持"
    **当前状态**：网络启动时暂不支持硬件钱包。
    
    **目前建议**：将账户密钥保存在安全、专用、尽量少联网且加密良好的机器上。
    
    **注意**：无论未来是否支持硬件钱包，请始终保留助记词备份。

### [服务器] 下载部署文件

克隆包含基础部署脚本的仓库：

```bash
git clone https://github.com/gonka-ai/gonka.git -b main && \
cd gonka/deploy/join
```

并复制 `config` 模板：
```
cp config.env.template config.env
```

克隆后您将看到以下关键配置文件：

| 文件                          | 说明                                                                      |
|-------------------------------|----------------------------------------------------------------------------------|
| `config.env`                  | 网络节点环境变量                                                              |
| `docker-compose.yml`          | 启动网络节点的 Docker Compose 文件                                   |
| `docker-compose.mlnode.yml`   | 启动 ML 节点的 Docker Compose 文件                                   |
| `node-config.json`            | 网络节点使用的配置，描述该网络节点所管理的推理节点 |

### [服务器] 设置环境变量

<!-- CONDITION START: data-show-when='["non-finished"]' -->
!!! note "需要配置"
    请完成问卷以生成您的 `config.env` 配置。环境变量取决于您的选择（HTTP/HTTPS、SSL 证书方式等）。
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["domainNo"]' -->
!!! warning "无域名时无法使用 HTTPS"
    SSL/TLS 证书只能为域名（如 `example.com`）签发，不能为直接 IP 签发。由于您表示未配置域名，节点将仅使用 **HTTP**（端口 8000）部署。
    
    若需 HTTPS 安全，您需要：
    
    1. 获取域名并将 DNS 指向服务器 IP
    2. 点击上方 **「重置」** 按钮，在询问是否拥有域名时选择 **「是」**
    
    生产环境部署强烈建议使用 HTTPS，以加密 API 通信并保护敏感数据。
<!-- CONDITION END -->

<div id="quickstart-questionnaire" class="quickstart-questionnaire">
  <div id="quickstart-questions"></div>
  
  <div id="quickstart-config-result" style="display: none;">
    <div class="admonition note">
      <p class="admonition-title">config.env</p>
      <div id="quickstart-config-display">
        <pre><code></code></pre>
      </div>
    </div>
    <p style="margin-top: 1rem; font-size: 0.7rem; color: var(--md-default-fg-color--light);">请复制上方配置，并按下方说明编辑各变量。</p>
    <button class="quickstart-copy-btn">复制到剪贴板</button>
    <button class="quickstart-reset-btn">重置</button>
  </div>
</div>

<!-- CONDITION START: data-show-when='["finished"]' -->

若节点无法连接默认种子节点，[详见 FAQ](https://gonka.ai/FAQ/#my-node-cannot-connect-to-the-default-seed-node-specified-in-the-configenv)。
### [服务器] 编辑环境变量

需要编辑的变量：

<div id="quickstart-edit-table"></div>

其他变量可保持默认。

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto"]' -->
**如何从域名服务商获取变量：**

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "cloudflare"]' -->
??? details "Cloudflare"
    1) 打开 Cloudflare 控制面板。
    
    2) 进入 Profile → API Tokens。
    
    3) 点击 Create Token。
    
    4) 使用 Edit zone DNS 模板或设置权限：Zone:Read、DNS:Edit。
    
    5) 将令牌限制在您的 DNS 区域并创建。
    
    6) 复制令牌并设置 `CF_DNS_API_TOKEN`。
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "route53"]' -->
??? details "AWS Route53"
    **方式 A — AWS CLI**
    ```bash
    HOSTED_ZONE_ID="Z123EXAMPLE"
    cat > route53-acme.json <<'JSON'
    {
    "Version": "2012-10-17",
    "Statement": [
        {
        "Effect": "Allow",
        "Action": ["route53:ChangeResourceRecordSets"],
        "Resource": "arn:aws:route53:::hostedzone/${HOSTED_ZONE_ID}"
        },
        {
        "Effect": "Allow",
        "Action": [
            "route53:ListHostedZones",
            "route53:ListHostedZonesByName",
            "route53:ListResourceRecordSets",
            "route53:GetChange"
        ],
        "Resource": "*"
        }
    ]
    }
    JSON

    aws iam create-policy \
    --policy-name acme-dns-route53-${HOSTED_ZONE_ID} \
    --policy-document file://route53-acme.json | jq -r .Policy.Arn

    USER_NAME="acme-dns"
    POLICY_ARN=$(aws iam list-policies --query "Policies[?PolicyName=='acme-dns-route53-${HOSTED_ZONE_ID}'].Arn" -o tsv)
    aws iam create-user --user-name "$USER_NAME" >/dev/null || true
    aws iam attach-user-policy --user-name "$USER_NAME" --policy-arn "$POLICY_ARN"
    CREDS=$(aws iam create-access-key --user-name "$USER_NAME")
    AWS_ACCESS_KEY_ID=$(echo "$CREDS" | jq -r .AccessKey.AccessKeyId)
    AWS_SECRET_ACCESS_KEY=$(echo "$CREDS" | jq -r .AccessKey.SecretAccessKey)

    echo "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID"
    echo "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY"
    echo "AWS_REGION=<your-aws-region>"
    ```

    **方式 B — 控制台**
    
    1) 创建限于您托管区域的 IAM 策略（ChangeResourceRecordSets 及列表权限）。
    
    2) 创建具有编程访问权限的 IAM 用户。
    
    3) 将策略附加到该用户。
    
    4) 创建访问密钥对并设置 `AWS_ACCESS_KEY_ID`、`AWS_SECRET_ACCESS_KEY`、`AWS_REGION`。
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "gcloud"]' -->
??? details "Google Cloud DNS"
    **方式 A — gcloud CLI：**
    ```bash
    PROJECT_ID="<your-gcp-project>"
    SA_NAME="acme-dns"
    SA_EMAIL="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"

    gcloud config set project "$PROJECT_ID"
    # 1) 服务账户
    gcloud iam service-accounts create "$SA_NAME" \
    --display-name "ACME DNS for proxy-ssl"
    # 2) 角色
    gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member "serviceAccount:$SA_EMAIL" \
    --role "roles/dns.admin"
    # 3) 密钥 → base64（单行）
    gcloud iam service-accounts keys create key.json --iam-account "$SA_EMAIL"
    GCE_SERVICE_ACCOUNT_JSON_B64=$(base64 < key.json | tr -d '\n')

    echo "GCE_PROJECT=$PROJECT_ID"
    echo "GCE_SERVICE_ACCOUNT_JSON_B64=$GCE_SERVICE_ACCOUNT_JSON_B64"
    ```
    **方式 B — 控制台**
    
    1) IAM 与管理 → 服务账户 → 创建服务账户（如 acme-dns）。
    
    2) 授予该服务账户角色：DNS 管理员（`roles/dns.admin`）。
    
    3) 服务账户 → 密钥 → 添加密钥 → 创建新密钥（JSON）→ 下载。
    
    4) 将 JSON 密钥 base64 编码为单行并设置 `GCE_SERVICE_ACCOUNT_JSON_B64`。将 `GCE_PROJECT` 设为您的项目 ID。
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "azure"]' -->
??? details "Azure DNS"
    **方式 A — Azure CLI**（快速）
    ```bash
    # 1) 登录并选择订阅
    az login
    az account set --subscription "<your-subscription-name-or-id>"

    # 2) 设置 DNS 区域所在位置
    RG="<<your-dns-resource-group>>"
    ZONE="<<your-zone>>"         # 如 gonka.ai
    SP_NAME="gonka-acme-$(date +%s)"

    SUBSCRIPTION_ID=$(az account show --query id -o tsv)
    SCOPE="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.Network/dnszones/$ZONE"

    CREDS=$(az ad sp create-for-rbac \
    --name "$SP_NAME" \
    --role "DNS Zone Contributor" \
    --scopes "$SCOPE" \
    --only-show-errors)

    # 4) 提取值
    AZURE_CLIENT_ID=$(echo "$CREDS" | jq -r .appId)
    AZURE_CLIENT_SECRET=$(echo "$CREDS" | jq -r .password)
    AZURE_TENANT_ID=$(echo "$CREDS" | jq -r .tenant)

    # 5) 输出到环境文件
    echo "AZURE_CLIENT_ID=$AZURE_CLIENT_ID"
    echo "AZURE_CLIENT_SECRET=$AZURE_CLIENT_SECRET"
    echo "AZURE_SUBSCRIPTION_ID=$SUBSCRIPTION_ID"
    echo "AZURE_TENANT_ID=$AZURE_TENANT_ID"
    ```
    **方式 B — 门户**
    
    1) 进入 Microsoft Entra ID → 应用注册 → 新注册。复制应用程序（客户端）ID 和目录（租户）ID。
    
    2) 进入证书和机密 → 新客户端机密。复制机密值并设置 `AZURE_CLIENT_SECRET`。
    
    3) 复制订阅 ID 并设置 `AZURE_SUBSCRIPTION_ID`。
    
    4) 在 DNS 区域中打开访问控制（IAM）→ 添加角色分配 → DNS 区域参与者 → 分配给已注册应用。
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "digitalocean"]' -->
??? details "DigitalOcean DNS"
    1) 打开 DigitalOcean 控制面板。
    
    2) 进入 API → Tokens。
    
    3) 生成具有写权限的令牌并设置 `DO_AUTH_TOKEN`。
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "hetzner"]' -->
??? details "Hetzner DNS"
    1) 打开 https://dns.hetzner.com。
    
    2) 进入 API Tokens。
    
    3) 创建新令牌并设置 `HETZNER_API_KEY`。
<!-- CONDITION END -->
<!-- CONDITION END -->

**加载配置：**
```bash
source config.env
```

!!! note "使用环境变量"
    以下各节示例会引用这些环境变量（如 `$PUBLIC_URL`、`$ACCOUNT_PUBKEY`、`$SEED_API_URL`），包括本机命令与服务器命令。请在每个要执行这些命令的终端会话中运行 `source config.env`。
<!-- CONDITION END -->



### [服务器] 编辑服务器推理节点描述

=== "8xH200 或 8xH100"

    !!! note "编辑 node-config.json"
        ```
        [
            {
                "id": "node1",
                "host": "inference",
                "inference_port": 5000,
                "poc_port": 8080,
                "max_concurrent": 500,
                "models": {
                    "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8": {
                        "args": [
                            "--tensor-parallel-size","4"
                        ]
                    }
                }
            }
        ]
        ```

=== "4xH100"（最小配置）"

    !!! note "编辑 node-config.json"
        ```
        [
            {
                "id": "node1",
                "host": "inference",
                "inference_port": 5000,
                "poc_port": 8080,
                "max_concurrent": 500,
                "models": {
                    "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8": {
                        "args": []
                    }
                }
            }
        ]
        ```

=== "8x4090"

    !!! note "编辑 node-config.json"
        ```
        [
            {
                "id": "node1",
                "host": "inference",
                "inference_port": 5000,
                "poc_port": 8080,
                "max_concurrent": 500,
                "models": {
                    "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8": {
                        "args": [
                            "--tensor-parallel-size","4"
                               "--pipeline-parallel-size", "2"
                        ]
                    }
                }
            }
        ]
        ```

    !!! note 
        本例（8× RTX 4090，48 GB 显存）中增加流水线并行以降低单 GPU 显存占用并容纳模型。

更多关于最优部署配置的说明见[此链接](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/)。

### [服务器] 将模型权重预下载到 Hugging Face 缓存（HF_HOME）

推理节点从 Hugging Face 下载模型权重。为确保推理前权重已就绪，应在部署前下载。

=== "8xH100、8xH200 或其他 GPU"

    ```bash
    mkdir -p $HF_HOME
    huggingface-cli download Qwen/Qwen3-235B-A22B-Instruct-2507-FP8
    ```

## 启动节点
    
### 1. [服务器] 拉取 Docker 镜像（容器）

运行以下命令前请确保位于 `gonka/deploy/join` 目录。
```bash
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml pull
```

### 2. [服务器] 启动初始服务

启动完成密钥配置所需的核心服务（暂不启动 API）：

```bash
source config.env && \
docker compose up tmkms node -d --no-deps
```

先启动这些容器的原因：

- **`tmkms`** - 生成并安全管理验证者注册所需的共识密钥
- **`node`** - 连接区块链并提供获取共识密钥的 RPC 端点
- **`api`** - 此阶段故意不启动，因为下一步需在其内创建 ML 运营密钥

!!! note "建议"
    可通过日志确认初始服务是否成功启动：
    
    ```bash
    docker compose logs tmkms node -f
    ```

    若看到链节点持续处理区块事件，说明配置正确。

??? note "关于共识密钥"
    - 由安全 TMKMS 服务管理
    - 温存储，具备防双签
    - 用于区块验证与参与网络共识
    - 可由账户密钥或授权代表轮换
    
    在[步骤 3.2](https://gonka.ai/host/quickstart/#32-server-register-host) 的注册命令（`inferenced register-new-participant`）中，共识密钥会在链上与您的账户密钥（冷密钥）绑定，使您的节点成为网络有效参与者。
    
    若删除或覆盖 `.tmkms` 目录，共识密钥将丢失。该密钥将您的节点与链上验证者集关联。一旦 `.tmkms` 丢失，必须从零重新完成整套配置（包括通过 `tmkms` 生成新共识密钥）（见 [FAQ 页「我清除或覆盖了共识密钥」](https://gonka.ai/FAQ/#i-cleared-or-overwrote-my-consensus-key)）。 

### 3. 完成密钥配置与主机注册

接下来需创建温密钥、注册主机并授予权限：

#### 3.1. [服务器] 创建 ML 运营密钥

??? note "关于 ML 运营密钥（温密钥）"
    - 由账户密钥授权，用于 ML 相关交易
    - 以加密文件形式存于服务器，由程序访问
    - 自动化交易（推理请求、证明提交、奖励）
    - 可由账户密钥随时轮换或撤销
    - 需持续可用，除非必要请勿删除或轮换。

在 `api` 容器内使用 `file` keyring 后端创建温密钥（程序访问需要）。密钥将保存在映射到容器 `/root/.inference` 的持久卷中：
```bash
docker compose run --rm --no-deps -it api /bin/sh
```

在容器内创建 ML 运营密钥：
```bash
printf '%s\n%s\n' "$KEYRING_PASSWORD" "$KEYRING_PASSWORD" | inferenced keys add "$KEY_NAME" --keyring-backend file
```
!!! note "重要"
    请勿重复执行此命令。
    ML 运营密钥（温密钥）每台服务器仅生成一次，必须在重启后保留。
    
    - 若误删或重新初始化，请按 FAQ 中的恢复说明操作：「[我删除了温密钥](https://gonka.ai/FAQ/#i-deleted-the-warm-key)」。
    - 重启节点时请完全跳过此步 — 密钥已生成并持久保存在 API 容器内。

**示例输出：**
```
~ # printf '%s\n%s\n' "$KEYRING_PASSWORD" "$KEYRING_PASSWORD" | inferenced keys add "$KEY_NAME" --keyring-backend file

- address: gonka1gyz2agg5yx49gy2z4qpsz9826t6s9xev6tkehw
  name: node-702105
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"Ao8VPh5U5XQBcJ6qxAIwBbhF/3UPZEwzZ9H/qbIA6ipj"}'
  type: local


**重要** 请将助记词妥善抄写保存。
这是遗忘密码后恢复账户的唯一方式。

again plastic athlete arrow first measure danger drastic wolf coyote work memory already inmate sorry path tackle custom write result west tray rabbit jeans
```


#### 3.2. [服务器] 注册主机

在同一容器内，可使用 URL、账户密钥与自动获取的共识密钥在链上注册主机：

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

!!! note "每节点账户密钥配置"
    请为每个网络节点生成独立的 `ACCOUNT_PUBKEY`，以保证主机隔离。

然后退出容器：
```bash
exit
```


#### 3.3. [本地机器] 向 ML 运营密钥授予权限
**重要：请在创建账户密钥的本地安全机器上执行此步骤**

从账户密钥向 ML 运营密钥授予权限：
```bash
./inferenced tx inference grant-ml-ops-permissions \
    gonka-account-key \
    <步骤-3.1-中的-ml-运营密钥地址> \
    --from gonka-account-key \
    --keyring-backend file \
    --gas 2000000 \
    --node <服务器 config.env 中的 seed_api_url>/chain-rpc/ 
```

**预期输出：**
```
...
Transaction sent with hash: FB9BBBB5F8C155D0732B290C443A0D06BC114CDF43E8EE8FB329D646C608062E
Waiting for transaction to be included in a block...

Transaction confirmed successfully!
Block height: 174
```

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodManual", "domainYes"]' -->
#### 3.4. [服务器] 手动 SSL 证书配置

若您在上方问卷中选择了手动 SSL 证书配置，请按以下步骤配置 SSL 证书：

##### 准备目录

```bash
mkdir -p secrets/nginx-ssl secrets/certbot
```

##### 生成证书（Docker 化 Certbot；DNS‑01）

```bash
DOMAIN=<完整域名>
ACCOUNT_EMAIL=<邮箱地址>    # 续期通知
mkdir -p secrets/nginx-ssl secrets/certbot

docker run --rm -it \
  -v "$(pwd)/secrets/certbot:/etc/letsencrypt" \
  -v "$(pwd)/secrets/nginx-ssl:/mnt/nginx-ssl" \
  certbot/certbot certonly --manual --preferred-challenges dns \
  -d "$DOMAIN" --email "$ACCOUNT_EMAIL" --agree-tos --no-eff-email \
  --deploy-hook 'install -m 0644 "$RENEWED_LINEAGE/fullchain.pem" /mnt/nginx-ssl/cert.pem; \
                 install -m 0600 "$RENEWED_LINEAGE/privkey.pem"   /mnt/nginx-ssl/private.key'
```

!!! note "DNS 验证"
    Certbot 会暂停并显示需在服务商处添加的 **TXT DNS** 记录。验证通过后，`cert.pem` 和 `private.key` 将出现在 `./secrets/nginx-ssl/`。

##### 验证证书文件

确保证书文件已就位：

```bash
ls -la secrets/nginx-ssl/
```

应看到：
- `cert.pem`（完整链证书）
- `private.key`（私钥，模式 0600）

问卷生成的 `config.env` 已包含所需 SSL 变量：
- `SERVER_NAME=<完整域名>`
- `SSL_CERT_SOURCE=./secrets/nginx-ssl`

继续前请将 `SERVER_NAME` 改为您的实际域名。

<!-- CONDITION END -->

## 4. [服务器] 启动完整节点

最后启动所有容器（含 API）：

<!-- CONDITION START: data-show-when='["non-finished"]' -->
!!! note "需要配置"
    请先完成[上方问卷](#quickstart-questionnaire)以生成启动命令。
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttp"]' -->
启动所有容器：

```bash
source config.env && \
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d
```
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto"]' -->
使用自动 SSL 证书管理启动所有容器：

```bash
source config.env && \
docker compose --profile "ssl" \
  -f docker-compose.yml -f docker-compose.mlnode.yml \
  up -d
```

`--profile "ssl"` 会启用自动管理 SSL 证书的 `proxy-ssl` 容器。
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodManual", "domainYes"]' -->
使用手动 SSL 证书启动所有容器：

```bash
source config.env && \
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d
```
<!-- CONDITION END -->

## 验证节点状态

<!-- CONDITION START: data-show-when='["protocolHttps"]' -->
验证 HTTPS 是否正常：

```bash
curl -I https://<完整域名>:8443/health   # 预期：HTTP/2 200 OK
```
<!-- CONDITION END -->

在浏览器中打开以下 URL，将 `<your-gonka-cold-address>` 替换为您的地址：
```
http://node2.gonka.ai:8000/v1/participants/<your-gonka-cold-address>
```

您将看到 JSON 格式的公钥：
```
{"pubkey":"<your-public-key>"}
```

表示您的地址已列入参与者列表。

当节点完成一次计算证明（Proof of Compute）阶段（每 24 小时一次）后，可访问：
```bash
http://node2.gonka.ai:8000/v1/epochs/current/participants
```

您可[在 ML 节点上自行模拟计算证明](https://gonka.ai/FAQ/#how-to-simulate-proof-of-compute-poc)，以确认链上 PoC 阶段开始时一切正常。

您也可以在此阶段前关闭服务器，并在下一次计算证明前再启动。
下一次计算证明开始时间可在[仪表盘](https://gonka.ai/wallet/dashboard/)查看：
```
http://node2.gonka.ai:8000/dashboard/gonka/validator
```

节点运行后，可通过节点的 Tendermint RPC（`node` 容器的 26657 端口）查看状态：
```bash
curl http://<PUBLIC_IP>:<PUBLIC_RPC_PORT>/status
```
在服务器上可使用内网地址：
```bash
curl http://0.0.0.0:26657/status
```
使用创世节点公网地址：
```bash
curl http://node2.gonka.ai:26657/status
```

当节点在仪表盘中可见后，您也可以更新公开资料（主机名、网站、头像），便于其他参与者识别。说明见[此处](https://gonka.ai/host/validator_info/)。

## 停止与清理节点

### 如何停止节点

查看当前所处 epoch。打开：[http://node1.gonka.ai:8000/api/v1/epochs/latest](http://node1.gonka.ai:8000/api/v1/epochs/latest)（也可使用任意其他活跃参与者的 URL）。 

在响应中查找：
```
"latest_epoch": {
    "index": 88,
    ...
}
```

记住您的节点最后参与过的 epoch 索引。

在同一 JSON 响应中查找：
```
"next_epoch_stages": {
  ...
  "claim_money": <block_number>
}
```
该区块高度表示此之后可领取奖励。但请注意，您应**现在**就逐个禁用 ML 节点（不要等到该区块后再禁用）。

禁用每个 ML 节点。

```
curl -X POST http://<api_node_static_ip>:<admin_port>/admin/v1/nodes/<id>/disable
```
等待下一个 epoch。此时请勿停止网络节点或 ML 节点。禁用标志仅在下一 epoch 开始后生效。

保持网络节点在线并同步，它将自动处理奖励领取。
要确认最近一次奖励是否已领取，在 `claim_money` 区块过后执行（将 `<YOUR_ADDRESS>` 和 `<EPOCH>` 替换为实际值）：
```
inferenced query inference show-epoch-performance-summary <EPOCH> <YOUR_ADDRESS> --node http://node1.gonka.ai:8000/chain-rpc/ --output json
```
示例： 
```
Output:
{
  "epochPerformanceSummary": {
    "epoch_index": "87",
    "participant_id": "<YOUR_ADDRESS>",
    "missed_requests": "1",
    "rewarded_coins": "123456",
    "claimed": true
  }
}
```
若结果为 `claimed = true`，说明奖励已领取。
若为 `false`，请执行手动领取步骤。

!!! note "手动领取奖励（如需要）"
    执行：
    ```
    curl -X POST http://localhost:9200/admin/v1/claim-reward/recover \
     -H "Content-Type: application/json" \
     -d '{"force_claim": true}'
    ```

验证移除与权重。若已禁用所有节点，您的参与者应不再出现在活跃参与者列表中。若列表中仍能看到您的参与者，说明网络仍期望您参与当前 epoch，此时若停止节点可能错过推理并影响信誉。 

确保位于 `gonka/deploy/join` 目录。停止所有运行中的容器：
```
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml down
```
此命令会停止并移除 `docker-compose.yml` 和 `docker-compose.mlnode.yml` 中定义的服务，除非另有配置，否则不会删除卷或数据。

### 如何清理节点（完全重置）

若需完全重置节点并删除所有数据（用于重新部署或迁移），请按以下步骤清理。  

1. 清理缓存并重新开始：删除本地 `.inference`、`.dapi` 目录（推理运行时缓存与身份）：
```bash
rm -rf .inference .dapi .tmkms
```

2. （可选）清理模型权重缓存：
```bash
rm -rf $HF_HOME
```

!!! note
    删除 `$HF_HOME` 后需重新从 Hugging Face 下载大体积模型文件或重新挂载 NFS 缓存。

**需要帮助？** 请到 [FAQ 页](https://gonka.ai/FAQ/) 查找答案，或加入 [Discord 服务器](https://discord.com/invite/RADwCT2U6R) 获取一般咨询、技术问题或安全相关协助。
