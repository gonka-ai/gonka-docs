# FAQ

## 概述

### 什么是Gonka？
Gonka是一个用于高效AI计算的去中心化网络——由其使用者运行。它作为中心化云服务在AI模型训练和推理方面的低成本、高效率替代方案。作为一个协议，它并非公司或初创企业。

- 从区块链角度看，Gonka是去中心化AI网络的基础账本和协调层（L1）。它记录余额、交易和加密证据，以证明主机正确执行了AI工作，而所有实际计算（如推理和训练）均在链下进行。
- 从网络角度看，Gonka是一个由主机和开发者等参与者组成的综合生态系统，通过去中心化基础设施进行交互。在Gonka区块链的驱动下，该网络分发任务、验证结果，并仅奖励可验证的有用工作，从而为AI工作负载创建了一个竞争性、可扩展的环境。

### Gonka解决了什么问题？

Gonka是一个去中心化AI基础设施，旨在减少对中心化云提供商的依赖，并比传统去中心化网络更高效地利用计算能力。其目标是尽可能将计算资源导向有用的AI任务，如推理和训练，同时最小化因共识开销造成的浪费。

### Gonka生态系统中的关键参与者有哪些？

Gonka生态系统有四个关键参与者群体：

- 开发者通过利用网络的分布式计算能力构建和部署AI应用。
- 贡献者参与核心区块链代码库、协议升级、性能优化、安全补丁和新功能集成的开发。
- 持有者持有网络的原生代币，即仅拥有一个包含GNK代币的钱包。持有者可以持有、转账或出售代币，用其支付推理服务，并根据协议规则使用代币。成为持有者并不意味着除标准代币所有权外的任何义务、责任或治理角色。
- 主机向网络提供计算能力。主机执行推理和其他计算任务，并根据其贡献的计算能力获得相应奖励，前提是保持诚实参与和可靠性。主机是网络的骨干。只有主机拥有网络的投票权。该投票权代表其在治理中的权重，用于提议和投票决定协议决策、参数变更和升级。任何主机均可担任验证者、转账代理和执行者（这些并非预定义或链上角色，而是在处理推理请求时动态承担的操作功能）。

### 什么是GNK代币？
GNK是Gonka网络的原生代币，用于激励参与者、定价资源，并确保网络的可持续增长。

### 我可以购买GNK代币吗？

