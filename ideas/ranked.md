# Ranked Idea Memo — First Pass

**Date:** 2026-03-19
**Method:** Sizing analysis + reasoning from first principles. No training results yet.
**Scope:** Ranked directions for the OpenAI Parameter Golf Challenge (16 MB / 10 min 8×H100).

---

## Ranking criteria

Each direction scored on:
- **Impact** — expected quality gain if the hypothesis is correct
- **Confidence** — how sure we are it will work (based on math / prior art)
- **Cost** — effort to validate (low = sizing math; high = full training run)
- **Dependency** — does it block or unblock other experiments?

---

## Rank 1 — Small vocabulary + weight tying (IDEA-003 expanded)

**Why it's #1:** This is not an optimization — it is a *precondition* for existence.
A standard 32K BPE vocab at D=256 costs ~16.8 MB at BF16, which is the *entire
artifact budget* with nothing left for any transformer layers. Even V=8K at D=256
costs ~4.2 MB, eating 25% of the budget on embedding alone.

**Recommendation:**
- Use V=4096 or V=8192 BPE for first experiments
- Tie embedding and LM head weights (saves 50% of embedding cost)
- Byte-level tokenization (V=256) is a valid alternative that effectively eliminates
  embedding cost; trade-off is longer sequences and more compute

**Confidence:** Very high (pure math, no training needed to validate)
**Impact:** Fundamental — unlocks all other experiments
**Cost:** Low (tokenizer training is fast; weight tying is one line of code)
**Action:** Design tokenizer choice into every experiment from day 1; never exceed V=8192 without explicit justification

---

## Rank 2 — INT8 quantization (IDEA-004 expanded)

**Why it's #2:** If the challenge accepts INT8 artifacts, this doubles the effective
parameter budget from ~8.4M to ~16.8M at zero additional training cost. Going from
8M to 16M params is a qualitatively large jump in language model capability.

**The key question:** Does the challenge accept INT8-quantized submissions?
- If **yes**: This is possibly the single biggest win in the project. Quantize-aware
  training (QAT) or post-training quantization (PTQ) of a BF16 model to INT8.
- If **no**: This direction is blocked; focus on BF16 and investigate INT4 for
  further compression within the BF16 budget.

INT8 PTQ on small models typically costs <0.5 ppt perplexity. At 2× the parameter
count, the net effect is strongly positive.

**Confidence:** High on math; medium on challenge rules (need to verify)
**Impact:** Very high (2× parameter budget if accepted)
**Cost:** Low-Medium (PTQ is fast; QAT adds ~20% training overhead)
**Action:** Verify challenge submission rules on INT8 ASAP. This decision gates the entire parameter budget strategy.

---

## Rank 3 — Depth vs width at fixed budget (IDEA-002)

**Why it's #3:** Once vocab and precision are settled, the next biggest architectural
lever is the depth/width ratio. This is well-studied but results vary at tiny scale.

**Current best guess from prior art:**
- At <10M params, deeper+narrower tends to win on perplexity (GPT-2 scaling shows this)
- Very deep+narrow (e.g. 32 layers, D=128) enters diminishing returns from gradient
  flow issues unless residual scaling is tuned carefully
- The sweet spot is probably 8–18 layers at D=256, not 2–4 layers at D=512

**Why this matters:** At D=512, only 2–3 transformer layers fit in the BF16 budget
(after a V=4096 embedding). That's likely too shallow for good language modeling.
At D=256, L=9 fits comfortably and is architecturally sensible.

**Confidence:** Medium (prior art suggests deeper wins, but tiny scale is unusual)
**Impact:** Medium (~5–15% perplexity improvement from tuning ratio)
**Cost:** Low (sizing math) + Medium (1–2 training runs to confirm)
**Action:** Run CARD-006 baseline at D=256, L=9. Then run a second config at D=128, L=36 to test the extreme deep-narrow hypothesis.

---

## Rank 4 — SSM/Mamba architecture (IDEA-001)

**Why it's #4 (not higher):** Mamba is promising, but the advantage at this scale is
less clear than it is at larger scale or longer sequences. The main wins are:
1. ~20–30% fewer params per layer → more layers at same budget
2. Linear-time inference (irrelevant for training; slightly relevant for eval)

The main risks:
- Less tooling maturity; harder to debug training instabilities
- Uncertain whether depth advantage translates to perplexity at 8M params
- Requires specific CUDA kernels (Triton or official mamba-ssm package)

**When to try it:** After the transformer baseline is clean and producing numbers.
A Mamba model at V=4096, D=256, L=16–20 is the right first SSM experiment.

**Confidence:** Medium (architecture is real; scale advantage is uncertain)
**Impact:** Medium (potentially 10–20% better param efficiency)
**Cost:** Medium (new architecture, different training quirks)
**Action:** Placeholder in experiment queue; do not block on this

---

## Rank 5 — Knowledge distillation from large teacher (IDEA-005)

**Why it's #5:** The quality improvement from distillation can be substantial (10–30%
perplexity reduction), but it requires a teacher inference pipeline running in parallel
with student training. On 8×H100 with a 10-minute budget, this is very tight:
- A 70B teacher forward pass for 1B tokens would dominate the compute window
- A 7B teacher is more feasible; 1B is practical

**When to try it:** Late in the project, after baseline is solid and there is clear
room for improvement. Distillation is a finishing move, not a foundation.

**Confidence:** Medium-High (distillation is well-studied; time budget risk is real)
**Impact:** High (potentially largest single improvement)
**Cost:** High (complex pipeline; requires large teacher access)
**Action:** Park until baseline + quant are solved

---

## Parking lot (ideas worth tracking but not yet ranked)

| Idea | Note |
|------|------|
| Byte-level tokenization | Trades embedding cost for compute cost; try if BPE vocab struggles to stay under budget |
| Aggressive LR + cosine schedule | Short runs need fast warmup; standard 1-cycle or cosine-with-warmup; low uncertainty |
| Weight sharing across layers | Ties layer weights for shared-depth models (like ALBERT); untested at 8M params |
| MoE with sparse routing | Increases "effective" capacity but complicates training; probably too risky for a 10-min window |
| Data curriculum: quality filtering | High-quality curated data trains faster; depends on eval metric; worth exploring |
| GQA / MQA for attention efficiency | Reduces attention parameter count slightly; more useful for inference than artifact size |

---

## Summary table

| Rank | Direction | Impact | Confidence | Cost | Gate |
|------|-----------|--------|------------|------|------|
| 1 | Small vocab + weight tying | Critical | Very high | Low | None |
| 2 | INT8 quantization | Very high | High (math), Medium (rules) | Low | Verify rules |
| 3 | Depth/width ratio tuning | Medium | Medium | Low+Medium | Baseline needed |
| 4 | SSM/Mamba architecture | Medium | Medium | Medium | Baseline needed |
| 5 | Knowledge distillation | High | Medium | High | Baseline + quant done |

---

*Next update: after first training run results are logged.*
