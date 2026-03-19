# Run Observability

This document explains the observability model for Parameter Golf Lab agent sessions — how runs are recorded, tracked, and displayed on the dashboard.

## Model overview

Every agent invocation is a **run**. A run has a lifecycle (queued → running → done/failed), carries the exact prompt, tracks progress, and records evidence. All run data lives in `board/runs.json` — a plain JSON file, no external services, no daemons.

The dashboard reads `board/runs.json` at build time and renders a **Runs** section below the Kanban board, showing:
- Active/running runs with live status indicators
- Historical runs with prompt previews, results, and evidence
- Retrospective entries (reconstructed from git history) clearly marked

## File: board/runs.json

Schema version: `runs-v1`

### Run record fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `RUN-NNN` | Sequential run identifier |
| `agent` | string | Model ID of the agent (e.g. `claude-sonnet-4-6`) |
| `cardIds` | string[] | Kanban card IDs this run addresses |
| `status` | enum | `queued` · `running` · `review` · `done` · `failed` · `cancelled` |
| `startedAt` | ISO 8601 | When the run was queued/started |
| `updatedAt` | ISO 8601 | Last modification timestamp |
| `finishedAt` | ISO 8601 \| null | When the run completed (null if still active) |
| `prompt` | string | The full prompt sent to the agent |
| `promptSource` | enum | `exact` (verbatim) · `reconstructed` (recreated) · `retrospective` (inferred from evidence) |
| `currentTask` | string \| null | What the agent is currently doing (updated during run) |
| `summary` | string \| null | Human-readable outcome summary (set on finish) |
| `result` | enum \| null | `success` · `failure` · `partial` · `unknown` |
| `evidence` | string[] | Links to evidence: `commit:<sha>`, `file:<path>`, `url:<url>` |
| `files` | string[] | Files created or modified by this run |
| `retrospective` | boolean | True if this entry was seeded from history, not real-time logged |

### Evidence link format

Evidence strings use a prefix scheme so the dashboard can render them correctly:

```
commit:49f0b65          → rendered as short sha badge
file:docs/sizing-16mb.md → rendered as mono path badge
url:https://...          → rendered as clickable link
```

## Workflow: logging a future run

### Before launching the agent

```bash
node scripts/run.js create \
  --agent claude-sonnet-4-6 \
  --cards CARD-005 \
  --prompt "Survey papers on sub-100M parameter LMs (GPT-2 small, Mamba, RWKV). What architectures achieve best perplexity per parameter? Document findings in ideas/literature-scan.md."
```

This writes a new `RUN-NNN` entry with status `queued` and returns the ID.

### During the run (optional progress updates)

If an agent or a wrapper script wants to write progress:

```bash
node scripts/run.js update RUN-005 \
  --task "Searching arXiv for Mamba/RWKV/GPT-2 small comparisons"
```

This sets `currentTask` and auto-transitions status to `running`. Add new evidence or files at any point:

```bash
node scripts/run.js update RUN-005 \
  --task "Writing literature scan doc" \
  --files "ideas/literature-scan.md"
```

### After the run completes

```bash
node scripts/run.js finish RUN-005 \
  --result success \
  --summary "Surveyed 12 papers. SSM models show 15-20% param efficiency gain vs transformers at <50M scale. Weight tying confirmed beneficial across all architectures reviewed." \
  --files "ideas/literature-scan.md" \
  --evidence "file:ideas/literature-scan.md" \
  --evidence "commit:abc1234"
```

### Other commands

```bash
node scripts/run.js list        # tabular view of all runs
node scripts/run.js show RUN-005 # full JSON for one run
```

## Dashboard display

The `/` page renders the Runs section below the Kanban board:

- **Active** — runs with status `queued`, `running`, or `review`
- **History** — completed runs, newest first
- Per card: status badge (with animated dot for running), prompt collapse/expand, current task, summary, evidence chips, files list
- Retrospective entries show an italic `retrospective` label
- Reconstructed prompts show an amber warning when expanded

## Retrospective entries

Entries RUN-001 through RUN-003 were seeded from git commit history. Their `promptSource` is `"retrospective"` or `"reconstructed"` — meaning the prompt text is an approximation of what was sent, not a verbatim record. This is clearly indicated on the dashboard. All future runs logged via the `run.js` CLI will use `"exact"`.

## Vercel data packaging

Vercel builds with Root Directory = `dashboard/`, so `board/` is outside the build context. The dashboard reads from `dashboard/data/` instead:

- **Canonical source**: `board/backlog.json` and `board/runs.json` (repo root)
- **Dashboard copies**: `dashboard/data/backlog.json` and `dashboard/data/runs.json` (committed, used at build time)
- **Sync script**: `dashboard/scripts/sync-board-data.js` copies root → data/ when available
- **prebuild hook**: `npm run build` auto-runs the sync; on Vercel the sync no-ops and committed copies serve as fallback

**Workflow**: edit `board/*.json` as normal → run `npm run build` (or `npm run sync`) from `dashboard/` before committing → both files stay in sync.

## Design principles

- **File-backed**: canonical data in `board/runs.json` and `board/backlog.json`, committed to git
- **No daemons**: no background processes, no polling
- **Public-safe**: no secrets, no personal data, runs are safe to deploy publicly
- **Board-linked**: runs reference card IDs but are stored separately (board stays clean)
- **Observable by default**: the dashboard always shows current state from the file
- **One-shot friendly**: each agent invocation is one run; no multi-session state

## Future extensions

- Wrap the `run.js create` + agent launch in a shell function for convenience
- Add a `--status review` flag for runs that need human sign-off before closing
- Consider adding a `tags` field for experiment classification (e.g. `["sizing", "architecture"]`)
- The `/api/runs` endpoint makes the ledger accessible to external tools if needed
