# 配置你的节点

**主机**（**硬件提供者**或**节点**）向网络贡献计算资源，并根据所提供资源的数量和质量获得奖励。

要加入网络，你需要部署两个服务：

- **网络节点** —— 由两个节点组成的服务：**链节点**（Chain Node）和**API节点**（API Node）。该服务负责所有通信。**链节点**连接到区块链，而**API节点**处理用户请求。
- **推理（ML）节点** —— 一个在GPU上执行大语言模型（LLM）推理的服务。你需要至少一个**ML节点**才能加入网络。

本指南描述了将这两个服务部署在同一台机器上的场景，并且每位主机拥有一个ML节点。服务将以Docker容器的形式部署。

??? note "实时演示 — 如何启动节点（主机快速入门）"
    通过快速启动方式启动节点的演示视频如下所示。录像中的某些步骤可能与下方文字说明略有不同，因为快速启动流程会根据社区反馈持续更新。请始终以本文档为准 —— 它反映了当前正确的操作流程。

    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
      <iframe
        src="https://www.youtube.com/embed/DWOeHQoU_LY"
        title="Gonka: 实时演示 — 如何启动节点（主机快速入门）"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
      </iframe>
    </div>

## 前提条件
本节提供有关配置硬件基础设施以参与Gonka网络启动的指导。目标是通过使你的部署符合网络预期，从而最大化协议奖励。

### 支持的模型
协议支持**经治理批准**的模型用于推理和计算证明（PoC v2）。在Gonka主网上，每个获批模型都有其独立的PoC组和奖励追踪机制（自v0.2.12版本起支持多模型PoC）。

| 模型ID | 角色 |
| --- | --- |
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` | 最初强制要求的模型；仍受支持 |
| `moonshotai/Kimi-K2.6` | **Kimi K2.6 * * —— 当前在网络中参与PoC（已通过引导阶段；与Qwen共同运行） |
| `MiniMaxAI/MiniMax-M2.7` | **MiniMax M2.7 * * —— 在MLNode 3.0.14版本中新批准加入的模型；与Qwen和Kimi共同运行 |
!!! tip "权威模型列表（治理API）"
    批准的模型可能在不同版本或周期之间发生变化。**在编辑 `node-config.json` 之前**，请调用治理API，并将每个返回对象的 `"id"` 作为 `"models"` 下的键使用。
 

 
 

 

```bash
    curl -sS http://node2.gonka.ai:8000/v1/governance/models
 
 
 
 
```
    要仅列出模型 ID，可将响应结果进行管道传输：`jq -r '.models[].id'`。如果 `node2.gonka.ai` 无法访问，请使用其他参与方的公共 API 基础 URL（协议、主机和端口）。响应中还包括网络参数，例如 `model_args`；后文的 `node-config.json` 示例展示了常见硬件下的典型 `args` 配置——请根据你的 GPU 和基准测试结果进行调整。

通常情况下，在 `node-config.json` 中**每个机器学习节点（ML Node）运行一个模型**。主机可为 Qwen、Kimi 和 MiniMax 分别运行独立的 ML 节点（或节点集群）。

!!! tip "参考仓库中的部署配置"
    `deploy/join/` 目录提供了针对每个经批准模型及最常见 GPU 类型的即用型 `node-config-*.json` 配置文件。请复制与你硬件匹配的配置文件到 `node-config.json`，而非从零开始编写：

 
 
   - **Qwen3-235B** — `deploy/join/node-config-qwen235B-B200.json`
 
 
   - **Kimi K2.6** — `deploy/join/node-config-kimik26-H200.json`, `deploy/join/node-config-kimik26-B200.json`
 
 
   - **MiniMax M2.7** — `deploy/join/node-config-minimax-A100.json`, `deploy/join/node-config-minimax-H100.json`, `deploy/join/node-config-minimax-H200.json`, `deploy/join/node-config-minimax-B200.json`

    为方便起见，这些文件的内容已在下方内联展示。

!!! note "如果你不打算运行所有已批准的模型"
    多模型 PoC 按**每个模型**追踪参与情况。如果你的硬件**无法支持所有治理批准的模型**，则需在链上进行**委托（delegation）** 或 **拒绝（refusal）**，以确保你跳过的模型对应的共识权重被正确处理。但此步骤**并非上线节点所必需**——你仍使用与 [授权 ML 操作密钥](#33-local-machine-grant-permissions-to-ml-operational-key) 相同的**账户（冷）密钥**，且操作应在注册和验证**之后**进行。相关命令可在文末找到：[可选：PoC 委托与拒绝](#optional-poc-delegation-and-refusal)。如需了解策略和惩罚机制，请阅读 [多模型 PoC — 主机运营指南](./multi_model_poc.md)。

!!! note "治理与模型分类"
 
 
   - 若经治理批准，模型可被归入某一类别。
 
 
   - 是否新增或变更支持的模型由治理机制决定。
 
 
   - 有关治理流程及如何提议新模型的详细信息，请参见 [交易与治理指南](https://gonka.ai/governance/transactions-and-governance/)。

### 推荐硬件配置
要运行一个有效的节点，你需要配备[支持的 GPU](/host/hardware-specifications/) 的机器。以下是参考架构：

| **模型名称 * * | **ML 节点（最小数量） * * | **示例硬件 * * | **每个 ML 节点的最小 VRAM * * |
| --- | --- | --- | --- |
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` | ≥ 2 |  |  |
| `moonshotai/Kimi-K2.6` |  |  |  |
| `MiniMaxAI/MiniMax-M2.7` |  |  |  |
此为参考架构。你可以调整节点数量或硬件分配，但我们建议遵循核心原则：每个服务器应能支持跨所有模型层级的多个 ML 节点。

对于 Kimi K2.6，网络在相同参考硬件（8×H200, 8×B200）上的**权重系数**约为 Qwen235B 的 **3.51 倍**。详见 [多模型 PoC — 主机运营指南](./multi_model_poc.md)。B200 级主机的 vLLM 参数示例见 [Kimi K2.6 启动指南](./kimi-bootstrap.md) 以及下文的 `node-config.json` 示例。

关于最优部署配置的更多细节，请参见 [此处](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/)。

用于部署**网络节点（Network Node）** 的服务器应满足以下要求：

