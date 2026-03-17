import { d as defineEventHandler, f as createError, a as getRouterParam, u as useDB, bV as deleteVideoCategory } from '../../../../nitro/nitro.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  if (!(auth == null ? void 0 : auth.user)) {
    throw createError({ statusCode: 401, statusMessage: "Authentication required" });
  }
  const user = auth.user;
  if (user.role !== "admin" && user.role !== "staff") {
    throw createError({ statusCode: 403, statusMessage: "Admin access required" });
  }
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Category ID required" });
  }
  const db = useDB();
  const deleted = await deleteVideoCategory(db, id);
  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: "Category not found" });
  }
  return { success: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
