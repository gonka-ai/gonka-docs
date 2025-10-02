# 软件升级

以下 3 个版本可独立升级：

1. 区块链代码
2. API 代码
3. ML 节点版本

可以单独升级其中任意一项，也可以三者同时升级。上述升级均通过[治理](https://gonka.ai/transactions-and-governance/)投票与提案完成。

## 仅升级 API 或 ML 节点（或二者同时）

通过提交 `PartialUpgrade` 提案执行，与 `SetParams` 大体相同。消息示例如下：

```
{
  "body": {
    "messages": [
      {
        "@type": "/cosmos.gov.v1.MsgSubmitProposal",
        "messages": [
    {
     "@type":"/inference.inference.MsgCreatePartialUpgrade",
           "authority": "gonka10d07y265gmmuvt4z0w9aw880jnsr700j2h5m33", // 治理地址
  "height": "60",  // 提案生效的高度
  "nodeVersion": "v1", // 如果不升级 ML 节点则省略
  "apiBinariesJson": "{\"api_binaries\":{\"linux/amd64\":\"https://github.com/product-science/race-releases/releases/download/release%2Fv0.1.1-alpha1/decentralized-api-amd64.zip?checksum=sha256:dbc01f2bde3d911eaf65ed7bbde6f67b15664897f4ce15f9d009adf77e956cd1\",\"linux/arm64\":\"https://github.com/product-science/race-releases/releases/download/release%2Fv0.1.1-alpha1/decentralized-api-arm64.zip?checksum=sha256:5cba5158c8a4f1b855edd9598eb233783fc1e8ed7a2b9aa33e921edc1bac6255\"}}" // 如果不升级 API 则省略
}

        ],
        "initial_deposit": [
          {
            "denom": "ngonka",
            "amount": "10000000"
          }
        ],
  "metadata": "ipfs://CID",  // 可选
  "title": "Update to 1000 epoch length",
  "summary": "Epoch length should be longer",
  "expedited": false,
        "proposer": "cosmos...", // 替换为你的账户地址
      }
    ],
    "memo": "",
    "timeout_height": "0",
    "extension_options": [],
    "non_critical_extension_options": []
  },
  "auth_info": { },
  "signatures": []
}
```
