# Architecture Sizing: 16 MB Parameter Budget

**Status:** First pass — 2026-03-19
**Purpose:** Guide model family selection with hard budget math, not just a raw table.

---

## 1. Hard ceiling by precision format

16 MB = 16,777,216 bytes (assuming the limit is on-disk bytes of model weights).

| Format | Bytes/param | Max params at 16 MB |
|--------|-------------|----------------------|
| FP32   | 4           | ~4.2M                |
| FP16   | 2           | ~8.4M                |
| BF16   | 2           | ~8.4M                |
| INT8   | 1           | ~16.8M               |
| INT4   | 0.5         | ~33.6M               |

**Key uncertainty:** The challenge rules may count only raw weight bytes, or they may
include the model config, tokenizer, and metadata files. Until confirmed, assume the
limit covers *everything* in the submitted artifact. Reserve ~50 KB of headroom for
config and tokenizer files (small but non-zero).

**Working assumption for planning:** Train in BF16 (numerically better than FP16 for
training stability); submit as INT8 if the challenge accepts quantized artifacts.
This is the single biggest lever — it doubles the effective param budget.

---

## 2. The vocabulary problem (most important sizing insight)

The embedding table consumes budget before a single transformer layer is added.
For vocab size V and hidden dim D:

    embedding_bytes = V × D × bytes_per_param
    (×1 if embedding and LM head weights are tied, ×2 if separate)

**At BF16 (2 bytes/param), without weight tying:**

| Vocab (V) | Hidden dim (D) | Embedding cost | % of 16 MB |
|-----------|----------------|----------------|------------|
| 50,257    | 512            | ~51 MB         | 320% — impossible |
| 32,768    | 512            | ~33.6 MB       | 210% — impossible |
| 16,384    | 256            | ~8.4 MB        | 52% — half the budget gone |
| 8,192     | 256            | ~4.2 MB        | 26% |
| 4,096     | 256            | ~2.1 MB        | 13% |
| 4,096     | 128            | ~1.0 MB        | 6% |
| 256 (byte)| 256            | ~131 KB        | <1% |

**Weight tying** (embedding = LM head, shared weights) cuts this cost in half.
It is not optional at this scale — it is mandatory. Standard practice in small LMs;
no meaningful quality loss and sometimes a slight improvement.

**Bottom line on vocab:** A standard 32K–50K BPE vocab is completely infeasible.
Either use a small BPE vocab (4K–16K) or byte-level tokenization (V=256).
Byte-level eliminates embedding cost but increases sequence length ~3-4×, raising
compute cost. The right trade-off depends on the sequence budget in the 10-minute run.

---

## 3. Transformer parameter count formula

For a standard decoder-only transformer with weight tying:

    P = V×D + L × D² × (4 + 2R)

Where:
- `V` = vocab size
- `D` = hidden dim
- `L` = number of layers
- `R` = MLP expansion ratio (typically 4; this gives `2R = 8` → per-layer = `12D²`)
- Excludes biases and LayerNorm parameters (< 0.1% of total; negligible)

Per-layer param count at common hidden dims:

| D   | Per-layer params (R=4) | Notes |
|-----|------------------------|-------|
| 128 | ~197K                  | Very narrow; many layers possible |
| 256 | ~786K                  | Sweet spot for 16 MB |
| 512 | ~3.15M                 | Only 2–4 layers possible at FP16 |

---

## 4. Viable configurations

### BF16 submission (~8.4M param budget)

| Config               | V     | D   | L  | Embed params | Layer params | Total  | Size est. |
|----------------------|-------|-----|----|--------------|--------------|--------|-----------|
| Deep-narrow          | 4,096 | 128 | 36 | 0.52M        | 7.1M         | 7.6M   | 15.2 MB   |
| Mid (recommended)    | 8,192 | 256 | 8  | 2.10M        | 6.29M        | 8.4M   | 16.8 MB ⚠ |
| Mid (safer margin)   | 4,096 | 256 | 9  | 1.05M        | 7.07M        | 8.1M   | 16.2 MB   |
| Wide-shallow (risky) | 4,096 | 512 | 1  | 1.05M        | 3.15M        | 4.2M   | 8.4 MB    |
| Byte-level           | 256   | 256 | 10 | 0.13M (tied) | 7.86M        | 8.0M   | 16.0 MB   |

