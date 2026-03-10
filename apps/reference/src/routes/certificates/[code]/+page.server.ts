import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCertificateByCode } from '$lib/server/learning';

// Certificate verification is public — no feature flag check
export const load: PageServerLoad = async ({ params, locals }) => {
  const result = await getCertificateByCode(locals.db, params.code);

  if (!result) {
    error(404, 'Certificate not found');
  }

  return {
    certificate: {
      verificationCode: result.certificate.verificationCode,
      issuedAt: result.certificate.issuedAt,
    },
    path: result.path,
    earner: {
      name: result.user.displayName ?? result.user.username,
    },
  };
};
