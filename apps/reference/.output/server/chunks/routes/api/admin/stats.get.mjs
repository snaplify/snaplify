import { d as defineEventHandler, u as useDB, k as getPlatformStats } from '../../../nitro/nitro.mjs';
import { r as requireAdmin } from '../../../_/auth.mjs';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import 'zod';
import 'jose';
import 'node:fs';
import 'node:fs/promises';
import 'node:path';
import 'node:stream/promises';
import 'node:crypto';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:url';
import 'drizzle-orm/node-postgres';
import 'pg';
import 'better-auth';
import 'better-auth/adapters/drizzle';
import 'better-auth/plugins';

const stats_get = defineEventHandler(async (event) => {
  requireAdmin(event);
  const db = useDB();
  return getPlatformStats(db);
});

export { stats_get as default };
//# sourceMappingURL=stats.get.mjs.map
