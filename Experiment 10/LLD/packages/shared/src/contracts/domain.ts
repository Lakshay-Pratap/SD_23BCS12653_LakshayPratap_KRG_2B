export type UserRole = "user" | "admin" | "moderator";
export type DeliveryState = "sent" | "delivered" | "read";
export type PostStatus = "published" | "flagged" | "queued" | "rejected";
export type ConversationType = "direct" | "group";
export type DeliveryChannel = "in-app" | "push" | "email";

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  role: UserRole;
  bio: string;
  campus: string;
  department: string;
  interests: string[];
  skills: string[];
  geohash: string;
  latitude: number;
  longitude: number;
  routeTag: string;
  reputation: number;
  locationLabel: string;
  availability: "available" | "busy" | "offline";
  lastActiveAt: string;
}

export interface MatchCandidate {
  userId: string;
  score: number;
  sharedInterests: string[];
  routeAffinity: number;
  distanceKm: number;
  reason: string;
  compatibilityBand: "high" | "medium" | "emerging";
  geospatialBucket: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  attachments: ChatAttachment[];
  sentAt: string;
  deliveryState: DeliveryState;
  recipientIds: string[];
  messageType: "text" | "media" | "system";
  readBy: string[];
  deliveredTo: string[];
}

export interface ChatAttachment {
  id: string;
  kind: "image" | "video" | "document";
  url: string;
  fileName: string;
}

export interface ConversationSummary {
  id: string;
  title: string;
  type: ConversationType;
  participantIds: string[];
  preview: string;
  unread: number;
  lastMessageAt: string;
  offlineBacklog: number;
}

export interface AnonymousPost {
  id: string;
  category: "confession" | "opportunity" | "warning" | "question";
  body: string;
  campus: string;
  createdAt: string;
  tags: string[];
  moderationScore: number;
  status: PostStatus;
  reports: number;
  authorHash: string;
  recommendationScore?: number;
}

export interface RecommendationResult {
  people: MatchCandidate[];
  posts: AnonymousPost[];
  explanation: {
    collaborativeSignals: string[];
    contentSignals: string[];
    experimentationBucket: string;
  };
}

export interface ModerationOutcome {
  flagged: boolean;
  reasons: string[];
  score: number;
  requiresHumanReview: boolean;
}

export interface ModerationQueueItem {
  postId: string;
  status: PostStatus;
  reports: number;
  score: number;
  reasons: string[];
  assignedModerator?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  channel: DeliveryChannel;
  createdAt: string;
  severity: "info" | "warning" | "critical";
  read: boolean;
}

export interface ServiceHealth {
  service: string;
  ok: boolean;
  latencyMs: number;
  degraded?: boolean;
}

export interface FeedMetric {
  label: string;
  value: string;
  delta: string;
}

export interface AnalyticsSnapshot {
  dailyActiveUsers: number;
  matchAcceptanceRate: number;
  messagesPerMinute: number;
  moderationBacklog: number;
  experimentLift: string;
}

export interface FeatureFlag {
  key: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  owner: string;
}

export interface ExperimentVariant {
  name: string;
  trafficSplit: number;
  primaryMetric: string;
}

export interface ExperimentAssignment {
  key: string;
  cohort: string;
  activeVariant: string;
  variants: ExperimentVariant[];
}

export interface SearchResult {
  id: string;
  type: "profile" | "post";
  title: string;
  subtitle: string;
  score: number;
}

export interface SystemCapability {
  name: string;
  stack: string[];
  notes: string;
}

export interface DashboardPayload {
  profile: UserProfile;
  matches: MatchCandidate[];
  posts: AnonymousPost[];
  conversations: ConversationSummary[];
  recommendations: RecommendationResult;
  notifications: NotificationItem[];
  moderationQueue: ModerationQueueItem[];
  health: ServiceHealth[];
  metrics: FeedMetric[];
  analytics: AnalyticsSnapshot;
  featureFlags: FeatureFlag[];
  experiments: ExperimentAssignment[];
  searchHighlights: SearchResult[];
  capabilities: SystemCapability[];
}
