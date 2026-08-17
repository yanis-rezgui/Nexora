import prisma from "../config/prisma.js";
import {
  createTaskAssignedNotification,
  createTaskUnassignedNotification,
  createTaskStatusNotification,
} from "../services/notificationService.js";
import { getIo } from "../socket/socket.js";

// ============================================================
// HELPERS
// ============================================================

const getProjectMembership = async (projectId, userId) => {

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      id: true,
      ownerId: true,
    },
  });

  if (!project) {
    return null;
  }

  // Project owner
  if (project.ownerId === userId) {
    return {
      project,
      role: "OWNER",
    };
  }

  // Project member
  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
    select: {
      id: true,
      role: true,
      userId: true,
      projectId: true,
    },
  });

  if (!member) {
    return {
      project,
      role: null,
    };
  }

  return {
    project,
    role: member.role,
  };
};


// ============================================================
// GET PROJECT TASKS
// GET /api/v1/projects/:projectId/tasks
// ============================================================

export const getProjectTasks = async (req, res, next) => {

  try {

    const { projectId } = req.params;
    const userId = req.user.id;

    const membership = await getProjectMembership(
      projectId,
      userId
    );

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (!membership.role) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this project",
      });
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId,
      },

      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        labels: {
          include: {
            label: true,
          },
        },

        _count: {
          select: {
            comments: true,
            attachments: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Project tasks fetched successfully",
      data: {
        tasks,
      },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// CREATE TASK
// POST /api/v1/projects/:projectId/tasks
// ============================================================

export const createTask = async (req, res, next) => {

  try {

    const { projectId } = req.params;
    const userId = req.user.id;

    const {
      title,
      description,
      priority,
      dueDate,
      assigneeId,
    } = req.body;


    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }


    // --------------------------------------------------------
    // CHECK PROJECT + PERMISSION
    // --------------------------------------------------------

    const membership = await getProjectMembership(
      projectId,
      userId
    );

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (
      membership.role !== "OWNER" &&
      membership.role !== "MANAGER"
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the project owner or manager can create tasks",
      });
    }


    // --------------------------------------------------------
    // CHECK ASSIGNEE
    // --------------------------------------------------------

    if (assigneeId) {

      const assigneeMembership = await getProjectMembership(
        projectId,
        assigneeId
      );

      if (
        !assigneeMembership ||
        !assigneeMembership.role
      ) {
        return res.status(400).json({
          success: false,
          message: "Assignee is not a member of this project",
        });
      }
    }


    // --------------------------------------------------------
    // CREATE TASK
    // --------------------------------------------------------

    const task = await prisma.task.create({
      data: {
        projectId,

        title: title.trim(),

        description: description?.trim() || null,

        priority: priority || "MEDIUM",

        status: "TODO",

        creatorId: userId,

        assigneeId: assigneeId || null,

        dueDate: dueDate
          ? new Date(dueDate)
          : null,
      },

      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });


    // --------------------------------------------------------
    // EMIT
    // --------------------------------------------------------

    getIo().to(`project_${projectId}`).emit("task:created", {
      projectId,
      task,
    });

    if (task.assigneeId) {
      getIo().to(`user_${task.assigneeId}`).emit("task:created", {
        projectId,
        task,
      });
    }


    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        task,
      },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// GET TASK BY ID
// GET /api/v1/projects/:projectId/tasks/:taskId
// ============================================================

export const getTaskById = async (req, res, next) => {

  try {

    const {
      projectId,
      taskId,
    } = req.params;

    const userId = req.user.id;


    // --------------------------------------------------------
    // CHECK PROJECT ACCESS
    // --------------------------------------------------------

    const membership = await getProjectMembership(
      projectId,
      userId
    );

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (!membership.role) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this project",
      });
    }


    // --------------------------------------------------------
    // GET TASK
    // --------------------------------------------------------

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
      },

      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },

        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        comments: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },

          orderBy: {
            createdAt: "asc",
          },
        },

        attachments: true,

        labels: {
          include: {
            label: true,
          },
        },
      },
    });


    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }


    return res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      data: {
        task,
      },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// UPDATE TASK
// PATCH /api/v1/projects/:projectId/tasks/:taskId
// ============================================================

