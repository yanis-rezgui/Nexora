// Components/ProjectDetailsComponents/ProjectTabs.tsx
import { memo } from "react";
import type { ProjectTab } from "../../Pages/ProjectDetails";

interface Props {
  active: ProjectTab;
  onChange: (t: ProjectTab) => void;
  taskCount: number;
  memberCount: number;
}

const TABS: { key: ProjectTab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "tasks", label: "Tasks" },
  { key: "members", label: "Members" },
  { key: "activity", label: "Activity" },
];

const ProjectTabs = ({ active, onChange, taskCount, memberCount }: Props) => (
  <div style={{
    display: "flex", gap: 4, borderBottom: "1px solid rgba(255,255,255,0.08)",
    overflowX: "auto",
  }}>
    {TABS.map(t => {
      const isActive = active === t.key;
      const count = t.key === "tasks" ? taskCount : t.key === "members" ? memberCount : null;
      return (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "10px 4px", marginRight: 22,
            background: "transparent", border: "none", borderBottom: `2px solid ${isActive ? "#E8A33D" : "transparent"}`,
            color: isActive ? "#F4F2EC" : "#8D897E",
            fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500,
            cursor: "pointer", whiteSpace: "nowrap", transition: "color 0.15s, border-color 0.15s",
          }}
        >
          {t.label}
          {count !== null && (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              color: isActive ? "#E8A33D" : "#5B5850",
              background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "1px 6px",
            }}>
              {count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export default memo(ProjectTabs);