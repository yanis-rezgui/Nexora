// Components/DashboardComponents/activityMeta.ts
import type { ActivityAction, EntityType } from "../../Types/Types";

interface ActivityMeta {
  icon: string;
  color: string;
  label: string;
}

const LABELS: Partial<Record<string, string>> = {
  CREATED_PROJECT: "created this project",
  CREATED_TASK: "created a task",
  UPDATED_PROJECT: "updated this project",
  UPDATED_TASK: "updated a task",
  DELETED_TASK: "deleted a task",
  ASSIGNED_TASK: "assigned a task",
  UNASSIGNED_TASK: "unassigned a task",
  STATUS_CHANGED_TASK: "changed a task's status",
  COMMENTED_TASK: "commented on a task",
  UPLOADED_ATTACHMENT: "uploaded a file",
};

const ICONS: Record<ActivityAction, { icon: string; color: string }> = {
  CREATED:        { icon: "ti-plus",          color: "#5FBF8B" },
  UPDATED:        { icon: "ti-pencil",         color: "#7B9BE8" },
  DELETED:        { icon: "ti-trash",          color: "#E8654F" },
  ASSIGNED:       { icon: "ti-user-check",     color: "#7B9BE8" },
  UNASSIGNED:     { icon: "ti-user-x",         color: "#8D897E" },
  STATUS_CHANGED: { icon: "ti-refresh",        color: "#B98CE8" },
  COMMENTED:      { icon: "ti-message-circle", color: "#E8A33D" },
  UPLOADED:       { icon: "ti-paperclip",      color: "#7B9BE8" },
};

export const getActivityMeta = (action: ActivityAction, entityType: EntityType): ActivityMeta => {
  const { icon, color } = ICONS[action];
  const key = `${action}_${entityType}`;
  const label = LABELS[key] || `${action.toLowerCase().replace("_", " ")} ${entityType.toLowerCase()}`;
  return { icon, color, label };
};

export const formatRelativeTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  const diffSec = Math.round((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};