# 如何在 Gonka 上创建并提交治理提案

使用 `inferenced` 提交提案的分步指南。  
与 Gonka 交易及治理机制保持一致。  
在执行命令前，请将所有占位符替换为您的实际值。

## 占位符

| 占位符 | 含义 |
| --- | --- |
| `<COLD_KEY_NAME>` | 您在密钥环中的密钥名称（不是您的 `gonka1...` 地址） |
| `<PATH_TO_PROPOSAL_JSON>` | 提案 JSON 文件的路径，例如 `./proposal.json` |
| `<NODE_URL>` | 节点基础 URL，不包含 `/chain-rpc/`，例如 `http://node1.gonka.ai:8000` |
| `<CHAIN_ID>` | 例如主网使用 `gonka-mainnet` |

如果命令因 `connection` 或 `parse` 失败，请检查每个 RPC 命令是否在 `<NODE_URL>/chain-rpc/` 中准确使用了单个 `/chain-rpc/`。

---

## 两个 URL（切勿混淆）

| 任务 | 变量 |
| --- | --- |
| `inferenced query / tx` | `<NODE_URL>/chain-rpc/`（必须包含 `/chain-rpc/`） |
| `create-client`（种子节点上的 HTTP `.../v1/participants`） | `<NODE_URL>`（不包含 `/chain-rpc/`） |

在 `create-client` 中对 `--node-address` 使用 `<NODE_URL>/chain-rpc/` 是错误的，会导致失败或访问错误的服务。

---

## 前置条件
### 1. 安装 CLI

从 Gonka 发布页面下载适用于您操作系统的版本，解压后执行：

```bash
chmod +x inferenced
./inferenced --help
```

有关详细的 CLI 安装说明，请参阅 [本地机器 CLI 安装指南](https://gonka.ai/host/quickstart/#local-machine-install-the-cli-tool)。安装 CLI 后，您可以返回此页面并继续操作。

### 2. 从链上读取 `min_deposit` 和 `voting_period`

不要依赖旧文档中固定的 `ngonka` 数量。请查询实时数值：

```bash
./inferenced query gov params \
  --node "<NODE_URL>/chain-rpc/" \
  --chain-id "<CHAIN_ID>" \
  -o json | jq '{min_deposit: .params.min_deposit, voting_period: .params.voting_period}'
```

您的提案 JSON `deposit` 必须满足 `min_deposit`（相同的 denom，金额 >= 最低要求）。

### 3. 提案 JSON

准备一个 gov v1 JSON（`messages`、`metadata`、`deposit`、`title`、`summary`）。

一个提案必须至少包含一条消息 **或** 一个非空的 `metadata` 字段。如果一个信号类提案的 `messages` 数组和 `metadata` 均为空，则在提交时会被拒绝（`either metadata or Msgs length must be non-nil`），因此在此类情况下，请将 `metadata` 设置为非空值。

准备内容主要包括以下两部分：

#### 提案描述字段

链上文本应简洁明了。

确保提案包含以下内容：

- 对提案内容的简要概述。
- 指向完整提案说明文档的链接，包含所有详细信息。
- 若提案申请资金，需提供资金应发送至的钱包地址。
- 若提案申请资金，需注明申请金额及代币类型（denom）。

#### 提案 JSON 结构

关于 JSON 结构，最佳方法是查看以往的提案，并以其作为参考。

您可查阅此前的提案 JSON，了解不同类型提案的结构。在大多数情况下，从一个相似的已有提案出发并进行修改会更加便捷。

对于 `MsgUpdateParams` 等消息，链上要求提供完整的参数对象（params object）以及正确的权限地址（即治理模块地址）。  
请获取治理模块地址：

```bash
./inferenced query auth module-accounts \
  --node "<NODE_URL>/chain-rpc/" \
  --chain-id "<CHAIN_ID>" \
  -o json | jq -r '.accounts[] | select(.value.name=="gov") | .value.address'
```

在需要指定消息类型的场景中，使用该地址作为 `authority`。

如果 `jq` 命令行未输出任何内容，请移除 `jq` 后再次执行相同查询，并手动查找 gov 模块条目。输出格式可能因 SDK 版本不同而略有差异。

### 4. 可选：新建密钥并注册参与者（`create-client`）

此步骤将创建一个密钥并调用 seed HTTP API（参与者注册）。  
仅使用 `<NODE_URL>`：

```bash
./inferenced create-client "<COLD_KEY_NAME>" \
  --node-address "<NODE_URL>"
```

安全地保存助记词。  
如果已有用于治理的已注资密钥，请跳过此步骤，避免重复注册。

在所有地方（例如 `file`）对 `keys show`、`tx gov submit-proposal` 和 `tx gov vote` 使用相同的 `--keyring-backend`。

---

## 在链上发布提案

### 1. 检查余额

```bash
./inferenced query bank balances \
  "$(./inferenced keys show "<COLD_KEY_NAME>" -a --keyring-backend file)" \
  --node "<NODE_URL>/chain-rpc/" \
  --chain-id "<CHAIN_ID>"
```

确保您有足够的 `ngonka`（或您的节点所要求的费用代币）用于 `min_deposit` 和手续费。

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
分享提案编号，以便向社区发布公告。

---

## 投票与计票

投票步骤在专用页面中有详细说明：

- [对提案进行投票](https://gonka.ai/governance/voting-on-proposals/)

---

## 提交参数变更提案

**简要说明：** 使用 `MsgUpdateParams` 起草提案，包含该模块的**所有**参数，确保保证金满足 `min_deposit`，然后提交，并跟进、缴纳保证金或投票。

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

对于 `MsgUpdateParams`，模块通常期望完整的 params 对象，并将 `authority` 设置为 **gov 模块账户**。
