# 抵押机制

抵押机制允许参与者锁定 GNK 代币，以激活其已获得的“计算量证明”（Proof of Compute, PoC）权重的一部分。

投票权从不单纯来源于持有代币。GNK 代币作为经济抵押品，而非影响力的来源。影响力需通过持续的计算贡献获得，而锁定 GNK 抵押品则是参与治理并承担相应责任的前提。

## 核心概念

- 在前 180 个纪元（宽限期）内，无需抵押。所有参与者无条件获得其全部潜在权重的 100%。
- 宽限期结束后，参与者部分权重（默认为 20%）将作为**基础权重**（Base Weight）无条件授予。
- 剩余权重（默认为 80%）为**可抵押权重**（Collateral-Eligible Weight），必须通过存入抵押品来激活。这确保了拥有较大治理权力的参与者也承担相应的经济责任。
- 最终的**活跃权重**（Active Weight）为基础权重与通过抵押激活的权重之和。活跃权重将用于所有基于 PoC 权重的治理决策。

假设所有 `$NODE_URL` 均为启用了链上 RPC 和链上 API 的节点 URL。

## 参数

### 获取当前抵押参数（链上）

```bash
curl "$NODE_URL/chain-api/productscience/inference/inference/params" | jq '.params.collateral_params'
```

- `slash_fraction_invalid`
 
- 推理无效时被罚没的抵押品比例（每个epoch最多一次）。
- `slash_fraction_downtime`
 
- 因停机（确认PoC失败/被监禁）而被罚没的抵押品比例。
- `downtime_missed_percentage_threshold`
 
- 已弃用，不再使用。
- `base_weight_ratio`
 
- 主机在无需抵押的情况下可拥有的权重比例。
- `collateral_per_weight_unit`
 
- 每单位权重所需的抵押金额。

## 每单位权重的计算抵押额

要估算完全支持特定权重所需的**最低**抵押金额，你需要链上的两个参数：`collateral_per_weight_unit`（每单位权重的成本）和`base_weight_ratio`（无需抵押即可授予的权重部分）。

只有**需要抵押的权重部分**才需要抵押品支持：

`required_collateral = weight × (1 − base_weight_ratio) × collateral_per_weight_unit`

```bash
WEIGHT=1000

PARAMS=$(curl -s "$NODE_URL/chain-api/productscience/inference/inference/params")

COLLATERAL_PER_UNIT=$(echo "$PARAMS" | jq -r '.params.collateral_params.collateral_per_weight_unit
  | (.value | tonumber) * pow(10; .exponent | tonumber)')

BASE_WEIGHT_RATIO=$(echo "$PARAMS" | jq -r '.params.collateral_params.base_weight_ratio
  | (.value | tonumber) * pow(10; .exponent | tonumber)')

REQUIRED=$(echo "$WEIGHT
 * (1
 - $BASE_WEIGHT_RATIO)
 * $COLLATERAL_PER_UNIT" | bc -l)
printf "Minimum required collateral: %.0f ngonka\n" "$REQUIRED"
```

例如，在当前主网参数（`base_weight_ratio = 0.2`, `collateral_per_weight_unit = 4.2`）和 `WEIGHT=1000` 下，所需的最低抵押额为 `1000 × 0.8 × 4.2 = 3360 ngonka`。

