#!/bin/sh
set -eu

echo "Waiting for database connection..."
until node -e "const { Client } = require('pg'); const client = new Client({ connectionString: process.env.DATABASE_URL }); client.connect().then(() => client.end()).then(() => process.exit(0)).catch(() => process.exit(1));" >/dev/null 2>&1; do
  echo "Database is unavailable, retrying in 2s..."
  sleep 2
done

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting application..."
exec node dist/src/main.js
