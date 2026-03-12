# CommonPub

An open ActivityPub federation protocol and package suite for self-hosted maker communities.

## What is CommonPub?

CommonPub is everything you need to run a maker community: a rich content system, learning paths, documentation sites, interactive explainers, moderated communities, and cross-instance federation via ActivityPub. Self-hosted and open source.

## Features

- **Content System**: Rich block editor with articles, tutorials, and project showcases
- **Learning Paths**: Structured courses with modules, lessons, quizzes, and certificates
- **Documentation**: Versioned docs with CodeMirror editor, Meilisearch-powered search
- **Interactive Explainers**: Scroll-driven interactive explanations with HTML export
- **Communities**: Moderated spaces with feeds, roles, and content sharing
- **ActivityPub Federation**: Cross-instance content sharing and actor SSO
- **Theming**: 4 built-in themes with CSS custom property switching
- **Admin Panel**: User management, moderation, audit logs, instance settings

## Quick Start

```bash
# Clone the repo
git clone https://github.com/commonpub/commonpub.git
cd commonpub

# Start local infrastructure (Postgres 16, Redis 7, Meilisearch)
docker compose up -d

# Install dependencies and build
pnpm install
pnpm build

# Push schema to database
pnpm db:push

# Copy environment template
cp .env.example .env

# Start the dev server
pnpm dev:app
```

Visit `http://localhost:3000` to see your instance.

See [docs/quickstart.md](docs/quickstart.md) for the full local dev guide.

## Architecture

```
commonpub/
  packages/
    schema/        @commonpub/schema      Drizzle tables + Zod validators
    protocol/      @commonpub/protocol    Fedify wrapper + AP types
    auth/          @commonpub/auth        Better Auth wrapper + AP SSO
    ui/            @commonpub/ui          Headless Vue 3 components + theme CSS
    config/        @commonpub/config      defineCommonPubConfig() factory
    server/        @commonpub/server      Framework-agnostic business logic
    docs/          @commonpub/docs        Pluggable docs module
    editor/        @commonpub/editor      TipTap extensions + block types
    explainer/     @commonpub/explainer   Interactive module runtime
    learning/      @commonpub/learning    Learning path engine
    test-utils/    @commonpub/test-utils  Shared test helpers
  apps/
    reference/     Nuxt 3 reference app
  deploy/          Docker, compose, deploy scripts
```

## Tech Stack

| Layer      | Technology                                     |
| ---------- | ---------------------------------------------- |
| Framework  | Nuxt 3 (reference app) + Vue 3 (UI components) |
| Auth       | Better Auth                                    |
| Federation | Fedify                                         |
| Database   | PostgreSQL 16 + Drizzle ORM                    |
| Editor     | TipTap (content), CodeMirror 6 (docs)          |
| Search     | Meilisearch (primary), Postgres FTS (fallback) |
| Queue      | Redis/Valkey                                   |
| Monorepo   | Turborepo + pnpm                               |

## Development

```bash
pnpm install          # Install all dependencies
pnpm build            # Build all packages
pnpm test             # Run all tests
pnpm lint             # Lint all packages
pnpm typecheck        # Type-check all packages
pnpm dev:infra        # Start Docker infrastructure
pnpm dev:app          # Start Nuxt dev server
pnpm db:push          # Push schema to database
```

## Testing

- **Unit tests** across 13 packages + reference app (Vitest)
- **Component tests** with @testing-library/vue + axe-core
- **E2E tests** with Playwright (auth, content, theme, admin, a11y)
- **Accessibility**: axe-core on all UI components, WCAG 2.1 AA

```bash
pnpm test                    # Unit tests
pnpm exec playwright test    # E2E tests
```

## Deployment

See [docs/deployment.md](docs/deployment.md) for detailed instructions.

Supports Docker Compose on a VPS, DigitalOcean App Platform, App Platform + managed Supabase, and any Docker-compatible host.

## Package Documentation

Each package has its own README with API docs, usage examples, and architecture details:

| Package | Docs |
| ------- | ---- |
| `@commonpub/schema` | [packages/schema/README.md](packages/schema/README.md) |
| `@commonpub/config` | [packages/config/README.md](packages/config/README.md) |
| `@commonpub/auth` | [packages/auth/README.md](packages/auth/README.md) |
| `@commonpub/protocol` | [packages/protocol/README.md](packages/protocol/README.md) |
| `@commonpub/server` | [packages/server/README.md](packages/server/README.md) |
| `@commonpub/ui` | [packages/ui/README.md](packages/ui/README.md) |
| `@commonpub/editor` | [packages/editor/README.md](packages/editor/README.md) |
| `@commonpub/explainer` | [packages/explainer/README.md](packages/explainer/README.md) |
| `@commonpub/learning` | [packages/learning/README.md](packages/learning/README.md) |
| `@commonpub/docs` | [packages/docs/README.md](packages/docs/README.md) |
| `@commonpub/test-utils` | [packages/test-utils/README.md](packages/test-utils/README.md) |
| Reference App | [apps/reference/README.md](apps/reference/README.md) |
| Deploy | [deploy/README.md](deploy/README.md) |

## Project Documentation

- [Master Plan](docs/plan.md): Implementation phases and architecture
- [Architecture Decision Records](docs/adr/): 26 ADRs documenting key decisions
- [Contributing Guide](docs/contributing.md): Development workflow and standards
- [Coding Standards](docs/coding-standards.md): TypeScript, Vue 3, CSS, testing conventions
- [Deployment Guide](docs/deployment.md): Production setup and operations
- [Quickstart](docs/quickstart.md): Local development setup
- [A11y Audit](docs/a11y-audit.md): Accessibility compliance report
- [CHANGELOG](CHANGELOG.md): Release history

## Requirements

- Node.js >= 22
- pnpm >= 10
- Docker (for Postgres, Redis, Meilisearch)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/contributing.md](docs/contributing.md) for the full guide.

```bash
git clone https://github.com/commonpub/commonpub.git
cd commonpub
docker compose up -d
cp .env.example .env
pnpm install
pnpm build && pnpm test
```

## License

MIT
