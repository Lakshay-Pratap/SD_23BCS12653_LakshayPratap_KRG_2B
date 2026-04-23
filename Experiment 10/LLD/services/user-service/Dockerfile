FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY services/user-service/package.json services/user-service/package.json
RUN npm ci

COPY packages/shared packages/shared
COPY services/user-service services/user-service
RUN npm run build --workspace @campusconnect/shared && npm run build --workspace @campusconnect/user-service

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/services/user-service/package.json ./services/user-service/package.json
COPY --from=builder /app/services/user-service/dist ./services/user-service/dist

EXPOSE 4102
CMD ["npm", "run", "start", "--workspace", "@campusconnect/user-service"]
