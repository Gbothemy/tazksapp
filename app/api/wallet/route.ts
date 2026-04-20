import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [userRows, txRows, statsRows] = await Promise.all([
    sql`SELECT balance FROM users WHERE id = ${session.userId}`,
    sql`
      SELECT type, label, amount, status, created_at
      FROM transactions
      WHERE user_id = ${session.userId}
      ORDER BY created_at DESC
      LIMIT 20
    `,
    sql`
      SELECT
        COUNT(c.id)::int AS tasks_completed,
        COALESCE(SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE 0 END), 0)::int AS total_earned,
        COALESCE(SUM(CASE WHEN DATE(t.created_at) = CURRENT_DATE AND t.type = 'credit' THEN t.amount ELSE 0 END), 0)::int AS today_earned
      FROM users u
      LEFT JOIN completions c ON c.user_id = u.id
      LEFT JOIN transactions t ON t.user_id = u.id
      WHERE u.id = ${session.userId}
    `,
  ]);

  return NextResponse.json({
    balance: userRows[0]?.balance ?? 0,
    transactions: txRows,
    stats: statsRows[0],
  });
}
