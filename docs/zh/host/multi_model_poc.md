# 多模型概念验证 — 主机操作指南

多模型计算证明（PoC）于 v0.2.12 版本引入，并在 v0.2.13 版本进一步扩展。

## v0.2.12 和 v0.2.13 中的变更内容

在 v0.2.12 之前，网络仅运行一个强制模型：`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。v0.2.12 增加了 `moonshotai/Kimi-K2.6` 作为第二个经治理批准的模型，并引入了按模型的参与、委托和惩罚时间机制。v0.2.13 重新校准了模型系数，并增加了 `MiniMaxAI/MiniMax-M2.7` 作为第三个经治理批准的模型。

截至纪元 `308`，`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 已经通过治理（提案 78）退役，`MiniMaxAI/MiniMax-M2.7` 成为基础模型和活跃的 PoC 模型。主网上的 `poc_params.models` 包含：

| `model_id` | 当前主网状态 | `weight_scale_factor` | `penalty_start_epoch` |
|---|---|---:|---:|
| `MiniMaxAI/MiniMax-M2.7` | 活跃 | `0.3024` | `278` |
| `moonshotai/Kimi-K2.6` | 重新引导（通过后续投票恢复） | `0.78` | `251` |

这些值由治理控制，可能会发生变化。在采取行动前，请始终通过您所使用的链上的实时 `params` 查询进行确认。

??? note "为什么多模型 PoC 如此设计"

该设计的目标是在保持相同的安全模型（BFT 假设）的同时，允许网络支持多个模型，而无需每个主机都运行所有模型。

没有委托的情况下：

    - 降低新模型的验证阈值会使网络中一小部分节点获得不成比例的影响力。
    - 保持标准的 2/3 阈值会使新模型的激活变得极其困难，因为需要绝大多数主机首先部署它们。

委托解决了这个问题：

    - 不运行某个模型的主机仍可将其权重贡献给验证过程
    - 新模型可以安全启动，而无需强制全网采用
    - 网络在保持安全保证的同时保持灵活性

## 治理模型

新模型通过治理添加：每个新模型都应有其独立的治理流程、参数和激活计划。对于每个经批准的模型，主机可选择运行、委托、拒绝或不采取任何操作。

## 范围和前提条件

**包含内容：** 升级前的模型清理、按模型的参与选择、委托和意图交易、委托查询、PoC v2 提交诊断，以及影响您选择的链参数。

**签名：** 本指南中的所有内容均假设您使用您的**冷**主机密钥（`--from` 指向该账户）进行广播。（但可授予使用热密钥执行委托的权限。）

**开始前：** 确认您的二进制文件和网络提供以下命令：

```
./inferenced query inference --help
./inferenced tx inference --help
```

