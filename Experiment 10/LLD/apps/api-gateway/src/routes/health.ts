import type { FastifyInstance } from "fastify";
import { getSystemHealth } from "../lib/service-clients";

export async function registerHealthRoutes(server: FastifyInstance): Promise<void> {
  server.get("/health", async () => {
    const services = await getSystemHealth();
    return {
      service: "api-gateway",
      ok: services.every((entry) => entry.ok),
      degraded: services.some((entry) => entry.degraded),
      services
    };
  });
}
