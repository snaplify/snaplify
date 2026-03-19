import { updateDocsPage } from '@commonpub/server';
import { updateDocsPageSchema } from '@commonpub/schema';

export default defineEventHandler(async (event) => {
  const user = requireAuth(event);
  const db = useDB();
  const { pageId } = parseParams(event, { pageId: 'uuid' });
  const input = await parseBody(event, updateDocsPageSchema);

  return updateDocsPage(db, pageId, user.id, input);
});
