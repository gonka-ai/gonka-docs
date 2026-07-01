# 定价

网络采用自动动态定价机制来计算推理成本。
每个模型都有一个实时AI代币价格，该价格基于实际需求和利用率指标在每个区块中重新计算。

!!! note "这是网络价格，而非您支付给经纪人的价格"
    此处描述的机制设定了**协议层面的链上每推理单位价格**。如果您通过[社区经纪人](../developer/quickstart.md#11-pick-a-broker)访问Gonka，经纪人是独立的转售方，会在该价格基础上自行设定零售价格、支付方式和速率限制，并可能覆盖其自身成本。因此，您实际支付的价格因经纪人而异，请查阅每个经纪人的条款，选择最适合您的方案。

## 定价机制

- 系统以区块为单位监控每个模型的使用情况。
- 对于每个模型：
    - 如果利用率高于目标 → 价格上升。
    - 如果利用率低于目标 → 价格下降。
- 调整幅度受每个区块最大增减率限制，以保持稳定性。
- 价格直接以代币表示。

## 价格调整算法
动态定价系统的核心是一个稳定性区域模型，该模型自动调整价格，以在可接受的利用率范围内维持网络利用率最优和价格稳定。系统采用基于区块的调整机制，定义了稳定性区域和最大变化限制。

### 稳定性区域模型
系统为网络利用率定义了一个40%至60%的稳定性区域，在此范围内价格保持不变。超出此区域时，价格将进行调整以促使利用率回归最优范围。计算过程如下：

1. **当前利用率计算**：在每个区块结束时，系统根据当前区块和近期区块历史中的推理请求数量与预估网络容量计算近期利用率。
2. **稳定性区域检查**：如果利用率为40%至60%，则不进行价格调整，以在正常网络运行期间保持价格稳定。
3. **价格调整**：如果利用率低于40%，价格下降以鼓励更多使用；如果利用率高于60%，价格上升以抑制需求。
4. **线性价格调整**：价格变化与利用率偏离稳定性区域的程度成正比，弹性参数决定在极端利用率水平（0%或100%）时的最大变化幅度。

??? note "价格调整公式"
    价格计算遵循以下公式，类似于以太坊的EIP-1559，但每个模型独立计算：

    ```
    // Calculate per-model utilization and pricing
    for each_model in active_epoch_models:
        model_capacity = get_cached_capacity(model_id)  // from capacity/{model_id} KV store
        model_utilization = model_tokens_processed_in_recent_blocks[model_id] / model_capacity
    
        if model_utilization >= 0.40 and model_utilization <= 0.60:
            // Stability zone - no price change
            new_model_price[model_id] = previous_model_price[model_id]
        else if model_utilization < 0.40:
            // Below stability zone - decrease price
            utilization_deficit = 0.40 - model_utilization
            adjustment_factor = 1.0 - (utilization_deficit * price_elasticity)
            new_model_price[model_id] = previous_model_price[model_id] * adjustment_factor
        else:
            // Above stability zone - increase price
            utilization_excess = model_utilization - 0.60
            adjustment_factor = 1.0 + (utilization_excess * price_elasticity)
            new_model_price[model_id] = previous_model_price[model_id] * adjustment_factor
    
        // Ensure price never goes below 1 nicoin per token
        new_model_price[model_id] = max(new_model_price[model_id], min_per_token_price)
    ```

    在默认弹性为0.05的情况下，每个模型独立计算如下：

    - 最大价格变化：每个区块每模型最多变化2%（当模型利用率达到0%或100%时）
    - 在20%模型利用率时：该模型每区块价格下降1%
    - 在80%模型利用率时：该模型每区块价格上升1%
    - 价格下限：永不跌破1 nicoin，以防止零成本场景并维持网络经济性
    - 独立定价：每个模型的价格根据其自身需求和容量独立调整

最低价格1 nicoin是一种技术和经济保障：

    - 防止零定价导致的计算问题
    - 确保参与者始终获得最低补偿
    - 即使在极低需求时也能维持网络激励结构
    - 使用最小面额单位，使其在实际中可忽略不计，同时避免边缘情况

## 查询当前定价
当前网络定价配置可从任何活跃节点查询。
```
curl http://node2.gonka.ai:8000/v1/governance/pricing | jq
```
示例响应：
```
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   175  100   175    0     0    315      0 --:--:-- --:--:-- --:--:--   314
{
  "unit_of_compute_price": 100,
  "models": [
    {
      "id": "MiniMaxAI/MiniMax-M2.7",
      "units_of_compute_per_token": 10000,
      "price_per_token": 1
    }
  ],
  "dynamic_pricing_enabled": true
}
```

## 支持的面额

链上唯一有效的面额是 `ngonka`。所有余额、费用和交易必须 exclusively 使用 `ngonka`。
Cosmos SDK 可能允许定义其他面额，但这些面额无效——SDK 不会在它们之间进行自动转换。
`gonka` 仅用作链下、面向人类的显示单位。它代表10亿 `ngonka`，在链上并不存在。

**有效单位**

| 单位 | 用途 | 链上？ | 比率 |
|--------|----------------------------------|-----------|--------------------------------------|
| `ngonka` | 网络使用的基单位 | 是 | 1 |
| `gonka` | 人类可读的显示单位 | 否 | 1 `gonka` = 1,000,000,000 `ngonka` |

## 收益与经济影响

动态定价系统提供了若干经济和运营优势：

- **每模型市场效率**。为每个AI模型自动发现价格，确保推理成本反映特定模型的真实供需状况，从而实现更高效的资源配置和公平定价，兼顾不同的计算需求和流行程度。
- **模型特定的网络稳定性**。通过为每个模型设定最优利用率水平，系统防止了热门模型的网络拥塞和专用模型的利用率不足，确保整个模型组合的服务质量一致。
- **增强的参与者激励**。动态定价为参与者创造了更强的经济激励：
    - 支持多样化的模型组合以捕捉不同的定价机会
    - 为资源密集型模型维护高性能节点
    - 根据需求模式优化其跨模型的资源分配
    - 在支持的模型需求高峰期保持在线
- **模型感知的开发者体验**。可预测的每模型定价算法结合宽限期，为开发者提供：
    - 针对特定模型更好的成本预测能力
    - 关于模型需求和资源需求的明确经济信号
    - 根据使用场景灵活选择最优模型的能力
    - 在所有模型上无成本障碍的早期开发机会

## 参考文献

- [Tokenomics V2 提案：动态定价](https://github.com/gonka-ai/gonka/blob/dl/tokenomics-v2/proposals/tokenomics-v2/dynamic-pricing.md)
- [动态定价任务计划](https://github.com/gonka-ai/gonka/blob/dl/tokenomics-v2/proposals/tokenomics-v2/dynamic-pricing-todo.md)
