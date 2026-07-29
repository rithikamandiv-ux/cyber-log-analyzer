import { Router } from "express";
import { authenticate } from "../middleware/auth";
import * as alertsController from "../controllers/alerts.controller";

const router = Router();

router.get("/", authenticate, alertsController.getAlerts);
router.patch("/:id/resolve", authenticate, alertsController.resolveAlert);

export default router;
