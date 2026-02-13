# Announcements

## February 13, 2026

**Upcoming upgrade v0.2.10 voting and execution schedule**

The on-chain voting period for the upcoming software upgrade v0.2.10 is expected to begin Sunday evening (Los Angeles time) / Monday morning (UTC).
If the proposal is approved through governance, the upgrade is scheduled to be executed on Tuesday.

**Approximate timeline:**

- Sunday evening (LA time) — Voting period begins
- Monday (UTC morning) — Voting active
- Tuesday — Upgrade execution (if approved)
  
Please review the v0.2.10 upgrade PR on GitHub and leave your feedback. Bounties for meaningful review contributions may be proposed in the next upgrade.  

[https://github.com/gonka-ai/gonka/pull/695](https://github.com/gonka-ai/gonka/pull/695)

## February 12, 2026

**Network update: Patch available (PoC / cPoC overlap)**

A patch is now available to address the incident observed in the current epoch (169/170).

**Action required**

Hosts are requested to apply the patch as soon as possible to ensure correct PoC validation behavior and allow block production to resume safely.
```
# Download Binary
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.9-post3/ .inference/data/upgrade-info.json
sudo mkdir -p  .inference/cosmovisor/upgrades/v0.2.9-post3/bin/
wget -q -O  inferenced.zip 'https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.9-post3/inferenced-amd64.zip' && \
echo "59896da31f4e42564fc0a2f63a9e0bf4f25f240428f21c0d5191b491847553df  inferenced.zip" | sha256sum --check && \
sudo unzip -o -j  inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.9-post3/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.9-post3/bin/inferenced && \
echo "Inference Installed and Verified"

# Link Binary
echo "--- Final Verification ---" && \
sudo rm -rf .inference/cosmovisor/current
sudo ln -sf upgrades/v0.2.9-post3 .inference/cosmovisor/current
echo "aaffbbdc446fbe6832edee8cb7205097b2e5618a8322be4c6de85191c51aca1d .inference/cosmovisor/current/bin/inferenced" | sudo sha256sum --check && \

# Restart 
source config.env && docker compose up node --no-deps --force-recreate -d
```

[https://github.com/gonka-ai/gonka/pull/748](https://github.com/gonka-ai/gonka/pull/748)

## February 12, 2026

**Network incident: PoC / cPoC overlap (block production paused)**

An overlap between cPoC (confirmation PoC) and PoC has been observed in the current epoch. Up to the final block of the epoch, `is_confirmation_poc_active` was observed as `true`.

The impact of this overlap is currently being assessed. Initial observations indicate that no node recorded PoC commits, resulting in zero weight accumulated for the epoch.

As a precautionary measure, block production was temporarily halted through coordinated action by miners.

The issue is being localized.

Please remain available in case a patch needs to be applied on short notice. Additional details and the patch instructions will be shared once ready.

## February 12, 2026 

**Inference is now available**

On-chain inference access is currently open and is not restricted to developers. Inference requests can be sent via Allowed Transfer Agents, which were introduced in the previous update. The current allowlist can be queried on-chain:
```
curl "http://node2.gonka.ai:8000/chain-api/productscience/inference/inference/params" | jq '.params.transfer_agent_access_params.allowed_transfer_addresses'
```
Allowed Transfer Agents (current):
```
 gonka1y2a9p56kv044327uycmqdexl7zs82fs5ryv5le
 gonka1dkl4mah5erqggvhqkpc8j3qs5tyuetgdy552cp
 gonka1kx9mca3xm8u8ypzfuhmxey66u0ufxhs7nm6wc5
 gonka1ddswmmmn38esxegjf6qw36mt4aqyw6etvysy5x
 gonka10fynmy2npvdvew0vj2288gz8ljfvmjs35lat8n
 gonka1v8gk5z7gcv72447yfcd2y8g78qk05yc4f3nk4w
 gonka1gndhek2h2y5849wf6tmw6gnw9qn4vysgljed0u
```
A new library version is available here: [https://gonka.ai/developer/quickstart/#3-inference-using-modified-openai-sdk](https://gonka.ai/developer/quickstart/#3-inference-using-modified-openai-sdk) 

**Note:** If an address is not included in the allowlist, inference requests routed through that address will not be accepted under the current configuration.

## February 10, 2026 

**PR Review for Upgrade v0.2.10**

[The Pull Request](https://github.com/gonka-ai/gonka/pull/695) for the next on-chain software upgrade, v0.2.10, is open for review. Feedback and suggested improvements are welcome. The current plan is to keep the review window open for about 2 days.

Bounties for meaningful contributions to this PR review may be proposed in the next upgrade. 

This is a call for review of the Pull Request only, and not the start of formal voting. The governance voting process will begin after the review period concludes.

**Key changes**

**[PR #710](https://github.com/gonka-ai/gonka/pull/710) PoC Validation Sampling Optimization**

This upgrade introduces a new PoC validation mechanism that reduces complexity from O(N^2) to O(N x N_SLOTS) by assigning each participant a fixed sampled set of validators. Reference design and analysis: [https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/poc/optimize.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/poc/optimize.md)  

**[PR #725](https://github.com/gonka-ai/gonka/pull/725) PR PoC Weight Normalization by Real PoC Time**

This upgrade normalizes PoC participant weights by actual PoC elapsed time to reduce block-time drift effects and keep weight outcomes consistent with real execution duration.

**Other key changes:**

- **[PR #708](https://github.com/gonka-ai/gonka/pull/708)** IBC Upgrade to v8.7.0
- **[PR #723](https://github.com/gonka-ai/gonka/pull/723)** Testnet bridge setup scripts
- **[PR #666](https://github.com/gonka-ai/gonka/pull/666)** Artifact storage throughput optimization
- **[PR #688](https://github.com/gonka-ai/gonka/pull/688)** Punishment statistics from on-chain data
- **[PR #697](https://github.com/gonka-ai/gonka/pull/697)** Portable BLST build for macOS test builds
- **[PR #712](https://github.com/gonka-ai/gonka/pull/712)** Require proto-go generation matches committed code
- **[PR #711](https://github.com/gonka-ai/gonka/pull/711)** PoC test params from chain state
- **[PR #641](https://github.com/gonka-ai/gonka/pull/641)** Streamvesting transfer with vesting
- **[PR #659](https://github.com/gonka-ai/gonka/pull/659)** model assignment checks previous-epoch rewards.
- **[PR #716](https://github.com/gonka-ai/gonka/pull/716)** rename PoC weight function for clarity and correctness.

**API hardening and reliability fixes:**

- **[PR #634](https://github.com/gonka-ai/gonka/pull/634)**: add request body size limits to reduce DoS risk.
- **[PR #727](https://github.com/gonka-ai/gonka/pull/727)**: follow-up for #634, pass response writer to `http.MaxBytesReader` and align tests.
- **[PR #638](https://github.com/gonka-ai/gonka/pull/638)**: fix unsafe type assertions in request processing.
- **[PR #644](https://github.com/gonka-ai/gonka/pull/644)**: avoid rewriting static config on each startup.
- **[PR #661](https://github.com/gonka-ai/gonka/pull/661)**: prevent API crash on short network drops.
- **[PR #640](https://github.com/gonka-ai/gonka/pull/640)**: add unit tests for node version endpoint behavior.
- **[PR #622](https://github.com/gonka-ai/gonka/pull/622)**: propagate refund errors in `InvalidateInference`.
- **[PR #639](https://github.com/gonka-ai/gonka/pull/639)**: add missing return after error in task claiming path.
- **[PR #643](https://github.com/gonka-ai/gonka/pull/643)**: sanitize nil participants in executor selection.
- **[PR #545](https://github.com/gonka-ai/gonka/pull/545)**: minor bug fixes in API flow.

**Upgrade plan**

Binary versions are expected to be updated via an on-chain upgrade proposal. For more information on the upgrade process, refer to [https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/docs/upgrades.md.](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/docs/upgrades.md.)

Existing hosts don’t need to upgrade their `api` and `node` containers. The updated container versions are intended for new hosts who join after the on-chain upgrade is complete.

**Proposed process**

1. Active hosts review this proposal on GitHub and leave feedback.
2. After the PR is reviewed by community, a v0.2.10 release is expected to be created from this branch, and an on-chain upgrade proposal for this version can be submitted, starting the formal governance voting process.
3. If the on-chain proposal passes, this PR is expected to be merged after the upgrade is executed on-chain.

Creating the release from [upgrade-v0.2.10](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.10) branch (instead of `main`) minimizes the time that the `/deploy/join/` directory on the `main` branch contains container versions that do not match the on-chain binary versions, ensuring a smoother onboarding experience for new hosts.

**Testing and migration**

Testing guidance and migration details for v0.2.10 are documented [here](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10). Please review carefully.

**Compatibility notes**

If you have any scripts that parse JSON output from the `inferenced` CLI, please re-check them after this upgrade. Due to the ibc-go upgrade to v8.7.0, enums are now encoded as strings instead of numbers, and int64/uint64 values are now also encoded as strings.

## February 4, 2026

**CLI update reminder**

For granting permissions to warm keys created after the v0.2.9 upgrade, the [CLI version v0.2.9](https://github.com/gonka-ai/gonka/releases/tag/release%2Fv0.2.9) should be used.

## February 3, 2026

**PoC v2 inference-based weight adjustments**

With PoC v2 active, weight assignment is now based on measured inference performance on the current model `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`. As a result, both median GPU weights and relative weight ratios between GPU types have been adjusted.

**Observed GPU weight changes (Epoch 158 → 159)**

| GPU Type         | Epoch 158 | Epoch 159 | Change |
|------------------|-----------|-----------|--------|
| A100-PCIE-40GB   | 129.05    | 17.31     | -86.6% |
| A100-SXM4-80GB   | 204.12    | 127.75    | -37.4% |
| B200             | 739.81    | 300.75    | -59.3% |
| H100 80GB HBM3   | 424.73    | 292.88    | -31.0% |
| H100 PCIe        | 307.03    | 144.53    | -52.9% |
| H200             | 512.38    | 303.88    | -40.7% |

**Context**

- Observed changes indicate that GPU weight differences now reflect model-specific inference throughput rather than nominal hardware specifications. For example, the H100 PCIe weight decreased more than the H100 HBM3 weight, consistent with observed inference behavior for `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`.
- Under the current model configuration, B200 GPUs do not demonstrate higher inference performance compared to H100-class GPUs, based on observed inference traces.
- Different performance characteristics may be observed if and when larger or more demanding models are introduced through governance in future epochs (for example, DeepSeek V3.2).
- Control inference benchmark measurements performed outside of PoC, using standard vLLM-based inference on the same model `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`, showed the same relative performance differences between GPU types as observed in PoC v2.

**Action for tracker (dashboard) maintainers**

With the updated weight assignments in effect, tracker (dashboard) maintainers may wish to review their coefficients for epoch 159 and later to ensure consistency with the current PoC v2 weight assignment.

## February 2, 2026

**Network Update — Patch Available**

A patch is now available to address the issue that caused the recent pause in block validation during the PoC cycle. Hosts are encouraged to apply the patch as soon as possible to ensure correct PoC validation behavior and allow block production to resume safely.

**Action required**

Hosts are requested to apply the patch as soon as possible to ensure correct PoC validation behavior and allow block production to resume safely.
```
# Download Binary
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.9-post2/ .inference/data/upgrade-info.json
sudo mkdir -p  .inference/cosmovisor/upgrades/v0.2.9-post2/bin/
wget -q -O  inferenced.zip 'https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.9-post2/inferenced-amd64.zip' && \
echo "8de51bdd1d2c0af5f1da242e10b39ae0ceefd215f94953b9d95e9276f7aa70c7  inferenced.zip" | sha256sum --check && \
sudo unzip -o -j  inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.9-post2/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.9-post2/bin/inferenced && \
echo "Inference Installed and Verified"

# Link Binary
echo "--- Final Verification ---" && \
sudo rm -rf .inference/cosmovisor/current
sudo ln -sf upgrades/v0.2.9-post2 .inference/cosmovisor/current
echo "75410178a4c3b867c0047d0425b48f590f39b9e9bc0f3cf371d08670d54e8afe .inference/cosmovisor/current/bin/inferenced" | sudo sha256sum --check && \

# Restart 
source config.env && docker compose up node --no-deps --force-recreate -d
```
Further instructions, including any required coordination steps for resuming block validation, will be shared separately.

## February 2, 2026

**Block validation has been paused as a precautionary measure**

Block validation has been paused through the collective action of hosts as a precaution due to a high risk that validation thresholds may not be met during the current PoC cycle.
Based on the current assessment, the mechanism intended to handle this scenario may not operate as expected. To prevent validator finalization under uncertain or unsafe conditions, the network was halted prior to validator selection.

**Next steps**

The following actions are currently in progress:

- Verifying that no validator set is able to reach the required validation thresholds
- Confirming the network state prior to validator finalization
- Preparing a patch to address the identified issue

**Action required**

All hosts must be prepared to install a patch on short notice.
Please remain online and monitor announcements closely. Further instructions will be shared as soon as the patch is ready.

## February 1, 2026

**UPGRADE EXECUTED: v0.2.9 is now live on mainnet**

The on-chain governance vote for Upgrade Proposal v0.2.9 has concluded. The proposal has been APPROVED, and the upgrade was successfully executed on the mainnet at block 2451000. This upgrade implemented PoC v2 for weight assignment and completed the transition away from the legacy PoC mechanism.

**Attention**

- The next PoC cycle (the transition from epoch 158 to 159) is critical. Please plan to be online so that any follow-up steps or mitigation instructions can be applied promptly, if needed.
- Only ML Nodes serving `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` will be eligible to enter the next (159) epoch and participate in PoC v2 weight assignment. ML Nodes running other models will not be included in the participant set for the upcoming epoch.
  
**Host preparation**

Hosts are encouraged to verify that all ML Nodes:

- are configured to serve the supported model `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` only
- images are updated to a PoC v2–compatible version

Guidance on switching ML Nodes to `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`, upgrading ML Node images, and removing other models is available in [the FAQ](https://gonka.ai/FAQ/#how-to-switch-to-qwenqwen3-235b-a22b-instruct-2507-fp8-upgrade-ml-nodes-and-remove-other-models).

**Key changes now active**

**PoC v2 activation**

- PoC v2 is used as the active mechanism for weight assignment
- Confirmation PoC (V2 tracking) is used as the canonical source of results
- Legacy PoC logic is no longer used for weight calculation

**Model configuration**

- The network operates in a single-model configuration
- The model used for PoC v2 and weight assignment is `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 
- ML Nodes serving other models are not included in PoC v2 weight assignment. Where supported, an automatic model switch to `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` may occur 

**Eligibility criteria**

For an ML Node to be eligible for PoC v2 weight assignment, both conditions must be met:

- The node serves `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- The node runs a PoC v2–compatible image:
    - ghcr.io/product-science/mlnode:3.0.12-post1 
    - ghcr.io/product-science/mlnode:3.0.12-post1-blackwell 

**Reward flow correction for cPoC cases**

In cases where rewards are reduced or excluded due to cPoC penalties, the unaccounted portion is transferred to the Community pool. Previously, such rewards were redistributed among other participants.

**Additional protocol updates**

- Transfer Agent roles are restricted to a [defined](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#transfer-agent-whitelist) `allowlist` for the initial phase
- Nodes that participated in PoC generation while ignoring PoC validation have been removed from the [participant's](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#suspicious-participant-removal) `allowlist` 
- [Guardian weights](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#guardian-tiebreaker-for-poc-v2-voting) are applied as a deterministic fallback when PoC v2 validation vote thresholds are not reached 

Additional details for these changes are available in the governance artifacts: [https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9 ](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9 )

## February 1, 2026 

The on-chain governance process for the v0.2.9 upgrade proposal is nearing its conclusion.

- Voting ends: February 1st, 2026, at 22:02:58 UTC
- Upgrade height: 2451000.
- Estimated upgrade time: February 2nd, 2026, at 05:10:00 UTC

Hosts are encouraged to review the proposal on [GitHub](https://github.com/gonka-ai/gonka/pull/668) and participate in the vote.

Pre-downloading binaries in advance may help avoid relying on GitHub availability during the upgrade window.
```
# 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.9/bin \
              .inference/cosmovisor/upgrades/v0.2.9/bin && \

# 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.9/decentralized-api-amd64.zip" && \
echo "ac1ad369052a8c3d01af4d463c49cdd16fcbecc365d201232e7a2d08af8501c0 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.9/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.9/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

# 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.9/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.9/inferenced-amd64.zip" && \
echo "fc628d77aa516896924fbd8f60b8aa6a14161de4582aaef634de62382ea482eb inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.9/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.9/bin/inferenced && \
echo "Inference Installed and Verified" && \

# 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.9/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.9/bin/inferenced && \
echo "52c79f06a8fc175ca6b3819523bb36afbf601d8a8320b1bb5a3cc089ceef62c4 .dapi/cosmovisor/upgrades/v0.2.9/bin/decentralized-api" | sudo sha256sum --check && \
echo "ae20517e4bb38293202f7f5d52439d5315cb32c8f3c34a02fa65feaefadd6193 .inference/cosmovisor/upgrades/v0.2.9/bin/inferenced" | sudo sha256sum --check
```

## January 31, 2026

**v0.2.9 Upgrade Proposal Enters Governance**

The upgrade proposal for the next on-chain software version v0.2.9 has now been published on-chain and is open for voting. If approved, the proposal enables PoC v2 for weight assignment and completes the transition away from the legacy PoC mechanism via on-chain governance.

**Key changes**

**PoC v2 activation**

- PoC v2 is used as the active mechanism for weight assignment
- Confirmation PoC (V2 tracking) is used as the canonical source of results
- Legacy PoC logic is no longer used for weight calculation

**Model configuration**

- The network operates in a single-model configuration
- The model used for PoC v2 and weight assignment is `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 
- ML Nodes serving other models are not included in PoC v2 weight assignment. Where supported, an automatic model switch to `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` may occur 

**Eligibility criteria**

For an ML Node to be eligible for PoC v2 weight assignment, both conditions must be met:

- The node serves `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- The node runs a PoC v2–compatible image:
    - ghcr.io/product-science/mlnode:3.0.12-post1 
    - ghcr.io/product-science/mlnode:3.0.12-post1-blackwell 

**Reward flow correction for cPoC cases**

In cases where rewards are reduced or excluded due to cPoC penalties, the unaccounted portion is transferred to the Community pool. Previously, such rewards were redistributed among other participants.

**Additional protocol updates**

- Transfer Agent roles are restricted to a [defined](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#transfer-agent-whitelist) `allowlist` for the initial phase
- Nodes that participated in PoC generation while ignoring PoC validation have been removed from [the participant](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#suspicious-participant-removal) `allowlist` 
- [Guardian weights](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9#guardian-tiebreaker-for-poc-v2-voting) are applied as a deterministic fallback when PoC v2 validation vote thresholds are not reached 

Additional details for these changes are available in the governance artifacts: [https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.9/proposals/governance-artifacts/update-v0.2.9) 

**Host preparation**

Hosts are encouraged to verify that all ML Nodes:

- are configured to serve the supported model `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` only
- images are updated to a PoC v2–compatible version

Guidance on switching ML Nodes to `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`, upgrading ML Node images, and removing other models is available in [the FAQ](https://gonka.ai/FAQ/#how-to-switch-to-qwenqwen3-235b-a22b-instruct-2507-fp8-upgrade-ml-nodes-and-remove-other-models).

**How to vote**

Proposal details and voting are available via `inferenced`. Any active node can be used. Available nodes include:

- [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
- [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
- [http://node3.gonka.ai:8000](http://node3.gonka.ai:8000)
- [https://node4.gonka.ai](https://node4.gonka.ai)

Cast your vote ( `yes` , `no` , `abstain` , `no_with_veto` ):
```
export NODE_URL=https://node4.gonka.ai/
./inferenced tx gov vote 26 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```
To check the voting status:
```
export NODE_URL=https://node4.gonka.ai/
./inferenced query gov votes 26 -o json --node $NODE_URL/chain-rpc/
```
**Deadlines**

- Voting ends: February 1st, 2026, at 22:02:58 UTC
- Upgrade height: 2451000.
- Estimated upgrade time: February 2nd, 2026, at 05:10:00 UTC

Hosts are encouraged to review the proposal on [GitHub](https://github.com/gonka-ai/gonka/pull/668) and participate in the vote.

**Attention**

- Please plan to be online during the upgrade window so that any follow-up steps or mitigation instructions can be applied promptly, if needed.
- During upgrades, Cosmovisor creates a full state backup in the `.inference/data` directory. Ensure sufficient disk space is available before the upgrade. Guidance on safely removing old backups from the `.inference` directory is available in [the documentation](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory).
- If `application.db` occupies a significant amount of disk space, the cleanup techniques described [here](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it) may be applied.
- After the upgrade, Postgres is available as an option for local payload storage.

## January 29, 2026

**PoC validation participation notice**

During the latest epoch, a large number of ML Nodes did not receive PoC weight.
Analysis shows that this was caused by insufficient participation in PoC validation. In multiple cases, participants published nonces, but validation was either not performed or performed at a level significantly below protocol requirements.
The following table shows participants who had a weight in the previous epoch, submitted PoC nonces in the current epoch, but either missed PoC validation phase or insufficiently participated in it: [https://docs.google.com/spreadsheets/d/17agQXP77lATT2bNK12OEOzek5wNSptN2ktiSag3QXB0/](https://docs.google.com/spreadsheets/d/17agQXP77lATT2bNK12OEOzek5wNSptN2ktiSag3QXB0/)

Their total weight was about 36%. Together with participants who did not participate in PoC at all, the total weight of those with no or low participation in PoC validation reached about 48%, which is critically high.
If your node appears in this table with 0 in `validated`, please review your PoC validation logs and configuration to ensure validation is running as expected.

This notebook shows the process that was used to assemble the table above: [https://github.com/gonka-ai/gonka/blob/gm/debug-155-1/debug-validation.ipynb](https://github.com/gonka-ai/gonka/blob/gm/debug-155-1/debug-validation.ipynb).

## January 29, 2026 

**UPGRADE EXECUTED: v0.2.8 is Now Live on Mainnet**

The on-chain governance vote for Upgrade Proposal v0.2.8 has concluded. The proposal has been APPROVED and successfully executed on the mainnet. 
This upgrade implements the PoC v2 architecture, streamlines model support, and applies critical security and reliability fixes.

**Key Changes Now Active**

**PoC v2 Core Integration**

- vLLM Integration: PoC is integrated directly into vLLM, enabling an immediate switch from inference to PoC without offloading the model.
- MMR Commitments: Artifact storage is migrated off-chain using Merkle Mountain Range commitments; only `root_hash` and `count` are recorded on-chain.,
- Dual-Mode Migration: Support for V1 (regular PoC) and V2 (Confirmation PoC) tracking is active.

**Model Availability Updates**

The supported model set is now restricted. All previously supported models are removed from the active set except:

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `Qwen/Qwen3-32B-FP8`

**Security & Reliability Improvements**

- SSRF & DoS: Validation of `InferenceUrl` to reject internal IPs and addition of timeouts to prevent request hangs.
- Vote Flipping: Rejection of duplicate PoC validations to prevent overwriting.
- Auth Bypass: Binding of `epochId` to signatures for validation against the correct epoch.

**Host Requirements for PoC v2 Eligibility**

Eligibility for PoC v2 participation requires Hosts to complete the following:

- Model Configuration: Configure the ML node to serve `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- ML Node Upgrade: Utilize a version supporting PoC v2:
    - ghcr.io/product-science/mlnode:3.0.12
    - ghcr.io/product-science/mlnode:3.0.12-blackwell

!!! note 
    Nodes failing to meet both conditions will be ineligible for PoC v2 participation once the network transitions to a single-model configuration. Transition to PoC v2 for weight assignment remains subject to observational adoption thresholds and subsequent governance.

**Maintenance & Operations**

- Cosmovisor: Node and API binary updates are handled automatically. Existing Hosts do not need to perform manual updates on running containers.
- Disk Space: Cosmovisor creates a full state backup in the `.inference/data` directory. Ensure 250+ GB of free space is available.
- Postgres: Local payload storage via Postgres is now available for configuration post-upgrade.

Monitoring node status and Discord communication is advised during the post-upgrade window to ensure stability.

## January 28, 2026

**How to switch to `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`, upgrade ML Nodes, and remove other models?**

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

**3. PoC v2 readiness criteria (Important)**

Successful participation in the PoC v2 transition requires both of the following:

- All your ML Nodes serve Qwen/Qwen3-235B-A22B-Instruct-2507-FP8. This is the only model that contributes to PoC v2  weight.
- All your ML Nodes are upgraded to a PoC v2–compatible image:
    - ghcr.io/product-science/mlnode:3.0.12
    - ghcr.io/product-science/mlnode:3.0.12-blackwell

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
Changes applied via the Admin API will replace model for the next epoch [https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)

!!! note 

    `node-config.json` is used only on the first launch of the Network Node API or when the local state/database is removed. Edit it for a fresh restart. For existing nodes, model updates should be performed via the Admin API. 

**5. Upgrade the ML Node image (required for PoC v2)**

Edit `docker-compose.mlnode.yml` and update the ML Node image:

Standard GPUs
```
image: ghcr.io/product-science/mlnode:3.0.12
```
NVIDIA Blackwell GPUs
```
image: ghcr.io/product-science/mlnode:3.0.12-blackwell
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
- ML Node image is 3.0.12 (or 3.0.12-blackwell)

## January 28, 2026

The on-chain governance process for the v0.2.8 upgrade proposal is nearing its conclusion.

**Upgrade details**

- Upgrade height: block 2387000
- Estimated time: January 29th, 2026, at 06:30:00 UTC

Pre-downloading binaries in advance may help avoid relying on GitHub availability during the upgrade window.

```
# 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.8/bin \
              .inference/cosmovisor/upgrades/v0.2.8/bin && \

# 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.8-post1/decentralized-api-amd64.zip" && \
echo "45f28afba4758e54988f61cc358f0ad683e7832ab121ccd54b684fe4c9381a75 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.8/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.8/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

# 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.8/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.8-post1/inferenced-amd64.zip" && \
echo "f0f2e3ee8760e40a78087c98c639a7518bf062138141ed4aec2120f5bc622a67 inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.8/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.8/bin/inferenced && \
echo "Inference Installed and Verified" && \

# 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.8/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.8/bin/inferenced && \
echo "421a761f3a7037d72ee0bd8b3f50a744349f717439c7e0fee28c55948dae9a7c .dapi/cosmovisor/upgrades/v0.2.8/bin/decentralized-api" | sudo sha256sum --check && \
echo "308c63c7bda4fb668632ac3e13f3f6cccacf54c563c8e9fd473bcb48c7389fe0 .inference/cosmovisor/upgrades/v0.2.8/bin/inferenced" | sudo sha256sum --check
```

## January 27, 2026

**v0.2.8 Upgrade Proposal Enters Governance**

The upgrade proposal for the next on-chain software version v0.2.8 has now been published on-chain and is open for voting!
Your review and vote are critical to ensuring the network's stability and future capabilities.

**Key changes in v0.2.8**

**PoC v2 (Core upgrade)**

- Integrates PoC directly into vLLM, enabling an immediate switch from inference to PoC without offloading the model or loading a separate PoC model.
- Migrates artifact storage off-chain using MMR (Merkle Mountain Range) commitments - only root_hash and count are recorded on-chain.
- Includes dual-mode migration strategy: V1 for regular PoC, V2 tracking for Confirmation PoC during rollout.

**Model availability changes**

As part of the v0.2.8 upgrade, the set of supported models is updated. All previously supported models are removed from the active set, except for:

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `Qwen/Qwen3-32B-FP8`
  
Successful participation in the PoC v2 using `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`, together with the required ML Node version, is used to assess readiness for the PoC v2 transition. Once a sufficient level of adoption (~50%) among active Hosts is observed, a separate governance proposal may be submitted to approve and activate the PoC v2 for assigning weights. This threshold is observational and does not trigger any automatic network changes.

After the next network step is approved through governance, the network will temporarily support only `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`.

**Security, correctness, and reliability improvements**

- SSRF & DoS: Validates InferenceUrl to reject internal IPs and adds timeouts to prevent request hangs.
- Vote Flipping: Prevents overwriting of PoC validations by rejecting duplicates.
- PoC Exclusion: Fixes getInferenceServingNodeIds to correctly exclude inference-serving nodes.
- Auth Bypass & Replay: Binds epochId to signatures and validates authorization against the correct epoch.

Due to the volume of changes, only selected items are highlighted here. A comprehensive list of additional updates and fixes is available in the [GitHub pull request.](https://github.com/gonka-ai/gonka/pull/539)

**Host action required**

To participate in the PoC v2 transition, Hosts must complete both of the following steps:

- Verify that your ML node is configured to serve `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- Upgrade the ML Node to a version that supports PoC v2:
    - ghcr.io/product-science/mlnode:3.0.12
    - ghcr.io/product-science/mlnode:3.0.12-blackwell

Serving `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` without upgrading the ML node is not sufficient for PoC v2 participation. Nodes that do not meet both conditions will not be considered eligible for PoC v2 participation once the network switches to the single-model configuration. The ML Node upgrade must be completed before PoC v2 is fully enabled through governance.

**How to vote**

You can fetch the proposal details and cast your vote using the `inferenced` command. Please note that any active node can be used to query or cast a vote. Currently available nodes include:

- [http://node1.gonka.ai:8000/](http://node1.gonka.ai:8000/)
- [http://node2.gonka.ai:8000/](http://node2.gonka.ai:8000/)
- [http://node3.gonka.ai:8000/](http://node3.gonka.ai:8000/)
- [https://node4.gonka.ai/](https://node4.gonka.ai/)
  
To check the voting status:
```
export NODE_URL=https://node4.gonka.ai/
./inferenced query gov votes 25 -o json --node $NODE_URL/chain-rpc/
```

To vote ( `yes` , `no` , `abstain` , `no_with_veto` ):
```
export NODE_URL=https://node4.gonka.ai/
./inferenced tx gov vote 25 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```

**Deadlines**

- Voting ends at January 29th, 2026, at 03:02:20 UTC.
- Upgrade is proposed on block 2387000. The estimated time of this block is January 29th, 2026, at 06:30:00 UTC.

Please take a look and vote if you're a host.

**ATTENTION 1:** Please plan to be online during the upgrade window, so any follow-up steps or mitigation instructions can be applied promptly if needed.

**ATTENTION 2:** During upgrades, Cosmovisor creates a full state backup in the `.inference/data directory`. Please ensure sufficient disk space is available. Instructions on safely removing old backups from the `.inference` directory are available [here](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory). If `application.db` occupies a significant amount of disk space, the cleanup techniques described [here](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it) can be used.

**Note:** After the upgrade, Postgres can be configured as storage for local payloads.

## January 19, 2026

**Proposal Update: Stabilization Period Extension Approved**

The recent governance vote regarding the Stabilization Period Extension has successfully passed. The stabilization period is now officially extended to allow for additional testing and network upgrades.

**ACTION ITEM FOR HOSTS**

With the extension confirmed, please use this time to prepare your setups for the new PoC requirements.

- Model Update: Please switch your ML Nodes to the `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` model.
- Gradual Rollout: If you operate multiple ML Nodes, you are encouraged to perform these updates gradually across multiple epochs.

**How to update**

Instructions for updating an existing ML Node can be found here: [https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)

## January 16, 2026

**Stabilization Period Extension**

A new governance vote is currently active.

The proposal extends the current stabilization period by approximately two weeks. The extended period is intended for additional testing related to upcoming PoC changes and associated network upgrades. More details about new PoC development progress are available here: [https://github.com/gonka-ai/gonka/blob/gm/poc-status/proposals/governance-artifacts/poc-update-status.md](https://github.com/gonka-ai/gonka/blob/gm/poc-status/proposals/governance-artifacts/poc-update-status.md).

The extension also provides time for Hosts to prepare their setups for the new PoC requirements, including switching their ML Nodes to the `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` model. Instructions for updating an existing ML Node are available here: [https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode). Hosts who operate multiple ML Nodes are encouraged to perform updates gradually across multiple epochs.

**Scope of the Vote**

If approved, the network will continue to operate temporarily under the existing `allowlist` (comprising Hosts who have not demonstrated non-standard hardware behaviour). 

The Developers `allowlist` is extended by the same offset and will remain in effect until block 2459375.

Hosts not included in the `allowlist` will remain unable to participate in PoC during the extended stabilization period, which will conclude at block 2443558.

**Reproducibility and methodology**

The `allowlist` is:

- available here: [https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)
- derived from publicly observable on-chain data using a predefined set of hardware configuration patterns. These patterns are evaluated using open-source scripts available here:[https://github.com/product-science/filter](https://github.com/product-science/filter)

**Execution characteristics**

- The `allowlist` extends automatically if the proposal is approved.
- No software upgrade is needed.
- Further adjustments, if needed, remain subject to governance.

**After the stabilization window**

The `allowlist` has a fixed expiration and does not persist beyond the extended stabilization window. Once the `allowlist` expires at block 2443558:

- The network reverts to the standard participation rules in effect prior to the stabilization period, or
- Any alternative configuration must be defined through a separate governance decision.

**How to vote**

You can fetch the proposal details and cast your vote using the `inferenced` command.

Please note that any active node can be used to query or cast a vote. Currently available nodes include:

- http://node1.gonka.ai:8000/ 
- http://node2.gonka.ai:8000/
- http://node3.gonka.ai:8000/ 
- https://node4.gonka.ai/ 

To check the voting status:
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 22 -o json --node $NODE_URL/chain-rpc/
```

To vote ( `yes` , `no` , `abstain` , `no_with_veto` ):
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced tx gov vote 22 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```

**Next steps after the vote**

This process is handled entirely through governance and does not require a software upgrade.

**Timeline and deadlines**

Voting ends: January 18th, 2026, at 05:28:01 UTC.

`Allowlist` expiration: Automatically at block 2443558.

## January 10, 2026

**Temporary participant `allowlist` correction**

A new governance vote is currently active. It corrects a filtration edge case by adding several addresses to the [allowlist](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv) that were previously filtered out due to empty hardware names while having zero ML Node weight. The proposal also adds a small number of developer accounts to the allowed developers list and aligns the expiration of the `allowlist` with the participant registration cut-off at block 2,222,222.
All participation logic remains unchanged. This proposal only resolves a minor issue in the existing filtration logic.

**Reproducibility and methodology**

The `allowlist` is derived from publicly observable on-chain data using a predefined set of hardware configuration patterns. These patterns are evaluated using open-source scripts available here: [https://github.com/product-science/filter](https://github.com/product-science/filter) 

The `allowlist` is available here: [https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv) 

**How to vote**

You can fetch the proposal details and cast your vote using the `inferenced` command.

Please note that any active node can be used to query or cast a vote. Currently available nodes include:

- http://node1.gonka.ai:8000/
- http://node3.gonka.ai:8000/
- https://node4.gonka.ai/
  
To check the voting status:
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 21 -o json --node $NODE_URL/chain-rpc/
```

To vote ( `yes` , `no` , `abstain` , `no_with_veto` ):
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced tx gov vote 21 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```

**Next steps after the vote**

This process is handled entirely through governance and does not require a software upgrade.

**Timelines and deadlines**

Voting ends: January 12th, 2026, at 06:04:14 UTC.

`Allowlist` expiration: Automatically at block 2,222,222.

## January 10, 2026

**Temporary participant `allowlist` approved. Activates in Epoch 135**

The on-chain governance vote for the temporary participant `allowlist` for the stabilization period has concluded.

The proposal has been approved. This proposal defines a temporary `allowlist` reflecting participants whose behavior has remained consistent across recent epochs.

**Key changes now active**

1) The network will operate with an `allowlist` composed of participants who, across multiple epochs:
   
- Reported hardware characteristics matching commonly observed configuration patterns (the list of filtered non-standard configuration strings is available here: [https://github.com/product-science/filter/blob/main/filter_strings.txt](https://github.com/product-science/filter/blob/main/filter_strings.txt))
- Demonstrated PoC weight not exceeding 150% of the weight observed for comparable hardware
  
2) Participants that previously exhibited consistent deviations from these patterns are excluded from the `allowlist` until the stabilization window concludes at block 2,222,222.

**Execution characteristics**

- The `allowlist` becomes active starting from the next epoch (Epoch 135)
- The activation occurs during the first PoC of Epoch 135
- No software upgrade is required
- From that point, the `allowlist` remains in effect up to and including block 2,222,222

**Reproducibility and methodology**

- The `allowlist` is derived exclusively from publicly observable on-chain data
- Hardware descriptors are evaluated against a predefined set of configuration patterns using open-source scripts: [https://github.com/product-science/filter](https://github.com/product-science/filter) 
- The resulting `allowlist` is published here: [https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)

**Next Steps**

No action is required from hosts.

## January 8, 2026

**TIME IS NOW: Temporary Participant `Allowlist` for Stabilization Period**

A new governance vote is currently active following the successful adoption of the patch that resolved the PoC-related consensus failure.

With normal block production restored, the network is entering a short stabilization period ahead of further growth.

This vote defines a participant's `allowlist` ([https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)) for the stabilization window, reflecting the set of participants whose behavior has remained consistent with network expectations.

**Scope of the Vote**

If approved, the network will temporarily operate with an `allowlist` comprising participants who have not demonstrated non-standard hardware behavior in previous epochs. In practice, the `allowlist` corresponds to participants for whom, across multiple epochs:

- Reported hardware characteristics were evaluated against a predefined set of commonly observed hardware configuration patterns, used to identify deviations and inconsistencies (the exact list of non-standard configuration strings is available here: [https://github.com/product-science/filter/blob/main/filter_strings.txt](https://github.com/product-science/filter/blob/main/filter_strings.txt)), and
- Observed PoC weight stayed below 150% of the weight demonstrated by other participants using comparable hardware.
Participants that previously exhibited persistent deviations from these patterns are not part of the `allowlist` until the stabilization window concludes at block 2222222.

**Reproducibility and methodology**

The `allowlist` is derived from publicly observable on-chain data using a predefined set of hardware configuration patterns. These patterns are evaluated using open-source scripts available here: [https://github.com/product-science/filter](https://github.com/product-science/filter)

The `allowlist` is available here: [https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)

**Execution characteristics**

- The `allowlist` takes effect automatically if the proposal is approved.
- No software upgrade is needed.
- The `allowlist` becomes active during the next PoC following a successful vote, expected at block: 2089140.
- From that point, the `allowlist` remains in effect up to and including block ​​2222222.
- Further adjustments, if needed, remain subject to governance.

**After the stabilization window**

The `allowlist` is defined with a fixed expiration and does not persist beyond the stabilization window. Once the `allowlist` expires at block 2222222:

- The network reverts to the standard participation rules in effect prior to the stabilization period, or
- Any alternative configuration must be defined through a separate governance decision.

**How to Vote**

You can fetch the proposal details and cast your vote using the `inferenced` command.
Please note that any active node can be used to query or cast a vote. Currently available nodes include:

- http://node1.gonka.ai:8000/
- http://node2.gonka.ai:8000/
- https://node4.gonka.ai/

To check the voting status:
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 20 -o json --node $NODE_URL/chain-rpc/
```

To vote ( `yes` , `no` , `abstain` , `no_with_veto` ):
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced tx gov vote 20 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```
**Next steps after the vote**

This process is handled entirely through governance and does not require a software upgrade.

**Timelines and Deadlines**

- Voting ends: January 10th, 2026, at 06:46:52 UTC.
- `Allowlist` activation: After the next PoC execution at block 2089140.
- `Allowlist` expiration: Automatically at block 2222222.
  
Please take a look and vote if you're a host.

## January 8, 2026

**Network Update — Consensus Restored**

Following the deployment of the patch, network consensus has stabilized and is now operating within normal parameters.

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
