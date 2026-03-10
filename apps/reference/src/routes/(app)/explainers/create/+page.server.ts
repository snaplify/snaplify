import { error, fail, redirect } from '@sveltejs/kit';
import { authGuard } from '@snaplify/auth';
import { createContent } from '$lib/server/content';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.config.features.explainers) {
    error(404, 'Explainer system is not enabled');
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
    const sectionsJson = data.get('sections') as string | null;
    const tagsRaw = data.get('tags') as string | null;
    const action = data.get('action') as string;

    if (!title?.trim()) {
      return fail(400, { error: 'Title is required', title, description });
    }

    let sections: unknown = undefined;
    if (sectionsJson) {
      try {
        sections = JSON.parse(sectionsJson);
      } catch {
        return fail(400, { error: 'Invalid sections format' });
      }
    }

    const tags = tagsRaw
      ? tagsRaw
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : undefined;

    const item = await createContent(locals.db, locals.user.id, {
      type: 'explainer',
      title: title.trim(),
      description: description?.trim() || undefined,
      sections,
      tags,
    });

    if (action === 'publish') {
      const { publishContent, onContentPublished } = await import('$lib/server/content');
      await publishContent(locals.db, item.id, locals.user.id);
      await onContentPublished(locals.db, item.id, locals.config);
    }

    redirect(303, `/explainers/${item.slug}`);
  },
};
