import { searchProducts } from '@commonpub/server';

export default defineEventHandler(async (event) => {
  const db = useDB();
  const query = getQuery(event);

  return searchProducts(db, {
    search: query.q as string | undefined ?? query.search as string | undefined,
    category: query.category as string | undefined,
    status: query.status as string | undefined,
    hubId: query.hubId as string | undefined,
    limit: query.limit ? Number(query.limit) : undefined,
    offset: query.offset ? Number(query.offset) : undefined,
  });
});
