!!! warning
    务必先进行小额测试交易。跨链转账是不可逆的，因此在转移大额资金之前，请先发送少量金额，并确认其如期到账。

由 Gonka 共识控制的专用跨链桥智能合约已在以太坊上激活，地址为：

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# 注册跨链桥代币

!!! important "注册是可选的"
    您**不需要**注册代币即可进行跨链。任何 ERC-20 代币都可以充值到跨链桥，Gonka 会自动创建其包装的 CW-20 合约并铸造您的余额。注册只是一项便利功能：

    * 附加**元数据**（名称、符号、精度），使包装代币在钱包、浏览器和仪表板中正确显示，以及
    * 使代币**有资格参与**链上流动性池交易。

    未注册的代币仍可正常跨链和转账——只是在注册之前显示为空/默认元数据。USDT 和 USDC 已预先注册。

注册代币会通过治理提案在链上记录其元数据。Gonka 共识使用此元数据来标记包装的 CW-20 代币合约。

由于注册需要经过治理投票，它同时也充当了一个轻量级的**验证/防欺诈步骤**：社区通过投票来确认某个以太坊合约是否为其声称的真实代币，而非仿冒或无效合约。因此，已注册的代币具有更强的合法性信号（也是流动性池交易的先决条件），而未注册的代币虽然仍可跨链，但不具备此类链上背书。

本节将引导您起草和提交治理提案来注册新的跨链桥代币。

!!! tip "先在测试网上测试"
    请先在**测试网**（链 ID `sepolia`）上注册和测试新代币。只有在端到端验证了跨链和元数据之后，才将代币推广到**主网**（链 ID `ethereum`）。额外代币的主网发布计划由治理决定。

### 前置要求

在开始之前，您需要获取有关该 ERC-20 代币的以下信息：

* **链 ID (Chain ID)**：源链标识符（以太坊主网通常为 `"ethereum"`，Sepolia 测试网为 `"sepolia"`）。
* **合约地址 (Contract Address)**：以太坊上的 ERC-20 代币合约地址（例如 USDT 的地址为 `0xdAC17F958D2ee523a2206206994597C13D831ec7`）。
* **名称 (Name)**：代币的完整名称（例如 `"Tether USD"`）。
* **符号 (Symbol)**：代币的符号/代码（例如 `"USDT"`）。
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
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/token_metadata/ethereum/0xTokenContractAddressOnEthereum"
```

##### 2. 验证包装代币余额

当用户将其代币充值到以太坊上的跨链桥合约后，Gonka 共识将自动为该代币创建一个包装 CW-20 合约，并将铸造的余额分配给用户派生的地址。您可以查询余额：

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/wrapped_token_balances/{gonkaAddress}"
```

##### 3. 每个代币一个包装合约

每个以太坊代币在 Gonka 上精确映射为一个包装 CW-20 合约。首次充值时会创建该合约；之后同一代币的所有充值都将复用同一个合约，因此该代币的所有余额和转账都在同一个地址下。您可以在仪表板中查看包装合约的交易记录，例如：

```text
https://node1.gonka.ai:8443/dashboard/gonka/cosmwasm/105/transactions?contract=<wrappedContractAddress>
```
