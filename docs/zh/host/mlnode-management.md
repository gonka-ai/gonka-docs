# ML节点管理

本指南介绍如何使用**管理API**管理连接到网络节点的推理节点（ML节点）。

您将学习如何：

- 添加新的ML节点
- 批量添加多个ML节点
- 更新现有ML节点
- 启用或禁用ML节点
- 删除ML节点
- 列出所有已配置的ML节点

所有操作都通过网络节点的管理API执行，**不需要**链上交易。更改在网络节点级别立即生效。

---

## 先决条件

在管理ML节点之前，请确保：

- 您已完成[快速入门指南](https://gonka.ai/host/quickstart/)的**步骤3.3**（密钥管理和主机注册）。
- 您的**网络节点**正在运行，并且可以从执行`curl`命令的服务器访问。
- 您可以访问网络节点服务器上端口`9200`的**管理API**。

在本指南中，我们假设您**从网络节点服务器本身**运行命令：

```bash
export ADMIN_API_URL=http://localhost:9200
```

如果您从另一台机器调用管理API，请将`localhost`替换为网络节点的私有IP或主机名（确保端口`9200`可访问并已正确配置防火墙）。

---

## ML节点定义

每个注册到网络节点的ML节点都由一个JSON对象表示，包含以下关键字段：

- `id` – ML节点的**唯一标识符**（字符串）。
- `host` – ML节点的**静态IP或DNS**，或者如果在与网络节点相同的Docker网络中运行，则为**Docker容器名称**。
- `inference_port` – 用于推理请求的端口（映射到ML节点的`nginx`容器的端口`5000`）。
- `poc_port` – 用于计算证明（PoC）和管理操作的端口（映射到ML节点的`nginx`容器的端口`8080`）。
- `max_concurrent` – 此ML节点可以处理的最大并发推理请求数。
- `models` – 模型名称到vLLM参数的映射。

ML节点配置示例：

```json
{
  "id": "node1",
  "host": "10.0.0.21",
  "inference_port": 5050,
  "poc_port": 8080,
  "max_concurrent": 500,
  "models": {
    "Qwen/Qwen3-32B-FP8": {
      "args": []
    }
  }
}
```

!!! note "支持的模型和vLLM参数"
    网络目前支持以下模型（受治理决策约束）：

    - `Qwen/Qwen2.5-7B-Instruct`
    - `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
    - `Qwen/Qwen3-32B-FP8`
    - `Qwen/QwQ-32B`
    - `RedHatAI/Qwen2.5-7B-Instruct-quantized.w8a16`

    有关每个模型和GPU布局的推荐vLLM参数，请参阅[选择LLM最优部署配置的基准测试](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/)指南。

---

## 列出ML节点

使用此端点查看当前注册到网络节点的所有ML节点。

**端点**

- `GET /admin/v1/nodes`

**示例**

```bash
curl -X GET "$ADMIN_API_URL/admin/v1/nodes" | jq
```

**预期结果**

- 返回包含所有已配置ML节点及其当前配置的JSON数组。

---

## 添加新的ML节点

使用此操作向网络节点注册**单个**新的ML节点。

**端点**

- `POST /admin/v1/nodes`

**请求体**

请求体应与上述ML节点定义匹配。`Qwen/Qwen3-32B-FP8`节点的示例：

```bash
curl -X POST "$ADMIN_API_URL/admin/v1/nodes" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "node1",
    "host": "10.0.0.21",
    "inference_port": 5050,
    "poc_port": 8080,
    "max_concurrent": 500,
    "models": {
      "Qwen/Qwen3-32B-FP8": {
        "args": []
      }
    }
  }'
```

**预期结果**

- 成功时，返回`200 OK`以及新注册的ML节点配置（JSON格式）。
- 如果一个或多个模型无效（未经治理批准），API返回`400 Bad Request`并附带错误消息。

!!! note "在8xH100或8xH200上添加235B节点"
    在`8xH100`或`8xH200`上添加`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`的示例请求：

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
              "4"
            ]
          }
        }
      }'
    ```

