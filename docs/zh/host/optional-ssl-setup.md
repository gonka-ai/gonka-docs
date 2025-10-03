# [可选] SSL 设置

## 使用场景
适用于希望为公共 API、链端点（RPC/REST/gRPC）和/或 Explorer 提供 HTTPS 的主机。

---

## 选择模式

| `NGINX_MODE` | 暴露的端口数量 | 描述 |
|---|---|---|
| `http` | 单端口（默认 8000） | 仅 HTTP（无 TLS） |
| `https` | 单端口（默认 8443） | 仅 HTTPS；需要证书 |
| `both` | 双端口（默认 8000/8443） | 同时提供 HTTP 和 HTTPS（迁移期间推荐） |

> **提示：** 在迁移阶段先使用 `both`；后续切换为 `https` 来强制启用 TLS。

---

## A) 使用 **Proxy SSL** 设置（自动化）

### 你将获得
- **自动签发与续期** TLS 证书（Let’s Encrypt，DNS-01 验证方式）。
- 一个 **单一入口** 的 nginx 代理，终止 TLS 并路由到你的服务。
- 使用 `docker compose` 的 `ssl` 配置文件即可 **一键启用**。

### 工作原理（高层）
1. 运行两个容器：**`proxy`**（nginx）和 **`proxy-ssl`**（ACME 签发器）。  
2. 第一次启动（或缺少证书时），`proxy` 会请求 `proxy-ssl` 为 `CERT_ISSUER_DOMAIN`（以及配置的子域名）申请证书。  
3. `proxy-ssl` 使用你提供的 **DNS API 密钥** 对接 DNS 提供商执行 DNS-01 验证，从 Let’s Encrypt 获取证书，并存储在共享挂载目录 (`./secrets/nginx-ssl`)。  
4. `proxy` 读取已签发的证书并提供 HTTPS 服务。续期过程自动重复。

### 需求检查清单（Proxy SSL）
- 域名的 DNS **A/AAAA** 记录需要指向运行 `proxy` 的主机。
- 需要一个受支持的提供商的 **DNS API 凭证**：Route53、Cloudflare、Google Cloud DNS、Azure、DigitalOcean、Hetzner。
- 一个包含 `proxy` 和 `proxy-ssl`（启用 `ssl` profile）的 compose stack。
- 防火墙需开放入站端口 **8000/8443**。

### 操作步骤（Proxy SSL）

#### 0) 准备目录（可重复执行）
```bash
mkdir -p deploy/join/secrets/nginx-ssl deploy/join/secrets/certbot
```

#### 1) 配置 `deploy/join/config.env`
最小示例 **HTTPS on 8443**:

```bash
# Core proxy settings
NGINX_MODE=both
API_PORT=8000            # HTTP backend (used if you also keep 80 open)
API_SSL_PORT=8443        # HTTPS backend

# Automatic certificate issuance via proxy-ssl
CERT_ISSUER_DOMAIN=your.domain
CERT_ISSUER_ALLOWED_SUBDOMAINS=api,explorer,rpc   # optional; comma-separated
CERT_ISSUER_JWT_SECRET=change-me                  # any strong shared secret

# ACME / Let's Encrypt account
ACME_ACCOUNT_EMAIL=you@example.com
ACME_DNS_PROVIDER=cloudflare  # one of: route53|cloudflare|gcloud|azure|digitalocean|hetzner

# DNS provider credential - see instructions how to abtain below
```

#### 2) DNS 凭证速查表
使用与你的 DNS 提供商匹配的凭证。点击提供商跳转到 详细步骤。

| 提供商 | 必需环境变量 | 
|---|---|
| [**Cloudflare**](#cloudflare-dns-token-how-to) | `CF_DNS_API_TOKEN` |
| [**AWS Route53**](#aws-route53-credentials-how-to) | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` |
| [**Google Cloud DNS**](#google-cloud-dns-credentials-how-to)  | `GCE_PROJECT`, `GCE_SERVICE_ACCOUNT_JSON_B64` |
| [**Azure DNS**](#azure-dns-credentials-how-to) | `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID` |
| [**DigitalOcean DNS**](#digitalocean-dns-credentials-how-to) | `DO_AUTH_TOKEN` |
| [**Hetzner DNS**](#hetzner-dns-credentials-how-to) | `HETZNER_API_KEY` |

(以下 provider 详细步骤保持英文原文，以保证准确性。)

??? details "Cloudflare"
    **Cloudflare**{#cloudflare-dns-token-how-to}

    1) Open the Cloudflare Dashboard.
    
    2) Go to Profile → API Tokens.
    
    3) Click Create Token.
    
    4) Use Edit zone DNS template or set permissions: Zone:Read and DNS:Edit.
    
    5) Limit the token to your DNS zone and create it.
    
    6) Copy the token and set CF_DNS_API_TOKEN.

??? details "AWS Route53"
    **AWS Route53**{#aws-route53-credentials-how-to}

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

    **Option B — Console**
    
    1) Create an IAM policy limited to your hosted zone (ChangeResourceRecordSets and list permissions).
    
    2) Create an IAM user with programmatic access.
    
    3) Attach the policy to the user.
    
    4) Create an access key pair and set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION.

