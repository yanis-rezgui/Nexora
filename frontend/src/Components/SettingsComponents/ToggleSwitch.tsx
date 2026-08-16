import { memo } from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch = ({ checked, onChange, disabled }: ToggleSwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    style={{
      width: 40, height: 23, borderRadius: 12, flexShrink: 0,
      border: "none", position: "relative", cursor: disabled ? "not-allowed" : "pointer",
      background: checked ? "#E8A33D" : "rgba(255,255,255,0.12)",
      opacity: disabled ? 0.5 : 1,
      transition: "background 0.2s",
    }}
  >
    <span style={{
      position: "absolute", top: 2.5, left: checked ? 19 : 3,
      width: 18, height: 18, borderRadius: "50%", background: "#151116",
      transition: "left 0.2s",
    }} />
  </button>
);

export default memo(ToggleSwitch);