# Setting up your chain 

**Host** (**hardware provider** or **node**) contributes computational resources to the network and is rewarded based on the amount and quality of resources they provide.

To join the network, you need to deploy two services:

- **Network Node** – a service consisting of two nodes: a **Chain Node** and an **API Node**. This service handles all communication. The **Chain Node** connects to the blockchain, while the **API Node** manages user requests.
- **Inference (ML) node** – a service that performs inference of large language models (LLMs) on GPU(s). You need at least one **ML Node** to join the network.

The guide describes a scenario in which both services are deployed on the same machine, and each Host has one ML Node. Services are deployed as Docker containers.

??? note "Live Demo — How to Launch a Node (Quickstart for Hosts)"
    The video recording of the demo session for launching a node via the quickstart is available below. Some steps in the recording may differ from the instructions below, as the quickstart is updated continuously based on community feedback. Always follow the written quickstart - it reflects the current and correct procedure.

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

## Prerequisites
This  section provides guidance on configuring your hardware infrastructure to participate in Gonka Network launch. The goal is to maximize protocol rewards by aligning your deployment with network expectations.

### Supported Model Classes
The protocol currently supports the following model classes:

- Large Models — `DeepSeek R1`, `Qwen3-235B`, `gpt-oss-120b`
- Medium Models — `Qwen3-32B`, `Gemma-3-27b-it`

