# H100 等效值在仪表板上的显示

阅读此内容以了解 v0.2.16 升级提案 112。若通过，升级高度为 6,449,400，预计在 2026 年 10 月 8 日 05:48 UTC。提案 109 未通过。以下系数和权重规则适用于提案 112。

## 该数字的含义

H100 等效值是当前网络奖励权重除以参考 H100 在同一周期内获得的奖励权重：

```text
H100_eq = total_weight / weight_per_h100
```

这是一个奖励权重等效值。它不是物理 GPU 的数量，也不是经过难度标准化的算力。

在第 410 个周期中，`total_weight` 为 **497,724**。它来自 `current_epoch_group_data.total_weight`，等于 24 个活跃参与者 `validation_weights[].weight` 的总和。
所有显示此指标的仪表板均使用该分子。发布的数据不同是因为分母不同。
## 第 410 个周期中各仪表板显示的内容
| 仪表板 | 显示数值 | 分母 |
| --- | --- | --- |
| [gonka.gg](https://gonka.gg/) | 1,102，标注为 "GPU (H100 中位权重)" | 仅包含报告 H100 的主机的实时中位数，包括 H100 PCIe。中位数为 451.7。`497,724 / 451.7 = 1,102` |
| [tracker.gonka.vip](https://tracker.gonka.vip/) | ~1,087 H100 GPU | 相同实时方法，但仅限 `NVIDIA H100 80GB HBM3`。共有四个此类主机，中位数为 457.3。`497,724 / 457.3 = 1,088` |
| [tracker.gonka.hyperfusion.io](https://tracker.gonka.hyperfusion.io/) | ~1,960 H100 GPU | 对所有 ≥ 175 的周期固定使用 `254`。早期周期使用 440，然后是 284。`497,724 / 254 = 1,960` |
| [gonkascan.com](https://gonkascan.com/) | 1,956 个 H100 GPU | 修复 `254.5`，即 2026 年 2 月 19 日标准化后的单个 H100 80GB HBM3 权重（第 176 轮）。`497,724 / 254.5 = 1,956` |
| [gonkahub.com/network](https://gonkahub.com/network) | ~1,960 个 H100 GPU | 图表标注为“权重 ÷ 254.5 (H100 HBM3)” 。使用相同的冻结二月基准。 |
| [gnk.space](https://gnk.space/) | ~1,710 | 修复 `291`。当该 API 字段被设置时，页面使用 `network_weight_h100`。该字段为空，因此页面回退至 `totalWeight / 291`。`497,724 / 291 = 1,710` |

gonka.gg 也显示“总物理 GPU：642”。这是一个不同的指标：活跃主机自报的 GPU 库存。它不是 H100 等效值。当主机更新其硬件报告时，该库存会发生变化。
不得混淆这两类卡。在第 410 轮，一个纯 H100 80GB HBM3 主机每 GPU 产生约 **457** 权重。一个纯 H100 PCIe 主机每 GPU 产生约 **245**。
## 如果 v0.2.16 通过会发生什么变化
查询路径保持不变。奖励权重仍位于 `validation_weights[].weight`。该数字已包含该轮的有效系数，无需再次乘以系数。
`current_epoch_group_data` 的内容会发生变化。在升级轮次及之后，`confirmation_weight_scales[].weight_scale_factor` 被清空，`effective_coefficient` 被设置。升级前形成的轮次仍保留 `weight_scale_factor` 且无 `effective_coefficient`。`poc_params.models[].weight_scale_factor` 在升级时被清空。将其读作实时系数将返回空值。
模型系数开始变动。治理机构为每个模型设定目标算力份额和系数范围。每轮协议在该范围内逐步调整基础系数。超过目标份额的算力按最低系数评分，因此用于奖励权重的有效系数可能低于基础系数。该表格为初始范围，而非后续轮次应用的系数。
初始范围从升级后的下一轮开始生效。升级轮次本身仍保留当前的奖励权重。

| 模型 | 升级时 | 允许范围 | 模型 ID |
| --- | --- | --- | --- |
| MiniMax M2.7 | 0.3024 | 固定为 0.3024 | `MiniMaxAI/MiniMax-M2.7` |
| GLM 5.3 Flash | 0.62 | 0.558–0.682 | `zai-org/GLM-5.3-Flash` |
| DeepSeek V4 Flash 0731 | 0.246 | 0.2214–0.2706 | `deepseek-ai/DeepSeek-V4-Flash-0731` |
| 任何其他启用的模型 | 其当前规模 | 该规模 × [0.9, 1.1] | 来自链参数 |

相同的物理H100根据其服务的模型以及该模型是否超过其目标份额，获得不同的奖励权重。不同模型的主机是不同的单位，因此中位数必须来自所有服务同一模型的主机。
MiniMax初始被锁定：`coeff_min`和`coeff_max`均为0.3024。当这两个边界在该轮次冻结的`config`上相等时，模型被锁定。治理可以稍后打开MiniMax的范围，或锁定其他模型，而无需重置控制器。不要硬编码MiniMax。每个轮次，读取边界并从中选择参考模型。
一个在254、254.5或291冻结的除数已被从前一轮次取走。在升级后，每个轮次它都会进一步漂移。
组上限和抵押品仍独立于系数改变奖励权重。观察到的`validation_weights[].weight`的中位数已包含它们。不要用基准吞吐量乘以系数来替换分母。

此升级中的第二个更改不属于此指标。治理、BLS和PoC验证能力受限于上一轮次确认的计算能力。新容量仍立即获得奖励。从`validation_weights[].weight`（奖励权重）构建H100等效值。根轮次组的`voting_power`对每个参与者均为0。它仅在模型子组中填充，且不是容量数值。

此升级还恢复了`/v1/epochs/latest`、`/v1/epochs/{epoch}/participants`和`/v1/bls/*`上的JSON数字。枚举仍保留名称。在您查询的每个主机升级之前，继续接受v0.2.15字符串格式。参见[v0.2.15备忘录](./dashboard-maintainer-memo-v0.2.15.md)。`/v1/versions`保持不变。

## 如何计算

每个轮次重新计算一次，在该轮次的权重进入`current_epoch_group_data`之后。在PoC期间，链有两个轮次指针。遵循此端点。不要从区块高度推导轮次。

参考卡：仅限**NVIDIA H100 80GB HBM3**。

包括升级轮次在内，样本为所有纯H100 80GB HBM3主机。从下一个轮次开始，仅保留服务该轮次参考模型的主机。

1. `GET /chain-api/productscience/inference/inference/current_epoch_group_data`
取`epoch_index`、`total_weight`、`sub_group_models`和每个`validation_weights[]`条目：`member_address`和`weight`。使用此根`weight`作为主机的奖励权重。它已包含有效系数。
2. `GET /chain-api/productscience/inference/inference/hardware_nodes_all`
保留`participant`属于当前轮次`validation_weights`的行。丢弃其余行。未过滤列表是历史数据。目前包含4,455条记录，不是实时网络。
3. 仅当所有报告的GPU均为`NVIDIA H100 80GB HBM3`时，才保留参与者。一个H100 PCIe、H100 NVL或未标记的`gpu`将使主机从样本中移除。GPU类型为自报，链不验证。此过滤器可防止混合服务器改变每GPU权重。
4. 从首次使用新范围的轮次开始，将每个纯主机分配给其服务的单一模型。对于`sub_group_models`中的每个`model_id`：

   ```text
   GET /chain-api/productscience/inference/inference/epoch_group_data/{epoch_index}?model_id={model_id}
   ```

   当该子组的`validation_weights`条目中`weight` > 0时，参与者服务该模型。丢弃服务多个模型的参与者。将其余参与者按该单一模型分组。
5. 为本轮次选择参考模型：
   - 当其冻结的`config.coeff_min`和`config.coeff_max`解码为相同数字时，模型被锁定。升级时，该模型为`MiniMaxAI/MiniMax-M2.7`。
   - 在至少有3个纯H100主机的锁定模型中，选择拥有最多此类主机的模型。平局：选择`model_id`最低的。
   - 如果没有锁定模型拥有3个此类主机，则选择拥有最多纯H100主机的单一模型，无论是否锁定。平局：选择`model_id`最低的。分母随后遵循该模型的有效系数。标记模型和系数，以便变化可见。
   - 不要跨模型取中位数。
6. 对于参考模型上的每个主机，`sample = weight / h100_count`，使用步骤1中的根奖励权重。
7. 分母 = 这些样本的中位数。若为偶数个，取两个中心值的平均值。
8. `H100_eq = total_weight / denominator`。

如果所选模型上剩余主机少于3个：

- 通过升级轮次，保留上一轮次的分母，并标注为延续。
- 之后，保留上一轮次使用相同参考`model_id`的分母，并标注为延续。不要重用457.33或任何其他升级前的分母。不要在参考模型变更时延续分母。如果此模型无先前分母，则省略该轮次的标题。

### 第410轮次检查

此检查使用升级前的样本：所有纯H100 80GB HBM3主机，而非单一参考模型。在升级轮次期间发布。

四个纯H100 80GB HBM3主机，每GPU权重：451.69、452.38、462.29、466.50。

中位数 = 457.33。

`497,724 / 457.33 = 1,088`。

在新范围应用之前，以此数值为标准。它与tracker.gonka.vip（约1,087）匹配。gonka.gg的1,102使用相同公式，但包含了三个仅H100-PCIe主机，使中位数从457.3变为451.7。

在首次使用新范围的轮次，标题可能变动，因为样本从所有纯HBM3主机变为单一参考模型的主机。升级时该模型为MiniMax，因其为锁定模型。如果治理后来解除锁定，则遵循相同规则选择任何被锁定的模型，或拥有最多纯H100主机的单一模型。在标题旁显示样本标签，以解释跳跃。

## 显示内容

- 标题：**H100 等效值**，即除法结果。在第 410 个周期时，该值约为 **1,088**。
- 其旁边：分母、样本量和参考模型。升级周期为："457 weight per H100 80GB HBM3, 4 hosts"。从下一个周期开始："weight per H100 80GB HBM3 on {model_id}, effective coefficient {effective_coefficient}, N hosts"。
- 物理 GPU 数量，若显示，应为单独一行。将其标记为自报库存。
- gonka.gg 上的标题 "H100 median weight: 1,102" 是等效值，而非中位数。将等效值标记为 H100 等效值，并单独显示中位数。
- 将卡片标记为奖励权重等效值。向更高系数模型的转变会改变此数值，而不会改变 GPU 数量。

从每个周期的权重中刷新分母。使用新系数范围的第一个周期是升级后的周期，而非升级周期本身。

## 如果你也显示模型系数

停止将 `poc_params.models[].weight_scale_factor` 读作实时系数。升级后它为空。

一个周期的奖励乘数是 `effective_coefficient`：

```text
GET /chain-api/productscience/inference/inference/dynamic_coefficients/{epoch_index}
```

`epoch_index = 0` 表示当前纪元。根纪元组中的条目与 `confirmation_weight_scales` 相同。

对于每个模型：

- `effective_coefficient` 是已包含在 `validation_weights[].weight` 中的乘数。这是用作系数的数值。
- `base_coefficient` 是超供稀释前的控制器值。将其与有效值并列显示。当模型的计算份额高于目标时，两者不同。
- `config.coeff_min`、`config.coeff_max`、`config.target_share_bps` 和 `config.relative_difficulty` 是该纪元冻结的边界、目标和难度。目标份额为 `target_share_bps / 10000`。上表仅为初始边界。
- `poc_params.models[].dynamic_coefficient` 是下一个 PoC 的实时治理边界。它不是当前纪元使用的系数。

将每个 `Decimal` 解码为 `value × 10^exponent`。`value` 和 `exponent` 可能以数字或字符串形式到达。`{value: 3024, exponent: -4}` 为 0.3024。

在 v0.2.16 之前形成的纪元没有 `effective_coefficient`。对这些纪元使用 `weight_scale_factor`。升级纪元已将 `effective_coefficient` 设置为旧比例。

跳过含有 `exclude_from_confirmation = true` 的条目。在 PoC 期间，即将到来的纪元可能已有 `config`，而 `effective_coefficient` 仍为空。该系数尚未计算。不要替换治理边界或 1。

[v0.2.13 确认权重步骤](./dashboard-maintainer-memo-v0.2.13.md) 将原始 PoC 权重按 `weight_scale_factor` 缩放。对于升级纪元及之后，当 `effective_coefficient` 存在时在该公式中使用 `effective_coefficient`，仅在 `effective_coefficient` 缺失时使用 `weight_scale_factor`。
