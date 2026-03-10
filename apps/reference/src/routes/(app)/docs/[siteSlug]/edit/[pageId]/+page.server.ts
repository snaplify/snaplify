import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { docsPages } from '@snaplify/schema';
import { updateDocsPage, deleteDocsPage } from '$lib/server/docs';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  const rows = await locals.db
    .select()
    .from(docsPages)
    .where(eq(docsPages.id, params.pageId))
    .limit(1);

  if (rows.length === 0) {
    error(404, 'Page not found');
  }

  return { page: rows[0]! };
};

export const actions: Actions = {
  save: async ({ request, locals, params, parent }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const data = await request.formData();
    const title = data.get('title') as string | null;
    const content = data.get('content') as string | null;
    const slug = data.get('slug') as string | null;

    const updated = await updateDocsPage(locals.db, params.pageId, locals.user.id, {
      ...(title !== null ? { title: title.trim() } : {}),
      ...(content !== null ? { content } : {}),
      ...(slug !== null ? { slug: slug.trim() } : {}),
    });

    if (!updated) return fail(500, { error: 'Failed to update page' });
    return { success: true, page: updated };
  },

  delete: async ({ locals, params, parent }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const parentData = await parent();
    const deleted = await deleteDocsPage(locals.db, params.pageId, locals.user.id);
    if (!deleted) return fail(403, { error: 'Not authorized' });

    redirect(303, `/docs/${parentData.site.slug}/edit`);
  },
};
