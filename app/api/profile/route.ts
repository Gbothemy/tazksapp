import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await sql`
    SELECT
      u.id, u.email, u.full_name, u.phone, u.balance, u.streak,
      u.level, u.referral_code, u.created_at,
      COUNT(c.id)::int AS tasks_completed,
      COALESCE(SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE 0 END), 0)::int AS total_earned,
      (SELECT COUNT(*) FROM users WHERE referred_by = u.id)::int AS referral_count
    FROM users u
    LEFT JOIN completions c ON c.user_id = u.id
    LEFT JOIN transactions t ON t.user_id = u.id
    WHERE u.id = ${session.userId}
    GROUP BY u.id
  `;

  if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ profile: rows[0] });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { action } = body;

  if (action === "update_profile") {
    const { full_name, phone } = body;
    if (!full_name?.trim()) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }
    await sql`
      UPDATE users SET full_name = ${full_name.trim()}, phone = ${phone?.trim() || null}
      WHERE id = ${session.userId}
    `;
    return NextResponse.json({ ok: true });
  }

  if (action === "change_password") {
    const { current_password, new_password } = body;
    if (!current_password || !new_password) {
      return NextResponse.json({ error: "Both passwords are required" }, { status: 400 });
    }
    if (new_password.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
    }
    const rows = await sql`SELECT password FROM users WHERE id = ${session.userId}`;
    if (rows.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const valid = await bcrypt.compare(current_password, rows[0].password);
    if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });

    const hashed = await bcrypt.hash(new_password, 10);
    await sql`UPDATE users SET password = ${hashed} WHERE id = ${session.userId}`;
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
