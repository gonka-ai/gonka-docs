# Gonka 创世仪式

创世仪式是一个协调过程，用于使用预定义的初始验证者集合和商定的 `genesis.json` 文件来引导 Gonka 区块链。这个仪式很重要，因为它建立了网络的基础安全，确保验证者之间的公平参与，并为区块链创建了一个可验证的起点。

## 概述

仪式是一个透明且可审计的过程，完全通过 GitHub Pull Requests（PR）管理。核心工作流程很简单：

- 主机（验证者）通过 PR 提交信息和离线交易文件（`GENTX` 和 `GENPARTICIPANT`）
- 协调者聚合并验证这些输入，发布最终的、商定的 `genesis.json`，包含预定的 `genesis_time` 和记录的哈希值。
- 验证者验证文件是否正确生成并启动其节点

仪式通过明确定义的阶段进行，以产生可审计的、共享的 `genesis.json`。所有协作都通过 GitHub PR 进行，以确保完全透明和问责。

??? note "创世仪式的关键原则"

    | 原则 | 描述 |
    |-----------|-------------|
    | **透明度和可审计性** | 使用 GitHub PR 进行所有提交，创建从开始到结束的整个过程的公开、可验证记录。 |
    | **去中心化启动** | 仪式确保网络以商定的独立验证者集合开始，从区块零开始建立去中心化。 |
    | **可验证状态** | 记录最终的 `genesis.json` 哈希，允许每个主机确认他们从完全相同的初始状态开始。 |
    | **共识** | 该过程保证所有初始验证者在网络上线前已审查并接受创世状态。 |

## 先决条件

在参与仪式之前，每个主机（验证者）必须：