!!! note "Governance and model classification"
    - The exact deployment parameters for each category are defined in the genesis configuration.
    - Models may be classified into a category if approved by governance.
    - Decisions about adding or changing supported models are made by governance.
    - For details on governance procedures and how to propose new models, see the [Transactions and Governance Guide](https://gonka.ai/transactions-and-governance/).

### Configuration for Optimal Rewards
To earn the highest rewards and maintain reliability, each Network Node should serve two model classes, with a minimum of 2 ML Nodes per class. This setup:

- Improves protocol-level redundancy and fault tolerance
- Enhances model-level validation performance
- Aligns with future reward scaling logic

### Proposed Hardware Configuration
To run a valid node, you need machines with [supported GPU(s)](/host/hardware-specifications/). We recommend grouping your hardware into 2–5 Network Nodes, each configured to support all model classes. Below is a reference layout:

| **Model Class** | **Model Name**                          | **ML Nodes (min)** | **Example Hardware**                            | **Minimum VRAM per ML Node** |
|-----------------|------------------------------------------|-------------------|-------------------------------------------------|----------------|
| **Large**       | `DeepSeek R1` / `Qwen3-235B`                | ≥ 2               | 8× H200 per MLNode                              | 640 GB         |
| **Medium**      | `Qwen3-32B` / `Gemma-3-27B-it`              | ≥ 2               | 4× A100 or 2× H100 per MLNode                   | 80 GB          |

This is a reference architecture. You may adjust node count or hardware allocation, but we recommend following the core principle: each node should support multiple ML Nodes across all three model tiers.

More details about the optimal deployment configuration can be found [here](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/).

The server hosting the Network Node should have:

- 16-core CPU (amd64)
- 64+ GB RAM
- 1TB NVMe SSD
- 100Mbps minimum network connection (1Gbps preferred)

The final requirements will depend on the number of ML Nodes connected and their total throughput.

Each server to deploy ML Node should have:

- at least 1.5x RAM of GPU VRAM
- a 16-core CPU (Network Node and ML Node can be deployed on the same server).
- NVIDIA Container Toolkit installed and configured, with a CUDA Toolkit version between 12.6 and 12.9. You can check the version with `nvidia-smi`.

### Ports open for public connections

- 5000 - Tendermint P2P communication
- 26657 - Tendermint RPC (querying the blockchain, broadcasting transactions)
- 8000 - Application service (configurable)

!!! note "CRITICAL WARNING:  Ports 9100, 9200 on API Node, and 8080,5050 on ML Node MUST NOT be publicly accessible"
    The following ports are internal-only:
    
    - `9100`, `9200` — Network Node internal API
    - `5050` — ML Node / vLLM inference API
    - `8080` — ML Node API
    
    If any of these ports are exposed to the public internet, your node is vulnerable. A third party can freely send requests, overload your ML Node, disrupt mining, or cause your node to drop out of an epoch.
    
    **Requirements:**
    
    - Allow access to these ports only from localhost, a private network or whitelisting
    - Never expose them publicly
    - Docker defaults are NOT secure

    === "CASE 1: ML Node and Network Node on the SAME machine"
        Bind ports to localhost only.        
        
        **Network Node (`docker-compose.yml`)**
        
        If your ML Node container and Network Node containers are on the same machine, you can simply edit `gonka/deploy/join/docker-compose.yml`:
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
        
        Do NOT use:
        
        - "9100:9100"
        - "9200:9200"
        - "5050:5000"
        - "8080:8080"
    
    === "CASE 2: ML Node and Network Node on DIFFERENT machines"
        If ML Node and Network Node containers are on different machines, the fix described in Case 1 won't work and the particular way of protecting these ports depends on your setup. You should setup connection between ML Node and Network containers either using the same docker network, or by setting up a private network between the machines, exposing the ports in this network and closing the port for public. In this case you should also properly set up `DAPI_API__POC_CALLBACK_URL` variable in config. This URL must point to a private/internal address, not a public address.


## Setup Your Nodes

The quickstart instructions are designed to run both the Network Node and the inference node on a single machine (one server setup). 

??? note "Multiple nodes deployment"
    If you are deploying multiple GPU nodes, please refer to the detailed [Multiple nodes deployment guide](https://gonka.ai/host/multiple-nodes/) for proper setup and configuration. Whether you deploy inference nodes on a single machine or across multiple servers (including across geographical regions), all inference nodes must be connected to the same Network Node.

### Key Management Overview
Before configuring your Network Node, you need to set up cryptographic keys for secure operations.  
**It is recommended to read the [Key Management Guide](/host/key-management/) before launching a production node.**

We use a three-key system:

- **Account Key** (Cold Wallet) - Created on your local secure machine for high-stakes operations
- **Consensus Key** (TMKMS - Warm Storage) - Managed by secure TMKMS service and used for block validation and network consensus participation
- **ML Operational Key** (Warm Wallet) - Created on the server for automated AI workload transactions

### [Local machine] Install the CLI Tool
The `inferenced` CLI is required for local account management and network operations. It's a command-line interface utility that allows you to create and manage Gonka accounts, register hosts, and perform various network operations from your local machine.

Download the latest `inferenced` binary from [GitHub releases](https://github.com/gonka-ai/gonka/releases) and make it executable:

```bash
chmod +x inferenced
./inferenced --help
```

!!! note "MacOS Users"
    On macOS, you may need to allow execution in `System Settings` → `Privacy & Security` if prompted. Scroll down to the warning about `inferenced` and click `Allow Anyway`.

### [Local machine] Create Account Key
**IMPORTANT: Perform this step on a secure, local machine (not your server)**

??? note "About Account Key (Cold Key)"
    The Account Key is your primary, high-privilege key. It is created locally and never stored on your servers.
    
    - Master key that grants permissions to all other keys
    - Must be stored offline on a secure, air-gapped machine
    - Only for granting permissions and validator registration
    - Protected by mnemonic phrase - if lost, all access is permanently lost

Create your Account Key using the `file` keyring backend (you can also use `os` for enhanced security on supported systems):

```bash
./inferenced keys add gonka-account-key --keyring-backend file
```

CLI will ask you for passphrase and show data about created key-pair.
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

**CRITICAL**: Write this mnemonic phrase down and store it in a secure, offline location. This phrase is the **only** way to recover your Account Key.

!!! info "Hardware Wallet Support"
    **Current Status**: Hardware wallets are not yet supported at network launch.
    
    **For Now**: Store your Account Key on a secure, dedicated machine with minimal internet exposure and strong encryption.
    
    **Important**: Always keep your mnemonic phrase as a backup regardless of future hardware wallet adoption.

### [Server] Download Deployment Files
Clone the repository with the base deploy scripts:

```bash
git clone https://github.com/gonka-ai/gonka.git -b main && \
cd gonka/deploy/join
```

And copy `config` file template:
```
cp config.env.template config.env
```

After cloning the repository, you’ll find the following key configuration files:

| File                          | Description                                                                      |
|-------------------------------|----------------------------------------------------------------------------------|
| `config.env`                  | Contains environment variables for the Network Node                              |
| `docker-compose.yml`          | Docker Compose file to launch the Network Node                                   |
| `docker-compose.mlnode.yml`   | Docker Compose file to launch the ML Node                                   |
| `node-config.json`            | The configuration file used by the Network Node, describes the inference nodes managed by this Network Node |

### [Server] Setup Environment Variables

<!-- CONDITION START: data-show-when='["non-finished"]' -->
!!! note "Configuration Required"
    Please complete the questionnaire to generate your `config.env` configuration. The environment variables depend on your choices (HTTP/HTTPS, SSL certificate method, etc.).
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["domainNo"]' -->
!!! warning "HTTPS Not Available Without Domain Name"
    SSL/TLS certificates can only be issued for domain names (e.g., `example.com`), not for direct IP addresses. Since you indicated you don't have a domain name configured, your node will be set up with **HTTP only** (port 8000). 
    
    If you need HTTPS security, you'll need to:
    
    1. Obtain a domain name and configure DNS to point to your server's IP address
    2. Press the **"Reset"** button above and select **"Yes"** when asked about having a domain name
    
    For production deployments, HTTPS is strongly recommended to encrypt API communications and protect sensitive data.
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
    <p style="margin-top: 1rem; font-size: 0.7rem; color: var(--md-default-fg-color--light);">Copy the configuration above and proceed to edit the values as described below.</p>
    <button class="quickstart-copy-btn">Copy to Clipboard</button>
    <button class="quickstart-reset-btn">Reset</button>
  </div>
</div>

<!-- CONDITION START: data-show-when='["finished"]' -->

If your node cannot connect to the default seed node, [see the FAQ for details.](https://gonka.ai/FAQ/#my-node-cannot-connect-to-the-default-seed-node-specified-in-the-configenv)
### [Server] Edit Environment Variables

Which variables to edit:

<div id="quickstart-edit-table"></div>

All other variables can be left as is.

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto"]' -->
**How to get variables from domain providers:**

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "cloudflare"]' -->
??? details "Cloudflare"
    1) Open the Cloudflare Dashboard.
    
    2) Go to Profile → API Tokens.
    
    3) Click Create Token.
    
    4) Use Edit zone DNS template or set permissions: Zone:Read and DNS:Edit.
    
    5) Limit the token to your DNS zone and create it.
    
    6) Copy the token and set `CF_DNS_API_TOKEN`.
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

    **Option B — Console**
    
    1) Create an IAM policy limited to your hosted zone (ChangeResourceRecordSets and list permissions).
    
    2) Create an IAM user with programmatic access.
    
    3) Attach the policy to the user.
    
    4) Create an access key pair and set `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION`.
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "gcloud"]' -->
??? details "Google Cloud DNS"
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
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "azure"]' -->
??? details "Azure DNS"
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
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "digitalocean"]' -->
??? details "DigitalOcean DNS"
    1) Open DigitalOcean Control Panel.
    
    2) Go to API → Tokens.
    
    3) Generate a write‑scoped token and set `DO_AUTH_TOKEN`.
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto", "hetzner"]' -->
??? details "Hetzner DNS"
    1) Open https://dns.hetzner.com.
    
    2) Go to API Tokens.
    
    3) Create a new token and set `HETZNER_API_KEY`.
