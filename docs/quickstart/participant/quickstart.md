# Setting Up your chain 

**Participants** (**hardware providers** or **nodes**) contribute computational resources to the network and are rewarded based on the amount and quality of resources they provide.

To join the network, you need to deploy two services:

- **Network node** – a service consisting of two nodes: a **chain node** and an **API node**. This service handles all communication. The **chain node** connects to the blockchain, while the **API node** manages user requests.
- **Inference (ML) node** – a service that performs inference of large language models (LLMs) on GPU(s). You need at least one **ML node** to join the network.

The guide describes the scenario where both services are deployed on the same machine, and each participant has one MLNode. Services are deployed as Docker containers.

## Prerequisites
### Supported LLMs and recommended server configurations

In our network, we aim to support open-source LLMs that rank highly on Chat Arena. As of March 2025, this includes `DeepSeek-R1`, `DeepSeek-V3`, `Gemma-3-27B`, `QwQ-32B`, `Llama-3-70B`, `Llama-3-405B`. Each ML node should have one or more GPUs with enough VRAM to run inference independently. Below are the recommended configurations per model size:

- **80GB+ VRAM** for `Gemma-3-27B` and `QwQ-32B`;
- **160GB+ VRAM** for `Llama-3-70B`;
- **640GB+ VRAM** for `DeepSeek-R1`, `DeepSeek-V3`, `Llama-3-405B`.

| **Model (by demand)** | **8×H100** | **8×A100** | **2×H100** | **2×A100** | **1×H100\*** | **1×A100\*** | **8×3090** | **4×3090** | **1×3090\*\*** |
|------------------------|------------|------------|------------|------------|--------------|--------------|------------|------------|----------------|
| **DeepSeek-R1**        | ✅         | ✅         |            |            |              |              |            |            |                |
| **Gemma-3-27B**        |🆗           |🆗           |🆗           |🆗           | ✅            | ✅            |🆗          | ✅          |                |
| **DeepSeek-V3**        | ✅         | ✅         |            |            |              |              |            |            |                |
| **QwQ-32B**            |🆗           |🆗           |🆗           |🆗           | ✅            | ✅            |🆗          | ✅          |                |
| **Llama-3-405B**       | ✅         | ✅         |            |            |              |              |            |            |                |
| **Llama-3-70B**        |🆗           |🆗           | ✅         | ✅         |🆗             |🆗             | ✅         |            |                |
| **Qwen2.5-7B-Instruct**            |🆗           |🆗           |🆗           |🆗           |🆗             |🆗             |🆗           |🆗           | ✅              |

- ✅ — Fully supported and efficient  
- 🆗 — Supported, but not efficient
- If you have multiple H100 or A100 GPUs, consider grouping 2 or 8 of them into a single node to support higher-demand models.
- If you have multiple 3090 GPUs, consider grouping 4 or 8 of them into a single node for better performance.

To run a service, you need to have a machine with a [supported GPU(s)](/hardware-specifications).  

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

## Download Configuration Files
Clone the repository with base deploy scripts:

```bash
git clone https://github.com/product-science/pivot-deploy.git -b main && \
cd pivot-deploy/join
```

!!! note "Authentication required" 
    If prompted for a password, use a GitHub personal access token (classic) with `repo` access.

After cloning the repository, you’ll find the following key configuration files:

- `config.env` - Contains environment variables for the network node
- `docker-compose.yml` - Docker Compose file to launch the network node
- `node-config.json` - Configuration file for the inference node which will be user by network node.
- `node-config-qwq.json` - Configuration file specifically for Qwen/QwQ-32B on A100/H100
- `node-config-qwq-4x3090.json` - Optimized config for QwQ-32B using 4x3090 setup
- `node-config-qwq-8x3090.json` - Optimized config for QwQ-32B using 8x3090 setup

!!! note
    Tip: Copy and modify the config that best fits your model and GPU layout.
        
    Right now, the network supports two models: `Qwen/Qwen2.5-7B-Instruct` and `Qwen/QwQ-32B`. Examples for their `config` can be found in `node-config.json` and `node-config-qwq.json` accordingly.

### Prepare Model Weights & HF_HOME
Inference nodes download model weights from Hugging Face.
To avoid repeated downloads or failures due to rate limits, use a local cache directory.
Choose one of the following options:

