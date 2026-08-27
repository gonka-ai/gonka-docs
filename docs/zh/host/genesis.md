# Gonka 创世仪式

创世仪式是一个协调过程，用于使用预定义的初始验证者集和商定的 `genesis.json` 文件引导 Gonka 区块链。该仪式至关重要，因为它建立了网络的基础安全、确保验证者之间的公平参与，并为区块链创建了一个可验证的起点。

## 概述

该仪式是一个完全通过 GitHub 拉取请求（PR）管理的透明且可审计的过程。核心工作流程很简单：

- 主机（验证者）通过 PR 提交信息和离线交易文件（`GENTX` 和 `GENPARTICIPANT`）
- 协调者聚合并验证这些输入，发布最终商定的 `genesis.json` 文件，包含预定的 `genesis_time` 和记录的哈希值。
- 验证者验证文件是否正确生成，并启动其节点

该仪式通过明确定义的阶段进行，以生成可审计的共享 `genesis.json`。所有协作均通过 GitHub PR 进行，以确保完全透明和可追溯性。


??? note "创世仪式的关键原则"

    | 原则 | 描述 |
    |-----------|-------------|
    | **透明性与可审计性** | 通过 GitHub PR 进行所有提交，创建了从开始到结束的完整公开、可验证记录。 |
    | **去中心化启动** | 该仪式确保网络从一组经过商定的独立验证者开始，从创世区块起建立去中心化。 |
    | **可验证状态** | 最终 `genesis.json` 的哈希值被记录，使每个主机都能确认他们从完全相同的初始状态启动。 |
    | **共识** | 该流程确保所有初始验证者在网路上线前审查并接受创世状态。 |

## 前提条件

在参与仪式之前，每个主机（验证者）必须：

