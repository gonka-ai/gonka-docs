# 投票权重、创世守护者与委托

## 已质押权重的计算

总质押权重是所有处于质押状态且 `tokens > 0` 的验证者的 `validator.tokens` 之和：

```text
total_bonded = Σ validator.tokens   (over all bonded validators with tokens > 0)
```

每个验证者的 `tokens` 值由推断模块在每次纪元转换时通过 `Staking.SetComputeValidators()` 设置。  
对于绝大多数验证者：

```text
validator.tokens = participant.weight   (their PoC weight in the current epoch)
```

对于创世守护者（Genesis Guardians），首先会应用一个额外的增强算力步骤（见下文）。

---

## 创世守护者（Genesis Guardians）

一组由项目团队运营的引导验证节点，其地址被硬编码在链参数中。它们会获得临时的算力提升，使其合计质押量超过 33% 的治理否决阈值。

??? note "当前主网上的创世守护者列表"
 
   - `gonkavaloper1y2a9p56kv044327uycmqdexl7zs82fs5lyang5` (`gonka-1`)
 
   - `gonkavaloper1dkl4mah5erqggvhqkpc8j3qs5tyuetgdc59d0v` (`gonka-2`)
 
   - `gonkavaloper1kx9mca3xm8u8ypzfuhmxey66u0ufxhs70mtf0e` (`gonka-3`)

该列表可通过治理配置（`genesis_guardian_params.guardian_addresses`），但在引导阶段预计不会发生变化。

该机制在官方提案中有详细说明：

- [早期网络保护提案](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)

???
+ note "目的"
 
   - 防止在早期质押量较低阶段出现 67% 的共识控制权 takeover。
 
   - 通过开发者否决权阻止恶意的治理提案。
 
   - 对协议漏洞提供快速响应能力。
 
   - 使在引导阶段以低成本获取多数控制权在经济上变得无利可图。

---

### 守护者算力增强计算方式

在 `SetComputeValidators` 执行之前，推理模块会先应用 `applyEarlyNetworkProtection`，其算力增强的计算方式如下：

```text
other_total         = total_network_power − Σ guardian_original_power
total_enhancement   = other_total × multiplier          # multiplier = 0.52
per_guardian_power  = total_enhancement / guardian_count

guardian.tokens     = per_guardian_power                # original PoC weight is REPLACED
non_guardian.tokens = participant.weight                # unchanged
```

**效果（在每次纪元转换时测量）：**

- 在增益生效的瞬间，Guardian 的总份额目标为 `multiplier / (1
 + multiplier) = 0.52 / 1.52 ≈ 34%` 的总质押量——当有 3 个 Guardian 时，每个约占据 `11.4%`（`0.52 / (3 × 1.52)`）。
- 这个 `≈34%` 是增益运行时公式所达到的水平，并非固定的稳态值。由于 Guardian 的代币权重每纪元仅设置一次，随着网络其余部分的 PoC 权重增长，Guardian 的总份额会逐渐低于 34%。在撰写本文时的主网实际运行中，三个 Guardian 的总份额约为 `27%`（每个约 `9%`），即目前低于 `>33%` 的否决线。请勿假设 Guardian 持续拥有否决权。
- 设计初衷是让 Guardian 维持在接近否决门槛（`>33%`）但低于通过门槛（`>50%`）的水平：足以阻止恶意提案，但永远不足以单独通过任何提案。
- 无法单独获取价值或单方面更改共识——任何操作均需多个 Guardian 协同完成。

---

### Guardian 增益终止条件

当满足以下两个链上条件时，增益将自动关闭（无需治理投票）：

```text
total_network_power >= network_maturity_threshold      (currently 15,000,000)
current_height      >= network_maturity_min_height     (currently 3,000,000)
```

当前主网状态：

- 高度阈值（`3,000,000`）已被跨越。
- 全网总算力仍远低于 `15,000,000`，因此增益机制仍处于激活状态。
- 当全网累计 PoC 权重首次超过 `15,000,000` 后的下一个纪元切换时，增益机制将关闭；届时，Guardian 验证者的 `tokens` 数值将等于其 PoC 权重，与其他所有验证者一致。

上述两个阈值均可通过治理机制进行调整（`network_maturity_threshold` 和 `network_maturity_min_height`），如有需要，可通过成功的治理提案修改激活截止条件。

---

## 治理授权（冷钱包到温钱包）

如果持有投票权的密钥并非您日常操作所使用的密钥，可预先授予治理投票权限。

在此设置中：

- 授权方（Granter）= 持有投票权的账户（冷密钥）
- 被授权方（Grantee）= 代表授权方提交投票的账户（温密钥）

???
+ note "您想参与投票，但无法访问持有投票权的密钥。"
    请联系该密钥的所有者，请求其授权您的密钥代为投票。若无此授权，您的密钥无法代表该投票权提交治理投票。

### 其他密钥代您投票

请使用以下 **grant** 命令，从持有投票权的密钥执行。这将授权被授权密钥代表您提交治理投票。  
该授权仅限于治理提案投票，被授权方仍可同时为自己投票。授权方可随时撤销此权限。

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

    `code: 0` 表示投票交易已被接受——这说明投票已成功提交。CLI 会返回广播回执，其中包含 `txhash`；`height` 在交易被打包进区块之前为 `0`。

---

## 投票资格概览

| 状态 | 可投票？ | 投票权重 |
| --- | --- | --- |
| 当前纪元中的活跃参与者 | 是 | `= participant.weight` |
| 当前纪元中的创世守护者 | 是 | `= (other_total × 0.52) / guardian_count`（已提升） |
| 上一纪元未通过 PoC（INACTIVE） | 否 | `0` |
| 未通过 CPoC，已被移出纪元 | 否 | `0` |
| 被关押的验证者 | 否 | `0`（直到解除关押并重新质押） |
| 已质押但 `tokens = 0` 的验证者 | 否 | `0` |
| 委托人（通过手动 `MsgDelegate` 质押） | 是 | `= 其在验证者代币中所占份额` |
