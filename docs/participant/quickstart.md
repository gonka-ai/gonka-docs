# Setting up your chain 

**Participants** (**hardware providers** or **nodes**) contribute computational resources to the network and are rewarded based on the amount and quality of resources they provide.

To join the network, you need to deploy two services:

- **Network node** – a service consisting of two nodes: a **chain node** and an **API node**. This service handles all communication. The **chain node** connects to the blockchain, while the **API node** manages user requests.
- **Inference (ML) node** – a service that performs inference of large language models (LLMs) on GPU(s). You need at least one **ML node** to join the network.

The guide describes the scenario where both services are deployed on the same machine, and each participant has one MLNode. Services are deployed as Docker containers.
To proceed, you'll need access to the private codebase. Please send your GitHub username to [hello@productscience.ai](mailto:hello@productscience.ai).

## Prerequisites
This  section provides guidance on configuring your hardware infrastructure to participate in Gonka Network launch. The goal is to maximize protocol rewards by aligning your deployment with network expectations.

### Supported Model Classes
The protocol currently supports the following model categories:

- **Large Models**: `DeepSeek R1` / `Qwen3-235B` (may not be available at launch but expected in early upgrades)
- **Medium Models**: `Qwen3-32B` / `Gemma-3-27b-it`
- **Small Models**: `Qwen2.5-7B`

### Configuration for Optimal Rewards

To maximize your reward potential, configure each Network Node to serve all three model classes, with a minimum of two MLNodes per class.
This architecture:

- Improves protocol-level redundancy and fault tolerance
- Enhances model-level validation performance
- Aligns with future reward scaling logic

### Proposed Hardware Configuration
To run a service, you need to have a machine with a [supported GPU(s)](/participant/hardware-specifications).  

To optimize rewards and ensure system robustness, we recommend grouping all your hardware into 2-5 Network Nodes. 
**Network Node (example)**
You can replicate this configuration across multiple nodes.  Each should follow this layout:

| Model Class | Model Name                          | MLNodes (min) | Example Hardware                          |
|-------------|-------------------------------------|----------------|--------------------------------------------|
| **Large**   | `DeepSeek R1` / `Qwen3-235B`         | ≥2             | 1× MLNode per 8× H200                      |
| **Medium**  | `Qwen3-32B` / `Gemma-3-27b-it`       | ≥2             | 4× A100 or 2× H100 per MLNode              |
| **Small**   | `Qwen2.5-7B`                         | ≥2             | Flexible (A100, L40, etc.)                 |

This is a reference architecture. You may adjust node count or hardware allocation, but we recommend following the core principle: each node should support multiple MLNodes across all three model tiers.

It also should have:

- 16 CPU cores
- At least 1.5x RAM of the GPU VRAM
- Linux OS
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)
- Nvidia GPUs belonging to generations after Tesla, with a minimum of 16 GB VRAM per GPU

### Ports open for public connections

- 5000 - Tendermint P2P communication
- 26657 - Tendermint RPC (querying the blockchain, broadcasting transactions)
- 8000 - Application service (configurable)

## Download Deployment Files
Clone the repository with the base deploy scripts:

```bash
git clone https://github.com/product-science/inference-ignite.git -b main && \
cd inference-ignite/deploy/join
```

And copy `config` file template:
```
cp config.env.template config.env
```

!!! note "Authentication required" 
    If prompted for a password, use a GitHub personal access token (classic) with `repo` access.

After cloning the repository, you’ll find the following key configuration files:

| File                          | Description                                                                      |
|-------------------------------|----------------------------------------------------------------------------------|
| `config.env`                  | Contains environment variables for the network node                              |
| `docker-compose.yml`          | Docker Compose file to launch the network node                                   |
| `docker-compose.mlnode.yml`   | Docker Compose file to launch the ML node                                   |
| `node-config.json`            | Configuration file used by network node, it describes inference nodes managed by this network node |
| `node-config-qwq.json`       | Configuration file specifically for `Qwen/QwQ-32B` on A100/H100                     |
| `node-config-qwq-4x3090.json` | Optimized config for `QwQ-32B` using 4x3090 setup                                   |
| `node-config-qwq-8x3090.json` | Optimized config for `QwQ-32B` using 8x3090 setup                                   |

Copy and modify the config that best fits your model and GPU layout.

!!! note        
    Right now, the network supports two models: `Qwen/Qwen2.5-7B-Instruct` and `Qwen/QwQ-32B`. Examples for their `config` can be found in `node-config.json` and `node-config-qwq.json` accordingly.

### Pre-download Model Weights to Hugging Face Cache (HF_HOME)
Inference nodes download model weights from Hugging Face.
To ensure the model weights are ready for inference, we recommend downloading them before deployment.
Choose one of the following options:

**Option 1: Local download** 
```bash
export HF_HOME=/path/to/your/hf-cache
```
Create a writable directory (e.g. `~/hf-cache`) and pre-load models if desired:
```bash
huggingface-cli download Qwen/Qwen2.5-7B-Instruct
```
**Option 2: 6Block NFS-mounted cache (for participants on 6Block internal network)**

