import { error, fail, redirect } from '@sveltejs/kit';
import { authGuard } from '@snaplify/auth';
import {
  getCommunityBySlug,
  updateCommunity,
  deleteCommunity,
  changeRole,
  kickMember,
  banUser,
  unbanUser,
  createInvite,
  revokeInvite,
  listMembers,
  listBans,
  listInvites,
} from '$lib/server/community';
import { hasPermission } from '$lib/utils/community-permissions';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.config.features.communities) {
    error(404, 'Communities are not enabled');
  }

  const guard = authGuard(event);
  if (!guard.authorized) {
    redirect(guard.status ?? 303, guard.redirectTo ?? '/auth/sign-in');
  }

  const community = await getCommunityBySlug(
    event.locals.db,
    event.params.slug,
    event.locals.user!.id,
  );

  if (!community) {
    error(404, 'Community not found');
  }

  if (!community.currentUserRole || !hasPermission(community.currentUserRole, 'editCommunity')) {
    error(403, 'You do not have permission to manage this community');
  }

  const [members, bans, invites] = await Promise.all([
    listMembers(event.locals.db, community.id),
    listBans(event.locals.db, community.id),
    listInvites(event.locals.db, community.id),
  ]);

  return { community, members, bans, invites };
};

export const actions: Actions = {
  update: async ({ params, locals, request }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const community = await getCommunityBySlug(locals.db, params.slug);
    if (!community) return fail(404, { error: 'Community not found' });

    const data = await request.formData();
    const result = await updateCommunity(locals.db, community.id, locals.user.id, {
      name: (data.get('name') as string) || undefined,
      description: (data.get('description') as string) || undefined,
      rules: (data.get('rules') as string) || undefined,
      joinPolicy: (data.get('joinPolicy') as string) || undefined,
    });

    if (!result) {
      return fail(403, { error: 'Not authorized' });
    }

    if (result.slug !== params.slug) {
      redirect(303, `/communities/${result.slug}/settings`);
    }

    return { success: true };
  },

  delete: async ({ params, locals }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const community = await getCommunityBySlug(locals.db, params.slug);
    if (!community) return fail(404, { error: 'Community not found' });

    const deleted = await deleteCommunity(locals.db, community.id, locals.user.id);
    if (!deleted) {
      return fail(403, { error: 'Only the owner can delete the community' });
    }

    redirect(303, '/communities');
  },

  changeRole: async ({ params, locals, request }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const community = await getCommunityBySlug(locals.db, params.slug);
    if (!community) return fail(404, { error: 'Community not found' });

    const data = await request.formData();
    const targetUserId = data.get('userId') as string;
    const newRole = data.get('role') as string;

    const result = await changeRole(
      locals.db, locals.user.id, community.id, targetUserId, newRole,
    );
    if (!result.changed) {
      return fail(400, { error: result.error ?? 'Could not change role' });
    }

    return { success: true };
  },

  kick: async ({ params, locals, request }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const community = await getCommunityBySlug(locals.db, params.slug);
    if (!community) return fail(404, { error: 'Community not found' });

    const data = await request.formData();
    const targetUserId = data.get('userId') as string;

    const result = await kickMember(locals.db, locals.user.id, community.id, targetUserId);
    if (!result.kicked) {
      return fail(400, { error: result.error ?? 'Could not kick member' });
    }

    return { success: true };
  },

  ban: async ({ params, locals, request }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const community = await getCommunityBySlug(locals.db, params.slug);
    if (!community) return fail(404, { error: 'Community not found' });

    const data = await request.formData();
    const targetUserId = data.get('userId') as string;
    const reason = (data.get('reason') as string) || undefined;
    const expiresStr = data.get('expiresAt') as string;
    const expiresAt = expiresStr ? new Date(expiresStr) : undefined;

    const result = await banUser(
      locals.db, locals.user.id, community.id, targetUserId, reason, expiresAt,
    );
    if (!result.banned) {
      return fail(400, { error: result.error ?? 'Could not ban user' });
    }

    return { success: true };
  },

  unban: async ({ params, locals, request }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const community = await getCommunityBySlug(locals.db, params.slug);
    if (!community) return fail(404, { error: 'Community not found' });

    const data = await request.formData();
    const targetUserId = data.get('userId') as string;

    const result = await unbanUser(locals.db, locals.user.id, community.id, targetUserId);
    if (!result.unbanned) {
      return fail(400, { error: result.error ?? 'Could not unban user' });
    }

    return { success: true };
  },

  createInvite: async ({ params, locals, request }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const community = await getCommunityBySlug(locals.db, params.slug);
    if (!community) return fail(404, { error: 'Community not found' });

    const data = await request.formData();
    const maxUsesStr = data.get('maxUses') as string;
    const maxUses = maxUsesStr ? parseInt(maxUsesStr, 10) : undefined;
    const expiresStr = data.get('expiresAt') as string;
    const expiresAt = expiresStr ? new Date(expiresStr) : undefined;

    const invite = await createInvite(
      locals.db, locals.user.id, community.id, maxUses, expiresAt,
    );
    if (!invite) {
      return fail(403, { error: 'Not authorized to create invites' });
    }

    return { success: true, invite };
  },

  revokeInvite: async ({ params, locals, request }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const community = await getCommunityBySlug(locals.db, params.slug);
    if (!community) return fail(404, { error: 'Community not found' });

    const data = await request.formData();
    const inviteId = data.get('inviteId') as string;

    const revoked = await revokeInvite(locals.db, inviteId, locals.user.id, community.id);
    if (!revoked) {
      return fail(403, { error: 'Not authorized to revoke invites' });
    }

    return { success: true };
  },
};
