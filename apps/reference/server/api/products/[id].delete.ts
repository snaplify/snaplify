import { deleteProduct } from '@commonpub/server';

export default defineEventHandler(async (event) => {
  const db = useDB();
  requireAuth(event);
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Product ID is required' });
  }

  const deleted = await deleteProduct(db, id);

  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' });
  }

  return { deleted: true };
});
