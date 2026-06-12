# 选择大语言模型最优部署配置的基准测试指南
## 简介
高效的 GPU 利用率对于部署大型语言模型（LLM）至关重要。Gonka 节点采用定制化的 vLLM 推理引擎，支持高性能推理及其验证。

为了达到最佳效果，vLLM 需要针对具体服务器进行精细配置。最优性能取决于 GPU 本身的特性以及 GPU 间数据传输的速度。本指南将介绍如何以 Qwen/Qwen3-32B-FP8 模型为例，选择合适的 vLLM 参数。我们还将说明哪些参数可以在不影响验证结果的前提下进行调优以提升性能，以及哪些参数必须保持不变。

!!! note "性能 vs. 正确性"
    本指南聚焦于 **性能调优**（`compressa-perf`、TP / PP）。若要验证您的部署是否生成与目标模型黄金参考结果匹配的真实 PoC 向量，请参阅 [验证 ML 节点部署](./mlnode-validation.md)（见 [`gonka` 仓库](https://github.com/gonka-ai/gonka) 中的 `mlnode-validate` 技能）。

    [访问我们的 vLLM 分支](https://github.com/product-science/vllm/tree/productscience/v0.8.1)。

## 理解 vLLM 参数
在配置基于 vLLM 的模型部署时，您需要为每个模型定义 `args`：
```

"Qwen/Qwen3-32B-FP8": {
    "args": [
        "--tensor-parallel-size",
        "4",
        "--pipeline-parallel-size",
        "2"
    ]
}
```

这些参数定义了 MLNode 将管理的每个 vLLM 实例的配置。详细说明可参见 [vLLM 官方文档](https://docs.vllm.ai/en/v0.8.1/serving/engine_args.html)。

单个 vLLM 实例使用的 GPU 数量取决于以下两个参数：

- `--tensor-parallel-size (TP)`
- `--pipeline-parallel-size (PP)`

在大多数情况下，所使用的 GPU 数量等于 `TP*PP`。

如果一个 MLNode 拥有的 GPU 数量超过单个实例的请求量，它将启动多个实例，以高效利用可用的 GPU。

例如，如果节点有 10 个 GPU，而每个实例配置使用 4 个 GPU，则 MLNode 将启动两个实例（4
 
+ 4 个 GPU），并在它们之间进行请求负载均衡。在许多情况下，部署更多数量的 vLLM 实例，每个实例使用较少的 GPU，可能是一种更有效的策略。

vLLM 中有两种类型的参数。

| **类型 * * | **描述 * * | **参数 * * |
| --- | --- | --- |
| **影响推理结果 * * | 会改变输出质量或行为。除非明确允许，否则**不得**修改这些参数，否则可能导致验证失败。 |  |
| **不影响推理结果 * * |  |  |
## 性能测试
为了测量模型部署的性能，你将使用 `compressa-perf` 工具。你可以在 [GitHub](https://github.com/product-science/compressa-perf) 上找到该工具。

### 1. 安装基准测试工具
首先，使用 pip 安装 `compressa-perf`：
```

pip install git+https://github.com/product-science/compressa-perf.git
```

### 2. 获取配置文件
基准测试工具使用 YAML 配置文件来定义测试参数。默认的配置文件可从 [此处](https://github.com/product-science/inference-ignite/blob/main/mlnode/packages/benchmarks/resources/config.yml) 获取。

### 3. 运行性能测试
部署模型后，即可开始测试其性能。请使用以下命令，并将 `<IP>` 和 `<INFERENCE_PORT>` 替换为您的具体部署信息，将 `MODEL_NAME` 替换为待测试模型的名称（例如 `Qwen/Qwen3-32B-FP8`）：
```

compressa-perf \
        measure-from-yaml \
        --no-sign \
        --node_url http://<IP>:<INFERENCE_PORT> \
        config.yml \
        --model_name MODEL_NAME
```

性能结果将保存到名为 `compressa-perf-db.sqlite` 的文件中

### 4. 查看结果
要显示包含关键指标和参数的基准测试结果，请运行：
```

compressa-perf list --show-metrics --show-parameters
```

该命令将输出一份包含以下性能指标的报告：

| **指标 * * | **说明 * * | **理想值 * * |
| --- | --- | --- |
| **TTFT（首Token时间） * * | 从开始到生成**第一个Token**所经过的时间。 |  |
| **延迟（LATENCY） * * |  |  |
| **TPOT（每个输出Token耗时） * * |  |  |
| **输入吞吐量（THROUGHPUT_INPUT_TOKENS） * * |  |  |
| **输出吞吐量（THROUGHPUT_OUTPUT_TOKENS） * * |  |  |
## 部署与性能优化方案
测试在已按照[部署指南](https://gonka.ai/host/multiple-nodes/#running-the-inference-node-on-a-separate-server)部署了MLNode的服务器上进行。  
请在继续之前确保已安装性能测试工具（`compressa-perf`）并下载了必要的配置文件。

### 1. 使用必选参数建立初始配置

- 定义基础配置：
=== "JSON"

```JSON
"MODEL_NAME": {
    "args": [
    ]
} 
```

### 2. 定义用于测试的潜在部署配置
确定你将要实验的可调参数范围。在不影响推理输出的前提下进行性能优化时，这些参数主要包括 `--tensor-parallel-size (TP` 和 `--pipeline-parallel-size (PP)` 等不会改变推理结果的参数。

根据服务器的 GPU 配置和模型大小来选择这些参数。单个 vLLM 实例使用的 GPU 数量通常等于张量并行规模（tensor-parallel size）与流水线并行规模（pipeline-parallel size）的乘积。在条件允许时，系统将自动使用多个实例。

### 3. 测试每种配置并测量性能
针对每种定义的配置：
#### 3.1 部署配置
使用 MLNode REST API 端点部署当前配置：
```

http://<IP>:<MANAGEMENT_PORT>/api/v1/inference/up
```

Python 示例如下：
=== "Python"

```Python
import requests
from typing import List, Optional

def inference_up(
   base_url: str,
   model: str,
   config: dict
) -> dict:
   url = f"{base_url}/api/v1/inference/up"
   payload = {
       "model": model,
       "dtype": "float16",
       "additional_args": config["args"]
   }
  
   response = requests.post(url, json=payload)
   response.raise_for_status()
  
   return response.json()

model_name = "MODEL_NAME"
model_config = {
   "args": [
       "--tensor-parallel-size", "8",
       "--pipeline-parallel-size", "1",
   ]
}

inference_up(
   base_url="http://<IP>:<MANAGEMENT_PORT>",
   model=model_name,
   config=model_config
)
```

#### 3.
2. 验证部署

- 检查 MLNode 日志，查看部署过程中是否发生任何错误。
- 通过检查 REST API 端点 `http://<IP>:<MANAGEMENT_PORT>/api/v1/state` 来验证部署状态。

预期状态：
```

{'state': 'INFERENCE'}
```

#### 3.
3. 测量性能
运行 `compressa-perf` 工具以测量已部署配置的性能，并收集相关指标。

### 4. 比较不同配置的性能结果
分析从每种测试配置中收集的指标（例如 `TTFT`、`Latency` 和 `Throughput`），比较这些结果，以确定在服务器环境中提供最佳性能的配置。

## 示例：8x4070 STi 服务器上的 `Qwen/Qwen3-32B-FP8`
假设我们有一台配备 8 块 4070 S Ti 显卡的服务器，每块 GPU 拥有 16GB 显存。  
我们已在该服务器上部署了 `MLNode` 容器，并配置了以下端口映射：

- API 管理端口（默认 8080）映射到 `http://24.124.32.70:46195`
- 推理端口（默认 5000）映射到 `http://24.124.32.70:46085`

在本示例中，我们将使用 `Qwen/Qwen3-32B-FP8` 模型，该模型是 Gonka 上部署的模型之一，其具有以下必需参数：

- `--kv-cache-dtype fp8`
- `--quantization fp8`

### 1. 使用必需参数建立初始配置
根据这些必需参数，`Qwen/Qwen3-32B-FP8` 的初始配置必须包含：  
=== "JSON"

```JSON
"Qwen/Qwen3-32B-FP8": {
    "args": [
    ]
} 
```

### 2. 定义用于测试的潜在部署配置
`Qwen/Qwen3-32B-FP8` 模型在使用这些参数时，需要至少 80GB 的显存才能高效部署。因此，每个实例至少需要使用 6 块 4070S Ti 显卡。由于无法在该服务器上部署两个实例，并且我们希望充分利用所有 GPU，因此将部署一个使用 8 块 GPU 的单实例（TP
 
* PP = 8）。

可能的配置包括：

- **TP=8, PP=1**
- **TP=4, PP=2**
- TP=2, PP=4
- TP=1, PP=8

在单服务器部署中，高流水线并行度（PP）通常无法获得良好的性能表现。因此，在本例中，我们仅测试以下两种配置：

- 配置 1（TP=8, PP=1）
- 配置 2（TP=4, PP=2）

### 3. 部署并测量每种配置
#### 3.1 配置 1（TP=8, PP=1）
##### 3.1.1 部署
使用 Python 脚本部署模型：
=== "Python"

```Python
...
model_name = Qwen/Qwen3-32B-FP8"
model_config = {
   "args": [
       "--tensor-parallel-size", "8",
       "--pipeline-parallel-size", "1",
   ]
}

inference_up(
   base_url="http://24.124.32.70:46195",
   model=model_name,
   config=model_config
)
```

预期状态：
```

{"status": "OK"}
```

##### 3.
1.
2. 验证部署
在 MLNode 日志中，我们可以看到 vLLM 已成功部署：
```

...
INFO 05-15 23:50:01 [api_server.py:1024] Starting vLLM API server on http://0.0.0.0:5000
INFO 05-15 23:50:01 [launcher.py:26] Available routes are:
INFO 05-15 23:50:01 [launcher.py:34] Route: /openapi.JSON, Methods: GET, HEAD
INFO 05-15 23:50:01 [launcher.py:34] Route: /docs, Methods: GET, HEAD
INFO 05-15 23:50:01 [launcher.py:34] Route: /docs/oauth2-redirect, Methods: GET, HEAD
INFO 05-15 23:50:01 [launcher.py:34] Route: /redoc, Methods: GET, HEAD
INFO 05-15 23:50:01 [launcher.py:34] Route: /health, Methods: GET
INFO 05-15 23:50:01 [launcher.py:34] Route: /load, Methods: GET
INFO 05-15 23:50:01 [launcher.py:34] Route: /ping, Methods: GET, POST
INFO 05-15 23:50:01 [launcher.py:34] Route: /tokenize, Methods: POST
INFO 05-15 23:50:01 [launcher.py:34] Route: /detokenize, Methods: POST
INFO 05-15 23:50:01 [launcher.py:34] Route: /v1/models, Methods: GET
INFO 05-15 23:50:01 [launcher.py:34] Route: /version, Methods: GET
INFO 05-15 23:50:01 [launcher.py:34] Route: /v1/chat/completions, Methods: POST
INFO 05-15 23:50:01 [launcher.py:34] Route: /v1/completions, Methods: POST
INFO 05-15 23:50:01 [launcher.py:34] Route: /v1/embeddings, Methods: POST
INFO 05-15 23:50:01 [launcher.py:34] Route: /pooling, Methods: POST
INFO 05-15 23:50:01 [launcher.py:34] Route: /score, Methods: POST
INFO 05-15 23:50:01 [launcher.py:34] Route: /v1/score, Methods: POST
INFO 05-15 23:50:01 [launcher.py:34] Route: /v1/audio/transcriptions, Methods: POST
INFO 05-15 23:50:01 [launcher.py:34] Route: /rerank, Methods: POST
INFO 05-15 23:50:01 [launcher.py:34] Route: /v1/rerank, Methods: POST
INFO 05-15 23:50:01 [launcher.py:34] Route: /v2/rerank, Methods: POST
INFO 05-15 23:50:01 [launcher.py:34] Route: /invocations, Methods: POST
INFO:     Started server process [4437]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     127.0.0.1:37542
 - "GET /v1/models HTTP/1.1" 200 OK
```

为了进一步验证，让我们通过 API 检查状态：
=== "Python"

```python
requests.get(
   "http://24.124.32.70:46195/api/v1/state"
).JSON()
```

预期状态：
```

{'state': 'INFERENCE'}
```

模型已成功部署。

##### 3.
1.
3. 测量性能
启动性能测试：
```

compressa-perf \
        measure-from-yaml \
        --no-sign \
        --node_url http://24.124.32.70:46085 \
        --model_name Qwen/Qwen3-32B-FP8 \
        config.yml
```

!!! note "如果发生错误，请检查日志"
    配置可能仍然无法按预期工作；如果发生错误，请检查 MLNode 日志以进行故障排查。

    当测试完成后，我们可以看到结果： 
```

compressa-perf list --show-metrics --show-parameters
```

结果：

![配置1的结果](results-for-configuration-1-(tp=8-pp=1).png)

#### 3.
2. 配置2 (TP=4, PP=2)
##### 3.
2.
1. 部署
使用 Python 脚本部署模型：
=== "Python"

```Python
...
model_name = "Qwen/Qwen3-32B-FP8"
model_config = {
   "args": [
       "--tensor-parallel-size", "4",
       "--pipeline-parallel-size", "2",
   ]
}

inference_up(
   base_url="http://24.124.32.70:46195",
   model=model_name,
   config=model_config
)
```

预期状态：
```

{"status": "OK"}
```

##### 3.
2.
2. 验证部署  
检查日志是否显示部署成功，并确认 `/api/v1/state` 仍然返回 `{'state': 'INFERENCE'}`

##### 3.
2.
3. 测量性能  
使用相同的命令再次测量性能：
```

compressa-perf \
        measure-from-yaml \
        --no-sign \
        --node_url http://24.124.32.70:46085 \
        --model_name Qwen/Qwen3-32B-FP8 \
        config.yml
```

测试完成后，我们可以检查结果：
```

compressa-perf list --show-metrics --show-parameters
```

![配置2的结果](results-for-configuration-2-(tp=4-pp=2).png)

### 4. 跨配置性能结果对比
我们的实验得到以下指标：

| **实验 * * | **指标 * * | **TP 8, PP 1 * * | **TP 4, PP 2 * * |
| --- | --- | --- | --- |
| ~1000 token 输入 / ~300 token 输出 | **TTFT * * |  |  |
| ~1000 token 输入 / ~300 token 输出 |  |  |  |
| ~1000 token 输入 / ~300 token 输出 |  |  |  |
| ~1000 token 输入 / ~300 token 输出 |  |  |  |
| ~23000 token 输入 / ~1000 token 输出 |  |  |  |
| ~23000 token 输入 / ~1000 token 输出 |  |  |  |
| ~23000 token 输入 / ~1000 token 输出 |  |  |  |
| ~23000 token 输入 / ~1000 token 输出 |  |  |  |
TP=4 且 PP=2 的配置在各项指标上均表现出更优的性能，因此我们应选择该配置。
