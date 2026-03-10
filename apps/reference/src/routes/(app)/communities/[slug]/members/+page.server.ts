import { error } from '@sveltejs/kit';
import { getCommunityBySlug, listMembers } from '$lib/server/community';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.config.features.communities) {
    error(404, 'Communities are not enabled');
  }

  const community = await getCommunityBySlug(
    event.locals.db,
    event.params.slug,
    event.locals.user?.id,
  );

  if (!community) {
    error(404, 'Community not found');
  }

  const members = await listMembers(event.locals.db, community.id);

  return { community, members };
};
