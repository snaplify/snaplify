import { error, redirect } from '@sveltejs/kit';
import { authGuard } from '@snaplify/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  if (!event.locals.config.features.docs) {
    error(404, 'Documentation system is not enabled');
  }

  const guard = authGuard(event);
  if (!guard.authorized) {
    redirect(guard.status ?? 303, guard.redirectTo ?? '/auth/sign-in');
  }

  // Parent layout already loads site data
  const parentData = await event.parent();
  if (!parentData.isOwner) {
    error(403, 'Not authorized to edit this documentation site');
  }

  return {};
};
