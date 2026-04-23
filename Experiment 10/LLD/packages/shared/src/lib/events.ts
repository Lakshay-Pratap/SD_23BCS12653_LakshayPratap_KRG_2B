export const Topics = {
  ChatMessageCreated: "chat.message.created",
  ChatStatusUpdated: "chat.message.status.updated",
  ChatMediaUploaded: "chat.media.uploaded",
  AnonymousPostSubmitted: "anonymous.post.submitted",
  AnonymousPostModerated: "anonymous.post.moderated",
  MatchRecomputed: "match.recomputed",
  NotificationRequested: "notification.requested",
  RecommendationGenerated: "recommendation.generated",
  IdentityVerified: "identity.verified"
} as const;

export interface DomainEvent<TPayload> {
  id: string;
  topic: (typeof Topics)[keyof typeof Topics];
  emittedAt: string;
  payload: TPayload;
}
