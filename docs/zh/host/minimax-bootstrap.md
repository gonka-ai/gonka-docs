# MiniMax-M2.7 引导流程

`MiniMaxAI/MiniMax-M2.7`（FP8）已在 `v0.2.13` 升级中作为第三个经治理批准的推理模型加入。本文档说明如何在引导阶段尽量减少权重减少的风险，无论该模型在首次尝试时是否获得足够多的参与者。

有关当前部署默认设置（包括 `node-config.json`），请参阅[主机快速入门](./quickstart.md)。有关多模型 PoC 机制的更广泛背景，请参阅[多模型 PoC](./multi_model_poc.md)。先前模型的引导及其机制记录在[Kimi K2.6 引导流程](./kimi-bootstrap.md)中。

!!! note
    引导过程可能持续多个纪元，具体取决于准备就绪的参与者数量。在配置的惩罚纪元之前，只要参与者明确提交了选择，并且计划部署的主机提交了 `PoCIntent`，就不会发生权重减少。

## 时间线

对未参与 MiniMax-M2.7 的惩罚从 **纪元 `278`** 开始。从升级激活后的每个纪元起，链都会尝试引导该模型：在该纪元 PoC 阶段前 500 个区块（即 `DeployWindow`）内生成一个 `BootstrapDelegationSnapshot`，根据 `V_min = 3` 个直接提交者以及占全网总权重 `W_threshold` 比例且通过 INTENT + DELEGATE 实现 `>2/3` 可达性的条件进行预资格评估；若满足预资格，则在该纪元启动 MiniMax 的 PoC。

当前 `W_threshold` 是一个治理参数——应从链上读取该值，而非硬编码（该值已由 GIP-48 从 `0.3` 降至 `0.1`，未来可能再次调整）：```bash
curl -s "https://node3.gonka.ai/chain-api/productscience/inference/inference/params" \
  | jq '.params.delegation_params.w_threshold'
# {value, exponent} encodes a decimal: e.g. {"value":"1","exponent":-1} → 0.1 (10%).
```要计算任意给定评估周期的确切区块编号，应以链的当前周期为锚点进行向前推算。`epoch_shift` 参数不能锚定到创世块（由于过去周期长度的变化，该值会过时），因此在主网上使用 `epoch_shift + N * epoch_length` 是错误的——始终应以当前实时的 PoC_start 为锚点。```bash
NODE=https://node3.gonka.ai

PARAMS=$(curl -s "$NODE/chain-api/productscience/inference/inference/params")
EPOCH_LENGTH=$(echo "$PARAMS" | jq -r '.params.epoch_params.epoch_length | tonumber')

CURRENT=$(curl -s "$NODE/v1/epochs/current/participants" | jq '.active_participants')
CURRENT_EPOCH=$(echo "$CURRENT" | jq -r '.epoch_id')
CURRENT_POC_START=$(echo "$CURRENT" | jq -r '.poc_start_block_height')

EPOCH=278                   # change to any target epoch
POC_START=$(( CURRENT_POC_START + (EPOCH - CURRENT_EPOCH) * EPOCH_LENGTH ))
SNAPSHOT_BLOCK=$(( POC_START - 500 ))

echo "Epoch $EPOCH (current $CURRENT_EPOCH): snapshot at block $SNAPSHOT_BLOCK, PoC starts at block $POC_START"
```当参与的节点及其委托满足门槛要求时，MiniMax 将在最早的 epoch 获得预资格。

### 可能出现的情况

MiniMax-M2.7 的启动可能遵循以下主要场景：

1. **MiniMax 在某个 epoch 的快照中未通过预评估**（并在 PoC 阶段仍不具备资格）：

   - 所有提交了 `PoCIntent` 的参与者保留其全部权重（不受惩罚）
   - 所有提交了 `PoCDelegation` / `PoCRefusal` 的参与者保留其全部权重（不受惩罚）
   - **在 epoch `278` 之前**：未进行任何操作的参与者也保留其全部权重（宽限期期间不执行惩罚）
   - **从 epoch `278` 开始**：未进行任何操作的参与者每错过一个模型，每个 epoch 将损失 15% 的权重

   => 因此，**在 epoch `278` 之前**明确发送交易以表明您的意图至关重要

