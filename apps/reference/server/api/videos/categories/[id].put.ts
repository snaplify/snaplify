import { updateVideoCategory } from '@commonpub/server';
import { createVideoCategorySchema } from '@commonpub/schema';

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

  const body = await readBody(event);
  const parsed = createVideoCategorySchema.partial().safeParse(body);
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message ?? 'Invalid input' });
  }

  const db = useDB();
  const result = await updateVideoCategory(db, id, parsed.data);
  if (!result) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' });
  }

  return result;
});
