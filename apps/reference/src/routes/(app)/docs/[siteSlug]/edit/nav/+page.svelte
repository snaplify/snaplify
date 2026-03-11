<script lang="ts">
  import { Button } from '@snaplify/ui';
  import CodeMirrorEditor from '$lib/components/docs/CodeMirrorEditor.svelte';
  import type { PageData, ActionData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();
  let structureText = $state(JSON.stringify(data.nav, null, 2));
  let jsonError = $state('');

  function validateJson(text: string) {
    try {
      JSON.parse(text);
      jsonError = '';
    } catch (e) {
      jsonError = e instanceof Error ? e.message : 'Invalid JSON';
    }
  }

  $effect(() => {
    validateJson(structureText);
  });

  function formatJson() {
    try {
      const parsed = JSON.parse(structureText);
      structureText = JSON.stringify(parsed, null, 2);
      jsonError = '';
    } catch {
      // already shown via jsonError
    }
  }
</script>

<svelte:head>
  <title>Edit Navigation — {data.site.name} Docs</title>
</svelte:head>

<section class="nav-editor-page">
  <div class="nav-header">
    <div>
      <h1 class="page-title">Navigation Editor</h1>
      <p class="page-desc">
        Edit the sidebar navigation structure as JSON. Each item needs <code>id</code>,
        <code>title</code>, and optionally <code>pageId</code> and <code>children</code>.
      </p>
    </div>
    <a href="/docs/{data.site.slug}/edit" class="back-link">Back to site</a>
  </div>

  {#if form?.error}
    <div class="error-message" role="alert">{form.error}</div>
  {/if}
  {#if form?.success}
    <div class="success-message" role="status">Navigation saved.</div>
  {/if}

  <div class="editor-layout">
    <form method="POST" class="nav-form">
      <div class="editor-header">
        <span class="editor-label">Navigation Structure (JSON)</span>
        <div class="editor-toolbar">
          {#if jsonError}
            <span class="json-error" role="alert">{jsonError}</span>
          {:else}
            <span class="json-valid">Valid JSON</span>
          {/if}
          <button type="button" class="format-btn" onclick={formatJson}>Format</button>
        </div>
      </div>

      <CodeMirrorEditor bind:content={structureText} lang="json" class="nav-json-editor" />
      <input type="hidden" name="structure" value={structureText} />

      <div class="form-actions">
        <Button variant="primary" size="md" type="submit" disabled={!!jsonError}>Save Navigation</Button>
      </div>
    </form>

    <aside class="page-reference">
      <h3 class="ref-title">Available Pages</h3>
      <p class="ref-hint">Use these IDs in the <code>pageId</code> field of nav items.</p>
      {#if data.pages.length > 0}
        <ul class="ref-list">
          {#each data.pages as page}
            <li class="ref-item">
              <code class="ref-id">{page.id}</code>
              <span class="ref-page-info">
                <span class="ref-page-title">{page.title}</span>
                <span class="ref-page-slug">/{page.slug}</span>
              </span>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="ref-empty">No pages yet. Create pages in the site editor first.</p>
      {/if}

      <div class="ref-example">
        <h4 class="ref-example-title">Example structure</h4>
        <pre class="ref-example-code">{`[
  {
    "id": "getting-started",
    "title": "Getting Started",
    "pageId": "<page-uuid>"
  },
  {
    "id": "guides",
    "title": "Guides",
    "children": [
      {
        "id": "setup",
        "title": "Setup",
        "pageId": "<page-uuid>"
      }
    ]
  }
]`}</pre>
      </div>
    </aside>
  </div>
</section>

<style>
  .nav-editor-page {
    max-width: var(--layout-wide-width, 1200px);
    margin: 0 auto;
    padding: var(--space-4, 1rem);
  }

  .nav-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-6, 2rem);
  }

  .page-title {
    font-size: var(--text-xl, 1.5rem);
    margin-bottom: var(--space-1, 0.25rem);
    color: var(--color-text, inherit);
  }

  .page-desc {
    font-size: var(--text-sm, 0.875rem);
    color: var(--color-text-secondary, #6b7280);
  }

  .page-desc code {
    font-size: var(--text-xs, 0.75rem);
    background: var(--color-bg-code, #e5e7eb);
    padding: 0 var(--space-1, 0.25rem);
    border-radius: var(--radius-xs, 0.125rem);
  }

  .back-link {
    font-size: var(--text-sm, 0.875rem);
    color: var(--color-primary, #3b82f6);
    text-decoration: none;
    white-space: nowrap;
  }

  .error-message,
  .success-message {
    padding: var(--space-2, 0.5rem);
    margin-bottom: var(--space-4, 1rem);
    border-radius: var(--radius-sm, 0.25rem);
    font-size: var(--text-sm, 0.875rem);
  }

  .error-message {
    border: 1px solid var(--color-danger, #ef4444);
    color: var(--color-danger, #ef4444);
  }

  .success-message {
    border: 1px solid var(--color-success, #22c55e);
    color: var(--color-success, #22c55e);
  }

  .editor-layout {
    display: grid;
    grid-template-columns: 1fr 20rem;
    gap: var(--space-4, 1rem);
    align-items: start;
  }

  .nav-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-3, 0.75rem);
  }

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .editor-label {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text, inherit);
  }

  .editor-toolbar {
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
  }

  .json-error {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-danger, #ef4444);
    max-width: 20rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .json-valid {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-success, #22c55e);
  }

  .format-btn {
    padding: var(--space-1, 0.25rem) var(--space-2, 0.5rem);
    font-size: var(--text-xs, 0.75rem);
    border: 1px solid var(--color-border, #e5e7eb);
    border-radius: var(--radius-sm, 0.25rem);
    background: var(--color-bg-surface, #fff);
    color: var(--color-text, inherit);
    cursor: pointer;
  }

  .format-btn:hover {
    background: var(--color-bg-hover, #f3f4f6);
  }

  :global(.nav-json-editor) {
    min-height: 24rem;
  }

  .form-actions {
    display: flex;
    gap: var(--space-2, 0.5rem);
  }

  .page-reference {
    padding: var(--space-3, 0.75rem);
    background: var(--color-bg-muted, #f9fafb);
    border-radius: var(--radius-sm, 0.25rem);
    border: 1px solid var(--color-border, #e5e7eb);
  }

  .ref-title {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--font-weight-semibold, 600);
    margin-bottom: var(--space-1, 0.25rem);
    color: var(--color-text, inherit);
  }

  .ref-hint {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-secondary, #6b7280);
    margin-bottom: var(--space-2, 0.5rem);
  }

  .ref-hint code {
    background: var(--color-bg-code, #e5e7eb);
    padding: 0 var(--space-1, 0.25rem);
    border-radius: var(--radius-xs, 0.125rem);
  }

  .ref-list {
    list-style: none;
    padding: 0;
    margin: 0 0 var(--space-3, 0.75rem) 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-1, 0.25rem);
  }

  .ref-item {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    padding: var(--space-1, 0.25rem);
    border-radius: var(--radius-xs, 0.125rem);
  }

  .ref-item:hover {
    background: var(--color-bg-hover, #f3f4f6);
  }

  .ref-id {
    font-size: var(--text-xs, 0.75rem);
    background: var(--color-bg-code, #e5e7eb);
    padding: 0 var(--space-1, 0.25rem);
    border-radius: var(--radius-xs, 0.125rem);
    font-family: var(--font-mono, monospace);
    word-break: break-all;
  }

  .ref-page-info {
    display: flex;
    align-items: baseline;
    gap: var(--space-1, 0.25rem);
  }

  .ref-page-title {
    font-size: var(--text-xs, 0.75rem);
    font-weight: var(--font-weight-medium, 500);
    color: var(--color-text, inherit);
  }

  .ref-page-slug {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-muted, #9ca3af);
    font-family: var(--font-mono, monospace);
  }

  .ref-empty {
    font-size: var(--text-xs, 0.75rem);
    color: var(--color-text-secondary, #6b7280);
    padding: var(--space-2, 0.5rem) 0;
  }

  .ref-example {
    margin-top: var(--space-3, 0.75rem);
    padding-top: var(--space-3, 0.75rem);
    border-top: 1px solid var(--color-border, #e5e7eb);
  }

  .ref-example-title {
    font-size: var(--text-xs, 0.75rem);
    font-weight: var(--font-weight-semibold, 600);
    margin-bottom: var(--space-1, 0.25rem);
    color: var(--color-text-secondary, #6b7280);
  }

  .ref-example-code {
    font-size: var(--text-xs, 0.75rem);
    font-family: var(--font-mono, monospace);
    background: var(--color-bg-code, #e5e7eb);
    padding: var(--space-2, 0.5rem);
    border-radius: var(--radius-sm, 0.25rem);
    overflow-x: auto;
    white-space: pre;
    margin: 0;
  }

  @media (max-width: 768px) {
    .editor-layout {
      grid-template-columns: 1fr;
    }
  }
</style>
