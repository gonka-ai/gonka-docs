---
name: index.md
---

# Developer Quickstart

This instruction describes how to create a user account and make an inference request using the `inferenced` CLI tool.

## Get `inferenced`

To interact with the network, you need the `inferenced` CLI tool.  
Currently, it’s available from the Docker image: `gcr.io/decentralized-ai/inferenced-join`.


*  **[COMING SOON]** Install binary directly without Docker.

### Get docker image

If you have a PS account or PS has provided you with access, you need to authenticate with gcloud and configure Docker to access the image.

1. Install and setup `docker` according to the [official guide](https://docs.docker.com/get-docker/)
2. Authenticate with Google Cloud
Run the following command and log in with your account credentials:
```
gcloud auth login
```

3. Configure Docker for GCP Artifact Registry 
Add GCP’s Artifact Registry to your Docker configuration:
```
gcloud auth configure-docker
```

4.	Pull the Docker Image
```
docker pull gcr.io/decentralized-ai/inferenced-join
```

## Create a directory for credentials and requests
1. Create a Directory for Credentials
```
mkdir .inference
```

1. Create a Directory for Request Payloads
```
mkdir inference-requests
```

Notes: 

- All commands below assume you’re using `inferenced` from the Docker container.
- If your `.inference` and `inference-requests` directories are not in the current directory, you need to modify the paths to the local volumes accordingly.


## Create an account

You can create an account with the following command:
```bash
docker run -it --rm \
    -v $(pwd)/.inference:/root/.inference \
    -v $(pwd)/inference-requests:/root/inference-requests \
    gcr.io/decentralized-ai/inferenced-join \
    inferenced \
    create-client \
    <account-name> \
    --node-address http://34.72.225.168:8080
```

- Replace `<account-name>` with your desired account name.

This command will create a new account and save the keys to the `.inference` directory.

Please save the `<account-address>` from the output lines:

```bash
- address: <account-address>
  name: <account-name>
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"..."}'
  type: local
```

## Make an Inference Request

You should place the payload for an OpenAI-compatible `/chat/completion` request into a file inside the inference-requests directory. For example, create a file named `inference-requests/request_payload.json` with the following content:

```json
{
  "temperature" : 0.8,
  "model" : "unsloth/llama-3-8b-Instruct",
  "messages": [{
      "role": "system",
      "content": "Regardless of the language of the question, answer in english"
    },
    {
        "role": "user",
        "content": "When did Hawaii become a state?."
    }
  ],
  "stream": true
}
```


Then, run the following command to make the inference request:

```bash
docker run -it --rm \
    -v $(pwd)/.inference:/root/.inference \
    -v $(pwd)/inference-requests:/root/inference-requests \
    gcr.io/decentralized-ai/inferenced-join \
    inferenced \
    signature \
    send-request \
    --account-address <account-address> \
    --node-address http://34.72.225.168:8080 \
    --file /root/inference-requests/request_payload.json
```

- Replace `<account-address>` with the account address obtained from the previous step.
