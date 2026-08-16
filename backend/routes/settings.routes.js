import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js"; // adapte le nom si différent chez toi
import {
  updateProfile,
  updatePassword,
  getNotificationPreferences,
  updateNotificationPreferences,
  deleteAccount,
} from "../controllers/settings.controller.js";

const settingsRouter = Router();

settingsRouter.patch("/settings/profile", authMiddleware, updateProfile);
settingsRouter.patch("/settings/password", authMiddleware, updatePassword);
settingsRouter.get("/settings/notifications", authMiddleware, getNotificationPreferences);
settingsRouter.patch("/settings/notifications", authMiddleware, updateNotificationPreferences);
settingsRouter.delete("/settings/account", authMiddleware, deleteAccount);

export default settingsRouter;