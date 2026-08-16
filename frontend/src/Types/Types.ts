// ============================================================
// ENUMS
// ============================================================

export type UserRole = "USER" | "ADMIN";

export type ProjectRole = "MANAGER" | "DEVELOPER";

export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "DONE";

export type TaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";



export type ActivityAction =
  | "CREATED"
  | "UPDATED"
  | "DELETED"
  | "ASSIGNED"
  | "UNASSIGNED"
  | "STATUS_CHANGED"
  | "COMMENTED"
  | "UPLOADED";

export type EntityType =
  | "PROJECT"
  | "TASK"
  | "COMMENT"
  | "ATTACHMENT"
  | "MEMBER"
  | "LABEL";


// ============================================================
// USER
// ============================================================

export interface User {
  id: string;

  firstName: string;
  lastName: string;
  email: string;

  role: UserRole;

  createdAt: string;
  updatedAt: string;
}


// ============================================================
// PROJECT
// ============================================================

export interface Project {
  id: string;

  name: string;
  description: string | null;

  ownerId: string;

  createdAt: string;
  updatedAt: string;
}


// ============================================================
// PROJECT MEMBER
// ============================================================

export interface ProjectMember {
  id: string;

  projectId: string;
  userId: string;

  role: ProjectRole;

  joinedAt: string;

  user?: User;
}


// ============================================================
// TASK
// ============================================================

export interface Task {
  id: string;

  projectId: string;

  title: string;
  description: string | null;

  status: TaskStatus;
  priority: TaskPriority;

  assigneeId: string | null;
  creatorId: string;

  dueDate: string | null;

  createdAt: string;
  updatedAt: string;

  assignee?: User;
  creator?: User;

  comments?: Comment[];
  attachments?: Attachment[];
  labels?: TaskLabel[];
}


// ============================================================
// COMMENT
// ============================================================

export interface Comment {
  id: string;

  taskId: string;
  authorId: string;

  content: string;

  createdAt: string;
  updatedAt: string;

  author?: User;
}


// ============================================================
// ATTACHMENT
// ============================================================

export interface Attachment {
  id: string;

  taskId: string;
  uploadedById: string;

  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;

  createdAt: string;

  uploadedBy?: User;
}


// ============================================================
// LABEL
// ============================================================

export interface Label {
  id: string;

  projectId: string;

  name: string;
  color: string;
}


// ============================================================
// TASK LABEL
// ============================================================

export interface TaskLabel {
  id: string;

  taskId: string;
  labelId: string;

  label?: Label;
}


// ============================================================
// NOTIFICATION
// ============================================================

export type NotificationType =
  | "INFO"
  | "SUCCESS"
  | "WARNING"
  | "ERROR"
  | "MEMBER_ADDED"
  | "MEMBER_REMOVED"
  | "TASK_ASSIGNED"
  | "TASK_UNASSIGNED"
  | "TASK_STATUS_CHANGED"
  | "TASK_DUE_SOON"
  | "TASK_OVERDUE"
  | "COMMENT_ADDED"
  | "COMMENT_MENTION";

export interface Notification {
  id: string;

  userId: string;
  type: NotificationType;

  title: string;
  message: string;

  projectId: string | null;
  taskId: string | null;
  actorId: string | null;

  isRead: boolean;
  readAt: string | null;

  createdAt: string;
  updatedAt: string;

  actor?: Pick<User, "id" | "firstName" | "lastName"> | null;
  project?: Pick<Project, "id" | "name"> | null;
  task?: Pick<Task, "id" | "title"> | null;
}

// ============================================================
// ACTIVITY LOG
// ============================================================

export interface ActivityLog {
  id: string;

  projectId: string;
  userId: string;

  action: ActivityAction;

  entityType: EntityType;
  entityId: string;

  metadata: Record<string, unknown> | null;

  createdAt: string;

  user?: User;
}


// ============================================================
// REFRESH TOKEN
// ============================================================

export interface RefreshToken {
  id: string;

  userId: string;

  expiresAt: string;
  createdAt: string;

  revokedAt: string | null;
}


// ============================================================
// AUTH
// ============================================================

export interface AuthResponse {
  user: User;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}


// ============================================================
// API RESPONSE
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}


// ============================================================
// PROJECT WITH RELATIONS
// ============================================================

export interface ProjectDetails extends Project {
  owner?: User;

  members?: ProjectMember[];

  tasks?: Task[];

  labels?: Label[];

  activityLogs?: ActivityLog[];
}


// ============================================================
// TASK WITH RELATIONS
// ============================================================

export interface TaskDetails extends Task {
  project?: Project;

  assignee?: User;

  creator?: User;

  comments?: Comment[];

  attachments?: Attachment[];

  labels?: TaskLabel[];
}

// ============================================================
// PAGINATION
// ============================================================

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}


// ============================================================
// PROJECT LIST ITEM (returned by GET /projects)
// ============================================================

export interface ProjectListItem extends Project {
  role: "OWNER" | ProjectRole;
  taskCount: number;
  memberCount: number;
}


// ============================================================
// PROJECT DETAILS (returned by GET /projects/:id)
// ============================================================

export interface ProjectDetailsResponse extends Project {
  role: "OWNER" | ProjectRole;
  taskCount: number;
  members: ProjectMember[];
}


// ============================================================
// MY TASKS (task + parent project info)
// ============================================================

export interface MyTask extends Task {
  project: Pick<Project, "id" | "name">;
}

export interface TaskStatusCounts {
  TODO: number;
  IN_PROGRESS: number;
  IN_REVIEW: number;
  DONE: number;
}


// ============================================================
// DASHBOARD
// ============================================================

export interface DashboardStats {
  total: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export interface DashboardTask extends Task {
  project: Pick<Project, "id" | "name">;
}

export interface DashboardProject {
  id: string;
  name: string;
  role: "OWNER" | ProjectRole;
  taskCount: number;
  completedTaskCount: number;
  completionPercent: number;
  memberCount: number;
}

export interface DashboardActivityLog extends ActivityLog {
  project: Pick<Project, "id" | "name">;
  user: Pick<User, "id" | "firstName" | "lastName">;
}

export interface TeamWorkloadEntry {
  user: Pick<User, "id" | "firstName" | "lastName">;
  activeTaskCount: number;
}

export interface DashboardOverview {
  stats: DashboardStats;
  myTasks: DashboardTask[];
  recentActivity: DashboardActivityLog[];
  projects: DashboardProject[];
  teamWorkload: TeamWorkloadEntry[];
  isManager: boolean;
}


export interface NotificationPreferences {
  notifyTaskAssigned: boolean;
  notifyTaskUpdated: boolean;
  notifyComments: boolean;
  notifyMentions: boolean;
  notifyProjectActivity: boolean;
  notifyDeadlines: boolean;
  notifyEmail: boolean;
}