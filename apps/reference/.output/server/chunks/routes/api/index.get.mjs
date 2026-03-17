import { d as defineEventHandler, u as useDB, g as getQuery, L as listContent } from '../../nitro/nitro.mjs';
import { g as getOptionalUser } from '../../_/auth.mjs';
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

const index_get = defineEventHandler(async (event) => {
  var _a;
  const db = useDB();
  const query = getQuery(event);
  const user = getOptionalUser(event);
  const authorId = query.authorId;
  const isOwnContent = authorId && (user == null ? void 0 : user.id) === authorId;
  return listContent(db, {
    status: isOwnContent ? query.status : (_a = query.status) != null ? _a : "published",
    type: query.type,
    authorId,
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
