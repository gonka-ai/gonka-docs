# 常见问题

## 概览

### 什么是Gonka？
Gonka是一个去中心化的高效AI计算网络——由运行者所拥有和运营。它作为AI模型训练和推理的集中式云服务的低成本高效替代方案。作为一个协议，Gonka并非公司或初创企业。

- 从区块链角度看，Gonka是去中心化AI网络的基础账本和协调层（L1）。它记录余额、交易以及密码学证据，证明Host正确执行了AI任务，而所有实际计算（如推理和训练）均在链下进行。
- 从网络角度看，Gonka是一个由参与者（包括Host和开发者）通过去中心化基础设施互动的完整生态系统。由Gonka区块链驱动，该网络分发任务、验证结果，并仅对可验证的有用工作奖励诚实参与，从而为AI工作负载创建一个具有竞争力且可扩展的环境。

### Gonka解决了什么问题？

Gonka是一个去中心化AI基础设施，旨在减少对集中式云提供商的依赖，并比传统去中心化网络更高效地利用计算能力。其目标是将尽可能多的算力导向有用的AI任务（如推理和训练），同时最小化因共识开销导致的浪费。

### Gonka生态系统中的关键参与者有哪些？

Gonka生态系统有四个关键参与群体：

- 开发者通过利用网络的分布式计算能力来构建和部署AI应用。
- Gonka贡献者参与核心区块链代码库的开发、协议升级、性能优化、安全补丁和新功能集成。
- 持有者持有网络的原生代币，即拥有一个包含GNK代币的Gonka钱包。持有者可以持有代币、转账或出售代币，或根据协议规则将其用于推理等用途。作为持有者并不意味着除标准代币所有权之外的任何义务、责任或治理角色。
- Host向网络贡献计算能力。Host执行推理和其他计算任务，并根据其贡献的计算能力获得相应奖励，前提是保持诚实参与和可靠性。Host构成了网络的骨干。只有Host在网络中拥有投票权。该投票权代表其在治理中的权重，用于提出和投票表决协议决策、参数变更和升级。任何Host都可充当验证者、转账代理和执行者（这些不是预定义或链上角色，而是处理推理请求时承担的动态操作功能）。

### 什么是GNK代币？
GNK是Gonka网络的原生代币。它用于激励参与者、为资源定价，并确保网络的可持续增长。

### 我可以购买GNK代币吗？

