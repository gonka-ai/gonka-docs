# 设置您的链

**主机**（**硬件提供商**或**节点**）向网络贡献计算资源，并根据其提供的资源数量和质量获得奖励。

要加入网络，您需要部署两个服务：

- **网络节点** – 由两个节点组成的服务：一个**链节点**和一个**API节点**。此服务处理所有通信。**链节点**连接到区块链，而**API节点**管理用户请求。
- **推理（ML）节点** – 一个在GPU上执行大语言模型（LLM）推理的服务。您至少需要一个**ML节点**才能加入网络。

本指南描述了在同一台机器上部署这两个服务的场景，每个主机拥有一个ML节点。服务以Docker容器形式部署。

??? note "实时演示 — 如何启动节点（主机快速入门）"
    通过快速入门启动节点的演示会话视频记录如下。录制中的某些步骤可能与下方说明不同，因为快速入门会根据社区反馈持续更新。请始终遵循书面快速入门 —— 它反映了当前正确的流程。

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
本节提供有关配置硬件基础设施以参与Gonka网络启动的指导。目标是通过使您的部署符合网络预期来最大化协议奖励。

### 支持的模型
该协议支持**治理批准**的模型用于推理和计算证明（PoC v2）。在Gonka主网上，每个批准的模型都有其独立的PoC组和奖励追踪（自v0.2.12升级后支持多模型PoC）。

| 模型ID | 角色 |
|----------|------|
| `MiniMaxAI/MiniMax-M2.7` | **MiniMax M2.7** — 基础模型，也是网络上的活跃PoC模型 |
| `moonshotai/Kimi-K2.6` | **Kimi K2.6** — 正在重新启动；恢复后将与MiniMax一同参与 |

!!! tip "权威模型列表（治理API）"
    批准的模型可能在发布或周期之间发生变化。**在您编辑 `node-config.json` 之前**，调用治理API，并使用每个返回对象的 `"id"` 作为 `"models"` 下的键：
    ```bash
    curl -sS http://node2.gonka.ai:8000/v1/governance/models
    ```
    要仅列出模型ID，请将响应通过管道传递：`jq -r '.models[].id'`。如果 `node2.gonka.ai` 无法访问，请使用其他参与者的公共API基础URL（协议、主机和端口）。响应还包括网络参数，例如 `model_args`；后面的 `node-config.json` 示例展示了常见硬件的典型 `args` —— 请根据您的GPU和基准测试进行调整。

您通常在 `node-config.json` 中为每个ML节点运行**一个模型**。主机可以为MiniMax和Kimi分别运行独立的ML节点（或集群）。

!!! tip "仓库中的参考部署配置"
    `deploy/join/` 文件夹提供了每个批准模型和最常见GPU类别的即用型 `node-config-*.json` 文件。将与您的硬件匹配的文件复制到 `node-config.json`，而不是从头编写：

    - **Kimi K2.6** — `deploy/join/node-config-kimik26-H200.json`, `deploy/join/node-config-kimik26-B200.json`
    - **MiniMax M2.7** — `deploy/join/node-config-minimax-A100.json`, `deploy/join/node-config-minimax-H100.json`, `deploy/join/node-config-minimax-H200.json`, `deploy/join/node-config-minimax-B200.json`

为方便起见，这些文件的内容在下方内联重现。

