import { memo } from "react";
import SettingsCard from "./SettingsCard";

const LINKS = [
  { label: "Documentation", icon: "ti-book", href: "#" },
  { label: "GitHub", icon: "ti-brand-github", href: "#" },
  { label: "Contact support", icon: "ti-headset", href: "#" },
];

const AboutSection = () => (
  <SettingsCard title="About">
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: "linear-gradient(135deg, #E8A33D, #F2C368)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <span style={{ fontFamily: "'Instrument Sans', sans-serif", fontWeight: 700, fontSize: 17, color: "#151116" }}>N</span>
      </div>
      <div>
        <div style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#F4F2EC" }}>
          Nexora
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#5B5850" }}>
          Version 1.0.0
        </div>
      </div>
    </div>

    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", lineHeight: 1.6, margin: "0 0 20px" }}>
      A collaborative project management platform built for modern development teams.
    </p>

    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {LINKS.map(link => (
          <a
          key={link.label}
          href={link.href}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 4px", textDecoration: "none",
            color: "#C9C5B9", fontFamily: "'Inter', sans-serif", fontSize: 13,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            transition: "color 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#E8A33D")}
          onMouseLeave={e => (e.currentTarget.style.color = "#C9C5B9")}
        >
          <i className={`ti ${link.icon}`} style={{ fontSize: 15, color: "#5B5850" }} aria-hidden="true" />
          {link.label}
          <i className="ti ti-chevron-right" style={{ fontSize: 13, color: "#3A3833", marginLeft: "auto" }} aria-hidden="true" />
        </a>
      ))}
    </div>
  </SettingsCard>
);

export default memo(AboutSection);