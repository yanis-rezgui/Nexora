import { memo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSettingsContext } from "../../Contexts/SettingsContext";
import { Banner, inputStyle, labelStyle } from "./shared";

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
}

const DeleteAccountModal = ({ open, onClose }: DeleteAccountModalProps) => {
  const { deleteAccount, loadingDeleteAccount, errorMsg, clearMessages } = useSettingsContext();
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const canSubmit = password.length > 0 && confirmText === "DELETE";

  const handleClose = () => {
    setPassword("");
    setConfirmText("");
    clearMessages();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const ok = await deleteAccount(password);
    if (ok) window.location.href = "/login";
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog" aria-modal="true"
            style={{
              position: "relative", width: "100%", maxWidth: 420,
              background: "#15161B", border: "1px solid rgba(232,101,79,0.3)",
              borderRadius: 16, padding: "26px 24px", zIndex: 101,
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
              maxHeight: "90vh", overflowY: "auto",
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 10, marginBottom: 16,
              background: "rgba(232,101,79,0.12)", border: "1px solid rgba(232,101,79,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <i className="ti ti-alert-triangle" style={{ fontSize: 19, color: "#E8654F" }} aria-hidden="true" />
            </div>

            <h2 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 18, fontWeight: 600, color: "#F4F2EC", margin: "0 0 8px" }}>
              Delete your account
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", lineHeight: 1.6, margin: "0 0 20px" }}>
              This will permanently delete your account, along with your tasks, comments, and activity. Projects you own must be deleted or transferred first. This action cannot be undone.
            </p>

            {errorMsg && <Banner tone="error">{errorMsg}</Banner>}

            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                <label style={labelStyle}>Confirm your password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(232,101,79,0.5)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 22 }}>
                <label style={labelStyle}>
                  Type <span style={{ color: "#E8654F" }}>DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={e => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  style={inputStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(232,101,79,0.5)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={handleClose}
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
                  type="submit"
                  disabled={!canSubmit || loadingDeleteAccount}
                  style={{
                    flex: 1, padding: "11px",
                    background: "#E8654F", border: "none", borderRadius: 8,
                    color: "#151116", fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 600,
                    cursor: !canSubmit || loadingDeleteAccount ? "not-allowed" : "pointer",
                    opacity: !canSubmit || loadingDeleteAccount ? 0.55 : 1,
                  }}
                >
                  {loadingDeleteAccount ? "Deleting…" : "Delete account"}
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

export default memo(DeleteAccountModal);