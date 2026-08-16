// Components/NotificationsComponents/notificationMeta.ts
import type { NotificationType } from "../../Types/Types";

interface NotificationMeta {
  icon: string;
  color: string;
  bg: string;
}

const META: Record<NotificationType, NotificationMeta> = {
  INFO:                { icon: "ti-info-circle",   color: "#7B9BE8", bg: "rgba(123,155,232,0.12)" },
  SUCCESS:             { icon: "ti-circle-check",  color: "#5FBF8B", bg: "rgba(95,191,139,0.12)" },
  WARNING:             { icon: "ti-alert-circle",  color: "#E8A33D", bg: "rgba(232,163,61,0.12)" },
  ERROR:               { icon: "ti-alert-triangle",color: "#E8654F", bg: "rgba(232,101,79,0.12)" },

  MEMBER_ADDED:        { icon: "ti-user-plus",     color: "#5FBF8B", bg: "rgba(95,191,139,0.12)" },
  MEMBER_REMOVED:      { icon: "ti-user-minus",    color: "#E8654F", bg: "rgba(232,101,79,0.12)" },

  TASK_ASSIGNED:       { icon: "ti-user-check",    color: "#7B9BE8", bg: "rgba(123,155,232,0.12)" },
  TASK_UNASSIGNED:     { icon: "ti-user-x",        color: "#8D897E", bg: "rgba(141,137,126,0.12)" },
  TASK_STATUS_CHANGED: { icon: "ti-refresh",       color: "#B98CE8", bg: "rgba(185,140,232,0.12)" },
  TASK_DUE_SOON:       { icon: "ti-clock",         color: "#E8A33D", bg: "rgba(232,163,61,0.12)" },
  TASK_OVERDUE:        { icon: "ti-alert-triangle",color: "#E8654F", bg: "rgba(232,101,79,0.12)" },

  COMMENT_ADDED:       { icon: "ti-message-circle",color: "#7B9BE8", bg: "rgba(123,155,232,0.12)" },
  COMMENT_MENTION:     { icon: "ti-at",            color: "#E8A33D", bg: "rgba(232,163,61,0.12)" },
};

export const getNotificationMeta = (type: NotificationType): NotificationMeta => {
  return META[type] ?? META.INFO;
};

export const formatRelativeTime = (isoDate: string): string => {

  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);

  if (diffSec < 60) return "Just now";

  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;

  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};