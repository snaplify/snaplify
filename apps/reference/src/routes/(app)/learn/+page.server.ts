import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { listPaths } from '$lib/server/learning';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.config.features.learning) {
    error(404, 'Learning system is not enabled');
  }

  const page = Number(url.searchParams.get('page') ?? '1');
  const difficulty = url.searchParams.get('difficulty') ?? undefined;
  const limit = 20;
  const offset = (page - 1) * limit;

  const { items, total } = await listPaths(locals.db, {
    status: 'published',
    difficulty,
    limit,
    offset,
  });

  return { items, total, page, difficulty };
};
