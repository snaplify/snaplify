import { listPosts, getHubBySlug } from '@commonpub/server';

export default defineEventHandler(async (event) => {
  const db = useDB();
  const slug = getRouterParam(event, 'slug')!;
  const query = getQuery(event);

  const hub = await getHubBySlug(db, slug);
  if (!hub) {
    throw createError({ statusCode: 404, statusMessage: 'Hub not found' });
  }

  return listPosts(db, hub.id, {
    type: query.type as string | undefined,
    limit: query.limit ? Number(query.limit) : undefined,
    offset: query.offset ? Number(query.offset) : undefined,
  });
});
