import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // completed = done ever (permanent — no reset)
    const tasks = await sql`
      SELECT
        t.id, t.title, t.category, t.reward, t.duration,
        t.icon, t.color,
        COALESCE(t.instructions, '') AS instructions,
        COALESCE(t.steps, '{}') AS steps,
        COALESCE(t.proof_type, 'screenshot') AS proof_type,
        COALESCE(t.proof_label, 'Upload screenshot as proof') AS proof_label,
        COALESCE(t.max_screenshots, 1) AS max_screenshots,
        COALESCE(t.total_budget, 0) AS total_budget,
        COALESCE(t.budget_used, 0) AS budget_used,
        CASE WHEN c.id IS NOT NULL THEN true ELSE false END AS completed
      FROM tasks t
      LEFT JOIN completions c
        ON c.task_id = t.id AND c.user_id = ${session.userId}
      WHERE t.is_active = true
        AND (t.total_budget = 0 OR t.budget_used < t.total_budget)
      ORDER BY completed ASC, t.reward DESC
    `;

    return NextResponse.json({ tasks });
  } catch (err) {
    console.error("Tasks fetch error:", err);
    return NextResponse.json({ error: "Failed to load tasks" }, { status: 500 });
  }
}
