import { describe, it, expect } from 'vitest';
import { buildCspHeader, getSecurityHeaders, getStaticCacheHeaders } from '../security';

describe('buildCspHeader', () => {
	it('builds semicolon-separated CSP string from directives', () => {
		const header = buildCspHeader({
			'default-src': "'self'",
			'img-src': "'self' https:",
		});
		expect(header).toBe("default-src 'self'; img-src 'self' https:");
	});

	it('uses default directives when none provided', () => {
		const header = buildCspHeader();
		expect(header).toContain("default-src 'self'");
		expect(header).toContain("frame-ancestors 'none'");
		expect(header).toContain("script-src 'self' 'unsafe-inline'");
	});
});

describe('getSecurityHeaders', () => {
	it('always includes base security headers', () => {
		const headers = getSecurityHeaders(true);
		expect(headers['X-Content-Type-Options']).toBe('nosniff');
		expect(headers['X-Frame-Options']).toBe('DENY');
		expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
		expect(headers['Permissions-Policy']).toBe(
			'camera=(), microphone=(), geolocation=()',
		);
	});

	it('omits CSP and HSTS in dev mode', () => {
		const headers = getSecurityHeaders(true);
		expect(headers['Content-Security-Policy']).toBeUndefined();
		expect(headers['Strict-Transport-Security']).toBeUndefined();
	});

	it('includes CSP and HSTS in production', () => {
		const headers = getSecurityHeaders(false);
		expect(headers['Content-Security-Policy']).toContain("default-src 'self'");
		expect(headers['Strict-Transport-Security']).toContain('max-age=31536000');
	});
});

describe('getStaticCacheHeaders', () => {
	it('returns immutable cache headers', () => {
		const headers = getStaticCacheHeaders();
		expect(headers['Cache-Control']).toBe(
			'public, max-age=31536000, immutable',
		);
	});
});
