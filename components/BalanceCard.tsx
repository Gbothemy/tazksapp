interface BalanceCardProps {
  balance: number;
  todayEarned: number;
  tasksCompleted: number;
}

export default function BalanceCard({ balance, todayEarned, tasksCompleted }: BalanceCardProps) {
  return (
    <div style={{
      background: "linear-gradient(145deg, #4b7f52 0%, #3a6340 60%, #2d4f32 100%)",
      borderRadius: 24,
      padding: "28px 24px 24px",
      color: "#fff",
      margin: "0 16px",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 12px 40px rgba(75,127,82,0.35)",
    }}>
      {/* Gold accent top bar */}
      <div style={{
        position: "absolute", top: 0, left: 24, right: 24, height: 3,
        background: "linear-gradient(90deg, #d4af37, #e8c84a, #d4af37)",
        borderRadius: "0 0 4px 4px",
      }} />

      {/* Decorative circles */}
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 160, height: 160, borderRadius: "50%",
        background: "rgba(212,175,55,0.08)",
      }} />
      <div style={{
        position: "absolute", bottom: -30, left: -20,
        width: 120, height: 120, borderRadius: "50%",
        background: "rgba(255,255,255,0.04)",
      }} />
      <div style={{
        position: "absolute", bottom: 20, right: -10,
        width: 80, height: 80, borderRadius: "50%",
        background: "rgba(212,175,55,0.06)",
      }} />

      {/* Card chip icon */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 12, opacity: 0.7, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
            Total Balance
          </p>
          <p style={{ fontSize: 38, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1 }}>
            ₦{balance.toLocaleString()}
          </p>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: "rgba(212,175,55,0.2)",
          border: "1.5px solid rgba(212,175,55,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}>
          💳
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.12)", marginBottom: 18 }} />

      {/* Stats row */}
      <div style={{ display: "flex", gap: 0 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, opacity: 0.65, marginBottom: 4, letterSpacing: 0.5 }}>Today&apos;s Earnings</p>
          <p style={{ fontSize: 20, fontWeight: 700, color: "#e8c84a" }}>+₦{todayEarned.toLocaleString()}</p>
        </div>
        <div style={{ width: 1, background: "rgba(255,255,255,0.15)", margin: "0 20px" }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, opacity: 0.65, marginBottom: 4, letterSpacing: 0.5 }}>Tasks Done</p>
          <p style={{ fontSize: 20, fontWeight: 700 }}>{tasksCompleted} <span style={{ fontSize: 13, opacity: 0.7 }}>today</span></p>
        </div>
      </div>
    </div>
  );
}
