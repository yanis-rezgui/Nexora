// Components/AdminComponents/ConfirmActionModal.tsx
import { memo } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

interface ConfirmActionModalProps {
  open: boolean;
  title: string;
  description: string;
  icon?: string;
  color?: string; // accent color, defaults to warning gold
  confirmLabel: string;
  loadingLabel?: string;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmActionModal = ({
  open, title, description, icon = "ti-alert-triangle", color = "#E8A33D",
  confirmLabel, loadingLabel = "Working...", loading, onConfirm, onClose,
}: ConfirmActionModalProps) =>
  createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 110 }}
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
              border: `1px solid ${color}40`,
              borderRadius: 16, padding: "26px 24px",
              zIndex: 111, boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                width: 40, height: 40, borderRadius: 10, marginBottom: 16,
                background: `${color}1f`, border: `1px solid ${color}4d`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <i className={`ti ${icon}`} style={{ fontSize: 19, color }} aria-hidden="true" />
            </div>

            <h2 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 18, fontWeight: 600, color: "#F4F2EC", margin: "0 0 8px" }}>
              {title}
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", lineHeight: 1.6, margin: "0 0 24px" }}>
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
                  background: color, border: "none", borderRadius: 8,
                  color: "#151116", fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? loadingLabel : confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );

export default memo(ConfirmActionModal);
