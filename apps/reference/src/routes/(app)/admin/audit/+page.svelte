<script lang="ts">
  import AuditLogTable from '$lib/components/admin/AuditLogTable.svelte';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
  <title>Audit Log — Admin</title>
</svelte:head>

<h1 class="admin-heading">Audit Log</h1>

<form method="get" class="admin-filters">
  <input
    type="text"
    name="action"
    value={data.action ?? ''}
    placeholder="Filter by action..."
    aria-label="Filter by action"
    class="admin-input"
  />
  <input
    type="text"
    name="targetType"
    value={data.targetType ?? ''}
    placeholder="Filter by target type..."
    aria-label="Filter by target type"
    class="admin-input"
  />
  <button type="submit" class="admin-btn">Filter</button>
</form>

<p class="admin-count">{data.total} log entr{data.total === 1 ? 'y' : 'ies'}</p>

<AuditLogTable logs={data.logs} />

<style>
  .admin-heading {
    font-family: var(--font-heading, sans-serif);
    font-size: var(--text-2xl, 1.5rem);
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text, #1a1a1a);
    margin: 0 0 var(--space-4, 1rem);
  }

  .admin-filters {
    display: flex;
    gap: var(--space-2, 0.5rem);
    margin-bottom: var(--space-4, 1rem);
    flex-wrap: wrap;
  }

  .admin-input {
    font-family: var(--font-body, sans-serif);
    font-size: var(--text-sm, 0.75rem);
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    border: var(--border-width-thin, 1px) solid var(--color-border, #e5e7eb);
    border-radius: var(--radius-md, 0.25rem);
    background: var(--color-surface, #fff);
    color: var(--color-text, #1a1a1a);
  }

  .admin-input:focus {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  .admin-btn {
    font-family: var(--font-body, sans-serif);
    font-size: var(--text-sm, 0.75rem);
    font-weight: var(--font-weight-medium, 500);
    padding: var(--space-2, 0.5rem) var(--space-4, 1rem);
    background: var(--color-primary, #3b82f6);
    color: var(--color-primary-text, #fff);
    border: none;
    border-radius: var(--radius-md, 0.25rem);
    cursor: pointer;
  }

  .admin-btn:focus {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  .admin-count {
    font-family: var(--font-body, sans-serif);
    font-size: var(--text-sm, 0.75rem);
    color: var(--color-text-muted, #888);
    margin-bottom: var(--space-3, 0.75rem);
  }
</style>