- 16 核 CPU（amd64）
- 64
- GB 内存
- 1TB NVMe SSD
- 至少 100Mbps 网络连接（推荐 1Gbps）

最终需求将取决于所连接的 ML 节点数量及其总吞吐量。

用于部署**ML 节点**的每台服务器应满足：

- 内存至少为 GPU 显存的 1.5 倍
- 16 核 CPU（网络节点和 ML 节点可部署在同一台服务器上）
已安装并配置 NVIDIA Container Toolkit，CUDA Toolkit 版本介于 12.6 至 12.9 之间。可通过 `nvidia-smi` 检查版本。

### 网络访问、代理和端口（重要）

Gonka 网络采用基于代理的架构，以保护节点免受滥用和 DDoS 攻击。所有公开的 HTTP/HTTPS 流量**必须**通过代理容器传输。直接暴露网络节点或 ML 节点服务是不安全的。

!!! note "对外公开的端口"

    以下端口可对外网开放：

 
 
   - 5000
 
   - Tendermint P2P 通信
 
   8000 / 8443
 仅通过代理访问应用服务

!!! warning "警告：内部端口"

    以下端口仅供内部使用，**严禁**对外公开：

 
 
   - 26657
 
   - Tendermint RPC
 
 
   - 9100, 9200 — 网络节点内部 API
 
 
   - 5050 — ML 节点 / vLLM 推理 API
 
 
   - 8080 — ML 节点 API

    若上述任一端口暴露于公网，你的节点将面临安全风险。第三方可能自由发送请求，导致 ML 节点过载、干扰挖矿，甚至使你的节点在某个周期中被踢出。

    **要求：**

    - 仅允许来自本地回环、私有网络或白名单的访问
 
 
   - 切勿对外公开
 
   Docker 默认设置**不安全**

!!! note "自 Upgrade 0.2.8 起"

    为默认提升安全性与性能，除非显式覆盖，以下路由控制和链上服务限制将自动生效：
 
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

以下案例描述了网络节点（Network Node）和机器学习节点（ML Node）服务的内部端口隔离规则。这些规则在配置代理作为唯一公共入口点后生效。它们 **不能替代代理**，必须与代理配合使用。

=== "案例1：ML Node 和 Network Node 在同一台机器上"
    仅将端口绑定到本地回环地址（localhost）。

    **网络节点（`docker-compose.yml`）**

    如果您的 ML Node 容器与 Network Node 容器位于同一台机器上，可直接编辑 `gonka/deploy/join/docker-compose.yml`：
 
 
 
 
```
    api:
        ports:
 
           - "127.0.0.1:9100:9100"
 
           - "127.0.0.1:9200:9200"
 
 
 
 
```
    
    **机器学习节点 (`docker-compose.mlnode.yml`)**
 
 
 
 ```
    ports:
 
       - "127.0.0.1:${PORT:-8080}:8080"
 
       - "127.0.0.1:${INFERENCE_PORT:-5050}:5000"
 
 
 
 
```

    Do NOT use:
        
 
 
   - "9100:9100"
 
 
   - "9200:9200"
 
 
   - "5050:5000"
 
 
   - "8080:8080"
    
=== "CASE 2: ML 节点与网络节点位于不同机器"
    在此配置中，网络节点与 ML 节点之间的所有通信必须通过私有网络进行。不得使用公网 IP 或公网 DNS 名称用于：
        
 
 
   - ML 节点 API
 
 
   - `DAPI_API__POC_CALLBACK_URL`

    如果 ML 节点和网络节点的容器位于不同的机器上，案例 1 中描述的修复方法将无效，保护这些端口的具体方式取决于您的设置。您应通过以下方式之一在 ML 节点和网络节点容器之间建立连接：使用相同的 Docker 网络，或在机器之间设置私有网络，在该私有网络中暴露端口并关闭对公网的访问。在此情况下，您还必须正确配置配置文件中的 `DAPI_API__POC_CALLBACK_URL` 变量。该 URL 必须指向私有/内部地址，而非公共地址。

## 配置您的节点

快速入门说明旨在单台机器上同时运行网络节点和推理节点（单服务器架构）。

