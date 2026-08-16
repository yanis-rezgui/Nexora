// Contexts/NotificationsContext.tsx
import { createContext, useContext, useState } from "react";
import type {
  ApiResponse,
  Notification,
  NotificationType,
  Pagination,
} from "../Types/Types";


// ============================================================
// TYPES
// ============================================================

interface GetNotificationsParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: NotificationType;
}


// ============================================================
// CONTEXT TYPE
// ============================================================

interface NotificationsContextType {

  notifications: Notification[];
  loadingNotifications: boolean;
  pagination: Pagination | null;

  unreadCount: number;
  loadingUnreadCount: boolean;

  errorMsg: string | null;

  getMyNotifications: (params?: GetNotificationsParams) => Promise<void>;

  getUnreadCount: () => Promise<void>;

  markAsRead: (notificationId: string) => Promise<void>;
  loadingMarkAsRead: boolean;

  markAllAsRead: () => Promise<void>;
  loadingMarkAllAsRead: boolean;

  deleteNotification: (notificationId: string) => Promise<void>;
  loadingDeleteNotification: boolean;

  deleteAllNotifications: (onlyRead?: boolean) => Promise<void>;
  loadingDeleteAllNotifications: boolean;
}


// ============================================================
// CONTEXT
// ============================================================

const NotificationsContext = createContext<NotificationsContextType | null>(null);


// ============================================================
// PROVIDER
// ============================================================

export const NotificationsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loadingUnreadCount, setLoadingUnreadCount] = useState<boolean>(false);

  const [loadingMarkAsRead, setLoadingMarkAsRead] = useState<boolean>(false);
  const [loadingMarkAllAsRead, setLoadingMarkAllAsRead] = useState<boolean>(false);
  const [loadingDeleteNotification, setLoadingDeleteNotification] = useState<boolean>(false);
  const [loadingDeleteAllNotifications, setLoadingDeleteAllNotifications] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);


  // ==========================================================
  // GET MY NOTIFICATIONS
  // ==========================================================

  const getMyNotifications = async (
    params?: GetNotificationsParams
  ) => {

    try {

      setLoadingNotifications(true);

      const query = new URLSearchParams();

      if (params?.page) query.set("page", String(params.page));
      if (params?.limit) query.set("limit", String(params.limit));
      if (params?.isRead !== undefined) query.set("isRead", String(params.isRead));
      if (params?.type) query.set("type", params.type);

      const queryString = query.toString();

      const res = await fetch(
        `http://localhost:5000/api/v1/notifications${queryString ? `?${queryString}` : ""}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data: ApiResponse<{
        notifications: Notification[];
        unreadCount: number;
        pagination: Pagination;
      }> = await res.json();

      if (!res.ok || !data.data) {

        setErrorMsg(
          data.message || "Error in fetching notifications"
        );

        throw new Error(
          data.message || "Error in fetching notifications"
        );
      }

      setNotifications(data.data.notifications);
      setUnreadCount(data.data.unreadCount);
      setPagination(data.data.pagination);

      setErrorMsg(null);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingNotifications(false);

    }
  };


  // ==========================================================
  // GET UNREAD COUNT (lightweight, for the bell badge)
  // ==========================================================

  const getUnreadCount = async () => {

    try {

      setLoadingUnreadCount(true);

      const res = await fetch(
        "http://localhost:5000/api/v1/notifications/unread-count",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data: ApiResponse<{ count: number }> = await res.json();

      if (!res.ok || !data.data) {
        throw new Error(data.message || "Error in fetching unread count");
      }

      setUnreadCount(data.data.count);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingUnreadCount(false);

    }
  };


  // ==========================================================
  // MARK AS READ
  // ==========================================================

  const markAsRead = async (
    notificationId: string
  ) => {

    try {

      setLoadingMarkAsRead(true);

      const res = await fetch(
        `http://localhost:5000/api/v1/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data: ApiResponse<{ notification: Notification }> = await res.json();

      if (!res.ok || !data.data) {

        setErrorMsg(
          data.message || "Error in marking notification as read"
        );

        throw new Error(
          data.message || "Error in marking notification as read"
        );
      }

      const updated = data.data.notification;

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId
            ? { ...n, ...updated }
            : n
        )
      );

      setUnreadCount(prev => Math.max(0, prev - 1));

      setErrorMsg(null);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingMarkAsRead(false);

    }
  };


  // ==========================================================
  // MARK ALL AS READ
  // ==========================================================

  const markAllAsRead = async () => {

    try {

      setLoadingMarkAllAsRead(true);

      const res = await fetch(
        "http://localhost:5000/api/v1/notifications/read-all",
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data: ApiResponse<{ updatedCount: number }> = await res.json();

      if (!res.ok) {

        setErrorMsg(
          data.message || "Error in marking all notifications as read"
        );

        throw new Error(
          data.message || "Error in marking all notifications as read"
        );
      }

      const now = new Date().toISOString();

      setNotifications(prev =>
        prev.map(n =>
          n.isRead ? n : { ...n, isRead: true, readAt: now }
        )
      );

      setUnreadCount(0);

      setErrorMsg(null);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingMarkAllAsRead(false);

    }
  };


  // ==========================================================
  // DELETE NOTIFICATION
  // ==========================================================

  const deleteNotification = async (
    notificationId: string
  ) => {

    try {

      setLoadingDeleteNotification(true);

      const res = await fetch(
        `http://localhost:5000/api/v1/notifications/${notificationId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data: ApiResponse<null> = await res.json();

      if (!res.ok) {

        setErrorMsg(
          data.message || "Error in deleting notification"
        );

        throw new Error(
          data.message || "Error in deleting notification"
        );
      }

      const removed = notifications.find(n => n.id === notificationId);

      setNotifications(prev =>
        prev.filter(n => n.id !== notificationId)
      );

      if (removed && !removed.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      setErrorMsg(null);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingDeleteNotification(false);

    }
  };


  // ==========================================================
  // DELETE ALL NOTIFICATIONS
  // ==========================================================

  const deleteAllNotifications = async (
    onlyRead?: boolean
  ) => {

    try {

      setLoadingDeleteAllNotifications(true);

      const query = onlyRead ? "?onlyRead=true" : "";

      const res = await fetch(
        `http://localhost:5000/api/v1/notifications${query}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data: ApiResponse<{ deletedCount: number }> = await res.json();

      if (!res.ok) {

        setErrorMsg(
          data.message || "Error in deleting notifications"
        );

        throw new Error(
          data.message || "Error in deleting notifications"
        );
      }

      setNotifications(prev =>
        onlyRead ? prev.filter(n => !n.isRead) : []
      );

      if (!onlyRead) {
        setUnreadCount(0);
      }

      setErrorMsg(null);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingDeleteAllNotifications(false);

    }
  };


  // ==========================================================
  // PROVIDER
  // ==========================================================

  return (
    <NotificationsContext.Provider
      value={{

        notifications,
        loadingNotifications,
        pagination,

        unreadCount,
        loadingUnreadCount,

        errorMsg,

        getMyNotifications,
        getUnreadCount,

        markAsRead,
        loadingMarkAsRead,

        markAllAsRead,
        loadingMarkAllAsRead,

        deleteNotification,
        loadingDeleteNotification,

        deleteAllNotifications,
        loadingDeleteAllNotifications,

      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};


// ============================================================
// HOOK
// ============================================================

export const useNotificationsContext = () => {

  const context = useContext(NotificationsContext);

  if (!context) {

    throw new Error(
      "Please use the useNotificationsContext hook inside a NotificationsProvider"
    );

  }

  return context;
};