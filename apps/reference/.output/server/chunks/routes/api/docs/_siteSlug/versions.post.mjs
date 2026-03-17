import { d as defineEventHandler, u as useDB, a as getRouterParam, c as readBody, aa as createDocsVersionSchema, f as createError, ab as createDocsVersion } from '../../../../nitro/nitro.mjs';
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

const versions_post = defineEventHandler(async (event) => {
  const user = requireAuth(event);
  const db = useDB();
  const siteSlug = getRouterParam(event, "siteSlug");
  const body = await readBody(event);
  const parsed = createDocsVersionSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation failed",
      data: { errors: parsed.error.flatten().fieldErrors }
    });
  }
  return createDocsVersion(db, siteSlug, user.id, parsed.data);
});

export { versions_post as default };
//# sourceMappingURL=versions.post.mjs.map
