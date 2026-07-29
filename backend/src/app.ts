import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import logRoutes from "./routes/logs.routes";
import alertRoutes from "./routes/alerts.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import mlRoutes from "./routes/mlRoutes";

// Load environment variables
dotenv.config();



const app = express();

// ------------------------------------
// Middleware
// ------------------------------------
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------------------
// API Routes
// ------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ml", mlRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found." });
});

export default app;