> **为什么是 `(1 − base_weight_ratio)`？** 每个参与者无条件获得 `weight × base_weight_ratio`（默认 20%）的基础权重。只有剩余的 `weight × (1 − base_weight_ratio)`（默认 80%）需要由抵押品支持。存入超过此最低要求的抵押品是安全的，但不会激活超出您潜在权重的额外权重——链将采用 `min(collateral-eligible weight, weight that the deposit can cover)`。有关超出最低要求的建议，请参见下方的[推荐缓冲区](#recommended-buffer)部分。

!!! note "宽限期"
    当当前纪元低于 `grace_period_end_epoch`（默认 `180`）时，无论权重如何，所需抵押额均为 **0**，上述公式不适用——所有参与者无条件获得其 100% 的潜在权重。要检查您所运行的网络是否仍处于宽限期内，请将当前纪元与 `grace_period_end_epoch` 进行比较：

 

 
 

 

```bash
    curl -s "$NODE_URL/chain-api/productscience/inference/inference/params" \
      | jq '.params.collateral_params.grace_period_end_epoch'
 
```

    在主网上，宽限期已经结束，因此现在需要提供抵押品。

## 推荐缓冲量

由于 PoC 权重在不同周期之间可能会波动（由于归一化和其他因素），存入恰好最低要求的数量可能导致暂时的抵押不足。较小的权重可能经历相对更大的波动。建议在抵押水平仍然较小时，存入高达所需最低金额 2 倍的抵押品。这可以提供操作安全性，并防止在周期边界处意外降低权重。协议不会自动补充抵押品。

## 存入抵押品

存入抵押品分为三个步骤：检查当前持有的抵押品，存入额外的 `ngonka`，然后验证新的余额。

!!! warning "时间提示"
    抵押品必须在您希望其生效的周期内 **PoC 验证阶段结束前** 上链。链在每个周期计算下一周期权重时，仅读取一次您的当前抵押品余额——不会自动补充。为稳妥起见，请在您的节点进入下一个 PoC 阶段之前完成抵押品存入。

### 1. 检查当前抵押品

将 `<GONKA_ACCOUNT_ADDRESS>` 替换为您想要查询的地址（可以是您自己的或其他人的地址）。

通过 CLI：

```bash
./inferenced query collateral show-collateral <GONKA_ACCOUNT_ADDRESS> \
    --node $NODE_URL/chain-rpc/
```

或通过 API：

```bash
curl "$NODE_URL/chain-api/productscience/inference/collateral/collateral/<GONKA_ACCOUNT_ADDRESS>"
```

如果该地址从未存入过抵押品，则响应将为空或返回“未找到”错误——这是预期行为。

### 2. 存入抵押品

始终使用 `ngonka` 作为面额。该交易由参与者的 **账户密钥（冷密钥）** 签名：

```bash
./inferenced tx collateral deposit-collateral <COLLATERAL_SIZE>ngonka \
  --from gonka-account-key \
  --keyring-backend file \
  --node $NODE_URL/chain-rpc/ \
  --chain-id gonka-mainnet
```

要为给定的目标权重计算合理的 `<COLLATERAL_SIZE>`，请参见上方的[按权重计算抵押品](#compute-collateral-per-weight)部分。关于推荐的安全余量，请参见[推荐缓冲区](#recommended-buffer)。

存款是**累积的**：多次运行此命令会将金额累加到现有余额中。若要释放已锁定的抵押品，请使用 `withdraw-collateral`（参见下方的[提取抵押品](#withdraw-collateral)部分）。

### 3. 验证存款

当交易被包含进区块后，使用你自己的地址重新运行第1步中的检查。此时 `amount` 字段应等于你之前的余额加上本次存入的金额。

```bash
MY_ADDR=$(./inferenced keys show gonka-account-key -a --keyring-backend file)
curl -s "$NODE_URL/chain-api/productscience/inference/collateral/collateral/$MY_ADDR" | jq
```

存款现已上链。它将在**下一个纪元边界**激活你相应的权重，即在 PoC 验证阶段结束时链重新计算权重的时刻。如果你在纪元中途进行存款，请不要期望权重立即发生变化——需等待一个完整的纪元。

## 提取抵押品

当你提取抵押品时，资金将被移入解绑队列。解绑期将持续一定数量的纪元（默认为 1 个纪元）。在此期间，抵押品仍面临被罚没的风险。解绑期间的罚没将按比例适用于仍在活跃状态的抵押品以及仍处于解绑队列中的抵押品。换句话说，提取抵押品并不会立即消除其被罚没的风险。只有在解绑期结束且资金返回账户余额后，抵押品才不再面临罚没风险。

解绑期结束后，抵押品将自动返回至你的账户余额。

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
  --chain-id gonka-mainnet
```

查看未绑定的抵押品：

```bash
./inferenced query collateral show-unbonding-collateral <GONKA_ACCOUNT_ADDRESS> \
    --node $NODE_URL/chain-rpc/
```

或通过 API：

```bash
curl "$NODE_URL/chain-api/productscience/inference/collateral/unbonding/<GONKA_ACCOUNT_ADDRESS>"
```

## 斩击惩罚（Slashing）

抵押品可能因以下两个原因被斩击扣除：

- **无效推理（Invalid inference）** —— 当参与者提交了无效的推理结果时。
- **停机（Downtime）** —— 当参与者未能通过确认 PoC 或被关押（jailed）时。

一旦触发斩击惩罚，罚金将按比例应用于以下两部分：

- 参与者当前的活跃抵押品，以及
- 任何正处于解绑（unbonding）队列中的抵押品。

这意味着，在解绑期间，抵押品仍然可能被斩击扣除。在解绑周期完全结束且资金已退回参与者账户余额之前，撤回抵押品的操作并不能使其免受惩罚。

要检查你的抵押品是否因无效推理而被斩击：

```bash
curl "$NODE_URL/chain-api/cosmos/tx/v1beta1/txs?query=slash_collateral.participant='<GONKA_ACCOUNT_ADDRESS>'"
```

要检查您的抵押品是否因停机而被罚没：
```

curl "$NODE_URL/chain-rpc/block_search?query=\"slash_collateral.participant='<GONKA_ACCOUNT_ADDRESS>'\""
curl "$NODE_URL/chain-rpc/block_results?height=<BLOCK_HEIGHT>" | jq '.result.finalize_block_events[] | select(.type == "slash_collateral")'
```

对于在区块处理期间（如 BeginBlock）发生的自动惩罚事件（例如被监禁），请使用区块搜索 RPC。

首先，找到发生惩罚的区块：

```bash
curl "$NODE_URL/chain-rpc/block_search?query=\"slash_collateral.participant='<GONKA_ACCOUNT_ADDRESS>'\""
```

然后查询区块结果以查看惩罚详情（将 `BLOCK_HEIGHT` 替换为上面找到的高度）：

```bash
curl "$NODE_URL/chain-rpc/block_results?height=<BLOCK_HEIGHT>" | jq '.result.finalize_block_events[] | select(.type == "slash_collateral")'
```

常见问题请参阅[抵押品常见问题解答](https://gonka.ai/FAQ/#collateral)。
