import { Router } from "express";
import { getMLStatus } from "../controllers/mlController";

const router = Router();

router.get("/status", getMLStatus);

export default router;