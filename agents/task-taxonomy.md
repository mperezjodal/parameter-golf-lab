# Agent Task Taxonomy

These are categories of tasks that agents (when manually triggered) might
perform in this project. This is a classification document, not a running
system.

## Task Categories

### T1: Architecture Sizer
- **Description:** Given an architecture spec (layers, hidden dim, heads, vocab
  size), computes total parameter count, estimated artifact size at each
  precision (FP32/FP16/INT8), and estimated training FLOP cost. No GPU needed.
- **Inputs:** architecture spec (YAML or JSON in `/experiments/EXP-XXX/design.md`)
- **Outputs:** `results/sizing.json` — param count, artifact size, FLOP estimate
- **Human gate:** Manually triggered. Human reviews sizing before any real
  training is planned.
- **Template:** `agents/templates/architecture-sizer.md`

### T2: Literature Scanner
- **Description:** Given a research question (e.g. "best architecture for <100M
  params LM"), searches public sources (arXiv abstracts, model cards, blog
  posts) and produces a structured summary with citations.
- **Inputs:** research question string, `/ideas/index.md` for context
- **Outputs:** `docs/lit-scan-YYYY-MM-DD.md` — summary, citations, implications
- **Human gate:** Manually triggered. Human reviews before ideas are updated.
- **Template:** `agents/templates/literature-scanner.md`

### T3: Board Syncer
- **Description:** Reads experiment status from `/experiments/index.md` and
  updates `/board/backlog.json` to reflect current state. No new cards created
  — only state transitions for existing cards.
- **Inputs:** `experiments/index.md`, `board/backlog.json`
- **Outputs:** updated `board/backlog.json`
- **Template:** `agents/templates/board-syncer.md`

### T4: Idea Evaluator
- **Description:** Reviews `/ideas/index.md` and scores each idea on impact
  (expected quality gain), feasibility (can be done without training in this
  repo), and novelty (not yet tried). Produces a prioritized ranking.
- **Inputs:** `ideas/index.md`, `experiments/index.md` (for coverage)
- **Outputs:** `ideas/ranked.md`
- **Template:** `agents/templates/idea-evaluator.md`

### T5: Symphony Advisor
- **Description:** Reads all experiment result cards (`experiments/*/findings.md`),
  reasons about the explored architecture space, and writes new hypothesis cards
  to `board/backlog.json`. Human reviews every proposed card before it moves to
  "In Progress."
- **Status:** Ready to prototype (Hypothesis B selected — see `SYMPHONY.md`)
- **Template:** `agents/templates/symphony-advisor.md`

## Execution Model

All tasks are **manually triggered** by a human:
```bash
node agents/run.js --task T1 --experiment EXP-001
```

No cron jobs. No webhooks. No autonomous scheduling. Each task runs once,
produces files, and halts.
