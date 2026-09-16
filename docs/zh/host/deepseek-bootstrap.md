# DeepSeek V4 Flash Bootstrap

`deepseek-ai/DeepSeek-V4-Flash-0731` 已通过引导并自链纪元 360 起在 Gonka 主网的计算证明中处于**活跃**状态（[提案 94](../network-updates.md#august-10-2026)）。以下的时间线和交易示例仍有助于理解激活机制及委托等操作；有关当前部署默认值（包括 `node-config.json`），请参阅 [Host 快速入门](./quickstart.md)。

有关多模型 PoC 机制的更广泛背景，请参阅 [多模型 PoC](./multi_model_poc.md)。先前模型的引导及其机制已记录在 [Kimi K2.6 引导](./kimi-bootstrap.md)、[MiniMax-M2.7 引导](./minimax-bootstrap.md) 和 [GLM-5.3-Flash 引导](./glm-bootstrap.md) 中。

!!! note 
    引导可能需要多个纪元，具体取决于有多少参与者准备就绪。在配置的惩罚纪元之前，如果参与者明确提交其选择且即将部署的主机提交 `PoCIntent`，则不会减少权重。继续提供 MiniMax 但未选择 DeepSeek 的主机在达到 `penalty_start_epoch` 后仍需明确提交 `PoCDelegation` / `PoCRefusal`。DeepSeek 的按模型参与强制执行现已生效（纪元 360）。

!!! note 
    在 Blackwell GPU 上，为获得最佳性能，可使用重新打包为 fp8 + nvfp4 的模型而非 fp8 + fp4，例如 `MJPansa/DeepSeek-V4-Flash-0731-NVFP4`。模型精度相同。使用 `node-config-deepseekv4flash0731-B200-nvfp4.json` / `node-config-deepseekv4flash0731-B300-nvfp4.json` 配置和 API `v0.2.15-post5` —— 详见 [网络更新](../network-updates.md) 中 8 月 13 日的“测试 DeepSeek V4 Flash”备注。

## 治理背景（提案 94）

提案 94 将 DeepSeek V4 Flash 注册为新的 PoC 模型。未修改任何现有参数或模型；唯一更改是新增模型条目。

提案/公告详情：

- 模型：`deepseek-ai/DeepSeek-V4-Flash-0731`（固定版本 `7872f01b1d1fe23eabc4c98b48bffcef5a386062`）
- 需要运行 **vLLM 0.25.1**（MLNode **3.0.16**）的 MLNode，并使用随附的节点配置（B300 / B200 / H200 / H100 对应 `node-config-deepseekv4flash0731-*.json`）
- 链上 PoC `weight_scale_factor` 注册时为 **0.214**；[提案 98](../network-updates.md#august-29-2026) 后提升至 **0.246**。推理 `validation_threshold = 0.90`（处理的 logprobs）
- `penalty_start_epoch = 360`
- 投票于 **2026 年 8 月 12 日 16:05 UTC** / 8 月 12 日 09:05 PDT 结束
- 首次引导尝试在 **纪元 359**；模型组在 **纪元 360** 变为活跃

在投票结束后、纪元 359 快照前 `start_poc − deploy_window` 之前声明 `PoCIntent`。MLNode 镜像在 [`vllm-0.25.1-upgrade`](https://github.com/gonka-ai/gonka/tree/vllm-0.25.1-upgrade/deploy/join) 分支中固定为 3.0.16（`main` 仍固定为 3.0.14-post2）；请使用随附的 DeepSeek `node-config-*.json` 文件。


## 时间线

缺失 DeepSeek V4 Flash 的惩罚从 **纪元 `360`** 开始。自提案激活起，每个纪元链都会尝试引导该模型：在该纪元的 PoC 阶段前捕获 `BootstrapDelegationSnapshot` 500 个区块（来自 `delegation_params.deploy_window` 的 `DeployWindow`），根据 `V_min = 3` 直接提交者和总网络权重的 `W_threshold` 比例（通过 INTENT + DELEGATE 实现 `>2/3` 可达性）评估预资格，并（若预合格）在该纪元启动 DeepSeek 的 PoC。

提案 94 保留当前委托阈值：`w_threshold = 0.1`、`v_min = 3`、`no_participation_penalty = 0.15`、`refusal_penalty = 0.1`。执行后仍需从链上读取实时值：

```bash
curl -s "https://node3.gonka.ai/chain-api/productscience/inference/inference/params" \
  | jq '.params.delegation_params | {deploy_window, w_threshold, v_min, no_participation_penalty, refusal_penalty}'
# Decimal fields use {value, exponent}: e.g. {"value":"1","exponent":-1} → 0.1 (10%).
```

提案执行后确认实时 DeepSeek 条目（包括 `penalty_start_epoch` 和 `weight_scale_factor`）：

```bash
curl -s "https://node3.gonka.ai/chain-api/productscience/inference/inference/params" \
  | jq '.params.poc_params.models[] | select(.model_id=="deepseek-ai/DeepSeek-V4-Flash-0731")'
```

为计算任何给定评估纪元的确切区块号，请以链当前纪元为锚点向前推算。`epoch_shift` 参数不锚定创世块（其在过往纪元长度变化后会过时），因此 `epoch_shift + N * epoch_length` 在主网上是错误的——始终以实时当前 PoC_start 为锚点：

```bash
NODE=https://node3.gonka.ai

PARAMS=$(curl -s "$NODE/chain-api/productscience/inference/inference/params")
EPOCH_LENGTH=$(echo "$PARAMS" | jq -r '.params.epoch_params.epoch_length | tonumber')

CURRENT=$(curl -s "$NODE/v1/epochs/current/participants" | jq '.active_participants')
CURRENT_EPOCH=$(echo "$CURRENT" | jq -r '.epoch_id')
CURRENT_POC_START=$(echo "$CURRENT" | jq -r '.poc_start_block_height')

EPOCH=359                   # change to any target epoch
POC_START=$(( CURRENT_POC_START + (EPOCH - CURRENT_EPOCH) * EPOCH_LENGTH ))
SNAPSHOT_BLOCK=$(( POC_START - 500 ))

echo "Epoch $EPOCH (current $CURRENT_EPOCH): snapshot at block $SNAPSHOT_BLOCK, PoC starts at block $POC_START"
```

DeepSeek 在参与主机加委托覆盖阈值的最早纪元中成为预合格。提案 94 保留了现有模型条目（`MiniMaxAI/MiniMax-M2.7`、`moonshotai/Kimi-K2.6`、`zai-org/GLM-5.2-FP8`）不变。[提案 101](../network-updates.md#proposal-101) 后移除了 Kimi 和 GLM-5.2 的 `poc_params` 并添加了 `zai-org/GLM-5.3-Flash`。


### 可能情景

DeepSeek V4 Flash 的引导可能遵循以下主要情景：

1. **在某纪元快照中 DeepSeek 未通过预评估**（且在 PoC 中仍不合格）：

    - 所有提交 `PoCIntent` 的人保持其全部权重（无惩罚）
    - 所有提交 `PoCDelegation` 的人保持其全部权重（无惩罚）
    - **在纪元 `360` 之前**：所有未提交者及提交 `PoCRefusal` 者均保持其全部权重（宽限期期间惩罚被抑制）
    - **从纪元 `360` 起**：所有未提交者每纪元每漏掉一个模型损失 **15%** 权重（`no_participation_penalty`）；提交 `PoCRefusal` 可避免 15% 的遗漏，但在惩罚纪元激活后仍需承担 `refusal_penalty`（**10%**）

=> 在纪元 `360` 之前明确发送表明您意图的交易至关重要

2. **DeepSeek 通过预评估但未在 PoC 中合格**（例如，INTENT 主机未能及时部署）：

    - 实际部署 DeepSeek 并在该纪元提交 DeepSeek PoC 提交的主机，保持其原有模型组的全部权重（无惩罚）
    - 所有提交 `PoCDelegation` 的人保持其全部权重（无惩罚）
    - **从纪元 `360` 起**：所有未提交者损失 15% 权重；提交 `PoCIntent` 但未部署且未提交 DeepSeek PoC 的人也损失 15%（`IntentMissed` 解决方案）；`PoCRefusal` 承担 10% 的 `refusal_penalty` 而非 15% 的遗漏

若 DeepSeek 通过两项检查，则惩罚遵循 [多模型 PoC](./multi_model_poc.md) 中描述的常规情景。


## 硬件与共识权重

DeepSeek V4 Flash 注册时为 `v_ram = 280`（每个实例约 **280 GB 总 VRAM**）。实时 `weight_scale_factor` 为 **0.246**（[提案 98](../network-updates.md#august-29-2026)；原为 0.214）。相对于运行 MiniMax M2.7 的 8×H100 集群，原始公告（0.214 时）估算：

- 8×H200 最优可产生 **1.46×** 权重运行 MiniMax M2.7
- 8×B200 最优可产生 **2.96×** 权重运行 Kimi K2.6
- 8×B300 在运行 DeepSeek V4 Flash 时最优权重为 **3.37×**

模型的 `weight_scale_factor` 仅在该模型组有资格（具有投票权）时才产生共识权重。请检查 `poc_params` 和 `confirmation_weight_scales`。

实际影响：

- **B300 所有者**：在当前系数下，DeepSeek 是权重最高的选项。请为 vLLM 0.25.1 / MLNode 3.0.16 和 B300 节点配置做好准备。
- **B200 所有者**：在 [提案 101](../network-updates.md#proposal-101) 之后，GLM-5.3-Flash 是 B200 上的预期 PoC 切换模型。DeepSeek 和 MiniMax 仍保留 B200 节点配置。请确认 `/v1/epochs/current/participants` 上的实时服务。参见 [GLM-5.3-Flash 启动指南](./glm-bootstrap.md)。
- **H200 / H100 所有者**：MiniMax M2.7 仍是这些类别的最高权重模型；DeepSeek 配置存在，但切换是可选的，非获得最大权重所必需。
- 完整系数表：[Google Sheet](https://docs.google.com/spreadsheets/d/1Tw4V7xEXR2p5MbCHqzqjS9vHXQ0eI1IHVXC6guEHnio/edit?gid=0#gid=0)

根据模型使用情况，治理仍可调整系数以激励更多 B 系列 GPU 转向 DeepSeek。


## 部署 DeepSeek V4 Flash 的主机说明

#### 将 `PoCIntent` 发送到链上

在提案94的投票结束后、目标纪元快照块之前提交。以下示例使用名为 `--from` 的主机密钥。如需从温密钥提交意向、委托或拒绝，请参阅[如何从温密钥声明PoC意向？](../FAQ.md#how-do-i-declare-a-poc-intent-from-a-warm-key)。

```bash
export NODE=https://node3.gonka.ai/chain-rpc/
./inferenced tx inference declare-poc-intent deepseek-ai/DeepSeek-V4-Flash-0731 \
  --from gonka-api-key \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

#### 预下载权重并验证可部署性

使用提案中指定的Hugging Face固定版本：

- `hf_repo`: `deepseek-ai/DeepSeek-V4-Flash-0731`
- `hf_commit`: `7872f01b1d1fe23eabc4c98b48bffcef5a386062`
- 许可证：**MIT** — 请参阅[模型许可证](../model-licenses.md)和[上游LICENSE](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731/blob/main/LICENSE)。Blackwell nvfp4 重新打包的 `MJPansa/DeepSeek-V4-Flash-0731-NVFP4` (提交 `64d64cd89bc63a66aa46506da89d7821f7491c62`) 也是MIT许可证。

遵循[预下载模型权重](https://gonka.ai/host/quickstart/#server-pre-download-model-weights-to-hugging-face-cache-hf_home)指南。在引导窗口前规划好磁盘空间和带宽——首次尝试时Hugging Face的速率限制可能导致资格失效。

在引导快照块之前，验证模型能否在您的硬件上加载。您需要：

- MLNode 使用 **vLLM 0.25.1**（镜像 **3.0.16**）
- 预配置节点设置：针对您的GPU类型（B300 / B200 / H200 / H100）的 `node-config-deepseekv4flash0731-*.json`

链上将DeepSeek注册为 `Model.ModelArgs`：

```
--max-model-len 400000
--kv-cache-dtype fp8
--tokenizer-mode deepseek_v4
--enable-auto-tool-choice
--tool-call-parser deepseek_v4
--reasoning-parser deepseek_v4
--trust-remote-code
```

部署端标志（`--tensor-parallel-size`、`--enable-expert-parallel`、`--gpu-memory-utilization`、推测/注意力后端标志等）来自为您的硬件提供的 `node-config` —— 不要仅从链 `ModelArgs` 中自行发明这些标志。

#### 等待下一个评估周期并检查预资格

在每个评估周期的快照区块之后，链会发出一个 `bootstrap_model_preeligibility` 事件：

```bash
NODE=https://node3.gonka.ai
MODEL='deepseek-ai/DeepSeek-V4-Flash-0731'

HEIGHT=$(curl -sG "$NODE/chain-rpc/block_search" \
  --data-urlencode "query=\"bootstrap_model_preeligibility.model_id='$MODEL'\"" \
  | jq -r '[.result.blocks[].block.header.height|tonumber]|max')

echo "Latest snapshot at height $HEIGHT"

curl -s "$NODE/chain-rpc/block_results?height=$HEIGHT" \
  | jq --arg m "$MODEL" '
      .result.finalize_block_events[]
      | select(.type=="bootstrap_model_preeligibility")
      | (.attributes | from_entries) as $a
      | select($a.model_id==$m)
      | $a'
```

关键属性是 `pre_eligible`。如果其值为 `true`，则链将在本周期运行 DeepSeek PoC，您应做好部署准备。支持字段显示三项检查中哪些通过：`meets_v_min`（≥ `V_min` 直接意图提交者）、`meets_weight_threshold`（意图权重 ≥ `W_threshold` 的 `total_network_weight`），以及 `meets_reachability`（意图 + 委托 `reachable_voting_power` 覆盖 `>2/3`）。`intent_host_count` 和 `intent_weight` 显示本周期的直接意图覆盖率。

#### 如满足预资格，将模型切换至 DeepSeek V4 Flash

使用与您的 GPU 类型匹配的已发布配置。管理员 API 更新的示例格式（将 args 替换为您的 `node-config-deepseekv4flash0731-*.json` 内容）：

```bash
curl -X POST http://localhost:9200/admin/v1/nodes \
     -H "Content-Type: application/json" \
     -d '{
       "id": "<NODE_ID>",
       "host": "<NODE_IP>",
       "inference_port": 5050,
       "poc_port": 8080,
       "max_concurrent": 500,
       "models": {
         "deepseek-ai/DeepSeek-V4-Flash-0731": {
           "args": [
             "--max-model-len", "400000",
             "--kv-cache-dtype", "fp8",
             "--tokenizer-mode", "deepseek_v4",
             "--enable-auto-tool-choice",
             "--tool-call-parser", "deepseek_v4",
             "--reasoning-parser", "deepseek_v4",
             "--trust-remote-code"
           ]
         }
       }
     }'
```

合并来自已发布配置的操作符标志（张量并行大小、专家并行、GPU 内存利用率、推测解码及任何硬件特定后端）。PoC 开始时的成员资格由提交 PoC 存储提交者决定——仅声明意图是不够的。

#### 验证您的部署

遵循发布的 MLNode 设置说明以及已提交的 DeepSeek 黄金参考（`deepseek-ai-deepseek-v4-flash-0731.json` 在 [`vllm-0.25.1-upgrade`](https://github.com/gonka-ai/gonka/tree/vllm-0.25.1-upgrade/mlnode/packages/benchmarks/scripts/poc_validation/artifacts) 分支）。[`gonka` 仓库](https://github.com/gonka-ai/gonka) 提供了一个代理技能 `mlnode-validate`，用于将已部署的 ML Node 与预计算的诚实 PoC 向量进行验证。参见 [验证 ML Node 部署](./mlnode-validation.md) 和 [`skills/mlnode-validate/SKILL.md`](https://github.com/gonka-ai/gonka/blob/vllm-0.25.1-upgrade/skills/mlnode-validate/SKILL.md)。


## 不部署 DeepSeek V4 Flash 的主机说明

保留 MiniMax 没有问题——现有模型不受提案 94 影响。DeepSeek 的每模型参与强制执行现已生效（周期 **`360`**）。如果您未提供 DeepSeek，请提交**委托**（如果您信任某个 DeepSeek 主机则优先选择）或**拒绝**，以免被视为遗漏模型。拒绝可避免 15% 的遗漏惩罚，但仍需承担 10% 的 `refusal_penalty`。已选择 DIRECT、DELEGATE 或 REFUSE 的主机无需重新提交。

#### 检查您是否信任任何将部署 DeepSeek / 发送 `PoCIntent` 的主机

```python
import time
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

NODE = "https://node3.gonka.ai"
MODEL = "deepseek-ai/DeepSeek-V4-Flash-0731"
TIMEOUT = 60
DELAY = 0.15

def session():
    s = requests.Session()
    # Retry transient 5xx (node3 returns 503 for some poc_delegation lookups
    # under load) so a single hiccup does not silently drop a participant
    # from the result.
    retry = Retry(
        total=5,
        backoff_factor=0.5,
        status_forcelist=(502, 503, 504),
        allowed_methods=("GET",),
    )
    s.mount("https://", HTTPAdapter(max_retries=retry))
    s.headers["Connection"] = "close"
    return s

def weight(p):
    # weight may be 0, missing, or literally null — all mean "no voting weight".
    return int(p.get("weight") or 0)

def get_json(s, url):
    r = s.get(url, timeout=TIMEOUT)
    r.raise_for_status()
    return r.json()

s = session()

participants = get_json(s, f"{NODE}/v1/epochs/current/participants")[
    "active_participants"
]["participants"]

intents = []
with_deepseek_model = []
skipped = []  # participants whose poc_delegation lookup failed after retries

for p in participants:
    addr = p["index"]
    w = weight(p)
    if MODEL in (p.get("models") or []):
        with_deepseek_model.append((addr, w))

    try:
        resp = get_json(
            s,
            f"{NODE}/chain-api/productscience/inference/inference/poc_delegation/{addr}",
        )
    except requests.RequestException as e:
        skipped.append((addr, w, str(e)))
        time.sleep(DELAY)
        continue

    for i in resp.get("intents") or []:
        if i.get("model_id") == MODEL:
            intents.append((addr, w))
    time.sleep(DELAY)

total = sum(weight(p) for p in participants)
intent_weight = sum(w for _, w in intents)

nonzero_intents = [(a, w) for a, w in intents if w > 0]
zero_intents = [(a, w) for a, w in intents if w == 0]

print(f"Active participants: {len(participants)}")
print(f"With {MODEL} in models[]: {len(with_deepseek_model)} (not same as intent)")
print()
print("Intent from (PoCDirectIntent on chain):")
for addr, w in nonzero_intents:
    print(f"  {addr} : {w}")
if zero_intents:
    print()
    print("Zero-weight intents (count toward V_min, contribute 0 to W_threshold):")
    for addr, _ in zero_intents:
        print(f"  {addr} : 0")
print()
print(f"Intent weight: {intent_weight} / {total}")
if total:
    print(f"Intent share: {100.0 * intent_weight / total:.2f}%")
if skipped:
    print()
    print(f"Skipped {len(skipped)} participants after retries (intent may be undercounted):")
    for addr, w, err in skipped:
        print(f"  {addr} (weight={w}): {err}")
```

引导期间委托时：**不要委托给守护节点**；将权重分散到独立的 DeepSeek 主机上。有关更新的委托指南，请参阅 [多模型 PoC](./multi_model_poc.md)。

#### 发送委托或拒绝

委托：

```bash
export NODE=https://node3.gonka.ai/chain-rpc/
./inferenced tx inference set-poc-delegation deepseek-ai/DeepSeek-V4-Flash-0731 <DELEGATEE> \
  --from gonka-account-key \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

拒绝：

```bash
export NODE=https://node3.gonka.ai/chain-rpc/
./inferenced tx inference refuse-poc-delegation deepseek-ai/DeepSeek-V4-Flash-0731 \
  --from gonka-account-key \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```
