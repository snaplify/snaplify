import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { toggleLike, onContentLiked } from '$lib/server/social';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.config.features.social) {
    return json({ error: 'Social features are not enabled' }, { status: 404 });
  }

  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  let targetType: string, targetId: string;
  try {
    ({ targetType, targetId } = await request.json());
  } catch {
    return json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!targetType || !targetId) {
    return json({ error: 'targetType and targetId are required' }, { status: 400 });
  }

  const result = await toggleLike(locals.db, locals.user.id, targetType, targetId);
  if (result.liked) {
    await onContentLiked(locals.db, targetId, locals.config);
  }
  return json(result);
};
