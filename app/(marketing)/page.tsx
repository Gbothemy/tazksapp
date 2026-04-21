"use client";
import Link from "next/link";
import { useState } from "react";

// 100 points = ₦1
const features = [
  { icon: "📱", title: "Social Media Tasks", desc: "Follow, like, share and engage with content across Instagram, TikTok, X and more.", earn: "100 – 300 pts", color: "#e8f5e9" },
  { icon: "📋", title: "Surveys & Polls",    desc: "Share your opinion on products, services and lifestyle topics that matter.",        earn: "300 – 700 pts", color: "#fdf8e1" },
  { icon: "🧪", title: "App Testing",        desc: "Test new mobile apps and websites before they launch. Your feedback shapes products.", earn: "800 – 2,000 pts", color: "#e8f5e9" },
  { icon: "🎬", title: "Content Interactions", desc: "Watch videos, read articles and interact with digital content to earn rewards.",   earn: "150 – 500 pts", color: "#fdf8e1" },
];

const steps = [
  { num: "01", icon: "✍️", title: "Create your account",  desc: "Sign up with a referral code in under 60 seconds. No credit card needed." },
  { num: "02", icon: "✅", title: "Complete tasks",        desc: "Browse tasks by category, follow the steps and submit proof of completion." },
  { num: "03", icon: "⭐", title: "Earn points",           desc: "Every completed task credits points to your balance instantly." },
  { num: "04", icon: "💸", title: "Convert & withdraw",   desc: "Convert your points to Naira and cash out to your bank or mobile wallet." },
];

const stats = [
  { value: "50,000+", label: "Active Earners" },
  { value: "5B+",     label: "QTL Awarded" },
  { value: "200+",    label: "Daily Tasks" },
  { value: "4.8★",    label: "User Rating" },
];

const testimonials = [
  { name: "Amaka O.", role: "Student, Lagos",          avatar: "👩🏾", text: "I earn thousands of QTL weekly just doing tasks in my free time. Converting to cash is instant. Qeixova is genuinely legit." },
  { name: "Chidi N.", role: "Freelancer, Abuja",       avatar: "👨🏾", text: "The app testing tasks give the most QTL. I've withdrawn over ₦80,000 worth in three months. Highly recommend." },
  { name: "Fatima B.", role: "Stay-at-home mum, Kano", avatar: "👩🏽", text: "Simple tasks, fast QTL credits, easy cash out. I love doing this from my phone while the kids are asleep." },
];

