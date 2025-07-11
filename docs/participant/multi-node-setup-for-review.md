# Multi-Node Setup
This guide extends [Quickstart](https://gonka.ai/participant/quickstart/) and shows how to deploy a Network Node (no GPU) and one or more Inference Nodes on separate GPU servers.

Supported scenarios:

1. You are starting fresh and want to deploy a multi-machine setup from the beginning (start from the beginning of the guide).
2. You already launched [Quickstart](https://gonka.ai/participant/quickstart/) and now want to add more Inference Nodes (go to ["Deploy and register Inference Nodes on a Separate Machine"](https://gonka.ai/participant/multi-node-setup-for-review/#deploy-and-register-inference-node-s-on-a-separate-machine)).

## Prerequisites
This guide assumes the following are already installed on each machine:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)
- Linux OS

See the Prerequisites and Supported LLMs page for full details on:

- Recommended GPU configurations by model
- Supported GPU types (A100, H100, 3090, etc.)
- Required CPU and RAM

This is essential reading before deploying your node.

!!! note "Recommendation"
    All inference nodes should be registered with the same network node, regardless of their geographic location. Whether the clusters are deployed in different regions or across multiple data centers, each inference node should always connect back to the same network node. 

## Deploy the Network Node (no GPU)

This machine becomes your main entry point to the network:

- It should be publicly accessible, secure, and stable.
- Does not require GPUs
- Must have the following ports open
    - 5000 - Tendermint P2P communication
    - 26657 - Tendermint RPC (querying the blockchain, broadcasting transactions)
    - 8000 - Application service (configurable)

1.Clone and configure

```
git clone https://github.com/product-science/pivot-deploy.git -b main
cd pivot-deploy/join
cp config.env.template config.env
```

!!! note "Authentication required"
    If prompted for a password, use a GitHub personal access token (classic) with repo access.

After cloning the repository, you’ll find the following key configuration files:

| File                          | Description                                                                      |
|-------------------------------|----------------------------------------------------------------------------------|
| `config.env`                  | Contains environment variables for the network node                              |
| `docker-compose.yml`          | Docker Compose file to launch the network node                                   |
| `node-config.json`            | Configuration file used by network node, it describes inference nodes managed by this network node |
| `node-config-qwq.json`       | Configuration file specifically for `Qwen/QwQ-32B` on A100/H100                     |
| `node-config-qwq-4x3090.json` | Optimized config for `QwQ-32B` using 4x3090 setup                                   |
| `node-config-qwq-8x3090.json` | Optimized config for `QwQ-32B` using 8x3090 setup                                   |

2.Modify only the variables listed below in your `config.env` file. Leave all other parameters unchanged, as their default values are already correctly set.

| Variable        | What to do                                          | Example                                                  |
|------------------------|-----------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| `KEY_NAME`       | Manually define a unique identifier for your node.                      | Any_letters_numbers_underscores_combination                               |
| `API_PORT`       | Set the port where your node will be available on the machine                | The default is `8000`                                            |
| `PUBLIC_URL`      | Specify the Public URL where your node will be available externally             | `http://<your-static-ip>:<port>` <br> Mapped to 0.0.0.0:8000                          |
| `P2P_EXTERNAL_ADDRESS` | Specify the Public URL where your node will be available externally for P2P connections   | `http://<your-static-ip>:<port1>` <br> Mapped to 0.0.0.0:5000                          |
| `HF_HOME`       | Set the path where Hugging Face models will be cached. | Set this to a writable local directory (e.g., `~/hf-cache`). <br> If you’re part of the 6Block network, use `/mnt/shared`. |

3.Launch only the Network Node services
```
docker compose -f docker-compose.yml up -d tmkms node api
```

4.Check logs
```
docker compose -f docker-compose.yml logs -f
```

!!! note
    Address set as `DAPI_API__POC_CALLBACK_URL` for network node, should be accessible from. ALL inference nodes (`9100` port of api container by default).

5.(Optional) Check Network Node status. The Network Node will start participating in the upcoming Proof of Computation once it becomes active (please allow 1–3 hours for the changes to take effect). Its weight will be updated based on the work produced by connected Inference Nodes. If no Inference Nodes are connected, the node will not participate in the Proof of Compute and will not appear in the list:
```
http://195.242.13.239:8000/v1/epochs/current/participants
```
If you add more servers with Inference Nodes (following the instructions below), the updated weight will be reflected in the list of active participants after the next Proof of Compute.

## Deploy and register Inference Nodes on a Separate Machine
Each Inference Node is a GPU-based service that connects back to the Network Node.
### Deploy
1. Clone the repo (on each new Inference Node machine).
```
git clone https://github.com/product-science/pivot-deploy.git -b main
cd pivot-deploy/inference
```
2. (Optional but recommended). Pre-download model weights. Choose one of the following options.
!!! note "Supported models"
    Right now, the network supports two models: `Qwen/Qwen2.5-7B-Instruct` and `Qwen/QwQ-32B`.
   
=== "Option 1: Local download"

    ```
    export HF_HOME=/path/to/your/hf-cache
    mkdir -p $HF_HOME
    huggingface-cli download Qwen/Qwen2.5-7B-Instruct --cache-dir $HF_HOME
    ```

=== "Option 2: 6Block NFS-mounted cache (for participants on 6Block internal network)"
    Mount shared cache:
    ```
    sudo mount -t nfs 172.18.114.147:/mnt/toshare /mnt/shared
    export HF_HOME=/mnt/shared
    ```
    The path `/mnt/shared` only works in the 6Block testnet with access to the shared NFS.


3.Some Docker images used in this instruction are private. Make sure to authenticate with GitHub Container Registry:
```
docker login ghcr.io -u <YOUR_GITHUB_USERNAME>
```

4.Launch Inference Node:
```
docker compose up -d && docker compose logs -f
```

!!! note
    Open only these ports to your Network Node:
    
    - 5000 - Inference requests
    - 8000 - Management API Port
    These **must not** be publicly exposed.

This will deploy the inference node and start handling inference and Proof of Compute tasks as soon as they are registered with your network node (instructions below).

### Register

!!! note
    Usually, it takes the server a couple of minutes to start. However, if your server does not accept requests after 5 minutes, please [contact us](mail to: hello@productscience.ai) for assistance.

1.Register each Inference Node with the Network Node to make it operational. The recommended method is via the Admin API for dynamic management, which is accessible from the terminal of your Network Node server.
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

??? note "Parameter descriptions"
      | Parameter    | Description                                                        | Examples                              |
      |------------------|----------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------|
      | `id`       | A unique identifier for your inference node.                                        | node1                               |
      | `host`      | The static IP of your inference node or the Docker container name if running in the same Docker network.          | http://<mlnode_ip>                         |
      | `inference_port` | The port where the inference node accepts inference and training tasks.                          | 5000                                |
      | `poc_port`    | The port which is used for MLNode management.                                       | 8000                                |
      | `max_concurrent` | The maximum number of concurrent inference requests this node can handle.                         | 500                                |
      | `models`     | A supported models that the Inference Node can process.                                  | (see below)                            |
      | `model_name`   | - The name of the model.                                                  | Qwen/QwQ-32B                            |
      | `model_args`   | - vLLM arguments for the inference of the model. <br> Typically passed as CLI flags.                    | --quantization, fp8, --kv-cache-dtype, fp8        |
      
Right now, the network supports two models: `Qwen/Qwen2.5-7B-Instruct` and `Qwen/QwQ-32B`, both quantized to FP8 and the `QwQ model` uses an `FP8 KV cache`.
To ensure correct setup and optimal performance, use the arguments that best match your model and GPU layout.

| Model and GPU layout           | vLLM arguments                                             |
|-------------------------------------------|---------------------------------------------------------------------------------------------------------|
| `Qwen/Qwen2`                | `"--quantization", "fp8"`                                       |
| `Qwen/QwQ-32B` on 8xA100 or 8xH100      | `"--quantization"`, `"fp8"`, `"--kv-cache-dtype"`, `"fp8"`                          |
| `Qwen/QwQ-32B` on 8x3090 or 8x4090      | `"--quantization"`, `"fp8", "--kv-cache-dtype"`, `"fp8"`, `"--tensor-parallel-size"`, `"4"`          |
| `Qwen/QwQ-32B` on 8x3080           | `"--quantization"`, `"fp8"`, `"--kv-cache-dtype"`, `"fp8"`, `"--tensor-parallel-size"`, `"4"`, `"--pipeline-parallel-size"`, `"2"` |


!!! note "vLLM performance tuning reference"
      For detailed guidance on selecting optimal deployment configurations and vLLM parameters tailored to your GPU hardware, refer to the Benchmark to Choose Optimal Deployment Config for LLMs [guide](https://gonka.ai/participant/benchmark-to-choose-optimal-deployment-config-for-llms/).

2.After a few minutes, check if your node appears in the current epoch. Proof of Compute updates every few hours. Your node may take time to show up.

```
http://195.242.13.239:8000/v1/epochs/current/participants
```

### Scale and Manage Inference Nodes
=== "Scale Inference Nodes"
    Repeat this process for each new GPU machine.
    All Inference Nodes can register with the same Network Node.

=== "Retrieve All Inference Nodes"
    To get a list of all registered inference nodes in your network node, use:
    ```
    curl -X GET http://localhost:9200/admin/v1/nodes
    ```
    This will return a JSON array containing all configured Inference nodes.

=== "Removing an Inference node"
    Being connected to your network node server, use the following Admin API request to remove an inference node dynamically without restarting:
    ```
    curl -X DELETE "http://localhost:9200/admin/v1/nodes/{id}" -H "Content-Type: application/json"
    ```
    Where id is the identifier of the inference node as specified in the request when registering the Inference Node. If successful, the response will be true.

=== "Stopping and Cleaning Up Your Node"
    Make sure you are in `pivot-deploy/join` folder.

    To stop all running containers:
    ```bash
    docker compose -f docker-compose.yml down
    ```
    This stops and removes all services defined in the `docker-compose.yml` file without deleting volumes or data unless explicitly configured.

    To clean up cache and start fresh, remove the local `.inference` folder (inference runtime cache and identity):
    ```bash
    rm -rf .inference
    docker volume rm join_tmkms_data
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
