import { error, redirect } from '@sveltejs/kit';
import { roleGuard } from '@snaplify/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  if (!event.locals.config.features.admin) {
    error(404, 'Not found');
  }

  const guard = roleGuard('staff')(event);
  if (!guard.authorized) {
    if (!event.locals.user) {
      redirect(303, '/auth/sign-in');
    }
    error(403, 'Forbidden');
  }
};