1. Fork [Gonka 仓库](https://github.com/gonka-ai/gonka/) 到你的 GitHub 账户。

2. 选择一个主机（验证者）名称并创建你的验证者目录：
   ```bash
   cp -r genesis/validators/template genesis/validators/<YOUR_VALIDATOR_NAME>
   ```
   此目录将用于在仪式期间共享信息和交易。

3. 遵循快速开始指南的本地设置部分。
  
    - 在仪式之前，你必须完成 [Gonka 快速开始](https://gonka.ai/host/quickstart) 指南中描述的本地机器设置。这包括安装 `inferenced` CLI、创建你的账户冷密钥和拉取 Docker 镜像。
    - 在拉取镜像后停止，不要启动服务；仪式过程用离线、基于 PR 的工作流程替换服务器端设置和链上交易。

4. 确认准备就绪：

    - `inferenced` CLI 已本地安装，你的账户冷密钥已创建。
    - 容器已拉取，模型已下载，环境变量（`config.env`）已配置。



## 仪式流程

仪式遵循 5 阶段流程，用离线、基于 PR 的工作流程替换 `quickstart.md` 中的链上注册步骤。所有交易文件都在本地生成并提交给协调者进行聚合。

- **阶段 1 [验证者]**：准备密钥和初始服务器设置；打开包含验证者信息的 PR（包括节点 ID、ML 运营地址和共识公钥）
- **阶段 2 [协调者]**：聚合验证者信息并发布 `genesis.json` 草案供审查
- **阶段 3 [验证者]**：从草案生成离线 `GENTX` 和 `GENPARTICIPANT` 文件；打开包含文件的 PR
- **阶段 4 [协调者]**：验证并收集交易，修补 `genesis.json`，设置 `genesis_time`
- **阶段 5 [验证者]**：检索最终 `genesis.json`，验证哈希，并在 `genesis_time` 之前启动节点

### 部署脚本

为了简化过程，仪式的部署脚本将在 [Gonka 仓库](https://github.com/gonka-ai/gonka/) 的 [/deploy/join](/deploy/join) 目录中。
部署脚本与 `quickstart.md` 中的标准加入流程相同。在仪式期间，协调者将调整以下环境变量以启用创世特定行为：

- `INIT_ONLY` — 初始化数据目录并准备配置，而不启动完整堆栈
- `GENESIS_SEEDS` — 启动时用于初始 P2P 连接的种子节点地址列表
- `IS_GENESIS` — 在 compose/scripts 中切换仅创世路径（例如，哈希验证、引导行为）

位置：这些变量由协调者在 `deploy/join/docker-compose.yml` 中设置。验证者不应更改它们。

一旦**阶段 5** 完成且链已启动，协调者将从仓库中删除上述变量，因为它们不再需要。

工作目录：从 `deploy/join` 运行所有 `docker compose` 命令（首先更改目录），或在从仓库根目录运行时显式传递 `-f deploy/join/docker-compose.yml`。

### 阶段 1. [验证者]：准备密钥和初始服务器设置

此阶段镜像 `quickstart.md` 中的密钥生成步骤，但所有设置都在离线状态下执行以生成仪式文件。账户密钥（冷）已在快速开始期间创建；以下步骤将指导你在服务器上生成 ML 运营密钥（热）。

#### 1.1 [本地] 确认账户冷密钥（来自快速开始）
账户冷密钥在 `quickstart.md` 期间创建。你可以使用以下命令查看其信息：
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

#### 1.4 [服务器]：生成 ML 运营密钥

在 `api` 容器内使用 `file` 密钥环后端创建热密钥（程序化访问需要）。密钥将存储在映射到容器 `/root/.inference` 的持久卷中：

注意：`$KEY_NAME` 和 `$KEYRING_PASSWORD` 在快速开始 `config.env` 中定义。
```bash
docker compose run --rm --no-deps -it api /bin/sh
```

在容器内，创建 ML 运营密钥：
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


**重要** 将此助记词短语写在安全的地方。
如果你忘记密码，这是恢复账户的唯一方法。

again plastic athlete arrow first measure danger drastic wolf coyote work memory already inmate sorry path tackle custom write result west tray rabbit jeans
```

#### 1.5 [本地]：准备包含验证者信息的 PR
创建或更新 `genesis/validators/<YOUR_VALIDATOR_NAME>/README.md`，包含以下字段。使用从上述步骤和快速开始收集的值。

```markdown
Account Public Key: <value of ACCOUNT_PUBKEY from your config.env file>
Node ID: <node-id-from-step-1.2>
ML Operational Address: <ml-operational-key-address-from-step-1.4>
Consensus Public Key: <consensus-pubkey-from-step-1.3>
P2P_EXTERNAL_ADDRESS: <value of P2P_EXTERNAL_ADDRESS from your config.env file>
```

#### 1.6 创建 Pull Request

向 [Gonka 仓库](https://github.com/gonka-ai/gonka/) 提交包含你验证者信息的 PR。包含清晰的标题，如"添加验证者：<YOUR_VALIDATOR_NAME>"，并确保你的 `README.md` 文件中填充了所有必需字段。

### 阶段 2. [协调者]：创世草案准备

协调者将：

- 审查并合并阶段 1 的所有验证者 PR
- 准备初始 `genesis.json` 草案，包括所有账户地址，并将其放置在 `genesis/genesis-draft.json` 中
- 向所有主机宣布草案的可用性

### 阶段 3. [验证者]：`GENTX` 和 `GENPARTICIPANT` 生成

此阶段涉及生成链初始化所需的交易文件。这些交易包括：

- `MsgCreateValidator` - 在链上创建你的验证者
- `MsgSubmitNewParticipant` - 将你的节点注册为网络主机

`gentx` 命令需要来自前面步骤的以下变量：

| **变量** | **描述** |
|----------|-------------|
| `<cold_key_name>` | 本地注册表中的账户冷密钥名称（例如，快速开始中的"gonka-account-key"） |
| `<YOUR_VALIDATOR_NAME>` | 在先决条件部分选择的验证者名称 |
| `<ml-operational-key-address-from-step-1.4>` | 步骤 1.4 中的 ML 运营密钥地址 |
| `$PUBLIC_URL` | 来自快速开始 `config.env` 的环境变量，包含公共 URL |
| `<consensus-pubkey-from-step-1.3>` | 步骤 1.3 中的共识公钥 |
| `<node-id-from-step-1.2>` | 步骤 1.2 中的节点 ID |

此自定义 `gentx` 命令自动创建从你的账户密钥到你的 ML 运营密钥所需的 `authz` 授权，简化了设置过程。

在生成文件之前，你必须将草案 `genesis/genesis-draft.json` 复制到存储你账户冷密钥的 `config` 目录中。这允许 `gentx` 命令访问你的密钥并针对正确的链配置验证交易。

`inferenced` 的默认主目录是 `~/.inference`。如果你在那里创建了密钥，请使用以下命令：

```bash
cp ./genesis/genesis-draft.json ~/.inference/config/genesis.json
```

!!! note 
    如果你在创建密钥时使用 `--home` 标志指定了自定义主目录，请确保通过再次提供 `--home` 标志在 `gentx` 命令中使用相同的目录。

#### [本地]：创建 GENTX 和 GENPARTICIPANT 文件

`1ngonka` 值表示创世交易的人工共识权重。真正的验证者权重将在第一个计算证明（PoC）阶段确定。

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

将生成的文件复制到你的验证者目录并创建 PR：

- 将文件复制到你的验证者目录：

   ```bash
   cp ~/.inference/config/gentx/gentx-<node-id>.json genesis/validators/<YOUR_VALIDATOR_NAME>/
   cp ~/.inference/config/genparticipant/genparticipant-<node-id>.json genesis/validators/<YOUR_VALIDATOR_NAME>/
   ```

- 创建包含以下文件的 PR：

    - `genesis/validators/<YOUR_VALIDATOR_NAME>/gentx-<node-id-from-step-1.2>.json`
    - `genesis/validators/<YOUR_VALIDATOR_NAME>/genparticipant-<node-id-from-step-1.2>.json`

使用清晰的 PR 标题，如"为验证者添加 gentx 文件：<YOUR_VALIDATOR_NAME>"。


### 阶段 4. [协调者]：最终创世准备

一旦所有验证者都提交了他们的交易文件，协调者开始构建官方的 `genesis.json`。这个关键步骤确保所有初始参与者都正确包含在区块链的状态中，从第一个区块开始。

该过程涉及两个主要命令：

1.  收集创世交易：`collect-gentxs` 命令收集所有 `gentx-<node-id>.json` 文件，验证它们，并将它们合并到 `genesis.json` 中以填充初始验证者集合。
2.  修补参与者数据：`patch-genesis` 命令处理 `genparticipant-<node-id>.json` 文件，验证它们的签名并修补初始状态以包含所有注册的参与者。

合并所有交易后，协调者将 `genesis_time` 设置为未来的时间戳，确保所有验证者有足够的时间准备同步启动。

最后，协调者将官方的 `genesis.json` 提交到 `genesis/` 目录。然后将此提交的哈希嵌入源代码中，以确保所有节点从相同的验证状态开始。

#### 4.1 [协调者]：收集创世交易

```bash
./inferenced genesis collect-gentxs --gentx-dir gentxs
```

#### 4.2 [协调者]：处理参与者注册

```bash
./inferenced genesis patch-genesis --genparticipant-dir genparticipants
```

#### 4.3 [协调者]：配置网络种子

协调者通过在 `deploy/join/docker-compose.yml` 中设置 `GENESIS_SEEDS` 变量来配置初始网络对等连接。此变量是验证者节点地址的逗号分隔列表，使用每个验证者在各自 `README.md` 文件中提供的 `Node ID` 和 `P2P_EXTERNAL_ADDRESS` 构建。

示例格式：`<node-id-1>@<P2P_EXTERNAL_ADDRESS_1>,<node-id-2>@<P2P_EXTERNAL_ADDRESS_2>,...`

此外，协调者将 `INIT_ONLY` 设置为 `false`，这允许节点在启动时完全启动并连接到网络，而不是仅初始化其数据目录。

### 阶段 5. [验证者]：链启动

随着最终 `genesis.json` 的发布，验证者必须验证它是否正确生成，并准备他们的节点在指定的 `genesis_time` 启动。区块链将在此刻开始产生区块。

#### 5.1 [服务器]：更新和启动

这些步骤应在你的验证者服务器上执行。

-  **拉取最新配置**

    从仓库拉取最新更改以获取最终的 `genesis.json` 和种子节点配置。
    ```bash
    git pull
    ```

-  **更新容器镜像**

    从 `deploy/join` 目录拉取最新的 Docker 容器镜像。节点镜像使用最终创世哈希构建以进行验证。
    ```bash
    source config.env
    docker compose -f docker-compose.yml -f docker-compose.mlnode.yml pull
    ```

-  **启动你的验证者**

    最后，启动所有服务。
    ```bash
    docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d
    ```

#### 5.2 [服务器]：验证启动状态

启动后，监控你的节点日志以确认它正在等待创世时间：

```bash
docker compose logs node -f
```

寻找类似这样的消息：
```
INF Genesis time is in the future. Sleeping until then... genTime=2025-08-14T09:13:39Z module=server
```

!!! note "重要注意事项"

    - `api` 容器可能在 `node` 容器完全运行之前重启几次
    - 一旦创世时间过去，你应该在日志中看到区块生产消息

!!! note "[协调者]：启动后清理"

    从 `docker-compose.yml` 配置文件中删除创世特定变量，以过渡到正常操作模式。

如需额外支持，请参阅[快速开始指南](https://gonka.ai/host/quickstart)或加入[社区 Discord](https://discord.com/invite/RADwCT2U6R)。
