"use client";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import BankAccountsModal from "@/components/BankAccountsModal";
import { useAuth } from "@/lib/useAuth";

interface Profile {
  full_name: string; email: string; phone: string;
  balance: number; streak: number; level: number;
  referral_code: string; tasks_completed: number;
  tasks_today: number; total_earned: number;
  total_withdrawn: number; referral_count: number;
  created_at: string;
}

type ModalType = "edit" | "password" | "notifications" | "support" | "terms" | null;

function levelLabel(l: number) {
  if (l >= 5) return "Elite Earner";
  if (l >= 3) return "Pro Earner";
  return "Rising Earner";
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

// -- Overlay modal wrapper --------------------------------------------------
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 520, padding: "24px 20px 40px", maxHeight: "85vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <p style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A" }}>{title}</p>
          <button onClick={onClose} style={{ background: "#F5F5F5", border: "none", borderRadius: 10, width: 34, height: 34, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// -- Input helper ----------------------------------------------------------
function Field({ label, type = "text", value, onChange, placeholder }: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, color: "#6b6b6b", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", marginTop: 6, padding: "13px 14px", borderRadius: 12, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", color: "#1A1A1A", background: "#fafafa" }}
        onFocus={(e) => (e.target.style.borderColor = "#1AEF22")}
        onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
      />
    </div>
  );
}

