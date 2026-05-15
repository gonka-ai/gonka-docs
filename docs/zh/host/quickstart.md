# 配置您的链

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

协议支持经**治理批准**、用于推理与计算证明（PoC v2）的模型。自升级 v0.2.12 起为**多模型 PoC**：在 Gonka 主网上，每个获批模型有各自的 PoC 组与奖励统计。

| 模型 ID | 说明 |
|----------|------|
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` | 原先强制使用的模型；继续支持 |
| `moonshotai/Kimi-K2.6` | **Kimi K2.6** — 已在网络上参与 PoC（已过 bootstrap，与 Qwen 并行） |

!!! tip "权威模型列表（治理 API）"
    经批准的模型可能随版本或 epoch 变化。**在编辑 `node-config.json` 前，**请先调用治理接口，将返回中每个对象的 `"id"` 用作 `"models"` 下的键名：
    ```bash
    curl -sS http://node2.gonka.ai:8000/v1/governance/models
    ```
    若仅需列出模型 id，可对响应使用：`jq -r '.models[].id'`。若无法访问 `node2.gonka.ai`，可换用其他已参与节点的公网 API 基址（协议、主机、端口）。响应中还包含 `model_args` 等网络参数；下文 `node-config.json` 示例为常见硬件的典型 `args`，请根据 GPU 与压测结果再调整。

通常在 `node-config.json` 中**每个 ML 节点只服务一个模型**（`models` 下的一项）。若需同时覆盖 Qwen 与 Kimi，请使用多个 ML 节点（或多台机器）。

!!! note "若无法在本机运行全部获批模型"
    多模型 PoC **按模型**统计参与。若硬件无法覆盖每一位治理批准的模型，需要通过链上**委托**或**拒绝**，使共识权重在各模型上被正确计入。这与「先把节点跑起来」**无关**——仍使用**账户（冷）密钥**（与 **步骤 3.3「向 ML 运营密钥授予权限」** 相同 keyring），在注册并**验证节点**之后再执行。完整命令见文末 [可选：PoC 委托与拒绝](#optional-poc-delegation-and-refusal)。策略与惩罚说明见 [多模型 PoC — 主机操作指南](/host/multi_model_poc/)。

!!! note "治理与模型分类"
    - 经治理批准后，模型可被归入某类。
    - 是否新增或变更支持的模型由治理决定。
    - 治理流程及如何提议新模型见 [交易与治理指南](https://gonka.ai/transactions-and-governance/)。

### 建议硬件配置

要运行有效节点，需要具备[支持的 GPU](/host/hardware-specifications/) 的机器。以下为参考配置：

| **模型名称**                          | **ML 节点（最少）** | **示例硬件**                            | **每 ML 节点最小显存** |
|------------------------------------------|-------------------|-------------------------------------------------|----------------|
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` | ≥ 2               | 每 ML 节点 8× H200                              | 640 GB         |
| `moonshotai/Kimi-K2.6`                  | ≥ 2               | 每 ML 节点 8× H200 或 8× B200（参考档位）       | 640 GB         |

此为参考架构。您可调整节点数量或硬件分配，但建议遵循核心原则：每个节点应在各模型层级支持多个 ML 节点。

Kimi K2.6 在相同参考硬件（8×H200、8×B200）上相对 Qwen235B 的 PoC 权重系数约为 **3.51×**。详见 [多模型 PoC — 主机操作指南](/host/multi_model_poc/)。B200 档位的示例 vLLM 参数见下文 `node-config.json` 与 [Kimi K2.6 Bootstrap](/host/kimi-bootstrap/)。

关于最佳部署配置的更多细节可以在 [这里](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/)找到。

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

### 网络访问、代理与端口（重要）

Gonka 网络采用基于代理的架构，以保护节点免受滥用和 DDoS 攻击。所有公开的 HTTP/HTTPS 流量必须通过代理容器（proxy container）。直接暴露 Network Node 或 ML Node 服务是不安全的。

