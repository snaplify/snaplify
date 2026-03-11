import { error, fail } from '@sveltejs/kit';
import { getDocsSiteBySlug, updateDocsNav } from '$lib/server/docs';
import { docsNavStructureSchema } from '@snaplify/docs';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const parentData = await parent();
  return { nav: parentData.nav, pages: parentData.pages, site: parentData.site };
};

export const actions: Actions = {
  default: async ({ request, locals, params }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const result = await getDocsSiteBySlug(locals.db, params.siteSlug);
    if (!result) error(404, 'Documentation site not found');
    const activeVersion = result.versions.find((v) => v.isDefault === 1) ?? result.versions[0];
    if (!activeVersion) return fail(500, { error: 'No versions available' });

    const data = await request.formData();
    const structureJson = data.get('structure') as string;

    let structure: unknown;
    try {
      structure = JSON.parse(structureJson);
    } catch {
      return fail(400, { error: 'Invalid JSON' });
    }

    const parsed = docsNavStructureSchema.safeParse(structure);
    if (!parsed.success) {
      return fail(400, { error: 'Invalid navigation structure' });
    }

    await updateDocsNav(locals.db, activeVersion.id, locals.user.id, parsed.data);
    return { success: true };
  },
};
