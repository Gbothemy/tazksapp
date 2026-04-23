import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/adminAuth";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!await checkAdminAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page      = Math.max(1, Number(searchParams.get("page") ?? 1));
  const proofType = searchParams.get("proof_type") ?? "";
  const limit     = 30;
  const offset    = (page - 1) * limit;

  const [completions, countRows] = await Promise.all([
    proofType
      ? sql`
          SELECT c.id, c.proof_value, c.completed_at,
            u.full_name AS user_name, u.email,
            t.title AS task_title, t.proof_type, t.category
          FROM completions c
          JOIN users u ON u.id = c.user_id
          JOIN tasks t ON t.id = c.task_id
          WHERE t.proof_type = ${proofType}
          ORDER BY c.completed_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `
      : sql`
          SELECT c.id, c.proof_value, c.completed_at,
            u.full_name AS user_name, u.email,
            t.title AS task_title, t.proof_type, t.category
          FROM completions c
          JOIN users u ON u.id = c.user_id
          JOIN tasks t ON t.id = c.task_id
          ORDER BY c.completed_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `,
    proofType
      ? sql`SELECT COUNT(*)::int AS total FROM completions c JOIN tasks t ON t.id = c.task_id WHERE t.proof_type = ${proofType}`
      : sql`SELECT COUNT(*)::int AS total FROM completions`,
  ]);

  return NextResponse.json({ completions, total: countRows[0].total });
}