!!! note "对外暴露的端口"

    以下端口可以暴露到公网：

    - 5000 - Tendermint P2P 通信
    - 8000 / 8443 - 仅通过代理（proxy）提供的应用服务

!!! warning "警告：内部端口"

    以下端口仅限内部使用，**严禁暴露到公网**：

    - 26657 - Tendermint RPC
    - 9100, 9200 — Network Node internal API
    - 5050 — ML Node / vLLM inference API
    - 8080 — ML Node API

    如果这些端口被暴露到公网，你的节点将面临安全风险。第三方可以直接发送请求，导致 ML Node 被过载、挖矿中断，甚至在一个 epoch 中掉线。

    **要求：**

    - 仅允许 localhost、本地私有网络或白名单访问这些端口 
    - 绝不能对公网开放 
    - Docker 默认配置并不安全

!!! note "从 Upgrade 0.2.8 开始"

    为了默认提升安全性与性能，以下路由控制与链服务限制将自动生效，除非被显式覆盖。
    ```bash title="API 手动路由控制"
          # 定义哪些路由可以绕过限流 (Exempt) ，以及哪些路由被完全禁用（Blocked）
          - GONKA_API_EXEMPT_ROUTES=chat inference
          - GONKA_API_BLOCKED_ROUTES=poc-batches training
    ```

    ```bash title="链路由禁用"
          # 默认禁用对 Chain 服务的公开访问
          - DISABLE_CHAIN_API=${DISABLE_CHAIN_API:-true}
          - DISABLE_CHAIN_RPC=${DISABLE_CHAIN_RPC:-true}
          - DISABLE_CHAIN_GRPC=${DISABLE_CHAIN_GRPC:-true}
    ```

以下情况描述了 Network Node 与 ML Node 服务的内部端口隔离规则。这些规则是在已配置代理作为唯一公网入口之后生效的。它们不替代代理机制，必须与代理一起使用。

=== "情况 1：ML Node 与 Network Node 在同一台机器上"
    仅将端口绑定到 localhost。     

    **Network Node（`docker-compose.yml`)**

    如果你的 ML Node 容器和 Network Node 容器在同一台机器上，你可以直接修改 `gonka/deploy/join/docker-compose.yml`:
    ```
    api:
        ports:
            - "127.0.0.1:9100:9100"
            - "127.0.0.1:9200:9200"
    ```

    **ML Node (`docker-compose.mlnode.yml`)**
    ```
    ports:
        - "127.0.0.1:${PORT:-8080}:8080"
        - "127.0.0.1:${INFERENCE_PORT:-5050}:5000"
    ```

    不要使用：
        
    - "9100:9100"
    - "9200:9200"
    - "5050:5000"
    - "8080:8080"

=== "情况 2：ML Node 与 Network Node 在不同机器上"
    在这种架构下，Network Node 与 ML Node 之间的所有通信必须通过私有网络进行。不得使用公网 IP 或公网 DNS 名称用于以下用途：

    - ML Node APIs
    - `DAPI_API__POC_CALLBACK_URL`

    如果 ML Node 和 Network Node 容器部署在不同机器上，那么情况 1 中描述的修复方法将无法生效，并且具体的端口保护方式取决于你的部署方式。你需要在 ML Node 和 Network 容器之间建立连接，可以使用同一个 docker 网络，或者在机器之间搭建私有网络，在该网络中开放端口，并关闭对公网的访问。在这种情况下，你还需要在配置中正确设置 `DAPI_API__POC_CALLBACK_URL` 变量。该 URL 必须指向一个私有/内部地址，不能是公网地址。

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

**选择正确的二进制文件**

GitHub 发布版本中可能包含多个 `inferenced` 构件（artifacts）。

对于本地 CLI 使用，请务必下载与操作系统对应的打包 CLI 构建版本，例如：

