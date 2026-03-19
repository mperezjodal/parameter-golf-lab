import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const boardPath = join(process.cwd(), "data", "backlog.json");
    const raw = readFileSync(boardPath, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Board data not found" }, { status: 500 });
  }
}
