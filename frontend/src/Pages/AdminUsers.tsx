// Pages/AdminUsers.tsx
import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAdminContext } from "../Contexts/AdminContext";
import UserListRow from "../Components/AdminUsersComponents/UserListRow";
import UserDetailsModal from "../Components/AdminUsersComponents/UserDetailsModal";
import ConfirmActionModal from "../Components/AdminUsersComponents/ConfirmActionModal";
import type { UserRole } from "../Types/Types";

interface PendingSuspend {
  id: string;
  name: string;
  isActive: boolean;
}

const AdminUsers = () => {
  const {
    users, usersPagination, loadingUsers, getAllUsers,
    suspendUser, loadingSuspendUser,
    unsuspendUser, loadingUnsuspendUser,
  } = useAdminContext();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "ALL">("ALL");
  const [status, setStatus] = useState<"ALL" | "ACTIVE" | "SUSPENDED">("ALL");
  const [sort, setSort] = useState<"createdAt" | "firstName" | "lastName" | "email">("createdAt");
  const [page, setPage] = useState(1);

  const [viewUserId, setViewUserId] = useState<string | null>(null);
  const [pendingSuspend, setPendingSuspend] = useState<PendingSuspend | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getAllUsers({
        search: search || undefined,
        role: role !== "ALL" ? role : undefined,
        isActive: status === "ALL" ? undefined : status === "ACTIVE",
        sort,
        order: "desc",
        page,
        limit: 15,
      });
    }, search ? 350 : 0);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, role, status, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [search, role, status, sort]);

  const handleConfirmSuspend = async () => {
    if (!pendingSuspend) return;
    if (pendingSuspend.isActive) {
      await suspendUser(pendingSuspend.id);
    } else {
      await unsuspendUser(pendingSuspend.id);
    }
    setPendingSuspend(null);
  };

  return (
    <section>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{
          fontFamily: "'Instrument Sans', sans-serif", fontSize: 22, fontWeight: 600,
          color: "#F4F2EC", letterSpacing: "-0.01em", margin: "0 0 4px",
        }}>
          Users
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", margin: 0 }}>
          {usersPagination ? `${usersPagination.total} user${usersPagination.total !== 1 ? "s" : ""}` : "Loading…"}
        </p>
      </div>

      {/* Toolbar */}
      <div
        className="max-[720px]:!flex-col max-[720px]:!items-stretch"
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
            placeholder="Search by name or email…"
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
          value={role}
          onChange={v => setRole(v as UserRole | "ALL")}
          options={[
            { value: "ALL", label: "All roles" },
            { value: "ADMIN", label: "Admin" },
            { value: "USER", label: "User" },
          ]}
        />

        <FilterSelect
          value={status}
          onChange={v => setStatus(v as typeof status)}
          options={[
            { value: "ALL", label: "All statuses" },
            { value: "ACTIVE", label: "Active" },
            { value: "SUSPENDED", label: "Suspended" },
          ]}
        />

        <FilterSelect
          value={sort}
          onChange={v => setSort(v as typeof sort)}
          options={[
            { value: "createdAt", label: "Sort: Newest" },
            { value: "firstName", label: "Sort: First name" },
            { value: "lastName", label: "Sort: Last name" },
            { value: "email", label: "Sort: Email" },
          ]}
        />
      </div>

      {/* List */}
      {loadingUsers ? (
        <ListSkeleton />
      ) : users.length === 0 ? (
        <EmptyState hasFilters={!!search || role !== "ALL" || status !== "ALL"} />
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {users.map((u, i) => (
              <UserListRow
                key={u.id}
                user={u}
                index={i}
                onView={setViewUserId}
                onToggleSuspend={user => setPendingSuspend({ id: user.id, name: `${user.firstName} ${user.lastName}`, isActive: user.isActive })}
              />
            ))}
          </div>

          {usersPagination && usersPagination.totalPages > 1 && (
            <Pagination page={usersPagination.page} totalPages={usersPagination.totalPages} onChange={setPage} />
          )}
        </>
      )}

      <UserDetailsModal userId={viewUserId} onClose={() => setViewUserId(null)} />

      <ConfirmActionModal
        open={!!pendingSuspend}
        title={pendingSuspend?.isActive ? "Suspend this user?" : "Unsuspend this user?"}
        description={
          pendingSuspend?.isActive
            ? `${pendingSuspend?.name} will be signed out of all sessions and won't be able to log back in until unsuspended.`
            : `${pendingSuspend?.name} will be able to log in again.`
        }
        icon={pendingSuspend?.isActive ? "ti-lock" : "ti-lock-open"}
        color={pendingSuspend?.isActive ? "#E8654F" : "#5FBF8B"}
        confirmLabel={pendingSuspend?.isActive ? "Suspend" : "Unsuspend"}
        loadingLabel={pendingSuspend?.isActive ? "Suspending..." : "Unsuspending..."}
        loading={loadingSuspendUser || loadingUnsuspendUser}
        onConfirm={handleConfirmSuspend}
        onClose={() => setPendingSuspend(null)}
      />
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
        outline: "none", cursor: "pointer", minWidth: 140,
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
      <i className={`ti ${hasFilters ? "ti-filter-off" : "ti-users"}`} style={{ fontSize: 21, color: "#E8A33D" }} aria-hidden="true" />
    </div>
    <h3 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 17, fontWeight: 600, color: "#F4F2EC", margin: "0 0 6px" }}>
      {hasFilters ? "No users match your filters" : "No users yet"}
    </h3>
    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", maxWidth: 320, lineHeight: 1.6, margin: 0 }}>
      {hasFilters ? "Try adjusting your search or filters." : "Users will show up here once they sign up."}
    </p>
  </motion.div>
);


// ============================================================
// Loading skeleton
// ============================================================

const ListSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} style={{
        height: 64, borderRadius: 12,
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

export default memo(AdminUsers);
