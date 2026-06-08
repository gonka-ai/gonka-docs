# 抵押机制

抵押机制允许参与者锁定 GNK 代币，以激活其已获得的“计算量证明”（Proof of Compute, PoC）权重的一部分。

投票权从不单纯来源于持有代币。GNK 代币作为经济抵押物，而非影响力的来源。影响力通过持续的计算贡献获得，而锁定 GNK 抵押物则是参与治理并承担相应责任的前提条件。

## 核心概念

- 前 180 个纪元（宽限期）内，无需抵押。所有参与者无条件获得其全部潜在权重的 100%。
- 宽限期结束后，参与者权重的一部分（默认为 20%）将作为基础权重（Base Weight）无条件授予。
- 剩余权重（默认为 80%）为可抵押激活权重（Collateral-Eligible Weight），必须通过存入抵押物来支持。这确保了拥有重大治理权力的参与者也承担相应的经济责任。
- 最终的活跃权重（Active Weight）为基础权重与通过抵押激活的权重之和。活跃权重将用于所有基于 PoC 权重的治理决策。

假设所有 `$NODE_URL` 均为已启用链上 RPC 和链上 API 的节点 URL。

## 参数

### 获取当前抵押参数（链上）

```bash
curl "$NODE_URL/chain-api/productscience/inference/inference/params" | jq '.params.collateral_params'
```

- `slash_fraction_invalid`
 - 因无效推理而被罚没的抵押品比例（每个纪元最多一次）。
- `slash_fraction_downtime`
 - 因停机而被罚没的抵押品比例（确认 PoC 失败 / 被关进监狱）。
- `downtime_missed_percentage_threshold`
 - 已弃用，不再使用。
- `base_weight_ratio`
 - 节点在无需抵押品的情况下可拥有的权重比例。
- `collateral_per_weight_unit`
 - 每单位权重所需的抵押品数量。

## 按权重计算抵押品

要估算完全支持某一特定权重所需的**最低**抵押品数量，你需要链上的两个参数：`collateral_per_weight_unit`（每单位权重的成本）和 `base_weight_ratio`（无条件授予、无需抵押品的权重比例）。

只有**需要抵押品支持的权重部分**才需要抵押品来支撑：

`所需抵押品 = 权重 × (1 − base_weight_ratio) × collateral_per_weight_unit`

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

例如，根据当前主网参数（`base_weight_ratio = 0.2`，`collateral_per_weight_unit = 4.2`）且 `WEIGHT=1000` 时，所需的最低抵押金额为 `1000 × 0.8 × 4.2 = 3360 ngonka`。