// -- Alert banner ----------------------------------------------------------
function Alert({ msg }: { msg: { type: "success" | "error"; text: string } }) {
  return (
    <div style={{
      background: msg.type === "success" ? "#e8ffe9" : "#fff5f5",
      border: `1px solid ${msg.type === "success" ? "#c3e6cb" : "#fed7d7"}`,
      borderRadius: 12, padding: "12px 14px", marginBottom: 16,
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <span style={{ fontSize: 16 }}>{msg.type === "success" ? "?" : "??"}</span>
      <p style={{ color: msg.type === "success" ? "#1A1A1A" : "#e53e3e", fontSize: 13, fontWeight: 600 }}>{msg.text}</p>
    </div>
  );
}

// -- Edit Profile Modal ----------------------------------------------------
function EditProfileModal({ profile, onClose, onSaved }: {
  profile: Profile; onClose: () => void; onSaved: (p: Partial<Profile>) => void;
}) {
  const [name, setName] = useState(profile.full_name);
  const [phone, setPhone] = useState(profile.phone || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const save = async () => {
    setSaving(true); setMsg(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_profile", full_name: name, phone }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg({ type: "success", text: "Profile updated successfully!" });
      onSaved({ full_name: name, phone });
      setTimeout(onClose, 1200);
    } else {
      setMsg({ type: "error", text: data.error || "Failed to update" });
    }
    setSaving(false);
  };

  return (
    <Modal title="Edit Profile" onClose={onClose}>
      {msg && <Alert msg={msg} />}
      <Field label="Full Name" value={name} onChange={setName} placeholder="Your full name" />
      <Field label="Phone Number" value={phone} onChange={setPhone} placeholder="+234 800 000 0000" />
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 11, color: "#6b6b6b", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>Email Address</label>
        <input value={profile.email} disabled
          style={{ width: "100%", marginTop: 6, padding: "13px 14px", borderRadius: 12, border: "1.5px solid #e0e0e0", fontSize: 15, color: "#a0a0a0", background: "#F5F5F5", cursor: "not-allowed" }} />
        <p style={{ fontSize: 11, color: "#a0a0a0", marginTop: 4 }}>Email cannot be changed</p>
      </div>
      <button onClick={save} disabled={saving} style={{
        width: "100%", background: saving ? "#a0a0a0" : "linear-gradient(135deg, #1AEF22, #06B517)",
        color: "#fff", border: "none", borderRadius: 14, padding: "15px",
        fontWeight: 800, fontSize: 15, cursor: saving ? "not-allowed" : "pointer",
        boxShadow: saving ? "none" : "0 6px 20px rgba(75,127,82,0.3)", marginTop: 4,
      }}>
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </Modal>
  );
}

// -- Change Password Modal -------------------------------------------------
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const save = async () => {
    if (next !== confirm) { setMsg({ type: "error", text: "New passwords do not match" }); return; }
    if (next.length < 6) { setMsg({ type: "error", text: "Password must be at least 6 characters" }); return; }
    setSaving(true); setMsg(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "change_password", current_password: current, new_password: next }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg({ type: "success", text: "Password changed successfully!" });
      setTimeout(onClose, 1400);
    } else {
      setMsg({ type: "error", text: data.error || "Failed to change password" });
    }
    setSaving(false);
  };

  return (
    <Modal title="Change Password" onClose={onClose}>
      {msg && <Alert msg={msg} />}
      <Field label="Current Password" type="password" value={current} onChange={setCurrent} placeholder="Enter current password" />
      <Field label="New Password" type="password" value={next} onChange={setNext} placeholder="At least 6 characters" />
      <Field label="Confirm New Password" type="password" value={confirm} onChange={setConfirm} placeholder="Repeat new password" />
      <button onClick={save} disabled={saving} style={{
        width: "100%", background: saving ? "#a0a0a0" : "linear-gradient(135deg, #1AEF22, #06B517)",
        color: "#fff", border: "none", borderRadius: 14, padding: "15px",
        fontWeight: 800, fontSize: 15, cursor: saving ? "not-allowed" : "pointer",
        boxShadow: saving ? "none" : "0 6px 20px rgba(75,127,82,0.3)", marginTop: 4,
      }}>
        {saving ? "Updating..." : "Update Password"}
      </button>
    </Modal>
  );
}

// -- Notifications Modal ---------------------------------------------------
function NotificationsModal({ onClose }: { onClose: () => void }) {
  const [prefs, setPrefs] = useState({ task_alerts: true, reward_updates: true, referral_alerts: true, weekly_summary: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const toggle = (k: keyof typeof prefs) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.prefs) setPrefs(d.prefs); })
      .catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prefs }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1000);
  };

  const items = [
    { key: "task_alerts" as const, label: "New Task Alerts", sub: "Get notified when new tasks are available" },
    { key: "reward_updates" as const, label: "Reward Updates", sub: "Notifications when you earn rewards" },
    { key: "referral_alerts" as const, label: "Referral Alerts", sub: "When someone joins using your code" },
    { key: "weekly_summary" as const, label: "Weekly Summary", sub: "Your weekly earnings and activity report" },
  ];

  return (
    <Modal title="Notifications" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map((item) => (
          <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f5f7f5" }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{item.label}</p>
              <p style={{ fontSize: 12, color: "#a0a0a0", marginTop: 2 }}>{item.sub}</p>
            </div>
            <div onClick={() => toggle(item.key)} style={{
              width: 46, height: 26, borderRadius: 13, cursor: "pointer", transition: "background 0.2s",
              background: prefs[item.key] ? "#1AEF22" : "#d0d0d0", position: "relative",
            }}>
              <div style={{
                position: "absolute", top: 3, left: prefs[item.key] ? 23 : 3,
                width: 20, height: 20, borderRadius: "50%", background: "#fff",
                transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              }} />
            </div>
          </div>
        ))}
      </div>
      <button onClick={save} disabled={saving} style={{
        width: "100%", background: saved ? "#1AEF22" : saving ? "#a0a0a0" : "linear-gradient(135deg, #1AEF22, #06B517)",
        color: "#fff", border: "none", borderRadius: 14, padding: "15px",
        fontWeight: 800, fontSize: 15, cursor: saving ? "not-allowed" : "pointer",
        boxShadow: "0 6px 20px rgba(75,127,82,0.3)", marginTop: 20,
      }}>
        {saved ? "? Saved!" : saving ? "Saving..." : "Save Preferences"}
      </button>
    </Modal>
  );
}

