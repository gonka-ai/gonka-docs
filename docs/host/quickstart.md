# Setting up your chain 

**Host** (**hardware provider** or **node**) contributes computational resources to the network and is rewarded based on the amount and quality of resources they provide.

To join the network, you need to deploy two services:

- **Network node** – a service consisting of two nodes: a **chain node** and an **API node**. This service handles all communication. The **chain node** connects to the blockchain, while the **API node** manages user requests.
- **Inference (ML) node** – a service that performs inference of large language models (LLMs) on GPU(s). You need at least one **ML node** to join the network.

The guide describes a scenario in which both services are deployed on the same machine, and each Host has one MLNode. Services are deployed as Docker containers.

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
To earn the highest rewards and maintain reliability, each Network Node should serve two model classes, with a minimum of 2 MLNodes per class. This setup:

- Improves protocol-level redundancy and fault tolerance
- Enhances model-level validation performance
- Aligns with future reward scaling logic

### Proposed Hardware Configuration
To run a valid node, you need machines with [supported GPU(s)](/host/hardware-specifications/). We recommend grouping your hardware into 2–5 Network Nodes, each configured to support all model classes. Below is a reference layout:

| **Model Class** | **Model Name**                          | **MLNodes (min)** | **Example Hardware**                            | **Total VRAM** |
|-----------------|------------------------------------------|-------------------|-------------------------------------------------|----------------|
| **Large**       | `DeepSeek R1` / `Qwen3-235B`                | ≥ 2               | 8× H200 per MLNode                              | 640 GB         |
| **Medium**      | `Qwen3-32B` / `Gemma-3-27B-it`              | ≥ 2               | 4× A100 or 2× H100 per MLNode                   | 80 GB          |

This is a reference architecture. You may adjust node count or hardware allocation, but we recommend following the core principle: each node should support multiple MLNodes across all three model tiers.

More details about the optimal deployment configuration can be found [here](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/).

The server hosting the Network Node should have:

- 16-core CPU (amd64)
- 64+ GB RAM
- 1TB NVMe SSD
- 100Mbps minimum network connection (1Gbps preferred)

The final requirements will depend on the number of MLNodes connected and their total throughput.

Each server to deploy MLNode should have:

- at least 1.5x RAM of GPU VRAM
- a 16-core CPU (Network Node and MLNode can be deployed on the same server).
- NVIDIA Container Toolkit installed and configured, with a CUDA Toolkit version between 12.6 and 12.9. You can check the version with `nvidia-smi`.

### Ports open for public connections

- 5000 - Tendermint P2P communication
- 26657 - Tendermint RPC (querying the blockchain, broadcasting transactions)
- 8000 - Application service (configurable)

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
    
    - Control: Master key that grants permissions to all other keys
    - Security: Must be stored offline on a secure, air-gapped machine
    - Usage: Only for granting permissions and validator registration
    - Recovery: Protected by mnemonic phrase - if lost, all access is permanently lost

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
| `docker-compose.mlnode.yml`   | Docker Compose file to launch the ML node                                   |
| `node-config.json`            | The configuration file used by the Network Node, describes the inference nodes managed by this Network Node |

### [Server] Edit Environment Variables

!!! note "config.env"
    ```
    export KEY_NAME=<FILLIN>								    # Edit as described below
    export KEYRING_PASSWORD=<FILLIN>                            # Edit as described below
    export API_PORT=8000									    # Edit as described below
    export PUBLIC_URL=http://<HOST>:<PORT>					    # Edit as described below
    export P2P_EXTERNAL_ADDRESS=tcp://<HOST>:<PORT>		        # Edit as described below
    export ACCOUNT_PUBKEY=<ACCOUNT_PUBKEY_FROM_STEP_ABOVE>      # Use the pubkey from your Account Key (without quotes)
    export NODE_CONFIG=./node-config.json					    # Keep as is
    export HF_HOME=/mnt/shared								    # Directory you used for cache
    export SEED_API_URL=http://node2.gonka.ai:8000			    # Keep as is 
    export SEED_NODE_RPC_URL=http://node2.gonka.ai:26657	    # Keep as is
    export SEED_NODE_P2P_URL=tcp://node2.gonka.ai:5000		    # Keep as is
    export DAPI_API__POC_CALLBACK_URL=http://api:9100		    # Keep as is
    export DAPI_CHAIN_NODE__URL=http://node:26657			    # Keep as is
    export DAPI_CHAIN_NODE__P2P_URL=http://node:26656		    # Keep as is
    export RPC_SERVER_URL_1=http://node1.gonka.ai:26657		    # Keep as is
    export RPC_SERVER_URL_2=http://node2.gonka.ai:26657		    # Keep as is
    export PORT=8080                                            # Keep as is
    export INFERENCE_PORT=5050                                  # Keep as is
    export KEYRING_BACKEND=file                                 # Keep as is
    ```

