import { deleteVideoCategory } from '@commonpub/server';

export default defineEventHandler(async (event) => {
  const auth = event.context.auth;
  if (!auth?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' });
  }

  const user = auth.user as { id: string; role?: string };
  if (user.role !== 'admin' && user.role !== 'staff') {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' });
  }

  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Category ID required' });
  }

  const db = useDB();
  const deleted = await deleteVideoCategory(db, id);
  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' });
  }

  return { success: true };
});
