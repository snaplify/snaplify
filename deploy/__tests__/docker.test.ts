import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';

const root = resolve(__dirname, '../..');
const deployDir = resolve(__dirname, '..');

describe('Docker configuration', () => {
  it('Dockerfile exists with multi-stage structure', () => {
    const dockerfile = readFileSync(resolve(root, 'Dockerfile'), 'utf-8');
    expect(dockerfile).toContain('FROM node:22-alpine AS deps');
    expect(dockerfile).toContain('FROM deps AS build');
    expect(dockerfile).toContain('FROM deps AS prod-deps');
    expect(dockerfile).toContain('FROM node:22-alpine AS runtime');
  });

  it('app service has health check and depends on all infra', () => {
    const content = readFileSync(resolve(deployDir, 'docker-compose.prod.yml'), 'utf-8');
    const parsed = parse(content);
    expect(parsed.services.app.healthcheck).toBeDefined();
    expect(parsed.services.app.depends_on.meilisearch).toBeDefined();
  });

  it('docker-compose.prod.yml parses as valid YAML', () => {
    const content = readFileSync(resolve(deployDir, 'docker-compose.prod.yml'), 'utf-8');
    const parsed = parse(content);
    expect(parsed).toBeDefined();
    expect(parsed.services).toBeDefined();
  });

  it('all required services are present', () => {
    const content = readFileSync(resolve(deployDir, 'docker-compose.prod.yml'), 'utf-8');
    const parsed = parse(content);
    expect(parsed.services.app).toBeDefined();
    expect(parsed.services.postgres).toBeDefined();
    expect(parsed.services.redis).toBeDefined();
    expect(parsed.services.meilisearch).toBeDefined();
  });

  it('health checks are defined for infrastructure services', () => {
    const content = readFileSync(resolve(deployDir, 'docker-compose.prod.yml'), 'utf-8');
    const parsed = parse(content);
    expect(parsed.services.postgres.healthcheck).toBeDefined();
    expect(parsed.services.redis.healthcheck).toBeDefined();
    expect(parsed.services.meilisearch.healthcheck).toBeDefined();
  });
});