!!! note "如果您不会运行每个批准的模型"
    多模型PoC按**每个模型**跟踪参与情况。如果您的硬件**不**覆盖所有治理批准的模型，您需要链上**委托**或**拒绝**，以便正确处理您跳过的模型的共识权重。这**不是**启动节点所必需的——您使用与[为ML操作密钥授予权限](#33-local-machine-grant-permissions-to-ml-operational-key)中相同的**账户（冷）密钥**，**在注册和验证之后**。复制粘贴命令在末尾：[可选：PoC委托和拒绝](#optional-poc-delegation-and-refusal)。有关策略和惩罚，请阅读[多模型PoC — 主机操作指南](./multi_model_poc.md)。

!!! note "治理与模型分类"
    - 如果获得治理批准，模型可被归类到某一类别。
    - 关于添加或更改支持模型的决策由治理决定。
    - 有关治理流程和如何提议新模型的详细信息，请参阅[交易与治理指南](https://gonka.ai/governance/transactions-and-governance/)。

### 建议的硬件配置
要运行有效节点，您需要配备[支持的GPU](/host/hardware-specifications/)的机器。以下为参考布局：

| **模型名称** | **ML节点（最少）** | **示例硬件** | **每个ML节点的最小VRAM** |
|------------------------------------------|-------------------|-------------------------------------------------|----------------|
| `moonshotai/Kimi-K2.6` | ≥ 2 | 每个ML节点配备8×H200或8×B200（参考类别） | 640 GB |
| `MiniMaxAI/MiniMax-M2.7` | ≥ 2 | 4× A100 / 4× H100 / 2× H200 / 2× B200 每个 MLNode | ~320 GB |

这是一个参考架构。您可以调整节点数量或硬件分配，但我们建议遵循核心原则：每个节点应支持所有模型层级的多个 ML 节点。

对于 Kimi K2.6，网络在相同参考硬件（8×H200，8×B200）上使用约 **3.51×** Qwen235B 的**权重系数**。参见 [多模型 PoC — 主机操作指南](./multi_model_poc.md)。B200 类主机的示例 vLLM 参数见 [Kimi K2.6 启动指南](./kimi-bootstrap.md) 以及下面的 `node-config.json` 示例。

有关最优部署配置的更多详细信息，请参见 [此处](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/)。

托管网络节点的服务器应具备：

- 16 核 CPU (amd64)
- 64 GB 或更多 RAM
- 1TB NVMe SSD
- 至少 100Mbps 网络连接（推荐 1Gbps）

最终需求将取决于连接的 ML 节点数量及其总吞吐量。

用于部署每个 ML 节点的服务器应具备：

- 至少为 GPU 显存 1.5 倍的 RAM
- 16 核 CPU（网络节点和 ML 节点可部署在同一台服务器上）。
- 已安装并配置 NVIDIA Container Toolkit，CUDA Toolkit 版本在 12.6 至 12.9 之间。您可以通过 `nvidia-smi` 检查版本。

### 网络访问、代理和端口（重要）

Gonka 网络采用基于代理的架构，以保护节点免受滥用和 DDoS 攻击。所有公共 HTTP/HTTPS 流量必须通过代理容器。直接暴露网络节点或 ML 节点服务是不安全的。

!!! note "公开暴露的端口"

    以下端口可公开暴露于互联网：

    - 5000 - Tendermint P2P 通信
    - 8000 / 8443 - 仅通过代理的应用服务

!!! warning "警告：内部端口"

    以下端口为仅限内部使用，严禁公开访问：

    - 26657 - Tendermint RPC
    - 9100, 9200 — 网络节点内部 API
    - 5050 — ML 节点 / vLLM 推理 API
    - 8080 — ML 节点 API

如果这些端口中的任何一个被暴露在公共互联网上，您的节点将面临风险。第三方可以自由发送请求，使您的 ML 节点过载，干扰挖矿，或导致您的节点脱离一个纪元。

**要求：**

    - 仅允许从本地主机、私有网络或白名单访问这些端口
    - 切勿公开暴露这些端口
    - Docker 默认设置不安全

!!! note "从升级 0.2.8 开始"

    为默认提升安全性和性能，除非明确覆盖，否则将自动应用以下路由控制和链服务限制。
    ```bash title="API Manual Routes Control"
          # Defines which routes bypass rate limits (Exempt) vs those completely disabled (Blocked)
          - GONKA_API_EXEMPT_ROUTES=chat inference
          - GONKA_API_BLOCKED_ROUTES=poc-batches training
    ```
    
    ```bash title="Chain Routes Disabling"
          # Disables public access to Chain services by default
          - DISABLE_CHAIN_API=${DISABLE_CHAIN_API:-true}
          - DISABLE_CHAIN_RPC=${DISABLE_CHAIN_RPC:-true}
          - DISABLE_CHAIN_GRPC=${DISABLE_CHAIN_GRPC:-true}
    ```

以下情况描述了网络节点和 ML 节点服务的内部端口隔离。这些规则在代理配置为唯一公共入口点后生效。它们不替代代理，必须与代理配合使用。

=== "情况 1：ML 节点和网络节点在同一台机器上"
    将端口绑定到仅本地主机。

**网络节点（`docker-compose.yml`）**

如果您的 ML 节点容器和网络节点容器在同一台机器上，您只需编辑 `gonka/deploy/join/docker-compose.yml`：
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

=== "情况2：ML节点和网络节点位于不同机器上"
    在此配置中，网络节点与ML节点之间的所有通信必须通过私有网络进行。绝对不得使用公共IP或公共DNS名称进行以下操作：

    - ML节点API
    - `DAPI_API__POC_CALLBACK_URL`

如果ML节点和网络节点的容器位于不同机器上，情况1中描述的修复方法将无效，保护这些端口的具体方式取决于您的配置。您应通过使用相同的Docker网络，或在机器之间设置私有网络、在该网络中暴露端口并关闭公共端口，来建立ML节点与网络容器之间的连接。在此情况下，您还应在配置中正确设置 `DAPI_API__POC_CALLBACK_URL` 变量。此URL必须指向私有/内部地址，而非公共地址。

## 设置您的节点

快速入门指南旨在将网络节点和推理节点部署在同一台机器上（单服务器设置）。

??? note "多节点部署"
    如果您部署多个GPU节点，请参阅详细的[多节点部署指南](https://gonka.ai/host/multiple-nodes/)以进行正确设置和配置。无论您是将推理节点部署在单台机器上还是跨多台服务器（包括跨地理区域），所有推理节点都必须连接到同一个网络节点。

### 密钥管理概览
在配置您的网络节点之前，您需要为安全操作设置加密密钥。  
**建议在启动生产节点前阅读[密钥管理指南](/host/key-management/)。**

我们使用三密钥系统：

- **账户密钥**（冷钱包）- 在您的本地安全机器上创建，用于高风险操作
- **共识密钥**（TMKMS - 温存储）- 由安全的TMKMS服务管理，用于区块验证和网络共识参与
- **ML操作密钥**（温钱包）- 在服务器上创建，用于自动化AI工作负载交易

### [本地机器] 安装CLI工具
`inferenced` CLI 是本地账户管理和网络操作所必需的。它是一个命令行界面工具，允许您从本地机器创建和管理Gonka账户、注册主机并执行各种网络操作。

**选择正确的二进制文件**

GitHub发布版本可能包含多个 `inferenced` 文件。

对于本地CLI使用，请始终下载**特定操作系统的打包CLI构建**，例如：

- `inferenced-darwin-amd64.zip`
- `inferenced-darwin-arm64.zip`
- `inferenced-linux-amd64.zip`
- `inferenced-linux-arm64.zip`

请勿使用专为升级路径或容器/运行时环境设计的通用 `inferenced` 二进制文件。这些文件可能无法在您的本地机器上作为独立CLI正常工作。

**版本要求**

请确保您使用的是 [版本0.2.9](https://github.com/gonka-ai/gonka/releases/tag/release/v0.2.9) 或[更新版本](https://github.com/gonka-ai/gonka/releases) 的 `inferenced` CLI 构建。旧版CLI不支持权限授予，可能导致意外行为。

如果您计划提交治理提案，尤其是使用新消息类型的提案，请使用最新发布的特定操作系统CLI构建。

**验证安装**

```bash
chmod +x inferenced
./inferenced --help
```

!!! note "macOS 用户"
    在 macOS 上，如果被提示，您可能需要在 `System Settings` → `Privacy & Security` 中允许执行。向下滚动到有关 `inferenced` 的警告，然后点击 `Allow Anyway`。

    如果在 Linux 上启动二进制文件时出现类似 `Error relocating ./inferenced: qsort_r: symbol not found` 的错误，您很可能下载了非 CLI 或仅用于升级的工件，而不是特定于操作系统的打包 CLI 构建。请重新下载适用于您的操作系统和架构的正确归档文件。

### [本地机器] 创建账户密钥
**重要：请在安全的本地机器上执行此步骤（不要在您的服务器上执行）**

??? note "关于账户密钥（冷密钥）"
    账户密钥是您的主要高权限密钥。它在本地创建，绝不会存储在您的服务器上。

    - 授予所有其他密钥权限的主密钥
    - 必须离线存储在安全的气隙机器上
    - 仅用于授予权限和验证者注册
    - 由助记词保护——如果丢失，所有访问将永久丢失

使用 `file` 密钥环后端创建您的账户密钥（在支持的系统上，您也可以使用 `os` 以获得更高的安全性）：

```bash
./inferenced keys add gonka-account-key --keyring-backend file
```

CLI 将要求您输入密码短语，并显示已创建密钥对的信息。
```
❯ ./inferenced keys add gonka-account-key --keyring-backend file
Enter keyring passphrase (attempt 1/3):
Re-enter keyring passphrase:

- address: gonka1rk52j24xj9ej87jas4zqpvjuhrgpnd7h3feqmm
  name: gonka-account-key
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"Au+a3CpMj6nqFV6d0tUlVajCTkOP3cxKnps+1/lMv5zY"}'
  type: local


**Important** write this mnemonic phrase in a safe place.
It is the only way to recover your account if you ever forget your password.

pyramid sweet dumb critic lamp various remove token talent drink announce tiny lab follow blind awful expire wasp flavor very pair tell next cable
```

**至关重要**：请将此助记词写下来，并安全地离线存储。此短语是**唯一**恢复您的账户密钥的方法。

!!! info "硬件钱包支持"
    **当前状态**：在网络安全启动时，尚不支持硬件钱包。

    **目前**：请将您的账户密钥存储在安全的专用机器上，该机器应尽量减少互联网暴露并使用强加密。

    **重要**：无论将来是否采用硬件钱包，都请始终将助记词作为备份。

### [服务器] 下载部署文件
克隆包含基础部署脚本的仓库：

```bash
git clone https://github.com/gonka-ai/gonka.git -b main && \
cd gonka/deploy/join
```

并复制 `config` 文件模板：
```
cp config.env.template config.env
```

克隆仓库后，您将找到以下密钥配置文件：

| 文件 | 描述 |
|-------------------------------|----------------------------------------------------------------------------------|
| `config.env` | 包含网络节点的环境变量 |
| `docker-compose.yml` | 用于启动网络节点的 Docker Compose 文件 |
| `docker-compose.mlnode.yml` | 用于启动 ML 节点的 Docker Compose 文件 |
| `node-config.json` | 网络节点使用的配置文件，描述了此网络节点管理的推理节点 |

### [服务器] 设置环境变量

<!-- CONDITION START: data-show-when='["non-finished"]' -->
!!! note "需要配置"
    请完成问卷以生成您的 `config.env` 配置。环境变量取决于您的选择（HTTP/HTTPS、SSL 证书方法等）。
    <!-- CONDITION END -->

    <!-- CONDITION START: data-show-when='["domainNo"]' -->
!!! warning "没有域名则无法使用 HTTPS"
    SSL/TLS 证书只能为域名（例如 `example.com`）签发，不能为直接的 IP 地址签发。由于您表示未配置域名，您的节点将仅设置为 **HTTP**（端口 8000）。

    如果您需要 HTTPS 安全性，您需要：

    1. 获取一个域名，并配置 DNS 指向您的服务器 IP 地址
    2. 点击上方的 **"重置"** 按钮，并在被问及是否有域名时选择 **"是"**

对于生产部署，强烈建议使用 HTTPS 来加密 API 通信并保护敏感数据。
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
    <p style="margin-top: 1rem; font-size: 0.7rem; color: var(--md-default-fg-color--light);">复制上述配置，并按下方说明编辑值。</p>
    <button class="quickstart-copy-btn">复制到剪贴板</button>
    <button class="quickstart-reset-btn">重置</button>
  </div>
</div>

<!-- CONDITION START: data-show-when='["finished"]' -->

如果您的节点无法连接到默认种子节点，请[参见常见问题解答以获取详细信息。](https://gonka.ai/FAQ/#my-node-cannot-connect-to-the-default-seed-node-specified-in-the-configenv)
### [服务器] 编辑环境变量

要编辑的变量：

<div id="quickstart-edit-table"></div>

其他所有变量均可保持不变。

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto"]' -->
**如何从域名提供商获取变量：**

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "cloudflare"]' -->
??? details "Cloudflare"
    1) 打开 Cloudflare 仪表板。

2) 转到个人资料 → API 令牌。

3) 点击创建令牌。

4) 使用编辑区域 DNS 模板，或设置权限：区域：读取 和 DNS：编辑。

