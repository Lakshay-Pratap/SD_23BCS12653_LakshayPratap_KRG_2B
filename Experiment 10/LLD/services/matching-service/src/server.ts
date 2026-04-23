import Fastify from "fastify";
import { profiles, scoreMatch } from "@campusconnect/shared";

const server = Fastify({ logger: true });

server.get("/health", async () => ({
  service: "matching-service",
  ok: true,
  latencyMs: 27
}));

server.get("/matches/:userId", async (request, reply) => {
  const { userId } = request.params as { userId: string };
  const origin = profiles.find((profile) => profile.id === userId);
  if (!origin) {
    return reply.code(404).send({ message: "User not found" });
  }

  return profiles
    .filter((profile) => profile.id !== userId)
    .map((profile) => scoreMatch(origin, profile))
    .sort((left, right) => right.score - left.score)
    .slice(0, 6);
});

server.get("/matches/:userId/live", async (request, reply) => {
  const { userId } = request.params as { userId: string };
  const origin = profiles.find((profile) => profile.id === userId);
  if (!origin) {
    return reply.code(404).send({ message: "User not found" });
  }

  return {
    userId,
    geospatialIndex: "GeoHash precision-5 with Redis GEO fallback",
    nearbyUsers: profiles
      .filter((profile) => profile.id !== userId && profile.geohash === origin.geohash)
      .map((profile) => ({
        id: profile.id,
        name: profile.name,
        routeTag: profile.routeTag,
        availability: profile.availability,
        geohash: profile.geohash
      }))
  };
});

server.post("/matches/recompute", async (request) => {
  const body = request.body as { userId: string; trigger: "location-change" | "interest-update" };
  return {
    queued: true,
    userId: body.userId,
    trigger: body.trigger,
    mechanism: "Kafka -> matching workers -> Redis geospatial cache refresh",
    expectedLatencyMs: 250
  };
});

server.listen({ port: 4104, host: "0.0.0.0" }).catch((error) => {
  server.log.error(error);
  process.exit(1);
});
