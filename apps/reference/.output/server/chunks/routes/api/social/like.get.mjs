import { d as defineEventHandler, u as useDB, g as getQuery, bG as isLiked } from '../../../nitro/nitro.mjs';
import { a as requireAuth } from '../../../_/auth.mjs';
import 'drizzle-orm';
import 'drizzle-orm/pg-core';
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
import 'zod';
import 'drizzle-orm/node-postgres';
import 'pg';
import 'better-auth';
import 'better-auth/adapters/drizzle';
import 'better-auth/plugins';

const like_get = defineEventHandler(async (event) => {
  const user = requireAuth(event);
  const db = useDB();
  const query = getQuery(event);
  const liked = await isLiked(db, user.id, query.targetType, query.targetId);
  return { liked };
});

export { like_get as default };
//# sourceMappingURL=like.get.mjs.map
