"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import BalanceCard from "@/components/BalanceCard";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/lib/useAuth";

interface WalletData {
  balance: number;
  stats: { tasks_completed: number; today_earned: number };
  transactions: { type: string; label: string; amount: number; created_at: string }[];
}

const categories = [
  { icon: "📱", label: "Social Media", color: "#e8f5e9", earn: "10k–15k QTL" },
  { icon: "📋", label: "Surveys",      color: "#fdf8e1", earn: "35k–50k QTL" },
  { icon: "🧪", label: "App Testing",  color: "#e8f5e9", earn: "80k–120k QTL" },
  { icon: "🎬", label: "Content",      color: "#fdf8e1", earn: "18k–20k QTL" },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  return "Yesterday";
}

export default function Home() {
  const { user, loading } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch("/api/wallet")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setWallet(d); })
      .catch(() => {});
  }, [user]);

  if (loading) return <LoadingScreen />;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="page-body" style={{ background: "#f2f2f2", minHeight: "100vh" }}>
      {/* Header */}
      <div className="page-header" style={{
        background: "linear-gradient(160deg, #4b7f52 0%, #3a6340 100%)",
        padding: "52px 20px 90px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(212,175,55,0.1)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#d4af37", boxShadow: "0 0 8px #d4af37" }} />
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>{greeting()} 👋</p>
            </div>
            <p style={{ color: "#fff", fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
              {user?.fullName?.split(" ")[0] ?? "Welcome back"}!
            </p>
          </div>
          <div style={{
            width: 42, height: 42, borderRadius: 13,
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>🔔</div>
        </div>
        {user && user.streak > 0 && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.35)",
            borderRadius: 20, padding: "5px 14px", marginTop: 14,
          }}>
            <span style={{ fontSize: 14 }}>🔥</span>
            <span style={{ color: "#e8c84a", fontSize: 12, fontWeight: 700 }}>
              {user.streak}-day streak — Keep it up!
            </span>
          </div>
        )}
      </div>

      {/* Balance card */}
      <div style={{ marginTop: -64, position: "relative", zIndex: 10 }}>
        <BalanceCard
          balance={wallet?.balance ?? user?.balance ?? 0}
          todayEarned={wallet?.stats?.today_earned ?? 0}
          tasksCompleted={wallet?.stats?.tasks_completed ?? 0}
        />
      </div>

      {/* Quick actions */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/wallet" style={{
            flex: 1, background: "#ffffff", border: "1.5px solid #e0e8e1", color: "#4b7f52",
            borderRadius: 14, padding: "14px 0", textAlign: "center", fontWeight: 700, fontSize: 14,
            textDecoration: "none", boxShadow: "0 2px 10px rgba(75,127,82,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>💸 Withdraw</Link>
          <Link href="/tasks" style={{            flex: 1, background: "linear-gradient(135deg, #d4af37, #b8961e)", color: "#fff",
            borderRadius: 14, padding: "14px 0", textAlign: "center", fontWeight: 700, fontSize: 14,
            textDecoration: "none", boxShadow: "0 4px 16px rgba(212,175,55,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>✅ Earn Now</Link>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: "28px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ fontWeight: 800, fontSize: 17, color: "#1a2e1c" }}>Task Categories</p>
          <Link href="/tasks" style={{ fontSize: 13, color: "#4b7f52", fontWeight: 600, textDecoration: "none" }}>See all →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="category-grid">
          {categories.map((cat) => (
            <Link key={cat.label} href="/tasks" style={{ textDecoration: "none" }}>
              <div style={{ background: "#ffffff", borderRadius: 18, padding: "18px 16px", boxShadow: "0 2px 12px rgba(75,127,82,0.07)", border: "1px solid #edf2ee" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: cat.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 12 }}>
                  {cat.icon}
                </div>
                <p style={{ fontWeight: 700, fontSize: 13, color: "#1a2e1c", marginBottom: 3 }}>{cat.label}</p>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#d4af37", background: "#fdf8e1", borderRadius: 6, padding: "2px 8px", display: "inline-block" }}>{cat.earn}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ padding: "28px 16px 0" }}>
        <p style={{ fontWeight: 800, fontSize: 17, color: "#1a2e1c", marginBottom: 16 }}>Recent Activity</p>
        {wallet?.transactions?.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {wallet.transactions.slice(0, 5).map((tx, i) => (
              <div key={i} style={{
                background: "#ffffff", borderRadius: 16, padding: "14px 16px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                boxShadow: "0 2px 8px rgba(75,127,82,0.06)", border: "1px solid #edf2ee",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: tx.type === "credit" ? "#edf7ee" : "#fff5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                    {tx.type === "credit" ? "💰" : "💸"}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1a2e1c" }}>{tx.label}</p>
                    <p style={{ fontSize: 11, color: "#a0b0a2", marginTop: 2 }}>{timeAgo(tx.created_at)}</p>
                  </div>
                </div>
                <div style={{ background: tx.type === "credit" ? "#edf7ee" : "#fff5f5", borderRadius: 10, padding: "5px 12px" }}>
                  <p style={{ fontWeight: 800, color: tx.type === "credit" ? "#4b7f52" : "#e53e3e", fontSize: 13 }}>
                    {tx.type === "credit" ? "+" : "-"}{tx.amount.toLocaleString()} QTL
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 16, padding: "32px", textAlign: "center", border: "1px solid #edf2ee" }}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>📭</p>
            <p style={{ color: "#a0b0a2", fontSize: 14 }}>No activity yet — complete your first task!</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f2f2f2" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
        <p style={{ color: "#4b7f52", fontWeight: 700 }}>Loading...</p>
      </div>
    </div>
  );
}
