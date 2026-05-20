# 多模型 PoC — 主机运维指南

v0.2.12 升级引入了多模型计算证明（PoC）。

## v0.2.12 的变化

在 v0.2.12 之前，网络运行单一强制模型：`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。在 v0.2.12 之后，网络可以支持多个由治理批准的模型。每个模型都有自己的 PoC 组、参数和权重贡献。参与情况按模型进行跟踪。本次升级引入的第二个模型是 `moonshotai/Kimi-K2.6`；它已**通过 bootstrap**，并与 Qwen235B 一起在主网上**参与 PoC**。基于相同硬件等级（包括 8×H200 和 8×B200）上的相对计算复杂度，其系数约为 Qwen235B 系数的 3.51 倍。

??? note "为什么多模型 PoC 采用这种设计"

    这种设计的目标是保留相同的安全模型（BFT 假设），同时允许网络支持多个模型，而不要求每个主机都运行所有模型。

    没有委托机制时：

    - 降低新模型的验证阈值会使少部分网络积累不成比例的影响力。
    - 保持标准的 2/3 阈值会使新模型很难激活，因为需要超过三分之二的主机首先部署它们。

    委托解决了这个问题：

    - 不运行某个模型的主机仍然可以贡献其权重用于验证
    - 新模型可以安全启动，而无需强制全网采用
    - 网络在保持灵活性的同时保留了其安全保证

## 治理模型

新模型通过治理添加：每个新模型应该有自己的治理流程、参数和激活时间表。对于每个已批准的模型，主机可以决定是运行、委托、拒绝还是不做任何操作。

## 范围与前提条件

**范围内：** 升级前的模型清理、按模型的参与选择、委托和意图交易、委托查询、PoC v2 commit 诊断，以及影响您选择的链参数。

**签名：** 本指南中的所有操作都假定您从**冷**主机密钥（`--from` 指向该账户）发送广播。*（但可以授予权限使用热密钥执行委托。）*

**开始之前：** 确认您的二进制文件和网络暴露这些命令：

```
./inferenced query inference --help
./inferenced tx inference --help
```

**延伸阅读（设计与费用）：** [多模型 PoC 提案 README](https://github.com/gonka-ai/gonka/blob/67e205acc46da7cafe330e605b4b22e5d38f2dc7/proposals/multi-model-poc/README.md)。

---

## 我该怎么做？（快速决策指南）

```
你运行该模型吗？

├─ 是
│  └─ 什么也不做 → 你已完全参与（无惩罚）

└─ 否
   ├─ 你是否有另一个节点运行此模型？
   │
   │  ├─ 是
   │  │  └─ 委托给你自己的节点
   │
   │  └─ 否
   │     ├─ 你信任另一个主机吗？
   │     │
   │     │  ├─ 是
   │     │  │  └─ 委托给该主机（分享 5% 的权重）
   │     │
   │     │  └─ 否
   │     │     └─ 拒绝委托（~10% 惩罚）
   │
   └─ 如果你什么也不做
      └─ 风险最高惩罚（~15%）
