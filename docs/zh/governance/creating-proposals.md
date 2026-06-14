# 如何在Gonka上创建并提交治理提案

使用`inferenced`提交提案的分步指南。
与Gonka交易和治理对齐。
在运行命令前，将每个占位符替换为自己的值。

## 占位符

| 占位符 | 含义 |
| --- | --- |
| `<COLD_KEY_NAME>` | 密钥环中的密钥名称（不是你的`gonka1...`地址） |
| `<PATH_TO_PROPOSAL_JSON>` | 提案JSON文件的路径，例如 `./proposal.json` |
| `<NODE_URL>` | 节点基础URL，不包含`/chain-rpc/`，例如 `http://node1.gonka.ai:8000` |
| `<CHAIN_ID>` | 例如主网的 `gonka-mainnet` |

如果命令因`connection`或`parse`失败，请检查每个RPC命令是否在恰好一个`/chain-rpc/`后使用了`<NODE_URL>/chain-rpc/`。

---

## 两个URL（不要混用）

| 任务 | 变量 |
| --- | --- |
| `inferenced query / tx` | `<NODE_URL>/chain-rpc/`（必须包含`/chain-rpc/`） |
| `create-client`（种子节点上的HTTP `.../v1/participants`） | `<NODE_URL>`（不含`/chain-rpc/`） |

在`create-client`中为`--node-address`使用`<NODE_URL>/chain-rpc/`是错误的，会导致失败或访问错误的服务。

---

## 前提条件
### 1. 安装CLI

从Gonka发布页面下载适用于你操作系统的版本，解压后执行：

```bash
chmod +x inferenced
./inferenced --help
```

