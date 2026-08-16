// routes/project.routes.js
import { Router } from "express";

import {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";
import { getProjectActivity } from "../controllers/activity.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const projectRouter = new Router();

projectRouter.get("/", authorize, getProjects);

projectRouter.post("/", authorize, createProject);

projectRouter.get("/:projectId", authorize, getProjectById);

projectRouter.patch("/:projectId", authorize, updateProject);

projectRouter.delete("/:projectId", authorize, deleteProject);

projectRouter.get("/:projectId/activity", authorize, getProjectActivity);

export default projectRouter;