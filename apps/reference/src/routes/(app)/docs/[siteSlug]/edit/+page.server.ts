import { error, fail, redirect } from '@sveltejs/kit';
import {
  getDocsSiteBySlug,
  updateDocsSite,
  deleteDocsSite,
  createDocsPage,
} from '$lib/server/docs';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const parentData = await parent();
  return { site: parentData.site, pages: parentData.pages };
};

async function getSiteData(db: App.Locals['db'], siteSlug: string) {
  const result = await getDocsSiteBySlug(db, siteSlug);
  if (!result) error(404, 'Documentation site not found');
  return result;
}

export const actions: Actions = {
  update: async ({ request, locals, params }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const { site } = await getSiteData(locals.db, params.siteSlug);
    const data = await request.formData();
    const name = data.get('name') as string | null;
    const description = data.get('description') as string | null;

    const updated = await updateDocsSite(locals.db, site.id, locals.user.id, {
      ...(name !== null ? { name: name.trim() } : {}),
      ...(description !== null ? { description: description.trim() || undefined } : {}),
    });

    if (!updated) return fail(500, { error: 'Failed to update site' });
    return { success: true };
  },

  delete: async ({ locals, params }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const { site } = await getSiteData(locals.db, params.siteSlug);
    const deleted = await deleteDocsSite(locals.db, site.id, locals.user.id);

    if (!deleted) return fail(403, { error: 'Not authorized' });
    redirect(303, '/docs');
  },

  createPage: async ({ request, locals, params }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const { site, versions } = await getSiteData(locals.db, params.siteSlug);
    const activeVersion = versions.find((v) => v.isDefault === 1) ?? versions[0];
    if (!activeVersion) return fail(500, { error: 'No versions available' });

    const data = await request.formData();
    const title = data.get('title') as string;
    const content = data.get('content') as string | null;
    const parentId = data.get('parentId') as string | null;

    if (!title?.trim()) return fail(400, { error: 'Title is required' });

    const page = await createDocsPage(locals.db, locals.user.id, {
      versionId: activeVersion.id,
      title: title.trim(),
      content: content || '# ' + title.trim() + '\n',
      parentId: parentId || undefined,
    });

    redirect(303, `/docs/${site.slug}/edit/${page.id}`);
  },
};
