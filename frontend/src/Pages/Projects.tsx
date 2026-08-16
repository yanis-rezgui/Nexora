import { memo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useProjectsContext } from "../Contexts/ProjectsContext";
import ProjectCard from "../Components/ProjectsComponents/ProjectCard";
import CreateProjectModal from "../Components/ProjectsComponents/CreateProjectModal";

const Projects = () => {
  const { projects, pagination, loadingProjects, getProjects } = useProjectsContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(location.pathname.endsWith("/new"));

  // Debounced search + page fetch
  useEffect(() => {
    const timeout = setTimeout(() => {
      getProjects({ search: search || undefined, page, limit: 9 });
    }, search ? 350 : 0);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  // Reset to page 1 whenever the search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleCloseModal = () => {
    setModalOpen(false);
    if (location.pathname.endsWith("/new")) navigate("/user/projects");
  };

  return (
    <section>
      {/* Header */}
      <div
        className="max-[560px]:!flex-col max-[560px]:!items-stretch max-[560px]:!gap-3"
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 16, marginBottom: 26,
        }}
      >
        <div>
          <h1 style={{
            fontFamily: "'Instrument Sans', sans-serif", fontSize: 22, fontWeight: 600,
            color: "#F4F2EC", letterSpacing: "-0.01em", margin: "0 0 4px",
          }}>
            Projects
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", margin: 0 }}>
            {pagination ? `${pagination.total} project${pagination.total !== 1 ? "s" : ""}` : "Loading…"}
          </p>
        </div>

        <div className="max-[560px]:!flex-col max-[560px]:!items-stretch" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Search */}
          <div style={{ position: "relative" }}>
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
              placeholder="Search projects…"
              className="max-[560px]:!w-full"
              style={{
                background: "#15161B",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 8, padding: "9px 13px 9px 34px",
                color: "#F4F2EC", fontFamily: "'Inter', sans-serif", fontSize: 13,
                outline: "none", width: 220,
                transition: "border-color 0.2s",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(232,163,61,0.4)")}
              onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
            />
          </div>

          <button
            onClick={() => setModalOpen(true)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              background: "#E8A33D", border: "none", borderRadius: 8,
              padding: "9px 16px", whiteSpace: "nowrap",
              color: "#151116", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
              cursor: "pointer", transition: "opacity 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <i className="ti ti-plus" style={{ fontSize: 15 }} aria-hidden="true" />
            New project
          </button>
        </div>
      </div>

      {/* Content */}
      {loadingProjects ? (
        <GridSkeleton />
      ) : projects.length === 0 ? (
        <EmptyState hasSearch={!!search} onCreate={() => setModalOpen(true)} />
      ) : (
        <>
          <div
            className="max-[900px]:!grid-cols-2 max-[600px]:!grid-cols-1"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}
          >
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onChange={setPage}
            />
          )}
        </>
      )}

      <CreateProjectModal open={modalOpen} onClose={handleCloseModal} />
    </section>
  );
};



// ============================================================
// Empty state
// ============================================================

const EmptyState = ({ hasSearch, onCreate }: { hasSearch: boolean; onCreate: () => void }) => (
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
      <i className={`ti ${hasSearch ? "ti-search-off" : "ti-folder-plus"}`} style={{ fontSize: 21, color: "#E8A33D" }} aria-hidden="true" />
    </div>
    <h3 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 17, fontWeight: 600, color: "#F4F2EC", margin: "0 0 6px" }}>
      {hasSearch ? "No projects found" : "No projects yet"}
    </h3>
    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", maxWidth: 320, lineHeight: 1.6, margin: "0 0 22px" }}>
      {hasSearch
        ? "Try a different search term."
        : "Create your first project to start organizing tasks with your team."}
    </p>
    {!hasSearch && (
      <button
        onClick={onCreate}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          background: "#E8A33D", border: "none", borderRadius: 8,
          padding: "10px 20px",
          color: "#151116", fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <i className="ti ti-plus" style={{ fontSize: 15 }} aria-hidden="true" />
        New project
      </button>
    )}
  </motion.div>
);



// ============================================================
// Loading skeleton
// ============================================================

const GridSkeleton = () => (
  <div
    className="max-[900px]:!grid-cols-2 max-[600px]:!grid-cols-1"
    style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}
  >
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} style={{
        height: 152, borderRadius: 14,
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
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 30 }}>
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

export default memo(Projects);