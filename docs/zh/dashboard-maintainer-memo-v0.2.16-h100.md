# H100 等效值在仪表板上的显示
升级 v0.2.16 之前请阅读此内容。如果提案 109 通过，升级高度为 6,353,400，预计时间为 2026 年 10 月 2 日 07:05 UTC。
## 这个数字是什么
H100 等效值是当前网络权重除以该纪元中一个 H100 所获得的权重：
```text
H100_eq = total_weight / weight_per_h100
```
在第 410 个纪元中，`total_weight` 为 **497,724**。它来自 `current_epoch_group_data.total_weight`，等于 24 个活跃参与者 `validation_weights[].weight` 的总和。
所有显示此指标的仪表板都使用该分子。发布的数据不同是因为分母不同。
## 第 410 个纪元中各仪表板显示的内容
| 仪表板 | 显示数值 | 分母 |
| --- | --- | --- |
| [gonka.gg](https://gonka.gg/) | 1,102，标记为 "GPU (H100 中位权重)" | 仅包含报告 H100 的主机的实时中位数，包括 H100 PCIe。中位数为 451.7。`497,724 / 451.7 = 1,102` |
| [tracker.gonka.vip](https://tracker.gonka.vip/) | ~1,087 H100 GPU | 相同的实时方法，但仅限 `NVIDIA H100 80GB HBM3`。共四个此类主机，中位数为 457.3。`497,724 / 457.3 = 1,088` |
| [tracker.gonka.hyperfusion.io](https://tracker.gonka.hyperfusion.io/) | ~1,960 H100 GPU | 从第 175 个纪元起固定 `254`。之前的纪元使用 440，然后是 284。`497,724 / 254 = 1,960` |
| [gonkascan.com](https://gonkascan.com/) | 1,956 H100 GPU | 固定 `254.5`，即 2026 年 2 月 19 日标准化后的单个 H100 80GB HBM3 权重（第 176 个纪元）。`497,724 / 254.5 = 1,956` |
| [gonkahub.com/network](https://gonkahub.com/network) | ~1,960 H100 GPU | 图表标记为 "权重 ÷ 254.5 (H100 HBM3)"。使用相同的冻结二月基准。 |
| [gnk.space](https://gnk.space/) | ~1,710 | 固定 `291`。当该 API 字段设置时，页面使用 `network_weight_h100`。该字段为空，因此页面回退到 `totalWeight / 291`。`497,724 / 291 = 1,710` |

gonka.gg 还显示 "总物理 GPU：642"。这是另一个指标：活跃主机自报的 GPU 库存。它不是 H100 等效值。当主机更新其硬件报告时，库存会发生变化。
这两个数值不可混淆。在第 410 个纪元中，一个纯 H100 80GB HBM3 主机每块 GPU 产生约 **457** 权重。一个纯 H100 PCIe 主机每块 GPU 产生约 **245**。
## 如果 v0.2.16 通过会发生什么变化
H100 等效值端点不会改变。`current_epoch_group_data` 和 `hardware_nodes_all` 保持不变。奖励权重仍基于 `validation_weights[].weight`。
模型系数将开始变动。治理机构为每种模型设定目标算力份额和系数范围。每个纪元，协议会在该范围内调整系数。超过目标份额的算力将按最低系数评分。
升级后的下一个纪元开始应用初始范围。升级纪元本身仍使用当前的奖励权重。

| 模型 | 升级时 | 允许范围 |
| --- | --- | --- |
| MiniMax M2.7 | 0.3024 | 固定为 0.3024 |
| GLM 5.3 Flash | 0.62 | 0.558–0.682 |
| DeepSeek V4 Flash 0731 | 0.246 | 0.2214–0.2706 |
| 任何其他启用的模型 | 其当前规模 | 该规模 × [0.9, 1.1] |

相同的物理H100根据其服务的模型以及该模型是否超过其目标份额，会获得不同的共识权重。一个被冻结在254、254.5或291的除数已从更早的纪元中取得。在升级后，每个纪元它都会进一步漂移。
此升级中的第二个变更不属于此指标。治理、BLS和PoC验证算力仅限于上一纪元确认的算力。新容量仍会立即获得奖励。从 `validation_weights[].weight` 构建H100等效值，即奖励权重。根纪元组上的 `voting_power` 对每个参与者均为0。它仅在模型子组中填充，且并非容量数值。
## 如何计算
每个纪元重新计算一次，在该纪元的权重进入 `current_epoch_group_data` 后进行。在PoC期间，链上有两个纪元指针。遵循此端点。不要从区块高度推导纪元。
参考卡：仅限 **NVIDIA H100 80GB HBM3**。

1. `GET /chain-api/productscience/inference/inference/current_epoch_group_data`
取 `epoch_index`、`total_weight` 和每个 `validation_weights[]` 条目：`member_address` 和 `weight`。
2. `GET /chain-api/productscience/inference/inference/hardware_nodes_all`
保留 `participant` 属于本纪元 `validation_weights` 的行。丢弃其余行。未过滤列表是历史数据，目前包含4,455条记录，并非实时网络。
3. 仅当所有报告的GPU均为 `NVIDIA H100 80GB HBM3` 时才保留参与者。一个H100 PCIe、H100 NVL或未标记的 `gpu` 将使主机从样本中移除。GPU类型为自报，链上不验证。此过滤器用于防止混合服务器改变每GPU权重。
4. 对每个剩余参与者，`sample = weight / h100_count`。
5. 分母 = 这些样本的中位数。若样本数为偶数，取两个中间值的平均值。
6. `H100_eq = total_weight / denominator`。
若纯主机少于3个，则保留上一纪元的分母，并标注为延续值。
### 纪元410检查
四个纯H100 80GB HBM3主机，每GPU权重：451.69、452.38、462.29、466.50。
中位数 = 457.33。
`497,724 / 457.33 = 1,088`。
此即应标准化的数值。它与 tracker.gonka.vip (~1,087) 一致。gonka.gg 的 1,102 使用相同公式，但包含了三个仅H100-PCIe的主机，使中位数从457.3降至451.7。
## 如何显示
- 标题：**H100等效值**，即除法结果。在纪元410中约为 **1,088**。
- 紧随其后：分母和样本数量。示例："每H100 80GB HBM3权重457，4台主机"。
- 如果显示物理GPU数量，应作为单独一行，标注为自报库存。
- gonka.gg上的标题“H100中位权重：1,102”是等效数量，而非中位数。将等效值标注为H100等效值，并单独显示中位数。
从每个纪元的权重中刷新分母。使用新系数范围的第一个纪元是升级后的纪元，而非升级本身所在的纪元。
