// Contexts/AdminContext.tsx
import { createContext, useContext, useState } from "react";
import type {
  ApiResponse,
  Pagination,
  AdminDashboardOverview,
  AdminUserListItem,
  AdminUserDetails,
  AdminSession,
  AdminProjectListItem,
  ProjectDeletionImpact,
  AdminTaskListItem,
  AdminAnalytics,
  UserRole,
  TaskStatus,
  TaskPriority,
  TaskStatusCounts,
} from "../Types/Types";


// ============================================================
// PARAMS
// ============================================================

interface GetUsersParams {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

interface GetAdminProjectsParams {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

interface GetAdminTasksParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  assigneeId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}


// ============================================================
// CONTEXT TYPE
// ============================================================

interface AdminContextType {

  overview: AdminDashboardOverview | null;
  loadingOverview: boolean;
  getAdminDashboard: () => Promise<void>;

  analytics: AdminAnalytics | null;
  loadingAnalytics: boolean;
  getAdminAnalytics: () => Promise<void>;

  users: AdminUserListItem[];
  usersPagination: Pagination | null;
  loadingUsers: boolean;
  getAllUsers: (params?: GetUsersParams) => Promise<void>;

  currentUser: AdminUserDetails | null;
  loadingCurrentUser: boolean;
  getUserById: (userId: string) => Promise<void>;

  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
  loadingUpdateUserRole: boolean;

  suspendUser: (userId: string) => Promise<void>;
  loadingSuspendUser: boolean;

  unsuspendUser: (userId: string) => Promise<void>;
  loadingUnsuspendUser: boolean;

  sessions: AdminSession[];
  loadingSessions: boolean;
  getUserSessions: (userId: string) => Promise<void>;

  revokeUserSessions: (userId: string) => Promise<void>;
  loadingRevokeSessions: boolean;

  projects: AdminProjectListItem[];
  projectsPagination: Pagination | null;
  loadingProjects: boolean;
  getAllProjects: (params?: GetAdminProjectsParams) => Promise<void>;

  deletionImpact: ProjectDeletionImpact | null;
  loadingDeletionImpact: boolean;
  getProjectDeletionImpact: (projectId: string) => Promise<void>;

  deleteProject: (projectId: string) => Promise<void>;
  loadingDeleteProject: boolean;

  tasks: AdminTaskListItem[];
  tasksPagination: Pagination | null;
  tasksCounts: TaskStatusCounts | null;
  loadingTasks: boolean;
  getAllTasks: (params?: GetAdminTasksParams) => Promise<void>;

  errorMsg: string | null;
}

const AdminContext = createContext<AdminContextType | null>(null);


// ============================================================
// PROVIDER
// ============================================================

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {

  const [overview, setOverview] = useState<AdminDashboardOverview | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(false);

  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [usersPagination, setUsersPagination] = useState<Pagination | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [currentUser, setCurrentUser] = useState<AdminUserDetails | null>(null);
  const [loadingCurrentUser, setLoadingCurrentUser] = useState(false);

  const [loadingUpdateUserRole, setLoadingUpdateUserRole] = useState(false);
  const [loadingSuspendUser, setLoadingSuspendUser] = useState(false);
  const [loadingUnsuspendUser, setLoadingUnsuspendUser] = useState(false);

  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingRevokeSessions, setLoadingRevokeSessions] = useState(false);

  const [projects, setProjects] = useState<AdminProjectListItem[]>([]);
  const [projectsPagination, setProjectsPagination] = useState<Pagination | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const [deletionImpact, setDeletionImpact] = useState<ProjectDeletionImpact | null>(null);
  const [loadingDeletionImpact, setLoadingDeletionImpact] = useState(false);
  const [loadingDeleteProject, setLoadingDeleteProject] = useState(false);