??? note "多节点部署"
    如果您正在部署多个 GPU 节点，请参阅详细的 [多节点部署指南](https://gonka.ai/host/multiple-nodes/) 以进行正确的设置和配置。无论您是将推理节点部署在单台机器上还是跨多个服务器（包括跨地理区域），所有推理节点都必须连接到同一个网络节点。

### 密钥管理概述
在配置网络节点之前，您需要设置用于安全操作的加密密钥。  
**建议在启动生产节点前阅读 [密钥管理指南](/host/key-management/)**。

我们使用三密钥系统：

- **账户密钥**（冷钱包）
- 在本地安全机器上创建，用于高风险操作
- **共识密钥**（TMKMS
 温存储）
 由安全的 TMKMS 服务管理，用于区块验证和参与网络共识
**ML 操作密钥**（温钱包）
 在服务器上创建，用于自动化 AI 工作负载交易

### [本地机器] 安装 CLI 工具
运行 `inferenced` CLI 是进行本地账户管理和网络操作所必需的。它是一个命令行接口工具，允许您从本地机器创建和管理 Gonka 账户、注册主机并执行各种网络操作。

**选择正确的二进制文件**

GitHub 发布版本中可能包含多个 `inferenced` 构件。

对于本地 CLI 使用，请始终下载 **特定操作系统的打包 CLI 构建版本**，例如：

- `inferenced-darwin-amd64.zip`
- `inferenced-darwin-arm64.zip`
- `inferenced-linux-amd64.zip`
- `inferenced-linux-arm64.zip`

不要使用专为升级路径或容器/运行环境设计的通用 `inferenced` 二进制文件。这些构件可能无法在您的本地机器上作为独立 CLI 正常工作。

**版本要求**

请确保您使用的是 `inferenced` CLI 构建版本 [0.2.9](https://github.com/gonka-ai/gonka/releases/tag/release/v0.2.9) 或 [更高版本](https://github.com/gonka-ai/gonka/releases)。旧版 CLI 不支持权限授予，可能导致意外行为。

如果您计划提交治理提案，尤其是使用较新消息类型的提案，请使用最新发布的特定于操作系统的 CLI 构建版本。

**验证安装**

```bash
chmod +x inferenced
./inferenced --help
```

!!! note "macOS 用户"
    在 macOS 上，如果收到提示，您可能需要在 `System Settings` → `Privacy & Security` 中允许执行。向下滚动到关于 `inferenced` 的警告，然后点击 `Allow Anyway`。

    如果在 Linux 上运行二进制文件时出现类似 `Error relocating ./inferenced: qsort_r: symbol not found` 的错误，很可能是因为您下载的是非 CLI 版本或仅用于升级的文件，而非适用于您操作系统和架构的 CLI 安装包。请重新下载适用于您操作系统和架构的正确压缩包。

### [本地机器] 创建账户密钥
**重要：此步骤必须在安全的本地机器上执行（不要在服务器上执行）**

??? note "关于账户密钥（冷密钥）"
    账户密钥是您的主密钥，具有高权限。它仅在本地创建，且绝不存储在服务器上。
    
 
 
   - 是授权所有其他密钥的主密钥
 
 
   - 必须离线保存在安全、断网的设备上
 
 
   - 仅用于授权和验证节点注册
 
 
   - 受助记词保护——一旦丢失，所有访问权限将永久丢失

使用 `file` 密钥环后端创建您的账户密钥（您也可以在支持的系统上使用 `os` 以获得更高的安全性）：

```bash
./inferenced keys add gonka-account-key --keyring-backend file
```

CLI 会要求您输入密码，并显示有关已创建密钥对的信息。
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

**重要警告**：请将此助记词写下来，并存放在安全的离线位置。该助记词是恢复您账户密钥的**唯一**方式。

!!! info "硬件钱包支持"
    **当前状态**：网络上线时暂不支持硬件钱包。
    
    **现阶段**：请将您的账户密钥存储在安全且专用的设备上，该设备应尽量减少联网，并启用强加密保护。
    
    **重要提示**：无论未来是否支持硬件钱包，务必始终保留您的助记词作为备份。

### [服务器] 下载部署文件
克隆包含基础部署脚本的代码仓库：

```bash
git clone https://github.com/gonka-ai/gonka.git -b main && \
cd gonka/deploy/join
```

并复制 `config` 文件模板：
```

cp config.env.template config.env
```

克隆仓库后，您将看到以下关键配置文件：

| 文件 | 说明 |
| --- | --- |
| `config.env` | 包含网络节点（Network Node）的环境变量 |
| `docker-compose.yml` | 用于启动网络节点（Network Node）的 Docker Compose 文件 |
| `docker-compose.mlnode.yml` | 用于启动机器学习节点（ML Node）的 Docker Compose 文件 |
| `node-config.json` | 网络节点使用的配置文件，描述该网络节点所管理的推理节点（inference nodes） |
### [服务器] 配置环境变量

<!
-
CONDITION START: data-show-when='["non-finished"]' -->
!!! note "需要配置"
    请完成下方问卷以生成您的 `config.env` 配置文件。环境变量取决于您的选择（HTTP/HTTPS、SSL 证书方式等）。
    <!
    -
    CONDITION END -->

    <!
    -
    CONDITION START: data-show-when='["domainNo"]' -->
!!! warning "无域名无法启用 HTTPS"
    SSL/TLS 证书仅能为域名（例如 `example.com`）签发，不能用于直接的 IP 地址。由于您表示未配置域名，您的节点将仅以 **HTTP 模式**（端口 8000）运行。

    如果您需要 HTTPS 安全性，请：

 
 
   1. 获取一个域名，并配置 DNS 将其指向您的服务器 IP 地址
 
 
   2. 点击上方的 **"重置"** 按钮，并在询问是否拥有域名时选择 **"是"**

    对于生产环境部署，强烈建议使用 HTTPS 来加密 API 通信并保护敏感数据。
<!
-
CONDITION END -->

<div id="quickstart-questionnaire" class="quickstart-questionnaire">
  <div id="quickstart-questions"></div>
  
  <div id="quickstart-config-result" style="display: none;">
    <div class="admonition note">
      <p class="admonition-title">config.env</p>
      <div id="quickstart-config-display">
        <pre><code></code></pre>
      </div>
    </div>
    <p style="margin-top: 1rem; font-size: 0.7rem; color: var(--md-default-fg-color--light);">复制上方配置，并按照下方说明继续编辑相应值。</p>
    <button class="quickstart-copy-btn">复制到剪贴板</button>
    <button class="quickstart-reset-btn">重置</button>
  </div>
</div>

<!
-
CONDITION START: data-show-when='["finished"]' -->

如果您的节点无法连接到默认的种子节点，请[参阅 FAQ 了解详情。](https://gonka.ai/FAQ/#my-node-cannot-connect-to-the-default-seed-node-specified-in-the-configenv)
### [服务器] 编辑环境变量

需要编辑的变量如下：

<div id="quickstart-edit-table"></div>

其余变量可保持默认不变。

<!
-
CONDITION START: data-show-when='["protocolHttps", "certMethodAuto"]' -->
**如何从域名服务商获取相关变量：**

<!
-
CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "cloudflare"]' -->
??? details "Cloudflare"
    1) 打开 Cloudflare 控制面板。

    2) 进入 Profile → API Tokens。

    3) 点击 Create Token。

    4) 使用 "Edit zone DNS" 模板，或设置权限为：Zone:Read 和 DNS:Edit。

    5) 将令牌限制在您的 DNS 区域内并创建。

    6) 复制生成的令牌，并将其填入 `CF_DNS_API_TOKEN`。
<!
-
CONDITION END -->

<!
-
CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "route53"]' -->
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

1) 创建一个仅限于您托管区域的 IAM 策略（包含 ChangeResourceRecordSets 和列表权限）。

2) 创建一个具有编程访问权限的 IAM 用户。

3) 将该策略附加到该用户。

4) 创建一个访问密钥对，并设置 `AWS_ACCESS_KEY_ID`、`AWS_SECRET_ACCESS_KEY` 和 `AWS_REGION`。
<!
-
CONDITION END -->

