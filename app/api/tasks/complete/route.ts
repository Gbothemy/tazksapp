import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { taskId, proofValue } = await req.json();
  if (!taskId) return NextResponse.json({ error: "taskId required" }, { status: 400 });

  const taskRows = await sql`SELECT * FROM tasks WHERE id = ${taskId} AND is_active = true`;
  if (taskRows.length === 0) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  const task = taskRows[0];

  // Require proof for non-none tasks
  if (task.proof_type !== "none" && !proofValue) {
    return NextResponse.json({ error: "Proof of completion is required" }, { status: 400 });
  }

  const already = await sql`
    SELECT id FROM completions WHERE user_id = ${session.userId} AND task_id = ${taskId}
  `;
  if (already.length > 0) return NextResponse.json({ error: "Already completed" }, { status: 409 });

  await sql`
    INSERT INTO completions (user_id, task_id, proof_value)
    VALUES (${session.userId}, ${taskId}, ${proofValue ?? null})
  `;
  await sql`UPDATE users SET balance = balance + ${task.reward} WHERE id = ${session.userId}`;
  await sql`
    INSERT INTO transactions (user_id, type, amount, label)
    VALUES (${session.userId}, 'credit', ${task.reward}, ${"Task: " + task.title})
  `;

  const userRows = await sql`SELECT balance FROM users WHERE id = ${session.userId}`;
  return NextResponse.json({ ok: true, reward: task.reward, newBalance: userRows[0].balance });
}
