"use client";

import { useState } from "react";

export type RunStatus =
  | "queued"
  | "running"
  | "review"
  | "done"
  | "failed"
  | "cancelled";

export type RunResult = "success" | "failure" | "partial" | "unknown" | null;

export interface Run {
  id: string;
  agent: string;
  cardIds: string[];
  status: RunStatus;
  startedAt: string;
  updatedAt: string;
  finishedAt: string | null;
  prompt: string;
  promptSource: "exact" | "reconstructed" | "retrospective";
  currentTask: string | null;
  summary: string | null;
  result: RunResult;
  evidence: string[];
  files: string[];
  retrospective: boolean;
}

export interface RunsData {
  schema: string;
  runs: Run[];
}

const STATUS_STYLE: Record<RunStatus, string> = {
  queued: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  running: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  review:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  done: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  failed: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  cancelled: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500",
};

const STATUS_DOT: Record<RunStatus, string> = {
  queued: "bg-zinc-400",
  running: "bg-blue-500 animate-pulse",
  review: "bg-yellow-500",
  done: "bg-green-500",
  failed: "bg-red-500",
  cancelled: "bg-zinc-400",
};

const RESULT_STYLE: Record<string, string> = {
  success: "text-green-600 dark:text-green-400",
  failure: "text-red-600 dark:text-red-400",
  partial: "text-yellow-600 dark:text-yellow-400",
  unknown: "text-zinc-500",
};

const PROMPT_SOURCE_LABEL: Record<string, string> = {
  exact: "exact",
  reconstructed: "reconstructed",
  retrospective: "retrospective",
};

const PROMPT_SOURCE_STYLE: Record<string, string> = {
  exact: "text-zinc-500",
  reconstructed: "text-amber-600 dark:text-amber-400",
  retrospective: "text-amber-600 dark:text-amber-400",
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function EvidenceLink({ href }: { href: string }) {
  if (href.startsWith("commit:")) {
    const sha = href.replace("commit:", "");
    return (
      <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded">
        {sha.slice(0, 7)}
      </span>
    );
  }
  if (href.startsWith("file:")) {
    const path = href.replace("file:", "");
    return (
      <span className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded">
        {path}
      </span>
    );
  }
  if (href.startsWith("url:")) {
    const url = href.replace("url:", "");
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-600 dark:text-blue-400 underline underline-offset-2 break-all"
      >
        {url}
      </a>
    );
  }
  return (
    <span className="text-xs text-zinc-500 break-all">{href}</span>
  );
}

function RunCard({ run }: { run: Run }) {
  const [promptOpen, setPromptOpen] = useState(false);
  const [filesOpen, setFilesOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm">
      {/* Header row */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-zinc-400">{run.id}</span>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2 py-0.5 ${STATUS_STYLE[run.status]}`}
            >
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full ${STATUS_DOT[run.status]}`}
              />
              {run.status}
            </span>
            {run.retrospective && (
              <span className="text-xs text-zinc-400 italic">retrospective</span>
            )}
            {run.result && (
              <span
                className={`text-xs font-medium ${RESULT_STYLE[run.result] ?? ""}`}
              >
                · {run.result}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-zinc-500 font-mono">{run.agent}</span>
            {run.cardIds.length > 0 && (
              <span className="text-xs text-zinc-400">
                {run.cardIds.join(", ")}
              </span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-zinc-400">{formatDate(run.startedAt)}</p>
          {run.finishedAt && (
            <p className="text-xs text-zinc-400">
              → {formatDate(run.finishedAt)}
            </p>
          )}
        </div>
      </div>

      {/* Prompt section */}
      <div className="mb-3">
        <button
          onClick={() => setPromptOpen((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <span>{promptOpen ? "▾" : "▸"}</span>
          <span>Prompt</span>
          <span className={`text-xs ${PROMPT_SOURCE_STYLE[run.promptSource]}`}>
            ({PROMPT_SOURCE_LABEL[run.promptSource]})
          </span>
        </button>
        {promptOpen && (
          <div className="mt-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap font-mono border border-zinc-200 dark:border-zinc-700">
            {run.prompt}
            {run.promptSource !== "exact" && (
              <p className="mt-2 text-amber-600 dark:text-amber-400 not-italic font-sans">
                ⚠ Prompt {run.promptSource === "reconstructed" ? "reconstructed" : "inferred"} from evidence — not verbatim.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Current task / progress */}
      {run.currentTask && (
        <div className="mb-3 flex items-start gap-2">
          <span className="text-xs text-zinc-500 shrink-0 mt-0.5">↳</span>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">
            {run.currentTask}
          </p>
        </div>
      )}

      {/* Summary */}
      {run.summary && (
        <div className="mb-3">
          <p className="text-xs text-zinc-500 font-medium mb-1">Summary</p>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {run.summary}
          </p>
        </div>
      )}

      {/* Evidence */}
      {run.evidence.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-zinc-500 font-medium mb-1">Evidence</p>
          <div className="flex flex-wrap gap-1.5">
            {run.evidence.map((e, i) => (
              <EvidenceLink key={i} href={e} />
            ))}
          </div>
        </div>
      )}

      {/* Files touched */}
      {run.files.length > 0 && (
        <div>
          <button
            onClick={() => setFilesOpen((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            <span>{filesOpen ? "▾" : "▸"}</span>
            <span>
              {run.files.length} file{run.files.length !== 1 ? "s" : ""} touched
            </span>
          </button>
          {filesOpen && (
            <div className="mt-2 flex flex-wrap gap-1">
              {run.files.map((f) => (
                <span
                  key={f}
                  className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded"
                >
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RunsPanel({ data }: { data: RunsData }) {
  const activeRuns = data.runs.filter(
    (r) => r.status === "running" || r.status === "queued" || r.status === "review"
  );
  const recentRuns = data.runs
    .filter((r) => r.status === "done" || r.status === "failed" || r.status === "cancelled")
    .slice()
    .reverse();

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
            Agent Runs
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {data.runs.length} total · {activeRuns.length} active ·{" "}
            {data.runs.filter((r) => r.retrospective).length} retrospective
          </p>
        </div>
        <span className="text-xs font-mono text-zinc-400">{data.schema}</span>
      </div>

      {activeRuns.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-zinc-500 font-medium mb-3 uppercase tracking-wide">
            Active
          </p>
          <div className="flex flex-col gap-3">
            {activeRuns.map((run) => (
              <RunCard key={run.id} run={run} />
            ))}
          </div>
        </div>
      )}

      {recentRuns.length > 0 && (
        <div>
          <p className="text-xs text-zinc-500 font-medium mb-3 uppercase tracking-wide">
            History
          </p>
          <div className="flex flex-col gap-3">
            {recentRuns.map((run) => (
              <RunCard key={run.id} run={run} />
            ))}
          </div>
        </div>
      )}

      {data.runs.length === 0 && (
        <div className="text-xs text-zinc-400 italic py-8 text-center border border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg">
          No runs recorded yet.
        </div>
      )}
    </section>
  );
}
