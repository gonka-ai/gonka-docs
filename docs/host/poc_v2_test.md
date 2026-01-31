# PoC v2 Generation Test Guide

## Overview

This script validates your MLNode PoC v2 setup for the `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` model by running through multiple test phases:

- **Phase 0: Setup Check** (~5 seconds) — Verifies configuration (container, ports, network connectivity)
- **Phase 1: Generation + Validation** (~40 seconds) — Generates PoC v2 artifacts and validates them (self-test)
- **Phase 2: Fraud Detection** (~30 seconds) — Tests pre-collected honest/fraud vectors to verify fraud detection works
- **Phase 3: Batch Sizing** (~3.5 minutes) — Benchmarks different batch sizes to find optimal performance for your hardware

**Total duration: ~5 minutes** (if the model is already loaded). If the model needs to start, add several minutes for vLLM initialization.

---

## Requirements

Complete the MLNode setup before running this test:
**[How to switch to Qwen/Qwen3-235B-A22B-Instruct-2507-FP8](https://gonka.ai/FAQ/#how-to-switch-to-qwenqwen3-235b-a22b-instruct-2507-fp8-upgrade-ml-nodes-and-remove-other-models)**

This includes:
- MLNode image upgraded to `3.0.12` (or `3.0.12-blackwell` for Blackwell GPUs)
- Model `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` downloaded and configured
- Other models removed from configuration

---

## Quick Start

Navigate to the deployment directory where your MLNode docker-compose files are located:

```bash
cd gonka/deploy/join
```

Download the test script:

```bash
curl -sLO https://raw.githubusercontent.com/gonka-ai/gonka/tg/poc_v2_test/mlnode/packages/benchmarks/scripts/run_pow_generation.py
```

Run the test:

```bash
python3 run_pow_generation.py
```

### Additional Options

Run only the setup check (recommended before first full run):

```bash
python3 run_pow_generation.py --phase 0
```

Run only fraud detection test (fastest, no batch receiver needed):

```bash
python3 run_pow_generation.py --phase 2
```

Skip setup verification (not recommended):

```bash
python3 run_pow_generation.py --skip-check
```

### Cleanup

After the test completes successfully, you can delete the script — it's not needed for normal MLNode operation:

```bash
rm run_pow_generation.py
```

---

## Expected Results

A successful run will show output similar to:

**Phase 1 (Generation)** — You should see nonces being generated with a throughput measurement:
```
Generation completed:
  Total nonces: 150
  Duration: 30.0s
  Speed: 300 nonces/min
```

**Phase 2 (Fraud Detection)** — Both tests should pass:
```
  Honest vectors:  ✓ PASS
  Fraud detection: ✓ PASS
```

**Phase 3 (Batch Sizing)** — Shows performance for different batch sizes with the best one marked:
```
    Batch │   Nonces │   Nonces/min
  ────────┼──────────┼─────────────
        8 │      120 │          240
       16 │      180 │          360  ★
       32 │      150 │          300
```

### Key Metrics

- **Nonces/min**: Higher is better. This indicates your node's PoC v2 generation throughput.
- **Fraud detected: False** on honest vectors means validation is working correctly.
- **Fraud detected: True** on fraud vectors means the fraud detection system is working.

If Phase 2 shows `✗ FAIL` for either test, your MLNode configuration may have issues — verify the model is correctly loaded.

---

## Applying Results: Configuring Batch Size

If Phase 3 shows a batch size other than 32 as optimal (marked with ★), you can configure your MLNode to use it permanently.

Edit your `docker-compose.mlnode.yml` and add the `POC_BATCH_SIZE_DEFAULT` environment variable:

```yaml
environment:
  - VLLM_ATTENTION_BACKEND=FLASHINFER
  - POC_BATCH_SIZE_DEFAULT=16   # Change to your optimal value
```

The default is `32`. After changing, restart your MLNode:

```bash
docker compose -f docker-compose.mlnode.yml down
docker compose -f docker-compose.mlnode.yml up -d
```

---

## Troubleshooting

### Stopping generation

If the script hangs or you need to stop the test:

```bash
curl -X POST http://localhost:8080/api/v1/inference/pow/stop -H "Content-Type: application/json" -d '{}'
```

### OOM (Out of Memory) / Container restart

If the script crashes with OOM errors or you see timeout errors like:
```
TimeoutError: PoC v2 request 'generate_artifacts' timed out after 10000ms. Engine may be wedged.
```

The vLLM engine is in a broken state. It may report as "running" but cannot process requests.

**OOM is typically caused by batch size being too large for your GPU memory.** Reduce batch sizes in the script configuration or run `--phase 3` to find the optimal batch size for your hardware.

**Solution — Restart the container:**

```bash
# Restart the container
docker restart <container_name>

# Wait for it to come back up
sleep 10

# Check health
curl http://localhost:8080/health

# Wait for vLLM to reload (several minutes for large models)
watch -n 5 'curl -s http://localhost:8080/api/v1/inference/up/status'
```

Once `is_running` shows `true`, wait another 1-2 minutes, then run the test again.

---

## Quick Commands

```bash
# Download script
curl -sLO https://raw.githubusercontent.com/gonka-ai/gonka/tg/poc_v2_test/mlnode/packages/benchmarks/scripts/run_pow_generation.py

# Run all phases
python3 run_pow_generation.py

# Run specific phase only
python3 run_pow_generation.py --phase 0   # Setup check
python3 run_pow_generation.py --phase 2   # Fraud detection only

# Stop any running generation
curl -X POST http://localhost:8080/api/v1/inference/pow/stop -H "Content-Type: application/json" -d '{}'

# Restart container
docker restart <container_name>

# Check if vLLM is running
curl http://localhost:8080/api/v1/inference/up/status

# Check MLNode health
curl http://localhost:8080/health

# Find your container name
docker compose -f docker-compose.mlnode.yml ps --format '{{.Names}}'

# View container logs
docker logs <container_name> -f
```