  const [tasks, setTasks] = useState<AdminTaskListItem[]>([]);
  const [tasksPagination, setTasksPagination] = useState<Pagination | null>(null);
  const [tasksCounts, setTasksCounts] = useState<TaskStatusCounts | null>(null);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);


  const getAdminDashboard = async () => {
    try {
      setLoadingOverview(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/dashboard`, {
        method: "GET",
        credentials: "include",
      });

      const data: ApiResponse<AdminDashboardOverview> = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in fetching admin dashboard");
        throw new Error(data.message || "Error in fetching admin dashboard");
      }

      setOverview(data.data);
      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOverview(false);
    }
  };


  const getAdminAnalytics = async () => {
    try {
      setLoadingAnalytics(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/analytics`, {
        method: "GET",
        credentials: "include",
      });

      const data: ApiResponse<AdminAnalytics> = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in fetching analytics");
        throw new Error(data.message || "Error in fetching analytics");
      }

      setAnalytics(data.data);
      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalytics(false);
    }
  };


  const getAllUsers = async (params?: GetUsersParams) => {
    try {
      setLoadingUsers(true);

      const query = new URLSearchParams();
      if (params?.search) query.set("search", params.search);
      if (params?.role) query.set("role", params.role);
      if (params?.isActive !== undefined) query.set("isActive", String(params.isActive));
      if (params?.page) query.set("page", String(params.page));
      if (params?.limit) query.set("limit", String(params.limit));
      if (params?.sort) query.set("sort", params.sort);
      if (params?.order) query.set("order", params.order);

      const queryString = query.toString();

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/users${queryString ? `?${queryString}` : ""}`,
        { method: "GET", credentials: "include" }
      );

      const data: ApiResponse<{ users: AdminUserListItem[]; pagination: Pagination }> =
        await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in fetching users");
        throw new Error(data.message || "Error in fetching users");
      }

      setUsers(data.data.users);
      setUsersPagination(data.data.pagination);
      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };


  const getUserById = async (userId: string) => {
    try {
      setLoadingCurrentUser(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}`, {
        method: "GET",
        credentials: "include",
      });

      const data: ApiResponse<{ user: AdminUserDetails }> = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in fetching user");
        throw new Error(data.message || "Error in fetching user");
      }

      setCurrentUser(data.data.user);
      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCurrentUser(false);
    }
  };


  const updateUserRole = async (userId: string, role: UserRole) => {
    try {
      setLoadingUpdateUserRole(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
        credentials: "include",
      });

      const data: ApiResponse<{ user: AdminUserDetails }> = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in updating user role");
        throw new Error(data.message || "Error in updating user role");
      }

      const updated = data.data.user;

      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: updated.role } : u)));
      setCurrentUser(prev => (prev && prev.id === userId ? { ...prev, role: updated.role } : prev));

      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUpdateUserRole(false);
    }
  };


  const suspendUser = async (userId: string) => {
    try {
      setLoadingSuspendUser(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}/suspend`, {
        method: "PATCH",
        credentials: "include",
      });

      const data: ApiResponse<{ user: AdminUserDetails }> = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in suspending user");
        throw new Error(data.message || "Error in suspending user");
      }

      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, isActive: false } : u)));
      setCurrentUser(prev => (prev && prev.id === userId ? { ...prev, isActive: false } : prev));

      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSuspendUser(false);
    }
  };


  const unsuspendUser = async (userId: string) => {
    try {
      setLoadingUnsuspendUser(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}/unsuspend`, {
        method: "PATCH",
        credentials: "include",
      });

      const data: ApiResponse<{ user: AdminUserDetails }> = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in unsuspending user");
        throw new Error(data.message || "Error in unsuspending user");
      }

      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, isActive: true } : u)));
      setCurrentUser(prev => (prev && prev.id === userId ? { ...prev, isActive: true } : prev));

      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUnsuspendUser(false);
    }
  };


  const getUserSessions = async (userId: string) => {
    try {
      setLoadingSessions(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}/sessions`, {
        method: "GET",
        credentials: "include",
      });

      const data: ApiResponse<{ sessions: AdminSession[] }> = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in fetching sessions");
        throw new Error(data.message || "Error in fetching sessions");
      }

      setSessions(data.data.sessions);
      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSessions(false);
    }
  };


  const revokeUserSessions = async (userId: string) => {
    try {
      setLoadingRevokeSessions(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/users/${userId}/sessions`, {
        method: "DELETE",
        credentials: "include",
      });

      const data: ApiResponse<{ revokedCount: number }> = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Error in revoking sessions");
        throw new Error(data.message || "Error in revoking sessions");
      }

      setSessions([]);
      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRevokeSessions(false);
    }
  };


  const getAllProjects = async (params?: GetAdminProjectsParams) => {
    try {
      setLoadingProjects(true);

      const query = new URLSearchParams();
      if (params?.search) query.set("search", params.search);
      if (params?.page) query.set("page", String(params.page));
      if (params?.limit) query.set("limit", String(params.limit));
      if (params?.sort) query.set("sort", params.sort);
      if (params?.order) query.set("order", params.order);

      const queryString = query.toString();

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/projects${queryString ? `?${queryString}` : ""}`,
        { method: "GET", credentials: "include" }
      );

      const data: ApiResponse<{ projects: AdminProjectListItem[]; pagination: Pagination }> =
        await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in fetching projects");
        throw new Error(data.message || "Error in fetching projects");
      }

      setProjects(data.data.projects);
      setProjectsPagination(data.data.pagination);
      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProjects(false);
    }
  };


  const getProjectDeletionImpact = async (projectId: string) => {
    try {
      setLoadingDeletionImpact(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/projects/${projectId}/deletion-impact`,
        { method: "GET", credentials: "include" }
      );

      const data: ApiResponse<ProjectDeletionImpact> = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in fetching deletion impact");
        throw new Error(data.message || "Error in fetching deletion impact");
      }

      setDeletionImpact(data.data);
      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDeletionImpact(false);
    }
  };


  const deleteProject = async (projectId: string) => {
    try {
      setLoadingDeleteProject(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/projects/${projectId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data: ApiResponse<null> = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Error in deleting project");
        throw new Error(data.message || "Error in deleting project");
      }

      setProjects(prev => prev.filter(p => p.id !== projectId));
      setDeletionImpact(null);
      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDeleteProject(false);
    }
  };


  const getAllTasks = async (params?: GetAdminTasksParams) => {
    try {
      setLoadingTasks(true);

      const query = new URLSearchParams();
      if (params?.status) query.set("status", params.status);
      if (params?.priority) query.set("priority", params.priority);
      if (params?.projectId) query.set("projectId", params.projectId);
      if (params?.assigneeId) query.set("assigneeId", params.assigneeId);
      if (params?.search) query.set("search", params.search);
      if (params?.page) query.set("page", String(params.page));
      if (params?.limit) query.set("limit", String(params.limit));
      if (params?.sort) query.set("sort", params.sort);
      if (params?.order) query.set("order", params.order);

      const queryString = query.toString();

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/tasks${queryString ? `?${queryString}` : ""}`,
        { method: "GET", credentials: "include" }
      );

      const data: ApiResponse<{
        tasks: AdminTaskListItem[];
        counts: TaskStatusCounts;
        pagination: Pagination;
      }> = await res.json();

      if (!res.ok || !data.data) {
        setErrorMsg(data.message || "Error in fetching tasks");
        throw new Error(data.message || "Error in fetching tasks");
      }

      setTasks(data.data.tasks);
      setTasksCounts(data.data.counts);
      setTasksPagination(data.data.pagination);
      setErrorMsg(null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTasks(false);
    }
  };


  return (
    <AdminContext.Provider
      value={{
        overview, loadingOverview, getAdminDashboard,
        analytics, loadingAnalytics, getAdminAnalytics,
        users, usersPagination, loadingUsers, getAllUsers,
        currentUser, loadingCurrentUser, getUserById,
        updateUserRole, loadingUpdateUserRole,
        suspendUser, loadingSuspendUser,
        unsuspendUser, loadingUnsuspendUser,
        sessions, loadingSessions, getUserSessions,
        revokeUserSessions, loadingRevokeSessions,
        projects, projectsPagination, loadingProjects, getAllProjects,
        deletionImpact, loadingDeletionImpact, getProjectDeletionImpact,
        deleteProject, loadingDeleteProject,
        tasks, tasksPagination, tasksCounts, loadingTasks, getAllTasks,
        errorMsg,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};


export const useAdminContext = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("Please use the useAdminContext hook inside an AdminProvider");
  }

  return context;
};