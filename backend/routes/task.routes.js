// routes/task.routes.js

import { Router } from "express";

import {
  getProjectTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  updateTaskStatus,
  getMyTasks,
} from "../controllers/task.controller.js";

import authorize from "../middlewares/auth.middleware.js";

const taskRouter = new Router();


// Get all tasks assigned to the current user, across projects
taskRouter.get(
  "/tasks/my",
  authorize,
  getMyTasks
);


// Get all tasks of a project
taskRouter.get(
  "/projects/:projectId/tasks",
  authorize,
  getProjectTasks
);


// Create task
taskRouter.post(
  "/projects/:projectId/tasks",
  authorize,
  createTask
);


// Get task
taskRouter.get(
  "/projects/:projectId/tasks/:taskId",
  authorize,
  getTaskById
);


// Update task
taskRouter.patch(
  "/projects/:projectId/tasks/:taskId",
  authorize,
  updateTask
);


// Delete task
taskRouter.delete(
  "/projects/:projectId/tasks/:taskId",
  authorize,
  deleteTask
);


// Assign task
taskRouter.patch(
  "/projects/:projectId/tasks/:taskId/assign",
  authorize,
  assignTask
);


// Update status
taskRouter.patch(
  "/projects/:projectId/tasks/:taskId/status",
  authorize,
  updateTaskStatus
);


export default taskRouter;