# 赏金计划

Gonka 运行两个计划：

| 计划 | 内容 | 地点 |
|---|---|---|
| **漏洞赏金** | 私密漏洞报告。经分类后根据严重性支付报酬。 | [HackerOne](report-vulnerability.md) |
| **贡献者奖励** | 公开协议工作：修复、改进、工具开发。经治理后从社区金库支付报酬。 | [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/) |

您无需是 Host。

本页面为实用指南，**并非付款承诺**。关于漏洞，HackerOne 计划条款具有权威性；关于协议工作，Hosts 将在链上批准金额。两个流程均可能演变。

过往付款记录公开。请参见[谁、何时、因何获得付款](#where-payouts-are-recorded)。

---

## 漏洞赏金

发现影响 Gonka 网络的**严重级别**漏洞，可获得 **$15,000–$25,000**。其他严重级别支付较少。金额可能调整。

**[提交报告 →](report-vulnerability.md)**

报告通过 HackerOne 提交：私密协同披露、分类，然后根据严重性支付报酬。

该计划分阶段推出，目前为**私密**状态——仅限 HackerOne 邀请的研究人员和通过上述表单加入的 Gonka 社区成员。未来计划开放公开计划。

您**无需**附上修复方案即可获得有效报告的报酬。付款在分类后发放。**修复方案可另行支付**，金额需单独商议。

### 奖励

| 严重性 | 奖励（指导） |
|---|---|
| 严重 | **$15,000–$25,000**（2026 年 7 月从 $5,000–$10,000 提升） |
| 高 / 中 / 低 | 详见 HackerOne 计划条款 |

完整的奖励表、类别和资格规则位于 HackerOne。**若本页面与 HackerOne 条款冲突，以 HackerOne 条款为准。**

### 包含范围

仅作指导——HackerOne 具有权威性：

- 在 [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/) 中的协议、共识和链层问题
- 具有**全网影响**的漏洞：链停止、模块资金被盗、所有参与者奖励错误、网络控制权丧失
- 可验证的安全影响，非纯理论弱点

### 不包含范围

- 假设三分之二 Host 变为恶意的攻击（诚实多数/BFT 假设）
- 针对**特定 Host 自有基础设施**的攻击
- 未经验证的 AI 生成发现

### 如何报告

1. 请使用 [HackerOne 报告表单](report-vulnerability.md)。这是唯一受理渠道。请勿在 GitHub 上公开创建 issue 或 PR，也勿在 Discord 或其他公开渠道发布问题。
2. 如果评审人员确认该漏洞已知——例如已有 GitHub 讨论或 HackerOne 上已有报告——您的报告可能被标记为**重复**且不予支付。
3. 评审人员**triage**报告并分配严重性。
4. 通过**triage**的有效报告将获得报酬。您可以提交书面报告、私有分叉中的修复方案，或两者兼有。修复方案不会改变报告的报酬；任何额外的修复奖励将单独讨论。

### 一份优质报告包含的内容

- **可复现的研究**——提供步骤、截图、日志或录制视频，以便分析师确认问题
- **可验证的影响**——展示攻击者实际能做什么。理论上的库或配置问题通常会被拒绝
- **后续跟进**——提交后评审人员可能会提问。请回复以便他们复现并确认问题。
- **您自己的验证**——不要提交未经您核实的AI生成的发现

### 严重性指南

最终严重性由HackerOne决定。本计划中常用的一种表述方式如下：

```
Risk = Impact × Likelihood
```

**影响**从**网络**角度评估。高或关键严重性要求具有全网范围的影响。仅影响单个参与者的漏洞通常上限为低或中等。

| 级别 | 含义 | 示例 |
|---|---|---|
| 关键 | 对整个网络造成灾难性影响 | 完全控制网络 |
| 高 | 大规模显著干扰 | 链暂停；模块被盗；所有参与者奖励错误 |
| 中等 | 中等干扰，影响范围有限 | 具有有限影响范围的完整性或可用性风险 |
| 低 | 轻微、孤立，不影响链 | 影响单个参与者或组件的小问题 |

**可能性**

- **自然发生**——在正常条件下无意中发生
- **有意且有利可图**——为获取经济利益而利用（若成本低且收益高则更高）
- **有意且破坏性**——为造成干扰而利用（若成本低且影响广泛则更高）

| 影响 \ 可能性 | 高 | 中等 | 低 |
|---|---|---|---|
| 关键 | 关键 | 关键 | 高 |
| 高 | 关键 | 高 | 中等 |
| 中等 | 高 | 中等 | 低 |
| 低 | 中等 | 低 | 信息性 |

### 谁付款

HackerOne 需要一个法律实体作为计费合作伙伴。**Bitfury** 目前代表 Gonka 资助这些付款，但不设置优先级或严重性。

---

## 贡献者奖励

在协议上公开工作：讨论、交付，然后主机在链上批准付款。

在 [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/) 中公开工作。被接受的贡献通常通过**网络升级**，从**社区资金池**以**稳定币**支付。每次付款都需要链上批准。您可以建议工作可能的价值；但这不构成承诺。

以补助形式的安排（围绕较大工作量达成的资助）**已被使用过**。它们可以在 GitHub 讨论中提出，然后进行**链上投票**。

### 如何参与

**从 [GitHub 讨论](https://github.com/gonka-ai/gonka/discussions) 开始。** 讨论是提案历史的权威来源；Discord 用于扩大影响力。在投入大量实现之前，请先获得社区支持。

这一步很重要。同样的想法可能已经讨论过，或者当前的方法可能是一种**权衡**。讨论是您发现这一点并避免重复工作的途径。请先阅读 [欢迎来到提案 #795](https://github.com/gonka-ai/gonka/discussions/795)。

包括动机、预期影响以及对网络将产生什么变化。如果您代表一个团队或有相关先前工作，请提供链接。

然后：

1. 在 Discord `#improvement-proposals`（以及任何其他能触达主机和贡献者的渠道）分享该讨论。
2. 收集反应、评论和反对意见。主机的反馈尤其有用。
3. 如果工作已经是明确且未被认领的任务，请选择一个 [`up-for-grabs`](https://github.com/gonka-ai/gonka/issues?q=is%3Aissue%20state%3Aopen%20label%3Aup-for-grabs) 问题——或为具体的错误或可衡量的改进 [新建一个 Issue](https://github.com/gonka-ai/gonka/issues/new/choose)。

!!! tip "在开始工作前认领任务"

    留下简短评论，例如 `Starting work, ETA 3 to 5 days`。这可以避免重复工作。

    优先级：[Gonka 网络开发路线图](https://github.com/gonka-ai/gonka/blob/main/proposals/gonka-network-development-roadmap.md)。

    典型讨论主题：协议改进；集成、API 客户端和工具；需要研究的开放问题。

### 如何交付

- 分支并向 [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/) 提交 PR。
- 保持进度可见（每周简短更新即可）。
- 完成意味着一个**通过测试的可用实现**，并经过主机审查和验证。
- 如果更改需要网络升级，请包含**链上升级代码**。
- 当工作进入仓库后，**继续寻求支持**：请其他社区成员评论和审查该 Issue 或 PR。说明您希望被审查的内容（正确性、测试、边界情况、性能）。社区审查是工作获得验证的方式——不要等待它自发发生。

贡献者之间的协作和自愿奖励共享是被欢迎的。

---

## 付款记录位置 {#where-payouts-are-recorded}

您可以查看真实的付款记录：谁被支付了、支付了什么、何时支付。

**漏洞赏金。** HackerOne 的付款以摘要形式发布在 [Gonka Discord](https://discord.gg/REcpeYc7P7) 的 `#bounty-awards` 频道中。

**贡献者奖励。** 这些付款随网络升级发放。**链上**是唯一真实来源，记录了谁被支付、金额以及由哪个升级承载了支付。

这些相同的付款在这里更容易浏览：

- [Gonka Discord](https://discord.gg/REcpeYc7P7)，频道 `#bounty-awards`
- [Gonkascan 奖励页面](https://gonkascan.com/?page=bounty) — **奖励记录** 列出每次付款及其升级；**排名** 列出按总付款额排序的顶级贡献者

Discord 帖子和 Gonkascan 页面由社区撰写，可能不准确。请始终在链上确认金额、地址和升级。相关问题和拉取请求见 [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/).

---

## 进一步阅读

- [报告漏洞](report-vulnerability.md) — HackerOne 提交表单
- [Gonka 在 HackerOne（Medium）](https://medium.com/product-science-ai/gonka-on-hackerone-launching-our-bug-bounty-program-with-bitfury-support-06252309a91a) — 发布公告和 AMA 背景
- [欢迎参与提案 #795](https://github.com/gonka-ai/gonka/discussions/795)
- [Gonka Discord](https://discord.gg/REcpeYc7P7)
