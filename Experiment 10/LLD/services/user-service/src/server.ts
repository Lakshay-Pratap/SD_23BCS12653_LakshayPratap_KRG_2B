import Fastify from "fastify";
import { createGeoBucket, featureFlags, profiles, searchCampus } from "@campusconnect/shared";

const server = Fastify({ logger: true });

server.get("/health", async () => ({
  service: "user-service",
  ok: true,
  latencyMs: 24
}));

server.get("/profiles/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  const profile = profiles.find((entry) => entry.id === id);
  if (!profile) {
    return reply.code(404).send({ message: "Profile not found" });
  }
  return profile;
});

server.get("/profiles", async (request) => {
  const { interest, role } = request.query as { interest?: string; role?: string };
  return profiles.filter(
    (profile) => (!interest || profile.interests.includes(interest)) && (!role || profile.role === role)
  );
});

server.get("/profiles/search", async (request) => {
  const { q } = request.query as { q?: string };
  return searchCampus(q ?? "", profiles, []);
});

server.get("/profiles/:id/feature-flags", async (request) => {
  const { id } = request.params as { id: string };
  return {
    userId: id,
    flags: featureFlags
  };
});

server.put("/profiles/:id/location", async (request, reply) => {
  const { id } = request.params as { id: string };
  const body = request.body as { latitude: number; longitude: number; routeTag: string };
  const profile = profiles.find((entry) => entry.id === id);
  if (!profile) {
    return reply.code(404).send({ message: "Profile not found" });
  }

  profile.latitude = body.latitude;
  profile.longitude = body.longitude;
  profile.routeTag = body.routeTag;
  profile.geohash = createGeoBucket(body.latitude, body.longitude, 2);
  profile.locationLabel = `Updated at ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
  profile.lastActiveAt = new Date().toISOString();

  return {
    updated: true,
    geohash: profile.geohash,
    routeTag: profile.routeTag,
    geospatialIndex: "redis:geo + geohash fan-out"
  };
});

server.listen({ port: 4102, host: "0.0.0.0" }).catch((error) => {
  server.log.error(error);
  process.exit(1);
});
