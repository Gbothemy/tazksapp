"use client";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";

const transactions = [
  { type: "credit", label: "Task: App Testing", amount: 1200, date: "Today, 2:30 PM" },
  { type: "credit", label: "Task: Survey #42", amount: 500, date: "Today, 10:15 AM" },
  { type: "debit", label: "Withdrawal to GTBank", amount: 3000, date: "Yesterday" },
  { type: "credit", label: "Task: Social Media x3", amount: 450, date: "Yesterday" },
  { type: "credit", label: "Referral Bonus", amount: 500, date: "Apr 18" },
  { type: "debit", label: "Withdrawal to Opay", amount: 2000, date: "Apr 17" },
];

export default function WalletPage() {
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !bank) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setAmount("");
    setBank("");
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        padding: "52px 20px 24px",
      }}>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>Available Balance</p>
        <p style={{ color: "#fff", fontSize: 38, fontWeight: 800, letterSpacing: -1 }}>₦4,750</p>
        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 16px" }}>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>Min. Withdrawal</p>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>₦1,000</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 16px" }}>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>Withdrawal Fee</p>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Free</p>
          </div>
        </div>
      </div>

      {/* Withdraw form */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
          <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: "#1e1b4b" }}>Withdraw Funds</p>

          {submitted && (
            <div style={{
              background: "#d1fae5", borderRadius: 10, padding: "12px 16px",
              marginBottom: 16, color: "#065f46", fontWeight: 600, fontSize: 13,
            }}>
              ✅ Withdrawal request submitted! Processing in 24hrs.
            </div>
          )}

          <form onSubmit={handleWithdraw} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Amount (₦)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                style={{
                  width: "100%", marginTop: 6, padding: "12px 14px",
                  borderRadius: 10, border: "1.5px solid #e5e7eb",
                  fontSize: 15, outline: "none", color: "#1e1b4b",
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Bank / Account</label>
              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                style={{
                  width: "100%", marginTop: 6, padding: "12px 14px",
                  borderRadius: 10, border: "1.5px solid #e5e7eb",
                  fontSize: 14, outline: "none", color: "#1e1b4b",
                  background: "#fff",
                }}
              >
                <option value="">Select bank</option>
                <option>GTBank — **** 4521</option>
                <option>Opay — **** 8832</option>
                <option>Palmpay — **** 1190</option>
              </select>
            </div>
            <button
              type="submit"
              style={{
                background: "#10b981", color: "#fff", border: "none",
                borderRadius: 12, padding: "14px", fontWeight: 700,
                fontSize: 15, cursor: "pointer", marginTop: 4,
              }}
            >
              Withdraw Now
            </button>
          </form>
        </div>
      </div>

      {/* Transaction history */}
      <div style={{ padding: "24px 16px 0" }}>
        <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 14, color: "#1e1b4b" }}>
          Transaction History
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {transactions.map((tx, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 14, padding: "14px 16px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: tx.type === "credit" ? "#d1fae5" : "#fee2e2",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16,
                }}>
                  {tx.type === "credit" ? "⬇️" : "⬆️"}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#1e1b4b" }}>{tx.label}</p>
                  <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{tx.date}</p>
                </div>
              </div>
              <p style={{
                fontWeight: 700, fontSize: 15,
                color: tx.type === "credit" ? "#10b981" : "#ef4444",
              }}>
                {tx.type === "credit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