Mount shared cache:
```bash
sudo mount -t nfs 172.18.114.147:/mnt/toshare /mnt/shared
export HF_HOME=/mnt/shared
```
The path `/mnt/shared` only works in the 6Block testnet with access to the shared NFS.
## Authenticate with Docker Registry
Some Docker images used in this instruction are private. Make sure to authenticate with GitHub Container Registry:
```bash
docker login ghcr.io -u <YOUR_GITHUB_USERNAME>
```
??? note "Required token scopes"
    When creating a new Personal Access Token (Classic) on GitHub, make sure to select the following scopes:
    
    - `repo` → Full control of private repositories
    - `read:packages` → Download packages from GitHub Package Registry

## Setup Your Network Node 
### Edit Your Network Node Configuration

!!! note "config.env"
    ```
    export KEY_NAME=<FILLIN>								# Edit as described below
    export API_PORT=8000									# Edit as described below
    export PUBLIC_URL=http://<HOST>:<PORT>					# Edit as described below
    export P2P_EXTERNAL_ADDRESS=tcp://<HOST>:<PORT>		    # Edit as described below
    export NODE_CONFIG=./node-config.json					# Keep as is
    export HF_HOME=/mnt/shared								# Directory you used for cache
    export SEED_API_URL=http://195.242.13.239:8000			# Keep as is 
    export SEED_NODE_RPC_URL=http://195.242.13.239:26657	# Keep as is
    export SEED_NODE_P2P_URL=tcp://195.242.13.239:26656		# Keep as is
    export DAPI_API__POC_CALLBACK_URL=http://api:9100		# Keep as is
    export DAPI_CHAIN_NODE__URL=http://node:26657			# Keep as is
    export DAPI_CHAIN_NODE__P2P_URL=http://node:26656		# Keep as is
    export RPC_SERVER_URL_1=http://89.169.103.180:26657		# Keep as is
    export RPC_SERVER_URL_2=http://195.242.13.239:26657		# Keep as is
    export PORT=8080                                        # Keep as is
    export INFERENCE_PORT=5050                              # Keep as is
    ```

Which variables to edit:

| Variable               | What to do                                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `KEY_NAME`            | Manually define a unique identifier for your node.                                                                                                                        |
| `API_PORT`           | Set the port where your node will be available on the machine (default is 8000).                                                                                                   |
| `PUBLIC_URL`        | Specify the `Public URL` where your node will be available externally (e.g.: `http://<your-static-ip>:<port>`, mapped to 0.0.0.0:8000).                                                  |
| `P2P_EXTERNAL_ADDRESS` | Specify the `Public URL` where your node will be available externally for P2P connections (e.g.: `http://<your-static-ip>:<port1>`, mapped to 0.0.0.0:5000).                           |
| `HF_HOME`           | Set the path where Hugging Face models will be cached. Set this to a writable local directory (e.g., `~/hf-cache`). If you’re part of the 6Block network, you can use the shared cache at `/mnt/shared`. |

All other variables can be left as is.

## Launch node
The quickstart instruction is designed to run both the network node and the inference node on a single machine (one server setup). 

??? note "Multiple nodes deployment"
    If you are deploying multiple GPU nodes, please refer to the detailed [Multiple nodes deployment guide](https://gonka.ai/participant/multiple-nodes/) for proper setup and configuration. Whether you deploy inference nodes on a single machine or across multiple servers (including across geographical regions), all inference nodes must be connected to the same network node.
    
**1. Pull Docker Images (Containers)**

Make sure you are in the `inference-ignite/deploy/join` folder before running the next commands. 
```bash
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml pull
```

**2. Launch the Services**

Once containers are pulled and model weights are cached, launch the node:

```bash
source config.env && \
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d
```

!!! note "Recommendation"
    Once the services are launched, you can check logs to verify the launch was successful:
    
    ```bash
    docker compose -f docker-compose.yml -f docker-compose.mlnode.yml logs -f
    ```

    If you see the chain node continuously processing block events, then most likely everything is fine.

### Verify the node is active and reachable
After launching the node, wait a few minutes. You should see your node listed at the following URL:
```bahs
http://195.242.13.239:8000/v1/participants
```

Once your node completes the Proof of Work stage (typically within a few hours), visit the following URL to see your node:
```bash
http://195.242.13.239:8000/v1/epochs/current/participants
```

Once your node is running, check your node status using Tendermint RPC endpoint of your node (26657 of `node` container)
```bash
curl http://<PUBLIC_IP>:<PUBLIC_RPC_PORT>/status
```
Locally on machine, you can use private ones
```bash
curl http://0.0.0.0:26657/status
```
Using public IP of genesis node
```bash
curl http://195.242.13.239:26657/status
```

###  Stopping and Cleaning Up Your Node
Make sure you are in `inference-ignite/deploy/join` folder.

To stop all running containers:
```bash
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml down
```
This stops and removes all services defined in the `docker-compose.yml` file without deleting volumes or data unless explicitly configured.

To clean up cache and start fresh, remove the local `.inference` and `.dapi` folders (inference runtime cache and identity):
```bash
rm -rf .inference .dapi
docker volume rm join_tmkms_data
```

(Optional) Clear model weights cache:
```bash
rm -rf $HF_HOME
```

!!! note
    Deleting `$HF_HOME` will require re-downloading large model files from Hugging Face or re-mounting the NFS cache.


**Need help?** Join our [Discord server](https://discord.gg/fvhNxdFMvB) for assistance with general inquiries, technical issues, or security concerns.  