- `inferenced-darwin-amd64.zip`
- `inferenced-darwin-arm64.zip`
- `inferenced-linux-amd64.zip`
- `inferenced-linux-arm64.zip`

请不要使用用于升级路径或容器/运行时环境的通用 `inferenced` 二进制文件。这些构件在本地机器上作为独立 CLI 使用时，可能无法正常工作。

**版本要求**

请确保你使用的是 `inferenced` CLI 构建版本 [version 0.2.9](https://github.com/gonka-ai/gonka/releases/tag/release/v0.2.9) 或更新版本。较旧版本的 CLI 不支持权限授予功能，并可能导致不可预期的行为。

如果你计划提交治理提案，尤其是使用较新消息类型的提案，请使用最新发布的、与操作系统对应的 CLI 构建版本。

**验证安装**

```bash
chmod +x inferenced
./inferenced --help
```

!!! note "macOS 用户"
    在 macOS 上，若系统提示，可能需要在「系统设置」→「隐私与安全」中允许运行。找到关于 `inferenced` 的提示并点击「仍要允许」。

如果在 Linux 上启动该二进制文件失败，并出现类似 `Error relocating ./inferenced: qsort_r: symbol not found`的错误，这通常意味着你下载的是非 CLI 或用于升级的特定构件，而不是与你的操作系统匹配的打包 CLI 构建版本。请重新下载与你的操作系统和架构对应的正确压缩包。

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
    **Option A — AWS CLI**
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

编辑 `node-config.json`，使每个 ML 节点在 `"models"` 中声明其运行的**单个模型**。**务必**用 `/v1/governance/models` 核对模型 id（见上文 [支持的模型](#支持的模型)）—下文示例反映常见硬件布局，其中的模型 id 仅为撰写时的示例。批准列表由治理决定；详见 [交易与治理指南](https://gonka.ai/transactions-and-governance/)。

=== "Qwen — 4xH100（同样适用于 8xH200 或 8xH100）"

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
                            "--tensor-parallel-size", "4"
                        ]
                    }
                }
            }
        ]
        ```

=== "Kimi — 4×B200 / 8×B200（及 8×H200 参考档位）"

    以下 vLLM 参数适用于 Blackwell **4×B200 或 8×B200** 上的 **Kimi K2.6**，并作为 **8×H200** 同布局的参考（`tensor_parallel_size` 为 4，且在八卡上使用 expert parallelism）。请仅在压测或运维要求下再调整。

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
                    "moonshotai/Kimi-K2.6": {
                        "args": [
                            "--tensor-parallel-size", "4",
                            "--enable-expert-parallel",
                            "--trust-remote-code",
                            "--mm-encoder-tp-mode", "data",
                            "--tool-call-parser", "kimi_k2",
                            "--reasoning-parser", "kimi_k2",
                            "--attention-backend", "FLASHINFER_MLA",
                            "--disable-custom-all-reduce",
                            "--gpu-memory-utilization", "0.95",
                            "--max-num-seqs", "128",
                            "--max-model-len", "240000"
                        ]
                    }
                }
            }
        ]
        ```

    通过 API 注册或更新节点时使用相同的 `"models"` 块；等效的 `curl` 示例见 [Kimi K2.6 Bootstrap](/host/kimi-bootstrap/)。

更多关于最优部署配置的说明请参阅 [此链接](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/)。

### [服务器] 将模型权重预下载到 Hugging Face 缓存（HF_HOME）

推理节点从 Hugging Face 下载模型权重。为确保推理前权重已就绪，应在部署前下载。

=== "Qwen — 8xH100、8xH200 或其他 GPU"

    ```bash
    mkdir -p $HF_HOME
    huggingface-cli download Qwen/Qwen3-235B-A22B-Instruct-2507-FP8
    ```

