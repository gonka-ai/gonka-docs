# Pricing
## Overview
Our system uses a **universal measure of work** called a _unit of compute_. Whether performing inference or training, each operation’s resource usage can be **estimated** in terms of these units of compute.

**Pricing** is determined by how many blockchain coins (e.g., `icoin`, `uicoin`, etc.) correspond to one unit of compute. To achieve a fair market price:
1. Each inference provider **submits a vote** indicating how many coins per unit of compute they propose.
2. The **weighted median** of these submissions is determined at the end of each epoch (when validators are rotated).
3. That weighted median becomes the **common price** per unit of compute for the next epoch.

If a provider **does not submit a vote**:

- Their vote is assumed to be the **last epoch’s price**.
- If it is the **very first epoch**, the **genesis parameter** `default_unit_of_compute_price` is used for their vote.

---

## Supported Denominations
You can propose your price in any of the following denominations (denoms):
- `icoin`
- `uicoin` (micro-coins)
- `micoin` (milli-coins)
- `nicoin` (nano-coins)

---

## API Endpoints
Use these endpoints to manage (send/update) your price proposal and to check your current vote.

**1. Set or Update Your Price Vote**

**Endpoint**

```
POST /v1/admin/unit-of-compute-price-proposal
```

**Body (JSON)**

```
{
  "price": 1000,
  "denom": "icoin"
}
```

| Field  | Type   | Description                                  |
|--------|--------|----------------------------------------------|
| `price`  | number | Your proposed price per unit of compute.     |
| `denom`  | string | The denomination (e.g., `nicoin`, `micoin`, `uicoin`, `icoin`). |

**Example**

```
curl -X POST https://your-node-url.com/v1/admin/unit-of-compute-price-proposal \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1000,
    "denom": "icoin"
  }'
```

**2. Check Your Current Price Vote**

```
GET /v1/admin/unit-of-compute-price-proposal
```

**Response (JSON)**

```
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

---

## Process Summary
1. **Submission:** Providers submit or update their price proposals via the POST endpoint.
2. **Voting Window:** These submissions remain active throughout the epoch.
3. **Vote Aggregation:** At epoch transition, the system aggregates all price proposals.
4. **Weighted Median:** A weighted median is computed and set as the canonical price per unit of compute for the next epoch.
5. **Continuation Default:** If a provider never votes, the most recently used epoch price (or the genesis parameter for the very first epoch) is used as their default vote.
