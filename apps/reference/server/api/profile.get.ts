import { getUserByUsername } from '@commonpub/server';

export default defineEventHandler(async (event) => {
  const db = useDB();
  const user = requireAuth(event);

  const profile = await getUserByUsername(db, user.username);

  if (!profile) {
    throw createError({ statusCode: 404, statusMessage: 'Profile not found' });
  }

  return profile;
});
