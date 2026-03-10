import { error, fail, redirect } from '@sveltejs/kit';
import { authGuard } from '@snaplify/auth';
import { createDocsSite } from '$lib/server/docs';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.config.features.docs) {
    error(404, 'Documentation system is not enabled');
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
    const name = data.get('name') as string;
    const description = data.get('description') as string | null;

    if (!name?.trim()) {
      return fail(400, { error: 'Name is required', name, description });
    }

    const site = await createDocsSite(locals.db, locals.user.id, {
      name: name.trim(),
      description: description?.trim() || undefined,
    });

    redirect(303, `/docs/${site.slug}/edit`);
  },
};
