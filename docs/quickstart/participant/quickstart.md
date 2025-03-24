# Setting Up your chain 

**Participants** (**hardware providers** or **nodes**) contribute computational resources to the network and are rewarded based on the amount and quality of resources they provide.

To join the network, you need to deploy 2 services:

1. **Network node** - a service that will be a part of the decentralized network and will process all communication
2. **Inference node** - a service which will actually compute inference of LLMs on GPU(s)

The guide describes the scenario where both services are deployed on the same machine, and each participant has one MLNode.
Services are deployed as Docker containers.

## Prerequisites

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
    - `PUBLIC_URL=http://195.242.10.196:8000`  

!!! note
    If you are using an inference node not on the same machine, you need to edit the `node-config.json` file and specify the correct URL of the inference node. 

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
docker compose -f docker-compose-cloud-join.yml up -d && \
docker compose -f docker-compose-cloud-join.yml logs -f
```

**Need help?** Join our [Discord server](https://discord.gg/fvhNxdFMvB) for assistance with general inquiries, technical issues, or security concerns.  
