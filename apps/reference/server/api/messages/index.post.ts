import { createConversation } from '@commonpub/server';
import { createConversationSchema } from '@commonpub/schema';

export default defineEventHandler(async (event) => {
  const db = useDB();
  const user = requireAuth(event);
  const input = await parseBody(event, createConversationSchema);

  const participants: string[] = input.participants;
  if (!participants.includes(user.id)) {
    participants.push(user.id);
  }

  return createConversation(db, participants);
});
