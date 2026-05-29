# FAQ

## Overview

### What is Gonka?
Gonka is a decentralized network for high‑efficiency AI compute — run by those who run it. It functions as a cost-effective and efficient alternative to centralized cloud services for AI model training and inference. As a protocol, it's not a company or a start-up.

- In terms of Blockchain, Gonka is the foundational ledger and coordination layer (L1) of the decentralized AI network. It records balances, transactions and cryptographic artifacts that prove Hosts have correctly performed AI work, while all actual computations (such as inference and training) happen off-chain.
- In terms of Network, Gonka is a comprehensive ecosystem of participants, including Hosts and Developers that interact through a decentralized infrastructure. Powered by the Gonka Blockchain, the network distributes tasks, verifies results, and rewards honest participation only verifiable useful work, creating a competitive, scalable environment for AI workloads.

### What problem is Gonka solving?

Gonka is a decentralized AI infrastructure built to reduce dependence on centralized cloud providers and to use computational power more efficiently than traditional decentralized networks. Its goal is to direct as much compute as possible toward useful AI tasks, such as inference and training, while minimizing waste due to consensus overhead.

### Who are the key participants in the Gonka ecosystem?

The Gonka ecosystem has four key participant groups:

- Developer builds and deploys AI applications by leveraging the network’s distributed computing power.
- Gonka Contributor participates in development of the core blockchain codebase, protocol upgrades, performance optimizations, security patches, and new feature integrations.
- Holder holds the network’s native coin, which simply means having a Gonka wallet with coins in it. Holders may hold coins, transfer or sell them, spend them on inference and use them according to the protocol rules. Being a holder does not imply any obligation, responsibility, or governance role beyond standard coin ownership.
- Host contributes compute capacity to the network. Hosts perform inference and other computational tasks and are rewarded proportionally to their contributed compute capacity, as long as they maintain honest participation and reliability. Hosts form the backbone of the network. Only Hosts have voting power in the network. This voting power represents their weight in governance and is used to propose and vote on protocol decisions, parameter changes, and upgrades. Any Host acts as Validator, Transfer Agent and an Executor (these are not predefined or on-chain roles, but dynamic operational functions assumed when processing a inference request).
	
### What is the GNK coin?
GNK is the native coin of the Gonka network. It is used to incentivize participants, price resources, and ensure the sustainable growth of the network.

### Can I buy GNK coin?

