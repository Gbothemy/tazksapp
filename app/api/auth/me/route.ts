import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await sql`
    SELECT id, email, full_name, balance, streak, level, referral_code, created_at
    FROM users WHERE id = ${session.userId}
  `;
  if (rows.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ user: rows[0] });
}
