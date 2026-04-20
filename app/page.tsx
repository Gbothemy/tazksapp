"use client";
import BalanceCard from "@/components/BalanceCard";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";

const categories = [
  { icon: "📱", label: "Social Media", color: "#e8f5e9", count: 12, earn: "₦100–₦300" },
  { icon: "📋", label: "Surveys", color: "#fdf8e1", count: 8, earn: "₦300–₦700" },
  { icon: "🧪", label: "App Testing", color: "#e8f5e9", count: 5, earn: "₦800–₦2k" },
  { icon: "🎬", label: "Content", color: "#fdf8e1", count: 9, earn: "₦150–₦500" },
];

const recentActivity = [
  { label: "Liked 3 Instagram posts", amount: 150, time: "2h ago", icon: "📸" },
  { label: "Completed survey #42", amount: 500, time: "5h ago", icon: "📋" },
  { label: "Tested FoodApp v2.1", amount: 1200, time: "Yesterday", icon: "🧪" },
];

export default function Home() {
  return (
    <div style={{ paddingBottom: 90, background: "#f2f2f2", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(160deg, #4b7f52 0%, #3a6340 100%)",
        padding: "52px 20px 90px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* BG pattern */}
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 220, height: 220, borderRadius: "50%",
          background: "rgba(212,175,55,0.1)",
        }} />
        <div style={{
          position: "absolute", bottom: 20, left: -40,
          width: 140, height: 140, borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
        }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#d4af37",
                boxShadow: "0 0 8px #d4af37",
              }} />
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, letterSpacing: 0.3 }}>
                Good morning 👋
              </p>
            </div>
            <p style={{ color: "#fff", fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
              Welcome back!
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 13,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, cursor: "pointer",
            }}>🔔</div>
          </div>
        </div>

        {/* Streak badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(212,175,55,0.2)",
          border: "1px solid rgba(212,175,55,0.35)",
          borderRadius: 20, padding: "5px 14px", marginTop: 14,
        }}>
          <span style={{ fontSize: 14 }}>🔥</span>
          <span style={{ color: "#e8c84a", fontSize: 12, fontWeight: 700 }}>7-day streak — Keep it up!</span>
        </div>
      </div>

      {/* Balance card overlapping header */}
      <div style={{ marginTop: -64, position: "relative", zIndex: 10 }}>
        <BalanceCard balance={4750} todayEarned={650} tasksCompleted={7} />
      </div>

      {/* Quick actions */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/wallet" style={{
            flex: 1,
            background: "#ffffff",
            border: "1.5px solid #e0e8e1",
            color: "#4b7f52",
            borderRadius: 14, padding: "14px 0",
            textAlign: "center", fontWeight: 700, fontSize: 14,
            textDecoration: "none",
            boxShadow: "0 2px 10px rgba(75,127,82,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            💸 Withdraw
          </Link>
          <Link href="/tasks" style={{
            flex: 1,
            background: "linear-gradient(135deg, #d4af37, #b8961e)",
            color: "#fff",
            borderRadius: 14, padding: "14px 0",
            textAlign: "center", fontWeight: 700, fontSize: 14,
            textDecoration: "none",
            boxShadow: "0 4px 16px rgba(212,175,55,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            ✅ Earn Now
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: "28px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ fontWeight: 800, fontSize: 17, color: "#1a2e1c" }}>Task Categories</p>
          <Link href="/tasks" style={{ fontSize: 13, color: "#4b7f52", fontWeight: 600, textDecoration: "none" }}>
            See all →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {categories.map((cat) => (
            <Link key={cat.label} href="/tasks" style={{ textDecoration: "none" }}>
              <div style={{
                background: "#ffffff",
                borderRadius: 18,
                padding: "18px 16px",
                boxShadow: "0 2px 12px rgba(75,127,82,0.07)",
                border: "1px solid #edf2ee",
                transition: "transform 0.15s",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: cat.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, marginBottom: 12,
                }}>
                  {cat.icon}
                </div>
                <p style={{ fontWeight: 700, fontSize: 13, color: "#1a2e1c", marginBottom: 3 }}>
                  {cat.label}
                </p>
                <p style={{ fontSize: 11, color: "#a0b0a2", marginBottom: 6 }}>{cat.count} tasks</p>
                <p style={{
                  fontSize: 11, fontWeight: 700, color: "#d4af37",
                  background: "#fdf8e1", borderRadius: 6, padding: "2px 8px",
                  display: "inline-block",
                }}>
                  {cat.earn}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ padding: "28px 16px 0" }}>
        <p style={{ fontWeight: 800, fontSize: 17, color: "#1a2e1c", marginBottom: 16 }}>
          Recent Activity
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {recentActivity.map((item, i) => (
            <div key={i} style={{
              background: "#ffffff",
              borderRadius: 16,
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 2px 8px rgba(75,127,82,0.06)",
              border: "1px solid #edf2ee",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "#edf7ee",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18,
                }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1a2e1c" }}>{item.label}</p>
                  <p style={{ fontSize: 11, color: "#a0b0a2", marginTop: 2 }}>{item.time}</p>
                </div>
              </div>
              <div style={{
                background: "#edf7ee", borderRadius: 10, padding: "5px 12px",
              }}>
                <p style={{ fontWeight: 800, color: "#4b7f52", fontSize: 14 }}>+₦{item.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
