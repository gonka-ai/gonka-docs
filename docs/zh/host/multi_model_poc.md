# 多模型 PoC — 主机操作指南

多模型 Proof-of-Compute（PoC）于 v0.2.12 版本引入，并在 v0.2.13 中进一步扩展。

## v0.2.12 和 v0.2.13 中的变化

在 v0.2.12 之前，网络仅运行一个强制模型：`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。v0.2.12 引入了第二个经治理批准的模型 `moonshotai/Kimi-K2.6`，并新增了按模型划分的参与、委托和惩罚计时机制。v0.2.13 进一步调整了模型系数，并将 `MiniMaxAI/MiniMax-M2.7` 添加为第三个经治理批准的模型。

截至 2026 年 6 月 3 日（主网纪元 `285`），主网上的 `poc_params.models` 包含以下内容：

| `model_id` | 当前主网状态 | `weight_scale_factor` | `penalty_start_epoch` |
|---|---|---:
|---:
|
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` | 活跃 | `0.3593` | `0` |
| `moonshotai/Kimi-K2.6` | 活跃 | `0.78` | `251` |
| `MiniMaxAI/MiniMax-M2.7` | 活跃 | `0.3024` | `278` |

这些值由治理机制控制，可能发生变化。在执行任何操作前，请务必通过链上实时的 `params` 查询来验证当前参数。

??? note "为何多模型 PoC 采用此设计"

    此设计的目标是在保持相同安全模型（BFT 假设）的前提下，允许网络支持多个模型，而无需每个主机都运行所有模型。
    
    若无委托机制：
    
 
   - 降低新模型的验证门槛，会导致网络中一小部分节点积累不成比例的影响力。
 
   - 维持标准的 2/3 验证门槛，则新模型难以激活，因为必须先由绝大多数主机部署该模型。
    
    委托机制解决了这一问题：
    
 
   - 不运行某模型的主机仍可将其权重贡献给该模型的验证过程
 
   - 新模型可在无需全网强制部署的情况下安全启动
 
   - 网络在保持安全性的同时具备更高灵活性

## 治理模型

新模型通过治理流程添加：每个新模型都应有独立的治理流程、参数设置和激活时间表。对于每个已批准的模型，主机可自行决定是否运行、委托、拒绝或不采取任何操作。

## 范围与前提条件

**适用范围**：升级前的模型清理、按模型参与选择、委托与意图交易、委托查询、PoC v2 提交诊断，以及影响您决策的链上参数。

**签名说明**：本指南中所有操作均假设您使用自己的 **冷** 主机密钥进行广播（即 `--from` 指向该账户）。*(但也可授权使用热密钥执行委托操作。)***开始前准备**：请确认您的二进制文件和网络环境支持以下命令：

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
- 一旦启用惩罚机制，**不采取任何操作**是最差的选择

## 推荐操作

如果你不运行某个特定模型：

- 如果你运营多个节点，且至少有一个节点运行该模型：**将该模型的 PoC 委托给自己运行的节点**
- 如果你完全不运行该模型：**委托给你信任的主机**
- 如果你不信任任何可委托的节点：对该模型使用 `refuse-poc-delegation`

当某个模型达到 `penalty_start_epoch` 后，若你未通过直接参与或有效委托的方式参与该模型，你的共识权重可能会下降，具体取决于治理配置的参数。

## 你的选项（按模型划分）

> 要获取所有经治理批准的 `model_id` 值列表，请运行：
>
 ```
> ./inferenced query inference params --node "$NODE" -o json
>
 ```
> 查看输出中的 `poc_params` → `models`。

