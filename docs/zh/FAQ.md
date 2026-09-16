# FAQ

## 概述

### 什么是Gonka？
Gonka是一个用于高效AI计算的去中心化网络——由其使用者运行。它作为集中式云服务在AI模型训练和推理方面的低成本、高效率替代方案。作为一个协议，它既不是公司，也不是初创企业。

- 从区块链角度看，Gonka是去中心化AI网络的基础账本和协调层（L1）。它记录余额、交易和加密证据，以证明主机正确执行了AI工作，而所有实际计算（如推理和训练）均在链下进行。
- 从网络角度看，Gonka是一个由主机和开发者等参与者组成的综合生态系统，通过去中心化基础设施进行交互。依托Gonka区块链，该网络分发任务、验证结果，并仅奖励可验证的有用工作，从而为AI工作负载创建一个竞争性、可扩展的环境。

### Gonka解决了什么问题？

Gonka是一个去中心化AI基础设施，旨在减少对集中式云提供商的依赖，并比传统去中心化网络更高效地利用计算能力。其目标是尽可能将计算资源导向有用的AI任务，如推理和训练，同时最小化因共识开销造成的浪费。

### Gonka生态系统中的关键参与者有哪些？

Gonka生态系统有四个关键参与者群体：

- 开发者通过利用网络的分布式计算能力来构建和部署AI应用。
- 贡献者参与核心区块链代码库、协议升级、性能优化、安全补丁和新功能集成的开发。
- 持有者持有网络的原生代币，即仅拥有一个包含GNK代币的钱包。持有者可以持有、转账或出售代币，使用代币进行推理，并根据协议规则使用它们。成为持有者不意味着除标准代币所有权外的任何义务、责任或治理角色。
- 主机为网络贡献计算能力。主机执行推理和其他计算任务，并根据其贡献的计算能力获得相应奖励，前提是保持诚实参与和可靠性。主机构成网络的骨干。只有主机在网络中拥有投票权。此投票权代表其在治理中的权重，用于提出和投票决定协议决策、参数变更和升级。任何主机均可充当验证者、转账代理和执行者（这些并非预定义或链上角色，而是在处理推理请求时动态承担的操作功能）。

### 什么是GNK代币？
GNK是Gonka网络的原生代币，用于激励参与者、为资源定价，并确保网络的可持续增长。

### 我可以购买GNK代币吗？

