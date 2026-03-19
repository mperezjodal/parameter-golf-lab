# Parameter Golf Lab

**OpenAI Parameter Golf** — a public-safe coordination repository for systematic exploration of how model parameters (temperature, top_p, presence_penalty, frequency_penalty, max_tokens, stop sequences, and more) affect LLM output quality, cost, and behavior.

## Charter

This repo is the center of knowledge, ideas, documentation, coordination, and results for Parameter Golf research. The goal: find minimal, precise parameter configurations that produce target behaviors reliably and cheaply.

**What we do here:**
- Catalog parameter interaction hypotheses
- Design lightweight, reproducible experiments
- Collect and compare results
- Coordinate via Kanban board (see `/board/`)
- Document findings in `/docs/`

**What we explicitly do NOT do here:**
- Run autonomous recurring agents from inside this repo
- Run training or fine-tuning jobs
- Spend money on expensive cloud experiments
- Store secrets, API keys, or personal data
- Start any internal loops that execute without human approval

## Safety & Resource Rules

1. **No secrets.** API keys live in `.env.local` (gitignored). Never commit them.
2. **No autonomous loops.** Agent templates in `/agents/` are templates only — humans trigger runs manually.
3. **No expensive calls.** Prefer `gpt-4o-mini` or equivalent cheap models for exploration. Gate expensive models behind explicit human sign-off.
4. **No personal data.** All experiment inputs are synthetic or public domain.
5. **Low local resource usage.** Dashboard is a static/SSR Next.js app. No background workers, no databases, no Docker.
6. **Public-safe.** Everything committed here is safe to make public. No proprietary prompts, no private benchmarks.

## Current State (2026-03-18)

- [x] Repo scaffolded
- [x] Dashboard (Next.js, Vercel-ready)
- [x] Board backlog seeded with initial cards
- [x] Symphony note drafted
- [ ] First experiment designed
- [ ] Vercel deploy configured
- [ ] GitHub remote created

## Structure

```
parameter-golf-lab/
├── README.md               ← you are here
├── SYMPHONY.md             ← speculative integration note
├── docs/                   ← reference docs, findings, glossary
├── ideas/                  ← raw ideas, not yet committed to experiments
├── experiments/            ← structured experiment designs + results
├── agents/                 ← agent templates and task taxonomy (not running)
├── orchestration/          ← coordination patterns, multi-agent sketches
├── board/                  ← Kanban cards (JSON) consumed by dashboard
└── dashboard/              ← Next.js PWA dashboard (Vercel-ready)
```

## Dashboard

```bash
cd dashboard
npm install
npm run dev   # http://localhost:3000
```

Deploy to Vercel: connect repo root, set `Root Directory` to `dashboard/`.
