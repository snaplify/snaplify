import { submitContestEntry, getContestBySlug } from '@commonpub/server';
import type { ContestEntryItem } from '@commonpub/server';
import { z } from 'zod';

const submitEntrySchema = z.object({
  contentId: z.string().uuid(),
});

export default defineEventHandler(async (event): Promise<ContestEntryItem> => {
  const user = requireAuth(event);
  const db = useDB();
  const { slug } = parseParams(event, { slug: 'string' });
  const contest = await getContestBySlug(db, slug);
  if (!contest) throw createError({ statusCode: 404, statusMessage: 'Contest not found' });
  const input = await parseBody(event, submitEntrySchema);

  return submitContestEntry(db, contest.id, input.contentId, user.id);
});