=== "Kimi K2.6"

    ```bash
    mkdir -p $HF_HOME
    huggingface-cli download moonshotai/Kimi-K2.6
    ```

    许可证见 [Model licenses](/model-licenses/)。链上操作（intent、委托等）见 [Kimi K2.6 Bootstrap](/host/kimi-bootstrap/)。

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

在同一容器内注册主机 — 此操作将您的 URL、账户密钥与自动获取的共识密钥在链上绑定：

```
./inferenced register-new-participant \
    $DAPI_API__PUBLIC_URL \
    $ACCOUNT_PUBKEY \
    --node-address $DAPI_CHAIN_NODE__SEED_API_URL
```

**预期输出：**
```
...
Found participant: gonka1rk52j24xj9ej87jas4zqpvjuhrgpnd7h3feqmm (url: http://36.189.234.237:19250, status: ACTIVE)
Participant is now available at http://36.189.234.237:19250/v2/participants/gonka1rk52j24xj9ej87jas4zqpvjuhrgpnd7h3feqmm
Account balance: 0
```

!!! warning "账户已存在链上交易记录"
    账户在首次收到代币时即永久创建于链上。如果您的账户密钥地址已有链上交易记录，请按以下步骤操作：

    **步骤 1.** 在步骤 3.1 的容器中，获取共识密钥并记录：
    ```bash
    curl -s $DAPI_CHAIN_NODE__URL/status | jq -r '.result.validator_info.pub_key.value'
    ```

    **步骤 2.** 退出容器，在**本地机器**（存有账户密钥的机器）上执行：
    ```bash
    ./inferenced tx inference submit-new-participant \
        <PUBLIC_URL> \
        --validator-key <CONSENSUS_KEY> \
        --keyring-backend file \
        --from <COLD_KEY_NAME> \
        --timeout-duration 1m \
        --unordered \
        --node <node-url>/chain-rpc/ \
        --chain-id gonka-mainnet
    ```

    `<node-url>` — 网络中任意已在运行的节点地址（例如 `http://node2.gonka.ai:8000`）。请勿使用您自己节点的 URL——此步骤中该节点尚未完全启动。

    若创建账户密钥时指定了自定义 `--keyring-dir`，请在命令中添加 `--keyring-dir <路径>`。

    命令会提示 `confirm transaction before signing and broadcasting [y/N]:`，输入 `y` 确认。

    Gas 费用由账户密钥的余额支付，请确保账户有足够代币。

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

## 验证节点状态 {#verify-node-status}

<!-- CONDITION START: data-show-when='["protocolHttps"]' -->
验证 HTTPS 是否正常：

```bash
curl -I https://<完整域名>:8443/health   # 预期：HTTP/2 200 OK
```
<!-- CONDITION END -->

在浏览器中打开以下 URL，将 `<your-gonka-cold-address>` 替换为您的地址：
```
http://node2.gonka.ai:8000/v2/participants/<your-gonka-cold-address>
```

你应看到参与者 JSON 数据（`participant.address`、`participant.inferenceUrl`、`participant.status`）。

如需查看账户数据（`pubkey`、`balance`、`denom`），请访问：
```
http://node2.gonka.ai:8000/v2/accounts/<your-gonka-cold-address>
```

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

当你的节点运行后，可以通过代理（proxy）检查节点状态。
```bash
curl http://<PUBLIC_IP>:8000/chain-rpc/status
```
在服务器本机上，你也可以使用私有地址（例如在容器内部，或当 26657 端口绑定到 localhost 时）。
```bash
curl http://0.0.0.0:26657/status
```
也可以使用创世节点（genesis node）的公共端点进行查询。
```bash
curl http://node2.gonka.ai:8000/chain-rpc/status
```

