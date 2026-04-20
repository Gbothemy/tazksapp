import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const rows = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (rows.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Update streak
    const today = new Date().toISOString().split("T")[0];
    const lastActive = user.last_active ? new Date(user.last_active).toISOString().split("T")[0] : null;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const newStreak = lastActive === yesterday ? user.streak + 1 : lastActive === today ? user.streak : 1;

    await sql`UPDATE users SET streak = ${newStreak}, last_active = ${today} WHERE id = ${user.id}`;

    const token = signToken({ userId: user.id, email: user.email, fullName: user.full_name });

    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, fullName: user.full_name },
    });
    res.cookies.set("auth_token", token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/",
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
