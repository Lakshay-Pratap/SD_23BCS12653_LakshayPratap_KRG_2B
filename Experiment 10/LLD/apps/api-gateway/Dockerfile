FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY apps/api-gateway/package.json apps/api-gateway/package.json
RUN npm ci

COPY packages/shared packages/shared
COPY apps/api-gateway apps/api-gateway
RUN npm run build --workspace @campusconnect/shared && npm run build --workspace @campusconnect/api-gateway

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/api-gateway/package.json ./apps/api-gateway/package.json
COPY --from=builder /app/apps/api-gateway/dist ./apps/api-gateway/dist

EXPOSE 4000
CMD ["npm", "run", "start", "--workspace", "@campusconnect/api-gateway"]
