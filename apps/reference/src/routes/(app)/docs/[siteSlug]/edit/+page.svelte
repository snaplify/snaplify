<script lang="ts">
  import type { PageData, ActionData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
  <title>Edit {data.site.name} — Snaplify Docs</title>
</svelte:head>

<section class="edit-site-page">
  <h1 class="page-title">Site Settings: {data.site.name}</h1>

  {#if form?.error}
    <div class="error-message" role="alert">{form.error}</div>
  {/if}
  {#if form?.success}
    <div class="success-message" role="status">Settings updated.</div>
  {/if}

  <form method="POST" action="?/update" class="site-form">
    <div class="form-field">
      <label for="name" class="form-label">Name</label>
      <input id="name" name="name" type="text" value={data.site.name} required maxlength="128" class="form-input" />
    </div>
    <div class="form-field">
      <label for="description" class="form-label">Description</label>
      <textarea id="description" name="description" maxlength="2000" class="form-textarea" rows="3">{data.site.description ?? ''}</textarea>
    </div>
    <button type="submit" class="form-submit">Save Changes</button>
  </form>

  <hr class="divider" />

  <h2 class="section-title">Pages</h2>

  <form method="POST" action="?/createPage" class="inline-form">
    <input name="title" type="text" placeholder="New page title..." required class="form-input" aria-label="New page title" />
    <button type="submit" class="form-submit">Add Page</button>
  </form>

  {#if data.pages.length > 0}
    <ul class="page-list">
      {#each data.pages as page (page.id)}
        <li class="page-list-item">
          <a href="/docs/{data.site.slug}/edit/{page.id}" class="page-list-link">{page.title}</a>
          <span class="page-list-slug">/{page.slug}</span>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="empty-state">No pages yet. Create your first page above.</p>
  {/if}

  <hr class="divider" />

  <h2 class="section-title danger-title">Danger Zone</h2>
  <form method="POST" action="?/delete">
    <button type="submit" class="form-submit danger" onclick={(e) => { if (!confirm('Delete this entire docs site? This cannot be undone.')) e.preventDefault(); }}>
      Delete Site
    </button>
  </form>
</section>

<style>
  .edit-site-page {
    max-width: var(--layout-narrow-width, 640px);
    margin: 0 auto;
    padding: var(--space-md, 1rem);
  }

  .page-title {
    font-size: var(--font-size-xl, 1.5rem);
    margin-bottom: var(--space-lg, 2rem);
    color: var(--color-text, inherit);
  }

  .section-title {
    font-size: var(--font-size-lg, 1.125rem);
    margin-bottom: var(--space-sm, 0.5rem);
    color: var(--color-text, inherit);
  }

  .danger-title { color: var(--color-danger, #ef4444); }

  .error-message {
    padding: var(--space-sm, 0.5rem);
    margin-bottom: var(--space-md, 1rem);
    border: 1px solid var(--color-danger, #ef4444);
    border-radius: var(--radius-sm, 0.25rem);
    color: var(--color-danger, #ef4444);
    font-size: var(--font-size-sm, 0.875rem);
  }

  .success-message {
    padding: var(--space-sm, 0.5rem);
    margin-bottom: var(--space-md, 1rem);
    border: 1px solid var(--color-success, #22c55e);
    border-radius: var(--radius-sm, 0.25rem);
    color: var(--color-success, #22c55e);
    font-size: var(--font-size-sm, 0.875rem);
  }

  .site-form, .inline-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm, 0.5rem);
    margin-bottom: var(--space-md, 1rem);
  }

  .inline-form {
    flex-direction: row;
    align-items: center;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs, 0.25rem);
  }

  .form-label {
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text, inherit);
  }

  .form-input, .form-textarea {
    padding: var(--space-sm, 0.5rem);
    border: 1px solid var(--color-border, #e5e7eb);
    border-radius: var(--radius-sm, 0.25rem);
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--color-text, inherit);
    background: var(--color-bg-surface, #fff);
  }

  .form-submit {
    padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
    background: var(--color-primary, #3b82f6);
    color: var(--color-on-primary, #fff);
    border: none;
    border-radius: var(--radius-sm, 0.25rem);
    font-size: var(--font-size-sm, 0.875rem);
    cursor: pointer;
    align-self: flex-start;
  }

  .form-submit.danger {
    background: var(--color-danger, #ef4444);
  }

  .divider {
    margin: var(--space-lg, 2rem) 0;
    border: none;
    border-top: 1px solid var(--color-border, #e5e7eb);
  }

  .page-list {
    list-style: none;
    padding: 0;
  }

  .page-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-sm, 0.5rem) 0;
    border-bottom: 1px solid var(--color-border, #e5e7eb);
  }

  .page-list-link {
    color: var(--color-primary, #3b82f6);
    text-decoration: none;
  }

  .page-list-slug {
    font-size: var(--font-size-xs, 0.75rem);
    color: var(--color-text-muted, #9ca3af);
    font-family: var(--font-mono, monospace);
  }

  .empty-state {
    color: var(--color-text-secondary, #6b7280);
    padding: var(--space-md, 1rem) 0;
  }
</style>
