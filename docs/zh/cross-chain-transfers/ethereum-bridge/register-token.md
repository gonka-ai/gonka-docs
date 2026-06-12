!!! warning
    务必先进行小额测试交易。跨链转账是不可逆的，因此在转移大额资金前，请先发送少量金额，并确认其如期到账。

    由 Gonka 共识控制的专用跨链桥智能合约已在以太坊上激活，地址为：

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# 注册桥接代币

!!! important "注册是可选的"
    你**不需要**注册代币即可进行跨链桥接。任何 ERC-20 代币都可以存入桥接合约，Gonka 将自动为其创建对应的封装 CW-20 合约并铸造你的余额。注册仅是一种便利性操作，其作用包括：

 
 
    * 添加**元数据**（名称、符号、小数位数），使封装后的 CW-20 代币在钱包、浏览器和仪表板中正确显示；
 
 
    * 使该代币**有资格参与**链上流动性池的交易。

    即使未注册，代币仍可正常桥接和转账——只是在有人注册之前，它会以空的或默认的元数据显示。USDT 和 USDC 已预先注册。

注册代币是通过治理提案将代币元数据记录到链上的过程。Gonka 共识机制使用这些元数据来标注封装后的 CW-20 代币合约。

由于注册需经过治理投票流程，这也起到了轻量级的**验证 / 防欺诈机制**作用：社区借此确认某个以太坊合约确实是其所声称的真实代币，而非仿冒或无效合约。因此，已注册代币是对合法性的更强信号（也是进入流动性池交易的前提条件），而未注册代币虽仍可桥接，但不具有此类链上背书。

本节将指导你起草并提交一个治理提案，以注册新的桥接代币。

!!! tip "先在测试网操作"
    请先在**测试网**（链 ID `sepolia`）上注册并测试新代币。只有在端到端验证桥接功能和元数据无误后，才通过治理决定是否将其推广至**主网**（链 ID `ethereum`）。主网上新增代币的上线计划由治理流程决定。

### 前提条件

开始之前，你需要准备以下关于 ERC-20 代币的信息：

* **链 ID**：源链标识符（测试网通常为 `"ethereum"` 或 `"sepolia"`）。
* **合约地址**：以太坊上的 ERC-20 合约地址（例如 USDT 的地址为 `0xdAC17F958D2ee523a2206206994597C13D831ec7`）。
* **名称**：代币的全称（例如 `"Tether USD"`）。
* **符号**：代币的交易符号（例如 `"USDT"`）。
* **小数位数**：代币的精度（例如 `6` 或 `18`）。

### 分步操作指南

#### 步骤 1：获取治理模块地址（权限主体）

治理模块账户地址作为 `authority`，负责签署并执行提案。要在你的节点上查找此地址，请运行：

```bash
inferenced query auth module-accounts --node $SEED_URL/chain-rpc/ | grep -B2 'name: gov'
```

复制返回的 Cosmos 地址（例如，`cosmos1...gov...`）。

#### 步骤 2：准备提案文件

创建一个名为 `register_token_proposal.json` 的文件。该提案将在 `messages` 数组中包含 `MsgRegisterTokenMetadata` 消息，用于注册代币元数据（名称、符号、小数位数）。

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
  "deposit": "10000000ngonka",
  "title": "Register Wrapped SYMBOL Token Metadata",
  "summary": "This proposal registers the metadata for the SYMBOL ERC-20 token bridged from Ethereum on the Gonka chain."
}
```

替换以下占位符：

* `cosmos1...gov...` 替换为你的实际治理模块地址。
* `0xTokenContractAddressOnEthereum` 替换为确切的 ERC-20 合约地址。
* `Token Name`、`SYMBOL` 和 `decimals` 替换为正确的代币信息。
* `deposit` 替换为满足最低存款要求的金额。
* `metadata` 替换为你的提案元数据 URI（可选，可以为空或 IPFS CID）。

#### 步骤 3：提交治理提案

从持有你冷账户密钥的私有设备上运行此交易：

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

#### 步骤 4：充值押金并投票

提交后，从交易日志中获取 `proposal_id`，或查询所有提案：

```bash
inferenced query gov proposals --node $SEED_URL/chain-rpc/
```

如果您的初始存款低于进入投票期所需的最低金额，请进行补足：

```bash
inferenced tx gov deposit <proposal_id> 10000000ngonka \
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

投票期结束后，若提案通过，你可以验证元数据是否已成功注册。

##### 1. 验证元数据

使用链上 API 或命令行工具（CLI）查询代币元数据：

```bash
curl "https://node2.gonka.ai:8433/chain-api/productscience/inference/inference/token_metadata/ethereum/0xTokenContractAddressOnEthereum"
```

##### 2. 验证封装代币余额

当用户将其代币跨链到以太坊上的桥接合约后，Gonka 共识将自动为该代币创建一个对应的 CW-20 封装代币合约，并将铸造的余额分配给用户派生的地址。您可以查询该余额：

```bash
curl "https://node2.gonka.ai:8433/chain-api/productscience/inference/inference/wrapped_token_balances/{gonkaAddress}"
```

##### 3. 每种代币对应一个封装合约

每种以太坊代币在 Gonka 上恰好对应一个封装的 CW-20 合约。首次存款时创建该合约；之后同一类代币的每次存款都将复用同一个合约，因此该代币的所有余额和转账记录都集中在一个地址下。您可以在仪表板中查看封装合约的交易记录，例如：

```text
https://node1.gonka.ai:8443/dashboard/gonka/cosmwasm/105/transactions?contract=<wrappedContractAddress>
```
