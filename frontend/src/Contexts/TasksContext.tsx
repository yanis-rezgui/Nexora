import { createContext, useContext, useState } from "react";
import type {
  ApiResponse,
  Pagination,
  Task,
  TaskDetails,
  TaskPriority,
  TaskStatus,
  MyTask,
  TaskStatusCounts,
} from "../Types/Types";


// ============================================================
// TYPES
// ============================================================

interface CreateTaskData {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  assigneeId?: string;
}

interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string | null;
}

interface GetMyTasksParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  search?: string;
  sort?: "dueDate" | "createdAt" | "priority" | "title";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}


// ============================================================
// CONTEXT TYPE
// ============================================================

interface TasksContextType {

  // ----------------------------------------------------------
  // TASKS (project-scoped)
  // ----------------------------------------------------------

  tasks: Task[];
  loadingTasks: boolean;

  getProjectTasks: (projectId: string) => Promise<void>;


  // ----------------------------------------------------------
  // MY TASKS (cross-project)
  // ----------------------------------------------------------

  myTasks: MyTask[];
  loadingMyTasks: boolean;
  myTasksPagination: Pagination | null;
  myTasksCounts: TaskStatusCounts | null;

  getMyTasks: (params?: GetMyTasksParams) => Promise<void>;


  // ----------------------------------------------------------
  // CURRENT TASK
  // ----------------------------------------------------------

  currentTask: TaskDetails | null;
  loadingCurrentTask: boolean;

  getTaskById: (
    projectId: string,
    taskId: string
  ) => Promise<void>;


  // ----------------------------------------------------------
  // CREATE
  // ----------------------------------------------------------

  createTask: (
    projectId: string,
    data: CreateTaskData
  ) => Promise<void>;

  loadingCreateTask: boolean;


  // ----------------------------------------------------------
  // UPDATE
  // ----------------------------------------------------------

  updateTask: (
    projectId: string,
    taskId: string,
    data: UpdateTaskData
  ) => Promise<void>;

  loadingUpdateTask: boolean;


  // ----------------------------------------------------------
  // DELETE
  // ----------------------------------------------------------

  deleteTask: (
    projectId: string,
    taskId: string
  ) => Promise<void>;

  loadingDeleteTask: boolean;


  // ----------------------------------------------------------
  // ASSIGN
  // ----------------------------------------------------------

  assignTask: (
    projectId: string,
    taskId: string,
    assigneeId: string | null
  ) => Promise<void>;

  loadingAssignTask: boolean;


  // ----------------------------------------------------------
  // STATUS
  // ----------------------------------------------------------

  updateTaskStatus: (
    projectId: string,
    taskId: string,
    status: TaskStatus
  ) => Promise<void>;

  loadingUpdateTaskStatus: boolean;


  // ----------------------------------------------------------
  // ERROR
  // ----------------------------------------------------------

  errorMsg: string | null;
}


// ============================================================
// CONTEXT
// ============================================================

const TasksContext = createContext<TasksContextType | null>(null);


// ============================================================
// PROVIDER
// ============================================================

