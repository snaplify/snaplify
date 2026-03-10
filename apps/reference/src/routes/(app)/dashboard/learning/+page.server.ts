import { error, redirect } from '@sveltejs/kit';
import { authGuard } from '@snaplify/auth';
import { getUserEnrollments, getUserCertificates } from '$lib/server/learning';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (!event.locals.config.features.learning) {
    error(404, 'Learning system is not enabled');
  }

  const guard = authGuard(event);
  if (!guard.authorized) {
    redirect(guard.status ?? 303, guard.redirectTo ?? '/auth/sign-in');
  }

  const [enrollments, certificates] = await Promise.all([
    getUserEnrollments(event.locals.db, event.locals.user!.id),
    getUserCertificates(event.locals.db, event.locals.user!.id),
  ]);

  return { enrollments, certificates };
};
