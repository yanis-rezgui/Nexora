import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import { NODE_ENV } from "../config/env.js";
import { generateTokens, setCookies } from "./auth.controller.js";

const NOTIFICATION_FIELDS = [
  "notifyTaskAssigned",
  "notifyTaskUpdated",
  "notifyComments",
  "notifyMentions",
  "notifyProjectActivity",
  "notifyDeadlines",
  "notifyEmail",
];

// ============================================================
// PATCH /settings/profile
// ============================================================

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "First name and last name are required",
      });
    }

    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName.trim();

    if (normalizedFirstName.length < 2 || normalizedFirstName.length > 50) {
      return res.status(400).json({
        success: false,
        message: "First name must contain between 2 and 50 characters",
      });
    }

    if (normalizedLastName.length < 2 || normalizedLastName.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Last name must contain between 2 and 50 characters",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
      },
    });

    const userResponse = {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user: userResponse },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// PATCH /settings/password
// ============================================================

export const updatePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword1, newPassword2 } = req.body;

    if (!currentPassword || !newPassword1 || !newPassword2) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword1 !== newPassword2) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword1)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, existingUser.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const isSameAsOld = await bcrypt.compare(newPassword1, existingUser.passwordHash);

    if (isSameAsOld) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the current password",
      });
    }

    const passwordHash = await bcrypt.hash(newPassword1, 12);

    // Le changement de mot de passe révoque toutes les sessions existantes
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      }),
      prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    // On réémet des tokens frais pour garder la session courante active
    const { accessToken, refreshToken } = generateTokens(userId);
    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
      data: { userId, token: refreshToken, expiresAt: refreshTokenExpiresAt },
    });

    setCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// GET /settings/notifications
// ============================================================

export const getNotificationPreferences = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: Object.fromEntries(NOTIFICATION_FIELDS.map((f) => [f, true])),
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Notification preferences fetched successfully",
      data: { preferences: user },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// PATCH /settings/notifications
// ============================================================

export const updateNotificationPreferences = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const body = req.body;

    const data = {};

    for (const field of NOTIFICATION_FIELDS) {
      if (typeof body[field] === "boolean") {
        data[field] = body[field];
      }
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one valid preference is required",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: Object.fromEntries(NOTIFICATION_FIELDS.map((f) => [f, true])),
    });

    return res.status(200).json({
      success: true,
      message: "Notification preferences updated successfully",
      data: { preferences: updatedUser },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// DELETE /settings/account
// ============================================================

export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required to delete your account",
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, existingUser.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Un owner de projet doit d'abord transférer/supprimer ses projets
    const ownedProjectsCount = await prisma.project.count({ where: { ownerId: userId } });

    if (ownedProjectsCount > 0) {
      return res.status(409).json({
        success: false,
        message:
          "You still own projects. Transfer ownership or delete them before deleting your account.",
      });
    }

    await prisma.user.delete({ where: { id: userId } });

    const cookieOptions = {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });

  } catch (err) {
    next(err);
  }
};