1. 将 [Gonka 仓库](https://github.com/gonka-ai/gonka/) 分叉到您的 GitHub 账户。

2. 选择一个主机（验证者）名称并创建您的验证者目录：
   ```bash
   cp -r genesis/validators/template genesis/validators/<YOUR_VALIDATOR_NAME>
   ```
   该目录将用于在仪式期间共享信息和交易。

3. 遵循快速入门指南中的本地设置部分。

    - 在仪式开始前，您必须完成 [Gonka 快速入门](https://gonka.ai/host/quickstart) 指南中描述的本地机器设置。这包括安装 `inferenced` CLI、创建您的账户冷密钥，以及拉取 Docker 镜像。
    - 拉取镜像后停止，不要启动服务；仪式流程将用离线、基于 PR 的工作流替代服务器端设置和链上交易。

4. 确认就绪：

    - `inferenced` CLI 已本地安装，您的账户冷密钥已创建。
    - 容器已拉取，模型已下载，环境变量（`config.env`）已配置。



## 仪式流程

该仪式遵循五个阶段，用离线、基于 PR 的工作流替代 `quickstart.md` 中的链上注册步骤。所有交易文件均在本地生成，并提交给协调者进行聚合。

- **第一阶段 [验证者]**：准备密钥和初始服务器设置；打开包含验证者信息（包括节点 ID、ML 运营地址和共识公钥）的 PR
- **第二阶段 [协调者]**：聚合验证者信息并发布 `genesis.json` 草稿供审查
- **第三阶段 [验证者]**：从草稿生成离线 `GENTX` 和 `GENPARTICIPANT` 文件；打开包含文件的 PR
- **第四阶段 [协调者]**：验证并收集交易，修补 `genesis.json`，设置 `genesis_time`
- **第五阶段 [验证者]**：获取最终 `genesis.json`，验证哈希，并在 `genesis_time` 前启动节点

### 部署脚本

为简化流程，仪式的部署脚本将位于 [Gonka 仓库](https://github.com/gonka-ai/gonka/) 的 [/deploy/join](/deploy/join) 目录中。  
部署脚本与 `quickstart.md` 中的标准加入流程相同。在仪式期间，协调者将调整以下环境变量以启用创世特定行为：

- `INIT_ONLY` — 初始化数据目录并准备配置，但不启动完整堆栈
- `GENESIS_SEEDS` — 启动时用于初始P2P连接的种子节点地址列表
- `IS_GENESIS` — 切换仅创世路径（例如哈希验证、引导行为）在compose/scripts中

位置：这些变量由Coordinator在`deploy/join/docker-compose.yml`中设置。验证者不应更改它们。

一旦**第5阶段**完成且链已启动，Coordinator将从仓库中移除上述变量，因为它们不再需要。

工作目录：从`deploy/join`运行所有`docker compose`命令（先更改目录），或在从仓库根目录运行时显式传递`-f deploy/join/docker-compose.yml`。

### 第1阶段。[验证者]：准备密钥和初始服务器设置

本阶段复制`quickstart.md`中的密钥生成步骤，但所有设置均在离线状态下执行，以生成仪式所需的文件。账户密钥（冷）已在快速入门期间创建；以下步骤将指导您在服务器上生成ML操作密钥（温）。

#### 1.1 [本地] 确认账户冷密钥（来自快速入门）
账户冷密钥在`quickstart.md`期间创建。您可以使用以下命令查看其信息：
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

#### 1.2 [服务器]：初始化节点并获取节点ID
```bash
docker compose run --rm node
```

**示例输出：**
```
51a9df752b60f565fe061a115b6494782447dc1f
```


#### 1.3 [服务器]：提取共识公钥
启动`tmkms`服务以生成共识密钥，然后提取公钥。
```bash
docker compose up -d tmkms && docker compose run --rm --entrypoint /bin/sh tmkms -c "tmkms-pubkey"
```

**示例输出：**
```
/wTVavYr5OCiVssIT3Gc5nsfIH0lP1Rqn/zeQtq4CvQ=
```

#### 1.4 [服务器]：生成ML操作密钥

使用`file`密钥环后端在`api`容器内创建温密钥（需用于程序化访问）。密钥将存储在映射到容器`/root/.inference`的持久卷中：

注意：`$KEY_NAME`和`$KEYRING_PASSWORD`在快速入门`config.env`中定义。
```bash
docker compose run --rm --no-deps -it api /bin/sh
```

在容器内创建ML操作密钥：
```bash
printf '%s\n%s\n' "$KEYRING_PASSWORD" "$KEYRING_PASSWORD" | inferenced keys add "$KEY_NAME" --keyring-backend file
```

**示例输出：**
```
~ # printf '%s\n%s\n' "$KEYRING_PASSWORD" "$KEYRING_PASSWORD" | inferenced keys add "$KEY_NAME" --keyring-backend file

- address: gonka1gyz2agg5yx49gy2z4qpsz9826t6s9xev6tkehw
  name: node-702105
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"Ao8VPh5U5XQBcJ6qxAIwBbhF/3UPZEwzZ9H/qbIA6ipj"}'
  type: local


**Important** write this mnemonic phrase in a safe place.
It is the only way to recover your account if you ever forget your password.

again plastic athlete arrow first measure danger drastic wolf coyote work memory already inmate sorry path tackle custom write result west tray rabbit jeans
```

#### 1.5 [本地]：准备包含验证者信息的PR
使用以下字段创建或更新`genesis/validators/<YOUR_VALIDATOR_NAME>/README.md`。使用上述收集的值和快速入门中的值。

```markdown
Account Public Key: <value of ACCOUNT_PUBKEY from your config.env file>
Node ID: <node-id-from-step-1.2>
ML Operational Address: <ml-operational-key-address-from-step-1.4>
Consensus Public Key: <consensus-pubkey-from-step-1.3>
P2P_EXTERNAL_ADDRESS: <value of P2P_EXTERNAL_ADDRESS from your config.env file>
```

#### 1.6 创建拉取请求

向[Gonka仓库](https://github.com/gonka-ai/gonka/)提交包含您验证者信息的PR。请使用清晰的标题，例如“添加验证者：<YOUR_VALIDATOR_NAME>”，并确保您的`README.md`文件中所有必需字段均已填满。

### 第2阶段。[协调者]：创世草案准备

协调者将：

- 审查并合并第1阶段的所有验证者PR
- 准备初始`genesis.json`草案，其中包含所有账户地址，并将其放置在`genesis/genesis-draft.json`中
- 向所有主机公告草案的可用性

### 第3阶段。[验证者]：`GENTX`和`GENPARTICIPANT`生成

本阶段涉及生成链初始化所需的交易文件。这些交易包括：

- `MsgCreateValidator` - 在链上创建您的验证者
- `MsgSubmitNewParticipant` - 将您的节点注册为网络主机

`gentx`命令需要以下来自前几步的变量：

| **变量** | **描述** |
|----------|-------------|
| `<cold_key_name>` | 本地注册表中的账户冷密钥名称（例如，来自快速入门的"gonka-account-key"） |
| `<YOUR_VALIDATOR_NAME>` | 在前提条件部分选择的验证者名称 |
| `<ml-operational-key-address-from-step-1.4>` | 来自步骤1.4的ML操作密钥地址 |
| `$PUBLIC_URL` | 来自快速入门`config.env`的公共URL的环境变量 |
| `<consensus-pubkey-from-step-1.3>` | 步骤 1.3 中的共识公钥 |
| `<node-id-from-step-1.2>` | 步骤 1.2 中的节点 ID |

此自定义 `gentx` 命令会自动从您的账户密钥向您的 ML 运行密钥创建所需的 `authz` 授权，简化设置过程。

在生成文件之前，您必须将草稿 `genesis/genesis-draft.json` 复制到存储您的账户冷密钥的 `config` 目录中。这将使 `gentx` 命令能够访问您的密钥并根据正确的链配置验证交易。

`inferenced` 的默认主目录是 `~/.inference`。如果您在此处创建了密钥，请使用以下命令：

```bash
cp ./genesis/genesis-draft.json ~/.inference/config/genesis.json
```

!!! note 
    如果在创建密钥时使用 `--home` 标志指定了自定义主目录，请在使用 `gentx` 命令时再次提供 `--home` 标志以使用相同的目录。

#### [本地]：创建 GENTX 和 GENPARTICIPANT 文件

`1ngonka` 值表示创世交易的人为共识权重。实际验证者权重将在第一个计算证明（PoC）阶段确定。

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

- 使用以下文件创建 PR：

    - `genesis/validators/<YOUR_VALIDATOR_NAME>/gentx-<node-id-from-step-1.2>.json`
    - `genesis/validators/<YOUR_VALIDATOR_NAME>/genparticipant-<node-id-from-step-1.2>.json`

使用清晰的 PR 标题，例如：“为验证者：<YOUR_VALIDATOR_NAME> 添加 gentx 文件”。


### 阶段 4. [协调者]：最终创世准备

一旦所有验证者提交了其交易文件，协调者将开始构建官方 `genesis.json`。此关键步骤确保所有初始参与者在区块链的第一个区块中被正确包含。

该过程涉及两个主要命令：

1.  收集创世交易：`collect-gentxs` 命令收集所有 `gentx-<node-id>.json` 文件，验证它们并将它们整合到 `genesis.json` 中以填充初始验证者集合。
2.  修补参与者数据：`patch-genesis` 命令处理 `genparticipant-<node-id>.json` 文件，验证其签名并将初始状态修补为包含所有注册参与者。

合并所有交易后，协调者将 `genesis_time` 设置为未来的时间戳，以确保所有验证者有足够时间准备同步启动。

最后，协调者将官方 `genesis.json` 提交到 `genesis/` 目录。此提交的哈希值随后嵌入源代码中，以确保所有节点从相同的已验证状态启动。

#### 4.1 [协调者]：收集创世交易

```bash
./inferenced genesis collect-gentxs --gentx-dir gentxs
```

#### 4.2 [协调者]：处理参与者注册

```bash
./inferenced genesis patch-genesis --genparticipant-dir genparticipants
```

#### 4.3 [协调者]：配置网络种子

协调者通过在 `deploy/join/docker-compose.yml` 中设置 `GENESIS_SEEDS` 变量来配置初始网络对等连接。此变量是验证者节点地址的逗号分隔列表，使用每个验证者在其各自的 `README.md` 文件中提供的 `Node ID` 和 `P2P_EXTERNAL_ADDRESS` 构建。

示例格式：`<node-id-1>@<P2P_EXTERNAL_ADDRESS_1>,<node-id-2>@<P2P_EXTERNAL_ADDRESS_2>,...`

此外，协调者将 `INIT_ONLY` 设置为 `false`，这使得节点在启动时能够完全启动并连接到网络，而不仅仅是初始化其数据目录。

### 阶段 5. [验证者]：链启动

在发布最终 `genesis.json` 后，验证者必须验证其生成是否正确，并准备在指定的 `genesis_time` 启动节点。区块链将在这一确切时刻开始生成区块。

#### 5.1 [服务器]：更新并启动

这些步骤应在您的验证者服务器上执行。

-  **拉取最新配置**

从仓库拉取最新更改，以获取最终 `genesis.json` 和种子节点配置。
    ```bash
    git pull
    ```

-  **更新容器镜像**

从 `deploy/join` 目录中拉取最新的 Docker 容器镜像。节点镜像使用最终的创世哈希进行构建以供验证。
    ```bash
    source config.env
    docker compose -f docker-compose.yml -f docker-compose.mlnode.yml pull
    ```

-  **启动您的验证节点**

最后，启动所有服务。
    ```bash
    docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d
    ```

#### 5.2 [服务器]：验证启动状态

启动后，监控节点日志以确认其正在等待创世时间：

```bash
docker compose logs node -f
```

查找类似以下的消息：
```
INF Genesis time is in the future. Sleeping until then... genTime=2025-08-14T09:13:39Z module=server
```

!!! note "重要提示"

    - 在 `node` 容器完全就绪之前，`api` 容器可能会重启多次
    - 一旦创世时间过去，您应该在日志中看到区块生成消息

!!! note "[协调器]：启动后清理"

    从 `docker-compose.yml` 配置文件中移除创世专用变量，以过渡到正常操作模式。

    如需更多支持，请参阅 [快速入门指南](https://gonka.ai/host/quickstart) 或加入 [社区 Discord](https://discord.gg/REcpeYc7P7)。
