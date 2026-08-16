// Pages/Tasks.tsx
import { memo, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTasksContext } from "../Contexts/TasksContext";
import type { TaskPriority, TaskStatus } from "../Types/Types";
import TaskRow from "../Components/TaskComponents/TaskRow";

type StatusFilter = TaskStatus | "ALL";

const STATUS_TABS: { key: StatusFilter; label: string; color: string }[] = [
  { key: "ALL", label: "All", color: "#E8A33D" },
  { key: "TODO", label: "To Do", color: "#8D897E" },
  { key: "IN_PROGRESS", label: "In Progress", color: "#7B9BE8" },
  { key: "IN_REVIEW", label: "In Review", color: "#B98CE8" },
  { key: "DONE", label: "Done", color: "#5FBF8B" },
];

const Tasks = () => {
  const {
    myTasks,
    loadingMyTasks,
    myTasksPagination,
    myTasksCounts,
    getMyTasks,
    updateTaskStatus,
  } = useTasksContext();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "ALL">("ALL");
  const [sort, setSort] = useState<"dueDate" | "createdAt" | "priority" | "title">("dueDate");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getMyTasks({
        search: search || undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        priority: priorityFilter !== "ALL" ? priorityFilter : undefined,
        sort,
        order: sort === "dueDate" ? "asc" : "desc",
        page,
        limit: 15,
      });
    }, search ? 350 : 0);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, priorityFilter, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, priorityFilter, sort]);

  const totalCount = myTasksCounts
    ? Object.values(myTasksCounts).reduce((a, b) => a + b, 0)
    : undefined;

  return (
    <section>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{
          fontFamily: "'Instrument Sans', sans-serif", fontSize: 22, fontWeight: 600,
          color: "#F4F2EC", letterSpacing: "-0.01em", margin: "0 0 4px",
        }}>
          My Tasks
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", margin: 0 }}>
          {myTasksPagination
            ? `${myTasksPagination.total} task${myTasksPagination.total !== 1 ? "s" : ""} assigned to you`
            : "Loading…"}
        </p>
      </div>

      {/* Status tabs */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6, marginBottom: 16,
        overflowX: "auto", paddingBottom: 2,
      }}>
        {STATUS_TABS.map(tabItem => {
          const active = statusFilter === tabItem.key;
          const count = tabItem.key === "ALL" ? totalCount : myTasksCounts?.[tabItem.key];

          return (
            <button
              key={tabItem.key}
              onClick={() => setStatusFilter(tabItem.key)}
              style={{
                display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
                background: active ? `${tabItem.color}1f` : "transparent",
                border: `1px solid ${active ? `${tabItem.color}59` : "rgba(255,255,255,0.08)"}`,
                borderRadius: 8, padding: "7px 12px",
                color: active ? tabItem.color : "#8D897E",
                fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500,
                cursor: "pointer", transition: "border-color 0.15s, color 0.15s, background 0.15s",
              }}
            >
              {tabItem.label}
              {count !== undefined && (
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
                  color: active ? tabItem.color : "#5B5850",
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div
        className="max-[640px]:!flex-col max-[640px]:!items-stretch"
        style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}
      >
        <div style={{ position: "relative", flex: 1 }}>
          <i
            className="ti ti-search"
            style={{
              position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
              fontSize: 14, color: "#5B5850", pointerEvents: "none",
            }}
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search your tasks…"
            style={{
              background: "#15161B",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 8, padding: "9px 13px 9px 34px",
              color: "#F4F2EC", fontFamily: "'Inter', sans-serif", fontSize: 13,
              outline: "none", width: "100%",
              transition: "border-color 0.2s",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "rgba(232,163,61,0.4)")}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
          />
        </div>

        <FilterSelect
          value={priorityFilter}
          onChange={v => setPriorityFilter(v as TaskPriority | "ALL")}
          options={[
            { value: "ALL", label: "All priorities" },
            { value: "URGENT", label: "Urgent" },
            { value: "HIGH", label: "High" },
            { value: "MEDIUM", label: "Medium" },
            { value: "LOW", label: "Low" },
          ]}
        />

        <FilterSelect
          value={sort}
          onChange={v => setSort(v as typeof sort)}
          options={[
            { value: "dueDate", label: "Sort: Due date" },
            { value: "priority", label: "Sort: Priority" },
            { value: "createdAt", label: "Sort: Newest" },
            { value: "title", label: "Sort: Title" },
          ]}
        />
      </div>

      {/* List */}
      {loadingMyTasks ? (
        <ListSkeleton />
      ) : myTasks.length === 0 ? (
        <EmptyState hasFilters={!!search || statusFilter !== "ALL" || priorityFilter !== "ALL"} />
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <AnimatePresence initial={false}>
              {myTasks.map((task, i) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  index={i}
                  onStatusChange={(status) => updateTaskStatus(task.projectId, task.id, status)}
                />
              ))}
            </AnimatePresence>
          </div>

          {myTasksPagination && myTasksPagination.totalPages > 1 && (
            <Pagination
              page={myTasksPagination.page}
              totalPages={myTasksPagination.totalPages}
              onChange={setPage}
            />
          )}
        </>
      )}
    </section>
  );
};


// ============================================================
// Filter select
// ============================================================

const FilterSelect = ({
  value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) => (
  <div style={{ position: "relative", flexShrink: 0 }}>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        appearance: "none",
        WebkitAppearance: "none",
        background: "#15161B",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: 8, padding: "9px 30px 9px 13px",
        color: "#C9C5B9", fontFamily: "'Inter', sans-serif", fontSize: 12.5,
        outline: "none", cursor: "pointer", minWidth: 150,
      }}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value} style={{ background: "#15161B", color: "#F4F2EC" }}>
          {opt.label}
        </option>
      ))}
    </select>
    <i
      className="ti ti-chevron-down"
      style={{
        position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)",
        fontSize: 12, color: "#5B5850", pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  </div>
);


