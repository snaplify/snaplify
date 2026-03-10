<script lang="ts">
  import type { PageData, ActionData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();
  let structureText = $state(JSON.stringify(data.nav, null, 2));
</script>

<svelte:head>
  <title>Edit Navigation — {data.site.name} Docs</title>
</svelte:head>

<section class="nav-editor-page">
  <h1 class="page-title">Navigation Editor</h1>
  <p class="page-desc">Edit the sidebar navigation structure as JSON. Each item needs <code>id</code>, <code>title</code>, and optionally <code>pageId</code> and <code>children</code>.</p>

  {#if form?.error}
    <div class="error-message" role="alert">{form.error}</div>
  {/if}
  {#if form?.success}
    <div class="success-message" role="status">Navigation saved.</div>
  {/if}

  <form method="POST" class="nav-form">
    <div class="form-field">
      <label for="structure" class="form-label">Navigation Structure (JSON)</label>
      <textarea id="structure" name="structure" rows="20" class="form-textarea code" bind:value={structureText}></textarea>
    </div>

    <div class="page-reference">
      <h3 class="ref-title">Available Pages</h3>
      <ul class="ref-list">
        {#each data.pages as page}
          <li class="ref-item"><code>{page.id}</code> — {page.title} (/{page.slug})</li>
        {/each}
      </ul>
    </div>

    <button type="submit" class="form-submit">Save Navigation</button>
  </form>
</section>

<style>
  .nav-editor-page {
    max-width: var(--layout-narrow-width, 640px);
    margin: 0 auto;
    padding: var(--space-md, 1rem);
  }

  .page-title {
    font-size: var(--font-size-xl, 1.5rem);
    margin-bottom: var(--space-xs, 0.25rem);
    color: var(--color-text, inherit);
  }

  .page-desc {
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--color-text-secondary, #6b7280);
    margin-bottom: var(--space-lg, 2rem);
  }

  .error-message, .success-message {
    padding: var(--space-sm, 0.5rem);
    margin-bottom: var(--space-md, 1rem);
    border-radius: var(--radius-sm, 0.25rem);
    font-size: var(--font-size-sm, 0.875rem);
  }

  .error-message {
    border: 1px solid var(--color-danger, #ef4444);
    color: var(--color-danger, #ef4444);
  }

  .success-message {
    border: 1px solid var(--color-success, #22c55e);
    color: var(--color-success, #22c55e);
  }

  .nav-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-md, 1rem);
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

  .form-textarea.code {
    font-family: var(--font-mono, monospace);
    font-size: var(--font-size-sm, 0.875rem);
    padding: var(--space-sm, 0.5rem);
    border: 1px solid var(--color-border, #e5e7eb);
    border-radius: var(--radius-sm, 0.25rem);
    background: var(--color-bg-surface, #fff);
    color: var(--color-text, inherit);
  }

  .page-reference {
    padding: var(--space-sm, 0.5rem);
    background: var(--color-bg-muted, #f9fafb);
    border-radius: var(--radius-sm, 0.25rem);
  }

  .ref-title {
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: var(--font-weight-semibold, 600);
    margin-bottom: var(--space-xs, 0.25rem);
  }

  .ref-list {
    padding-left: var(--space-md, 1rem);
    font-size: var(--font-size-xs, 0.75rem);
  }

  .ref-item code {
    font-size: var(--font-size-xs, 0.75rem);
    background: var(--color-bg-code, #e5e7eb);
    padding: 0 var(--space-xs, 0.25rem);
    border-radius: var(--radius-xs, 0.125rem);
  }

  .form-submit {
    padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
    background: var(--color-primary, #3b82f6);
    color: var(--color-on-primary, #fff);
    border: none;
    border-radius: var(--radius-sm, 0.25rem);
    cursor: pointer;
    align-self: flex-start;
  }
</style>