2. **MiniMax 通过预评估但在 PoC 阶段未获得资格**（例如，某个 INTENT 节点未能及时部署）：

   - 在该 epoch 实际部署了 MiniMax-M2.7 并提交了 MiniMax PoC 提交记录的节点，保留其现有模型组的全部权重（不受惩罚）
   - 所有提交了 `PoCDelegation` / `PoCRefusal` 的参与者保留其全部权重（不受惩罚）
   - **从 epoch `278` 开始**：未进行任何操作的参与者损失 15% 的权重，而提交了 MiniMax `PoCIntent` 但未部署且未提交 MiniMax PoC 提交记录的参与者也同样损失 15% 的权重（按 `IntentMissed` 处理）

如果 MiniMax 通过了上述两项检查，惩罚机制将遵循 [多模型 PoC](./multi_model_poc.md) 中描述的常规情况。

## 硬件资格要求

MiniMax-M2.7（FP8）每个实例大约需要 **320 GB 的总 VRAM** —— 相较于 Kimi K2.6 或 Qwen3-235B（根据[节点快速入门参考配置](./quickstart.md#hardware-and-machines)均需 ≥640 GB 每实例）显著降低。实际影响如下：

- **A100 80GB 拥有者**：MiniMax-M2.7 是**首个符合 A100 80GB 规格的治理批准模型**。如果您此前无法运行 Kimi 或 Qwen-235B，现在可以通过 MiniMax 获得共识权重。推荐配置：8×A100 80GB，使用 `tp=4`（每台主机运行两个实例）或 `tp=8`（每台主机运行一个实例）。
- **H100 / H200 拥有者**：MiniMax-M2.7 在共识输出方面与 Qwen3-235B 相当（根据工作负载略有上下浮动几个百分点），且在 `v0.2.13` 版本对 Kimi 系数调整后明显优于 Kimi K2.6。建议从 Kimi 切换至 MiniMax；此前运行 Qwen3-235B 的主机必须切换至 MiniMax，因为 Qwen3-235B 已由治理（提案 78）退役。
- **B200 / B300 拥有者**：MiniMax-M2.7 运行良好，但在旗舰硬件上 Kimi K2.6 仍保持微弱的共识输出领先。若已运行 Kimi，则无需更改。

## 计划部署 MiniMax-M2.7 的节点操作指南

#### 1. 向链上发送 `PoCIntent````bash
export NODE=https://node3.gonka.ai/chain-rpc/
./inferenced tx inference declare-poc-intent MiniMaxAI/MiniMax-M2.7 \
  --from gonka-api-key \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```#### 2. 预下载权重并验证可部署性

MiniMax-M2.7 FP8 权重文件大小约为 **230 GB**，请合理规划磁盘空间和带宽。请参考以下指南，使用下方指定的仓库和提交记录 [预下载模型权重](https://gonka.ai/host/quickstart/#server-pre-download-model-weights-to-hugging-face-cache-hf_home)：

- `hf_repo`：`MiniMaxAI/MiniMax-M2.7`
- `hf_commit`：`d494266a4affc0d2995ba1fa35c8481cbd84294b`

在引导快照区块之前，请先验证模型能否在您的硬件上成功加载。该链通过 `Model.ModelArgs` 注册 MiniMax 模型：```
--enable-auto-tool-choice
--max-model-len 180000
--kv-cache-dtype fp8
--tool-call-parser minimax_m2
--reasoning-parser minimax_m2_append_think
```#### 3. 等待下一次评估周期并检查预资格

在每次评估周期的快照区块之后，链会发出一个 `bootstrap_model_preeligibility` 事件：```bash
NODE=https://node3.gonka.ai
MODEL='MiniMaxAI/MiniMax-M2.7'

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
```关键属性是 `pre_eligible`。如果其值为 `true`，表示该链将在本 epoch 运行 MiniMax PoC，你应准备部署。辅助字段显示了通过了哪三项检查：`meets_v_min`（≥ `V_min` 个直接表达意向的参与者）、`meets_weight_threshold`（意向权重 ≥ `total_network_weight` 的 `W_threshold`）和 `meets_reachability`（意向加上委托的 `reachable_voting_power` 覆盖了 `>2/3`）。`intent_host_count` 和 `intent_weight` 显示了本 epoch 的直接意向覆盖情况。

#### 4. 若预符合条件，则切换模型至 MiniMax-M2.7

在 8×A100 80GB（`tp=4`，每台主机运行两个实例）上部署 MiniMax-M2.7 的示例命令：```bash
curl -X POST http://localhost:9200/admin/v1/nodes \
     -H "Content-Type: application/json" \
     -d '{
       "id": "<NODE_ID>",
       "host": "<NODE_IP>",
       "inference_port": 5050,
       "poc_port": 8080,
       "max_concurrent": 500,
       "models": {
         "MiniMaxAI/MiniMax-M2.7": {
           "args": [
             "--tensor-parallel-size", "4",
             "--enable-expert-parallel",
             "--trust-remote-code",
             "--mm-encoder-tp-mode", "data",
             "--enable-auto-tool-choice",
             "--max-model-len", "180000",
             "--kv-cache-dtype", "fp8",
             "--tool-call-parser", "minimax_m2",
             "--reasoning-parser", "minimax_m2_append_think",
             "--gpu-memory-utilization", "0.95",
             "--max-num-seqs", "128"
           ]
         }
       }
     }'