```

在大多数情况下：

- 如果你不运行该模型，委托是最安全的默认选项
- 一旦惩罚启用，什么也不做是最差的选择

## 推荐行动

如果你不运行 Kimi：

- 如果你运营多个节点且至少一个运行 Kimi：委托给你自己的 Kimi 节点
- 如果你完全不运行 Kimi：委托给你信任的主机
- 如果你不信任任何受托方：使用 `refuse-poc-delegation`

一旦某个模型达到 `penalty_start_epoch`，不直接参与该模型或通过有效委托参与，可能会降低你的共识权重，具体取决于治理配置的参数。

## 你的选项（按模型）

> 要获取所有治理批准的 `model_id` 值列表，请运行：
> ```
> ./inferenced query inference params --node "$NODE" -o json
> ```
> 查看 `poc_params` → `models`。

| 你想要什么 | 命令 | 主机为什么选择它 |
|---|---|---|
| 自己运行此模型的 PoC | *（无需单独的链上"加入"；你的堆栈提交 PoC v2 store commit）* | 你在该 epoch 中保留在该模型的组里。 |
| 信任另一个主机对该模型的验证投票 | `set-poc-delegation` | 如果在验证时满足规则（见[您的委托是否真的有效？](#does-your-delegation-actually-count)），你的权重可以计入他们对该模型 PoC 检查的影响力。 |
| 明确选择不为该模型委托 | `refuse-poc-delegation` | 对委托明确说"不"；当该模型的惩罚启用后，如果治理配置了，可能会应用拒绝式扣减。（见[您的链上选择被冻结时](#when-your-on-chain-choices-are-frozen)） |
| 什么也不做 | *（无交易）* | 默认行为；一旦启用可能会导致最高惩罚 |
| 在新模型完全上线之前发出计划信号 | `declare-poc-intent` | **仅用于 bootstrap 报告**；它**不**替代运行 PoC。要算作自己服务该模型，你仍然需要在 PoC 中的 store commit。见[Bootstrap 预资格事件](#bootstrap-pre-eligibility-events)。 |

### 策略对比

| 策略 | 结果 |
|--------|--------|
| 运行模型 | 完全参与，无惩罚 |
| 委托 | 轻微权重损失（~5%），避免惩罚 |
| 拒绝 | ~10% 权重损失 |
| 什么也不做 | 如果在你缺席的情况下形成法定人数，最多 ~15% 权重损失 |

**每个模型一个存储的选择：** 对于每个 `model_id` 和你的地址，链最多保留 **一个** 委托/拒绝/意图。这三个中任何一个的新交易都会**替换**之前的。对于该 epoch，自行服务该模型（在该 epoch 中有该模型的有效 store commit）在链应用规则时优先于这三个选项。

没有通用的默认推荐。运行、委托、拒绝或什么也不做是每个主机和每个模型的策略决策。

!!! note "当前主网参数（撰写时）"

    - `refusal_penalty`：约 10% 的权重
    - `no_participation_penalty`：约 15%（如果在你缺席的情况下形成法定人数）
    - `delegation_share`：你的权重约 5% 被转移到受托方

    这些值由治理控制，可能会更改。请始终使用 `params` 进行验证。

!!! note "宽限期"

    升级后，新引入模型的惩罚不会立即生效。

    主机通常有一个短窗口（~3 天）来：

    - 部署模型
    - 配置委托
    - 或明确拒绝

    检查 `params` 中的 `penalty_start_epoch` 以获取确切时间。

---

## PoC 委托是什么

每个**已批准的模型**都有自己的 PoC。你的**前一个** epoch 的**共识权重**仍然重要，因为它决定了**谁可以影响 PoC 验证**——对于你自己**不**运行的模型。

**委托**意味着：对于给定的 `model_id`，你告诉链该权重在对该模型进行**验证投票**时应如何行为——要么你支持其他人的投票，要么你以书面形式选择不参与，要么你只为新模型发出计划信号，要么你保留默认（无额外交易）。

如果你**确实**在 epoch 期间为该模型提交了有效的 **PoC v2 store commit**（通过你的常规 PoC 堆栈），你将被视为在该 epoch 中**自己运行该模型的 PoC**。这将**覆盖**你为委托/拒绝/意图设置的内容，决定如何计算你的参与。

---

## 您的链上选择何时被冻结 { #when-your-on-chain-choices-are-frozen }

链在**两个不同时间**读取你的设置——它们回答不同的问题并应用于不同的事情。

**1. 该 epoch 的 PoC 验证开始时**
链记录**你委托给谁**以及**你是否拒绝**。这适用于**已处于正常运行**的模型。此处不读取意图。

**2. 下一个 PoC 开始前的 `deploy_window` 个区块** — 高度 `next_poc_start − deploy_window`
链为**尚未进入正常集合**的模型记录**委托和意图**，用于 bootstrap / 预资格信号。如果 `deploy_window` 为零或负数，则不会运行此第二次捕获。

你是否**实际为某个模型运行了 PoC**不是从这些存储的记录中获取的：链使用你在该 epoch 中为该模型的 **PoC v2 store commit**。

### 您的委托是否真的有效？ { #does-your-delegation-actually-count }

`set-poc-delegation` 可以随时发送，但仅当**验证开始时**满足以下所有条件时，它才会**帮助**受托方：

- 受托方在该 epoch 中为该 `model_id` **运行了 PoC**（按通常方式提交了相应的工作），并且
- 受托方在**前一个 epoch 中具有非零共识权重**。

否则，你的委托在该 epoch 中对该模型将被忽略（实际效果与你没有委托相同），并且一旦启用，惩罚规则仍可能适用。

当委托**有效**时，你的**全部**权重将计入该主机对验证该模型 PoC 的影响力。另外，`params` 中的 **`delegation_share`** 可以在权重最终确定时将你的**原始**共识权重的一部分转移给他们——这与拒绝/不参与百分比是不同的旋钮；请阅读 `params` 以获取确切值。

### Bootstrap 预资格事件 { #bootstrap-pre-eligibility-events }

如果你为**新**模型规划硬件，请关注类型为 **`bootstrap_model_preeligibility`** 的链上事件。典型属性包括：`model_id`、`pre_eligible`、`meets_weight_threshold`、`meets_v_min`、`meets_reachability`、`intent_host_count`、`intent_weight`、`reachable_voting_power`、`total_network_weight`、`snapshot_height`。

使用它们来决定**何时**声明意图以及**何时**必须有 commit 上线：

- 如果 `pre_eligible = false` 并且你计划服务此模型：检查 `meets_weight_threshold` 和 `meets_v_min`。如果两者都为 false，可能是你没有足够的权益。
- 如果只有 `meets_reachability` 为 false，请在下一次捕获高度之前验证你的节点是否可达。

---

## 复制粘贴的设置命令 { #copy-paste-setup-commands }

### 会话变量（此 shell 中设置一次）

在使用下面的命令之前，请在同一个 shell 中运行一次。调整值后运行该块。**下面的所有示例**都使用 `NODE`、`CHAIN_ID`、`KEY`（你在密钥环中的**冷**密钥名称）和可选的 `KEYRING_BACKEND`。

```bash
export NODE="<PUBLIC_URL>"
export CHAIN_ID="gonka-mainnet"
export KEY="gonka-account-key"   # 冷密钥；关于热密钥授权，请参阅顶部说明
export KEYRING_BACKEND="file"

