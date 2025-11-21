# Pricing

!!! note "Symbolic pricing during the initial network phase" 
    During the initial network phase, controlled by the governance parameter `GracePeriodEndEpoch` with a proposed default of 90 epochs (~90 days), the dynamic pricing system is bypassed and all inference costs are set to a purely symbolic level.

The network uses an automatic dynamic pricing mechanism for inference costs.
Each model has a real-time AI token price that is recalculated every block based on actual demand and utilization metrics.

## Pricing Mechanism

- The system monitors usage of every model on a per-block basis.
- For each model:
    - If utilization is above the target → price increases.
    - If utilization is below the target → price decreases.
- Adjustments are bounded by a maximum per-block increase/decrease rate to maintain stability.
- Prices are expressed directly in coins.

## Price Adjustment Algorithm
The core of the dynamic pricing system is a stability zone model that automatically adjusts prices to maintain optimal network utilization while providing price stability within acceptable utilization ranges. The system implements a block-based adjustment mechanism with defined stability zones and maximum change limits.

### Stability Zone Model
The system defines a stability zone for network utilization between 40% and 60%, within which prices remain unchanged. Outside this zone, prices adjust to encourage utilization to return to the optimal range. The calculation process:

1. **Current Utilization Calculation**: At the end of each block, the system calculates the recent utilization based on inference requests processed in the current block and recent block history versus estimated network capacity.
2. **Stability Zone Check**: If utilization is between 40% and 60%, no price adjustment occurs, maintaining price stability during normal network operation.
3. **Price Adjustment**: If utilization is below 40%, prices decrease to encourage more usage. If utilization is above 60%, prices increase to moderate demand.
4. **Linear Price Adjustment**: Price changes are directly proportional to utilization deviation from the stability zone, with the elasticity parameter determining the maximum change at extreme utilization levels (0% or 100%).

??? note "Price Adjustment Formula"
    The price calculation follows this formula, similar to Ethereum's EIP-1559, but calculated separately for each model:
    
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
    
    With the default elasticity of 0.05, this means for each model independently:
    
    - Maximum price change: 2% per block per model (when model utilization reaches 0% or 100%)
    - At 20% model utilization: 1% price decrease per block for that model
    - At 80% model utilization: 1% price increase per block for that model
    - Price floor: Never drops below 1 nicoin to prevent zero-cost scenarios and maintain network economics
    - Independent pricing: Each model's price adjusts based on its own demand and capacity
      
    The minimum price of 1 nicoin serves as a technical and economic safeguard:
    
    - Prevents computational issues with zero pricing
    - Ensures participants always receive minimal compensation
    - Maintains network incentive structure even during extremely low demand
    - Uses the smallest denomination unit, making it effectively negligible while preventing edge cases

## Supported denominations

| Denomination  | Name    | Value        | Description             |
|---------------|---------|--------------|-------------------------|
| coin          | gonka   | 1            | Base unit               |
| milli-coins   | mgonka  | 0.001        | 1 thousandth of gonka   |
| micro-coins   | ugonka  | 0.000001     | 1 millionth of gonka    |
| nano-coins    | ngonka  | 0.000000001  | 1 billionth of gonka    |

## Benefits and Economic Impacts

The dynamic pricing system provides several economic and operational benefits:

- **Per-Model Market Efficiency**. Automatic price discovery for each AI model ensures that inference costs reflect true demand and supply conditions for specific models, leading to more efficient resource allocation and fair pricing that accounts for different computational requirements and popularity levels.
- **Model-Specific Network Stability**. By targeting optimal utilization levels per model, the system prevents both network congestion for popular models and underutilization for specialized models, maintaining consistent service quality across the entire model portfolio.
- **Enhanced Participant Incentives**. Dynamic pricing creates stronger economic incentives for participants to:
    - Support diverse model portfolios to capture different pricing opportunities
    - Maintain high-performance nodes for resource-intensive models
    - Optimize their resource allocation across models based on demand patterns
    - Remain online during peak demand periods for their supported models
- **Model-Aware Developer Experience**. Predictable per-model pricing algorithms combined with the grace period provide developers with:
    - Better cost forecasting capabilities for specific models
    - Clear economic signals about model demand and resource requirements
    - Flexibility to choose optimal models for their use cases
    - Early-stage development opportunities without cost barriers across all models

## References

- [Tokenomics V2 Proposal: Dynamic Pricing](https://github.com/gonka-ai/gonka/blob/dl/tokenomics-v2/proposals/tokenomics-v2/dynamic-pricing.md)
- [Dynamic Pricing Task Plan](https://github.com/gonka-ai/gonka/blob/dl/tokenomics-v2/proposals/tokenomics-v2/dynamic-pricing-todo.md)
