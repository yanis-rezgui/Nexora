import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  getTaskComments,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";

const commentRouter = Router();

commentRouter.get("/tasks/:taskId/comments", authorize, getTaskComments);
commentRouter.post("/tasks/:taskId/comments", authorize, createComment);
commentRouter.patch("/comments/:commentId", authorize, updateComment);
commentRouter.delete("/comments/:commentId", authorize, deleteComment);

export default commentRouter;