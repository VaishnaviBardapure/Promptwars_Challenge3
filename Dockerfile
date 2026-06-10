# Multi-stage Dockerfile for Vite + Express app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/server/index.js ./server/index.js
EXPOSE 4000
ENV NODE_ENV=production
CMD ["node", "server/index.js"]
