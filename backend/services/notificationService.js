// services/notificationService.js
import prisma from "../config/prisma.js";
import { getIo } from "../socket/socket.js";
import { getNotificationTitle, getNotificationMessage } from "../utils/notificationUtils.js";


// ============================================================
// CORE
// ============================================================

/**
 * Creates a notification in the database.
 * This is the single low-level entry point — everything else in this
 * file (and in controllers) should go through this function.
 */
export const createNotification = async ({
  userId,
  type,
  title,
  message,
  projectId = null,
  taskId = null,
  actorId = null,
}) => {

  // Don't notify a user about their own action
  if (actorId && actorId === userId) {
    return null;
  }

  try {

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        projectId,
        taskId,
        actorId,
      },
      include: {
        actor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // ------------------------------------------------------------
    // Real-time push (Socket.io) — plug in here once wired up
    // ------------------------------------------------------------
    // io.to(`user:${userId}`).emit("notification:new", notification);

    return notification;

  } catch (err) {
    // A notification failing to save should never break the parent
    // business action (e.g. assigning a task must still succeed).
    console.error("Failed to create notification:", err);
    return null;
  }
};


// ============================================================
// MEMBERS
// ============================================================

export const createMemberAddedNotification = async ({
  projectId,
  projectName,
  newMemberId,
  actor,
}) => {

  return createNotification({
    userId: newMemberId,
    type: "MEMBER_ADDED",
    title: getNotificationTitle("MEMBER_ADDED"),
    message: getNotificationMessage("MEMBER_ADDED", {
      actorName: `${actor.firstName} ${actor.lastName}`,
      projectName,
    }),
    projectId,
    actorId: actor.id,
  });
};


export const createMemberRemovedNotification = async ({
  projectId,
  projectName,
  removedMemberId,
  actor,
}) => {

  return createNotification({
    userId: removedMemberId,
    type: "MEMBER_REMOVED",
    title: getNotificationTitle("MEMBER_REMOVED"),
    message: getNotificationMessage("MEMBER_REMOVED", {
      actorName: `${actor.firstName} ${actor.lastName}`,
      projectName,
    }),
    projectId,
    actorId: actor.id,
  });
};


// ============================================================
// TASKS
// ============================================================

export const createTaskAssignedNotification = async ({
  projectId,
  taskId,
  taskTitle,
  assigneeId,
  actor,
}) => {

  return createNotification({
    userId: assigneeId,
    type: "TASK_ASSIGNED",
    title: getNotificationTitle("TASK_ASSIGNED"),
    message: getNotificationMessage("TASK_ASSIGNED", {
      actorName: `${actor.firstName} ${actor.lastName}`,
      taskTitle,
    }),
    projectId,
    taskId,
    actorId: actor.id,
  });
};


export const createTaskUnassignedNotification = async ({
  projectId,
  taskId,
  taskTitle,
  previousAssigneeId,
  actor,
}) => {

  return createNotification({
    userId: previousAssigneeId,
    type: "TASK_UNASSIGNED",
    title: getNotificationTitle("TASK_UNASSIGNED"),
    message: getNotificationMessage("TASK_UNASSIGNED", {
      actorName: `${actor.firstName} ${actor.lastName}`,
      taskTitle,
    }),
    projectId,
    taskId,
    actorId: actor.id,
  });
};


export const createTaskStatusNotification = async ({
  projectId,
  taskId,
  taskTitle,
  assigneeId,
  newStatus,
  actor,
}) => {

  // Only notify the assignee, and only if someone else changed it
  if (!assigneeId) {
    return null;
  }

  return createNotification({
    userId: assigneeId,
    type: "TASK_STATUS_CHANGED",
    title: getNotificationTitle("TASK_STATUS_CHANGED"),
    message: getNotificationMessage("TASK_STATUS_CHANGED", {
      actorName: `${actor.firstName} ${actor.lastName}`,
      taskTitle,
      newStatus,
    }),
    projectId,
    taskId,
    actorId: actor.id,
  });
};


export const createTaskDueSoonNotification = async ({
  projectId,
  taskId,
  taskTitle,
  assigneeId,
}) => {

  return createNotification({
    userId: assigneeId,
    type: "TASK_DUE_SOON",
    title: getNotificationTitle("TASK_DUE_SOON"),
    message: getNotificationMessage("TASK_DUE_SOON", { taskTitle }),
    projectId,
    taskId,
  });
};


export const createTaskOverdueNotification = async ({
  projectId,
  taskId,
  taskTitle,
  assigneeId,
}) => {

  return createNotification({
    userId: assigneeId,
    type: "TASK_OVERDUE",
    title: getNotificationTitle("TASK_OVERDUE"),
    message: getNotificationMessage("TASK_OVERDUE", { taskTitle }),
    projectId,
    taskId,
  });
};


// ============================================================
// COMMENTS (prêt pour quand la feature arrivera)
// ============================================================

export const createCommentNotification = async ({
  projectId,
  taskId,
  taskTitle,
  recipientId,
  actor,
}) => {

  return createNotification({
    userId: recipientId,
    type: "COMMENT_ADDED",
    title: getNotificationTitle("COMMENT_ADDED"),
    message: getNotificationMessage("COMMENT_ADDED", {
      actorName: `${actor.firstName} ${actor.lastName}`,
      taskTitle,
    }),
    projectId,
    taskId,
    actorId: actor.id,
  });
};





// À ajouter dans ton services/notificationService.js existant
// (assure-toi que prisma et getIo y sont déjà importés)

export const createCommentAddedNotification = async ({
  projectId,
  taskId,
  taskTitle,
  commentAuthorId,
  actor,
}) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { assigneeId: true, creatorId: true },
  });

  if (!task) return;

  const recipientIds = new Set(
    [task.assigneeId, task.creatorId].filter(
      (id) => id && id !== commentAuthorId
    )
  );

  if (recipientIds.size === 0) return;

  const notifications = await prisma.$transaction(
    Array.from(recipientIds).map((userId) =>
      prisma.notification.create({
        data: {
          userId,
          type: "COMMENT_ADDED",
          title: "Nouveau commentaire",
          message: `${actor.firstName} ${actor.lastName} a commenté "${taskTitle}"`,
          projectId,
          taskId,
          actorId: actor.id,
        },
      })
    )
  );

  notifications.forEach((notification) => {
    getIo().to(`user_${notification.userId}`).emit("notification:new", notification);
  });
};


export const createCommentMentionNotification = async ({
  projectId,
  taskId,
  taskTitle,
  mentionedUserIds,
  commentAuthorId,
  actor,
}) => {
  const recipientIds = mentionedUserIds.filter((id) => id !== commentAuthorId);

  if (!recipientIds.length) return;

  const notifications = await prisma.$transaction(
    recipientIds.map((userId) =>
      prisma.notification.create({
        data: {
          userId,
          type: "COMMENT_MENTION",
          title: "Vous avez été mentionné",
          message: `${actor.firstName} ${actor.lastName} vous a mentionné dans "${taskTitle}"`,
          projectId,
          taskId,
          actorId: actor.id,
        },
      })
    )
  );

  notifications.forEach((notification) => {
    getIo().to(`user_${notification.userId}`).emit("notification:new", notification);
  });
};