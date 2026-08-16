// Components/ProjectDetailsComponents/ProjectHeader.tsx
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectsContext } from "../../Contexts/ProjectsContext";
import type { ProjectDetailsResponse } from "../../Types/Types";
import ConfirmDeleteModal from "../ProjectsComponents/ConfirmDeleteModal";
import EditProjectModal from "./EditProjectModal";


const ROLE_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  OWNER:     { color: "#E8A33D", bg: "rgba(232,163,61,0.12)", border: "rgba(232,163,61,0.35)" },
  MANAGER:   { color: "#7B9BE8", bg: "rgba(123,155,232,0.12)", border: "rgba(123,155,232,0.35)" },
  DEVELOPER: { color: "#5FBF8B", bg: "rgba(95,191,139,0.12)", border: "rgba(95,191,139,0.35)" },
};

const ProjectHeader = ({ project }: { project: ProjectDetailsResponse }) => {
  const navigate = useNavigate();
  const { deleteProject, loadingDeleteProject } = useProjectsContext();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const roleStyle = ROLE_STYLE[project.role] ?? ROLE_STYLE.DEVELOPER;
  const canManage = project.role === "OWNER" || project.role === "MANAGER";
  const canDelete = project.role === "OWNER";

  const handleDelete = async () => {
    await deleteProject(project.id);
    navigate("/user/projects");
  };

  return (
    <div style={{
      background: "#15161B", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14, padding: "22px 22px 20px", marginBottom: 14,
    }}>
      <div className="max-[560px]:!flex-col max-[560px]:!items-start max-[560px]:!gap-3"
        style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
            <h1 style={{
              fontFamily: "'Instrument Sans', sans-serif", fontSize: 21, fontWeight: 600,
              color: "#F4F2EC", margin: 0, letterSpacing: "-0.01em",
            }}>
              {project.name}
            </h1>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 600,
              letterSpacing: "0.04em", color: roleStyle.color, background: roleStyle.bg,
              border: `1px solid ${roleStyle.border}`, borderRadius: 5, padding: "3px 8px",
            }}>
              {project.role}
            </span>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", margin: 0, lineHeight: 1.6 }}>
            {project.description || "No description provided."}
          </p>
        </div>

        {canManage && (
          <div className="max-[560px]:!w-full" style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => setEditOpen(true)}
              className="max-[560px]:!flex-1"
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8, color: "#C9C5B9", fontFamily: "'Inter', sans-serif",
                fontSize: 12.5, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              <i className="ti ti-edit" style={{ fontSize: 14 }} aria-hidden="true" />
              Edit
            </button>
            {canDelete && (
              <button
                onClick={() => setDeleteOpen(true)}
                style={{
                  width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "transparent", border: "1px solid rgba(232,101,79,0.25)",
                  borderRadius: 8, color: "#E8654F", cursor: "pointer", flexShrink: 0,
                }}
                aria-label="Delete project"
              >
                <i className="ti ti-trash" style={{ fontSize: 15 }} aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>

      <EditProjectModal open={editOpen} onClose={() => setEditOpen(false)} project={project} />
      <ConfirmDeleteModal
        open={deleteOpen}
        title="Delete project"
        description={`This will permanently delete "${project.name}" and all its tasks. This action cannot be undone.`}
        loading={loadingDeleteProject}
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
};

export default memo(ProjectHeader);