<!-- CONDITION END -->
<!-- CONDITION END -->

**Load the configuration:**
```bash
source config.env
```

!!! note "Using Environment Variables"
    The examples in the following sections will reference these environment variables (e.g., `$PUBLIC_URL`, `$ACCOUNT_PUBKEY`, `$SEED_API_URL`) in both local machine commands and server commands. Make sure to run `source config.env` in each terminal session where you'll be executing these commands.
<!-- CONDITION END -->



### [Server] Edit Inference Node Description for the Server

!!! note        
    The network currently supports the following models: `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` and `Qwen/Qwen3-32B-FP8`. The governance makes decisions on adding or modifying supported models. For details on how model governance works and how to propose new models, see the [Transactions and Governance Guide](https://gonka.ai/transactions-and-governance/).

=== "8xH200 or 8xH100"

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
                    "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8": {
                        "args": [
                            "--tensor-parallel-size","4"
                        ]
                    }
                }
            }
        ]
        ```

=== "1xH100"

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
                    "Qwen/Qwen3-32B-FP8": {
                        "args": []
                    }
                }
            }
        ]
        ```

=== "8x4090"

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
                    "Qwen/Qwen3-32B-FP8": {
                        "args": [
                            "--tensor-parallel-size","4"
                        ]
                    }
                }
            }
        ]
        ```

For more details on the optimal deployment configuration, please refer to [this link](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/).

### [Server] Pre-download Model Weights to Hugging Face Cache (HF_HOME)
Inference nodes download model weights from Hugging Face.
To make sure the model weights are ready for inference, you should download them before deployment.

=== "8xH100 or 8xH200"

    ```bash
    mkdir -p $HF_HOME
    huggingface-cli download Qwen/Qwen3-235B-A22B-Instruct-2507-FP8
    huggingface-cli download Qwen/Qwen3-32B-FP8
    ```

=== "Other GPUs"

    ```bash
    mkdir -p $HF_HOME
    huggingface-cli download Qwen/Qwen3-32B-FP8
    ```

## Launch Nodes
    
### 1. [Server] Pull Docker Images (Containers)

Make sure you are in the `gonka/deploy/join` folder before running the next commands. 
```bash
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml pull
```

### 2. [Server] Start Initial Services

Start the essential services needed for key setup (excluding the API service):

```bash
source config.env && \
docker compose up tmkms node -d --no-deps
```

We start these specific containers first because:

- **`tmkms`** - Generates and securely manages the Consensus Key needed for validator registration
- **`node`** - Connects to the blockchain and provides the RPC endpoint to retrieve the Consensus Key  
- **`api`** - is deliberately excluded at this stage because we need to create the ML Operational Key inside it in the next step

!!! note "Recommendation"
    You can check logs to verify that the initial services started successfully:
    
    ```bash
    docker compose logs tmkms node -f
    ```

    If you see the Chain Node continuously processing block events, then the setup is working correctly.

??? note "About Consensus Key"
    - Managed by secure TMKMS service
    - Warm storage with double-signing prevention
    - Block validation and network consensus participation
    - Can be rotated by Account Key or authorized delegates
    
    During the registration command on [step 3.2.](https://gonka.ai/host/quickstart/#32-server-register-host) (`inferenced register-new-participant`), the Consensus Key is linked to your Account Key (Cold Key) on-chain, establishing your node as a valid participant in the network.
    
    If you delete or overwrite the `.tmkms` folder, your Consensus Key will be lost. This key is what links your node to the blockchain’s validator set. Once `.tmkms` is gone, you must start the entire setup from scratch, including generating a new Consensus Key (via `tmkms`) (see “[I Cleared or Overwrote My Consensus Key](https://gonka.ai/FAQ/#i-cleared-or-overwrote-my-consensus-key)” on the FAQ page). 

### 3. Complete Key Setup and Host Registration

Now we need to complete the key management setup by creating the warm key, registering the Host, and granting permissions:

#### 3.1. [Server] Create ML Operational Key

??? note "About ML Operational Key (Warm Key)"
    - Authorized by Account Key for ML-specific transactions
    - Encrypted file on server, accessed programmatically
    - Automated transactions (inference requests, proof submissions, rewards)
    - Can be rotated/revoked by Account Key at any time
    - Needs constant availability, so do not remove or rotate it unless necessary.

Create the warm key inside the `api` container using the `file` keyring backend (required for programmatic access). The key will be stored in a persistent volume mapped to `/root/.inference` of the container:
```bash
docker compose run --rm --no-deps -it api /bin/sh
```

Inside the container, create the ML operational key:
```bash
printf '%s\n%s\n' "$KEYRING_PASSWORD" "$KEYRING_PASSWORD" | inferenced keys add "$KEY_NAME" --keyring-backend file
```
!!! note "Important"
    Do not run this command twice.
    The ML Operational Key (Warm Key) is generated once per server and must be preserved across restarts.
    
    - If you accidentally deleted it or reinitialized, follow the recovery instructions in the FAQ: “[I Deleted the Warm Key](https://gonka.ai/FAQ/#i-deleted-the-warm-key)”.
    - When restarting your node, skip this step entirely — the key is already generated and stored persistently inside the API container.

**Example output:**
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


#### 3.2. [Server] Register Host

From the same container, we can register the Host with URL, Account Key, and Consensus Key (fetched automatically) on chain:

```
inferenced register-new-participant \
    $DAPI_API__PUBLIC_URL \
    $ACCOUNT_PUBKEY \
    --node-address $DAPI_CHAIN_NODE__SEED_API_URL
