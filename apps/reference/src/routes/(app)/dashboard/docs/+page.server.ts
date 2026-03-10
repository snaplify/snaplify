import { error, fail, redirect } from '@sveltejs/kit';
import { authGuard } from '@snaplify/auth';
import { listDocsSites, deleteDocsSite } from '$lib/server/docs';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.config.features.docs) {
    error(404, 'Documentation system is not enabled');
  }

  const guard = authGuard(event);
  if (!guard.authorized) {
    redirect(guard.status ?? 303, guard.redirectTo ?? '/auth/sign-in');
  }

  const { items, total } = await listDocsSites(event.locals.db, {
    ownerId: event.locals.user!.id,
  });

  return { sites: items, total };
};

export const actions: Actions = {
  delete: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const data = await request.formData();
    const siteId = data.get('siteId') as string;

    if (!siteId) return fail(400, { error: 'Site ID required' });

    const deleted = await deleteDocsSite(locals.db, siteId, locals.user.id);
    if (!deleted) return fail(403, { error: 'Not authorized or site not found' });

    return { success: true };
  },
};