export const updateTask = async (req, res, next) => {

  try {

    const {
      projectId,
      taskId,
    } = req.params;

    const userId = req.user.id;

    const {
      title,
      description,
      priority,
      dueDate,
    } = req.body;


    // --------------------------------------------------------
    // CHECK PROJECT ACCESS
    // --------------------------------------------------------

    const membership = await getProjectMembership(
      projectId,
      userId
    );

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }


    if (
      membership.role !== "OWNER" &&
      membership.role !== "MANAGER"
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the project owner or manager can update tasks",
      });
    }


    // --------------------------------------------------------
    // CHECK TASK
    // --------------------------------------------------------

    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
      },
    });

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }


    // --------------------------------------------------------
    // UPDATE
    // --------------------------------------------------------

    const task = await prisma.task.update({
      where: {
        id: taskId,
      },

      data: {
        ...(title !== undefined && {
          title: title.trim(),
        }),

        ...(description !== undefined && {
          description: description?.trim() || null,
        }),

        ...(priority !== undefined && {
          priority,
        }),

        ...(dueDate !== undefined && {
          dueDate: dueDate
            ? new Date(dueDate)
            : null,
        }),
      },

      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });


    // --------------------------------------------------------
    // EMIT
    // --------------------------------------------------------

    getIo().to(`project_${projectId}`).emit("task:updated", {
      projectId,
      task,
    });

    if (task.assigneeId) {
      getIo().to(`user_${task.assigneeId}`).emit("task:updated", {
        projectId,
        task,
      });
    }


    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: {
        task,
      },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// DELETE TASK
// DELETE /api/v1/projects/:projectId/tasks/:taskId
// ============================================================

export const deleteTask = async (req, res, next) => {

  try {

    const {
      projectId,
      taskId,
    } = req.params;

    const userId = req.user.id;


    // --------------------------------------------------------
    // CHECK PROJECT ACCESS
    // --------------------------------------------------------

    const membership = await getProjectMembership(
      projectId,
      userId
    );

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }


    if (
      membership.role !== "OWNER" &&
      membership.role !== "MANAGER"
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the project owner or manager can delete tasks",
      });
    }


    // --------------------------------------------------------
    // CHECK TASK
    // --------------------------------------------------------

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }


    // --------------------------------------------------------
    // DELETE
    // --------------------------------------------------------

    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });


    // --------------------------------------------------------
    // EMIT
    // --------------------------------------------------------

    getIo().to(`project_${projectId}`).emit("task:deleted", {
      projectId,
      taskId,
    });

    if (task.assigneeId) {
      getIo().to(`user_${task.assigneeId}`).emit("task:deleted", {
        projectId,
        taskId,
      });
    }


    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// ASSIGN TASK
// PATCH /api/v1/projects/:projectId/tasks/:taskId/assign
// ============================================================

