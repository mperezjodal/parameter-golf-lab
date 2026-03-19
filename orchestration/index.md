# Orchestration

Patterns and sketches for coordinating research work across tasks and agents.
These are designs, not running systems. Inspired by Elixir/OTP isolation
principles and AutoResearch-style systematic idea exploration.

## Current Coordination Model

**All coordination is human-driven.** The Kanban board (`/board/`) is the
source of truth. Humans move cards through columns. Agents are invoked
manually per card.

```
Backlog → In Progress → Review → Done
   ↑            ↓                  ↓
Human       Human runs         Human writes
reviews     agent task         result card
card        manually           (findings.md)
```

Each card maps to one isolated work run: declared inputs, declared outputs,
explicit halt. No card bleeds into another. This is the Elixir principle:
isolated processes, message-passing via files.

## Symphony Integration (planned)

When ready (see `SYMPHONY.md`), Symphony reads result cards and proposes new
hypothesis cards:

```
experiments/*/findings.md   ← result cards accumulate here
         ↓
   Symphony Advisor (T5, manually triggered)
         ↓
   New hypothesis cards → board/backlog.json
         ↓
   Human reviews + approves each card
         ↓
   Architecture Sizer (T1) or other task, manually triggered
```

Symphony is a one-shot script, not a daemon. It runs, proposes, halts.

## Multi-Agent Research Loop (AutoResearch-style, speculative)

If the project grows, a possible multi-agent research loop:

```
Idea Evaluator (T4) → ranks hypotheses
       ↓
Literature Scanner (T2) → gathers evidence for top hypotheses
       ↓
Architecture Sizer (T1) → validates sizing for top designs
       ↓
Human gate → approves designs for actual training runs
       ↓
[External training] → result arrives
       ↓
Result card written → Symphony reads → next round
```

Each agent runs once, halts, produces files. Coordination via the filesystem.
No persistent communication channel. The board is the shared state.

## Non-Goals

- Real-time streaming between agents
- Agent-to-agent direct messaging
- Persistent agent processes
- Webhooks, event buses, or cron jobs inside this repo
