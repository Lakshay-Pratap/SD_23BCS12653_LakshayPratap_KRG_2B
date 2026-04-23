import type { FastifyInstance } from "fastify";
import { getArchitectureSummary, proxyPost, searchDirectory } from "../lib/service-clients";

export async function registerPublicApiRoutes(server: FastifyInstance): Promise<void> {
  server.post("/api/auth/login", async (request) => {
    const body = request.body as { email: string; password: string };
    return proxyPost("auth", "/auth/login", body, {
      accessToken: "fallback-token",
      refreshToken: "fallback-refresh",
      userId: "user-1",
      role: "user"
    });
  });

  server.post("/api/posts/anonymous", async (request) => {
    const body = request.body as { body: string; campus: string; category: string; tags: string[] };
    return proxyPost("moderation", "/posts/anonymous", body, {
      status: "queued",
      moderationScore: 0.4,
      requiresHumanReview: true
    });
  });

  server.post("/api/chat/messages", async (request) => {
    const body = request.body as {
      conversationId: string;
      senderId: string;
      body: string;
      attachments?: { id: string; kind: "image" | "video" | "document"; url: string; fileName: string }[];
      recipientIds?: string[];
    };
    return proxyPost("chat", "/messages", body, {
      accepted: true,
      transport: "degraded-fallback"
    });
  });

  server.get("/api/search", async (request) => {
    const { q } = request.query as { q?: string };
    return {
      query: q ?? "",
      results: await searchDirectory(q ?? "")
    };
  });

  server.get("/api/architecture", async () => getArchitectureSummary());
}