当你的节点已经在 Dashboard 中可见后，你可能还希望更新你的公开资料（例如主机名称、网站、头像等）。这将帮助网络中的其他参与者识别你的节点。你可以 [查看说明](https://gonka.ai/host/validator_info/).

## 5. [本地机器] 存入抵押品

**重要：请在你创建 Account Key 的安全本地机器上执行此步骤。**

Collateral（抵押品）是被锁定的 GNK，用于激活你 PoC（Proof of Compute，计算证明）权重中符合抵押条件的部分。如果没有抵押，Host 只能获得 Proof of Compute 所产生权重中的 基础权重（base weight）（默认仅为 20%）。宽限期现已结束，因此若想以完整权重运行，此步骤是必须的。

> **关于时间点说明：** Verify Node Status 仅表示你的容器已经运行且参与者已注册。它并不意味着 Proof of Compute 已成功完成——PoC 大约每 24 小时运行一次，只有在 PoC 完成后，你才能在 `$NODE_URL/v1/epochs/current/participants`中看到你的实际权重。
下方两个选项允许你：要么现在先存入一个估算值，要么等待第一次 PoC 完成后再按精确数据存入。

无法提前准确知道你的 PoC 权重——它取决于你的硬件、当前网络规模以及每个模型的系数。

**选项 A —— 现在就存入（从第 1 个 Epoch 开始即获得完整权重）** 查看当前网络中的权重分布，并存入足够覆盖较高范围的抵押金。这样你的节点在第一次 PoC 时就已经具备抵押。

```bash
export NODE_URL="<seed_api_url from server's config.env>"   # e.g. http://node2.gonka.ai:8000
export CHAIN_ID="gonka-mainnet"

PARAMS=$(curl -s "$NODE_URL/chain-api/productscience/inference/inference/params")
BASE_WEIGHT_RATIO=$(echo "$PARAMS" | jq -r '.params.collateral_params.base_weight_ratio
  | (.value | tonumber) * pow(10; .exponent | tonumber)')
COLLATERAL_PER_UNIT=$(echo "$PARAMS" | jq -r '.params.collateral_params.collateral_per_weight_unit
  | (.value | tonumber) * pow(10; .exponent | tonumber)')

MAX_WEIGHT=$(curl -s "$NODE_URL/v1/epochs/current/participants" \
  | jq '[.active_participants.participants[].weight] | max')

DEPOSIT=$(printf "%.0f" "$(echo "$MAX_WEIGHT * (1 - $BASE_WEIGHT_RATIO) * $COLLATERAL_PER_UNIT * 2" | bc -l)")
echo "Recommended deposit (covers network max with 2x buffer): ${DEPOSIT} ngonka"
```

公式如下： `MAX_WEIGHT × (1 − BASE_WEIGHT_RATIO) × COLLATERAL_PER_UNIT × 2`。只有符合抵押条件的那部分权重需要抵押支持（其余部分会作为基础权重直接给予），而 `× 2` 推荐的安全缓冲倍数。所有参数都会从链上读取，因此即使治理参数发生变化，该脚本依然有效。

> **为什么需要 2× 缓冲？** oC 权重会在不同 Epoch 之间波动（网络归一化、模型系数、上限、惩罚等原因）。协议不会自动补充抵押：如果你的抵押不足以覆盖下一个 Epoch 的实际权重，那么你会静默地获得更低权重，直到再次补充抵押为止——这意味着你至少会损失一个 Epoch 的完整奖励。多余的抵押不会丢失：它会保存在模块中，并且之后可以通过 `withdraw-collateral`提取。

**选项 B —— 等待第一次 PoC 后再精确存入（代价是有一个 Epoch 仅以 20% 权重运行）** 现在先跳过此步骤，等待第一次 PoC 阶段完成（约每 24 小时一次），然后在 `$NODE_URL/v1/epochs/current/participants` 查看你的真实权重，并重新运行上面的脚本，将你自己的权重替换 `MAX_WEIGHT`从第二个 Epoch 开始，你的节点将以完整权重运行。

使用你的 Account Key 存入抵押（始终使用 `ngonka`):

```bash
./inferenced tx collateral deposit-collateral ${DEPOSIT}ngonka \
  --from gonka-account-key \
  --keyring-backend file \
  --node $NODE_URL/chain-rpc/ \
  --chain-id $CHAIN_ID
```

