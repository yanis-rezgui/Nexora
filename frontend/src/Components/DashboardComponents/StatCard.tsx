// Components/DashboardComponents/StatCard.tsx
import { memo } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  color: string;
  index?: number;
}

const StatCard = ({ label, value, icon, color, index = 0 }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.2) }}
    className="max-[560px]:!p-3.5 max-[560px]:!gap-3"
    style={{
      background: "#15161B",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14,
      padding: 18,
      display: "flex",
      alignItems: "center",
      gap: 14,
    }}
  >
    <div style={{
      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
      background: `${color}1f`, border: `1px solid ${color}40`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <i className={`ti ${icon}`} style={{ fontSize: 17, color }} aria-hidden="true" />
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 21, fontWeight: 600,
        color: "#F4F2EC", lineHeight: 1.1,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#8D897E",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>
        {label}
      </div>
    </div>
  </motion.div>
);

export default memo(StatCard);