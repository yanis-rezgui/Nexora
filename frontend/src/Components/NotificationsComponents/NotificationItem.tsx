// Components/NotificationsComponents/NotificationItem.tsx
import { memo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { Notification } from "../../Types/Types";
import { getNotificationMeta, formatRelativeTime } from "./notificationMeta";

interface NotificationItemProps {
  notification: Notification;
  index?: number;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem = ({ notification, index = 0, onRead, onDelete }: NotificationItemProps) => {
  const navigate = useNavigate();
  const meta = getNotificationMeta(notification.type);

  const handleClick = () => {
    if (!notification.isRead) onRead(notification.id);

    if (notification.projectId) {
      navigate(`/user/projects/${notification.projectId}`);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.25) }}
      onClick={handleClick}
      className="max-[560px]:!p-3 max-[560px]:!gap-2.5"
      style={{
        background: notification.isRead ? "#15161B" : "#181920",
        border: `1px solid ${notification.isRead ? "rgba(255,255,255,0.08)" : "rgba(232,163,61,0.22)"}`,
        borderRadius: 12,
        padding: "14px 16px",
        cursor: notification.projectId ? "pointer" : "default",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        position: "relative",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={e => { if (notification.projectId) e.currentTarget.style.borderColor = "rgba(232,163,61,0.35)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = notification.isRead ? "rgba(255,255,255,0.08)" : "rgba(232,163,61,0.22)"; }}
    >
      {/* Unread dot */}
      {!notification.isRead && (
        <span style={{
          position: "absolute", top: 14, right: 14,
          width: 6, height: 6, borderRadius: "50%",
          background: "#E8A33D",
        }} />
      )}

      {/* Icon */}
      <div style={{
        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
        background: meta.bg, border: `1px solid ${meta.color}40`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <i className={`ti ${meta.icon}`} style={{ fontSize: 15, color: meta.color }} aria-hidden="true" />
      </div>

      {/* Content */}
      <div style={{ minWidth: 0, flex: 1, paddingRight: notification.isRead ? 0 : 14 }}>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: 13.5, fontWeight: 500,
          color: "#F4F2EC", marginBottom: 3, lineHeight: 1.4,
        }}>
          {notification.title}
        </div>

        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#8D897E",
          lineHeight: 1.5, margin: "0 0 8px",
        }}>
          {notification.message}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850",
          }}>
            {formatRelativeTime(notification.createdAt)}
          </span>

          {notification.project && (
            <span style={{
              display: "flex", alignItems: "center", gap: 4,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#5B5850",
            }}>
              <i className="ti ti-folder" style={{ fontSize: 11 }} aria-hidden="true" />
              {notification.project.name}
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={e => { e.stopPropagation(); onDelete(notification.id); }}
        aria-label="Delete notification"
        className="max-[560px]:!static max-[560px]:!ml-1"
        style={{
          width: 26, height: 26, borderRadius: 7, flexShrink: 0,
          background: "transparent", border: "none", cursor: "pointer",
          color: "#5B5850", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "color 0.15s, background 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.color = "#E8654F"; e.currentTarget.style.background = "rgba(232,101,79,0.1)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "#5B5850"; e.currentTarget.style.background = "transparent"; }}
      >
        <i className="ti ti-x" style={{ fontSize: 14 }} aria-hidden="true" />
      </button>
    </motion.div>
  );
};

export default memo(NotificationItem);