// controllers/notification.controller.js
import prisma from "../config/prisma.js";


// ============================================================
// GET MY NOTIFICATIONS
// GET /api/v1/notifications
// ============================================================

export const getMyNotifications = async (req, res, next) => {

  try {

    const userId = req.user.id;

    const {
      page = 1,
      limit = 20,
      isRead,
      type,
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;


    const where = {
      userId,

      ...(isRead !== undefined && {
        isRead: isRead === "true",
      }),

      ...(type && {
        type,
      }),
    };


    const [notifications, total, unreadCount] = await Promise.all([

      prisma.notification.findMany({
        where,

        include: {
          actor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },

          project: {
            select: {
              id: true,
              name: true,
            },
          },

          task: {
            select: {
              id: true,
              title: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },

        skip,
        take: limitNum,
      }),

      prisma.notification.count({ where }),

      prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ]);


    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: {
        notifications,
        unreadCount,
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
// GET UNREAD NOTIFICATIONS
// GET /api/v1/notifications/unread
// ============================================================

export const getUnreadNotifications = async (req, res, next) => {

  try {

    const userId = req.user.id;

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        isRead: false,
      },

      include: {
        actor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },

        project: {
          select: {
            id: true,
            name: true,
          },
        },

        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 50,
    });


    return res.status(200).json({
      success: true,
      message: "Unread notifications fetched successfully",
      data: {
        notifications,
        count: notifications.length,
      },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// GET UNREAD COUNT (lightweight, for the bell badge)
// GET /api/v1/notifications/unread-count
// ============================================================

export const getUnreadCount = async (req, res, next) => {

  try {

    const userId = req.user.id;

    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });


    return res.status(200).json({
      success: true,
      message: "Unread count fetched successfully",
      data: {
        count,
      },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// MARK AS READ
// PATCH /api/v1/notifications/:notificationId/read
// ============================================================

export const markAsRead = async (req, res, next) => {

  try {

    const { notificationId } = req.params;
    const userId = req.user.id;


    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this notification",
      });
    }


    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });


    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: {
        notification: updated,
      },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// MARK ALL AS READ
// PATCH /api/v1/notifications/read-all
// ============================================================

export const markAllAsRead = async (req, res, next) => {

  try {

    const userId = req.user.id;

    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });


    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: {
        updatedCount: result.count,
      },
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// DELETE NOTIFICATION
// DELETE /api/v1/notifications/:notificationId
// ============================================================

export const deleteNotification = async (req, res, next) => {

  try {

    const { notificationId } = req.params;
    const userId = req.user.id;


    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this notification",
      });
    }


    await prisma.notification.delete({
      where: { id: notificationId },
    });


    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });

  } catch (err) {
    next(err);
  }
};


// ============================================================
// DELETE ALL NOTIFICATIONS
// DELETE /api/v1/notifications
// ============================================================

export const deleteAllNotifications = async (req, res, next) => {

  try {

    const userId = req.user.id;

    const { onlyRead } = req.query;

    const result = await prisma.notification.deleteMany({
      where: {
        userId,
        ...(onlyRead === "true" && { isRead: true }),
      },
    });


    return res.status(200).json({
      success: true,
      message: "Notifications deleted successfully",
      data: {
        deletedCount: result.count,
      },
    });

  } catch (err) {
    next(err);
  }
};