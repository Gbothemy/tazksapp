"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/tasks", label: "Tasks", icon: "✅" },
  { href: "/wallet", label: "Wallet", icon: "💰" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: 480,
      background: "#ffffff",
      borderTop: "1px solid #e8ede9",
      display: "flex",
      zIndex: 50,
      boxShadow: "0 -4px 20px rgba(75,127,82,0.08)",
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
            color: active ? "#4b7f52" : "#a0b0a2",
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
                background: "linear-gradient(90deg, #4b7f52, #d4af37)",
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
