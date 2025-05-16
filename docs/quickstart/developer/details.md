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
  --account-address $ACCOUNT_ADDRESS \
  --node-address $API_URL \
  --file ./inference-requests/request_payload.json
```
