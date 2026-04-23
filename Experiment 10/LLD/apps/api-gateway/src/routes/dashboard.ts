import type { FastifyInstance } from "fastify";
import { getDashboard } from "../lib/service-clients";

export async function registerDashboardRoutes(server: FastifyInstance): Promise<void> {
  server.get("/api/dashboard/:userId", async (request) => {
    const { userId } = request.params as { userId: string };
    return getDashboard(userId);
  });

  server.get("/api/health", async () => server.inject({ method: "GET", url: "/health" }).then((response) => response.json()));
}
