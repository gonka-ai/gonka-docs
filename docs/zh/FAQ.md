# FAQ

## 概述

### 什么是Gonka？
Gonka是一个用于高效AI计算的去中心化网络——由其使用者运营。它作为集中式云服务的经济高效替代方案，适用于AI模型的训练和推理。作为一个协议，它既不是公司也不是初创企业。

- 从区块链角度看，Gonka是去中心化AI网络的基础账本和协调层（L1）。它记录余额、交易和加密证据，以证明主机正确执行了AI工作，而所有实际计算（如推理和训练）均在链下进行。
- 从网络角度看，Gonka是一个由主机和开发者等参与者组成的综合生态系统，通过去中心化基础设施进行交互。在Gonka区块链的驱动下，该网络分发任务、验证结果，并仅奖励可验证的有用工作，从而为AI工作负载创建了一个竞争性强、可扩展的环境。

### Gonka解决了什么问题？

Gonka是一个去中心化的AI基础设施，旨在减少对集中式云提供商的依赖，并比传统去中心化网络更高效地利用计算能力。其目标是尽可能将计算资源导向有用的AI任务，如推理和训练，同时最小化因共识开销造成的浪费。

### Gonka生态系统中的关键参与者有哪些？

Gonka生态系统有四个关键参与者群体：

- 开发者通过利用网络的分布式计算能力来构建和部署AI应用。
- Gonka贡献者参与核心区块链代码库、协议升级、性能优化、安全补丁和新功能集成的开发。
- 持有者持有网络的原生代币，即仅拥有一个包含Gonka代币的钱包。持有者可以持有、转账或出售代币，用其支付推理服务，并根据协议规则使用。成为持有者并不意味着除标准代币所有权外的任何义务、责任或治理角色。
- 主机向网络贡献计算能力。主机执行推理和其他计算任务，并根据其贡献的计算能力按比例获得奖励，前提是保持诚实参与和可靠性。主机是网络的支柱。只有主机拥有网络的投票权。该投票权代表其在治理中的权重，用于提出和投票决定协议决策、参数变更和升级。任何主机均可充当验证者、转账代理和执行者（这些并非预定义或链上角色，而是在处理推理请求时动态承担的操作职能）。

### 什么是GNK代币？
GNK是Gonka网络的原生代币，用于激励参与者、定价资源并确保网络的可持续增长。

### 我可以购买GNK代币吗？

