import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ConfirmDeleteModalProps {
  open: boolean;
  title: string;
  description: string;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmDeleteModal = ({ open, title, description, loading, onConfirm, onClose }: ConfirmDeleteModalProps) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100 }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: "92%", maxWidth: 400,
            background: "#15161B",
            border: "1px solid rgba(232,101,79,0.25)",
            borderRadius: 16, padding: "26px 24px",
            zIndex: 101, boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 10, marginBottom: 16,
            background: "rgba(232,101,79,0.12)", border: "1px solid rgba(232,101,79,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <i className="ti ti-alert-triangle" style={{ fontSize: 19, color: "#E8654F" }} aria-hidden="true" />
          </div>

          <h2 style={{
            fontFamily: "'Instrument Sans', sans-serif", fontSize: 18, fontWeight: 600,
            color: "#F4F2EC", margin: "0 0 8px",
          }}>
            {title}
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E",
            lineHeight: 1.6, margin: "0 0 24px",
          }}>
            {description}
          </p>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1, padding: "11px",
                background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8, color: "#C9C5B9",
                fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 500, cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              style={{
                flex: 1, padding: "11px",
                background: "#E8654F", border: "none", borderRadius: 8,
                color: "#151116", fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Deleting…" : "Delete"}
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default memo(ConfirmDeleteModal);