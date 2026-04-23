import type {
  AnonymousPost,
  ConversationSummary,
  ExperimentAssignment,
  FeatureFlag,
  ModerationQueueItem,
  NotificationItem,
  ChatMessage,
  FeedMetric,
  SystemCapability,
  UserProfile
} from "../contracts/domain";
import { createGeoBucket } from "./geospatial";

export const profiles: UserProfile[] = [
  {
    id: "user-1",
    name: "Lakshay Pratap",
    handle: "lakshay.pratap",
    role: "user",
    bio: "Distributed systems enthusiast building campus mobility tools.",
    campus: "North Campus",
    department: "Computer Science",
    interests: ["ai", "cycling", "hiking", "startups"],
    skills: ["typescript", "system-design", "ml"],
    geohash: createGeoBucket(28.6139, 77.209, 2),
    latitude: 28.6139,
    longitude: 77.209,
    routeTag: "blue-line-west",
    reputation: 91,
    locationLabel: "Metro Gate A",
    availability: "available",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 2).toISOString()
  },
  {
    id: "user-2",
    name: "Riya Kapoor",
    handle: "riya.builds",
    role: "moderator",
    bio: "Product builder organizing student founders and hack nights.",
    campus: "North Campus",
    department: "Information Systems",
    interests: ["startups", "design", "ai", "music"],
    skills: ["product", "figma", "pitching"],
    geohash: createGeoBucket(28.621, 77.215, 2),
    latitude: 28.621,
    longitude: 77.215,
    routeTag: "blue-line-west",
    reputation: 95,
    locationLabel: "Innovation Hub",
    availability: "available",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 4).toISOString()
  },
  {
    id: "user-3",
    name: "Kabir Shah",
    handle: "kabir.analytics",
    role: "user",
    bio: "Basketball fan and data engineer obsessed with streaming systems.",
    campus: "South Campus",
    department: "Data Science",
    interests: ["basketball", "ai", "reading", "cycling"],
    skills: ["python", "kafka", "sql"],
    geohash: createGeoBucket(28.55, 77.19, 2),
    latitude: 28.55,
    longitude: 77.19,
    routeTag: "yellow-line-south",
    reputation: 87,
    locationLabel: "Data Lab Annex",
    availability: "busy",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 9).toISOString()
  },
  {
    id: "user-4",
    name: "Sana Qureshi",
    handle: "sana.security",
    role: "admin",
    bio: "Cybersecurity volunteer helping clubs secure their communities.",
    campus: "North Campus",
    department: "Cybersecurity",
    interests: ["security", "reading", "music", "ai"],
    skills: ["threat-modeling", "go", "incident-response"],
    geohash: createGeoBucket(28.616, 77.206, 2),
    latitude: 28.616,
    longitude: 77.206,
    routeTag: "blue-line-west",
    reputation: 98,
    locationLabel: "Security Operations Room",
    availability: "offline",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 27).toISOString()
  },
  {
    id: "user-5",
    name: "Naina Verma",
    handle: "naina.ml",
    role: "user",
    bio: "Machine learning volunteer building safer student communities.",
    campus: "North Campus",
    department: "Artificial Intelligence",
    interests: ["ai", "safety", "cycling", "music"],
    skills: ["python", "moderation", "pytorch"],
    geohash: createGeoBucket(28.6179, 77.2084, 2),
    latitude: 28.6179,
    longitude: 77.2084,
    routeTag: "blue-line-west",
    reputation: 89,
    locationLabel: "Library Courtyard",
    availability: "available",
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 6).toISOString()
  }
];

export const posts: AnonymousPost[] = [
  {
    id: "post-1",
    category: "opportunity",
    body: "Looking for a co-founder to build a student safety app with route alerts.",
    campus: "North Campus",
    createdAt: new Date(Date.now() - 1000 * 60 * 52).toISOString(),
    tags: ["startups", "ai", "security"],
    moderationScore: 0.09,
    status: "published",
    reports: 0,
    authorHash: "anon-3f20"
  },
  {
    id: "post-2",
    category: "question",
    body: "Any data engineering folks interested in a Kafka study group before placements?",
    campus: "South Campus",
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    tags: ["sql", "kafka", "reading"],
    moderationScore: 0.11,
    status: "published",
    reports: 0,
    authorHash: "anon-4bb8"
  },
  {
    id: "post-3",
    category: "warning",
    body: "Anonymous harassment reports increased near the old parking corridor after 8 PM.",
    campus: "North Campus",
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    tags: ["safety", "security"],
    moderationScore: 0.18,
    status: "queued",
    reports: 2,
    authorHash: "anon-a11c"
  },
  {
    id: "post-4",
    category: "confession",
    body: "Quietly looking for teammates who want to prototype a campus SOS wearable this weekend.",
    campus: "North Campus",
    createdAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    tags: ["hardware", "security", "startups"],
    moderationScore: 0.07,
    status: "published",
    reports: 0,
    authorHash: "anon-f821"
  }
];

