import { d as defineEventHandler, u as useDB, a as getRouterParam, g as getQuery, f as createError, am as getHubBySlug, ar as listHubGallery } from '../../../../nitro/nitro.mjs';
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

const gallery_get = defineEventHandler(async (event) => {
  const db = useDB();
  const slug = getRouterParam(event, "slug");
  const query = getQuery(event);
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Hub slug is required" });
  }
  const hub = await getHubBySlug(db, slug);
  if (!hub) {
    throw createError({ statusCode: 404, statusMessage: "Hub not found" });
  }
  return listHubGallery(db, hub.id, {
    limit: query.limit ? Number(query.limit) : void 0,
    offset: query.offset ? Number(query.offset) : void 0
  });
});

export { gallery_get as default };
//# sourceMappingURL=gallery.get.mjs.map
