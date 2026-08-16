import { memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { ProjectListItem } from "../../Types/Types";

const ROLE_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  OWNER:     { color: "#E8A33D", bg: "rgba(232,163,61,0.12)", border: "rgba(232,163,61,0.35)" },
  MANAGER:   { color: "#7B9BE8", bg: "rgba(123,155,232,0.12)", border: "rgba(123,155,232,0.35)" },
  DEVELOPER: { color: "#5FBF8B", bg: "rgba(95,191,139,0.12)", border: "rgba(95,191,139,0.35)" },
};

interface ProjectCardProps {
  project: ProjectListItem;
  index?: number;
}

const ProjectCard = ({ project, index = 0 }: ProjectCardProps) => {
  const navigate = useNavigate();
  const roleStyle = ROLE_STYLE[project.role] ?? ROLE_STYLE.DEVELOPER;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
      onClick={() => navigate(`/user/projects/${project.id}`)}
      style={{
        background: "#15161B",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: "20px 20px 18px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transition: "border-color 0.2s, transform 0.15s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(232,163,61,0.3)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: 16, fontWeight: 600, color: "#F4F2EC",
            marginBottom: 5, letterSpacing: "-0.01em",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {project.name}
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#8D897E",
            lineHeight: 1.5, margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {project.description || "No description provided."}
          </p>
        </div>

        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9.5, fontWeight: 600, letterSpacing: "0.04em",
          color: roleStyle.color, background: roleStyle.bg,
          border: `1px solid ${roleStyle.border}`,
          borderRadius: 5, padding: "3px 8px", flexShrink: 0,
        }}>
          {project.role}
        </span>
      </div>

      {/* Bottom row — stats */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16,
        paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <i className="ti ti-checklist" style={{ fontSize: 14, color: "#5B5850" }} aria-hidden="true" />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#8D897E" }}>
            {project.taskCount} {project.taskCount === 1 ? "task" : "tasks"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <i className="ti ti-users" style={{ fontSize: 14, color: "#5B5850" }} aria-hidden="true" />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#8D897E" }}>
            {project.memberCount} {project.memberCount === 1 ? "member" : "members"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ProjectCard);