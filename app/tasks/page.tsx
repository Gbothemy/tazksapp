"use client";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import TaskCard, { Task } from "@/components/TaskCard";

const allTasks: Task[] = [
  { id: 1, title: "Follow 3 Instagram accounts", category: "Social Media", reward: 150, duration: "2 min", icon: "📸", color: "#e8f5e9" },
  { id: 2, title: "Like & share a Facebook post", category: "Social Media", reward: 100, duration: "1 min", icon: "👍", color: "#e8f5e9" },
  { id: 3, title: "Watch a YouTube video (60s)", category: "Content", reward: 200, duration: "1 min", icon: "▶️", color: "#fdf8e1" },
  { id: 4, title: "Complete product survey", category: "Survey", reward: 500, duration: "5 min", icon: "📋", color: "#fdf8e1" },
  { id: 5, title: "Test FoodApp & rate it", category: "App Testing", reward: 1200, duration: "10 min", icon: "🧪", color: "#e8f5e9" },
  { id: 6, title: "Retweet 2 posts on X", category: "Social Media", reward: 120, duration: "1 min", icon: "🐦", color: "#e8f5e9" },
  { id: 7, title: "Fill lifestyle questionnaire", category: "Survey", reward: 350, duration: "4 min", icon: "📝", color: "#fdf8e1" },
  { id: 8, title: "Review a mobile game", category: "App Testing", reward: 800, duration: "8 min", icon: "🎮", color: "#e8f5e9" },
  { id: 9, title: "Comment on a TikTok video", category: "Content", reward: 180, duration: "2 min", icon: "🎬", color: "#fdf8e1" },
];

const filters = ["All", "Social Media", "Survey", "App Testing", "Content"];

export default function TasksPage() {
  const [active, setActive] = useState("All");
  const [completed, setCompleted] = useState<number[]>([]);

  const filtered = allTasks.filter((t) => active === "All" || t.category === active);
  const totalReward = filtered
    .filter((t) => !completed.includes(t.id))
    .reduce((sum, t) => sum + t.reward, 0);

  return (
    <div style={{ paddingBottom: 90, background: "#f2f2f2", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(160deg, #4b7f52 0%, #3a6340 100%)",
        padding: "52px 20px 28px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -50, right: -50,
          width: 180, height: 180, borderRadius: "50%",
          background: "rgba(212,175,55,0.1)",
        }} />

        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 4 }}>
          Available to earn
        </p>
        <p style={{ color: "#fff", fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>
          Browse Tasks
        </p>

        {/* Potential earnings pill */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(212,175,55,0.2)",
          border: "1px solid rgba(212,175,55,0.35)",
          borderRadius: 20, padding: "6px 16px", marginTop: 12,
        }}>
          <span style={{ fontSize: 14 }}>💰</span>
          <span style={{ color: "#e8c84a", fontSize: 13, fontWeight: 700 }}>
            Earn up to ₦{totalReward.toLocaleString()} today
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{
        display: "flex", gap: 8, padding: "16px 16px",
        overflowX: "auto",
        background: "#fff",
        borderBottom: "1px solid #edf2ee",
      }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            style={{
              flexShrink: 0,
              padding: "8px 18px",
              borderRadius: 20,
              border: active === f ? "none" : "1.5px solid #e0e8e1",
              background: active === f
                ? "linear-gradient(135deg, #4b7f52, #5e9e67)"
                : "#f2f2f2",
              color: active === f ? "#fff" : "#6b7c6d",
              fontWeight: active === f ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
              boxShadow: active === f ? "0 4px 12px rgba(75,127,82,0.25)" : "none",
              transition: "all 0.2s",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      {completed.length > 0 && (
        <div style={{ padding: "14px 16px 0" }}>
          <div style={{
            background: "#fff", borderRadius: 14, padding: "14px 16px",
            boxShadow: "0 2px 8px rgba(75,127,82,0.06)",
            border: "1px solid #edf2ee",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1a2e1c" }}>
                {completed.length} of {allTasks.length} tasks completed
              </p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#4b7f52" }}>
                {Math.round((completed.length / allTasks.length) * 100)}%
              </p>
            </div>
            <div style={{ height: 6, background: "#f2f2f2", borderRadius: 10, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${(completed.length / allTasks.length) * 100}%`,
                background: "linear-gradient(90deg, #4b7f52, #d4af37)",
                borderRadius: 10,
                transition: "width 0.4s ease",
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Task list */}
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((task) => (
          <TaskCard
            key={task.id}
            task={{ ...task, completed: completed.includes(task.id) }}
            onComplete={(id) => setCompleted((prev) => [...prev, id])}
          />
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
