import { d as defineEventHandler, u as useDB, a as getRouterParam, aR as getPathBySlug, f as createError } from '../../../nitro/nitro.mjs';
import { g as getOptionalUser } from '../../../_/auth.mjs';
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

const _slug__get = defineEventHandler(async (event) => {
  const db = useDB();
  const slug = getRouterParam(event, "slug");
  const user = getOptionalUser(event);
  const path = await getPathBySlug(db, slug, user == null ? void 0 : user.id);
  if (!path) {
    throw createError({ statusCode: 404, statusMessage: "Learning path not found" });
  }
  return path;
});

export { _slug__get as default };
//# sourceMappingURL=_slug_.get.mjs.map
