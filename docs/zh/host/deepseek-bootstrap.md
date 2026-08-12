# DeepSeek V4 Flash Bootstrap

`deepseek-ai/DeepSeek-V4-Flash-0731` 作为由[提案94](../network-updates.md#august-10-2026)批准的新治理PoC模型被添加。本文档解释了如何在引导过程中最大限度地减少权重降低的可能性，无论该模型在首次尝试中是否获得足够参与者。

有关多模型PoC机制的更广泛背景，请参阅[多模型PoC](./multi_model_poc.md)。先前模型的引导及其机制记录在[Kimi K2.6引导](./kimi-bootstrap.md)和[MiniMax-M2.7引导](./minimax-bootstrap.md)中。

!!! note 
    引导可能需要多个周期，具体取决于有多少参与者准备就绪。在配置的惩罚周期之前，如果参与者明确提交其选择，并且计划部署的主机提交 `PoCIntent`，则不会发生权重降低。继续提供MiniMax或Kimi但未选择DeepSeek的主机，在 `penalty_start_epoch` 达到后仍需明确提交 `PoCDelegation` / `PoCRefusal`。

!!! note 
    注意：在Blackwell GPU上，为实现最佳性能，您可以使用重新打包为fp8 + nvfp4而非fp8 + fp4的模型，例如 `MJPansa/DeepSeek-V4-Flash-0731-NVFP4`。模型的精度相同。要部署此类模型，将在引导前发布并共享更新的API二进制文件。

## 治理背景（提案94）

提案94将DeepSeek V4 Flash注册为新的PoC模型。未修改任何现有参数或模型；唯一的变化是新增模型条目。

提案/公告的详细信息：

- 模型：`deepseek-ai/DeepSeek-V4-Flash-0731`（固定版本 `7872f01b1d1fe23eabc4c98b48bffcef5a386062`）
- 需要在 **vLLM 0.25.1** 上运行的MLNode，并使用发布候选节点配置（`node-config-release-candidate-*.json` 适用于 B300 / B200 / H200 / H100）
- 链上PoC `weight_scale_factor = 0.214`，推理 `validation_threshold = 0.90`（处理后的logprobs）
- `penalty_start_epoch = 360`
- 投票截止时间为 **2026年8月12日16:05 UTC** / 8月12日09:05 PDT
- 在符合引导资格的前提下，首次尝试从 **周期359** 开始（PoC开始时间约为2026年8月13日03:24 UTC / 8月12日20:24 PDT）

在投票结束后、周期359快照前 `start_poc − deploy_window` 之前声明 `PoCIntent`。最终MLNode镜像说明和任何额外设置步骤将在投票结束后发布；在此之前请使用发布候选配置。


## 时间线

缺少DeepSeek V4 Flash的惩罚从 **周期 `360`** 开始。从提案激活起的每个周期，链都会尝试引导该模型：在该周期的PoC阶段前捕获 `BootstrapDelegationSnapshot` 500个区块（来自 `delegation_params.deploy_window` 的 `DeployWindow`），根据 `V_min = 3` 直接提交者和总网络权重的 `W_threshold` 比例（通过INTENT + DELEGATE实现 `>2/3` 可达性）评估预资格，并（若预合格）在该周期启动DeepSeek的PoC。

提案94保留当前的委托阈值：`w_threshold = 0.1`、`v_min = 3`、`no_participation_penalty = 0.15`、`refusal_penalty = 0.1`。执行后仍需从链上读取实时值：

```bash
curl -s "https://node3.gonka.ai/chain-api/productscience/inference/inference/params" \
  | jq '.params.delegation_params | {deploy_window, w_threshold, v_min, no_participation_penalty, refusal_penalty}'
# Decimal fields use {value, exponent}: e.g. {"value":"1","exponent":-1} → 0.1 (10%).
```

提案执行后确认实时DeepSeek条目（包括 `penalty_start_epoch` 和 `weight_scale_factor`）：

```bash
curl -s "https://node3.gonka.ai/chain-api/productscience/inference/inference/params" \
  | jq '.params.poc_params.models[] | select(.model_id=="deepseek-ai/DeepSeek-V4-Flash-0731")'
```

要计算任何给定评估周期的确切区块编号，请以链上当前周期为锚点进行前推。`epoch_shift` 参数不锚定创世块（在过去的周期长度变化中会过时），因此 `epoch_shift + N * epoch_length` 在主网上是错误的——始终以实时当前PoC_start为锚点：

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

当参与主机加上委托覆盖阈值时，DeepSeek最早成为预合格。提案参数中保留现有模型条目（`MiniMaxAI/MiniMax-M2.7`、`moonshotai/Kimi-K2.6`、`zai-org/GLM-5.2-FP8`）不变。


### 可能的情形

DeepSeek V4 Flash的引导可能遵循以下主要情形：

1. **在某个周期的快照中，DeepSeek未通过预评估**（且在PoC中仍不合格）：

    - 所有提交 `PoCIntent` 的人保持其全部权重（无惩罚）
    - 所有提交 `PoCDelegation` 的人保持其全部权重（无惩罚）
    - **在周期 `360` 之前**：所有未提交者以及提交 `PoCRefusal` 者均保持其全部权重（在宽限期期间惩罚被抑制）
    - **从周期 `360` 起**：所有未提交者每个周期每遗漏一个模型损失 **15%** 权重（`no_participation_penalty`）；提交 `PoCRefusal` 可避免15%的遗漏，但在惩罚周期激活后仍会应用 `refusal_penalty`（**10%**）

=> 在周期 `360` 之前明确发送表明您意图的交易非常重要

2. **DeepSeek通过预评估但未在PoC中合格**（例如，INTENT主机未能及时部署）：

    - 实际部署了DeepSeek并在该周期提交了DeepSeek PoC提交的主机，保持其来自现有模型组的全部权重（无惩罚）
    - 所有提交 `PoCDelegation` 的人保持其全部权重（无惩罚）
    - **从周期 `360` 起**：所有未提交者损失15%权重；所有提交 `PoCIntent` 但未部署且未提交DeepSeek PoC提交者也损失15%（`IntentMissed` 解决）；`PoCRefusal` 采用10%的`refusal_penalty` 而非15%的遗漏

如果DeepSeek通过两项检查，惩罚将遵循[多模型PoC](./multi_model_poc.md)中描述的常规情形。


## 硬件与共识权重

DeepSeek V4 Flash注册为 `v_ram = 280`（每个实例约 **280 GB总VRAM**）和 `weight_scale_factor = 0.214`。与运行MiniMax M2.7的8×H100集群相比，公告估计：

- 8×H200最优可产生 **1.46×** 权重运行MiniMax M2.7
- 8×B200最优可产生 **2.96×** 权重运行Kimi K2.6
- 8×B300 在运行 DeepSeek V4 Flash 时最优产出为 **3.37×** 权重

实际影响：

- **B300 用户**：在提议的系数下，DeepSeek 是权重最高的选项。请为 vLLM 0.25.1 和 B300 发布候选配置做准备。
- **B200 用户**：Kimi K2.6 在此类别中仍提供最高的 PoC 权重；如果您希望参与，可通过 B200 发布候选配置使用 DeepSeek。
- **H200 / H100 用户**：MiniMax M2.7 仍是这些类别的最高权重模型；DeepSeek 配置存在，但切换是可选的，非获得最大权重所必需。
- 完整系数表：[Google Sheet](https://docs.google.com/spreadsheets/d/1Tw4V7xEXR2p5MbCHqzqjS9vHXQ0eI1IHVXC6guEHnio/edit?gid=0#gid=0)

基于模型使用情况，治理可后续提高系数以激励将更多 B 系列 GPU 转向 DeepSeek。


## 准备部署 DeepSeek V4 Flash 的主机说明

#### 向链发送 `PoCIntent`

在提案 94 投票结束后、目标纪元快照块前提交：

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

使用提案中锁定的 Hugging Face 版本：

- `hf_repo`: `deepseek-ai/DeepSeek-V4-Flash-0731`
- `hf_commit`: `7872f01b1d1fe23eabc4c98b48bffcef5a386062`

请遵循指南 [预下载模型权重](https://gonka.ai/host/quickstart/#server-pre-download-model-weights-to-hugging-face-cache-hf_home)。提前规划磁盘空间和带宽——首次尝试时 Hugging Face 的速率限制可能导致资格丧失。

在引导快照块前验证模型能否在您的硬件上加载。您需要：

- MLNode 使用 **vLLM 0.25.1**
- 发布候选节点配置：`node-config-release-candidate-*.json`（适用于您的 GPU 类别：B300 / B200 / H200 / H100）

链将 DeepSeek 注册为 `Model.ModelArgs`：

```
--max-model-len 400000
--kv-cache-dtype fp8
--tokenizer-mode deepseek_v4
--enable-auto-tool-choice
--tool-call-parser deepseek_v4
--reasoning-parser deepseek_v4
--trust-remote-code
```

部署端标志（`--tensor-parallel-size`、`--enable-expert-parallel`、`--gpu-memory-utilization`、推测/注意力后端标志等）来源于您硬件的发布候选 `node-config`——请勿仅从链的 `ModelArgs` 自行推断。

#### 等待下一个评估纪元并检查预资格

每个评估纪元的快照块后，链会发出 `bootstrap_model_preeligibility` 事件：

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

关键属性是 `pre_eligible`。若其为 `true`，则链将在本纪元运行 DeepSeek PoC，您应准备就绪。支持字段显示三项检查中哪些通过：`meets_v_min`（≥ `V_min` 直接意图提交者），`meets_weight_threshold`（意图权重 ≥ `W_threshold` 的 `total_network_weight`），以及 `meets_reachability`（意图 + 委托 `reachable_voting_power` 覆盖 `>2/3`）。`intent_host_count` 和 `intent_weight` 显示本纪元的直接意图覆盖情况。

#### 若预合格，切换至 DeepSeek V4 Flash

使用与您 GPU 类别匹配的发布候选配置。Admin API 更新示例形状（用您的 `node-config-release-candidate-*.json` 内容替换参数）：

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

合并发布候选配置中的操作符标志（张量并行大小、专家并行、GPU 内存利用率、推测解码及任何硬件特定后端）。PoC 开始时的成员资格由提交 PoC 存储提交者决定——仅声明意图不足。

#### 验证您的部署

投票结束后，遵循发布的 MLNode 设置说明及任何已提交的 DeepSeek 黄金参考。[`gonka` 仓库](https://github.com/gonka-ai/gonka) 提供了一个代理技能 `mlnode-validate`，用于将已部署的 ML Node 与预计算的诚实 PoC 向量进行验证。参见 [验证 ML Node 部署](./mlnode-validation.md) 和 [`skills/mlnode-validate/SKILL.md`](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md)。


## 不打算部署 DeepSeek V4 Flash 的主机说明

保留 MiniMax 或 Kimi 即可——现有模型保持不变。在 **纪元 `360`** 之前，您可以不响应 DeepSeek 而不被扣减权重。从纪元 `360` 开始，请提交 **委托**（若您信任某意图主机，推荐）或 **拒绝**，以免被视为缺失模型。拒绝可避免 15% 的缺失惩罚，但仍需承担 10% 的 `refusal_penalty`。

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

在委托引导时：**不要委托给守护节点**；将权重分散到独立的 DeepSeek 主机上。有关最新的委托指南，请参阅 [Multi-Model PoC](./multi_model_poc.md)。

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