**进一步阅读（设计和费用）：** [多模型 PoC 提案 README](https://github.com/gonka-ai/gonka/blob/67e205acc46da7cafe330e605b4b22e5d38f2dc7/proposals/multi-model-poc/README.md)。

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
   │     │
   │     │  └─ NO
   │     │     └─ Refuse delegation (~10% penalty)
   │
   └─ If you do nothing
      └─ Risk highest penalty (~15%)
```

在大多数情况下：

- 如果您未运行该模型，委托是最安全的默认选项
- 一旦启用惩罚，不采取任何操作是最差的选择

## 推荐操作

如果您未运行某个模型：

- 如果您运行多个节点且至少一个节点运行该模型：为此模型委托给您的节点
- 如果您完全不运行该模型：委托给一个您信任的主机
- 如果您不信任任何委托方：为此模型使用 `refuse-poc-delegation`

一旦某个模型达到 `penalty_start_epoch`，不直接或通过有效委托参与该模型，可能会根据治理配置的参数降低您的共识权重。

## 您的选项（按模型）

> 要获取所有经治理批准的 `model_id` 值列表，请运行：
> ```
> ./inferenced query inference params --node "$NODE" -o json
> ```
> 查看 `poc_params` → `models`。

| 您的目标 | 命令 | 主机选择它的原因 |
|---|---|---|
| 自己运行此模型的PoC | （无单独的链上“加入”操作；你的堆栈提交PoC v2存储提交） | 你将在该模型的纪元中保持在该组中。 |
| 信任其他主机对该模型的验证投票 | `set-poc-delegation` | 如果验证时的规则得到满足，你的权重可以计入他们对该模型PoC检查的影响力。（参见[你的委托是否有效？](#does-your-delegation-actually-count)） |
| 明确选择不为该模型委托 | `refuse-poc-delegation` | 明确选择“不”进行委托；在该模型的惩罚启用后，若治理配置了相关规则，可能会适用拒绝式扣减。（参见[当你的链上选择被冻结时](#when-your-on-chain-choices-are-frozen)） |
| 不做额外操作 | （无交易） | 默认行为；一旦启用，可能导致最高惩罚 |
| 在新模型完全上线前发出计划信号 | `declare-poc-intent` | 仅用于**引导报告**；它**不能替代**运行PoC。你仍需在PoC中提交存储提交才能算作自己提供该模型服务。参见[引导预资格事件](#bootstrap-pre-eligibility-events)。 |

### 策略对比

| 策略 | 结果 |
|--------|--------|
| 运行模型 | 全面参与，无惩罚 |
| 委托 | 轻微权重损失（约5%），避免惩罚 |
| 拒绝 | 约10%权重损失 |
| 不做任何操作 | 如果共识群体在你未参与的情况下形成，最多损失约15%权重 |

**每个模型仅存储一个选择**：对于每个`model_id`和你的地址，链上最多只保留一个委托/拒绝/意向。这三项中的任何一项新交易都会**替换**之前的记录。在该纪元应用规则时，自己提供该模型服务（拥有该模型的有效存储提交）优先于上述三项。

没有通用的默认推荐。运行、委托、拒绝或什么都不做，是每个主机和每个模型的策略性决策。

!!! note "当前主网参数（撰写时）"

    - `refusal_penalty`：约10%的权重
    - `no_participation_penalty`：约15%（如果共识群体在你未参与的情况下形成）
    - `delegation_share`：约5%的权重将转移给被委托方

这些数值由治理控制，可能发生变化。请始终使用`params`进行核实。

!!! note "宽限期"

    升级后，新引入模型的惩罚不会立即生效。

    主机通常有较短窗口期（约3天）来：

    - 部署模型
    - 配置委托
    - 或明确拒绝

请在`params`中检查`penalty_start_epoch`以获取确切时间。

---

## 什么是PoC委托

每个**已批准的模型**都有其独立的PoC。你**上一个纪元**的**共识权重**仍会影响你**未亲自运行**的模型的PoC验证投票权。

**委托**意味着：对于给定的`model_id`，你向链上说明该权重在该模型的**验证投票**中应如何行为——要么支持他人的投票，要么书面退出，要么仅对新模型发出计划信号，或保持默认（无额外交易）。

如果你在该轮次期间（通过你正常的PoC堆栈）提交了该模型的有效**PoC v2 store commit**，则被视为**自行运行该模型的PoC**。这将**覆盖**你之前通过委托/拒绝/意向设置的参与计数方式。

---

## 当你的链上选择被冻结时

链在**两个不同时间点**读取你的设置——它们回答不同的问题，适用于不同的事物。

**1. 轮次PoC验证开始时**
链记录**你委托给谁**以及**是否拒绝**。这适用于**已处于正常运行状态**的模型。此处不读取意向。

**2. 在下一个PoC开始前`deploy_window`个区块**——高度`next_poc_start − deploy_window`
链记录**委托和意向**，用于**引导/预资格**信号，针对**尚未进入正常集合**的模型。如果`deploy_window`为零或负数，则此第二次捕获不会运行。

你是否**实际运行了PoC**并不来自这些存储的行：链使用你在该轮次期间对该模型的**PoC v2 store commits**。

### 你的委托是否真正有效？

`set-poc-delegation`可以随时发送，但只有在**验证开始时**以下所有条件成立，它才会对委托方有帮助：

- 委托方在该轮次中**运行了PoC**（已以常规方式提交相应工作），且
- 委托方在上一轮次中具有**非零共识权重**。

否则，你的委托在该轮次中对该模型将被忽略（实际效果等同于未委托），一旦启用，惩罚规则仍可能适用。

当委托**确实有效**时，你的**全部**权重将计入该主机在验证该模型PoC时的影响力。此外，在权重最终确定时，`delegation_share`在`params`可将你**原始**共识权重的一部分转移给对方——这与拒绝/不参与百分比是不同的机制；具体数值请参阅`params`。

### 引导预资格事件

如果你计划为**新**模型部署硬件，请关注类型为**`bootstrap_model_preeligibility`**的链上事件。典型属性包括：`model_id`、`pre_eligible`、`meets_weight_threshold`、`meets_v_min`、`meets_reachability`、`intent_host_count`、`intent_weight`、`reachable_voting_power`、`total_network_weight`、`snapshot_height`。

利用它们决定**何时**声明意向以及**何时**必须让提交生效：

- 如果`pre_eligible = false`且你计划提供该模型：检查`meets_weight_threshold`和`meets_v_min`。如果两者均为false，你的质押可能不足。
- 如果仅`meets_reachability`为false，请在下次捕获高度前确认你的节点可访问。

---

## 复制粘贴设置命令

### 会话变量（在此shell中设置一次）

在使用以下命令前，在同一shell中运行一次。调整数值后运行该代码块。**以下所有示例**均使用`NODE`、`CHAIN_ID`、`KEY`（你的密钥环中的**冷密钥**名称）和可选的`KEYRING_BACKEND`。

```bash
export NODE="<PUBLIC_URL>"
export CHAIN_ID="gonka-mainnet"
export KEY="gonka-account-key"   # cold key; see note at top on warm-key grants
export KEYRING_BACKEND="file"

export MY_ADDR="$(./inferenced keys show "$KEY" -a --keyring-backend "$KEYRING_BACKEND" 2>/dev/null || true)"
# If keys show fails, set your address explicitly:
# MY_ADDR="gonka1..."
```

以下每个`tx inference …`示例都重复相同的`--from`/`--node`/`--chain-id`/`--keyring-backend`/gas标志，因此你可以复制**一个**代码块而无需从其他地方合并行。如果你的密钥环已是默认设置，可省略`--keyring-backend`。

**可选——减少重复标志：** 在此机器的CLI客户端配置中设置默认RPC节点和链ID（Cosmos风格的`client.toml`；使用`./inferenced config --help`）。之后，你可从下方交易行中省略`--node`和`--chain-id`。


### 参数和轮次

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

**单个模型**（第二个参数可选）：

```bash
./inferenced query inference poc-delegation "$MY_ADDR" "$MODEL" --node "$NODE" -o json
```

响应将分别列出**委托**、**拒绝**和**意向**；对于给定模型，您最多只会拥有三者之一。

---

### 交易

**委托**（发送交易时，被委托方无需已运行该模型的PoC）：

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

## 处罚与参数

处罚和委托份额在构建下一个周期的活跃集合时影响**共识权重**，且在PoC结果已知之后生效。以下所有内容均来自`./inferenced query inference params`（JSON字段因版本略有不同；请在输出中搜索这些名称）。

| 在`params`中的位置 | 字段 | 对主机的含义 |
|---|---|---|
| 在`poc_params`→`models`中每个模型 | `penalty_start_epoch` | 在此周期索引之前，该模型的处罚规则不生效。按`model_id`跟踪。 |
| 在`poc_params`→`models`中每个模型 | `weight_scale_factor` | 将该模型的PoC权重缩放为共识权重。 |
| `delegation_params` | `refusal_penalty` | 在您于`refuse-poc-delegation`之后使用`penalty_start_epoch`时，从您的原始共识权重中移除的比例。 |
| `delegation_params` | `no_participation_penalty` | 在您未拒绝、无有效委托且未自行提供该模型服务时——处罚生效后——被移除的比例。 |
| `delegation_params` | `delegation_share` | 当委托有效时，委托人原始权重中重新分配给被委托人的比例。 |
| `delegation_params` | `deploy_window` | 在下一个PoC开始前选择引导快照高度的区块数（`next_poc_start − deploy_window`）。 |

**高级资格参数**（大多数主机可跳过）：`w_threshold`、`v_min`、`cap_factor`、`initial_model_id`、`max_model_voting_power_percentage`——资格阈值、上限和每模型投票集中度限制。最后一个为零通常表示“无上限”。

如果**`refusal_penalty`**、**`no_participation_penalty`**和**`delegation_share`**均为**零**，链将不应用这些扣除或转移（升级后常见，直到治理启用它们）。

---

## 主机检查清单

1. 升级前，请清理您持久化的MLNode配置，使其仅包含受支持的模型。
2. 尽可能为每个ML节点使用一个逻辑模型。当多个模型存在于同一节点时，配置错误更容易发生。
3. 升级后，确认`params`在`poc_params`下列出了您关心的每个模型。
4. 检查每个模型的`penalty_start_epoch`。
5. 检查`refusal_penalty`、`no_participation_penalty`和`delegation_share`是否非零。
6. 对每个模型，决定您是否要运行它、委托、拒绝或不采取任何操作。
7. 如果您自行运行该模型，请确保您的PoC堆栈为该模型提交有效的PoC v2存储提交。
8. 如果您委托，请使用`poc-delegation`验证结果。
9. 对于新模型，请监控`bootstrap_model_preeligibility`事件，并在捕获高度前发送`declare-poc-intent`（如果您计划参与）。
10. 在任何配置更改、重启或新主机加入后，请确保持久化的DAPI配置中不存在不受支持的模型。
