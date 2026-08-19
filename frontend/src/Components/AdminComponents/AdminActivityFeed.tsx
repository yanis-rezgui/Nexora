// Components/AdminComponents/AdminActivityFeed.tsx
import { memo } from "react";
import { motion } from "framer-motion";

interface ActivityEntry {
  id: string;
  action: string;
  entityType: string;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string } | null;
  project: { id: string; name: string } | null;
}

const ACTION_LABEL: Record<string, string> = {
  CREATED: "created", UPDATED: "updated", DELETED: "deleted",
  ASSIGNED: "assigned", UNASSIGNED: "unassigned", STATUS_CHANGED: "changed status of",
  COMMENTED: "commented on", UPLOADED: "uploaded to",
};

const ACTION_ICON: Record<string, string> = {
  CREATED: "ti-plus", UPDATED: "ti-pencil", DELETED: "ti-trash",
  ASSIGNED: "ti-user-plus", UNASSIGNED: "ti-user-minus", STATUS_CHANGED: "ti-refresh",
  COMMENTED: "ti-message", UPLOADED: "ti-upload",
};

const formatTimeAgo = (dateStr: string) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

const AdminActivityFeed = ({ logs }: { logs: ActivityEntry[] }) => (
  <div
    style={{
      background: "#15161B", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14, padding: "20px 18px",
    }}
  >
    <h3 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#F4F2EC", margin: "0 0 3px", letterSpacing: "-0.01em" }}>
      Recent activity
    </h3>
    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#8D897E", margin: "0 0 14px" }}>
      Across all projects
    </p>

    {logs.length === 0 ? (
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#5B5850", textAlign: "center", padding: "24px 0", margin: 0 }}>
        No activity yet
      </p>
    ) : (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {logs.map((log, i) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.25 }}
            style={{
              display: "flex", gap: 12, padding: "11px 0",
              borderBottom: i < logs.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}
          >
            <div
              style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0, marginTop: 1,
                background: "rgba(232,163,61,0.1)", border: "1px solid rgba(232,163,61,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <i className={`ti ${ACTION_ICON[log.action] ?? "ti-dots"}`} style={{ fontSize: 13, color: "#E8A33D" }} aria-hidden="true" />
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#C9C5B9", margin: "0 0 3px", lineHeight: 1.5 }}>
                <strong style={{ fontWeight: 500, color: "#F4F2EC" }}>
                  {log.user ? `${log.user.firstName} ${log.user.lastName}` : "Someone"}
                </strong>{" "}
                {ACTION_LABEL[log.action] ?? log.action.toLowerCase()} a {log.entityType.toLowerCase()}
                {log.project && (
                  <>
                    {" "}in <span style={{ color: "#E8A33D" }}>{log.project.name}</span>
                  </>
                )}
              </p>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850" }}>
                {formatTimeAgo(log.createdAt)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

export default memo(AdminActivityFeed);
