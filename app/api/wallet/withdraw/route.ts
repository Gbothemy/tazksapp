import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { amount, bank } = await req.json();
  const amt = Number(amount);

  if (!amt || amt < 100000) {
    return NextResponse.json({ error: "Minimum withdrawal is 100,000 points (₦1,000)" }, { status: 400 });
  }
  if (!bank) {
    return NextResponse.json({ error: "Bank account required" }, { status: 400 });
  }

  const userRows = await sql`SELECT balance FROM users WHERE id = ${session.userId}`;
  if (userRows[0].balance < amt) {
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
  }

  await sql`UPDATE users SET balance = balance - ${amt} WHERE id = ${session.userId}`;
  await sql`
    INSERT INTO transactions (user_id, type, amount, label, status)
    VALUES (${session.userId}, 'debit', ${amt}, ${"Withdrawal to " + bank}, 'pending')
  `;

  const updated = await sql`SELECT balance FROM users WHERE id = ${session.userId}`;
  return NextResponse.json({ ok: true, newBalance: updated[0].balance });
}
