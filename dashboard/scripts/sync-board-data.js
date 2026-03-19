#!/usr/bin/env node
/**
 * sync-board-data.js
 *
 * Copies root board/*.json into dashboard/data/*.json so that Vercel builds
 * (which only see the dashboard/ subtree) have up-to-date committed data.
 *
 * Run manually:  node scripts/sync-board-data.js
 * Runs automatically via the "prebuild" npm script.
 *
 * If the source files are not found (e.g. inside a Vercel build context where
 * ../board/ is unavailable), the script exits 0 and the committed copies in
 * dashboard/data/ act as the fallback — no build failure.
 */

const { existsSync, copyFileSync, mkdirSync } = require("fs");
const { join } = require("path");

const root = join(__dirname, "..");
const boardDir = join(root, "..", "board");
const dataDir = join(root, "data");

const files = ["backlog.json", "runs.json"];

mkdirSync(dataDir, { recursive: true });

let synced = 0;
for (const file of files) {
  const src = join(boardDir, file);
  const dst = join(dataDir, file);
  if (existsSync(src)) {
    copyFileSync(src, dst);
    console.log(`synced board/${file} → dashboard/data/${file}`);
    synced++;
  } else {
    console.log(`board/${file} not found — keeping committed copy`);
  }
}

if (synced === 0) {
  console.log("No source files found. Using committed dashboard/data/ copies.");
}
