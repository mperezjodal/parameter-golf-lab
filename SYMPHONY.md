# Symphony — Coordination Layer Design Note

**Status:** Design phase. No code yet. Do not act on this until hypotheses are
evaluated.

---

## Context: The Challenge

We are researching the OpenAI Parameter Golf Challenge — training the best
possible model within 16 MB artifact / 10 min on 8×H100. The research space is
large: architectures, quantization strategies, training recipes, data mixtures,
distillation approaches. Symphony's job is to keep that exploration coherent.

---

## Inspiration: Elixir-Style Work Board Semantics

Symphony borrows from Elixir's process model and OTP supervision trees — not
the language, but the ideas:

- **Isolated work runs** — each research exploration is a self-contained unit
  with declared inputs, outputs, and halt conditions. No shared mutable state
  between runs.
- **Result cards** — every completed run produces a structured result card
  (like a message in a mailbox): what was tried, what was found, what to try
  next. Result cards accumulate in `/experiments/`.
- **Work board as source of truth** — the Kanban board (`board/backlog.json`)
  is the single coordination surface. Cards progress through defined states:
  `backlog → in-progress → review → done`. Symphony reads the board; humans
  approve transitions.
- **Observability by default** — every run writes a findings file. Nothing
  happens silently. The board reflects real state, not optimistic projections.

---

## What Symphony Does

1. **Reads** all result cards from completed experiments
2. **Reasons** about the architecture search space (what's been tried, what's
   promising, what's ruled out)
3. **Proposes** new hypothesis cards for the Kanban backlog
4. **Halts** — a human reviews proposals before any run starts

Symphony is a one-shot advisor, not a persistent process.

---

## Integration Hypotheses (not commitments)

### Hypothesis A — Stateless Advisor Script
Symphony reads `/experiments/*/findings.md` and `/ideas/index.md`, sends a
compact summary to a cheap model, and returns prioritized next hypothesis cards.
No database. Human decides which cards to add to board.

**Fits when:** The search space is still small and manually navigable.

### Hypothesis B — Board-Driven Research Loop
Symphony reads the board and experiment results, writes new `backlog` cards to
`board/backlog.json`, then halts. A human reviews and moves to "In Progress."
This makes Symphony's proposals first-class board citizens.

**Fits when:** The board is the primary coordination surface (it is, for now).

### Hypothesis C — Architecture Search Graph
Symphony maintains a graph of the explored architecture space (depth, width,
vocab size, quantization, etc.) and uses heuristics to suggest next points.
Higher complexity, higher value at scale.

**Fits when:** We have >10 completed experiments and want systematic coverage.

---

## Current Recommendation

Start with **Hypothesis B**. It:
- Keeps the board as the single source of truth (one coordinator, like an OTP
  supervisor)
- Produces human-reviewable artifacts (cards, not black-box suggestions)
- Requires no persistent state or database
- Can be implemented as a simple Node/Python script triggered manually

---

## Next Steps

- [ ] Define the result card schema (see `/docs/result-schema.md` when ready)
- [ ] Prototype Hypothesis B as a one-shot script
- [ ] Decide: same repo or separate tool?

---

*This note holds space for the idea without locking in premature decisions.*
