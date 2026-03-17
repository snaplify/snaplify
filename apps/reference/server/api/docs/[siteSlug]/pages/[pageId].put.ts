import { updateDocsPage } from '@commonpub/server';
import { updateDocsPageSchema } from '@commonpub/schema';

export default defineEventHandler(async (event) => {
  const user = requireAuth(event);
  const db = useDB();
  const pageId = getRouterParam(event, 'pageId')!;
  const body = await readBody(event);

  const parsed = updateDocsPageSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: { errors: parsed.error.flatten().fieldErrors },
    });
  }

  return updateDocsPage(db, pageId, user.id, parsed.data);
});
