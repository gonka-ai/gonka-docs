# FAQ

## What is Gonka?
Gonka is a decentralized network for high‑efficiency AI compute — run by those who run it. It functions as a cost-effective and efficient alternative to centralized cloud services for AI model training and inference. As a protocol, it's not a company or a start-up.
    
## What is the GNK coin?
GNK is the native coin of the Gonka network. It is used to incentivize participants, price resources, and ensure the sustainable growth of the network.
    
## What makes the protocol efficient?
Our difference from the "big players" is the pricing and the fact that, despite the size of the user, the inference is being distributed equally. To learn more, please review the [Whitepaper](https://gonka.ai/whitepaper.pdf).
    
## How does the network operate?
The network's operation is collaborative and depends on the role you wish to take:

- As a [Developer](https://gonka.ai/developer/quickstart/): You can use the network's computational resources to build and deploy your AI applications.
- As a [Host](https://gonka.ai/host/quickstart/): You can contribute your computational resources to power the network. The protocol is designed to reward you for your contribution, ensuring the network's continuity and sovereignty.
    
## Where can I find information on key management?
You can find a dedicated section on [Key Management](https://gonka.ai/host/key-management/) in the documentation. It outlines the procedures and best practices for securely managing your application's keys on the network.
    
## What is the incentive for contributing computational resources?
We've created a dedicated document focused on [Tokenomics](https://gonka.ai/tokenomics.pdf), where you can find all the information about how the incentive in being measured.
    
## What are the hardware requirements?
You can find the minimum and recommended [hardware specifications](https://gonka.ai/host/hardware-specifications/) clearly outlined in the documentation. You should review this section to ensure your hardware meets the requirements for effective contribution.

## What if I want to stop mining but still use my account when I come back?
To restore a Network Node in the future, it will be sufficient to back up:

- cold key (most important, everything else can be rotated)
- secres from tmkms: `.tmkms/secrets/`
- keyring from `.inference .inference/keyring-file/`
- node key from `.inference/config .inference/config/node_key.json`
- password for warm key `KEYRING_PASSWORD`

## What types of changes require a Governance Proposal?
Governance Proposals are required for any on-chain changes that affect the network, for example:

- Updating module parameters (`MsgUpdateParams`)
- Executing software upgrades
- Adding, updating, or deprecating inference models
- Any other actions that must be approved and executed via the governance module

## Who can create a Governance Proposal?
Anyone with a valid governance key (cold account) can pay the required fee and create a Governance Proposal. However, each proposal must still be approved by active participants through PoC-weighted voting. Proposers are encouraged to discuss significant changes off-chain first (for example, via [GitHub](https://github.com/gonka-ai) or [community forums](https://discord.com/invite/kFFVWtNYjs)) to increase the likelihood of approval. See [the full guide](https://gonka.ai/transactions-and-governance/).
  
## What’s the difference between Governance Proposals and Improvement Proposals?
Governance Proposals → on-chain proposals. Used for changes that directly affect the network and require on-chain voting. Examples:

- Updating network parameters (`MsgUpdateParams`)
- Executing software upgrades
- Adding new models or capabilities
- Any modification that needs to be executed by the governance module

Improvement Proposals → off-chain proposals under the control of active participants. Used for shaping the long-term roadmap, discussing new ideas, and coordinating larger strategic changes.

- Managed as Markdown files in the [/proposals](https://github.com/gonka-ai/gonka/tree/main/proposals) directory
- Reviewed and discussed through GitHub Pull Request
- Approved proposals are merged into the repository

## How are Improvement Proposals reviewed and approved?
- Create a Markdown proposal in the [/proposals](https://github.com/gonka-ai/gonka/tree/main/proposals) folder.
- Open a Pull Request with your proposal.
- Community review:
        - Active contributors and maintainers discuss the proposal in the PR thread.
        - Feedback, suggestions, and refinements are discussed openly.
- Approval and merge:
        - If the community agrees, the PR is merged.
        - Approved proposals become part of the official community roadmap.

## Can an Improvement Proposal lead to a Governance Proposal?
Yes. Often, an Improvement Proposal is used to explore ideas and gather consensus before drafting a Governance Proposal. For example:

- You might first propose a new model integration as an Improvement Proposal.
- After the community agrees, an on-chain Governance Proposal is created to update parameters or trigger the software upgrade.

## How does the voting process work?
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

## How can I track the status of a Governance Proposal?
You can query the proposal status at any time using the CLI:
```
export NODE_URL=http://47.236.19.22:18000
./inferenced query gov tally 2 -o json --node $NODE_URL/chain-rpc/
```

## What happens if a proposal fails?
- If a proposal does not meet quorum → it automatically fails
- If the majority votes `no` → proposal rejected, no on-chain changes
- If a significant percentage votes `no_with_veto` (above veto threshold) → proposal is rejected and flagged, signaling strong community disagreement
- Deposits may or may not be refunded, depending on chain settings

## How is governance power calculated in Gonka?
Gonka uses a PoC-weighted voting model:

- Proof-of-Compute (PoC): Voting power is proportional to your verified compute contribution.
- Collateral commitment:
    - 20% of PoC-derived voting weight is activated automatically.
    - To unlock the remaining 80%, you must lock GNK coins as collateral.
- This ensures that governance influence reflects real compute work + economic collateral.

For the first 180 epochs (approximately 6 months), new participants can participate in governance and earn voting weight through PoC alone, without collateral requirements. During this period, the full governance rights are available, while voting weight remains tied to verified compute activity.

## Why does Gonka require locking GNK coins for governance power?
Voting power is never derived solely from holding coins. GNK coins serve as economic collateral, not as a source of influence. Influence is earned through continuous computational contribution, while locking GNK collateral is required to secure participation in governance and enforce accountability.

## Can governance parameters themselves be changed?
Yes. All key governance rules — quorum, majority threshold, and veto threshold — are on-chain configurable and can be updated via Governance Proposals. This allows the network to evolve decision-making rules as participation patterns and compute economic changes.

## My node was jailed. What does it mean?
If the validator hasn't participated in signing blocks for 50 blocks in a row, it becomes jailed for a short period of time (about 15 min). It doesn't prevent getting the reward for inference if there were no issues with that detected. So, the reward is not lost. After a short period (15 min currently), nodes can be unjailed. You should use the cold key to set unjail transactions:
```
export NODE_URL=http://47.236.19.22:18000
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

## How to simulate Proof-of-Compute (PoC)?
At the start of the PoC phase, `ap`i container sends POST `/v1/pow/init/generate request` [https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32)

The next model params are used for PoC: [https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41)

There is a request to start PoC with `curl`:
```
curl -X POST "${PORT:-8080}:8080"/api/v1/pow/init/generate" \
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
The value of `DAPI_API__POC_CALLBACK_URL` is used for the field `url`. Use a real one to test the network setup.

Send this request to `8080` port of MLNode's proxy container or directly to MLNode's `8080` [https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/deploy/join/docker-compose.mlnode.yml#L26](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/deploy/join/docker-compose.mlnode.yml#L26)

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
Then the service will start sending generated nonces to `DAPI_API__POC_CALLBACK_URL`
```
2025-08-25 20:54:58,822 - pow.service.sender - INFO - Sending generated batch to http://api:9100/
```
For this test, the MLNode should **not** be registered as an active participant in the API node. 

If your node is not active yet, you can achieve the correct behavior by temporarily pausing the API container before running the test, and unpausing it afterward.

1) Pause the API container:
```
docker pause api
```
2) Run the test.

3) Unpause the API container:
```
docker unpause api
```
