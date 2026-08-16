export const Banner = ({ tone, children }: { tone: "error" | "success"; children: React.ReactNode }) => (
  <div style={{
    background: tone === "error" ? "rgba(232,101,79,0.08)" : "rgba(95,191,139,0.08)",
    border: `1px solid ${tone === "error" ? "rgba(232,101,79,0.3)" : "rgba(95,191,139,0.3)"}`,
    borderRadius: 8, padding: "11px 14px",
    fontFamily: "'Inter', sans-serif", fontSize: 12.5,
    color: tone === "error" ? "#F2998A" : "#5FBF8B",
    marginBottom: 18, display: "flex", alignItems: "center", gap: 8,
  }}>
    <i className={`ti ${tone === "error" ? "ti-alert-circle" : "ti-circle-check"}`} style={{ fontSize: 14 }} aria-hidden="true" />
    {children}
  </div>
);

export const labelStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 10, fontWeight: 500,
  letterSpacing: "0.06em", textTransform: "uppercase",
  color: "#8D897E",
};

export const inputStyle: React.CSSProperties = {
  background: "#0D0E12",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 8, padding: "10px 13px",
  color: "#F4F2EC", fontFamily: "'Inter', sans-serif", fontSize: 13.5,
  outline: "none", width: "100%",
  transition: "border-color 0.2s",
};