// Pages/ProjectDetails.tsx
import { memo, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectsContext } from "../Contexts/ProjectsContext";
import { useTasksContext } from "../Contexts/TasksContext";
import { useMembersContext } from "../Contexts/MembersContext";
import ProjectHeader from "../Components/ProjectDetailsComponents/ProjectHeader";
import ProjectStats from "../Components/ProjectDetailsComponents/ProjectStats";
import ProjectTabs from "../Components/ProjectDetailsComponents/ProjectTabs";
import TasksSection from "../Components/ProjectDetailsComponents/TasksSection";
import MembersSections from "../Components/ProjectDetailsComponents/MembersSections";
import ActivitySection from "../Components/ProjectDetailsComponents/ActivitySection";


export type ProjectTab = "overview" | "tasks" | "members" | "activity";

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { currentProject, loadingCurrentProject, getProjectById } = useProjectsContext();
  const { tasks, getProjectTasks } = useTasksContext();
  const { members, getProjectMembers } = useMembersContext();

  const [tab, setTab] = useState<ProjectTab>("overview");

  useEffect(() => {
    if (!projectId) return;
    getProjectById(projectId);
    getProjectTasks(projectId);
    getProjectMembers(projectId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  if (loadingCurrentProject || !currentProject) {
    return <DetailsSkeleton />;
  }

  return (
    <section className="max-[600px]:!px-0" style={{ maxWidth: 920, margin: "0 auto" }}>
      <button
        onClick={() => navigate("/user/projects")}
        style={{
          display: "flex", alignItems: "center", gap: 6, marginBottom: 18,
          background: "transparent", border: "none", cursor: "pointer",
          color: "#8D897E", fontFamily: "'Inter', sans-serif", fontSize: 12.5,
          padding: 0,
        }}
      >
        <i className="ti ti-arrow-left" style={{ fontSize: 14 }} aria-hidden="true" />
        Projects
      </button>

      <ProjectHeader project={currentProject} />

      <ProjectStats tasks={tasks} membersCount={members.length} />

      <ProjectTabs active={tab} onChange={setTab} taskCount={tasks.length} memberCount={members.length} />

      <div style={{ marginTop: 20 }}>
        {tab === "overview" && (
          <TasksSection projectId={projectId!} role={currentProject.role} preview />
        )}
        {tab === "tasks" && (
          <TasksSection projectId={projectId!} role={currentProject.role} />
        )}
        {tab === "members" && (
          <MembersSections projectId={projectId!} role={currentProject.role} ownerId={currentProject.ownerId} />
        )}
        {tab === "activity" && <ActivitySection projectId={projectId!} />}
      </div>
    </section>
  );
};

const DetailsSkeleton = () => (
  <div style={{ maxWidth: 920, margin: "0 auto" }}>
    {[140, 90, 44].map((h, i) => (
      <div key={i} style={{
        height: h, borderRadius: 14, background: "#15161B",
        border: "1px solid rgba(255,255,255,0.06)", marginBottom: 14,
      }} />
    ))}
  </div>
);

export default memo(ProjectDetails);