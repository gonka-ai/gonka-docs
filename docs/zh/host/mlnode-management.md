# ML 节点管理

本指南介绍如何使用**管理 API** 管理连接到网络节点的推理节点（ML 节点）。

您将学习如何：

- 添加新的 ML 节点
- 批量添加多个 ML 节点
- 更新现有 ML 节点
- 启用或禁用 ML 节点
- 删除 ML 节点
- 列出所有已配置的 ML 节点

所有操作均通过网络节点的管理 API 执行，**无需**链上交易。更改在网络节点的配置层面立即生效。

---

## 先决条件

在管理 ML 节点之前，请确保：

- 您已完成[快速入门指南](https://gonka.ai/host/quickstart/)至**步骤 3.3**（密钥管理与主机注册）。
- 您的**网络节点**正在运行，且可从执行 `curl` 命令的服务器访问。
- 您可访问网络节点服务器上端口 `9200` 的**管理 API**。

本指南假设您**从网络节点服务器本机**执行命令：

```bash
export ADMIN_API_URL=http://localhost:9200
```

若从其他机器调用管理 API，请将 `localhost` 替换为网络节点的内网 IP 或主机名（并确保端口 `9200` 可访问且已正确配置防火墙）。

---

## ML 节点定义

每个在网络节点上注册的 ML 节点由一个 JSON 对象表示，包含以下关键字段：

- `id` – ML 节点的**唯一标识符**（字符串）。
- `host` – ML 节点的**静态 IP 或 DNS**，若与网络节点在同一 Docker 网络中运行则为**容器名**。
- `inference_port` – 用于推理请求的端口（映射到 ML 节点 `nginx` 容器的端口 `5000`）。
- `poc_port` – 用于计算证明（PoC）和管理操作的端口（映射到 ML 节点 `nginx` 容器的端口 `8080`）。
- `max_concurrent` – 该 ML 节点可处理的最大并发推理请求数。
- `models` – 模型名称到 vLLM 参数的映射。

ML 节点配置示例：

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

!!! note "支持的模型与 vLLM 参数"
    当前网络仅支持 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`（以治理决策为准）。详见 [为 LLM 选择最优部署配置的基准测试指南](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/)。

---

## 列出 ML 节点

使用此接口查看当前在网络节点上注册的所有 ML 节点。

**接口**

- `GET /admin/v1/nodes`

**示例**

```bash
curl -X GET "$ADMIN_API_URL/admin/v1/nodes" | jq
```

**预期结果**

- 返回包含所有已配置 ML 节点及其当前配置的 JSON 数组。

---

## 添加新的 ML 节点

使用此操作在网络节点上注册**单个**新 ML 节点。

**接口**

- `POST /admin/v1/nodes`

!!! note "在 8xH100 或 8xH200 上添加 235B 节点"
    在 `8xH100` 或 `8xH200` 上添加 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` 的示例请求：

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

成功时返回 `200 OK` 及新注册的 ML 节点配置（JSON）。
若有一个或多个模型无效（未经治理批准），API 返回 400 Bad Request 及错误信息。

---

## 批量添加多个 ML 节点

使用此接口**一次注册多个** ML 节点。请求体为 ML 节点定义的数组。

**接口**

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

- 若**全部**节点验证并注册成功：
  - 返回 `201 Created` 及已注册节点数组。
- 若**部分**节点验证失败：
  - 返回 `206 Partial Content`，包含 `nodes`（成功的节点）和描述失败的 `errors` 数组。
- 若**全部**节点验证失败：
  - 返回 `400 Bad Request`，`errors` 数组中包含详情。

---

## 更新现有 ML 节点

更新 ML 节点采用** upsert** 逻辑：

- 若 `id` 已存在，则**更新**该节点。
- 若 `id` 不存在，则**新建**节点。

您可以使用以下任一方式：

- `POST /admin/v1/nodes` 且使用已有 `id`，或
- `PUT /admin/v1/nodes/:id`，请求体中使用相同 `id`。

!!! note "保持路径与请求体中的 ID 一致"
    为清晰起见，使用 `PUT` 时请始终将请求体中的 `id` 与 URL 中的 `:id` 保持一致。

**示例：提高 `max_concurrent` 并更新模型**

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

- 成功时返回 `200 OK` 及更新后的节点配置。
- 若无法更新节点（例如模型未被治理允许），返回 `400 Bad Request` 及错误信息。

---

## 启用 ML 节点

使用此接口**启用**此前被禁用的 ML 节点。此操作不修改节点配置，仅改变其管理状态。

**接口**

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

- 若节点不存在，返回 `404 Not Found` 及错误信息。

---

## 禁用 ML 节点

使用此接口**禁用** ML 节点而不删除它。节点仍保持注册，但被标记为管理性禁用。它将保持活动直到当前 epoch 结束，但不会参与接下来的 PoC，因此不会计入下一 epoch。

**接口**

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

- 若节点不存在，返回 `404 Not Found` 及错误信息。

!!! note "禁用与删除"
    禁用 ML 节点是**可逆的**。之后可通过 `/enable` 接口重新启用。
    删除节点会从网络节点中完全移除其配置（见下文）。

---

## 删除 ML 节点

使用此接口从网络节点中完全移除 ML 节点配置。

**接口**

- `DELETE /admin/v1/nodes/:id`

**示例**

```bash
curl -X DELETE "$ADMIN_API_URL/admin/v1/nodes/node1"
```

**预期结果**

- 成功时返回 `200 OK` 及已删除节点的 JSON 表示。

!!! warning "不可逆操作"
    删除 ML 节点无法撤销。若要重新添加，必须使用**添加新 ML 节点**或**批量添加**接口再次注册。

---

## 验证更改

在执行任意添加/更新/启用/禁用/删除操作后，可验证所有 ML 节点的当前状态：

```bash
curl -X GET "$ADMIN_API_URL/admin/v1/nodes" | jq
```

若要在协议层面做端到端验证（在计算证明之后），可查看当前活跃参与者列表：

```bash
curl http://node2.gonka.ai:8000/v1/epochs/current/participants | jq
```

由此可确认您的网络节点及其 ML 节点是否正确参与网络，且其有效权重已反映最近更改。
