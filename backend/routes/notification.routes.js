// routes/notification.routes.js
import { Router } from "express";

import {
  getMyNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notification.controller.js";

import authorize from "../middlewares/auth.middleware.js";

const notificationRouter = new Router();


// Get all notifications (paginated, filterable)
notificationRouter.get(
  "/notifications",
  authorize,
  getMyNotifications
);


// Get unread notifications only
notificationRouter.get(
  "/notifications/unread",
  authorize,
  getUnreadNotifications
);


// Get unread count (for the bell badge)
notificationRouter.get(
  "/notifications/unread-count",
  authorize,
  getUnreadCount
);


// Mark a single notification as read
notificationRouter.patch(
  "/notifications/:notificationId/read",
  authorize,
  markAsRead
);


// Mark all as read
notificationRouter.patch(
  "/notifications/read-all",
  authorize,
  markAllAsRead
);

 
// Delete a single notification
notificationRouter.delete(
  "/notifications/:notificationId",
  authorize,
  deleteNotification
);


// Delete all (or all read) notifications
notificationRouter.delete(
  "/notifications",
  authorize,
  deleteAllNotifications
);


export default notificationRouter;