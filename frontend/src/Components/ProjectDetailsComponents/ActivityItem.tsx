// Components/ProjectDetailsComponents/ActivityItem.tsx
import { memo } from "react";
import type { ActivityLog } from "../../Types/Types";

const ACTION_LABEL: Record<string, string> = {
  CREATED: "created", UPDATED: "updated", DELETED: "deleted",
  ASSIGNED: "assigned", UNASSIGNED: "unassigned", STATUS_CHANGED: "changed status of",
  COMMENTED: "commented on", UPLOADED: "uploaded to",
};

const ActivityItem = ({ log }: { log: ActivityLog }) => (
  <div style={{ display: "flex", gap: 12, padding: "12px 4px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8A33D", marginTop: 6, flexShrink: 0 }} />
    <div>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#C9C5B9", margin: 0 }}>
        <strong style={{ fontWeight: 500, color: "#F4F2EC" }}>{log.user?.firstName}</strong>{" "}
        {ACTION_LABEL[log.action] ?? log.action.toLowerCase()} a {log.entityType.toLowerCase()}
      </p>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850" }}>
        {new Date(log.createdAt).toLocaleString()}
      </span>
    </div>
  </div>
);

export default memo(ActivityItem);