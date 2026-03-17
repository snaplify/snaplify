import { d as defineEventHandler, u as useDB, g as getQuery, bO as users, bP as follows } from '../../nitro/nitro.mjs';
import { or, ilike, desc, sql } from 'drizzle-orm';
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
  const db = useDB();
  const query = getQuery(event);
  const limit = Math.min(Number(query.limit) || 20, 50);
  const offset = Number(query.offset) || 0;
  const search = query.q || query.search;
  const conditions = [];
  if (search) {
    const term = `%${search}%`;
    conditions.push(or(ilike(users.username, term), ilike(users.displayName, term)));
  }
  const where = conditions.length > 0 ? conditions[0] : void 0;
  const rows = await db.select({
    id: users.id,
    username: users.username,
    displayName: users.displayName,
    headline: users.bio,
    avatarUrl: users.avatarUrl,
    createdAt: users.createdAt
  }).from(users).where(where).orderBy(desc(users.createdAt)).limit(limit).offset(offset);
  const userIds = rows.map((r) => r.id);
  const followerCounts = {};
  if (userIds.length > 0) {
    const counts = await db.select({
      followingId: follows.followingId,
      count: sql`count(*)::int`
    }).from(follows).where(sql`${follows.followingId} = ANY(ARRAY[${sql.join(userIds.map((id) => sql`${id}::uuid`), sql`, `)}])`).groupBy(follows.followingId);
    for (const c of counts) {
      followerCounts[c.followingId] = c.count;
    }
  }
  const items = rows.map((r) => {
    var _a;
    return {
      id: r.id,
      username: r.username,
      displayName: r.displayName,
      headline: r.headline,
      avatarUrl: r.avatarUrl,
      followerCount: (_a = followerCounts[r.id]) != null ? _a : 0
    };
  });
  return { items };
});

export { index_get as default };
//# sourceMappingURL=index.get10.mjs.map
