import { fail } from '@sveltejs/kit';
import { updateDocsNav } from '$lib/server/docs';
import { docsNavStructureSchema } from '@snaplify/docs';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const parentData = await parent();
  return { nav: parentData.nav, pages: parentData.pages };
};

export const actions: Actions = {
  default: async ({ request, locals, parent }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const parentData = await parent();
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

    await updateDocsNav(locals.db, parentData.activeVersion.id, locals.user.id, parsed.data);
    return { success: true };
  },
};
