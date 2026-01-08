# Release announcements

## January 8, 2026

**Network Update — Patch Ready for Deployment**

The patch addressing the recent consensus failure observed during PoC is now available.

[GUIDE](https://gonka.ai/FAQ/#upgrade-v027)

To restore reliable consensus progress, installation of the patch by **at least 67%** of active network power is required.

Until this threshold is reached, consensus advancement may remain unstable.

**Hosts are encouraged to apply the patch promptly and remain online after upgrading.
Further instructions will be shared if necessary.**

## January 8, 2026

**Network Update — Follow-Up**

The patch addressing the recent consensus issue is ready, and detailed instructions will be shared shortly.
Participation from every active Host is critical for the network to move forward and restore normal operation. Please stay online and be ready to apply the update once the instructions are published.

## January 8, 2026

**Network Update — Consensus Failure During PoC**

During the Proof-of-Compute (PoC), a consensus failure was observed on the network.
The issue has been identified, and a patch is being prepared to address the root cause. Further instructions and technical details will be shared shortly.
Hosts are advised to stay online and monitor updates, as follow-up actions may be required once the patch is released.

## January 8, 2026

**v0.2.7 Upgrade Proposal: Genesis Validator Enhancement Live on Mainnet**

The on-chain governance vote for the v0.2.7 Upgrade Proposal: Genesis Validator Enhancement has concluded; the proposal has been APPROVED and successfully deployed on the mainnet.

**Key Changes Now Active:**


**Genesis Validator Enhancement (temporary)**

- Temporary reactivation of the Genesis Validator Enhancement — a previously used limited in duration defensive mechanism proposed to be reactivated.
- Consensus protection during network growth. During its prior operation:
    - Three Guardian validators collectively held approximately 34% of consensus voting power
    - No additional rewards were granted to Guardian validators
    - This configuration helped prevent consensus stalls in edge cases
- The Genesis Validator Enhancement will be deactivated automatically when both of the following conditions are satisfied:
    - total network power reaches 15.000.000.
    - block 3.000.000 is reached

**Protocol stability fixes (network-wide)**

This upgrade formalizes critical fixes that were previously distributed via a manual API update and are already in use on the network. These fixes:

- address incorrect accounting of failed inference requests (including cases where requests in unsupported formats were processed but not marked as completed) 
- improve resilience around failed inference handling
- introduce batching for `PoCBatch` and `PoCValidation` transactions. 

By including them here, the behavior becomes a protocol-level rule applied consistently across the network.

**Temporary participation and execution limitations**

- Host-level registration: Registration of new Hosts will be halted until block 2.222.222 (approximately two weeks from now). This measure is intended to stabilize the network and prepare it for further growth. 
- Developer-lever registration. Registration of new developer addresses will be paused during the stabilization period.  A predefined `allowlist` of developer addresses becomes effective immediately. Developer addresses included in the allowlist will be able to perform inference execution during this period. All limitations applicable to developer addresses, including developer-level registration and inference execution, will remain in effect until block 2.294.222 (approximately 19 days).

**Governance-controlled mechanism** 

Preparatory changes included in this upgrade enable future governance-based control over participant onboarding and inference execution without requiring an additional software upgrade. No such governance-activated constraints are enabled as part of this proposal, subject to additional governance vote.

**Epoch 117 rewards distribution**

This proposal covers two reward distributions related to chain halt (epoch 117):

- Nodes that were active during Epoch 117 but did not receive their epoch reward will receive the missed reward for that epoch.
- All nodes that were active during Epoch 117 will receive an additional payout equal to 1.083× the Epoch 117 reward, applied uniformly across all eligible nodes, including those that received the original reward.

**Note on duration and enforcement**

All protections reactivated or introduced by this upgrade are temporary and do not require manual governance intervention for removal.

**Next Steps:**

- No further actions are required by hosts.
- Cosmovisor creates a full backup in the `.inference` state folder whenever it performs an update. To safely run the update, it is recommended to have 250+ GB of free disk space. [Read here](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory) how to safely remove old backups from the `.inference` directory.

**Notes:**

- Full technical details of the Genesis Validator Enhancement are available here:
[https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)
- Full Technical Review (GitHub PR): [https://github.com/gonka-ai/gonka/pull/503](https://github.com/gonka-ai/gonka/pull/503)  

## January 7, 2026

The upgrade proposal for version **v0.2.7** has been approved through on-chain governance.

**Upgrade Details**

- Upgrade height: block 2.054.000
- Estimated time: January 8, 2026, at 08:10:00 UTC.

Pre-downloading binaries in advance may help avoid relying on GitHub availability during the upgrade window.

```
# 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.7/bin \
              .inference/cosmovisor/upgrades/v0.2.7/bin && \

# 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.7/decentralized-api-amd64.zip" && \
echo "03555ba60431e72bd01fe1fb1812a211828331f5767ad78316fdd1bcca0e2d52 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.7/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

# 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.7/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.7/inferenced-amd64.zip" && \
echo "b7c9034a2a4e1b2fdd525bd45aa32540129c55176fd7a223a1e13a7e177b3246 inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.7/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced && \
echo "Inference Installed and Verified" && \

# 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced && \
echo "d07e97c946ba00194dfabeaf0098219031664dace999416658c57b760b470a74 .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api" | sudo sha256sum --check && \
echo "09c0e06f7971be87ab00fb08fc10e21ff86f9dff6fc80d82529991aa631cd0a9 .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced" | sudo sha256sum --check
```
Binaries can be considered successfully installed once all commands complete without errors and the confirmation message is displayed.
```
Inference Installed and Verified
--- Final Verification ---
-rwxr-xr-x 1 root root 224376384 Jan  1  2000 .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api
-rwxr-xr-x 1 root root 215172352 Jan  1  2000 .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced
.dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api: OK
.inference/cosmovisor/upgrades/v0.2.7/bin/inferenced: OK
```

**ATTENTION**

- Please be online around the upgrade window to follow instructions if issues arise.
- Cosmovisor creates a full backup of the `.inference/data` directory during upgrades. Make sure sufficient disk space is available. If disk usage is high, older backups in `.inference` [can be safely removed. ](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)
- Large `application.db` files can be reduced using [these techniques.](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)

**Optional: skipping Cosmovisor backup**

Cosmovisor supports skipping the automatic state backup during upgrades by setting the environment variable `UNSAFE_SKIP_BACKUP=true` for the `node` container.

This may reduce disk usage and upgrade time. However, if the upgrade fails, no backup will be available to restore the previous state.

## January 7, 2026

**Important note for Hosts**

There is an option to skip the automatic backup during Cosmovisor upgrades by setting the environment variable `UNSAFE_SKIP_BACKUP=true` for `node` container.
This option is risky - if the upgrade fails, you will not have a backup to restore the state.

## January 6, 2026

**v0.2.7 Upgrade Proposal: Genesis Validator Enhancement Enters Governance**

An on-chain governance proposal related to the Genesis Validator Enhancement has been published and is now open for voting.

Recent network growth has introduced several challenges. Over the past days, the network has experienced multiple issues, some of which appear to be caused by deliberate attempts to disrupt or stress the system. This proposal aims to strengthen network resilience under increased load and adverse conditions through a set of temporary measures.

The Genesis Validator Enhancement was originally introduced during the early stage of the network as a temporary defensive mechanism and was active during the first two months of operation. The proposal now under governance is to temporarily reactivate this existing mechanism in response to current network conditions and activate some additional protective measures.

**Key Changes**

**Genesis Validator Enhancement (temporary)**

- Temporary reactivation of the Genesis Validator Enhancement — a previously used limited in duration defensive mechanism proposed to be reactivated.
- Consensus protection during network growth. During its prior operation:
    - Three Guardian validators collectively held approximately 34% of consensus voting power
    - No additional rewards were granted to Guardian validators
    - This configuration helped prevent consensus stalls in edge cases
- The Genesis Validator Enhancement will be deactivated automatically when both of the following conditions are satisfied:
    - total network power reaches 15.000.000.
    - block 3.000.000 is reached

**Protocol stability fixes (network-wide)**

This upgrade formalizes critical fixes that were previously distributed via a manual API update and are already in use on the network. These fixes:

- address incorrect accounting of failed inference requests (including cases where requests in unsupported formats were processed but not marked as completed) 
- improve resilience around failed inference handling
- introduce batching for `PoCBatch` and `PoCValidation` transactions. 

By including them here, the behavior becomes a protocol-level rule applied consistently across the network.

**Temporary participation and execution limitations**

- Host-level registration: Registration of new Hosts will be halted until block 2.222.222 (approximately two weeks from now). This measure is intended to stabilize the network and prepare it for further growth. 
- Developer-lever registration. Registration of new developer addresses will be paused during the stabilization period.  A predefined `allowlist` of developer addresses becomes effective immediately. Developer addresses included in the allowlist will be able to perform inference execution during this period. All limitations applicable to developer addresses, including developer-level registration and inference execution, will remain in effect until block 2.294.222 (approximately 19 days).

**Governance-controlled mechanism** 

Preparatory changes included in this upgrade enable future governance-based control over participant onboarding and inference execution without requiring an additional software upgrade. No such governance-activated constraints are enabled as part of this proposal, subject to additional governance vote.

**Epoch 117 rewards distribution**

This proposal covers two reward distributions related to chain halt (epoch 117):

- Nodes that were active during Epoch 117 but did not receive their epoch reward will receive the missed reward for that epoch.
- All nodes that were active during Epoch 117 will receive an additional payout equal to 1.083× the Epoch 117 reward, applied uniformly across all eligible nodes, including those that received the original reward.

**Note on duration and enforcement**

All protections reactivated or introduced by this upgrade are temporary and do not require manual governance intervention for removal.

**How to Vote**

You can fetch the proposal details and cast your vote using the `inferenced` command.

To check the voting status:
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 19 -o json --node $NODE_URL/chain-rpc/
```

To vote ( `yes` , `no` , `abstain` , `no_with_veto` ):
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced tx gov vote 19 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```

**Timelines and Deadlines**

- Voting ends: January 8th, 2026, at 04:23:14 UTC.
- Upgrade proposed at block: 2.054.000.
- Estimated upgrade time: January 8, 2026, at 08:10:00 UTC.

**ATTENTION HOSTS**

**Attention 1**

Please review the proposal and vote if you are a host.
Be online around the upgrade window to follow instructions if issues arise.

**Attention 2**

Cosmovisor creates a full backup in the `.inference/data` state folder whenever it performs an update, please make sure your disk has enough space. Read [here](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory) how to safely remove old backups from the `.inference` directory.
If your `application.db` takes a lot of space you can use techniques from [here](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it) to clean it up.

**Reference**

Full technical details of the Genesis Validator Enhancement are available here:
[https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)

Full Technical Review (GitHub PR): [https://github.com/gonka-ai/gonka/pull/503](https://github.com/gonka-ai/gonka/pull/503)  

## January 5, 2026
A higher-than-usual missed inference rate is currently observed on the network.
In many cases, this is caused by a bug where inference requests in an unsupported format were not marked as completed, even though the request itself was processed. The following update addresses this behavior.

Reference: [https://github.com/gonka-ai/gonka/pull/517](https://github.com/gonka-ai/gonka/pull/517) 

This `API` version improves resilience around failed inference handling and reduces missed inference accounting issues. It also introduces batching for PoCBatch and PoCValidation transactions.

**Upgrade timing**

Applying the update is safe when Confirmation PoC is not active.

To verify the current state:
```
curl "http://136.243.34.19:8000/v1/epochs/latest" | jq '.is_confirmation_poc_active'
```
Outside of Confirmation PoC, this value should return `false` .

**Installation**

Download and install the new binary, then restart the `API` container:
```
# Download Binary
sudo rm -rf decentralized-api.zip .dapi/cosmovisor/upgrades/v0.2.6-post12/ .dapi/data/upgrade-info.json
sudo mkdir -p  .dapi/cosmovisor/upgrades/v0.2.6-post12/bin/
wget -q -O  decentralized-api.zip 'https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.6-post12/decentralized-api-amd64.zip' && \
echo "f0d1172a90ca4653035e964abe4045f049d03d6060d6519742110e181b1b2257  decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j  decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.6-post12/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.6-post12/bin/decentralized-api && \
echo "API Installed and Verified"


# Link Binary
echo "--- Final Verification ---" && \
sudo rm -rf .dapi/cosmovisor/current
sudo ln -sf upgrades/v0.2.6-post12 .dapi/cosmovisor/current
echo "4672a39c3a3a0a2c21464c227a3f36e9ebf096ecc872bf9584ad3ea632752a3e .dapi/cosmovisor/current/bin/decentralized-api" | sudo sha256sum --check && \


# Restart 
source config.env && docker compose up api --no-deps --force-recreate -d
```
