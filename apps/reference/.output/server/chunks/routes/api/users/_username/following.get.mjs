import { d as defineEventHandler, u as useDB, a as getRouterParam, g as getQuery, f as createError, br as getUserByUsername, bH as listFollowing } from '../../../../nitro/nitro.mjs';
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

const following_get = defineEventHandler(async (event) => {
  const db = useDB();
  const username = getRouterParam(event, "username");
  const query = getQuery(event);
  if (!username) {
    throw createError({ statusCode: 400, statusMessage: "Username is required" });
  }
  const target = await getUserByUsername(db, username);
  if (!target) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }
  return listFollowing(db, target.id, {
    limit: query.limit ? Number(query.limit) : void 0,
    offset: query.offset ? Number(query.offset) : void 0
  });
});

export { following_get as default };
//# sourceMappingURL=following.get.mjs.map