// -- Support Modal ---------------------------------------------------------
function SupportModal({ onClose }: { onClose: () => void }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const send = () => {
    if (!subject.trim() || !message.trim()) return;
    // Open email client with pre-filled content
    const body = encodeURIComponent(`Subject: ${subject}\n\n${message}`);
    window.open(`mailto:qeixova@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`, "_blank");
    setSent(true);
  };

  if (sent) return (
    <Modal title="Support" onClose={onClose}>
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>?</div>
        <p style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A", marginBottom: 8 }}>Message Sent!</p>
        <p style={{ color: "#6b6b6b", fontSize: 14 }}>Our support team will get back to you within 24 hours.</p>
        <button onClick={onClose} style={{ marginTop: 24, background: "linear-gradient(135deg, #1AEF22, #06B517)", color: "#fff", border: "none", borderRadius: 14, padding: "14px 32px", fontWeight: 800, fontSize: 15, cursor: "pointer" }}>Done</button>
      </div>
    </Modal>
  );

  return (
    <Modal title="Contact Support" onClose={onClose}>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {[
          { icon: "??", label: "Email", sub: "qeixova@gmail.com", href: "mailto:qeixova@gmail.com" },
          { icon: "??", label: "Facebook", sub: "Message us", href: "https://www.facebook.com/profile.php?id=61568026449468" },
          { icon: "??", label: "Twitter/X", sub: "@QeixovaTech", href: "https://x.com/QeixovaTech" },
        ].map((c) => (
          <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
            style={{ flex: 1, background: "#fafafa", border: "1px solid #e0e0e0", borderRadius: 14, padding: "12px 8px", textAlign: "center", cursor: "pointer", textDecoration: "none" }}>
            <p style={{ fontSize: 22 }}>{c.icon}</p>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>{c.label}</p>
            <p style={{ fontSize: 10, color: "#a0a0a0" }}>{c.sub}</p>
          </a>
        ))}
      </div>
      <Field label="Subject" value={subject} onChange={setSubject} placeholder="What do you need help with?" />
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 11, color: "#6b6b6b", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>Message</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue in detail..."
          rows={4} style={{ width: "100%", marginTop: 6, padding: "13px 14px", borderRadius: 12, border: "1.5px solid #e0e0e0", fontSize: 14, outline: "none", color: "#1A1A1A", background: "#fafafa", resize: "none" }}
          onFocus={(e) => (e.target.style.borderColor = "#1AEF22")}
          onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
        />
      </div>
      <button onClick={send} style={{
        width: "100%", background: "linear-gradient(135deg, #1AEF22, #06B517)",
        color: "#fff", border: "none", borderRadius: 14, padding: "15px",
        fontWeight: 800, fontSize: 15, cursor: "pointer",
        boxShadow: "0 6px 20px rgba(75,127,82,0.3)",
      }}>Send Message</button>
    </Modal>
  );
}

