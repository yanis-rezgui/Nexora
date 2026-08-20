import { memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLabelsContext } from "../../Contexts/LabelsContext";
import LabelChip from "../Shared/LabelChip";

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: string;
}

const DEFAULT_COLOR = "#E8A33D";

const ManageLabelsModal = ({ open, onClose, projectId }: Props) => {
  const {
    projectLabels, loadingProjectLabels, getProjectLabels,
    createLabel, loadingCreateLabel,
    updateLabel, deleteLabel,
    errorMsg,
  } = useLabelsContext();

  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState(DEFAULT_COLOR);

  useEffect(() => {
    if (open) getProjectLabels(projectId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, projectId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createLabel(projectId, name.trim(), color);
    setName("");
    setColor(DEFAULT_COLOR);
  };

  const startEdit = (id: string, currentName: string, currentColor: string) => {
    setEditingId(id);
    setEditName(currentName);
    setEditColor(currentColor);
  };

  const saveEdit = async () => {
    if (editingId && editName.trim()) {
      await updateLabel(editingId, { name: editName.trim(), color: editColor });
    }
    setEditingId(null);
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
              position: "relative", width: "100%", maxWidth: 440, background: "#15161B",
              border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "26px 24px",
              zIndex: 101, boxShadow: "0 30px 80px rgba(0,0,0,0.5)", maxHeight: "85vh", overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 18, fontWeight: 600, color: "#F4F2EC", margin: 0 }}>
                Manage labels
              </h2>
              <button onClick={onClose} aria-label="Close" style={closeBtn}>
                <i className="ti ti-x" style={{ fontSize: 16 }} aria-hidden="true" />
              </button>
            </div>

            {errorMsg && <div style={errorBox}>{errorMsg}</div>}

            {/* --------------------------------------------------- */}
            {/* List */}
            {/* --------------------------------------------------- */}

            {loadingProjectLabels ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} style={{ height: 38, borderRadius: 8, background: "#0D0E12", border: "1px solid rgba(255,255,255,0.06)" }} />
                ))}
              </div>
            ) : projectLabels.length === 0 ? (
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#5B5850", margin: "0 0 20px" }}>
                No labels yet — create your first one below.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {projectLabels.map(label => (
                  <div key={label.id} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: "#0D0E12", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 8, padding: "8px 10px",
                  }}>
                    {editingId === label.id ? (
                      <>
                        <input
                          type="color"
                          value={editColor}
                          onChange={e => setEditColor(e.target.value)}
                          style={colorInput}
                        />
                        <input
                          autoFocus
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && saveEdit()}
                          maxLength={50}
                          style={{ ...inputStyle, flex: 1, padding: "6px 9px" }}
                        />
                        <button onClick={saveEdit} style={{ ...iconBtn, color: "#5FBF8B" }} aria-label="Save">
                          <i className="ti ti-check" style={{ fontSize: 14 }} aria-hidden="true" />
                        </button>
                        <button onClick={() => setEditingId(null)} style={iconBtn} aria-label="Cancel">
                          <i className="ti ti-x" style={{ fontSize: 14 }} aria-hidden="true" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div style={{ flex: 1 }}>
                          <LabelChip name={label.name} color={label.color} />
                        </div>
                        <button onClick={() => startEdit(label.id, label.name, label.color)} style={iconBtn} aria-label="Edit label">
                          <i className="ti ti-pencil" style={{ fontSize: 13 }} aria-hidden="true" />
                        </button>
                        <button onClick={() => deleteLabel(label.id)} style={{ ...iconBtn, color: "#E8654F" }} aria-label="Delete label">
                          <i className="ti ti-trash" style={{ fontSize: 13 }} aria-hidden="true" />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* --------------------------------------------------- */}
            {/* Create form */}
            {/* --------------------------------------------------- */}

            <form onSubmit={handleCreate} style={{ display: "flex", gap: 8, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                style={colorInput}
              />
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="New label name…"
                maxLength={50}
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                type="submit"
                disabled={loadingCreateLabel || !name.trim()}
                style={{
                  padding: "9px 14px", background: "#E8A33D", border: "none", borderRadius: 8,
                  color: "#151116", fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600,
                  cursor: loadingCreateLabel || !name.trim() ? "not-allowed" : "pointer",
                  opacity: loadingCreateLabel || !name.trim() ? 0.55 : 1, flexShrink: 0,
                }}
              >
                Add
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

const inputStyle: React.CSSProperties = {
  background: "#15161B", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8,
  padding: "9px 12px", color: "#F4F2EC", fontFamily: "'Inter', sans-serif", fontSize: 12.5, outline: "none",
};
const colorInput: React.CSSProperties = {
  width: 34, height: 34, padding: 2, background: "#15161B",
  border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8, cursor: "pointer", flexShrink: 0,
};
const closeBtn: React.CSSProperties = { width: 28, height: 28, borderRadius: 7, border: "none", background: "transparent", color: "#5B5850", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
const iconBtn: React.CSSProperties = { width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "#8D897E", cursor: "pointer", flexShrink: 0 };
const errorBox: React.CSSProperties = { background: "rgba(232,101,79,0.08)", border: "1px solid rgba(232,101,79,0.3)", borderRadius: 8, padding: "10px 13px", fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#F2998A", marginBottom: 16 };

export default memo(ManageLabelsModal);