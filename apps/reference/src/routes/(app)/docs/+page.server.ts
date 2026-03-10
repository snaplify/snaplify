import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { listDocsSites } from '$lib/server/docs';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.config.features.docs) {
    error(404, 'Documentation system is not enabled');
  }

  const { items, total } = await listDocsSites(locals.db);
  return { sites: items, total };
};
