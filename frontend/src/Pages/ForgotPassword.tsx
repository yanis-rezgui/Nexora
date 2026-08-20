// Pages/ForgotPassword.tsx
import { memo, useState } from "react";
import { motion } from "framer-motion";
import { useAuthContext } from "../Contexts/AuthContext";

const ForgotPassword = () => {
  const { forgotPassword, loadingForgotPassword, errorMsg } = useAuthContext();
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    if (!email) return;

    const ok = await forgotPassword(email);
    if (ok) setSent(true);
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
            Everyone forgets a password sometimes.
          </motion.h1>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#8D897E",
            lineHeight: 1.7, maxWidth: 320, marginBottom: 32,
          }}>
            We'll send a secure link to your inbox so you can get straight back to your projects.
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
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 8,
                background: "rgba(232,163,61,0.12)", border: "1px solid rgba(232,163,61,0.28)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <i className="ti ti-mail" style={{ fontSize: 13, color: "#E8A33D" }} aria-hidden="true" />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#5B5850", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Reset link sent
              </span>
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#F0EEE7", marginBottom: 6 }}>
              you@example.com
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850" }}>
              Expires in 15 minutes
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
              Forgot your password?
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#8D897E", lineHeight: 1.5, margin: "0 0 24px" }}>
              Enter your email and we'll send you a link to reset it.
            </p>

            {errorMsg && !sent && (
              <div style={{
                background: "rgba(232,101,79,0.08)",
                border: "1px solid rgba(232,101,79,0.3)",
                borderRadius: 8, padding: "12px 14px",
                fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#F2998A", marginBottom: 20,
              }}>
                {errorMsg}
              </div>
            )}

            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "rgba(95,191,139,0.08)",
                  border: "1px solid rgba(95,191,139,0.28)",
                  borderRadius: 10, padding: "18px 16px",
                  display: "flex", flexDirection: "column", gap: 10, alignItems: "center",
                  textAlign: "center", marginBottom: 6,
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: "rgba(95,191,139,0.12)",
                  border: "1px solid rgba(95,191,139,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <i className="ti ti-mail-check" style={{ fontSize: 20, color: "#5FBF8B" }} aria-hidden="true" />
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#5FBF8B", lineHeight: 1.6, margin: 0 }}>
                  If an account exists for that email, a reset link is on its way.
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#8D897E", margin: 0 }}>
                  Check your inbox — the link expires in 15 minutes.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    style={inputStyle}
                    className="text-[16px] sm:text-[13.5px]" // Empeche le zoom auto sur iOS
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(232,163,61,0.5)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingForgotPassword}
                  style={{
                    width: "100%", padding: "13px 16px",
                    minHeight: "46px",
                    background: "#E8A33D", border: "none", borderRadius: 8,
                    color: "#151116", fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
                    cursor: loadingForgotPassword ? "not-allowed" : "pointer",
                    opacity: loadingForgotPassword ? 0.65 : 1,
                    transition: "opacity 0.2s, transform 0.15s",
                  }}
                  onMouseEnter={e => { if (!loadingForgotPassword) { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                  onMouseLeave={e => { if (!loadingForgotPassword) { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; } }}
                >
                  {loadingForgotPassword ? "Sending…" : "Send reset link →"}
                </button>
              </form>
            )}

            <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "24px 0" }} />

            <p style={{ textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E" }}>
              Remembered it?{" "}
              <a href="/login" style={{ color: "#E8A33D", fontWeight: 600, textDecoration: "none", padding: "4px 0" }}>
                Back to sign in
              </a>
            </p>
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

export default memo(ForgotPassword);
