"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Home", icon: "🏠", desc: "Dashboard" },
  { href: "/tasks",     label: "Tasks", icon: "✅", desc: "Browse & earn" },
  { href: "/wallet",    label: "Wallet", icon: "💰", desc: "Balance & withdraw" },
  { href: "/profile",   label: "Profile", icon: "👤", desc: "Account settings" },
];

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{
        padding: "32px 24px 24px",
        borderBottom: "1px solid #edf2ee",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "linear-gradient(135deg, #4b7f52, #3a6340)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
            boxShadow: "0 4px 12px rgba(75,127,82,0.3)",
          }}>⚡</div>
          <div>
            <p style={{ fontWeight: 800, fontSize: 16, color: "#1a2e1c", letterSpacing: -0.5 }}>Qeixova</p>
            <p style={{ fontSize: 11, color: "#a0b0a2" }}>Earn by doing</p>
          </div>
        </div>
      </div>

      {/* Balance pill */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #edf2ee" }}>
        <div style={{
          background: "linear-gradient(135deg, #4b7f52, #3a6340)",
          borderRadius: 14, padding: "14px 16px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -20, right: -20,
            width: 80, height: 80, borderRadius: "50%",
            background: "rgba(212,175,55,0.12)",
          }} />
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Total Balance</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>₦4,750</p>
          <p style={{ fontSize: 11, color: "#e8c84a", marginTop: 4, fontWeight: 600 }}>+₦650 today</p>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ padding: "12px 12px", flex: 1 }}>
        <p style={{
          fontSize: 10, fontWeight: 700, color: "#a0b0a2",
          letterSpacing: 1.2, textTransform: "uppercase",
          padding: "8px 12px 4px",
        }}>Menu</p>
        {nav.map((item) => {
          const active = path === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px",
              borderRadius: 12,
              textDecoration: "none",
              background: active ? "linear-gradient(135deg, #edf7ee, #e0f0e2)" : "transparent",
              marginBottom: 2,
              transition: "background 0.15s",
              border: active ? "1px solid #c8e6cc" : "1px solid transparent",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: active
                  ? "linear-gradient(135deg, #4b7f52, #5e9e67)"
                  : "#f2f2f2",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17,
                boxShadow: active ? "0 3px 10px rgba(75,127,82,0.25)" : "none",
                flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <div>
                <p style={{
                  fontSize: 14, fontWeight: active ? 700 : 500,
                  color: active ? "#4b7f52" : "#1a2e1c",
                }}>
                  {item.label}
                </p>
                <p style={{ fontSize: 11, color: "#a0b0a2" }}>{item.desc}</p>
              </div>
              {active && (
                <div style={{
                  marginLeft: "auto",
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#4b7f52",
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ padding: "16px 20px 24px", borderTop: "1px solid #edf2ee" }}>
        <div style={{
          background: "linear-gradient(135deg, #d4af37, #b8961e)",
          borderRadius: 14, padding: "14px 16px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -15, right: -15,
            width: 60, height: 60, borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
          }} />
          <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 3 }}>
            🔥 7-day streak!
          </p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
            Keep completing tasks daily
          </p>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          marginTop: 14, padding: "0 4px",
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "linear-gradient(135deg, #d4af37, #b8961e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>👤</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#1a2e1c" }}>John Doe</p>
            <p style={{ fontSize: 11, color: "#a0b0a2" }}>Level 3 Earner ⭐</p>
          </div>
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              router.push("/login");
            }}
            title="Log out"
            style={{
              background: "#fff5f5", border: "1px solid #fed7d7",
              borderRadius: 8, width: 32, height: 32,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 15, flexShrink: 0,
            }}
          >
            🚪
          </button>
        </div>
      </div>
    </aside>
  );
}
