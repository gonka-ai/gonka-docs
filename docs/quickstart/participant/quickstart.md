# Setting Up your chain 

**Hardware providers** (**"participants"** or **"nodes"**). These participants contribute computational resources to the network and are rewarded based on the amount and quality of resources they provide.

To join the network, you need to deploy 2 services:

1. **Network node** - a service which will be a part of the decentralized network and will process all communication
2. **Inference node** - a service which will actually compute inference of LLMs on GPU(s)

The guide contains a description when both services are deployed on the same machine.  
Services are deployed as Docker containers.

## Prerequisites

To run a service you need to have a machine with a [supported GPU(s)](../supported-hardware.md).  

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


## Download Configuration Files

Let's create a directory decentralized-ai which will contain all configuration files:

```bash
mkdir decentralized-ai
cd decentralized-ai
```

Download configuration files:

```bash
curl https://raw.githubusercontent.com/product-science/pivot-deploy/refs/heads/main/join/config.env -o config.env
curl https://raw.githubusercontent.com/product-science/pivot-deploy/refs/heads/main/join/launch_chain.sh -o launch_chain.sh
curl https://raw.githubusercontent.com/product-science/pivot-deploy/refs/heads/main/join/docker-compose-cloud-join.yml -o docker-compose-cloud-join.yml
curl https://raw.githubusercontent.com/product-science/pivot-deploy/refs/heads/main/join/node-config.json -o node-config.json
```

- `config.env` - contains environment variables for the network node
- `launch_chain.sh` - a script to launch the network node
- `docker-compose-cloud-join.yml` - a docker compose file to launch the network node
- `node-config.json` - a configuration file for the inference node which will be user by network node

## Setup Your Node 

Edit `config.env` file and set your node name, public URL and other parameters.

- `KEY_NAME` - name of your node. It must be unique
- `PORT` - port where your node will be available (default is 8080)
- `PUBLIC_URL` - public URL where your node will be available (e.g.: `http://<your-static-ip>:<port>`)

!!! note
    If you using a inference node not on the same machine you need to edit `node-config.json` file and specify the correct URL of the inference node. 

    Also you need to remove block from `docker-compose-cloud-join.yml` file which starts inference node:
    ```yaml
    # inference-node:
    #   image: gcr.io/decentralized-ai/vllm:0.5.0.post1
    #   ...
    ```

!!! note
    During the test you can launch the network node with publicly available inference node. You can download config for this node via:

    ```bash
    curl https://raw.githubusercontent.com/product-science/pivot-deploy/refs/heads/main/join/node-config-test.json -o node-config.json
    ```

## Launch Your Node

Run the following command to launch your node:

```bash
./launch_chain.sh cloud
```