原生GNK目前**尚未在任何中心化交易所（CEX）上线**，因此您无法在CEX上购买。请关注官方[Twitter](https://x.com/gonka_ai)公告以获取关于上线的最新信息。

不过，目前有两种合法方式可以获得GNK：

- **作为Host挖矿**。向网络贡献计算资源并直接赚取GNK。参见[作为Host挖矿](https://gonka.ai/host/quickstart/)。
- **在以太坊上购买WGNK并桥接回GNK**。GNK可通过桥接在以太坊上表示为**WGNK**（封装GNK），这是一种在Uniswap等DEX上交易的标准ERC-20代币。您可以在那里购买WGNK，然后[将其桥接回原生GNK](cross-chain-transfers/ethereum-bridge/withdraw-gnk.md)。参见[Ethereum桥接概览](cross-chain-transfers/ethereum-bridge/overview.md)。

!!! note "重要——请验证合约地址"
	GNK在以太坊上的**唯一**官方表示是位于`0x972a7a92d92796a98801a8818bcf91f1648f2f68`的**WGNK**——该地址既是桥接合约也是WGNK ERC-20代币。交易前请务必验证此确切地址，例如在[Uniswap](https://app.uniswap.org/explore/tokens/ethereum/0x972a7a92d92796a98801a8818bcf91f1648f2f68)或[CoinMarketCap](https://coinmarketcap.com/currencies/gonka/)上。其他追踪器和网络上仍存在假冒的GNK列表和页面：任何声称是GNK但在Solana上或使用上述WGNK地址以外其他合约的代币，均**不是**官方GNK资产。请始终通过官方渠道核实信息。

### 该协议为何高效？
Gonka与“大厂”的区别在于其定价机制以及无论Host规模大小推理任务均被平等分配的事实。欲了解更多信息，请查阅[白皮书](https://gonka.ai/whitepaper.pdf)。

### 网络如何运行？
网络的运行是协作性的，取决于您希望承担的角色：

- 作为[开发者](https://gonka.ai/developer/quickstart/)：您可以使用网络的计算资源来构建和部署您的AI应用。
- 作为[Host](https://gonka.ai/host/quickstart/)：您可以贡献您的计算资源来驱动网络。该协议旨在奖励您的贡献，确保网络的持续性和自主性。

### 本文档是否详尽？

不是。本文档涵盖了协议的主要概念、标准工作流程和最常见的操作场景，但并不代表代码库的全部行为或实现细节。代码中包含本文档未描述的额外逻辑、交互和边缘情况。

由于Gonka是一个开源且去中心化的网络，各种参数、机制和由治理驱动的行为可能通过链上投票和社区决策而演变。某些细节可能在发布后发生变化，并非所有边缘情况或未来更新都会立即反映出来。

对于Host、开发者和贡献者而言，代码本身才是最终的真相来源。如果本文档与代码之间出现任何差异，应以代码为准。

建议参与者查阅相关代码库、治理提案和网络更新，以确保其理解与协议当前状态保持一致。

### 贡献计算资源的激励是什么？
我们已创建一份专注于[代币经济学](https://gonka.ai/tokenomics.pdf)的专门文档，您可以在其中找到有关激励机制如何衡量的所有信息。

### 硬件要求是什么？
您可以在文档中清楚地找到最低和推荐的[硬件规格](https://gonka.ai/host/hardware-specifications/)。您应查阅此部分以确保您的硬件满足有效贡献的要求。

### 我可以使用哪些钱包存储GNK代币？
您可以在Cosmos生态系统内的多个支持钱包中存储GNK代币：

- [Keplr](https://www.keplr.app/)
- [Cosmostation](https://cosmostation.io/products/application)
- `inferenced` CLI — 一个用于在 Gonka 中进行本地账户管理和网络操作的命令行工具。

!!! note "现有 Leap 钱包用户请注意"

	如果您之前使用 Leap 钱包创建了您的 Gonka 账户，请注意 [Leap 将于 2026 年 5 月 28 日关闭其所有产品](https://www.leapwallet.io/)，包括浏览器扩展、移动应用和仪表板。

	由于 Leap 是非托管钱包，您的资产和账户仍保留在链上。但为了在 Leap 服务下线后继续访问您的钱包，您应在服务关闭前将现有的恢复短语导入另一个支持的钱包（例如 Keplr）中。

### 我在哪里可以找到有关 Gonka 的有用信息？

以下是了解 Gonka 生态系统的最重要资源：

- [gonka.ai](https://gonka.ai/) — 项目信息和生态系统概览的主要入口。
- [白皮书](https://gonka.ai/whitepaper.pdf) — 描述架构、共识模型、计算量证明（PoC）等的技术文档。
- [代币经济模型](https://gonka.ai/tokenomics.pdf) — 项目代币经济模型概览，包括供应量、分配、激励机制和经济设计。
- [GitHub](https://github.com/gonka-ai/gonka/) — 访问项目的源代码、代码仓库、开发活动和开源贡献。
- [Discord](https://discord.com/invite/RADwCT2U6R) — 社区讨论、公告和技术支持的主要场所。
- [X (Twitter)](https://x.com/gonka_ai) — 新闻、更新和公告。

## 代币经济模型

### Gonka 中的治理权力是如何计算的？
Gonka 使用 PoC 加权投票模型：

- 计算量证明（PoC）：投票权与您已验证的计算贡献成正比。
- 抵押要求：
    - PoC 衍生投票权重的 20% 会自动激活。
    - 要解锁剩余的 80%，您必须锁定 GNK 代币作为抵押品。
- 这确保了治理影响力反映了实际的计算工作和经济抵押。

在前 180 个周期（约 6 个月）内，新参与者可以通过 PoC 参与治理并获得投票权重，无需抵押要求。在此期间，可享有完整的治理权利，而投票权重仍与已验证的计算活动挂钩。

### 为什么 Gonka 要求锁定 GNK 代币以获得治理权力？
投票权从不单纯来自持有代币。GNK 代币用作经济抵押品，而非影响力的来源。影响力是通过持续的计算贡献获得的，而锁定 GNK 抵押品是确保参与治理并加强问责所必需的。

## 抵押品

### 什么是抵押品？
在宽限期（前 180 个周期）结束后，需要抵押品来激活 PoC 权重中可抵押的部分。
宽限期结束后：

- 基础权重（默认为 20%）始终处于激活状态。
- 剩余权重需要 GNK 抵押品才能激活。

抵押品确保拥有治理权重的参与者也承担经济责任。参数在链上定义，并可通过治理进行更改。在做出经济决策前，请始终核实当前数值。

### 抵押品是按节点还是按账户要求的？
抵押品按账户存入。如果多个机器学习节点关联到同一账户，则所需抵押品将根据所有节点的账户总权重计算。

### 我需要存入抵押品吗？
是的，如果您想激活超过基础权重的部分。
如果不存入抵押品，则仅基础权重保持激活状态。

### 需要多少抵押品？
公式：
```
Required Collateral =
Total Weight × (1 - base_weight_ratio) × collateral_per_weight_unit
```
由于 PoC 权重可能在不同周期间波动，存入恰好最低金额可能导致暂时抵押不足。
较小的权重可能经历相对更大的波动。建议在抵押水平仍较小时保留最高达计算最低值 2 倍的缓冲。
```
Recommended (with conservative buffer):
Total Weight × 2 × (1 - base_weight_ratio) × collateral_per_weight_unit
```

### 我可以部分抵押我的权重吗？
可以。您的总激活权重由以下部分组成：

- 基础权重（始终激活）
- 抵押合格权重（根据存入的抵押品比例激活）

如果您存入的金额少于所需全额：

- 基础权重保持完全激活
- 仅对应比例的抵押合格权重被激活
- 剩余部分保持未激活状态

激活权重计算方式为：
```
Active Weight =
Base Weight +
(Deposited Collateral / Required Collateral) × Collateral-Eligible Weight
```

### 如果我没有存入足够的抵押品会怎样？
您的激活权重将按比例减少。由于奖励是根据激活权重按比例分配的，当您抵押不足时，其他节点将获得更大份额的奖励。未激活的权重不会被直接重新分配，它只是不参与共识。

### 抵押品何时生效？
抵押品必须在纪元开始前存入才有效。在纪元期间存入的抵押品：

- 不会立即增加权重
- 从下一个纪元开始生效

无法在纪元中途增加抵押品。

### 我应该使用什么单位存入抵押品？
交易必须使用ngonka，而不是GNK。
```
1 GNK = 1,000,000,000 ngonka
```
示例：
```
10 GNK = 10,000,000,000 ngonka
```

### 抵押品会被罚没吗？
会。以下情况可能导致抵押品被罚没：

- 无效推断
- 停机（确认PoC失败或被监禁）

无效推断的罚没每个纪元最多一次。
停机罚没可能每次监禁事件都适用。

### 被罚没的代币会怎样？
目前，被罚没的GNK将被永久销毁并从流通中移除。未来治理可能会改变此机制。

### 我可以取回抵押品吗？
可以。取回将触发一个解除绑定期（默认：1个纪元）。在解除绑定期间，抵押品仍可能被罚没。解除绑定期结束后，资金将自动返回到您的账户余额。

### 抵押品不是什么

- 抵押品不是投票权。投票权来源于PoC权重，而非代币余额。
- 抵押品不是委托。每个账户必须自行支持其权重。
- 抵押品不是永久锁定。它可以被取回（需经过解除绑定期）。
- 在宽限期（前180个纪元）期间不需要抵押品。

### 每个纪元铸造的奖励如何分配？
每个纪元会铸造固定数量的GNK，并按激活的PoC权重比例分配。
激活权重决定：

- 您在纪元奖励代币中的份额
- 您的治理影响力

如果由于抵押品不足导致您的激活权重降低，则您在纪元奖励中的份额也会相应减少。未激活的权重不会获得奖励。

### 我需要手动存入抵押品吗？
是的。必须通过提交链上交易来存入抵押品。它不会自动激活。如果没有存入抵押品：

- 您的节点将继续正常运行。
- 不会被监禁或禁用。
- 只有基础权重（例如20%）保持活跃。

您的奖励和治理影响力将按比例减少。

### 已归属（锁定）的GNK能否用作抵押品？
不能。抵押品必须从您可用的（未锁定的）GNK余额中存入。尚未释放的已归属代币不能用作抵押品。

## 治理

### 哪些类型的变更需要提交治理提案？
任何影响网络的链上变更都需要提交治理提案，例如：

- 更新模块参数（`MsgUpdateParams`）
- 执行软件升级
- 添加、更新或弃用推理模型
- 任何必须通过治理模块批准并执行的其他操作

### 谁可以创建治理提案？
任何拥有有效治理密钥（冷账户）的人都可以支付所需费用并创建治理提案。然而，每个提案仍需通过PoC加权投票由活跃参与者批准。建议提案人首先在链下讨论重大变更（例如，通过[GitHub](https://github.com/gonka-ai)或[社区论坛](https://discord.com/invite/RADwCT2U6R)），以提高通过的可能性。参见[完整指南](https://gonka.ai/governance/transactions-and-governance/)。

### 如果提案失败会怎样？
- 如果提案未达到法定人数 → 将自动失败
- 如果多数投票为`no` → 提案被拒绝，无链上变更
- 如果有相当比例的投票为`no_with_veto`（超过否决阈值） → 提案被拒绝并标记，表明社区存在强烈反对
- 存款可能退还也可能不退还，取决于链的设置

### 治理参数本身可以更改吗？
可以。所有关键治理规则——法定人数、多数阈值和否决阈值——都是链上可配置的，并可通过治理提案进行更新。这使得网络能够随着参与模式和计算经济变化而演进决策规则。

### 如果我无法访问冷密钥，或希望另一个密钥代表我投票，该怎么办？

如果持有投票权的密钥不是您日常操作使用的密钥，则可以提前授予治理投票权限。

在此设置中：

- 授权者 = 拥有投票权的账户（冷密钥）
- 被授权者 = 将代表授权者提交投票的账户（温密钥）

有两种常见情况：

**1. 您想投票，但无法访问持有投票权的密钥。**

请联系该密钥的所有者，并请求他们授予您的密钥代表其投票的权限。如果没有此授权，您的密钥无法为该投票权提交治理投票。

**2. 您希望另一个密钥代表您投票。**

请从持有投票权的密钥运行以下授权命令。这将授权被授权密钥为您提交治理投票。
此委托仅允许对治理提案进行投票。被授权者仍可为其自己的密钥投票。授权者可随时撤销此权限。

1) 授予投票权限（从授权者密钥运行）
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

2) 验证授权是否存在（可在任意节点上运行）
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

3) 使用被授权账户进行投票
=== "命令"
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

4) 撤销委托（需使用授权账户密钥运行）
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
治理提案 → 链上提案。用于直接影响网络且需要链上投票的变更。例如：

- 更新网络参数（`MsgUpdateParams`）
- 执行软件升级
- 添加新模型或功能
- 任何需要由治理模块执行的修改

改进提案 → 由活跃参与者控制的链下提案。用于规划长期路线图、讨论新想法以及协调重大战略变更。

- 以 Markdown 文件形式管理，存放于 [/proposals](https://github.com/gonka-ai/gonka/tree/main/proposals) 目录
- 通过 GitHub Pull Request 进行评审和讨论
- 获批的提案将被合并到仓库中

### 改进提案如何评审和批准？
社区提案评审的目标是收集社区认可：包括反应、评论和具体反馈，以增强未来获得治理批准的可能性。当提案的实施需要大量工作、长期承诺、协调或对协议进行重大修改时，这一点尤为重要。

- 请先阅读推荐指南：[https://github.com/gonka-ai/gonka/discussions/795](https://github.com/gonka-ai/gonka/discussions/795)。该指南解释了哪些内容适合提交为改进提案，以及如何撰写结构清晰、内容有力的提案。
- 在 [GitHub Discussions](https://github.com/gonka-ai/gonka/discussions) 中发布并讨论改进提案（首选方式）；此前这些提案以 Markdown 文件形式存储在 `/proposals` 目录中。
- 为了帮助社区评估您的提案（并提高其未来在治理流程中获批的几率），提案人有责任积极收集早期反馈和支持信号（如点赞、评论、具体意见）。
	- 将 Discussion 链接分享至 Discord 的 #improvements-proposals 频道以扩大影响力，并通过您可用的其他渠道（包括直接联系 Host/矿工）进一步推广，以获取实际意见和支持。
	- 在提案讨论帖中分享您的背景和专业知识。如果您代表某个团队或公司，请注明并附上相关工作链接，以帮助社区评估可信度并更高效地评审提案。
- 社区评审：
	- 活跃贡献者和维护者将在 [GitHub Discussions](https://github.com/gonka-ai/gonka/discussions) 中讨论提案。讨论可在任何平台进行，但请将关键内容汇总回 [GitHub Discussions](https://github.com/gonka-ai/gonka/discussions)：这有助于将完整历史记录集中保存，便于搜索，也更易于长期维护。GitHub 是唯一可信来源。
	- 请提出问题、提供反馈、建议、优化意见，并为相关提案点赞。每个人在此过程中的关注与参与，对于链的可持续发展至关重要。
- 强烈的正面反馈和大量点赞表明了真实的社区需求，使团队能够将广受好评的提案视为社区驱动路线图的一部分，并有信心启动实施，同时确保社区共识和未来的治理批准。请注意，来自主机（hosts）的反馈至关重要——它可以帮助将项目分解为里程碑、解锁部分赏金支付，甚至从社区资金池中获得资助。但最终，所有链上更新和支付仍需经过治理批准。

### 改进提案能否转化为治理提案？
可以。通常，改进提案用于探索想法并达成共识，之后再起草治理提案。例如：

- 您可以先以改进提案的形式提议集成新模型。
- 在社区达成一致后，再创建链上治理提案以更新参数或触发软件升级。

## 投票 

### 投票流程如何运作？
- 提案提交并达到最低质押金额后，将进入投票期
- 投票选项：`yes`, `no`, `no_with_veto`, `abstain`

    - `yes` → 批准提案
    - `no` → 拒绝提案
    - `no_with_veto` → 拒绝并表示强烈反对
    - `abstain` → 既不批准也不拒绝，但计入法定人数

- 在投票期间，您可以随时更改投票；只有您最后一次的投票会被计入
- 如果达到法定人数和通过阈值，提案将通过并由治理模块自动执行

要进行投票，您可以使用以下命令。此示例为投赞成票，但您可以将其替换为您偏好的选项（`yes`, `no`, `no_with_veto`, `abstain`）：
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
您可以随时使用CLI查询提案状态：
```
export NODE_URL=http://47.236.19.22:18000
./inferenced query gov tally 2 -o json --node $NODE_URL/chain-rpc/
```

## 运行节点

### 如果我想停止挖矿但以后仍想使用我的账户怎么办？
将来恢复网络节点时，只需备份以下内容：

- 冷密钥（最重要，其他所有内容都可以轮换）
- 来自tmkms的密钥：`.tmkms/secrets/`
- 来自`.inference .inference/keyring-file/`的密钥环
- 来自`.inference/config .inference/config/node_key.json`的节点密钥
- 热密钥的密码：`KEYRING_PASSWORD`

### 我的节点被监禁了。这意味着什么？
您的验证者被监禁，因为它在过去100个区块中签名的区块少于50个（要求是该时间窗口内的总签名区块数，而非连续签名）。这意味着您的节点被暂时排除在区块生产之外（约15分钟），以保护网络稳定性。
可能的原因有几种：

- **共识密钥不匹配**。您的节点使用的共识密钥可能与链上为您的验证者注册的密钥不同。请确保您使用的共识密钥与链上注册的验证者密钥一致。
- **网络连接不稳定**。网络不稳定或中断可能导致您的节点无法达成共识，从而导致签名遗漏。请确保您的节点具有稳定、低延迟的连接，并且未被其他进程过度占用。

**奖励**：即使您的节点被监禁，只要它仍活跃于推理或其他验证者相关工作，您仍将继续获得大部分作为Host的奖励。因此，除非检测到推理问题，否则奖励不会丢失。

**如何解除节点监禁**：在问题解决后，使用您的冷密钥提交解除监禁交易以恢复正常运行：

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
当节点被监禁时，会显示`jailed: true`。

### 如何退役旧集群？

请按照本指南安全关闭旧集群，而不影响声誉。

1) 使用以下命令禁用每个ML节点：

```
curl -X POST http://localhost:9200/admin/v1/nodes/<id>/disable
```

您可以使用以下命令列出所有节点ID：

```
curl http://localhost:9200/admin/v1/nodes | jq '.[].node.id'
```

2) 在下一次计算证明（PoC）期间未被安排提供推理服务的节点将自动停止。
被安排提供推理服务的节点将在多运行一个epoch后停止。您可以在以下位置的mlnode字段中验证节点状态：

```
curl http://<inference_url>/v1/epochs/current/participants
```

一旦节点被标记为已禁用，即可安全关闭MLNode服务器。

3) 在所有ML节点被禁用并断电后，您可以关闭网络节点。在此之前，建议（但非强制）备份以下文件：

- `.dapi/api-config.yaml`
- `.dapi/gonka.db`（链上升级后创建）
- `.inference/config/`
- `.inference/keyring-file/`
- `.tmkms/`

如果您跳过备份，仍可使用您的账户密钥在以后恢复设置。

### 我的节点无法连接到 `config.env` 中指定的默认种子节点

如果您的节点无法连接到默认种子节点，只需通过更新 `config.env` 中的三个变量，将其指向另一个种子节点即可。

1. `SEED_API_URL` - 种子节点的 HTTP 端点（用于 API 通信）。
    从以下列表中选择任意 URL，并直接赋值给 `SEED_API_URL`。
    ```
    export SEED_API_URL=<chosen_http_url>
    ```
    可用的 genesis API URL：
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
2. `SEED_NODE_RPC_URL` - 公共 Tendermint RPC 访问必须通过种子节点的 HTTP(S) 代理路径 `/<chain-rpc>`。
使用与 `SEED_API_URL` 中相同的协议（http 或 https）、主机和端口，并附加 `/chain-rpc`。
    ```
    export SEED_NODE_RPC_URL=http://<host>/chain-rpc
    ```
    示例
    ```
    SEED_NODE_RPC_URL=http://node2.gonka.ai:8000/chain-rpc/ 
    ```
!!! note "重要"

	- 不要将 `http://<host>:26657` 用作公共 RPC 端点。
	- 端口 `26657` 必须仅限内部使用（localhost/私有网络）。公共 RPC 必须通过 `/<chain-rpc>` 访问。

3. `SEED_NODE_P2P_URL` - 节点间网络通信使用的 P2P 地址。
您必须通过与 `/<chain-rpc>` 相同的代理访问种子节点的状态端点，以获取 P2P 端口。

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

有两种不同的方式更新种子节点，具体取决于节点是否已经初始化。

=== "选项 1. 手动编辑种子节点（初始化后）"

    一旦文件 `.node_initialized` 被创建，系统将不再自动更新种子节点。
    从那时起：

    - 种子节点列表将被直接使用
    - 任何更改都必须手动完成
    - 您可以添加任意数量的种子节点

    格式为单个逗号分隔的字符串：
    ```
    seeds = "<node1_id>@<node1_ip>:<node1_p2p_port>,<node2_id>@<node2_ip>:<node2_p2p_port>"
    ```
    要查看任何运行中节点的已知对等节点，请使用链的 RPC：
    ```
    curl http://47.236.26.199:8000/chain-rpc/net_info | jq
    ```

    在响应中查找：

    - `listen_addr` - P2P 端点
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

    这将显示节点当前看到的所有对等节点。

=== "选项 2. 重新初始化节点（从环境变量自动应用种子节点）"

    如果您希望节点重新生成其配置并自动应用在 `config.env` 中定义的种子节点，请使用此方法。
    ```
    source config.env
    docker compose down node
    sudo rm -rf .inference/data/ .inference/.node_initialized
    sudo mkdir -p .inference/data/
    ```
    重启节点后，它将表现得像全新安装一样，重新创建其配置，包括从环境变量中获取的种子节点。
    要验证实际应用了哪些种子节点：

    ```
    sudo cat .inference/config/config.toml
    ```
    查找字段：
    ```
    seeds = [...]
    ```

### 硬件、节点权重和 ML 节点配置是如何实际验证的？

该链不会验证真实硬件。它仅验证参与者的总权重，这也是用于权重分配和奖励计算的唯一值。

此权重在各个 ML 节点之间的任何分配，以及任何“硬件类型”或其他描述性字段，都纯粹是信息性的，可由主机自由修改。

创建或更新节点时（例如，通过处理程序代码中的`POST http://localhost:9200/admin/v1/nodes`，如 [https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/server/admin/node_handlers.go#L62](https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/server/admin/node_handlers.go#L62) 所示），可以显式指定 hardware 字段。如果省略该字段，API 服务将尝试从 ML 节点自动检测硬件信息。

实际上，许多主机在代理 ML 节点后运行多个服务器；自动检测只能看到其中一个服务器，这是一种完全有效的设置。无论配置如何，所有权重分配和奖励都仅依赖于主机的总权重，ML 节点之间的内部拆分或报告的硬件类型从不影响链上验证。

### 如何切换到 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、升级 ML 节点以及移除其他模型？
本指南说明了主机应如何根据 v0.2.8 模型可用性的变化以及即将到来的 PoC v2 更新来更新其 ML 节点。从第 155 轮开始，将开始检查 ML 节点配置是否符合 PoC v2 要求。建议主机在此前审查并准备其 ML 节点配置。迁移到 PoC v2 可在第 155 轮之后安排。迁移阶段结束后，不符合配置要求的 ML 节点的权重可能不会被计入。

**1. 背景：模型可用性变更（升级 v0.2.8）**

作为 v0.2.8 升级的一部分，活动模型集已更新。

**支持的模型（活动集）**

仅以下模型仍受支持：

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `Qwen/Qwen3-32B-FP8`

`Qwen/Qwen3-32B-FP8` 在迁移期间受支持，但不贡献于 PoC v2 准备状态或权重分配。参与 PoC v2 需要提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。

**已移除的模型**

所有先前支持的模型均已从活动集中移除，不得再提供。

**2. PoC v2 准备就绪条件（重要）**

成功参与 PoC v2 迁移需要满足以下两个条件：

- 您的所有 ML 节点均提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。这是唯一对 PoC v2 权重有贡献的模型。
- 您的所有 ML 节点均已升级为兼容 PoC v2 的镜像：
    - ghcr.io/product-science/mlnode:3.0.12-post3
    - ghcr.io/product-science/mlnode:3.0.12-post3-blackwell

!!! note "重要"
	- 仅提供正确的模型而不升级 ML 节点是不够的。
	- 当网络切换到单模型配置后，不满足这两个条件的节点将不具备资格。
	- 必须在迁移完成之前完成 ML 节点升级，并在 v0.2.8 升级之后通过单独的治理提案激活 PoC v2。
	- v0.2.8 升级本身不会启用 PoC v2。

**3. 检查 ML 节点分配状态（推荐的安全步骤）**

在更改模型之前，您应检查当前的 ML 节点分配情况。请查询您的网络节点管理 API：
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

- 第一个布尔值：节点在当前epoch是否正在提供推理服务
- 第二个布尔值：节点是否被安排在下一轮PoC中提供推理服务

**推荐行为**

- 建议仅在第二个值为`false`的节点上更改模型
- 在PoC v2行为仍在观察期间，这可以降低风险
- 鼓励跨多个epoch逐步 rollout

**4. 为ML节点更新模型：仅保留支持的模型**

预先下载模型权重（推荐）。为避免启动延迟，请提前将权重下载到`HF_HOME`中：
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
通过Admin API应用的更改将在下一个epoch生效（[https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)）

!!! note 
	`node-config.json`仅在首次启动网络节点API或本地状态/数据库被删除时使用。如需重新开始，请编辑此值。对于已有节点，应通过Admin API执行模型更新。

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
应用更改并重启服务。从`gonka/deploy/join`执行：
```
source config.env
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml pull
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d
```
**6. 验证模型服务（将在下一个epoch生效）**

确认ML节点仅提供`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`服务，这是PoC v2权重和未来权重分配所使用的唯一模型：
```
curl http://127.0.0.1:8080/v1/models | jq
```
可选：重新检查节点分配：
```
curl http://127.0.0.1:9200/admin/v1/nodes
```
!!! note "治理与PoC v2激活说明"

	PoC v2将分阶段引入，不会一次性激活。

	**阶段1. 观察（v0.2.8升级后的当前状态）**

	v0.2.8升级后，PoC v2逻辑已就绪，但尚未用于权重分配。

	此阶段期间：

	- 节点可提供`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`或`Qwen/Qwen3-32B-FP8`服务
	- 节点必须将其ML节点切换为提供`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`服务，并升级至支持PoC v2的版本，才能参与PoC v2权重计算。
	- 网络将观察采用情况，以评估节点对PoC v2权重的准备程度。

	**阶段2. 治理提案（可选，未来）
	当活跃节点中达到足够高的采用率（约50%）时：**

	- 可能会提交单独的治理提案
	- 该提案可能请求批准激活PoC v2并将其用于权重分配

	采用阈值仅为观察性指标，不会触发任何自动变更。

	**阶段3. 激活（仅在治理批准后）**

	仅当链上治理提案获得批准后，PoC v2才会成为活跃的权重分配方式。

	在该提案获批前：

	- PoC v2仍不会用于权重分配
	- 现有的PoC机制将继续用于确定权重

**摘要清单**

在激活 PoC v2 之前，请确保：

- ML 节点提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 所有其他模型已从配置中移除
- ML 节点镜像为 `3.0.12-post3`（或 `3.0.12-post3-blackwell`）

## 密钥与安全

### v0.2.9 升级后创建的热密钥应使用哪个 CLI 版本？

对于授予 v0.2.9 升级后创建的新热密钥权限，应使用 CLI [版本 v0.2.9](https://github.com/gonka-ai/gonka/releases/tag/release/v0.2.9)。

### 我在哪里可以找到有关密钥管理的信息？
您可以在文档中找到关于[密钥管理](https://gonka.ai/host/key-management/)的专门章节。其中概述了在网络中安全管理应用程序密钥的流程和最佳实践。

### 我清除或覆盖了我的共识密钥

如果您正在使用 **tmkms** 并删除了 `.tmkms` 文件夹，只需重新启动 **tmkms** —— 它将自动生成一个新密钥。
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
在服务器之外的本地设备上备份 **冷密钥**。

1) 停止 API 容器：
    ```
    docker compose down api --no-deps
    ```

2) 在您的 `config.env` 文件中为热密钥设置 `KEY_NAME`。

3) [服务器]：重新创建热密钥：
    ```
    source config.env && docker compose run --rm --no-deps -it api /bin/sh
    ```

4) 然后在容器内执行：
    ```
    printf '%s\n%s\n' "$KEYRING_PASSWORD" "$KEYRING_PASSWORD" | \
    inferenced keys add "$KEY_NAME" --keyring-backend file
    ```

5) [本地]：在您备份了冷密钥的本地设备上运行交易：
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

## 计算证明 (PoC)

### 什么是计算证明？

计算证明 (PoC) 是一种共识机制，它用可验证的基于 Transformer 的计算能力取代了基于资本或哈希的权重。它定义了如何测量真实的 AI 计算并将其转换为治理和共识权重。PoC 通过在每个纪元结束时发生的短暂同步 Sprint 执行。在 Sprint 之外，纪元用于现实世界的 AI 计算。实际上，“计算证明 (PoC)”和“Sprint”这两个术语经常可以互换使用。当提到“下一次 PoC”或“PoC 阶段”时，通常指的是下一个 Sprint，即计算证明的执行阶段。

### 什么是 Sprint？

Sprint 是计算证明的一个阶段。在 Sprint 期间，所有主机同时在具有随机化层的 Transformer 上运行与 AI 相关的推理，处理一连串的随机数并生成输出向量。主机在下一纪元的投票权与其处理的随机数数量成正比，前提是报告的输出是由所需的 Sprint 模型可验证地生成的。

### 如何模拟计算证明 (PoC)？

您可能希望在 ML 节点上自行模拟 PoC，以确保当链上 PoC 阶段开始时一切正常。

要运行此测试，您需要有一个尚未注册到 API 节点的运行中 ML 节点，或者暂停 API 节点。要暂停 API 节点，请使用 `docker pause api`。测试完成后可以取消暂停：`docker unpause api`。

对于测试本身，您将向 ML 节点发送 POST `/v1/pow/init/generate` 请求，这与 API 节点在 PoC 阶段开始时发送的请求相同：
[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32)

PoC 使用以下模型参数：[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41)

如果您的节点处于 `INFERENCE` 状态，则需要先将节点转换为停止状态：

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
将此请求发送到 ML 节点代理容器的 `8080` 端口，或直接发送到 ML 节点的 `8080` [https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/deploy/join/docker-compose.mlnode.yml#L26](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/deploy/join/docker-compose.mlnode.yml#L26)

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
然后服务将开始向 `DAPI_API__POC_CALLBACK_URL` 发送生成的随机数。
```
2025-08-25 20:54:58,822 - pow.service.sender - INFO - Sending generated batch to http://api:9100/
```
如果暂停了 API 容器，或者 ML 节点容器与 API 容器未共享相同的 Docker 网络，则 http://api:9100 地址将不可用。可能会看到错误消息提示 ML 节点未能发送生成的批次。关键是要确保生成过程正在发生。

### 确认比率为 0 是什么意思？如果发生这种情况我该怎么办？

0% 的确认比率是一种异常情况，表示在纪元期间没有随机数从您的 API 节点发送，意味着该节点完全没有参与确认计算证明 (CPoC)。要调查此问题，请检查 API 节点日志和 ML 节点日志，它们应能说明为何未提交随机数。

可能的原因包括：

- API 节点配置错误或宕机
- 允许访问机器学习节点的公开暴露的管理或管理端口
- 共识节点落后于链，可能导致参与PoC超出允许的时间窗口
- 机器学习节点驱动程序故障

为缓解此风险，请确保管理端口和管理端口不可公开访问，验证API节点是否正在运行并正确配置，监控共识节点同步，并为机器学习节点和驱动程序故障设置警报。

## 性能与故障排查

### 如何使用代理预发布版本（v0.2.8）保护我的节点免受DDoS攻击？

新版本代理已发布，包含速率限制和DDoS防护措施。

新增内容：

- 对API/RPC端点进行速率限制，以防止过度请求影响网络节点
- 阻止资源密集型内部路由，如 `training` 和 `poc-batches`
- 可选禁用 `/chain-api`、`/chain-rpc` 和 `/chain-grpc` 端点

**更新说明****步骤1**：更新代理镜像
```
sed -i -E 's|(image:[[:space:]]*ghcr.io/product-science/proxy)(:.*)?$|\1:0.2.8-pre-release-proxy@sha256:6ccb8ac8885e03aab786298858cc763a99f99543b076f2a334b3c67d60fb295f |' docker-compose.yml
```
!!! note "重要"
	步骤2将在此节点上禁用 `/chain-api`、`/chain-rpc` 和 `/chain-grpc` 端点。应用后，此节点将不再提供公共RPC流量。如果您运营公共RPC端点，则必须运行单独的仅RPC节点（无这些限制），并保持此节点为私有。

	**步骤2（可选）**：禁用 `chain-api`、`chain-rpc` 和 `chain-grpc`

	如果您想完全禁用 `/chain-api`、`/chain-rpc` 和 `/chain-grpc` 端点：
```
sed -i 's|DASHBOARD_PORT=5173|DASHBOARD_PORT=5173\n      - DISABLE_CHAIN_API=${DISABLE_CHAIN_API:-true}\n      - DISABLE_CHAIN_RPC=${DISABLE_CHAIN_RPC:-true}\n      - DISABLE_CHAIN_GRPC=${DISABLE_CHAIN_GRPC:-true}\n|' docker-compose.yml
```
禁用最近攻击所使用的训练URL：
```
sed -i -E -e '/GONKA_API_(EXEMPT|BLOCKED)_ROUTES/d' -e 's|(- GONKA_API_PORT=9000)|\1\n      - GONKA_API_EXEMPT_ROUTES=chat inference\n      - GONKA_API_BLOCKED_ROUTES=poc-batches training|' docker-compose.yml
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
**步骤3：** 拉取并重启代理
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull proxy
source ./config.env && docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d --no-deps proxy
```
**步骤4：** 关闭外部端口26657

您可以将端口26657作为外部端口关闭。

此操作是可选的，但强烈推荐：
```
sed -i 's|- "26657:26657"|#- "26657:26657"|g' docker-compose.yml
```
这将注释掉节点容器中的端口映射：
```
node:
    container_name: node
    ...
    ports:
      - "5000:26656" #p2p
      #- "26657:26657" #rpc
```
**步骤5：** 重启节点：
```
source ./config.env && docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d --no-deps node
```
**关闭端口26657后访问节点状态**

如果您之前使用 `curl -s http://localhost:26657/status` 访问节点状态，现在可以从容器内部访问：

=== "选项1：从代理容器访问（使用 `curl`）"

	```
	docker exec proxy curl -s node:26657/status | jq
	```
=== "选项2：从节点容器（使用`wget`）"

	```
	docker exec node wget -qO- http://localhost:26657/status | jq
	```

使用`watch`进行持续监控：
```
watch -n 5 'docker exec node wget -qO- http://localhost:26657/status | jq -r ".result.sync_info | \"Block: \(.latest_block_height) | Time: \(.latest_block_time) | Syncing: \(.catching_up)\""'
```

### Cosmovisor更新需要多少可用磁盘空间？如何安全地从`.inference`目录中删除旧备份？
Cosmovisor在执行更新时会在`.inference`状态文件夹中创建完整备份。例如，你会看到类似`data-backup-<some_date>`的文件夹。
截至2025年11月20日，数据目录的大小约为150 GB，因此每次备份将占用大约相同的空间。
为了安全地执行更新，建议至少有250+ GB的可用磁盘空间。
你可以删除旧的备份以释放空间，但在某些情况下这可能仍然不足，你可能需要扩展服务器磁盘。
要删除旧的备份目录，可以使用：
```
sudo su
cd .inference
ls -la   # view the list of folders. There will be folders like data-backup... DO NOT DELETE ANYTHING EXCEPT THESE
rm -rf <data-backup...>
```

### 如何防止NATS内存无限制增长？

目前NATS被配置为无限期存储所有消息，这会导致内存使用持续增长。
推荐的解决方案是为两个NATS流中的消息配置24小时的生存时间（TTL）

1. 安装NATS CLI。按照此处的说明安装Golang：[https://go.dev/doc/install](https://go.dev/doc/install)。然后安装NATS CLI：
   ```
   go install github.com/nats-io/natscli/nats@latest
   ```
2. 如果你已经安装了NATS CLI，请运行：
    ```
    nats stream info txs_to_send --server localhost:<your_nats_server_port>
    nats stream info txs_to_observe --server localhost:<your_nats_server_port>
    ```
### 如何更改`inference_url`？

在以下情况下，你可能需要更新你的`inference_url`：

- 你更改了API域名；
- 你将API节点迁移到了新机器；
- 你重新配置了HTTPS/反向代理；
- 你正在迁移基础设施，并希望将Host条目指向新的端点。

此操作不需要重新注册、重新部署或密钥重新生成。更新`inference_url`通过与初始注册相同的交易完成（即`submit-new-participant msg`）

链逻辑会检查你的Host（参与者）是否已存在：

- 如果参与者不存在，则交易将创建一个新的；
- 如果参与者已存在，则仅允许更新三个字段：`InferenceURL`、`ValidatorKey`、`WorkerKey`。

所有其他字段将自动保留。

这意味着更新`inference_url`是一个安全的、非破坏性操作。

!!! note 

    当节点更新其执行URL时，新URL会立即对来自其他节点的推理请求生效。然而，记录在`ActiveParticipants`中的URL直到下一个epoch才会更新，因为提前修改会破坏与参与者集合相关的加密证明。为避免服务中断，建议在下一个epoch完成之前同时保持旧URL和新URL的运行。

    [本地] 使用你的冷密钥在本地执行更新：
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
通过访问以下链接并用你的节点地址替换结尾来验证更新 [http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/participant/gonka1qqqc2vc7fn9jyrtal25l3yn6hkk74fq2c54qve](http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/participant/gonka1qqqc2vc7fn9jyrtal25l3yn6hkk74fq2c54qve)

### 为什么我的`application.db`变得如此之大，以及如何修复？

一些节点存在`application.db`大小不断增长的问题。

`.inference/data/application.db`存储链的状态历史（而非区块），默认保留362880个状态。

状态历史包含每个状态的完整Merkle树，将其保留更短的时间是安全的。例如，仅保留1000个区块。

修剪参数可以在`.inference/config/app.toml`中设置：

```
...
pruning = "custom"
pruning-keep-recent = "1000"
pruning-interval    = "100"
```

新配置将在重启`node`容器后生效。但存在一个问题——即使启用了修剪，数据库清理也非常缓慢。

有几种方法可以重置`application.db`：

=== "选项1：从快照完全重新同步"

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

=== "选项2：从本地快照重新同步"

快照默认启用并存储在`.inference/data/snapshots`中

1) 准备新的`application.db`（`node`容器仍在运行）

    1.1) 为`inferenced`准备临时主目录
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

    1.4) 从快照开始恢复（`node`容器仍在运行） 
        ```
        inferenced snapshots restore <INSERT_HEIGHT> 3  --home .inference/temp
        ```

    这可能需要一些时间。完成后，你将在`.inference/temp/data/application.db`中获得新的`application.db`

    2) 用新的替换`application.db`

    2.1) 停止`node`容器（从另一个终端窗口） 
        ```
        docker stop node
        ```

    2.2) 移动原始的`application.db` 
        ```
        mv .inference/data/application.db .inference/temp/application.db-backup
        mv .inference/wasm .inference/wasm.db-backup
        ```

    2.3) 用新的替换它 
        ```
        cp -r .inference/temp/data/application.db .inference/data/application.db
        cp -r .inference/temp/wasm .inference/wasm
        ```

    2.4) 启动`node`容器（从另一个终端窗口）： 
        ```
        docker start node
        ```

    3) 等待`node`容器同步完成并删除`.inference/temp/`

    如果你有多个节点，建议逐个清理。

=== "选项3：实验性"

    另一种选择是在单独的CPU专用机器上启动一个独立的`node`容器实例，并以严格验证器模式进行设置：

    - 保留非常短的历史记录
    - 仅允许`api`容器访问RPC和API

    一旦运行起来，将现有的`tmkms`卷移动到新节点（首先在现有节点上禁用区块签名）。

    这是该方法的基本思路。如果你决定尝试并且有任何问题，请随时在[Discord](https://discord.com/invite/RADwCT2U6R)上联系我们。

=== "选项4：升级至修剪修复版本"

	现已提供修复，解决长期存在的问题：在多种修剪配置下`application.db`持续增长。
	此改进由[Lelouch33](https://github.com/Lelouch33)贡献，并包含在发布版本[`0.2.10-post6`](https://github.com/gonka-ai/gonka/compare/main...release/v0.2.10-post6)中。通过更新后的逻辑和以下设置，`application.db`可保持在约100 GB左右：

	- `SNAPSHOT_INTERVAL=1000`
	- `SNAPSHOT_KEEP_RECENT=2`
	- `pruning-keep-recent = "20000"`
	- `pruning-interval = "512"`

	参考：

	- [https://github.com/gonka-ai/gonka/issues/819#issuecomment-3996332369](https://github.com/gonka-ai/gonka/issues/819#issuecomment-3996332369)
	- [https://github.com/gonka-ai/gonka/pull/867](https://github.com/gonka-ai/gonka/pull/867)

	升级到此二进制文件后，将在下一个快照区块后开始修剪。此过程相对较重，可能会在删除旧状态历史时暂时减慢`node`容器的速度。

	为了减少操作影响，建议逐个节点应用更新，并使用较高的`pruning-interval`，例如`512`，以避免过于频繁地进行修剪。

	如果节点在修剪期间显著变慢，重启节点容器可能有助于其追上进度。

	建议在即将发布的v0.2.11升级之前应用此更新，以防止大量节点同时开始修剪。

	应用更新（以`v0.2.7`为例，其具有相同的`inferenced`）：
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

### 自动`ClaimReward`未成功执行，我该怎么办？

如果你有未领取的奖励，请执行：
```
curl -X POST http://localhost:9200/admin/v1/claim-reward/recover \
    -H "Content-Type: application/json" \
    -d '{"force_claim": true, "epoch_index": 106}'
```
要检查是否有未领取的奖励，可以使用：
```
curl http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/epoch_performance_summary/106/<ACCOUNT_ADDRESS> | jq
```

## 升级

### 升级v0.2.12：升级前模型清理

!!! note "重要"
	此清理过程**必须在升级之前完成**。如果你在清理模型之前升级，你的节点将被拒绝并下线。

	版本 0.2.12 移除了所有不在升级后批准列表中的治理模型。在主网上，仅之前强制执行的模型和 Kimi 将被保留。

	每个 DAPI 在本地持久化其 MLNode 配置。启动时，它会根据链上治理列表验证每个已配置的模型。如果配置中包含至少一个不支持的模型，则整个节点将被拒绝，主机将下线。

	版本 0.2.11 通过将运行时视图裁剪为强制执行的模型来掩盖此问题，因此即使持久化配置中仍包含额外模型，`/admin/v1/nodes` 仍显示为干净状态。版本 0.2.12 停止了这种裁剪，意味着持久化配置将被直接加载。

	为解决此问题，以下脚本会查找 `/admin/v1/config` 中包含额外模型的每个节点，并向 `/admin/v1/nodes/<id>` 发送包含清理后配置的 `PUT` 请求。这些更改将在 60 秒内持久化。保留剩余模型的参数、硬件和端口不变。未列出强制执行模型的节点将被跳过，需手动修复。

	将以下脚本粘贴到主机的 shell 中。默认情况下，它将应用更改。若要预览更改而不实际应用，请设置 `APPLY=dry`（或任何非 `--apply` 的值）。

	仓库中的脚本：

- [Bash](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/proposals/governance-artifacts/update-v0.2.12/cleanup/cleanup_models.sh)
- [Python](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/proposals/governance-artifacts/update-v0.2.12/cleanup/cleanup_models.py)。

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



### 升级 v0.2.12：预下载二进制文件

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

## 赏金计划

### 什么是赏金计划？谁可以参与？奖励如何支付？

参与并不需要成为 Host：许多赏金授予提交修复、实现改进或贡献于更广泛 Gonka 基础设施的贡献者。

奖励在经过治理批准后从社区资金池中支付。漏洞报告尤其受到重视，有助于防止漏洞利用并提高网络安全性的负责任披露也有资格获得赏金。

最终的赏金决定、金额和类别始终由社区治理决定。

### 漏洞赏金定价模型是什么？

评估严重性的一种常见方式是： 
```
Risk = Impact × Likelihood
```
影响从网络角度进行评估（高/严重级别需要对整个网络产生影响）。仅影响单个参与者的漏洞通常上限为低或中等。

**影响级别**

| 级别 | 描述 | 示例 |
|----------|--------------------------------------|--------------------------------------------------------------------------|
| 严重 | 对整个网络造成灾难性影响 | 完全网络控制劫持 |
| 高 | 大规模显著干扰 | 网络崩溃/停止；模块资金被盗；所有参与者奖励错误 |
| 中 | 中等程度干扰，范围有限 | 共识或奖励完整性面临风险；单个参与者资金或可用性受影响 |
| 低 | 对孤立参与者影响轻微，无链上影响 | 单个组件、对单个参与者轻微影响、非链上 |

**可能性**

- **自然发生 — 非故意；** 在正常条件下发生。通过概率估算（条件触发频率、使用模式）。
- **故意 — 获利性** — 为经济利益而利用。当收益大且成本/复杂度低时，可能性更高。
- **故意 — 恶作剧** — 为制造干扰而利用。当具有全网影响且成本低时可能性更高；针对单个参与者的恶作剧 → 可能性较低。

**风险矩阵**

| 影响 \ 可能性 | 高 | 中 | 低 |
|---------------------|----------|----------|---------------|
| 严重 | 严重 | 严重 | 高 |
| 高 | 严重 | 高 | 中 |
| 中 | 高 | 中 | 低 |
| 低 | 中 | 低 | 信息性 |

### 如何开始参与悬赏计划？

- 可以创建一个新的 GitHub issue/讨论来提议改进，并获得社区反馈以确定是否值得实施。
- 或者选择一个[标记为 up-for-grabs 的现有 issue](https://github.com/gonka-ai/gonka/issues?q=is%3Aissue%20state%3Aopen%20label%3Aup-for-grabs)。在开始之前，请留下简短评论说明工作已启动，并包含大致的预计完成时间（ETA），以便其他人了解情况并避免重复工作。

### 建议的漏洞报告流程是什么？

- 如果问题的严重性不高或不严重（影响有限，无网络范围影响）且修复工作量较小，通常可以直接提交 PR。
- 如果问题属于高或严重级别，请私下报告给可信的社区成员（长期的 Gonka 仓库贡献者），可以作为报告提交，或连同修复一起放在私有 fork 中提交。
- 如果某个问题看起来属于更广泛的一类问题，并且系统性审查可能会发现更多同类问题，请留下备注说明计划进行审查。这有助于避免并行重复审查。

要参与贡献，请选择一个问题，提交可靠的修复，并在相关的开发频道中分享链接以获取反馈。

### 在哪里可以查看谁获得了悬赏，因何事以及何时获得？

最可靠的来源是链上记录和 [GitHub](https://github.com/gonka-ai/gonka/)。请将它们作为谁获得了付款、悬赏内容以及执行时间的主要事实依据。

## 错误

### `No epoch models available for this node`

在这里可以找到节点日志中可能出现的常见错误和典型日志条目的示例。

```
2025/08/28 08:37:08 ERROR No epoch models available for this node subsystem=Nodes node_id=node1
2025/08/28 08:37:08 INFO Finalizing state transition for node subsystem=Nodes node_id=node1 from_status=FAILED to_status=FAILED from_poc_status="" to_poc_status="" succeeded=false blockHeight=92476
```
这实际上不是错误。它只是表示你的节点尚未被分配模型。很可能是因为你的节点尚未参与Sprint，未获得投票权，因此还没有分配模型。
如果你的节点已经通过了PoC，你应该不会再看到此日志。如果没有，PoC大约每24小时进行一次。

### 从状态同步快照启动时如何修复`err="no validator signing info found"`？

如果在从状态同步快照启动期间周期性地遇到`err="no validator signing info found"`，通常与Cosmos SDK的`iavl-fastnode`行为有关。一个安全的变通方法是在初次启动时禁用`fastnode`，然后（可选）在节点完全同步后重新启用它。

**修复方法（Docker）：**

1.	停止节点：
```
docker stop node
```
2. 在`.inference/config/app.toml`中设置：
```
iavl-disable-fastnode = true
```
3. 启动节点：
```
docker start node
```
重启后，问题应不再出现。

!!! note 
	`main`包含v0.2.10-post6。从该版本开始的节点会自动应用此设置，因此通常不需要手动更改。

## 推理 

### 为什么4,096输出令牌限制会导致模型在思考过程中卡住——返回零令牌？

**如果你遇到以下情况**

- 你看到`content=null`和`finish_reason=length`。
- 模型处于“静默”状态——使用情况显示有令牌，但没有文本输出。
- 带有`max_tokens=100`的探测请求返回空内容。

**优先修复：Kimi-K2.6的有效配置**

如果你没有时间深入排查——可以复制此负载作为起点。截至2026-05-28，它在两个公共broker上有效；使用前请与你的broker运营商确认是否仍然适用。

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

为什么是这些特定字段：

- `max_tokens: 4096` —— 给模型分配全部可用的输出配额。目前broker上的实际限制是3,072（见Q3）—— 超过此值无意义。最小值为256，否则网关可能会将`thinking_token_budget`强制设为零。
- `thinking: {"type": "disabled"}` —— 通过聊天模板提示禁用隐藏思考。
- `thinking_token_budget: 0` —— 双重保险：在生成参数级别显式将配额设为零（见Q2）。
- **模型ID区分大小写：** `moonshotai/Kimi-K2.6`（大写K）在`gonka-api.org`上，`moonshotai/kimi-k2.6`（小写k）在`gonkagate.com`上。如果收到404——请切换大小写。请与`GET /v1/models`响应进行核对。

现成可用的curl命令（替换`<broker>`和模型ID的大小写）：

```bash
curl -sS https://<broker>/v1/chat/completions \
  -H "Authorization: Bearer $GONKA_API_KEY" \
  -H "Content-Type: application/json" \
  -d @payload.json
```

如果返回了有意义的文本——问题出在你原始的负载中；请逐个字段比对。如果`content=null`——请捕获响应中的`id`并发送给broker的支持团队。

**首先检查你的broker上规则是否已激活**

网关行为取决于broker且随时间变化。运行此测试：

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
| `devshard ≥ 0.2.13`（force-zero-below-256已激活） | `finish_reason="length"`, ~0–10推理令牌 |
| 较早版本 | `finish_reason="length"`, ~40–60推理令牌（默认`max_tokens / 2`） |

以下规则描述了最近的网关代码（`devshard ≥ 0.2.13`）。你的broker可能尚未更新。不确定版本？——运行上面的优先修复。如果能返回有意义的文本，则网关版本足够新。如果不行——将`response.id`发送给broker支持并询问更新事宜。

**模型和网关侧发生的情况****Kimi-K2.6的特性。** 模型会输出`<think>…</think>`块。**两个部分（`<think>`和可见内容）均等消耗`max_tokens`。** 当`max_tokens`较小时，模型会在`<think>`内部耗尽全部配额，仅返回`</think>`，而vLLM会将其作为特殊令牌剥离 → `content=null`, `finish_reason=length`。从客户端来看——“0令牌。”

**网关对`thinking_token_budget`的规则（PR #1202, devshard 0.2.13+）：**

| 条件 | 网关的行为 |
|---------|---------------------|
| `max_tokens < 256` | `ttb = 0`（强制归零，覆盖客户端） |
| `ttb` 未设置，`max_tokens >= 256` | `ttb = max_tokens / 2` |
| `ttb` 由客户端设置 | 使用客户端的值 |
| 始终 | clamp：`ttb ≤ 96,000` 和 `ttb ≤ max_tokens − 64` |

此外：

- **`max_tokens` 下限 → 16**（PR #1227）—— 此前 `max_tokens=1` 可靠地生成 `content=null`。现在它被静默提升至 16。
- **`thinking: {"type":"disabled"}` mirror**（PR #1224）—— 网关将其镜像到 `chat_template_kwargs.thinking=false` 中。Kimi 聊天模板读取该 kwarg。

历史上产生 `content=null`（`max_tokens=1`，探测形状 `max=100, min=100, ttb=50`）的场景现在通过最近的网关返回非空内容。在 `gonkagate.com`（2026-05-25）上，没有 `ttb` 的 `max_tokens=100` 返回了约 50 个推理 token —— 该处未启用 force-zero-below-256。

**对推理用户：**

- 请针对网关 ≥ 0.2.13（2026-05-23+ 发布版）的代理重新测试。
- 若看到零 token —— 从响应中捕获 `id` 并发送给代理。提取方法：

  ```bash
  curl ... | jq .id
  ```

  格式：`devshard-<short>-<short>`，例如 `devshard-7a4f-31b2`。发送位置：代理的支持渠道（对于 `gonka-api.org` — 网站上的支持链接；对于 `gonkagate.com` — `/contact` 部分）
- **不要仅依赖 `thinking:disabled`** —— 为安全起见，显式设置 `thinking_token_budget: 0`（见 Q2）。

**对代理：** 对于低于 0.2.13 的版本 —— 按照您的验证/发布节奏更新（无需紧急：旧版本客户端和托管规则需要重新资格认证）。在更新前，客户端应用上述变通方案；在 `devshard-0.2.13` 之后，零输出的 `content=null` 情况将消失。

### 使用 Kimi K2，整个 token 限制都可以用于思考而无实际输出。这是输出限制、带宽还是上游问题？

**这是网关策略，而非模型限制。** `thinking_token_budget` 解析器（PR #1202）默认为推理分配 `max_tokens / 2`。对于工具密集型流程，预算会在任何有用输出之前耗尽。缓解方法是显式设置 `thinking_token_budget: 0` 或 `thinking: {"type": "disabled"}`（网关通过 PR #1224 将其镜像到 `chat_template_kwargs`）。模型只是遵守预算。

与 Q1 原因相同 —— 模型将 `max_tokens` 在 `<think>` 和可见内容之间拆分。这不是带宽问题，也不是输出限制。

**两种逃生机制**

1. **`thinking: {"type": "disabled"}`** —— 网关将其镜像到 `chat_template_kwargs.thinking=false`（Kimi 聊天模板读取 kwarg）并移除顶层的 `thinking`。接受 `"adaptive"` 和 `"auto"`（Claude Code CLI / Anthropic SDK 预设，PR #1224）—— 两者都解析为 `enabled`。
2. **`thinking_token_budget: 0`** —— 显式的零值直接作为生成参数传给 vLLM，并可靠地将思考预算归零。

**重要细节：** 这两种机制在不同层级工作（聊天模板提示 vs. 生成参数），互不重叠。`thinking:disabled` 不会自动将 `thinking_token_budget` 归零 —— 在默认 `max_tokens=4096` 且仅设置 `disabled` 的情况下，模型仍会从网关解析器获得隐藏的 `ttb=2048`。我们的测试显示，即使在推理密集型提示下，Kimi 也遵守了 `thinking:disabled`。模型文档（计划中的 `docs/chat-api/kimi-k2.6.md`）警告在某些推理场景中模型可能忽略提示 —— 我们未能复现，但仍建议对冲风险。**双保险：** 对于关键流程，同时发送两个参数。

**数值验证**

相同的找 bug 提示，`max_tokens=500`，答案在语义上相同：

| 配置 | usage.completion_tokens | 真实耗时 |
|---|---|---|
| `thinking: {"type":"disabled"}` | **65** | 3.6s |
| 默认（网关解析器 → ttb = max_tokens/2 = 250） | **312** | 12.5s |

即使是简单任务，默认预算的一半也会用于隐藏思考 —— 因此建议在工具密集型/代理流程中禁用思考。

**对推理用户：**

- 工具密集型 / 代理流程且无需推理 —— 设置 `"thinking": {"type": "disabled"}`（Kimi）或 `"enable_thinking": false`（Qwen，自动转换）
- 复杂推理 —— 显式设置 `thinking_token_budget`（不要依赖默认的 `max_tokens / 2`）
- 如果 `thinking:disabled` 在您的提示中仍导致预算消耗 —— 同时显式设置 `thinking_token_budget: 0`

**对代理：** 对于低于 0.2.13 的版本 —— 按节奏更新。在更新前，客户端应用变通方案。在着陆页注明：Kimi 在工具密集型流程中需要 `thinking:disabled`，或显式设置 `thinking_token_budget`，或较大的 `max_tokens`。

### Kimi 的输入 token 上限为 4k tokens，输出上限为 8,192 tokens。这些限制何时会提高？

**问题中的数字不正确**

- **输出上限：3,072 个 token** 在两个测试的代理上均为如此（即使设置了 `finish_reason=length`，它们也恰好在 3,072 时返回 `max_tokens=8000`）。
- **输入：最高 240,000 个 token**（主网上 Kimi 部署的 `--max-model-len`）。不是 4,000。

**输出上限的来源**

代码中的网络上限为 4,096（`RequestMaxTokensCap`），但实际限制更低。确切机制是一个黑箱。可能的解释（按可能性排序，**未在公开代码中确认**）：

1. 网关默认的 `DefaultRequestMaxTokens = 3,072` 未被代理运营商覆盖。
2. 代理运营商通过管理端点（`POST /v1/admin/settings`）为每个模型设置了 `request_max_tokens_cap = 3,072`。
3. 上游 DAPI 或主机侧的限制（例如 vLLM 的 `--max-tokens-per-request` 或加载器约束）。

要确切了解——请向代理查询每个模型的 `request_max_tokens_cap` 值。

**3,072 个 token 能容纳多少内容**

| 场景 | 能否容纳在 3,072 个 token 内 |
|----------|-------------------|
| 约 1,900–2,200 个普通英文单词 | 是 |
| 约 600–800 行 Python/JS 代码 | 是 |
| 简短回答（5–10 个句子） | 是 |
| 一次工具调用 + 中等大小的 JSON（`arguments` ≤ 500 个 token） | 是 |
| 小型结构化输出（3–5 个摘要要点） | 是 |
| 长文档摘要（>10k 源 token） | 否 |
| 大型代码差异（>2k 行） | 否 |
| 单次响应中包含 3 次以上并行工具调用 | 否 |
| 代理循环：推理 + 工具调用 + 可见内容同时存在 | 否 |

对于第二组用例——请向代理申请提高上限（参见 **For Broker**）。

**如何提高上限**

输出上限由 **代理** 控制，而非网络。要提高上限——请联系您的代理：他们可通过单个管理调用增加 `request_max_tokens_cap`（无需更改代码）。若要将全网上限提升至超过 4,096，则需向网关代码提交 PR 并发布新版本；您可通过 `gonka-ai/gonka` 上的 GitHub Discussion 发起此请求。

供好奇者/运营商参考：区块链存储了每个模型的价格参数（`coins_per_input_token`, `coins_per_output_token`）和部署参数（`model_args`），但没有字段用于硬性输出限制——此放宽属于本地代理策略，而非治理定义的值。

**240k 输入的来源**

主网 Kimi-K2.6 部署是通过链上治理提案 v0.2.12（`inference-chain/app/upgrades/v0_2_12/upgrades.go:kimiGovernanceModel()`）注册的：

```text
ModelArgs: ["--max-model-len","240000",
            "--tool-call-parser","kimi_k2",
            "--reasoning-parser","kimi_k2"]
VRam: 720 (GB)
```

模型卡声明了256K的原生上下文。网关不会单独限制输入，除了通用的请求体大小限制（10 MiB）和消息数量限制（≤ 2,048）——见`docs/chat-api/README.md`（计划中的文档）中的“请求限制”部分。

**重要警告（开放问题）**

即使代理同意提高输出上限，个别节点可能仍以较小的`--max-model-len`启动。网关路由层未考虑每主机的上下文容量（[issue #818](https://github.com/gonka-ai/gonka/issues/818)）。对于大负载（>50k），落在“小”节点上是系统性行为，而非临时随机现象。

**对推理用户：**

- 实际输出上限由代理决定——向他们询问每个模型的`request_max_tokens_cap`值。
- 遇到较小的输入限制——这几乎肯定是特定节点上的`--max-model-len`，而非全局限制。路由层未考虑每主机上下文（issue #818）；对于大负载（>50k），这是一个系统性问题。解决方法：重试或将请求拆分为多个API调用。
- 达到输出上限——请代理提高限制。全网范围的提升（超过4,096）需要代码变更；通过`gonka-ai/gonka`上的GitHub Discussion提出。

**对代理：**

- 按模型提高上限可通过`POST /v1/admin/settings`使用`model_limits[].request_max_tokens_cap`进行单次管理调用完成，无需代码变更。这会增加每请求的托管风险以及触及每主机`--max-model-len`的风险（个别节点出现5xx）。在确认所有托管节点上的`--max-model-len`后，针对有明确需求的特定模型提高上限。
- 全网范围的提升（超过4,096）需要向网关代码提交PR并发布新版本。若对大输出有稳定需求，请发起Discussion。

### 为何使用Hermes、OpenClaw等带有30k+系统提示的代理在Kimi上会失败？

**简要说明**

Kimi模型在模型和网关层面均接受30k+输入，但稳定性取决于路由。原生窗口为256K，主网部署使用`--max-model-len 240000`，网关接受最多10 MiB的请求体。实测显示，约69,000个提示token的单次请求（≈800条消息 × 80词）在5.5秒内完成。在持续/重复的长请求（>50k）时会遇到不稳定性（issue #818）——对于大负载（215k），多次尝试可能以503失败。

**验证来源（均在`gonka-ai/gonka`中）**

- 原生上下文256K——`docs/chat-api/`中的模型卡（确切文件名将作为chat-api文档集的一部分计划发布）。
- 主网部署参数（链上）——`inference-chain/app/upgrades/v0_2_12/upgrades.go:kimiGovernanceModel()`。
- 请求体/消息限制（10 MiB，≤ 2,048条消息）——`docs/chat-api/README.md`（计划中），“请求限制”部分。

**当30k输入失败时——两个典型原因****1. 代理负载中单个字段被拒绝。** 网关维护严格的白名单。如果代理发送了任何一个非标准字段（`tags`, `enforced_tokens`, `plugins`, `guided_json`）——整个请求将以HTTP 400被截断。Hermes特定的`tags`拒绝——锚点见`#reject-tags`在`docs/chat-api/troubleshooting.md`（计划中）。实测：有效69k负载 + `tags:["session:abc"]` → 2秒内返回HTTP 400。

**2. 路由到具有较小`--max-model-len`的节点。** 网关路由层在路由时未考虑主机的实际上下文大小（[issue #818](https://github.com/gonka-ai/gonka/issues/818)；另见计划中的`known-issues.md` §3）。对于非常长的负载（>50k，特别是>200k），落在“小”节点上是网络层面的**系统性行为**，而非客户端错误：我们的测量显示5次215k请求全部失败（0/5）。请求将在vLLM侧失败。

相关构建者请求：[issue #1229](https://github.com/gonka-ai/gonka/issues/1229)（2026年5月提出），阻碍代理场景的因素——长推理链、工具调用兼容性、超出输出限制后的续写。

**快速自检清单**

1. 逐一移除字段`tags`, `enforced_tokens`, `plugins`, `strict`, `guided_json`, `guided_regex`, `guided_grammar`, `guided_choice`。每次移除后重新发送相同请求。
2. 如果移除均无效——检查`tools[].function.parameters`中的模式深度（≤ 16）和总节点数（≤ 256），见Q9。
3. 负载已清理但仍失败——这是网络层面问题（issue #818）。解决方法：重试或拆分请求。

**对推理用户：**

- 首先根据`docs/chat-api/README.md`（计划中）中的白名单检查负载。大多数Hermes / OpenClaw的400错误是由于单个字段或模式问题。
- 像“上游模型提供商拒绝”这类通用代理消息具有误导性：一些代理将具体的网关400错误合并为通用消息，一些则传递原始消息（`"Chat completions parameter \"tags\" is currently rejected by the Gonka network..."`附带文档链接）。代理对比——`comparison-brokers.md`（计划中）。**如果一个代理显示通用错误——尝试另一个以获得可读消息并理解根本原因。**
- 负载已清理但仍失败——网络层面问题（issue #818）。解决方法：重试或拆分；对于持续的>50k负载，单次重试通常不够——应拆分。

**对代理：**

- (1) 在落地页、通过`/v1/models`端点或文档中显示每个模型的原生上下文窗口，并明确说明由于主机异构性，实际每请求容量可能更低（issue #818）。一些代理有意省略此信息以避免过度承诺——这是一种可辩护的选择。(2) 在实现主机级容量通告前——考虑客户端过滤或“首选主机”列表。
- **用户体验：** 网关返回带有字段名和消息的具体400错误（`"Chat completions parameter \"tags\" is currently rejected by the Gonka network..."` + 文档链接）。建议在生产环境中向客户端传递详细消息——这能加快诊断速度。**安全提示：** 详细消息可能暴露内部字段名、主机路径和验证器ID，有助于枚举或提示注入探测。保守的掩码是一种可辩护的默认设置。若出于安全考虑将其包装为通用的`"upstream provider rejected"`——采用混合方式：异步日志/错误跟踪中保留完整细节，向客户端返回带追踪ID的通用消息。代理兼容性地图——`docs/chat-api/agents.md`（计划中）。

### 为何当输出超过4k–8k token时，Kimi生成的工具调用JSON格式错误？

既非带宽问题，也非Gonka侧限制。三个重叠原因。

**(a) `max_tokens`截断**

测试代理上的有效输出上限为3,072 token；网关网络上限为4,096。当助手在`arguments`中输出带有大JSON块的工具调用并包含可见内容时，可能触及代理的实际上限而导致JSON被截断。每代理覆盖详情见Q3。

**(b) Kimi-K2.6工具解析器的重复ID冲突**

`[vLLM PR #21259 — UNVERIFIED]`。使用`n > 1`时，`kimi_k2`解析器在每个选择循环内重新计算`history_tool_call_cnt`——两个分支都得到`id = functions.<name>:0`。网关在vLLM响应中看到重复ID，并根据OpenAI规范以HTTP 400拒绝。锚点见`#reject-duplicate-tool-call-id`在`docs/chat-api/troubleshooting.md`（计划中）。上游修复——[vLLM PR #21259](https://github.com/vllm-project/vllm/pull/21259)（合并状态未独立确认）。

**(c) Hermes工具解析器在多个工具块时出现JSONDecodeError**

`[vLLM #17790 — awaiting upstream fix]`。不同解析器，不同问题：当模型在一次响应中输出多个工具调用块时出现`JSONDecodeError`——[vLLM #17790](https://github.com/vllm-project/vllm/issues/17790)。相关问题：`<tool_call>`内含于`<think>`会破坏hermes解析——[vLLM #42021](https://github.com/vllm-project/vllm/issues/42021)。这些问题不依赖Gonka——等待上游修复。

**对于推理用户：**

- **在客户端重写 `tool_call.id`**，在发送后续消息之前，将其转换为标准格式 `functions.<name>:<global_idx>` —— 这是Moonshot的官方建议，将在 `docs/chat-api/troubleshooting.md#reject-duplicate-tool-call-id` 中复制（计划中）。另一种方式是使用全新的UUID。
- **不要按ID去重** —— 两次调用即使ID相同，也可能包含不同的结果。丢失它们 = 丢失代理的工作成果。
- **对包含工具调用的响应提升 `max_tokens`**；大的 `arguments` 数据块会迅速达到上限。
- 通用代理错误“上游模型提供商拒绝”通常意味着网关侧拒绝，而非模型本身。首先检查消息和ID是否重复，然后再怀疑模型问题（参见Q4中的代理差异）。

**对于代理方：**

- 考虑在网关侧按ID去重 —— 两个具有相同ID的工具调用可能包含不同结果；更安全的做法是**将ID重写为标准格式** `functions.<name>:<global_idx>`（不要去重）。在客户FAQ中记录该模式，并附上 `troubleshooting.md#reject-duplicate-tool-call-id` 的链接。**安全提示：** 如果未仔细验证，简单的按ID去重可能成为攻击面。通过标准化名称而非删除来处理更安全。
- **用户体验：** 传递具体的网关错误信息（`"messages[N].tool_calls[M].id is duplicated"`），而不是通用包装 —— 这能减少代理客户端的修复时间。**安全提示：** 在调试友好性和信息泄露之间取得平衡 —— 参见Q4。

### 启用引导解码能否解决token上限问题？

**引导解码与token上限无关。** 该机制强制模型按照指定模式（JSON Schema、正则表达式等）生成输出，但不会改变token数量。关于上限问题 —— 参见Q3。

底层vLLM字段 `guided_json`、`guided_regex`、`guided_grammar`、`guided_choice` **会被网关以HTTP 400拒绝**（锚点 `#reject-guided-decoding` 在 `docs/chat-api/troubleshooting.md` 中（计划中））。原因在于这些字段绕过了应用于 `response_format` / `structured_outputs` 信封的xgrammar边界，而该边界用于缓解CVE-2025-48944漏洞。

**结构化输出的正确字段**

| 字段 | Kimi K2.6 | Qwen3-235B | 备注 |
|------|-----------|------------|---------|
| `response_format`（`type: "json_schema"` 或 `"json_object"`） | 可用 | 可用 | OpenAI标准。可靠选择。已在两个模型上通过公共代理实证验证。 |
| `structured_outputs` 信封（`json`/`regex`/`choice`/`grammar`/`structural_tag`/`json_object`） | HTTP 400（全网拒绝） | HTTP 400（全网拒绝） | PR #1215（`StructuredOutputsValidator`）已在仓库中合并，但**截至2026-05-25尚未在生产主网上启用**。两个代理均以相同错误拒绝：`"Chat completions parameter `structured_outputs` is currently rejected by the Gonka network"` —— 错误引用的是开发分支 `dl/devshards-gateway-to-main`，而非主分支。这是一个**全网发布延迟**，而非单个代理问题。目前唯一可靠的结构化输出选项是Kimi K2.6和Qwen3上的 `response_format`。 |
| 同时使用两者（`response_format` + `structured_outputs`） | HTTP 400 | HTTP 400 / 502（取决于代理） | 网关会在请求到达vLLM之前拒绝该组合（锚点 `#reject-structured_outputs-with-response_format`）。在vLLM 0.20.0中，这些字段通过 `dataclasses.replace()` 合并，违反了 `StructuredOutputsParams.__post_init__` 中的“仅允许一个”的规则。 |

**对于推理用户：**

- 需要在不同代理和模型间最大程度可移植 —— 使用 `response_format`（处处可用）。目前 `structured_outputs` 信封在整个网络范围内被拒绝。
- 不要在同一请求中组合使用 `response_format` 和 `structured_outputs` —— 否则会返回HTTP 400。

**对于代理方：**

- 引导解码不会提高吞吐量。不要向客户承诺它是解决token上限的方案。
- 关注PR #1215（`StructuredOutputsValidator`）在所有路由上的 rollout —— Qwen3用户已在等待 `structured_outputs` 信封以支持正则表达式 / 选择 / 语法类工作负载。

### 为什么生成速度波动如此剧烈？为什么加速仅适用于推理token？

速度波动是一个真实存在的已知开放问题。其根源来自三个不同层级。

**1. 单主机减速/停滞（主机层级）**

一个开放的研究任务 —— [issue #818 "Slow nodes investigation"](https://github.com/gonka-ai/gonka/issues/818)（自2026年2月起开放，优先级：高）。存在特定模式但尚未找到根本原因（计划中的 `known-issues.md`，第1节“主机接收后无流返回”和第2节“主机产出部分chunk后停滞”——某些情况下一分钟后恢复，某些则永不恢复）。

**2. 路由差异（代理层级）**

两次连续请求之间，代理可能路由到负载不同的主机。端到端延迟取决于 `devshard-XXXX-YYY` 主机ID。在稳定主机上的每token生成速度基本保持不变。[¹]

[¹] 示意性观察：在一次测试中（约30秒内5次请求），端到端延迟变化导致 `tokens / total_latency` 显示范围约为 ~8–54 tok/s，但该指标包含 TTFT，且并非公开的方差指标。

**3. 网络层面的验证窗口（链级别）**

在 PoC / 确认-PoC 事件期间（cPoC —— 在一个epoch内确认验证节点工作的阶段），部分节点会暂时不可用。在epoch边界处，已知存在快照保留节点的问题，网关返回 `attempts: []`（路由上无可用主机）—— 从客户端角度看即超时。该影响在代理服务的该模型节点越少时越明显；在提供者数量较少的模型上影响更强。

**“推理速度比可见更快” —— 并非优先级问题，而是输出结构问题**

网关上没有为推理token提供特殊快速通道。在devshard代码中，`delta.reasoning`、`delta.content`、`delta.reasoning_content`、`delta.tool_calls` 都通过 `sseChunkHasContent` 以相同方式检测。每个token的生成速度是相同的。

启用思考的Kimi首先生成一个庞大的 `reasoning_content`（数百到数千个token），然后生成一个简短的可见答案（数十到数百个token）。不显示推理字段的客户端会看到“沉默，然后突然爆发式输出答案”。实际上模型一直在生成，只是结果被隐藏了。

**对于推理用户：**

- 选择一个公开发布正常运行时间 / p50 TTFT 指标的代理。可用的仪表板包括 [gonka.pw](https://gonka.pw/) 和 [meter.gonka.gg](https://meter.gonka.gg/)（可能还有其他，此列表非详尽）。
- 在慢速请求时，请记住负载大小：对于短请求，重试会落在不同的节点上；而对于持续的大负载（>50k），落在窗口减小的节点上是一个系统性问题（问题 #818），仅靠重试可能无效——最好进行拆分。
- 希望在模型思考时看到进度——在UI中渲染 `delta.reasoning_content`（或 `delta.reasoning`），例如在折叠块中。

**对于代理：**

- 整个网络最优先的共性问题。请向 [issue #818](https://github.com/gonka-ai/gonka/issues/818) 贡献生产日志/跟踪——这为核心团队提供了他们没有的数据。
- 协助实现主机端改进（分块gossip恢复、按托管账户的 `lastAfterReq` 跟踪——在计划的 `host-improvements.md` 及相关问题中跟踪），这些直接解决了路由/恢复的薄弱环节。

### 为什么速度因硬件而异——在B200上更快，在H200上更慢？

**速度取决于硬件——这在异构网络中是正常的。** 链上的PoC权重反映了节点的实际性能（影响验证者的奖励份额），而代理的路由则从托管账户中选择一个可用主机——连续两个请求可能落在不同代的GPU上。

**对于推理用户：** 速度取决于网络中的硬件分布。你不能直接选择硬件——你选择的是代理。需要可预测的延迟——询问代理默认路由到哪个硬件层级。

**对于代理：**

差异具体来源（来自 [`kaitakuai/experiments`](https://github.com/kaitakuai/experiments) 的内部基准测试——未在 gonka-api.org 或 gonkagate.com 上测量）：

| GPU | 内存 | sm | Qwen3-235B 每实例每分钟nonce数 | 每GPU |
|-----|--------|-----|------------------------------|---------|
| 4×H100 SXM5 | 80 GB HBM3 | 90 | **1,248** @ batch=16 | ~312 |
| 4×H200 | 141 GB HBM3e | 90 | **1,408** @ batch=32–64 | ~352 |
| 2×B200 | 192 GB HBM3e | 100 | **1,984** @ batch=64 | **~992** |

- **H200 与 H100：** 每GPU +13%。相同芯片（sm_90），但HBM3e + 141 GB 对比 HBM3 + 80 GB → 允许大模型使用更小的TP和更快的KV缓存。
- **B200/B300 与 H100/H200：** 在Qwen3-235B FP8上每GPU **~3倍**。
- **Kimi-K2.6 INT4 — 具体数值：** 4×B200 提供 2,240 nonces/min = **~560 每GPU**（见 `experiments/2026-05/kimi_k26_int4_4xb200_q-int4-k2`）。16×H100 TP 提供 1,389 nonces/min = **~87 每GPU**（见 `experiments/2026-05/kimi-k26-int4-2x8xh100`）。每GPU的差异约为6倍；绝对数值上，相同硬件上每GPU Kimi 比 Qwen 慢（4×B200 Kimi INT4 ~560 每GPU vs Qwen ~992 每GPU）。
- **Kimi-K2.6 INT4 在 Blackwell 上：** `VLLM_USE_FLASHINFER_MOE_INT4=1` 显示 **+138% vs Marlin**（在 `experiments/2026-05/kimi_k26_b300_eager_flashinfer` 中的A/B测试）。仅适用于Blackwell系列上的INT4 MoE工作负载（内核门控——`is_device_capability_family(100)`，覆盖B100/B200/B300；B300 实际上是 sm_103a）。

**跟踪与诊断：** 可观测性已在 [PR #1046 "Implement dapi & devshard observability"](https://github.com/gonka-ai/gonka/pull/1046) 中合并——增加了OpenTelemetry跟踪、Prometheus指标和仪表板。如果Grafana没有每主机TTFT面板——请检查DAPI / devshard是否已更新，并且仪表板是否包含在构建中。

其他来源：仓库 [`kaitakuai/experiments`](https://github.com/kaitakuai/experiments)（定期更新）、来自 [gonka.pw](https://gonka.pw/) 的你自己的每主机统计信息，以及来自 [meter.gonka.gg](https://meter.gonka.gg/) 的网络状态。想要影响硬件分布——将devshard托管账户扩展到具有首选GPU的主机。

### 为什么模型无法在Kilo Code中正确使用工具？

很可能有四种原因之一——网关应用了严格的参数白名单和对JSON Schema的严格限制。这并非Kilo特有：相同原因会触发任何编码代理（Cline、Continue.dev、OpenCode等）的问题。

**1. 硬拒绝（HTTP 400）——需要在客户端修复**

| 触发条件 | 原因 | 修复方法 |
|---------|---------|-----|
| 载荷中的 `tags` 字段 | 非 OpenAI Chat Completions 标准；民间 Hermes 约定；锚点 `#reject-tags` | 使用 `metadata`（OpenAI 标准）或 `user` 进行追踪 |
| `tools[].function.parameters` 中的模式深度 > 16 | CVE 驱动的限制 | 展平模式；PR #1187 将限制从 5 提高到 16 |
| 模式节点数 > 256（总计） | CVE 驱动的限制 | 减少节点数；PR #1195 将限制从 128 提高到 256。输入模式较大的 MCP 工具可能接近此限制；请在您的网关上测试。如果您确实需要超过 256 个节点的 MCP 工具——请提交功能请求。 |

**2. 静默强制转换 / 删除——请求不会失败，但行为发生变化**

| 触发条件 | 网关的行为 | 备注 |
|---------|---------------------|---------|
| `tool_choice: "required"` | 静默转换为 `"auto"`（网络策略） | 锚点 `#coerce-tool-choice-required`。在大多数情况下，模型会对明显需要工具的提示进行工具调用，但没有“必需”的保证 |
| `tools[].function.strict: true` | 静默删除该字段 | vLLM 解析器（`hermes`, `kimi_k2`）忽略该标志。PR #1193 |

已知客户端的兼容性矩阵：[`docs/chat-api/agents.md`](https://github.com/gonka-ai/gonka/blob/main/docs/chat-api/agents.md)（计划中）。一个基本的工具调用示例：[开发者快速入门 §1.4](https://gonka.ai/developer/quickstart/#4-tool-calling)。

**对于推理用户：**

- **使用 Kilo Code 生成的相同 curl 命令复现问题**（通过客户端的调试日志或中间代理）。在 400 响应体中，网关通常会说明被拒绝字段的名称；代理可能会将消息掩盖为通用的“上游拒绝”——但具体的问题字段通常就是其中之一。
- **对照 `agents.md` 和 `troubleshooting.md` 中的列表进行交叉检查**（计划中）——大多数 400 错误属于文档中列出的拒绝锚点（`#reject-tags`, `#reject-enforced_tokens`, `#reject-structured_outputs-kimi`）。
- **如果错误信息不明确，请使用快速检查清单：** 检查字段 `tags`, `enforced_tokens`, `plugins`, `strict`, `guided_*`；逐个移除并重新发送请求。若无帮助——检查模式深度（≤ 16）和节点数（≤ 256）。
- **被拒绝的字段未在文档中说明**——在 [gonka-ai/gonka](https://github.com/gonka-ai/gonka) 提交问题并附上捕获的请求。

**对于代理：**

- 仪表板上缺少指向 `agents.md` 的链接——这是一个低成本且快速实现的改进点。
- 有能力就 `gonka-ai/gonka` 中的非标准字段提交问题——这有助于整个生态系统的所有代理。

### 为何 Hermes 和 OpenClaw 等代理在 Kimi 上无法完成工具任务？

**由三个因素共同导致**

原始 FAQ 版本提到了第四个因素——特殊令牌清理器——但这与安全/提示注入有关，而非工具调用失败；该问题的修复已被推迟，因为 Kimi 能正确处理特殊令牌（经验上）

1. **网关默认将 `max_tokens` 的一半分配给推理**（见 Q1/Q2）。在默认 `thinking_token_budget = max_tokens / 2` 下，工具调用尚未开始输出时，空间已被耗尽。对于以工具为主的代理流程，预算在产生有用输出前就已用完。缓解措施——显式设置 `thinking_token_budget: 0`（见 Q2）。这是网关策略，而非模型限制。
2. **输出限制 3,072（实际）/ 4,096（网络上限）对于以工具为主的输出来说较紧**（见 Q3）。较大的 `arguments` 数据块加上可见内容很容易达到上限。
3. **上游 vLLM 工具解析器缺陷**（见 Q5）：重复的 `tool_calls[].id` 与 `n>1` 冲突（[vLLM PR #21259 — 未验证](https://github.com/vllm-project/vllm/pull/21259)），以及 Hermes 解析器在多个工具块上的 `JSONDecodeError` 问题（[vLLM #17790](https://github.com/vllm-project/vllm/issues/17790)）

开发者痛点链接：[issue #1229](https://github.com/gonka-ai/gonka/issues/1229) —— 长推理链、工具调用兼容性、超出输出限制后的继续执行被列为代理编码工作流的阻碍因素。

**对于推理用户：**

- **对于 Kimi 这是必需的：** `"thinking": {"type": "disabled"}` + `"max_tokens": 4096`（或显式设置 `thinking_token_budget: 0`，见 Q2 的双重保险策略）。这将释放整个容量用于以工具为主的输出。经验上：Kimi 可在约 4 秒内一次响应中发出 5 个并行工具调用。
- **在客户端控制 tool_call.id** —— 将其重写为标准格式 `functions.<name>:<global_idx>`（见 Q5），以避免网关因重复 ID 拒绝请求。
- **控制模式** —— 保持深度 ≤ 16 且节点数 ≤ 256（见 Q9）。输入模式较大的 MCP 工具可能无法通过。

**对于经纪商：**

- 将上限提升（Q3 — 每个模型通过 `request_max_tokens_cap` 实现 `/v1/admin/settings`）与上述建议结合 —— 这涵盖了网关上代理故障的主要类别。

### OpenCode 无法应用请求的代码更改（句子中途截断）。原因是什么？

三种原因；客户端可以绕过其中两种，但无法绕过第三种。

1. **`max_tokens` 在大差异补丁上的截断。** 大型代码补丁超出了实际 3,072（Q3）的上限限制。解决方法：将差异拆分为多个工具调用 —— 模型在每次调用中更容易符合预算。
2. **vLLM 在边缘情况参数下崩溃** —— 一系列 8 个已合并的 PR（#1170、#1171、#1172、#1174、#1180、#1212、#1215、#1216）增强了对导致引擎崩溃字段的防护。在较新的网关（≥ `devshard 0.2.13`）上，大多数已知崩溃场景会被 400 个验证器拦截，而非直接崩溃。
3. **主机在接收后丢弃流**（未解决 — 计划中的 `known-issues.md` §1 中有描述）— 主机接受了请求但不返回数据块。这是网络层面的问题，客户端除了重试外没有其他解决方法。

**对于推理用户：**

- **对于 Kimi：** `"thinking": {"type": "disabled"}` + `"max_tokens": 4096`。大差异补丁 — 拆分为多个工具调用。
- **长期计划：** 经纪商上限采用 Q3，工具调用的规范 ID 格式采用 Q5。

**对于经纪商：** 在面向编码代理客户端的客户 FAQ 中记录“拆分大差异补丁”的模式。

### 是否存在一个在输入和输出处理上均无折衷的模型？

**MiniMax-M2.7** 于 ~2026-05-28 通过链上治理升级 v0.2.13 在主网上线 — Gonka 的第三个模型。已在两个经纪商上验证运行。澄清说明：问题中提到的“Qwen 输出上限 8,192”不准确 — 所有模型的输出上限相同（3,072 / 4,096，Q3），并非由模型侧决定。

| 模型 | 原生上下文 | 主网 | 原生思维 | 工具调用 |
|--------|---------------|---------|-----------------|------------|
| Kimi-K2.6 | 256K | 240K | 是（chat_template_kwargs） | `functions.<name>:<idx>` |
| Qwen3-235B-A22B-Instruct-2507-FP8 | 128K | 240K | 否（Instruct） | hermes parser |
| MiniMax-M2.7 | ~180K | 180K | 是（内容中包含 `<think>`） | `chatcmpl-tool-<hash>` |

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

- **`<think>` 块位于 `delta.content` 中**（不像 Kimi 那样在 `reasoning_content` 中）——这是 `minimax_m2_append_think` 解析器的行为。如果你不需要这些标签出现在最终文本中，请在客户端解析它们。
- **工具调用 ID `chatcmpl-tool-<hash>`** —— 其结构本身已具备唯一性，因此 Q5 中关于规范化 ID 重写的建议不适用。

相关产物：PR #1163 权重缩放（已于 2026-05-13 合并，使经济模型与 Kimi 对齐）；PR [#1226](https://github.com/gonka-ai/gonka/pull/1226)（开放中，未合并）——基于已部署模型的网关侧重构，非阻塞性问题。

**对推理用户而言：** MiniMax-M2.7 现在即可使用（在 gonka-api.org 上 ID 为 `MiniMaxAI/MiniMax-M2.7`，在 gonkagate.com 上为 `minimaxai/minimax-m2.7` —— 参见大小写敏感性 Q1）。根据工作负载选择：Kimi 适用于推理+工具，Qwen3 适用于大上下文 + 结构化输出，MiniMax-M2.7 是 Kimi 的工具友好型替代方案，吞吐量更优。

**对 Broker 而言：** 部署由网络通过 v0.2.13 升级完成。若未提供 MiniMax 服务，请检查 mlnode-image 是否支持上述部署参数且主机已更新。PR #1226（开放中）将改善用户体验（按模型分发、工具消息结构），但不构成阻塞。

### 为什么没有可用的网页搜索功能？

**设计如此 —— Gonka 是一个推理网络**，而非代理框架。插件/网页执行应由客户端的代理层或提供增值服务的 Broker 处理，不属于推理路径的一部分。

**具体情况：** 2026-05-25 我们通过两个 Broker 测试了相同的 `plugins` 载荷。`gonka-api.org` 静默剥离该字段（HTTP 200，锚点 `#strip-plugins` 在 `docs/chat-api/troubleshooting.md` 中（计划中））；`gonkagate.com` 以 HTTP 400 `"Plugin config is invalid"` 拒绝。这两种都是网关合约的有效解释：一种倾向于宽松解析（静默剥离），另一种为严格验证（拒绝未知字段）。在这两种情况下 `plugins` **均未执行**：vLLM 没有插件执行路径，而静默传递此字段会暗示后端具备实际不存在的能力。在迁移 Broker 时需注意这种差异（详情见 `comparison-brokers.md`（计划中））。

**对推理用户而言：** 在你自己的代理层（LangChain、LlamaIndex 或自定义封装）运行搜索，并在调用 `messages[].content` 前将结果注入 `/v1/chat/completions`。这是所有兼容 OpenAI 的端点的标准模式。

**对 Broker 而言：** 这是一个差异化机会 —— Broker 层级的增值服务（“我们执行搜索并将结果注入消息”）是合理的产品。完全基于 Gonka 实现，无需协议变更。**安全提示：** 剥离 `plugins` 可能反映的是防滥用策略（而非用户体验缺陷）—— 若你计划将插件执行作为产品提供，请仔细考虑这一点。若想将其作为标准功能推出 —— 可在 [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/discussions) 发起生态讨论。

### 何时会支持可靠的网页抓取？

**按设计这不在 Gonka 路线图中。** 正确的位置是在边车（side-car）或 Broker 层的增值服务中。

**对推理用户而言：** 构建/采购抓取服务（Tavily、Exa、Perplexity API 用于搜索；trafilatura/Readability 用于解析），归一化为文本后通过兼容 OpenAI 的调用发送。已有大量现成解决方案。

**对 Broker 而言：** 若希望作为服务层级提供 —— 可在 [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/discussions) 发起生态讨论，以便社区就通用规范达成一致（例如一个大家都能一致部署的边车服务）。

### Context7 文档研究 —— 摘要失败。这是输出 token 限制导致的吗？

与“Kimi 的输入 token 上限为 4k，输出上限为 8,192。何时提高这些限制？”中的问题相同。输出限制（实际为 3,072 / 网络上限 4,096）对于“工具结果体 + 单次响应中的摘要”来说较紧。已启用思考过程 —— 一半 token 用于此（Q1/Q2）。

**摘要用例的现成载荷：**

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

**对推理用户而言：**

- 使用上述载荷作为模板。`response_format` 将输出压缩为所需格式，节省预算。
- 如果文档过长并达到上限（`finish_reason=length`）—— 拆分为 N+1 次调用：一次获取+规划，其余为各部分摘要；在客户端拼接结果。
- 不要将 `response_format` 与 `structured_outputs` 信封结合使用 —— 否则将返回 HTTP 400（Q6）。
- Schema：深度 ≤ 16，节点数 ≤ 256（Q9）。

**对 Broker 而言：** `response_format` 是最简单且最通用的缓解措施，无论你的上限提升策略如何。一旦 per-model `request_max_tokens_cap` 进入你的管理配置，可考虑提供按客户提升上限的选项。

### Gonka 没有 KV 缓存。何时会添加缓存？

**简短回答：目前无预计时间。** 在 Gonka 网关侧一切就绪 —— 阻塞点在上游 vLLM 侧，问题 [#33264](https://github.com/vllm-project/vllm/issues/33264) 已开放超过 4 个月且无合并的 PR。在该问题关闭前，请求中的 `prompt_cache_key` 字段将被**静默忽略**——请勿包含它，以免依赖尚未存在的行为。

vLLM 前缀 KV 缓存在每个 ML 节点上工作。网关级别的 `prompt_cache_key` / `cache_key` 当前被静默剥离 —— 此限制受一个未合并的上游 vLLM PR 阻塞。

**当前现状**

- **网关行为：** `prompt_cache_key`（OpenAI 标准）和 `cache_key`（Moonshot Kimi 规范）被静默剥离 —— 均未传达到 vLLM。锚点：`docs/chat-api/troubleshooting.md#strip-prompt_cache_key` 和 `#strip-cache_key`（计划中）。
- **上游阻塞：** vLLM 使用 `cache_salt` 字段进行提示缓存隔离（RFC #16016，PR #17045）。将 `prompt_cache_key` → `cache_salt` 别名化的方案自 2026 年 1 月起在 [vLLM #33264](https://github.com/vllm-project/vllm/issues/33264) 中开放，尚无合并的 PR。
- **安全理由：** 简单转发 `cache_key` 而不进行隔离是不安全的 —— 已有[公开的提示缓存计时侧信道攻击（arxiv 2502.07776 PROMPTPEEK）](https://arxiv.org/abs/2502.07776)。网关无法实现虚假的缓存隔离保证。
- **80–90% 的命中率并非 Gonka 的声明。** 它要么是对某些营销材料的误解，要么是与 OpenAI / Anthropic 原生缓存（在单一提供商内保证粘性路由）相混淆。

**重要的架构注意事项**

即使 vLLM #33264 被合并且网关添加了 hash → `cache_salt` 桥接，缓存仍为**每个 vLLM 实例独有**。Gonka 的多主机路由意味着两个具有相同 `cache_key` 的请求可能落在不同主机上，其前缀缓存也不同。在没有粘性路由（目前不存在）的情况下，保证类似 OpenAI 的 ~80% 命中率在架构上非常困难。三个阻塞项（上游 vLLM PR、网关桥接、粘性路由）目前均未实现。

**对推理用户而言：** 目前无需任何操作 —— `prompt_cache_key` 和 `cache_key` 为无效操作。不要依赖这些字段进行成本优化。

**对 Broker 而言：** 在 vLLM #33264 合并前无需网关侧变更。若想加快进度 —— 可评论或向上游问题贡献代码。合并后，Gonka 网关将添加一个桥接，同时启用两个字段。

### Gonka 网关何时为 Kimi 启用图像输入？

**目前不可用。** 预计时间 —— v0.2.14 或更高版本（当前为 0.2.13），无固定日期。多模态载荷（`messages[].content` 包含 `type: "image_url"` 或 `"video_url"`）目前在两个公共 Broker 上均返回 **HTTP 400**。

**正在进行中，计划已制定并分为多个阶段。** 计划文档 `multimodal-inference-plan.md` 位于 `gonka-ai/gonka`（约 466 行，6 个阶段 —— ML Node、Host↔ML Node、Broker/DAPI、Devshard 协议等）。在发布前，通过以下问题/PR 跟踪更方便。

**当前的硬性阻塞项**

1. **一种多模态专用的特殊标记清理器。** Kimi-K2.6 聊天模板接受 `image_url` / `video_url` 内容部分，但网关目前仅验证文本。多模态负载（图像 URL、替代文本、元数据）提供了额外的注入面，必须进行验证。安全审查已将其标记为第二阶段阻塞项。**目前尚无此特定多模态威胁的公开 CVE；内部跟踪正在进行中。**

2. **独立的 VLM 验证审查。** 图像输入的验证方法需要独立确认。问题 [#1026](https://github.com/gonka-ai/gonka/issues/1026)（初步研究：Qwen2-VL-2B F1=100% 中间结果）+ [#1198](https://github.com/gonka-ai/gonka/issues/1198)（重新验证，可认领）。

**目标版本：** v0.2.14+，但尚无确定时间表；受阻于问题 #1198（独立验证，可认领）。

**当前实证确认的情况：** 包含 `{type:"image_url"}` 的 `messages[0].content` 数组请求在 Kimi 和 Qwen3 两个路由上均返回 HTTP 400。网关级别不接受多模态输入。

**对推理用户而言：** 目前不可用。

**对 Broker 而言：** 三种加速方式：

1. 认领问题 [#1198](https://github.com/gonka-ai/gonka/issues/1198)（可认领）—— 独立的 VLM 验证审查是最关键的阻塞项。
2. 审查 PR [#1150 "vlm benchmark"](https://github.com/gonka-ai/gonka/pull/1150)。
3. 当计划的第 1-3 阶段变得可实现时——准备网关能力注册表（第 3 阶段）；操作员配置将决定你的 Broker 接受哪些内容类型。
