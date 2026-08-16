// Components/ProjectDetailsComponents/EditProjectModal.tsx
import { memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useProjectsContext } from "../../Contexts/ProjectsContext";
import type { ProjectDetailsResponse } from "../../Types/Types";

interface Props {
  open: boolean;
  onClose: () => void;
  project: ProjectDetailsResponse;
}

const EditProjectModal = ({ open, onClose, project }: Props) => {
  const { updateProject, loadingUpdateProject, errorMsg } = useProjectsContext();
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");

  useEffect(() => {
    if (open) { setName(project.name); setDescription(project.description ?? ""); }
  }, [open, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await updateProject(project.id, { name: name.trim(), description: description.trim() });
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog" aria-modal="true"
            style={{
              position: "relative", width: "100%", maxWidth: 440, background: "#15161B",
              border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "26px 24px",
              zIndex: 101, boxShadow: "0 30px 80px rgba(0,0,0,0.5)", maxHeight: "90vh", overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <h2 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 19, fontWeight: 600, color: "#F4F2EC", margin: 0 }}>
                Edit project
              </h2>
              <button onClick={onClose} aria-label="Close" style={closeBtn}>
                <i className="ti ti-x" style={{ fontSize: 16 }} aria-hidden="true" />
              </button>
            </div>

            {errorMsg && <div style={errorBox}>{errorMsg}</div>}

            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                <label style={labelStyle}>Project name</label>
                <input value={name} onChange={e => setName(e.target.value)} maxLength={100} style={inputStyle} autoFocus />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
                <label style={labelStyle}>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                  style={{ ...inputStyle, resize: "vertical", fontFamily: "'Inter', sans-serif" }} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" onClick={onClose} style={cancelBtn}>Cancel</button>
                <button type="submit" disabled={loadingUpdateProject || !name.trim()} style={{ ...saveBtn, opacity: loadingUpdateProject || !name.trim() ? 0.55 : 1 }}>
                  {loadingUpdateProject ? "Saving…" : "Save changes"}
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

const labelStyle: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "#8D897E" };
const inputStyle: React.CSSProperties = { background: "#0D0E12", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8, padding: "10px 13px", color: "#F4F2EC", fontFamily: "'Inter', sans-serif", fontSize: 13.5, outline: "none", width: "100%" };
const closeBtn: React.CSSProperties = { width: 28, height: 28, borderRadius: 7, border: "none", background: "transparent", color: "#5B5850", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
const errorBox: React.CSSProperties = { background: "rgba(232,101,79,0.08)", border: "1px solid rgba(232,101,79,0.3)", borderRadius: 8, padding: "10px 13px", fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#F2998A", marginBottom: 16 };
const cancelBtn: React.CSSProperties = { flex: 1, padding: 11, background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#C9C5B9", fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 500, cursor: "pointer" };
const saveBtn: React.CSSProperties = { flex: 1, padding: 11, background: "#E8A33D", border: "none", borderRadius: 8, color: "#151116", fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 600, cursor: "pointer" };

export default memo(EditProjectModal);