"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) { setDone(true); setTimeout(() => router.push("/login"), 2000); }
    else setError(data.error || "Reset failed. Please try again.");
  };

  return (
    <div style={{ background: "#fff", borderRadius: 24, padding: "36px 32px", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>
      {done ? (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontWeight: 800, fontSize: 20, color: "#1a2e1c", marginBottom: 10 }}>Password reset!</h2>
          <p style={{ fontSize: 14, color: "#6b7c6d" }}>Redirecting you to login...</p>
        </div>
      ) : (
        <>
          <h1 style={{ fontWeight: 800, fontSize: 22, color: "#1a2e1c", marginBottom: 6 }}>Set new password</h1>
          <p style={{ fontSize: 13, color: "#a0b0a2", marginBottom: 28 }}>Choose a strong password for your account.</p>
          {error && (
            <div style={{ background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 10, padding: "11px 14px", marginBottom: 16, fontSize: 13, color: "#e53e3e" }}>⚠️ {error}</div>
          )}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔒</span>
              <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "13px 14px 13px 42px", borderRadius: 12, border: "1.5px solid #e0e8e1", fontSize: 14, outline: "none", color: "#1a2e1c", background: "#f9fbf9" }}
                onFocus={(e) => (e.target.style.borderColor = "#4b7f52")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e8e1")}
              />
            </div>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔐</span>
              <input type="password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                style={{ width: "100%", padding: "13px 14px 13px 42px", borderRadius: 12, border: "1.5px solid #e0e8e1", fontSize: 14, outline: "none", color: "#1a2e1c", background: "#f9fbf9" }}
                onFocus={(e) => (e.target.style.borderColor = "#4b7f52")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e8e1")}
              />
            </div>
            <button type="submit" disabled={loading || !token} style={{ background: loading ? "#a0b0a2" : "linear-gradient(135deg, #4b7f52, #3a6340)", color: "#fff", border: "none", borderRadius: 14, padding: "15px", fontWeight: 800, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 6px 20px rgba(75,127,82,0.35)" }}>
              {loading ? "Resetting..." : "Reset Password →"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #4b7f52 0%, #3a6340 45%, #f2f2f2 45%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/login" style={{ textDecoration: "none", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #d4af37, #b8961e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: "0 8px 24px rgba(212,175,55,0.4)" }}>⚡</div>
            <span style={{ fontWeight: 900, fontSize: 22, color: "#fff", letterSpacing: -0.5 }}>Qeixova</span>
          </Link>
        </div>
        <Suspense fallback={<div style={{ background: "#fff", borderRadius: 24, padding: 36, textAlign: "center" }}>Loading...</div>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
