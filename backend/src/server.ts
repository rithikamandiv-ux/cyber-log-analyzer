import http from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "./app";
import { initializeSockets } from "./sockets";

const PORT = parseInt(process.env.PORT || "5000", 10);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Set up socket event handlers
initializeSockets(io);

// Make io available to routes/controllers if needed
app.set("io", io);

// Start server
server.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   🛡️  Cyber Log Analyzer — Backend       ║
  ║   🚀 Server running on port ${PORT}        ║
  ║   📡 Socket.IO ready                     ║
  ║   🌍 ${process.env.NODE_ENV || "development"} mode                  ║
  ╚══════════════════════════════════════════╝
  `);
});

export { server, io };
