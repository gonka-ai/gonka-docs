# 常见问题

## 概述

### Gonka 是什么？
Gonka 是一个去中心化的高效 AI 计算网络——由运行者共同维护。它作为集中式云服务的低成本、高效率替代方案，适用于 AI 模型训练与推理。作为一种协议，Gonka 并非公司或初创企业。

- 从区块链角度看，Gonka 是去中心化 AI 网络的基础账本和协调层（L1）。它记录余额、交易以及加密证明，用以验证“主机（Host）”是否正确执行了 AI 任务，而所有实际计算（如推理和训练）均在链下完成。
- 从网络角度看，Gonka 是一个完整的生态系统，参与者包括主机（Host）和开发者（Developer），通过去中心化基础设施进行交互。依托 Gonka 区块链，该网络可分发任务、验证结果，并仅对可验证的有用工作给予奖励，从而构建一个具有竞争力且可扩展的 AI 工作负载环境。

### Gonka 解决了什么问题？

Gonka 是一个去中心化 AI 基础设施，旨在减少对集中式云服务商的依赖，并比传统去中心化网络更高效地利用计算资源。其目标是将尽可能多的算力导向有用的 AI 任务（如推理和训练），同时最大限度减少因共识机制带来的资源浪费。

### Gonka 生态系统中的关键参与者有哪些？

Gonka 生态系统包含四类主要参与者：

- **开发者（Developer）**：利用网络的分布式计算能力构建和部署 AI 应用。
- **Gonka 贡献者（Contributor）**：参与核心区块链代码库的开发、协议升级、性能优化、安全补丁及新功能集成。
- **持有者（Holder）**：持有网络的原生代币，即拥有一个包含 GNK 代币的钱包。持有者可以持有、转账或出售代币，也可根据协议规则用于支付推理费用等用途。作为持有者并不意味着承担任何义务、责任或治理角色，仅限于标准的代币所有权。
- **主机（Host）**：向网络贡献计算能力。主机执行推理及其他计算任务，并根据其贡献的算力获得相应奖励，前提是保持诚实参与和可靠性。主机构成了网络的骨干。**只有主机拥有网络中的投票权**，该投票权代表其在治理中的权重，可用于提出和表决协议决策、参数变更和升级。任何主机在处理推理请求时，都动态承担验证者（Validator）、传输代理（Transfer Agent）和执行者（Executor）的功能（这些不是预定义或链上角色，而是运行时动态承担的操作职能）。

### 什么是 GNK 代币？
GNK 是 Gonka 网络的原生代币。它用于激励参与者、为资源定价，并确保网络的可持续发展。

### 我可以购买 GNK 代币吗？

