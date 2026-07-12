# 投票权、创世守护者和委托

## 已绑定总权重的计算

已绑定总权重是所有已绑定验证者中 `validator.tokens` 的总和，条件为 `tokens > 0`：

```text
total_bonded = Σ validator.tokens   (over all bonded validators with tokens > 0)
```

每个验证者的 `tokens` 值由推理模块通过 `Staking.SetComputeValidators()` 在每次纪元转换时设置。
对于绝大多数验证者：

```text
validator.tokens = participant.weight   (their PoC weight in the current epoch)
```

对于创世守护者，首先会应用一个额外的增强算力步骤（见下文）。

---

## 创世守护者

一组由项目团队运营的引导验证节点，硬编码在链参数中。它们在早期网络阶段获得临时的算力提升。该提升可在链上配置，并随时间变化，因此在发布确切的守护者投票算力数值前，请查询实时参数。

??? note "当前主网上创世守护者列表"
    - `gonkavaloper1y2a9p56kv044327uycmqdexl7zs82fs5lyang5` (`gonka-1`)
    - `gonkavaloper1dkl4mah5erqggvhqkpc8j3qs5tyuetgdc59d0v` (`gonka-2`)
    - `gonkavaloper1kx9mca3xm8u8ypzfuhmxey66u0ufxhs70mtf0e` (`gonka-3`)

此列表可通过治理配置（`genesis_guardian_params.guardian_addresses`），在引导阶段预计不会发生变化。

机制记录在官方提案中：

- [早期网络保护提案](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)

???+ note "目的"
    - 防止在早期低质押阶段出现67%的共识控制。
    - 在引导阶段帮助阻止恶意的治理提案。
    - 提供针对协议漏洞的快速响应能力。
    - 使在引导期间廉价获得多数控制权在经济上变得无利可图。

---

### 守护者算力提升计算

在 `SetComputeValidators` 运行之前，推理模块会应用 `applyEarlyNetworkProtection`，其计算增强算力的方式如下：

```text
other_total         = total_network_power − Σ guardian_original_power
total_enhancement   = other_total × multiplier
per_guardian_power  = total_enhancement / guardian_count

guardian.tokens     = per_guardian_power                # original PoC weight is REPLACED
non_guardian.tokens = participant.weight                # unchanged
```

从 v0.2.13 升级开始，配置的乘数为 `0.33334`，旨在在应用提升的纪元转换时，达到大约 `25%` 的综合 Guardian 算力：

```text
guardian_share = multiplier / (1 + multiplier)
guardian_share = 0.33334 / 1.33334 ≈ 25%
```

**效果（在每次纪元转换时测量）：**

- 在应用提升的瞬间，Guardian 总份额目标为总质押算力的 `multiplier / (1 + multiplier)`。
- 该目标在提升运行期间达成，而非作为固定稳态。Guardian `tokens` 每个纪元设置一次，因此当网络其余部分的 PoC 权重增长时，Guardian 总份额可能在纪元转换之间发生偏移。
- 在当前 `0.33334` 倍率下，Guardian 目标约为 `25%` 的总调整算力，不足以单独通过提案，也不足以在当前 `33.4%` 否决阈值下单独否决。
- 无法提取价值或单方面更改共识——任何操作都需要 Guardian 之间的协调。

---

### Guardian 提升结束条件

当满足以下两个链上条件时，增强功能将自动停用（无需治理投票）：

```text
total_network_power >= network_maturity_threshold      (currently 15,000,000)
current_height      >= network_maturity_min_height     (currently 3,000,000)
```

主网当前状态：

- 高度阈值（`3,000,000`）已被跨越。
- 全网总算力仍远低于`15,000,000`，因此激励机制仍处于激活状态。
- 当全网累计的PoC权重首次超过`15,000,000`后的第一个纪元转换时，激励机制将关闭；届时，Guardian验证者的`tokens`将等于其PoC权重，与其他所有验证者相同。

这两个阈值均可通过治理机制调整（`network_maturity_threshold` 和 `network_maturity_min_height`），因此如有需要，可通过成功的治理提案调整激活截止条件。

---


## 治理委托（冷钥到温钥）

如果持有投票权的密钥不是您日常操作所使用的密钥，则可以提前授予治理投票权限。

在此设置中：

- 授权者 = 拥有投票权的账户（冷钥）
- 被授权者 = 将代表授权者提交投票的账户（温钥）

???+ note "您想投票，但无法访问持有投票权的密钥。"
    请联系该密钥的所有者，请求其授权您的密钥代表他们投票。若无此授权，您的密钥无法为该投票权提交治理投票。

### 其他密钥代表您投票

请使用下方命令，从持有投票权的密钥执行。这将授权被授权密钥代表您提交治理投票。
此委托仅允许对治理提案进行投票。被授权者仍可为自己密钥投票。授权者可随时撤销此权限。

#### 1. 授予投票权限（从授权者密钥执行）
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
=== "Command"
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

#### 3. 使用受赠人进行投票
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

    `code: 0` 表示投票交易已被接受——这表明投票已成功提交。CLI 会返回带有 `txhash` 的广播回执；在交易被包含进区块之前，`height` 为 `0`。

---

## 资格概要

| 状态 | 可以投票吗？ | 投票权重 |
| --- | --- | --- |
| 当前周期内的活跃参与者 | 是 |  |
| 当前周期内的创世守护者 |  |  |
| （在早期网络保护机制激活期间获得提升） | `= participant.weight` |  |
| 上一周期 PoC 失败（非活跃） |  |  |
| CPoC 失败，已从周期中移除 | 是 |  |
| 被关押的验证者 |  |  |
| （直到解除关押并重新绑定） | `= (other_total × current_multiplier) / guardian_count` |  |
