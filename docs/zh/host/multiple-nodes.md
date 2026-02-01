# 多节点

在此方案中，您将在多台服务器上部署网络节点以及一个或多个推理（ML）节点。要加入网络，需要部署两类服务：

- **网络节点** – 由**链节点**和 **API 节点**组成的服务，负责所有通信。**链节点**连接区块链，**API 节点**处理用户请求。
- **推理（ML）节点** – 在 GPU 上执行大语言模型（LLM）推理的服务。至少需要一个 **ML 节点** 才能加入网络。

本指南说明如何在同一台机器上部署这两类服务，以及如何在不同机器上部署。服务均以 Docker 容器形式部署。

---

## 先决条件

网络节点的大致硬件要求：

- 16 核 CPU（amd64）
- 64 GB 及以上内存
- 1TB NVMe SSD
- 至少 100Mbps 网络连接（推荐 1Gbps）

最终需求取决于所连接的 ML 节点数量及其总吞吐量。

在继续之前，请先完成[快速入门指南](https://gonka.ai/host/quickstart/)至步骤 3.4，包括：

- 硬件与软件要求
- 下载部署文件
- 容器访问与鉴权
- 密钥管理配置（账户密钥与 ML 运营密钥）
- 主机注册与权限

---

## 启动网络节点与推理节点

本节说明如何部署一个网络节点与多个推理节点的分布式方案。

!!! note
    在启动网络节点之前，请确保网络服务器上 `config.env` 中的 `DAPI_API__POC_CALLBACK_URL` 已正确设置。该变量定义 API 容器的回调 URL，会传给所有 ML 节点，供其发送计算证明（PoC）nonce。
    多节点部署时，该 URL 必须能被集群内所有 ML 节点访问。请勿保留默认的 Docker 内部地址（http://api:9100），因为外部 ML 节点无法访问。请改为网络节点服务器的内网地址（或 DNS 名称），例如：`DAPI_API__POC_CALLBACK_URL=http://<NETWORK_NODE_PRIVATE_IP>:9100`。若网络节点的 API 容器已用错误值启动，请更新 `config.env` 并重启 api 容器。
    确保端口 `9100` 已开放，且可从您网络中所有推理（ML）节点访问。

## 启动网络节点

请确保已先完成[快速入门指南](https://gonka.ai/host/quickstart/)至步骤 3.3（密钥管理与主机注册）。

该服务器将作为对外参与者的入口，需暴露在公网（建议使用静态 IP 或域名）。网络稳定性和安全性很重要，请使用稳定、高带宽且安全加固的服务器。

### 单机部署：网络节点 + 推理节点

若网络节点服务器**有 GPU**，且希望在同一台机器上同时运行**网络节点**和**推理节点**，请在 `gonka/deploy/join` 目录下执行：

```
source config.env && \
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d && \
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml logs -f
```

将在同一台机器上启动**一个网络节点**和**一个推理节点**。

### 分机部署：仅网络节点

若网络节点服务器**没有 GPU**，且只运行**网络节点**（不运行推理节点），请在 `gonka/deploy/join` 目录下执行：

```
source config.env && \ 
docker compose -f docker-compose.yml up -d && \
docker compose -f docker-compose.yml logs -f                                 
```

### 网络节点状态

网络节点激活后将参与下一轮计算证明（PoC），其权重将根据所连接推理节点产生的工作量更新。若未连接推理节点，则不会参与 PoC 也不会出现在列表中。下一轮 PoC 后，网络节点将出现在活跃主机列表中（变更生效约需 1–3 小时）：
```bash
http://node2.gonka.ai:8000/v1/epochs/current/participants
```

若按下文步骤增加更多推理节点服务器，更新后的权重将在下一轮 PoC 后反映在活跃主机列表中。

## 在独立服务器上运行推理节点

在其他服务器上仅运行推理节点，请按以下步骤操作。

### 步骤 1. 配置推理节点

**1.1. 下载部署文件**

克隆包含基础部署脚本的仓库：
```
git clone https://github.com/gonka-ai/gonka.git -b main
```

**1.2.（可选）将模型权重预下载到 Hugging Face 缓存（HF_HOME）**

推理节点从 Hugging Face 下载模型权重。为确保推理前权重已就绪，建议在部署前下载。可任选一种方式。

```
export HF_HOME=/path/to/your/hf-cache
```

创建可写目录（如 `~/hf-cache`），并按需预加载模型。
当前网络仅支持 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。

```
huggingface-cli download Qwen/Qwen3-235B-A22B-Instruct-2507-FP8
```

**1.3. 供网络节点连接的开放端口**
```
5050 - 推理请求（映射到 ML 节点的 5000）
8080 - 管理 API 端口（映射到 ML 节点的 8080）
```

!!! note "重要"
    这些端口不得暴露在公网（仅应在网络节点所在环境中可访问）。

### 步骤 2. 启动推理节点

在推理节点所在服务器上，进入 `cd gonka/deploy/join` 目录并执行：
```
docker compose -f docker-compose.mlnode.yml up -d && docker compose -f docker-compose.mlnode.yml logs -f
```

这将部署推理节点，并在其注册到您的网络节点（见下文）后开始处理推理与计算证明（PoC）任务。

## 向网络节点添加（注册）推理节点

!!! note 
    通常服务器在数分钟内即可就绪。若 5 分钟后仍无法接受请求，请[联系我们](mailto:hello@productscience.ai)获取帮助。

必须将每个推理节点注册到网络节点后才会生效。
推荐通过网络节点服务器终端使用 Admin API 进行动态管理：
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

| 参数         | 说明                                                                                      | 示例                                            |
|-------------------|--------------------------------------------------------------------------------------------------|-----------------------------------------------------------|
| `id`             | 推理节点的**唯一标识符**                                                | `node1`                                                   |
| `host`           | 推理节点的**静态 IP**，或与网络节点在同一 Docker 网络时的**容器名** | `http://<mlnode_ip>`                                               |
| `inference_port` | 推理节点**接收推理与训练任务**的端口    | `5050`（映射到 ML 节点 `nginx` 的 `5000`）                                                   |
| `poc_port`       | 用于 **ML 节点管理** 的端口   | `8080`（映射到 ML 节点 `nginx` 的 `8080`）                                                   |
| `max_concurrent` | 该节点可处理的**最大并发推理请求数**   | `500`                                                     |
| `models`         | 推理节点可处理的**支持的模型**集合                              | （见下）    |
| `model_name`         | 模型名称                              | `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`    |
| `model_args`         | 该模型的 vLLM 推理参数                              | `"--tensor-parallel-size","4"`    |

当前网络仅支持 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。

为确保配置正确且性能最优，请使用与您的模型和 GPU 布局最匹配的参数。

| 模型与 GPU 布局                    | vLLM 参数                                                                           |
|-----------------------------------------|---------------------------------------------------------------------------------------|
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 在 8xH100 或 8xH200 上           | `"--tensor-parallel-size","4"`                                      |

若节点添加成功，响应将返回新添加推理节点的**配置**。

### 获取所有推理节点

要查看网络节点下**所有已注册推理节点**列表，请使用：
```bash
curl -X GET http://localhost:9200/admin/v1/nodes
```
将返回包含所有已配置推理节点的 JSON 数组。

### 移除推理节点

在**网络节点**服务器上，使用以下 Admin API 请求可动态移除推理节点而无需重启：
```bash
curl -X DELETE "http://localhost:9200/admin/v1/nodes/{id}" -H "Content-Type: application/json"
```
其中 `id` 为注册推理节点时使用的标识符。成功时响应为 **true**。
