# FAQ

## Overview

### What is Gonka?
Gonka is a decentralized network for high‑efficiency AI compute — run by those who run it. It functions as a cost-effective and efficient alternative to centralized cloud services for AI model training and inference. As a protocol, it's not a company or a start-up.
    
### What is the GNK coin?
GNK is the native coin of the Gonka network. It is used to incentivize participants, price resources, and ensure the sustainable growth of the network.

### Can I buy GNK coin?
No, you cannot buy GNK coin on exchanges right now because the coin has not been listed yet.
However, there are two ways to obtain GNK before listing:

- Mine as a Host — GNK coins can already be minted by contributing computational resources to the network.
- Participate in the [bounty program](https://discord.com/invite/RADwCT2U6R) — certain tasks, contributions, or community activities may grant GNK rewards.
    
### What makes the protocol efficient?
Our difference from the "big players" is the pricing and the fact that, despite the size of the user, the inference is being distributed equally. To learn more, please review the [Whitepaper](https://gonka.ai/whitepaper.pdf).
    
### How does the network operate?
The network's operation is collaborative and depends on the role you wish to take:

- As a [Developer](https://gonka.ai/developer/quickstart/): You can use the network's computational resources to build and deploy your AI applications.
- As a [Host](https://gonka.ai/host/quickstart/): You can contribute your computational resources to power the network. The protocol is designed to reward you for your contribution, ensuring the network's continuity and sovereignty.

### What is the incentive for contributing computational resources?
We've created a dedicated document focused on [Tokenomics](https://gonka.ai/tokenomics.pdf), where you can find all the information about how the incentive in being measured.
    
### What are the hardware requirements?
You can find the minimum and recommended [hardware specifications](https://gonka.ai/host/hardware-specifications/) clearly outlined in the documentation. You should review this section to ensure your hardware meets the requirements for effective contribution.

## What wallets can I use to store GNK coins?
You can store GNK coin in several supported wallets within the Cosmos ecosystem:

- Keplr
- Leap Wallet
- `inferenced` CLI - a command-line utility for local account management and network operations in Gonka.

## Where can I find useful information about Gonka?

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

## Governance

### What types of changes require a Governance Proposal?
Governance Proposals are required for any on-chain changes that affect the network, for example:

- Updating module parameters (`MsgUpdateParams`)
- Executing software upgrades
- Adding, updating, or deprecating inference models
- Any other actions that must be approved and executed via the governance module

### Who can create a Governance Proposal?
Anyone with a valid governance key (cold account) can pay the required fee and create a Governance Proposal. However, each proposal must still be approved by active participants through PoC-weighted voting. Proposers are encouraged to discuss significant changes off-chain first (for example, via [GitHub](https://github.com/gonka-ai) or [community forums](https://discord.com/invite/RADwCT2U6R)) to increase the likelihood of approval. See [the full guide](https://gonka.ai/transactions-and-governance/).

### What happens if a proposal fails?
- If a proposal does not meet quorum → it automatically fails
- If the majority votes `no` → proposal rejected, no on-chain changes
- If a significant percentage votes `no_with_veto` (above veto threshold) → proposal is rejected and flagged, signaling strong community disagreement
- Deposits may or may not be refunded, depending on chain settings

### Can governance parameters themselves be changed?
Yes. All key governance rules — quorum, majority threshold, and veto threshold — are on-chain configurable and can be updated via Governance Proposals. This allows the network to evolve decision-making rules as participation patterns and compute economic changes.

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
    https://node4.gonka.ai
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
    export SEED_NODE_RPC_URL=http://node2.gonka.ai:26657
    export SEED_NODE_P2P_URL=tcp://node2.gonka.ai:5000"
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

## Keys & security
    
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

## Updates & maintenance

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

### How can I pre-download the binaries to avoid GitHub during the upgrade?
(Applicable only if the v0.2.5 Upgrade Proposal is approved.)

Here is an optional instruction on how the binaries can be pre-downloaded in advance to avoid relying on GitHub during the upgrade. This step is only relevant if the v0.2.5 Upgrade Proposal is approved.

```
# 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.5/bin \
              .inference/cosmovisor/upgrades/v0.2.5/bin && \

# 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.5/decentralized-api-amd64.zip" && \
echo "6fd12cd92e8226866be76a5e63a57e1b0041c7679db047af75e764e98668cb91 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.5/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.5/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

# 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.5/inferenced-amd64.zip" && \
echo "fab7be9bcdb4e21f058e6d19cfd698b6862bf6f5a8aeecbf9165907fc7edcc64 inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.5/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.5/bin/inferenced && \
echo "Inference Installed and Verified" && \

# 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.5/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.5/bin/inferenced && \
echo "8c6898e99acb3b1acb4e196398003453ea50f82d92ce4e2ebcec99a795f8d735 .dapi/cosmovisor/upgrades/v0.2.5/bin/decentralized-api" | sudo sha256sum --check && \
echo "9187b69322ba73f745c8ed2fbad713a39ce0e39ed15f7a48dacf9356693ed1a0 .inference/cosmovisor/upgrades/v0.2.5/bin/inferenced" | sudo sha256sum --check
```
The binaries are considered successfully downloaded and installed only if all commands complete without errors and the confirmation message is displayed.
```
Inference Installed and Verified
--- Final Verification ---
-rwxr-xr-x 1 root root 216176168 Jan  1  2000 .dapi/cosmovisor/upgrades/v0.2.5/bin/decentralized-api
-rwxr-xr-x 1 root root 212197496 Jan  1  2000 .inference/cosmovisor/upgrades/v0.2.5/bin/inferenced
.dapi/cosmovisor/upgrades/v0.2.5/bin/decentralized-api: OK
.inference/cosmovisor/upgrades/v0.2.5/bin/inferenced: OK
```

## Performance & troubleshooting

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
        sudo rm -rf .inference/data/ .inference/.node_initialized sudo mkdir -p .inference/data/
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
        inferenced snapshots restore <INSERRT_HEIGHT> 3  --home .inference/temp
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

### Automatic `ClaimReward` didn’t go through, what should I do?

An issue was found which can lead to failure of automatic `ClaimReward` transactions.
The `TxManager` max gas was set too low (gas is free for now but it's still estimated)

The fix:
[https://github.com/gonka-ai/gonka/commit/0ac84b0b4d3f89e3c67c33e22aff3d9800c5c988](https://github.com/gonka-ai/gonka/commit/0ac84b0b4d3f89e3c67c33e22aff3d9800c5c988)

[https://github.com/gonka-ai/gonka/tree/release/v0.2.5-post7](https://github.com/gonka-ai/gonka/tree/release/v0.2.5-post7)

1) Download new binary:
    ```
    sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.5-post7/bin && \
    wget -q -O decentralized-api.zip "https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.5-post7/decentralized-api-amd64.zip" && \
    sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.5-post7/bin/ && \
    sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.5-post7/bin/decentralized-api && \
    sudo rm -f .dapi/data/upgrade-info.json && \
    sudo rm -rf .dapi/cosmovisor/current && \
    sudo ln -sfT upgrades/v0.2.5-post7 .dapi/cosmovisor/current && \
    test "$(readlink .dapi/cosmovisor/current)" = "upgrades/v0.2.5-post7" \
      && echo "Symlink OK: points to upgrades/v0.2.5-post7" \
      || echo "Symlink FAILED: does not point to upgrades/v0.2.5-post7" && \
    test "$(sha256sum .dapi/cosmovisor/upgrades/v0.2.5-post7/bin/decentralized-api | cut -d' ' -f1)" = "040ade21ce37886e53bb2c4fd0c8eb8cce6827a44c841a14cbf788d748ce9da3" \
      && echo "Hash OK: binary matches expected sha256" \
      || echo "Hash FAILED: binary does not match expected sha256"
    ```

2) Restart `api` container:
    ```
    docker restart api
    ```

3) If you have unclaimed reward, wait for ~5 minutes and execute: 
    ```
    curl -X POST http://localhost:9200/admin/v1/claim-reward/recover \
        -H "Content-Type: application/json" \
        -d '{"force_claim": true, "epoch_id": 106}'
    ```

To check if you have unclaimed reward you can use:
```
curl http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/epoch_performance_summary/106/<ACCOUNT_ADDRESS> | jq
```

## Errors

### `No epoch models available for this node`

Here you can find examples of common errors and typical log entries that may appear in node logs.

```
2025/08/28 08:37:08 ERROR No epoch models available for this node subsystem=Nodes node_id=node1
2025/08/28 08:37:08 INFO Finalizing state transition for node subsystem=Nodes node_id=node1 from_status=FAILED to_status=FAILED from_poc_status="" to_poc_status="" succeeded=false blockHeight=92476
```
It’s not actually an error. It just indicates that your node hasn’t been assigned a model yet. Most likely, this is because your node hasn’t participated in a Sprint, hasn’t received Voting Power, and therefore hasn’t had a model assigned.
If your node has already passed PoC, you shouldn’t see this log anymore. If not, PoC takes place every ~24 hours.

