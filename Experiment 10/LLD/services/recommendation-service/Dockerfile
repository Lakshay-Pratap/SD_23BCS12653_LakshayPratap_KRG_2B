FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY services/recommendation-service/package.json services/recommendation-service/package.json
RUN npm ci

COPY packages/shared packages/shared
COPY services/recommendation-service services/recommendation-service
RUN npm run build --workspace @campusconnect/shared && npm run build --workspace @campusconnect/recommendation-service

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/services/recommendation-service/package.json ./services/recommendation-service/package.json
COPY --from=builder /app/services/recommendation-service/dist ./services/recommendation-service/dist

EXPOSE 4106
CMD ["npm", "run", "start", "--workspace", "@campusconnect/recommendation-service"]
