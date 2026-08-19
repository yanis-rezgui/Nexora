// controllers/admin.controller.js
import prisma from "../config/prisma.js";


// ============================================================
// DASHBOARD OVERVIEW
// GET /api/v1/admin/dashboard
// ============================================================

export const getAdminDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();

    const [
      totalUsers,
      activeUsers,
      totalProjects,
      totalTasks,
      completedTasks,
      overdueTasks,
      recentActivity,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.project.count(),
      prisma.task.count(),
      prisma.task.count({ where: { status: "DONE" } }),
      prisma.task.count({
        where: { status: { not: "DONE" }, dueDate: { lt: now } },
      }),
      prisma.activityLog.findMany({
        include: {
          user: { select: { id: true, firstName: true, lastName: true } },
          project: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 15,
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Admin dashboard stats fetched successfully",
      data: {
        stats: {
          totalUsers,
          activeUsers,
          totalProjects,
          totalTasks,
          completedTasks,
          overdueTasks,
        },
        recentActivity,
      },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// ANALYTICS
// GET /api/v1/admin/analytics
// ============================================================

export const getAdminAnalytics = async (req, res, next) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - 7);

    const startOfLastWeek = new Date(now);
    startOfLastWeek.setDate(now.getDate() - 14);

    const [
      recentUsers,
      tasksCompletedThisWeek,
      tasksCompletedLastWeek,
      rawTopAssignees,
    ] = await Promise.all([
      prisma.user.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
      }),

      prisma.task.count({
        where: { status: "DONE", updatedAt: { gte: startOfThisWeek } },
      }),

      prisma.task.count({
        where: {
          status: "DONE",
          updatedAt: { gte: startOfLastWeek, lt: startOfThisWeek },
        },
      }),

      prisma.task.groupBy({
        by: ["assigneeId"],
        where: { assigneeId: { not: null } },
        _count: { _all: true },
      }),
    ]);

    // ----------------------------------------------------------
    // USER GROWTH (par mois)
    // ----------------------------------------------------------

    const growthMap = {};

    recentUsers.forEach((u) => {
      const key = `${u.createdAt.getFullYear()}-${String(
        u.createdAt.getMonth() + 1
      ).padStart(2, "0")}`;
      growthMap[key] = (growthMap[key] || 0) + 1;
    });

    const userGrowth = Object.entries(growthMap)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([month, count]) => ({ month, count }));

    // ----------------------------------------------------------
    // TOP 5 ASSIGNEES
    // ----------------------------------------------------------

    const topAssigneeGroups = rawTopAssignees
      .sort((a, b) => b._count._all - a._count._all)
      .slice(0, 5);

    const assigneeUsers = await prisma.user.findMany({
      where: { id: { in: topAssigneeGroups.map((t) => t.assigneeId) } },
      select: { id: true, firstName: true, lastName: true },
    });

    const assigneeMap = Object.fromEntries(
      assigneeUsers.map((u) => [u.id, u])
    );

    const mostActiveUsers = topAssigneeGroups
      .map((t) => ({
        user: assigneeMap[t.assigneeId],
        taskCount: t._count._all,
      }))
      .filter((entry) => entry.user);

    // ----------------------------------------------------------
    // RESPONSE
    // ----------------------------------------------------------

    const percentChange = tasksCompletedLastWeek
      ? Math.round(
          ((tasksCompletedThisWeek - tasksCompletedLastWeek) /
            tasksCompletedLastWeek) *
            100
        )
      : null;

    return res.status(200).json({
      success: true,
      message: "Analytics fetched successfully",
      data: {
        userGrowth,
        taskCompletion: {
          thisWeek: tasksCompletedThisWeek,
          lastWeek: tasksCompletedLastWeek,
          percentChange,
        },
        mostActiveUsers,
      },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// GET ALL USERS
// GET /api/v1/admin/users
// ============================================================

export const getAllUsers = async (req, res, next) => {
  try {
    const {
      search,
      role,
      isActive,
      page = 1,
      limit = 20,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const allowedSortFields = ["createdAt", "firstName", "lastName", "email"];
    const sortField = allowedSortFields.includes(sort) ? sort : "createdAt";
    const sortOrder = order === "asc" ? "asc" : "desc";

    const where = {
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(role && ["USER", "ADMIN"].includes(role) && { role }),
      ...(isActive !== undefined && { isActive: isActive === "true" }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              ownedProjects: true,
              projectMemberships: true,
              assignedTasks: true,
            },
          },
        },
        orderBy: { [sortField]: sortOrder },
        skip,
        take: limitNum,
      }),
      prisma.user.count({ where }),
    ]);

    const formattedUsers = users.map((u) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt,
      projectCount: u._count.ownedProjects + u._count.projectMemberships,
      taskCount: u._count.assignedTasks,
    }));

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: {
        users: formattedUsers,
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


// ============================================================
// GET USER BY ID (admin view)
// GET /api/v1/admin/users/:userId
// ============================================================

export const getUserByIdAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const [ownedCount, membershipCount, taskCounts, sessionCount] =
      await Promise.all([
        prisma.project.count({ where: { ownerId: userId } }),
        prisma.projectMember.count({ where: { userId } }),
        prisma.task.groupBy({
          by: ["status"],
          where: { assigneeId: userId },
          _count: { _all: true },
        }),
        prisma.refreshToken.count({
          where: {
            userId,
            revokedAt: null,
            expiresAt: { gt: new Date() },
          },
        }),
      ]);

    const counts = { TODO: 0, IN_PROGRESS: 0, IN_REVIEW: 0, DONE: 0 };
    taskCounts.forEach((entry) => {
      counts[entry.status] = entry._count._all;
    });

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: {
        user: {
          ...user,
          projectCount: ownedCount + membershipCount,
          taskCounts: counts,
          activeSessionCount: sessionCount,
        },
      },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// UPDATE USER ROLE
// PATCH /api/v1/admin/users/:userId/role
// ============================================================

export const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["USER", "ADMIN"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Empêche de rétrograder le dernier admin restant
    if (user.role === "ADMIN" && role === "USER") {
      const adminCount = await prisma.user.count({
        where: { role: "ADMIN" },
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot demote the last remaining admin",
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: { user: updatedUser },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// SUSPEND USER
// PATCH /api/v1/admin/users/:userId/suspend
// ============================================================

export const suspendUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const adminId = req.user.id;

    if (userId === adminId) {
      return res.status(400).json({
        success: false,
        message: "You cannot suspend your own account",
      });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Empêche de suspendre le dernier admin actif
    if (user.role === "ADMIN") {
      const activeAdminCount = await prisma.user.count({
        where: { role: "ADMIN", isActive: true },
      });

      if (activeAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot suspend the last remaining admin",
        });
      }
    }

    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { isActive: false },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          isActive: true,
        },
      }),
      prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "User suspended successfully",
      data: { user: updatedUser },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// UNSUSPEND USER
// PATCH /api/v1/admin/users/:userId/unsuspend
// ============================================================

export const unsuspendUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User unsuspended successfully",
      data: { user: updatedUser },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// GET USER SESSIONS
// GET /api/v1/admin/users/:userId/sessions
// ============================================================

export const getUserSessions = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const sessions = await prisma.refreshToken.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Sessions fetched successfully",
      data: { sessions },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// REVOKE ALL SESSIONS
// DELETE /api/v1/admin/users/:userId/sessions
// ============================================================

export const revokeUserSessions = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const result = await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return res.status(200).json({
      success: true,
      message: "Sessions revoked successfully",
      data: { revokedCount: result.count },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// GET ALL PROJECTS (admin — accès total, pas de filtre membership)
// GET /api/v1/admin/projects
// ============================================================

export const getAllProjectsAdmin = async (req, res, next) => {
  try {
    const {
      search,
      page = 1,
      limit = 20,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const allowedSortFields = ["createdAt", "updatedAt", "name"];
    const sortField = allowedSortFields.includes(sort) ? sort : "createdAt";
    const sortOrder = order === "asc" ? "asc" : "desc";

    const where = {
      ...(search && {
        name: { contains: search, mode: "insensitive" },
      }),
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          owner: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          _count: { select: { tasks: true, members: true } },
        },
        orderBy: { [sortField]: sortOrder },
        skip,
        take: limitNum,
      }),
      prisma.project.count({ where }),
    ]);

    const doneCounts = await prisma.task.groupBy({
      by: ["projectId", "status"],
      where: { projectId: { in: projects.map((p) => p.id) } },
      _count: { _all: true },
    });

    const doneMap = {};
    doneCounts.forEach((entry) => {
      if (entry.status === "DONE") {
        doneMap[entry.projectId] = entry._count._all;
      }
    });

    const formattedProjects = projects.map((p) => ({
      id: p.id,
      name: p.name,
      owner: p.owner,
      memberCount: p._count.members,
      taskCount: p._count.tasks,
      completedTaskCount: doneMap[p.id] || 0,
      completionPercent: p._count.tasks
        ? Math.round(((doneMap[p.id] || 0) / p._count.tasks) * 100)
        : 0,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: {
        projects: formattedProjects,
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


// ============================================================
// GET PROJECT DELETION IMPACT
// GET /api/v1/admin/projects/:projectId/deletion-impact
// ============================================================

export const getProjectDeletionImpact = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, name: true },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const [taskCount, memberCount, commentCount, attachmentCount] =
      await Promise.all([
        prisma.task.count({ where: { projectId } }),
        prisma.projectMember.count({ where: { projectId } }),
        prisma.comment.count({ where: { task: { projectId } } }),
        prisma.attachment.count({ where: { task: { projectId } } }),
      ]);

    return res.status(200).json({
      success: true,
      message: "Project deletion impact fetched successfully",
      data: {
        project,
        impact: { taskCount, memberCount, commentCount, attachmentCount },
      },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// DELETE PROJECT (admin — bypass ownership check)
// DELETE /api/v1/admin/projects/:projectId
// ============================================================

export const deleteProjectAdmin = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await prisma.project.delete({ where: { id: projectId } });

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// GET ALL TASKS (admin — toutes les tâches, tous projets)
// GET /api/v1/admin/tasks
// ============================================================

export const getAllTasksAdmin = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      projectId,
      assigneeId,
      search,
      page = 1,
      limit = 20,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const allowedStatuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
    const allowedPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
    const allowedSortFields = ["createdAt", "dueDate", "priority", "title"];

    const sortField = allowedSortFields.includes(sort) ? sort : "createdAt";
    const sortOrder = order === "asc" ? "asc" : "desc";

    const where = {
      ...(status && allowedStatuses.includes(status) && { status }),
      ...(priority && allowedPriorities.includes(priority) && { priority }),
      ...(projectId && { projectId }),
      ...(assigneeId && { assigneeId }),
      ...(search && {
        title: { contains: search, mode: "insensitive" },
      }),
    };

    const [tasks, total, statusCounts] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          project: { select: { id: true, name: true } },
          assignee: { select: { id: true, firstName: true, lastName: true } },
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