import { eq, desc } from 'drizzle-orm';
import { files } from '@commonpub/schema';

export default defineEventHandler(async (event) => {
  const db = useDB();
  const user = requireAuth(event);
  const query = getQuery(event);

  const rows = await db
    .select()
    .from(files)
    .where(eq(files.uploaderId, user.id))
    .orderBy(desc(files.createdAt))
    .limit(query.limit ? Number(query.limit) : 50);

  return rows.map((f) => ({
    id: f.id,
    filename: f.filename,
    originalName: f.originalName,
    mimeType: f.mimeType,
    sizeBytes: f.sizeBytes,
    url: f.publicUrl,
    purpose: f.purpose,
    createdAt: f.createdAt,
  }));
});
