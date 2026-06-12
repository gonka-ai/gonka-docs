# Gonka 创世仪式

创世仪式是一个协调流程，用于通过一组预定义的初始验证节点和一个共识的 `genesis.json` 文件来启动 Gonka 区块链。该仪式至关重要，因为它建立了网络的基础安全性，确保验证节点之间的公平参与，并为区块链创建一个可验证的起点。

## 概述

该仪式是一个完全通过 GitHub Pull Request（PR）管理的透明且可审计的流程。核心工作流非常简单：

- 节点运营方（验证节点）通过 PR 提交信息以及离线交易文件（`GENTX` 和 `GENPARTICIPANT`）
- 协调员汇总并验证这些输入，发布最终达成共识的 `genesis.json` 文件，附带计划的 `genesis_time` 和记录的哈希值
- 验证节点验证文件是否正确生成，并启动其节点

该仪式通过明确定义的阶段，生成一个可审计、共享的 `genesis.json` 文件。所有协作均通过 GitHub PR 进行，以实现完全的透明度和可追溯性。

??? note "创世仪式的核心原则"

    | 原则 | 说明 |
    | --- | --- |
    | **透明性与可审计性 * * | 所有提交均通过 GitHub PR 进行，从头到尾创建公开、可验证的完整流程记录。 |
    | **去中心化启动 * * | 仪式确保网络从一组共识的独立验证节点开始，在创世块即实现去中心化。 |
    | **可验证状态 * * | 最终的 `genesis.json` 哈希值会被记录，使每个节点运营方都能确认自己从完全相同初始状态启动。 |
    | **共识机制 * * | 该流程保证所有初始验证节点在网络上线前已审查并接受创世状态。 |
## 前提条件

在参与仪式之前，每个节点运营方（验证节点）必须：

