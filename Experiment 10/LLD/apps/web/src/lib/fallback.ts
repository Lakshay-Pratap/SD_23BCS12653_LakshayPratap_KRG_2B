import type { DashboardPayload } from "@campusconnect/shared";

export const fallbackDashboard: DashboardPayload = {
  profile: {
    id: "user-1",
    name: "Lakshay Pratap",
    handle: "lakshay.pratap",
    role: "user",
    bio: "Distributed systems enthusiast building campus mobility tools.",
    campus: "North Campus",
    department: "Computer Science",
    interests: ["ai", "cycling", "hiking", "startups"],
    skills: ["typescript", "system-design", "ml"],
    geohash: "2861:7721:2",
    latitude: 28.6139,
    longitude: 77.209,
    routeTag: "blue-line-west",
    reputation: 91,
    locationLabel: "Metro Gate A",
    availability: "available",
    lastActiveAt: new Date().toISOString()
  },
  matches: [],
  posts: [],
  conversations: [],
  recommendations: {
    people: [],
    posts: [],
    explanation: {
      collaborativeSignals: ["fallback"],
      contentSignals: ["fallback"],
      experimentationBucket: "control"
    }
  },
  notifications: [],
  moderationQueue: [],
  health: [],
  metrics: [],
  analytics: {
    dailyActiveUsers: 0,
    matchAcceptanceRate: 0,
    messagesPerMinute: 0,
    moderationBacklog: 0,
    experimentLift: "0%"
  },
  featureFlags: [],
  experiments: [],
  searchHighlights: [],
  capabilities: []
};

export const fallbackArchitecture = {
  topology: "Service-oriented campus networking platform",
  resilience: ["retry with backoff", "circuit breaker", "offline sync"],
  dataStores: ["PostgreSQL", "MongoDB", "Redis"],
  asyncBackbone: ["Kafka"]
};
