# 多模型 PoC — 主机操作指南

多模型“计算证明”（Proof-of-Compute, PoC）于 v0.2.12 版本引入，并在 v0.2.13 版本中进一步扩展。

## v0.2.12 和 v0.2.13 中的变化

在 v0.2.12 之前，网络仅强制运行单一模型：`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。v0.2.12 引入了第二个经治理批准的模型 `moonshotai/Kimi-K2.6`，并为每个模型引入了独立的参与机制、委托机制以及惩罚计时机制。v0.2.13 则重新校准了模型系数，并将 `MiniMaxAI/MiniMax-M2.7` 作为第三个经治理批准的模型加入网络。

截至 2026 年 6 月 3 日（主网 epoch `285`），主网上的 `poc_params.models` 包含以下内容：

| `model_id` | 当前主网状态 | `weight_scale_factor` | `penalty_start_epoch` |
| --- | --- | --- | --- |
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` | 活跃 |  |  |
| `moonshotai/Kimi-K2.6` |  |  |  |
| `MiniMaxAI/MiniMax-M2.7` |  |  |  |
这些值由治理机制控制，可能会发生变化。在执行任何操作前，请务必通过你所使用的链上的实时 `params` 查询来验证当前状态。

??? note "多模型 PoC 如此设计的原因"

    此设计的目标是在保持相同安全模型（BFT 假设）的前提下，使网络能够支持多个模型，而无需每个主机都运行所有模型。
    
    若无委托机制：
    
 
 
    - 降低新模型的验证门槛，会导致网络中一小部分节点积累过大的影响力；
 
 
    - 维持标准的 2/3 验证门槛，则会使新模型难以激活，因为需要绝大多数主机先部署该模型。
    
    委托机制解决了这一问题：
    
 
 
    - 不运行某模型的主机仍可将其权重贡献给该模型的验证过程；
 
 
    - 新模型可以在无需全网强制部署的情况下安全启动；
 
 
    - 网络在保持安全保证的同时具备更高的灵活性。

## 治理模型

新模型通过治理流程添加：每个新模型都应有其独立的治理流程、参数设置和激活时间表。对于每一个已批准的模型，主机可自行决定是否运行该模型、进行委托、拒绝参与或不采取任何操作。

## 范围与前提条件

**涵盖范围**：升级前的模型清理、按模型参与选择、委托与意图交易、委托查询、PoC v2 提交诊断，以及影响你决策的链上参数。

**签名说明**：本指南中所有操作均假设你从自己的**冷**主机密钥（`--from` 指向该账户）进行广播。（但也可授权使用热密钥执行委托操作。）

**开始前准备**：请确认你的二进制文件和网络环境支持以下命令：

```

./inferenced query inference --help
./inferenced tx inference --help
```

