import { updateModule } from '@commonpub/server';
import { updateModuleSchema } from '@commonpub/schema';

export default defineEventHandler(async (event) => {
  const user = requireAuth(event);
  const db = useDB();
  const moduleId = getRouterParam(event, 'moduleId')!;
  const body = await readBody(event);

  const parsed = updateModuleSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: { errors: parsed.error.flatten().fieldErrors },
    });
  }

  return updateModule(db, moduleId, user.id, parsed.data);
});
