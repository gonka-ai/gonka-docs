# H100 等效值在仪表板上的显示

升级 v0.2.16 之前请阅读此内容。如果提案 109 通过，升级高度为 6,353,400，预计在 2026 年 10 月 2 日 07:05（UTC）左右。

## 这个数字是什么

H100 等效值是当前网络奖励权重除以同一周期内一块参考 H100 所获得的奖励权重：

```text
H100_eq = total_weight / weight_per_h100
```

它是奖励权重等效值。它不是物理 GPU 数量，也不是按难度归一化后的算力。

在第 410 个周期中，`total_weight` 为 **497,724**。它来自 `current_epoch_group_data.total_weight`，等于 24 个活跃参与者 `validation_weights[].weight` 的总和。

所有显示此指标的仪表板都使用该分子。发布的数值不同是因为分母不同。

## 第 410 个周期中各仪表板显示的内容

| 仪表板 | 显示数值 | 分母 |
| --- | --- | --- |
| [gonka.gg](https://gonka.gg/) | 1,102，标注为 "GPU（H100 中位权重）" | 仅针对报告 H100 的主机的实时中位数，包括 H100 PCIe。中位数为 451.7。`497,724 / 451.7 = 1,102` |
| [tracker.gonka.vip](https://tracker.gonka.vip/) | ~1,087 H100 GPU | 相同的实时方法，仅限 `NVIDIA H100 80GB HBM3`。共四个此类主机，中位数为 457.3。`497,724 / 457.3 = 1,088` |
| [tracker.gonka.hyperfusion.io](https://tracker.gonka.hyperfusion.io/) | ~1,960 H100 GPU | 从第 175 个周期起固定 `254`。更早的周期使用 440，然后是 284。`497,724 / 254 = 1,960` |
| [gonkascan.com](https://gonkascan.com/) | 1,956 H100 GPU | 固定 `254.5`，即 2026 年 2 月 19 日标准化后的单个 H100 80GB HBM3 权重（第 176 个周期）。`497,724 / 254.5 = 1,956` |
| [gonkahub.com/network](https://gonkahub.com/network) | ~1,960 H100 GPU | 图表标注为 "权重 ÷ 254.5（H100 HBM3）"。使用相同的冻结二月基准。 |
| [gnk.space](https://gnk.space/) | ~1,710 | 固定 `291`。当该 API 字段设置时，页面使用 `network_weight_h100`。该字段为空，因此页面回退到 `totalWeight / 291`。`497,724 / 291 = 1,710` |

gonka.gg 还显示 "总物理 GPU：642"。这是另一个指标：活跃主机自报的 GPU 数量。它不是 H100 等效值。当主机更新其硬件报告时，该数量会发生变化。

这两个数值不可混淆。在第 410 个周期中，一个纯 H100 80GB HBM3 主机每块 GPU 产生约 **457** 权重。一个纯 H100 PCIe 主机每块 GPU 产生约 **245**。

## 如果 v0.2.16 通过会发生什么变化

查询路径保持不变。奖励权重仍在 `validation_weights[].weight`。该数字已经包含本周期的有效系数。不要再乘一次系数。

`current_epoch_group_data` 的响应体会变化。从升级周期起，`confirmation_weight_scales[].weight_scale_factor` 被清空，并写入 `effective_coefficient`。升级前形成的周期仍保留 `weight_scale_factor`，且没有 `effective_coefficient`。升级时会清空 `poc_params.models[].weight_scale_factor`。把它当作当前系数来读，得到的是空值。

模型系数开始变动。治理为每个模型设定目标算力份额和系数范围。每个周期，协议在该范围内调整基础系数。超过目标份额的算力按最低系数计分，因此用于奖励权重的有效系数可以低于基础系数。下表是起始边界，不是后续周期实际采用的系数。

初始范围从升级后的下一个周期开始生效。升级周期本身仍使用当前的奖励权重。

| 模型 | 升级时 | 允许范围 | 模型 ID |
| --- | --- | --- | --- |
| MiniMax M2.7 | 0.3024 | 固定为 0.3024 | `MiniMaxAI/MiniMax-M2.7` |
| GLM 5.3 Flash | 0.62 | 0.558–0.682 | `zai-org/GLM-5.3-Flash` |
| DeepSeek V4 Flash 0731 | 0.246 | 0.2214–0.2706 | `deepseek-ai/DeepSeek-V4-Flash-0731` |
| 任何其他启用的模型 | 其当前规模 | 该规模 × [0.9, 1.1] | 从链上参数读取 |

同一块物理 H100 会因所服务的模型、以及该模型是否超过目标份额，获得不同的奖励权重。不同模型上的主机是不同的单位，因此中位数必须来自只服务同一个模型的主机。

MiniMax 在升级时是钉住的：`coeff_min` 和 `coeff_max` 都是 0.3024。当一个周期冻结的 `config` 上这两个边界相等时，该模型就是钉住的。治理以后可以放开 MiniMax 的范围，或改钉另一个模型，而不重置控制器。不要把 MiniMax 写死。每个周期都从边界里读取并选择参考模型。

冻结在 254、254.5 或 291 的除数取自更早的周期。升级之后，每个周期它都会继续偏离。

组上限和抵押仍然会独立于系数改变奖励权重。观测到的 `validation_weights[].weight` 的中位数已经包含这些调整。不要用基准吞吐量乘以系数来替换分母。

此次升级中的另一项变化不属于此指标。治理、BLS 和 PoC 验证权力仅限于上一周期已确认的算力。新容量仍会立即获得奖励。请用 `validation_weights[].weight`（奖励权重）计算 H100 等效值。根周期组上每个参与者的 `voting_power` 都是 0。该字段只在模型子组中有值，而且不是容量数字。

## 如何计算

每个周期重新计算一次，在该周期的权重写入 `current_epoch_group_data` 之后进行。PoC 期间链上有两个周期指针。请跟随这个端点。不要从区块高度推导周期。

参考卡：仅限 **NVIDIA H100 80GB HBM3**。

直到升级周期（含该周期），样本是每一台纯 H100 80GB HBM3 主机。从下一个周期起，只保留只服务该周期参考模型的主机。

1. `GET /chain-api/productscience/inference/inference/current_epoch_group_data`
   取 `epoch_index`、`total_weight`、`sub_group_models`，以及每个 `validation_weights[]` 条目的 `member_address` 和 `weight`。使用这份根级 `weight` 作为主机的奖励权重。它已经包含有效系数。
2. `GET /chain-api/productscience/inference/inference/hardware_nodes_all`
   保留 `participant` 位于本周期 `validation_weights` 中的行。删除其余行。未过滤的列表是历史数据。当前包含 4,455 条记录，并不是实时网络。
3. 仅当所报告的每块 GPU 都是 `NVIDIA H100 80GB HBM3` 时才保留该参与者。一块 H100 PCIe、H100 NVL 或未标注的 `gpu` 都会使该主机移出样本。GPU 类型由主机自报，链上不核验。这个过滤用来避免混合服务器改变每 GPU 权重。
4. 从使用新范围的第一个周期起，把每台纯主机归到它所服务的那一个模型。对 `sub_group_models` 中的每个 `model_id`：

   ```text
   GET /chain-api/productscience/inference/inference/epoch_group_data/{epoch_index}?model_id={model_id}
   ```

   当该子组的 `validation_weights` 中该参与者的 `weight` > 0 时，该参与者即在服务该模型。服务多于一个模型的参与者去掉。其余按那一个模型分组。
5. 选择本周期的参考模型：

   - 当冻结的 `config.coeff_min` 与 `config.coeff_max` 解码后相等时，该模型是钉住的。升级时这个模型是 `MiniMaxAI/MiniMax-M2.7`。
   - 在至少有 3 台纯 H100 主机的钉住模型中，选用此类主机最多的那个。并列时取最小的 `model_id`。
   - 如果没有任何钉住模型拥有 3 台此类主机，就用不分是否钉住、纯 H100 主机最多的那一个模型。并列时取最小的 `model_id`。分母随后跟随该模型的有效系数。标出模型 ID 和系数，这样变动是看得见的。
   - 不要跨模型取中位数。
6. 对参考模型上的每台主机，`sample = weight / h100_count`，其中 `weight` 是第 1 步的根级奖励权重。
7. 分母 = 这些样本的中位数。样本数为偶数时，取两个中间值的平均值。
8. `H100_eq = total_weight / denominator`。

若所选模型上剩余主机少于 3 台：

- 直到升级周期，保留上一周期的分母，并把数字标注为延续值。
- 在此之后，保留上一个使用同一参考 `model_id` 的周期的分母，并标注为延续值。不要复用 457.33 或任何升级前的分母。参考模型发生变化时，不要把旧分母带过去。如果这个模型还没有先前的分母，则该周期不显示这个标题数字。

### 第 410 周期核对

这次核对使用升级前的样本：每一台纯 H100 80GB HBM3 主机，而不是单一参考模型。请把这个数字一直发布到升级周期。

四台纯 H100 80GB HBM3 主机，每 GPU 权重：451.69、452.38、462.29、466.50。

中位数 = 457.33。

`497,724 / 457.33 = 1,088`。

在新范围生效之前，这是应当统一采用的数字。它与 tracker.gonka.vip（约 1,087）一致。gonka.gg 的 1,102 使用同一公式，但额外纳入了三台仅含 H100 PCIe 的主机，使中位数从 457.3 变为 451.7。

使用新范围的第一个周期，标题数字可能变动，因为样本从全部纯 HBM3 主机变为只运行一个参考模型的主机。升级时该模型是 MiniMax，因为它是钉住的模型。如果治理以后放开它，同一条规则会改选当时钉住的模型，或者纯 H100 主机最多的那一个模型。请在标题旁显示样本说明，以便解释这次跳动。

## 显示内容

- 标题：**H100 等效值**，即除法结果。在第 410 周期约为 **1,088**。
- 紧挨标题：分母、样本数量和参考模型。直到升级周期："每块 H100 80GB HBM3 权重 457，4 台主机"。从下一个周期起："每块运行 {model_id} 的 H100 80GB HBM3 的权重，有效系数 {effective_coefficient}，N 台主机"。
- 若显示物理 GPU 数量，应单独一行，并标注为自报库存。
- gonka.gg 上的标题 "H100 中位权重：1,102" 是等效数量，不是中位数。请把等效值标注为 H100 等效值，并单独显示中位数。
- 将该卡片标注为奖励权重等效值。网络转向更高系数的模型时，这个数字可以在 GPU 数量不变的情况下发生变化。

每个周期都用该周期的权重刷新分母。使用新系数范围的第一个周期是升级之后的那个周期，不是升级周期本身。

## 如果还要显示模型系数

不要再把 `poc_params.models[].weight_scale_factor` 当作当前系数。升级之后该字段为空。

一个周期的奖励乘数是 `effective_coefficient`：

```text
GET /chain-api/productscience/inference/inference/dynamic_coefficients/{epoch_index}
```

`epoch_index = 0` 表示当前周期。根周期组上的 `confirmation_weight_scales` 是同一组数据。

对每个模型：

- `effective_coefficient` 是已经包含在 `validation_weights[].weight` 里的乘数。图表上的「系数」应使用这个数。
- `base_coefficient` 是供给超过目标、被稀释之前的控制器数值。把它和有效系数并列显示。当模型的算力份额高于目标时，两者不同。
- `config.coeff_min`、`config.coeff_max`、`config.target_share_bps` 和 `config.relative_difficulty` 是该周期冻结的边界、目标和难度。目标份额为 `target_share_bps / 10000`。上面的表格只是初始边界。
- `poc_params.models[].dynamic_coefficient` 是下一次 PoC 将使用的治理边界。它不是当前周期使用的系数。

每个 `Decimal` 按 `value × 10^exponent` 解码。`value` 和 `exponent` 可能是数字或字符串。`{value: 3024, exponent: -4}` 等于 0.3024。

v0.2.16 之前形成的周期没有 `effective_coefficient`。这些周期使用 `weight_scale_factor`。升级周期的 `effective_coefficient` 已经设为原来的规模系数。

跳过 `exclude_from_confirmation = true` 的条目。PoC 期间，即将到来的周期可能已经有 `config`，而 `effective_coefficient` 仍为空。此时系数尚未算出。不要用治理边界或 1 代替。

[v0.2.13 确认权重步骤](./dashboard-maintainer-memo-v0.2.13.md) 用 `weight_scale_factor` 缩放原始 PoC 权重。从升级周期起，该公式在 `effective_coefficient` 存在时改用它，仅在它缺失时才使用 `weight_scale_factor`。
