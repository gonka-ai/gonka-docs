# ML 节点管理

本指南介绍如何使用 **管理 API（Admin API）** 管理连接到您网络节点（Network Node）的推理节点（ML Node）。

您将学习如何：

- 添加新的 ML 节点
- 批量一次性添加多个 ML 节点
- 更新现有 ML 节点
- 启用或禁用 ML 节点
- 删除 ML 节点
- 列出所有已配置的 ML 节点

所有操作均针对网络节点的管理 API 执行，**无需** 链上交易。更改会立即在网络节点层面生效。

---

## 前提条件

在管理 ML 节点之前，请确保：

- 您已完成 [快速入门指南](https://gonka.ai/host/quickstart/) 的第 3.3 步（密钥管理和主机注册）。
- 您的 **网络节点** 正在运行，并且您执行 `curl` 命令的服务器可以访问该节点。
- 您可以访问网络节点服务器上端口 `9200` 的 **管理 API**。

在本指南中，我们假设您是 **从网络节点服务器本身** 执行命令：

```bash
export ADMIN_API_URL=http://localhost:9200
```

如果从另一台机器调用管理 API，请将 `localhost` 替换为你的网络节点的私有 IP 地址或主机名（确保端口 `9200` 可访问并已正确配置防火墙）。

---

## 机器学习节点定义

每个向网络节点注册的机器学习节点（ML Node）由一个包含以下关键字段的 JSON 对象表示：

- `id` – 机器学习节点的**唯一标识符**（字符串）。
- `host` – 机器学习节点的**静态 IP 或 DNS 地址**，如果与网络节点运行在同一 Docker 网络中，则可以是**Docker 容器名称**。
- `inference_port` – 用于推理请求的端口（映射到机器学习节点 `nginx` 容器的端口 `5000`）。
- `poc_port` – 用于计算证明（PoC）和管理操作的端口（映射到机器学习节点 `nginx` 容器的端口 `8080`）。
- `max_concurrent` – 该机器学习节点可处理的最大并发推理请求数。
- `models` – 模型名称到 vLLM 参数的映射。

示例机器学习节点配置：

```json
{
  "id": "node1",
  "host": "10.0.0.21",
  "inference_port": 5050,
  "poc_port": 8080,
  "max_concurrent": 500,
  "models": {
    "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8": {
      "args": [
        "--tensor-parallel-size",
        "4"
      ]
    }
  }
}
```

!!! note "支持的模型和 vLLM 参数"
    当前网络仅支持 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`（以治理决策为准）。请参阅[《为大语言模型选择最优部署配置的基准测试指南》](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/)。

---

## 列出机器学习节点

使用此端点可查看当前已注册到您的网络节点的所有机器学习节点。

**端点**

- `GET /admin/v1/nodes`

**示例**

```bash
curl -X GET "$ADMIN_API_URL/admin/v1/nodes" | jq
```

**预期结果**

- 返回一个 JSON 数组，包含所有已配置的机器学习节点及其当前配置。

---

## 添加新的机器学习节点

使用此操作将**单个**新的机器学习节点注册到您的网络节点。

**端点**

- `POST /admin/v1/nodes`

!!! note "在 8xH100 或 8xH200 上添加 235B 节点"
    在 `8xH100` 或 `8xH200` 上添加 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 的请求示例：

 

 
 

 

```bash
    curl -X POST "$ADMIN_API_URL/admin/v1/nodes" \
      -H "Content-Type: application/json" \
      -d '{
        "id": "node-235b",
        "host": "10.0.0.22",
        "inference_port": 5050,
        "poc_port": 8080,
        "max_concurrent": 500,
        "models": {
          "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8": {
            "args": [
              "--tensor-parallel-size",
              "4",
              "--max-model-len",
              "240000"
            ]
          }
        }
      }'
 
 
 
 
```

**预期结果**

成功时，返回 `200 OK`，其中包含以 JSON 格式表示的 newly registered ML Node 配置。  
如果一个或多个模型无效（未通过治理审批），API 将返回 400 错误请求，并附带错误消息。

---

## 批量添加多个 ML 节点

使用此端点可**同时注册多个 ML 节点**。请求体为 ML 节点定义的数组。

**端点**

- `POST /admin/v1/nodes/batch`

**示例**

```bash
curl -X POST "$ADMIN_API_URL/admin/v1/nodes/batch" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "id": "node1",
      "host": "10.0.0.21",
      "inference_port": 5050,
      "poc_port": 8080,
      "max_concurrent": 500,
      "models": {
        "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8": {
          "args": [
            "--tensor-parallel-size",
            "4",
            "--max-model-len",
            "240000"
          ]
        }
      }
    },
    {
      "id": "node2",
      "host": "10.0.0.22",
      "inference_port": 5050,
      "poc_port": 8080,
      "max_concurrent": 500,
      "models": {
        "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8": {
          "args": [
            "--tensor-parallel-size",
            "4",
            "--max-model-len",
            "240000"
          ]
        }
      }
    }
  ]'
