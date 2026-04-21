import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { taskId, proofValue } = body;
    if (!taskId) return NextResponse.json({ error: "taskId required" }, { status: 400 });

    const taskRows = await sql`SELECT * FROM tasks WHERE id = ${taskId} AND is_active = true`;
    if (taskRows.length === 0) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    const task = taskRows[0];

    const proofType = task.proof_type ?? "none";
    if (proofType !== "none" && !proofValue) {
      return NextResponse.json({ error: "Proof of completion is required" }, { status: 400 });
    }

    // Permanent check — once done, never again
    const already = await sql`
      SELECT id FROM completions
      WHERE user_id = ${session.userId} AND task_id = ${taskId}
    `;
    if (already.length > 0) {
      return NextResponse.json({ error: "You have already completed this task." }, { status: 409 });
    }

    const storedProof = proofValue?.startsWith("data:image")
      ? "[screenshot uploaded]"
      : (proofValue ?? null);

    await sql`
      INSERT INTO completions (user_id, task_id, proof_value)
      VALUES (${session.userId}, ${taskId}, ${storedProof})
    `;
    await sql`UPDATE users SET balance = balance + ${task.reward} WHERE id = ${session.userId}`;
    await sql`
      INSERT INTO transactions (user_id, type, amount, label)
      VALUES (${session.userId}, 'credit', ${task.reward}, ${"Task: " + task.title})
    `;

    const userRows = await sql`SELECT balance FROM users WHERE id = ${session.userId}`;
    return NextResponse.json({ ok: true, reward: task.reward, newBalance: userRows[0].balance });

  } catch (err) {
    console.error("Task complete error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
