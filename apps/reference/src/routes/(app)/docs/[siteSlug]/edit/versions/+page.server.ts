import { fail } from '@sveltejs/kit';
import { createDocsVersion, setDefaultVersion, deleteDocsVersion } from '$lib/server/docs';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const parentData = await parent();
  return { versions: parentData.versions, site: parentData.site, activeVersion: parentData.activeVersion };
};

export const actions: Actions = {
  create: async ({ request, locals, parent }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const parentData = await parent();
    const data = await request.formData();
    const version = data.get('version') as string;
    const sourceVersionId = data.get('sourceVersionId') as string | null;
    const isDefault = data.get('isDefault') === 'true';

    if (!version?.trim()) return fail(400, { error: 'Version name is required' });

    await createDocsVersion(locals.db, parentData.site.id, locals.user.id, {
      version: version.trim(),
      sourceVersionId: sourceVersionId || undefined,
      isDefault,
    });

    return { success: true };
  },

  setDefault: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const data = await request.formData();
    const versionId = data.get('versionId') as string;

    const result = await setDefaultVersion(locals.db, versionId, locals.user.id);
    if (!result) return fail(403, { error: 'Not authorized' });

    return { success: true };
  },

  delete: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const data = await request.formData();
    const versionId = data.get('versionId') as string;

    const result = await deleteDocsVersion(locals.db, versionId, locals.user.id);
    if (!result) return fail(403, { error: 'Not authorized' });

    return { success: true };
  },
};
