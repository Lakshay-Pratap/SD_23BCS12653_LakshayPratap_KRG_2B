import type { FastifyInstance } from "fastify";
import { Server as SocketIOServer } from "socket.io";

export function attachSocket(server: FastifyInstance): SocketIOServer {
  const io = new SocketIOServer(server.server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {
    socket.emit("system:connected", {
      service: "chat-service",
      realtime: true
    });

    socket.on("room:join", (roomId: string) => {
      socket.join(roomId);
    });

    socket.on("presence:update", (payload: { userId: string; availability: string }) => {
      io.emit("presence:updated", payload);
    });
  });

  return io;
}
