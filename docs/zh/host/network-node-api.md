# 网络节点 API

本节介绍 `Network Node API` 的 `/v1/epochs/{epoch_id}/participants` 接口。该接口用于获取：

- Merkle 证明
- Host（主机）数据
- 验证者签名

## 用法

当前 Epoch 数据
```bash
curl -X GET http://<your_api_node_url:public_port>/v1/epochs/current/participants
```

指定 Epoch 数据
```bash
curl -X GET http://<your_api_node_url:public_port>/v1/epochs/<epoch_id>/participants
```

---

## 示例响应解析
```bash linenums="1"
{
  "active_participants": {
	"participants": [
  	{
    	"index": "gonka17tvsmufmewvwfy3dfxz7l20jmlhhn6ekfcun7r",
    	"validator_key": "ljvRT9VScsxQKKX4S91yJRNppbz691ceD4sBYBRrAys=",
    	"weight": 10,
    	"inference_url": "http://genesis-api:8080",
    	"models": [
      	"unsloth/llama-3-8b-Instruct"
    	],
    	"seed": {
      	"participant": "gonka17tvsmufmewvwfy3dfxz7l20jmlhhn6ekfcun7r",
      	"block_height": 9,
      	"signature": "6a2523cd5898539ef8ea765c7ab78f0de5dbcbb32a34b9706baa7294589f94d657422f573e7a4325d4ba8661466171c9621a51544478eb69f90a49b5271c1400"
    	}
  	}
	],
	"epoch_group_id": 1,
	"poc_start_block_height": 9,
	"created_at_block_height": 15
  },
  "addresses": [
	"BBDEDC12E4830D2086263415BE3FB4BF43C505A5"
  ],
  "active_participants_bytes": "0acc020a2d636f736d6f7331377476736d75666d657776776679336466787a376c32306a6d6c68686e36656b6663756e3772122c6c6a765254395653637378514b4b5834533931794a524e7070627a363931636544347342594252724179733d180a2217687474703a2f2f67656e657369732d6170693a383038302a1b756e736c6f74682f6c6c616d612d332d38622d496e73747275637432b4010a2d636f736d6f7331377476736d75666d657776776679336466787a376c32306a6d6c68686e36656b6663756e377210091a8001366132353233636435383938353339656638656137363563376162373866306465356462636262333261333462393730366261613732393435383966393464363537343232663537336537613433323564346261383636313436363137316339363231613531353434343738656236396639306134396235323731633134303010011809280f",
  "proof_ops": {
	"ops": [
  	{
    	"type": "ics23:iavl",
    	"key": "QWN0aXZlUGFydGljaXBhbnRzLzEvdmFsdWUv",
    	"data": "CuMEChtBY3RpdmVQYXJ0aWNpcGFudHMvMS92YWx1ZS8S1QIKzAIKLWNvc21vczE3dHZzbXVmbWV3dndmeTNkZnh6N2wyMGptbGhobjZla2ZjdW43chIsbGp2UlQ5VlNjc3hRS0tYNFM5MXlKUk5wcGJ6NjkxY2VENHNCWUJSckF5cz0YCiIXaHR0cDovL2dlbmVzaXMtYXBpOjgwODAqG3Vuc2xvdGgvbGxhbWEtMy04Yi1JbnN0cnVjdDK0AQotY29zbW9zMTd0dnNtdWZtZXd2d2Z5M2RmeHo3bDIwam1saGhuNmVrZmN1bjdyEAkagAE2YTI1MjNjZDU4OTg1MzllZjhlYTc2NWM3YWI3OGYwZGU1ZGJjYmIzMmEzNGI5NzA2YmFhNzI5NDU4OWY5NGQ2NTc0MjJmNTczZTdhNDMyNWQ0YmE4NjYxNDY2MTcxYzk2MjFhNTE1NDQ0NzhlYjY5ZjkwYTQ5YjUyNzFjMTQwMBABGAkoDxoLCAEYASABKgMAAh4iKwgBEgQCBB4gGiEgwUNlynn4mzi4AC3u2itEeV3Y7Qe2vynK7Qqup2tmVgAiKwgBEgQECB4gGiEgiNVJ1Gl2VO0MezltgAUQs72vlGp3j3OWKH1OAD9MPHoiKwgBEgQGDB4gGiEgLyrwJqJ3jIIDD+gd8EO/3G8lNiCgkcpBn9IkqETCGbYiKwgBEgQIEh4gGiEgktjdW4rq4PGPx+En8SQnX7eIl6J5Qf4I9NEMMCokPa4iKwgBEgQKKB4gGiEg4Lo2jUStQ7FHrFhkm+Tk5df+rBHeeA6Ey5npZw+DEIk="
  	},
  	{
    	"type": "ics23:simple",
    	"key": "aW5mZXJlbmNl",
    	"data": "CtoBCglpbmZlcmVuY2USIAeInJI1DSn8uBZz5z28V3JeXiQ7kPFDaCWqZeKu/1+ZGgkIARgBIAEqAQAiJwgBEgEBGiCkF0H31nsqBz1NVD3bG1444WqkoI982R1FXozDhDZvTyInCAESAQEaIJXhyLpHqjGG8RNH1IDYExUpZFPyxZvc7HLLmYEKxBeAIicIARIBARogVb5ZN4+aA5PlSPOrcbIeH/EuZ+nmQpJSod9LdNOb3WkiJQgBEiEBecxJ03qGQtj8qBYv4F3GTI9KLCix0WU+5PQNmJxXm7o="
  	}
	]
  },
  "validators": [
	{
  	"address": "BBDEDC12E4830D2086263415BE3FB4BF43C505A5",
  	"pub_key": "ljvRT9VScsxQKKX4S91yJRNppbz691ceD4sBYBRrAys=",
  	"voting_power": 1000000,
  	"proposer_priority": 0
	}
  ],
  "block": [
	{
  	"header": {
    	"version": { "block": 11 },
    	"chain_id": "gonka-mainnet",
    	"height": 15,
    	"time": "2025-04-02T21:13:34.100375646Z",
    	"last_block_id": {
      	"hash": "306D1EBC3628F0571D5F772C85B554A8CD30C298648B4E325EC82945E7D20841",
      	"parts": {
        	"total": 1,
        	"hash": "055C7DD9132B5133B7D422D423ED775BC4FF5E7E3C7447C4539B5573D67686DD"
      	}
    	},
    	"last_commit_hash": "04584765750C36899099C65023702382D718F5CF5E44581F675EAEDF4F15DE9E",
    	"data_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
    	"validators_hash": "BC21E09900AE1CBD50444061E0B1853550A509A3B8CE3B2BF5DA0C9DCC0351B0",
    	"next_validators_hash": "BC21E09900AE1CBD50444061E0B1853550A509A3B8CE3B2BF5DA0C9DCC0351B0",
    	"consensus_hash": "048091BC7DDC283F77BFBF91D73C44DA58C3DF8A9CBC867405D8B7F3DAADA22F",
    	"app_hash": "6DAF9E22F6A30D441F5C40BF37ABD8A3B11A7582F5023413639C3015C6E47713",
    	"last_results_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
    	"evidence_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
    	"proposer_address": "BBDEDC12E4830D2086263415BE3FB4BF43C505A5"
  	},
  	"data": { "txs": null },
  	"evidence": { "evidence": null },
  	"last_commit": {
    	"height": 14,
    	"round": 0,
    	"block_id": {
      	"hash": "306D1EBC3628F0571D5F772C85B554A8CD30C298648B4E325EC82945E7D20841",
      	"parts": {
        	"total": 1,
        	"hash": "055C7DD9132B5133B7D422D423ED775BC4FF5E7E3C7447C4539B5573D67686DD"
      	}
    	},
    	"signatures": [
      	{
        	"block_id_flag": 2,
        	"validator_address": "BBDEDC12E4830D2086263415BE3FB4BF43C505A5",
        	"timestamp": "2025-04-02T21:13:34.100375646Z",
        	"signature": "twGyWJvYr+jV1Hhfjio7p7lkDbg2+OrpUqI6Nmb3xHta0hKQyoky2S4U755x2YewLdG8t/1TlaqzurljQoXmDg=="
      	}
    	]
  	}
	]
}
```

**`active_participants`**

`participants`：活跃参与者列表，包括：

- `index`：gonka 地址
- `validator_key`：公钥（Base64）
- `weight`：投票权重
- `inference_url`：服务端点
- `models`：支持的模型列表
- `seed`：带有元数据的签名种子

**`addresses`**：参与者地址列表（大写十六进制）

**`active_participants_bytes`**：编码 Host 数据的原始字节数组（十六进制编码）——可用于 Merkle 证明验证或状态同步。

**`proof_ops`**：用于验证的 ICS23 兼容的证明操作列表

**`validators`**：该 epoch 时刻的验证者集合：

- `address`：验证者地址
- `pub_key`：公钥（Base64）
- `voting_power`：当前投票权重
- `proposer_priority`：共识出块优先级

**`block`**：围绕该 epoch 事件的区块列表

- 包含完整区块头元数据、提议者地址、提交签名等
- 用于验证 Host 数据的包含与提交

**需要帮助？** [请先查看我们的常见问题页面](https://gonka.ai/zh/FAQ/)，或加入我们的[Discord 服务器](https://discord.com/invite/RADwCT2U6R) 服务器，以获取关于一般咨询、技术问题或安全相关事项的协助。
