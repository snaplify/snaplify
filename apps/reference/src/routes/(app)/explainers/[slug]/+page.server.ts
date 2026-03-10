import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getContentBySlug, incrementViewCount } from '$lib/server/content';

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.config.features.explainers) {
    error(404, 'Explainer system is not enabled');
  }

  const item = await getContentBySlug(locals.db, params.slug, locals.user?.id);

  if (!item) {
    error(404, 'Explainer not found');
  }

  if (item.type !== 'explainer') {
    error(404, 'Explainer not found');
  }

  // Increment view count (fire-and-forget)
  incrementViewCount(locals.db, item.id).catch(() => {});

  return { item };
};
