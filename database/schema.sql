-- =============================================================
-- Cyber Log Analyzer — Database Schema
-- =============================================================

-- Enable UUID extension (optional, using SERIAL for simplicity)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------
-- Users
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(100) UNIQUE NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(50)  NOT NULL DEFAULT 'analyst',
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------
-- Log Files (uploaded files metadata)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS log_files (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename    VARCHAR(500) NOT NULL,
    file_path   VARCHAR(1000) NOT NULL,
    file_size   BIGINT,
    mime_type   VARCHAR(100),
    status      VARCHAR(50)  NOT NULL DEFAULT 'pending',  -- pending | processing | completed | failed
    uploaded_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------
-- Logs (parsed individual log entries)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS logs (
    id          SERIAL PRIMARY KEY,
    log_file_id INTEGER      NOT NULL REFERENCES log_files(id) ON DELETE CASCADE,
    timestamp   TIMESTAMP,
    source_ip   VARCHAR(45),
    dest_ip     VARCHAR(45),
    event_type  VARCHAR(100),
    message     TEXT,
    severity    VARCHAR(20)  DEFAULT 'info',  -- info | low | medium | high | critical
    raw_line    TEXT,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------
-- Alerts (security alerts generated from log analysis)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS alerts (
    id          SERIAL PRIMARY KEY,
    log_id      INTEGER      REFERENCES logs(id) ON DELETE SET NULL,
    log_file_id INTEGER      REFERENCES log_files(id) ON DELETE SET NULL,
    alert_type  VARCHAR(100) NOT NULL,
    severity    VARCHAR(20)  NOT NULL DEFAULT 'medium',  -- low | medium | high | critical
    description TEXT         NOT NULL,
    is_resolved BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP
);

-- -----------------------------------------------------------
-- Indexes for query performance
-- -----------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_logs_log_file_id ON logs(log_file_id);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_logs_severity ON logs(severity);
CREATE INDEX IF NOT EXISTS idx_logs_source_ip ON logs(source_ip);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_is_resolved ON alerts(is_resolved);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_log_files_user_id ON log_files(user_id);
CREATE INDEX IF NOT EXISTS idx_log_files_status ON log_files(status);
