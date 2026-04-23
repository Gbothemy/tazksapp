import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL    = "admin@qeixova.com";
const ADMIN_PASSWORD = "Qeixova@Admin2025";
const ADMIN_TOKEN    = "qeixova-admin-2025";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_token", ADMIN_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });
    return res;
  }
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
