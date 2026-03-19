# Glossary

**Parameter Golf** — finding the minimal, most effective parameter configuration for a target behavior. Fewer, simpler parameters = lower "score."

**Temperature** — controls randomness. 0 = deterministic (greedy decoding), 2 = very random. Rule of thumb: low for extraction/code, higher for creative tasks.

**Top-p (Nucleus Sampling)** — considers only the top P% probability mass tokens at each step. Usually leave at 1.0 unless combining with temperature tuning.

**Presence Penalty** — positive values penalize any token that has appeared at all in the output so far. Good for reducing repetition in long outputs.

**Frequency Penalty** — positive values penalize tokens proportional to how many times they've appeared. More aggressive than presence penalty for very repeated tokens.

**Seed** — integer seed for reproducibility. Same seed + same parameters = same output (model-side determinism, not guaranteed across API versions).

**Logit Bias** — map of token IDs to bias values (-100 to 100). -100 effectively bans a token; 100 forces it. Powerful but requires tokenizer knowledge.

**Symphony** — working name for a proposed meta-coordination layer. See `SYMPHONY.md`.

**Backlog** — unstarted cards in the Kanban board (`board/backlog.json`).

**Experiment** — a structured test design in `/experiments/` with a hypothesis, parameter grid, and recorded results.
