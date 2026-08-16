// routes/dashboard.routes.js
import { Router } from "express";

import { getDashboardOverview } from "../controllers/dashboard.controller.js";

import authorize from "../middlewares/auth.middleware.js";

const dashboardRouter = new Router();

dashboardRouter.get(
  "/dashboard/overview",
  authorize,
  getDashboardOverview
);

export default dashboardRouter;