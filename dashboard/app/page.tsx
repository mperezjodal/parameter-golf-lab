import { readFileSync } from "fs";
import { join } from "path";
import KanbanBoard from "@/components/KanbanBoard";
import RunsPanel, { RunsData } from "@/components/RunsPanel";

interface Card {
  id: string;
  title: string;
  description: string;
  column: string;
  labels: string[];
  created: string;
  priority: "high" | "medium" | "low";
}

interface BoardData {
  columns: string[];
  cards: Card[];
}

function getBoardData(): BoardData {
  try {
    const boardPath = join(process.cwd(), "..", "board", "backlog.json");
    const raw = readFileSync(boardPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {
      columns: ["backlog", "in-progress", "review", "done"],
      cards: [],
    };
  }
}

function getRunsData(): RunsData {
  try {
    const runsPath = join(process.cwd(), "..", "board", "runs.json");
    const raw = readFileSync(runsPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { schema: "runs-v1", runs: [] };
  }
}

export default function Home() {
  const board = getBoardData();
  const runs = getRunsData();
  return (
    <>
      <KanbanBoard board={board} />
      <div className="border-t border-zinc-200 dark:border-zinc-800" />
      <RunsPanel data={runs} />
    </>
  );
}