<!
-
CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "gcloud"]' -->
??? details "Google Cloud DNS"
    **选项 A — gcloud CLI:**
 

 

 

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

    1) IAM 和管理 → 服务账号 → 创建服务账号（例如：acme-dns）。

    2) 为服务账号授予角色：DNS 管理员（`roles/dns.admin`）。

    3) 服务账号 → 密钥 → 添加密钥 → 创建新密钥（JSON）→ 下载。

    4) 将 JSON 密钥 Base64 编码为单行，并设置 `GCE_SERVICE_ACCOUNT_JSON_B64`。将 `GCE_PROJECT` 设置为您的项目 ID。
<!
-
CONDITION END -->

<!
-
CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "azure"]' -->
??? details "Azure DNS"
    **选项 A — Azure CLI**（快速）
 

 
 

 

```bash
 
   # 1) Login and choose subscription
    az login
    az account set --subscription "<your-subscription-name-or-id>"

 
   # 2) Set where your DNS zone lives
    RG="<<your-dns-resource-group>>"
    ZONE="<<your-zone>>"
         # e.g., gonka.ai
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

 
   5) Print for your env file
    echo "AZURE_CLIENT_ID=$AZURE_CLIENT_ID"
    echo "AZURE_CLIENT_SECRET=$AZURE_CLIENT_SECRET"
    echo "AZURE_SUBSCRIPTION_ID=$SUBSCRIPTION_ID"
    echo "AZURE_TENANT_ID=$AZURE_TENANT_ID"
 
 
 
 
```
    **选项 B — 门户**

1) 进入 Microsoft Entra ID → 应用注册 → 新建注册。复制应用程序（客户端）ID 和目录（租户）ID。

2) 进入证书和密码 → 新建客户端密码。复制密码值并设置 `AZURE_CLIENT_SECRET`。

3) 复制你的订阅 ID 并设置 `AZURE_SUBSCRIPTION_ID`。

4) 在你的 DNS 区域中，打开访问控制 (IAM) → 添加角色分配 → DNS 区域参与者 → 分配给已注册的应用程序。
<!
-
CONDITION END -->

<!
-
CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "digitalocean"]' -->
??? details "DigitalOcean DNS"
    1) 打开 DigitalOcean 控制面板。

    2) 进入 API → 令牌。

    3) 生成一个具有写入权限的令牌，并设置 `DO_AUTH_TOKEN`。
<!
-
CONDITION END -->

<!
-
CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "hetzner"]' -->
??? details "Hetzner DNS"
    1) 打开 https://dns.hetzner.com。

    2) 进入 API 令牌。

    3) 创建一个新令牌并设置 `HETZNER_API_KEY`。
<!
-
CONDITION END -->
<!
-
CONDITION END -->

**加载配置：**

```bash
source config.env
```

!!! note "使用环境变量"
    以下各节中的示例将引用这些环境变量（例如，`$PUBLIC_URL`、`$ACCOUNT_PUBKEY`、`$SEED_API_URL`），包括在本地机器命令和服务器命令中。请确保在每个将要执行这些命令的终端会话中运行 `source config.env`。
    <!
    -
    CONDITION END -->



### [服务器] 为服务器编辑推理节点描述

!!! note
    当前网络仅支持 Qwen/Qwen3-235B-A22B-Instruct-2507-FP8 模型。是否添加或修改支持的模型由治理机制决定。有关模型治理机制的详细信息以及如何提议新模型，请参阅 [交易与治理指南](https://gonka.ai/governance/transactions-and-governance/)。

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

=== "Qwen — 8×B200"

    代码库中的参考部署配置：`deploy/join/node-config-qwen235B-B200.json`。

 
 
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
                            "--tensor-parallel-size", "2",
                            "--max-model-len", "240000",
                            "--gpu-memory-utilization", "0.88"
                        ]
                    }
                }
            }
        ]
 
 
 
 
    ```

=== "Kimi — 4×B200 / 8×B200（以及 8×H200 参考配置）"

    在 Blackwell 架构的 **4×B200 或 8×B200** 上运行 **Kimi K2.6** 时，请使用此 vLLM 参数集，并可作为相同布局下 **8×H200** 的参考配置（`tensor_parallel_size` 4，专家并行跨八个 GPU）。仅当你的技术栈或基准测试有特殊需求时才进行调整。

    仓库中的参考部署配置：`deploy/join/node-config-kimik26-B200.json`。

 
 
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

    注册或通过 API 更新节点时使用相同的 `"models"` 代码块；有关等效的 `curl` 示例，请参阅 [Kimi K2.6 Bootstrap](./kimi-bootstrap.md)。

=== "Kimi — 8×H200"

    仓库中的参考部署配置：`deploy/join/node-config-kimik26-H200.json`。在所有 GPU 上使用 `FLASHMLA` 注意力机制和 `tensor_parallel_size=8`，且不使用专家并行。

 
 
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

    在 **4×A100** 上部署 **MiniMax M2.7** 时，请使用此 vLLM 参数配置。由于 A100 不支持 FP8 FlashInfer MoE 路径，该配置采用 `marlin` MoE 后端。你还需要为 `mlnode-308` 服务设置环境变量 `VLLM_USE_FLASHINFER_MOE_FP8=0`（此设置已在 MLNode 3.0.14 随附的 `deploy/join/docker-compose.mlnode.yml` 中预先配置）。

    仓库中的参考部署配置：`deploy/join/node-config-minimax-A100.json`。

 
 
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

    在 **4×H100** 上部署 **MiniMax M2.7** 时，请使用此 vLLM 参数配置。使用 `FLASHINFER` 作为注意力后端，并启用 FP8 kv-cache。

    仓库中的参考部署配置：`deploy/join/node-config-minimax-H100.json`。

 
 
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

    在 **2×H200** 上运行 **MiniMax M2.7** 时使用此 vLLM 参数配置（Hopper 参考架构，适用于 MiniMax）。使用 `FLASHINFER` 注意力后端，启用 FP8 kv-cache 和 `tensor_parallel_size=2`。MiniMax M2.7 的 PoC 黄金向量即在此精确配置下录制。

    仓库中的参考部署配置：`deploy/join/node-config-minimax-H200.json`。

 
 
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

    在 **2×B200**（MiniMax 的 Blackwell 参考架构）上部署 **MiniMax M2.7** 时，请使用此 vLLM 参数配置。采用 `FLASHINFER_TRTLLM` MoE 后端，支持 FP8 kv-cache 以及 `tensor_parallel_size=2`。

    代码仓库中的参考部署配置：`deploy/join/node-config-minimax-B200.json`。

 
 
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

有关最佳部署配置的更多详细信息，请参考[此链接](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/)。

!!! tip "验证部署"
    [`gonka` 仓库](https://github.com/gonka-ai/gonka) 提供了一个代理技能 `mlnode-validate`，可用于根据特定模型的预计算诚实 PoC 向量验证 ML 节点。目前提供的承诺黄金参考向量支持 Qwen3-0.6B、Qwen3-235B（默认
 DeepGEMM
 pubkey-v2 变体）、Kimi K2.6 和 MiniMax M2.7。详见[验证 ML 节点部署](./mlnode-validation.md)。

### [服务器] 预先将模型权重下载到 Hugging Face 缓存（HF_HOME）
推理节点将从 Hugging Face 下载模型权重。  
为确保模型权重已就绪可供推理使用，建议在部署前预先下载。

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

    模型许可：参见[模型许可](../model-licenses.md)。有关操作说明及链上选项（意图、委托），请参阅[Kimi K2.6 Bootstrap](./kimi-bootstrap.md)。

=== "MiniMax M2.7"

 

 
 

 

```bash
    mkdir -p $HF_HOME
    huggingface-cli download MiniMaxAI/MiniMax-M2.7
 
 
 
 
