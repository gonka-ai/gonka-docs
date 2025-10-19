# Multiple nodes

In this setup, you deploy the network node and one or more inference (ML) nodes across multiple servers. To join the network, you need to deploy two services:

- **Network node** – a service consisting of two nodes: a **chain node** and an **API node**. This service handles all communication. The **chain node** connects to the blockchain, while the **API node** manages user requests.
- **Inference (ML) node** – a service that performs inference of large language models (LLMs) on GPU(s). You need at least one **ML node** to join the network.

The guide provides instructions for deploying both services on the same machine as well as on different machines. Services are deployed as Docker containers.

---

## Prerequisites

For the Network node, the approximate hardware requirements are:

- 16 cores CPU (amd64)
- 64+ GB RAM
- 1TB NVe SSD
- 100Mbps minimum netowork connection (1Gbps preffered)

The final requirements will depend on the number of MLNodes connected and their total throughput.

Before proceeding, complete the [Quickstart guide](https://gonka.ai/host/quickstart/) through step 3.4, which includes:

- Hardware and software requirements
- Download deployment files
- Container access authentication
- Key management setup (Account Key and ML Operational Key)
- Host registration and permissions

---

## Starting the network and inference node
This section describes how to deploy a distributed setup with a network node and multiple inference nodes.

!!! note
    Before starting the network node, make sure the `DAPI_API__POC_CALLBACK_URL` variable in your `config.env` file on the network server is set correctly. This value defines the callback URL for the API container, it is passed to all MLNodes so they know where to send Proof-of-Compute (PoC) nonces.

    For multi-node setups, this URL must be reachable from all MLNodes in your cluster. Do not leave the default internal Docker address (http://api:9100), since it will not be accessible from external ML nodes. Instead, replace it with the private network address (or DNS name) of your network node server, for example: `DAPI_API__POC_CALLBACK_URL=http://<NETWORK_NODE_PRIVATE_IP>:9100`. If the network node’s API container has already been started with an incorrect value, update the `config.env` and restart the api container.

    Make sure port `9100` is open and reachable from all inference (ML) nodes in your network.

## Starting the network node

Make sure you have completed the [Quickstart guide](https://gonka.ai/host/quickstart/) through step 3.3 (key management and Host registration) beforehand.

This server becomes the main entry point for external participants. It must be exposed to the public internet (static IP or domain recommended). High network reliability and security are essential. Host this on a stable, high-bandwidth server with robust security.

### Single-Machine Deployment: Network Node + Inference Node
If your network node server **has GPU(s)** and you want to run both the **network node** and an **inference node** on the same machine, execute the following commands in the `gonka/deploy/join` directory:

```                                 
source config.env && \
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d && \
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml logs -f
```

This will start **one network node** and **one inference node** on the same machine.

### Separate Deployment: Network Node Only

If your network node server has **no GPU** and you want your server to run** only the network node** (without inference node), execute the following in the `gonka/deploy/join` directory:

```
source config.env && \ 
docker compose -f docker-compose.yml up -d && \
docker compose -f docker-compose.yml logs -f                                 
```

### The Network Node Status

The network node will start participating in the upcoming Proof of Computation (PoC) once it becomes active. Its weight will be updated based on the work produced by connected inference nodes. If no inference nodes are connected, the node will not participate in the PoC or appear in the list. After the following PoC, the network node will appear in the list of active Hosts (please allow 1–3 hours for the changes to take effect):
```bash
http://node2.gonka.ai:8000/v1/epochs/current/participants
```

If you add more servers with inference nodes (following the instructions below), the updated weight will be reflected in the list of active Hosts after the next PoC.

## Running the inference node on a separate server
On the other servers, we run only the inference node, and for that, follow the instructions below.

### Step 1. Configure the Inference Node

**1.1. Download Deployment Files**

Clone the repository with the base deploy scripts:
```
git clone https://github.com/gonka-ai/gonka.git -b main
```

**1.2. (Optional) Pre-download Model Weights to Hugging Face Cache (HF_HOME)**

Inference nodes download model weights from Hugging Face. To ensure the model weights are ready for inference, we recommend downloading them before deployment. Choose one of the following options.

```
export HF_HOME=/path/to/your/hf-cache
```

Create a writable directory (e.g. `~/hf-cache`) and pre-load models if desired.
Right now, the network supports two models: `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`, `Qwen/Qwen3-32B-FP8`.

```
huggingface-cli download Qwen/Qwen3-32B-FP8
```

**1.3. Ports open for network node connections**
```
5050 - Inference requests (mapped to 5000 of MLNode)
8080 - Management API Port (mapped to 8080 of MLNode)
```

!!! note "Important"
    These ports must not be exposed to the public internet (they should be accessible only within the network node environment).

### Step 2. Launch the Inference Node

On the inference node's server, go to the `cd gonka/deploy/join` directory and execute
```
docker compose -f docker-compose.mlnode.yml up -d && docker compose -f docker-compose.mlnode.yml logs -f
```

This will deploy the inference node and start handling inference and Proof of Compute (PoC) tasks as soon as they are registered with your network node (instructions below).
## Adding (Registering) Inference Nodes with the Network Node

!!! note 
    Usually, it takes the server a couple of minutes to start. However, if your server does not accept requests after 5 minutes, please [contact us](mailto:hello@productscience.ai) for assistance.

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
| `inference_port` | The port where the inference node **accepts inference and training tasks**.    | `5050` (port mapped to `5000` of MLNode's `nginx`)                                                   |
| `poc_port`       | The port which is used for **MLNode management**.   | `8080` (port mapped to `8080` of MLNode's `nginx`)                                                   |
| `max_concurrent` | The **maximum number of concurrent inference requests** this node can handle.   | `500`                                                     |
| `models`         | A **supported models** that the inference node can process.                              | (see below)    |
| `model_name`         | The name of the model.                              | `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`    |
| `model_args`         | vLLM arguments for the inference of the model.                              | `"--tensor-parallel-size","4"`    |

Right now, the network supports two models: `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` and `Qwen/Qwen3-32B-FP8`.

To ensure correct setup and optimal performance, use the arguments that best match your model and GPU layout.

| Model and GPU layout                    | vLLM arguments                                                                           |
|-----------------------------------------|---------------------------------------------------------------------------------------|
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` on 8xH100 or 8xH200           | `"--tensor-parallel-size","4"`                                      |
| `Qwen/Qwen3-32B-FP8` on 1xH100  |                                 |
| `Qwen/Qwen3-32B-FP8` on 8x4090  | `"--tensor-parallel-size","4"`                        |
| `Qwen/Qwen3-32B-FP8` on 8x3080  | `"--tensor-parallel-size","4","--pipeline-parallel-size","2"`                       |

!!! note "vLLM performance tuning reference"
    For detailed guidance on selecting optimal deployment configurations and vLLM parameters tailored to your GPU hardware, refer to the [Benchmark to Choose Optimal Deployment Config for LLMs](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/) guide.

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