```

**预期结果**

- 如果**所有**节点均验证并注册成功：
 
 
  - 返回 `201 Created`，其中包含已注册节点的数组。
- 如果**部分**节点验证失败：
 
 
  - 返回 `206 Partial Content`，其中包含 `nodes`（成功注册的节点）和一个描述失败信息的 `errors` 数组。
- 如果**所有**节点均验证失败：
 
 
  - 返回 `400 Bad Request`，失败详情包含在 `errors` 数组中。

---

## 更新现有 ML 节点

更新 ML 节点采用**插入或更新（upsert）**机制：

- 如果 `id` 已存在，则**更新**该节点。
- 如果 `id` 不存在，则**创建**一个新节点。

您可以使用以下任一方式：

- 在路径中使用已存在的 `POST /admin/v1/nodes`，或
- 在请求体中提供 `PUT /admin/v1/nodes/:id`，且其 `id` 与路径中的 ID 一致。

!!! note "保持路径和请求体中的 ID 一致"
    为确保清晰并避免混淆，当使用 `PUT` 时，请始终将请求体中的 `id` 设置为与 URL 路径中的 `:id` 相同。

    **示例：增加 `max_concurrent` 并更新模型**

```bash
curl -X PUT "$ADMIN_API_URL/admin/v1/nodes/node1" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "node1",
    "host": "http://10.0.0.21",
    "inference_port": 5050,
    "poc_port": 8080,
    "max_concurrent": 800,
    "models": {
      "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8": {
        "args": [
          "--tensor-parallel-size",
          "4",
          "--max-model-len",
          "240000"
        ]
      }
    }
  }'
```

**预期结果**

- 成功时，返回 `200 OK`，其中包含已更新的节点配置。
- 如果无法更新节点（例如，模型不符合治理规则），则返回 `400 Bad Request`，并附带错误消息。

---

## 启用 ML 节点

使用此端点可**启用**先前已禁用的 ML 节点。此操作不会更改节点的配置，仅更改其管理状态。

**端点**

- `POST /admin/v1/nodes/:id/enable`

**示例**

```bash
curl -X POST "$ADMIN_API_URL/admin/v1/nodes/node1/enable"
```

**预期结果**

- 成功时返回：

 

 

```json
  {
    "message": "node enabled successfully",
    "node_id": "node1"
  }
 
 
```

- 如果节点不存在，则返回 `404 Not Found` 并附带错误信息。

---

## 禁用一个机器学习节点

使用此端点可**禁用**一个机器学习节点而不删除它。该节点仍将保持注册状态，但会被标记为管理性禁用。它会持续运行至当前纪元结束，但不会参与接下来的 PoC（Proof of Coverage），因此不会被包含在下一个纪元中。

**端点**

- `POST /admin/v1/nodes/:id/disable`

**示例**

```bash
curl -X POST "$ADMIN_API_URL/admin/v1/nodes/node1/disable"
```

**预期结果**

- 成功时返回：

 

 

```json
  {
    "message": "node disabled successfully",
    "node_id": "node1"
  }
 
 
```

- 如果节点不存在，则返回 `404 Not Found` 并附带错误消息。

!!! note "禁用与删除"
    禁用 ML 节点是**可逆的**。之后可以使用 `/enable` 端点重新启用。  
    删除节点会将该节点的配置从网络节点中彻底移除（见下文）。

---

## 删除 ML 节点

使用此端点可将 ML 节点配置从网络节点中彻底移除。

**端点**

- `DELETE /admin/v1/nodes/:id`

**示例**

```bash
curl -X DELETE "$ADMIN_API_URL/admin/v1/nodes/node1"
```

**预期结果**

- 成功时，返回 `200 OK`，其中包含已删除节点的 JSON 表示。

!!! warning "不可逆操作"
    删除 ML 节点的操作无法撤销。若要重新添加该节点，必须使用 **添加新 ML 节点** 或 **批量添加** 接口重新注册。

---

## 验证变更

在执行任何添加、更新、启用、禁用或删除操作后，您可以验证所有 ML 节点的当前状态：

```bash
curl -X GET "$ADMIN_API_URL/admin/v1/nodes" | jq
```

在协议层面（计算证明之后）进行端到端验证时，您还可以查看当前活跃参与者的列表：

```bash
curl http://node2.gonka.ai:8000/v1/epochs/current/participants | jq
```

这使您能够确认您的网络节点及其机器学习节点正在正确地为网络做出贡献，并且其有效权重反映了最近的变更。


