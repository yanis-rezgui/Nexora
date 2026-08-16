// Components/ProjectDetailsComponents/TaskDetailsModal.tsx
import { memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTasksContext } from "../../Contexts/TasksContext";
import { useMembersContext } from "../../Contexts/MembersContext";
import type { TaskStatus } from "../../Types/Types";
import ConfirmDeleteModal from "../ProjectsComponents/ConfirmDeleteModal";

interface Props {
  open: boolean;
  onClose: () => void;
  taskId: string;
  projectId: string;
  role: string;
}

const STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

const TaskDetailsModal = ({ open, onClose, taskId, projectId, role }: Props) => {
  const { currentTask, loadingCurrentTask, getTaskById, updateTaskStatus, assignTask, deleteTask, loadingDeleteTask } = useTasksContext();
  const { members } = useMembersContext();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const canManage = role === "OWNER" || role === "MANAGER";
  const canEditStatus = canManage || currentTask?.assignee?.id;

  useEffect(() => {
    if (open) getTaskById(projectId, taskId);
  }, [open, projectId, taskId]);

  const handleDelete = async () => {
    await deleteTask(projectId, taskId);
    setConfirmOpen(false);
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }} role="dialog" aria-modal="true"
            style={{
              position: "relative", width: "100%", maxWidth: 520, background: "#15161B",
              border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "26px 24px",
              zIndex: 101, boxShadow: "0 30px 80px rgba(0,0,0,0.5)", maxHeight: "88vh", overflowY: "auto",
            }}
          >
            {loadingCurrentTask || !currentTask ? (
              <div style={{ height: 200 }} />
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 18 }}>
                  <h2 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 18, fontWeight: 600, color: "#F4F2EC", margin: 0 }}>
                    {currentTask.title}
                  </h2>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    {canManage && (
                      <button onClick={() => setConfirmOpen(true)} aria-label="Delete task" style={{ ...closeBtn, color: "#E8654F" }}>
                        <i className="ti ti-trash" style={{ fontSize: 15 }} aria-hidden="true" />
                      </button>
                    )}
                    <button onClick={onClose} aria-label="Close" style={closeBtn}>
                      <i className="ti ti-x" style={{ fontSize: 16 }} aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {currentTask.description && (
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", lineHeight: 1.6, margin: "0 0 20px" }}>
                    {currentTask.description}
                  </p>
                )}

                <div className="max-[420px]:!grid-cols-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                  <div>
                    <label style={labelStyle}>Status</label>
                    <select
                      value={currentTask.status}
                      disabled={!canEditStatus}
                      onChange={e => updateTaskStatus(projectId, taskId, e.target.value as TaskStatus)}
                      style={{ ...inputStyle, marginTop: 6 }}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Assignee</label>
                    <select
                      value={currentTask.assignee?.id ?? ""}
                      disabled={!canManage}
                      onChange={e => assignTask(projectId, taskId, e.target.value || null)}
                      style={{ ...inputStyle, marginTop: 6 }}
                    >
                      <option value="">Unassigned</option>
                      {members.map(m => <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span>Created by {currentTask.creator?.firstName}</span>
                  {currentTask.dueDate && <span>Due {new Date(currentTask.dueDate).toLocaleDateString()}</span>}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}

      <ConfirmDeleteModal
        open={confirmOpen}
        title="Delete task"
        description="This will permanently delete this task. This action cannot be undone."
        loading={loadingDeleteTask}
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </AnimatePresence>,
    document.body
  );
};

const labelStyle: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "#8D897E" };
const inputStyle: React.CSSProperties = { background: "#0D0E12", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8, padding: "10px 13px", color: "#F4F2EC", fontFamily: "'Inter', sans-serif", fontSize: 13, outline: "none", width: "100%" };
const closeBtn: React.CSSProperties = { width: 28, height: 28, borderRadius: 7, border: "none", background: "transparent", color: "#5B5850", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };

export default memo(TaskDetailsModal);