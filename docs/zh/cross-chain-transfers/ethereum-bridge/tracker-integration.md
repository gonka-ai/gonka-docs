!!! warning
    务必先进行小额测试交易。跨链转账是不可逆的，因此在转移大额资金之前，请先发送少量金额，并确认其如期到账。

由 Gonka 共识控制的专用跨链桥智能合约已在以太坊上激活，合约地址为：

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# 仪表板与追踪器集成

本页面面向希望自行显示或集成 Gonka 跨链桥数据的**仪表板、区块浏览器和追踪器运营商**。所有跨链桥状态均可通过公共链 API 读取——无需特殊访问权限。

以下示例使用 `https://node2.gonka.ai:8443/chain-api/...`；您可以将其指向任何您信任的节点。

## 终端用户仪表板

托管的仪表板已为终端用户提供了跨链桥功能——连接以太坊钱包、推导对应的 `gonka1…` 地址（参见[地址与密钥](addresses-and-keys.md)）、查看包装资产余额，以及发起充值/提现操作：

```text
https://node1.gonka.ai:8443/dashboard/
```

每个合约的 CosmWasm 交易历史（对审计包装代币很有用）可在以下地址查看：

```text
https://node1.gonka.ai:8443/dashboard/gonka/cosmwasm/105/transactions?contract=<wrappedContractAddress>
```

## 跨链桥合约地址（按链划分）

Gonka 接受充值的可信跨链桥合约地址，按链划分：

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/bridge_addresses/ethereum"
```

## 跨链桥交易

列出入站跨链桥交易（正在验证和完成的充值/销毁）：

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/bridge_transactions"
```

通过其源坐标 `(originChain, blockNumber, receiptIndex)` 查找单个交易：

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/bridge_transaction/ethereum/{blockNumber}/{receiptIndex}"
```

每条记录包含 `status`（`BRIDGE_PENDING` 或 `BRIDGE_COMPLETED`）、推导出的 `ownerAddress`（即 `gonka1…` 收款地址）、`amount` 以及验证纪元（epoch）——这些信息足以跟踪一笔转账从"已发现"到"已完成"的全过程。

## 地址的包装代币余额

列出某个 Gonka 地址持有的所有包装代币（CW-20）余额，包括代币符号（symbol）、小数位数（decimals）以及格式化后的可读余额：

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/wrapped_token_balances/{gonkaAddress}"
```

## 代币元数据

通过源链和以太坊合约地址解析已注册的跨链代币名称/符号/小数位数：

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/token_metadata/ethereum/{ethereumContractAddress}"
```

!!! note
    元数据仅存在于已注册的代币中（参见[注册跨链桥代币](register-token.md)）。未注册的代币仍然可以跨链并在余额中显示，但其元数据为空或为默认值。追踪器应优雅地处理缺失的元数据，并回退到原始合约地址。

## 每个代币一个包装合约

每个以太坊代币在 Gonka 上精确映射为**一个**包装后的 CW-20 合约，其键值为 `(chainId, ethereumContractAddress)`。首次充值时会创建该合约；之后同一代币的所有充值都将复用同一个包装合约地址。在索引时，请将该包装的 CW-20 合约地址视为该以太坊代币在 Gonka 上的唯一标识。

## 交易相关查询（流动性池）

如果您同时提供交易数据：

```bash
# 已获批通过流动性池交易的代币
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/approved_tokens_for_trade"

# 验证某个 CW-20 是否为已授权的可交易包装代币
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/validate_wrapped_token_for_trade/{contractAddress}"

# 单例流动性池合约地址 / code id
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/liquidity_pool"
```

## 跨链桥服务状态

去中心化 API 提供了跨链桥数据摄入队列的健康状况，可用于运维监控面板：

```bash
curl "https://node2.gonka.ai:8443/v1/bridge/status"
curl "https://node2.gonka.ai:8443/v1/bridge/addresses?chain=ethereum"
```
