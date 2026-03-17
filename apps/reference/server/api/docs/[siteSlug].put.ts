import { getDocsSiteBySlug, updateDocsSite } from '@commonpub/server';
import { updateDocsSiteSchema } from '@commonpub/schema';

export default defineEventHandler(async (event) => {
  const user = requireAuth(event);
  const db = useDB();
  const siteSlug = getRouterParam(event, 'siteSlug')!;
  const body = await readBody(event);

  const parsed = updateDocsSiteSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: { errors: parsed.error.flatten().fieldErrors },
    });
  }

  const result = await getDocsSiteBySlug(db, siteSlug);
  if (!result) {
    throw createError({ statusCode: 404, statusMessage: 'Docs site not found' });
  }

  return updateDocsSite(db, result.site.id, user.id, parsed.data);
});
