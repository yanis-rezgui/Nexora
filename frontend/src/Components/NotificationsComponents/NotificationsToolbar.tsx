// Components/NotificationsComponents/NotificationsToolbar.tsx
import { memo } from "react";

export type NotificationsFilter = "ALL" | "UNREAD";

interface NotificationsToolbarProps {
  filter: NotificationsFilter;
  onFilterChange: (f: NotificationsFilter) => void;
  unreadCount: number;

  onMarkAllAsRead: () => void;
  loadingMarkAllAsRead: boolean;

  onClearAll: () => void;
  loadingClearAll: boolean;
}

const NotificationsToolbar = ({
  filter, onFilterChange, unreadCount,
  onMarkAllAsRead, loadingMarkAllAsRead,
  onClearAll, loadingClearAll,
}: NotificationsToolbarProps) => {

  return (
    <div
      className="max-[560px]:!flex-col max-[560px]:!items-stretch max-[560px]:!gap-3"
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 12, marginBottom: 18,
      }}
    >
      {/* Tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {(["ALL", "UNREAD"] as NotificationsFilter[]).map(key => {
          const active = filter === key;
          return (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: active ? "rgba(232,163,61,0.12)" : "transparent",
                border: `1px solid ${active ? "rgba(232,163,61,0.35)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 8, padding: "7px 12px",
                color: active ? "#E8A33D" : "#8D897E",
                fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500,
                cursor: "pointer", transition: "border-color 0.15s, color 0.15s, background 0.15s",
              }}
            >
              {key === "ALL" ? "All" : "Unread"}
              {key === "UNREAD" && unreadCount > 0 && (
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
                  color: active ? "#E8A33D" : "#5B5850",
                }}>
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="max-[560px]:!w-full" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={onMarkAllAsRead}
          disabled={loadingMarkAllAsRead || unreadCount === 0}
          className="max-[560px]:!flex-1"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, padding: "8px 12px",
            color: unreadCount === 0 ? "#3A3833" : "#C9C5B9",
            fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500,
            cursor: loadingMarkAllAsRead || unreadCount === 0 ? "not-allowed" : "pointer",
            whiteSpace: "nowrap", transition: "border-color 0.15s",
          }}
          onMouseEnter={e => { if (unreadCount > 0) e.currentTarget.style.borderColor = "rgba(255,255,255,0.24)"; }}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
        >
          <i className="ti ti-checks" style={{ fontSize: 14 }} aria-hidden="true" />
          Mark all read
        </button>

        <button
          onClick={onClearAll}
          disabled={loadingClearAll}
          className="max-[560px]:!flex-1"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, padding: "8px 12px",
            color: "#C9C5B9",
            fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 500,
            cursor: loadingClearAll ? "not-allowed" : "pointer",
            whiteSpace: "nowrap", transition: "border-color 0.15s, color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(232,101,79,0.4)"; e.currentTarget.style.color = "#F2998A"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#C9C5B9"; }}
        >
          <i className="ti ti-trash" style={{ fontSize: 14 }} aria-hidden="true" />
          Clear all
        </button>
      </div>
    </div>
  );
};

export default memo(NotificationsToolbar);