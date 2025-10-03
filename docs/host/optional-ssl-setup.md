# [Optional] SSL Setup

## Use cases
Hosts who want HTTPS for the public API, chain endpoints (RPC/REST/gRPC), and/or the Explorer.

---

## Choose your mode

| `NGINX_MODE` | Number of exposed ports | Description |
|---|---|---|
| `http` | single (8000 by default) | HTTP only (no TLS) |
| `https` | single (8443 by default) | HTTPS only; requires certificates |
| `both` | two (8000/8443 by default) | Serve both HTTP and HTTPS (recommended during migration) |

> **Tip:** Start with `both` during cutover; later switch to `https` to force TLS.

---

## A) Setup using **Proxy SSL** (Automated)

### What you get
- **Automatic issuance & renewal** of TLS certs (Let’s Encrypt via DNS‑01).
- A **single entry‑point** nginx proxy that terminates TLS and routes to your services.
- **Flip‑the‑switch** enablement with `docker compose` using the `ssl` profile.

### How it works (high level)
1. You run two containers: **`proxy`** (nginx) and **`proxy-ssl`** (ACME issuer).  
2. On first start (or when a cert is missing), `proxy` asks `proxy-ssl` for a cert for `CERT_ISSUER_DOMAIN` (and allowed subdomains, if configured).  
3. `proxy-ssl` performs a DNS‑01 challenge with your DNS provider **using the API keys you supply**, obtains a certificate from Let’s Encrypt, and stores it in the shared mount (`./secrets/nginx-ssl`).  
4. `proxy` picks up the issued certs and serves HTTPS. Renewals repeat automatically.

### Requirements checklist (Proxy SSL)
- DNS **A/AAAA** records for your domain point to the host where `proxy` runs.
- **DNS API credentials** for one supported provider: Route53, Cloudflare, Google Cloud DNS, Azure, DigitalOcean, Hetzner.
- A working compose stack including `proxy` and `proxy-ssl` (via the `ssl` profile).
- Open inbound ports **8000/8443** on your firewall.

### Walkthrough — step by step (Proxy SSL)

#### 0) Prepare directories (safe to re‑run)
```bash
mkdir -p deploy/join/secrets/nginx-ssl deploy/join/secrets/certbot
```

#### 1) Configure `deploy/join/config.env`
Minimal example for **HTTPS on 8443**:

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

#### 2) DNS Credentials Cheat Sheet
Use the credential(s) that match your provider. Click a provider to jump to the **how‑to** below.

| Provider | Required env | 
|---|---|
| [**Cloudflare**](#cloudflare-dns-token-how-to) | `CF_DNS_API_TOKEN` |
| [**AWS Route53**](#aws-route53-credentials-how-to) | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` |
| [**Google Cloud DNS**](#google-cloud-dns-credentials-how-to)  | `GCE_PROJECT`, `GCE_SERVICE_ACCOUNT_JSON_B64` |
| [**Azure DNS**](#azure-dns-credentials-how-to) | `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID` |
| [**DigitalOcean DNS**](#digitalocean-dns-credentials-how-to) | `DO_AUTH_TOKEN` |
| [**Hetzner DNS**](#hetzner-dns-credentials-how-to) | `HETZNER_API_KEY` |

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

#### 3) Start (or enable) SSL components
From `deploy/join`:
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
Only `proxy` and `proxy-ssl` need to be (re)started for SSL changes. Other services can remain running.

#### 4) Verify
- Confirm DNS records for your domain point to the proxy host.
- Tail logs for SSL activity (issuance/renewal):
  ```bash
  docker compose logs -n 200 proxy proxy-ssl
  ```
- Probe health:
  ```bash
  curl -I https://your.domain:8443/health   # Expect: HTTP/2 200 OK
  ```

#### 5) Renewal & when you must act
**Automatic:**

- Certificate renewals (issuer reuses `./secrets/nginx-ssl`).
- Nginx picks up renewed certs on container restart.

**You act when:**

- Rotating **DNS credentials** → update env & restart `proxy-ssl`.
- Changing `CERT_ISSUER_DOMAIN` or subdomains → update env, ensure DNS records exist, then restart `proxy` and `proxy-ssl`.
- Moving hosts/IPs → update DNS to point to the new proxy **before** issuing/renewing.

Commands to apply env changes:
```bash
source ./config.env && \
  docker compose --profile "ssl" -f docker-compose.yml -f docker-compose.mlnode.yml up -d proxy proxy-ssl
```

---
## B) Setup using **Manual SSL** (BYO certificates)

### How it works (high level)
- You issue certificates yourself (e.g., Dockerized Certbot using DNS‑01) and place them under `./secrets/nginx-ssl/`.
- The `proxy` (nginx) container serves TLS using cert/key files read from `SSL_CERT_SOURCE`.

### Requirements checklist (Manual SSL)
- Certificates will be issued **manually** (Let’s Encrypt via Certbot, or other CA).
- Place **`cert.pem`** (fullchain) and **`private.key`** (mode `0600`) under `deploy/join/secrets/nginx-ssl/`.
- Set `NGINX_MODE` to `both` (recommended for migration) or `https`.
- Set `SERVER_NAME` to your **full domain name** and `API_SSL_PORT` to your HTTPS port (default **8443** in our stack).
- Set `SSL_CERT_SOURCE=./secrets/nginx-ssl`.
- **Do not** set `CERT_ISSUER_DOMAIN` (that is only for the automated Proxy SSL mode).

### Walkthrough — step by step (Manual SSL)

#### 0) Prepare directories
```bash
mkdir -p secrets/nginx-ssl secrets/certbot
```

#### 1) Generate certs (Dockerized Certbot; DNS‑01)
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
> Certbot will pause and show the **TXT DNS** record to add at your provider. After validation, `cert.pem` and `private.key` will appear in `./secrets/nginx-ssl/`.

#### 2) Edit `deploy/join/config.env`
```bash
export NGINX_MODE="both"                 # or https
export API_SSL_PORT="8443"               # HTTPS port served by proxy
export SERVER_NAME="${DOMAIN}"           # full domain name
export SSL_CERT_SOURCE="./secrets/nginx-ssl"
# IMPORTANT: do NOT set CERT_ISSUER_DOMAIN in Manual mode
```

#### 3) Update & restart only the proxy
```bash
source config.env && \
  docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull proxy && \
  docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d --no-deps proxy
```

#### 4) Verify HTTPS
```bash
curl -I https://<FULL_DOMAIN_NAME>:8443/health   # Expect: HTTP/2 200 OK
```
