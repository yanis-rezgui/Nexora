import { memo, useEffect, useState } from "react";
import { useSettingsContext } from "../../Contexts/SettingsContext";
import SettingsCard from "./SettingsCard";
import { Banner, inputStyle, labelStyle } from "./shared";

const PASSWORD_RULES = [
  { key: "length", label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { key: "upper", label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { key: "lower", label: "One lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { key: "number", label: "One number", test: (v: string) => /\d/.test(v) },
  { key: "special", label: "One special character", test: (v: string) => /[@$!%*?&]/.test(v) },
];

const SecuritySection = () => {
  const { updatePassword, loadingUpdatePassword, errorMsg, successMsg, clearMessages } = useSettingsContext();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    clearMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rulesPassed = PASSWORD_RULES.every(r => r.test(newPassword1));
  const passwordsMatch = newPassword1.length > 0 && newPassword1 === newPassword2;
  const canSubmit = currentPassword.length > 0 && rulesPassed && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const ok = await updatePassword(currentPassword, newPassword1, newPassword2);
    if (ok) {
      setCurrentPassword("");
      setNewPassword1("");
      setNewPassword2("");
    }
  };

  return (
    <SettingsCard title="Security" description="Keep your account secure">

      {errorMsg && <Banner tone="error">{errorMsg}</Banner>}
      {successMsg && <Banner tone="success">{successMsg}</Banner>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
          <label style={labelStyle}>Current password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(232,163,61,0.5)")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
          <label style={labelStyle}>New password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPw ? "text" : "password"}
              value={newPassword1}
              onChange={e => setNewPassword1(e.target.value)}
              autoComplete="new-password"
              style={{ ...inputStyle, paddingRight: 40 }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(232,163,61,0.5)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
            />
            <button
              type="button"
              onClick={() => setShowPw(p => !p)}
              aria-label="Toggle password visibility"
              style={{
                position: "absolute", right: 0, top: 0, bottom: 0, width: 40,
                background: "none", border: "none", cursor: "pointer",
                color: "#736F64", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <i className={`ti ${showPw ? "ti-eye-off" : "ti-eye"}`} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
          <label style={labelStyle}>Confirm new password</label>
          <input
            type={showPw ? "text" : "password"}
            value={newPassword2}
            onChange={e => setNewPassword2(e.target.value)}
            autoComplete="new-password"
            style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(232,163,61,0.5)")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
          />
          {newPassword2.length > 0 && !passwordsMatch && (
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#F2998A" }}>
              Passwords do not match
            </span>
          )}
        </div>

        <div style={{
          background: "#0D0E12", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 8, padding: "12px 14px", marginBottom: 20,
        }}>
          <p style={{ ...labelStyle, marginBottom: 8 }}>Password requirements</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {PASSWORD_RULES.map(rule => {
              const passed = rule.test(newPassword1);
              return (
                <div key={rule.key} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <i
                    className={`ti ${passed ? "ti-circle-check" : "ti-circle"}`}
                    style={{ fontSize: 13, color: passed ? "#5FBF8B" : "#3A3833" }}
                    aria-hidden="true"
                  />
                  <span style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 12,
                    color: passed ? "#C9C5B9" : "#5B5850",
                  }}>
                    {rule.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            disabled={!canSubmit || loadingUpdatePassword}
            style={{
              padding: "10px 20px",
              background: "#E8A33D", border: "none", borderRadius: 8,
              color: "#151116", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
              cursor: !canSubmit || loadingUpdatePassword ? "not-allowed" : "pointer",
              opacity: !canSubmit || loadingUpdatePassword ? 0.55 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {loadingUpdatePassword ? "Updating…" : "Update password"}
          </button>
        </div>
      </form>
    </SettingsCard>
  );
};

export default memo(SecuritySection);