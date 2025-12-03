# 主机节点快速入门

本指南介绍如何以主机身份加入网络。您需要部署以下两项服务，我们将以Docker容器形式在同一台机器上完成部署。

前提条件：确保您已准备好满足要求的GPU硬件。

部署流程：

- 部署网络节点. 首先，您需要部署网络节点。该节点包含两个进程：

    - 链节点：用于连接区块链。
    - API 节点：用于处理用户请求。

- 部署推理节点. 接着，部署至少一个推理节点。该节点将在您的GPU上执行大语言模型推理任务。

注意：本指南默认每台主机仅运行一个推理节点。

??? note "直播演示 — 如何启动节点（主机快速入门）"
    视频录制可在下方查看。由于 quickstart 会根据社区反馈持续更新，录制中的某些步骤可能与下方的说明略有不同。请始终以书面版 quickstart 为准，它反映当前且正确的操作流程。
    
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

!!! note "重要警告：9100 和 9200 端口绝不能公开访问"
    9100 和 9200 是内部服务端口。如果暴露在公共互联网上，会造成严重的安全漏洞。一旦这些端口暴露，第三方可以在任何时刻停止你的节点。
    **要求：**
    
    - 仅允许从私有网络访问 9100 和 9200。
    - **绝不要**将这些端口暴露在公共互联网上。
    
    如果你的 MLNode 容器和 Network node 容器运行在同一台机器上，你可以直接编辑 `gonka/deploy/join/docker-compose.yml`：
    
    ```
    api:
       ports:
          - "127.0.0.1:9100:9100"
          - "127.0.0.1:9200:9200"
    ```
    替代原来的：
    ```
          - "9100:9100"
          - "9200:9200"
    ```

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
    
    - 主密钥，拥有对所有其他密钥的授权权限
    - 必须离线保存于安全、隔离的设备上
    - 仅用于授权操作和验证者注册
    - 由助记词保护——一旦丢失，所有访问权限将永久失效

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

### 【服务器】设置环境变量

<!-- CONDITION START: data-show-when='["non-finished"]' -->
!!! note "需要配置"
    请完成下面的问卷以生成您的 `config.env` 配置。环境变量取决于您的选择（HTTP/HTTPS、SSL 证书方法等）。
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["domainNo"]' -->
!!! warning "无域名时无法使用 HTTPS"
    SSL/TLS 证书只能为域名（如 `example.com`）颁发，不能为直接 IP 地址颁发。由于您表示没有配置域名，您的节点将仅使用 **HTTP**（端口 8000）进行设置。
    
    如果您需要 HTTPS 安全保护，您需要：
    
    1. 获取域名并将 DNS 配置为指向您服务器的 IP 地址
    2. 按上方的 **"重置"** 按钮，并在询问是否拥有域名时选择 **"是"**
    
    对于生产环境部署，强烈建议使用 HTTPS 以加密 API 通信并保护敏感数据。
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
    <p style="margin-top: 1rem; font-size: 0.7rem; color: var(--md-default-fg-color--light);">复制上面的配置，然后继续编辑下面描述的值。</p>
    <button class="quickstart-copy-btn">复制到剪贴板</button>
    <button class="quickstart-reset-btn">重置</button>
  </div>
</div>

<!-- CONDITION START: data-show-when='["finished"]' -->

