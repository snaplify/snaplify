import { incrementViewCount } from '@commonpub/server';

export default defineEventHandler(async (event): Promise<{ success: boolean }> => {
  const db = useDB();
  const { id } = parseParams(event, { id: 'uuid' });

  await incrementViewCount(db, id);
  return { success: true };
});
