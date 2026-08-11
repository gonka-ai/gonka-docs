# DeepSeek V4 Flash 引导流程

`deepseek-ai/DeepSeek-V4-Flash-0731` 通过[提案 94](../network-updates.md#august-10-2026)作为新的经治理批准的 PoC 模型加入。本文档说明如何在引导阶段尽量减少权重减少的风险，无论该模型在首次尝试时是否获得足够多的参与者。

有关多模型 PoC 机制的更广泛背景，请参阅[多模型 PoC](./multi_model_poc.md)。先前模型的引导及其机制记录在 [Kimi K2.6 引导流程](./kimi-bootstrap.md) 与 [MiniMax-M2.7 引导流程](./minimax-bootstrap.md) 中。

!!! note
    引导过程可能持续多个纪元，具体取决于准备就绪的参与者数量。在配置的惩罚纪元之前，只要参与者明确提交了选择，并且计划部署的主机提交了 `PoCIntent`，就不会发生权重减少。继续提供 MiniMax 或 Kimi、且不选择加入 DeepSeek 的主机，在到达 `penalty_start_epoch` 后仍需明确提交 `PoCDelegation` / `PoCRefusal`。


## 治理背景（提案 94）

提案 94 将 DeepSeek V4 Flash 注册为新的 PoC 模型。不修改任何现有参数或模型；唯一的变化是新增该模型条目。

提案 / 公告中的细节：

- 模型：`deepseek-ai/DeepSeek-V4-Flash-0731`（固定版本 `7872f01b1d1fe23eabc4c98b48bffcef5a386062`）
- 需要在 **vLLM 0.25.1** 上运行的 MLNode，并使用发布候选节点配置（`node-config-release-candidate-*.json` 适用于 B300 / B200 / H200 / H100）
- 链上 PoC `weight_scale_factor = 0.214`，推理 `validation_threshold = 0.90`（处理过的 logprobs）
- `penalty_start_epoch = 360`
- 投票截止：**2026 年 8 月 12 日 16:05 UTC** / 8 月 12 日 09:05 PDT
- 在符合引导资格的前提下，首次尝试从 **第 359 个纪元**开始（PoC 启动时间约为 2026 年 8 月 13 日 03:24 UTC / 8 月 12 日 20:24 PDT）

请在**投票结束后**、且在第 359 纪元快照 `start_poc − deploy_window` 之前提交 `PoCIntent`。最终 MLNode 镜像说明与额外设置步骤将在投票结束后发布；在此之前请使用发布候选配置。


## 时间线

对未参与 DeepSeek V4 Flash 的惩罚从 **纪元 `360`** 开始。从提案生效后的每个纪元起，链都会尝试引导该模型：在该纪元 PoC 阶段前 500 个区块（即 `delegation_params.deploy_window` 中的 `DeployWindow`）内生成一个 `BootstrapDelegationSnapshot`，根据 `V_min = 3` 个直接提交者以及占全网总权重 `W_threshold` 比例且通过 INTENT + DELEGATE 实现 `>2/3` 可达性的条件进行预资格评估；若满足预资格，则在该纪元启动 DeepSeek 的 PoC。

提案 94 保持当前委托门槛：`w_threshold = 0.1`，`v_min = 3`，`no_participation_penalty = 0.15`，`refusal_penalty = 0.1`。执行后仍请从链上读取实时值：

```bash
curl -s "https://node3.gonka.ai/chain-api/productscience/inference/inference/params" \
  | jq '.params.delegation_params | {deploy_window, w_threshold, v_min, no_participation_penalty, refusal_penalty}'
# Decimal fields use {value, exponent}: e.g. {"value":"1","exponent":-1} → 0.1 (10%).
```

提案执行后，请确认链上的 DeepSeek 条目（包括 `penalty_start_epoch` 与 `weight_scale_factor`）：

```bash
curl -s "https://node3.gonka.ai/chain-api/productscience/inference/inference/params" \
  | jq '.params.poc_params.models[] | select(.model_id=="deepseek-ai/DeepSeek-V4-Flash-0731")'
```

要计算任意给定评估周期的确切区块编号，应以链的当前周期为锚点进行向前推算。`epoch_shift` 参数不能锚定到创世块（由于过去周期长度的变化，该值会过时），因此在主网上使用 `epoch_shift + N * epoch_length` 是错误的——始终应以当前实时的 PoC_start 为锚点：

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

当参与的节点及其委托满足门槛要求时，DeepSeek 将在最早的 epoch 获得预资格。提案参数中现有模型条目（`MiniMaxAI/MiniMax-M2.7`、`moonshotai/Kimi-K2.6`、`zai-org/GLM-5.2-FP8`）保持不变。


### 可能出现的情况

DeepSeek V4 Flash 的启动可能遵循以下主要场景：

1. **DeepSeek 在某个 epoch 的快照中未通过预评估**（并在 PoC 阶段仍不具备资格）：

    - 所有提交了 `PoCIntent` 的参与者保留其全部权重（不受惩罚）
    - 所有提交了 `PoCDelegation` 的参与者保留其全部权重（不受惩罚）
    - **在 epoch `360` 之前**：未进行任何操作的参与者，以及提交了 `PoCRefusal` 的参与者，也保留其全部权重（宽限期期间不执行惩罚）
    - **从 epoch `360` 开始**：未进行任何操作的参与者每错过一个模型，每个 epoch 将损失 **15%** 的权重（`no_participation_penalty`）；`PoCRefusal` 可避免 15% 的漏参与惩罚，但在惩罚纪元生效后仍会适用 `refusal_penalty`（**10%**）

    => 因此，**在 epoch `360` 之前**明确发送交易以表明您的意图至关重要

2. **DeepSeek 通过预评估但在 PoC 阶段未获得资格**（例如，某个 INTENT 节点未能及时部署）：

    - 在该 epoch 实际部署了 DeepSeek 并提交了 DeepSeek PoC 提交记录的节点，保留其现有模型组的全部权重（不受惩罚）
    - 所有提交了 `PoCDelegation` 的参与者保留其全部权重（不受惩罚）
    - **从 epoch `360` 开始**：未进行任何操作的参与者损失 15% 的权重；提交了 DeepSeek `PoCIntent` 但未部署且未提交 DeepSeek PoC 提交记录的参与者也同样损失 15% 的权重（按 `IntentMissed` 处理）；`PoCRefusal` 则按 10% 的 `refusal_penalty` 处理，而非 15% 的漏参与惩罚

如果 DeepSeek 通过了上述两项检查，惩罚机制将遵循 [多模型 PoC](./multi_model_poc.md) 中描述的常规情况。


## 硬件与共识权重

DeepSeek V4 Flash 注册时 `v_ram = 280`（每个实例大约需要 **280 GB 总 VRAM**），`weight_scale_factor = 0.214`。相对于运行 MiniMax M2.7 的 8×H100 集群，公告中的估算为：

- 8×H200 最优可产生 **1.46×** 权重（运行 MiniMax M2.7）
- 8×B200 最优可产生 **2.96×** 权重（运行 Kimi K2.6）
- 8×B300 最优可产生 **3.37×** 权重（运行 DeepSeek V4 Flash）

实际影响如下：

- **B300 拥有者**：在拟议系数下，DeepSeek 是权重最高的选项。请准备 vLLM 0.25.1 与 B300 发布候选配置。
- **B200 拥有者**：在该档位上 Kimi K2.6 仍产生最高 PoC 权重；若希望选择加入，可通过 B200 发布候选配置运行 DeepSeek。
- **H200 / H100 拥有者**：对这些档位而言 MiniMax M2.7 仍是权重最高的模型；DeepSeek 配置可用，但切换是可选的，并非追求最高权重所必需。
- 完整系数表：[Google Sheet](https://docs.google.com/spreadsheets/d/1Tw4V7xEXR2p5MbCHqzqjS9vHXQ0eI1IHVXC6guEHnio/edit?gid=0#gid=0)

根据模型使用情况，治理之后可提高系数，以激励更多 B 系列 GPU 转向 DeepSeek。


## 计划部署 DeepSeek V4 Flash 的节点操作指南

#### 1. 向链上发送 `PoCIntent`

请在提案 94 投票结束后、目标纪元快照区块之前提交：

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

#### 2. 预下载权重并验证可部署性

使用提案中固定的 Hugging Face 版本：

- `hf_repo`：`deepseek-ai/DeepSeek-V4-Flash-0731`
- `hf_commit`：`7872f01b1d1fe23eabc4c98b48bffcef5a386062`

请参考指南 [预下载模型权重](https://gonka.ai/host/quickstart/#server-pre-download-model-weights-to-hugging-face-cache-hf_home)。请提前规划磁盘空间与带宽——首次尝试期间的 Hugging Face 限速可能导致错过资格。

在引导快照区块之前，请先验证模型能否在您的硬件上成功加载。您需要：

- 运行 **vLLM 0.25.1** 的 MLNode
- 与您的 GPU 档位相匹配的发布候选节点配置：`node-config-release-candidate-*.json`（B300 / B200 / H200 / H100）

该链通过 `Model.ModelArgs` 注册 DeepSeek：

```
--max-model-len 400000
--kv-cache-dtype fp8
--tokenizer-mode deepseek_v4
--enable-auto-tool-choice
--tool-call-parser deepseek_v4
--reasoning-parser deepseek_v4
--trust-remote-code
```

部署侧参数（`--tensor-parallel-size`、`--enable-expert-parallel`、`--gpu-memory-utilization`、投机解码 / attention backend 等）来自对应硬件的发布候选 `node-config`——请勿仅根据链上 `ModelArgs` 自行拼凑。

#### 3. 等待下一次评估周期并检查预资格

在每次评估周期的快照区块之后，链会发出一个 `bootstrap_model_preeligibility` 事件：

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

关键属性是 `pre_eligible`。若为 `true`，链将在该纪元运行 DeepSeek PoC，您应准备好部署。辅助字段显示三项检查中哪些已通过：`meets_v_min`（直接 intent 提交者 ≥ `V_min`）、`meets_weight_threshold`（intent 权重 ≥ 全网权重的 `W_threshold`）、以及 `meets_reachability`（intent + 委托的 `reachable_voting_power` 覆盖 `>2/3`）。`intent_host_count` 与 `intent_weight` 显示该纪元的直接 intent 覆盖情况。

#### 4. 若获得预资格，则切换至 DeepSeek V4 Flash

请使用与您的 GPU 档位相匹配的发布候选配置。Admin API 更新的示例结构如下（请用您的 `node-config-release-candidate-*.json` 中的参数替换 args）：

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

请合并发布候选配置中的运维参数（tensor parallel、expert parallel、gpu memory utilization、投机解码以及任何硬件相关 backend）。PoC 开始时的成员资格由谁提交 PoC store commit 决定——仅声明 intent 不足够。

#### 5. 验证您的部署

投票结束后，请遵循已发布的 MLNode 设置说明以及任何已提交的 DeepSeek golden reference。[`gonka` 仓库](https://github.com/gonka-ai/gonka) 提供了代理技能 `mlnode-validate`，可用预计算的诚实 PoC 向量验证已部署的 ML Node。参见 [验证 ML 节点部署](./mlnode-validation.md) 与 [`skills/mlnode-validate/SKILL.md`](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md)。


## 不计划部署 DeepSeek V4 Flash 的节点操作指南

继续运行 MiniMax 或 Kimi 没有问题——现有模型保持不变。在 **纪元 `360`** 之前，您可以不对 DeepSeek 做任何操作且不会被扣权重。从纪元 `360` 起，请提交**委托**（若信任某个 intent 主机，优先选择）或**拒绝**，以免被判定为错过该模型。拒绝可避免 15% 的漏参与惩罚，但仍会扣除 10% 的 `refusal_penalty`。

#### 1. 检查您是否信任任何计划部署 DeepSeek / 已发送 `PoCIntent` 的主机

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

为引导进行委托时：**不要委托给 guardian 节点**；将权重分散到独立的 DeepSeek 主机。更新后的委托指引见 [多模型 PoC](./multi_model_poc.md)。

#### 2. 发送委托或拒绝

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
