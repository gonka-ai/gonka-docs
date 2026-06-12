# 多节点部署

在此配置中，您将网络节点和一个或多个推理（ML）节点部署在多台服务器上。要加入网络，您需要部署两项服务：

- **网络节点** – 由两个组件构成的服务：**链节点（chain node）** 和 **API 节点（API node）**。该服务负责所有通信任务。**链节点** 连接到区块链，而 **API 节点** 处理用户请求。
- **推理（ML）节点** – 一项在 GPU 上执行大语言模型（LLM）推理的服务。您至少需要一个 **ML 节点** 才能加入网络。

本指南提供将这两项服务部署在同一台机器或不同机器上的操作说明。所有服务均以 Docker 容器形式部署。

---

## 前置条件

网络节点的硬件配置建议如下：

- 16 核 CPU（amd64 架构）
- 64
+ GB 内存
- 1TB NVMe 固态硬盘
- 最低 100Mbps 网络连接（推荐 1Gbps）

最终硬件需求将取决于所连接的 ML 节点数量及其总吞吐量。

在继续之前，请先完成 [快速入门指南](https://gonka.ai/host/quickstart/) 的第 3.3 步，包括以下内容：

- 硬件和软件要求
- 下载部署文件
- 容器访问认证
- 密钥管理设置（账户密钥和 ML 运维密钥）
- 主机注册与权限配置

---

## 启动网络节点与推理节点
本节介绍如何部署包含一个网络节点和多个推理节点的分布式架构。

!!! note
    在启动网络节点之前，请确保您在网络服务器上的 `DAPI_API__POC_CALLBACK_URL` 文件中正确设置了 `config.env` 变量。此值定义了 API 容器的回调 URL，并会被传递给所有 ML 节点，以便它们知道将计算证明（Proof-of-Compute, PoC）随机数发送到何处。

    在多节点架构中，该 URL 必须能够从集群中的所有 ML 节点访问。请勿保留默认的内部 Docker 地址（如 http://api:9100），因为外部 ML 节点无法访问该地址。应将其替换为网络节点服务器的私网 IP 地址（或 DNS 名称），例如：`DAPI_API__POC_CALLBACK_URL=http://<NETWORK_NODE_PRIVATE_IP>:9100`。如果网络节点的 API 容器已使用错误值启动，请修改 `config.env` 并重启 API 容器。

    请确保端口 `9100` 对网络中所有推理（ML）节点开放且可访问。

## 启动网络节点

请确保您已完成 [快速入门指南](https://gonka.ai/host/quickstart/) 中第 3.3 步（密钥管理与主机注册）的相关操作。

该服务器将成为外部参与者的主要接入点，必须暴露在公网上（建议使用静态 IP 或域名）。高网络可靠性与安全性至关重要，建议将其部署在带宽充足、稳定性高且具备完善安全防护的服务器上。

### 单机部署：网络节点
 
+ 推理节点
如果您的网络节点服务器 **配备 GPU**，并且希望在同一台机器上同时运行 **网络节点** 和 **推理节点**，请在 `gonka/deploy/join` 目录下执行以下命令：

```                              
 
 
 
source config.env && \
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml up -d && \
docker compose -f docker-compose.yml -f docker-compose.mlnode.yml logs -f
```

这将在同一台机器上启动**一个网络节点**和**一个推理节点**。

### 独立部署：仅网络节点

如果您的网络节点服务器**没有 GPU**，并且希望服务器仅运行**网络节点**（不运行推理节点），请在 `gonka/deploy/join` 目录下执行以下命令：

```

source config.env && \ 
docker compose -f docker-compose.yml up -d && \
docker compose -f docker-compose.yml logs -f                                 
```

### 网络节点状态

当网络节点变为活跃状态后，将开始参与即将进行的计算证明（PoC）。其权重将根据所连接的推理节点产生的工作量进行更新。如果没有连接任何推理节点，该节点将不会参与 PoC，也不会出现在列表中。在下一次 PoC 完成后，该网络节点将出现在活跃主机列表中（请预留 1–3 小时以使变更生效）：

```bash
http://node2.gonka.ai:8000/v1/epochs/current/participants
```

如果添加更多带有推理节点的服务器（按照以下说明操作），更新后的权重将在下一次 PoC 之后反映在活动主机列表中。

## 在独立服务器上运行推理节点
在其他服务器上，我们仅运行推理节点，具体操作步骤如下。

### 步骤
 
1. 配置推理节点

**
1.
1. 下载部署文件**

克隆包含基础部署脚本的代码仓库：
```

git clone https://github.com/gonka-ai/gonka.git -b main
```

**
1.
2. （可选）预下载模型权重至 Hugging Face 缓存目录（HF_HOME）**

推理节点会从 Hugging Face 下载模型权重。为确保模型权重已准备就绪，建议在部署前预先下载。请选择以下任一选项进行操作。

```

export HF_HOME=/path/to/your/hf-cache
```

创建一个可写的目录（例如 `~/hf-cache`），并根据需要预加载模型。  
目前网络仅支持 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。

```

huggingface-cli download Qwen/Qwen3-235B-A22B-Instruct-2507-FP8
```

**
1.
3. 网络节点连接的开放端口**
```

5050
 - Inference requests (mapped to 5000 of MLNode)
8080
 - Management API Port (mapped to 8080 of MLNode)
```

!!! note "重要"
    这些端口不得暴露在公共互联网上（应仅可在网络节点环境中访问）。

### 步骤
 
2. 启动推理节点

在推理节点的服务器上，进入 `cd gonka/deploy/join` 目录并执行
```

docker compose -f docker-compose.mlnode.yml up -d && docker compose -f docker-compose.mlnode.yml logs -f
```

这将部署推理节点，并在您的网络节点注册后立即开始处理推理和计算证明（PoC）任务（注册方法见下文）。

## 向网络节点添加（注册）推理节点

您必须将每个推理节点注册到网络节点，才能使其正常运行。  
推荐使用管理 API 进行动态管理，可通过网络节点服务器的终端访问该 API。
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

| 参数 | 说明 | 示例 |
| --- | --- | --- |
| `id` | 您推理节点的**唯一标识符**。 |  |
| `host` |  |  |
| `inference_port` |  |  |
| （映射到 MLNode 的 `5000` 端口） |  |  |
| `poc_port` |  |  |
| （映射到 MLNode 的 `8080` 端口） |  |  |
| `max_concurrent` |  |  |
| `models` |  |  |
目前网络仅支持 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。

为确保正确配置并获得最佳性能，请根据您的模型和 GPU 架构选择最合适的参数。

| 模型与 GPU 架构 | vLLM 参数 |
| --- | --- |
| 在 8xH100 或 8xH200 上运行 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` | `"--tensor-parallel-size","4"` |
如需针对您的 GPU 硬件选择最优部署配置和 vLLM 参数的详细指导，请参阅 [《大语言模型最优部署配置基准指南》](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/)。

如果节点添加成功，返回结果将包含新添加推理节点的**配置信息**。

### 获取所有推理节点
要获取网络节点中所有已注册推理节点的列表，请使用：

```bash
curl -X GET http://localhost:9200/admin/v1/nodes
```

这将返回一个包含所有已配置推理节点的 JSON 数组。

### 移除推理节点
在连接到您的**网络节点**服务器后，使用以下 Admin API 请求动态移除推理节点，无需重启：

```bash
curl -X DELETE "http://localhost:9200/admin/v1/nodes/{id}" -H "Content-Type: application/json"
```

其中 `id` 是注册推理节点时在请求中指定的推理节点标识符。如果成功，响应将为 **true**。
