// utils/notificationUtils.js

// ============================================================
// TITLES
// ============================================================

const TITLES = {
  INFO: "Notification",
  SUCCESS: "Success",
  WARNING: "Warning",
  ERROR: "Error",

  MEMBER_ADDED: "Added to project",
  MEMBER_REMOVED: "Removed from project",

  TASK_ASSIGNED: "Task assigned",
  TASK_UNASSIGNED: "Task unassigned",
  TASK_STATUS_CHANGED: "Task status updated",
  TASK_DUE_SOON: "Task due soon",
  TASK_OVERDUE: "Task overdue",

  COMMENT_ADDED: "New comment",
  COMMENT_MENTION: "You were mentioned",
};

export const getNotificationTitle = (type) => {
  return TITLES[type] || "Notification";
};


// ============================================================
// MESSAGES
// ============================================================

export const getNotificationMessage = (type, params = {}) => {

  switch (type) {

    case "MEMBER_ADDED":
      return `${params.actorName} added you to "${params.projectName}"`;

    case "MEMBER_REMOVED":
      return `${params.actorName} removed you from "${params.projectName}"`;

    case "TASK_ASSIGNED":
      return `${params.actorName} assigned you "${params.taskTitle}"`;

    case "TASK_UNASSIGNED":
      return `${params.actorName} unassigned you from "${params.taskTitle}"`;

    case "TASK_STATUS_CHANGED":
      return `${params.actorName} moved "${params.taskTitle}" to ${formatStatusLabel(params.newStatus)}`;

    case "TASK_DUE_SOON":
      return `"${params.taskTitle}" is due soon`;

    case "TASK_OVERDUE":
      return `"${params.taskTitle}" is overdue`;

    case "COMMENT_ADDED":
      return `${params.actorName} commented on "${params.taskTitle}"`;

    case "COMMENT_MENTION":
      return `${params.actorName} mentioned you in "${params.taskTitle}"`;

    default:
      return params.message || "";
  }
};


// ============================================================
// HELPERS
// ============================================================

export const formatStatusLabel = (status) => {

  const labels = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    IN_REVIEW: "In Review",
    DONE: "Done",
  };

  return labels[status] || status;
};