# 多节点部署

在此方案中，你将在多台服务器上分别部署网络节点与一个或多个推理（ML）节点。要加入网络，需要部署两个服务：

- **网络节点（Network node）**：由 **链节点（chain node）** 与 **API 节点（api node）** 组成，负责所有通信；链节点连接区块链，API 节点处理用户请求。
- **推理（ML）节点（Inference node）**：在 GPU 上执行大语言模型（LLM）推理。加入网络至少需要一个 ML 节点。

本指南同时给出单机部署与分机部署的步骤。所有服务均以 Docker 容器方式部署。

---

## 先决条件

网络节点的推荐硬件：

- 16 核 CPU（amd64）
- 64 GB 及以上内存
- 1TB NVMe SSD
- 至少 100Mbps 网络（推荐 1Gbps）

最终需求取决于连接的 ML 节点数量及其总吞吐。

在开始之前，请先完成[快速开始](https://gonka.ai/host/quickstart/)至第 3.4 步，包括：

- 硬件与软件要求
- 下载部署文件
- 容器访问鉴权
- 密钥管理配置（账户密钥与 ML 运营密钥）
- 主机注册与权限配置

---

## 启动网络节点与推理节点
本节说明如何在分布式环境中部署一个网络节点与多个推理节点。

!!! note
    在启动网络节点之前，请确保网络服务器上的 `config.env` 文件中，DAPI_API__POC_CALLBACK_URL 变量已正确设置。该变量定义了 API 容器的回调地址（callback URL），该地址会传递给所有 ML 节点，以便它们知道将计算证明（Proof-of-Compute, PoC）的 nonce 发送到哪里。
    在多节点部署环境中，此 URL 必须能被集群中所有 ML 节点访问。请不要保留默认的 Docker 内部地址（`http://api:9100`），因为外部 ML 节点无法访问它。应将其替换为网络节点服务器的 私有网络地址（或内部 DNS 名称），例如：`DAPI_API__POC_CALLBACK_URL=http://<NETWORK_NODE_PRIVATE_IP>:9100`. 如果网络节点的 API 容器已经使用错误的值启动，请修改 config.env 后 重新启动 api 容器. 请确保端口 `9100` 已开启，并且在您的网络环境中可被所有推理（ML）节点访问。

## 启动网络节点

请确保已先完成[快速开始](https://gonka.ai/host/quickstart/)第 3.3 步（密钥管理与主机注册）。

该服务器将作为对外参与者的入口，需具备公网可访问性（建议使用静态 IP 或域名），并具备高可靠、高安全与高带宽的网络环境。

### 单机部署：网络节点 + 推理节点
若你的网络节点服务器自带 GPU，且希望在同一台机器上同时运行**网络节点**与**推理节点**，在 `gonka/deploy/join` 目录执行：

```
source config.env && \
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d && \
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml logs -f
```

上述命令将在同一台机器上启动**一个网络节点**与**一个推理节点**。

### 分机部署：仅网络节点

若你的网络节点服务器**没有 GPU**，且只运行**网络节点**（不包含推理节点），在 `gonka/deploy/join` 目录执行：

```
source config.env && \
docker compose -f docker-compose.yml up -d && \
docker compose -f docker-compose.yml logs -f
```

### 网络节点状态

当网络节点激活后，即会参与下一轮计算证明（PoC）。其权重将依据所连接推理节点产生的工作量而更新。若未连接推理节点，则不会参与 PoC，且不会出现在列表中。PoC 结束后（请留出 1–3 小时），该网络节点将出现在活跃主机列表：
```bash
http://node2.gonka.ai:8000/v1/epochs/current/participants
```

当你新增更多推理节点（参见下文步骤）后，其权重会在下一轮 PoC 后反映到活跃主机列表中。

## 在独立服务器上运行推理节点
在其他服务器上仅运行推理节点，参考以下步骤。

### 步骤 1：配置推理节点

**1.1 下载部署文件**

克隆基础部署仓库：
```
git clone https://github.com/gonka-ai/gonka.git -b main
```

**1.2（可选）预下载模型权重到 Hugging Face 缓存（HF_HOME）**

推理节点会从 Hugging Face 下载模型权重。为确保推理可即刻进行，建议预下载。可选其一：

```
export HF_HOME=/path/to/your/hf-cache
```

创建可写目录（如 `~/hf-cache`），并按需预加载模型。
当前网络支持两个模型：`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` and `Qwen/Qwen3-32B-FP8`。

```
huggingface-cli download Qwen/Qwen3-32B-FP8
```

**1.3 为与网络节点通信开放端口**
```
5050 - 推理请求（映射到 ML 节点的 5000）
8080 - 管理 API 端口（映射到 ML 节点的 8080）
```

!!! note "重要"
    这些端口不应暴露到公网，仅在网络节点所在的内网环境中可访问。

### 步骤 2：启动推理节点

在推理节点服务器上，进入 `gonka/deploy/join` 目录并执行：
```
docker compose -f docker-compose.mlnode.yml up -d && docker compose -f docker-compose.mlnode.yml logs -f
```

这将部署推理节点，并在其注册到你的网络节点（见下文）后开始处理推理与 PoC 任务。

## 向网络节点添加（注册）推理节点

!!! note
    通常服务器在数分钟内就绪。但若 5 分钟后仍无法接受请求，请[联系我们](mailto:hello@productscience.ai)。

你必须将每个推理节点注册到网络节点后，推理节点才会开始工作。推荐方式是通过网络节点服务器终端调用 Admin API 进行动态管理：
```
curl -X POST http://localhost:9200/admin/v1/nodes \
     -H "Content-Type: application/json" \
     -d '{
       "id": "<unique_id>",
       "host": "<your_inference_node_static_ip>",
       "inference_port": <inference_port>,
       "poc_port": <poc_port>,
       "max_concurrent": <max_concurrent>,
       "models": {
         "<model_name>": {
           "args": [
              <model_args>
           ]
         }
       }
     }'
```

**参数说明**

| 参数 | 描述 | 示例 |
|------|------|------|
| `id` | 推理节点的**唯一标识** | `node1` |
| `host` | 推理节点的**静态 IP**，或与网络节点同一 Docker 网络时的**容器名** | `http://<mlnode_ip>` |
| `inference_port` | 推理节点**接收推理/训练任务**的端口 | `5050`（映射到 ML 节点 `nginx` 的 `5000`） |
| `poc_port` | 用于 **ML 节点管理** 的端口 | `8080`（映射到 ML 节点 `nginx` 的 `8080`） |
| `max_concurrent` | 该节点可处理的**最大并发请求数** | `500` |
| `models` | 支持的模型集合 | 见下 |
| `model_name` | 模型名称 | `Qwen/Qwen3-32B-FP8` |
| `model_args` | vLLM 推理参数 | `"--quantization","fp8","--kv-cache-dtype","fp8"` |

当前网络支持两个模型：`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` and `Qwen/Qwen3-32B-FP8`，均使用 FP8 量化.

为获得正确配置与最优性能，请根据模型与 GPU 拓扑选择参数：

| 模型与硬件布局 | vLLM 参数 |
|----------------|-----------|
| `Qwen/Qwen2` | `"--quantization","fp8"` |

!!! note "vLLM 性能调优参考"
    针对不同 GPU 硬件的最优部署与 vLLM 参数选择，请参考「[为 LLM 选择最优部署配置的基准指南](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/)」。

若节点添加成功，返回值将包含新推理节点的**配置信息**。

### 查询全部推理节点
获取网络节点下**所有已注册推理节点**列表：
```bash
curl -X GET http://localhost:9200/admin/v1/nodes
```
将返回所有已配置推理节点的 JSON 数组。

### 移除推理节点
连接到**网络节点**服务器，调用以下 Admin API 可在不停机的情况下移除推理节点：
```bash
curl -X DELETE "http://localhost:9200/admin/v1/nodes/{id}" -H "Content-Type: application/json"
```
其中 `id` 为注册时提供的推理节点标识。成功时返回 **true**。
