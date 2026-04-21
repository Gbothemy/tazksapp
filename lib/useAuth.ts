"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  balance: number;
  streak: number;
  level: number;
  referralCode: string;
}

export function useAuth(redirectIfUnauth = true) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            fullName: data.user.full_name,
            balance: data.user.balance,
            streak: data.user.streak,
            level: data.user.level,
            referralCode: data.user.referral_code,
          });
        } else if (redirectIfUnauth) {
          router.push("/login");
        }
      })
      .catch(() => { if (redirectIfUnauth) router.push("/login"); })
      .finally(() => setLoading(false));
  }, [router, redirectIfUnauth]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return { user, loading, logout };
}
