import { d as defineEventHandler, u as useDB, a as getRouterParam, c as readBody, w as updateContentSchema, f as createError, x as updateContent } from '../../../nitro/nitro.mjs';
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

const _id__put = defineEventHandler(async (event) => {
  const user = requireAuth(event);
  const db = useDB();
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const parsed = updateContentSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation failed",
      data: { errors: parsed.error.flatten().fieldErrors }
    });
  }
  const content = await updateContent(db, id, user.id, body);
  if (!content) {
    throw createError({ statusCode: 404, statusMessage: "Content not found or not owned by you" });
  }
  return content;
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