```

**Expected output:**
```
...
Found participant with pubkey: Au+a3CpMj6nqFV6d0tUlVajCTkOP3cxKnps+1/lMv5zY (balance: 0)
Participant is now available at http://36.189.234.237:19250/v1/participants/gonka1rk52j24xj9ej87jas4zqpvjuhrgpnd7h3feqmm
```

!!! note "Per-Node Account Key Configuration"
    Always generate a unique `ACCOUNT_PUBKEY` for each Network Node to ensure proper separation of Hosts.

Then we can exit the container:
```bash
exit
```


#### 3.3. [Local machine] Grant Permissions to ML Operational Key
**IMPORTANT: Perform this step on your secure local machine where you created the Account Key**

Grant permissions from your Account Key to the ML Operational Key:
```bash
./inferenced tx inference grant-ml-ops-permissions \
    gonka-account-key \
    <ml-operational-key-address-from-step-3.1> \
    --from gonka-account-key \
    --keyring-backend file \
    --gas 2000000 \
    --node <seed_api_url from server's config.env>/chain-rpc/ 
```

**Expected output:**
```
...
Transaction sent with hash: FB9BBBB5F8C155D0732B290C443A0D06BC114CDF43E8EE8FB329D646C608062E
Waiting for transaction to be included in a block...

