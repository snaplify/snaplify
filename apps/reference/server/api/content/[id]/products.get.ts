import { listContentProducts } from '@commonpub/server';

export default defineEventHandler(async (event) => {
  const db = useDB();
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Content ID is required' });
  }

  return listContentProducts(db, id);
});
