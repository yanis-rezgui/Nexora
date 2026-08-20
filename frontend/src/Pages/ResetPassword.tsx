// Pages/ResetPassword.tsx
import { memo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthContext } from "../Contexts/AuthContext";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const { resetPassword, loadingResetPassword, errorMsg } = useAuthContext();

  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [done, setDone] = useState(false);
  const [mismatch, setMismatch] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const password = fd.get("password") as string;
    const confirmPassword = fd.get("confirmPassword") as string;
    if (!password || !confirmPassword || !token) return;

    if (password !== confirmPassword) {
      setMismatch(true);
      return;
    }
    setMismatch(false);

    const ok = await resetPassword(token, password, confirmPassword);
    if (ok) setDone(true);
  };

  return (
    <section
      style={{
        minHeight: "100dvh",
        background: "#0D0E12",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
      }}
      className="max-[860px]:!grid-cols-1"
    >
      {/* LEFT — brand panel (Hidden on mobile) */}
      <div
        className="max-[860px]:hidden"
        style={{
          position: "relative",
          background: "#0A0B0F",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 52px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            left: "-10%",
            width: 480,
            height: 320,
            background: "radial-gradient(ellipse, rgba(232,163,61,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <a href="/" style={{ textDecoration: "none", position: "relative", zIndex: 1 }} className="flex items-center gap-2.5">
          <div
            style={{
              width: 30, height: 30, borderRadius: 8,
              background: "linear-gradient(135deg, #E8A33D, #F2C368)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: 15, color: "#151116" }}>
              N
            </span>
          </div>
          <span style={{ fontFamily: "'Instrument Sans', sans-serif", color: "#F4F2EC", fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em" }}>
            Nexora
          </span>
        </a>

        {/* Copy + mini preview */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "clamp(26px, 2.6vw, 34px)", fontWeight: 600,
              color: "#F4F2EC", lineHeight: 1.25, letterSpacing: "-0.02em",
              margin: "0 0 14px", maxWidth: 360,
            }}
          >
            One new password, and you're back in.
          </motion.h1>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#8D897E",
            lineHeight: 1.7, maxWidth: 320, marginBottom: 32,
          }}>
            Choose something strong. For your safety, this will sign you out of every other device.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={{
              background: "#15161B",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12, padding: "14px 16px",
              maxWidth: 300,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#5B5850", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Security check
              </span>
              <div style={{
                width: 24, height: 24, borderRadius: 7,
                background: "rgba(232,163,61,0.12)", border: "1px solid rgba(232,163,61,0.28)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <i className="ti ti-shield-lock" style={{ fontSize: 12, color: "#E8A33D" }} aria-hidden="true" />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["8+ characters", "Upper & lowercase", "Number & symbol"].map(rule => (
                <div key={rule} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#B8B4A8" }}>
                  <i className="ti ti-check" style={{ fontSize: 12, color: "#5FBF8B" }} aria-hidden="true" />
                  {rule}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <span style={{ position: "relative", zIndex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#3A3833" }}>
          © 2026 Nexora
        </span>
      </div>

      {/* RIGHT — form (Optimized for Mobile) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "32px 20px 24px"
        }}
        className="min-h-[100dvh] max-[860px]:justify-center max-[860px]:py-10"
      >
        <div style={{ width: "100%", maxWidth: 380, margin: "auto 0" }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            {/* Header Mobile Logo */}
            <a
              href="/"
              className="hidden max-[860px]:flex items-center gap-2.5"
              style={{ marginBottom: 28, textDecoration: "none", width: "fit-content" }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: "linear-gradient(135deg, #E8A33D, #F2C368)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: 14, color: "#151116" }}>N</span>
              </div>
              <span style={{ fontFamily: "'Instrument Sans', sans-serif", color: "#F4F2EC", fontSize: 16, fontWeight: 600 }}>Nexora</span>
            </a>

            {done ? (
              /* ── Success state ── */
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: "rgba(95,191,139,0.1)",
                  border: "1px solid rgba(95,191,139,0.28)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                }}>
                  <i className="ti ti-shield-check" style={{ fontSize: 26, color: "#5FBF8B" }} aria-hidden="true" />
                </div>

                <h1 style={{ fontFamily: "'Instrument Sans', sans-serif", color: "#F4F2EC", fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
                  Password updated
                </h1>
                <p style={{ fontFamily: "'Inter', sans-serif", color: "#8D897E", fontSize: 13.5, lineHeight: 1.6, margin: "0 0 28px" }}>
                  Your password has been changed. You've been signed out of all devices for security.
                </p>

                <button
                  onClick={() => navigate("/login")}
                  style={{
                    width: "100%", padding: "13px 16px", minHeight: "46px",
                    background: "#E8A33D", border: "none", borderRadius: 8,
                    color: "#151116", fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
                    cursor: "pointer", transition: "opacity 0.2s, transform 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  Go to sign in →
                </button>
              </motion.div>
            ) : (
              /* ── Form state ── */
              <>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500,
                  letterSpacing: "0.1em", color: "#E8A33D", textTransform: "uppercase", marginBottom: 10,
                }}>
                  Reset Password
                </div>

                <h2 style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "clamp(22px, 5vw, 26px)",
                  fontWeight: 600,
                  color: "#F4F2EC", letterSpacing: "-0.02em", margin: "0 0 6px",
                }}>
                  Set a new password
                </h2>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#8D897E", lineHeight: 1.5, margin: "0 0 24px" }}>
                  This link expires in 15 minutes. Choose a strong password.
                </p>

                {(errorMsg || mismatch) && (
                  <div style={{
                    background: "rgba(232,101,79,0.08)",
                    border: "1px solid rgba(232,101,79,0.3)",
                    borderRadius: 8, padding: "12px 14px",
                    fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#F2998A", marginBottom: 20,
                  }}>
                    {mismatch ? "Passwords do not match" : errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* New password */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                    <label style={labelStyle}>New password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPw ? "text" : "password"}
                        name="password"
                        placeholder="Min. 8 characters"
                        autoComplete="new-password"
                        style={{ ...inputStyle, paddingRight: 44 }}
                        className="text-[16px] sm:text-[13.5px]"
                        onFocus={e => (e.currentTarget.style.borderColor = "rgba(232,163,61,0.5)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(p => !p)}
                        aria-label="Toggle password visibility"
                        style={eyeBtnStyle}
                        onMouseEnter={e => (e.currentTarget.style.color = "#C9C5B9")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#736F64")}
                      >
                        <i className={`ti ${showPw ? "ti-eye-off" : "ti-eye"}`} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                    <label style={labelStyle}>Confirm password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showConfirmPw ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        style={{ ...inputStyle, paddingRight: 44 }}
                        className="text-[16px] sm:text-[13.5px]"
                        onFocus={e => (e.currentTarget.style.borderColor = "rgba(232,163,61,0.5)")}
                        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw(p => !p)}
                        aria-label="Toggle confirm password visibility"
                        style={eyeBtnStyle}
                        onMouseEnter={e => (e.currentTarget.style.color = "#C9C5B9")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#736F64")}
                      >
                        <i className={`ti ${showConfirmPw ? "ti-eye-off" : "ti-eye"}`} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div style={{ clear: "both", marginBottom: 8 }} />

                  <button
                    type="submit"
                    disabled={loadingResetPassword}
                    style={{
                      width: "100%", padding: "13px 16px",
                      minHeight: "46px",
                      background: "#E8A33D", border: "none", borderRadius: 8,
                      color: "#151116", fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
                      cursor: loadingResetPassword ? "not-allowed" : "pointer",
                      opacity: loadingResetPassword ? 0.65 : 1,
                      transition: "opacity 0.2s, transform 0.15s",
                    }}
                    onMouseEnter={e => { if (!loadingResetPassword) { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                    onMouseLeave={e => { if (!loadingResetPassword) { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; } }}
                  >
                    {loadingResetPassword ? "Updating…" : "Reset password →"}
                  </button>
                </form>

                <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "24px 0" }} />

                <p style={{ textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E" }}>
                  Remembered it?{" "}
                  <a href="/login" style={{ color: "#E8A33D", fontWeight: 600, textDecoration: "none", padding: "4px 0" }}>
                    Back to sign in
                  </a>
                </p>
              </>
            )}
          </motion.div>
        </div>

        {/* Footer Copyright visible uniquement sur mobile */}
        <span
          className="hidden max-[860px]:block"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10.5,
            color: "#3A3833",
            marginTop: 24,
            textAlign: "center"
          }}
        >
          © 2026 Nexora
        </span>
      </div>
    </section>
  );
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 10, fontWeight: 500,
  letterSpacing: "0.06em", textTransform: "uppercase",
  color: "#8D897E",
};

const inputStyle: React.CSSProperties = {
  background: "#15161B",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 8, padding: "12px 14px",
  color: "#F4F2EC", fontFamily: "'Inter', sans-serif",
  outline: "none", width: "100%",
  transition: "border-color 0.2s",
};

const eyeBtnStyle: React.CSSProperties = {
  position: "absolute", right: 0, top: 0, bottom: 0,
  width: 44, background: "none", border: "none", cursor: "pointer",
  color: "#736F64", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
  transition: "color 0.2s",
};

export default memo(ResetPassword);
