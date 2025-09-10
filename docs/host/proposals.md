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

| **Parameter**        | **Default**                                           | **Description**                                                                                                                                  | **Effect**                                                                                                          |
|-----------------------|-------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| **Quorum**            | 33.4% of total PoC-weighted power (governance-parameterized). | Minimum fraction of total active PoC-weighted voting power that must participate in a proposal for its result to be valid.                        | If quorum is not reached, the proposal is considered invalid regardless of its `Yes` / `No` outcome.                       |
| **Majority Threshold**| >50% Yes votes (configurable on-chain).               | Minimum fraction of `Yes` votes among all cast votes (excluding `Abstain`) required for a proposal to pass. Voting weight is calculated proportionally to verified compute power from the most recent Sprint. | If this threshold is not met, the proposal is rejected even if quorum is achieved.                                   |
| **Veto Threshold**    | 33.4% of the entire non-abstaining voting power in the system | If the fraction of `No_with_Veto` votes reaches this level, the proposal is forcefully rejected regardless of other votes.                            | Acts as a safeguard against malicious or harmful proposals, even if they have majority support.                        |

All these parameters are defined in the Genesis Code and can be modified via governance proposals, allowing the network to dynamically adjust decision-making rules over time.
For on-chain governance steps, see [the detailed guide](https://gonka.ai/transactions-and-governance/).
