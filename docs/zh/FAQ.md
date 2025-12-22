# 常见问题（FAQ）

## 概述

### 什么是 Gonka？
Gonka 是一个去中心化的高效 AI 计算网络——由运行它的人共同运行。它作为中心化云服务的成本效益和高效替代方案，用于 AI 模型训练和推理。作为一个协议，它不是公司或初创企业。
    
### 什么是 GNK 代币？
GNK 是 Gonka 网络的原生代币。它用于激励参与者、为资源定价，并确保网络的可持续增长。

### 我可以购买 GNK 代币吗？

不可以，您目前无法在交易所购买 GNK，因为该代币尚未上市。
请关注 [Twitter](https://x.com/gonka_ai) 上的官方公告，了解有关上市的任何更新。

但是，目前有两种在上市前获得 GNK 的合法方式：

- [作为主机挖矿](https://gonka.ai/zh/host/quickstart/) — 通过向网络贡献计算资源，GNK 已经可以被铸造。
- 参与[赏金计划](https://discord.com/invite/RADwCT2U6R) — 某些任务、贡献或社区活动可能会授予 GNK 奖励。

!!! note "重要"
	请注意，目前存在虚假的 GNK 上线信息和页面，包括在 CoinGecko 和 CoinMarketCap 上。 这些页面并不代表官方的 GNK 代币，也与项目方没有任何关联。 目前 GNK 尚未在任何交易所上线或可交易。 任何声称是 GNK 的代币，无论是在 Solana 还是其他网络上，都不是官方的 GNK 资产。请务必通过官方渠道核实所有相关信息。

### 协议为何高效？
我们与"大玩家"的区别在于定价，以及无论用户规模大小，推理都会被公平分配这一事实。要了解更多信息，请查看[白皮书](https://gonka.ai/whitepaper.pdf)。
    
### 网络如何运作？
网络的运作是协作性的，取决于您希望扮演的角色：

- 作为[开发者](https://gonka.ai/zh/developer/quickstart/)：您可以使用网络的计算资源来构建和部署您的 AI 应用程序。
- 作为[主机](https://gonka.ai/zh/host/quickstart/)：您可以贡献您的计算资源来为网络提供动力。协议旨在奖励您的贡献，确保网络的连续性和主权。

### 这份文档是否详尽？

不是。这份文档涵盖了协议的主要概念、标准工作流程和最常见的操作场景，但它并不代表代码库的完整行为或实现细节。代码包括此处未描述的额外逻辑、交互和边缘情况。

因为 Gonka 是一个开源和去中心化的网络，各种参数、机制和治理驱动的行为可能通过链上投票和社区决策而演变。某些细节可能在发布后发生变化，并非所有边缘情况或未来更新都可能立即反映。

对于主机、开发者和贡献者来说，代码本身是最终的真相来源。如果本文档与代码之间出现任何差异，代码始终优先。

鼓励参与者查看相关仓库、治理提案和网络更新，以确保他们的理解与协议的当前状态一致。

### 贡献计算资源的激励是什么？
我们创建了一份专门关注[代币经济学](https://gonka.ai/tokenomics.pdf)的文档，您可以在其中找到有关激励如何衡量的所有信息。
    
### 硬件要求是什么？
您可以在文档中清楚地找到最低和推荐的[硬件规格](https://gonka.ai/zh/host/hardware-specifications/)。您应该查看此部分，以确保您的硬件满足有效贡献的要求。

### 我可以使用哪些钱包来存储 GNK 代币？
您可以在 Cosmos 生态系统中的几个支持的钱包中存储 GNK 代币：

- [Keplr](https://www.keplr.app/)
- [Leap Wallet](https://www.leapwallet.io/)
- `inferenced` CLI - 用于 Gonka 中本地账户管理和网络操作的命令行工具。

### 我在哪里可以找到有关 Gonka 的有用信息？

以下是了解 Gonka 生态系统最重要的资源：

- [gonka.ai](https://gonka.ai/) — 项目信息和生态系统概述的主要入口点。
- [白皮书](https://gonka.ai/whitepaper.pdf) — 描述架构、共识模型、计算证明等的技术文档。
- [代币经济学](https://gonka.ai/tokenomics.pdf) — 项目代币经济学概述，包括供应、分配、激励和经济设计。
- [GitHub](https://github.com/gonka-ai/gonka/) — 访问项目的源代码、仓库、开发活动和开源贡献。
- [Discord](https://discord.com/invite/RADwCT2U6R) — 社区讨论、公告和技术支持的主要场所。
- [X (Twitter)](https://x.com/gonka_ai) — 新闻、更新和公告。

## 代币经济学

### Gonka 中的治理权重如何计算？
Gonka 使用 PoC 加权投票模型：

- 计算证明（PoC）：投票权重与您经过验证的计算贡献成正比。
- 抵押承诺：
    - PoC 衍生的投票权重的 20% 会自动激活。
    - 要解锁剩余的 80%，您必须锁定 GNK 代币作为抵押。
- 这确保了治理影响力反映真实的计算工作 + 经济抵押。

在前 180 个 epoch（约 6 个月）内，新参与者可以仅通过 PoC 参与治理并获得投票权重，无需抵押要求。在此期间，完整的治理权利可用，而投票权重仍然与经过验证的计算活动相关。

### 为什么 Gonka 需要锁定 GNK 代币才能获得治理权重？
投票权重从不仅来自持有代币。GNK 代币作为经济抵押，而不是影响力的来源。影响力通过持续的计算贡献获得，而锁定 GNK 抵押是确保参与治理和执行问责制所必需的。

## 治理

### 哪些类型的更改需要治理提案？
任何影响网络的链上更改都需要治理提案，例如：

- 更新模块参数（`MsgUpdateParams`）
- 执行软件升级
- 添加、更新或弃用推理模型
- 任何其他必须通过治理模块批准和执行的操作

### 谁可以创建治理提案？
任何拥有有效治理密钥（冷账户）的人都可以支付所需费用并创建治理提案。但是，每个提案仍必须通过 PoC 加权投票由活跃参与者批准。鼓励提案者在链下首先讨论重大更改（例如，通过 [GitHub](https://github.com/gonka-ai) 或[社区论坛](https://discord.com/invite/RADwCT2U6R)）以增加批准的可能性。请参阅[完整指南](https://gonka.ai/zh/transactions-and-governance/)。

### 如果提案失败会发生什么？
- 如果提案未达到法定人数 → 自动失败
- 如果多数投票 `no` → 提案被拒绝，不进行链上更改
- 如果显著百分比投票 `no_with_veto`（超过否决阈值）→ 提案被拒绝并标记，表示强烈的社区分歧
- 押金可能会或可能不会退还，取决于链设置

### 治理参数本身可以更改吗？
可以。所有关键的治理规则——法定人数、多数阈值和否决阈值——都是链上可配置的，可以通过治理提案进行更新。这允许网络随着参与模式和计算经济的变化而演进决策规则。

## 改进提案

### 治理提案和改进提案之间有什么区别？
治理提案 → 链上提案。用于直接影响网络并需要链上投票的更改。示例：

- 更新网络参数（`MsgUpdateParams`）
- 执行软件升级
- 添加新模型或功能
- 任何需要由治理模块执行的修改

改进提案 → 由活跃参与者控制的链下提案。用于制定长期路线图、讨论新想法并协调更大的战略更改。

- 作为 Markdown 文件在 [/proposals](https://github.com/gonka-ai/gonka/tree/main/proposals) 目录中管理
- 通过 GitHub Pull Request 进行审查和讨论
- 批准的提案合并到仓库中

### 如何审查和批准改进提案？
- 在 [/proposals](https://github.com/gonka-ai/gonka/tree/main/proposals) 文件夹中创建 Markdown 提案。
- 为您的提案打开 Pull Request。
- 社区审查：
      - 活跃贡献者和维护者在 PR 线程中讨论提案。
      - 公开讨论反馈、建议和改进。
- 批准和合并：
      - 如果社区同意，PR 将被合并。
      - 批准的提案成为官方社区路线图的一部分。

### 改进提案会导致治理提案吗？
是的。通常，改进提案用于在起草治理提案之前探索想法并收集共识。例如：

- 您可能首先将新模型集成作为改进提案提出。
- 社区同意后，创建链上治理提案以更新参数或触发软件升级。

## 投票 

### 投票流程如何工作？
- 一旦提案被提交并用最低押金资助，它进入投票期
- 投票选项：`yes`、`no`、`no_with_veto`、`abstain`
  
    - `yes` → 批准提案
    - `no` → 拒绝提案
    - `no_with_veto` → 拒绝并发出强烈反对信号
    - `abstain` → 既不批准也不拒绝，但计入法定人数
   
- 您可以在投票期内的任何时候更改投票；只计算您的最后一次投票
- 如果达到法定人数和阈值，提案通过并通过治理模块自动执行
  
要投票，您可以使用下面的命令。此示例投票 yes，但您可以用您首选的选项替换它（`yes`、`no`、`no_with_veto`、`abstain`）：
```
./inferenced tx gov vote 2 yes \
      --from <cold_key_name> \
      --keyring-backend file \
      --unordered \
      --timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
      --node $NODE_URL/chain-rpc/ \
      --chain-id gonka-mainnet \
      --yes
```

### 如何跟踪治理提案的状态？
您可以使用 CLI 随时查询提案状态：
```
export NODE_URL=http://47.236.19.22:18000
./inferenced query gov tally 2 -o json --node $NODE_URL/chain-rpc/
```

## 运行节点

### 如果我想停止挖矿但仍在我回来时使用我的账户怎么办？
要在将来恢复网络节点，备份以下内容就足够了：

- 冷密钥（最重要，其他都可以轮换）
- tmkms 的机密：`.tmkms/secrets/`
- 来自 `.inference .inference/keyring-file/` 的密钥环
- 来自 `.inference/config .inference/config/node_key.json` 的节点密钥
- 热密钥的密码 `KEYRING_PASSWORD`

### 我的节点被监禁了。这意味着什么？
您的验证者被监禁是因为它在最近 100 个区块中签名的区块少于 50 个（要求计算该窗口内签名的区块总数，而不是连续的）。这意味着您的节点被暂时排除（约 15 分钟）在区块生产之外，以保护网络稳定性。
这可能有几个原因：

- **共识密钥不匹配**。您的节点使用的共识密钥可能与链上为您的验证者注册的密钥不同。确保您使用的共识密钥与链上为您的验证者注册的密钥匹配。
- **网络连接不稳定**。网络不稳定或中断可能会阻止您的节点达成共识，导致错过签名。确保您的节点具有稳定、低延迟的连接，并且不会被其他进程过载。

**奖励**：即使您的节点被监禁，只要它在推理或其他验证者相关工作中保持活跃，您仍将继续获得大部分作为主机的奖励。因此，除非检测到推理问题，否则奖励不会丢失。 

**如何解除监禁您的节点**：要恢复正常运行，请在问题解决后解除监禁您的验证者。使用您的冷密钥提交解除监禁交易：

```
export NODE_URL=http://<NODE_URL>:<port>
 ./inferenced tx slashing unjail \
    --from <cold_key_name> \
    --keyring-backend file \
    --chain-id gonka-mainnet \
    --gas auto \
    --gas-adjustment 1.5 \
    --fees 200000ngonka \
    --node $NODE_URL/chain-rpc/
```
然后，检查节点是否已解除监禁：
```
 ./inferenced query staking delegator-validators \
    <cold_key_addr> \
    --node $NODE_URL/chain-rpc/
```
当节点被监禁时，它显示 `jailed: true`。

### 如何停用旧集群？

按照本指南安全地关闭旧集群，而不会影响声誉。

1) 使用以下命令禁用每个 ML 节点：
    
```
curl -X POST http://localhost:9200/admin/v1/nodes/<id>/disable
```

您可以使用以下命令列出所有节点 ID：

```
curl http://localhost:9200/admin/v1/nodes | jq '.[].node.id'
```

2) 未安排在下一个计算证明（PoC）期间提供推理的节点将在该 PoC 期间自动停止。
被安排提供推理的节点将在停止前再保持活跃一个 epoch。您可以在以下位置的 mlnode 字段中验证节点的状态：

```
curl http://<inference_url>/v1/epochs/current/participants
```

一旦节点被标记为禁用，就可以安全地关闭 MLNode 服务器。

3) 在所有 MLNode 被禁用并关闭后，您可以关闭网络节点。在此之前，建议（但可选）备份以下文件：

- `.dapi/api-config.yaml`
- `.dapi/gonka.db`（链上升级后创建）
- `.inference/config/`
- `.inference/keyring-file/`
- `.tmkms/`

如果您跳过备份，稍后仍可以使用您的账户密钥恢复设置。

### 我的节点无法连接到 `config.env` 中指定的默认种子节点

如果您的节点无法连接到默认种子节点，只需通过更新 `config.env` 中的三个变量将其指向另一个节点。

1. `SEED_API_URL` - 种子节点的 HTTP 端点（用于 API 通信）。
   从下面的列表中选择任何 URL 并直接将其分配给 `SEED_API_URL`。
    ```
    export SEED_API_URL=<chosen_http_url>
    ```
    可用的创世 API URL：
    ```
    http://185.216.21.98:8000
    http://36.189.234.197:18026
    http://36.189.234.237:17241
    http://node1.gonka.ai:8000
    http://node2.gonka.ai:8000
    http://node3.gonka.ai:8000
    https://node4.gonka.ai
    http://47.236.26.199:8000
    http://47.236.19.22:18000
    http://gonka.spv.re:8000
    ```
2. `SEED_NODE_RPC_URL` - 同一种子节点的 RPC 端点。使用与 `SEED_API_URL` 相同的主机，但始终使用端口 26657。
    ```
    export SEED_NODE_RPC_URL=http://<host>:26657
    ```
    示例
    ```
    SEED_NODE_RPC_URL=http://node2.gonka.ai:26657
    ```
3. `SEED_NODE_P2P_URL` - 用于节点之间网络的 P2P 地址。
您必须从种子节点的状态端点获取 P2P 端口。

    查询节点：
    ```
    http://<host>:<http_port>/chain-rpc/status
    ```
    示例
    ```
    http://node3.gonka.ai:8000/chain-rpc/status
    ```
    在响应中找到 `listen_addr`，例如：
    ```
    ""listen_addr"": ""tcp://0.0.0.0:5000""
    ```
    
    使用此端口：
    ```
    export SEED_NODE_P2P_URL=tcp://<host>:<p2p_port>
    ```
    示例
    ```
    export SEED_NODE_P2P_URL=tcp://node3.gonka.ai:5000
    ```
    
    最终结果示例
    ```
    export SEED_API_URL=http://node2.gonka.ai:8000
    export SEED_NODE_RPC_URL=http://node2.gonka.ai:26657
    export SEED_NODE_P2P_URL=tcp://node2.gonka.ai:5000"
    ```

### 如何更改种子节点？

根据节点是否已经初始化，有两种不同的方式来更新种子节点。

=== "选项 1. 手动编辑种子节点（初始化后）"

    一旦创建了 `.node_initialized` 文件，系统就不再自动更新种子节点。
    在那之后：
    
    - 种子列表按原样使用
    - 任何更改都必须手动完成
    - 您可以添加任意数量的种子节点
    
    格式是单个逗号分隔的字符串：
    ```
    seeds = "<node1_id>@<node1_ip>:<node1_p2p_port>,<node2_id>@<node2_ip>:<node2_p2p_port>"
    ```
    要查看任何运行节点已知的对等节点，请使用链 RPC：
    ```
    curl http://47.236.26.199:8000/chain-rpc/net_info | jq
    ```

    在响应中，查找：
    
    - `listen_addr` -  P2P 端点
    - `rpc_addr` - RPC 端点
   
    示例： 

    ```
         % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                     Dload  Upload   Total   Spent    Left  Speed
    100 94098    0 94098    0     0  91935      0 --:--:--  0:00:01 --:--:-- 91982
    {
      "jsonrpc": "2.0",
      "id": -1,
      "result": {
        "listening": true,
        "listeners": [
          "Listener(@tcp://47.236.26.199:5000)"
        ],
        "n_peers": "50",
        "peers": [
          {
            "node_info": {
              "protocol_version": {
                "p2p": "8",
                "block": "11",
                "app": "0"
              },
              "id": "ce6f26b9508839c29e0bfd9e3e20e01ff4dda360",
              "listen_addr": "tcp://85.234.78.106:5000",
              "network": "gonka-mainnet",
              "version": "0.38.17",
              "channels": "40202122233038606100",
              "moniker": "my-node",
              "other": {
                "tx_index": "on",
                "rpc_address": "tcp://0.0.0.0:26657"
              }
            },
    ...
    ```

    这显示节点当前看到的所有对等节点。

=== "选项 2. 重新初始化节点（从环境自动应用种子）"

    如果您希望节点重新生成其配置并自动应用 `config.env` 中定义的种子节点，请使用此方法。
    ```
    source config.env
    docker compose down node
    sudo rm -rf .inference/data/ .inference/.node_initialized
    sudo mkdir -p .inference/data/
    ```
    重启节点后，它将像全新安装一样运行并重新创建其配置，包括来自环境变量的种子。
    要验证实际应用的种子：
    
    ```
    sudo cat .inference/config/config.toml
    ```
    查找字段：
    ```
    seeds = [...]
    ```

### 硬件、节点权重和 ML 节点配置实际上是如何验证的？

链**不**验证真实硬件。它只验证参与者总权重，这是用于权重分配和奖励计算的唯一值。 

此权重在 ML 节点之间的任何细分，以及任何"硬件类型"或其他描述性字段，都纯粹是信息性的，可以由主机自由修改。  

在创建或更新节点时（例如，通过 `POST http://localhost:9200/admin/v1/nodes`，如处理程序代码所示：[https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/server/admin/node_handlers.go#L62](https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/server/admin/node_handlers.go#L62)），可以显式指定硬件字段。如果省略，API 服务会尝试从 ML 节点自动检测硬件信息。 

在实践中，许多主机在代理 ML 节点后面运行多个服务器；自动检测只能看到其中一台服务器，这是一个完全有效的设置。无论配置如何，所有权重分配和奖励都仅依赖于主机总权重，而 ML 节点之间的内部拆分或报告的硬件类型永远不会影响链上验证。

## 密钥和安全
    
### 我在哪里可以找到密钥管理的信息？
您可以在文档中找到关于[密钥管理](https://gonka.ai/zh/host/key-management/)的专门部分。它概述了在网络上安全管理应用程序密钥的程序和最佳实践。

### 我清除了或覆盖了我的共识密钥

如果您使用 **tmkms** 并删除了 `.tmkms` 文件夹，只需重启 **tmkms** — 它会自动生成新密钥。
要注册新的共识密钥，请提交以下交易：
```
./inferenced tx inference submit-new-participant \
    <PUBLIC_URL> \
    --validator-key <CONSENSUS_KEY> \
    --keyring-backend file \
    --unordered \
    --from <COLD_KEY_NAME> \
    --timeout-duration 1m \
    --node http://<node-url>/chain-rpc/ \
    --chain-id gonka-mainnet
```

### 我删除了热密钥
在本地设备上备份**冷密钥**，在服务器外部。

1) 停止 API 容器：
    ```
    docker compose down api --no-deps
    ```

2) 在 `config.env` 文件中设置热密钥的 `KEY_NAME`。
   
3) [服务器]：重新创建热密钥：
    ```
    source config.env && docker compose run --rm --no-deps -it api /bin/sh
    ```

4) 然后在容器内执行：
    ```
    printf '%s\n%s\n' "$KEYRING_PASSWORD" "$KEYRING_PASSWORD" | \
    inferenced keys add "$KEY_NAME" --keyring-backend file
    ```

5) [本地]：从您的本地设备（您备份了冷密钥的地方），运行交易：
    ```
    ./inferenced tx inference grant-ml-ops-permissions \
        gonka-account-key \
        <address-of-warm-key-you-just-created> \
        --from gonka-account-key \
        --keyring-backend file \
        --gas 2000000 \
        --node http://<node-url>/chain-rpc/
    ```

6) 启动 API 容器：
    ```
    source config.env && docker compose up -d
    ```
    
## 计算证明（PoC）

### 如何模拟计算证明（PoC）？

您可能想自己在 ML 节点上模拟 PoC，以确保当链上开始 PoC 阶段时一切都会正常工作。

要运行此测试，您需要有一个尚未向 api 节点注册的运行中的 ML 节点，或者暂停 api 节点。要暂停 api 节点，请使用 `docker pause api`。测试完成后，您可以取消暂停：`docker unpause api`。

对于测试本身，您将向 ML 节点发送 POST `/v1/pow/init/generate` 请求，这与 api 节点在 POC 阶段开始时发送的请求相同：
[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32)

PoC 使用以下模型参数：[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41)

如果您的节点处于 `INFERENCE` 状态，则首先需要将节点转换到停止状态：

```
curl -X POST "http://<ml-node-host>:<port>/api/v1/stop" \
  -H "Content-Type: application/json"
```

现在您可以发送请求以启动 PoC：

```
curl -X POST "http://<ml-node-host>:<port>/api/v1/pow/init/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "node_id": 0,
    "node_count": 1,
    "block_hash": "EXAMPLE_BLOCK_HASH",
    "block_height": 1,
    "public_key": "EXAMPLE_PUBLIC_KEY",
    "batch_size": 1,
    "r_target": 10.0,
    "fraud_threshold": 0.01,
    "params": {
      "dim": 1792,
      "n_layers": 64,
      "n_heads": 64,
      "n_kv_heads": 64,
      "vocab_size": 8196,
      "ffn_dim_multiplier": 10.0,
      "multiple_of": 8192,
      "norm_eps": 1e-5,
      "rope_theta": 10000.0,
      "use_scaled_rope": false,
      "seq_len": 256
    },
    "url": "http://api:9100"
  }'
```
将此请求发送到 ML 节点的代理容器的 `8080` 端口，或直接发送到 ML 节点的 `8080` [https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/deploy/join/docker-compose.mlnode.yml#L26](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/deploy/join/docker-compose.mlnode.yml#L26)

如果测试成功运行，您将看到类似以下的日志：
```
2025-08-25 20:53:33,568 - pow.compute.controller - INFO - Created 4 GPU groups:
2025-08-25 20:53:33,568 - pow.compute.controller - INFO -   Group 0: GpuGroup(devices=[0], primary=0) (VRAM: 79.2GB)
2025-08-25 20:53:33,568 - pow.compute.controller - INFO -   Group 1: GpuGroup(devices=[1], primary=1) (VRAM: 79.2GB)
2025-08-25 20:53:33,568 - pow.compute.controller - INFO -   Group 2: GpuGroup(devices=[2], primary=2) (VRAM: 79.2GB)
2025-08-25 20:53:33,568 - pow.compute.controller - INFO -   Group 3: GpuGroup(devices=[3], primary=3) (VRAM: 79.2GB)
2025-08-25 20:53:33,758 - pow.compute.controller - INFO - Using batch size: 247 for GPU group [0]
2025-08-25 20:53:33,944 - pow.compute.controller - INFO - Using batch size: 247 for GPU group [1]
2025-08-25 20:53:34,151 - pow.compute.controller - INFO - Using batch size: 247 for GPU group [2]
2025-08-25 20:53:34,353 - pow.compute.controller - INFO - Using batch size: 247 for GPU group [3]
```
然后服务将开始向 `DAPI_API__POC_CALLBACK_URL` 发送生成的 nonce。
```
2025-08-25 20:54:58,822 - pow.service.sender - INFO - Sending generated batch to http://api:9100/
```
如果您暂停了 api 容器，或者 ML 节点容器和 api 容器不共享同一个 docker 网络，则 http://api:9100 url 将不可用。预计会看到错误消息，说明 ML 节点无法发送生成的批次。重要的是确保生成过程正在发生。

## 更新和维护

### Cosmovisor 更新需要多少可用磁盘空间，以及如何安全地从 `.inference` 目录中删除旧备份？
Cosmovisor 在执行更新时会在 `.inference` 状态文件夹中创建完整备份。例如，您可以看到类似 `data-backup-<some_date>` 的文件夹。
截至 2025 年 11 月 20 日，数据目录的大小约为 150 GB，因此每个备份将占用大约相同的空间。
为了安全地运行更新，建议有 250+ GB 的可用磁盘空间。
您可以删除旧备份以释放空间，尽管在某些情况下这可能仍然不足，您可能需要扩展服务器磁盘。
要删除旧备份目录，您可以使用：
```
sudo su
cd .inference
ls -la   # 查看文件夹列表。会有类似 data-backup... 的文件夹。除了这些，不要删除任何其他内容
rm -rf <data-backup...>
```

## 性能和故障排除

### 如何防止 NATS 中的无界内存增长？

NATS 当前配置为无限期存储所有消息，这会导致内存使用量持续增长。
推荐的解决方案是在两个 NATS 流中为消息配置 24 小时的生存时间（TTL）。

1. 安装 NATS CLI。按照此处的说明安装 Golang：[https://go.dev/doc/install](https://go.dev/doc/install)。然后安装 NATS CLI：
   ```
   go install github.com/nats-io/natscli/nats@latest
   ```
2. 如果您已经安装了 NATS CLI，请运行：
    ```
    nats stream info txs_to_send --server localhost:<your_nats_server_port>
    nats stream info txs_to_observe --server localhost:<your_nats_server_port>
    ```
### 如何更改 `inference_url`？

如果出现以下情况，您可能需要更新 `inference_url`：

- 您更改了 API 域名；
- 您将 API 节点移动到了新机器；
- 您重新配置了 HTTPS / 反向代理；
- 您正在迁移基础设施，希望您的主机条目指向新端点。

此操作不需要重新注册、重新部署或密钥重新生成。更新 `inference_url` 通过用于初始注册的相同交易执行（`submit-new-participant msg`）。

链逻辑检查您的主机（参与者）是否已存在：

- 如果参与者不存在，交易会创建一个新的；
- 如果参与者已存在，只有三个字段可以更新：`InferenceURL`、`ValidatorKey`、`WorkerKey`。

所有其他字段都会自动保留。

这意味着更新 `inference_url` 是一个安全、非破坏性的操作。

!!! note

    当节点更新其执行 URL 时，新 URL 会立即生效，用于来自其他节点的推理请求。但是，`ActiveParticipants` 中记录的 URL 直到下一个 epoch 才会更新，因为更早修改会使与参与者集相关的加密证明无效。为避免服务中断，建议在当前 epoch 完成之前同时保持旧 URL 和新 URL 运行。

[本地] 使用您的冷密钥在本地执行更新：
    ```
    ./inferenced tx inference submit-new-participant \
        <PUBLIC_URL> \
        --validator-key <CONSENSUS_KEY> \
        --keyring-backend file \
        --unordered \
        --from <COLD_KEY_NAME> \
        --timeout-duration 1m \
        --node http://<node-url>/chain-rpc/ \
        --chain-id gonka-mainnet
    ```
通过以下链接验证更新，并将结尾替换为您的节点地址 [http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/participant/gonka1qqqc2vc7fn9jyrtal25l3yn6hkk74fq2c54qve](http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/participant/gonka1qqqc2vc7fn9jyrtal25l3yn6hkk74fq2c54qve)

### 为什么我的 `application.db` 变得如此大，如何修复？

某些节点存在 `application.db` 不断增长的问题。 

`.inference/data/application.db` 存储链的状态历史（不是区块），默认情况下是 362880 的状态。 

状态历史包含每个状态的完整默克尔树，将其保留更短的时间是安全的。例如，仅保留 1000 个区块。

修剪参数可以在 `.inference/config/app.toml` 中设置：

```
...
pruning = "custom"
pruning-keep-recent = "1000"
pruning-interval    = "100"
```

新配置将在重启 `node` 容器后使用。但有一个问题——即使启用了修剪，数据库清理也非常慢。

有几种方法可以重置 `application.db`： 

=== "选项 1：从快照完全重新同步" 

    1) 停止节点
        ```
        docker stop node
        ```
    
    2) 删除数据 
        ```
        sudo rm -rf .inference/data/ .inference/.node_initialized sudo mkdir -p .inference/data/
        ```
    
    3) 启动节点
        ```
        docker start node
        ```
    
    此方法可能需要一些时间，在此期间节点将无法记录交易。
    
    请使用可用的可信节点下载快照。

=== "选项 2：从本地快照重新同步" 

    快照默认启用并存储在 `.inference/data/snapshots`
    
    1) 准备新的 `application.db`（`node` 容器仍在运行）
    
    1.1) 为 `inferenced` 准备临时主目录
        ```
        mkdir -p .inference/temp
        cp -r .inference/config .inference/temp/config
        mkdir -p .inference/temp/data/
        ```
    
    1.2) 复制快照： 
        ```
        cp -r .inference/data/snapshots .inference/temp/data/
        ```
    
    1.3) 列出快照 
        ```
        inferenced snapshots list --home .inference/temp
        ```
    
    复制最新快照的高度。 
    
    1.4) 开始从快照恢复（`node` 容器仍在运行） 
        ```
        inferenced snapshots restore <INSERRT_HEIGHT> 3  --home .inference/temp
        ```
    
    这可能需要一些时间。完成后，您将在 `.inference/temp/data/application.db` 中获得新的 `application.db`
    
    2) 用新的 `application.db` 替换旧的
    
    2.1) 停止 `node` 容器（从另一个终端窗口） 
        ```
        docker stop node
        ```
    
    2.2) 移动原始 `application.db` 
        ```
        mv .inference/data/application.db .inference/temp/application.db-backup
        mv .inference/wasm .inference/wasm.db-backup
        ```
    
    2.3) 用新的替换它 
        ```
        cp -r .inference/temp/data/application.db .inference/data/application.db
        cp -r .inference/temp/wasm .inference/wasm
        ```
    
    2.4) 启动 `node` 容器（从另一个终端窗口）： 
        ```
        docker start node
        ```
    
    3) 等待 `node` 容器同步，然后删除 `.inference/temp/`
    
    如果您有多个节点，建议逐个清理。

