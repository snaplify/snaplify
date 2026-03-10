import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
  listFederationActivity,
  getFollowers,
  getFollowing,
} from '$lib/server/federation';
import { eq, and } from 'drizzle-orm';
import { followRelationships } from '@snaplify/schema';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.config.features.federation) {
    error(404, 'Federation is not enabled');
  }

  if (!locals.user) {
    error(401, 'Not authenticated');
  }

  const domain = locals.config.instance.domain;
  const actorUri = `https://${domain}/users/${locals.user.username}`;

  const [activityLog, followers, following, pendingRequests] = await Promise.all([
    listFederationActivity(locals.db, { limit: 20 }),
    getFollowers(locals.db, actorUri),
    getFollowing(locals.db, actorUri),
    locals.db
      .select()
      .from(followRelationships)
      .where(
        and(
          eq(followRelationships.followingActorUri, actorUri),
          eq(followRelationships.status, 'pending'),
        ),
      ),
  ]);

  return {
    activityLog,
    followers,
    following,
    pendingRequests,
    trustedInstances: locals.config.auth.trustedInstances ?? [],
    domain,
  };
};
