# MLNode Management

This guide explains how to manage inference nodes (MLNodes) connected to your Network Node using the **Admin API**.

You will learn how to:

- Add a new MLNode
- Add multiple MLNodes in a single batch
- Update an existing MLNode
- Enable or disable an MLNode
- Delete an MLNode
- List all configured MLNodes

All operations are performed against the Network Node’s Admin API and do **not** require a chain transaction. Changes take effect immediately at the Network Node level.

---

## Prerequisites

Before managing MLNodes, make sure that:

- You have completed the [Quickstart guide](https://gonka.ai/host/quickstart/) through **step 3.3** (key management and Host registration).
- Your **Network Node** is running and reachable from the server where you execute the `curl` commands.
- You have access to the **Admin API** on port `9200` of the Network Node server.

Throughout this guide we assume you run commands **from the Network Node server** itself:

```bash
export ADMIN_API_URL=http://localhost:9200
```

If you are calling the Admin API from another machine, replace `localhost` with the private IP or hostname of your Network Node (make sure port `9200` is reachable and properly firewalled).

---

## MLNode Definition

Each MLNode registered with the Network Node is represented by a JSON object with the following key fields:

- `id` – **Unique identifier** for the MLNode (string).
- `host` – **Static IP or DNS** of the MLNode, or the **Docker container name** if running in the same Docker network as the Network Node.
- `inference_port` – Port used for inference requests (mapped to port `5000` of the MLNode’s `nginx` container).
- `poc_port` – Port used for Proof-of-Compute (PoC) and management operations (mapped to port `8080` of the MLNode’s `nginx` container).
- `max_concurrent` – Maximum number of concurrent inference requests that this MLNode can handle.
- `models` – Map of model names to vLLM arguments.

Example MLNode configuration:

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

!!! note "Supported models and vLLM arguments"
    The network currently supports the following models (subject to governance decisions):

    - `Qwen/Qwen2.5-7B-Instruct`
    - `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
    - `Qwen/Qwen3-32B-FP8`
    - `Qwen/QwQ-32B`
    - `RedHatAI/Qwen2.5-7B-Instruct-quantized.w8a16`

    For recommended vLLM arguments for each model and GPU layout, see the [Benchmark to Choose Optimal Deployment Config for LLMs](https://gonka.ai/host/benchmark-to-choose-optimal-deployment-config-for-llms/) guide.

---

## Listing MLNodes

Use this endpoint to see all MLNodes currently registered with your Network Node.

**Endpoint**

- `GET /admin/v1/nodes`

**Example**

```bash
curl -X GET "$ADMIN_API_URL/admin/v1/nodes" | jq
```

**Expected result**

- Returns a JSON array containing all configured MLNodes and their current configuration.

---

## Adding a New MLNode

Use this operation to register a **single** new MLNode with your Network Node.

**Endpoint**

- `POST /admin/v1/nodes`

**Request body**

The body should match the MLNode definition described above. Example for a `Qwen/Qwen3-32B-FP8` node:

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

**Expected result**

- On success, returns `200 OK` with the newly registered MLNode configuration in JSON.
- If one or more models are not valid (not approved by governance), the API returns `400 Bad Request` with an error message.

!!! note "Adding a 235B node on 8xH100 or 8xH200"
    Example request for `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` on `8xH100` or `8xH200`:

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

## Adding Multiple MLNodes in a Batch

Use this endpoint to register **several MLNodes at once**. The request body is an array of MLNode definitions.

**Endpoint**

- `POST /admin/v1/nodes/batch`

**Example**

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

**Expected result**

- If **all** nodes validate and register successfully:
  - Returns `201 Created` with an array of registered nodes.
- If **some** nodes fail validation:
  - Returns `206 Partial Content` with `nodes` (successful ones) and an `errors` array describing failures.
- If **all** nodes fail validation:
  - Returns `400 Bad Request` with details in the `errors` array.

---

## Updating an Existing MLNode

Updating an MLNode is implemented as an **upsert**:

- If the `id` already exists, the node is **updated**.
- If the `id` does not exist, a **new** node is created.

You can use **either**:

- `POST /admin/v1/nodes` with an existing `id`, or
- `PUT /admin/v1/nodes/:id` with the same `id` in the body.

!!! note "Keep path and body IDs in sync"
    For clarity and to avoid confusion, always set the `id` in the request body to match the `:id` in the URL when using `PUT`.

**Example: increase `max_concurrent` and update models**

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

**Expected result**

- On success, returns `200 OK` with the updated node configuration.
- If the node cannot be updated (for example, model not allowed by governance), returns `400 Bad Request` with an error message.

---

## Enabling an MLNode

Use this endpoint to **enable** an MLNode that was previously disabled. This operation does not change the node’s configuration, only its administrative state.

**Endpoint**

- `POST /admin/v1/nodes/:id/enable`

**Example**

```bash
curl -X POST "$ADMIN_API_URL/admin/v1/nodes/node1/enable"
```

**Expected result**

- On success, returns:

  ```json
  {
    "message": "node enabled successfully",
    "node_id": "node1"
  }
  ```

- If the node does not exist, returns `404 Not Found` with an error message.

---

## Disabling an MLNode

Use this endpoint to **disable** an MLNode without deleting it. The node remains registered but is marked as administratively disabled. It will remain active until the end of the epoch, but it won't participate in the upcoming PoC and as a result won't be included in the next epoch.

**Endpoint**

- `POST /admin/v1/nodes/:id/disable`

**Example**

```bash
curl -X POST "$ADMIN_API_URL/admin/v1/nodes/node1/disable"
```

**Expected result**

- On success, returns:

  ```json
  {
    "message": "node disabled successfully",
    "node_id": "node1"
  }
  ```

- If the node does not exist, returns `404 Not Found` with an error message.

!!! note "Disabling vs deleting"
    Disabling an MLNode is **reversible**. You can enable it again later using the `/enable` endpoint.
    Deleting a node removes its configuration from the Network Node entirely (see below).

---

## Deleting an MLNode

Use this endpoint to remove an MLNode configuration entirely from the Network Node.

**Endpoint**

- `DELETE /admin/v1/nodes/:id`

**Example**

```bash
curl -X DELETE "$ADMIN_API_URL/admin/v1/nodes/node1"
```

**Expected result**

- On success, returns `200 OK` with a JSON representation of the deleted node.

!!! warning "Irreversible operation"
    Deleting an MLNode cannot be undone. To re-add the node, you must register it again using the **Add a New MLNode** or **Batch Add** endpoints.

---

## Verifying Changes

After any add/update/enable/disable/delete operation, you can verify the current state of all MLNodes:

```bash
curl -X GET "$ADMIN_API_URL/admin/v1/nodes" | jq
```

For end-to-end verification at the protocol level (after Proof-of-Compute), you can also check the current list of active participants:

```bash
curl http://node2.gonka.ai:8000/v1/epochs/current/participants | jq
```

This allows you to confirm that your Network Node and its MLNodes are correctly contributing to the network and that their effective weight reflects recent changes.


