<script lang="ts">
  import PathCard from '$lib/components/learning/PathCard.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];
</script>

<svelte:head>
  <title>Learn — Snaplify</title>
  <meta name="description" content="Learning paths from the maker community." />
</svelte:head>

<section class="learn-page">
  <h1 class="page-title">Learning Paths</h1>

  <nav class="filters" aria-label="Difficulty filter">
    {#each difficulties as d}
      <a
        href="/learn{d === 'all' ? '' : `?difficulty=${d}`}"
        class="filter-link"
        class:filter-active={d === 'all' ? !data.difficulty : data.difficulty === d}
        aria-current={d === 'all'
          ? !data.difficulty
            ? 'page'
            : undefined
          : data.difficulty === d
            ? 'page'
            : undefined}
      >
        {d.charAt(0).toUpperCase() + d.slice(1)}
      </a>
    {/each}
  </nav>

  {#if data.items.length === 0}
    <div class="empty-state">
      <p>No learning paths published yet.</p>
    </div>
  {:else}
    <div class="path-grid">
      {#each data.items as path (path.id)}
        <PathCard {path} />
      {/each}
    </div>
  {/if}
</section>

<style>
  .learn-page {
    max-width: var(--layout-max-width, 1200px);
    margin: 0 auto;
    padding: var(--space-md, 1rem);
  }

  .page-title {
    font-size: var(--font-size-2xl, 1.875rem);
    margin-bottom: var(--space-md, 1rem);
    color: var(--color-text, #1a1a1a);
  }

  .filters {
    display: flex;
    gap: var(--space-xs, 0.25rem);
    margin-bottom: var(--space-lg, 2rem);
    border-bottom: 1px solid var(--color-border, #e5e5e5);
  }

  .filter-link {
    padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
    text-decoration: none;
    color: var(--color-text-secondary, #666);
    border-bottom: 2px solid transparent;
    font-size: var(--font-size-sm, 0.875rem);
  }

  .filter-active {
    color: var(--color-primary, #2563eb);
    border-bottom-color: var(--color-primary, #2563eb);
    font-weight: var(--font-weight-medium, 500);
  }

  .path-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--space-md, 1rem);
  }

  .empty-state {
    text-align: center;
    padding: var(--space-xl, 3rem);
    color: var(--color-text-secondary, #666);
  }
</style>
