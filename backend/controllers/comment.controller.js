import prisma from "../config/prisma.js";
import { getIo } from "../socket/socket.js";
import {
  createCommentAddedNotification,
  createCommentMentionNotification,
} from "../services/notificationService.js";

const AUTHOR_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
};

// ============================================================
// HELPER — Récupère la tâche + vérifie l'appartenance au projet
// ============================================================

const getTaskWithMembership = async (taskId, userId) => {

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      id: true,
      title: true,
      projectId: true,
      assigneeId: true,
      creatorId: true,
      project: {
        select: { id: true, ownerId: true },
      },
    },
  });

  if (!task) return null;

  if (task.project.ownerId === userId) {
    return { task, role: "OWNER" };
  }

  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId: task.projectId,
        userId,
      },
    },
    select: { role: true },
  });

  return { task, role: member?.role ?? null };
};


// ============================================================
// GET TASK COMMENTS
// GET /api/v1/tasks/:taskId/comments
// ============================================================

export const getTaskComments = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    const context = await getTaskWithMembership(taskId, userId);

    if (!context) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (!context.role) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this project",
      });
    }

    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: { author: { select: AUTHOR_SELECT } },
      orderBy: { createdAt: "asc" },
    });

    return res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      data: { comments },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// CREATE COMMENT
// POST /api/v1/tasks/:taskId/comments
// ============================================================

export const createComment = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const { content, mentionedUserIds = [] } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    if (content.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Comment must not exceed 2000 characters",
      });
    }

    const context = await getTaskWithMembership(taskId, userId);

    if (!context) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (!context.role) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this project",
      });
    }

    const comment = await prisma.comment.create({
      data: {
        taskId,
        authorId: userId,
        content: content.trim(),
      },
      include: { author: { select: AUTHOR_SELECT } },
    });

    // --------------------------------------------------------
    // EMIT
    // --------------------------------------------------------

    getIo().to(`project_${context.task.projectId}`).emit("comment:created", {
      projectId: context.task.projectId,
      taskId,
      comment,
    });

    // --------------------------------------------------------
    // NOTIFY (assigné + créateur de la tâche)
    // --------------------------------------------------------

    await createCommentAddedNotification({
      projectId: context.task.projectId,
      taskId,
      taskTitle: context.task.title,
      commentAuthorId: userId,
      actor: req.user,
    });

    // --------------------------------------------------------
    // NOTIFY MENTIONS (si le front envoie des IDs mentionnés)
    // --------------------------------------------------------

    if (mentionedUserIds.length) {

      const validMembers = await prisma.projectMember.findMany({
        where: {
          projectId: context.task.projectId,
          userId: { in: mentionedUserIds },
        },
        select: { userId: true },
      });

      const validMentionIds = validMembers.map((m) => m.userId);

      if (mentionedUserIds.includes(context.task.project.ownerId)) {
        validMentionIds.push(context.task.project.ownerId);
      }

      if (validMentionIds.length) {
        await createCommentMentionNotification({
          projectId: context.task.projectId,
          taskId,
          taskTitle: context.task.title,
          mentionedUserIds: validMentionIds,
          commentAuthorId: userId,
          actor: req.user,
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: { comment },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// UPDATE COMMENT (auteur uniquement)
// PATCH /api/v1/comments/:commentId
// ============================================================

export const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    if (content.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Comment must not exceed 2000 characters",
      });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        authorId: true,
        taskId: true,
        task: { select: { projectId: true } },
      },
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own comments",
      });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content: content.trim() },
      include: { author: { select: AUTHOR_SELECT } },
    });

    getIo().to(`project_${comment.task.projectId}`).emit("comment:updated", {
      projectId: comment.task.projectId,
      taskId: comment.taskId,
      comment: updatedComment,
    });

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: { comment: updatedComment },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// DELETE COMMENT (auteur, ou OWNER/MANAGER pour modération)
// DELETE /api/v1/comments/:commentId
// ============================================================

export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        authorId: true,
        taskId: true,
        task: {
          select: {
            projectId: true,
            project: { select: { ownerId: true } },
          },
        },
      },
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const isAuthor = comment.authorId === userId;
    const isOwner = comment.task.project.ownerId === userId;

    let isModerator = isOwner;

    if (!isAuthor && !isOwner) {
      const membership = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: comment.task.projectId,
            userId,
          },
        },
      });

      isModerator = membership?.role === "MANAGER";
    }

    if (!isAuthor && !isModerator) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this comment",
      });
    }

    await prisma.comment.delete({ where: { id: commentId } });

    getIo().to(`project_${comment.task.projectId}`).emit("comment:deleted", {
      projectId: comment.task.projectId,
      taskId: comment.taskId,
      commentId,
    });

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });

  } catch (err) {
    next(err);
  }
};