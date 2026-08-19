// Components/AdminComponents/TopAssigneesWidget.tsx
import { memo } from "react";
import { motion } from "framer-motion";

interface Assignee {
  user: { id: string; firstName: string; lastName: string } | undefined | null;
  taskCount: number;
}

const TopAssigneesWidget = ({ data }: { data: Assignee[] }) => {
  const maxCount = Math.max(...data.map(d => d.taskCount), 1);

  return (
    <div
      style={{
        background: "#15161B", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14, padding: "20px 18px", height: 320,
        display: "flex", flexDirection: "column",
      }}
    >
      <h3 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#F4F2EC", margin: "0 0 3px", letterSpacing: "-0.01em" }}>
        Most active users
      </h3>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#8D897E", margin: "0 0 16px" }}>
        By tasks assigned
      </p>

      {data.length === 0 ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#5B5850", margin: 0 }}>No assignments yet</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, overflowY: "auto" }}>
          {data.map((entry, i) => (
            <motion.div
              key={entry.user?.id ?? i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.2), duration: 0.3 }}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <span
                style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 600,
                  color: i === 0 ? "#151116" : "#8D897E",
                  background: i === 0 ? "#E8A33D" : "rgba(255,255,255,0.06)",
                }}
              >
                {i + 1}
              </span>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5, gap: 8 }}>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500, color: "#C9C5B9",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}
                  >
                    {entry.user ? `${entry.user.firstName} ${entry.user.lastName}` : "Unknown user"}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#5B5850", flexShrink: 0 }}>
                    {entry.taskCount}
                  </span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%", borderRadius: 2,
                      width: `${(entry.taskCount / maxCount) * 100}%`,
                      background: "#E8A33D",
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(TopAssigneesWidget);
