# Coding Standards

## TypeScript

- **Strict mode**: `strict: true`, `noUncheckedIndexedAccess: true`
- **No `any`**: Use `unknown` and narrow, or define proper types
- **Explicit return types** on all exported functions
- **Prefer `const`** over `let`, never use `var`
- **Use Drizzle query builder** — no raw SQL unless necessary and documented

## Vue 3

- **Composition API** with `<script setup lang="ts">` — no Options API
- **Components accept `class` prop** for external styling (via `$attrs` or explicit prop)
- **Events use Vue emit pattern**
- **Nuxt auto-imports**: `ref`, `computed`, `watch`, `useRoute`, `useFetch`, etc. — no manual imports needed in the reference app

## Nuxt Conventions

- **File-based routing**: `pages/` directory maps to routes
- **Server routes**: `server/api/` for API endpoints, `server/routes/` for non-API routes
- **Nitro server middleware**: `server/middleware/` for auth, logging, etc.
- **Runtime config**: Use `useRuntimeConfig()` — never import `process.env` directly in client code
- **SEO**: Use `useSeoMeta()` and `useHead()` composables

## CSS

- **CSS custom properties only** — `var(--*)` for all colors, fonts, spacing, shadows
- **No hardcoded values** in component styles
- **Token contract** defined in `packages/ui/theme/base.css`
- **Class prefix**: `cpub-` for component-scoped styles

## File Naming

| Type               | Convention  | Example              |
| ------------------ | ----------- | -------------------- |
| Vue components     | PascalCase  | `ProjectCard.vue`    |
| TypeScript modules | camelCase   | `contentService.ts`  |
| Schema files       | camelCase   | `learningPath.ts`    |
| CSS files          | kebab-case  | `base-tokens.css`    |
| Test files         | \*.test.ts  | `config.test.ts`     |
| ADRs               | NNN-kebab   | `025-nuxt-switch.md` |

## Testing

- **Write tests first** (TDD)
- **One assertion per test** when practical
- **Descriptive test names**: "should reject invalid email format"
- **Use test factories** from `@commonpub/test-utils`
- **Component tests** with `@testing-library/vue` + axe-core
- **Accessibility tests** on all interactive components

## Git

- **Conventional commits**: `type(scope): description`
- **Atomic commits**: one logical change per commit
- **Branch naming**: `feat/description`, `fix/description`, `test/description`
- **Squash merge** to main

## Accessibility

- **WCAG 2.1 AA minimum**
- **Keyboard navigable**: all interactive elements reachable via Tab, operable via Enter/Space
- **ARIA labels** on all interactive elements without visible text
- **Focus indicators** visible and high-contrast
- **Color not sole indicator** — always pair with text/icon
- **Reduced motion** respected via `prefers-reduced-motion`

## Security

- **Never trust client input** — validate at API boundary with Zod
- **Parameterized queries** only (Drizzle handles this)
- **CSP headers** configured in Nitro server middleware
- **Rate limiting** on auth and API endpoints
- **No secrets in code** — environment variables only
