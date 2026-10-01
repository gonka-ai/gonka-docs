# 仪表板上的H100等效值
在升级到v0.2.16之前请阅读此内容。如果提案109通过，升级高度为6,353,400，预计时间为2026年10月2日07:05 UTC。
## 这个数字的含义

H100等效值是当前网络奖励权重除以同一周期内单个参考H100所获得的奖励权重：

```text
H100_eq = total_weight / weight_per_h100
```

这是一个奖励权重等效值。它不是物理GPU的数量，也不是经过难度标准化的算力。

在第410个周期，`total_weight`为**497,724**。它来源于`current_epoch_group_data.total_weight`，等于24个活跃参与者的`validation_weights[].weight`之和。
所有显示此指标的仪表板都使用该分子。发布的数据不同是因为分母不同。
## 第410个周期各仪表板显示的内容
| 仪表板 | 显示数值 | 分母 |
| --- | --- | --- |
| [gonka.gg](https://gonka.gg/) | 1,102，标注为"GPU (H100中位权重)" | 仅针对报告H100的主机的实时中位数，包括H100 PCIe。中位数为451.7。`497,724 / 451.7 = 1,102` |
| [tracker.gonka.vip](https://tracker.gonka.vip/) | ~1,087 H100 GPU | 相同的实时方法，但仅限`NVIDIA H100 80GB HBM3`。共四个此类主机，中位数为457.3。`497,724 / 457.3 = 1,088` |
| [tracker.gonka.hyperfusion.io](https://tracker.gonka.hyperfusion.io/) | ~1,960 H100 GPU | 从第175个周期起固定`254`。更早周期使用440，然后是284。`497,724 / 254 = 1,960` |
| [gonkascan.com](https://gonkascan.com/) | 1,956 H100 GPU | 固定`254.5`，即2026年2月19日归一化后单个H100 80GB HBM3的权重（第176周期）。`497,724 / 254.5 = 1,956` |
| [gonkahub.com/network](https://gonkahub.com/network) | ~1,960 H100 GPU | 图表标注为"权重 ÷ 254.5 (H100 HBM3)"。使用相同的2月固定基准。 |
| [gnk.space](https://gnk.space/) | ~1,710 | 固定`291`。当该API字段设置时，页面使用`network_weight_h100`。该字段为空，因此页面回退到`totalWeight / 291`。`497,724 / 291 = 1,710` |

gonka.gg还显示"总物理GPU：642"。这是另一个指标：活跃主机自报的GPU库存。它不是H100等效值。当主机更新其硬件报告时，库存会变动。
这两个指标不可混淆。在第410个周期，一个纯H100 80GB HBM3主机每张GPU产生约**457**权重。一个纯H100 PCIe主机产生约**245**。
## 如果v0.2.16通过会发生什么变化
查询路径保持不变。奖励权重仍位于`validation_weights[].weight`。该数字已包含该周期的有效系数。请勿再次乘以系数。
`current_epoch_group_data`的内容会发生变化。在升级周期及之后，`confirmation_weight_scales[].weight_scale_factor`被清空，`effective_coefficient`被设置。升级前的周期仍保留`weight_scale_factor`，无`effective_coefficient`。`poc_params.models[].weight_scale_factor`在升级时被清空。将其读作实时系数将返回空值。
模型系数开始变动。治理机构为每个模型设定目标算力占比和系数范围。每个周期，协议在该范围内逐步调整基础系数。超过目标份额的算力按最低系数评分，因此用于奖励权重的有效系数可能低于基础系数。下表为初始范围，而非后续周期应用的系数。
初始范围从升级后的周期开始生效。升级周期本身保留当前的奖励权重。

| 模型 | 升级时 | 允许范围 | 模型ID |
| --- | --- | --- | --- |
| MiniMax M2.7 | 0.3024 | 固定为0.3024 | `MiniMaxAI/MiniMax-M2.7` |
| GLM 5.3 Flash | 0.62 | 0.558–0.682 | `zai-org/GLM-5.3-Flash` |
| DeepSeek V4 Flash 0731 | 0.246 | 0.2214–0.2706 | `deepseek-ai/DeepSeek-V4-Flash-0731` |
| 任何其他启用的模型 | 其当前规模 | 该规模 × [0.9, 1.1] | 来自链参数 |

相同的物理H100根据其服务的模型以及该模型是否超过其目标份额，获得不同的奖励权重。不同模型的主机是不同的单位，因此中位数必须来自全部服务同一模型的主机。
MiniMax初始被固定：`coeff_min`和`coeff_max`均为0.3024。当某模型在该轮冻结的`config`上这两个边界相等时，该模型即被固定。治理可以稍后打开MiniMax的范围，或固定另一个模型，而无需重置控制器。不要硬编码MiniMax。每个轮次，读取边界并从其中选择参考模型。
一个在254、254.5或291处冻结的除数已从更早的轮次中取出。在升级后，每个轮次它都会进一步漂移。
组上限和抵押品仍独立于系数改变奖励权重。观察到的`validation_weights[].weight`的中位数已包含它们。不要用基准吞吐量乘以系数来替换分母。

此升级中的第二个更改不属于此指标。治理、BLS和PoC验证算力仅限于上一轮次已确认的算力。新容量仍立即获得奖励。从`validation_weights[].weight`（奖励权重）构建H100等效值。根轮次组的`voting_power`对每个参与者均为0。它仅在模型子组中填充，且不是容量数值。

## 如何计算

每个轮次重新计算一次，在该轮次的权重进入`current_epoch_group_data`后。在PoC期间，链有两个轮次指针。遵循此端点。不要从区块高度推导轮次。

参考卡：**仅限NVIDIA H100 80GB HBM3**。

包括升级轮次在内，样本为每个纯H100 80GB HBM3主机。从下一个轮次开始，仅保留仅服务该轮次参考模型的主机。

1. `GET /chain-api/productscience/inference/inference/current_epoch_group_data`
取`epoch_index`、`total_weight`、`sub_group_models`和每个`validation_weights[]`条目：`member_address`和`weight`。使用此根`weight`作为主机的奖励权重。它已包含有效系数。
2. `GET /chain-api/productscience/inference/inference/hardware_nodes_all`
保留`participant`在此轮次`validation_weights`中的行。删除其余行。未过滤列表是历史数据。目前包含4,455条记录，不是实时网络。
3. 仅当所有报告的GPU均为`NVIDIA H100 80GB HBM3`时才保留参与者。一个H100 PCIe、H100 NVL或未标记的`gpu`将使主机从样本中移除。GPU类型为自报告，链不验证。此过滤器可防止混合服务器改变每GPU权重。
4. 从首次使用新范围的轮次开始，将每个纯主机分配给其服务的单一模型。对于`sub_group_models`中的每个`model_id`：

   ```text
   GET /chain-api/productscience/inference/inference/epoch_group_data/{epoch_index}?model_id={model_id}
   ```

   当某子组的`validation_weights`条目中`weight` > 0时，参与者即服务该模型。删除服务超过一个模型的参与者。将其余参与者按该单一模型分组。
5. 为本轮次选择参考模型：
   - 当其冻结的`config.coeff_min`和`config.coeff_max`解码为相同数字时，模型即被固定。升级时，该模型为`MiniMaxAI/MiniMax-M2.7`。
   - 在至少有3个纯H100主机的固定模型中，选择拥有最多此类主机的模型。平局时选择`model_id`最低者。
   - 如果没有固定模型拥有3个此类主机，则选择拥有最多纯H100主机的单一模型，无论是否固定。平局时选择`model_id`最低者。分母随后遵循该模型的有效系数。标注模型和系数，以便可见其变动。
   - 不要跨模型取中位数。
6. 对于参考模型上的每个主机，`sample = weight / h100_count`，使用第1步中的根奖励权重。
7. 分母 = 这些样本的中位数。若为偶数个，取两个中间值的平均值。
8. `H100_eq = total_weight / denominator`。

如果所选模型上剩余主机少于3个：

- 通过升级轮次，保留上一轮次的分母，并标注为延续。
- 之后，保留上一轮次中使用相同参考`model_id`的分母，并标注为延续。不要重用457.33或任何其他升级前的分母。不要在参考模型变更时延续分母。如果该模型无先前分母，则省略该轮次的标题。

### 第410轮检查

此检查使用升级前样本：每个纯H100 80GB HBM3主机，而非单一参考模型。在升级轮次期间发布。

四个纯H100 80GB HBM3主机，每GPU权重：451.69、452.38、462.29、466.50。

中位数 = 457.33。

`497,724 / 457.33 = 1,088`。

这是在新范围生效前应标准化的数值。它与tracker.gonka.vip（约1,087）匹配。gonka.gg的1,102使用相同公式，但包含三个仅H100-PCIe主机，使中位数从457.3变为451.7。

在首次使用新范围的轮次，标题可能变动，因为样本从所有纯HBM3主机变为仅服务单一参考模型的主机。升级时该模型为MiniMax，因为它是被固定的模型。如果治理稍后取消其固定，相同规则将选择任何被固定的模型，或拥有最多纯H100主机的单一模型。在标题旁显示样本标签，以解释此跳跃。

## 要显示的内容

- 标题：**H100 等效值**，除法的结果。在第 410 轮时，该值约为 **1,088**。
- 其旁边：分母、样本量和参考模型。通过升级轮次："457 权重每 H100 80GB HBM3，4 个主机"。从下一轮开始："每 H100 80GB HBM3 在 {model_id} 上的权重，有效系数 {effective_coefficient}，N 个主机"。
- 物理 GPU 数量，如果你显示它，是单独的一行。将其标记为自报库存。
- gonka.gg 上的标题 "H100 中位权重：1,102" 是等效数量，而非中位数。将等效值标记为 H100 等效值，并单独显示中位数。
- 将卡片标记为奖励权重等效值。向更高系数模型的转变可以在不改变 GPU 数量的情况下改变此数值。

从该轮次的权重中刷新分母。使用新系数范围的第一个轮次是升级之后的轮次，而不是升级轮次本身。

## 如果你也显示模型系数

停止将 `poc_params.models[].weight_scale_factor` 读作实时系数。升级后它为空。

某轮次的奖励乘数为 `effective_coefficient`：

```text
GET /chain-api/productscience/inference/inference/dynamic_coefficients/{epoch_index}
```

`epoch_index = 0` 表示当前纪元。根纪元组中的条目与 `confirmation_weight_scales` 相同。

对于每个模型：

- `effective_coefficient` 是已包含在 `validation_weights[].weight` 中的乘数。这是用作系数的数值。
- `base_coefficient` 是超供应稀释前的控制器值。将其与有效值并列显示。当模型的计算份额高于目标时，两者不同。
- `config.coeff_min`、`config.coeff_max`、`config.target_share_bps` 和 `config.relative_difficulty` 是该纪元冻结的边界、目标和难度。目标份额为 `target_share_bps / 10000`。上表仅为初始边界。
- `poc_params.models[].dynamic_coefficient` 是下一个 PoC 的实时治理边界。它不是当前纪元使用的系数。

将每个 `Decimal` 解码为 `value × 10^exponent`。`value` 和 `exponent` 可能以数字或字符串形式到达。`{value: 3024, exponent: -4}` 为 0.3024。

在 v0.2.16 之前形成的纪元没有 `effective_coefficient`。对这些纪元使用 `weight_scale_factor`。升级纪元已将 `effective_coefficient` 设置为旧比例。

跳过带有 `exclude_from_confirmation = true` 的条目。在 PoC 期间，即将到来的纪元可能已具有 `config`，而 `effective_coefficient` 仍为空。该系数尚未计算。不要替换治理边界或 1。

[v0.2.13 确认权重步骤](./dashboard-maintainer-memo-v0.2.13.md) 将原始 PoC 权重按 `weight_scale_factor` 缩放。对于升级纪元及之后，当 `effective_coefficient` 存在时在该公式中使用 `effective_coefficient`，仅当 `effective_coefficient` 缺失时使用 `weight_scale_factor`。
