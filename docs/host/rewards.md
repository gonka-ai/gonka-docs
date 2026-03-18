# Rewards

!!! note 
  This documentation is provided for reference only. Final parameters and technical details may change, so always verify the latest on-chain state and the relevant GitHub repository before relying on this document.

## Overview of tokenomics

The Core incentive for Hosts (680 million gonka (GNK) coins, 68% of the total supply) is designed to reward Hosts for contributing computational power to the decentralized network. Under the Bitcoin-style reward System, a fixed amount of GNK is minted per epoch and distributed proportionally to each Host’s Proof of Compute (PoC) weight. As the network grows and more GPUs compete for the same fixed reward, the GNK earned per GPU decreases, introducing scarcity-driven value dynamics similar to Bitcoin mining. Long-term value for Hosts comes from increasing demand for inference services, fixed emission scarcity, and rising GNK market value as mining becomes more competitive. The reward schedule follows a predictable exponential decay, reducing epoch rewards gradually, halving rewards approximately every 4 years. 

## Reward system of Gonka network

Gonka Network operates a dual reward system designed to balance long-term scarcity incentives with immediate economic utility. Hosts are compensated through two complementary reward streams:

- Protocol-level issuance rewards (Bitcoin-Style)
- Work-based rewards from real inference demand

### Bitcoin-style reward system
Gonka Network introduces a Bitcoin-inspired fixed-reward system in which a predetermined amount of Reward Coins is minted per epoch and distributed based on each Host’s Proof of Compute (PoC) weight.

Key characteristics of the model:

- **Epoch-minted reward coins**: A base amount of 323,000 GNK (set via governance and may differ) per epoch (“Reward Coins”) is minted and distributed across all active Hosts. This figure is subject to exponential decay (-0.000475 per epoch, equivalent to halving approximately every 1,460 epochs or 4 years), following the formula: `current_epoch_reward = initial_reward × exp(decay_rate × epochs_since_genesis)`
- **Scarcity-driven value**: As more GPUs join the network, each GPU earns fewer GNK per epoch. The increased mining cost per GNK creates intrinsic value and introduces a positive feedback loop, similar to Bitcoin: `More Hosts → fewer GNK per GPU → higher scarcity → potential price support and growth`.

### Work-based rewards

In parallel, Gonka distributes Work Coins derived from real economic activity.

- Developers pay fees for actual inference and compute workloads
- These fees are distributed to Hosts proportionally to the real computation performed

<a href="/images/Chart_1_Cumulative_Minted_Coins_vs_Year.png" target="_blank">
  <img src="/images/Chart_1_Cumulative_Minted_Coins_vs_Year.png" style="width:100%; height:auto; max-width:100%;">
</a>
_Chart 1. Cumulative Minted Coins vs. Year_

<a href="/images/Chart_2_Total_Epoch_Reward_vs_Epoch.png" target="_blank">
  <img src="/images/Chart_2_Total_Epoch_Reward_vs_Epoch.png" style="width:100%; height:auto; max-width:100%;">
</a>
_Chart 2. Total Epoch Reward (GNK) vs. Epoch_

## Reward vesting

All rewards distributed by the Gonka Network, including both Epoch-minted Reward Coins and usage-based Work Coins, are subject to deterministic, protocol-enforced vesting schedule managed by the dedicated vesting system: 

- Per-Host vesting accounting: The network maintains an individual release schedule for each Host, tracking their rewards on a daily basis to ensure fair and predictable distributions. All Hosts follow the same vesting rules and parameters.
- Deterministic reward distribution: When Hosts earn new rewards, the system spreads the total amount evenly across the vesting period. Any small fractional amounts are added on the first day to ensure that no coins are lost due to rounding.
- Automatic Management: The system automatically handles all vesting operations without requiring Host intervention, maintaining efficiency while preventing system bloat.
- Daily Releases: Every day, the oldest vesting entry for each Host is automatically released to their available balance, creating a steady stream of unlocked coins.

As of March 2026, vesting period is configured to 180 epochs (~180 days). For the latest vesting schedule, always refer to the current on-chain implementation.
Any off-chain descriptions may become outdated due to protocol upgrades, parameter changes, or governance decisions.

This mechanism aligns Hosts’ reward with the long-term stability and growth of the network, preventing short-term speculation and ensuring predictable income streams for reliable Hosts. 

