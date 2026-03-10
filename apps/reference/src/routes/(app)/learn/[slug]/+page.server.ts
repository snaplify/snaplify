import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getPathBySlug, enroll, unenroll } from '$lib/server/learning';

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.config.features.learning) {
    error(404, 'Learning system is not enabled');
  }

  const path = await getPathBySlug(locals.db, params.slug, locals.user?.id);

  if (!path) {
    error(404, 'Learning path not found');
  }

  return { path };
};

export const actions: Actions = {
  enroll: async ({ locals, params }) => {
    if (!locals.user) {
      redirect(303, '/auth/sign-in');
    }

    const path = await getPathBySlug(locals.db, params.slug, locals.user.id);
    if (!path) {
      return fail(404, { error: 'Path not found' });
    }

    try {
      await enroll(locals.db, locals.user.id, path.id);
    } catch {
      return fail(400, { error: 'Cannot enroll in this path' });
    }

    return { enrolled: true };
  },

  unenroll: async ({ locals, params }) => {
    if (!locals.user) {
      return fail(401, { error: 'Not authenticated' });
    }

    const path = await getPathBySlug(locals.db, params.slug, locals.user.id);
    if (!path) {
      return fail(404, { error: 'Path not found' });
    }

    await unenroll(locals.db, locals.user.id, path.id);
    return { unenrolled: true };
  },
};
