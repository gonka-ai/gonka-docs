# 定价

!!! note "初始网络阶段的象征性定价"
    在初始网络阶段内，由治理参数 `GracePeriodEndEpoch` 控制，其默认提议值为 90 个 epoch（约 90 天）。在此期间，动态定价系统将被跳过，所有推理成本将被设定为象征性水平。

网络对推理费用采用自动动态定价机制。
每个模型都有实时的 AI token 价格，基于实际需求与利用率指标在每个区块重新计算。

## 定价机制

- 系统按区块监控每个模型的使用情况。
- 对于每个模型：
    - 若利用率高于目标 → 价格上调。
    - 若利用率低于目标 → 价格下调。
- 为保持稳定性，单区块的涨跌幅有上限。
- 价格直接以币值计价。

## 价格调整算法
动态定价的核心是“稳定区间模型”，在可接受的利用率范围内保持价格稳定，超出范围则自动调整价格，使网络利用率保持在最优区间。系统实现了基于区块的调整机制，具有明确的稳定区间与最大调整幅度限制。

### 稳定区间模型
系统将 40%–60% 定义为利用率“稳定区间”，在此区间内价格不变。超出该区间时，价格会调整以引导利用率回归最优范围。计算流程如下：

1. 当前利用率计算：在每个区块结束时，根据当前区块与近期区块处理的推理请求量相对估算网络容量计算最近利用率。
2. 稳定区间检查：若利用率在 40%–60% 之间，则不调整价格，维持正常网络运行时的价格稳定。
3. 价格调整：利用率低于 40% 时，下调价格以鼓励更多使用；高于 60% 时，上调价格以抑制需求。
4. 线性价格调整：价格变动与偏离稳定区间的幅度成正比；弹性系数决定在极端利用率（0% 或 100%）下的单区块最大变动。

??? note "价格调整公式"
    定价计算参考以太坊 EIP-1559 的思路，但对每个模型独立计算：
    
    ```
    // 逐模型计算利用率与价格
    for each_model in active_epoch_models:
        model_capacity = get_cached_capacity(model_id)  // 从 capacity/{model_id} KV 读取
        model_utilization = model_tokens_processed_in_recent_blocks[model_id] / model_capacity
    
        if model_utilization >= 0.40 and model_utilization <= 0.60:
            // 稳定区间 - 不调整
            new_model_price[model_id] = previous_model_price[model_id]
        else if model_utilization < 0.40:
            // 低于稳定区间 - 降价
            utilization_deficit = 0.40 - model_utilization
            adjustment_factor = 1.0 - (utilization_deficit * price_elasticity)
            new_model_price[model_id] = previous_model_price[model_id] * adjustment_factor
        else:
            // 高于稳定区间 - 涨价
            utilization_excess = model_utilization - 0.60
            adjustment_factor = 1.0 + (utilization_excess * price_elasticity)
            new_model_price[model_id] = previous_model_price[model_id] * adjustment_factor
    
        // 保底：单 token 不低于 1 nicoin
        new_model_price[model_id] = max(new_model_price[model_id], min_per_token_price)
    ```
    
    在默认弹性 0.05 下，表示对每个模型：
    
    - 最大价格变动：单区块 2%/模型（在 0% 或 100% 利用率极端情况下）
    - 20% 利用率：该模型单区块降价 1%
    - 80% 利用率：该模型单区块涨价 1%
    - 价格下限：不低于 1 nicoin，避免零价并维持网络经济性
    - 独立定价：各模型价格根据自身供需与容量独立调整
      
    1 nicoin 的最低价格兼具技术与经济保障：
    
    - 避免零价格带来的计算问题
    - 确保参与者始终获得最低补偿
    - 即使在极低需求期，也保持网络激励结构
    - 使用最小计价单位，既几乎可忽略，又能有效避免边界问题

## 支持的计价单位

在链上，唯一有效的计量单位是 `ngonka`。所有余额、手续费和交易必须全部使用 `ngonka`。  
Cosmos SDK 虽然允许定义额外的计量单位，但这些单位并不具有实际效用 —— SDK **不会**在它们之间执行任何自动换算。  
`gonka` 仅作为链下、面向用户的显示单位使用。它代表 10 亿（1,000,000,000）`ngonka`，并不存在于链上。

**有效单位（Effective Units）**

| Unit     | 用途（Purpose）               | 链上可用？（On-chain?） | 比例（Ratio）                                |
|----------|-------------------------------|--------------------------|-----------------------------------------------|
| `ngonka` | 网络中的基础单位               | 是（Yes）               | 1                                             |
| `gonka`  | 便于阅读的显示单位（链下）     | 否（No）                | 1 `gonka` = 1,000,000,000 `ngonka`            |

## 经济效益与影响

动态定价带来多方面的经济与运营益处：

- 模型级市场效率：按模型自动发现价格，使推理费用真实反映该模型的供需与计算要求，提升资源分配效率并实现公平定价。
- 面向模型的网络稳定性：按模型目标利用率调节，既避免热门模型拥堵，也减少小众模型闲置，保证整体服务质量一致。
- 更强的参与者激励：动态定价鼓励参与者：
    - 维护多样化模型组合以捕捉不同定价机会
    - 针对重算力模型维持高性能节点
    - 根据需求模式优化模型间资源分配
    - 在所支持模型的峰值时段保持在线
- 友好的开发者体验：可预期的逐模型定价叠加宽限期，为开发者提供：
    - 更好的特定模型成本预测
    - 清晰的需求与资源信号
    - 针对用例选择最优模型的灵活性
    - 所有模型在早期阶段的“零成本”尝试机会

## 参考

- [Tokenomics V2 Proposal: Dynamic Pricing](https://github.com/gonka-ai/gonka/blob/dl/tokenomics-v2/proposals/tokenomics-v2/dynamic-pricing.md)
- [Dynamic Pricing Task Plan](https://github.com/gonka-ai/gonka/blob/dl/tokenomics-v2/proposals/tokenomics-v2/dynamic-pricing-todo.md)
