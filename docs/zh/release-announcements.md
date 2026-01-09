# 发布公告

## 2026年1月8日

**行动刻不容缓：稳定期临时参与者 `allowlist`**
在成功采用修复 PoC 相关共识故障补丁后，一项新的治理投票现已激活。

随着正常区块生产恢复，网络在进一步扩容前将进入一个短暂的稳定期。

本次投票在稳定期内定义参与者 `allowlist`（[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)），反映在此前运行中行为始终符合网络预期的一组参与者。

**投票范围**
若提案通过，网络将在稳定期内基于一个 `allowlist` 运行，该名单由在过往 epoch 中未表现出非标准硬件行为的参与者组成。实际操作中，`allowlist` 对应的是这样一组参与者，在多个 epoch 中：

- 其上报的硬件特征与一组预定义、常见的硬件配置模式进行比对，用于识别偏差与不一致（非标准配置字符串的完整列表见此处：[https://github.com/product-science/filter/blob/main/filter_strings.txt](https://github.com/product-science/filter/blob/main/filter_strings.txt)），且
- 其观察到的 PoC 权重始终低于使用可比硬件的其他参与者所展示权重的 150%。

此前持续表现出与这些模式存在偏差的参与者，在稳定期结束（区块 2222222）之前将不会被纳入 `allowlist`。

**可复现性与方法**
`allowlist` 基于公开可观测的链上数据，并通过一组预定义的硬件配置模式推导而来。相关模式通过开源脚本进行评估，脚本可在此处获取：[https://github.com/product-science/filter](https://github.com/product-science/filter)
`allowlist` 名单可在此处查看：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)

**执行特性**

- 若提案通过，`allowlist` 将自动生效。
- 无需进行任何软件升级。
- `allowlist` 将在投票成功后的下一次 PoC 中激活，预计在区块 2089140。
- 自该时刻起，`allowlist` 将持续生效，直至并包含区块 2222222。
- 如需进一步调整，仍需通过治理流程决定。

**稳定期结束之后**
`allowlist` 设定了固定的到期时间，不会在稳定期之后继续生效。当 `allowlist` 于区块 2222222 到期后：

- 网络将恢复至稳定期之前生效的标准参与规则，或
- 任何替代性配置均需通过单独的治理提案加以定义。

**如何投票**
可使用 `inferenced` 命令获取提案详情并提交投票。
请注意，任一在线节点均可用于查询或投票。目前可用节点包括：

- http://node1.gonka.ai:8000/
- http://node2.gonka.ai:8000/
- https://node4.gonka.ai/

查看投票状态：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 20 -o json --node $NODE_URL/chain-rpc/
```

投票（`yes`、`no`、`abstain`、`no_with_veto`）：
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

**投票后的下一步**

整个流程完全通过治理处理，无需进行软件升级。

**时间线与截止时间**
- 投票结束时间：2026 年 1 月 10 日 06:46:52 UTC
- `allowlist` 激活：在区块 2089140 的下一次 PoC 执行之后
- `allowlist` 失效：在区块 2222222 自动失效

如您是主机，请审阅提案并参与投票。

## 2026年1月8日

**网络更新 — 共识已恢复**

在补丁部署完成后，网络共识已恢复稳定，目前运行在正常参数范围内。

状态概览：

- 补丁采用率：已超过 67% 的阈值
- 网络状态：完全正常运行
- 操作指引：各节点应继续保持标准运行模式

## 2026年1月8日

**网络更新 — 补丁已准备就绪**

针对在 PoC 期间观察到的最新共识故障的补丁现已可用。

[指南](https://gonka.ai/FAQ/#upgrade-v027)

为恢复可靠的共识推进，至少 **67%** 的活跃网络算力需完成补丁安装。

在达到该门槛之前，共识推进可能仍不稳定。

**鼓励所有主机尽快应用补丁并在升级后保持在线。如有需要，将分享进一步说明。**

## 2026年1月8日

**网络更新 — 后续说明**

针对近期共识问题的补丁已准备就绪，详细指引将很快分享。每一位活跃主机的参与对网络前进和恢复正常运行都至关重要。请保持在线，并在指引发布后准备好应用更新。

## 2026年1月8日

**网络更新 — PoC 期间的共识故障**

在计算证明（PoC）期间，网络出现了共识故障。问题已定位，正在准备补丁以解决根本原因。后续说明和技术细节将很快分享。建议主机保持在线并关注更新，一旦补丁发布，可能需要执行后续操作。

## 2026年1月8日

**v0.2.7 升级提案：创世验证者增强在主网生效**

链上治理对 v0.2.7 升级提案：创世验证者增强的投票已结束；提案获批并成功部署至主网。

**现已生效的关键变更：**

**创世验证者增强（临时）**

- 临时重新启用创世验证者增强——此前使用的限时防御机制，提议重新启用。
- 网络增长期的共识保护。在其此前运行期间：
    - 三个 Guardian 验证者合计持有约 34% 的共识投票权
    - 未向 Guardian 验证者发放额外奖励
    - 此配置在边缘情形下有助于避免共识停滞
- 满足以下两个条件时，创世验证者增强将自动停用：
    - 全网算力达到 15,000,000
    - 达到区块 3,000,000

**协议稳定性修复（全网范围）**

此升级正式纳入此前通过手动 API 更新分发、已在网络使用的关键修复。包括：

- 解决失败推理请求的错误记账（包括处理了不受支持格式但未标记完成的请求）
- 提升失败推理处理的韧性
- 为 `PoCBatch` 和 `PoCValidation` 交易引入批处理

将其纳入协议，使行为成为全网一致执行的协议级规则。

**临时的参与与执行限制**

- 主机级注册：暂停新主机注册至区块 2,222,222（约两周后）。此举旨在稳定网络并为进一步增长做好准备。
- 开发者级注册：暂停新开发者地址注册。预定义的开发者地址 `allowlist` 立即生效，名单内的开发者地址在此期间可执行推理。针对开发者地址的所有限制（含注册与推理执行）将持续至区块 2,294,222（约 19 天）。

**治理可控机制**

本次升级包含的预备改动，使后续可通过治理控制参与者接入与推理执行，无需额外软件升级。本提案并未启用任何此类治理触发的约束，需额外治理投票。

**第 117 轮奖励分配**

本提案涵盖与链暂停（第 117 轮）相关的两项奖励分配：

- 在第 117 轮活跃但未收到该轮奖励的节点，将补发该轮奖励。
- 所有在第 117 轮活跃的节点将额外获得 1.083× 第 117 轮奖励的统一补发，包括已领取原奖励的节点。

**关于持续时间与执行**

本次升级重新启用或引入的所有保护均为临时措施，且不需手动治理干预即可移除。

**后续步骤：**

- 主机无需进一步操作。
- Cosmovisor 在执行更新时会在 `.inference` 状态目录创建完整备份。为安全执行更新，建议预留 250GB 以上的可用磁盘空间。[请阅读](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory) 如何安全地从 `.inference` 目录清理旧备份。

**备注：**

- 创世验证者增强的完整技术细节见：
[https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)
- 完整技术评审（GitHub PR）：[https://github.com/gonka-ai/gonka/pull/503](https://github.com/gonka-ai/gonka/pull/503)  

## 2026年1月7日

版本 **v0.2.7** 的升级提案已通过链上治理批准。

**升级详情**

- 升级高度：区块 2,054,000
- 预计时间：2026 年 1 月 8 日 08:10:00 UTC

提前预下载二进制可避免在升级窗口依赖 GitHub 可用性。

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
所有命令无错误且出现确认信息后，即可视为二进制安装成功。
```
Inference Installed and Verified
--- Final Verification ---
-rwxr-xr-x 1 root root 224376384 Jan  1  2000 .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api
-rwxr-xr-x 1 root root 215172352 Jan  1  2000 .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced
.dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api: OK
.inference/cosmovisor/upgrades/v0.2.7/bin/inferenced: OK
```

**注意**

- 请在升级窗口附近保持在线，以便在出现问题时及时跟进指引。
- Cosmovisor 在升级期间会对 `.inference/data` 目录做完整备份。请确保磁盘空间充足。如磁盘占用较高，可安全删除 `.inference` 中的旧备份：[链接](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)
- 可使用[这些方法](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)缩减较大的 `application.db` 文件。

**可选：跳过 Cosmovisor 备份**

通过为 `node` 容器设置环境变量 `UNSAFE_SKIP_BACKUP=true`，Cosmovisor 支持在升级时跳过自动状态备份。

这可减少磁盘占用和升级时间。但若升级失败，将没有备份可用于回滚。

## 2026年1月7日

**主机重要提示**

在 Cosmovisor 升级时，可通过为 `node` 容器设置环境变量 `UNSAFE_SKIP_BACKUP=true` 来跳过自动备份。此选项有风险——若升级失败，将无法依靠备份恢复状态。

## 2026年1月6日

**v0.2.7 升级提案：创世验证者增强进入治理流程**

与创世验证者增强相关的链上治理提案已发布并开放投票。

近期的网络增长带来多项挑战。过去几天网络经历了多次问题，其中部分似乎源于试图破坏或冲击系统的恶意行为。该提案旨在通过一系列临时措施，在高负载和恶劣条件下增强网络韧性。

创世验证者增强最初在网络早期作为临时防御机制引入，并在运营的前两个月处于活跃状态。当前治理中的提案是为应对当前网络状况，临时重新启用这一现有机制，并启用一些额外的保护措施。

**关键变更**

**创世验证者增强（临时）**

- 临时重新启用创世验证者增强——此前使用的限时防御机制，提议重新启用。
- 网络增长期的共识保护。在其此前运行期间：
    - 三个 Guardian 验证者合计持有约 34% 的共识投票权
    - 未向 Guardian 验证者发放额外奖励
    - 此配置在边缘情形下有助于避免共识停滞
- 满足以下两个条件时，创世验证者增强将自动停用：
    - 全网算力达到 15,000,000
    - 达到区块 3,000,000

**协议稳定性修复（全网范围）**

此升级正式纳入此前通过手动 API 更新分发、已在网络使用的关键修复。包括：

- 解决失败推理请求的错误记账（包括处理了不受支持格式但未标记完成的请求）
- 提升失败推理处理的韧性
- 为 `PoCBatch` 和 `PoCValidation` 交易引入批处理

将其纳入协议，使行为成为全网一致执行的协议级规则。

**临时的参与与执行限制**

- 主机级注册：暂停新主机注册至区块 2,222,222（约两周后）。此举旨在稳定网络并为进一步增长做好准备。
- 开发者级注册：暂停新开发者地址注册。预定义的开发者地址 `allowlist` 立即生效，名单内的开发者地址在此期间可执行推理。针对开发者地址的所有限制（含注册与推理执行）将持续至区块 2,294,222（约 19 天）。

**治理可控机制**

本次升级包含的预备改动，使后续可通过治理控制参与者接入与推理执行，无需额外软件升级。本提案并未启用任何此类治理触发的约束，需额外治理投票。

**第 117 轮奖励分配**

本提案涵盖与链暂停（第 117 轮）相关的两项奖励分配：

- 在第 117 轮活跃但未收到该轮奖励的节点，将补发该轮奖励。
- 所有在第 117 轮活跃的节点将额外获得 1.083× 第 117 轮奖励的统一补发，包括已领取原奖励的节点。

**关于持续时间与执行**

本次升级重新启用或引入的所有保护均为临时措施，且不需手动治理干预即可移除。

**如何投票**

可使用 `inferenced` 命令获取提案详情并提交投票。

查看投票状态：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 19 -o json --node $NODE_URL/chain-rpc/
```

投票（`yes`、`no`、`abstain`、`no_with_veto`）：
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

**时间线与截止**

- 投票结束：2026 年 1 月 8 日 04:23:14 UTC
- 升级提议区块：2,054,000
- 预计升级时间：2026 年 1 月 8 日 08:10:00 UTC

**主机注意事项**

**注意 1**

请审阅提案并投票（如您是主机）。在升级窗口附近保持在线，以便在出现问题时及时跟进指引。

**注意 2**
Cosmovisor 在执行更新时会在 `.inference/data` 状态目录创建完整备份，请确保磁盘空间充足。阅读[此处](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)了解如何安全删除 `.inference` 目录中的旧备份。若 `application.db` 占用空间较大，可使用[这里](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)的方法进行清理。

**参考**

创世验证者增强的完整技术细节：
[https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)

完整技术评审（GitHub PR）：[https://github.com/gonka-ai/gonka/pull/503](https://github.com/gonka-ai/gonka/pull/503)  

## 2026年1月5日

当前网络观测到高于平常的推理遗漏率。在许多情况下，这是由于一个缺陷：不受支持格式的推理请求虽已处理，但未被标记为完成。以下更新解决了这一行为。

参考：[https://github.com/gonka-ai/gonka/pull/517](https://github.com/gonka-ai/gonka/pull/517) 

该 `API` 版本提升了对失败推理处理的韧性，减少了推理遗漏记账问题，并为 PoCBatch 和 PoCValidation 交易引入批处理。

**升级时机**

当确认 PoC 未激活时，应用此更新是安全的。

验证当前状态：
```
curl "http://136.243.34.19:8000/v1/epochs/latest" | jq '.is_confirmation_poc_active'
```
若处于非确认 PoC，返回值应为 `false` 。

**安装**

下载并安装新二进制，然后重启 `API` 容器：
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
