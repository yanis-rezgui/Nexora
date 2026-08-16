import { memo } from "react";

interface SettingsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  tone?: "default" | "danger";
}

const SettingsCard = ({ title, description, children, tone = "default" }: SettingsCardProps) => (
  <div style={{
    background: "#15161B",
    border: `1px solid ${tone === "danger" ? "rgba(232,101,79,0.25)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: 14, padding: "22px 20px", marginBottom: 16,
  }}>
    <h2 style={{
      fontFamily: "'Instrument Sans', sans-serif", fontSize: 16, fontWeight: 600,
      color: tone === "danger" ? "#E8654F" : "#F4F2EC", margin: "0 0 4px",
    }}>
      {title}
    </h2>
    {description ? (
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#8D897E", margin: "0 0 18px", lineHeight: 1.55 }}>
        {description}
      </p>
    ) : (
      <div style={{ marginBottom: 18 }} />
    )}
    {children}
  </div>
);

export default memo(SettingsCard);