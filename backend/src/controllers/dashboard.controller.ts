import { Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service";

/**
 * GET /api/dashboard
 */
export const getDashboard = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats = await dashboardService.getDashboardStats();
    res.json({ stats });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * GET /api/dashboard/severity
 */
export const getSeverityDistribution = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const distribution = await dashboardService.getSeverityDistribution();
    res.json({ distribution });
  } catch (error) {
    console.error("Severity distribution error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * GET /api/dashboard/timeline
 */
export const getEventTimeline = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const days = req.query.days ? parseInt(req.query.days as string, 10) : 7;
    const timeline = await dashboardService.getEventTimeline(days);
    res.json({ timeline });
  } catch (error) {
    console.error("Event timeline error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getTopIPs = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const ips = await dashboardService.getTopIPs();
    res.json({ ips });
  } catch (error) {
    console.error("Top IPs error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getEventTypes = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const eventTypes =
      await dashboardService.getEventTypeDistribution();

    res.json({ eventTypes });
  } catch (error) {
    console.error("Event types error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getRecentAlerts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const alerts =
      await dashboardService.getRecentAlerts();

    res.json({ alerts });
  } catch (error) {
    console.error("Recent alerts error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
