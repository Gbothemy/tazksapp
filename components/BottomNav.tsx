"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Home", icon: "🏠" },
  { href: "/tasks",     label: "Tasks", icon: "✅" },
  { href: "/wallet",    label: "Wallet", icon: "💰" },
  { href: "/profile",   label: "Profile", icon: "👤" },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav className="bottom-nav" style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      width: "100%",
      background: "#ffffff",
      borderTop: "1px solid #e0e0e0",
      display: "flex",
      zIndex: 50,
      boxShadow: "0 -4px 20px rgba(26,239,34,0.08)",
    }}>
      {nav.map((item) => {
        const active = path === item.href;
        return (
          <Link key={item.href} href={item.href} style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "10px 0 12px",
            textDecoration: "none",
            color: active ? "#1AEF22" : "#a0a0a0",
            fontSize: 10,
            fontWeight: active ? 700 : 500,
            gap: 3,
            letterSpacing: 0.3,
            position: "relative",
          }}>
            {active && (
              <div style={{
                position: "absolute",
                top: 0, left: "50%",
                transform: "translateX(-50%)",
                width: 32, height: 3,
                background: "linear-gradient(90deg, #1AEF22, #F5A623)",
                borderRadius: "0 0 4px 4px",
              }} />
            )}
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
