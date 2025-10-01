# 详情

## 使用 `inferenced` 进行推理请求

创建请求负载目录
```
mkdir inference-requests
```

将 OpenAI 兼容的 `/chat/completion` 请求的负载保存在 `inference-requests` 目录内的文件中。
例如，创建一个名为 `inference-requests/request_payload.json` 的文件，内容如下：

```json linenums="1"
{
  "model": "Qwen/QwQ-32B",
  "messages": [
    {
      "role": "user",
      "content": "法国的首都是什么？"
    }
  ],
  "stream": false
}
```

运行以下命令提交你的推理请求：

```bash
./inferenced signature send-request \
  --account-address $GONKA_ADDRESS \
  --node-address $NODE_URL \
  --file ./inference-requests/request_payload.json
```

## 直接使用 Gonka API

要直接访问 Gonka API，你需要：
1. 使用随机选择的端点
2. 使用 ECDSA 用你的私钥对请求体进行签名
3. 将签名添加到 `Authorization` 标头
4. 将你的账户地址添加到 `X-Requester-Address` 标头

=== "Python"

```py linenums="1"
import os
import json
import time
import requests
import hashlib
import base64
from ecdsa import SigningKey, SECP256k1

# 必需的环境变量
# GONKA_PRIVATE_KEY: 你的十六进制私钥（带或不带 0x）
# GONKA_ADDRESS: 你的 gonka 地址（bech32），用于 X-Requester-Address
# GONKA_ENDPOINT: 端点基础 URL，包括 /v1（例如 https://host:port/v1）
# GONKA_PROVIDER_ADDRESS: 此端点的提供商 gonka 地址（用于签名）

GONKA_PRIVATE_KEY = os.environ[GONKA_PRIVATE_KEY]
GONKA_ADDRESS = os.environ[GONKA_ADDRESS]
GONKA_ENDPOINT = os.environ[GONKA_ENDPOINT]
GONKA_PROVIDER_ADDRESS = os.environ[GONKA_PROVIDER_ADDRESS]

def sign_payload(payload_bytes: bytes, private_key_hex: str, timestamp_ns: int, provider_address: str) -> str:
    # 如果存在则移除 0x 前缀
    pk = private_key_hex[2:] if private_key_hex.startswith(0x) else private_key_hex
    sk = SigningKey.from_string(bytes.fromhex(pk), curve=SECP256k1)

    # 消息字节：payload || timestamp || provider_address
    msg = payload_bytes + str(timestamp_ns).encode(utf-8) + provider_address.encode(utf-8)

    # 确定性 ECDSA over SHA-256，带低 S 标准化
    sig = sk.sign_deterministic(msg, hashfunc=hashlib.sha256)
    r, s = sig[:32], sig[32:]
    order = SECP256k1.order
    s_int = int.from_bytes(s, big)
    if s_int > order // 2:
        s_int = order - s_int
        s = s_int.to_bytes(32, big)
    return base64.b64encode(r + s).decode(utf-8)

# 混合时间戳（单调 + 与墙钟对齐），如库中
_WALL_BASE = time.time_ns()
_PERF_BASE = time.perf_counter_ns()
def hybrid_timestamp_ns() -> int:
    return _WALL_BASE + (time.perf_counter_ns() - _PERF_BASE)

payload = {
  "model": "Qwen/QwQ-32B",
  "messages": [
      {
        {"role": "system", "content": "你是一个有用的助手。"},
        {"role": "user", "content": "你好，你好吗？"}
      }
    ],
  "stream": True,
}

payload_bytes = json.dumps(payload).encode(utf-8)
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
assistant_message = response_json[choices][0][message][content]

print("\n助手说：", assistant_message)

```
