# 多模型概念验证 — 主机操作指南

多模型计算验证（PoC）于 v0.2.12 版本引入，并在 v0.2.13 版本进一步扩展。

!!! warning "委托指南更新（2026年7月）"

    在 epoch 328–329 事件之后，选择委托方时适用以下两条规则：

    - **不要将委托授予守护节点。** 守护节点是备用机制
用于PoC验证。将委托集中于它们会将主要投票机制和备用机制绑定到同一硬件上，因此两者会同时失效。此前建议将守护节点作为委托目标的指导已撤回。v0.2.14计划引入协议级限制。
    - **避免将委托集中于任何单个主机。** 委托仅在委托方在该轮次提交PoC存储提交时才有效。如果一个被大量委托的主机宕机，所有委托给它的权重将立即消失，模型组可能失去验证多数票。如果您运营多个账户，请将它们指向不同的委托方。目前尚不支持从一个账户基于百分比向多个主机进行委托。
在该轮次中提交PoC存储提交时才有效。如果一个被大量委托的主机宕机，所有委托给它的权重将立即消失，模型组可能失去验证多数票。如果您运营多个账户，请将它们指向不同的委托方。目前尚不支持从一个账户基于百分比向多个主机进行委托。

## v0.2.12和v0.2.13中的变更

在v0.2.12之前，网络仅运行一个强制模型：`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。v0.2.12增加了`moonshotai/Kimi-K2.6`作为第二个治理批准的模型，并引入了按模型的参与、委托和惩罚计时。v0.2.13重新校准了模型系数，并增加了`MiniMaxAI/MiniMax-M2.7`作为第三个治理批准的模型。

自纪元 `308` 起，`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 已通过治理（提案 78）退役，`MiniMaxAI/MiniMax-M2.7` 为基线模型。自纪元 `360`（[提案 94](../network-updates.md#august-14-2026)）起，`deepseek-ai/DeepSeek-V4-Flash-0731` 也成为活跃的 PoC 模型组。主网上 `poc_params.models` 包含：

| `model_id` | 当前主网状态 |
|---|---|
| `MiniMaxAI/MiniMax-M2.7` | 基线模型，活跃 |
| `moonshotai/Kimi-K2.6` | 活跃 |
| `deepseek-ai/DeepSeek-V4-Flash-0731` | 活跃（纪元 360；`weight_scale_factor = 0.246`） |
| `zai-org/GLM-5.2-FP8` | 已注册；未启动（`penalty_start_epoch = 500`） |

每个模型的 `weight_scale_factor` 和 `penalty_start_epoch` 通过治理变更过于频繁，无法在此可靠列出。请始终从您所用链上的实时 `params` 查询中读取：

```
./inferenced query inference params --node "$NODE" -o json
```

查看 `poc_params` → `models`。

??? note "为什么多模型 PoC 如此设计"

此设计的目标是在保持相同的安全模型（BFT 假设）的同时，允许网络支持多个模型，而无需每个主机运行所有模型。

不通过委托：

    - 降低新模型的验证阈值会使网络的一小部分积累不成比例的影响力。
    - 保持标准的 2/3 阈值会使新模型的激活变得非常困难，因为需要大多数主机首先部署它们。

委托解决此问题：

    - 不运行模型的主机仍可将其权重贡献给验证
    - 新模型可以安全启动，而无需强制全网采用
    - 网络在保持安全保证的同时仍保持灵活性

## 治理模型

新模型通过治理添加：每个新模型都应有其独立的治理流程、参数和激活计划。对于每个获批的模型，主机可选择运行、委托、拒绝或不采取任何操作。

## 范围和前提条件

**包含在内：** 升级前的模型清理、按模型的参与选择、委托和意向交易、委托查询、PoC v2 提交诊断，以及影响您选择的链参数。

**签名：** 本指南中的所有内容均假设您使用您的**冷**主机密钥广播（`--from` 指向该账户）。*（但可授权使用热密钥执行委托。）***开始前：** 确认您的二进制文件和网络提供以下命令：

```
./inferenced query inference --help
./inferenced tx inference --help
```

**进一步阅读（设计和费用）：** [多模型 PoC 提案 README](https://github.com/gonka-ai/gonka/blob/67e205acc46da7cafe330e605b4b22e5d38f2dc7/proposals/multi-model-poc/README.md)。

---

## 我该做什么？（快速决策指南）

```
Do you run the model?

├─ YES
│  └─ Do nothing → you are fully participating (no penalties)

└─ NO
   ├─ Do you have another node that runs this model?
   │
   │  ├─ YES
   │  │  └─ Delegate to your own node
   │
   │  └─ NO
   │     ├─ Do you trust another host?
   │     │
   │     │  ├─ YES
   │     │  │  └─ Delegate to that host (share 5% of weight)
   │     │  │     Never a guardian node; prefer a host that is
   │     │  │     not already a top delegation target
   │     │
   │     │  └─ NO
   │     │     └─ Refuse delegation (~10% penalty)
   │
   └─ If you do nothing
      └─ Risk highest penalty (~15%)
```

在大多数情况下：

- 如果您未运行该模型，委托是最安全的默认选择
- 一旦惩罚启用，不采取任何操作是最差的选择

## 推荐操作

如果您未运行某个模型：

- 如果您运行多个节点，且至少有一个节点运行该模型：将该模型委托给您的节点
- 如果您完全不运行该模型：委托给一个您信任的主机。选择时：
    - 它**不能**是守护节点；
    - 它应该在最近的多个周期内**稳定地提供该模型**（委托
仅在委托方在该周期内提交PoC存储提交时才有效）；
    - 它在上一个纪元中应具有**非零共识权重**；
    - 优先选择**不是主要委托目标**的主机——如果
`max_model_voting_power_percentage` 被设置，超出上限的委托权重
      将被销毁，集中度会使整个群体变得脆弱。
- 如果你不信任任何委托人：对该模型使用 `refuse-poc-delegation`

一旦某个模型达到 `penalty_start_epoch`，不直接或通过有效委托参与该模型可能会降低你的共识权重，具体取决于治理配置的参数。

## 您的选项（每个模型）

> 要获取所有治理批准的 `model_id` 值列表，请运行：
> ```
> ./inferenced query inference params --node "$NODE" -o json
> ```
> 查看 `poc_params` → `models`。

| 您想要的内容 | 命令 | 主机选择它的原因 |
|---|---|---|
| 自行运行此模型的PoC | （无单独的链上“加入”操作；您的堆栈提交PoC v2存储提交） | 您将在该模型的整个纪元中保持在该组中。 |
| 信任其他主机对该模型的验证投票 | `set-poc-delegation` | 如果验证时的规则得到满足，您的权重可以计入它们对该模型PoC检查的影响（参见[您的委托是否有效？](#does-your-delegation-actually-count)）。 |
| 明确选择不为该模型委托 | `refuse-poc-delegation` | 清除委托的"否"选项；在该模型的惩罚启用后，如果治理配置了相关规则，可能会适用拒绝类扣分。（参见[当您的链上选择被冻结时](#when-your-on-chain-choices-are-frozen) |
| 不进行额外操作 | *(无交易)* | 默认行为；启用后可能导致最高惩罚 |
| 在新模型完全上线前发出计划信号 | `declare-poc-intent` | 仅用于**引导报告**；它**不**替代运行PoC。您仍需在PoC中提交存储承诺，才能算作自己提供该模型服务。参见[引导预资格事件](#bootstrap-pre-eligibility-events) |

### 策略比较

| 策略 | 结果 |
|--------|--------|
| 运行模型 | 全面参与，无惩罚 |
| 委托 | 轻微权重损失（约5%），避免惩罚 |
| 拒绝 | 约10%权重损失 |
| 不操作 | 如果形成法定人数而您未参与，最多损失约15%权重 |

**每个模型仅存储一个选择**：对于每个`model_id`和您的地址，链上最多仅保留一个委托/拒绝/意向。这三个中的任何新交易都会**替换**之前的选项。在链应用该纪元规则时，自己提供模型服务（在该纪元中拥有该模型的有效存储承诺）优先于上述三个选项。

没有通用的默认建议。运行、委托、拒绝或不操作是每个主机和每个模型的策略性决策。

!!! note "当前主网参数（撰写时）"

    - `refusal_penalty`: 您权重的约10%
    - `no_participation_penalty`: 约15%（如果共识形成时您未参与）
    - `delegation_share`: 您权重的约5%将转移给委托方

这些值由治理控制，可能会更改。请始终使用 `params` 进行验证。

!!! note "宽限期"

    升级后，新引入模型的惩罚不会立即生效。

    主机通常有较短的时间窗口（约3天）来：

    - 部署模型
    - 配置委托
    - 或明确拒绝

请在 `params` 中检查 `penalty_start_epoch` 以获取确切时间。

---

## 什么是PoC委托

每个**已批准的模型**都有其自己的PoC。您在**上一个**纪元的**共识权重**仍影响**谁有权影响您未自行运行的模型的PoC验证**。

**委托**意味着：对于给定的 `model_id`，您告诉链该权重在该模型的**验证投票**中应如何行为——您可以支持他人的投票、书面选择退出、仅表明对新模型的计划，或保持默认（无需额外交易）。

如果您在纪元期间通过正常的PoC堆栈为该模型提交了有效的**PoC v2存储提交**，则您被视为**自行运行该模型的PoC**。这将**覆盖**您之前通过委托/拒绝/意向设置的参与方式。

---

## 您的链上选择何时冻结

链在**两个不同时间点**读取您的设置——它们回答不同的问题并应用于不同的事项。

**1. 纪元PoC验证开始时**
链记录您**委托给谁**以及**是否拒绝**。这适用于**已正常运行**的模型。此处不读取意向。

**2. 下一个PoC开始前 `deploy_window` 个区块** — 高度 `next_poc_start − deploy_window`
链记录**委托和意向**，用于**引导/预资格**信号，针对**尚未进入正常集合**的模型。如果 `deploy_window` 为零或负数，则此第二次捕获不运行。

您是否**实际运行了PoC**并非来自这些存储行：链使用您在纪元期间对该模型的**PoC v2存储提交**。

### 您的委托是否真的有效？

`set-poc-delegation` 可随时发送，但只有在**验证开始时**以下所有条件成立时，它才**帮助**委托方：

- 委托方在该纪元中**运行了PoC**（以常规方式提交了相应工作），并且
- 委托方在**上一个纪元**拥有**非零共识权重**。

否则，您的委托在该纪元对该模型无效（与未委托的实际结果相同），且一旦启用，惩罚规则仍可能适用。

!!! warning "如果您的委托方宕机，您可能被惩罚"

    如果委托方未能在该纪元中为该模型提交PoC存储提交，
    您的委托将被忽略，您将被视为**未参与**该模型——即使您善意委托，`no_participation_penalty` 仍可能适用于您。请定期重新检查委托方的参与情况
    （例如，任何网络事件后），并在其变得不可靠时更换委托方。

    当委托**确实有效**时，您的**全部**权重将计入该主机对该模型PoC验证的影响力。此外，`delegation_share` 在 `params` 中可将您**原始**共识权重的一部分转移给他们——这与拒绝/不参与百分比是不同的调节器；请阅读 `params` 以获取确切数值。

### 引导预资格事件

如果您计划为**新**模型配置硬件，请关注类型为 **`bootstrap_model_preeligibility`** 的链事件。典型属性包括：`model_id`、`pre_eligible`、`meets_weight_threshold`、`meets_v_min`、`meets_reachability`、`intent_host_count`、`intent_weight`、`reachable_voting_power`、`total_network_weight`、`snapshot_height`。

利用它们决定**何时**声明意向以及**何时**必须使提交生效：

- 如果 `pre_eligible = false` 且您计划提供此模型：检查 `meets_weight_threshold` 和 `meets_v_min`。如果两者均为假，您的质押可能不足。
- 如果仅 `meets_reachability` 为假，请在下次捕获高度前确认您的节点可访问。

---

## 复制粘贴设置命令

### 会话变量（在本shell中仅设置一次）

在使用以下命令前，在同一shell中运行一次。调整值后运行此代码块。**以下所有示例**均使用 `NODE`、`CHAIN_ID`、`KEY`（您的密钥环中的**冷钱包**密钥名称）和可选的 `KEYRING_BACKEND`。

```bash
export NODE="<PUBLIC_URL>"
export CHAIN_ID="gonka-mainnet"
export KEY="gonka-account-key"   # cold key; see note at top on warm-key grants
export KEYRING_BACKEND="file"

export MY_ADDR="$(./inferenced keys show "$KEY" -a --keyring-backend "$KEYRING_BACKEND" 2>/dev/null || true)"
# If keys show fails, set your address explicitly:
# MY_ADDR="gonka1..."
```

以下每个 `tx inference …` 示例都重复了相同的 `--from` / `--node` / `--chain-id` / `--keyring-backend` / gas 标志，因此您可以复制**一个**代码块而无需从其他地方合并行。如果您的密钥环已经是默认的，您可以省略 `--keyring-backend`。

**可选——减少重复标志：** 在此机器的 CLI 客户端配置中设置默认 RPC 节点和链 ID（Cosmos 风格的 `client.toml`；使用 `./inferenced config --help`）。之后您可以从下面的交易行中省略 `--node` 和 `--chain-id`。


### 参数和周期

```bash
./inferenced query inference params --node "$NODE" -o json
```

```bash
./inferenced query inference get-current-epoch --node "$NODE" -o json
```

### 查询委托状态

**所有模型：**

```bash
./inferenced query inference poc-delegation "$MY_ADDR" --node "$NODE" -o json
```

**一个模型**（第二个参数可选）：

```bash
./inferenced query inference poc-delegation "$MY_ADDR" "$MODEL" --node "$NODE" -o json
```

响应分别列出了**委托**、**拒绝**和**意向**；对于给定模型，您最多只会拥有这三者中的**一个**。

---

### 交易

**委托**（发送交易时，委托方无需已运行该模型的 PoC）：

```bash
MODEL="your-model-id"
DELEGATEE="gonka1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

./inferenced tx inference set-poc-delegation "$MODEL" "$DELEGATEE" \
  --from "$KEY" \
  --node "$NODE" \
  --chain-id "$CHAIN_ID" \
  --keyring-backend "$KEYRING_BACKEND" \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

**清除委托**：

```bash
MODEL="your-model-id"

./inferenced tx inference set-poc-delegation "$MODEL" "" \
  --from "$KEY" \
  --node "$NODE" \
  --chain-id "$CHAIN_ID" \
  --keyring-backend "$KEYRING_BACKEND" \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

**拒绝**：

```bash
MODEL="your-model-id"

./inferenced tx inference refuse-poc-delegation "$MODEL" \
  --from "$KEY" \
  --node "$NODE" \
  --chain-id "$CHAIN_ID" \
  --keyring-backend "$KEYRING_BACKEND" \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

**引导意向**：

```bash
MODEL="your-model-id"

./inferenced tx inference declare-poc-intent "$MODEL" \
  --from "$KEY" \
  --node "$NODE" \
  --chain-id "$CHAIN_ID" \
  --keyring-backend "$KEYRING_BACKEND" \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

---

## 惩罚与参数

惩罚和委托份额在构建下一个周期的活跃集合时应用于**共识权重**，**在** PoC 结果已知之后。以下所有内容均来自 `./inferenced query inference params`（JSON 字段因版本略有不同；在输出中搜索这些名称）。

| 在 `params` 中的位置 | 字段 | 对主机的含义 |
|---|---|---|
| 每个模型在 `poc_params` → `models` 中 | `penalty_start_epoch` | 在此周期索引之前，**该模型**的惩罚规则不适用。按 `model_id` 跟踪。 |
| 每个模型在 `poc_params` → `models` 中 | `weight_scale_factor` | 将该模型的 PoC 权重缩放为共识权重。 |
| `delegation_params` | `refusal_penalty` | 在 `penalty_start_epoch` 之后使用 `refuse-poc-delegation` 时从原始共识权重中移除的比例。 |
| `delegation_params` | `no_participation_penalty` | 未拒绝、无有效委托且未自行提供该模型服务时——在应用惩罚后移除的比例。 |
| `delegation_params` | `delegation_share` | 当委托有效时，委托人原始权重中重新分配给被委托人的比例。 |
| `delegation_params` | `deploy_window` | 在下一个 PoC 开始前选择引导快照高度的区块数（`next_poc_start − deploy_window`）。 |

**高级资格参数**（大多数主机可跳过）：`w_threshold`、`v_min`、`cap_factor`、`initial_model_id`、`max_model_voting_power_percentage`——资格阈值、上限和每模型投票集中度限制。最后一个为零通常表示“无上限”。

如果 **`refusal_penalty`**、**`no_participation_penalty`** 和 **`delegation_share`** 均为**零**，链不会应用这些扣除或转移（升级后常见，直到治理启用它们）。

---

## 主机检查清单

1. 升级前，清理您持久化的 MLNode 配置，使其仅包含受支持的模型。
2. 尽可能为每个 ML 节点使用一个逻辑模型。当多个模型共存于同一节点时，配置错误更容易发生。
3. 升级后，确认 `params` 在 `poc_params` 下列出了您关心的每个模型。
4. 检查每个模型的 `penalty_start_epoch`。
5. 检查 `refusal_penalty`、`no_participation_penalty` 和 `delegation_share` 是否非零。
6. 对于每个模型，决定您是想运行它、委托、拒绝，还是什么都不做。
7. 如果您自行运行该模型，请确保您的 PoC 堆栈为该模型提交有效的 PoC v2 存储提交。
8. 如果您委托，请使用 `poc-delegation` 验证结果，并确认被委托人在当前周期确实为该模型提交了 PoC。
9. 对于新模型，请监控 `bootstrap_model_preeligibility` 事件，并在捕获高度前发送 `declare-poc-intent`（如果您计划参与）。
10. 在任何配置更改、重启或新主机上线后，请确保持久化的 DAPI 配置中不存在不支持的模型。
11. 绝不要将守护节点设为您的委托目标。
12. 在网络事件后，重新验证您的委托方是否仍在提供该模型服务；委托在验证开始时被快照，无法在周期内重新路由。
