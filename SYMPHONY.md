# Symphony — First-Pass Note

**Status:** Speculative. Many unknowns. Do not act on this until further research.

---

## What Symphony Might Be

"Symphony" is a working name for a coordination layer that could sit above individual parameter golf experiments — a meta-orchestrator that:

1. **Proposes** parameter configurations based on prior results
2. **Dispatches** experiment runs (manually triggered, human-gated)
3. **Aggregates** results into a shared knowledge graph
4. **Suggests** next experiments using patterns from collected data

The name implies harmony across many moving parts: models, parameters, tasks, metrics.

---

## What Is Uncertain

- Whether Symphony needs to be a separate system at all, or just a well-structured spreadsheet + docs workflow
- Whether it would use Claude, GPT-4o, or a lightweight local model for its own reasoning
- Whether it needs persistent state (database) or can be stateless (read from `/board/` JSON + `/experiments/`)
- The right abstraction: a CLI tool? A Next.js API route? A CRON job? A human-triggered script?
- Cost model: if Symphony calls expensive models to reason about experiments, it could get expensive fast

---

## Integration Hypotheses (not commitments)

1. **Hypothesis A — Stateless advisor:** Symphony is a one-shot script that reads all experiment results, sends them to a cheap model, and returns a prioritized list of next experiments. No database. Human decides whether to run.

2. **Hypothesis B — Board-driven loop:** Symphony reads `/board/cards/` and `/experiments/`, writes new cards to `board/backlog.json`, and halts. A human reviews and moves cards to "In Progress" to trigger runs.

3. **Hypothesis C — Full orchestrator:** Symphony maintains a graph of parameter-space explored, uses Bayesian optimization or similar to suggest next points, and exposes a small API. Higher complexity, higher value.

---

## Next Steps (when ready)

- [ ] Evaluate whether Hypothesis A solves 80% of the problem
- [ ] Define what "a result" looks like structurally (see `/docs/result-schema.md` when it exists)
- [ ] Decide if Symphony belongs in this repo or a separate one
- [ ] Research: does any existing OSS tool (Optuna, Ray Tune, etc.) already do this for prompt parameters?

---

*This note is intentionally vague. Its job is to hold space for the idea without locking in decisions prematurely.*