```

    模型许可：参见[模型许可](../model-licenses.md)。MiniMax M2.7 需要 **MLNode 3.0.14 或更高版本**（镜像 `ghcr.io/gonka-ai/mlnode:3.0.14-cu129`，在 `deploy/join/docker-compose.mlnode.yml` 中固定）。在 A100 硬件上，还需确保为 `VLLM_USE_FLASHINFER_MOE_FP8=0` 环境变量已为 `mlnode-308` 服务设置（在提供的 compose 文件中已预设）。

## 启动节点

### 1. [服务器] 拉取 Docker 镜像（容器）

在运行后续命令前，请确保您位于 `gonka/deploy/join` 文件夹中。 

```bash
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml pull
```

### 2. [服务器] 启动初始服务

启动密钥设置所需的核心服务（不包括 API 服务）：

```bash
source config.env && \
docker compose up tmkms node -d --no-deps
```

我们首先启动这些特定的容器，原因如下：

- **`tmkms`** - 生成并安全地管理用于验证节点注册所需的共识密钥（Consensus Key）
- **`node`** - 连接到区块链并提供 RPC 端点，用于获取共识密钥
- **`api`** - 在此阶段故意排除，因为我们下一步需要在其中创建机器学习运维密钥（ML Operational Key）

!!! note "建议"
    你可以查看日志以确认初始服务已成功启动：
    
 

 
 

 

```bash
    docker compose logs tmkms node -f
 
 
 
 
```

    如果看到链节点持续处理区块事件，则说明配置已正确生效。

??? note "关于共识密钥（Consensus Key）"
 
 
   - 由安全的 TMKMS 服务进行管理
 
 
   - 使用暖存储并具备双重签名防护机制
 
 
   - 用于区块验证及参与网络共识
 
 
   - 可通过账户密钥（冷密钥）或授权代表进行轮换

    在[第 3.2 步](https://gonka.ai/host/quickstart/#32-server-register-host)（`inferenced register-new-participant`）的注册命令执行期间，共识密钥会在链上与您的账户密钥（冷密钥）关联，从而将您的节点注册为网络中的有效参与节点。

    如果您删除或覆盖了 `.tmkms` 文件夹，您的共识密钥将会丢失。该密钥是将您的节点连接到区块链验证节点集合的关键。一旦 `.tmkms` 丢失，您必须从头重新开始整个配置流程，包括通过 `tmkms` 生成新的共识密钥（参见 FAQ 页面中的“[我清除了或覆盖了我的共识密钥](https://gonka.ai/FAQ/#i-cleared-or-overwrote-my-consensus-key)”）。

### 3. 完成密钥配置与主机注册

现在我们需要通过创建暖密钥、注册主机并授予权限来完成密钥管理的配置：

#### 3.
 
   - [服务器] 创建机器学习操作密钥（ML Operational Key）

??? note "关于机器学习操作密钥（暖密钥）"
 
 
   - 由账户密钥授权，专用于机器学习相关交易
 
 
   - 以加密文件形式存储于服务器，可通过程序调用访问
 
 
   - 自动执行交易（如推理请求、证明提交、奖励领取等）
 
 
   - 可随时由账户密钥进行轮换或撤销
 
   需保持持续可用性，除非必要，否则请勿删除或轮换。

在 `api` 容器内使用 `file` 密钥后端创建暖密钥（程序化访问所必需）。该密钥将存储在映射至容器 `/root/.inference` 目录的持久化卷中：

```bash
docker compose run --rm --no-deps -it api /bin/sh
```

在容器内创建 ML 操作密钥：

```bash
printf '%s\n%s\n' "$KEYRING_PASSWORD" "$KEYRING_PASSWORD" | inferenced keys add "$KEY_NAME" --keyring-backend file
```

!!! note "重要"
    请勿运行此命令两次。
    机器学习操作密钥（Warm Key）每个服务器仅生成一次，且必须在重启时保留。

 
 
   - 如果您意外删除了密钥或重新初始化，请参阅 FAQ 中的恢复说明：“[我删除了 Warm Key](https://gonka.ai/FAQ/#i-deleted-the-warm-key)”。
 
 
   - 重启节点时，请完全跳过此步骤——密钥已在 API 容器内生成并持久化存储。

**示例输出：**
```

~
 printf '%s\n%s\n' "$KEYRING_PASSWORD" "$KEYRING_PASSWORD" | inferenced keys add "$KEY_NAME" --keyring-backend file

- address: gonka1gyz2agg5yx49gy2z4qpsz9826t6s9xev6tkehw
  name: node-702105
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"Ao8VPh5U5XQBcJ6qxAIwBbhF/3UPZEwzZ9H/qbIA6ipj"}'
  type: local


**Important** write this mnemonic phrase in a safe place.
It is the only way to recover your account if you ever forget your password.

