import Fastify from "fastify";
import { posts, profiles, rankPosts, scoreMatch } from "@campusconnect/shared";

const server = Fastify({ logger: true });

server.get("/health", async () => ({
  service: "recommendation-service",
  ok: true,
  latencyMs: 34
}));

server.get("/recommendations/:userId", async (request, reply) => {
  const { userId } = request.params as { userId: string };
  const profile = profiles.find((entry) => entry.id === userId);
  if (!profile) {
    return reply.code(404).send({ message: "User not found" });
  }

  return {
    people: profiles
      .filter((entry) => entry.id !== userId)
      .map((entry) => scoreMatch(profile, entry))
      .sort((left, right) => right.score - left.score)
      .slice(0, 3),
    posts: rankPosts(profile, posts),
    explanation: {
      collaborativeSignals: ["department affinity", "shared route", "campus overlap"],
      contentSignals: ["interest-tag overlap", "freshness boost", "moderation-safe boost"],
      experimentationBucket: "trust-signals"
    }
  };
});

server.get("/recommendations/:userId/explain", async (request) => {
  const { userId } = request.params as { userId: string };
  return {
    userId,
    model: "hybrid-cf-cbf-v1",
    pipeline: [
      "candidate generation from graph neighborhood",
      "geo-route affinity re-ranking",
      "content-safe post scoring",
      "feature-flagged experiment treatment"
    ]
  };
});

server.listen({ port: 4106, host: "0.0.0.0" }).catch((error) => {
  server.log.error(error);
  process.exit(1);
});
