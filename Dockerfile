FROM oven/bun:1.1.24-slim AS base
RUN apt-get update && apt-get install -y curl \
  && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get install -y nodejs \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

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

#RUN bunx prisma generate

EXPOSE 3000

COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod a+x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
#CMD ["bun", "run", "dev"]
