import { createDocsVersion } from '@commonpub/server';
import { createDocsVersionSchema } from '@commonpub/schema';

export default defineEventHandler(async (event) => {
  const user = requireAuth(event);
  const db = useDB();
  const siteSlug = getRouterParam(event, 'siteSlug')!;
  const body = await readBody(event);

  const parsed = createDocsVersionSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: { errors: parsed.error.flatten().fieldErrors },
    });
  }

  return createDocsVersion(db, siteSlug, user.id, parsed.data);
});
