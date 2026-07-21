# Announcements

!!! note "About this page"

    This page is maintained and updated by community members.
   
    To publish an announcement, for example, about a governance vote you started, please open a pull request in the gonka-docs repository: [https://github.com/gonka-ai/gonka-docs](https://github.com/gonka-ai/gonka-docs)
   
    This page is not guaranteed to be exhaustive. For the latest information, including governance vote launches and their current status, refer to on-chain data or check available explorers and dashboards.

## July 20, 2026

**v0.2.14 Upgrade Proposal Enters Governance**

[The v0.2.14 proposal](https://github.com/gonka-ai/gonka/pull/1267) is now on-chain and open for voting.

The mainnet chain/API work focuses on PoC duplicate-artifact protection, early share detection, classic inference API deprecation (disabling `/v1/chat/completions` billing on mainnet and removing embedded `/v1/devshard` from the API binary), reward recipient routing, and upgrade-time safety fixes.

The devshard part prepares the v3 runtime so brokers can serve inference during the chain upgrade without depending on the deprecated classic API path, improving RAM utilization and enabling safe switching between SQLite and Postgres storage.

For more details, please see the pull request: [https://github.com/gonka-ai/gonka/pull/1267](https://github.com/gonka-ai/gonka/pull/1267)

**Upgrade Plan**

The node binary is upgraded through an on-chain software upgrade proposal. Existing hosts are not required to manually update their `api` or `node` containers as part of the upgrade.

**How to vote**

If you do not have direct access to the key that holds voting power, or want another key to vote on your behalf, please refer to [the guide](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf) on granting governance voting permission from a cold key to a warm key.

Proposal details and voting are available via `inferenced`. Any active node can be used. Available nodes include:

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai
  
Cast your vote (`yes`, `no`, `abstain`, `no_with_veto`): The `--unordered` and `--timeout-duration` flags require `inferenced` from v0.2.12 or later.
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 89 yes \
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
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 89 -o json --node $NODE_URL/chain-rpc/
```

**Required actions in preparation for the upgrade**

In case the proposal is approved, the following preparation is recommended.

- Now / before the mainnet upgrade — update your API and bridge. To keep the Ethereum bridge stable during the mainnet upgrade, update the `api` binary and the bridge image to 0.2.14 ahead of time, following [the guide](https://gonka.ai/docs/FAQ/#upgrade-v0214-pre-upgrade-api-and-bridge-update). If your `api` binary is already updated, you only need to update the bridge image and restart the bridge container. If you have already completed both steps, you do not need to repeat them. If you have multiple nodes, update them one by one, and perform this step outside of PoC or cPoC.

- Dashboard maintainers — no existing query endpoint was removed or reshaped in this upgrade. If your dashboard reads values from the chain and displays them, it keeps working. There is one semantic change you need to understand (delegation), and three small notes (read the full guide: [https://gonka.ai/docs/dashboard-maintainer-memo-v0.2.14/](https://gonka.ai/docs/dashboard-maintainer-memo-v0.2.14/))
  
**Deadlines**

- Voting ends: July 23, 2026 at 00:02 UTC / July 22, 2026 at 17:02 PDT
- Proposed upgrade height: 5195700 
- Estimated upgrade time: July 23, 2026 at 03:45 AM UTC / July 22, 2026 at 8:45 PM PDT 

**Attention**

- Please plan to be online during the upgrade window so that any follow-up steps or mitigation instructions can be applied promptly.
- During upgrades, Cosmovisor creates a full state backup in the `.inference/data` directory; ensure sufficient disk space is available (the Cosmovisor backup of `application.db` on mainnet is typically tens of GB, so verify in advance). Guidance on safely removing old backups from the `.inference` directory is available in [the documentation.](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)
- If `application.db` occupies a significant amount of disk space, the cleanup techniques described in the cosmovisor backup [guide](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it) may be applied.
- If approved, devshard storage could optionally be backed by a shared Postgres instance after the upgrade (same env vars as payload storage). Local SQLite would remain the default and would prune automatically (last 3 epochs retained).

## July 20, 2026

**[The PR for the devshard-only](https://github.com/gonka-ai/gonka/pull/1482) upgrade is now open for review**

Devshard upgrades update the devshard runtime independently from the main blockchain. They do not require a coordinated full-node upgrade through Cosmovisor, do not affect mainnet behavior, and are not expected to cause downtime for inference serving. If approved through the governance process, the new devshard version will run in parallel with the existing v3 runtime.

**Key changes**

- The main intent of v4 is high availability of devshard hosts on host failures and upgrades. It can keep serving new requests if one machine is down or restarting, and on version upgrades multiple machines replace versions one by one. This is the first update in a series of devshard and network-node changes that refactor the monolith toward a high-availability, fault-tolerant, scalable architecture.
- v4 is the first version intended for multi-instance HA: N versiond / devshardd replicas behind versiond-router on shared Postgres, with sticky session routing and validation-lease exclusivity. The gateway talks to the chain over gRPC only. Public observability is versionless (/devshard/sessions|stats|metrics); only the escrow owner binds via signed chat. When governance publishes a new binary under the same version name (name unchanged, only sha256 changes), versiond can blue/green swap with drain so in-flight work (including SSE) finishes on the old generation.
- v4 also lands bug and security fixes.
  
**Action items**

Please review the PR [https://github.com/gonka-ai/gonka/pull/1482](https://github.com/gonka-ai/gonka/pull/1482) and leave comments on any findings, questions, suggested improvements, edge cases, or potential vulnerabilities.

Meaningful review contributions, including important comments, bug findings, and security issues, may be eligible for community bounties in the next upgrade cycle.

This is a call for PR review only. It does not start formal voting. 

## July 16, 2026

**Proposal 88 has passed: Kimi-K2.6 re-registered, devshard v1/v2 removed**

The expedited proposal 88 was approved on-chain.

**Kimi-K2.6 bootstrap (epoch 331)**

`moonshotai/Kimi-K2.6` is back in the governance model list and enters the standard bootstrap flow.

* Declare intent before block **5,105,276** (July 17, ~12:05 UTC):
```
./inferenced tx inference declare-poc-intent moonshotai/Kimi-K2.6
```
* Switch your MLNode to Kimi in the ~500-block window before epoch 331 PoC starts (block **5,105,776** — July 17, 12:50:53 UTC / 05:50 PDT).
* Delegating hosts: pick non-guardian Kimi hosts and spread weight across independent targets —  see the [Multi-Model PoC guide](https://gonka.ai/docs/host/multi_model_poc/).

**Devshard v1/v2 removed**

`versiond` has stopped the v1 and v2 `devshardd` processes. All gateway traffic must use `/devshard/v3`. If your gateway stopped serving inference after this change, you are still routing through a removed path — follow the v3 migration guide. 

## July 16, 2026

**Expedited governance vote (proposal 88): re-register Kimi-K2.6 and remove devshard v1/v2 runtimes**

This is the second step of the Kimi recovery plan announced on July 15. Proposal 87 removed `moonshotai/Kimi-K2.6` from the active set; proposal 88 re-registers it in the governance model list so it goes through the standard bootstrap starting at epoch 331.

The same proposal removes `approved_versions` v1 and v2 from `devshard_escrow_params`. Once approved, `versiond` stops the v1 and v2 `devshardd` processes and only the v3 runtime (`/devshard/v3`) keeps running. This removes the long-running RAM growth of the older runtime containers — the issue behind the network node OOM in the July 15 incident.

**This makes the v3 switch final.** Gateways still routing through v1/v2 prefixes or the classic `/v1/devshard` path will stop serving inference after the proposal passes.

**Required actions for hosts**

1. Vote on proposal 88 before the deadline — the expedited window is short.
2. Hosts serving Kimi: declare intent for `moonshotai/Kimi-K2.6` right **after the end of voting** and before block **5,105,276** (July 17, ~12:05 UTC), then switch your MLNode back in the ~500-block window before epoch 331 PoC starts (block **5,105,776**, July 17, ~12:50 UTC):
```
./inferenced tx inference declare-poc-intent moonshotai/Kimi-K2.6
```
3. When delegating for the bootstrap: **do not delegate to guardian nodes**; spread delegations across independent Kimi hosts. See the  [Multi-Model PoC guide](https://gonka.ai/docs/host/multi_model_poc/) for updated delegation guidance.
4. Brokers / devshard creators: if any of your gateway traffic is still on v1/v2 or `/v1/devshard` — switch to `/devshard/v3` before the voting ends.

**How to vote**

If you do not have direct access to the key that holds voting power, or want another key to vote on your behalf, please refer to [the guide](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf) on granting governance voting permission from a cold key to a warm key.

Proposal details and voting are available via `inferenced`. Any active node can be used. Available nodes include:

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai

Cast your vote (`yes`, `no`, `abstain`, `no_with_veto`): The `--unordered` and `--timeout-duration` flags require `inferenced` from v0.2.13 or later.
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 88 yes \
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
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 88 -o json --node $NODE_URL/chain-rpc/
```

**Deadlines**

- Voting Time: 2026-07-16 11:09 ~ 2026-07-16 23:09 (PDT) / 2026-07-16 18:09 ~ 2026-07-17 06:09 UTC (expedited, 0.667 yes-threshold; turnout matters, vote promptly).
- Intent deadline (epoch 330): block **5,105,276** — July 17, ~12:05 UTC (~05:05 PDT).
- Epoch 331 PoC starts: block **5,105,776** — July 17, 12:50 UTC (05:50 PDT).

More on how the bootstrap works: [https://gonka.ai/docs/host/kimi-bootstrap/](https://gonka.ai/docs/host/kimi-bootstrap/)

## July 15, 2026

**Expedited governance vote (proposal 87): remove Kimi-K2.6 for a fast re-bootstrap**

`moonshotai/Kimi-K2.6` lost its PoC validation majority in epochs 328–329 (see the incident [details here](https://gonka.ai/docs/network-updates/#july-15-2026)). Removing Kimi from the active set now and re-bootstrapping it is the fastest way to bring it back with minimal downtime — the same recovery path as proposal 78 in June.

The proposal removes `moonshotai/Kimi-K2.6` from PoC params before the next PoC; a re-add follows immediately after, and Kimi goes through the standard bootstrap starting at epoch 331.

**Required actions for hosts**

1. Vote on proposal 87 before the deadline — the expedited window is short.
2. Hosts serving Kimi: keep your Kimi setup staged and be ready to switch your MLNode back at the bootstrap PoC.
3. When delegating for the bootstrap: do not delegate to guardian nodes; spread delegations across independent Kimi hosts.

**How to vote**

If you do not have direct access to the key that holds voting power, or want another key to vote on your behalf, please refer to [the guide](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf) on granting governance voting permission from a cold key to a warm key.

Proposal details and voting are available via `inferenced`. Any active node can be used. Available nodes include:

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai
  
Cast your vote (`yes`, `no`, `abstain`, `no_with_veto`): The `--unordered` and `--timeout-duration` flags require `inferenced` from v0.2.13 or later.
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 87 yes \
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
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 87 -o json --node $NODE_URL/chain-rpc/
```

**Deadlines**

* Voting Time: 2026-07-15 17:01 ~ 2026-07-16 05:01 (PDT) / 2026-07-16 00:01 ~ 2026-07-16 12:01 UTC (expedited, 0.667 yes-threshold; turnout matters, vote promptly).
* Bootstrap intent deadline and epoch timings follow in the bootstrap instructions.

## July 15, 2026

**Kimi-K2.6 incident (epochs 328–329): what happened, recovery plan, and a change in delegation guidance**

In epoch 328, `moonshotai/Kimi-K2.6` lost its PoC validation majority. Hosts serving Kimi were knocked out of the group at the start of epoch 329. The rest of the network kept operating normally.

**What happened**

Two guardian-operated servers running Kimi failed at the same time:

* On one server, the MLNode running Kimi died due to a provider-side issue. A large share of Kimi delegations was concentrated on this host, so its failure removed those votes at once.
* The second server lost its network node to an out-of-memory condition.

Kimi's validation votes had been close to the 2/3 threshold the whole time, so this was enough to drop the group below the majority. The guardian tiebreaker did not engage: guardians without per-model voting weight are currently filtered out of the tiebreaker. This is a known issue, fixed in the upcoming v0.2.14 upgrade.

This situation is similar to the epoch 306–307 incident. Exact details of the votes at the start of epoch 329 are still being confirmed; minor corrections to this summary are possible.

**Recovery plan**

The safest way to restore Kimi is to re-add it through a fresh bootstrap (~1.5 epochs):

1. [Today] An expedited proposal removes Kimi before the next PoC and re-adds it immediately after. A separate announcement with the proposal ID, voting commands, and deadlines follows.
2. [Tomorrow] Kimi goes through the standard bootstrap flow again: declare intent, deploy window, PoC store commit. Instructions will be published before the intent deadline.

**Change in delegation guidance — please read**

Earlier guidance (including the June 27, 2026, bootstrap announcement) suggested the guardian node as a delegation target. This recommendation is now withdrawn:

* **Do not delegate to guardian nodes.** Guardians are the fallback mechanism for PoC validation. Concentrating delegations on them ties the main mechanism and the fallback to the same hardware — this incident is exactly that failure mode. A protocol-level restriction is under discussion.
* **Avoid concentrating delegations on any single host.** Until percentage-based multi-host delegation is supported, spread delegations across several independent hosts that run the model. If you operate multiple nodes, delegate to your own node running the model.
* **If you can run Kimi directly — this is the biggest help.** More direct hosts means more validation weight and no single point of failure.

**Fixes already in the pipeline**

* Guardian voting in PoC validation (guardians can always vote) — v0.2.14.
* Self-delegation issue — v0.2.14.
* Nonce duplicates — v0.2.14 (currently handled by the earlier API update).
* RAM growth on network nodes — fixed in devshard v3; requires migration off v1/v2. After full migration, v1/v2 will be removed and `/v1/devshard` closed. Set separate memory limits for the `api` and `versiond` containers.

**Required actions for hosts**

1. Vote on the expedited Kimi proposal once it is on-chain (announcement follows).
2. If you plan to serve Kimi: watch for the bootstrap instructions and be ready to declare intent.
3. If you delegate for Kimi: pick a non-guardian delegate; spread weight across independent hosts where possible.
4. Brokers: migrate devshard traffic to `/devshard/v3` now. This fixes the RAM growth issue and is required before v1/v2 removal.
5. Check RAM on network nodes and set container memory limits (`api`, `versiond`).

## July 11, 2026

**The v0.2.13-devshard-v3 runtime upgrade proposal has passed governance**

The devshard v3 runtime has been approved on-chain and added to `DevshardEscrowParams.approved_versions`.

This proposal covered [the devshard v3 release.](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.14/proposals/governance-artifacts/update-v0.2.13-devshard-v3)

This is a devshard-only runtime upgrade. It operates independently of full-chain software upgrades and does not require a chain binary upgrade.

With the proposal approved, v3 now runs in parallel with the existing devshard runtimes. The new process is served under the `/devshard/v3` prefix, while existing devshard traffic can continue on earlier runtime prefixes until brokers switch traffic to v3.

The release publishes the `devshardd` binary as a Gonka release artifact. `versiond` automatically downloads the binary, verifies the sha256 hash, and starts an additional `devshardd` process inside the existing `versiond` container.

No mainnet restart or manual host steps are expected for this type of devshard-only runtime upgrade.

**Action items**

Whitelisted devshard creators should switch inference traffic to `/devshard/v3` before the mainnet v0.2.14 chain upgrade. This lets them keep serving inference while the chain upgrade runs, without depending on the deprecated classic API path.

**Key Changes**

- Prepared brokers to keep serving inference during the v0.2.14 chain upgrade without depending on the deprecated classic API path.
- Improved RAM utilization.
- Fixed gateway runtime behavior.
- Enabled safe switching between SQLite and Postgres storage.

## July 8, 2026

**The v0.2.13-devshard-v3 runtime upgrade proposal has entered governance**

This proposal covers [the devshard v3 release.](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.14/proposals/governance-artifacts/update-v0.2.13-devshard-v3)

This is a devshard-only upgrade. It operates independently of full chain software upgrades. Once approved, v3 runs in parallel with the existing devshard runtimes.

The v3 runtime prepares brokers to keep serving inference during the v0.2.14 chain upgrade without depending on the deprecated classic API path. It also improves RAM utilization, fixes gateway runtime behavior, and enables safe switching between SQLite and Postgres storage.

**Upgrade Plan**

The devshard runtime is upgraded through an on-chain params proposal, not a full chain software upgrade.

The proposal registers a new entry in `DevshardEscrowParams.approved_versions`:

- `name`: `v3`
- `binary`: `https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.13-devshard-v3.0.0/devshardd.zip`
- `sha256`: `ca1294fc8db3f0907a01f362eb4b13665f66d0fd12cfc6f01468b1e27f0bab63`
  
The release publishes the `devshardd` binary as a Gonka release artifact. If the on-chain proposal is approved, `versiond` automatically downloads the binary, verifies the sha256 hash, and starts an additional `devshardd` process inside the existing `versiond` container.
The new process is served under the `/devshard/v3` prefix. Existing devshard traffic can continue using earlier runtime prefixes until brokers switch traffic to v3. No mainnet restart or manual host steps are expected during this type of upgrade.

**How to vote**

If you do not have direct access to the key that holds voting power, or want another key to vote on your behalf, please refer to [the guide](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf) on granting governance voting permission from a cold key to a warm key.

Proposal details and voting are available via `inferenced`. Any active node can be used. Available nodes include:

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai
  
Cast your vote (`yes`, `no`, `abstain`, `no_with_veto`): The `--unordered` and `--timeout-duration` flags require `inferenced` from v0.2.13 or later.
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 83 yes \
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
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 83 -o json --node $NODE_URL/chain-rpc/
```
**Deadlines**

Voting ends: July 11th, 2026, at 06:41:34 UTC

## July 8, 2026

**PR Review for Upgrade v0.2.14**

[The pull request](https://github.com/gonka-ai/gonka/pull/PR) for the next on-chain software upgrade, v0.2.14, is open for review.

The mainnet chain/API work focuses on PoC duplicate-artifact protection, early share detection, classic inference API deprecation (disabling `/v1/chat/completions` billing on mainnet and removing embedded `/v1/devshard` from the API binary), reward recipient routing, and upgrade-time safety fixes.

The devshard part prepares the v3 runtime so brokers can serve inference during the chain upgrade without depending on the deprecated classic API path, improving RAM utilization and enabling safe switching between SQLite and Postgres storage.

**Upgrade Plan**

The node binary is upgraded through an on-chain software upgrade proposal. Existing hosts are not required to manually update their `api` or `node` containers as part of the upgrade.
A separate devshard v3 release from this branch will be proposed and rolled out before the mainnet chain upgrade. Brokers who switch inference traffic to `/devshard/v3` ahead of time can keep serving inference while the chain upgrade runs.

**Proposed Process**

1. Active hosts review this proposal on [GitHub.](https://github.com/gonka-ai/gonka/pull/PR)
2. The devshard v3 release is proposed and rolled out before the mainnet chain upgrade.
3. Brokers switch inference traffic to `/devshard/v3`.
4. If the on-chain proposal is approved, this PR will be merged immediately after the upgrade is executed on-chain.
5. Please review the PR code directly and leave comments regarding any findings, questions, suggested improvements, edge cases, or vulnerabilities you identify.

Meaningful review contributions, including important comments, bug findings, and security issues, may be eligible for community bounties during the next upgrade cycle.

This is a call for review of the Pull Request only, and it does not initiate formal voting. The governance voting process will begin after the review period concludes.

**Devshard v3 governance vote**

The devshard v3 release is proposed and rolled out ahead of the mainnet chain upgrade so brokers can move inference traffic to `/devshard/v3` before the upgrade runs.  

**Action items for Hosts**

1. Now — review the PR. Read PR #1267 on GitHub and leave comments on any findings, questions, suggested improvements, edge cases, or vulnerabilities.
2. Now / before the mainnet upgrade — update your API and bridge. To keep the Ethereum bridge stable during the mainnet upgrade, update the `ap`i binary and the bridge image to 0.2.14 ahead of time, following the guide. If your `api` binary is already updated, you only need to update the bridge image and restart the bridge container. If you have already completed both steps, you do not need to repeat them. If you have multiple nodes, update them one by one, and perform this step outside of PoC or cPoC.
3. Vote on devshard v3.
4. Brokers — switch inference traffic to `/devshard/v3`. Once the devshard v3 release is rolled out, move inference traffic to `/devshard/v3` so you can keep serving inference during the chain upgrade.
5. Dashboard maintainers — be ready to adjust how metrics are counted. Detailed instructions will be published later, after the `devshard v3` vote has launched and is successfully approaching its conclusion.

## July 6, 2026

**Security update: PoC-v2 weight validation hardening — update your API container**

Last week, a vulnerability was reported on HackerOne in the PoC-v2 weight path. A participant could inflate its compute weight, which drives block rewards, consensus voting power, and governance voting power.

Based on historical data, this attack had not been observed previously. However, in the current epoch, its use by the host `gonka1w7s4pharl5qs2lupxkuw2c0gzcls8chehwafg3` was detected.

A fix has already been prepared for the upcoming v0.2.14 chain upgrade, which will permanently close this issue. Since the attack is already in use, an API-only hotfix is available ahead of the upgrade — it can be deployed asynchronously and blocks the attack by strengthening PoC-v2 validation so replicated compute can no longer pass the sampling check. 

Please update your API container. 
Make sure to perform this step outside of PoC or cPoC.
To deploy (one machine at a time to reduce risk):
```
sudo rm -rf decentralized-api.zip .dapi/cosmovisor/upgrades/v0.2.13-post7/ .dapi/data/upgrade-info.json
sudo mkdir -p  .dapi/cosmovisor/upgrades/v0.2.13-post7/bin/
wget -q -O  decentralized-api.zip 'https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.13-post7/decentralized-api-amd64.zip' && \
echo "55de4023119d103683cdbfa41c204274d3189636e4119ea3a2d8afdfa0a6fa47  decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j  decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.13-post7/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.13-post7/bin/decentralized-api && \
echo "API Installed and Verified"  && \

docker stop api && \
sudo rm -rf .dapi/cosmovisor/current && \
sudo ln -sf upgrades/v0.2.13-post7 .dapi/cosmovisor/current && \
echo "e97d89cfaca98547b5966a87bd99ec6faab9df9eda1782f584a36d49237c01e6  .dapi/cosmovisor/current/bin/decentralized-api" | sha256sum --check && \
docker start api
```

## June 27, 2026

**Kimi-K2.6 bootstrap: next attempt at epoch 311**

`moonshotai/Kimi-K2.6` runs another bootstrap attempt at epoch 311. Hosts that want to serve Kimi need to declare their intent during epoch 310 and get their node ready before the new epoch starts. A guardian node will also run Kimi, so hosts that prefer not to run it can delegate to it instead.

**Hosts that will run Kimi**

1. Declare PoC intent during epoch 310, before block **4,797,456** (around June 28, ~12:00 UTC):
```
./inferenced tx inference declare-poc-intent moonshotai/Kimi-K2.6
```
2. If enough hosts declare intent, switch your node to Kimi in the ~500-block window before epoch 311 starts (PoC start around June 28, ~12:47 UTC).

**Hosts that will not run Kimi**

Delegate your weight to a host that runs Kimi (or send a refusal):
```
./inferenced tx inference set-poc-delegation moonshotai/Kimi-K2.6 <DELEGATEE>
```
~~The guardian node `gonka1kx9mca3xm8u8ypzfuhmxey66u0ufxhs7nm6wc5` will run Kimi and can be used as the delegation target.~~

> **Update (July 15, 2026): this recommendation is withdrawn — do not delegate to guardian nodes.** Guardians are the fallback mechanism for PoC validation and must stay independent from delegations. Pick a non-guardian host that runs the model, and avoid hosts that are already major delegation targets. See the [Multi-Model PoC guide](https://gonka.ai/docs/host/multi_model_poc/) for updated delegation guidance.

**Key timings**

* Intent deadline (epoch 310): block **4,797,456** — around June 28, ~12:00 UTC.
* Epoch 311 starts: block **4,797,956** — around June 28, ~12:47 UTC.

More on how the bootstrap works: [https://gonka.ai/docs/host/kimi-bootstrap/](https://gonka.ai/docs/host/kimi-bootstrap/)

## June 26, 2026

**Expedited governance vote 79: restore `moonshotai/Kimi-K2.6` and add `GLM-5.2`**

**Key changes**

**1. Get back `Kimi-K2.6`**

`Kimi-K2.6` is added back with `weight_scale_factor=0.9`.This factor is chosen so that on an 8xB300 Kimi gives about the same consensus weight as the primary model MiniMax. It is not meant to favor any hardware — the same weight is already available on MiniMax. There is a  ~1% gain for 8xB300 hosts that run Kimi instead of MiniMax.
This approach makes Kimi a good fit for 8xB200 and 8xB300 servers.

Estimated consensus weight by hardware type: 
[https://docs.google.com/spreadsheets/d/1yQ-8UHnHC5pvqd6uDB1dRPzHJ2qfJoQrXssXIGi8QMg/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1yQ-8UHnHC5pvqd6uDB1dRPzHJ2qfJoQrXssXIGi8QMg/edit?usp=sharing)

The usual bootstrap procedure starts from epoch 309. As the vote concludes ~1 hour before PoC,  submit `MsgDeclarePoCIntent` right after the voting ends.
More about bootstrap: https://gonka.ai/docs/host/kimi-bootstrap/

**2. Add `GLM-5.2`**

`GLM-5.2` is added with `weight_scale_factor=2.47` and `penalty_start_epoch=500` (this effectively turns off the non-participation penalty for this model). The factor is chosen so that on an 8xB300 GLM-5.2 gives about the same consensus weight as MiniMax. It is not meant to favor any hardware. There is a ~2% gain for 8xB300 hosts that run GLM-5.2 instead of MiniMax.
This approach makes it a good fit for 8xB300 servers.

Estimated consensus weight by hardware type: 
[https://docs.google.com/spreadsheets/d/1yQ-8UHnHC5pvqd6uDB1dRPzHJ2qfJoQrXssXIGi8QMg/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1yQ-8UHnHC5pvqd6uDB1dRPzHJ2qfJoQrXssXIGi8QMg/edit?usp=sharing)

The MLNode version and instructions will be posted after the voting ends.

**How the bootstrap works**

Both models enter through the standard bootstrap flow, so hosts can see their viability before committing hardware:

1. **Declare intent.** Hosts that plan to serve Kimi or GLM-5.2 submit `MsgDeclarePoCIntent` for that model before the bootstrap snapshot at `start_poc - deploy_window`.
   
2. **Pre-eligibility snapshot.** At `start_poc - deploy_window`, the chain snapshots intents and delegations, and emits advisory pre-eligibility events (governance approval, weight threshold `W_threshold`, minimum members `V_min`, and >2/3 reachability). This lets operators confirm that a model looks viable before provisioning.
   
3. **Deploy window.** Hosts that declared intent provision their MLNode for the model during the deploy window.
   
4. **PoC start.** Membership is determined by who actually submits a PoC store commit at PoC start - not by who declared intent. A model becomes active only if it meets the eligibility conditions.

**Effect if approved**

From epoch 309 (PoC start ~June 26, 15:25 UTC; effective ~16:00 UTC), subject to each model meeting bootstrap eligibility:

* `moonshotai/Kimi-K2.6` is an active PoC model again.
* `zai-org/GLM-5.2-FP8` is available as an optional PoC model with no non-participation penalty.
* `MiniMaxAI/MiniMax-M2.7` remains the base model.

**Why expedited**

The proposal must conclude before epoch 308 ends so both models can bootstrap into epoch 309. At ~22.8h per epoch, the standard 48h voting period does not fit within a single epoch; the 12h expedited period does. Genesis guardians are expected to support the proposal.

**Required actions for hosts**

1. **To serve Kimi:** Declare intent for `moonshotai/Kimi-K2.6` right **after the end of voting**. Then, switch your MLNode to it for PoC 309. There is a ~500-block safety window before PoC starts, during which it is safe to switch, as there is no cPoC during that window.

2. **To serve GLM-5.2:** Declare intent for `zai-org/GLM-5.2-FP8` and provision your MLNode during the deploy window. Serving it is voluntary - hosts that do not opt in incur no penalty.

3. **To stay on MiniMax:** Keep serving `MiniMaxAI/MiniMax-M2.7` - no action needed.

4. **Vote on proposal 79 before the deadline.** The expedited window is short.

**How to vote**

If you do not have direct access to the key that holds voting power, or want another key to vote on your behalf, refer to [the guide](https://gonka.ai/docs/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf) on granting governance voting permission from a cold key to a warm key. Proposal details and voting are available via `inferenced`. Any active node can be used:

* http://node1.gonka.ai:8000
* http://node2.gonka.ai:8000
* https://node3.gonka.ai

Cast a vote (`yes`, `no`, `abstain`, `no_with_veto`):
```
    export NODE_URL=https://node3.gonka.ai/
    ./inferenced tx gov vote 79 yes \
    --from <cold_key_name> \
    --keyring-backend file \
    --unordered \
    --timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
    --node $NODE_URL/chain-rpc/ \
    --chain-id gonka-mainnet \
    --yes
```
To check voting status:
```
    export NODE_URL=https://node3.gonka.ai/
    ./inferenced query gov votes 79 -o json --node $NODE_URL/chain-rpc/
```
**Deadlines**

* Proposal 79 voting ends: *June 26th, 2026, at 14:18:58 UTC* (expedited).
* Expedited proposals require a 0.667 yes-threshold; turnout matters, so please vote promptly.

## June 25, 2026

**Proposal 78 passed: `MiniMaxAI/MiniMax-M2.7` is now the sole PoC model; Kimi K2.6 and Qwen3-235B removed**

The expedited vote on proposal 78 has passed. The changes are live from epoch 308.

**What is now in effect**

1. The delegation `initial_model_id` is set to `MiniMaxAI/MiniMax-M2.7` — MiniMax is the base model.
2. `MiniMaxAI/MiniMax-M2.7` is the only model in PoC params.
3. `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` and `moonshotai/Kimi-K2.6` are removed from PoC params.
4. `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` and `moonshotai/Kimi-K2.6` are deleted from governance models.

As of epoch 308, `MiniMaxAI/MiniMax-M2.7` is the only active PoC model. Qwen3-235B and Kimi K2.6 are no longer active.

**Required actions for hosts**

* Make sure your MLNode is serving `MiniMaxAI/MiniMax-M2.7`. Any host still on Qwen or Kimi will not receive cPoC for this epoch until it switches.
* Hosts that intend to serve Kimi again should keep their Kimi setup staged and be ready to switch the MLNode back at PoC 309 — a vote to restore Kimi follows during epoch 308.

**Coming next**

A single expedited vote during epoch 308 will bundle two changes, both taking effect at epoch 309 (PoC start ~June 26, 15:25 UTC):

* **Restore Kimi K2.6** — re-add Kimi and restart its bootstrap.
* **Add GLM-5.2** — add GLM-5.2 **without a non-participation penalty**, so hosts can opt in and demand for the model can be measured in advance, with no penalty for hosts that choose not to serve it.

## June 25, 2026

**Expedited governance vote (proposal 78): MiniMax-M2.7 becomes the sole PoC model; Kimi K2.6 removed for a fast re-bootstrap; Qwen3-235B retired**

`moonshotai/Kimi-K2.6` currently does not have sufficient votes for PoC validation. As a result, the participants serving Kimi were knocked out of the group, and Kimi cannot enter the next epoch. Removing Kimi from the active set now and re-bootstrapping it is the fastest way to bring it back with minimal downtime.

An expedited proposal is now on-chain so these changes can take effect before the next epoch starts.
On-chain, the proposal does the following in a single vote:
1. Sets the delegation `initial_model_id` to `MiniMaxAI/MiniMax-M2.7`, making MiniMax the base model.
2. Keeps only `MiniMaxAI/MiniMax-M2.7` in PoC params.
3. Removes `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` and `moonshotai/Kimi-K2.6` from PoC params.
4. Deletes `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` and `moonshotai/Kimi-K2.6` from governance models.

**What each change is for**

* **Kimi K2.6 — removed to restore it quickly.** Because Kimi does not have sufficient votes for PoC validation, taking it out and re-bootstrapping it is the fastest path back with minimal downtime. A vote to restore Kimi follows in the next epoch.
* **Qwen3-235B — retired (separate, unrelated change).** Retiring the older Qwen3-235B is an independent, previously-requested lineup change. It is not related to the Kimi situation and is included here only because it is also a PoC lineup change.
* **MiniMax-M2.7 — promoted to the base model.**

The changes are bundled into one expedited vote because the reset must conclude before epoch 307 ends. At ~22.9h per epoch, the standard 48h voting period does not fit inside one epoch; the 12h expedited period does. Genesis guardians are expected to support the proposal.

**Effect if approved**

Starting at epoch 308 (~June 25, 17:25 UTC), `MiniMaxAI/MiniMax-M2.7` is the only active PoC model. Qwen3-235B and Kimi K2.6 are no longer active. Restoring Kimi is handled in a follow-up vote in the next epoch.

**Required actions for hosts**

1. **Switch your MLNode to `MiniMaxAI/MiniMax-M2.7` before PoC 308 starts.** Every host — including hosts currently on Qwen or Kimi — must switch their MLNode to MiniMax. There is a ~500-block window before PoC starts in which it is safe to switch, as there is no cPoC. Pre-download the FP8 weights now if they are not already staged, to avoid Hugging Face rate limits at the epoch boundary.
2. **Vote on proposal 78 before the deadline.** The expedited window is short.
3. Hosts that plan to serve Kimi again should still switch their MLNode to MiniMax now, but be ready to switch it back at PoC 309 — a vote to restore Kimi follows in epoch 308.


**Coming next**

* **Restore Kimi K2.6** — a follow-up vote in epoch 308 to re-add Kimi and restart its bootstrap.
* **GLM-5.2** — a follow-up proposal will add GLM-5.2 **without a non-participation penalty**, so hosts can opt in and demand for the model can be tested in advance, with no penalty for hosts that choose not to serve it.

**How to vote**

If you do not have direct access to the key that holds voting power, or want another key to vote on your behalf, refer to the [guide](https://gonka.ai/docs/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf) on granting governance voting permission from a cold key to a warm key. Proposal details and voting are available via `inferenced`. Any active node can be used:

* http://node1.gonka.ai:8000
* http://node2.gonka.ai:8000
* https://node3.gonka.ai

Cast a vote (`yes`, `no`, `abstain`, `no_with_veto`):
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 78 yes \
--from <cold_key_name> \
--keyring-backend file \
--unordered \
--timeout-duration=60s --gas=2000000 --gas-adjustment=5.0 \
--node $NODE_URL/chain-rpc/ \
--chain-id gonka-mainnet \
--yes
```

To check voting status:
```
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 78 -o json --node $NODE_URL/chain-rpc/
```

**Deadlines**

* Proposal 78 voting ends: **June 25, 2026, 15:39:53 UTC** (expedited).
* Epoch 308 forms shortly after: PoC start ~16:50 UTC, effective ~17:25 UTC.
* Expedited proposals require a 0.667 yes-threshold; turnout matters, vote promptly.

## June 22, 2026

**The v0.2.13-devshard-v2 runtime upgrade proposal has passed governance**

The devshard v2 runtime has been approved on-chain and added to `DevshardEscrowParams.approved_versions`.

This proposal covered the devshard v2 release: [https://github.com/gonka-ai/gonka/releases/tag/release/devshard/v2.0.0](https://github.com/gonka-ai/gonka/releases/tag/release/devshard/v2.0.0)

This was the first devshard-only runtime upgrade. It operates independently of full-chain software upgrades and does not require a chain binary upgrade.

With the proposal approved, v2 can now run in parallel with the existing v1 devshard runtime. The new process is served under the `/devshard/v2` prefix, while existing v1 traffic continues on `/devshard/v1` and `/v1/devshard`.

The release publishes the `devshardd` binary as a Gonka release artifact. `versiond` automatically downloads the binary, verifies the sha256 hash, and starts an additional `devshardd` process inside the existing `versiond` container.

No node container restart or manual host steps are expected for this type of devshard-only runtime upgrade.

**Key Changes**

1) Removed the seed reveal round, sealed completed inference stats, and pruned payloads so long-running sessions do not keep all served inferences in RAM or state.
2) Added internal devshard traces and metrics through OpenTelemetry and Prometheus.
3) Added join-stack observability with Grafana, Jaeger, Prometheus, Loki, Promtail, and cAdvisor.
4) Moved per-inference validation counters outside the state root into SQLite/Postgres and exposed per-slot totals through devshard stats endpoints after inference pruning.
5) Pruned old epoch storage on epoch changes, moved SQLite/Postgres schema setup out of hot paths, and enforced selection of exactly one storage backend per process.

## June 15, 2026

**The v0.2.13-devshard-v2 runtime upgrade proposal has entered governance.**

This proposal covers the devshard v2 release: [https://github.com/gonka-ai/gonka/releases/tag/release/devshard/v2.0.0](https://github.com/gonka-ai/gonka/releases/tag/release/devshard/v2.0.0) 
This is the first devshard-only upgrade. It operates independently of full-chain software upgrades. If approved, v2 will run in parallel with the existing v1 devshard runtime.
See [the upgrade design doc](https://github.com/gonka-ai/gonka/blob/devshard-0.2.13-v2/devshard/docs/upgrade.md) and [the versioned package](https://github.com/gonka-ai/gonka/tree/devshard-0.2.13-v2/versioned) for details.

**Key Changes**

1. Remove the seed reveal round, seal completed inference stats, and prune payloads so long-running sessions do not keep all served inferences in RAM or state

2. Add internal devshard traces and metrics through OpenTelemetry and Prometheus

3. Add join-stack observability with Grafana, Jaeger, Prometheus, Loki, Promtail, and cAdvisor

4. Store per-inference validation counters outside the state root in SQLite/Postgres and expose per-slot totals through devshard stats endpoints after inference pruning

5. Prune old epoch storage on epoch changes, move SQLite/Postgres schema setup out of hot paths, and select exactly one storage backend per process

**Upgrade Plan**

The devshard runtime is upgraded through an on-chain params proposal, not a full chain software upgrade.

The proposal registers a new entry in `DevshardEscrowParams.approved_versions`.

The release publishes the `devshardd` binary as a Gonka release artifact. If the on-chain proposal is approved, `versiond` automatically downloads the binary, verifies the sha256 hash, and starts an additional `devshardd` process inside the existing `versiond` container.

The new process is served under the `/devshard/v2` prefix. Existing v1 devshard traffic continues on `/devshard/v1` and `/v1/devshard`. No node container restart or manual host steps are expected during this type of upgrade.

**How to vote**

If you do not have direct access to the key that holds voting power, or want another key to vote on your behalf, please refer to [the guide](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf) on granting governance voting permission from a cold key to a warm key.
Proposal details and voting are available via `inferenced`. Any active node can be used. Available nodes include:

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai
  
Cast your vote (`yes`, `no`, `abstain`, `no_with_veto`): The `--unordered` and `--timeout-duration` flags require `inferenced` from v0.2.13 or later.
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 76 yes \
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
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 76 -o json --node $NODE_URL/chain-rpc/
```
**Deadlines**

Voting ends:  June 17th, 2026, at 23:39:02 UTC

## June 6, 2026

**[The PR for the devshard-only upgrade](https://github.com/gonka-ai/gonka/pull/1289) is now open for review.**

This is the first devshard-only upgrade, so the process is different from a standard chain upgrade. Devshard upgrades update the devshard runtime independently from the main blockchain. They do not require a coordinated full-node upgrade through Cosmovisor, do not affect mainnet behavior, and are not expected to cause downtime for inference serving.

If approved through the governance process, the new devshard version will run in parallel with the existing v1 runtime.

Please review the PR directly and leave comments on any findings, questions, suggested improvements, edge cases, or potential vulnerabilities.

Meaningful review contributions, including important comments, bug findings, and security issues, may be eligible for community bounties in the next upgrade cycle.

This is a call for PR review only. It does not start formal voting. The governance voting process will begin after the review period concludes.

## May 28, 2026

**MiniMax-M2.7 is now active on Gonka network**

The bootstrap stage announced in v0.2.13 is complete. As of chain epoch 278, MiniMaxAI/MiniMax-M2.7 joins Qwen3-235B and Kimi K2.6 as an active model group, and PoC weight earned in the MiniMax group is now being converted into consensus weight at the calibrated coefficient 0.3024.

Per-model participation enforcement for MiniMax is now in effect. Hosts that have already chosen DIRECT, DELEGATE or REFUSE for MiniMax do not need to do anything else — the same setup keeps working. Hosts that have not yet made a choice are encouraged to do so now to avoid the per-epoch penalty ([https://gonka.ai/docs/host/quickstart/#optional-poc-delegation-and-refusal](https://gonka.ai/docs/host/quickstart/#optional-poc-delegation-and-refusal)).

## May 26, 2026

**UPGRADE EXECUTED: v0.2.13 is now live on mainnet**

The on-chain governance vote for Upgrade Proposal v0.2.13 (proposal id 54) has concluded. 
The proposal was APPROVED, and the upgrade was successfully executed on the mainnet at block `4267300`.

## May 25, 2026 

**Upgrade v0.2.13: pre-download binaries and MiniMax-M2.7 weights**

The v0.2.13 upgrade proposal (proposal id  (https://github.com/gonka-ai/gonka/pull/1143)54) has passed on-chain governance and the upgrade is now scheduled.

• Upgrade height: 4267300
• Estimated upgrade time: May 26, 2026, 14:42 UTC (07:42 PDT)

Pre-downloading binaries and weights in advance helps avoid relying on GitHub / Hugging Face availability during the upgrade window.
```
# 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.13/bin \
              .inference/cosmovisor/upgrades/v0.2.13/bin && \
# 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.13/decentralized-api-amd64.zip" && \
echo "cf31fa4d715e721d1e17b7e2b46d628a0b66b6ef603d352d587abe1d57c40925 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.13/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.13/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \
# 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.13/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.13/inferenced-amd64.zip" && \
echo "ea7dea6c4e8d96ed61005bed196768cc9f44e5fb17f0714cb64d1d00a485be0c inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.13/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.13/bin/inferenced && \
echo "Inference Installed and Verified" && \
# 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.13/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.13/bin/inferenced && \
echo "f93d579ef9c46ade9f28c73c339df2f7ae73607115b7efeb849316984924f68d .dapi/cosmovisor/upgrades/v0.2.13/bin/decentralized-api" | sudo sha256sum --check && \
echo "e52b86c4f64a47f0ea9bdb3327feb321b8a4208a76b35d52a7e9ddd1b9d6eed5 .inference/cosmovisor/upgrades/v0.2.13/bin/inferenced" | sudo sha256sum --check
```


## May 22, 2026

**v0.2.13 voting concluded — preparing for upgrade at height 4267300** 

The on-chain governance vote for [Upgrade Proposal v0.2.13](https://github.com/gonka-ai/gonka/pull/1143) (proposal id `54`) has concluded. The proposal has been **APPROVED**.

The upgrade will execute automatically on mainnet at **block height 4267300** (≈ **Tue May 26, 14:42 UTC** / **07:42 PDT**).

**Reminders**

1. Make sure your bridge container is up to date and synced. The Ethereum mainnet bridge contract (`0x972a7a92d92796a98801a8818bcf91f1648f2f68`), USDC/USDT token metadata, and CW20 `wrapped_token` code id `105` are registered through the upgrade handler itself, so the bridge becomes active on mainnet at the upgrade height. Verification instructions: [https://gonka.ai/docs/network-updates/#may-7-2026](https://gonka.ai/docs/network-updates/#may-7-2026).
2. If you plan to serve `MiniMaxAI/MiniMax-M2.7`, pre-download the ~230 GB of FP8 weights now. Hugging Face rate limits and bandwidth saturation during the bootstrap window might lead to missing the first eligibility check.
3. Right after the upgrade lands, every host will need to declare a participation mode for **each** governance-approved model — `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`, `moonshotai/Kimi-K2.6`, and `MiniMaxAI/MiniMax-M2.7`. Hosts who only run one or two of those models still need DELEGATE or REFUSE for the others. The MiniMax deadline is **chain epoch `278`**. Hosts who do nothing take a 15% per-epoch penalty against their full weight from epoch 278 onward.
4. Plan to be online during the upgrade window so any follow-up steps or mitigation instructions can be applied promptly. Make sure `.inference/data` has sufficient free space for the cosmovisor state backup; if `application.db` is large, consider applying [the cleanup techniques](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it) from the cosmovisor backup guide before the upgrade.
5. The v0.2.13 calibration adjusts the Kimi K2.6 `WeightScaleFactor` from `1.26` to `0.78` to reflect the post-vLLM-0.20.1 throughput baseline of the Qwen-on-B200 reference. The adjustment applies **only to the Kimi-derived part of your consensus weight**; your Qwen-derived weight and Kimi internal PoC distribution are unchanged. On B200/B300 Kimi remains the highest-paying option; on H100/H200, MiniMax-M2.7 becomes a comparable-to-Qwen, higher-than-Kimi option.

- Proposal: [https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)
- Migration logic: [`upgrades.go`](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.13/inference-chain/app/upgrades/v0_2_13/upgrades.go)

## May 20, 2026

**v0.2.13 Upgrade Proposal Enters Governance**

[The v0.2.13 proposal](https://github.com/gonka-ai/gonka/pull/1143) is back on-chain and open for voting. This is a renewed vote on the proposal that was published earlier but did not pass, now resubmitted with several updates.

- Includes: Recalibrated weights for Kimi (`0.78`), new model `MiniMaxAI/MiniMax-M2.7`, validation thresholds update, devshard storage rework, plus several PoC/reward fixes.
- Activates the Ethereum bridge on mainnet (see dedicated section below).
- The proposal extends the post-upgrade grace window to 3000 blocks so hosts are not penalized while the new snapshot logic stabilizes.
- Governance: reduces genesis-guardian voting power to ~25% and sets the chain-wide quorum to 0.25. If guardians abstain, non-guardians need roughly ⅓ turnout among the remaining 75% to satisfy quorum (see inference-chain section).
- Required preparation: bridge container check, MiniMax decision, dashboard update, cast vote.
- Nothing on chain changes until and unless the proposal is approved.

The PR: [https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)

**Key changes**

**Models**

- Adds `MiniMaxAI/MiniMax-M2.7` as a governance-approved model and PoC model.
- Updates inference validation thresholds:
    - Qwen 235B: `0.940`
    - Kimi K2.6: `0.900`
    - MiniMax-M2.7: `0.922`
- Recalibrates `WeightScaleFactor` values against the Qwen-on-B200 reference after the vLLM 0.20.1 release:
    - Qwen 235B: `0.359` (unchanged)
    - Kimi K2.6: `0.78` (down from 1.26, roughly a 38% reduction in per-epoch consensus weight from Kimi at the same PoC weight)
    - MiniMax-M2.7: `0.3024`

Reference data: [https://docs.google.com/spreadsheets/d/1dHHlbhW1_hVgd7Q6MtmcVSOpmnl7NnynoTzPHJ1oU-g/edit?gid=0#gid=0](https://docs.google.com/spreadsheets/d/1dHHlbhW1_hVgd7Q6MtmcVSOpmnl7NnynoTzPHJ1oU-g/edit?gid=0#gid=0)

**inference-chain**

- Raises the devshard nonce limit from `20_000` to `1_000_000`.
- Raises the max devshards per epoch from `100` to `500_000`.
- Fixes confirmation PoC reward accounting during new-model bootstrap.
- Disables confirmation PoC for the rest of the upgrade epoch so the new snapshot logic starts cleanly from the next epoch.
- Resets `ConsecutiveInvalidInferences` when a participant becomes active again.
- Backfills missing `MsgRespondDealerComplaints` authz grants for DAPIs that joined before v0.2.12.
- Fixes a wiring issue that could cause intermittent permission errors in bridge and liquidity-pool contract calls.
- Reduces genesis guardian adjusted voting power to about 25% and sets the chain-wide governance quorum to `0.25`. With guardians not voting, this gives an effective 1/3 quorum among the remaining 75% of voting power (`0.25 / 0.75 = 0.334`).
- Add 4 early hosts & brokers to `allowed_creator_addresses`.

**Ethereum bridge mainnet activation**

- Activates Ethereum mainnet bridge setup through the upgrade handler.
- Registers the Ethereum bridge contract address `0x972a7a92d92796a98801a8818bcf91f1648f2f68`, USDC and USDT token metadata, bridge trading approvals, and CW20 `wrapped_token` code ID `105`.
- Once activated, the bridge enables cross-chain transfers between Gonka mainnet and Ethereum (including wrapping GNK on Ethereum and bridging USDC/USDT). Wrap/unwrap scripts and operator workflows will be documented separately.

**decentralized-api & devshard**

- Enables `NodeManagerGrpcPort` by default on port `9400`.
- Adds Postgres support for devshard state.
- Adds pruning for SQLite and Postgres devshard databases.
- Adds state snapshots for faster devshard startup and recovery.
- Fixes OpenAI-compatible API response parsing.
- Fixes long startup behavior and devshard invalidation flow edge cases.

**Upgrade plan**

If approved, the binary versions would be updated via the on-chain upgrade proposal. For more information on the upgrade process, refer to [/docs/upgrades.md.](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.13/docs/upgrades.md)

**Required actions in preparation for the upgrade**

In case the proposal is approved, the following preparation is recommended.

**`MiniMaxAI/MiniMax-M2.7` participation choice by epoch 278 (penalty starts then)**

For each governance-approved model, multi-model PoC requires every host to explicitly choose participation (DIRECT / DELEGATE / REFUSE). Doing nothing after the model's `PenaltyStartEpoch` would result in a penalty. At this stage, you should decide your preferred option in advance so you are ready to act quickly if the proposal passes and the upgrade is successfully applied on mainnet.   

**Bridge container update / verification**

All hosts are asked to verify that their bridge container is deployed, running the latest version, and synced correctly. Some hosts may already have the bridge container deployed. In that case, please first check that you are running the current version before taking any further action.
Please follow the instructions: [https://gonka.ai/docs/network-updates/#may-7-2026](https://gonka.ai/docs/network-updates/#may-7-2026)

**Dashboard / explorer update (before or after upgrade)**

Hosts are asked to update the dashboard/explorer. Please run the following commands from the `gonka/deploy/join` directory. If you do not have the `gonka` repository cloned locally, follow the join-network guide first. This dashboard update is just a container pull and is safe to run before or after the vote concludes, regardless of the outcome.
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

**How to vote**

If you do not have direct access to the key that holds voting power, or want another key to vote on your behalf, please refer to [the guide](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf) on granting governance voting permission from a cold key to a warm key.
Proposal details and voting are available via `inferenced`. Any active node can be used. Available nodes include:

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai

Cast your vote (`yes`, `no`, `abstain`, `no_with_veto`): The `--unordered` and `--timeout-duration` flags require `inferenced` from v0.2.12 or later.

```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 54 yes \
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
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 54 -o json --node $NODE_URL/chain-rpc/
```

**Deadlines**

- Voting ends: May 22, 2026, 22:12:25 UTC
- Proposed upgrade height: 4267300
- Estimated upgrade time: May 26, 2026, 14:42:02 UTC
- Timeline for operators: voting ends May 22, 22:12 UTC → upgrade height ~May 26 14:42 UTC → rest of the upgrade epoch runs with confirmation PoC skipped (≤ 10000-block grace window) → MiniMax bootstrap snapshot at start_poc − 500 blocks (~43 min before) → first MiniMax PoC stage at the next epoch boundary after the upgrade → MiniMax penalty enforcement at chain epoch 278.

**Attention**

- Please plan to be online during the upgrade window so that any follow-up steps or mitigation instructions can be applied promptly.
- During upgrades, Cosmovisor creates a full state backup in the `.inference/data` directory; ensure sufficient disk space is available (the Cosmovisor backup of `application.db` on mainnet is typically tens of GB, so verify in advance). Guidance on safely removing old backups from the `.inference` directory is available in [the documentation.](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)
- If `application.db` occupies a significant amount of disk space, the cleanup techniques described in the cosmovisor backup [guide](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it) may be applied.
- The proposal would intentionally skip Confirmation PoC from the upgrade height through the end of the upgrade epoch (10000-block grace window). If approved, this skip is expected and not a malfunction; the new snapshot logic would start from the next epoch.
- If approved, devshard storage could optionally be backed by a shared Postgres instance after the upgrade (same env vars as payload storage). Local SQLite would remain the default and would prune automatically (last 3 epochs retained).
- If the proposal fails (quorum not met, or `no_with_veto` exceeds ⅓), nothing on chain changes and the upgrade simply does not occur. Operators may see a `PROPOSAL_FAILED` status; this is expected and does not require action.

## May 18, 2026

The proxy container might limit the amount of parallel connections to devshards globally instead of per client

The PR with fix: [https://github.com/gonka-ai/gonka/pull/1183](https://github.com/gonka-ai/gonka/pull/1183)

To apply the fix, please:

1. Set container version in docker-compose.yml
```
...
  proxy:
    container_name: proxy
    image: ghcr.io/product-science/proxy:0.2.12-post5
...
```

2. Restart container:
```
source config.env && docker compose up -d proxy --force-recreate --no-deps
```

It's safer to update the container outside the PoC/Confirmation PoC phase. To check if there is a Confirmation PoC:
```
curl "https://node3.gonka.ai/v1/epochs/latest" | jq '.is_confirmation_poc_active'
```

## May 17, 2026

**Epoch #267: PoC Validation Recovered**

PoC validation completed successfully in epoch #267, and affected hosts were able to return to the active set.

The issue in epoch #266 was caused by an attack that affected hosts running the Kimi model. The network continued operating, but the attack, combined with several related conditions, prevented many participants from entering epoch #266.

Inference may be temporarily unavailable while additional protections are applied. Access is expected to return gradually, starting through several community proxy and broker endpoints.

**What happened**

In epoch #266, the network experienced a significant drop in active weight.

The issue has been traced to inference requests with non-standard semantics. This attack vector affected hosts running the Kimi model and disrupted PoC participation for many of them.

In epoch #267, hosts were able to return, and PoC validation completed successfully.

**Inference availability**

Requests using the affected non-standard semantics should no longer be accepted by the network.

While the relevant protections are being applied, inference may be temporarily unavailable. Access is expected to resume gradually, first through several community proxy and broker endpoints.

**Kimi weight in epoch #267**

Kimi’s active weight is lower in epoch #267 because of an existing protocol rule: the total weight of one model cannot exceed 75% of the total weight of all models in the previous epoch.

Since total active weight was significantly lower in epoch #266, this rule also limits Kimi’s weight in epoch #267.

It may take several days for the weight to stabilize as normal PoC participation continues across future epochs.

**Required actions for hosts**

1. Keep your API nodes online and accessible where possible. This helps preserve visibility into host participation and supports any follow-up review.
2. Monitor PoC participation in the next epochs. Check that your node enters PoC as expected and that active weight is reflected correctly.
3. Use only supported inference request formats. Do not send or route inference traffic with non-standard request semantics.
4. Expect temporary inference disruption. Access may not be available everywhere immediately and is expected to return gradually through community proxy and broker endpoints.
5. Share relevant logs or observations in the community channels or this thread. This is especially important if your host was affected in epoch #266 or behaves unexpectedly in the following epochs.

## May 16, 2026

**Epoch #266: PoC weight drop investigation**

During the current epoch (#266), the network saw a significant drop in active weight.
It appears that PoC voting did not collect the required votes for this epoch. The exact cause has not yet been confirmed, and the community is actively investigating the situation.

**For affected participants**

If your node did not make it into this epoch, please keep your API nodes online and accessible where possible.
This may help the Restitution Committee collect evidence of PoC participation and account for affected contributions more accurately.

**Investigation in progress**

Community members are currently reviewing what happened during epoch #266. Updates will be shared once there is more clarity on the root cause.
If you have relevant observations, logs, hypotheses, or other technical context that could help the investigation, please share them here. 

## May 15, 2026

**v0.2.13 Upgrade Proposal Enters Governance**

[v0.2.13 proposal](https://github.com/gonka-ai/gonka/pull/1143) is now on chain and open for voting.

- Includes: Recalibrated weights for Kimi (`0.78`), new model `MiniMaxAI/MiniMax-M2.7`, validation thresholds update, devshard storage rework, plus several PoC/reward fixes, Ethereum bridge mainnet activation.
- Proposal increases grace window after the upgrade to not punish hosts 3000 blocks after upgrade happens.
- Required preparation: bridge container check, MiniMax decision, dashboard update, cast vote.
- Nothing on chain changes until and unless the proposal is approved.

The PR: [https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)

**Key changes**

**Models**

- Adds `MiniMaxAI/MiniMax-M2.7` as a governance-approved model and PoC model.
- Recalibrates `WeightScaleFactor` values against the Qwen-on-B200 reference after the vLLM 0.20.1 release:
    - Qwen 235B: `0.359`
    - Kimi K2.6: `0.78`
    - MiniMax-M2.7: `0.3024`
    - Reference data: [https://docs.google.com/spreadsheets/d/1dHHlbhW1_hVgd7Q6MtmcVSOpmnl7NnynoTzPHJ1oU-g/edit?gid=0#gid=0](https://docs.google.com/spreadsheets/d/1dHHlbhW1_hVgd7Q6MtmcVSOpmnl7NnynoTzPHJ1oU-g/edit?gid=0#gid=0)
- Updates inference validation thresholds

**inference-chain**
  
- Raises the devshard nonce limit from `20_000` to `1_000_000`.
- Raises the max devshards per epoch from `100` to `500_000`.
- Fixes confirmation PoC reward accounting during new-model bootstrap.
- Disables confirmation PoC for the rest of the upgrade epoch so the new snapshot logic starts cleanly from the next epoch.
- Resets `ConsecutiveInvalidInferences` when a participant becomes active again.
- Backfills missing `MsgRespondDealerComplaints` authz grants for DAPIs that joined before v0.2.12.
- Fixes Wasm keeper access for bridge and liquidity-pool contract permission checks.
- Reduces genesis guardian adjusted voting power to about 25% and sets the chain-wide governance quorum to `0.25`. With guardians not voting, this gives an effective 1/3 quorum among the remaining 75% of voting power (`0.25 / 0.75 = 0.334`).

**Ethereum bridge mainnet activation**

- Activates Ethereum mainnet bridge setup through the upgrade handler.
- Registers the Ethereum bridge contract address `0x972a7a92d92796a98801a8818bcf91f1648f2f68`, USDC and USDT token metadata, bridge trading approvals, and CW20 `wrapped_token` code ID `105`.
  
**decentralized-api & devshard**

- Enables `NodeManagerGrpcPort` by default on port `9400`.
- Adds Postgres support for devshard state.
- Adds pruning for SQLite and Postgres devshard databases.
- Adds state snapshots for faster devshard startup and recovery.
- Fixes OpenAI-compatible API response parsing.
- Fixes long startup behavior and devshard invalidation flow edge cases.

**Upgrade plan**

If approved, the binary versions would be updated via the on-chain upgrade proposal. For more information on the upgrade process, refer to [/docs/upgrades.md.](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.13/docs/upgrades.md)

**Required actions in preparation for the upgrade**

In case the proposal is approved, the following preparation is recommended.

**`MiniMaxAI/MiniMax-M2.7` participation choice by epoch 278**

For each governance-approved model, multi-model PoC requires every host to explicitly choose participation (DIRECT / DELEGATE / REFUSE). Doing nothing after the model's `PenaltyStartEpoch` would result in a penalty. At this stage, you should decide your preferred option in advance so you are ready to act quickly if the proposal passes and the upgrade is successfully applied on mainnet.   

**Bridge container update / verification**

All hosts are asked to verify that their bridge container is deployed, running the latest version, and synced correctly. Some hosts may already have the bridge container deployed. In that case, please first check that you are running the current version before taking any further action.
Please follow the instructions: [https://gonka.ai/docs/network-updates/#may-7-2026](https://gonka.ai/docs/network-updates/#may-7-2026)

**Dashboard / explorer update (before or after upgrade)**

Hosts are asked to update the dashboard/explorer. Please run the following commands from the `gonka/deploy/join` directory:
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

**How to vote**

If you do not have direct access to the key that holds voting power, or want another key to vote on your behalf, please refer to [the guide](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf) on granting governance voting permission from a cold key to a warm key.

Proposal details and voting are available via `inferenced`. Any active node can be used. Available nodes include:

- http://node1.gonka.ai:8000
- http://node2.gonka.ai:8000
- https://node3.gonka.ai

Cast your vote (`yes`, `no`, `abstain`, `no_with_veto`):
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 52 yes \
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
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 52 -o json --node $NODE_URL/chain-rpc/
```

**Deadlines**

- Voting ends: May 17, 2026, 07:58:37 UTC
- Proposed upgrade height: 4133422
- Estimated upgrade time: May 18, 2026, 13:03:17 UTC

**Attention**

- Please plan to be online during the upgrade window so that any follow-up steps or mitigation instructions can be applied promptly.
- During upgrades, Cosmovisor creates a full state backup in the `.inference/data` directory; ensure sufficient disk space is available. Guidance on safely removing old backups from the `.inference` directory is available in [the documentation.](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)
- If `application.db` occupies a significant amount of disk space, the cleanup techniques described in the cosmovisor backup [guide](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it) may be applied.
- The proposal would intentionally skip Confirmation PoC from the upgrade height through the end of the upgrade epoch (3000-block grace window). If approved, this skip is expected and not a malfunction; the new snapshot logic would start from the next epoch.
- If approved, devshard storage could optionally be backed by a shared Postgres instance after the upgrade (same env vars as payload storage). Local SQLite would remain the default and would prune automatically (last 3 epochs retained).

## May 7, 2026

**Bridge container update/verification required**

As part of preparations for the upcoming v0.2.13 upgrade, which may include Ethereum-side contract activation, all hosts are asked to verify that their bridge container is deployed, running the latest version, and synced correctly.

Some hosts may already have the bridge container deployed. In that case, please first check that you are running the current version before taking any further action.

Latest bridge image:
```
ghcr.io/product-science/bridge:0.2.5-post5@sha256:8d2f217115c65b27fcb6fe1497471c30891534f18685bd3007d168aa7f1a9371
```
Check whether your bridge is already running the correct version:
```
docker inspect --format='{{.Image}}' bridge \
    | xargs docker inspect --format='{{range .RepoDigests}}{{.}}{{end}}' \
    | grep -q 'sha256:8d2f217115c65b27fcb6fe1497471c30891534f18685bd3007d168aa7f1a9371' \
    && echo "BRIDGE v0.2.5-post5 is running" || echo "WARNING: OLD BRIDGE"
```
If the command returns:
```
BRIDGE v0.2.5-post5 is running
```
your bridge container is running the expected image.

Please also verify that the bridge is synced:
```
docker logs bridge --tail 10000 | grep "Skeleton sync bounds" | tail -1
```
The output should point to a recent finalized Ethereum block and should not be significantly behind.

If the command returns a warning, please deploy or update the bridge container from the `gonka/deploy/join` directory:
```
git checkout release/v0.2.5-post5
docker compose down bridge && sudo rm -rf .inference-eth
source config.env && docker compose pull bridge
source config.env && docker compose up bridge -d --force-recreate --no-deps
```
After deployment, verify the version again:
```
docker inspect --format='{{.Image}}' bridge \
    | xargs docker inspect --format='{{range .RepoDigests}}{{.}}{{end}}' \
    | grep -q 'sha256:8d2f217115c65b27fcb6fe1497471c30891534f18685bd3007d168aa7f1a9371' \
    && echo "BRIDGE v0.2.5-post5 is running" || echo "WARNING: OLD BRIDGE"
```
If the bridge fails to synchronize, the Ethereum checkpoint sync endpoint may be unavailable. In that case, update `BEACON_STATE_URL` and restart the bridge:
```
sudo sed -i 's|- BEACON_STATE_URL=.*|- BEACON_STATE_URL=https://beaconstate.info/|' docker-compose.yml

source config.env && docker compose up bridge -d --force-recreate --no-deps
```
After updating or restarting the bridge, please also verify that it is synced, as described above.

## May 6, 2026

**PR Review for Upgrade v0.2.13**

[The pull request](https://github.com/gonka-ai/gonka/pull/1143) for the next on-chain software upgrade, v0.2.13, is open for review. 

Please review the PR code directly and leave comments regarding any findings, questions, suggested improvements, edge cases, or vulnerabilities you identify.

Meaningful review contributions, including important comments, bug findings, and security issues, may be eligible for community bounties during the next upgrade cycle.

This is a call for review of the Pull Request only, and it does not initiate formal voting. The governance voting process will begin after the review period concludes, most likely tomorrow.

**Key changes**

**inference-chain**

- Confirmation PoC used different model sets for measured weight, preserved weight, and reward rescaling. During new-model bootstrap, this could slash honest miners that served both an eligible model and a not-yet-eligible model. The fix stores one epoch snapshot of confirmable models and weight-scale factors, then uses that snapshot for all confirmation and reward-weight calculations.
- `ConsecutiveInvalidInferences` was not reset when a participant became ACTIVE again. One new bad inference could immediately invalidate them again. The counter is now reset on reactivation and upcoming promotion.
- DAPIs that joined before v0.2.12 did not have `MsgRespondDealerComplaints` in their cold-to-warm authz grants. The upgrade backfills that permission so they can respond to dealer complaints.
- Devshard settlement used a hardcoded `20_000` nonce limit. The limit is now `DevshardEscrowParams.MaxNonce`, and the v0.2.13 upgrade sets it to `1_000_000`. The upgrade also raises `MaxEscrowsPerEpoch` to `500_000`.
- The upgrade installs a grace-epoch entry for the current epoch with an extended `UpgradeProtectionWindow` (3000 blocks). Confirmation PoC triggers are skipped from the upgrade height through the end of the upgrade epoch, so the new snapshot logic only starts running from the next epoch. Reuses the v0.2.10 grace-epoch primitive.
- Wasm keeper access is resolved after app wiring, so contract permission checks work for bridge and liquidity-pool operations.

**decentralized-api**

- Some OpenAI-compatible upstreams return numeric `stop_reason` values. `Choice.StopReason` now accepts any JSON type, so those responses no longer fail unmarshalling.
- Internal devshard storage migration no longer blocks dapi startup. Devshard routes stay unavailable until migration and recovery finish.

**devshard**
  
- Devshard storage could grow forever because old escrow data stayed in one SQLite store. Storage is now epoch-scoped and prunes old epochs in the background, keeping the latest 3 epochs.
- Devshard needed a shared storage option for larger deployments. It can now use Postgres as the primary store, with SQLite kept as the local fallback.
- Postgres data is partitioned by `epoch_id` for sessions, diffs, and signatures, so pruning can drop old epoch data cleanly.
- State snapshots reduce recovery work for long-running sessions.
- Payload lookup is pinned to the escrow epoch with fallback for epoch-boundary and legacy epoch-0 requests.
- Current-epoch shard stats expose nonce, version, group, and per-host counters.

**bridge**

- Bridge tooling handles Sepolia flags and converts Gonka BLS keys/signatures to the EIP-2537 format expected by the Ethereum contract.
- Adds scripts for GNK and wrapped-token bridge operations.

Reviewers can find the full upgrade proposal, migration details, testing summary, and proposed process here: 

- [https://github.com/gonka-ai/gonka/blob/347d947596aba754e453e58d5f82ae6054233a9a/proposals/governance-artifacts/update-v0.2.13/README.md ](https://github.com/gonka-ai/gonka/blob/347d947596aba754e453e58d5f82ae6054233a9a/proposals/governance-artifacts/update-v0.2.13/README.md )

- [https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)

## May 6, 2026

There was a potential issue in api container versions v0.2.11, v0.2.12, and v0.2.12-api-post2. After a container restart, servers on ports 9100, 9200, and 9400 could start with a long delay. This delayed api activation, and some miners skipped Confirmation PoC because of it

The fix removes that blocker by loading devshards in parallel and restoring existing devshard sessions from snapshots.

[https://github.com/gonka-ai/gonka/pull/1143](https://github.com/gonka-ai/gonka/pull/1143)

Please update the binary for the api container. There is a 500 block window without CPoC (`confirmation_poc_safety_window`) before each PoC starts, so this might be the safest version to deploy.

Before updating, make sure no CPoC or PoC is running.

To deploy (one machine at a time to reduce risk):
```
sudo rm -rf decentralized-api.zip .dapi/cosmovisor/upgrades/v0.2.12-api-post3/ .dapi/data/upgrade-info.json
sudo mkdir -p  .dapi/cosmovisor/upgrades/v0.2.12-api-post3/bin/
wget -q -O  decentralized-api.zip 'https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.12-api-post3/decentralized-api-amd64.zip' && \
echo "3f2bc481b8320c53f0abe428dc262eaac5a86e8f38b8d796c409bd7116ba5017  decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j  decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.12-api-post3/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.12-api-post3/bin/decentralized-api && \
echo "API Installed and Verified"

docker stop api && \
sudo rm -rf .dapi/cosmovisor/current && \
sudo ln -sf upgrades/v0.2.12-api-post3 .dapi/cosmovisor/current && \
echo "da495bc4c414ac9a0d416f85c30dd8dfbbcc76883fd71f6c1e969d37fa184b20 .dapi/cosmovisor/current/bin/decentralized-api" && \
docker start api
```
After the deploy, double-check that the servers on ports 9100 and 9200 are running:
```
curl http://localhost:9200/admin/v1/nodes # may not be bound to localhost
```

```
curl http://localhost:9100/versions # may not be bound to localhost
```

## May 6, 2026

A minor bug was found in parsing certain responses of Kimi-K2.6 during the last epoch.

Fix: [https://github.com/gonka-ai/gonka/pull/1143/changes#diff-4c44fd18f746bca1c63d9bcbb9a73f06bc0172bfb8a33152854920d4dffff0e8](https://github.com/gonka-ai/gonka/pull/1143/changes#diff-4c44fd18f746bca1c63d9bcbb9a73f06bc0172bfb8a33152854920d4dffff0e8)

We recommend replacing the binary for the api container. Besides the fix, the new version also enables pruning for devshard DBs and adds Postgres support for devshard state.

To deploy:
```
sudo rm -rf decentralized-api.zip .dapi/cosmovisor/upgrades/v0.2.12-api-post2/ .dapi/data/upgrade-info.json
sudo mkdir -p  .dapi/cosmovisor/upgrades/v0.2.12-api-post2/bin/
wget -q -O  decentralized-api.zip 'https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.12-api-post2/decentralized-api-amd64.zip' && \
echo "7bef88106fc3464d0141a2d14245cc06c341be186250f5d096e27e901deb185e  decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j  decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.12-api-post2/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.12-api-post2/bin/decentralized-api && \
echo "API Installed and Verified"

docker stop api && \
sudo rm -rf .dapi/cosmovisor/current && \
sudo ln -sf upgrades/v0.2.12-api-post2 .dapi/cosmovisor/current && \
echo "9882b36ac6e5546fc18e3dd34da293cd5255f311f19e14ace74d3b9190c8ca1d .dapi/cosmovisor/current/bin/decentralized-api" && \
docker start api
```
Besides that, if you have an MLNode hosting Kimi-K2.6, please add the deploy arg "--enable-auto-tool-choice" to the deploy params. To do that, you can repeat the command (example for B200):
```
curl -X POST http://localhost:9200/admin/v1/nodes \
     -H "Content-Type: application/json" \
     -d '{
       "id": "<NODE_ID>",
       "host": "<NODE_IP>",
       "inference_port": 5050,
       "poc_port": 8080,
       "max_concurrent": 500,
       "models": {
         "moonshotai/Kimi-K2.6": {
           "args": [
             "--enable-auto-tool-choice",  #  new parameter
             "--tensor-parallel-size", "4",
             "--enable-expert-parallel",
             "--trust-remote-code",
             "--mm-encoder-tp-mode", "data",
             "--tool-call-parser", "kimi_k2",
             "--reasoning-parser", "kimi_k2",
             "--attention-backend", "FLASHINFER_MLA",
             "--disable-custom-all-reduce",
             "--gpu-memory-utilization", "0.95",
             "--max-num-seqs", "128",
             "--max-model-len", "240000"
           ]
         }
       }
     }'
```

And then restart the MLNode container with docker restart join-mlnode-308-1.

These actions should be applied when PoC / Confirmation PoC is not going through.

## May 5, 2026 

Hosts observed during the Kimi-K2.6 bootstrap that the 30% minimum direct participation threshold is hard to meet in practice. To avoid the risk that Kimi-K2.6 becomes ineligible in a future epoch, and to simplify onboarding further models, the proposal is to lower the threshold to 10%.

The security model is preserved: PoC validation itself is unchanged and still requires a supermajority of validation power to accept results.

The proposal is expedited so the change can take effect before the next PoC. The voting will be active for 12 hours.

To vote (`yes`, `no`, `abstain`, `no_with_veto`):
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 48 yes \
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
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 48 -o json --node $NODE_URL/chain-rpc/
```

**Voting ends**: 2026-05-05 19:00:54 UTC

## May 4, 2026

**Kimi K2.6 is now active on Gonka network**

`moonshotai/Kimi-K2.6` has passed bootstrap and joined PoC participation on Gonka network.

The process was coordinated by hosts across the network: infrastructure was prepared, intents were submitted, delegations and refusals were set, and deployments were tested.

For multi-model PoC, this means Kimi now has its own participation and reward tracking as an active model group.

Hosts running Kimi should continue monitoring their MLNodes and PoC participation as usual.    

## May 4, 2026

**Action required for hosts who submitted PoCIntent: deploy `Kimi K2.6`**

Today’s pre-evaluation check passed for `moonshotai/Kimi-K2.6`.

Hosts who submitted PoCIntent should now switch at least one MLNode from `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` to `moonshotai/Kimi-K2.6` before PoC starts at block `3874496`.

There is a 500-block window between pre-evaluation and PoC start. During this window, there are no CPoC tasks, so hosts who declared intent can safely switch their model node to `Kimi K2.6`.

Please follow the guide and complete the required deployment steps: [https://gonka.ai/docs/host/kimi-bootstrap/](https://gonka.ai/docs/host/kimi-bootstrap/)

## May 4, 2026

Transfer agents `node1`, `node2`, and `node3` have been disabled. All mainnet inference is now routed through `node4`, which operates on the new `devshard`-based billing approach.

This marks a milestone for the network that `devshard` is live and production-ready. `node4` is the recommended public gateway going forward.

**Action required:** update your endpoint to `node4`.

## May 2, 2026

Today's pre-eligibility validations don't pass, with a minimal weight for hosts whose `PoCIntent` is <30%. Please leave your MLNodes with `Qwen235B` and send your intent for the next epoch tomorrow.

## April 30, 2026

**UPGRADE EXECUTED: v0.2.12 is now live on mainnet**

The on-chain governance vote for Upgrade Proposal v0.2.12 has concluded. The proposal has been APPROVED, and the upgrade was successfully executed on the mainnet.

**Key changes now active**

- **Multi-model PoC (the largest change)** ([#1039](https://github.com/gonka-ai/gonka/pull/1039)). Transition Proof of Compute from a single fixed model to per-model PoC groups. Each governance-approved model generates its own local PoC weight, which is then aggregated into a total consensus weight via model-specific coefficients. Each host must participate in each model group (either directly or by delegating PoC voting weight).
- **`moonshotai/Kimi-K2.6` is introduced as the second model:** The model group will be activated two epochs after the upgrade. The coefficient for this model is 3.51x the coefficient of Qwen235B, based on compute complexity of models on the same hardware (8xH200, 8xB200).
- **Devshard standalone runtime** ([#1045](https://github.com/gonka-ai/gonka/pull/1045)). Decouples devshard releases from the DAPI / mainnet release cycle. 
- **Certik audit fixes** ([#1020](https://github.com/gonka-ai/gonka/pull/1020), [#1021](https://github.com/gonka-ai/gonka/pull/1021), [#1022](https://github.com/gonka-ai/gonka/pull/1022), [#987](https://github.com/gonka-ai/gonka/pull/987), [#949](https://github.com/gonka-ai/gonka/pull/949), [#988](https://github.com/gonka-ai/gonka/pull/988), [#825](https://github.com/gonka-ai/gonka/pull/825), [#1011](https://github.com/gonka-ai/gonka/pull/1011), [#1029](https://github.com/gonka-ai/gonka/pull/1029), [#789](https://github.com/gonka-ai/gonka/pull/789)). Audit findings have been addressed.
- **Protocol hardening.** Preserved nodes (`POC_SLOT=true` are randomly sampled for single PoC / CPoC time. Other updates include propagating the `mlnode` version to the on-chain `HardwareNode`, fixing DKG dealer consensus, aligning legacy validator slashing with required-collateral semantics, ensuring atomicity of the devshard escrow fund, and adding zero-timestamp tolerance to `inference_finished` event parsing.

**Guidance for Hosts**

- Deploy, delegate, or explicitly refuse the new governance-approved model (the included model will be activated 2 epochs after the upgrade). Refer to [the guide.](https://gonka.ai/docs/host/multi_model_poc/)

- Hosts are asked to update the dashboard/explorer. Please run the following commands from the `gonka/deploy/join` directory:

```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

- Binary Versions: Updated via the on-chain upgrade process.

- Migration: Testing and migration details are documented in [the v0.2.12 documentation.](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/docs/upgrades.md)

Additional details for these changes are available in the governance artifacts: [https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.12/proposals/](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.12/proposals/) 

## April 29, 2026

**Upgrade v0.2.12: Pre-download binaries**

The on-chain governance process for the v0.2.12 upgrade proposal is nearing its conclusion.

- Voting ends: April 30th, 2026, at 00:12 UTC
- Upgrade height: 3834200
- Estimated upgrade time: April 30th, 2026, at 6:00 am UTC

Hosts are encouraged to review the proposal on [GitHub](https://github.com/gonka-ai/gonka/pull/948) and participate in the vote.

Pre-downloading binaries in advance may help avoid relying on GitHub availability during the upgrade window.

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

## April 28, 2026

**Upgrade v0.2.12: Pre-Upgrade Model Cleanup**

The v0.2.12 upgrade proposal is now halfway through its on-chain voting period.

- Voting ends: April 30th, 2026, at 00:12 UTC
- Upgrade height: 3834200
- Estimated upgrade time: April 30th, 2026, at 6:00 am UTC

Hosts are encouraged to review the proposal on [GitHub](https://github.com/gonka-ai/gonka/pull/948) and vote.

**Action required before the upgrade**

As the network approaches the upgrade window, hosts should prepare their nodes in advance in case the proposal passes.

This cleanup process **must be completed before the upgrade happens**. If, at the time of the upgrade, your node’s configuration includes unsupported models, **it will be rejected and go offline.**

Version 0.2.12 removes every governance model that is not on the post-upgrade approved list. On mainnet, only the previously enforced model and Kimi will remain.
Each DAPI persists its MLNode configurations locally. On startup, it validates every configured model against the on-chain governance list. If a configuration includes at least one unsupported model, the entire node is rejected, and the host goes offline. 

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

## April 27, 2026

**v0.2.12 Upgrade Proposal Enters Governance**

[The upgrade proposal](https://github.com/gonka-ai/gonka/pull/948) for the next on-chain software version v0.2.12 has now been published on-chain and is open for voting.  

**Key changes**

- **Multi-model PoC (the largest change)** ([#1039](https://github.com/gonka-ai/gonka/pull/1039)). Transition Proof of Compute from a single fixed model to per-model PoC groups. Each governance-approved model generates its own local PoC weight, which is then aggregated into a total consensus weight via model-specific coefficients. Each host must participate in each model group (either directly or by delegating PoC voting weight).
- **`moonshotai/Kimi-K2.6` is introduced as the second model:** The model group will be activated two epochs after the upgrade. The coefficient for this model is 3.51x the coefficient of Qwen235B, based on compute complexity of models on the same hardware (8xH200, 8xB200).
- **Devshard standalone runtime** ([#1045](https://github.com/gonka-ai/gonka/pull/1045)). Decouples devshard releases from the DAPI / mainnet release cycle. 
- **Certik audit fixes** ([#1020](https://github.com/gonka-ai/gonka/pull/1020), [#1021](https://github.com/gonka-ai/gonka/pull/1021), [#1022](https://github.com/gonka-ai/gonka/pull/1022), [#987](https://github.com/gonka-ai/gonka/pull/987), [#949](https://github.com/gonka-ai/gonka/pull/949), [#988](https://github.com/gonka-ai/gonka/pull/988), [#825](https://github.com/gonka-ai/gonka/pull/825), [#1011](https://github.com/gonka-ai/gonka/pull/1011), [#1029](https://github.com/gonka-ai/gonka/pull/1029), [#789](https://github.com/gonka-ai/gonka/pull/789)). Audit findings have been addressed.
- **Protocol hardening.** Preserved nodes (`POC_SLOT=true` are randomly sampled for single PoC / CPoC time. Other updates include propagating the `mlnode` version to the on-chain `HardwareNode`, fixing DKG dealer consensus, aligning legacy validator slashing with required-collateral semantics, ensuring atomicity of the devshard escrow fund, and adding zero-timestamp tolerance to `inference_finished` event parsing.

**Upgrade plan**

The binary versions will be updated via an on-chain upgrade proposal. For more information on the upgrade process, refer to [/docs/upgrades.md.](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/docs/upgrades.md)

**Required actions**

**Before the upgrade**
   
Deploy latest versions of `versiond` and `proxy` services from `docker-compose.yml` (using the repo at tag release/v0.2.12):
```
git checkout release/v0.2.12
```
Deploy (important to use `--no-deps`):
```
source config.env && \
docker compose -f docker-compose.yml up versiond proxy -d --no-deps
```
That will activate `devshard` working independently from `api` service.

**Post-upgrade**

Deploy, delegate, or explicitly refuse the new governance-approved model(the included model will be activated 2 epochs after the upgrade). Refer to [the guide](https://gonka.ai/docs/host/multi_model_poc/).

**Before or after the upgrade**
   
Hosts are asked to update the dashboard/explorer. Please run the following commands from the `gonka/deploy/join` directory:
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

**How to vote**

If you do not have direct access to the key that holds voting power, or want another key to vote on your behalf, please refer to [the guide](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf) on granting governance voting permission from a cold key to a warm key. 

Proposal details and voting are available via `inferenced`. Any active node can be used. Available nodes include:

- [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
- [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
- [https://node3.gonka.ai](https://node3.gonka.ai)
  
Cast your vote ( `yes`, `no` , `abstain` , `no_with_veto` ):
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 44 yes \
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
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 44 -o json --node $NODE_URL/chain-rpc/
```

**Deadlines**

- Voting ends: April 30th, 2026, at 00:12 UTC
- Upgrade height: 3834200
- Estimated upgrade time: April 30th, 2026, at 6:00 UTC

**Attention**

- Please plan to be online during the upgrade window so that any follow-up steps or mitigation instructions can be applied promptly. 
- During upgrades, Cosmovisor creates a full state backup in the `.inference/data` directory; ensure sufficient disk space is available. Guidance on safely removing old backups from the `.inference` directory is available in [the documentation.](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)
- If `application.db` occupies a significant amount of disk space, the cleanup techniques described in the cosmovisor backup [guide](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it) may be applied.
- After the upgrade, Postgres is available as an option for local payload storage.

## April 15, 2025

**PR Review for Upgrade v0.2.12**

[The pull request](https://github.com/gonka-ai/gonka/pull/948) for the next on-chain software upgrade, v0.2.12, is open for review. 

Please review the PR code directly and leave comments regarding any findings, questions, suggested improvements, edge cases, or vulnerabilities you identify.

Meaningful review contributions, including important comments, bug findings, and security issues, may be eligible for community bounties during the next upgrade cycle.

This is a call for review of the Pull Request only, and it does not initiate formal voting. The governance voting process will begin after the review period concludes.

**Key changes**

- **Multi-model PoC (the largest change)** ([#1039](https://github.com/gonka-ai/gonka/pull/1039)). Transition Proof of Compute from a single fixed model to per-model PoC groups. Each governance-approved model generates its own local PoC weight, which is then aggregated into total consensus weight via model-specific coefficients
- **Consensus-level transaction fees with automatic migration** ([#937](https://github.com/gonka-ai/gonka/pull/937), [#981](https://github.com/gonka-ai/gonka/pull/981)). Introduces a governance-controlled gas price. Protocol-duty messages (PoC, validations, inference, BLS DKG) are exempt via `NetworkDutyFeeBypassDecorator`. `MsgPoCV2StoreCommit` charges a two-component fee (base validation + count-linear) as the primary Sybil defense. See [docs/host_onboarding.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/docs/host_onboarding.md) for details.
- **Devshard standalone runtime** ([#1045](https://github.com/gonka-ai/gonka/pull/1045)). Decouples devshard releases from the DAPI / mainnet release cycle.
- **Certik audit fixes** ([#1020](https://github.com/gonka-ai/gonka/pull/1020), [#1021](https://github.com/gonka-ai/gonka/pull/1021), [#1022](https://github.com/gonka-ai/gonka/pull/1022), [#987](https://github.com/gonka-ai/gonka/pull/987), [#949](https://github.com/gonka-ai/gonka/pull/949), [#988](https://github.com/gonka-ai/gonka/pull/988), [#825](https://github.com/gonka-ai/gonka/pull/825), [#1011](https://github.com/gonka-ai/gonka/pull/1011), [#1029](https://github.com/gonka-ai/gonka/pull/1029), [#789](https://github.com/gonka-ai/gonka/pull/789)). All known audit findings have been addressed.
- **Protocol hardening.** Implements a stronger PoC v2 RNG (full 256-bit entropy vs. previous 32-bit), which will activate via a separate governance vote. Other updates include propagating the `mlnode` version to the on-chain `HardwareNode`, fixing DKG dealer consensus, aligning legacy validator slashing with required-collateral semantics, ensuring atomicity of the devshard escrow fund, and adding zero-timestamp tolerance to `inference_finished` event parsing.

**Upgrade plan**

The binary versions will be updated via an on-chain upgrade proposal. For more information on the upgrade process, refer to [/docs/upgrades.md.](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.12/docs/upgrades.md)

**Required actions post-upgrade**

Existing Hosts:

- Ensure cold account holds sufficient (e.g., 100 GNK) to cover the auto-granted fee allowance spend limit.
- Deploy, delegate, or explicitly refuse each governance-approved model for the new model once it’s approved by governance (the included model will be activated 3 epochs after the upgrade)
- Deploy `versiond` service from `docker-compose.yml` (using the last commit in the main branch)
- Recreate `proxy` container using new version and parameters. The documentation will provide the exact command.

## April 1, 2026

ML Node `3.0.12-post6` available 

A new mlnode version is now available: `ghcr.io/gonka-ai/mlnode:3.0.12-post6`

- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post6
- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post6-blackwell
- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post6-blackwell-sm120

This version is now set as the default in the main branch: [https://github.com/gonka-ai/gonka/commit/ec8f45573149ce5686e8e5fc29f1a8f49a295689](https://github.com/gonka-ai/gonka/commit/ec8f45573149ce5686e8e5fc29f1a8f49a295689)

**What changed**

This version has already been used by some miners over recent epochs.
Initial observations indicate improved stability for nodes operating close to PoC start.

The update includes a fix for an edge case near PoC start that could previously lead to degraded performance under certain conditions.

Full changes in vLLM: [https://github.com/gonka-ai/vllm/compare/release/v0.9.1-pocv2-post5...release/v0.9.1-pocv2-post6](https://github.com/gonka-ai/vllm/compare/release/v0.9.1-pocv2-post5...release/v0.9.1-pocv2-post6)

**Guidance**

- Upgrading to this version is recommended
- The release is fully compatible with previous versions

## March 20, 2026

**UPGRADE EXECUTED: v0.2.11 is now live on mainnet**

The on-chain governance vote for Upgrade Proposal v0.2.11 has concluded. The proposal has been APPROVED, and the upgrade was successfully executed on the mainnet.

**Key changes now active**

**[Initial scaling architecture: `devshards`-based inference sessions](https://github.com/gonka-ai/gonka/pull/877)**

This upgrade introduces an initial version of `devshards`-based inference sessions intended to improve inference scalability.

**[`StartInference` and `FinishInference` performance improvements](https://github.com/gonka-ai/gonka/pull/812)**

These performance improvements enable up to 100x more inferences per block, depending on workload and network conditions.
Additional details for these and other changes are available here: [https://github.com/gonka-ai/gonka/pull/813](https://github.com/gonka-ai/gonka/pull/813)

**Guidance for Hosts**

- **Binary Versions:** Updated via the on-chain upgrade process.
- **Migration:** Testing and migration details are documented in the [v0.2.11 documentation](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.11/docs/upgrades.md).

Additional details for these changes are available in the governance artifacts: [https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.11/proposals/](https://github.com/gonka-ai/gonka/tree/upgrade-v0.2.11/proposals/) 

## March 19, 2026

**Upgrade v0.2.11: Pre-download binaries**

The on-chain governance process for the v0.2.11 upgrade proposal is nearing its conclusion.

- Voting ends: March 20th, 2026, at 05:59:52 UTC
- Upgrade height: 3186100
- Estimated upgrade time: March 20th, 2026, at 14:30 UTC

Hosts are encouraged to review the proposal on [GitHub](https://github.com/gonka-ai/gonka/pull/813) and vote.
Pre-downloading binaries in advance may help avoid relying on GitHub availability during the upgrade window.

```
# 1. Create Directories
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.11/bin \
              .inference/cosmovisor/upgrades/v0.2.11/bin && \

# 2. DAPI: Download -> Verify -> Unzip directly to bin -> Make Executable
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.11/decentralized-api-amd64.zip" && \
echo "e574c3d86189daf325cc7008603ee8e952efb028afda5bcd4a154dcd334192d4 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.11/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.11/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

# 3. Inference: Download -> Verify -> Unzip directly to bin -> Make Executable
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.11/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.11/inferenced-amd64.zip" && \
echo "c77528bd2e31e86355a6eefddb50e0db7f9600ebf2940ca440a61ea36e7ef7ca inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.11/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.11/bin/inferenced && \
echo "Inference Installed and Verified" && \

# 4. Cleanup and Final Check
rm decentralized-api.zip inferenced.zip && \
echo "--- Final Verification ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.11/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.11/bin/inferenced && \
echo "8b99e550ddd117a0cb4293b4ae74e0e5dff961a1986f23b58ec7ae6c3f0478f1 .dapi/cosmovisor/upgrades/v0.2.11/bin/decentralized-api" | sudo sha256sum --check && \
echo "6cf186a75782da07156d4d03b4266cefcb36656de89e4a378ae96d8df89ad003 .inference/cosmovisor/upgrades/v0.2.11/bin/inferenced" | sudo sha256sum --check
```

## March 18, 2026

**v0.2.11 Upgrade Proposal Enters Governance**

The upgrade proposal for the next on-chain software version v0.2.11 has now been published on-chain and is open for voting. If approved, the proposal introduces an initial version of `devshards`-based inference sessions intended to improve inference scalability, and significantly `Start`/`FinishInference` performance improvements.

**Key changes**

**[Initial scaling architecture: `devshards`-based inference sessions](https://github.com/gonka-ai/gonka/pull/877)**

This upgrade introduces an initial version of `devshards`-based inference sessions intended to improve inference scalability.

Today, handling inference through per-inference on-chain transactions limits throughput. This design moves inference execution and validation into an assigned off-chain subgroup, while the chain only handles session creation and final settlement.

This is intentionally an early and constrained version of the design. It is being proposed for mainnet review and limited production testing, not because it is considered finished, but because this type of system needs exposure to real network conditions early. Some classes of issues are difficult to surface through local testing alone. Current implementation has been designed to avoid negatively affecting miners’ rewards.

**[`StartInference` and `FinishInference` performance improvements](https://github.com/gonka-ai/gonka/pull/812)**

- Reduces unnecessary state writes and query overhead for `MsgStartInference` and `MsgFinishInference`.
- Simplifies stats handling and cuts work done during the inference lifecycle for better block execution stability.

On mainnet-like conditions, this also makes it possible to fit up to 100x more inferences per block, depending on workload and network conditions.  ￼
Additional details for these and other changes are available here: [https://github.com/gonka-ai/gonka/pull/813](https://github.com/gonka-ai/gonka/pull/813) 

**Recommended action before the upgrade**

**`application.db` pruning**

Hosts are strongly encouraged to prune `application.db` before the upgrade, following the provided instructions.

Doing this in advance is important. If many nodes defer pruning until after the upgrade, pruning activity may begin across the network at roughly the same time, creating avoidable operational pressure.
Pruning instructions are documented here: [https://gonka.ai/FAQ/#__tabbed_7_4](https://gonka.ai/FAQ/#__tabbed_7_4)

**Explorer update**

Hosts are asked to update the dashboard/explorer. Please run the following commands from the `gonka/deploy/join` directory:
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```

**How to vote**

If you do not have direct access to the key that holds voting power, or want another key to vote on your behalf, please refer to [the guide](https://gonka.ai/FAQ/#what-should-i-do-if-i-cannot-vote-because-i-do-not-have-access-to-the-cold-key-or-if-i-want-another-key-to-vote-on-my-behalf) on granting governance voting permission from a cold key to a warm key. 

Proposal details and voting are available via `inferenced`. Any active node can be used. Available nodes include:

- [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
- [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
- [https://node3.gonka.ai](https://node3.gonka.ai) 

Cast your vote ( `yes`, `no` , `abstain` , `no_with_veto` ):

```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 31 yes \
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
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 31 -o json --node $NODE_URL/chain-rpc/
```

**Deadlines**

- Voting ends: March 20th, 2026, at 05:59:52 UTC
- Upgrade height: 3186100
- Estimated upgrade time: March 20th, 2026, at 14:30 UTC

**Attention**

- Please plan to be online during the upgrade window so that any follow-up steps or mitigation instructions can be applied promptly.
- During upgrades, Cosmovisor creates a full state backup in the `.inference/data` directory; ensure sufficient disk space is available. Guidance on safely removing old backups from the `.inference` directory is available in [the documentation](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory).
- If `application.db` occupies a significant amount of disk space, the cleanup techniques described [here](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it) may be applied.
- After the upgrade, Postgres is available as an option for local payload storage.

## March 17, 2026

**PR Review for Upgrade v0.2.11**

[The Pull Request](https://github.com/gonka-ai/gonka/pull/813) for the next on-chain software upgrade, v0.2.11, is open for review. Feedback and suggested improvements are welcome. 

Bounties for meaningful contributions to this PR review may be proposed in the next upgrade. 

This is a call for review of the Pull Request only, and not the start of formal voting. The governance voting process will begin after the review period concludes.

**Key changes**

[Initial scaling architecture: `devshards`-based inference sessions](https://github.com/gonka-ai/gonka/pull/877)

This upgrade introduces an initial version of `devshards`-based inference sessions intended to improve inference scalability.

Today, handling inference through per-inference on-chain transactions limits throughput. This design moves inference execution and validation into an assigned off-chain subgroup, while the chain only handles session creation and final settlement.

This is intentionally an early and constrained version of the design. It is being proposed for mainnet review and limited production testing, not because it is considered finished, but because this type of system needs exposure to real network conditions early. Some classes of issues are difficult to surface through local testing alone. Current implementation has been designed to avoid negatively affecting miners’ rewards.

[`StartInference` and `FinishInference` performance improvements](https://github.com/gonka-ai/gonka/pull/812)

- Reduces unnecessary state writes and query overhead for `MsgStartInference` and `MsgFinishInference`.
- Simplifies stats handling and cuts work done during the inference lifecycle for better block execution stability.

On mainnet-like conditions, this also makes it possible to fit up to 100x more inferences per block, depending on workload and network conditions.  ￼

**Recommended action before the upgrade**

**`application.db` pruning**

Hosts are strongly encouraged to prune `application.db` before the upgrade, following the provided instructions.
Doing this in advance is important. If many nodes defer pruning until after the upgrade, pruning activity may begin across the network at roughly the same time, creating avoidable operational pressure.
Pruning instructions are documented [here](https://gonka.ai/FAQ/#__tabbed_7_4).

**Explorer update**

Hosts are asked to update the dashboard/explorer. Please run the following commands from the `gonka/deploy/join` directory:
```
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull explorer
docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d explorer
```
Reviewers can find the full upgrade proposal, migration details, testing summary, and proposed process [here](https://github.com/gonka-ai/gonka/pull/813).

## March 16, 2026

**API binary `v0.2.10-post7` is available**

A potential vulnerability has been identified in `v0.2.10`. To reduce risk during the current pre-upgrade period, it is recommended to upgrade the api binary to `v0.2.10-post7` before the next PoC starts.

Full changes: [https://github.com/gonka-ai/gonka/compare/main…release/v0.2.10-post7](https://github.com/gonka-ai/gonka/compare/main…release/v0.2.10-post7)

Apply update:
```
# Pre-check: Ensure no confirmation PoC is active (fails entire script if not false)
echo "--- Pre-flight Check: Confirmation PoC Status ---" && \
CONFIRMATION_POC_ACTIVE=$(curl -sf "https://node3.gonka.ai/v1/epochs/latest" | jq -r '.is_confirmation_poc_active') && \
[ "$CONFIRMATION_POC_ACTIVE" = "false" ] && \
echo "OK: No confirmation PoC active" && \

# Download Binary
sudo rm -rf decentralized-api.zip .dapi/cosmovisor/upgrades/v0.2.10-post7/ .dapi/data/upgrade-info.json && \
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.10-post7/bin/ && \
wget -q -O decentralized-api.zip 'https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.10-post7/decentralized-api-amd64.zip' && \
echo "71481e6f2c5f9a355ed283a0896833bcc8397e8bcda134a796a46467bd2ff3b0  decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.10-post7/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.10-post7/bin/decentralized-api && \
echo "API Installed and Verified" && \

# Link Binary
echo "--- Final Verification ---" && \
sudo rm -rf .dapi/cosmovisor/current && \
sudo ln -sf upgrades/v0.2.10-post7 .dapi/cosmovisor/current && \
echo "313df0747e090518ac052918ad23f9d6e70bb60dede2013375e322c23605f3e0  .dapi/cosmovisor/current/bin/decentralized-api" | sudo sha256sum --check && \
# Restart 
source config.env && docker compose up api --no-deps --force-recreate -d
```

## March 11, 2026

**Tool calling**

[Tool calling](https://gonka.ai/developer/quickstart/#4-tool-calling) is now available through the standard function-calling pattern (`type: “function”`).

The integration flow is simple: 

- functions are defined by the developer
- the model returns structured call arguments when a request matches
- execution is handled on the application side.

For teams already using proxy layers, this may be a good opportunity to simplify the stack and rely on native behavior instead. In practice, that should lead to a cleaner integration pattern and easier maintenance.

## March 6, 2026

**Heads up: v0.2.11 upgrade is expected to enter review and governance voting early next week.**

Please keep an eye out and plan to participate. Voting is one of the simplest ways to support network development and keep upgrades aligned with what participants actually need.
If you do not have access to the cold key that holds your voting power, it makes sense to arrange vote delegation in advance. Please contact the owner of that key and ask them to grant permission for you to vote on their behalf. Without that authorization, a vote cannot be submitted from another account.

In this setup:

- Granter = account that owns voting power (cold key)
- Grantee = account that will submit votes on the granter’s behalf (warm key)

The grantee can still vote for their own account as well. The granter can revoke this permission at any time.

Below are copy-paste commands for granting, checking, using, and revoking vote delegation.

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

## February 21, 2026

**API binary v0.2.10-post3 is available**

A new version of the API binary has been released. It updates connection timeout handling and introduces additional checks in the PoC validation pipeline.

1. Upgrade v0.2.10 introduced a strict 5-minute timeout for Executor → MLNode connections, while some requests may take considerably longer. The new API version returns this value back instead of enforcing the strict limit.
2. The request retry system previously retried inference even if it failed due to a processing timeout (not a TLS timeout).
Server-side retry for long requests is typically ineffective, as it leads to the same timeout scenario. At the same time, the client may receive inconsistent output.
The new API version does not retry inference in such cases.
3. MLNodes that are currently preserved and not participating in PoC generation were still used for PoC validation. This could lead to missed inferences. The new version excludes such nodes from PoC validation.
4. Extra safeguards have been added to the PoC validation pipeline.

PR: [https://github.com/gonka-ai/gonka/pull/785](https://github.com/gonka-ai/gonka/pull/785)

Build: [https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.10-post3/decentralized-api-amd64.zip](https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.10-post3/decentralized-api-amd64.zip)

Apply update:
```
# Pre-check: Ensure no confirmation PoC is active (fails entire script if not false)
echo "--- Pre-flight Check: Confirmation PoC Status ---" && \
CONFIRMATION_POC_ACTIVE=$(curl -sf "https://node3.gonka.ai/v1/epochs/latest" | jq -r '.is_confirmation_poc_active') && \
[ "$CONFIRMATION_POC_ACTIVE" = "false" ] && \
echo "OK: No confirmation PoC active" && \

# Download Binary
sudo rm -rf decentralized-api.zip .dapi/cosmovisor/upgrades/v0.2.10-post3/ .dapi/data/upgrade-info.json && \
sudo mkdir -p  .dapi/cosmovisor/upgrades/v0.2.10-post3/bin/ && \
wget -q -O  decentralized-api.zip 'https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.10-post3/decentralized-api-amd64.zip' && \
echo "1b75f2785c7884dc24f3c1e39d5ed10f4afcbe5fc677f5569d90d75c752ec150 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j  decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.10-post3/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.10-post3/bin/decentralized-api && \
echo "API Installed and Verified"  && \

# Link Binary
echo "--- Final Verification ---" && \
sudo rm -rf .dapi/cosmovisor/current && \
sudo ln -sf upgrades/v0.2.10-post3 .dapi/cosmovisor/current && \
echo "de72c665ff71de904210c5472cebb248d163c1398141868e1a1fe198055b5886 .dapi/cosmovisor/current/bin/decentralized-api" | sudo sha256sum --check && \
# Restart 
source config.env && docker compose up api --no-deps --force-recreate -d
```

## February 20, 2026

**Recommendation (optional): vLLM / mlnode build to interrupt in-flight requests at PoC start**

A new vLLM / mlnode build is available that interrupts in-flight inference requests at the start of PoC, to reduce the risk of potential weight decreases caused by requests that remain active when PoC begins.

Source: [https://github.com/gonka-ai/vllm/tree/release/v0.9.1-pocv2-post5/vllm](https://github.com/gonka-ai/vllm/tree/release/v0.9.1-pocv2-post5/vllm)

**Recommended images to try:**

- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post5
- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post5-blackwell
- docker pull ghcr.io/gonka-ai/mlnode:3.0.12-post5-blackwell-sm120

**Notes:**

- This build is intended to be backward compatible with the previous version.
- It has already been switched on for a small number of nodes, but it’s still recommended to review the changes before deploying.  

## February 19, 2026

**Collateral parameter update proposal — Voting result**

The collateral parameter update proposal has concluded without reaching quorum. As a result, the proposal has been rejected under the current governance rules. This means the updated parameters will not be activated.

As previously stated, collateral activation at Epoch 180 is independent of this vote.

Because the proposal did not pass, the collateral parameters defined in Genesis will automatically take effect at Epoch 180.

Participants should:

- Review the Genesis-defined collateral parameters.
- Prepare and deposit the required GNK before Epoch 180.
- Ensure [collateral](https://gonka.ai/host/collateral/) is properly set, otherwise PoC-derived rewards will be reduced 5× starting from Epoch 180.

Collateral activation is part of the protocol’s transition from the Grace Period to a fully collateralized PoC-weight model. Governance remains the mechanism for adjusting parameters, but default rules apply if no alternative is approved.

!!! note "Important: deposit with a buffer"

    Participants are strongly encouraged **not** to deposit the exact minimum amount. PoC weight may fluctuate between epochs due to normalization effects and network-level adjustments. Smaller weights may experience proportionally larger relative fluctuations. To avoid temporary under-collateralization at the epoch boundary, it is recommended to deposit up to 2× the calculated minimum requirement while collateral levels remain relatively small. This provides operational safety and prevents unintended weight reduction due to minor parameter shifts. The protocol does not auto-top-up collateral.

Further proposals may be introduced if the community wishes to revise the parameters again.

## February 19, 2026

**PoC weight normalization update**

Following the recent upgrade, node weights have adjusted due to PoC duration normalization.
To normalize PoC weight against actual block generation time, calibration parameters were selected based on observed block intervals. As implemented, the effective PoC reference window turned out to be approximately 5 blocks longer than the prior nominal assumption.

As a result:

- Mean node weights decreased (normalization effect)
- The displayed total H100-equivalent capacity appears proportionally lower
- Relative GPU ratios remain unchanged

**Why this happened**

Previously, PoC weight calculations relied on a nominal epoch duration assumption. After introducing real-time normalization:

- PoC duration is aligned with the actual block production time
- Weight reflects real compute time more accurately

Because the effective normalization window is ~5 blocks longer than the earlier nominal model, the recalculated weight per epoch is proportionally lower.

**Observed GPU weight changes (Epoch 175 → 176)**

| GPU Type            | Epoch 175 | Epoch 176 | Change  |
|---------------------|----------:|----------:|--------:|
| A100-PCIE-40GB      | 11.8      | 10.0      | -15.4%  |
| A100-SXM4-80GB      | 132.2     | 107.8     | -18.5%  |
| H100 80GB HBM3      | 305.1     | 254.5     | -16.6%  |
| H100 PCIe           | 178.9     | 155.7     | -12.9%  |
| H200                | 319.6     | 281.3     | -12.0%  |

**Action for tracker (dashboard) maintainers**

With PoC duration normalization in effect and the effective reference window now ~5 blocks longer than the previous nominal assumption, weight values from Epoch 176 onward reflect the updated calculation model.
Trackers and dashboards that derive H100-equivalent capacity or reward projections from PoC weight should verify their conversion coefficients starting from Epoch 176.
If pre-normalization assumptions are still used, displayed hardware equivalents and projected rewards may appear overstated.

## February 18, 2026

**UPGRADE EXECUTED: v0.2.10 is now live on mainnet**

The on-chain governance vote for Upgrade Proposal v0.2.10 has concluded. The proposal has been APPROVED, and the upgrade was successfully executed on the mainnet. This upgrade introduces a significant optimization to PoC validation and implements real-time weight normalization to improve network fairness and scalability.

**Attention**

ML Node containers must be restarted to trigger re-deploy of the model. Run:
```
docker restart join-mlnode-1
```
The transition to `mlnode:3.0.12-post4-*` should be completed within the 3000-block grace period introduced in the upgrade. 

!!! note "Compatibility Note"
    This upgrade includes a migration to IBC stack v8.7.0. Check any scripts parsing `inferenced` CLI output. Enums and int64/uint64 values are now encoded as strings.

**Key changes now active**

**PoC Validation Sampling Optimization**

This upgrade introduces a new PoC validation mechanism that reduces complexity from O(N^2) to O(N x N_SLOTS) by assigning each participant a fixed sampled set of validators.

**PoC Weight Normalization by Real Time**

This upgrade normalizes PoC participant weights by actual PoC elapsed time to reduce block-time drift effects and keep weight outcomes consistent with real execution duration.

**Enable tools for Qwen235B**

This upgrade adds tool calling args ( `--enable-auto-tool-choice` , `--tool-call-parser hermes` ) for `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` and sets validation threshold 0.958.
To enable tools, vLLM inside the MLNode container must be restarted.

**Additional Protocol Updates**

- Fix: PoC and CPoC intersection bug (PR #752).
- IBC Upgrade: Upgrades IBC stack to v8.7.0.
- Punishment: Thresholds are now derived from on-chain data (PR #688).
- Vesting: Support for streamvesting transfers with active vesting (PR #641).
- MLNode: More reliable version of MLNode containers ghcr.io/product-science/mlnode:3.0.12-post4 / ghcr.io/product-science/mlnode:3.0.12-post4-blackwell.

**Grace Period:** The upgrade introduces a grace period with no Confirmation PoC for 3000 blocks after the upgrade, and less strict miss rate and invalidation rate threshold for the epoch of the upgrade.

Additional details for these changes are available in the governance artifacts: [https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10/README.md](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10/README.md)

## February 18, 2026

**Collateral parameter update proposal is now open for voting**

The proposal for updated collateral parameters has been published for community vote.

Proposed parameters:

- 0.032 GNK per 1 unit of power (~10 GNK per H100)
- 0.01% slashing for miss rate or jail
- 0.5% slashing for invalid inference

This means that within a single epoch, even if penalized, a miner cannot lose more than 0.5% of their collateral. And the required collateral represents only ~24% of daily rewards.

**Warning:** Collateral will take effect regardless of the outcome of the vote. If this proposal does not pass, the collateral parameters defined in Genesis will automatically activate at Epoch 180 instead of the ones listed above.

After the vote concludes and before Epoch 180, every miner must follow [the instructions](https://gonka.ai/host/collateral/#slashing) to transfer the required funds into collateral. Otherwise, their rewards will be reduced by 5x starting from Epoch 180.

To get the updated parameters:
```
export NODE_URL=https://node3.gonka.ai/
diff -u \
  <(./inferenced query inference params -o json --node $NODE_URL/chain-rpc/ | jq '.params') \
  <(./inferenced query gov proposal 28 -o json --node $NODE_URL/chain-rpc/ | jq '.proposal.messages[] | select(."type"=="inference/x/inference/MsgUpdateParams") | .value.params') \
  || true

```

To cast your vote (`yes`, `no` , `abstain` , `no_with_veto`):
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 28 yes \
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
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 28 -o json --node $NODE_URL/chain-rpc/
```
**Deadline:**

Voting ends on February 19th, 2026, at 07:27:06 UTC.

## February 17, 2026

**v0.2.10 Upgrade Proposal Enters Governance**

The upgrade proposal for the next on-chain software version v0.2.10 has now been published on-chain and is open for voting. If approved, the proposal introduces a significant optimization to PoC validation (disabled by default) and implements real-time weight normalization to improve network fairness and scalability.

**Key changes**

**PoC Validation Sampling Optimization**

This upgrade introduces a new PoC validation mechanism that reduces complexity from O(N^2) to O(N x N_SLOTS) by assigning each participant a fixed sampled set of validators.

**PoC Weight Normalization by Real Time**

This upgrade normalizes PoC participant weights by actual PoC elapsed time to reduce block-time drift effects and keep weight outcomes consistent with real execution duration.

**Enable tools for Qwen235B**

This upgrade adds tool calling args (`--enable-auto-tool-choice` , `--tool-call-parser hermes`) for `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` and set validation threshold `0.958`.
To enable tools, vLLM inside the MLNode container must be restarted. The upgrade introduces a grace period with no Confirmation PoC for 3000 blocks after the upgrade, and less strict miss rate and invalidation rate threshold for the epoch of the upgrade.

**Additional Protocol Updates**

- Fix PoC and CPoC intersection bug (PR #752)
- Upgrades IBC stack to v8.7.0.
- Punishment thresholds are now derived from on-chain data (PR #688)
- Support for streamvesting transfers with active vesting (PR #641)
- More reliable version of MLNode containers `ghcr.io/product-science/mlnode:3.0.12-post4` / `ghcr.io/product-science/mlnode:3.0.12-post4-blackwell`. 

Additional details for these and other changes are available in the governance artifacts [https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10/README.md ](https://github.com/gonka-ai/gonka/blob/upgrade-v0.2.10/proposals/governance-artifacts/update-v0.2.10/README.md)

**Required host actions after upgrade execution**

If the proposal is approved and the upgrade executed, ML Node containers must be restarted to trigger re-deploy of the model. Run:
```
docker restart join-mlnode-1
```
The transition to `mlnode:3.0.12-post4-*` should be completed within the 3000-block grace period introduced in the upgrade. 

**How to vote**

Proposal details and voting are available via `inferenced`. Any active node can be used. Available nodes include:

- [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
- [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
- [https://node3.gonka.ai](https://node3.gonka.ai) 

Cast your vote (`yes`, `no` , `abstain` , `no_with_veto`):
```
export NODE_URL=https://node3.gonka.ai/
./inferenced tx gov vote 27 yes \
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
export NODE_URL=https://node3.gonka.ai/
./inferenced query gov votes 27 -o json --node $NODE_URL/chain-rpc/
```
**Deadlines**

- Voting ends: February 18th, 2026, at 09:26:26 UTC
- Upgrade height: 2712600
- Estimated upgrade time: February 18th, 2026, at 15:30:00 UTC

**Attention**

- Check any scripts parsing `inferenced` CLI output. Enums and int64/uint64 values are now encoded as strings due to the IBC stack to v8.7.0 upgrade.
- Please plan to be online during the upgrade window so that any follow-up steps or mitigation instructions can be applied promptly.
- During upgrades, Cosmovisor creates a full state backup in the `.inference/data` directory; ensure sufficient disk space is available. Guidance on safely removing old backups from the `.inference` directory is available in [the documentation](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory).
- If `application.db` occupies a significant amount of disk space, the cleanup techniques described [here](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it) may be applied.
- After the upgrade, Postgres is available as an option for local payload storage.

## February 16, 2026

**Collateral activation and proposed initial parameters**

Less than 7 days remain until Epoch 180 - it’s time to prepare.

As discussed during the AMA and based on the argument presented by the community members, the proposal is to start with a small collateral requirement and minimal slashing.

Parameters to be submitted for community vote:

- 0.032 GNK per 1 unit of power (~10 GNK per H100)
- 0.01% slashing for miss rate or jail
- 0.5% slashing for invalid inference

This means that within a single epoch, even if penalized, a miner cannot lose more than 0.5% of their collateral. And the required collateral represents only ~24% of daily rewards.

A separate announcement will be shared once the proposal is submitted for voting.

Warning: Collateral will take effect regardless of the outcome of the proposal vote. If this proposal does not pass, the collateral parameters defined in Genesis will automatically activate at Epoch 180 instead of the ones listed above.

Any future increase of collateral will be proposed through a separate vote. The goal is to observe network stability and ensure that unjustified punishments are rare and applied only for valid reasons. If stability is demonstrated, increasing the collateral gradually to the level described in the Tokenomics White Paper (e.g., ~100 GNK per H100) will support the network’s long-term success.

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

## February 13, 2026

If your node did not apply the latest upgrade in time, it may halt with a consensus failure at block 2628371. This happens because the node is running an outdated binary that is no longer compatible with the network. To recover, follow this guide [https://gonka.ai/FAQ/#recovery-guide-consensus-failure-after-missing-patch](https://gonka.ai/FAQ/#recovery-guide-consensus-failure-after-missing-patch)

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
