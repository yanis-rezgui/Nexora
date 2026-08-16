import { memo, useEffect, useState } from "react";
import { useAuthContext } from "../../Contexts/AuthContext";
import { useSettingsContext } from "../../Contexts/SettingsContext";
import SettingsCard from "./SettingsCard";
import { Banner, inputStyle, labelStyle } from "./shared";

const AccountSection = () => {
  const { user, getUser } = useAuthContext();
  const { updateProfile, loadingUpdateProfile, errorMsg, successMsg, clearMessages } = useSettingsContext();

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");

  useEffect(() => {
    setFirstName(user?.firstName ?? "");
    setLastName(user?.lastName ?? "");
  }, [user]);

  useEffect(() => {
    clearMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  const hasChanges =
    firstName.trim() !== (user?.firstName ?? "") ||
    lastName.trim() !== (user?.lastName ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges || !firstName.trim() || !lastName.trim()) return;

    const updated = await updateProfile(firstName.trim(), lastName.trim());
    if (updated) await getUser();
  };

  return (
    <SettingsCard title="Account" description="Manage your personal information and profile">

      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        background: "#0D0E12", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10, padding: "14px 16px", marginBottom: 22,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #E8A33D, #F2C368)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: "#151116",
        }}>
          {initials || "?"}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: "#F4F2EC",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {user?.firstName} {user?.lastName}
          </div>
          <div style={{
            fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#8D897E",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {user?.email}
          </div>
          <span style={{
            display: "inline-block", marginTop: 5,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 600,
            letterSpacing: "0.06em", color: "#E8A33D",
            background: "rgba(232,163,61,0.12)", padding: "2px 7px", borderRadius: 5,
          }}>
            {user?.role}
          </span>
        </div>
      </div>

      {errorMsg && <Banner tone="error">{errorMsg}</Banner>}
      {successMsg && <Banner tone="success">{successMsg}</Banner>}

      <form onSubmit={handleSubmit}>
        <div
          className="max-[480px]:!grid-cols-1"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>First name</label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              maxLength={50}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(232,163,61,0.5)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={labelStyle}>Last name</label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              maxLength={50}
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(232,163,61,0.5)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
          <label style={labelStyle}>Email address</label>
          <input
            type="email"
            value={user?.email ?? ""}
            disabled
            style={{ ...inputStyle, color: "#5B5850", cursor: "not-allowed" }}
          />
        </div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#5B5850", margin: "0 0 20px", lineHeight: 1.5 }}>
          Email address cannot be changed. Contact support if you need to change your email.
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            disabled={!hasChanges || loadingUpdateProfile}
            style={{
              padding: "10px 20px",
              background: "#E8A33D", border: "none", borderRadius: 8,
              color: "#151116", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
              cursor: !hasChanges || loadingUpdateProfile ? "not-allowed" : "pointer",
              opacity: !hasChanges || loadingUpdateProfile ? 0.55 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {loadingUpdateProfile ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </SettingsCard>
  );
};

export default memo(AccountSection);