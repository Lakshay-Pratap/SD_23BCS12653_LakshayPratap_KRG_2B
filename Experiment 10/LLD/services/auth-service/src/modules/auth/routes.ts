import type { FastifyInstance } from "fastify";
import { profiles } from "@campusconnect/shared";
import { signJwt } from "./tokens";

export async function registerAuthRoutes(server: FastifyInstance): Promise<void> {
  server.post("/auth/login", async (request) => {
    const { email } = request.body as { email: string; password: string };
    const user = profiles.find((profile) => email.toLowerCase().includes(profile.handle.split(".")[0])) ?? profiles[0];
    const secret = process.env.JWT_SECRET ?? "local-secret";
    const accessToken = signJwt({ sub: user.id, role: user.role, campus: user.campus, scope: "gateway:access" }, secret);
    const refreshToken = signJwt({ sub: user.id, type: "refresh", scope: "auth:refresh" }, secret);

    return {
      accessToken,
      refreshToken,
      userId: user.id,
      role: user.role,
      expiresInSeconds: 3600,
      oauthProviders: ["google"],
      blockchainIdentity: {
        wallet: "0xb7d2...91ce",
        identityHash: `did:campusconnect:${user.id}`
      }
    };
  });

  server.post("/auth/refresh", async (request) => {
    const { refreshToken } = request.body as { refreshToken: string };
    const secret = process.env.JWT_SECRET ?? "local-secret";
    const user = profiles[0];
    return {
      refreshToken,
      accessToken: signJwt({ sub: user.id, role: user.role, campus: user.campus, scope: "gateway:access" }, secret),
      rotated: true
    };
  });

  server.get("/auth/oauth/google", async () => ({
    provider: "google",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    note: "In production, this endpoint would generate PKCE state and redirect via the API gateway."
  }));

  server.get("/auth/me/:userId", async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const user = profiles.find((profile) => profile.id === userId);
    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }
    return {
      id: user.id,
      role: user.role,
      campus: user.campus,
      permissions: user.role === "admin" ? ["moderate:*", "analytics:read", "feature-flags:write"] : ["chat:write", "feed:read"]
    };
  });

  server.get("/auth/identity/:userId", async (request) => {
    const { userId } = request.params as { userId: string };
    return {
      userId,
      identityHash: `0x${Buffer.from(userId).toString("hex").slice(0, 20)}`,
      network: "sepolia",
      uniquenessVerified: true
    };
  });
}