??? details "Google Cloud DNS"
    **Google Cloud DNS**{#google-cloud-dns-credentials-how-to}

    **Option A — gcloud CLI:**
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
    **Option B — Console**
    
    1) IAM & Admin → Service Accounts → Create service account (e.g., acme-dns).
    
    2) Grant the service account role: DNS Administrator (`roles/dns.admin`).
    
    3) Service account → Keys → Add key → Create new key (JSON) → Download.
    
    4) Base64-encode the JSON key to a single line and set `GCE_SERVICE_ACCOUNT_JSON_B64`. Set `GCE_PROJECT` to your project ID.

??? details "Azure DNS"
    **Azure DNS**{#azure-dns-credentials-how-to}

    **Option A — Azure CLI** (quick)
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
    **Option B — Portal**
    
    1) Go to Microsoft Entra ID → App registrations → New registration. Copy Application (client) ID and Directory (tenant) ID.
    
    2) Go to Certificates & secrets → New client secret. Copy the secret value and set `AZURE_CLIENT_SECRET`.
    
    3) Copy your Subscription ID and set `AZURE_SUBSCRIPTION_ID`.
    
    4) In your DNS zone, open Access control (IAM) → Add role assignment → DNS Zone Contributor → assign to the registered app.

??? details "DigitalOcean DNS"
    **DigitalOcean DNS**{#digitalocean-dns-credentials-how-to}

    1) Open DigitalOcean Control Panel.
    
    2) Go to API → Tokens.
    
    3) Generate a write‑scoped token and set `DO_AUTH_TOKEN`.

??? details "Hetzner DNS"
    **Hetzner DNS**{#hetzner-dns-credentials-how-to}

    1) Open https://dns.hetzner.com.
    
    2) Go to API Tokens.
    
    3) Create a new token and set `HETZNER_API_KEY`.

#### 3) 启动（或启用）SSL 组件
在 `deploy/join` 目录下执行：
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
只有 `proxy` 和 `proxy-ssl` 需要重启以应用 SSL 改动。其他服务可以继续运行。

#### 4) 验证
- 确认域名的 DNS 记录指向 proxy 主机。
- 查看日志中的 SSL 活动（签发/续期）：
  ```bash
  docker compose logs -n 200 proxy proxy-ssl
  ```
- 健康检查：
  ```bash
  curl -I https://your.domain:8443/health   # Expect: HTTP/2 200 OK
  ```

#### 5) 续期与需要手动操作的场景
**自动完成：**

- 证书续期（使用 `./secrets/nginx-ssl` 中的已有文件）。
- Nginx 在容器重启时会自动加载新证书。

**需要手动操作时：**

- 更换 DNS 凭证 → 更新 env 文件并重启 `proxy-ssl`。
- 修改 `CERT_ISSUER_DOMAIN` 或子域名 → 更新 env，确认 DNS 记录存在，然后重启 `proxy` 和 `proxy-ssl`。
- 更换主机/IP → 在签发或续期之前，更新 DNS 指向新的 proxy 主机。

应用 `env` 改动的命令：:
```bash
source ./config.env && \
  docker compose --profile "ssl" -f docker-compose.yml -f docker-compose.mlnode.yml up -d proxy proxy-ssl
```

---
## B) **使用 Manual SSL 设置（自带证书）**

### 工作原理（高层）
- 你自己签发证书（例如使用 `Dockerized Certbot DNS-01` 验证），并将证书放在 `./secrets/nginx-ssl/ 下`。
- `proxy（nginx）` 容器会使用 `SSL_CERT_SOURCE` 中的 `cert/key` 文件来提供 `TLS`。

### 需求检查清单（Manual SSL）
- 证书需 **手动签发**（`Let’s Encrypt` + `Certbot` 或其他 CA）
- 将 **cert.pem**（fullchain）和 `private.key`（权限 0600）放在 `deploy/join/secrets/nginx-ssl/`。
- 设置 `NGINX_MODE` 为 both（迁移期间推荐）或 `https`。
- 设置 `SERVER_NAME` 为完整域名，并设置 `API_SSL_PORT` 为 HTTPS 端口（我们的 stack 默认 `8443`）。
- 设置 `SSL_CERT_SOURCE=./secrets/nginx-ssl`。
- **不要**设置 `CERT_ISSUER_DOMAIN`（该字段仅用于自动化 `Proxy SSL` 模式）。

### 操作步骤（Manual SSL）

#### 0) 准备目录
```bash
mkdir -p secrets/nginx-ssl secrets/certbot
```

#### 1) 生成证书（Dockerized Certbot; DNS-01）
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
> Certbot 会暂停并显示需要添加到 DNS 的 TXT 记录。验证通过后，`cert.pem` 和 `private.key` 会出现在 `./secrets/nginx-ssl/`。

#### 2) 编辑 `deploy/join/config.env`
```bash
export NGINX_MODE="both"                 # or https
export API_SSL_PORT="8443"               # HTTPS port served by proxy
export SERVER_NAME="${DOMAIN}"           # full domain name
export SSL_CERT_SOURCE="./secrets/nginx-ssl"
# IMPORTANT: do NOT set CERT_ISSUER_DOMAIN in Manual mode
```

#### 3) 更新并仅重启 proxy
```bash
source config.env && \
  docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull proxy && \
  docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d --no-deps proxy
```

#### 4) 验证 HTTPS
```bash
curl -I https://<FULL_DOMAIN_NAME>:8443/health   # Expect: HTTP/2 200 OK
```
