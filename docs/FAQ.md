# FAQ

## Basic

### What is Gonka?
Gonka is a decentralized network for high‑efficiency AI compute — run by those who run it. It functions as a cost-effective and efficient alternative to centralized cloud services for AI model training and inference. As a protocol, it's not a company or a start-up.
    
### What is the GNK coin?
GNK is the native coin of the Gonka network. It is used to incentivize participants, price resources, and ensure the sustainable growth of the network.
    
### What makes the protocol efficient?
Our difference from the "big players" is the pricing and the fact that, despite the size of the user, the inference is being distributed equally. To learn more, please review the [Whitepaper](https://gonka.ai/whitepaper.pdf).
    
### How does the network operate?
The network's operation is collaborative and depends on the role you wish to take:

- As a [Developer](https://gonka.ai/developer/quickstart/): You can use the network's computational resources to build and deploy your AI applications.
- As a [Host](https://gonka.ai/host/quickstart/): You can contribute your computational resources to power the network. The protocol is designed to reward you for your contribution, ensuring the network's continuity and sovereignty.
    
### Where can I find information on key management?
You can find a dedicated section on [Key Management](https://gonka.ai/host/key-management/) in the documentation. It outlines the procedures and best practices for securely managing your application's keys on the network.
    
### What is the incentive for contributing computational resources?
We've created a dedicated document focused on [Tokenomics](https://gonka.ai/tokenomics.pdf), where you can find all the information about how the incentive in being measured.
    
### What are the hardware requirements?
You can find the minimum and recommended [hardware specifications](https://gonka.ai/host/hardware-specifications/) clearly outlined in the documentation. You should review this section to ensure your hardware meets the requirements for effective contribution.

### What if I want to stop mining but still use my account when I come back?
To restore a Network Node in the future, it will be sufficient to back up:

- cold key (most important, everything else can be rotated)
- secres from tmkms: `.tmkms/secrets/`
- keyring from `.inference .inference/keyring-file/`
- node key from `.inference/config .inference/config/node_key.json`
- password for warm key `KEYRING_PASSWORD`

## Governance

### What types of changes require a Governance Proposal?
Governance Proposals are required for any on-chain changes that affect the network, for example:

- Updating module parameters (`MsgUpdateParams`)
- Executing software upgrades
- Adding, updating, or deprecating inference models
- Any other actions that must be approved and executed via the governance module

### Who can create a Governance Proposal?
Anyone with a valid governance key (cold account) can pay the required fee and create a Governance Proposal. However, each proposal must still be approved by active participants through PoC-weighted voting. Proposers are encouraged to discuss significant changes off-chain first (for example, via [GitHub](https://github.com/gonka-ai) or [community forums](https://discord.com/invite/kFFVWtNYjs)) to increase the likelihood of approval. See [the full guide](https://gonka.ai/transactions-and-governance/).
  
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
- Create a Markdown proposal in the [/proposals](https://github.com/gonka-ai/gonka/tree/main/proposals) folder.
- Open a Pull Request with your proposal.
- Community review:
        - Active contributors and maintainers discuss the proposal in the PR thread.
        - Feedback, suggestions, and refinements are discussed openly.
- Approval and merge:
        - If the community agrees, the PR is merged.
        - Approved proposals become part of the official community roadmap.

### Can an Improvement Proposal lead to a Governance Proposal?
Yes. Often, an Improvement Proposal is used to explore ideas and gather consensus before drafting a Governance Proposal. For example:

- You might first propose a new model integration as an Improvement Proposal.
- After the community agrees, an on-chain Governance Proposal is created to update parameters or trigger the software upgrade.

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

### What happens if a proposal fails?
- If a proposal does not meet quorum → it automatically fails
- If the majority votes `no` → proposal rejected, no on-chain changes
- If a significant percentage votes `no_with_veto` (above veto threshold) → proposal is rejected and flagged, signaling strong community disagreement
- Deposits may or may not be refunded, depending on chain settings

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

### Can governance parameters themselves be changed?
Yes. All key governance rules — quorum, majority threshold, and veto threshold — are on-chain configurable and can be updated via Governance Proposals. This allows the network to evolve decision-making rules as participation patterns and compute economic changes.

## Hosts FAQ

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

### How to simulate Proof-of-Compute (PoC)?

You may want to simulate PoC on a MLNode yourself to make sure that everything will work when the PoC phase begins on the chain.

To run this test you either need to have a running  MLNode that isn't yet registered with the api node or pause the api node. To pause the api node use `docker pause api`. Once you’re finished with the test you can unpause: `docker unpause api`.

For the test itself you will be sending POST `/v1/pow/init/generate` request to mlnode, the same that api node sends at the start of the POC phase:
[https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/service/routes.py#L32)

The following model params are used for PoC: [https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41](https://github.com/gonka-ai/gonka/blob/312044d28c7170d7f08bf88e41427396f3b95817/mlnode/packages/pow/src/pow/models/utils.py#L41)

Here’s how you can send this  request with `curl`:

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
Then the service will start sending generated nonces to `DAPI_API__POC_CALLBACK_URL`.
```
2025-08-25 20:54:58,822 - pow.service.sender - INFO - Sending generated batch to http://api:9100/
```
The http://api:9100 url won’t be available if you paused the api container or if MLNode container and api containers don’t share the same docker network. Expect to see error messages saying that the MLNode failed to send generated batches. The important part is to make sure that the generation process is happening.

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

### How to decommission an old cluster?

Follow this guide to safely shut down an old cluster without impacting reputation.

1) Use the following command to disable each MLNode:

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

```
- .dapi/api-config.yaml
- .dapi/gonka.db (created after on-chain upgrade)
- .inference/config/
- .inference/keyring-file/
- .tmkms/
```

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
http://47.236.26.199:8000
http://47.236.19.22:18000
http://gonka.spv.re:8000
```
2. `SEED_NODE_RPC_URL` - the RPC endpoint of the same seed node. Use the same host as in `SEED_API_URL`, but always port 26657.
```
export SEED_NODE_RPC_URL=http://<host>:26657
```
Example
```
SEED_NODE_RPC_URL=http://node2.gonka.ai:26657
```
3. `SEED_NODE_P2P_URL` - the P2P address used for networking between nodes.
You must obtain the P2P port from the seed node’s status endpoint.

Query the node:
```
http://<host>:<http_port>/chain-rpc/status
```
Example
```
http://node3.gonka.ai:8000/chain-rpc/status
```
Find `listen_addr` in the response, for example:
```
""listen_addr"": ""tcp://0.0.0.0:5000""
```

Use that port:
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
export SEED_NODE_RPC_URL=http://node2.gonka.ai:26657
export SEED_NODE_P2P_URL=tcp://node2.gonka.ai:5000"
```
