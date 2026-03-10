import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@snaplify/schema';
import { createAuth, createAuthHook } from '@snaplify/auth';
import { defineSnaplifyConfig } from '@snaplify/config';
import { isValidThemeId } from '@snaplify/ui';
import { env } from '$env/dynamic/private';
import { resolveTheme } from '$lib/server/theme';
import { createSecurityHook } from '$lib/server/security';
import { createRateLimitHook } from '$lib/server/rateLimit';

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

const { config } = defineSnaplifyConfig({
  instance: {
    domain: env.PUBLIC_DOMAIN ?? 'localhost:5173',
    name: env.PUBLIC_INSTANCE_NAME ?? 'Snaplify',
    description: env.PUBLIC_INSTANCE_DESCRIPTION ?? 'A maker community',
  },
  features: {
    content: env.FEATURE_CONTENT !== 'false',
    social: env.FEATURE_SOCIAL !== 'false',
    communities: env.FEATURE_COMMUNITIES !== 'false',
    federation: env.FEATURE_FEDERATION === 'true',
    docs: env.FEATURE_DOCS !== 'false',
    admin: env.FEATURE_ADMIN === 'true',
  },
  auth: {
    emailPassword: true,
  },
});

const auth = createAuth({
  config,
  db,
  secret: env.AUTH_SECRET ?? 'dev-secret-change-in-production',
  baseURL: env.AUTH_BASE_URL ?? `http://localhost:5173`,
});

const authHook = createAuthHook({ auth });

const dbHook: Handle = async ({ event, resolve }) => {
  event.locals.db = db;
  event.locals.config = config;
  return resolve(event);
};

const themeHook: Handle = async ({ event, resolve }) => {
  // Check cookie first (for anonymous users or SSR)
  const cookieTheme = event.cookies.get('snaplify-theme');
  let theme = 'base';

  if (event.locals.user) {
    theme = await resolveTheme(db as never, event.locals.user.id);
  } else if (cookieTheme && isValidThemeId(cookieTheme)) {
    theme = cookieTheme;
  } else {
    theme = await resolveTheme(db as never);
  }

  event.locals.theme = theme;

  return resolve(event, {
    transformPageChunk: ({ html }) => {
      if (theme !== 'base') {
        return html.replace('<html', `<html data-theme="${theme}"`);
      }
      return html;
    },
  });
};

const isDev = env.NODE_ENV !== 'production';
const securityHook = createSecurityHook(isDev);
const rateLimitHook = createRateLimitHook();

export const handle = sequence(dbHook, authHook as Handle, themeHook, securityHook, rateLimitHook);
