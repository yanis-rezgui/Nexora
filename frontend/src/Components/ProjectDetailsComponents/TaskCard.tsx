// Components/ProjectDetailsComponents/TaskCard.tsx
import { memo, useState } from "react";
import { motion } from "framer-motion";
import { useTasksContext } from "../../Contexts/TasksContext";
import type { Task } from "../../Types/Types";
import TaskDetailsModal from "./TaskDetailsModal";


const PRIORITY_STYLE: Record<string, string> = {
  LOW: "#5FBF8B", MEDIUM: "#E8A33D", HIGH: "#E8654F", URGENT: "#F24141",
};

const STATUS_STYLE: Record<string, string> = {
  TODO: "#5B5850", IN_PROGRESS: "#7B9BE8", IN_REVIEW: "#E8A33D", DONE: "#5FBF8B",
};

interface Props {
  task: Task;
  index?: number;
  projectId: string;
  role: string;
}

const TaskCard = ({ task, index = 0, projectId, role }: Props) => {
  const { updateTaskStatus } = useTasksContext();
  const [open, setOpen] = useState(false);
  const canEditStatus = role !== "DEVELOPER" || task.assignee?.id;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.2) }}
        onClick={() => setOpen(true)}
        style={{
          background: "#15161B", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12, padding: "14px 16px", cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 500, color: "#F4F2EC" }}>
            {task.title}
          </span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 600,
            color: PRIORITY_STYLE[task.priority], flexShrink: 0,
          }}>
            {task.priority}
          </span>
        </div>

        <div className="max-[480px]:!flex-col max-[480px]:!items-start max-[480px]:!gap-2"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_STYLE[task.status] }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#8D897E" }}>
              {task.status.replace("_", " ")}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {task.assignee && (
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#8D897E" }}>
                <i className="ti ti-user" style={{ fontSize: 13 }} aria-hidden="true" />
                {task.assignee.firstName}
              </span>
            )}
            {task.dueDate && (
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850" }}>
                {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      <TaskDetailsModal
        open={open}
        onClose={() => setOpen(false)}
        taskId={task.id}
        projectId={projectId}
        role={role}
      />
    </>
  );
};

export default memo(TaskCard);