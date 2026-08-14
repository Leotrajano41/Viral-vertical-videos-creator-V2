# =====================================================
# VIRAL VERTICAL VIDEOS CREATOR v2.0 - WORKER DOCKERFILE
# Node.js 20 Alpine + FFmpeg + Fonts
# =====================================================

FROM node:20-alpine AS base

# Install FFmpeg and required fonts
RUN apk add --no-cache ffmpeg font-montserrat fontconfig

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install production dependencies
RUN npm ci

# Copy application source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript workers
RUN npm run build || true

ENV NODE_ENV=production

# Command to execute BullMQ Workers Pool
CMD ["npx", "ts-node", "workers/index.ts"]
