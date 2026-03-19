# Ideas Index

Raw ideas — not yet committed to experiments. Anyone can add here.

---

## Active Ideas

### IDEA-001: Temperature sweet spots per task type
**Hypothesis:** There are predictable optimal temperature ranges per task category (code, creative, extraction) that hold across models.
**Effort:** Medium
**Status:** Not started

### IDEA-002: top_p vs temperature interaction map
**Hypothesis:** Combining non-default top_p with non-default temperature produces surprising non-linear effects on output diversity.
**Effort:** Medium
**Status:** Not started

### IDEA-003: Minimum tokens needed for reliable JSON extraction
**Hypothesis:** Most JSON extraction tasks can be done with far fewer max_tokens than developers default to, saving significant cost.
**Effort:** Low
**Status:** Not started

### IDEA-004: Presence vs frequency penalty for long-form content
**Hypothesis:** presence_penalty is more useful than frequency_penalty for most long-form tasks; developers overuse frequency_penalty.
**Effort:** Low-Medium
**Status:** Not started

### IDEA-005: Seed reproducibility across model versions
**Hypothesis:** Seeds are reliable within a model version but break silently across versions — this is underdocumented.
**Effort:** Low
**Status:** Not started

---

## Parking Lot (not yet evaluated)

- logit_bias as a prompt engineering alternative
- stop sequences as a cheaper alternative to max_tokens for structured outputs
- parameter tuning for multi-turn vs single-turn conversations
- interaction with system prompt length on temperature behavior
