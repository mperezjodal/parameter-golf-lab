# Ideas Index

Architecture and training hypotheses — not yet committed to experiments.
Anyone can add here. Evaluated ideas become CARD entries and eventually
experiments.

**See also:** `ideas/ranked.md` — scored/prioritized ranking of all ideas (updated 2026-03-19).

---

## Active Ideas

### IDEA-001: SSM vs Transformer at 8M parameters
**Hypothesis:** At ≤8M parameters (16 MB FP16), an SSM-based model (Mamba or
similar) achieves lower perplexity per parameter than a standard transformer,
because SSMs have fewer "overhead" parameters (no softmax attention, no
positional encoding).
**Effort:** Medium (sizing calc low; actual training run needed for confirmation)
**Status:** Not started

### IDEA-002: Depth vs width at fixed parameter budget
**Hypothesis:** For language modeling at 8M params, deeper+narrower (12 layers,
dim 256) outperforms shallower+wider (4 layers, dim 512) on perplexity because
depth helps with compositionality at low parameter counts.
**Effort:** Low (sizing only), Medium (training confirmation)
**Status:** Not started

### IDEA-003: Vocab size as a hidden artifact budget lever
**Hypothesis:** Reducing BPE vocab from 32K to 8K saves ~48 MB at FP16 on the
embedding table alone — far more than the 16 MB limit. A small vocab is
mandatory, not optional.
**Effort:** Low (arithmetic sizing calculation)
**Status:** Confirmed by sizing analysis (docs/sizing-16mb.md, 2026-03-19).
At D=256 BF16: V=32K costs ~16.8 MB for embedding alone (entire budget); V=8K costs
~4.2 MB; V=4K costs ~2.1 MB. Weight tying halves cost. Vocab ≤ 8K is a hard
constraint, not a trade-off. **Ranked #1 in ideas/ranked.md.**

### IDEA-004: INT8 quantization: quality-vs-size trade-off
**Hypothesis:** Post-training INT8 quantization of a 16 MB FP16 model produces
a 8 MB artifact with <1 ppt perplexity degradation, effectively doubling our
parameter budget for free.
**Effort:** Low (research), Medium (training + quant run)
**Status:** Not started

### IDEA-005: Knowledge distillation from 70B teacher
**Hypothesis:** Distilling a 8M param student from a large teacher model (e.g.
Llama 3 70B) within 10 minutes achieves better perplexity than training on raw
data alone, because soft targets carry richer gradient signal.
**Effort:** High (requires teacher inference pipeline)
**Status:** Not started — parking lot until basics are settled

---

## Parking Lot (not yet evaluated)

- Byte-level tokenization: eliminate vocab overhead entirely, trade off longer
  sequences
- Mixture-of-Experts with sparse routing: can MoE fit more "effective" capacity
  in 16 MB?
- Data mixture: code-heavy vs text-heavy vs multi-domain for generalization
- Weight tying: tie embedding and LM head weights to save ~embedding_table params
- Learning rate: very aggressive LR schedules optimized for 10-minute runs
