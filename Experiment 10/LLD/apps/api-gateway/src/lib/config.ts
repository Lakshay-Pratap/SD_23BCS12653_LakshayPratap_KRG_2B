export const config = {
  port: Number(process.env.API_GATEWAY_PORT ?? 4000),
  services: {
    auth: process.env.AUTH_SERVICE_URL ?? "http://localhost:4101",
    users: process.env.USER_SERVICE_URL ?? "http://localhost:4102",
    chat: process.env.CHAT_SERVICE_URL ?? "http://localhost:4103",
    matching: process.env.MATCHING_SERVICE_URL ?? "http://localhost:4104",
    moderation: process.env.MODERATION_SERVICE_URL ?? "http://localhost:4105",
    recommendation: process.env.RECOMMENDATION_SERVICE_URL ?? "http://localhost:4106",
    notification: process.env.NOTIFICATION_SERVICE_URL ?? "http://localhost:4107"
  }
};
