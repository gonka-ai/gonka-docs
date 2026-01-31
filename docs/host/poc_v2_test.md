# PoC v2 Generation Test Guide

## Overview

This script validates your MLNode PoC v2 setup by running through multiple test phases:

- **Phase 0: Setup Check** — Verifies configuration (container, ports, network connectivity)
- **Phase 1: Generation + Validation** — Generates PoC v2 artifacts and validates them (self-test)
- **Phase 2: Fraud Detection** — Tests pre-collected honest/fraud vectors to verify fraud detection works
- **Phase 3: Batch Sizing** — Benchmarks different batch sizes to find optimal performance for your hardware

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
curl -sLO https://gist.githubusercontent.com/tamazgadaev/5e3709e617c4961128fc70bc23e1a752/raw/run_pow_generation.py
```

Run the test:

```bash
python3 run_pow_generation.py
```

For Qwen 32B model, add the `--model` flag:

```bash
python3 run_pow_generation.py --model qwen32b
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
curl -sLO https://gist.githubusercontent.com/tamazgadaev/5e3709e617c4961128fc70bc23e1a752/raw/run_pow_generation.py

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
