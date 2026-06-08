# 仪表板维护者备忘录 v0.2.13

如果 v0.2.13 升级提案获得通过，并且在主网上成功执行了升级，则各仪表板需要更新其计算 CPoC 确认权重的方式，并在升级后刷新缓存。

此要求适用于 Gonkascan 及其他类似的仪表板部署。

## 仪表板主要影响

### 1. 新的确认权重计算方式

仪表板在计算 `weight_to_confirm` 时，必须使用链上提供的 `confirmation_weight_scales` 快照。

简而言之：仪表板不应再假定始终可以使用当前参数加上子组模型。现在，链会为每个纪元快照记录哪些模型计入 CPoC 以及对应的缩放因子。

这是本次升级中仪表板逻辑必须做出的主要变更。

v0.2.13 升级中的代码参考：

- `inference-chain/proto/inference/inference/epoch_group_data.proto`：`EpochGroupData.confirmation_weight_scales` 和 `ConfirmationWeightScale`
- `inference-chain/x/inference/module/confirmation_weight_scales.go`：`buildConfirmationWeightScales`
- `inference-chain/x/inference/types/weight.go`：确认权重计算的辅助函数

实施指引：

1. 获取根纪元组数据：

   ```text
   /chain-api/productscience/inference/inference/current_epoch_group_data
   /chain-api/productscience/inference/inference/epoch_group_data/{epoch_id}
   ```

2. 如果根级 `epoch_group_data.confirmation_weight_scales` 存在且非空，则将其作为真实数据源。

3. 仅遍历 `confirmation_weight_scales` 中的条目，不要额外包含未出现在 `confirmation_weight_scales` 中的根级 `sub_group_models` 条目。

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

6. 从该子组的机器学习节点计算原始模型权重：

   ```text
   raw_model_weight = sum(validation_weight.ml_nodes[].poc_weight)
   ```

   不要使用根目录的 `validation_weight.weight` 作为此分母。

7. 对每个模型的贡献进行缩放和下限截断：

   ```text
   scaled_model_weight = floor(raw_model_weight * weight_scale_factor)
   ```

8. 对所有 `confirmation_weight_scales` 条目求和：

   ```text
   weight_to_confirm = sum(scaled_model_weight)
   ```

9. 使用根目录下的 `validation_weights[].confirmation_weight` 作为已确认的分子。

1
10. 如果链参与者数据包含 `current_epoch_stats.confirmationPoCRatio`，则优先将其作为权威的显示比率。

1
11. 如果没有权威的链上比率，本地估算值仍为：

    ```text
    min((confirmation_weight / weight_to_confirm) / 0.909, 1.0)
    ```

遗留回退机制：

- 如果 `confirmation_weight_scales` 缺失或为空，则对较早的 epoch 保持原有逻辑：使用根级 `sub_group_models`，并结合当前或历史参数模型的缩放因子。
- 此回退机制仅适用于 v0.2.13 之前的旧数据。对于 v0.2.13 及之后的 epoch，应优先使用快照中的 `confirmation_weight_scales`。

注意：在简单场景下，新方法与旧方法的结果一致是正常现象，特别是当唯一使用确认权重缩放的模型，其子组权重等于其 ML 节点 PoC 权重之和时。关键变化在于“事实来源”：`confirmation_weight_scales`。

### 2. 升级后需重置缓存

v0.2.13 版本升级会就地修改部分现有链上数据。它会回填确认权重缩放因子，可能更新确认权重，更改模型缩放参数，并引入 MiniMax 机制。

简而言之：仪表盘中可能仍缓存了升级前的旧数据，而链上数据已是修正后的值。

在完成 v0.2.13 升级后，必须清除或重置仪表盘缓存。仅重新部署可能不足以解决问题，除非同时清除了仪表盘缓存数据库或存储卷。如果缓存数据库在重新部署后仍保留，则需手动删除/重置，或添加管理员缓存重置接口。

此操作应包括当前 epoch 的记录行和最近的奖励总额。由于奖励值是从链上摘要中读取的，因此这不是前端公式变更的需求，而主要是避免继续使用旧的缓存总额。

例如，在 Gonkascan 中，这意味着需要从缓存数据库的 `participant_rewards` 和 `epoch_total_rewards` 表中清除最近的数据行，以便现有的奖励轮询机制能够重新从链上获取 `epoch_performance_summary`。  

可能的操作步骤：

```text
After chain upgrade:
- redeploy dashboard
- clear dashboard cache/current epoch cache
- recalculate recent reward totals
```

在执行主要工作时的小检查：

- 由于升级 v0.2.13 引入了 MiniMax，需确保仪表板从链状态读取模型 ID，而非从硬编码列表中获取。
- 确保新增 MiniMax 模型不会破坏模型/参与者信息的显示。

## 实用检查清单

- 更新仪表板 CPoC 的 `weight_to_confirm` 逻辑，以适配 `confirmation_weight_scales`。
- 当存在 `confirmation_weight_scales` 快照时，仅遍历其中列出的模型。
- 使用子组 ML 节点的 `poc_weight` 总和作为每个模型的原始分母。
- 若存在链上 `current_epoch_stats.confirmationPoCRatio`，仍优先使用该值。
- 升级后，重置仪表板缓存，或清除缓存数据库后重新部署。
- 作为缓存重置的一部分，重新计算最近的奖励总额。
- 检查参与者表格和弹窗中权重、抵押、奖励及确认率的显示是否正确。
