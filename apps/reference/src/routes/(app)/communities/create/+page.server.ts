import { error, fail, redirect } from '@sveltejs/kit';
import { authGuard } from '@snaplify/auth';
import { createCommunitySchema } from '@snaplify/schema';
import { createCommunity } from '$lib/server/community';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.config.features.communities) {
    error(404, 'Communities are not enabled');
  }
  const guard = authGuard(event);
  if (!guard.authorized) {
    redirect(guard.status ?? 303, guard.redirectTo ?? '/auth/sign-in');
  }

  return {};
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.config.features.communities) {
      error(404, 'Communities are not enabled');
    }
    if (!locals.user) {
      return fail(401, { error: 'Not authenticated' });
    }

    const data = await request.formData();
    const name = data.get('name') as string;
    const description = (data.get('description') as string) || undefined;
    const rules = (data.get('rules') as string) || undefined;
    const joinPolicy = (data.get('joinPolicy') as string) || 'open';

    const parsed = createCommunitySchema.safeParse({
      name,
      slug: name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      description,
      rules,
      joinPolicy,
    });

    if (!parsed.success) {
      return fail(400, { error: parsed.error.issues[0]?.message ?? 'Invalid input' });
    }

    const community = await createCommunity(locals.db, locals.user.id, {
      name: parsed.data.name,
      description: parsed.data.description,
      rules: parsed.data.rules,
      joinPolicy: parsed.data.joinPolicy,
    });

    redirect(303, `/communities/${community.slug}`);
  },
};
