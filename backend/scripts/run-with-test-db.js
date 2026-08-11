#!/usr/bin/env node
// Runs the given command with DATABASE_URL overridden to TEST_DATABASE_URL.
// Exists so `prisma migrate deploy` can target the integration-test database
// portably (Windows + POSIX CI runners) without shell-specific env syntax.
const { spawnSync } = require('child_process');
require('dotenv').config();

const [, , ...commandParts] = process.argv;
if (commandParts.length === 0) {
  console.error('Usage: node scripts/run-with-test-db.js <command> [args...]');
  process.exit(1);
}

if (!process.env.TEST_DATABASE_URL) {
  console.error('TEST_DATABASE_URL is not set — cannot migrate the integration-test database.');
  process.exit(1);
}

const result = spawnSync(commandParts.join(' '), {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
});

process.exit(result.status ?? 1);
