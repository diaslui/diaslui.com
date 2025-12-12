FROM oven/bun:1.1.24-slim AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS build

COPY bun.lock package.json ./
RUN bun install --ci

COPY . .

RUN bun run build || true

RUN rm -rf node_modules && bun install --ci --production

FROM base
COPY --from=build /app /app

EXPOSE 3000
CMD ["bun", "run", "start"]