5) 将令牌限制为您自己的 DNS 区域并创建它。

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

1) 创建一个仅限于您的托管区域的 IAM 策略（ChangeResourceRecordSets 和列表权限）。

2) 创建一个具有编程访问权限的 IAM 用户。

3) 将策略附加到该用户。

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
    # 1) Service account
    gcloud iam service-accounts create "$SA_NAME" \
    --display-name "ACME DNS for proxy-ssl"
    # 2) Role
    gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member "serviceAccount:$SA_EMAIL" \
    --role "roles/dns.admin"
    # 3) Key → base64 (single line)
    gcloud iam service-accounts keys create key.json --iam-account "$SA_EMAIL"
    GCE_SERVICE_ACCOUNT_JSON_B64=$(base64 < key.json | tr -d '\n')

    echo "GCE_PROJECT=$PROJECT_ID"
    echo "GCE_SERVICE_ACCOUNT_JSON_B64=$GCE_SERVICE_ACCOUNT_JSON_B64"
    ```
    **选项 B — 控制台**

1) IAM 和管理员 → 服务账号 → 创建服务账号（例如 acme-dns）。

2) 为服务账号授予角色：DNS 管理员（`roles/dns.admin`）。

3) 服务账号 → 密钥 → 添加密钥 → 创建新密钥（JSON）→ 下载。

4) 将 JSON 密钥 Base64 编码为单行并设置 `GCE_SERVICE_ACCOUNT_JSON_B64`。将 `GCE_PROJECT` 设置为您的项目 ID。
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "azure"]' -->
??? details "Azure DNS"
    **选项 A — Azure CLI**（快速）
    ```bash
    # 1) Login and choose subscription
    az login
    az account set --subscription "<your-subscription-name-or-id>"

    # 2) Set where your DNS zone lives
    RG="<<your-dns-resource-group>>"
    ZONE="<<your-zone>>"         # e.g., gonka.ai
    SP_NAME="gonka-acme-$(date +%s)"

    SUBSCRIPTION_ID=$(az account show --query id -o tsv)
    SCOPE="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.Network/dnszones/$ZONE"

    CREDS=$(az ad sp create-for-rbac \
    --name "$SP_NAME" \
    --role "DNS Zone Contributor" \
    --scopes "$SCOPE" \
    --only-show-errors)

    # 4) Extract values
    AZURE_CLIENT_ID=$(echo "$CREDS" | jq -r .appId)
    AZURE_CLIENT_SECRET=$(echo "$CREDS" | jq -r .password)
    AZURE_TENANT_ID=$(echo "$CREDS" | jq -r .tenant)

    # 5) Print for your env file
    echo "AZURE_CLIENT_ID=$AZURE_CLIENT_ID"
    echo "AZURE_CLIENT_SECRET=$AZURE_CLIENT_SECRET"
    echo "AZURE_SUBSCRIPTION_ID=$SUBSCRIPTION_ID"
    echo "AZURE_TENANT_ID=$AZURE_TENANT_ID"
    ```
    **选项 B — 门户**

1) 转到 Microsoft Entra ID → 应用注册 → 新注册。复制应用程序（客户端）ID 和目录（租户）ID。

2) 转到证书和密钥 → 新客户端密钥。复制密钥值并设置 `AZURE_CLIENT_SECRET`。

3) 复制您的订阅 ID 并设置 `AZURE_SUBSCRIPTION_ID`。

4) 在您的 DNS 区域中，打开访问控制（IAM）→ 添加角色分配 → DNS 区域参与者 → 分配给已注册的应用程序。
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "digitalocean"]' -->
??? details "DigitalOcean DNS"
    1) 打开 DigitalOcean 控制面板。

2) 转到 API → 令牌。

3) 生成一个具有写入权限的令牌并设置 `DO_AUTH_TOKEN`。
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

!!! note "使用环境变量"
    以下各节中的示例将引用这些环境变量（例如 `$PUBLIC_URL`、`$ACCOUNT_PUBKEY`、`$SEED_API_URL`），适用于本地机器命令和服务器命令。请确保在每个将执行这些命令的终端会话中运行 `source config.env`。
    <!-- CONDITION END -->



### [服务器] 编辑服务器的推理节点描述

!!! note 
    当前网络支持 `MiniMaxAI/MiniMax-M2.7` 作为活跃的 PoC 模型。治理机制负责决定添加或修改支持的模型。有关模型治理的工作原理及如何提议新模型的详细信息，请参阅 [交易与治理指南](https://gonka.ai/governance/transactions-and-governance/)。

    === "Kimi — 4×B200 / 8×B200（以及 8×H200 参考规格）"

    在 Blackwell **4×B200 或 8×B200** 上使用此 vLLM 参数集进行 **Kimi K2.6** 部署，并作为 **8×H200**（相同布局，`tensor_parallel_size` 4 且专家并行跨八个 GPU）的参考配置。仅在您的堆栈或基准测试需要时才进行调整。

    仓库中的参考部署配置：`deploy/join/node-config-kimik26-B200.json`。

    !!! note "edit node-config.json"
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

    在通过 API 注册或更新节点时，使用相同的 `"models"` 块；有关等效的 `curl` 示例，请参阅 [Kimi K2.6 引导](./kimi-bootstrap.md)。

=== "Kimi — 8×H200"

仓库中的参考部署配置：`deploy/join/node-config-kimik26-H200.json`。在所有 GPU 上使用 `FLASHMLA` 注意力机制和 `tensor_parallel_size=8`，不使用专家并行。

    !!! note "edit node-config.json"
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
                            "--tensor-parallel-size", "8",
                            "--enable-expert-parallel",
                            "--trust-remote-code",
                            "--mm-encoder-tp-mode", "data",
                            "--tool-call-parser", "kimi_k2",
                            "--reasoning-parser", "kimi_k2",
                            "--attention-backend", "FLASHMLA",
                            "--gpu-memory-utilization", "0.90",
                            "--max-model-len", "240000"
                        ]
                    }
                }
            }
        ]
        ```

