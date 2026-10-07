# 投票权、创世守护者与委托

## 总绑定权重计算

总绑定权重是所有绑定验证者中 `validator.tokens` 的总和，条件为 `tokens > 0`：

```text
total_bonded = Σ validator.tokens   (over all bonded validators with tokens > 0)
```

每个验证者的 `tokens` 值由推理模块在每个纪元过渡时通过 `Staking.SetComputeValidators()` 设置。

从 **v0.2.16** 开始，由该版本形成的纪元将非守护者 `validator.tokens` 设置为 `cap_weight`，而非来自奖励 `weight`。`cap_weight` 位于 `active_participants.participants[]` 的 `$NODE_URL/v1/epochs/{epoch_id}/participants`。当 `cap_weight_applied` 为真时使用它。当该标志不存在时，纪元早于该版本形成，`tokens` 仍遵循 `weight`。新加入或重新加入的主机在首个此类纪元中具有 `cap_weight = 0`，因此其验证者权力为 0。奖励仍使用 `weight`。

```text
non_guardian.tokens = cap_weight    # cap_weight_applied
non_guardian.tokens = weight        # earlier epochs
```

守护者加成仍在此限幅后运行并替换守护者代币。详见下文。

---

## 创世守护者

由项目团队运营的一小部分引导验证者，硬编码在链参数中。它们在早期网络阶段获得临时权力加成。该加成可在链上配置，并随时间变化，因此在发布确切的守护者投票权数字前，请查询实时参数。

```bash
curl -sS "https://node2.gonka.ai:8443/chain-api/productscience/inference/inference/params" \
  | jq '.params.genesis_guardian_params'
```

`https://node1.gonka.ai:8443` 和 `https://node3.gonka.ai` 暴露相同的路径。响应包含 `guardian_addresses`、`network_maturity_threshold` 和 `network_maturity_min_height`。权力乘数（v0.2.13 起为 `0.33334`）不在该对象中。

??? note "当前实时网络上的创世守护者集合"
    - `gonkavaloper1y2a9p56kv044327uycmqdexl7zs82fs5lyang5` (`gonka-1`)
    - `gonkavaloper1dkl4mah5erqggvhqkpc8j3qs5tyuetgdc59d0v` (`gonka-2`)
    - `gonkavaloper1kx9mca3xm8u8ypzfuhmxey66u0ufxhs70mtf0e` (`gonka-3`)

此列表由治理配置（`genesis_guardian_params.guardian_addresses`），在引导阶段预计不会更改。

机制在官方提案中记录：

- [早期网络保护提案](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)

???+ note "目的"
    - 防止在早期低质押阶段发生共识的 67% 攻击。
    - 在引导阶段帮助阻止恶意治理提案。
    - 提供针对协议漏洞的快速响应能力。
    - 使在引导阶段廉价获取多数控制权在经济上无吸引力。

---

### 守护者加成计算

在 `SetComputeValidators` 运行前，推理模块对由 v0.2.16 形成的纪元将非守护者权力限幅至 `cap_weight`，然后应用 `applyEarlyNetworkProtection`。加成基于这些限幅后的权力。在更早的纪元中，此公式中的 `cap_weight` 为奖励 `weight`。

```text
other_total         = total_capped_power − Σ guardian_capped_power
total_enhancement   = other_total × multiplier
per_guardian_power  = total_enhancement / guardian_count

guardian.tokens     = per_guardian_power
non_guardian.tokens = cap_weight
```

自 v0.2.13 升级以来，配置的乘数为 `0.33334`，目标是在加成应用的纪元过渡时实现约 `25%` 的总守护者权力：

```text
guardian_share = multiplier / (1 + multiplier)
guardian_share = 0.33334 / 1.33334 ≈ 25%
```

**效果（在每个纪元过渡时测量）：**

- 加成应用的瞬间，守护者总份额目标为总绑定权力的 `multiplier / (1 + multiplier)`。
- 此目标在**加成运行时**达成，而非固定稳态。守护者 `tokens` 每个纪元仅设置一次，因此随着网络其余部分的限幅权力增长，守护者总份额在纪元过渡间可能发生漂移。
- 使用当前 `0.33334` 乘数，守护者目标约为 `25%` 的总调整权力，不足以单独通过提案，也不足以在当前 `33.4%` 否决阈值下单独否决。
- 无法提取价值或单方面更改共识——任何行动都需要守护者之间的协调。

---

### 守护者加成结束条件

当以下两个链上条件同时满足时，该增强功能将自动停用（无需治理投票）：

```text
total_network_power >= network_maturity_threshold      (currently 15,000,000)
current_height      >= network_maturity_min_height     (currently 3,000,000)
```

当前实时网络状态：

- 高度阈值（`3,000,000`）已被超越。
- 网络总权力仍远低于 `15,000,000`，因此加成仍处于激活状态。
- 当网络聚合限幅权力超过 `15,000,000` 后的首个纪元过渡时，加成将关闭。此时守护者 `tokens` 将等于 `cap_weight`，与其他所有验证者相同。在 v0.2.16 之前形成的纪元中，该数值仍为奖励 `weight`。

两个阈值均可由治理调整（`network_maturity_threshold` 和 `network_maturity_min_height`），因此若有必要，可通过成功的治理提案调整激活截止条件。

---


## 治理委托（冷密钥到热密钥）

如果持有投票权的密钥并非您日常操作使用的密钥，则可提前授予治理投票权限。

在此设置中：

- 授权人 = 持有投票权的账户（冷密钥）
- 被授权人 = 将代表授权人提交投票的账户（热密钥）

???+ note "您希望投票，但无法访问持有投票权的密钥。"
    请联系该密钥的所有者，请求他们授予您的密钥代表其投票的权限。没有此授权，您的密钥无法为该投票权提交治理投票。

### 另一个密钥代表您投票

请使用以下grant命令，从持有投票权的密钥运行。这将授权被授权人密钥代表您提交治理投票。
此委托仅允许对治理提案进行投票。被授权人仍可为其自身密钥投票。授权人可随时撤销此权限。

#### 授予投票权限（从授权人密钥运行）
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

#### 验证授权是否存在（从任意节点运行）
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

#### 使用被授权人进行投票
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

    `code: 0` 表示投票交易已被接受——这表明投票已成功提交。CLI 返回包含 `txhash` 的广播收据；`height` 在交易被包含进区块前为 `0`。

---

## 资格摘要

| 状态 | 可投票？ | 投票权重 |
|---|---|---|
| 活跃参与者，在当前纪元内 | 是 | `= participant.weight` |
| 创世守护者，在当前纪元内 | 是 | `= (other_total × current_multiplier) / guardian_count`（在早期网络保护生效期间被增强） |
| 上一纪元PoC失败（非活跃） | 否 | `0` |
| CPoC失败，已从纪元中移除 | 否 | `0` |
| 被监禁的验证者 | 否 | `0`（直到解除监禁并重新质押） |
| 持有 `tokens = 0` 的质押验证者 | 否 | `0` |
| 委托人（手动 `MsgDelegate` 抵押） | 是 | `= their share of the validator's tokens` |
