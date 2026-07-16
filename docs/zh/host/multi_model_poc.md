# 多模型概念验证 — 主机操作指南

多模型计算验证（PoC）在 v0.2.12 版本中引入，并在 v0.2.13 版本中进一步扩展。

!!! warning "委托指南更新（2026年7月）"

    在 epoch 328–329 事件之后，选择委托方时适用以下两条规则：

    - **不要将委托授予守护节点。** 守护节点是备用机制
用于PoC验证。将委托集中于它们会将主要投票机制和备用机制绑定到同一硬件上，因此两者会同时失效。之前建议将守护节点作为委托目标的指导已撤回。v0.2.14计划引入协议级限制。
    - **避免将委托集中于任何单个主机。** 委托仅在委托方在该周期提交PoC存储提交时才有效。如果一个被大量委托的主机宕机，所有委托给它的权重将立即消失，模型组可能失去验证多数票。如果您操作多个账户，请将它们指向不同的委托方。目前尚不支持从一个账户基于百分比向多个主机进行委托。
在该周期内提交PoC存储提交时才有效。如果一个被大量委托的主机宕机，所有委托给它的权重将立即消失，模型组可能失去验证多数票。如果您操作多个账户，请将它们指向不同的委托方。目前尚不支持从一个账户基于百分比向多个主机进行委托。

## v0.2.12和v0.2.13中的变更

在v0.2.12之前，网络仅运行一个强制模型：`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。v0.2.12添加了`moonshotai/Kimi-K2.6`作为第二个经治理批准的模型，并引入了按模型的参与、委托和惩罚时间。v0.2.13重新校准了模型系数，并添加了`MiniMaxAI/MiniMax-M2.7`作为第三个经治理批准的模型。

自纪元 `308` 起，`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 已通过治理（提案 78）退役，`MiniMaxAI/MiniMax-M2.7` 为基准模型和活跃的 PoC 模型。主网上 `poc_params.models` 包含：

| `model_id` | 当前主网状态 |
|---|---|
| `MiniMaxAI/MiniMax-M2.7` | 基准模型，活跃 |
| `moonshotai/Kimi-K2.6` | 在纪元 328–329 事件后重新引导 |

每个模型的 `weight_scale_factor` 和 `penalty_start_epoch` 通过治理频繁变更，此处无法可靠列出。请始终从您所用链上的实时 `params` 查询中读取：

```
./inferenced query inference params --node "$NODE" -o json
```

查看 `poc_params` → `models`。

??? note "为何多模型 PoC 如此设计"

此设计的目标是在保留相同的安全模型（BFT 假设）的同时，允许网络支持多个模型，而无需每个主机运行所有模型。

没有委托的情况下：

    - 降低新模型的验证阈值会使网络的一小部分获得不成比例的影响力。
    - 保持标准的2/3阈值将使新模型的激活变得非常困难，因为需要超级多数的主机首先部署它们。

委托可以解决这个问题：

    - 不运行模型的主机仍可将其权重贡献给验证
    - 新模型可以安全地启动，而无需强制全网采用
    - 网络在保持其安全保证的同时仍具有灵活性

## 治理模型

新模型通过治理添加：每个新模型都应有其自己的治理流程、参数和激活计划。对于每个获批的模型，主机可以决定是否运行、委托、拒绝或不采取任何操作。

## 范围和前提条件

**在范围内：** 升级前的模型清理、按模型的参与选择、委托和意向交易、委托查询、PoC v2提交诊断，以及影响您选择的链参数。

**签名：** 本指南中的所有内容均假设您使用您的**冷**主机密钥（`--from`指向该账户）进行广播。（但可以授权使用热密钥执行委托。）

**开始前：** 确认您的二进制文件和网络提供以下命令：

```
./inferenced query inference --help
./inferenced tx inference --help
```

