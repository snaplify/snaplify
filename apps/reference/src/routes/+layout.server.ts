import type { LayoutServerLoad } from './$types';
import { getCustomTokenOverrides } from '$lib/server/theme';

export const load: LayoutServerLoad = async ({ locals }) => {
  const customTokens = await getCustomTokenOverrides(locals.db as never);

  return {
    user: locals.user,
    theme: locals.theme,
    customTokens,
  };
};
