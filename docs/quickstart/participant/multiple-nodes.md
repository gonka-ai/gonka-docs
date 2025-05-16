# Multiple nodes

In this setup, you deploy the network node and one or more inference (ML) nodes across multiple servers. To join the network, you need to deploy two services:

- **Network node** – a service consisting of two nodes: a **chain node** and an **API node**. This service handles all communication. The **chain node** connects to the blockchain, while the **API node** manages user requests.
- **Inference (ML) node** – a service that performs inference of large language models (LLMs) on GPU(s). You need at least one **ML node** to join the network.

The guide provides instructions for deploying both services on the same machine as well as on different machines. Services are deployed as Docker containers.

---

## Prerequisites

Before proceeding, read the following sections:

- [Quickstart - Prerequisites](https://testnet.productscience.ai/quickstart/participant/quickstart/#prerequisites)
- [Download Deployment Files](https://testnet.productscience.ai/quickstart/participant/quickstart/#download-deployment-files)
- [Container Access](https://testnet.productscience.ai/quickstart/participant/quickstart/#authenticate-with-docker-registry)

---

## Starting the network and inference node
This section describes how to deploy a distributed setup with a network node and multiple inference nodes.

!!! note "Recommendation"
    All inference nodes should be registered with the same network node, regardless of their geographic location. Whether the clusters are deployed in different regions or across multiple data centers, each inference node should always connect back to the same network node. 

## Starting the network node

Make sure you have completed the [Quickstart Prerequisites](https://testnet.productscience.ai/quickstart/participant/quickstart/#prerequisites) beforehand.

This server becomes the main entry point for external participants. It must be exposed to the public internet (static IP or domain recommended). High network reliability and security are essential. Host this on a stable, high-bandwidth server with robust security.

### Single-Machine Deployment: Network Node + Inference Node
If your network node server **has GPU(s)** and you want to run both the **network node** and an **inference node** on the same machine, execute the following commands in the `pivot-deploy/join` directory:

```                                 
source config.env && \
docker compose -f docker-compose.yml up -d && \
docker compose -f docker-compose.yml logs -f
```

This will start **one network node** and **one inference node** on the same machine.

### Separate Deployment: Network Node Only

If your network node server has **no GPU** and you want your server to run** only the network node** (without inference node), execute the following in the `pivot-deploy/join` directory:

```
source config.env && \ 
docker compose -f docker-compose.yml up -d tmkms node api \ &&
docker compose -f docker-compose.yml logs -f                                 
```

!!! note
    Address set as `DAPI_API__POC_CALLBACK_URL` for network node, should be accessible from ALL inference nodes (9100 port of `api` container by default)

### The network node status in the network

The network node will start participating in the upcoming Proof of Computation (PoC) once it becomes active. Its weight will be updated based on the work produced by connected inference nodes. If no inference nodes are connected, the node will not participate in the PoC or appear in the list. After the following PoC, the network node will appear in the list of active participant (please allow 1–3 hours for the changes to take effect):
```bash
http://195.242.13.239:8000/v1/epochs/current/participants
```

If you add more servers with inference nodes (following the instructions below), the updated weight will be reflected in the list of active participants after the next PoC.


## Running the inference node on a separate server
On the other servers, we run only the inference node, and for that, follow the instructions below.

### Step 1. Configure the Inference Node

**1.1. Download Deployment Files**

Clone the repository with the base deploy scripts:
```
git clone https://github.com/product-science/pivot-deploy.git -b main
```
!!! note "Authentication required" 
    If prompted for a password, use a GitHub personal access token (classic) with `repo` access.

**1.2. (Optional) Pre-download Model Weights to Hugging Face Cache (HF_HOME)**

Inference nodes download model weights from Hugging Face. To ensure the model weights are ready for inference, we recommend downloading them before deployment. Choose one of the following options.

**Option 1: Local download**

```
export HF_HOME=/path/to/your/hf-cache
```

Create a writable directory (e.g. `~/hf-cache`) and pre-load models if desired.
Right now, the network supports two models: `Qwen/Qwen2.5-7B-Instruct` and `Qwen/QwQ-32B`.

```
huggingface-cli download Qwen/Qwen2.5-7B-Instruct --cache-dir $HF_HOME
```

**Option 2: 6Block NFS-mounted cache (for participants on 6Block internal network)**

Mount shared cache:
```
sudo mount -t nfs 172.18.114.147:/mnt/toshare /mnt/shared
export HF_HOME=/mnt/shared
```
The path `/mnt/shared` only works in the 6Block testnet with access to the shared NFS.

**1.3. Authenticate with Docker Registry**

Some Docker images used in this instruction are private. Make sure to authenticate with GitHub Container Registry
```
docker login ghcr.io -u <YOUR_GITHUB_USERNAME>
```

**1.4. Ports open for network node connections**
```
5000 - Inference requests
8000 - Management API Port
```

!!! note "Important"
    These ports must not be exposed to the public internet (they should be accessible only within the network node environment).

### Step 2. Launch the Inference Node

On the inference node's server, go to the `cd pivot-deploy/inference` directory and execute
```
docker compose up -d && docker compose logs -f
```

This will deploy the inference node and start handling inference and Proof of Compute (PoC) tasks as soon as they are registered with your network node (instructions below).
## Adding (Registering) Inference Nodes with the Network Node

!!! note 
    Usually, it takes the server a couple of minutes to start. However, if your server does not accept requests after 5 minutes, please [contact us](hello@productscience.ai) for assistance.

You must register each inference node with the network node to make it operational. 
The recommended method is via the Admin API for dynamic management, which is accessible from the terminal of your network node server.
```
curl -X POST http://localhost:9200/admin/v1/nodes \
     -H "Content-Type: application/json" \
     -d '{
       "id": "<unique_id>",
       "host": "<your_inference_node_static_ip>",
       "inference_port": <inference_port>,
       "poc_port": <poc_port>,
       "max_concurrent": <max_concurrent>,
       "models": {
         "<model_name>": {
           "args": [
              <model_args>
           ]
         }
       }
     }'
```

**Parameter descriptions**

| Parameter         | Description                                                                                      | Examples                                            |
|-------------------|--------------------------------------------------------------------------------------------------|-----------------------------------------------------------|
| `id`             | A **unique identifier** for your inference node.                                                | `node1`                                                   |
| `host`           | The **static IP** of your inference node or the **Docker container name** if running in the same Docker network. | `http://<mlnode_ip>`                                               |
| `inference_port` | The port where the inference node **accepts inference and training tasks**.    | `5000`                                                    |
| `poc_port`       | The port which is used for **MLNode management**.   | `8000`                                                    |
| `max_concurrent` | The **maximum number of concurrent inference requests** this node can handle.   | `500`                                                     |
| `models`         | A **supported models** that the inference node can process.                              | (see below)    |
| `model_name`         | - The name of the model.                              | `Qwen/QwQ-32B`    |
| `model_args`         | - vLLM arguments for the inference of the model.                              | `"--quantization","fp8","--kv-cache-dtype","fp8"`    |

Right now, the network supports two models: `Qwen/Qwen2.5-7B-Instruct` and `Qwen/QwQ-32B`. 

To ensure correct setup and optimal performance, use the arguments from `node-config*.json` files in the `pivot-deploy/join` [folder](https://github.com/product-science/pivot-deploy/tree/45debe79f2c9a92bf5a530ae1ad50e780c6ec8c9/join) that best matches your model and GPU layout.

| Config File                   | Description                                                                           |
|-------------------------------|---------------------------------------------------------------------------------------|
| `node-config.json`            | Optimized config for `Qwen/Qwen2.5-7B-Instruct`.                                      |
| `node-config-qwq.json`        | Optimized config for `Qwen/QwQ-32B` on A100/H100 GPUs.                               |
| `node-config-qwq-4x3090.json`| Optimized config for `Qwen/QwQ-32B` using a 4x3090 GPU setup.                        |
| `node-config-qwq-8x3090.json`| Optimized config for `Qwen/QwQ-32B` using an 8x3090 GPU setup.                       |

If the node is successfully added, the response will return the **configuration** of the newly added inference node.

### Retrieving All Inference Nodes
To get a list of **all registered inference nodes** in your network node, use:
```bash
curl -X GET http://localhost:9200/admin/v1/nodes
```
This will return a JSON array containing all configured inference nodes.

### Removing an inference node
Being connected to your **network node** server, use the following Admin API request to remove an inference node dynamically without restarting:
```bash
curl -X DELETE "http://localhost:9200/admin/v1/nodes/{id}" -H "Content-Type: application/json"
```
Where `id` is the identifier of the inference node as specified in the request when registering the inference node.  If successful, the response will be **true.**