目前无法在交易所购买 GNK，因为该代币尚未上线任何交易平台。  
请关注官方 [Twitter](https://x.com/gonka_ai) 获取关于上线的最新消息。

目前，在正式上线前合法获取 GNK 的主要方式是 [作为主机进行挖矿](https://gonka.ai/host/quickstart/)（通过向网络贡献计算资源即可获得 GNK）。

!!! note "重要提示"
	请注意，目前存在假冒的 GNK 上线页面和 listings，包括 CoinGecko 上的页面。这些页面不代表官方 GNK 代币，也与项目无任何关联。GNK 目前在任何交易所均不可交易。任何声称是 GNK 的代币，无论是在 Solana 还是其他网络上发行的，都不是官方的 GNK 资产。请始终通过官方渠道核实信息。

### 该协议为何高效？
Gonka 与“大型厂商”的区别在于其定价机制以及推理任务的平等分配——无论主机规模大小，推理任务都会被均匀分布。欲了解更多信息，请查阅 [白皮书](https://gonka.ai/whitepaper.pdf)。

### 网络如何运作？
网络的运行具有协作性，具体取决于您希望承担的角色：

- 作为 [开发者](https://gonka.ai/developer/quickstart/)：您可以使用网络的计算资源来构建和部署您的 AI 应用。
- 作为 [主机](https://gonka.ai/host/quickstart/)：您可以贡献自己的计算资源以支持网络运行。协议设计将奖励您的贡献，确保网络的持续性和自主性。

### 本文档是否详尽无遗？

否。本文件仅涵盖协议的主要概念、标准工作流程和最常见的操作场景，但并未完整描述代码库的全部行为或实现细节。代码中包含此处未说明的额外逻辑、交互和边界情况。

由于 Gonka 是一个开源且去中心化的网络，各种参数、机制以及由治理驱动的行为可能通过链上投票和社区决策不断演进。某些细节可能在发布后发生变化，且并非所有边界情况或未来更新都能及时反映在文档中。

对于主机、开发者和贡献者而言，代码本身才是最终的权威依据。如果文档与代码之间存在任何不一致，应以代码为准。

我们鼓励参与者查阅相关代码库、治理提案和网络更新，以确保其理解与协议当前状态保持一致。

### 贡献计算资源的激励机制是什么？
我们已专门编写了一份 [代币经济学文档](https://gonka.ai/tokenomics.pdf)，其中详细说明了激励机制的衡量方式。

### 硬件要求是什么？
您可以在文档中找到明确列出的最低和推荐 [硬件规格](https://gonka.ai/host/hardware-specifications/)。请查阅此部分内容，以确保您的硬件符合有效贡献的要求。

### 哪些钱包可用于存储 GNK 代币？
您可以在 Cosmos 生态系统中使用以下支持的钱包存储 GNK 代币：

- [Keplr](https://www.keplr.app/)
- [Cosmostation](https://cosmostation.io/products/application)
- `inferenced` CLI — Gonka 中用于本地账户管理和网络操作的命令行工具。

!!! note "Leap 钱包用户的注意事项"

	如果您之前使用 Leap 钱包创建了 Gonka 账户，请注意 [Leap 将于 2026 年 5 月 28 日关闭其所有产品](https://www.leapwallet.io/)，包括浏览器插件、移动应用和仪表板。
	
	由于 Leap 是非托管钱包，您的资产和账户仍保留在链上。但为了继续访问您的钱包，您应在 Leap 服务下线前，将其助记词导入其他支持的钱包（如 Keplr）。

### 我在哪里可以找到有关 Gonka 的有用信息？

以下是了解 Gonka 生态系统最重要的资源：

- [gonka.ai](https://gonka.ai/) — 项目信息和生态系统概览的主要入口。
- [白皮书](https://gonka.ai/whitepaper.pdf) — 技术文档，描述架构、共识模型、计算证明（Proof-of-Compute）等内容。
- [代币经济学](https://gonka.ai/tokenomics.pdf) — 项目代币经济概览，包括供应量、分配机制、激励措施和经济设计。
- [GitHub](https://github.com/gonka-ai/gonka/) — 访问项目源代码、代码库、开发活动和开源贡献。
- [Discord](https://discord.com/invite/RADwCT2U6R) — 社区讨论、公告和技术支持的主要平台。
- [X（Twitter）](https://x.com/gonka_ai) — 新闻、更新和公告发布渠道。

## 代币经济学

### Gonka 中的治理权力如何计算？
Gonka 采用基于 PoC 的加权投票模型：

- **计算证明（Proof-of-Compute, PoC）**：投票权与您经验证的计算贡献成正比。
- **抵押要求**：
 
 
  - PoC 所得投票权重的 20% 可自动激活。
 
 
  - 要解锁剩余的 80%，您必须锁定 GNK 代币作为抵押品。
- 此机制确保治理影响力反映真实的计算工作
 
+ 经济抵押。

在前 180 个纪元（约 6 个月）内，新参与者可通过 PoC 单独参与治理并获得投票权重，无需抵押要求。在此期间，完整的治理权利可用，但投票权重仍与经验证的计算活动挂钩。

### 为什么 Gonka 要求锁定 GNK 代币以获得治理权力？
投票权从不单纯由代币持有量决定。GNK 代币作为经济抵押物，而非影响力的来源。影响力需通过持续的计算贡献获得，而锁定 GNK 抵押物则是确保治理参与并强化问责制的必要条件。

## 抵押机制

### 什么是抵押？
在宽限期（前 180 个纪元）结束后，需通过抵押 GNK 代币来激活 PoC 权重中可抵押的部分。  
宽限期结束后：

- 基础权重（默认为 20%）始终处于激活状态。
- 剩余权重需抵押 GNK 代币才能激活。

抵押机制确保拥有治理权重的参与者也承担相应的经济责任。相关参数在链上定义，并可通过治理机制变更。在做出经济决策前，请务必核实当前参数值。

### 抵押是按节点还是按账户计算？
抵押按账户进行。如果多个机器学习节点关联到同一账户，则所需抵押金额将基于该账户下所有节点的总权重计算。

### 我是否需要存入抵押？
是的，如果您希望激活超过基础权重的部分。  
若未存入抵押，仅基础权重保持激活状态。

### 需要多少抵押？
计算公式：
```

Required Collateral =
Total Weight × (1
 - base_weight_ratio) × collateral_per_weight_unit
```

由于 PoC 权重在不同纪元之间可能会波动，精确存入最低金额可能导致暂时的抵押不足。  
权重较小的情况可能经历相对更大的波动幅度。建议在抵押水平仍相对较低时，保留高达计算最低值 2 倍的缓冲。
```

Recommended (with conservative buffer):
Total Weight × 2 × (1
 - base_weight_ratio) × collateral_per_weight_unit
```

### 我可以部分抵押我的权重吗？
可以。您的总活跃权重（Active Weight）由以下两部分组成：

- 基础权重（始终处于活跃状态）
- 可抵押权重（根据已存入的抵押品比例激活）

如果您存入的抵押品少于全额要求：

- 基础权重仍保持完全活跃
- 仅对应比例的可抵押权重被激活
- 剩余部分保持非活跃状态

活跃权重的计算方式如下：
```

Active Weight =
Base Weight
 +
(Deposited Collateral / Required Collateral) × Collateral-Eligible Weight
```

### 如果我没有存入足够的抵押品会发生什么？
你的活跃权重（Active Weight）会按比例减少。由于奖励是根据活跃权重按比例分配的，当你抵押不足时，其他节点将获得更大份额的奖励。未激活的权重不会被直接重新分配，它只是不参与共识。

### 抵押品何时生效？
抵押品必须在纪元开始前存入才有效。在当前纪元期间存入的抵押品：

- 不会立即增加权重
- 从下一个纪元开始生效

无法在纪元中途增加抵押品。

### 我应以什么单位存入抵押品？
交易必须使用 ngonka，而不是 GNK。
```

1 GNK = 1,000,000,000 ngonka
```

示例：
```

10 GNK = 10,000,000,000 ngonka
```

### 抵押品会被罚没吗？
是的。在以下情况下，抵押品可能会被罚没：

- 提供无效推理结果
- 节点停机（确认 PoC 失败或被监禁）

因无效推理导致的罚没，每个纪元最多发生一次。  
因停机导致的罚没，每次被监禁事件都可能触发一次。

### 被罚没的代币会怎样？
目前，被罚没的 GNK 会被永久销毁并从流通中移除。未来治理可能修改此机制。

### 我可以取回抵押品吗？
可以。取回操作将触发一个解除绑定期（默认为 1 个纪元）。在解除绑定期间，抵押品仍可能被罚没。解除绑定期结束后，资金将自动返回到您的账户余额中。

### 抵押品不是什么

- 抵押品 **不是** 投票权。投票权来源于 PoC 权重，而非代币余额。
- 抵押品 **不是** 委托。每个账户必须自行支撑其权重。
- 抵押品 **不是** 永久锁定。它可以被取回（需经过解除绑定期）。
- 在宽限期（前 180 个纪元）内，**不需要** 提供抵押品。

### 每个纪元新铸造的奖励如何分配？
每个纪元会固定铸造一定数量的 GNK，并按 **活跃 PoC 权重** 的比例进行分配。  
活跃权重决定：

- 您在当纪元奖励代币中的份额
- 您在治理中的影响力

如果由于抵押不足导致您的活跃权重降低，您获得的纪元奖励也将按比例减少。非活跃权重不参与奖励分配。

### 是否需要手动存入抵押品？
是的。必须通过提交链上交易来存入抵押品，不会自动激活。如果没有存入抵押品：

- 您的节点仍可正常运行
- 不会被监禁或禁用
- 仅基础权重（例如 20%）保持活跃

您的奖励和治理影响力将按比例降低。

### 已归属但锁定的 GNK 可以作为抵押品吗？
不可以。抵押品必须来自您可用的（未锁定）GNK 余额。尚未释放的已归属代币不能用作抵押品。

## 治理

### 哪些变更需要提交治理提案？
任何影响网络的链上变更都需要通过治理提案，例如：

- 更新模块参数（`MsgUpdateParams`）
- 执行软件升级
- 添加、更新或弃用推理模型
- 任何必须通过治理模块批准和执行的其他操作

### 谁可以创建治理提案？
任何拥有有效治理密钥（冷账户）的人都可以支付所需费用并创建治理提案。然而，每个提案仍需通过基于 PoC 权重的投票由活跃参与者批准。我们鼓励提案人先通过链下渠道（例如 [GitHub](https://github.com/gonka-ai) 或 [社区论坛](https://discord.com/invite/RADwCT2U6R)）讨论重大变更，以提高通过概率。详见[完整指南](https://gonka.ai/governance/transactions-and-governance/)。

### 如果提案失败会发生什么？
- 如果提案未达到法定投票率 → 自动失败  
- 如果多数投票为 `no` → 提案被拒绝，不进行链上变更  
- 如果有相当高比例的投票为 `no_with_veto`（超过否决阈值）→ 提案被拒绝并标记，表明社区存在强烈反对意见  
- 押金是否退还取决于链的设置

### 治理参数本身可以更改吗？
可以。所有关键治理规则——法定投票率、多数通过门槛和否决门槛——都是链上可配置的，可通过治理提案进行更新。这使得网络能够随着参与模式和计算经济的变化而演进决策机制。

### 如果我无法访问冷密钥，或希望由另一个密钥代为投票，该怎么办？

如果持有投票权的密钥不是您日常操作使用的密钥，可以提前授权治理投票权限。

在此设置中：

- **授权人（Granter）** = 拥有投票权的账户（冷密钥）  
- **被授权人（Grantee）** = 将代表授权人提交投票的账户（温密钥）

常见两种场景：

**
1. 您想投票，但无法访问持有投票权的密钥。**

请联络该密钥的所有者，请求其授权您的密钥代为投票。若无此授权，您的密钥无法为该投票权提交治理投票。

**
2. 您希望另一个密钥代您投票。**

请从持有投票权的密钥执行以下授权命令。这将允许被授权密钥代表您提交治理投票。  
此授权仅限于治理提案投票。被授权人仍可为自己账户投票。授权人可随时撤销此权限。

1) 授予投票权限（从授权人密钥执行）
=== "命令"

 
 
 
 
```
    ./inferenced tx authz grant <GRANTEE_GONKA_ADDRESS> generic \
      --msg-type=/cosmos.gov.v1beta1.MsgVote \
      --from=<GRANTER_KEY_NAME> \
      --chain-id=gonka-mainnet \
      --expiration=<UNIX_TIMESTAMP> \
      --home .inference \
      --keyring-backend file
 
 
 
 
```
    
=== "示例响应"

 
 
 
 
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
=== "命令"
 
 
 
 
```
    ./inferenced query authz grants <GRANTER_GONKA_ADDRESS> <GRANTEE_GONKA_ADDRESS> \
      --node="http://<MAINNET_NODE_URL>:26657" \
      --output=json | jq .
 
 
 
 
```
    
=== "示例响应"

 
 
 
 
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
    
3) 使用受赠者进行投票
=== "命令"
 
 
 
 
```
 
   # Find the proposal ID which you are voting for
 - use it as <VOTE_PROPOSAL_ID> in the voting body 
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
    
=== "示例响应"

 
 
 
 
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

4) 撤销委托（使用授权方密钥执行）
=== "命令"

 
 
 
 
```
    ./inferenced tx authz revoke <GRANTEE_GONKA_ADDRESS> /cosmos.gov.v1beta1.MsgVote \
      --from=<GRANTER_KEY_NAME> \
      --chain-id=gonka-mainnet \
      --home .inference \
      --keyring-backend file
 
 
 
 
```

=== "示例响应"

 
 
 
 
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
**治理提案** → 链上提案。用于直接影响网络、需要链上投票的变更。示例包括：

- 更新网络参数（`MsgUpdateParams`）
- 执行软件升级
- 添加新模型或功能
- 任何需要由治理模块执行的修改

**改进提案** → 由活跃参与者控制的链下提案。用于规划长期发展路线、讨论新想法以及协调重大的战略性变更。

- 以 Markdown 文件形式存放在 [/proposals](https://github.com/gonka-ai/gonka/tree/main/proposals) 目录中
- 通过 GitHub Pull Request 进行评审和讨论
- 获得批准的提案将被合并到代码仓库中

### 改进提案如何评审和批准？
社区提案评审的目标是收集社区的认可：包括点赞、评论和具体反馈，以增强该提案最终获得治理通过的可能性。这一点尤其重要，当提案的实施需要大量工作、长期投入、多方协调或对协议做出重大变更时。

- 请先阅读推荐指南：[https://github.com/gonka-ai/gonka/discussions/795](https://github.com/gonka-ai/gonka/discussions/795)。该指南解释了哪些内容适合提交为改进提案，以及如何撰写结构清晰、有说服力的提案。
- 在 [GitHub Discussions](https://github.com/gonka-ai/gonka/discussions) 中发布并讨论改进提案（首选方式）；此前这些提案以 Markdown 文件形式存放在 `/proposals` 目录中。
- 为了帮助社区评估你的提案（并提高其未来在治理中通过的几率），提案人有责任主动收集早期反馈和支持信号（如点赞、评论、具体意见）：
	
	
- 将 Discussion 链接分享至 Discord 的 #improvements-proposals 频道，以扩大传播和可见性，并通过你可使用的其他渠道（包括直接联系 Host/矿工）进一步推广，以获取实际反馈和支持。
	
	
- 在提案讨论帖中说明你的背景和专业经验。如果你代表某个团队或公司，请明确指出并附上相关工作链接，以便社区评估可信度，更高效地评审提案。
- 社区评审流程：
	
	
- 核心贡献者和维护者将在 [GitHub Discussions](https://github.com/gonka-ai/gonka/discussions) 中讨论提案。虽然讨论可以在任何平台进行，但请将关键信息汇总回 [GitHub Discussions](https://github.com/gonka-ai/gonka/discussions)：这有助于保留完整的历史记录，便于搜索，并利于长期维护。GitHub 是唯一权威的信息来源。
	
	
- 请积极提问、提供反馈、建议优化方案，并为你支持的提案点赞。每个人的注意力和参与对链的可持续演进至关重要。
- 强烈的正向反馈和高点赞数表明了真实的社区需求，使团队可以将广受好评的提案纳入社区驱动的发展路线图，并有信心启动实施，同时预期未来能获得治理批准。需要注意的是，来自 Host 的反馈尤为关键——它有助于将项目拆分为阶段性目标，解锁部分赏金支付，甚至争取社区资金池的资助。然而，所有链上更新和资金支付最终仍需经过治理投票批准。

### 改进提案能否转化为治理提案？
可以。通常，改进提案用于在正式起草治理提案前探索想法并达成共识。例如：

- 你可能首先以改进提案的形式提出集成某个新模型。
- 在社区达成一致后，再创建一个链上治理提案，用于更新参数或触发软件升级。

## 投票

### 投票流程是如何运作的？
- 提案提交并附带最低保证金后，即进入投票阶段
- 投票选项：`yes`, `no`, `no_with_veto`, `abstain`
  
 
 
   - `yes` → 赞成提案
 
 
   - `no` → 反对提案
 
 
   - `no_with_veto` → 反对并表示强烈反对
 
 
   - `abstain` → 弃权，不表示赞成或反对，但仍计入投票率（quorum）
   
- 在投票期间，你可以随时更改投票选择；仅最后一次投票结果会被计入
- 若达到法定投票率（quorum）和通过门槛，提案将通过，并由治理模块自动执行

要进行投票，可使用以下命令。此例为投赞成票，但你可以将其替换为你选择的选项（`yes`, `no`, `no_with_veto`, `abstain`）：
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
你可以随时使用命令行界面（CLI）查询提案状态：
```

export NODE_URL=http://47.236.19.22:18000
./inferenced query gov tally 2 -o json --node $NODE_URL/chain-rpc/
```

## 运行一个节点

### 如果我想停止挖矿但以后还想使用我的账户怎么办？
将来若要恢复网络节点，只需备份以下内容：

- 冷钱包密钥（最重要，其余内容均可轮换）
- tmkms 中的密钥文件：`.tmkms/secrets/`
- `.inference .inference/keyring-file/` 中的密钥环（keyring）
- `.inference/config .inference/config/node_key.json` 中的节点密钥（node key）
- 温钱包密钥的密码：`KEYRING_PASSWORD`

### 我的节点被监禁了，这意味着什么？
当你的验证者在最近100个区块中签名的区块少于50个时（该要求统计的是此时间窗口内的总签名数，而非连续签名数），你的验证者将被暂时监禁。这意味着你的节点将被临时排除在出块流程之外约15分钟，以保护网络稳定性。

可能的原因包括：

- **共识密钥不匹配**：你的节点使用的共识密钥可能与链上注册的验证者共识密钥不一致。请确保你使用的共识密钥与链上注册的密钥一致。
- **网络连接不稳定**：网络延迟或中断可能导致节点无法参与共识，从而导致签名遗漏。请确保你的节点拥有稳定且低延迟的网络连接，并且没有被其他进程过度占用资源。

**奖励说明**：即使节点被监禁，只要你作为主机仍持续参与推理或其他验证者相关工作，你仍将获得大部分奖励。除非检测到推理相关问题，否则奖励不会丢失。

**如何解除监禁**：在问题解决后，使用你的冷钱包密钥提交“解除监禁”交易，即可恢复节点的正常运行：

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

然后，检查节点是否已解除锁定：
```
 ./inferenced query staking delegator-validators \
    <cold_key_addr> \
    --node $NODE_URL/chain-rpc/
```

当节点被封禁时，会显示 `jailed: true`。

### 如何停用旧集群？

请按照以下指南安全地关闭旧集群，且不影响声誉。

1) 使用以下命令逐一禁用每个 ML 节点：
    
```

curl -X POST http://localhost:9200/admin/v1/nodes/<id>/disable
```

你可以通过以下命令列出所有节点 ID：

```

curl http://localhost:9200/admin/v1/nodes | jq '.[].node.id'
```

2) 在下一次计算证明（PoC）期间未被安排执行推理任务的节点将自动在该次 PoC 期间停止。  
被安排执行推理任务的节点将在继续运行一个 epoch 后停止。您可以在以下位置通过 mlnode 字段查看节点状态：

```

curl http://<inference_url>/v1/epochs/current/participants
```

当一个节点被标记为禁用后，即可安全地关闭该MLNode服务器。

3) 在所有MLNode均被禁用并断电后，您可以关闭网络节点。在此之前，建议（但非强制）备份以下文件：

- `.dapi/api-config.yaml`
- `.dapi/gonka.db` （链上升级后生成）
- `.inference/config/`
- `.inference/keyring-file/`
- `.tmkms/`

如果您跳过备份步骤，仍可使用您的账户密钥在之后恢复配置。

### 我的节点无法连接到 `config.env` 中指定的默认种子节点

如果您的节点无法连接到默认种子节点，只需通过更新 `config.env` 中的三个变量，将其指向另一个种子节点即可。

1. `SEED_API_URL`
 
- 种子节点的HTTP端点（用于API通信）。  
   从以下列表中任选一个URL，并直接赋值给 `SEED_API_URL`。
 
 
 
 
```
    export SEED_API_URL=<chosen_http_url>
 
 
 
 
```
    可用的 genesis API 地址：
 
 
 
 
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

2. `SEED_NODE_RPC_URL`
 
- 公共 Tendermint RPC 访问必须通过种子节点的 HTTP(S) 代理路径 `/<chain-rpc>`。  
使用与 `SEED_API_URL` 中相同的协议（http 或 https）、主机和端口，并附加 `/chain-rpc`。
 
 
 
 
```
    export SEED_NODE_RPC_URL=http://<host>/chain-rpc
 
 
 
 
```
    示例
 
 
 
 
```
    SEED_NODE_RPC_URL=http://node2.gonka.ai:8000/chain-rpc/ 
 
 
 
 
```

!!! note "重要"

	
- 请勿将 `http://<host>:26657` 用作公共 RPC 端点。
	
- 端口 `26657` 必须仅限内部使用（本地回环/私有网络）。公共 RPC 请求必须通过 `/<chain-rpc>` 进行。
	
3. `SEED_NODE_P2P_URL`
 
- 节点间网络通信使用的 P2P 地址。  
您必须通过相同的 `/<chain-rpc>` 代理，从种子节点的状态端点获取 P2P 端口。

    查询节点：
 
 
 
 
```
    http://<host>:<http_port>/chain-rpc/status
 
 
 
 
```
    示例
 
 
 
 
```
    https://node3.gonka.ai/chain-rpc/status
 
 
 
 
```
    Find `listen_addr` in the response, for example:
 
 
 
 
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

根据节点是否已完成初始化，有两种不同的方式来更新种子节点。

=== "选项
 
1. 手动编辑种子节点（初始化后）"

    一旦文件 `.node_initialized` 被创建，系统将不再自动更新种子节点。  
    此后：
    
 
 
  - 种子节点列表将按原样使用
 
 
  - 任何更改都必须手动进行
 
 
  - 你可以添加任意数量的种子节点
    
    格式为单个以逗号分隔的字符串：
 
 
 
 
```
    seeds = "<node1_id>@<node1_ip>:<node1_p2p_port>,<node2_id>@<node2_ip>:<node2_p2p_port>"
 
 
 
 
```
    要从任何正在运行的节点查看已知的对等节点，请使用链的 RPC：
 
 
 
 
```
    curl http://47.236.26.199:8000/chain-rpc/net_info | jq
 
 
 
 
```

    作为回应，请查找：
    
 
 
  - `listen_addr`
 
- P2P 端点
 
 
  - `rpc_addr`
 
- RPC 端点
   
    示例： 

 
 
 
 
```
         % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                     Dload  Upload   Total   Spent    Left  Speed
    100 94098    0 94098    0     0  91935      0 --:--:-
-  0:00:01 --:--:-
- 91982
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

    这将显示节点当前看到的所有对等节点。

=== "选项
 
2. 重新初始化节点（从环境中自动应用种子节点）"

    如果希望节点重新生成其配置并自动应用在 `config.env` 中定义的种子节点，请使用此方法。
 
 
 
 
```
    source config.env
    docker compose down node
    sudo rm -rf .inference/data/ .inference/.node_initialized
    sudo mkdir -p .inference/data/
 
 
 
 
```
    节点重启后，其行为将类似于全新安装，并会重新创建其配置，包括从环境变量中获取的种子节点信息。  
要验证实际应用了哪些种子节点：
    
 
 
 
 
```
    sudo cat .inference/config/config.toml
 
 
 
 
```
    查找字段：
 
 
 
 
```
    seeds = [...]
 
 
 
 
```

### 硬件、节点权重和 ML 节点配置是如何实际验证的？

链**不会**验证真实的硬件。它仅验证参与者的总权重，而这个值是用于权重分配和奖励计算的唯一依据。

任何关于该权重在多个 ML 节点之间的拆分，以及任何“硬件类型”或其他描述性字段，都**仅用于信息展示**，Host 可以自由修改这些内容。

在创建或更新节点时（例如，通过 `POST http://localhost:9200/admin/v1/nodes`，参见处理代码 [https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/server/admin/node_handlers.go#L62](https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/server/admin/node_handlers.go#L62)），可以显式指定硬件字段。如果未提供该字段，API 服务将尝试从 ML 节点自动检测硬件信息。

在实践中，许多 Host 会在一个代理 ML 节点后运行多个服务器；此时自动检测只能看到其中一个服务器，但这种配置是完全有效的。无论具体如何配置，所有权重分配和奖励都**仅依赖于 Host 的总权重**，ML 节点内部的权重划分或报告的硬件类型**不会影响链上验证**。

---

### 如何切换到 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、升级 ML 节点并移除其他模型？

本指南说明 Host 应如何根据 v0.2.8 版本中模型可用性的变化以及即将推出的 PoC v2 更新，来调整其 ML 节点配置。对 PoC v2 配置合规性的检查将从 **Epoch 155** 开始。建议 Host 在此之前审查并准备好 ML 节点配置。向 PoC v2 的迁移可在 Epoch 155 之后进行。迁移阶段结束后，不符合配置要求的 ML 节点的权重可能不再被计入。

#### 1. 背景：模型可用性变更（v0.2.8 升级）

作为 v0.2.8 升级的一部分，当前支持的模型集合已更新。

**支持的模型（当前激活集合）**

以下模型仍被支持：

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `Qwen/Qwen3-32B-FP8`

`Qwen/Qwen3-32B-FP8` 在迁移期间仍被支持，但**不参与 PoC v2 的准备状态评估，也不计入权重分配**。参与 PoC v2 的前提是必须提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。

**已移除的模型**

所有此前支持的其他模型均已从激活集合中移除，不得再提供服务。

---

#### 2. PoC v2 准备就绪标准（重要）

成功参与 PoC v2 过渡需同时满足以下两个条件：

- 所有你的 ML 节点必须提供 **`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`** 模型服务。这是**唯一**能为 PoC v2 贡献权重的模型。
- 所有你的 ML 节点必须升级至支持 PoC v2 的镜像版本：
 
 
  - `ghcr.io/product-science/mlnode:3.0.12-post3`
 
 
  - `ghcr.io/product-science/mlnode:3.0.12-post3-blackwell`

!!! note "重要提示"
	
- 仅提供正确的模型但未升级 ML 节点**是不够的**。
	
- 不满足上述两个条件的节点，在网络切换至单模型配置后将**不具备资格**。
	
- ML 节点的升级必须在迁移完成前完成，而 PoC v2 将在 v0.2.8 升级后，通过一个独立的治理提案来激活。
	
- **v0.2.8 升级本身不会启用 PoC v2**。

---

#### 3. 检查 ML 节点分配状态（推荐的安全步骤）

在更改模型之前，建议先检查当前 ML 节点的分配状态。请查询你的 Network Node 的管理 API：
```

curl http://127.0.0.1:9200/admin/v1/nodes
```

查找字段：
```

"timeslot_allocation": [
  true,
  false
]
```

解释：

- 第一个布尔值：表示节点在当前纪元是否正在提供推理服务  
- 第二个布尔值：表示节点是否计划在下一轮 PoC 中提供推理服务  

**推荐行为**

- 优先仅在第二个值为 `false` 的节点上更改模型  
- 这样做可以降低风险，尤其是在仍在观察 PoC v2 行为期间  
- 建议跨多个纪元逐步 rollout  

**
4. 更新 ML 节点的模型：仅保留受支持的模型**

预下载模型权重（推荐）。为避免启动延迟，请提前将权重下载到 `HF_HOME`：
```

mkdir -p $HF_HOME
huggingface-cli download Qwen/Qwen3-235B-A22B-Instruct-2507-FP8
```

使用 ML 节点管理 API 将 ML 节点切换到受支持的模型（`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`）。

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

通过管理 API 应用的更改将在下一个训练周期（epoch）生效，替换模型（[https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)）

!!! note
	`node-config.json` 仅在首次启动网络节点 API 或本地状态/数据库被清除时使用。如需全新重启，请修改此参数。对于已存在的节点，模型更新应通过管理 API 进行。

	**
5. 升级 ML 节点镜像（PoC v2 所需）**

编辑 `docker-compose.mlnode.yml` 并更新 ML 节点镜像：

标准 GPU
```

image: ghcr.io/product-science/mlnode:3.0.12-post3
```

NVIDIA Blackwell GPU
```

image: ghcr.io/product-science/mlnode:3.0.12-post3-blackwell
```

应用更改并重启服务。来自 `gonka/deploy/join`：
```

source config.env
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml pull
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d
```

**
6. 验证模型服务（在下一个epoch生效）**

确认ML节点仅提供服务 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`，这是用于PoC v2权重及未来权重分配的唯一模型：
```

curl http://127.0.0.1:8080/v1/models | jq
```

可选地重新检查节点分配：
```

curl http://127.0.0.1:9200/admin/v1/nodes
```

!!! note "治理与 PoC v2 激活说明"

	PoC v2 将分阶段引入，不会一次性全部激活。

	**阶段 1：观察阶段（v0.2.8 升级后的当前状态）**

	在 v0.2.8 升级后，PoC v2 的逻辑已具备，但尚未用于权重分配。

	在此阶段：

	
- 节点（Host）可以提供服务 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 或 `Qwen/Qwen3-32B-FP8`
	
- 节点必须将其 ML 节点切换为提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 服务，并升级至支持 PoC v2 的版本，才能参与 PoC v2 的权重计算
	
- 网络将观察采用情况，以评估节点对切换至 PoC v2 权重的准备程度

**阶段 2：治理提案（可选，未来阶段）**  
当活跃节点中达到足够的采用率（约 50%）时：

	
- 可提交一项独立的治理提案
	
- 该提案可请求批准激活 PoC v2，并将其用于权重分配

该采用阈值仅为观察参考，不会触发任何自动变更。

**阶段 3：激活（仅在治理批准后）**

PoC v2 只有在链上治理提案获得批准后，才会成为权重分配的正式方法。

在该提案获批之前：

	
- PoC v2 在权重分配中仍处于非激活状态
	
- 现有的 PoC 机制将继续用于确定权重

**摘要检查清单**

在 PoC v2 激活前，请确保：

- ML 节点提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 服务
- 配置中已移除所有其他模型
- ML 节点镜像为 `3.0.12-post3`（或 `3.0.12-post3-blackwell`）

## 密钥与安全

### v0.2.9 升级后创建的热密钥应使用哪个 CLI 版本？

对于在 v0.2.9 升级后创建的新热密钥，授予权限时应使用 [v0.2.9 版本](https://github.com/gonka-ai/gonka/releases/tag/release/v0.2.9) 的 CLI。

### 我可以在哪里找到密钥管理的相关信息？
您可在文档中找到专门的 [密钥管理](https://gonka.ai/host/key-management/) 章节，其中概述了在网络中安全管理应用程序密钥的流程和最佳实践。

### 我清除或覆盖了共识密钥

如果您使用的是 **tmkms** 且删除了 `.tmkms` 文件夹，只需重新启动 **tmkms** —— 它将自动生成一个新的密钥。  
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
在服务器之外的本地设备上备份**冷密钥**。

1) 停止 API 容器：
 
 
 
 
```
    docker compose down api --no-deps
 
 
 
 
```

2) 在您的 `KEY_NAME` 文件中为热密钥设置 `config.env`。

3) [服务器]：重新创建热密钥：
 
 
 
 
```
    source config.env && docker compose run --rm --no-deps -it api /bin/sh
 
 
 
 
```

4) 然后在容器内执行：
 
 
 
 
```
    printf '%s\n%s\n' "$KEYRING_PASSWORD" "$KEYRING_PASSWORD" | \
    inferenced keys add "$KEY_NAME" --keyring-backend file
 
 
 
 
```

5) [本地]：在你备份冷钱包密钥的本地设备上，执行该交易：
 
 
 
 
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

### 什么是计算证明？

计算证明（Proof-of-Compute, PoC）是一种共识机制，它用可验证的基于 Transformer 的计算能力取代了基于资本或哈希算力的权重机制。PoC 定义了真实 AI 计算量如何被衡量，并转换为治理权和共识权重。PoC 通过在每个纪元（epoch）结束时进行的短暂、同步的“冲刺”（Sprint）来执行。在冲刺阶段之外，该纪元的时间用于实际的 AI 计算任务。在实际使用中，“计算证明”（PoC）和“冲刺”（Sprint）这两个术语经常互换使用。当提到“下一轮 PoC”或“PoC 阶段”时，通常指的是下一次 Sprint，即计算证明的执行阶段。

### 什么是冲刺（Sprint）？

冲刺（Sprint）是计算证明的一个阶段。在 Sprint 期间，所有主机（Host）将同时在一个具有随机化层的 Transformer 模型上运行与 AI 相关的推理任务，对一连串的随机数（nonce）流进行处理，并生成输出向量。一个主机在下一个纪元中的投票权，与其成功处理的 nonce 数量成正比，前提是其上报的输出结果能被验证为由指定的 Sprint 模型正确生成。

### 如何模拟计算证明（PoC）？

你可能希望在机器学习节点（ML Node）上自行模拟 PoC，以确保当链上进入 PoC 阶段时一切能够正常运行。

要运行此测试，你需要拥有一台尚未向 API 节点注册的正在运行的 ML 节点，或者暂停 API 节点。要暂停 API 节点，请使用 `docker pause api`。测试完成后，你可以恢复运行：`docker unpause api`。

对于测试本身，你需要向 ML 节点发送一个 POST `/v1/pow/init/generate` 请求，这与 API 节点在 PoC 阶段开始时发送的请求相同：  
[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32)

PoC 使用的模型参数如下：  
[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41)

如果你的节点处于 `INFERENCE` 状态，则需要先将其转换为停止（stopped）状态：

```

curl -X POST "http://<ml-node-host>:<port>/api/v1/stop" \
  -H "Content-Type: application/json"
```

现在你可以发送请求以启动 PoC：

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

将此请求发送到 ML 节点代理容器的 `8080` 端口，或直接发送到 ML 节点的 `8080` [https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/deploy/join/docker-compose.mlnode.yml#L26](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/deploy/join/docker-compose.mlnode.yml#L26)

如果测试成功运行，您将看到类似以下内容的日志：
```

2025-08-25 20:53:33,568
 - pow.compute.controller
 - INFO
 - Created 4 GPU groups:
2025-08-25 20:53:33,568
 - pow.compute.controller
 - INFO
 -   Group 0: GpuGroup(devices=[0], primary=0) (VRAM: 79.2GB)
2025-08-25 20:53:33,568
 - pow.compute.controller
 - INFO
 -   Group 1: GpuGroup(devices=[1], primary=1) (VRAM: 79.2GB)
2025-08-25 20:53:33,568
 - pow.compute.controller
 - INFO
 -   Group 2: GpuGroup(devices=[2], primary=2) (VRAM: 79.2GB)
2025-08-25 20:53:33,568
 - pow.compute.controller
 - INFO
 -   Group 3: GpuGroup(devices=[3], primary=3) (VRAM: 79.2GB)
2025-08-25 20:53:33,758
 - pow.compute.controller
 - INFO
 - Using batch size: 247 for GPU group [0]
2025-08-25 20:53:33,944
 - pow.compute.controller
 - INFO
 - Using batch size: 247 for GPU group [1]
2025-08-25 20:53:34,151
 - pow.compute.controller
 - INFO
 - Using batch size: 247 for GPU group [2]
2025-08-25 20:53:34,353
 - pow.compute.controller
 - INFO
 - Using batch size: 247 for GPU group [3]
```

然后，该服务将开始向`DAPI_API__POC_CALLBACK_URL`发送生成的随机数。
```

2025-08-25 20:54:58,822
 - pow.service.sender
 - INFO
 - Sending generated batch to http://api:9100/
```

http://api:9100 这个 URL 在你暂停了 api 容器，或者 ML Node 容器与 api 容器未共享同一个 Docker 网络时将无法访问。此时你可能会看到错误信息，提示 ML Node 无法发送生成的批次。关键是要确保生成过程正在正常进行。

### 确认率（confirmation ratio）为 0 是什么意思？如果出现这种情况我该怎么办？

0% 的确认率是一种异常状态，表示在当前周期（epoch）内，你的 API 节点未发送任何 nonce，即该节点完全没有参与确认计算证明（Confirmation Proof-of-Compute, CPoC）。为排查问题，请检查 API 节点日志和 ML Node 日志，这些日志通常会说明为何未提交 nonce。

可能的原因包括：

- API 节点配置错误或处于宕机状态
- 管理接口或管理端口对外公开，导致 ML Node 可被未授权访问
- 共识节点落后于链上进度，导致 PoC 参与时间超出允许的时间窗口
- ML Node 驱动程序出现故障

为降低此类风险，建议采取以下措施：确保管理端口不对外公开、确认 API 节点正在运行且配置正确、监控共识节点的同步状态，并为 ML Node 及其驱动程序设置故障告警机制。

## 性能与故障排查

### 如何使用代理预发布版本（v0.2.8）保护节点免受 DDoS 攻击？

新版本代理已发布，包含速率限制和 DDoS 防护功能。

更新内容如下：

- 对 API/RPC 端点实施速率限制，防止因请求过多而影响网络节点
- 阻止资源消耗较大的内部路由，如 `training` 和 `poc-batches`
- 可选地禁用 `/chain-api`、`/chain-rpc` 和 `/chain-grpc` 端点

**更新说明****步骤 1**：更新代理镜像
```

sed -i -E 's|(image:[[:space:]]*ghcr.io/product-science/proxy)(:.*)?$|\1:0.2.8-pre-release-proxy@sha256:6ccb8ac8885e03aab786298858cc763a99f99543b076f2a334b3c67d60fb295f |' docker-compose.yml
```

!!! note "重要"
	执行步骤2将在此节点上禁用 `/chain-api`、`/chain-rpc` 和 `/chain-grpc` 端点。应用该设置后，此节点将不再提供公共RPC服务。如果您运营公共RPC端点，则必须单独运行仅用于RPC的节点（不包含这些限制），并保持此节点为私有状态。

	**步骤2（可选）**：禁用 `chain-api`、`chain-rpc` 和 `chain-grpc`

	如果您希望完全禁用 `/chain-api`、`/chain-rpc` 和 `/chain-grpc` 端点：
```

sed -i 's|DASHBOARD_PORT=5173|DASHBOARD_PORT=5173\n
      - DISABLE_CHAIN_API=${DISABLE_CHAIN_API:-true}\n
      - DISABLE_CHAIN_RPC=${DISABLE_CHAIN_RPC:-true}\n
      - DISABLE_CHAIN_GRPC=${DISABLE_CHAIN_GRPC:-true}\n|' docker-compose.yml
```

禁用最近用于攻击的训练 URL：
```

sed -i -E -e '/GONKA_API_(EXEMPT|BLOCKED)_ROUTES/d' -e 's|(
- GONKA_API_PORT=9000)|\1\n
      - GONKA_API_EXEMPT_ROUTES=chat inference\n
      - GONKA_API_BLOCKED_ROUTES=poc-batches training|' docker-compose.yml
```

此后，您的代理配置应如下所示：
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

**步骤 3：** 拉取并重启代理
```

docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull proxy
source ./config.env && docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d --no-deps proxy
```

**步骤 4：** 关闭外部端口 26657

您可以将端口 26657 关闭为外部端口。

此步骤为可选，但强烈建议执行：
```

sed -i 's|
- "26657:26657"|#
- "26657:26657"|g' docker-compose.yml
```

这将注释掉你的节点容器中的端口映射：
```

node:
    container_name: node
    ...
    ports:
 
     - "5000:26656" #p2p
      #
- "26657:26657" #rpc
```

**步骤 5：** 重启节点：
```

source ./config.env && docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d --no-deps node
```

**在关闭 26657 端口后访问节点状态**

如果您之前使用 `curl -s http://localhost:26657/status` 访问节点状态，现在可以通过容器内部进行访问：

=== "选项 1：从代理容器中访问（使用 `curl`）"

	
```
	docker exec proxy curl -s node:26657/status | jq
	
```

=== "选项2：从节点容器（使用`wget`）"

	
```
	docker exec node wget -qO
- http://localhost:26657/status | jq
	
```
	
使用 `watch` 进行持续监控：
```

watch -n 5 'docker exec node wget -qO
- http://localhost:26657/status | jq -r ".result.sync_info | \"Block: \(.latest_block_height) | Time: \(.latest_block_time) | Syncing: \(.catching_up)\""'
```

### Cosmovisor 更新需要多少可用磁盘空间？如何安全地删除 `.inference` 目录中的旧备份？

Cosmovisor 在执行更新时，会在 `.inference` 状态文件夹中创建一个完整的备份。例如，你可能会看到类似 `data-backup-<some_date>` 的文件夹。

截至 2025 年 11 月 20 日，数据目录的大小约为 150 GB，因此每次备份将占用大约相同的磁盘空间。

为确保更新顺利进行，建议至少保留 250 GB 以上的可用磁盘空间。

你可以删除旧的备份以释放空间，但在某些情况下这可能仍不足够，你可能需要扩展服务器磁盘容量。

要删除旧的备份目录，可以使用以下命令：
```

sudo su
cd .inference
ls -la
   # view the list of folders. There will be folders like data-backup... DO NOT DELETE ANYTHING EXCEPT THESE
rm -rf <data-backup...>
```

### 如何防止 NATS 中内存无限制增长？

当前 NATS 配置为无限期存储所有消息，这会导致内存使用量持续增长。  
推荐的解决方案是为 NATS 流中的消息配置 24 小时的生存时间（TTL）。

1. 安装 NATS CLI。首先按照以下链接中的说明安装 Golang：[https://go.dev/doc/install](https://go.dev/doc/install)。然后安装 NATS CLI：
 
 
 
```
   go install github.com/nats-io/natscli/nats@latest
 
 
 
```

2. 如果您已安装 NATS CLI，请运行：
 
 
 
 
```
    nats stream info txs_to_send --server localhost:<your_nats_server_port>
    nats stream info txs_to_observe --server localhost:<your_nats_server_port>
 
 
 
 
```

### 如何更改 `inference_url`？

在以下情况下，您可能需要更新您的 `inference_url`：

- 您更改了 API 域名；
- 您将 API 节点迁移至新机器；
- 您重新配置了 HTTPS / 反向代理；
- 您正在迁移基础设施，并希望将 Host 记录指向新的端点。

此操作**无需**重新注册、重新部署或重新生成密钥。更新您的 `inference_url` 使用与初始注册相同的交易（即 `submit-new-participant msg`）完成。

链上逻辑会检查您的 Host（参与者）是否已存在：

- 如果参与者不存在，则该交易将创建一个新的参与者；
- 如果参与者已存在，则仅允许更新以下三个字段：`InferenceURL`、`ValidatorKey`、`WorkerKey`。

所有其他字段将自动保留。

这意味着更新 `inference_url` 是一项安全且非破坏性的操作。

!!! note

    当节点更新其执行 URL 后，来自其他节点的推理请求将立即使用新 URL。然而，记录在 `ActiveParticipants` 中的 URL 要等到下一个 epoch 才会更新，因为提前修改会破坏与参与者集合相关的加密证明。为避免服务中断，建议在下一个 epoch 完成之前，同时保持旧 URL 和新 URL 处于可运行状态。

    [LOCAL] 使用您的冷密钥在本地执行更新：
 
 
 
 
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

通过访问以下链接并将其末尾替换为你的节点地址来验证更新：[http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/participant/gonka1qqqc2vc7fn9jyrtal25l3yn6hkk74fq2c54qve](http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/participant/gonka1qqqc2vc7fn9jyrtal25l3yn6hkk74fq2c54qve)

### 为什么我的 `application.db` 越来越大，该如何修复？

某些节点存在 `application.db` 尺寸不断增长的问题。

`.inference/data/application.db` 用于存储链的状态历史（非区块），默认保留 362880 个状态的历史记录。

状态历史中每个状态都包含一个完整的 Merkle 树，实际上可以安全地将其保留时间大幅缩短，例如仅保留最近 1000 个区块。

修剪参数可在 `.inference/config/app.toml` 中进行设置：

```

...
pruning = "custom"
pruning-keep-recent = "1000"
pruning-interval    = "100"
```

新配置将在重启 `node` 容器后生效。但目前存在一个问题——即使启用了修剪（pruning）功能，数据库清理仍然非常缓慢。

有几种方法可以重置 `application.db`：

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
    
    此方法可能需要一些时间，在此期间节点将无法记录交易。

请使用可用的可信节点下载快照。

=== "选项 2：从本地快照重新同步"

快照功能默认启用，存储在 `.inference/data/snapshots` 中。

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
    
    这可能需要一些时间。完成后，你将在 `.inference/temp/data/application.db` 中拥有新的 `application.db`

    2) 用新的替换 `application.db`

    2.1) 停止 `node` 容器（从另一个终端窗口） 
 
 
 
 
    ```
        docker stop node
 
 
 
 
    ```
    
    2.2) 移动原始 `application.db` 
 
 
 
 
    ```
        mv .inference/data/application.db .inference/temp/application.db-backup
        mv .inference/wasm .inference/wasm.db-backup
 
 
 
 
    ```
    
    2.3) 将其替换为新的 
 
 
 
 
    ```
        cp -r .inference/temp/data/application.db .inference/data/application.db
        cp -r .inference/temp/wasm .inference/wasm
 
 
 
 
    ```
    
    2.4) 启动 `node` 容器（从另一个终端窗口）： 
 
 
 
 
    ```
        docker start node
 
 
 
 
    ```
    
    3) 等待 `node` 容器完成同步，然后删除 `.inference/temp/`

    如果你有多个节点，建议逐个进行清理。

=== "选项 3：实验性方法"

    另一种可选方案是在一台独立的仅用于 CPU 的机器上启动一个独立的 `node` 容器实例，并将其配置为严格验证者模式：
    
 
 
   - 保留极短的历史记录
 
 
   - 仅允许 `api` 容器访问 RPC 和 API
    
    启动后，将现有的 `tmkms` 数据卷迁移到新节点（请先在原节点上禁用区块签名）。
    
    这就是该方法的基本思路。如果你决定尝试此方案并遇到任何问题，欢迎在 [Discord](https://discord.com/invite/RADwCT2U6R) 上联系我们。

=== "选项 4：升级以应用修剪修复"

	目前已有针对长期存在的问题的修复方案：在多种修剪配置下，`application.db` 仍会持续增长。
	此项改进由 [Lelouch33](https://github.com/Lelouch33) 贡献，已包含在发布版本 [`0.2.10-post6`](https://github.com/gonka-ai/gonka/compare/main...release/v0.2.10-post6) 中。通过更新后的逻辑并配合以下设置，`application.db` 的大小可稳定维持在约 100 GB：
	
	
	
- `SNAPSHOT_INTERVAL=1000`
	
	
- `SNAPSHOT_KEEP_RECENT=2`
	
	
- `pruning-keep-recent = "20000"`
	
	
- `pruning-interval = "512"`
	
	参考链接：
	
	
	
- [https://github.com/gonka-ai/gonka/issues/819#issuecomment-3996332369](https://github.com/gonka-ai/gonka/issues/819#issuecomment-3996332369)
	
	
- [https://github.com/gonka-ai/gonka/pull/867](https://github.com/gonka-ai/gonka/pull/867)
	
	升级到该版本后，修剪将在下一个快照区块生成后开始。此过程较为耗资源，在删除旧状态历史期间可能会暂时拖慢 `node` 容器的运行。
	
	为减少对运行的影响，建议逐个节点进行升级，并使用较大的 `pruning-interval` 值（例如 `512`），以避免过于频繁地触发修剪。
	
	如果某个节点在修剪期间显著变慢，重启该节点容器可能有助于其重新同步。
	
	建议在即将发布的 v0.2.11 升级之前应用此更新，以防止大量节点同时开始修剪操作。
	
	应用更新（示例来自 `v0.2.7`，其 `inferenced` 与目标一致）：
	
```
	
# Pre-check: Ensure no confirmation PoC is active (fails entire script if not false)
	echo "--
- Pre-flight Check: Confirmation PoC Status ---" && \
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
	echo "--
- Final Verification ---" && \
	sudo rm -rf .inference/cosmovisor/current  && \
	sudo ln -sf upgrades/v0.2.10-post7 .inference/cosmovisor/current  && \
	echo "d9093b225cbd531afc56c99d0b0996b1fa2896c0745cd73293f0de08132f7754 .inference/cosmovisor/current/bin/inferenced" | sudo sha256sum --check && \
	
	
# Restart 
	source config.env && docker compose up node --no-deps --force-recreate -d
	
```

### 自动`ClaimReward`未成功，我该怎么办？

如果你有未领取的奖励，请执行：
```

curl -X POST http://localhost:9200/admin/v1/claim-reward/recover \
    -H "Content-Type: application/json" \
    -d '{"force_claim": true, "epoch_index": 106}'
```

要检查是否有未领取的奖励，您可以使用：
```

curl http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/epoch_performance_summary/106/<ACCOUNT_ADDRESS> | jq
```

## 升级

### 升级 v0.2.12：升级前模型清理

!!! note "重要"
	此清理过程 **必须在升级前完成**。如果在清理模型之前进行升级，您的节点将被拒绝并下线。

	v0.2.12 版本将移除所有不在升级后批准列表中的治理模型。在主网上，仅保留之前已强制执行的模型和 Kimi 模型。

	每个 DAPI 会将其 MLNode 配置本地持久化。启动时，会针对链上治理列表验证每个已配置的模型。如果配置中包含至少一个不支持的模型，整个节点将被拒绝，主机将下线。

	v0.2.11 版本通过将运行时视图裁剪为强制执行的模型来掩盖了此问题，因此即使持久化配置中仍包含额外模型，`/admin/v1/nodes` 仍显示为正常。v0.2.12 版本将停止这种裁剪行为，意味着将直接加载持久化配置。

	为解决此问题，以下脚本会查找 `/admin/v1/config` 中包含额外模型的每个节点，并向 `PUT` 发送一个带有清理后配置的 `/admin/v1/nodes/<id>` 请求。这些更改将在 60 秒内完成持久化。保留剩余模型的参数、硬件和端口配置不变。未列出强制执行模型的节点将被跳过，需手动修复。

	将以下脚本粘贴到主机的 shell 中。默认情况下，脚本将应用更改。若要预览更改而不实际应用，请设置 `APPLY=dry`（或任何非 `--apply` 的值）。

	仓库中的脚本：

- [Bash](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/proposals/governance-artifacts/update-v0.2.12/cleanup/cleanup_models.sh)
- [Python](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/proposals/governance-artifacts/update-v0.2.12/cleanup/cleanup_models.py)

```bash
ADMIN=${ADMIN:-http://127.0.0.1:9200}
KEEP=${KEEP:-Qwen/Qwen3-235B-A22B-Instruct-2507-FP8}
APPLY=${APPLY:-"--apply"}

curl -sS "$ADMIN/admin/v1/config" | jq -r --arg k "$KEEP" '
  .nodes[] | "\(.id): "
 + (
    if (.models | has($k) | not) then "skip (\(.models | keys))"
    elif (.models | length) == 1 then "ok"
    else "\(.models | keys) -> [\($k)]" end)'

if [[ "$APPLY" == "--apply" ]]; then
  curl -sS "$ADMIN/admin/v1/config" \
    | jq -c --arg k "$KEEP" \ '.nodes[] | select((.models | has($k)) and (.models | length > 1)) | .models = {($k): .models[$k]}' \ while IFS= read -r p; do id=$(jq -r .id <<<"$p") curl -sS -f -X PUT -H 'Content-Type: application/json' -d "$p" \ "$ADMIN/admin/v1/nodes/$id" >/dev/null && echo "$id: updated" done echo "done; persisted within 60s" else echo "preview only; rerun without APPLY=dry to commit" fi
 
```


运行脚本后等待 60 秒，以确保更改已持久化，然后再触发升级。然后，验证配置：

```bash
curl -sS http://127.0.0.1:9200/admin/v1/config \
| jq '.nodes[] | {id, models: (.models | keys)}'
 ```

|
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
预期输出：

```json
{
  "id": "<nodeId>",
  "models": [
    "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8"
  ]
}
```

### 升级 v0.2.12：预下载二进制文件

```

#
 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.12/bin \
              .inference/cosmovisor/upgrades/v0.2.12/bin && \

#
 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.12/decentralized-api-amd64.zip" && \
echo "d0143a95e12e1ada06cfea5e4d3deab13534c3523c967e9a6b87ac9f9bf3247d decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.12/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.12/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

#
 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.12/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.12/inferenced-amd64.zip" && \
echo "df7656503d39f6703767d32d5578d1291e32cb114844d8c1cd0f134d1bf4babd inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.12/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.12/bin/inferenced && \
echo "Inference Installed and Verified" && \

#
 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--
- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.12/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.12/bin/inferenced && \
echo "94ce943338d12844028e84fe770106c9d28d866cf0af99f27da30f56d69efa34 .dapi/cosmovisor/upgrades/v0.2.12/bin/decentralized-api" | sudo sha256sum --check && \
echo "642eb9858cd77d182f3e1c4d44553f5379d615983430e1fd8e85f09632af4271 .inference/cosmovisor/upgrades/v0.2.12/bin/inferenced" | sudo sha256sum --check
```

## 悬赏计划

### 什么是悬赏计划？谁可以参与？奖励如何发放？

参与悬赏计划无需成为节点托管者（Host）：许多悬赏奖励会授予提交修复、实现功能改进或为 Gonka 整体基础设施做出贡献的贡献者。

奖励资金来自社区资金池，并在经过治理投票批准后发放。漏洞报告尤其受到重视，负责任的漏洞披露若有助于防止攻击并提升网络安全性，也有资格获得悬赏奖励。

最终的悬赏决定、奖励金额及类别均由社区治理机构全权决定。

### 漏洞悬赏的定价模型是什么？

衡量漏洞严重性的一种常见方式是： 
```

Risk = Impact × Likelihood
```

影响从网络角度进行评估（高或严重级别需要对整个网络产生广泛影响）。仅影响单个参与者的漏洞通常最高评为低或中等。

**影响等级**

| 等级 | 描述 | 示例 |  |
| --- | --- | --- | --- |
| 严重 | 对整个网络造成灾难性后果 |  |  |
| 高 |  |  |  |
| 中 |  |  |  |
| 低 |  |  |  |
**发生可能性**

- **自然发生 — 非故意；** 在正常条件下出现。通过概率估算（触发条件的频率、使用模式）。
- **故意 — 有利可图** — 为获取经济利益而被利用。当收益高且成本/复杂度低时，可能性更高。
- **故意 — 恶意破坏** — 为制造干扰而被利用。当具有全网影响且成本低时可能性更高；仅针对单个参与者的破坏 → 可能性较低。

**风险矩阵**

| 影响 \ 可能性 | 高 |
| --- | --- |
| `devshard ≥ 0.2.13` (force-zero-below-256 active) | 高 |
| 严重 | 中 |
### 如何参与赏金计划？

- 可创建新的 GitHub issue 或 discussion 来提出改进建议，并获取社区反馈以判断是否值得实施。
- 或选择一个[标记为“可领取”的现有 issue](https://github.com/gonka-ai/gonka/issues?q=is%3Aissue%20state%3Aopen%20label%3Aup-for-grabs)。开始前请留言说明已开始工作，并附上大致完成时间（ETA），以便他人了解进展，避免重复劳动。

### 建议的漏洞报告流程是什么？

- 如果问题严重性不高（影响有限，无网络范围影响）且修复成本较低，通常可直接提交 PR。
- 如果问题属于高或严重级别，请向可信的社区成员（长期 Gonka 仓库贡献者）私下报告，可附带报告或在私有 fork 中提供修复方案。
- 如果问题看似属于某一类漏洞，且系统性审查可能发现更多同类问题，请注明计划进行审查。这有助于避免并行重复审查。

要参与贡献，请选择一个问题，提交高质量的修复，并在相关开发频道中分享链接以获取反馈。

### 在哪里可以查看谁获得了赏金、原因及时间？

最可靠的信息来源是链上记录和 [GitHub](https://github.com/gonka-ai/gonka/)。请以这些作为判断谁获得了赏金、赏金原因及发放时间的主要依据。

## 错误

### `No epoch models available for this node`

此处提供了一些常见错误及节点日志中可能出现的典型日志条目示例。

```

2025/08/28 08:37:08 ERROR No epoch models available for this node subsystem=Nodes node_id=node1
2025/08/28 08:37:08 INFO Finalizing state transition for node subsystem=Nodes node_id=node1 from_status=FAILED to_status=FAILED from_poc_status="" to_poc_status="" succeeded=false blockHeight=92476
```

这实际上并不是一个错误，只是表明你的节点尚未被分配模型。最可能的原因是你的节点尚未参与过 Sprint，未获得投票权（Voting Power），因此还没有被分配模型。  
如果你的节点已经通过了 PoC，则不应再看到此日志。如果尚未通过，PoC 大约每 24 小时进行一次。

### 从状态同步快照启动时如何修复 `err="no validator signing info found"`？

如果在从状态同步快照启动期间频繁遇到 `err="no validator signing info found"`，这通常与 Cosmos SDK 的 `iavl-fastnode` 行为有关。一个安全的临时解决方案是在首次启动时禁用 `fastnode`，然后（可选）在节点完全同步后重新启用它。

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

重启后，该问题应不会再次出现。

!!! note
	`main` 包含了 v0.2.10-post6 版本。从该版本开始启动的节点会自动应用此设置，因此你通常无需手动更改。

## 推理

### 为什么 4,096 输出令牌的限制会导致模型在思考过程中停滞——返回零个令牌？

**如果你遇到以下情况，说明你受到了此问题影响**

- 你看到了 `content=null` 和 `finish_reason=length`。
- 模型“沉默”——使用情况显示有令牌消耗，但没有文本输出。
- 使用 `max_tokens=100` 发起探测请求时，返回为空。

**优先修复：适用于 Kimi-K2.6 的可用配置**

如果你没有时间深入排查——可将以下 payload 作为起点直接复制使用。截至 2026-05-28，该配置在两个公共 broker 上均可正常工作；使用前请向你的 broker 运营商确认其仍为最新有效配置。

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

为什么是这些精确的字段：

- `max_tokens: 4096` —— 给模型分配全部可用的输出配额。目前代理（brokers）的实际上限是 3,072（见 Q3）—— 超过此值无意义。最小值为 256，否则网关可能会强制将 `thinking_token_budget` 设为零。
- `thinking: {"type": "disabled"}` —— 通过聊天模板提示禁用隐藏思考（hidden thinking）。
- `thinking_token_budget: 0` —— 双重保险：在生成参数级别显式地将配额设为零（见 Q2）。
- **模型 ID 区分大小写**：在 `gonka-api.org` 上使用 `moonshotai/Kimi-K2.6`（大写 K），在 `gonkagate.com` 上使用 `moonshotai/kimi-k2.6`（小写 k）。如果遇到 404 错误——请切换大小写。请与 `GET /v1/models` 的响应结果进行核对。

即用型 curl 命令（替换 `<broker>` 以及模型 ID 的大小写）：

```bash
curl -sS https://<broker>/v1/chat/completions \
  -H "Authorization: Bearer $GONKA_API_KEY" \
  -H "Content-Type: application/json" \
  -d @payload.json
```

如果返回了有意义的文本——问题出在你原始的请求数据中；请逐个字段进行比对。如果返回的是 `content=null`——请捕获响应中的 `id` 并将其发送给经纪商的技术支持。

**首先检查规则是否在你的经纪商上已激活**

网关行为取决于经纪商，并且会随时间变化。请运行以下测试：

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
| --- | --- |
| `devshard ≥ 0.2.13`（启用 force-zero-below-256） | `finish_reason="length"`，约 0–10 个推理 token |
| 较旧版本 | `finish_reason="length"`，约 40–60 个推理 token（默认 `max_tokens / 2`） |
|  |  |
|  |  |
以下规则描述的是最近的网关代码（`devshard ≥ 0.2.13`）。你的代理（broker）可能尚未更新。不确定版本？—— 先运行上方的修复命令。如果能返回有意义的文本，则说明网关足够新；否则，请将 `response.id` 发送给代理的技术支持，询问是否可以升级。

**模型与网关侧的处理机制****Kimi-K2.6 特性说明**：该模型会生成 `<think>…</think>` 块。**两个部分（`<think>` 和可见内容）均等消耗 `max_tokens`**。当 `max_tokens` 较小时，模型会在 `<think>` 内耗尽全部预算，仅返回 `</think>`，而 vLLM 会将其作为特殊 token 剥离 → `content=null`，`finish_reason=length`。从客户端看来，结果就是“0 个 token”。

**网关于 `thinking_token_budget` 的处理规则**（PR #1202，devshard 0.2.13+）：

| 条件 | 网关行为 |  |
| --- | --- | --- |
| `max_tokens < 256` | `ttb = 0`（强制归零，覆盖客户端设置） |  |
| 未设置 `ttb`，但设置了 `max_tokens >= 256` | `ttb = max_tokens / 2` |  |
附加规则：

- **`max_tokens` 下限 → 16**（PR #1227）—— 此前 `max_tokens=1` 可稳定生成 `content=null`，现在会被静默提升至 16。
- **`thinking: {"type":"disabled"}` 镜像机制**（PR #1224）—— 网关会将其值复制到 `chat_template_kwargs.thinking=false`。Kimi 的对话模板会读取该参数。

历史上会导致 `content=null` 的场景（`max_tokens=1`，探针形状 `max=100, min=100, ttb=50`）现在通过最新网关可返回非空内容。在 `gonkagate.com`（2026-05-25）版本中，未设置 `ttb` 的请求返回了约 50 个推理 token —— 该版本未启用 force-zero-below-256。

**对推理用户的建议**：

- 请重新测试网关版本 ≥ 0.2.13（2026-05-23 及之后发布）的代理服务。
- 若仍返回零 token，请捕获响应中的 `id` 并发送给代理支持团队。提取方法：

 

 

```bash
  curl ... | jq .id
 
 
```

  `devshard-<short>-<short>`，例如 `devshard-7a4f-31b2`。发送至：经纪商的支持渠道（对于 `gonka-api.org` — 网站上的支持链接；对于 `gonkagate.com` — `/contact` 部分）。
- **不要仅依赖 `thinking:disabled`** —— 为确保安全，应显式设置 `thinking_token_budget: 0`（见问题2）。

**对于经纪商**：在 0.2.13 之前的版本中 —— 按照您的验证/发布节奏进行更新（无需紧急：旧版本客户端和托管规则需重新验证）。在更新前，客户端应用上述变通方案；在 `devshard-0.2.13` 之后，零输出的 `content=null` 情况将消失。

### 使用 Kimi K2 时，整个 token 上限可能被用于推理而无实际输出。这是输出限制、带宽还是上游问题？

**这是网关策略，而非模型限制。** `thinking_token_budget` 解析器（PR #1202）默认为推理分配 `max_tokens / 2`。对于工具密集型流程，预算在产生任何有用输出前就已耗尽。缓解方法是显式设置 `thinking_token_budget: 0` 或 `thinking: {"type": "disabled"}`（网关通过 PR #1224 将其镜像到 `chat_template_kwargs`）。模型只是遵循该预算。

与问题1相同的原因 —— 模型将 `max_tokens` 在 `<think>` 和可见内容之间拆分。这并非带宽问题，也不是输出上限。

**两种逃逸机制**

1. **`thinking: {"type": "disabled"}`** —— 网关将其镜像到 `chat_template_kwargs.thinking=false`（Kimi 聊天模板读取该 kwarg），并移除顶层的 `thinking`。`"adaptive"` 和 `"auto"` 均被接受（Claude Code CLI / Anthropic SDK 预设，PR #1224）—— 两者均解析为 `enabled`。
2. **`thinking_token_budget: 0`** —— 显式的零值直接作为生成参数传入 vLLM，并可靠地将推理预算归零。

**重要细节**：这些机制作用于不同层级（聊天模板提示 vs. 生成参数），互不重叠。`thinking:disabled` **不会**自动归零 `thinking_token_budget` —— 当使用默认的 `max_tokens=4096` 且仅设置 `disabled` 时，模型仍会从网关解析器获得隐藏的 `ttb=2048`。在我们的测试中，即使在推理密集型提示下，Kimi 仍遵守了 `thinking:disabled`。模型文档（计划中的 `docs/chat-api/kimi-k2.6.md`）警告在某些推理场景下模型可能忽略该提示 —— 我们未能复现，但仍建议谨慎处理。**双重保险**：对于关键流程，建议同时发送两个参数。

**数值验证**

相同的找 bug 提示，`max_tokens=500`，答案在语义上一致：

| 配置 | usage.completion_tokens |
| --- | --- |
| 配置 | usage.completion_tokens |
| `thinking: {"type":"disabled"}` | 实际耗时 |
| 默认（网关解析器 → ttb = max_tokens/2 = 250） | **65 * * |
| One tool call + moderate JSON (`arguments` ≤ 500 tokens) | yes |
| Small structured output (3–5 summary points) | yes |
| A long document summary (>10k source tokens) | no |
| Large code diffs (>2k lines) | no |
| 3 + parallel tool calls in one response | no |
| Agentic loop: reasoning + tool calls + visible content at once | no |
即使是简单任务，一半的默认预算也被用于隐藏推理 —— 因此建议在工具密集型/代理流程中禁用推理。

**对于推理用户**：

- 工具密集型 / 代理流程但无需推理 —— 使用 `"thinking": {"type": "disabled"}`（Kimi）或 `"enable_thinking": false`（Qwen，自动翻译）。
- 复杂推理 —— 显式设置 `thinking_token_budget`（不要依赖默认的 `max_tokens / 2`）。
- 如果 `thinking:disabled` 仍导致预算耗尽 —— 同时显式重复设置 `thinking_token_budget: 0`。

**对于经纪商**：在 0.2.13 之前的版本中 —— 按照发布节奏更新。在更新前，客户端应用变通方案。在落地页注明：Kimi 在工具密集型流程中需设置 `thinking:disabled`，或显式设置 `thinking_token_budget`，或使用较大的 `max_tokens`。

### Kimi 的输入 token 上限为 4k，输出上限为 8,192。这些限制何时会提高？

**问题中的数字不正确**

- **输出上限：3,072 个 token**（在两个测试经纪商上均如此，即使设置了 `max_tokens=8000`，也在恰好 3,072 时返回 `finish_reason=length`）。
- **输入：最高达 240,000 个 token**（主网 Kimi 部署的 `--max-model-len`）。不是 4,000。

**输出上限的来源**

代码中的网络上限为 4,096（`RequestMaxTokensCap`），但实际限制更低。具体机制为黑盒。可能的解释（按可能性排序，**未从公开代码中确认**）：

1. 经纪商操作员未覆盖网关默认的 `DefaultRequestMaxTokens = 3,072`。
2. 经纪商操作员通过管理接口为每个模型设置了 `request_max_tokens_cap = 3,072`（`POST /v1/admin/settings`）。
3. 上游 DAPI 或宿主端限制（例如 vLLM 的 `--max-tokens-per-request` 或加载器约束）。

要确切了解 —— 请向经纪商查询每个模型的 `request_max_tokens_cap` 值。

**3,072 个 token 能容纳多少内容**

| 场景 | 能否容纳在 3,072 内？ |  |  |
| --- | --- | --- | --- |
| 约 1,900–2,200 个普通英文单词 | 是 |  |  |
| 约 600–800 行 Python/JS 代码 | 是 |  |  |
| 简短回答（5–10 句话） | 是 |  |  |
对于第二组用例 —— 向经纪商申请提高上限（见 **对于经纪商**）。

**如何提高上限**

输出上限由 **经纪商** 控制，而非网络。要提高上限 —— 联系您的经纪商：他们可通过单个管理调用增加 `request_max_tokens_cap`（无需代码更改）。若要将网络范围上限提升至 4,096 以上，需向网关代码提交 PR 并发布新版本；您可通过 `gonka-ai/gonka` 上的 GitHub Discussion 发起。

对好奇者 / 运营者说明：区块链存储每个模型的价格参数（`coins_per_input_token`、`coins_per_output_token`）和部署参数（`model_args`），但没有字段用于硬性输出限制 —— 上限放宽是本地经纪商策略，而非治理定义的值。

**240k 输入的来源**

主网 Kimi-K2.6 部署通过链上治理提案 v0.2.12 注册（`inference-chain/app/upgrades/v0_2_12/upgrades.go:kimiGovernanceModel()`）：

```text
ModelArgs: ["--max-model-len","240000",
            "--tool-call-parser","kimi_k2",
            "--reasoning-parser","kimi_k2"]
VRam: 720 (GB)
```

该模型卡声明了 256K 的原生上下文长度。网关本身不单独限制输入长度，仅受通用请求体大小（10 MiB）和消息数量（≤ 2,048）的约束——详见 `docs/chat-api/README.md` 中的“请求限制”部分（计划文档）。

**重要注意事项（开放问题）**

即使经纪方（broker）同意提高输出上限，个别节点仍可能以较小的 `--max-model-len` 启动。网关路由层并未考虑每个主机的上下文容量（[issue #818](https://github.com/gonka-ai/gonka/issues/818)）。对于大负载（>50k），请求落到“小容量”节点是一种系统性行为，而非暂时的随机现象。

**对推理用户（Inference User）的建议：**

- 实际的输出上限由经纪方决定——请向其查询每个模型的 `request_max_tokens_cap` 值。
- 遇到输入限制——这几乎肯定是某个特定节点上的 `--max-model-len`，而非全局限制。由于路由层未考虑每主机上下文（issue #818），大负载（>50k）下此问题具有系统性。解决方法：重试或将请求拆分为多个 API 调用。
- 触发输出上限——请要求经纪方提高该限制。全网范围提升（超过 4,096）需代码变更；请通过 `gonka-ai/gonka` 上的 GitHub Discussion 提出请求。

**对经纪方（Broker）的建议：**

- 按模型提升上限可通过 `POST /v1/admin/settings` 的单次管理调用完成 `model_limits[].request_max_tokens_cap`，无需代码变更。但会增加每请求的托管风险，并可能触发主机级 `--max-model-len`（导致个别节点返回 5xx）。建议仅在确认需求后，针对特定模型提升，并事先验证所有托管节点的 `--max-model-len`。
- 全网范围提升（超过 4,096）需修改网关代码并发布新版本。若存在稳定的大输出需求，请发起 Discussion 讨论。

### 为何使用 30k
+ 系统提示的代理（如 Hermes、OpenClaw）在 Kimi 上失败？

**简要回答**

Kimi 模型在模型层和网关层均支持 30k
+ 输入，但稳定性取决于路由。其原生窗口为 256K，主网部署使用 `--max-model-len 240000`，网关允许最大 10 MiB 的请求体。实测表明，约 69,000 个提示词（≈800 条消息 × 80 词）可在 5.5 秒内完成单次推理。但在持续或重复的长请求（>50k）中会出现不稳定性（issue #818）；对于大负载（如 215k），多次尝试可能均以 503 错误告终。

**验证来源（均在 `gonka-ai/gonka` 中）**

- 原生上下文 256K —— `docs/chat-api/` 中的模型卡（具体文件名将在 chat-api 文档集中确定）。
- 主网部署参数（链上）—— `inference-chain/app/upgrades/v0_2_12/upgrades.go:kimiGovernanceModel()`。
- 请求体/消息限制（10 MiB，≤ 2,048 条消息）—— `docs/chat-api/README.md`（计划中），“请求限制”部分。

**30k 输入失败的两个常见原因****
1. 代理负载中存在单个被拒绝字段。** 网关维护严格的白名单。若代理发送了任一非标准字段（`tags`、`enforced_tokens`、`plugins`、`guided_json`）——整个请求将以 HTTP 400 被截断。Hermes 特定的 `tags` 拒绝——见 `#reject-tags` 在 `docs/chat-api/troubleshooting.md` 中的锚点（计划中）。实测：一个有效的 69k 负载
 
+ `tags:["session:abc"]` → 2 秒内返回 HTTP 400。

**
2. 路由至上下文较小的节点。** 网关路由层在分配请求时未考虑主机实际上下文大小（[issue #818](https://github.com/gonka-ai/gonka/issues/818)；另见计划中的 `known-issues.md` §3）。对于极长负载（>50k，尤其是 >200k），落到“小容量”节点是**网络级的系统性行为**，而非客户端错误：实测 5 次 215k 请求全部失败（0/5）。请求将在 vLLM 层面失败。

相关开发者请求：[issue #1229](https://github.com/gonka-ai/gonka/issues/1229)（2026 年 5 月提交），涉及代理场景的阻碍因素——长推理链、工具调用兼容性、超出输出限制后的续写等。

**快速自检清单**

1. 逐一移除字段 `tags`、`enforced_tokens`、`plugins`、`strict`、`guided_json`、`guided_regex`、`guided_grammar`、`guided_choice`。每次移除后重新发送相同请求。
2. 若移除无效——检查 `tools[].function.parameters` 中的 schema 深度（≤ 16）和总节点数（≤ 256），参见 Q9。
3. 负载已清理但仍失败——属于网络级问题（issue #818）。解决方法：重试或拆分请求。

**对推理用户（Inference User）的建议：**

- 首先对照 `docs/chat-api/README.md`（计划中）中的白名单检查负载。大多数 Hermes / OpenClaw 的 400 错误源于单个字段或 schema 问题。
- **经纪方返回的通用错误信息（如“上游模型提供方拒绝”）具有误导性**：部分经纪方将具体的网关 400 错误合并为通用消息，部分则透传原始错误（`"Chat completions parameter \"tags\" is currently rejected by the Gonka network..."` 并附文档链接）。经纪方对比见 `comparison-brokers.md`（计划中）。**若某经纪方显示通用错误——尝试切换至其他经纪方以获取可读错误信息，查明根本原因。**
- 负载无误但仍失败——属于网络级问题（issue #818）。解决方法：重试或拆分；对于持续 >50k 的负载，单次重试通常不足——建议拆分。

**对经纪方（Broker）的建议：**

- （1）应在落地页、通过 `/v1/models` 接口或文档中明确展示各模型的原生上下文窗口，并附注说明：由于主机异构性，实际每请求容量可能更低（issue #818）。部分经纪方有意省略此信息以避免过度承诺——这是一种合理选择。（2）在主机级容量通告机制实现前——可考虑客户端过滤或维护“优选主机”列表。
- **用户体验（UX）**：网关返回包含字段名和消息的具体 400 错误（`"Chat completions parameter \"tags\" is currently rejected by the Gonka network..."`
 
+ 文档链接）。建议在生产环境中向客户端透传详细错误以加速诊断。**安全提示**：详细错误可能暴露内部字段名、主机路径和验证者 ID，助于枚举或提示注入探测。保守遮蔽是合理默认策略。若出于安全考虑将其包装为通用 `"upstream provider rejected"`——建议采用混合方式：异步日志/错误追踪中保留完整细节，向客户端返回带追踪 ID 的通用消息。代理兼容性对照表见 `docs/chat-api/agents.md`（计划中）。

### 为何 Kimi 在输出超过 4k–8k token 时生成格式错误的 JSON 工具调用？

并非带宽或 Gonka 侧限制所致，而是三个重叠原因共同导致。

**(a) `max_tokens` 截断**

测试中的经纪方实际输出上限为 3,072 token；网关网络上限为 4,096。当助手在 `arguments` 中输出包含大 JSON 对象的工具调用及可见内容时，可能触及经纪方真实上限而导致 JSON 被截断。各经纪方覆盖设置详情见 Q3。

**(b) Kimi-K2.6 工具解析器的 ID 重复冲突**

`[vLLM PR #21259 — UNVERIFIED]`。在 `n > 1` 下，`kimi_k2` 解析器在每个 choice 循环内重新计算 `history_tool_call_cnt`——两个分支均获得 `id = functions.<name>:0`。网关在 vLLM 响应中检测到重复 ID，依据 OpenAI 规范以 HTTP 400 拒绝。锚点见 `#reject-duplicate-tool-call-id` 在 `docs/chat-api/troubleshooting.md`（计划中）。上游修复方案——[vLLM PR #21259](https://github.com/vllm-project/vllm/pull/21259)（合并状态尚未独立确认）。

**(c) Hermes 工具解析器在多个工具块时出现 JSONDecodeError**

`[vLLM #17790 — awaiting upstream fix]`。不同解析器，不同问题：当模型单次响应中输出多个工具调用块时，`JSONDecodeError` 报错——[vLLM #17790](https://github.com/vllm-project/vllm/issues/17790)。相关问题：`<tool_call>` 出现在 `<think>` 中会破坏 hermes 解析——[vLLM #42021](https://github.com/vllm-project/vllm/issues/42021)。这些问题与 Gonka 无关——等待上游修复。

**对推理用户（Inference User）的建议：**

- **在客户端重写 `tool_call.id`**，转换为标准格式 `functions.<name>:<global_idx>`——这是 Moonshot 官方推荐做法，亦见 `docs/chat-api/troubleshooting.md#reject-duplicate-tool-call-id`（计划中）。替代方案是使用全新 UUID。
- **不要按 ID 去重**——两个相同 ID 的调用可能包含不同结果。丢失即意味着丢失代理的工作成果。
- **提高 `max_tokens`** 以应对包含工具调用的响应；大 `arguments` 对象会迅速触达上限。
- 经纪方返回的通用错误“upstream model provider rejected”通常意味着网关侧拒绝，而非模型本身。应先检查消息内容和 ID 是否重复，再怀疑模型问题（参见 Q4 中经纪方差异）。

**对经纪方（Broker）的建议：**

- 考虑在网关侧按 ID 去重——但需注意两个同 ID 调用可能包含不同结果，更安全的做法是**将 ID 重写为标准格式** `functions.<name>:<global_idx>`（而非删除）。应在客户 FAQ 中记录该模式并链接至 `troubleshooting.md#reject-duplicate-tool-call-id`。**安全提示**：若未仔细验证，简单的按 ID 去重可能成为攻击面。重命名而非删除更安全。
- **用户体验（UX）**：应透传具体的网关错误消息（`"messages[N].tool_calls[M].id is duplicated"`）而非使用通用包装——这能减少代理类客户端的修复时间。**安全提示**：需权衡调试友好性与信息泄露风险——参见 Q4。

### 启用引导解码（guided decoding）能否解决 token 上限问题？

**引导解码与 token 上限无关。** 该机制强制模型按指定 schema（JSON Schema、正则等）生成输出，但不会改变 token 数量。关于上限问题——参见 Q3。

底层 vLLM 字段 `guided_json`、`guided_regex`、`guided_grammar`、`guided_choice` **会被网关以 HTTP 400 拒绝**（锚点 `#reject-guided-decoding` 在 `docs/chat-api/troubleshooting.md`（计划中））。原因在于这些字段绕过了应用于 `response_format` / `structured_outputs` 封套的 xgrammar 边界，而该边界用于缓解 CVE-2025-48944。

**结构化输出的正确字段**

| 字段 | Kimi K2.6 | Qwen3-235B | 说明 |  |
| --- | --- | --- | --- | --- |
| `response_format`（`type: "json_schema"` 或 `"json_object"`） | 支持 |  |  |  |
| `structured_outputs` 封套（`json`/`regex`/`choice`/`grammar`/`structural_tag`/`json_object`） |  |  |  |  |
| 同时使用两者（`response_format` + `structured_outputs`） |  |  |  |  |
**对推理用户（Inference User）的建议：**

- 需要最大跨经纪方和跨模型兼容性——使用 `response_format`（通用支持）。当前 `structured_outputs` 封套被全网拒绝。
- 不要在单个请求中同时使用 `response_format` 和 `structured_outputs`——会导致 HTTP 400。

**对经纪方（Broker）的建议：**

- 引导解码不会提升吞吐量。切勿向客户承诺其可解决 token 上限问题。
- 关注 PR #1215（`StructuredOutputsValidator`）在所有路由的上线进度——Qwen3 用户已在等待 `structured_outputs` 封套以支持正则、choice 和 grammar 工作负载。

### 为何生成速度波动如此剧烈？且为何加速仅作用于推理 token？

速度波动是真实存在的已知开放问题，根源在于三个不同层级。

**
1. 主机级减速/卡顿（host-level）**

一项开放研究任务——[issue #818 “Slow nodes investigation”](https://github.com/gonka-ai/gonka/issues/818)（自 2026 年 2 月起开放，优先级：高）。存在特定模式但尚无根本原因（计划中的 `known-issues.md`，§1“主机接收后无流返回”和 §2“主机产出部分 chunk 后卡顿”——某些情况一分钟后恢复，某些则永不恢复）。

**
2. 路由差异（broker-level）**

连续两次请求可能被分配至负载不同的主机。端到端延迟取决于 `devshard-XXXX-YYY` 主机 ID。在稳定主机上，每 token 生成速度基本保持不变。[¹]

[¹] 示例观察：一次测试中（5 次请求，约 30 秒），端到端延迟导致 `tokens / total_latency` 显示速度范围约为 8–54 tok/s，但该指标包含 TTFT，非正式发布的方差指标。

**
3. 网络级验证窗口（chain-level）**

在 PoC / Confirmation-PoC 事件（cPoC——确认验证者在周期内工作的阶段）期间，部分节点会暂时不可用。在周期边界处，曾存在快照保留节点的问题，导致网关返回 `attempts: []`（该路由无可用主机）——从客户端看即为超时。此效应在提供某模型的节点越少时越明显；在提供者数量少的模型上更为显著。

**“推理比可见输出快”——非优先级机制，而是输出结构所致**

网关并无专为推理 token 设立的快速通道。在 devshard 代码中，`delta.reasoning`、`delta.content`、`delta.reasoning_content`、`delta.tool_calls` 均通过 `sseChunkHasContent` 以相同方式检测。每 token 速度一致。

启用“思考”模式的 Kimi 会先生成大量 `reasoning_content`（数百至数千 token），再生成简短的可见答案（数十至数百 token）。若客户端不显示推理字段，则表现为“沉默片刻后突然爆出答案”。实际上模型一直在生成，只是结果被隐藏了。

**对推理用户（Inference User）的建议：**

- 选择一个公开发布正常运行时间 / p50 TTFT 指标的代理服务。可用的仪表板包括 [gonka.pw](https://gonka.pw/) 和 [meter.gonka.gg](https://meter.gonka.gg/)（可能还有其他，此列表非穷尽）。
- 遇到慢请求时，请记住负载大小：对于短请求，重试可能会路由到不同的节点；而对于持续的大负载（>50k），若落在窗口较小的节点上，则是系统性问题（见 issue #818），仅靠重试可能无效——更好的做法是拆分请求。
- 希望在模型推理过程中看到进展——在 UI 中渲染 `delta.reasoning_content`（或 `delta.reasoning`），例如在一个可折叠区块中。

**对于代理服务（Broker）：**

- 这是整个网络当前最高优先级的共性问题。请向 [issue #818](https://github.com/gonka-ai/gonka/issues/818) 贡献生产环境日志 / 跟踪信息——这将为核心团队提供他们目前缺乏的关键数据。
- 协助实现主机侧改进（分块 gossip 恢复、按 escrow 的 `lastAfterReq` 跟踪——已在计划中的 `host-improvements.md` 及相关 issue 中跟踪）——这些改进直接解决了路由 / 恢复的薄弱环节。

### 为什么速度因硬件而异——B200 更快，H200 更慢？

**速度依赖于硬件——这在异构网络中是正常现象。** 链上的 PoC 权重反映了节点的真实性能（影响验证者的奖励份额），而代理服务的路由机制则从 escrow 中选择可用主机——连续两次请求可能落在不同代际的 GPU 上。

**对于推理用户：** 速度取决于网络中的硬件分布。你无法直接选择硬件——只能选择代理服务。若需要可预测的延迟，请向代理服务询问其默认路由的硬件层级。

**对于代理服务：**

差异的具体来源（基于内部基准测试 [`kaitakuai/experiments`](https://github.com/kaitakuai/experiments) —— 未在 gonka-api.org 或 gonkagate.com 上测量）：

| GPU | 内存 | sm |
| --- | --- | --- |
| The `tags` field in the payload | 内存 |  |
| Schema depth > 16 in `tools[].function.parameters` | sm |  |
| 4×H200 | Qwen3-235B 每实例每分钟生成数（nonces/min） |  |
- **H200 vs H100：** 每 GPU 提升 +13%。芯片相同（sm_90），但 HBM3e
 
+ 141 GB 对比 HBM3
 
+ 80 GB → 允许大模型使用更小的 TP 并加速 KV 缓存。
- **B200/B300 vs H100/H200：** 在 Qwen3-235B FP8 上每 GPU 性能提升约 **3 倍**。
- **Kimi-K2.6 INT4 — 具体数据：** 4×B200 达到 2,240 nonces/min = **~560 每 GPU**（见 `experiments/2026-05/kimi_k26_int4_4xb200_q-int4-k2`）。16×H100 TP 达到 1,389 nonces/min = **~87 每 GPU**（见 `experiments/2026-05/kimi-k26-int4-2x8xh100`）。每 GPU 的差异约为 6 倍；绝对数值上，同一硬件下 Kimi 比 Qwen 更慢（4×B200 Kimi INT4 ~560 每 GPU vs Qwen ~992 每 GPU）。
- **Kimi-K2.6 INT4 在 Blackwell 上的表现：** `VLLM_USE_FLASHINFER_MOE_INT4=1` 显示相比 Marlin 提升 **+138%**（见 `experiments/2026-05/kimi_k26_b300_eager_flashinfer` 中的 A/B 测试）。仅适用于 Blackwell 系列（B100/B200/B300）上的 INT4 MoE 工作负载（内核门控 — `is_device_capability_family(100)`，B300 实际为 sm_103a）。

**追踪与诊断：** 可观测性功能已在 [PR #1046 "Implement dapi & devshard observability"](https://github.com/gonka-ai/gonka/pull/1046) 中合并——增加了 OpenTelemetry 跟踪、Prometheus 指标和仪表板。如果 Grafana 没有每主机的 TTFT 面板，请检查 DAPI / devshard 是否已更新，并确认仪表板已包含在构建中。

其他信息来源：定期更新的仓库 [`kaitakuai/experiments`](https://github.com/kaitakuai/experiments)、来自 [gonka.pw](https://gonka.pw/) 的每主机统计信息，以及 [meter.gonka.gg](https://meter.gonka.gg/) 的网络状态。若想影响硬件分布——可扩大 devshard escrow 中偏好 GPU 的主机规模。

### 为什么模型在 Kilo Code 中无法正确使用工具？

最可能是以下四个原因之一——网关应用了严格的参数白名单和对 JSON Schema 的严格限制。这并非 Kilo 特有：任何编码代理（Cline、Continue.dev、OpenCode 等）都会触发相同原因。

**
1. 硬拒绝（HTTP 400）——需在客户端修复**

| 触发条件 | 原因 | 修复方法 |
| --- | --- | --- |
| 负载中的 `tags` 字段 | `#reject-tags` |  |
| `tools[].function.parameters` 中 Schema 深度 > 16 |  |  |
**
2. 静默转换 / 删除——请求不失败，但行为改变**

| 触发条件 | 网关行为 | 说明 |  |  |
| --- | --- | --- | --- | --- |
| `tool_choice: "required"` | `"auto"` |  |  |  |
| `tools[].function.strict: true` |  |  |  |  |
|  |  |  |  |  |
已知客户端兼容性矩阵：[`docs/chat-api/agents.md`](https://github.com/gonka-ai/gonka/blob/main/docs/chat-api/agents.md)（计划中）。基础工具调用示例：[开发者快速入门 §1.4](https://gonka.ai/developer/quickstart/#4-tool-calling)。

**对于推理用户：**

- **使用 Kilo Code 生成的相同 curl 命令复现问题**（通过客户端调试日志或中间代理捕获）。400 响应体中网关通常会说明被拒绝的字段名；代理服务可能将其掩盖为通用“上游拒绝”——但具体问题字段通常只有一个。
- **对照 `agents.md` 和 `troubleshooting.md` 中的列表交叉检查**（计划中）——大多数 400 错误属于已记录的拒绝锚点（`#reject-tags`, `#reject-enforced_tokens`, `#reject-structured_outputs-kimi`）。
- **若错误信息不明确，快速检查清单：** 检查字段 `tags`, `enforced_tokens`, `plugins`, `strict`, `guided_*`；逐一移除并重发请求。若无改善——检查 Schema 深度（≤16）和节点数（≤256）。
- **若被拒字段未记录——** 在 [gonka-ai/gonka](https://github.com/gonka-ai/gonka) 提交 issue 并附上捕获的请求。

**对于代理服务：**

- 仪表板上缺少 `agents.md` 的链接——添加它是一个低成本的快速改进。
- 若有余力，可就 `gonka-ai/gonka` 中的非标准字段提交 issue——这将帮助整个生态系统的所有代理服务。

### 为何 Hermes 和 OpenClaw 等代理在 Kimi 上无法完成工具任务？

**由三个因素共同导致**

原始 FAQ 提到第四个因素——特殊符号过滤器——但这与安全 / 提示注入有关，而非工具调用失败；其修复已被推迟，因为 Kimi 已能正确处理特殊符号（实证）。

1. **网关默认将一半 `max_tokens` 分配给“思考”阶段**（见 Q1/Q2）。在默认 `thinking_token_budget = max_tokens / 2` 下，模型尚未开始输出工具调用，预算已耗尽。对于工具密集型代理流程，预算在产出有用结果前就已用完。缓解措施——显式设置 `thinking_token_budget: 0`（见 Q2）。这是网关策略，而非模型限制。
2. **输出上限 3,072（实际）/ 4,096（网络上限）对工具密集型输出来说太紧**（Q3）。大型 `arguments` 数据块
 
+ 可见内容容易触及上限。
3. **上游 vLLM 工具解析器 bug**（Q5）：重复的 `tool_calls[].id` 与 `n>1` 冲突（[vLLM PR #21259 — 未验证](https://github.com/vllm-project/vllm/pull/21259)），以及 hermes 解析器在多个工具块上的 `JSONDecodeError` 问题（[vLLM #17790](https://github.com/vllm-project/vllm/issues/17790)）。

构建者痛点链接：[issue #1229](https://github.com/gonka-ai/gonka/issues/1229) —— 长推理链、工具调用兼容性、超出输出限制后的续写被列为代理编码工作流的阻碍因素。

**对于推理用户：**

- **对 Kimi 这是强制要求：** 设置 `"thinking": {"type": "disabled"}`
 
+ `"max_tokens": 4096`（或显式设置 `thinking_token_budget: 0`，见 Q2 的双重保险）。这将释放全部上限用于工具密集型输出。实证：Kimi 可在约 4 秒内单次响应中发出 5 个并行工具调用。
- **在客户端控制 tool_call.id ——** 将其重写为规范格式 `functions.<name>:<global_idx>`（见 Q5），以避免网关因重复 ID 拒绝。
- **控制 Schema ——** 保持深度 ≤16 且节点数 ≤256（见 Q9）。大型输入 Schema 的 MCP 工具可能无法通过。

**对于代理服务：**

- 结合上限提升（Q3 — 通过 `/v1/admin/settings` 设置 per-model `request_max_tokens_cap`）与上述建议——可覆盖网关上代理失败的主要类别。

### OpenCode 无法应用请求的代码更改（句子中途截断）。原因是什么？

三个原因；客户端可绕过其中两个，但无法解决第三个。

1. **大 diff 的 `max_tokens` 截断。** 大型代码补丁无法适应 3,072 的实际上限（Q3）。解决方法：将 diff 拆分为多个工具调用——模型更容易在每次调用中适应预算。
2. **vLLM 在边缘参数下崩溃** —— 一系列 8 个已合并的 PR（#1170, #1171, #1172, #1174, #1180, #1212, #1215, #1216）增强了对导致引擎崩溃字段的防护。在较新的网关（≥ `devshard 0.2.13`）上，大多数已知崩溃场景已被 400 验证器拦截而非直接崩溃。
3. **主机接收后流式中断**（开放中——见计划中的 `known-issues.md` §1）——主机接受了请求但未返回数据块。这是网络层面问题，客户端除重试外无其他解决方法。

**对于推理用户：**

- **对于 Kimi：** 设置 `"thinking": {"type": "disabled"}`
 
+ `"max_tokens": 4096`。大 diff 拆分为多个工具调用。
- **长期：** 关注代理服务的 Q3 上限和 Q5 工具调用 ID 规范格式。

**对于代理服务：** 在面向编码代理客户端的客户 FAQ 中记录“拆分大 diff”模式。

### 是否存在一个在输入输出上均无妥协的模型？

**MiniMax-M2.7** 于 ~2026-05-28 通过链治理升级 v0.2.13 在主网上线——Gonka 的第三个模型。已在两个代理服务上验证运行。澄清：“问题中提到的 Qwen 输出上限 8,192”不准确——所有模型的输出上限相同（3,072 / 4,096，见 Q3），并非模型侧设定。

| 模型 | 原生上下文 | 主网上下文 | 原生思考能力 | 工具调用 |
| --- | --- | --- | --- | --- |
| Kimi-K2.6 | 256K |  |  |  |
| Qwen3-235B-A22B-Instruct-2507-FP8 |  |  |  |  |
| MiniMax-M2.7 |  |  |  |  |
**MiniMax 部署规格（`inference-chain/app/upgrades/v0_2_13/upgrades.go:minimaxGovernanceModel()`）：**

```text
ModelArgs: ["--enable-auto-tool-choice", "--kv-cache-dtype", "fp8",
            "--tool-call-parser", "minimax_m2",
            "--reasoning-parser", "minimax_m2_append_think"]
VRam: 320 GB         ThroughputPerNonce: 5000 (Kimi 1500 — MiniMax ×3.3 higher)
minimaxStartEpoch: 271
HfCommit: d494266a4affc0d2995ba1fa35c8481cbd84294b
```

**MiniMax 与 Kimi/Qwen 的重要区别：**

- **`<think>` 块位于 `delta.content` 中**（不像 Kimi 那样在 `reasoning_content` 中）—— 这是 `minimax_m2_append_think` 解析器的行为。如果你不需要这些标签出现在最终文本中，可在客户端解析它们。
- **工具调用 ID `chatcmpl-tool-<hash>`** —— 其格式本身已具备唯一性，因此无需应用 Q5 中提到的标准化 ID 重写建议。

相关工件：PR #1163 权重缩放（已于 2026-05-13 合并，使经济模型与 Kimi 对齐）；PR [#1226](https://github.com/gonka-ai/gonka/pull/1226)（开放中，尚未合并）—— 在已部署模型基础上进行的网关侧重构，非阻塞性任务。

**对推理用户而言**：MiniMax-M2.7 **现已可用**（gonka-api.org 上的 ID 为 `MiniMaxAI/MiniMax-M2.7`，gonkagate.com 上为 `minimaxai/minimax-m2.7` —— 参见 Q1 中的大小写敏感性说明）。请根据工作负载选择：Kimi 适用于推理+工具调用，Qwen3 适用于长上下文
 
+ 结构化输出，MiniMax-M2.7 是 Kimi 的工具友好型替代方案，具备更高吞吐量。

**对 Broker 而言**：部署已通过 v0.2.13 升级由网络完成。若未提供 MiniMax 服务，请确认 mlnode-image 支持上述部署参数且主机已更新。PR #1226（开放中）将改善用户体验（按模型分发、工具消息格式），但不构成阻塞。

### 为什么没有可用的网页搜索功能？

**这是设计使然 —— Gonka 是一个推理网络**，而非代理框架。插件或网页执行应由客户端的代理层或提供增值服务的 Broker 处理，不应纳入推理路径。

**具体情况**：2026-05-25 我们使用相同的 `plugins` 负载测试了两个 Broker。`gonka-api.org` 会静默移除该字段（返回 HTTP 200，锚点 `#strip-plugins` 在 `docs/chat-api/troubleshooting.md` 中（计划中））；`gonkagate.com` 则以 HTTP 400 `"Plugin config is invalid"` 拒绝该请求。这两种行为均符合网关协议的合理解释：前者倾向于宽松解析（静默移除），后者坚持严格验证（拒绝未知字段）。但在这两种情况下，`plugins` **均未执行**：vLLM 不具备插件执行路径，而简单地透传该字段会暗示后端存在实际并不存在的能力。在不同 Broker 间迁移时，请注意此类差异（详情见 `comparison-brokers.md`（计划中））。

**对推理用户而言**：请在你自己的代理层（如 LangChain、LlamaIndex 或自定义封装）中运行搜索，并在调用 `/v1/chat/completions` 前将结果注入 `messages[].content`。这是所有兼容 OpenAI 接口的标准做法。

**对 Broker 而言**：这是一个差异化机会 —— 提供“我们执行搜索并将结果注入消息”的 Broker 层增值服务是合理的产品策略。你应完全基于 Gonka 实现该功能，无需修改协议。**安全提示**：移除 `plugins` 可能体现的是防滥用策略（而非用户体验缺陷）—— 若你计划将插件执行作为产品提供，请认真考虑这一点。若希望将其作为标准功能推出，请在 [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/discussions) 发起生态讨论。

### 何时将支持可靠的网页抓取？

**按设计，这不在 Gonka 的路线图中**。正确的位置是在边车（side-car）或 Broker 层的增值服务中实现。

**对推理用户而言**：可构建或采购抓取服务（使用 Tavily、Exa、Perplexity API 进行搜索；使用 trafilatura/Readability 进行内容解析），将结果归一化为纯文本，再通过兼容 OpenAI 的接口发送。目前已有大量现成解决方案。

**对 Broker 而言**：若希望作为付费层级提供该功能，请在 [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/discussions) 发起生态讨论，以便社区形成统一规范（例如，一个大家一致部署的边车服务）。

### Context7 文档研究 —— 摘要失败。这是输出 token 限制的问题吗？

与“Kimi 的输入 token 上限为 4k，输出上限为 8,192。何时提升这些限制？”中的问题相同。当前输出限制（实际有效 3,072 / 网络上限 4,096）对于“工具结果体
 
+ 单次响应中的摘要”来说过于紧张。思考过程已启用 —— 其中一半的 token 配额已被占用（参见 Q1/Q2）。

**针对摘要场景的现成负载方案：**

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

- 使用上述 payload 作为模板。`response_format` 会将输出压缩成所需形状，节省预算。
- 如果文档过长并达到上限（`finish_reason=length`）—— 拆分为 N+1 次调用：一次获取+规划，其余为章节摘要；在客户端拼接结果。
- 不要将 `response_format` 与 `structured_outputs` 封套组合使用 —— 否则会返回 HTTP 400（Q6）。
- Schema 限制：深度 ≤ 16，节点数 ≤ 256（Q9）。

**对于 Broker：** 无论您的额度提升策略如何，`response_format` 都是最简单且最通用的缓解方案。一旦 per-model 的 `request_max_tokens_cap` 进入您的管理配置，可考虑为每个客户单独提供额度提升选项。

### Gonka 当前没有 KV 缓存。何时会添加缓存功能？

**简短回答：目前无明确时间表。** Gonka 网关侧已准备就绪 —— 阻塞点在上游 vLLM 侧，[issue #33264](https://github.com/vllm-project/vllm/issues/33264) 已开放超过 4 个月，尚无合并的 PR。在该问题解决前，您请求中的 `prompt_cache_key` 字段将被**静默忽略** —— 请勿包含此字段，以免依赖尚未实现的行为。

vLLM 的前缀 KV 缓存机制运行在每个 ML 节点上。网关级别的 `prompt_cache_key` / `cache_key` 当前也会被静默剥离 —— 此限制受制于一个尚未合并的上游 vLLM PR。

**当前现状**

- **网关行为：** `prompt_cache_key`（OpenAI 标准）和 `cache_key`（Moonshot Kimi 规范）均被静默剥离 —— 均未传递至 vLLM。锚点：`docs/chat-api/troubleshooting.md#strip-prompt_cache_key` 和 `#strip-cache_key`（计划中）。
- **上游阻塞：** vLLM 使用 `cache_salt` 字段实现提示缓存隔离（RFC #16016，PR #17045）。将 `prompt_cache_key` → `cache_salt` 进行别名映射的方案即为自 2026 年 1 月起开放的 [vLLM #33264](https://github.com/vllm-project/vllm/issues/33264)，至今无合并 PR。
- **安全考量：** 若不加隔离地直接转发 `cache_key` 将存在安全隐患 —— 已有[公开的提示缓存时序侧信道攻击（arxiv 2502.07776 PROMPTPEEK）](https://arxiv.org/abs/2502.07776)。网关无法提供虚假的缓存隔离保证。
- **80–90% 的命中率并非 Gonka 的承诺。** 此说法可能是对某些营销材料的误解，或与 OpenAI / Anthropic 原生缓存混淆（后者能保证在单一提供商内实现粘性路由）。

**重要的架构限制**

即使未来 vLLM #33264 被合并，且网关添加了 hash → `cache_salt` 的桥接机制，缓存仍将是**单个 vLLM 实例级别**的。Gonka 的多主机路由意味着两个具有相同 `cache_key` 的请求可能落在不同主机上，其前缀缓存彼此独立。在缺乏粘性路由（目前不存在）的情况下，实现类似 OpenAI 的 ~80% 命中率在架构上极为困难。目前上述三个阻塞点（上游 vLLM PR、网关桥接、粘性路由）均未上线。

**对于推理用户：** 目前无需任何操作 —— `prompt_cache_key` 和 `cache_key` 均为无效操作。请勿依赖这些字段进行成本优化。

**对于 Broker：** 在 vLLM #33264 合并前，无需进行网关侧变更。若希望加速进展 —— 请在该上游 issue 中评论或贡献代码。待合并后，Gonka 网关将添加桥接机制，同时启用两个字段。

### Gonka 网关何时支持 Kimi 的图像输入？

**目前不可用。** 预计在 v0.2.14 或更高版本中上线（当前版本为 0.2.13），无固定日期。多模态 payload（包含 `messages[].content` 与 `type: "image_url"` 或 `"video_url"`）目前在两个公共 broker 上均返回 **HTTP 400**。

**正在进行中，已有计划并分阶段实施。** 计划文档位于 `multimodal-inference-plan.md` 的 `gonka-ai/gonka` 中（约 466 行，6 个阶段 —— ML 节点、主机↔ML 节点、Broker/DAPI、Devshard 协议等）。在文档发布前，通过以下 issue / PR 跟踪更为便捷。

**当前硬性阻塞项**

1. **多模态专用的特殊 token 清洗器。** Kimi-K2.6 聊天模板支持 `image_url` / `video_url` 内容部分，但网关目前仅验证文本内容。多模态 payload（图像 URL、替代文本、元数据）提供了额外的注入攻击面，必须经过验证。安全审查已将其列为第二阶段阻塞项。**目前尚未发布与此特定多模态威胁相关的 CVE；内部追踪正在进行中。**

2. **独立的 VLM 验证审查。** 图像输入的验证方法需要独立确认。相关 issue：[#1026](https://github.com/gonka-ai/gonka/issues/1026)（初步研究：Qwen2-VL-2B F1=100% 中间结果）
+ [#1198](https://github.com/gonka-ai/gonka/issues/1198)（重新验证，开放认领）。

**目标版本：** v0.2.14+，但尚无承诺时间表；受阻于 issue #1198（独立验证，开放认领）。

**当前实证确认：** 包含 `messages[0].content` 数组且含 `{type:"image_url"}` 的请求在 Kimi 和 Qwen3 两条路径上均返回 HTTP 400。网关层面目前不接受多模态输入。

**对于推理用户：** 目前不可用。

**对于 Broker：** 三种方式可加速进展：

1. 认领 issue [#1198](https://github.com/gonka-ai/gonka/issues/1198)（开放认领）—— 独立的 VLM 验证审查是最关键的阻塞项。
2. 审查 PR [#1150 "vlm benchmark"](https://github.com/gonka-ai/gonka/pull/1150)。
3. 当计划的第 1-3 阶段可推进时 —— 准备网关能力注册表（第 3 阶段）；操作员配置将决定您的 broker 支持哪些内容类型。
