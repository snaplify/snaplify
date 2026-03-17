import { listContent } from '@commonpub/server';

export default defineEventHandler(async (event) => {
  const db = useDB();
  const query = getQuery(event);
  const user = getOptionalUser(event);

  // When filtering by authorId, allow fetching all statuses (drafts + published)
  // For public listing (no authorId), default to published only
  const authorId = query.authorId as string | undefined;
  const isOwnContent = authorId && user?.id === authorId;

  return listContent(db, {
    status: isOwnContent ? (query.status as string | undefined) : (query.status as string | undefined ?? 'published'),
    type: query.type as string | undefined,
    authorId,
    featured: query.featured === 'true' ? true : undefined,
    difficulty: query.difficulty as string | undefined,
    search: query.search as string | undefined,
    tag: query.tag as string | undefined,
    sort: query.sort as 'recent' | 'popular' | 'featured' | undefined,
    limit: query.limit ? Number(query.limit) : undefined,
    offset: query.offset ? Number(query.offset) : undefined,
  });
});
