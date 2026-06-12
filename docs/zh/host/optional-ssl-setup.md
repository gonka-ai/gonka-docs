# [可选] SSL 设置

## 使用场景
希望为公共 API、链端点（RPC/REST/gRPC）和/或浏览器启用 HTTPS 的主机。

---

## 选择你的模式

| `NGINX_MODE` | 暴露的端口数量 | 说明 |
| --- | --- | --- |
| `http` | 单个（默认 8000） |  |
| `https` |  |  |
| `both` |  |  |
> **提示：** 切换时先使用 `both`；之后切换到 `https` 以强制启用 TLS。

---

## A) 使用 **代理 SSL** 设置（自动）

### 你将获得
- **自动签发与续期** TLS 证书（通过 DNS-01 使用 Let’s Encrypt）。
- 一个终止 TLS 并将请求路由到你服务的 **单一入口点 nginx 代理**。
- 使用 `docker compose` 和 `ssl` 配置文件实现 **一键启用**。

### 工作原理（高层概述）
1. 你运行两个容器：**`proxy`**（nginx）和 **`proxy-ssl`**（ACME 签发器）。  
2. 首次启动时（或证书缺失时），`proxy` 会向 `proxy-ssl` 请求为 `CERT_ISSUER_DOMAIN`（以及配置允许的子域名）签发证书。  
3. `proxy-ssl` 使用你提供的 API 密钥，通过你的 DNS 服务商执行 DNS-01 挑战，从 Let’s Encrypt 获取证书，并将其存储在共享挂载卷（`./secrets/nginx-ssl`）中。  
4. `proxy` 获取已签发的证书并提供 HTTPS 服务。证书续期将自动重复进行。

### 前置条件检查清单（代理 SSL）
- DNS 的 **A/AAAA** 记录指向运行 `proxy` 的主机。
- 支持的 DNS 服务商的 **DNS API 凭据**：Route53、Cloudflare、Google Cloud DNS、Azure、DigitalOcean、Hetzner。
- 一个包含 `proxy` 和 `proxy-ssl` 的正常运行的 compose 服务栈（通过 `ssl` 配置文件启用）。
- 防火墙上开放入站端口 **8000/8443**。

### 分步操作指南（代理 SSL）

#### 0) 准备目录（可安全重复执行）

```bash
mkdir -p deploy/join/secrets/nginx-ssl deploy/join/secrets/certbot
```

#### 1) 配置 `deploy/join/config.env`
**在 8443 端口启用 HTTPS** 的最小化示例：

```bash
# Core proxy settings
NGINX_MODE=both
API_PORT=8000
# HTTP backend (used if you also keep 80 open)
API_SSL_PORT=8443
# HTTPS backend

# Automatic certificate issuance via proxy-ssl
CERT_ISSUER_DOMAIN=your.domain
CERT_ISSUER_ALLOWED_SUBDOMAINS=api,explorer,rpc
   optional; comma-separated
CERT_ISSUER_JWT_SECRET=change-me
                  any strong shared secret

ACME / Let's Encrypt account
ACME_ACCOUNT_EMAIL=you@example.com
ACME_DNS_PROVIDER=cloudflare
  one of: route53|cloudflare|gcloud|azure|digitalocean|hetzner

DNS provider credential
 see instructions how to abtain below
```

#### 2) DNS 凭据速查表
使用与您的提供商匹配的凭据。点击某个提供商可跳转到下方的 **操作指南**。

| 提供商 | 所需环境变量 |
| --- | --- |
| [**Cloudflare**](#cloudflare-dns-token-how-to) | `CF_DNS_API_TOKEN` |
| [**AWS Route53**](#aws-route53-credentials-how-to) | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` |
| [**Google Cloud DNS**](#google-cloud-dns-credentials-how-to) | `GCE_PROJECT`, `GCE_SERVICE_ACCOUNT_JSON_B64` |
| [**Azure DNS**](#azure-dns-credentials-how-to) | `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID` |
| [**DigitalOcean DNS**](#digitalocean-dns-credentials-how-to) | `DO_AUTH_TOKEN` |
| [**Hetzner DNS**](#hetzner-dns-credentials-how-to) | `HETZNER_API_KEY` |
??? details "Cloudflare"
    **Cloudflare**{#cloudflare-dns-token-how-to}

    1) 打开 Cloudflare 控制面板。

    2) 进入 Profile → API Tokens。

    3) 点击 Create Token。

    4) 使用“Edit zone DNS”模板，或设置权限：Zone:Read 和 DNS:Edit。

    5) 将令牌限制为您的 DNS 区域并创建令牌。

    6) 复制生成的令牌，并设置环境变量 `CF_DNS_API_TOKEN`。

??? details "AWS Route53"
    **AWS Route53**{#aws-route53-credentials-how-to}

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

    4) 创建一个访问密钥对，并设置 AWS_ACCESS_KEY_ID、AWS_SECRET_ACCESS_KEY 和 AWS_REGION。

??? details "Google Cloud DNS"
    **Google Cloud DNS**{#google-cloud-dns-credentials-how-to}

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

??? details "Azure DNS"
    **Azure DNS**{#azure-dns-credentials-how-to}

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

1) 转到 Microsoft Entra ID → 应用注册 → 新建注册。复制应用程序（客户端）ID 和目录（租户）ID。

2) 转到证书和密码 → 新建客户端密码。复制密码值并设置为 `AZURE_CLIENT_SECRET`。

3) 复制你的订阅 ID 并设置为 `AZURE_SUBSCRIPTION_ID`。

