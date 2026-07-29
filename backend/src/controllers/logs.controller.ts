import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import * as logsService from "../services/logs.service";
import { parseAuthLog } from "../services/python.service";
import * as alertsService from "../services/alerts.service";

/**
 * POST /api/logs/upload
 */
export const uploadLog = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    const logFile = await logsService.createLogFile(
      userId,
      req.file.originalname,
      req.file.path,
      req.file.size,
      req.file.mimetype
    );

    const result = await parseAuthLog(req.file.path);

    await logsService.insertLogEntries(logFile.id, result.logs);

    for (const alert of result.alerts) {
      await alertsService.createAlert({
        logFileId: logFile.id,
        alertType: alert.alert_type,
        severity: alert.severity,
        description: alert.description,
      });
    }

    const updatedLogFile = await logsService.updateLogFileStatus(
      logFile.id,
      "completed"
    );

    res.status(201).json({
      message: "File uploaded, parsed, and analyzed successfully.",
      logFile: updatedLogFile,
      parsedLogsCount: result.logs.length,
      alertsCreatedCount: result.alerts.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

/**
 * GET /api/logs
 */
export const getLogs = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized." });
      return;
    }

    const logFiles = await logsService.getLogFiles(userId);

    res.json({ logFiles });
  } catch (error) {
    console.error("Get logs error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};