# ML 节点管理

本指南介绍如何使用 **Admin API** 管理连接到您的网络节点的推理节点（ML 节点）。

您将学习如何：

- 添加新的 ML 节点
- 批量添加多个 ML 节点
- 更新现有 ML 节点
- 启用或禁用 ML 节点
- 删除 ML 节点
- 列出所有已配置的 ML 节点

所有操作均针对网络节点的 Admin API 执行，**不需要**链上交易。更改将在网络节点级别立即生效。

---

## 前提条件

在管理 ML 节点之前，请确保：

- 您已完成 [快速入门指南](https://gonka.ai/host/quickstart/) 的 **第 3.3 步**（密钥管理和主机注册）。
- 您的 **网络节点** 正在运行，并且可以从执行 `curl` 命令的服务器访问。
- 您有权访问网络节点服务器 `9200` 端口上的 **Admin API**。

本指南中，我们假设您**在网络节点服务器本身上**运行命令：

```bash
export ADMIN_API_URL=http://localhost:9200
```

如果您从另一台机器调用 Admin API，请将 `localhost` 替换为您的网络节点的私有 IP 或主机名（请确保 `9200` 端口可访问并已正确配置防火墙）。

---

## ML 节点定义

每个注册到网络节点的 ML 节点均由一个包含以下关键字段的 JSON 对象表示：

- `id` – ML 节点的**唯一标识符**（字符串）。
- `host` – ML 节点的**静态 IP 或 DNS**，或在与网络节点相同的 Docker 网络中运行时的**Docker 容器名称**。
- `inference_port` – 用于推理请求的端口（映射到 ML 节点的 `nginx` 容器的 `5000` 端口）。
- `poc_port` – 用于计算证明（PoC）和管理操作的端口（映射到 ML 节点的 `nginx` 容器的 `8080` 端口）。
- `max_concurrent` – 此 ML 节点可处理的最大并发推理请求数。
- `models` – 模型名称到 vLLM 参数的映射。

示例 ML 节点配置：

```json
{
  "id": "node1",
  "host": "10.0.0.21",
  "inference_port": 5050,
  "poc_port": 8080,
  "max_concurrent": 500,
  "models": {
    "MiniMaxAI/MiniMax-M2.7": {
      "args": [
        "--tensor-parallel-size",
        "4"
      ]
    }
  }
}
```

!!! note "支持的模型和 vLLM 参数"
    当前网络支持 `MiniMaxAI/MiniMax-M2.7` 作为活动的 PoC 模型（受治理决策约束）。参见 [选择 LLM 最优部署配置的基准指南](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/)。

---

## 列出 ML 节点

使用此端点查看当前注册到您的网络节点的所有 ML 节点。

**端点**

- `GET /admin/v1/nodes`

**示例**

```bash
curl -X GET "$ADMIN_API_URL/admin/v1/nodes" | jq
```

**预期结果**

- 返回包含所有已配置 ML 节点及其当前配置的 JSON 数组。

---

## 添加新的 ML 节点

使用此操作向您的网络节点注册**单个**新 ML 节点。

**端点**

- `POST /admin/v1/nodes`

!!! note "在 4xH100 上添加 MiniMax 节点"
    示例请求：在 `4xH100` 上使用 `MiniMaxAI/MiniMax-M2.7`：

    ```bash
    curl -X POST "$ADMIN_API_URL/admin/v1/nodes" \
      -H "Content-Type: application/json" \
      -d '{
        "id": "node-minimax",
        "host": "10.0.0.22",
        "inference_port": 5050,
        "poc_port": 8080,
        "max_concurrent": 500,
        "models": {
          "MiniMaxAI/MiniMax-M2.7": {
            "args": [
              "--tensor-parallel-size",
              "4",
              "--max-model-len",
              "180000"
            ]
          }
        }
      }'
    ```
**预期结果**

成功时，返回包含新注册的 ML 节点配置的 `200 OK`（JSON 格式）。
如果一个或多个模型无效（未通过治理审批），API 将返回 400 Bad Request 及错误信息。

---

## 批量添加多个 ML 节点

使用此端点一次性注册**多个 ML 节点**。请求体为 ML 节点定义的数组。

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
        "MiniMaxAI/MiniMax-M2.7": {
          "args": [
            "--tensor-parallel-size",
            "4",
            "--max-model-len",
            "180000"
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
        "MiniMaxAI/MiniMax-M2.7": {
          "args": [
            "--tensor-parallel-size",
            "4",
            "--max-model-len",
            "180000"
          ]
        }
      }
    }
  ]'
