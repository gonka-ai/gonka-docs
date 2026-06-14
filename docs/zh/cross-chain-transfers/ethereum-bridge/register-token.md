!!! warning 
    始终先进行小额测试交易。桥接转账不可逆，因此在转移大额资金前，请先发送少量金额并确认其按预期到达。

    由Gonka共识控制的专用Bridge智能合约已在以太坊上激活，地址为：

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# 注册桥接代币

!!! important "注册是可选的"
    您**不需要**注册代币即可进行桥接。任何ERC-20代币都可以存入桥接合约，Gonka将自动实例化其封装的CW-20合约并铸造您的余额。注册仅是一种便利性操作，它可以：

    * 附加**元数据**（名称、符号、小数位数），使封装后的代币在钱包、浏览器和仪表板中正确显示，并
    * 使该代币有资格在链上流动性池中进行**交易**。

    即使未注册，代币仍可正常桥接和转账——只是在有人注册之前，其显示为空白/默认的元数据。USDT和USDC已预先注册。

注册代币会通过治理提案将元数据记录在链上。Gonka共识机制使用此元数据来标记封装的CW-20代币合约。

由于注册需经过治理投票，它也起到轻量级的**验证/防欺诈步骤**作用：这是社区为某个以太坊合约的真实性背书的方式，确认其是其所声称的真实代币，而非仿冒或无效合约。因此，已注册代币是合法性的更强信号（也是流动性池交易的前提条件），而未注册代币仍可桥接，但不具有此类链上背书。

本节将指导您起草并提交治理提案以注册新的桥接代币。

!!! tip "先在测试网操作"
    请先在**测试网**（链ID `sepolia`）上注册并测试新代币。只有在端到端验证桥接功能和元数据无误后，才可将代币推广至**主网**（链ID `ethereum`）。主网上新增代币的上线计划由治理决定。

### 先决条件

开始之前，您需要获取以下关于ERC-20代币的信息：

* **链ID**：源链标识符（通常为测试网的 `"ethereum"` 或 `"sepolia"`）
* **合约地址**：以太坊上的ERC-20合约地址（例如，USDT的 `0xdAC17F958D2ee523a2206206994597C13D831ec7`）
* **名称**：代币的全名（例如，`"Tether USD"`）
* **符号**：代币的交易代码（例如，`"USDT"`）
* **小数位数**：代币的精度（例如，`6` 或 `18`）

### 分步说明

#### 步骤1：获取治理模块地址（权限）

治理模块账户地址充当签署和执行提案的 `authority`。要在您的节点上查找此地址，请运行：

```bash
inferenced query auth module-accounts --node $SEED_URL/chain-rpc/ | grep -B2 'name: gov'
```

复制返回的Cosmos地址（例如，`cosmos1...gov...`）。

#### 步骤2：准备提案文件

创建一个名为`register_token_proposal.json`的文件。该提案将在`MsgRegisterTokenMetadata`数组中包含`messages`消息，以注册代币元数据（名称、符号、小数位数）。

##### 提案JSON模板

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

* `cosmos1...gov...` 为你的实际治理模块地址。
* `0xTokenContractAddressOnEthereum` 为确切的 ERC-20 合约地址。
* `Token Name`、`SYMBOL` 和 `decimals` 替换为正确的代币信息。
* `deposit` 替换为满足最低存款要求的金额。
* `metadata` 替换为你的提案元数据的 URI（可选，可以为空或 IPFS CID）。

#### 步骤 3：提交治理提案

从持有你冷账户密钥的私人设备上运行此交易：

```bash
inferenced tx gov submit-proposal ./register_token_proposal.json \
  --from <cold-key-name> \
  --keyring-backend file \
  --unordered --timeout-duration=60s \
  --gas=2000000 --gas-adjustment=5.0 \
  --node $SEED_URL/chain-rpc/ \
  --yes
```

系统将提示您输入文件密钥环密码。

#### 步骤4：充值存款并投票

提交后，从交易日志中检索`proposal_id`或查询所有提案：

```bash
inferenced query gov proposals --node $SEED_URL/chain-rpc/
```

如果您的初始存款低于进入投票期所需的最低金额，请进行补充：

```bash
inferenced tx gov deposit <proposal_id> 500000000000ngonka \
  --from <cold-key-name> \
  --keyring-backend file \
  --unordered --timeout-duration=60s \
  --gas=2000000 --gas-adjustment=5.0 \
  --node $SEED_URL/chain-rpc/ \
  --yes
```

提案进入**投票阶段**后，请投出你的票：

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

投票期结束后，如果提案通过，您可以验证元数据是否已成功注册。

##### 1. 验证元数据

使用链上 API 或 CLI 查询代币元数据：

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/token_metadata/ethereum/0xTokenContractAddressOnEthereum"
```

##### 2. 验证封装代币余额

当用户将其代币桥接到以太坊上的桥接合约后，Gonka 共识将自动为该代币实例化一个封装的 CW-20 合约，并将铸造的余额分配给用户的派生地址。您可以查询余额：

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/wrapped_token_balances/{gonkaAddress}"
```

##### 3. 每个代币对应一个封装合约

每个以太坊代币在Gonka上对应一个且仅一个封装的CW-20合约。首次存款时创建该合约；之后同一代币的每次存款都会复用同一个合约，因此该代币的所有余额和转账都位于一个地址下。您可以在仪表板中查看封装合约的交易记录，例如：

```text
https://node1.gonka.ai:8443/dashboard/gonka/cosmwasm/105/transactions?contract=<wrappedContractAddress>
```
