# Inference–Validation Distance Threshold: How to Compute

This guide explains how to compute the inference validation distance threshold that is used to differentiate honest inference from potential fraud (e.g., running a lighter/quantized model). It has two phases:

- Phase 1: Run the inference–validation cycle and collect JSONL outputs
- Phase 2: Analyze the outputs and estimate the decision threshold(s)


## Conceptual overview

To detect potential model substitution, we compare how closely a validator follows the generator’s token-by-token probability landscape. In each inference–validation cycle, one MLNode (the generator) produces a response with an inference model, and another MLNode (the validator) is forced to follow that exact token path while returning per-token top‑k logprobs. From these paired logprobs we compute a normalized distance (see `validation.utils.distance2`) that is small when the validator mirrors the generator and larger when it does not. 

In this threshold computation method, validator is assumed to always have a full (honest) model and generator can have either honest or fraud (quantized int4 against fp8) model. 


A robust threshold requires two inference-validation cycles:

1. An honest cycle (A→A) establishes the distribution of distances we expect under correct behavior.
2. A dishonest cycle (A′→A), where A′ is a lighter/quantized version of A, shows distances when a participant attempts to cheat. 

Using these two empirical distributions, the analysis chooses acceptance bounds that keep honest distances below a lower cutoff and maximize separation from dishonest ones.

You need at least two MLNodes, but you may use more. For example, you might run the honest cycle on s1→s2 and the dishonest cycle on s2→s3. 

Servers are preferred to be on different physical machines to model realistic cross‑system noise; conversely, keeping hardware similar for the dishonest pair helps isolate the effect of model substitution itself. 

Each prompt’s pair of results is saved to JSONL and later consumed by the analysis notebook to compute distances, visualize distributions, and report the final threshold(s).


## Prerequisites

- Python 3.10
- Project deps installed (from the `mlnode/packages/benchmarks` folder):
    - Using Poetry: `poetry install`
    - Or ensure `pyproject.toml` dependencies are available in your environment
- At least two running MLNodes that expose:
    - Node control API: `http://<ip>:<node_port>/api/v1/inference/up` (used to deploy models)
    - Inference API: `http://<ip>:<inference_port>/v1/...` (OpenAI-compatible endpoints)
    - Prefer different physical machines to capture realistic noise effects


## Phase 1 — Inference–Validation Cycle

During this phase, we deploy two models and run paired requests: generate with model A OR A′ (quantized/smaller, simulating fraud) on server s1, then validate the exact same output with model A (honest) on server s2. 

The validator is forced to follow the token path of the generator; we then record token-level logprobs from both sides to later compute distances.

You will use:

- Script: `benchmarks/scripts/run_inference_validation.py`
- Config: `benchmarks/resources/inference_validation.yml`


### 1. Deploy MLNodes on two servers

Ensure s1 and s2 MLNodes are running and reachable from where you will execute the script. You need each server’s `ip`, `node_port`, and `inference_port`.

### 2. Configure the YAML

Edit `benchmarks/resources/inference_validation.yml`. It has four sections:

- `models`: named presets of model deployments (name, precision, dtype, and optional vLLM args). 
    - It is importnat to keep track which model deployment parameters influence inference output and which doesn't. For example, `--tensor-parallel-size` is importnat to set up for large models which doesn't git into one GPU, although it doesn't change the inference results.
    - `precision` parameter doesn't influence model deployment, used only for resulting jsons naming.
- `servers`: addresses and GPU labels for available servers.
    - `node_port` is MLNode control port, usually tied to `8080`
    - `inference_port` is vLLM API port, usually tied to `5000`. 
    - GPU labels are arbitrary strings used for clear naming only.   
- `settings`: the list of inference–validation pairs to run
  - Each entry selects `inference_model`, `validation_model`, `server_1`, and `server_2`.
- `run`: execution parameters and request sampling settings
    - `exp_name`: tag appended to output filenames for grouping runs.
    - `output_path`: directory for JSONL outputs; created if missing.
    - `batch_size`: number of prompts processed per batch.
    - `n_prompts`: total number of prompts to process from the dataset.
    - `timeout`: HTTP timeout (seconds) for model deployment requests; increase for large models.
    - `tokenizer_model_name`: tokenizer to use when preparing prompts; keep default unless needed.
    - `request`: OpenAI-compatible generation parameters.
        - `max_tokens`: maximum new tokens to generate per request.
        - `temperature`: sampling temperature.
        - `seed`: random seed for reproducibility.
        - `top_logprobs`: number of top tokens’ logprobs to record per position.

Example (abridged):