4) 在你的 DNS 区域中，打开访问控制 (IAM) → 添加角色分配 → DNS 区域参与者 → 分配给已注册的应用程序。

??? details "DigitalOcean DNS"
    **DigitalOcean DNS**{#digitalocean-dns-credentials-how-to}

    1) 打开 DigitalOcean 控制面板。

    2) 转到 API → 令牌。

    3) 生成一个具有写入权限的令牌，并设置为 `DO_AUTH_TOKEN`。

??? details "Hetzner DNS"
    **Hetzner DNS**{#hetzner-dns-credentials-how-to}

    1) 打开 https://dns.hetzner.com。

    2) 转到 API 令牌。

    3) 创建一个新令牌，并设置为 `HETZNER_API_KEY`。

#### 3) 启动（或启用）SSL 组件
从 `deploy/join`:

```bash
# Enable / upgrade only the proxy pieces
source ./config.env && \
  docker compose --profile "ssl" \
    -f docker-compose.yml -f docker-compose.mlnode.yml \
    pull proxy proxy-ssl && \
  docker compose --profile "ssl" \
    -f docker-compose.yml -f docker-compose.mlnode.yml \
    up -d proxy proxy-ssl
```

只需 (重新) 启动 `proxy` 和 `proxy-ssl` 以应用 SSL 更改，其他服务可保持运行。

#### 4) 验证
- 确认域名的 DNS 记录已指向代理主机。
- 查看日志中的 SSL 相关活动（证书签发/续期）：
 

 

```bash
  docker compose logs -n 200 proxy proxy-ssl
 
 
```

- 探针健康状态：
 

 

```bash
  curl -I https://your.domain:8443/health
   Expect: HTTP/2 200 OK
 
 
```

#### 5) 续期及需要您操作的情况
**自动执行：**

- 证书续期（证书颁发者会复用 `./secrets/nginx-ssl`）。
- Nginx 在容器重启时自动加载已更新的证书。

**需要您手动操作的情况：**

- 轮换 **DNS 凭据** → 更新环境变量并重启 `proxy-ssl`。
- 更改 `CERT_ISSUER_DOMAIN` 或子域名 → 更新环境变量，确保 DNS 记录已存在，然后重启 `proxy` 和 `proxy-ssl`。
- 更换主机/IP → 在申请或续期证书**之前**，先更新 DNS 指向新的代理服务器。

应用环境变量更改的命令：

```bash
source ./config.env && \
  docker compose --profile "ssl" -f docker-compose.yml -f docker-compose.mlnode.yml up -d proxy proxy-ssl
```

---
## B) 使用**手动 SSL** 设置（自带证书）

### 工作原理（高级概述）
- 您自行签发证书（例如，使用支持 DNS-01 的 Docker 化 Certbot），并将证书文件放置在 `./secrets/nginx-ssl/` 目录下。
- `proxy`（nginx）容器会从 `SSL_CERT_SOURCE` 读取证书和密钥文件，用于提供 TLS 服务。

### 手动 SSL 配置需求清单
- 证书将**手动**签发（可通过 Certbot 签发 Let’s Encrypt 证书，或其他 CA）。
- 将 **`cert.pem`**（完整证书链 fullchain）和 **`private.key`**（权限模式 `0600`）文件放入 `deploy/join/secrets/nginx-ssl/` 目录。
- 将 `NGINX_MODE` 设置为 `both`（迁移时推荐）或 `https`。
- 将 `SERVER_NAME` 设置为您的**完整域名**，并将 `API_SSL_PORT` 设置为您的 HTTPS 端口（在我们的技术栈中默认为 **8443**）。
- 设置 `SSL_CERT_SOURCE=./secrets/nginx-ssl`。
- **不要**设置 `CERT_ISSUER_DOMAIN`（该参数仅用于自动代理 SSL 模式）。

### 分步操作指南（手动 SSL）

#### 0) 准备目录

```bash
mkdir -p secrets/nginx-ssl secrets/certbot
```

#### 1) 生成证书（Docker 化的 Certbot；DNS-01）

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

> Certbot 将暂停并显示需要在您的服务商处添加的 **TXT DNS** 记录。验证完成后，`cert.pem` 和 `private.key` 将出现在 `./secrets/nginx-ssl/` 中。

#### 2) 编辑 `deploy/join/config.env`

```bash
export NGINX_MODE="both"
# or https
export API_SSL_PORT="8443"
               HTTPS port served by proxy
export SERVER_NAME="${DOMAIN}"
           full domain name
export SSL_CERT_SOURCE="./secrets/nginx-ssl"
IMPORTANT: do NOT set CERT_ISSUER_DOMAIN in Manual mode
```

#### 3) 仅更新并重启代理

```bash
source config.env && \
  docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull proxy && \
  docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d --no-deps proxy
```

#### 4) 验证 HTTPS

```bash
curl -I https://<FULL_DOMAIN_NAME>:8443/health
   Expect: HTTP/2 200 OK
```
