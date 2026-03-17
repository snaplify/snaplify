import { getHubBySlug, listHubProducts } from '@commonpub/server';

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

  return listHubProducts(db, hub.id, {
    search: query.search as string | undefined,
    category: query.category as string | undefined,
    status: query.status as string | undefined,
    limit: query.limit ? Number(query.limit) : undefined,
    offset: query.offset ? Number(query.offset) : undefined,
  });
});
