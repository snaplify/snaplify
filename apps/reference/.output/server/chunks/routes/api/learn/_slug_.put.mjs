import { d as defineEventHandler, u as useDB, a as getRouterParam, c as readBody, aT as updateLearningPathSchema, f as createError, aR as getPathBySlug, aU as updatePath } from '../../../nitro/nitro.mjs';
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

const _slug__put = defineEventHandler(async (event) => {
  const user = requireAuth(event);
  const db = useDB();
  const slug = getRouterParam(event, "slug");
  const body = await readBody(event);
  const parsed = updateLearningPathSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation failed",
      data: { errors: parsed.error.flatten().fieldErrors }
    });
  }
  const path = await getPathBySlug(db, slug);
  if (!path) throw createError({ statusCode: 404, statusMessage: "Path not found" });
  return updatePath(db, path.id, user.id, parsed.data);
});

export { _slug__put as default };
//# sourceMappingURL=_slug_.put.mjs.map
