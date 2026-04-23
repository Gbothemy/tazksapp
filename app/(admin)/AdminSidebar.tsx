"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/tasks", label: "Tasks", icon: "📋" },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: "💸" },
  { href: "/admin/completions", label: "Completions", icon: "✅" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin-login");
  }

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 240,
        height: "100vh",
        background: "#1a2e1c",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "28px 24px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ color: "#d4af37", fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>
          Qeixova
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 2 }}>
          Admin Portal
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 0" }}>
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 24px",
                color: active ? "#d4af37" : "rgba(255,255,255,0.65)",
                background: active ? "rgba(212,175,55,0.1)" : "transparent",
                borderLeft: active ? "3px solid #d4af37" : "3px solid transparent",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "10px 16px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 8,
            color: "rgba(255,255,255,0.6)",
            cursor: "pointer",
            fontSize: 13,
            textAlign: "left",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
