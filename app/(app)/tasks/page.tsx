"use client";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import TaskCard, { Task } from "@/components/TaskCard";
import TaskModal, { FullTask } from "@/components/TaskModal";
import { useAuth } from "@/lib/useAuth";

const filters = ["All", "Social Media", "Survey", "App Testing", "Content"];

export default function TasksPage() {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<FullTask[]>([]);
  const [fetching, setFetching] = useState(true);
  const [active, setActive] = useState("All");
  const [selectedTask, setSelectedTask] = useState<FullTask | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch("/api/tasks")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.tasks) setTasks(d.tasks); })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [user]);

  const handleComplete = async (id: number, proofValue: string) => {
    const res = await fetch("/api/tasks/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: id, proofValue }),
    });
    const data = await res.json();
    if (res.ok) {
      setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: true } : t));
      return { ok: true };
    }
    return { ok: false, error: data.error };
  };

  if (loading || fetching) return <LoadingScreen />;

  const filtered = tasks.filter((t) => active === "All" || t.category === active);
  const completed = tasks.filter((t) => t.completed).length;
  const totalReward = filtered.filter((t) => !t.completed).reduce((s, t) => s + t.reward, 0);

  return (
    <div className="page-body" style={{ background: "#f2f2f2", minHeight: "100vh" }}>

      {/* Header */}
      <div className="page-header" style={{
        background: "linear-gradient(160deg, #4b7f52 0%, #3a6340 100%)",
        padding: "52px 20px 28px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(212,175,55,0.1)" }} />
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 4 }}>Available to earn</p>
        <p style={{ color: "#fff", fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>Browse Tasks</p>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.35)",
          borderRadius: 20, padding: "6px 16px", marginTop: 12,
        }}>
          <span style={{ fontSize: 14 }}>💰</span>
          <span style={{ color: "#e8c84a", fontSize: 13, fontWeight: 700 }}>
            Earn up to {totalReward.toLocaleString()} QTL today
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, padding: "16px", overflowX: "auto", background: "#fff", borderBottom: "1px solid #edf2ee" }}>
        {filters.map((f) => (
          <button key={f} onClick={() => setActive(f)} style={{
            flexShrink: 0, padding: "8px 18px", borderRadius: 20,
            border: active === f ? "none" : "1.5px solid #e0e8e1",
            background: active === f ? "linear-gradient(135deg, #4b7f52, #5e9e67)" : "#f2f2f2",
            color: active === f ? "#fff" : "#6b7c6d",
            fontWeight: active === f ? 700 : 500, fontSize: 13, cursor: "pointer",
            boxShadow: active === f ? "0 4px 12px rgba(75,127,82,0.25)" : "none",
          }}>
            {f}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      {completed > 0 && (
        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", boxShadow: "0 2px 8px rgba(75,127,82,0.06)", border: "1px solid #edf2ee" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1a2e1c" }}>{completed} of {tasks.length} tasks completed</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#4b7f52" }}>{Math.round((completed / tasks.length) * 100)}%</p>
            </div>
            <div style={{ height: 6, background: "#f2f2f2", borderRadius: 10, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${(completed / tasks.length) * 100}%`,
                background: "linear-gradient(90deg, #4b7f52, #d4af37)",
                borderRadius: 10, transition: "width 0.4s ease",
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Task list */}
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }} className="task-grid">
        {filtered.map((task) => (
          <TaskCard
            key={task.id}
            task={task as Task}
            onStart={(t) => setSelectedTask(t as FullTask)}
          />
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontSize: 32 }}>🎉</p>
            <p style={{ color: "#a0b0a2", marginTop: 8 }}>All tasks in this category done!</p>
          </div>
        )}
      </div>

      {/* Task detail modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onComplete={handleComplete}
        />
      )}

      <BottomNav />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f2f2f2" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
        <p style={{ color: "#4b7f52", fontWeight: 700 }}>Loading tasks...</p>
      </div>
    </div>
  );
}
