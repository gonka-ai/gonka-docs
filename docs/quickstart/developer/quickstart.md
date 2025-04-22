---
name: index.md
---

# Developer Quickstart

This guide explains how to create a user account and submit an inference request using the `inferenced` CLI tool.
To proceed, you’ll need access to the private codebase. Please send your GitHub username to hello@productscience.ai. 

---

## 1. Get `inferenced`

To interact with the network, you need the `inferenced` CLI tool.   
You can download the latest `inferenced` binary for your system [here](https://github.com/product-science/pivot-deploy/releases).

!!! note "Enabling Execution on Mac OS"
    On Mac OS, after downloading the inferenced binary, you may need to enable execution permissions manually. Follow these steps:
    
    1.	Open a terminal and navigate to the directory where the binary is located.
    
    2.	Run the following command to grant execution permission:
    ```
    chmod +x inferenced
    ```
    3.	Try running `./inferenced --help` again to ensure it’s working.
        
    4.	If you see a security warning when trying to run `inferenced`, go to System Settings → Privacy & Security.
    
    5.	Scroll down to the warning about `inferenced` and click “Allow Anyway”.
    
### Directories for credentials and requests
!!! note 
    **Credentials** will be stored in the `~/.inference` directory

!!! note 
    **Genesis:**
    `API_URL=http://195.242.13.239:8000`
    
    You can view the **current list of active participants** in the network (nodes participating in inference) using this API call to the  genesis node:

    ```bash
    GET http://195.242.13.239:8000/v1/epochs/current/participants
    ```
    This returns a JSON array of nodes currently active in the epoch.

### Define variables

Before creating an account, set up the required environment variables:

```bash
export API_URL=http://195.242.10.196:8000  # Use any node from the list
export ACCOUNT_NAME=<your-desired-account-name>
```

- Replace `<your-desired-account-name>` with your chosen account name.
- Replace `API_URL` with any available seed node from the **Seed Nodes** section above.

## 2. Create an account

You can create an account with the following command:
```bash
./inferenced create-client $ACCOUNT_NAME \
  --node-address $API_URL
```

This command creates a new account and securely stores its keys in the `~/.inference` directory.

Please make sure to securely save your passphrase — you’ll need it for future access.

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

## 3. Inference

### Option 1: Inference Request with `inferenced`

Create a Directory for Request Payloads
```
mkdir inference-requests
```

Save the payload for an OpenAI-compatible `/chat/completion` request in a file inside the `inference-requests` directory.
For example, create a file named `inference-requests/request_payload.json` with the following content:

```json
{
  "model": "Qwen/QwQ-32B",
  "messages": [
    {
      "role": "user",
      "content": "What is the capital city of France?"
    }
  ],
  "stream": false
}
```

Run the following command to submit your inference request:

```bash
./inferenced signature send-request \
  --account-address $ACCOUNT_ADDRESS \
  --node-address $API_URL \
  --file ./inference-requests/request_payload.json
```

---

### Option 2: Inference with Python

If you’d like to perform the request in Python:

1.Export your private key (for demo/testing only).

```bash
./inferenced keys export $ACCOUNT_NAME --unarmored-hex --unsafe
```

This command outputs a plain-text private key (e.g. `<PRIVATE_KEY_HEX>`).  
**In production, use a Key Management Service or environment variables.**

2.Use the code snippet below, replacing the placeholders (`<ACCOUNT_ADDRESS>`, `<PRIVATE_KEY>`, `<API_URL>`) with your actual values:

```python
import json
import requests
import hashlib
import base64
from ecdsa import SigningKey, SECP256k1, util

ACCOUNT_ADDRESS = "<ACCOUNT_ADDRESS>"
PRIVATE_KEY_HEX = "<PRIVATE_KEY>"
NODE_URL = "<API_URL>"


def get_signing_key():
    return SigningKey.from_string(bytes.fromhex(PRIVATE_KEY_HEX), curve=SECP256k1)

def sign_payload(payload: bytes, signing_key: SigningKey) -> str:
    signature = signing_key.sign_deterministic(
        payload, hashfunc=hashlib.sha256, sigencode=util.sigencode_string
    )
    r, s = signature[:32], signature[32:]

    curve_n = SECP256k1.order
    s_int = int.from_bytes(s, byteorder="big")
    
    if s_int > curve_n // 2:
        s_int = curve_n - s_int
        s = s_int.to_bytes(32, byteorder="big")

    return base64.b64encode(r + s).decode("utf-8")

def post_completion_request(host: str, messages: list[dict], stream: bool = False):
    url = f"{host}/v1/chat/completions"
    signing_key = get_signing_key()
    
    payload = {
        "temperature": 0.8,
        "model": "Qwen/QwQ-32B",
        "messages": messages,
        "stream": stream,
    }

    payload_bytes = json.dumps(payload, separators=(',', ':'), sort_keys=False).encode('utf-8')
    signature = sign_payload(payload_bytes, signing_key)
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": signature,
        "X-Requester-Address": ACCOUNT_ADDRESS,
    }
    
    return requests.post(url, headers=headers, data=payload_bytes, stream=stream)

messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello, how are you?"}
]

response = post_completion_request(host=NODE_URL, messages=messages)
response.json()

# readable output
response_json = response.json()
assistant_message = response_json['choices'][0]['message']['content']

print("\nAssistant says:", assistant_message)

```

To perform inference from another language, adjust the examples accordingly.

---
**Need help?** Join our [Discord server](https://discord.gg/fvhNxdFMvB) for assistance with general inquiries, technical issues, or security concerns.  