```

**预期结果**

- 如果**所有**节点验证并注册成功：
  - 返回包含已注册节点数组的 `201 Created`。
- 如果**部分**节点验证失败：
  - 返回包含 `nodes`（成功节点）和描述失败的 `errors` 数组的 `206 Partial Content`。
- 如果**所有**节点验证失败：
  - 返回包含 `errors` 数组中详细信息的 `400 Bad Request`。

---

## 更新现有 ML 节点

更新 ML 节点实现为**upsert**：

- 如果 `id` 已存在，则**更新**该节点。
- 如果 `id` 不存在，则**创建**新节点。

您可以使用**以下任一方式**：

- 使用现有 `id` 的 `POST /admin/v1/nodes`，或
- 在请求体中使用相同 `id` 的 `PUT /admin/v1/nodes/:id`。

!!! note "保持路径和请求体中的 ID 一致"
    为清晰起见并避免混淆，使用 `PUT` 时，请始终确保请求体中的 `id` 与 URL 中的 `:id` 一致。

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
      "MiniMaxAI/MiniMax-M2.7": {
        "args": [
          "--tensor-parallel-size",
          "4",
          "--max-model-len",
          "180000"
        ]
      }
    }
  }'
```

**预期结果**

- 成功时，返回包含更新后节点配置的 `200 OK`。
- 如果节点无法更新（例如，模型未获治理允许），返回包含错误信息的 `400 Bad Request`。

---

## 启用 ML 节点

使用此端点**启用**之前已禁用的 ML 节点。此操作不会更改节点配置，仅更改其管理状态。

**端点**

- `POST /admin/v1/nodes/:id/enable`

**示例**

```bash
curl -X POST "$ADMIN_API_URL/admin/v1/nodes/node1/enable"
```

**预期结果**

- 成功时，返回：

  ```json
  {
    "message": "node enabled successfully",
    "node_id": "node1"
  }
  ```

- 如果节点不存在，返回包含错误信息的 `404 Not Found`。

---

## 禁用 ML 节点

使用此端点**禁用** ML 节点而不删除它。节点仍保持注册状态，但被标记为管理性禁用。它将在当前纪元结束前保持活跃，但不会参与下一个 PoC，因此不会被纳入下一个纪元。

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

- 如果节点不存在，返回 `404 Not Found` 并附带错误信息。

!!! note "禁用与删除"
    禁用 ML 节点是**可逆**的。您稍后可以使用 `/enable` 端点重新启用它。
    删除节点会将其配置从网络节点中完全移除（见下文）。

---

## 删除 ML 节点

使用此端点可从网络节点中完全移除 ML 节点配置。

**端点**

- `DELETE /admin/v1/nodes/:id`

**示例**

```bash
curl -X DELETE "$ADMIN_API_URL/admin/v1/nodes/node1"
```

**预期结果**

- 成功时返回 `200 OK`，并附带已删除节点的 JSON 表示。

!!! warning "不可逆操作"
    删除 ML 节点无法撤销。要重新添加节点，您必须使用 **添加新的 ML 节点** 或 **批量添加** 端点重新注册。

---

## 验证更改

在任何添加/更新/启用/禁用/删除操作后，您可以验证所有 ML 节点的当前状态：

```bash
curl -X GET "$ADMIN_API_URL/admin/v1/nodes" | jq
```

在协议级别进行端到端验证（在计算证明之后），您还可以检查当前的活跃参与者列表：

```bash
curl http://node2.gonka.ai:8000/v1/epochs/current/participants | jq
```

这使您能够确认您的网络节点及其 ML 节点是否正确地为网络做出贡献，并且其有效权重是否反映了最新更改。


