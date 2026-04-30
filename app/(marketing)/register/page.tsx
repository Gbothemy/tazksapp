"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const dynamic = 'force-dynamic';

const steps = ["Account", "Personal", "Security"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    email: "", phone: "", fullName: "", referralCode: "",
    password: "", confirmPassword: "", agreed: false,
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
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email, phone: form.phone, fullName: form.fullName,
        password: form.password, referralCode: form.referralCode || undefined,
      }),
    });
    const data = await res.json();
    if (res.ok) { router.push("/dashboard"); }
    else { setErrors({ submit: data.error || "Registration failed" }); }
    setLoading(false);
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%", padding: "13px 14px 13px 42px", borderRadius: 12,
    border: 1.5px solid ,
    fontSize: 14, outline: "none", color: "#F5F5F5",
    background: "#1a1a1a", transition: "border-color 0.2s",
  });

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #06B517 0%, #1AEF22 40%, #000000 40%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <img src="/qeixova-icon.png" alt="Qeixova" style={{ width: 52, height: 52, borderRadius: 14, objectFit: "contain", boxShadow: "0 8px 24px rgba(245,166,35,0.4)" }} />
            <span style={{ fontWeight: 900, fontSize: 20, color: "#fff", letterSpacing: -0.5 }}>Qeixova</span>
          </Link>
        </div>
        <div style={{ background: "#111111", borderRadius: 24, padding: "32px 28px" }}>
          <h1>Register - Step {step + 1}</h1>
          <button onClick={next}>Next</button>
        </div>
      </div>
    </div>
  );
}