验证：

```bash
MY_ADDR=$(./inferenced keys show gonka-account-key -a --keyring-backend file)
curl -s "$NODE_URL/chain-api/productscience/inference/collateral/collateral/$MY_ADDR" | jq
```

存款是累计的——如果你的权重增长，之后可以再次执行 `deposit-collateral` 进行补充。若想释放未使用的抵押，可以使用 `withdraw-collateral` 需要经过解绑期，默认 1 个 Epoch）。

关于 Slash（惩罚）、提现以及参数调优的更多细节，请查看 [Collateral documentation](https://gonka.ai/host/collateral/).

## 可选：PoC 委托与拒绝

在你的 Host 完成注册、ML Operational Key 完成授权，并且你已经可以 [验证](#verify-node-status) 参与状态之后，再使用本部分内容——通常是在你的本地机器上，使用 Account（冷）Key（`gonka-account-key`）进行操作。这里的内容并不是启动容器所必须的；它适用于你并未在自己的 GPU 上运行所有已通过治理批准的模型，并且需要将 PoC 投票权**委托（delegate）**给其他参与者、**拒绝（refuse）**委托，或结合 `params`对时间参数进行比较的情况。

对于每个 `model_id` ，你要么运行该模型（PoC 提交来自你的节点堆栈），要么通过链上信号进行声明。当你信任某个运行该模型的 Host 时，Delegation（委托） 是最常见的选择；refuse（拒绝） 则表示明确退出。背景说明： [Multi-Model PoC — Host Operations Guide](./multi_model_poc.md).

将 `NODE` 设置为任意一个已同步的链 RPC（与 `grant-ml-ops-permissions`的使用方式相同：使用 `config.env` 中的 seed API URL，并在末尾追加 `/chain-rpc/` ）。

```bash
export NODE="<PUBLIC_CHAIN_RPC>"   # 例如 https://node2.gonka.ai:8000/chain-rpc/
export NODE="<PUBLIC_CHAIN_RPC>"   # 例如 http://node2.gonka.ai:8000/chain-rpc/
export CHAIN_ID="gonka-mainnet"
export KEY="gonka-account-key"
export KEYRING_BACKEND="file"
```

检查治理参数（如惩罚规则、 `penalty_start_epoch`等）：

```bash
./inferenced query inference params --node "$NODE" -o json
```

**检查你的 PoC 委托 / 拒绝 / intent 状态（所有模型）：

```bash
MY_ADDR="$(./inferenced keys show "$KEY" -a --keyring-backend "$KEYRING_BACKEND")"
./inferenced query inference poc-delegation "$MY_ADDR" --node "$NODE" -o json
```

**委托** ——将你的权重用于该模型的 PoC 验证，并分配给 `DELEGATEE` （其 `gonka1…` 地址)。 Kimi 示例：

```bash
MODEL="moonshotai/Kimi-K2.6"
DELEGATEE="gonka1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

./inferenced tx inference set-poc-delegation "$MODEL" "$DELEGATEE" \
  --from "$KEY" \
  --node "$NODE" \
  --chain-id "$CHAIN_ID" \
  --keyring-backend "$KEYRING_BACKEND" \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

Qwen 示例（例如你只在 GPU 上运行 Kimi）：

```bash
MODEL="Qwen/Qwen3-235B-A22B-Instruct-2507-FP8"
DELEGATEE="gonka1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

./inferenced tx inference set-poc-delegation "$MODEL" "$DELEGATEE" \
  --from "$KEY" \
  --node "$NODE" \
  --chain-id "$CHAIN_ID" \
  --keyring-backend "$KEYRING_BACKEND" \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

**清楚** 某个模型的委托：

```bash
MODEL="moonshotai/Kimi-K2.6"

./inferenced tx inference set-poc-delegation "$MODEL" "" \
  --from "$KEY" \
  --node "$NODE" \
  --chain-id "$CHAIN_ID" \
  --keyring-backend "$KEYRING_BACKEND" \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

**拒绝** 某个模型的委托（链上明确 “否”）：

```bash
MODEL="moonshotai/Kimi-K2.6"

./inferenced tx inference refuse-poc-delegation "$MODEL" \
  --from "$KEY" \
  --node "$NODE" \
  --chain-id "$CHAIN_ID" \
  --keyring-backend "$KEYRING_BACKEND" \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

`declare-poc-intent` 主要适用于新模型启动（bootstrap）窗口；请参见 [Kimi K2.6 Bootstrap](./kimi-bootstrap.md)。更多命令与边缘情况： [Multi-Model PoC — Host Operations Guide](./multi_model_poc.md#copy-paste-setup-commands).

## 停止并清理你的节点

### 如何停止你的节点

检查你当前所处的 epoch。打开以下 URL： [http://node1.gonka.ai:8000/api/v1/epochs/latest](http://node1.gonka.ai:8000/api/v1/epochs/latest) （你也可以使用任何其他活跃参与者的 URL）

在返回结果中，查找：
```
"latest_epoch": {
    "index": 88,
    ...
}
```

记住你的节点当前工作的最新 epoch index。

在同一 JSON 返回中，查找：
```
"next_epoch_stages": {
  ...
  "claim_money": <block_number>
}
```
该区块号表示在该区块之后你可以领取奖励。但需要理解的是：你应该现在就开始逐个禁用 ML Node，而不要等到该区块之后再操作。

禁用每一个 ML Node：

```
curl -X POST http://<api_node_static_ip>:<admin_port>/admin/v1/nodes/<id>/disable
```
等待下一个 epoch。在此期间不要停止 Network Node 或 ML Nodes。disable 标志只有在下一个 epoch 开始后才会生效。

保持 Network Node 在线并保持同步，它将自动处理奖励领取。
要检查最新奖励是否已领取，请在 `claim_money` 区块之后运行以下命令（替换 `<YOUR_ADDRESS>` 和 `<EPOCH>` 为实际值）：
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
如果结果显示 `claimed = true`，说明奖励已经领取完成。
如果显示 `false`，请继续执行手动领取步骤。

!!! note "手动领取奖励（如需要）"
    Run:
    ```
    curl -X POST http://localhost:9200/admin/v1/claim-reward/recover \
     -H "Content-Type: application/json" \
     -d '{"force_claim": true}'
    ```

验证节点移除与权重情况。如果你已禁用所有节点，那么你的 participant 应该不会再出现在 active participants 列表中。如果仍然存在，说明网络仍然期望你参与当前 epoch，此时若直接关闭节点可能会错过 inference，从而影响你的信誉。

确保你在 `gonka/deploy/join` 目录下。停止所有运行中的容器：
```
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml down
```
该命令会停止并移除 `docker-compose.yml` 和 `docker-compose.mlnode.yml` 中定义的所有服务，但不会删除 volumes 或数据（除非另有显式配置）。

### 如何清理节点（完整重置）

如果你希望完全重置节点并删除所有数据（用于重新部署或迁移），请执行以下步骤： 

1. 清理缓存并重新开始，删除本地 `.inference` 和 `.dapi` 文件夹（推理运行时缓存与身份）：
```bash
rm -rf .inference .dapi .tmkms
```

2. （可选）清除模型权重缓存：
```bash
rm -rf $HF_HOME
```

!!! note
    删除 `$HF_HOME` 后，将需要重新从 Hugging Face 下载大型模型文件，或重新挂载 NFS 缓存。

**需要帮助？**  可查看 [FAQ page](https://gonka.ai/FAQ/)，或加入 [Discord server](https://discord.com/invite/RADwCT2U6R) 获取技术支持、通用咨询或安全问题帮助。
