# 发布公告

## 2026 年 1 月 6 日

v0.2.7 升级提案：Genesis 验证者增强机制进入治理投票

一项与 Genesis 验证者增强机制（Genesis Validator Enhancement） 相关的链上治理提案现已发布，并正式开启投票。

随着近期网络规模的快速增长，系统面临了一些新的挑战。过去几天内，网络出现了多起异常情况，其中部分似乎源于有意的干扰或压力测试行为。本提案旨在通过一组临时性措施，在更高负载和不利环境下增强网络的整体韧性与稳定性。

Genesis 验证者增强机制最初是在网络早期阶段作为一种临时防御机制引入的，并在网络运行的前两个月内启用。本次提交治理的提案，旨在基于当前网络状况，临时重新启用该既有机制，并同步激活若干附加的防护措施。



主要变更内容

一、Genesis 验证者增强机制（临时）
 • 临时重新启用 Genesis 验证者增强机制
该机制曾在早期网络中使用，是一种具有时限的防御性方案，本提案建议在当前阶段重新激活。
 • 网络增长期的共识保护机制
在该机制此前运行期间：
 • 3 个 Guardian 验证者合计持有约 34% 的共识投票权
 • Guardian 验证者 未获得任何额外奖励
 • 该配置有效避免了部分边缘情况下的共识停滞问题
 • 自动失效条件
当以下两个条件 同时满足 时，Genesis 验证者增强机制将自动停用：
 • 全网算力达到 15,000,000
 • 区块高度达到 3,000,000



二、协议稳定性修复（全网范围）

本次升级将此前通过手动 API 更新方式分发、并已在网络中实际使用的一系列关键修复，正式纳入协议层规则，包括：
 • 修复推理失败请求的错误计账问题
（包括对不支持格式的请求已被处理但未标记为完成的情况）
 • 提升推理失败场景下的系统稳定性
 • 为 PoCBatch 与 PoCValidation 交易引入批处理机制

通过将上述修复写入协议层，可确保其在整个网络中 以一致的规则执行。



三、临时参与与执行限制

1. Host（主机）级别注册限制
 • 新 Host 的注册将在区块高度 2,222,222 前暂停
（预计约两周）
 • 该措施旨在稳定当前网络状态，并为下一阶段增长做好准备

2. 开发者级别注册限制
 • 在稳定期内，将暂停新的开发者地址注册
 • 一份预设开发者白名单将立即生效
 • 白名单内的开发者地址在此期间仍可执行推理任务
 • 所有针对开发者地址的限制（包括注册与推理执行）将持续至区块高度 2,294,222
（预计约 19 天）


四、治理可控机制（预备）

本次升级包含若干预备性改动，使未来可以通过治理投票来控制参与者接入和推理执行，而无需再次进行软件升级。

⚠️ 注意：
本提案 不包含 任何立即生效的、由治理直接触发的限制措施；相关能力需在未来通过额外治理投票单独启用。


五、Epoch 117 奖励补发说明

本提案同时涵盖与 Epoch 117 链停机事件 相关的两项奖励分配：
 1. 在 Epoch 117 期间保持活跃、但未收到当期奖励的节点，将补发该 Epoch 的奖励；
 2. 所有在 Epoch 117 期间保持活跃的节点，将获得一笔 等同于 Epoch 117 奖励 1.083 倍的额外补偿，该补偿将统一发放，包括已收到原始奖励的节点。


六、关于持续时间与执行方式的说明
 • 本次升级中重新启用或引入的所有防护措施均为临时性
 • 无需人工治理干预，相关机制将在条件满足后自动失效


投票方式

你可以使用 inferenced 命令获取提案详情并进行投票。

查询投票状态
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced query gov votes 19 -o json --node $NODE_URL/chain-rpc/
```

投票方式（ `yes` / `no` / `abstain` / `no_with_veto` ）
```
export NODE_URL=http://node1.gonka.ai:8000
./inferenced tx gov vote 19 yes \
  --from <cold_key_name> \
  --keyring-backend file \
  --unordered \
  --timeout-duration=60s \
  --gas=2000000 \
  --gas-adjustment=5.0 \
  --node $NODE_URL/chain-rpc/ \
  --chain-id gonka-mainnet \
  --yes
```


时间节点与截止时间
 • 投票截止时间：2026 年 1 月 8 日 04:23:14（UTC）
 • 升级提案区块高度：2,054,000
 • 预计升级时间：2026 年 1 月 8 日 08:10:00（UTC）


⚠️ 主机（Host）重要提醒

提醒一
如果你是主机，请务必审阅该提案并参与投票。
请在升级窗口期间保持在线，以便在出现问题时按指引进行处理。

提醒二
Cosmovisor 在执行升级时，会在 .inference/data 目录下自动创建完整备份。
请提前确认磁盘空间充足。
如需清理旧备份，可参考相关文档安全删除 .inference 目录中的历史备份文件。

如果你的 application.db 占用空间较大，也可以参考相关方法进行清理。


感谢大家的配合与支持！

## 2026 年 1 月 5 日

目前网络中观察到高于平常水平的 inference 丢失率。

在许多情况下，这是由于一个 bug 导致的：当 inference 请求使用了不受支持的格式时，即使请求本身已被处理，该 inference 也未被标记为已完成。以下更新修复了这一行为。

参考链接：[https://github.com/gonka-ai/gonka/pull/517](https://github.com/gonka-ai/gonka/pull/517)

该 `API` 版本提升了对 inference 失败场景的鲁棒性，减少了 inference 丢失的统计问题。同时引入了对 PoCBatch 和 PoCValidation 交易的批处理支持。

**升级时机**

当 Confirmation PoC 未激活时，可以安全地应用此更新。

用于验证当前状态：

```
curl "http://136.243.34.19:8000/v1/epochs/latest" | jq '.is_confirmation_poc_active'
```
在非 Confirmation PoC 期间，该值应返回 `false`。

**安装**

下载并安装新的二进制文件，然后重启 `API` 容器：
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
