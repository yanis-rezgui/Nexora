// Components/DashboardComponents/TeamWorkloadWidget.tsx
import { memo } from "react";
import { motion } from "framer-motion";
import type { TeamWorkloadEntry } from "../../Types/Types";

interface TeamWorkloadWidgetProps {
  workload: TeamWorkloadEntry[];
}

const TeamWorkloadWidget = ({ workload }: TeamWorkloadWidgetProps) => {
  if (workload.length === 0) return null;

  const max = Math.max(...workload.map(w => w.activeTaskCount), 1);

  return (
    <div style={{
      background: "#15161B", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14, padding: "18px 18px 16px", marginTop: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{
          fontFamily: "'Instrument Sans', sans-serif", fontSize: 15.5, fontWeight: 600,
          color: "#F4F2EC", margin: 0,
        }}>
          Team Workload
        </h2>
        <i className="ti ti-users" style={{ fontSize: 15, color: "#5B5850" }} aria-hidden="true" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {workload.map((entry, i) => (
          <motion.div
            key={entry.user.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.2) }}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <span style={{
              width: 90, flexShrink: 0,
              fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#C9C5B9",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {entry.user.firstName} {entry.user.lastName[0]}.
            </span>
            <div style={{ flex: 1, height: 7, borderRadius: 4, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 4,
                width: `${(entry.activeTaskCount / max) * 100}%`,
                background: "linear-gradient(90deg, #7B9BE8, #B98CE8)",
                transition: "width 0.4s ease",
              }} />
            </div>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#8D897E",
              flexShrink: 0, width: 46, textAlign: "right",
            }}>
              {entry.activeTaskCount} {entry.activeTaskCount === 1 ? "task" : "tasks"}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default memo(TeamWorkloadWidget);