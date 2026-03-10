import { error, redirect } from '@sveltejs/kit';
import { authGuard } from '@snaplify/auth';
import { communityMembers, communities, users } from '@snaplify/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.config.features.communities) {
    error(404, 'Communities are not enabled');
  }

  const guard = authGuard(event);
  if (!guard.authorized) {
    redirect(guard.status ?? 303, guard.redirectTo ?? '/auth/sign-in');
  }

  const userId = event.locals.user!.id;

  const rows = await event.locals.db
    .select({
      member: communityMembers,
      community: {
        id: communities.id,
        name: communities.name,
        slug: communities.slug,
        iconUrl: communities.iconUrl,
        memberCount: communities.memberCount,
        postCount: communities.postCount,
      },
    })
    .from(communityMembers)
    .innerJoin(communities, eq(communityMembers.communityId, communities.id))
    .where(eq(communityMembers.userId, userId))
    .orderBy(desc(communityMembers.joinedAt));

  const memberships = rows.map((row) => ({
    role: row.member.role,
    joinedAt: row.member.joinedAt,
    community: row.community,
  }));

  return { memberships };
};
