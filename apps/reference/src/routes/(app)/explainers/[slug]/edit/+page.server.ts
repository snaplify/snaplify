import { error, fail, redirect } from '@sveltejs/kit';
import { authGuard } from '@snaplify/auth';
import { getContentBySlug, updateContent, publishContent, onContentUpdated, onContentPublished } from '$lib/server/content';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.config.features.explainers) {
    error(404, 'Explainer system is not enabled');
  }

  const guard = authGuard(event);
  if (!guard.authorized) {
    redirect(guard.status ?? 303, guard.redirectTo ?? '/auth/sign-in');
  }

  const item = await getContentBySlug(event.locals.db, event.params.slug, event.locals.user!.id);

  if (!item) {
    error(404, 'Explainer not found');
  }

  if (item.type !== 'explainer') {
    error(404, 'Explainer not found');
  }

  if (item.author.id !== event.locals.user!.id) {
    error(403, 'Not authorized to edit this explainer');
  }

  return { item };
};

export const actions: Actions = {
  default: async ({ request, locals, params }) => {
    if (!locals.user) {
      return fail(401, { error: 'Not authenticated' });
    }

    const item = await getContentBySlug(locals.db, params.slug, locals.user.id);
    if (!item || item.author.id !== locals.user.id) {
      return fail(403, { error: 'Not authorized' });
    }

    const data = await request.formData();
    const title = data.get('title') as string | null;
    const description = data.get('description') as string | null;
    const sectionsJson = data.get('sections') as string | null;
    const tagsRaw = data.get('tags') as string | null;
    const seoDescription = data.get('seoDescription') as string | null;
    const action = data.get('action') as string;

    let sections: unknown = undefined;
    if (sectionsJson) {
      try {
        sections = JSON.parse(sectionsJson);
      } catch {
        return fail(400, { error: 'Invalid sections format' });
      }
    }

    const tags = tagsRaw !== null
      ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
      : undefined;

    const updated = await updateContent(locals.db, item.id, locals.user.id, {
      ...(title !== null ? { title: title.trim() } : {}),
      ...(description !== null ? { description: description.trim() || undefined } : {}),
      ...(sections !== undefined ? { sections } : {}),
      ...(seoDescription !== null ? { seoDescription: seoDescription.trim() || undefined } : {}),
      ...(tags !== undefined ? { tags } : {}),
    });

    if (!updated) {
      return fail(500, { error: 'Failed to update explainer' });
    }

    await onContentUpdated(locals.db, item.id, locals.config);

    if (action === 'publish' && updated.status !== 'published') {
      await publishContent(locals.db, item.id, locals.user.id);
      await onContentPublished(locals.db, item.id, locals.config);
    }

    redirect(303, `/explainers/${updated.slug}`);
  },
};
