// Components/ProjectsComponents/CreateProjectModal.tsx
import { memo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useProjectsContext } from "../../Contexts/ProjectsContext";

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateProjectModal = ({ open, onClose }: CreateProjectModalProps) => {
  const { createProject, loadingCreateProject, errorMsg } = useProjectsContext();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createProject(name.trim(), description.trim() || undefined);

    setName("");
    setDescription("");
    onClose();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(2px)",
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 440,
              background: "#15161B",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 16,
              padding: "26px 24px",
              zIndex: 101,
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <h2 style={{
                fontFamily: "'Instrument Sans', sans-serif", fontSize: 19, fontWeight: 600,
                color: "#F4F2EC", margin: 0, letterSpacing: "-0.01em",
              }}>
                New project
              </h2>
              <button
                onClick={handleClose}
                aria-label="Close"
                style={{
                  width: 28, height: 28, borderRadius: 7, border: "none",
                  background: "transparent", color: "#5B5850", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "color 0.15s, background 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "#F4F2EC"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#5B5850"; e.currentTarget.style.background = "transparent"; }}
              >
                <i className="ti ti-x" style={{ fontSize: 16 }} aria-hidden="true" />
              </button>
            </div>

            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E",
              lineHeight: 1.6, margin: "0 0 22px",
            }}>
              Give your project a name — you can invite your team once it's created.
            </p>

            {errorMsg && (
              <div style={{
                background: "rgba(232,101,79,0.08)",
                border: "1px solid rgba(232,101,79,0.3)",
                borderRadius: 8, padding: "10px 13px",
                fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#F2998A", marginBottom: 16,
              }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                <label style={labelStyle}>Project name</label>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Website Redesign"
                  maxLength={100}
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(232,163,61,0.5)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
                <label style={labelStyle}>Description <span style={{ color: "#3A3833" }}>(optional)</span></label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="What's this project about?"
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical", fontFamily: "'Inter', sans-serif" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(232,163,61,0.5)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    flex: 1, padding: "11px",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 8, color: "#C9C5B9",
                    fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 500,
                    cursor: "pointer", transition: "border-color 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.24)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingCreateProject || !name.trim()}
                  style={{
                    flex: 1, padding: "11px",
                    background: "#E8A33D", border: "none", borderRadius: 8,
                    color: "#151116", fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 600,
                    cursor: loadingCreateProject || !name.trim() ? "not-allowed" : "pointer",
                    opacity: loadingCreateProject || !name.trim() ? 0.55 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  {loadingCreateProject ? "Creating…" : "Create project"}
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

const labelStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 10, fontWeight: 500,
  letterSpacing: "0.06em", textTransform: "uppercase",
  color: "#8D897E",
};

const inputStyle: React.CSSProperties = {
  background: "#0D0E12",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 8, padding: "10px 13px",
  color: "#F4F2EC", fontFamily: "'Inter', sans-serif", fontSize: 13.5,
  outline: "none", width: "100%",
  transition: "border-color 0.2s",
};

export default memo(CreateProjectModal);