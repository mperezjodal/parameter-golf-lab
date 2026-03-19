# Orchestration

Patterns and sketches for coordinating work across tasks and agents. These are designs, not running systems.

## Current Coordination Model

**All coordination is human-driven.** The Kanban board in `/board/` is the source of truth. Humans move cards through columns. Agents are invoked manually per card.

```
Backlog → In Progress → Done
   ↑           ↓
Human      Human runs
reviews    agent task
card       manually
```

## Planned: Symphony Integration

When Symphony is ready (see `SYMPHONY.md`), the orchestration model may evolve:

```
Experiments/Results
       ↓
  Symphony Advisor (T5, manually triggered)
       ↓
  New cards added to Backlog
       ↓
  Human reviews + approves
       ↓
  Experiment Runner (T1, manually triggered)
```

## Multi-Agent Sketch (future, speculative)

If the project grows, a possible multi-agent split:
- **Planner agent** — reads ideas + results, proposes next experiments
- **Runner agent** — executes approved experiments
- **Reviewer agent** — grades outputs against rubric
- **Summarizer agent** — writes findings.md

Each runs once, halts, produces files. No persistent communication channel. Coordination via shared filesystem.

## Non-Goals

- Real-time streaming between agents
- Agent-to-agent direct messaging
- Persistent agent processes
- Webhooks or event buses