// ============================================================
// Empty state
// ============================================================

const EmptyState = ({ hasFilters }: { hasFilters: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "70px 24px",
      background: "#15161B", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 14,
    }}
  >
    <div style={{
      width: 46, height: 46, borderRadius: 12, marginBottom: 18,
      background: "rgba(232,163,61,0.1)", border: "1px solid rgba(232,163,61,0.3)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <i className={`ti ${hasFilters ? "ti-filter-off" : "ti-circle-check"}`} style={{ fontSize: 21, color: "#E8A33D" }} aria-hidden="true" />
    </div>
    <h3 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 17, fontWeight: 600, color: "#F4F2EC", margin: "0 0 6px" }}>
      {hasFilters ? "No tasks match your filters" : "You're all caught up"}
    </h3>
    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", maxWidth: 320, lineHeight: 1.6, margin: 0 }}>
      {hasFilters
        ? "Try adjusting your search or filters."
        : "No tasks are currently assigned to you across your projects."}
    </p>
  </motion.div>
);


// ============================================================
// Loading skeleton
// ============================================================

const ListSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} style={{
        height: 62, borderRadius: 12,
        background: "#15161B", border: "1px solid rgba(255,255,255,0.06)",
        position: "relative", overflow: "hidden",
      }}>
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute", inset: 0, width: "60%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
          }}
        />
      </div>
    ))}
  </div>
);


// ============================================================
// Pagination
// ============================================================

const Pagination = ({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 24 }}>
    <PageBtn disabled={page <= 1} onClick={() => onChange(page - 1)}>
      <i className="ti ti-chevron-left" style={{ fontSize: 15 }} aria-hidden="true" />
    </PageBtn>

    {Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
      .reduce<number[]>((acc, p) => {
        if (acc.length && p - acc[acc.length - 1] > 1) acc.push(-1);
        acc.push(p);
        return acc;
      }, [])
      .map((p, i) =>
        p === -1 ? (
          <span key={`gap-${i}`} style={{ color: "#3A3833", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, padding: "0 4px" }}>…</span>
        ) : (
          <PageBtn key={p} active={p === page} onClick={() => onChange(p)}>
            {p}
          </PageBtn>
        )
      )}

    <PageBtn disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
      <i className="ti ti-chevron-right" style={{ fontSize: 15 }} aria-hidden="true" />
    </PageBtn>
  </div>
);

const PageBtn = ({
  children, active, disabled, onClick,
}: { children: React.ReactNode; active?: boolean; disabled?: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      minWidth: 32, height: 32, borderRadius: 7,
      background: active ? "rgba(232,163,61,0.14)" : "transparent",
      border: `1px solid ${active ? "rgba(232,163,61,0.4)" : "rgba(255,255,255,0.08)"}`,
      color: active ? "#E8A33D" : disabled ? "#3A3833" : "#8D897E",
      fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500,
      cursor: disabled ? "not-allowed" : "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "border-color 0.2s, color 0.2s",
    }}
  >
    {children}
  </button>
);

export default memo(Tasks);