# 用于选择LLM最优部署配置的基准测试
## 引言
高效的GPU利用率对于部署大语言模型至关重要。Gonka节点采用定制的vLLM推理引擎，支持高性能推理及其验证。

为获得最佳效果，vLLM需要针对服务器进行细致配置。最优性能取决于GPU的特性以及跨GPU数据传输的速度。本指南将以`Qwen/Qwen3-32B-FP8`模型作为**示例**，介绍如何选择vLLM参数。该模型并非当前主网PoC模型——请复制调优方法，然后将其应用于[Host Quickstart](./quickstart.md)中经治理批准的模型。本指南还说明了哪些参数可以在不影响验证的前提下进行调优，以及哪些参数必须保持不变。

!!! note "性能与正确性"
    本指南关注**性能调优**（`compressa-perf`，TP / PP）。要验证您的部署是否生成与目标模型黄金参考值匹配的诚实PoC向量，请参阅[验证ML节点部署](./mlnode-validation.md)（[`gonka`仓库](https://github.com/gonka-ai/gonka)中的`mlnode-validate`技能）。

    [链接到我们的vLLM分支](https://github.com/product-science/vllm/tree/productscience/v0.8.1)。

## 理解vLLM参数
要配置基于vLLM的模型部署，您需为每个模型定义`args`：
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
这些参数定义了MLNode将管理的每个vLLM实例的配置。详细说明请参见[vLLM文档](https://docs.vllm.ai/en/v0.8.1/serving/engine_args.html)。

单个vLLM实例使用的GPU数量取决于两个参数：

- `--tensor-parallel-size (TP)`
- `--pipeline-parallel-size (PP)`

在大多数情况下，使用的GPU数量等于`TP*PP`。

如果MLNode的GPU数量多于单个实例请求的数量，它将启动多个实例，以高效利用可用GPU。

例如，如果节点有10个GPU，而每个实例配置使用4个GPU，则MLNode将启动两个实例（4 + 4个GPU），并在它们之间负载均衡请求。在许多情况下，部署更多vLLM实例，每个实例使用较少的GPU，可能是一种更有效的策略。

vLLM中有两种类型的参数。

| **类型** | **描述** | **参数** |
| --- | --- | --- |
| **影响推理** | 更改输出质量或行为。除非明确允许，否则**不得**修改这些参数，否则可能导致验证失败。 |  |
| **不影响推理** | Changes how the model utilizes available GPUs. |  |

## 性能测试
为衡量模型部署的性能，您将使用`compressa-perf`工具。该工具可在[GitHub](https://github.com/product-science/compressa-perf)上找到。

### 安装基准工具
首先，使用pip安装`compressa-perf`：
```
pip install git+https://github.com/product-science/compressa-perf.git
```
### 获取配置文件
基准工具使用YAML配置文件定义测试参数。默认配置文件可在此处获取：[here](https://github.com/product-science/inference-ignite/blob/main/mlnode/packages/benchmarks/resources/config.yml)。

### 运行性能测试
模型部署完成后，您可以测试其性能。使用以下命令，将`<IP>`和`<INFERENCE_PORT>`替换为您的具体部署详情，将`MODEL_NAME`替换为您测试的模型名称（例如`Qwen/Qwen3-32B-FP8`）：
```
compressa-perf \
        measure-from-yaml \
        --no-sign \
        --node_url http://<IP>:<INFERENCE_PORT> \
        config.yml \
        --model_name MODEL_NAME
```
性能结果将保存到名为`compressa-perf-db.sqlite`的文件中

### 查看结果
要显示基准结果，包括关键指标和参数，请运行：
```
compressa-perf list --show-metrics --show-parameters
```
此命令将输出包含以下性能指标的报告：

| **指标** | **描述** | **期望值** |
|-------------------------------|------------------------------------------------------------------------------------------------------------------|-------------------|
| **TTFT（首令牌时间）** | 生成**第一个令牌**所经过的时间。 | 越低越好 |
| **延迟** | 模型生成**完整响应**所花费的总时间。 | 越低越好 |
| **TPOT（每个输出令牌时间）** | 生成**第一个令牌之后每个令牌的平均时间**。 | 越低越好 |
| **THROUGHPUT_INPUT_TOKENS** | 输入令牌处理速度：总**提示令牌数** / 总响应时间（令牌/秒）。 | 越高越好 |
| **THROUGHPUT_OUTPUT_TOKENS** | 输出令牌生成速度：总**生成令牌数** / 总响应时间（令牌/秒）。 | 越高越好 |

## 部署与性能优化计划
测试在已根据[说明](https://gonka.ai/host/multiple-nodes/#running-the-inference-node-on-a-separate-server)部署MLNode的服务器上进行。
请确保在继续之前已安装性能工具（`compressa-perf`）并下载了必要的配置文件。

### 使用必选参数建立初始配置

- 定义基础配置：
=== "JSON"
```JSON
"MODEL_NAME": {
    "args": [
    ]
} 
```
### 定义待测试的潜在部署配置
确定您将实验的可调参数范围。为在不影响推理输出的前提下优化性能，这些参数主要包括`--tensor-parallel-size (TP`和`--pipeline-parallel-size (PP)`等不改变推理结果的参数。

根据服务器的GPU和模型大小选择这些参数。单个vLLM实例使用的GPU数量通常是张量并行大小与流水线并行大小的乘积。如果可能，将自动使用多个实例。

### 测试每种配置并测量性能
对于每种定义的配置：
#### 3.1. 部署配置
使用MLNode REST API端点部署当前配置：
```
http://<IP>:<MANAGEMENT_PORT>/api/v1/inference/up
```
Python示例如下：
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
#### 3.2. 验证部署

- 检查MLNode日志以确认部署过程中是否出现任何错误。
- 通过检查REST API端点`http://<IP>:<MANAGEMENT_PORT>/api/v1/state`来验证部署状态。

预期状态：
```
{'state': 'INFERENCE'}
```
#### 3.3. 测量性能
运行`compressa-perf`工具以测量已部署配置的性能并收集相关指标。
### 比较不同配置的性能结果
分析每个测试配置收集的指标（如`TTFT`、`Latency`和`Throughput`）。比较这些结果，以确定在服务器环境中性能最佳的配置。

## 示例：`Qwen/Qwen3-32B-FP8`在8x4070 STi服务器上
假设我们有一台配备8x4070 S Ti的服务器。每块GPU具有16GB显存。
我们已将`MLNode`容器部署到此服务器，并具有以下端口映射：

- API管理端口（默认8080）映射到`http://24.124.32.70:46195`
- 推理端口（默认 5000）映射到 `http://24.124.32.70:46085`

此示例使用 `Qwen/Qwen3-32B-FP8` 模型。它**尚未**部署在 Gonka 主网；仅作为基准流程的示例。它具有以下必需参数：

- `--kv-cache-dtype fp8`
- `--quantization fp8`

### 使用必需参数建立初始配置
基于这些必需参数，`Qwen/Qwen3-32B-FP8` 的初始配置必须包括：
=== "JSON"
```JSON
"Qwen/Qwen3-32B-FP8": {
    "args": [
    ]
} 
```
### 定义用于测试的潜在部署配置
具有这些参数的 `Qwen/Qwen3-32B-FP8` 模型至少需要 80GB VRAM 才能高效部署。因此，每个实例至少需要使用 6x4070S Ti。我们无法在本服务器上容纳两个实例，且希望使用所有 GPU，因此部署一个使用 8 个 GPU 的单实例（TP * PP = 8）。
潜在配置可包括：

- **TP=8, PP=1**
- **TP=4, PP=2**
- TP=2, PP=4
- TP=1, PP=8


高流水线并行性在单服务器部署中通常无法获得良好性能。因此，在本示例中，我们仅测试两种配置：

- 配置 1（TP=8, PP=1）。
- 配置 2（TP=4, PP=2）

### 部署并测量每种配置
#### 3.1 配置 1（TP=8, PP=1）
##### 3.1.1. 部署
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
##### 3.1.2. 验证部署
在 MLNode 日志中，我们看到 vLLM 已成功部署：
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
INFO:     127.0.0.1:37542 - "GET /v1/models HTTP/1.1" 200 OK
```
为进一步验证，请通过 API 检查状态：
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

##### 3.1.3. ​​测量性能
启动性能测试：
```
compressa-perf \
        measure-from-yaml \
        --no-sign \
        --node_url http://24.124.32.70:46085 \
        --model_name Qwen/Qwen3-32B-FP8 \
        config.yml
```
!!! note "检查日志以排查错误"
    配置可能仍无法按预期工作；如果出现错误，请检查 MLNode 日志以进行故障排除。

    测试完成后，我们可以看到结果： 
```
compressa-perf list --show-metrics --show-parameters
```
结果：

![配置 1 的结果](results-for-configuration-1-(tp=8-pp=1).png)

#### 3.2. 配置 2（TP=4, PP=2）
##### 3.2.1. 部署
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
##### 3.2.2. 验证部署
检查日志是否显示部署成功，且 `/api/v1/state` 仍返回 `{'state': 'INFERENCE'}`

##### 3.2.3. ​​测量性能
使用相同命令再次测量性能：
```
compressa-perf \
        measure-from-yaml \
        --no-sign \
        --node_url http://24.124.32.70:46085 \
        --model_name Qwen/Qwen3-32B-FP8 \
        config.yml
```
当测试完成后，我们可以检查结果：
```
compressa-perf list --show-metrics --show-parameters
```
![Results for Configuration 2](results-for-configuration-2-(tp=4-pp=2).png)

### 比较不同配置的性能结果
我们的实验显示了以下指标：

| **Experiment** | **Metrics** | **TP 8, PP 1** | **TP 4, PP 2** |
|---------------------------------------|------------------------|----------------|----------------|
| ~1000 token input / ~300 token output | **TTFT** | 6.2342 | **4.7595** |
| ~1000 token input / ~300 token output | **THROUGHPUT INPUT** | 497.8204 | 500.2883 |
| ~1000 token input / ~300 token output | **THROUGHPUT OUTPUT** | 143.3828 | 144.0936 |
| ~1000 token input / ~300 token output | **LATENCY** | 20.9172 | 20.8093 |
| ~23000 token input / ~1000 token output | **TTFT** | 57.7112 | **28.6839** |
| ~23000 token input / ~1000 token output | **THROUGHPUT INPUT** | 840.3887 | **1017.6811** |
| ~23000 token input / ~1000 token output | **THROUGHPUT OUTPUT** | 35.7324 | **43.3700** |
| ~23000 token input / ~1000 token output | **LATENCY** | 271.9932 | **223.6245** |


TP=4 和 PP=2 的配置表现出更稳定的性能，我们应该使用它。
