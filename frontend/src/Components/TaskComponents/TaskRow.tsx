// Components/TasksComponents/TaskRow.tsx
import { memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { MyTask, TaskStatus, TaskPriority } from "../../Types/Types";

const STATUS_STYLE: Record<TaskStatus, { label: string; color: string; bg: string; border: string }> = {
  TODO:        { label: "To Do",       color: "#8D897E", bg: "rgba(141,137,126,0.12)", border: "rgba(141,137,126,0.3)" },
  IN_PROGRESS: { label: "In Progress", color: "#7B9BE8", bg: "rgba(123,155,232,0.12)", border: "rgba(123,155,232,0.35)" },
  IN_REVIEW:   { label: "In Review",   color: "#B98CE8", bg: "rgba(185,140,232,0.12)", border: "rgba(185,140,232,0.35)" },
  DONE:        { label: "Done",        color: "#5FBF8B", bg: "rgba(95,191,139,0.12)",  border: "rgba(95,191,139,0.35)" },
};

const PRIORITY_STYLE: Record<TaskPriority, { label: string; color: string; bg: string; border: string }> = {
  LOW:    { label: "Low",    color: "#8D897E", bg: "rgba(141,137,126,0.1)", border: "rgba(141,137,126,0.28)" },
  MEDIUM: { label: "Medium", color: "#7B9BE8", bg: "rgba(123,155,232,0.1)", border: "rgba(123,155,232,0.28)" },
  HIGH:   { label: "High",   color: "#E8A33D", bg: "rgba(232,163,61,0.1)", border: "rgba(232,163,61,0.3)" },
  URGENT: { label: "Urgent", color: "#E8654F", bg: "rgba(232,101,79,0.12)", border: "rgba(232,101,79,0.32)" },
};

const STATUS_OPTIONS: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

const formatDueDate = (dueDate: string | null, status: TaskStatus) => {
  if (!dueDate) return null;

  const date = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((date.getTime() - today.getTime()) / 86400000);
  const isOverdue = diffDays < 0 && status !== "DONE";

  let label: string;
  if (diffDays === 0) label = "Today";
  else if (diffDays === 1) label = "Tomorrow";
  else if (diffDays === -1) label = "Yesterday";
  else if (diffDays < 0) label = `${Math.abs(diffDays)}d overdue`;
  else if (diffDays <= 7) label = `In ${diffDays}d`;
  else label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return { label, isOverdue };
};

interface TaskRowProps {
  task: MyTask;
  index?: number;
  onStatusChange: (status: TaskStatus) => void;
}

const TaskRow = ({ task, index = 0, onStatusChange }: TaskRowProps) => {
  const navigate = useNavigate();

  const statusStyle = STATUS_STYLE[task.status];
  const priorityStyle = PRIORITY_STYLE[task.priority];
  const due = formatDueDate(task.dueDate, task.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.25) }}
      onClick={() => navigate(`/user/projects/${task.projectId}`)}
      style={{
        background: "#15161B",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        padding: "14px 16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 14,
        transition: "border-color 0.2s",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(232,163,61,0.3)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
    >
      {/* Priority indicator */}
      <div
        title={priorityStyle.label}
        style={{
          width: 3, height: 34, borderRadius: 3, flexShrink: 0,
          background: priorityStyle.color,
        }}
      />

      {/* Main content */}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500,
          color: "#F4F2EC", marginBottom: 5,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          textDecoration: task.status === "DONE" ? "line-through" : "none",
          opacity: task.status === "DONE" ? 0.6 : 1,
        }}>
          {task.title}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{
            display: "flex", alignItems: "center", gap: 4,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850",
          }}>
            <i className="ti ti-folder" style={{ fontSize: 11 }} aria-hidden="true" />
            {task.project.name}
          </span>

          {due && (
            <span style={{
              display: "flex", alignItems: "center", gap: 4,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
              color: due.isOverdue ? "#E8654F" : "#5B5850",
            }}>
              <i className="ti ti-calendar" style={{ fontSize: 11 }} aria-hidden="true" />
              {due.label}
            </span>
          )}

          {(task._count?.comments ?? 0) > 0 && (
            <span style={{
              display: "flex", alignItems: "center", gap: 4,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850",
            }}>
              <i className="ti ti-message-circle" style={{ fontSize: 11 }} aria-hidden="true" />
              {task._count!.comments}
            </span>
          )}

          {(task._count?.attachments ?? 0) > 0 && (
            <span style={{
              display: "flex", alignItems: "center", gap: 4,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850",
            }}>
              <i className="ti ti-paperclip" style={{ fontSize: 11 }} aria-hidden="true" />
              {task._count!.attachments}
            </span>
          )}
        </div>
      </div>

      {/* Priority badge */}
      <span
        className="max-[560px]:hidden"
        style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 600,
          color: priorityStyle.color, background: priorityStyle.bg,
          border: `1px solid ${priorityStyle.border}`,
          borderRadius: 5, padding: "3px 8px", flexShrink: 0, whiteSpace: "nowrap",
        }}
      >
        {priorityStyle.label}
      </span>

      {/* Status select */}
      <div style={{ position: "relative", flexShrink: 0 }} onClick={e => e.stopPropagation()}>
        <select
          value={task.status}
          onChange={e => onStatusChange(e.target.value as TaskStatus)}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            background: statusStyle.bg,
            border: `1px solid ${statusStyle.border}`,
            borderRadius: 6,
            padding: "5px 22px 5px 10px",
            color: statusStyle.color,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10.5, fontWeight: 600,
            cursor: "pointer", outline: "none",
          }}
        >
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s} style={{ background: "#15161B", color: "#F4F2EC" }}>
              {STATUS_STYLE[s].label}
            </option>
          ))}
        </select>
        <i
          className="ti ti-chevron-down"
          style={{
            position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)",
            fontSize: 10, color: statusStyle.color, pointerEvents: "none",
          }}
          aria-hidden="true"
        />
      </div>
    </motion.div>
  );
};

export default memo(TaskRow);