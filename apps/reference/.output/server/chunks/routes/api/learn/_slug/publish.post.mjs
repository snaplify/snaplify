import { d as defineEventHandler, u as useDB, a as getRouterParam, aR as getPathBySlug, f as createError, b2 as publishPath } from '../../../../nitro/nitro.mjs';
import { a as requireAuth } from '../../../../_/auth.mjs';
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

const publish_post = defineEventHandler(async (event) => {
  const user = requireAuth(event);
  const db = useDB();
  const slug = getRouterParam(event, "slug");
  const path = await getPathBySlug(db, slug);
  if (!path) throw createError({ statusCode: 404, message: "Path not found" });
  return publishPath(db, path.id, user.id);
});

export { publish_post as default };
//# sourceMappingURL=publish.post.mjs.map
