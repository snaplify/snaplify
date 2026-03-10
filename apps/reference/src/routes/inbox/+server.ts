import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { activities } from '@snaplify/schema';

/** Shared inbox — receives activities for any user on this instance */
export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.config.features.federation) {
    error(404, 'Federation is not enabled');
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Log inbound activity
  await locals.db.insert(activities).values({
    type: (body.type as string) ?? 'Unknown',
    actorUri: (body.actor as string) ?? '',
    objectUri: typeof body.object === 'string' ? body.object : null,
    payload: body,
    direction: 'inbound',
    status: 'pending',
  });

  // Shared inbox processing delegates to per-user inbox handlers
  // Full routing implementation in Phase 9
  return new Response(null, { status: 202 });
};
