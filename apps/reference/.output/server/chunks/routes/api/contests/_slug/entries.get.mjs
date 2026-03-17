import { d as defineEventHandler, u as useDB, a as getRouterParam, f as createError, O as getContestBySlug, S as listContestEntries } from '../../../../nitro/nitro.mjs';
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

const entries_get = defineEventHandler(async (event) => {
  const db = useDB();
  const slug = getRouterParam(event, "slug");
  if (!slug) throw createError({ statusCode: 400, message: "Slug required" });
  const contest = await getContestBySlug(db, slug);
  if (!contest) throw createError({ statusCode: 404, message: "Contest not found" });
  return listContestEntries(db, contest.id);
});

export { entries_get as default };
//# sourceMappingURL=entries.get.mjs.map
