// Components/DashboardComponents/RecentActivityWidget.tsx
import { memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { DashboardActivityLog } from "../../Types/Types";
import { getActivityMeta, formatRelativeTime } from "./activityMeta";

interface RecentActivityWidgetProps {
  logs: DashboardActivityLog[];
}

const RecentActivityWidget = ({ logs }: RecentActivityWidgetProps) => {
  const navigate = useNavigate();

  return (
    <div style={{
      background: "#15161B", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14, padding: "18px 18px 14px",
      display: "flex", flexDirection: "column", minWidth: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h2 style={{
          fontFamily: "'Instrument Sans', sans-serif", fontSize: 15.5, fontWeight: 600,
          color: "#F4F2EC", margin: 0,
        }}>
          Recent Activity
        </h2>
        <i className="ti ti-activity" style={{ fontSize: 15, color: "#5B5850" }} aria-hidden="true" />
      </div>

      {logs.length === 0 ? (
        <div style={{
          padding: "26px 10px", textAlign: "center",
          fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#5B5850",
        }}>
          No recent activity across your projects.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {logs.map((log, i) => {
            const meta = getActivityMeta(log.action, log.entityType);
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.2) }}
                onClick={() => navigate(`/user/projects/${log.projectId}`)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  padding: "9px 8px", borderRadius: 8, cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{
                  width: 26, height: 26, borderRadius: 7, flexShrink: 0, marginTop: 1,
                  background: `${meta.color}1f`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <i className={`ti ${meta.icon}`} style={{ fontSize: 12, color: meta.color }} aria-hidden="true" />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#C9C5B9", lineHeight: 1.45 }}>
                    <span style={{ color: "#F4F2EC", fontWeight: 500 }}>{log.user.firstName}</span>{" "}
                    {meta.label}
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8, marginTop: 2,
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#5B5850",
                  }}>
                    <span>{log.project.name}</span>
                    <span>·</span>
                    <span>{formatRelativeTime(log.createdAt)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default memo(RecentActivityWidget);