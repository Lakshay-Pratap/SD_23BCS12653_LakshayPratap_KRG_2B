import {
  buildAnalyticsSnapshot,
  capabilities,
  CircuitBreaker,
  conversations,
  experiments,
  featureFlags,
  feedMetrics,
  messages,
  moderationQueue,
  notifications,
  posts,
  profiles,
  searchCampus,
  withRetry
} from "@campusconnect/shared";
import type {
  AnonymousPost,
  ChatMessage,
  ConversationSummary,
  DashboardPayload,
  MatchCandidate,
  NotificationItem,
  RecommendationResult,
  SearchResult,
  ServiceHealth,
  UserProfile
} from "@campusconnect/shared";
import { config } from "./config";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | {
      [key: string]: JsonValue;
    };

const breakers = {
  auth: new CircuitBreaker(),
  users: new CircuitBreaker(),
  chat: new CircuitBreaker(),
  matching: new CircuitBreaker(),
  moderation: new CircuitBreaker(),
  recommendation: new CircuitBreaker(),
  notification: new CircuitBreaker()
};

async function fetchJson<T>(service: keyof typeof config.services, path: string, fallback: T): Promise<T> {
  const url = `${config.services[service]}${path}`;

  try {
    return await breakers[service].execute(async () =>
      withRetry(async () => {
        const response = await fetch(url, {
          headers: {
            "content-type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error(`Failed request for ${url}`);
        }
        return (await response.json()) as T;
      })
    );
  } catch {
    return fallback;
  }
}

export async function getSystemHealth(): Promise<ServiceHealth[]> {
  return Promise.all([
    fetchJson("auth", "/health", { service: "auth-service", ok: false, latencyMs: 0, degraded: true }),
    fetchJson("users", "/health", { service: "user-service", ok: false, latencyMs: 0, degraded: true }),
    fetchJson("chat", "/health", { service: "chat-service", ok: false, latencyMs: 0, degraded: true }),
    fetchJson("matching", "/health", { service: "matching-service", ok: false, latencyMs: 0, degraded: true }),
    fetchJson("moderation", "/health", { service: "moderation-service", ok: false, latencyMs: 0, degraded: true }),
    fetchJson("recommendation", "/health", {
      service: "recommendation-service",
      ok: false,
      latencyMs: 0,
      degraded: true
    }),
    fetchJson("notification", "/health", { service: "notification-service", ok: false, latencyMs: 0, degraded: true })
  ]);
}

export async function getDashboard(userId: string): Promise<DashboardPayload> {
  const [profile, matches, postsFeed, userConversations, recommendations, health, userNotifications] = await Promise.all([
    fetchJson("users", `/profiles/${userId}`, profiles[0]),
    fetchJson("matching", `/matches/${userId}`, [] as MatchCandidate[]),
    fetchJson("moderation", "/posts", posts),
    fetchJson("chat", `/conversations/${userId}`, conversations),
    fetchJson("recommendation", `/recommendations/${userId}`, {
      people: [],
      posts: posts.slice(0, 2),
      explanation: {
        collaborativeSignals: [],
        contentSignals: [],
        experimentationBucket: "control"
      }
    } as RecommendationResult),
    getSystemHealth(),
    fetchJson("notification", `/notifications/${userId}`, notifications.filter((item) => item.userId === userId))
  ]);

  return {
    profile,
    matches,
    posts: postsFeed,
    conversations: userConversations,
    recommendations,
    notifications: userNotifications,
    moderationQueue,
    health,
    metrics: feedMetrics,
    analytics: buildAnalyticsSnapshot(messages, moderationQueue),
    featureFlags,
    experiments,
    searchHighlights: searchCampus(profile.interests[0] ?? "ai", profiles, posts),
    capabilities
  };
}

export async function proxyPost<TResponse>(
  service: keyof typeof config.services,
  path: string,
  body: JsonValue,
  fallback: TResponse
): Promise<TResponse> {
  const url = `${config.services[service]}${path}`;

  try {
    return await breakers[service].execute(async () => {
      const response = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        throw new Error(`Failed POST request for ${url}`);
      }
      return (await response.json()) as TResponse;
    });
  } catch {
    return fallback;
  }
}

export async function searchDirectory(query: string): Promise<SearchResult[]> {
  const [directoryResults, postResults] = await Promise.all([
    fetchJson("users", `/profiles/search?q=${encodeURIComponent(query)}`, searchCampus(query, profiles, [])),
    fetchJson("moderation", `/posts/search?q=${encodeURIComponent(query)}`, searchCampus(query, [], posts))
  ]);

  return [...directoryResults, ...postResults].sort((left, right) => right.score - left.score).slice(0, 10);
}

export async function getArchitectureSummary() {
  return {
    topology: "Modular monolith today, service-ready boundaries with gateway fan-out and event-driven contracts",
    resilience: ["retry with backoff", "circuit breaker", "gateway fallbacks", "offline sync replay"],
    dataStores: ["PostgreSQL for identity and social graph", "MongoDB for posts and chat", "Redis for cache and geo"],
    asyncBackbone: ["Kafka topics for chat, moderation, notifications, and recommendation refreshes"]
  };
}
