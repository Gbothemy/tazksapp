"use client";

export interface Task {
  id: number;
  title: string;
  category: string;
  reward: number;
  duration: string;
  icon: string;
  color: string;
  instructions?: string;
  steps?: string[];
  proof_type?: string;
  proof_label?: string;
  total_budget?: number;
  budget_used?: number;
  completed?: boolean;
}

interface TaskCardProps {
  task: Task;
  onStart: (task: Task) => void;
}

export default function TaskCard({ task, onStart }: TaskCardProps) {
  return (
    <div style={{
      background: "#111111",
      borderRadius: 18,
      padding: "16px 18px",
      display: "flex",
      alignItems: "center",
      gap: 14,
      boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
      border: "1px solid #222222",
      opacity: task.completed ? 0.5 : 1,
      transition: "opacity 0.3s",
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 16,
        background: "rgba(26,239,34,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24, flexShrink: 0,
      }}>
        {task.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: 14, color: "#F5F5F5", marginBottom: 4, lineHeight: 1.3 }}>
          {task.title}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            fontSize: 10, fontWeight: 600, color: "#1AEF22",
            background: "rgba(26,239,34,0.12)", borderRadius: 6, padding: "2px 8px",
          }}>
            {task.category}
          </span>
          <span style={{ fontSize: 11, color: "#555555" }}>⏱ {task.duration}</span>
        </div>
        {task.total_budget && task.total_budget > 0 && (
          <div style={{ marginTop: 6 }}>
            <div style={{ height: 3, background: "#222222", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${Math.min(100, ((task.budget_used ?? 0) / task.total_budget) * 100)}%`,
                background: (task.budget_used ?? 0) / task.total_budget > 0.8 ? "#F5A623" : "#1AEF22",
                borderRadius: 2,
              }} />
            </div>
            <p style={{ fontSize: 10, color: "#555555", marginTop: 2 }}>
              {Math.round(((task.budget_used ?? 0) / task.total_budget) * 100)}% of slots filled
            </p>
          </div>
        )}
      </div>

      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ fontWeight: 800, fontSize: 15, color: "#1AEF22", marginBottom: 6 }}>
          +{task.reward.toLocaleString()} QLT
        </p>
        {task.completed ? (
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "rgba(26,239,34,0.12)", borderRadius: 8, padding: "5px 10px",
          }}>
            <span style={{ fontSize: 12 }}>✓</span>
            <span style={{ fontSize: 11, color: "#1AEF22", fontWeight: 700 }}>Done</span>
          </div>
        ) : (
          <button
            onClick={() => onStart(task)}
            style={{
              background: "linear-gradient(135deg, #1AEF22, #06B517)",
              color: "#000", border: "none", borderRadius: 10,
              padding: "7px 16px", fontSize: 12, fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(26,239,34,0.3)",
              letterSpacing: 0.3,
            }}
          >
            Start
          </button>
        )}
      </div>
    </div>
  );
}
