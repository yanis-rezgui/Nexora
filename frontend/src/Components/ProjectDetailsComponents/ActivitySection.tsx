// Components/ProjectDetailsComponents/ActivitySection.tsx
import { memo, useEffect } from "react";
import { useActivityContext } from "../../Contexts/ActivityContext";
import ActivityItem from "./ActivityItem";

const ActivitySection = ({ projectId }: { projectId: string }) => {
  const { logs, loadingActivity, getProjectActivity } = useActivityContext();

  useEffect(() => {
    getProjectActivity(projectId, { limit: 30 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  if (loadingActivity) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ height: 48, borderRadius: 10, background: "#15161B", border: "1px solid rgba(255,255,255,0.06)" }} />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "44px 20px", background: "#15161B", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 12 }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", margin: 0 }}>No activity yet.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {logs.map(log => <ActivityItem key={log.id} log={log} />)}
    </div>
  );
};

export default memo(ActivitySection);