Transaction confirmed successfully!
Block height: 174
```

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodManual", "domainYes"]' -->
#### 3.4. [Server] Manual SSL Certificate Setup

If you selected manual SSL certificate setup in the questionnaire above, follow these steps to configure your SSL certificates:

##### Prepare directories

```bash
mkdir -p secrets/nginx-ssl secrets/certbot
```

##### Generate certificates (Dockerized Certbot; DNS‑01)

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

!!! note "DNS Challenge"
    Certbot will pause and show the **TXT DNS** record to add at your provider. After validation, `cert.pem` and `private.key` will appear in `./secrets/nginx-ssl/`.

##### Verify certificate files

Ensure the certificate files are in place:

```bash
ls -la secrets/nginx-ssl/
```

You should see:
- `cert.pem` (fullchain certificate)
- `private.key` (private key with mode 0600)

The `config.env` file generated by the questionnaire already includes the necessary SSL configuration variables:
- `SERVER_NAME=<FULL_DOMAIN_NAME>`
- `SSL_CERT_SOURCE=./secrets/nginx-ssl`

Make sure to edit `SERVER_NAME` with your actual domain name before proceeding.

<!-- CONDITION END -->

## 4. [Server] Launch Full Node

Finally, launch all containers, including the API:

<!-- CONDITION START: data-show-when='["non-finished"]' -->
!!! note "Configuration Required"
    Please complete the [questionnaire above](#quickstart-questionnaire) to generate the launch commands.
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttp"]' -->
Launch all containers:

```bash
source config.env && \
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d
```
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodAuto"]' -->
Launch all containers with automatic SSL certificate management:

```bash
source config.env && \
docker compose --profile "ssl" \
  -f docker-compose.yml -f docker-compose.mlnode.yml \
  up -d
