# Repo Watch Protocol

How periodic (hourly/daily) monitoring passes should record findings back into
this repo.

---

## What to Watch

The OpenAI Parameter Golf Challenge upstream repo and any linked community
threads. Key signals:

- New commits (especially to evaluation scripts, baselines, or example
  submissions)
- Opened and merged PRs (technique signals)
- Issues/discussions (gotchas, clarifications, community discoveries)
- Any publicly announced leaderboard or benchmark scores

---

## What to Record

All findings go into **`board/upstream-log.md`**, organized by date.

Each monitoring pass appends a dated entry with:

```
## YYYY-MM-DD — [pass type: hourly / daily / manual]

### Repo state
- Last commit seen: <SHA or "no change">
- Open PRs: <count or notable titles>
- Newly merged PRs: <list or "none">

### Accepted PR highlights
- <PR title / technique summary> — impact: [high/medium/low]

### Leaderboard / scores
- <metric / score / source> or "no public data"

### Community signals
- <key observation from issues or discussions> or "nothing notable"

### Action items
- <CARD-XXX: new card to add> or "none"
```

If there is nothing new, still append a minimal "no change" entry so the log
shows continuous coverage.

---

## How to Act on Findings

1. If a merged PR reveals a novel technique → create a new idea card
   (`ideas/index.md`) and a new board card with `labels: ["upstream",
   "research"]`.
2. If a score benchmark appears → update CARD-013's `evidence` field and the
   leaderboard section of `upstream-log.md`.
3. If a gotcha / clarification changes our assumptions → add a note to the
   relevant experiment design or docs.
4. Never auto-move board cards — human reviews all transitions.

---

## Frequency

| Trigger         | Action                                  |
|---|---|
| Hourly pass     | Lightweight: check for new commits/PRs. Append minimal entry. |
| Daily pass      | Full: inspect merged PRs, issues, any score data. |
| Manual          | Deep dive when a notable merged PR is flagged. |

---

## Safety Rules

- Do NOT run training, benchmarks, or expensive experiments in a monitoring
  pass.
- Do NOT use paid API resources for passive monitoring.
- Log only public information. Never log credentials, tokens, or private repo
  contents.