No, you can not buy GNK on exchanges right now because the coin has not been listed yet.
Follow official announcements on [Twitter](https://x.com/gonka_ai) for any updates regarding listings.

At the moment, the main legitimate way to obtain GNK before any listing is to [mine as a Host](https://gonka.ai/host/quickstart/) (GNK can already be earned by contributing computational resources to the network).

!!! note "Important"
	Be aware that fake GNK listings and pages currently exist, including on CoinGecko. These pages do not represent the official GNK coin and are not affiliated with the project in any way. GNK is not tradable on any exchange at this time. Any coin claiming to be GNK, whether on Solana or other networks, is not an official GNK asset. Always verify information through official channels.

### What makes the protocol efficient?
What differentiates Gonka from the "big players" is its pricing and the fact that, despite the Host's size, the inference is distributed equally. To learn more, please review the [Whitepaper](https://gonka.ai/whitepaper.pdf).
    
### How does the network operate?
The network's operation is collaborative and depends on the role you wish to take:

- As a [Developer](https://gonka.ai/developer/quickstart/): You can use the network's computational resources to build and deploy your AI applications.
- As a [Host](https://gonka.ai/host/quickstart/): You can contribute your computational resources to power the network. The protocol is designed to reward you for your contribution, ensuring the network's continuity and sovereignty.

### Is this documentation exhaustive?

No. This documentation covers the primary concepts, standard workflows, and the most common operational scenarios of the protocol, but it does not represent the full behavior or implementation details of the codebase. The code includes additional logic, interactions, and edge cases that are not described here.

Because Gonka is an open-source and decentralized network, various parameters, mechanisms, and governance-driven behaviors may evolve through on-chain voting and community decisions. Certain details may change after publication, and not all edge cases or future updates may be reflected immediately.

For Hosts, Developers, and Contributors, the ultimate source of truth is the code itself. If any discrepancy arises between this documentation and the code, the code always prevails.

Participants are encouraged to review the relevant repositories, governance proposals, and network updates to ensure their understanding aligns with the protocol’s current state.

### What is the incentive for contributing computational resources?
We've created a dedicated document focused on [Tokenomics](https://gonka.ai/tokenomics.pdf), where you can find all the information about how the incentive in being measured.
    
### What are the hardware requirements?
You can find the minimum and recommended [hardware specifications](https://gonka.ai/host/hardware-specifications/) clearly outlined in the documentation. You should review this section to ensure your hardware meets the requirements for effective contribution.

### What wallets can I use to store GNK coins?
You can store GNK coin in several supported wallets within the Cosmos ecosystem:

- [Keplr](https://www.keplr.app/)
- [Cosmostation](https://cosmostation.io/products/application)
- `inferenced` CLI - a command-line utility for local account management and network operations in Gonka.

!!! note "Important for existing Leap Wallet users"

	If you previously created your Gonka account with Leap Wallet, please be aware that [Leap is shutting down all of its products on May 28, 2026](https://www.leapwallet.io/), including the browser extension, mobile app, and dashboard.
	
	Because Leap is a non-custodial wallet, your assets and account remain on-chain. However, to keep access to your wallet, you should import your existing recovery phrase into another supported wallet, such as Keplr, before Leap services go offline.

### Where can I find useful information about Gonka?

Below are the most important resources for learning about the Gonka ecosystem:

- [gonka.ai](https://gonka.ai/) — the main entry point for project information and ecosystem overview.
- [Whitepaper](https://gonka.ai/whitepaper.pdf) — technical documentation describing the architecture, consensus model, Proof-of-Compute, etc.
- [Tokenomics](https://gonka.ai/tokenomics.pdf) — project tokenomics overview, including supply, distribution, incentives, and economic design.
- [GitHub](https://github.com/gonka-ai/gonka/) — access to the project’s source code, repositories, development activity, and open-source contributions.
- [Discord](https://discord.com/invite/RADwCT2U6R) — the primary place for community discussions, announcements, and technical support.
- [X (Twitter)](https://x.com/gonka_ai) — news, updates, and announcements.

## Tokenomics

### How is governance power calculated in Gonka?
Gonka uses a PoC-weighted voting model:

- Proof-of-Compute (PoC): Voting power is proportional to your verified compute contribution.
- Collateral commitment:
    - 20% of PoC-derived voting weight is activated automatically.
    - To unlock the remaining 80%, you must lock GNK coins as collateral.
- This ensures that governance influence reflects real compute work + economic collateral.

For the first 180 epochs (approximately 6 months), new participants can participate in governance and earn voting weight through PoC alone, without collateral requirements. During this period, the full governance rights are available, while voting weight remains tied to verified compute activity.

### Why does Gonka require locking GNK coins for governance power?
Voting power is never derived solely from holding coins. GNK coins serve as economic collateral, not as a source of influence. Influence is earned through continuous computational contribution, while locking GNK collateral is required to secure participation in governance and enforce accountability.

## Collateral

### What is collateral?
Collateral is required to activate the collateral-eligible portion of PoC weight after the Grace Period (first 180 epochs).
After the Grace Period:

- Base Weight (default 20%) is always active.
- The remaining weight requires GNK collateral to become active.

Collateral ensures that participants with governance weight also bear economic responsibility. Parameters are defined on-chain and may change via governance. Always verify current values before making economic decisions.

### Is collateral required per node or per account?
Collateral is deposited per account. If multiple ML nodes are linked to the same account, the required collateral is calculated based on the total account weight across all nodes.

### Do I need to deposit collateral?
Yes, if you want to activate more than the Base Weight.
If no collateral is deposited, only the Base Weight remains active.

### How much collateral is required?
Formula:
```
Required Collateral =
Total Weight × (1 - base_weight_ratio) × collateral_per_weight_unit
```
Because PoC weight may fluctuate across epochs, depositing the exact minimum may result in temporary under-collateralization.
Smaller weights may experience proportionally larger relative fluctuations. A buffer of up to 2× the calculated minimum is recommended while collateral levels remain relatively small.
```
Recommended (with conservative buffer):
Total Weight × 2 × (1 - base_weight_ratio) × collateral_per_weight_unit
```

### Can I partially collateralize my weight?
Yes. Your total Active Weight consists of:

- Base Weight (always active)
- Collateral-Eligible Weight (activated proportionally to deposited collateral)

If you deposit less than the full required amount:

- Base Weight remains fully active
- Only the corresponding portion of collateral-eligible weight becomes active
- The remaining portion stays inactive

Active Weight is calculated as:
```
Active Weight =
Base Weight +
(Deposited Collateral / Required Collateral) × Collateral-Eligible Weight
```

### What happens if I do not deposit enough collateral?
Your Active Weight is reduced proportionally. Because rewards are distributed proportionally to Active Weight, other hosts receive a larger share of emissions when you under-collateralize. Inactive weight is not directly redistributed, it simply does not participate in consensus.

### When does collateral take effect?
Collateral must be deposited before the start of the epoch to be effective. Collateral deposited during an epoch:

- does NOT increase weight immediately
- applies starting from the next epoch

Collateral cannot be increased mid-epoch.

### In what unit do I deposit collateral?
Transactions must use ngonka, not GNK.
```
1 GNK = 1,000,000,000 ngonka
```
Example:
```
10 GNK = 10,000,000,000 ngonka
```

### Can collateral be slashed?
Yes. Collateral may be slashed for:

- Invalid inference
- Downtime (Confirmation PoC failure or jail)
  
Invalid inference slashing is capped at once per epoch.
Downtime slashing may be applied per jail event.

### What happens to slashed coins?
Currently, slashed GNK is permanently burned and removed from circulation. Future governance may change this mechanism.

### Can I withdraw collateral?
Yes. Withdrawal triggers an unbonding period (default: 1 epoch). During unbonding, collateral remains subject to slashing. After unbonding funds are automatically returned to your account balance.

### What collateral is NOT

- Collateral is NOT voting power. Voting power is derived from PoC weight, not token balance.
- Collateral is NOT delegation. Each account must back its own weight.
- Collateral is NOT a permanent lock. It can be withdrawn (subject to unbonding).
- Collateral was NOT required during the Grace Period (first 180 epochs).

### How are epoch-minted rewards distributed?
A fixed amount of GNK is minted each epoch and distributed proportionally to Active PoC Weight.
Active Weight determines:

- Your share of epoch-minted Reward Coins
- Your governance influence

If your Active Weight is reduced due to insufficient collateral, your share of epoch rewards decreases proportionally. Inactive weight does not receive rewards.

### Do I need to manually deposit collateral?
Yes. Collateral must be deposited by submitting an on-chain transaction. It is not activated automatically. If no collateral is deposited:

- Your node continues operating normally.
- It is not jailed or disabled.
- Only the Base Weight (e.g. 20%) remains active.

Your rewards and governance influence will be reduced proportionally.

### Can vested (locked) GNK be used as collateral?
No. Collateral must be deposited from your available (unlocked) GNK balance. Vested coins that are not yet released cannot be used as collateral.

## Governance

### What types of changes require a Governance Proposal?
Governance Proposals are required for any on-chain changes that affect the network, for example:

- Updating module parameters (`MsgUpdateParams`)
- Executing software upgrades
- Adding, updating, or deprecating inference models
- Any other actions that must be approved and executed via the governance module

### Who can create a Governance Proposal?
Anyone with a valid governance key (cold account) can pay the required fee and create a Governance Proposal. However, each proposal must still be approved by active participants through PoC-weighted voting. Proposers are encouraged to discuss significant changes off-chain first (for example, via [GitHub](https://github.com/gonka-ai) or [community forums](https://discord.com/invite/RADwCT2U6R)) to increase the likelihood of approval. See [the full guide](https://gonka.ai/governance/transactions-and-governance/).

### What happens if a proposal fails?
- If a proposal does not meet quorum → it automatically fails
- If the majority votes `no` → proposal rejected, no on-chain changes
- If a significant percentage votes `no_with_veto` (above veto threshold) → proposal is rejected and flagged, signaling strong community disagreement
- Deposits may or may not be refunded, depending on chain settings

### Can governance parameters themselves be changed?
Yes. All key governance rules — quorum, majority threshold, and veto threshold — are on-chain configurable and can be updated via Governance Proposals. This allows the network to evolve decision-making rules as participation patterns and compute economic changes.

### What should I do if I cannot vote because I do not have access to the cold key, or if I want another key to vote on my behalf?

If the key that holds voting power is not the key you use for day-to-day operations, governance voting permission can be granted in advance.

In this setup:

- Granter = account that owns voting power (cold key)
- Grantee = account that will submit votes on the granter’s behalf (warm key)

There are two common scenarios:

**1. You want to vote, but you do not have access to the key that holds the voting power.**

Please contact the owner of that key and ask them to grant your key permission to vote on their behalf. Without this authorization, your key cannot submit a governance vote for that voting power.

**2. You want another key to vote on your behalf.**

Use the grant command below from the key that holds the voting power. This will authorize the grantee key to submit governance votes for you.
This delegation only allows voting on governance proposals. The grantee can still vote for their own key as well. The granter can revoke this permission at any time.

1) Grant voting permission (run from the granter key)
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
    
2) Verify the grant exists (run from any node)
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
    
3) Vote using the grantee
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
    
Voting options:

- `VOTE_OPTION_YES`
- `VOTE_OPTION_ABSTAIN`
- `VOTE_OPTION_NO`
- `VOTE_OPTION_NO_WITH_VETO`

4) Revoke delegation (run from the granter key)
=== "Command"

    ```
    ./inferenced tx authz revoke <GRANTEE_GONKA_ADDRESS> /cosmos.gov.v1beta1.MsgVote \
      --from=<GRANTER_KEY_NAME> \
      --chain-id=gonka-mainnet \
      --home .inference \
      --keyring-backend file
    ```
=== "Example response"

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

## Improvement proposals

### What’s the difference between Governance Proposals and Improvement Proposals?
Governance Proposals → on-chain proposals. Used for changes that directly affect the network and require on-chain voting. Examples:

- Updating network parameters (`MsgUpdateParams`)
- Executing software upgrades
- Adding new models or capabilities
- Any modification that needs to be executed by the governance module

Improvement Proposals → off-chain proposals under the control of active participants. Used for shaping the long-term roadmap, discussing new ideas, and coordinating larger strategic changes.

- Managed as Markdown files in the [/proposals](https://github.com/gonka-ai/gonka/tree/main/proposals) directory
- Reviewed and discussed through GitHub Pull Request
- Approved proposals are merged into the repository

### How are Improvement Proposals reviewed and approved?
The goal of community proposal review is to gather community validation: reactions, comments, and concrete feedback that strengthens the case for eventual governance approval. This is especially relevant if the proposal implementation requires a lot of work, long-term commitment, coordination or significant changes into the protocol.

- Read the recommended guide first: [https://github.com/gonka-ai/gonka/discussions/795](https://github.com/gonka-ai/gonka/discussions/795). It explains what belongs in Improvement Proposals and how to write a strong, structured proposal.
- Publish and discuss improvement proposals in [GitHub Discussions](https://github.com/gonka-ai/gonka/discussions) (preferred); previously they were stored as Markdown files in the `/proposals` directory.
- To help the community evaluate your proposal (and improve its chances later in governance), it’s in the proposer’s interest and responsibility to actively gather early feedback and support signals (reactions, comments, concrete concerns).
	- Share the Discussion link in Discord’s #improvements-proposals channel for reach and visibility, and amplify it through any other channels available to you (including direct outreach to Hosts/miners) to gather practical input and support.
	- Share context about your experience and expertise in the proposal thread. If you represent a team or a company, mention it and link relevant work to help the community assess credibility and evaluate the proposal more efficiently.
- Community review:
	- Active contributors and maintainers discuss the proposal in [GitHub Discussions](https://github.com/gonka-ai/gonka/discussions). Conversation can happen on any platform, but please consolidate the key context back in [GitHub Discussions](https://github.com/gonka-ai/gonka/discussions): it keeps the full history in one place, stays searchable, and is much easier to maintain over time. GitHub is the main source of truth.
	- Please ask questions, provide feedback, suggestions, refinements, and upvote relevant proposals. Everybody’s attention and participation in this process is essential for sustainable evolution of the chain.
- Strong positive feedback and a high number of upvotes signal genuine community demand, allowing teams to treat well-received proposals as part of a community-driven roadmap and begin implementation with confidence in both community alignment and eventual governance approval. Note that feedback from the hosts is essential - it can help structure the project into milestones, unlock partial bounty payments, and even secure grants from the community pool. Ultimately, however, all on-chain updates and payments are subject to governance approval.

### Can an Improvement Proposal lead to a Governance Proposal?
Yes. Often, an Improvement Proposal is used to explore ideas and gather consensus before drafting a Governance Proposal. For example:

- You might first propose a new model integration as an Improvement Proposal.
- After the community agrees, an on-chain Governance Proposal is created to update parameters or trigger the software upgrade.

## Voting 

### How does the voting process work?
- Once a proposal is submitted and funded with the minimum deposit, it enters the voting period
- Voting options: `yes`, `no`, `no_with_veto`, `abstain`
  
    - `yes` → approve the proposal
    - `no` → reject the proposal
    - `no_with_veto` → reject and signal a strong objection
    - `abstain` → neither approve nor reject, but counts toward quorum
   
- You can change your vote anytime during the voting period; only your last vote is counted
- If quorum and thresholds are met, the proposal passes and executes automatically via the governance module
  
To vote, you can use the command below. This example votes yes, but you can replace it with your preferred option (`yes`, `no`, `no_with_veto`, `abstain`):
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

### How can I track the status of a Governance Proposal?
You can query the proposal status at any time using the CLI:
```
export NODE_URL=http://47.236.19.22:18000
./inferenced query gov tally 2 -o json --node $NODE_URL/chain-rpc/
```

## Running a Node

### What if I want to stop mining but still use my account when I come back?
To restore a Network Node in the future, it will be sufficient to back up:

- cold key (most important, everything else can be rotated)
- secres from tmkms: `.tmkms/secrets/`
- keyring from `.inference .inference/keyring-file/`
- node key from `.inference/config .inference/config/node_key.json`
- password for warm key `KEYRING_PASSWORD`

### My node was jailed. What does it mean?
Your validator has been jailed because it signed fewer than 50 blocks out of the last 100 blocks (the requirement counts the total number of signed blocks in that window, not consecutive ones). This means your node was temporarily excluded (about 15 minutes) from block production to protect network stability.
There are several possible reasons for this:

- **Consensus Key Mismatch**. The consensus key used by your node may differ from the one registered on-chain for your validator. Make sure the consensus key you are using matches the one registered on-chain for your validator.
- **Unstable Network Connection**. Network instability or interruptions can prevent your node from reaching consensus, causing missed signatures. Ensure your node has a stable, low-latency connection and isn’t overloaded by other processes.

**Rewards**: Even if your node is jailed, you will continue to receive most of the rewards as a Host as long as it remains active in inference or other validator-related work. So, the reward is not lost unless inference issues are detected. 

**How to Unjail Your Node**: To resume normal operation, unjail your validator once the issue is resolved. Use your cold key to submit the unjail transaction:

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
Then, to check if the node was unjailed:
```
 ./inferenced query staking delegator-validators \
    <cold_key_addr> \
    --node $NODE_URL/chain-rpc/
```
When a node is jailed, it shows `jailed: true`.

### How to decommission an old cluster?

Follow this guide to safely shut down an old cluster without impacting reputation.

1) Use the following command to disable each ML Node:
    
```
curl -X POST http://localhost:9200/admin/v1/nodes/<id>/disable
```

You can list all node IDs with:

```
curl http://localhost:9200/admin/v1/nodes | jq '.[].node.id'
```

2) Nodes that are not scheduled to serve inference during the next Proof-of-Compute (PoC) will automatically stop during that PoC.
Nodes that are scheduled to serve inference will remain active for one more epoch before stopping. You can verify a node’s status in the mlnode field at:

```
curl http://<inference_url>/v1/epochs/current/participants
```

Once a node is marked as disabled, it is safe to power off the MLNode server.

3) After all MLNodes have been disabled and powered off, you can shut down the Network Node. Before doing so, it’s recommended (but optional) to back up the following files:

- `.dapi/api-config.yaml`
- `.dapi/gonka.db` (created after on-chain upgrade)
- `.inference/config/`
- `.inference/keyring-file/`
- `.tmkms/`

If you skip the backup, the setup can still be restored later using your Account Key.

### My node cannot connect to the default seed node specified in the `config.env`

If your node cannot connect to the default seed node, simply point it to another one by updating three variables in `config.env`.

1. `SEED_API_URL` - HTTP endpoint of the seed node (used for API communication).
    Choose any URL from the list below and assign it directly to `SEED_API_URL`.
    ```
    export SEED_API_URL=<chosen_http_url>
    ```
    Available genesis API URLs:
    ```
    http://185.216.21.98:8000
    http://36.189.234.197:18026
    http://36.189.234.237:17241
    http://node1.gonka.ai:8000
    http://node2.gonka.ai:8000
    http://node3.gonka.ai:8000
    https://node4.gonka.ai
    http://47.236.26.199:8000
    http://47.236.19.22:18000
    http://gonka.spv.re:8000
    ```
2. `SEED_NODE_RPC_URL` - Public Tendermint RPC access MUST go through the seed node HTTP(S) proxy path `/<chain-rpc>`.
Use the same scheme (http or https), host, and port as in `SEED_API_URL`, and append `/chain-rpc`.
    ```
    export SEED_NODE_RPC_URL=http://<host>/chain-rpc
    ```
    Example
    ```
    SEED_NODE_RPC_URL=http://node2.gonka.ai:8000/chain-rpc/ 
    ```
!!! note "Important"

	- Do NOT use `http://<host>:26657` as a public RPC endpoint.
	- Port `26657` MUST be internal-only (localhost/private network). Public RPC must go via `/<chain-rpc>`.
	
3. `SEED_NODE_P2P_URL` - the P2P address used for networking between nodes.
You must obtain the P2P port from the seed node’s status endpoint via the same `/<chain-rpc>` proxy.

    Query the node:
    ```
    http://<host>:<http_port>/chain-rpc/status
    ```
    Example
    ```
    https://node3.gonka.ai/chain-rpc/status
    ```
    Find `listen_addr` in the response, for example:
    ```
    ""listen_addr"": ""tcp://0.0.0.0:5000""
    ```
    
    Use this port:
    ```
    export SEED_NODE_P2P_URL=tcp://<host>:<p2p_port>
    ```
    Example
    ```
    export SEED_NODE_P2P_URL=tcp://node3.gonka.ai:5000
    ```
    
    Final result example
    ```
    export SEED_API_URL=http://node2.gonka.ai:8000
    export SEED_NODE_RPC_URL=http://node2.gonka.ai:8000/chain-rpc/
    export SEED_NODE_P2P_URL=tcp://node2.gonka.ai:5000
    ```

### How to change the seed nodes?

There are two distinct ways to update seed nodes, depending on whether the node has already been initialized.

=== "Option 1. Manually edit seed nodes (after initialization)"

    Once the file `.node_initialized` is created, the system no longer updates seed nodes automatically.
    After that point:
    
    - The seed list is used as-is
    - Any changes must be done manually
    - You can add as many seed nodes as you want
    
    The format is a single comma-separated string:
    ```
    seeds = "<node1_id>@<node1_ip>:<node1_p2p_port>,<node2_id>@<node2_ip>:<node2_p2p_port>"
    ```
    To view known peers from any running node, use chain RPC:
    ```
    curl http://47.236.26.199:8000/chain-rpc/net_info | jq
    ```

    In response, look for:
    
    - `listen_addr` -  P2P endpoint
    - `rpc_addr` - RPC endpoint
   
    Example: 

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
          "Listener(@tcp://47.236.26.199:5000)"
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

    This displays all peers the node currently sees.

=== "Option 2. Reinitialize the Node (seeds auto-applied from environment)"

    Use this method if you want the node to regenerate its configuration and automatically apply the seed nodes defined in `config.env`.
    ```
    source config.env
    docker compose down node
    sudo rm -rf .inference/data/ .inference/.node_initialized
    sudo mkdir -p .inference/data/
    ```
    After restarting the node, it will behave like a fresh installation and recreate its configuration, including the seeds from the environment variables.
    To verify which seeds were actually applied:
    
    ```
    sudo cat .inference/config/config.toml
    ```
    Look for the field:
    ```
    seeds = [...]
    ```

### How are Hardware, Node Weight, and ML Node configuration actually validated?

The chain does **not** verify real hardware. It only validates the total participant weight, and this is the sole value used for weight distribution and reward calculation. 

Any breakdown of this weight across ML Nodes, as well as any “hardware type” or other descriptive fields, is purely informational and can be freely modified by the Host.  

When creating or updating a node (for example, via `POST http://localhost:9200/admin/v1/nodes` as shown in the handler code at [https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/server/admin/node_handlers.go#L62](https://github.com/gonka-ai/gonka/blob/aa85699ab203f8c7fa83eb1111a2647241c30fc4/decentralized-api/internal/server/admin/node_handlers.go#L62)), the hardware field can be explicitly specified. If it is omitted, the API service attempts to auto-detect hardware information from the ML Node. 

In practice, many hosts run a proxy ML Node behind which multiple servers operate; auto-detection only sees one of these servers, which is a fully valid setup. Regardless of configuration, all weight distribution and rewards rely solely on the Host total weight, and the internal split across ML Nodes or the reported hardware types never affect on-chain validation.

### How to switch to `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`, upgrade ML Nodes, and remove other models?
This guide explains how Hosts should update their ML Nodes in response to changes in v0.2.8 model availability and the upcoming PoC v2 update. ML Node configuration compliance with PoC v2 is observed starting Epoch 155. Hosts are encouraged to review and prepare their ML Node configuration before that point. Migration to PoC v2 can be scheduled after epoch 155. After the migration phase, weights from ML Nodes that do not meet the configuration requirements may not be counted. 

**1. Background: model availability changes (upgrade v0.2.8)**

As part of the v0.2.8 upgrade, the active model set has been updated.

**Supported models (active set)**

Only the following models remain supported:

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `Qwen/Qwen3-32B-FP8`

`Qwen/Qwen3-32B-FP8` is supported during the migration period, but does not contribute to PoC v2 readiness or weight assignment. Participation in PoC v2 requires serving `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`.

**Removed models**

All previously supported models are removed from the active set and must not be served.

**2. PoC v2 readiness criteria (Important)**

Successful participation in the PoC v2 transition requires both of the following:

- All your ML Nodes serve `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`. This is the only model that contributes to PoC v2  weight.
- All your ML Nodes are upgraded to a PoC v2–compatible image:
    - ghcr.io/product-science/mlnode:3.0.12-post3
    - ghcr.io/product-science/mlnode:3.0.12-post3-blackwell 

!!! note "Important"
	- Serving the correct model without upgrading the ML Node is not sufficient.
	- Nodes that do not meet both conditions will not be eligible once the network switches to a single-model configuration.
	- The ML Node upgrade must be completed before the migration is finished and PoC v2 is activated through a separate governance proposal following the v0.2.8 upgrade.
	- The v0.2.8 upgrade itself does not enable PoC v2.

**3. Check ML Node allocation status (recommended safety step)**

Before changing models, you should inspect the current ML Node allocation. Query your Network Node admin API:
```
curl http://127.0.0.1:9200/admin/v1/nodes
```
Look for the field:
```
"timeslot_allocation": [
  true,
  false
]
```
Interpretation:

- First boolean: Whether the node is serving inference in the current epoch
- Second boolean: Whether the node is scheduled to serve inference in the next PoC

**Recommended behavior**

- Prefer changing the model only on nodes where the second value is `false`
- This reduces risk while PoC v2 behavior is still being observed
- Gradual rollout across epochs is encouraged
  
**4. Update models for ML Nodes: keep the supported model only**

Pre-download model weights (recommended). To avoid startup delays, pre-download weights into `HF_HOME`:
```
mkdir -p $HF_HOME
huggingface-cli download Qwen/Qwen3-235B-A22B-Instruct-2507-FP8
```
Use ML Node Management API to switch ML Node to a supported model (`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`).  

For example:
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
Changes applied via the Admin API will replace model for the next epoch ([https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode))

!!! note
	`node-config.json` is used only on the first launch of the Network Node API or when the local state/database is removed. Edit it for a fresh restart. For existing nodes, model updates should be performed via the Admin API. 
	
**5. Upgrade the ML Node image (required for PoC v2)**

Edit `docker-compose.mlnode.yml` and update the ML Node image:

Standard GPUs
```
image: ghcr.io/product-science/mlnode:3.0.12-post3
```
NVIDIA Blackwell GPUs
```
image: ghcr.io/product-science/mlnode:3.0.12-post3-blackwell
```
Apply changes and restart services. From `gonka/deploy/join`:
```
source config.env
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml pull
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d
```
**6. Verify model serving (applied at the next epoch)**

Confirm the ML Node is serving `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` only, which is the only model used for PoC v2 weights and future weight assignment:
```
curl http://127.0.0.1:8080/v1/models | jq
```
Optionally re-check node allocation:
```
curl http://127.0.0.1:9200/admin/v1/nodes
```
!!! note "Governance and PoC v2 activation notes"

	PoC v2 is introduced in stages, not activated all at once.
	
	**Stage 1. Observation (current state after v0.2.8)**
	
	After the v0.2.8 upgrade, PoC v2 logic is available but not active for weight assignment.
	
	During this stage:
	
	- Hosts are able to serve `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` or `Qwen/Qwen3-32B-FP8`
	- Hosts must switch their ML Nodes to serve `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` and upgrade them to PoC v2-compatible versions in order to contribute to PoC v2 weight.
	- The network observes adoption to assess Host readiness for moving to PoC v2 weights.
	  
	**Stage 2. Governance proposal (optional, future)**
	Once a sufficient level of adoption among active Hosts is observed (approximately 50%):
	
	- A separate governance proposal may be submitted
	- This proposal may request approval to activate PoC v2 and use PoC v2 for weight assignment
	
	The adoption threshold is observational only and does not trigger any automatic changes.
	
	**Stage 3. Activation (only after governance approval)**
	
	PoC v2 becomes the active method of weight assignment only if and when the governance proposal is approved by the chain.
	
	Until this proposal is approved:
	
	- PoC v2 remains inactive for weight assignment
	- The existing PoC mechanism continues to be used to determine weight

**Summary checklist**

Before PoC v2 activation, ensure that:

- ML Node serves `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- All other models are removed from the configuration
- ML Node image is `3.0.12-post3` (or `3.0.12-post3-blackwell`)

## Keys & security

### Which CLI version should be used for warm keys created after the v0.2.9 upgrade?

For granting permissions to new warm keys created after the v0.2.9 upgrade, the CLI [version v0.2.9](https://github.com/gonka-ai/gonka/releases/tag/release/v0.2.9) should be used.

### Where can I find information on key management?
You can find a dedicated section on [Key Management](https://gonka.ai/host/key-management/) in the documentation. It outlines the procedures and best practices for securely managing your application's keys on the network.

### I Cleared or Overwrote My Consensus Key

If you are using **tmkms** and deleted the `.tmkms` folder, simply restart **tmkms** — it will automatically generate a new key.
To register the new consensus key, submit the following transaction:
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

### I Deleted the Warm Key
Back up the **cold key** on your local device, outside the server.

1) Stop the API container:
    ```
    docker compose down api --no-deps
    ```

2) Set `KEY_NAME` for the warm key in your `config.env` file.
   
3) [SERVER]: Recreate the warm key:
    ```
    source config.env && docker compose run --rm --no-deps -it api /bin/sh
    ```

4) Then execute inside the container:
    ```
    printf '%s\n%s\n' "$KEYRING_PASSWORD" "$KEYRING_PASSWORD" | \
    inferenced keys add "$KEY_NAME" --keyring-backend file
    ```

5) [LOCAL]: From your local device (where you backed up the cold key), run the transaction:
    ```
    ./inferenced tx inference grant-ml-ops-permissions \
        gonka-account-key \
        <address-of-warm-key-you-just-created> \
        --from gonka-account-key \
        --keyring-backend file \
        --gas 2000000 \
        --node http://<node-url>/chain-rpc/
    ```

6) Start the API container:
    ```
    source config.env && docker compose up -d
    ```
    
## Proof-of-Compute (PoC)

### What is Proof-of-Compute?

Proof of Compute (PoC) is a consensus mechanism that replaces capital-based or hash-based weighting with provable Transformer-based computational capability. It defines how real AI compute is measured and converted into governance and consensus weight. PoC is executed through short, synchronized Sprints that occur at the end of each epoch. Outside the Sprint, the epoch is used for real-world AI computation. In practice, the terms Proof of Compute (PoC) and Sprint are often used interchangeably. When referring to “Next PoC” or “PoC phase”, this typically means the next Sprint, which is the execution phase of Proof of Compute.

### What is Sprint?

Sprint is a phase of Proof of Compute. During a Sprint, all Hosts simultaneously run AI-relevant inference on a transformer with randomized layers over a stream of nonces, producing output vectors. A Host’s voting power for the next epoch is proportional to the number of nonces it processed, as long as the reported outputs are verifiably produced by the required Sprint model.

### How to simulate Proof-of-Compute (PoC)?

You may want to simulate PoC on a ML Node yourself to make sure that everything will work when the PoC phase begins on the chain.

To run this test you either need to have a running  ML Node that isn't yet registered with the api node or pause the api node. To pause the api node use `docker pause api`. Once you’re finished with the test you can unpause: `docker unpause api`.

For the test itself you will be sending POST `/v1/pow/init/generate` request to ML Node, the same that api node sends at the start of the POC phase:
[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32)

The following model params are used for PoC: [https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41)

If your node is in the `INFERENCE` state then you first need to transition the node to the stopped state:

```
curl -X POST "http://<ml-node-host>:<port>/api/v1/stop" \
  -H "Content-Type: application/json"
```

Now you can send a request to initiate PoC:

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
Send this request to `8080` port of ML Node's proxy container or directly to ML Node's `8080` [https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/deploy/join/docker-compose.mlnode.yml#L26](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/deploy/join/docker-compose.mlnode.yml#L26)

If the test runs successfully, you will see logs similar to the following:
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
Then the service will start sending generated nonces to `DAPI_API__POC_CALLBACK_URL`.
```
2025-08-25 20:54:58,822 - pow.service.sender - INFO - Sending generated batch to http://api:9100/
```
The http://api:9100 url won’t be available if you paused the api container or if ML Node container and api containers don’t share the same docker network. Expect to see error messages saying that the ML Node failed to send generated batches. The important part is to make sure that the generation process is happening.

### What does a confirmation ratio of 0 mean, and what should I do if this happens?

A 0% confirmation ratio is an unusual condition and indicates that no nonces were sent from your API node during the epoch, meaning the node did not participate in Confirmation Proof-of-Compute (CPoC) at all. To investigate, check the API node logs and ML Node logs, as they should indicate why nonce submission did not occur.

Possible causes include:

- API node misconfiguration or downtime
- publicly exposed admin or management ports that allow access to ML Nodes
- consensus node lagging behind the chain, which may delay PoC participation beyond the allowed window
- ML Node driver failures

To mitigate this risk, ensure that admin and management ports are not publicly accessible, verify that the API node is running and correctly configured, monitor consensus node synchronization, and set up alerts for ML Node and driver failures.

## Performance & troubleshooting

### How do I protect my node from DDoS attacks using the proxy pre-release (v0.2.8)?

A new proxy version is available with rate limiting and DDoS protection measures.

What’s New:

- Rate limiting on API/RPC endpoints, as protection against excessive requests that have been affecting network nodes
- Blocks resource-intensive internal routes like `training` and `poc-batches`
- Optional disabling of `/chain-api`, `/chain-rpc`, and `/chain-grpc` endpoints

**Update instructions**

**Step 1**: Update proxy image
```
sed -i -E 's|(image:[[:space:]]*ghcr.io/product-science/proxy)(:.*)?$|\1:0.2.8-pre-release-proxy@sha256:6ccb8ac8885e03aab786298858cc763a99f99543b076f2a334b3c67d60fb295f |' docker-compose.yml
```
!!! note "Important"
	Step 2 disables `/chain-api`, `/chain-rpc`, and `/chain-grpc` endpoints on this node. After applying it, this node will no longer serve public RPC traffic. If you operate public RPC endpoints, you must run separate RPC-only nodes (without these restrictions) and keep this node private.

**Step 2 (Optional)**: Disable `chain-api`, `chain-rpc`, and `chain-grpc`

If you want to completely disable `/chain-api`, `/chain-rpc`, and `/chain-grpc` endpoints:
```
sed -i 's|DASHBOARD_PORT=5173|DASHBOARD_PORT=5173\n      - DISABLE_CHAIN_API=${DISABLE_CHAIN_API:-true}\n      - DISABLE_CHAIN_RPC=${DISABLE_CHAIN_RPC:-true}\n      - DISABLE_CHAIN_GRPC=${DISABLE_CHAIN_GRPC:-true}\n|' docker-compose.yml
```
Disable the training URL that was used for recent attacks:
```
sed -i -E -e '/GONKA_API_(EXEMPT|BLOCKED)_ROUTES/d' -e 's|(- GONKA_API_PORT=9000)|\1\n      - GONKA_API_EXEMPT_ROUTES=chat inference\n      - GONKA_API_BLOCKED_ROUTES=poc-batches training|' docker-compose.yml
```
After this, your proxy configuration should look like:
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
**Step 3:** Pull and restart proxy
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull proxy
source ./config.env && docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d --no-deps proxy
```
**Step 4:** Close External Port 26657

You can close port 26657 as an external port.

It is optional, but highly recommended:
```
sed -i 's|- "26657:26657"|#- "26657:26657"|g' docker-compose.yml
```
This will comment out the port mapping in your node container:
```
node:
    container_name: node
    ...
    ports:
      - "5000:26656" #p2p
      #- "26657:26657" #rpc
```
**Step 5:** Restart the node:
```
source ./config.env && docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d --no-deps node
```
**Accessing Node Status After Closing Port 26657**

If you previously accessed the node status using `curl -s http://localhost:26657/status`, you can now access it from within the containers:

=== "Option 1: From the proxy container (using `curl`)"

	```
	docker exec proxy curl -s node:26657/status | jq
	```
=== "Option 2: From the node container (using `wget`)"

	```
	docker exec node wget -qO- http://localhost:26657/status | jq
	```
	
For continuous monitoring with `watch`:
```
watch -n 5 'docker exec node wget -qO- http://localhost:26657/status | jq -r ".result.sync_info | \"Block: \(.latest_block_height) | Time: \(.latest_block_time) | Syncing: \(.catching_up)\""'
```

### How much free disk space is required for a Cosmovisor update, and how can I safely remove old backups from the `.inference` directory?
Cosmovisor creates a full backup in the `.inference` state folder whenever it performs an update. For example, you can see a folder like `data-backup-<some_date>`.
As of November 20, 2025, the size of the data directory is about 150 GB, so each backup will take approximately the same amount of space.
To safely run the update, it is recommended to have 250+ GB of free disk space.
You can remove old backups to free space, although in some cases this may still be insufficient and you might need to expand the server disk.
To remove an old backup directory, you can use:
```
sudo su
cd .inference
ls -la   # view the list of folders. There will be folders like data-backup... DO NOT DELETE ANYTHING EXCEPT THESE
rm -rf <data-backup...>
```

### How to prevent unbounded memory growth in NATS?

NATS is currently configured to store all messages indefinitely, which leads to continuous growth in memory usage.
A recommended solution is to configure a 24-hour time-to-live (TTL) for messages in both NATS streams.

1. Install the NATS CLI. Install Golang by following the instructions here: [https://go.dev/doc/install](https://go.dev/doc/install). Then install the NATS CLI:
   ```
   go install github.com/nats-io/natscli/nats@latest
   ```
2. If you already have the NATS CLI installed, run:
    ```
    nats stream info txs_to_send --server localhost:<your_nats_server_port>
    nats stream info txs_to_observe --server localhost:<your_nats_server_port>
    ```
### How to change `inference_url`?

You may need to update your `inference_url` if:

- You changed your API domain;
- You moved your API node to a new machine;
- You reconfigured HTTPS / reverse proxy;
- You are migrating infrastructure and want your Host entry to point to a new endpoint.

This operation does not require re-registration, re-deployment, or key regeneration. Updating your `inference_url` is performed through the same transaction used for initial registration (the `submit-new-participant msg`).

The chain logic checks whether your Host (participant) already exists:

- If the participant does not exist, the transaction creates a new one;
- If the participant already exists, only three fields may be updated: `InferenceURL`, `ValidatorKey`, `WorkerKey`.

All other fields are preserved automatically.

This means updating `inference_url` is a safe, non-destructive operation.

!!! note

    When a Node updates its execution URL, the new URL becomes active immediately for inference requests coming from other Nodes. However, the URL recorded in `ActiveParticipants` is not updated until the next epoch because modifying it earlier would invalidate the cryptographic proof associated with the participant set. To avoid service disruption, it is recommended to keep both the previous and the new URLs operational until the next epoch completes.

[LOCAL] Perform the update locally, using your Cold Key:
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
Verify the update by following the link below and replacing the ending with your node address [http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/participant/gonka1qqqc2vc7fn9jyrtal25l3yn6hkk74fq2c54qve](http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/participant/gonka1qqqc2vc7fn9jyrtal25l3yn6hkk74fq2c54qve)

### Why is my `application.db` growing so large, and how do I fix it?

Some nodes have an issue with growing size of `application.db`. 

`.inference/data/application.db` stores the history of states for the chain (not blocks), by default it's state for 362880. 

The state history contains a full merkle tree per each state and it's safe to have it preserved for significantly shorter length. For example, only for 1000 blocks.

The pruning parameters can be set in `.inference/config/app.toml`:

```
...
pruning = "custom"
pruning-keep-recent = "1000"
pruning-interval    = "100"
```

New configuration will be used after restart of the `node` container. But there is a problem - even when pruning is enabled, database clean is really slow.

There are several ways how to reset `application.db`: 

=== "OPTION 1: Full resync from snapshot" 

    1) Stop node
        ```
        docker stop node
        ```
    
    2) Remove data 
        ```
        sudo rm -rf .inference/data/ .inference/.node_initialized
        sudo mkdir -p .inference/data/
        ```
    
    3) Start node
        ```
        docker start node
        ```
    
    This approach may take some time during which the node will not be able to record transactions.
    
    Please use available trusted nodes to download snapshot.

=== "OPTION 2: Resync from local snapshot" 

    Snapshots are enabled by default and stored in `.inference/data/snapshots`
    
    1) Prepare new `application.db` ( `node` container's still running)
    
    1.1) Prepare temporary home directory for `inferenced`
        ```
        mkdir -p .inference/temp
        cp -r .inference/config .inference/temp/config
        mkdir -p .inference/temp/data/
        ```
    
    1.2) Copy snapshots: 
        ```
        cp -r .inference/data/snapshots .inference/temp/data/
        ```
    
    1.3) List snapshots 
        ```
        inferenced snapshots list --home .inference/temp
        ```
    
    Copy height for the latest snapshot. 
    
    1.4) Start restoring from snapshot ( `node` container is still running) 
        ```
        inferenced snapshots restore <INSERT_HEIGHT> 3  --home .inference/temp
        ```
    
    This might take some time. Once it is finished, you'll have new `application.db` in `.inference/temp/data/application.db`
    
    2) Replace `application.db` with new one
    
    2.1) Stop `node` container (from another terminal window) 
        ```
        docker stop node
        ```
    
    2.2) Move original `application.db` 
        ```
        mv .inference/data/application.db .inference/temp/application.db-backup
        mv .inference/wasm .inference/wasm.db-backup
        ```
    
    2.3) Replace it with new one 
        ```
        cp -r .inference/temp/data/application.db .inference/data/application.db
        cp -r .inference/temp/wasm .inference/wasm
        ```
    
    2.4) Start `node` container (from another terminal window): 
        ```
        docker start node
        ```
    
    3) Wait till `node` container is synchronized and delete `.inference/temp/`
    
    If you have several nodes, it is recommended cleaning one by one.

=== "OPTION 3: Experimental"

    Additional option might be to start separate instance of `node` container on separate CPU only machine and setup in strict validator mode:
    
    - preserve really short history
    - limit RPC and API access only to `api` container
    
    Once it's running, move existing `tmkms` volume to the new node (disable block signing on existing one first). 
    
    This is the general idea of the approach. If you decide to try it and have any questions, feel free to reach out on [Discord](https://discord.com/invite/RADwCT2U6R).

=== "OPTION 4: Upgrade to the pruning fix" 

	A fix is now available for the long-standing issue where `application.db` continues to grow under many pruning configurations.
	This improvement was contributed by [Lelouch33](https://github.com/Lelouch33) and is included in release [`0.2.10-post6`](https://github.com/gonka-ai/gonka/compare/main...release/v0.2.10-post6). With the updated logic and the following settings, `application.db` can remain around 100 GB:
	
	- `SNAPSHOT_INTERVAL=1000`
	- `SNAPSHOT_KEEP_RECENT=2`
	- `pruning-keep-recent = "20000"`
	- `pruning-interval = "512"`
	
	References:
	
	- [https://github.com/gonka-ai/gonka/issues/819#issuecomment-3996332369](https://github.com/gonka-ai/gonka/issues/819#issuecomment-3996332369)
	- [https://github.com/gonka-ai/gonka/pull/867](https://github.com/gonka-ai/gonka/pull/867)
	
	After upgrading to this binary, pruning will begin after the next snapshot block. This process is relatively heavy and may temporarily slow down the `node` container while the old state history is being removed.
	
	To reduce operational impact, it is recommended to apply the update to nodes one by one and use a higher `pruning-interval`, such as `512`, to avoid pruning too frequently.
	
	If a node slows down significantly during pruning, restarting the node container may help it catch up.
	
	Applying this update before the upcoming v0.2.11 upgrade is recommended to prevent pruning from starting simultaneously across many nodes.
	
	Apply update (example from `v0.2.7`, which has identical `inferenced`):
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

### Automatic `ClaimReward` didn’t go through, what should I do?

If you have unclaimed reward, execute:
```
curl -X POST http://localhost:9200/admin/v1/claim-reward/recover \
    -H "Content-Type: application/json" \
    -d '{"force_claim": true, "epoch_index": 106}'
```
To check if you have unclaimed reward you can use:
```
curl http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/epoch_performance_summary/106/<ACCOUNT_ADDRESS> | jq
```

## Upgrades

### Upgrade v0.2.12: Pre-Upgrade Model Cleanup

!!! note "Important"
	This cleanup process **must be completed before the upgrade happens**. If you upgrade before cleaning up the models, your node will be rejected and go offline.

Version 0.2.12 removes every governance model that is not on the post-upgrade approved list. On mainnet, only the previously enforced model and Kimi will remain.

Each DAPI persists its MLNode configurations locally. On startup, it validates every configured model against the on-chain governance list. If a configuration includes at least one unsupported model, the entire node is rejected and the host goes offline. 

Version 0.2.11 masked this problem by trimming the runtime view down to the enforced model, so `/admin/v1/nodes` appeared clean even when the persisted config still contained extra models. Version 0.2.12 stops this trimming, meaning the persisted config is loaded directly.

To fix this, the script below finds each node with extra models in `/admin/v1/config` and sends a `PUT` request with a cleaned config to `/admin/v1/nodes/<id>`. These changes are persisted within 60 seconds. The remaining model's arguments, hardware, and ports are preserved exactly. Nodes that do not list the enforced model are skipped and will require manual fixing.

Paste the following script into the host's shell. By default, it will apply the changes. To preview the changes without applying them, set `APPLY=dry` (or any value other than `--apply`).

Script in the repository: 

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


Wait 60 seconds after running the script to ensure the changes are persisted before triggering the upgrade. Then, verify the configuration:

```bash
curl -sS http://127.0.0.1:9200/admin/v1/config \
  | jq '.nodes[] | {id, models: (.models | keys)}'
```

Expected output:
```json
{
  "id": "<nodeId>",
  "models": [
    "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8"
  ]
}
```
*(Additional nodes will follow the same format)*



### Upgrade v0.2.12: Pre-download binaries

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

## Bounty program

### What is the bounty program? Who can participate? How are rewards paid?

It’s not necessary to be a Host to participate: many bounties go to contributors who submit fixes, implement improvements, or contribute to broader Gonka infrastructure. 

Awards are paid from the community pool after governance approval. Vulnerability reports are especially valued, and responsible disclosures that help prevent exploits and improve network safety are eligible for bounties as well. 

Final bounty decisions, amounts, and categories are always up to community governance.

### What is the vulnerability bounty pricing model  

A common way to think about severity is: 
```
Risk = Impact × Likelihood
```
Impact is evaluated from a network perspective (a network-wide effect is required for High/Critical). Issues affecting only one participant typically cap at Low or Medium.

**Impact levels**

| Level    | Description                         | Examples                                                                 |
|----------|--------------------------------------|--------------------------------------------------------------------------|
| Critical | Catastrophic for the whole network   | Full network control hijack                                              |
| High     | Significant disturbance at scale      | Network crash/halt; theft from module; wrong rewards for all participants |
| Medium   | Moderate disruption, limited scope    | Consensus or reward integrity at risk; single-participant funds or availability |
| Low      | Minor impact on isolated participants, no chain impact | single-component, minor effect on a single participant, non-chain |

**Likelihood**

- **Organic — Unintentional;** occurs under normal conditions. Estimate by probability (how often conditions trigger it, usage patterns).
- **Intentional — Profitable** — Exploited for financial gain. Higher likelihood when gain is large and cost/complexity is low.
- **Intentional — Griefing** — Exploited to cause disruption. Higher likelihood when network-wide effect and low cost; single-participant griefing → lower likelihood.

**Risk Matrix**

| Impact \ Likelihood | High     | Medium   | Low           |
|---------------------|----------|----------|---------------|
| Critical            | Critical | Critical | High          |
| High                | Critical | High     | Medium        |
| Medium              | High     | Medium   | Low           |
| Low                 | Medium   | Low      | Informational |

### How to get started in the bounty program?

- A new GitHub issue/discussion can be created to propose an improvement and get community feedback on whether it’s worth implementing.
- Or pick an[ existing issue labeled up-for-grabs](https://github.com/gonka-ai/gonka/issues?q=is%3Aissue%20state%3Aopen%20label%3Aup-for-grabs). Before starting, leave a quick comment that work has started and include an approximate ETA, so others have visibility and avoid duplicate effort.

### What is the suggested vulnerability reporting process?

- If an issue is not high or critical severity (limited impact, no network-wide effect) and the fix is low effort, opening a PR right away is usually fine.
- If an issue is high or critical severity, please report it privately to trusted community members (long-term Gonka repository contributors), either as a report or together with a fix in a private fork.
- If an issue looks like part of a broader class and a systematic review would likely uncover more issues of the same category, leave a note that a review is planned. This helps avoid duplicate reviews running in parallel.

To contribute, pick an issue, ship a solid fix, and share the link in the relevant dev channels to get feedback. 

### Where can I see who was paid bounties, for what, and when?

The most reliable sources are on-chain records and [GitHub](https://github.com/gonka-ai/gonka/). Use them as the main source of truth for who was paid, what the bounty was for, and when it was executed.

## Errors

### `No epoch models available for this node`

Here you can find examples of common errors and typical log entries that may appear in node logs.

```
2025/08/28 08:37:08 ERROR No epoch models available for this node subsystem=Nodes node_id=node1
2025/08/28 08:37:08 INFO Finalizing state transition for node subsystem=Nodes node_id=node1 from_status=FAILED to_status=FAILED from_poc_status="" to_poc_status="" succeeded=false blockHeight=92476
```
It’s not actually an error. It just indicates that your node hasn’t been assigned a model yet. Most likely, this is because your node hasn’t participated in a Sprint, hasn’t received Voting Power, and therefore hasn’t had a model assigned.
If your node has already passed PoC, you shouldn’t see this log anymore. If not, PoC takes place every ~24 hours.

### How do I fix `err="no validator signing info found"` when starting from a state sync snapshot?

If you periodically hit `err="no validator signing info found"` during startup from a state sync snapshot, it is typically related to the Cosmos SDK `iavl-fastnode` behavior. A safe workaround is to disable `fastnode` for the initial startup, then (optionally) re-enable it after the node is fully synced.

**Fix (Docker):**

1.	Stop the node:
```
docker stop node
```
2. In `.inference/config/app.toml`, set:
```
iavl-disable-fastnode = true
```
3. Start the node:
```
docker start node
```
After a restart, the issue should not recur.

!!! note 
	`main` includes v0.2.10-post6. Nodes starting from this version apply this setting automatically, so you typically won’t need to change it manually.

## Inference 

### Why does the 4,096 output token limit cause the model to stall entirely during thinking — returning zero tokens, even on moderately sized requests?

**Kimi-K2.6-specific behavior.** The model emits `<think>...</think>` blocks, and **both sections (`<think>` and visible content) reduce the `max_tokens` counter equally**. With small `max_tokens`, the model burns the entire budget inside `<think>` and returns only `</think>`, which vLLM strips as a special token. The result is `content=null`, `finish_reason=length`, and from the client side this looks like "0 tokens".

At the gateway level, the following rules apply (all in `devshard-0.2.13`):

- **Floor `max_tokens >= 16`** ([PR #1227](https://github.com/gonka-ai/gonka/pull/1227)): previously, `max_tokens=1` from probe clients was guaranteed to return `content=null`. Now it is silently raised to 16.
- **`thinking_token_budget` resolver** ([PR #1202](https://github.com/gonka-ai/gonka/pull/1202)):
  - If the client sent `max_tokens < 256`, `ttb` is forced to **0** (overrides the client value). The model does not enter hidden thinking.
  - Otherwise, if `ttb` is missing, the default is `ttb = max_tokens / 2`.
  - Absolute cap: `ttb <= 96,000` (Moonshot HLE/AIME budget).
  - Clamp: `ttb <= max_tokens - 64` (64-token headroom for visible content after `</think>`).
- **`thinking: {"type":"disabled"}` mirror** (PR #1224): the gateway mirrors the resolution into `chat_template_kwargs.thinking=false`. The Kimi chat template reads this kwarg; top-level `thinking` is stripped.

**Verified live:** scenarios that historically returned `content=null` (`max_tokens=1`, probe-shaped `{max_tokens:100, min_tokens:100, thinking_token_budget:50}`) now return non-empty content through a broker running the current gateway.

**For Inference User:**

- Re-test against a broker with gateway >= 0.2.13 (release dated 2026-05-23 or later).
- If you still see zero tokens, capture the `id` from the response (`devshard-XXXX-YYY`) and send it to your broker.
- **Do not rely only on `thinking:disabled`:** to guarantee that thinking is disabled, send `thinking_token_budget: 0` explicitly (see "[With Kimi K2, the entire token limit can be spent on thinking with no actual output. Is this an output cap, bandwidth, or upstream issue?](https://gonka.ai/docs/FAQ/#with-kimi-k2-the-entire-token-limit-can-be-spent-on-thinking-with-no-actual-output-is-this-an-output-cap-bandwidth-or-upstream-issue)").

**For Broker:** make sure your gateway image includes PR [#1202](https://github.com/gonka-ai/gonka/pull/1202), [#1224](https://github.com/gonka-ai/gonka/pull/1224), and [#1227](https://github.com/gonka-ai/gonka/pull/1227), meaning >= `devshard-0.2.13`. Without them, the only workaround is to patch on the client side: inject `thinking_token_budget = max_tokens / 2` for Kimi and reject `max_tokens < 16`.

### With Kimi K2, the entire token limit can be spent on thinking with no actual output. Is this an output cap, bandwidth, or upstream issue?

**Same root cause as in "[Why does the 4,096 output token limit cause the model to stall during thinking, returning zero tokens?](https://gonka.ai/docs/FAQ/#why-does-the-4096-output-token-limit-cause-the-model-to-stall-entirely-during-thinking-returning-zero-tokens-even-on-moderately-sized-requests)":** model-side reasoning split (`<think>` and visible content share `max_tokens`), not bandwidth and not an output cap. There are two escape hatches, both available in production:

1. **`thinking: {"type": "disabled"}`**: the gateway mirrors this into `chat_template_kwargs.thinking=false` (the Kimi chat template reads this kwarg) and removes the top-level `thinking`. `"adaptive"` and `"auto"` are also accepted (Claude Code CLI / Anthropic SDK preset, PR [#1224](https://github.com/gonka-ai/gonka/pull/1224)). Both resolve to `enabled`.
2. **`thinking_token_budget: 0`**: explicit zero is passed directly into vLLM as a generation parameter and reliably zeroes out the thinking budget.

**Important nuance:** these two mechanisms work at different levels (chat-template hint vs. generation parameter) and do not overlap. `thinking:disabled` does NOT automatically zero out `thinking_token_budget`. So with the default `max_tokens=4096` and only `disabled`, the model still receives a hidden budget of `ttb=2048` from the gateway resolver. On most prompts, the template hint will still persuade the model not to think, but on complex reasoning tasks the model may ignore the hint. **Belt and suspenders:** for critical flows, send both parameters together.

**Numeric confirmation (same bug-finding prompt, `max_tokens=500`, semantically identical answer):**

| Config | usage.completion_tokens | Wall-clock |
|---|---:|---:|
| `thinking: {"type":"disabled"}` | **65** | 3.6s |
| Default - gateway automatically sets `ttb=250` | **312** | 12.5s |

Half of the default budget gets spent on hidden thinking even for a trivial task, which is why disabling thinking is recommended for tool-heavy and agentic flows.

**For Inference User:**

- For tool-heavy or agentic flows where reasoning is not needed, use `"thinking": {"type": "disabled"}` (Kimi) or `"enable_thinking": false` (Qwen, translated automatically).
- For complex reasoning, set `thinking_token_budget` explicitly. Do not rely on the default `max_tokens / 2`.
- If `thinking:disabled` still causes budget burn on your prompt, also send `thinking_token_budget: 0` explicitly.

**For Broker:** see "[Why does the 4,096 output token limit cause the model to stall during thinking, returning zero tokens?](https://gonka.ai/docs/FAQ/#why-does-the-4096-output-token-limit-cause-the-model-to-stall-entirely-during-thinking-returning-zero-tokens-even-on-moderately-sized-requests)". Pin to a build with PR [#1202](https://github.com/gonka-ai/gonka/pull/1202)/[#1224](https://github.com/gonka-ai/gonka/pull/1224)/[#1227](https://github.com/gonka-ai/gonka/pull/1227) (>= `devshard-0.2.13`). On the landing page, mention that Kimi for tool-heavy work requires either `thinking:disabled`, an explicit `thinking_token_budget`, or a large `max_tokens`.

### The input token cap for Kimi is 4k tokens, and the output cap is 8,192 tokens. When will these limits be raised?

**The numbers in the question are incorrect:**

- Output cap: **up to 4,096** at the network level; **the real cap depends on the broker** (e.g., measured 3,072 on gonka-api.org). Not 8,192.
- Input: **up to 240,000 tokens** (`--max-model-len` on the mainnet Kimi deploy). Not 4,000.

**Where the output cap comes from.** In the gateway code: `DefaultRequestMaxTokens = 3,072`, `RequestMaxTokensCap = 4,096` (`devshard/cmd/devshardctl/gateway.go:143-144`).

The cap is **not set by on-chain governance**: the chain stores `context_window`, `units_of_compute_per_token`, `coins_per_input_token`, `coins_per_output_token`, and model_args for deployment, but there is **no field for output cap**. Therefore, per-model relaxation is done **locally by the broker operator** through the admin endpoint `POST /v1/admin/settings` (the `GatewayModelLimitSettings` structure in `devshard/cmd/devshardctl/gateway_store.go:32`, field `request_max_tokens_cap` per model). To raise the network-wide ceiling above 4,096, a PR plus a new devshard release are needed.

**Where 240k input comes from.** The mainnet Kimi-K2.6 deploy was registered through on-chain governance proposal v0.2.12 (`inference-chain/app/upgrades/v0_2_12/upgrades.go:kimiGovernanceModel()`) with `ModelArgs: ["--max-model-len","240000","--tool-call-parser","kimi_k2","--reasoning-parser","kimi_k2"]` and `VRam: 720` (GB). The model card declares a 256K native context (`docs/chat-api/kimi-k2.6.md:11`). The gateway does not separately limit input except for the universal body size limit (10 MiB) and messages count (<= 2,048), as described in `docs/chat-api/README.md`, section "Request limits".

**Important caveat (open issue):** even if a broker agrees to raise the output cap, individual nodes may be running with a smaller `--max-model-len`. This is a known unfixed issue: `devshard/docs/known-issues.md` §3, "Some nodes have lower max context than expected".

**For Inference User:**

- The real effective output cap is determined by the broker. Ask what `request_max_tokens_cap` they set for each model.
- If you hit a small input limit, it is almost certainly `--max-model-len` on a specific node, not a global network limit. Retry: the next request may land on a node with a larger context window.
- If you hit the output cap, ask the broker to raise it. For a network-wide bump above 4,096, that requires a code change, so raise it through a GitHub Discussion in `gonka-ai/gonka`.

**For Broker:**

- You can raise the output cap per model today through `POST /v1/admin/settings` with `model_limits[].request_max_tokens_cap`, without a code change. This immediately gives clients more output within the network ceiling (4,096).
- A network-wide bump above 4,096 requires a PR in gateway code plus a new release. If you have a stable demand for larger outputs, open a Discussion.

### Agents like Hermes and OpenClaw with 30k+ system prompts fail on Kimi. Why?

**Kimi supports 30k+ input without issues.** Native context window is 256K, the mainnet deploy uses `--max-model-len 240,000`, and the gateway accepts request bodies up to 10 MiB. Empirically verified: ~69,000 prompt tokens (about 800 messages x 80 words) completed successfully in 5.5 seconds.

**Verification sources (all in `gonka-ai/gonka`):**

- Native context 256K: `docs/chat-api/kimi-k2.6.md`, "Model facts", line 11.
- Mainnet deploy params (registered on-chain): `inference-chain/app/upgrades/v0_2_12/upgrades.go:kimiGovernanceModel()` with `ModelArgs: ["--max-model-len","240000","--tool-call-parser","kimi_k2","--reasoning-parser","kimi_k2"]`.
- Body / messages limits (10 MiB, <= 2,048 messages): `docs/chat-api/README.md`, section "Request limits".

**When 30k still breaks, there are two typical causes:**

1. **One rejected field in the agent payload.** The gateway maintains a strict parameter allowlist. If the agent sends even one field that is not part of the OpenAI Chat Completions standard (for example, `tags`, `enforced_tokens`, `plugins`, `guided_json`), the entire request is rejected with HTTP 400. Full list with explanations: `docs/chat-api/troubleshooting.md`. Hermes-specific `tags` reject: anchor `#reject-tags`. Empirically: valid 69k payload + `tags:["session:abc"]` returns HTTP 400 in 2 seconds.
2. **Routing to a node with a smaller `--max-model-len`.** Known open issue (`devshard/docs/known-issues.md` §3): not all hosts are necessarily deployed with the full 240k window, and the gateway cannot yet filter requests by per-host capacity. If you happen to hit a "small" node, the request fails on the vLLM side.

Related: [issue #1229](https://github.com/gonka-ai/gonka/issues/1229) (OPEN, May 2026) explicitly lists "long reasoning, tool-call compatibility, continuation after output limits" as blockers for agentic workflows.

**For Inference User:**

- First, check your payload against the whitelist in `docs/chat-api/README.md`. Most Hermes/OpenClaw HTTP 400s are caused by one field (`tags`, `enforced_tokens`) or a schema inside `tools` / `response_format`. Remove the extra fields and resend the same request. It usually works.
- **Generic broker errors like "upstream model provider rejected" are misleading:** often this means the gateway rejected your request at the validator layer, not the model. Check fields first, then suspect the model.
- If the payload is clean and still fails, try another broker. The current one may be routing to nodes with a reduced context window.

**For Broker:**

- Two operational actions: (1) publish the native context window for each model on the landing page; (2) until host-level capacity advertising is implemented (`known-issues §3`), consider client-side filtering or a "preferred-host" list.
- **UX gap (important):** the gateway returns specific 400s such as `"unknown parameter: tags"`, but many brokers mask them as generic "upstream provider rejected". Pass the upstream message to the client. It saves hours of debugging. Agent compatibility map: `docs/chat-api/agents.md`.

### Why does Kimi generate malformed JSON for tool calls when output exceeds 4k-8k tokens?

**Neither bandwidth nor a Gonka-side limitation.** Three overlapping causes:

**(a) `max_tokens` truncation.** Network cap: `RequestMaxTokensCap = 4,096` (`devshard/cmd/devshardctl/gateway.go:143-144`). When the assistant emits tool calls with large `arguments` JSON blobs plus additional visible content, it can hit the cap and produce truncated JSON. For per-broker overrides and general cap mechanics, see "The input token cap for Kimi is 4k tokens, and the output cap is 8,192 tokens. When will these limits be raised?"

**(b) Upstream vLLM Kimi tool-parser duplicate-ID bug.** The `kimi_k2` parser has a confirmed counter-collision bug when `n > 1`: `history_tool_call_cnt` is recalculated inside the per-choice loop, causing colliding `functions.<name>:<idx>` ids. Upstream PR review: [vLLM PR #21259](https://github.com/vllm-project/vllm/pull/21259). The gateway then rejects duplicate ids (per OpenAI spec) with HTTP 400. See anchor `#reject-duplicate-tool-call-id` in `docs/chat-api/troubleshooting.md`.

**(c) Hermes parser breaks on multiple tool blocks.** Another upstream issue: `JSONDecodeError` when the model emits multiple tool-call blocks in one response: [vLLM #17790](https://github.com/vllm-project/vllm/issues/17790). Related: `<tool_call>` inside a `<think>` block breaks hermes parsing: [vLLM #42021](https://github.com/vllm-project/vllm/issues/42021). These bugs are not Gonka-specific. These bugs require upstream fixes.

**For Inference User:**

- **Rewrite `tool_call.id` on the client side** before sending subsequent messages into the canonical format `functions.<name>:<global_idx>`. This is Moonshot's official recommendation, repeated in `docs/chat-api/troubleshooting.md#reject-duplicate-tool-call-id`. Alternative: fresh UUIDs.
- **Do not deduplicate by id.** Two calls with the same ID can contain different real results. Dropping them means dropping agent work.
- **Raise `max_tokens`** for assistant responses that contain tool calls. Large `arguments` JSON blobs quickly hit the cap.
- **Generic broker error "upstream model provider rejected" usually means a gateway-side reject**, not the model. Check the message and IDs for duplicates first, then suspect the model. Same UX gap as in ["Agents like Hermes and OpenClaw with 30k+ system prompts fail on Kimi. Why?"](https://gonka.ai/docs/FAQ/#agents-like-hermes-and-openclaw-with-30k-system-prompts-fail-on-kimi-why).

**For Broker:**

- **No gateway-side dedup can be done safely** because it can lose real distinct outputs. Document the symptom in your customer FAQ with a link to `troubleshooting.md#reject-duplicate-tool-call-id`.
- **UX:** pass through the specific gateway error message (for example, `"messages[N].tool_calls[M].id is duplicated"`) instead of a generic wrapper. This shortens time-to-fix for agent clients.

### Could enabling guided decoding fix the token cap issue?

**Guided decoding has nothing to do with the token cap.** It is a mechanism that forces the model to generate output according to a given schema (JSON Schema, regex, etc.), but it does not change the total number of tokens the model can return. For the cap, see "The input token cap for Kimi is 4k tokens, and the output cap is 8,192 tokens. When will these limits be raised?"

**Low-level vLLM fields `guided_json`, `guided_regex`, `guided_grammar`, and `guided_choice` are rejected by the gateway with HTTP 400** (anchor `#reject-guided-decoding` in `docs/chat-api/troubleshooting.md`). Reason: they bypass xgrammar bounds, which are applied to the `response_format` / `structured_outputs` envelope to mitigate CVE-2025-48944.

**Correct fields for structured output:**

| Field | Kimi K2.6 | Qwen3-235B | Notes |
|------|-----------|------------|-------|
| `response_format` (`type: "json_schema"` or `"json_object"`) | ✅ | ✅ | OpenAI-standard. Reliable choice. Empirically verified on both models through a public broker. |
| `structured_outputs` envelope (`json`/`regex`/`choice`/`grammar`/`structural_tag`/`json_object`) | ❌ HTTP 400 (per-route reject) | ✅ in code, real availability depends on broker | Validator: `StructuredOutputsValidator` in PR #1215 (merged 2026-05-22). On the Kimi route, it is explicitly rejected because the Moonshot API does not declare the field and it could crash the engine. On Qwen3, it is formally supported, but in my live check through one public broker, even a minimal envelope still returned HTTP 400. The broker may not yet have been updated to a build with PR #1215. Ask your broker. |
| Both together (`response_format` + `structured_outputs`) | ❌ HTTP 400 | ❌ HTTP 400 | vLLM 0.20.0 merges them through `dataclasses.replace()`, which triggers the exactly-one rule in `StructuredOutputsParams.__post_init__`. Anchor: `#reject-structured_outputs-with-response_format`. |

**For Inference User:**

- **Use `response_format: {type: "json_schema", json_schema: {...}}`; it is the reliable cross-route choice.** Works on both models and both routes.
- For regex / choice / grammar / structural_tag, use only the `structured_outputs` envelope, and only on a non-Kimi route. If the broker returns HTTP 400, ask whether it supports this.
- Do not combine `response_format` and `structured_outputs` in one request. It will return HTTP 400.
- Generic broker errors like "upstream model provider rejected" often just mean a validation reject at the gateway level.

**For Broker:**

- Guided decoding does not increase throughput. Do not promise it to clients as a solution to the token cap.
- If you are still on an old gateway without PR [#1215](https://github.com/gonka-ai/gonka/pull/1215), clients will see HTTP 400 on the `structured_outputs` envelope even for Qwen3. Pin to build >= 2026-05-22 (`devshard 0.2.13`) so the envelope route works.

### Why does generation speed fluctuate so drastically? And why does the boost apply only to reasoning tokens?

**Speed fluctuations are a real, known open issue**. The roots are in three different layers:

**1. Per-host slowdowns / stalls (host-level).** Open investigation task: issue [#818 "Slow nodes investigation"](https://github.com/gonka-ai/gonka/issues/818). Specific patterns without a root cause yet: `devshard/docs/known-issues.md` §1 ("Host returns no stream after receipt") and §2 ("Host stalls after producing chunks", in some cases resumes after a minute, in others never resumes).

**2. Routing variance (broker-level).** Two consecutive broker requests can land on different hosts with different loads. Empirically: five simple questions sent one after another through a public broker produced throughput from **8 tok/s to 54 tok/s**, a **6.7x difference** within 30 seconds. Different `devshard-XXXX-YYY` IDs confirm different routing.

**3. Chain-level validation windows (network-level).** During PoC / Confirmation-PoC (cPoC), some nodes are busy with validation and temporarily unavailable for normal inference. In these windows, the gateway can return `attempts: []` (no available hosts on the route), which looks like a timeout from the client side. The effect is more noticeable when the broker serves a model through a small number of nodes.

**"Reasoning faster than visible" is not prioritization, but output structure.** The gateway has no special fast route for reasoning tokens (checked in `devshard/cmd/devshardctl/redundancy.go`: `delta.reasoning`, `delta.content`, `delta.reasoning_content`, and `delta.tool_calls` are all detected the same way through `sseChunkHasContent`). Per-token speed is the same. Kimi with thinking enabled simply generates a large `reasoning_content` first (hundreds to thousands of tokens), then a short visible answer (dozens to hundreds of tokens). If the client does not display the reasoning field, it looks like the model was "silent, then dumped the answer all at once". In reality, the model was generating the whole time; the result was just hidden.

**For Inference User:**

- Choose a broker that publishes uptime / p50 TTFT. For example, [gonka.pw](https://gonka.pw/) tracks all public brokers.
- On a slow request, just retry: the next request usually lands on another node through another devshard.
- If you want to see progress while the model is thinking, render `delta.reasoning_content` (or `delta.reasoning`) in the UI, for example, in a collapsed block.

**For Broker:**

- This is the highest-priority shared issue. Two actionable steps:
  1. Take or comment on issue [#818](https://github.com/gonka-ai/gonka/issues/818).
  2. Help implement the host-side improvements (chunked gossip recovery, per-escrow `lastAfterReq` tracking). They directly address routing/recovery weak spots.

### Why does speed vary depending on hardware, faster on B200, slower on H200?

**Speed depends on hardware by design.** PoC weight on-chain reflects real hardware throughput, and broker routing may land on different GPUs.

**Where the difference comes from (based on public benchmarks in [`kaitakuai/experiments`](https://github.com/kaitakuai/experiments)):**

| GPU | Memory | sm | Qwen3-235B nonces/min per instance | Per-GPU |
|-----|--------|----|------------------------------------:|--------:|
| 4xH100 SXM5 | 80 GB HBM3 | 90 | **1,248** @ batch=16 | ~312 |
| 4xH200 | 141 GB HBM3e | 90 | **1,408** @ batch=32-64 | ~352 |
| 2xB200 | 192 GB HBM3e | 100 | **1,984** @ batch=64 | **~992** |

- **H200 vs H100:** +13% per GPU. Same chip (`sm_90`), but HBM3e + 141 GB vs HBM3 + 80 GB allows smaller TP for large models and faster KV cache.
- **B200/B300 vs H100/H200:** **~3x per GPU** on Qwen, even more on Kimi-K2.6 INT4 (~2,240 nonces/min on 4xB200; see `experiments/2026-05/kimi_k26_int4_4xb200_q-int4-k2`).
- **Blackwell-only env: `VLLM_USE_FLASHINFER_MOE_INT4=1` gives +138% vs Marlin** (A/B proven in `experiments/2026-05/kimi_k26_b300_eager_flashinfer`). Only on `sm_100`.

**Tracing / diagnostics:** there are no per-host TTFT panels in Grafana yet. Open PR [#1046 "Implement dapi & devshard observability"](https://github.com/gonka-ai/gonka/pull/1046) could add OpenTelemetry traces, Prometheus metrics, and dashboards, if merged and approved by Governance.

**For Inference User:** You do not choose hardware directly. You choose a broker, and its routing selects the host. If you need predictable latency, ask your broker which hardware tier they route to most often.

**For Broker:** Once PR #1046 (observability) is merged, there will be per-host TTFT panels in Grafana. Until then, diagnostics sources are the [`kaitakuai/experiments`](https://github.com/kaitakuai/experiments) repo, which is updated regularly, and your own per-host stats from [gonka.pw](https://gonka.pw/). If you want to influence hardware distribution, scale your devshard escrow toward hosts with preferred GPUs.

### Why can't the model use tools properly within Kilo Code?

**Most likely, one of four reasons. The gateway applies a strict parameter allowlist and closed caps on JSON Schema. This is not Kilo-specific. The same reasons affect any coding agent (Cline, Continue.dev, OpenCode, etc.).**

**1. Hard reject (HTTP 400) - must be fixed on the client side:**

| Trigger | Reason | Fix |
|---------|--------|-----|
| `tags` field in payload | Not part of the OpenAI Chat Completions standard; folkloric Hermes convention; anchor `#reject-tags` | Use `metadata` (OpenAI standard) or `user` for tracking |
| Schema depth > 16 in `tools[].function.parameters` | CVE-driven cap | Flatten the schema; PR [#1187](https://github.com/gonka-ai/gonka/pull/1187) raised this from 5 to 16 |
| Schema nodes > 256 (total count) | CVE-driven cap | Reduce schema size; PR #1195 raised this from 128 to 256. NB: some MCP tools with large input schemas, for example `notionAppendBlockChildren` from Notion MCP at ~600+ nodes, are guaranteed to hit the limit |

**2. Silent coerce/strip - the request does not fail, but behavior changes:**

| Trigger | What the gateway does | Notes |
|---------|------------------------|-------|
| `tool_choice: "required"` | Silently coerces to `"auto"` (network policy) | Anchor `#coerce-tool-choice-required`. In most obvious tool-relevant prompts, the model still makes a tool_call, but there is no "required" guarantee |
| `tools[].function.strict: true` | Silently strips the field | vLLM parsers (`hermes`, `kimi_k2`) ignore this flag. PR [#1193](https://github.com/gonka-ai/gonka/pull/1193) |

Compatibility matrix for known clients: [`docs/chat-api/agents.md`](https://github.com/gonka-ai/gonka/blob/main/docs/chat-api/agents.md). Basic working tool-calling example: [Developer Quickstart §1.4](https://gonka.ai/developer/quickstart/#4-tool-calling).

**For Inference User:**

- **Reproduce with the same curl that Kilo Code generates** (through the client debug log or an intermediate proxy). In the body of the 400, the gateway usually names the rejected field. The broker may mask the message as generic "upstream rejected", but the specific problematic field is usually just one field.
- **Compare against the lists in `agents.md` and `troubleshooting.md`**. Most 400s fall into one of the documented reject anchors (`#reject-tags`, `#reject-enforced_tokens`, `#reject-structured_outputs-kimi`, etc.).
- **If the rejected field is not documented**, open an issue in [gonka-ai/gonka](https://github.com/gonka-ai/gonka) with the captured request. This is useful feedback.

**For Broker:**

- This pattern appears across many customers. Keep `agents.md` clearly linked from your dashboard.
- If you see a new client serializing a non-standard field, open an issue or PR yourself. This improves the ecosystem for all brokers.

### Agents like Hermes and OpenClaw fail to complete tool tasks on Kimi. Why?

**A combination of three factors**. 

1. **Kimi thinking consumes budget** (see "[Why does the 4,096 output token limit cause the model to stall during thinking, returning zero tokens?](https://gonka.ai/docs/FAQ/#why-does-the-4096-output-token-limit-cause-the-model-to-stall-entirely-during-thinking-returning-zero-tokens-even-on-moderately-sized-requests)"/"[With Kimi K2, the entire token limit can be spent on thinking with no actual output. Is this an output cap, bandwidth, or upstream issue?](https://gonka.ai/docs/FAQ/#with-kimi-k2-the-entire-token-limit-can-be-spent-on-thinking-with-no-actual-output-is-this-an-output-cap-bandwidth-or-upstream-issue)"). With default settings, half of `max_tokens` goes into `<think>` before the model starts emitting a tool_call. For tool-heavy agentic flows, this often means the budget ends before useful output.
2. **The 4,096 output cap is tight for tool-heavy outputs** (see "[The input token cap for Kimi is 4k tokens, and the output cap is 8,192 tokens. When will these limits be raised?](https://gonka.ai/docs/FAQ/#the-input-token-cap-for-kimi-is-4k-tokens-and-the-output-cap-is-8192-tokens-when-will-these-limits-be-raised)"). Large `arguments` JSON blobs plus additional visible content can easily hit the ceiling.
3. **Upstream vLLM tool-parser bugs** (see ["Why does Kimi generate malformed JSON for tool calls when output exceeds 4k-8k tokens?"](https://gonka.ai/docs/FAQ/#why-does-kimi-generate-malformed-json-for-tool-calls-when-output-exceeds-4k-8k-tokens)): duplicate `tool_calls[].id` collisions when `n>1` ([vLLM PR #21259](https://github.com/vllm-project/vllm/pull/21259)) and hermes parser `JSONDecodeError` on multiple tool blocks ([vLLM #17790](https://github.com/vllm-project/vllm/issues/17790)).

Builder pain point linked to the same problem: [issue #1229](https://github.com/gonka-ai/gonka/issues/1229), "Agentic coding workflows stress the gateway layer much more heavily: long reasoning; tool-call compatibility; continuation after output limits".

**For Inference User:**

- **For Kimi, always use: `"thinking": {"type": "disabled"}` + `"max_tokens": 4096`** (or explicit `thinking_token_budget: 0`; see "[With Kimi K2, the entire token limit can be spent on thinking with no actual output. Is this an output cap, bandwidth, or upstream issue?](https://gonka.ai/docs/FAQ/#with-kimi-k2-the-entire-token-limit-can-be-spent-on-thinking-with-no-actual-output-is-this-an-output-cap-bandwidth-or-upstream-issue)" for belt and suspenders). This frees the whole cap for tool-heavy output. Empirically, with this combination, Kimi can easily emit 5 parallel tool_calls in a single response in ~4 seconds.
- **If you control `tool_call.id` on the client side**, rewrite it into the canonical format `functions.<name>:<global_idx>` (see ["Why does Kimi generate malformed JSON for tool calls when output exceeds 4k-8k tokens?"](https://gonka.ai/docs/FAQ/#why-does-kimi-generate-malformed-json-for-tool-calls-when-output-exceeds-4k-8k-tokens)) to avoid gateway duplicate-id rejects.
- **If you control the schema**, keep depth <= 16 and nodes <= 256 (see ["Why can't the model use tools properly within Kilo Code?"](https://gonka.ai/docs/FAQ/#why-cant-the-model-use-tools-properly-within-kilo-code)). MCP tools with large input schemas may not pass.

**For Broker:**

- Combine cap bump ("[The input token cap for Kimi is 4k tokens, and the output cap is 8,192 tokens. When will these limits be raised?](https://gonka.ai/docs/FAQ/#the-input-token-cap-for-kimi-is-4k-tokens-and-the-output-cap-is-8192-tokens-when-will-these-limits-be-raised)": per-model `request_max_tokens_cap` through `/v1/admin/settings`) with the recommendations above. This covers the main class of agent failures on your gateway.

### OpenCode cannot apply requested code changes (cuts off mid-sentence). What is causing this?

**Three causes. The client can work around two of them; one cannot be worked around client-side:**

1. **`max_tokens` truncation on large diffs.** Large code patches may not fit into the 4,096 cap (see "[The input token cap for Kimi is 4k tokens, and the output cap is 8,192 tokens. When will these limits be raised?](https://gonka.ai/docs/FAQ/#the-input-token-cap-for-kimi-is-4k-tokens-and-the-output-cap-is-8192-tokens-when-will-these-limits-be-raised)"). Workaround: split the diff into multiple tool calls. The model is more likely to fit into budget for each separate call.
2. **vLLM crashes on edge-case params.** A series of 8 merged PRs ([#1170](https://github.com/gonka-ai/gonka/pull/1170), [#1171](https://github.com/gonka-ai/gonka/pull/1171), [#1172](https://github.com/gonka-ai/gonka/pull/1172), [#1174](https://github.com/gonka-ai/gonka/pull/1174), [#1180](https://github.com/gonka-ai/gonka/pull/1180), [#1212](https://github.com/gonka-ai/gonka/pull/1212), [#1215](https://github.com/gonka-ai/gonka/pull/1215), [#1216](https://github.com/gonka-ai/gonka/pull/1216)) added hardening against fields that crashed the engine. On a fresh gateway (>= devshard 0.2.13), most known crash scenarios are now caught by validators and return 400 instead of crashing.
3. **Host stream drops after receipt** (open issue: `devshard/docs/known-issues.md` §1). The host accepted the request, but does not return chunks. This is a network-level issue with no client workaround other than retrying.

**For Inference User:**

- **For Kimi:** `"thinking": {"type": "disabled"}` + `"max_tokens": 4096`. For large diffs, split into multiple tool calls.
- **Long-term:** see "[The input token cap for Kimi is 4k tokens, and the output cap is 8,192 tokens. When will these limits be raised?](https://gonka.ai/docs/FAQ/#the-input-token-cap-for-kimi-is-4k-tokens-and-the-output-cap-is-8192-tokens-when-will-these-limits-be-raised)" on broker caps and ["Why does Kimi generate malformed JSON for tool calls when output exceeds 4k-8k tokens?"](https://gonka.ai/docs/FAQ/#why-does-kimi-generate-malformed-json-for-tool-calls-when-output-exceeds-4k-8k-tokens) on canonical tool-call id format.

**For Broker:** document the "split big diffs" pattern in your customer FAQ for coding-agent clients.

### Is there a model that handles both input and output without trade-offs?

**MiniMax-M2.7** is the on-roadmap model that should close both gaps (large input + tool-friendly output). Progress:

- **Draft PR [#1226](https://github.com/gonka-ai/gonka/pull/1226)**: per-model dispatch + tool-message shape + reasoning_split (4,219 / -730 LOC, May 2026). Currently DRAFT.
- **PR #1163 Weight Scaling** is already merged (2026-05-13): on-chain scaling factor for MiniMax is already prepared (it will bring it to Kimi's level).
- **Draft PR [#1148] Multi-model scheduling GIP**: general infrastructure.

**Model facts (verified):**

| Model | Native context | Mainnet deployed | Native thinking | Available on mainnet today |
|-------|----------------|------------------|-----------------|-----------------------------|
| Kimi-K2.6 | 256K | 240K | yes | ✅ |
| Qwen3-235B-A22B-Instruct-2507-FP8 | 128K | 240K | no (Instruct variant) | ✅ |
| MiniMax-M2.7 | planned | planned | yes (split parser) | ❌ (draft PR) |

**For Inference User:** Follow [#1226](https://github.com/gonka-ai/gonka/pull/1226). When a broker rolls out MiniMax, you will see it in the `/v1/models` response. Until then, choose by workload: Kimi for reasoning + tools, Qwen3 for large context + structured outputs.

**For Broker:** Prepare your gateway for MiniMax in advance and comment on [#1226](https://github.com/gonka-ai/gonka/pull/1226) with your deploy feedback. The chain registration now uses `--enable-auto-tool-choice --max-model-len 180000 --tool-call-parser minimax_m2 --reasoning-parser minimax_m2_append_think`.

### Why is there no working web search available?

**By design, Gonka is an inference network**, not an agent framework. Plugin/web execution belongs in the client agent layer or in broker value-add services, not in the inference path.

**Specifically:** if you send `plugins: [...]` in a request (OpenRouter convention), the gateway silently removes it (`docs/chat-api/troubleshooting.md#strip-plugins`). vLLM has no plugin execution path, and silently passing this field through would imply a backend capability that does not exist.

**For Inference User:** Run search in your agent layer (LangChain, LlamaIndex, your own wrapper), then inject results into `messages[].content` before calling `/v1/chat/completions`. This is the standard pattern for all OpenAI-compatible endpoints.

**For Broker:** This is an opportunity for differentiation. Broker-level value-add ("we perform search and inject results into messages") is a legitimate product. Implement it fully above Gonka, without protocol changes. If you want to propose it as a standard, open an ecosystem Discussion in [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/discussions).

### When will reliable web fetching be supported?

**By design, it is not on [the Gonka roadmap](https://github.com/gonka-ai/gonka/discussions/1185).** The right place is a sidecar or value-add at the broker layer.

**For Inference User:** Build or buy a fetch service, normalize into text, and send through an OpenAI-compatible call. There are enough off-the-shelf solutions.

**For Broker:** If you want to offer this as a tier, open an ecosystem Discussion in [`gonka-ai/gonka`](https://github.com/gonka-ai/gonka/discussions), so the community can converge on common conventions, for example, a sidecar that everyone deploys consistently.

### Context7 docs research: summary fails. Is this the output token limit?

**Yes, this is the same blocker as in "[The input token cap for Kimi is 4k tokens, and the output cap is 8,192 tokens. When will these limits be raised?](https://gonka.ai/docs/FAQ/#the-input-token-cap-for-kimi-is-4k-tokens-and-the-output-cap-is-8192-tokens-when-will-these-limits-be-raised)".** The 4,096 output cap is tight for "tool result body + full summary in one response". If thinking is enabled, half goes there too (see "[Why does the 4,096 output token limit cause the model to stall during thinking, returning zero tokens?](https://gonka.ai/docs/FAQ/#why-does-the-4096-output-token-limit-cause-the-model-to-stall-entirely-during-thinking-returning-zero-tokens-even-on-moderately-sized-requests)"/"[With Kimi K2, the entire token limit can be spent on thinking with no actual output. Is this an output cap, bandwidth, or upstream issue?](https://gonka.ai/docs/FAQ/#with-kimi-k2-the-entire-token-limit-can-be-spent-on-thinking-with-no-actual-output-is-this-an-output-cap-bandwidth-or-upstream-issue)").

**Workaround today:**

- **Kimi:** `"thinking": {"type": "disabled"}` + `"max_tokens": 4096` + `response_format` with an explicit summary schema. This compresses output into the required shape and guarantees a structured summary within budget.
- **If the summary is genuinely long:** split into N+1 calls: 1 for fetch + plan, N for section drafts. Stitch results together on the client side.

**For Broker:** Encourage clients to use `response_format`. This is the simplest mitigation until cap bump (Q3) is implemented. Consider a per-customer cap-bump option (more expensive) once per-model `request_max_tokens_cap` is part of your admin configuration.

### Gonka has no KV cache. When will caching be added?

**vLLM prefix KV cache works on each ML node.** Gateway-level `prompt_cache_key` / `cache_key` are currently silently stripped. This is a **temporary** limitation blocked by an unmerged upstream vLLM PR.

**Current state:**

- **Gateway behavior:** `prompt_cache_key` (OpenAI standard) and `cache_key` (Moonshot Kimi convention) are silently stripped. Neither reaches vLLM. Anchors: `docs/chat-api/troubleshooting.md#strip-prompt_cache_key` and `#strip-cache_key`.
- **Upstream blocker:** vLLM uses the `cache_salt` field for prompt-cache isolation (RFC #16016, PR #17045). Aliasing `prompt_cache_key` to `cache_salt` is an open issue [vLLM #33264](https://github.com/vllm-project/vllm/issues/33264), open since January 2026, with no merged PR.
- **Security rationale:** simply forwarding `cache_key` without isolation would be unsafe. There are [published prompt-cache timing side-channel attacks (arxiv 2502.07776 PROMPTPEEK)](https://arxiv.org/abs/2502.07776). The gateway cannot implement false cache-isolation guarantees.
- **80-90% hit rate is not a Gonka claim.** It is either a misinterpretation of someone's marketing material or confusion with OpenAI/Anthropic native cache, which guarantees sticky routing inside a single provider.

**Important architectural caveat:** even when vLLM #33264 is merged and the gateway adds a hash to `cache_salt` bridge, the cache remains **per-vLLM-instance**. Gonka multi-host routing means two requests with the same `cache_key` can land on different hosts with different prefix caches. Without sticky routing, which does not currently exist, guaranteeing an OpenAI-style ~80% hit rate is architecturally hard.

**For Inference User:** Today there is nothing to do. `prompt_cache_key` and `cache_key` are no-ops. Do not rely on these fields for cost optimization.

**For Broker:** No gateway-side change is needed until vLLM #33264 is merged. If you want to accelerate this, comment on or contribute to that upstream issue. After merge, the Gonka gateway will add a bridge exposing both fields together.

### When will image input be enabled for Kimi on the Gonka gateway?

This is an active area of work, but there is no committed timeline yet.

**Hard blockers today:**

1. **Multimodal-specific special-token sanitizer** (CVE-2026-44222). The Kimi-K2.6 chat template accepts `image_url` / `video_url` content parts, but the gateway currently validates only text. Multimodal payloads have an additional attack surface for special-token injection (through alt text, image URLs, metadata, and anything that reaches the tokenizer). Documented in `docs/chat-api/kimi-k2.6.md:21`. PR #1184 covers the text case (postponed as not critical there), but a separate multimodal sanitizer is still needed.
2. **Independent VLM validation review.** Validation methodology for image inputs needs independent confirmation. Issue [#1026](https://github.com/gonka-ai/gonka/issues/1026) (initial research: Qwen2-VL-2B F1=100% intermediate) + [#1198](https://github.com/gonka-ai/gonka/issues/1198) (re-validate, up-for-grabs).

**Public ballpark:** v0.2.14+  

**What is empirically confirmed today:** a request with a `messages[0].content` array containing `{type:"image_url"}` returns HTTP 400 on both routes (Kimi and Qwen3). Multimodal inputs are not accepted at the gateway level.

**For Inference User:** Not available today.

**For Broker:** Three ways to accelerate this:
1. Take issue [#1198](https://github.com/gonka-ai/gonka/issues/1198) (up-for-grabs). 
2. Review PR [#1150 "vlm benchmark"](https://github.com/gonka-ai/gonka/pull/1150).
3. When Phase 1-3 of the plan become feasible, prepare your gateway capability registry (Phase 3). Operator config will determine which content types your broker accepts.
