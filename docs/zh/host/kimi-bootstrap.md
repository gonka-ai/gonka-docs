# Kimi K2.6 启动引导

`moonshotai/Kimi-K2.6` 已**通过启动引导**，并在 Gonka 主网上处于 Proof of Compute（计算证明）的**激活状态**。以下时间线和交易示例对于理解激活机制以及委托等操作仍然具有参考价值；有关当前部署的默认设置（包括 `node-config.json`），请参阅[主机快速入门指南](./quickstart.md)。

模型组 `moonshotai/Kimi-K2.6` 在第 251 轮（Epoch 251）时具备了资格。

本文档说明了如何最小化权重减少的风险，无论模型是否获得足够的参与者。

!!! note
    启动过程可能需要多个轮次，具体取决于准备就绪的参与者数量。在激活之前，只要参与者明确提交了选择，且计划部署的主机提交了 `PoCIntent`，就不会发生权重减少。

## 时间线

#### 1. 在区块 `3873996` 之前，所有参与者必须提交：
 
 
   - `PoCIntent` —— 如果他们计划部署 `Kimi-K2.6`。主机应保持节点运行 `Qwen235B`，并在区块 `3873996` 的评估后才进行切换
 
 
   - `PoCDelegation` / `PoCRefusal` —— 如果他们**不**计划部署 `Kimi-K2.6`

#### 2. 在区块 `3873996`，链上执行预评估，以检查是否应基于 `PoCIntent` / `PoCDelegation` 尝试激活该模型
 
 
   - 如果模型达到预资格状态 => 提交了 `PoCIntent` 的主机应将其模型节点切换为 `Kimi-K2.6`（此 500 个区块窗口内无 CPoC）
 
 
   - 如果模型未达到预资格状态 => 提交了 `PoCIntent` 的主机应保持其节点运行 `Qwen235B`

#### 3. 在区块 `3874496`，PoC 开始

### 可能的情况

新模型的启动可能遵循以下主要场景：

1. 模型在区块 `3873996` 未通过预评估，且未获得资格

- 所有提交了 `PoCIntent` 的参与者保留全部权重（无惩罚）
- 所有提交了 `PoCDelegation` / `PoCRefusal` 的参与者保留全部权重（无惩罚）
- 所有未提交任何内容的参与者将损失 15% 的权重

=> 明确发送一条包含你预期行为的交易非常重要

2. 模型在区块 `3873996` 通过预评估，但在 PoC 阶段未获得资格

- 所有参与 PoC 的参与者从 `Qwen235` 起保留全部权重（无惩罚）
- 所有提交了 `PoCDelegation` / `PoCRefusal` 的参与者保留全部权重（无惩罚）
- 所有未提交任何内容的参与者将损失 15% 的权重
- 所有提交了 `PoCIntent` 但未参与的参与者将损失 15% 的权重

如果模型通过了两次检查，惩罚将遵循文档中描述的常规情况。

## 计划部署 Kimi-K2.6 的主机操作指南

#### 1. 向链上发送 `PoCIntent`：

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

#### 2. 检查您的设置，确保已下载 `Kimi-K2.6` 权重，并且能够成功部署模型

3. 等待区块高度达到 `3873996`+，并检查模型是否变为预合格状态：

```bash
NODE=https://node3.gonka.ai
MODEL='moonshotai/Kimi-K2.6'

HEIGHT=$(curl -sG "$NODE/chain-rpc/block_search" \
  --data-urlencode "query=\"bootstrap_model_preeligibility.model_id='$MODEL'\"" \
  | jq -r '[.result.blocks[].block.header.height|tonumber]|max')

echo "Latest snapshot at height $HEIGHT"

curl -s "$NODE/chain-rpc/block_results?height=$HEIGHT" \
  | jq --arg m "$MODEL" ' .result.finalize_block_events[] select(.type=="bootstrap_model_preeligibility") (.attributes | from_entries) as $a select($a.model_id==$m) $a'
 


结果将发送到所有频道。

如有需要，切换模型至 Kimi-K2.6

在 4xB200 / 8xB200 上部署 Kimi-K2.6 的示例命令：


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


验证您的部署

[`gonka` 仓库](https://github.com/gonka-ai/gonka) 提供了一个代理技能 `mlnode-validate`，可用于将已部署的 ML 节点与特定模型的预计算诚实 PoC 向量进行比对验证。对于 Kimi K2.6 模型，已提交的黄金参考数据为 `mlnode/packages/benchmarks/scripts/poc_validation/artifacts/moonshotai-kimi-k2.6.json`（200 个向量；记录于 4×B200 设备）。详见 [验证 ML 节点部署](./mlnode-validation.md) 和 [`skills/mlnode-validate/SKILL.md`](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md)。

不计划部署 Kimi-K2.6 的主机操作指南

检查您是否信任计划部署 Kimi K2.6 的主机 / 发送 `PoCIntent`

当前意向：


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
 
   Retry transient 5xx (node3 returns 503 for some poc_delegation lookups
 
   under load) so a single hiccup does not silently drop a participant
 
   from the result.
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
 
   weight may be 0, missing, or literally null — all mean "no voting weight".
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
skipped = []
  participants whose poc_delegation lookup failed after retries

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
    print(f"Intent share: {100.0
 intent_weight / total:.2f}%")
if skipped:
    print()
    print(f"Skipped {len(skipped)} participants after retries (intent may be undercounted):")
    for addr, w, err in skipped:
        print(f"  {addr} (weight={w}): {err}")


发送委派或拒绝

委派：


export NODE=https://node3.gonka.ai/chain-rpc/
./inferenced tx inference set-poc-delegation moonshotai/Kimi-K2.6 <DELEGATEE> \
  --from gonka-account-key \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y


拒绝：


export NODE=https://node3.gonka.ai/chain-rpc/
./inferenced tx inference refuse-poc-delegation moonshotai/Kimi-K2.6 \
  --from gonka-account-key \
  --node "$NODE" \
  --chain-id gonka-mainnet \
  --keyring-backend file \
  --gas auto \
  --gas-adjustment 1.3 \
  -y

