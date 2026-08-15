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

export type NotificationType =
  | "INFO"
  | "SUCCESS"
  | "WARNING"
  | "ERROR";

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

export interface Notification {
  id: string;

  userId: string;

  title: string;
  message: string;

  type: NotificationType;

  isRead: boolean;

  createdAt: string;
  updatedAt: string;
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