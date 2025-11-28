# 治理与交易（Cosmos SDK 0.53）

你将从**冷账户机器**执行治理操作，使用存储在文件密钥环中的**cold-key-name**。这是你在加入网络时创建的治理密钥（[参见快速开始](https://gonka.ai/host/quickstart/#create-account-key-local-machine)）。
交易通过 RPC 端点发送（此处称为 `$SEED_URL/chain-rpc/`）。如果你不指定 `--node`，CLI 默认为 `tcp://localhost:26657`。除非你在本地运行自己的节点，否则始终提供 `--node $SEED_URL/chain-rpc/`。
这里支持并推荐无序交易以避免序列争用。（[docs.cosmos.network](https://docs.cosmos.network/main/learn/beginner/tx-lifecycle?utm_source=chatgpt.com "Transaction Lifecycle | Explore the SDK")）

**始终在交易命令中包含这些标志：**

- `--from <cold-key-name>` → 使用你的冷治理密钥。
- `--keyring-backend file` → 确保使用本地密钥签名（系统会提示你）。
- `--unordered --timeout-duration=60s` → 使交易在有限时间内有效，绕过序列排序（v0.53+ 新增）。
- `--gas=2000000 --gas-adjustment=5.0` → 带缓冲的手动 gas 设置。
- `--node $SEED_URL/chain-rpc/` → 除非你运行本地 RPC 节点，否则必需。
- `--yes` → 自动批准广播。

有关交易生命周期和 gas 的背景，请参阅 [Cosmos SDK: 交易](https://docs.cosmos.network/main/learn/beginner/tx-lifecycle) 和 [Gas 与费用](https://docs.cosmos.network/main/build/modules/auth)。

# 对提案投票（快速路径）

大多数参与者只需要验证提案并投票。执行以下四个步骤：

## 1) 识别正确的 proposal_id（并验证它是你被告知的）

列出提案，然后检查你被给予的提案并交叉检查其字段（标题/摘要/元数据/消息）：

```bash
# 列出所有提案（ID + 基本信息）
inferenced query gov proposals -o json --node $SEED_URL/chain-rpc/
# 详细检查特定提案
inferenced query gov proposal $PROPOSAL_ID -o json --node $SEED_URL/chain-rpc/
```

确认**id**、**title**、**summary** 和（如果存在）**metadata** 与你分享的内容匹配。如果提案包含嵌入消息，你还会在这里看到它们的 `@type` 和字段。（Cosmos gov v1 将提案内容存储在链上并通过 `query gov proposal` 暴露。）（[Cosmos SDK 文档](https://docs.cosmos.network/v0.46/modules/gov/07_client.html?utm_source=chatgpt.com "Client - Cosmos SDK")）

## 2) 仔细审查内容（特别是参数更新）

如果提案包含参数更新（例如，`MsgUpdateParams`），在投票前将提议的参数与**当前链上参数**进行比较：

```bash
# 2a) 获取当前模块参数（示例：inference 模块）
inferenced query inference params -o json --node $SEED_URL/chain-rpc/ > current_params.json

# 2b) 从提案中提取提议的参数（如果链嵌套不同，调整 jq 路径）
inferenced query gov proposal $PROPOSAL_ID -o json --node $SEED_URL/chain-rpc/ \
  | jq '.proposal.messages[] | select(."type"=="inference/x/inference/MsgUpdateParams") | .value' \
  > proposed_params.json

# 2c) 比较
diff -u current_params.json proposed_params.json || true
```

对于 `MsgUpdateParams`，模块通常期望**完整**的参数对象，`authority` 是**治理模块账户**（这是正常的 — 只需确认）。([Cosmos SDK 文档](https://docs.cosmos.network/main/build/modules/bank?utm_source=chatgpt.com "x/bank | Explore the SDK")、[Cosmos Hub](https://hub.cosmos.network/main/governance/proposal-types/param-change?utm_source=chatgpt.com "Parameter Changes | Cosmos Hub"))

## 3) 了解投票选项和（非常）简短的治理流程

- **选项：** `yes`、`no`、`no_with_veto`、`abstain`。`NoWithVeto` 是"否"加上否决信号；`Abstain` 有助于法定人数而不支持或反对。([Cosmos SDK 文档](https://docs.cosmos.network/main/build/modules/gov?utm_source=chatgpt.com "x/gov | Explore the SDK")、[Cosmos 教程](https://tutorials.cosmos.network/tutorials/8-understand-sdk-modules/4-gov.html?utm_source=chatgpt.com "Understand the Gov Module"))
- **流程：** 提案开放（存款后）→ 投票期运行 → 结果由法定人数/阈值/否决参数决定 → 如果**通过**，消息通过治理模块执行。你可以在**投票期结束前的任何时间更改投票**；**最后一次**投票计入。([Cosmos Hub](https://hub.cosmos.network/main/governance/process?utm_source=chatgpt.com "On-Chain Proposal Process"))

## 4) 投票（或更改）你的投票

从持有你冷账户密钥的同一台机器运行此命令（系统会提示你输入密钥环密码，因为 `--keyring-backend=file`）：

```bash
# 选项：yes | no | no_with_veto | abstain
# 示例：投票"是"
# 作为示例，这是是！
inferenced tx gov vote <proposal_id> yes \
  --from <cold-key-name> \
  --keyring-backend file \
  --unordered --timeout-duration=60s \
  --gas=2000000 --gas-adjustment=5.0 \
  --node $SEED_URL/chain-rpc/ \
  --yes
```

你可以在投票窗口关闭前提交另一个 `tx gov vote` 来**更改你的投票**。要确认记录的内容：

```bash
# 查看统计
inferenced query gov tally $PROPOSAL_ID -o json --node $SEED_URL/chain-rpc/
# （可选）列出投票
inferenced query gov votes $PROPOSAL_ID -o json --node $SEED_URL/chain-rpc/
```

(Cosmos CLI 暴露 `vote`、`votes` 和 tally 查询；投票者可以在期间结束前重新投票。) ([Cosmos SDK 文档](https://docs.cosmos.network/v0.46/modules/gov/07_client.html?utm_source=chatgpt.com "Client - Cosmos SDK"))


---

## 提交参数变更提案

**TL;DR：** 起草一个包含 `MsgUpdateParams` 的提案，包含该模块的**所有**参数，确保存款满足 `min_deposit`，提交，然后跟踪/存款/投票。`MsgUpdateParams` 需要为目标模块提供完整的参数集。([hub.cosmos.network](https://hub.cosmos.network/main/governance/formatting?utm_source=chatgpt.com "Formatting a Proposal - Cosmos Hub"))
### 1) 获取治理模块地址（权限）

许多模块的 `MsgUpdateParams` 要求 `authority` 是**治理模块账户**。你可以通过在已加入节点的机器上运行此命令来获取（你的完整节点/服务器：）

```bash
inferenced query auth module-accounts --node $SEED_URL/chain-rpc/ | grep -B2 'name: gov'
```

治理模块在提案通过时执行提案消息。复制该地址用于 `authority` 字段。([docs.cosmos.network](https://docs.cosmos.network/main/build/modules/gov?utm_source=chatgpt.com "x/gov | Explore the SDK"))
### 2) 导出目标模块的当前参数

你将编辑这些，但在提案中包含**整个**对象。再次，在连接到节点的主服务器上运行此命令

```bash
# 自定义"inference"模块的示例
inferenced query inference params -o json --node $SEED_URL/chain-rpc/ > current_params.json
```

`MsgUpdateParams` 期望完整结构，而不是部分字段。([hub.cosmos.network](https://hub.cosmos.network/main/governance/submitting?utm_source=chatgpt.com "Submitting a Proposal - Cosmos Hub"))
### 3) 检查最小存款

```bash
inferenced query gov params -o json --node $SEED_URL/chain-rpc/ | jq '.params.min_deposit'
```

你的提案的 `deposit` 必须满足/超过 `min_deposit`。([hub.cosmos.network](https://hub.cosmos.network/main/governance/process?utm_source=chatgpt.com "On-Chain Proposal Process"))
### 4) 起草提案文件

使用内置向导搭建 `draft_proposal.json`，然后选择**其他** → 选择你的消息类型（例如，`/inference.inference.MsgUpdateParams`）。

```bash
inferenced tx gov draft-proposal
# 填充 draft_proposal.json 和 draft_metadata.json
```

`draft-proposal` 助手是现代 gov v1 CLI 的一部分。([docs.cosmos.network](https://docs.cosmos.network/main/build/modules/gov?utm_source=chatgpt.com "x/gov | Explore the SDK")、[hub.cosmos.network](https://hub.cosmos.network/main/governance/submitting?utm_source=chatgpt.com "Submitting a Proposal - Cosmos Hub"))

你将想要选择你提议的消息。要更改主链的参数，使用 `/inference.inference.MsgUpdateParams`

这将产生 `draft_proposal.json` 和 `draft_metadata.json`

元数据文件应该托管在链下，最好在 IPFS 上。

编辑 `draft_proposal.json` 使其看起来像：

```json
{
  "messages": [
    {
      "@type": "/inference.inference.MsgUpdateParams",
      "authority": "cosmos1...gov...",       // 来自步骤 1
      "params": { /* 从 current_params.json 粘贴并修改 */ }
    }
  ],
  "metadata": "ipfs://CID",  // 托管在 IPFS 上的元数据文件路径
  "deposit": "10000000ngonka",               // 满足 min_deposit
  "title": "调整 epoch 长度",
  "summary": "将 epoch 长度增加到 1000"
}
```

> 提醒：包含**整个** `params` 对象，而不仅仅是你更改的字段。([hub.cosmos.network](https://hub.cosmos.network/main/governance/submitting?utm_source=chatgpt.com "Submitting a Proposal - Cosmos Hub"))

### 5) 提交提案
这必须在你的私人机器上使用你的冷账户信息完成。

```bash
inferenced tx gov submit-proposal ./draft_proposal.json \
  --from <cold-key-name> \
  --keyring-backend file \
  --unordered --timeout-duration=60s \
  --gas=2000000 --gas-adjustment=5.0 \
  --node $SEED_URL/chain-rpc/ \
  --yes
```
你需要输入密码短语来发送提案。

v1 中的治理提案是包含嵌入消息的 JSON 文件，如果投票通过，则由治理模块执行。([docs.cosmos.network](https://docs.cosmos.network/main/build/modules/gov?utm_source=chatgpt.com "x/gov | Explore the SDK"))

### 6) 确保你的提案在链上

```bash
inferenced query gov proposals --node $SEED_URL/chain-rpc/
```
这将给出链上当前提案的列表，你应该看到你的并获取 proposal_id。

---

## 添加存款（如果需要）

如果初始存款不足，请补充：

```bash
inferenced tx gov deposit <proposal_id> <amount> \
  --from <cold-key-name> \
  --keyring-backend file \
  --unordered --timeout-duration=60s \
  --gas=2000000 --gas-adjustment=5.0 \
  --node $SEED_URL/chain-rpc/ \
  --yes
```

([docs.cosmos.network](https://docs.cosmos.network/main/build/modules/gov?utm_source=chatgpt.com "x/gov | Explore the SDK"))

---

## 投票
同样，这需要从你的私人机器使用你的治理账户：
```bash
# 选项：yes | no | no_with_veto | abstain
inferenced tx gov vote <proposal_id> yes \
  --from <cold-key-name> \
  --keyring-backend file \
  --unordered --timeout-duration=60s \
  --gas=2000000 --gas-adjustment=5.0 \
  --node $SEED_URL/chain-rpc/ \
  --yes
```

（提案者没有自动是；明确投票。）([docs.cosmos.network](https://docs.cosmos.network/main/build/modules/gov?utm_source=chatgpt.com "x/gov | Explore the SDK"))

---

## 跟踪提案状态

```bash
# 一个提案
inferenced query gov proposal <proposal_id> -o json --node $SEED_URL/chain-rpc/
# 仅统计
inferenced query gov tally <proposal_id> -o json --node $SEED_URL/chain-rpc/
# 列出所有
inferenced query gov proposals -o json --node $SEED_URL/chain-rpc/
```

([docs.cosmos.network](https://docs.cosmos.network/main/build/modules/gov?utm_source=chatgpt.com "x/gov | Explore the SDK"))

---

## 注意事项

- **无序交易语义。** 使用 `--unordered` 时，交易通过 `--timeout-duration` 携带过期时间，其序列保持未设置。期望单调序列的外部工具不得依赖这些交易。([docs.cosmos.network](https://docs.cosmos.network/main/learn/beginner/tx-lifecycle?utm_source=chatgpt.com "Transaction Lifecycle | Explore the SDK"))
- **Gas 调优。** 如果模拟紧张或验证者使用更高的最小 gas 价格，请提高 `--gas-adjustment` 或根据网络策略设置 `--gas-prices`。([docs.cosmos.network](https://docs.cosmos.network/main/build/modules/auth?utm_source=chatgpt.com "x/auth | Explore the SDK"))