again plastic athlete arrow first measure danger drastic wolf coyote work memory already inmate sorry path tackle custom write result west tray rabbit jeans
```


#### 3.
[服务器] 注册主机

在同一个容器中注册主机——这将把你的 URL、账户密钥以及共识密钥（自动获取）在链上进行关联：

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

!!! warning "账户已拥有GNK但尚未发送任何交易"

    在大多数情况下，`inferenced register-new-participant`可以直接在`api`容器内部注册您的主机。

    但存在一个已知的边界情况：如果您的账户密钥地址已接收过GNK，但自身从未发送过任何交易，则从容器内部注册可能会失败，并出现类似的错误：

 

 
 

 

```text
    rpc error: code = Unknown desc = runtime error: invalid memory address or nil pointer dereference: panic
 
 
 
 
```

    当账户有余额，但其链上交易序列号仍为 `0` 时，可能会发生这种情况。

    如果上述命令因该错误而失败，你可以从**本地机器**检查账户余额和序列号：

 

 
 

 

```bash
    ./inferenced query auth account <YOUR_COLD_ADDRESS> \
      --node <node-url>/chain-rpc/ \
      --output json | jq -r '.account.value.sequence // .sequence // "0"'
 
 
 
 
```

    如果账户的 `ngonka` 余额非零，且 sequence 命令返回 `0`，请使用下方的手动注册流程。

    **步骤 1.** 仍在 3.1 步骤的容器中时，获取您的共识密钥并记录下来：
 

 
 

 

```bash
    curl -s $DAPI_CHAIN_NODE__URL/status | jq -r '.result.validator_info.pub_key.value'
 
 
 
 
```

    **步骤 2.** 退出容器，然后在你的**本地机器**（即存储账户密钥的位置）上运行以下命令：
 

 
 

 

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

    `<node-url>` — 网络中任何正在运行的节点（例如 `http://node2.gonka.ai:8000`）。请勿使用你自己的节点 URL —— 因为此步骤中你的节点尚未完全启动。

    如果你是使用自定义的 `--keyring-dir` 创建的账户密钥，请在命令中添加 `--keyring-dir <path>`。

    执行命令时会提示 `confirm transaction before signing and broadcasting [y/N]:` —— 输入 `y` 以继续。

    交易手续费（Gas）将从账户密钥的余额中扣除。请确保该账户有足够的代币后再运行此命令。

!!! note "每个节点的账户密钥配置"
    请为每个网络节点生成唯一的 `ACCOUNT_PUBKEY`，以确保各个主机之间正确隔离。

    然后我们可以退出容器：

```bash
exit
```


#### 3.
[本地机器] 为机器学习操作密钥授予权限
**重要：请在您创建账户密钥的安全本地机器上执行此步骤**

使用您的账户密钥向机器学习操作密钥授予权限：

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

<!
-
CONDITION START: data-show-when='["protocolHttps", "certMethodManual", "domainYes"]' -->
#### 3.
[服务器] 手动配置 SSL 证书

如果在上方问卷中选择了手动配置 SSL 证书，请按照以下步骤配置您的 SSL 证书：

##### 准备目录

```bash
mkdir -p secrets/nginx-ssl secrets/certbot
```

##### 生成证书（容器化 Certbot；DNS-01）

```bash
DOMAIN=<FULL_DOMAIN_NAME>
ACCOUNT_EMAIL=<EMAIL_ADDRESS>
    renewal notices
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
    Certbot 将暂停并显示需要在您的提供商处添加的 **TXT DNS** 记录。验证完成后，`cert.pem` 和 `private.key` 将出现在 `./secrets/nginx-ssl/` 中。

##### 验证证书文件

确保证书文件已就位：

```bash
ls -la secrets/nginx-ssl/
```

你应该看到：
- `cert.pem`（完整证书链）
- `private.key`（权限模式为 0600 的私钥）

问卷生成的 `config.env` 文件已包含必要的 SSL 配置变量：
- `SERVER_NAME=<FULL_DOMAIN_NAME>`
- `SSL_CERT_SOURCE=./secrets/nginx-ssl`

在继续之前，请务必用你实际的域名编辑 `SERVER_NAME`。

<!
-
CONDITION END -->

## 4. [服务器] 启动全节点

最后，启动所有容器，包括 API：

<!
-
CONDITION START: data-show-when='["non-finished"]' -->
!!! note "需要配置"
    请先完成上方的[问卷](#quickstart-questionnaire)以生成启动命令。
    <!
    -
    CONDITION END -->

    <!
    -
    CONDITION START: data-show-when='["protocolHttp"]' -->
    启动所有容器：

```bash
source config.env && \
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d
```

<!
-
CONDITION END -->

<!
-
CONDITION START: data-show-when='["protocolHttps", "certMethodAuto"]' -->
启动所有容器并启用自动 SSL 证书管理：

```bash
source config.env && \
docker compose --profile "ssl" \
  -f docker-compose.yml -f docker-compose.mlnode.yml \
  up -d
```

`--profile "ssl"` 标志用于启用 `proxy-ssl` 容器，该容器可自动管理 SSL 证书。
<!
-
CONDITION END -->

<!
-
CONDITION START: data-show-when='["protocolHttps", "certMethodManual", "domainYes"]' -->
使用手动 SSL 证书启动所有容器：

```bash
source config.env && \
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d
```

<!
-
CONDITION END -->

## 验证节点状态 {#verify-node-status}

<!
-
CONDITION START: data-show-when='["protocolHttps"]' -->
验证 HTTPS 是否正常工作：

```bash
curl -I https://<FULL_DOMAIN_NAME>:8443/health
   Expect: HTTP/2 200 OK
```

<!
-
CONDITION END -->

打开此 URL，并将 `<your-gonka-cold-address>` 替换为您的地址：
```

http://node2.gonka.ai:8000/v2/participants/<your-gonka-cold-address>
```

您应该会看到以 JSON 格式显示的参与者数据（`participant.address`, `participant.inferenceUrl`, `participant.status`）。

要查看账户数据（`pubkey`, `balance`, `denom`），请使用：
```