=== "MiniMax — 4×A100"

在 **4×A100** 上使用此 vLLM 参数集进行 **MiniMax M2.7** 部署。A100 无法使用 FP8 FlashInfer MoE 路径，因此此配置使用 `marlin` MoE 后端。您还需要为 `mlnode-308` 服务设置环境变量 `VLLM_USE_FLASHINFER_MOE_FP8=0`（此设置已在随 MLNode 3.0.14 一起提供的 `deploy/join/docker-compose.mlnode.yml` 中预设）。

仓库中的参考部署配置：`deploy/join/node-config-minimax-A100.json`。

    !!! note "edit node-config.json"
        ```
        [
            {
                "id": "node1",
                "host": "inference",
                "inference_port": 5000,
                "poc_port": 8080,
                "max_concurrent": 500,
                "models": {
                    "MiniMaxAI/MiniMax-M2.7": {
                        "args": [
                            "--moe-backend", "marlin",
                            "--tensor-parallel-size", "4",
                            "--gpu-memory-utilization", "0.95",
                            "--max-num-seqs", "128",
                            "--enable-auto-tool-choice",
                            "--max-model-len", "180000",
                            "--kv-cache-dtype", "fp8",
                            "--tool-call-parser", "minimax_m2",
                            "--reasoning-parser", "minimax_m2_append_think"
                        ]
                    }
                }
            }
        ]
        ```

