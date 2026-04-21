import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [userRows, txRows, completionRows, earningsRows] = await Promise.all([
      // Current balance
      sql`SELECT balance FROM users WHERE id = ${session.userId}`,

      // Recent transactions
      sql`
        SELECT type, label, amount, status, created_at
        FROM transactions
        WHERE user_id = ${session.userId}
        ORDER BY created_at DESC
        LIMIT 20
      `,

      // Tasks completed today (separate query — no join with transactions)
      sql`
        SELECT COUNT(*)::int AS tasks_completed_today
        FROM completions
        WHERE user_id = ${session.userId}
          AND DATE(completed_at AT TIME ZONE 'Africa/Lagos') = CURRENT_DATE AT TIME ZONE 'Africa/Lagos'
      `,

      // QTL earned today from task credits only (separate query)
      sql`
        SELECT COALESCE(SUM(amount), 0)::int AS today_earned
        FROM transactions
        WHERE user_id = ${session.userId}
          AND type = 'credit'
          AND label LIKE 'Task:%'
          AND DATE(created_at AT TIME ZONE 'Africa/Lagos') = CURRENT_DATE AT TIME ZONE 'Africa/Lagos'
      `,
    ]);

    return NextResponse.json({
      balance: userRows[0]?.balance ?? 0,
      transactions: txRows,
      stats: {
        tasks_completed: completionRows[0]?.tasks_completed_today ?? 0,
        today_earned: earningsRows[0]?.today_earned ?? 0,
      },
    });
  } catch (err) {
    console.error("Wallet API error:", err);
    return NextResponse.json({ error: "Failed to load wallet" }, { status: 500 });
  }
}
