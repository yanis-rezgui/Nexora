import { memo, useState } from "react";
import { motion } from "framer-motion";
import AccountSection from "../Components/SettingsComponents/AccountSection";
import SecuritySection from "../Components/SettingsComponents/SecuritySection";
import NotificationsSection from "../Components/SettingsComponents/NotificationsSection";
import AboutSection from "../Components/SettingsComponents/AboutSection";
import DangerZoneSection from "../Components/SettingsComponents/DangerZoneSection";

type SettingsTab = "account" | "security" | "notifications" | "about" | "danger";

const TABS: { key: SettingsTab; label: string; icon: string }[] = [
  { key: "account", label: "Account", icon: "ti-user" },
  { key: "security", label: "Security", icon: "ti-shield-lock" },
  { key: "notifications", label: "Notifications", icon: "ti-bell" },
  { key: "about", label: "About", icon: "ti-info-circle" },
  { key: "danger", label: "Danger Zone", icon: "ti-alert-triangle" },
];

const Settings = () => {
  const [tab, setTab] = useState<SettingsTab>("account");

  return (
    <section style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{
          fontFamily: "'Instrument Sans', sans-serif", fontSize: 22, fontWeight: 600,
          color: "#F4F2EC", letterSpacing: "-0.01em", margin: "0 0 4px",
        }}>
          Settings
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", margin: 0 }}>
          Manage your account, security, notifications, and application preferences.
        </p>
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 6, marginBottom: 22,
        overflowX: "auto", paddingBottom: 2,
      }}>
        {TABS.map(t => {
          const active = tab === t.key;
          const danger = t.key === "danger";
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
                background: active
                  ? danger ? "rgba(232,101,79,0.12)" : "rgba(232,163,61,0.1)"
                  : "transparent",
                border: `1px solid ${active
                  ? danger ? "rgba(232,101,79,0.4)" : "rgba(232,163,61,0.4)"
                  : "rgba(255,255,255,0.08)"}`,
                borderRadius: 8, padding: "8px 13px",
                color: active ? (danger ? "#E8654F" : "#E8A33D") : "#8D897E",
                fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500,
                cursor: "pointer", transition: "border-color 0.15s, color 0.15s, background 0.15s",
              }}
            >
              <i className={`ti ${t.icon}`} style={{ fontSize: 14 }} aria-hidden="true" />
              {t.label}
            </button>
          );
        })}
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {tab === "account" && <AccountSection />}
        {tab === "security" && <SecuritySection />}
        {tab === "notifications" && <NotificationsSection />}
        {tab === "about" && <AboutSection />}
        {tab === "danger" && <DangerZoneSection />}
      </motion.div>
    </section>
  );
};

export default memo(Settings);