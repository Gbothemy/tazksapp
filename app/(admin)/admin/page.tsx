import { getAdminSession } from "@/lib/adminAuth";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import DataManagement from "../DataManagement";

async function getStats() {
  const [users, earned, withdrawn, pending, completions, activeTasks] = await Promise.all([
    sql`SELECT COUNT(*)::int AS count FROM users`,
    sql`SELECT COALESCE(SUM(amount),0)::bigint AS total FROM transactions WHERE type='credit'`,
    sql`SELECT COALESCE(SUM(amount),0)::bigint AS total FROM transactions WHERE type='debit' AND status='completed'`,
    sql`SELECT COUNT(*)::int AS count FROM transactions WHERE type='debit' AND status='pending'`,
    sql`SELECT COUNT(*)::int AS count FROM completions`,
    sql`SELECT COUNT(*)::int AS count FROM tasks WHERE is_active=true`,
  ]);
  return {
    totalUsers: users[0].count,
    totalEarned: earned[0].total,
    totalWithdrawn: withdrawn[0].total,
    pendingWithdrawals: pending[0].count,
    totalCompletions: completions[0].count,
    activeTasks: activeTasks[0].count,
  };
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: "24px 28px",
        borderLeft: `4px solid ${color}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        <span style={{ fontSize: 13, color: "#888", fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#1a2e1c" }}>{value}</div>
    </div>
  );
}

function fmtQLT(n: number | bigint) {
  return Number(n).toLocaleString() + " QLT";
}

export default async function AdminDashboard() {
  const isAdmin = await getAdminSession();
  if (!isAdmin) redirect("/admin-login");

  const stats = await getStats();

  return (
    <div>
      <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 700, color: "#1a2e1c" }}>
        Dashboard
      </h1>
      <p style={{ margin: "0 0 32px", color: "#888", fontSize: 14 }}>
        Platform overview
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 20,
        }}
      >
        <StatCard label="Total Users" value={stats.totalUsers.toLocaleString()} icon="👥" color="#4b7f52" />
        <StatCard label="Total QLT Earned" value={fmtQLT(stats.totalEarned)} icon="💰" color="#d4af37" />
        <StatCard label="Total QLT Withdrawn" value={fmtQLT(stats.totalWithdrawn)} icon="🏦" color="#4b7f52" />
        <StatCard label="Pending Withdrawals" value={stats.pendingWithdrawals.toLocaleString()} icon="⏳" color="#e67e22" />
        <StatCard label="Total Completions" value={stats.totalCompletions.toLocaleString()} icon="✅" color="#4b7f52" />
        <StatCard label="Active Tasks" value={stats.activeTasks.toLocaleString()} icon="📋" color="#d4af37" />
      </div>

      <DataManagement />
    </div>
  );
}
