import { fail, redirect } from '@sveltejs/kit';
import { authGuard } from '@snaplify/auth';
import { isValidThemeId } from '@snaplify/ui';
import { setUserTheme } from '$lib/server/theme';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const guard = authGuard(event);
  if (!guard.authorized) {
    redirect(303, '/auth/sign-in');
  }

  return {
    currentTheme: event.locals.theme ?? 'base',
  };
};

export const actions: Actions = {
  setTheme: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: 'Not authenticated' });

    const formData = await request.formData();
    const themeId = formData.get('themeId') as string;

    if (!isValidThemeId(themeId)) return fail(400, { error: 'Invalid theme' });

    await setUserTheme(locals.db as never, locals.user.id, themeId);

    return { success: true };
  },
};
