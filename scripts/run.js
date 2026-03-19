#!/usr/bin/env node
/**
 * run.js — Run ledger CLI for Parameter Golf Lab
 *
 * Usage:
 *   node scripts/run.js create [options]   Create a new run record
 *   node scripts/run.js update <id>        Append a progress update to a run
 *   node scripts/run.js finish <id>        Mark a run as done/failed/cancelled
 *   node scripts/run.js list               List all runs with status
 *   node scripts/run.js show <id>          Show full details of a run
 *
 * Examples:
 *   node scripts/run.js create \
 *     --agent claude-sonnet-4-6 \
 *     --cards CARD-005 \
 *     --prompt "Survey papers on sub-100M parameter LMs. Document in ideas/."
 *
 *   node scripts/run.js update RUN-005 \
 *     --task "Searching arXiv for Mamba/RWKV/GPT-2 small comparisons"
 *
 *   node scripts/run.js finish RUN-005 \
 *     --result success \
 *     --summary "Surveyed 12 papers. Key finding: SSM models show 15-20% param efficiency gain vs transformers at <50M scale." \
 *     --files "ideas/literature-scan.md" \
 *     --evidence "file:ideas/literature-scan.md"
 */

"use strict";

const fs = require("fs");
const path = require("path");

const RUNS_PATH = path.join(__dirname, "..", "board", "runs.json");

// ── Utilities ─────────────────────────────────────────────────────────────────

function readRuns() {
  const raw = fs.readFileSync(RUNS_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeRuns(data) {
  fs.writeFileSync(RUNS_PATH, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function now() {
  return new Date().toISOString();
}

function nextRunId(runs) {
  const nums = runs
    .map((r) => {
      const m = r.id.match(/^RUN-(\d+)$/);
      return m ? parseInt(m[1], 10) : 0;
    })
    .filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `RUN-${String(max + 1).padStart(3, "0")}`;
}

function parseArgs(argv) {
  const args = {};
  let i = 0;
  while (i < argv.length) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : true;
      if (val !== true) i++;
      // Collect repeated flags as arrays
      if (args[key] !== undefined) {
        args[key] = Array.isArray(args[key]) ? [...args[key], val] : [args[key], val];
      } else {
        args[key] = val;
      }
    }
    i++;
  }
  return args;
}

function ensureArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return val.split(",").map((s) => s.trim()).filter(Boolean);
}

// ── Commands ──────────────────────────────────────────────────────────────────

function cmdCreate(argv) {
  const args = parseArgs(argv);
  if (!args.prompt) {
    console.error("Error: --prompt is required");
    process.exit(1);
  }
  const data = readRuns();
  const id = nextRunId(data.runs);
  const ts = now();
  const run = {
    id,
    agent: args.agent || "claude-sonnet-4-6",
    cardIds: ensureArray(args.cards),
    status: "queued",
    startedAt: ts,
    updatedAt: ts,
    finishedAt: null,
    prompt: args.prompt,
    promptSource: args["prompt-source"] || "exact",
    currentTask: null,
    summary: null,
    result: null,
    evidence: ensureArray(args.evidence),
    files: ensureArray(args.files),
    retrospective: false,
  };
  data.runs.push(run);
  writeRuns(data);
  console.log(`Created ${id}`);
  return id;
}

function cmdUpdate(argv) {
  const [id, ...rest] = argv;
  if (!id || !id.startsWith("RUN-")) {
    console.error("Error: provide a run ID (e.g. RUN-005)");
    process.exit(1);
  }
  const args = parseArgs(rest);
  const data = readRuns();
  const run = data.runs.find((r) => r.id === id);
  if (!run) {
    console.error(`Error: run ${id} not found`);
    process.exit(1);
  }
  const ts = now();
  if (args.task) run.currentTask = args.task;
  if (args.status) run.status = args.status;
  if (args.evidence) {
    run.evidence = [...run.evidence, ...ensureArray(args.evidence)];
  }
  if (args.files) {
    run.files = [...new Set([...run.files, ...ensureArray(args.files)])];
  }
  run.updatedAt = ts;
  if (run.status === "running" && args.task && run.status !== "queued") {
    // auto-transition from queued to running on first update with a task
  }
  if (run.status === "queued" && args.task) {
    run.status = "running";
  }
  writeRuns(data);
  console.log(`Updated ${id} (status: ${run.status})`);
}

function cmdFinish(argv) {
  const [id, ...rest] = argv;
  if (!id || !id.startsWith("RUN-")) {
    console.error("Error: provide a run ID (e.g. RUN-005)");
    process.exit(1);
  }
  const args = parseArgs(rest);
  const data = readRuns();
  const run = data.runs.find((r) => r.id === id);
  if (!run) {
    console.error(`Error: run ${id} not found`);
    process.exit(1);
  }
  const ts = now();
  const result = args.result || "success";
  if (!["success", "failure", "partial", "unknown"].includes(result)) {
    console.error(`Error: --result must be success|failure|partial|unknown`);
    process.exit(1);
  }
  run.status = result === "failure" ? "failed" : "done";
  if (args.status) run.status = args.status; // override if explicit
  run.result = result;
  run.finishedAt = ts;
  run.updatedAt = ts;
  run.currentTask = null;
  if (args.summary) run.summary = args.summary;
  if (args.evidence) {
    run.evidence = [...run.evidence, ...ensureArray(args.evidence)];
  }
  if (args.files) {
    run.files = [...new Set([...run.files, ...ensureArray(args.files)])];
  }
  writeRuns(data);
  console.log(`Finished ${id} → ${run.status} (${run.result})`);
}

function cmdList() {
  const data = readRuns();
  const STATUS_PAD = 10;
  console.log(`\n${"ID".padEnd(8)} ${"STATUS".padEnd(STATUS_PAD)} ${"RESULT".padEnd(8)} CARDS`);
  console.log("─".repeat(60));
  for (const run of data.runs) {
    const cards = run.cardIds.length > 0 ? run.cardIds.join(", ") : "—";
    const result = run.result ?? "—";
    const retro = run.retrospective ? " [retro]" : "";
    console.log(
      `${run.id.padEnd(8)} ${run.status.padEnd(STATUS_PAD)} ${result.padEnd(8)} ${cards}${retro}`
    );
  }
  console.log();
}

function cmdShow(argv) {
  const [id] = argv;
  if (!id) {
    console.error("Error: provide a run ID");
    process.exit(1);
  }
  const data = readRuns();
  const run = data.runs.find((r) => r.id === id);
  if (!run) {
    console.error(`Error: run ${id} not found`);
    process.exit(1);
  }
  console.log(JSON.stringify(run, null, 2));
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const [, , cmd, ...rest] = process.argv;

  switch (cmd) {
    case "create":
      cmdCreate(rest);
      break;
    case "update":
      cmdUpdate(rest);
      break;
    case "finish":
      cmdFinish(rest);
      break;
    case "list":
      cmdList();
      break;
    case "show":
      cmdShow(rest);
      break;
    default:
      console.log(`
Parameter Golf Lab — Run Ledger CLI

Commands:
  create   Create a new run record before launching an agent
  update   Append progress / task update to a run
  finish   Mark a run as complete with result and summary
  list     List all runs
  show     Show full JSON for a single run

Examples:
  node scripts/run.js create --prompt "Survey tiny LM papers" --cards CARD-005
  node scripts/run.js update RUN-005 --task "Searching arXiv..."
  node scripts/run.js finish RUN-005 --result success --summary "Found 12 relevant papers."
  node scripts/run.js list
  node scripts/run.js show RUN-005
`);
  }
}

main();
