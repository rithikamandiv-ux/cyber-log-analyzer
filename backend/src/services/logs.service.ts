import pool from "../config/db";

// TODO (Intentionally deferred - Feature Complete): Implement log file metadata insertion
export const createLogFile = async (
  userId: number,
  filename: string,
  filePath: string,
  fileSize: number,
  mimeType: string
) => {
  const result = await pool.query(
    `INSERT INTO log_files (user_id, filename, file_path, file_size, mime_type, status)
     VALUES ($1, $2, $3, $4, $5, 'pending')
     RETURNING *`,
    [userId, filename, filePath, fileSize, mimeType]
  );
  return result.rows[0];
};

// TODO (Intentionally deferred - Feature Complete): Implement log file listing
export const getLogFiles = async (userId: number) => {
  const result = await pool.query(
    "SELECT * FROM log_files WHERE user_id = $1 ORDER BY uploaded_at DESC",
    [userId]
  );
  return result.rows;
};

// TODO (Intentionally deferred - Feature Complete): Implement log file status update
export const updateLogFileStatus = async (id: number, status: string) => {
  const result = await pool.query(
    "UPDATE log_files SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );
  return result.rows[0];
};

// TODO (Intentionally deferred - Feature Complete): Implement parsed log entry insertion
export const insertLogEntries = async (
  logFileId: number,
  entries: Array<{
    timestamp?: string;
    source_ip?: string;
    dest_ip?: string;
    event_type?: string;
    message?: string;
    severity?: string;
    raw_line?: string;
  }>
) => {
  // TODO (Intentionally deferred - Feature Complete): Use batch insert for performance
  const results = [];
  for (const entry of entries) {
    const result = await pool.query(
      `INSERT INTO logs (log_file_id, timestamp, source_ip, dest_ip, event_type, message, severity, raw_line)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        logFileId,
        entry.timestamp || null,
        entry.source_ip || null,
        entry.dest_ip || null,
        entry.event_type || null,
        entry.message || null,
        entry.severity || "info",
        entry.raw_line || null,
      ]
    );
    results.push(result.rows[0]);
  }
  return results;
};
