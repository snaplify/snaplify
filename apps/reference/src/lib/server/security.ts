import type { Handle } from '@sveltejs/kit';

/** Default CSP directives for production */
const CSP_DIRECTIVES: Record<string, string> = {
	'default-src': "'self'",
	'script-src': "'self' 'unsafe-inline'",
	'style-src': "'self' 'unsafe-inline'",
	'img-src': "'self' data: https:",
	'font-src': "'self'",
	'connect-src': "'self'",
	'frame-ancestors': "'none'",
	'base-uri': "'self'",
	'form-action': "'self'",
};

/** Build a CSP header string from directives */
export function buildCspHeader(
	directives: Record<string, string> = CSP_DIRECTIVES,
): string {
	return Object.entries(directives)
		.map(([key, value]) => `${key} ${value}`)
		.join('; ');
}

/** Security headers applied to every response */
export function getSecurityHeaders(isDev: boolean): Record<string, string> {
	const headers: Record<string, string> = {
		'X-Content-Type-Options': 'nosniff',
		'X-Frame-Options': 'DENY',
		'Referrer-Policy': 'strict-origin-when-cross-origin',
		'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
	};

	// CSP only in production — dev needs eval for HMR
	if (!isDev) {
		headers['Content-Security-Policy'] = buildCspHeader();
	}

	// HSTS only in production
	if (!isDev) {
		headers['Strict-Transport-Security'] =
			'max-age=31536000; includeSubDomains';
	}

	return headers;
}

/** Cache headers for static assets (hashed filenames) */
export function getStaticCacheHeaders(): Record<string, string> {
	return {
		'Cache-Control': 'public, max-age=31536000, immutable',
	};
}

/** SvelteKit handle hook that adds security headers */
export function createSecurityHook(isDev: boolean): Handle {
	const securityHeaders = getSecurityHeaders(isDev);

	return async ({ event, resolve }) => {
		const response = await resolve(event);

		for (const [key, value] of Object.entries(securityHeaders)) {
			response.headers.set(key, value);
		}

		// Add cache headers for immutable static assets
		if (event.url.pathname.startsWith('/_app/')) {
			const cacheHeaders = getStaticCacheHeaders();
			for (const [key, value] of Object.entries(cacheHeaders)) {
				response.headers.set(key, value);
			}
		}

		return response;
	};
}