> **为什么是 `(1 − base_weight_ratio)`？** 每个参与者无条件获得 `weight × base_weight_ratio`（默认为 20%）的基础权重。只有剩余的 `weight × (1 − base_weight_ratio)`（默认为 80%）部分需要由抵押物来支撑。存入超过此最低要求的抵押物是安全的，但不会激活超出你潜在权重的部分——链会取 `min(可抵押支持的权重, 抵押物可覆盖的权重)`。有关超出最低要求的建议，请参见下方的[推荐缓冲](#recommended-buffer)部分。

!!! note "宽限期"
    当当前纪元小于 `grace_period_end_epoch`（默认值为 `180`）时，无论权重多少，所需抵押金额均为 **0**，上述公式不适用——所有参与者将无条件获得其 100% 的潜在权重。要检查你所运行的网络是否仍处于宽限期内，可将当前纪元与 `grace_period_end_epoch` 进行比较。

    ```bash
    curl -s "$NODE_URL/chain-api/productscience/inference/inference/params" \
      | jq '.params.collateral_params.grace_period_end_epoch'
    ```

    在主网上，宽限期已经结束，因此现在需要提供抵押品。

## 推荐缓冲量

由于 PoC 权重在不同周期之间可能会波动（由于归一化及其他因素），存入恰好等于最低要求的数量可能导致暂时的抵押不足。权重较小的节点可能经历相对更大的波动。建议在抵押水平仍较小时，存入高达所需最低金额 2 倍的抵押品。这能提供操作安全性，并防止在周期边界处出现意外的权重降低。协议不会自动补充抵押品。

## 存入抵押品

存入抵押品分为三个步骤：检查当前余额、存入额外的 `ngonka`，然后验证新的余额。

!!! warning "时间提示"
    抵押品必须在您希望其生效的那个周期的 **PoC 验证阶段结束前** 上链。链在每个周期仅在计算下一个周期的权重时读取一次您的当前抵押余额——不会自动补足。为确保安全，请在您的节点进入下一个 PoC 阶段之前完成抵押品的存入。

### 1. 检查当前抵押品

将 `<GONKA_ACCOUNT_ADDRESS>` 替换为您要查询的地址（可以是您自己的或其他人的地址）。

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

请始终使用 `ngonka` 面额。该交易由参与者的**账户密钥（冷密钥）**签名：

```bash
./inferenced tx collateral deposit-collateral <COLLATERAL_SIZE>ngonka \
  --from gonka-account-key \
  --keyring-backend file \
  --node $NODE_URL/chain-rpc/ \
  --chain-id gonka-mainnet
```

要为给定的目标权重计算合理的 `<COLLATERAL_SIZE>`，请参见上方的[按权重计算抵押额](#compute-collateral-per-weight)。有关推荐的安全余量，请参见[推荐缓冲区](#recommended-buffer)。

存款是**累积的**：多次运行此命令会将金额累加到现有余额中。如需释放已锁定的抵押品，请使用 `withdraw-collateral`（参见下方[提取抵押品](#withdraw-collateral)部分）。

### 3. 验证存款

当交易被包含进区块后，使用你自己的地址重新运行第一步中的检查命令。`amount` 字段的值应等于你之前的余额加上本次存入的金额。

```bash
MY_ADDR=$(./inferenced keys show gonka-account-key -a --keyring-backend file)
curl -s "$NODE_URL/chain-api/productscience/inference/collateral/collateral/$MY_ADDR" | jq
```

质押金现已上链。它将在**下一个纪元边界**激活你相应的权重，即在 PoC 验证阶段结束时，链重新计算权重的时刻。如果你在纪元中途进行质押，请不要期望你的权重立即发生变化——请等待一个完整的纪元。

## 提取质押金

当你提取质押金时，资金将被移入一个解绑队列。解绑期将持续特定数量的纪元（默认为 1 个纪元）。在此期间，质押金仍面临被罚没的风险。解绑期间的罚没将按比例适用于仍在活跃状态的质押金以及仍处于解绑队列中的质押金。换句话说，提取质押金并不会立即消除其被罚没的风险。质押金会一直可被罚没，直到解绑期结束，资金才会返还至你的账户余额。

解绑期结束后，质押金将自动返还至你的账户余额。

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

查看解绑抵押品：

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

一旦触发斩击，惩罚将按比例应用于以下两部分：

- 参与者的活跃抵押品（active collateral），以及
- 当前处于解绑队列（unbonding queue）中的任何抵押品。

这意味着在解绑期间，抵押品仍然可能被斩击。在解绑期完全结束且资金已退还至参与者账户余额之前，撤回抵押品的操作无法使其免受惩罚。

要检查您的抵押品是否因无效推理而被斩击：

```bash
curl "$NODE_URL/chain-api/cosmos/tx/v1beta1/txs?query=slash_collateral.participant='<GONKA_ACCOUNT_ADDRESS>'"
```

要检查你的抵押品是否因停机而被罚没：
```
curl "$NODE_URL/chain-rpc/block_search?query=\"slash_collateral.participant='<GONKA_ACCOUNT_ADDRESS>'\""
curl "$NODE_URL/chain-rpc/block_results?height=<BLOCK_HEIGHT>" | jq '.result.finalize_block_events[] | select(.type == "slash_collateral")'
```

对于在区块处理期间（如 BeginBlock）发生的自动惩罚事件（例如被隔离），请使用区块搜索 RPC。

首先找到发生惩罚的区块：
```bash
curl "$NODE_URL/chain-rpc/block_search?query=\"slash_collateral.participant='<GONKA_ACCOUNT_ADDRESS>'\""
```

然后查询区块结果以查看 slash 的详细信息（将 `BLOCK_HEIGHT` 替换为上面找到的高度）：
```bash
curl "$NODE_URL/chain-rpc/block_results?height=<BLOCK_HEIGHT>" | jq '.result.finalize_block_events[] | select(.type == "slash_collateral")'
```

常见问题请参阅[抵押品常见问题解答](https://gonka.ai/FAQ/#collateral)。
