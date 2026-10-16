# 抵押品

抵押机制允许参与者锁定GNK代币，以激活其已获得的部分计算证明（PoC）权重。

投票权绝非仅由持有代币决定。GNK代币作为经济抵押品，而非影响力来源。影响力通过持续的计算贡献获得，而锁定GNK抵押品则是参与治理并确保问责的必要条件。

## 关键概念

- 在前180个周期（宽限期）内，无需抵押品。所有参与者无条件获得其全部潜在权重。
- 宽限期结束后，参与者权重的一部分（默认20%）将无条件授予为基础权重。
- 剩余权重（默认80%）为可抵押权重，必须由存入的抵押品支持。这确保了拥有重大治理权力的参与者也承担相应的经济责任。
- 最终的活跃权重是基础权重与由抵押品激活的权重之和。活跃权重用于所有基于PoC权重的治理决策。

假设所有 `$NODE_URL` 是启用了链RPC和链API的节点URL。


## 参数

### 获取当前抵押参数（链上）

```bash
curl "$NODE_URL/chain-api/productscience/inference/inference/params" | jq '.params.collateral_params'
```

- `slash_fraction_invalid` - 对于无效推断，被罚没的抵押品百分比（每个周期最多一次）。
- `slash_fraction_downtime` - 对于宕机（确认PoC失败/监禁），被罚没的抵押品百分比。
- `downtime_missed_percentage_threshold` - 已弃用，未使用。
- `base_weight_ratio` - 主机在无抵押品情况下可拥有的权重比例。
- `collateral_per_weight_unit` - 每单位权重所需的抵押品数量。

## 按权重计算抵押品

要估算完全支持特定权重所需的**最低**抵押品，您需要链上的两个参数：`collateral_per_weight_unit`（每单位权重的成本）和 `base_weight_ratio`（无条件授予、无需抵押品的权重比例）。

只有**可抵押**部分的权重需要支持：

`required_collateral = weight × (1 − base_weight_ratio) × collateral_per_weight_unit`

```bash
WEIGHT=1000

PARAMS=$(curl -s "$NODE_URL/chain-api/productscience/inference/inference/params")

COLLATERAL_PER_UNIT=$(echo "$PARAMS" | jq -r '.params.collateral_params.collateral_per_weight_unit
  | (.value | tonumber) * pow(10; .exponent | tonumber)')

BASE_WEIGHT_RATIO=$(echo "$PARAMS" | jq -r '.params.collateral_params.base_weight_ratio
  | (.value | tonumber) * pow(10; .exponent | tonumber)')

REQUIRED=$(echo "$WEIGHT * (1 - $BASE_WEIGHT_RATIO) * $COLLATERAL_PER_UNIT" | bc -l)
printf "Minimum required collateral: %.0f ngonka\n" "$REQUIRED"
```

例如，使用当前主网参数（`base_weight_ratio = 0.2`，`collateral_per_weight_unit = 4.2`）和 `WEIGHT=1000`，所需的最低抵押品为 `1000 × 0.8 × 4.2 = 3360 ngonka`。

