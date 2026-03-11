import { error, fail, redirect } from '@sveltejs/kit';
import { authGuard } from '@snaplify/auth';
import { createContent } from '$lib/server/content';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.config.features.content) {
    error(404, 'Content system is not enabled');
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
    const contentJson = data.get('content') as string | null;
    const tagsRaw = data.get('tags') as string | null;
    const action = data.get('action') as string;

    if (!title?.trim()) {
      return fail(400, { error: 'Title is required' });
    }

    let content: unknown = null;
    if (contentJson) {
      try {
        content = JSON.parse(contentJson);
      } catch {
        return fail(400, { error: 'Invalid content format' });
      }
    }

    const tags = tagsRaw
      ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
      : undefined;

    const item = await createContent(locals.db, locals.user.id, {
      type: 'blog',
      title: title.trim(),
      description: description?.trim() || undefined,
      content,
      tags,
    });

    if (action === 'publish') {
      const { publishContent } = await import('$lib/server/content');
      await publishContent(locals.db, item.id, locals.user.id);
    }

    redirect(303, `/blog/${item.slug}`);
  },
};
