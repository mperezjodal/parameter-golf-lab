# Safety & Resource Rules

## Hard Rules (never break)

1. **No secrets in git.** `.env.local` is gitignored. If you need an API key, add it to `.env.local` and document the variable name (not the value) here.
2. **No autonomous loops.** Nothing in this repo starts itself. Agent templates are inert documents.
3. **No personal data.** All prompts, inputs, and outputs in experiments use synthetic or public-domain content.
4. **No private benchmarks.** Only publish results from public or self-created evaluation tasks.

## Soft Rules (use judgment)

5. **Prefer cheap models.** Use `gpt-4o-mini` or equivalent for parameter grid sweeps. Reserve expensive models for final validation.
6. **Cap experiment budgets.** Default max spend per experiment: $0.50 USD. Needs explicit override comment if exceeded.
7. **No Docker.** Keep local setup to `npm install` and `node`.
8. **No databases.** State lives in JSON files in `/board/` and `/experiments/`. This keeps the repo portable and auditable.

## Required Environment Variables

| Variable | Purpose | Where to get it |
|---|---|---|
| `OPENAI_API_KEY` | OpenAI API calls | platform.openai.com |

Add to `.env.local` (never commit).
