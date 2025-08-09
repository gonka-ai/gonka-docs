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
1. Use of the randomly selected endpoint
2. Signs the request body with your private key using ECDSA
3. Adds the signature to the `Authorization` header
4. Add your account address to the `X-Requester-Address` header

=== "Python"

```py linenums="1"
import os
import json
import time
import requests
import hashlib
import base64
from ecdsa import SigningKey, SECP256k1

# Required environment variables
# GONKA_PRIVATE_KEY: your hex private key (with or without 0x)
# GONKA_ADDRESS: your gonka address (bech32) used in X-Requester-Address
# GONKA_ENDPOINT: the endpoint base URL INCLUDING /v1 (e.g. https://host:port/v1)
# GONKA_PROVIDER_ADDRESS: provider's gonka address for this endpoint (used in signature)

GONKA_PRIVATE_KEY = os.environ['GONKA_PRIVATE_KEY']
GONKA_ADDRESS = os.environ['GONKA_ADDRESS']
GONKA_ENDPOINT = os.environ['GONKA_ENDPOINT']
GONKA_PROVIDER_ADDRESS = os.environ['GONKA_PROVIDER_ADDRESS']

def sign_payload(payload_bytes: bytes, private_key_hex: str, timestamp_ns: int, provider_address: str) -> str:
    # Remove 0x prefix if present
    pk = private_key_hex[2:] if private_key_hex.startswith('0x') else private_key_hex
    sk = SigningKey.from_string(bytes.fromhex(pk), curve=SECP256k1)

    # Message bytes: payload || timestamp || provider_address
    msg = payload_bytes + str(timestamp_ns).encode('utf-8') + provider_address.encode('utf-8')

    # Deterministic ECDSA over SHA-256 with low-S normalization
    sig = sk.sign_deterministic(msg, hashfunc=hashlib.sha256)
    r, s = sig[:32], sig[32:]
    order = SECP256k1.order
    s_int = int.from_bytes(s, 'big')
    if s_int > order // 2:
        s_int = order - s_int
        s = s_int.to_bytes(32, 'big')
    return base64.b64encode(r + s).decode('utf-8')

# Hybrid timestamp (monotonic + aligned to wall clock) like the library
_WALL_BASE = time.time_ns()
_PERF_BASE = time.perf_counter_ns()
def hybrid_timestamp_ns() -> int:
    return _WALL_BASE + (time.perf_counter_ns() - _PERF_BASE)

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
timestamp_ns = hybrid_timestamp_ns()
signature = sign_payload(payload_bytes, GONKA_PRIVATE_KEY, timestamp_ns, GONKA_PROVIDER_ADDRESS)

response = requests.post(
  url=f"{GONKA_ENDPOINT}/chat/completions",
  headers={
    "Content-Type": "application/json",
    "Authorization": signature,
    "X-Requester-Address": GONKA_ADDRESS,
    "X-Timestamp": str(timestamp_ns),
  },
  data=payload_bytes,
)

response.raise_for_status()
response_json = response.json()
assistant_message = response_json['choices'][0]['message']['content']

print("\nAssistant says:", assistant_message)

```
