# Agent Task Taxonomy

These are categories of tasks that agents (when manually triggered) might perform in this project. This is a classification document, not a running system.

## Task Categories

### T1: Experiment Runner
- **Description:** Takes an experiment design from `/experiments/EXP-XXX/design.md`, calls the OpenAI API with specified parameter grids, and writes raw outputs to `results/`.
- **Inputs:** design.md, .env.local (API key)
- **Outputs:** results/raw.jsonl, results/summary.json
- **Human gate:** Manually triggered. Requires explicit approval of experiment design first.
- **Template:** `agents/templates/experiment-runner.md`

### T2: Results Analyzer
- **Description:** Reads results from completed experiments, computes metrics (variance, cost, quality score), and writes `findings.md`.
- **Inputs:** results/raw.jsonl + rubric
- **Outputs:** findings.md
- **Template:** `agents/templates/results-analyzer.md`

### T3: Board Syncer
- **Description:** Reads experiment status and updates `/board/cards/` accordingly.
- **Inputs:** experiments/index.md, board/backlog.json
- **Outputs:** updated board JSON files
- **Template:** `agents/templates/board-syncer.md`

### T4: Idea Evaluator
- **Description:** Reviews `/ideas/index.md` and scores each idea on feasibility, novelty, and expected value. Produces a prioritized ranking.
- **Inputs:** ideas/index.md, experiments/index.md (for coverage)
- **Outputs:** ideas/ranked.md
- **Template:** `agents/templates/idea-evaluator.md`

### T5: Symphony Advisor (future)
- **Description:** Reads all experiment findings, sends to a model, gets back suggested next experiments. Posts suggestions as new board cards.
- **Status:** Not ready. Waiting on Symphony design.
- **Template:** See `SYMPHONY.md`

## Execution Model

All tasks are **manually triggered** by a human via CLI:
```bash
node agents/run.js --task T1 --experiment EXP-001
```

No cron jobs. No webhooks. No autonomous scheduling.