---

## 批量添加多个ML节点

使用此端点**一次注册多个ML节点**。请求体是ML节点定义的数组。

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
        "Qwen/Qwen3-32B-FP8": {
          "args": []
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
            "4"
          ]
        }
      }
    }
  ]'
```

**预期结果**

- 如果**所有**节点验证并注册成功：
  - 返回`201 Created`以及已注册节点的数组。
- 如果**部分**节点验证失败：
  - 返回`206 Partial Content`，包含`nodes`（成功的节点）和描述失败的`errors`数组。
- 如果**所有**节点验证失败：
  - 返回`400 Bad Request`，`errors`数组中包含详细信息。

---

## 更新现有ML节点

更新ML节点实现为**更新插入（upsert）**：

- 如果`id`已存在，则**更新**节点。
- 如果`id`不存在，则**创建**新节点。

您可以使用**以下任一方式**：

- `POST /admin/v1/nodes`（使用现有的`id`），或
- `PUT /admin/v1/nodes/:id`（请求体中使用相同的`id`）。

!!! note "保持路径和请求体中的ID一致"
    为清晰起见并避免混淆，使用`PUT`时，请始终将请求体中的`id`设置为与URL中的`:id`匹配。

**示例：增加`max_concurrent`并更新模型**

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
      "Qwen/Qwen3-32B-FP8": {
        "args": [
          "--tensor-parallel-size",
          "4"
        ]
      }
    }
  }'
```

**预期结果**

- 成功时，返回`200 OK`以及更新后的节点配置。
- 如果无法更新节点（例如，模型未被治理允许），返回`400 Bad Request`并附带错误消息。

---

## 启用ML节点

使用此端点**启用**之前被禁用的ML节点。此操作不会更改节点的配置，仅更改其管理状态。

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

- 如果节点不存在，返回`404 Not Found`并附带错误消息。

---

## 禁用ML节点

使用此端点**禁用**ML节点而不删除它。节点保持注册状态，但被标记为管理性禁用。它将保持活动状态直到当前周期结束，但不会参与即将到来的PoC，因此不会被包含在下一个周期中。

**端点**

- `POST /admin/v1/nodes/:id/disable`

**示例**

```bash
curl -X POST "$ADMIN_API_URL/admin/v1/nodes/node1/disable"
```

**预期结果**

- 成功时，返回：

  ```json
  {
    "message": "node disabled successfully",
    "node_id": "node1"
  }
  ```

- 如果节点不存在，返回`404 Not Found`并附带错误消息。

!!! note "禁用与删除"
    禁用ML节点是**可逆的**。您稍后可以使用`/enable`端点重新启用它。
    删除节点会从网络节点中完全移除其配置（见下文）。

---

## 删除ML节点

使用此端点从网络节点完全移除ML节点配置。

**端点**

- `DELETE /admin/v1/nodes/:id`

**示例**

```bash
curl -X DELETE "$ADMIN_API_URL/admin/v1/nodes/node1"
```

**预期结果**

- 成功时，返回`200 OK`以及已删除节点的JSON表示。

!!! warning "不可逆操作"
    删除ML节点无法撤销。要重新添加节点，您必须使用**添加新ML节点**或**批量添加**端点重新注册它。

---

## 验证更改

在执行任何添加/更新/启用/禁用/删除操作后，您可以验证所有ML节点的当前状态：

```bash
curl -X GET "$ADMIN_API_URL/admin/v1/nodes" | jq
```

为了在协议级别进行端到端验证（在计算证明之后），您还可以检查当前活跃参与者列表：

```bash
curl http://node2.gonka.ai:8000/v1/epochs/current/participants | jq
```

这使您可以确认您的网络节点及其ML节点正在正确地为网络做出贡献，并且它们的有效权重反映了最近的更改。
