# 公告

## 2026年1月19日

**提案更新：稳定期延长已获批准**

关于延长稳定期的最新治理投票已成功通过。稳定期现已正式延长，以便进行更多测试和网络升级。

**主机（Hosts）需要采取的行动**

随着延期确认，请利用这段时间为新的 PoC 要求做好环境准备。

- 模型更新：请将你的 ML 节点切换至 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 模型。
- 逐步部署：如果你运营多个 ML 节点，建议在多个 epoch 中逐步完成这些更新。

**如何更新**

有关更新现有 ML 节点的说明，请参阅：[https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)

## 2026年1月16日

**稳定期延长**

当前有一项新的治理投票正在进行中。

该提案将当前的稳定期延长约两周。延长的时间将用于与即将到来的 PoC 变更及相关网络升级有关的额外测试。关于新的 PoC 开发进展的更多细节可参见此处：
[https://github.com/gonka-ai/gonka/blob/gm/poc-status/proposals/governance-artifacts/poc-update-status.md](https://github.com/gonka-ai/gonka/blob/gm/poc-status/proposals/governance-artifacts/poc-update-status.md)

此次延长也为 Hosts 提供了时间，以便为新的 PoC 要求准备其部署环境，包括将其 ML Nodes 切换到 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 模型。
有关更新现有 ML Node 的说明请参见：
[https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode](https://gonka.ai/host/mlnode-management/#updating-an-existing-mlnode)
运行多个 ML Nodes 的 Hosts 被建议在多个 epoch 中逐步完成更新。

**投票范围**

如果提案获得通过，网络将在临时期间继续按照现有的 `allowlist` 运行（该列表由未表现出非标准硬件行为的 Hosts 组成）。

Developers 的 `allowlist` 将按相同的时间偏移进行延长，并持续有效至区块 2459375。

未被纳入 `allowlist` 的 Hosts 在延长的稳定期内仍将无法参与 PoC，该稳定期将于区块 2443558 结束。

**可复现性与方法论**

`allowlist`:

- 可在此处获取：[https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)
	•	基于公开可观察的链上数据生成，并使用一组预定义的硬件配置模式。这些模式通过开源脚本进行评估，脚本地址为：[https://github.com/product-science/filter](https://github.com/product-science/filter)

**执行特性**

- 若提案获批，`allowlist` 将自动延长。
- 无需进行软件升级。
- 如需进一步调整，仍需通过治理流程决定。

**稳定期结束后**

`allowlist` 具有固定的到期时间，不会在延长的稳定期结束后继续生效。当 `allowlist` 于区块 2443558 到期后：

- 网络将恢复到稳定期之前生效的标准参与规则，或
- 任何替代配置都必须通过单独的治理决议来定义。

**如何投票**

你可以使用 inferenced 命令获取提案详情并进行投票。

请注意，任何正在运行的节点都可用于查询或投票。当前可用的节点包括：

- http://node1.gonka.ai:8000/ 
- http://node2.gonka.ai:8000/
- http://node3.gonka.ai:8000/ 
- https://node4.gonka.ai/ 

查询投票状态：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 22 -o json --node $NODE_URL/chain-rpc/
```

进行投票 ( `yes` , `no` , `abstain` , `no_with_veto` ):
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

**投票后的下一步**

该流程完全通过治理机制处理，不需要进行软件升级。

**时间线与截止时间**

投票结束时间：2026年1月18日 05:28:01（UTC）
`Allowlist` 到期时间：在区块 2443558 自动到期。

## 2026 年 1 月 10 日

**临时参与者 `allowlist` 修正**

目前一项新的治理投票已开启。本提案通过将若干地址加入[allowlist](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv) 
，修复了现有过滤逻辑中的一个边缘问题：这些地址此前因硬件名称为空、且 ML Node 权重为 0，而被错误地过滤。

同时，该提案还将少量开发者账户加入允许的开发者列表，并将 `allowlist` 的过期时间与参与者注册截止区块高度 2,222,222 保持一致。

所有参与相关逻辑均保持不变。本提案仅用于修复当前过滤逻辑中的一处轻微问题。

**可复现性与方法论**

`allowlist` 基于公开可观察的链上数据生成，并使用一组预定义的硬件配置模式进行筛选。这些模式通过以下开源脚本进行评估：

https://github.com/product-science/filter

`allowlist` 文件地址如下：

https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv

**如何投票**

你可以使用 inferenced 命令获取提案详情并进行投票。

请注意：任何正在运行的节点均可用于查询或投票。目前可用的节点包括：

- http://node1.gonka.ai:8000/
- http://node3.gonka.ai:8000/
- https://node4.gonka.ai/

 
查看投票状态：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 21 -o json --node $NODE_URL/chain-rpc/
```

进行投票 ( `yes` , `no` , `abstain` , `no_with_veto` ):
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

**投票完成后的后续步骤**

本流程完全通过链上治理完成，不需要进行任何软件升级。

**时间安排与截止节点**

投票结束时间：2026 年 1 月 12 日 06:04:14（UTC）

`allowlist` 过期时间：将在区块高度 2,222,222 时自动失效


## 2026 年 1 月 10 日

**临时参与者 `allowlist` 已通过，于 Epoch 135 生效**

针对稳定期设置的临时参与者 `allowlist` 的链上治理投票已正式结束。

该提案已获通过。本提案定义了一份临时 `allowlist`，用于反映在最近多个 Epoch 中行为保持一致的参与者。

---

**当前已生效的关键调整**

1）网络将启用一份由以下条件筛选出的参与者组成的 `allowlist`。这些参与者在多个 Epoch 中：

* 上报的硬件特征符合常见的配置模式
  （被过滤的非标准配置字符串列表见此处：
  [https://github.com/product-science/filter/blob/main/filter_strings.txt）](https://github.com/product-science/filter/blob/main/filter_strings.txt）)
* 所展示的 PoC 权重不超过同类硬件观测权重的 **150%**

2）此前持续偏离上述模式的参与者，将在稳定窗口结束（区块高度 **2,222,222**）之前被暂时排除在 `allowlist` 之外。

---

**执行特性说明**

* `allowlist` 将从下一个 Epoch（**Epoch 135**）开始生效
* 激活时点为 **Epoch 135 的首次 PoC**
* 无需进行任何软件升级
* 自激活起，`allowlist` 将持续生效，直至并包含区块高度 **2,222,222**

---

**可复现性与方法论**

* `allowlist` 完全基于公开可观察的链上数据生成
* 硬件描述信息通过开源脚本，与一组预定义的配置模式进行比对与评估：
  [https://github.com/product-science/filter](https://github.com/product-science/filter)
* 最终生成的 `allowlist` 已发布于以下地址：
  [https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)

---

**后续步骤**

节点主机（Hosts）无需采取任何操作。

## January 8, 2026

**行动刻不容缓：稳定期临时参与者 `allowlist`  治理投票现已开启**

在成功采用修复 PoC 相关共识故障的补丁之后，一项关于稳定期临时参与者`allowlist` 的治理投票现已正式激活。

随着正常区块生产恢复，网络将在进一步扩容之前进入一个短暂的稳定期。

本次治理投票旨在为稳定期定义一份参与者 `allowlist` ([https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv))

该`allowlist` 反映了一组在此前运行过程中，其行为始终符合网络预期的参与者。

---

**投票范围**

若提案通过，网络将在稳定期内基于 `allowlist` 运行。该名单由在过往多个 epoch 中未表现出非标准硬件行为的参与者组成。

在实际评估中，Allowlist 对应的是这样一组参与者，其在多个 epoch 中同时满足以下条件：
 • 其上报的硬件特征将与一组预定义、常见的硬件配置模式进行比对，用于识别偏差与不一致
 • 用于排除参与者的非标准硬件配置字符串的完整且明确列表见此处：
[https://github.com/product-science/filter/blob/main/filter_strings.txt](https://github.com/product-science/filter/blob/main/filter_strings.txt))
 • 其观测到的 PoC 权重不得超过 使用可比硬件的其他参与者所展示权重的 150%

此前持续表现出与上述模式存在偏差的参与者，将在稳定期结束（区块 2222222）之前被明确排除在 `allowlist` 之外。

---

**可复现性与方法论**

`allowlist` 完全基于公开、可观测的链上数据生成，并通过一组预定义的硬件配置模式推导而来。

相关模式通过开源脚本进行评估，脚本可在此处获取：
 [https://github.com/product-science/filter](https://github.com/product-science/filter)

`allowlist` 名单可在此处查看：
 [https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv](https://github.com/product-science/filter/blob/main/artifacts_end2end/allowlist.csv)

---

**执行特性**

 • 若提案通过， `allowlist` 将自动生效
 • 无需进行任何软件升级
 •  `allowlist` 将在投票成功后、区块 2089140 对应的下一次 PoC 执行完成后激活
 • 自激活起， `allowlist` 将持续生效，直至并包含区块 2222222
 • 如需进一步调整，仍需通过治理流程决定

**稳定期结束之后w**

---

`allowlist` 设定了固定的到期时间，不会在稳定期结束后继续生效。

当 `allowlist` 于区块 2222222 到期后：
 • 网络要么恢复至稳定期之前生效的标准参与规则，
 • 要么任何替代性配置均需通过单独的治理提案加以定义。


**如何投票**

可使用 `inferenced`命令查询提案详情并提交投票。
请注意：任一在线节点均可用于查询或投票。

当前可用节点包括：

- http://node1.gonka.ai:8000/
- http://node2.gonka.ai:8000/
- https://node4.gonka.ai/

---

查看投票状态：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 20 -o json --node $NODE_URL/chain-rpc/
```

提交投票 ( `yes` , `no` , `abstain` , `no_with_veto` ):
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

整个流程将完全通过治理机制处理，无需进行任何软件升级。

---

**时间线与截止时间**

 • 投票结束时间：2026 年 1 月 10 日 06:46:52（UTC）
 • `Allowlist` 激活时间：区块 2089140 对应的下一次 PoC 执行后
 •`Allowlist` 失效时间：区块 2222222 自动失效

---

如您是主机（Host），请审阅该治理提案并积极参与投票。


## 2026 年 1 月 8 日

**网络更新 — 共识已恢复**

在补丁完成部署之后，网络共识已恢复稳定，目前已在正常参数范围内运行。

---

## 2026 年 1 月 8 日

**网络更新 — 补丁已准备就绪，可部署**

用于解决在 PoC 期间观察到的共识故障 的补丁现已可用。

[指引](https://gonka.ai/FAQ/#upgrade-v027)

为恢复可靠的共识推进，需要**至少 67% **的活跃网络算力完成补丁安装。
在达到该阈值之前，共识推进可能仍处于不稳定状态。

**鼓励主机尽快应用补丁，并在升级完成后保持节点在线。如有需要，将发布进一步指引。**


---


## 2026 年 1 月 8 日

**网络更新 — 后续说明**

用于解决近期共识问题的补丁已准备就绪，详细部署指引将很快发布。
每一位活跃主机的参与对于网络继续推进并恢复正常运行都至关重要。

请保持节点在线，并在指引发布后准备好应用更新。

---

## 2026 年 1 月 8 日

**网络更新 — PoC 期间出现共识故障**

在 计算证明（Proof-of-Compute，PoC） 过程中，网络出现了共识故障。
问题已被识别，用于解决根本原因的补丁正在准备中。

后续操作说明和技术细节将很快发布。
建议主机保持在线并持续关注更新，在补丁发布后可能需要执行进一步操作。

---

## 2026 年 1 月 8 日

**v0.2.7 升级提案：创世验证者增强机制已在主网上线**

链上治理对 v0.2.7 升级提案：创世验证者增强（Genesis Validator Enhancement） 的投票已结束；该提案已获批准并成功部署至主网。

*现已生效的关键变更**

**创世验证者增强（临时）**

 • 临时重新启用创世验证者增强机制——该机制是一项此前使用过、具有明确时效性的防御性机制，本次提案建议重新启用。
 • 用于网络增长阶段的共识保护。在其此前运行期间：
 • 三个 Guardian 验证者合计持有约 34% 的共识投票权
 • 未向 Guardian 验证者提供任何额外奖励
 • 该配置在边缘情形下有效防止了共识停滞
 • 当同时满足以下两个条件时，创世验证者增强机制将自动停用：
 • 全网算力达到 15,000,000
 • 区块高度达到 3,000,000

---
**协议稳定性修复（全网范围）**

本次升级正式纳入此前通过手动 API 更新分发、且已在网络中实际使用的一系列关键修复。这些修复包括：
 • 修复失败推理请求的错误记账问题（包括处理了不受支持格式的请求但未被标记为完成的情形）
 • 提升网络在失败推理处理方面的鲁棒性
 • 为 `PoCBatch` 和 `PoCValidation`交易引入批处理机制

通过将上述修复纳入本次升级，其行为将成为协议级规则，并在全网范围内一致执行。

---

**临时参与与执行限制**
 • 主机级注册：
新主机注册将暂停至区块 2,222,222（约两周后）。该措施旨在稳定网络状态并为进一步扩展做好准备。
 • 开发者级注册与执行：
在稳定期内，新开发者地址注册将被暂停。
一份预定义的开发者地址`allowlist`将立即生效，`allowlist`中的开发者地址在此期间可以执行推理任务。
所有适用于开发者地址的限制（包括注册与推理执行）将持续生效至区块 2,294,222（约 19 天）。

---

**治理可控机制**

本次升级包含的预备性改动，使得未来可通过治理机制来控制参与者接入与推理执行，而无需额外的软件升级。
本提案本身并未启用任何由治理触发的限制措施，任何此类约束均需通过后续单独的治理投票决定。

---

**第 117 轮（Epoch 117）奖励分配**

本提案涵盖与链暂停（第 117 轮）相关的两项奖励分配：
 • 在 第 117 轮期间保持活跃但未收到该轮奖励的节点，将获得该轮奖励的补发
 • 所有在第 117 轮期间保持活跃的节点，将额外获得一笔等同于第 117 轮奖励 1.083 倍的补发
 • 该补发将统一适用于所有符合条件的节点，包括已收到原始奖励的节点

---

**关于持续时间与执行**

本次升级中重新启用或引入的所有保护机制均为临时措施，并且在满足条件后将自动移除，无需人工治理干预。

---

**后续步骤**
 • 主机无需采取任何进一步操作
 • Cosmovisor 在执行更新时，会在`.inference`  状态目录中创建完整备份
 • 为安全执行更新，建议预留 250 GB 以上的可用磁盘空间
 • 请参考相关文档，了解如何安全清理  `.inference` 目录中的旧备份

---

**备注**
 • 创世验证者增强机制的完整技术细节：
[https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)
 • 完整技术评审（GitHub PR）：
[https://github.com/gonka-ai/gonka/pull/503](https://github.com/gonka-ai/gonka/pull/503) 

---

 

## 2026 年 1 月 7 日

**v0.2.7** 版本升级提案已通过治理批准

**升级详情**

 • 升级高度：区块 2,054,000
 • 预计时间：2026 年 1 月 8 日 08:10:00（UTC）

为避免在升级窗口期间依赖 GitHub 的可用性，建议提前预下载相关二进制文件。

---

**升级准备与二进制安装**

说明：当所有命令均无错误完成，并显示确认信息时，即可视为二进制已成功安装。

```
# 1. 创建目录
sudo mkdir -p .dapi/cosmovisor/upgrades/v0.2.7/bin \
              .inference/cosmovisor/upgrades/v0.2.7/bin && \

# 2. DAPI：下载 → 校验 → 解压至 bin → 赋予可执行权限
wget -q -O decentralized-api.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.7/decentralized-api-amd64.zip" && \
echo "03555ba60431e72bd01fe1fb1812a211828331f5767ad78316fdd1bcca0e2d52 decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.7/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api && \
echo "DAPI Installed and Verified" && \

# 3. Inference：下载 → 校验 → 解压至 bin → 赋予可执行权限
sudo rm -rf inferenced.zip .inference/cosmovisor/upgrades/v0.2.7/bin/ && \
wget -q -O inferenced.zip "https://github.com/gonka-ai/gonka/releases/download/release%2Fv0.2.7/inferenced-amd64.zip" && \
echo "b7c9034a2a4e1b2fdd525bd45aa32540129c55176fd7a223a1e13a7e177b3246 inferenced.zip" | sha256sum --check && \
sudo unzip -o -j inferenced.zip -d .inference/cosmovisor/upgrades/v0.2.7/bin/ && \
sudo chmod +x .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced && \
echo "Inference Installed and Verified" && \

# 4. 清理与最终校验
rm decentralized-api.zip inferenced.zip && \
echo "--- 最终校验 ---" && \
sudo ls -l .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api && \
sudo ls -l .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced && \
echo "d07e97c946ba00194dfabeaf0098219031664dace999416658c57b760b470a74 .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api" | sudo sha256sum --check && \
echo "09c0e06f7971be87ab00fb08fc10e21ff86f9dff6fc80d82529991aa631cd0a9 .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced" | sudo sha256sum --check
```

当上述命令全部成功执行并显示 OK 后，即可确认二进制安装完成。

```
Inference 已安装并完成校验
--- 最终校验 ---
-rwxr-xr-x 1 root root 224376384 Jan  1  2000 .dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api
-rwxr-xr-x 1 root root 215172352 Jan  1  2000 .inference/cosmovisor/upgrades/v0.2.7/bin/inferenced
.dapi/cosmovisor/upgrades/v0.2.7/bin/decentralized-api: OK
.inference/cosmovisor/upgrades/v0.2.7/bin/inferenced: OK
```

**注意事项**
 • 请在升级窗口前后保持节点在线，以便在出现问题时及时按照指引进行处理。
 • Cosmovisor 在升级过程中会对 `.inference/data`目录创建完整备份。请确保磁盘空间充足。
 • 若磁盘占用较高，可[安全删除](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory)`.inference`目录中的旧备份。
 • 较大的 `application.db` 文件可通过[相应方法](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)进行缩减。

---

**可选项：跳过 Cosmovisor 自动备份（高风险）p**

Cosmovisor 支持在升级时通过为`node`容器设置环境变量
 `UNSAFE_SKIP_BACKUP=true` 
来跳过自动状态备份。

此选项可能减少磁盘占用并缩短升级时间。
但请注意：若升级失败，将没有任何备份可用于恢复此前状态。

---

2026 年 1 月 7 日January 7, 2026

**主机重要提示**

在 Cosmovisor 升级过程中，可选择通过为`node` 容器设置
 `UNSAFE_SKIP_BACKUP=true`
来跳过自动备份。

该选项具有明确风险：一旦升级失败，将无法依赖备份进行状态恢复。
请主机在充分评估风险后再行使用。


---

## 2026 年 1 月 6 日

**v0.2.7 升级提案：创世验证者增强机制进入治理阶段**

一项与创世验证者增强机制（Genesis Validator Enhancement）相关的链上治理提案已发布，目前已进入投票阶段。

近期网络规模的快速增长带来了新的运行压力。过去数日内，网络出现了多起问题，其中部分表现为在高负载或异常条件下对系统稳定性的冲击。
本提案旨在通过一组临时性措施，在当前网络条件下提升整体韧性与稳定性。

创世验证者增强最初在网络早期阶段作为临时防御机制引入，并在网络运行的前两个月处于启用状态。
本次进入治理的提案，拟在当前网络环境下临时重新启用该既有机制，并同时启用若干附加的保护措施。

---

**关键变更**

**创世验证者增强机制（临时）**

• 临时重新启用创世验证者增强机制——该机制为此前使用过的、具有明确期限的防御措施。
 • 在网络增长阶段提供额外的共识保护。在其此前启用期间：
 • 三个 Guardian 验证者合计持有约 34% 的共识投票权
 • Guardian 验证者未获得任何额外奖励
 • 该配置在部分边缘情况下有助于避免共识停滞
 • 当同时满足以下两个条件时，创世验证者增强将自动停用：
 • 全网算力达到 15,000,000
 • 区块高度达到 3,000,000

**协议稳定性修复（全网范围）**

本次升级将正式纳入此前通过手动 API 更新分发、且目前已在网络中实际使用的一组关键修复，包括：
 • 修正失败推理请求的错误记账问题
（包括：处理了不受支持格式的请求，但未被正确标记为完成的情形）
 • 提升失败推理处理流程的整体稳定性
 • 为 `PoCBatch`与 `PoCValidation`交易引入批处理机制

将上述修复纳入协议后，其行为将作为协议级规则，在全网范围内保持一致执行。

---

**临时参与与执行限制**

• 主机级注册限制：
新主机注册将暂停至区块 2,222,222（约两周后）。
该措施旨在稳定当前网络状态，并为后续扩展做好准备。
 • 开发者级注册与执行限制：
 • 新开发者地址注册将在稳定期内暂停
 • 一份**预定义的开发者地址白名单（`allowlist`）**将立即生效
 • 白名单内的开发者地址在此期间可继续执行推理
 • 所有适用于开发者地址的限制（包括注册与推理执行）将持续至区块 2,294,222（约 19 天）

**治理可控机制（预备）** 

本次升级包含若干预备性改动，使未来可通过治理方式控制参与者接入与推理执行，而无需再次进行软件升级。
本提案本身不会启用任何新的治理触发型限制，相关功能需通过后续治理投票单独激活。

**第 117 轮奖励分配（Epoch 117）**

This proposal covers two reward distributions related to chain halt (epoch 117):

本提案涵盖与**链暂停期间（第 117 轮）**相关的两项奖励分配：
 • 在第 117 轮期间处于活跃状态但未收到该轮奖励的节点，将补发该轮奖励
 • 所有在第 117 轮期间处于活跃状态的节点，将获得一次额外奖励，金额为
1.083 × 第 117 轮奖励
该补发将统一适用于所有符合条件的节点，包括已领取原始奖励的节点。


**关于持续时间与执行**

本次升级中重新启用或引入的所有保护措施均为临时性机制，
并将在满足既定条件后自动失效，无需额外的人工治理干预。

**如何投票**

可使用 `inferenced`命令获取提案详情并提交投票。

查看投票状态：
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 19 -o json --node $NODE_URL/chain-rpc/
```

提交投票 ( `yes` , `no` , `abstain` , `no_with_veto` ):
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

**时间线与关键节点**

 • 投票结束时间：2026 年 1 月 8 日 04:23:14（UTC）
 • 升级提议区块高度：2,054,000
 • 预计升级时间：2026 年 1 月 8 日 08:10:00（UTC）

**主机注意事项**

**注意事项 1**

请主机审阅提案并参与投票。在升级窗口前后保持在线，以便在出现问题时及时按照指引操作。

**注意事项 2**

Cosmovisor 在执行升级时会在 `.inference/data`  状态目录创建完整备份。
请确保磁盘空间充足。如磁盘占用较高，可[安全清理](https://gonka.ai/FAQ/#how-much-free-disk-space-is-required-for-a-cosmovisor-update-and-how-can-i-safely-remove-old-backups-from-the-inference-directory) `.inference` 目录中的旧备份。
若 application.db 文件体积较大，可使用[相应方法](https://gonka.ai/FAQ/#why-is-my-applicationdb-growing-so-large-and-how-do-i-fix-it)进行清理。


**参考资料**

 • 创世验证者增强机制完整技术说明：
[https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection](https://github.com/gonka-ai/gonka/tree/main/proposals/early-network-protection)
 • 完整技术评审（GitHub PR）：
 [https://github.com/gonka-ai/gonka/pull/503](https://github.com/gonka-ai/gonka/pull/503) 


## 2026 年 1 月 5 日
#推理请求丢失率异常问题修复说明

近期我们在网络运行监控中发现，部分时段的推理（Inference）请求丢失率高于正常水平。经排查确认，在多数情况下，该问题由一个已知 Bug 导致：

当推理请求使用了当前版本尚不支持的请求格式时，即使该请求已被成功处理，系统也未能将其正确标记为「已完成」，从而在统计层面被计为丢失。

目前，该问题已在最新版本中完成修复，相关异常行为已被纠正。

参阅：[https://github.com/gonka-ai/gonka/pull/517](https://github.com/gonka-ai/gonka/pull/517) 

**升级时机说明**

当 确认型 PoC（Confirmation PoC）尚未激活 时，可安全进行本次更新。

本次更新主要内容包括：

修复推理请求在特定格式下未被正确标记完成的问题。

提升`API` 在推理失败场景下的稳定性，显著降低统计层面的推理丢失率。

新增对 PoC 批处理（PoCBatch） 与 PoC 验证交易（PoCValidation） 的批量处理支持，进一步提升网络处理效率。

可通过以下命令验证当前网络状态：
```
curl "http://136.243.34.19:8000/v1/epochs/latest" | jq '.is_confirmation_poc_active'
```
在非确认型 PoC 阶段，该字段应返回 `false` 。

**安装**

下载并安装新的二进制文件，然后重启 `API` 容器：

```
# 下载二进制文件
sudo rm -rf decentralized-api.zip .dapi/cosmovisor/upgrades/v0.2.6-post12/ .dapi/data/upgrade-info.json
sudo mkdir -p  .dapi/cosmovisor/upgrades/v0.2.6-post12/bin/
wget -q -O  decentralized-api.zip 'https://github.com/product-science/race-releases/releases/download/release%2Fv0.2.6-post12/decentralized-api-amd64.zip' && \
echo "f0d1172a90ca4653035e964abe4045f049d03d6060d6519742110e181b1b2257  decentralized-api.zip" | sha256sum --check && \
sudo unzip -o -j  decentralized-api.zip -d .dapi/cosmovisor/upgrades/v0.2.6-post12/bin/ && \
sudo chmod +x .dapi/cosmovisor/upgrades/v0.2.6-post12/bin/decentralized-api && \
echo "API 已安装并完成校验"


# 链接二进制文件
echo "--- 最终校验 ---" && \
sudo rm -rf .dapi/cosmovisor/current
sudo ln -sf upgrades/v0.2.6-post12 .dapi/cosmovisor/current
echo "4672a39c3a3a0a2c21464c227a3f36e9ebf096ecc872bf9584ad3ea632752a3e .dapi/cosmovisor/current/bin/decentralized-api" | sudo sha256sum --check && \


# 重启 
source config.env && docker compose up api --no-deps --force-recreate -d
```
