import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const rows = await sql`SELECT id, email, full_name FROM users WHERE email = ${email.toLowerCase().trim()}`;

    // Always return success to prevent email enumeration
    if (rows.length === 0) {
      return NextResponse.json({ ok: true });
    }

    const user = rows[0];
    // Generate a short-lived reset token (15 min)
    const token = jwt.sign({ userId: user.id, purpose: "reset" }, SECRET, { expiresIn: "15m" });

    // In production you'd send an email here via SendGrid/Resend/etc.
    // For now, log the reset link so it can be used during development
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;
    console.log(`[Password Reset] ${user.email} → ${resetUrl}`);

    // Store token in DB so it can be validated
    await sql`
      INSERT INTO password_resets (user_id, token, expires_at)
      VALUES (${user.id}, ${token}, NOW() + INTERVAL '15 minutes')
      ON CONFLICT (user_id) DO UPDATE SET token = ${token}, expires_at = NOW() + INTERVAL '15 minutes'
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
