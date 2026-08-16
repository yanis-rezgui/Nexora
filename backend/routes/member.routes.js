// routes/member.routes.js

import { Router } from "express";

import {
  getProjectMembers,
  addProjectMember,
  updateProjectMemberRole,
  removeProjectMember,
} from "../controllers/members.controller.js";

import authorize from "../middlewares/auth.middleware.js";

const memberRouter = new Router();

memberRouter.get(
  "/projects/:projectId/members",
  authorize,
  getProjectMembers
);

memberRouter.post(
  "/projects/:projectId/members",
  authorize,
  addProjectMember
);

memberRouter.patch(
  "/projects/:projectId/members/:memberId",
  authorize,
  updateProjectMemberRole
);

memberRouter.delete(
  "/projects/:projectId/members/:memberId",
  authorize,
  removeProjectMember
);

export default memberRouter;