=== "MiniMax — 4×H100"

在 **4×H100** 上使用此 vLLM 参数集进行 **MiniMax M2.7** 部署。使用 `FLASHINFER` 注意力后端和 FP8 kv-cache。

仓库中的参考部署配置：`deploy/join/node-config-minimax-H100.json`。

    !!! note "edit node-config.json"
        ```
        [
            {
                "id": "node1",
                "host": "inference",
                "inference_port": 5000,
                "poc_port": 8080,
                "max_concurrent": 500,
                "models": {
                    "MiniMaxAI/MiniMax-M2.7": {
                        "args": [
                            "--tensor-parallel-size", "4",
                            "--attention-backend", "FLASHINFER",
                            "--gpu-memory-utilization", "0.92",
                            "--max-num-seqs", "128",
                            "--enable-auto-tool-choice",
                            "--max-model-len", "180000",
                            "--kv-cache-dtype", "fp8",
                            "--tool-call-parser", "minimax_m2",
                            "--reasoning-parser", "minimax_m2_append_think"
                        ]
                    }
                }
            }
        ]
        ```

=== "MiniMax — 2×H200"

在 **2×H200**（MiniMax 的 Hopper 参考规格）上使用此 vLLM 参数集进行 **MiniMax M2.7** 部署。使用 `FLASHINFER` 注意力后端、FP8 kv-cache 和 `tensor_parallel_size=2`。MiniMax M2.7 的 PoC 黄金向量是在此确切配置下记录的。

仓库中的参考部署配置：`deploy/join/node-config-minimax-H200.json`。

    !!! note "edit node-config.json"
        ```
        [
            {
                "id": "node1",
                "host": "inference",
                "inference_port": 5000,
                "poc_port": 8080,
                "max_concurrent": 500,
                "models": {
                    "MiniMaxAI/MiniMax-M2.7": {
                        "args": [
                            "--tensor-parallel-size", "2",
                            "--attention-backend", "FLASHINFER",
                            "--gpu-memory-utilization", "0.92",
                            "--max-num-seqs", "128",
                            "--enable-auto-tool-choice",
                            "--max-model-len", "180000",
                            "--kv-cache-dtype", "fp8",
                            "--tool-call-parser", "minimax_m2",
                            "--reasoning-parser", "minimax_m2_append_think"
                        ]
                    }
                }
            }
        ]
        ```

=== "MiniMax — 2×B200"

使用此 vLLM 参数集配置 **MiniMax M2.7** 在 **2×B200**（MiniMax 的 Blackwell 参考类别）上运行。使用 `FLASHINFER_TRTLLM` MoE 后端，配合 FP8 kv-cache 和 `tensor_parallel_size=2`。

仓库中的参考部署配置：`deploy/join/node-config-minimax-B200.json`。

    !!! note "edit node-config.json"
        ```
        [
            {
                "id": "node1",
                "host": "inference",
                "inference_port": 5000,
                "poc_port": 8080,
                "max_concurrent": 500,
                "models": {
                    "MiniMaxAI/MiniMax-M2.7": {
                        "args": [
                            "--tensor-parallel-size", "2",
                            "--moe-backend", "FLASHINFER_TRTLLM",
                            "--gpu-memory-utilization", "0.92",
                            "--max-num-seqs", "128",
                            "--enable-auto-tool-choice",
                            "--max-model-len", "180000",
                            "--kv-cache-dtype", "fp8",
                            "--tool-call-parser", "minimax_m2",
                            "--reasoning-parser", "minimax_m2_append_think"
                        ]
                    }
                }
            }
        ]
        ```

有关最优部署配置的更多详情，请参阅 [此链接](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/)。

