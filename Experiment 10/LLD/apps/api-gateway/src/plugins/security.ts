import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import type { FastifyInstance } from "fastify";

export async function registerSecurity(server: FastifyInstance): Promise<void> {
  await server.register(cors, {
    origin: true,
    credentials: true
  });
  await server.register(helmet, {
    contentSecurityPolicy: false
  });
  await server.register(rateLimit, {
    max: 120,
    timeWindow: "1 minute"
  });
}
