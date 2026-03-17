import { getHubBySlug, listHubGallery } from '@commonpub/server';

export default defineEventHandler(async (event) => {
  const db = useDB();
  const slug = getRouterParam(event, 'slug');
  const query = getQuery(event);

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Hub slug is required' });
  }

  const hub = await getHubBySlug(db, slug);
  if (!hub) {
    throw createError({ statusCode: 404, statusMessage: 'Hub not found' });
  }

  return listHubGallery(db, hub.id, {
    limit: query.limit ? Number(query.limit) : undefined,
    offset: query.offset ? Number(query.offset) : undefined,
  });
});
