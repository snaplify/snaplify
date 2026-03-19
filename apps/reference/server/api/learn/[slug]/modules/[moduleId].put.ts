import { updateModule } from '@commonpub/server';
import { updateModuleSchema } from '@commonpub/schema';

export default defineEventHandler(async (event) => {
  const user = requireAuth(event);
  const db = useDB();
  const { moduleId } = parseParams(event, { moduleId: 'uuid' });
  const input = await parseBody(event, updateModuleSchema);

  return updateModule(db, moduleId, user.id, input);
});