**Option 1: Local download** 
```bash
export HF_HOME=/path/to/your/hf-cache
```
Create a writable directory (e.g. `~/hf-cache`) and pre-load models if desired:
```bash
huggingface-cli download Qwen/Qwen2.5-7B-Instruct --cache-dir $HF_HOME
```
**Option 2: 6Block NFS-mounted cache (for participants on 6Block internal network)**

Mount shared cache:
```bash
sudo mount -t nfs 172.18.114.147:/mnt/toshare /mnt/shared
export HF_HOME=/mnt/shared
```
The path `/mnt/shared` only works in the 6Block testnet with access to the shared NFS.
## Authenticate with Docker Registry
Some images are private. Authenticate with GitHub Container Registry:
```bash
echo $GH_TOKEN | docker login ghcr.io -u <your_github_username> --password-stdin
```
## Setup Your Node 
### Edit Your Node Configuration

Edit `config.env` file and set your node name, public URL and other parameters.

- `KEY_NAME` -  manually defined unique identifier for your node.
- `PORT` - port where your node will be available at the machine (default is 8000)
- `PUBLIC_URL` - public URL where your node will be available externally (e.g.: `http://<your-static-ip>:<port>`, mapped to 0.0.0.0:8000)
- `P2P_EXTERNAL_ADDRESS` - public URL where your node will be available externally for P2P connections (e.g.: `http://<your-static-ip>:<port1>`, mapped to 0.0.0.0:5000)
- `HF_HOME` – the path where Hugging Face models will be cached. Set this to a writable local directory (e.g., `~/hf-cache`). If you’re part of the 6Block network, you can use the shared cache at `/mnt/shared`.

Others are pre-filled and usually don’t require modification.
```bash
PORT=8000
SEED_API_URL=http://195.242.13.239:8000
SEED_NODE_RPC_URL=http://195.242.13.239:26657
SEED_NODE_P2P_URL=tcp://195.242.13.239:26656   
DAPI_API_RPC_CALLBACK_URL=http://api:8000
DAPI_CHAIN_NODE_URL=http://node:26657
DAPI_CHAIN_NODE_P2P_URL=http://node:26656
RPC_SERVER_URL_1=http://89.169.103.180:26657
RPC_SERVER_URL_2=http://195.242.13.239:26657
```

## Preload and Setup 

**1. Pull Docker Images (Containers)**
```bash
docker compose -f docker-compose.yml pull
```

Replace <VERSION> with the correct version tag from your deployment configuration.

**2.  Pull Model Weights**
```bash
export HF_HOME=~/hf-cache
huggingface-cli download Qwen/Qwen2.5-7B-Instruct --cache-dir $HF_HOME
```

Use `HF_HOME`, not `--local-dir`. It must match at runtime.

**3. Launch the Services**

Once containers are pulled and model weights are cached, you can launch the node:

```bash
source config.env && \
docker compose -f docker-compose.yml up -d && \
docker compose -f docker-compose.yml logs -f
```

## To verify the node is active and reachable**

**Check API health**

Visit this URL in your browser:
```bash
http://195.242.13.239:8000/v1/epochs/current/participants
```

**Check Tendermint RPC** 

Use:
```bash
http://<your-public-ip>:<rpc-port> - <rpc-port> - public port mapped to 26657 of your node
```
You should receive a JSON response with node info, chain ID, and sync status.

Once logs look stable and `/health` returns `{"status":"ok"}`, your node is running.
Node successfully launched and connected to the network!

##  Stopping and Cleaning Up Your Node

To stop all running containers:
```bash
docker compose -f docker-compose.yml down
```
This stops and removes all services defined in the `docker-compose.yml` file without deleting volumes or data unless explicitly configured.

To clean up cache and start fresh, remove the local `.inference` folder (inference runtime cache and identity):
```bash
rm -rf .inference
```

(Optional) Clear model weights cache:
```bash
rm -rf $HF_HOME
```

!!! note
    Deleting `$HF_HOME` will require re-downloading large model files from Hugging Face or re-mounting the NFS cache.

**Full Reset Workflow (if you want to rejoin as a fresh node)**
```bash
docker compose -f docker-compose.yml down
rm -rf .inference
# Optional: rm -rf $HF_HOME
```

**Need help?** Join our [Discord server](https://discord.gg/fvhNxdFMvB) for assistance with general inquiries, technical issues, or security concerns.  
