#!/bin/sh
set -e

echo "[holdline] applying database migrations..."
npx prisma migrate deploy

echo "[holdline] starting server..."
exec node dist/src/index.js
