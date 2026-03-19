# Safety & Resource Rules

## Hard Rules (never break)

1. **No secrets in git.** `.env.local` is gitignored. Document variable names
   here but never values.
2. **No training runs in this repo.** All GPU-intensive work happens on external
   hardware. This repo holds designs and findings only.
3. **No autonomous loops.** Nothing in this repo starts itself. Agent templates
   are inert documents — humans trigger them.
4. **No personal data.** All content uses synthetic or public-domain material.
5. **No private benchmarks.** Only publish results from public or self-created
   evaluation tasks.

## Soft Rules (use judgment)

6. **No Docker.** Local setup is `npm install` and `node` only.
7. **No databases.** State lives in JSON files in `/board/` and `/experiments/`.
   Portable and fully auditable.
8. **Estimate before running.** Any sizing calculation should include a parameter
   count and projected artifact size before committing to a design.

## Environment Variables (if any local tooling is added)

| Variable | Purpose | Where to get it |
|---|---|---|
| *(none required for dashboard)* | — | — |

If any local scripting tools are added later, document their required variables
here. Never commit values.
