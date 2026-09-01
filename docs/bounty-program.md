# Bounty program

Gonka runs two programs:

| Program | What it is | Where |
|---|---|---|
| **Bug bounty** | Private vulnerability reports. Paid after triage, by severity. | [HackerOne](report-vulnerability.md) |
| **Contributor rewards** | Public protocol work: fixes, improvements, tooling. Paid from the community pool after governance. | [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/) |

You do not need to be a Host.

This page is a practical guide. It is **not a promise of payout**. For vulnerabilities, the HackerOne program terms are authoritative. For protocol work, Hosts approve amounts on-chain. Both processes can evolve.

---

## Bug bounty

Earn **$15,000–$25,000** for a **critical-severity** vulnerability affecting the Gonka network. Other severities pay less. Amounts can change.

**[Submit a report →](report-vulnerability.md)**

Reports go through HackerOne: private coordinated disclosure, triage, then a payout tied to severity.

The program is rolling out in phases. It is currently **private** — open to researchers invited by HackerOne, and to Gonka community members via the form above. A public program is planned.

You do **not** need to attach a fix to be paid for a valid report. Payment is made after triage. A **fix can be paid separately**; that amount is discussed individually.

### Rewards

| Severity | Reward (guideline) |
|---|---|
| Critical | **$15,000–$25,000** (increased in July 2026 from $5,000–$10,000) |
| High / Medium / Low | Defined in the HackerOne program terms |

The full reward table, categories, and eligibility rules live on HackerOne. **If this page and the HackerOne terms disagree, the HackerOne terms win.**

### In scope

Guideline only — HackerOne is authoritative:

- Protocol, consensus, and chain-level issues in [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/)
- Bugs with **network-wide** impact: chain halt, theft from a module, wrong rewards for all participants, loss of network control
- Demonstrable security impact, not a purely theoretical weakness

### Out of scope

- Attacks that assume two-thirds of Hosts turn malicious (**honest-majority** / BFT assumption)
- Attacks against a **particular Host’s own infrastructure**
- Unverified AI-generated findings

### How to report

1. Use the [HackerOne report form](report-vulnerability.md). That is the only intake. Do not open a public GitHub issue or PR, and do not post the issue in Discord or other public channels.
2. If reviewers can confirm the vulnerability is already known — for example there was already a GitHub discussion, or a report already exists on HackerOne — your report may be marked as a **duplicate** and not paid.
3. Reviewers **triage** the report and assign severity.
4. Valid reports are paid after triage. You can include a written report, a fix in a private fork, or both. A fix does not change the report payout; any extra payment for the fix is discussed individually.

### What a good report includes

- **Reproducible research** — steps, screenshots, logs, or a recording so an analyst can confirm the issue
- **Demonstrable impact** — show what an attacker can actually do. Theoretical library or config issues are usually rejected
- **Follow-up** — reviewers may ask questions after you submit. Reply so they can reproduce and confirm the issue.
- **Your own verification** — do not submit AI-generated findings you have not checked

### Severity guideline

Final severity is decided on HackerOne. A common framing, also used in this program, is:

```
Risk = Impact × Likelihood
```

**Impact** is from a **network** perspective. High or Critical requires a network-wide effect. Issues that affect only one participant usually cap at Low or Medium.

| Level | Meaning | Examples |
|---|---|---|
| Critical | Catastrophic for the whole network | Full network-control hijack |
| High | Significant disturbance at scale | Chain halt; theft from a module; wrong rewards for all participants |
| Medium | Moderate disruption, limited scope | Integrity or availability risk with a bounded blast radius |
| Low | Minor, isolated, no chain impact | A small issue affecting a single participant or component |

**Likelihood**

- **Organic** — happens unintentionally under normal conditions
- **Intentional, profitable** — exploited for financial gain (higher if cheap and profitable)
- **Intentional, griefing** — exploited to cause disruption (higher if low cost and wide effect)

| Impact \ Likelihood | High | Medium | Low |
|---|---|---|---|
| Critical | Critical | Critical | High |
| High | Critical | High | Medium |
| Medium | High | Medium | Low |
| Low | Medium | Low | Informational |

### Who pays

HackerOne needs a legal entity as the billing partner. **Bitfury** currently funds these payouts on behalf of Gonka and does not set triage or severity.

---

## Contributor rewards

Public work on the protocol: discuss, ship, then Hosts approve a payout on-chain.

Work in the open in [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/). Accepted contributions are typically paid from the **community pool**, in a **stablecoin**, through a **network upgrade**. Every payout needs on-chain approval. You can suggest what the work might be worth; that is not a commitment.

Grant-style arrangements (funding agreed around a larger body of work) **have already been used**. They can be proposed in a GitHub Discussion, and then put to an **on-chain vote**.

### How to participate

**Start with a [GitHub Discussion](https://github.com/gonka-ai/gonka/discussions).** Discussions are the source of truth for proposal history; Discord is for reach. Get community support before you invest in a large implementation.

That step matters. The same idea may already have been discussed, or the current approach may be a **trade-off**. A Discussion is how you find that out and avoid duplicate work. Read [Welcome to Proposals #795](https://github.com/gonka-ai/gonka/discussions/795) first.

Include motivation, expected impact, and what would change for the network. If you represent a team or have relevant prior work, link it.

Then:

1. Share the Discussion in Discord `#improvement-proposals` (and any other channel that reaches Hosts and contributors).
2. Collect reactions, comments, and counterarguments. Host feedback is especially useful.
3. If the work is already a bounded, unclaimed task, pick an [`up-for-grabs`](https://github.com/gonka-ai/gonka/issues?q=is%3Aissue%20state%3Aopen%20label%3Aup-for-grabs) issue — or [open a new Issue](https://github.com/gonka-ai/gonka/issues/new/choose) for a concrete bug or measurable improvement.

!!! tip "Claim the work before you start"

    Leave a short comment such as `Starting work, ETA 3 to 5 days`. That avoids duplicate effort.

Priorities: [Gonka Network Development Roadmap](https://github.com/gonka-ai/gonka/blob/main/proposals/gonka-network-development-roadmap.md).

Typical Discussion topics: protocol improvements; integrations, API clients, and tooling; open problems that need research.

### How to ship

- Branch and open a PR against [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/).
- Keep progress visible (a short weekly update is enough).
- Done means a **working implementation that passes tests**, reviewed and validated by Hosts.
- If the change needs a network upgrade, include the **on-chain upgrade code**.
- When the work is in the repository, **keep seeking support**: ask other community members to comment and review the Issue or PR. Say what you want looked at (correctness, tests, edge cases, performance). Community review is how the work gets validated — do not wait for it to happen on its own.

Collaboration and voluntary reward-sharing among contributors are welcome.

---

## Where payouts are recorded

| Program | Source of truth | Also useful |
|---|---|---|
| **Bug bounty** | Gonka program on **HackerOne** | — |
| **Contributor rewards** | The **chain** (payouts execute on-chain, typically in a network upgrade) | Matching records in [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/). Discord `#bounty-awards` posts some of this later and can be incomplete — not authoritative. |

---

## Further reading

- [Report a Vulnerability](report-vulnerability.md) — HackerOne submission form
- [Gonka on HackerOne (Medium)](https://medium.com/product-science-ai/gonka-on-hackerone-launching-our-bug-bounty-program-with-bitfury-support-06252309a91a) — launch note and AMA context
- [Welcome to Proposals #795](https://github.com/gonka-ai/gonka/discussions/795)
- [Gonka Discord](https://discord.gg/REcpeYc7P7)