原生GNK目前**未在任何中心化交易所（CEX）上市**，因此您无法在CEX上购买。请关注[Twitter](https://x.com/gonka_ai)上的官方公告以获取任何上市更新。

不过，目前有两种合法方式可以获得GNK：

- **作为主机挖矿。** 向网络贡献计算资源，直接获得GNK。请参阅[作为主机挖矿](https://gonka.ai/host/quickstart/)。
- **在以太坊上购买WGNK并桥接回GNK。** GNK可桥接到以太坊作为**WGNK**（封装的GNK），这是一种标准ERC-20代币，可在Uniswap等DEX上交易。您可以在那里购买WGNK，然后[桥接回原生GNK](cross-chain-transfers/ethereum-bridge/withdraw-gnk.md)。请参阅[以太坊桥接概览](cross-chain-transfers/ethereum-bridge/overview.md)。

!!! info 追踪WGNK价格和市场数据
	您可以在以下平台追踪WGNK（封装的GNK）价格、市值和交易量：

	- [CoinGecko](https://www.coingecko.com/en/coins/wrapped-gonka)
	- [CoinMarketCap](https://coinmarketcap.com/currencies/gonka/)
	- [Uniswap](https://app.uniswap.org/explore/tokens/ethereum/0x972a7a92d92796a98801a8818bcf91f1648f2f68)

!!! warning 交易前验证合约地址
	GNK在以太坊上的**唯一**官方代表是**WGNK**，地址为`0x972a7a92d92796a98801a8818bcf91f1648f2f68`——此地址既是桥接合约，也是WGNK ERC-20代币。请始终确认任何列表或交易均指向此确切地址。

	其他追踪器和网络上仍存在伪造的GNK列表和页面：任何声称在Solana或其他非上述WGNK地址上的GNK代币，均**不是**官方GNK资产。请始终通过官方渠道验证信息。

### 协议为何高效？
Gonka与“大玩家”的区别在于其定价机制，以及无论主机规模大小，推理任务均被平等分配。欲了解更多，请查阅[白皮书](https://gonka.ai/whitepaper.pdf)。

### 网络如何运行？
网络的运行是协作性的，取决于您希望扮演的角色：

- 作为[开发者](https://gonka.ai/developer/quickstart/)：您可以使用网络的计算资源来构建和部署您的AI应用。
- 作为[主机](https://gonka.ai/host/quickstart/)：您可以贡献您的计算资源以支持网络。协议设计旨在奖励您的贡献，确保网络的持续性和主权。

### 这份文档是否完整？

不是。本文件涵盖了协议的主要概念、标准工作流程和最常见的操作场景，但并未涵盖代码库的全部行为或实现细节。代码中包含此处未描述的额外逻辑、交互和边界情况。

由于Gonka是一个开源且去中心化的网络，各种参数、机制和治理驱动的行为可能通过链上投票和社区决策不断演变。某些细节可能在发布后发生变化，且并非所有边界情况或未来更新都会立即反映在本文件中。

对于主机、开发者和贡献者而言，最终的真相来源是代码本身。若本文件与代码存在任何不一致，以代码为准。

鼓励参与者查阅相关仓库、治理提案和网络更新，以确保其理解与协议当前状态保持一致。

### 贡献计算资源的激励是什么？
我们创建了一份专门的文档，重点介绍[Tokenomics](https://gonka.ai/tokenomics.pdf)，您可以在其中找到有关激励如何衡量的所有信息。

### 硬件要求是什么？
您可以在文档中清楚地找到最低和推荐的[硬件规格](https://gonka.ai/host/hardware-specifications/)。您应查阅此部分，以确保您的硬件符合有效贡献的要求。

### 我可以使用哪些钱包存储GNK代币？
您可以在多个支持的钱包中存储GNK代币：

- [Tangem](https://tangem.com/) — 带有移动应用的硬件钱包（卡片或戒指）
- [Keplr](https://www.keplr.app/)
- [Cosmostation](https://cosmostation.io/products/application)
- `inferenced` CLI — 用于Gonka本地账户管理和网络操作的命令行工具。

!!! note "现有Leap Wallet用户请注意"

	如果您之前使用Leap Wallet创建了Gonka账户，请注意[Leap将在2026年5月28日关闭其所有产品](https://www.leapwallet.io/)，包括浏览器扩展、移动应用和仪表板。

	由于Leap是非托管钱包，您的资产和账户仍位于链上。但为了继续访问您的钱包，您应在Leap服务下线前，将您的现有恢复短语导入另一个支持的钱包，例如Keplr。

### 在哪里可以找到有关Gonka的有用信息？

以下是了解Gonka生态系统的最重要资源：

- [gonka.ai](https://gonka.ai/) — 项目信息和生态系统概览的主要入口。
- [白皮书](https://gonka.ai/whitepaper.pdf) — 描述架构、共识模型、Proof-of-Compute等的技术文档。
- [Tokenomics](https://gonka.ai/tokenomics.pdf) — 项目代币经济概览，包括供应、分配、激励和经济设计。
- [GitHub](https://github.com/gonka-ai/gonka/) — 访问项目源代码、存储库、开发活动和开源贡献。
- [Discord](https://discord.gg/REcpeYc7P7) — 社区讨论、公告和技术支持的主要场所。
- [X (Twitter)](https://x.com/gonka_ai) — 新闻、更新和公告。

## Tokenomics

### Gonka中的治理权如何计算？
Gonka采用PoC加权投票模型：

- Proof-of-Compute (PoC)：投票权与您经过验证的计算贡献成正比。
- 抵押承诺：
    - PoC衍生投票权重的20%会自动激活。
    - 要解锁剩余的80%，您必须锁定GNK代币作为抵押。
- 这确保了治理影响力反映真实的计算工作+经济抵押。

在前180个周期（约6个月）内，新参与者可以通过PoC单独参与治理并获得投票权，无需抵押要求。在此期间，完整的治理权利可用，而投票权仍与经过验证的计算活动挂钩。

### 为什么Gonka要求锁定GNK代币以获得治理权？
投票权绝非仅来自持有代币。GNK代币作为经济抵押，而非影响力来源。影响力通过持续的计算贡献获得，而锁定GNK抵押则是为了确保参与治理并强制问责。

## 抵押

### 什么是抵押？
抵押用于在宽限期（前180个周期）后激活PoC权重中可抵押的部分。
宽限期后：

- 基础权重（默认20%）始终激活。
- 剩余权重需要GNK抵押才能激活。

抵押确保拥有治理权重的参与者也承担经济责任。参数由链上定义，并可能通过治理变更。在做出经济决策前，请始终核实当前值。

### 抵押是按节点还是按账户计算？
抵押按账户存入。如果多个ML节点链接到同一账户，则所需抵押将根据该账户下所有节点的总权重计算。

### 我需要存入抵押品吗？
是的，如果您希望激活超过基础权重的权重。
如果没有存入抵押品，只有基础权重保持激活状态。

### 需要多少抵押品？
公式：
```
Required Collateral =
Total Weight × (1 - base_weight_ratio) × collateral_per_weight_unit
```
由于PoC权重在各轮次间可能波动，存入精确的最低金额可能导致临时抵押不足。
较小的权重可能经历相对更大的波动。当抵押水平相对较低时，建议预留高达计算最低值2倍的缓冲。
```
Recommended (with conservative buffer):
Total Weight × 2 × (1 - base_weight_ratio) × collateral_per_weight_unit
```

### 我可以部分抵押我的权重吗？
可以。您的总激活权重包括：

- 基础权重（始终激活）
- 抵押合格权重（按存入抵押品比例激活）

如果您存入的金额少于全额所需：

- 基础权重保持完全激活
- 只有相应比例的抵押合格权重被激活
- 剩余部分保持非激活状态

激活权重的计算方式为：
```
Active Weight =
Base Weight +
(Deposited Collateral / Required Collateral) × Collateral-Eligible Weight
```

### 如果我没有存入足够的抵押品会发生什么？
您的激活权重将按比例减少。由于奖励按激活权重比例分配，当您抵押不足时，其他主机将获得更大比例的发行量。非激活权重不会被直接重新分配，它只是不参与共识。

### 抵押品何时生效？
抵押品必须在轮次开始前存入才能生效。在轮次中存入的抵押品：

- 不会立即增加权重
- 从下一个轮次开始生效

轮次中无法增加抵押品。

### 我应该用什么单位存入抵押品？
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
- 宕机（确认PoC失败或监禁）

无效推理的罚没每个纪元上限为一次。
宕机罚没可针对每次监禁事件执行。

### 被罚没的代币会发生什么？
目前，被罚没的GNK将永久销毁并从流通中移除。未来治理可能更改此机制。

### 我可以提取抵押品吗？
可以。提取将触发解绑期（默认：1个纪元）。在解绑期间，抵押品仍可能被罚没。解绑完成后，资金将自动返还至您的账户余额。

### 抵押品不是什么

- 抵押品不是投票权。投票权来源于PoC权重，而非代币余额。
- 抵押品不是委托。每个账户必须为自己权重提供支持。
- 抵押品不是永久锁定。可以提取（需经过解绑期）。
- 在宽限期（前180个纪元）内，不需要抵押品。

### 纪元铸造的奖励如何分配？
每个纪元铸造固定数量的GNK，并按活跃PoC权重比例分配。
活跃权重决定：

- 您在纪元奖励代币中的份额
- 您的治理影响力

如果由于抵押品不足导致您的活跃权重降低，您获得的纪元奖励份额将成比例减少。非活跃权重不获得奖励。

### 我需要手动存入抵押品吗？
是的。必须通过提交链上交易来存入抵押品。它不会自动激活。如果没有存入抵押品：

- 您的节点将继续正常运行。
- 不会被监禁或禁用。
- 只有基础权重（例如20%）保持活跃。

您的奖励和治理影响力将成比例减少。

### 已归属（锁定）的GNK可以用作抵押品吗？
不行。抵押品必须从您可用的（未锁定）GNK余额中存入。尚未释放的归属代币不能用作抵押品。

## 治理

### 哪些类型的变更需要治理提案？
任何影响网络的链上变更都需要治理提案，例如：

- 更新模块参数（`MsgUpdateParams`）
- 执行软件升级
- 添加、更新或弃用推理模型
- 任何其他必须通过治理模块批准和执行的操作

### 谁可以创建治理提案？
任何拥有有效治理密钥（冷钱包账户）的人都可以支付所需费用并创建治理提案。然而，每个提案仍需通过PoC加权投票由活跃参与者批准。建议提案者在链下先讨论重大变更（例如通过[GitHub](https://github.com/gonka-ai)或[社区论坛](https://discord.gg/REcpeYc7P7)），以提高提案通过的可能性。详见[完整指南](https://gonka.ai/governance/transactions-and-governance/)。

### 如果提案失败会怎样？
- 如果提案未达到法定人数 → 自动失败
- 如果多数投票为 `no` → 提案被拒绝，无链上变更
- 如果显著比例的投票为 `no_with_veto`（超过否决阈值）→ 提案被拒绝并标记，表明社区存在强烈分歧
- 存款是否退还取决于链的设置

### 治理参数本身可以被更改吗？
可以。所有关键治理规则——最低投票率、多数阈值和否决阈值——均可在链上配置，并可通过治理提案进行更新。这使得网络能够随着参与模式和计算经济的变化而演进决策规则。

### 如果我无法投票，因为我无法访问冷钥，或者我想让另一个密钥代表我投票，我该怎么办？

如果持有投票权的密钥并非你日常操作所用的密钥，则可以提前授予投票权限。

在这种设置下：

- 授权人 = 拥有投票权的账户（冷钥）
- 被授权人 = 代表授权人提交投票的账户（热钥）

有两种常见情况：

**1. 你想投票，但无法访问持有投票权的密钥。**

请联系该密钥的所有者，请他们授予你的密钥代表其投票的权限。未经此授权，你的密钥无法为该投票权提交治理投票。

**2. 你想让另一个密钥代表你投票。**

请使用以下 grant 命令，从持有投票权的密钥执行。这将授权被授权密钥代表你提交治理投票。
此委托仅允许对治理提案进行投票。被授权人仍可为自己密钥投票。授权人可随时撤销此权限。

1) 授予投票权限（从授权人密钥运行）
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

3) 使用被授权人投票
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

4) 撤销委托（从授权人密钥运行）
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

### 治理提案与改进提案有何区别？
治理提案 → 链上提案。用于直接影响网络且需要链上投票的变更。示例：

- 更新网络参数（`MsgUpdateParams`）
- 执行软件升级
- 添加新模型或功能
- 任何需要由治理模块执行的修改

改进提案 → 由活跃参与者控制的链下提案。用于塑造长期路线图、讨论新想法和协调重大战略变更。

- 以 Markdown 文件形式管理在 [/proposals](https://github.com/gonka-ai/gonka/tree/main/proposals) 目录中
- 通过 GitHub 拉取请求进行审查和讨论
- 获批的提案将被合并到仓库中

### 改进提案如何被审查和批准？
社区提案审查的目标是收集社区验证：反馈、评论和具体意见，以增强最终获得治理批准的理由。如果提案实施需要大量工作、长期承诺、协调或对协议进行重大变更，这一点尤其重要。

- 请先阅读推荐指南：[https://github.com/gonka-ai/gonka/discussions/795](https://github.com/gonka-ai/gonka/discussions/795)。它解释了哪些内容应包含在改进提案中，以及如何撰写一份有力且结构清晰的提案。
- 请在 [GitHub Discussions](https://github.com/gonka-ai/gonka/discussions) 中发布和讨论改进提案（首选方式）；此前它们以 Markdown 文件形式存储在 `/proposals` 目录中。
- 为帮助社区评估您的提案（并提高其在治理阶段的成功率），提案者有责任主动收集早期反馈和支持信号（点赞、评论、具体关切）。
	- 请在 Discord 的 #improvements-proposals 频道中分享讨论链接以扩大影响力和可见性，并通过您可用的其他渠道（包括直接联系主机/矿工）进行推广，以获取实际反馈和支持。
	- 在提案帖中分享您的经验和专业背景。如果您代表团队或公司，请明确说明并提供相关工作链接，以帮助社区评估可信度并更高效地评估提案。
- 社区评审：
	- 活跃贡献者和维护者将在 [GitHub Discussions](https://github.com/gonka-ai/gonka/discussions) 中讨论该提案。对话可在任何平台进行，但请将关键上下文汇总回 [GitHub Discussions](https://github.com/gonka-ai/gonka/discussions)：这能将完整历史集中保存、保持可搜索性，并长期更易于维护。GitHub 是唯一权威来源。
	- 请提出问题、提供反馈、建议、优化，并为相关提案点赞。每个人的关注与参与对链的可持续演进都至关重要。
- 积极的反馈和大量点赞表明社区的真实需求，使团队能够将受欢迎的提案视为社区驱动的路线图的一部分，并在确信社区共识和最终治理批准的前提下启动实施。请注意，主机的反馈至关重要——它有助于将项目分解为里程碑、解锁部分奖励金，甚至争取社区资金池的资助。但最终，所有链上更新和支付均需经过治理批准。

### 改进提案能否转化为治理提案？
可以。通常，改进提案用于探索想法并凝聚共识，然后再起草治理提案。例如：

- 您可先将新模型集成作为改进提案提出。
- 待社区达成共识后，再创建链上治理提案以更新参数或触发软件升级。

## 投票

### 投票流程如何运作？
- 提案提交并存入最低押金后，即进入投票期
- 投票选项：`yes`、`no`、`no_with_veto`、`abstain`

    - `yes` → 批准提案
    - `no` → 拒绝提案
    - `no_with_veto` → 拒绝并明确反对
    - `abstain` → 不批准也不拒绝，但计入法定人数

- 您可在投票期内随时更改投票；仅最后一次投票有效
- 若满足法定人数和门槛，提案将通过并由治理模块自动执行

您可使用以下命令投票。本例为投赞成票，但您可替换为所需选项（`yes`、`no`、`no_with_veto`、`abstain`）：
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
您可随时使用 CLI 查询提案状态：
```
export NODE_URL=http://47.236.19.22:18000
./inferenced query gov tally 2 -o json --node $NODE_URL/chain-rpc/
```

## 运行节点

### 如果我想停止挖矿，但未来回来时仍想使用我的账户，该怎么办？
未来要恢复网络节点，只需备份：

- 冷密钥（最重要，其他均可轮换）
- tmkms 的 secret：`.tmkms/secrets/`
- 来自 `.inference .inference/keyring-file/` 的 keyring
- 来自 `.inference/config .inference/config/node_key.json` 的 node key
- 暖密钥密码：`KEYRING_PASSWORD`

### 我的节点被惩罚了，这是什么意思？
您的验证节点因在最近100个区块中签名少于50个（统计的是该窗口内签名的总区块数，而非连续区块）而被惩罚。这意味着您的节点被暂时排除（约15分钟）在区块生产之外，以保护网络稳定性。
可能的原因有：

- **共识密钥不匹配**。您的节点使用的共识密钥可能与链上注册的验证节点密钥不一致。请确保您使用的共识密钥与链上注册的验证节点密钥一致。
- **网络连接不稳定**。网络不稳定或中断可能导致节点无法达成共识，从而错过签名。请确保您的节点具有稳定、低延迟的连接，且未被其他进程过载。

**奖励**：即使节点被惩罚，只要您仍参与推理或其他验证相关工作，作为主机您仍将继续获得大部分奖励。因此，除非检测到推理问题，否则奖励不会丢失。

**如何解除惩罚**：在问题解决后，使用您的冷密钥提交解除惩罚交易以恢复节点正常运行。

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
当节点被监禁时，会显示 `jailed: true`。

### 如何退役旧集群？

按照本指南安全关闭旧集群，而不影响声誉。

1) 使用以下命令禁用每个 ML 节点：

```
curl -X POST http://localhost:9200/admin/v1/nodes/<id>/disable
```

您可以使用以下命令列出所有节点ID：

```
curl http://localhost:9200/admin/v1/nodes | jq '.[].node.id'
```

2) 在下一个计算证明（PoC）期间未安排提供推理服务的节点将自动停止。
安排提供推理服务的节点将在停止前再保持一个周期的活跃状态。您可以在以下位置的mlnode字段中验证节点状态：

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

如果您的节点无法连接到默认种子节点，只需通过更新 `config.env` 中的三个变量指向另一个节点即可。

1. `SEED_API_URL` - 种子节点的HTTP端点（用于API通信）。
从以下列表中选择任意URL，并直接分配给 `SEED_API_URL`。
    ```
    export SEED_API_URL=<chosen_http_url>
    ```
    可用的创世API URL：
    ```
    http://36.189.234.237:17241
    http://node1.gonka.ai:8000
    https://node1.gonka.ai:8443
    http://node2.gonka.ai:8000
    https://node2.gonka.ai:8443
    https://node3.gonka.ai
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

一旦文件 `.node_initialized` 被创建，系统将不再自动更新种子节点。
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
    curl http://node2.gonka.ai:8000/chain-rpc/net_info | jq
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
          "Listener(@tcp://node2.gonka.ai:5000)"
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

=== "选项2：重新初始化节点（从环境变量自动应用种子节点）"

如果您希望节点重新生成其配置并自动应用环境变量中定义的种子节点，请使用此方法。
    ```
    source config.env
    docker compose down node
    sudo rm -rf .inference/data/ .inference/.node_initialized
    sudo mkdir -p .inference/data/
    ```
    重启节点后，它将表现得像全新安装一样，重新创建其配置，包括来自环境变量的种子节点。
    要验证实际应用了哪些种子节点：

    ```
    sudo cat .inference/config/config.toml
    ```
    查找以下字段：
    ```
    seeds = [...]
    ```

### 硬件、节点权重和ML节点配置是如何实际验证的？

链上**不**验证真实硬件。它仅验证总参与权重，而这是用于权重分配和奖励计算的唯一值。

此权重在ML节点间的任何拆分，以及任何“硬件类型”或其他描述性字段，均仅为信息性内容，可由主机自由修改。

在创建或更新节点时（例如，通过`POST http://localhost:9200/admin/v1/nodes`，如[https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/server/admin/node_handlers.go#L62](https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/server/admin/node_handlers.go#L62)中的处理程序代码所示），可以显式指定硬件字段。如果省略，API服务会尝试从ML节点自动检测硬件信息。

实际上，许多主机在后端运行代理ML节点，多个服务器共享该节点；自动检测仅能看到其中一个服务器，这是一种完全有效的设置。无论配置如何，所有权重分配和奖励都仅依赖于主机的总权重，ML节点内部的拆分或报告的硬件类型从不影响链上验证。

### 如何切换到`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、升级ML节点并移除其他模型？

!!! warning "历史记录——v0.2.8 / PoC v2迁移"
    本条目记录了**v0.2.8 / PoC v2迁移（第155轮）**，当时`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`是唯一强制执行的模型。仅保留供历史参考。**自第308轮起，Qwen3-235B已通过治理（提案78）退役，`MiniMaxAI/MiniMax-M2.7`为当前基础/活跃PoC模型。**如需当前设置，请参考[主机快速入门](./host/quickstart.md)和[多模型PoC——主机操作指南](./host/multi_model_poc.md)。

    本指南说明主机应如何根据v0.2.8模型可用性变化及即将推出的PoC v2更新来升级其ML节点。从第155轮开始，ML节点配置需符合PoC v2要求。建议主机在该时间点前审查并准备其ML节点配置。PoC v2迁移可在第155轮后安排。迁移阶段结束后，未满足配置要求的ML节点权重将不予计入。

    **1. 背景：模型可用性变更（升级v0.2.8）**

    作为v0.2.8升级的一部分，活跃模型集已更新。

    **支持的模型（活跃集）**

    仅以下模型仍受支持：

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `Qwen/Qwen3-32B-FP8`

`Qwen/Qwen3-32B-FP8`在迁移期间受支持，但不参与PoC v2就绪性或权重分配。参与PoC v2要求提供`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。

**已移除的模型**

所有先前支持的模型均已从活跃集中移除，不得再提供。

**2. PoC v2就绪标准（重要）**

成功参与PoC v2迁移需满足以下两项条件：

- 您的所有ML节点均提供`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。这是唯一贡献于PoC v2权重的模型。
- 您的所有ML节点均已升级至PoC v2兼容镜像：
    - ghcr.io/product-science/mlnode:3.0.12-post3
    - ghcr.io/product-science/mlnode:3.0.12-post3-blackwell

!!! note "重要"
	- 仅提供正确的模型而不升级ML节点是不够的。
	- 未同时满足两项条件的节点，在网络切换为单模型配置后将不再具备资格。
	- ML节点升级必须在迁移完成、PoC v2通过v0.2.8升级后独立治理提案激活之前完成。
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

- 第一个布尔值：节点在当前纪元是否正在提供推理服务
- 第二个布尔值：节点是否被安排在下一个PoC中提供推理服务

**推荐行为**

- 优先仅在第二个值为`false`的节点上更改模型
- 这可以降低风险，同时继续观察PoC v2的行为
- 鼓励在多个纪元中逐步推广

**4. 更新ML节点的模型：仅保留受支持的模型**

预下载模型权重（推荐）。为避免启动延迟，请将权重预下载到`HF_HOME`：
```
mkdir -p $HF_HOME
huggingface-cli download Qwen/Qwen3-235B-A22B-Instruct-2507-FP8
```
使用ML节点管理API将ML节点切换到受支持的模型（`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`）。

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
通过管理API应用的更改将在下一个纪元替换模型（[https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)）

!!! note 
	`node-config.json`仅在网络节点API首次启动或本地状态/数据库被删除时使用。如需全新重启，请编辑它。对于现有节点，模型更新应通过管理API执行。

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
**6. 验证模型服务（将在下一个纪元生效）**

确认ML节点仅提供`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`服务，这是PoC v2权重和未来权重分配使用的唯一模型：
```
curl http://127.0.0.1:8080/v1/models | jq
```
可选：重新检查节点分配：
```
curl http://127.0.0.1:9200/admin/v1/nodes
```
!!! note "治理与PoC v2激活说明"

	PoC v2是分阶段引入的，不会一次性激活。

	**第一阶段：观察（v0.2.8之后的当前状态）**

	v0.2.8升级后，PoC v2逻辑已可用，但尚未用于权重分配。

	在此阶段：

	- 主机可以提供`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`或`Qwen/Qwen3-32B-FP8`
	- 主机必须将其ML节点切换为提供`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`并升级为PoC v2兼容版本，才能为PoC v2权重做出贡献。
	- 网络将观察采用情况，以评估主机是否准备好过渡到PoC v2权重。

**第二阶段：治理提案（可选，未来）**
	一旦在活跃主机中观察到足够高的采用率（约50%）：

	- 可能会提交单独的治理提案
	- 该提案可能请求批准启用PoC v2并使用PoC v2进行权重分配

采用阈值仅为观察性，不会触发任何自动更改。

**第三阶段：激活（仅在治理批准后）**

PoC v2仅在治理提案获得链上批准后，才成为权重分配的活动方法。

在该提案获得批准之前：

	- PoC v2在权重分配中保持非活动状态
	- 现有的PoC机制将继续用于确定权重

**总结清单**

在PoC v2激活之前，请确保：

- ML Node 服务 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 所有其他模型均从配置中移除
- ML Node 镜像是 `3.0.12-post3`（或 `3.0.12-post3-blackwell`）

## 密钥与安全

### 对于 v0.2.9 升级后创建的热密钥，应使用哪个 CLI 版本？

对于授予 v0.2.9 升级后创建的新热密钥权限，应使用 CLI [版本 v0.2.9](https://github.com/gonka-ai/gonka/releases/tag/release/v0.2.9)。

### 我可以在哪里找到有关密钥管理的信息？
您可以在文档中找到关于 [密钥管理](https://gonka.ai/host/key-management/) 的专门部分。它概述了在网络中安全管理应用程序密钥的流程和最佳实践。

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

### 我删除了热密钥
在本地设备上备份**冷密钥**，远离服务器。

1) 停止API容器：
    ```
    docker compose down api --no-deps
    ```

2) 在你的`config.env`文件中为热密钥设置`KEY_NAME`。

3) [SERVER]：重新创建热密钥：
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

### 如何从热密钥声明PoC意向？

与无需冷密钥投票的模式相同：先由冷密钥一次性授权，然后使用`authz exec`从热密钥提交。参见[如果我无法访问冷密钥，或希望由其他密钥代表我投票，我该怎么办？](#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)。

`grant-ml-ops-permissions`不包含当前主网（**v0.2.15**）上的PoC意向、委托或拒绝。请单独授权这些类型。在**v0.2.16**之后，`MsgDeclarePoCIntent`会为现有的冷→热密钥对进行回填；`MsgSetPoCDelegation`和`MsgRefusePoCDelegation`不会。

不要在`--from`设置为热密钥时运行`declare-poc-intent`。内部消息必须来自参与者（冷）地址。

1) 授权权限（一次性，由冷密钥签名）

第一个参数是热密钥地址。`--from`是此密钥环中的冷密钥名称。

```
./inferenced tx authz grant <WARM_ADDRESS> generic \
    --msg-type=/inference.inference.MsgDeclarePoCIntent \
    --from <COLD_KEY> \
    --keyring-backend file \
    --gas 200000 \
    --chain-id gonka-mainnet \
    --node "http://node1.gonka.ai:8000/chain-rpc/"

./inferenced tx authz grant <WARM_ADDRESS> generic \
    --msg-type=/inference.inference.MsgRefusePoCDelegation \
    --from <COLD_KEY> \
    --keyring-backend file \
    --gas 200000 \
    --chain-id gonka-mainnet \
    --node "http://node1.gonka.ai:8000/chain-rpc/"

./inferenced tx authz grant <WARM_ADDRESS> generic \
    --msg-type=/inference.inference.MsgSetPoCDelegation \
    --from <COLD_KEY> \
    --keyring-backend file \
    --gas 200000 \
    --chain-id gonka-mainnet \
    --node "http://node1.gonka.ai:8000/chain-rpc/"
```

2) 检查是否已授权

```
./inferenced query authz grants-by-grantee <WARM_ADDRESS> \
    --node "http://node1.gonka.ai:8000/chain-rpc/"
```

3) 意向（由热密钥签名）

`generate-only --from`是冷密钥地址（bech32，无需冷密钥）。`authz exec --from`是此密钥环中的热密钥名称。

```
./inferenced tx inference declare-poc-intent zai-org/GLM-5.3-Flash \
    --from <COLD_ADDRESS> \
    --generate-only --offline --account-number 0 --sequence 0 \
    > declare-intent.json

./inferenced tx authz exec declare-intent.json \
    --from <WARM_KEY> \
    --keyring-backend file \
    --gas 300000 \
    --chain-id gonka-mainnet \
    --home ~/mainnet \
    --node "http://node1.gonka.ai:8000/chain-rpc/"
```

在授权后，相同的`generate-only` + `authz exec`流程适用于任何其他消息类型。

## 计算证明（PoC）

### 什么是计算证明？

计算证明（PoC）是一种共识机制，它用可证明的基于Transformer的计算能力替代基于资本或哈希的权重。它定义了如何测量和转换真实的AI计算，以形成治理和共识权重。PoC通过每个纪元末期进行的短时同步Sprint执行。在Sprint之外，纪元用于现实世界的AI计算。实际上，术语“计算证明（PoC）”和“Sprint”常可互换使用。当提到“下一个PoC”或“PoC阶段”时，通常指下一个Sprint，即计算证明的执行阶段。

### 什么是Sprint？

Sprint是计算证明的一个阶段。在Sprint期间，所有主机同时在具有随机化层的Transformer上对非ces流运行AI相关推理，生成输出向量。只要报告的输出可验证是由所需Sprint模型生成的，主机的下一个纪元投票权与其处理的非ces数量成正比。

### 如何模拟计算证明（PoC）？

你可能希望在自己的ML节点上模拟PoC，以确保在链上PoC阶段开始时一切正常工作。

要运行此测试，你需要有一个未注册到API节点的正在运行的ML节点，或暂停API节点。要暂停API节点，请使用`docker pause api`。测试完成后，你可以取消暂停：`docker unpause api`。

对于测试本身，你需要向ML节点发送POST `/v1/pow/init/generate`请求，这与API节点在PoC阶段开始时发送的请求相同：
[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32)

PoC使用的以下模型参数：[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41)

如果您的节点处于`INFERENCE`状态，则首先需要将节点转换为停止状态：

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
将此请求发送到ML节点代理容器的`8080`端口，或直接发送到ML节点的`8080`[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/deploy/join/docker-compose.mlnode.yml#L26](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/deploy/join/docker-compose.mlnode.yml#L26)

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
然后服务将开始向`DAPI_API__POC_CALLBACK_URL`发送生成的非ces。
```
2025-08-25 20:54:58,822 - pow.service.sender - INFO - Sending generated batch to http://api:9100/
```
如果你暂停了API容器，或ML节点容器和API容器未共享相同的Docker网络，则http://api:9100网址将不可用。你可能会看到错误消息，表明ML节点未能发送生成的批次。重要的是确保生成过程正在发生。

### 确认比率0意味着什么？如果发生这种情况我该怎么办？

0%的确认比率是一种异常情况，表明在纪元期间没有任何非ces从你的API节点发送，意味着该节点完全没有参与确认计算证明（CPoC）。为调查原因，请检查API节点日志和ML节点日志，它们应能说明为何未提交非ces。

可能的原因包括：

- API节点配置错误或停机
- 公开暴露的管理端口允许访问ML节点
- 共识节点落后于链，可能导致PoC参与超出允许窗口
- ML Node 驱动程序故障

为减轻此风险，请确保管理员和管理端口不公开访问，验证 API 节点正在运行且配置正确，监控共识节点同步状态，并为 ML Node 和驱动程序故障设置警报。

## 性能与故障排除

### 如何使用代理预发布版（v0.2.8）保护我的节点免受 DDoS 攻击？

现已推出新版本代理，包含速率限制和 DDoS 防护措施。

新增功能：

- 对 API/RPC 端点实施速率限制，以防止过多请求影响网络节点
- 阻止资源密集型内部路由，如 `training` 和 `poc-batches`
- 可选禁用 `/chain-api`、`/chain-rpc` 和 `/chain-grpc` 端点

**更新说明****步骤 1**：更新代理镜像
```
sed -i -E 's|(image:[[:space:]]*ghcr.io/product-science/proxy)(:.*)?$|\1:0.2.8-pre-release-proxy@sha256:6ccb8ac8885e03aab786298858cc763a99f99543b076f2a334b3c67d60fb295f |' docker-compose.yml
```
!!! note "重要"
	步骤 2 将禁用此节点上的 `/chain-api`、`/chain-rpc` 和 `/chain-grpc` 端点。应用后，此节点将不再提供公共 RPC 流量。如果您运行公共 RPC 端点，则必须运行独立的仅 RPC 节点（无这些限制），并保持此节点为私有。

	**步骤 2（可选）**：禁用 `chain-api`、`chain-rpc` 和 `chain-grpc`

	如果您希望完全禁用 `/chain-api`、`/chain-rpc` 和 `/chain-grpc` 端点：
```
sed -i 's|DASHBOARD_PORT=5173|DASHBOARD_PORT=5173\n      - DISABLE_CHAIN_API=${DISABLE_CHAIN_API:-true}\n      - DISABLE_CHAIN_RPC=${DISABLE_CHAIN_RPC:-true}\n      - DISABLE_CHAIN_GRPC=${DISABLE_CHAIN_GRPC:-true}\n|' docker-compose.yml
```
禁用曾用于近期攻击的训练 URL：
```
sed -i -E -e '/GONKA_API_(EXEMPT|BLOCKED)_ROUTES/d' -e 's|(- GONKA_API_PORT=9000)|\1\n      - GONKA_API_EXEMPT_ROUTES=chat inference\n      - GONKA_API_BLOCKED_ROUTES=poc-batches training|' docker-compose.yml
```
完成后，您的代理配置应如下所示：
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

如需持续监控 `watch`：
```
watch -n 5 'docker exec node wget -qO- http://localhost:26657/status | jq -r ".result.sync_info | \"Block: \(.latest_block_height) | Time: \(.latest_block_time) | Syncing: \(.catching_up)\""'
```

### Cosmovisor 更新需要多少可用磁盘空间？如何安全删除 `.inference` 目录中的旧备份？
Cosmovisor 在每次更新时都会在 `.inference` 状态文件夹中创建完整备份。例如，您可以看到类似 `data-backup-<some_date>` 的文件夹。
截至 2025 年 11 月 20 日，数据目录大小约为 150 GB，因此每个备份将占用大致相同的空间。
为安全执行更新，建议保留 250 GB 以上的可用磁盘空间。
您可以删除旧备份以释放空间，但在某些情况下这可能仍不足，您可能需要扩展服务器磁盘。
要删除旧备份目录，可使用：
```
sudo su
cd .inference
ls -la   # view the list of folders. There will be folders like data-backup... DO NOT DELETE ANYTHING EXCEPT THESE
rm -rf <data-backup...>
```

### 如何防止 NATS 的无界内存增长？

NATS 目前配置为无限期存储所有消息，导致内存使用量持续增长。
推荐的解决方案是为 NATS 流中的消息配置 24 小时的生存时间（TTL）。

1. 安装 NATS CLI。请按照以下说明安装 Golang：[https://go.dev/doc/install](https://go.dev/doc/install)。然后安装 NATS CLI：
   ```
   go install github.com/nats-io/natscli/nats@latest
   ```
2. 如果您已安装 NATS CLI，请运行：
    ```
    nats stream info txs_to_send --server localhost:<your_nats_server_port>
    nats stream info txs_to_observe --server localhost:<your_nats_server_port>
    ```
### 如何更改 `inference_url`？

您可能需要更新 `inference_url`，如果：

- 您更改了 API 域名；
- 您将 API 节点迁移到新机器；
- 您重新配置了 HTTPS/反向代理；
- 您正在迁移基础设施，并希望主机条目指向新的端点。

此操作无需重新注册、重新部署或密钥再生。更新您的 `inference_url` 通过与初始注册相同的交易完成（即 `submit-new-participant msg`）。

链逻辑检查您的主机（参与者）是否已存在：

- 如果参与者不存在，交易将创建一个新的参与者；
- 如果参与者已存在，仅可更新三个字段：`InferenceURL`、`ValidatorKey`、`WorkerKey`。

所有其他字段将自动保留。

这意味着更新 `inference_url` 是一种安全且非破坏性的操作。

!!! note 

    当节点更新其执行 URL 时，新 URL 会立即对来自其他节点的推理请求生效。然而，记录在 `ActiveParticipants` 中的 URL 仅在下一个纪元才会更新，因为过早修改会使与参与者集合相关的加密证明失效。为避免服务中断，建议在下一个纪元完成前同时保持旧 URL 和新 URL 处于运行状态。

    [LOCAL] 使用您的冷密钥本地执行更新：
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

### 为什么我的 `application.db` 增长得如此之大？如何解决？

某些节点存在 `application.db` 大小持续增长的问题。

`.inference/data/application.db` 存储链的状态历史（而非区块），默认为 362880 个状态。

状态历史包含每个状态的完整默克尔树，将其保留更短的时间是安全的，例如仅保留 1000 个区块。

修剪参数可在 `.inference/config/app.toml` 中设置：

```
...
pruning = "custom"
pruning-keep-recent = "1000"
pruning-interval    = "100"
```

新配置将在 `node` 容器重启后生效。但存在一个问题——即使启用了清理，数据库清理仍然非常缓慢。

重置 `application.db` 有多种方法：

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
        inferenced snapshots restore <INSERT_HEIGHT> 3  --home .inference/temp
        ```

    这可能需要一些时间。完成后，您将在 `.inference/temp/data/application.db` 中获得新的 `application.db`

2) 用新版本替换 `application.db`

2.1) 停止 `node` 容器（从另一个终端窗口） 
        ```
        docker stop node
        ```

    2.2) 移动原始 `application.db` 
        ```
        mv .inference/data/application.db .inference/temp/application.db-backup
        mv .inference/wasm .inference/wasm.db-backup
        ```

    2.3) 用新版本替换它 
        ```
        cp -r .inference/temp/data/application.db .inference/data/application.db
        cp -r .inference/temp/wasm .inference/wasm
        ```

    2.4) 启动 `node` 容器（从另一个终端窗口）： 
        ```
        docker start node
        ```

    3) 等待 `node` 容器同步完成并删除 `.inference/temp/`

如果您有多个节点，建议逐个清理。

=== "选项 3：实验性方法"

另一种可选方法是在单独的 CPU 机器上启动独立的 `node` 容器实例，并设置为严格验证者模式：

    - 保留极短的历史记录
    - 仅允许 RPC 和 API 访问 `api` 容器

一旦运行，将现有 `tmkms` 卷移动到新节点（先禁用现有节点的区块签名）。

这是该方法的大致思路。如果您决定尝试并有任何问题，欢迎在 [Discord](https://discord.gg/REcpeYc7P7) 上联系。

=== "选项 4：升级到清理修复版本"

现已提供修复程序，解决 `application.db` 在多种清理配置下持续增长的长期问题。
	此改进由 [Lelouch33](https://github.com/Lelouch33) 贡献，并包含在发布版本 [`0.2.10-post6`](https://github.com/gonka-ai/gonka/compare/main...release/v0.2.10-post6) 中。使用更新后的逻辑和以下设置，`application.db` 可保持在约 100 GB：

	- `SNAPSHOT_INTERVAL=1000`
	- `SNAPSHOT_KEEP_RECENT=2`
	- `pruning-keep-recent = "20000"`
	- `pruning-interval = "512"`

参考：

	- [https://github.com/gonka-ai/gonka/issues/819#issuecomment-3996332369](https://github.com/gonka-ai/gonka/issues/819#issuecomment-3996332369)
	- [https://github.com/gonka-ai/gonka/pull/867](https://github.com/gonka-ai/gonka/pull/867)

升级到此二进制文件后，清理将在下一个快照区块后开始。此过程较为繁重，可能在移除旧状态历史时暂时减慢 `node` 容器的速度。

为减少运营影响，建议逐个节点应用更新，并使用更高的 `pruning-interval`，例如 `512`，以避免过于频繁地修剪。

如果在修剪过程中某个节点显著变慢，重启该节点容器可能有助于其追赶进度。

建议在即将进行的 v0.2.11 升级前应用此更新，以防止大量节点同时开始修剪。

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

### 升级 v0.2.14：升级前网桥更新

为帮助在主网升级期间保持以太坊网桥的稳定性，请提前将网桥镜像更新至 `0.2.14-post3`。
如果您有多个网络节点，请逐个更新。
请确保在 PoC 或 cPoC 之外执行此步骤。

所有命令请在 **deploy/join** 目录下运行（其中包含 `docker-compose.yml` 和 `.dapi/`）。

**将网桥镜像更新为 0.2.14-post3**

```yaml
  bridge:
    container_name: bridge
    image: ghcr.io/product-science/bridge:0.2.14-post3
```

**重启网桥容器**

```bash
source config.env && docker compose up --force-recreate bridge
```

### 升级 v0.2.12：升级前模型清理

!!! note "重要"
	此清理过程**必须在升级前完成**。如果您在清理模型前升级，节点将被拒绝并离线。

	版本 0.2.12 将移除所有不在升级后批准列表中的治理模型。在主网上，仅保留此前强制执行的模型和 Kimi。

	每个 DAPI 都会将 MLNode 配置本地持久化。启动时，它会将每个配置的模型与链上治理列表进行验证。如果配置包含至少一个不受支持的模型，整个节点将被拒绝，主机将离线。

	版本 0.2.11 通过将运行时视图修剪为强制模型来掩盖此问题，因此即使持久化配置中仍包含额外模型，`/admin/v1/nodes` 也显示为干净。版本 0.2.12 停止了此修剪，意味着直接加载持久化配置。

	为修复此问题，以下脚本将查找 `/admin/v1/config` 中包含额外模型的每个节点，并向 `/admin/v1/nodes/<id>` 发送带有清理后配置的 `PUT` 请求。这些更改将在 60 秒内持久化。剩余模型的参数、硬件和端口将完全保留。未列出强制模型的节点将被跳过，需手动修复。

	将以下脚本粘贴到主机的 shell 中。默认情况下，它将应用更改。若要预览更改而不应用，请设置 `APPLY=dry`（或任何非 `--apply` 的值）。

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


运行脚本后等待 60 秒，以确保更改已持久化，然后再触发升级。然后验证配置：

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



### 升级 v0.2.12：预先下载二进制文件

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

贡献者的完整指南请参阅 [奖励计划](bounty-program.md) 页面。常见问题的简短解答如下。

### 什么是奖励计划？谁可以参与？奖励如何支付？

无需是主机即可参与：任何人都可以报告安全漏洞，或为更广泛的 Gonka 基础设施贡献修复、改进和新功能。

有两个互补的路径：

- **安全漏洞** 通过 Gonka 在 **[HackerOne](https://hackerone.com/)** 的项目处理。请参阅下方的 [如何报告安全漏洞？](#how-do-i-report-a-security-vulnerability)。
- **协议贡献**（修复、改进和新功能）通过 GitHub 由社区提出、审查和验证，奖励通过网络升级以稳定币支付。请参阅 [如何为协议开发做贡献？](#how-do-i-contribute-to-protocol-development) 下方。

### 如何报告安全漏洞？

Gonka 在 **HackerOne** 上运行其安全计划。请通过 **[gonka.ai/docs/report-vulnerability](https://gonka.ai/docs/report-vulnerability/)** 表单提交所有漏洞报告，而非在公开问题、拉取请求或聊天中披露。

HackerOne 上奖励的运作方式：

- **您的报告在 HackerOne 上完成分类后即支付** —— 不**需要**您同时提交修复方案。
- **修复方案可能获得单独奖励。** 该金额将单独协商，不是报告的自动额外奖励。
- 权威的严重性模型、奖励金额、类别、范围和资格规则均由HackerOne上的项目定义。**在提交之前，请务必阅读HackerOne上的完整项目条款**，因为它们优先于此处的任何摘要。

### 漏洞严重性模型是什么？

最终的严重性分类和奖励金额由HackerOne上的Gonka项目确定。下表仅作为严重性评估方式的一般参考。

思考严重性的一种常见方式是： 
```
Risk = Impact × Likelihood
```
影响从网络角度进行评估（需要网络范围的影响才能评为高/关键）。仅影响单个参与者的漏洞通常最高为低或中等。

**影响级别**

| 级别 | 描述 | 示例 |
|----------|--------------------------------------|--------------------------------------------------------------------------|
| 关键 | 对整个网络造成灾难性影响 | 完全控制网络 |
| 高 | 大规模严重干扰 | 网络崩溃/停止；模块资金被盗；所有参与者奖励错误 |
| 中等 | 中等程度的干扰，范围有限 | 共识或奖励完整性面临风险；单个参与者的资金或可用性受影响 |
| 低 | 对孤立参与者影响轻微，无链上影响 | 单个组件对单个参与者的轻微影响，非链上 |

**可能性**

- **自发性——非故意；** 在正常条件下发生。根据概率估算（条件触发的频率、使用模式）。
- **故意——有利可图**——为获取经济利益而利用。当收益高且成本/复杂性低时，可能性更高。
- **故意——恶意破坏**——为造成干扰而利用。当网络范围影响且成本低时，可能性更高；单个参与者的恶意破坏→可能性较低。

**风险矩阵**

| 影响 \ 可能性 | 高 | 中等 | 低 |
|---------------------|----------|----------|---------------|
| 关键 | 关键 | 关键 | 高 |
| 高 | 关键 | 高 | 中等 |
| 中等 | 高 | 中等 | 低 |
| 低 | 中等 | 低 | 信息性 |

### 如何为协议开发做出贡献？

如果您希望帮助开发协议（而非报告安全问题），工作流程由社区在 GitHub 上驱动：

1. **开始讨论。** 在 [GitHub Discussions](https://github.com/gonka-ai/gonka/discussions) 中发布您的想法，首先获得社区支持。同一主题可能已被讨论过，或当前方法可能是权衡的结果。然后选择一个 [现有的 `up-for-grabs` 问题](https://github.com/gonka-ai/gonka/issues?q=is%3Aissue%20state%3Aopen%20label%3Aup-for-grabs) 或创建一个新的问题。在开始现有问题之前，请留言说明工作已启动，并提供大致的预计完成时间。
2. **打开拉取请求。** 提交一个可靠的修复或实现，并向 [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/) 提交 PR。
3. **持续寻求评审。** 邀请其他社区成员对 Issue 或 PR 进行评论，以便该变更能被审查并纳入网络升级。

**贡献奖励如何支付：** 被接受的贡献奖励将通过网络升级以 **稳定币** 形式支付。与所有链上操作一样，升级及其支付需经过治理批准。

### 我在哪里提出和讨论协议的想法？

- 将您的想法发布为 **[GitHub Discussions](https://github.com/gonka-ai/gonka/discussions)**。从 **[欢迎来到提案 #795](https://github.com/gonka-ai/gonka/discussions/795)** 的入门指南开始，其中解释了哪些内容适合此处以及如何撰写一个有力、结构清晰的提案。
- 在社区活跃的渠道中收集反馈——Telegram 群组、其他社区群组以及 [Gonka Discord](https://discord.gg/REcpeYc7P7)。请将关键上下文汇总回 GitHub Discussions，以便完整历史记录保持可搜索且集中。

### 我在哪里查看当前的协议优先级？

社区对齐的 **[Gonka 网络开发路线图](https://github.com/gonka-ai/gonka/blob/main/proposals/gonka-network-development-roadmap.md)** 描述了战略方向、路线图轨迹和当前协议开发的优先事项。使用它来了解当前最重要的事项，并使您的贡献和提案与网络方向保持一致。

### 我在哪里查看谁获得了奖励、奖励内容及时间？

对于安全奖励，记录保存在 **HackerOne** 上的 Gonka 计划中。对于协议贡献，**链上** 是权威来源：支付在链上执行。您也可以在 [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/) GitHub 仓库中检查相应记录。Discord 的 `#bounty-awards` 频道会发布部分信息，但可能不完整且非权威。

## 错误

### `No epoch models available for this node`

在这里您可以找到常见错误示例以及节点日志中可能出现的典型日志条目。

```
2025/08/28 08:37:08 ERROR No epoch models available for this node subsystem=Nodes node_id=node1
2025/08/28 08:37:08 INFO Finalizing state transition for node subsystem=Nodes node_id=node1 from_status=FAILED to_status=FAILED from_poc_status="" to_poc_status="" succeeded=false blockHeight=92476
```
这实际上不是错误。它只是表示您的节点尚未分配模型。很可能是因为您的节点尚未参与过冲刺，未获得投票权，因此尚未分配模型。
如果您的节点已通过PoC，则不应再看到此日志。如果没有，PoC大约每24小时进行一次。

### 从状态同步快照启动时如何修复 `err="no validator signing info found"`？

如果您在从状态同步快照启动时定期遇到 `err="no validator signing info found"`，这通常与 Cosmos SDK `iavl-fastnode` 行为有关。一个安全的解决方法是在初始启动时禁用 `fastnode`，然后（可选）在节点完全同步后重新启用它。

**修复方法（Docker）：**

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
重启后，该问题不应再出现。

!!! note 
	`main` 包含 v0.2.10-post6。从该版本开始，节点会自动应用此设置，因此通常无需手动更改。

## 推理

!!! note 
    下面的几个答案讨论了该模型服务时的 `moonshotai/Kimi-K2.6` 请求格式。[提案101](./network-updates.md#proposal-101) 已将其从 `poc_params` 中移除；它仍存在于治理目录中，但不是PoC模型，目前也不提供服务——查询 `/v1/epochs/current/participants` 和代理的 `GET /v1/models`。`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 已由提案78移除。

### 为什么4,096个输出令牌限制会导致模型在思考时停滞——返回零个令牌？

**如果您遇到以下情况，则与此相关**

- 您看到 `content=null` 和 `finish_reason=length`。
- 模型是“沉默”的——使用情况显示有令牌，但没有文本输出。
- 使用 `max_tokens=100` 的探测请求没有任何返回。

**修复首选：Kimi-K2.6 的可用配置**

如果您没有时间深入排查——请将此负载作为起点复制。截至2026-05-28，它在两个公共代理上有效；在使用前请与您的代理运营商确认是否仍为最新。

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

为何使用这些确切字段：

- `max_tokens: 4096` —— 让模型使用全部可用的输出配额。当前代理的有效上限为3,072（参见Q3）——超过此值无用。最低不得低于256，否则网关可能强制将 `thinking_token_budget` 设为零。
- `thinking: {"type": "disabled"}` —— 通过聊天模板提示禁用隐藏思考。
- `thinking_token_budget: 0` —— 双重保险：在生成参数级别显式将配额归零（参见Q2）。
- **模型ID区分大小写：** `moonshotai/Kimi-K2.6`（大写K）在 `gonka-api.org` 上，`moonshotai/kimi-k2.6`（小写k）在 `gonkagate.com` 上。遇到404——请切换大小写。与 `GET /v1/models` 的响应交叉核对。

可直接使用的 curl 命令（替换 `<broker>` 和模型ID大小写）：

```bash
curl -sS https://<broker>/v1/chat/completions \
  -H "Authorization: Bearer $GONKA_API_KEY" \
  -H "Content-Type: application/json" \
  -d @payload.json
```

如果返回了有意义的文本——问题出在您的原始负载上；逐项对比字段。如果 `content=null`——请捕获响应中的 `id` 并发送给代理支持团队。

**首先检查您的代理上规则是否生效**

网关行为取决于代理，并随时间变化。运行以下测试：

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
| `devshard ≥ 0.2.13`（强制低于256时归零生效） | `finish_reason="length"`，约0–10个推理令牌 |
| 旧版本 | `finish_reason="length"`，约40–60个推理令牌（默认 `max_tokens / 2`） |

以下规则描述的是最新网关代码（`devshard ≥ 0.2.13`）。您的代理可能尚未更新。不确定版本？——请先运行上述首选修复。如果能返回有意义的文本，则网关版本足够新。否则，请将 `response.id` 发送给代理支持团队，询问是否需要更新。

**模型和网关端会发生什么****Kimi-K2.6 特性。** 模型会输出 `<think>…</think>` 块。**两个部分（`<think>` 和可见内容）均同等消耗 `max_tokens`。** 当 `max_tokens` 较小时，模型会将全部配额消耗在 `<think>` 中，仅返回 `</think>`，而 vLLM 会将其作为特殊令牌剥离 → `content=null`，`finish_reason=length`。从客户端角度看——“0个令牌”。

**网关对 `thinking_token_budget` 的规则（PR #1202，devshard 0.2.13+）：**

| 条件 | 网关的作用 |
|---------|---------------------|
| `max_tokens < 256` | `ttb = 0`（强制为零，覆盖客户端） |
| `ttb` 未设置，`max_tokens >= 256` | `ttb = max_tokens / 2` |
| 客户端设置的 `ttb` | 使用客户端的值 |
| 始终 | 限制：`ttb ≤ 96,000` 和 `ttb ≤ max_tokens − 64` |

此外：

- **`max_tokens` 下限 → 16**（PR #1227）——以前 `max_tokens=1` 总是产生 `content=null`。现在它会静默提升到 16。
- **`thinking: {"type":"disabled"}` 镜像**（PR #1224）——网关将其镜像到 `chat_template_kwargs.thinking=false`。Kimi 聊天模板读取该关键字参数。

历史上产生 `content=null`（`max_tokens=1`，探测形状 `max=100, min=100, ttb=50`）的场景，现在通过新网关返回非空内容。在 `gonkagate.com`（2026-05-25）上，`max_tokens=100` 在没有 `ttb` 的情况下返回了约 50 个推理标记——此时 force-zero-below-256 未激活。

**对于推理用户：**

- 使用网关版本 ≥ 0.2.13（发布于 2026-05-23+）的代理重新测试。
- 观察到零标记——捕获响应中的 `id` 并发送给代理。提取方法：

  ```bash
  curl ... | jq .id
  ```

  格式：`devshard-<short>-<short>`，例如 `devshard-7a4f-31b2`。发送位置：代理的支持渠道（对于 `gonka-api.org`——网站上的支持链接；对于 `gonkagate.com`——`/contact` 部分）。
- **不要仅依赖 `thinking:disabled`**——为确保安全，请显式设置 `thinking_token_budget: 0`（参见 Q2）。

**对于代理：** 在 0.2.13 之前——根据您的验证/发布周期更新（无需紧急：旧版本客户端和托管规则需要重新认证）。在更新前，客户端应用上述解决方法；更新后，零输出 `content=null` 的情况将消失。

### 使用 Kimi K2 时，整个标记限制可以全部用于思考而无实际输出。这是输出限制、带宽问题，还是上游问题？

**这是网关策略，而非模型限制。** `thinking_token_budget` 解析器（PR #1202）默认分配 `max_tokens / 2` 用于推理。在工具密集型流程中，预算在产生任何有用输出前即耗尽。缓解方法是显式设置 `thinking_token_budget: 0` 或 `thinking: {"type": "disabled"}`（网关通过 PR #1224 将其镜像到 `chat_template_kwargs`）。模型仅遵循预算。

原因同 Q1——模型将 `max_tokens` 分配给 `<think>` 和可见内容。这不是带宽问题，也不是输出限制。

**两个逃生通道**

1. **`thinking: {"type": "disabled"}`**——网关将其镜像到 `chat_template_kwargs.thinking=false`（Kimi 聊天模板读取该关键字参数），并移除顶层 `thinking`。`"adaptive"` 和 `"auto"` 被接受（Claude Code CLI / Anthropic SDK 预设，PR #1224）——两者均解析为 `enabled`。
2. **`thinking_token_budget: 0`**——显式设置为零将直接作为生成参数传递给 vLLM，可靠地将思考预算归零。

**重要细节：** 这两种机制作用于不同层级（聊天模板提示 vs. 生成参数），互不重叠。`thinking:disabled` 不会自动归零 `thinking_token_budget`——在默认 `max_tokens=4096` 且仅设置 `disabled` 的情况下，模型仍会从网关解析器获得隐藏的 `ttb=2048`。我们的测试表明，Kimi 在高推理提示下仍尊重 `thinking:disabled`。模型文档（计划中的 `docs/chat-api/kimi-k2.6.md`）警告，在某些推理场景中模型可能忽略该提示——我们未复现此情况，但仍做防范。**双重保障：** 对于关键流程，请同时发送这两个参数。

**数值确认**

相同的 bug 发现提示，`max_tokens=500`，答案在语义上完全一致：

| 配置 | usage.completion_tokens | 实际耗时 |
|---|---|---|
| `thinking: {"type":"disabled"}` | **65** | 3.6s |
| 默认（网关解析器 → ttb = max_tokens/2 = 250） | **312** | 12.5s |

默认预算的一半被用于隐藏思考，即使对于简单任务——因此建议在工具密集型/智能体流程中禁用思考。

**对于推理用户：**

- 无推理的工具密集型/智能体流程——`"thinking": {"type": "disabled"}`（Kimi）。
- 复杂推理——显式设置 `thinking_token_budget`（不要依赖默认 `max_tokens / 2`）。
- 如果 `thinking:disabled` 仍导致您的提示耗尽预算——显式复制它并设置 `thinking_token_budget: 0`。

**对于代理：** 在 0.2.13 之前——按周期更新。在更新前，客户端应用上述解决方法。在主页上注明：Kimi 用于工具密集型流程时，需设置 `thinking:disabled`，或显式设置 `thinking_token_budget`，或使用较大的 `max_tokens`。

### Kimi 的输入令牌上限为 4k 令牌，输出上限为 8,192 令牌。这些限制何时会提高？

**问题中的数字不正确**

- **输出上限：3,072 令牌**（在两个测试的经纪人上均如此，即使使用 `max_tokens=8000`，在恰好 3,072 时也会返回 `finish_reason=length`）。
- **输入：最多 240,000 令牌**（在主网 Kimi 部署中为 `--max-model-len`）。不是 4,000。

**输出上限的来源**

代码中的网络上限为 4,096（`RequestMaxTokensCap`），但有效限制更低。确切机制是黑箱。可能的解释（按可能性排序，**未通过公开代码确认**）：

1. 网关默认的 `DefaultRequestMaxTokens = 3,072` 未被经纪人操作员覆盖。
2. 经纪人操作员通过管理端点（`POST /v1/admin/settings`）为每个模型设置了 `request_max_tokens_cap = 3,072`。
3. 上游 DAPI 或主机端限制（例如 vLLM `--max-tokens-per-request` 或加载器约束）。

要确切了解——请向经纪人查询每个模型的 `request_max_tokens_cap` 值。

**3,072 令牌能容纳多少内容**

| 场景 | 能否容纳在 3,072 令牌内？ |
|----------|-------------------|
| ~1,900–2,200 个常规英语单词 | 是 |
| ~600–800 行 Python/JS 代码 | 是 |
| 简短回答（5–10 句话） | 是 |
| 一次工具调用 + 中等大小的 JSON（`arguments` ≤ 500 令牌） | 是 |
| 小型结构化输出（3–5 个摘要要点） | 是 |
| 长文档摘要（>10k 源令牌） | 否 |
| 大型代码差异（>2k 行） | 否 |
| 一次响应中包含 3 个及以上并行工具调用 | 否 |
| 智能体循环：同时进行推理 + 工具调用 + 可见内容 | 否 |

对于第二组使用场景——请向经纪人申请提高上限（参见 **对经纪人**）。

**如何提高上限**

输出上限由**经纪人**控制，而非网络。要提高它——请联系您的经纪人：他们可以通过单次管理调用增加 `request_max_tokens_cap`（无需代码更改）。若要将网络范围的上限提升至 4,096 以上，则需要向网关代码提交 PR 并发布新版本；您可通过 `gonka-ai/gonka` 上的 GitHub 讨论发起此请求。

对于好奇者/操作员：区块链存储每个模型的价格参数（`coins_per_input_token`、`coins_per_output_token`）和部署参数（`model_args`），但没有用于硬性输出限制的字段——放宽限制是经纪人本地策略，而非治理定义的值。

**240k 输入的来源**

主网 Kimi-K2.6 部署是通过链上治理提案 v0.2.12（`inference-chain/app/upgrades/v0_2_12/upgrades.go:kimiGovernanceModel()`）注册的：

```text
ModelArgs: ["--max-model-len","240000",
            "--tool-call-parser","kimi_k2",
            "--reasoning-parser","kimi_k2"]
VRam: 720 (GB)
```

模型卡声明支持256K原生上下文。网关对输入没有单独限制，除了通用的请求体大小（10 MiB）和消息数量（≤ 2,048）——详见`docs/chat-api/README.md`中的“请求限制”部分（待发布文档）。

**重要注意事项（开放问题）**

即使代理同意提高输出上限，单个节点仍可能以较小的`--max-model-len`启动。网关路由层不考虑每个主机的上下文容量（[问题 #818](https://github.com/gonka-ai/gonka/issues/818)）。对于大负载（>50k），落在“小”节点上是系统性行为，而非偶然随机。

**对于推理用户：**

- 实际输出上限由代理决定——请向其询问每个模型的`request_max_tokens_cap`值。
- 遇到较小的输入限制——这几乎肯定是某个节点上的`--max-model-len`，而非全局限制。路由层未考虑每个主机的上下文（问题 #818）；对于大负载（>50k）这是系统性问题。解决方法：重试或将请求拆分为多个API调用。
- 遇到输出上限——请要求代理提高它。全网提升（超过4,096）需要代码变更；请在`gonka-ai/gonka`的GitHub讨论中提出。

**对于代理：**

- 按模型提升上限只需通过`POST /v1/admin/settings`配合⟦MDMDKEEP1⟧进行一次管理调用，无需代码变更。这会增加每请求的保证金暴露风险，并可能触发每个主机的`--max-model-len`（节点上的5xx错误）。仅在确认所有保证金节点上的`--max-model-len`后，针对有明确需求的模型提升。
- 全网提升（超过4,096）需要向网关代码提交PR并发布新版本。若对大输出有稳定需求，请发起讨论。

### 像Hermes、OpenClaw这样带有3万以上系统提示的代理在Kimi上失败，为什么？

**简要说明**

Kimi模型在模型和网关层面都接受3万+的输入，但稳定性取决于路由。原生窗口为256K，主网部署使用`--max-model-len 240000`，网关接受最多10 MiB的请求体。实测表明，单次约69,000个提示标记（约800条消息 × 每条80词）可在5.5秒内完成。但在持续或重复的长请求（>50k）中，您会遇到不稳定情况（问题#818）——对于大负载（215k），重复尝试可能因503错误而失败。

**验证来源（均在`gonka-ai/gonka`中）**

- 原生上下文256K——`docs/chat-api/`中的模型卡片（确切文件名计划作为chat-api文档集的一部分）。
- 主网部署参数（链上）——`inference-chain/app/upgrades/v0_2_12/upgrades.go:kimiGovernanceModel()`。
- 请求体/消息限制（10 MiB，≤2,048条消息）——`docs/chat-api/README.md`（计划中），"请求限制"部分。

**当30k失败时——两个典型原因****1. 代理负载中单个被拒绝的字段。** 网关维护严格的白名单。如果代理发送了任何一个非标准字段（`tags`、`enforced_tokens`、`plugins`、`guided_json`）——整个请求将被拒绝并返回HTTP 400。Hermes特有的`tags`拒绝——锚点`#reject-tags`在`docs/chat-api/troubleshooting.md`中（计划中）。实测：一个有效的69k负载 + `tags:["session:abc"]` → 2秒内返回HTTP 400。

**2. 路由到具有较小`--max-model-len`的节点。** 网关路由层在路由时未考虑主机的实际上下文大小（[问题#818](https://github.com/gonka-ai/gonka/issues/818)；另见计划中的`known-issues.md` §3）。对于超长负载（>50k，尤其是>200k），落在“小”节点上是网络层面的**系统性行为**，而非客户端错误：我们的测量显示，5次215k请求全部失败。请求将在vLLM端失败。

一个相关构建器请求：[issue #1229](https://github.com/gonka-ai/gonka/issues/1229)（2026年5月开启），代理场景的阻塞问题——长推理链、工具调用兼容性、超出输出限制后的继续执行。

**快速自检清单**

1. 逐个移除字段 `tags`、`enforced_tokens`、`plugins`、`strict`、`guided_json`、`guided_regex`、`guided_grammar`、`guided_choice`。每次移除后重新发送相同请求。
2. 如果移除所有字段后仍无改善——检查 `tools[].function.parameters` 中的模式深度（≤16）和总节点数（≤256），参见 Q9。
3. 负载内容正常但仍失败——这是网络层问题（issue #818）。解决方法：重试或拆分请求。

**针对推理用户：**

- 首先检查负载是否符合 `docs/chat-api/README.md` 中的白名单（计划中）。大多数 Hermes / OpenClaw 400 错误是由单个字段或模式引起的。
- **通用代理消息如“上游模型提供商拒绝”具有误导性：** 一些代理将特定的网关 400 错误合并为通用消息，一些则传递原始消息（`"Chat completions parameter \"tags\" is currently rejected by the Gonka network..."` 链接至文档）。代理对比——`comparison-brokers.md`（计划中）。**如果一个代理显示通用错误——尝试另一个代理以获取可读消息并定位根本原因。**
- 负载内容正常但仍失败——网络层问题（issue #818）。解决方法：重试或拆分；对于持续超过 50k 的负载，单次重试往往不够——需拆分。

**针对代理：**

- (1) 在首页、通过 `/v1/models` 端点或文档中明确显示每个模型的原生上下文窗口，并注明由于主机异构性，实际每请求容量可能更低（issue #818）。一些代理故意省略此信息以避免过度承诺——这是合理的选择。(2) 在主机级容量广告功能实现前——考虑客户端过滤或“首选主机”列表。
- **用户体验：** 网关返回包含字段名和消息的特定 400 错误（`"Chat completions parameter \"tags\" is currently rejected by the Gonka network..."` + 链接到文档）。我们建议在生产环境中将详细信息传递给客户端——这能加快诊断速度。**安全提示：** 详细消息可能泄露内部字段名、主机路径和验证器 ID，便于枚举或提示注入攻击。保守的掩码是合理默认值。若为安全起见将其包装为通用 `"upstream provider rejected"`——建议采用混合方案：在异步日志/错误追踪中保留完整细节，向客户端返回含追踪 ID 的通用消息。代理兼容性映射——`docs/chat-api/agents.md`（计划中）。

### 为什么 Kimi 在输出超过 4k–8k 个 token 时会生成格式错误的 JSON 工具调用？

既非带宽问题，也非 Gonka 侧限制。三个重叠原因。

**(a) `max_tokens` 截断**

在测试的代理中，有效输出上限为 3,072 个 token；网关网络上限为 4,096。当助手在 `arguments` 中生成包含大型 JSON 数据块的工具调用并附加可见内容时，可能触及代理的实际上限，导致 JSON 被截断。各代理的覆盖详情——Q3。

**(b) Kimi-K2.6 工具解析器的重复 ID 冲突**

`[vLLM PR #21259 — UNVERIFIED]`。使用 `n > 1` 时，`kimi_k2` 解析器在每个 choice 循环内重新计算 `history_tool_call_cnt`——两条分支均获得 `id = functions.<name>:0`。网关在 vLLM 的响应中发现重复 ID，根据 OpenAI 规范拒绝并返回 HTTP 400。在 `docs/chat-api/troubleshooting.md` 中锚定 `#reject-duplicate-tool-call-id`（计划中）。上游修复——[vLLM PR #21259](https://github.com/vllm-project/vllm/pull/21259)（合并状态尚未独立确认）。

**(c) Hermes 工具解析器在多个工具块中出现 JSONDecodeError**

`[vLLM #17790 — awaiting upstream fix]`。不同解析器，不同问题：当模型在一个响应中发出多个工具调用块时，出现 `JSONDecodeError`——[vLLM #17790](https://github.com/vllm-project/vllm/issues/17790)。相关问题：`<tool_call>` 嵌套在 `<think>` 中会破坏 hermes 解析——[vLLM #42021](https://github.com/vllm-project/vllm/issues/42021)。这些问题不依赖 Gonka——等待上游修复。

**推理用户：**

- **在发送后续消息前，将客户端上的 `tool_call.id` 重写为规范格式 `functions.<name>:<global_idx>`** —— Moonshot 官方推荐，已在 `docs/chat-api/troubleshooting.md#reject-duplicate-tool-call-id` 中重复（计划中）。另一种选择是使用全新的 UUID。
- **不要根据 ID 去重** —— 两个相同 ID 的调用可能包含不同结果。丢失它们 = 丢失代理的工作。
- **对包含工具调用的响应提升 `max_tokens`**；大型 `arguments` 数据块会迅速达到上限。
- 通用代理错误“上游模型提供者拒绝”通常意味着网关端拒绝，而非模型问题。首先检查消息和 ID 是否重复，再怀疑模型（参见 Q4 中的代理差异）。

**对于代理：**

- 考虑在网关端按 ID 去重——两个相同 ID 的工具调用可能包含不同结果；更安全的做法是**将 ID 重写为规范格式** `functions.<name>:<global_idx>`（不要去重）。在客户 FAQ 中记录此模式，并链接至 `troubleshooting.md#reject-duplicate-tool-call-id`。**安全提示**：若未仔细验证，简单的按 ID 去重会成为攻击面。将名称规范化而非删除更安全。
- **用户体验**：传递具体的网关错误消息（`"messages[N].tool_calls[M].id is duplicated"`），而非通用包装器——这能减少代理客户端的故障修复时间。**安全提示**：平衡调试友好性与信息泄露风险——参见 Q4。

### 启用引导解码能否解决令牌上限问题？

**引导解码与令牌上限无关。** 该机制强制模型按照模式（JSON Schema、正则表达式）生成输出，但不会改变令牌数量。关于上限问题，请参见 Q3。

底层 vLLM 字段 `guided_json`、`guided_regex`、`guided_grammar`、`guided_choice` **会被网关以 HTTP 400 拒绝**（锚点 `#reject-guided-decoding` 在 `docs/chat-api/troubleshooting.md` 中（计划中））。原因在于：它们绕过了应用于 `response_format` / `structured_outputs` 封装的 xgrammar 边界，以缓解 CVE-2025-48944。

**结构化输出的正确字段**

`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 已不再用于主网（提案 78，纪元 308）。下表为 `response_format` 在 `moonshotai/Kimi-K2.6` 上运行时的行为——在发送 Kimi 请求前，请确认代理的 `GET /v1/models` 上的实时容量。

| 字段 | Kimi K2.6（当被提供时） | 备注 |
|------|-----------|---------|
| `response_format`（`type: "json_schema"` 或 `"json_object"`） | 可用 | OpenAI 标准。可靠选择。经公共代理实证验证。 |
| `structured_outputs` 封装（`json`/`regex`/`choice`/`grammar`/`structural_tag`/`json_object`） | HTTP 400（全网拒绝） | PR #1215（`StructuredOutputsValidator`）已合并至仓库，但**截至 2026-05-25 仍未在生产主网激活**。代理拒绝时提示：`"Chat completions parameter `structured_outputs` is currently rejected by the Gonka network"`——错误引用的是开发分支 `dl/devshards-gateway-to-main`，而非主分支。这是**全网发布延迟**，而非单个代理问题。目前唯一可靠的结构化输出选项是 `response_format`。 |
| 同时使用两者（`response_format` + `structured_outputs`） | HTTP 400 / 502（取决于代理） | 网关在 vLLM 之前拒绝此组合（锚点 `#reject-structured_outputs-with-response_format`）。在 vLLM 0.20.0 中，字段通过 `dataclasses.replace()` 合并，违反了 `StructuredOutputsParams.__post_init__` 中的“仅允许一个”规则。 |

**推理用户：**

- 需要在所有代理和模型间实现最大可移植性——使用 `response_format`（处处可用）。`structured_outputs` 封装目前被全网拒绝。
- 不要在单个请求中同时使用 `response_format` 和 `structured_outputs`——HTTP 400。

**对于代理：**

- 引导解码不会提升吞吐量。不要向客户承诺其可作为令牌上限的解决方案。
- 关注 PR #1215（`StructuredOutputsValidator`）在所有路由上的上线——需要正则表达式/选择/语法结构化输出的客户端正在等待 `structured_outputs` 封装。

### 为何生成速度波动如此剧烈？为何加速仅适用于推理令牌？

速度波动是一个真实且已知的开放问题，其根源在于三个不同层级。

**1. 每主机减速/停滞（主机层）**

一项开放的研究任务——[问题 #818 “慢节点调查”](https://github.com/gonka-ai/gonka/issues/818)（自 2026 年 2 月起开放，优先级：高）。存在特定模式但无根本原因（计划中的 `known-issues.md`，第 1 节“主机接收后无流返回”和第 2 节“主机生成块后停滞”——某些情况下一分钟后恢复，其他情况则永不恢复）。

**2. 路由差异（代理层）**

两次连续请求之间，代理可能被路由至负载不同的不同主机。端到端延迟随 `devshard-XXXX-YYY` 主机 ID 变化。在稳定主机上，每令牌生成速度基本保持不变。[¹]

[¹] 示例观察：在一次测试中（5 次请求，约 30 秒），端到端延迟变化导致 `tokens / total_latency` 的范围约为 8–54 tok/s，但该指标包含 TTFT，非公开的波动指标。

**3. 网络层验证窗口（链层）**

在 PoC / Confirmation-PoC 事件期间（cPoC——在纪元内确认验证者工作的阶段），部分节点会暂时不可用。在纪元边界，曾出现已知问题：快照保留节点导致网关返回 `attempts: []`（路由上无可用主机）——从客户端角度看表现为超时。该影响在代理提供的该模型节点越少时越明显；在提供者数量较少的模型上更为突出。

**“推理快于可见”——并非优先级，而是输出结构**

网关上没有专门用于推理标记的快速通道。在devshard代码中，`delta.reasoning`、`delta.content`、`delta.reasoning_content`、`delta.tool_calls`均通过`sseChunkHasContent`以相同方式检测。每个标记的速度相同。

启用思考功能的Kimi首先生成一个庞大的`reasoning_content`（数百至数千个标记），然后生成一个简短的可见答案（数十至数百个）。不显示推理字段的客户端会看到“沉默，然后突然爆发答案”。实际上模型一直在生成，只是结果被隐藏了。

**对于推理用户：**

- 选择一个发布正常运行时间/p50 TTFT指标的经纪人。可用的仪表板包括[gonka.pw](https://gonka.pw/)和[meter.gonka.gg](https://meter.gonka.gg/)（可能还有其他，此列表不完整）。
- 在处理缓慢的请求时，请记住负载大小：对于短负载，重试会落在不同的节点上；对于持续的大负载（>50k），落在窗口缩小的节点上是一个系统性问题（问题#818），仅重试可能无效——最好进行拆分。
- 想在模型思考时看到进度——在UI中渲染`delta.reasoning_content`（或`delta.reasoning`），例如在折叠区块中。

**对于经纪人：**

- 整个网络最高优先级的共享问题。请向[问题#818](https://github.com/gonka-ai/gonka/issues/818)贡献生产日志/追踪数据——这为核心团队提供了他们没有的数据。
- 帮助实现主机端改进（分块gossip恢复、每个托管`lastAfterReq`跟踪——已在计划的`host-improvements.md`及相关问题中追踪）——这些直接解决路由/恢复的薄弱环节。

### 为什么速度因硬件而异——在B200上更快，在H200上更慢？

**速度取决于硬件——这在异构网络中是正常的。** 链上的PoC权重反映节点的实际性能（影响验证者的奖励份额），而经纪人本地路由从托管中选择可用主机——两次连续请求可能落在不同代的GPU上。

**对于推理用户：** 速度取决于网络中的硬件分布。您无法直接选择硬件——您选择的是经纪人。需要可预测的延迟——请向经纪人询问他们默认路由到的硬件层级。

**对于经纪人：**

差异的确切来源（根据[`kaitakuai/experiments`](https://github.com/kaitakuai/experiments)的内部基准测试——未在gonka-api.org或gonkagate.com上测量）。以下Qwen3-235B数据为**历史数据**：该模型已在第308个纪元（提案78）从主网退役，目前不再提供服务。

| GPU | 内存 | sm | Qwen3-235B 每实例每分钟nonce数（历史） | 每GPU |
|-----|--------|-----|------------------------------|---------|
| 4×H100 SXM5 | 80 GB HBM3 | 90 | **1,248** @ batch=16 | ~312 |
| 4×H200 | 141 GB HBM3e | 90 | **1,408** @ batch=32–64 | ~352 |
| 2×B200 | 192 GB HBM3e | 100 | **1,984** @ batch=64 | **~992** |

- **H200 vs H100：** 每GPU +13%。同芯片（sm_90），但HBM3e + 141 GB对比HBM3 + 80 GB → 允许大模型使用更小的TP和更快的KV缓存。
- **B200/B300 vs H100/H200：** 在历史Qwen3-235B FP8基准上，每GPU约**3倍**。
- **Kimi-K2.6 INT4 — 具体数据：** 4×B200提供2,240 nonce/分钟 = **每GPU约560**（见`experiments/2026-05/kimi_k26_int4_4xb200_q-int4-k2`）。16×H100 TP提供1,389 nonce/分钟 = **每GPU约87**（见`experiments/2026-05/kimi-k26-int4-2x8xh100`）。每GPU的差异约为6倍；绝对数值上，每GPU的Kimi在相同硬件上比历史Qwen更慢（4×B200 Kimi INT4 ~560每GPU vs Qwen ~992每GPU）。
- **Kimi-K2.6 INT4 在Blackwell上：** `VLLM_USE_FLASHINFER_MOE_INT4=1`相比Marlin带来**+138%**提升（在`experiments/2026-05/kimi_k26_b300_eager_flashinfer`中进行A/B测试）。仅适用于Blackwell系列上的INT4 MoE工作负载（内核门控——`is_device_capability_family(100)`，覆盖B100/B200/B300；B300实际为sm_103a）。

**追踪与诊断：** 可观测性已在[PR #1046 "Implement dapi & devshard observability"](https://github.com/gonka-ai/gonka/pull/1046)中合并——增加了OpenTelemetry追踪、Prometheus指标和仪表板。如果Grafana没有每主机TTFT面板——请检查DAPI/devshard是否已更新，且仪表板已包含在构建中。

其他来源：仓库[`kaitakuai/experiments`](https://github.com/kaitakuai/experiments)（定期更新）、您从[gonka.pw](https://gonka.pw/)获取的每主机统计信息，以及来自[meter.gonka.gg](https://meter.gonka.gg/)的网络状态。希望影响硬件分布——将devshard托管扩展至具有首选GPU的主机。

### 为什么模型在Kilo Code中无法正确使用工具？

最可能有四个原因——网关应用了严格的参数白名单和对JSON Schema的严格限制。这不是Kilo特有的：同样的原因也会触发任何编码代理（Cline、Continue.dev、OpenCode等）。

**1. 硬性拒绝（HTTP 400）——需在客户端修复**

| 触发 | 原因 | 修复 |
|---------|---------|-----|
| 有效载荷中的 `tags` 字段 | 不属于 OpenAI Chat Completions 标准；民间 Hermes 约定；锚点 `#reject-tags` | 使用 `metadata` (OpenAI 标准) 或 `user` 进行跟踪 |
| `tools[].function.parameters` 中的 Schema 深度 > 16 | CVE 驱动的上限 | 扁平化 Schema；PR #1187 将其从 5 提高到 16 |
| Schema 节点总数 > 256 | CVE 驱动的上限 | 减少它；PR #1195 将其从 128 提高到 256。具有大型输入 Schema 的 MCP 工具可能接近此限制；请在您的网关上测试。如果您确实需要一个节点数超过 256 的 MCP 工具——请提交功能请求。 |

**2. 静默强制转换/剥离——请求不会失败，但行为发生变化**

| 触发 | 网关的行为 | 备注 |
|---------|---------------------|---------|
| `tool_choice: "required"` | 静默 → `"auto"`（网络策略） | 锚点 `#coerce-tool-choice-required`。在大多数情况下，模型会对明显与工具相关的提示发起工具调用，但没有“必需”的保证 |
| `tools[].function.strict: true` | 静默删除该字段 | vLLM 解析器（`hermes`，`kimi_k2`）忽略该标志。PR #1193 |

已知客户端的兼容性矩阵：[`docs/chat-api/agents.md`](https://github.com/gonka-ai/gonka/blob/main/docs/chat-api/agents.md)（计划中）。一个基本可用的工具调用示例：[开发者快速入门 §1.4](https://gonka.ai/developer/quickstart/#4-tool-calling)。

**对于推理用户：**

- **使用 Kilo Code 生成的相同 curl 命令进行复现**（通过客户端调试日志或中间代理）。在 400 响应体中，网关通常会说明被拒绝字段的名称；代理可能会将消息掩盖为通用的“上游拒绝”——但具体的问题字段通常只有一个。
- **与 `agents.md` 和 `troubleshooting.md` 中的列表交叉核对**（计划中）——大多数 400 错误都属于已记录的拒绝锚点（`#reject-tags`，`#reject-enforced_tokens`，`#reject-structured_outputs-kimi`）。
- **如果错误信息不明确，请快速检查：** 检查字段 `tags`，`enforced_tokens`，`plugins`，`strict`，`guided_*`；逐个移除并重新发送请求。若无帮助——检查 Schema 深度（≤ 16）和节点数（≤ 256）。
- **被拒绝的字段未被记录**——在 [gonka-ai/gonka](https://github.com/gonka-ai/gonka) 上提交问题，并附上捕获的请求。

**对于代理：**

- 仪表板上无 `agents.md` 链接——这是一个低成本的快速优化点。
- 有能力就 `gonka-ai/gonka` 中的非标准字段提交问题——这将帮助生态中的每个代理。

### 像 Hermes 和 OpenClaw 这样的代理为何在 Kimi 上无法完成工具任务？

**三个因素的组合**

原始 FAQ 曾提及第四个因素——特殊标记清理器——但该因素涉及安全/提示注入，而非工具调用失败；PR 修复被推迟，因为 Kimi 正确处理了特殊标记（经实证）。

1. **网关默认将 `max_tokens` 的一半分配给思考过程**（参见 Q1/Q2）。在默认 `thinking_token_budget = max_tokens / 2` 下，它在模型开始发出工具调用前就已耗尽 `<think>`。对于工具密集型代理流程，预算在产生有用输出前就已耗尽。缓解方案——显式设置 `thinking_token_budget: 0`（Q2）。这是网关策略，而非模型限制。
2. **输出上限 3,072（有效）/ 4,096（网络上限）对于工具密集型输出过于紧张**（Q3）。大型 `arguments` 数据块 + 可见内容很容易达到上限。
3. **上游 vLLM 工具解析器的 Bug**（Q5）：重复的 `tool_calls[].id` 与 `n>1` 冲突（[vLLM PR #21259 — 未验证](https://github.com/vllm-project/vllm/pull/21259)）以及 Hermes 解析器在多个工具块上的 `JSONDecodeError`（[vLLM #17790](https://github.com/vllm-project/vllm/issues/17790)）。

构建者痛点及链接：[issue #1229](https://github.com/gonka-ai/gonka/issues/1229)——长推理链、工具调用兼容性、超出输出限制后的延续被列为代理编码工作流的阻塞问题。

**对于推理用户：**

- **对于 Kimi，这是强制性的：** `"thinking": {"type": "disabled"}` + `"max_tokens": 4096`（或显式设置 `thinking_token_budget: 0`，参见 Q2 的双重保障）。这将为工具密集型输出释放全部上限。实证：Kimi 轻松在约 4 秒内一次响应中发出 5 个并行工具调用。
- **在客户端控制 tool_call.id**——将其重写为规范格式 `functions.<name>:<global_idx>`（Q5），以避免网关因重复 ID 而拒绝。
- **控制 Schema**——保持深度 ≤ 16 且节点 ≤ 256（Q9）。具有大型输入 Schema 的 MCP 工具可能无法通过。

**对于经纪人：**

- 将上限提升（Q3 — 按模型 `request_max_tokens_cap` 通过 `/v1/admin/settings`）与上述建议结合 —— 这涵盖了您网关上主要的代理故障类别。

### OpenCode 无法应用请求的代码更改（中途截断句子）。这是什么原因造成的？

三种原因；客户端可以绕过其中两种，但无法绕过第三种。

1. **`max_tokens` 在大差异时被截断。** 大型代码补丁无法适应 Q3 的有效上限 3,072。解决方法：将差异拆分为多个工具调用 —— 模型在每次调用中更容易适应预算。
2. **vLLM 在边缘参数上崩溃** —— 一系列 8 个合并的 PR（#1170、#1171、#1172、#1174、#1180、#1212、#1215、#1216）增强了对导致引擎崩溃字段的防护。在较新的网关（≥ `devshard 0.2.13`）上，大多数已知的崩溃场景被 400 个验证器拦截，而非崩溃。
3. **主机在接收后丢弃流**（开放 —— 如计划的 `known-issues.md` §1 中所述）—— 主机接受了请求但未返回数据块。这是网络层面的问题，客户端无其他解决方法，只能重试。

**对于推理用户：**

- **对于 Kimi：** `"thinking": {"type": "disabled"}` + `"max_tokens": 4096`。大型差异 —— 拆分为多个工具调用。
- **长期：** 经纪人上限为 Q3，工具调用规范 ID 格式为 Q5。

**对于经纪人：** 在面向编码代理客户的客户常见问题解答中记录“拆分大差异”模式。

### 是否存在一个模型能同时处理输入和输出而无权衡？

**MiniMax-M2.7** 于 2026-05-28 左右通过链治理升级 v0.2.13 上线主网。已在两个经纪人上验证为活跃。说明：问题中“Qwen 输出上限为 8,192”不准确 —— 所有模型的输出上限相同（Q3 为 3,072 / 4,096），而非模型侧。`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 本身**未上线主网**（在第 308 个周期被提案 78 移除）。`moonshotai/Kimi-K2.6` 仍存在于治理目录中，但在 [提案 101](./network-updates.md#proposal-101) 后不再是 PoC 模型，目前未提供服务 —— 请检查经纪人的 `GET /v1/models`。`zai-org/GLM-5.3-Flash` 是提案 101 的 PoC 模型（`penalty_start_epoch` 394）。

| 模型 | 原生上下文 | 主网 | 原生思考 | 工具调用 |
|--------|---------------|---------|-----------------|------------|
| MiniMax-M2.7 | ~180K | 180K | 是（`<think>` 在内容中） | `chatcmpl-tool-<hash>` |
| DeepSeek-V4-Flash-0731 | — | 400K | 是（`deepseek_v4` 解析器） | `deepseek_v4` 解析器 |
| GLM-5.3-Flash | — | 400K | 是（`glm45` 解析器） | `glm47` 解析器 |
| Kimi-K2.6 | 256K | 240K | 是（chat_template_kwargs） | `functions.<name>:<idx>` |

**MiniMax 部署规范（`inference-chain/app/upgrades/v0_2_13/upgrades.go:minimaxGovernanceModel()`）：**

```text
ModelArgs: ["--enable-auto-tool-choice", "--kv-cache-dtype", "fp8",
            "--tool-call-parser", "minimax_m2",
            "--reasoning-parser", "minimax_m2_append_think"]
VRam: 320 GB         ThroughputPerNonce: 5000 (Kimi 1500 — MiniMax ×3.3 higher)
minimaxStartEpoch: 271
HfCommit: d494266a4affc0d2995ba1fa35c8481cbd84294b
```

**MiniMax 与 Kimi 的主要区别：**

- **`<think>` 块在 `delta.content` 中**（不在类似 Kimi 的 `reasoning_content` 中）—— `minimax_m2_append_think` 解析器的行为。如果您不需要这些标签出现在最终文本中，请在客户端解析这些标签。
- **工具调用 ID `chatcmpl-tool-<hash>`** —— 已经根据形状唯一，因此有关规范 ID 重写的 Q5 建议不适用。

相关工件：PR #1163 权重缩放（2026-05-13 合并，使经济模型与 Kimi 对齐）；PR [#1226](https://github.com/gonka-ai/gonka/pull/1226)（开放，未合并）—— 在已部署模型之上进行的网关端重构，非阻塞项。

**对于推理用户：** MiniMax-M2.7 ID 在 gonka-api.org 上为 `MiniMaxAI/MiniMax-M2.7`，在 gonkagate.com 上为 `minimaxai/minimax-m2.7`——参见大小写敏感性 Q1。请在代理实际在 `GET /v1/models` 上列出的模型中进行选择。请勿发送 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。

**对于代理：** 部署是通过网络通过 v0.2.13 升级完成的。未提供 MiniMax——请检查 mlnode-image 是否支持上述部署参数且主机已更新。PR #1226（开放）将改进用户体验（按模型分发、工具消息形状），但不构成阻塞。

### 为什么没有可用的网页搜索功能？

**按设计——Gonka 是一个推理网络**，而非代理框架。插件/网页执行是客户端代理层或提供增值服务的代理的责任，而非推理路径的一部分。

**具体而言：** 2026-05-25 我们通过两个代理测试了相同的 `plugins` 负载。`gonka-api.org` 会静默删除该字段（HTTP 200，锚点 `#strip-plugins` 在 `docs/chat-api/troubleshooting.md` 中（计划中））；`gonkagate.com` 以 HTTP 400 `"Plugin config is invalid"` 拒绝它。两者都是网关协议的有效解释：一种偏向宽松解析（静默删除），另一种是严格验证（拒绝未知字段）。在这两种情况下 `plugins` **均未执行**：vLLM 没有插件执行路径，若静默传递此字段则暗示了不存在的后端能力。在代理间迁移时，请考虑这种差异（详情见 `comparison-brokers.md`（计划中））。

**对于推理用户：** 在您自己的代理层（LangChain、LlamaIndex、您自己的封装）中运行搜索，将结果注入 `messages[].content` 后再调用 `/v1/chat/completions`。这是所有 OpenAI 兼容端点的标准模式。

**对于代理：** 这是一个差异化机会——代理层增值服务（“我们执行搜索并将结果注入消息”）是合法的产品。请在 Gonka 之上完全实现，无需更改协议。**安全提示：** 删除 `plugins` 可能反映的是抗滥用策略（而非用户体验失败）——如果您打算将插件执行作为产品提供，请仔细考虑。若将其作为标准提供——请在 [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/discussions) 上发起生态系统讨论。

### 何时会支持可靠的网页抓取？

**按设计，这不在 Gonka 的路线图上。** 正确的位置是边车或代理层的增值服务。

**对于推理用户：** 构建或购买一个抓取服务（Tavily、Exa、Perplexity API 用于搜索；trafilatura/Readability 用于解析），标准化为文本，通过 OpenAI 兼容调用发送。已有大量现成解决方案。

**对于代理：** 若希望将其作为分级服务提供——请在 [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/discussions) 上发起生态系统讨论，以便社区就通用规范达成一致（例如，每个人一致部署的边车）。

### Context7 文档研究——摘要失败。这是输出令牌限制吗？

与“Kimi 的输入令牌上限为 4k，输出上限为 8,192 令牌。这些限制何时会提升？”相同的问题。输出上限（有效值 3,072 / 网络上限 4,096）对于“工具结果正文 + 摘要一次性响应”来说过于紧张。思维已启用——其中一半会占用该空间（Q1/Q2）。

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

- 使用上述负载作为模板。`response_format` 将输出压缩至所需形状，节省预算。
- 如果文档较长并触及上限（`finish_reason=length`）——将其拆分为 N+1 次调用：一次获取+规划，其余为分段摘要；在客户端侧拼接。
- 不要将 `response_format` 与 `structured_outputs` 封装结合使用——HTTP 400（Q6）。
- 模式：深度 ≤ 16，节点 ≤ 256（Q9）。

**对于代理：** `response_format` 是最简单且最可移植的缓解方案，无论您的上限提升策略如何。一旦您的管理配置中支持按模型 `request_max_tokens_cap`，可考虑提供按客户上限提升选项。

### Gonka 没有 KV 缓存。何时会添加缓存？

**简短回答：无时间表。** 在 Gonka 网关端一切已就绪——阻塞点在上游 vLLM 侧，问题 [#33264](https://github.com/vllm-project/vllm/issues/33264) 已开放 4 个多月，尚未合并 PR。在该问题关闭前，请求中的 `prompt_cache_key` 字段将**被静默忽略**——请勿包含它，以免依赖不存在的行为。

vLLM 前缀 KV 缓存工作在每个 ML 节点上。网关级 `prompt_cache_key` / `cache_key` 目前被静默删除——这是由未合并的上游 vLLM PR 阻塞的限制。

**当前现状**

- **网关行为：** `prompt_cache_key`（OpenAI 标准）和 `cache_key`（Moonshot Kimi 约定）均被静默删除——均未到达 vLLM。锚点：`docs/chat-api/troubleshooting.md#strip-prompt_cache_key` 和 `#strip-cache_key`（计划中）。
- **上游阻塞：** vLLM 使用 `cache_salt` 字段进行提示缓存隔离（RFC #16016，PR #17045）。将 `prompt_cache_key` → `cache_salt` 别名是自 2026 年 1 月起开放的 [vLLM #33264](https://github.com/vllm-project/vllm/issues/33264)，尚未合并 PR。
- **安全理由：** 未隔离直接转发 `cache_key` 是不安全的——已有[已发布的提示缓存时序侧信道攻击（arxiv 2502.07776 PROMPTPEEK）](https://arxiv.org/abs/2502.07776)。网关无法实现虚假的缓存隔离保证。
- **80–90% 的命中率并非 Gonka 的声明。** 它要么是对某人营销材料的误解，要么是与 OpenAI / Anthropic 原生缓存（保证单提供商内粘性路由）的混淆。

**重要架构警告**

即使 vLLM #33264 合并且网关添加了哈希 → `cache_salt` 桥接，缓存仍为**每个 vLLM 实例**。Gonka 的多主机路由意味着具有相同 `cache_key` 的两个请求可能落在具有不同前缀缓存的不同主机上。在没有粘性路由（目前不存在）的情况下，保证 OpenAI 风格的 ~80% 命中率在架构上是困难的。三个阻塞项（上游 vLLM PR、网关桥接、粘性路由）目前均未发布。

**对于推理用户：** 今天无需操作——`prompt_cache_key` 和 `cache_key` 均为无操作。请勿依赖这些字段进行成本优化。

**对于代理：** 在 vLLM #33264 合并前，无需进行网关端更改。希望加速进程——请在该上游问题中评论或贡献。合并后，Gonka 网关将添加一个桥接，同时启用这两个字段。

### Kimi 在 Gonka 网关上何时启用图像输入？

**目前不可用。** 时间表——v0.2.14 或更高版本发布（当前为 0.2.15），无固定日期。多模态负载（`messages[].content` 包含 `type: "image_url"` 或 `"video_url"`）目前在两个公共代理上均返回 **HTTP 400**。

**正在进行中，计划已撰写并分阶段。** 计划文档 `multimodal-inference-plan.md` 在 `gonka-ai/gonka` 中（约 466 行，6 个阶段——ML 节点、Host↔ML 节点、代理/DAPI、Devshard 协议等）。在发布前，通过下方的问题/PR 跟踪更容易。

**当前硬性阻塞**

1. **多模态专用特殊标记清理器。** Kimi-K2.6 聊天模板接受 `image_url` / `video_url` 内容部分，但网关当前仅验证文本。多模态负载（图像 URL、替代文本、元数据）提供了额外的注入面，必须进行验证。安全审查将其列为第二阶段阻塞项。**目前尚无针对此特定多模态威胁的公开 CVE；内部跟踪正在进行中。**

2. **独立的 VLM 验证审查。** 图像输入的验证方法需要独立确认。问题 [#1026](https://github.com/gonka-ai/gonka/issues/1026)（初步研究：Qwen2-VL-2B F1=100% 中间层）+ [#1198](https://github.com/gonka-ai/gonka/issues/1198)（重新验证，开放贡献）。

**目标：** v0.2.14+，但尚无明确时间表；受问题 #1198（独立验证，开放贡献）阻塞。

**目前经实证确认的内容：** 包含 `{type:"image_url"}` 的 `messages[0].content` 数组请求会返回 HTTP 400（已在 Kimi 上验证）。网关层面不接受多模态输入。

**对于推理用户：** 目前不可用。

**对于经纪人：** 加速此问题的三种方式：

1. 认领问题 [#1198](https://github.com/gonka-ai/gonka/issues/1198)（开放贡献）——独立的 VLM 验证审查是最关键的阻塞项。
2. 审查 PR [#1150 "vlm benchmark"](https://github.com/gonka-ai/gonka/pull/1150)。
3. 当计划的第 1-3 阶段变得可达成时——准备网关能力注册表（第 3 阶段）；操作员配置将决定您的经纪人接受哪些内容类型。
