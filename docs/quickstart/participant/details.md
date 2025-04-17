# Introduction

**Participants** (**hardware providers** or **nodes**) contribute computational resources to the network and are rewarded based on the amount and quality of resources they provide.

To join the network, you need to deploy two services:

- **Network node** – a service consisting of two nodes: a **chain node** and an **API node**. This service handles all communication. The **chain node** connects to the blockchain, while the **API node** manages user requests.
- **Inference (ML) node** – a service that performs inference of large language models (LLMs) on GPU(s). You need at least one **ML node** to join the network.

The guide provides instructions for deploying both services on the same machine as well as on different machines. Services are deployed as Docker containers.

---

## Prerequisites

Before proceeding, read the following sections:

- [Quickstart - Prerequisites](https://testnet.productscience.ai/quickstart/participant/quickstart/#prerequisites)
- [Container Access](https://testnet.productscience.ai/quickstart/participant/quickstart/#container-access)
- [Download Configuration Files](https://testnet.productscience.ai/quickstart/participant/quickstart/#download-configuration-files)

---

## Configuring the network node

Edit the `pivot-deploy/join/config.env` file and set your node name, public URL, and other parameters.

### Required parameters

- `KEY_NAME` – The name of your node. It must be unique.
- `PUBLIC_SERVER_PORT` – The port where your node will be available on the machine (default is 8000) for the whole world. 
- `ML_SERVER_PORT` - The port where your node would communicate with the inference node during PoC (proof of compute). The port must be open only to the internal network of servers where your nodes are deployed; otherwise, the Inference nodes will not be able to send the generated proof. 
- `ADMIN_SERVER_PORT` - The port where your admin API would be available. It is recommended to keep this port mapped only on your host machine, because using that port you can administrate your cluster. 
- `PUBLIC_URL` – The public URL where your node will be accessible (e.g., http://<your-static-ip>:<public_server_port>).
- `DAPI_API__POC_CALLBACK_URL` – The API node URL where your ML nodes will send their Proofs of Compute.
   - If this parameter is set incorrectly, even if your ML nodes complete computations on time, they will not be recognized.
   - It is recommended to set this value as:

```
http://<your-static-ip>:<api-node-ml-server-port-mapped-on-your-host-machine>  
```
_This setup allows you to dynamically add inference nodes deployed on other servers to your current network node without needing to restart the network node._

!!! note "Optional parameters (Seed node configuration)"
    - `SEED_API_URL` – public URL of the seed node.
    - `SEED_NODE_RPC_URL` – RPC URL of the seed node.
    - `SEED_NODE_P2P_URL` – P2P URL of the seed node.

### Speeding up synchronization
Synchronizing with the network can take a long time, so we recommend using snapshots for faster synchronization.

#### **Steps to enable snapshot synchronization**
On the machine where you plan to deploy your network node, follow these steps:

**Step 1.** Navigate to the `pivot-deploy/join` folder

```
cd pivot-deploy/join
```

**Step 2.** Add the following variables to the `config.env` file

— Enable Snapshot Synchronization

```
export SYNC_WITH_SNAPSHOTS=true
```

_This tells the network node to attempt synchronization with the blockchain using snapshots._

— Set RPC Servers for Snapshots

```
export RPC_SERVER_URL_1=http://<rpc-server-static-ip>:<rpc_port>
export RPC_SERVER_URL_2=http://<another_rpc-server-static-ip>:<rpc_port>
```

_These are the RPC servers from which your node will download snapshots._
 
!!! note
    To be updated with actual RPC server addresses once the blockchain is launched.

— Set a Trusted Block Period (Optional)

```
export TRUSTED_BLOCK_PERIOD=<your_value>
```

_This defines the number of blocks between the snapshot block height and the current block height to ensure the snapshot's state is final and cannot be altered._

!!! note "Example"
    - If the current block height is `1000` and `TRUSTED_BLOCK_PERIOD=100`, your node will only accept snapshots made at block `880` or earlier.
    - Snapshots from blocks `990` and `950` would be considered too recent to be trusted.
    - **Default Value**: `TRUSTED_BLOCK_PERIOD=2000`. It is **not recommended** to set this value below `1000` blocks.
    
### Adding and removing inference nodes
Ensure your **network node** is correctly configured by following the setup guide above.

#### **Methods to add or remove inference nodes:**
1. **Manually** – Edit the `pivot-deploy/join/node-config.json` file **before starting** your network node.
2. **Using the API (Preferred)** – This allows dynamic updates **without restarting** the network node.

#### **Inference node configuration**
An inference node is defined as follows in `node-config.json`:

```
{
    "id": "node1",
    "host": "inference-node",
    "inference_port": 5000,
    "poc_port": 8080,
    "max_concurrent": 500,
     "models": {
  "unsloth/llama-3-8b-Instruct": {
"args": [
  "--quantization",
  "fp8"
]
}
},
}
```

**Configuration parameters**
                                 
- `id` – A unique identifier for your inference node.
- `host` – The **static IP** of your inference node or the **Docker container name** if the network node and inference node run on the same machine in a shared Docker network.
- `inference_port` – The port where the inference node **accepts inference and training tasks** (default: `5000`).
- `poc_port` – The port where the inference node **handles Proof of Compute (PoC)** tasks (default:8080).
- `max_concurrent` – The **maximum number of concurrent** inference requests this node can handle.
- `models` – A map of supported models for this inference node with their arguments.

### **Adding or removing an inference node manually**
- To **add** an inference node, insert its configuration into `pivot-deploy/join/node-config.json`.
- To **remove** an inference node, delete its configuration from the file.
- **Restart** the network node for changes to take effect.
                                 
### Using API for dynamic inference node management (Preferred Method)

**Removing an inference node**

Being connected to your server machine, use the following API request to remove an inference node dynamically without restarting:

```
curl -X DELETE "http://localhost:<network_node_admin_server_port>/admin/v1/nodes/{id}" -H "Content-Type: application/json"
```

Where `id` is the identifier of the inference node as specified in `node-config.json`. If successful, the response will be **true**.

**Adding an inference node**

To dynamically add an inference node without restarting the network node, use the following API request:

```
curl -X POST http://36.189.234.237:19010/v1/nodes \
     -H "Content-Type: application/json" \
     -d '{
       "host": "<your_inference_node_static_ip>",
       "inference_port": <inference_port>,
       "poc_port": <poc_port>,
       "models": [<model_1>],
       "id": "<unique_id>",
       "max_concurrent": <max_concurrent>
     }'
```

**Parameter descriptions**
                                 
- `id` – A **unique identifier** for your inference node.
- `host` – The **static IP** of your inference node or the **Docker container name** if running in the same Docker network.
- `inference_port` – The port where the inference node **accepts inference and training tasks** (default: `5000`).
- `poc_port` – The port where the inference node **handles Proof of Compute (PoC) tasks** (default: `8080`).
- `max_concurrent` – The **maximum number of concurrent inference requests** this node can handle.
- `models` – A list of **supported models** that the inference node can process.

This request follows the same structure as manually editing the `node-config.json` file. If the node is successfully added, the response will return the **configuration** of the newly added inference node.

#### **Retrieving All Inference Nodes**
                                 
To get a list of **all registered inference nodes** in your network node, use:

```
curl -X GET http://<your_static_ip>:<api-node-port>/v1/nodes
```

This will return a JSON array containing all configured inference nodes.

## **Starting the network and inference node**
Ensure your configuration is correctly set up by following the instructions above.

---

### Starting on a single machine
To run both the **network node** and **inference node** on the same machine, execute the following commands in the `pivot-deploy/join` directory:

```                                 
source config.env && \
docker compose -f docker-compose-cloud-join.yml up -d && \
docker compose -f docker-compose-cloud-join.yml logs -f
```

This will start **one network node** and **one inference node** on the same machine.

### Starting on separate machines
**Running only the network node (without inference nodes)**

If you want your server to run only the network node, execute the following in the `pivot-deploy/join` directory:

```
source config.env && \ 
docker compose -f docker-compose-cloud-join.yml up -d node api \ && docker compose -f docker-compose-cloud-join.yml logs -f                                 
```

**Running the inference node on a separate server**

On the inference node's server, go to the `pivot-deploy/inference` directory and execute:

```
docker compose up -d && docker compose logs -f
```                                 
