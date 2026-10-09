# H100 等效值在仪表板上的显示

阅读此内容以了解 v0.2.16 升级提案 112。若提案通过，升级高度为 6,449,400，预计在 2026 年 10 月 8 日 05:48 UTC 左右。提案 109 未通过。以下系数和权重规则适用于提案 112。

## 该数字的含义

H100 等效值是当前网络奖励权重除以单个参考 H100 在同一周期内获得的奖励权重：

```text
H100_eq = total_weight / weight_per_h100
```

这是一个奖励权重等效值。它不是物理 GPU 的数量，也不是经过难度归一化的算力。

在第 410 个周期，`total_weight` 为 **497,724**。它来自 `current_epoch_group_data.total_weight`，等于 24 个活跃参与者 `validation_weights[].weight` 的总和。
所有显示此指标的仪表板均使用该分子。发布的数值不同，是因为分母不同。
## 第 410 个周期各仪表板显示的内容
| 仪表板 | 显示数值 | 分母 |
| --- | --- | --- |
| [gonka.gg](https://gonka.gg/) | 1,102，标注为 "GPU (H100 中位权重)" | 仅统计报告 H100 的主机的实时中位数，包括 H100 PCIe。中位数为 451.7。`497,724 / 451.7 = 1,102` |
| [tracker.gonka.vip](https://tracker.gonka.vip/) | ~1,087 H100 GPU | 同种实时方法，但仅限 `NVIDIA H100 80GB HBM3`。共四个此类主机，中位数为 457.3。`497,724 / 457.3 = 1,088` |
| [tracker.gonka.hyperfusion.io](https://tracker.gonka.hyperfusion.io/) | ~1,960 H100 GPU | 对所有 ≥175 的周期固定使用 `254`。早期周期使用 440，然后是 284。`497,724 / 254 = 1,960` |
| [gonkascan.com](https://gonkascan.com/) | 1,956 个 H100 GPU | 修复 `254.5`，即 2026 年 2 月 19 日归一化后一个 H100 80GB HBM3（第 176 轮）的权重。`497,724 / 254.5 = 1,956` |
| [gonkahub.com/network](https://gonkahub.com/network) | ~1,960 个 H100 GPU | 图表标注为“权重 ÷ 254.5 (H100 HBM3)” 。使用相同的冻结二月基准。 |
| [gnk.space](https://gnk.space/) | ~1,710 | 修复 `291`。当该 API 字段被设置时，页面使用 `network_weight_h100`。该字段为空，因此页面回退至 `totalWeight / 291`。`497,724 / 291 = 1,710` |

gonka.gg 也显示“总物理 GPU：642”。这是一个不同的指标：活跃主机自报的 GPU 库存。它不是 H100 等效值。当主机更新其硬件报告时，该库存会发生变化。
H100 80GB HBM3 和 H100 PCIe 是不同的显卡。在第 410 轮，一个纯 H100 80GB HBM3 主机每 GPU 产生约 **457** 权重。一个纯 H100 PCIe 主机产生约 **245**。请将 PCIe 排除在样本之外。
## 如果 v0.2.16 通过会有什么变化
查询路径保持不变。分子仍为根 `total_weight`，即 `validation_weights[].weight` 的总和。该数字已包含本轮的有效系数。请勿再次将 `validation_weights[].weight` 乘以系数。
`current_epoch_group_data` 的内容会发生变化。在升级轮次及之后，`confirmation_weight_scales[].weight_scale_factor` 被清空，`effective_coefficient` 被设置。在升级前形成的轮次仍保留 `weight_scale_factor` 且无 `effective_coefficient`。`poc_params.models[].weight_scale_factor` 在升级时被清空。将其读作实时系数将返回空值。
模型系数开始变动。治理机构为每个模型设定目标算力份额和系数范围。每轮协议在该范围内逐步调整基础系数。超过目标份额的算力按最低系数评分，因此用于奖励权重的有效系数可能低于基础系数。该表格为初始范围，而非后续轮次应用的系数。
初始范围从升级后的下一轮开始生效。升级轮次本身仍保留当前的奖励权重。

| 模型 | 升级时 | 允许范围 | 模型 ID |
| --- | --- | --- | --- |
| MiniMax M2.7 | 0.3024 | 固定为 0.3024 | `MiniMaxAI/MiniMax-M2.7` |
| GLM 5.3 Flash | 0.62 | 0.558–0.682 | `zai-org/GLM-5.3-Flash` |
| DeepSeek V4 Flash 0731 | 0.246 | 0.2214–0.2706 | `deepseek-ai/DeepSeek-V4-Flash-0731` |
| Any other enabled model | Its current scale | That scale × [0.9, 1.1] | From chain params |

相同的物理H100根据其服务的模型以及该模型是否超过其目标份额，会获得不同的奖励权重。`poc_weight`仍然是原始值。在中位数之前，将其乘以该模型的`effective_coefficient`，并从每个模型中保留节点。将这些模型ID列在标题旁边。
MiniMax初始被固定：`coeff_min`和`coeff_max`均为0.3024。当这两个边界在该轮次冻结的`config`上相等时，模型被固定。治理可以稍后打开MiniMax的范围，或固定其他模型，而无需重置控制器。不要硬编码MiniMax。单位仍为一个H100 80GB HBM3。不要将标题切换为B200或B300。
一个在254、254.5、291或上一轮的488处冻结的除数已被从前一轮中扣除。在升级后，每轮都会进一步漂移。
组上限和抵押品仍会改变参与者的根奖励权重。该根权重对于一个H100来说是错误的分子：未提交抵押品的主机看起来像较弱的卡。每GPU样本为`poc_weight × effective_coefficient / card count`。不要将主机的根奖励权重除以其卡数。不要用基准吞吐量乘以系数来替换分母。

此升级中的第二个更改不属于此指标。治理、BLS和PoC验证权仅限于上一轮已确认的计算。新容量仍立即获得奖励。分子是根轮次组的`total_weight`。根轮次组的`voting_power`对每个参与者均为0。它仅在模型子组中填充，且不是容量数值。

此升级还恢复了`/v1/epochs/latest`、`/v1/epochs/{epoch}/participants`和`/v1/bls/*`上的JSON数字。枚举保持为名称。在你查询的每个主机升级之前，继续接受v0.2.15字符串格式。参见[v0.2.15备忘录](./dashboard-maintainer-memo-v0.2.15.md)。`/v1/versions`保持不变。

## 如何计算

每个轮次重新计算一次，在该轮次的权重进入`current_epoch_group_data`之后。在PoC期间，链上有两个轮次指针。遵循此端点。不要从区块高度推导轮次。

参考卡：**NVIDIA H100 80GB HBM3**。标题保持为H100。不要切换为B200或B300。

样本为活跃CometBFT验证节点上的合格H100节点。混合主机保留。仅当所有报告的GPU都是H100时才保留主机，会丢弃共享机器的卡。如果每个此类主机增加一张其他卡，该样本将为空。

1. `GET /chain-api/productscience/inference/inference/current_epoch_group_data`
取`epoch_index`、`total_weight`、`sub_group_models`和每个`validation_weights[]`条目：`member_address`和`weight`。`total_weight`为分子。它已包含有效系数。不要将成员的根`weight`除以其卡数。
2. `GET /chain-api/productscience/inference/inference/hardware_nodes_all`
保留`participant`在此轮次`validation_weights`中的行。丢弃其余行。未过滤列表是历史数据。目前包含4,455条记录，不是实时网络。
3. `GET /chain-api/cosmos/base/tendermint/v1beta1/validatorsets/latest`
仅当`participant.validator_key`等于验证者`pub_key.key`时保留参与者。`validator_key`位于`GET /chain-api/productscience/inference/inference/participant/{member_address}`上。RTX 5090位于不是验证者的轮次成员上。将这些成员排除。
4. 在每个保留的硬件节点上，要求`status` = `INFERENCE`且`hardware[].type`以`NVIDIA H100 80GB HBM3`开头。实时报告附加` | 79GB`。H100 PCIe是不同的卡。排除它。同一主机上的另一张卡不会移除此节点。GPU类型为自报告。链不验证它。
5. 对于`sub_group_models`中的每个`model_id`：

   ```text
   GET /chain-api/productscience/inference/inference/epoch_group_data/{epoch_index}?model_id={model_id}
   ```

   将硬件节点的`local_id`匹配到`ml_nodes[].node_id`。当该条目的`poc_weight` > 0时保留节点。使用该模型的`effective_coefficient`。
6. `poc_weight`是原始值。该节点上每GPU为`poc_weight × effective_coefficient / card count`。卡数是该节点上以`NVIDIA H100 80GB HBM3`开头的类型对应的`hardware[].count`。`effective_coefficient`已在下方记录。不要再次将`validation_weights[].weight`乘以系数。不要将主机的根奖励权重除以其卡数。
7. `weight_per_h100` = 这些每GPU值的中位数。若为偶数个，取两个中间值的平均值。
8. `H100_eq = total_weight / weight_per_h100`。`total_weight`保持为根轮次组的`total_weight`。

如果此轮次没有合格的H100节点，则省略标题。不要重用上一轮的分母。只要此轮次有活跃的H100节点，就不得重用上一轮的488。

### 第410轮检查

此检查使用升级前的样本：每个纯H100 80GB HBM3主机，而非单个参考模型。

四个纯H100 80GB HBM3主机，每GPU权重：451.69、452.38、462.29、466.50。

中位数 = 457.33。

`497,724 / 457.33 = 1,088`。

它与tracker.gonka.vip（约1,087）匹配。gonka.gg的1,102使用相同公式，但包含了三个仅H100-PCIe主机，使中位数从457.3变为451.7。

该1,088数字仅为历史检查。后续轮次，包括升级轮次和第420轮，使用上述节点样本，包括混合主机。不要重用457.33。

### 第420轮

在实时第420轮读数中，`total_weight`为**669,024**。

11个合格节点，64张H100 80GB HBM3卡，全部`INFERENCE`，全部`poc_weight` > 0。

MiniMax `effective_coefficient`为0.3024。DeepSeek为0.2706。

每GPU，从低到高：233、237、263、344、350、394、441、458、458、458、458。

中位数 `weight_per_h100` 为 394.4（11 个中的第 6 个）。

`669,024 / 394.4 = 1,696`。

1,180 和 488 是旧的纯主机回退值，不是本周期的 `weight_per_h100`。将本读数的 `total_weight` 与 488 配对得到 1,371，而非 1,180。1,180 对应的总权重约为 575,840。

## 要显示的内容

- 标题：**H100 等效值**，即除法结果。保持 H100 作为单位。在第 410 个周期，升级前检查值约为 **1,088**。
- 标题旁：`weight_per_h100`、节点数、卡数、模型 ID，并说明包含混合主机。"每个 H100 80GB HBM3 的权重：N 个节点，C 张卡，{model_ids}，包含混合主机"。
- 如果显示物理 GPU 数量，则作为单独一行，标注为“自报库存”。
- gonka.gg 上的标题“H100 中位权重：1,102”是等效值，而非中位数。将等效值标注为“H100 等效值”，并单独显示中位数。
- 将卡标注为“奖励权重等效值”。向更高系数模型的倾斜会改变该数值，而不会改变 GPU 数量。

每个周期从该周期的合格节点中刷新 `weight_per_h100`。不要沿用上一周期的分母。使用新系数范围的第一个周期是升级后的周期，而非升级周期本身。

## 如果你也显示模型系数

停止将 `poc_params.models[].weight_scale_factor` 读作实时系数。升级后它为空。

一个周期的奖励乘数为 `effective_coefficient`：

```text
GET /chain-api/productscience/inference/inference/dynamic_coefficients/{epoch_index}
```

`epoch_index = 0` 表示当前纪元。根纪元组中的条目与 `confirmation_weight_scales` 相同。

对于每个模型：

- `effective_coefficient` 是已包含在 `validation_weights[].weight` 中的乘数。这是用作系数的数值。原始 `poc_weight` 不包含它。每个 GPU 的样本仅乘以它一次。
- `base_coefficient` 是超供稀释前的控制器值。将其与有效值并列显示。当模型的计算份额高于其目标时，两者不同。
- `config.coeff_min`、`config.coeff_max`、`config.target_share_bps` 和 `config.relative_difficulty` 是该纪元冻结的边界、目标和难度。目标份额为 `target_share_bps / 10000`。上表仅为初始边界。
- `poc_params.models[].dynamic_coefficient` 是下一个 PoC 的实时治理边界。它不是当前纪元使用的系数。

将每个 `Decimal` 解码为 `value × 10^exponent`。`value` 和 `exponent` 可能以数字或字符串形式到达。`{value: 3024, exponent: -4}` 为 0.3024。

v0.2.16 之前的纪元没有 `effective_coefficient`。对这些纪元使用 `weight_scale_factor`。升级纪元已将 `effective_coefficient` 设置为旧比例。

跳过带有 `exclude_from_confirmation = true` 的条目。在 PoC 期间，即将到来的纪元可能已具有 `config`，而 `effective_coefficient` 仍为空。该系数尚未计算。不要替换治理边界或 1。

[v0.2.13 确认权重步骤](./dashboard-maintainer-memo-v0.2.13.md) 将原始 PoC 权重乘以 `weight_scale_factor`。对于升级纪元及之后，当 `effective_coefficient` 存在时在公式中使用 `effective_coefficient`，仅当其不存在时使用 `weight_scale_factor`。