**进一步阅读（设计和费用）：** [多模型PoC提案README](https://github.com/gonka-ai/gonka/blob/67e205acc46da7cafe330e605b4b22e5d38f2dc7/proposals/multi-model-poc/README.md)。

---

## 我应该做什么？（快速决策指南）

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
- 一旦惩罚启用，不采取任何操作是最糟糕的选择

## 推荐操作

如果您未运行某个模型：

- 如果您运行多个节点，且至少一个节点运行该模型：为该模型委托给您的节点
- 如果您完全不运行该模型：委托给一个您信任的主机。选择时：
    - 它**不能**是守护节点；
    - 它应在此前多个纪元中**稳定地提供该模型**（委托
仅在委托方在该纪元提交了PoC存储提交时才有效）；
    - 它应在上一个纪元中具有**非零共识权重**；
    - 优先选择**尚未成为主要委托目标**的主机——如果
`max_model_voting_power_percentage`已设置，则超出上限的委托权重
      将被销毁，集中度会使整个组变得脆弱。
- 如果你不信任任何委托方：对该模型使用 `refuse-poc-delegation`

一旦某个模型达到 `penalty_start_epoch`，不直接或通过有效委托参与该模型，可能会根据治理配置的参数降低你的共识权重。

## 你的选项（按模型）

> 要获取所有治理批准的 `model_id` 值列表，请运行：
> ```
> ./inferenced query inference params --node "$NODE" -o json
> ```
> 查看 `poc_params` → `models`。

| 你的目标 | 命令 | 主机选择它的原因 |
|---|---|---|
| 自己运行该模型的PoC | *(无需单独的链上“加入”操作；你的栈提交PoC v2存储提交)* | 你将在该模型的组中保留至本纪元结束。 |
| 信任其他主机对该模型的验证投票 | `set-poc-delegation` | 如果验证时的规则满足，你的权重可计入其对该模型PoC检查的影响力（参见[你的委托是否有效？](#does-your-delegation-actually-count)）。 |
| 明确拒绝为该模型委托 | `refuse-poc-delegation` | 明确拒绝委托；一旦该模型启用惩罚，若治理已配置，则可能适用拒绝型扣减。（参见[当你的链上选择被冻结时](#when-your-on-chain-choices-are-frozen)） |
| 不做额外操作 | *(无交易)* | 默认行为；一旦启用，可能造成最高惩罚 |
| 在新模型完全上线前发出计划信号 | `declare-poc-intent` | 仅用于**引导报告**；它**不能替代**运行PoC。你仍需在PoC中提交存储提交才能算作自己提供该模型。参见[引导预合格事件](#bootstrap-pre-eligibility-events)。 |

### 策略对比

| 策略 | 结果 |
|--------|--------|
| 运行模型 | 完全参与，无惩罚 |
| 委托 | 轻微权重损失（约5%），避免惩罚 |
| 拒绝 | 约10%权重损失 |
| 不做任何操作 | 若共识群形成时你未参与，最多损失约15%权重 |

**每个模型仅存储一个选择**：对于每个 `model_id` 和你的地址，链上最多只保留委托/拒绝/意向三者中的一个。任何这三者的新交易将**替换**之前的记录。在链应用该纪元规则时，自己提供该模型（在该纪元拥有有效的存储提交）优先于上述三种选择。

没有普遍适用的默认建议。运行、委托、拒绝或什么都不做，是每个主机和每个模型的策略性决策。

!!! note "当前主网参数（撰写时）"

    - `refusal_penalty`：约为你权重的10%
    - `no_participation_penalty`: ~15%（如果共识形成时你未参与）
    - `delegation_share`: 你的权重中约5%将转移给委托方

这些值由治理控制，可能会更改。请始终使用 `params` 进行验证。

!!! note "宽限期"

    升级后，新引入模型的惩罚不会立即生效。

    主机通常有较短的时间窗口（约3天）来：

    - 部署模型
    - 配置委托
    - 或明确拒绝

请在 `params` 中查看 `penalty_start_epoch` 以获取确切时间。

---

## 什么是PoC委托

每个**已批准的模型**都有其独立的PoC。你**上一个纪元**的**共识权重**仍会影响**你未自行运行的模型**的PoC验证投票权。

**委托**意味着：对于给定的 `model_id`，你告诉链如何在该模型的**验证投票**中使用你的权重——你可以支持他人的投票、书面选择退出、仅表明对新模型的计划，或保持默认（不发送额外交易）。

如果你在该纪元期间通过正常的PoC堆栈提交了有效的**PoC v2存储提交**，则你被视为**自行运行该模型的PoC**。这将**覆盖**你之前通过委托/拒绝/意向设置的参与方式。

---

## 你的链上选择何时被冻结

链会在**两个不同时间点**读取你的设置——它们回答不同的问题，适用于不同的内容。

**1. 纪元PoC验证开始时**
链记录你**委托给谁**以及**是否拒绝**。这适用于**已正常运行的模型**。意向在此处不被读取。

**2. 下一个PoC开始前 `deploy_window` 个区块处**——高度 `next_poc_start − deploy_window`
链记录**委托和意向**，用于**引导/预资格**信号，针对**尚未进入正常集合**的模型。如果 `deploy_window` 为零或负数，则此第二次捕获不会运行。

你是否**实际运行了某个模型的PoC**，并非来自这些存储行：链使用你在该纪元期间对该模型的**PoC v2存储提交**。

### 你的委托是否真的有效？

`set-poc-delegation` 可随时发送，但只有在**验证开始时**以下所有条件成立，它才会对委托方有帮助：

- 委托方在该纪元中**运行了该 `model_id` 的PoC**（已以常规方式提交相应工作），并且
- 委托方在**上一个纪元**拥有**非零共识权重**。

否则，你的委托在该纪元对该模型无效（与未委托的实际效果相同），一旦启用惩罚规则，仍可能对你施加惩罚。

!!! warning "如果委托方宕机，你可能被惩罚"

    如果委托方未能在该纪元中为该模型提交PoC存储提交，
    你的委托将被忽略，你将被视为**未参与**该模型——即使你出于善意进行了委托，`no_participation_penalty` 仍可能适用于你。请定期重新检查委托方的参与情况
    （例如，在任何网络事件后），并在其变得不可靠时更换委托方。

    当委托**确实有效**时，你的**全部**权重将计入该主机对该模型PoC验证的影响力。此外，**`delegation_share`** 在 `params` 中可以将你**原始**共识权重的一部分转移给他们——这与拒绝/不参与百分比是不同的调节器；请阅读 `params` 以获取确切数值。

### 引导预资格事件

如果你计划为**新**模型部署硬件，请关注类型为 **`bootstrap_model_preeligibility`** 的链事件。典型属性包括：`model_id`、`pre_eligible`、`meets_weight_threshold`、`meets_v_min`、`meets_reachability`、`intent_host_count`、`intent_weight`、`reachable_voting_power`、`total_network_weight`、`snapshot_height`。

利用它们决定**何时**声明意向以及**何时**必须让提交生效：

- 如果 `pre_eligible = false` 且你计划提供此模型：检查 `meets_weight_threshold` 和 `meets_v_min`。如果两者均为假，你可能没有足够的质押。
- 如果仅 `meets_reachability` 为假，请在下一次捕获高度前确认你的节点可访问。

---

## 复制粘贴设置命令

### 会话变量（在此shell中仅设置一次）

在使用以下命令前，请在同一个shell中运行一次。调整数值后运行此代码块。**以下所有示例**均使用 `NODE`、`CHAIN_ID`、`KEY`（你的密钥环中的**冷密钥**名称）和可选的 `KEYRING_BACKEND`。

```bash
export NODE="<PUBLIC_URL>"
export CHAIN_ID="gonka-mainnet"
export KEY="gonka-account-key"   # cold key; see note at top on warm-key grants
export KEYRING_BACKEND="file"

export MY_ADDR="$(./inferenced keys show "$KEY" -a --keyring-backend "$KEYRING_BACKEND" 2>/dev/null || true)"
# If keys show fails, set your address explicitly:
# MY_ADDR="gonka1..."
```

以下每个 `tx inference …` 示例都重复了相同的 `--from` / `--node` / `--chain-id` / `--keyring-backend` / gas 标志，因此您可以复制**一个**代码块而无需从其他地方合并行。如果您的密钥环已是默认值，您可以省略 `--keyring-backend`。

**可选 — 减少重复标志：** 为这台机器的 CLI 客户端配置默认 RPC 节点和链 ID（Cosmos 风格 `client.toml`；使用 `./inferenced config --help`）。之后您可以从下面的交易行中省略 `--node` 和 `--chain-id`。


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

响应将**委托**、**拒绝**和**意向**分别列出；对于给定模型，您最多只会拥有这三者中的**一个**。

---

### 交易

**委托**（发送交易时，被委托方无需已运行该模型的 PoC）：

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

**清除委托：**

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

**拒绝：**

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

**引导意向：**

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

惩罚和委托份额在构建下一个周期的活跃集合时应用于**共识权重**，**在** PoC 结果已知之后。以下所有内容均来自 `./inferenced query inference params`（JSON 字段因版本而略有不同；请在输出中搜索这些名称）。

| 在 `params` 中的位置 | 字段 | 对主机的含义 |
|---|---|---|
| 每个模型在 `poc_params` → `models` 中 | `penalty_start_epoch` | 在此周期索引之前，**该模型**的惩罚规则不适用。按 `model_id` 跟踪。 |
| 每个模型在 `poc_params` → `models` 中 | `weight_scale_factor` | 将该模型的 PoC 权重缩放为共识权重。 |
| `delegation_params` | `refusal_penalty` | 在 `penalty_start_epoch` 之后使用 `refuse-poc-delegation` 时，从您原始共识权重中移除的比例。 |
| `delegation_params` | `no_participation_penalty` | 未拒绝、无有效委托且未自行提供模型服务时，在应用惩罚后移除的比例。 |
| `delegation_params` | `delegation_share` | 当委托有效时，委托人原始权重中重新分配给被委托人的比例。 |
| `delegation_params` | `deploy_window` | 选择引导快照高度的周期开始前的区块数（`next_poc_start − deploy_window`）。 |

**高级资格参数**（大多数主机可跳过）：`w_threshold`、`v_min`、`cap_factor`、`initial_model_id`、`max_model_voting_power_percentage` — 资格阈值、上限和每模型投票集中度限制。最后一个为零通常表示“无上限”。

如果 **`refusal_penalty`**、**`no_participation_penalty`** 和 **`delegation_share`** 均为**零**，链将不应用这些扣除或转移（升级后常见，直到治理启用它们）。

---

## 主机检查清单

1. 升级前，请清理您持久化的 MLNode 配置，使其仅包含受支持的模型。
2. 尽可能为每个 ML 节点使用一个逻辑模型。当多个模型共存于同一节点时，配置错误更容易发生。
3. 升级后，确认 `params` 在 `poc_params` 下列出了您关心的每个模型。
4. 检查每个模型的 `penalty_start_epoch`。
5. 检查 `refusal_penalty`、`no_participation_penalty` 和 `delegation_share` 是否非零。
6. 对于每个模型，决定您是想运行它、委托、拒绝，还是什么都不做。
7. 如果您自行运行模型，请确保您的 PoC 堆栈为该模型提交有效的 PoC v2 存储提交。
8. 如果您委托，请使用 `poc-delegation` 验证结果，并确认被委托方在当前周期确实提交了该模型的 PoC。
9. 对于新模型，请监控 `bootstrap_model_preeligibility` 事件，并在捕获高度前发送 `declare-poc-intent`（如果您计划参与）。
10. 在任何配置更改、重启或新主机上线后，请确保持久化的 DAPI 配置中不存在不受支持的模型。
11. 绝不要将守护节点设为您的委托目标。
12. 在网络事件后，重新验证您的委托方是否仍在提供该模型服务；委托在验证开始时被快照，周期内无法重新路由。
