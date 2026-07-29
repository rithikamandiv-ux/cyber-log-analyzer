import { Router } from "express";
import { authenticate } from "../middleware/auth";
import * as dashboardController from "../controllers/dashboard.controller";

const router = Router();

router.get("/", authenticate, dashboardController.getDashboard);

router.get(
    "/severity",
    authenticate,
    dashboardController.getSeverityDistribution
);

router.get(
    "/timeline",
    authenticate,
    dashboardController.getEventTimeline
);

router.get(
    "/top-ips",
    authenticate,
    dashboardController.getTopIPs
);

router.get(
    "/event-types",
    authenticate,
    dashboardController.getEventTypes
);

router.get(
    "/recent-alerts",
    authenticate,
    dashboardController.getRecentAlerts
);

export default router;