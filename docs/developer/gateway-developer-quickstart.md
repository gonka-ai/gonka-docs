# Run your own gateway

This guide explains how to run a Gonka devshard gateway on **gonka-mainnet** without installing a full chain node. You will deploy the gateway on your own Linux host, fund a dedicated escrow creator address, open an on-chain devshard escrow, send OpenAI-compatible inference requests, and settle the escrow when you are finished.

If you only need inference through an existing endpoint, use a [community broker](quickstart.md#1-use-a-community-broker-recommended) instead — that path does not require Docker, on-chain escrows, or an allow-listed creator address.

### Allowlisted creator address required

> **Prerequisite:** The `gonka1…` address for your devshard escrow creator (`$DEVSHARD_CREATOR`, from `DEVSHARD_PRIVATE_KEY`) **must** appear on the chain allowlist `devshard_escrow_params.allowed_creator_addresses` **before** you can create an escrow.
>
> The allowlist is maintained on-chain through **governance**. You cannot add yourself via `config.devshard.env` or admin settings. Request inclusion through an on-chain governance vote — see [Become a broker](quickstart.md#3-become-a-broker) in the Developer Quickstart — or use a [community broker](quickstart.md#1-use-a-community-broker-recommended) instead.
>
> After you import your key in [§2.3](#23-import-the-creator-key), verify membership in [§2.4](#24-confirm-allowlist-membership). Do not fund the creator or deploy the gateway until that check passes (funding alone does not grant allowlist access).

!!! warning "Production network"

```
Mainnet escrows and fees use **real** ngonka. Confirm `devshard_escrow_params.min_amount` on chain (§2.4) before funding or creating an escrow. The example deposit below must be **≥ `min_amount`**.
```

### How this setup works

Gonka inference is organised around **devshards** — short-lived sessions backed by a small on-chain deposit (an escrow). A **gateway** opens the escrow, routes `/v1/chat/completions` to the network, coordinates off-chain settlement state, and submits finalize/settle transactions to the chain.

On a **gateway-only** server you run only the gateway container (`devshardctl`). Chain access uses public REST/RPC URLs. You do not run CometBFT, `api`, or `mlnode` on the same machine.

### What you need

1. **Allowlisted escrow creator** — `$DEVSHARD_CREATOR` on `allowed_creator_addresses` ([prerequisite](#allowlisted-creator-address-required) above; confirm in [§2.4](#24-confirm-allowlist-membership))
2. A Linux host with Docker
3. Outbound HTTPS to a public Gonka mainnet endpoint ([node3](https://node3.gonka.ai/) for chain REST + public API)
4. The [inferenced CLI v0.2.13](https://github.com/gonka-ai/gonka/releases/tag/release/v0.2.13) on the same host (for queries and on-chain settle)
5. A funded `gonka1…` address used **only** as that escrow creator (after allowlist is confirmed)

### Mainnet reference


| Item                     | Value                                                           |
| ------------------------ | --------------------------------------------------------------- |
| Chain ID                 | `gonka-mainnet`                                                 |
| Model (example)          | `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`                        |
| Escrow deposit (example) | `5000000000` ngonka (~5 GONKA); must be ≥ on-chain `min_amount` |
| Public node (example)    | `https://node3.gonka.ai`                                        |
| CometBFT RPC (example)   | `https://node3.gonka.ai/chain-rpc/`                             |
| Gateway image            | `libermans/gonka-devshard-proxy:latest`                         |


Copy the chain URLs into `config.devshard.env` in [§2.2](#22-create-configdevshardenv). Every command below assumes you have run `source config.devshard.env` from your deploy directory.

---

## 1. Install tools and create a deploy directory

### 1.1 Install Docker and `inferenced`

Confirm Docker is available:

```bash
docker --version
```

Download **inferenced v0.2.13** from the [release page](https://github.com/gonka-ai/gonka/releases/tag/release/v0.2.13):

```bash
curl -fsSL -o /tmp/inferenced-amd64.zip \
  "https://github.com/gonka-ai/gonka/releases/download/release/v0.2.13/inferenced-amd64.zip"
unzip -o /tmp/inferenced-amd64.zip -d "$HOME/bin"
chmod +x "$HOME/bin/inferenced"
export PATH="$HOME/bin:$PATH"
inferenced version   # should report v0.2.13

export INFERENCED_HOME="$HOME/.devshard-inferenced"
export INFERENCED_KEYRING="$INFERENCED_HOME/keyring-devshard"
mkdir -p "$INFERENCED_HOME" "$INFERENCED_KEYRING"
```

`INFERENCED_HOME` keeps CLI state separate from a default `~/.inference` install. `INFERENCED_KEYRING` is only a folder name for imported keys.

### 1.2 Create the deploy directory

Use one directory for `config.devshard.env`, `docker-compose.yml`, and gateway data. The examples below use `/srv/gonka/devshard-gateway`.

Create the directory **owned by your login user**:

```bash
sudo mkdir -p /srv/gonka/devshard-gateway
sudo chown "$USER:$USER" /srv/gonka/devshard-gateway
cd /srv/gonka/devshard-gateway
```

---

## 2. Prepare identity and configuration

### 2.1 Generate API keys and escrow wallet

From the deploy directory, generate secrets and save the output for the next step:

```bash
printf 'export DEVSHARD_PRIVATE_KEY=%s\n' "$(openssl rand -hex 32)"
printf 'export DEVSHARD_API_KEYS=sk-%s\n' "$(openssl rand -hex 24)"
printf 'export DEVSHARD_ADMIN_API_KEY=sk-admin-%s\n' "$(openssl rand -hex 24)"
```

`DEVSHARD_PRIVATE_KEY` is a **dedicated escrow creator** wallet. Do not reuse validator, participant, or broker keys.

### 2.2 Create `config.devshard.env`

This file must exist before `source config.devshard.env` or `docker compose up`. Docker Compose loads it into the container.

```bash
nano config.devshard.env
```

Example mainnet contents (paste secrets from [§2.1](#21-generate-api-keys-and-escrow-wallet)):

```bash
# Chain (public node — gonka-mainnet)
export NODE_RPC=https://node3.gonka.ai/chain-rpc/
export CHAIN_ID="gonka-mainnet"
export NODE_BASE=https://node3.gonka.ai
export NODE_CHAIN_API=https://node3.gonka.ai/chain-api

# inferenced CLI (local; not used by the gateway container)
export INFERENCED_HOME="$HOME/.devshard-inferenced"
export INFERENCED_KEYRING="$INFERENCED_HOME/keyring-devshard"

# Escrow creator + gateway auth (from §2.1)
export DEVSHARD_PRIVATE_KEY=<64-char-hex-no-0x-prefix>
export DEVSHARD_API_KEYS=sk-...
export DEVSHARD_ADMIN_API_KEY=sk-admin-...

# Gateway (devshardctl container)
export DEVSHARD_INSTANCE_NAME=devshardctl-multi
export DEVSHARDS_JSON='[]'
export DEVSHARD_CHAIN_REST=https://node3.gonka.ai/chain-api
export DEVSHARD_TX_QUERY_REST=https://node3.gonka.ai/chain-api
export DEVSHARD_PUBLIC_API=https://node3.gonka.ai
export DEVSHARD_PORT=8080
export DEVSHARD_STORAGE_DIR=/root/.devshardctl
export DEVSHARD_STORAGE_HOST_DIR=.devshardctl
export DEVSHARD_MODEL=Qwen/Qwen3-235B-A22B-Instruct-2507-FP8
export GATEWAY_MAX_CONCURRENT_REQUESTS=512
export GATEWAY_MAX_INPUT_TOKENS_IN_FLIGHT=0
export GATEWAY_DEFAULT_MAX_TOKENS=3072
export GATEWAY_MAX_TOKENS_CAP=4096
export DEVSHARD_TX_GAS_LIMIT=700000
export DEVSHARD_POC_REQUEST_MODE=relaxed
export DEVSHARD_CAPACITY_AWARE_LIMITS=on
```

`DEVSHARDS_JSON='[]'` is required for multi-escrow mode before the first escrow exists. Without it, the container expects `DEVSHARD_ESCROW_ID` (single-escrow mode) and will exit until you set one.

Lock down permissions and verify the public node:

```bash
chmod 600 config.devshard.env
mkdir -p "$INFERENCED_HOME" "$INFERENCED_KEYRING"

cd /srv/gonka/devshard-gateway
source config.devshard.env
curl -fsS "${NODE_RPC}status" | jq '.result.sync_info.latest_block_height'
```

You should see a recent block height. Optional — list governance models:

```bash
curl -sS "$NODE_BASE/v1/governance/models" | jq
```

### 2.3 Import the creator key

```bash
source config.devshard.env

test -f config.devshard.env
test -n "$DEVSHARD_PRIVATE_KEY"
```

`--keyring-backend test` is the Cosmos SDK backend name (local dev keyring).

```bash
inferenced keys import-hex devshard-create "$DEVSHARD_PRIVATE_KEY" \
  --keyring-backend test \
  --keyring-dir "$INFERENCED_KEYRING" \
  --home "$INFERENCED_HOME"
```

If import reports the key already exists, skip import.

Resolve the on-chain creator address:

```bash
export DEVSHARD_CREATOR="$(inferenced keys show devshard-create -a \
  --keyring-backend test \
  --keyring-dir "$INFERENCED_KEYRING" \
  --home "$INFERENCED_HOME")"
echo "DEVSHARD_CREATOR=$DEVSHARD_CREATOR"
```

Optional — persist `DEVSHARD_CREATOR` in the env file (run once):

```bash
grep -q '^export DEVSHARD_CREATOR=' config.devshard.env || \
  echo "export DEVSHARD_CREATOR=$DEVSHARD_CREATOR" >> config.devshard.env
```

The name `devshard-create` is only a local label; on-chain transactions use `--from devshard-create` to sign as `$DEVSHARD_CREATOR`.

### 2.4 Confirm allowlist membership

**Do not skip this step.** Escrow creation in [§4](#4-create-an-escrow-and-open-api-access) only succeeds when `$DEVSHARD_CREATOR` is on the chain allowlist.

You do **not** need to run a validator to use a gateway; you only need your creator address on `devshard_escrow_params.allowed_creator_addresses`. If it is missing, stop here and follow [Become a broker](quickstart.md#3-become-a-broker) to request a governance params update. Re-run this check after any governance vote before creating an escrow.

```bash
source config.devshard.env

echo "DEVSHARD_CREATOR=$DEVSHARD_CREATOR"

curl -sS "$NODE_CHAIN_API/productscience/inference/inference/params" \
  | jq '.params.devshard_escrow_params | {min_amount, max_escrows_per_epoch, max_nonce, allowed_creator_addresses}'

curl -sS "$NODE_CHAIN_API/productscience/inference/inference/params" \
  | jq --arg addr "$DEVSHARD_CREATOR" \
    '.params.devshard_escrow_params.allowed_creator_addresses | index($addr) != null'
```

The second command must print `true`. Use the first command to read live limits (`min_amount`, `max_escrows_per_epoch`, `max_nonce`). On mainnet after the [v0.2.13 upgrade](https://github.com/gonka-ai/gonka/blob/gm/microrelease/inference-chain/app/upgrades/v0_2_13/upgrades.go), expect `max_escrows_per_epoch` **500,000** and `max_nonce` **1,000,000**. If it prints `false`, your address is **not** allowlisted—do not proceed to [§2.5](#25-fund-the-creator-account), [§3](#3-deploy-the-gateway), or [§4](#4-create-an-escrow-and-open-api-access) until it is added on chain.

### 2.5 Fund the creator account

Only after [§2.4](#24-confirm-allowlist-membership) returns `true`, fund the creator:

```bash
inferenced query bank balances "$DEVSHARD_CREATOR" \
  --node "$NODE_RPC" --chain-id "$CHAIN_ID" -o json --home "$INFERENCED_HOME" \
  | jq '.balances[] | select(.denom=="ngonka")'
```

Send enough **ngonka** to cover the escrow deposit (`5000000000` in the example if that is ≥ `min_amount`), plus create/settle gas and transaction fees. If you will enable automatic escrow rotation ([Escrow lifetime and rotation](#escrow-lifetime-and-rotation)), fund the creator for **several** deposits per epoch—not only the one manual escrow in [§4](#4-create-an-escrow-and-open-api-access).

---

## 3. Deploy the gateway

This section starts the gateway process. You **create** `docker-compose.yml` locally; Docker **pulls** the pre-built image. You are not downloading a compose file from the network and you are not installing a Gonka chain node.

The gateway reads `config.devshard.env`, stores state under `.devshardctl/`, and listens on `http://127.0.0.1:18080` on the host. On-chain escrow creation happens in [§4](#4-create-an-escrow-and-open-api-access); starting the gateway first is fine.


| Path                  | Purpose                                   |
| --------------------- | ----------------------------------------- |
| `config.devshard.env` | Secrets and chain URLs (host + container) |
| `docker-compose.yml`  | How Docker runs `devshardctl`             |
| `.devshardctl/`       | Gateway database (created on first `up`)  |


All commands assume:

```bash
cd /srv/gonka/devshard-gateway
```

### 3.1 Create `docker-compose.yml`

```bash
nano docker-compose.yml
```

Gateway-only compose (no `node` or `api` services):

```yaml
services:
  devshardctl:
    container_name: ${DEVSHARD_INSTANCE_NAME:-devshardctl-multi}
    image: libermans/gonka-devshard-proxy:latest
    env_file:
      - ./config.devshard.env
    environment:
      - DEVSHARD_PORT=8080
      - DEVSHARD_STORAGE_DIR=/root/.devshardctl
    volumes:
      - ${DEVSHARD_STORAGE_HOST_DIR:-.devshardctl}:/root/.devshardctl
    ports:
      - "127.0.0.1:18080:8080"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/v1/status"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
```

- `env_file` injects chain URLs and keys into the container.
- The volume mount keeps registered escrows and admin settings across restarts.
- `127.0.0.1:18080` binds the API to localhost only; put nginx or another reverse proxy in front if remote clients need access.

### 3.2 Pull the image and start the container

Load environment variables and pull the image:

```bash
cd /srv/gonka/devshard-gateway
source config.devshard.env
sudo docker compose pull
```

Start the gateway in the background:

```bash
sudo docker compose up -d
```

Confirm the service is healthy:

```bash
sudo docker compose ps
```

Expect `devshardctl-multi` (or your `DEVSHARD_INSTANCE_NAME`) in state **running**, with health **healthy** after the start period.

### 3.3 Verify the HTTP API

```bash
curl -fsS http://127.0.0.1:18080/v1/status | jq '{runtimes, capacity: .capacity.models}'
```

A JSON response means the gateway is up. Escrows may be empty until you complete [§4](#4-create-an-escrow-and-open-api-access).

Chat completions are available at:

`http://127.0.0.1:18080/v1/chat/completions`

(or the URL your reverse proxy forwards to that port).

---

## 4. Create an escrow and open API access

**Allowlist check:** `$DEVSHARD_CREATOR` must already be allowlisted ([§2.4](#24-confirm-allowlist-membership)). Otherwise escrow create fails on chain.

The deposit in §4.1 must be **≥** on-chain `min_amount` from §2.4.

### 4.1 Create and register the escrow

The gateway admin API creates the on-chain escrow and registers it when `"register": true`. The escrow stays active until you finalize and settle it in [§6](#6-finalize-and-settle-the-escrow), unless you enable automatic rotation in [Escrow lifetime and rotation](#escrow-lifetime-and-rotation) below.

```bash
cd /srv/gonka/devshard-gateway
source config.devshard.env

CREATE_JSON=$(curl -sS -X POST http://127.0.0.1:18080/v1/admin/escrows \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"amount\": 5000000000,
    \"model_id\": \"Qwen/Qwen3-235B-A22B-Instruct-2507-FP8\",
    \"private_key\": \"$DEVSHARD_PRIVATE_KEY\",
    \"chain_id\": \"$CHAIN_ID\",
    \"register\": true
  }")
echo "$CREATE_JSON" | jq .

export ESCROW_ID=$(echo "$CREATE_JSON" | jq -r '.escrow_id')
echo "ESCROW_ID=$ESCROW_ID"
```

Keep `ESCROW_ID` in your shell for the rest of this guide. In a new session, set it again (for example `export ESCROW_ID=1`).

### 4.2 Open user API access

Models default to `admin_only` until you enable API-key access:

```bash
curl -sS -X POST http://127.0.0.1:18080/v1/admin/settings \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "default_request_max_tokens": 3072,
    "request_max_tokens_cap": 4096,
    "model_limits": [{
      "model_id": "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
      "access_mode": "api_key"
    }]
  }'
```

Confirm the escrow is loaded:

```bash
curl -fsS http://127.0.0.1:18080/v1/status | jq .
curl -fsS http://127.0.0.1:18080/v1/admin/devshards \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" | jq .
```

### Running multiple escrows (parallel pool)

One gateway process can serve **many escrows at once**. Register them at first start with `**DEVSHARDS_JSON`** in the container environment, or add more later with `**POST /v1/admin/devshards`** or `**POST /v1/admin/escrows**` (`"register": true`). Pooled `**POST /v1/chat/completions**` picks an active escrow per request—the **picker** scores runtimes by load (in-flight requests vs capacity weight) and routes to the best match for the requested model. 

`**GET /v1/status`** in pool mode lists all devshards plus limiter and capacity; with exactly one escrow it behaves like the simple proxy. Per-escrow admin calls use the `**/devshard/{id}/…`** prefix (for example `**POST /devshard/{id}/v1/finalize**`); bare `**POST /v1/finalize**` only works when a single escrow is configured. [§5](#5-send-a-test-request)–[§6](#6-finalize-and-settle-the-escrow) below use one escrow; use the pool when you need more throughput or rotation across epochs.

### Escrow lifetime and rotation

This guide’s steps in [§4.1](#41-create-and-register-the-escrow)–[§4.2](#42-open-user-api-access) and [§5](#5-send-a-test-request)–[§6](#6-finalize-and-settle-the-escrow) walk through **one manual escrow**. That is the right model for a first test. On mainnet, a gateway can also **rotate** escrows automatically across epoch boundaries so you do not run out of capacity.

#### How long does a manual escrow live?

**There is no fixed wall-clock expiry** in the gateway for a single escrow you create yourself.


| Limit              | What it means                                                                                                                                                                                                                                                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Your workflow**  | The escrow keeps serving chat until you **finalize and settle** ([§6](#6-finalize-and-settle-the-escrow)).                                                                                                                                                                                                                                             |
| **On-chain epoch** | Each escrow is tied to the chain **epoch** it was created in (`epoch_index`). That matters for protocol storage and chain rules, not a simple “expires after N hours” timer in this guide.                                                                                                                                                             |
| **Balance**        | Inference spends the escrow deposit. The gateway periodically checks active escrows (about every **30 seconds**). If usable balance drops below **1,000,000 ngonka**, it treats the escrow as depleted.                                                                                                                                                |
| **Nonce budget**   | Off-chain devshard state advances by **nonce**. The multi-escrow gateway stops routing new chat around **19,800** nonce (this limit will be set to signigicantly higher number in future). Separately, `devshard_escrow_params.max_nonce` is the on-chain settlement ceiling—query it in [§2.4](#24-confirm-allowlist-membership) (mainnet after v0.2.13: **1,000,000**). |
| **Chain caps**     | Governance sets `max_escrows_per_epoch`: the maximum number of **devshard escrows allowed chain-wide in the current epoch** (not per creator). Query the live value in [§2.4](#24-confirm-allowlist-membership). On mainnet after v0.2.13 this is **500,000**.                                                                                         |


**Default behaviour:** `escrow_rotation` is **off** until you enable it in admin settings. With rotation off, the gateway **does not** auto-create a replacement when balance or nonce is exhausted—it only logs and may stop using that escrow for new requests. Plan to **finalize and settle** before the deposit is spent, or enable rotation (below).

#### Does the gateway auto-rotate?

**Not by default.** Auto-rotation is optional and configured with `POST /v1/admin/settings` → `escrow_rotation`.

When `**escrow_rotation.enabled` is `true`**, a background task runs about every **15 seconds** and coordinates escrows with the chain’s **epoch / PoC schedule**:

1. `**pre_poc_blocks` before the next epoch switch** (measured to the upcoming `set_new_validators` boundary, not “PoC start” alone): for each configured model, create `**temp_count`** temporary “bridge” escrows, then **finalize and settle** active **regular** escrows for that model (settlement is skipped while a devshard still has in-flight requests).
2. **After the chain leaves the PoC-active window** for that transition: create `**target_count`** new **regular** escrows per model, then **finalize and settle** the **temp** escrows from the bridge window.

If temp escrow creation fails, the gateway may **promote** existing regular escrows to the temp role instead of leaving you with no bridge escrows.

When rotation is enabled, the gateway can also **replace** a depleted escrow (low balance, high nonce, or balance exhausted mid-request) by creating a new on-chain escrow and settling the old one—**only for models listed under `escrow_rotation.models`**.

**Funding and rotation:** Each epoch transition creates **new** on-chain escrows (`temp_count` bridge escrows, then `target_count` regular escrows per model) before the previous ones are finalized and settled. Every create locks another `amount` from `$DEVSHARD_CREATOR` until settlement returns the unused portion. Plan creator-wallet balance for at least `**(temp_count + target_count) × amount`** ngonka **per model, per epoch**, plus gas for create and settle transactions—and keep extra headroom, because bridge and regular escrows can overlap for a short time while rotation is in progress.

#### Enable rotation (production / always-on gateways)

Use this after you have already created, funded, and tested at least one escrow manually ([§4](#4-create-an-escrow-and-open-api-access)). Rotation needs the same `private_key_env` in the container (for example `DEVSHARD_PRIVATE_KEY`) with enough ngonka on the creator account for the deposits above, not just one escrow’s `amount`.

Example for one model (adjust counts for your capacity; production operators often run several regular escrows per model, with `**temp_count`: 1** for the epoch bridge):

```bash
source config.devshard.env

curl -sS -X POST http://127.0.0.1:18080/v1/admin/settings \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "escrow_rotation": {
      "enabled": true,
      "pre_poc_blocks": 300,
      "models": [{
        "model_id": "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
        "temp_count": 1,
        "target_count": 1,
        "amount": 5000000000,
        "private_key_env": "DEVSHARD_PRIVATE_KEY"
      }]
    }
  }'
```

Restart is not required: enabling rotation in settings starts the rotator on the running gateway.

Inspect timing and the last per-model rotation results:

```bash
curl -fsS http://127.0.0.1:18080/v1/debug/rotation \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" | jq
```

Useful fields include `chain.blocks_until_next_rotation`, `settings`, and `latest` (per-model stage, counts, and errors).

#### If rotation does not run or escrows pile up


| Symptom                        | What to check                                                                                                                                                                                                                                                                             |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nothing happens across epochs  | Confirm `"escrow_rotation": { "enabled": true, ... }` in settings and `GET /v1/debug/rotation` shows `enabled: true`.                                                                                                                                                                     |
| Creates stop after one failure | The gateway **suppresses repeat creates** for the same model, role, and epoch after a failed on-chain create (for example insufficient funds or the per-epoch escrow limit). Read `/v1/debug/rotation` and `docker logs` for `escrow_rotation_`* / `escrow_depletion_replacement_failed`. |
| Settles never finish           | Settlement waits until the devshard has **no active requests**. Drain or stop traffic before expecting rotation settle to complete.                                                                                                                                                       |
| Depletion but no replacement   | **Replacement requires rotation enabled** and a matching entry in `escrow_rotation.models`. Otherwise finalize and settle manually in [§6](#6-finalize-and-settle-the-escrow).                                                                                                            |
| Wrong epoch timing             | Rotation uses live chain phase data; ensure `DEVSHARD_PUBLIC_API` / chain REST point at your mainnet node ([§2.2](#22-create-configdevshardenv)).                                                                                                                                         |


For a **single manual test**, leave rotation **disabled**, complete [§5](#5-send-a-test-request), then [§6](#6-finalize-and-settle-the-escrow). Enable rotation when you want the gateway to keep fresh escrows across epochs without manual recreate.

---

## 5. Send a test request

The gateway endpoint is OpenAI-compatible. Set your API key and send a chat completion:

```bash
source config.devshard.env

curl -sS http://127.0.0.1:18080/v1/chat/completions \
  -H "Authorization: Bearer $DEVSHARD_API_KEYS" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
    "messages": [{"role": "user", "content": "How long do hamsters live?"}],
    "max_tokens": 32
  }' | jq '{id, content: .choices[0].message.content}'
```

In a few moments, you should see a model reply in `content`. If you receive **401** with `"requires an admin API key"`, repeat the settings POST in [§4.2](#42-open-user-api-access).

---

## 6. Finalize and settle the escrow

When you are done with inference, the gateway finalizes off-chain devshard state, then you submit settlement on-chain. Both steps need `source config.devshard.env` and a non-empty `ESCROW_ID` from [§4.1](#41-create-and-register-the-escrow).

Finalize is **per escrow** and must use the path `/devshard/{id}/v1/finalize`, not `/v1/finalize` alone.

### 6.1 Finalize off-chain state

```bash
cd /srv/gonka/devshard-gateway
source config.devshard.env

if [ -z "${ESCROW_ID:-}" ]; then
  echo "ESCROW_ID is unset — export it from §4.1 (e.g. export ESCROW_ID=2)"
  exit 1
fi
echo "Using ESCROW_ID=$ESCROW_ID"

curl -fsS http://127.0.0.1:18080/v1/admin/devshards \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" | jq .

curl -fS -X POST "http://127.0.0.1:18080/devshard/${ESCROW_ID}/v1/finalize" \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" \
  -o settlement.json

jq '{escrow_id, version, fees}' settlement.json
wc -c settlement.json
```

`-f` makes `curl` fail on HTTP errors instead of writing an empty file. A **0-byte** `settlement.json` usually means `ESCROW_ID` was empty (the request hit `/devshard//v1/finalize` and returned **404** with no body).

If finalize fails, inspect the response and gateway logs:

```bash
curl -sS -w "\nHTTP %{http_code}\n" \
  -X POST "http://127.0.0.1:18080/devshard/${ESCROW_ID}/v1/finalize" \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY"
sudo docker logs devshardctl-multi --tail 80
```

### 6.2 Settle on chain

The ngonka amount which was not used is returned to your creator address after host payouts and protocol fees.

```bash
source config.devshard.env

curl -sS -X POST "http://127.0.0.1:18080/v1/admin/devshards/${ESCROW_ID}/settle" \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"private_key_env":"DEVSHARD_PRIVATE_KEY"}'
```

### 6.3 Confirm settlement and refund

Escrow state on chain:

```bash
source config.devshard.env

inferenced query inference show-devshard-escrow "$ESCROW_ID" \
  --node "$NODE_RPC" --chain-id "$CHAIN_ID" -o json --home "$INFERENCED_HOME" \
  | jq '{id: .escrow.id, settled: .escrow.settled, creator: .escrow.creator, amount: .escrow.amount}'
```

Expect `settled: true`. The `amount` field is the original deposit metadata; live coins return to `$DEVSHARD_CREATOR` after settlement.

Creator wallet balance (main check that funds came back):

```bash
source config.devshard.env

inferenced query bank balances "$DEVSHARD_CREATOR" \
  --node "$NODE_RPC" --chain-id "$CHAIN_ID" -o json --home "$INFERENCED_HOME" \
  | jq '.balances[] | select(.denom=="ngonka") | {denom, amount}'
```

After settlement, most of the unused deposit should return to `$DEVSHARD_CREATOR`, minus inference cost, settlement fees, and transaction gas.

---

## 7. Pause, redirect, and stop the gateway

Sections [§1](#1-install-tools-and-create-a-deploy-directory)–[§6](#6-finalize-and-settle-the-escrow) cover a single test escrow. This section is for pausing routing, redirecting clients when asked, or shutting down the host.

### 7.1 Deactivate one escrow

After you settle in [§6](#6-finalize-and-settle-the-escrow), the escrow record remains on chain; **deactivate** only stops this gateway from routing new chat to that escrow locally. Other escrows in the pool keep serving if they are still active.

```bash
source config.devshard.env

curl -sS -X POST "http://127.0.0.1:18080/v1/admin/devshards/${ESCROW_ID}/deactivate" \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY"
```

### 7.2 Redirect all client traffic (gateway kill-switch)

To tell API clients to stop using this gateway URL while you keep admin access (finalize, settings, import, debug), enable the gateway **disabled** state. Non-admin requests (for example pooled `/v1/chat/completions`) receive **HTTP 308** with JSON `status`, `message`, and `new_url`. Admin routes (`/v1/admin/`*, `/v1/debug/*`, per-escrow finalize under `/devshard/{id}/…`) still work with the admin API key.

```bash
source config.devshard.env

curl -sS -X POST http://127.0.0.1:18080/v1/admin/settings \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "disabled": {
      "enabled": true,
      "message": "This gateway is retired; use the new base URL.",
      "new_url": "https://your-new-host.example/v1/chat/completions"
    }
  }'
```

To resume normal service, POST again with `"enabled": false`. On **first** gateway start only, the same flags can be bootstrapped from `DEVSHARD_GATEWAY_DISABLED`, `DEVSHARD_GATEWAY_DISABLED_MESSAGE`, and `DEVSHARD_GATEWAY_DISABLED_NEW_URL` in `config.devshard.env` (see the gateway env template in the [gonka](https://github.com/gonka-ai/gonka) repo). After `gateway.db` exists, use `**POST /v1/admin/settings`**.

### 7.3 Stop the container and optional cleanup

Optional — remove the local gateway record (run while the container is still up, after settle):

```bash
source config.devshard.env

curl -sS -X DELETE "http://127.0.0.1:18080/v1/admin/devshards/${ESCROW_ID}" \
  -H "Authorization: Bearer $DEVSHARD_ADMIN_API_KEY"
```

Stop Docker:

```bash
cd /srv/gonka/devshard-gateway
sudo docker compose down

# Optional: remove persisted gateway state
# sudo rm -rf .devshardctl
```

---

## 8. Update the gateway without dropping traffic (hot-swap)

Replacing the gateway **image** or recreating the main container would drop in-flight `/v1/chat/completions` streams if you restarted it in place. Production operators use a **two-container** pattern: run a **temporary** gateway alongside the main one, move public traffic with an **nginx alias** and graceful `nginx -s reload`, **drain** `active_requests` on the old instance, update the main container, switch traffic back, then **import** temp escrow state into the main gateway.

**What the gateway provides**:

- Second `devshardctl` process (often port **18081**) with `DEVSHARDS_JSON=[]` so it does not load main escrows at boot.
- `POST /v1/admin/escrows` on the temp instance to fund temp bridge escrows.
- `GET /v1/status` (or admin state) to confirm `**active_requests`** is zero before stopping an instance.
- `POST /v1/admin/devshards/import` on main with `active: false`, then register/activate on main so temp escrows survive the cutover.
- Public routing via reverse proxy upstream name change (not a full proxy container restart for chat).

**The Step-by-step playbook** is being prepared at the moment.

---

## Related

- [Developer Quickstart](quickstart.md) — community brokers and [Become a broker](quickstart.md#3-become-a-broker)

**Need help?** See the [FAQ](https://gonka.ai/FAQ/), join [Discord](https://discord.com/invite/RADwCT2U6R), or open a [broker / allowlist request](https://github.com/gonka-ai/gonka/issues/new?title=Request+to+be+added+as+a+Gonka+broker) on GitHub.