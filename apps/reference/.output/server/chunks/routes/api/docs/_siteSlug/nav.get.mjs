import { d as defineEventHandler, u as useDB, a as getRouterParam, g as getQuery, a3 as getDocsNav } from '../../../../nitro/nitro.mjs';
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

const nav_get = defineEventHandler(async (event) => {
  const db = useDB();
  const siteSlug = getRouterParam(event, "siteSlug");
  const query = getQuery(event);
  return getDocsNav(db, siteSlug, query.version);
});

export { nav_get as default };
//# sourceMappingURL=nav.get.mjs.map
