import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const runsPath = join(process.cwd(), "data", "runs.json");
    const raw = readFileSync(runsPath, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Runs data not found" }, { status: 500 });
  }
}
