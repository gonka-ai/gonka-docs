# 软件升级

有三种不同的版本可以独立升级：

1. 区块链代码
2. API 代码
3. 机器学习节点（ML Node）版本

以上任意一项均可独立升级，也可同时升级全部三项。所有升级均通过[治理](https://gonka.ai/governance/transactions-and-governance/)投票和提案完成。

## 仅升级 API 或 ML 节点（或两者同时升级）

此类升级通过提交一个 `PartialUpgrade` 提案完成，其流程与 `SetParams` 大致相同。提案消息内容如下所示：

```

{
  "body": {
    "messages": [
      {
        "@type": "/cosmos.gov.v1.MsgSubmitProposal",
        "messages": [
    {
     "@type":"/inference.inference.MsgCreatePartialUpgrade",
           "authority": "gonka10d07y265gmmuvt4z0w9aw880jnsr700j2h5m33", // governance address
  "height": "60",  // the height this proposal should be effective
  "nodeVersion": "v1", // exclude if you're not upgrading ML Nodes
  "apiBinariesJson": "{\"api_binaries\":{\"linux/amd64\":\"https://github.com/product-science/race-releases/releases/download/release%2Fv0.1.1-alpha1/decentralized-api-amd64.zip?checksum=sha256:dbc01f2bde3d911eaf65ed7bbde6f67b15664897f4ce15f9d009adf77e956cd1\",\"linux/arm64\":\"https://github.com/product-science/race-releases/releases/download/release%2Fv0.1.1-alpha1/decentralized-api-arm64.zip?checksum=sha256:5cba5158c8a4f1b855edd9598eb233783fc1e8ed7a2b9aa33e921edc1bac6255\"}}" // Exclude if you're not upgrading the API.
}

        ],
        "initial_deposit": [
          {
            "denom": "ngonka",
            "amount": "10000000"
          }
        ],
  "metadata": "ipfs://CID",  // Optional
  "title": "Update to 1000 epoch length",
  "summary": "Epoch length should be longer",
  "expedited": false,
        "proposer": "cosmos...", // Should be the address of YOUR account
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
