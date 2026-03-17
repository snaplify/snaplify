import { getProductBySlug, listProductContent } from '@commonpub/server';

export default defineEventHandler(async (event) => {
  const db = useDB();
  const slug = getRouterParam(event, 'slug');
  const query = getQuery(event);

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' });
  }

  const product = await getProductBySlug(db, slug);
  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' });
  }

  return listProductContent(db, product.id, {
    limit: query.limit ? Number(query.limit) : undefined,
    offset: query.offset ? Number(query.offset) : undefined,
  });
});
