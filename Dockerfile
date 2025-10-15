# Build stage
FROM node:18-alpine AS builder
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* .npmrc* ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# Run stage
FROM node:18-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
RUN npm ci --omit=dev --legacy-peer-deps
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "run", "start", "--", "-p", "8080"]
