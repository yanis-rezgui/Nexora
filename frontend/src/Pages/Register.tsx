// Pages/Register.tsx
import { useState, memo } from "react";
import { motion } from "framer-motion";
import { useAuthContext } from "../Contexts/AuthContext";

const Register = () => {
  const { signUp, loadingSignUp, errorMsg } = useAuthContext();
  const [pwStrength, setPwStrength] = useState(0);
  const [pwMatch, setPwMatch] = useState<boolean | null>(null);

  const calcStrength = (v: string) => {
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/\d/.test(v)) s++;
    if (/[@$!%*?&]/.test(v)) s++;
    return s;
  };

  const strengthColor = ["#E8654F", "#E8654F", "#E8A33D", "#7B9BE8", "#5FBF8B"][pwStrength];
  const strengthLabel = ["Weak", "Weak", "Fair", "Good", "Excellent"][pwStrength];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const firstName = fd.get("firstName") as string;
    const lastName = fd.get("lastName") as string;
    const email = fd.get("email") as string;
    const password1 = fd.get("password1") as string;
    const password2 = fd.get("password2") as string;

    if (!firstName || !lastName || !email || !password1 || password1 !== password2) return;
    await signUp(firstName, lastName, email, password1, password2);
  };

  return (
    <section
      style={{
        minHeight: "100vh",
        background: "#0D0E12",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
      }}
      className="max-[860px]:!grid-cols-1"
    >
      {/* LEFT — brand panel */}
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

        <a href="/" style={{ textDecoration: "none", position: "relative", zIndex: 1 }} className="flex items-center gap-2.5">
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "linear-gradient(135deg, #E8A33D, #F2C368)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: 15, color: "#151116" }}>N</span>
          </div>
          <span style={{ fontFamily: "'Instrument Sans', sans-serif", color: "#F4F2EC", fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em" }}>
            Nexora
          </span>
        </a>

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
            Create your workspace, invite your team.
          </motion.h1>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#8D897E",
            lineHeight: 1.7, maxWidth: 320, marginBottom: 32,
          }}>
            Free for small teams. No credit card required.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            {[
              { label: "3 projects, 5 members — free", icon: "ti-users" },
              { label: "Real-time Kanban board", icon: "ti-layout-kanban" },
              { label: "Admin, Manager, Developer roles", icon: "ti-shield-check" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                  background: "rgba(232,163,61,0.1)", border: "1px solid rgba(232,163,61,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <i className={`ti ${item.icon}`} style={{ fontSize: 13, color: "#E8A33D" }} />
                </div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#C9C5B9" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        <span style={{ position: "relative", zIndex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#3A3833" }}>
          © 2026 Nexora
        </span>
      </div>

      {/* RIGHT — form */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ width: "100%", maxWidth: 400 }}
        >
          <div className="hidden max-[860px]:flex items-center gap-2.5" style={{ marginBottom: 32 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: "linear-gradient(135deg, #E8A33D, #F2C368)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: 13, color: "#151116" }}>N</span>
            </div>
            <span style={{ fontFamily: "'Instrument Sans', sans-serif", color: "#F4F2EC", fontSize: 15, fontWeight: 600 }}>Nexora</span>
          </div>

          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500,
            letterSpacing: "0.1em", color: "#E8A33D", textTransform: "uppercase", marginBottom: 14,
          }}>
            Sign Up
          </div>

          <h2 style={{
            fontFamily: "'Instrument Sans', sans-serif", fontSize: 26, fontWeight: 600,
            color: "#F4F2EC", letterSpacing: "-0.02em", margin: "0 0 8px",
          }}>
            Create your account
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#8D897E", lineHeight: 1.6, margin: "0 0 26px" }}>
            Start organizing your team's workflow today.
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
            <div className="max-[400px]:!grid-cols-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "First name", name: "firstName", placeholder: "Sarah" },
                { label: "Last name", name: "lastName", placeholder: "Benali" },
              ].map(f => (
                <div key={f.name} style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                  <label style={labelStyle}>{f.label}</label>
                  <input
                    type="text" name={f.name} placeholder={f.placeholder} style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(232,163,61,0.5)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email" name="email" placeholder="you@example.com" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(232,163,61,0.5)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password" name="password1"
                placeholder="8+ chars, uppercase, number, symbol"
                style={inputStyle}
                onChange={e => setPwStrength(calcStrength(e.target.value))}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(232,163,61,0.5)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                <div style={{ flex: 1, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 2,
                    width: `${pwStrength * 25}%`,
                    background: strengthColor,
                    transition: "width 0.3s, background 0.3s",
                  }} />
                </div>
                {pwStrength > 0 && (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: strengthColor }}>
                    {strengthLabel}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
              <label style={labelStyle}>Confirm password</label>
              <input
                type="password" name="password2"
                placeholder="Repeat your password"
                style={{
                  ...inputStyle,
                  borderColor: pwMatch === false ? "rgba(232,101,79,0.5)" : "rgba(255,255,255,0.09)",
                }}
                onChange={e => {
                  const pw = (document.querySelector('input[name="password1"]') as HTMLInputElement)?.value;
                  setPwMatch(e.target.value === "" ? null : e.target.value === pw);
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(232,163,61,0.5)")}
                onBlur={e => (e.currentTarget.style.borderColor = pwMatch === false ? "rgba(232,101,79,0.5)" : "rgba(255,255,255,0.09)")}
              />
            </div>

            <button
              type="submit"
              disabled={loadingSignUp}
              style={{
                width: "100%", padding: "12px",
                background: "#E8A33D", border: "none", borderRadius: 8,
                color: "#151116", fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
                cursor: loadingSignUp ? "not-allowed" : "pointer",
                opacity: loadingSignUp ? 0.65 : 1,
                transition: "opacity 0.2s, transform 0.15s",
              }}
              onMouseEnter={e => { if (!loadingSignUp) { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
              onMouseLeave={e => { if (!loadingSignUp) { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; } }}
            >
              {loadingSignUp ? "Creating account…" : "Create account →"}
            </button>
          </form>

          <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "24px 0" }} />

          <p style={{ textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#5B5850" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#E8A33D", fontWeight: 600, textDecoration: "none" }}>
              Sign in
            </a>
          </p>

          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#3A3833", textAlign: "center", marginTop: 18, lineHeight: 1.6 }}>
            By creating an account, you agree to our{" "}
            <a href="/terms" style={{ color: "#5B5850", textDecoration: "underline" }}>Terms of Service</a>{" "}
            and{" "}
            <a href="/privacy" style={{ color: "#5B5850", textDecoration: "underline" }}>Privacy Policy</a>.
          </p>
        </motion.div>
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
  borderRadius: 8, padding: "10px 13px",
  color: "#F4F2EC", fontFamily: "'Inter', sans-serif", fontSize: 13.5,
  outline: "none", width: "100%",
  transition: "border-color 0.2s",
};

export default memo(Register);