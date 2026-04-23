import Fastify from "fastify";
import { moderationProvider, moderationQueue, moderateContent, posts, searchCampus } from "@campusconnect/shared";

const server = Fastify({ logger: true });

server.get("/health", async () => ({
  service: "moderation-service",
  ok: true,
  latencyMs: 36
}));

server.get("/posts", async () => posts);

server.get("/posts/search", async (request) => {
  const { q } = request.query as { q?: string };
  return searchCampus(q ?? "", [], posts);
});

server.post("/posts/anonymous", async (request) => {
  const body = request.body as { body: string; campus: string; category: "confession" | "opportunity" | "warning" | "question"; tags: string[] };
  const outcome = moderateContent(body.body);
  const status = outcome.flagged ? ("queued" as const) : ("published" as const);
  const post = {
    id: `post-${posts.length + 1}`,
    body: body.body,
    campus: body.campus,
    category: body.category,
    tags: body.tags,
    moderationScore: outcome.score,
    status,
    reports: 0,
    createdAt: new Date().toISOString(),
    authorHash: `anon-${Math.random().toString(16).slice(2, 6)}`
  };
  posts.unshift(post);
  if (status === "queued") {
    moderationQueue.unshift({
      postId: post.id,
      status: post.status,
      reports: post.reports,
      score: outcome.score,
      reasons: outcome.reasons,
      assignedModerator: "user-4"
    });
  }

  return {
    accepted: true,
    post,
    provider: moderationProvider(),
    ...outcome
  };
});

server.post("/reports", async (request) => {
  const body = request.body as { postId: string; reason: string };
  const post = posts.find((entry) => entry.id === body.postId);
  if (!post) {
    return { accepted: false };
  }
  post.reports += 1;
  if (post.reports >= 2) {
    post.status = "queued";
    if (!moderationQueue.find((entry) => entry.postId === post.id)) {
      moderationQueue.unshift({
        postId: post.id,
        status: post.status,
        reports: post.reports,
        score: post.moderationScore,
        reasons: ["user reports"],
        assignedModerator: "user-4"
      });
    }
  }
  return {
    accepted: true,
    postId: post.id,
    status: post.status
  };
});

server.get("/admin/queue", async () => moderationQueue);

server.get("/admin/summary", async () => ({
  provider: moderationProvider(),
  itemsPending: moderationQueue.length,
  averageReviewSlaMinutes: 14,
  autoApprovedToday: 91
}));

server.listen({ port: 4105, host: "0.0.0.0" }).catch((error) => {
  server.log.error(error);
  process.exit(1);
});
