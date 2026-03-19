# Experiments Index

Architecture and training research designs with hypothesis, sizing, and result
cards. Actual training runs happen on external hardware; this index tracks
design-phase and analysis-phase work.

## Folder Structure

Each experiment lives in `/experiments/EXP-XXX/`:
```
EXP-XXX/
├── design.md       ← hypothesis, architecture spec, metric, expected outcome
├── results/
│   ├── sizing.json ← computed by T1 (Architecture Sizer) — no GPU needed
│   └── training/   ← results from actual training run (external, linked here)
└── findings.md     ← result card: what was tried, what was learned, next steps
```

The `findings.md` is the **result card** — the primary output of each
experiment. Symphony reads these to propose new hypotheses.

## Experiments

| ID | Title | Status | Idea Source |
|---|---|---|---|
| — | No experiments yet | — | — |

---

*Add experiments by creating a folder following the template above and adding a
row to this table. T1 (Architecture Sizer) can be run locally on any design
without GPU access.*
