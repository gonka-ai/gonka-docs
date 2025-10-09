# Benchmark to Choose Optimal Deployment Config for LLMs
## Intro
Effective GPU utilization is critical for deploying large language models. Gonka Nodes utilize a customized vLLM inference engine that supports both high-performance inference and its validation.

To achieve the best results, vLLM requires careful, server-specific configuration. The optimal performance depends on both GPUs' characteristics and the speed of cross-GPU data transfer. This guide provides instructions on how to select vLLM parameters using the Qwen/Qwen3-32B-FP8 model as an example. We will also describe which parameters can be tuned for optimal performance without affecting validation and which parameters must remain unchanged.

[Link to our vLLM fork](https://github.com/product-science/vllm/tree/productscience/v0.8.1).

## Understanding vLLM Parameters
To configure a vLLM-based model deployment, you define `args` for each model:
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
These args define the configuration for each vLLM instance that MLNode will manage. Detailed descriptions can be found in the [vLLM documentation](https://docs.vllm.ai/en/v0.8.1/serving/engine_args.html).

The amount of GPUs used by a single instance of vLLM depends on two parameters: 

- `--tensor-parallel-size (TP)`
- `--pipeline-parallel-size (PP)`

The amount of used GPUs is equal to `TP*PP` in most cases.

If an MLNode has more GPUs than a single instance requests, it will spin up multiple instances, utilizing the available GPUs efficiently. 

For example, if the node has 10 GPUs and each instance is configured to use 4, MLNode will launch two instances (4 + 4 GPUs) and load-balance requests between them. In many cases, deploying a higher number of vLLM instances, with each instance utilizing a smaller count of GPUs, can be a more effective strategy.

There are two types of parameters in vLLM.

| **Type**                      | **Description**                                                                                                                  | **Parameters**                                                                                                   |
|-------------------------------|----------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| **Affects Inference**         | Changes output quality or behavior. You must **not** modify these parameters unless explicitly allowed, as it may cause validation to fail. | <nobr>`--kv-cache-dtype`</nobr><br><nobr>`--max-model-len`</nobr><br><nobr>`--speculative-model`</nobr><br><nobr>`--dtype`</nobr><br><nobr>`--quantization`</nobr> _etc._ |
| **Does Not Affect Inference** | Changes how the model utilizes available GPUs.                                                                                   | <nobr>`--tensor-parallel-size`</nobr><br><nobr>`--pipeline-parallel-size`</nobr><br><nobr>`--enable-expert-parallel`</nobr> _etc._ |               |                    |

## Performance testing
To measure the performance of your model deployment, you'll use the `compressa-perf` tool. You can find the tool on [GitHub](https://github.com/product-science/compressa-perf).

### 1. Install the Benchmark Tool
First, install `compressa-perf` using pip:
```
pip install git+https://github.com/product-science/compressa-perf.git
```
### 2. Obtain the Configuration File
The benchmark tool uses a YAML configuration file to define test parameters. A default configuration file is available [here](https://github.com/product-science/inference-ignite/blob/main/mlnode/packages/benchmarks/resources/config.yml).

### 3. Run the Performance Test
Once your model is deployed, you can test its performance. Use the following command, replacing `<IP>` and `<INFERENCE_PORT>` with your specific deployment details, and `MODEL_NAME` with the name of the model you're testing (e.g., `Qwen/Qwen3-32B-FP8`):
```
compressa-perf \
        measure-from-yaml \
        --no-sign \
        --node_url http://<IP>:<INFERENCE_PORT> \
        config.yml \
        --model_name MODEL_NAME
```
Performance results will be saved to a file named `compressa-perf-db.sqlite`

### 4. View Results
To display the benchmark results, including key metrics and parameters, run:
```
compressa-perf list --show-metrics --show-parameters
```
This command will output a report with the following performance metrics:

| **Metric**                     | **Description**                                                                                                  | **Desired Value** |
|-------------------------------|------------------------------------------------------------------------------------------------------------------|-------------------|
| **TTFT (Time To First Token)** | Time elapsed until the **first token** is generated.                                                            | Lower is better   |
| **LATENCY**                    | Total time taken for the model to generate the **complete response**.                                           | Lower is better   |
| **TPOT (Time Per Output Token)** | Average time to generate **each token after the first one**.                                                    | Lower is better   |
| **THROUGHPUT_INPUT_TOKENS**   | Input token processing speed: total **prompt tokens** / total response time (tokens per second).               | Higher is better  |
| **THROUGHPUT_OUTPUT_TOKENS**  | Output token generation speed: total **generated tokens** / total response time (tokens per second).           | Higher is better  |

## Deployment and Performance Optimization Plan
Testing is performed on a server where MLNode has been deployed according to [the instructions](https://gonka.ai/host/multiple-nodes/#running-the-inference-node-on-a-separate-server).
Ensure the performance tool (`compressa-perf`) is installed and the necessary configuration file has been downloaded before proceeding.

### 1. Establish Initial Configuration with Mandatory Parameters

- Define base configuration:
=== "JSON"
```JSON
"MODEL_NAME": {
    "args": [
    ]
} 
```
### 2. Define Potential Deployment Configurations for Testing
Determine the range of tunable parameters you will experiment with. For performance optimization without affecting inference output, these primarily include parameters like `--tensor-parallel-size (TP`) and `--pipeline-parallel-size (PP)`, among others that do not alter inference results.

Choose these parameters based on your server's GPUs and the model's size. The number of GPUs used by a single vLLM instance is generally the product of tensor-parallel size and pipeline-parallel size. Multiple instances are used automatically if possible.

### 3. Test Each Configuration and Measure Performance
For each defined configuration:
#### 3.1. Deploy the Configuration
Deploy the current configuration using the MLNode REST API endpoint:
```
http://<IP>:<MANAGEMENT_PORT>/api/v1/inference/up
```
Python example below:
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
#### 3.2. Verify Deployment

- Check the MLNode logs for any errors that may have occurred during deployment.
- Verify the deployment status by checking the REST API endpoint `http://<IP>:<MANAGEMENT_PORT>/api/v1/state`.
  
The expected status:
```
{'state': 'INFERENCE'}
```
#### 3.3. Measure Performance
Run the `compressa-perf` tool to measure the performance of the deployed configuration and collect the relevant metrics.
### 4. Compare Performance Results Across Configurations
Analyze the collected metrics (such as `TTFT`, `Latency`, and `Throughput`) from each tested configuration. Compare these results to identify the setup that provides the best performance for the server environment.

## Example: `Qwen/Qwen3-32B-FP8` at 8x4070 STi server
Let’s assume we have a server with 8x4070 S Ti. Each GPU has 16GB VRAM.
We have deployed the `MLNode` container to this server, with the following port mappings:

- API management port (default 8080) is mapped to `http://24.124.32.70:46195`
- Inference port (default 5000) is mapped to `http://24.124.32.70:46085`

For this example, we'll use the `Qwen/Qwen3-32B-FP8` model, which is one of the models deployed at Gonka. It has the following mandatory parameters:

- `--kv-cache-dtype fp8`
- `--quantization fp8`

### 1. Establish Initial Configuration with Mandatory Parameters
Based on these mandatory parameters, the initial configuration for `Qwen/Qwen3-32B-FP8` must include:
=== "JSON"
```JSON
"Qwen/Qwen3-32B-FP8": {
    "args": [
    ]
} 
```
### 2. Define Potential Deployment Configurations for Testing
The `Qwen/Qwen3-32B-FP8` model with those parameters requires at least 80GB of VRAM for efficient deployment. Therefore, we need to use at least 6x4070S Ti for each instance. We can’t fit two instances in this server and want to use all GPUs, let’s deploy a single instance that uses 8 GPUs (TP * PP = 8).
Potential configuration can include:

- **TP=8, PP=1**
- **TP=4, PP=2**
- TP=2, PP=4
- TP=1, PP=8


High pipeline parallelism typically doesn't yield good performance in a single-server deployment. Therefore, in this example, we’ll test only two configurations:

- Configuration 1 (TP=8, PP=1).
- Configuration 2 (TP=4, PP=2)

### 3. Deploy and Measure Each Configuration
#### 3.1 Configuration 1 (TP=8, PP=1)
##### 3.1.1. Deploy
Use a Python script to deploy the model: 
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
The expected status:
```
{"status": "OK"}
```
##### 3.1.2. Verify Deployment
In MLNode logs, we see that vLLM has been deployed successfully:
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
To further verify, let's check the status via the API:
=== "Python"
```python
requests.get(
   "http://24.124.32.70:46195/api/v1/state"
).JSON()
```
The expected status:
```
{'state': 'INFERENCE'}
```
The model has been deployed successfully.

##### 3.1.3. ​​Measure Performance
Start the performance test:
```
compressa-perf \
        measure-from-yaml \
        --no-sign \
        --node_url http://24.124.32.70:46085 \
        --model_name Qwen/Qwen3-32B-FP8 \
        config.yml
```
!!! note "Check Logs If Errors Occur"
    The configuration may still not work as expected; if errors occur, check the MLNode logs for troubleshooting. 

When the tests are finished, we can see the result: 
```
compressa-perf list --show-metrics --show-parameters
```
Results:

![Results for Configuration 1](results-for-configuration-1-(tp=8-pp=1).png)

#### 3.2. Configuration 2 (TP=4, PP=2)
##### 3.2.1. Deploy
Use a Python script to deploy the model: 
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
The expected status:
```
{"status": "OK"}
```
##### 3.2.2. Verify Deployment  
Check that the log shows successful deployment  and `/api/v1/state` still returns `{'state': 'INFERENCE'}`

##### 3.2.3. ​​Measure Performance  
Measure performance a second time using the same command:
```
compressa-perf \
        measure-from-yaml \
        --no-sign \
        --node_url http://24.124.32.70:46085 \
        --model_name Qwen/Qwen3-32B-FP8 \
        config.yml
```
When the test finishes, we can check the results:
```
compressa-perf list --show-metrics --show-parameters
```
![Results for Configuration 2](results-for-configuration-2-(tp=4-pp=2).png)

### 4. Compare Performance Results Across Configurations
Our experiment shows the following metrics:

| **Experiment**                         | **Metrics**           | **TP 8, PP 1** | **TP 4, PP 2** |
|---------------------------------------|------------------------|----------------|----------------|
| ~1000 token input / ~300 token output | **TTFT**               | 6.2342         | **4.7595**     |
| ~1000 token input / ~300 token output | **THROUGHPUT INPUT**   | 497.8204       | 500.2883   |
| ~1000 token input / ~300 token output | **THROUGHPUT OUTPUT**  | 143.3828       | 144.0936   |
| ~1000 token input / ~300 token output | **LATENCY**            | 20.9172        | 20.8093        |
| ~23000 token input / ~1000 token output | **TTFT**             | 57.7112        | **28.6839**    |
| ~23000 token input / ~1000 token output | **THROUGHPUT INPUT**   | 840.3887       | **1017.6811**  |
| ~23000 token input / ~1000 token output | **THROUGHPUT OUTPUT**  | 35.7324        | **43.3700**    |
| ~23000 token input / ~1000 token output | **LATENCY**            | 271.9932       | **223.6245**   |


The TP=4 and PP=2 setup shows consistently better performance, and we should use it.
