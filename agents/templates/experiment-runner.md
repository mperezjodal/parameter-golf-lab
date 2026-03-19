# Agent Template: Architecture Sizer (T1)

**Type:** One-shot script agent (no GPU, no API calls — pure arithmetic)
**Trigger:** Manual (`node agents/run.js --task T1 --experiment EXP-XXX`)
**Safety:** Reads design.md, computes sizing, writes results. No network calls,
no API keys needed.

---

## Purpose

Given an architecture specification, compute:
1. Total parameter count
2. Artifact size at each precision
3. Estimated training FLOP cost
4. Whether the design fits within challenge constraints

---

## Pseudocode

```
1. Read /experiments/EXP-XXX/design.md
2. Parse architecture spec:
   - vocab_size, hidden_dim, num_layers, num_heads, mlp_expansion
   - precision: fp32 | fp16 | bf16 | int8
3. Compute parameter count:
   - embedding: vocab_size × hidden_dim
   - per layer: attention (4 × hidden_dim²) + MLP (2 × hidden_dim × mlp_dim)
   - total = embedding + num_layers × per_layer + lm_head
4. Compute artifact size:
   - fp32: total_params × 4 bytes
   - fp16/bf16: total_params × 2 bytes
   - int8: total_params × 1 byte
5. Check: artifact_size ≤ 16 MB? Flag if over.
6. Estimate training FLOPs: 6 × total_params × training_tokens
7. Check: estimated_flops ≤ budget (8 × H100 × 10 min × ~80 TFLOP/s)?
8. Write results/sizing.json
9. Print sizing summary to stdout
10. HALT
```

---

## Output Schema

`results/sizing.json`:
```json
{
  "experiment_id": "EXP-001",
  "architecture": {
    "vocab_size": 32000,
    "hidden_dim": 512,
    "num_layers": 6,
    "num_heads": 8,
    "mlp_expansion": 4
  },
  "total_params": 4194304,
  "artifact_size_bytes": {
    "fp32": 16777216,
    "fp16": 8388608,
    "int8": 4194304
  },
  "fits_16mb": { "fp32": true, "fp16": true, "int8": true },
  "estimated_training_flops": "2.5e18",
  "fits_compute_budget": true,
  "timestamp": "2026-03-18T00:00:00Z"
}
```
