import { memo } from "react";

interface Props {
  name: string;
  color: string;
  active?: boolean;      // filled vs outlined (utilisé dans le picker de TaskDetailsModal)
  onClick?: () => void;
  onRemove?: () => void; // croix de suppression (ManageLabelsModal / picker)
  small?: boolean;
}

const LabelChip = ({ name, color, active = true, onClick, onRemove, small }: Props) => (
  <span
    onClick={onClick}
    style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: small ? "2px 7px" : "4px 9px",
      borderRadius: 6,
      background: active ? `${color}22` : "transparent",
      border: `1px solid ${active ? `${color}66` : "rgba(255,255,255,0.14)"}`,
      color: active ? color : "#8D897E",
      fontFamily: "'Inter', sans-serif",
      fontSize: small ? 10.5 : 11.5,
      fontWeight: 500,
      cursor: onClick ? "pointer" : "default",
      whiteSpace: "nowrap",
      transition: "border-color 0.15s, background 0.15s",
    }}
  >
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
    {name}
    {onRemove && (
      <i
        className="ti ti-x"
        onClick={e => { e.stopPropagation(); onRemove(); }}
        style={{ fontSize: 10, marginLeft: 2, cursor: "pointer" }}
        aria-label={`Remove ${name}`}
      />
    )}
  </span>
);

export default memo(LabelChip);