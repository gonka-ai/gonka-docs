# Software Upgrades
There are 3 different versions that can be upgraded independently:

1. Blockchain code
2. API code
3. ML Node versions

Any of these can be upgraded independently, or all three can be upgraded simultaneously.
These are all done using [governance](https://gonka.ai/transactions-and-governance/) voting and proposals.

## Upgrades of only API or ML Node (or both)

These are done by submitting an `PartialUpgrade` proposal, and are mostly the same as the `SetParams`. The text of the message would look like.

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
