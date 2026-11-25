!!! warning "桥暂时不可用"
    随着一起正在调查的事件发生，Gonka–Ethereum 桥已暂停使用。在进一步通知前，请勿使用该桥。请关注官方公告以获取更新信息。

!!! warning 
    始终先进行小额测试交易。桥接转账是不可逆的，因此在转移大额资金前，请先发送一小笔金额并确认其按预期到达。

    由 Gonka 共识控制的专用桥智能合约已部署在以太坊的以下地址：

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# 注册桥接代币

!!! important "注册是可选的"
    您**无需**注册代币即可桥接它。任何 ERC-20 代币均可存入桥接，Gonka 将自动创建其封装的 CW-20 合约并铸造您的余额。注册是一种便利功能，可：

    * 附加**元数据**（名称、符号、小数位），以便封装代币在钱包、浏览器和仪表板中正确显示，以及
    * 使代币**有资格**参与链上流动性池交易。

未注册的代币仍可正常桥接和转账——只是在有人注册前，它会显示为空/默认元数据。USDT 和 USDC 已预先注册。

注册代币会通过治理提案将元数据记录在链上。Gonka 共识使用此元数据来标记封装的 CW-20 合约。

由于注册需经过治理投票，它也起到轻量级的**验证/反欺诈**作用：这是社区证明某个以太坊合约是其声称的真正代币，而非仿冒或无效合约的方式。因此，已注册代币是更强的合法性信号（也是流动性池交易的前提），而未注册代币虽可桥接，但缺乏链上背书。

本节将引导您起草并提交治理提案以注册新的桥接代币。

!!! tip "先在测试网进行"
    首先在**测试网**（链 ID `sepolia`）上注册和测试新代币。只有在端到端验证了桥接和元数据后，才将代币升级到**主网**（链 ID `ethereum`）。其他代币的主网上线计划由治理决定。

### 前提条件

开始前，您需要以下关于 ERC-20 代币的信息：

* **链 ID**：源链标识符（测试网通常为 `"ethereum"` 或 `"sepolia"`）。
* **合约地址**：以太坊上的 ERC-20 合约地址（例如，USDT 为 `0xdAC17F958D2ee523a2206206994597C13D831ec7`）。
* **名称**：代币的全名（例如，`"Tether USD"`）。
* **符号**：代币的简称（例如，`"USDT"`）。
* **小数位**：代币的精度（例如，`6` 或 `18`）。

### 分步说明

#### 步骤 1：获取治理模块地址（权限方)

治理模块账户地址作为签署并执行提案的 `authority`。要在您的节点上查找此地址，请运行：

```bash
inferenced query auth module-accounts --node $SEED_URL/chain-rpc/ | grep -B2 'name: gov'
```

复制返回的 Cosmos 地址（例如，`cosmos1...gov...`）。

#### 步骤 2：准备提案文件

创建一个名为 `register_token_proposal.json` 的文件。此提案将在 `messages` 数组中包含 `MsgRegisterTokenMetadata` 消息，以注册代币元数据（名称、符号、小数位）。

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

替换：

* `cosmos1...gov...` 为您实际的治理模块地址。
* `0xTokenContractAddressOnEthereum` 为确切的 ERC-20 合约地址。
* `Token Name`、`SYMBOL` 和 `decimals` 为正确的代币信息。
* `deposit` 为满足最低存款要求的金额。
* `metadata` 为您的提案元数据 URI（可选，可留空或使用 IPFS CID）。

#### 步骤 3：提交治理提案

从持有您的冷账户密钥的私人机器运行以下交易：

```bash
inferenced tx gov submit-proposal ./register_token_proposal.json \
  --from <cold-key-name> \
  --keyring-backend file \
  --unordered --timeout-duration=60s \
  --gas=2000000 --gas-adjustment=5.0 \
  --node $SEED_URL/chain-rpc/ \
  --yes
```

系统将提示您输入您的文件密钥环密码。

#### 步骤 4：补充存款并投票

提交后，从交易日志中检索 `proposal_id` 或查询所有提案：

```bash
inferenced query gov proposals --node $SEED_URL/chain-rpc/
```

如果您的初始存款低于进入投票期所需的最低金额，请补足：

```bash
inferenced tx gov deposit <proposal_id> 500000000000ngonka \
  --from <cold-key-name> \
  --keyring-backend file \
  --unordered --timeout-duration=60s \
  --gas=2000000 --gas-adjustment=5.0 \
  --node $SEED_URL/chain-rpc/ \
  --yes
```

一旦提案进入 **投票期**，请投出您的选票：

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

投票期结束后，若提案通过，您可以验证元数据是否已成功注册。

##### 验证元数据

使用链 API 或 CLI 查询代币元数据：

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/token_metadata/ethereum/0xTokenContractAddressOnEthereum"
```

##### 验证包装代币余额

一旦用户将代币桥接到以太坊上的桥接合约，Gonka 共识将自动为该代币实例化一个包装的 CW-20 合约，并将铸造的余额分配给用户的派生地址。您可以查询余额：

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/wrapped_token_balances/{gonkaAddress}"
```

##### 每个代币一个包装合约

每个以太坊代币在 Gonka 上恰好对应一个包装的 CW-20 合约。首次存款时会实例化该合约；此后所有 **相同** 代币的存款都会复用 **同一个** 合约，因此该代币的所有余额和转账都集中在一个地址下。您可以在仪表板中查看包装合约的交易记录，例如：

```text
https://node1.gonka.ai:8443/dashboard/gonka/cosmwasm/105/transactions?contract=<wrappedContractAddress>
```
