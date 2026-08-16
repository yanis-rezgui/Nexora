// Components/ProjectDetailsComponents/ProjectStats.tsx
import { memo } from "react";
import type { Task } from "../../Types/Types";

const ProjectStats = ({ tasks, membersCount }: { tasks: Task[]; membersCount: number }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "DONE").length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const stats = [
    { label: "Tasks", value: total, icon: "ti-checklist" },
    { label: "Members", value: membersCount, icon: "ti-users" },
    { label: "Completed", value: completed, icon: "ti-circle-check" },
  ];

  return (
    <div style={{
      background: "#15161B", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14, padding: "18px 22px", marginBottom: 14,
    }}>
      <div className="max-[420px]:!grid-cols-1"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 18 }}>
        {stats.map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: "rgba(232,163,61,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <i className={`ti ${s.icon}`} style={{ fontSize: 15, color: "#E8A33D" }} aria-hidden="true" />
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, fontWeight: 600, color: "#F4F2EC" }}>
                {s.value}
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#8D897E" }}>
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#8D897E" }}>Progress</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#E8A33D" }}>{progress}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
          <div style={{
            width: `${progress}%`, height: "100%", borderRadius: 3,
            background: "linear-gradient(90deg, #E8A33D, #F2C368)",
            transition: "width 0.4s ease",
          }} />
        </div>
      </div>
    </div>
  );
};

export default memo(ProjectStats);