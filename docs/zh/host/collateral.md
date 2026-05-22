# 抵押

抵押机制允许参与者锁定 GNK 代币，以激活其已获得的一部分计算证明（PoC）权重。

投票权绝不会仅仅来源于持有代币。GNK 代币的作用是作为经济抵押品，而不是影响力的来源。影响力是通过持续的计算贡献获得的，而锁定 GNK 抵押是为了确保参与治理的安全性，并强化责任约束机制。

## 关键概念

- 在前 180 个 epoch（宽限期）内，不要求抵押。所有参与者无条件获得其 100% 的潜在权重。
- 宽限期结束后，参与者权重的一部分（默认 20%）作为基础权重（Base Weight）被无条件授予。
- 其余权重（默认 80%）为可抵押权重（Collateral-Eligible Weight），必须有相应的存入抵押作为支持。这确保了拥有重大治理权力的参与者也承担相应比例的经济责任。
- 最终的有效权重（Active Weight）是基础权重与由抵押激活的权重之和。有效权重用于所有基于 PoC 加权的治理决策。

假设所有 `$NODE_URL` 均为启用了 chain rpc 和 chain api 的节点 URL。


## 参数

### 获取当前抵押参数（链上）

```bash
curl "$NODE_URL/chain-api/productscience/inference/inference/params" | jq '.params.collateral_params'
```

- `slash_fraction_invalid` - 因无效推理而被罚没的抵押比例（每个 epoch 最多一次）。
- `slash_fraction_downtime` - 因停机（确认 PoC 失败 / 被隔离）而被罚没的抵押比例。
- `downtime_missed_percentage_threshold` - 已弃用，不再使用。
- `base_weight_ratio` - 主机无需抵押即可拥有的权重比例。
- `collateral_per_weight_unit` - 每单位权重所需的抵押数量。

## 按权重计算抵押 { #compute-collateral-per-weight }

要估算完全支撑特定权重所需的**最低**抵押量，你需要从链上获取两个参数：`collateral_per_weight_unit`（每单位权重的成本）和 `base_weight_ratio`（无需抵押无条件授予的权重比例）。

只有权重中的**可抵押**部分需要支持：

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

例如，在当前主网参数（`base_weight_ratio = 0.2`，`collateral_per_weight_unit = 4.2`）和 `WEIGHT=1000` 的情况下，最低所需抵押为 `1000 × 0.8 × 4.2 = 3360 ngonka`。