export MY_ADDR="$(./inferenced keys show "$KEY" -a --keyring-backend "$KEYRING_BACKEND" 2>/dev/null || true)"
# 如果 keys show 失败，请显式设置你的地址：
# MY_ADDR="gonka1..."
```

下面的每个 `tx inference …` 示例都重复使用相同的 `--from` / `--node` / `--chain-id` / `--keyring-backend` / gas 标志，因此你可以**单独**复制一个块而无需合并其他行。如果你的 keyring 已经是默认值，可以省略 `--keyring-backend`。

**可选 — 减少重复标志：** 在此机器的 CLI 客户端配置（Cosmos 风格的 `client.toml`；使用 `./inferenced config --help`）中设置默认 RPC 节点和 chain id。之后你可以从下面的交易行中省略 `--node` 和 `--chain-id`。


### 参数和 epoch

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

响应分别列出**委托**、**拒绝**和**意图**；对于给定的模型，你最多拥有这三个之一。

---

### 交易

**委托**（当你发送交易时，受托方不需要已经在运行该模型的 PoC）：

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

**Bootstrap 意图：**

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

惩罚和委托份额在已知 PoC 结果**之后**、构建下一个 epoch 的活跃集合时应用于**共识权重**。下面的所有内容都来自 `./inferenced query inference params`（JSON 字段的名称在不同版本间可能略有不同；在输出中搜索这些名称）。

| `params` 中的位置 | 字段 | 对主机的意义 |
|---|---|---|
| 每个模型在 `poc_params` → `models` 中 | `penalty_start_epoch` | 在此 epoch 索引之前，**该模型**的惩罚规则不适用。按 `model_id` 跟踪。 |
| 每个模型在 `poc_params` → `models` 中 | `weight_scale_factor` | 将该模型的 PoC 权重缩放为共识权重。 |
| `delegation_params` | `refusal_penalty` | 在 `penalty_start_epoch` 之后使用 `refuse-poc-delegation` 时，从原始共识权重中扣除的比例。 |
| `delegation_params` | `no_participation_penalty` | 当你没有拒绝、没有有效委托并且没有自己服务该模型时——惩罚生效后，扣除的比例。 |
| `delegation_params` | `delegation_share` | 委托有效时从委托人原始权重重新分配给受托方的比例。 |
| `delegation_params` | `deploy_window` | 在下一个 PoC 开始之前选择 bootstrap 快照高度的区块数（`next_poc_start − deploy_window`）。 |

**高级资格参数**（大多数主机可以跳过）：`w_threshold`、`v_min`、`cap_factor`、`initial_model_id`、`max_model_voting_power_percentage` — 资格阈值、上限和每个模型的投票集中度限制。最后一个为零通常表示"无上限"。

如果 **`refusal_penalty`**、**`no_participation_penalty`** 和 **`delegation_share`** 全部为**零**，则链不会应用这些扣减或转移（通常在升级后直到治理启用它们之前是这样）。

---

## 主机清单

1. 在升级之前，清理您持久化的 MLNode 配置，使其仅包含受支持的模型。
2. 在可能的情况下，每个 ML 节点最好部署一个逻辑模型。当多个模型存在于同一节点上时，配置错误更容易发生。
3. 升级后，确认 `params` 在 `poc_params` 下列出了你关心的每个模型。
4. 检查每个模型的 `penalty_start_epoch`。
5. 检查 `refusal_penalty`、`no_participation_penalty` 和 `delegation_share` 是否非零。
6. 对于每个模型，决定是要运行、委托、拒绝还是什么也不做。
7. 如果你自己运行该模型，请确保你的 PoC 堆栈为该模型提交有效的 PoC v2 store commit。
8. 如果你进行委托，请使用 `poc-delegation` 验证结果。
9. 对于新模型，请关注 `bootstrap_model_preeligibility` 事件，并在捕获高度之前发送 `declare-poc-intent`（如果你计划参与）。
10. 在任何配置更改、重启或新主机上线之后，请确保持久化的 DAPI 配置中不存在不受支持的模型。
