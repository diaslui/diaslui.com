#!/bin/bash

bunx prisma generate
bunx prisma migrate deploy

bun run scripts/creater-starter-user.ts
exec "$@"
