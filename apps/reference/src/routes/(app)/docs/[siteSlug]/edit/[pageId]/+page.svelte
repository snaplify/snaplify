<script lang="ts">
  import CodeMirrorEditor from '$lib/components/docs/CodeMirrorEditor.svelte';
  import type { PageData, ActionData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let content = $state(data.page.content);
  let title = $state(data.page.title);
</script>

<svelte:head>
  <title>Edit: {data.page.title} — Snaplify Docs</title>
</svelte:head>

<section class="edit-page">
  <div class="edit-header">
    <h1 class="page-title">Edit Page</h1>
    <a href="/docs/{data.site.slug}" class="back-link">Back to docs</a>
  </div>

  {#if form?.error}
    <div class="error-message" role="alert">{form.error}</div>
  {/if}
  {#if form?.success}
    <div class="success-message" role="status">Page saved.</div>
  {/if}

  <form method="POST" action="?/save" class="edit-form">
    <div class="form-field">
      <label for="title" class="form-label">Title</label>
      <input id="title" name="title" type="text" bind:value={title} required maxlength="255" class="form-input" />
    </div>

    <div class="form-field">
      <label for="slug" class="form-label">Slug</label>
      <input id="slug" name="slug" type="text" value={data.page.slug} maxlength="255" class="form-input" />
    </div>

    <div class="form-field editor-field">
      <label class="form-label">Content (Markdown)</label>
      <CodeMirrorEditor bind:content class="editor" />
      <input type="hidden" name="content" value={content} />
    </div>

    <div class="form-actions">
      <button type="submit" class="form-submit">Save</button>
    </div>
  </form>

  <form method="POST" action="?/delete" class="delete-form">
    <button type="submit" class="form-submit danger" onclick={(e) => { if (!confirm('Delete this page?')) e.preventDefault(); }}>Delete Page</button>
  </form>
</section>

<style>
  .edit-page {
    max-width: var(--layout-wide-width, 960px);
    margin: 0 auto;
    padding: var(--space-md, 1rem);
  }

  .edit-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-lg, 2rem);
  }

  .page-title {
    font-size: var(--font-size-xl, 1.5rem);
    color: var(--color-text, inherit);
  }

  .back-link {
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--color-primary, #3b82f6);
    text-decoration: none;
  }

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

  .edit-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-md, 1rem);
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs, 0.25rem);
  }

  .editor-field {
    min-height: 30rem;
  }

  .form-label {
    font-size: var(--font-size-sm, 0.875rem);
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text, inherit);
  }

  .form-input {
    padding: var(--space-sm, 0.5rem);
    border: 1px solid var(--color-border, #e5e7eb);
    border-radius: var(--radius-sm, 0.25rem);
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--color-text, inherit);
    background: var(--color-bg-surface, #fff);
  }

  .form-actions {
    display: flex;
    gap: var(--space-sm, 0.5rem);
    align-items: center;
  }

  .form-submit {
    padding: var(--space-sm, 0.5rem) var(--space-md, 1rem);
    background: var(--color-primary, #3b82f6);
    color: var(--color-on-primary, #fff);
    border: none;
    border-radius: var(--radius-sm, 0.25rem);
    font-size: var(--font-size-sm, 0.875rem);
    cursor: pointer;
  }

  .form-submit.danger {
    background: var(--color-danger, #ef4444);
  }

  .delete-form {
    margin-top: var(--space-lg, 2rem);
    padding-top: var(--space-md, 1rem);
    border-top: 1px solid var(--color-border, #e5e7eb);
  }
</style>
