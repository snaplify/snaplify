import { users, follows } from '@commonpub/schema';
import { sql, desc, ilike, or } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const db = useDB();
  const query = getQuery(event);

  const limit = Math.min(Number(query.limit) || 20, 50);
  const offset = Number(query.offset) || 0;
  const search = (query.q || query.search) as string | undefined;

  const conditions = [];
  if (search) {
    const term = `%${search}%`;
    conditions.push(or(ilike(users.username, term), ilike(users.displayName, term)));
  }

  const where = conditions.length > 0 ? conditions[0] : undefined;

  const rows = await db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      headline: users.bio,
      avatarUrl: users.avatarUrl,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(where)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset);

  // Get follower counts in bulk
  const userIds = rows.map((r) => r.id);
  const followerCounts: Record<string, number> = {};

  if (userIds.length > 0) {
    const counts = await db
      .select({
        followingId: follows.followingId,
        count: sql<number>`count(*)::int`,
      })
      .from(follows)
      .where(sql`${follows.followingId} = ANY(ARRAY[${sql.join(userIds.map((id) => sql`${id}::uuid`), sql`, `)}])`)
      .groupBy(follows.followingId);

    for (const c of counts) {
      followerCounts[c.followingId] = c.count;
    }
  }

  const items = rows.map((r) => ({
    id: r.id,
    username: r.username,
    displayName: r.displayName,
    headline: r.headline,
    avatarUrl: r.avatarUrl,
    followerCount: followerCounts[r.id] ?? 0,
  }));

  return { items };
});
