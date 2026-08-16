import { memo, useEffect } from "react";
import { useSettingsContext } from "../../Contexts/SettingsContext";
import type { NotificationPreferences } from "../../Types/Types";
import SettingsCard from "./SettingsCard";
import ToggleSwitch from "./ToggleSwitch";
import { Banner } from "./shared";

const PREFERENCE_ROWS: { key: keyof NotificationPreferences; label: string; description: string }[] = [
  { key: "notifyTaskAssigned", label: "Task assignments", description: "Receive notifications when a task is assigned to you" },
  { key: "notifyTaskUpdated", label: "Task updates", description: "Notify me when my tasks are updated" },
  { key: "notifyComments", label: "Comments", description: "Notify me when someone comments on my tasks" },
  { key: "notifyMentions", label: "Mentions", description: "Notify me when someone mentions me" },
  { key: "notifyProjectActivity", label: "Project activity", description: "Receive updates about activity in my projects" },
  { key: "notifyDeadlines", label: "Deadlines", description: "Notify me when one of my tasks is due soon" },
];

const NotificationsSection = () => {
  const {
    preferences, loadingPreferences, getNotificationPreferences,
    updateNotificationPreferences, loadingUpdatePreferences,
    errorMsg, clearMessages,
  } = useSettingsContext();

  useEffect(() => {
    clearMessages();
    getNotificationPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadingPreferences || !preferences) {
    return (
      <SettingsCard title="Notifications" description="Choose how Nexora keeps you informed">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ height: 46, borderRadius: 8, background: "#0D0E12" }} />
          ))}
        </div>
      </SettingsCard>
    );
  }

  return (
    <SettingsCard title="Notifications" description="Choose how Nexora keeps you informed">

      {errorMsg && <Banner tone="error">{errorMsg}</Banner>}

      <div style={{ display: "flex", flexDirection: "column" }}>
        {PREFERENCE_ROWS.map((row, i) => (
          <div
            key={row.key}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
              padding: "13px 0",
              borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 500, color: "#F0EEE7" }}>
                {row.label}
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#8D897E", marginTop: 2 }}>
                {row.description}
              </div>
            </div>
            <ToggleSwitch
              checked={preferences[row.key]}
              disabled={loadingUpdatePreferences}
              onChange={value => updateNotificationPreferences({ [row.key]: value })}
            />
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "8px 0 4px" }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "13px 0" }}>
        <div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 500, color: "#F0EEE7" }}>
            Email notifications
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#8D897E", marginTop: 2 }}>
            Receive important notifications by email
          </div>
        </div>
        <ToggleSwitch
          checked={preferences.notifyEmail}
          disabled={loadingUpdatePreferences}
          onChange={value => updateNotificationPreferences({ notifyEmail: value })}
        />
      </div>
    </SettingsCard>
  );
};

export default memo(NotificationsSection);