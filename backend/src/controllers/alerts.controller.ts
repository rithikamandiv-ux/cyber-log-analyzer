import { Request, Response } from "express";
import * as alertsService from "../services/alerts.service";

/**
 * GET /api/alerts
 */
export const getAlerts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { severity, resolved, limit, offset } = req.query;

    const alerts = await alertsService.getAlerts({
      severity: severity as string | undefined,
      isResolved: resolved === "true" ? true : resolved === "false" ? false : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      offset: offset ? parseInt(offset as string, 10) : undefined,
    });

    res.json({ alerts });
  } catch (error) {
    console.error("Get alerts error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * PATCH /api/alerts/:id/resolve
 */
export const resolveAlert = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const alert = await alertsService.resolveAlert(parseInt(id as string, 10));

    if (!alert) {
      res.status(404).json({ error: "Alert not found." });
      return;
    }

    // TODO (Intentionally deferred - Feature Complete): Emit socket event for real-time alert resolution
    res.json({ alert });
  } catch (error) {
    console.error("Resolve alert error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
