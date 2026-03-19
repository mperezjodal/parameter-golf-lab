# Agent Template: Experiment Runner (T1)

**Type:** One-shot script agent
**Trigger:** Manual (`node agents/run.js --task T1 --experiment EXP-XXX`)
**Safety:** Reads design.md, calls OpenAI API, writes results. No side effects beyond files.

---

## Pseudocode

```
1. Read /experiments/EXP-XXX/design.md
2. Parse parameter grid (list of {temperature, top_p, ...} combos)
3. Parse task inputs from /experiments/EXP-XXX/inputs/
4. For each parameter combo × each input:
   a. Call OpenAI API with that config
   b. Append result to results/raw.jsonl
5. Compute summary stats (variance, avg cost, latency)
6. Write results/summary.json
7. Print completion message
8. HALT
```

## Cost Guard

Before starting any API calls, estimate total cost:
```
estimated_cost = num_combos × num_inputs × avg_tokens × price_per_token
```
If estimated_cost > $0.50, print warning and require `--confirm-cost` flag to proceed.

## Output Schema

`results/raw.jsonl` — one JSON object per line:
```json
{
  "experiment_id": "EXP-001",
  "run_id": "run_001",
  "params": { "temperature": 0.7, "top_p": 1.0 },
  "input_id": "input_001",
  "output": "...",
  "usage": { "prompt_tokens": 45, "completion_tokens": 120 },
  "latency_ms": 832,
  "timestamp": "2026-03-18T00:00:00Z"
}
```
