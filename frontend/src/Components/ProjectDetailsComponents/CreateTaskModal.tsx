// Components/ProjectDetailsComponents/CreateTaskModal.tsx
import { memo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTasksContext } from "../../Contexts/TasksContext";
import { useMembersContext } from "../../Contexts/MembersContext";
import type { TaskPriority } from "../../Types/Types";

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: string;
}

const CreateTaskModal = ({ open, onClose, projectId }: Props) => {
  const { createTask, loadingCreateTask, errorMsg } = useTasksContext();
  const { members } = useMembersContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");

  const reset = () => { setTitle(""); setDescription(""); setPriority("MEDIUM"); setAssigneeId(""); setDueDate(""); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createTask(projectId, {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      assigneeId: assigneeId || undefined,
      dueDate: dueDate || undefined,
    });
    reset();
    onClose();
  };

  const handleClose = () => { reset(); onClose(); };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }} role="dialog" aria-modal="true"
            style={{
              position: "relative", width: "100%", maxWidth: 460, background: "#15161B",
              border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "26px 24px",
              zIndex: 101, boxShadow: "0 30px 80px rgba(0,0,0,0.5)", maxHeight: "90vh", overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <h2 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 19, fontWeight: 600, color: "#F4F2EC", margin: 0 }}>
                Create task
              </h2>
              <button onClick={handleClose} aria-label="Close" style={closeBtn}><i className="ti ti-x" style={{ fontSize: 16 }} aria-hidden="true" /></button>
            </div>

            {errorMsg && <div style={errorBox}>{errorMsg}</div>}

            <form onSubmit={handleSubmit}>
              <div style={fieldWrap}>
                <label style={labelStyle}>Title</label>
                <input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="Fix authentication bug" maxLength={150} style={inputStyle} />
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                  style={{ ...inputStyle, resize: "vertical", fontFamily: "'Inter', sans-serif" }} />
              </div>

              <div className="max-[420px]:!grid-cols-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Priority</label>
                  <select value={priority} onChange={e => setPriority(e.target.value as TaskPriority)} style={{ ...inputStyle, marginTop: 6 }}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Due date</label>
                  <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ ...inputStyle, marginTop: 6 }} />
                </div>
              </div>

              <div style={fieldWrap}>
                <label style={labelStyle}>Assignee</label>
                <select value={assigneeId} onChange={e => setAssigneeId(e.target.value)} style={inputStyle}>
                  <option value="">Unassigned</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>)}
                </select>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <button type="button" onClick={handleClose} style={cancelBtn}>Cancel</button>
                <button type="submit" disabled={loadingCreateTask || !title.trim()} style={{ ...saveBtn, opacity: loadingCreateTask || !title.trim() ? 0.55 : 1 }}>
                  {loadingCreateTask ? "Creating…" : "Create task"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

const fieldWrap: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 };
const labelStyle: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "#8D897E" };
const inputStyle: React.CSSProperties = { background: "#0D0E12", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8, padding: "10px 13px", color: "#F4F2EC", fontFamily: "'Inter', sans-serif", fontSize: 13.5, outline: "none", width: "100%" };
const closeBtn: React.CSSProperties = { width: 28, height: 28, borderRadius: 7, border: "none", background: "transparent", color: "#5B5850", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
const errorBox: React.CSSProperties = { background: "rgba(232,101,79,0.08)", border: "1px solid rgba(232,101,79,0.3)", borderRadius: 8, padding: "10px 13px", fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#F2998A", marginBottom: 16 };
const cancelBtn: React.CSSProperties = { flex: 1, padding: 11, background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#C9C5B9", fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 500, cursor: "pointer" };
const saveBtn: React.CSSProperties = { flex: 1, padding: 11, background: "#E8A33D", border: "none", borderRadius: 8, color: "#151116", fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 600, cursor: "pointer" };

export default memo(CreateTaskModal);