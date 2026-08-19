// Components/AdminComponents/UserDetailsModal.tsx
import { memo, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAdminContext } from "../../Contexts/AdminContext";

interface UserDetailsModalProps {
  userId: string | null;
  onClose: () => void;
}

const STATUS_COLOR: Record<string, string> = {
  TODO: "#8D897E", IN_PROGRESS: "#7B9BE8", IN_REVIEW: "#B98CE8", DONE: "#5FBF8B",
};

const UserDetailsModal = ({ userId, onClose }: UserDetailsModalProps) => {
  const {
    currentUser, loadingCurrentUser, getUserById,
    updateUserRole, loadingUpdateUserRole,
    sessions, loadingSessions, getUserSessions,
    revokeUserSessions, loadingRevokeSessions,
    errorMsg,
  } = useAdminContext();

  useEffect(() => {
    if (!userId) return;
    getUserById(userId);
    getUserSessions(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const open = !!userId;
  const taskTotal = currentUser
    ? Object.values(currentUser.taskCounts).reduce((a, b) => a + b, 0)
    : 0;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            style={{
              position: "relative", width: "100%", maxWidth: 480,
              background: "#15161B", border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 16, padding: "26px 24px", zIndex: 101,
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
              maxHeight: "88vh", overflowY: "auto",
            }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: "absolute", top: 18, right: 18,
                width: 28, height: 28, borderRadius: 7, border: "none",
                background: "transparent", color: "#5B5850", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#F4F2EC"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#5B5850"; e.currentTarget.style.background = "transparent"; }}
            >
              <i className="ti ti-x" style={{ fontSize: 16 }} aria-hidden="true" />
            </button>

            {loadingCurrentUser || !currentUser ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4 }}>
                {[54, 90, 90].map((h, i) => (
                  <div key={i} style={{ height: h, borderRadius: 10, background: "#0D0E12", border: "1px solid rgba(255,255,255,0.06)" }} />
                ))}
              </div>
            ) : (
              <>
                {/* Identity */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: 12, flexShrink: 0,
                    background: currentUser.role === "ADMIN" ? "rgba(232,163,61,0.14)" : "rgba(123,155,232,0.14)",
                    border: `1px solid ${currentUser.role === "ADMIN" ? "rgba(232,163,61,0.35)" : "rgba(123,155,232,0.35)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 600,
                      color: currentUser.role === "ADMIN" ? "#E8A33D" : "#7B9BE8",
                    }}>
                      {currentUser.firstName[0]}{currentUser.lastName[0]}
                    </span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h2 style={{
                      fontFamily: "'Instrument Sans', sans-serif", fontSize: 18, fontWeight: 600,
                      color: "#F4F2EC", margin: "0 0 3px", letterSpacing: "-0.01em",
                    }}>
                      {currentUser.firstName} {currentUser.lastName}
                    </h2>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#8D897E" }}>
                      {currentUser.email}
                    </span>
                  </div>
                </div>

                {errorMsg && (
                  <div style={{
                    background: "rgba(232,101,79,0.08)", border: "1px solid rgba(232,101,79,0.3)",
                    borderRadius: 8, padding: "10px 13px",
                    fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#F2998A", marginBottom: 16,
                  }}>
                    {errorMsg}
                  </div>
                )}

                {/* Status + join date */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                  <span style={{
                    display: "flex", alignItems: "center", gap: 5,
                    fontFamily: "'Inter', sans-serif", fontSize: 11.5, fontWeight: 500,
                    color: currentUser.isActive ? "#5FBF8B" : "#E8654F",
                    background: currentUser.isActive ? "rgba(95,191,139,0.1)" : "rgba(232,101,79,0.1)",
                    border: `1px solid ${currentUser.isActive ? "rgba(95,191,139,0.3)" : "rgba(232,101,79,0.3)"}`,
                    borderRadius: 6, padding: "4px 9px",
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: currentUser.isActive ? "#5FBF8B" : "#E8654F" }} />
                    {currentUser.isActive ? "Active" : "Suspended"}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850" }}>
                    Joined {new Date(currentUser.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Role */}
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Role</label>
                  <div style={{ position: "relative", marginTop: 6 }}>
                    <select
                      value={currentUser.role}
                      disabled={loadingUpdateUserRole}
                      onChange={e => updateUserRole(currentUser.id, e.target.value as "USER" | "ADMIN")}
                      style={{
                        appearance: "none", WebkitAppearance: "none", width: "100%",
                        background: "#0D0E12", border: "1px solid rgba(255,255,255,0.09)",
                        borderRadius: 8, padding: "10px 30px 10px 13px",
                        color: "#F4F2EC", fontFamily: "'Inter', sans-serif", fontSize: 13,
                        outline: "none", cursor: loadingUpdateUserRole ? "not-allowed" : "pointer",
                      }}
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <i className="ti ti-chevron-down" style={{
                      position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)",
                      fontSize: 12, color: "#5B5850", pointerEvents: "none",
                    }} aria-hidden="true" />
                  </div>
                </div>

                {/* Task breakdown */}
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Tasks ({taskTotal})</label>
                  <div className="max-[380px]:!grid-cols-2" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 8 }}>
                    {Object.entries(currentUser.taskCounts).map(([status, count]) => (
                      <div key={status} style={{
                        background: "#0D0E12", border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 8, padding: "9px 8px", textAlign: "center",
                      }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 600, color: STATUS_COLOR[status] ?? "#C9C5B9" }}>
                          {count}
                        </div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: "#5B5850", marginTop: 2 }}>
                          {status.replace("_", " ")}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#5B5850", marginTop: 8 }}>
                    Member of {currentUser.projectCount} project{currentUser.projectCount !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Sessions */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <label style={labelStyle}>
                      Active sessions ({sessions.length})
                    </label>
                    {sessions.length > 0 && (
                      <button
                        onClick={() => userId && revokeUserSessions(userId)}
                        disabled={loadingRevokeSessions}
                        style={{
                          background: "transparent", border: "none", cursor: loadingRevokeSessions ? "not-allowed" : "pointer",
                          color: "#E8654F", fontFamily: "'Inter', sans-serif", fontSize: 11.5, fontWeight: 500,
                          padding: 0, opacity: loadingRevokeSessions ? 0.6 : 1,
                        }}
                      >
                        {loadingRevokeSessions ? "Revoking..." : "Revoke all"}
                      </button>
                    )}
                  </div>

                  {loadingSessions ? (
                    <div style={{ height: 40, borderRadius: 8, background: "#0D0E12", border: "1px solid rgba(255,255,255,0.06)" }} />
                  ) : sessions.length === 0 ? (
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#5B5850", margin: 0 }}>
                      No active sessions.
                    </p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {sessions.map(s => (
                        <div key={s.id} style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          background: "#0D0E12", border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: 8, padding: "8px 12px",
                        }}>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#8D897E" }}>
                            Signed in {new Date(s.createdAt).toLocaleDateString()}
                          </span>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#5B5850" }}>
                            expires {new Date(s.expiresAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
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

export default memo(UserDetailsModal);