Which variables to edit:

| Variable               | What to do                                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `KEY_NAME`            | Manually define a unique identifier for your node.                                                                                                                      |
| `KEYRING_PASSWORD`    | Set a password for encrypting the ML Operational Key stored in the `file` keyring backend on the server.                                                        |
| `API_PORT`           | Set the port where your node will be available on the machine (default is 8000).                                                                                                   |
| `PUBLIC_URL`        | Specify the `Public URL` where your node will be available externally (e.g.: `http://<your-static-ip>:<port>`, mapped to 0.0.0.0:8000).                                                  |
| `P2P_EXTERNAL_ADDRESS` | Specify the `Public URL` where your node will be available externally for P2P connections (e.g.: `http://<your-static-ip>:<port1>`, mapped to 0.0.0.0:5000).                           |
| `HF_HOME`           | Set the path where Hugging Face models will be cached. Set this to a writable local directory (e.g., `~/hf-cache`). |
| `ACCOUNT_PUBKEY`           | Use the public key from your Account Key created above (the value after `"key":` without quotes) |

All other variables can be left as is.

**Load the configuration:**
```bash
source config.env
```

!!! note "Using Environment Variables"
    The examples in the following sections will reference these environment variables (e.g., `$PUBLIC_URL`, `$ACCOUNT_PUBKEY`, `$SEED_API_URL`) in both local machine commands and server commands. Make sure to run `source config.env` in each terminal session where you'll be executing these commands.

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

    If you see the chain node continuously processing block events, then the setup is working correctly.

??? note "About Consensus Key"
    - Control: Managed by secure TMKMS service
    - Security: Warm storage with double-signing prevention
    - Usage: Block validation and network consensus participation
    - Recovery: Can be rotated by Account Key or authorized delegates
    
    During the registration command on [step 3.2.](https://gonka.ai/host/quickstart/#32-server-register-host) (`inferenced register-new-participant`), the Consensus Key is linked to your Account Key (Cold Key) on-chain, establishing your node as a valid participant in the network.
    
    If you delete or overwrite the `.tmkms` folder, your Consensus Key will be lost. This key is what links your node to the blockchain’s validator set. Once `.tmkms` is gone, you must start the entire setup from scratch, including generating a new Consensus Key (via `tmkms`) (see “[I Cleared or Overwrote My Consensus Key](https://gonka.ai/FAQ/#i-cleared-or-overwrote-my-consensus-key)” on the FAQ page). 

### 3. Complete Key Setup and Host Registration

Now we need to complete the key management setup by creating the warm key, registering the Host, and granting permissions:

#### 3.1. [Server] Create ML Operational Key

??? note "About ML Operational Key (Warm Key)"
    - Control: Authorized by Account Key for ML-specific transactions
    - Security: Encrypted file on server, accessed programmatically
    - Usage: Automated transactions (inference requests, proof submissions, rewards)
    - Recovery: Can be rotated/revoked by Account Key at any time
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

#### 3.4. [Server] Launch Full Node

Finally, launch all containers, including the API:
```bash
source config.env && \
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d
```

## Verify Node Status
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

### How to stop MLNode
1. Disable each MLNode.
```
curl -X POST http://<api_node_static_ip>:<admin_port>/admin/v1/nodes/<id>/disable
```
2. Wait for the next epoch. Do not stop the node yet. The disable flag takes effect only after the next epoch starts.
3. Verify removal and weight. Confirm both for every disabled node:

    - It is not present in the active participants list
    - Its effective weight equals 0

4. Stop the MLNode.
5. Make sure you are in `gonka/deploy/join` folder. To stop all running containers:
```bash
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml down
```
6. This stops and removes all services defined in the `docker-compose.yml` and `docker-compose.mlnode.yml` file without deleting volumes or data unless explicitly configured.

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

**Need help?** Join our [Discord server](https://discord.com/invite/RADwCT2U6R) for assistance with general inquiries, technical issues, or security concerns.  
