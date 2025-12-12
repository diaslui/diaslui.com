# syntax = docker/dockerfile:1
FROM oven/bun:1.1.24-slim AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS build

# Use bun.lock instead of bun.lockb
COPY bun.lock package.json ./
RUN bun install --ci

# Copy all project files
COPY . .

# Build the application (if you have build script)
RUN bun run build || true

# Clean and reinstall only production deps
RUN rm -rf node_modules && bun install --ci --production

FROM base
COPY --from=build /app /app

EXPOSE 3000
CMD ["bun", "run", "start"]
