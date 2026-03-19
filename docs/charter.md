# Charter

## Mission

Systematically explore how OpenAI API parameters affect output quality, cost, and reliability — and document the results in a public, reproducible way.

## Parameters in Scope

| Parameter | Range | Notes |
|---|---|---|
| `temperature` | 0.0–2.0 | Primary lever for randomness |
| `top_p` | 0.0–1.0 | Nucleus sampling; interacts with temperature |
| `presence_penalty` | -2.0–2.0 | Penalizes tokens that have appeared |
| `frequency_penalty` | -2.0–2.0 | Penalizes tokens by frequency |
| `max_tokens` | 1–model max | Output length cap |
| `stop` | string/array | Early stopping signals |
| `seed` | integer | Reproducibility (where supported) |
| `logit_bias` | map | Direct token probability manipulation |

## Tasks in Scope

- Creative writing (short-form)
- Code generation (small functions)
- Summarization
- Classification (zero-shot)
- Chain-of-thought reasoning
- JSON extraction

## What "Golf" Means

Finding the **smallest, most precise** parameter configuration that reliably achieves a target output behavior. Lower score = simpler, more reproducible, cheaper configuration.

## Metrics

- Output quality (task-specific rubric)
- Variance across N runs (lower = better for deterministic tasks)
- Token cost
- Latency (p50, p95)
