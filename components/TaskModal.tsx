"use client";
import { useState, useRef } from "react";

export interface FullTask {
  id: number;
  title: string;
  category: string;
  reward: number;
  duration: string;
  icon: string;
  color: string;
  instructions: string;
  steps: string[];
  proof_type: "screenshot" | "url" | "text" | "none";
  proof_label: string;
  completed: boolean;
}

interface Props {
  task: FullTask;
  onClose: () => void;
  onComplete: (id: number, proofValue: string) => Promise<{ ok: boolean; error?: string }>;
}

export default function TaskModal({ task, onClose, onComplete }: Props) {
  const [phase, setPhase] = useState<"details" | "proof" | "success">("details");
  const [proofValue, setProofValue] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    // Convert to base64 data URL as proof value
    const reader = new FileReader();
    reader.onload = () => setProofValue(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (task.proof_type !== "none" && !proofValue.trim()) {
      setError("Please provide proof of completion before submitting.");
      return;
    }
    setError("");
    setSubmitting(true);
    const result = await onComplete(task.id, proofValue);
    setSubmitting(false);
    if (result.ok) {
      setPhase("success");
    } else {
      setError(result.error || "Submission failed. Please try again.");
    }
  };

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.55)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        backdropFilter: "blur(3px)",
      }}
    >
      {/* Sheet */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "24px 24px 0 0",
          width: "100%", maxWidth: 480,
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.2)",
          animation: "slideUp 0.25s ease",
        }}
      >
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to   { transform: translateY(0);    opacity: 1; }
          }
        `}</style>

        {/* Handle bar */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "#e0e8e1" }} />
        </div>

        {/* ── SUCCESS PHASE ── */}
        {phase === "success" && (
          <div style={{ padding: "32px 24px 40px", textAlign: "center" }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "linear-gradient(135deg, #4b7f52, #3a6340)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36, margin: "0 auto 20px",
              boxShadow: "0 8px 24px rgba(75,127,82,0.35)",
            }}>✅</div>
            <h2 style={{ fontWeight: 900, fontSize: 22, color: "#1a2e1c", marginBottom: 8 }}>
              Task Completed!
            </h2>
            <p style={{ color: "#6b7c6d", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Your proof has been submitted for review. Your reward will be credited once verified.
            </p>
            <div style={{
              background: "linear-gradient(135deg, #edf7ee, #d4f0da)",
              border: "1px solid #c8e6cc",
              borderRadius: 16, padding: "20px",
              marginBottom: 28,
            }}>
              <p style={{ fontSize: 13, color: "#4b7f52", marginBottom: 4 }}>Reward earned</p>
              <p style={{ fontSize: 36, fontWeight: 900, color: "#4b7f52", letterSpacing: -1 }}>
                +₦{task.reward.toLocaleString()}
              </p>
            </div>
            <button onClick={onClose} style={{
              width: "100%", background: "linear-gradient(135deg, #4b7f52, #3a6340)",
              color: "#fff", border: "none", borderRadius: 14, padding: "15px",
              fontWeight: 800, fontSize: 15, cursor: "pointer",
              boxShadow: "0 6px 20px rgba(75,127,82,0.3)",
            }}>
              Back to Tasks
            </button>
          </div>
        )}

        {/* ── DETAILS PHASE ── */}
        {phase === "details" && (
          <div style={{ padding: "20px 24px 32px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, background: task.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26, flexShrink: 0,
              }}>
                {task.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontWeight: 800, fontSize: 17, color: "#1a2e1c", lineHeight: 1.3, marginBottom: 6 }}>
                  {task.title}
                </h2>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#4b7f52", background: "#edf7ee", borderRadius: 6, padding: "2px 8px" }}>
                    {task.category}
                  </span>
                  <span style={{ fontSize: 11, color: "#a0b0a2" }}>⏱ {task.duration}</span>
                </div>
              </div>
              <button onClick={onClose} style={{
                background: "#f2f2f2", border: "none", borderRadius: 10,
                width: 32, height: 32, cursor: "pointer", fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>✕</button>
            </div>

            {/* Reward banner */}
            <div style={{
              background: "linear-gradient(135deg, #4b7f52, #3a6340)",
              borderRadius: 14, padding: "14px 18px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 22, position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(212,175,55,0.12)" }} />
              <div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginBottom: 2 }}>You will earn</p>
                <p style={{ color: "#e8c84a", fontWeight: 900, fontSize: 24, letterSpacing: -0.5 }}>
                  ₦{task.reward.toLocaleString()}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginBottom: 2 }}>Duration</p>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{task.duration}</p>
              </div>
            </div>

            {/* Instructions */}
            <div style={{ marginBottom: 22 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#1a2e1c", marginBottom: 8 }}>About this task</p>
              <p style={{ fontSize: 13, color: "#6b7c6d", lineHeight: 1.7 }}>{task.instructions}</p>
            </div>

            {/* Steps */}
            {task.steps?.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: "#1a2e1c", marginBottom: 12 }}>
                  Step-by-step instructions
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {task.steps.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                        background: "linear-gradient(135deg, #4b7f52, #3a6340)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: 11, fontWeight: 800,
                      }}>
                        {i + 1}
                      </div>
                      <p style={{ fontSize: 13, color: "#3a4a3c", lineHeight: 1.6, paddingTop: 3 }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Proof type hint */}
            {task.proof_type !== "none" && (
              <div style={{
                background: "#fdf8e1", border: "1px solid #f0e0a0",
                borderRadius: 12, padding: "12px 14px", marginBottom: 24,
                display: "flex", gap: 10, alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>
                  {task.proof_type === "screenshot" ? "📸" : task.proof_type === "url" ? "🔗" : "✏️"}
                </span>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#b8961e", marginBottom: 2 }}>Proof required</p>
                  <p style={{ fontSize: 12, color: "#6b5a1e" }}>{task.proof_label}</p>
                </div>
              </div>
            )}

            <button onClick={() => setPhase("proof")} style={{
              width: "100%",
              background: "linear-gradient(135deg, #d4af37, #b8961e)",
              color: "#fff", border: "none", borderRadius: 14, padding: "16px",
              fontWeight: 800, fontSize: 16, cursor: "pointer",
              boxShadow: "0 6px 20px rgba(212,175,55,0.35)",
            }}>
              I&apos;m Ready — Start Task →
            </button>
          </div>
        )}

        {/* ── PROOF PHASE ── */}
        {phase === "proof" && (
          <div style={{ padding: "20px 24px 36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <button onClick={() => setPhase("details")} style={{
                background: "#f2f2f2", border: "none", borderRadius: 10,
                width: 36, height: 36, cursor: "pointer", fontSize: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>←</button>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 17, color: "#1a2e1c" }}>Submit Proof</h2>
                <p style={{ fontSize: 12, color: "#a0b0a2" }}>{task.title}</p>
              </div>
            </div>

            {/* Checklist reminder */}
            <div style={{
              background: "#f9fbf9", border: "1px solid #e0e8e1",
              borderRadius: 14, padding: "14px 16px", marginBottom: 22,
            }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#4b7f52", marginBottom: 10 }}>
                ✅ Completion checklist
              </p>
              {task.steps?.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#4b7f52", flexShrink: 0, marginTop: 1 }}>✓</span>
                  <p style={{ fontSize: 12, color: "#6b7c6d", lineHeight: 1.5 }}>{step}</p>
                </div>
              ))}
            </div>

            {/* Proof input */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#6b7c6d", letterSpacing: 0.5, display: "block", marginBottom: 10 }}>
                {task.proof_label.toUpperCase()}
              </label>

              {task.proof_type === "screenshot" && (
                <div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <div
                    onClick={() => fileRef.current?.click()}
                    style={{
                      border: `2px dashed ${proofValue ? "#4b7f52" : "#e0e8e1"}`,
                      borderRadius: 14, padding: "28px 20px",
                      textAlign: "center", cursor: "pointer",
                      background: proofValue ? "#edf7ee" : "#f9fbf9",
                      transition: "all 0.2s",
                    }}
                  >
                    {proofValue ? (
                      <>
                        {/* Preview */}
                        <img
                          src={proofValue}
                          alt="proof"
                          style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 10, marginBottom: 10, objectFit: "contain" }}
                        />
                        <p style={{ fontSize: 13, color: "#4b7f52", fontWeight: 600 }}>✓ {fileName}</p>
                        <p style={{ fontSize: 11, color: "#a0b0a2", marginTop: 4 }}>Tap to change</p>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: 36, marginBottom: 10 }}>📸</div>
                        <p style={{ fontWeight: 600, fontSize: 14, color: "#1a2e1c", marginBottom: 4 }}>
                          Tap to upload screenshot
                        </p>
                        <p style={{ fontSize: 12, color: "#a0b0a2" }}>PNG, JPG or WEBP · Max 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {task.proof_type === "url" && (
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔗</span>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={proofValue}
                    onChange={(e) => setProofValue(e.target.value)}
                    style={{
                      width: "100%", padding: "14px 14px 14px 42px",
                      borderRadius: 12, border: "1.5px solid #e0e8e1",
                      fontSize: 14, outline: "none", color: "#1a2e1c", background: "#f9fbf9",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#4b7f52")}
                    onBlur={(e) => (e.target.style.borderColor = "#e0e8e1")}
                  />
                </div>
              )}

              {task.proof_type === "text" && (
                <textarea
                  placeholder="Enter your proof here..."
                  value={proofValue}
                  onChange={(e) => setProofValue(e.target.value)}
                  rows={4}
                  style={{
                    width: "100%", padding: "14px",
                    borderRadius: 12, border: "1.5px solid #e0e8e1",
                    fontSize: 14, outline: "none", color: "#1a2e1c",
                    background: "#f9fbf9", resize: "vertical", lineHeight: 1.6,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#4b7f52")}
                  onBlur={(e) => (e.target.style.borderColor = "#e0e8e1")}
                />
              )}
            </div>

            {error && (
              <div style={{
                background: "#fff5f5", border: "1px solid #fed7d7",
                borderRadius: 10, padding: "11px 14px", marginBottom: 16,
                fontSize: 13, color: "#e53e3e",
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                width: "100%",
                background: submitting ? "#a0b0a2" : "linear-gradient(135deg, #4b7f52, #3a6340)",
                color: "#fff", border: "none", borderRadius: 14, padding: "16px",
                fontWeight: 800, fontSize: 15,
                cursor: submitting ? "not-allowed" : "pointer",
                boxShadow: submitting ? "none" : "0 6px 20px rgba(75,127,82,0.3)",
              }}
            >
              {submitting ? "Submitting..." : "Submit & Claim ₦" + task.reward.toLocaleString()}
            </button>

            <p style={{ fontSize: 11, color: "#a0b0a2", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
              Rewards are credited after proof review · Usually instant
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
