<script lang="ts">
  let {
    title,
    description,
    class: className = '',
  }: {
    title: string;
    description: string;
    class?: string;
  } = $props();
</script>

<article class="feature-card {className}">
  <h3 class="feature-title">{title}</h3>
  <p class="feature-description">{description}</p>
</article>

<style>
  .feature-card {
    padding: var(--space-6, 1.5rem);
    background-color: var(--paper-1, #ffffff);
    border: 1px solid var(--border-1, #e2e8f0);
    border-radius: var(--radius-lg, 0.75rem);
  }

  .feature-title {
    font-family: var(--font-heading, system-ui, sans-serif);
    font-size: var(--text-lg, 1.125rem);
    font-weight: 600;
    color: var(--ink-1, #1a1a2e);
    margin-bottom: var(--space-2, 0.5rem);
  }

  .feature-description {
    color: var(--ink-2, #4a4a6a);
    font-size: var(--text-sm, 0.875rem);
    line-height: 1.6;
  }
</style>