export const assignTask = async (req, res, next) => {

  try {

    const {
      projectId,
      taskId,
    } = req.params;

    const userId = req.user.id;

    const { assigneeId } = req.body;


    // --------------------------------------------------------
    // CHECK PROJECT ACCESS
    // --------------------------------------------------------

    const membership = await getProjectMembership(
      projectId,
      userId
    );

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }


    if (
      membership.role !== "OWNER" &&
      membership.role !== "MANAGER"
    ) {
      return res.status(403).json({
        success: false,
        message: "Only the project owner or manager can assign tasks",
      });
    }


    // --------------------------------------------------------
    // CHECK TASK
    // --------------------------------------------------------

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }


    // --------------------------------------------------------
    // UNASSIGN
    // --------------------------------------------------------

    if (!assigneeId) {

      const updatedTask = await prisma.task.update({
        where: {
          id: taskId,
        },

        data: {
          assigneeId: null,
        },

        include: {
          assignee: true,
        },
      });

// --------------------------------------------------------
    // NOTIFY
    // --------------------------------------------------------

    if (task.assigneeId) {
      await createTaskUnassignedNotification({
        projectId,
        taskId,
        taskTitle: task.title,
        previousAssigneeId: task.assigneeId,
        actor: req.user,
      });
    }

    // --------------------------------------------------------
    // EMIT
    // --------------------------------------------------------

    getIo().to(`project_${projectId}`).emit("task:unassigned", {
      projectId,
      task: updatedTask,
    });

    if (task.assigneeId) {
      getIo().to(`user_${task.assigneeId}`).emit("task:unassigned", {
        projectId,
        task: updatedTask,
      });
    }

      return res.status(200).json({
        success: true,
        message: "Task unassigned successfully",
        data: {
          task: updatedTask,
        },
      });
    }


    // --------------------------------------------------------
    // CHECK ASSIGNEE IS PROJECT MEMBER
    // --------------------------------------------------------

    const assigneeMembership = await getProjectMembership(
      projectId,
      assigneeId
    );

    if (
      !assigneeMembership ||
      !assigneeMembership.role
    ) {
      return res.status(400).json({
        success: false,
        message: "Assignee is not a member of this project",
      });
    }


    // --------------------------------------------------------
    // ASSIGN
    // --------------------------------------------------------

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },

      data: {
        assigneeId,
      },

      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });


    // --------------------------------------------------------
    // NOTIFY
    // --------------------------------------------------------

    await createTaskAssignedNotification({
      projectId,
      taskId,
      taskTitle: updatedTask.title,
      assigneeId,
      actor: req.user,
    });

    // --------------------------------------------------------
    // EMIT
    // --------------------------------------------------------

    getIo().to(`project_${projectId}`).emit("task:assigned", {
      projectId,
      task: updatedTask,
    });

    getIo().to(`user_${assigneeId}`).emit("task:assigned", {
      projectId,
      task: updatedTask,
    });

    return res.status(200).json({
      success: true,
      message: "Task assigned successfully",
      data: {
        task: updatedTask,
      },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// UPDATE TASK STATUS
// PATCH /api/v1/projects/:projectId/tasks/:taskId/status
// ============================================================

export const updateTaskStatus = async (req, res, next) => {

  try {

    const {
      projectId,
      taskId,
    } = req.params;

    const userId = req.user.id;

    const { status } = req.body;


    // --------------------------------------------------------
    // VALIDATE STATUS
    // --------------------------------------------------------

    const allowedStatuses = [
      "TODO",
      "IN_PROGRESS",
      "IN_REVIEW",
      "DONE",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task status",
      });
    }


    // --------------------------------------------------------
    // CHECK PROJECT ACCESS
    // --------------------------------------------------------

    const membership = await getProjectMembership(
      projectId,
      userId
    );

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (!membership.role) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this project",
      });
    }


    // --------------------------------------------------------
    // CHECK TASK
    // --------------------------------------------------------

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }


    // --------------------------------------------------------
    // UPDATE STATUS
    // --------------------------------------------------------

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },

      data: {
        status,
      },

      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },

        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });


    // --------------------------------------------------------
    // NOTIFY
    // --------------------------------------------------------

    if (updatedTask.assigneeId && updatedTask.assigneeId !== userId) {
      await createTaskStatusNotification({
        projectId,
        taskId,
        taskTitle: updatedTask.title,
        newStatus: status,
        assigneeId: updatedTask.assigneeId,
        actor: req.user,
      });
    }


    // --------------------------------------------------------
    // EMIT
    // --------------------------------------------------------

    getIo().to(`project_${projectId}`).emit("task:status_updated", {
      projectId,
      task: updatedTask,
    });

    if (updatedTask.assigneeId) {
      getIo().to(`user_${updatedTask.assigneeId}`).emit("task:status_updated", {
        projectId,
        task: updatedTask,
      });
    }


    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: {
        task: updatedTask,
      },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// GET MY TASKS (across all projects)
// GET /api/v1/tasks/my
// ============================================================

export const getMyTasks = async (req, res, next) => {

  try {

    const userId = req.user.id;

    const {
      status,
      priority,
      projectId,
      search,
      sort = "dueDate",
      order = "asc",
      page = 1,
      limit = 20,
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const allowedStatuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
    const allowedPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
    const allowedSortFields = ["dueDate", "createdAt", "priority", "title"];

    const sortField = allowedSortFields.includes(sort) ? sort : "dueDate";
    const sortOrder = order === "desc" ? "desc" : "asc";


    // --------------------------------------------------------
    // BUILD WHERE CLAUSE
    // --------------------------------------------------------

    const where = {
      assigneeId: userId,

      ...(status && allowedStatuses.includes(status) && {
        status,
      }),

      ...(priority && allowedPriorities.includes(priority) && {
        priority,
      }),

      ...(projectId && {
        projectId,
      }),

      ...(search && {
        title: {
          contains: search,
          mode: "insensitive",
        },
      }),
    };


    // --------------------------------------------------------
    // FETCH TASKS + TOTAL + STATUS COUNTS (unfiltered by status/search, for tabs)
    // --------------------------------------------------------

    const [tasks, total, statusCounts] = await Promise.all([

      prisma.task.findMany({
        where,

        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },

          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },

          labels: {
            include: {
              label: true,
            },
          },

          _count: {
            select: {
              comments: true,
              attachments: true,
            },
          },
        },

        orderBy:
          sortField === "priority"
            ? [{ priority: sortOrder }, { createdAt: "desc" }]
            : { [sortField]: sortOrder },

        skip,
        take: limitNum,
      }),

      prisma.task.count({ where }),

      prisma.task.groupBy({
        by: ["status"],
        where: { assigneeId: userId },
        _count: { _all: true },
      }),
    ]);


    const counts = { TODO: 0, IN_PROGRESS: 0, IN_REVIEW: 0, DONE: 0 };

    statusCounts.forEach((entry) => {
      counts[entry.status] = entry._count._all;
    });


    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: {
        tasks,
        counts,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum) || 1,
        },
      },
    });

  } catch (err) {
    next(err);
  }
};