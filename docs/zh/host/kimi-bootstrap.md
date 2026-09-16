# Kimi K2.6 Bootstrap

`moonshotai/Kimi-K2.6` 在 [提案 101](../network-updates.md#proposal-101) 后 **不是 PoC 模型**：它与 `zai-org/GLM-5.2-FP8` 一同从 `poc_params.models` 中移除。它仍保留在 `GET /v1/governance/models`（推理目录）中。目前没有主机在 `/v1/epochs/current/participants` 中列出它。以下时间线是原始引导记录（首个符合条件的纪元为 251）。有关当前 PoC 模型，请参阅 [主机快速入门](./quickstart.md) 和 [GLM-5.3-Flash 引导](./glm-bootstrap.md)。

本文档解释了模型组如何变得符合条件以及参与模式的工作方式。

!!! warning "治理列表不等于符合条件"
    以下提及 `Qwen235B` 的时间线步骤为历史记录（原始 Kimi 引导）。`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 已于纪元 308 通过 [提案 78](../network-updates.md#june-25-2026) 移除。请勿部署它。

    在 `poc_params` 中且无投票权的模型是下一个 PoC 的引导候选者。切换 `node-config` 不会恢复共识权重。符合条件需要 `V_min` 的已建立成员和 `W_threshold`（从 `poc_params` 读取实时值）。预符合条件仅为建议性质——足够多的主机仍可通过提交该模型的 PoC 而变得符合条件——但单个主机是不够的。

    请 **不要** 假设您必须 `refuse` 一个不符合条件的模型。常规的错过/拒绝惩罚仅适用于 **符合条件** 的组。在引导路径上，未匹配的主机被视为 NONE；`refuse` 不是引导参与模式。

!!! note 
    引导可能需要多个纪元，具体取决于有多少参与者准备就绪。在激活前，如果参与者明确提交其选择，且打算部署的主机提交 `PoCIntent`，则不会发生权重减少。


## 时间线

#### 在块 `3873996` 之前，所有参与者必须提交：
    - `PoCIntent` - 如果他们将部署 `Kimi-K2.6`。主机应保持使用 `Qwen235B` 部署的节点，并仅在块 `3873996` 评估后切换
    - `PoCDelegation` / `PoCRefusal` - 如果他们 **不** 将部署 `Kimi-K2.6`

#### 在块 `3873996`，链运行预评估以检查是否应基于 `PoCIntent` / `PoCDelegation` 激活该模型
    - 如果模型成为预符合条件 => 提交了 `PoCIntent` 的主机应将其模型节点切换至 `Kimi-K2.6`（此 500 块窗口内无 CPoC）
    - 如果模型未成为预符合条件 => 提交了 `PoCIntent` 的主机应将其节点保持在 `Qwen235B`

#### 在块 `3874496`，PoC 开始


### 可能的场景

新模型的引导可能遵循以下主要场景：

1. 模型在块 `3873996` 未通过预评估，未变得符合条件

- 所有提交了 `PoCIntent` 的人保持其全部权重（无惩罚）
- 所有提交了 `PoCDelegation` / `PoCRefusal` 的人保持其全部权重（无惩罚）
- 所有未提交的人损失 15% 的权重

=> 明确发送包含您意图的交易非常重要

2. 模型在块 `3873996` 通过预评估，但在 PoC 时未变得符合条件

- 所有参与 PoC 的人从 `Qwen235` 起保持其全部权重（无惩罚）
- 所有提交了 `PoCDelegation` / `PoCRefusal` 的人保持其全部权重（无惩罚）
- 所有未提交的人损失 15% 的权重
- 所有提交了 `PoCIntent` 但未参与的人损失 15% 的权重


如果模型通过两项检查，惩罚遵循文档中描述的常规场景。


## 打算部署 Kimi-K2.6 的主机说明

#### 向链提交 `PoCIntent`：

以下示例使用名为 `--from` 的主机密钥。要从热密钥提交意图、委托或拒绝，请参阅 [如何从热密钥声明 PoC 意图？](../FAQ.md#how-do-i-declare-a-poc-intent-from-a-warm-key)。

```
export NODE=https://node3.gonka.ai/
./inferenced tx inference declare-poc-intent moonshotai/Kimi-K2.6 \
  --from node-2 \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

#### 检查您的设置，确保已下载 `Kimi-K2.6` 权重，并能成功部署该模型

3. 等待块 `3873996`+，检查模型是否成为预符合条件：

```bash
NODE=https://node3.gonka.ai
MODEL='moonshotai/Kimi-K2.6'

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

结果将通过所有渠道发送。

#### 如需，将模型切换为 Kimi-K2.6

在 4xB200 / 8xB200 上部署 Kimi-K2.6 的示例命令：
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

#### 验证您的部署

[`gonka` 仓库](https://github.com/gonka-ai/gonka) 提供了一个代理技能 `mlnode-validate`，用于将已部署的 ML 节点与特定模型的预计算诚实 PoC 向量进行验证。对于 Kimi K2.6，提交的黄金参考值为 `mlnode/packages/benchmarks/scripts/poc_validation/artifacts/moonshotai-kimi-k2.6.json`（200 个向量；记录于 4×B200）。请参阅 [验证 ML 节点部署](./mlnode-validation.md) 和 [`skills/mlnode-validate/SKILL.md`](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md)。

## 未部署Kimi-K2.6的主机说明

#### 检查您是否信任任何将部署Kimi K2.6 / 发送 `PoCIntent` 的主机

当前意图：
```python
import time
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

NODE = "https://node3.gonka.ai"
MODEL = "moonshotai/Kimi-K2.6"
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
with_kimi_model = []
skipped = []  # participants whose poc_delegation lookup failed after retries

for p in participants:
    addr = p["index"]
    w = weight(p)
    if MODEL in (p.get("models") or []):
        with_kimi_model.append((addr, w))

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
print(f"With {MODEL} in models[]: {len(with_kimi_model)} (not same as intent)")
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

#### 发送委托或拒绝

委托：
```
export NODE=https://node3.gonka.ai/chain-rpc/
./inferenced tx inference set-poc-delegation moonshotai/Kimi-K2.6 <DELEGATEE> \
  --from gonka-account-key \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```

拒绝：
```
export NODE=https://node3.gonka.ai/chain-rpc/
./inferenced tx inference refuse-poc-delegation moonshotai/Kimi-K2.6 \
  --from gonka-account-key \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y
```
