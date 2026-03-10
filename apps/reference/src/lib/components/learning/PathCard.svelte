<script lang="ts">
  import type { LearningPathListItem } from '$lib/types';

  let { path }: { path: LearningPathListItem } = $props();
</script>

<a href="/learn/{path.slug}" class="path-card">
  {#if path.coverImageUrl}
    <img src={path.coverImageUrl} alt="" class="card-cover" />
  {:else}
    <div class="card-cover-placeholder"></div>
  {/if}

  <div class="card-body">
    <h3 class="card-title">{path.title}</h3>
    {#if path.description}
      <p class="card-description">{path.description}</p>
    {/if}

    <div class="card-meta">
      {#if path.difficulty}
        <span class="badge difficulty-{path.difficulty}">{path.difficulty}</span>
      {/if}
      {#if path.estimatedHours}
        <span class="meta-text">{path.estimatedHours}h</span>
      {/if}
      <span class="meta-text">{path.enrollmentCount} enrolled</span>
    </div>

    <div class="card-author">
      <span>By {path.author.displayName ?? path.author.username}</span>
    </div>
  </div>
</a>

<style>
  .path-card {
    display: block;
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-md, 6px);
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: box-shadow 0.15s;
    background: var(--color-surface, #ffffff);
  }

  .path-card:hover {
    box-shadow: 0 2px 8px var(--color-shadow, rgba(0, 0, 0, 0.08));
  }

  .card-cover {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  .card-cover-placeholder {
    width: 100%;
    aspect-ratio: 16 / 9;
    background: var(--color-surface-secondary, #f5f5f5);
  }

  .card-body {
    padding: var(--space-md, 1rem);
  }

  .card-title {
    font-size: var(--font-size-md, 1rem);
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text, #1a1a1a);
    margin: 0 0 var(--space-xs, 0.25rem);
  }

  .card-description {
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--color-text-secondary, #666);
    margin: 0 0 var(--space-sm, 0.5rem);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-meta {
    display: flex;
    gap: var(--space-xs, 0.25rem);
    font-size: var(--font-size-xs, 0.75rem);
    margin-bottom: var(--space-sm, 0.5rem);
  }

  .badge {
    padding: 0 var(--space-xs, 0.25rem);
    border-radius: var(--radius-sm, 4px);
    font-weight: var(--font-weight-medium, 500);
    text-transform: capitalize;
  }

  .difficulty-beginner {
    color: var(--color-success, #22c55e);
    background: var(--color-success-bg, #f0fdf4);
  }
  .difficulty-intermediate {
    color: var(--color-warning, #f59e0b);
    background: var(--color-warning-bg, #fffbeb);
  }
  .difficulty-advanced {
    color: var(--color-error, #dc2626);
    background: var(--color-error-bg, #fef2f2);
  }

  .meta-text {
    color: var(--color-text-secondary, #666);
  }

  .card-author {
    font-size: var(--font-size-xs, 0.75rem);
    color: var(--color-text-secondary, #666);
  }
</style>
