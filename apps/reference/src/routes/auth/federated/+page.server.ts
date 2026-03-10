import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { discoverOAuthEndpoint, isTrustedInstance } from '@snaplify/auth';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.config.features.federation) {
    error(404, 'Federation is not enabled');
  }

  return {
    instanceName: locals.config.instance.name,
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.config.features.federation) {
      error(404, 'Federation is not enabled');
    }

    const formData = await request.formData();
    const identifier = formData.get('identifier') as string;

    if (!identifier || !identifier.includes('@')) {
      return { error: 'Enter your username in the format user@instance.example.com' };
    }

    const [username, domain] = identifier.split('@');
    if (!username || !domain) {
      return { error: 'Invalid format. Use user@instance.example.com' };
    }

    // Check if instance is trusted
    if (!isTrustedInstance(locals.config, domain)) {
      return { error: `Instance ${domain} is not in the trusted instances list` };
    }

    // Discover OAuth endpoint via WebFinger
    const endpoint = await discoverOAuthEndpoint(domain, username, fetch);
    if (!endpoint) {
      return { error: `Could not discover OAuth endpoint for ${domain}` };
    }

    // Build authorization URL
    const clientId = `https://${locals.config.instance.domain}`;
    const redirectUri = `https://${locals.config.instance.domain}/api/auth/oauth2/callback`;
    const state = `${domain}:${username}`;

    const authUrl = new URL(endpoint.authorizationEndpoint);
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'read');
    authUrl.searchParams.set('state', state);

    redirect(302, authUrl.toString());
  },
};
