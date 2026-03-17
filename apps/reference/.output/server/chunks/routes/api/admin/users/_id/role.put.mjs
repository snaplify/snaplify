import { d as defineEventHandler, u as useDB, a as getRouterParam, c as readBody, o as adminUpdateRoleSchema, f as createError, p as updateUserRole } from '../../../../../nitro/nitro.mjs';
import { r as requireAdmin } from '../../../../../_/auth.mjs';
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

const role_put = defineEventHandler(async (event) => {
  requireAdmin(event);
  const db = useDB();
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const parsed = adminUpdateRoleSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation failed",
      data: { errors: parsed.error.flatten().fieldErrors }
    });
  }
  return updateUserRole(db, id, parsed.data.role);
});

export { role_put as default };
//# sourceMappingURL=role.put.mjs.map
