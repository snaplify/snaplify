import { d as defineEventHandler, u as useDB, g as getQuery, L as listContent } from '../../nitro/nitro.mjs';
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

const index_get = defineEventHandler(async (event) => {
  var _a;
  const db = useDB();
  const query = getQuery(event);
  return listContent(db, {
    status: (_a = query.status) != null ? _a : "published",
    type: query.type,
    featured: query.featured === "true" ? true : void 0,
    difficulty: query.difficulty,
    search: query.search,
    tag: query.tag,
    sort: query.sort,
    limit: query.limit ? Number(query.limit) : void 0,
    offset: query.offset ? Number(query.offset) : void 0
  });
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
