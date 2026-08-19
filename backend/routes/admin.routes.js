// routes/admin.routes.js
import { Router } from "express";
import { isAdmin } from "../middlewares/admin.middleware.js";

import authorize from "../middlewares/auth.middleware.js";

import {
  getAdminDashboardStats,
  getAdminAnalytics,
  getAllUsers,
  getUserByIdAdmin,
  updateUserRole,
  suspendUser,
  unsuspendUser,
  getUserSessions,
  revokeUserSessions,
  getAllProjectsAdmin,
  getProjectDeletionImpact,
  deleteProjectAdmin,
  getAllTasksAdmin,
} from "../controllers/admin.controller.js";

const router = Router();

// Toutes les routes admin exigent d'être connecté ET d'avoir le rôle ADMIN
router.use(authorize, isAdmin);

router.get("/admin/dashboard", getAdminDashboardStats);
router.get("/admin/analytics", getAdminAnalytics);

router.get("/admin/users", getAllUsers);
router.get("/admin/users/:userId", getUserByIdAdmin);
router.patch("/admin/users/:userId/role", updateUserRole);
router.patch("/admin/users/:userId/suspend", suspendUser);
router.patch("/admin/users/:userId/unsuspend", unsuspendUser);
router.get("/admin/users/:userId/sessions", getUserSessions);
router.delete("/admin/users/:userId/sessions", revokeUserSessions);

router.get("/admin/projects", getAllProjectsAdmin);
router.get("/admin/projects/:projectId/deletion-impact", getProjectDeletionImpact);
router.delete("/admin/projects/:projectId", deleteProjectAdmin);

router.get("/admin/tasks", getAllTasksAdmin);

export default router;