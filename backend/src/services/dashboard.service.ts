import pool from "../config/db";

// TODO (Intentionally deferred - Feature Complete): Implement full dashboard statistics
export const getDashboardStats = async () => {
  const [totalLogs, totalAlerts, unresolvedAlerts, recentFiles] =
    await Promise.all([
      pool.query("SELECT COUNT(*) as count FROM logs"),
      pool.query("SELECT COUNT(*) as count FROM alerts"),
      pool.query(
        "SELECT COUNT(*) as count FROM alerts WHERE is_resolved = FALSE"
      ),
      pool.query(
        "SELECT * FROM log_files ORDER BY uploaded_at DESC LIMIT 5"
      ),
    ]);

  return {
    totalLogs: parseInt(totalLogs.rows[0].count, 10),
    totalAlerts: parseInt(totalAlerts.rows[0].count, 10),
    unresolvedAlerts: parseInt(unresolvedAlerts.rows[0].count, 10),
    recentFiles: recentFiles.rows,
    // TODO (Intentionally deferred - Feature Complete): Add severity breakdown, time-series data, top IPs
  };
};

// TODO (Intentionally deferred - Feature Complete): Implement severity distribution query
export const getSeverityDistribution = async () => {
  const result = await pool.query(
    "SELECT severity, COUNT(*) as count FROM alerts GROUP BY severity ORDER BY count DESC"
  );
  return result.rows;
};

// TODO (Intentionally deferred - Feature Complete): Implement event timeline query
export const getEventTimeline = async (days: number = 7) => {
  const result = await pool.query(
    `SELECT DATE(created_at) as date, COUNT(*) as count
     FROM logs
     WHERE created_at >= NOW() - INTERVAL '1 day' * $1
     GROUP BY DATE(created_at)
     ORDER BY date ASC`,
    [days]
  );
  return result.rows;
};

export const getTopIPs = async (limit: number = 10) => {
  const result = await pool.query(
    `
    SELECT
      source_ip,
      COUNT(*) as count
    FROM logs
    WHERE source_ip IS NOT NULL
    GROUP BY source_ip
    ORDER BY count DESC
    LIMIT $1
    `,
    [limit]
  );

  return result.rows;
};

export const getEventTypeDistribution = async () => {
  const result = await pool.query(
    `
    SELECT
      event_type,
      COUNT(*) as count
    FROM logs
    GROUP BY event_type
    ORDER BY count DESC
    `
  );

  return result.rows;
};

export const getRecentAlerts = async (limit: number = 10) => {
  const result = await pool.query(
    `
    SELECT
      id,
      alert_type,
      severity,
      description,
      created_at
    FROM alerts
    ORDER BY created_at DESC
    LIMIT $1
    `,
    [limit]
  );

  return result.rows;
};
