# 提案投票
## 谁可以投票和不可以投票

投票需要在提案的`voting_end_height`时持有已绑定的`tokens > 0`。资格由三个独立的检查决定：

**绑定状态（Cosmos SDK）**

只有持有`status = BOND_STATUS_BONDED`和`tokens > 0`的验证者才具有投票权。余额为零代币的已绑定条目处于休眠状态，不贡献任何投票权。

**监禁状态**

被监禁的验证者（`jailed = true`）会自动解除绑定，并从活跃验证者集合中移除，失去所有投票权，直到他们通过 `MsgUnjail` 手动解除监禁。因离线或双重签名而被罚没将触发监禁。

在Gonka分叉中，这一点通过`SetComputeValidators`得到加强：在纪元结束时，未出现在计算结果中或被明确标记为删除的验证者将被 `tokens = 0`。由于Gonka没有传统的解除绑定周期，被监禁的验证者会立即被删除，而不是进入解除绑定队列。

**PoC和CPoC参与**

投票权最终来源于 `participant.weight`，它会根据每个纪元的PoC和CPoC结果重新计算：

- **PoC失败**：参与者被标记为 `INACTIVE`，从下一个纪元的计算结果中移除，被赋予 `tokens = 0`，且无法投票。
- **CPoC失败**：即确认型PoC，节点互相交叉验证彼此的PoC提交。结果相同：从活跃集合中移除，`tokens = 0`，无投票权重。
- **活跃参与者**：代币权重根据新权重重新计算，投票权重等于权重，或由守护者（Guardians）提升。

**委托人**

标准的Cosmos SDK委托人，即通过 `MsgDelegate` 进行质押的任何人，都可以独立投票，并且他们的投票会覆盖其验证者在所委托份额上的投票。实际上，Gonka的几乎所有投票权都集中在与PoC权重绑定的验证者自身的自委托上，因此此路径很少被使用。

---

## 验证并投票

大多数参与者只需验证提案并进行投票。完成以下四项操作：

### 确认正确的提案ID（并验证它是否是你被告知的那个）

```bash
# List all proposals (IDs + basic info)
inferenced query gov proposals -o json --node <NODE_URL>/chain-rpc/
# Inspect a specific proposal in detail
inferenced query gov proposal <VOTE_PROPOSAL_ID> -o json --node <NODE_URL>/chain-rpc/
```

确认 **id**、**title**、**summary** 以及（如果存在）**metadata** 与分享给您的内容一致。


???+ note "了解投票选项和简要流程"
    - **选项:** `yes`, `no`, `no_with_veto`, `abstain`.
    - **流程:** 提案开启（缴纳保证金后）-> 投票期开始 -> 结果由法定人数/通过阈值/否决参数决定 -> 若通过，消息将通过 gov 模块执行。
    - 您可以在投票期结束前随时更改投票，以最后一次投票为准。

### 检查当前治理参数

治理参数可在链上配置。请勿依赖从旧文档或公告中复制的固定数值；在建议参与者如何投票前，请查询实时链上数据。

```bash
inferenced query gov params -o json --node <NODE_URL>/chain-rpc/ \
  | jq '.params | {
      voting_period,
      expedited_voting_period,
      quorum,
      threshold,
      expedited_threshold,
      veto_threshold,
      burn_vote_veto,
      min_deposit,
      expedited_min_deposit
    }'
```

在撰写本文时，主网参数为：

```text
min_deposit:              500000000000ngonka   # 500 GNK
expedited_min_deposit:    1000000000000ngonka  # 1000 GNK
max_deposit_period:       86400s    # 24 hours
voting_period:            172800s   # 48 hours
expedited_voting_period:  43200s    # 12 hours
quorum:                   0.25
threshold:                0.500000000000000000
expedited_threshold:      0.667000000000000000
veto_threshold:           0.334000000000000000
burn_vote_veto:           true
```

### 结果的计算方式

计票使用基于PoC的加权投票权。提案只有在达到法定人数后才能通过：

```text
total_votes / total_bonded_voting_power >= quorum
```

位置：

```text
total_votes = Yes + No + NoWithVeto + Abstain
non_abstain_votes = Yes + No + NoWithVeto
```

根据当前主网参数，法定人数为：

```text
total_votes / total_bonded_voting_power >= 0.25
```

达到法定人数后，否决权在通过门槛之前进行检查：

```text
NoWithVeto / (Yes + No + NoWithVeto + Abstain) > veto_threshold
```

使用当前主网参数：

```text
NoWithVeto / total_votes > 0.334
```

如果此条件为真，提案将因否决而失败。由于 `burn_vote_veto` 当前为 `true`，否决拒绝将销毁提案押金。

最后，常规通过阈值为：

```text
Yes / (Yes + No + NoWithVeto) > threshold
```

使用当前主网参数：

```text
Yes / non_abstain_votes > 0.5
```

对于加急提案：

```text
Yes / non_abstain_votes > 0.667
```

### `abstain` 如何影响结果

`abstain` 是中立的，但它仍会影响计票：

- 它计入法定人数。
- 它被排除在“赞成”阈值的分母之外。
- 它被包含在否决分母中，因此会降低否决比例。

重要提示：`abstain` 不会增加 `no_with_veto`。否决分子仅包含 `NoWithVeto`。

示例：

```text
Yes = 40
No = 0
NoWithVeto = 20
Abstain = 40

veto ratio = 20 / 100 = 20%       # veto does not trigger
pass ratio = 40 / 60 = 66.7%      # passes regular threshold
```

### 投出（或更改）你的投票

```bash
# options: yes | no | no_with_veto | abstain
inferenced tx gov vote <VOTE_PROPOSAL_ID> yes \
  --from <COLD_KEY_NAME> \
  --keyring-backend file \
  --unordered --timeout-duration=60s \
  --gas=2000000 --gas-adjustment=5.0 \
  --node <NODE_URL>/chain-rpc/ \
  --yes
```

```bash
# See tally
inferenced query gov tally <VOTE_PROPOSAL_ID> -o json --node <NODE_URL>/chain-rpc/
# Optional: list votes
inferenced query gov votes <VOTE_PROPOSAL_ID> -o json --node <NODE_URL>/chain-rpc/
```

---

???+ note "备注"
    - **谁可以创建提案：** 任何拥有有效治理（冷）密钥并支付所需费用/保证金的人。
    - **轨道状态：** 使用 `query gov proposal`、`query gov tally` 和 `query gov proposals`。另请参阅 [跟踪提案状态](/governance/transactions-and-governance/#track-proposal-status)。
    - **交易标志：** 在治理交易中，保留 `--keyring-backend file --unordered --timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 --node <NODE_URL>/chain-rpc/`。
