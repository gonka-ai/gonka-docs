!!! warning
    为避免不必要的代币损失，在跨链桥完全激活的官方公告发布之前，请勿使用本指南中的说明。

由 Gonka 共识控制的专用跨链桥智能合约已在以太坊上激活，地址为：

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# 注册跨链桥代币

为了允许用户将新的 ERC-20 代币从以太坊桥接到 Gonka，必须在链上注册该代币。这需要通过一个治理提案来注册代币的元数据（名称、符号、精度 decimals），以便 Gonka 共识和跨链桥知道如何实例化包装后的 CW-20 代币合约。

本指南将向您介绍如何起草和提交注册新跨链桥代币的治理提案。

### 前置要求

在开始之前，您需要获取有关该 ERC-20 代币的以下信息：

* **链 ID (Chain ID)**：源链标识符（以太坊主网通常为 `"ethereum"`，Sepolia 测试网为 `"sepolia"`）。
* **合约地址 (Contract Address)**：以太坊上的 ERC-20 代币合约地址（例如 USDT 的地址为 `0xdAC17F958D2ee523a2206206994597C13D831ec7`）。
* **名称 (Name)**：代币的完整名称（例如 `"Tether USD"`）。
* **符号 (Symbol)**：代币的符号/代币名（例如 `"USDT"`）。
* **精度 (Decimals)**：代币的小数位数（例如 `6` 或 `18`）。

### 操作步骤

#### 步骤 1：获取治理模块地址（Authority）

治理模块账户地址充当签署和执行提案的 `authority`。要在您的节点上查找此地址，请运行：

```bash
inferenced query auth module-accounts --node $SEED_URL/chain-rpc/ | grep -B2 'name: gov'
```

复制返回的 Cosmos 地址（例如 `cosmos1...gov...`）。

#### 步骤 2：准备提案文件

创建一个名为 `register_token_proposal.json` 的文件。该提案将在 `messages` 数组中包含 `MsgRegisterTokenMetadata` 消息，以注册代币元数据（名称、符号、小数位数）。

##### 提案 JSON 模板

```json
{
  "messages": [
    {
      "@type": "/inference.inference.MsgRegisterTokenMetadata",
      "authority": "cosmos1...gov...",       // from step 1
      "chainId": "ethereum",
      "contractAddress": "0xTokenContractAddressOnEthereum",
      "name": "Token Name",
      "symbol": "SYMBOL",
      "decimals": 18,
      "overwrite": false
    }
  ],
  "metadata": "ipfs://CID",
  "deposit": "500000000000ngonka",
  "title": "Register Wrapped SYMBOL Token Metadata",
  "summary": "This proposal registers the metadata for the SYMBOL ERC-20 token bridged from Ethereum on the Gonka chain."
}
```

请替换：

* `cosmos1...gov...` 为您实际的治理模块地址。
* `0xTokenContractAddressOnEthereum` 为具体的 ERC-20 合约地址。
* `Token Name`、`SYMBOL` 和 `decimals` 为正确的代币信息。
* `deposit` 为满足最小存款要求的金额。
* `metadata` 为您的提案元数据 URI（可选，可为空或 IPFS CID）。

#### 步骤 3：提交治理提案

在存有您冷账户密钥的私有机器上运行以下交易：

```bash
inferenced tx gov submit-proposal ./register_token_proposal.json \
  --from <cold-key-name> \
  --keyring-backend file \
  --unordered --timeout-duration=60s \
  --gas=2000000 --gas-adjustment=5.0 \
  --node $SEED_URL/chain-rpc/ \
  --yes
```

系统将提示您输入文件密钥环的密码。

#### 步骤 4：追加存款和投票

提交后，从交易日志或通过查询所有提案获取 `proposal_id`：

```bash
inferenced query gov proposals --node $SEED_URL/chain-rpc/
```

如果您的初始存款低于进入投票期所需的最低金额，请进行追加：

```bash
inferenced tx gov deposit <proposal_id> 500000000000ngonka \
  --from <cold-key-name> \
  --keyring-backend file \
  --unordered --timeout-duration=60s \
  --gas=2000000 --gas-adjustment=5.0 \
  --node $SEED_URL/chain-rpc/ \
  --yes
```

提案进入**投票期 (Voting Period)** 后，投赞成票：

```bash
inferenced tx gov vote <proposal_id> yes \
  --from <cold-key-name> \
  --keyring-backend file \
  --unordered --timeout-duration=60s \
  --gas=2000000 --gas-adjustment=5.0 \
  --node $SEED_URL/chain-rpc/ \
  --yes
```

#### 步骤 5：验证

投票期结束且提案通过后，您可以验证元数据是否已成功注册。

##### 1. 验证元数据

使用链 API 或 CLI 查询代币元数据：

```bash
curl "https://node2.gonka.ai:8433/chain-api/productscience/inference/inference/token_metadata/ethereum/0xTokenContractAddressOnEthereum"
```

##### 2. 验证包装代币余额

当用户将其代币充值到以太坊上的跨链桥合约后，Gonka 共识将自动为该代币实例化一个包装 CW-20 合约，并将铸造的余额分配给用户派生的地址。您可以查询余额：

```bash
curl "https://node2.gonka.ai:8433/chain-api/productscience/inference/inference/wrapped_token_balances/{gonkaAddress}"
```
