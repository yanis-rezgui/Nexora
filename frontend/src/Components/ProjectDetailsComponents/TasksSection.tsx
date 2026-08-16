// Components/ProjectDetailsComponents/TasksSection.tsx
import { memo, useMemo, useState } from "react";
import { useTasksContext } from "../../Contexts/TasksContext";
import TaskCard from "./TaskCard";
import CreateTaskModal from "./CreateTaskModal";

interface Props {
  projectId: string;
  role: string;
  preview?: boolean;
}

const STATUSES = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const TasksSection = ({ projectId, role, preview }: Props) => {
  const { tasks, loadingTasks } = useTasksContext();
  const canCreate = role === "OWNER" || role === "MANAGER";

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = tasks;
    if (search) list = list.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    if (status) list = list.filter(t => t.status === status);
    if (priority) list = list.filter(t => t.priority === priority);
    return preview ? list.slice(0, 4) : list;
  }, [tasks, search, status, priority, preview]);

  return (
    <div>
      <div className="max-[560px]:!flex-col max-[560px]:!items-stretch"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
        <h2 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 16, fontWeight: 600, color: "#F4F2EC", margin: 0 }}>
          {preview ? "Recent tasks" : "Tasks"}
        </h2>
        {canCreate && (
          <button
            onClick={() => setCreateOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
              background: "#E8A33D", border: "none", borderRadius: 8,
              color: "#151116", fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <i className="ti ti-plus" style={{ fontSize: 14 }} aria-hidden="true" />
            New task
          </button>
        )}
      </div>

      {!preview && (
        <div className="max-[560px]:!flex-col" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tasks…"
            style={{ ...filterInput, flex: 1 }}
          />
          <select value={status} onChange={e => setStatus(e.target.value)} style={filterInput}>
            <option value="">All statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
          <select value={priority} onChange={e => setPriority(e.target.value)} style={filterInput}>
            <option value="">All priorities</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      )}

      {loadingTasks ? (
        <SkeletonList />
      ) : filtered.length === 0 ? (
        <EmptyTasks />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((task, i) => (
            <TaskCard key={task.id} task={task} index={i} projectId={projectId} role={role} />
          ))}
        </div>
      )}

      <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} projectId={projectId} />
    </div>
  );
};

const filterInput: React.CSSProperties = {
  background: "#15161B", border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 8, padding: "9px 12px", color: "#F4F2EC",
  fontFamily: "'Inter', sans-serif", fontSize: 12.5, outline: "none",
};

const EmptyTasks = () => (
  <div style={{
    textAlign: "center", padding: "44px 20px", background: "#15161B",
    border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 12,
  }}>
    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", margin: 0 }}>
      No tasks match here yet.
    </p>
  </div>
);

const SkeletonList = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} style={{ height: 76, borderRadius: 12, background: "#15161B", border: "1px solid rgba(255,255,255,0.06)" }} />
    ))}
  </div>
);

export default memo(TasksSection);