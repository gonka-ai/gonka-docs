# 多模型 PoC — 主机操作指南

多模型计算证明（PoC）功能于 v0.2.12 版本引入，并在 v0.2.13 版本中进一步扩展。

## v0.2.12 和 v0.2.13 中的变化

在 v0.2.12 之前，网络仅运行一个强制模型：`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。v0.2.12 引入了第二个由治理批准的模型 `moonshotai/Kimi-K2.6`，并实现了按模型的参与、委托和惩罚计时机制。v0.2.13 则重新校准了模型系数，并新增 `MiniMaxAI/MiniMax-M2.7` 作为第三个由治理批准的模型。

截至纪元 `308`，`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 已由治理（提案 78）退役，`MiniMaxAI/MiniMax-M2.7` 成为基础模型与活跃的 PoC 模型。主网上的 `poc_params.models` 包含以下内容：

| `model_id` | 当前主网状态 | `weight_scale_factor` | `penalty_start_epoch` |
|---|---|---:|---:|
| `MiniMaxAI/MiniMax-M2.7` | 活跃 | `0.3024` | `278` |
| `moonshotai/Kimi-K2.6` | 重新 bootstrap 中（通过后续投票恢复） | `0.90` | `310` |
| `zai-org/GLM-5.2-FP8` | 可选（无未参与惩罚） | `2.47` | `500` |

这些值由治理机制控制，可能会发生变化。在执行任何操作前，请务必通过你所使用的链上的实时 `params` 查询来验证这些参数。

??? note "为何多模型 PoC 采用此设计"

    此设计的目标是在保留相同安全模型（BFT 假设）的前提下，允许网络支持多个模型，而无需每个主机都运行所有模型。
    
    若无委托机制：
    
    - 降低新模型的验证门槛将导致网络中一小部分节点积累过大的影响力。
    - 保持标准的 2/3 验证门槛则会使新模型难以激活，因为需要绝大多数主机预先部署该模型。
    
    委托机制解决了这一问题：
    
    - 未运行某模型的主机仍可将其权重贡献给该模型的验证过程
    - 新模型可以在不强制全网部署的情况下安全启动
    - 网络在保持安全性的同时具备更高的灵活性

## 治理模型

新模型通过治理流程添加：每个新模型都应有其独立的治理流程、参数设置和激活时间表。对于每个已批准的模型，主机可自行决定是否运行、委托、拒绝或不采取任何行动。

## 范围与前提条件

**适用范围**：升级前的模型清理、按模型参与选择、委托与意图交易、委托查询、PoC v2 提交诊断，以及影响你决策的链上参数。

**签名说明**：本指南中所有操作均假设你从你的**冷**主机密钥发起广播（即 `--from` 指向该账户）。（但也可授权使用热密钥执行委托操作。）

