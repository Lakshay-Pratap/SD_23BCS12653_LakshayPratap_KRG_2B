import Fastify from "fastify";
import { conversations, Topics, messages } from "@campusconnect/shared";
import { attachSocket } from "./modules/socket/attach-socket";

const server = Fastify({ logger: true });
const io = attachSocket(server);

server.get("/health", async () => ({
  service: "chat-service",
  ok: true,
  latencyMs: 31
}));

server.get("/conversations/:userId", async () =>
  conversations
);

server.get("/conversations/:conversationId/messages", async (request) => {
  const { conversationId } = request.params as { conversationId: string };
  return messages.filter((message) => message.conversationId === conversationId);
});

server.get("/sync/:userId", async () => ({
  strategy: "last-seen cursor replay from MongoDB backed store",
  pendingMessages: messages.filter((message) => message.deliveryState !== "read")
}));

server.post("/messages", async (request) => {
  const body = request.body as {
    conversationId: string;
    senderId: string;
    body: string;
    attachments?: { id: string; kind: "image" | "video" | "document"; url: string; fileName: string }[];
    recipientIds?: string[];
  };
  const message = {
    id: `msg-${messages.length + 1}`,
    conversationId: body.conversationId,
    senderId: body.senderId,
    body: body.body,
    attachments: body.attachments ?? [],
    sentAt: new Date().toISOString(),
    deliveryState: "sent" as const,
    recipientIds: body.recipientIds ?? [],
    messageType: body.attachments?.length ? ("media" as const) : ("text" as const),
    readBy: [],
    deliveredTo: []
  };

  messages.push(message);
  io.to(body.conversationId).emit("chat.message.created", message);

  return {
    accepted: true,
    message,
    event: {
      topic: Topics.ChatMessageCreated,
      transport: "kafka"
    }
  };
});

server.patch("/messages/:id/status", async (request) => {
  const { id } = request.params as { id: string };
  const body = request.body as { deliveryState: "sent" | "delivered" | "read" };
  const target = messages.find((message) => message.id === id);
  if (!target) {
    return { updated: false };
  }
  target.deliveryState = body.deliveryState;
  if (body.deliveryState === "delivered") {
    target.deliveredTo = Array.from(new Set([...target.deliveredTo, ...target.recipientIds]));
  }
  if (body.deliveryState === "read") {
    target.readBy = Array.from(new Set([...target.readBy, ...target.recipientIds]));
  }
  io.to(target.conversationId).emit("chat.message.status.updated", target);
  return { updated: true, message: target };
});

server.listen({ port: 4103, host: "0.0.0.0" }).catch((error) => {
  server.log.error(error);
  process.exit(1);
});
