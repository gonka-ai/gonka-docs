# 多个节点

在此设置中，您将在多台服务器上部署网络节点和一个或多个推理（ML）节点。要加入网络，您需要部署两个服务：

- **网络节点** – 由两个节点组成的服务：一个**链节点**和一个**API节点**。此服务处理所有通信。**链节点**连接到区块链，而**API节点**管理用户请求。
- **推理（ML）节点** – 一个在GPU上执行大语言模型（LLM）推理的服务。您至少需要一个**ML节点**才能加入网络。

本指南提供了在同一台机器和不同机器上部署这两个服务的说明。服务以Docker容器形式部署。

---

## 先决条件

对于网络节点，大致的硬件要求为：

- 16核CPU（amd64）
- 64 GB以上内存
- 1TB NVMe SSD
- 最低100Mbps网络连接（推荐1Gbps）

最终要求将取决于连接的ML节点数量及其总吞吐量。

在继续之前，请完成[快速入门指南](https://gonka.ai/host/quickstart/)的第3.3步，包括：

- 硬件和软件要求
- 下载部署文件
- 容器访问认证
- 密钥管理设置（账户密钥和ML运行密钥）
- 主机注册与权限

---

## 启动网络和推理节点
本节介绍如何部署包含网络节点和多个推理节点的分布式设置。

!!! note 
    在启动网络节点之前，请确保网络服务器上的 `config.env` 文件中的 `DAPI_API__POC_CALLBACK_URL` 变量已正确设置。此值定义了API容器的回调URL，它将传递给所有ML节点，以便它们知道向何处发送Proof-of-Compute（PoC）nonce。

    对于多节点设置，此URL必须能被集群中的所有ML节点访问。请勿保留默认的内部Docker地址（http://api:9100），因为它无法从外部ML节点访问。请将其替换为网络节点服务器的私有网络地址（或DNS名称），例如：`DAPI_API__POC_CALLBACK_URL=http://<NETWORK_NODE_PRIVATE_IP>:9100`。如果API容器已使用错误的值启动，请更新 `config.env` 并重启api容器。

    请确保端口 `9100` 在您的网络中对所有推理（ML）节点开放且可访问。

## 启动网络节点

请确保您已提前完成[快速入门指南](https://gonka.ai/host/quickstart/)的第3.3步（密钥管理和主机注册）。

此服务器将成为外部参与者的主入口点。必须将其暴露在公共互联网上（建议使用静态IP或域名）。高网络可靠性和安全性至关重要。请将其部署在稳定、高带宽且具备强安全性的服务器上。

### 单机部署：网络节点 + 推理节点
如果您的网络节点服务器**具有GPU**，并且您希望在同一台机器上运行**网络节点**和**推理节点**，请在 `gonka/deploy/join` 目录中执行以下命令：

```                                 
source config.env && \
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d && \
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml logs -f
```

这将在同一台机器上启动**一个网络节点**和**一个推理节点**。

### 独立部署：仅网络节点

如果您的网络节点服务器**没有GPU**，并且您希望服务器仅运行**网络节点**（不运行推理节点），请在 `gonka/deploy/join` 目录中执行以下命令：

```
source config.env && \ 
docker compose -f docker-compose.yml up -d && \
docker compose -f docker-compose.yml logs -f                                 
```

### 网络节点状态

一旦网络节点激活，它将开始参与即将到来的Proof of Computation（PoC）。其权重将根据连接的推理节点所产生的工作量进行更新。如果没有连接任何推理节点，该节点将不参与PoC，也不会出现在列表中。在下一次PoC之后，网络节点将出现在活跃主机列表中（请允许1–3小时生效）：
```bash
http://node2.gonka.ai:8000/v1/epochs/current/participants
```

如果您添加了更多带有推理节点的服务器（遵循以下说明），在下一次PoC后，更新的权重将反映在活跃主机列表中。

## 在独立服务器上运行推理节点
在其他服务器上，我们仅运行推理节点，为此，请遵循以下说明。

### 步骤1. 配置推理节点

**1.1. 下载部署文件**

克隆包含基础部署脚本的仓库：
```
git clone https://github.com/gonka-ai/gonka.git -b main
```

**1.2.（可选）预下载模型权重到 Hugging Face 缓存（HF_HOME）**

推理节点从 Hugging Face 下载模型权重。为确保模型权重在部署前就绪，我们建议在部署前预先下载。请选择以下选项之一。

```
export HF_HOME=/path/to/your/hf-cache
```

创建一个可写目录（例如 `~/hf-cache`），并根据需要预加载模型。
目前，网络支持 `MiniMaxAI/MiniMax-M2.7` 作为活动的 PoC 模型。

```
huggingface-cli download MiniMaxAI/MiniMax-M2.7
```

**1.3. 网络节点连接所需开放的端口**
```
5050 - Inference requests (mapped to 5000 of MLNode)
8080 - Management API Port (mapped to 8080 of MLNode)
```

!!! note "重要"
    这些端口不得暴露在公共互联网上（应仅在节点网络环境中可访问）。

### 步骤 2. 启动推理节点

在推理节点的服务器上，进入 `cd gonka/deploy/join` 目录并执行
```
docker compose -f docker-compose.mlnode.yml up -d && docker compose -f docker-compose.mlnode.yml logs -f
```

这将部署推理节点，并在注册到您的网络节点后立即开始处理推理和计算证明（PoC）任务（如下所述）。
## 将推理节点添加（注册）到网络节点

您必须将每个推理节点注册到网络节点才能使其正常运行。
推荐的方法是通过网络节点服务器终端可访问的管理 API 进行动态管理。
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
|-------------------|--------------------------------------------------------------------------------------------------|-----------------------------------------------------------|
| `id` | 推理节点的**唯一标识符**。 | `node1` |
| `host` | 推理节点的**静态 IP**，或在相同 Docker 网络中运行时的**Docker 容器名称**。 | `http://<mlnode_ip>` |
| `inference_port` | 推理节点**接受推理和训练任务**的端口。 | `5050`（端口映射到 MLNode 的 `5000` 的 `nginx`） |
| `poc_port` | 用于**MLNode 管理**的端口。 | `8080`（端口映射到 MLNode 的 `8080` 的 `nginx`） |
| `max_concurrent` | 此节点可处理的**最大并发推理请求数**。 | `500` |
| `models` | 推理节点可处理的**支持的模型**。 | (见下文) |
| `model_name` | 模型的名称。 | `MiniMaxAI/MiniMax-M2.7` |
| `model_args` | 模型推理的 vLLM 参数。 | `"--tensor-parallel-size","4"` |

目前，网络支持 `MiniMaxAI/MiniMax-M2.7` 作为活动的 PoC 模型。

为确保正确设置和最优性能，请使用与您的模型和 GPU 架构最匹配的参数。

| 模型和 GPU 架构 | vLLM 参数 |
|-----------------------------------------|---------------------------------------------------------------------------------------|
| `MiniMaxAI/MiniMax-M2.7` 在 4xH100 上 | `"--tensor-parallel-size","4"` |

有关如何根据您的 GPU 硬件选择最优部署配置和 vLLM 参数的详细指导，请参阅 [选择 LLM 最优部署配置的基准测试指南](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/)。

如果节点添加成功，响应将返回新添加的推理节点的**配置**。

### 获取所有推理节点
要获取网络节点中**所有已注册推理节点**的列表，请使用：
```bash
curl -X GET http://localhost:9200/admin/v1/nodes
```
这将返回包含所有已配置推理节点的 JSON 数组。

### 移除推理节点
连接到您的**网络节点**服务器后，使用以下管理 API 请求动态移除推理节点，无需重启：
```bash
curl -X DELETE "http://localhost:9200/admin/v1/nodes/{id}" -H "Content-Type: application/json"
```
其中 `id` 是注册推理节点时指定的推理节点标识符。成功后，响应将为 **true**。
