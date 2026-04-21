"use client";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/lib/useAuth";

interface Tx { type: string; label: string; amount: number; status: string; created_at: string; }

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  if (h < 48) return "Yesterday";
  return new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

const TX_ICONS: Record<string, string> = {
  "Task:": "✅", "Withdrawal": "🏦", "Referral": "👥", "default": "💰",
};
function txIcon(label: string) {
  for (const key of Object.keys(TX_ICONS)) {
    if (label.startsWith(key)) return TX_ICONS[key];
  }
  return TX_ICONS.default;
}

export default function WalletPage() {
  const { loading } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [bankAccounts, setBankAccounts] = useState<{ id: number; bank_name: string; account_number: string; account_name: string }[]>([]);

  const fetchWallet = () =>
    fetch("/api/wallet").then((r) => r.json()).then((d) => {
      if (d.balance !== undefined) setBalance(d.balance);
      if (d.transactions) setTransactions(d.transactions);
    });

  useEffect(() => {
    fetchWallet();
    fetch("/api/bank-accounts").then((r) => r.json()).then((d) => {
      if (d.accounts) setBankAccounts(d.accounts);
    });
  }, []);

  const handleWithdraw = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    const res = await fetch("/api/wallet/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), bank }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg({ type: "success", text: "Withdrawal request submitted! Processing within 24 hours." });
      setBalance(data.newBalance);
      setAmount(""); setBank("");
      fetchWallet();
    } else {
      setMsg({ type: "error", text: data.error || "Something went wrong" });
    }
    setSubmitting(false);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="page-body" style={{ background: "#f2f2f2", minHeight: "100vh" }}>
      <div className="page-header" style={{
        background: "linear-gradient(160deg, #4b7f52 0%, #3a6340 100%)",
        padding: "52px 20px 32px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(212,175,55,0.1)" }} />
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 4 }}>Points Balance</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ color: "#e8c84a", fontSize: 20 }}>⭐</span>
          <p style={{ color: "#fff", fontSize: 38, fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>
            {balance.toLocaleString()}
          </p>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>TKP</span>
        </div>
        <p style={{ color: "#e8c84a", fontSize: 14, fontWeight: 600, marginTop: 6 }}>
          ≈ ₦{(balance / 100).toLocaleString()} cash value
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          {[{ label: "Min. Withdrawal", value: "100,000 pts" }, { label: "Rate", value: "100 pts = ₦1" }, { label: "Fee", value: "Free" }].map((item) => (
            <div key={item.label} style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, marginBottom: 3 }}>{item.label}</p>
              <p style={{ color: "#e8c84a", fontWeight: 700, fontSize: 13 }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="wallet-layout" style={{ display: "block" }}>
        {/* Withdraw form */}
        <div style={{ padding: "20px 16px 0" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "22px 20px", boxShadow: "0 4px 20px rgba(75,127,82,0.10)", border: "1px solid #edf2ee" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #4b7f52, #5e9e67)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💸</div>
              <p style={{ fontWeight: 800, fontSize: 16, color: "#1a2e1c" }}>Withdraw Funds</p>
            </div>

            {msg && (
              <div style={{
                background: msg.type === "success" ? "#edf7ee" : "#fff5f5",
                border: `1px solid ${msg.type === "success" ? "#c3e6cb" : "#fed7d7"}`,
                borderRadius: 12, padding: "12px 16px", marginBottom: 16,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 18 }}>{msg.type === "success" ? "✅" : "⚠️"}</span>
                <p style={{ color: msg.type === "success" ? "#1a2e1c" : "#e53e3e", fontSize: 13, fontWeight: 600 }}>{msg.text}</p>
              </div>
            )}

            <form onSubmit={handleWithdraw} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: "#6b7c6d", fontWeight: 700, letterSpacing: 0.5 }}>POINTS TO CONVERT</label>
                <div style={{ position: "relative", marginTop: 8 }}>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Min. 100,000 pts"
                    style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1.5px solid #e0e8e1", fontSize: 16, outline: "none", color: "#1a2e1c", background: "#f9fbf9" }}
                    onFocus={(e) => (e.target.style.borderColor = "#4b7f52")}
                    onBlur={(e) => (e.target.style.borderColor = "#e0e8e1")}
                  />
                </div>
                {Number(amount) > 0 && (
                  <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, background: "#edf7ee", borderRadius: 8, padding: "7px 12px" }}>
                    <span style={{ fontSize: 14 }}>⭐</span>
                    <span style={{ fontSize: 13, color: "#4b7f52", fontWeight: 600 }}>{Number(amount).toLocaleString()} pts</span>
                    <span style={{ color: "#a0b0a2" }}>→</span>
                    <span style={{ fontSize: 13, color: "#4b7f52", fontWeight: 700 }}>₦{(Number(amount) / 100).toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#6b7c6d", fontWeight: 700, letterSpacing: 0.5 }}>BANK ACCOUNT</label>
                <select value={bank} onChange={(e) => setBank(e.target.value)}
                  style={{ width: "100%", marginTop: 8, padding: "14px 16px", borderRadius: 12, border: "1.5px solid #e0e8e1", fontSize: 14, outline: "none", color: "#1a2e1c", background: "#f9fbf9", cursor: "pointer" }}>
                  <option value="">Select bank account</option>
                  {bankAccounts.length > 0 ? (
                    bankAccounts.map((acc) => (
                      <option key={acc.id} value={`${acc.bank_name} — ${acc.account_number}`}>
                        {acc.bank_name} — {acc.account_number.replace(/(\d{3})(\d{4})(\d{3})/, "$1 $2 $3")} ({acc.account_name})
                      </option>
                    ))
                  ) : (
                    <option disabled>No accounts saved — add one in Profile</option>
                  )}
                </select>
              </div>
              <button type="submit" disabled={submitting} style={{
                background: submitting ? "#a0b0a2" : "linear-gradient(135deg, #d4af37, #b8961e)",
                color: "#fff", border: "none", borderRadius: 14, padding: "16px",
                fontWeight: 800, fontSize: 15, cursor: submitting ? "not-allowed" : "pointer",
                boxShadow: submitting ? "none" : "0 6px 20px rgba(212,175,55,0.35)", marginTop: 4,
              }}>
                {submitting ? "Processing..." : "Convert & Withdraw →"}
              </button>
            </form>
          </div>
        </div>

        {/* Transactions */}
        <div style={{ padding: "24px 16px 0" }}>
          <p style={{ fontWeight: 800, fontSize: 17, color: "#1a2e1c", marginBottom: 14 }}>Transaction History</p>
          {transactions.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 16, padding: "32px", textAlign: "center", border: "1px solid #edf2ee" }}>
              <p style={{ fontSize: 32 }}>📭</p>
              <p style={{ color: "#a0b0a2", marginTop: 8, fontSize: 14 }}>No transactions yet</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {transactions.map((tx, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(75,127,82,0.06)", border: "1px solid #edf2ee" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 13, background: tx.type === "credit" ? "#edf7ee" : "#fff5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                      {txIcon(tx.label)}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#1a2e1c" }}>{tx.label}</p>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 2 }}>
                        <p style={{ fontSize: 11, color: "#a0b0a2" }}>{timeAgo(tx.created_at)}</p>
                        {tx.status === "pending" && (
                          <span style={{ fontSize: 10, background: "#fdf8e1", color: "#b8961e", borderRadius: 4, padding: "1px 6px", fontWeight: 600 }}>Pending</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ background: tx.type === "credit" ? "#edf7ee" : "#fff5f5", borderRadius: 10, padding: "5px 12px" }}>
                    <p style={{ fontWeight: 800, fontSize: 13, color: tx.type === "credit" ? "#4b7f52" : "#e53e3e" }}>
                      {tx.type === "credit" ? "+" : "-"}{tx.amount.toLocaleString()} TKP
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f2f2f2" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>💰</div>
        <p style={{ color: "#4b7f52", fontWeight: 700 }}>Loading wallet...</p>
      </div>
    </div>
  );
}