// -- Terms Modal -----------------------------------------------------------
function TermsModal({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<"menu" | "terms" | "privacy" | "refund">("menu");

  const content: Record<string, { title: string; body: string }> = {
    terms: {
      title: "Terms of Service",
      body: `Welcome to Qeixova. By using our platform you agree to these terms.

1. ELIGIBILITY
You must be at least 18 years old and a resident of Nigeria to use Qeixova.

2. EARNING & REWARDS
QLT (Qeixova Loyalty Token) points are earned by completing tasks. 100 QLT = ?1. Points have no cash value until converted via a withdrawal request.

3. TASK COMPLETION
You must complete tasks honestly and submit genuine proof. Fraudulent submissions will result in account suspension and forfeiture of all points.

4. WITHDRAWALS
Minimum withdrawal is 100,000 QLT (?1,000). Withdrawals are processed within 24 hours to your registered bank account.

5. REFERRALS
You earn 50,000 QLT for each person who registers using your referral code. Referral abuse will result in account termination.

6. ACCOUNT TERMINATION
Qeixova reserves the right to suspend or terminate accounts that violate these terms without prior notice.

7. CHANGES
We may update these terms at any time. Continued use of the platform constitutes acceptance of the updated terms.`,
    },
    privacy: {
      title: "Privacy Policy",
      body: `Qeixova is committed to protecting your personal information.

1. DATA WE COLLECT
We collect your name, email, phone number, and task completion data to operate the platform.

2. HOW WE USE YOUR DATA
Your data is used to manage your account, process withdrawals, and improve our services. We do not sell your data to third parties.

3. DATA SECURITY
All data is encrypted in transit and at rest. Passwords are hashed using bcrypt.

4. COOKIES
We use session cookies to keep you logged in. No tracking cookies are used.

5. YOUR RIGHTS
You may request deletion of your account and all associated data by contacting qeixova@gmail.com.

6. CONTACT
For privacy concerns: qeixova@gmail.com`,
    },
    refund: {
      title: "Refund Policy",
      body: `Qeixova does not charge users any fees. All earnings are from task completion.

1. NO DEPOSITS
Qeixova does not require any deposits or payments from users.

2. WITHDRAWAL DISPUTES
If a withdrawal is not received within 48 hours of approval, contact support at qeixova@gmail.com with your transaction reference.

3. POINT DISPUTES
If you believe points were incorrectly deducted, contact support within 7 days of the transaction.`,
    },
  };

  if (view !== "menu") {
    const c = content[view];
    return (
      <Modal title={c.title} onClose={onClose}>
        <button onClick={() => setView("menu")} style={{ background: "#F5F5F5", border: "none", borderRadius: 10, padding: "8px 14px", fontSize: 13, cursor: "pointer", marginBottom: 16, color: "#6b6b6b", fontWeight: 600 }}>
          ? Back
        </button>
        <div style={{ fontSize: 13, color: "#3a3a3a", lineHeight: 1.8, whiteSpace: "pre-line" }}>
          {c.body}
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Terms & Privacy" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { key: "terms",   icon: "??", title: "Terms of Service",  sub: "Rules and guidelines for using Qeixova" },
          { key: "privacy", icon: "??", title: "Privacy Policy",    sub: "How we collect and use your data" },
          { key: "refund",  icon: "??", title: "Refund Policy",     sub: "Our policy on disputes and withdrawals" },
        ].map((item) => (
          <div key={item.key} onClick={() => setView(item.key as "terms" | "privacy" | "refund")}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "#fafafa", borderRadius: 14, border: "1px solid #e0e0e0", cursor: "pointer" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#e8ffe9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{item.title}</p>
              <p style={{ fontSize: 12, color: "#a0a0a0", marginTop: 2 }}>{item.sub}</p>
            </div>
            <span style={{ color: "#a0a0a0", fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>
      <p style={{ textAlign: "center", color: "#a0a0a0", fontSize: 12, marginTop: 20 }}>
        Last updated: April 2025 · Qeixova v1.0
      </p>
    </Modal>
  );
}

// -- Main Profile Page -----------------------------------------------------
export default function ProfilePage() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [copied, setCopied] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.profile) setProfile(d.profile); })
      .catch(() => {});
  }, []);

  const copyCode = () => {
    if (!profile) return;
    navigator.clipboard.writeText(profile.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const patchProfile = (updates: Partial<Profile>) => {
    setProfile((p) => p ? { ...p, ...updates } : p);
  };

  const stats = profile ? [
    { label: "Tasks Today",      value: String(profile.tasks_today),       icon: "??" },
    { label: "Total Tasks",      value: String(profile.tasks_completed),   icon: "?" },
    { label: "Total Earned",     value: profile.total_earned >= 1000 ? `${(profile.total_earned / 1000).toFixed(0)}k QLT` : `${profile.total_earned} QLT`, icon: "?" },
    { label: "Total Withdrawn",  value: profile.total_withdrawn >= 1000 ? `${(profile.total_withdrawn / 1000).toFixed(0)}k QLT` : `${profile.total_withdrawn} QLT`, icon: "??" },
    { label: "Balance",          value: `${profile.balance.toLocaleString()} QLT`, icon: "??" },
    { label: "Referrals",        value: String(profile.referral_count),    icon: "??" },
  ] : [];

  const menuItems = [
    { icon: "??", label: "Bank Accounts",   sub: "Add & manage withdrawal accounts", color: "#e8ffe9", action: () => setShowBankModal(true) },
    { icon: "??", label: "Edit Profile",    sub: "Update your name & phone",         color: "#fdf8e1", action: () => setModal("edit") },
    { icon: "??", label: "Change Password", sub: "Update your account password",     color: "#e8ffe9", action: () => setModal("password") },
    { icon: "??", label: "Notifications",   sub: "Task alerts & updates",            color: "#fdf8e1", action: () => setModal("notifications") },
    { icon: "??", label: "Support",         sub: "Get help anytime",                 color: "#e8ffe9", action: () => setModal("support") },
    { icon: "??", label: "Terms & Privacy", sub: "Legal information",                color: "#fdf8e1", action: () => setModal("terms") },
  ];

  return (
    <div className="page-body" style={{ background: "#F5F5F5", minHeight: "100vh" }}>
      {/* Header */}
      <div className="page-header" style={{
        background: "linear-gradient(160deg, #1AEF22 0%, #06B517 100%)",
        padding: "52px 20px 40px", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(212,175,55,0.1)" }} />

        {/* Avatar with edit button */}
        <div style={{ position: "relative", display: "inline-block", marginBottom: 14 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, #F5A623, #d89420)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 34, boxShadow: "0 6px 20px rgba(212,175,55,0.4)",
            border: "3px solid rgba(255,255,255,0.3)",
          }}>
            {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : "??"}
          </div>
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 14, height: 14, borderRadius: "50%", background: "#4ade80", border: "2px solid #06B517" }} />
        </div>

        <p style={{ color: "#fff", fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
          {profile?.full_name ?? "Loading..."}
        </p>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, marginTop: 3 }}>{profile?.email}</p>
        {profile?.phone && (
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 2 }}>{profile.phone}</p>
        )}
        {profile?.created_at && (
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 4 }}>Member since {timeAgo(profile.created_at)}</p>
        )}

        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)",
            borderRadius: 20, padding: "6px 16px",
          }}>
            <span style={{ fontSize: 14 }}>?</span>
            <span style={{ color: "#F5A623", fontSize: 12, fontWeight: 700 }}>
              Level {profile?.level ?? 1} — {levelLabel(profile?.level ?? 1)}
            </span>
          </div>
          {profile && profile.streak > 0 && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 20, padding: "5px 14px",
            }}>
              <span style={{ fontSize: 14 }}>??</span>
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{profile.streak}-day streak</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: "0 16px", marginTop: -24 }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: "20px",
          boxShadow: "0 8px 30px rgba(75,127,82,0.12)", border: "1px solid #e8e8e8",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              textAlign: "center", padding: "12px 8px",
              borderRight: i % 2 === 0 ? "1px solid #e8e8e8" : "none",
              borderBottom: i < stats.length - 2 ? "1px solid #e8e8e8" : "none",
            }}>
              <p style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</p>
              <p style={{ fontWeight: 800, fontSize: 15, color: "#1AEF22" }}>{s.value}</p>
              <p style={{ fontSize: 10, color: "#a0a0a0", marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Referral banner */}
      {profile && (
        <div style={{ padding: "20px 16px 0" }}>
          <div style={{
            background: "linear-gradient(135deg, #F5A623 0%, #d89420 100%)",
            borderRadius: 18, padding: "18px 20px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            boxShadow: "0 6px 20px rgba(212,175,55,0.3)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
            <div>
              <p style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>Refer & Earn 5,000 QLT</p>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 3 }}>
                Your code: <span style={{ fontWeight: 800, letterSpacing: 1 }}>{profile.referral_code}</span>
              </p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, marginTop: 2 }}>
                {profile.referral_count} {profile.referral_count === 1 ? "person" : "people"} joined with your code
              </p>
            </div>
            <button onClick={copyCode} style={{
              background: "#fff", color: "#d89420", border: "none",
              borderRadius: 12, padding: "10px 18px",
              fontWeight: 800, fontSize: 13, cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}>
              {copied ? "Copied! ?" : "Copy ??"}
            </button>
          </div>
        </div>
      )}

      {/* Menu */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 12px rgba(75,127,82,0.07)", border: "1px solid #e8e8e8" }}>
          {menuItems.map((item, i) => (
            <div key={i} onClick={item.action} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "15px 18px",
              borderBottom: i < menuItems.length - 1 ? "1px solid #f5f7f5" : "none", cursor: "pointer",
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{item.label}</p>
                <p style={{ fontSize: 12, color: "#a0a0a0", marginTop: 1 }}>{item.sub}</p>
              </div>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center", color: "#a0a0a0", fontSize: 14, fontWeight: 700 }}>›</div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div style={{ padding: "16px 16px 0" }}>
        <button onClick={logout} style={{
          width: "100%", background: "#fff", color: "#e53e3e",
          border: "1.5px solid #fed7d7", borderRadius: 16, padding: "15px",
          fontWeight: 700, fontSize: 15, cursor: "pointer",
          boxShadow: "0 2px 8px rgba(229,62,62,0.08)",
        }}>
          ?? Log Out
        </button>
      </div>

      <BottomNav />

      {/* Modals */}
      {showBankModal                && <BankAccountsModal onClose={() => setShowBankModal(false)} />}
      {modal === "edit"          && profile && <EditProfileModal profile={profile} onClose={() => setModal(null)} onSaved={patchProfile} />}
      {modal === "password"      && <ChangePasswordModal onClose={() => setModal(null)} />}
      {modal === "notifications" && <NotificationsModal onClose={() => setModal(null)} />}
      {modal === "support"       && <SupportModal onClose={() => setModal(null)} />}
      {modal === "terms"         && <TermsModal onClose={() => setModal(null)} />}
    </div>
  );
}

