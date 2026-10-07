# v0.2.16 仪表板维护者的费用检查

## 谁支付费用

主机节点使用热密钥签名，并将冷账户设置为 `fee_granter`。链从冷账户扣除费用，但不超过冷账户到热账户的费用授权额度。

两个数字都必须足够大。可用金额是两者中较小的那个。


| 数字 | 其含义 | 查询 |
| ---------------------- | --------------------------------------------------------------------- | ------------------------------------------------------ |
| 费用授权额度 | 热密钥可向冷账户收取的上限。这不是余额。 | `GET /cosmos/feegrant/v1beta1/allowance/{cold}/{warm}` |
| 冷账户可支出余额 | 冷账户实际可支出的代币 | `GET /cosmos/bank/v1beta1/spendable_balances/{cold}` |


10 GNK 授权但可支出 GNK 为 0 时无法支付费用。锁仓代币无法支付费用。当节点将冷账户设为 `fee_granter` 时，热密钥上的余额也无法支付费用。显示热密钥余额以便发现误转资金，并且不要将其计入可用金额。

链上代币符号为 `ngonka`。显示为 `amount / 1_000_000_000`。

## 检查对象

检查当前纪元组的成员。他们按计划提交已付费消息 `MsgPoCV2StoreCommit` 和 `MsgSubmitHardwareDiff`。注册参与者若不在该组内，则不会按计划提交这些消息。

```http
GET /productscience/inference/inference/current_epoch_group_data
```

将每个 `epoch_group_data.validation_weights[].member_address` 作为冷账户使用。

## 查找支付费用的热密钥

```http
GET /cosmos/authz/v1beta1/grants/granter/{cold}
```

翻页直到 `pagination.next_key` 为空。

支付费用的热密钥是授权方，其授权 `authorization.msg` 满足以下任一条件：

- `/inference.inference.MsgPoCV2StoreCommit`
- `/inference.inference.MsgSubmitHardwareDiff`

`MsgClaimRewards` 不足。该消息免费，冷账户通常有额外的仅限申领授权，但这些授权并非节点用于提交 StoreCommit 或 HardwareDiff 的密钥。

## 读取授权额度

```http
GET /cosmos/feegrant/v1beta1/allowance/{cold}/{warm}
```

`{cold}` 是授权方，`{warm}` 是被授权方。缺失的授权返回为 `fee-grant not found`。

对于 `BasicAllowance`：

- `spend_limit` 是 `ngonka` 中剩余的上限。随着费用扣减而减少。`spend_limit` 为空表示无上限。
- `expiration` 必须在未来。需与当前区块时间比较，而非仪表板服务器的时钟时间。

可用费用金额：

```text
usable = min(cold spendable ngonka, remaining allowance)
```

当授权额度无上限时，仅使用冷账户可支出余额。

同时列出冷账户发出的所有授权：

```http
GET /cosmos/feegrant/v1beta1/issued/{cold}
```

如果此列表中的被授权方与 StoreCommit 或 HardwareDiff 密钥不同，则节点可能正在使用无授权额度的密钥签名。应判断持有这两类消息授权的密钥。

## 读取余额

```http
GET /cosmos/bank/v1beta1/spendable_balances/{address}
GET /cosmos/bank/v1beta1/balances/{address}
GET /productscience/inference/streamvesting/total_vesting/{address}
```

对冷账户和每个支付费用的热密钥均运行以下三项。


| 字段 | 可作为支付来源 |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 冷 `spendable_balances` 用于 `ngonka` | 是。这是费用来源。 |
| 冷 `balances` | 仅显示。当银行模块中无锁定资金时，可能与可支出余额一致。 |
| 冷 `total_vesting` | 不。奖励会在这里等待解锁。主机可以显示数百万的GNK锁仓，但仍拥有0可花费金额。 |
| 温暖 `spendable_balances` | 不。显示它。如果在冷钱包可花费金额不足时该金额非零，则说明硬币位于温暖密钥上，节点将不会使用它们。 |




## 要标记的内容

当以下任一条件为真时，标记主机：

- 没有被授权执行StoreCommit或HardwareDiff的受赠人。
- 该受赠人没有从冷钱包到温暖钱包的费用赠与，或赠与已过期。
- 剩余授权额度低于一个周期的费用。
- 冷钱包可花费余额低于一个周期的费用。

在同一行显示冷钱包可花费、冷钱包锁仓、温暖钱包可花费和剩余授权额度。不要将它们合并为一个“余额”数值。

当前主机的一个典型周期费用远低于1 GNK。当冷钱包实际持有可花费硬币时，10 GNK的默认授权额度是足够的上限。链上观察到的故障模式是：存在有效的10 GNK授权额度，但冷钱包可花费和温暖钱包可花费均为0，而锁仓中持有奖励。