interface BalanceCardProps {
  balance: number;       // in points
  todayEarned: number;   // in points
  tasksCompleted: number;
}

// 100 points = ₦1
const toNaira = (pts: number) => (pts / 100).toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export default function BalanceCard({ balance, todayEarned, tasksCompleted }: BalanceCardProps) {
  return (
    <div style={{
      background: "linear-gradient(145deg, #4b7f52 0%, #3a6340 60%, #2d4f32 100%)",
      borderRadius: 24, padding: "28px 24px 24px", color: "#fff",
      margin: "0 16px", position: "relative", overflow: "hidden",
      boxShadow: "0 12px 40px rgba(75,127,82,0.35)",
    }}>
      {/* Gold top bar */}
      <div style={{ position: "absolute", top: 0, left: 24, right: 24, height: 3, background: "linear-gradient(90deg, #d4af37, #e8c84a, #d4af37)", borderRadius: "0 0 4px 4px" }} />
      {/* Decorative circles */}
      <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(212,175,55,0.08)" }} />
      <div style={{ position: "absolute", bottom: -30, left: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div>
          <p style={{ fontSize: 11, opacity: 0.7, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Total Points</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 14, color: "#e8c84a" }}>⭐</span>
            <p style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1 }}>
              {balance.toLocaleString()}
            </p>
            <span style={{ fontSize: 13, opacity: 0.6 }}>TKP</span>
          </div>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(212,175,55,0.2)", border: "1.5px solid rgba(212,175,55,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
          💳
        </div>
      </div>

      {/* Cash equivalent */}
      <div style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: "7px 12px", marginBottom: 18, display: "inline-flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 12, opacity: 0.7 }}>≈</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#e8c84a" }}>₦{toNaira(balance)}</span>
        <span style={{ fontSize: 11, opacity: 0.6 }}>cash value</span>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.12)", marginBottom: 18 }} />

      {/* Stats row */}
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, opacity: 0.65, marginBottom: 4, letterSpacing: 0.5 }}>Today&apos;s Points</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: "#e8c84a" }}>+{todayEarned.toLocaleString()} <span style={{ fontSize: 11 }}>TKP</span></p>
        </div>
        <div style={{ width: 1, background: "rgba(255,255,255,0.15)", margin: "0 20px" }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, opacity: 0.65, marginBottom: 4, letterSpacing: 0.5 }}>Tasks Done</p>
          <p style={{ fontSize: 18, fontWeight: 700 }}>{tasksCompleted} <span style={{ fontSize: 13, opacity: 0.7 }}>today</span></p>
        </div>
      </div>
    </div>
  );
}
