"use client";
import { useEffect, useState, useCallback } from "react";

interface Task {
  id: number;
  title: string;
  category: string;
  reward: number;
  duration: string;
  proof_type: string;
  max_screenshots: number;
  is_active: boolean;
}

const EMPTY_FORM = {
  title: "",
  category: "",
  reward: "",
  duration: "5 min",
  icon: "📋",
  color: "#e8f5e9",
  instructions: "",
  steps: "",
  proof_type: "screenshot",
  proof_label: "Upload screenshot as proof",
  max_screenshots: "1",
};

const TH: React.CSSProperties = {
  padding: "12px 16px",
  textAlign: "left",
  fontSize: 12,
  fontWeight: 600,
  color: "#888",
  textTransform: "uppercase",
  letterSpacing: 0.5,
  borderBottom: "1px solid #eee",
  whiteSpace: "nowrap",
};

const TD: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: 14,
  color: "#333",
  borderBottom: "1px solid #f5f5f5",
  verticalAlign: "middle",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tasks", {
        headers: { "x-admin-key": "qeixova-admin-2025" },
      });
      const data = await res.json();
      setTasks(data.tasks ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  function openAdd() {
    setEditTask(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(t: Task) {
    setEditTask(t);
    setForm({
      title: t.title,
      category: t.category,
      reward: String(t.reward),
      duration: t.duration,
      icon: "📋",
      color: "#e8f5e9",
      instructions: "",
      steps: "",
      proof_type: t.proof_type,
      proof_label: "Upload screenshot as proof",
      max_screenshots: String(t.max_screenshots),
    });
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        ...form,
        reward: Number(form.reward),
        max_screenshots: Number(form.max_screenshots),
        steps: form.steps ? form.steps.split("\n").filter(Boolean) : [],
      };
      if (editTask) {
        await fetch("/api/admin/tasks", {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "x-admin-key": "qeixova-admin-2025" },
          body: JSON.stringify({ id: editTask.id, ...payload }),
        });
      } else {
        await fetch("/api/admin/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-admin-key": "qeixova-admin-2025" },
          body: JSON.stringify(payload),
        });
      }
      setShowModal(false);
      fetchTasks();
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(t: Task) {
    setActionLoading(t.id);
    try {
      await fetch("/api/admin/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": "qeixova-admin-2025" },
        body: JSON.stringify({ id: t.id, is_active: !t.is_active }),
      });
      fetchTasks();
    } finally {
      setActionLoading(null);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px",
    border: "1.5px solid #e0e0e0",
    borderRadius: 7,
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#555",
    marginBottom: 5,
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 700, color: "#1a2e1c" }}>Tasks</h1>
          <p style={{ margin: 0, color: "#888", fontSize: 14 }}>{tasks.length} tasks total</p>
        </div>
        <button
          onClick={openAdd}
          style={{
            padding: "10px 20px",
            background: "#4b7f52",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add New Task
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th style={TH}>ID</th>
              <th style={TH}>Title</th>
              <th style={TH}>Category</th>
              <th style={TH}>Reward (QTL)</th>
              <th style={TH}>Duration</th>
              <th style={TH}>Proof Type</th>
              <th style={TH}>Max Screenshots</th>
              <th style={TH}>Status</th>
              <th style={TH}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} style={{ ...TD, textAlign: "center", color: "#aaa", padding: 40 }}>Loading…</td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ ...TD, textAlign: "center", color: "#aaa", padding: 40 }}>No tasks found</td>
              </tr>
            ) : (
              tasks.map((t) => (
                <tr key={t.id}>
                  <td style={TD}>{t.id}</td>
                  <td style={{ ...TD, fontWeight: 500, maxWidth: 200 }}>{t.title}</td>
                  <td style={TD}>{t.category}</td>
                  <td style={TD}>{Number(t.reward).toLocaleString()}</td>
                  <td style={TD}>{t.duration}</td>
                  <td style={TD}>{t.proof_type}</td>
                  <td style={{ ...TD, textAlign: "center" }}>{t.max_screenshots}</td>
                  <td style={TD}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        background: t.is_active ? "#e8f5e9" : "#f5f5f5",
                        color: t.is_active ? "#2e7d32" : "#999",
                      }}
                    >
                      {t.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={TD}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => openEdit(t)}
                        style={{
                          padding: "5px 12px",
                          borderRadius: 6,
                          border: "1px solid #4b7f52",
                          background: "transparent",
                          color: "#4b7f52",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleActive(t)}
                        disabled={actionLoading === t.id}
                        style={{
                          padding: "5px 12px",
                          borderRadius: 6,
                          border: "none",
                          background: t.is_active ? "#e67e22" : "#4b7f52",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                          opacity: actionLoading === t.id ? 0.6 : 1,
                        }}
                      >
                        {t.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 32,
              width: "100%",
              maxWidth: 560,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700, color: "#1a2e1c" }}>
              {editTask ? "Edit Task" : "Add New Task"}
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Title *</label>
                <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Category *</label>
                <input style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Social Media, Survey…" />
              </div>
              <div>
                <label style={labelStyle}>Reward (QTL) *</label>
                <input style={inputStyle} type="number" value={form.reward} onChange={(e) => setForm({ ...form, reward: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Duration</label>
                <input style={inputStyle} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="5 min" />
              </div>
              <div>
                <label style={labelStyle}>Proof Type</label>
                <select style={inputStyle} value={form.proof_type} onChange={(e) => setForm({ ...form, proof_type: e.target.value })}>
                  <option value="screenshot">Screenshot</option>
                  <option value="url">URL</option>
                  <option value="text">Text</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Max Screenshots</label>
                <input style={inputStyle} type="number" min="1" value={form.max_screenshots} onChange={(e) => setForm({ ...form, max_screenshots: e.target.value })} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Proof Label</label>
                <input style={inputStyle} value={form.proof_label} onChange={(e) => setForm({ ...form, proof_label: e.target.value })} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Instructions</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                  value={form.instructions}
                  onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Steps (one per line)</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                  value={form.steps}
                  onChange={(e) => setForm({ ...form, steps: e.target.value })}
                  placeholder="Step 1&#10;Step 2&#10;Step 3"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.title || !form.category || !form.reward}
                style={{
                  padding: "10px 24px",
                  borderRadius: 8,
                  border: "none",
                  background: "#4b7f52",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "Saving…" : editTask ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