```yaml
models:
  qwen25_7B_fp8:
    model: "RedHatAI/Qwen2.5-7B-Instruct-quantized.w8a16"
    precision: "fp8"
    dtype: "float16"
    additional_args: []
  qwen25_7B_int4:
    model: "Qwen/Qwen2.5-7B-Instruct-AWQ"
    precision: "int4"
    dtype: "float16"
    additional_args: []

servers:
  server_1_H100:
    ip: "<ip1>"
    node_port: "<node_port1>"
    inference_port: "<inference_port1>"
    gpu: "1xH100"
  server_2_4x3090:
    ip: "<ip2>"
    node_port: "<node_port2>"
    inference_port: "<inference_port2>"
    gpu: "4x3090"

settings:
  - inference_model: qwen25_7B_fp8
    validation_model: qwen25_7B_fp8   # honest pair
    server_1: server_1_H100
    server_2: server_2_4x3090
  - inference_model: qwen25_7B_int4
    validation_model: qwen25_7B_fp8   # quantized vs base (fraud simulation)
    server_1: server_1_H100
    server_2: server_2_4x3090

run:
  exp_name: "exp1"
  output_path: "../data/inference_results"
  batch_size: 500
  n_prompts: 1000
  timeout: 600
  tokenizer_model_name: "unsloth/llama-3-8b-Instruct"
  request:
    max_tokens: 3000
    temperature: 0.7
    seed: 42
    top_logprobs: 4
```

Notes:

- `additional_args` maps to vLLM CLI args (e.g., `--tensor-parallel-size`, `--pipeline-parallel-size`).
- `settings` drive which pairs will be executed; add as many scenarios as needed.
- Increase `timeout` for large models.

### 3. Run the script

Run from the `benchmarks/scripts` directory so relative imports resolve correctly:

```bash
cd mlnode/packages/benchmarks/scripts
python run_inference_validation.py
```

The script:

- Calls `POST /api/v1/inference/up` on each server to deploy the configured models
- Waits briefly for readiness
- Iterates through `n_prompts` number of prompts of Alpaca dataset, generating on s1 and validating on s2 with enforced token paths.

### 4. Collect outputs

Outputs are written as JSONL files in `run.output_path/`. The filename pattern is:

```
<inference_model>-<precision>-<gpu>___<validation_model>-<precision>-<gpu>__<exp_name>.jsonl
```

Each line is a `ValidationItem` with:

- `prompt`
- `inference_result`: generated text and per-token top-k logprobs
- `validation_result`: validator’s per-token top-k logprobs on the enforced path
- `inference_model` / `validation_model`: name, URL, deploy params
- `request_params`: max tokens, temperature, seed, top_logprobs

These JSONL files are the only inputs needed for threshold analysis.


## Phase 2 — Analysis and Threshold Estimation

Use the notebook `benchmarks/notebooks/analysis_and_threshold_estimation.ipynb` to compute the threshold(s) from the JSONL outputs produced in Phase 1.

### Steps

1. Launch the notebook
   Open `benchmarks/notebooks/analysis_and_threshold_estimation.ipynb` in your environment.
2. Set data paths and comparisons
   In the first configuration cell, define the JSONL paths and which pairs to compare. Example:
```python
DATA_PATHS = {
    'honest_qwen2.5_7': '../data/inference_results/Qwen2.5-7B-Instruct-quantized.w8a16-fp8-1xH100___Qwen2.5-7B-Instruct-quantized.w8a16-fp8-4x3090__script_test.jsonl',
    'fraud_qwen2.5_7':  '../data/inference_results/Qwen2.5-7B-Instruct-AWQ-int4-1xH100___Qwen2.5-7B-Instruct-quantized.w8a16-fp8-1xH100__script_test.jsonl',
}

comparisons = [
    ('qwen2.5-7', {
        'honest': DATA_PATHS['honest_qwen2.5_7'],
        'fraud':  DATA_PATHS['fraud_qwen2.5_7'],
    })
]
```
Add as many entries to `DATA_PATHS` and `comparisons` as needed. Each comparison must include one honest JSONL and one fraud JSONL.

3. Run the notebook cells
   Execute cells top-to-bottom. The notebook will load items, compute distances, fit distributions, and search bounds using both honest and fraud distances for each comparison.
4. Read the plots and thresholds: 
    - Distribution plots: show the empirical distances and fitted curves; honest should cluster lower than fraud.
    - Scatter/diagnostic plots: distances vs. number of tokens, and optionally matches ratios.
    - Classification plot: shows per-item distances with horizontal dashed lines for the selected lower/upper bounds.
    - Threshold values: the chosen bounds are printed in the cell output (e.g., “Optimal Lower Bound: …”, “Optimal Upper Bound: …”) and drawn on the plots. Use these values as your acceptance threshold(s).
