import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { signToken } from "@/lib/auth";

function makeReferralCode(name: string): string {
  const prefix = name.slice(0, 4).toUpperCase().replace(/\s/g, "");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${suffix}`;
}

export async function POST(req: NextRequest) {
  try {
    const { email, phone, fullName, password, referralCode } = await req.json();

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check existing user
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const myCode = makeReferralCode(fullName);

    // Resolve referrer
    let referrerId: number | null = null;
    if (referralCode) {
      const ref = await sql`SELECT id FROM users WHERE referral_code = ${referralCode}`;
      if (ref.length > 0) referrerId = ref[0].id;
    }

    const result = await sql`
      INSERT INTO users (email, phone, full_name, password, referral_code, referred_by, balance)
      VALUES (${email}, ${phone || null}, ${fullName}, ${hashed}, ${myCode}, ${referrerId}, ${referrerId ? 200 : 0})
      RETURNING id, email, full_name
    `;

    const user = result[0];

    // Credit referrer bonus
    if (referrerId) {
      await sql`UPDATE users SET balance = balance + 500 WHERE id = ${referrerId}`;
      await sql`
        INSERT INTO transactions (user_id, type, amount, label)
        VALUES (${referrerId}, 'credit', 500, 'Referral Bonus')
      `;
    }

    const token = signToken({ userId: user.id, email: user.email, fullName: user.full_name });

    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, fullName: user.full_name } });
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