1. Fork [Gonka 代码仓库](https://github.com/gonka-ai/gonka/) 到你的 GitHub 账户。

2. 选择一个节点（验证节点）名称，并创建你的验证节点目录：
 

 
 

```bash
   cp -r genesis/validators/template genesis/validators/<YOUR_VALIDATOR_NAME>
 
 
 
```
   该目录将用于在仪式期间共享信息和交易。

3. 完成快速入门指南中的本地设置部分。

 
 
   - 在仪式开始前，你必须按照 [Gonka 快速入门](https://gonka.ai/host/quickstart) 指南完成本地机器的设置。这包括安装 `inferenced` CLI、创建你的账户冷密钥（Account Cold Key），以及拉取 Docker 镜像。
 
 
   - 在拉取完镜像后停止操作，不要启动服务；仪式流程会用离线的、基于 Pull Request（PR）的工作流替代原有的服务端设置和链上交易。

4. 确认准备就绪：

 
 
   - 已在本地安装 `inferenced` CLI，并已创建账户冷密钥。
 
 
   - 容器已拉取，模型已下载，环境变量（`config.env`）已配置。

## 仪式流程

仪式采用五阶段流程，用离线的、基于 PR 的工作流替代 `quickstart.md` 中的链上注册步骤。所有交易文件均在本地生成，并提交给协调员（Coordinator）进行聚合。

- **第 1 阶段 [验证者]**：准备密钥并进行初始服务器设置；提交包含验证者信息的 PR（包括节点 ID、机器学习运行地址和共识公钥）
- **第 2 阶段 [协调员]**：聚合验证者信息并发布 `genesis.json` 草稿供审查
- **第 3 阶段 [验证者]**：根据草稿生成离线的 `GENTX` 和 `GENPARTICIPANT` 文件；提交包含这些文件的 PR
- **第 4 阶段 [协调员]**：验证并收集交易文件，修补 `genesis.json`，设置 `genesis_time`
- **第 5 阶段 [验证者]**：获取最终的 `genesis.json`，验证哈希值，并在 `genesis_time` 前启动节点

### 部署脚本

为简化流程，仪式所用的部署脚本将位于 [Gonka 仓库](https://github.com/gonka-ai/gonka/) 的 [/deploy/join](/deploy/join) 目录中。  
这些部署脚本与 `quickstart.md` 中的标准加入流程相同。在仪式期间，协调员将调整以下环境变量以启用创世阶段特有的行为：

- `INIT_ONLY` — 初始化数据目录并准备配置，但不启动完整服务栈
- `GENESIS_SEEDS` — 启动时用于初始 P2P 连接的种子节点地址列表
- `IS_GENESIS` — 在 compose/脚本中切换仅限创世的功能（例如哈希验证、引导行为）

位置：这些变量由协调员在 `deploy/join/docker-compose.yml` 中设置。验证者不应更改它们。

一旦 **第 5 阶段** 完成且链成功启动，协调员将从代码库中移除上述变量，因为它们不再需要。

工作目录：所有 `docker compose` 命令应在 `deploy/join` 中运行（请先切换目录），或在从仓库根目录运行时显式传入 `-f deploy/join/docker-compose.yml`。

### 第 1 阶段 [验证者]：准备密钥和初始服务器设置

此阶段与 `quickstart.md` 中的密钥生成步骤类似，但所有设置均离线进行，以生成仪式所需的文件。账户密钥（冷密钥）已在快速入门阶段创建；以下步骤将指导你在服务器上生成机器学习运行密钥（温密钥，Warm Key）。

#### 1.1 [本地] 确认账户冷密钥（来自快速入门）
账户冷密钥是在 `quickstart.md` 期间创建的。你可以使用以下命令查看其信息：

```bash
./inferenced keys list --keyring-backend file
```

**示例输出：**
```

Enter keyring passphrase (attempt 1/3):
- address: gonka1eq4f5p32ewkekf9rv5f0qjsa0xaepckmgl85kr
  name: "gonka-account-key"
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A4U3G2eY46mwhWx7ZXieT+LetPJhG0jHNuVCQB6wgBZK"}'
  type: local
```

#### 1.2 [服务器]：初始化节点并获取节点 ID

```bash
docker compose run --rm node
```

**示例输出：**
```

51a9df752b60f565fe061a115b6494782447dc1f
```


#### 1.3 [服务器]：提取共识公钥
启动 `tmkms` 服务以生成共识密钥，然后提取公钥。

```bash
docker compose up -d tmkms && docker compose run --rm --entrypoint /bin/sh tmkms -c "tmkms-pubkey"
```

**示例输出：**
```

/wTVavYr5OCiVssIT3Gc5nsfIH0lP1Rqn/zeQtq4CvQ=
```

#### 1.4 [服务器]：生成机器学习操作密钥

在 `api` 容器内使用 `file` 密钥环后端创建暖密钥（程序化访问所必需）。该密钥将存储在映射到容器 `/root/.inference` 的持久卷中：

注意：`$KEY_NAME` 和 `$KEYRING_PASSWORD` 在快速入门指南 `config.env` 中定义。

```bash
docker compose run --rm --no-deps -it api /bin/sh
```

在容器内创建 ML 操作密钥：

```bash
printf '%s\n%s\n' "$KEYRING_PASSWORD" "$KEYRING_PASSWORD" | inferenced keys add "$KEY_NAME" --keyring-backend file
```

**示例输出：**
```

~
 # printf '%s\n%s\n' "$KEYRING_PASSWORD" "$KEYRING_PASSWORD" | inferenced keys add "$KEY_NAME" --keyring-backend file

- address: gonka1gyz2agg5yx49gy2z4qpsz9826t6s9xev6tkehw
  name: node-702105
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"Ao8VPh5U5XQBcJ6qxAIwBbhF/3UPZEwzZ9H/qbIA6ipj"}'
  type: local


**Important** write this mnemonic phrase in a safe place.
It is the only way to recover your account if you ever forget your password.

again plastic athlete arrow first measure danger drastic wolf coyote work memory already inmate sorry path tackle custom write result west tray rabbit jeans
```

#### 1.5 [本地]：创建包含验证节点信息的 PR
创建或更新 `genesis/validators/<YOUR_VALIDATOR_NAME>/README.md`，包含以下字段。使用上文及快速入门（Quickstart）中收集的值。

```markdown
Account Public Key: <value of ACCOUNT_PUBKEY from your config.env file>
Node ID: <node-id-from-step-1.2>
ML Operational Address: <ml-operational-key-address-from-step-1.4>
Consensus Public Key: <consensus-pubkey-from-step-1.3>
P2P_EXTERNAL_ADDRESS: <value of P2P_EXTERNAL_ADDRESS from your config.env file>
```

#### 1.6 创建 Pull Request

向 [Gonka 仓库](https://github.com/gonka-ai/gonka/) 提交一个 PR，包含你的验证节点信息。PR 标题需清晰明确，例如：“Add validator: <YOUR_VALIDATOR_NAME>”，并确保你的 `README.md` 文件中所有必填字段均已填写。

### 第二阶段. [协调员]：创世草案准备

协调员将执行以下操作：

- 审核并合并第一阶段中所有验证节点提交的 PR
- 准备初始的 `genesis.json` 草案，其中包含所有账户地址，并将其放入 `genesis/genesis-draft.json`
- 向所有主机（Hosts）宣布草案已可用

### 第三阶段. [验证节点]：生成 `GENTX` 和 `GENPARTICIPANT`

本阶段涉及生成链初始化所需的交易文件。这些交易包括：

- `MsgCreateValidator` —— 在链上创建你的验证节点
- `MsgSubmitNewParticipant` —— 将你的节点注册为网络主机（Host）

执行 `gentx` 命令需要使用此前步骤中的以下变量：

| **变量 * * | **说明 * * |
| --- | --- |
| `<cold_key_name>` | 本地注册表中账户冷钱包密钥的名称（例如，Quickstart 中的 "gonka-account-key"） |
| `<YOUR_VALIDATOR_NAME>` | 在前置条件部分选择的验证节点名称 |
| `<ml-operational-key-address-from-step-1.4>` | 第 1.4 步中获取的机器学习操作密钥（ML Operational Key）地址 |
| `$PUBLIC_URL` | Quickstart 中 `config.env` 设置的公共 URL 环境变量 |
| `<consensus-pubkey-from-step-1.3>` | 第 1.3 步中获取的共识公钥（Consensus public key） |
| `<node-id-from-step-1.2>` | 第 1.2 步中获取的节点 ID（Node ID） |
该自定义的 `gentx` 命令会自动从你的账户密钥向机器学习操作密钥创建所需的 `authz` 授权，从而简化设置流程。

在生成文件之前，你必须将草案 `genesis/genesis-draft.json` 复制到存储账户冷钱包密钥的 `config` 目录中。这使得 `gentx` 命令能够访问你的密钥，并根据正确的链配置验证交易。

`inferenced` 的默认主目录为 `~/.inference`。如果你在此目录下创建了密钥，请使用以下命令：

```bash
cp ./genesis/genesis-draft.json ~/.inference/config/genesis.json
```

!!! note
    如果您在创建密钥时使用 `--home` 标志指定了自定义主目录，请确保在执行 `gentx` 命令时通过再次提供 `--home` 标志来使用相同的目录。

#### [本地]：创建 GENTX 和 GENPARTICIPANT 文件

`1ngonka` 的值表示为 genesis 交易设置的人工共识权重。实际的验证节点权重将在首次计算证明（PoC）阶段期间确定。

```bash
./inferenced genesis gentx \
    --keyring-backend file \
    <cold_key_name> 1ngonka \
    --moniker <YOUR_VALIDATOR_NAME> \
    --pubkey <consensus-pubkey-from-step-1.3> \
    --ml-operational-address <ml-operational-key-address-from-step-1.4> \
    --url $PUBLIC_URL \
    --chain-id gonka-mainnet \
    --node-id <node-id-from-step-1.2>
```

**示例输出：**
```

./inferenced genesis gentx \
    --home ./702121 \
    --keyring-backend file \
    702121 1ngonka \
    --pubkey eNrjtkSXzfE18jq3lqvpu/i1iIog9SN+kqR2Wsa6fSM= \
    --ml-operational-address gonka13xplq68fws3uvs8m7ej2ed5ack9hzpc68fwvex \
    --url http://36.189.234.237:19238 \
    --moniker "mynode-702121" --chain-id gonka-mainnet \
    --node-id 149d25924b9a6676448aea716864c31775645459
Enter keyring passphrase (attempt 1/3):
Classic genesis transaction written to "702121/config/gentx/gentx-149d25924b9a6676448aea716864c31775645459.json"
Genparticipant transaction written to "702121/config/genparticipant/genparticipant-149d25924b9a6676448aea716864c31775645459.json"
```

#### [本地]：提交生成的文件

将生成的文件复制到您的验证者目录并创建 PR：

- 将文件复制到您的验证者目录：

 

 
 

```bash
   cp ~/.inference/config/gentx/gentx-<node-id>.json genesis/validators/<YOUR_VALIDATOR_NAME>/
   cp ~/.inference/config/genparticipant/genparticipant-<node-id>.json genesis/validators/<YOUR_VALIDATOR_NAME>/
 
 
 
```

- 创建一个包含以下文件的 PR：

 
 
   - `genesis/validators/<YOUR_VALIDATOR_NAME>/gentx-<node-id-from-step-1.2>.json`
 
 
   - `genesis/validators/<YOUR_VALIDATOR_NAME>/genparticipant-<node-id-from-step-1.2>.json`

使用清晰的 PR 标题，例如：“Add gentx files for validator: <YOUR_VALIDATOR_NAME>”。


### 第4阶段。[协调员]：最终创世准备

当所有验证者提交了他们的交易文件后，协调员开始构建官方的 `genesis.json`。这一步骤至关重要，它确保所有初始参与者都能正确地被包含在区块链的第一个区块状态中。

该过程包括两个主要命令：

1.  收集创世交易：使用 `collect-gentxs` 命令收集所有 `gentx-<node-id>.json` 文件，验证其有效性，并将其合并到 `genesis.json` 中，以填充初始验证者集合。
2.  修补参与者数据：使用 `patch-genesis` 命令处理所有 `genparticipant-<node-id>.json` 文件，验证其签名，并修补初始状态，以包含所有已注册的参与者。

在合并所有交易之后，协调员会将 `genesis_time` 设置为一个未来的时间戳，以确保所有验证者都有足够的时间准备，实现同步启动。

最后，协调员将官方的 `genesis.json` 提交至 `genesis/` 目录。该提交的哈希值随后会被嵌入到源代码中，以确保所有节点都从同一个经过验证的状态启动。

#### 4.1 [协调员]：收集创世交易

```bash
./inferenced genesis collect-gentxs --gentx-dir gentxs
```

#### 4.2 [协调器]：处理参与者注册

```bash
./inferenced genesis patch-genesis --genparticipant-dir genparticipants
```

#### 4.3 [协调员]：配置网络种子节点

协调员通过在 `GENESIS_SEEDS` 中设置 `deploy/join/docker-compose.yml` 变量来配置初始网络对等连接。该变量是一个以逗号分隔的验证节点地址列表，每个地址根据各验证节点在其各自的 `README.md` 文件中提供的 `Node ID` 和 `P2P_EXTERNAL_ADDRESS` 构建而成。

示例格式：`<node-id-1>@<P2P_EXTERNAL_ADDRESS_1>,<node-id-2>@<P2P_EXTERNAL_ADDRESS_2>,...`

此外，协调员需将 `INIT_ONLY` 设置为 `false`，以便节点在启动时能够完全启动并连接到网络，而不仅仅是初始化其数据目录。

### 第5阶段 [验证节点]：链启动

在最终的 `genesis.json` 发布后，验证节点必须验证其生成的正确性，并准备在指定的 `genesis_time` 启动节点。区块链将在该确切时刻开始生成区块。

#### 5.1 [服务器]：更新并启动

以下步骤应在您的验证节点服务器上执行。

-  **拉取最新配置**

    从代码仓库拉取最新更改，以获取最终的 `genesis.json` 和种子节点配置。
 

 
 

 

```bash
    git pull
 
 
 
 
```

-  **更新容器镜像**

    从 `deploy/join` 目录中拉取最新的 Docker 容器镜像。节点镜像将使用最终的创世块哈希构建，以供验证。
 

 
 

 

```bash
    source config.env
    docker compose -f docker-compose.yml -f docker-compose.mlnode.yml pull
 
 
 
 
```

-  **启动你的验证节点**

    最后，启动所有服务。
 

 
 

 

```bash
    docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d
 
 
 
 
```

#### 5.2 [服务器]：验证启动状态

启动后，请监控节点日志，确认节点正在等待创世时间：

```bash
docker compose logs node -f
```

查找与此类似的消息：
```

INF Genesis time is in the future. Sleeping until then... genTime=2025-08-14T09:13:39Z module=server
```

!!! note "重要提示"

 
 
   - `api` 容器在 `node` 容器完全运行之前可能会重启多次
 
 
   - 一旦超过创世时间，你应该能在日志中看到区块生成的消息

!!! note "[协调器]：启动后清理"

    从 `docker-compose.yml` 配置文件中移除创世阶段专用的变量，以切换至正常运行模式。

    如需更多支持，请参阅[快速入门指南](https://gonka.ai/host/quickstart)或加入[社区 Discord](https://discord.com/invite/RADwCT2U6R)。
