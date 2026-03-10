import { error, fail, redirect } from '@sveltejs/kit';
import { authGuard } from '@snaplify/auth';
import { createPath } from '$lib/server/learning';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.config.features.learning) {
    error(404, 'Learning system is not enabled');
  }
  const guard = authGuard(event);
  if (!guard.authorized) {
    redirect(guard.status ?? 303, guard.redirectTo ?? '/auth/sign-in');
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      return fail(401, { error: 'Not authenticated' });
    }

    const data = await request.formData();
    const title = data.get('title') as string;
    const description = data.get('description') as string | null;
    const difficulty = data.get('difficulty') as string | null;
    const estimatedHours = data.get('estimatedHours') as string | null;

    if (!title?.trim()) {
      return fail(400, { error: 'Title is required', title, description, difficulty });
    }

    const path = await createPath(locals.db, locals.user.id, {
      title: title.trim(),
      description: description?.trim() || undefined,
      difficulty: difficulty || undefined,
      estimatedHours: estimatedHours ? Number(estimatedHours) : undefined,
    });

    redirect(303, `/learn/${path.slug}/edit`);
  },
};
