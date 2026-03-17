import { d as defineEventHandler, u as useDB, a as getRouterParam, c as readBody, a1 as updateDocsSiteSchema, f as createError, $ as getDocsSiteBySlug, a2 as updateDocsSite } from '../../../nitro/nitro.mjs';
import { a as requireAuth } from '../../../_/auth.mjs';
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

const _siteSlug__put = defineEventHandler(async (event) => {
  const user = requireAuth(event);
  const db = useDB();
  const siteSlug = getRouterParam(event, "siteSlug");
  const body = await readBody(event);
  const parsed = updateDocsSiteSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation failed",
      data: { errors: parsed.error.flatten().fieldErrors }
    });
  }
  const result = await getDocsSiteBySlug(db, siteSlug);
  if (!result) {
    throw createError({ statusCode: 404, statusMessage: "Docs site not found" });
  }
  return updateDocsSite(db, result.site.id, user.id, parsed.data);
});

export { _siteSlug__put as default };
//# sourceMappingURL=_siteSlug_.put.mjs.map
