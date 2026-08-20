import prisma from "../config/prisma.js";
import { getIo } from "../socket/socket.js";

const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

// ============================================================
// HELPER — Accès projet (owner ou membre)
// ============================================================

const getProjectAccess = async (projectId, userId) => {

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true },
  });

  if (!project) return null;

  if (project.ownerId === userId) {
    return { project, role: "OWNER" };
  }

  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
    select: { role: true },
  });

  return { project, role: member?.role ?? null };
};


// ============================================================
// HELPER — Accès projet via une tâche
// ============================================================

const getTaskProjectAccess = async (taskId, userId) => {

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { id: true, projectId: true },
  });

  if (!task) return null;

  const access = await getProjectAccess(task.projectId, userId);

  if (!access) return null;

  return { task, ...access };
};


// ============================================================
// GET PROJECT LABELS
// GET /api/v1/projects/:projectId/labels
// ============================================================

export const getProjectLabels = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const access = await getProjectAccess(projectId, userId);

    if (!access) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (!access.role) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this project",
      });
    }

    const labels = await prisma.label.findMany({
      where: { projectId },
      orderBy: { name: "asc" },
    });

    return res.status(200).json({
      success: true,
      message: "Labels fetched successfully",
      data: { labels },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// CREATE LABEL
// POST /api/v1/projects/:projectId/labels
// ============================================================

export const createLabel = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    const { name, color } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Label name is required",
      });
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 1 || trimmedName.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Label name must contain between 1 and 50 characters",
      });
    }

    if (!color || !HEX_COLOR_REGEX.test(color)) {
      return res.status(400).json({
        success: false,
        message: "A valid hex color is required (e.g. #E8654F)",
      });
    }

    const access = await getProjectAccess(projectId, userId);

    if (!access) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (access.role !== "OWNER" && access.role !== "MANAGER") {
      return res.status(403).json({
        success: false,
        message: "Only the project owner or manager can create labels",
      });
    }

    const existingLabel = await prisma.label.findUnique({
      where: { projectId_name: { projectId, name: trimmedName } },
    });

    if (existingLabel) {
      return res.status(409).json({
        success: false,
        message: "A label with this name already exists in this project",
      });
    }

    const label = await prisma.label.create({
      data: {
        projectId,
        name: trimmedName,
        color,
      },
    });

    getIo().to(`project_${projectId}`).emit("label:created", {
      projectId,
      label,
    });

    return res.status(201).json({
      success: true,
      message: "Label created successfully",
      data: { label },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// UPDATE LABEL
// PATCH /api/v1/labels/:labelId
// ============================================================

export const updateLabel = async (req, res, next) => {
  try {
    const { labelId } = req.params;
    const userId = req.user.id;
    const { name, color } = req.body;

    const label = await prisma.label.findUnique({ where: { id: labelId } });

    if (!label) {
      return res.status(404).json({
        success: false,
        message: "Label not found",
      });
    }

    const access = await getProjectAccess(label.projectId, userId);

    if (access.role !== "OWNER" && access.role !== "MANAGER") {
      return res.status(403).json({
        success: false,
        message: "Only the project owner or manager can update labels",
      });
    }

    if (name === undefined && color === undefined) {
      return res.status(400).json({
        success: false,
        message: "At least one field (name or color) is required",
      });
    }

    const data = {};

    if (name !== undefined) {
      const trimmedName = name.trim();

      if (trimmedName.length < 1 || trimmedName.length > 50) {
        return res.status(400).json({
          success: false,
          message: "Label name must contain between 1 and 50 characters",
        });
      }

      if (trimmedName !== label.name) {
        const existingLabel = await prisma.label.findUnique({
          where: { projectId_name: { projectId: label.projectId, name: trimmedName } },
        });

        if (existingLabel) {
          return res.status(409).json({
            success: false,
            message: "A label with this name already exists in this project",
          });
        }
      }

      data.name = trimmedName;
    }

    if (color !== undefined) {
      if (!HEX_COLOR_REGEX.test(color)) {
        return res.status(400).json({
          success: false,
          message: "A valid hex color is required (e.g. #E8654F)",
        });
      }

      data.color = color;
    }

    const updatedLabel = await prisma.label.update({
      where: { id: labelId },
      data,
    });

    getIo().to(`project_${label.projectId}`).emit("label:updated", {
      projectId: label.projectId,
      label: updatedLabel,
    });

    return res.status(200).json({
      success: true,
      message: "Label updated successfully",
      data: { label: updatedLabel },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// DELETE LABEL
// DELETE /api/v1/labels/:labelId
// ============================================================

export const deleteLabel = async (req, res, next) => {
  try {
    const { labelId } = req.params;
    const userId = req.user.id;

    const label = await prisma.label.findUnique({ where: { id: labelId } });

    if (!label) {
      return res.status(404).json({
        success: false,
        message: "Label not found",
      });
    }

    const access = await getProjectAccess(label.projectId, userId);

    if (access.role !== "OWNER" && access.role !== "MANAGER") {
      return res.status(403).json({
        success: false,
        message: "Only the project owner or manager can delete labels",
      });
    }

    // onDelete: Cascade sur TaskLabel.label => détache automatiquement de toutes les tâches
    await prisma.label.delete({ where: { id: labelId } });

    getIo().to(`project_${label.projectId}`).emit("label:deleted", {
      projectId: label.projectId,
      labelId,
    });

    return res.status(200).json({
      success: true,
      message: "Label deleted successfully",
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// ATTACH LABEL TO TASK
// POST /api/v1/tasks/:taskId/labels
// ============================================================

export const attachLabelToTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const { labelId } = req.body;

    if (!labelId) {
      return res.status(400).json({
        success: false,
        message: "Label id is required",
      });
    }

    const context = await getTaskProjectAccess(taskId, userId);

    if (!context) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (context.role !== "OWNER" && context.role !== "MANAGER") {
      return res.status(403).json({
        success: false,
        message: "Only the project owner or manager can manage task labels",
      });
    }

    const label = await prisma.label.findUnique({ where: { id: labelId } });

    if (!label || label.projectId !== context.task.projectId) {
      return res.status(400).json({
        success: false,
        message: "This label does not belong to this project",
      });
    }

    const existingTaskLabel = await prisma.taskLabel.findUnique({
      where: { taskId_labelId: { taskId, labelId } },
    });

    if (existingTaskLabel) {
      return res.status(409).json({
        success: false,
        message: "This label is already attached to the task",
      });
    }

    await prisma.taskLabel.create({
      data: { taskId, labelId },
    });

    const taskLabels = await prisma.taskLabel.findMany({
      where: { taskId },
      include: { label: true },
    });

    getIo().to(`project_${context.task.projectId}`).emit("task:labels_updated", {
      projectId: context.task.projectId,
      taskId,
      labels: taskLabels,
    });

    return res.status(201).json({
      success: true,
      message: "Label attached to task successfully",
      data: { labels: taskLabels },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// DETACH LABEL FROM TASK
// DELETE /api/v1/tasks/:taskId/labels/:labelId
// ============================================================

export const detachLabelFromTask = async (req, res, next) => {
  try {
    const { taskId, labelId } = req.params;
    const userId = req.user.id;

    const context = await getTaskProjectAccess(taskId, userId);

    if (!context) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (context.role !== "OWNER" && context.role !== "MANAGER") {
      return res.status(403).json({
        success: false,
        message: "Only the project owner or manager can manage task labels",
      });
    }

    const existingTaskLabel = await prisma.taskLabel.findUnique({
      where: { taskId_labelId: { taskId, labelId } },
    });

    if (!existingTaskLabel) {
      return res.status(404).json({
        success: false,
        message: "This label is not attached to the task",
      });
    }

    await prisma.taskLabel.delete({
      where: { id: existingTaskLabel.id },
    });

    const taskLabels = await prisma.taskLabel.findMany({
      where: { taskId },
      include: { label: true },
    });

    getIo().to(`project_${context.task.projectId}`).emit("task:labels_updated", {
      projectId: context.task.projectId,
      taskId,
      labels: taskLabels,
    });

    return res.status(200).json({
      success: true,
      message: "Label detached from task successfully",
      data: { labels: taskLabels },
    });

  } catch (err) {
    next(err);
  }
};