export const TasksProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  // ----------------------------------------------------------
  // STATES
  // ----------------------------------------------------------

  const [tasks, setTasks] = useState<Task[]>([]);

  const [loadingTasks, setLoadingTasks] =
    useState<boolean>(false);


  const [myTasks, setMyTasks] =
    useState<MyTask[]>([]);

  const [loadingMyTasks, setLoadingMyTasks] =
    useState<boolean>(false);

  const [myTasksPagination, setMyTasksPagination] =
    useState<Pagination | null>(null);

  const [myTasksCounts, setMyTasksCounts] =
    useState<TaskStatusCounts | null>(null);


  const [currentTask, setCurrentTask] =
    useState<TaskDetails | null>(null);

  const [loadingCurrentTask, setLoadingCurrentTask] =
    useState<boolean>(false);


  const [loadingCreateTask, setLoadingCreateTask] =
    useState<boolean>(false);

  const [loadingUpdateTask, setLoadingUpdateTask] =
    useState<boolean>(false);

  const [loadingDeleteTask, setLoadingDeleteTask] =
    useState<boolean>(false);

  const [loadingAssignTask, setLoadingAssignTask] =
    useState<boolean>(false);

  const [loadingUpdateTaskStatus, setLoadingUpdateTaskStatus] =
    useState<boolean>(false);


  const [errorMsg, setErrorMsg] =
    useState<string | null>(null);


  // ==========================================================
  // GET PROJECT TASKS
  // ==========================================================

  const getProjectTasks = async (
    projectId: string
  ) => {

    try {

      setLoadingTasks(true);

      const res = await fetch(
        `http://localhost:5000/api/v1/projects/${projectId}/tasks`,
        {
          method: "GET",
          credentials: "include",
        }
      );


      const data: ApiResponse<{ tasks: Task[] }> =
        await res.json();


      if (!res.ok || !data.data) {

        setErrorMsg(
          data.message || "Error in fetching tasks"
        );

        throw new Error(
          data.message || "Error in fetching tasks"
        );
      }


      setTasks(data.data.tasks);

      setErrorMsg(null);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingTasks(false);

    }
  };


  // ==========================================================
  // GET MY TASKS
  // ==========================================================

  const getMyTasks = async (
    params?: GetMyTasksParams
  ) => {

    try {

      setLoadingMyTasks(true);

      const query = new URLSearchParams();

      if (params?.status) query.set("status", params.status);
      if (params?.priority) query.set("priority", params.priority);
      if (params?.projectId) query.set("projectId", params.projectId);
      if (params?.search) query.set("search", params.search);
      if (params?.sort) query.set("sort", params.sort);
      if (params?.order) query.set("order", params.order);
      if (params?.page) query.set("page", String(params.page));
      if (params?.limit) query.set("limit", String(params.limit));

      const queryString = query.toString();

      const res = await fetch(
        `http://localhost:5000/api/v1/tasks/my${queryString ? `?${queryString}` : ""}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data: ApiResponse<{
        tasks: MyTask[];
        counts: TaskStatusCounts;
        pagination: Pagination;
      }> = await res.json();

      if (!res.ok || !data.data) {

        setErrorMsg(
          data.message || "Error in fetching your tasks"
        );

        throw new Error(
          data.message || "Error in fetching your tasks"
        );
      }

      setMyTasks(data.data.tasks);
      setMyTasksCounts(data.data.counts);
      setMyTasksPagination(data.data.pagination);

      setErrorMsg(null);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingMyTasks(false);

    }
  };


  // ==========================================================
  // CREATE TASK
  // ==========================================================

  const createTask = async (
    projectId: string,
    taskData: CreateTaskData
  ) => {

    try {

      setLoadingCreateTask(true);

      const res = await fetch(
        `http://localhost:5000/api/v1/projects/${projectId}/tasks`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(taskData),

          credentials: "include",
        }
      );


      const data: ApiResponse<{ task: Task }> =
        await res.json();


      if (!res.ok || !data.data) {

        setErrorMsg(
          data.message || "Error in creating task"
        );

        throw new Error(
          data.message || "Error in creating task"
        );
      }


      setTasks(prev => [
        data.data!.task,
        ...prev,
      ]);


      setErrorMsg(null);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingCreateTask(false);

    }
  };


  // ==========================================================
  // GET TASK BY ID
  // ==========================================================

  const getTaskById = async (
    projectId: string,
    taskId: string
  ) => {

    try {

      setLoadingCurrentTask(true);

      const res = await fetch(
        `http://localhost:5000/api/v1/projects/${projectId}/tasks/${taskId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );


      const data: ApiResponse<{ task: TaskDetails }> =
        await res.json();


      if (!res.ok || !data.data) {

        setErrorMsg(
          data.message || "Error in fetching task"
        );

        throw new Error(
          data.message || "Error in fetching task"
        );
      }


      setCurrentTask(data.data.task);

      setErrorMsg(null);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingCurrentTask(false);

    }
  };


  // ==========================================================
  // UPDATE TASK
  // ==========================================================

  const updateTask = async (
    projectId: string,
    taskId: string,
    taskData: UpdateTaskData
  ) => {

    try {

      setLoadingUpdateTask(true);

      const res = await fetch(
        `http://localhost:5000/api/v1/projects/${projectId}/tasks/${taskId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(taskData),

          credentials: "include",
        }
      );


      const data: ApiResponse<{ task: Task }> =
        await res.json();


      if (!res.ok || !data.data) {

        setErrorMsg(
          data.message || "Error in updating task"
        );

        throw new Error(
          data.message || "Error in updating task"
        );
      }


      const updatedTask =
        data.data.task;


      // Update task in project list
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId
            ? { ...task, ...updatedTask }
            : task
        )
      );


      // Update task in "my tasks" list
      setMyTasks(prev =>
        prev.map(task =>
          task.id === taskId
            ? { ...task, ...updatedTask }
            : task
        )
      );


      // Update current task
      setCurrentTask(prev =>
        prev && prev.id === taskId
          ? { ...prev, ...updatedTask }
          : prev
      );


      setErrorMsg(null);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingUpdateTask(false);

    }
  };


  // ==========================================================
  // DELETE TASK
  // ==========================================================

  const deleteTask = async (
    projectId: string,
    taskId: string
  ) => {

    try {

      setLoadingDeleteTask(true);

      const res = await fetch(
        `http://localhost:5000/api/v1/projects/${projectId}/tasks/${taskId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );


      const data: ApiResponse<null> =
        await res.json();


      if (!res.ok) {

        setErrorMsg(
          data.message || "Error in deleting task"
        );

        throw new Error(
          data.message || "Error in deleting task"
        );
      }


      setTasks(prev =>
        prev.filter(task => task.id !== taskId)
      );

      setMyTasks(prev =>
        prev.filter(task => task.id !== taskId)
      );

      setCurrentTask(prev =>
        prev && prev.id === taskId
          ? null
          : prev
      );


      setErrorMsg(null);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingDeleteTask(false);

    }
  };


  // ==========================================================
  // ASSIGN TASK
  // ==========================================================

  const assignTask = async (
    projectId: string,
    taskId: string,
    assigneeId: string | null
  ) => {

    try {

      setLoadingAssignTask(true);

      const res = await fetch(
        `http://localhost:5000/api/v1/projects/${projectId}/tasks/${taskId}/assign`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            assigneeId,
          }),

          credentials: "include",
        }
      );


      const data: ApiResponse<{ task: Task }> =
        await res.json();


      if (!res.ok || !data.data) {

        setErrorMsg(
          data.message || "Error in assigning task"
        );

        throw new Error(
          data.message || "Error in assigning task"
        );
      }


      const updatedTask =
        data.data.task;


      setTasks(prev =>
        prev.map(task =>
          task.id === taskId
            ? { ...task, ...updatedTask }
            : task
        )
      );

      // Unassigning from "me" removes it from "my tasks"
      setMyTasks(prev =>
        assigneeId
          ? prev.map(task =>
              task.id === taskId
                ? { ...task, ...updatedTask }
                : task
            )
          : prev.filter(task => task.id !== taskId)
      );

      setCurrentTask(prev =>
        prev && prev.id === taskId
          ? { ...prev, ...updatedTask }
          : prev
      );


      setErrorMsg(null);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingAssignTask(false);

    }
  };


  // ==========================================================
  // UPDATE TASK STATUS
  // ==========================================================

  const updateTaskStatus = async (
    projectId: string,
    taskId: string,
    status: TaskStatus
  ) => {

    try {

      setLoadingUpdateTaskStatus(true);

      const res = await fetch(
        `http://localhost:5000/api/v1/projects/${projectId}/tasks/${taskId}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status,
          }),

          credentials: "include",
        }
      );


      const data: ApiResponse<{ task: Task }> =
        await res.json();


      if (!res.ok || !data.data) {

        setErrorMsg(
          data.message ||
          "Error in updating task status"
        );

        throw new Error(
          data.message ||
          "Error in updating task status"
        );
      }


      const updatedTask =
        data.data.task;


      setTasks(prev =>
        prev.map(task =>
          task.id === taskId
            ? { ...task, ...updatedTask }
            : task
        )
      );

      setMyTasks(prev =>
        prev.map(task =>
          task.id === taskId
            ? { ...task, ...updatedTask }
            : task
        )
      );

      setCurrentTask(prev =>
        prev && prev.id === taskId
          ? { ...prev, ...updatedTask }
          : prev
      );


      setErrorMsg(null);

    } catch (err) {

      console.error(err);

    } finally {

      setLoadingUpdateTaskStatus(false);

    }
  };


  // ==========================================================
  // PROVIDER
  // ==========================================================

  return (
    <TasksContext.Provider
      value={{

        // Tasks
        tasks,
        loadingTasks,
        getProjectTasks,


        // My tasks
        myTasks,
        loadingMyTasks,
        myTasksPagination,
        myTasksCounts,
        getMyTasks,


        // Current task
        currentTask,
        loadingCurrentTask,
        getTaskById,


        // Create
        createTask,
        loadingCreateTask,


        // Update
        updateTask,
        loadingUpdateTask,


        // Delete
        deleteTask,
        loadingDeleteTask,


        // Assign
        assignTask,
        loadingAssignTask,


        // Status
        updateTaskStatus,
        loadingUpdateTaskStatus,


        // Error
        errorMsg,

      }}
    >
      {children}
    </TasksContext.Provider>
  );
};


// ============================================================
// HOOK
// ============================================================

export const useTasksContext = () => {

  const context = useContext(TasksContext);

  if (!context) {

    throw new Error(
      "Please use the useTasksContext hook inside a TasksProvider"
    );

  }

  return context;
};