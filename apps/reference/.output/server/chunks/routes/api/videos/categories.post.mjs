import { d as defineEventHandler, f as createError, c as readBody, bT as createVideoCategorySchema, u as useDB, bU as createVideoCategory } from '../../../nitro/nitro.mjs';
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

const categories_post = defineEventHandler(async (event) => {
  var _a, _b;
  const auth = event.context.auth;
  if (!(auth == null ? void 0 : auth.user)) {
    throw createError({ statusCode: 401, statusMessage: "Authentication required" });
  }
  const user = auth.user;
  if (user.role !== "admin" && user.role !== "staff") {
    throw createError({ statusCode: 403, statusMessage: "Admin access required" });
  }
  const body = await readBody(event);
  const parsed = createVideoCategorySchema.safeParse(body);
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: (_b = (_a = parsed.error.issues[0]) == null ? void 0 : _a.message) != null ? _b : "Invalid input" });
  }
  const db = useDB();
  return createVideoCategory(db, parsed.data);
});

export { categories_post as default };
//# sourceMappingURL=categories.post.mjs.map