如果您的节点无法连接到默认的种子节点，[请查看常见问题（FAQ）获取详细说明。](https://gonka.ai/zh/FAQ/#_17)

### 【服务器】编辑环境变量

需要修改的变量：

<div id="quickstart-edit-table"></div>

其他变量保持默认即可。

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto"]' -->
**如何从域名提供商获取变量：**

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "cloudflare"]' -->
??? details "Cloudflare"
    1) 打开 Cloudflare 控制面板。
    
    2) 转到 个人资料 → API 令牌。
    
    3) 点击创建令牌。
    
    4) 使用编辑区域 DNS 模板或设置权限：区域:读取 和 DNS:编辑。
    
    5) 将令牌限制为您的 DNS 区域并创建它。
    
    6) 复制令牌并设置 `CF_DNS_API_TOKEN`。
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "route53"]' -->
??? details "AWS Route53"
    **选项 A — AWS CLI**
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

    **选项 B — 控制台**
    
    1) 创建一个限制为您的托管区域的 IAM 策略（ChangeResourceRecordSets 和列表权限）。
    
    2) 创建一个具有编程访问权限的 IAM 用户。
    
    3) 将策略附加到用户。
    
    4) 创建访问密钥对并设置 `AWS_ACCESS_KEY_ID`、`AWS_SECRET_ACCESS_KEY` 和 `AWS_REGION`。
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "gcloud"]' -->
??? details "Google Cloud DNS"
    **选项 A — gcloud CLI：**
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
    **选项 B — 控制台**
    
    1) IAM 和管理 → 服务账户 → 创建服务账户（例如，acme-dns）。
    
    2) 授予服务账户角色：DNS 管理员（`roles/dns.admin`）。
    
    3) 服务账户 → 密钥 → 添加密钥 → 创建新密钥（JSON）→ 下载。
    
    4) 将 JSON 密钥进行 base64 编码为单行并设置 `GCE_SERVICE_ACCOUNT_JSON_B64`。将 `GCE_PROJECT` 设置为您的项目 ID。
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "azure"]' -->
??? details "Azure DNS"
    **选项 A — Azure CLI**（快速）
    ```bash
    # 1) 登录并选择订阅
    az login
    az account set --subscription "<your-subscription-name-or-id>"

    # 2) 设置您的 DNS 区域所在位置
    RG="<<your-dns-resource-group>>"
    ZONE="<<your-zone>>"         # 例如，gonka.ai
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

    # 5) 打印到您的环境文件
    echo "AZURE_CLIENT_ID=$AZURE_CLIENT_ID"
    echo "AZURE_CLIENT_SECRET=$AZURE_CLIENT_SECRET"
    echo "AZURE_SUBSCRIPTION_ID=$SUBSCRIPTION_ID"
    echo "AZURE_TENANT_ID=$AZURE_TENANT_ID"
    ```
    **选项 B — 门户**
    
    1) 转到 Microsoft Entra ID → 应用注册 → 新注册。复制应用程序（客户端）ID 和目录（租户）ID。
    
    2) 转到证书和机密 → 新建客户端机密。复制机密值并设置 `AZURE_CLIENT_SECRET`。
    
    3) 复制您的订阅 ID 并设置 `AZURE_SUBSCRIPTION_ID`。
    
    4) 在您的 DNS 区域中，打开访问控制（IAM）→ 添加角色分配 → DNS 区域参与者 → 分配给注册的应用。
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "digitalocean"]' -->
??? details "DigitalOcean DNS"
    1) 打开 DigitalOcean 控制面板。
    
    2) 转到 API → 令牌。
    
    3) 生成一个写入范围的令牌并设置 `DO_AUTH_TOKEN`。
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "hetzner"]' -->
??? details "Hetzner DNS"
    1) 打开 https://dns.hetzner.com。
    
    2) 转到 API 令牌。
    
    3) 创建新令牌并设置 `HETZNER_API_KEY`。
<!-- CONDITION END -->
<!-- CONDITION END -->

**加载配置：**
```bash
source config.env
```

!!! note "环境变量的使用"
    下面示例会在本地与服务器命令中引用这些环境变量（如 `$PUBLIC_URL`、`$ACCOUNT_PUBKEY`、`$SEED_API_URL`）。请在每个将要执行命令的终端会话中运行一次 `source config.env`。
<!-- CONDITION END -->

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

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodManual", "domainYes"]' -->
#### 3.4. 【服务器】手动 SSL 证书设置

如果您在问卷中选择了手动 SSL 证书设置，请按照以下步骤配置您的 SSL 证书：

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
    Certbot 将暂停并显示需要在您的提供商处添加的 **TXT DNS** 记录。验证后，`cert.pem` 和 `private.key` 将出现在 `./secrets/nginx-ssl/` 目录中。

