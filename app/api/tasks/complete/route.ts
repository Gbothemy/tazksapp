import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { verifyProof } from "@/lib/verifyProof";

// Level thresholds by total tasks completed
function calcLevel(totalTasks: number): number {
  if (totalTasks >= 50) return 5;
  if (totalTasks >= 30) return 4;
  if (totalTasks >= 15) return 3;
  if (totalTasks >= 5)  return 2;
  return 1;
}

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

    // Auto-verify proof
    const verification = await verifyProof(proofType, proofValue ?? "", task.title);
    if (!verification.valid) {
      return NextResponse.json({ error: verification.reason }, { status: 422 });
    }

    // Permanent check
    const already = await sql`
      SELECT id FROM completions WHERE user_id = ${session.userId} AND task_id = ${taskId}
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

    // Credit balance
    await sql`UPDATE users SET balance = balance + ${task.reward} WHERE id = ${session.userId}`;

    // Record transaction
    await sql`
      INSERT INTO transactions (user_id, type, amount, label)
      VALUES (${session.userId}, 'credit', ${task.reward}, ${"Task: " + task.title})
    `;

    // Update streak — if last_active was yesterday increment, if today keep, else reset to 1
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const userRows = await sql`SELECT balance, streak, last_active, level FROM users WHERE id = ${session.userId}`;
    const user = userRows[0];
    const lastActive = user.last_active ? new Date(user.last_active).toISOString().split("T")[0] : null;
    const newStreak = lastActive === yesterday ? user.streak + 1
      : lastActive === today ? user.streak
      : 1;

    // Update level based on total tasks completed
    const countRows = await sql`SELECT COUNT(*)::int AS total FROM completions WHERE user_id = ${session.userId}`;
    const newLevel = calcLevel(countRows[0].total);

    await sql`
      UPDATE users
      SET streak = ${newStreak}, last_active = ${today}, level = ${newLevel}
      WHERE id = ${session.userId}
    `;

    return NextResponse.json({
      ok: true,
      reward: task.reward,
      newBalance: user.balance + task.reward,
      newStreak,
      newLevel,
    });

  } catch (err) {
    console.error("Task complete error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