```对于 4×B200 / 8×B200 的部署，请根据吞吐量需求选择使用 `--tensor-parallel-size 2`（每个 8×B200 节点运行两个实例）或 `--tensor-parallel-size 4`（每个节点运行一个实例）。`Model.ModelArgs` 的配置应尽可能精简；部署时的参数（如 `--tensor-parallel-size`、`--gpu-memory-utilization`、`--max-num-seqs` 等）由运维人员根据实际情况决定。

#### 5. 验证您的部署

[`gonka` 仓库](https://github.com/gonka-ai/gonka) 提供了一个名为 `mlnode-validate` 的代理技能，可用于将已部署的 ML 节点与特定模型的预计算诚实 PoC 向量进行比对验证。对于 MiniMax M2.7 模型，已提交的黄金参考数据为 `mlnode/packages/benchmarks/scripts/poc_validation/artifacts/minimaxai-minimax-m2.7.json`（包含 200 个向量，记录于 2×H200 环境）。此外，还提供了适用于 `4×A100`、`4×H100`、`2×H200` 和 `2×B200` 的现成 `deploy/join/` 配置文件。详见 [验证 ML 节点部署](./mlnode-validation.md) 和 [`skills/mlnode-validate/SKILL.md`](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md)。

## 不打算部署 MiniMax-M2.7 的主机操作说明

#### 1. 检查是否信任已部署 MiniMax 模型或已发送 `PoCIntent` 的主机```python
import time
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

NODE = "https://node3.gonka.ai"
MODEL = "MiniMaxAI/MiniMax-M2.7"
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
with_minimax_model = []
skipped = []  # participants whose poc_delegation lookup failed after retries

for p in participants:
    addr = p["index"]
    w = weight(p)
    if MODEL in (p.get("models") or []):
        with_minimax_model.append((addr, w))

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
print(f"With {MODEL} in models[]: {len(with_minimax_model)} (not same as intent)")
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
```#### 2. 发送委派或拒绝

委派：```bash
export NODE=https://node3.gonka.ai/chain-rpc/
./inferenced tx inference set-poc-delegation MiniMaxAI/MiniMax-M2.7 <DELEGATEE> \
  --from gonka-account-key \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```拒绝：```bash
export NODE=https://node3.gonka.ai/chain-rpc/
./inferenced tx inference refuse-poc-delegation MiniMaxAI/MiniMax-M2.7 \
  --from gonka-account-key \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```
