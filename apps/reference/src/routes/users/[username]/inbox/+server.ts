import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { processInboxActivity } from '@snaplify/snaplify';
import { eq, and } from 'drizzle-orm';
import {
  users,
  activities,
  followRelationships,
  remoteActors,
} from '@snaplify/schema';
import { acceptFollow } from '$lib/server/federation';

export const POST: RequestHandler = async ({ params, request, locals }) => {
  if (!locals.config.features.federation) {
    error(404, 'Federation is not enabled');
  }

  // Verify the target user exists
  const rows = await locals.db
    .select({ id: users.id, username: users.username })
    .from(users)
    .where(eq(users.username, params.username))
    .limit(1);

  if (rows.length === 0) {
    error(404, 'User not found');
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const domain = locals.config.instance.domain;
  const db = locals.db;

  // Log inbound activity
  await db.insert(activities).values({
    type: (body.type as string) ?? 'Unknown',
    actorUri: (body.actor as string) ?? '',
    objectUri: typeof body.object === 'string' ? body.object : (body.object as Record<string, unknown>)?.id as string ?? null,
    payload: body,
    direction: 'inbound',
    status: 'processed',
  });

  const result = await processInboxActivity(body, {
    async onFollow(actorUri, targetActorUri, activityId) {
      // Auto-accept follows for now (v1)
      const [rel] = await db
        .insert(followRelationships)
        .values({
          followerActorUri: actorUri,
          followingActorUri: targetActorUri,
          status: 'accepted',
        })
        .returning();

      // Log Accept response
      if (rel) {
        await acceptFollow(db, rel.id, domain);
      }
    },
    async onAccept(actorUri, objectId) {
      // Update our follow relationship to accepted
      await db
        .update(followRelationships)
        .set({ status: 'accepted', updatedAt: new Date() })
        .where(eq(followRelationships.followerActorUri, `https://${domain}/users/${params.username}`));
    },
    async onReject(actorUri, objectId) {
      await db
        .update(followRelationships)
        .set({ status: 'rejected', updatedAt: new Date() })
        .where(eq(followRelationships.followerActorUri, `https://${domain}/users/${params.username}`));
    },
    async onUndo(actorUri, objectType, objectId) {
      if (objectType === 'Follow') {
        await db
          .delete(followRelationships)
          .where(
            and(
              eq(followRelationships.followerActorUri, actorUri),
              eq(followRelationships.followingActorUri, `https://${domain}/users/${params.username}`),
            ),
          );
      }
    },
    async onCreate(actorUri, object) {
      // Store remote content reference — full implementation in Phase 9
    },
    async onUpdate(actorUri, object) {
      // Update remote content reference — full implementation in Phase 9
    },
    async onDelete(actorUri, objectId) {
      // Remove remote content reference — full implementation in Phase 9
    },
    async onLike(actorUri, objectUri) {
      // Record remote like — full implementation in Phase 9
    },
    async onAnnounce(actorUri, objectUri) {
      // Record remote boost — full implementation in Phase 9
    },
  });

  if (!result.success) {
    return json({ error: result.error }, { status: 400 });
  }

  return new Response(null, { status: 202 });
};
