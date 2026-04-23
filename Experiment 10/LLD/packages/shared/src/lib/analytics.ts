import type { AnalyticsSnapshot, ChatMessage, ModerationQueueItem } from "../contracts/domain";

export function buildAnalyticsSnapshot(
  messages: ChatMessage[],
  moderationQueue: ModerationQueueItem[]
): AnalyticsSnapshot {
  return {
    dailyActiveUsers: 1284,
    matchAcceptanceRate: 0.63,
    messagesPerMinute: Number((messages.length * 11.7).toFixed(1)),
    moderationBacklog: moderationQueue.length,
    experimentLift: "+8.4%"
  };
}
