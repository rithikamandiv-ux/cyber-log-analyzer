import pool from "../config/db";

export const getAlerts = async (filters?: {
  severity?: string;
  isResolved?: boolean;
  limit?: number;
  offset?: number;
}) => {
  let query = "SELECT * FROM alerts WHERE 1=1";
  const params: (string | boolean | number)[] = [];
  let paramIndex = 1;

  if (filters?.severity) {
    query += ` AND severity = $${paramIndex++}`;
    params.push(filters.severity);
  }

  if (filters?.isResolved !== undefined) {
    query += ` AND is_resolved = $${paramIndex++}`;
    params.push(filters.isResolved);
  }

  query += " ORDER BY created_at DESC";

  if (filters?.limit) {
    query += ` LIMIT $${paramIndex++}`;
    params.push(filters.limit);
  }

  if (filters?.offset) {
    query += ` OFFSET $${paramIndex++}`;
    params.push(filters.offset);
  }

  const result = await pool.query(query, params);
  return result.rows;
};

export const createAlert = async (alert: {
  logId?: number;
  logFileId?: number;
  alertType: string;
  severity: string;
  description: string;
}) => {
  const result = await pool.query(
    `
    INSERT INTO alerts (
      log_id,
      log_file_id,
      alert_type,
      severity,
      description
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [
      alert.logId ?? null,
      alert.logFileId ?? null,
      alert.alertType,
      alert.severity,
      alert.description,
    ]
  );

  return result.rows[0];
};

export const resolveAlert = async (id: number) => {
  const result = await pool.query(
    `
    UPDATE alerts
    SET is_resolved = TRUE,
        resolved_at = NOW()
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
};