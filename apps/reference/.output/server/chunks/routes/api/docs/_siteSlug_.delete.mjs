import { d as defineEventHandler, u as useDB, a as getRouterParam, $ as getDocsSiteBySlug, f as createError, a0 as deleteDocsSite } from '../../../nitro/nitro.mjs';
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

const _siteSlug__delete = defineEventHandler(async (event) => {
  const user = requireAuth(event);
  const db = useDB();
  const siteSlug = getRouterParam(event, "siteSlug");
  const result = await getDocsSiteBySlug(db, siteSlug);
  if (!result) {
    throw createError({ statusCode: 404, statusMessage: "Docs site not found" });
  }
  return deleteDocsSite(db, result.site.id, user.id);
});

export { _siteSlug__delete as default };
//# sourceMappingURL=_siteSlug_.delete.mjs.map
