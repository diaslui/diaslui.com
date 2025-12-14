#!/bin/bash

bunx prisma generate
bunx prisma migrate dev
bun run scripts/creater-starter-user.ts

bun run start


exec "$@"
