---
name: index.md
---

# Developer Quickstart

This guide explains how to create a user account and submit an inference request using the `inferenced` CLI tool.

## Get `inferenced`

To interact with the network, you need the `inferenced` CLI tool.   
You can download the latest `inferenced` binary for your system [here](https://github.com/product-science/inference-ignite/releases).

!!! note "Enabling Execution on Mac OS"
    On Mac OS, after downloading the inferenced binary, you may need to enable execution permissions manually. Follow these steps:
    
    1.	Open a terminal and navigate to the directory where the binary is located.
    
    2.	Run the following command to grant execution permission:
    ```
    chmod +x inferenced
    ```
    3.	If you see a security warning when trying to run `inferenced`, go to System Settings → Privacy & Security.
    
    4.	Scroll down to the warning about `inferenced` and click “Allow Anyway”.
    
    5.	Try running `./inferenced --help` again to ensure it’s working.

## Directories for credentials and requests
1.  Credentials will be stored in the `~/.inference` directory

2. Create a Directory for Request Payloads
```
mkdir inference-requests
```

!!! note "Seed Nodes"
    Here are the current seed nodes for the testnet:  
     - `http://36.189.234.237:19204`  
     - `http://36.189.234.237:19210`  
     - `http://36.189.234.237:19212`  


## Define variables

Before creating an account, set up the required environment variables:

```bash
export SEED_URL=http://36.189.234.237:19210  # Use any seed node from the list
export ACCOUNT_NAME=<your-desired-account-name>
```

- Replace `<your-desired-account-name>` with your chosen account name.
- Replace `SEED_URL` with any available seed node from the **Seed Nodes** section above.
  
## Create an account

You can create an account with the following command:
```bash
./inferenced create-client $ACCOUNT_NAME \
  --node-address $SEED_URL
```

This command creates a new account and securely stores its keys in the `~/.inference directory`.

Please save the `ACCOUNT_ADDRESS` from the output lines:

```bash
- address: ACCOUNT_ADDRESS
  name: ACCOUNT_NAME
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"..."}'
  type: local
```

Export the `ACCOUNT_ADDRESS` variable:

```bash
export ACCOUNT_ADDRESS=<your-account-address>
```

## Make an Inference Request

Save the payload for an OpenAI-compatible `/chat/completion` request in a file inside the `inference-requests` directory.
For example, create a file named `inference-requests/request_payload.json` with the following content:

```json
{
  "temperature" : 0.8,
  "model" : "unsloth/llama-3-8b-Instruct",
  "messages": [{
      "role": "system",
      "content": "Regardless of the language of the question, answer in English"
    },
    {
        "role": "user",
        "content": "When did Hawaii become a state?"
    }
  ],
  "stream": true
}
```

Run the following command to submit your inference request:

```bash
./inferenced signature send-request \
  --account-address $ACCOUNT_ADDRESS \
  --node-address $SEED_URL \
  --file ./inference-requests/request_payload.json
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

```python
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

**Need help?** Join our [Discord server](https://discord.gg/fvhNxdFMvB) for assistance with general inquiries, technical issues, or security concerns.  