const faqs = [
  { q: "What are QTL Points?",           a: "QTL (Qeixova Token Loyalty) points are the reward currency on Qeixova. Every task you complete earns you QTL. 100 QTL = ₦1. You can convert and withdraw anytime." },
  { q: "Is Qeixova free to join?",        a: "Yes, completely free. You need a referral code from an existing member to register. No registration fee, no hidden charges." },
  { q: "How do I convert points to cash?", a: "Go to your Wallet, enter the amount of points you want to convert, select your bank account and tap Withdraw. Minimum is 100,000 points (₦1,000)." },
  { q: "How quickly are withdrawals processed?", a: "Withdrawals are processed instantly to your bank account or mobile wallet (Opay, Palmpay, GTBank, etc.)." },
  { q: "How many tasks can I do per day?", a: "There's no daily limit. New tasks are added every 24 hours so there's always something to earn from." },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ background: "#fff", color: "#1a2e1c", overflowX: "hidden" }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #edf2ee", padding: "0 5vw",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 64,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #4b7f52, #3a6340)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 4px 12px rgba(75,127,82,0.3)" }}>⚡</div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5, color: "#1a2e1c" }}>Qeixova</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/login" style={{ fontSize: 14, fontWeight: 600, color: "#4b7f52", textDecoration: "none", padding: "8px 16px" }}>Log in</Link>
          <Link href="/register" style={{ fontSize: 14, fontWeight: 700, color: "#fff", textDecoration: "none", padding: "9px 20px", background: "linear-gradient(135deg, #4b7f52, #3a6340)", borderRadius: 10, boxShadow: "0 4px 14px rgba(75,127,82,0.3)" }}>Get Started</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ background: "linear-gradient(160deg, #4b7f52 0%, #3a6340 55%, #2d4f32 100%)", padding: "80px 5vw 100px", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(212,175,55,0.08)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 20, padding: "6px 16px", marginBottom: 28 }}>
          <span>🔥</span>
          <span style={{ color: "#e8c84a", fontSize: 13, fontWeight: 700 }}>50,000+ Nigerians already earning</span>
        </div>

        <h1 style={{ color: "#fff", fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: -2, maxWidth: 760, margin: "0 auto 20px" }}>
          Complete Tasks. Earn Points.<br />
          <span style={{ background: "linear-gradient(90deg, #d4af37, #e8c84a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Convert to Real Cash.
          </span>
        </h1>

        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(15px, 2vw, 19px)", maxWidth: 560, margin: "0 auto 16px", lineHeight: 1.6 }}>
          Qeixova rewards you with <strong style={{ color: "#e8c84a" }}>QTL Points (Qeixova Token Loyalty)</strong> for completing simple online tasks. Accumulate QTL and convert to Naira whenever you want.
        </p>

        {/* Points conversion pill */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 14, padding: "10px 20px", marginBottom: 36 }}>
          <span style={{ fontSize: 20 }}>⭐</span>
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>100 QTL</span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 18 }}>→</span>
          <span style={{ color: "#e8c84a", fontSize: 14, fontWeight: 700 }}>₦1</span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>· Instant conversion</span>
        </div>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register" style={{ background: "linear-gradient(135deg, #d4af37, #b8961e)", color: "#fff", textDecoration: "none", padding: "16px 36px", borderRadius: 14, fontWeight: 800, fontSize: 16, boxShadow: "0 8px 28px rgba(212,175,55,0.4)" }}>
            Start Earning Free →
          </Link>
          <a href="#how-it-works" style={{ background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.25)", color: "#fff", textDecoration: "none", padding: "16px 32px", borderRadius: 14, fontWeight: 600, fontSize: 16 }}>
            See How It Works
          </a>
        </div>

        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 48, flexWrap: "wrap" }}>
          {["✅ Free to join", "⭐ Earn points instantly", "💸 Convert to cash", "🔒 100% secure"].map((t) => (
            <span key={t} style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </section>

      {/* ── POINTS EXPLAINER BAND ── */}
      <section style={{ background: "#1a2e1c", padding: "36px 5vw" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>How QTL works:</span>
          {[
            { pts: "100 QTL", naira: "₦1" },
            { pts: "10,000 QTL", naira: "₦100" },
            { pts: "100,000 QTL", naira: "₦1,000" },
            { pts: "1,000,000 QTL", naira: "₦10,000" },
          ].map((r) => (
            <div key={r.pts} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 14px" }}>
              <span style={{ color: "#e8c84a", fontWeight: 700, fontSize: 13 }}>⭐ {r.pts}</span>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>→</span>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{r.naira}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: "#fff", borderBottom: "1px solid #edf2ee", padding: "48px 5vw" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24, textAlign: "center" }}>
          {stats.map((s) => (
            <div key={s.label}>
              <p style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "#4b7f52", letterSpacing: -1, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 13, color: "#a0b0a2", marginTop: 6, fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "80px 5vw", background: "#f2f2f2" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#4b7f52", letterSpacing: 2, textTransform: "uppercase", background: "#edf7ee", borderRadius: 20, padding: "4px 14px" }}>What you can do</span>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, color: "#1a2e1c", marginTop: 14, letterSpacing: -1 }}>Four ways to earn points every day</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {features.map((f) => (
              <div key={f.title} style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", boxShadow: "0 4px 20px rgba(75,127,82,0.07)", border: "1px solid #edf2ee" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: f.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 18 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 800, fontSize: 16, color: "#1a2e1c", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "#6b7c6d", lineHeight: 1.6, marginBottom: 16 }}>{f.desc}</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fdf8e1", borderRadius: 8, padding: "5px 12px" }}>
                  <span style={{ fontSize: 14 }}>⭐</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#b8961e" }}>{f.earn} per task</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: "80px 5vw", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#4b7f52", letterSpacing: 2, textTransform: "uppercase", background: "#edf7ee", borderRadius: 20, padding: "4px 14px" }}>Simple process</span>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, color: "#1a2e1c", marginTop: 14, letterSpacing: -1 }}>Up and earning in 4 steps</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32 }}>
            {steps.map((step) => (
              <div key={step.num} style={{ textAlign: "center" }}>
                <div style={{ width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(135deg, #4b7f52, #3a6340)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 6px 20px rgba(75,127,82,0.25)", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 22 }}>{step.icon}</span>
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#d4af37", letterSpacing: 1, marginBottom: 6 }}>STEP {step.num}</p>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: "#1a2e1c", marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: "#6b7c6d", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "80px 5vw", background: "#f2f2f2" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#4b7f52", letterSpacing: 2, textTransform: "uppercase", background: "#edf7ee", borderRadius: 20, padding: "4px 14px" }}>Real earners</span>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, color: "#1a2e1c", marginTop: 14, letterSpacing: -1 }}>People just like you are earning</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {testimonials.map((t) => (
              <div key={t.name} style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", boxShadow: "0 4px 20px rgba(75,127,82,0.07)", border: "1px solid #edf2ee" }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {[...Array(5)].map((_, i) => <span key={i} style={{ color: "#d4af37", fontSize: 16 }}>★</span>)}
                </div>
                <p style={{ fontSize: 14, color: "#3a4a3c", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>&ldquo;{t.text}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #edf7ee, #c8e6cc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{t.avatar}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: "#1a2e1c" }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: "#a0b0a2" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "80px 5vw", background: "#fff" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#4b7f52", letterSpacing: 2, textTransform: "uppercase", background: "#edf7ee", borderRadius: 20, padding: "4px 14px" }}>FAQ</span>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 900, color: "#1a2e1c", marginTop: 14, letterSpacing: -1 }}>Common questions</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: openFaq === i ? "#f9fbf9" : "#fff", border: `1.5px solid ${openFaq === i ? "#c8e6cc" : "#edf2ee"}`, borderRadius: 16, overflow: "hidden", transition: "all 0.2s" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: "#1a2e1c" }}>{faq.q}</span>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: openFaq === i ? "#4b7f52" : "#f2f2f2", display: "flex", alignItems: "center", justifyContent: "center", color: openFaq === i ? "#fff" : "#6b7c6d", fontSize: 18, fontWeight: 700, flexShrink: 0, transition: "all 0.2s" }}>
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && <p style={{ padding: "0 20px 18px", fontSize: 14, color: "#6b7c6d", lineHeight: 1.7 }}>{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "linear-gradient(135deg, #4b7f52 0%, #3a6340 60%, #2d4f32 100%)", padding: "80px 5vw", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(212,175,55,0.1)" }} />
        <h2 style={{ color: "#fff", fontSize: "clamp(26px, 5vw, 48px)", fontWeight: 900, letterSpacing: -1.5, marginBottom: 16, position: "relative" }}>Ready to start earning points?</h2>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, maxWidth: 440, margin: "0 auto 36px", lineHeight: 1.6, position: "relative" }}>
          Join thousands of Nigerians earning QTL daily and converting them to real cash.
        </p>
        <Link href="/register" style={{ background: "linear-gradient(135deg, #d4af37, #b8961e)", color: "#fff", textDecoration: "none", padding: "18px 44px", borderRadius: 14, fontWeight: 800, fontSize: 17, boxShadow: "0 8px 28px rgba(212,175,55,0.4)", display: "inline-block", position: "relative" }}>
          Create Free Account →
        </Link>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 16 }}>Referral code required · Free forever</p>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#1a2e1c", padding: "48px 5vw 32px", color: "rgba(255,255,255,0.6)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #4b7f52, #3a6340)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
                <span style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>Qeixova</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7 }}>Nigeria&apos;s most trusted micro-task platform. Earn QTL doing simple online tasks and convert to real cash.</p>
              <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, padding: "6px 12px" }}>
                <span style={{ fontSize: 14 }}>⭐</span>
                <span style={{ fontSize: 12, color: "#e8c84a", fontWeight: 700 }}>100 QTL = ₦1</span>
              </div>
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 14, letterSpacing: 0.5 }}>Platform</p>
              {["How it works", "Task categories", "Points & rewards", "Referral program"].map((l) => (
                <p key={l} style={{ fontSize: 13, marginBottom: 10, cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#d4af37")} onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}>{l}</p>
              ))}
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 14, letterSpacing: 0.5 }}>Support</p>
              {["Help center", "Contact us", "Privacy policy", "Terms of service"].map((l) => (
                <p key={l} style={{ fontSize: 13, marginBottom: 10, cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#d4af37")} onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}>{l}</p>
              ))}
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 14, letterSpacing: 0.5 }}>Follow us</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["📘 Facebook", "📸 Instagram", "🐦 Twitter", "▶️ YouTube"].map((s) => (
                  <span key={s} style={{ fontSize: 12, background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)" }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: 12 }}>© 2025 TazKsApp. All rights reserved.</p>
            <p style={{ fontSize: 12 }}>Made with 💚 for Nigerian earners</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