原生GNK目前**未在任何中心化交易所（CEX）上线**，因此您无法在CEX上购买。请关注[Twitter](https://x.com/gonka_ai)上的官方公告以获取任何上市更新。

不过，目前有以下两种合法方式获取GNK：

- **作为主机挖矿。** 向网络贡献计算资源并直接获得GNK奖励。请参阅[作为主机挖矿](https://gonka.ai/host/quickstart/)。
- **在以太坊上购买WGNK并桥接回GNK。** GNK可桥接到以太坊作为**WGNK**（封装的GNK），这是一种标准ERC-20代币，可在Uniswap等DEX上交易。您可以在那里购买WGNK，然后[桥接回原生GNK](cross-chain-transfers/ethereum-bridge/withdraw-gnk.md)。请参阅[以太坊桥接概览](cross-chain-transfers/ethereum-bridge/overview.md)。

!!! info 追踪WGNK价格和市场数据
	您可以在以下平台查看WGNK（封装GNK）的价格、市值和交易量：

	- [CoinGecko](https://www.coingecko.com/en/coins/wrapped-gonka)
	- [CoinMarketCap](https://coinmarketcap.com/currencies/gonka/)
	- [Uniswap](https://app.uniswap.org/explore/tokens/ethereum/0x972a7a92d92796a98801a8818bcf91f1648f2f68)

!!! warning 交易前验证合约地址
	GNK在以太坊上的**唯一**官方代表是**WGNK**，地址为`0x972a7a92d92796a98801a8818bcf91f1648f2f68`——该地址既是桥接合约，也是WGNK ERC-20代币。请始终确认任何列表或交易均指向此确切地址。

	其他追踪器和网络上仍存在假冒GNK列表和页面：任何声称在Solana或其他非上述WGNK地址上的GNK代币均**不是**官方GNK资产。请始终通过官方渠道验证信息。

### 协议为何高效？
Gonka与“大厂”的区别在于其定价机制，以及无论主机规模大小，推理任务均被平等分配。更多信息请参阅[白皮书](https://gonka.ai/whitepaper.pdf)。

### 网络如何运作？
网络的运作是协作性的，取决于您希望扮演的角色：

- 作为[开发者](https://gonka.ai/developer/quickstart/)：您可以使用网络的计算资源构建和部署您的AI应用。
- 作为[主机](https://gonka.ai/host/quickstart/)：您可以贡献您的计算资源以支撑网络。协议设计旨在奖励您的贡献，确保网络的持续性和自主性。

### 这份文档是否完整？

否。本文档涵盖了协议的主要概念、标准工作流程和最常见的操作场景，但并未涵盖代码库的全部行为或实现细节。代码中包含更多逻辑、交互和边缘情况，此处未作描述。

由于Gonka是一个开源且去中心化的网络，各种参数、机制和治理驱动的行为可能通过链上投票和社区决策而演变。部分细节可能在发布后发生变化，某些边缘情况或未来更新可能不会立即反映在文档中。

对于主机、开发者和贡献者而言，最终的真理来源是代码本身。若本文档与代码存在任何不一致，以代码为准。

鼓励参与者查阅相关仓库、治理提案和网络更新，以确保其理解与协议当前状态保持一致。

### 贡献计算资源的激励是什么？
我们创建了一份专门的文档，专注于[Tokenomics](https://gonka.ai/tokenomics.pdf)，您可以在其中找到有关激励如何衡量的所有信息。

### 硬件要求是什么？
您可以在文档中清楚地找到最低和推荐的[硬件规格](https://gonka.ai/host/hardware-specifications/)。您应查看此部分，以确保您的硬件符合有效贡献的要求。

### 我可以使用哪些钱包存储GNK代币？
您可以在多个支持的钱包中存储GNK代币：

- [Tangem](https://tangem.com/) — 带有移动应用的硬件钱包（卡片或戒指）
- [Keplr](https://www.keplr.app/)
- [Cosmostation](https://cosmostation.io/products/application)
- `inferenced` CLI — 用于Gonka本地账户管理和网络操作的命令行工具。

!!! note "现有Leap Wallet用户请注意"

	如果您之前使用Leap Wallet创建了Gonka账户，请注意[Leap将在2026年5月28日关闭其所有产品](https://www.leapwallet.io/)，包括浏览器扩展、移动应用和仪表板。

	由于Leap是非托管钱包，您的资产和账户仍保留在链上。但为了继续访问您的钱包，您应在Leap服务下线前，将您的现有恢复短语导入到其他支持的钱包中，例如Keplr。

### 在哪里可以找到有关Gonka的有用信息？

以下是了解Gonka生态系统的最重要资源：

- [gonka.ai](https://gonka.ai/) — 项目信息和生态系统概览的主要入口。
- [白皮书](https://gonka.ai/whitepaper.pdf) — 描述架构、共识模型、Proof-of-Compute等的技术文档。
- [Tokenomics](https://gonka.ai/tokenomics.pdf) — 项目代币经济概览，包括供应、分配、激励和经济设计。
- [GitHub](https://github.com/gonka-ai/gonka/) — 访问项目源代码、仓库、开发活动和开源贡献。
- [Discord](https://discord.gg/REcpeYc7P7) — 社区讨论、公告和技术支持的主要场所。
- [X (Twitter)](https://x.com/gonka_ai) — 新闻、更新和公告。

## Tokenomics

### 什么是Weight？

!!! note "v0.2.16"
	从**v0.2.16**开始，Weight是用于奖励的实际计算量。治理投票权使用[weight cap](#what-is-the-weight-cap)，而非直接使用Weight。

	Weight是主机在一个纪元中测得的计算贡献。链上通过Proof-of-Compute（PoC）推导出它：主机在Sprint期间处理的有效nonce数量，乘以每个模型的系数。该原始结果随后根据以下因素调整：

- 确认Proof-of-Compute（cPoC）——主机是否在纪元内实际交付了所声称的算力
- 惩罚（例如遗漏模型或无效推理）
- 抵押品——在宽限期后，只有由抵押品支持的PoC权重部分才有效
- 集中度限制——任何主机持有的总网络Weight不得超过30%

最终结果是主机的实时、完全调整后的**Weight**。它用于：

- 纪元奖励
- cPoC确认所声称的算力
- 计算单位定价
- 主机工作选择的加权机制

Weight与治理投票权不同。投票权使用[weight cap](#what-is-the-weight-cap)。

您可以在`$NODE_URL/v1/epochs/current/participants`和`$NODE_URL/v1/epochs/{epoch_id}/participants`的参与者列表中查看`weight`。

### 什么是weight cap？

!!! note "v0.2.16"
	上一纪元的weight cap在**v0.2.16**中引入。在此升级之前，治理、BLS和PoC/cPoC验证投票直接使用Weight。

	权重上限（`cap_weight`）是主机的**信任权重**：允许影响共识关键决策的权重部分。

	从 v0.2.16 版本开始，主机在下一个纪元的信任权重不得超过该主机在上一个纪元实际确认的算力：

```
CapWeight for epoch N+1 = min(Weight in epoch N+1, confirmed Weight from epoch N)
```

该值随后会像权重一样进行集中度上限限制（任何主机的权重不得超过总 CapWeight 的 30%），因此发布的 `cap_weight` 可能低于上述的 `min`。

这存在一个纪元的延迟：共识影响力使用的是主机在上一个纪元已确认的算力，因此声明算力的突然激增——新硬件上线或操纵的 PoC 结果——不会立即带来治理投票权、更大的 BLS 签名份额，或在验证他人 PoC 时更大的话语权。

**使用权重上限**

- 治理 / CometBFT 验证者权力
- BLS 阈值签名份额
- PoC 和 cPoC 验证投票

**不使用权重上限**

- 奖励。合法增加容量的主机仍会根据其真实权重在同个纪元获得奖励。只有共识影响力会延迟一个纪元。

**新加入或回归的主机**

如果你在上一个纪元不是活跃参与者，则没有确认的基准，因此第一个纪元的 `cap_weight` 等于 `0`。你仍会根据权重获得奖励。治理、BLS 和验证投票权在网络确认你的算力满一个完整纪元之前保持为零。

如果结算的统计测试（`MissedStatTest`）失败，则用于下一个上限的确认基准将被视为 `0`。

上一个纪元的权重上限**不是** 30% 的集中度限制。30% 规则首先应用于真实权重。上一个纪元的上限在之后应用，且仅适用于信任权重。30% 规则再次应用于结果 `cap_weight`。

v0.2.16 之后，参与者列表包含两个字段：`weight`（奖励）和 `cap_weight`（治理、BLS 和验证投票）。你可以在 `$NODE_URL/v1/epochs/current/participants` 和 `$NODE_URL/v1/epochs/{epoch_id}/participants` 确认它们。

### Gonka 中的治理权如何计算？
Gonka 使用 PoC 加权投票模型：

- Proof-of-Compute（PoC）：你的权重与经过验证的算力贡献成正比。治理投票权使用[权重上限](#what-is-the-weight-cap)，该上限不能超过该权重。
- 抵押承诺（宽限期后）：
    - 基础活跃权重（默认为 PoC 衍生权重的 20%）始终活跃。
    - 要解锁剩余的 80% 作为活跃权重，你必须锁定 GNK 作为抵押品。
- 活跃权重用于计算奖励，并作为[权重上限](#what-is-the-weight-cap)的输入。治理/BLS/验证影响力使用 CapWeight，而非直接使用 Weight。

在前 180 个纪元（约 6 个月）内，新参与者仅通过 PoC 即可获得权重，无需抵押要求。在此期间，完整的 PoC 衍生权重均为活跃权重。治理、BLS 和验证影响力仍使用[权重上限](#what-is-the-weight-cap)。

### 为什么 Gonka 要求锁定 GNK 代币以获得治理权？
投票权绝非仅基于持有代币。GNK 代币作为经济抵押品，而非影响力来源。影响力通过持续的计算贡献获得，而锁定 GNK 抵押品是为了保障参与治理并强制问责。

## 抵押品

### 什么是抵押品？
抵押品用于在宽限期（前 180 个纪元）后激活 PoC 权重中符合抵押条件的部分。
宽限期后：

- 基础权重（默认 20%）始终活跃。
- 剩余权重需 GNK 抵押品才能激活。

抵押品确保拥有治理权重的参与者也承担经济责任。参数由链上定义，并可通过治理变更。在做出经济决策前，请始终核实当前值。

### 抵押品是按节点还是按账户计算？
抵押品按账户存入。如果多个 ML 节点链接到同一账户，则所需抵押品根据该账户下所有节点的总权重计算。

### 我需要存入抵押品吗？
是的，如果你想激活超过基础权重的部分。
如果没有存入抵押品，则只有基础权重保持活跃。

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
可以。您的总活跃权重包括：

- 基础权重（始终活跃）
- 可抵押权重（按存入的抵押品比例激活）

如果您存入的金额少于全额要求：

- 基础权重保持完全活跃
- 只有相应比例的可抵押权重被激活
- 剩余部分保持非活跃

活跃权重计算方式为：
```
Active Weight =
Base Weight +
(Deposited Collateral / Required Collateral) × Collateral-Eligible Weight
```

### 如果我没有存入足够的抵押品会发生什么？
您的活跃权重将按比例减少。由于奖励按活跃权重比例分配，当您抵押不足时，其他主机将获得更大比例的发行量。非活跃权重不会被直接重新分配，它只是不参与共识。

### 抵押品何时生效？
抵押品必须在轮次开始前存入才能生效。在轮次期间存入的抵押品：

- 不会立即增加权重
- 从下一轮次开始生效

轮次期间无法增加抵押品。

### 我应该以什么单位存入抵押品？
交易必须使用ngonka，而非GNK。
```
1 GNK = 1,000,000,000 ngonka
```
示例：
```
10 GNK = 10,000,000,000 ngonka
```

### 抵押品会被罚没吗？
是的。抵押品可能因以下原因被罚没：

- 无效推理
- 宕机（PoC确认失败或隔离）

无效推理的罚没每个轮次最多一次。
宕机罚没可针对每次隔离事件执行。

### 被罚没的代币会怎样？
目前，被罚没的GNK将永久销毁并退出流通。未来治理可能改变此机制。

### 我可以提取抵押品吗？
可以。提取将触发解绑期（默认：1轮次）。在解绑期间，抵押品仍可能被罚没。解绑期结束后，资金将自动返还至您的账户余额。

### 抵押品不是什么

- 抵押品不是投票权。投票权来源于[权重上限](#what-is-the-weight-cap)，其受PoC权重限制，而非代币余额。
- 抵押品不是委托。每个账户必须为其自身权重提供支持。
- 抵押品不是永久锁定。可以提取（需经过解绑期）。
- 在宽限期（前180轮次）期间，不需要抵押品。

### 轮次铸造的奖励如何分配？
每个轮次固定铸造一定数量的GNK，并按活跃PoC权重比例分配。
活跃权重决定您在轮次铸造奖励中的份额。

治理投票权使用[权重上限](#what-is-the-weight-cap)，该上限不能超过活跃权重。

如果您的活跃权重因抵押不足而减少，您获得的轮次奖励份额也将按比例下降。非活跃权重不会获得奖励。

### 我需要手动存入抵押品吗？
是的。必须通过提交链上交易来存入抵押品。它不会自动激活。如果没有存入抵押品：

- 您的节点正常运行。
- 未被惩罚或禁用。
- 仅基础权重（例如 20%）保持激活。

您的奖励和治理影响力将按比例减少。

### 已归属（锁定）的 GNK 可以用作抵押品吗？
不可以。抵押品必须从您可用的（未锁定）GNK 余额中存入。尚未释放的归属代币不能用作抵押品。

## 治理

### 哪些类型的变更需要治理提案？
任何影响网络的链上变更都需要治理提案，例如：

- 更新模块参数（`MsgUpdateParams`）
- 执行软件升级
- 添加、更新或弃用推理模型
- 任何其他必须通过治理模块批准和执行的操作

### 谁可以创建治理提案？
任何拥有有效治理密钥（冷钱包）的人都可以支付所需费用并创建治理提案。然而，每个提案仍需通过 PoC 加权投票由活跃参与者批准。建议提案人在链下先讨论重大变更（例如，通过 [GitHub](https://github.com/gonka-ai) 或 [社区论坛](https://discord.gg/REcpeYc7P7)），以提高提案通过的可能性。详见 [完整指南](https://gonka.ai/governance/transactions-and-governance/)。

### 如果提案失败会怎样？
- 如果提案未达到法定人数 → 自动失败
- 如果多数投票 `no` → 提案被拒绝，无链上变更
- 如果显著比例投票 `no_with_veto`（超过否决阈值）→ 提案被拒绝并标记，表明社区强烈反对
- 存款是否退还取决于链的设置

### 治理参数本身可以更改吗？
可以。所有关键治理规则——法定人数、多数阈值和否决阈值——都是链上可配置的，可通过治理提案进行更新。这允许网络根据参与模式和计算经济的变化 evolve 决策规则。

### 如果我无法投票，因为我无法访问冷钱包密钥，或者我想让另一个密钥代表我投票，我该怎么办？

如果拥有投票权的密钥不是您日常操作使用的密钥，则可以提前授予投票权限。

在此设置中：

- 授权人 = 拥有投票权的账户（冷钱包密钥）
- 被授权人 = 代表授权人提交投票的账户（热钱包密钥）

有两种常见场景：

**1. 您想投票，但无法访问拥有投票权的密钥。**

请联系该密钥的所有者，请求他们授予您的密钥代表其投票的权限。未经此授权，您的密钥无法为该投票权提交治理投票。

**2. 您希望另一个密钥代表您投票。**

请使用以下 grant 命令从拥有投票权的密钥执行。这将授权被授权密钥代表您提交治理投票。
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

4) 撤销委托（使用授予方密钥运行）
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

## 改进建议

### 治理提案和改进建议有何区别？
治理提案 → 链上提案。用于直接影响网络并需要链上投票的变更。示例：

- 更新网络参数（`MsgUpdateParams`）
- 执行软件升级
- 添加新模型或功能
- 任何需要由治理模块执行的修改

改进建议 → 由活跃参与者控制的链下提案。用于规划长期路线图、讨论新想法和协调重大战略变更。

- 以 Markdown 文件形式托管在 [/proposals](https://github.com/gonka-ai/gonka/tree/main/proposals) 目录中
- 通过 GitHub Pull Request 进行审查和讨论
- 获批准的提案将被合并到仓库中

### 改进建议如何进行审查和批准？
社区提案审查的目标是收集社区验证：点赞、评论和具体反馈，以增强提案获得治理批准的可能性。如果提案实施需要大量工作、长期承诺、协调或对协议进行重大更改，这一点尤其重要。

- 先阅读推荐指南：[https://github.com/gonka-ai/gonka/discussions/795](https://github.com/gonka-ai/gonka/discussions/795)。它解释了哪些内容属于改进建议，以及如何撰写一个结构清晰、有力的提案。
- 在 [GitHub Discussions](https://github.com/gonka-ai/gonka/discussions) 发布并讨论改进建议（推荐）；以前它们存储在 `/proposals` 目录的 Markdown 文件中。
- 为了帮助社区评估您的提案（并提高其后续在治理中通过的可能性），提案者有责任主动收集早期反馈和支持信号（点赞、评论、具体关切）。
	- 在 Discord 的 #improvements-proposals 频道分享讨论链接以扩大影响力和可见性，并通过您可用的任何其他渠道（包括直接联系主机/矿工）进行推广，以收集实际反馈和支持。
	- 在提案线程中分享您的经验和专业知识。如果您代表团队或公司，请提及并链接相关工作，以帮助社区评估可信度并更高效地评估提案。
- 社区审查：
	- 活跃贡献者和维护者在 [GitHub Discussions](https://github.com/gonka-ai/gonka/discussions) 中讨论提案。讨论可在任何平台进行，但请将关键上下文汇总回 [GitHub Discussions](https://github.com/gonka-ai/gonka/discussions)：这能将完整历史记录集中保存，保持可搜索性，并长期更易于维护。GitHub 是主要的真相来源。
	- 请提出问题、提供反馈、建议、改进，并为相关提案点赞。每个人的关注和参与对链的可持续演进都至关重要。
- 积极的反馈和大量点赞表明真实的社区需求，使团队能够将受欢迎的提案视为社区驱动的路线图的一部分，并在确信社区一致性和最终治理批准的前提下开始实施。请注意，主机的反馈至关重要——它有助于将项目分解为里程碑、解锁部分奖励金，甚至从社区池中争取资助。然而，最终所有链上更新和付款仍需经过治理批准。

### 改进建议能否演变为治理提案？
可以。通常，改进建议用于探索想法并收集共识，然后再起草治理提案。例如：

- 您可能首先将新模型集成作为改进建议提出。
- 在社区达成一致后，创建一个链上治理提案以更新参数或触发软件升级。

## 投票

### 投票流程如何运作？
- 提案提交并存入最低保证金后，进入投票期
- 投票选项：`yes`、`no`、`no_with_veto`、`abstain`

    - `yes` → 批准提案
    - `no` → 拒绝提案
    - `no_with_veto` → 拒绝并表明强烈反对
    - `abstain` → 不批准也不拒绝，但计入法定人数

- 您可以在投票期间随时更改投票；仅您的最后一次投票有效
- 如果达到法定人数和阈值，提案将通过治理模块自动通过并执行

要投票，您可以使用以下命令。此示例投票赞成，但您可以将其替换为您首选的选项（`yes`，`no`，`no_with_veto`，`abstain`）：
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

### 我如何跟踪治理提案的状态？
您可以随时使用 CLI 查询提案状态：
```
export NODE_URL=http://47.236.19.22:18000
./inferenced query gov tally 2 -o json --node $NODE_URL/chain-rpc/
```

## 运行节点

### 如果我想停止挖矿，但以后回来时仍想使用我的账户怎么办？
将来要恢复网络节点，只需备份：

- 冷密钥（最重要，其他所有内容均可轮换）
- 来自 tmkms 的 secret：`.tmkms/secrets/`
- 来自 `.inference .inference/keyring-file/` 的 keyring
- 来自 `.inference/config .inference/config/node_key.json` 的节点密钥
- 温密钥的密码 `KEYRING_PASSWORD`

### 我的节点被惩罚了。这是什么意思？
您的验证节点被惩罚，是因为在最近的100个区块中签名少于50个（要求统计该窗口内签名的总区块数，而非连续区块）。这意味着您的节点被暂时排除（约15分钟）在区块生产之外，以保护网络稳定性。
可能的原因有：

- **共识密钥不匹配**。您的节点使用的共识密钥可能与链上为您的验证节点注册的密钥不同。请确保您使用的共识密钥与链上注册的验证节点密钥一致。
- **网络连接不稳定**。网络不稳定或中断可能导致您的节点无法达成共识，从而造成签名缺失。请确保您的节点具有稳定、低延迟的连接，且未被其他进程过载。

**奖励**：即使您的节点被惩罚，只要它在推理或其他验证相关工作中保持活跃，您仍将继续获得大部分奖励。因此，除非检测到推理问题，否则奖励不会丢失。

**如何解除惩罚**：在问题解决后，使用您的冷密钥提交解除惩罚交易以恢复正常运行：

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
然后，检查节点是否已被解禁：
```
 ./inferenced query staking delegator-validators \
    <cold_key_addr> \
    --node $NODE_URL/chain-rpc/
```
当节点被隔离时，会显示 `jailed: true`。

### 如何退役旧集群？

遵循本指南，安全关闭旧集群而不影响声誉。

1) 使用以下命令禁用每个 ML 节点：

```
curl -X POST http://localhost:9200/admin/v1/nodes/<id>/disable
```

您可以使用以下命令列出所有节点 ID：

```
curl http://localhost:9200/admin/v1/nodes | jq '.[].node.id'
```

2) 在下一次计算证明（PoC）期间未安排提供推理服务的节点将自动停止。
安排提供推理服务的节点将在停止前再活跃一个周期。您可以在以下位置的 mlnode 字段中验证节点状态：

```
curl http://<inference_url>/v1/epochs/current/participants
```

一旦节点被标记为禁用，即可安全关闭 MLNode 服务器。

3) 在所有 MLNode 被禁用并关闭后，您可以关闭网络节点。在此之前，建议（但非必需）备份以下文件：

- `.dapi/api-config.yaml`
- `.dapi/gonka.db`（链上升级后创建）
- `.inference/config/`
- `.inference/keyring-file/`
- `.tmkms/`

如果您跳过备份，仍可使用您的账户密钥稍后恢复设置。

### 我的节点无法连接到 `config.env` 中指定的默认种子节点

如果您的节点无法连接到默认种子节点，请通过更新 `config.env` 中的三个变量，将其指向其他节点。

1. `SEED_API_URL` - 种子节点的 HTTP 端点（用于 API 通信）。
从以下列表中选择任意 URL，并直接分配给 `SEED_API_URL`。
    ```
    export SEED_API_URL=<chosen_http_url>
    ```
    可用的创世 API URL：
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
2. `SEED_NODE_RPC_URL` - 公共 Tendermint RPC 访问必须通过种子节点的 HTTP(S) 代理路径 `/<chain-rpc>`。
使用与 `SEED_API_URL` 相同的协议（http 或 https）、主机和端口，并追加 `/chain-rpc`。
    ```
    export SEED_NODE_RPC_URL=http://<host>/chain-rpc
    ```
    示例
    ```
    SEED_NODE_RPC_URL=http://node2.gonka.ai:8000/chain-rpc/ 
    ```
!!! note "重要"

	- 请勿将 `http://<host>:26657` 用作公共 RPC 端点。
	- 端口 `26657` 必须仅限内部使用（localhost/私有网络）。公共 RPC 必须通过 `/<chain-rpc>`。

3. `SEED_NODE_P2P_URL` - 用于节点间网络通信的 P2P 地址。
您必须通过相同的 `/<chain-rpc>` 代理，从种子节点的状态端点获取 P2P 端口。

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

根据节点是否已初始化，有两种不同的方式更新种子节点。

=== "选项 1. 手动编辑种子节点（初始化后）"

一旦文件 `.node_initialized` 被创建，系统将不再自动更新种子节点。
    从那时起：

    - 种子列表将直接使用
    - 任何更改都必须手动完成
    - 您可以添加任意数量的种子节点

格式为单个逗号分隔的字符串：
    ```
    seeds = "<node1_id>@<node1_ip>:<node1_p2p_port>,<node2_id>@<node2_ip>:<node2_p2p_port>"
    ```
    要查看任何运行节点的已知对等节点，请使用 chain RPC：
    ```
    curl http://node2.gonka.ai:8000/chain-rpc/net_info | jq
    ```

    响应中查找：

    - `listen_addr` -  P2P端点
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

    这将显示节点当前看到的所有对等节点。

=== "选项2. 重新初始化节点（从环境自动应用种子）"

如果您希望节点重新生成其配置并自动应用 `config.env` 中定义的种子节点，请使用此方法。
    ```
    source config.env
    docker compose down node
    sudo rm -rf .inference/data/ .inference/.node_initialized
    sudo mkdir -p .inference/data/
    ```
    重启节点后，它将像全新安装一样行为，并重新创建其配置，包括来自环境变量的种子。
    要验证实际应用的种子：

    ```
    sudo cat .inference/config/config.toml
    ```
    查找字段：
    ```
    seeds = [...]
    ```

### 硬件、节点权重和ML节点配置是如何实际验证的？

链上**不**验证真实硬件。它仅验证总参与权重，且这是用于权重分配和奖励计算的唯一值。

此权重在ML节点之间的任何细分，以及任何“硬件类型”或其他描述性字段，均仅为信息性内容，可由主机自由修改。

创建或更新节点时（例如，通过 `POST http://localhost:9200/admin/v1/nodes`，如 [https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/server/admin/node_handlers.go#L62](https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/server/admin/node_handlers.go#L62) 中的处理程序代码所示），可以显式指定硬件字段。如果省略，API服务将尝试从ML节点自动检测硬件信息。

实际上，许多主机在后端运行代理ML节点，多个服务器共用该节点；自动检测仅能看到其中一个服务器，这是一种完全有效的设置。无论配置如何，所有权重分配和奖励都仅依赖于主机的总权重，ML节点间的内部拆分或报告的硬件类型永远不会影响链上验证。

### 如何切换到 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`、升级ML节点并移除其他模型？

!!! warning "历史记录 — v0.2.8 / PoC v2迁移"
    此条目记录了 **v0.2.8 / PoC v2迁移（第155轮）**，当时 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 是唯一强制执行的模型。仅作历史参考保留。**自第308轮起，Qwen3-235B 已通过治理（提案78）退役，`MiniMaxAI/MiniMax-M2.7` 是当前基础/活跃的PoC模型。** 如需当前设置，请参阅 [主机快速入门](./host/quickstart.md) 和 [多模型PoC — 主机操作指南](./host/multi_model_poc.md)。

    本指南说明主机应如何根据v0.2.8模型可用性变化和即将推出的PoC v2更新来升级其ML节点。自第155轮起，ML节点配置需符合PoC v2要求。建议主机在该时间点前审查并准备其ML节点配置。PoC v2迁移可在第155轮后安排。迁移阶段结束后，不符合配置要求的ML节点权重将不予计入。

    **1. 背景：模型可用性变更（升级v0.2.8）**

    作为v0.2.8升级的一部分，活跃模型集已更新。

    **支持的模型（活跃集）**

    仅以下模型仍受支持：

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `Qwen/Qwen3-32B-FP8`

`Qwen/Qwen3-32B-FP8` 在迁移期间受支持，但不贡献于PoC v2就绪性或权重分配。参与PoC v2要求提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。

**已移除的模型**

所有先前支持的模型均已从活跃集中移除，不得再提供。

**2. PoC v2就绪标准（重要）**

成功参与PoC v2迁移需满足以下两项条件：

- 您的所有ML节点均提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。这是唯一贡献于PoC v2权重的模型。
- 您的所有ML节点均已升级至PoC v2兼容镜像：
    - ghcr.io/product-science/mlnode:3.0.12-post3
    - ghcr.io/product-science/mlnode:3.0.12-post3-blackwell

!!! note "重要"
	- 仅提供正确模型而不升级ML节点是不够的。
	- 未同时满足这两项条件的节点，在网络切换为单模型配置后将不再符合条件。
	- ML节点升级必须在迁移完成且PoC v2通过v0.2.8升级后的独立治理提案激活前完成。
	- v0.2.8 升级本身不会启用 PoC v2。

**3. 检查 ML 节点分配状态（推荐的安全步骤）**

在更改模型之前，您应检查当前的 ML 节点分配情况。查询您的网络节点管理 API：
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

- 第一个布尔值：节点在当前纪元是否正在提供推理服务
- 第二个布尔值：节点是否被安排在下一个 PoC 中提供推理服务

**推荐行为**

- 优先仅在第二个值为 `false` 的节点上更改模型
- 这可以降低风险，同时仍在观察 PoC v2 的行为
- 鼓励在多个纪元中逐步 rollout

**4. 更新 ML 节点的模型：仅保留受支持的模型**

预下载模型权重（推荐）。为避免启动延迟，请将权重预下载到 `HF_HOME`：
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
通过管理 API 应用的更改将在下一个纪元替换模型（[https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)）

!!! note 
	`node-config.json` 仅在网络节点 API 首次启动或本地状态/数据库被删除时使用。如需全新重启，请编辑它。对于现有节点，模型更新应通过管理 API 进行。

	**5. 升级 ML 节点镜像（PoC v2 所必需）**

	编辑 `docker-compose.mlnode.yml` 并更新 ML 节点镜像：

	标准 GPU
```
image: ghcr.io/product-science/mlnode:3.0.12-post3
```
NVIDIA Blackwell GPU
```
image: ghcr.io/product-science/mlnode:3.0.12-post3-blackwell
```
应用更改并重启服务。从 `gonka/deploy/join`：
```
source config.env
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml pull
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d
```
**6. 验证模型服务（将在下一个纪元生效）**

确认 ML 节点仅提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 服务，这是 PoC v2 权重和未来权重分配使用的唯一模型：
```
curl http://127.0.0.1:8080/v1/models | jq
```
可选：重新检查节点分配：
```
curl http://127.0.0.1:9200/admin/v1/nodes
```
!!! note "治理与 PoC v2 激活说明"

	PoC v2 是分阶段引入的，而非一次性激活。

	**第一阶段：观察（v0.2.8 升级后的当前状态）**

	v0.2.8 升级后，PoC v2 逻辑可用，但尚未用于权重分配。

	在此阶段：

	- 主机可以提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 或 `Qwen/Qwen3-32B-FP8`
	- 主机必须将其 ML 节点切换为提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 并升级为 PoC v2 兼容版本，才能参与 PoC v2 权重贡献。
	- 网络将观察采用情况，以评估主机对迁移到 PoC v2 权重的准备情况。

**第二阶段：治理提案（可选，未来）**
	一旦观察到足够比例的活跃主机采用（约 50%）：

	- 可能会提交单独的治理提案
	- 该提案可能请求批准激活 PoC v2 并使用 PoC v2 进行权重分配

采用阈值仅为观察性，不会触发任何自动变更。

**第三阶段：激活（仅在治理批准后）**

只有当治理提案获得链上批准时，PoC v2 才会成为权重分配的活动方法。

在此提案获批之前：

	- PoC v2 在权重分配方面保持非活动状态
	- 现有的 PoC 机制将继续用于确定权重

**摘要检查清单**

在激活 PoC v2 之前，请确保：

- ML 节点提供 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- 从配置中移除所有其他模型
- ML 节点镜像是 `3.0.12-post3`（或 `3.0.12-post3-blackwell`）

## 密钥与安全

### 对于在 v0.2.9 升级后创建的热密钥，应使用哪个 CLI 版本？

对于在 v0.2.9 升级后创建的新热密钥授予权限，应使用 CLI [版本 v0.2.9](https://github.com/gonka-ai/gonka/releases/tag/release/v0.2.9)。

### 我在哪里可以找到有关密钥管理的信息？
您可以在文档中找到关于 [密钥管理](https://gonka.ai/host/key-management/) 的专门章节。它概述了在网络中安全管理您应用程序密钥的流程和最佳实践。

### 我清除了或覆盖了我的共识密钥

如果您使用的是 **tmkms** 并删除了 `.tmkms` 文件夹，只需重新启动 **tmkms** — 它将自动生成新密钥。
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
在本地设备上备份**冷密钥**，位于服务器之外。

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

### 如何从暖密钥声明PoC意向？

与不使用冷密钥投票的模式相同：由冷密钥一次性授权，然后使用`authz exec`从暖密钥提交。参见[如果我无法访问冷密钥，或希望由另一个密钥代表我投票，该怎么办？](#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf)。

在当前主网（**v0.2.15**）中，`grant-ml-ops-permissions`不包含PoC意向、委托或拒绝。请单独授权这些类型。

从**v0.2.16**开始，`grant-ml-ops-permissions`包含`MsgDeclarePoCIntent`，且升级会回填现有冷→暖密钥对的授权。无需为此升级重新运行ML-ops授权。`MsgSetPoCDelegation`和`MsgRefusePoCDelegation`保持独立。

不要在`--from`设置为暖密钥时运行`declare-poc-intent`。内部消息必须来自参与者（冷）地址。使用`authz exec`提交。

1) 授权权限（一次，由冷密钥签名）

v0.2.16之后，跳过下面的`MsgDeclarePoCIntent`授权。仅当暖密钥将提交委托和拒绝时才授权它们。v0.2.16之前，授权全部三项。

第一个参数是暖密钥地址。`--from`是此密钥环中的冷密钥名称。

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

3) 意向（由暖密钥签名）

`generate-only --from`是冷密钥地址（bech32，无需冷密钥）。`authz exec --from`是此密钥环中的暖密钥名称。

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

计算证明（PoC）是一种共识机制，它用可证明的基于Transformer的计算能力取代基于资本或哈希的权重。它定义了如何衡量真实的AI计算并将其转换为治理和共识权重。PoC通过每个纪元末期进行的短暂同步Sprint执行。在Sprint之外，纪元用于现实世界的AI计算。实际上，术语“计算证明（PoC）”和“Sprint”常互换使用。当提及“下一个PoC”或“PoC阶段”时，通常指下一个Sprint，即计算证明的执行阶段。

### 什么是Sprint？

Sprint是计算证明的一个阶段。在Sprint期间，所有主机同时在具有随机化层的Transformer上运行AI相关的推理，处理非ces流，生成输出向量。主机在下一个纪元的权重与其处理的nonce数量成正比，前提是报告的输出可验证地由所需的Sprint模型生成。治理投票权使用[权重上限](#what-is-the-weight-cap)，该上限不能超过该权重。

### 如何模拟计算证明（PoC）？

你可能希望在自己的ML节点上模拟PoC，以确保在链上PoC阶段开始时一切正常运行。

要运行此测试，你需要有一个未注册到API节点的运行中ML节点，或暂停API节点。要暂停API节点，请使用`docker pause api`。测试完成后，你可以取消暂停：`docker unpause api`。

对于测试本身，你将向ML节点发送POST `/v1/pow/init/generate`请求，与API节点在PoC阶段开始时发送的请求相同：
[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32)

PoC使用的模型参数如下：[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41)

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
向ML节点代理容器的`8080`端口或直接向ML节点的`8080`发送此请求[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/deploy/join/docker-compose.mlnode.yml#L26](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/deploy/join/docker-compose.mlnode.yml#L26)

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
然后服务将开始将生成的nonce发送到`DAPI_API__POC_CALLBACK_URL`。
```
2025-08-25 20:54:58,822 - pow.service.sender - INFO - Sending generated batch to http://api:9100/
```
如果你暂停了API容器，或ML节点容器和API容器未共享同一Docker网络，则http://api:9100 URL将不可用。你可能会看到错误消息，表明ML节点未能发送生成的批次。重要的是确保生成过程正在发生。

### 确认比例为0意味着什么？如果发生这种情况我该怎么办？

0%的确认比例是一种异常情况，表明在纪元期间没有从你的API节点发送任何nonce，意味着节点完全没有参与确认计算证明（CPoC）。要调查原因，请检查API节点日志和ML节点日志，它们应能指示为何未提交nonce。

可能的原因包括：

- API节点配置错误或停机
- 公开暴露的管理端口，允许访问 ML 节点
- 共识节点落后于链，可能导致 PoC 参与超出允许窗口
- ML 节点驱动程序故障

为缓解此风险，请确保管理端口不公开访问，验证 API 节点正在运行并正确配置，监控共识节点同步状态，并为 ML 节点和驱动程序故障设置告警。

## 性能与故障排除

### 如何使用代理预发布版 (v0.2.8) 保护我的节点免受 DDoS 攻击？

现已发布新版本代理，包含速率限制和 DDoS 防护措施。

新增功能：

- 对 API/RPC 端点进行速率限制，以防止过多请求影响网络节点
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
**步骤 3**：拉取并重启代理
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull proxy
source ./config.env && docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d --no-deps proxy
```
**步骤 4**：关闭外部端口 26657

您可以关闭端口 26657 作为外部端口。

这是可选的，但强烈建议：
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

为了使用 `watch` 进行持续监控：
```
watch -n 5 'docker exec node wget -qO- http://localhost:26657/status | jq -r ".result.sync_info | \"Block: \(.latest_block_height) | Time: \(.latest_block_time) | Syncing: \(.catching_up)\""'
```

### Cosmovisor 更新需要多少可用磁盘空间？如何安全删除 `.inference` 目录中的旧备份？
Cosmovisor 在执行更新时会在 `.inference` 状态文件夹中创建完整备份。例如，您可以看到类似 `data-backup-<some_date>` 的文件夹。
截至 2025 年 11 月 20 日，数据目录大小约为 150 GB，因此每个备份将占用大约相同的空间。
为安全运行更新，建议拥有 250 GB 以上的可用磁盘空间。
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

您可能需要更新 `inference_url`，如果：

- 您更改了 API 域名；
- 您将 API 节点迁移到了新机器；
- 您已重新配置 HTTPS / 反向代理；
- 您正在迁移基础设施，并希望您的 Host 条目指向新的端点。

此操作无需重新注册、重新部署或密钥再生。更新您的 `inference_url` 将通过与初始注册相同的交易完成（即 `submit-new-participant msg`）。

链逻辑会检查您的 Host（参与者）是否已存在：

- 如果参与者不存在，交易将创建一个新参与者；
- 如果参与者已存在，仅可更新三个字段：`InferenceURL`、`ValidatorKey`、`WorkerKey`。

所有其他字段将自动保留。

这意味着更新 `inference_url` 是一种安全且非破坏性的操作。

!!! note 

    当节点更新其执行 URL 时，新 URL 将立即对来自其他节点的推理请求生效。但是，记录在 `ActiveParticipants` 中的 URL 直到下一个纪元才会更新，因为过早修改会使与参与者集合相关的加密证明失效。为避免服务中断，建议在下一个纪元完成前同时保持旧 URL 和新 URL 处于运行状态。

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

### 为什么我的 `application.db` 如此快速增长，如何修复？

某些节点存在 `application.db` 大小持续增长的问题。

`.inference/data/application.db` 存储链的状态历史（非区块），默认为 362880 个状态。

状态历史包含每个状态的完整默克尔树，保留较短时间的历史是安全的，例如仅保留 1000 个区块。

修剪参数可在 `.inference/config/app.toml` 中设置：

```
...
pruning = "custom"
pruning-keep-recent = "1000"
pruning-interval    = "100"
```

重启 `node` 容器后将应用新配置。但存在一个问题——即使启用了修剪，数据库清理仍然非常缓慢。

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

    2.3) 用新版本替换 
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
    - 仅允许 `api` 容器访问 RPC 和 API

一旦运行，将现有的 `tmkms` 卷移动到新节点（先禁用现有节点的区块签名）。

这是该方法的一般思路。如果您决定尝试并有任何疑问，请随时在 [Discord](https://discord.gg/REcpeYc7P7) 上联系。

=== "选项 4：升级到修剪修复版本"

现已提供修复程序，解决 `application.db` 在多种修剪配置下持续增长的长期问题。
	此改进由 [Lelouch33](https://github.com/Lelouch33) 贡献，并包含在发布版本 [`0.2.10-post6`](https://github.com/gonka-ai/gonka/compare/main...release/v0.2.10-post6) 中。通过更新的逻辑和以下设置，`application.db` 可保持在约 100 GB：

	- `SNAPSHOT_INTERVAL=1000`
	- `SNAPSHOT_KEEP_RECENT=2`
	- `pruning-keep-recent = "20000"`
	- `pruning-interval = "512"`

参考文献：

	- [https://github.com/gonka-ai/gonka/issues/819#issuecomment-3996332369](https://github.com/gonka-ai/gonka/issues/819#issuecomment-3996332369)
	- [https://github.com/gonka-ai/gonka/pull/867](https://github.com/gonka-ai/gonka/pull/867)

升级到此二进制文件后，修剪将在下一个快照区块后开始。此过程相对较重，可能在删除旧状态历史时暂时减慢 `node` 容器的速度。

为减少操作影响，建议逐个更新节点，并使用更高的 `pruning-interval`（例如 `512`）以避免过于频繁地修剪。

如果在修剪期间节点显著变慢，重启节点容器可能有助于其恢复。

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

### 升级 v0.2.14：升级前桥接更新

为帮助在主网升级期间保持以太坊桥接的稳定性，请提前将桥接镜像更新为 `0.2.14-post3`。
如果您有多个网络节点，请逐个更新。
请确保在 PoC 或 cPoC 之外执行此步骤。

从 **deploy/join**（其中包含 `docker-compose.yml` 和 `.dapi/`）运行所有命令。

**将桥接镜像更新为 0.2.14-post3**

```yaml
  bridge:
    container_name: bridge
    image: ghcr.io/product-science/bridge:0.2.14-post3
```

**重启桥接容器**

```bash
source config.env && docker compose up --force-recreate bridge
```

### 升级 v0.2.12：升级前模型清理

!!! note "重要"
	此清理过程**必须在升级前完成**。如果在清理模型前升级，您的节点将被拒绝并离线。

	版本 0.2.12 将移除所有不在升级后批准列表中的治理模型。在主网上，仅保留之前强制执行的模型和 Kimi。

	每个 DAPI 都在其本地持久化其 MLNode 配置。启动时，它会将每个配置的模型与链上治理列表进行验证。如果配置包含至少一个不受支持的模型，整个节点将被拒绝，主机将离线。

	版本 0.2.11 通过将运行时视图修剪为强制模型来掩盖了此问题，因此即使持久化配置中仍包含额外模型，`/admin/v1/nodes` 也显示为干净。版本 0.2.12 停止了这种修剪，意味着直接加载持久化配置。

	为解决此问题，以下脚本将查找 `/admin/v1/config` 中包含额外模型的每个节点，并向 `/admin/v1/nodes/<id>` 发送一个带有清理后配置的 `PUT` 请求。这些更改将在 60 秒内持久化。剩余模型的参数、硬件和端口将完全保留。未列出强制模型的节点将被跳过，需手动修复。

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

## 奖励计划

贡献者的完整指南请参阅 [奖励计划](bounty-program.md) 页面。以下是常见问题的简要解答。

### 什么是奖励计划？谁可以参与？奖励如何支付？

无需是主机即可参与：任何人都可以报告安全漏洞，或为更广泛的 Gonka 基础设施贡献修复、改进和新功能。

有两个互补的路径：

- **安全漏洞** 通过 Gonka 在 **[HackerOne](https://hackerone.com/)** 的项目处理。请参阅下面的 [如何报告安全漏洞？](#how-do-i-report-a-security-vulnerability)。
- **协议贡献**（修复、改进和新功能）由社区在 GitHub 上提出、审查和验证，奖励通过网络升级以稳定币形式发放。请参阅下方的[我如何为协议开发做贡献？](#how-do-i-contribute-to-protocol-development)。

### 我如何报告安全漏洞？

Gonka 在 **HackerOne** 上运行其安全计划。请通过 **[gonka.ai/docs/report-vulnerability](https://gonka.ai/docs/report-vulnerability/)** 表单提交所有漏洞报告，而不是在公共问题、拉取请求或聊天中公开披露。

HackerOne 上奖励的工作方式：

- **在您的报告被分类后，奖励将立即支付**——您无需提交修复方案。
- **修复方案可能获得单独支付。** 该金额将单独协商，不会自动作为报告奖励的额外部分。
- 权威的严重性模型、奖励金额、类别、范围和资格规则均由 HackerOne 上的计划定义。**在提交前请务必阅读 HackerOne 上的完整计划条款**，因为它们优先于此处的任何摘要。

### 漏洞严重性模型是什么？

最终的严重性分类和奖励金额由 Gonka 在 HackerOne 上的计划确定。下表仅作为严重性判断的一般性参考。

评估严重性的一种常见方式是： 
```
Risk = Impact × Likelihood
```
影响从网络层面进行评估（需要全网范围的影响才能评为高/关键）。仅影响单个参与方的问题通常最高为低或中等。

**影响级别**

| 级别 | 描述 | 示例 |
|----------|--------------------------------------|--------------------------------------------------------------------------|
| 关键 | 对整个网络造成灾难性影响 | 完全控制网络 |
| 高 | 大规模严重干扰 | 网络崩溃/停滞；模块资金被盗；所有参与方奖励错误 |
| 中等 | 中等程度的干扰，影响范围有限 | 共识或奖励完整性面临风险；单个参与方资金或可用性受损 |
| 低 | 对孤立参与方造成轻微影响，无链上影响 | 单个组件，对单个参与方产生轻微影响，非链上 |

**可能性**

- **有机——非故意；** 在正常条件下发生。通过概率估算（条件触发的频率、使用模式）。
- **故意——有利可图**——为获取经济利益而利用。当收益高且成本/复杂性低时，可能性更高。
- **故意——恶意干扰**——为造成干扰而利用。当影响全网且成本低时，可能性更高；仅影响单个参与方的干扰→可能性较低。

**风险矩阵**

| 影响 \ 可能性 | 高 | 中等 | 低 |
|---------------------|----------|----------|---------------|
| 关键 | 关键 | 关键 | 高 |
| 高 | 严重 | 高 | 中 |
| 中 | 高 | 中 | 低 |
| 低 | 中 | 低 | 信息性 |

### 如何为协议开发做出贡献？

如果您想帮助开发协议（而非报告安全问题），工作流程由 GitHub 上的社区驱动：

1. **开始讨论。** 在 [GitHub Discussions](https://github.com/gonka-ai/gonka/discussions) 中发布您的想法，先获得社区支持。相同主题可能已被讨论过，或当前方法可能是权衡结果。然后选择一个 [现有的 `up-for-grabs` 问题](https://github.com/gonka-ai/gonka/issues?q=is%3Aissue%20state%3Aopen%20label%3Aup-for-grabs) 或新建一个 Issue。在开始现有问题前，请留言说明工作已启动，并提供大致的预计完成时间。
2. **打开拉取请求。** 提交一个可靠的修复或实现，并向 [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/) 提交 PR。
3. **持续寻求评审。** 请其他社区成员对 Issue 或 PR 发表评论，以便该更改能够被审查并纳入网络升级。

**贡献奖励如何支付：** 被接受的贡献奖励将通过网络升级以 **稳定币** 形式支付。与所有链上操作一样，升级及其支付需经过治理批准。

### 我在哪里提出和讨论协议的想法？

- 将您的想法发布为 **[GitHub Discussions](https://github.com/gonka-ai/gonka/discussions)**。请从 **[欢迎来到提案 #795](https://github.com/gonka-ai/gonka/discussions/795)** 的入门指南开始，该指南说明了哪些内容适合此处以及如何撰写一个有力、结构清晰的提案。
- 在社区活跃的渠道中收集反馈——Telegram 群组、其他社区群组以及 [Gonka Discord](https://discord.gg/REcpeYc7P7)。请将关键背景信息汇总回 GitHub Discussions，以便完整历史记录保持可搜索且集中。

### 我在哪里可以看到当前的协议优先级？

社区一致的 **[Gonka 网络开发路线图](https://github.com/gonka-ai/gonka/blob/main/proposals/gonka-network-development-roadmap.md)** 描述了战略方向、路线图条目和当前协议开发的优先级。使用它来了解当前最重要的事项，并使您的贡献和提案与网络发展方向保持一致。

### 我在哪里可以看到谁获得了奖励、奖励内容和时间？

对于安全赏金，记录保存在 **HackerOne** 上的 Gonka 项目中。对于协议贡献，**链上** 是权威来源：支付在链上执行。您也可以在 [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/) GitHub 仓库中检查相关记录。Discord 的 `#bounty-awards` 频道会稍后发布部分信息，但可能不完整且非权威。

## 错误

### `No epoch models available for this node`

在这里您可以找到节点日志中可能出现的常见错误和典型日志条目示例。

```
2025/08/28 08:37:08 ERROR No epoch models available for this node subsystem=Nodes node_id=node1
2025/08/28 08:37:08 INFO Finalizing state transition for node subsystem=Nodes node_id=node1 from_status=FAILED to_status=FAILED from_poc_status="" to_poc_status="" succeeded=false blockHeight=92476
```
这实际上不是错误。它只是表明您的节点尚未分配模型。最可能的原因是您的节点尚未参与过冲刺，未获得投票权，因此尚未分配模型。
如果您的节点已通过PoC，则不应再看到此日志。如果没有，PoC大约每24小时进行一次。

### 从状态同步快照启动时如何修复 `err="no validator signing info found"`？

如果您在从状态同步快照启动时定期遇到 `err="no validator signing info found"`，这通常与 Cosmos SDK `iavl-fastnode` 行为有关。一个安全的解决方法是首次启动时禁用 `fastnode`，然后（可选）在节点完全同步后重新启用它。

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
	`main` 包含 v0.2.10-post6。从该版本开始启动的节点会自动应用此设置，因此您通常无需手动更改。

## 推理

!!! note 
    下面的多个回答讨论了该模型提供服务时的 `moonshotai/Kimi-K2.6` 请求形状。[提案101](./network-updates.md#proposal-101) 已将其从 `poc_params` 中移除；它仍存在于治理目录中，但不是PoC模型，目前也不提供服务——查询 `/v1/epochs/current/participants` 和代理的 `GET /v1/models`。`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 已由提案78移除。

### 为什么4,096个输出令牌限制会导致模型在思考时停滞——返回零个令牌？

**如果您遇到以下情况，则与此相关**

- 您看到 `content=null` 和 `finish_reason=length`。
- 模型是“沉默”的——使用情况显示有令牌，但没有文本输出。
- 带有 `max_tokens=100` 的探测请求没有任何返回。

**修复首选：Kimi-K2.6 的可用配置**

如果您没有时间深入排查——请将此负载作为起点复制。截至2026-05-28，它在两个公共代理上有效；在使用前请与您的代理运营商确认其是否仍为最新版本。

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

为何选择这些确切字段：

- `max_tokens: 4096` —— 让模型使用全部可用的输出配额。当前代理的有效上限为3,072（参见Q3）——更高值无意义。最低需256，否则网关可能强制将 `thinking_token_budget` 设为零。
- `thinking: {"type": "disabled"}` —— 通过聊天模板提示禁用隐藏思考。
- `thinking_token_budget: 0` —— 双重保障：在生成参数级别显式将配额归零（参见Q2）。
- **模型ID区分大小写：** `moonshotai/Kimi-K2.6`（大写K）在 `gonka-api.org` 上，`moonshotai/kimi-k2.6`（小写k）在 `gonkagate.com` 上。收到404？请调换大小写。与 `GET /v1/models` 响应交叉核对。

可直接使用的 curl 命令（替换 `<broker>` 和模型ID大小写）：

```bash
curl -sS https://<broker>/v1/chat/completions \
  -H "Authorization: Bearer $GONKA_API_KEY" \
  -H "Content-Type: application/json" \
  -d @payload.json
```

如果返回有意义的文本——问题出在您的原始负载上；逐项对比字段。如果 `content=null`——捕获响应中的 `id` 并发送给代理支持团队。

**首先检查规则是否在您的代理上生效**

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

以下规则描述的是最新网关代码（`devshard ≥ 0.2.13`）。您的代理可能尚未更新。不确定版本？——先运行上述首选修复。如果能返回有意义的文本，说明网关版本足够新。否则，请将 `response.id` 发送给代理支持团队，询问是否需要更新。

**模型和网关端会发生什么****Kimi-K2.6 特性。** 该模型会输出 `<think>…</think>` 块。**两个部分（`<think>` 和可见内容）均等消耗 `max_tokens`。** 当 `max_tokens` 较小时，模型会将全部配额消耗在 `<think>` 内，仅返回 `</think>`，而 vLLM 会将其作为特殊令牌剥离 → `content=null`，`finish_reason=length`。从客户端角度看——“0个令牌”。

**网关对 `thinking_token_budget` 的规则（PR #1202，devshard 0.2.13+）：**

| 条件 | 网关的作用 |
|---------|---------------------|
| `max_tokens < 256` | `ttb = 0`（强制为零，覆盖客户端） |
| `ttb` 未设置，`max_tokens >= 256` | `ttb = max_tokens / 2` |
| 客户端设置的 `ttb` | 使用客户端的值 |
| 始终 | 限制：`ttb ≤ 96,000` 和 `ttb ≤ max_tokens − 64` |

此外：

- **`max_tokens` 下限 → 16**（PR #1227）——以前 `max_tokens=1` 可靠地产生 `content=null`。现在它会静默提升至 16。
- **`thinking: {"type":"disabled"}` 镜像**（PR #1224）——网关将其镜像到 `chat_template_kwargs.thinking=false`。Kimi 聊天模板读取该关键字参数。

历史上产生 `content=null`（`max_tokens=1`，探测形状 `max=100, min=100, ttb=50`）的场景，现在通过最新网关返回非空内容。在 `gonkagate.com`（2026-05-25）上，`max_tokens=100` 无 `ttb` 时返回了约 50 个推理令牌——此时 force-zero-below-256 未激活。

**对于推理用户：**

- 请使用网关版本 ≥ 0.2.13（发布于 2026-05-23+）的代理重新测试。
- 观察到零令牌——捕获响应中的 `id` 并发送给代理。提取方法：

  ```bash
  curl ... | jq .id
  ```

  格式：`devshard-<short>-<short>`，例如 `devshard-7a4f-31b2`。发送位置：代理的支持通道（对于 `gonka-api.org`——网站上的支持链接；对于 `gonkagate.com`——`/contact` 部分）。
- **不要仅依赖 `thinking:disabled`**——为确保安全，请显式设置 `thinking_token_budget: 0`（参见 Q2）。

**对于代理：** 在 0.2.13 之前版本——请根据您的验证/发布周期更新（无需紧急：旧版本客户端和托管规则需要重新认证）。在更新前，客户端应用上述解决方法；在 `devshard-0.2.13` 后，零输出 `content=null` 的情况将消失。

### 使用 Kimi K2 时，整个令牌限制可用于思考而无实际输出。这是输出限制、带宽问题，还是上游问题？

**这是网关策略，而非模型限制。** `thinking_token_budget` 解析器（PR #1202）默认分配 `max_tokens / 2` 用于推理。在工具密集型流程中，预算在产生任何有用输出前已被耗尽。解决方法是显式设置 `thinking_token_budget: 0` 或 `thinking: {"type": "disabled"}`（网关通过 PR #1224 将其镜像到 `chat_template_kwargs`）。模型仅遵循预算。

原因与 Q1 相同——模型将 `max_tokens` 分配给 `<think>` 和可见内容。这不是带宽问题，也不是输出限制。

**两个规避方法**

1. **`thinking: {"type": "disabled"}`**——网关将其镜像到 `chat_template_kwargs.thinking=false`（Kimi 聊天模板读取该关键字参数）并移除顶层 `thinking`。`"adaptive"` 和 `"auto"` 被接受（Claude Code CLI / Anthropic SDK 预设，PR #1224）——两者均解析为 `enabled`。
2. **`thinking_token_budget: 0`**——显式设置为零会直接作为生成参数传递给 vLLM，可靠地将思考预算清零。

**重要细节：** 这两种机制作用于不同层级（聊天模板提示 vs 生成参数），互不重叠。`thinking:disabled` 不会自动清零 `thinking_token_budget`——在默认 `max_tokens=4096` 且仅设置 `disabled` 的情况下，模型仍会从网关解析器获得隐藏的 `ttb=2048`。我们的测试表明，Kimi 在推理密集型提示下仍尊重 `thinking:disabled`。模型文档（计划中的 `docs/chat-api/kimi-k2.6.md`）警告：在某些推理场景中模型可能忽略该提示——我们未复现，但仍做预防。**双重保障：** 对于关键流程，请同时发送这两个参数。

**数值确认**

相同的 bug 发现提示，`max_tokens=500`，答案含义相同：

| 配置 | usage.completion_tokens | 实际耗时 |
|---|---|---|
| `thinking: {"type":"disabled"}` | **65** | 3.6秒 |
| 默认（网关解析器 → ttb = max_tokens/2 = 250） | **312** | 12.5秒 |

默认预算的一半即使用于简单任务也会被隐藏思考消耗——因此建议在工具密集型/代理型流程中禁用思考。

**对于推理用户：**

- 工具密集型/代理型流程无需推理——`"thinking": {"type": "disabled"}`（Kimi）。
- 复杂推理——显式设置 `thinking_token_budget`（不要依赖默认 `max_tokens / 2`）。
- 如果 `thinking:disabled` 仍导致您的提示预算耗尽——显式复制 `thinking_token_budget: 0`。

**对于代理：** 在 0.2.13 之前版本——请按周期更新。在更新前，客户端应用上述解决方法。在主页上注明：Kimi 用于工具密集型流程需要 `thinking:disabled`，或显式设置 `thinking_token_budget`，或使用较大的 `max_tokens`。

### Kimi 的输入令牌上限为 4k 令牌，输出上限为 8,192 令牌。这些限制何时会提高？

**问题中的数字不正确**

- **输出上限：3,072 令牌**（在两个测试的经纪人上均如此，即使使用 `max_tokens=8000`，在恰好 3,072 时也会返回 `finish_reason=length`）。
- **输入：最多 240,000 令牌**（在主网 Kimi 部署中为 `--max-model-len`）。不是 4,000。

**输出上限的来源**

代码中的网络上限为 4,096（`RequestMaxTokensCap`），但有效限制更低。确切机制是一个黑箱。可能的解释（按可能性排序，**未通过公开代码确认**）：

1. 网关默认的 `DefaultRequestMaxTokens = 3,072` 未被经纪人运营商覆盖。
2. 经纪人运营商通过管理端点（`POST /v1/admin/settings`）为每个模型设置了 `request_max_tokens_cap = 3,072`。
3. 上游 DAPI 或主机端限制（例如 vLLM `--max-tokens-per-request` 或加载器约束）。

要确切了解——请向经纪人询问每个模型的 `request_max_tokens_cap` 值。

**3,072 令牌能容纳多少内容**

| 场景 | 是否能容纳在 3,072 令牌内？ |
|----------|-------------------|
| ~1,900–2,200 个常规英语单词 | 是 |
| ~600–800 行 Python/JS 代码 | 是 |
| 简短回答（5–10 句话） | 是 |
| 一次工具调用 + 中等 JSON（`arguments` ≤ 500 令牌） | 是 |
| 小型结构化输出（3–5 个摘要点） | 是 |
| 长文档摘要（>10k 源令牌） | 否 |
| 大型代码差异（>2k 行） | 否 |
| 单次响应中包含 3 个及以上并行工具调用 | 否 |
| 智能体循环：同时进行推理 + 工具调用 + 可见内容 | 否 |

对于第二组使用场景——请向经纪人申请提高上限（参见 **对经纪人**）。

**如何提高上限**

输出上限由**经纪人**控制，而非网络。要提高它——请联系您的经纪人：他们可以通过一次管理调用增加 `request_max_tokens_cap`（无需代码更改）。若要全局提升超过 4,096，则需向网关代码提交 PR 并发布新版本；您可以通过在 `gonka-ai/gonka` 上发起 GitHub 讨论来推动此事。

对好奇者/操作员：区块链存储每个模型的价格参数（`coins_per_input_token`、`coins_per_output_token`）和部署参数（`model_args`），但没有硬性输出限制字段——放宽限制是经纪人本地策略，而非治理定义的值。

**240k 输入的来源**

主网 Kimi-K2.6 部署是通过链上治理提案 v0.2.12（`inference-chain/app/upgrades/v0_2_12/upgrades.go:kimiGovernanceModel()`）注册的：

```text
ModelArgs: ["--max-model-len","240000",
            "--tool-call-parser","kimi_k2",
            "--reasoning-parser","kimi_k2"]
VRam: 720 (GB)
```

模型卡声明支持256K原生上下文。网关对输入无单独限制，仅受通用请求体大小（10 MiB）和消息数量（≤ 2,048）约束——详见`docs/chat-api/README.md`中的“请求限制”部分（计划中的文档）。

**重要注意事项（开放问题）**

即使代理同意提高输出上限，各个节点仍可能以较小的`--max-model-len`启动。网关路由层未考虑每台主机的上下文容量（[问题 #818](https://github.com/gonka-ai/gonka/issues/818)）。对于大负载（>50k），落在“小”节点上是系统性行为，而非瞬时随机现象。

**对于推理用户：**

- 实际输出上限由代理决定——请向其询问每个模型的`request_max_tokens_cap`值。
- 遇到小输入限制——这几乎肯定是某个节点上的`--max-model-len`，而非全局限制。路由层未考虑每台主机的上下文（问题 #818）；对于大负载（>50k），这是系统性问题。解决方法：重试或拆分请求为多个API调用。
- 遇到输出上限——请要求代理提高它。全网提升（超过4,096）需要代码变更；请通过GitHub Discussion在`gonka-ai/gonka`中提出。

**对于代理：**

- 按模型提升上限只需通过`POST /v1/admin/settings`配合`model_limits[].request_max_tokens_cap`进行一次管理员调用，无需代码变更。这会增加每请求的担保暴露风险，并可能导致触及每台主机的`--max-model-len`（节点上出现5xx错误）。仅在确认所有担保节点上的`--max-model-len`后，针对有明确需求的模型提升。
- 全网提升（超过4,096）需向网关代码提交PR并发布新版本。若长期存在大输出需求，请开启讨论。

### 像Hermes、OpenClaw这样带有30k+系统提示的代理为何在Kimi上失败？

**简要说明**

Kimi模型在模型和网关层面均接受30k+输入，但稳定性取决于路由。其原生窗口为256K，主网部署使用`--max-model-len 240000`，网关接受最大10 MiB的请求体。实测：单次约69,000提示词标记（≈800条消息 × 80词）可在5.5秒内完成。在持续/重复长请求（>50k）时，将遇到不稳定性（问题 #818）——对于大负载（215k），重复尝试可能因503失败。

**验证来源（均在`gonka-ai/gonka`中）**

- 原生上下文256K——`docs/chat-api/`中的模型卡（确切文件名作为chat-api文档集的一部分计划中）。
- 主网部署参数（链上）——`inference-chain/app/upgrades/v0_2_12/upgrades.go:kimiGovernanceModel()`。
- 请求体/消息限制（10 MiB，≤ 2,048条消息）——`docs/chat-api/README.md`（计划中），即“请求限制”部分。

**当30k失效时——两个典型原因****1. 代理负载中的单个被拒绝字段。** 网关维护严格的白名单。若代理发送了任一非标准字段（`tags`、`enforced_tokens`、`plugins`、`guided_json`）——整个请求将被拒绝并返回HTTP 400。Hermes特定的`tags`拒绝——详见`#reject-tags`在`docs/chat-api/troubleshooting.md`中的锚点（计划中）。实测：一个有效的69k负载 + `tags:["session:abc"]` → 2秒内返回HTTP 400。

**2. 路由至具有较小`--max-model-len`的节点。** 网关路由层在路由时未考虑主机的实际上下文大小（[问题 #818](https://github.com/gonka-ai/gonka/issues/818)；另见计划中的`known-issues.md` §3）。对于极长负载（>50k，尤其>200k），落在“小”节点上是**网络层面的系统性行为**，而非客户端错误：我们的测量显示5×215k = 0/5成功。请求将在vLLM端失败。

相关构建者请求：[问题 #1229](https://github.com/gonka-ai/gonka/issues/1229)（2026年5月开启），代理场景的阻塞问题——长推理链、工具调用兼容性、超出输出限制后的续接。

**快速自检清单**

1. 逐个移除字段`tags`、`enforced_tokens`、`plugins`、`strict`、`guided_json`、`guided_regex`、`guided_grammar`、`guided_choice`，每次移除后重新发送相同请求。
2. 若所有移除均无效——检查`tools[].function.parameters`中的schema深度（≤ 16）和节点总数（≤ 256），参见Q9。
3. 负载已清理但仍失败——这是网络层面问题（问题 #818）。解决方法：重试或拆分请求。

**对于推理用户：**

- 首先检查负载是否符合`docs/chat-api/README.md`中的白名单（计划中）。大多数Hermes/OpenClaw的400错误源于单个字段或schema。
- 通用代理消息如“上游模型提供商拒绝”具有误导性：部分代理将具体的网关400错误合并为通用消息，部分则传递原始信息（`"Chat completions parameter \"tags\" is currently rejected by the Gonka network..."`附文档链接）。代理对比——`comparison-brokers.md`（计划中）。**若某一代理显示通用错误——尝试另一代理以获取可读信息并定位根本原因。**
- 负载已清理但仍失败——网络层面问题（问题 #818）。解决方法：重试或拆分；对于持续>50k负载，单次重试往往不够——请拆分。

**对于代理：**

- (1) 在落地页、通过`/v1/models`端点或文档中明确显示每个模型的原生上下文窗口，并注明由于主机异构性，每请求有效容量可能更低（问题 #818）。部分代理故意省略此信息以避免过度承诺——这是一种可辩护的选择。(2) 在主机级容量披露实现前——考虑客户端过滤或“首选主机”列表。
- **用户体验：** 网关返回包含字段名和消息的具体400错误（`"Chat completions parameter \"tags\" is currently rejected by the Gonka network..."` + 文档链接）。我们建议在生产环境中将详细信息传递给客户端——这能加速诊断。**安全提示：** 详细信息可能暴露内部字段名、主机路径和验证器ID，有助于枚举或提示注入探测。保守的掩码是可辩护的默认值。若为安全起见将它们包装为通用`"upstream provider rejected"`——请采用混合方式：在异步日志/错误追踪中保留完整细节，向客户端返回带追踪ID的通用消息。代理兼容性映射——`docs/chat-api/agents.md`（计划中）。

### 为何Kimi在输出超过4k–8k标记时生成格式错误的JSON工具调用？

既非带宽限制，也非Gonka端限制。三个重叠原因。

**(a) `max_tokens`截断**

在测试的代理上，有效输出上限为3,072标记；网关网络上限为4,096。当助手在`arguments`中输出包含大型JSON块的工具调用及可见内容时，可能触及代理的实际上限，导致JSON被截断。关于各代理的覆盖详情——见Q3。

**(b) Kimi-K2.6 工具解析器ID重复冲突**

`[vLLM PR #21259 — UNVERIFIED]`。使用`n > 1`时，`kimi_k2`解析器在每个选择循环内重新计算`history_tool_call_cnt`——两个分支均获得`id = functions.<name>:0`。网关在vLLM响应中检测到重复ID，根据OpenAI规范拒绝请求并返回HTTP 400。锚点`#reject-duplicate-tool-call-id`在`docs/chat-api/troubleshooting.md`中（计划中）。上游修复——[vLLM PR #21259](https://github.com/vllm-project/vllm/pull/21259)（合并状态未经独立确认）。

**(c) Hermes工具解析器在多个工具块中出现JSONDecodeError**

`[vLLM #17790 — awaiting upstream fix]`。不同解析器，不同问题：当模型在一个响应中发出多个工具调用块时，出现`JSONDecodeError`——[vLLM #17790](https://github.com/vllm-project/vllm/issues/17790)。相关问题：`<tool_call>`在`<think>`中破坏Hermes解析——[vLLM #42021](https://github.com/vllm-project/vllm/issues/42021)。这些问题与Gonka无关——等待上游修复。

**推理用户：**

- **在客户端发送后续消息前，将 `tool_call.id` 重写为规范格式 `functions.<name>:<global_idx>`** —— 这是 Moonshot 的官方建议，并在 `docs/chat-api/troubleshooting.md#reject-duplicate-tool-call-id`（计划中）重复。另一种选择是使用全新的 UUID。
- **不要根据 ID 去重** —— 两个具有相同 ID 的调用可能包含不同的结果。丢失它们 = 丢失代理的工作。
- **对包含工具调用的响应提升 `max_tokens`**；大型 `arguments` 数据块会迅速达到上限。
- 通用代理错误“上游模型提供方拒绝”通常意味着网关端拒绝，而非模型问题。首先检查消息和 ID 是否重复，然后再怀疑模型（参见 Q4 中的代理差异）。

**对代理：**

- 考虑在网关端按 ID 去重——两个具有相同 ID 的工具调用可能包含不同结果；更安全的做法是**将 ID 重写为规范格式** `functions.<name>:<global_idx>`（不要去重）。在客户常见问题中记录此模式，并链接到 `troubleshooting.md#reject-duplicate-tool-call-id`。**安全提示**：若未仔细验证，简单的按 ID 去重会成为攻击面。规范化名称而非删除更安全。
- **UX：** 传递具体的网关错误消息（`"messages[N].tool_calls[M].id is duplicated"`），而非通用包装器——这能减少代理客户端的修复时间。**安全提示**：平衡调试友好性与信息泄露风险——参见 Q4。

### 启用受控解码能解决令牌上限问题吗？

**受控解码与令牌上限无关。** 该机制强制模型按指定模式（JSON Schema、正则表达式）生成输出，但不会改变令牌数量。关于上限问题——参见 Q3。

底层 vLLM 字段 `guided_json`、`guided_regex`、`guided_grammar`、`guided_choice` **会被网关以 HTTP 400 拒绝**（锚点 `#reject-guided-decoding` 在 `docs/chat-api/troubleshooting.md`（计划中））。原因——它们绕过了应用于 `response_format` / `structured_outputs` 封装的 xgrammar 边界，以缓解 CVE-2025-48944。

**结构化输出的正确字段**

`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 已不在主网（提案 78，纪元 308）。下表适用于 `response_format` 在 `moonshotai/Kimi-K2.6` 上运行时的行为——在发送 Kimi 请求前，请确认代理的 `GET /v1/models` 上的实时容量。

| 字段 | Kimi K2.6（当被提供时） | 备注 |
|------|-----------|---------|
| `response_format`（`type: "json_schema"` 或 `"json_object"`） | 可用 | OpenAI 标准。可靠选择。已通过公共代理实证验证。 |
| `structured_outputs` 封装（`json`/`regex`/`choice`/`grammar`/`structural_tag`/`json_object`） | HTTP 400（全网拒绝） | PR #1215（`StructuredOutputsValidator`）已在仓库中合并，但**截至 2026-05-25 尚未在生产主网激活**。代理拒绝时提示：`"Chat completions parameter `structured_outputs` is currently rejected by the Gonka network"`——错误引用的是开发分支 `dl/devshards-gateway-to-main`，而非主分支。这是一个**全网发布延迟**，而非单个代理问题。目前唯一可靠的结构化输出选项是 `response_format`。 |
| 同时使用两者（`response_format` + `structured_outputs`） | HTTP 400 / 502（取决于代理） | 网关在 vLLM 之前拒绝此组合（锚点 `#reject-structured_outputs-with-response_format`）。在 vLLM 0.20.0 中，字段通过 `dataclasses.replace()` 合并，违反了 `StructuredOutputsParams.__post_init__` 中的“仅允许一个”规则。 |

**推理用户：**

- 需要在代理和模型间实现最大可移植性——使用 `response_format`（处处可用）。`structured_outputs` 封装当前被全网拒绝。
- 不要在单个请求中同时使用 `response_format` 和 `structured_outputs`——HTTP 400。

**对代理：**

- 受控解码不会提升吞吐量。不要向客户承诺它能解决令牌上限问题。
- 关注 PR #1215（`StructuredOutputsValidator`）在所有路由上的部署——需要正则表达式/选择/语法结构化输出的客户端正在等待 `structured_outputs` 封装。

### 为什么生成速度波动如此剧烈？为何提速仅适用于推理令牌？

速度波动是一个真实且已知的开放性问题，根源存在于三个不同层级。

**1. 每主机减速/停滞（主机层）**

一项开放的研究任务——[问题 #818 "慢节点调查"](https://github.com/gonka-ai/gonka/issues/818)（自 2026 年 2 月起开放，优先级：高）。存在特定模式但无根本原因（计划中的 `known-issues.md`，第 1 节“主机接收后无流返回”和第 2 节“主机生成块后停滞”——有时一分钟后恢复，有时永不恢复）。

**2. 路由差异（代理层）**

两次连续请求之间，代理可能落在不同负载的主机上。端到端延迟随 `devshard-XXXX-YYY` 主机 ID 变化。在稳定主机上，每令牌生成速度基本保持不变。[¹]

[¹] 示例观察：在一次测试中（5 次请求，约 30 秒），端到端延迟变化导致 `tokens / total_latency` 的范围约为 8–54 tok/s，但该指标包含 TTFT，且非公开的波动指标。

**3. 网络层级的验证窗口（链层）**

在 PoC / Confirmation-PoC 事件期间（cPoC——在纪元内确认验证者工作的阶段），部分节点会暂时不可用。在纪元边界处，已知存在快照保留节点的问题，网关返回 `attempts: []`（路径上无可用主机）——从客户端角度看，表现为超时。该影响在代理服务的该模型节点越少时越明显；在提供者数量较少的模型上更为突出。

**“推理快于可见”——不是优先级，而是输出结构**

网关上没有专门用于推理token的快速通道。在devshard代码中，`delta.reasoning`、`delta.content`、`delta.reasoning_content`、`delta.tool_calls`均通过`sseChunkHasContent`以相同方式检测。每个token的速度相同。

启用思考功能的Kimi首先生成一个庞大的`reasoning_content`（数百至数千个token），然后生成一个简短的可见答案（数十至数百个）。不显示推理字段的客户端会看到“静默，然后突然一次性输出答案”。实际上模型一直在生成，只是结果被隐藏了。

**对于推理用户：**

- 选择一个发布正常运行时间/p50 TTFT指标的经纪人。可用的仪表板包括[gonka.pw](https://gonka.pw/)和[meter.gonka.gg](https://meter.gonka.gg/)（可能还有其他，此列表不完整）。
- 在遇到慢请求时，请记住负载大小：对于短负载，重试会落在不同的节点上；对于持续的大负载（>50k），落在窗口缩减的节点上是一个系统性问题（问题#818），仅重试可能无效——最好进行拆分。
- 想在模型计算时查看进度——在UI中渲染`delta.reasoning_content`（或`delta.reasoning`），例如放在折叠区块中。

**对于经纪人：**

- 整个网络最高优先级的共享问题。请向[问题#818](https://github.com/gonka-ai/gonka/issues/818)贡献生产日志/追踪数据——这为核心团队提供了他们没有的数据。
- 帮助实现主机端改进（分块gossip恢复、每个托管`lastAfterReq`跟踪——已在计划的`host-improvements.md`及相关问题中追踪）——这些直接解决路由/恢复的薄弱环节。

### 为什么速度因硬件而异——在B200上更快，在H200上更慢？

**速度取决于硬件——这是异构网络的正常现象。** 链上的PoC权重反映节点的实际性能（影响验证者的奖励份额），而经纪人本地路由时从托管池中选择可用主机——两次连续请求可能落在不同代际的GPU上。

**对于推理用户：** 速度取决于网络中的硬件分布。您无法直接选择硬件——您选择的是经纪人。需要可预测的延迟——请向经纪人询问他们默认路由到的硬件层级。

**对于经纪人：**

差异的确切来源（根据[`kaitakuai/experiments`](https://github.com/kaitakuai/experiments)的内部基准测试——未在gonka-api.org或gonkagate.com上测量）。以下Qwen3-235B数据为**历史数据**：该模型已在第308个纪元（提案78）从主网退役，目前不再提供服务。

| GPU | 内存 | sm | Qwen3-235B 每实例每分钟nonce数（历史） | 每GPU |
|-----|--------|-----|------------------------------|---------|
| 4×H100 SXM5 | 80 GB HBM3 | 90 | **1,248** @ batch=16 | ~312 |
| 4×H200 | 141 GB HBM3e | 90 | **1,408** @ batch=32–64 | ~352 |
| 2×B200 | 192 GB HBM3e | 100 | **1,984** @ batch=64 | **~992** |

- **H200 vs H100：** 每GPU +13%。相同芯片（sm_90），但HBM3e + 141 GB对比HBM3 + 80 GB → 允许大模型使用更小的TP和更快的KV缓存。
- **B200/B300 vs H100/H200：** 在历史Qwen3-235B FP8基准下，每GPU性能**约为3倍**。
- **Kimi-K2.6 INT4 — 具体数据：** 4×B200提供2,240 nonces/min = **每GPU ~560**（参见`experiments/2026-05/kimi_k26_int4_4xb200_q-int4-k2`）。16×H100 TP提供1,389 nonces/min = **每GPU ~87**（参见`experiments/2026-05/kimi-k26-int4-2x8xh100`）。每GPU的差异约为6倍；绝对数值上，每GPU的Kimi在相同硬件上比历史Qwen更慢（4×B200 Kimi INT4 ~560每GPU vs Qwen ~992每GPU）。
- **Kimi-K2.6 INT4 在Blackwell上：** `VLLM_USE_FLASHINFER_MOE_INT4=1`相比Marlin带来**+138%**提升（在`experiments/2026-05/kimi_k26_b300_eager_flashinfer`中进行A/B测试）。仅适用于Blackwell系列上的INT4 MoE工作负载（内核门控——`is_device_capability_family(100)`，覆盖B100/B200/B300；B300实际为sm_103a）。

**追踪与诊断：** 可观测性已在[PR #1046 "Implement dapi & devshard observability"](https://github.com/gonka-ai/gonka/pull/1046)中合并——增加了OpenTelemetry追踪、Prometheus指标和仪表板。如果Grafana没有每主机TTFT面板——请检查DAPI/devshard是否已更新，且仪表板已包含在构建中。

其他来源：仓库[`kaitakuai/experiments`](https://github.com/kaitakuai/experiments)（定期更新）、您从[gonka.pw](https://gonka.pw/)获取的每主机统计数据，以及来自[meter.gonka.gg](https://meter.gonka.gg/)的网络状态。想影响硬件分布——将devshard托管池向您偏好的GPU主机扩展。

### 为什么模型在Kilo Code中无法正确使用工具？

最可能有四种原因——网关应用了严格的参数白名单和对JSON Schema的严格限制。这不是Kilo特有的：任何编码代理（Cline、Continue.dev、OpenCode等）都会出现相同问题。

**1. 硬性拒绝（HTTP 400）——需要在客户端修复**

| 触发 | 原因 | 修复 |
|---------|---------|-----|
| 有效载荷中的 `tags` 字段 | 不属于 OpenAI Chat Completions 标准；民间 Hermes 约定；锚点 `#reject-tags` | 使用 `metadata`（OpenAI 标准）或 `user` 进行跟踪 |
| `tools[].function.parameters` 中的 Schema 深度 > 16 | CVE 驱动的上限 | 扁平化 Schema；PR #1187 将其从 5 提升至 16 |
| Schema 节点总数 > 256 | CVE 驱动的上限 | 减少它；PR #1195 将其从 128 提升至 256。具有大型输入 Schema 的 MCP 工具可能接近此限制；请在您的网关上测试。如果您确实需要一个节点数超过 256 的 MCP 工具——请提交功能请求。 |

**2. 静默强制转换/剥离——请求不会失败，但行为发生变化**

| 触发 | 网关的行为 | 备注 |
|---------|---------------------|---------|
| `tool_choice: "required"` | 静默 → `"auto"`（网络策略） | 锚点 `#coerce-tool-choice-required`。在大多数情况下，模型会对明显与工具相关的提示发起工具调用，但没有“必需”的保证 |
| `tools[].function.strict: true` | 静默丢弃该字段 | vLLM 解析器（`hermes`，`kimi_k2`）忽略该标志。PR #1193 |

已知客户端的兼容性矩阵：[`docs/chat-api/agents.md`](https://github.com/gonka-ai/gonka/blob/main/docs/chat-api/agents.md)（计划中）。一个基本可用的工具调用示例：[开发者快速入门 §1.4](https://gonka.ai/developer/quickstart/#4-tool-calling)。

**对于推理用户：**

- **使用 Kilo Code 生成的相同 curl 命令进行复现**（通过客户端调试日志或中间代理）。在 400 响应体中，网关通常会说明被拒绝字段的名称；代理可能会将消息掩盖为通用的“上游被拒绝”——但具体的问题字段通常只有一个。
- **与 `agents.md` 和 `troubleshooting.md` 中的列表交叉核对**（计划中）——大多数 400 错误都属于已记录的拒绝锚点（`#reject-tags`，`#reject-enforced_tokens`，`#reject-structured_outputs-kimi`）。
- **如果错误信息不清晰，请快速检查：** 检查字段 `tags`、`enforced_tokens`、`plugins`、`strict`、`guided_*`；逐个移除并重新发送请求。若无帮助——检查 Schema 深度（≤16）和节点数（≤256）。
- **被拒绝的字段未被记录**——请在 [gonka-ai/gonka](https://github.com/gonka-ai/gonka) 上提交问题，并附上捕获的请求。

**对于代理：**

- 仪表板上无 `agents.md` 链接——这是一个低成本的快速改进点。
- 有能力就 `gonka-ai/gonka` 中的非标准字段提交问题——这将帮助生态中的每个代理。

### Hermes 和 OpenClaw 等代理为何在 Kimi 上无法完成工具任务？

**三个因素的组合**

原始 FAQ 版本提到了第四个——特殊标记清理器——但那涉及安全/提示注入，而非工具调用失败；PR 修复被推迟，因为 Kimi 正确处理了特殊标记（实证）。

1. **网关默认将一半 `max_tokens` 分配给思考过程**（参见 Q1/Q2）。在默认 `thinking_token_budget = max_tokens / 2` 下，它在模型开始生成工具调用前就已耗尽 `<think>`。对于工具密集型代理流程，预算在产生有用输出前就已耗尽。缓解方法——显式设置 `thinking_token_budget: 0`（Q2）。这是网关策略，而非模型限制。
2. **输出上限 3,072（有效）/4,096（网络上限）对于工具密集型输出而言过于紧张**（Q3）。大型 `arguments` 数据块 + 可见内容很容易触及上限。
3. **上游 vLLM 工具解析器的缺陷**（Q5）：重复的 `tool_calls[].id` 与 `n>1` 冲突（[vLLM PR #21259 — 未验证](https://github.com/vllm-project/vllm/pull/21259)）以及 hermes 解析器在多个工具块上的 `JSONDecodeError`（[vLLM #17790](https://github.com/vllm-project/vllm/issues/17790)）。

构建者痛点及链接：[issue #1229](https://github.com/gonka-ai/gonka/issues/1229)——长推理链、工具调用兼容性、超出输出限制后的续写被列为代理编码工作流的阻塞问题。

**对于推理用户：**

- **对于 Kimi，这是强制要求：** `"thinking": {"type": "disabled"}` + `"max_tokens": 4096`（或显式设置 `thinking_token_budget: 0`，参见 Q2 的双重保障）。这为工具密集型输出释放了全部上限。实证：Kimi 轻松地在约 4 秒内一次响应中发出 5 个并行工具调用。
- **在客户端控制 tool_call.id** —— 将其重写为规范格式 `functions.<name>:<global_idx>`（Q5），以避免网关因重复 ID 而拒绝。
- **控制 Schema** —— 保持深度 ≤ 16 且节点数 ≤ 256（Q9）。具有大型输入 Schema 的 MCP 工具可能无法通过。

**对于经纪人：**

- 将上限提升（Q3 — 按模型 `request_max_tokens_cap` 通过 `/v1/admin/settings`）与上述建议结合 —— 这涵盖了您网关上主要的代理故障类别。

### OpenCode 无法应用请求的代码更改（中途截断句子）。这是什么原因？

三种原因；客户端可以绕过其中两种，但无法绕过第三种。

1. **`max_tokens` 在大差异时被截断。** 大代码补丁无法适应有效上限 3,072（Q3）。解决方法：将差异拆分为多个工具调用 —— 模型在每次调用中更容易适应预算。
2. **vLLM 在边缘参数下崩溃** —— 一系列 8 个合并的 PR（#1170、#1171、#1172、#1174、#1180、#1212、#1215、#1216）增强了对导致引擎崩溃字段的防护。在最近的网关（≥ `devshard 0.2.13`）上，大多数已知的崩溃场景被 400 个验证器拦截，而非崩溃。
3. **主机在接收后丢弃流**（开放 —— 如计划的 `known-issues.md` §1 所述）—— 主机接受了请求，但不返回数据块。这是网络层面的问题，客户端无其他解决方法，只能重试。

**对于推理用户：**

- **对于 Kimi：** `"thinking": {"type": "disabled"}` + `"max_tokens": 4096`。大差异 —— 拆分为多个工具调用。
- **长期：** 经纪人上限为 Q3，工具调用规范 ID 格式为 Q5。

**对于经纪人：** 在客户常见问题解答中记录针对编码代理客户端的“拆分大差异”模式。

### 是否存在一个模型能同时处理输入和输出而无任何权衡？

**MiniMax-M2.7** 于 2026-05-28 左右通过链治理升级 v0.2.13 上线主网。已在两个经纪人上验证为在线。澄清：问题中“Qwen 输出上限为 8,192”不准确 —— 所有模型的输出上限相同（Q3 为 3,072 / 4,096），而非模型侧。`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 本身**未上线主网**（在第 308 个周期被提案 78 移除）。`moonshotai/Kimi-K2.6` 仍存在于治理目录中，但在[提案 101](./network-updates.md#proposal-101)后不再是 PoC 模型，目前未被提供服务 —— 请检查经纪人的 `GET /v1/models`。`zai-org/GLM-5.3-Flash` 是提案 101 的 PoC 模型（`penalty_start_epoch` 394）。

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

**MiniMax 与 Kimi 的重要区别：**

- **`<think>` 块在 `delta.content` 中**（不在像 Kimi 的 `reasoning_content` 中）—— `minimax_m2_append_think` 解析器的行为。如果不需要它们出现在最终文本中，请在客户端解析这些标签。
- **工具调用 ID `chatcmpl-tool-<hash>`** —— 已经通过形状保证唯一，因此关于规范 ID 重写的 Q5 建议不适用。

相关工件：PR #1163 权重缩放（2026-05-13 合并，与 Kimi 经济模型对齐）；PR [#1226](https://github.com/gonka-ai/gonka/pull/1226)（开放，未合并）—— 在已部署模型之上进行的网关端重构，非阻塞项。

**对于推理用户：** MiniMax-M2.7 ID 在 gonka-api.org 上为 `MiniMaxAI/MiniMax-M2.7`，在 gonkagate.com 上为 `minimaxai/minimax-m2.7`——参见大小写敏感性 Q1。请在经纪人实际在 `GET /v1/models` 上列出的模型中进行选择。不要发送 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。

**对于经纪人：** 部署是通过 v0.2.13 升级由网络完成的。未提供 MiniMax——请检查 mlnode-image 是否支持上述部署参数且主机已更新。PR #1226（开放）将改进用户体验（按模型分发、工具消息形状），但不构成阻塞。

### 为什么没有可用的网页搜索？

**按设计——Gonka 是一个推理网络**，而非代理框架。插件/网页执行属于客户端代理层或提供增值服务的经纪人的关注点，而非推理路径。

**具体而言：** 2026-05-25 我们通过两个经纪人测试了相同的 `plugins` 负载。`gonka-api.org` 静默剥离该字段（HTTP 200，锚点 `#strip-plugins` 在 `docs/chat-api/troubleshooting.md` 中（计划中））；`gonkagate.com` 以 HTTP 400 `"Plugin config is invalid"` 拒绝它。两者均符合网关合同的合理解释：一种偏向宽松解析（静默剥离），另一种是严格验证（拒绝未知字段）。在两种情况下 `plugins` **均未执行**：vLLM 没有插件执行路径，若悄悄传递该字段则暗示了不存在的后端能力。在迁移经纪人时，请考虑这种差异（详情见 `comparison-brokers.md`（计划中））。

**对于推理用户：** 在您自己的代理层（LangChain、LlamaIndex、您自己的封装）中运行搜索，将结果注入 `messages[].content` 后再调用 `/v1/chat/completions`。这是所有 OpenAI 兼容端点的标准模式。

**对于经纪人：** 这是一个差异化机会——经纪人层面的增值服务（“我们执行搜索并将结果注入消息”）是合法的产品。完全在 Gonka 之上实现，无需协议变更。**安全提示：** 剥离 `plugins` 可能反映的是反滥用策略（而非用户体验失败）——如果您计划将插件执行作为产品提供，请仔细思考。若将其作为标准提供——请在 [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/discussions) 上发起生态系统讨论。

### 何时会支持可靠的网页抓取？

**按设计，这不在 Gonka 的路线图上。** 正确的位置是侧车或经纪人层的增值服务。

**对于推理用户：** 构建或购买一个抓取服务（Tavily、Exa、Perplexity API 用于搜索；trafilatura/Readability 用于解析），标准化为文本，通过 OpenAI 兼容调用发送。已有大量现成解决方案。

**对于经纪人：** 想将其作为分级服务提供——请在 [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/discussions) 上发起生态系统讨论，以便社区就通用约定达成一致（例如，每个人都一致部署的侧车）。

### Context7 文档研究——摘要失败。这是输出令牌限制吗？

与以下问题相同的阻塞项：“Kimi 的输入令牌上限为 4k，输出上限为 8,192 令牌。这些限制何时会提高？” 输出上限（有效 3,072 / 网络上限 4,096）对于“工具结果正文 + 摘要一次性响应”来说过于紧张。思维已启用——其中一半会占用此处（Q1/Q2）。

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

- 使用上述负载作为模板。`response_format` 将输出压缩为所需形状，节省预算。
- 如果文档较长并达到上限（`finish_reason=length`）——将其拆分为 N+1 次调用：一次获取+规划，其余为分段摘要；在客户端侧拼接。
- 不要将 `response_format` 与 `structured_outputs` 封装合并——HTTP 400（Q6）。
- 模式：深度 ≤ 16，节点 ≤ 256（Q9）。

**对于经纪人：** `response_format` 是最简单且最可移植的缓解方案，无论您的上限提升策略如何。一旦您的管理配置支持按模型 `request_max_tokens_cap`，可考虑提供按客户上限提升选项。

### Gonka 没有 KV 缓存。何时会添加缓存？

**简短回答：无明确时间表。** 在 Gonka 网关端一切已就绪——阻塞项在上游 vLLM 侧，issue [#33264](https://github.com/vllm-project/vllm/issues/33264) 已开放 4 个月以上，尚未合并 PR。在该问题解决前，请求中的 `prompt_cache_key` 字段将**被静默忽略**——请不要包含它，以免依赖不存在的行为。

vLLM 前缀 KV 缓存工作在每个 ML 节点上。网关级 `prompt_cache_key` / `cache_key` 当前被静默剥离——这是由未合并的上游 vLLM PR 阻塞的限制。

**当前现状**

- **网关行为：** `prompt_cache_key`（OpenAI 标准）和 `cache_key`（Moonshot Kimi 约定）均被静默剥离——均未到达 vLLM。锚点：`docs/chat-api/troubleshooting.md#strip-prompt_cache_key` 和 `#strip-cache_key`（计划中）。
- **上游阻塞：** vLLM 使用 `cache_salt` 字段进行提示缓存隔离（RFC #16016，PR #17045）。将 `prompt_cache_key` 别名为 `cache_salt` 是自 2026 年 1 月起开放的 [vLLM #33264](https://github.com/vllm-project/vllm/issues/33264)，目前尚未合并 PR。
- **安全理由：** 在未隔离的情况下直接转发 `cache_key` 是不安全的——已发布 [提示缓存时序侧信道攻击（arxiv 2502.07776 PROMPTPEEK）](https://arxiv.org/abs/2502.07776)。网关无法实现虚假的缓存隔离保证。
- **80–90% 的命中率并非 Gonka 的声明。** 它要么是对某人营销材料的误读，要么是与 OpenAI / Anthropic 原生缓存（保证单个提供商内粘性路由）的混淆。

**重要架构注意事项**

即使 vLLM #33264 合并且网关添加了哈希 → `cache_salt` 桥接，缓存仍为**每个 vLLM 实例独立**。Gonka 的多主机路由意味着两个具有相同 `cache_key` 的请求可能落在具有不同前缀缓存的不同主机上。在没有粘性路由（目前不存在）的情况下，保证类似 OpenAI 的 ~80% 命中率在架构上非常困难。三个阻塞项（上游 vLLM PR、网关桥接、粘性路由）目前均未上线。

**对于推理用户：** 今天无需操作——`prompt_cache_key` 和 `cache_key` 是无操作项。不要依赖这些字段进行成本优化。

**对于经纪人：** 在 vLLM #33264 合并前，无需网关端更改。希望加速进展——请在该上游问题中评论或贡献。合并后，Gonka 网关将添加一个桥接，同时启用这两个字段。

### Kimi 在 Gonka 网关上何时启用图像输入？

**目前不可用。** 预计发布时间为 v0.2.14 或更高版本（当前为 0.2.15），无固定日期。多模态负载（`messages[].content` 包含 `type: "image_url"` 或 `"video_url"`）目前在两个公共经纪人上均返回 **HTTP 400**。

**正在进行中，计划已编写并分为多个阶段。** 计划文档 `multimodal-inference-plan.md` 在 `gonka-ai/gonka` 中（约 466 行，6 个阶段——ML 节点、Host↔ML 节点、Broker/DAPI、Devshard 协议等）。在发布前，通过下方的 issue / PR 跟踪更容易。

**当前硬性阻塞项**

1. **多模态专用特殊标记清理器。** Kimi-K2.6 聊天模板接受 `image_url` / `video_url` 内容部分，但网关当前仅验证文本。多模态负载（图像 URL、替代文本、元数据）提供了额外的注入面，必须进行验证。安全审查将其标记为第二阶段阻塞项。**目前尚无针对此特定多模态威胁的公开 CVE；内部跟踪正在进行中。**

2. **独立的 VLM 验证审查。** 图像输入的验证方法需要独立确认。问题 [#1026](https://github.com/gonka-ai/gonka/issues/1026)（初步研究：Qwen2-VL-2B F1=100% 中间层）+ [#1198](https://github.com/gonka-ai/gonka/issues/1198)（重新验证，开放给贡献者）。

**目标：** v0.2.14+，但尚无明确时间表；受问题 #1198（独立验证，开放给贡献者）阻塞。

**目前经实证确认的内容：** 包含 `{type:"image_url"}` 的 `messages[0].content` 数组请求会返回 HTTP 400（已在 Kimi 上验证）。网关层面不接受多模态输入。

**对于推理用户：** 目前不可用。

**对于经纪人：** 加快进度的三种方式：

1. 认领问题 [#1198](https://github.com/gonka-ai/gonka/issues/1198)（开放给贡献者）——独立的 VLM 验证审查是最关键的阻塞项。
2. 审查 PR [#1150 "vlm benchmark"](https://github.com/gonka-ai/gonka/pull/1150)。
3. 当计划的第 1-3 阶段变得可实现时——准备网关能力注册表（第 3 阶段）；操作员配置将决定您的经纪人接受哪些内容类型。