http://node2.gonka.ai:8000/v2/accounts/<your-gonka-cold-address>
```

当您的节点完成计算证明阶段（每24小时运行一次）后，您可以通过访问以下URL查看您的节点：

```bash
http://node2.gonka.ai:8000/v1/epochs/current/participants
```

你可以[自己在 MLNode 上模拟计算证明（Proof of Compute）](https://gonka.ai/FAQ/#how-to-simulate-proof-of-compute-poc)，以确保当链上 PoC 阶段开始时一切正常运行。

在此阶段之前，你可以关闭服务器，并在下一次计算证明开始前重新启动。  
要追踪下一次计算证明会话的开始时间，请查看[仪表盘](https://gonka.ai/wallet/dashboard/)：
```

http://node2.gonka.ai:8000/dashboard/gonka/validator
```

节点运行后，通过代理检查节点状态。

```bash
curl http://<PUBLIC_IP>:8000/chain-rpc/status
```

在服务器上，你可以使用私有地址（在容器内使用，或当 26657 端口绑定到 localhost 时）。

```bash
curl http://0.0.0.0:26657/status
```

使用 genesis 节点的公共端点。

```bash
curl http://node2.gonka.ai:8000/chain-rpc/status
```

当你的节点在仪表板中可见后，你可能还想更新你的公开资料（主机名、网站、头像）。这有助于其他参与者在网络中识别你的节点。你可以[在此查看操作说明](https://gonka.ai/host/validator_info/)。

## 5. [本地设备] 存入抵押品

**重要提示：此步骤必须在你创建账户密钥的安全本地设备上执行。**

抵押品是被锁定的 GNK 代币，用于激活你 PoC 权重中符合抵押资格的部分。如果没有抵押品，主机只能获得 Proof of Compute（计算证明）收益的**基础权重**（默认为 20%）。宽限期已结束，因此此步骤现在是运行全权重所必需的。

> **关于时间的说明**：节点状态验证仅确认你的容器正在运行且参与者已注册，**并不代表**计算证明（PoC）已经成功——PoC 每约 24 小时运行一次，只有在其完成后，你才能在 `$NODE_URL/v1/epochs/current/participants` 查看到实际权重。以下两种选项允许你选择立即根据估算值存入抵押品，或等待首次 PoC 完成后根据精确数据进行存入。

你无法提前知道你的 PoC 权重——它由你的硬件、网络当前规模以及各模型的系数共同决定。

**选项 A —— 立即存入（从第 1 个周期起获得全权重）**：查看当前网络中的权重分布情况，并存入足以覆盖较高预估值的抵押品。这样你的节点将在首次 PoC 时已具备抵押品，立即以全权重参与。

```bash
export NODE_URL="<seed_api_url from server's config.env>"
   e.g. http://node2.gonka.ai:8000
export CHAIN_ID="gonka-mainnet"