有关详细的 CLI 安装说明，请参阅[本地机器 CLI 设置指南](https://gonka.ai/host/quickstart/#local-machine-install-the-cli-tool)。安装 CLI 后，您可以返回此页面并继续。

### 2. 从链上读取治理参数

不要依赖旧文档中的固定数值。治理参数可在链上配置，因此在起草提案或宣布投票规则前，请查询实时数值：

```bash
./inferenced query gov params \
  --node "<NODE_URL>/chain-rpc/" \
  --chain-id "<CHAIN_ID>" \
  -o json | jq '.params | {
      min_deposit,
      expedited_min_deposit,
      max_deposit_period,
      voting_period,
      expedited_voting_period,
      quorum,
      threshold,
      expedited_threshold,
      veto_threshold,
      burn_vote_veto
    }'
```

您的提案JSON `deposit` 必须满足 `min_deposit`（相同的denom，金额 >= 最低要求）。如果提案是加急的，请同时检查 `expedited_min_deposit`、`expedited_voting_period` 和 `expedited_threshold`。

在撰写本文时，主网使用：

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

### 3. 提案 JSON

准备一个 gov v1 JSON（`messages`, `metadata`, `deposit`, `title`, `summary`）.

一个提案必须至少包含一条消息 **或** 一个非空的 `metadata` 字段。一个信号类提案如果 `messages` 数组为空且 `metadata` 为空，则在提交时会被拒绝（`either metadata or Msgs length must be non-nil`），因此在这种情况下应将 `metadata` 设置为非空值。

需要准备的两个主要部分：

#### 提案描述字段

保持链上文本简短清晰。

确保提案包含：

- 提案内容的简要概述。
- 指向包含所有详细信息的完整提案描述的链接。
- 如果提案申请资金，需提供资金应发送到的钱包地址。
- 如果提案申请资金，需提供申请金额和代币类型（denom）。

#### 提案 JSON 结构

对于 JSON 结构，最佳方法是查看之前的提案并以其作为参考。

你可以检查之前提案的 JSON，了解不同类型提案的结构。
在许多情况下，从一个类似的先前提案出发并进行修改会更简便。

对于 `MsgUpdateParams` 等消息，链上要求提供完整的 params 对象以及正确的 authority（gov 模块地址）。
获取 gov 模块地址：

```bash
./inferenced query auth module-accounts \
  --node "<NODE_URL>/chain-rpc/" \
  --chain-id "<CHAIN_ID>" \
  -o json | jq -r '.accounts[] | select(.value.name=="gov") | .value.address'
```

在需要消息类型的地方使用该地址作为`authority`。

如果`jq`行未打印任何内容，请运行相同的查询但不带`jq`一次，并手动找到gov模块条目。输出格式可能因SDK版本略有不同。

### 4. 可选：新建密钥并注册参与者（`create-client`）

这将创建一个密钥并调用种子HTTP API（参与者注册）。
仅使用`<NODE_URL>`：

```bash
./inferenced create-client "<COLD_KEY_NAME>" \
  --node-address "<NODE_URL>"
```

安全地存储助记词。
如果您已拥有用于治理的已注资密钥，请跳过此步骤，避免重复注册。

在所有地方（例如 `file`）对 `keys show`、`tx gov submit-proposal` 和 `tx gov vote` 使用相同的 `--keyring-backend`。

---

## 将提案发布到链上

### 1. 检查余额

```bash
./inferenced query bank balances \
  "$(./inferenced keys show "<COLD_KEY_NAME>" -a --keyring-backend file)" \
  --node "<NODE_URL>/chain-rpc/" \
  --chain-id "<CHAIN_ID>"
```

确保您有足够的`ngonka`（或您的节点所需的费用代币）用于`min_deposit`和费用。

### 2. 提交

来自官方Gonka文档的推荐模式：

```bash
./inferenced tx gov submit-proposal "<PATH_TO_PROPOSAL_JSON>" \
  --from "<COLD_KEY_NAME>" \
  --keyring-backend file \
  --chain-id "<CHAIN_ID>" \
  --node "<NODE_URL>/chain-rpc/" \
  --unordered --timeout-duration=60s \
  --gas 2000000 --gas-adjustment 5.0 \
  --yes
```

提交后，请注意输出中的提案编号，或通过查询命令找到它。
分享提案编号，以便向社区发布公告。

---

## 投票与计票

投票步骤和结果计算公式在专用页面上有文档说明：

- [提案投票](https://gonka.ai/governance/voting-on-proposals/)

---

## 提交参数变更提案

**简而言之：** 使用 `MsgUpdateParams` 起草提案，包含该模块的**所有**参数，确保保证金满足 `min_deposit`，提交后进行跟踪/追加保证金/投票。

### 1. 获取治理模块地址（授权方）

```bash
inferenced query auth module-accounts --node <NODE_URL>/chain-rpc/ | grep -B2 'name: gov'
```

### 2. 为目标模块导出当前参数

```bash
inferenced query inference params -o json --node <NODE_URL>/chain-rpc/ > current_params.json
```

### 3. 检查治理质押和计票参数

```bash
inferenced query gov params -o json --node <NODE_URL>/chain-rpc/ \
  | jq '.params | {
      min_deposit,
      expedited_min_deposit,
      voting_period,
      expedited_voting_period,
      quorum,
      threshold,
      expedited_threshold,
      veto_threshold,
      burn_vote_veto
    }'
```

### 4. 起草提案文件

```bash
inferenced tx gov draft-proposal
# fills draft_proposal.json and draft_metadata.json
```

编辑 `draft_proposal.json` 并包含完整的 `params` 对象。

### 5. 提交提案

```bash
inferenced tx gov submit-proposal ./draft_proposal.json \
  --from <COLD_KEY_NAME> \
  --keyring-backend file \
  --unordered --timeout-duration=60s \
  --gas=2000000 --gas-adjustment=5.0 \
  --node <NODE_URL>/chain-rpc/ \
  --yes
```

### 6. 确保您的提案在链上

```bash
inferenced query gov proposals --node <NODE_URL>/chain-rpc/
```

### 仔细审查内容（特别是参数更新）

```bash
# 2a) Get current module params (example: inference module)
inferenced query inference params -o json --node <NODE_URL>/chain-rpc/ > current_params.json

# 2b) Extract proposed params from the proposal
inferenced query gov proposal <VOTE_PROPOSAL_ID> -o json --node <NODE_URL>/chain-rpc/ \
  | jq '.proposal.messages[] | select(."type"=="inference/x/inference/MsgUpdateParams") | .value' \
  > proposed_params.json

# 2c) Diff
diff -u current_params.json proposed_params.json || true
```

对于 `MsgUpdateParams`，模块通常期望完整的参数对象，并将 `authority` 设置为 **gov 模块账户**。
