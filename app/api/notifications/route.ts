import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";

const DEFAULTS = { task_alerts: true, reward_updates: true, referral_alerts: true, weekly_summary: false };

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const rows = await sql`SELECT prefs FROM notification_prefs WHERE user_id = ${session.userId}`;
    const prefs = rows.length > 0 ? rows[0].prefs : DEFAULTS;
    return NextResponse.json({ prefs });
  } catch {
    return NextResponse.json({ prefs: DEFAULTS });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prefs } = await req.json();

  await sql`
    INSERT INTO notification_prefs (user_id, prefs)
    VALUES (${session.userId}, ${JSON.stringify(prefs)})
    ON CONFLICT (user_id) DO UPDATE SET prefs = ${JSON.stringify(prefs)}
  `;

  return NextResponse.json({ ok: true });
}
