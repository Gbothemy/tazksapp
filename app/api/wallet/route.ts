import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [
      userRows,
      txRows,
      todayTaskRows,
      todayEarnRows,
      totalTaskRows,
      totalEarnRows,
      withdrawnRows,
    ] = await Promise.all([

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

      // Tasks completed TODAY
      sql`
        SELECT COUNT(*)::int AS count
        FROM completions
        WHERE user_id = ${session.userId}
          AND DATE(completed_at) = CURRENT_DATE
      `,

      // QTL earned TODAY (task credits only)
      sql`
        SELECT COALESCE(SUM(amount), 0)::int AS total
        FROM transactions
        WHERE user_id = ${session.userId}
          AND type = 'credit'
          AND label LIKE 'Task:%'
          AND DATE(created_at) = CURRENT_DATE
      `,

      // Total tasks completed ALL TIME
      sql`
        SELECT COUNT(*)::int AS count
        FROM completions
        WHERE user_id = ${session.userId}
      `,

      // Total QTL accumulated ALL TIME (all credits)
      sql`
        SELECT COALESCE(SUM(amount), 0)::int AS total
        FROM transactions
        WHERE user_id = ${session.userId}
          AND type = 'credit'
      `,

      // Total QTL withdrawn ALL TIME
      sql`
        SELECT COALESCE(SUM(amount), 0)::int AS total
        FROM transactions
        WHERE user_id = ${session.userId}
          AND type = 'debit'
      `,
    ]);

    return NextResponse.json({
      balance:           userRows[0]?.balance ?? 0,
      transactions:      txRows,
      stats: {
        tasks_today:       todayTaskRows[0]?.count ?? 0,
        today_earned:      todayEarnRows[0]?.total ?? 0,
        tasks_total:       totalTaskRows[0]?.count ?? 0,
        total_accumulated: totalEarnRows[0]?.total ?? 0,
        total_withdrawn:   withdrawnRows[0]?.total ?? 0,
      },
    });
  } catch (err) {
    console.error("Wallet API error:", err);
    return NextResponse.json({ error: "Failed to load wallet" }, { status: 500 });
  }
}
