#!/bin/bash

bunx prisma generate
prisma migrate deploy

bun run scripts/creater-starter-user.ts

bun run start


exec "$@"
