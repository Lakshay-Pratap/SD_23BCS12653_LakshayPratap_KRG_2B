import Fastify from "fastify";
import { config } from "./lib/config";
import { registerSecurity } from "./plugins/security";
import { registerDashboardRoutes } from "./routes/dashboard";
import { registerHealthRoutes } from "./routes/health";
import { registerPublicApiRoutes } from "./routes/public-api";

const server = Fastify({
  logger: true
});

await registerSecurity(server);
await registerHealthRoutes(server);
await registerDashboardRoutes(server);
await registerPublicApiRoutes(server);

server.get("/", async () => ({
  name: "CampusConnect+ API Gateway",
  version: "1.0.0",
  pattern: "API Gateway with service fan-out, retries, and graceful degradation"
}));

server.listen({ port: config.port, host: "0.0.0.0" }).catch((error) => {
  server.log.error(error);
  process.exit(1);
});
