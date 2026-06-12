# Proposals

In Gonka, there are two main ways to propose and coordinate changes: Governance and Improvement Proposals.

## Improvement Proposals (off-chain)

Used to discuss long-term plans, major architectural ideas, and shape the community roadmap. They are similar to Bitcoin’s [BIPs](https://github.com/bitcoin/bips).

- Managed as Markdown files in the [/proposals](https://github.com/gonka-ai/gonka/tree/main/proposals) directory
- Anyone can create a Pull Request with a new proposal
- Active participants review proposals on GitHub
- If approved, the PR gets merged into the repository

For off-chain improvement proposals, see the [/proposals](https://github.com/gonka-ai/gonka/tree/main/proposals) folder.

## Governance Proposals (on-chain)
Used for changes that directly affect the network and require on-chain voting:

- Changing network parameters (e.g. via `MsgUpdateParams`)
- Executing software upgrades
- Introducing new models
- Introducing new features
- Any other modifications that must be approved by the community on-chain
  
Governance power is earned through verifiable compute work, not passive coin ownership. By default, only 20% of each Host’s PoC-derived voting weight is activated automatically. To unlock the remaining 80%, Hosts must lock GNK coins as collateral, linking governance influence to real economic commitment. Technical details, including weight activation mechanics and collateral ratios, are covered in [Gonka: Tokenomics](https://gonka.ai/tokenomics.pdf).

!!! note "Grace Period"
    For the first 180 epochs (approximately 6 months), new participants can participate in governance and earn voting weight through PoC alone, without collateral requirements. During this period, the full governance rights are available, while voting weight remains tied to verified compute activity.

### Key governance parameters

| **Parameter**        | **Current mainnet value**                                           | **Description**                                                                                                                                  | **Effect**                                                                                                          |
|-----------------------|-------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| **Min Deposit**       | 500 GNK (500,000,000,000 ngonka) for regular proposals; 1000 GNK (1,000,000,000,000 ngonka) for expedited proposals. | Minimum deposit required to submit a governance proposal and move it into the voting period. | If the deposit is not met within the max deposit period, the proposal is removed without entering voting. |
| **Quorum**            | 25% of total bonded PoC-weighted voting power (governance-parameterized). | Minimum fraction of total bonded voting power that must participate in a proposal for its result to be valid. `Yes`, `No`, `NoWithVeto`, and `Abstain` all count toward quorum. | If quorum is not reached, the proposal is rejected regardless of its `Yes` / `No` outcome.                       |
| **Majority Threshold**| >50% `Yes` votes for regular proposals; >66.7% for expedited proposals (configurable on-chain). | Minimum fraction of `Yes` votes among non-abstaining votes required for a proposal to pass: `Yes / (Yes + No + NoWithVeto)`. Voting weight is calculated proportionally to verified compute power. | If this threshold is not met, the proposal is rejected even if quorum is achieved.                                   |
| **Veto Threshold**    | >33.4% `NoWithVeto` among all cast voting power, including `Abstain` in the denominator. | A veto rejection occurs when `NoWithVeto / (Yes + No + NoWithVeto + Abstain) > 0.334`. `Abstain` does not add to `NoWithVeto`; it only increases the denominator. | Acts as a safeguard against malicious or harmful proposals, even if they have majority support. A veto rejection currently burns the proposal deposit. |

All these parameters can be modified via governance proposals, allowing the network to dynamically adjust decision-making rules over time. Always query the live chain before announcing exact values:

```bash
inferenced query gov params -o json --node <NODE_URL>/chain-rpc/ \
  | jq '.params | {
      min_deposit,
      expedited_min_deposit,
      voting_period,
      expedited_voting_period,
      quorum,
      threshold,
      expedited_threshold,
      veto_threshold,
      burn_vote_veto
    }'
```

For on-chain governance steps and full tally formulas, see [the detailed guide](https://gonka.ai/governance/transactions-and-governance/) and [Voting on Proposals](https://gonka.ai/governance/voting-on-proposals/).