**延伸阅读（设计与费用）：** [多模型 PoC 提案 README](https://github.com/gonka-ai/gonka/blob/67e205acc46da7cafe330e605b4b22e5d38f2dc7/proposals/multi-model-poc/README.md)。

---

## 我该怎么做？（快速决策指南）

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

- 如果你不运行某个模型，**委托**是最安全的默认选择
- 一旦启用惩罚机制，**不采取任何行动**是最差的选择

## 推荐操作

如果你不运行某个特定模型：

- 如果你运行多个节点，且至少有一个节点运行该模型：将该模型的委托指向你自己的节点
- 如果你完全不运行该模型：委托给你信任的主机
- 如果你不信任任何可委托对象：对该模型使用 `refuse-poc-delegation`

一旦某个模型达到 `penalty_start_epoch`，若未通过直接参与或有效委托的方式参与该模型，可能会根据治理配置的参数降低你的共识权重。

## 你的选项（按模型区分）

> 要获取所有治理批准的 `model_id` 值列表，请运行：
>
 


> ./inferenced query inference params --node "$NODE" -o json
>
 


> 查看 `poc_params` → `models` 中的内容。

| 你想要的操作 | 命令 | 主机选择该选项的原因 |
| --- | --- | --- |
| 自行运行该模型的 PoC | *(无需额外的链上“加入”操作；你的节点栈会提交 PoC v2 存储提交) * |  |
| 信任另一台主机对该模型的验证投票 |  |  |
| 明确选择不为该模型进行委托 |  |  |
| 不做额外操作 |  |  |
| 在新模型完全上线前表明计划 |  |  |
### 策略对比

| 策略 | 结果 |
| --- | --- |
| 运行模型 | 完全参与，无惩罚 |
| 委托 | 轻微权重损失（约5%），避免惩罚 |
| 拒绝 | 约10%权重损失 |
| 无操作 | 若未加入法定人数，最多损失约15%权重 |
**每模型仅保留一个链上选择**：对于每个 `model_id` 和你的地址，链上最多保存 **一个** 委托 / 拒绝 / 意图声明。新的交易会**覆盖**之前的设置。如果你在该周期内为该模型提交了有效的存储提交（store commit），则该行为将**优先于**上述三种链上设置。

没有适用于所有情况的通用推荐。运行、委托、拒绝或不作为，是每个主机针对每个模型做出的策略决策。

!!! note "当前主网参数（撰写时）"

 
 
    - `refusal_penalty`：约你权重的10%
 
 
    - `no_participation_penalty`：约15%（若法定人数在你缺席时形成）
 
 
    - `delegation_share`：约你权重的5%将转移给受托人
    
    这些值由治理控制，可能变更。请始终使用 `params` 验证最新参数。

!!! note "宽限期"

    升级后，对新引入模型的惩罚不会立即生效。
    
    主机通常有短暂窗口期（约3天）来：
    
 
 
    - 部署模型
 
 
    - 配置委托
 
 
    - 或明确拒绝
    
    请查看 `penalty_start_epoch` 在 `params` 中的具体时间安排。

---

## 什么是 PoC 委托

每个**已批准的模型**都有其独立的 PoC。你在**上一个周期**的**共识权重**仍会影响你**未自行运行**的模型的 PoC 验证投票权。

**委托**的含义是：针对某个 `model_id`，你向链声明你的权重在该模型的**验证投票**中应如何使用——你可以支持他人的投票、书面选择退出、仅对新模型表达计划意向，或保持默认（不发送额外交易）。

如果你在该周期内通过常规 PoC 节点栈为该模型提交了有效的 **PoC v2 存储提交（store commit）**，你将被视为**自行运行该模型的 PoC**。此行为将**覆盖**你之前通过委托 / 拒绝 / 意图设置的任何参与方式。

---

## 当你的链上选择被冻结时

链会在**两个不同时间点**读取你的设置——它们回答不同的问题，适用于不同的场景。

**
周期 PoC 验证开始时**  
链记录你**委托给谁**以及**是否拒绝**。这适用于**已正常运行的模型**。此时不会读取“意图”设置。

**
下一轮 PoC 开始前 `deploy_window` 个区块高度** — 即高度 `next_poc_start − deploy_window`  
链记录针对**尚未进入常规集合的模型**的**委托和意图**，用于**启动 / 预资格**信号。如果 `deploy_window` 为零或负数，则不会执行第二次捕获。

你是否**实际运行了 PoC** 并不由这些链上记录决定：链会依据你在该周期内为该模型提交的 **PoC v2 存储提交**来判断。

### 你的委托是否真正生效？

`set-poc-delegation` 可随时发送，但只有在**验证开始时**同时满足以下条件，才会对受托人产生帮助：

- 受托人**在该周期内为该 `model_id` 运行了 PoC**（以常规方式提交了对应工作），且  
- 受托人在上一周期拥有**非零的共识权重**。

否则，你的委托在该周期对该模型无效（实际结果等同于未委托），一旦启用惩罚机制，相关规则仍可能适用。

当委托**生效时**，你的**全部权重**将计入该主机在验证该模型 PoC 时的影响力。此外，在权重最终确定时，**`delegation_share`** 在 `params` 中可能将你**原始**共识权重的一部分转移给对方——这与拒绝 / 未参与的扣减比例是不同的机制；请查阅 `params` 获取确切数值。

### 启动预资格事件

如果你计划为一个**新模型**配置硬件，请关注链上类型为 **`bootstrap_model_preeligibility`** 的事件。典型属性包括：`model_id`、`pre_eligible`、`meets_weight_threshold`、`meets_v_min`、`meets_reachability`、`intent_host_count`、`intent_weight`、`reachable_voting_power`、`total_network_weight`、`snapshot_height`。

利用这些事件来决定：

- **何时**声明意图
- **何时**必须使提交（commits）生效

如果 `pre_eligible = false` 且你计划服务该模型：检查 `meets_weight_threshold` 和 `meets_v_min`。若两者均为 false，则你可能质押不足。
若仅 `meets_reachability` 为 false，请在下一次捕获高度前确认你的节点可被访问。

---

## 可复制粘贴的配置命令

### 会话变量（在当前 shell 中设置一次）

在使用以下命令前，在同一 shell 中运行一次此命令块。请根据实际情况调整值后再执行。**以下所有示例**均使用 `NODE`、`CHAIN_ID`、`KEY`（你在密钥环中的**冷钱包名称**）以及可选的 `KEYRING_BACKEND`。

```bash
export NODE="<PUBLIC_URL>"
export CHAIN_ID="gonka-mainnet"
export KEY="gonka-account-key"
# cold key; see note at top on warm-key grants
export KEYRING_BACKEND="file"

export MY_ADDR="$(./inferenced keys show "$KEY" -a --keyring-backend "$KEYRING_BACKEND" 2>/dev/null || true)"
# If keys show fails, set your address explicitly:
MY_ADDR="gonka1..."
```

以下每个 `tx inference …` 示例都重复了相同的 `--from` / `--node` / `--chain-id` / `--keyring-backend` / gas 参数，因此你可以直接复制**一个**代码块，而无需从其他位置合并行。如果你的密钥环已经是默认设置，则可以省略 `--keyring-backend`。

**可选 — 减少重复参数：** 在本机的 CLI 客户端配置中设置默认的 RPC 节点和链 ID（Cosmos 风格的 `client.toml`；使用 `./inferenced config --help`）。之后你可以在下方的交易命令中省略 `--node` 和 `--chain-id`。

### 参数与周期（epoch）

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

响应会分别列出 **委托（delegations）**、**拒绝（refusals）** 和 **意图（intents）**；对于某个特定模型，你最多只会拥有其中一种。

---

### 交易

**委托（Delegate）**（发送交易时，被委托方无需已在运行该模型的 PoC）：

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

**明确的授权：**

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

惩罚机制以及委托份额会在**下一个纪元**的活跃节点集合构建时生效，且是在 PoC（Proof of Contribution）结果**已知之后**才应用到**共识权重**上。以下所有内容均来自 `./inferenced query inference params`（JSON 字段名称可能因版本略有不同，请在输出中搜索这些名称）。

| 在 `params` 中的位置 | 字段 | 对主机的意义 |
| --- | --- | --- |
| 每个模型在 `poc_params` → `models` 中 | `penalty_start_epoch` |  |
| 每个模型在 `poc_params` → `models` 中 |  |  |
| `delegation_params` |  |  |
| `delegation_params` |  |  |
| `delegation_params` |  |  |
| `delegation_params` |  |  |
**高级资格参数**（大多数主机可跳过）：`w_threshold`、`v_min`、`cap_factor`、`initial_model_id`、`max_model_voting_power_percentage` —— 包括资格门槛、上限以及每模型投票集中度限制。最后一个为零通常表示“无上限”。

如果 **`refusal_penalty`**、**`no_participation_penalty`** 和 **`delegation_share`** 均为 **零**，则链不会执行这些扣减或转移操作（在升级后初期常见，直到治理机制启用它们为止）。

---

## 主机检查清单

1. 升级前清理你持久化的 MLNode 配置，确保其中仅包含受支持的模型。
2. 尽量做到每个 ML 节点只运行一个逻辑模型。若同一节点上存在多个模型，更容易发生配置错误。
3. 升级后，确认 `params` 在 `poc_params` 下列出了你关心的每一个模型。
4. 检查每个模型的 `penalty_start_epoch`。
5. 检查 `refusal_penalty`、`no_participation_penalty` 和 `delegation_share` 是否为非零值。
6. 对每个模型，决定你是要自行运行、委托、拒绝，还是不采取任何行动。
7. 若你自行运行模型，请确保你的 PoC 模块为该模型提交了有效的 PoC v2 存储提交（store commits）。
8. 若你选择委托，请使用 `poc-delegation` 验证结果。
9. 对于新模型，请关注 `bootstrap_model_preeligibility` 事件，并在捕获高度前发送 `declare-poc-intent`（如果你计划参与）。
1
1
10. 在任何配置更改、重启或新主机接入后，确保持久化的 DAPI 配置中不包含不受支持的模型。
