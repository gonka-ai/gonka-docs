# 提案投票
## 谁可以投票，谁不能投票

投票需要在提案的 `tokens > 0` 拥有已绑定的 `voting_end_height`。投票资格由以下三项独立检查决定：

**绑定状态（Cosmos SDK）**

只有处于“已绑定”状态的验证者且其 `status = BOND_STATUS_BONDED` 和 `tokens > 0` 才具有投票权。持有零代币的已绑定条目处于休眠状态，不贡献任何投票权。

**监禁状态（Jail status）**

被监禁的验证者（`jailed = true`）会自动解绑，并从活跃验证者集合中移除，失去全部投票权，直到他们通过 `MsgUnjail` 手动解除监禁。因离线或双重签名而被惩罚时将触发监禁。

在 Gonka 分叉中，这一机制通过 `SetComputeValidators` 进一步加强：在每个纪元结束时，未出现在计算结果中的验证者，或被明确标记为删除的验证者，将被 `tokens = 0`。由于 Gonka 没有传统的解绑周期，被监禁的验证者会被立即删除，而不是进入解绑队列。

**PoC 与 CPoC 参与情况**

投票权最终来源于 `participant.weight`，该值会在每个纪元根据 PoC 和 CPoC 的结果重新计算：

- **PoC 失败**：参与者被标记为 `INACTIVE`，从下个纪元的计算结果中移除，获得 `tokens = 0`，且无法投票。
- **CPoC 失败**：即确认型 PoC（Confirmation PoC），其中节点互相验证彼此的 PoC 提交。结果相同：从活跃集合中移除， `tokens = 0`，无投票权重。
- **活跃参与者**：代币权重根据新的权重重新计算，投票权重等于该权重，守护者（Guardians）可获得权重加成。

**委托人（Delegators）**

标准 Cosmos SDK 委托人，即通过 `MsgDelegate` 进行质押的任何人，均可独立投票，且其投票会覆盖其所委托验证者在该部分委托份额上的投票。但在实际中，Gonka 的绝大多数投票权来自验证者基于其 PoC 权重的自质押，因此此路径极少被使用。

---

## 验证与投票

大多数参与者只需验证提案并投出投票。请完成以下四项操作：

### 确认正确的提案 ID（并核实是否为你被告知的提案）

```bash
# List all proposals (IDs
 + basic info)
inferenced query gov proposals -o json --node <NODE_URL>/chain-rpc/
# Inspect a specific proposal in detail
inferenced query gov proposal <VOTE_PROPOSAL_ID> -o json --node <NODE_URL>/chain-rpc/
```

确认 **id**、**title**、**summary** 和（如果存在）**metadata** 与提供给你的信息一致。


???
+ note "了解投票选项和简要流程"
 
 
  - **选项：** `yes`, `no`, `no_with_veto`, `abstain`。
 
 
  - **流程：** 提案在满足最低存款要求后开启 -> 进入投票期 -> 根据法定人数/通过阈值/否决等参数决定结果 -> 若提案通过，将由治理模块执行相关消息。
 
 
  - 在投票期结束前，你可以随时更改投票；以最后一次投票为准。

### 投票（或更改投票）

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

## 投票

同样，这需要从你个人的机器上，使用你的治理账户来执行：

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

---

???
+ note "注意事项"
 
 
  - **谁可以创建提案：** 任何拥有有效治理（冷）密钥并支付所需费用/押金的人。
 
 
  - **轨道状态：** 使用 `query gov proposal`、`query gov tally` 和 `query gov proposals`。另见 [跟踪提案状态](/governance/transactions-and-governance/#track-proposal-status)。
 
 
  - **交易标志：** 在治理交易中，保留 `--keyring-backend file --unordered --timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 --node <NODE_URL>/chain-rpc/`。