| 你的目标 | 命令 | 主机选择该方式的原因 |
|---|---|---|
| 自行运行该模型的 PoC | *(无需额外的链上“加入”操作；你的 PoC 节点会自动提交 PoC v2 存储提交)
* | 你将在该模型的组内参与整个 epoch 的验证。 |
| 信任其他主机对该模型的验证投票 | `set-poc-delegation` | 你的权重可计入该委托方对该模型 PoC 检查的影响力中（前提是验证时满足规则）（参见 [你的委托是否真正生效？](#你的委托是否真正生效)） |
| 明确拒绝为该模型进行委托 | `refuse-poc-delegation` | 明确表示“不委托”；当该模型启用惩罚后，若治理已配置，可能会应用拒绝型扣减（参见 [当你链上选择被冻结时](#当你链上选择被冻结时)） |
| 不做额外操作 | *(无需交易)
* | 默认行为；一旦启用惩罚，可能面临最高处罚 |
| 在新模型完全上线前表达参与意向 | `declare-poc-intent` | **仅用于引导阶段的报告**；它**不能替代实际运行 PoC**。你仍需提交有效的存储提交（store commit）才能被视为自行服务该模型。参见 [引导阶段预资格事件](#引导阶段预资格事件) |

### 策略对比

| 策略 | 结果 |
|--------|--------|
| 运行模型 | 完全参与，无惩罚 |
| 委托 | 小幅权重损失（约 5%），避免惩罚 |
| 拒绝委托 | 约 10% 权重损失 |
| 无操作 | 若在未参与的情况下形成法定人数，最多损失约 15% 权重 |

**每模型仅保留一个链上选择**：对于每个 `model_id` 和你的地址，链上最多保留一个记录（委托 / 拒绝 / 意向）。新的交易会**覆盖**之前的记录。  
如果你在该 epoch 内为该模型提交了有效的 **PoC v2 存储提交**，则无论之前设置的委托、拒绝或意向如何，系统都会认定你**自行运行了该模型的 PoC**。

没有适用于所有情况的通用推荐策略。运行、委托、拒绝或不作为，需根据每个主机和每个模型的具体情况做出决策。

!!! note "当前主网参数（撰写时）"

 
   - `refusal_penalty`：约损失你 10% 的权重
 
   - `no_participation_penalty`：约损失 15%（若在你未参与的情况下形成法定人数）
 
   - `delegation_share`：约 5% 的你的权重会转移给被委托方
    
    以上数值由治理控制，可能变更。请始终通过 `params` 命令核实最新值。

!!! note "宽限期"

    升级后，对新引入模型的惩罚不会立即生效。
    
    主机通常有短暂窗口期（约 3 天）来：
    
 
   - 部署模型
 
   - 配置委托
 
   - 或明确拒绝
    
    请通过 `params` 中的 `penalty_start_epoch` 查看确切时间。

---

## 什么是 PoC 委托

每个**已批准的模型**都有其独立的 PoC 机制。你在**上一个 epoch** 的**共识权重**，仍会影响你对**未自行运行模型**的 PoC 验证投票的影响力。

**委托**的含义是：针对某个 `model_id`，你向链声明你的权重在该模型的**验证投票**中应如何体现——你可以支持他人投票、书面退出、仅表达新模型的参与意向，或保持默认（不发送额外交易）。

如果你在该 epoch 内为该模型提交了有效的 **PoC v2 存储提交**（通过常规 PoC 节点），则系统会认定你**自行运行了该模型的 PoC**。这将**覆盖**你之前设置的委托 / 拒绝 / 意向记录。

---

## 当你链上选择被冻结时

链会在**两个不同时间点**读取你的设置，用于回答不同问题并应用于不同场景。

**
1. 当前 epoch 的 PoC 验证开始时**  
链记录你**委托给谁**以及**是否拒绝委托**。此规则适用于**已正常运行的模型**。此时**不读取意向（intent）**。

**
2. 下一轮 PoC 开始前的 `deploy_window` 个区块高度** —— 即 `next_poc_start − deploy_window`  
链记录**委托和意向**，用于对**尚未进入常规集合的新模型**进行**引导 / 预资格**信号采集。如果 `deploy_window` 为零或负数，则不会执行此次采集。

你是否**实际运行了 PoC**，不由这些链上记录决定，而是由你在该 epoch 内是否为该模型提交了有效的 **PoC v2 存储提交** 来判断。

### 你的委托是否真正生效？

`set-poc-delegation` 可随时发送，但只有在**验证开始时**同时满足以下条件，委托才会生效：

- 被委托方在该 epoch 为该 `model_id` **实际运行了 PoC**（即已正常提交对应工作），且
- 被委托方在上一个 epoch 拥有**非零的共识权重**

否则，你的委托在该 epoch 对该模型无效（实际效果等同于未委托），一旦启用惩罚机制，相关惩罚仍可能适用。

当委托**生效时**，你的**全部权重**将计入该被委托方在验证该模型 PoC 时的影响力。此外，`params` 中的 `delegation_share` 参数可能在最终确定权重时，将你的一部分**原始共识权重**转移给被委托方——这与拒绝或无参与的扣减比例是独立设置的，请通过 `params` 查看具体数值。

### 引导阶段预资格事件

如果你计划为**新模型**部署硬件，请关注链上类型为 **`bootstrap_model_preeligibility`** 的事件。典型属性包括：`model_id`、`pre_eligible`、`meets_weight_threshold`、`meets_v_min`、`meets_reachability`、`intent_host_count`、`intent_weight`、`reachable_voting_power`、`total_network_weight`、`snapshot_height`。

利用这些事件来决定：

- **何时**声明参与意向
- **何时**必须确保提交已上线

- 如果 `pre_eligible = false` 且你计划服务该模型：检查 `meets_weight_threshold` 和 `meets_v_min`。若两者均为 false，说明你的质押可能不足。
- 如果仅 `meets_reachability` 为 false，请在下一次采集高度前确认你的节点可被访问。

---

## 可复制粘贴的设置命令

### 会话变量（在当前 shell 中设置一次）

在使用以下命令前，在同一 shell 中运行一次此段。请根据实际情况调整值后再执行。**以下所有示例**均使用 `NODE`、`CHAIN_ID`、`KEY`（你在密钥环中的**冷钱包名称**），以及可选的 `KEYRING_BACKEND`。

```bash
NODE="tcp://localhost:26657"
CHAIN_ID="inference-testnet"
KEY="your-key-name"
KEYRING_BACKEND="file"
  # 可选：默认为 file，也可设为 os / test
```

```bash
export NODE="<PUBLIC_URL>"
export CHAIN_ID="gonka-mainnet"
export KEY="gonka-account-key"   # cold key; see note at top on warm-key grants
export KEYRING_BACKEND="file"

export MY_ADDR="$(./inferenced keys show "$KEY" -a --keyring-backend "$KEYRING_BACKEND" 2>/dev/null || true)"
# If keys show fails, set your address explicitly:
# MY_ADDR="gonka1..."
```

以下每个 `tx inference …` 示例都重复了相同的 `--from` / `--node` / `--chain-id` / `--keyring-backend` / gas 参数，因此你可以直接复制 **一个** 完整的代码块，而无需从其他地方合并行。如果你的密钥环已经是默认设置，则可以省略 `--keyring-backend` 参数。

**可选 — 减少重复参数：** 可以在本机的 CLI 客户端配置中设置默认的 RPC 节点和链 ID（采用 Cosmos 风格的 `client.toml`；使用 `./inferenced config --help` 查看帮助）。配置后，下方的交易命令中即可省略 `--node` 和 `--chain-id` 参数。


### 参数与纪元（epoch）

```bash
./inferenced query inference params --node "$NODE" -o json
```

```bash
./inferenced query inference get-current-epoch --node "$NODE" -o json
```

### 查询委派状态

**所有模型：**

```bash
./inferenced query inference poc-delegation "$MY_ADDR" --node "$NODE" -o json
```

**一个模型**（第二个参数可选）：

```bash
./inferenced query inference poc-delegation "$MY_ADDR" "$MODEL" --node "$NODE" -o json
```

响应会分别列出 **委托（delegations）**、**拒绝（refusals）** 和 **意图（intents）**；对于给定的模型，你最多只会拥有其中**一种**。

---

### 交易

**委托（Delegate）**（当你发送交易时，被委托方无需已经在运行该模型的 PoC）：

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

## 惩罚机制与参数

惩罚机制和委托份额在下一纪元的活跃节点集合构建时生效，**在** PoC 结果确定**之后**作用于**共识权重**。以下所有内容均来自 `./inferenced query inference params` 命令的输出（不同版本中 JSON 字段略有差异，请在输出中搜索以下字段名）。

| 在 `params` 中的位置 | 字段名 | 对节点运营者的含义 |
| --- | --- | --- |
| `poc_params` → `models` 中的每个模型 | `penalty_start_epoch` | 在此纪元索引之前，该模型的惩罚规则**不生效**。需按 `model_id` 单独跟踪。 |
| `poc_params` → `models` 中的每个模型 | `weight_scale_factor` | 将该模型的 PoC 权重按比例转换为共识权重的缩放因子。 |
| `delegation_params` | `refusal_penalty` | 在 `penalty_start_epoch` 之后，若你使用了 `refuse-poc-delegation`，将被扣除原始共识权重的该比例部分。 |
| `delegation_params` | `no_participation_penalty` | 若你未拒绝委托、无有效委托关系、也未自行提供模型服务，则在惩罚生效后扣除原始共识权重的该比例部分。 |
| `delegation_params` | `delegation_share` | 当委托关系有效时，委托方原始权重中有该比例部分会重新分配给被委托方。 |
| `delegation_params` | `deploy_window` | 下一次 PoC 开始前的区块数，用于确定引导快照高度（即 `next_poc_start − deploy_window`）。 |

**高级资格参数**（大多数节点运营者可忽略）：`w_threshold`、`v_min`、`cap_factor`、`initial_model_id`、`max_model_voting_power_percentage` —— 这些是资格门槛、权重上限以及单个模型投票权集中度限制。最后一项为零通常表示“无上限”。

如果 **`refusal_penalty`**、**`no_participation_penalty`** 和 **`delegation_share`** 均为 **零**，则链上不会执行这些扣减或转移操作（升级后初期常见情况，直到治理机制启用这些功能）。

---

## 节点运营检查清单

1. 升级前，清理持久化的 MLNode 配置，确保其中仅包含受支持的模型。
2. 尽量每个 ML 节点只运行一个逻辑模型。若单个节点上配置多个模型，更容易出现配置错误。
3. 升级后，确认 `params` 中的 `poc_params` 列出了你关心的所有模型。
4. 检查每个模型的 `penalty_start_epoch`。
5. 确认 `refusal_penalty`、`no_participation_penalty` 和 `delegation_share` 是否非零。
6. 对每个模型，决定你是自行运行、委托、拒绝委托，还是不参与。
7. 若自行运行模型，确保你的 PoC 节点堆栈为该模型提交有效的 PoC v2 存储提交（store commits）。
8. 若进行委托，使用 `poc-delegation` 命令验证委托结果。
9. 对于新模型，关注 `bootstrap_model_preeligibility` 事件，若计划参与，请在快照捕获高度前发送 `declare-poc-intent`。
1
10. 任何配置变更、重启或新节点上线后，确保持久化的 DAPI 配置中不包含不受支持的模型。
