import { getUserByUsername, listFollowers } from '@commonpub/server';

export default defineEventHandler(async (event) => {
  const db = useDB();
  const username = getRouterParam(event, 'username');
  const query = getQuery(event);

  if (!username) {
    throw createError({ statusCode: 400, statusMessage: 'Username is required' });
  }

  const target = await getUserByUsername(db, username);
  if (!target) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' });
  }

  return listFollowers(db, target.id, {
    limit: query.limit ? Number(query.limit) : undefined,
    offset: query.offset ? Number(query.offset) : undefined,
  });
});
