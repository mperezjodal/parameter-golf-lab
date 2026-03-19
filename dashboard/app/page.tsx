import { readFileSync } from "fs";
import { join } from "path";
import KanbanBoard from "@/components/KanbanBoard";

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

export default function Home() {
  const board = getBoardData();
  return <KanbanBoard board={board} />;
}
