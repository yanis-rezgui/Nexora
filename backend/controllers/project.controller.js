// controllers/project.controller.js
import prisma from "../config/prisma.js";



// ============================================================
// GET /projects
// ============================================================

export const getProjects = async (req, res, next) => {
  try {
    const userId = req.user.id;

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

    // ------------------------------------------------------------
    // A user has access to a project if he's the owner OR a member
    // ------------------------------------------------------------

    const where = {
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
      ...(search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {}),
    };


    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          members: {
            where: { userId },
            select: { role: true },
          },
          _count: {
            select: { tasks: true, members: true },
          },
        },
        orderBy: { [sortField]: sortOrder },
        skip,
        take: limitNum,
      }),
      prisma.project.count({ where }),
    ]);


    const formattedProjects = projects.map((project) => {
      const isOwner = project.ownerId === userId;
      const memberRole = project.members[0]?.role ?? null;

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        ownerId: project.ownerId,
        role: isOwner ? "OWNER" : memberRole,
        taskCount: project._count.tasks,
        memberCount: project._count.members,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      };
    });


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
// POST /projects
// ============================================================

export const createProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Project name must contain between 2 and 100 characters",
      });
    }


    const project = await prisma.$transaction(async (tx) => {

      const newProject = await tx.project.create({
        data: {
          name: trimmedName,
          description: description?.trim() || null,
          ownerId: userId,
        },
      });

      // Owner is always added as a project member with MANAGER role
      await tx.projectMember.create({
        data: {
          projectId: newProject.id,
          userId,
          role: "MANAGER",
        },
      });

      await tx.activityLog.create({
        data: {
          projectId: newProject.id,
          userId,
          action: "CREATED",
          entityType: "PROJECT",
          entityId: newProject.id,
        },
      });

      return newProject;
    });


    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: {
        project: {
          id: project.id,
          name: project.name,
          description: project.description,
          ownerId: project.ownerId,
          role: "OWNER",
          taskCount: 0,
          memberCount: 1,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        },
      },
    });

  } catch (err) {
    next(err);
  }
};



// ============================================================
// GET /projects/:projectId
// ============================================================

export const getProjectById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: { tasks: true },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isOwner = project.ownerId === userId;
    const membership = project.members.find((m) => m.userId === userId);

    // Access check: must be owner or member
    if (!isOwner && !membership) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this project",
      });
    }


    return res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      data: {
        project: {
          id: project.id,
          name: project.name,
          description: project.description,
          ownerId: project.ownerId,
          role: isOwner ? "OWNER" : membership.role,
          taskCount: project._count.tasks,
          members: project.members.map((m) => ({
            id: m.id,
            userId: m.userId,
            role: m.role,
            joinedAt: m.joinedAt,
            user: m.user,
          })),
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        },
      },
    });

  } catch (err) {
    next(err);
  }
};



// ============================================================
// PATCH /projects/:projectId
// ============================================================

export const updateProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;
    const { name, description } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: {
          where: { userId },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isOwner = project.ownerId === userId;
    const membership = project.members[0];
    const isManager = membership?.role === "MANAGER";

    // Only OWNER or MANAGER can update project info
    if (!isOwner && !isManager) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this project",
      });
    }

    if (name === undefined && description === undefined) {
      return res.status(400).json({
        success: false,
        message: "At least one field (name or description) is required",
      });
    }

    const data = {};

    if (name !== undefined) {
      const trimmedName = name.trim();

      if (trimmedName.length < 2 || trimmedName.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Project name must contain between 2 and 100 characters",
        });
      }

      data.name = trimmedName;
    }

    if (description !== undefined) {
      data.description = description?.trim() || null;
    }


    const updatedProject = await prisma.$transaction(async (tx) => {

      const updated = await tx.project.update({
        where: { id: projectId },
        data,
      });

      await tx.activityLog.create({
        data: {
          projectId: updated.id,
          userId,
          action: "UPDATED",
          entityType: "PROJECT",
          entityId: updated.id,
          metadata: data,
        },
      });

      return updated;
    });


    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: {
        project: {
          id: updatedProject.id,
          name: updatedProject.name,
          description: updatedProject.description,
          ownerId: updatedProject.ownerId,
          role: isOwner ? "OWNER" : membership.role,
          createdAt: updatedProject.createdAt,
          updatedAt: updatedProject.updatedAt,
        },
      },
    });

  } catch (err) {
    next(err);
  }
};



// ============================================================
// DELETE /projects/:projectId
// ============================================================

export const deleteProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
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

    // Only the OWNER can delete a project (cascades to members, tasks, labels, logs)
    if (project.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only the project owner can delete this project",
      });
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });

  } catch (err) {
    next(err);
  }
};