Hosts can query:

The total amount of coins to be vested.
```
http://<ip>:<public_http_port>/chain-api/productscience/inference/streamvesting/total_vesting/<Host_address>
```
A detailed breakdown of their vesting schedule (the array of future unlocks).
```
http://<ip>:<public_http_port>/chain-api/productscience/inference/streamvesting/vesting_schedule/<Host_address>
```

## Reward claiming process
Gonka chain releases a reward earned in epoch N only during epoch N+1. Rewards cannot be claimed earlier or later.

The Host’s API node automatically performs the claim during epoch N+1 using the seed whose signature was recorded at the start of epoch N. In case of failure, the node retries every 30 minutes.

However, the claim requires the node to remain online and to pass all verification steps during this limited window until rewards are successfully claimed. If verification cannot be completed, the chain cannot finalize the reward, and it remains unclaimed.

!!! note "Critical operational note"

    Reward claiming is performed exclusively by the Host’s API Node.
    
    If the API node is stopped, restarted, or unavailable at any point during epoch N+1,
    the reward for epoch N may be permanently lost, even if:
   
    - Proof of Compute (PoC) was successful
    - Inference requests were served correctly
    - ML Nodes remained online
    
    ML Nodes alone cannot claim rewards. For a reward to be claimed safely, the API node must remain online and synchronized until the reward for the previous epoch is confirmed as claimed.

During the reward claim, the chain must verify that the Host has completed all required work for the epoch. Chain also allows Hosts to submit overdue inference validations during the claim window. These checks require retaining all inference outputs together with their metadata. 

## Seed commitment and verification
The seed is a secret value generated independently by each Network Node before the start of an epoch. Prior to the epoch beginning, the Network Node commits to this seed by submitting its digital signature to the chain.
At the end of the epoch, in order to receive its reward, the node must reveal the seed itself. The chain then verifies that the revealed seed matches the signature that was previously recorded.

Example structure:
```
{
  "seed": 5839402176541298043, // the seed itself, revealed during the claim 
  "epoch_index": 101,
  "signature": "a5910d9b4156e403494a0ba148e6fb67e101ab2a7b7cf54eb15fa5bb5a46a2fdb1435a14954221008d294987075b75d247f26fa7d273720478f0ffb3189132f6", // the seed signature, committed beforehand
  "claimed": false
}
```

This mechanism ensures that each Host truly selected inference requests for validation randomly and did not manipulate the selection process. At the same time, no other Host is able to infer how the node performs its random selection, preventing adversarial adaptation.

## Relevant implementation references

