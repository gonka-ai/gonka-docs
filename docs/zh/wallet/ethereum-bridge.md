# 以太坊-Gonka 跨链桥指南

!!! warning
    为避免不必要的代币损失，在跨链桥完全激活的官方公告发布之前，请勿使用本指南中的说明。

由 Gonka 共识控制的专用跨链桥智能合约已在以太坊上激活，地址为：

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

该跨链桥允许您进行以下资产的转移：

* 将 **ERC-20 代币**（例如 USDT）从以太坊转移到 Gonka，反之亦然。
* 将 **以太坊原生代币 (ETH)** 转移到 Gonka（作为包装的 WETH），反之亦然。
* 将 **Gonka 原生代币 (GNK)** 转移到以太坊（作为包装的 WGNK），反之亦然。

---

## 概述

### 将 ERC-20 代币（如 USDT）从以太坊包装转移至 Gonka
1. **充值 (Deposit)**：ERC-20 代币的所有者将代币发送到以太坊上的跨链桥智能合约地址。
2. **锁定与铸造 (Locking & Minting)**：代币在合约中被锁定。一旦该交易被 Gonka 共识确认，跨链桥将在 Gonka 链上铸造该 ERC-20 代币的包装版本（作为 CW-20 代币）。每个包装资产都有一个由跨链桥生成的唯一代币地址。
3. **所有权分配 (Ownership)**：铸造完成后，包装代币的所有权将被分配给对应的 Gonka 地址（该地址由所有者在以太坊上使用的同一私钥/公钥对派生而来）。自此，所有者可以自由地将包装代币转账给任何其他 Gonka 账户。

