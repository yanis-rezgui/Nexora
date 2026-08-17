// controllers/members.controller.js

import prisma from "../config/prisma.js";
import {
  createMemberAddedNotification,
  createMemberRemovedNotification,
} from "../services/notificationService.js";

// ============================================================
// GET PROJECT MEMBERS
// ============================================================

export const getProjectMembers = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    // ------------------------------------------------------------
    // Check project
    // ------------------------------------------------------------

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
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // ------------------------------------------------------------
    // Check user membership
    // ------------------------------------------------------------

    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    const isOwner = project.ownerId === userId;

    if (!membership && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this project",
      });
    }

    // ------------------------------------------------------------
    // Get project members
    // ------------------------------------------------------------

    // ------------------------------------------------------------
    // Get project members
    // ------------------------------------------------------------

    const members = await prisma.projectMember.findMany({
      where: {
        projectId,
        userId: { not: project.ownerId }, // ← exclut le owner, il est ajouté manuellement plus bas
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        joinedAt: "asc",
      },
    });

    // ------------------------------------------------------------
    // Add owner to members
    // ------------------------------------------------------------

    const owner = await prisma.user.findUnique({
      where: {
        id: project.ownerId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const formattedMembers = [
      {
        id: owner.id,
        firstName: owner.firstName,
        lastName: owner.lastName,
        email: owner.email,
        role: "OWNER",
        joinedAt: null,
      },
      ...members.map((member) => ({
        id: member.user.id,
        firstName: member.user.firstName,
        lastName: member.user.lastName,
        email: member.user.email,
        role: member.role,
        joinedAt: member.joinedAt,
      })),
    ];

    return res.status(200).json({
      success: true,
      message: "Project members retrieved successfully",
      data: {
        members: formattedMembers,
        count: formattedMembers.length,
      },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// ADD PROJECT MEMBER
// ============================================================

export const addProjectMember = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { email, role = "DEVELOPER" } = req.body;
    const userId = req.user.id;

    // ------------------------------------------------------------
    // Validate input
    // ------------------------------------------------------------

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    if (!["MANAGER", "DEVELOPER"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project role",
      });
    }

    // ------------------------------------------------------------
    // Check project
    // ------------------------------------------------------------

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
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // ------------------------------------------------------------
    // Check requester permissions
    // ------------------------------------------------------------

    const requesterMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    const isOwner = project.ownerId === userId;
    const isManager = requesterMembership?.role === "MANAGER";

    if (!isOwner && !isManager) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to add members",
      });
    }

    // ------------------------------------------------------------
    // Find user
    // ------------------------------------------------------------

    const user = await prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    // ------------------------------------------------------------
    // Cannot add owner as member
    // ------------------------------------------------------------

    if (user.id === project.ownerId) {
      return res.status(400).json({
        success: false,
        message: "The project owner is already a project member",
      });
    }

    // ------------------------------------------------------------
    // Check existing membership
    // ------------------------------------------------------------

    const existingMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: user.id,
        },
      },
    });

    if (existingMembership) {
      return res.status(409).json({
        success: false,
        message: "User is already a member of this project",
      });
    }

    // ------------------------------------------------------------
    // Create membership
    // ------------------------------------------------------------

    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId: user.id,
        role,
      },
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
    });

    // --------------------------------------------------------
    // NOTIFY
    // --------------------------------------------------------

    await createMemberAddedNotification({
      projectId,
      projectName: project.name,
      newMemberId: user.id,
      actor: req.user,
    });

    return res.status(201).json({
      success: true,
      message: "Member added successfully",
      data: {
        member: {
          id: member.user.id,
          firstName: member.user.firstName,
          lastName: member.user.lastName,
          email: member.user.email,
          role: member.role,
          joinedAt: member.joinedAt,
        },
      },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// UPDATE PROJECT MEMBER ROLE
// ============================================================

export const updateProjectMemberRole = async (req, res, next) => {
  try {
    const { projectId, memberId } = req.params;
    const { role } = req.body;
    const userId = req.user.id;

    // ------------------------------------------------------------
    // Validate role
    // ------------------------------------------------------------

    if (!["MANAGER", "DEVELOPER"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project role",
      });
    }

    // ------------------------------------------------------------
    // Check project
    // ------------------------------------------------------------

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
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // ------------------------------------------------------------
    // Only OWNER can change roles
    // ------------------------------------------------------------

    if (project.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only the project owner can change member roles",
      });
    }

    // ------------------------------------------------------------
    // Find member
    // ------------------------------------------------------------

    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: memberId,
        },
      },
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
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Project member not found",
      });
    }

    // ------------------------------------------------------------
    // Update role
    // ------------------------------------------------------------

    const updatedMember = await prisma.projectMember.update({
      where: {
        id: membership.id,
      },
      data: {
        role,
      },
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
    });

    return res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      data: {
        member: {
          id: updatedMember.user.id,
          firstName: updatedMember.user.firstName,
          lastName: updatedMember.user.lastName,
          email: updatedMember.user.email,
          role: updatedMember.role,
          joinedAt: updatedMember.joinedAt,
        },
      },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// REMOVE PROJECT MEMBER
// ============================================================

export const removeProjectMember = async (req, res, next) => {
  try {
    const { projectId, memberId } = req.params;
    const userId = req.user.id;

    // ------------------------------------------------------------
    // Check project
    // ------------------------------------------------------------

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
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // ------------------------------------------------------------
    // Check requester permissions
    // ------------------------------------------------------------

    const requesterMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    const isOwner = project.ownerId === userId;
    const isManager = requesterMembership?.role === "MANAGER";

    if (!isOwner && !isManager) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to remove members",
      });
    }

    // ------------------------------------------------------------
    // Cannot remove owner
    // ------------------------------------------------------------

    if (memberId === project.ownerId) {
      return res.status(400).json({
        success: false,
        message: "The project owner cannot be removed",
      });
    }

    // ------------------------------------------------------------
    // Find member
    // ------------------------------------------------------------

    const membership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: memberId,
        },
      },
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Project member not found",
      });
    }

    // ------------------------------------------------------------
    // Manager restrictions
    // ------------------------------------------------------------

    // A MANAGER cannot remove another MANAGER.
    if (isManager && membership.role === "MANAGER") {
      return res.status(403).json({
        success: false,
        message: "Managers cannot remove other managers",
      });
    }

    // ------------------------------------------------------------
    // Remove member
    // ------------------------------------------------------------

    await prisma.projectMember.delete({
      where: {
        id: membership.id,
      },
    });

    // --------------------------------------------------------
    // NOTIFY
    // --------------------------------------------------------

    await createMemberRemovedNotification({
      projectId,
      projectName: project.name,
      removedMemberId: memberId,
      actor: req.user,
    });

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });

  } catch (err) {
    next(err);
  }
};