- `Event_listener.go` [https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/event_listener/event_listener.go#L319](https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/event_listener/event_listener.go#L319)
- `Reward_recovery.go` [https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/startup/reward_recovery.go#L44](https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/startup/reward_recovery.go#L44)

## Why an unclaimed reward can occur

Although the claim process is automatic, it is not unconditional.

A reward may remain unclaimed if, during epoch N+1:

- the API node is offline or restarting
- the node cannot present the correct seed (terminal failure)
- required inference-validation data cannot be verified (terminal failure)
- network instability prevents finalization (retryable failure)  

The chain does not store inference data beyond the claim window, and cannot validate late claims.
Unclaimed rewards from earlier epochs are permanently burned.

## Reward claim failure matrix

| Failure condition | When it occurs | Outcome | Automatic retry | Manual claim possible | Final status |
|---|---|---|---|---|---|
| Temporary network instability | During epoch N+1 | Claim attempt fails but reward remains pending | Yes (every 30 minutes) | Yes (optional) | Recoverable until end of epoch N+1 |
| API node temporary downtime / restart | During epoch N+1 | Claim delayed | Yes (after node returns) | Yes (optional) | Recoverable until end of epoch N+1 |
| Node online but chain finalization fails | During epoch N+1 | Claim not finalized | Yes | Yes | Recoverable until end of epoch N+1 |
| Incorrect or missing seed | During epoch N+1 | Claim rejected | No | No | Recoverable during N+1 as long as the seed can be recovered |
| Seed lost locally | During epoch N+1 | Claim cannot be authorized | No | No | Permanently unrecoverable |
| Inference-validation data missing or corrupted | During epoch N+1 | Verification fails | No | No | Permanently unrecoverable |
| Excessive invalid or missed inferences | During epoch N | Host disqualified | N/A | No | Reward forfeited for epoch N |
| Confirmation (Random) PoC failure | During epoch N | Host penalized and jailed | N/A | No | Reward forfeited for epoch N |
| API node shutdown before claim completion | During epoch N+1 | Claim cannot complete | Yes (if node returns in time) | Yes (if within N+1) | Recoverable until end of epoch N+1 |
| Claim window expired (end of epoch N+1) | After epoch N+1 | Claim no longer allowed | No | No | Permanently burned |

## Manual reward claim
A manual claim function exists for operators who:

- are disabling or decommissioning nodes
- need to trigger a claim after fixing issues that prevented automatic claiming during epoch N+1
- want to force an immediate claim attempt rather than waiting for the automatic retry cycle

!!! note "Operational clarification"
    A short downtime during epoch N+1 does not require a manual claim.
    The system retries the claim automatically ~ every 30 minutes throughout epoch N+1.
    Manual claiming is only relevant if the node will not return to service in time, or if the operator wants to force a claim attempt sooner than the next scheduled retry.
    
    Manual reward claim does NOT recover rewards from expired epochs.
    
    If the API node was offline during epoch N+1 and the claim window has closed, the reward for epoch N becomes permanently unrecoverable.
    
    Manual claim only works for the immediately previous epoch and only if the correct seed is still present locally.

Manual reward claim:
```
curl -X POST http://localhost:9200/admin/v1/claim-reward/recover \
    -H "Content-Type: application/json" \
    -d '{"force_claim": true, "epoch_index": 106}'
```
This endpoint only works within the valid claim epoch (N+1). After the claim window closes, expired rewards cannot be recovered.

## Claim verification process
Claims are dependent on participation in validation of inferences. To ensure randomness, each Host submits the signature of a random seed they will use during the epoch to select inferences to validate.
During the claim operation, the node presents the seed whose signature was recorded on-chain at the start of the epoch.

The chain verifies that all inference sampling events used for validation were generated using this exact seed.

To perform this verification, the system needs access to all inference data, which is stored for only one epoch due to high storage costs.

You can query inference performance information using the following API:
```
GET /chain-api/productscience/inference/inference/epoch_performance_summary/<epochId>/<HostAddress>
```
Example
```
export NODE_URL=http://46.4.101.189:8000/
curl $NODE_URL/chain-api/productscience/inference/inference/epoch_performance_summary/84/gonka1q0a3u8s2azydlu2s2902qxwfz8d7mkze4lf45f | jq
```

This returns the performance summary for the specified epoch and Host.

## Conditions under which a reward may be forfeited
A Host may lose eligibility for a reward under the following conditions:

**1. Node shutdown before claim completion**

If the Host’s API node is stopped, restarted, or becomes unavailable before the reward is successfully claimed, the chain will be unable to complete the claim process.

**2. Excessive missed inference requests**

Inference correctness is evaluated continuously throughout the epoch. Two independent failure modes are tracked: 

- Excessive Invalid Inferences
- Excessive Missed Inferences (missed rate greater than 10 percent, adjusted for statistical error in small sample sizes; see the code for details).

Both metrics are sampled across the entire epoch. If either metric exceeds its protocol-defined failure threshold at any point, the Host is immediately subject to the following consequences:

- Removal from the active Hosts list
- Collateral slashing
- Forfeiture of all rewards for the current epoch

No compensation is issued for the Host’s work during that epoch; all contributed inferences are effectively unpaid. The specific parameters are defined at the protocol level and may be updated through on-chain governance. For authoritative behavior, Hosts should always refer to the current on-chain implementation.

**3. Early shutdown or mismanagement**

Premature shutdown before PoC completion or claim finalization results in reward loss.
These conditions are enforced at the protocol level and cannot be reversed.

**4. The Confirmation (Random) PoC**
Failing a Confirmation PoC has a direct and significant impact on a Host’s earnings. Since Confirmation PoC exists to ensure that Hosts continuously maintain the computational capacity they claimed, a failure is interpreted as evidence that the Host no longer provides the compute power underlying their declared PoC weight. As a result, the protocol enforces strict economic consequences.

- loss of all rewards for the current epoch
- implicit redistribution of rewards among remaining eligible Hosts through proportional reallocation
- collateral slashing
- invalidation of previously preserved PoC weight for reward calculation
