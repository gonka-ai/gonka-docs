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
| **Gemma-3-27B**        |            |            |            |            | ✅            | ✅            |           | ✅          |                |
| **DeepSeek-V3**        | ✅         | ✅         |            |            |              |              |            |            |                |
| **QwQ-32B**            |            |            |            |            | ✅            | ✅            |           | ✅          |                |
| **Llama-3-405B**       | ✅         | ✅         |            |            |              |              |            |            |                |
| **Llama-3-70B**        |            |            | ✅         | ✅         |              |              | ✅         |            |                |
| **Qwen-7B**            |            |            |            |            |              |              |            |            | ✅              |

_*If you have multiple H100 or A100 GPUs, consider grouping 2 or 8 of them into a single node to support higher-demand models._

_**If you have multiple 3090 GPUs, consider grouping 4 or 8 of them into a single node for better performance._

To run a service, you need to have a machine with a [supported GPU(s)](/hardware-specifications).  

It also should have:

- 16 CPU cores
- At least 1.5x RAM of the GPU VRAM
- Linux OS
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)

### Ports open for public connections

- 26656 - Tendermint P2P communication
- 26657 - Tendermint RPC (querying the blockchain, broadcasting transactions)
- 8000 - Application service (configurable)

## Download Configuration Files

Clone the repository with base deploy scripts:

```bash
git clone https://github.com/product-science/pivot-deploy.git -b main && \
cd pivot-deploy/join
```

- `config.env` - contains environment variables for the network node
- `docker-compose.yml` - a docker compose file to launch the network node
- `node-config.json` - a configuration file for the inference node which will be user by network node. 
Right now the network supports to models: `Qwen/Qwen2.5-7B-Instruct` and `Qwen/QwQ-32B`. Examples for their config can be found in `node-config.json` and `node-config-qwq.json` accordingly.

## Setup Your Node 

Edit `config.env` file and set your node name, public URL and other parameters.

- `KEY_NAME` - name of your node. It must be unique
- `PORT` - port where your node will be available at the machine (default is 8000)
- `PUBLIC_URL` - public URL where your node will be available externally (e.g.: `http://<your-static-ip>:<port>`, mapped to 0.0.0.0:8000)
- `P2P_EXTERNAL_ADDRESS` - public URL where your node will be available externally for P2P connections (e.g.: `http://<your-static-ip>:<port1>`, mapped to 0.0.0.0:26656)

The next variables configure the seed node and are optional to modify:

- `SEED_API_URL` - URL of the seed node  
- `SEED_NODE_RPC_URL` - RPC URL of the seed node  
- `SEED_NODE_P2P_URL` - P2P URL of the seed node  

!!! note "Seed Nodes"
    Here are the current seed nodes for the testnet:  
    
    **Genesis:**

    - `SEED_NODE_RPC_URL=http://195.242.10.196:26657` 
    - `SEED_NODE_P2P_URL=tcp://195.242.10.196:26656` 
    - `SEED_PUBLIC_URL=http://195.242.10.196:8000`

## Setup Model Cache

During model deployment, MLNode automatically downloads model weights from Hugging Face.
To specify a custom Hugging Face cache directory, set the `HF_HOME` environment variable accordingly.

If MLNode cannot access Hugging Face directly, 
you can preload the models using the [`huggingface-cli`](https://huggingface.co/docs/huggingface_hub/en/guides/cli) 
on another machine and then transfer the cache to the server running MLNode. 

When doing so, ensure you set the same `HF_HOME` on both machines. 
Do not rely on the `--local-dir` parameter; instead, use `HF_HOME` so the directory structure matches exactly.   
On the MLNode server, `HF_HOME` should point to the parent directory of the `hub` folder created by `huggingface-cli`.


!!! node "6Block Network: Models Cache"
    A pre-downloaded Hugging Face cache for Qwen/Qwen2.5-7B-Instruct is available on the 6Block Network via the NFS directory at `172.18.114.147:/mnt/toshare`.

    To use this cache, mount the remote directory to your local system using:
    ```
    sudo mount -t nfs 172.18.114.147:/mnt/toshare /mnt/shared
    ``` 
    Then, set the `HF_HOME` environment variable to point to this location:
    ```
    export HF_HOME=/mnt/shared
    ```

!!! note
    If you are using an inference node that is not on the same machine, you need to edit the `node-config.json` file and specify the correct URL of the inference node. 

    Also, you need to remove the block from `docker-compose-cloud.yml` file which starts inference node:
    ```yaml
    # inference-node:
    #   image: gcr.io/decentralized-ai/mlnode:$VERSION
    #   ...
    ```

## Launch Your Node

Run the following command to launch your node:

```bash
source config.env && \
docker compose -f docker-compose.yml up -d && \
docker compose -f docker-compose.yml logs -f
```

If you need to restart node as new participant, remove `.inference` directory.

**Need help?** Join our [Discord server](https://discord.gg/fvhNxdFMvB) for assistance with general inquiries, technical issues, or security concerns.  
