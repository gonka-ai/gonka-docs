# 提案投票
## 谁可以投票，谁不可以投票

投票资格要求在提案的 `voting_end_height` 时刻拥有大于 0 的已绑定 `tokens`。资格由以下三个独立条件共同决定：

**已绑定状态（Cosmos SDK）**

只有 `status = BOND_STATUS_BONDED` 且 `tokens > 0` 的验证者才拥有投票权。虽然处于绑定状态但 `tokens = 0` 的验证者被视为休眠状态，不贡献任何投票权。

**被监禁状态（Jail status）**

被监禁的验证者（`jailed = true`）会自动解绑，并从活跃验证者集合中移除，失去全部投票权，直到其通过 `MsgUnjail` 手动解除监禁。因离线或双签而被惩罚时会触发监禁。

在 Gonka 分叉中，这一机制通过 `SetComputeValidators` 进一步加强：在每个纪元结束时，未出现在计算结果中或被明确标记为删除的验证者，其 `tokens` 将被设为 0。由于 Gonka 没有传统的解绑周期，被监禁的验证者会立即被删除，而不是进入解绑队列。

**PoC 与 CPoC 参与情况**

投票权最终来源于 `participant.weight`，该值会在每个纪元根据 PoC 和 CPoC 的结果重新计算：

- **PoC 失败**：参与者被标记为 `INACTIVE`，从下一纪元的计算结果中移除，`tokens = 0`，无法获得投票权。
- **CPoC 失败**：即确认型 PoC，其中节点互相验证彼此的 PoC 提交结果。后果相同：从活跃集合中移除，`tokens = 0`，无投票权重。
- **活跃参与者**：根据新的权重重新计算 tokens，投票权重等于其 weight，若为守护者（Guardians）则可能获得权重提升。

**委托人（Delegators）**

标准的 Cosmos SDK 委托人，即通过 `MsgDelegate` 进行质押的任何用户，均可独立投票，且其投票会覆盖其所委托验证者在该部分委托份额上的投票。但在实际中，Gonka 的绝大多数投票权均来自验证者将其与 PoC 权重挂钩的自质押，因此此路径极少被使用。

---

## 验证与投票

大多数参与者只需完成提案验证和投票操作。请执行以下四个步骤：

### 确认正确的提案 ID（并核实是否为被告知的提案）

```bash
# List all proposals (IDs + basic info)
inferenced query gov proposals -o json --node <NODE_URL>/chain-rpc/
# Inspect a specific proposal in detail
inferenced query gov proposal <VOTE_PROPOSAL_ID> -o json --node <NODE_URL>/chain-rpc/
```

确认 **id**、**title**、**summary** 和（如果存在）**metadata** 与提供给你的信息一致。


???
+ note "了解投票选项和基本流程"
 
   - **选项：** `yes`（赞成）、`no`（反对）、`no_with_veto`（反对并否决）、`abstain`（弃权）。
 
   - **流程：** 提案在缴纳足够保证金后开启 -> 进入投票期 -> 根据法定人数（quorum）、通过阈值（threshold）和否决机制（veto）决定结果 -> 若提案通过，由治理模块（gov module）执行其中的消息。
 
   - 在投票期结束前，你可以随时更改投票意见；以最后一次投票为准。

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

同样，这需要从你个人的机器上，使用你的治理账户进行操作：

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
 
   - **谁可以创建提案：** 任何拥有有效治理（冷）密钥并支付所需费用/保证金的用户。
 
   - **提案状态跟踪：** 使用 `query gov proposal`、`query gov tally` 和 `query gov proposals` 命令。另见 [跟踪提案状态](/governance/transactions-and-governance/#track-proposal-status)。
 
   - **交易标志：** 在治理交易中，请保留 `--keyring-backend file --unordered --timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 --node <NODE_URL>/chain-rpc/`。
