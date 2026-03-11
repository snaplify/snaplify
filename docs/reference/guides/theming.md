# Theming

> 4 built-in themes, 142 CSS custom property tokens, token overrides, and admin controls.

**Source**: `packages/ui/src/theme.ts`

---

## Built-in Themes

| ID | Name | Description | Dark Mode |
|----|------|-------------|-----------|
| `base` | Base | Clean default theme with blue accents | No |
| `deepwood` | Deepwood | Forest greens, lime accent, nature-inspired | Yes |
| `hackbuild` | hack.build | Punk zine theme, paper textures, hard-edge shadows | No |
| `deveco` | deveco.io | Clean tech, teal/pink/yellow accents | No |

Themes are applied via the `data-theme` attribute on the root element. The `base` theme uses no `data-theme` attribute (it's the default CSS).

---

## CSS Token Reference (142 tokens)

All tokens are CSS custom properties prefixed with `--`. Use them as `var(--token-name)` in component styles. **Never hardcode colors or fonts** (standing rule #3).

### Surface Colors (4 tokens)

| Token | Purpose |
|-------|---------|
| `color-surface` | Main background |
| `color-surface-alt` | Alternate/striped background |
| `color-surface-raised` | Cards, modals, raised elements |
| `color-surface-overlay` | Overlay/backdrop background |

### Text Colors (4 tokens)

| Token | Purpose |
|-------|---------|
| `color-text` | Primary text |
| `color-text-secondary` | Secondary/supporting text |
| `color-text-muted` | Muted/disabled text |
| `color-text-inverse` | Text on dark/primary backgrounds |

### Brand Colors (3 tokens)

| Token | Purpose |
|-------|---------|
| `color-primary` | Primary brand color (buttons, links) |
| `color-primary-hover` | Primary hover state |
| `color-primary-text` | Text on primary-colored backgrounds |

### Accent Colors (3 tokens)

| Token | Purpose |
|-------|---------|
| `color-accent` | Secondary brand/accent color |
| `color-accent-hover` | Accent hover state |
| `color-accent-text` | Text on accent-colored backgrounds |

### Semantic Colors (4 tokens)

| Token | Purpose |
|-------|---------|
| `color-success` | Success states, confirmations |
| `color-warning` | Warning states, caution |
| `color-error` | Error states, destructive actions |
| `color-info` | Informational states |

### Border Colors (3 tokens)

| Token | Purpose |
|-------|---------|
| `color-border` | Default borders |
| `color-border-strong` | Emphasized borders |
| `color-border-focus` | Focus ring borders |

### Interactive Colors (2 tokens)

| Token | Purpose |
|-------|---------|
| `color-link` | Link text color |
| `color-link-hover` | Link hover color |

### Typography — Fonts (3 tokens)

| Token | Purpose |
|-------|---------|
| `font-heading` | Heading font family |
| `font-body` | Body text font family |
| `font-mono` | Monospace/code font family |

### Typography — Font Sizes (11 tokens)

| Token | Typical Value |
|-------|--------------|
| `text-xs` | 0.75rem |
| `text-sm` | 0.875rem |
| `text-base` | 1rem |
| `text-md` | 1.0625rem |
| `text-lg` | 1.125rem |
| `text-xl` | 1.25rem |
| `text-2xl` | 1.5rem |
| `text-3xl` | 1.875rem |
| `text-4xl` | 2.25rem |
| `text-5xl` | 3rem |
| `text-6xl` | 3.75rem |

### Typography — Font Weights (4 tokens)

| Token | Typical Value |
|-------|--------------|
| `font-weight-normal` | 400 |
| `font-weight-medium` | 500 |
| `font-weight-semibold` | 600 |
| `font-weight-bold` | 700 |

### Typography — Line Heights (4 tokens)

| Token | Typical Value |
|-------|--------------|
| `leading-tight` | 1.25 |
| `leading-snug` | 1.375 |
| `leading-normal` | 1.5 |
| `leading-relaxed` | 1.625 |

### Spacing (12 tokens)

| Token | Typical Value |
|-------|--------------|
| `space-1` | 0.25rem |
| `space-2` | 0.5rem |
| `space-3` | 0.75rem |
| `space-4` | 1rem |
| `space-5` | 1.25rem |
| `space-6` | 1.5rem |
| `space-8` | 2rem |
| `space-10` | 2.5rem |
| `space-12` | 3rem |
| `space-16` | 4rem |
| `space-20` | 5rem |
| `space-24` | 6rem |

### Border Widths (3 tokens)

| Token | Typical Value |
|-------|--------------|
| `border-width-thin` | 1px |
| `border-width-default` | 2px |
| `border-width-thick` | 3px |

### Border Radii (7 tokens)

| Token | Typical Value |
|-------|--------------|
| `radius-none` | 0 |
| `radius-sm` | 0.125rem |
| `radius-md` | 0.375rem |
| `radius-lg` | 0.5rem |
| `radius-xl` | 0.75rem |
| `radius-2xl` | 1rem |
| `radius-full` | 9999px |

### Shadows (4 tokens)

| Token | Purpose |
|-------|---------|
| `shadow-sm` | Subtle shadow (buttons, inputs) |
| `shadow-md` | Medium shadow (cards) |
| `shadow-lg` | Large shadow (dropdowns, popovers) |
| `shadow-xl` | Extra-large shadow (modals) |

### Transitions (3 tokens)

| Token | Typical Value |
|-------|--------------|
| `transition-fast` | 100ms |
| `transition-default` | 200ms |
| `transition-slow` | 300ms |

### Z-Index Layers (7 tokens)

| Token | Typical Value | Purpose |
|-------|--------------|---------|
| `z-dropdown` | 10 | Dropdown menus |
| `z-sticky` | 20 | Sticky headers |
| `z-fixed` | 30 | Fixed position elements |
| `z-modal-backdrop` | 40 | Modal backdrop overlay |
| `z-modal` | 50 | Modal content |
| `z-toast` | 60 | Toast notifications |
| `z-tooltip` | 70 | Tooltips |

### Layout (4 tokens)

| Token | Typical Value | Purpose |
|-------|--------------|---------|
| `nav-height` | 64px | Main navigation height |
| `subnav-height` | 48px | Sub-navigation height |
| `sidebar-width` | 280px | Sidebar width |
| `content-max-width` | 768px | Content area max width |
| `content-wide-max-width` | 1200px | Wide content area max width |

### Focus (1 token)

| Token | Purpose |
|-------|---------|
| `focus-ring` | Focus ring style (outline shorthand) |

---

## Theme API

### `BUILT_IN_THEMES: ThemeDefinition[]`

Array of all 4 built-in theme definitions.

```typescript
interface ThemeDefinition {
  id: string;          // 'base' | 'deepwood' | 'hackbuild' | 'deveco'
  name: string;        // Human-readable name
  description: string; // Short description
  isDark: boolean;     // Whether this is a dark theme
}
```

### `TOKEN_NAMES: string[]`

Array of all 142 valid token names. Used for validation and iteration.

### `isValidThemeId(id: string): boolean`

Returns `true` if `id` matches a built-in theme.

### `validateTokenOverrides(overrides: Record<string, string>): { valid, invalid }`

Validates token override keys against `TOKEN_NAMES`.

**Parameters**: Object mapping token names to CSS values.

**Returns**:
- `valid`: `Record<string, string>` — Only the entries with valid token names
- `invalid`: `string[]` — Token names that don't exist

### `applyThemeToElement(el: HTMLElement, themeId: string, overrides?: Record<string, string>): void`

Applies a theme to a DOM element:
1. Sets `data-theme` attribute (or removes it for `base`)
2. Clears all previous inline token overrides
3. Applies new overrides as inline `--token-name` CSS custom properties

### `getThemeFromElement(el: HTMLElement): { themeId, overrides }`

Reads the current theme from a DOM element:
- `themeId`: Value of `data-theme` attribute (or `'base'` if absent)
- `overrides`: Any inline CSS custom property overrides currently set

---

## Theme Controls

### User Theme Preference

Users set their preferred theme at `/dashboard/settings` via the `setTheme` form action. Stored in `users.theme` column.

### Admin Instance Theme

Admins set the instance-wide default theme at `/admin/settings/theme`:
- `setTheme` action: Set the default theme for all users
- `setTokenOverrides` action: Override individual CSS tokens instance-wide

Token overrides are stored in `instanceSettings` (key-value store) and applied on the server side during page rendering.

### Theme Application Order

1. Base CSS defines all 142 tokens as CSS custom properties
2. `data-theme` attribute activates theme-specific overrides via CSS
3. Admin token overrides applied as inline styles on root element
4. User theme preference overrides admin default (if set)
5. Per-element overrides (e.g., docs sites with `themeTokens`) applied last
