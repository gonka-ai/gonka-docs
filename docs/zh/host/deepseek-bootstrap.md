# DeepSeek V4 Flash 启动

`deepseek-ai/DeepSeek-V4-Flash-0731` 已通过启动，并在链纪元 360 时在 Gonka 主网的计算证明（PoC）中处于活跃状态（[提案 94](../network-updates.md#august-10-2026)）。以下的时间线和交易示例仍有助于理解激活机制以及委托等操作；有关当前部署默认值（包括 `node-config.json`），请参阅 [主机快速入门](./quickstart.md)。

有关多模型 PoC 机制的更广泛背景，请参阅 [多模型 PoC](./multi_model_poc.md)。先前模型的启动及其机制记录在 [Kimi K2.6 启动](./kimi-bootstrap.md) 和 [MiniMax-M2.7 启动](./minimax-bootstrap.md) 中。

!!! note 
    启动可能需要多个纪元，具体取决于有多少参与者准备就绪。在配置的惩罚纪元之前，如果参与者明确提交其选择，且计划部署的主机提交 `PoCIntent`，则不会减少权重。继续提供 MiniMax 或 Kimi 但未选择 DeepSeek 的主机，在 `penalty_start_epoch` 达到后仍需明确提交 `PoCDelegation` / `PoCRefusal`。DeepSeek 的按模型参与强制执行现已生效（纪元 360）。

!!! note 
    在 Blackwell GPU 上，为获得最佳性能，您可以使用重新打包为 fp8 + nvfp4 的模型，而不是 fp8 + fp4，例如 `MJPansa/DeepSeek-V4-Flash-0731-NVFP4`。模型的精度相同。使用 `node-config-deepseekv4flash0731-B200-nvfp4.json` / `node-config-deepseekv4flash0731-B300-nvfp4.json` 配置和 API `v0.2.15-post5` —— 详见 [网络更新](../network-updates.md) 中 8 月 13 日的“测试 DeepSeek V4 Flash”备注。

## 治理背景（提案 94）

提案 94 将 DeepSeek V4 Flash 注册为新的 PoC 模型。未修改任何现有参数或模型；唯一的变化是新增了该模型条目。

提案/公告的详细信息：

- 模型：`deepseek-ai/DeepSeek-V4-Flash-0731`（固定修订版 `7872f01b1d1fe23eabc4c98b48bffcef5a386062`）
- 需要在 **vLLM 0.25.1**（MLNode **3.0.16**）上运行的 MLNode，并使用随附的节点配置（`node-config-deepseekv4flash0731-*.json` 适用于 B300 / B200 / H200 / H100）
- 链上 PoC `weight_scale_factor = 0.214`，推理 `validation_threshold = 0.90`（处理后的 logprobs）
- `penalty_start_epoch = 360`
- 投票于 **2026 年 8 月 12 日 16:05 UTC** / 8 月 12 日 09:05 PDT 结束
- 首次启动尝试在 **纪元 359**；模型组在 **纪元 360** 变为活跃

在投票结束后、纪元 359 快照前 `start_poc − deploy_window` 之前声明 `PoCIntent`。MLNode 镜像在 [`vllm-0.25.1-upgrade`](https://github.com/gonka-ai/gonka/tree/vllm-0.25.1-upgrade/deploy/join) 分支上固定为 3.0.16（`main` 仍固定为 3.0.14-post2）；请使用随附的 DeepSeek `node-config-*.json` 文件。


## 时间线

缺失 DeepSeek V4 Flash 的惩罚从 **纪元 `360`** 开始。从提案激活起，每个纪元，链都会尝试启动该模型：在该纪元 PoC 阶段前捕获 `BootstrapDelegationSnapshot` 500 个区块（来自 `delegation_params.deploy_window` 的 `DeployWindow`），根据 `V_min = 3` 直接提交者和总网络权重的 `W_threshold` 比例（通过 INTENT + DELEGATE 实现 `>2/3` 可达性）评估预资格，并（如预合格）在该纪元启动 DeepSeek 的 PoC。

提案 94 保留当前的委托阈值：`w_threshold = 0.1`、`v_min = 3`、`no_participation_penalty = 0.15`、`refusal_penalty = 0.1`。执行后仍需从链上读取实时值：

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

要计算任何给定评估纪元的确切区块号，请以链的当前纪元为锚点进行前推。`epoch_shift` 参数不锚定创世块（在过去的纪元长度变化中会过时），因此 `epoch_shift + N * epoch_length` 在主网上是错误的——始终以实时当前 PoC_start 为锚点：

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

当参与主机及其委托覆盖阈值时，DeepSeek 最早成为预合格。提案参数中保留现有模型条目（`MiniMaxAI/MiniMax-M2.7`、`moonshotai/Kimi-K2.6`、`zai-org/GLM-5.2-FP8`）不变。


### 可能的场景

DeepSeek V4 Flash 的启动可能遵循以下主要场景：

1. **在某个纪元的快照中，DeepSeek 未通过预评估**（且在 PoC 中仍不合格）：

    - 所有提交 `PoCIntent` 的人保留其全部权重（无惩罚）
    - 所有提交 `PoCDelegation` 的人保留其全部权重（无惩罚）
    - **在纪元 `360` 之前**：所有未提交者以及提交 `PoCRefusal` 者均保留其全部权重（宽限期期间惩罚被抑制）
    - **从纪元 `360` 起**：所有未提交者每个纪元每遗漏一个模型损失 **15%** 权重（`no_participation_penalty`）；提交 `PoCRefusal` 可避免 15% 的遗漏，但一旦惩罚纪元生效，仍需承担 `refusal_penalty`（**10%**）

=> 在纪元 `360` 之前明确发送表明您意图的交易至关重要

2. **DeepSeek 通过预评估但未在 PoC 中合格**（例如，INTENT 主机未能及时部署）：

    - 实际部署 DeepSeek 并在该纪元提交 DeepSeek PoC 提交的主机，保留其来自现有模型组的全部权重（无惩罚）
    - 所有提交 `PoCDelegation` 的人保留其全部权重（无惩罚）
    - **从纪元 `360` 起**：所有未提交者损失 15% 权重；所有提交 `PoCIntent` 但未部署且未提交 DeepSeek PoC 提交者也损失 15%（`IntentMissed` 解决方案）；`PoCRefusal` 承担 10% 的 `refusal_penalty` 而非 15% 的遗漏

如果 DeepSeek 通过两项检查，惩罚遵循 [多模型 PoC](./multi_model_poc.md) 中描述的常规场景。


## 硬件与共识权重

DeepSeek V4 Flash 注册为 `v_ram = 280`（每个实例约 **280 GB 总 VRAM**）和 `weight_scale_factor = 0.214`。与运行 MiniMax M2.7 的 8×H100 集群相比，公告估计：

- 8×H200 最优可产生 **1.46×** 权重运行 MiniMax M2.7
- 8×B200 最优可产生 **2.96×** 权重运行 Kimi K2.6
- 8×B300 在运行 DeepSeek V4 Flash 时最优产出为 **3.37×** 权重

实际影响：

- **B300 用户**：在所提议的系数下，DeepSeek 是权重最高的选项。请为 vLLM 0.25.1 / MLNode 3.0.16 和 B300 节点配置做好准备。
- **B200 用户**：Kimi K2.6 在此类别中仍具有最高的 PoC 权重；如果您希望参与，可通过 B200 节点配置使用 DeepSeek。
- **H200 / H100 用户**：MiniMax M2.7 仍是这些类别的最高权重模型；DeepSeek 配置已存在，但切换是可选的，无需为获得最大权重而切换。
- 完整系数表：[Google Sheet](https://docs.google.com/spreadsheets/d/1Tw4V7xEXR2p5MbCHqzqjS9vHXQ0eI1IHVXC6guEHnio/edit?gid=0#gid=0)

基于模型使用情况，治理后续可提高系数，以激励将更多 B 系列 GPU 转向 DeepSeek。


## 为将部署 DeepSeek V4 Flash 的主机提供的说明

#### 向链发送 `PoCIntent`

在提案 94 投票结束后、目标纪元快照区块前提交：

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

使用提案中固定的 Hugging Face 修订版本：

- `hf_repo`: `deepseek-ai/DeepSeek-V4-Flash-0731`
- `hf_commit`: `7872f01b1d1fe23eabc4c98b48bffcef5a386062`
- 许可证：**MIT** — 详见 [模型许可证](../model-licenses.md) 和 [上游 LICENSE](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-0731/blob/main/LICENSE)。Blackwell nvfp4 重构 `MJPansa/DeepSeek-V4-Flash-0731-NVFP4`（提交 `64d64cd89bc63a66aa46506da89d7821f7491c62`）同样为 MIT。

请遵循 [预下载模型权重](https://gonka.ai/host/quickstart/#server-pre-download-model-weights-to-hugging-face-cache-hf_home) 指南。在引导窗口前规划好磁盘空间和带宽——首次尝试时 Hugging Face 的速率限制可能导致资格丧失。

在引导快照区块前，验证模型是否能在您的硬件上加载。您需要：

- MLNode 使用 **vLLM 0.25.1**（镜像 **3.0.16**）
- 预装节点配置：`node-config-deepseekv4flash0731-*.json`（适用于您的 GPU 类型：B300 / B200 / H200 / H100）

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

部署端标志（`--tensor-parallel-size`、`--enable-expert-parallel`、`--gpu-memory-utilization`、推测/注意力后端标志等）来自为您的硬件提供的预装 `node-config` —— 不要仅从链的 `ModelArgs` 中自行推断。

#### 等待下一个评估纪元并检查预资格

每个评估纪元的快照区块后，链会发出 `bootstrap_model_preeligibility` 事件：

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

关键属性是 `pre_eligible`。如果其值为 `true`，则链将在本纪元运行 DeepSeek PoC，您应已准备好部署。支持字段显示以下三项检查是否通过：`meets_v_min`（≥ `V_min` 直接意向提交者），`meets_weight_threshold`（意向权重 ≥ `W_threshold` 的 `total_network_weight`），以及 `meets_reachability`（意向 + 委托 `reachable_voting_power` 覆盖 `>2/3`）。`intent_host_count` 和 `intent_weight` 显示本纪元的直接意向覆盖情况。

#### 如果预合格，将模型切换为 DeepSeek V4 Flash

使用与您的 GPU 类型匹配的预装配置。Admin API 更新示例形状（用您的 `node-config-deepseekv4flash0731-*.json` 内容替换参数）：

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

从分发的配置中合并操作符标志（张量并行大小、专家并行、GPU内存利用率、推测解码和任何硬件特定后端）。PoC开始时的成员资格由提交PoC存储提交的人决定——仅声明意向是不够的。

#### 验证您的部署

遵循发布的MLNode设置说明以及已提交的DeepSeek黄金参考（在[`vllm-0.25.1-upgrade`](https://github.com/gonka-ai/gonka/tree/vllm-0.25.1-upgrade/mlnode/packages/benchmarks/scripts/poc_validation/artifacts)分支上的`deepseek-ai-deepseek-v4-flash-0731.json`）。[`gonka`仓库](https://github.com/gonka-ai/gonka)附带了一个代理技能`mlnode-validate`，用于将已部署的ML Node与预计算的诚实PoC向量进行验证。参见[验证ML Node部署](./mlnode-validation.md)和[`skills/mlnode-validate/SKILL.md`](https://github.com/gonka-ai/gonka/blob/vllm-0.25.1-upgrade/skills/mlnode-validate/SKILL.md)。


## 不部署DeepSeek V4 Flash的主机说明

保留MiniMax或Kimi即可——现有模型保持不变。DeepSeek的按模型参与强制执行现已生效（纪元**`360`**）。如果您不提供DeepSeek，请提交**委托**（如果您信任某个DeepSeek主机，则优先选择）或**拒绝**，以免被视为缺失该模型。拒绝可避免15%的缺失惩罚，但仍会承担10%的`refusal_penalty`。已选择DIRECT、DELEGATE或REFUSE的主机无需重新提交。

#### 检查您是否信任任何将部署DeepSeek/发送`PoCIntent`的主机

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

引导时委托：**不要委托给守护节点**；将权重分散到独立的DeepSeek主机上。有关更新的委托指南，请参见[多模型PoC](./multi_model_poc.md)。

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
