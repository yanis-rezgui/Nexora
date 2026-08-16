// Components/DashboardComponents/ProjectsOverviewWidget.tsx
import { memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { DashboardProject } from "../../Types/Types";

const ROLE_COLOR: Record<string, string> = {
  OWNER: "#E8A33D",
  MANAGER: "#7B9BE8",
  DEVELOPER: "#5FBF8B",
};

interface ProjectsOverviewWidgetProps {
  projects: DashboardProject[];
}

const ProjectsOverviewWidget = ({ projects }: ProjectsOverviewWidgetProps) => {
  const navigate = useNavigate();

  return (
    <div style={{
      background: "#15161B", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14, padding: "18px 18px 14px", marginTop: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h2 style={{
          fontFamily: "'Instrument Sans', sans-serif", fontSize: 15.5, fontWeight: 600,
          color: "#F4F2EC", margin: 0,
        }}>
          Projects
        </h2>
        <button
          onClick={() => navigate("/user/projects")}
          style={{
            background: "transparent", border: "none", color: "#E8A33D",
            fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 500,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
          }}
        >
          View all
          <i className="ti ti-arrow-right" style={{ fontSize: 12 }} aria-hidden="true" />
        </button>
      </div>

      {projects.length === 0 ? (
        <div style={{
          padding: "26px 10px", textAlign: "center",
          fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#5B5850",
        }}>
          You don't have any projects yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {projects.slice(0, 5).map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.2) }}
              onClick={() => navigate(`/user/projects/${project.id}`)}
              className="max-[560px]:!flex-col max-[560px]:!items-stretch max-[560px]:!gap-2"
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "10px 8px", borderRadius: 8, cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div className="max-[560px]:!w-full" style={{ width: 150, flexShrink: 0, minWidth: 0 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 7,
                  fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#F4F2EC",
                }}>
                  <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>
                    {project.name}
                  </span>
                  <span style={{
                    width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
                    background: ROLE_COLOR[project.role] ?? ROLE_COLOR.DEVELOPER,
                  }} />
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 80, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 3,
                    width: `${project.completionPercent}%`,
                    background: "linear-gradient(90deg, #E8A33D, #F2C368)",
                    transition: "width 0.4s ease",
                  }} />
                </div>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#8D897E",
                  flexShrink: 0, width: 32, textAlign: "right",
                }}>
                  {project.completionPercent}%
                </span>
              </div>

              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850",
                flexShrink: 0, whiteSpace: "nowrap",
              }}>
                {project.taskCount} {project.taskCount === 1 ? "task" : "tasks"}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(ProjectsOverviewWidget);