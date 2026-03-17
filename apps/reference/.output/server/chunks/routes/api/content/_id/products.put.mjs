import { d as defineEventHandler, u as useDB, a as getRouterParam, f as createError, c as readBody, B as syncContentProducts } from '../../../../nitro/nitro.mjs';
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

const products_put = defineEventHandler(async (event) => {
  const db = useDB();
  requireAuth(event);
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Content ID is required" });
  }
  const body = await readBody(event);
  if (!Array.isArray(body == null ? void 0 : body.items)) {
    throw createError({ statusCode: 400, statusMessage: "items array is required" });
  }
  return syncContentProducts(db, id, body.items);
});

export { products_put as default };
//# sourceMappingURL=products.put.mjs.map