⚠ Red cells are at or over budget — leave headroom for metadata.

**Recommended starting point for BF16:** V=4096, D=256, L=9
- ~8.1M params, ~16.2 MB — fits with ~0.6 MB margin for config/tokenizer
- 9 layers of D=256 is architecturally reasonable (GPT-2 Small is 12 layers, D=768)
- Small BPE vocab (4K) is learnable; character-level properties preserved

### INT8 submission (~16.8M param budget, if accepted)

| Config               | V      | D   | L  | Embed params | Layer params | Total  | Size est. |
|----------------------|--------|-----|----|--------------|--------------|--------|-----------|
| Mid-deep             | 16,384 | 256 | 16 | 4.19M        | 12.58M       | 16.8M  | 16.8 MB ⚠ |
| Conservative         | 8,192  | 256 | 18 | 2.10M        | 14.15M       | 16.3M  | 16.3 MB   |
| Wide (4 layers)      | 8,192  | 512 | 4  | 4.19M        | 12.58M       | 16.8M  | 16.8 MB ⚠ |
| Byte + deep          | 256    | 256 | 21 | 0.13M        | 16.5M        | 16.7M  | 16.7 MB   |

**Recommended starting point for INT8:** V=8192, D=256, L=18
- ~16.3M params, ~16.3 MB — 0.5 MB margin
- 18-layer D=256 transformer is a qualitatively different regime than the BF16 version
- The improvement in perplexity from 8M→16M params is likely substantial

---

## 5. SSM / Mamba notes

Mamba (S6 kernel) per-layer param count differs from a transformer:

- Each Mamba block has approximately `D² × 3` params (input projection, selective
  scan projection, output projection), plus a state expansion term that is small.
- For D=256: roughly 200K–300K params per block (less than transformer's 786K at D=256).
- This means **more layers for the same budget** — a Mamba model with 16 layers fits
  where a transformer fits 8, at the same D.
- The question is whether depth-for-parameter efficiency trades favorably at this scale.
- Mamba's key advantage is compute efficiency (linear vs quadratic in seq len), not
  necessarily parameter efficiency. At 16 MB and short sequences this matters less.

**Concrete Mamba estimate:** V=4096, D=256, L=20 with Mamba blocks:
- Embedding: ~1.05M params
- Layers: 20 × ~280K = 5.6M params
- Total: ~6.65M params, ~13.3 MB at BF16 — leaves headroom for slightly larger D or V.

---

## 6. Decision matrix for architecture selection

| Factor | Transformer | Mamba/SSM | Byte-level |
|--------|-------------|-----------|------------|
| Vocab flexibility | Good (4K–16K BPE) | Same | Forced V=256 |
| Compute at 10 min | OK (short seqs) | Better (long seqs) | Worse (longer seqs) |
| Ecosystem/tooling | Excellent | Growing | Good |
| Param efficiency | Baseline | ~20–30% fewer per layer | Same as transformer |
| Uncertainty | Low | Medium | Medium |

**Recommendation:** Start with the BF16 transformer baseline (V=4096, D=256, L=9).
This is the lowest-risk starting point with the most tooling support. Add Mamba and
INT8 configs as parallel experiments once the baseline pipeline is proven.

---

## 7. Open questions / uncertainties

1. **Does the 16 MB limit include tokenizer and config files?** If so, shave 50–200 KB
   from param budget estimates above.
2. **Does the challenge accept INT8-quantized submissions?** If yes, INT8 is the
   single highest-impact decision in the entire project.
3. **What is the exact evaluation metric?** Perplexity on a specific corpus, MMLU,
   something else? Metric drives data mixture decisions significantly.
4. **Does compute budget include compilation time / warmup?** On H100s, torch.compile
   can take 1–3 minutes — this eats into the 10-minute window.
5. **Is weight tying explicitly permitted?** Almost certainly yes, but worth confirming.

---

*Generated: 2026-03-19. Update when challenge rules are clarified.*
