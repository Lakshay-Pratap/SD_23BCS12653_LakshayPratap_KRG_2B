import Fastify from "fastify";
import { registerAuthRoutes } from "./modules/auth/routes";

const server = Fastify({ logger: true });

await registerAuthRoutes(server);

server.get("/health", async () => ({
  service: "auth-service",
  ok: true,
  latencyMs: 18
}));

server.listen({ port: 4101, host: "0.0.0.0" }).catch((error) => {
  server.log.error(error);
  process.exit(1);
});
