// Pages/Notifications.tsx
import { memo, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNotificationsContext } from "../Contexts/NotificationsContext";
import NotificationItem from "../Components/NotificationsComponents/NotificationItem";
import NotificationsToolbar, { type NotificationsFilter } from "../Components/NotificationsComponents/NotificationsToolbar";

const Notifications = () => {
  const {
    notifications,
    loadingNotifications,
    pagination,
    unreadCount,
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    loadingMarkAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    loadingDeleteAllNotifications,
  } = useNotificationsContext();

  const [filter, setFilter] = useState<NotificationsFilter>("ALL");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getMyNotifications({
      isRead: filter === "UNREAD" ? false : undefined,
      page,
      limit: 20,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  return (
    <section className="max-[560px]:!px-0" style={{ maxWidth: 720, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{
          fontFamily: "'Instrument Sans', sans-serif", fontSize: 22, fontWeight: 600,
          color: "#F4F2EC", letterSpacing: "-0.01em", margin: "0 0 4px",
        }}>
          Notifications
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", margin: 0 }}>
          {unreadCount > 0
            ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
            : "You're all caught up"}
        </p>
      </div>

      <NotificationsToolbar
        filter={filter}
        onFilterChange={setFilter}
        unreadCount={unreadCount}
        onMarkAllAsRead={markAllAsRead}
        loadingMarkAllAsRead={loadingMarkAllAsRead}
        onClearAll={() => deleteAllNotifications()}
        loadingClearAll={loadingDeleteAllNotifications}
      />

      {/* List */}
      {loadingNotifications ? (
        <ListSkeleton />
      ) : notifications.length === 0 ? (
        <EmptyState isUnreadFilter={filter === "UNREAD"} />
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <AnimatePresence initial={false}>
              {notifications.map((notification, i) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  index={i}
                  onRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))}
            </AnimatePresence>
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
    </section>
  );
};


// ============================================================
// Empty state
// ============================================================

const EmptyState = ({ isUnreadFilter }: { isUnreadFilter: boolean }) => (
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
      <i className={`ti ${isUnreadFilter ? "ti-mail-opened" : "ti-bell-off"}`} style={{ fontSize: 21, color: "#E8A33D" }} aria-hidden="true" />
    </div>
    <h3 style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 17, fontWeight: 600, color: "#F4F2EC", margin: "0 0 6px" }}>
      {isUnreadFilter ? "No unread notifications" : "No notifications yet"}
    </h3>
    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#8D897E", maxWidth: 320, lineHeight: 1.6, margin: 0 }}>
      {isUnreadFilter
        ? "You've read everything — nice."
        : "Activity on your projects and tasks will show up here."}
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
        height: 78, borderRadius: 12,
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

export default memo(Notifications);