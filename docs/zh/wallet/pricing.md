# 定价机制

网络采用自动动态定价机制来确定推理成本。  
每个模型都有一个实时的 AI 代币价格，该价格会根据实际需求和利用率指标，每区块重新计算一次。

## 定价机制

- 系统以每个区块为单位，监控每个模型的使用情况。
- 对于每个模型：
 
 
   - 如果利用率高于目标值 → 价格上涨。
 
 
   - 如果利用率低于目标值 → 价格下降。
- 每个区块的价格调整幅度受最大涨跌速率限制，以维持价格稳定。
- 价格直接以代币（coins）形式表示。

## 价格调整算法

动态定价系统的核心是一个**稳定区间模型**，它会自动调整价格，以保持网络利用率处于最优水平，同时在可接受的利用率范围内提供价格稳定性。该系统采用基于区块的调整机制，设有明确的稳定区间和最大变动限制。

### 稳定区间模型

系统将网络利用率的稳定区间定义为 40% 至 60%。在此区间内，价格保持不变。一旦超出该区间，价格将进行调整，以引导利用率回归最优范围。具体计算流程如下：

1. **当前利用率计算**：在每个区块结束时，系统根据当前区块及近期区块中处理的推理请求数量，结合预估的网络容量，计算出最近的利用率。
2. **稳定区间检查**：如果利用率处于 40% 到 60% 之间，则不进行价格调整，以在正常网络运行期间维持价格稳定。
3. **价格调整**：若利用率低于 40%，则降低价格以激励更多使用；若高于 60%，则提高价格以抑制过高的需求。
4. **线性价格调整**：价格变化与利用率偏离稳定区间的程度成正比，弹性参数决定了在极端利用率（0% 或 100%）下的最大调整幅度。

??? note "价格调整公式"
    价格计算遵循以下公式，类似于以太坊的 EIP-1559，但为每个模型独立计算：
    
 
 
 
 
```
    // Calculate per-model utilization and pricing
    for each_model in active_epoch_models:
        model_capacity = get_cached_capacity(model_id)  // from capacity/{model_id} KV store
        model_utilization = model_tokens_processed_in_recent_blocks[model_id] / model_capacity
    
        if model_utilization >= 0.40 and model_utilization <= 0.60:
            // Stability zone
 - no price change
            new_model_price[model_id] = previous_model_price[model_id]
        else if model_utilization < 0.40:
            // Below stability zone
 - decrease price
            utilization_deficit = 0.40
 - model_utilization
            adjustment_factor = 1.0
 - (utilization_deficit
 * price_elasticity)
            new_model_price[model_id] = previous_model_price[model_id]
 * adjustment_factor
        else:
            // Above stability zone
 - increase price
            utilization_excess = model_utilization
 - 0.60
            adjustment_factor = 1.0
 + (utilization_excess
 * price_elasticity)
            new_model_price[model_id] = previous_model_price[model_id]
 * adjustment_factor
    
        // Ensure price never goes below 1 nicoin per token
        new_model_price[model_id] = max(new_model_price[model_id], min_per_token_price)
 
 
 
 
```
    
    默认弹性系数为 0.05 时，每个模型独立满足以下条件：

 
   - **最大价格变动**：当模型利用率到达 0% 或 100% 时，每个区块每个模型的价格最多变动 2%
 
   - **20% 利用率时**：该模型每个区块价格下降 1%
 
   - **80% 利用率时**：该模型每个区块价格上升 1%
 
   - **价格下限**：价格永远不会低于 1 尼币（nicoin），以防止零成本情形，维护网络经济机制
 
   - **独立定价**：每个模型的价格根据其自身的需求和容量独立调整

最低价格 1 尼币作为技术和经济上的保障机制：

 
   - 防止因零价格导致的计算问题
 
   - 确保参与者始终获得最低限度的补偿
 
   - 即使在需求极低的情况下也能维持网络激励结构
 
   - 使用最小面额单位，实际影响可忽略不计，同时避免边界异常情况

## 查询当前价格
可以从任意活跃节点查询当前网络的定价配置。
```

curl http://node2.gonka.ai:8000/v1/governance/pricing | jq
```

示例响应：
```
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   175  100   175    0     0    315      0 --:--:-
- --:--:-
- --:--:-
-   314
{
  "unit_of_compute_price": 100,
  "models": [
    {
      "id": "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
      "units_of_compute_per_token": 10000,
      "price_per_token": 1
    }
  ],
  "dynamic_pricing_enabled": true
}
```

## 支持的面额

在链上，唯一有效的面额是 `ngonka`。所有余额、费用和交易必须 exclusively 使用 `ngonka`。  
Cosmos SDK 可能允许定义额外的面额，但这些面额不具备实际操作功能——SDK 不会在它们之间自动进行转换。  
`gonka` 仅用作链下的人类友好型显示单位。它代表 10 亿个 `ngonka`，本身并不存在于链上。

**有效单位**

| 单位 | 用途 | 是否在链上？ | 比例 |
| --- | --- | --- | --- |
| `ngonka` | 网络中使用的基准单位 |  |  |
| `gonka` |  |  |  |
## 优势与经济影响

动态定价系统带来了多项经济和运营优势：

- **按模型的市场效率**。每个 AI 模型的自动价格发现机制确保推理成本反映特定模型的真实供需状况，从而实现更高效的资源分配，并根据不同的计算需求和受欢迎程度实现公平定价。
- **模型级别的网络稳定性**。通过为每个模型设定最优利用率目标，该系统可防止热门模型的网络拥塞以及专业模型的资源闲置，维持整个模型组合的一致服务质量。
- **增强的参与者激励**。动态定价为参与者创造了更强的经济激励，鼓励他们：
 
 
   - 支持多样化的模型组合以捕捉不同的定价机会
 
 
   - 为资源密集型模型维护高性能节点
 
 
   - 根据需求模式优化跨模型的资源配置
 
 
   - 在其支持模型的高峰需求期保持在线
- **面向模型的开发者体验**。可预测的按模型定价算法结合宽限期机制，为开发者提供了：
 
 
   - 对特定模型更精确的成本预测能力
 
 
   - 关于模型需求和资源要求的明确经济信号
 
 
   - 根据使用场景选择最优模型的灵活性
 
 
   - 在所有模型上进行早期开发而无需承担成本障碍

## 参考资料

- [代币经济 V2 提案：动态定价](https://github.com/gonka-ai/gonka/blob/dl/tokenomics-v2/proposals/tokenomics-v2/dynamic-pricing.md)
- [动态定价任务计划](https://github.com/gonka-ai/gonka/blob/dl/tokenomics-v2/proposals/tokenomics-v2/dynamic-pricing-todo.md)
