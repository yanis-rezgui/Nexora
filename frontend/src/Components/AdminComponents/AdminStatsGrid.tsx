// Components/AdminComponents/AdminStatsGrid.tsx
import { memo } from "react";
import { motion } from "framer-motion";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

const STAT_CONFIG: { key: keyof AdminStats; label: string; icon: string; color: string }[] = [
  { key: "totalUsers", label: "Total users", icon: "ti-users", color: "#7B9BE8" },
  { key: "activeUsers", label: "Active users", icon: "ti-user-check", color: "#5FBF8B" },
  { key: "totalProjects", label: "Projects", icon: "ti-folder", color: "#E8A33D" },
  { key: "totalTasks", label: "Total tasks", icon: "ti-checklist", color: "#B98CE8" },
  { key: "completedTasks", label: "Completed", icon: "ti-circle-check", color: "#5FBF8B" },
  { key: "overdueTasks", label: "Overdue", icon: "ti-alert-triangle", color: "#E8654F" },
];

const AdminStatsGrid = ({ stats }: { stats: AdminStats }) => (
  <div
    className="max-[900px]:!grid-cols-3 max-[560px]:!grid-cols-2"
    style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 22 }}
  >
    {STAT_CONFIG.map((cfg, i) => (
      <motion.div
        key={cfg.key}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.24) }}
        style={{
          background: "#15161B",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: "16px 15px",
        }}
      >
        <div
          style={{
            width: 28, height: 28, borderRadius: 8, marginBottom: 12,
            background: `${cfg.color}1f`, border: `1px solid ${cfg.color}59`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <i className={`ti ${cfg.icon}`} style={{ fontSize: 13.5, color: cfg.color }} aria-hidden="true" />
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 600, color: "#F4F2EC", marginBottom: 3, letterSpacing: "-0.01em" }}>
          {stats[cfg.key].toLocaleString()}
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#8D897E" }}>
          {cfg.label}
        </div>
      </motion.div>
    ))}
  </div>
);

export default memo(AdminStatsGrid);
