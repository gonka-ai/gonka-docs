!!! warning 
    始终先进行小额测试交易。桥接转账不可逆，因此在转移大额资金前，请先发送小额资金并确认其按预期到达。

    由 Gonka 共识控制的专用桥接智能合约已部署在以太坊，地址为：

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# 仪表盘与追踪器集成

本页面面向希望自行展示或集成 Gonka 桥接数据的**仪表盘、区块浏览器和追踪器运营者**。所有桥接状态均可通过公共链 API 读取——无需特殊权限。

以下示例使用 `https://node2.gonka.ai:8443/chain-api/...`；您可以将其指向任何您信任的节点。

## 终端用户仪表盘

托管仪表盘已为终端用户提供桥接功能——连接以太坊钱包、推导对应的 `gonka1…` 地址（参见 [地址与密钥](addresses-and-keys.md)）、查看包装余额以及发起存入/提现操作：

```text
https://node1.gonka.ai:8443/dashboard/
```

每个合约的 CosmWasm 交易历史记录（适用于审计包装代币）可在以下地址查看：

```text
https://node1.gonka.ai:8443/dashboard/gonka/cosmwasm/105/transactions?contract=<wrappedContractAddress>
```

## 桥接合约地址（按链划分）

Gonka 接受存款的可信桥接合约地址（按链划分）：

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/bridge_addresses/ethereum"
```

## 桥接交易

列出入站桥接交易（正在验证和完成的存款/销毁）：

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/bridge_transactions"
```

通过原始坐标 `(originChain, blockNumber, receiptIndex)` 查询单笔交易：

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/bridge_transaction/ethereum/{blockNumber}/{receiptIndex}"
```

每条记录包含 `status`（`BRIDGE_PENDING` 或 `BRIDGE_COMPLETED`）、推导出的 `ownerAddress`（`gonka1…` 收款方）、`amount` 以及验证纪元——足以从“已看到”追踪到“已完成”的转账过程。

## 地址的包装代币余额

列出 Gonka 地址持有的所有包装（CW-20）余额，包含代币符号、小数位数和格式化后的余额：

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/wrapped_token_balances/{gonkaAddress}"
```

## 代币元数据

通过源链和以太坊合约地址解析已桥接代币的注册名称/符号/小数位数：

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/token_metadata/ethereum/{ethereumContractAddress}"
```

!!! note 
    元数据仅存在于已注册的代币中（参见 [注册桥接代币](register-token.md)）。未注册的代币仍可桥接并在余额中显示，但元数据为空或默认。追踪器应能优雅处理缺失的元数据，并回退至原始合约地址。

## 每个代币一个包装合约

每个以太坊代币在 Gonka 上仅对应**一个**包装 CW-20 合约，由 `(chainId, ethereumContractAddress)` 键控。首次存款会实例化合约；后续相同代币的存款将复用同一包装地址。在索引时，应将包装 CW-20 合约地址视为该以太坊代币在 Gonka 上的唯一标识。

## 交易相关查询（流动性池）

如果您也展示交易数据：

```bash
# Tokens approved for trading via the liquidity pool
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/approved_tokens_for_trade"

# Validate that a CW-20 is an authorized wrapped token for trading
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/validate_wrapped_token_for_trade/{contractAddress}"

# The singleton liquidity pool contract address / code id
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/liquidity_pool"
```

## 桥接服务状态

去中心化 API 暴露了桥接入队列的健康状况，适用于运维面板：

```bash
curl "https://node2.gonka.ai:8443/v1/bridge/status"
curl "https://node2.gonka.ai:8443/v1/bridge/addresses?chain=ethereum"
```
