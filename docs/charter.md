# Charter

## Mission

Win (or compete seriously in) the **OpenAI Parameter Golf Challenge** by
systematically researching the optimal architecture, training recipe, and
quantization strategy for a model that fits within 16 MB of weights and trains
within 10 minutes on 8×H100 GPUs.

This repo coordinates the research. Actual training happens on appropriate
hardware, not here.

## The Challenge Constraints

| Constraint | Value | Notes |
|---|---|---|
| **Artifact size** | ≤ 16 MB | Final model weights as submitted |
| **Compute budget** | ≤ 10 min on 8×H100 | ~80 TFLOP/s × 600 s × 8 = ~384 PFLOP |
| **Evaluation** | Public benchmark(s) | Score-maximizing within constraints |

## Research Areas in Scope

| Area | Key Questions |
|---|---|
| **Architecture** | Transformer vs SSM vs hybrid? Depth vs width trade-off? |
| **Parameter budget** | How many params fit in 16 MB at FP16/BF16/INT8? |
| **Tokenizer** | BPE vocab size trade-off: smaller vocab = smaller embedding table |
| **Training recipe** | Learning rate schedule, batch size, gradient clipping for short runs |
| **Data mixture** | What data trains fastest per quality point in 10 min? |
| **Quantization** | INT8 post-training quantization to halve artifact size |
| **Distillation** | Distill from larger model to fit quality into tiny artifact |

## What "Golf" Means Here

Minimum artifact size and minimum compute to achieve maximum benchmark score.
The lower the score (in golf terms), the better: fewer parameters, better
result.

## Metrics

- **Benchmark score** — task-specific (e.g. perplexity, accuracy, BLEU)
- **Artifact size** — must stay ≤ 16 MB
- **Train time** — must stay ≤ 10 min on 8×H100
- **Estimated params** — calculated from architecture, used to predict size
  before training
