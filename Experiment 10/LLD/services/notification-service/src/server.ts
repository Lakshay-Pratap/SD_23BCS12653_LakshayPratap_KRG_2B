import Fastify from "fastify";
import { notifications } from "@campusconnect/shared";

const server = Fastify({ logger: true });

server.get("/health", async () => ({
  service: "notification-service",
  ok: true,
  latencyMs: 22
}));

server.get("/notifications/:userId", async (request) => {
  const { userId } = request.params as { userId: string };
  return notifications.filter((notification) => notification.userId === userId);
});

server.post("/notifications", async (request) => {
  const body = request.body as { userId: string; title: string; body: string; channel: "in-app" | "push" | "email" };
  const notification = {
    id: `notif-${notifications.length + 1}`,
    ...body,
    createdAt: new Date().toISOString(),
    severity: "info" as const,
    read: false
  };
  notifications.push(notification);
  return {
    accepted: true,
    notification
  };
});

server.patch("/notifications/:id/read", async (request) => {
  const { id } = request.params as { id: string };
  const notification = notifications.find((entry) => entry.id === id);
  if (!notification) {
    return { updated: false };
  }
  notification.read = true;
  return { updated: true, notification };
});

server.listen({ port: 4107, host: "0.0.0.0" }).catch((error) => {
  server.log.error(error);
  process.exit(1);
});