> **为什么是 `(1 − base_weight_ratio)`？** 每位参与者无条件获得 `weight × base_weight_ratio`（默认 20%）作为基础权重。只有其余的 `weight × (1 − base_weight_ratio)`（默认 80%）必须由抵押支撑。存入超过此最低值是安全的，但不会激活超过你潜在权重之外的任何额外权重——链取 `min(可抵押权重, 存入金额所能覆盖的权重)`。关于在最低值之上额外存入的指导，请参阅下方的[推荐缓冲](#recommended-buffer)。

!!! note "宽限期"
    当当前 epoch 小于 `grace_period_end_epoch`（默认 `180`）时，无论权重如何，所需抵押都**为 0**，上述公式不适用——所有参与者无条件获得其 100% 的潜在权重。要检查你所在网络上的宽限期是否仍处于活动状态，请将当前 epoch 与 `grace_period_end_epoch` 进行比较：

    ```bash
    curl -s "$NODE_URL/chain-api/productscience/inference/inference/params" \
      | jq '.params.collateral_params.grace_period_end_epoch'
    ```

    主网的宽限期已经结束，因此现在需要抵押。

## 推荐缓冲 { #recommended-buffer }

由于 PoC 权重在不同 epoch 之间可能波动（受规范化和其他因素影响），存入恰好等于最低要求的金额可能会导致临时抵押不足。较小的权重可能会经历相对更大幅度的波动。当抵押水平相对较小时，建议存入最多 2 倍。这提供了运行安全性，可以防止在 epoch 边界时出现意外的权重下降。协议不会自动补充抵押。

## 存入抵押

存入抵押分为三步：检查你当前持有的抵押、存入额外的 `ngonka`，然后验证新的余额。

!!! warning "时机"
    抵押必须在你希望计入抵押的 epoch 的 **PoC 验证阶段结束前**已经在链上。链在每个 epoch 计算下一个 epoch 的权重时，会读取一次你当前的抵押余额——没有自动补充。为安全起见，请在你的节点进入下一个 PoC 阶段之前存入。

### 1. 检查当前抵押

将 `<GONKA_ACCOUNT_ADDRESS>` 替换为你想要检查的地址（你自己的或他人的）。

通过 CLI：

```bash
./inferenced query collateral show-collateral <GONKA_ACCOUNT_ADDRESS> \
    --node $NODE_URL/chain-rpc/
```

或通过 API：

```bash
curl "$NODE_URL/chain-api/productscience/inference/collateral/collateral/<GONKA_ACCOUNT_ADDRESS>"
```

如果该地址从未存入过抵押，响应将为空或返回 not-found 错误——这是预期的。

### 2. 存入抵押

始终使用 `ngonka` 计价单位。交易由参与者的**账户密钥（冷密钥）**签名：

```bash
./inferenced tx collateral deposit-collateral <COLLATERAL_SIZE>ngonka \
  --from gonka-account-key \
  --keyring-backend file \
  --node $NODE_URL/chain-rpc/ \
  --chain-id gonka-mainnet
```

要为给定的目标权重计算合理的 `<COLLATERAL_SIZE>`，请参阅上文的[按权重计算抵押](#compute-collateral-per-weight)。关于推荐的安全边际，请参阅[推荐缓冲](#recommended-buffer)。

存入是**累积的**：多次运行此命令会累加到现有余额。要释放锁定的抵押，请使用 `withdraw-collateral`（见下方的[提取抵押](#withdraw-collateral)）。

### 3. 验证存入

交易被打包进区块后，使用你自己的地址重新执行步骤 1 中的检查。`amount` 字段应等于你之前的余额加上存入金额。

```bash
MY_ADDR=$(./inferenced keys show gonka-account-key -a --keyring-backend file)
curl -s "$NODE_URL/chain-api/productscience/inference/collateral/collateral/$MY_ADDR" | jq
```

存入现已上链。它将在**下一个 epoch 边界**激活相应部分的权重，届时链将在 PoC 验证阶段结束时重新计算权重。如果你在 epoch 中途存入，不要期望权重立即变化——请等待一个 epoch。

## 提取抵押 { #withdraw-collateral }

提取抵押时，它将被转移到解绑队列中。解绑期持续一定数量的 epoch（默认为 1 个 epoch）。在此期间，抵押仍可能被罚没。解绑期内的罚没将按比例应用于活动抵押和仍在解绑队列中的抵押。换言之，提取抵押并不会立即消除其被罚没的风险。抵押在解绑期完成且资金返回到账户余额之前仍可被罚没。

解绑期结束后，抵押将自动返回到你的账户余额。

要检查解绑期（以 epoch 为单位）：

```bash
curl -s "$NODE_URL/chain-api/productscience/inference/collateral/params" | jq '.params.unbonding_period_epochs'
```

要提取抵押：

```bash
./inferenced tx collateral withdraw-collateral <COLLATERAL_SIZE>ngonka \
  --from gonka-account-key \
  --keyring-backend file \
  --node $NODE_URL/chain-rpc/ \
  --chain-id gonka-mainnet
```

要检查解绑中的抵押：

```bash
./inferenced query collateral show-unbonding-collateral <GONKA_ACCOUNT_ADDRESS> \
    --node $NODE_URL/chain-rpc/
```

或通过 API：

```bash
curl "$NODE_URL/chain-api/productscience/inference/collateral/unbonding/<GONKA_ACCOUNT_ADDRESS>"
```

## 罚没（Slashing）

抵押可能因以下两种原因被罚没：

- **无效推理** - 当参与者提交无效推理结果时。
- **停机** - 当参与者未通过确认 PoC 或被隔离（jailed）时。

当触发罚没时，罚款将按比例应用于：

- 参与者的活动抵押，以及
- 当前位于解绑队列中的任何抵押。

这意味着抵押在解绑期间仍可被罚没。提取抵押并不能在解绑期完全结束、资金返回参与者账户余额之前为其免除处罚。

要检查你的抵押是否因无效推理被罚没：

```bash
curl "$NODE_URL/chain-api/cosmos/tx/v1beta1/txs?query=slash_collateral.participant='<GONKA_ACCOUNT_ADDRESS>'"
```

要检查你的抵押是否因停机被罚没：
```
curl "$NODE_URL/chain-rpc/block_search?query=\"slash_collateral.participant='<GONKA_ACCOUNT_ADDRESS>'\""
curl "$NODE_URL/chain-rpc/block_results?height=<BLOCK_HEIGHT>" | jq '.result.finalize_block_events[] | select(.type == "slash_collateral")'
```

对于在区块处理（BeginBlock）期间发生的自动罚没事件（例如隔离），请使用 block search RPC。

首先查找发生罚没的区块：
```bash
curl "$NODE_URL/chain-rpc/block_search?query=\"slash_collateral.participant='<GONKA_ACCOUNT_ADDRESS>'\""
```

然后查询区块结果以查看罚没详情（将 `BLOCK_HEIGHT` 替换为上面找到的高度）：
```bash
curl "$NODE_URL/chain-rpc/block_results?height=<BLOCK_HEIGHT>" | jq '.result.finalize_block_events[] | select(.type == "slash_collateral")'
```

如有常见问题，请参阅[抵押 FAQ](https://gonka.ai/FAQ/#collateral)。
