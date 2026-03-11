<script lang="ts">
  const contentTypes = [
    {
      type: 'article',
      label: 'Article',
      abbr: 'ART',
      description: 'Long-form content with rich formatting, code blocks, and images.',
      href: '/create/article',
    },
    {
      type: 'blog',
      label: 'Blog Post',
      abbr: 'BLG',
      description: 'Share thoughts, updates, or stories with your audience.',
      href: '/create/blog',
    },
    {
      type: 'project',
      label: 'Project',
      abbr: 'PRJ',
      description: 'Document your project with steps, code samples, and screenshots.',
      href: '/create/project',
    },
    {
      type: 'explainer',
      label: 'Explainer',
      abbr: 'EXP',
      description: 'Interactive modules with quizzes, sliders, and checkpoints.',
      href: '/explainers/create',
    },
    {
      type: 'learning',
      label: 'Learning Path',
      abbr: 'LRN',
      description: 'Structured curriculum with modules, lessons, and certificates.',
      href: '/learn/create',
    },
    {
      type: 'docs',
      label: 'Docs Site',
      abbr: 'DOC',
      description: 'Documentation with versioning, search, and navigation.',
      href: '/docs/create',
    },
  ];
</script>

<svelte:head>
  <title>Create — Snaplify</title>
</svelte:head>

<div class="create-page">
  <div class="create-header">
    <h1 class="create-title">Create</h1>
    <p class="create-desc">Choose a content type to get started.</p>
  </div>

  <div class="type-grid">
    {#each contentTypes as ct}
      <a href={ct.href} class="type-card">
        <span class="tc-icon">{ct.abbr}</span>
        <div class="tc-info">
          <span class="tc-label">{ct.label}</span>
          <span class="tc-description">{ct.description}</span>
        </div>
        <span class="tc-arrow">→</span>
      </a>
    {/each}
  </div>
</div>

<style>
  .create-page {
    max-width: 720px;
    margin: 0 auto;
    padding: var(--space-8, 2rem) 0;
  }

  .create-header {
    margin-bottom: var(--space-8, 2rem);
  }

  .create-title {
    font-size: var(--text-2xl, 1.75rem);
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text, #d8d5cf);
    margin: 0 0 var(--space-1, 0.25rem);
  }

  .create-desc {
    font-size: var(--text-sm, 0.875rem);
    color: var(--color-text-secondary, #888884);
    margin: 0;
  }

  .type-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-2, 0.5rem);
  }

  .type-card {
    display: flex;
    align-items: center;
    gap: var(--space-4, 1rem);
    padding: var(--space-4, 1rem) var(--space-4, 1rem);
    border: 1px solid var(--color-border, #272725);
    border-radius: var(--radius-md, 6px);
    background: transparent;
    text-decoration: none;
    color: inherit;
    transition: border-color 0.12s ease, background 0.12s ease;
  }

  .type-card:hover {
    border-color: var(--color-primary, #5b9cf6);
    background: var(--color-surface-alt, #141413);
  }

  .tc-icon {
    font-family: var(--font-mono, monospace);
    font-size: 10px;
    font-weight: var(--font-weight-bold, 700);
    letter-spacing: 0.08em;
    color: var(--color-primary, #5b9cf6);
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm, 4px);
    background: rgba(91, 156, 246, 0.06);
    border: 1px solid rgba(91, 156, 246, 0.15);
  }

  .tc-info {
    flex: 1;
    min-width: 0;
  }

  .tc-label {
    display: block;
    font-weight: var(--font-weight-medium, 500);
    font-size: var(--text-sm, 0.875rem);
    color: var(--color-text, #d8d5cf);
    margin-bottom: 2px;
  }

  .tc-description {
    display: block;
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-secondary, #888884);
    line-height: 1.4;
  }

  .tc-arrow {
    font-family: var(--font-mono, monospace);
    color: var(--color-text-muted, #444440);
    font-size: var(--text-lg, 1.125rem);
    flex-shrink: 0;
  }

  .type-card:hover .tc-arrow {
    color: var(--color-primary, #5b9cf6);
  }
</style>