!!! note
    Gonka 侧的包装代币必须通过链上治理提案进行注册。最初，官方的 USDT 和 USDC 代币已被预先注册。有关如何注册新代币的说明，请参阅下方[如何注册新的跨链桥代币](#如何注册新的跨链桥代币)部分。

### 解包 / 提取回以太坊
1. **请求 (Request)**：所有者在 Gonka 链上提交一个特殊的提取交易。这将锁定/销毁包装代币，并触发 BLS 签名生成。
2. **签名检索 (Signature Retrieval)**：使用提供的 API 端点检查签名生成的进度和状态。
3. **执行 (Execution)**：BLS 签名生成后，可用于向以太坊上的跨链桥合约发送提取命令。合约验证签名及其他必要参数，然后将原始代币释放到目标以太坊地址。

### 将原生 GNK 包装转移至以太坊 (WGNK)
1. **托管 (Escrow)**：通过一笔特殊交易将 GNK 锁定在托管账户中，并触发 BLS 签名生成。
2. **执行 (Execution)**：将生成的 BLS 签名提交至以太坊上的跨链桥合约，从而向目标以太坊地址铸造 WGNK。

### 将原生 ETH 包装转移至 Gonka (WETH)
1. **充值 (Deposit)**：将 ETH 转移至以太坊上的跨链桥合约并进行锁定。
2. **铸造 (Minting)**：一旦该交易被 Gonka 共识确认，跨链桥将在 Gonka 链上铸造包装 ETH (WETH) 作为 CW-20 代币，并将其分配给由所有者私钥派生出的 Gonka 地址。

---

## 如何将 USDT 从以太坊包装转移至 Gonka

如果您想使用已持有 USDT 的现有以太坊地址，请使用相同的私钥生成一个 Gonka 地址，该 Gonka 地址将接收包装后的代币。

如果您想使用现有的 Gonka 地址，请使用相同的私钥生成对应的以太坊地址，向其充值 USDT，并确保该地址有足够的 ETH 用于支付 Gas 费用。

### A) 向以太坊上的跨链桥合约发送 USDT

向跨链桥合约执行转账操作：

```javascript
const tx = await usdtContract.transfer(
  "0x972a7a92d92796a98801a8818bcf91f1648f2f68",   // 跨链桥合约地址
  amountBN                                        // BigNumber 数量
);
await tx.wait();
```

### B) 在 Gonka 上检查包装代币的余额

查询您的 Gonka 地址拥有的包装代币：

```bash
curl "https://node2.gonka.ai:8433/chain-api/productscience/inference/inference/wrapped_token_balances/{gonkaAddress}"
```

#### 响应示例
```json
{
  "balances": [
    {
      "token_info": {
        "chainId": "ethereum",
        "contractAddress": "0xUSDTContractAddress",
        "wrappedContractAddress": "gonka1CW20WrappedUSDTAddress"
      },
      "symbol": "USDT",
      "balance": "100000",
      "decimals": "6",
      "formatted_balance": "0.1"
    }
  ]
}
```

### C) 在 Gonka 上转账包装的 USDT

使用上述查询返回的包装 CW-20 代币合约地址 (`gonka1CW20WrappedUSDTAddress`)：

```bash
export WUSDT_CONTRACT="gonka1CW20WrappedUSDTAddress"

./inferenced tx wasm execute $WUSDT_CONTRACT \
  '{"transfer":{"recipient":"gonka1xxxxxxxx...","amount":"123456"}}' \
  --from <your_key_name> \
  --chain-id gonka-mainnet \
  --gas auto
```

#### 输出示例
```text
...
txhash: 39E3D4B86CF6B0C8952C789F4D73DB9FE27DEA4BD25F3842BE9298C78980A51D
```

等待 2-3 个区块生成，然后检查交易状态：

```bash
./inferenced query tx 39E3D4B86CF6B0C8952C789F4D73DB9FE27DEA4BD25F3842BE9298C78980A51D
```

!!! tip
    返回状态中的 `"code": 0` 表示转账成功。
    请注意，`--gas auto` 可能会导致错误的 Gas 估算。如果交易失败，状态响应中会显示实际所需的 Gas 数量。您只需手动指定 Gas 限制并重新尝试即可（例如：`--gas 200000`）。

---

## 如何将包装的 USDT 提取回以太坊

### A) 在 Gonka 上发送提取请求

使用 CLI 发起提取交易：

```bash
./inferenced tx wasm execute <gonka1CW20WrappedUSDTAddress> \
  '{"withdraw":{"amount":"<amount>","destination_address":"0xYourEthereumAddr"}}' \
  --from <your_key_name> \
  --chain-id gonka-mainnet \
  --gas auto \
  -y \
  --node http://node2.gonka.ai:8000/chain-rpc/
```

!!! tip
    如果 `--gas auto` 的估算不准确，请根据返回状态中所需的 Gas 额度，并在命令中显式传递它（例如：`--gas 200000`）。

#### 预期输出
```text
...
txhash: 12E8ABCA5A35D73042564FDF6D686424F742414EEC172450AB6EDA34BD1F0805
```

### B) 获取提取凭证与请求 ID

等待几个区块生成，然后查询交易哈希以获取请求 ID：

```bash
./inferenced query tx 12E8ABCA5A35D73042564FDF6D686424F742414EEC172450AB6EDA34BD1F0805
```

确保输出中包含 `"code": 0`（表示成功），并提取 Base64 编码的 `request_id`：

```json
"request_id": "vSTWiN1pvooxcFoDLzePCEq3x/C5NQ+jFMvfcEozCm4="
```

将 Base64 编码的 `request_id` 转换为十六进制格式：

```bash
echo "vSTWiN1pvooxcFoDLzePCEq3x/C5NQ+jFMvfcEozCm4=" | base64 -d | xxd -p -c 256
```
**十六进制输出示例：**
```text
bd24d688dd69be8a31705a032f378f084ab7c7f0b9350fa314cbdf704a330a6e
```

### C) 获取 BLS 签名状态

使用您的请求 ID 十六进制值查询 BLS 签名 API：

```bash
curl "https://node2.gonka.ai:8433/v1/bls/signatures/<REQUEST_ID_HEX>" \
  | jq -r '
    {
      uncompressed_signature_128: .uncompressed_signature_128,
      current_epoch_id: .signing_request.current_epoch_id,
      request_id: .signing_request.request_id
    }
  '
```

响应包含以下字段：
* `current_epoch_id`：该请求对应的纪元 (Epoch)。
* `request_id`：在 Gonka 上使用的 32 字节哈希。
* `uncompressed_signature_128`：在以太坊上执行提取所需的 BLS 签名。

### D) 在以太坊上提交提取命令

使用 [withdraw-tokens.js](https://github.com/gonka-ai/gonka/blob/gm/contracts/proposals/ethereum-bridge-contact/withdraw-tokens.js) 脚本：

```bash
HARDHAT_NETWORK=mainnet node withdraw-tokens.js \
  0x972a7a92d92796a98801a8818bcf91f1648f2f68 \
  <current_epoch_id> \
  <request_id> \
  <destination_address> \
  <USDT_contract_address> \
  <amount> \
  <uncompressed_signature_128>
```

---

## 在 Gonka 与以太坊之间转移 GNK (WGNK)

### A) 请求在以太坊上铸造 WGNK

使用 CLI 提交跨链桥铸造请求：

```bash
./inferenced tx inference request-bridge-mint \
  <amount> \
  "0xYourEthereumAddr" \
  "ethereum" \
  --from <your_key_name> \
  --chain-id gonka-mainnet \
  --gas auto \
  -y \
  --node http://node2.gonka.ai:8000/chain-rpc/
```

!!! tip
    如果 `--gas auto` 的估算不准确，请根据返回状态中所需的 Gas 额度，并在命令中显式传递它（例如：`--gas 200000`）。

#### 预期输出
```text
...
txhash: 12E8ABCA5A35D73042564FDF6D686424F742414EEC172450AB6EDA34BD1F0805
```

等待几个区块生成，然后检查状态：

```bash
./inferenced query tx 12E8ABCA5A35D73042564FDF6D686424F742414EEC172450AB6EDA34BD1F0805
```

确认 `"code": 0` 并提取 Base64 编码的 `request_id`：

```json
"request_id": "vSTWiN1pvooxcFoDLzePCEq3x/C5NQ+jFMvfcEozCm4="
```

将 Base64 编码的 `request_id` 转换为十六进制格式：

```bash
echo "vSTWiN1pvooxcFoDLzePCEq3x/C5NQ+jFMvfcEozCm4=" | base64 -d | xxd -p -c 256
```
**十六进制输出示例：**
```text
bd24d688dd69be8a31705a032f378f084ab7c7f0b9350fa314cbdf704a330a6e
```

### B) 获取 BLS 签名状态

使用您的请求 ID 十六进制值查询 BLS 签名 API：

```bash
curl "https://node2.gonka.ai:8433/v1/bls/signatures/<REQUEST_ID_HEX>" \
  | jq -r '
    {
      uncompressed_signature_128: .uncompressed_signature_128,
      current_epoch_id: .signing_request.current_epoch_id,
      request_id: .signing_request.request_id
    }
  '
```

### C) 在以太坊上提交提取命令

使用 [mint-wgnk.js](https://github.com/gonka-ai/gonka/blob/gm/contracts/proposals/ethereum-bridge-contact/mint-wgnk.js) 脚本向以太坊上的跨链桥合约提交铸造命令：

```bash
HARDHAT_NETWORK=mainnet node mint-wgnk.js \
  0x972a7a92d92796a98801a8818bcf91f1648f2f68 \
  <current_epoch_id> \
  <request_id> \
  <0xYourEthereumAddr> \
  <amount> \
  <uncompressed_signature_128>
```

---

## 如何注册新的跨链桥代币

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
  "deposit": "10000000ngonka",
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
inferenced tx gov deposit <proposal_id> 10000000ngonka \
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
```
