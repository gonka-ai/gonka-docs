# Pricing
## Overview
Our system uses a **universal measure of work** called a _unit of compute_. Whether performing inference or training, each operation’s resource usage can be **estimated** in terms of these units of compute.

**Pricing** is determined by how many blockchain coins (e.g., `icoin`, `uicoin`, etc.) correspond to one unit of compute. To achieve a fair market price:

- Each inference provider **submits a vote** indicating how many coins per unit of compute they propose.
- The **weighted median** of these submissions is determined at the end of each epoch (when validators are rotated).
- That weighted median becomes the **common price** per unit of compute for the next epoch.

If a provider **does not submit a vote**:

- Their vote is assumed to be the **last epoch’s price**.
- If it is the **very first epoch**, the **genesis parameter** `default_unit_of_compute_price` is used for their vote.

---

## Supported denominations
You can propose your price in any of the following denominations (denoms):

- `icoin`
- `micoin` (milli-coins)
- `uicoin` (micro-coins)
- `ngonka` (nano-coins)

---

## API Endpoints
Use these endpoints to manage (send/update) your price proposal and to check your current vote.

### 1. Set or update your price vote

**Endpoint**

```
POST /v1/admin/unit-of-compute-price-proposal
```

**Body (JSON)**
```bash linenums="1"
{
  "price": 1000,
  "denom": "icoin"
}
```

| Field  | Type   | Description                                  |
|--------|--------|----------------------------------------------|
| `price`  | number | Your proposed price per unit of compute.     |
| `denom`  | string | The denomination (e.g., `icoin`, `micoin`, `uicoin`, `ngonka`). |

**Example**

```
curl -X POST https://your-node-url.com/v1/admin/unit-of-compute-price-proposal \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1000,
    "denom": "icoin"
  }'
```

### 2. Check your current price vote

```
GET /v1/admin/unit-of-compute-price-proposal
```

**Response (JSON)**

```bash linenums="1"
{
  "price": 1000,
  "denom": "icoin"
}
```

| Field  | Type   | Description                                  |
|--------|--------|----------------------------------------------|
| `price`  | number | The currently stored vote for your account.  |
| `denom`  | string | The denomination used in your stored price vote. |

**Example**

```
curl -X GET https://your-node-url.com/v1/admin/unit-of-compute-price-proposal
```

### 3. Check the current unit-of-compute price & model pricing

**Endpoint**

```
GET /v1/pricing
```

**Response (JSON)**

```bash linenums="1"
{
  "unit_of_compute_price": 1200,
  "models": [
    {
      "id": "model-alpha",
      "units_of_compute_per_token": 10,
      "price_per_token": 12000
    },
    {
      "id": "model-beta",
      "units_of_compute_per_token": 20,
      "price_per_token": 24000
    }
  ]
}
```

| Field                 | Type   | Description                                                 |
|-----------------------|--------|-------------------------------------------------------------|
| `unit_of_compute_price` | number | The current chain-wide price (in `price` × `denom`) for one unit of compute. |
| `models`               | array  | A list of models, each containing model-specific pricing details (per-token cost, etc.). |

Within each item in `models`:

| Field                      | Type   | Description                                                                 |
|----------------------------|--------|-----------------------------------------------------------------------------|
| `id`                         | string | Unique identifier for the model.                                           |
| `units_of_compute_per_token` | number | How many units of compute it takes to process one token for this model.    |
| `price_per_token`            | number | The cost in coins per token for this model, derived from the above unit price. |

**Example**

```bash
curl -X GET https://your-node-url.com/v1/pricing
```

### 4. Register a new model

Registering a new model involves proposing the number of units of compute required for each token of that model.
When you submit a new model via the `POST /v1/admin/models` endpoint, our system automatically creates a corresponding governance proposal using the CosmoSDK governance module, and a deposit is immediately withdrawn to initiate the process – eliminating the need for a separate deposit funding step later.
Other participants can then review the proposal and cast their votes using the governance CLI provided within the inferenced app.

**Endpoint**

```bash
POST /v1/admin/models
```

**Body (JSON)**

```bash linenums="1"
{
  "id": "model-alpha",
  "units_of_compute_per_token": 10
}
```

| Field                      | Type   | Description                                                       |
|----------------------------|--------|-------------------------------------------------------------------|
| `id`                         | string | Unique identifier for the model.                                 |
| `units_of_compute_per_token` | number | Proposed units of compute consumed per token for this model.     |

**Example**

```
curl -X POST https://your-node-url.com/v1/admin/models \
  -H "Content-Type: application/json" \
  -d '{
    "id": "model-alpha",
    "units_of_compute_per_token": 10
  }'
```

---

## Process summary
1. **Submission:** Providers submit or update their price proposals via the POST endpoint.
2. **Voting window:** These submissions remain active throughout the epoch.
3. **Vote aggregation:** At epoch transition, the system aggregates all price proposals.
4. **Weighted median:** A weighted median is computed and set as the canonical price per unit of compute for the next epoch.
5. **Continuation default:** If a provider never votes, the most recently used epoch price (or the genesis parameter for the very first epoch) is used as their default vote.
6. **Model registration & approval**: Users propose new models with their own unit-of-compute-per-token estimation. Participants then vote on these proposals before they become finalized.
