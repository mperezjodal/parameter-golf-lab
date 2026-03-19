"use client";

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

const PRIORITY_COLOR: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

const LABEL_COLOR: Record<string, string> = {
  setup: "bg-purple-100 text-purple-700",
  infra: "bg-blue-100 text-blue-700",
  deploy: "bg-indigo-100 text-indigo-700",
  public: "bg-teal-100 text-teal-700",
  experiment: "bg-orange-100 text-orange-700",
  research: "bg-sky-100 text-sky-700",
  symphony: "bg-pink-100 text-pink-700",
  planning: "bg-violet-100 text-violet-700",
  dev: "bg-slate-100 text-slate-700",
  dashboard: "bg-cyan-100 text-cyan-700",
  ideas: "bg-amber-100 text-amber-700",
  tracking: "bg-lime-100 text-lime-700",
  agents: "bg-emerald-100 text-emerald-700",
};

const COLUMN_LABEL: Record<string, string> = {
  backlog: "Backlog",
  "in-progress": "In Progress",
  review: "Review",
  done: "Done",
};

export default function KanbanBoard({ board }: { board: BoardData }) {
  const cardsByColumn = board.columns.reduce<Record<string, Card[]>>(
    (acc, col) => {
      acc[col] = board.cards.filter((c) => c.column === col);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Parameter Golf Lab
            </h1>
            <p className="text-xs text-zinc-500">
              {board.cards.length} cards &middot;{" "}
              {board.cards.filter((c) => c.column === "done").length} done
            </p>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            OpenAI Parameter Golf
          </span>
        </div>
      </header>

      {/* Board */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile: vertical stack */}
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-4 lg:overflow-x-auto">
          {board.columns.map((col) => {
            const cards = cardsByColumn[col] ?? [];
            return (
              <div
                key={col}
                className="lg:min-w-[260px] lg:max-w-[300px] lg:flex-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                    {COLUMN_LABEL[col] ?? col}
                  </h2>
                  <span className="text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-full px-2 py-0.5">
                    {cards.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {cards.length === 0 && (
                    <div className="text-xs text-zinc-400 italic py-4 text-center border border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg">
                      Empty
                    </div>
                  )}
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-mono text-zinc-400">
                          {card.id}
                        </span>
                        <span
                          className={`text-xs rounded-full px-2 py-0.5 font-medium ${PRIORITY_COLOR[card.priority] ?? ""}`}
                        >
                          {card.priority}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                        {card.title}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed">
                        {card.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {card.labels.map((label) => (
                          <span
                            key={label}
                            className={`text-xs rounded-full px-2 py-0.5 font-medium ${LABEL_COLOR[label] ?? "bg-zinc-100 text-zinc-600"}`}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-zinc-400 mt-2">{card.created}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
