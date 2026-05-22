# v0.2.13 仪表盘维护者备忘录

如果 v0.2.13 升级提案通过并在主网上成功执行升级，仪表盘将需要更新其计算 CPoC 确认权重的方式，并在升级后刷新缓存。

这适用于 Gonkascan 及其他类似的仪表盘部署。

## 主要的仪表盘影响

### 1. 新的确认权重计算

仪表盘必须使用链上提供的新 `confirmation_weight_scales` 快照来计算 `weight_to_confirm`。

简单理解：仪表盘不应再假设它始终可以使用当前参数加上子组模型。链现在会快照哪些模型计入该 epoch 的 CPoC，以及使用什么比例因子。

这是必需的主要仪表盘逻辑变化。

v0.2.13 升级中的代码引用：

- `inference-chain/proto/inference/inference/epoch_group_data.proto`：`EpochGroupData.confirmation_weight_scales` 和 `ConfirmationWeightScale`
- `inference-chain/x/inference/module/confirmation_weight_scales.go`：`buildConfirmationWeightScales`
- `inference-chain/x/inference/types/weight.go`：用于确认权重计算的辅助函数

实现指引：

1. 获取根 epoch 组数据：

   ```text
   /chain-api/productscience/inference/inference/current_epoch_group_data
   /chain-api/productscience/inference/inference/epoch_group_data/{epoch_id}
   ```

2. 如果根 `epoch_group_data.confirmation_weight_scales` 存在且非空，将其作为可信来源。

3. 仅迭代 `confirmation_weight_scales` 中的条目。不要额外包含 `confirmation_weight_scales` 中不存在的根 `sub_group_models` 条目。

4. 对于每个 scale 条目：

   ```text
   model_id
   weight_scale_factor
   ```

   获取该模型子组：

   ```text
   /chain-api/productscience/inference/inference/epoch_group_data/{epoch_id}?model_id={model_id}
   ```

5. 在该子组的 `validation_weights` 中找到参与者。

6. 从该子组的 ML 节点计算原始模型权重：

   ```text
   raw_model_weight = sum(validation_weight.ml_nodes[].poc_weight)
   ```

   不要将根 `validation_weight.weight` 用作此分母。

7. 对每个模型贡献进行缩放和向下取整：

   ```text
   scaled_model_weight = floor(raw_model_weight * weight_scale_factor)
   ```

8. 对 `confirmation_weight_scales` 中所有条目求和：

   ```text
   weight_to_confirm = sum(scaled_model_weight)
   ```

9. 使用根 `validation_weights[].confirmation_weight` 作为已确认的分子。

10. 如果链上参与者数据具有 `current_epoch_stats.confirmationPoCRatio`，请优先将其作为权威显示比率。

11. 如果没有权威的链上比率，本地估算仍为：

    ```text
    min((confirmation_weight / weight_to_confirm) / 0.909, 1.0)
    ```

回退（Legacy fallback）：

- 如果 `confirmation_weight_scales` 缺失或为空，对较早的 epoch 保留旧逻辑：使用根 `sub_group_models` 加上当前或历史参数的模型比例因子。
- 此回退仅用于 v0.2.13 之前的数据。对于 v0.2.13+ 的 epoch，请优先使用快照。

注意：在简单情况下，新方法和遗留方法匹配是正常的，特别是当唯一被确认权重缩放的模型其子组权重与其 ML 节点 PoC 权重之和相同时。重要的变化在于可信来源：`confirmation_weight_scales`。

### 2. 升级后需要重置缓存

升级 v0.2.13 会就地更改一些现有链上数据。它会回填确认权重比例、可能更新确认权重、更改模型比例参数，并添加 MiniMax。

简单理解：仪表盘可能仍保留有升级前的旧缓存数字，而链现在已具有更正后的数字。

在 v0.2.13 升级后，清除或重置仪表盘缓存。只有在重新部署也清除仪表盘缓存数据库或卷时，仅靠重新部署才够。如果缓存数据库在重新部署后仍然存在，请手动删除/重置，或添加一个管理员缓存重置端点。

这应包括当前 epoch 的行和最近的奖励总计。奖励值是从链摘要读取的，因此这不是新的前端公式要求；主要是不要保留旧的缓存总计。

例如，在 Gonkascan 中，这意味着在缓存数据库中清除 `participant_rewards` 和 `epoch_total_rewards` 中的最近行，以便现有的奖励轮询可以从链上重新获取 `epoch_performance_summary`。

可能的运维步骤：

```text
链升级后：
- 重新部署仪表盘
- 清除仪表盘缓存/当前 epoch 缓存
- 重新计算最近的奖励总计
```

执行主要工作时的小型检查：

- 由于升级 v0.2.13 引入了 MiniMax，请确保仪表盘从链状态读取模型 ID，而不是从硬编码列表。
- 确保 MiniMax 作为新模型出现不会破坏模型/参与者显示。

## 实用清单

- 为 `confirmation_weight_scales` 更新仪表盘 CPoC 的 `weight_to_confirm` 逻辑。
- 当存在快照时，仅迭代 `confirmation_weight_scales` 中列出的模型。
- 使用子组 ML 节点的 `poc_weight` 之和作为每个模型的原始分母。
- 当链上有 `current_epoch_stats.confirmationPoCRatio` 时继续优先使用它。
- 升级后，重置仪表盘缓存或在清除缓存数据库后重新部署。
- 作为缓存重置的一部分，重新计算最近的奖励总计。
- 检查参与者表和模态框中权重、抵押、奖励和确认比率的显示。
