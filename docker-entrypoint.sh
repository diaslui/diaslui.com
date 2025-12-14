#!/bin/bash

bunx prisma generate
bunx prisma migrate dev
bun run start

bun run scripts/creater-starter-user.ts

exec "$@"
