# Setting Up your chain 

**Participants** (**hardware providers** or **"nodes"**) contribute computational resources to the network and are rewarded based on the amount and quality of resources they provide.

To join the network, you need to deploy 2 services:

1. **Network node** - a service which will be a part of the decentralized network and will process all communication
2. **Inference node** - a service which will actually compute inference of LLMs on GPU(s)

The guide contains a description when both services are deployed on the same machine.  
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

### Container access

Docker images are available in the private Google Container Registry.  
If you have Product Science account or Product Science has provided you with access, you need to authenticate in `gcloud` and configure docker to access them.

1. Run `gcloud auth login` and login with your account credentials
2. Run `gcloud auth configure-docker`

!!! note "For 6block team"
    You can download all images from our local registry at `172.18.114.101:5556`:

    ```bash
    docker pull 172.18.114.101:5556/decentralized-ai/mlnode:latest
    docker pull 172.18.114.101:5556/decentralized-ai/inferenced
    docker pull 172.18.114.101:5556/decentralized-ai/api
    
    docker tag 172.18.114.101:5556/decentralized-ai/mlnode:latest gcr.io/decentralized-ai/mlnode:latest
    docker tag 172.18.114.101:5556/decentralized-ai/inferenced gcr.io/decentralized-ai/inferenced
    docker tag 172.18.114.101:5556/decentralized-ai/api gcr.io/decentralized-ai/api
    ```

    Also please mount cache for the fast model deploy:
    ```bash
    [ -d "/mnt/shared" ] || sudo mkdir /mnt/shared
    mountpoint -q /mnt/shared || sudo mount -t nfs 172.18.114.101:/mnt/shared /mnt/shared
    sudo chmod -R 777 /mnt/shared
    sudo rm -rf ~/cache && \
    sudo mkdir ~/cache && \
    sudo cp -r /mnt/shared/huggingface/hub ~/cache/hub
    ```


## Download Configuration Files

Clone the repository with base deploy scripts:

```bash
git clone https://github.com/product-science/pivot-deploy.git -b main && \
cd pivot-deploy/join
```

- `config.env` - contains environment variables for the network node
- `docker-compose-cloud-join.yml` - a docker compose file to launch the network node
- `node-config.json` - a configuration file for the inference node which will be user by network node

## Setup Your Node 

Edit `config.env` file and set your node name, public URL and other parameters.

- `KEY_NAME` - name of your node. It must be unique
- `PORT` - port where your node will be available at the machine (default is 8000)
- `PUBLIC_URL` - public URL where your node will be available (e.g.: `http://<your-static-ip>:<port>`)

The next variables configure the seed node and are optional to modify:

- `SEED_API_URL` - URL of the seed node  
- `SEED_NODE_RPC_URL` - RPC URL of the seed node  
- `SEED_NODE_P2P_URL` - P2P URL of the seed node  

!!! note "Seed Nodes"
    Here are the current seed nodes for the testnet:  
     - `http://36.189.234.237:19204`  
     - `http://36.189.234.237:19210`  
     - `http://36.189.234.237:19212`  

!!! note
    If you using a inference node not on the same machine you need to edit `node-config.json` file and specify the correct URL of the inference node. 

    Also you need to remove block from `docker-compose-cloud.yml` file which starts inference node:
    ```yaml
    # inference-node:
    #   image: gcr.io/decentralized-ai/vllm:0.5.0.post1
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
