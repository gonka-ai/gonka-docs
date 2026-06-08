# 如何在 Gonka 上创建并提交治理提案

使用 `inferenced` 分步提交提案。  
与 Gonka 交易和治理系统对齐。  
在运行命令前，请将所有占位符替换为你的实际值。

## 占位符说明

| 占位符 | 含义 |
| --- | --- |
| `<COLD_KEY_NAME>` | 你在密钥环中的密钥名称（不是你的 `gonka1...` 地址） |
| `<PATH_TO_PROPOSAL_JSON>` | 提案 JSON 文件的路径，例如 `./proposal.json` |
| `<NODE_URL>` | 节点基础 URL，不包含 `/chain-rpc/`，例如 `http://node1.gonka.ai:8000` |
| `<CHAIN_ID>` | 例如主网为 `gonka-mainnet` |

如果命令因 `connection`（连接）或 `parse`（解析）失败，请检查每个 RPC 命令是否都正确使用了 `<NODE_URL>/chain-rpc/`，且路径中仅包含一个 `/chain-rpc/`。

---

## 两个不同的 URL（切勿混淆）

| 任务 | 使用变量 |
| --- | --- |
| `inferenced query / tx` 查询或交易 | `<NODE_URL>/chain-rpc/`（必须包含 `/chain-rpc/`） |
| `create-client`（通过 HTTP 访问 `.../v1/participants` 接口） | `<NODE_URL>`（不包含 `/chain-rpc/`） |

在 `create-client` 命令中使用 `<NODE_URL>/chain-rpc/` 作为 `--node-address` 是错误的，会导致连接失败或访问到错误的服务。

---

## 前置条件
### 1. 安装 CLI 工具

从 Gonka 发布页面下载适用于你操作系统的版本，解压后执行以下操作：

```bash
chmod +x inferenced
./inferenced --help
```

有关详细的 CLI 安装说明，请参阅 [本地机器 CLI 安装指南](https://gonka.ai/host/quickstart/#local-machine-install-the-cli-tool)。安装 CLI 后，您可以返回此页面并继续操作。

### 2. 从链上读取 `min_deposit` 和 `voting_period`

请勿依赖旧文档中固定的 `ngonka` 数额。请查询实时数值：

```bash
./inferenced query gov params \
  --node "<NODE_URL>/chain-rpc/" \
  --chain-id "<CHAIN_ID>" \
  -o json | jq '{min_deposit: .params.min_deposit, voting_period: .params.voting_period}'
```

您的提案 JSON 中的 `deposit` 必须满足 `min_deposit` 要求（相同 denom，金额 >= 最小值）。

### 3. 提案 JSON

准备一个 gov v1 版本的 JSON 文件（包含 `messages`、`metadata`、`deposit`、`title`、`summary`）。

一个提案必须至少包含一条消息 **或** 一个非空的 `metadata` 字段。如果 `messages` 数组为空且 `metadata` 也为空，则该信号类提案在提交时将被拒绝（错误提示：`either metadata or Msgs length must be non-nil`），因此在此类情况下，请确保将 `metadata` 设置为非空值。

准备内容主要分为两部分：

#### 提案描述字段

链上文本应简洁明了。

请确保提案包含以下内容：

- 对提案内容的简要概述。
- 指向完整提案说明文档（含所有细节）的链接。
- 若提案申请资金，需提供接收资金的钱包地址。
- 若提案申请资金，需注明所需金额及代币类型（denom）。

#### 提案 JSON 结构

关于 JSON 结构，最佳做法是查看以往的提案示例，并以其为参考。

您可以查阅历史提案的 JSON 数据，了解不同类型提案的结构。通常，从一个相似的已有提案出发并进行修改会更加高效。

对于如 `MsgUpdateParams` 这类消息，链上要求提供完整的参数对象，并设置正确的权限地址（即治理模块地址）。  
请先获取治理模块地址：

```bash
./inferenced query auth module-accounts \
  --node "<NODE_URL>/chain-rpc/" \
  --chain-id "<CHAIN_ID>" \
  -o json | jq -r '.accounts[] | select(.value.name=="gov") | .value.address'
```

在需要 `authority` 字段的消息类型中，使用该地址作为 `authority`。

如果 `jq` 命令无输出，请在不使用 `jq` 的情况下运行相同的查询，并手动查找 gov 模块条目。输出结构可能因 SDK 版本略有不同。

### 4. 可选：新建密钥并注册参与者（`create-client`）

此步骤将创建一个密钥并调用种子节点的 HTTP API（参与者注册）。  
仅使用 `<NODE_URL>`：

```bash
./inferenced create-client "<COLD_KEY_NAME>" \
  --node-address "<NODE_URL>"
```

安全地保存助记词。  
如果已有用于治理的已注资密钥，请跳过此步骤，避免重复注册。

在使用 `keys show`、`tx gov submit-proposal` 和 `tx gov vote` 时，请始终使用相同的 `--keyring-backend`（例如 `file`）。

---

## 在链上发布提案

### 1. 检查余额

```bash
./inferenced query bank balances \
  "$(./inferenced keys show "<COLD_KEY_NAME>" -a --keyring-backend file)" \
  --node "<NODE_URL>/chain-rpc/" \
  --chain-id "<CHAIN_ID>"
```

确保你有足够的 `ngonka`（或你的节点所要求的费用代币）用于 `min_deposit` 和交易费用。

### 2. 提交

来自官方 Gonka 文档的推荐模式：

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

提交后，请注意输出中的提案编号，或通过查询命令找到该编号。  
分享提案编号，以便社区发布公告。

---

## 投票与计票

投票步骤在专用页面中有详细说明：

- [对提案进行投票](https://gonka.ai/governance/voting-on-proposals/)

---

## 提交参数变更提案

**简要说明：** 使用 `MsgUpdateParams` 起草提案，包含该模块的**所有**参数，确保保证金达到 `min_deposit` 要求，提交后进行跟踪、追加保证金或投票。

### 1. 获取治理模块地址（授权方）

```bash
inferenced query auth module-accounts --node <NODE_URL>/chain-rpc/ | grep -B2 'name: gov'
```

### 2. 导出目标模块的当前参数

```bash
inferenced query inference params -o json --node <NODE_URL>/chain-rpc/ > current_params.json
```

### 3. 查看最低存款金额

```bash
inferenced query gov params -o json --node <NODE_URL>/chain-rpc/ | jq '.params.min_deposit'
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

### 6. 确保你的提案在链上

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

对于 `MsgUpdateParams`，模块通常期望提供完整的参数对象，并将 `authority` 设置为 **gov 模块账户**。
