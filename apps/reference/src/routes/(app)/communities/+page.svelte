<script lang="ts">
  import CommunityCard from '$lib/components/community/CommunityCard.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Communities — Snaplify</title>
</svelte:head>

<div class="communities-page">
  <div class="page-header">
    <h1>Communities</h1>
    {#if data.communities.length > 0 || data.search || data.joinPolicy}
      <a href="/communities/create" class="btn btn-primary">Create Community</a>
    {/if}
  </div>

  <form class="filters" method="GET" action="/communities">
    <input
      type="search"
      name="search"
      placeholder="Search communities..."
      value={data.search ?? ''}
      class="search-input"
      aria-label="Search communities"
    />
    <select name="joinPolicy" class="filter-select" aria-label="Filter by join policy">
      <option value="">All policies</option>
      <option value="open" selected={data.joinPolicy === 'open'}>Open</option>
      <option value="approval" selected={data.joinPolicy === 'approval'}>Approval</option>
      <option value="invite" selected={data.joinPolicy === 'invite'}>Invite only</option>
    </select>
    <button type="submit" class="btn btn-secondary">Filter</button>
  </form>

  {#if data.communities.length === 0}
    <div class="empty-state">
      <p>No communities found.</p>
      <a href="/communities/create">Create the first community</a>
    </div>
  {:else}
    <div class="community-grid">
      {#each data.communities as community (community.id)}
        <CommunityCard {community} />
      {/each}
    </div>

    {#if data.total > 20}
      <nav class="pagination" aria-label="Pagination">
        {#if data.page > 1}
          <a href="/communities?page={data.page - 1}" class="btn btn-small">Previous</a>
        {/if}
        <span class="page-info">Page {data.page} of {Math.ceil(data.total / 20)}</span>
        {#if data.page * 20 < data.total}
          <a href="/communities?page={data.page + 1}" class="btn btn-small">Next</a>
        {/if}
      </nav>
    {/if}
  {/if}
</div>

<style>
  .communities-page {
    max-width: var(--layout-content-width, 960px);
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-lg, 2rem);
  }

  .page-header h1 {
    font-size: var(--font-size-2xl, 1.875rem);
    color: var(--color-text, #1a1a1a);
  }

  .filters {
    display: flex;
    gap: var(--space-sm, 0.5rem);
    margin-bottom: var(--space-lg, 2rem);
  }

  .search-input {
    flex: 1;
    padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-md, 6px);
    font-size: var(--font-size-md, 1rem);
    background: var(--color-surface, #ffffff);
    color: var(--color-text, #1a1a1a);
  }

  .filter-select {
    padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-md, 6px);
    background: var(--color-surface, #ffffff);
    color: var(--color-text, #1a1a1a);
  }

  .community-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-md, 1rem);
  }

  .empty-state {
    text-align: center;
    padding: var(--space-xl, 3rem);
    color: var(--color-text-secondary, #666);
  }

  .empty-state a {
    color: var(--color-primary, #2563eb);
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-md, 1rem);
    margin-top: var(--space-lg, 2rem);
  }

  .page-info {
    color: var(--color-text-secondary, #666);
    font-size: var(--font-size-sm, 0.875rem);
  }

  .btn {
    padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
    border: none;
    border-radius: var(--radius-md, 6px);
    font-size: var(--font-size-md, 1rem);
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
  }

  .btn-primary {
    background: var(--color-primary, #2563eb);
    color: var(--color-on-primary, #ffffff);
  }

  .btn-secondary {
    background: var(--color-surface-secondary, #f5f5f5);
    color: var(--color-text, #1a1a1a);
    border: 1px solid var(--color-border, #e5e5e5);
  }

  .btn-small {
    padding: var(--space-xs, 0.25rem) var(--space-sm, 0.5rem);
    font-size: var(--font-size-sm, 0.875rem);
    background: var(--color-surface-secondary, #f5f5f5);
    color: var(--color-text, #1a1a1a);
    border: 1px solid var(--color-border, #e5e5e5);
  }
</style>
