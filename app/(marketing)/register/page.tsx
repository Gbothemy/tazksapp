"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const steps = ["Account", "Personal", "Security"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    email: "",
    phone: "",
    fullName: "",
    referralCode: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  const set = (key: string, val: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.email) e.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
      if (!form.phone) e.phone = "Phone number is required";
    }
    if (step === 1) {
      if (!form.fullName) e.fullName = "Full name is required";
      if (!form.referralCode.trim()) e.referralCode = "A referral code is required to register";
    }
    if (step === 2) {
      if (!form.password) e.password = "Password is required";
      else if (form.password.length < 6) e.password = "Minimum 6 characters";
      if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
      if (!form.agreed) e.agreed = "You must accept the terms";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = async () => {
    if (!validateStep()) return;
    if (step < 2) { setStep(step + 1); return; }
    // Step 2 final submit
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        phone: form.phone,
        fullName: form.fullName,
        password: form.password,
        referralCode: form.referralCode || undefined,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push("/");
    } else {
      setErrors({ submit: data.error || "Registration failed" });
    }
    setLoading(false);
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%", padding: "13px 14px 13px 42px",
    borderRadius: 12,
    border: `1.5px solid ${errors[field] ? "#e53e3e" : "#e0e8e1"}`,
    fontSize: 14, outline: "none", color: "#1a2e1c",
    background: "#f9fbf9", transition: "border-color 0.2s",
  });

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #3a6340 0%, #4b7f52 40%, #f2f2f2 40%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 16px",
    }}>
      {/* Blobs */}
      <div style={{
        position: "fixed", top: -100, left: -100,
        width: 360, height: 360, borderRadius: "50%",
        background: "rgba(212,175,55,0.08)", pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: -60, right: -60,
        width: 240, height: 240, borderRadius: "50%",
        background: "rgba(255,255,255,0.05)", pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 460 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Link href="/landing" style={{ textDecoration: "none", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "linear-gradient(135deg, #d4af37, #b8961e)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, boxShadow: "0 8px 24px rgba(212,175,55,0.4)",
            }}>⚡</div>
            <span style={{ fontWeight: 900, fontSize: 20, color: "#fff", letterSpacing: -0.5 }}>TazKsApp</span>
          </Link>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 }}>
            Create your free account and start earning
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#fff", borderRadius: 24,
          padding: "32px 28px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
        }}>

          {/* Step header */}
          <div style={{ marginBottom: 28 }}>
            {errors.submit && (
              <div style={{ background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 10, padding: "11px 14px", marginBottom: 16, fontSize: 13, color: "#e53e3e" }}>
                ⚠️ {errors.submit}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <h1 style={{ fontWeight: 800, fontSize: 20, color: "#1a2e1c" }}>
                  {step === 0 && "Create account"}
                  {step === 1 && "Your details"}
                  {step === 2 && "Set password"}
                </h1>
                <p style={{ fontSize: 12, color: "#a0b0a2", marginTop: 2 }}>
                  Step {step + 1} of {steps.length}
                </p>
              </div>
              {/* Step pills */}
              <div style={{ display: "flex", gap: 6 }}>
                {steps.map((s, i) => (
                  <div key={s} style={{
                    width: i === step ? 28 : 8, height: 8, borderRadius: 4,
                    background: i <= step ? "#4b7f52" : "#e0e8e1",
                    transition: "all 0.3s",
                  }} />
                ))}
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ height: 4, background: "#f2f2f2", borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${progress}%`,
                background: "linear-gradient(90deg, #4b7f52, #d4af37)",
                borderRadius: 4, transition: "width 0.4s ease",
              }} />
            </div>
          </div>

          {/* ── STEP 0: Account ── */}
          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <p style={{ fontSize: 13, color: "#a0b0a2" }}>
                Already have an account?{" "}
                <Link href="/login" style={{ color: "#4b7f52", fontWeight: 700, textDecoration: "none" }}>
                  Sign in
                </Link>
              </p>

              {/* Email */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#6b7c6d", letterSpacing: 0.5 }}>EMAIL ADDRESS</label>
                <div style={{ position: "relative", marginTop: 8 }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>📧</span>
                  <input
                    type="email" placeholder="you@example.com"
                    value={form.email} onChange={(e) => set("email", e.target.value)}
                    style={inputStyle("email")}
                    onFocus={(e) => (e.target.style.borderColor = "#4b7f52")}
                    onBlur={(e) => (e.target.style.borderColor = errors.email ? "#e53e3e" : "#e0e8e1")}
                  />
                </div>
                {errors.email && <p style={{ fontSize: 11, color: "#e53e3e", marginTop: 4 }}>⚠ {errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#6b7c6d", letterSpacing: 0.5 }}>PHONE NUMBER</label>
                <div style={{ position: "relative", marginTop: 8 }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>📱</span>
                  <input
                    type="tel" placeholder="080XXXXXXXX"
                    value={form.phone} onChange={(e) => set("phone", e.target.value)}
                    style={inputStyle("phone")}
                    onFocus={(e) => (e.target.style.borderColor = "#4b7f52")}
                    onBlur={(e) => (e.target.style.borderColor = errors.phone ? "#e53e3e" : "#e0e8e1")}
                  />
                </div>
                {errors.phone && <p style={{ fontSize: 11, color: "#e53e3e", marginTop: 4 }}>⚠ {errors.phone}</p>}
              </div>
            </div>
          )}

          {/* ── STEP 1: Personal ── */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Full name */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#6b7c6d", letterSpacing: 0.5 }}>FULL NAME</label>
                <div style={{ position: "relative", marginTop: 8 }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>👤</span>
                  <input
                    type="text" placeholder="John Doe"
                    value={form.fullName} onChange={(e) => set("fullName", e.target.value)}
                    style={inputStyle("fullName")}
                    onFocus={(e) => (e.target.style.borderColor = "#4b7f52")}
                    onBlur={(e) => (e.target.style.borderColor = errors.fullName ? "#e53e3e" : "#e0e8e1")}
                  />
                </div>
                {errors.fullName && <p style={{ fontSize: 11, color: "#e53e3e", marginTop: 4 }}>⚠ {errors.fullName}</p>}
              </div>

              {/* Referral code */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#6b7c6d", letterSpacing: 0.5 }}>
                  REFERRAL CODE <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <div style={{ position: "relative", marginTop: 8 }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🎁</span>
                  <input
                    type="text" placeholder="e.g. TAZK-J4D9"
                    value={form.referralCode} onChange={(e) => set("referralCode", e.target.value.toUpperCase())}
                    style={{
                      ...inputStyle("referralCode"),
                      border: `1.5px solid ${errors.referralCode ? "#e53e3e" : "#e0e8e1"}`,
                      letterSpacing: 1,
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#4b7f52")}
                    onBlur={(e) => (e.target.style.borderColor = errors.referralCode ? "#e53e3e" : "#e0e8e1")}
                  />
                  {form.referralCode.length >= 8 && !errors.referralCode && (
                    <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>✅</span>
                  )}
                </div>
                {errors.referralCode && <p style={{ fontSize: 11, color: "#e53e3e", marginTop: 4 }}>⚠ {errors.referralCode}</p>}
                {form.referralCode.length >= 8 && !errors.referralCode && (
                  <p style={{ fontSize: 11, color: "#4b7f52", marginTop: 4, fontWeight: 600 }}>
                    🎉 Code entered — you&apos;ll get a ₦200 welcome bonus!
                  </p>
                )}
                <p style={{ fontSize: 11, color: "#a0b0a2", marginTop: 4 }}>
                  You must have a referral code to register. Ask a friend who uses TazKsApp.
                </p>
              </div>

              {/* Earning potential card */}
              <div style={{
                background: "linear-gradient(135deg, #edf7ee, #e0f0e2)",
                border: "1px solid #c8e6cc",
                borderRadius: 14, padding: "14px 16px",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{ fontSize: 28 }}>💰</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: "#1a2e1c" }}>Earn up to ₦15,000/week</p>
                  <p style={{ fontSize: 12, color: "#4b7f52" }}>Complete tasks daily to maximize earnings</p>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Security ── */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Password */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#6b7c6d", letterSpacing: 0.5 }}>PASSWORD</label>
                <div style={{ position: "relative", marginTop: 8 }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔒</span>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={form.password} onChange={(e) => set("password", e.target.value)}
                    style={{ ...inputStyle("password"), paddingRight: 44 }}
                    onFocus={(e) => (e.target.style.borderColor = "#4b7f52")}
                    onBlur={(e) => (e.target.style.borderColor = errors.password ? "#e53e3e" : "#e0e8e1")}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: 0,
                  }}>
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && <p style={{ fontSize: 11, color: "#e53e3e", marginTop: 4 }}>⚠ {errors.password}</p>}
                {/* Strength bar */}
                {form.password && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ height: 4, background: "#f2f2f2", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 4, transition: "width 0.3s",
                        width: form.password.length < 6 ? "30%" : form.password.length < 10 ? "65%" : "100%",
                        background: form.password.length < 6 ? "#e53e3e" : form.password.length < 10 ? "#d4af37" : "#4b7f52",
                      }} />
                    </div>
                    <p style={{ fontSize: 11, color: "#a0b0a2", marginTop: 3 }}>
                      {form.password.length < 6 ? "Weak" : form.password.length < 10 ? "Good" : "Strong"} password
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#6b7c6d", letterSpacing: 0.5 }}>CONFIRM PASSWORD</label>
                <div style={{ position: "relative", marginTop: 8 }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔐</span>
                  <input
                    type="password" placeholder="Re-enter password"
                    value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)}
                    style={inputStyle("confirmPassword")}
                    onFocus={(e) => (e.target.style.borderColor = "#4b7f52")}
                    onBlur={(e) => (e.target.style.borderColor = errors.confirmPassword ? "#e53e3e" : "#e0e8e1")}
                  />
                  {form.confirmPassword && form.password === form.confirmPassword && (
                    <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>✅</span>
                  )}
                </div>
                {errors.confirmPassword && <p style={{ fontSize: 11, color: "#e53e3e", marginTop: 4 }}>⚠ {errors.confirmPassword}</p>}
              </div>

              {/* Terms */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <div
                  onClick={() => set("agreed", !form.agreed)}
                  style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                    border: `2px solid ${errors.agreed ? "#e53e3e" : form.agreed ? "#4b7f52" : "#e0e8e1"}`,
                    background: form.agreed ? "#4b7f52" : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s", cursor: "pointer",
                  }}
                >
                  {form.agreed && <span style={{ color: "#fff", fontSize: 12, fontWeight: 900 }}>✓</span>}
                </div>
                <span style={{ fontSize: 13, color: "#6b7c6d", lineHeight: 1.5 }}>
                  I agree to TazKsApp&apos;s{" "}
                  <span style={{ color: "#4b7f52", fontWeight: 600 }}>Terms of Service</span> and{" "}
                  <span style={{ color: "#4b7f52", fontWeight: 600 }}>Privacy Policy</span>
                </span>
              </label>
              {errors.agreed && <p style={{ fontSize: 11, color: "#e53e3e", marginTop: -10 }}>⚠ {errors.agreed}</p>}
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                style={{
                  flex: 1, padding: "14px",
                  background: "#f2f2f2", color: "#6b7c6d",
                  border: "none", borderRadius: 14,
                  fontWeight: 700, fontSize: 14, cursor: "pointer",
                }}
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              onClick={next}
              disabled={loading}
              style={{
                flex: 2, padding: "14px",
                background: loading ? "#a0b0a2" : "linear-gradient(135deg, #4b7f52, #3a6340)",
                color: "#fff", border: "none", borderRadius: 14,
                fontWeight: 800, fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 6px 20px rgba(75,127,82,0.35)",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {loading ? (
                <>⏳ Creating account...</>
              ) : step < 2 ? (
                <>Continue →</>
              ) : (
                <>🎉 Create Account</>
              )}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 20 }}>
          By registering you agree to our{" "}
          <span style={{ color: "rgba(255,255,255,0.8)", cursor: "pointer" }}>Terms</span> &amp;{" "}
          <span style={{ color: "rgba(255,255,255,0.8)", cursor: "pointer" }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
