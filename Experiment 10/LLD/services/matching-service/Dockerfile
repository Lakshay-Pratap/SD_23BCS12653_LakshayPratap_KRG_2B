FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY services/matching-service/package.json services/matching-service/package.json
RUN npm ci

COPY packages/shared packages/shared
COPY services/matching-service services/matching-service
RUN npm run build --workspace @campusconnect/shared && npm run build --workspace @campusconnect/matching-service

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/services/matching-service/package.json ./services/matching-service/package.json
COPY --from=builder /app/services/matching-service/dist ./services/matching-service/dist

EXPOSE 4104
CMD ["npm", "run", "start", "--workspace", "@campusconnect/matching-service"]
