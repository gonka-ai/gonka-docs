---
name: index.md
---

# Developer Quickstart

This instruction describes how to create a user account and make an inference request using the `inferenced` CLI tool.

## Get `inferenced`

To interact with the network, you need the `inferenced` CLI tool.   
You can download latest `inferenced` binary for your system at this link:

[https://github.com/product-science/inference-ignite/releases](https://github.com/product-science/inference-ignite/releases)

!!! note
  On Mac OS you will have to enable execution of this binary in System Settings


## Directories for credentials and requests
1. Crenentials will be stored in `~/.inference` directory

1. Create a Directory for Request Payloads
```
mkdir inference-requests
```

!!! note
    ## Seed Node

    Current list of seed nodes for testnet:
    ```
    http://36.189.234.237:19204
    http://36.189.234.237:19210
    http://36.189.234.237:19212
    ```

## Define variables

Set the required environment variables before proceeding:

```bash
export SEED_URL=http://36.189.234.237:19210 # or any other seed node
export ACCOUNT_NAME=<account-name>
export ACCOUNT_ADDRESS=... # Will be obtained after account creation
```

## Create an account

You can create an account with the following command:
```bash
./inferenced create-client $ACCOUNT_NAME \
  --node-address $SEED_URL
```

- Replace `$ACCOUNT_NAME` with your desired account name.
- Replace `$SEED_URL` with the seed node URL.

This command will create a new account and save the keys to the `~/.inference` directory.

Please save the `ACCOUNT_ADDRESS` from the output lines:

```bash
- address: ACCOUNT_ADDRESS
  name: ACCOUNT_NAME
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"..."}'
  type: local
```

## Make an Inference Request

You should place the payload for an OpenAI-compatible `/chat/completion` request into a file inside the inference-requests directory. 
For example, create a file named `inference-requests/request_payload.json` with the following content:

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
./inferenced signature send-request \
  --account-address $ACCOUNT_ADDRESS \
  --node-address $SEED_URL \
  --file ./inference-requests/request_payload.json
```

**Need help?** Join our [Discord server](https://discord.gg/fvhNxdFMvB) for assistance with general inquiries, technical issues, or security concerns.  
