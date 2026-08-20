import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  getProjectLabels,
  createLabel,
  updateLabel,
  deleteLabel,
  attachLabelToTask,
  detachLabelFromTask,
} from "../controllers/label.controller.js";

const labelRouter = Router();

labelRouter.get("/projects/:projectId/labels", authorize, getProjectLabels);
labelRouter.post("/projects/:projectId/labels", authorize, createLabel);
labelRouter.patch("/labels/:labelId", authorize, updateLabel);
labelRouter.delete("/labels/:labelId", authorize, deleteLabel);

labelRouter.post("/tasks/:taskId/labels", authorize, attachLabelToTask);
labelRouter.delete("/tasks/:taskId/labels/:labelId", authorize, detachLabelFromTask);

export default labelRouter;