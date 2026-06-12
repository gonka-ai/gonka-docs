# 投票权重、创世守护者与委托

## 已质押权重的计算

总质押权重是所有满足 `validator.tokens` 的已质押验证者的 `tokens > 0` 之和：

```text
total_bonded = Σ validator.tokens   (over all bonded validators with tokens > 0)
```

每个验证者的 `tokens` 值由推理模块在每次纪元转换时通过 `Staking.SetComputeValidators()` 设置。  
对于绝大多数验证者：

```text
validator.tokens = participant.weight   (their PoC weight in the current epoch)
```

对于创世守护者（Genesis Guardians），首先会应用一个额外的算力增强步骤（见下文）。

---

## 创世守护者（Genesis Guardians）

一组由项目团队运营的引导验证节点，其地址被硬编码在链参数中。它们将获得临时的算力提升，使其总质押量超过 33% 的治理否决阈值。

??? note "当前主网上的创世守护者列表"
 
 
  - `gonkavaloper1y2a9p56kv044327uycmqdexl7zs82fs5lyang5` (`gonka-1`)
 
 
  - `gonkavaloper1dkl4mah5erqggvhqkpc8j3qs5tyuetgdc59d0v` (`gonka-2`)
 
 
  - `gonkavaloper1kx9mca3xm8u8ypzfuhmxey66u0ufxhs70mtf0e` (`gonka-3`)

该列表可通过治理机制配置（`genesis_guardian_params.guardian_addresses`），在引导阶段预计不会发生变化。

相关机制记录在官方提案中：

- [早期网络保护提案](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)

???
+ note "目的"
 
 
  - 防止在早期质押量较低阶段出现 67% 的共识控制攻击。
 
 
  - 通过开发者否决权阻止恶意的治理提案。
 
 
  - 针对协议漏洞提供快速响应能力。
 
 
  - 使在引导阶段低成本获得多数控制权在经济上变得无利可图。

---

### 守护者算力增强计算

在 `SetComputeValidators` 运行之前，推理模块会应用 `applyEarlyNetworkProtection`，其算力增强计算方式如下：

```text
other_total         = total_network_power − Σ guardian_original_power
total_enhancement   = other_total × multiplier
          # multiplier = 0.52
per_guardian_power  = total_enhancement / guardian_count

guardian.tokens     = per_guardian_power
                # original PoC weight is REPLACED
non_guardian.tokens = participant.weight
                # unchanged
```

**效果（在每次纪元转换时测量）：**

- 在增益生效的瞬间，三个守护者（Guardian）的总质押份额目标为总质押量的 `multiplier / (1
 
+ multiplier) = 0.52 / 1.52 ≈ 34%` —— 在有三个守护者的情况下，每个约为 `11.4%`（合计 `0.52 / (3 × 1.52)`）。
- 此 `≈34%` 是增益运行期间公式所达到的水平，并非固定的稳态值。守护者的质押权重每纪元设定一次，因此随着网络其余部分的PoC权重增长，守护者合计份额会逐渐低于34%。在撰写本文时，主网上线的实际数据显示，三个守护者的质押份额合计约为 `27%`（每个约 `~9%`）—— 即目前低于 `>33%` 的否决线。请勿假定守护者持续拥有否决权。
- 设计初衷是让守护者接近否决强度（`>33%`），但低于通过门槛（`>50%`）：足以阻止恶意提案，但永远不足以单独通过任何提案。
- 无法通过该机制获取价值或单方面更改共识——任何操作均需守护者之间的协作。

---

### 守护者增益终止条件

当满足以下两个链上条件时，该增强机制将自动停用（无需治理投票）：

```text
total_network_power >= network_maturity_threshold      (currently 15,000,000)
current_height      >= network_maturity_min_height     (currently 3,000,000)
```

实时网络当前状态：

- 高度阈值（`3,000,000`）已被突破。
- 网络总算力仍远低于`15,000,000`，因此算力加成仍处于激活状态。
- 当网络总算力首次在纪元切换时超过`15,000,000`，加成机制将关闭；届时，守护者验证节点的`tokens`将与其算力值相等，与其他所有验证节点一致。

两个阈值均可通过治理机制调节（`network_maturity_threshold` 和 `network_maturity_min_height`），如有需要，可通过成功的治理提案调整激活截止条件。

---

## 治理投票权委托（冷钥至温钥）

如果持有投票权的密钥并非您日常操作所用的密钥，可预先授予治理投票权限。

在此设置中：

- 授权方（Granter）= 持有投票权的账户（冷钥）
- 被授权方（Grantee）= 代表授权方提交投票的账户（温钥）

???
+ note "您想参与投票，但无法访问持有投票权的密钥。"
    请联络该密钥的所有者，请求其授权您的密钥代表其进行投票。若无此授权，您的密钥无法为该投票权提交治理投票。

### 其他密钥代表您投票

请使用以下 `grant` 命令，从持有投票权的密钥执行。这将授权被授权密钥代表您提交治理投票。  
此项委托仅允许对治理提案进行投票，被授权方仍可为其自身密钥投票。授权方可随时撤销此权限。

#### 1. 授予投票权限（由授权方密钥执行）
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
    
#### 2. 验证授权是否存在（从任意节点运行）
=== "命令"
 
 
 
 
```
    ./inferenced query authz grants <GRANTER_GONKA_ADDRESS> <GRANTEE_GONKA_ADDRESS> \
      --node="<NODE_URL>/chain-rpc/" \
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
    
#### 3. 使用受赠者进行投票
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
    ./inferenced tx authz exec /tmp/authz-vote.json \
      --from=<GRANTEE_KEY_NAME> \
      --chain-id=gonka-mainnet \
      --home .inference \
      --keyring-backend file \
      --node="<NODE_URL>/chain-rpc/" -y
 
 
 
 
```
    
=== "示例响应"

 
 
 
 
```
    {
        "height": "0",
        "txhash": "C31311D9C43DD6F1DDE7CA143989A0551E3075C2FA0A2BB5F054A120AE552B2B",
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

    `code: 0` 表示投票交易已被接受——这表明你的投票已成功提交。CLI 会返回带有 `txhash` 的广播回执；在交易被包含进区块之前，`height` 为 `0`。

---

## 参与资格概览

| 状态 | 可投票？ | 投票权重 |
| --- | --- | --- |
| 当前纪元中的活跃参与者 | 是 |  |
| 当前纪元中的创世守护者 |  |  |
| （已提升） |  |  |
| 上一纪元 PoC 失败（非活跃） |  |  |
| CPoC 失败，已被移出纪元 |  |  |
| 被关押的验证者 |  |  |
| （直到解押并重新质押） |  |  |
