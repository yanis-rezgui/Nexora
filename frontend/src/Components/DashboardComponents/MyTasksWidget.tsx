// Components/DashboardComponents/MyTasksWidget.tsx
import { memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { DashboardTask, TaskPriority } from "../../Types/Types";

const PRIORITY_COLOR: Record<TaskPriority, string> = {
  LOW: "#8D897E",
  MEDIUM: "#7B9BE8",
  HIGH: "#E8A33D",
  URGENT: "#E8654F",
};

const formatDueDate = (dueDate: string | null) => {
  if (!dueDate) return null;

  const date = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((date.getTime() - today.getTime()) / 86400000);
  const isOverdue = diffDays < 0;

  let label: string;
  if (diffDays === 0) label = "Today";
  else if (diffDays === 1) label = "Tomorrow";
  else if (diffDays < 0) label = `${Math.abs(diffDays)}d overdue`;
  else if (diffDays <= 7) label = `In ${diffDays}d`;
  else label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return { label, isOverdue };
};

interface MyTasksWidgetProps {
  tasks: DashboardTask[];
}

const MyTasksWidget = ({ tasks }: MyTasksWidgetProps) => {
  const navigate = useNavigate();

  return (
    <div style={{
      background: "#15161B", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14, padding: "18px 18px 14px",
      display: "flex", flexDirection: "column", minWidth: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h2 style={{
          fontFamily: "'Instrument Sans', sans-serif", fontSize: 15.5, fontWeight: 600,
          color: "#F4F2EC", margin: 0,
        }}>
          My Tasks
        </h2>
        <i className="ti ti-checklist" style={{ fontSize: 15, color: "#5B5850" }} aria-hidden="true" />
      </div>

      {tasks.length === 0 ? (
        <div style={{
          padding: "26px 10px", textAlign: "center",
          fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#5B5850",
        }}>
          Nothing on your plate right now.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {tasks.map((task, i) => {
            const due = formatDueDate(task.dueDate);
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.2) }}
                onClick={() => navigate(`/user/projects/${task.projectId}`)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 8px", borderRadius: 8, cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{
                  width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
                  background: PRIORITY_COLOR[task.priority],
                }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#F4F2EC",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {task.title}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850" }}>
                    {task.project.name}
                  </div>
                </div>
                {due && (
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10, flexShrink: 0,
                    color: due.isOverdue ? "#E8654F" : "#5B5850", whiteSpace: "nowrap",
                  }}>
                    {due.label}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => navigate("/user/tasks")}
        style={{
          marginTop: 12, background: "transparent", border: "none",
          color: "#E8A33D", fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 5, padding: "4px 8px",
          alignSelf: "flex-start",
        }}
      >
        View all
        <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" />
      </button>
    </div>
  );
};

export default memo(MyTasksWidget);