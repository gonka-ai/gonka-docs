# Setting Up your chain 

**Participants** (**hardware providers** or **nodes**) contribute computational resources to the network and are rewarded based on the amount and quality of resources they provide.

To join the network, you need to deploy 2 services:

1. **Network node** - a service that will be a part of the decentralized network and will process all communication
2. **Inference node** - a service which will actually compute inference of LLMs on GPU(s)

The guide contains a description of when both services are deployed on the same machine.  
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
- 8080 - Application service (configurable)

### Container access

Docker images are available in the private Google Container Registry.  
If you have Product Science account or Product Science has provided you with access, you need to authenticate in `gcloud` and configure docker to access them.

1. Run `gcloud auth login` and login with your account credentials
2. Run `gcloud auth configure-docker`

!!! note "For 6block team"
    You can download all images from our local registry at `172.18.114.101:5556`:

    ```bash
    docker pull 172.18.114.101:5556/decentralized-ai/mlnode:latest
    docker pull 172.18.114.101:5556/decentralized-ai/inferenced:latest
    docker pull 172.18.114.101:5556/decentralized-ai/api:latest
    
    docker tag 172.18.114.101:5556/decentralized-ai/mlnode:latest gcr.io/decentralized-ai/mlnode:latest
    docker tag 172.18.114.101:5556/decentralized-ai/inferenced gcr.io/decentralized-ai/inferenced:latest
    docker tag 172.18.114.101:5556/decentralized-ai/api gcr.io/decentralized-ai/api:latest
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
    If you are using an inference node not on the same machine, you need to edit the `node-config.json` file and specify the correct URL of the inference node. 

    Also, you need to remove the block from `docker-compose-cloud.yml` file which starts inference node:
    ```yaml
    # inference-node:
    #   image: gcr.io/decentralized-ai/mlnode:latest
    #   ...
    ```

## Generate signature for payload
To sign payloads for secure communication, use the following Python script

**How to use**

```
export PRIVATE_KEY_HEX=<decripted_private_key_hex>
export ACCOUNT_ADDRESS=<cosmos_address>
export PAYLOAD=<json_payload>
python3 sign.py
```

=== "python"
```
import os
import base64
import hashlib
from ecdsa import SigningKey, SECP256k1, util


def load_private_key():
    global SIGNING_KEY, ACCOUNT_ADDRESS

    PRIVATE_KEY_HEX = os.getenv("PRIVATE_KEY_HEX")
    ACCOUNT_ADDRESS = os.getenv("ACCOUNT_ADDRESS")

    if not PRIVATE_KEY_HEX or not ACCOUNT_ADDRESS:
        raise Exception("Environment variables PRIVATE_KEY_HEX and ACCOUNT_ADDRESS must be set.")

    private_key_bytes = bytes.fromhex(PRIVATE_KEY_HEX)
    SIGNING_KEY = SigningKey.from_string(private_key_bytes, curve=SECP256k1)


def sign_payload(payload: bytes) -> str:
    signature = SIGNING_KEY.sign_deterministic(
        payload, hashfunc=hashlib.sha256, sigencode=util.sigencode_string
    )
    r, s = signature[:32], signature[32:]

    curve_n = SECP256k1.order
    s_int = int.from_bytes(s, byteorder="big")

    if s_int > curve_n // 2:
        s_int = curve_n - s_int  # Canonical s
        s = s_int.to_bytes(32, byteorder="big")

    compact_signature = r + s
    return base64.b64encode(compact_signature).decode("utf-8")


def main():
    load_private_key()
    payload_json = os.getenv("PAYLOAD")

    if not payload_json:
        raise Exception("Environment variable PAYLOAD must be set.")

    # TODO: check that the JSON formatting does not change; otherwise, the signature will be considered invalid.
    payload_bytes = payload_json.encode("utf-8")
    signature_base64 = sign_payload(payload_bytes)
    print("Base64 encoded signature:", signature_base64)


if __name__ == "__main__":
    main()
```


## Launch Your Node

Run the following command to launch your node:

```bash
source config.env && \
docker compose -f docker-compose-cloud-join.yml up -d && \
docker compose -f docker-compose-cloud-join.yml logs -f
```

**Need help?** Join our [Discord server](https://discord.gg/fvhNxdFMvB) for assistance with general inquiries, technical issues, or security concerns.  
