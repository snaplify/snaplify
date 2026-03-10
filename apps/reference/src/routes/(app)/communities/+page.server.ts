import { error } from '@sveltejs/kit';
import { listCommunities } from '$lib/server/community';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.config.features.communities) {
    error(404, 'Communities are not enabled');
  }

  const search = event.url.searchParams.get('search') ?? undefined;
  const joinPolicy = event.url.searchParams.get('joinPolicy') ?? undefined;
  const page = parseInt(event.url.searchParams.get('page') ?? '1', 10);
  const limit = 20;
  const offset = (page - 1) * limit;

  const { items, total } = await listCommunities(event.locals.db, {
    search,
    joinPolicy,
    limit,
    offset,
  });

  return { communities: items, total, page, search, joinPolicy };
};
