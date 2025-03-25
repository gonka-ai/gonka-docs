# Supported LLMs and recommended server configurations

In our network, we aim to support open-source LLMs that rank highly on Chat Arena. As of March 2025, this includes:

- `DeepSeek-R1`
- `DeepSeek-V3`
- `Gemma-3-27B`
- `QwQ-32B`
- `Llama-3-70B`
- `Llama-3-405B`

## Inference requirements

Each ML node should be equipped with one or more GPUs that have enough VRAM to run inference independently. Below are the recommended configurations per model size:

- **80GB+ VRAM** for:
  - `Gemma-3-27B`
  - `QwQ-32B`

- **160GB+ VRAM** for:
  - `Llama-3-70B`

- **640GB+ VRAM** for:
  - `DeepSeek-R1`
  - `DeepSeek-V3`
  - `Llama-3-405B`

## Example server configurations

| Model         | 8×H100 | 8×A100 | 2×H100 | 2×A100 | 1×H100* | 1×A100* | 8×3090 | 4×3090 | 1×3090** |
|---------------|--------|--------|--------|--------|---------|---------|--------|--------|-----------|
| DeepSeek-R1   | ✅     | ✅     | ✅     | ✅     | ✅      | ✅      | ✅     | ✅     | ✅         |
| DeepSeek-V3   | ✅     | ✅     | ✅     | ✅     | ✅      | ✅      | ✅     | ✅     | ✅         |
| Gemma-3-27B   |        |        |       |       | ✅      | ✅      | ✅     | ✅     | ✅         |
| QwQ-32B       |        |        |       |       | ✅      | ✅      | ✅     | ✅     | ✅         |
| Llama-3-70B   |        |        | ✅     | ✅     | ✅       | ✅       | ✅      | ✅     | ✅         |
| Llama-3-405B  | ✅     | ✅     | ✅     | ✅     | ✅      | ✅      | ✅     | ✅     | ✅         |
| Qwen-7B       |        |        |        |        |         |         |        |        | ✅         |

* If you have multiple H100 or A100 GPUs, consider grouping 2 or 8 of them into a single node to support higher-demand models.
** If you have multiple 3090 GPUs, consider grouping 4 or 8 of them into a single node for better performance.
