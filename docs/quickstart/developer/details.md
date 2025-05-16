# Details

## Inference Request with `inferenced`

Create a Directory for Request Payloads
```
mkdir inference-requests
```

Save the payload for an OpenAI-compatible `/chat/completion` request in a file inside the `inference-requests` directory.
For example, create a file named `inference-requests/request_payload.json` with the following content:

```json linenums="1"
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
  --account-address $GONKA_ADDRESS \
  --node-address $NODE_URL \
  --file ./inference-requests/request_payload.json
```

## Using the Gonka API directly

To access Gonka API directly you have to:
#### 1. Use of the randomly selected endpoint
#### 2. Signs the request body with your private key using ECDSA
#### 3. Adds the signature to the `Authorization` header
#### 4. Add your account address to the `X-Requester-Address` header

=== "Python"

```py linenums="1"
import os
import json
import requests
import hashlib
import base64
from ecdsa import SigningKey, SECP256k1, util

GONKA_ADDRESS = os.environ.get('GONKA_ADDRESS')
GONKA_PRIVATE_KEY = os.environ.get('GONKA_PRIVATE_KEY')
GONKA_ENDPOINT = os.environ.get('GONKA_ENDPOINT')

def sign_payload(payload: bytes, private_key: str) -> str:
    signing_key = SigningKey.from_string(bytes.fromhex(private_key), curve=SECP256k1)

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

payload = {
  "model": "Qwen/QwQ-32B",
  "messages": [
      {
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello, how are you?"}
      }
    ],
  "stream": True,
}

payload_bytes = json.dumps(payload).encode('utf-8')
signature = sign_payload(payload_bytes, GONKA_PRIVATE_KEY)

response = requests.post(
  url=f"{GONKA_ENDPOINT}/chat/completions",
  headers={
    "Content-Type": "application/json",
    "Authorization": signature,
    "X-Requester-Address": GONKA_ADDRESS,
  },
  data=payload
)

response_json = response.json()
assistant_message = response_json['choices'][0]['message']['content']

print("\nAssistant says:", assistant_message)

```
