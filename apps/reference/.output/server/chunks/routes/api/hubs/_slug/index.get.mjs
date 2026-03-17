import { d as defineEventHandler, u as useDB, a as getRouterParam, g as getQuery, an as getHubBySlug, f as createError, aL as listPosts } from '../../../../nitro/nitro.mjs';
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

const index_get = defineEventHandler(async (event) => {
  const db = useDB();
  const slug = getRouterParam(event, "slug");
  const query = getQuery(event);
  const hub = await getHubBySlug(db, slug);
  if (!hub) {
    throw createError({ statusCode: 404, statusMessage: "Hub not found" });
  }
  return listPosts(db, hub.id, {
    type: query.type,
    limit: query.limit ? Number(query.limit) : void 0,
    offset: query.offset ? Number(query.offset) : void 0
  });
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