=== "选项 3：实验性"

    另一个选项可能是在单独的仅 CPU 机器上启动 `node` 容器的单独实例，并在严格验证器模式下设置：
    
    - 保留非常短的历史
    - 仅将 RPC 和 API 访问限制为 `api` 容器
    
    运行后，将现有的 `tmkms` 卷移动到新节点（首先在现有节点上禁用区块签名）。 
    
    这是该方法的一般思路。如果您决定尝试并有任何问题，请随时在 [Discord](https://discord.com/invite/RADwCT2U6R) 上联系我们。


### 自动 `ClaimReward` 未通过，我该怎么办？

如果您有尚未领取的奖励，请执行以下操作：
```
curl -X POST http://localhost:9200/admin/v1/claim-reward/recover \
    -H "Content-Type: application/json" \
    -d '{"force_claim": true, "epoch_id": 106}'
```

要检查您是否有未领取的奖励，可以使用：
```
curl http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/epoch_performance_summary/106/<ACCOUNT_ADDRESS> | jq
```

## 错误

### `No epoch models available for this node`

您可以在此处找到常见错误和可能出现在节点日志中的典型日志条目的示例。

```
2025/08/28 08:37:08 ERROR No epoch models available for this node subsystem=Nodes node_id=node1
2025/08/28 08:37:08 INFO Finalizing state transition for node subsystem=Nodes node_id=node1 from_status=FAILED to_status=FAILED from_poc_status="" to_poc_status="" succeeded=false blockHeight=92476
```
这实际上不是错误。它只是表示您的节点尚未被分配模型。最有可能的是，这是因为您的节点尚未参与 Sprint，尚未获得投票权重，因此尚未分配模型。
如果您的节点已经通过了 PoC，您应该不会再看到此日志。如果没有，PoC 大约每 24 小时进行一次。
