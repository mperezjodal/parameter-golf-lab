# Glossary

**Parameter Golf** — the OpenAI challenge: train the highest-scoring model
possible within a 16 MB artifact budget and 10-minute compute window on 8×H100
GPUs. "Golf" = fewer parameters, better score.

**Artifact size** — the size of the final submitted model weights on disk.
At FP32, 1M parameters ≈ 4 MB. At FP16/BF16, ≈ 2 MB. At INT8, ≈ 1 MB.

**Parameter budget** — the maximum number of model parameters that fit in 16 MB
at a given precision. Example: 16 MB / 2 bytes = 8M params at FP16.

**Architecture** — the structural design of the model: number of layers, hidden
dimension, number of attention heads, MLP expansion ratio, etc.

**Transformer** — attention-based sequence model; the dominant architecture for
language modeling. Scales predictably but may be suboptimal at very small sizes.

**SSM (State Space Model)** — alternative to transformers (e.g., Mamba, S4).
May be more parameter-efficient at small scale. Worth benchmarking.

**Quantization** — reducing weight numerical precision (e.g., FP32→INT8) to
shrink artifact size without retraining. Can halve or quarter artifact size.

**Distillation** — training a small model to mimic the outputs of a larger
teacher model. Can improve quality within a fixed parameter budget.

**BPE (Byte-Pair Encoding)** — common tokenization algorithm. Larger vocab =
larger embedding table = more artifact bytes consumed on vocabulary alone.

**Perplexity** — primary language model quality metric. Lower = better. Measures
how surprised the model is by held-out text.

**TFLOP/s** — teraFLOPs per second. Used to estimate training throughput and
check whether experiments fit within the 10-minute compute budget.

**Symphony** — working name for the research coordination layer. See `SYMPHONY.md`.

**Backlog** — unstarted cards in the Kanban board (`board/backlog.json`).

**Result card** — a `findings.md` file produced after each completed experiment.
Describes what was tried, what was learned, and what to try next.

**Hypothesis** — a falsifiable claim about the architecture or training space.
Tracked in `/ideas/index.md` until promoted to a full experiment.
