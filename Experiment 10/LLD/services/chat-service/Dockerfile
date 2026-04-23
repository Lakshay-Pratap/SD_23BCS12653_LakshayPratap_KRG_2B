FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY services/chat-service/package.json services/chat-service/package.json
RUN npm ci

COPY packages/shared packages/shared
COPY services/chat-service services/chat-service
RUN npm run build --workspace @campusconnect/shared && npm run build --workspace @campusconnect/chat-service

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/services/chat-service/package.json ./services/chat-service/package.json
COPY --from=builder /app/services/chat-service/dist ./services/chat-service/dist

EXPOSE 4103
CMD ["npm", "run", "start", "--workspace", "@campusconnect/chat-service"]