原生GNK目前**未在任何中心化交易所（CEX）上市**，因此您无法在CEX上购买。请关注[Twitter](https://x.com/gonka_ai)上的官方公告以获取任何上市更新。

不过，目前有两种合法途径可以获得GNK：

- **作为主机挖矿。** 向网络贡献计算资源并直接获得GNK。参见[作为主机挖矿](https://gonka.ai/host/quickstart/)。
- **在以太坊上购买WGNK并桥接回GNK。** GNK可以桥接到以太坊作为**WGNK**（封装的GNK），这是一种标准ERC-20代币，在Uniswap等去中心化交易所交易。您可以在那里购买WGNK，然后[桥接回原生GNK](cross-chain-transfers/ethereum-bridge/withdraw-gnk.md)。参见[以太坊桥接概览](cross-chain-transfers/ethereum-bridge/overview.md)。

!!! info 跟踪WGNK价格和市场数据
	您可以在以下平台查看WGNK（封装的GNK）的价格、市值和交易量：

	- [CoinGecko](https://www.coingecko.com/en/coins/wrapped-gonka)
	- [CoinMarketCap](https://coinmarketcap.com/currencies/gonka/)
	- [Uniswap](https://app.uniswap.org/explore/tokens/ethereum/0x972a7a92d92796a98801a8818bcf91f1648f2f68)

!!! warning 交易前验证合约地址
	**唯一**官方的以太坊GNK表示是**WGNK**，地址为`0x972a7a92d92796a98801a8818bcf91f1648f2f68`——此地址既是桥接合约，也是WGNK ERC-20代币。请始终确认任何列表或交易均指向此确切地址。

	其他追踪器和网络上仍存在假冒的GNK列表和页面：任何声称在Solana上或除上述WGNK地址外的其他合约上的GNK，均**不是**官方GNK资产。请始终通过官方渠道核实信息。

### 协议为何高效？
Gonka与“大玩家”的区别在于其定价机制，以及无论主机规模大小，推理任务均被平等分发。欲了解更多信息，请查阅[白皮书](https://gonka.ai/whitepaper.pdf)。

### 网络如何运行？
网络的运行是协作性的，取决于您希望扮演的角色：

- 作为[开发者](https://gonka.ai/developer/quickstart/)：您可以使用网络的计算资源来构建和部署您的AI应用。
- 作为[主机](https://gonka.ai/host/quickstart/)：您可以贡献您的计算资源以支撑网络。协议设计旨在奖励您的贡献，确保网络的持续性和自主性。

### 这份文档是否完整？

否。本文件涵盖了协议的主要概念、标准工作流程和最常见的操作场景，但并未涵盖代码库的全部行为或实现细节。代码中包含额外的逻辑、交互和边缘情况，此处未作描述。

由于Gonka是一个开源且去中心化的网络，各种参数、机制和治理驱动的行为可能通过链上投票和社区决策不断演变。某些细节可能在发布后发生变化，且并非所有边缘情况或未来更新都会立即反映在此文档中。

对于主机、开发者和贡献者而言，最终的真理来源是代码本身。若本文件与代码之间存在任何差异，以代码为准。

鼓励参与者查阅相关仓库、治理提案和网络更新，以确保其理解与协议当前状态保持一致。

### 贡献计算资源的激励是什么？
我们专门创建了一份文档，聚焦于 [Tokenomics](https://gonka.ai/tokenomics.pdf)，您可以在其中找到有关激励如何衡量的所有信息。

### 硬件要求是什么？
您可以在文档中清晰找到最低和推荐的[硬件规格](https://gonka.ai/host/hardware-specifications/)。您应查阅此部分，以确保您的硬件满足有效贡献的要求。

### 我可以使用哪些钱包存储 GNK 代币？
您可以在 Cosmos 生态系统中的多个支持钱包中存储 GNK 代币：

- [Keplr](https://www.keplr.app/)
- [Cosmostation](https://cosmostation.io/products/application)
- `inferenced` CLI - 用于 Gonka 本地账户管理和网络操作的命令行工具。

!!! note "现有 Leap 钱包用户请注意"

	如果您之前使用 Leap 钱包创建了 Gonka 账户，请注意 [Leap 将于 2026 年 5 月 28 日关闭其所有产品](https://www.leapwallet.io/)，包括浏览器扩展、移动应用和仪表板。

	由于 Leap 是非托管钱包，您的资产和账户仍保留在链上。但为了继续访问您的钱包，您应在 Leap 服务下线前，将现有的恢复短语导入到其他支持的钱包（如 Keplr）中。

### 在哪里可以找到有关 Gonka 的有用信息？

以下是了解 Gonka 生态系统的最重要资源：

- [gonka.ai](https://gonka.ai/) — 项目信息和生态系统概览的主要入口。
- [白皮书](https://gonka.ai/whitepaper.pdf) — 描述架构、共识模型、Proof-of-Compute 等的技术文档。
- [Tokenomics](https://gonka.ai/tokenomics.pdf) — 项目代币经济概览，包括供应、分配、激励和经济设计。
- [GitHub](https://github.com/gonka-ai/gonka/) — 访问项目源代码、仓库、开发活动和开源贡献。
- [Discord](https://discord.com/invite/RADwCT2U6R) — 社区讨论、公告和技术支持的主要场所。
- [X (Twitter)](https://x.com/gonka_ai) — 新闻、更新和公告。

## Tokenomics

### Gonka 中的治理权如何计算？
Gonka 使用基于 PoC 的加权投票模型：

- Proof-of-Compute (PoC)：投票权与您经过验证的计算贡献成正比。
- 抵押承诺：
    - PoC 衍生投票权重的 20% 会自动激活。
    - 要解锁剩余的 80%，您必须锁定 GNK 代币作为抵押。
- 这确保了治理影响力反映真实的计算工作 + 经济抵押。

在前 180 个周期（约 6 个月）内，新参与者可以通过 PoC 单独参与治理并获得投票权，无需抵押要求。在此期间，完整的治理权利可用，而投票权仍与经过验证的计算活动挂钩。

### 为什么 Gonka 要求锁定 GNK 代币以获得治理权？
投票权绝非仅来自持有代币。GNK 代币作为经济抵押，而非影响力来源。影响力通过持续的计算贡献获得，而锁定 GNK 抵押则是为了确保参与治理并强制问责。

## Collateral

### 什么是抵押？
抵押用于在宽限期（前 180 个周期）后激活 PoC 权重中可抵押的部分。
宽限期后：

- 基础权重（默认 20%）始终激活。
- 剩余权重需通过 GNK 抵押才能激活。

抵押确保拥有治理权重的参与者也承担经济责任。参数由链上定义，并可通过治理更改。在做出经济决策前，请始终核实当前数值。

### 抵押是按节点还是按账户计算？
抵押按账户存入。如果多个 ML 节点链接到同一账户，则所需抵押基于该账户下所有节点的总权重计算。

### 我需要存入抵押吗？
是的，如果您希望激活超过基础权重的权重。如果没有存入抵押品，只有基础权重保持激活状态。

### 需要多少抵押品？
公式：
```
Required Collateral =
Total Weight × (1 - base_weight_ratio) × collateral_per_weight_unit
```
由于PoC权重在各个周期间可能波动，存入精确的最低金额可能导致暂时性抵押不足。
较小的权重可能经历相对更大的波动。当抵押品水平相对较低时，建议预留高达计算最低值2倍的缓冲。
```
Recommended (with conservative buffer):
Total Weight × 2 × (1 - base_weight_ratio) × collateral_per_weight_unit
```

### 我可以部分抵押我的权重吗？
可以。您的总激活权重包括：

- 基础权重（始终激活）
- 可抵押权重（按存入的抵押品比例激活）

如果您存入的金额少于全额所需：

- 基础权重保持完全激活
- 只有相应比例的可抵押权重被激活
- 剩余部分保持非激活状态

激活权重的计算方式为：
```
Active Weight =
Base Weight +
(Deposited Collateral / Required Collateral) × Collateral-Eligible Weight
```

### 如果我没有存入足够的抵押品会怎样？
您的激活权重将按比例减少。由于奖励按激活权重比例分配，当您抵押不足时，其他主机将获得更大份额的发行量。非激活权重不会被直接重新分配，它 simply 不参与共识。

### 抵押品何时生效？
抵押品必须在周期开始前存入才能生效。在周期内存入的抵押品：

- 不会立即增加权重
- 从下一个周期开始生效

周期内无法增加抵押品。

### 我应该以什么单位存入抵押品？
交易必须使用ngonka，而不是GNK。
```
1 GNK = 1,000,000,000 ngonka
```
示例：
```
10 GNK = 10,000,000,000 ngonka
```

### 抵押品可以被罚没吗？
可以。抵押品可能因以下原因被罚没：

- 无效推理
- 宕机（确认PoC失败或关押）

无效推理的罚没每个纪元上限为一次。
宕机罚没可针对每次关押事件执行。

### 被罚没的代币会怎样？
目前，被罚没的GNK将永久销毁并从流通中移除。未来治理可能更改此机制。

### 我可以提取抵押品吗？
可以。提取将触发解绑期（默认：1个纪元）。在解绑期间，抵押品仍受罚没规则约束。解绑结束后，资金将自动返还至您的账户余额。

### 抵押品不是什么

- 抵押品不是投票权。投票权来源于PoC权重，而非代币余额。
- 抵押品不是委托。每个账户必须为自己权重提供支持。
- 抵押品不是永久锁定。可以提取（需经过解绑期）。
- 在宽限期（前180个纪元）内，不需要抵押品。

### 纪元铸造的奖励如何分配？
每个纪元将铸造固定数量的GNK，并按活跃PoC权重比例分配。
活跃权重决定：

- 您在纪元奖励中的份额
- 您的治理影响力

如果您的活跃权重因抵押品不足而降低，您获得的纪元奖励份额将按比例减少。非活跃权重不获得奖励。

### 我需要手动存入抵押品吗？
是。必须通过提交链上交易存入抵押品。它不会自动激活。如果没有存入抵押品：

- 您的节点仍正常运行。
- 不会被关押或禁用。
- 仅基础权重（例如20%）保持活跃。

您的奖励和治理影响力将按比例减少。

### 已归属（锁定）的GNK可以作为抵押品吗？
不可以。抵押品必须从您的可用（未锁定）GNK余额中存入。尚未释放的归属代币不能用作抵押品。

## 治理

### 哪些类型的变更需要治理提案？
任何影响网络的链上变更都需要治理提案，例如：

- 更新模块参数（`MsgUpdateParams`）
- 执行软件升级
- 添加、更新或弃用推理模型
- 任何必须通过治理模块批准和执行的其他操作

### 谁可以创建治理提案？
任何拥有有效治理密钥（冷钱包）的人都可以支付所需费用并创建治理提案。然而，每个提案仍需通过PoC加权投票由活跃参与者批准。建议提案者在链下先讨论重大变更（例如通过[GitHub](https://github.com/gonka-ai)或[社区论坛](https://discord.com/invite/RADwCT2U6R)），以提高提案通过的可能性。详见[完整指南](https://gonka.ai/governance/transactions-and-governance/)。

### 如果提案失败会怎样？
- 如果提案未达到法定人数 → 自动失败
- 如果多数票投 `no` → 提案被拒绝，无链上变更
- 如果显著比例的投票为 `no_with_veto`（超过否决阈值）→ 提案被拒绝并标记，表明社区存在强烈分歧
- 存款是否退还取决于链的设置

### 治理参数本身可以被更改吗？
可以。所有关键治理规则——最低投票率、多数阈值和否决阈值——都是链上可配置的，并可通过治理提案进行更新。这使网络能够根据参与模式和计算经济的变化演变决策规则。

### 如果我无法投票，因为我无法访问冷密钥，或者我想让另一个密钥代表我投票，我该怎么办？

如果拥有投票权的密钥不是你日常操作使用的密钥，可以提前授予投票权限。

在这种设置下：

- 授予人 = 拥有投票权的账户（冷密钥）
- 被授予人 = 代表授予人提交投票的账户（热密钥）

有两种常见场景：

**1. 你想投票，但无法访问拥有投票权的密钥。**

请联系该密钥的所有者，要求他们授予你的密钥代表其投票的权限。没有此授权，你的密钥无法为该投票权提交治理投票。

**2. 你想让另一个密钥代表你投票。**

使用以下 grant 命令，从拥有投票权的密钥执行。这将授权被授予人密钥代表你提交治理投票。
此委托仅允许对治理提案进行投票。被授予人仍可为自己密钥投票。授予人可随时撤销此权限。

1) 授予投票权限（从授予人密钥运行）
=== "Command"

    ```
    ./inferenced tx authz grant <GRANTEE_GONKA_ADDRESS> generic \
      --msg-type=/cosmos.gov.v1beta1.MsgVote \
      --from=<GRANTER_KEY_NAME> \
      --chain-id=gonka-mainnet \
      --expiration=<UNIX_TIMESTAMP> \
      --home .inference \
      --keyring-backend file
    ```

=== "Example response"

    ```
    {
        "height": "0",
        "txhash": "8D96FB6FC06FFB928FBC89FE950689CD040C7F338C197BA856175EC7462A3FFA",
        "codespace": "",
        "code": 0,
        "data": "",
        "raw_log": "",
        "logs": [],
        "info": "",
        "gas_wanted": "0",
        "gas_used": "0",
        "tx": null,
        "timestamp": "",
        "events": []
    }
    ```

2) 验证授权是否存在（从任意节点运行）
=== "Command"
    ```
    ./inferenced query authz grants <GRANTER_GONKA_ADDRESS> <GRANTEE_GONKA_ADDRESS> \
      --node="http://<MAINNET_NODE_URL>:26657" \
      --output=json | jq .
    ```

=== "Example response"

    ```
    {
        "grants": [
            {
                "authorization": {
                    "type": "cosmos-sdk/GenericAuthorization",
                    "value": {
                        "msg": "/cosmos.gov.v1beta1.MsgVote"
                    }
                },
                "expiration": "2026-12-03T18:38:18Z"
            }
        ],
        "pagination": {
            "total": "1"
        }
    }
    ```

3) 使用被授予人投票
=== "Command"
    ```
    # Find the proposal ID which you are voting for - use it as <VOTE_PROPOSAL_ID> in the voting body 
    ./inferenced query gov proposals --output json
    
    # Prepare the file with the voting body
    cat > /tmp/authz-vote.json << 'EOF'
    {
      "body": {
        "messages": [
          {
            "@type": "/cosmos.authz.v1beta1.MsgExec",
            "grantee": "<GRANTEE_GONKA_ADDRESS>",
            "msgs": [
              {
                "@type": "/cosmos.gov.v1beta1.MsgVote",
                "proposal_id": "<VOTE_PROPOSAL_ID>",
                "voter": "<GRANTER_GONKA_ADDRESS>",
                "option": "VOTE_OPTION_YES"
              }
            ]
          }
        ]
      }
    }
    EOF
    
    
    # Vote using the file 
    ./inferenced tx authz exec /tmp/authz-vote.json \  --from=<GRANTEE_KEY_NAME> \ 
    --chain-id=gonka-mainnet \
    --home .inference \
    --keyring-backend file \
    --node="http://<MAINNET_NODE_URL>:26657" -y
    ```

=== "Example response"

    ```
    {
        "pagination": {
            "total": "1"
        },
        "proposals": [
            {
                "deposit_end_time": "2026-03-06T10:40:07.016920026Z",
                "final_tally_result": {
                    "abstain_count": "0",
                    "no_count": "0",
                    "no_with_veto_count": "0",
                    "yes_count": "0"
                },
                "id": "1",
                "messages": [
                    {
                        "type": "cosmos-sdk/MsgSoftwareUpgrade",
                        "value": {
                            "authority": "gonka10d07y265gmmuvt4z0w9aw880jnsr700j2h5m33",
                            "plan": {
                                "height": "406062",
                                "info": "{\n \"binaries\":{\n \"linux/amd64\":\"https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.10-testnet1/inferenced-amd64.zip?checksum=sha256:fb71310427436aebac32813735231882fca420cf0d94b036f8cacd055d0e1c78\"\n },\n \"api_binaries\":{\n \"linux/amd64\":\"https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.10-testnet1/decentralized-api-amd64.zip?checksum=sha256:6fe214f4bb2d831c02ce407682820d95d01e6ae94a33fe9c4617b80e0ca716ce\"\n }\n }",
                                "name": "v0.2.10",
                                "time": "0001-01-01T00:00:00Z"
                            }
                        }
                    }
                ],
                "proposer": "gonka1xfvr8mywcrxrcrryvj8c5d2grvyjdj5c90fd88",
                "status": 2,
                "submit_time": "2026-03-04T10:40:07.016920026Z",
                "summary": "Upgrade Proposal v0.2.10",
                "title": "Upgrade Proposal v0.2.10",
                "total_deposit": [
                    {
                        "amount": "50000000",
                        "denom": "ngonka"
                    }
                ],
                "voting_end_time": "2026-03-04T10:50:07.016920026Z",
                "voting_start_time": "2026-03-04T10:40:07.016920026Z"
            }
        ]
    }
    ```

投票选项：

- `VOTE_OPTION_YES`
- `VOTE_OPTION_ABSTAIN`
- `VOTE_OPTION_NO`
- `VOTE_OPTION_NO_WITH_VETO`

4) 撤销委托（从授予人密钥运行）
=== "Command"

    ```
    ./inferenced tx authz revoke <GRANTEE_GONKA_ADDRESS> /cosmos.gov.v1beta1.MsgVote \
      --from=<GRANTER_KEY_NAME> \
      --chain-id=gonka-mainnet \
      --home .inference \
      --keyring-backend file
    ```
=== "Example response"

    ```
    {
        code: 0
        codespace: ""
        data: ""
        events: []
        gas_used: "0"
        gas_wanted: "0"
        height: "0"
        info: ""
        logs: []
        raw_log: ""
        timestamp: ""
        tx: null
        txhash: A2C3CDA9E95DCF143C0D8981A4F573F1E68879ECF4903B25BA97383C3F2FDFBA
    }
    ```

## 改进提案

### 治理提案和改进提案有什么区别？
治理提案 → 链上提案。用于直接影响网络且需要链上投票的更改。示例：

- 更新网络参数（`MsgUpdateParams`）
- 执行软件升级
- 添加新模型或功能
- 任何需要由治理模块执行的修改

改进提案 → 由活跃参与者控制的链下提案。用于塑造长期路线图、讨论新想法和协调重大战略变更。

- 以 Markdown 文件形式管理在 [/proposals](https://github.com/gonka-ai/gonka/tree/main/proposals) 目录中
- 通过 GitHub 拉取请求进行审查和讨论
- 获批的提案将被合并到仓库中

### 改进提案如何被审查和批准？
社区提案审查的目标是获得社区验证：反应、评论和具体反馈，以增强最终获得治理批准的理由。如果提案实施需要大量工作、长期承诺、协调或对协议进行重大更改，这一点尤为重要。

- 请先阅读推荐指南：[https://github.com/gonka-ai/gonka/discussions/795](https://github.com/gonka-ai/gonka/discussions/795)。它解释了哪些内容应包含在改进提案中，以及如何撰写一个有力且结构清晰的提案。
- 请在 [GitHub Discussions](https://github.com/gonka-ai/gonka/discussions) 发布并讨论改进提案（首选方式）；此前它们以 Markdown 文件形式存储在 `/proposals` 目录中。
- 为了帮助社区评估您的提案（并提高其在治理阶段的成功率），提案者有责任主动收集早期反馈和支持信号（点赞、评论、具体意见）。
	- 请在 Discord 的 #improvements-proposals 频道分享讨论链接以扩大影响力和可见度，并通过您可用的其他渠道（包括直接联系主机/矿工）进行推广，以获取实际反馈和支持。
	- 在提案帖中分享您的经验和专业背景。如果您代表团队或公司，请提及并链接相关工作，以帮助社区评估可信度并更高效地评估提案。
- 社区评审：
	- 活跃贡献者和维护者将在 [GitHub Discussions](https://github.com/gonka-ai/gonka/discussions) 中讨论该提案。讨论可以在任何平台进行，但请将关键上下文汇总回 [GitHub Discussions](https://github.com/gonka-ai/gonka/discussions)：这能将完整历史记录集中保存，保持可搜索性，并长期更易维护。GitHub 是权威信息来源。
	- 请提出问题、提供反馈、建议、优化，并为相关提案点赞。每个人的关注和参与对区块链的可持续演进都至关重要。
- 积极的反馈和大量点赞表明社区的真实需求，使团队能够将广受好评的提案视为社区驱动的路线图的一部分，并有信心启动实施，同时预期获得治理批准。请注意，主机的反馈至关重要——它有助于将项目分解为里程碑、解锁部分奖励金，甚至争取社区池的资助。然而，最终所有链上更新和支付均需经过治理批准。

### 改进提案能否演变为治理提案？
可以。通常，改进提案用于探索想法并凝聚共识，然后再起草治理提案。例如：

- 您可以先将新模型集成作为改进提案提出。
- 在社区达成一致后，创建一个链上治理提案以更新参数或触发软件升级。

## 投票

### 投票流程如何运作？
- 提案提交并存入最低押金后，即进入投票期
- 投票选项：`yes`、`no`、`no_with_veto`、`abstain`

    - `yes` → 批准提案
    - `no` → 拒绝提案
    - `no_with_veto` → 拒绝并表明强烈反对
    - `abstain` → 不批准也不拒绝，但计入法定人数

- 您可以在投票期间随时更改投票；仅以最后一次投票为准
- 如果满足法定人数和阈值，提案将自动通过并由治理模块执行

要投票，可使用以下命令。此示例为投赞成票，但您可以替换为您的首选选项（`yes`、`no`、`no_with_veto`、`abstain`）：
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
您可以随时使用 CLI 查询提案状态：
```
export NODE_URL=http://47.236.19.22:18000
./inferenced query gov tally 2 -o json --node $NODE_URL/chain-rpc/
```

## 运行节点

### 如果我想停止挖矿，但未来回来时仍想使用我的账户，该怎么办？
未来恢复网络节点时，只需备份以下内容：

- 冷密钥（最重要，其他均可轮换）
- tmkms 的密钥：`.tmkms/secrets/`
- 来自 `.inference .inference/keyring-file/` 的 keyring
- 来自 `.inference/config .inference/config/node_key.json` 的节点密钥
- 温密钥密码：`KEYRING_PASSWORD`

### 我的节点被惩罚了。这意味着什么？
您的验证节点因在最近100个区块中签名少于50个（统计的是该窗口内签名区块总数，而非连续性）而被惩罚。这意味着您的节点被暂时排除（约15分钟）在区块生产之外，以保护网络稳定性。
可能的原因包括：

- **共识密钥不匹配**。您的节点使用的共识密钥可能与链上注册的验证节点密钥不一致。请确保您使用的共识密钥与链上注册的验证节点密钥一致。
- **网络连接不稳定**。网络不稳定或中断可能导致节点无法达成共识，从而导致签名缺失。请确保您的节点拥有稳定、低延迟的连接，且未被其他进程过度占用。

**奖励**：即使您的节点被惩罚，只要它仍参与推理或其他验证相关工作，您作为主机仍将继续获得大部分奖励。因此，除非检测到推理问题，否则奖励不会丢失。

**如何解除惩罚**：在问题解决后，使用您的冷密钥提交解除惩罚交易以恢复正常运行。

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
然后，检查节点是否已解除封禁：
```
 ./inferenced query staking delegator-validators \
    <cold_key_addr> \
    --node $NODE_URL/chain-rpc/
```
当节点被封禁时，会显示 `jailed: true`。

### 如何退役旧集群？

请遵循本指南安全关闭旧集群，而不影响声誉。

1) 使用以下命令禁用每个 ML 节点：

```
curl -X POST http://localhost:9200/admin/v1/nodes/<id>/disable
```

您可以使用以下命令列出所有节点ID：

```
curl http://localhost:9200/admin/v1/nodes | jq '.[].node.id'
```

2) 在下一个计算证明（PoC）期间未安排提供推理服务的节点将在该PoC期间自动停止。
安排提供推理服务的节点将在停止前继续运行一个额外的周期。您可以通过以下位置的mlnode字段验证节点状态：

```
curl http://<inference_url>/v1/epochs/current/participants
```

一旦节点被标记为禁用，即可安全关闭MLNode服务器。

3) 在所有MLNode被禁用并关闭后，您可以关闭网络节点。在此之前，建议（但非必需）备份以下文件：

- `.dapi/api-config.yaml`
- `.dapi/gonka.db`（在链上升级后创建）
- `.inference/config/`
- `.inference/keyring-file/`
- `.tmkms/`

如果您跳过备份，仍可使用您的账户密钥稍后恢复设置。

### 我的节点无法连接到 `config.env` 中指定的默认种子节点

如果您的节点无法连接到默认种子节点，只需通过更新 `config.env` 中的三个变量将其指向另一个节点。

1. `SEED_API_URL` - 种子节点的HTTP端点（用于API通信）。
从以下列表中选择任意URL，并直接分配给 `SEED_API_URL`。
    ```
    export SEED_API_URL=<chosen_http_url>
    ```
    可用的创世API URL：
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
2. `SEED_NODE_RPC_URL` - 公共Tendermint RPC访问必须通过种子节点的HTTP(S)代理路径 `/<chain-rpc>`。
使用与 `SEED_API_URL` 相同的协议（http或https）、主机和端口，并追加 `/chain-rpc`。
    ```
    export SEED_NODE_RPC_URL=http://<host>/chain-rpc
    ```
    示例
    ```
    SEED_NODE_RPC_URL=http://node2.gonka.ai:8000/chain-rpc/ 
    ```
!!! note "重要"

	- 请勿将 `http://<host>:26657` 用作公共RPC端点。
	- 端口 `26657` 必须仅限内部使用（localhost/私有网络）。公共RPC必须通过 `/<chain-rpc>`。

3. `SEED_NODE_P2P_URL` - 用于节点间网络通信的P2P地址。
您必须通过相同的 `/<chain-rpc>` 代理从种子节点的状态端点获取P2P端口。

查询节点：
    ```
    http://<host>:<http_port>/chain-rpc/status
    ```
    示例
    ```
    https://node3.gonka.ai/chain-rpc/status
    ```
    在响应中查找 `listen_addr`，例如：
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
    export SEED_NODE_RPC_URL=http://node2.gonka.ai:8000/chain-rpc/
    export SEED_NODE_P2P_URL=tcp://node2.gonka.ai:5000
    ```

### 如何更改种子节点？

根据节点是否已初始化，有两种不同的方式来更新种子节点。

=== "选项1. 手动编辑种子节点（初始化后）"

一旦文件 `.node_initialized` 创建，系统将不再自动更新种子节点。
    之后：

    - 种子列表将直接使用
    - 任何更改都必须手动完成
    - 您可以添加任意数量的种子节点

格式为单个逗号分隔的字符串：
    ```
    seeds = "<node1_id>@<node1_ip>:<node1_p2p_port>,<node2_id>@<node2_ip>:<node2_p2p_port>"
    ```
    要查看任何运行节点的已知对等节点，请使用链RPC：
    ```
    curl http://47.236.26.199:8000/chain-rpc/net_info | jq
    ```

    在响应中查找：

    - `listen_addr` - P2P端点
    - `rpc_addr` - RPC端点

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

    此命令显示节点当前看到的所有对等节点。

=== "选项2. 重新初始化节点（从环境变量自动应用种子节点）"

如果希望节点重新生成配置并自动应用环境变量中定义的种子节点，请使用此方法。
    ```
    source config.env
    docker compose down node
    sudo rm -rf .inference/data/ .inference/.node_initialized
    sudo mkdir -p .inference/data/
    ```
    重启节点后，它将表现得像全新安装一样，重新创建其配置，包括来自环境变量的种子节点。
    要验证实际应用的种子节点：

    ```
    sudo cat .inference/config/config.toml
    ```
    查找以下字段：
    ```
    seeds = [...]
    ```

### 硬件、节点权重和ML节点配置是如何实际验证的？

链上**不**验证真实硬件。它仅验证总参与权重，且这是用于权重分配和奖励计算的唯一值。

此权重在ML节点间的任何拆分，以及任何“硬件类型”或其他描述性字段，均仅为信息性内容，可由主机自由修改。

在创建或更新节点时（例如，通过`POST http://localhost:9200/admin/v1/nodes`，如[https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/server/admin/node_handlers.go#L62](https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/server/admin/node_handlers.go#L62)中的处理程序代码所示），可以显式指定硬件字段。如果省略，API服务会尝试从ML节点自动检测硬件信息。

实际上，许多主机在后端运行代理ML节点，多个服务器共用该节点；自动检测仅能看到其中一个服务器，这是一种完全有效的设置。无论配置如何，所有权重分配和奖励都仅依赖于主机的总权重，内部在ML节点间的划分或报告的硬件类型永远不会影响链上验证。

### 如何切换到`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、升级ML节点并移除其他模型？

!!! warning "历史记录 — v0.2.8 / PoC v2迁移"
    此条目记录了**v0.2.8 / PoC v2迁移（第155轮）**，当时`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`是唯一强制执行的模型。仅保留用于历史参考。**自第308轮起，Qwen3-235B已被治理（提案78）退役，`MiniMaxAI/MiniMax-M2.7`为当前基础/活跃的PoC模型。** 如需当前设置，请参阅[主机快速入门](./host/quickstart.md)和[多模型PoC — 主机操作指南](./host/multi_model_poc.md)。

    本指南说明主机应如何根据v0.2.8模型可用性变化及即将推出的PoC v2更新来升级其ML节点。自第155轮起，ML节点配置需符合PoC v2要求。建议主机在该时间点前审查并准备其ML节点配置。PoC v2迁移可在第155轮后安排。迁移阶段结束后，未满足配置要求的ML节点权重可能不会被计入。

    **1. 背景：模型可用性变更（升级v0.2.8）**

    作为v0.2.8升级的一部分，活跃模型集已更新。

    **支持的模型（活跃集）**

    仅以下模型仍受支持：

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `Qwen/Qwen3-32B-FP8`

`Qwen/Qwen3-32B-FP8`在迁移期间受支持，但不贡献于PoC v2就绪性或权重分配。参与PoC v2要求提供`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。

**已移除的模型**

所有此前支持的模型均已从活跃集中移除，不得再提供服务。

**2. PoC v2就绪标准（重要）**

成功参与PoC v2迁移需满足以下两项条件：

- 您的所有ML节点均提供`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。这是唯一能贡献PoC v2权重的模型。
- 您的所有ML节点均已升级至PoC v2兼容镜像：
    - ghcr.io/product-science/mlnode:3.0.12-post3
    - ghcr.io/product-science/mlnode:3.0.12-post3-blackwell

!!! note "重要"
	- 仅提供正确模型而不升级ML节点是不够的。
	- 不满足两项条件的节点，在网络切换为单模型配置后将不再具备资格。
	- ML节点升级必须在迁移完成、PoC v2通过独立治理提案激活（在v0.2.8升级之后）之前完成。
	- v0.2.8升级本身不会启用PoC v2。

**3. 检查ML节点分配状态（推荐的安全步骤）**

在更改模型之前，您应检查当前的ML节点分配情况。查询您的网络节点管理API：
```
curl http://127.0.0.1:9200/admin/v1/nodes
```
查找以下字段：
```
"timeslot_allocation": [
  true,
  false
]
```
解释：

- 第一个布尔值：节点在当前轮次是否正在提供推理服务
- 第二个布尔值：节点是否被安排在下一轮PoC中提供推理服务

**推荐行为**

- 优先仅在第二个值为`false`的节点上更改模型
- 这可以降低风险，同时继续观察PoC v2的行为
- 鼓励在轮次间逐步 rollout

**4. 更新ML节点的模型：仅保留受支持的模型**

预下载模型权重（推荐）。为避免启动延迟，请将权重预下载至`HF_HOME`：
```
mkdir -p $HF_HOME
huggingface-cli download Qwen/Qwen3-235B-A22B-Instruct-2507-FP8
```
使用ML节点管理API将ML节点切换至受支持的模型（`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`）。

例如：
```
curl -X PUT "http://localhost:9200/admin/v1/nodes/node1" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "node1",
    "host": "inference",
    "inference_port": 5000,
    "poc_port": 8080,
    "max_concurrent": 800,
    "models": {
      "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8": {
        "args": [
          "--tensor-parallel-size",
          "4",
          "--max-model-len",
          "240000"
        ]
      }
    }
  }'
```
通过管理API进行的更改将在下一轮次替换模型（[https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)）

!!! note 
	`node-config.json`仅在Network Node API首次启动或本地状态/数据库被删除时使用。如需全新重启，请编辑它。对于现有节点，模型更新应通过管理API执行。

	**5. 升级ML节点镜像（PoC v2必需）**

	编辑`docker-compose.mlnode.yml`并更新ML节点镜像：

	标准GPU
```
image: ghcr.io/product-science/mlnode:3.0.12-post3
```
NVIDIA Blackwell GPU
```
image: ghcr.io/product-science/mlnode:3.0.12-post3-blackwell
```
应用更改并重启服务。从`gonka/deploy/join`：
```
source config.env
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml pull
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d
```
**6. 验证模型服务（将在下一轮次生效）**

确认ML节点仅提供`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`服务，这是PoC v2权重和未来权重分配使用的唯一模型：
```
curl http://127.0.0.1:8080/v1/models | jq
```
可选：重新检查节点分配：
```
curl http://127.0.0.1:9200/admin/v1/nodes
```
!!! note "治理与PoC v2激活说明"

	PoC v2分阶段引入，不会一次性激活。

	**第一阶段：观察（v0.2.8之后的当前状态）**

	v0.2.8升级后，PoC v2逻辑已可用，但尚未用于权重分配。

	在此阶段：

	- 主机可以提供`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`或`Qwen/Qwen3-32B-FP8`
	- 主机必须将其ML节点切换为提供`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`并升级至PoC v2兼容版本，才能为PoC v2权重做出贡献。
	- 网络将观察采用情况，以评估主机是否准备好过渡到PoC v2权重。

**第二阶段：治理提案（可选，未来）**
	一旦观察到足够数量的活跃主机采用（约50%）：

	- 可提交单独的治理提案
	- 该提案可请求批准启用PoC v2并使用PoC v2进行权重分配

采用阈值仅为观察性，不会触发任何自动更改。

**第三阶段：激活（仅在治理批准后）**

PoC v2仅在治理提案获得链上批准后，才成为权重分配的活跃方法。

在该提案获得批准前：

	- PoC v2对权重分配保持非活跃状态
	- 现有的PoC机制将继续用于确定权重

**总结检查清单**

在PoC v2激活前，请确保：

- ML Node 服务 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 所有其他模型均已从配置中移除
- ML Node 镜像是 `3.0.12-post3`（或 `3.0.12-post3-blackwell`）

## 密钥与安全

### 对于 v0.2.9 升级后创建的热密钥，应使用哪个 CLI 版本？

对于授予 v0.2.9 升级后创建的新热密钥权限，应使用 CLI [版本 v0.2.9](https://github.com/gonka-ai/gonka/releases/tag/release/v0.2.9)。

### 我可以在哪里找到有关密钥管理的信息？
您可以在文档中找到有关 [密钥管理](https://gonka.ai/host/key-management/) 的专门章节。它概述了在网络中安全管理应用程序密钥的流程和最佳实践。

### 我清除了或覆盖了我的共识密钥

如果您使用 **tmkms** 并删除了 `.tmkms` 文件夹，只需重新启动 **tmkms** — 它将自动生成新密钥。
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

### 我删除了暖密钥
在本地设备上备份**冷密钥**，远离服务器。

1) 停止API容器：
    ```
    docker compose down api --no-deps
    ```

2) 在你的`config.env`文件中为暖密钥设置`KEY_NAME`。

3) [SERVER]：重新创建暖密钥：
    ```
    source config.env && docker compose run --rm --no-deps -it api /bin/sh
    ```

4) 然后在容器内执行：
    ```
    printf '%s\n%s\n' "$KEYRING_PASSWORD" "$KEYRING_PASSWORD" | \
    inferenced keys add "$KEY_NAME" --keyring-backend file
    ```

5) [LOCAL]：从你的本地设备（你已备份冷密钥的地方）运行交易：
    ```
    ./inferenced tx inference grant-ml-ops-permissions \
        gonka-account-key \
        <address-of-warm-key-you-just-created> \
        --from gonka-account-key \
        --keyring-backend file \
        --gas 2000000 \
        --node http://<node-url>/chain-rpc/
    ```

6) 启动API容器：
    ```
    source config.env && docker compose up -d
    ```

## 计算证明（PoC）

### 什么是计算证明？

计算证明（PoC）是一种共识机制，它用可证明的基于Transformer的计算能力替代基于资本或哈希的权重。它定义了如何衡量和将真实的AI计算转换为治理和共识权重。PoC通过每个纪元末期进行的短时同步冲刺（Sprint）执行。在冲刺之外，纪元用于现实世界的AI计算。实际上，“计算证明（PoC）”和“冲刺”这两个术语经常互换使用。当提到“下一个PoC”或“PoC阶段”时，通常指的是下一个冲刺，即计算证明的执行阶段。

### 什么是冲刺？

冲刺是计算证明的一个阶段。在冲刺期间，所有主机同时在一个具有随机化层的Transformer上对一连串随机数运行AI相关的推理，生成输出向量。只要报告的输出可验证地由所需的冲刺模型生成，主机对下一个纪元的投票权与其处理的随机数数量成正比。

### 如何模拟计算证明（PoC）？

你可能希望在自己的ML节点上模拟PoC，以确保在链上进入PoC阶段时一切正常运行。

要运行此测试，你需要有一个未注册到API节点的运行中ML节点，或暂停API节点。要暂停API节点，请使用`docker pause api`。完成测试后，你可以取消暂停：`docker unpause api`。

对于测试本身，你将向ML节点发送POST `/v1/pow/init/generate`请求，与API节点在PoC阶段开始时发送的请求相同：
[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32)

PoC使用的以下模型参数：[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41)

如果你的节点处于`INFERENCE`状态，则首先需要将节点转换为已停止状态：

```
curl -X POST "http://<ml-node-host>:<port>/api/v1/stop" \
  -H "Content-Type: application/json"
```

现在你可以发送请求以启动PoC：

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
向ML节点代理容器的`8080`端口或直接向ML节点的`8080`发送此请求 [https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/deploy/join/docker-compose.mlnode.yml#L26](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/deploy/join/docker-compose.mlnode.yml#L26)

如果测试成功运行，你将看到类似以下的日志：
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
然后服务将开始将生成的随机数发送到`DAPI_API__POC_CALLBACK_URL`。
```
2025-08-25 20:54:58,822 - pow.service.sender - INFO - Sending generated batch to http://api:9100/
```
如果你暂停了API容器，或者ML节点容器和API容器未共享同一个Docker网络，则http://api:9100 URL将不可用。你可能会看到错误消息，提示ML节点未能发送生成的批次。重要的是确保生成过程正在发生。

### 确认比率0意味着什么？如果发生这种情况我该怎么办？

0%的确认比率是一种异常情况，表明在纪元期间没有任何随机数从你的API节点发送，意味着该节点完全未参与确认计算证明（CPoC）。要调查原因，请检查API节点日志和ML节点日志，它们应能说明为何未提交随机数。

可能的原因包括：

- API节点配置错误或宕机
- 公开暴露的管理或管理端口，允许访问ML节点
- 共识节点落后于链，可能导致PoC参与超出允许窗口
- ML节点驱动程序故障

为减轻此风险，请确保管理端口和管理端口不对外公开，验证API节点正在运行且配置正确，监控共识节点同步情况，并为ML节点和驱动程序故障设置警报。

## 性能与故障排除

### 如何使用代理预发布版（v0.2.8）保护我的节点免受DDoS攻击？

现已提供带有速率限制和DDoS防护措施的新代理版本。

新增内容：

- 对API/RPC端点进行速率限制，以防止影响网络节点的过度请求
- 阻止资源密集型内部路由，如`training`和`poc-batches`
- 可选禁用`/chain-api`、`/chain-rpc`和`/chain-grpc`端点

**更新说明****步骤 1**：更新代理镜像
```
sed -i -E 's|(image:[[:space:]]*ghcr.io/product-science/proxy)(:.*)?$|\1:0.2.8-pre-release-proxy@sha256:6ccb8ac8885e03aab786298858cc763a99f99543b076f2a334b3c67d60fb295f |' docker-compose.yml
```
!!! note "重要"
	步骤 2 将禁用此节点上的 `/chain-api`、`/chain-rpc` 和 `/chain-grpc` 端点。应用后，此节点将不再提供公共 RPC 流量。如果您运行公共 RPC 端点，则必须运行独立的仅 RPC 节点（无这些限制），并保持此节点私有。

	**步骤 2（可选）**：禁用 `chain-api`、`chain-rpc` 和 `chain-grpc`

	如果您想完全禁用 `/chain-api`、`/chain-rpc` 和 `/chain-grpc` 端点：
```
sed -i 's|DASHBOARD_PORT=5173|DASHBOARD_PORT=5173\n      - DISABLE_CHAIN_API=${DISABLE_CHAIN_API:-true}\n      - DISABLE_CHAIN_RPC=${DISABLE_CHAIN_RPC:-true}\n      - DISABLE_CHAIN_GRPC=${DISABLE_CHAIN_GRPC:-true}\n|' docker-compose.yml
```
禁用曾用于近期攻击的训练 URL：
```
sed -i -E -e '/GONKA_API_(EXEMPT|BLOCKED)_ROUTES/d' -e 's|(- GONKA_API_PORT=9000)|\1\n      - GONKA_API_EXEMPT_ROUTES=chat inference\n      - GONKA_API_BLOCKED_ROUTES=poc-batches training|' docker-compose.yml
```
之后，您的代理配置应如下所示：
```
proxy:
    container_name: proxy
    image: ghcr.io/product-science/proxy:0.2.8-pre-release-proxy@sha256:6ccb8ac8885e03aab786298858cc763a99f99543b076f2a334b3c67d60fb295f
    ports:
      - "${API_PORT:-8000}:80"
      - "${API_SSL_PORT:-8443}:443"
    environment:
      - NGINX_MODE=${NGINX_MODE:-http}
      - SERVER_NAME=${SERVER_NAME:-}
      - GONKA_API_PORT=9000
      - GONKA_API_EXEMPT_ROUTES=chat inference
      - GONKA_API_BLOCKED_ROUTES=poc-batches training
      - CHAIN_RPC_PORT=26657
      - CHAIN_API_PORT=1317
      - CHAIN_GRPC_PORT=9090
      - DASHBOARD_PORT=5173
      - DISABLE_CHAIN_API=${DISABLE_CHAIN_API:-true}
      - DISABLE_CHAIN_RPC=${DISABLE_CHAIN_RPC:-true}
      - DISABLE_CHAIN_GRPC=${DISABLE_CHAIN_GRPC:-true}
```
**步骤 3**：拉取并重启代理
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull proxy
source ./config.env && docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d --no-deps proxy
```
**步骤 4**：关闭外部端口 26657

您可以关闭端口 26657 的外部访问。

这是可选的，但强烈建议执行：
```
sed -i 's|- "26657:26657"|#- "26657:26657"|g' docker-compose.yml
```
这将注释掉您节点容器中的端口映射：
```
node:
    container_name: node
    ...
    ports:
      - "5000:26656" #p2p
      #- "26657:26657" #rpc
```
**步骤 5**：重启节点：
```
source ./config.env && docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d --no-deps node
```
**关闭端口 26657 后访问节点状态**

如果您之前通过 `curl -s http://localhost:26657/status` 访问节点状态，现在可以从容器内部访问：

=== "选项 1：从代理容器访问（使用 `curl`）"

	```
	docker exec proxy curl -s node:26657/status | jq
	```
=== "选项 2：从节点容器访问（使用 `wget`）"

	```
	docker exec node wget -qO- http://localhost:26657/status | jq
	```

对于使用 `watch` 的持续监控：
```
watch -n 5 'docker exec node wget -qO- http://localhost:26657/status | jq -r ".result.sync_info | \"Block: \(.latest_block_height) | Time: \(.latest_block_time) | Syncing: \(.catching_up)\""'
```

### Cosmovisor 更新需要多少空闲磁盘空间？如何安全删除 `.inference` 目录中的旧备份？
Cosmovisor 在每次执行更新时都会在 `.inference` 状态文件夹中创建完整备份。例如，您可以看到类似 `data-backup-<some_date>` 的文件夹。
截至 2025 年 11 月 20 日，数据目录大小约为 150 GB，因此每个备份将占用大约相同的空间。
为安全执行更新，建议保留 250 GB 以上的空闲磁盘空间。
您可以删除旧备份以释放空间，但在某些情况下这可能仍不足，您可能需要扩展服务器磁盘。
要删除旧备份目录，您可以使用：
```
sudo su
cd .inference
ls -la   # view the list of folders. There will be folders like data-backup... DO NOT DELETE ANYTHING EXCEPT THESE
rm -rf <data-backup...>
```

### 如何防止 NATS 的无界内存增长？

NATS 目前配置为无限期存储所有消息，导致内存使用量持续增长。
推荐的解决方案是为 NATS 流中的消息配置 24 小时的生存时间（TTL）。

1. 安装 NATS CLI。请按照此处的说明安装 Golang：[https://go.dev/doc/install](https://go.dev/doc/install)。然后安装 NATS CLI：
   ```
   go install github.com/nats-io/natscli/nats@latest
   ```
2. 如果您已安装 NATS CLI，请运行：
    ```
    nats stream info txs_to_send --server localhost:<your_nats_server_port>
    nats stream info txs_to_observe --server localhost:<your_nats_server_port>
    ```
### 如何更改 `inference_url`？

如果您执行了以下操作，可能需要更新 `inference_url`：

- 您更改了 API 域名；
- 您将 API 节点迁移到了新机器；
- 您重新配置了 HTTPS/反向代理；
- 您正在迁移基础设施，并希望主机条目指向新的端点。

此操作无需重新注册、重新部署或密钥再生。更新 `inference_url` 通过与初始注册相同的交易（`submit-new-participant msg`）完成。

链逻辑会检查您的主机（参与者）是否已存在：

- 如果参与者不存在，交易将创建一个新参与者；
- 如果参与者已存在，仅可更新三个字段：`InferenceURL`、`ValidatorKey`、`WorkerKey`。

所有其他字段将自动保留。

这意味着更新 `inference_url` 是一个安全且非破坏性的操作。

!!! note 

    当节点更新其执行 URL 时，新 URL 会立即对来自其他节点的推理请求生效。然而，`ActiveParticipants` 中记录的 URL 直到下一个纪元才会更新，因为提前修改会使其与参与者集合相关的加密证明失效。为避免服务中断，建议在下一个纪元完成前同时保持旧 URL 和新 URL 处于运行状态。

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
通过以下链接验证更新，并将末尾替换为您的节点地址 [http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/participant/gonka1qqqc2vc7fn9jyrtal25l3yn6hkk74fq2c54qve](http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/participant/gonka1qqqc2vc7fn9jyrtal25l3yn6hkk74fq2c54qve)

### 为什么我的 `application.db` 会变得如此庞大，如何解决？

某些节点存在 `application.db` 大小持续增长的问题。

`.inference/data/application.db` 存储链的状态历史（非区块），默认为 362880 个状态。

状态历史包含每个状态的完整默克尔树，将其保留更短的时间是安全的，例如仅保留 1000 个区块。

修剪参数可以在 `.inference/config/app.toml` 中设置：

```
...
pruning = "custom"
pruning-keep-recent = "1000"
pruning-interval    = "100"
```

新的配置将在 `node` 容器重启后生效。但存在一个问题——即使启用了修剪，数据库清理仍然非常缓慢。

重置 `application.db` 有几种方法：

=== "选项 1：从快照完全重新同步"

1) 停止节点
        ```
        docker stop node
        ```

    2) 删除数据 
        ```
        sudo rm -rf .inference/data/ .inference/.node_initialized
        sudo mkdir -p .inference/data/
        ```

    3) 启动节点
        ```
        docker start node
        ```

    此方法可能需要一些时间，在此期间节点无法记录交易。

请使用可用的可信节点下载快照。

=== "选项 2：从本地快照重新同步"

快照默认启用并存储在 `.inference/data/snapshots` 中

1) 准备新的 `application.db`（`node` 容器仍在运行）

1.1) 为 `inferenced` 准备临时主目录
        ```
        mkdir -p .inference/temp
        cp -r .inference/config .inference/temp/config
        mkdir -p .inference/temp/data/
        ```

    1.2) 复制快照: 
        ```
        cp -r .inference/data/snapshots .inference/temp/data/
        ```

    1.3) 列出快照 
        ```
        inferenced snapshots list --home .inference/temp
        ```

    复制最新快照的高度。

1.4) 从快照开始恢复（`node` 容器仍在运行） 
        ```
        inferenced snapshots restore <INSERT_HEIGHT> 3  --home .inference/temp
        ```

    这可能需要一些时间。完成后，您将在 `.inference/temp/data/application.db` 中获得新的 `application.db`

2) 用新容器替换 `application.db`

2.1) 停止 `node` 容器（从另一个终端窗口） 
        ```
        docker stop node
        ```

    2.2) 移动原始 `application.db` 
        ```
        mv .inference/data/application.db .inference/temp/application.db-backup
        mv .inference/wasm .inference/wasm.db-backup
        ```

    2.3) 用新容器替换它 
        ```
        cp -r .inference/temp/data/application.db .inference/data/application.db
        cp -r .inference/temp/wasm .inference/wasm
        ```

    2.4) 启动 `node` 容器（从另一个终端窗口）: 
        ```
        docker start node
        ```

    3) 等待 `node` 容器同步完成并删除 `.inference/temp/`

如果您有多个节点，建议逐个清理。

=== "选项 3：实验性"

另一种可选方法是在单独的 CPU 机器上启动 `node` 容器的独立实例，并设置为严格验证者模式：

    - 保留极短的历史记录
    - 仅允许 RPC 和 API 访问 `api` 容器

一旦运行，将现有 `tmkms` 卷移动到新节点（先禁用现有节点的区块签名）。

这是该方法的一般思路。如果您决定尝试并有任何疑问，请随时在 [Discord](https://discord.com/invite/RADwCT2U6R) 上联系。

=== "选项 4：升级到修剪修复"

现在已提供修复程序，以解决长期存在的问题：在许多修剪配置下 `application.db` 持续增长。
	此改进由 [Lelouch33](https://github.com/Lelouch33) 贡献，并包含在发布版本 [`0.2.10-post6`](https://github.com/gonka-ai/gonka/compare/main...release/v0.2.10-post6) 中。使用更新后的逻辑和以下设置，`application.db` 可保持在约 100 GB：

	- `SNAPSHOT_INTERVAL=1000`
	- `SNAPSHOT_KEEP_RECENT=2`
	- `pruning-keep-recent = "20000"`
	- `pruning-interval = "512"`

参考：

	- [https://github.com/gonka-ai/gonka/issues/819#issuecomment-3996332369](https://github.com/gonka-ai/gonka/issues/819#issuecomment-3996332369)
	- [https://github.com/gonka-ai/gonka/pull/867](https://github.com/gonka-ai/gonka/pull/867)

升级到此二进制文件后，修剪将在下一个快照区块后开始。此过程较为繁重，可能在移除旧状态历史时暂时降低 `node` 容器的性能。

为减少操作影响，建议逐个节点应用更新，并使用更高的 `pruning-interval`（例如 `512`）以避免过于频繁的修剪。

如果节点在修剪期间显著变慢，重启节点容器可能有助于其恢复。

建议在即将发布的 v0.2.11 升级前应用此更新，以防止大量节点同时开始修剪。

应用更新（示例来自 `v0.2.7`，其 `inferenced` 相同）：
	```
	# Pre-check: Ensure no confirmation PoC is active (fails entire script if not false)
	echo "--- Pre-flight Check: Confirmation PoC Status ---" && \
	CONFIRMATION_POC_ACTIVE=$(curl -sf "https://node3.gonka.ai/v1/epochs/latest" | jq -r '.is_confirmation_poc_active') && \
	[ "$CONFIRMATION_POC_ACTIVE" = "false" ] && \
	echo "OK: No confirmation PoC active" && \
	
	sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.10-post7/ .inference/data/upgrade-info.json  && \
	sudo mkdir -p  .inference/cosmovisor/upgrades/v0.2.10-post7/bin/  && \
	wget -q -O  inferenced.zip 'https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.10-post7/inferenced-amd64.zip' && \
	echo "5ed8941d50779fa2359a9745263b324b887465104f81073827321945ab1f392a  inferenced.zip" | sha256sum --check && \
	sudo unzip -o -j  inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.10-post7/bin/ && \
	sudo chmod +x .inference/cosmovisor/upgrades/v0.2.10-post7/bin/inferenced && \
	echo "Inference Installed and Verified"  && \
	
	# Link Binary
	echo "--- Final Verification ---" && \
	sudo rm -rf .inference/cosmovisor/current  && \
	sudo ln -sf upgrades/v0.2.10-post7 .inference/cosmovisor/current  && \
	echo "d9093b225cbd531afc56c99d0b0996b1fa2896c0745cd73293f0de08132f7754 .inference/cosmovisor/current/bin/inferenced" | sudo sha256sum --check && \
	
	# Restart 
	source config.env && docker compose up node --no-deps --force-recreate -d
	```

### 自动 `ClaimReward` 未成功，我该怎么办？

如果您有未领取的奖励，请执行：
```
curl -X POST http://localhost:9200/admin/v1/claim-reward/recover \
    -H "Content-Type: application/json" \
    -d '{"force_claim": true, "epoch_index": 106}'
```
要检查您是否有未领取的奖励，可以使用：
```
curl http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/epoch_performance_summary/106/<ACCOUNT_ADDRESS> | jq
```

## 升级

### 升级 v0.2.12：升级前模型清理

!!! note "重要"
	此清理过程**必须在升级前完成**。如果在清理模型前升级，您的节点将被拒绝并下线。

	版本 0.2.12 将移除所有不在升级后批准列表中的治理模型。在主网上，仅保留之前强制执行的模型和 Kimi。

	每个DAPI都会在本地持久化其MLNode配置。启动时，它会将每个配置的模型与链上治理列表进行验证。如果配置中包含至少一个不受支持的模型，则整个节点将被拒绝，主机将离线。

	版本0.2.11通过将运行时视图裁剪为强制模型来掩盖了这个问题，因此即使持久化配置中仍包含额外模型，`/admin/v1/nodes`也显示为干净。版本0.2.12停止了这种裁剪，意味着直接加载持久化配置。

	为解决此问题，以下脚本将查找每个在`/admin/v1/config`中包含额外模型的节点，并向`/admin/v1/nodes/<id>`发送一个包含清理后配置的`PUT`请求。这些更改将在60秒内持久化。剩余模型的参数、硬件和端口将完全保留。未列出强制模型的节点将被跳过，需要手动修复。

	将以下脚本粘贴到主机的shell中。默认情况下，它将应用更改。若要预览更改而不应用，请设置`APPLY=dry`（或任何非`--apply`的值）。

	仓库中的脚本：

- [Bash](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/proposals/governance-artifacts/update-v0.2.12/cleanup/cleanup_models.sh)
- [Python](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/proposals/governance-artifacts/update-v0.2.12/cleanup/cleanup_models.py).

```bash
ADMIN=${ADMIN:-http://127.0.0.1:9200}
KEEP=${KEEP:-Qwen/Qwen3-235B-A22B-Instruct-2507-FP8}
APPLY=${APPLY:-"--apply"}

curl -sS "$ADMIN/admin/v1/config" | jq -r --arg k "$KEEP" '
  .nodes[] | "\(.id): " + (
    if (.models | has($k) | not) then "skip (\(.models | keys))"
    elif (.models | length) == 1 then "ok"
    else "\(.models | keys) -> [\($k)]" end)'

if [[ "$APPLY" == "--apply" ]]; then
  curl -sS "$ADMIN/admin/v1/config" \
    | jq -c --arg k "$KEEP" \
        '.nodes[] | select((.models | has($k)) and (.models | length > 1)) | .models = {($k): .models[$k]}' \
    | while IFS= read -r p; do
        id=$(jq -r .id <<<"$p")
        curl -sS -f -X PUT -H 'Content-Type: application/json' -d "$p" \
          "$ADMIN/admin/v1/nodes/$id" >/dev/null && echo "$id: updated"
      done
  echo "done; persisted within 60s"
else
  echo "preview only; rerun without APPLY=dry to commit"
fi
```


运行脚本后等待60秒，以确保更改已持久化，然后再触发升级。然后验证配置：

```bash
curl -sS http://127.0.0.1:9200/admin/v1/config \
  | jq '.nodes[] | {id, models: (.models | keys)}'
```

预期输出：
```json
{
  "id": "<nodeId>",
  "models": [
    "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8"
  ]
}
```
*(其他节点将遵循相同格式)*



### 升级v0.2.12：预下载二进制文件

```
# 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.12/bin \
              .inference/cosmovisor/upgrades/v0.2.12/bin && \

# 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.12/decentralized-api-amd64.zip" && \
echo "d0143a95e12e1ada06cfea5e4d3deab13534c3523c967e9a6b87ac9f9bf3247d decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.12/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.12/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

# 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.12/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.12/inferenced-amd64.zip" && \
echo "df7656503d39f6703767d32d5578d1291e32cb114844d8c1cd0f134d1bf4babd inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.12/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.12/bin/inferenced && \
echo "Inference Installed and Verified" && \

# 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.12/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.12/bin/inferenced && \
echo "94ce943338d12844028e84fe770106c9d28d866cf0af99f27da30f56d69efa34 .dapi/cosmovisor/upgrades/v0.2.12/bin/decentralized-api" | sudo sha256sum --check && \
echo "642eb9858cd77d182f3e1c4d44553f5379d615983430e1fd8e85f09632af4271 .inference/cosmovisor/upgrades/v0.2.12/bin/inferenced" | sudo sha256sum --check
```

## 奖励计划

### 什么是奖励计划？谁可以参与？奖励如何支付？

无需成为主机即可参与：许多奖励授予提交修复、实现改进或为更广泛的Gonka基础设施做出贡献的贡献者。

奖励在治理批准后从社区池中支付。漏洞报告尤其受到重视，负责任的披露有助于防止利用并提升网络安全性，同样有资格获得奖励。

最终的奖励决定、金额和类别始终由社区治理决定。

### 漏洞奖励定价模型是什么

衡量严重性的一种常见方式是： 
```
Risk = Impact × Likelihood
```
影响从网络角度评估（需具备全网影响才能评为高/关键）。仅影响单个参与者的通常上限为低或中等。

**影响等级**

| 等级 | 描述 | 示例 |
|----------|--------------------------------------|--------------------------------------------------------------------------|
| 关键 | 对整个网络造成灾难性影响 | 完全控制网络 |
| 高 | 大规模显著干扰 | 网络崩溃/停止；模块被盗；所有参与者的奖励错误 |
| 中等 | 中等程度干扰，范围有限 | 共识或奖励完整性面临风险；单个参与者的资金或可用性 |
| 低 | 对孤立参与者影响轻微，无链上影响 | 单个组件，对单个参与者产生轻微影响，非链上 |

**可能性**

- **有机——非故意；** 在正常条件下发生。根据概率估算（条件触发的频率、使用模式）。
- **故意——盈利性**——为经济利益而利用。当收益大且成本/复杂性低时，可能性更高。
- **故意——恶意破坏**——为造成干扰而利用。当对全网产生影响且成本低时，可能性更高；单个参与者的恶意破坏→可能性较低。

**风险矩阵**

| 影响 \ 可能性 | 高 | 中 | 低 |
|---------------------|----------|----------|---------------|
| 关键 | 关键 | 关键 | 高 |
| 高 | 关键 | 高 | 中 |
| 中 | 高 | 中 | 低 |
| 低 | 中 | 低 | 信息性 |

### 如何开始参与赏金计划？

- 可以创建一个新的 GitHub 问题/讨论，提出改进建议，并获得社区反馈以判断是否值得实施。
- 或者选择一个[标记为 up-for-grabs 的现有问题](https://github.com/gonka-ai/gonka/issues?q=is%3Aissue%20state%3Aopen%20label%3Aup-for-grabs)。开始前，请留下一条简短评论，说明工作已启动并提供大致预计完成时间，以便他人了解情况，避免重复劳动。

### 建议的漏洞报告流程是什么？

- 如果问题严重性不高或非关键（影响有限，无全网影响），且修复工作量小，直接提交 PR 通常是合适的。
- 如果问题严重性为高或关键，请通过私密方式向可信的社区成员（长期 Gonka 仓库贡献者）报告，可以单独报告，或连同修复方案一起在私有分叉中提交。
- 如果问题看似属于更广泛的类别，且系统性审查很可能发现同类型其他问题，请注明计划进行审查。这有助于避免并行的重复审查。

要参与贡献，请选择一个问题，提交可靠的修复方案，并在相关开发渠道中分享链接以获取反馈。

### 我可以在哪里查看谁获得了赏金、赏金内容及时间？

最可靠的来源是链上记录和 [GitHub](https://github.com/gonka-ai/gonka/)。请以它们作为主要依据，确认谁获得了赏金、赏金内容及执行时间。

## 错误

### `No epoch models available for this node`

在这里您可以找到常见错误示例以及节点日志中可能出现的典型日志条目。

```
2025/08/28 08:37:08 ERROR No epoch models available for this node subsystem=Nodes node_id=node1
2025/08/28 08:37:08 INFO Finalizing state transition for node subsystem=Nodes node_id=node1 from_status=FAILED to_status=FAILED from_poc_status="" to_poc_status="" succeeded=false blockHeight=92476
```
这实际上不是错误。它仅表示您的节点尚未被分配模型。很可能是因为您的节点尚未参与过 Sprint，未获得投票权，因此尚未分配模型。
如果您的节点已通过 PoC，则不应再看到此日志。如果没有，PoC 每约 24 小时进行一次。

### 从状态同步快照启动时如何修复 `err="no validator signing info found"`？

如果在从状态同步快照启动时反复遇到 `err="no validator signing info found"`，通常与 Cosmos SDK `iavl-fastnode` 行为有关。安全的解决方法是在初始启动时禁用 `fastnode`，然后（可选）在节点完全同步后重新启用。

**修复（Docker）：**

1.	停止节点：
```
docker stop node
```
2. 在 `.inference/config/app.toml` 中设置：
```
iavl-disable-fastnode = true
```
3. 启动节点：
```
docker start node
```
重启后，问题不应再出现。

!!! note 
	`main` 包含 v0.2.10-post6。从这个版本开始，节点会自动应用此设置，因此通常无需手动更改。

## 推理

### 为什么 4,096 个输出令牌的限制会导致模型在思考时停滞——返回零个令牌？

**如果你遇到以下情况**

- 你看到 `content=null` 和 `finish_reason=length`。
- 模型是“沉默”的——使用情况显示令牌，但没有文本。
- 带有 `max_tokens=100` 的探测请求没有返回任何内容。

**修复优先：适用于 Kimi-K2.6 的可用配置**

如果你没有时间深入研究——请复制此负载作为起点。截至 2026-05-28，它在两个公共代理上可用；在使用前请与你的代理运营商确认其是否仍有效。

```json
{
  "model": "moonshotai/Kimi-K2.6",
  "messages": [
    {"role": "user", "content": "Write hello world in Python."}
  ],
  "max_tokens": 4096,
  "thinking": {"type": "disabled"},
  "thinking_token_budget": 0,
  "temperature": 0.2
}
```

为什么是这些确切字段：

- `max_tokens: 4096` — 让模型使用全部可用的输出配额。当前代理的有效上限为 3,072（参见 Q3）——超出此值无效。最小值为 256，否则网关可能强制将 `thinking_token_budget` 设为零。
- `thinking: {"type": "disabled"}` — 通过聊天模板提示禁用隐藏思考。
- `thinking_token_budget: 0` — 双重保险：在生成参数级别显式将配额设为零（参见 Q2）。
- **模型 ID 区分大小写：** `moonshotai/Kimi-K2.6`（大写 K）在 `gonka-api.org` 上，`moonshotai/kimi-k2.6`（小写 k）在 `gonkagate.com` 上。收到 404 —— 调整大小写。与 `GET /v1/models` 的响应交叉核对。

可直接使用的 curl 命令（替换 `<broker>` 和模型 ID 的大小写）：

```bash
curl -sS https://<broker>/v1/chat/completions \
  -H "Authorization: Bearer $GONKA_API_KEY" \
  -H "Content-Type: application/json" \
  -d @payload.json
```

如果返回了有意义的文本——问题出在您的原始负载中；请逐字段对比。如果 `content=null`——从响应中捕获 `id` 并发送给经纪商支持团队。

**首先检查您的经纪商是否启用了规则**

网关行为取决于经纪商，且会随时间变化。运行此测试：

```bash
curl https://<your-broker>/v1/chat/completions \
  -H 'content-type: application/json' \
  -H "Authorization: Bearer $GONKA_API_KEY" \
  -d '{
    "model": "moonshotai/Kimi-K2.6",
    "messages": [{"role": "user", "content": "one word"}],
    "max_tokens": 100
  }'
```

| 网关版本 | 预期结果 |
|----------------|---------------------|
| `devshard ≥ 0.2.13`（强制低于256时归零生效） | `finish_reason="length"`，约0–10个推理token |
| 较旧版本 | `finish_reason="length"`，约40–60个推理token（默认 `max_tokens / 2`） |

以下规则描述的是近期网关代码（`devshard ≥ 0.2.13`）。您的经纪商可能尚未更新。不确定版本？——请先运行上述修复。如果能返回有意义的文本，则网关版本足够新；否则，请将 `response.id` 发送给经纪商支持团队，询问更新事宜。

**模型和网关端发生了什么****Kimi-K2.6 特性。** 模型输出 `<think>…</think>` 块。**两个部分（`<think>` 和可见内容）均等消耗 `max_tokens`。** 当 `max_tokens` 较小时，模型将全部预算消耗在 `<think>` 中，仅返回 `</think>`，而 vLLM 会将其作为特殊标记剥离 → `content=null`，`finish_reason=length`。从客户端看——“0个token”。

**网关对 `thinking_token_budget` 的规则（PR #1202，devshard 0.2.13+）：**

| 条件 | 网关的行为 |
|---------|---------------------|
| `max_tokens < 256` | `ttb = 0`（强制归零，覆盖客户端） |
| `ttb` 未设置，`max_tokens >= 256` | `ttb = max_tokens / 2` |
| `ttb` 由客户端设置 | 使用客户端的值 |
| 始终 | 限制：`ttb ≤ 96,000` 和 `ttb ≤ max_tokens − 64` |

此外：

- **`max_tokens` 下限 → 16**（PR #1227）——以前 `max_tokens=1` 可靠地产生 `content=null`。现在它被静默提升至16。
- **`thinking: {"type":"disabled"}` 镜像**（PR #1224）——网关将其镜像到 `chat_template_kwargs.thinking=false`。Kimi 聊天模板读取该参数。

历史上产生 `content=null` 的场景（`max_tokens=1`，探测形状 `max=100, min=100, ttb=50`）现在通过新版网关返回非空内容。在 `gonkagate.com`（2026-05-25）上，没有 `max_tokens=100` 时返回约50个推理token——此时 force-zero-below-256 未生效。

**对于推理用户：**

- 请使用网关版本 ≥ 0.2.13（发布于2026-05-23+）的经纪商重新测试。
- 看到零token——捕获响应中的 `id` 并发送给经纪商。提取方法：

  ```bash
  curl ... | jq .id
  ```

  格式：`devshard-<short>-<short>`，例如 `devshard-7a4f-31b2`。发送位置：经纪商支持渠道（对于 `gonka-api.org`——网站上的支持链接；对于 `gonkagate.com`——`/contact` 部分）。
- **不要仅依赖 `thinking:disabled`**——为确保安全，请显式设置 `thinking_token_budget: 0`（参见Q2）。

**对于经纪商：** 在 0.2.13 之前版本——请按您的验证/发布周期更新（无需紧急：旧版本客户端和隔离规则需重新认证）。在更新前，客户端应用上述变通方案；更新后，零输出 `content=null` 的情况将消失。

### 使用 Kimi K2 时，整个token限制可能全部用于思考而无实际输出。这是输出限制、带宽还是上游问题？

**这是网关策略，而非模型限制。** `thinking_token_budget` 解析器（PR #1202）默认分配 `max_tokens / 2` 用于推理。在工具密集型流程中，预算在产生任何有用输出前即耗尽。缓解方法是显式设置 `thinking_token_budget: 0` 或 `thinking: {"type": "disabled"}`（网关通过 PR #1224 将其镜像到 `chat_template_kwargs`）。模型仅遵循预算。

与Q1原因相同——模型将 `max_tokens` 分配给 `<think>` 和可见内容。这不是带宽问题，也不是输出限制。

**两个逃生出口**

1. **`thinking: {"type": "disabled"}`**——网关将其镜像到 `chat_template_kwargs.thinking=false`（Kimi 聊天模板读取该参数），并移除顶层 `thinking`。`"adaptive"` 和 `"auto"` 被接受（Claude Code CLI / Anthropic SDK 预设，PR #1224）——两者均解析为 `enabled`。
2. **`thinking_token_budget: 0`**——显式设置为零时，直接作为生成参数传递给 vLLM，可靠地将思考预算归零。

**重要细节：** 这两种机制作用于不同层级（聊天模板提示 vs. 生成参数），互不重叠。`thinking:disabled` 不会自动归零 `thinking_token_budget`——在默认 `max_tokens=4096` 且仅设置 `disabled` 的情况下，模型仍会从网关解析器获得隐藏的 `ttb=2048`。在我们的测试中，Kimi 即使在高推理负载提示下也尊重 `thinking:disabled`。模型文档（计划中的 `docs/chat-api/kimi-k2.6.md`）警告在某些推理场景下模型可能忽略该提示——我们未复现，但仍做防范。**双重保障：** 对于关键流程，请同时发送这两个参数。

**数值确认**

相同的bug发现提示，`max_tokens=500`，答案在意义上完全相同：

| 配置 | usage.completion_tokens | 实际耗时 |
|---|---|---|
| `thinking: {"type":"disabled"}` | **65** | 3.6s |
| 默认值（网关解析器 → ttb = max_tokens/2 = 250） | **312** | 12.5s |

即使对于简单任务，默认预算的一半也会分配给隐藏思考——因此建议在工具密集型/代理流程中禁用思考。

**对于推理用户：**

- 无需推理的工具密集型/代理流程——`"thinking": {"type": "disabled"}`（Kimi）或 `"enable_thinking": false`（Qwen，自动翻译）。
- 复杂推理——显式设置 `thinking_token_budget`（不要依赖默认的 `max_tokens / 2`）。
- 如果 `thinking:disabled` 仍导致你的提示词耗尽——显式地将其复制为 `thinking_token_budget: 0`。

**对于中介：** 在 0.2.13 之前版本——按周期更新。在更新前，客户端使用变通方案。在登陆页面注明：Kimi 用于工具密集型流程时，需使用 `thinking:disabled`，或显式设置 `thinking_token_budget`，或使用较大的 `max_tokens`。

### Kimi 的输入令牌上限为 4k 令牌，输出上限为 8,192 令牌。这些限制何时会提高？

**问题中的数字不正确**

- **输出上限：3,072 令牌**（在两个测试的中介上均如此，即使使用 `max_tokens=8000`，也恰好在 3,072 时返回 `finish_reason=length`）。
- **输入：最高达 240,000 令牌**（在主网 Kimi 部署中使用 `--max-model-len`）。并非 4,000。

**输出上限的来源**

代码中的网络上限为 4,096（`RequestMaxTokensCap`），但有效限制更低。确切机制是黑箱。可能的解释（按可能性排序，**未经公开代码确认**）：

1. 网关默认的 `DefaultRequestMaxTokens = 3,072` 未被中介操作员覆盖。
2. 中介操作员通过管理端点（`POST /v1/admin/settings`）为每个模型设置了 `request_max_tokens_cap = 3,072`。
3. 上游 DAPI 或主机端限制（例如 vLLM `--max-tokens-per-request` 或加载器约束）。

要确切了解——请向中介查询每个模型的 `request_max_tokens_cap` 值。

**3,072 令牌中能容纳多少内容**

| 场景 | 能否容纳于 3,072 令牌中？ |
|----------|-------------------|
| ~1,900–2,200 个常规英文单词 | 是 |
| ~600–800 行 Python/JS 代码 | 是 |
| 简短回答（5–10 句话） | 是 |
| 一次工具调用 + 中等大小 JSON（`arguments` ≤ 500 令牌） | 是 |
| 小型结构化输出（3–5 个摘要要点） | 是 |
| 长文档摘要（>10k 源令牌） | 否 |
| 大型代码差异（>2k 行） | no |
| 3+ parallel tool calls in one response | no |
| Agentic loop: reasoning + tool calls + visible content at once | no |

对于第二组使用场景——向经纪人申请提高上限（参见**对于经纪人**）。

**如何提高上限**

输出上限由**经纪人**控制，而非网络。要提高它——请联系您的经纪人：他们可以通过一次管理员调用增加 `request_max_tokens_cap`（无需代码更改）。若要将网络范围的上限提升至超过 4,096，则需要向网关代码提交 PR 并发布新版本；您可以通过在 `gonka-ai/gonka` 上发起 GitHub 讨论来启动此流程。

对于好奇者/运维人员：区块链存储每个模型的价格参数（`coins_per_input_token`、`coins_per_output_token`）和部署参数（`model_args`），但没有字段用于硬性输出限制——这种放宽是经纪人本地策略，而非治理定义的值。

**240k 输入的来源**

主网 Kimi-K2.6 部署通过链上治理提案 v0.2.12（`inference-chain/app/upgrades/v0_2_12/upgrades.go:kimiGovernanceModel()`）注册：

```text
ModelArgs: ["--max-model-len","240000",
            "--tool-call-parser","kimi_k2",
            "--reasoning-parser","kimi_k2"]
VRam: 720 (GB)
```

模型卡声明原生上下文为256K。网关对输入无单独限制，仅受通用主体大小（10 MiB）和消息数量（≤ 2,048）约束——详见`docs/chat-api/README.md`中的“请求限制”部分（计划中的文档）。

**重要注意事项（开放问题）**

即使代理同意提高输出上限，单个节点仍可能以较小的`--max-model-len`启动。网关路由层不考虑每台主机的上下文容量（[问题 #818](https://github.com/gonka-ai/gonka/issues/818)）。对于大负载（>50k），落在“小”节点上是系统性行为，而非瞬时随机性。

**对于推理用户：**

- 实际输出上限由代理决定——向其询问每个模型的`request_max_tokens_cap`值。
- 遇到小输入限制——这几乎肯定是某个节点上的`--max-model-len`，而非全局限制。路由层未考虑每台主机的上下文（问题 #818）；对于大负载（>50k），这是系统性问题。解决方法：重试或将请求拆分为多个API调用。
- 遇到输出上限——请代理提高它。网络范围的提升（超过4,096）需要代码变更；通过在`gonka-ai/gonka`上发起GitHub讨论来申请。

**对于代理：**

- 按模型提升上限只需通过`POST /v1/admin/settings`配合`model_limits[].request_max_tokens_cap`执行一次管理调用，无需代码变更。这会增加每请求预付金暴露风险及触发每主机`--max-model-len`（节点上出现5xx）的风险。仅在确认所有预付金节点上`--max-model-len`后，针对确有需求的模型提升。
- 网络范围的提升（超过4,096）需提交网关代码PR并发布新版本。若长期存在大输出需求——请发起讨论。

### 像Hermes、OpenClaw这类带有30k+系统提示的代理为何在Kimi上失败？

**简要说明**

Kimi模型在模型和网关层面均接受30k+输入，但稳定性取决于路由。原生窗口为256K，主网部署使用`--max-model-len 240000`，网关接受最大10 MiB的主体。实测：单次约69,000提示标记（≈800条消息 × 80词）可在5.5秒内完成。对于持续/重复的长请求（>50k），会遇到不稳定性（问题 #818）——对于大负载（215k），重复尝试可能因503失败。

**验证来源（均在`gonka-ai/gonka`中）**

- 原生上下文256K——`docs/chat-api/`中的模型卡（确切文件名计划作为chat-api文档集的一部分）。
- 主网部署参数（链上）——`inference-chain/app/upgrades/v0_2_12/upgrades.go:kimiGovernanceModel()`。
- 主体/消息限制（10 MiB，≤ 2,048条消息）——`docs/chat-api/README.md`（计划中），即“请求限制”部分。

**当30k失效时——两种典型原因****1. 代理负载中的单个被拒绝字段。** 网关维护严格的白名单。若代理发送了任一非标准字段（`tags`、`enforced_tokens`、`plugins`、`guided_json`）——整个请求将被拒绝并返回HTTP 400。Hermes特有的`tags`拒绝——锚点`#reject-tags`在`docs/chat-api/troubleshooting.md`中（计划中）。实测：一个有效的69k负载 + `tags:["session:abc"]` → 2秒内返回HTTP 400。

**2. 路由至具有较小`--max-model-len`的节点。** 网关路由层在路由时未考虑主机的实际上下文大小（[问题 #818](https://github.com/gonka-ai/gonka/issues/818)；另见计划中的`known-issues.md` §3）。对于极长负载（>50k，尤其是>200k），落在“小”节点上是**网络层面的系统性行为**，而非客户端错误：我们的测量显示5×215k = 0/5成功。请求将在vLLM端失败。

相关构建者请求：[问题 #1229](https://github.com/gonka-ai/gonka/issues/1229)（2026年5月开启），代理场景的阻塞问题——长推理链、工具调用兼容性、超出输出限制后的延续。

**快速自检清单**

1. 逐一移除字段`tags`、`enforced_tokens`、`plugins`、`strict`、`guided_json`、`guided_regex`、`guided_grammar`、`guided_choice`，每次移除后重新发送相同请求。
2. 若移除所有字段仍无效——检查`tools[].function.parameters`中的模式深度（≤ 16）和节点总数（≤ 256），参见Q9。
3. 负载无问题但仍失败——这是网络层面问题（问题 #818）。解决方法：重试或拆分请求。

**对于推理用户：**

- 首先检查负载是否符合`docs/chat-api/README.md`中的白名单（计划中）。大多数Hermes/OpenClaw的400错误由单个字段或模式引起。
- **通用代理消息如“上游模型提供者拒绝”具有误导性：** 一些代理将具体的网关400错误合并为通用消息，一些则传递原始错误（`"Chat completions parameter \"tags\" is currently rejected by the Gonka network..."`附文档链接）。代理对比——`comparison-brokers.md`（计划中）。**若一个代理显示通用错误——尝试另一个以获取可读信息并定位根本原因。**
- 负载无问题但仍失败——网络层面（问题 #818）。解决方法：重试或拆分；对于持续>50k负载，单次重试通常不足——请拆分。

**对于代理：**

- (1) 在主页、通过`/v1/models`端点或文档中明确显示每个模型的原生上下文窗口，并注明由于主机异构性，每请求有效容量可能更低（问题 #818）。部分代理故意省略此信息以避免过度承诺——这是一种可辩护的选择。(2) 在主机级容量公告实现前——考虑客户端过滤或“首选主机”列表。
- **用户体验：** 网关返回包含字段名和消息的特定400错误（`"Chat completions parameter \"tags\" is currently rejected by the Gonka network..."` + 文档链接）。我们建议在生产环境中将详细消息传递给客户端——这能加速诊断。**安全提示：** 详细消息可能泄露内部字段名、主机路径和验证器ID，有助于枚举或提示注入探测。保守的屏蔽是一种可辩护的默认做法。若为安全起见将其包装为通用`"upstream provider rejected"`——请采用混合方法：在异步日志/错误追踪中保留完整细节，向客户端返回包含跟踪ID的通用消息。代理兼容性映射——`docs/chat-api/agents.md`（计划中）。

### 为何Kimi在输出超过4k–8k标记时生成格式错误的JSON工具调用？

既非带宽问题，也非Gonka端限制。三个重叠原因。

**(a) `max_tokens`截断**

在测试的代理上，有效输出上限为3,072标记；网关网络上限为4,096。当助手在`arguments`中生成包含大型JSON块的工具调用并同时输出可见内容时，可能触及代理的实际上限，导致JSON被截断。各代理覆盖详情——Q3。

**(b) Kimi-K2.6工具解析器ID重复冲突**

`[vLLM PR #21259 — UNVERIFIED]`。使用`n > 1`时，`kimi_k2`解析器在每选择循环内重新计算`history_tool_call_cnt`——两条分支均获得`id = functions.<name>:0`。网关在vLLM响应中检测到重复ID，根据OpenAI规范拒绝并返回HTTP 400。锚点`#reject-duplicate-tool-call-id`在`docs/chat-api/troubleshooting.md`中（计划中）。上游修复——[vLLM PR #21259](https://github.com/vllm-project/vllm/pull/21259)（合并状态未经独立确认）。

**(c) Hermes工具解析器在多个工具块中出现JSONDecodeError**

`[vLLM #17790 — awaiting upstream fix]`。不同解析器，不同问题：当模型在一个响应中发出多个工具调用块时，出现`JSONDecodeError`——[vLLM #17790](https://github.com/vllm-project/vllm/issues/17790)。相关问题：`<tool_call>`在`<think>`内破坏Hermes解析——[vLLM #42021](https://github.com/vllm-project/vllm/issues/42021)。这些问题不依赖Gonka——等待上游修复。

**推理用户：**

- **在客户端发送后续消息前，将 `tool_call.id` 重写为规范格式 `functions.<name>:<global_idx>`** —— Moonshot 官方推荐，已在 `docs/chat-api/troubleshooting.md#reject-duplicate-tool-call-id`（计划中）重复。另一种选择是使用新的 UUID。
- **不要按 ID 去重** —— 两个相同 ID 的调用可能包含不同结果；丢失它们 = 丢失代理的工作。
- **对包含工具调用的响应提升 `max_tokens`**；大型 `arguments` 数据块会迅速达到上限。
- 通用代理错误“上游模型提供方拒绝”通常意味着网关端拒绝，而非模型本身。首先检查消息和 ID 是否重复，再怀疑模型（参见 Q4 中的代理差异）。

**对于代理：**

- 考虑在网关端按 ID 去重——两个相同 ID 的工具调用可能包含不同结果；更安全的做法是**将 ID 重写为规范格式 `functions.<name>:<global_idx>`**（不要去重）。在客户 FAQ 中记录此模式，并链接至 `troubleshooting.md#reject-duplicate-tool-call-id`。**安全提示**：若未仔细验证，简单的按 ID 去重会构成攻击面。将名称规范化而非删除更安全。
- **用户体验**：传递具体的网关错误消息（`"messages[N].tool_calls[M].id is duplicated"`），而非通用包装器——这能缩短代理客户端的故障修复时间。**安全提示**：平衡调试友好性与信息泄露风险——参见 Q4。

### 启用引导解码能否解决令牌上限问题？

**引导解码与令牌上限无关。** 该机制强制模型按模式（JSON Schema、正则表达式）生成输出，但不会改变令牌数量。关于上限问题——参见 Q3。

底层 vLLM 字段 `guided_json`、`guided_regex`、`guided_grammar`、`guided_choice` **会被网关以 HTTP 400 拒绝**（锚点 `#reject-guided-decoding` 在 `docs/chat-api/troubleshooting.md`（计划中））。原因——它们绕过了应用于 `response_format` / `structured_outputs` 封装的 xgrammar 边界，以缓解 CVE-2025-48944。

**结构化输出的正确字段**

| 字段 | Kimi K2.6 | Qwen3-235B | 备注 |
|------|-----------|------------|---------|
| `response_format`（`type: "json_schema"` 或 `"json_object"`） | 正常工作 | 正常工作 | OpenAI 标准。可靠选择。已在两个模型上通过公共代理实证验证。 |
| `structured_outputs` 封装（`json`/`regex`/`choice`/`grammar`/`structural_tag`/`json_object`） | HTTP 400（全网拒绝） | HTTP 400（全网拒绝） | PR #1215（`StructuredOutputsValidator`）已合并至仓库，但**截至 2026-05-25 尚未在生产主网激活**。两个代理均以相同错误拒绝：`"Chat completions parameter `structured_outputs` is currently rejected by the Gonka network"`——错误引用的是开发分支 `dl/devshards-gateway-to-main`，而非主分支。这是**全网发布延迟**，而非代理个体问题。目前唯一可靠的结构化输出选项是 Kimi K2.6 和 Qwen3 上的 `response_format`。 |
| 同时使用两者（`response_format` + `structured_outputs`） | HTTP 400 | HTTP 400 / 502（取决于代理） | 网关在 vLLM 之前拒绝此组合（锚点 `#reject-structured_outputs-with-response_format`）。在 vLLM 0.20.0 中，字段通过 `dataclasses.replace()` 合并，违反了 `StructuredOutputsParams.__post_init__` 中的“仅允许一个”规则。 |

**推理用户：**

- 需要最大跨代理和模型的可移植性——使用 `response_format`（处处可用）。`structured_outputs` 封装目前被全网拒绝。
- 不要在单个请求中同时使用 `response_format` 和 `structured_outputs`——HTTP 400。

**对于代理：**

- 引导解码不会提升吞吐量。不要向客户承诺其可解决令牌上限问题。
- 关注 PR #1215（`StructuredOutputsValidator`）在所有路由上的发布——Qwen3 用户已等待 `structured_outputs` 封装用于正则表达式/选择/语法工作负载。

### 为何生成速度波动如此剧烈？为何提速仅适用于推理令牌？

速度波动是一个真实且已知的开放问题，根源在于三个不同层级。

**1. 每主机减速/停滞（主机层）**

一个开放的研究任务——[问题 #818 “慢节点调查”](https://github.com/gonka-ai/gonka/issues/818)（自 2026 年 2 月起开放，优先级：高）。存在特定模式但无根因（计划中的 `known-issues.md`，第 1 节“主机接收后无流返回”和第 2 节“主机生成块后停滞”——某些情况下一分钟后恢复，有时永不恢复）。

**2. 路由差异（代理层）**

在两次连续请求之间，代理可能被路由至负载不同的不同主机。端到端延迟取决于 `devshard-XXXX-YYY` 主机 ID。在稳定主机上，每令牌生成速度基本保持不变。[¹]

[¹] 说明性观察：在一次测试中（约30秒内发送5个请求），端到端延迟变化导致`tokens / total_latency`的范围为~8–54 tok/s，但该指标包含TTFT，且非公开的方差指标。

**3. 网络层级（链层级）的验证窗口**

在PoC/确认型PoC事件（cPoC——用于确认验证者在单个周期内工作的阶段）期间，部分节点会暂时不可用。在周期边界处，已知存在快照保留节点的问题，网关返回`attempts: []`（路由上无可用主机）——从客户端角度看，表现为超时。该影响在代理服务的该模型节点越少时越明显；在提供者数量较少的模型上更为突出。

**"推理速度快于可见"——并非优先级，而是输出结构**

网关上不存在专门用于推理token的快速通道。在devshard代码中，`delta.reasoning`、`delta.content`、`delta.reasoning_content`、`delta.tool_calls`均通过`sseChunkHasContent`以相同方式检测。每token的速度相同。

启用思考功能的Kimi首先生成大量`reasoning_content`（数百至数千个token），然后输出简短的可见答案（数十至数百个）。若客户端不显示推理字段，用户会看到"静默一段时间，然后突然爆发答案"。实际上模型一直在生成，只是结果被隐藏了。

**对于推理用户：**

- 选择一个发布正常运行时间/p50 TTFT指标的经纪人。可用的仪表板包括[gonka.pw](https://gonka.pw/)和[meter.gonka.gg](https://meter.gonka.gg/)（可能还有其他，此列表不完整）。
- 在慢请求时，请记住负载大小：对于短负载，重试会落在不同节点上；对于持续的大负载（>50k），落在窗口缩减的节点上是一个系统性问题（问题#818），仅重试可能无效——最好进行拆分。
- 想在模型思考时看到进度——在UI中渲染`delta.reasoning_content`（或`delta.reasoning`），例如在折叠区块中。

**对于经纪人：**

- 整个网络最高优先级的共享问题。请向[问题#818](https://github.com/gonka-ai/gonka/issues/818)贡献生产日志/追踪数据——这为核心团队提供了他们所缺乏的数据。
- 帮助实现主机端改进（分块gossip恢复、每escrow `lastAfterReq`跟踪——已在计划的`host-improvements.md`及相关问题中追踪）——它们直接解决路由/恢复的薄弱环节。

### 为什么速度因硬件而异——在B200上更快，在H200上更慢？

**速度取决于硬件——这是异构网络的正常现象。** 链上的PoC权重反映了节点的实际性能（影响验证者的奖励份额），而经纪人本地路由则从escrow中选择可用主机——两次连续请求可能落在不同代际的GPU上。

**对于推理用户：** 速度取决于网络中的硬件分布。您无法直接选择硬件——您选择的是经纪人。需要可预测的延迟——请向经纪人询问他们默认路由到的硬件层级。

**对于经纪人：**

差异的确切来源（根据[`kaitakuai/experiments`](https://github.com/kaitakuai/experiments)的内部基准测试——未在gonka-api.org或gonkagate.com上测量）：

| GPU | 内存 | sm | Qwen3-235B 每实例每分钟nonce数 | 每GPU |
|-----|--------|-----|------------------------------|---------|
| 4×H100 SXM5 | 80 GB HBM3 | 90 | **1,248** @ batch=16 | ~312 |
| 4×H200 | 141 GB HBM3e | 90 | **1,408** @ batch=32–64 | ~352 |
| 2×B200 | 192 GB HBM3e | 100 | **1,984** @ batch=64 | **~992** |

- **H200 vs H100：** 每GPU +13%。相同芯片（sm_90），但HBM3e + 141 GB对比HBM3 + 80 GB → 允许大模型使用更小的TP和更快的KV缓存。
- **B200/B300 vs H100/H200：** 在Qwen3-235B FP8上，每GPU性能**约3倍**。
- **Kimi-K2.6 INT4 — 具体数据：** 4×B200提供2,240 nonce/分钟 = **每GPU约560**（见`experiments/2026-05/kimi_k26_int4_4xb200_q-int4-k2`）。16×H100 TP提供1,389 nonce/分钟 = **每GPU约87**（见`experiments/2026-05/kimi-k26-int4-2x8xh100`）。每GPU差异约为6倍；绝对数值上，每GPU的Kimi在相同硬件上比Qwen慢（4×B200 Kimi INT4 ~560每GPU vs Qwen ~992每GPU）。
- **Kimi-K2.6 INT4 on Blackwell：** `VLLM_USE_FLASHINFER_MOE_INT4=1`相比Marlin带来**+138%**提升（见`experiments/2026-05/kimi_k26_b300_eager_flashinfer`中的A/B测试）。仅适用于Blackwell系列上的INT4 MoE工作负载（内核门控——`is_device_capability_family(100)`，覆盖B100/B200/B300；B300实际为sm_103a）。

**追踪与诊断：** 可观测性已在[PR #1046 "Implement dapi & devshard observability"](https://github.com/gonka-ai/gonka/pull/1046)中合并——它增加了OpenTelemetry追踪、Prometheus指标和仪表板。如果Grafana没有每主机TTFT面板——请检查DAPI/devshard是否已更新且仪表板已包含在构建中。

其他来源：仓库[`kaitakuai/experiments`](https://github.com/kaitakuai/experiments)（定期更新）、您从[gonka.pw](https://gonka.pw/)获取的每主机统计信息，以及来自[meter.gonka.gg](https://meter.gonka.gg/)的网络状态。希望影响硬件分布——将devshard escrow扩展至具有首选GPU的主机。

### 为什么模型在Kilo Code中无法正确使用工具？

最可能有四个原因——网关应用了严格的参数白名单和对JSON Schema的严格限制。这不是Kilo特有的：任何编码代理（Cline、Continue.dev、OpenCode等）都会出现相同问题。

**1. 硬性拒绝（HTTP 400）——需在客户端修复**

| 触发 | 原因 | 修复 |
|---------|---------|-----|
| 有效载荷中的 `tags` 字段 | 非 OpenAI Chat Completions 标准；民间 Hermes 约定；锚点 `#reject-tags` | 使用 `metadata` (OpenAI 标准) 或 `user` 进行跟踪 |
| `tools[].function.parameters` 中的 Schema 深度 > 16 | CVE 驱动的限制 | 扁平化 Schema；PR #1187 将其从 5 提升至 16 |
| Schema 节点总数 > 256 | CVE 驱动的限制 | 减少节点数；PR #1195 将其从 128 提升至 256。具有大型输入 Schema 的 MCP 工具可能接近此限制；请在您的网关上测试。如果您确实需要一个节点数超过 256 的 MCP 工具——请提交功能请求。 |

**2. 静默强制转换/剥离——请求不会失败，但行为发生变化**

| 触发 | 网关的行为 | 备注 |
|---------|---------------------|---------|
| `tool_choice: "required"` | 静默 → `"auto"` (网络策略) | 锚点 `#coerce-tool-choice-required`。在大多数情况下，模型会对明显与工具相关的提示进行工具调用，但没有“必需”的保证 |
| `tools[].function.strict: true` | 静默丢弃该字段 | vLLM 解析器（`hermes`，`kimi_k2`）忽略该标志。PR #1193 |

已知客户端的兼容性矩阵：[`docs/chat-api/agents.md`](https://github.com/gonka-ai/gonka/blob/main/docs/chat-api/agents.md)（计划中）。一个基本可用的工具调用示例：[开发者快速入门 §1.4](https://gonka.ai/developer/quickstart/#4-tool-calling)。

**对于推理用户：**

- **使用 Kilo Code 生成的相同 curl 命令进行复现**（通过客户端调试日志或中间代理）。在 400 响应体中，网关通常会说明被拒绝的字段名称；代理可能会将消息屏蔽为通用的“上游被拒绝”——但具体问题字段通常只有一个。
- **对照 `agents.md` 和 `troubleshooting.md` 中的列表进行交叉检查**（计划中）——大多数 400 错误都属于已记录的拒绝锚点（`#reject-tags`，`#reject-enforced_tokens`，`#reject-structured_outputs-kimi`）。
- **如果错误信息不明确，请快速检查：** 检查字段 `tags`、`enforced_tokens`、`plugins`、`strict`、`guided_*`；逐个移除并重新发送请求。若无效——检查 Schema 深度（≤16）和节点数（≤256）。
- **被拒绝的字段未被记录**——在 [gonka-ai/gonka](https://github.com/gonka-ai/gonka) 上提交问题，并附上捕获的请求。

**对于代理：**

- 仪表板上无 `agents.md` 链接——这是一个低成本的快速改进点。
- 有能力提交关于 `gonka-ai/gonka` 中非标准字段的问题——这有助于生态系统中的每个代理。

### 像 Hermes 和 OpenClaw 这样的代理为何在 Kimi 上无法完成工具任务？

**三个因素的组合**

原始 FAQ 曾提及第四个因素——特殊标记清理器——但该因素涉及安全/提示注入，而非工具调用失败；PR 修复被推迟，因为 Kimi 正确处理了特殊标记（实证结果）。

1. **默认情况下，网关为思考分配了一半的 `max_tokens`**（参见 Q1/Q2）。在默认 `thinking_token_budget = max_tokens / 2` 下，它在模型开始生成工具调用前就已耗尽 `<think>`。对于工具密集型代理流程，预算在产生有用输出前就已耗尽。缓解措施——显式设置 `thinking_token_budget: 0`（Q2）。这是网关策略，而非模型限制。
2. **输出上限 3,072（有效）/4,096（网络上限）对于工具密集型输出而言过于紧张**（Q3）。大型 `arguments` 数据块 + 可见内容很容易达到上限。
3. **上游 vLLM 工具解析器的 Bug**（Q5）：重复的 `tool_calls[].id` 与 `n>1` 冲突（[vLLM PR #21259 — 未验证](https://github.com/vllm-project/vllm/pull/21259)）以及 Hermes 解析器在多个工具块上的 `JSONDecodeError` 问题（[vLLM #17790](https://github.com/vllm-project/vllm/issues/17790)）。

构建者痛点及链接：[问题 #1229](https://github.com/gonka-ai/gonka/issues/1229)——长推理链、工具调用兼容性、超出输出限制后的续写被列为代理编码工作流的阻塞问题。

**对于推理用户：**

- **对于 Kimi，这是强制要求：** `"thinking": {"type": "disabled"}` + `"max_tokens": 4096`（或显式设置 `thinking_token_budget: 0`，参见 Q2 的双重保险）。这将为工具密集型输出释放全部上限。实证：Kimi 轻松在单次响应中发出 5 个并行工具调用，耗时约 4 秒。
- **在客户端控制 tool_call.id** —— 将其重写为规范格式 `functions.<name>:<global_idx>`（Q5），以避免网关因重复 ID 而拒绝。
- **控制 Schema** —— 保持深度 ≤16 且节点数 ≤256（Q9）。具有大型输入 Schema 的 MCP 工具可能无法通过。

**对于经纪人：**

- 将上限提升（Q3 — 按模型 `request_max_tokens_cap` 通过 `/v1/admin/settings`）与上述建议结合 —— 这涵盖了您网关上主要的代理故障类别。

### OpenCode 无法应用请求的代码更改（中途截断句子）。这是什么原因导致的？

三种原因；客户端可以绕过其中两个，但无法绕过第三个。

1. **`max_tokens` 在大差异时被截断。** 大型代码补丁无法适应 Q3 的有效上限 3,072。解决方法：将差异拆分为多个工具调用 —— 模型在每次调用中更容易适应预算。
2. **vLLM 在边缘参数下崩溃** —— 一系列 8 个合并的 PR（#1170、#1171、#1172、#1174、#1180、#1212、#1215、#1216）增强了对导致引擎崩溃字段的防护。在较新的网关（≥ `devshard 0.2.13`）上，大多数已知的崩溃场景被 400 个验证器拦截，而非崩溃。
3. **主机在接收后断开流**（开放问题 —— 如计划中的 `known-issues.md` §1 所述）—— 主机接受了请求，但未返回数据块。这是网络层面的问题，客户端无其他解决方法，只能重试。

**对于推理用户：**

- **对于 Kimi：** `"thinking": {"type": "disabled"}` + `"max_tokens": 4096`。大型差异 —— 拆分为多个工具调用。
- **长期：** 经纪人上限为 Q3，工具调用规范 ID 格式为 Q5。

**对于经纪人：** 在客户常见问题解答中记录针对编码代理客户端的“拆分大差异”模式。

### 是否存在一个模型能同时处理输入和输出而无任何权衡？

**MiniMax-M2.7** 于 2026-05-28 左右通过链治理升级 v0.2.13 上线主网 —— Gonka 的第三个模型。已在两个经纪人上验证为在线。澄清：问题中的“Qwen 输出上限为 8,192”不准确 —— 所有模型的输出上限相同（Q3 为 3,072 / 4,096），而非模型端决定。

| 模型 | 原生上下文 | 主网 | 原生思考 | 工具调用 |
|--------|---------------|---------|-----------------|------------|
| Kimi-K2.6 | 256K | 240K | 是（chat_template_kwargs） | `functions.<name>:<idx>` |
| Qwen3-235B-A22B-Instruct-2507-FP8 | 128K | 240K | 否（Instruct） | hermes 解析器 |
| MiniMax-M2.7 | ~180K | 180K | 是（`<think>` 在内容中） | `chatcmpl-tool-<hash>` |

**MiniMax 部署规范（`inference-chain/app/upgrades/v0_2_13/upgrades.go:minimaxGovernanceModel()`）：**

```text
ModelArgs: ["--enable-auto-tool-choice", "--kv-cache-dtype", "fp8",
            "--tool-call-parser", "minimax_m2",
            "--reasoning-parser", "minimax_m2_append_think"]
VRam: 320 GB         ThroughputPerNonce: 5000 (Kimi 1500 — MiniMax ×3.3 higher)
minimaxStartEpoch: 271
HfCommit: d494266a4affc0d2995ba1fa35c8481cbd84294b
```

**MiniMax 与 Kimi/Qwen 的重要区别：**

- **`<think>` 块在 `delta.content` 中**（不在 `reasoning_content` 中，如 Kimi）—— `minimax_m2_append_think` 解析器的行为。如果不需要这些标签出现在最终文本中，请在客户端解析标签。
- **工具调用 ID `chatcmpl-tool-<hash>`** —— 已经通过形状唯一，因此 Q5 关于规范 ID 重写的建议不适用。

相关工件：PR #1163 权重缩放（已合并，2026-05-13，与 Kimi 经济模型对齐）；PR [#1226](https://github.com/gonka-ai/gonka/pull/1226)（开放，未合并）—— 在已部署模型之上进行的网关端重构，非阻塞项。

**对于推理用户：** MiniMax-M2.7 **今天**即可使用（ID `MiniMaxAI/MiniMax-M2.7` 在 gonka-api.org，`minimaxai/minimax-m2.7` 在 gonkagate.com —— 参见大小写敏感性 Q1）。根据工作负载选择：Kimi 用于推理+工具，Qwen3 用于大上下文+结构化输出，MiniMax-M2.7 —— 一种比 Kimi 更适合工具调用且吞吐量更高的替代方案。

**对于代理：** 部署已通过 v0.2.13 升级由网络完成。未提供 MiniMax —— 请检查 mlnode-image 是否支持上述部署参数且主机已更新。PR #1226（开放）将改进用户体验（按模型分发、工具消息格式），但不构成阻塞。

### 为什么没有可用的网页搜索？

**按设计——Gonka 是一个推理网络**，而非代理框架。插件/网页执行属于客户端代理层或具备增值服务的代理的职责，而非推理路径。

**具体而言：** 2026-05-25，我们通过两个代理测试了相同的 `plugins` 负载。`gonka-api.org` 静默移除该字段（HTTP 200，锚点 `#strip-plugins` 在 `docs/chat-api/troubleshooting.md` 中（计划中））；`gonkagate.com` 以 HTTP 400 `"Plugin config is invalid"` 拒绝。两者均符合网关合同的合理解释：一种偏向宽松解析（静默移除），另一种为严格验证（拒绝未知字段）。在这两种情况下 `plugins` **均未执行**：vLLM 无插件执行路径，若静默传递该字段则暗示了不存在的后端能力。在代理间迁移时，请考虑这种差异（详情见 `comparison-brokers.md`（计划中））。

**对于推理用户：** 在您自己的代理层中运行搜索（LangChain、LlamaIndex、您自己的封装），将结果注入 `messages[].content` 后再调用 `/v1/chat/completions`。这是所有 OpenAI 兼容端点的标准模式。

**对于代理：** 差异化的机会——代理层增值服务（“我们执行搜索并将结果注入消息”）是合法的产品。在 Gonka 之上完全实现，无需协议变更。**安全提示：** 移除 `plugins` 可能反映的是滥用抵抗策略（而非用户体验失败）——如果您计划将插件执行作为产品提供，请认真考虑。若将其作为标准提供——请在 [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/discussions) 上发起生态系统讨论。

### 何时会支持可靠的网页抓取？

**按设计，这不在 Gonka 路线图上。** 正确的位置是侧车或代理层的增值服务。

**对于推理用户：** 构建或购买抓取服务（Tavily、Exa、Perplexity API 用于搜索；trafilatura/Readability 用于解析），标准化为文本，通过 OpenAI 兼容调用发送。已有大量现成解决方案。

**对于代理：** 想将其作为分级服务提供——请在 [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/discussions) 上发起生态系统讨论，以便社区就通用约定达成一致（例如，每个人都一致部署的侧车）。

### Context7 文档研究——摘要失败。这是输出令牌限制吗？

与“Kimi 的输入令牌上限为 4k，输出上限为 8,192 令牌。这些限制何时会提高？”相同的问题。输出上限（有效 3,072 / 网络上限 4,096）对于“工具结果正文 + 摘要一次性响应”来说过于紧张。思维已启用——其中一半会占用此处（Q1/Q2）。

**适用于摘要用例的现成负载：**

```json
{
  "model": "moonshotai/Kimi-K2.6",
  "messages": [
    {"role": "system", "content": "You produce structured summaries of technical documents."},
    {"role": "user", "content": "Summarize the following document:\n\n<paste the text here>"}
  ],
  "max_tokens": 4096,
  "thinking": {"type": "disabled"},
  "thinking_token_budget": 0,
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "document_summary",
      "strict": true,
      "schema": {
        "type": "object",
        "additionalProperties": false,
        "required": ["summary", "key_points"],
        "properties": {
          "summary": {"type": "string", "description": "3-5 sentences"},
          "key_points": {"type": "array", "items": {"type": "string"}, "minItems": 3, "maxItems": 7}
        }
      }
    }
  }
}
```

**对于推理用户：**

- 将上述负载作为模板使用。`response_format` 将输出压缩为所需格式，节省预算。
- 如果文档较长并触及上限（`finish_reason=length`）——将其拆分为 N+1 次调用：一次获取+规划，其余为分段摘要；在客户端侧拼接。
- 不要将 `response_format` 与 `structured_outputs` 封装结合使用——HTTP 400（Q6）。
- 模式：深度 ≤ 16，节点 ≤ 256（Q9）。

**对于代理：** `response_format` 是最简单且最可移植的缓解方案，无论您的上限提升策略如何。一旦您的管理配置支持按模型 `request_max_tokens_cap`，可考虑提供按客户上限提升选项。

### Gonka 没有 KV 缓存。何时会添加缓存？

**简短回答：无明确时间表。** 在 Gonka 网关端一切已就绪——阻塞项在上游 vLLM，问题 [#33264](https://github.com/vllm-project/vllm/issues/33264) 已开放 4 个多月，尚未合并 PR。在该问题关闭前，请求中的 `prompt_cache_key` 字段将**被静默忽略**——请勿包含它，以免依赖不存在的行为。

vLLM 前缀 KV 缓存工作在每个 ML 节点上。网关层面的 `prompt_cache_key` / `cache_key` 目前被静默移除——这是由未合并的上游 vLLM PR 阻塞的限制。

**当前现状**

- **网关行为：** `prompt_cache_key`（OpenAI 标准）和 `cache_key`（Moonshot Kimi 约定）均被静默移除——均未到达 vLLM。锚点：`docs/chat-api/troubleshooting.md#strip-prompt_cache_key` 和 `#strip-cache_key`（计划中）。
- **上游阻塞：** vLLM 使用 `cache_salt` 字段进行提示缓存隔离（RFC #16016，PR #17045）。将 `prompt_cache_key` → `cache_salt` 别名是自 2026 年 1 月起开放的 [vLLM #33264](https://github.com/vllm-project/vllm/issues/33264)，尚未合并 PR。
- **安全理由：** 未经隔离直接转发 `cache_key` 是不安全的——已有[公开的提示缓存时序侧信道攻击（arxiv 2502.07776 PROMPTPEEK）](https://arxiv.org/abs/2502.07776)。网关无法实现虚假的缓存隔离保证。
- **80–90% 的命中率并非 Gonka 的声明。** 这要么是对某人营销材料的误解，要么是与 OpenAI / Anthropic 原生缓存（保证单提供商内粘性路由）的混淆。

**重要架构警告**

即使 vLLM #33264 合并且网关添加了哈希 → `cache_salt` 桥接，缓存仍为**每个 vLLM 实例**。Gonka 的多主机路由意味着两个具有相同 `cache_key` 的请求可能落在不同主机上，拥有不同的前缀缓存。在没有粘性路由（目前不存在）的情况下，保证 OpenAI 风格的 ~80% 命中率在架构上非常困难。三个阻塞项（上游 vLLM PR、网关桥接、粘性路由）目前均未发布。

**对于推理用户：** 今天无需操作——`prompt_cache_key` 和 `cache_key` 为无操作。请勿依赖这些字段进行成本优化。

**对于代理：** 在 vLLM #33264 合并前，无需网关端更改。希望加速进展——请在该上游问题中评论或贡献。合并后，Gonka 网关将添加一个桥接，同时启用这两个字段。

### Kimi 在 Gonka 网关上何时会启用图像输入？

**今天不可用。** 预计发布时间——v0.2.14 或更高版本（当前为 0.2.13），无固定日期。多模态负载（`messages[].content` 包含 `type: "image_url"` 或 `"video_url"`）当前在两个公共代理上均返回 **HTTP 400**。

**正在进行中，计划已撰写并分为多个阶段。** 计划文档 `multimodal-inference-plan.md` 在 `gonka-ai/gonka` 中（约 466 行，6 个阶段——ML 节点、主机↔ML 节点、代理/DAPI、Devshard 协议等）。在发布前，通过下方的问题/PR 跟踪更简单。

**当前硬性阻塞**

1. **多模态专用特殊标记清理器。** Kimi-K2.6 聊天模板接受 `image_url` / `video_url` 内容部分，但网关当前仅验证文本。多模态负载（图像 URL、替代文本、元数据）提供了额外的注入面，必须进行验证。安全审查将其列为第二阶段阻塞项。**目前尚无针对此特定多模态威胁的公开 CVE；内部跟踪正在进行中。**

2. **独立的 VLM 验证审查。** 图像输入的验证方法需要独立确认。问题 [#1026](https://github.com/gonka-ai/gonka/issues/1026)（初步研究：Qwen2-VL-2B F1=100% 中间）+ [#1198](https://github.com/gonka-ai/gonka/issues/1198)（重新验证，开放领取）。

**目标：** v0.2.14+，但尚无承诺的时间表；被问题 #1198（独立验证，开放领取）阻塞。

**目前经实证确认的内容：** 包含 `{type:"image_url"}` 的 `messages[0].content` 数组请求在两条路径（Kimi 和 Qwen3）上均返回 HTTP 400。网关层面不接受多模态输入。

**对于推理用户：** 目前不可用。

**对于代理：** 加速的三种方式：

1. 领取问题 [#1198](https://github.com/gonka-ai/gonka/issues/1198)（开放领取）——独立的 VLM 验证审查是最关键的阻塞项。
2. 审查 PR [#1150 "vlm benchmark"](https://github.com/gonka-ai/gonka/pull/1150)。
3. 当计划的第 1-3 阶段变得可达成时——准备网关能力注册表（第 3 阶段）；操作员配置将决定您的代理接受哪些内容类型。