PARAMS=$(curl -s "$NODE_URL/chain-api/productscience/inference/inference/params")
BASE_WEIGHT_RATIO=$(echo "$PARAMS" | jq -r '.params.collateral_params.base_weight_ratio
  | (.value | tonumber) * pow(10; .exponent | tonumber)') COLLATERAL_PER_UNIT=$(echo "$PARAMS" | jq -r '.params.collateral_params.collateral_per_weight_unit (.value | tonumber) * pow(10; .exponent | tonumber)')

MAX_WEIGHT=$(curl -s "$NODE_URL/v1/epochs/current/participants" \
  | jq '[.active_participants.participants[].weight] | max')

DEPOSIT=$(printf "%.0f" "$(echo "$MAX_WEIGHT
 (1
 $BASE_WEIGHT_RATIO)
 $COLLATERAL_PER_UNIT
 2" | bc -l)")
echo "Recommended deposit (covers network max with 2x buffer): ${DEPOSIT} ngonka"


公式为 `MAX_WEIGHT × (1 − BASE_WEIGHT_RATIO) × COLLATERAL_PER_UNIT × 2`：只需对符合抵押资格的那部分权重提供抵押品支持（其余部分将作为基础权重被授予），而 `× 2` 是推荐的安全缓冲量。所有参数均从链上读取，因此即使治理机制更新了参数，该脚本仍然有效。

> **为何需要 2 倍缓冲？** PoC 权重在各个周期之间会有所波动（受网络归一化、模型系数、上限、惩罚等因素影响）。协议**不会**自动补充抵押品：如果在下一个周期边界时你的抵押品不足以覆盖实际权重，系统将静默地减少你的权重，直到你存入更多抵押品——这将导致至少一个周期无法获得全额奖励。但多余的抵押品不会丢失：它会保留在模块中，并可在之后通过 `withdraw-collateral` 提取。

**选项 B — 等待首次 PoC 完成后再精确存入（代价是一个周期仅 20% 权重）**。现在跳过此步骤，等待你的第一个 PoC 阶段完成（约每 24 小时一次），然后在 `$NODE_URL/v1/epochs/current/participants` 查看你的实际权重，并使用你自己的权重替换 `MAX_WEIGHT` 后重新运行上述脚本。从第二个周期开始，你的节点将以完整权重运行。

请从你的账户密钥（Account Key）存入抵押品（务必使用 `ngonka`）：


./inferenced tx collateral deposit-collateral ${DEPOSIT}ngonka \
  --from gonka-account-key \
  --keyring-backend file \
  --node $NODE_URL/chain-rpc/ \
  --chain-id $CHAIN_ID


验证：


MY_ADDR=$(./inferenced keys show gonka-account-key -a --keyring-backend file)
curl -s "$NODE_URL/chain-api/productscience/inference/collateral/collateral/$MY_ADDR" | jq


存款是累积的——如果您的权重增加，可以后续通过另一个 `deposit-collateral` 进行充值。要释放未使用的抵押品，请使用 `withdraw-collateral`（需经过解绑期，默认为 1 个周期）。

有关惩罚、提款和参数调整的详细信息，请参阅[抵押品文档](https://gonka.ai/host/collateral/)。

可选：PoC 委托与拒绝 {#optional-poc-delegation-and-refusal}

本节内容适用于您的主机**已注册**、机器学习操作密钥已授权，并且您能够[验证](#verify-node-status)参与状态之后——通常是在**本地机器**上使用**账户（冷）密钥**（`gonka-account-key`）进行操作。这些步骤并非启动容器所必需，仅在您**未**使用自己的 GPU 运行所有治理批准的模型时适用。此时，您必须将 PoC 投票**委托**给其他参与者，或选择**拒绝**委托，或与 `params` 的时间进行比对。

对于每个 `model_id`，您要么自行运行模型（PoC 提交来自您的节点），要么在链上发出信号。当您信任某个运行该模型的主机时，**委托**是常见选择；而**拒绝**则是明确的选择退出。背景信息请参阅：[多模型 PoC — 主机操作指南](./multi_model_poc.md)。

将 `NODE` 设置为任意一个已同步的链上 RPC（格式与 `grant-ml-ops-permissions` 相同：从 `config.env` 获取 API URL 并附加 `/chain-rpc/`）。


export NODE="<PUBLIC_CHAIN_RPC>"
   e.g. http://node2.gonka.ai:8000/chain-rpc/
export CHAIN_ID="gonka-mainnet"
export KEY="gonka-account-key"
export KEYRING_BACKEND="file"


检查治理参数（处罚、`penalty_start_epoch`等）：


./inferenced query inference params --node "$NODE" -o json


**检查您的 PoC 委托 / 拒绝 / 意图状态**（所有模型）：


MY_ADDR="$(./inferenced keys show "$KEY" -a --keyring-backend "$KEYRING_BACKEND")"
./inferenced query inference poc-delegation "$MY_ADDR" --node "$NODE" -o json


**委托** — 将您对该模型 PoC 验证的权重委托给 `DELEGATEE`（他们的 `gonka1…` 地址）。Kimi 的示例如下：


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


I am a large-scale language model developed by Alibaba Cloud's Tongyi Lab, not running on any single GPU device. My training and inference are completed on Alibaba's large-scale computing clusters, leveraging distributed computing technology to achieve efficient processing of massive data. If you have any other questions, feel free to ask!


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


例如，你仅在自己的 GPU 上运行 Qwen 和 Kimi：


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


**清除**一个模型的委托：


MODEL="moonshotai/Kimi-K2.6"

./inferenced tx inference set-poc-delegation "$MODEL" "" \
  --from "$KEY" \
  --node "$NODE" \
  --chain-id "$CHAIN_ID" \
  --keyring-backend "$KEYRING_BACKEND" \
  --gas auto \
  --gas-adjustment 1.3 \
  -y


**拒绝** 对某一模型的委托（在链上明确表示“否”）：


MODEL="moonshotai/Kimi-K2.6"

./inferenced tx inference refuse-poc-delegation "$MODEL" \
  --from "$KEY" \
  --node "$NODE" \
  --chain-id "$CHAIN_ID" \
  --keyring-backend "$KEYRING_BACKEND" \
  --gas auto \
  --gas-adjustment 1.3 \
  -y


`declare-poc-intent` 主要适用于 **新模型引导（bootstrap）** 窗口；参见 [Kimi K2.6 引导指南](./kimi-bootstrap.md)。更多命令和边界情况，请参阅：[多模型概念验证 — 主机操作指南](./multi_model_poc.md#copy-paste-setup-commands)。

停止并清理你的节点

如何停止你的节点

检查你当前所处的 epoch。打开以下 URL：[http://node1.gonka.ai:8000/api/v1/epochs/latest](http://node1.gonka.ai:8000/api/v1/epochs/latest)（你也可以使用其他活跃参与者的 URL）。

在返回结果中，查找以下内容：


"latest_epoch": {
    "index": 88,
    ...
}


请记住您的节点工作的最新纪元索引。

在同一 JSON 响应中，查找：


"next_epoch_stages": {
  ...
  "claim_money": <block_number>
}


此区块编号表示您可在该区块之后领取奖励。但需要注意的是，您现在应立即开始停用每个机器学习节点（无需等待到达该区块后再停用您的机器学习节点）。

请停用每个机器学习节点。



curl -X POST http://<api_node_static_ip>:<admin_port>/admin/v1/nodes/<id>/disable


请等待下一个epoch。目前请不要停止网络节点或机器学习节点，因为禁用标志仅在下一个epoch开始后才会生效。

请保持您的网络节点在线并保持同步，系统将自动处理奖励领取。

要确认最新的奖励是否已成功领取，请在 `claim_money` 区块之后运行以下命令（将 `<YOUR_ADDRESS>` 和 `<EPOCH>` 替换为您的实际值）：


inferenced query inference show-epoch-performance-summary <EPOCH> <YOUR_ADDRESS> --node http://node1.gonka.ai:8000/chain-rpc/ --output json


示例： 


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


如果结果显示 `claimed = true`，表示您的奖励已被领取。  
如果显示 `false`，请继续执行手动领取步骤。

note "手动领取奖励（如需）"
    运行：
 
 
 

    curl -X POST http://localhost:9200/admin/v1/claim-reward/recover \
     -H "Content-Type: application/json" \
     -d '{"force_claim": true}'
 
 
 


验证移除状态和权重。如果您已禁用所有节点，则您的参与者应不会出现在活跃参与者列表中。如果仍能在列表中看到您的参与者，说明网络仍然期望您参与当前纪元，此时若您继续禁用节点，可能会错过推理任务，从而影响您的声誉。

请确保您位于 `gonka/deploy/join` 文件夹中。要停止所有正在运行的容器：


docker compose -f docker-compose.yml -f docker-compose.mlnode.yml down


这将停止并移除在 `docker-compose.yml` 和 `docker-compose.mlnode.yml` 文件中定义的所有服务，但除非明确配置，否则不会删除卷或数据。

如何清理你的节点（完全重置）

如果你想完全重置节点并删除所有数据（用于重新部署或迁移），请使用以下清理步骤。

若要清理缓存并重新开始，请删除本地的 `.inference` 和 `.dapi` 文件夹（推理运行时缓存和身份信息）：


rm -rf .inference .dapi .tmkms


（可选）清除模型权重缓存：


rm -rf $HF_HOME


note
    删除 `$HF_HOME` 将需要从 Hugging Face 重新下载大型模型文件，或重新挂载 NFS 缓存。

    **需要帮助？** 请在 [FAQ 页面](https://gonka.ai/FAQ/) 查找答案，或加入 [Discord 服务器](https://discord.com/invite/RADwCT2U6R) 获取帮助，包括常规咨询、技术问题或安全问题。  
