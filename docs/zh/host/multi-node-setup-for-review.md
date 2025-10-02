# 多节点设置
本指南扩展了[快速开始](https://gonka.ai/host/quickstart/)并展示如何在独立的 GPU 服务器上部署网络节点（无 GPU）和一个或多个推理节点。

支持的场景：

1. 你刚开始并希望从一开始就部署多机设置（从指南开头开始）。
2. 你已经启动了[快速开始](https://gonka.ai/host/quickstart/)，现在想添加更多推理节点（转到["在独立机器上部署和注册推理节点"](https://gonka.ai/host/multi-node-setup-for-review/#deploy-and-register-inference-node-s-on-a-separate-machine)）。

## 先决条件
本指南假设每台机器上已安装以下内容：

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)
- Linux 操作系统

有关以下内容的完整详细信息，请参阅先决条件和支持的 LLM 页面：

- 按模型推荐的 GPU 配置
- 支持的 GPU 类型（A100、H100、3090 等）
- 所需的 CPU 和 RAM

在部署节点之前，这是必读内容。

!!! note "建议"
    所有推理节点都应该注册到同一个网络节点，无论它们的地理位置如何。无论集群部署在不同地区还是跨多个数据中心，每个推理节点都应该始终连接回同一个网络节点。

## 部署网络节点（无 GPU）

这台机器成为你进入网络的主要入口点：

- 它应该是公开可访问的、安全的和稳定的。
- 不需要 GPU
- 必须开放以下端口
    - 5000 - Tendermint P2P 通信
    - 26657 - Tendermint RPC（查询区块链，广播交易）
    - 8000 - 应用服务（可配置）

1.克隆和配置

```
git clone https://github.com/product-science/inference-ignite.git -b main
cd inference-ignite/deploy/join
cp config.env.template config.env
```

!!! note "需要身份验证"
    如果提示输入密码，请使用具有 repo 访问权限的 GitHub 个人访问令牌（经典）。

克隆仓库后，你将找到以下关键配置文件：

| 文件                          | 描述                                                                      |
|-------------------------------|----------------------------------------------------------------------------------|
| `config.env`                  | 包含网络节点的环境变量                              |
| `docker-compose.yml`          | 启动网络节点的 Docker Compose 文件                                   |
| `node-config.json`            | 网络节点使用的配置文件，它描述由此网络节点管理的推理节点 |
| `node-config-qwq.json`       | 专门用于 A100/H100 上的 `Qwen/QwQ-32B` 的配置文件                     |
| `node-config-qwq-4x3090.json` | 使用 4x3090 设置的 `QwQ-32B` 优化配置                                   |
| `node-config-qwq-8x3090.json` | 使用 8x3090 设置的 `QwQ-32B` 优化配置                                   |

2.仅修改 `config.env` 文件中列出的变量。保持所有其他参数不变，因为它们的默认值已经正确设置。

| 变量        | 操作说明                                          | 示例                                                  |
|------------------------|-----------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| `KEY_NAME`       | 手动为你的节点定义唯一标识符。                      | 任何字母数字下划线组合                               |
| `API_PORT`       | 设置你的节点在机器上可用的端口                | 默认为 `8000`                                            |
| `PUBLIC_URL`      | 指定你的节点在外部可用的公共 URL             | `http://<your-static-ip>:<port>` <br> 映射到 0.0.0.0:8000                          |
| `P2P_EXTERNAL_ADDRESS` | 指定你的节点在外部可用于 P2P 连接的公共 URL   | `http://<your-static-ip>:<port1>` <br> 映射到 0.0.0.0:5000                          |
| `HF_HOME`       | 设置 Hugging Face 模型缓存路径。 | 设置为可写的本地目录（例如，`~/hf-cache`）。<br> 如果你属于 6Block 网络，使用 `/mnt/shared`。 |

3.仅启动网络节点服务
```
docker compose -f docker-compose.yml up -d tmkms node api
```

4.检查日志
```
docker compose -f docker-compose.yml logs -f
```

!!! note
    为网络节点设置的地址 `DAPI_API__POC_CALLBACK_URL` 应该可以从所有推理节点访问（默认为 api 容器的 `9100` 端口）。

5.（可选）检查网络节点状态。网络节点一旦激活，将开始参与即将到来的计算证明（请允许 1-3 小时让更改生效）。其权重将根据连接的推理节点产生的工作进行更新。如果没有推理节点连接，节点将不参与计算证明，也不会出现在列表中：
```
http://node2.gonka.ai:8000/v1/epochs/current/participants
```
如果你添加更多带有推理节点的服务器（按照下面的说明），更新的权重将在下一次计算证明后反映在活跃参与者列表中。

## 在独立机器上部署和注册推理节点
每个推理节点都是基于 GPU 的服务，连接回网络节点。
### 部署
1. 克隆仓库（在每个新的推理节点机器上）。
```
git clone https://github.com/product-science/inference-ignite.git -b main
cd inference-ignite/deploy/join
```
2. （可选但推荐）。预下载模型权重。选择以下选项之一。
!!! note "支持的模型"
    目前，网络支持两个模型：`Qwen/Qwen2.5-7B-Instruct` 和 `Qwen/QwQ-32B`。
   
=== "选项 1：本地下载"

    ```
    export HF_HOME=/path/to/your/hf-cache
    mkdir -p $HF_HOME
    huggingface-cli download Qwen/Qwen2.5-7B-Instruct
    ```

=== "选项 2：6Block NFS 挂载缓存（适用于 6Block 内部网络参与者）"
    挂载共享缓存：
    ```
    sudo mount -t nfs 172.18.114.147:/mnt/toshare /mnt/shared
    export HF_HOME=/mnt/shared
    ```
    路径 `/mnt/shared` 仅在 6Block 测试网中有效，需要访问共享 NFS。


3.此说明中使用的一些 Docker 镜像是私有的。确保使用 GitHub 容器注册表进行身份验证：
```
docker login ghcr.io -u <YOUR_GITHUB_USERNAME>
```

4.启动推理节点：
```
docker compose up -d && docker compose logs -f
```

!!! note
    仅向你的网络节点开放这些端口：
    
    - 5000 - 推理请求
    - 8000 - 管理 API 端口
    这些**不得**公开暴露。

这将部署推理节点，并在注册到你的网络节点后立即开始处理推理和计算证明任务（下面的说明）。

### 注册

!!! note
    通常，服务器需要几分钟才能启动。但是，如果你的服务器在 5 分钟后不接受请求，请[联系我们](mailto:hello@productscience.ai)寻求帮助。

1.将每个推理节点注册到网络节点以使其运行。推荐的方法是通过管理 API 进行动态管理，这可以从你的网络节点服务器的终端访问。
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

??? note "参数描述"
      | 参数    | 描述                                                        | 示例                              |
      |------------------|----------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------|
      | `id`       | 你的推理节点的唯一标识符。                                        | node1                               |
      | `host`      | 你的推理节点的静态 IP 或如果在同一 Docker 网络中运行则为 Docker 容器名称。          | http://<mlnode_ip>                         |
      | `inference_port` | 推理节点接受推理和训练任务的端口。                          | 5000                                |
      | `poc_port`    | 用于 MLNode 管理的端口。                                       | 8000                                |
      | `max_concurrent` | 此节点可以处理的最大并发推理请求数。                         | 500                                |
      | `models`     | 推理节点可以处理的受支持模型。                                  | （见下文）                            |
      | `model_name`   | - 模型的名称。                                                  | Qwen/QwQ-32B                            |
      | `model_args`   | - 模型推理的 vLLM 参数。<br> 通常作为 CLI 标志传递。                    | --quantization, fp8, --kv-cache-dtype, fp8        |
      
目前，网络支持两个模型：`Qwen/Qwen2.5-7B-Instruct` 和 `Qwen/QwQ-32B`，都量化为 FP8，`QwQ 模型` 使用 `FP8 KV 缓存`。
为确保正确设置和最佳性能，使用最匹配你的模型和 GPU 布局的参数。

| 模型和 GPU 布局           | vLLM 参数                                             |
|-------------------------------------------|---------------------------------------------------------------------------------------------------------|
| `Qwen/Qwen2`                | `"--quantization", "fp8"`                                       |
| `Qwen/QwQ-32B` 在 8xA100 或 8xH100      | `"--quantization"`, `"fp8"`, `"--kv-cache-dtype"`, `"fp8"`                          |
| `Qwen/QwQ-32B` 在 8x3090 或 8x4090      | `"--quantization"`, `"fp8", "--kv-cache-dtype"`, `"fp8"`, `"--tensor-parallel-size"`, `"4"`          |
| `Qwen/QwQ-32B` 在 8x3080           | `"--quantization"`, `"fp8"`, `"--kv-cache-dtype"`, `"fp8"`, `"--tensor-parallel-size"`, `"4"`, `"--pipeline-parallel-size"`, `"2"` |


!!! note "vLLM 性能调优参考"
      有关选择适合你 GPU 硬件的最佳部署配置和 vLLM 参数的详细指导，请参阅为 LLM 选择最佳部署配置的基准测试[指南](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/)。

2.几分钟后，检查你的节点是否出现在当前 epoch 中。计算证明每几小时更新一次。你的节点可能需要时间才能显示。

```
http://node2.gonka.ai:8000/v1/epochs/current/participants
```

### 扩展和管理推理节点
=== "扩展推理节点"
    为每台新的 GPU 机器重复此过程。
    所有推理节点都可以注册到同一个网络节点。

=== "检索所有推理节点"
    要获取网络节点中所有注册推理节点的列表，请使用：
    ```
    curl -X GET http://localhost:9200/admin/v1/nodes
    ```
    这将返回包含所有配置的推理节点的 JSON 数组。

=== "移除推理节点"
    连接到你的网络节点服务器，使用以下管理 API 请求动态移除推理节点而无需重启：
    ```
    curl -X DELETE "http://localhost:9200/admin/v1/nodes/{id}" -H "Content-Type: application/json"
    ```
    其中 id 是在注册推理节点时在请求中指定的推理节点标识符。如果成功，响应将为 true。

=== "停止和清理你的节点"
    确保你在 `inference-ignite/deploy/join` 文件夹中。

    停止所有正在运行的容器：
    ```bash
    docker compose -f docker-compose.yml down
    ```
    这将停止并删除 `docker-compose.yml` 文件中定义的所有服务，除非明确配置，否则不会删除卷或数据。

    要清理缓存并重新开始，删除本地 `.inference` 和 `.dapi` 文件夹（推理运行时缓存和身份）：
    ```bash
    rm -rf .inference .dapi .tmkms
    ```

    （可选）清除模型权重缓存：
    ```bash
    rm -rf $HF_HOME
    ```

    !!! note
        删除 `$HF_HOME` 将需要从 Hugging Face 重新下载大型模型文件或重新挂载 NFS 缓存。


**需要帮助？** 加入我们的[Discord 服务器](https://discord.gg/fvhNxdFMvB)获取一般咨询、技术问题或安全担忧的帮助。
