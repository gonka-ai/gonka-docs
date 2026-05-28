# Validate ML Node Deployment

The [`gonka` repo](https://github.com/gonka-ai/gonka) ships an agent skill called `mlnode-validate` that validates a deployed ML Node against pre-computed honest PoC vectors for a specific model. The skill is self-contained inside the repo (no external code, no callback receiver).

The skill is the contract; this page is a pointer. The single source of truth is [`skills/mlnode-validate/SKILL.md`](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md) — required / optional inputs, deploy-config rules, golden-reference list, pass criteria, failure modes, and the report template.

The skill is implemented by two Python scripts under `mlnode/packages/benchmarks/scripts/poc_validation/`:

- `validate.py` — the main entry point (download → deploy → throughput → validate).
- `make_artifact.py` — bakes a new artifact from a trusted MLNode that already serves the target model. Used when no committed golden reference exists for the requested model.

## What the script does

`validate.py` runs four phases against a running ML Node, printing `[i/4]` headers as it progresses:

1. **`[1/4] download`** — ensures the requested HuggingFace repo is cached on the ML Node. Uses `POST /api/v1/models/status`, then `POST /api/v1/models/download` and polls `/models/status` until `DOWNLOADED`.
2. **`[2/4] deploy`** — starts vLLM if it is not already running. `POST /api/v1/inference/up/async {model, dtype, additional_args}`, polls `GET /api/v1/inference/up/status` until `is_running == true`.
3. **`[3/4] throughput`** — measures full-system PoC throughput. `POST /api/v1/inference/pow/init/generate` (params from the reference); the proxy fans out to every healthy vLLM replica with a different `group_id`. Samples `GET /api/v1/inference/pow/status` every `--sample-interval` for `--measure-seconds`. Reports per-replica `nonces_per_second` and the sum across replicas, then `POST /api/v1/inference/pow/stop`.
4. **`[4/4] validate`** — `POST /api/v1/inference/pow/generate` with `wait=true`, `nonces=[...]`, `validation.artifacts=<artifact>`, and the full `stat_test` block (`dist_threshold`, `p_mismatch`, `fraud_threshold`). The MLNode recomputes the same nonces, runs the L2 per-nonce mismatch test, then the binomial fraud test. Returns `{n_total, n_mismatch, mismatch_nonces, p_value, fraud_detected}`.

Each phase can be skipped via `--skip-download`, `--skip-deploy`, `--skip-throughput`, `--skip-validate`.

After the four phases, the script writes three files into `mlnode/packages/benchmarks/data/experiments/<exp_name>_<ts>/`:

- `validate_config.json` — resolved inputs only (MLNode URL, model, reference path + meta, deploy config, PoC params, `stat_test` with provenance, raw CLI args).
- `validate_report.json` — full structured report (config + per-phase results + verdict). This is the audit trail.
- `validate_report.txt` — short human-readable summary; first line after the banner is `verdict: <PASS|FAIL|...>`.

## Required inputs

Per [SKILL.md → Required inputs](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#required-inputs), the caller MUST supply both:

- `MLNODE_URL` — base URL of the MLNode under test (e.g. `http://1.2.3.4:8080`). No default.
- `MODEL` — target HuggingFace model id in full `org/repo` form (e.g. `MiniMaxAI/MiniMax-M2.7`, `moonshotai/Kimi-K2.6`, `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`). No default.

## Deploy config: from the caller, not the golden

This is a load-bearing rule from [SKILL.md → Deploy config: from the caller, not the golden](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#deploy-config-from-the-caller-not-the-golden):

The golden artifact supplies **vectors, PoC params, and `stat_test`** — nothing else. Its `additional_args` field records which flags were used on the server that generated the vectors and is **FYI only**. It must not be used as a deploy default on a different server.

The caller passes a deploy config (typically `deploy/join/node-config-<model>-<gpu>.json`) matching the GPU class of the server under test. The standard flow is to **bake a custom reference** combining the golden's vectors + params + `stat_test` with the caller's `args`, then pass it via `--reference`:

```python
import json, pathlib
src = pathlib.Path('mlnode/packages/benchmarks/scripts/poc_validation/artifacts/<golden>.json')
node_cfg = json.loads(pathlib.Path('deploy/join/node-config-<model>-<gpu>.json').read_text())

d = json.loads(src.read_text())
d['additional_args'] = list(node_cfg[0]['models']['<HF model id>']['args'])
d['source'] = f"vectors from {src.name}; additional_args from deploy/join/node-config-<model>-<gpu>.json"
dst = src.with_name(src.stem + '-<gpu>.json')
dst.write_text(json.dumps(d, indent=2))
```

```bash
python3 mlnode/packages/benchmarks/scripts/poc_validation/validate.py \
    --mlnode-url "$MLNODE_URL" --model "$MODEL" --reference <dst>
```

The custom reference is per-deployment and not committed. The golden reference can be passed directly (without baking) only when the server under test is the same hardware class as the golden's recording server — that is the exception, not the default.

The CLI flags `--tp-size`, `--max-model-len`, `--extra-arg`, `--dtype` exist for small one-off tweaks on top of a reference, but they cannot remove flags the reference already carries — so they are not a substitute for baking a custom reference when the deployment shape differs from the golden's.

## Available golden references

Per [SKILL.md → Available golden references](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#available-golden-references), the repo ships these under `mlnode/packages/benchmarks/scripts/poc_validation/artifacts/`. The auto-lookup `<sanitized model>.json` picks the default filename per model; variants beyond the default require an explicit `--reference <path>`.

The "Recording context" column describes the server that generated the vectors (FYI only — these flags are NOT a deploy default for your validation; see [Deploy config: from the caller, not the golden](#deploy-config-from-the-caller-not-the-golden) above).

| Model | Filename | Vectors | Recording context |
|-------|----------|---------|-------------------|
| `Qwen/Qwen3-0.6B` | `qwen-qwen3-0.6b.json` | 32 | local dev / single GPU |
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` (default lookup) | `qwen-qwen3-235b-a22b-instruct-2507-fp8.json` | 32 | tp=4, FlashInfer baseline. Quick smoke test. |
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` (extended) | `qwen-qwen3-235b-a22b-instruct-2507-fp8-deepgemm.json` | 2000 | tp=2, DeepGEMM MoE backend (`VLLM_USE_DEEP_GEMM=1`, `VLLM_MOE_USE_DEEP_GEMM=1`), recorded on 4xB200. Pass with `--reference`. |
| `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` (pubkey-v2) | `qwen-qwen3-235b-a22b-instruct-2507-fp8-h200-pubkey-v2.json` | 200 | tp=4, recorded on 4xH200 with `public_key=test_pub_keys_v2`. Pass with `--reference`. |
| `MiniMaxAI/MiniMax-M2.7` (default lookup) | `minimaxai-minimax-m2.7.json` | 200 | tp=2, FLASHINFER attention, fp8 kv-cache, max-model-len 180000, `--trust-remote-code`, minimax_m2 tool/reasoning parsers. Recorded on 2xH200. |
| `moonshotai/Kimi-K2.6` (default lookup) | `moonshotai-kimi-k2.6.json` | 200 | tp=4 + expert-parallel, FLASHINFER_MLA attention, gpu-mem 0.95, max-model-len 240000, kimi_k2 tool/reasoning parsers, `--disable-custom-all-reduce`, `--trust-remote-code`. Recorded on 4xB200. |

For Qwen3-235B the same model id has multiple references, exercising different code paths (tp-size, MoE backend, public_key) — see SKILL.md for the recommended multi-run pattern.

## Ready-made deploy configs in `deploy/join/`

The repo ships `node-config-*.json` files matching common GPU classes for each approved model:

- `deploy/join/node-config-qwen235B-B200.json`
- `deploy/join/node-config-kimik26-B200.json`
- `deploy/join/node-config-kimik26-H200.json`
- `deploy/join/node-config-minimax-A100.json`
- `deploy/join/node-config-minimax-H100.json`
- `deploy/join/node-config-minimax-H200.json`
- `deploy/join/node-config-minimax-B200.json`

These configs are also reproduced inline in the [Host Quickstart](./quickstart.md).

## Pass criteria

Per [SKILL.md → Pass criteria](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#pass-criteria):

- **Clean PASS** — `validation.passed == true`, `validation.has_mismatches == false`, `n_mismatch == 0`, `fraud_detected == false`.
- **PASS with mismatches within stat-test tolerance** — `validation.passed == true`, `validation.has_mismatches == true`, `n_mismatch > 0`, `fraud_detected == false`. The fraud test allows up to a few mismatches per `p_mismatch`. This is still a PASS.
- **FAIL** — `validation.passed == false`, `fraud_detected == true`.

Exit codes:

- `0` — PASS (with or without mismatches inside tolerance), or the validate phase was skipped.
- `2` — validation ran and the fraud test fired.
- `1` — hard error before validation could run (download failed, deploy timed out, etc.).

## When no artifact exists for the requested model

`validate.py` looks up the artifact under `mlnode/packages/benchmarks/scripts/poc_validation/artifacts/`. If the file for `MODEL` is missing, the script exits `1` and prints the expected filename plus the exact `make_artifact.py` command to bake one against a trusted MLNode that already serves the model. The agent must not invent vectors or substitute a different model — see [SKILL.md → When no artifact exists for the requested model](https://github.com/gonka-ai/gonka/blob/main/skills/mlnode-validate/SKILL.md#when-no-artifact-exists-for-the-requested-model).

## Related guides

- [Host Quickstart](./quickstart.md) — initial deploy and `node-config.json` examples for every supported model and GPU class.
- [ML Node Management](./mlnode-management.md) — adding / updating / enabling / disabling ML Nodes via the Admin API.
- [Benchmark to Choose Optimal Deployment Config for LLMs](./benchmark-to-choose-optimal-deployment-config-for-llms.md) — performance tuning (TP / PP) via `compressa-perf`.
- [Kimi K2.6 Bootstrap](./kimi-bootstrap.md) / [MiniMax-M2.7 Bootstrap](./minimax-bootstrap.md) — on-chain bootstrap timelines and `PoCIntent` / delegation transactions.
