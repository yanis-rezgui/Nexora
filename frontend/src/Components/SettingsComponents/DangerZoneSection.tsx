import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../Contexts/AuthContext";
import SettingsCard from "./SettingsCard";
import DeleteAccountModal from "./DeleteAccountModal";

const DangerZoneSection = () => {
  const { signOut, loadingSignOut } = useAuthContext();
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <>
      <SettingsCard title="Danger Zone" tone="danger" description="These actions are permanent or will end your session.">
        <Row
          title="Sign out"
          description="End your current session on this device."
          actionLabel={loadingSignOut ? "Signing out…" : "Sign out"}
          onAction={handleSignOut}
          disabled={loadingSignOut}
        />

        <div style={{ height: 1, background: "rgba(232,101,79,0.15)", margin: "6px 0" }} />

        <Row
          title="Delete account"
          description="Permanently delete your account and all associated data. This action cannot be undone."
          actionLabel="Delete account"
          onAction={() => setDeleteModalOpen(true)}
          destructive
        />
      </SettingsCard>

      <DeleteAccountModal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} />
    </>
  );
};

const Row = ({
  title, description, actionLabel, onAction, disabled, destructive,
}: {
  title: string; description: string; actionLabel: string;
  onAction: () => void; disabled?: boolean; destructive?: boolean;
}) => (
  <div
    className="max-[480px]:!flex-col max-[480px]:!items-stretch"
    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "13px 0" }}
  >
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 500, color: "#F0EEE7" }}>
        {title}
      </div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#8D897E", marginTop: 2, lineHeight: 1.5 }}>
        {description}
      </div>
    </div>
    <button
      onClick={onAction}
      disabled={disabled}
      style={{
        flexShrink: 0, padding: "9px 16px", whiteSpace: "nowrap",
        background: destructive ? "rgba(232,101,79,0.12)" : "transparent",
        border: `1px solid ${destructive ? "rgba(232,101,79,0.4)" : "rgba(255,255,255,0.14)"}`,
        borderRadius: 8,
        color: destructive ? "#E8654F" : "#C9C5B9",
        fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        transition: "opacity 0.2s",
      }}
    >
      {actionLabel}
    </button>
  </div>
);

export default memo(DangerZoneSection);