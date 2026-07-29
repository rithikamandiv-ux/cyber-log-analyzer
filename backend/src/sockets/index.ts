import { Server as SocketIOServer } from "socket.io";

/**
 * Initialize Socket.IO event handlers.
 *
 * TODO:
 * - Add real-time log parsing progress events
 * - Add real-time alert notification events
 * - Add authentication for socket connections
 */
export const initializeSockets = (io: SocketIOServer): void => {
  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // TODO (Intentionally deferred - Feature Complete): Authenticate socket connection via JWT
    // const token = socket.handshake.auth.token;

    // Join user-specific room for targeted events
    socket.on("join:user", (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // TODO (Intentionally deferred - Feature Complete): Handle log parsing progress updates
    socket.on("logs:subscribe", (logFileId: string) => {
      socket.join(`logfile:${logFileId}`);
      console.log(`Subscribed to log file ${logFileId} updates`);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
};

/**
 * Emit a real-time event to a specific user.
 *
 * TODO: Use this helper from services when events occur.
 */
export const emitToUser = (
  io: SocketIOServer,
  userId: number,
  event: string,
  data: unknown
): void => {
  io.to(`user:${userId}`).emit(event, data);
};
