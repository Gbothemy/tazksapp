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
  completed?: boolean;
}

interface TaskCardProps {
  task: Task;
  onStart: (task: Task) => void;
}

export default function TaskCard({ task, onStart }: TaskCardProps) {
  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 18,
      padding: "16px 18px",
      display: "flex",
      alignItems: "center",
      gap: 14,
      boxShadow: "0 2px 12px rgba(75,127,82,0.08)",
      border: "1px solid #edf2ee",
      opacity: task.completed ? 0.55 : 1,
      transition: "opacity 0.3s",
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 16,
        background: task.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24, flexShrink: 0,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}>
        {task.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: 14, color: "#1a2e1c", marginBottom: 4, lineHeight: 1.3 }}>
          {task.title}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            fontSize: 10, fontWeight: 600, color: "#4b7f52",
            background: "#edf7ee", borderRadius: 6, padding: "2px 8px",
          }}>
            {task.category}
          </span>
          <span style={{ fontSize: 11, color: "#a0b0a2" }}>⏱ {task.duration}</span>
        </div>
      </div>

      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ fontWeight: 800, fontSize: 15, color: "#4b7f52", marginBottom: 6 }}>
          +{task.reward} QTL
        </p>
        {task.completed ? (
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "#edf7ee", borderRadius: 8, padding: "5px 10px",
          }}>
            <span style={{ fontSize: 12 }}>✓</span>
            <span style={{ fontSize: 11, color: "#4b7f52", fontWeight: 700 }}>Done</span>
          </div>
        ) : (
          <button
            onClick={() => onStart(task)}
            style={{
              background: "linear-gradient(135deg, #4b7f52, #5e9e67)",
              color: "#fff", border: "none", borderRadius: 10,
              padding: "7px 16px", fontSize: 12, fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(75,127,82,0.3)",
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
