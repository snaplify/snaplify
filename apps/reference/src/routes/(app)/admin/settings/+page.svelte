<script lang="ts">
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
  <title>Settings — Admin</title>
</svelte:head>

<h1 class="admin-heading">Instance Settings</h1>

<div class="admin-settings-grid">
  <form method="post" action="?/update" class="admin-setting-form">
    <label class="admin-label" for="instance-name">Instance Name</label>
    <input type="hidden" name="key" value="instance.name" />
    <input
      type="text"
      id="instance-name"
      name="value"
      value={data.settings['instance.name'] ?? ''}
      class="admin-input"
      placeholder="My Snaplify Instance"
    />
    <button type="submit" class="admin-btn">Save</button>
  </form>

  <form method="post" action="?/update" class="admin-setting-form">
    <label class="admin-label" for="instance-desc">Instance Description</label>
    <input type="hidden" name="key" value="instance.description" />
    <input
      type="text"
      id="instance-desc"
      name="value"
      value={data.settings['instance.description'] ?? ''}
      class="admin-input"
      placeholder="A maker community"
    />
    <button type="submit" class="admin-btn">Save</button>
  </form>

  <form method="post" action="?/update" class="admin-setting-form">
    <label class="admin-label" for="default-theme">Default Theme</label>
    <input type="hidden" name="key" value="theme.default" />
    <select id="default-theme" name="value" class="admin-select">
      <option value="base" selected={data.settings['theme.default'] === 'base'}>Base</option>
      <option value="deepwood" selected={data.settings['theme.default'] === 'deepwood'}>Deepwood</option>
      <option value="hackbuild" selected={data.settings['theme.default'] === 'hackbuild'}>hack.build</option>
      <option value="deveco" selected={data.settings['theme.default'] === 'deveco'}>deveco.io</option>
    </select>
    <button type="submit" class="admin-btn">Save</button>
  </form>
</div>

<style>
  .admin-heading {
    font-family: var(--font-heading, sans-serif);
    font-size: var(--text-2xl, 1.5rem);
    font-weight: var(--font-weight-bold, 700);
    color: var(--color-text, #1a1a1a);
    margin: 0 0 var(--space-6, 1.5rem);
  }

  .admin-settings-grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-4, 1rem);
  }

  .admin-setting-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-2, 0.5rem);
    padding: var(--space-4, 1rem);
    border: var(--border-width-thin, 1px) solid var(--color-border, #e5e7eb);
    border-radius: var(--radius-lg, 0.5rem);
    background: var(--color-surface-raised, #fff);
  }

  .admin-label {
    font-family: var(--font-body, sans-serif);
    font-size: var(--text-sm, 0.75rem);
    font-weight: var(--font-weight-semibold, 600);
    color: var(--color-text, #1a1a1a);
  }

  .admin-input,
  .admin-select {
    font-family: var(--font-body, sans-serif);
    font-size: var(--text-sm, 0.75rem);
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    border: var(--border-width-thin, 1px) solid var(--color-border, #e5e7eb);
    border-radius: var(--radius-md, 0.25rem);
    background: var(--color-surface, #fff);
    color: var(--color-text, #1a1a1a);
  }

  .admin-input:focus,
  .admin-select:focus {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  .admin-btn {
    align-self: flex-start;
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
</style>