> **为什么是 `(1 − base_weight_ratio)`？** 每个参与者无条件获得 `weight × base_weight_ratio`（默认20%）作为基础权重。只有剩余的 `weight × (1 − base_weight_ratio)`（默认80%）必须由抵押品支持。存入超过此最低金额是安全的，但不会激活超出您潜在权重的额外权重——链会取 `min(collateral-eligible weight, weight that the deposit can cover)`。有关超出最低值的建议，请参阅下面的[推荐缓冲区](#recommended-buffer)部分。

!!! note "宽限期"
    当前周期低于 `grace_period_end_epoch`（默认 `180`）时，无论权重如何，所需抵押品均为**0**，上述公式不适用——所有参与者无条件获得其100%的潜在权重。要检查您所操作的网络是否仍处于宽限期，请将当前周期与 `grace_period_end_epoch` 比较：

    ```bash
    curl -s "$NODE_URL/chain-api/productscience/inference/inference/params" \
      | jq '.params.collateral_params.grace_period_end_epoch'
    ```

    在主网上，宽限期已结束，因此现在需要抵押品。

## 推荐缓冲区

由于PoC权重可能在周期间波动（由于归一化和其他因素），存入精确的最低金额可能导致临时抵押不足。较小的权重可能经历相对更大的波动。建议在抵押水平相对较低时，最多存入2倍金额。这提供了操作安全性，并防止在周期边界时意外减少权重。协议不会自动补充抵押品。

## 存入抵押品

存入抵押品是一个三步流程：检查当前持有的金额，存入额外的 `ngonka`，然后验证新余额。

!!! warning "时机"
    抵押品必须在您希望其生效的周期的PoC验证阶段结束**前**上链。链在每个周期计算下一个周期的权重时，仅读取一次您的当前抵押品余额——没有自动补充。为确保安全，请在节点进入下一个PoC阶段前存入。

### 检查当前抵押品

将 `<GONKA_ACCOUNT_ADDRESS>` 替换为您要检查的地址（您自己的或他人的）。

通过CLI：

```bash
./inferenced query collateral show-collateral <GONKA_ACCOUNT_ADDRESS> \
    --node $NODE_URL/chain-rpc/
```

或通过API：

```bash
curl "$NODE_URL/chain-api/productscience/inference/collateral/collateral/<GONKA_ACCOUNT_ADDRESS>"
```

如果此地址从未存入过抵押品，响应将为空或返回未找到错误——这是预期行为。

### 存入抵押品

始终使用 `ngonka` 币种。交易由参与者**账户密钥（冷密钥）**签名：

```bash
./inferenced tx collateral deposit-collateral <COLLATERAL_SIZE>ngonka \
  --from gonka-account-key \
  --keyring-backend file \
  --node $NODE_URL/chain-rpc/ \
  --chain-id gonka-mainnet \
  --gas auto \
  --gas-adjustment 2.0 \
  --gas-prices 1ngonka
```

要为给定目标权重计算合理的 `<COLLATERAL_SIZE>`，请参阅上面的[按权重计算抵押品](#compute-collateral-per-weight)。有关推荐的安全边际，请参阅[推荐缓冲区](#recommended-buffer)。

存款是**累计**的：多次运行此命令会增加现有余额。要释放锁定的抵押品，请使用 `withdraw-collateral`（参见下面的[提取抵押品](#withdraw-collateral)部分）。

### 验证存款

交易被包含在区块后，使用您自己的地址重新运行第1步的检查。`amount` 字段应等于您之前的余额加上存款金额。

```bash
MY_ADDR=$(./inferenced keys show gonka-account-key -a --keyring-backend file)
curl -s "$NODE_URL/chain-api/productscience/inference/collateral/collateral/$MY_ADDR" | jq
```

存款现已上链。它将在**下一个纪元边界**激活您相应的权重，此时链将在PoC验证阶段结束时重新计算权重。如果您在纪元中间存款，请不要期望权重立即变化——请等待一个纪元。

## 提取抵押品

当您提取抵押品时，它将被移入解绑队列。解绑期持续特定数量的纪元（默认为1个纪元）。在此期间，抵押品仍可能被削减。解绑期间的削减将按比例同时适用于活跃抵押品和仍在解绑队列中的抵押品。换句话说，提取抵押品并不会立即使其脱离削减风险。抵押品在解绑期完成且资金返还至账户余额之前一直可被削减。

解绑期结束后，抵押品将自动返还至您的账户余额。

要查看解绑期（以纪元为单位）：

```bash
curl -s "$NODE_URL/chain-api/productscience/inference/collateral/params" | jq '.params.unbonding_period_epochs'
```

要提取抵押品：

```bash
./inferenced tx collateral withdraw-collateral <COLLATERAL_SIZE>ngonka \
  --from gonka-account-key \
  --keyring-backend file \
  --node $NODE_URL/chain-rpc/ \
  --chain-id gonka-mainnet \
  --gas auto \
  --gas-adjustment 2.0 \
  --gas-prices 1ngonka
```

要查看解绑中的抵押品：

```bash
./inferenced query collateral show-unbonding-collateral <GONKA_ACCOUNT_ADDRESS> \
    --node $NODE_URL/chain-rpc/
```

或通过API：

```bash
curl "$NODE_URL/chain-api/productscience/inference/collateral/unbonding/<GONKA_ACCOUNT_ADDRESS>"
```

## 削减

抵押品可能因以下两种原因被削减：

- **无效推理**——当参与者提交无效的推理结果时。
- **宕机**——当参与者未能通过确认PoC或被监禁时。

当触发削减时，惩罚将按比例同时应用于：

- 参与者的活跃抵押品，以及
- 当前处于解绑队列中的抵押品。

这意味着抵押品在解绑期间仍可被削减。在解绑期完全结束且资金返还至参与者账户余额之前，提取抵押品无法使其免于处罚。

要检查您的抵押品是否因无效推理被削减：

```bash
curl "$NODE_URL/chain-api/cosmos/tx/v1beta1/txs?query=slash_collateral.participant='<GONKA_ACCOUNT_ADDRESS>'"
```

要检查您的抵押品是否因宕机被削减：
```
curl "$NODE_URL/chain-rpc/block_search?query=\"slash_collateral.participant='<GONKA_ACCOUNT_ADDRESS>'\""
curl "$NODE_URL/chain-rpc/block_results?height=<BLOCK_HEIGHT>" | jq '.result.finalize_block_events[] | select(.type == "slash_collateral")'
```

对于在区块处理期间（BeginBlock）发生的自动削减事件（例如监禁），请使用区块搜索RPC。

首先找到发生削减的区块：
```bash
curl "$NODE_URL/chain-rpc/block_search?query=\"slash_collateral.participant='<GONKA_ACCOUNT_ADDRESS>'\""
```

然后查询区块结果以查看削减详情（将 `BLOCK_HEIGHT` 替换为上述找到的高度）：
```bash
curl "$NODE_URL/chain-rpc/block_results?height=<BLOCK_HEIGHT>" | jq '.result.finalize_block_events[] | select(.type == "slash_collateral")'
```

有关常见问题，请参阅[抵押品FAQ](https://gonka.ai/FAQ/#collateral)。
