"use client";
import BottomNav from "@/components/BottomNav";

const stats = [
  { label: "Tasks Done", value: "47" },
  { label: "Total Earned", value: "₦18,450" },
  { label: "Referrals", value: "3" },
];

const menuItems = [
  { icon: "🏦", label: "Bank Accounts", sub: "Manage withdrawal accounts" },
  { icon: "👥", label: "Refer & Earn", sub: "Earn ₦500 per referral" },
  { icon: "🔔", label: "Notifications", sub: "Task alerts & updates" },
  { icon: "🔒", label: "Security", sub: "PIN & password settings" },
  { icon: "📞", label: "Support", sub: "Get help anytime" },
  { icon: "📄", label: "Terms & Privacy", sub: "Legal information" },
];

export default function ProfilePage() {
  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
        padding: "52px 20px 32px",
        textAlign: "center",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32, margin: "0 auto 12px",
        }}>
          👤
        </div>
        <p style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>John Doe</p>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 2 }}>
          [email]@example.com
        </p>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(255,255,255,0.15)", borderRadius: 20,
          padding: "5px 14px", marginTop: 10,
        }}>
          <span style={{ fontSize: 12 }}>⭐</span>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>Level 3 Earner</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "0 16px", marginTop: -20 }}>
        <div style={{
          background: "#fff", borderRadius: 16, padding: "16px 20px",
          display: "flex", justifyContent: "space-around",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <p style={{ fontWeight: 800, fontSize: 18, color: "#4f46e5" }}>{s.value}</p>
              <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Referral banner */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{
          background: "linear-gradient(135deg, #10b981, #059669)",
          borderRadius: 16, padding: "16px 20px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Refer & Earn ₦500</p>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 }}>
              Share your code: TAZK-J4D9
            </p>
          </div>
          <button style={{
            background: "#fff", color: "#10b981", border: "none",
            borderRadius: 10, padding: "8px 16px", fontWeight: 700,
            fontSize: 13, cursor: "pointer",
          }}>
            Share
          </button>
        </div>
      </div>

      {/* Menu */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          {menuItems.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "15px 16px",
                borderBottom: i < menuItems.length - 1 ? "1px solid #f3f4f6" : "none",
                cursor: "pointer",
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "#f3f4f6",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1e1b4b" }}>{item.label}</p>
                <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>{item.sub}</p>
              </div>
              <span style={{ color: "#d1d5db", fontSize: 18 }}>›</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div style={{ padding: "16px 16px 0" }}>
        <button style={{
          width: "100%", background: "#fff", color: "#ef4444",
          border: "1.5px solid #fee2e2", borderRadius: 14,
          padding: "14px", fontWeight: 700, fontSize: 15, cursor: "pointer",
        }}>
          🚪 Log Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