**开始前准备**：请确认你的二进制文件和网络环境支持以下命令：```
./inferenced query inference --help
./inferenced tx inference --help
```**延伸阅读（设计与费用）：** [多模型 PoC 提案 README](https://github.com/gonka-ai/gonka/blob/67e205acc46da7cafe330e605b4b22e5d38f2dc7/proposals/multi-model-poc/README.md)。

---

## 我该怎么做？（快速决策指南）```
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
```在大多数情况下：

- 如果你不运行某个模型，**委托**是最安全的默认选择
- 一旦启用惩罚机制，**什么都不做**是最差的选项

## 推荐操作

如果你不运行某个特定模型：

- 如果你运行多个节点，且至少有一个节点运行该模型：将该模型的验证委托给自己的节点
- 如果你完全不运行该模型：将委托给一个你信任的主机
- 如果你不信任任何可委托对象：对该模型使用 `refuse-poc-delegation`
  
当某个模型达到 `penalty_start_epoch` 后，如果你未通过直接参与或有效委托的方式参与该模型，你的共识权重可能会降低，具体取决于治理配置的参数。

## 你的选项（按模型划分）

> 要获取所有经治理批准的 `model_id` 值列表，请运行：
> ```
> ./inferenced query inference params --node "$NODE" -o json
> ```
> 查看 `poc_params` → `models` 中的内容。

| 你的目标 | 命令 | 主机选择该选项的原因 |
|---|---|---|
| 自行运行该模型的 PoC | *(无需单独的链上“加入”操作；你的 PoC 节点会提交 PoC v2 存储提交)* | 你将在该模型的组内参与本 epoch 的共识。 |
| 信任另一个主机对该模型的验证投票 | `set-poc-delegation` | 只要验证时满足规则，你的权重将计入该委托方对该模型 PoC 验证的影响力（参见 [你的委托是否真正生效？](#你的委托是否真正生效)） |
| 明确拒绝为该模型进行委托 | `refuse-poc-delegation` | 明确表示“不委托”；当该模型启用惩罚后，若治理配置了相关规则，可能会应用拒绝型扣减（参见 [你的链上选择何时被冻结](#当你的链上选择被冻结)） |
| 不采取额外操作 | *(无需交易)* | 默认行为；一旦启用惩罚，可能面临最高处罚 |
| 在新模型完全上线前表明计划 | `declare-poc-intent` | 仅用于**启动阶段的报告**；它**不能替代运行 PoC**。你仍需提交有效的存储提交记录，才能被视为自行服务该模型。参见 [启动预资格事件](#启动预资格事件) |

### 策略对比

| 策略 | 结果 |
|--------|--------|
| 运行模型 | 完全参与，无惩罚 |
| 委托 | 轻微权重损失（约 5%），避免惩罚 |
| 拒绝委托 | 约 10% 权重损失 |
| 什么都不做 | 若在未参与的情况下形成法定人数，最多损失约 15% 权重 |

**每个模型仅保存一个选择**：对于每个 `model_id` 和你的地址，链上最多保存 delegate / refuse / intent 中的一项。发送新的这三类交易中的任意一种，将**覆盖**之前的设置。如果你在该 epoch 内为该模型提交了有效的 **PoC v2 存储提交**，则链上规则会优先采用“自行运行”的状态，覆盖上述三种设置。

不存在适用于所有情况的通用默认建议。运行、委托、拒绝或什么都不做，是每个主机针对每个模型的策略决策。

!!! note "当前主网参数（撰写时）"

    - `refusal_penalty`：约你权重的 10%
    - `no_participation_penalty`：约 15%（若在你未参与的情况下形成法定人数）
    - `delegation_share`：约你权重的 5% 会转移给被委托方
    
    这些值由治理控制，可能变更。请始终通过 `params` 命令核实。

!!! note "宽限期"

    升级后，对新引入模型的惩罚不会立即生效。
    
    主机通常有短暂窗口期（约 3 天）来：
    
    - 部署模型
    - 配置委托
    - 或明确拒绝
    
    请通过 `params` 中的 `penalty_start_epoch` 查看确切时间。

---

## 什么是 PoC 委托

每个**已批准的模型**都有其独立的 PoC。你在**上一个 epoch** 的**共识权重**，仍会影响你**未自行运行**的模型的 PoC 验证投票权。

**委托**的含义是：针对某个 `model_id`，你向链声明你的权重在该模型的**验证投票**中应如何行为——你可以支持他人的投票、书面选择退出、仅对新模型表达计划，或保持默认（不发送额外交易）。

如果你在该 epoch 内为该模型提交了有效的 **PoC v2 存储提交**（通过正常的 PoC 节点堆栈），你将被视为**自行运行该模型的 PoC**。这将**覆盖**你之前通过 delegate / refuse / intent 设置的任何参与方式。

---

## 当你的链上选择被冻结

链会在**两个不同时间点**读取你的设置——它们回答不同问题，并应用于不同场景。

**1. 当前 epoch 的 PoC 验证开始时**  
链记录你**委托给了谁**以及**是否拒绝委托**。这适用于**已正常运行的模型**。此处不读取 intent 信息。

**2. 下一轮 PoC 开始前的 `deploy_window` 个区块高度** — 即 `next_poc_start − deploy_window`  
链记录针对**尚未进入正常集合的模型**的**委托和 intent**，用于**启动 / 预资格**信号。如果 `deploy_window` 为零或负数，则不会执行此次记录。

你是否**实际运行了 PoC** 并不从这些存储记录中读取：链会检查你在该 epoch 内是否为该模型提交了有效的 **PoC v2 存储提交**。

### 你的委托是否真正生效？

`set-poc-delegation` 可随时发送，但只有在**验证开始时**满足以下所有条件，委托才**真正生效**：

- 被委托方在该 epoch 为该 `model_id` **运行了 PoC**（以常规方式提交了对应工作），且  
- 被委托方在上一个 epoch 拥有**非零的共识权重**。

否则，你的委托在该 epoch 对该模型无效（实际结果等同于未委托），一旦启用惩罚规则，仍可能被处罚。

当委托**生效时**，你的**全部权重**将计入该主机在验证该模型 PoC 时的影响力。此外，在最终确定权重时，`params` 中的 **`delegation_share`** 可能会将你**原始**共识权重的一部分转移给被委托方——这与拒绝或未参与的扣减比例是不同的机制；请查阅 `params` 获取确切数值。

### 启动预资格事件

如果你计划为一个**新模型**配置硬件，请关注链上类型为 **`bootstrap_model_preeligibility`** 的事件。典型属性包括：`model_id`、`pre_eligible`、`meets_weight_threshold`、`meets_v_min`、`meets_reachability`、`intent_host_count`、`intent_weight`、`reachable_voting_power`、`total_network_weight`、`snapshot_height`。

利用这些事件来决定：

- **何时**声明 intent
- **何时**必须已部署有效的提交

- 如果 `pre_eligible = false` 且你计划服务该模型：检查 `meets_weight_threshold` 和 `meets_v_min`。若两者均为 false，可能表示你的质押不足。
- 若仅 `meets_reachability` 为 false，请在下次捕获高度前确认你的节点可达。

---

## 可直接复制粘贴的设置命令

### 会话变量（在此 shell 中设置一次）

在使用以下命令前，在同一 shell 中运行一次此段。请根据实际情况调整值，然后执行整个代码块。**以下所有示例**均使用 `NODE`、`CHAIN_ID`、`KEY`（你在密钥环中的**冷钱包名称**），以及可选的 `KEYRING_BACKEND`。```bash
export NODE="<PUBLIC_URL>"
export CHAIN_ID="gonka-mainnet"
export KEY="gonka-account-key"   # cold key; see note at top on warm-key grants
export KEYRING_BACKEND="file"

export MY_ADDR="$(./inferenced keys show "$KEY" -a --keyring-backend "$KEYRING_BACKEND" 2>/dev/null || true)"
# If keys show fails, set your address explicitly:
# MY_ADDR="gonka1..."
```以下每个 `tx inference …` 示例都重复使用相同的 `--from` / `--node` / `--chain-id` / `--keyring-backend` / gas 参数，因此你可以直接复制 **一个** 代码块，而无需从其他位置合并行。如果你的密钥环已经是默认设置，则可以省略 `--keyring-backend` 参数。

**可选 — 减少重复参数：** 在本机的 CLI 客户端配置中设置默认的 RPC 节点和链 ID（采用 Cosmos 风格的 `client.toml`；使用 `./inferenced config --help` 查看帮助）。设置后，你可以在下面的交易命令中省略 `--node` 和 `--chain-id` 参数。


### 参数和周期```bash
./inferenced query inference params --node "$NODE" -o json
```

```bash
./inferenced query inference get-current-epoch --node "$NODE" -o json
```### 查询委派状态

**所有模型：**```bash
./inferenced query inference poc-delegation "$MY_ADDR" --node "$NODE" -o json
```**一个模型**（第二个参数可选）：```bash
./inferenced query inference poc-delegation "$MY_ADDR" "$MODEL" --node "$NODE" -o json
```响应会分别列出 **委托**（delegations）、**拒绝**（refusals）和 **意图**（intents）；对于特定模型，你最多只会拥有三者中的一个。

---

### 交易

**委托**（发送交易时，被委托方无需已在运行该模型的 PoC）：```bash
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
```**明确的授权：**```bash
MODEL="your-model-id"

./inferenced tx inference set-poc-delegation "$MODEL" "" \
  --from "$KEY" \
  --node "$NODE" \
  --chain-id "$CHAIN_ID" \
  --keyring-backend "$KEYRING_BACKEND" \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```**垃圾：**```bash
MODEL="your-model-id"

./inferenced tx inference refuse-poc-delegation "$MODEL" \
  --from "$KEY" \
  --node "$NODE" \
  --chain-id "$CHAIN_ID" \
  --keyring-backend "$KEYRING_BACKEND" \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```**引导意图：**```bash
MODEL="your-model-id"

./inferenced tx inference declare-poc-intent "$MODEL" \
  --from "$KEY" \
  --node "$NODE" \
  --chain-id "$CHAIN_ID" \
  --keyring-backend "$KEYRING_BACKEND" \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```---

## 惩罚与参数

惩罚机制以及委托份额在 **PoC 结果已知之后**、构建下一纪元的活跃节点集合时，应用于**共识权重**。以下所有内容均来自 `./inferenced query inference params` 命令的输出（不同版本的 JSON 字段略有差异，请在输出中搜索这些字段名）。

| 在 `params` 中的位置 | 字段 | 对节点运营者的含义 |
|---|---|---|
| `poc_params` → `models` 中的每个模型 | `penalty_start_epoch` | 在此纪元索引之前，该模型的惩罚规则**不生效**。需按 `model_id` 单独跟踪。 |
| `poc_params` → `models` 中的每个模型 | `weight_scale_factor` | 将该模型的 PoC 权重按比例转换为共识权重。 |
| `delegation_params` | `refusal_penalty` | 在 `penalty_start_epoch` 之后，若你使用了 `refuse-poc-delegation`，将被扣除原始共识权重的该比例部分。 |
| `delegation_params` | `no_participation_penalty` | 若你未拒绝、没有有效委托、也未自行服务模型——在惩罚生效后，将被扣除该比例的原始共识权重。 |
| `delegation_params` | `delegation_share` | 当委托有效时，委托人原始权重的该比例部分将重新分配给被委托人。 |
| `delegation_params` | `deploy_window` | 下一轮 PoC 开始前的区块数，用于确定引导快照高度（`next_poc_start − deploy_window`）。 |

**高级资格参数**（大多数节点运营者可忽略）：`w_threshold`、`v_min`、`cap_factor`、`initial_model_id`、`max_model_voting_power_percentage` —— 这些是资格门槛、上限及每模型投票集中度限制。最后一项为零通常表示“无上限”。

如果 **`refusal_penalty`**、**`no_participation_penalty`** 和 **`delegation_share`** 均为 **零**，则链不会执行这些扣减或转移操作（升级后初期常见情况，直到治理启用这些功能）。

---

## 节点运营检查清单

1. 升级前，清理持久化的 MLNode 配置，确保其中仅包含受支持的模型。
2. 尽可能每个 ML 节点只运行一个逻辑模型。若同一节点上配置多个模型，更容易出错。
3. 升级后，确认 `params` 中的 `poc_params` 列出了你关心的每一个模型。
4. 检查每个模型的 `penalty_start_epoch`。
5. 检查 `refusal_penalty`、`no_participation_penalty` 和 `delegation_share` 是否非零。
6. 针对每个模型，决定你是要自行运行、委托、拒绝委托，还是不参与。
7. 若自行运行模型，请确保你的 PoC 组件为该模型提交了有效的 PoC v2 存储提交（store commits）。
8. 若进行委托，请使用 `poc-delegation` 命令验证结果。
9. 对于新模型，请关注 `bootstrap_model_preeligibility` 事件，若计划参与，需在快照捕获高度前发送 `declare-poc-intent`。
10. 每次配置变更、重启或新节点接入后，确保持久化的 DAPI 配置中不包含不受支持的模型。