export const messages: ChatMessage[] = [
  {
    id: "msg-1",
    conversationId: "conv-1",
    senderId: "user-2",
    body: "We have room for two more people in the campus founders roundtable.",
    attachments: [],
    sentAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    deliveryState: "read",
    recipientIds: ["user-1"],
    messageType: "text",
    readBy: ["user-1"],
    deliveredTo: ["user-1"]
  },
  {
    id: "msg-2",
    conversationId: "conv-1",
    senderId: "user-1",
    body: "Count me in. I can bring the matching service draft too.",
    attachments: [],
    sentAt: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
    deliveryState: "delivered",
    recipientIds: ["user-2"],
    messageType: "text",
    readBy: [],
    deliveredTo: ["user-2"]
  },
  {
    id: "msg-3",
    conversationId: "conv-2",
    senderId: "user-3",
    body: "Offline sync is working in the test build. Want me to demo it later?",
    attachments: [
      {
        id: "att-1",
        kind: "document",
        url: "https://cdn.campusconnect.dev/offline-sync-notes.pdf",
        fileName: "offline-sync-notes.pdf"
      }
    ],
    sentAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    deliveryState: "sent",
    recipientIds: ["user-1", "user-4"],
    messageType: "media",
    readBy: [],
    deliveredTo: ["user-1"]
  },
  {
    id: "msg-4",
    conversationId: "conv-2",
    senderId: "user-4",
    body: "Yes. Let’s review moderation webhooks after class.",
    attachments: [],
    sentAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    deliveryState: "sent",
    recipientIds: ["user-1", "user-3"],
    messageType: "text",
    readBy: [],
    deliveredTo: ["user-1", "user-3"]
  }
];

export const conversations: ConversationSummary[] = [
  {
    id: "conv-1",
    title: "Riya Kapoor",
    type: "direct",
    participantIds: ["user-1", "user-2"],
    preview: "Count me in. I can bring the matching service draft too.",
    unread: 1,
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
    offlineBacklog: 0
  },
  {
    id: "conv-2",
    title: "Safety Systems Working Group",
    type: "group",
    participantIds: ["user-1", "user-3", "user-4"],
    preview: "Yes. Let’s review moderation webhooks after class.",
    unread: 2,
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    offlineBacklog: 3
  }
];

export const notifications: NotificationItem[] = [
  {
    id: "notif-1",
    userId: "user-1",
    title: "High-confidence route match nearby",
    body: "Riya and Naina are both within your geohash bucket and share startup interests.",
    channel: "in-app",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    severity: "info",
    read: false
  },
  {
    id: "notif-2",
    userId: "user-1",
    title: "Moderation escalation update",
    body: "A safety-related anonymous post was routed to human review within SLA.",
    channel: "push",
    createdAt: new Date(Date.now() - 1000 * 60 * 17).toISOString(),
    severity: "warning",
    read: true
  }
];

export const moderationQueue: ModerationQueueItem[] = [
  {
    postId: "post-3",
    status: "queued",
    reports: 2,
    score: 0.71,
    reasons: ["safety escalation", "repeat reports"],
    assignedModerator: "user-4"
  }
];

export const feedMetrics: FeedMetric[] = [
  { label: "Realtime messages / min", value: "142", delta: "+18%" },
  { label: "Match recomputations / hr", value: "3.8k", delta: "+11%" },
  { label: "Flagged anonymous posts", value: "27", delta: "-6%" },
  { label: "P95 gateway latency", value: "184 ms", delta: "-23 ms" }
];

export const featureFlags: FeatureFlag[] = [
  {
    key: "feature.liveRoutePresence",
    description: "Shows nearby students within the same mobility corridor.",
    enabled: true,
    rolloutPercentage: 100,
    owner: "matching-platform"
  },
  {
    key: "feature.hybridRecommendations",
    description: "Blends collaborative and content-based ranking.",
    enabled: true,
    rolloutPercentage: 75,
    owner: "recommendation-platform"
  },
  {
    key: "feature.aiModerationEscalation",
    description: "Uses heuristic toxicity scoring before human review.",
    enabled: true,
    rolloutPercentage: 100,
    owner: "trust-and-safety"
  }
];

export const experiments: ExperimentAssignment[] = [
  {
    key: "exp.match-card-copy",
    cohort: "north-campus-power-users",
    activeVariant: "trust-signals",
    variants: [
      { name: "control", trafficSplit: 50, primaryMetric: "match_accept_rate" },
      { name: "trust-signals", trafficSplit: 50, primaryMetric: "match_accept_rate" }
    ]
  }
];

export const capabilities: SystemCapability[] = [
  {
    name: "Identity and access",
    stack: ["JWT", "OAuth 2.0", "RBAC", "Blockchain identity hash"],
    notes: "Gateway validates tokens while auth-service issues access and refresh tokens."
  },
  {
    name: "Realtime messaging",
    stack: ["Socket.IO", "Kafka topics", "MongoDB sync cursor", "Redis presence"],
    notes: "Delivery-state transitions are event-driven and replayable for offline users."
  },
  {
    name: "Recommendation and matching",
    stack: ["Geo-bucketing", "Collaborative scoring", "Content ranking", "Feature flags"],
    notes: "Location, route affinity, interest overlap, and experiments all influence ranking."
  }
];
