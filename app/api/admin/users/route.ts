import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!await checkAdminAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const page   = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit  = 20;
  const offset = (page - 1) * limit;

  // Ensure banned column exists
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS banned BOOLEAN NOT NULL DEFAULT FALSE`;

  const [users, countRows] = await Promise.all([
    search
      ? sql`
          SELECT u.id, u.full_name, u.email, u.balance, u.created_at, u.banned,
            COUNT(c.id)::int AS tasks_completed
          FROM users u
          LEFT JOIN completions c ON c.user_id = u.id
          WHERE u.full_name ILIKE ${"%" + search + "%"} OR u.email ILIKE ${"%" + search + "%"}
          GROUP BY u.id
          ORDER BY u.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `
      : sql`
          SELECT u.id, u.full_name, u.email, u.balance, u.created_at, u.banned,
            COUNT(c.id)::int AS tasks_completed
          FROM users u
          LEFT JOIN completions c ON c.user_id = u.id
          GROUP BY u.id
          ORDER BY u.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `,
    search
      ? sql`SELECT COUNT(*)::int AS total FROM users WHERE full_name ILIKE ${"%" + search + "%"} OR email ILIKE ${"%" + search + "%"}`
      : sql`SELECT COUNT(*)::int AS total FROM users`,
  ]);

  return NextResponse.json({ users, total: countRows[0].total });
}

export async function PATCH(req: NextRequest) {
  if (!await checkAdminAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, action } = await req.json();
  if (!id || !action) return NextResponse.json({ error: "id and action required" }, { status: 400 });

  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS banned BOOLEAN NOT NULL DEFAULT FALSE`;

  if (action === "ban") {
    await sql`UPDATE users SET banned = TRUE WHERE id = ${id}`;
  } else if (action === "unban") {
    await sql`UPDATE users SET banned = FALSE WHERE id = ${id}`;
  } else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
