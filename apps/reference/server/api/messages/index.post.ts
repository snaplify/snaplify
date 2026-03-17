import { createConversation } from '@commonpub/server';
import { createConversationSchema } from '@commonpub/schema';

export default defineEventHandler(async (event) => {
  const db = useDB();
  const user = requireAuth(event);
  const body = await readBody(event);

  const parsed = createConversationSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: { errors: parsed.error.flatten().fieldErrors },
    });
  }

  const participants: string[] = parsed.data.participants;
  if (!participants.includes(user.id)) {
    participants.push(user.id);
  }

  return createConversation(db, participants);
});
