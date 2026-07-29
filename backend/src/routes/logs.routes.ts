import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";
import * as logsController from "../controllers/logs.controller";

const router = Router();

router.get("/", authenticate, logsController.getLogs);
router.post("/upload", authenticate, upload.single("logfile"), logsController.uploadLog);

export default router;
