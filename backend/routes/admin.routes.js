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

const adminRouter = Router();

// Toutes les routes admin exigent d'être connecté ET d'avoir le rôle ADMIN
adminRouter.use(authorize, isAdmin);

adminRouter.get("/admin/dashboard", getAdminDashboardStats);
adminRouter.get("/admin/analytics", getAdminAnalytics);

adminRouter.get("/admin/users", getAllUsers);
adminRouter.get("/admin/users/:userId", getUserByIdAdmin);
adminRouter.patch("/admin/users/:userId/role", updateUserRole);
adminRouter.patch("/admin/users/:userId/suspend", suspendUser);
adminRouter.patch("/admin/users/:userId/unsuspend", unsuspendUser);
adminRouter.get("/admin/users/:userId/sessions", getUserSessions);
adminRouter.delete("/admin/users/:userId/sessions", revokeUserSessions);

adminRouter.get("/admin/projects", getAllProjectsAdmin);
adminRouter.get("/admin/projects/:projectId/deletion-impact", getProjectDeletionImpact);
adminRouter.delete("/admin/projects/:projectId", deleteProjectAdmin);

adminRouter.get("/admin/tasks", getAllTasksAdmin);

export default adminRouter;