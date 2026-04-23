"use client";
import { useEffect, useState, useCallback } from "react";

interface Completion {
  id: number;
  user_name: string;
  email: string;
  task_title: string;
  category: string;
  proof_type: string;
  proof_value: string | null;
  completed_at: string;
}

const TH: React.CSSProperties = { padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #eee", whiteSpace: "nowrap" };
const TD: React.CSSProperties = { padding: "14px 16px", fontSize: 13, color: "#333", borderBottom: "1px solid #f5f5f5", verticalAlign: "middle" };

const PROOF_COLORS: Record<string, { bg: string; color: string }> = {
  screenshot: { bg: "#e8f5e9", color: "#2e7d32" },
  url:        { bg: "#e3f2fd", color: "#1565c0" },
  text:       { bg: "#fff8e1", color: "#e67e22" },
  none:       { bg: "#f5f5f5", color: "#999" },
};

function ProofBadge({ type, value }: { type: string; value: string | null }) {
  const c = PROOF_COLORS[type] ?? PROOF_COLORS.none;
  if (!value) return <span style={{ color: "#aaa", fontSize: 12 }}>—</span>;
  if (value === "[screenshot uploaded]" || value.startsWith("[")) {
    return <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: c.bg, color: c.color }}>📸 Screenshot</span>;
  }
  if (type === "url") {
    return <a href={value} target="_blank" rel="noopener noreferrer" style={{ color: "#1565c0", fontSize: 12, wordBreak: "break-all" }}>{value.length > 50 ? value.slice(0, 50) + "…" : value}</a>;
  }
  return <span style={{ fontSize: 12, color: "#555" }}>{value.length > 60 ? value.slice(0, 60) + "…" : value}</span>;
}

export default function CompletionsPage() {
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [proofFilter, setProofFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCompletions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (proofFilter) params.set("proof_type", proofFilter);
      const res = await fetch(`/api/admin/completions?${params}`);
      const data = await res.json();
      setCompletions(data.completions ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [page, proofFilter]);

  useEffect(() => { fetchCompletions(); }, [fetchCompletions]);

  const totalPages = Math.ceil(total / 30);

  return (
    <div>
      <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 700, color: "#1a2e1c" }}>Completions</h1>
      <p style={{ margin: "0 0 24px", color: "#888", fontSize: 14 }}>{total.toLocaleString()} total submissions</p>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["", "screenshot", "url", "text"].map((f) => (
          <button key={f} onClick={() => { setProofFilter(f); setPage(1); }}
            style={{ padding: "8px 18px", borderRadius: 20, border: "1.5px solid", borderColor: proofFilter === f ? "#4b7f52" : "#e0e0e0", background: proofFilter === f ? "#4b7f52" : "#fff", color: proofFilter === f ? "#fff" : "#666", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
            {f === "" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th style={TH}>ID</th>
              <th style={TH}>User</th>
              <th style={TH}>Task</th>
              <th style={TH}>Category</th>
              <th style={TH}>Proof Type</th>
              <th style={TH}>Proof</th>
              <th style={TH}>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ ...TD, textAlign: "center", color: "#aaa", padding: 40 }}>Loading…</td></tr>
            ) : completions.length === 0 ? (
              <tr><td colSpan={7} style={{ ...TD, textAlign: "center", color: "#aaa", padding: 40 }}>No completions found</td></tr>
            ) : completions.map((c) => (
              <tr key={c.id}>
                <td style={TD}>{c.id}</td>
                <td style={TD}>
                  <div style={{ fontWeight: 500 }}>{c.user_name}</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>{c.email}</div>
                </td>
                <td style={{ ...TD, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.task_title}</td>
                <td style={TD}>{c.category}</td>
                <td style={TD}>
                  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: (PROOF_COLORS[c.proof_type] ?? PROOF_COLORS.none).bg, color: (PROOF_COLORS[c.proof_type] ?? PROOF_COLORS.none).color }}>
                    {c.proof_type}
                  </span>
                </td>
                <td style={{ ...TD, maxWidth: 260 }}>
                  <ProofBadge type={c.proof_type} value={c.proof_value} />
                </td>
                <td style={{ ...TD, color: "#888", whiteSpace: "nowrap" }}>
                  {new Date(c.completed_at).toLocaleDateString()} {new Date(c.completed_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 20, alignItems: "center" }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #ddd", cursor: "pointer", background: "#fff" }}>
            ← Prev
          </button>
          <span style={{ fontSize: 13, color: "#666" }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #ddd", cursor: "pointer", background: "#fff" }}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
