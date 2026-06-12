# 仪表板维护者备忘录 v0.2.13

如果 v0.2.13 升级提案获得通过，并且主网成功执行升级，各仪表板需要更新其 CPoC 确认权重的计算方式，并在升级后刷新缓存。

此要求适用于 Gonkascan 及其他类似的仪表板部署。

## 仪表板主要影响

### 1. 新的确认权重计算方式

仪表板在计算 `weight_to_confirm` 时，必须使用链上提供的 `confirmation_weight_scales` 快照。

简而言之：仪表板不应再假设始终可以使用当前参数加上子组模型。现在，链会在每个 epoch 快照记录哪些模型计入 CPoC 以及对应的缩放因子。

这是本次升级对仪表板逻辑的主要且必需的变更。

v0.2.13 升级中的代码参考：

- `inference-chain/proto/inference/inference/epoch_group_data.proto`: `EpochGroupData.confirmation_weight_scales` 和 `ConfirmationWeightScale`
- `inference-chain/x/inference/module/confirmation_weight_scales.go`: `buildConfirmationWeightScales`
- `inference-chain/x/inference/types/weight.go`: 确认权重计算的辅助函数

实施指导：

1. 获取根 epoch 组数据：

 

 
 

```text
   /chain-api/productscience/inference/inference/current_epoch_group_data
   /chain-api/productscience/inference/inference/epoch_group_data/{epoch_id}
 
 
 
```

2. 如果根目录 `epoch_group_data.confirmation_weight_scales` 存在且非空，则将其作为事实来源。

3. 仅遍历 `confirmation_weight_scales` 中的条目。不要额外包含未在 `sub_group_models` 中出现的根目录 `confirmation_weight_scales` 条目。

4. 对于每个缩放条目：

 

 
 

```text
   model_id
   weight_scale_factor
 
 
 
```

   获取该模型子组：

 

 
 

```text
   /chain-api/productscience/inference/inference/epoch_group_data/{epoch_id}?model_id={model_id}
 
 
 
```

5. 在该子组中找到参与方的 `validation_weights`。

6. 根据该子组的 ML 节点计算原始模型权重：

 

 
 

```text
   raw_model_weight = sum(validation_weight.ml_nodes[].poc_weight)
 
 
 
```

   不要使用根节点 `validation_weight.weight` 作为此分母。

7. 对每个模型的贡献进行缩放和取整：

 

 
 

```text
   scaled_model_weight = floor(raw_model_weight
 * weight_scale_factor)
 
 
 
```

8. 对所有 `confirmation_weight_scales` 项求和：

 

 
 

```text
   weight_to_confirm = sum(scaled_model_weight)
 
 
 
```

9. 使用根节点 `validation_weights[].confirmation_weight` 作为确认的分子。

1
1
0. 如果链上参与者数据包含 `current_epoch_stats.confirmationPoCRatio`，则优先将其作为权威显示比率。

1
1
1. 若无权威链上比率，本地估算值仍为：

 

 
 

 

```text
    min((confirmation_weight / weight_to_confirm) / 0.909, 1.0)
 
 
 
 
```

遗留回退机制：

- 如果 `confirmation_weight_scales` 缺失或为空，则对较早的纪元沿用旧逻辑：使用根级 `sub_group_models` 加上当前或历史参数模型的缩放因子。
- 此回退机制仅适用于 v0.2.13 之前的版本数据。对于 v0.2.13 及之后的纪元，应优先使用快照。

说明：在简单场景下，新方法与旧方法结果一致是正常现象，特别是当唯一经过确认权重缩放的模型，其子组权重等于其所有 ML 节点 PoC 权重之和时。关键变化在于数据的“事实来源”：`confirmation_weight_scales`。

### 2. 升级后需重置缓存

v0.2.13 版本升级会就地修改部分现有链上数据。它会回填确认权重的缩放系数，可能更新确认权重，更改模型缩放参数，并新增 MiniMax 机制。

简而言之：仪表盘中可能仍缓存着升级前的旧数据，而链上数据已是修正后的新值。

在完成 v0.2.13 升级后，必须清除或重置仪表盘的缓存。仅重新部署可能不够，除非同时清除了仪表盘的缓存数据库或存储卷。如果缓存数据库在重新部署后仍保留，则需手动删除/重置，或添加管理员缓存重置接口。

此操作应包括当前纪元的数据行及近期的奖励总计。由于奖励值是从链上摘要读取的，因此这并非前端公式变更需求，而主要是避免继续使用旧的缓存总额。

例如，在 Gonkascan 中，这意味着需从缓存数据库中清除 `participant_rewards` 和 `epoch_total_rewards` 的近期记录，以便现有的奖励轮询机制能重新从链上获取 `epoch_performance_summary`。

可能的操作步骤：

```text
After chain upgrade:
- redeploy dashboard
- clear dashboard cache/current epoch cache
- recalculate recent reward totals
```

在执行主要工作时进行的小检查：

- 由于 v0.2.13 版本升级引入了 MiniMax，需确保仪表板从链状态读取模型 ID，而不是从硬编码列表中读取。
- 确保 MiniMax 作为新模型的出现不会破坏模型/参与者显示。

## 实用检查清单

- 更新仪表板 CPoC `weight_to_confirm` 的逻辑以支持 `confirmation_weight_scales`。
- 仅当存在该快照时，迭代 `confirmation_weight_scales` 中列出的模型。
- 使用子组 ML 节点 `poc_weight` 的总和作为每个模型的原始分母。
- 在链上数据存在时，继续优先使用链上 `current_epoch_stats.confirmationPoCRatio` 数据。
- 升级后，重置仪表板缓存，或清除缓存数据库后重新部署。
- 作为缓存重置的一部分，重新计算最近的奖励总额。
- 检查参与者表格和弹窗中权重、抵押、奖励和确认率的显示是否正确。