!!! tip "Validate the deployment"
    [`gonka` 仓库](https://github.com/gonka-ai/gonka) 提供了一个代理技能 `mlnode-validate`，用于根据预计算的诚实 PoC 向量验证 ML 节点。已提交的黄金参考值适用于 Qwen3-0.6B、Qwen3-235B（默认 + DeepGEMM + pubkey-v2 变体）、Kimi K2.6 和 MiniMax M2.7。参见 [验证 ML 节点部署](./mlnode-validation.md)。

### [Server] 预下载模型权重到 Hugging Face 缓存 (HF_HOME)
推理节点从 Hugging Face 下载模型权重。
为确保模型权重在部署前就绪，您应在部署前预先下载它们。

=== "Kimi K2.6"

    ```bash
    mkdir -p $HF_HOME
    huggingface-cli download moonshotai/Kimi-K2.6
    ```

    模型许可：参见 [模型许可](../model-licenses.md)。有关运营注意事项和链上选项（意图、委托），请参阅 [Kimi K2.6 启动](./kimi-bootstrap.md)。

=== "MiniMax M2.7"

    ```bash
    mkdir -p $HF_HOME
    huggingface-cli download MiniMaxAI/MiniMax-M2.7
    ```

    模型许可：参见 [模型许可](../model-licenses.md)。MiniMax M2.7 要求 **MLNode 3.0.14 或更高版本**（镜像 `ghcr.io/gonka-ai/mlnode:3.0.14-cu129`，在 `deploy/join/docker-compose.mlnode.yml` 中固定）。在 A100 硬件上，请确保为 `mlnode-308` 服务设置了 `VLLM_USE_FLASHINFER_MOE_FP8=0` 环境变量（已预设在提供的 compose 文件中）。

## 启动节点

### [Server] 拉取 Docker 镜像（容器）

在运行以下命令前，请确保您位于 `gonka/deploy/join` 文件夹中。 
```bash
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml pull
```

### [Server] 启动初始服务

启动密钥设置所需的必要服务（不包括 API 服务）：

```bash
source config.env && \
docker compose up tmkms node -d --no-deps
```

我们首先启动这些特定容器，因为：

- **`tmkms`** - 生成并安全管理验证器注册所需的共识密钥
- **`node`** - 连接到区块链并提供 RPC 端点以检索共识密钥
- **`api`** - 此阶段故意排除，因为我们需要在下一步中在其内部创建 ML 运营密钥

!!! note "建议"
    您可以查看日志以确认初始服务是否成功启动：

    ```bash
    docker compose logs tmkms node -f
    ```

    如果您看到链节点持续处理区块事件，则说明设置正常运行。

??? note "关于共识密钥"
    - 由安全的 TMKMS 服务管理
    - 温存储，防止双重签名
    - 区块验证与网络共识参与
    - 可通过账户密钥或授权委托进行轮换

在 [步骤 3.2.](https://gonka.ai/host/quickstart/#32-server-register-host)（`inferenced register-new-participant`）的注册命令期间，共识密钥将与链上的账户密钥（冷密钥）关联，从而将您的节点确立为网络的有效参与者。

如果您删除或覆盖 `.tmkms` 文件夹，您的共识密钥将丢失。此密钥是将您的节点与区块链验证者集关联的关键。一旦 `.tmkms` 被删除，您必须从头开始整个设置，包括生成新的共识密钥（通过 `tmkms`）（参见 FAQ 页面上的 “[我清除了或覆盖了我的共识密钥](https://gonka.ai/FAQ/#i-cleared-or-overwrote-my-consensus-key)”）。

### 完成密钥设置和主机注册

现在我们需要通过创建温密钥、注册主机和授予权限来完成密钥管理设置：

#### 3.1. [Server] 创建 ML 运营密钥

??? note "关于 ML 运营密钥（温密钥）"
    - 由账户密钥授权用于 ML 特定交易
    - 服务器上的加密文件，通过程序化方式访问
    - 自动化交易（推理请求、证明提交、奖励）
    - 可随时由账户密钥轮换或撤销
    - 需要持续可用，因此除非必要，否则不要移除或轮换它。

使用 `file` 密钥环后端在 `api` 容器内创建热密钥（用于程序化访问所必需）。密钥将存储在映射到容器 `/root/.inference` 的持久卷中：
```bash
docker compose run --rm --no-deps -it api /bin/sh
```

在容器内创建 ML 运营密钥：
```bash
printf '%s\n%s\n' "$KEYRING_PASSWORD" "$KEYRING_PASSWORD" | inferenced keys add "$KEY_NAME" --keyring-backend file
```
!!! note "重要"
    不要运行此命令两次。
    ML 运营密钥（热密钥）每个服务器仅生成一次，必须在重启后保留。

    - 如果您意外删除了它或重新初始化，请遵循常见问题解答中的恢复说明：“[我删除了热密钥](https://gonka.ai/FAQ/#i-deleted-the-warm-key)”
    - 重启节点时，请完全跳过此步骤——密钥已生成并持久存储在 API 容器内。

**示例输出：**
```
~ # printf '%s\n%s\n' "$KEYRING_PASSWORD" "$KEYRING_PASSWORD" | inferenced keys add "$KEY_NAME" --keyring-backend file

- address: gonka1gyz2agg5yx49gy2z4qpsz9826t6s9xev6tkehw
  name: node-702105
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"Ao8VPh5U5XQBcJ6qxAIwBbhF/3UPZEwzZ9H/qbIA6ipj"}'
  type: local


**Important** write this mnemonic phrase in a safe place.
It is the only way to recover your account if you ever forget your password.

again plastic athlete arrow first measure danger drastic wolf coyote work memory already inmate sorry path tackle custom write result west tray rabbit jeans
```


#### 3.2. [服务器] 注册主机

在同一容器中注册主机——这会将您的 URL、账户密钥和共识密钥（自动获取）链上绑定：

```
inferenced register-new-participant \
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

!!! warning "账户已拥有 GNK，但尚未发送任何交易"

    在大多数情况下，`inferenced register-new-participant` 可以直接从 `api` 容器内注册您的主机。

    但是，存在一个已知的边缘情况：如果您的账户密钥地址已收到 GNK，但从未自行发送过交易，则从容器内注册可能会失败，并出现类似以下错误：

    ```text
    rpc error: code = Unknown desc = runtime error: invalid memory address or nil pointer dereference: panic
    ```

    当账户有余额，但其链上交易序列仍为 `0` 时，可能会发生这种情况。

如果上述命令因该错误失败，您可以在您的**本地机器**上检查账户余额和序列：

    ```bash
    ./inferenced query auth account <YOUR_COLD_ADDRESS> \
      --node <node-url>/chain-rpc/ \
      --output json | jq -r '.account.value.sequence // .sequence // "0"'
    ```

    如果账户具有非零 `ngonka` 余额，且序列命令返回 `0`，请使用以下手动注册流程。

**步骤 1。** 仍在步骤 3.1 的容器中时，获取您的共识密钥并记录下来：
    ```bash
    curl -s $DAPI_CHAIN_NODE__URL/status | jq -r '.result.validator_info.pub_key.value'
    ```

    **步骤 2。** 退出容器，然后在您的**本地机器**（存储您的账户密钥的位置）运行以下命令：
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

    `<node-url>`——网络上任何已运行的节点（例如 `http://node2.gonka.ai:8000`）。不要使用您自己的节点 URL——在此步骤中，您的节点尚未完全启动。

如果您使用自定义 `--keyring-dir` 创建了账户密钥，请在命令中添加 `--keyring-dir <path>`。

该命令将提示 `confirm transaction before signing and broadcasting [y/N]:`——输入 `y` 继续。

手续费由账户密钥的余额支付。请确保运行此命令前账户中有代币。

!!! note "每节点账户密钥配置"
    为每个网络节点生成唯一的 `ACCOUNT_PUBKEY`，以确保主机之间的正确隔离。

    然后我们可以退出容器：
```bash
exit
```


#### 3.3. [本地机器] 授予 ML 运营密钥权限
**重要：请在创建账户密钥的安全本地机器上执行此步骤**

从您的账户密钥向 ML 运营密钥授予权限：
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
#### 3.4. [服务器] 手动 SSL 证书设置

如果您在上述问卷中选择了手动 SSL 证书设置，请按照以下步骤配置您的 SSL 证书：

##### 准备目录

```bash
mkdir -p secrets/nginx-ssl secrets/certbot
```

##### 生成证书（Dockerized Certbot；DNS‑01）

```bash
DOMAIN=<FULL_DOMAIN_NAME>
ACCOUNT_EMAIL=<EMAIL_ADDRESS>    # renewal notices
mkdir -p secrets/nginx-ssl secrets/certbot

docker run --rm -it \
  -v "$(pwd)/secrets/certbot:/etc/letsencrypt" \
  -v "$(pwd)/secrets/nginx-ssl:/mnt/nginx-ssl" \
  certbot/certbot certonly --manual --preferred-challenges dns \
  -d "$DOMAIN" --email "$ACCOUNT_EMAIL" --agree-tos --no-eff-email \
  --deploy-hook 'install -m 0644 "$RENEWED_LINEAGE/fullchain.pem" /mnt/nginx-ssl/cert.pem; \
                 install -m 0600 "$RENEWED_LINEAGE/privkey.pem"   /mnt/nginx-ssl/private.key'
```

!!! note "DNS 挑战"
    Certbot 将暂停并显示在您的提供商处添加的 **TXT DNS** 记录。验证后，`cert.pem` 和 `private.key` 将出现在 `./secrets/nginx-ssl/` 中。

##### 验证证书文件

确保证书文件已就位：

```bash
ls -la secrets/nginx-ssl/
```

您应看到：
- `cert.pem`（完整证书链）
- `private.key`（权限为0600的私钥）

问卷生成的 `config.env` 文件已包含必要的 SSL 配置变量：
- `SERVER_NAME=<FULL_DOMAIN_NAME>`
- `SSL_CERT_SOURCE=./secrets/nginx-ssl`

请在继续之前，使用您的实际域名编辑 `SERVER_NAME`。

<!-- CONDITION END -->

## [服务器] 启动完整节点

最后，启动所有容器，包括 API：

<!-- CONDITION START: data-show-when='["non-finished"]' -->
!!! note "需要配置"
    请先完成[上面的问卷](#quickstart-questionnaire)以生成启动命令。
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

`--profile "ssl"` 标志启用了 `proxy-ssl` 容器，该容器会自动管理 SSL 证书。
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
验证 HTTPS 是否正常工作：

```bash
curl -I https://<FULL_DOMAIN_NAME>:8443/health   # Expect: HTTP/2 200 OK
```
<!-- CONDITION END -->

打开此 URL，并将 `<your-gonka-cold-address>` 替换为您的地址：
```
http://node2.gonka.ai:8000/v2/participants/<your-gonka-cold-address>
```

您应该会看到 JSON 格式的参与者数据（`participant.address`、`participant.inferenceUrl`、`participant.status`）。

要查看账户数据（`pubkey`、`balance`、`denom`），请使用：
```
http://node2.gonka.ai:8000/v2/accounts/<your-gonka-cold-address>
```

当您的节点完成计算证明阶段后（每24小时运行一次），您可以访问以下 URL 查看您的节点：
```bash
http://node2.gonka.ai:8000/v1/epochs/current/participants
```

您可以[在自己的MLNode上模拟计算证明](https://gonka.ai/FAQ/#how-to-simulate-proof-of-compute-poc)，以确保在链上开始PoC阶段时一切正常运行。

您可以在该阶段前关闭服务器，并在下一次计算证明开始前重新启动。
要跟踪下一次计算证明会话何时开始，请查看[仪表板](https://gonka.ai/wallet/dashboard/)：
```
http://node2.gonka.ai:8000/dashboard/gonka/validator
```

节点启动后，通过代理检查节点状态。
```bash
curl http://<PUBLIC_IP>:8000/chain-rpc/status
```
在服务器上，您可以使用私有端点（从容器内部访问，或如果26657绑定到localhost）。
```bash
curl http://0.0.0.0:26657/status
```
使用创世节点的公共端点。
```bash
curl http://node2.gonka.ai:8000/chain-rpc/status
```

一旦您的节点在仪表板中可见，您可能还想更新您的公共资料（主机名、网站、头像）。这有助于其他参与者在网络中识别您的节点。您可以在[此处找到说明](https://gonka.ai/host/validator_info/)。

## [本地机器] 存入抵押品

**重要：请在创建账户密钥的安全本地机器上执行此步骤。**

抵押品是锁定的 GNK，用于激活您计算证明权重中符合抵押资格的部分。若无此操作，主机仅能获得默认的**基础权重**（20%），而无法获得计算证明的全部权重。宽限期已结束，因此此步骤是实现满额权重的必要条件。

> **关于时间的说明**：验证节点状态仅确认您的容器正在运行且参与者已注册，并**不**意味着计算证明已成功——计算证明每约24小时运行一次，只有在完成之后，您才能在 `$NODE_URL/v1/epochs/current/participants` 查看实际权重。以下两个选项允许您要么现在根据估算值存入抵押品，要么等待首次计算证明完成后再根据精确数据存入。

无法提前知道您的计算证明权重——它由您的硬件、网络当前规模以及每个模型的系数决定。

**选项 A — 现在存入（从第1个周期起获得满额权重）。** 查看网络当前的权重分布，并存入足以覆盖上限的金额。您的节点在首次计算证明时将已拥有抵押品。

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

公式为 `MAX_WEIGHT × (1 − BASE_WEIGHT_RATIO) × COLLATERAL_PER_UNIT × 2`：仅需为权重中符合抵押资格的部分提供抵押（其余部分作为基础权重授予），而 `× 2` 是推荐的安全缓冲。所有参数均从链上读取，因此若治理更新参数，脚本仍保持正确。

> **为什么是 2× 缓冲？** PoC 权重在各个纪元之间波动（网络归一化、模型系数、上限、惩罚）。协议**不会**自动补充：如果你的抵押在下一个纪元边界时不足于实际权重，你将无声地获得较少权重，直到你存入更多抵押品——至少损失一个纪元的全部奖励。超额抵押不会丢失：它会存留在模块中，稍后可通过 `withdraw-collateral` 提取。

**选项 B — 等待首次 PoC，然后精确存入（损失一个纪元的 20% 权重）。** 现在跳过此步骤，等待你的首个 PoC 阶段完成（约每 24 小时一次），然后在 `$NODE_URL/v1/epochs/current/participants` 查看你的实际权重，并使用你自己的权重替换上述脚本中的 `MAX_WEIGHT` 重新运行。从第二个纪元起，你的节点将满载运行。

从你的账户密钥存入抵押品（始终使用 `ngonka`）：

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

存款是累积的——如果权重增长，可稍后通过另一个 `deposit-collateral` 补充。要释放未使用的抵押品，请使用 `withdraw-collateral`（需经过解绑期，默认为 1 个纪元）。

有关 slashing、提取和参数调优的详细信息，请参阅 [抵押品文档](https://gonka.ai/host/collateral/)。

## 可选：PoC 委托与拒绝 {#optional-poc-delegation-and-refusal}

在你的主机注册完成、ML 运营密钥已授权，并且你可以[验证](#verify-node-status)参与状态后，使用本节内容——通常在你的**本地机器**上使用**账户（冷）密钥**（`gonka-account-key`）操作。此处内容并非启动容器所必需；当你**不**在自己的 GPU 上运行所有治理批准的模型，而必须**委托** PoC 投票给其他参与者、**拒绝**委托，或与 `params` 比较时间时适用。

对于每个 `model_id`，你要么运行模型（PoC 来自你的堆栈），要么在链上发出信号。**委托**是你信任运行该模型的主机时的常见选择；**拒绝**是明确的退出选项。背景：[多模型 PoC — 主机操作指南](./multi_model_poc.md)。

将 `NODE` 设置为任意同步的链 RPC（模式与 `grant-ml-ops-permissions` 相同：从 `config.env` 获取种子 API URL，并附加 `/chain-rpc/`）。

```bash
export NODE="<PUBLIC_CHAIN_RPC>"   # e.g. http://node2.gonka.ai:8000/chain-rpc/
export CHAIN_ID="gonka-mainnet"
export KEY="gonka-account-key"
export KEYRING_BACKEND="file"
```

检查治理参数（惩罚、`penalty_start_epoch` 等）：

```bash
./inferenced query inference params --node "$NODE" -o json
```

**检查你的 PoC 委托/拒绝/意向状态**（所有模型）：

```bash
MY_ADDR="$(./inferenced keys show "$KEY" -a --keyring-backend "$KEYRING_BACKEND")"
./inferenced query inference poc-delegation "$MY_ADDR" --node "$NODE" -o json
```

**委托** — 将你对该模型 PoC 验证的权重附加到 `DELEGATEE`（他们的 `gonka1…` 地址）。以 Kimi 为例：

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

以 MiniMax 为例（例如，你仅在 GPU 上运行 Kimi）：

```bash
MODEL="MiniMaxAI/MiniMax-M2.7"
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

**清除**某个模型的委托：

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

**拒绝**某个模型的委托（链上明确的“否”）：

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

`declare-poc-intent` 主要适用于**新模型引导**窗口；请参阅 [Kimi K2.6 引导](./kimi-bootstrap.md)。更多命令和边缘情况：[多模型 PoC — 主机操作指南](./multi_model_poc.md#copy-paste-setup-commands)。

## 停止并清理你的节点

### 如何停止你的节点

检查您当前所在的纪元。打开URL：[http://node1.gonka.ai:8000/api/v1/epochs/latest](http://node1.gonka.ai:8000/api/v1/epochs/latest)（您也可以使用任何其他活跃参与者的URL）。

在响应中查找：
```
"latest_epoch": {
    "index": 88,
    ...
}
```

记下您的节点最近工作的纪元索引。

在同一JSON响应中查找：
```
"next_epoch_stages": {
  ...
  "claim_money": <block_number>
}
```
该区块号表示您可以在其后领取奖励。但请注意，您现在就应该开始禁用每个ML节点（无需等待该区块到来再禁用ML节点）。

禁用每个ML节点。

```
curl -X POST http://<api_node_static_ip>:<admin_port>/admin/v1/nodes/<id>/disable
```
等待下一个纪元。请勿停止网络节点或ML节点。禁用标志仅在下一个纪元开始后生效。

保持网络节点在线并同步，它应自动处理奖励领取。
要检查您的最新奖励是否已被领取，在`claim_money`区块之后运行以下命令（将`<YOUR_ADDRESS>`和`<EPOCH>`替换为您的实际值）：
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
如果结果显示`claimed = true`，则您的奖励已被领取。
如果显示`false`，请继续执行手动领取步骤。

!!! note “手动领取奖励（如需要）”
    运行：
    ```
    curl -X POST http://localhost:9200/admin/v1/claim-reward/recover \
     -H "Content-Type: application/json" \
     -d '{"force_claim": true}'
    ```

验证移除和权重。如果您禁用了所有节点，则您的参与者应不在活跃参与者列表中。如果您仍能看到您的参与者在列表中，这意味着网络仍期望您参与当前周期，如果您继续禁用节点，可能会错过推理，从而影响您的声誉。

请确保您位于 `gonka/deploy/join` 文件夹中。要停止所有正在运行的容器：
```
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml down
```
这将停止并删除 `docker-compose.yml` 和 `docker-compose.mlnode.yml` 文件中定义的所有服务，除非明确配置，否则不会删除卷或数据。

### 如何清理您的节点（完全重置）

如果您想完全重置节点并删除所有数据（用于重新部署或迁移），请使用以下清理步骤。

1. 要清理缓存并从头开始，删除本地 `.inference` 和 `.dapi` 文件夹（推理运行时缓存和身份）：
```bash
rm -rf .inference .dapi .tmkms
```

2. （可选）清除模型权重缓存：
```bash
rm -rf $HF_HOME
```

!!! note 
    删除 `$HF_HOME` 将需要从 Hugging Face 重新下载大型模型文件或重新挂载 NFS 缓存。

    **需要帮助？** 请访问 [常见问题页面](https://gonka.ai/FAQ/) 获取答案，或加入 [Discord 服务器](https://discord.com/invite/RADwCT2U6R) 获取一般疑问、技术问题或安全问题的帮助。  
