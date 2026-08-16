// controllers/activity.controller.js
import prisma from "../config/prisma.js";

export const getProjectActivity = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const { page = 1, limit = 30 } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 30;
    const skip = (pageNum - 1) * limitNum;

    // ------------------------------------------------------------
    // Check project + access
    // ------------------------------------------------------------

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, ownerId: true },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isOwner = project.ownerId === userId;

    if (!isOwner) {
      const membership = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: { projectId, userId },
        },
      });

      if (!membership) {
        return res.status(403).json({
          success: false,
          message: "You do not have access to this project",
        });
      }
    }

    // ------------------------------------------------------------
    // Fetch logs
    // ------------------------------------------------------------

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where: { projectId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.activityLog.count({ where: { projectId } }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Project activity fetched successfully",
      data: {
        logs,
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