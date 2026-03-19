# Parameter Golf Lab

Coordination repository for the **OpenAI Parameter Golf Challenge** — train the
best possible language model within a **16 MB artifact budget** and a **10-minute
compute window on 8×H100 GPUs**.

This repo is a **public-safe, low-resource research coordination hub**: no
training happens here, no secrets live here, and no autonomous loops run inside
it. Everything is human-driven via a Kanban board and one-shot agent tasks.

---

## The Challenge

| Constraint | Value |
|---|---|
| **Artifact size limit** | 16 MB (submitted model weights, post-quantization) |
| **Compute budget** | 10 minutes on 8×H100 GPUs |
| **Goal** | Maximize benchmark score within both limits |

"Golf" = fewer parameters, same (or better) performance. Every kilobyte and
every training second must earn its place.

---

## What we do here

- Catalog architecture hypotheses and rank them by expected impact
- Estimate parameter budgets and sizing trade-offs (no GPU needed for math)
- Design experiment plans — run elsewhere, results logged back here
- Track findings on a Kanban board using Symphony-style isolated result cards
- Coordinate ideas using an AutoResearch-inspired systematic backlog

## What we do NOT do here

- **No training runs** — too compute-intensive; must happen on appropriate hardware
- **No autonomous loops** — agent templates are inert documents humans trigger
- **No cloud credentials or secrets** in git, ever
- **No paid APIs** called directly from this repo
- **No personal or proprietary data**

---

## Safety & Resource Rules

1. **No secrets in git** — `.env.local` is gitignored; document variable names only
2. **No autonomous loops** — humans trigger every agent task
3. **No expensive calls** — sizing calculations and literature search are free
4. **No personal data** — all content is public-domain or synthetic
5. **Low local resource usage** — dashboard is a Next.js app with no background workers
6. **Public-safe** — every committed file is safe for a public GitHub repo

---

## Current state

- [x] Repo scaffolded: board, docs, agents, experiments, ideas, orchestration
- [x] Dashboard ready (Next.js Kanban board)
- [x] Board seeded with challenge-aligned cards
- [x] First architecture sizing calculation (CARD-004) → `docs/sizing-16mb.md`
- [x] First hypothesis ranking (CARD-007) → `ideas/ranked.md`
- [x] GitHub public repo: <https://github.com/mperezjodal/parameter-golf-lab> (CARD-003)
- [x] Dashboard live on Vercel: <https://dashboard-nine-blush-81.vercel.app> (CARD-002)
- [ ] Verify INT8 artifact acceptance (CARD-015) — **blocking**
- [ ] Baseline experiment spec: V=4096 D=256 L=9 BF16 (CARD-016)

---

## Directory layout

```
parameter-golf-lab/
├── README.md              ← this file
├── SYMPHONY.md            ← coordination layer design (Elixir-inspired)
├── board/
│   └── backlog.json       ← Kanban board state (consumed by dashboard)
├── docs/
│   ├── charter.md         ← mission and challenge scope
│   ├── glossary.md        ← terminology
│   └── safety-rules.md    ← hard constraints
├── agents/
│   ├── task-taxonomy.md   ← agent task types (T1–T5)
│   └── templates/         ← per-task prompt templates
├── experiments/
│   ├── index.md           ← experiment registry
│   └── EXP-XXX/           ← per-experiment folder
├── ideas/
│   └── index.md           ← architecture hypothesis backlog
├── orchestration/
│   └── index.md           ← coordination patterns
└── dashboard/             ← Next.js board + result cards UI
```

---

## Dashboard

```bash
cd dashboard
npm install
npm run dev
# open http://localhost:3000
```

Reads `board/backlog.json` and renders a live Kanban board. No backend required.
Vercel-deployable: connect repo root, set Root Directory to `dashboard/`.