```

The `--profile "ssl"` flag enables the `proxy-ssl` container which automatically manages SSL certificates.
<!-- CONDITION END -->

<!-- CONDITION START: data-show-when='["protocolHttps", "certMethodManual", "domainYes"]' -->
Launch all containers with manual SSL certificates:

```bash
source config.env && \
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d
```
<!-- CONDITION END -->

## Verify Node Status

<!-- CONDITION START: data-show-when='["protocolHttps"]' -->
Verify HTTPS is working:

```bash
curl -I https://<FULL_DOMAIN_NAME>:8443/health   # Expect: HTTP/2 200 OK
```
<!-- CONDITION END -->

Open this URL, replacing `<your-gonka-cold-address>` with your address:
```
http://node2.gonka.ai:8000/v1/participants/<your-gonka-cold-address>
```

You will see your public key in JSON format:
```
{"pubkey":"<your-public-key>"}
```

This means that your address is included in the participants' list.

Once your node completes the Proof of Compute stage (which runs every 24 hours), you can visit the following URL to see your node:
```bash
http://node2.gonka.ai:8000/v1/epochs/current/participants
```

You can [simulate the Proof of Compute on a MLNode yourself](https://gonka.ai/FAQ/#how-to-simulate-proof-of-compute-poc) to make sure that everything will work when the PoC phase begins on the chain.

You may turn off your server before this stage and start it again right before the next Proof of Compute.
To track when the next Proof of Compute session will begin, check [the dashboard](https://gonka.ai/wallet/dashboard/) here:
```
http://node2.gonka.ai:8000/dashboard/gonka/validator
```

Once your node is running, check your node status using Tendermint RPC endpoint of your node (26657 of `node` container).
```bash
curl http://<PUBLIC_IP>:<PUBLIC_RPC_PORT>/status
```
On the server, you can use private ones.
```bash
curl http://0.0.0.0:26657/status
```
Using the public IP of the genesis node.
```bash
curl http://node2.gonka.ai:26657/status
```

Once your node is visible in the Dashboard, you may also want to update your public profile (host name, website, avatar). This helps other participants identify your node in the network. You can find [the instructions here](https://gonka.ai/host/validator_info/).

## Stopping and Cleaning Up Your Node

### How to stop your node

Check the epoch you are currently in. Open the URL: [http://node1.gonka.ai:8000/api/v1/epochs/latest](http://node1.gonka.ai:8000/api/v1/epochs/latest) (You can use the URL any other active participant). 

In the response, look for:
```
"latest_epoch": {
    "index": 88,
    ...
}
```

Remember the latest epoch index your node worked for. 

In the same JSON response, find:
```
"next_epoch_stages": {
  ...
  "claim_money": <block_number>
}
```
This block number indicates the block after which you can claim the reward. However, it is important to understand you should proceed with disabling each ML Node now (do not wait for this block before disabling your ML Nodes).

Disable each ML Node.

```
curl -X POST http://<api_node_static_ip>:<admin_port>/admin/v1/nodes/<id>/disable
```
Wait for the next epoch. Do not stop the Network Node or the ML Nodes yet. The disable flag takes effect only after the next epoch starts.

Keep your Network Node online and synced, it should handle the reward claim automatically.
To check that your latest reward was claimed, after the `claim_money` block run the following command (replace `<YOUR_ADDRESS>` and `<EPOCH>` with your actual values):
```
inferenced query inference show-epoch-performance-summary <EPOCH> <YOUR_ADDRESS> --node http://node1.gonka.ai:8000/chain-rpc/ --output json
```
Example: 
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
If the result shows `claimed = true`, your reward has already been claimed.
If it shows `false`, proceed to the manual claim step.

!!! note "Manually claim the reward (if needed)"
    Run:
    ```
    curl -X POST http://localhost:9200/admin/v1/claim-reward/recover \
     -H "Content-Type: application/json" \
     -d '{"force_claim": true}'
    ```

Verify removal and weight. If you disabled all your nodes then your participant should be absent from the active participants list. In case you can still see your participant in the list then it means the network still expects you to participate in the epoch and if you proceed with disabling your node you may miss inferences which will affect your reputation. 

Make sure you are in `gonka/deploy/join` folder. To stop all running containers:
```
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml down
```
This stops and removes all services defined in the `docker-compose.yml` and `docker-compose.mlnode.yml` files without deleting volumes or data unless explicitly configured.

### How to clean up your node (full reset)

If you want to completely reset your node and remove all data (for redeployment or migration), use the following cleanup steps.  

1. To clean up cache and start fresh, remove the local `.inference` and `.dapi` folders (inference runtime cache and identity):
```bash
rm -rf .inference .dapi .tmkms
```

2. (Optional) Clear model weights cache:
```bash
rm -rf $HF_HOME
```

!!! note
    Deleting `$HF_HOME` will require re-downloading large model files from Hugging Face or re-mounting the NFS cache.

**Need help?**  Find answers on [FAQ page](https://gonka.ai/FAQ/), or join [Discord server](https://discord.com/invite/RADwCT2U6R) for assistance with general inquiries, technical issues, or security concerns.  