##### 验证证书文件

确保证书文件已就位：

```bash
ls -la secrets/nginx-ssl/
```

您应该看到：
- `cert.pem`（完整链证书）
- `private.key`（私钥，模式 0600）

问卷生成的 `config.env` 文件已包含必要的 SSL 配置变量：
- `SERVER_NAME=<完整域名>`
- `SSL_CERT_SOURCE=./secrets/nginx-ssl`

在继续之前，请确保将 `SERVER_NAME` 编辑为您的实际域名。

<!-- CONDITION END -->

## 4. 【服务器】启动完整节点

最后，启动包括 API 在内的全部容器：

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

`--profile "ssl"` 标志启用 `proxy-ssl` 容器，该容器会自动管理 SSL 证书。
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
验证 HTTPS 是否正常工作：

```bash
curl -I https://<完整域名>:8443/health   # 预期：HTTP/2 200 OK
```
<!-- CONDITION END -->
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

[你可以在自己的 MLNode 上模拟执行 Proof of Compute，以确保在链上 PoC 阶段开始时一切都能正常运行。](https://gonka.ai/zh/FAQ/#poc)

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

### 如何停止节点

请查看你当前所处的 epoch。打开以下链接：
[http://node1.gonka.ai:8000/api/v1/epochs/latest](http://node1.gonka.ai:8000/api/v1/epochs/latest)￼（你也可以使用任何其他活跃参与者的链接）。

在返回结果中，查找以下字段：
```
"latest_epoch": {
    "index": 88,
    ...
}
```

记住你的节点最后运行所在的 epoch 索引。

在同一个 JSON 返回结果中，查找：
```
"next_epoch_stages": {
  ...
  "claim_money": <block_number>
}
```
该区块高度表示从该区块之后你才能领取奖励。
但需要注意的是，你现在就应该开始禁用每个 MLNode（不要等到达到这个区块后再禁用你的 MLNodes）。

禁用每个 MLNode。

```
curl -X POST http://<api_node_static_ip>:<admin_port>/admin/v1/nodes/<id>/disable
```
等待下一个 epoch。此时不要停止 Network Node 或 MLNodes。
禁用标记只有在下一个 epoch 开始后才会生效。

保持你的 Network Node 在线并保持同步，它会自动处理奖励领取。

要检查最近一次奖励是否已被领取，在经过 `claim_money` 区块后，运行以下命令（将 `<YOUR_ADDRESS>` 和 `<EPOCH>` 替换为你的实际值）：
```
inferenced query inference show-epoch-performance-summary <EPOCH> <YOUR_ADDRESS> --node http://node1.gonka.ai:8000/chain-rpc/ --output json
```
示例: 
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
如果结果显示 `claimed = true`，说明你的奖励已成功领取。
如果显示 `false`，请继续执行手动领取步骤。

!!! note "如有需要，手动领取奖励"
    运行:
    ```
    curl -X POST http://localhost:9200/admin/v1/claim-reward/recover \
     -H "Content-Type: application/json" \
     -d '{"force_claim": true}'
    ```

验证移除情况和权重。如果你已经禁用了所有节点，那么你的参与者信息应当从活跃参与者列表中消失。
如果你仍然能在列表中看到你的参与者，这意味着网络仍然期望你在当前 epoch 中继续参与，而如果你此时停止节点，你可能会错过推理任务，从而影响你的信誉。

确保你位于 `gonka/deploy/join` 目录下。
要停止所有正在运行的容器：
```
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml down
```
该命令会停止并移除 `docker-compose.yml` 和 `docker-compose.mlnode.yml` 中定义的所有服务，除非进行了特别配置，否则不会删除卷或数据。

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

**需要帮助？** [请先查看我们的常见问题页面](https://gonka.ai/zh/FAQ/)，或加入我们的[Discord 服务器](https://discord.com/invite/RADwCT2U6R) 服务器，以获取关于一般咨询、技术问题或安全相关事项的协助。
